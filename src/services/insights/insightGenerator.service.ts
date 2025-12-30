/**
 * Insight Generator Service
 * 주간/월간/분기별 인사이트 자동 생성
 */

import type { WorkEntry, Project, Objective } from '../../types/common.types'
import type { KPI } from '../../types/kpi.types'
import { storage } from '../../utils/storage'
import { differenceInDays, subWeeks, subMonths, startOfQuarter, endOfQuarter, format } from 'date-fns'

/**
 * 인사이트 타입
 */
export type InsightType = 'performance' | 'risk' | 'opportunity' | 'pattern'
export type InsightPeriod = 'weekly' | 'monthly' | 'quarterly'
export type InsightPriority = 'critical' | 'high' | 'medium' | 'low'

/**
 * 인사이트
 */
export interface Insight {
	id: string
	type: InsightType
	period: InsightPeriod
	priority: InsightPriority
	
	title: string
	description: string
	metrics: {
		current: number
		previous: number
		change: number  // percentage
		changeLabel: string
	}
	
	impact: string
	suggestedActions: string[]
	
	relatedItems: {
		type: 'kpi' | 'okr' | 'project' | 'task'
		id: string
		name: string
	}[]
	
	generatedAt: string
	expiresAt?: string
}

/**
 * 인사이트 컬렉션
 */
export interface InsightCollection {
	period: InsightPeriod
	periodLabel: string
	insights: Insight[]
	summary: {
		total: number
		byType: Record<InsightType, number>
		byPriority: Record<InsightPriority, number>
	}
	generatedAt: string
}

/**
 * 인사이트 생성 서비스
 */
export class InsightGeneratorService {
	/**
	 * 주간 인사이트 생성
	 */
	async generateWeeklyInsights(): Promise<InsightCollection> {
		const insights: Insight[] = []
		const now = new Date()
		const oneWeekAgo = subWeeks(now, 1)
		const twoWeeksAgo = subWeeks(now, 2)

		// 1. KPI 성과 인사이트
		const kpiInsights = await this.analyzeKPITrends(oneWeekAgo, twoWeeksAgo)
		insights.push(...kpiInsights)

		// 2. 프로젝트 리스크 인사이트
		const projectRisks = await this.detectProjectRisks('weekly')
		insights.push(...projectRisks)

		// 3. 팀 생산성 패턴
		const productivityPatterns = await this.analyzeProductivityPatterns('weekly')
		insights.push(...productivityPatterns)

		// 4. 기회 인사이트
		const opportunities = await this.identifyOpportunities('weekly')
		insights.push(...opportunities)

		return this.createInsightCollection('weekly', insights)
	}

	/**
	 * 월간 인사이트 생성
	 */
	async generateMonthlyInsights(): Promise<InsightCollection> {
		const insights: Insight[] = []
		const now = new Date()
		const oneMonthAgo = subMonths(now, 1)
		const twoMonthsAgo = subMonths(now, 2)

		// 1. OKR 진척도 분석
		const okrInsights = await this.analyzeOKRProgress('monthly')
		insights.push(...okrInsights)

		// 2. 부서별 성과 비교
		const departmentComparison = await this.compareDepartmentPerformance()
		insights.push(...departmentComparison)

		// 3. 리소스 활용도 분석
		const resourceUtilization = await this.analyzeResourceUtilization()
		insights.push(...resourceUtilization)

		// 4. 월간 트렌드
		const monthlyTrends = await this.identifyMonthlyTrends()
		insights.push(...monthlyTrends)

		return this.createInsightCollection('monthly', insights)
	}

