/**
 * OKR AI Recommendation Service
 * AI 기반 OKR 추천 시스템
 */

import type { Objective, KeyResult } from '../../types/okr.types'
import type { Project, WorkEntry } from '../../types/common.types'
import { differenceInDays, startOfQuarter, endOfQuarter, format } from 'date-fns'

/**
 * OKR 추천 인터페이스
 */
export interface OKRRecommendation {
	id: string
	type: 'objective' | 'key_result'
	title: string
	description: string
	reasoning: string[]
	confidence: number // 0-1
	priority: 'high' | 'medium' | 'low'
	suggestedPeriod?: string
	suggestedOwner?: string
	suggestedTarget?: number
	suggestedUnit?: string
	relatedData?: {
		projectIds?: string[]
		kpiIds?: string[]
		workEntryIds?: string[]
	}
	category: string
	status: 'pending' | 'accepted' | 'rejected'
	createdAt: Date
	parentObjectiveId?: string // For Key Result recommendations
}

/**
 * OKR 추천 인사이트
 */
export interface OKRInsight {
	type: 'gap' | 'progress' | 'alignment' | 'suggestion'
	title: string
	description: string
	severity: 'high' | 'medium' | 'low'
	actionable: boolean
}

/**
 * OKR 분석 결과
 */
export interface OKRAnalysisResult {
	recommendations: OKRRecommendation[]
	insights: OKRInsight[]
	summary: {
		totalRecommendations: number
		objectiveCount: number
		keyResultCount: number
		highPriority: number
		categories: Record<string, number>
	}
}

/**
 * OKR AI 추천 서비스
 */
export class OKRRecommendationService {
	/**
	 * OKR 추천 생성
	 */
	async generateRecommendations(
		existingObjectives: Objective[],
		projects: Project[],
		workEntries: WorkEntry[],
		userContext?: { id: string; name: string; department?: string }
	): Promise<OKRAnalysisResult> {
		const recommendations: OKRRecommendation[] = []
		const insights: OKRInsight[] = []

		// 1. 프로젝트 기반 Objective 추천
		const projectRecs = this.analyzeProjects(projects, existingObjectives)
		recommendations.push(...projectRecs.recommendations)
		insights.push(...projectRecs.insights)

		// 2. 업무 패턴 기반 Objective 추천
		const workPatternRecs = this.analyzeWorkPatterns(workEntries, existingObjectives)
		recommendations.push(...workPatternRecs.recommendations)
		insights.push(...workPatternRecs.insights)

		// 3. 기존 OKR 갭 분석
		const gapRecs = this.analyzeOKRGaps(existingObjectives)
		recommendations.push(...gapRecs.recommendations)
		insights.push(...gapRecs.insights)

		// 4. Key Result 추천 (기존 Objective에 대해)
		const krRecs = this.suggestKeyResults(existingObjectives, projects, workEntries)
		recommendations.push(...krRecs.recommendations)
		insights.push(...krRecs.insights)

		// 5. 요약 생성
		const summary = this.generateSummary(recommendations)

		return { recommendations, insights, summary }
	}

