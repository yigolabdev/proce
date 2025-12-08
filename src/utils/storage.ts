/**
 * Storage Utilities
 * 
 * localStorage 관리를 위한 중앙화된 유틸리티
 * - Zod 스키마 기반 타입 검증
 * - 데이터 정합성 보장
 * - Cascade Delete 지원
 */

import { STORAGE_KEYS } from '../types/common.types'
import type { WorkEntry, WorkDraft, Project } from '../types/common.types'
import { parseWorkEntriesFromStorage, serializeWorkEntryForStorage } from './mappers/workEntry.mapper'
import { parseProjectsFromStorage, serializeProjectForStorage } from './mappers/project.mapper'
import { z } from 'zod'
import {
	workEntriesSchema,
	projectsSchema,
	messagesSchema,
	pendingReviewsSchema,
	receivedReviewsSchema,
	workDraftsSchema,
	aiTasksSchema,
	workEntryHistoriesSchema,
	projectMembersSchema,
	type WorkEntryHistory,
	type ProjectMember,
} from '../schemas/data.schemas'

// STORAGE_KEYS를 재export
export { STORAGE_KEYS }

/**
 * 스키마 맵 - 각 키에 대응하는 Zod 스키마
 */
const SCHEMA_MAP: Record<string, z.ZodSchema | undefined> = {
	[STORAGE_KEYS.WORK_ENTRIES]: workEntriesSchema,
	[STORAGE_KEYS.PROJECTS]: projectsSchema,
	[STORAGE_KEYS.MESSAGES]: messagesSchema,
	[STORAGE_KEYS.PENDING_REVIEWS]: pendingReviewsSchema,
	[STORAGE_KEYS.RECEIVED_REVIEWS]: receivedReviewsSchema,
	[STORAGE_KEYS.WORK_DRAFTS]: workDraftsSchema,
	[STORAGE_KEYS.AI_RECOMMENDATIONS]: aiTasksSchema,
	[STORAGE_KEYS.MANUAL_TASKS]: aiTasksSchema,
	'workEntryHistories': workEntryHistoriesSchema,
	'projectMembers': projectMembersSchema,
}

/**
 * 데이터 검증 에러
 */
export class DataValidationError extends Error {
	constructor(
		message: string,
		public key: string,
		public validationErrors?: z.ZodError
	) {
		super(message)
		this.name = 'DataValidationError'
	}
}

/**
 * 타입 안전한 localStorage 래퍼
 * - Zod 스키마 검증
 * - 자동 타입 변환 (Date 등)
 * - 데이터 무결성 보장
 */
class StorageManager {
	/**
	 * 데이터 저장 (스키마 검증 포함)
	 */
	set<T>(key: string, value: T, skipValidation = false): boolean {
		try {
			// 스키마 검증 (있는 경우)
			let validatedValue = value
			const schema = SCHEMA_MAP[key]
			
			if (schema && !skipValidation) {
				try {
					validatedValue = schema.parse(value) as T
				} catch (error) {
					if (error instanceof z.ZodError) {
						throw new DataValidationError(
							`Validation failed for key: ${key}`,
							key,
							error
						)
					}
					throw error
				}
			}
			
			const serialized = JSON.stringify(validatedValue)
			localStorage.setItem(key, serialized)
			return true
		} catch (error) {
			console.error(`Failed to save to localStorage (key: ${key}):`, error)
			if (error instanceof DataValidationError && import.meta.env.DEV) {
				console.error('Validation errors:', error.validationErrors?.format())
			}
			return false
		}
	}

