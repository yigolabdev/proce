/**
 * useWorkHistory Hook
 * 업무 이력 관리 로직
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import { storage } from '../utils/storage'
import { parseWorkEntriesFromStorage } from '../utils/mappers'
import type { WorkEntry, Project } from '../types/common.types'

export interface WorkHistoryFilters {
	search: string
	category: string
	project: string
	department: string
	user: string
	sortBy: 'date' | 'title'
}

export interface UseWorkHistoryReturn {
	// Data
	entries: WorkEntry[]
	filteredEntries: WorkEntry[]
	projects: Project[]
	departments: string[]
	users: Array<{ id: string; name: string; department: string }>
	
	// Filters
	filters: WorkHistoryFilters
	updateFilter: <K extends keyof WorkHistoryFilters>(key: K, value: WorkHistoryFilters[K]) => void
	resetFilters: () => void
	
	// UI State
	expandedEntries: string[]
	toggleExpand: (id: string) => void
	expandAll: () => void
	collapseAll: () => void
	
	// Computed
	stats: {
		total: number
		byCategory: Record<string, number>
		byProject: Record<string, number>
		byDepartment: Record<string, number>
	}
	
	// State
	isLoading: boolean
	error: Error | null
}

const defaultFilters: WorkHistoryFilters = {
	search: '',
	category: 'all',
	project: 'all',
	department: 'all',
	user: 'all',
	sortBy: 'date',
}

export function useWorkHistory(currentUserId?: string): UseWorkHistoryReturn {
	const [entries, setEntries] = useState<WorkEntry[]>([])
	const [projects, setProjects] = useState<Project[]>([])
	const [departments, setDepartments] = useState<string[]>([])
	const [users, setUsers] = useState<Array<{ id: string; name: string; department: string }>>([])
	const [filters, setFilters] = useState<WorkHistoryFilters>(defaultFilters)
	const [expandedEntries, setExpandedEntries] = useState<string[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)

	// Load data
	useEffect(() => {
		const loadData = async () => {
			try {
				setIsLoading(true)

			// Load projects
			const projectsData = storage.get<any[]>('projects', [])
			setProjects(projectsData || [])

			// Load work entries
			const saved = storage.get<any[]>('workEntries', [])
			const entriesWithDates = parseWorkEntriesFromStorage(saved || [])
				setEntries(entriesWithDates)

				// Extract departments
				const depts = Array.from(
					new Set(entriesWithDates.map((e: WorkEntry) => e.department).filter(Boolean))
				) as string[]
				setDepartments(depts)

				// Extract users
				const uniqueUsers = Array.from(
					new Map(
						entriesWithDates
							.filter((e: WorkEntry) => e.submittedBy)
							.map((e: WorkEntry) => [
								e.submittedById || e.submittedBy,
								{
									id: e.submittedById || e.submittedBy || '',
									name: e.submittedBy || '',
									department: e.department || '',
								},
							])
					).values()
				) as Array<{ id: string; name: string; department: string }>
				setUsers(uniqueUsers)

				setError(null)
			} catch (err) {
				const error = err instanceof Error ? err : new Error('Failed to load work history')
				setError(error)
			} finally {
				setIsLoading(false)
			}
		}

		loadData()
	}, [])

	// Filter entries
	const filteredEntries = useMemo(() => {
		let result = [...entries]

		// Search
		if (filters.search) {
			const query = filters.search.toLowerCase()
			result = result.filter(
				(entry) =>
					entry.title.toLowerCase().includes(query) ||
					entry.description.toLowerCase().includes(query) ||
					entry.tags?.some((tag) => tag.toLowerCase().includes(query))
			)
		}

		// Category
		if (filters.category !== 'all') {
			result = result.filter((entry) => entry.category === filters.category)
		}

		// Project
		if (filters.project !== 'all') {
			result = result.filter((entry) => entry.projectId === filters.project)
		}

		// Department
		if (filters.department !== 'all') {
			result = result.filter((entry) => entry.department === filters.department)
		}

		// User
		if (filters.user !== 'all') {
			if (filters.user === 'me' && currentUserId) {
				result = result.filter((entry) => entry.submittedById === currentUserId)
			} else {
				result = result.filter((entry) => entry.submittedById === filters.user)
			}
		}

		// Sort
		result.sort((a, b) => {
			if (filters.sortBy === 'date') {
				return new Date(b.date).getTime() - new Date(a.date).getTime()
			} else {
				return a.title.localeCompare(b.title)
			}
		})

		return result
	}, [entries, filters, currentUserId])

	// Stats
	const stats = useMemo(() => {
		const byCategory: Record<string, number> = {}
		const byProject: Record<string, number> = {}
		const byDepartment: Record<string, number> = {}

		filteredEntries.forEach((entry) => {
			byCategory[entry.category] = (byCategory[entry.category] || 0) + 1
			if (entry.projectId) {
				byProject[entry.projectId] = (byProject[entry.projectId] || 0) + 1
			}
			if (entry.department) {
				byDepartment[entry.department] = (byDepartment[entry.department] || 0) + 1
			}
		})

		return {
			total: filteredEntries.length,
			byCategory,
			byProject,
			byDepartment,
		}
	}, [filteredEntries])

	// Update filter
	const updateFilter = useCallback(
		<K extends keyof WorkHistoryFilters>(key: K, value: WorkHistoryFilters[K]) => {
			setFilters((prev) => ({ ...prev, [key]: value }))
		},
		[]
	)

	// Reset filters
	const resetFilters = useCallback(() => {
		setFilters(defaultFilters)
	}, [])

	// Toggle expand
	const toggleExpand = useCallback((id: string) => {
		setExpandedEntries((prev) => {
			if (prev.includes(id)) {
				return prev.filter((entryId) => entryId !== id)
			} else {
				return [...prev, id]
			}
		})
	}, [])

	// Expand all
	const expandAll = useCallback(() => {
		setExpandedEntries(filteredEntries.map((e) => e.id))
	}, [filteredEntries])

	// Collapse all
	const collapseAll = useCallback(() => {
		setExpandedEntries([])
	}, [])

	return {
		// Data
		entries,
		filteredEntries,
		projects,
		departments,
		users,

		// Filters
		filters,
		updateFilter,
		resetFilters,

		// UI State
		expandedEntries,
		toggleExpand,
		expandAll,
		collapseAll,

		// Computed
		stats,

		// State
		isLoading,
		error,
	}
}