	/**
	 * 분기별 인사이트 생성
	 */
	async generateQuarterlyInsights(): Promise<InsightCollection> {
		const insights: Insight[] = []

		// 1. 분기 전체 성과 요약
		const quarterSummary = await this.summarizeQuarterPerformance()
		insights.push(...quarterSummary)

		// 2. 전략적 정렬도 분석
		const alignmentAnalysis = await this.analyzeStrategicAlignment()
		insights.push(...alignmentAnalysis)

		// 3. 장기 트렌드 및 예측
		const longTermTrends = await this.analyzeLongTermTrends()
		insights.push(...longTermTrends)

		// 4. 분기 교훈
		const quarterlyLessons = await this.extractQuarterlyLessons()
		insights.push(...quarterlyLessons)

		return this.createInsightCollection('quarterly', insights)
	}

	/**
	 * KPI 트렌드 분석
	 */
	private async analyzeKPITrends(
		currentPeriodStart: Date,
		previousPeriodStart: Date
	): Promise<Insight[]> {
		const kpis = storage.get<KPI[]>('kpis', [])
		const insights: Insight[] = []

		for (const kpi of kpis) {
			const currentProgress = (kpi.metric.current / kpi.metric.target) * 100
			
			// 이전 기간 데이터 (실제로는 히스토리 필요)
			const previousProgress = currentProgress * 0.9  // 임시

			const change = currentProgress - previousProgress
			const changePercent = previousProgress > 0 ? (change / previousProgress) * 100 : 0

			// 성과 인사이트
			if (changePercent >= 20) {
				insights.push({
					id: `kpi-perf-${kpi.id}`,
					type: 'performance',
					period: 'weekly',
					priority: 'high',
					title: `${kpi.name} 급상승`,
					description: `${kpi.name}이(가) 지난주 대비 ${Math.round(changePercent)}% 증가했습니다`,
					metrics: {
						current: currentProgress,
						previous: previousProgress,
						change: changePercent,
						changeLabel: `+${Math.round(changePercent)}%`,
					},
					impact: '목표 달성 가속화',
					suggestedActions: [
						'현재 전략을 다른 KPI에도 적용 고려',
						'성공 요인 분석 및 문서화',
					],
					relatedItems: [{
						type: 'kpi',
						id: kpi.id,
						name: kpi.name,
					}],
					generatedAt: new Date().toISOString(),
				})
			}

			// 리스크 인사이트
			if (currentProgress < 50 && differenceInDays(new Date(kpi.endDate), new Date()) < 30) {
				insights.push({
					id: `kpi-risk-${kpi.id}`,
					type: 'risk',
					period: 'weekly',
					priority: 'critical',
					title: `${kpi.name} 목표 달성 위험`,
					description: `${kpi.name}의 진척도가 ${Math.round(currentProgress)}%에 불과하며, 마감일이 ${differenceInDays(new Date(kpi.endDate), new Date())}일 남았습니다`,
					metrics: {
						current: currentProgress,
						previous: previousProgress,
						change: changePercent,
						changeLabel: `${changePercent > 0 ? '+' : ''}${Math.round(changePercent)}%`,
					},
					impact: '목표 미달성 가능성 높음',
					suggestedActions: [
						'긴급 액션 플랜 수립',
						'추가 리소스 투입 검토',
						'목표치 재조정 고려',
					],
					relatedItems: [{
						type: 'kpi',
						id: kpi.id,
						name: kpi.name,
					}],
					generatedAt: new Date().toISOString(),
					expiresAt: new Date(kpi.endDate).toISOString(),
				})
			}
		}

		return insights
	}