	/**
	 * 데이터 가져오기 (스키마 검증 및 타입 변환 포함)
	 */
	get<T>(key: string, defaultValue?: T, skipValidation = false): T | null {
		try {
			const item = localStorage.getItem(key)
			if (item === null) return defaultValue ?? null
			
			const parsed = JSON.parse(item)
			
			// 스키마 검증 및 타입 변환 (있는 경우)
			const schema = SCHEMA_MAP[key]
			if (schema && !skipValidation) {
				try {
					return schema.parse(parsed) as T
				} catch (error) {
					if (import.meta.env.DEV) {
						console.warn(`Data validation failed for key: ${key}, returning raw data`)
						if (error instanceof z.ZodError) {
							console.warn('Validation errors:', error.format())
						}
					}
					// 검증 실패 시 원본 데이터 반환 (하위 호환성)
					return parsed as T
				}
			}
			
			return parsed as T
		} catch (error) {
			if (import.meta.env.DEV) {
				console.error(`Failed to read from localStorage (key: ${key}):`, error)
			}
			return defaultValue ?? null
		}
	}

	/**
	 * 데이터 삭제
	 */
	remove(key: string): boolean {
		try {
			localStorage.removeItem(key)
			return true
		} catch (error) {
			if (import.meta.env.DEV) {
				console.error(`Failed to remove from localStorage (key: ${key}):`, error)
			}
			return false
		}
	}

	/**
	 * 모든 데이터 삭제
	 */
	clear(): boolean {
		try {
			localStorage.clear()
			return true
		} catch (error) {
			if (import.meta.env.DEV) {
				console.error('Failed to clear localStorage:', error)
			}
			return false
		}
	}

	/**
	 * 키 존재 여부 확인
	 */
	has(key: string): boolean {
		return localStorage.getItem(key) !== null
	}

	/**
	 * 배열에 아이템 추가
	 */
	pushToArray<T>(key: string, item: T): boolean {
		try {
			const array = this.get<T[]>(key, [])
			if (array) {
				array.push(item)
				return this.set(key, array)
			}
			return false
		} catch (error) {
			console.error(`Failed to push to array (key: ${key}):`, error)
			return false
		}
	}

	/**
	 * 배열에서 아이템 제거
	 */
	removeFromArray<T extends { id: string }>(key: string, id: string): boolean {
		try {
			const array = this.get<T[]>(key, [])
			if (array) {
				const filtered = array.filter((item) => item.id !== id)
				return this.set(key, filtered)
			}
			return false
		} catch (error) {
			if (import.meta.env.DEV) {
				console.error(`Failed to remove from array (key: ${key}):`, error)
			}
			return false
		}
	}

	/**
	 * 배열의 아이템 업데이트
	 */
	updateInArray<T extends { id: string }>(key: string, id: string, updates: Partial<T>): boolean {
		try {
			const array = this.get<T[]>(key, [])
			if (array) {
				const updated = array.map((item) =>
					item.id === id ? { ...item, ...updates } : item
				)
				return this.set(key, updated)
			}
			return false
		} catch (error) {
			if (import.meta.env.DEV) {
				console.error(`Failed to update in array (key: ${key}):`, error)
			}
			return false
		}
	}

	/**
	 * 객체 필드 업데이트
	 */
	updateField<T extends Record<string, any>>(
		key: string,
		field: keyof T,
		value: any
	): boolean {
		try {
			const obj = this.get<T>(key)
			if (obj) {
				obj[field] = value
				return this.set(key, obj)
			}
			return false
		} catch (error) {
			if (import.meta.env.DEV) {
				console.error(`Failed to update field (key: ${key}, field: ${String(field)}):`, error)
			}
			return false
		}
	}

	/**
	 * 저장 공간 사용량 확인 (대략적)
	 */
	getUsage(): { used: number; total: number; percentage: number } {
		let used = 0
		for (const key in localStorage) {
			if (localStorage.hasOwnProperty(key)) {
				used += localStorage[key].length + key.length
			}
		}
		
		// 대부분의 브라우저는 5MB 제한
		const total = 5 * 1024 * 1024
		const percentage = (used / total) * 100
		
		return { used, total, percentage }
	}

	/**
	 * 만료 시간이 있는 데이터 저장
	 */
	setWithExpiry<T>(key: string, value: T, ttlInSeconds: number): boolean {
		try {
			const now = new Date()
			const item = {
				value,
				expiry: now.getTime() + ttlInSeconds * 1000,
			}
			return this.set(key, item)
		} catch (error) {
			if (import.meta.env.DEV) {
				console.error(`Failed to save with expiry (key: ${key}):`, error)
			}
			return false
		}
	}

