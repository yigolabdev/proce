/**
 * API Service Layer
 * 
 * 백엔드 API와의 통합을 위한 중앙화된 서비스 레이어
 * 현재는 localStorage를 사용하지만, 추후 실제 HTTP 요청으로 쉽게 전환 가능
 */

import { storage } from '../utils/storage'
import type { Project } from '../types/common.types'

// Department, Position, Job types (from System Settings)
interface Department {
	id: string
	name: string
	description: string
}

interface Position {
	id: string
	name: string
	description: string
}

interface Job {
	id: string
	title: string
	description: string
	responsibilities: string
}

// 기본 API 응답 타입
interface ApiResponse<T> {
	success: boolean
	data?: T
	error?: string
	message?: string
}

// 페이지네이션 응답 (향후 사용 예정)
// interface PaginatedResponse<T> extends ApiResponse<T> {
// 	total?: number
// 	page?: number
// 	pageSize?: number
// }

/**
 * Base API Service
 * 모든 API 서비스의 기본 클래스
 */
abstract class BaseApiService {
	protected async handleRequest<T>(
		operation: () => T | Promise<T>
	): Promise<ApiResponse<T>> {
		try {
			const data = await operation()
			return {
				success: true,
				data,
			}
		} catch (error) {
			console.error('API Error:', error)
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error occurred',
			}
		}
	}

	protected delay(ms: number = 100): Promise<void> {
		// 실제 API 호출 시뮬레이션
		return new Promise((resolve) => setTimeout(resolve, ms))
	}
}

/**
 * Projects API Service
 */
export class ProjectsApiService extends BaseApiService {
	private readonly STORAGE_KEY = 'projects'

	async getAll(): Promise<ApiResponse<Project[]>> {
		return this.handleRequest(async () => {
			await this.delay()
			const projects = storage.get<Project[]>(this.STORAGE_KEY) || []
			return projects
		})
	}

	async getById(id: string): Promise<ApiResponse<Project>> {
		return this.handleRequest(async () => {
			await this.delay()
			const projects = storage.get<Project[]>(this.STORAGE_KEY) || []
			const project = projects.find((p) => p.id === id)
			if (!project) {
				throw new Error('Project not found')
			}
			return project
		})
	}

	async create(project: Omit<Project, 'id'>): Promise<ApiResponse<Project>> {
		return this.handleRequest(async () => {
			await this.delay()
			const projects = storage.get<Project[]>(this.STORAGE_KEY) || []
			const newProject: Project = {
				...project,
				id: Date.now().toString(),
			}
			const updated = [...projects, newProject]
			storage.set(this.STORAGE_KEY, updated)
			return newProject
		})
	}

	async update(id: string, updates: Partial<Project>): Promise<ApiResponse<Project>> {
		return this.handleRequest(async () => {
			await this.delay()
			const projects = storage.get<Project[]>(this.STORAGE_KEY) || []
			const index = projects.findIndex((p) => p.id === id)
			if (index === -1) {
				throw new Error('Project not found')
			}
			const updated = projects.map((p) => (p.id === id ? { ...p, ...updates } : p))
			storage.set(this.STORAGE_KEY, updated)
			return updated[index]
		})
	}

	async delete(id: string): Promise<ApiResponse<void>> {
		return this.handleRequest(async () => {
			await this.delay()
			const projects = storage.get<Project[]>(this.STORAGE_KEY) || []
			const updated = projects.filter((p) => p.id !== id)
			storage.set(this.STORAGE_KEY, updated)
		})
	}
}

/**
 * Departments API Service
 */
export class DepartmentsApiService extends BaseApiService {
	private readonly STORAGE_KEY = 'departments'

	async getAll(): Promise<ApiResponse<Department[]>> {
		return this.handleRequest(async () => {
			await this.delay()
			return storage.get<Department[]>(this.STORAGE_KEY) || []
		})
	}

	async create(department: Omit<Department, 'id'>): Promise<ApiResponse<Department>> {
		return this.handleRequest(async () => {
			await this.delay()
			const departments = storage.get<Department[]>(this.STORAGE_KEY) || []
			const newDepartment: Department = {
				...department,
				id: Date.now().toString(),
			}
			storage.set(this.STORAGE_KEY, [...departments, newDepartment])
			return newDepartment
		})
	}

	async update(id: string, updates: Partial<Department>): Promise<ApiResponse<Department>> {
		return this.handleRequest(async () => {
			await this.delay()
			const departments = storage.get<Department[]>(this.STORAGE_KEY) || []
			const updated = departments.map((d) => (d.id === id ? { ...d, ...updates } : d))
			storage.set(this.STORAGE_KEY, updated)
			const department = updated.find((d) => d.id === id)
			if (!department) throw new Error('Department not found')
			return department
		})
	}

	async delete(id: string): Promise<ApiResponse<void>> {
		return this.handleRequest(async () => {
			await this.delay()
			const departments = storage.get<Department[]>(this.STORAGE_KEY) || []
			const updated = departments.filter((d) => d.id !== id)
			storage.set(this.STORAGE_KEY, updated)
		})
	}
}

/**
 * Positions API Service
 */
export class PositionsApiService extends BaseApiService {
	private readonly STORAGE_KEY = 'positions'

