/**
 * AI Recommendation Service
 * AI 추천 로직 통합 (Inbox, AI Recommendations 페이지에서 공유)
 */

import { differenceInDays } from 'date-fns'
import type { WorkEntry, Project } from '../../types/common.types'

/**
 * Task Recommendation Interface
 */
export interface TaskRecommendation {
	id: string
	title: string
	description: string
	priority: 'high' | 'medium' | 'low'
	category: string
	deadline?: string
	dataSource: string
	status: 'pending' | 'accepted' | 'rejected'
	projectId?: string
	projectName?: string
	createdAt: Date
	confidence: number // 0-1
	reasoning: string[]
}

/**
 * Recommendation Insight
 */
export interface RecommendationInsight {
	type: 'gap' | 'inactive' | 'deadline' | 'info' | 'warning'
	metric: string
	value: string
	status: 'warning' | 'info' | 'urgent'
	description: string
}

/**
 * Analysis Result
 */
export interface AnalysisResult {
	recommendations: TaskRecommendation[]
	insights: RecommendationInsight[]
	summary: {
		totalRecommendations: number
		highPriority: number
		mediumPriority: number
		lowPriority: number
		categories: Record<string, number>
	}
}

/**
 * AI Recommendation Service
 */
export class AIRecommendationService {
	/**
	 * 전체 분석 수행
	 */
	async generateRecommendations(
		workEntries: WorkEntry[],
		projects: Project[]
	): Promise<AnalysisResult> {
		const recommendations: TaskRecommendation[] = []
		const insights: RecommendationInsight[] = []

		// 1. 업무 갭 분석
		const workGapRecs = this.analyzeWorkGaps(workEntries)
		recommendations.push(...workGapRecs.recommendations)
		insights.push(...workGapRecs.insights)

		// 2. 비활성 프로젝트 분석
		const inactiveRecs = this.analyzeInactiveProjects(workEntries, projects)
		recommendations.push(...inactiveRecs.recommendations)
		insights.push(...inactiveRecs.insights)

		// 3. 마감일 분석
		const deadlineRecs = this.analyzeDeadlines(projects)
		recommendations.push(...deadlineRecs.recommendations)
		insights.push(...deadlineRecs.insights)

		// 4. 요약 생성
		const summary = this.generateSummary(recommendations)

		return { recommendations, insights, summary }
	}

	/**
	 * 업무 갭 분석
	 */
	private analyzeWorkGaps(workEntries: WorkEntry[]): {
		recommendations: TaskRecommendation[]
		insights: RecommendationInsight[]
	} {
		const recommendations: TaskRecommendation[] = []
		const insights: RecommendationInsight[] = []

		if (workEntries.length === 0) {
			insights.push({
				type: 'gap',
				metric: 'Work Entries',
				value: '0',
				status: 'warning',
				description: 'No work entries found. Start logging your work!',
			})
			return { recommendations, insights }
		}

		// 최근 업무 확인
		const sortedEntries = [...workEntries].sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
		)
		const latestEntry = sortedEntries[0]
		const daysSinceLastWork = differenceInDays(new Date(), new Date(latestEntry.date))

		// 7일 이상 업무 기록 없음
		if (daysSinceLastWork > 7) {
			recommendations.push({
				id: `rec-gap-${Date.now()}`,
				title: 'Work Entry Gap Detected',
				description: `No work entries for ${daysSinceLastWork} days. Update your work log to keep track of progress.`,
				priority: daysSinceLastWork > 14 ? 'high' : 'medium',
				category: 'Work Log',
				dataSource: 'Work entry analysis',
				status: 'pending',
				createdAt: new Date(),
				confidence: 0.9,
				reasoning: [
					`Last work entry was ${daysSinceLastWork} days ago`,
					'Regular updates help track progress',
					'Prevents information loss',
				],
			})

			insights.push({
				type: 'gap',
				metric: 'Days Since Last Work',
				value: `${daysSinceLastWork} days`,
				status: daysSinceLastWork > 14 ? 'urgent' : 'warning',
				description: 'Consider updating your work log',
			})
		}

		// 주간 업무 패턴 분석
		const lastWeekEntries = workEntries.filter(entry => {
			const daysSince = differenceInDays(new Date(), new Date(entry.date))
			return daysSince <= 7
		})

		if (lastWeekEntries.length < 3) {
			insights.push({
				type: 'info',
				metric: 'Weekly Activity',
				value: `${lastWeekEntries.length} entries`,
				status: 'info',
				description: 'Low activity this week',
			})
		}