	/**
	 * 만료 시간 확인하며 데이터 가져오기
	 */
	getWithExpiry<T>(key: string): T | null {
		try {
			const itemStr = localStorage.getItem(key)
			if (!itemStr) return null
			
			const item = JSON.parse(itemStr)
			const now = new Date()
			
			if (now.getTime() > item.expiry) {
				localStorage.removeItem(key)
				return null
			}
			
			return item.value as T
		} catch (error) {
			if (import.meta.env.DEV) {
				console.error(`Failed to get with expiry (key: ${key}):`, error)
			}
			return null
		}
	}

	/**
	 * 모든 키 가져오기
	 */
	getAllKeys(): string[] {
		return Object.keys(localStorage)
	}

	/**
	 * 패턴으로 키 검색
	 */
	getKeysByPattern(pattern: RegExp): string[] {
		return this.getAllKeys().filter((key) => pattern.test(key))
	}

	/**
	 * 여러 키의 데이터를 한 번에 가져오기
	 */
	getMultiple<T>(keys: string[]): Record<string, T | null> {
		const result: Record<string, T | null> = {}
		for (const key of keys) {
			result[key] = this.get<T>(key)
		}
		return result
	}

	/**
	 * 여러 키의 데이터를 한 번에 저장
	 */
	setMultiple<T>(data: Record<string, T>): boolean {
		try {
			for (const [key, value] of Object.entries(data)) {
				this.set(key, value)
			}
			return true
		} catch (error) {
			if (import.meta.env.DEV) {
				console.error('Failed to set multiple:', error)
			}
			return false
		}
	}
}

// 싱글톤 인스턴스 export
export const storage = new StorageManager()

// 편의 함수들 - 타입 안전한 버전 (매퍼 통합)

/**
 * WorkEntry 저장 (자동 직렬화)
 */
export const saveWorkEntry = (entry: WorkEntry): boolean => {
	const serialized = serializeWorkEntryForStorage(entry)
	return storage.pushToArray<any>(STORAGE_KEYS.WORK_ENTRIES, serialized)
}

/**
 * WorkEntry 목록 조회 (자동 파싱)
 */
export const getWorkEntries = (): WorkEntry[] => {
	const raw = storage.get<any[]>(STORAGE_KEYS.WORK_ENTRIES, []) || []
	return parseWorkEntriesFromStorage(raw)
}

/**
 * 단일 WorkEntry 조회 (자동 파싱)
 */
export const getWorkEntry = (id: string): WorkEntry | null => {
	const entries = getWorkEntries()
	return entries.find(e => e.id === id) || null
}

/**
 * Draft 저장
 */
export const saveDraft = (draft: WorkDraft): boolean => 
	storage.set<WorkDraft>(STORAGE_KEYS.WORK_DRAFTS, draft)

/**
 * Draft 목록 조회
 */
export const getDrafts = (): WorkDraft[] => 
	storage.get<WorkDraft[]>(STORAGE_KEYS.WORK_DRAFTS, []) || []

/**
 * Project 저장 (자동 직렬화)
 */
export const saveProject = (project: Project): boolean => {
	const serialized = serializeProjectForStorage(project)
	return storage.pushToArray<any>(STORAGE_KEYS.PROJECTS, serialized)
}

/**
 * Project 목록 조회 (자동 파싱)
 */
export const getProjects = (): Project[] => {
	const raw = storage.get<any[]>(STORAGE_KEYS.PROJECTS, []) || []
	return parseProjectsFromStorage(raw)
}

	/**
	 * 단일 Project 조회 (자동 파싱)
	 */
	export const getProject = (id: string): Project | null => {
		const projects = getProjects()
		return projects.find(p => p.id === id) || null
	}

/**
 * 데이터 검증 유틸리티
 */
