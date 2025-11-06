/**
 * Safe Storage Utilities
 * 
 * localStorage 작업을 안전하게 수행하는 유틸리티 함수들
 * Error handling과 type safety를 제공합니다.
 */

import { toast } from 'sonner'
import type { StorageTypeMap } from '../types/common.types'

export interface StorageResult<T> {
	success: boolean
	data?: T
	error?: Error
}

/**
 * localStorage에서 데이터를 안전하게 가져옵니다
 */
export function safeGetItem<T>(key: string, defaultValue?: T): T | null {
	try {
		const item = localStorage.getItem(key)
		if (!item) {
			return defaultValue || null
		}
		
		const parsed = JSON.parse(item) as T
		return parsed
	} catch (error) {
		console.error(`Failed to get item "${key}" from localStorage:`, error)
		return defaultValue || null
	}
}

/**
 * localStorage에 데이터를 안전하게 저장합니다
 */
export function safeSetItem<T>(key: string, value: T, showToast = false): boolean {
	try {
		const serialized = JSON.stringify(value)
		localStorage.setItem(key, serialized)
		return true
	} catch (error) {
		console.error(`Failed to set item "${key}" in localStorage:`, error)
		if (showToast) {
			toast.error('Failed to save data')
		}
		return false
	}
}

/**
 * localStorage에서 데이터를 안전하게 제거합니다
 */
export function safeRemoveItem(key: string): boolean {
	try {
		localStorage.removeItem(key)
		return true
	} catch (error) {
		console.error(`Failed to remove item "${key}" from localStorage:`, error)
		return false
	}
}

/**
 * localStorage를 안전하게 비웁니다
 */
export function safeClearStorage(): boolean {
	try {
		localStorage.clear()
		return true
	} catch (error) {
		console.error('Failed to clear localStorage:', error)
		return false
	}
}

/**
 * localStorage의 사용 가능 여부를 확인합니다
 */
export function isStorageAvailable(): boolean {
	try {
		const test = '__storage_test__'
		localStorage.setItem(test, test)
		localStorage.removeItem(test)
		return true
	} catch {
		return false
	}
}

/**
 * localStorage 데이터를 안전하게 업데이트합니다 (partial update)
 */
export function safeUpdateItem<T extends object>(
	key: string,
	updates: Partial<T>,
	showToast = false
): boolean {
	try {
		const existing = safeGetItem<T>(key)
		if (!existing) {
			console.warn(`Item "${key}" not found, cannot update`)
			return false
		}
		
		const updated = { ...existing, ...updates }
		return safeSetItem(key, updated, showToast)
	} catch (error) {
		console.error(`Failed to update item "${key}":`, error)
		if (showToast) {
			toast.error('Failed to update data')
		}
		return false
	}
}

/**
 * localStorage 데이터를 배열로 가져오고 안전하게 처리합니다
 */
export function safeGetArray<T>(key: string): T[] {
	const data = safeGetItem<T[]>(key)
	return Array.isArray(data) ? data : []
}

/**
 * localStorage에 배열을 안전하게 추가합니다
 */
export function safeAppendToArray<T>(
	key: string,
	item: T,
	showToast = false
): boolean {
	try {
		const existing = safeGetArray<T>(key)
		const updated = [...existing, item]
		return safeSetItem(key, updated, showToast)
	} catch (error) {
		console.error(`Failed to append to array "${key}":`, error)
		if (showToast) {
			toast.error('Failed to add item')
		}
		return false
	}
}

/**
 * localStorage 배열에서 조건에 맞는 항목을 제거합니다
 */
export function safeRemoveFromArray<T>(
	key: string,
	predicate: (item: T) => boolean,
	showToast = false
): boolean {
	try {
		const existing = safeGetArray<T>(key)
		const updated = existing.filter(item => !predicate(item))
		return safeSetItem(key, updated, showToast)
	} catch (error) {
		console.error(`Failed to remove from array "${key}":`, error)
		if (showToast) {
			toast.error('Failed to remove item')
		}
		return false
	}
}

/**
 * Type-safe storage accessor for known storage keys
 * 타입 안전성이 보장되는 localStorage 접근자
 */
export function getTypedItem<K extends keyof StorageTypeMap>(
	key: K
): StorageTypeMap[K] | null {
	return safeGetItem<StorageTypeMap[K]>(key)
}

/**
 * Type-safe storage setter for known storage keys
 */
export function setTypedItem<K extends keyof StorageTypeMap>(
	key: K,
	value: StorageTypeMap[K],
	showToast = false
): boolean {
	return safeSetItem(key, value, showToast)
}

/**
 * Type-safe array getter for known storage keys
 */
export function getTypedArray<K extends keyof StorageTypeMap>(
	key: K
): StorageTypeMap[K] extends Array<infer T> ? T[] : never {
	const data = safeGetItem<any>(key)
	return (Array.isArray(data) ? data : []) as any
}

/**
 * StorageManager class for centralized storage operations
 * 중앙화된 storage 관리 클래스
 */
export class StorageManager {
	/**
	 * Get typed data from localStorage
	 */
	get<K extends keyof StorageTypeMap>(key: K): StorageTypeMap[K] | null {
		return getTypedItem(key)
	}

	/**
	 * Set typed data to localStorage
	 */
	set<K extends keyof StorageTypeMap>(
		key: K,
		value: StorageTypeMap[K],
		showToast = false
	): boolean {
		return setTypedItem(key, value, showToast)
	}

	/**
	 * Get array from localStorage
	 */
	getArray<K extends keyof StorageTypeMap>(
		key: K
	): StorageTypeMap[K] extends Array<infer T> ? T[] : never {
		return getTypedArray(key)
	}

	/**
	 * Update partial data
	 */
	update<K extends keyof StorageTypeMap>(
		key: K,
		updates: Partial<StorageTypeMap[K]>,
		showToast = false
	): boolean {
		return safeUpdateItem(key, updates as any, showToast)
	}

	/**
	 * Remove item from storage
	 */
	remove(key: string): boolean {
		return safeRemoveItem(key)
	}

	/**
	 * Clear all storage
	 */
	clear(): boolean {
		return safeClearStorage()
	}

	/**
	 * Check if storage is available
	 */
	isAvailable(): boolean {
		return isStorageAvailable()
	}
}

// Export singleton instance
export const storage = new StorageManager()

export default {
	get: safeGetItem,
	set: safeSetItem,
	remove: safeRemoveItem,
	clear: safeClearStorage,
	isAvailable: isStorageAvailable,
	update: safeUpdateItem,
	getArray: safeGetArray,
	appendToArray: safeAppendToArray,
	removeFromArray: safeRemoveFromArray,
	// New type-safe methods
	getTyped: getTypedItem,
	setTyped: setTypedItem,
	getTypedArray: getTypedArray,
	storage,
}
