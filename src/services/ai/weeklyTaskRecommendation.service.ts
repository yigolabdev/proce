/**
 * Weekly Task Recommendation Service
 * 주간 자동 Task 추천 시스템
 */

import { storage } from '../../utils/storage'
import type { TaskRecommendation } from '../../types/common.types'
import type { Objective } from '../../types/okr.types'
import type { KPI } from '../../types/kpi.types'

/**
 * 주간 추천 Task
 */
export interface WeeklyRecommendedTask {
	task: TaskRecommendation
	reason: string
	urgency: 'high' | 'medium' | 'low'
	estimatedTime: number  // minutes
	relatedKPI?: string
	relatedOKR?: string
}

/**
 * 주간 Task 추천 서비스
 */
export class WeeklyTaskRecommendationService {
	
	/**
	 * 이번 주 추천 Tasks 생성
	 */
	async generateWeeklyRecommendations(userId: string): Promise<WeeklyRecommendedTask[]> {
		const recommendations: WeeklyRecommendedTask[] = []
		
		// 1. 긴급한 Tasks (마감일 임박)
		const urgentTasks = await this.getUrgentTasks(userId)
		recommendations.push(...urgentTasks)
		
		// 2. OKR 진척이 느린 Tasks
		const behindTasks = await this.getTasksFromBehindOKRs(userId)
		recommendations.push(...behindTasks)
		
		// 3. KPI 달성에 중요한 Tasks
		const criticalTasks = await this.getCriticalKPITasks(userId)
		recommendations.push(...criticalTasks)
		
		// 4. 아직 시작 안 한 High Priority Tasks
		const highPriorityTasks = await this.getUnstartedHighPriorityTasks(userId)
		recommendations.push(...highPriorityTasks)
		
		// 중복 제거 및 정렬
		const uniqueRecommendations = this.deduplicateAndSort(recommendations)
		
		// 상위 5-10개만 반환
		return uniqueRecommendations.slice(0, 10)
	}
	
	/**
	 * 긴급한 Tasks (마감일 7일 이내)
	 */
	private async getUrgentTasks(userId: string): Promise<WeeklyRecommendedTask[]> {
		const aiTasks = storage.get<TaskRecommendation[]>('ai_recommendations') || []
		const manualTasks = storage.get<TaskRecommendation[]>('manual_tasks') || []
		const allTasks = [...aiTasks, ...manualTasks]
		
		const now = new Date()
		const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
		
		return allTasks
			.filter(task => {
				if (task.status !== 'pending' && task.status !== 'accepted') return false
				if (!task.deadline) return false
				
				const deadline = new Date(task.deadline)
				return deadline >= now && deadline <= sevenDaysLater
			})
			.map(task => {
				const deadline = new Date(task.deadline!)
				const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
				
				return {
					task,
					reason: `마감일이 ${daysLeft}일 남았습니다`,
					urgency: daysLeft <= 2 ? 'high' : daysLeft <= 5 ? 'medium' : 'low',
					estimatedTime: task.estimatedDuration || 120,
					relatedOKR: task.objectiveId,
					relatedKPI: task.kpiId,
				} as WeeklyRecommendedTask
			})
	}
	
	/**
	 * 진척이 느린 OKR의 Tasks
	 */
	private async getTasksFromBehindOKRs(userId: string): Promise<WeeklyRecommendedTask[]> {
		const objectives = storage.get<Objective[]>('objectives') || []
		const behindObjectives = objectives.filter(o => o.status === 'behind' || o.status === 'at-risk')
		
		const aiTasks = storage.get<TaskRecommendation[]>('ai_recommendations') || []
		const manualTasks = storage.get<TaskRecommendation[]>('manual_tasks') || []
		const allTasks = [...aiTasks, ...manualTasks]
		
		const recommendations: WeeklyRecommendedTask[] = []
		
		behindObjectives.forEach(obj => {
			const objTasks = allTasks.filter(t => 
				t.objectiveId === obj.id && 
				(t.status === 'pending' || t.status === 'accepted')
			)
			
			objTasks.forEach(task => {
				recommendations.push({
					task,
					reason: `"${obj.title}" OKR이 ${obj.status === 'behind' ? '지연' : '위험'} 상태입니다`,
					urgency: obj.status === 'behind' ? 'high' : 'medium',
					estimatedTime: task.estimatedDuration || 120,
					relatedOKR: obj.id,
					relatedKPI: obj.kpiId,
				})
			})
		})
		
		return recommendations
	}
	
	/**
	 * Critical KPI에 연결된 Tasks
	 */
	private async getCriticalKPITasks(userId: string): Promise<WeeklyRecommendedTask[]> {
		const kpis = storage.get<KPI[]>('kpis') || []
		const criticalKPIs = kpis.filter(k => 
			k.priority === 'critical' || k.priority === 'high'
		)
		
		const aiTasks = storage.get<TaskRecommendation[]>('ai_recommendations') || []
		const manualTasks = storage.get<TaskRecommendation[]>('manual_tasks') || []
		const allTasks = [...aiTasks, ...manualTasks]
		
		const recommendations: WeeklyRecommendedTask[] = []
		
		criticalKPIs.forEach(kpi => {
			const kpiTasks = allTasks.filter(t => 
				t.kpiId === kpi.id && 
				(t.status === 'pending' || t.status === 'accepted')
			)
			
			kpiTasks.slice(0, 2).forEach(task => {  // KPI당 최대 2개
				recommendations.push({
					task,
					reason: `${kpi.priority === 'critical' ? '최우선' : '중요'} KPI "${kpi.name}" 달성에 필요합니다`,
					urgency: kpi.priority === 'critical' ? 'high' : 'medium',
					estimatedTime: task.estimatedDuration || 120,
					relatedKPI: kpi.id,
					relatedOKR: task.objectiveId,
				})
			})
		})
		
		return recommendations
	}
	
