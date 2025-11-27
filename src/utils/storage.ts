/**
 * Storage Utilities
 * 
 * localStorage 관리를 위한 중앙화된 유틸리티
 * common.types.ts의 STORAGE_KEYS를 재export
 */

import { STORAGE_KEYS } from '../types/common.types'
import type { WorkEntry, WorkDraft, Project } from '../types/common.types'
import { parseWorkEntriesFromStorage, serializeWorkEntryForStorage } from './mappers/workEntry.mapper'
import { parseProjectsFromStorage, serializeProjectForStorage } from './mappers/project.mapper'

// STORAGE_KEYS를 재export
export { STORAGE_KEYS }

/**
 * 타입 안전한 localStorage 래퍼
 */
class StorageManager {
	/**
	 * 데이터 저장
	 */
	set<T>(key: string, value: T): boolean {
		try {
			const serialized = JSON.stringify(value)
			localStorage.setItem(key, serialized)
			return true
		} catch (error) {
			console.error(`Failed to save to localStorage (key: ${key}):`, error)
			return false
		}
	}

	/**
	 * 데이터 가져오기
	 */
	get<T>(key: string, defaultValue?: T): T | null {
		try {
			const item = localStorage.getItem(key)
			if (item === null) return defaultValue ?? null
			return JSON.parse(item) as T
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

