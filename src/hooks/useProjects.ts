/**
 * useProjects Hook
 * 
 * Custom hook for managing projects.
 */

import { useState, useEffect, useCallback } from 'react'
import { projectsService, type ProjectFilters } from '../services/api'
import type { Project } from '../types/common.types'

interface UseProjectsResult {
	projects: Project[]
	loading: boolean
	error: Error | null
	refetch: () => Promise<void>
	createProject: (project: Omit<Project, 'id' | 'createdAt'>) => Promise<Project>
	updateProject: (id: string, updates: Partial<Project>) => Promise<Project>
	deleteProject: (id: string) => Promise<void>
}

/**
 * Hook for managing projects
 */
export function useProjects(
	filters?: ProjectFilters,
	autoFetch: boolean = true
): UseProjectsResult {
	const [projects, setProjects] = useState<Project[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)
	
	const fetchProjects = useCallback(async () => {
		setLoading(true)
		setError(null)
		
		try {
			const response = await projectsService.getAll(filters)
			setProjects(response.data)
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Failed to fetch projects'))
		} finally {
			setLoading(false)
		}
	}, [filters])
	
	const createProject = useCallback(async (project: Omit<Project, 'id' | 'createdAt'>) => {
		setLoading(true)
		setError(null)
		
		try {
			const response = await projectsService.create(project)
			await fetchProjects()
			return response.data
		} catch (err) {
			const error = err instanceof Error ? err : new Error('Failed to create project')
			setError(error)
			throw error
		} finally {
			setLoading(false)
		}
	}, [fetchProjects])
	
	const updateProject = useCallback(async (id: string, updates: Partial<Project>) => {
		setLoading(true)
		setError(null)
		
		try {
			const response = await projectsService.update(id, updates)
			await fetchProjects()
			return response.data
		} catch (err) {
			const error = err instanceof Error ? err : new Error('Failed to update project')
			setError(error)
			throw error
		} finally {
			setLoading(false)
		}
	}, [fetchProjects])
	
	const deleteProject = useCallback(async (id: string) => {
		setLoading(true)
		setError(null)
		
		try {
			await projectsService.delete(id)
			await fetchProjects()
		} catch (err) {
			const error = err instanceof Error ? err : new Error('Failed to delete project')
			setError(error)
			throw error
		} finally {
			setLoading(false)
		}
	}, [fetchProjects])
	
	useEffect(() => {
		if (autoFetch) {
			fetchProjects()
		}
	}, [autoFetch, fetchProjects])
	
	return {
		projects,
		loading,
		error,
		refetch: fetchProjects,
		createProject,
		updateProject,
		deleteProject,
	}
}

