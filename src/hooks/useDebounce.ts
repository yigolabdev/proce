/**
 * Custom Hook: useDebounce
 * 
 * 값의 변경을 지연시켜 불필요한 연산/API 호출을 방지
 */

import { useState, useEffect } from 'react'

/**
 * 디바운스된 값을 반환
 * 
 * @param value - 디바운스할 값
 * @param delay - 지연 시간 (ms)
 * @returns 디바운스된 값
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('')
 * const debouncedSearchTerm = useDebounce(searchTerm, 500)
 * 
 * useEffect(() => {
 *   // API 호출은 사용자가 타이핑을 멈춘 후 500ms 후에 실행
 *   searchAPI(debouncedSearchTerm)
 * }, [debouncedSearchTerm])
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value)

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(value)
		}, delay)

		return () => {
			clearTimeout(timer)
		}
	}, [value, delay])

	return debouncedValue
}

/**
 * 디바운스된 콜백 함수를 반환
 * 
 * @param callback - 실행할 함수
 * @param delay - 지연 시간 (ms)
 * @param deps - 의존성 배열
 * @returns 디바운스된 함수
 * 
 * @example
 * const handleSearch = useDebouncedCallback(
 *   (term: string) => {
 *     console.log('Searching:', term)
 *   },
 *   500,
 *   []
 * )
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
	callback: T,
	delay: number = 500,
	deps: React.DependencyList = []
): (...args: Parameters<T>) => void {
	const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null)

	useEffect(() => {
		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId)
			}
		}
	}, [timeoutId])

	const debouncedCallback = (...args: Parameters<T>) => {
		if (timeoutId) {
			clearTimeout(timeoutId)
		}

		const newTimeoutId = setTimeout(() => {
			callback(...args)
		}, delay)

		setTimeoutId(newTimeoutId)
	}

	// eslint-disable-next-line
	return useCallback(debouncedCallback, deps)
}

/**
 * 쓰로틀된 값을 반환 (일정 시간마다 한 번만 업데이트)
 * 
 * @param value - 쓰로틀할 값
 * @param limit - 업데이트 간격 (ms)
 * @returns 쓰로틀된 값
 * 
 * @example
 * const [scrollY, setScrollY] = useState(0)
 * const throttledScrollY = useThrottle(scrollY, 100)
 */
export function useThrottle<T>(value: T, limit: number = 500): T {
	const [throttledValue, setThrottledValue] = useState<T>(value)
	const [lastRan, setLastRan] = useState(Date.now())

	useEffect(() => {
		const handler = setTimeout(() => {
			if (Date.now() - lastRan >= limit) {
				setThrottledValue(value)
				setLastRan(Date.now())
			}
		}, limit - (Date.now() - lastRan))

		return () => {
			clearTimeout(handler)
		}
	}, [value, limit, lastRan])

	return throttledValue
}

// For React Hooks linting
import { useCallback } from 'react'
