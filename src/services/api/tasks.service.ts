/**
 * Tasks Service
 * 
 * Handles all API calls related to tasks (both AI and manual).
 */

import { storage } from '../../utils/storage'
import type { TaskRecommendation } from '../../types/common.types'
import type { ApiResponse } from './config'

/**
 * Task Filters
 */
export interface TaskFilters {
	projectId?: string
	status?: 'pending' | 'accepted' | 'completed'
	priority?: 'low' | 'medium' | 'high'
	assignedTo?: string
	type?: 'ai' | 'manual'
}

/**
 * Task Creation Data
 */
export interface CreateTaskData {
	title: string
	description: string
	category: string
	priority: 'low' | 'medium' | 'high'
	projectId?: string
	projectName?: string
	deadline?: string
	assignedTo?: string
	assignedToName?: string
	assignedToDepartment?: string
	createdBy: string
	source: 'ai' | 'manual'
}

/**
 * Tasks Service
 */
class TasksService {
	private readonly AI_STORAGE_KEY = 'ai_recommendations'
	private readonly MANUAL_STORAGE_KEY = 'manual_tasks'
	
	/**
	 * Get all tasks (AI + Manual)
	 */
	async getAll(filters?: TaskFilters): Promise<ApiResponse<TaskRecommendation[]>> {
		// TODO: Replace with API call
		// return apiClient.get<TaskRecommendation[]>('/tasks', { params: filters })
		
		const aiTasks = storage.get<TaskRecommendation[]>(this.AI_STORAGE_KEY) || []
		const manualTasks = storage.get<TaskRecommendation[]>(this.MANUAL_STORAGE_KEY) || []
		
		let allTasks = [...aiTasks, ...manualTasks]
		
		// Apply filters
		if (filters) {
			if (filters.projectId) {
				allTasks = allTasks.filter(t => t.projectId === filters.projectId)
			}
			if (filters.status) {
				allTasks = allTasks.filter(t => t.status === filters.status)
			}
			if (filters.priority) {
				allTasks = allTasks.filter(t => t.priority === filters.priority)
			}
			if (filters.assignedTo) {
				allTasks = allTasks.filter(t => t.assignedTo === filters.assignedTo)
			}
			if (filters.type) {
				allTasks = allTasks.filter(t => t.source === filters.type)
			}
		}
		
		return {
			data: allTasks,
			success: true,
		}
	}
	
	/**
	 * Get AI generated tasks
	 */
	async getAITasks(filters?: TaskFilters): Promise<ApiResponse<TaskRecommendation[]>> {
		// TODO: Replace with API call
		// return apiClient.get<TaskRecommendation[]>('/tasks/ai', { params: filters })
		
		return this.getAll({ ...filters, type: 'ai' })
	}
	
	/**
	 * Get manual tasks
	 */
	async getManualTasks(filters?: TaskFilters): Promise<ApiResponse<TaskRecommendation[]>> {
		// TODO: Replace with API call
		// return apiClient.get<TaskRecommendation[]>('/tasks/manual', { params: filters })
		
		return this.getAll({ ...filters, type: 'manual' })
	}
	
	/**
	 * Get task by ID
	 */
	async getById(id: string): Promise<ApiResponse<TaskRecommendation | null>> {
		// TODO: Replace with API call
		// return apiClient.get<TaskRecommendation>(`/tasks/${id}`)
		
		const { data: allTasks } = await this.getAll()
		const task = allTasks.find(t => t.id === id)
		
		return {
			data: task || null,
			success: true,
		}
	}
	
	/**
	 * Create new task
	 */
	async create(taskData: CreateTaskData): Promise<ApiResponse<TaskRecommendation>> {
		// TODO: Replace with API call
		// return apiClient.post<TaskRecommendation>('/tasks', taskData)
		
		const storageKey = taskData.source === 'ai' ? this.AI_STORAGE_KEY : this.MANUAL_STORAGE_KEY
		const tasks = storage.get<TaskRecommendation[]>(storageKey) || []
		
		const newTask: TaskRecommendation = {
			id: `task-${taskData.source}-${Date.now()}`,
			...taskData,
			status: 'pending',
			estimatedDuration: 150, // 예상 소요 시간 (분)
			relatedMembers: [],
		}
		
		tasks.unshift(newTask)
		storage.set(storageKey, tasks)
		
		return {
			data: newTask,
			message: 'Task created successfully',
			success: true,
		}
	}
	