	/**
	 * 프로젝트 기반 Objective 추천
	 */
	private analyzeProjects(
		projects: Project[],
		existingObjectives: Objective[]
	): {
		recommendations: OKRRecommendation[]
		insights: OKRInsight[]
	} {
		const recommendations: OKRRecommendation[] = []
		const insights: OKRInsight[] = []

		// 활성 프로젝트 중 OKR이 없는 프로젝트 찾기
		const activeProjects = projects.filter(
			(p) => p.status === 'active' || p.status === 'planning'
		)

		const projectsWithoutOKR = activeProjects.filter((project) => {
			// 프로젝트 이름이 OKR 제목에 포함되어 있는지 확인
			return !existingObjectives.some((obj) =>
				obj.title.toLowerCase().includes(project.name.toLowerCase())
			)
		})

		if (projectsWithoutOKR.length > 0) {
			insights.push({
				type: 'gap',
				title: 'OKR이 없는 프로젝트 발견',
				description: `${projectsWithoutOKR.length}개의 활성 프로젝트에 연결된 OKR이 없습니다.`,
				severity: 'medium',
				actionable: true,
			})
		}

		// 각 프로젝트에 대한 Objective 추천
		projectsWithoutOKR.slice(0, 3).forEach((project) => {
			const reasoning = [
				`활성 프로젝트 "${project.name}"에 대한 OKR이 없습니다.`,
				`프로젝트 진행률: ${project.progress}%`,
			]

			if (project.priority === 'high') {
				reasoning.push('높은 우선순위 프로젝트입니다.')
			}

			const daysUntilEnd = differenceInDays(
				new Date(project.endDate),
				new Date()
			)
			if (daysUntilEnd < 30) {
				reasoning.push(`마감일까지 ${daysUntilEnd}일 남았습니다.`)
			}

			recommendations.push({
				id: `obj-project-${project.id}-${Date.now()}`,
				type: 'objective',
				title: `Complete ${project.name}`,
				description: project.description || `Successfully deliver ${project.name} project`,
				reasoning,
				confidence: project.priority === 'high' ? 0.9 : 0.75,
				priority: project.priority || 'medium',
				suggestedPeriod: format(new Date(), 'yyyy-Q'),
				category: 'Project Delivery',
				status: 'pending',
				createdAt: new Date(),
				relatedData: {
					projectIds: [project.id],
				},
			})
		})

		return { recommendations, insights }
	}

	/**
	 * 업무 패턴 기반 Objective 추천
	 */
	private analyzeWorkPatterns(
		workEntries: WorkEntry[],
		existingObjectives: Objective[]
	): {
		recommendations: OKRRecommendation[]
		insights: OKRInsight[]
	} {
		const recommendations: OKRRecommendation[] = []
		const insights: OKRInsight[] = []

		// 최근 30일 업무 분석
		const thirtyDaysAgo = new Date()
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

		const recentEntries = workEntries.filter(
			(entry) => new Date(entry.date) >= thirtyDaysAgo
		)

		// 카테고리별 업무 시간 집계
		const categoryHours: Record<string, number> = {}
		recentEntries.forEach((entry) => {
			if (entry.category) {
				categoryHours[entry.category] =
					(categoryHours[entry.category] || 0) + (entry.duration || 0)
			}
		})

		// 많은 시간을 투자한 카테고리에 대한 추천
		const topCategories = Object.entries(categoryHours)
			.sort(([, a], [, b]) => b - a)
			.slice(0, 3)

		topCategories.forEach(([category, hours]) => {
			// 해당 카테고리에 OKR이 있는지 확인
			const hasOKR = existingObjectives.some((obj) =>
				obj.title.toLowerCase().includes(category.toLowerCase())
			)

			if (!hasOKR && hours > 40) {
				// 40시간 이상 투자한 카테고리
				recommendations.push({
					id: `obj-pattern-${category}-${Date.now()}`,
					type: 'objective',
					title: `Improve ${category} Performance`,
					description: `Enhance efficiency and quality in ${category} related work`,
					reasoning: [
						`최근 30일간 ${category}에 ${Math.round(hours)}시간 투자`,
						'해당 영역에 대한 OKR이 없습니다.',
						'체계적인 목표 설정으로 효율성을 높일 수 있습니다.',
					],
					confidence: hours > 80 ? 0.85 : 0.7,
					priority: hours > 80 ? 'high' : 'medium',
					suggestedPeriod: format(new Date(), 'yyyy-Q'),
					category: category,
					status: 'pending',
					createdAt: new Date(),
					relatedData: {
						workEntryIds: recentEntries
							.filter((e) => e.category === category)
							.map((e) => e.id),
					},
				})
			}
		})

		if (recommendations.length > 0) {
			insights.push({
				type: 'suggestion',
				title: '업무 패턴 기반 추천',
				description: `최근 업무 패턴을 분석하여 ${recommendations.length}개의 OKR을 추천합니다.`,
				severity: 'medium',
				actionable: true,
			})
		}

		return { recommendations, insights }
	}