export class DataValidator {
	/**
	 * WorkEntry 검증
	 */
	static validateWorkEntry(entry: WorkEntry): { valid: boolean; errors: string[] } {
		const errors: string[] = []
		
		// 프로젝트 존재 여부 확인
		if (entry.projectId) {
			const project = getProject(entry.projectId)
			if (!project) {
				errors.push(`Referenced project not found: ${entry.projectId}`)
			}
		}
		
		// 제출자 존재 여부 확인 (간단한 체크)
		if (!entry.submittedById) {
			errors.push('submittedById is required')
		}
		
		// 날짜 유효성 검증
		if (entry.date && isNaN(entry.date.getTime())) {
			errors.push('Invalid date')
		}
		
		return {
			valid: errors.length === 0,
			errors,
		}
	}
	
	/**
	 * Project 검증
	 */
	static validateProject(project: Project): { valid: boolean; errors: string[] } {
		const errors: string[] = []
		
		// 날짜 유효성
		if (project.startDate && isNaN(project.startDate.getTime())) {
			errors.push('Invalid startDate')
		}
		if (project.endDate && isNaN(project.endDate.getTime())) {
			errors.push('Invalid endDate')
		}
		
		// 시작일이 종료일보다 늦은지 확인
		if (project.startDate && project.endDate) {
			if (project.startDate > project.endDate) {
				errors.push('startDate cannot be after endDate')
			}
		}
		
		// 진행률 범위 확인
		if (project.progress < 0 || project.progress > 100) {
			errors.push('progress must be between 0 and 100')
		}
		
		return {
			valid: errors.length === 0,
			errors,
		}
	}
	
	/**
	 * 참조 무결성 검증
	 */
	static checkReferentialIntegrity(): { valid: boolean; issues: Array<{ type: string; message: string }> } {
		const issues: Array<{ type: string; message: string }> = []
		
		// WorkEntry의 projectId 검증
		const entries = getWorkEntries()
		const projects = getProjects()
		const projectIds = new Set(projects.map(p => p.id))
		
		entries.forEach(entry => {
			if (entry.projectId && !projectIds.has(entry.projectId)) {
				issues.push({
					type: 'orphaned_work_entry',
					message: `WorkEntry ${entry.id} references non-existent project ${entry.projectId}`,
				})
			}
		})
		
		return {
			valid: issues.length === 0,
			issues,
		}
	}
}

/**
 * Cascade Delete 유틸리티
 */
