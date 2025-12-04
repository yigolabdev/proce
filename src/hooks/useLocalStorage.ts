/**
 * Custom Hook: useLocalStorage
 * 
 * localStorage를 React state처럼 사용할 수 있는 hook
 * 타입 안전성과 자동 동기화 제공
 */

import { useState, useEffect, useCallback, type Dispatch, type SetStateAction } from 'react'
import { storage } from '../utils/storage'

type SetValue<T> = Dispatch<SetStateAction<T>>

/**
 * localStorage와 동기화된 state hook
 * 
 * @param key - localStorage 키
 * @param initialValue - 초기값 (localStorage에 값이 없을 때 사용)
 * @returns [value, setValue, loading] 튜플
 * 
 * @example
 * const [user, setUser] = useLocalStorage<User>('user', null)
 */
export function useLocalStorage<T>(
	key: string,
	initialValue: T
): [T, SetValue<T>, boolean] {
	const [loading, setLoading] = useState(true)
	const [storedValue, setStoredValue] = useState<T>(initialValue)

	// 초기 로드
	useEffect(() => {
		try {
			const item = storage.get<T>(key)
			if (item !== null && item !== undefined) {
				setStoredValue(item)
			}
		} catch (error) {
			console.error(`Error loading localStorage key "${key}":`, error)
		} finally {
			setLoading(false)
		}
	}, [key])

	// setValue 함수
	const setValue: SetValue<T> = useCallback(
		(value) => {
			try {
				// 함수형 업데이트 지원
				const valueToStore = value instanceof Function ? value(storedValue) : value
				
				setStoredValue(valueToStore)
				storage.set(key, valueToStore)
			} catch (error) {
				console.error(`Error setting localStorage key "${key}":`, error)
			}
		},
		[key, storedValue]
	)

	return [storedValue, setValue, loading]
}

/**
 * localStorage 배열을 관리하는 hook
 * 
 * @example
 * const { items, addItem, removeItem, updateItem, clearItems } = 
 *   useLocalStorageArray<Todo>('todos', [])
 */
export function useLocalStorageArray<T extends { id: string }>(
	key: string,
	initialValue: T[] = []
) {
	const [items, setItems, loading] = useLocalStorage<T[]>(key, initialValue)

	const addItem = useCallback(
		(newItem: T) => {
			setItems((prev) => [newItem, ...prev])
		},
		[setItems]
	)

	const removeItem = useCallback(
		(id: string) => {
			setItems((prev) => prev.filter((item) => item.id !== id))
		},
		[setItems]
	)

	const updateItem = useCallback(
		(id: string, updates: Partial<T>) => {
			setItems((prev) =>
				prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
			)
		},
		[setItems]
	)

	const clearItems = useCallback(() => {
		setItems([])
	}, [setItems])

	const findItem = useCallback(
		(id: string) => {
			return items.find((item) => item.id === id)
		},
		[items]
	)

	return {
		items,
		setItems,
		addItem,
		removeItem,
		updateItem,
		clearItems,
		findItem,
		loading
	}
}

/**
 * localStorage 변경을 다른 탭/창에서도 감지하는 hook
 * 
 * @example
 * useStorageSync('user', (newValue) => {
 *   console.log('User changed in another tab:', newValue)
 * })
 */
export function useStorageSync<T>(
	key: string,
	onSync: (newValue: T | null) => void
) {
	useEffect(() => {
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === key) {
				try {
					const newValue = e.newValue ? JSON.parse(e.newValue) : null
					onSync(newValue)
				} catch (error) {
					console.error('Error parsing storage sync value:', error)
				}
			}
		}

		window.addEventListener('storage', handleStorageChange)
		return () => window.removeEventListener('storage', handleStorageChange)
	}, [key, onSync])
}
