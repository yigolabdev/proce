/**
 * Projects Service
 * 
 * Handles all API calls related to projects.
 */

import { storage } from '../../utils/storage'
import type { Project } from '../../types/common.types'
import type { ApiResponse } from './config'

/**
 * Project Filters
 */
export interface ProjectFilters {
	status?: 'planning' | 'active' | 'on-hold' | 'completed'
	department?: string
	startDate?: Date
	endDate?: Date
}

/**
 * Projects Service
 */
class ProjectsService {
	private readonly STORAGE_KEY = 'projects'
	
	/**
	 * Get all projects
	 */
	async getAll(filters?: ProjectFilters): Promise<ApiResponse<Project[]>> {
		// TODO: Replace with API call
		// return apiClient.get<Project[]>('/projects', { params: filters })
		
		let projects = storage.get<Project[]>(this.STORAGE_KEY) || []
		
		// Apply filters
		if (filters) {
			if (filters.status) {
				projects = projects.filter(p => p.status === filters.status)
			}
			if (filters.department) {
				projects = projects.filter(p => p.department === filters.department)
			}
			if (filters.startDate) {
				projects = projects.filter(p => new Date(p.startDate) >= filters.startDate!)
			}
			if (filters.endDate) {
				projects = projects.filter(p => new Date(p.endDate) <= filters.endDate!)
			}
		}
		
		return {
			data: projects,
			success: true,
		}
	}
	
	/**
	 * Get project by ID
	 */
	async getById(id: string): Promise<ApiResponse<Project | null>> {
		// TODO: Replace with API call
		// return apiClient.get<Project>(`/projects/${id}`)
		
		const projects = storage.get<Project[]>(this.STORAGE_KEY) || []
		const project = projects.find(p => p.id === id)
		
		return {
			data: project || null,
			success: true,
		}
	}
	
	/**
	 * Create project
	 */
	async create(project: Omit<Project, 'id' | 'createdAt'>): Promise<ApiResponse<Project>> {
		// TODO: Replace with API call
		// return apiClient.post<Project>('/projects', project)
		
		const projects = storage.get<Project[]>(this.STORAGE_KEY) || []
		
		const newProject: Project = {
			...project,
			id: `proj-${Date.now()}`,
			createdAt: new Date(),
		}
		
		projects.unshift(newProject)
		storage.set(this.STORAGE_KEY, projects)
		
		return {
			data: newProject,
			message: 'Project created successfully',
			success: true,
		}
	}
	
	/**
	 * Update project
	 */
	async update(id: string, updates: Partial<Project>): Promise<ApiResponse<Project>> {
		// TODO: Replace with API call
		// return apiClient.put<Project>(`/projects/${id}`, updates)
		
		const projects = storage.get<Project[]>(this.STORAGE_KEY) || []
		const index = projects.findIndex(p => p.id === id)
		
		if (index === -1) {
			throw new Error('Project not found')
		}
		
		projects[index] = { ...projects[index], ...updates }
		storage.set(this.STORAGE_KEY, projects)
		
		return {
			data: projects[index],
			message: 'Project updated successfully',
			success: true,
		}
	}
	
	/**
	 * Delete project
	 */
	async delete(id: string): Promise<ApiResponse<void>> {
		// TODO: Replace with API call
		// return apiClient.delete<void>(`/projects/${id}`)
		
		const projects = storage.get<Project[]>(this.STORAGE_KEY) || []
		const filtered = projects.filter(p => p.id !== id)
		storage.set(this.STORAGE_KEY, filtered)
		
		return {
			data: undefined,
			message: 'Project deleted successfully',
			success: true,
		}
	}
}

export const projectsService = new ProjectsService()

