/**
 * KPI Service
 * 
 * Handles all API calls related to KPIs (Key Performance Indicators).
 */

import { storage } from '../../utils/storage'
import type { KPI, KPIFormData, KPIFilter } from '../../types/kpi.types'
import type { ApiResponse } from './config'

/**
 * KPI Service
 */
class KPIService {
	private readonly STORAGE_KEY = 'kpis'
	
	/**
	 * Get all KPIs
	 */
	async getAll(filters?: KPIFilter): Promise<ApiResponse<KPI[]>> {
		// TODO: Replace with API call
		// return apiClient.get<KPI[]>('/kpis', { params: filters })
		
		let kpis = storage.get<KPI[]>(this.STORAGE_KEY) || []
		
		// Apply filters
		if (filters) {
			if (filters.category) {
				kpis = kpis.filter(k => k.category === filters.category)
			}
			if (filters.department) {
				kpis = kpis.filter(k => k.department === filters.department)
			}
			if (filters.owner) {
				kpis = kpis.filter(k => k.ownerId === filters.owner)
			}
			if (filters.status && filters.status.length > 0) {
				kpis = kpis.filter(k => filters.status!.includes(k.status))
			}
			if (filters.priority && filters.priority.length > 0) {
				kpis = kpis.filter(k => filters.priority!.includes(k.priority))
			}
			if (filters.period) {
				kpis = kpis.filter(k => k.period === filters.period)
			}
		}
		
		return {
			data: kpis,
			success: true,
		}
	}
	
	/**
	 * Get KPI by ID
	 */
	async getById(id: string): Promise<ApiResponse<KPI | null>> {
		// TODO: Replace with API call
		// return apiClient.get<KPI>(`/kpis/${id}`)
		
		const kpis = storage.get<KPI[]>(this.STORAGE_KEY) || []
		const kpi = kpis.find(k => k.id === id)
		
		return {
			data: kpi || null,
			success: true,
		}
	}
	
	/**
	 * Create KPI
	 */
	async create(data: KPIFormData, userId: string, userName: string): Promise<ApiResponse<KPI>> {
		// TODO: Replace with API call
		// return apiClient.post<KPI>('/kpis', data)
		
		const kpis = storage.get<KPI[]>(this.STORAGE_KEY) || []
		
		// Calculate initial progress
		const progress = data.metric.current > 0 
			? Math.min((data.metric.current / data.metric.target) * 100, 100)
			: 0
		
		// Determine status based on progress
		let status: KPI['status'] = 'on-track'
		if (progress >= 100) {
			status = 'achieved'
		} else if (progress < 30) {
			status = 'behind'
		} else if (progress < 70) {
			status = 'at-risk'
		}
		
		const newKPI: KPI = {
			id: `kpi-${Date.now()}`,
			name: data.name,
			description: data.description,
			category: data.category,
			metric: data.metric,
			period: data.period,
			startDate: data.startDate,
			endDate: data.endDate,
			owner: data.owner,
			ownerId: userId,
			department: data.department,
			departmentId: data.department, // TODO: Use actual department ID
			priority: data.priority,
			progress,
			status,
			linkedObjectives: [],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			createdBy: userName,
		}
		
		kpis.unshift(newKPI)
		storage.set(this.STORAGE_KEY, kpis)
		
		return {
			data: newKPI,
			message: 'KPI created successfully',
			success: true,
		}
	}
	
	/**
	 * Update KPI
	 */
	async update(id: string, updates: Partial<KPI>): Promise<ApiResponse<KPI>> {
		// TODO: Replace with API call
		// return apiClient.put<KPI>(`/kpis/${id}`, updates)
		
		const kpis = storage.get<KPI[]>(this.STORAGE_KEY) || []
		const index = kpis.findIndex(k => k.id === id)
		
		if (index === -1) {
			throw new Error('KPI not found')
		}
		
		// Recalculate progress if metric is updated
		let updatedKPI = { ...kpis[index], ...updates, updatedAt: new Date().toISOString() }
		
		if (updates.metric) {
			const progress = updatedKPI.metric.current > 0
				? Math.min((updatedKPI.metric.current / updatedKPI.metric.target) * 100, 100)
				: 0
			
			let status: KPI['status'] = 'on-track'
			if (progress >= 100) {
				status = 'achieved'
			} else if (progress < 30) {
				status = 'behind'
			} else if (progress < 70) {
				status = 'at-risk'
			}
			
			updatedKPI = { ...updatedKPI, progress, status }
		}
		
		kpis[index] = updatedKPI
		storage.set(this.STORAGE_KEY, kpis)
		
		return {
			data: updatedKPI,
			message: 'KPI updated successfully',
			success: true,
		}
	}
	