	/**
	 * Update task
	 */
	async update(id: string, updates: Partial<TaskRecommendation>): Promise<ApiResponse<TaskRecommendation>> {
		// TODO: Replace with API call
		// return apiClient.put<TaskRecommendation>(`/tasks/${id}`, updates)
		
		// Try to find in AI tasks
		let tasks = storage.get<TaskRecommendation[]>(this.AI_STORAGE_KEY) || []
		let index = tasks.findIndex(t => t.id === id)
		let storageKey = this.AI_STORAGE_KEY
		
		// If not found, try manual tasks
		if (index === -1) {
			tasks = storage.get<TaskRecommendation[]>(this.MANUAL_STORAGE_KEY) || []
			index = tasks.findIndex(t => t.id === id)
			storageKey = this.MANUAL_STORAGE_KEY
		}
		
		if (index === -1) {
			throw new Error('Task not found')
		}
		
		tasks[index] = { ...tasks[index], ...updates }
		storage.set(storageKey, tasks)
		
		return {
			data: tasks[index],
			message: 'Task updated successfully',
			success: true,
		}
	}
	
	/**
	 * Delete task
	 */
	async delete(id: string): Promise<ApiResponse<void>> {
		// TODO: Replace with API call
		// return apiClient.delete<void>(`/tasks/${id}`)
		
		// Try AI tasks first
		let tasks = storage.get<TaskRecommendation[]>(this.AI_STORAGE_KEY) || []
		let filtered = tasks.filter(t => t.id !== id)
		
		if (filtered.length < tasks.length) {
			storage.set(this.AI_STORAGE_KEY, filtered)
		} else {
			// Try manual tasks
			tasks = storage.get<TaskRecommendation[]>(this.MANUAL_STORAGE_KEY) || []
			filtered = tasks.filter(t => t.id !== id)
			storage.set(this.MANUAL_STORAGE_KEY, filtered)
		}
		
		return {
			data: undefined,
			message: 'Task deleted successfully',
			success: true,
		}
	}
	
	/**
	 * Accept task
	 */
	async accept(id: string): Promise<ApiResponse<TaskRecommendation>> {
		// TODO: Replace with API call
		// return apiClient.post<TaskRecommendation>(`/tasks/${id}/accept`)
		
		return this.update(id, { status: 'accepted' })
	}
	
	/**
	 * Complete task
	 */
	async complete(id: string): Promise<ApiResponse<TaskRecommendation>> {
		// TODO: Replace with API call
		// return apiClient.post<TaskRecommendation>(`/tasks/${id}/complete`)
		
		return this.update(id, { status: 'completed' })
	}
	
	/**
	 * Get tasks assigned to user
	 */
	async getAssignedToUser(userId: string): Promise<ApiResponse<TaskRecommendation[]>> {
		// TODO: Replace with API call
		// return apiClient.get<TaskRecommendation[]>(`/tasks/assigned/${userId}`)
		
		return this.getAll({ assignedTo: userId })
	}
	
	/**
	 * Get task statistics
	 */
	async getStatistics(): Promise<ApiResponse<{
		total: number
		pending: number
		accepted: number
		completed: number
		aiGenerated: number
		manual: number
		byPriority: Record<string, number>
	}>> {
		// TODO: Replace with API call
		// return apiClient.get<Statistics>('/tasks/statistics')
		
		const { data: allTasks } = await this.getAll()
		
		const byPriority = allTasks.reduce((acc, task) => {
			acc[task.priority] = (acc[task.priority] || 0) + 1
			return acc
		}, {} as Record<string, number>)
		
		return {
			data: {
				total: allTasks.length,
				pending: allTasks.filter(t => t.status === 'pending').length,
				accepted: allTasks.filter(t => t.status === 'accepted').length,
				completed: allTasks.filter(t => t.status === 'completed').length,
				aiGenerated: allTasks.filter(t => t.source === 'ai').length,
				manual: allTasks.filter(t => t.source === 'manual').length,
				byPriority,
			},
			success: true,
		}
	}
}

export const tasksService = new TasksService()

