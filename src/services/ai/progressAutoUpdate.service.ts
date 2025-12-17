/**
 * Progress Auto-Update Service
 * Work Entry → Task → Key Result → OKR → KPI 자동 진척도 업데이트
 */

import { storage } from '../../utils/storage'
import type { WorkEntry } from '../../types/common.types'
import type { Objective, KeyResult } from '../../types/okr.types'
import type { KPI } from '../../types/kpi.types'
import type { TaskRecommendation } from '../../types/common.types'

/**
 * 진척도 자동 업데이트 서비스
 */
export class ProgressAutoUpdateService {
	
	/**
	 * Work Entry 완료 시 모든 연결된 엔티티의 진척도 업데이트
	 */
	async updateProgressFromWorkEntry(workEntry: WorkEntry): Promise<void> {
		// 1. 연결된 Task 찾기
		if (workEntry.taskId) {
			await this.updateTaskProgress(workEntry.taskId, workEntry)
		}
		
		// 2. 연결된 Key Result 찾기
		if (workEntry.keyResultId) {
			await this.updateKeyResultProgress(workEntry.keyResultId, workEntry)
		}
		
		// 3. 연결된 OKR 찾기
		if (workEntry.objectiveId) {
			await this.updateObjectiveProgress(workEntry.objectiveId)
		}
		
		// 4. 프로젝트 진척도 업데이트
		if (workEntry.projectId) {
			await this.updateProjectProgress(workEntry.projectId)
		}
	}
	
	/**
	 * Task 진척도 업데이트
	 */
	private async updateTaskProgress(taskId: string, workEntry: WorkEntry): Promise<void> {
		// AI tasks와 Manual tasks 모두 확인
		const aiTasks = storage.get<TaskRecommendation[]>('ai_recommendations') || []
		const manualTasks = storage.get<TaskRecommendation[]>('manual_tasks') || []
		
		let allTasks = [...aiTasks, ...manualTasks]
		const taskIndex = allTasks.findIndex(t => t.id === taskId)
		
		if (taskIndex !== -1) {
			const task = allTasks[taskIndex]
			
			// Task를 completed로 업데이트
			task.status = 'completed'
			task.completedAt = new Date().toISOString()
			
			// completedWorkEntries 배열에 추가
			if (!task.completedWorkEntries) {
				task.completedWorkEntries = []
			}
			task.completedWorkEntries.push(workEntry.id)
			
			// 저장
			if (task.source === 'ai') {
				const index = aiTasks.findIndex(t => t.id === taskId)
				if (index !== -1) {
					aiTasks[index] = task
					storage.set('ai_recommendations', aiTasks)
				}
			} else {
				const index = manualTasks.findIndex(t => t.id === taskId)
				if (index !== -1) {
					manualTasks[index] = task
					storage.set('manual_tasks', manualTasks)
				}
			}
			
			// Task가 완료되면 연결된 Key Result 진척도 업데이트
			if (task.keyResultId) {
				await this.updateKeyResultProgress(task.keyResultId, workEntry)
			}
			
			// Task가 완료되면 연결된 Objective 진척도 업데이트
			if (task.objectiveId) {
				await this.updateObjectiveProgress(task.objectiveId)
			}
		}
	}
	
	/**
	 * Key Result 진척도 업데이트
	 */
	private async updateKeyResultProgress(keyResultId: string, workEntry: WorkEntry): Promise<void> {
		const objectives = storage.get<Objective[]>('objectives') || []
		
		let updated = false
		objectives.forEach(objective => {
			const krIndex = objective.keyResults.findIndex(kr => kr.id === keyResultId)
			if (krIndex !== -1) {
				// Key Result의 current 값 증가
				// Work Entry의 duration 또는 고정 증가량 사용
				const increment = workEntry.duration ? Math.ceil(workEntry.duration / 60) : 1
				objective.keyResults[krIndex].current += increment
				
				// Target을 초과하지 않도록
				if (objective.keyResults[krIndex].current > objective.keyResults[krIndex].target) {
					objective.keyResults[krIndex].current = objective.keyResults[krIndex].target
				}
				
				updated = true
			}
		})
		
		if (updated) {
			storage.set('objectives', objectives)
		}
	}
	
