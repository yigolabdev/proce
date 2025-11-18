/**
 * Work Entries Service
 * 
 * Handles all API calls related to work entries.
 * Currently uses localStorage, but structured to easily switch to API calls.
 */

import { storage } from '../../utils/storage'
import type { WorkEntry } from '../../types/common.types'
import type { ApiResponse, PaginatedResponse } from './config'

/**
 * Work Entry Filters
 */
export interface WorkEntryFilters {
	category?: string
	projectId?: string
	department?: string
	userId?: string
	startDate?: Date
	endDate?: Date
	page?: number
	pageSize?: number
}

/**
 * Work Entry Service
 * 
 * TODO: Replace localStorage calls with apiClient when backend is ready
 * Example: return apiClient.get<WorkEntry[]>('/work-entries', { params: filters })
 */
class WorkEntriesService {
	private readonly STORAGE_KEY = 'workEntries'
	
	/**
	 * Get all work entries with optional filtering
	 */
	async getAll(filters?: WorkEntryFilters): Promise<ApiResponse<WorkEntry[]>> {
		// TODO: Replace with API call
		// return apiClient.get<WorkEntry[]>('/work-entries', { params: filters })
		
		let entries = storage.get<WorkEntry[]>(this.STORAGE_KEY) || []
		
		// Apply filters
		if (filters) {
			if (filters.category) {
				entries = entries.filter(e => e.category === filters.category)
			}
			if (filters.projectId) {
				entries = entries.filter(e => e.projectId === filters.projectId)
			}
			if (filters.department) {
				entries = entries.filter(e => e.department === filters.department)
			}
			if (filters.userId) {
				entries = entries.filter(e => e.submittedById === filters.userId)
			}
			if (filters.startDate) {
				entries = entries.filter(e => new Date(e.date) >= filters.startDate!)
			}
			if (filters.endDate) {
				entries = entries.filter(e => new Date(e.date) <= filters.endDate!)
			}
		}
		
		return {
			data: entries,
			success: true,
		}
	}
	
	/**
	 * Get paginated work entries
	 */
	async getPaginated(filters?: WorkEntryFilters): Promise<ApiResponse<PaginatedResponse<WorkEntry>>> {
		// TODO: Replace with API call
		// return apiClient.get<PaginatedResponse<WorkEntry>>('/work-entries/paginated', { params: filters })
		
		const { data: allEntries } = await this.getAll(filters)
		const page = filters?.page || 1
		const pageSize = filters?.pageSize || 10
		
		const startIndex = (page - 1) * pageSize
		const endIndex = startIndex + pageSize
		const paginatedData = allEntries.slice(startIndex, endIndex)
		
		return {
			data: {
				data: paginatedData,
				total: allEntries.length,
				page,
				pageSize,
				totalPages: Math.ceil(allEntries.length / pageSize),
			},
			success: true,
		}
	}
	
	/**
	 * Get work entry by ID
	 */
	async getById(id: string): Promise<ApiResponse<WorkEntry | null>> {
		// TODO: Replace with API call
		// return apiClient.get<WorkEntry>(`/work-entries/${id}`)
		
		const entries = storage.get<WorkEntry[]>(this.STORAGE_KEY) || []
		const entry = entries.find(e => e.id === id)
		
		return {
			data: entry || null,
			success: true,
		}
	}
	
	/**
	 * Create new work entry
	 */
	async create(entry: Omit<WorkEntry, 'id'>): Promise<ApiResponse<WorkEntry>> {
		// TODO: Replace with API call
		// return apiClient.post<WorkEntry>('/work-entries', entry)
		
		const entries = storage.get<WorkEntry[]>(this.STORAGE_KEY) || []
		const newEntry: WorkEntry = {
			...entry,
			id: `work-${Date.now()}`,
			date: new Date(),
		}
		
		entries.unshift(newEntry)
		storage.set(this.STORAGE_KEY, entries)
		
		return {
			data: newEntry,
			message: 'Work entry created successfully',
			success: true,
		}
	}
	
	/**
	 * Update work entry
	 */
	async update(id: string, updates: Partial<WorkEntry>): Promise<ApiResponse<WorkEntry>> {
		// TODO: Replace with API call
		// return apiClient.put<WorkEntry>(`/work-entries/${id}`, updates)
		
		const entries = storage.get<WorkEntry[]>(this.STORAGE_KEY) || []
		const index = entries.findIndex(e => e.id === id)
		
		if (index === -1) {
			throw new Error('Work entry not found')
		}
		
		entries[index] = { ...entries[index], ...updates }
		storage.set(this.STORAGE_KEY, entries)
		
		return {
			data: entries[index],
			message: 'Work entry updated successfully',
			success: true,
		}
	}
	
	/**
	 * Delete work entry
	 */
	async delete(id: string): Promise<ApiResponse<void>> {
		// TODO: Replace with API call
		// return apiClient.delete<void>(`/work-entries/${id}`)
		
		const entries = storage.get<WorkEntry[]>(this.STORAGE_KEY) || []
		const filtered = entries.filter(e => e.id !== id)
		storage.set(this.STORAGE_KEY, filtered)
		
		return {
			data: undefined,
			message: 'Work entry deleted successfully',
			success: true,
		}
	}
	
	/**
	 * Get work entries by project
	 */
	async getByProject(projectId: string): Promise<ApiResponse<WorkEntry[]>> {
		// TODO: Replace with API call
		// return apiClient.get<WorkEntry[]>(`/work-entries/project/${projectId}`)
		
		return this.getAll({ projectId })
	}
	
	/**
	 * Get work entries by user
	 */
	async getByUser(userId: string): Promise<ApiResponse<WorkEntry[]>> {
		// TODO: Replace with API call
		// return apiClient.get<WorkEntry[]>(`/work-entries/user/${userId}`)
		
		return this.getAll({ userId })
	}
	
	/**
	 * Get statistics
	 */
	async getStatistics(filters?: WorkEntryFilters): Promise<ApiResponse<{
		total: number
		thisWeek: number
		totalHours: number
		byCategory: Record<string, number>
		byDepartment: Record<string, number>
	}>> {
		// TODO: Replace with API call
		// return apiClient.get<Statistics>('/work-entries/statistics', { params: filters })
		
		const { data: entries } = await this.getAll(filters)
		
		const now = new Date()
		const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
		
		const thisWeek = entries.filter(e => new Date(e.date) >= weekAgo).length
		
		// Calculate total hours (rough estimate from duration strings)
		const totalHours = entries.reduce((sum, entry) => {
			if (!entry.duration) return sum
			const match = entry.duration.match(/(\d+\.?\d*)/)
			return sum + (match ? parseFloat(match[1]) : 0)
		}, 0)
		
		// Group by category
		const byCategory = entries.reduce((acc, entry) => {
			if (entry.category) {
				acc[entry.category] = (acc[entry.category] || 0) + 1
			}
			return acc
		}, {} as Record<string, number>)
		
		// Group by department
		const byDepartment = entries.reduce((acc, entry) => {
			if (entry.department) {
				acc[entry.department] = (acc[entry.department] || 0) + 1
			}
			return acc
		}, {} as Record<string, number>)
		
		return {
			data: {
				total: entries.length,
				thisWeek,
				totalHours,
				byCategory,
				byDepartment,
			},
			success: true,
		}
	}
}

export const workEntriesService = new WorkEntriesService()