	/**
	 * 프로젝트 리스크 탐지
	 */
	private async detectProjectRisks(period: InsightPeriod): Promise<Insight[]> {
		const projects = storage.get<Project[]>('projects', [])
		const workEntries = storage.get<WorkEntry[]>('workEntries', [])
		const insights: Insight[] = []

		for (const project of projects) {
			if (project.status === 'completed' || project.status === 'cancelled') continue

			// 최근 활동 확인
			const recentWork = workEntries.filter(w =>
				w.projectId === project.id &&
				differenceInDays(new Date(), new Date(w.date)) <= 7
			)

			// 활동 없음 리스크
			if (recentWork.length === 0 && project.status === 'active') {
				insights.push({
					id: `proj-risk-${project.id}`,
					type: 'risk',
					period,
					priority: 'high',
					title: `프로젝트 "${project.name}" 활동 없음`,
					description: '최근 7일간 업무 기록이 없습니다',
					metrics: {
						current: 0,
						previous: 1,
						change: -100,
						changeLabel: '-100%',
					},
					impact: '프로젝트 지연 위험',
					suggestedActions: [
						'프로젝트 상태 점검',
						'팀 리소스 재확인',
						'일정 재조정 필요',
					],
					relatedItems: [{
						type: 'project',
						id: project.id,
						name: project.name,
					}],
					generatedAt: new Date().toISOString(),
				})
			}

			// 진척 정체 리스크
			const timeProgress = this.calculateTimeProgress(project)
			if (project.progress < timeProgress - 20) {
				insights.push({
					id: `proj-behind-${project.id}`,
					type: 'risk',
					period,
					priority: 'high',
					title: `프로젝트 "${project.name}" 일정 지연`,
					description: `진척도 ${project.progress}%가 예상 진척도 ${Math.round(timeProgress)}%보다 낮습니다`,
					metrics: {
						current: project.progress,
						previous: timeProgress,
						change: project.progress - timeProgress,
						changeLabel: `${Math.round(project.progress - timeProgress)}%`,
					},
					impact: '마감일 준수 어려움',
					suggestedActions: [
						'진척도 가속화 방안 검토',
						'범위 축소 고려',
						'리소스 추가 투입',
					],
					relatedItems: [{
						type: 'project',
						id: project.id,
						name: project.name,
					}],
					generatedAt: new Date().toISOString(),
				})
			}
		}

		return insights
	}

	/**
	 * 생산성 패턴 분석
	 */
	private async analyzeProductivityPatterns(period: InsightPeriod): Promise<Insight[]> {
		const workEntries = storage.get<WorkEntry[]>('workEntries', [])
		const insights: Insight[] = []

		// 주간 업무량 분석
		const thisWeek = workEntries.filter(w =>
			differenceInDays(new Date(), new Date(w.date)) <= 7
		)
		const lastWeek = workEntries.filter(w => {
			const days = differenceInDays(new Date(), new Date(w.date))
			return days > 7 && days <= 14
		})

		const weeklyChange = ((thisWeek.length - lastWeek.length) / (lastWeek.length || 1)) * 100

		if (Math.abs(weeklyChange) >= 20) {
			insights.push({
				id: 'prod-pattern-weekly',
				type: 'pattern',
				period,
				priority: 'medium',
				title: weeklyChange > 0 ? '업무량 증가 추세' : '업무량 감소 추세',
				description: `이번 주 업무 기록이 지난주 대비 ${Math.abs(Math.round(weeklyChange))}% ${weeklyChange > 0 ? '증가' : '감소'}했습니다`,
				metrics: {
					current: thisWeek.length,
					previous: lastWeek.length,
					change: weeklyChange,
					changeLabel: `${weeklyChange > 0 ? '+' : ''}${Math.round(weeklyChange)}%`,
				},
				impact: weeklyChange > 0 ? '생산성 향상' : '생산성 저하 주의',
				suggestedActions: weeklyChange > 0
					? ['현재 집중도 유지', '성공 요인 분석']
					: ['업무 부담 점검', '팀 모티베이션 확인'],
				relatedItems: [],
				generatedAt: new Date().toISOString(),
			})
		}

		return insights
	}

