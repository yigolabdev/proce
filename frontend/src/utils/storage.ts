/**
 * Storage Utilities
 * 
 * localStorage 관리를 위한 중앙화된 유틸리티
 */

/**
 * Storage 키 상수
 */
export const STORAGE_KEYS = {
	// Auth
	AUTH_USER: 'auth_user',
	AUTH_TOKEN: 'auth_token',
	
	// User Data
	USER_PROFILE: 'user_profile',
	USER_SETTINGS: 'user_settings',
	USER_PREFERENCES: 'user_preferences',
	
	// Work
	WORK_ENTRIES: 'work_entries',
	WORK_DRAFTS: 'work_drafts',
	WORK_CATEGORIES: 'work_categories',
	WORK_TAGS: 'work_tags',
	WORK_TEMPLATES: 'work_templates',
	
	// Projects
	PROJECTS: 'projects',
	
	// OKR
	OKRS: 'okrs',
	
	// Financial
	FINANCIAL_RECORDS: 'financial_records',
	FINANCIAL_DOCUMENTS: 'financial_documents',
	
	// Expenses
	EXPENSES: 'expenses',
	
	// Company
	COMPANY_INFO: 'company_info',
	COMPANY_KPIS: 'company_kpis',
	
	// Departments
	DEPARTMENTS: 'departments',
	
	// Users
	USERS: 'users',
	
	// Messages
	MESSAGES: 'messages',
	AI_RECOMMENDATIONS: 'ai_recommendations',
	
	// Goals
	ANNUAL_GOALS: 'annualGoals',
	
	// System
	SYSTEM_SETTINGS: 'system_settings',
	
	// Notifications
	NOTIFICATIONS: 'notifications',
} as const

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
			console.error(`Failed to read from localStorage (key: ${key}):`, error)
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
			console.error(`Failed to remove from localStorage (key: ${key}):`, error)
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
			console.error('Failed to clear localStorage:', error)
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
			console.error(`Failed to remove from array (key: ${key}):`, error)
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
			console.error(`Failed to update in array (key: ${key}):`, error)
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
			console.error(`Failed to update field (key: ${key}, field: ${String(field)}):`, error)
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
			console.error(`Failed to save with expiry (key: ${key}):`, error)
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
			console.error(`Failed to get with expiry (key: ${key}):`, error)
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
			console.error('Failed to set multiple:', error)
			return false
		}
	}
}

// 싱글톤 인스턴스 export
export const storage = new StorageManager()

// 편의 함수들
export const saveWorkEntry = (entry: any) => storage.pushToArray(STORAGE_KEYS.WORK_ENTRIES, entry)
export const getWorkEntries = () => storage.get<any[]>(STORAGE_KEYS.WORK_ENTRIES, [])
export const saveDraft = (draft: any) => storage.set(STORAGE_KEYS.WORK_DRAFTS, draft)
export const getDrafts = () => storage.get<any[]>(STORAGE_KEYS.WORK_DRAFTS, [])
export const saveProject = (project: any) => storage.pushToArray(STORAGE_KEYS.PROJECTS, project)
export const getProjects = () => storage.get<any[]>(STORAGE_KEYS.PROJECTS, [])

