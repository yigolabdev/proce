/**
 * useWorkEntries Hook
 * 
 * 작업 기록 관련 로직을 재사용 가능한 hook으로 추출
 */

import { useState, useEffect, useCallback } from 'react'
import { workApi } from '../services/api/work.api'
import { errorHandler } from '../utils/errorHandler'
import type { WorkEntry } from '../types/common.types'
import type { WorkEntryFilters, PaginationParams } from '../types/api.types'

interface UseWorkEntriesOptions {
	filters?: WorkEntryFilters
	pagination?: PaginationParams
	autoLoad?: boolean
}

interface UseWorkEntriesReturn {
	workEntries: WorkEntry[]
	loading: boolean
	error: Error | null
	pagination: {
		page: number
		limit: number
		total: number
		totalPages: number
		hasNext: boolean
		hasPrev: boolean
	} | null
	loadWorkEntries: () => Promise<void>
	createWorkEntry: (data: any) => Promise<WorkEntry>
	updateWorkEntry: (id: string, data: any) => Promise<WorkEntry>
	deleteWorkEntry: (id: string) => Promise<void>
	refresh: () => Promise<void>
}

export function useWorkEntries(options: UseWorkEntriesOptions = {}): UseWorkEntriesReturn {
	const { filters, pagination: paginationParams, autoLoad = true } = options

	const [workEntries, setWorkEntries] = useState<WorkEntry[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)
	const [pagination, setPagination] = useState<UseWorkEntriesReturn['pagination']>(null)

	const loadWorkEntries = useCallback(async () => {
		try {
			setLoading(true)
			setError(null)
			
			const response = await workApi.getWorkEntries({
				...paginationParams,
				filters,
			})
			
			setWorkEntries(response.data)
			setPagination(response.pagination)
		} catch (err) {
			const error = err instanceof Error ? err : new Error('Failed to load work entries')
			setError(error)
			errorHandler.handle(error, { component: 'useWorkEntries' })
		} finally {
			setLoading(false)
		}
	}, [filters, paginationParams])

	const createWorkEntry = useCallback(async (data: any) => {
		try {
			const newEntry = await workApi.createWorkEntry(data)
			setWorkEntries(prev => [newEntry, ...prev])
			return newEntry
		} catch (err) {
			const error = err instanceof Error ? err : new Error('Failed to create work entry')
			errorHandler.handle(error, { component: 'useWorkEntries' })
			throw error
		}
	}, [])

	const updateWorkEntry = useCallback(async (id: string, data: any) => {
		try {
			const updatedEntry = await workApi.updateWorkEntry(id, data)
			setWorkEntries(prev => prev.map(entry => 
				entry.id === id ? updatedEntry : entry
			))
			return updatedEntry
		} catch (err) {
			const error = err instanceof Error ? err : new Error('Failed to update work entry')
			errorHandler.handle(error, { component: 'useWorkEntries' })
			throw error
		}
	}, [])

	const deleteWorkEntry = useCallback(async (id: string) => {
		try {
			await workApi.deleteWorkEntry(id)
			setWorkEntries(prev => prev.filter(entry => entry.id !== id))
		} catch (err) {
			const error = err instanceof Error ? err : new Error('Failed to delete work entry')
			errorHandler.handle(error, { component: 'useWorkEntries' })
			throw error
		}
	}, [])

	const refresh = useCallback(async () => {
		await loadWorkEntries()
	}, [loadWorkEntries])

	useEffect(() => {
		if (autoLoad) {
			loadWorkEntries()
		}
	}, [autoLoad, loadWorkEntries])

	return {
		workEntries,
		loading,
		error,
		pagination,
		loadWorkEntries,
		createWorkEntry,
		updateWorkEntry,
		deleteWorkEntry,
		refresh,
	}
}

/**
 * useMyWorkEntries Hook
 * 
 * 현재 사용자의 작업만 조회
 */
export function useMyWorkEntries(options: Omit<UseWorkEntriesOptions, 'filters'> = {}) {
	const { pagination, autoLoad = true } = options
	
	const [workEntries, setWorkEntries] = useState<WorkEntry[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const loadMyWorkEntries = useCallback(async () => {
		try {
			setLoading(true)
			setError(null)
			
			const response = await workApi.getMyWorkEntries(pagination)
			setWorkEntries(response.data)
		} catch (err) {
			const error = err instanceof Error ? err : new Error('Failed to load my work entries')
			setError(error)
			errorHandler.handle(error, { component: 'useWorkEntries' })
		} finally {
			setLoading(false)
		}
	}, [pagination])

	useEffect(() => {
		if (autoLoad) {
			loadMyWorkEntries()
		}
	}, [autoLoad, loadMyWorkEntries])

	return {
		workEntries,
		loading,
		error,
		refresh: loadMyWorkEntries,
	}
}