	/**
	 * 기회 식별
	 */
	private async identifyOpportunities(period: InsightPeriod): Promise<Insight[]> {
		const kpis = storage.get<KPI[]>('kpis', [])
		const projects = storage.get<Project[]>('projects', [])
		const insights: Insight[] = []

		// KPI가 목표를 초과 달성한 경우
		const overachievingKPIs = kpis.filter(k => k.metric.current > k.metric.target)
		
		if (overachievingKPIs.length > 0) {
			const topKPI = overachievingKPIs[0]
			const overachievement = ((topKPI.metric.current / topKPI.metric.target) - 1) * 100

			insights.push({
				id: `opp-kpi-${topKPI.id}`,
				type: 'opportunity',
				period,
				priority: 'high',
				title: `${topKPI.name} 목표 초과 달성`,
				description: `목표 대비 ${Math.round(overachievement)}% 초과 달성 중입니다`,
				metrics: {
					current: topKPI.metric.current,
					previous: topKPI.metric.target,
					change: overachievement,
					changeLabel: `+${Math.round(overachievement)}%`,
				},
				impact: '추가 성장 기회',
				suggestedActions: [
					'다음 분기 목표 상향 조정',
					'성공 전략을 다른 KPI에 적용',
					'팀 역량 확대 고려',
				],
				relatedItems: [{
					type: 'kpi',
					id: topKPI.id,
					name: topKPI.name,
				}],
				generatedAt: new Date().toISOString(),
			})
		}

		// 조기 완료 예상 프로젝트
		const earlyProjects = projects.filter(p =>
			p.status === 'active' &&
			p.progress > this.calculateTimeProgress(p) + 15
		)

		if (earlyProjects.length > 0) {
			insights.push({
				id: 'opp-early-completion',
				type: 'opportunity',
				period,
				priority: 'medium',
				title: `${earlyProjects.length}개 프로젝트 조기 완료 예상`,
				description: '일정보다 빠른 진행 중인 프로젝트들이 있습니다',
				metrics: {
					current: earlyProjects.length,
					previous: 0,
					change: 100,
					changeLabel: `${earlyProjects.length}개`,
				},
				impact: '리소스 재배치 기회',
				suggestedActions: [
					'여유 리소스를 지연 프로젝트에 투입',
					'새로운 이니셔티브 시작 고려',
					'팀 역량 강화 프로그램 진행',
				],
				relatedItems: earlyProjects.map(p => ({
					type: 'project' as const,
					id: p.id,
					name: p.name,
				})),
				generatedAt: new Date().toISOString(),
			})
		}

		return insights
	}

	/**
	 * OKR 진척도 분석
	 */
	private async analyzeOKRProgress(period: InsightPeriod): Promise<Insight[]> {
		const objectives = storage.get<Objective[]>('objectives', [])
		const insights: Insight[] = []

		const avgProgress = objectives.reduce((sum, o) => sum + o.progress, 0) / (objectives.length || 1)
		const onTrack = objectives.filter(o => o.status === 'on-track').length
		const atRisk = objectives.filter(o => o.status === 'at-risk' || o.status === 'behind').length

		insights.push({
			id: 'okr-monthly-summary',
			type: 'performance',
			period,
			priority: atRisk > objectives.length * 0.3 ? 'high' : 'medium',
			title: 'OKR 월간 진척도',
			description: `전체 OKR의 평균 진척도는 ${Math.round(avgProgress)}%입니다`,
			metrics: {
				current: avgProgress,
				previous: avgProgress * 0.9,
				change: 10,
				changeLabel: '+10%',
			},
			impact: onTrack > atRisk ? '순조로운 진행' : '주의 필요',
			suggestedActions: atRisk > 0
				? [
					`${atRisk}개의 위험 OKR에 집중`,
					'중간 점검 회의 실시',
					'리소스 재배분 검토',
				]
				: ['현재 전략 유지', '다음 분기 계획 수립'],
			relatedItems: [],
			generatedAt: new Date().toISOString(),
		})

		return insights
	}

	/**
	 * 부서별 성과 비교
	 */
	private async compareDepartmentPerformance(): Promise<Insight[]> {
		// 간단한 버전
		return []
	}

	/**
	 * 리소스 활용도 분석
	 */
	private async analyzeResourceUtilization(): Promise<Insight[]> {
		// 간단한 버전
		return []
	}

