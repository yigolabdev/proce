/**
 * Data Service Layer
 * LocalStorage와 API를 추상화한 통합 데이터 레이어
 */

import { apiClient } from './client.api'
import { API_ENDPOINTS } from './config.api'
import { storage } from '../../utils/storage'
import type { WorkEntry, Project, PendingReview, ReceivedReview } from '../../types/common.types'
import type { Message } from '../../schemas/data.schemas'
import type { ApiResponse, PaginationParams, FilterParams } from './config.api'

/**
 * 데이터 소스 타입
 */
export type DataSource = 'api' | 'local'

/**
 * 데이터 서비스 설정
 */
interface DataServiceConfig {
	source: DataSource
	cacheEnabled: boolean
	syncInterval?: number // 밀리초
}

/**
 * 기본 설정
 */
const DEFAULT_CONFIG: DataServiceConfig = {
	source: import.meta.env.VITE_USE_API === 'true' ? 'api' : 'local',
	cacheEnabled: true,
	syncInterval: 30000, // 30초
}

/**
 * 통합 데이터 서비스
 */
export class DataService {
	private config: DataServiceConfig
	private syncTimers: Map<string, NodeJS.Timeout>

	constructor(config: Partial<DataServiceConfig> = {}) {
		this.config = { ...DEFAULT_CONFIG, ...config }
		this.syncTimers = new Map()
	}

	/**
	 * 데이터 소스 전환
	 */
	public setDataSource(source: DataSource): void {
		this.config.source = source
		
		// 소스 변경 시 캐시 무효화
		if (source === 'api') {
			apiClient.invalidateCache()
		}
	}

	/**
	 * 현재 데이터 소스 확인
	 */
	public getDataSource(): DataSource {
		return this.config.source
	}

	/**
	 * API 사용 여부
	 */
	private useAPI(): boolean {
		return this.config.source === 'api'
	}

	// ==================== Work Entries ====================

	/**
	 * 업무 목록 조회
	 */
	async getWorkEntries(params?: PaginationParams & FilterParams): Promise<WorkEntry[]> {
		if (this.useAPI()) {
			try {
				const response = await apiClient.get<WorkEntry[]>(API_ENDPOINTS.workEntries.list, { params })
				return response.data
			} catch (error) {
				console.error('Failed to fetch work entries from API:', error)
				// Fallback to local storage
				return storage.get<WorkEntry[]>('workEntries') || []
			}
		}

		return storage.get<WorkEntry[]>('workEntries') || []
	}

	/**
	 * 업무 단건 조회
	 */
	async getWorkEntry(id: string): Promise<WorkEntry | null> {
		if (this.useAPI()) {
			try {
				const response = await apiClient.get<WorkEntry>(API_ENDPOINTS.workEntries.get(id))
				return response.data
			} catch (error) {
				console.error('Failed to fetch work entry from API:', error)
				const entries = storage.get<WorkEntry[]>('workEntries') || []
				return entries.find(e => e.id === id) || null
			}
		}

		const entries = storage.get<WorkEntry[]>('workEntries') || []
		return entries.find(e => e.id === id) || null
	}

	/**
	 * 업무 생성
	 */
	async createWorkEntry(entry: Omit<WorkEntry, 'id'>): Promise<WorkEntry> {
		if (this.useAPI()) {
			try {
				const response = await apiClient.post<WorkEntry>(API_ENDPOINTS.workEntries.create, entry)
				
				// Local storage에도 저장 (오프라인 지원)
				const entries = storage.get<WorkEntry[]>('workEntries') || []
				entries.unshift(response.data)
				storage.set('workEntries', entries)
				
				apiClient.invalidateCache('work-entries')
				return response.data
			} catch (error) {
				console.error('Failed to create work entry via API:', error)
				throw error
			}
		}

		// Local storage에 저장
		const newEntry: WorkEntry = {
			...entry,
			id: `work-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
		} as WorkEntry

		const entries = storage.get<WorkEntry[]>('workEntries') || []
		entries.unshift(newEntry)
		storage.set('workEntries', entries)

		return newEntry
	}

	/**
	 * 업무 수정
	 */
	async updateWorkEntry(id: string, updates: Partial<WorkEntry>): Promise<WorkEntry> {
		if (this.useAPI()) {
			try {
				const response = await apiClient.patch<WorkEntry>(API_ENDPOINTS.workEntries.update(id), updates)
				
				// Local storage 업데이트
				const entries = storage.get<WorkEntry[]>('workEntries') || []
				const index = entries.findIndex(e => e.id === id)
				if (index !== -1) {
					entries[index] = response.data
					storage.set('workEntries', entries)
				}
				
				apiClient.invalidateCache('work-entries')
				return response.data
			} catch (error) {
				console.error('Failed to update work entry via API:', error)
				throw error
			}
		}

		// Local storage 업데이트
		const entries = storage.get<WorkEntry[]>('workEntries') || []
		const index = entries.findIndex(e => e.id === id)
		
		if (index === -1) {
			throw new Error(`Work entry not found: ${id}`)
		}

		entries[index] = { ...entries[index], ...updates }
		storage.set('workEntries', entries)

		return entries[index]
	}

	/**
	 * 업무 삭제
	 */
	async deleteWorkEntry(id: string): Promise<boolean> {
		if (this.useAPI()) {
			try {
				await apiClient.delete(API_ENDPOINTS.workEntries.delete(id))
				
				// Local storage에서도 삭제
				const entries = storage.get<WorkEntry[]>('workEntries') || []
				const filtered = entries.filter(e => e.id !== id)
				storage.set('workEntries', filtered)
				
				apiClient.invalidateCache('work-entries')
				return true
			} catch (error) {
				console.error('Failed to delete work entry via API:', error)
				throw error
			}
		}

		// Local storage에서 삭제
		const entries = storage.get<WorkEntry[]>('workEntries') || []
		const filtered = entries.filter(e => e.id !== id)
		storage.set('workEntries', filtered)

		return true
	}

	// ==================== Projects ====================

	/**
	 * 프로젝트 목록 조회
	 */
	async getProjects(params?: PaginationParams & FilterParams): Promise<Project[]> {
		if (this.useAPI()) {
			try {
				const response = await apiClient.get<Project[]>(API_ENDPOINTS.projects.list, { params })
				return response.data
			} catch (error) {
				console.error('Failed to fetch projects from API:', error)
				return storage.get<Project[]>('projects') || []
			}
		}

		return storage.get<Project[]>('projects') || []
	}

	/**
	 * 프로젝트 생성
	 */
	async createProject(project: Omit<Project, 'id'>): Promise<Project> {
		if (this.useAPI()) {
			try {
				const response = await apiClient.post<Project>(API_ENDPOINTS.projects.create, project)
				
				const projects = storage.get<Project[]>('projects') || []
				projects.unshift(response.data)
				storage.set('projects', projects)
				
				apiClient.invalidateCache('projects')
				return response.data
			} catch (error) {
				console.error('Failed to create project via API:', error)
				throw error
			}
		}

		const newProject: Project = {
			...project,
			id: `proj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
		} as Project

		const projects = storage.get<Project[]>('projects') || []
		projects.unshift(newProject)
		storage.set('projects', projects)

		return newProject
	}