	async getAll(): Promise<ApiResponse<Position[]>> {
		return this.handleRequest(async () => {
			await this.delay()
			return storage.get<Position[]>(this.STORAGE_KEY) || []
		})
	}

	async create(position: Omit<Position, 'id'>): Promise<ApiResponse<Position>> {
		return this.handleRequest(async () => {
			await this.delay()
			const positions = storage.get<Position[]>(this.STORAGE_KEY) || []
			const newPosition: Position = {
				...position,
				id: Date.now().toString(),
			}
			storage.set(this.STORAGE_KEY, [...positions, newPosition])
			return newPosition
		})
	}

	async update(id: string, updates: Partial<Position>): Promise<ApiResponse<Position>> {
		return this.handleRequest(async () => {
			await this.delay()
			const positions = storage.get<Position[]>(this.STORAGE_KEY) || []
			const updated = positions.map((p) => (p.id === id ? { ...p, ...updates } : p))
			storage.set(this.STORAGE_KEY, updated)
			const position = updated.find((p) => p.id === id)
			if (!position) throw new Error('Position not found')
			return position
		})
	}

	async delete(id: string): Promise<ApiResponse<void>> {
		return this.handleRequest(async () => {
			await this.delay()
			const positions = storage.get<Position[]>(this.STORAGE_KEY) || []
			const updated = positions.filter((p) => p.id !== id)
			storage.set(this.STORAGE_KEY, updated)
		})
	}
}

/**
 * Jobs (Roles & Responsibilities) API Service
 */
export class JobsApiService extends BaseApiService {
	private readonly STORAGE_KEY = 'jobs'

	async getAll(): Promise<ApiResponse<Job[]>> {
		return this.handleRequest(async () => {
			await this.delay()
			return storage.get<Job[]>(this.STORAGE_KEY) || []
		})
	}

	async create(job: Omit<Job, 'id'>): Promise<ApiResponse<Job>> {
		return this.handleRequest(async () => {
			await this.delay()
			const jobs = storage.get<Job[]>(this.STORAGE_KEY) || []
			const newJob: Job = {
				...job,
				id: Date.now().toString(),
			}
			storage.set(this.STORAGE_KEY, [...jobs, newJob])
			return newJob
		})
	}

	async update(id: string, updates: Partial<Job>): Promise<ApiResponse<Job>> {
		return this.handleRequest(async () => {
			await this.delay()
			const jobs = storage.get<Job[]>(this.STORAGE_KEY) || []
			const updated = jobs.map((j) => (j.id === id ? { ...j, ...updates } : j))
			storage.set(this.STORAGE_KEY, updated)
			const job = updated.find((j) => j.id === id)
			if (!job) throw new Error('Job not found')
			return job
		})
	}

	async delete(id: string): Promise<ApiResponse<void>> {
		return this.handleRequest(async () => {
			await this.delay()
			const jobs = storage.get<Job[]>(this.STORAGE_KEY) || []
			const updated = jobs.filter((j) => j.id !== id)
			storage.set(this.STORAGE_KEY, updated)
		})
	}
}

/**
 * Work Statuses API Service
 */
export class WorkStatusesApiService extends BaseApiService {
	private readonly STORAGE_KEY = 'workStatuses'

	async getAll(): Promise<ApiResponse<WorkCategory[]>> {
		return this.handleRequest(async () => {
			await this.delay()
			return storage.get<WorkCategory[]>(this.STORAGE_KEY) || []
		})
	}

	async create(status: Omit<WorkCategory, 'id'>): Promise<ApiResponse<WorkCategory>> {
		return this.handleRequest(async () => {
			await this.delay()
			const statuses = storage.get<WorkCategory[]>(this.STORAGE_KEY) || []
			const newStatus: WorkCategory = {
				...status,
				id: Date.now().toString(),
			}
			storage.set(this.STORAGE_KEY, [...statuses, newStatus])
			return newStatus
		})
	}

	async update(id: string, updates: Partial<WorkCategory>): Promise<ApiResponse<WorkCategory>> {
		return this.handleRequest(async () => {
			await this.delay()
			const statuses = storage.get<WorkCategory[]>(this.STORAGE_KEY) || []
			const updated = statuses.map((s) => (s.id === id ? { ...s, ...updates } : s))
			storage.set(this.STORAGE_KEY, updated)
			const status = updated.find((s) => s.id === id)
			if (!status) throw new Error('Status not found')
			return status
		})
	}

	async delete(id: string): Promise<ApiResponse<void>> {
		return this.handleRequest(async () => {
			await this.delay()
			const statuses = storage.get<WorkCategory[]>(this.STORAGE_KEY) || []
			const updated = statuses.filter((s) => s.id !== id)
			storage.set(this.STORAGE_KEY, updated)
		})
	}
}

// Work Category type
interface WorkCategory {
	id: string
	name: string
	color: string
	description: string
}

// Export singleton instances
export const projectsApi = new ProjectsApiService()
export const departmentsApi = new DepartmentsApiService()
export const positionsApi = new PositionsApiService()
export const jobsApi = new JobsApiService()
export const workStatusesApi = new WorkStatusesApiService()

/**
 * Centralized API object
 * 모든 API 서비스를 하나의 객체로 접근
 */
export const api = {
	projects: projectsApi,
	departments: departmentsApi,
	positions: positionsApi,
	jobs: jobsApi,
	workStatuses: workStatusesApi,
}

export default api

