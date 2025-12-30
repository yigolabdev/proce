/**
 * Next Quarter Recommendation Service
 * 현재 분기 데이터 기반 다음 분기 KPI/OKR 자동 제안
 */

import type { KPI, KPICategory } from '../../types/kpi.types'
import type { Objective, KeyResult } from '../../types/common.types'
import type { WorkEntry, Project } from '../../types/common.types'
import { storage } from '../../utils/storage'
import { patternAnalyzerService, type ExecutionPattern } from '../analytics/patternAnalyzer.service'
import { successPredictorService } from '../analytics/successPredictor.service'
import { startOfQuarter, endOfQuarter, addQuarters, format } from 'date-fns'

/**
 * 다음 분기 추천
 */
export interface NextQuarterRecommendation {
	quarter: string  // "Q1 2025"
	generatedAt: string
	confidence: number  // 0-1
	
	currentQuarter: QuarterSummary
	nextQuarter: NextQuarterPlan
}

/**
 * 현재 분기 요약
 */
export interface QuarterSummary {
	period: string
	achievements: string[]
	lessons: string[]
	bottlenecks: string[]
	keyMetrics: {
		kpiAchievementRate: number
		okrCompletionRate: number
		projectSuccessRate: number
		teamProductivity: number
	}
}

/**
 * 다음 분기 계획
 */
export interface NextQuarterPlan {
	suggestedKPIs: SuggestedKPIWithContext[]
	suggestedOKRs: SuggestedOKRWithContext[]
	strategicFocus: StrategicFocus
	resourceAllocation: ResourceRecommendation[]
}

export interface SuggestedKPIWithContext {
	kpi: Partial<KPI>
	reasoning: string
	adjustmentFromCurrent: string
	confidence: number
	priority: 'critical' | 'high' | 'medium' | 'low'
	estimatedImpact: string
}

export interface SuggestedOKRWithContext {
	okr: Partial<Objective>
	basedOnPattern: string
	successProbability: number
	requiredActions: string[]
	linkedKPIs: string[]  // KPI IDs
}

export interface StrategicFocus {
	whatToDouble: FocusArea[]
	whatToStop: FocusArea[]
	newInitiatives: FocusArea[]
}

export interface FocusArea {
	area: string
	reasoning: string
	expectedImpact: string
}

export interface ResourceRecommendation {
	department: string
	currentAllocation: number
	recommendedAllocation: number
	reasoning: string
}

/**
 * 다음 분기 추천 서비스
 */
export class NextQuarterRecommendationService {
	/**
	 * 다음 분기 전체 추천 생성
	 */
	async generateNextQuarterRecommendations(): Promise<NextQuarterRecommendation> {
		// 1. 현재 분기 데이터 수집
		const currentQuarterSummary = await this.summarizeCurrentQuarter()

		// 2. 패턴 분석
		const patterns = await patternAnalyzerService.analyzeAllPatterns()

		// 3. 다음 분기 계획 생성
		const nextQuarterPlan = await this.generateNextQuarterPlan(
			currentQuarterSummary,
			patterns
		)

		// 4. 다음 분기 정보
		const nextQuarter = addQuarters(new Date(), 1)
		const quarterStr = `Q${Math.floor(nextQuarter.getMonth() / 3) + 1} ${nextQuarter.getFullYear()}`

		return {
			quarter: quarterStr,
			generatedAt: new Date().toISOString(),
			confidence: this.calculateOverallConfidence(patterns, currentQuarterSummary),
			currentQuarter: currentQuarterSummary,
			nextQuarter: nextQuarterPlan,
		}
	}