export class CascadeDelete {
	/**
	 * 프로젝트 삭제 (연결된 데이터 처리)
	 */
	static deleteProject(projectId: string, options: {
		deleteWorkEntries?: boolean  // true: 연결된 업무도 삭제, false: 연결만 해제
		archiveMessages?: boolean    // 관련 메시지 아카이빙
	} = {
		deleteWorkEntries: false,
		archiveMessages: true,
	}): {
		success: boolean
		deletedCount: {
			projects: number
			workEntries: number
			messages: number
			reviews: number
		}
		errors: string[]
	} {
		const errors: string[] = []
		const deletedCount = {
			projects: 0,
			workEntries: 0,
			messages: 0,
			reviews: 0,
		}
		
		try {
			// 1. 프로젝트 존재 확인
			const project = getProject(projectId)
			if (!project) {
				errors.push(`Project ${projectId} not found`)
				return { success: false, deletedCount, errors }
			}
			
			// 2. 연결된 WorkEntry 처리
			const allEntries = getWorkEntries()
			const relatedEntries = allEntries.filter(e => e.projectId === projectId)
			
			let updatedEntries: WorkEntry[]
			if (options.deleteWorkEntries) {
				// 옵션 A: 업무도 함께 삭제
				updatedEntries = allEntries.filter(e => e.projectId !== projectId)
				deletedCount.workEntries = relatedEntries.length
			} else {
				// 옵션 B: 프로젝트 연결만 해제
				updatedEntries = allEntries.map(e => {
					if (e.projectId === projectId) {
						return {
							...e,
							projectId: undefined,
							projectName: undefined,
						}
					}
					return e
				})
			}
			
			storage.set(STORAGE_KEYS.WORK_ENTRIES, updatedEntries)
			
			// 3. 프로젝트 삭제
			const allProjects = getProjects()
			const updatedProjects = allProjects.filter(p => p.id !== projectId)
			storage.set(STORAGE_KEYS.PROJECTS, updatedProjects)
			deletedCount.projects = 1
			
			// 4. 관련 메시지 처리
			if (options.archiveMessages) {
				const messages = storage.get<any[]>(STORAGE_KEYS.MESSAGES, []) || []
				const updatedMessages = messages.map(msg => {
					if (msg.relatedId === projectId) {
						return { ...msg, isArchived: true }
					}
					return msg
				})
				storage.set(STORAGE_KEYS.MESSAGES, updatedMessages)
			}
			
			// 5. Pending Reviews 처리
			const pendingReviews = storage.get<any[]>(STORAGE_KEYS.PENDING_REVIEWS, []) || []
			const updatedPendingReviews = pendingReviews.filter(r => r.projectId !== projectId)
			deletedCount.reviews += pendingReviews.length - updatedPendingReviews.length
			storage.set(STORAGE_KEYS.PENDING_REVIEWS, updatedPendingReviews)
			
			// 6. Received Reviews 처리
			const receivedReviews = storage.get<any[]>(STORAGE_KEYS.RECEIVED_REVIEWS, []) || []
			const updatedReceivedReviews = receivedReviews.filter(r => r.projectId !== projectId)
			deletedCount.reviews += receivedReviews.length - updatedReceivedReviews.length
			storage.set(STORAGE_KEYS.RECEIVED_REVIEWS, updatedReceivedReviews)
			
			if (import.meta.env.DEV) {
				console.log('Project deleted with cascade:', {
					projectId,
					deletedCount,
					options,
				})
			}
			
			return { success: true, deletedCount, errors }
		} catch (error) {
			errors.push(`Failed to delete project: ${error instanceof Error ? error.message : 'Unknown error'}`)
			return { success: false, deletedCount, errors }
		}
	}
	
	/**
	 * 사용자 삭제 (연결된 데이터 처리)
	 */
	static deleteUser(userId: string): {
		success: boolean
		reassignedCount: number
		errors: string[]
	} {
		const errors: string[] = []
		let reassignedCount = 0
		
		try {
			// WorkEntry의 제출자를 "Deleted User"로 변경
			const allEntries = getWorkEntries()
			const updatedEntries = allEntries.map(e => {
				if (e.submittedById === userId) {
					reassignedCount++
					return {
						...e,
						submittedBy: 'Deleted User',
						submittedByName: 'Deleted User',
					}
				}
				return e
			})
			
			storage.set(STORAGE_KEYS.WORK_ENTRIES, updatedEntries)
			
			return { success: true, reassignedCount, errors }
		} catch (error) {
			errors.push(`Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`)
			return { success: false, reassignedCount, errors }
		}
	}
	
	/**
	 * 오래된 데이터 정리 (아카이빙)
	 */
	static cleanupOldData(daysOld: number = 90): {
		success: boolean
		archivedCount: number
		errors: string[]
	} {
		const errors: string[] = []
		let archivedCount = 0
		
		try {
			const cutoffDate = new Date()
			cutoffDate.setDate(cutoffDate.getDate() - daysOld)
			
			// 오래된 메시지 아카이빙
			const messages = storage.get<any[]>(STORAGE_KEYS.MESSAGES, []) || []
			const updatedMessages = messages.map(msg => {
				const msgDate = new Date(msg.timestamp)
				if (msgDate < cutoffDate && !msg.isArchived) {
					archivedCount++
					return { ...msg, isArchived: true }
				}
				return msg
			})
			
			storage.set(STORAGE_KEYS.MESSAGES, updatedMessages)
			
			if (import.meta.env.DEV) {
				console.log(`Archived ${archivedCount} old messages (older than ${daysOld} days)`)
			}
			
			return { success: true, archivedCount, errors }
		} catch (error) {
			errors.push(`Failed to cleanup old data: ${error instanceof Error ? error.message : 'Unknown error'}`)
			return { success: false, archivedCount, errors }
		}
	}
}

/**
 * 데이터 정합성 복구 유틸리티
 */
