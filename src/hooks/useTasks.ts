/**
 * useTasks Hook
 * 
 * Custom hook for managing tasks (AI and manual).
 */

import { useState, useEffect, useCallback } from 'react'
import { tasksService, type TaskFilters, type CreateTaskData } from '../services/api'
import type { TaskRecommendation } from '../types/common.types'

interface UseTasksResult {
	tasks: TaskRecommendation[]
	loading: boolean
	error: Error | null
	refetch: () => Promise<void>
	createTask: (taskData: CreateTaskData) => Promise<TaskRecommendation>
	updateTask: (id: string, updates: Partial<TaskRecommendation>) => Promise<TaskRecommendation>
	deleteTask: (id: string) => Promise<void>
	acceptTask: (id: string) => Promise<TaskRecommendation>
	completeTask: (id: string) => Promise<TaskRecommendation>
}

/**
 * Hook for managing tasks
 * 
 * @param filters - Optional filters to apply
 * @param autoFetch - Whether to fetch data automatically on mount (default: true)
 */
export function useTasks(
	filters?: TaskFilters,
	autoFetch: boolean = true
): UseTasksResult {
	const [tasks, setTasks] = useState<TaskRecommendation[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)
	
	/**
	 * Fetch tasks
	 */
	const fetchTasks = useCallback(async () => {
		setLoading(true)
		setError(null)
		
		try {
			const response = await tasksService.getAll(filters)
			setTasks(response.data)
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Failed to fetch tasks'))
		} finally {
			setLoading(false)
		}
	}, [filters])
	
	/**
	 * Create task
	 */
	const createTask = useCallback(async (taskData: CreateTaskData) => {
		setLoading(true)
		setError(null)
		
		try {
			const response = await tasksService.create(taskData)
			await fetchTasks() // Refetch to update list
			return response.data
		} catch (err) {
			const error = err instanceof Error ? err : new Error('Failed to create task')
			setError(error)
			throw error
		} finally {
			setLoading(false)
		}
	}, [fetchTasks])
	
	/**
	 * Update task
	 */
	const updateTask = useCallback(async (id: string, updates: Partial<TaskRecommendation>) => {
		setLoading(true)
		setError(null)
		
		try {
			const response = await tasksService.update(id, updates)
			await fetchTasks() // Refetch to update list
			return response.data
		} catch (err) {
			const error = err instanceof Error ? err : new Error('Failed to update task')
			setError(error)
			throw error
		} finally {
			setLoading(false)
		}
	}, [fetchTasks])
	
	/**
	 * Delete task
	 */
	const deleteTask = useCallback(async (id: string) => {
		setLoading(true)
		setError(null)
		
		try {
			await tasksService.delete(id)
			await fetchTasks() // Refetch to update list
		} catch (err) {
			const error = err instanceof Error ? err : new Error('Failed to delete task')
			setError(error)
			throw error
		} finally {
			setLoading(false)
		}
	}, [fetchTasks])
	
	/**
	 * Accept task
	 */
	const acceptTask = useCallback(async (id: string) => {
		setLoading(true)
		setError(null)
		
		try {
			const response = await tasksService.accept(id)
			await fetchTasks() // Refetch to update list
			return response.data
		} catch (err) {
			const error = err instanceof Error ? err : new Error('Failed to accept task')
			setError(error)
			throw error
		} finally {
			setLoading(false)
		}
	}, [fetchTasks])
	
	/**
	 * Complete task
	 */
	const completeTask = useCallback(async (id: string) => {
		setLoading(true)
		setError(null)
		
		try {
			const response = await tasksService.complete(id)
			await fetchTasks() // Refetch to update list
			return response.data
		} catch (err) {
			const error = err instanceof Error ? err : new Error('Failed to complete task')
			setError(error)
			throw error
		} finally {
			setLoading(false)
		}
	}, [fetchTasks])
	
	// Auto-fetch on mount if enabled
	useEffect(() => {
		if (autoFetch) {
			fetchTasks()
		}
	}, [autoFetch, fetchTasks])
	
	return {
		tasks,
		loading,
		error,
		refetch: fetchTasks,
		createTask,
		updateTask,
		deleteTask,
		acceptTask,
		completeTask,
	}
}

