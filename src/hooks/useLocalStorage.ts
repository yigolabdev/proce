/**
 * useLocalStorage Hook
 * 
 * localStorage를 React 상태처럼 사용할 수 있는 커스텀 훅
 */

import { useState, useEffect, useCallback } from 'react'
import { storage } from '../utils/storage'

export function useLocalStorage<T>(
	key: string,
	initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
	// 초기 상태 설정
	const [storedValue, setStoredValue] = useState<T>(() => {
		try {
			const item = storage.get<T>(key)
			return item !== null ? item : initialValue
		} catch (error) {
			console.error(`Error reading localStorage key "${key}":`, error)
			return initialValue
		}
	})

	// 값 설정 함수
	const setValue = useCallback(
		(value: T | ((val: T) => T)) => {
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

	// 값 삭제 함수
	const removeValue = useCallback(() => {
		try {
			storage.remove(key)
			setStoredValue(initialValue)
		} catch (error) {
			console.error(`Error removing localStorage key "${key}":`, error)
		}
	}, [key, initialValue])

	// 다른 탭/윈도우에서의 변경 감지
	useEffect(() => {
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === key && e.newValue !== null) {
				try {
					setStoredValue(JSON.parse(e.newValue))
				} catch (error) {
					console.error(`Error parsing storage event for key "${key}":`, error)
				}
			}
		}

		window.addEventListener('storage', handleStorageChange)
		return () => window.removeEventListener('storage', handleStorageChange)
	}, [key])

	return [storedValue, setValue, removeValue]
}

