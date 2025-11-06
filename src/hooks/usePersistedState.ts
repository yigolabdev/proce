/**
 * usePersistedState Hook
 * 
 * localStorage에 자동으로 저장되는 state hook
 * Error handling과 type safety를 제공합니다.
 * 
 * @example
 * ```typescript
 * // 기본 사용법
 * const [user, setUser] = usePersistedState<User>('user', initialUser)
 * 
 * // 배열 사용
 * const [items, setItems] = usePersistedState<Item[]>('items', [])
 * 
 * // 객체 사용
 * const [settings, setSettings] = usePersistedState<Settings>('settings', defaultSettings)
 * ```
 */

import { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react'
import { safeGetItem, safeSetItem } from '../utils/safeStorage'

export function usePersistedState<T>(
	key: string,
	initialValue: T,
	options?: {
		showToast?: boolean
		onError?: (error: Error) => void
	}
): [T, Dispatch<SetStateAction<T>>] {
	// Initialize state with value from localStorage or initial value
	const [value, setValue] = useState<T>(() => {
		const stored = safeGetItem<T>(key)
		return stored !== null ? stored : initialValue
	})

	// Update localStorage whenever value changes
	useEffect(() => {
		const success = safeSetItem(key, value, options?.showToast)
		
		if (!success && options?.onError) {
			options.onError(new Error(`Failed to persist state for key: ${key}`))
		}
	}, [key, value, options?.showToast, options?.onError])

	// Sync with other tabs/windows
	useEffect(() => {
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === key && e.newValue !== null) {
				try {
					const newValue = JSON.parse(e.newValue) as T
					setValue(newValue)
				} catch (error) {
					console.error(`Failed to sync storage for key "${key}":`, error)
				}
			}
		}

		window.addEventListener('storage', handleStorageChange)
		return () => window.removeEventListener('storage', handleStorageChange)
	}, [key])

	return [value, setValue]
}

/**
 * usePersistedArray Hook
 * 
 * 배열을 localStorage에 저장하는 특화된 hook
 * 배열 조작을 위한 헬퍼 함수들을 제공합니다.
 */
export function usePersistedArray<T extends { id: string }>(
	key: string,
	initialValue: T[] = []
) {
	const [items, setItems] = usePersistedState<T[]>(key, initialValue)

	const addItem = useCallback((item: T) => {
		setItems(prev => [...prev, item])
	}, [setItems])

	const updateItem = useCallback((id: string, updates: Partial<T>) => {
		setItems(prev => 
			prev.map(item => item.id === id ? { ...item, ...updates } : item)
		)
	}, [setItems])

	const removeItem = useCallback((id: string) => {
		setItems(prev => prev.filter(item => item.id !== id))
	}, [setItems])

	const findItem = useCallback((id: string): T | undefined => {
		return items.find(item => item.id === id)
	}, [items])

	const clearItems = useCallback(() => {
		setItems([])
	}, [setItems])

	return {
		items,
		setItems,
		addItem,
		updateItem,
		removeItem,
		findItem,
		clearItems,
	}
}

/**
 * usePersistedObject Hook
 * 
 * 객체를 localStorage에 저장하는 특화된 hook
 * Partial update를 지원합니다.
 */
export function usePersistedObject<T extends Record<string, any>>(
	key: string,
	initialValue: T
) {
	const [object, setObject] = usePersistedState<T>(key, initialValue)

	const updateField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
		setObject(prev => ({ ...prev, [field]: value }))
	}, [setObject])

	const updateFields = useCallback((updates: Partial<T>) => {
		setObject(prev => ({ ...prev, ...updates }))
	}, [setObject])

	const resetObject = useCallback(() => {
		setObject(initialValue)
	}, [setObject, initialValue])

	return {
		object,
		setObject,
		updateField,
		updateFields,
		resetObject,
	}
}

export default usePersistedState