	/**
	 * 월간 트렌드 식별
	 */
	private async identifyMonthlyTrends(): Promise<Insight[]> {
		// 간단한 버전
		return []
	}

	/**
	 * 분기 성과 요약
	 */
	private async summarizeQuarterPerformance(): Promise<Insight[]> {
		const now = new Date()
		const quarterStart = startOfQuarter(now)
		const quarterEnd = endOfQuarter(now)

		const kpis = storage.get<KPI[]>('kpis', [])
		const objectives = storage.get<Objective[]>('objectives', [])
		const projects = storage.get<Project[]>('projects', [])

		const quarterKPIs = kpis.filter(k =>
			new Date(k.startDate) <= quarterEnd && new Date(k.endDate) >= quarterStart
		)

		const kpiAvg = quarterKPIs.reduce((sum, k) =>
			sum + (k.metric.current / k.metric.target) * 100, 0
		) / (quarterKPIs.length || 1)

		return [{
			id: 'quarter-summary',
			type: 'performance',
			period: 'quarterly',
			priority: 'high',
			title: '분기 전체 성과',
			description: `${format(quarterStart, 'Q')}분기 KPI 평균 달성률은 ${Math.round(kpiAvg)}%입니다`,
			metrics: {
				current: kpiAvg,
				previous: 75,
				change: kpiAvg - 75,
				changeLabel: `${kpiAvg > 75 ? '+' : ''}${Math.round(kpiAvg - 75)}%`,
			},
			impact: kpiAvg >= 80 ? '우수한 성과' : '개선 필요',
			suggestedActions: [
				'성과 분석 회의 실시',
				'성공/실패 요인 문서화',
				'다음 분기 계획 수립',
			],
			relatedItems: [],
			generatedAt: new Date().toISOString(),
		}]
	}

	/**
	 * 전략적 정렬도 분석
	 */
	private async analyzeStrategicAlignment(): Promise<Insight[]> {
		// 간단한 버전
		return []
	}

	/**
	 * 장기 트렌드 분석
	 */
	private async analyzeLongTermTrends(): Promise<Insight[]> {
		// 간단한 버전
		return []
	}

	/**
	 * 분기 교훈 추출
	 */
	private async extractQuarterlyLessons(): Promise<Insight[]> {
		// 간단한 버전
		return []
	}

	/**
	 * Helper: 인사이트 컬렉션 생성
	 */
	private createInsightCollection(
		period: InsightPeriod,
		insights: Insight[]
	): InsightCollection {
		const periodLabels = {
			weekly: '이번 주',
			monthly: '이번 달',
			quarterly: '이번 분기',
		}

		const byType = {
			performance: insights.filter(i => i.type === 'performance').length,
			risk: insights.filter(i => i.type === 'risk').length,
			opportunity: insights.filter(i => i.type === 'opportunity').length,
			pattern: insights.filter(i => i.type === 'pattern').length,
		}

		const byPriority = {
			critical: insights.filter(i => i.priority === 'critical').length,
			high: insights.filter(i => i.priority === 'high').length,
			medium: insights.filter(i => i.priority === 'medium').length,
			low: insights.filter(i => i.priority === 'low').length,
		}

		return {
			period,
			periodLabel: periodLabels[period],
			insights: insights.sort((a, b) => {
				const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
				return priorityOrder[a.priority] - priorityOrder[b.priority]
			}),
			summary: {
				total: insights.length,
				byType,
				byPriority,
			},
			generatedAt: new Date().toISOString(),
		}
	}

	/**
	 * Helper: 시간 진척률 계산
	 */
	private calculateTimeProgress(project: Project): number {
		const startDate = new Date(project.startDate)
		const endDate = new Date(project.endDate)
		const now = new Date()

		const totalDays = differenceInDays(endDate, startDate)
		const elapsedDays = differenceInDays(now, startDate)

		return totalDays > 0 ? (elapsedDays / totalDays) * 100 : 0
	}
}

// Singleton instance
export const insightGeneratorService = new InsightGeneratorService()