	/**
	 * Objective 진척도 업데이트 (Key Results 기반)
	 */
	private async updateObjectiveProgress(objectiveId: string): Promise<void> {
		const objectives = storage.get<Objective[]>('objectives') || []
		const objIndex = objectives.findIndex(o => o.id === objectiveId)
		
		if (objIndex !== -1) {
			const objective = objectives[objIndex]
			
			// 모든 Key Results의 평균 진척률 계산
			if (objective.keyResults.length > 0) {
				const totalProgress = objective.keyResults.reduce((sum, kr) => {
					return sum + (kr.current / kr.target) * 100
				}, 0)
				
				const avgProgress = totalProgress / objective.keyResults.length
				
				// Status 업데이트
				if (avgProgress >= 100) {
					objective.status = 'completed'
				} else if (avgProgress >= 70) {
					objective.status = 'on-track'
				} else if (avgProgress >= 40) {
					objective.status = 'at-risk'
				} else {
					objective.status = 'behind'
				}
				
				// OKR이 연결된 KPI 업데이트
				if (objective.kpiId) {
					await this.updateKPIProgress(objective.kpiId)
				}
			}
			
			objectives[objIndex] = objective
			storage.set('objectives', objectives)
		}
	}
	
	/**
	 * KPI 진척도 업데이트 (연결된 OKRs 기반)
	 */
	private async updateKPIProgress(kpiId: string): Promise<void> {
		const kpis = storage.get<KPI[]>('kpis') || []
		const kpiIndex = kpis.findIndex(k => k.id === kpiId)
		
		if (kpiIndex !== -1) {
			const kpi = kpis[kpiIndex]
			
			// 연결된 모든 OKRs 찾기
			const objectives = storage.get<Objective[]>('objectives') || []
			const linkedObjectives = objectives.filter(o => o.kpiId === kpiId)
			
			if (linkedObjectives.length > 0) {
				// 각 OKR의 기여도를 고려한 가중 평균 계산
				let totalContribution = 0
				let weightedProgress = 0
				
				linkedObjectives.forEach(obj => {
					const contribution = obj.kpiContribution || 0
					const objProgress = obj.keyResults.length > 0
						? obj.keyResults.reduce((sum, kr) => sum + (kr.current / kr.target) * 100, 0) / obj.keyResults.length
						: 0
					
					weightedProgress += objProgress * (contribution / 100)
					totalContribution += contribution
				})
				
				// KPI current 값 업데이트
				// 진척률을 실제 값으로 변환
				const progressRate = totalContribution > 0 ? weightedProgress / totalContribution : 0
				kpi.metric.current = Math.round((kpi.metric.target * progressRate) / 100)
				
				// Progress와 Status 재계산
				kpi.progress = Math.min((kpi.metric.current / kpi.metric.target) * 100, 100)
				
				if (kpi.progress >= 100) {
					kpi.status = 'achieved'
				} else if (kpi.progress >= 70) {
					kpi.status = 'on-track'
				} else if (kpi.progress >= 40) {
					kpi.status = 'at-risk'
				} else {
					kpi.status = 'behind'
				}
				
				kpi.updatedAt = new Date().toISOString()
			}
			
			kpis[kpiIndex] = kpi
			storage.set('kpis', kpis)
		}
	}
	
	/**
	 * Project 진척도 업데이트
	 */
	private async updateProjectProgress(projectId: string): Promise<void> {
		const projects = storage.get<any[]>('projects') || []
		const projectIndex = projects.findIndex(p => p.id === projectId)
		
		if (projectIndex !== -1) {
			const project = projects[projectIndex]
			
			// 프로젝트의 모든 Work Entries 계산
			const workEntries = storage.get<WorkEntry[]>('workEntries') || []
			const projectEntries = workEntries.filter(we => we.projectId === projectId)
			
			// 진척도 계산 (간단한 방식: 완료된 task 비율)
			const allTasks = [...(storage.get<TaskRecommendation[]>('ai_recommendations') || []), 
			                  ...(storage.get<TaskRecommendation[]>('manual_tasks') || [])]
			const projectTasks = allTasks.filter(t => t.projectId === projectId)
			
			if (projectTasks.length > 0) {
				const completedTasks = projectTasks.filter(t => t.status === 'completed').length
				project.progress = Math.round((completedTasks / projectTasks.length) * 100)
			}
			
			projects[projectIndex] = project
			storage.set('projects', projects)
		}
	}
	
	/**
	 * 전체 진척도 재계산 (데이터 동기화용)
	 */
	async recalculateAllProgress(): Promise<void> {
		// 1. 모든 Objectives의 진척도 계산
		const objectives = storage.get<Objective[]>('objectives') || []
		objectives.forEach(obj => {
			this.updateObjectiveProgress(obj.id)
		})
		
		// 2. 모든 KPIs의 진척도 계산
		const kpis = storage.get<KPI[]>('kpis') || []
		kpis.forEach(kpi => {
			this.updateKPIProgress(kpi.id)
		})
	}
}

export const progressAutoUpdateService = new ProgressAutoUpdateService()
