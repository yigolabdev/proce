/**
 * Projects Service
 * 
 * Handles all API calls related to projects.
 */

import { storage } from '../../utils/storage'
import type { Project, ProjectStatus } from '../../types/common.types'
import type { ApiResponse } from './config'
import { parseProjectsFromStorage, serializeProjectForStorage } from '../../utils/mappers'

/**
 * Project Filters
 */
export interface ProjectFilters {
	status?: ProjectStatus
	department?: string
	departments?: string[]
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
		
		const rawProjects = storage.get<any[]>(this.STORAGE_KEY) || []
		let projects = parseProjectsFromStorage(rawProjects)
		
		// Apply filters
		if (filters) {
			if (filters.status) {
				projects = projects.filter(p => p.status === filters.status)
			}
			if (filters.department) {
				// Support both legacy single department and new departments array
				projects = projects.filter(p => 
					p.departments?.includes(filters.department!)
				)
			}
			if (filters.departments) {
				// Filter by multiple departments (match any)
				projects = projects.filter(p => 
					p.departments?.some(d => filters.departments!.includes(d))
				)
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
		
		const rawProjects = storage.get<any[]>(this.STORAGE_KEY) || []
		const projects = parseProjectsFromStorage(rawProjects)
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
		
		const rawProjects = storage.get<any[]>(this.STORAGE_KEY) || []
		
		const newProject: Project = {
			...project,
			id: `proj-${Date.now()}`,
			createdAt: new Date(),
		}
		
		const serialized = serializeProjectForStorage(newProject)
		rawProjects.unshift(serialized)
		storage.set(this.STORAGE_KEY, rawProjects)
		
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
		
		const rawProjects = storage.get<any[]>(this.STORAGE_KEY) || []
		const projects = parseProjectsFromStorage(rawProjects)
		const index = projects.findIndex(p => p.id === id)
		
		if (index === -1) {
			throw new Error('Project not found')
		}
		
		const updatedProject = { ...projects[index], ...updates }
		const serialized = serializeProjectForStorage(updatedProject)
		rawProjects[index] = serialized
		storage.set(this.STORAGE_KEY, rawProjects)
		
		return {
			data: updatedProject,
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
		
		const rawProjects = storage.get<any[]>(this.STORAGE_KEY) || []
		const filtered = rawProjects.filter((p: any) => p.id !== id)
		storage.set(this.STORAGE_KEY, filtered)
		
		return {
			data: undefined,
			message: 'Project deleted successfully',
			success: true,
		}
	}
}

export const projectsService = new ProjectsService()

