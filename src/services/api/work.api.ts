/**
 * Work Entry API Service
 * 
 * 작업 기록 관련 API 호출
 */

import { api } from './base.api'
import { storage } from '../../utils/storage'
import type {
	CreateWorkEntryDto,
	UpdateWorkEntryDto,
	WorkEntryFilters,
	PaginationParams,
	PaginatedResponse,
} from '../../types/api.types'
import type { WorkEntry, WorkDraft } from '../../types/common.types'

/**
 * Work Entry API
 */
export const workApi = {
	/**
	 * 작업 목록 조회 (페이지네이션)
	 */
	async getWorkEntries(params?: PaginationParams & WorkEntryFilters): Promise<PaginatedResponse<WorkEntry>> {
		// 개발 환경: localStorage 사용
		if (import.meta.env.DEV) {
			const entries = storage.get<WorkEntry[]>('workEntries') || []
			const { page = 1, limit = 20 } = params || {}
			
			// 필터링
			let filtered = entries
			if (params?.filters) {
				const filters = params.filters as WorkEntryFilters
				if (filters.startDate) {
					filtered = filtered.filter(e => new Date(e.date) >= new Date(filters.startDate!))
				}
				if (filters.endDate) {
					filtered = filtered.filter(e => new Date(e.date) <= new Date(filters.endDate!))
				}
				if (filters.category) {
					filtered = filtered.filter(e => e.category === filters.category)
				}
				if (filters.projectId) {
					filtered = filtered.filter(e => e.projectId === filters.projectId)
				}
				if (filters.status) {
					filtered = filtered.filter(e => e.status === filters.status)
				}
			}

			// 페이지네이션
			const start = (page - 1) * limit
			const end = start + limit
			const paginatedData = filtered.slice(start, end)

			return {
				data: paginatedData,
				pagination: {
					page,
					limit,
					total: filtered.length,
					totalPages: Math.ceil(filtered.length / limit),
					hasNext: end < filtered.length,
					hasPrev: page > 1,
				},
			}
		}

		// 프로덕션: 실제 API 호출
		return api.getPaginated<WorkEntry>('/work-entries', params)
	},

	/**
	 * 특정 작업 조회
	 */
	async getWorkEntry(id: string): Promise<WorkEntry> {
		if (import.meta.env.DEV) {
			const entries = storage.get<WorkEntry[]>('workEntries') || []
			const entry = entries.find(e => e.id === id)
			if (!entry) throw new Error('Work entry not found')
			return entry
		}

		return api.get<WorkEntry>(`/work-entries/${id}`)
	},

	/**
	 * 작업 생성
	 */
	async createWorkEntry(data: CreateWorkEntryDto): Promise<WorkEntry> {
		if (import.meta.env.DEV) {
			const entries = storage.get<WorkEntry[]>('workEntries') || []
			const newEntry: WorkEntry = {
				id: `work-${Date.now()}`,
				title: data.title,
				description: data.description,
				category: data.category,
				duration: data.duration || '',
				date: new Date(),
				projectId: data.projectId,
				objectiveId: data.objectiveId,
				tags: data.tags,
				status: 'submitted',
				createdAt: new Date(),
				updatedAt: new Date(),
			}
			entries.push(newEntry)
			storage.set('workEntries', entries)
			return newEntry
		}

		return api.post<WorkEntry, CreateWorkEntryDto>('/work-entries', data)
	},

	/**
	 * 작업 업데이트
	 */
	async updateWorkEntry(id: string, data: UpdateWorkEntryDto): Promise<WorkEntry> {
		if (import.meta.env.DEV) {
			const entries = storage.get<WorkEntry[]>('workEntries') || []
			const index = entries.findIndex(e => e.id === id)
			if (index === -1) throw new Error('Work entry not found')
			
			const updated: WorkEntry = {
				...entries[index],
				title: data.title || entries[index].title,
				description: data.description || entries[index].description,
				category: data.category || entries[index].category,
				duration: data.duration || entries[index].duration,
				projectId: data.projectId !== undefined ? data.projectId : entries[index].projectId,
				objectiveId: data.objectiveId !== undefined ? data.objectiveId : entries[index].objectiveId,
				tags: data.tags !== undefined ? data.tags : entries[index].tags,
				status: data.status || entries[index].status,
				updatedAt: new Date(),
			}
			entries[index] = updated
			storage.set('workEntries', entries)
			return updated
		}

		return api.put<WorkEntry, UpdateWorkEntryDto>(`/work-entries/${id}`, data)
	},

	/**
	 * 작업 삭제
	 */
	async deleteWorkEntry(id: string): Promise<void> {
		if (import.meta.env.DEV) {
			const entries = storage.get<WorkEntry[]>('workEntries') || []
			const filtered = entries.filter(e => e.id !== id)
			storage.set('workEntries', filtered)
			return
		}

		await api.delete(`/work-entries/${id}`)
	},

	/**
	 * 내 작업 목록 조회
	 */
	async getMyWorkEntries(params?: PaginationParams & WorkEntryFilters): Promise<PaginatedResponse<WorkEntry>> {
		const user = storage.get<any>('auth_user')
		if (!user) throw new Error('User not authenticated')

		return this.getWorkEntries({
			...params,
			filters: {
				...params?.filters,
				submittedBy: user.id,
			},
		})
	},

	/**
	 * 작업 초안 저장
	 */
	async saveDraft(data: Partial<CreateWorkEntryDto>): Promise<WorkDraft> {
		if (import.meta.env.DEV) {
			const drafts = storage.get<WorkDraft[]>('work_drafts') || []
			const existingIndex = drafts.findIndex(d => d.id === 'current-draft')
			
			const draft: WorkDraft = {
				id: 'current-draft',
				title: data.title ?? '',
				description: data.description ?? '',
				category: data.category ?? '',
				duration: data.duration,
				projectId: data.projectId,
				objectiveId: data.objectiveId,
				tags: data.tags,
				savedAt: new Date(),
			}

			if (existingIndex >= 0) {
				drafts[existingIndex] = draft
			} else {
				drafts.push(draft)
			}
			
			storage.set('work_drafts', drafts)
			return draft
		}

		return api.post<WorkDraft, Partial<CreateWorkEntryDto>>('/work-entries/drafts', data)
	},

	/**
	 * 작업 초안 조회
	 */
	async getDraft(): Promise<WorkDraft | null> {
		if (import.meta.env.DEV) {
			const drafts = storage.get<WorkDraft[]>('work_drafts') || []
			return drafts.find(d => d.id === 'current-draft') || null
		}

		return api.get<WorkDraft>('/work-entries/drafts/current')
	},

	/**
	 * 작업 초안 삭제
	 */
	async deleteDraft(): Promise<void> {
		if (import.meta.env.DEV) {
			const drafts = storage.get<WorkDraft[]>('work_drafts') || []
			const filtered = drafts.filter(d => d.id !== 'current-draft')
			storage.set('work_drafts', filtered)
			return
		}

		await api.delete('/work-entries/drafts/current')
	},
}

