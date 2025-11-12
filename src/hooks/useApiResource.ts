/**
 * useApiResource Hook
 * 
 * CRUD 작업을 위한 공통 hook
 * 백엔드 API 연동 시 쉽게 전환 가능한 구조
 */

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

interface ApiResponse<T> {
	success: boolean
	data?: T
	error?: string
}

interface ApiService<T> {
	getAll: () => Promise<ApiResponse<T[]>>
	getById?: (id: string) => Promise<ApiResponse<T>>
	create: (item: Omit<T, 'id'>) => Promise<ApiResponse<T>>
	update: (id: string, updates: Partial<T>) => Promise<ApiResponse<T>>
	delete: (id: string) => Promise<ApiResponse<void>>
}

interface UseApiResourceOptions {
	loadOnMount?: boolean
	successMessages?: {
		create?: string
		update?: string
		delete?: string
	}
	errorMessages?: {
		create?: string
		update?: string
		delete?: string
		load?: string
	}
}

interface UseApiResourceResult<T extends { id: string }> {
	items: T[]
	loading: boolean
	error: string | null
	reload: () => Promise<void>
	create: (item: Omit<T, 'id'>) => Promise<T | null>
	update: (id: string, updates: Partial<T>) => Promise<T | null>
	remove: (id: string) => Promise<boolean>
	getById: (id: string) => T | undefined
}

/**
 * API 리소스를 관리하는 공통 hook
 * 
 * @example
 * ```typescript
 * const {
 *   items: projects,
 *   loading,
 *   create: createProject,
 *   update: updateProject,
 *   remove: deleteProject,
 * } = useApiResource(api.projects, {
 *   loadOnMount: true,
 *   successMessages: {
 *     create: 'Project created successfully',
 *   }
 * })
 * ```
 */
export function useApiResource<T extends { id: string }>(
	service: ApiService<T>,
	options: UseApiResourceOptions = {}
): UseApiResourceResult<T> {
	const {
		loadOnMount = true,
		successMessages = {},
		errorMessages = {},
	} = options

	const [items, setItems] = useState<T[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	// Load all items
	const reload = useCallback(async () => {
		setLoading(true)
		setError(null)

		try {
			const response = await service.getAll()
			if (response.success && response.data) {
				setItems(response.data)
			} else {
				const errorMsg = response.error || errorMessages.load || 'Failed to load data'
				setError(errorMsg)
				toast.error(errorMsg)
			}
		} catch (err) {
			const errorMsg = errorMessages.load || 'Failed to load data'
			setError(errorMsg)
			toast.error(errorMsg)
		} finally {
			setLoading(false)
		}
	}, [service, errorMessages])

	// Create item
	const create = useCallback(
		async (item: Omit<T, 'id'>): Promise<T | null> => {
			setError(null)

			try {
				const response = await service.create(item)
				if (response.success && response.data) {
					setItems((prev) => [...prev, response.data!])
					const successMsg = successMessages.create || 'Created successfully'
					toast.success(successMsg)
					return response.data
				} else {
					const errorMsg = response.error || errorMessages.create || 'Failed to create'
					setError(errorMsg)
					toast.error(errorMsg)
					return null
				}
			} catch (err) {
				const errorMsg = errorMessages.create || 'Failed to create'
				setError(errorMsg)
				toast.error(errorMsg)
				return null
			}
		},
		[service, successMessages, errorMessages]
	)

	// Update item
	const update = useCallback(
		async (id: string, updates: Partial<T>): Promise<T | null> => {
			setError(null)

			try {
				const response = await service.update(id, updates)
				if (response.success && response.data) {
					setItems((prev) =>
						prev.map((item) => (item.id === id ? response.data! : item))
					)
					const successMsg = successMessages.update || 'Updated successfully'
					toast.success(successMsg)
					return response.data
				} else {
					const errorMsg = response.error || errorMessages.update || 'Failed to update'
					setError(errorMsg)
					toast.error(errorMsg)
					return null
				}
			} catch (err) {
				const errorMsg = errorMessages.update || 'Failed to update'
				setError(errorMsg)
				toast.error(errorMsg)
				return null
			}
		},
		[service, successMessages, errorMessages]
	)

	// Delete item
	const remove = useCallback(
		async (id: string): Promise<boolean> => {
			setError(null)

			try {
				const response = await service.delete(id)
				if (response.success) {
					setItems((prev) => prev.filter((item) => item.id !== id))
					const successMsg = successMessages.delete || 'Deleted successfully'
					toast.success(successMsg)
					return true
				} else {
					const errorMsg = response.error || errorMessages.delete || 'Failed to delete'
					setError(errorMsg)
					toast.error(errorMsg)
					return false
				}
			} catch (err) {
				const errorMsg = errorMessages.delete || 'Failed to delete'
				setError(errorMsg)
				toast.error(errorMsg)
				return false
			}
		},
		[service, successMessages, errorMessages]
	)

	// Get item by ID
	const getById = useCallback(
		(id: string): T | undefined => {
			return items.find((item) => item.id === id)
		},
		[items]
	)

	// Load on mount
	useEffect(() => {
		if (loadOnMount) {
			reload()
		}
	}, [loadOnMount, reload])

	return {
		items,
		loading,
		error,
		reload,
		create,
		update,
		remove,
		getById,
	}
}

/**
 * useOptimisticUpdate Hook
 * 
 * Optimistic UI 업데이트를 위한 hook
 * 백엔드 응답을 기다리지 않고 즉시 UI를 업데이트
 */
export function useOptimisticUpdate<T extends { id: string }>(
	items: T[],
	setItems: React.Dispatch<React.SetStateAction<T[]>>
) {
	const optimisticUpdate = useCallback(
		async (
			id: string,
			updates: Partial<T>,
			apiCall: () => Promise<boolean>
		): Promise<boolean> => {
			// Store original state
			const originalItems = [...items]
			
			// Optimistically update UI
			setItems((prev) =>
				prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
			)

			try {
				const success = await apiCall()
				if (!success) {
					// Revert on failure
					setItems(originalItems)
				}
				return success
			} catch (error) {
				// Revert on error
				setItems(originalItems)
				return false
			}
		},
		[items, setItems]
	)

	const optimisticDelete = useCallback(
		async (id: string, apiCall: () => Promise<boolean>): Promise<boolean> => {
			// Store original state
			const originalItems = [...items]
			
			// Optimistically update UI
			setItems((prev) => prev.filter((item) => item.id !== id))

			try {
				const success = await apiCall()
				if (!success) {
					// Revert on failure
					setItems(originalItems)
				}
				return success
			} catch (error) {
				// Revert on error
				setItems(originalItems)
				return false
			}
		},
		[items, setItems]
	)

	return {
		optimisticUpdate,
		optimisticDelete,
	}
}

export default useApiResource