export const repairDataIntegrity = (): {
	success: boolean
	repaired: number
	issues: string[]
} => {
	const issues: string[] = []
	let repaired = 0
	
	try {
		// 1. 참조 무결성 검증
		const integrityCheck = DataValidator.checkReferentialIntegrity()
		
		if (!integrityCheck.valid) {
			// 2. WorkEntry의 잘못된 projectId 제거
			const entries = getWorkEntries()
			const projects = getProjects()
			const projectIds = new Set(projects.map(p => p.id))
			
			const repairedEntries = entries.map(entry => {
				if (entry.projectId && !projectIds.has(entry.projectId)) {
					repaired++
					issues.push(`Removed invalid projectId from WorkEntry ${entry.id}`)
					return {
						...entry,
						projectId: undefined,
						projectName: undefined,
					}
				}
				return entry
			})
			
			storage.set(STORAGE_KEYS.WORK_ENTRIES, repairedEntries)
		}
		
		return { success: true, repaired, issues }
	} catch (error) {
		issues.push(`Data repair failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
		return { success: false, repaired, issues }
	}
}

/**
 * Work Entry History Tracking
 * 업무 변경 이력 추적 유틸리티
 */
export class HistoryTracker {
	private static readonly HISTORY_KEY = 'workEntryHistories'
	
	/**
	 * 히스토리 추가
	 */
	static addHistory(history: WorkEntryHistory): boolean {
		try {
			const histories = storage.get<WorkEntryHistory[]>(this.HISTORY_KEY, []) || []
			histories.unshift(history)  // 최신 항목을 앞에
			
			// 최대 1000개까지만 유지 (성능 고려)
			const trimmed = histories.slice(0, 1000)
			
			return storage.set(this.HISTORY_KEY, trimmed)
		} catch (error) {
			console.error('Failed to add history:', error)
			return false
		}
	}
	
	/**
	 * WorkEntry 변경사항 감지 및 히스토리 생성
	 */
	static createHistoryFromChanges(
		oldEntry: WorkEntry,
		newEntry: WorkEntry,
		changedBy: string,
		changedById: string,
		comment?: string
	): WorkEntryHistory {
		const changedFields: Array<{ field: string; oldValue: any; newValue: any }> = []
		
		// 변경된 필드 감지
		const fieldsToCheck: Array<keyof WorkEntry> = [
			'title',
			'description',
			'category',
			'status',
			'projectId',
			'tags',
			'isConfidential',
		]
		
		fieldsToCheck.forEach(field => {
			const oldValue = oldEntry[field]
			const newValue = newEntry[field]
			
			// 배열이나 객체는 JSON 문자열로 비교
			const oldStr = typeof oldValue === 'object' ? JSON.stringify(oldValue) : oldValue
			const newStr = typeof newValue === 'object' ? JSON.stringify(newValue) : newValue
			
			if (oldStr !== newStr) {
				changedFields.push({
					field: String(field),
					oldValue,
					newValue,
				})
			}
		})
		
		return {
			id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			workEntryId: newEntry.id,
			action: 'updated',
			changedFields,
			changedBy,
			changedById,
			changedAt: new Date(),
			comment,
		}
	}
	
	/**
	 * WorkEntry의 히스토리 조회
	 */
	static getHistoryForWorkEntry(workEntryId: string): WorkEntryHistory[] {
		try {
			const histories = storage.get<WorkEntryHistory[]>(this.HISTORY_KEY, []) || []
			return histories.filter(h => h.workEntryId === workEntryId)
		} catch (error) {
			console.error('Failed to get history:', error)
			return []
		}
	}
	
	/**
	 * 전체 히스토리 조회 (최근 N개)
	 */
	static getRecentHistory(limit: number = 50): WorkEntryHistory[] {
		try {
			const histories = storage.get<WorkEntryHistory[]>(this.HISTORY_KEY, []) || []
			return histories.slice(0, limit)
		} catch (error) {
			console.error('Failed to get recent history:', error)
			return []
		}
	}
	
	/**
	 * 히스토리 정리 (오래된 항목 삭제)
	 */
	static cleanupOldHistory(daysOld: number = 90): number {
		try {
			const histories = storage.get<WorkEntryHistory[]>(this.HISTORY_KEY, []) || []
			const cutoffDate = new Date()
			cutoffDate.setDate(cutoffDate.getDate() - daysOld)
			
			const filtered = histories.filter(h => {
				const historyDate = h.changedAt instanceof Date ? h.changedAt : new Date(h.changedAt)
				return historyDate >= cutoffDate
			})
			
			const removedCount = histories.length - filtered.length
			storage.set(this.HISTORY_KEY, filtered)
			
			return removedCount
		} catch (error) {
			console.error('Failed to cleanup history:', error)
			return 0
		}
	}
}

/**
 * Message Threading & Reply Utilities
 * 메시지 스레드 및 답장 유틸리티
 */
export class MessageUtils {
	/**
	 * 답장 메시지 생성
	 */
	static createReply(
		originalMessage: any,
		replyContent: string,
		from: string,
		fromId: string,
		fromDepartment?: string
	): any {
		const replyId = `msg-reply-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
		const threadId = originalMessage.threadId || originalMessage.id
		
		return {
			id: replyId,
			from,
			fromId,
			fromDepartment,
			to: [originalMessage.from],
			toIds: [originalMessage.fromId || originalMessage.from],
			subject: originalMessage.subject.startsWith('Re: ') 
				? originalMessage.subject 
				: `Re: ${originalMessage.subject}`,
			preview: replyContent.substring(0, 100),
			content: replyContent,
			timestamp: new Date(),
			isRead: false,
			isStarred: false,
			isArchived: false,
			type: 'reply' as const,
			priority: originalMessage.priority || 'normal',
			threadId,
			parentId: originalMessage.id,
			replyCount: 0,
		}
	}
	
	/**
	 * 스레드의 모든 메시지 조회
	 */
	static getThreadMessages(threadId: string): any[] {
		try {
			const messages = storage.get<any[]>(STORAGE_KEYS.MESSAGES, []) || []
			
			// 스레드의 원본 메시지 + 모든 답장
			return messages
				.filter(msg => msg.id === threadId || msg.threadId === threadId)
				.sort((a, b) => {
					const aTime = new Date(a.timestamp).getTime()
					const bTime = new Date(b.timestamp).getTime()
					return aTime - bTime  // 오래된 것부터
				})
		} catch (error) {
			console.error('Failed to get thread messages:', error)
			return []
		}
	}
	
	/**
	 * 답장 수 업데이트
	 */
	static updateReplyCount(messageId: string): boolean {
		try {
			const messages = storage.get<any[]>(STORAGE_KEYS.MESSAGES, []) || []
			const threadMessages = messages.filter(
				msg => msg.threadId === messageId || msg.parentId === messageId
			)
			
			const updatedMessages = messages.map(msg => {
				if (msg.id === messageId) {
					return {
						...msg,
						replyCount: threadMessages.length,
					}
				}
				return msg
			})
			
			return storage.set(STORAGE_KEYS.MESSAGES, updatedMessages)
		} catch (error) {
			console.error('Failed to update reply count:', error)
			return false
		}
	}
	
	/**
	 * 메시지에 답장 추가
	 */
	static addReply(
		originalMessageId: string,
		replyContent: string,
		from: string,
		fromId: string,
		fromDepartment?: string
	): { success: boolean; replyId?: string; error?: string } {
		try {
			// 원본 메시지 찾기
			const messages = storage.get<any[]>(STORAGE_KEYS.MESSAGES, []) || []
			const originalMessage = messages.find(msg => msg.id === originalMessageId)
			
			if (!originalMessage) {
				return { success: false, error: 'Original message not found' }
			}
			
			// 답장 생성
			const reply = this.createReply(
				originalMessage,
				replyContent,
				from,
				fromId,
				fromDepartment
			)
			
			// 메시지 목록에 추가
			messages.unshift(reply)
			storage.set(STORAGE_KEYS.MESSAGES, messages)
			
			// 답장 수 업데이트
			this.updateReplyCount(originalMessage.threadId || originalMessageId)
			
			return { success: true, replyId: reply.id }
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			}
		}
	}
	
	/**
	 * 읽음 확인 추가
	 */
	static addReadReceipt(
		messageId: string,
		userId: string,
		userName: string
	): boolean {
		try {
			const messages = storage.get<any[]>(STORAGE_KEYS.MESSAGES, []) || []
			const updatedMessages = messages.map(msg => {
				if (msg.id === messageId) {
					const readBy = msg.readBy || []
					
					// 이미 읽음 확인이 있는지 체크
					if (readBy.some((r: any) => r.userId === userId)) {
						return msg
					}
					
					return {
						...msg,
						isRead: true,
						readBy: [
							...readBy,
							{
								userId,
								userName,
								readAt: new Date(),
							},
						],
					}
				}
				return msg
			})
			
			return storage.set(STORAGE_KEYS.MESSAGES, updatedMessages)
		} catch (error) {
			console.error('Failed to add read receipt:', error)
			return false
		}
	}
}