	/**
	 * 현재 분기 요약
	 */
	private async summarizeCurrentQuarter(): Promise<QuarterSummary> {
		const now = new Date()
		const quarterStart = startOfQuarter(now)
		const quarterEnd = endOfQuarter(now)

		const kpis = storage.get<KPI[]>('kpis', [])
		const objectives = storage.get<Objective[]>('objectives', [])
		const projects = storage.get<Project[]>('projects', [])
		const workEntries = storage.get<WorkEntry[]>('workEntries', [])

		// 이번 분기 데이터 필터링
		const quarterKPIs = kpis.filter(k => 
			new Date(k.startDate) <= quarterEnd && new Date(k.endDate) >= quarterStart
		)
		const quarterOKRs = objectives.filter(o => 
			new Date(o.startDate || '') <= quarterEnd && new Date(o.endDate || '') >= quarterStart
		)
		const quarterProjects = projects.filter(p => 
			new Date(p.startDate) <= quarterEnd && new Date(p.endDate) >= quarterStart
		)

		// 성과 계산
		const kpiAchievementRate = this.calculateKPIAchievementRate(quarterKPIs)
		const okrCompletionRate = this.calculateOKRCompletionRate(quarterOKRs)
		const projectSuccessRate = this.calculateProjectSuccessRate(quarterProjects)
		const teamProductivity = this.calculateTeamProductivity(workEntries)

		// 성과 분석
		const achievements = this.identifyAchievements(
			quarterKPIs,
			quarterOKRs,
			quarterProjects
		)

		// 교훈 추출
		const lessons = this.extractLessons(
			quarterKPIs,
			quarterOKRs,
			quarterProjects,
			workEntries
		)

		// 병목 현상 식별
		const bottlenecks = this.identifyBottlenecks(
			quarterProjects,
			quarterOKRs,
			workEntries
		)

		return {
			period: `${format(quarterStart, 'yyyy-MM-dd')} ~ ${format(quarterEnd, 'yyyy-MM-dd')}`,
			achievements,
			lessons,
			bottlenecks,
			keyMetrics: {
				kpiAchievementRate,
				okrCompletionRate,
				projectSuccessRate,
				teamProductivity,
			},
		}
	}

	/**
	 * 다음 분기 계획 생성
	 */
	private async generateNextQuarterPlan(
		currentSummary: QuarterSummary,
		patterns: ExecutionPattern
	): Promise<NextQuarterPlan> {
		// 1. KPI 추천
		const suggestedKPIs = await this.generateNextQuarterKPIs(currentSummary, patterns)

		// 2. OKR 추천
		const suggestedOKRs = await this.generateNextQuarterOKRs(
			currentSummary,
			patterns,
			suggestedKPIs
		)

		// 3. 전략적 포커스 결정
		const strategicFocus = this.determineStrategicFocus(currentSummary, patterns)

		// 4. 리소스 배분 추천
		const resourceAllocation = this.recommendResourceAllocation(currentSummary)

		return {
			suggestedKPIs,
			suggestedOKRs,
			strategicFocus,
			resourceAllocation,
		}
	}