	/**
	 * 프로젝트 수정
	 */
	async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
		if (this.useAPI()) {
			try {
				const response = await apiClient.patch<Project>(API_ENDPOINTS.projects.update(id), updates)
				
				const projects = storage.get<Project[]>('projects') || []
				const index = projects.findIndex(p => p.id === id)
				if (index !== -1) {
					projects[index] = response.data
					storage.set('projects', projects)
				}
				
				apiClient.invalidateCache('projects')
				return response.data
			} catch (error) {
				console.error('Failed to update project via API:', error)
				throw error
			}
		}

		const projects = storage.get<Project[]>('projects') || []
		const index = projects.findIndex(p => p.id === id)
		
		if (index === -1) {
			throw new Error(`Project not found: ${id}`)
		}

		projects[index] = { ...projects[index], ...updates }
		storage.set('projects', projects)

		return projects[index]
	}

	/**
	 * 프로젝트 삭제
	 */
	async deleteProject(id: string): Promise<boolean> {
		if (this.useAPI()) {
			try {
				await apiClient.delete(API_ENDPOINTS.projects.delete(id))
				
				const projects = storage.get<Project[]>('projects') || []
				const filtered = projects.filter(p => p.id !== id)
				storage.set('projects', filtered)
				
				apiClient.invalidateCache('projects')
				return true
			} catch (error) {
				console.error('Failed to delete project via API:', error)
				throw error
			}
		}

		const projects = storage.get<Project[]>('projects') || []
		const filtered = projects.filter(p => p.id !== id)
		storage.set('projects', filtered)

		return true
	}

	// ==================== Messages ====================

	/**
	 * 메시지 목록 조회
	 */
	async getMessages(params?: PaginationParams & FilterParams): Promise<Message[]> {
		if (this.useAPI()) {
			try {
				const response = await apiClient.get<Message[]>(API_ENDPOINTS.messages.list, { params })
				return response.data
			} catch (error) {
				console.error('Failed to fetch messages from API:', error)
				return storage.get<Message[]>('messages') || []
			}
		}

		return storage.get<Message[]>('messages') || []
	}

	/**
	 * 메시지 생성
	 */
	async createMessage(message: Omit<Message, 'id'>): Promise<Message> {
		if (this.useAPI()) {
			try {
				const response = await apiClient.post<Message>(API_ENDPOINTS.messages.create, message)
				
				const messages = storage.get<Message[]>('messages') || []
				messages.unshift(response.data)
				storage.set('messages', messages)
				
				apiClient.invalidateCache('messages')
				return response.data
			} catch (error) {
				console.error('Failed to create message via API:', error)
				throw error
			}
		}

		const newMessage: Message = {
			...message,
			id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
		} as Message

		const messages = storage.get<Message[]>('messages') || []
		messages.unshift(newMessage)
		storage.set('messages', messages)

		return newMessage
	}

	// ==================== Reviews ====================

	/**
	 * 검토 대기 목록 조회
	 */
	async getPendingReviews(): Promise<PendingReview[]> {
		if (this.useAPI()) {
			try {
				const response = await apiClient.get<PendingReview[]>(API_ENDPOINTS.reviews.pending)
				return response.data
			} catch (error) {
				console.error('Failed to fetch pending reviews from API:', error)
				return storage.get<PendingReview[]>('pending_reviews') || []
			}
		}

		return storage.get<PendingReview[]>('pending_reviews') || []
	}

	/**
	 * 받은 검토 목록 조회
	 */
	async getReceivedReviews(): Promise<ReceivedReview[]> {
		if (this.useAPI()) {
			try {
				const response = await apiClient.get<ReceivedReview[]>(API_ENDPOINTS.reviews.received)
				return response.data
			} catch (error) {
				console.error('Failed to fetch received reviews from API:', error)
				return storage.get<ReceivedReview[]>('received_reviews') || []
			}
		}

		return storage.get<ReceivedReview[]>('received_reviews') || []
	}
}

/**
 * 싱글톤 인스턴스
 */
export const dataService = new DataService()