/**
 * Project Member Management
 * 프로젝트 멤버 관리 유틸리티
 */
export class ProjectMemberManager {
	private static readonly MEMBERS_KEY_PREFIX = 'projectMembers_'
	
	/**
	 * 프로젝트 멤버 키 생성
	 */
	private static getMembersKey(projectId: string): string {
		return `${this.MEMBERS_KEY_PREFIX}${projectId}`
	}
	
	/**
	 * 프로젝트 멤버 조회
	 */
	static getMembers(projectId: string): ProjectMember[] {
		try {
			const key = this.getMembersKey(projectId)
			return storage.get<ProjectMember[]>(key, []) || []
		} catch (error) {
			console.error('Failed to get project members:', error)
			return []
		}
	}
	
	/**
	 * 멤버 추가
	 */
	static addMember(
		projectId: string,
		member: Omit<ProjectMember, 'joinedAt' | 'isActive'>,
		addedBy?: string
	): boolean {
		try {
			const members = this.getMembers(projectId)
			
			// 이미 존재하는지 확인
			if (members.some(m => m.userId === member.userId)) {
				console.warn('Member already exists in project')
				return false
			}
			
			const newMember: ProjectMember = {
				...member,
				joinedAt: new Date(),
				joinedBy: addedBy,
				isActive: true,
			}
			
			members.push(newMember)
			
			const key = this.getMembersKey(projectId)
			return storage.set(key, members)
		} catch (error) {
			console.error('Failed to add project member:', error)
			return false
		}
	}
	