	/**
	 * 다음 분기 KPI 생성
	 */
	private async generateNextQuarterKPIs(
		currentSummary: QuarterSummary,
		patterns: ExecutionPattern
	): Promise<SuggestedKPIWithContext[]> {
		const currentKPIs = storage.get<KPI[]>('kpis', [])
		const suggestions: SuggestedKPIWithContext[] = []

		// 1. 현재 KPI 중 지속할 것들 (조정)
		const continuingKPIs = currentKPIs.filter(k => k.status !== 'achieved')
		for (const kpi of continuingKPIs.slice(0, 5)) {
			const currentProgress = (kpi.metric.current / kpi.metric.target) * 100
			const adjustment = currentProgress >= 80 ? 1.2 : 1.1  // 20% 또는 10% 증가

			suggestions.push({
				kpi: {
					name: kpi.name,
					category: kpi.category,
					metric: {
						...kpi.metric,
						current: 0,
						target: Math.round(kpi.metric.target * adjustment),
					},
					period: 'quarter',
				},
				reasoning: `현재 KPI "${kpi.name}"의 성과(${Math.round(currentProgress)}%)를 바탕으로 목표를 상향 조정했습니다`,
				adjustmentFromCurrent: `+${Math.round((adjustment - 1) * 100)}% 목표 증가`,
				confidence: 0.85,
				priority: kpi.priority,
				estimatedImpact: '지속적인 성장 유지',
			})
		}

		// 2. 새로운 KPI 제안 (부족한 카테고리)
		const missingCategories = this.findMissingKPICategories(currentKPIs)
		for (const category of missingCategories.slice(0, 2)) {
			const newKPI = this.createNewKPIForCategory(category, currentSummary)
			if (newKPI) {
				suggestions.push(newKPI)
			}
		}

		// 3. 성공 패턴 기반 KPI
		if (patterns.successPatterns.length > 0) {
			const topPattern = patterns.successPatterns[0]
			// 패턴 기반 추가 KPI 로직...
		}

		return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 8)
	}

	/**
	 * 다음 분기 OKR 생성
	 */
	private async generateNextQuarterOKRs(
		currentSummary: QuarterSummary,
		patterns: ExecutionPattern,
		suggestedKPIs: SuggestedKPIWithContext[]
	): Promise<SuggestedOKRWithContext[]> {
		const suggestions: SuggestedOKRWithContext[] = []

		// 각 제안된 KPI에 대해 2-3개의 OKR 생성
		for (const kpiSuggestion of suggestedKPIs.slice(0, 3)) {
			const okrs = this.generateOKRsForKPI(kpiSuggestion, patterns)
			suggestions.push(...okrs)
		}

		return suggestions.slice(0, 10)
	}

	/**
	 * 전략적 포커스 결정
	 */
	private determineStrategicFocus(
		currentSummary: QuarterSummary,
		patterns: ExecutionPattern
	): StrategicFocus {
		const whatToDouble: FocusArea[] = []
		const whatToStop: FocusArea[] = []
		const newInitiatives: FocusArea[] = []

		// 1. 성공한 영역은 더 집중
		if (currentSummary.keyMetrics.kpiAchievementRate >= 80) {
			whatToDouble.push({
				area: '현재 KPI 전략',
				reasoning: `KPI 달성률 ${Math.round(currentSummary.keyMetrics.kpiAchievementRate)}%로 우수한 성과`,
				expectedImpact: '성공 패턴 강화 및 지속적 성장',
			})
		}

		// 2. 성공 패턴 중 가장 효과적인 것
		if (patterns.successPatterns.length > 0) {
			const topPattern = patterns.successPatterns[0]
			whatToDouble.push({
				area: topPattern.pattern.substring(0, 50),
				reasoning: `신뢰도 ${Math.round(topPattern.confidence * 100)}%의 검증된 성공 패턴`,
				expectedImpact: '재현 가능한 성공 구조 구축',
			})
		}

		// 3. 병목 현상이 있는 영역은 중단/개선
		if (currentSummary.bottlenecks.length > 0) {
			whatToStop.push({
				area: currentSummary.bottlenecks[0],
				reasoning: '반복적으로 발생하는 병목 현상',
				expectedImpact: '리소스 효율성 향상',
			})
		}

		// 4. 실패 패턴 기반 중단 항목
		if (patterns.failurePatterns.length > 0) {
			const topFailure = patterns.failurePatterns[0]
			whatToStop.push({
				area: topFailure.pattern.substring(0, 50),
				reasoning: `${topFailure.frequency}회 반복된 실패 패턴`,
				expectedImpact: '위험 요소 제거',
			})
		}

		// 5. 새로운 시도 (부족한 영역)
		if (currentSummary.keyMetrics.teamProductivity < 70) {
			newInitiatives.push({
				area: '팀 생산성 향상 프로그램',
				reasoning: `현재 생산성 ${Math.round(currentSummary.keyMetrics.teamProductivity)}%로 개선 여지 있음`,
				expectedImpact: '전체 목표 달성률 15-20% 향상',
			})
		}

		return {
			whatToDouble,
			whatToStop,
			newInitiatives,
		}
	}

	/**
	 * 리소스 배분 추천
	 */
	private recommendResourceAllocation(
		currentSummary: QuarterSummary
	): ResourceRecommendation[] {
		// 간단한 버전: 기본 부서별 배분
		const departments = ['개발', '영업', '마케팅', '운영']
		
		return departments.map(dept => ({
			department: dept,
			currentAllocation: 25,  // 균등 배분 가정
			recommendedAllocation: 25,  // 실제로는 성과 기반 계산 필요
			reasoning: '현재 배분 유지',
		}))
	}

	/**
	 * Helper: KPI 달성률 계산
	 */
	private calculateKPIAchievementRate(kpis: KPI[]): number {
		if (kpis.length === 0) return 0
		
		const avgProgress = kpis.reduce((sum, k) => {
			const progress = (k.metric.current / k.metric.target) * 100
			return sum + Math.min(100, progress)
		}, 0) / kpis.length

		return Math.round(avgProgress)
	}

	/**
	 * Helper: OKR 완료율 계산
	 */
	private calculateOKRCompletionRate(objectives: Objective[]): number {
		if (objectives.length === 0) return 0
		
		const avgProgress = objectives.reduce((sum, o) => sum + o.progress, 0) / objectives.length
		return Math.round(avgProgress)
	}

	/**
	 * Helper: 프로젝트 성공률 계산
	 */
	private calculateProjectSuccessRate(projects: Project[]): number {
		if (projects.length === 0) return 0
		
		const completed = projects.filter(p => p.status === 'completed' && p.progress >= 100).length
		return Math.round((completed / projects.length) * 100)
	}

	/**
	 * Helper: 팀 생산성 계산
	 */
	private calculateTeamProductivity(workEntries: WorkEntry[]): number {
		// 간단한 버전: 주간 평균 업무 수
		const weeksInQuarter = 13
		const avgPerWeek = workEntries.length / weeksInQuarter
		
		// 주당 20개 이상이면 100%로 가정
		return Math.min(100, Math.round((avgPerWeek / 20) * 100))
	}

	/**
	 * Helper: 성과 식별
	 */
	private identifyAchievements(
		kpis: KPI[],
		objectives: Objective[],
		projects: Project[]
	): string[] {
		const achievements: string[] = []

		const highKPIs = kpis.filter(k => (k.metric.current / k.metric.target) >= 0.9)
		if (highKPIs.length > 0) {
			achievements.push(`${highKPIs.length}개 KPI가 90% 이상 달성`)
		}

		const completedOKRs = objectives.filter(o => o.progress >= 100)
		if (completedOKRs.length > 0) {
			achievements.push(`${completedOKRs.length}개 OKR 완료`)
		}

		const successProjects = projects.filter(p => p.status === 'completed')
		if (successProjects.length > 0) {
			achievements.push(`${successProjects.length}개 프로젝트 성공적 완료`)
		}

		return achievements
	}

	/**
	 * Helper: 교훈 추출
	 */
	private extractLessons(
		kpis: KPI[],
		objectives: Objective[],
		projects: Project[],
		workEntries: WorkEntry[]
	): string[] {
		const lessons: string[] = []

		// 낮은 성과의 원인 분석
		const lowKPIs = kpis.filter(k => (k.metric.current / k.metric.target) < 0.5)
		if (lowKPIs.length > 0) {
			lessons.push('일부 KPI의 목표가 너무 높게 설정되었을 수 있음')
		}

		// 지연된 프로젝트
		const delayedProjects = projects.filter(p => 
			p.status !== 'completed' && new Date(p.endDate) < new Date()
		)
		if (delayedProjects.length > 0) {
			lessons.push('프로젝트 일정 관리 프로세스 개선 필요')
		}

		return lessons
	}

	/**
	 * Helper: 병목 현상 식별
	 */
	private identifyBottlenecks(
		projects: Project[],
		objectives: Objective[],
		workEntries: WorkEntry[]
	): string[] {
		const bottlenecks: string[] = []

		// 진척이 멈춘 프로젝트
		const stalledProjects = projects.filter(p => 
			p.status === 'active' && p.progress < 50 &&
			workEntries.filter(w => w.projectId === p.id).length < 5
		)
		if (stalledProjects.length > 0) {
			bottlenecks.push(`${stalledProjects.length}개 프로젝트의 진척 정체`)
		}

		return bottlenecks
	}

	/**
	 * Helper: 부족한 KPI 카테고리 찾기
	 */
	private findMissingKPICategories(currentKPIs: KPI[]): KPICategory[] {
		const allCategories: KPICategory[] = [
			'revenue', 'growth', 'customer', 'product',
			'operations', 'team', 'quality', 'efficiency'
		]
		
		const existingCategories = new Set(currentKPIs.map(k => k.category))
		return allCategories.filter(c => !existingCategories.has(c))
	}

	/**
	 * Helper: 카테고리별 새 KPI 생성
	 */
	private createNewKPIForCategory(
		category: KPICategory,
		currentSummary: QuarterSummary
	): SuggestedKPIWithContext | null {
		const categoryTargets: Record<KPICategory, { name: string; target: number; unit: string }> = {
			revenue: { name: '분기 매출', target: 100000000, unit: '원' },
			growth: { name: '전분기 대비 성장률', target: 15, unit: '%' },
			customer: { name: '신규 고객 확보', target: 50, unit: '명' },
			product: { name: '신규 기능 출시', target: 5, unit: '건' },
			operations: { name: '업무 효율성', target: 85, unit: '%' },
			team: { name: '팀원 만족도', target: 80, unit: '점' },
			quality: { name: '품질 지표', target: 90, unit: '점' },
			efficiency: { name: '생산성 지표', target: 85, unit: '%' },
		}

		const template = categoryTargets[category]
		if (!template) return null

		return {
			kpi: {
				name: template.name,
				category,
				metric: {
					current: 0,
					target: template.target,
					unit: template.unit,
					format: 'number',
				},
				period: 'quarter',
			},
			reasoning: `${category} 카테고리의 KPI가 부족하여 새로 제안합니다`,
			adjustmentFromCurrent: '신규 KPI',
			confidence: 0.7,
			priority: 'medium',
			estimatedImpact: '전략적 균형 향상',
		}
	}

	/**
	 * Helper: KPI에 대한 OKR 생성
	 */
	private generateOKRsForKPI(
		kpiSuggestion: SuggestedKPIWithContext,
		patterns: ExecutionPattern
	): SuggestedOKRWithContext[] {
		// 간단한 버전: 1개의 OKR만 생성
		const okrTitle = `${kpiSuggestion.kpi.name} 달성을 위한 전략적 목표`
		
		return [{
			okr: {
				title: okrTitle,
				description: `다음 분기 ${kpiSuggestion.kpi.name} 목표 달성`,
				period: 'Q1',
				keyResults: [],  // 실제로는 3-5개의 KR 생성 필요
			},
			basedOnPattern: patterns.successPatterns[0]?.pattern || '과거 성공 사례 기반',
			successProbability: kpiSuggestion.confidence,
			requiredActions: [
				'주간 진척도 점검',
				'팀 역량 강화',
				'리소스 적시 투입',
			],
			linkedKPIs: [],
		}]
	}

	/**
	 * Helper: 전체 신뢰도 계산
	 */
	private calculateOverallConfidence(
		patterns: ExecutionPattern,
		currentSummary: QuarterSummary
	): number {
		// 성공 패턴 수와 현재 성과를 기반으로 계산
		const patternConfidence = patterns.successPatterns.length >= 3 ? 0.8 : 0.6
		const performanceConfidence = currentSummary.keyMetrics.kpiAchievementRate / 100

		return (patternConfidence + performanceConfidence) / 2
	}
}

// Singleton instance
export const nextQuarterRecommendationService = new NextQuarterRecommendationService()