	/**
	 * 아직 시작 안 한 High Priority Tasks
	 */
	private async getUnstartedHighPriorityTasks(userId: string): Promise<WeeklyRecommendedTask[]> {
		const aiTasks = storage.get<TaskRecommendation[]>('ai_recommendations') || []
		const manualTasks = storage.get<TaskRecommendation[]>('manual_tasks') || []
		const allTasks = [...aiTasks, ...manualTasks]
		
		return allTasks
			.filter(task => 
				task.priority === 'high' && 
				task.status === 'pending'
			)
			.slice(0, 3)  // 최대 3개
			.map(task => ({
				task,
				reason: '높은 우선순위로 빠른 시작이 필요합니다',
				urgency: 'medium' as const,
				estimatedTime: task.estimatedDuration || 120,
				relatedOKR: task.objectiveId,
				relatedKPI: task.kpiId,
			}))
	}
	
	/**
	 * 중복 제거 및 정렬
	 */
	private deduplicateAndSort(recommendations: WeeklyRecommendedTask[]): WeeklyRecommendedTask[] {
		// Task ID 기준 중복 제거
		const seen = new Set<string>()
		const unique = recommendations.filter(rec => {
			if (seen.has(rec.task.id)) return false
			seen.add(rec.task.id)
			return true
		})
		
		// 긴급도 순으로 정렬
		return unique.sort((a, b) => {
			const urgencyOrder = { high: 0, medium: 1, low: 2 }
			const urgencyDiff = urgencyOrder[a.urgency] - urgencyOrder[b.urgency]
			
			if (urgencyDiff !== 0) return urgencyDiff
			
			// 긴급도가 같으면 예상 시간이 짧은 것 우선
			return a.estimatedTime - b.estimatedTime
		})
	}
	
	/**
	 * 주간 요약 생성
	 */
	async generateWeeklySummary(userId: string): Promise<{
		totalRecommendations: number
		urgentTasks: number
		estimatedTotalTime: number
		topPriorities: WeeklyRecommendedTask[]
		byCategory: Record<string, number>
	}> {
		const recommendations = await this.generateWeeklyRecommendations(userId)
		
		const byCategory = recommendations.reduce((acc, rec) => {
			const category = rec.task.category || 'Other'
			acc[category] = (acc[category] || 0) + 1
			return acc
		}, {} as Record<string, number>)
		
		return {
			totalRecommendations: recommendations.length,
			urgentTasks: recommendations.filter(r => r.urgency === 'high').length,
			estimatedTotalTime: recommendations.reduce((sum, r) => sum + r.estimatedTime, 0),
			topPriorities: recommendations.slice(0, 5),
			byCategory,
		}
	}
	
	/**
	 * 자동 알림 생성 (매주 월요일 아침)
	 */
	async createWeeklyNotification(userId: string): Promise<void> {
		const summary = await this.generateWeeklySummary(userId)
		
		const messages = storage.get<any[]>('messages') || []
		const newMessage = {
			id: `msg-weekly-${Date.now()}`,
			type: 'task_assigned',
			priority: summary.urgentTasks > 0 ? 'urgent' : 'normal',
			subject: `이번 주 추천 Task ${summary.totalRecommendations}개`,
			from: 'AI Assistant',
			fromDepartment: 'System',
			preview: `긴급 ${summary.urgentTasks}개 포함, 총 예상 시간: ${Math.round(summary.estimatedTotalTime / 60)}시간`,
			content: this.generateNotificationContent(summary),
			timestamp: new Date(),
			isRead: false,
			isStarred: false,
			relatedType: 'weekly_tasks',
			aiSummary: `이번 주 집중해야 할 ${summary.totalRecommendations}개의 Task를 AI가 추천했습니다.`,
		}
		
		messages.unshift(newMessage)
		storage.set('messages', messages)
	}
	
	/**
	 * 알림 내용 생성
	 */
	private generateNotificationContent(summary: any): string {
		let content = `안녕하세요!\n\n이번 주 집중해야 할 Task ${summary.totalRecommendations}개를 AI가 분석하여 추천합니다.\n\n`
		
		content += `📊 요약:\n`
		content += `• 전체 추천 Task: ${summary.totalRecommendations}개\n`
		content += `• 긴급 Task: ${summary.urgentTasks}개\n`
		content += `• 예상 총 소요 시간: ${Math.round(summary.estimatedTotalTime / 60)}시간\n\n`
		
		content += `🎯 상위 우선순위 Tasks:\n\n`
		summary.topPriorities.forEach((rec: WeeklyRecommendedTask, index: number) => {
			content += `${index + 1}. ${rec.task.title}\n`
			content += `   ${rec.reason}\n`
			content += `   예상 시간: ${Math.round(rec.estimatedTime / 60)}시간\n\n`
		})
		
		content += `\n📌 AI Recommendations 페이지에서 전체 목록을 확인하고 작업을 시작하세요.`
		
		return content
	}
}

export const weeklyTaskRecommendationService = new WeeklyTaskRecommendationService()