	/**
	 * OKR 갭 분석
	 */
	private analyzeOKRGaps(existingObjectives: Objective[]): {
		recommendations: OKRRecommendation[]
		insights: OKRInsight[]
	} {
		const recommendations: OKRRecommendation[] = []
		const insights: OKRInsight[] = []

		// 1. OKR이 전혀 없는 경우
		if (existingObjectives.length === 0) {
			insights.push({
				type: 'gap',
				title: 'OKR이 없습니다',
				description: '개인 목표를 설정하여 체계적으로 업무를 관리하세요.',
				severity: 'high',
				actionable: true,
			})

			// 기본 추천 OKR 제공
			const defaultRecommendations = this.getDefaultOKRRecommendations()
			recommendations.push(...defaultRecommendations)
		}

		// 2. 현재 분기 OKR 확인
		const currentQuarterStart = startOfQuarter(new Date())
		const currentQuarterEnd = endOfQuarter(new Date())
		const currentPeriod = format(new Date(), 'yyyy-Q')

		const currentQuarterOKRs = existingObjectives.filter((obj) => {
			return (
				obj.period === currentPeriod ||
				obj.quarter === `Q${Math.floor(new Date().getMonth() / 3) + 1}`
			)
		})

		if (currentQuarterOKRs.length === 0 && existingObjectives.length > 0) {
			insights.push({
				type: 'gap',
				title: '현재 분기 OKR 없음',
				description: '이번 분기에 집중할 목표를 설정하세요.',
				severity: 'high',
				actionable: true,
			})
		}

		// 3. Key Result가 부족한 Objective
		const objectivesWithFewKRs = existingObjectives.filter(
			(obj) => obj.keyResults.length < 2
		)

		if (objectivesWithFewKRs.length > 0) {
			insights.push({
				type: 'gap',
				title: 'Key Result가 부족한 Objective',
				description: `${objectivesWithFewKRs.length}개의 Objective에 Key Result가 부족합니다. 각 Objective는 2-5개의 Key Result를 가지는 것이 좋습니다.`,
				severity: 'medium',
				actionable: true,
			})
		}

		return { recommendations, insights }
	}

	/**
	 * Key Result 추천
	 */
	private suggestKeyResults(
		existingObjectives: Objective[],
		projects: Project[],
		workEntries: WorkEntry[]
	): {
		recommendations: OKRRecommendation[]
		insights: OKRInsight[]
	} {
		const recommendations: OKRRecommendation[] = []
		const insights: OKRInsight[] = []

		// Key Result가 부족한 Objective에 대해 추천
		existingObjectives.forEach((objective) => {
			if (objective.keyResults.length < 3) {
				const suggestedKRs = this.generateKeyResultsForObjective(
					objective,
					projects,
					workEntries
				)
				recommendations.push(...suggestedKRs)
			}
		})

		return { recommendations, insights }
	}