		return { recommendations, insights }
	}

	/**
	 * 비활성 프로젝트 분석
	 */
	private analyzeInactiveProjects(
		workEntries: WorkEntry[],
		projects: Project[]
	): {
		recommendations: TaskRecommendation[]
		insights: RecommendationInsight[]
	} {
		const recommendations: TaskRecommendation[] = []
		const insights: RecommendationInsight[] = []

		// 프로젝트별 최근 업무 확인
		const projectActivity = new Map<string, Date>()

		workEntries.forEach(entry => {
			if (entry.projectId) {
				const existing = projectActivity.get(entry.projectId)
				const entryDate = new Date(entry.date)
				if (!existing || entryDate > existing) {
					projectActivity.set(entry.projectId, entryDate)
				}
			}
		})

		// 활성 프로젝트 중 30일 이상 업무 없는 경우
		projects
			.filter(p => p.status === 'active')
			.forEach(project => {
				const lastActivity = projectActivity.get(project.id)

				if (!lastActivity) {
					// 프로젝트에 업무 기록이 없음
					recommendations.push({
						id: `rec-inactive-${project.id}`,
						title: `No Activity on "${project.name}"`,
						description: `Project "${project.name}" has no work entries. Consider adding work logs or updating project status.`,
						priority: 'medium',
						category: 'Project Management',
						dataSource: 'Project activity analysis',
						status: 'pending',
						projectId: project.id,
						projectName: project.name,
						createdAt: new Date(),
						confidence: 0.85,
						reasoning: [
							'No work entries found for this project',
							'Active projects should have regular updates',
						],
					})
				} else {
					const daysSinceActivity = differenceInDays(new Date(), lastActivity)

					if (daysSinceActivity > 30) {
						recommendations.push({
							id: `rec-inactive-${project.id}`,
							title: `Inactive Project: "${project.name}"`,
							description: `No activity for ${daysSinceActivity} days on "${project.name}". Review project status or add updates.`,
							priority: daysSinceActivity > 60 ? 'high' : 'medium',
							category: 'Project Management',
							dataSource: 'Project activity analysis',
							status: 'pending',
							projectId: project.id,
							projectName: project.name,
							createdAt: new Date(),
							confidence: 0.9,
							reasoning: [
								`Last activity was ${daysSinceActivity} days ago`,
								'Consider closing or reactivating',
							],
						})

						insights.push({
							type: 'inactive',
							metric: project.name,
							value: `${daysSinceActivity} days inactive`,
							status: daysSinceActivity > 60 ? 'urgent' : 'warning',
							description: 'Review project status',
						})
					}
				}
			})

		return { recommendations, insights }
	}

	/**
	 * 마감일 분석
	 */
	private analyzeDeadlines(projects: Project[]): {
		recommendations: TaskRecommendation[]
		insights: RecommendationInsight[]
	} {
		const recommendations: TaskRecommendation[] = []
		const insights: RecommendationInsight[] = []

		const now = new Date()

		projects
			.filter(p => p.status === 'active' && p.endDate)
			.forEach(project => {
				const endDate = project.endDate instanceof Date ? project.endDate : new Date(project.endDate)
				const daysUntilDeadline = differenceInDays(endDate, now)

				// 마감 7일 이내
				if (daysUntilDeadline <= 7 && daysUntilDeadline >= 0) {
					const endDateStr = project.endDate instanceof Date 
						? project.endDate.toISOString() 
						: project.endDate.toString()
					const endDateObj = project.endDate instanceof Date 
						? project.endDate 
						: new Date(project.endDate)
					
					recommendations.push({
						id: `rec-deadline-${project.id}`,
						title: `Upcoming Deadline: "${project.name}"`,
						description: `Project "${project.name}" deadline is in ${daysUntilDeadline} days (${endDateObj.toLocaleDateString()}). Ensure all tasks are completed.`,
						priority: daysUntilDeadline <= 3 ? 'high' : 'medium',
						category: 'Deadline',
						dataSource: 'Deadline analysis',
						status: 'pending',
						projectId: project.id,
						projectName: project.name,
						deadline: endDateStr,
						createdAt: new Date(),
						confidence: 1.0,
						reasoning: [
							`Deadline in ${daysUntilDeadline} days`,
							'Time-sensitive action required',
						],
					})

					insights.push({
						type: 'deadline',
						metric: project.name,
						value: `${daysUntilDeadline} days left`,
						status: daysUntilDeadline <= 3 ? 'urgent' : 'warning',
						description: 'Approaching deadline',
					})
				}

				// 마감일 지남
				if (daysUntilDeadline < 0) {
					const daysOverdue = Math.abs(daysUntilDeadline)

					recommendations.push({
						id: `rec-overdue-${project.id}`,
						title: `Overdue Project: "${project.name}"`,
						description: `Project "${project.name}" is ${daysOverdue} days overdue. Review and update project status or extend deadline.`,
						priority: 'high',
						category: 'Overdue',
						dataSource: 'Deadline analysis',
						status: 'pending',
						projectId: project.id,
						projectName: project.name,
						createdAt: new Date(),
						confidence: 1.0,
						reasoning: [
							`${daysOverdue} days past deadline`,
							'Immediate action required',
						],
					})

					insights.push({
						type: 'deadline',
						metric: project.name,
						value: `${daysOverdue} days overdue`,
						status: 'urgent',
						description: 'Project overdue',
					})
				}
			})

		return { recommendations, insights }
	}

	/**
	 * 요약 생성
	 */
	private generateSummary(recommendations: TaskRecommendation[]) {
		const categories: Record<string, number> = {}

		recommendations.forEach(rec => {
			categories[rec.category] = (categories[rec.category] || 0) + 1
		})

		return {
			totalRecommendations: recommendations.length,
			highPriority: recommendations.filter(r => r.priority === 'high').length,
			mediumPriority: recommendations.filter(r => r.priority === 'medium').length,
			lowPriority: recommendations.filter(r => r.priority === 'low').length,
			categories,
		}
	}

	/**
	 * 추천 수락
	 */
	async acceptRecommendation(recommendationId: string): Promise<void> {
		// TODO: 실제 구현에서는 storage에 저장
		console.log('Accepted recommendation:', recommendationId)
	}

	/**
	 * 추천 거절
	 */
	async rejectRecommendation(recommendationId: string): Promise<void> {
		// TODO: 실제 구현에서는 storage에 저장
		console.log('Rejected recommendation:', recommendationId)
	}
}

/**
 * 싱글톤 인스턴스
 */
export const aiRecommendationService = new AIRecommendationService()