	/**
	 * 멤버 제거
	 */
	static removeMember(projectId: string, userId: string): boolean {
		try {
			const members = this.getMembers(projectId)
			const filtered = members.filter(m => m.userId !== userId)
			
			const key = this.getMembersKey(projectId)
			return storage.set(key, filtered)
		} catch (error) {
			console.error('Failed to remove project member:', error)
			return false
		}
	}
	
	/**
	 * 멤버 역할 변경
	 */
	static updateMemberRole(
		projectId: string,
		userId: string,
		role: ProjectMember['role']
	): boolean {
		try {
			const members = this.getMembers(projectId)
			const updated = members.map(m => 
				m.userId === userId ? { ...m, role } : m
			)
			
			const key = this.getMembersKey(projectId)
			return storage.set(key, updated)
		} catch (error) {
			console.error('Failed to update member role:', error)
			return false
		}
	}
	
	/**
	 * 멤버 권한 확인
	 */
	static hasPermission(
		projectId: string,
		userId: string,
		requiredRole: 'owner' | 'admin' | 'member' | 'viewer'
	): boolean {
		const members = this.getMembers(projectId)
		const member = members.find(m => m.userId === userId)
		
		if (!member || !member.isActive) return false
		
		// 권한 계층: owner > admin > member > viewer
		const roleHierarchy = { owner: 4, admin: 3, member: 2, viewer: 1 }
		return roleHierarchy[member.role] >= roleHierarchy[requiredRole]
	}
}