	/**
	 * Objective에 대한 Key Result 생성
	 */
	private generateKeyResultsForObjective(
		objective: Objective,
		projects: Project[],
		workEntries: WorkEntry[]
	): OKRRecommendation[] {
		const recommendations: OKRRecommendation[] = []
		const currentKRCount = objective.keyResults.length

		// 일반적인 Key Result 패턴
		const krPatterns = [
			{
				title: `Increase completion rate to 95%`,
				description: 'Track overall completion percentage',
				target: 95,
				unit: '%',
				reasoning: ['완료율 추적으로 진행 상황을 명확히 할 수 있습니다.'],
			},
			{
				title: `Reduce cycle time by 30%`,
				description: 'Improve efficiency and speed',
				target: 30,
				unit: '%',
				reasoning: ['효율성 개선으로 더 빠른 결과 달성이 가능합니다.'],
			},
			{
				title: `Achieve 90% stakeholder satisfaction`,
				description: 'Maintain high quality standards',
				target: 90,
				unit: '%',
				reasoning: ['품질 유지를 위한 만족도 측정이 중요합니다.'],
			},
			{
				title: `Complete 10 key milestones`,
				description: 'Track milestone completion',
				target: 10,
				unit: 'milestones',
				reasoning: ['마일스톤 기반 진행 상황 추적이 효과적입니다.'],
			},
		]

		// 부족한 만큼 추천
		const neededKRs = Math.min(3 - currentKRCount, 2)
		krPatterns.slice(0, neededKRs).forEach((pattern, index) => {
			recommendations.push({
				id: `kr-${objective.id}-${Date.now()}-${index}`,
				type: 'key_result',
				title: pattern.title,
				description: pattern.description,
				reasoning: [
					`Objective "${objective.title}"에 대한 Key Result 추천`,
					...pattern.reasoning,
				],
				confidence: 0.7,
				priority: 'medium',
				suggestedTarget: pattern.target,
				suggestedUnit: pattern.unit,
				category: 'Key Result',
				status: 'pending',
				createdAt: new Date(),
				parentObjectiveId: objective.id,
			})
		})

		return recommendations
	}

	/**
	 * 기본 OKR 추천 (OKR이 없을 때)
	 */
	private getDefaultOKRRecommendations(): OKRRecommendation[] {
		const currentPeriod = format(new Date(), 'yyyy-Q')
		
		return [
			{
				id: `obj-default-productivity-${Date.now()}`,
				type: 'objective',
				title: 'Improve Personal Productivity',
				description: 'Enhance work efficiency and output quality',
				reasoning: [
					'개인 생산성 향상은 모든 업무의 기초입니다.',
					'측정 가능한 목표로 꾸준한 개선이 가능합니다.',
				],
				confidence: 0.8,
				priority: 'high',
				suggestedPeriod: currentPeriod,
				category: 'Personal Development',
				status: 'pending',
				createdAt: new Date(),
			},
			{
				id: `obj-default-skill-${Date.now()}`,
				type: 'objective',
				title: 'Develop New Skills',
				description: 'Acquire new competencies for career growth',
				reasoning: [
					'지속적인 학습으로 경쟁력을 강화할 수 있습니다.',
					'새로운 기술은 업무 효율성을 높입니다.',
				],
				confidence: 0.75,
				priority: 'medium',
				suggestedPeriod: currentPeriod,
				category: 'Learning & Development',
				status: 'pending',
				createdAt: new Date(),
			},
			{
				id: `obj-default-collaboration-${Date.now()}`,
				type: 'objective',
				title: 'Strengthen Team Collaboration',
				description: 'Build better relationships and teamwork',
				reasoning: [
					'효과적인 협업은 팀 성과를 높입니다.',
					'커뮤니케이션 개선으로 업무 품질이 향상됩니다.',
				],
				confidence: 0.7,
				priority: 'medium',
				suggestedPeriod: currentPeriod,
				category: 'Collaboration',
				status: 'pending',
				createdAt: new Date(),
			},
		]
	}

	/**
	 * 요약 생성
	 */
	private generateSummary(
		recommendations: OKRRecommendation[]
	): OKRAnalysisResult['summary'] {
		const objectiveCount = recommendations.filter(
			(r) => r.type === 'objective'
		).length
		const keyResultCount = recommendations.filter(
			(r) => r.type === 'key_result'
		).length
		const highPriority = recommendations.filter(
			(r) => r.priority === 'high'
		).length

		const categories: Record<string, number> = {}
		recommendations.forEach((rec) => {
			categories[rec.category] = (categories[rec.category] || 0) + 1
		})

		return {
			totalRecommendations: recommendations.length,
			objectiveCount,
			keyResultCount,
			highPriority,
			categories,
		}
	}
}

// Export singleton instance
export const okrRecommendationService = new OKRRecommendationService()