	/**
	 * Delete KPI
	 * 연결된 OKR, Tasks도 함께 처리
	 */
	async delete(id: string, cascadeDelete: boolean = false): Promise<ApiResponse<{
		deletedKPI: boolean
		deletedObjectives: number
		deletedTasks: number
	}>> {
		// TODO: Replace with API call
		// return apiClient.delete<void>(`/kpis/${id}?cascade=${cascadeDelete}`)
		
		const kpis = storage.get<KPI[]>(this.STORAGE_KEY) || []
		const kpi = kpis.find(k => k.id === id)
		
		if (!kpi) {
			return {
				data: { deletedKPI: false, deletedObjectives: 0, deletedTasks: 0 },
				message: 'KPI not found',
				success: false,
			}
		}
		
		// 연결된 OKR과 Task 확인
		const objectives = storage.get<any[]>('objectives') || []
		const linkedObjectives = objectives.filter(o => o.kpiId === id)
		const tasks = storage.get<any[]>('ai_recommendations') || []
		const linkedTasks = tasks.filter(t => t.kpiId === id)
		
		let deletedObjectivesCount = 0
		let deletedTasksCount = 0
		
		if (cascadeDelete) {
			// 연쇄 삭제: 연결된 OKR과 Task를 모두 삭제
			const filteredObjectives = objectives.filter(o => o.kpiId !== id)
			storage.set('objectives', filteredObjectives)
			deletedObjectivesCount = linkedObjectives.length
			
			const filteredTasks = tasks.filter(t => t.kpiId !== id)
			storage.set('ai_recommendations', filteredTasks)
			deletedTasksCount = linkedTasks.length
		} else {
			// 연결만 해제: OKR과 Task는 유지하되 kpiId만 제거
			linkedObjectives.forEach(obj => {
				obj.kpiId = undefined
				obj.kpiName = undefined
				obj.kpiContribution = undefined
			})
			storage.set('objectives', objectives)
			
			linkedTasks.forEach(task => {
				task.kpiId = undefined
			})
			storage.set('ai_recommendations', tasks)
		}
		
		// KPI 삭제
		const filtered = kpis.filter(k => k.id !== id)
		storage.set(this.STORAGE_KEY, filtered)
		
		return {
			data: {
				deletedKPI: true,
				deletedObjectives: deletedObjectivesCount,
				deletedTasks: deletedTasksCount,
			},
			message: cascadeDelete 
				? `KPI와 연결된 ${deletedObjectivesCount}개 OKR, ${deletedTasksCount}개 Task가 함께 삭제되었습니다`
				: `KPI가 삭제되었습니다. ${linkedObjectives.length}개 OKR과 ${linkedTasks.length}개 Task의 연결이 해제되었습니다`,
			success: true,
		}
	}
	
	/**
	 * Get KPI statistics
	 */
	async getStatistics(): Promise<ApiResponse<{
		total: number
		onTrack: number
		atRisk: number
		behind: number
		achieved: number
		averageProgress: number
		byCategory: Record<string, number>
		byDepartment: Record<string, number>
	}>> {
		// TODO: Replace with API call
		// return apiClient.get<Statistics>('/kpis/statistics')
		
		const kpis = storage.get<KPI[]>(this.STORAGE_KEY) || []
		
		const byCategory = kpis.reduce((acc, kpi) => {
			acc[kpi.category] = (acc[kpi.category] || 0) + 1
			return acc
		}, {} as Record<string, number>)
		
		const byDepartment = kpis.reduce((acc, kpi) => {
			acc[kpi.department] = (acc[kpi.department] || 0) + 1
			return acc
		}, {} as Record<string, number>)
		
		const avgProgress = kpis.length > 0
			? kpis.reduce((sum, kpi) => sum + kpi.progress, 0) / kpis.length
			: 0
		
		return {
			data: {
				total: kpis.length,
				onTrack: kpis.filter(k => k.status === 'on-track').length,
				atRisk: kpis.filter(k => k.status === 'at-risk').length,
				behind: kpis.filter(k => k.status === 'behind').length,
				achieved: kpis.filter(k => k.status === 'achieved').length,
				averageProgress: Math.round(avgProgress),
				byCategory,
				byDepartment,
			},
			success: true,
		}
	}
	
	/**
	 * Link OKR to KPI
	 */
	async linkObjective(kpiId: string, objectiveId: string): Promise<ApiResponse<KPI>> {
		const kpis = storage.get<KPI[]>(this.STORAGE_KEY) || []
		const index = kpis.findIndex(k => k.id === kpiId)
		
		if (index === -1) {
			throw new Error('KPI not found')
		}
		
		const linkedObjectives = kpis[index].linkedObjectives || []
		if (!linkedObjectives.includes(objectiveId)) {
			linkedObjectives.push(objectiveId)
		}
		
		kpis[index] = {
			...kpis[index],
			linkedObjectives,
			updatedAt: new Date().toISOString(),
		}
		
		storage.set(this.STORAGE_KEY, kpis)
		
		return {
			data: kpis[index],
			message: 'Objective linked to KPI successfully',
			success: true,
		}
	}
	
	/**
	 * Unlink OKR from KPI
	 */
	async unlinkObjective(kpiId: string, objectiveId: string): Promise<ApiResponse<KPI>> {
		const kpis = storage.get<KPI[]>(this.STORAGE_KEY) || []
		const index = kpis.findIndex(k => k.id === kpiId)
		
		if (index === -1) {
			throw new Error('KPI not found')
		}
		
		const linkedObjectives = (kpis[index].linkedObjectives || []).filter(id => id !== objectiveId)
		
		kpis[index] = {
			...kpis[index],
			linkedObjectives,
			updatedAt: new Date().toISOString(),
		}
		
		storage.set(this.STORAGE_KEY, kpis)
		
		return {
			data: kpis[index],
			message: 'Objective unlinked from KPI successfully',
			success: true,
		}
	}
}

export const kpiService = new KPIService()
