/**
 * Custom Hook: useAsync
 * 
 * 비동기 작업의 상태를 관리하는 hook
 */

import { useState, useEffect, useCallback } from 'react'

interface AsyncState<T> {
	loading: boolean
	data: T | null
	error: Error | null
}

interface UseAsyncReturn<T> extends AsyncState<T> {
	execute: (...args: any[]) => Promise<void>
	reset: () => void
}

/**
 * 비동기 함수의 상태를 관리
 * 
 * @param asyncFunction - 실행할 비동기 함수
 * @param immediate - 마운트 시 즉시 실행 여부
 * @returns 비동기 상태와 컨트롤 함수들
 * 
 * @example
 * const { data, loading, error, execute } = useAsync(
 *   async (id: string) => {
 *     const response = await fetch(`/api/users/${id}`)
 *     return response.json()
 *   },
 *   false
 * )
 * 
 * // 버튼 클릭 시 실행
 * <button onClick={() => execute('123')}>Load User</button>
 */
export function useAsync<T>(
	asyncFunction: (...args: any[]) => Promise<T>,
	immediate: boolean = true
): UseAsyncReturn<T> {
	const [state, setState] = useState<AsyncState<T>>({
		loading: immediate,
		data: null,
		error: null
	})

	const execute = useCallback(
		async (...args: any[]) => {
			setState({ loading: true, data: null, error: null })

			try {
				const data = await asyncFunction(...args)
				setState({ loading: false, data, error: null })
			} catch (error) {
				setState({
					loading: false,
					data: null,
					error: error instanceof Error ? error : new Error('Unknown error')
				})
			}
		},
		[asyncFunction]
	)

	const reset = useCallback(() => {
		setState({ loading: false, data: null, error: null })
	}, [])

	useEffect(() => {
		if (immediate) {
			execute()
		}
	}, [execute, immediate])

	return {
		...state,
		execute,
		reset
	}
}

/**
 * 데이터 fetching을 위한 hook
 * 
 * @example
 * const { data, loading, error, refetch } = useFetch<User[]>('/api/users')
 */
export function useFetch<T>(
	url: string,
	options?: RequestInit
): UseAsyncReturn<T> {
	const fetchData = useCallback(async () => {
		const response = await fetch(url, options)
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}
		return response.json()
	}, [url, options])

	return useAsync<T>(fetchData, true)
}

/**
 * 여러 비동기 작업을 병렬로 실행
 * 
 * @example
 * const { data, loading, error } = useAsyncAll([
 *   () => fetch('/api/users').then(r => r.json()),
 *   () => fetch('/api/projects').then(r => r.json())
 * ])
 */
export function useAsyncAll<T extends any[]>(
	asyncFunctions: Array<() => Promise<any>>
): AsyncState<T> {
	const [state, setState] = useState<AsyncState<T>>({
		loading: true,
		data: null,
		error: null
	})

	useEffect(() => {
		let cancelled = false

		const execute = async () => {
			setState({ loading: true, data: null, error: null })

			try {
				const results = await Promise.all(asyncFunctions.map(fn => fn()))
				if (!cancelled) {
					setState({ loading: false, data: results as T, error: null })
				}
			} catch (error) {
				if (!cancelled) {
					setState({
						loading: false,
						data: null,
						error: error instanceof Error ? error : new Error('Unknown error')
					})
				}
			}
		}

		execute()

		return () => {
			cancelled = true
		}
	}, [asyncFunctions])

	return state
}

