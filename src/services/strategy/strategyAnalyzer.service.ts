/**
 * Strategy Analyzer Service
 * 회사 전략 분석 및 KPI 추천 서비스
 */

import type {
	CompanyStrategy,
	StrategyToKPIRecommendation,
	SuggestedKPI,
	StrategyAnalysisResult,
	StrategicPriority,
} from '../../types/strategy.types'
import type { KPI, KPICategory } from '../../types/kpi.types'
import { storage } from '../../utils/storage'

/**
 * 전략 분석 서비스
 */
export class StrategyAnalyzerService {
	/**
	 * 전략으로부터 KPI 자동 생성
	 */
	async generateKPIsFromStrategy(strategy: CompanyStrategy): Promise<StrategyToKPIRecommendation> {
		const suggestedKPIs: SuggestedKPI[] = []

		// 1. 연간 목표 기반 KPI 생성
		for (const annualGoal of strategy.annualGoals) {
			const revenueKPI = this.createRevenueKPI(annualGoal, strategy)
			const growthKPI = this.createGrowthKPI(annualGoal, strategy)
			
			suggestedKPIs.push(revenueKPI, growthKPI)
		}

		// 2. 전략적 우선순위 기반 KPI 생성
		for (const priority of strategy.strategicPriorities) {
			if (priority.status !== 'active') continue
			
			const priorityKPIs = this.createKPIsFromPriority(priority, strategy)
			suggestedKPIs.push(...priorityKPIs)
		}

		// 3. 시장 포지션 기반 KPI 생성
		const marketKPIs = this.createMarketKPIs(strategy.marketPosition, strategy)
		suggestedKPIs.push(...marketKPIs)

		// 4. 우선순위 점수 계산 및 정렬
		const scoredKPIs = suggestedKPIs
			.map(kpi => ({
				...kpi,
				priorityScore: this.calculatePriorityScore(kpi, strategy),
			}))
			.sort((a, b) => b.priorityScore - a.priorityScore)
			.slice(0, 12)  // 상위 12개만 추천

		return {
			strategyId: strategy.id,
			strategyTitle: strategy.vision,
			suggestedKPIs: scoredKPIs,
			generatedAt: new Date().toISOString(),
			confidence: this.calculateOverallConfidence(scoredKPIs),
		}
	}

	/**
	 * 매출 KPI 생성
	 */
	private createRevenueKPI(annualGoal: any, strategy: CompanyStrategy): SuggestedKPI {
		return {
			id: `kpi-revenue-${annualGoal.year}`,
			name: `${annualGoal.year}년 매출 목표`,
			description: `연간 매출 ${annualGoal.revenue}${annualGoal.revenueUnit || '원'} 달성`,
			category: 'revenue',
			reasoning: `연간 목표에서 명시된 매출 목표를 추적하기 위한 핵심 지표입니다.`,
			alignmentScore: 1.0,
			priorityScore: 1.0,
			suggestedTarget: annualGoal.revenue,
			suggestedUnit: annualGoal.revenueUnit || '원',
			suggestedPeriod: 'year',
			suggestedDepartments: ['영업', '사업개발', '재무'],
			linkedStrategies: strategy.strategicPriorities
				.filter(p => p.targetMetrics.some(m => m.includes('매출') || m.includes('revenue')))
				.map(p => p.id),
			status: 'pending',
		}
	}

	/**
	 * 성장률 KPI 생성
	 */
	private createGrowthKPI(annualGoal: any, strategy: CompanyStrategy): SuggestedKPI {
		return {
			id: `kpi-growth-${annualGoal.year}`,
			name: `${annualGoal.year}년 성장률`,
			description: `전년 대비 ${annualGoal.growth}% 성장 달성`,
			category: 'growth',
			reasoning: `지속 가능한 성장을 측정하고 시장 경쟁력을 평가하기 위한 지표입니다.`,
			alignmentScore: 0.95,
			priorityScore: 0.95,
			suggestedTarget: annualGoal.growth,
			suggestedUnit: '%',
			suggestedPeriod: 'year',
			suggestedDepartments: ['경영진', '전략기획', '재무'],
			linkedStrategies: strategy.strategicPriorities
				.filter(p => p.targetMetrics.some(m => m.includes('성장') || m.includes('growth')))
				.map(p => p.id),
			status: 'pending',
		}
	}

	/**
	 * 전략적 우선순위로부터 KPI 생성
	 */
	private createKPIsFromPriority(
		priority: StrategicPriority,
		strategy: CompanyStrategy
	): SuggestedKPI[] {
		const kpis: SuggestedKPI[] = []

		// 타임프레임에 따른 카테고리 결정
		const category = this.determineCategoryFromPriority(priority)
		
		// 각 목표 지표에 대해 KPI 생성
		for (const metric of priority.targetMetrics.slice(0, 2)) {  // 상위 2개만
			const kpi: SuggestedKPI = {
				id: `kpi-${priority.id}-${metric.toLowerCase().replace(/\s+/g, '-')}`,
				name: `${priority.title}: ${metric}`,
				description: `${priority.description} - ${metric} 측정`,
				category,
				reasoning: `전략적 우선순위 "${priority.title}"의 핵심 성과를 측정하기 위한 지표입니다.`,
				alignmentScore: 0.9,
				priorityScore: priority.timeframe === 'short' ? 0.9 : 0.7,
				suggestedTarget: 100,  // 기본값, 사용자가 조정
				suggestedUnit: this.determineUnit(metric),
				suggestedPeriod: priority.timeframe === 'short' ? 'quarter' : 'year',
				suggestedDepartments: this.determineDepartments(priority.title),
				linkedStrategies: [priority.id],
				status: 'pending',
			}
			
			kpis.push(kpi)
		}

		return kpis
	}

	/**
	 * 시장 포지션 기반 KPI 생성
	 */
	private createMarketKPIs(marketPosition: any, strategy: CompanyStrategy): SuggestedKPI[] {
		const kpis: SuggestedKPI[] = []

		// 1. 고객 관련 KPI
		if (marketPosition.targetMarket) {
			kpis.push({
				id: 'kpi-customer-acquisition',
				name: '신규 고객 확보',
				description: '타겟 시장에서의 신규 고객 확보 수',
				category: 'customer',
				reasoning: `타겟 시장 "${marketPosition.targetMarket}"에서의 성장을 측정하는 지표입니다.`,
				alignmentScore: 0.85,
				priorityScore: 0.85,
				suggestedTarget: 100,
				suggestedUnit: '명',
				suggestedPeriod: 'quarter',
				suggestedDepartments: ['마케팅', '영업'],
				linkedStrategies: [],
				status: 'pending',
			})
		}

		// 2. 경쟁 우위 관련 KPI
		if (marketPosition.competitiveAdvantage?.length > 0) {
			kpis.push({
				id: 'kpi-market-share',
				name: '시장 점유율',
				description: '타겟 시장 내 점유율 증가',
				category: 'growth',
				reasoning: '경쟁 우위를 활용한 시장 확대를 측정하는 지표입니다.',
				alignmentScore: 0.8,
				priorityScore: 0.75,
				suggestedTarget: marketPosition.marketShare || 10,
				suggestedUnit: '%',
				suggestedPeriod: 'year',
				suggestedDepartments: ['전략기획', '영업', '마케팅'],
				linkedStrategies: [],
				status: 'pending',
			})
		}

		// 3. 제품/서비스 품질 KPI
		kpis.push({
			id: 'kpi-customer-satisfaction',
			name: '고객 만족도',
			description: 'NPS 또는 CSAT 점수',
			category: 'quality',
			reasoning: '지속 가능한 성장을 위한 고객 만족도 측정 지표입니다.',
			alignmentScore: 0.8,
			priorityScore: 0.7,
			suggestedTarget: 80,
			suggestedUnit: '점',
			suggestedPeriod: 'quarter',
			suggestedDepartments: ['고객지원', '제품'],
			linkedStrategies: [],
			status: 'pending',
		})

		return kpis
	}

	/**
	 * 전략 분석
	 */
	async analyzeStrategy(strategy: CompanyStrategy): Promise<StrategyAnalysisResult> {
		const existingKPIs = storage.get<KPI[]>('kpis', [])
		
		// 1. 건강도 계산
		const healthScore = this.calculateHealthScore(strategy, existingKPIs)
		
		// 2. 강점/약점 분석
		const strengths = this.identifyStrengths(strategy)
		const weaknesses = this.identifyWeaknesses(strategy)
		const gaps = this.identifyGaps(strategy, existingKPIs)
		
		// 3. 권장사항 생성
		const recommendations = this.generateRecommendations(strategy, existingKPIs)
		
		// 4. KPI 커버리지 분석
		const kpiCoverage = this.analyzeKPICoverage(strategy, existingKPIs)

		return {
			healthScore,
			strengths,
			weaknesses,
			gaps,
			recommendations,
			kpiCoverage,
		}
	}

	/**
	 * 전략 건강도 계산
	 */
	private calculateHealthScore(strategy: CompanyStrategy, existingKPIs: KPI[]): number {
		let score = 0
		let maxScore = 0

		// 1. 비전/미션 완성도 (20점)
		maxScore += 20
		if (strategy.vision?.length > 10) score += 10
		if (strategy.mission?.length > 10) score += 10

		// 2. 전략적 우선순위 (30점)
		maxScore += 30
		const activePriorities = strategy.strategicPriorities.filter(p => p.status === 'active')
		if (activePriorities.length >= 3) score += 15
		else if (activePriorities.length >= 1) score += 10
		
		const withMetrics = activePriorities.filter(p => p.targetMetrics?.length > 0)
		score += Math.min(15, withMetrics.length * 5)

		// 3. 시장 포지션 명확성 (20점)
		maxScore += 20
		if (strategy.marketPosition?.targetMarket) score += 10
		if (strategy.marketPosition?.competitiveAdvantage?.length > 0) score += 10

		// 4. 연간 목표 설정 (15점)
		maxScore += 15
		if (strategy.annualGoals?.length > 0) score += 15

		// 5. KPI 연결성 (15점)
		maxScore += 15
		const linkedKPIs = existingKPIs.filter(kpi => 
			kpi.description?.includes(strategy.vision) || 
			strategy.strategicPriorities.some(p => kpi.name?.includes(p.title))
		)
		score += Math.min(15, linkedKPIs.length * 3)

		return Math.round((score / maxScore) * 100)
	}

	/**
	 * 강점 식별
	 */
	private identifyStrengths(strategy: CompanyStrategy): string[] {
		const strengths: string[] = []

		if (strategy.vision?.length > 50) {
			strengths.push('명확하고 구체적인 비전이 수립되어 있습니다')
		}

		const activePriorities = strategy.strategicPriorities.filter(p => p.status === 'active')
		if (activePriorities.length >= 3) {
			strengths.push(`${activePriorities.length}개의 활성 전략적 우선순위가 관리되고 있습니다`)
		}

		if (strategy.marketPosition?.competitiveAdvantage?.length >= 2) {
			strengths.push('명확한 경쟁 우위 요소가 정의되어 있습니다')
		}

		if (strategy.annualGoals?.length > 0) {
			const latestGoal = strategy.annualGoals[strategy.annualGoals.length - 1]
			if (latestGoal.growth > 20) {
				strengths.push('야심찬 성장 목표가 설정되어 있습니다')
			}
		}

		return strengths
	}

	/**
	 * 약점 식별
	 */
	private identifyWeaknesses(strategy: CompanyStrategy): string[] {
		const weaknesses: string[] = []

		if (!strategy.vision || strategy.vision.length < 20) {
			weaknesses.push('비전이 구체적이지 않거나 누락되어 있습니다')
		}

		const activePriorities = strategy.strategicPriorities.filter(p => p.status === 'active')
		if (activePriorities.length === 0) {
			weaknesses.push('활성화된 전략적 우선순위가 없습니다')
		}

		const withoutMetrics = activePriorities.filter(p => !p.targetMetrics || p.targetMetrics.length === 0)
		if (withoutMetrics.length > 0) {
			weaknesses.push(`${withoutMetrics.length}개의 우선순위에 측정 지표가 정의되지 않았습니다`)
		}

		if (!strategy.marketPosition?.targetMarket) {
			weaknesses.push('타겟 시장이 명확하게 정의되지 않았습니다')
		}

		if (strategy.annualGoals?.length === 0) {
			weaknesses.push('연간 목표가 설정되지 않았습니다')
		}

		return weaknesses
	}

	/**
	 * 전략 갭 식별
	 */
	private identifyGaps(strategy: CompanyStrategy, existingKPIs: KPI[]): string[] {
		const gaps: string[] = []
		
		const categories: KPICategory[] = ['revenue', 'growth', 'customer', 'product', 'operations', 'team', 'quality', 'efficiency']
		const coveredCategories = new Set(existingKPIs.map(k => k.category))

		const missingCategories = categories.filter(c => !coveredCategories.has(c))
		if (missingCategories.length > 0) {
			gaps.push(`${missingCategories.join(', ')} 카테고리의 KPI가 부족합니다`)
		}

		// 장기 전략 부재
		const longTermPriorities = strategy.strategicPriorities.filter(p => p.timeframe === 'long')
		if (longTermPriorities.length === 0) {
			gaps.push('장기 전략적 우선순위가 정의되지 않았습니다')
		}

		return gaps
	}

	/**
	 * 권장사항 생성
	 */
	private generateRecommendations(strategy: CompanyStrategy, existingKPIs: KPI[]): any[] {
		const recommendations: any[] = []

		// 1. 전략적 우선순위 추가 권장
		if (strategy.strategicPriorities.length < 3) {
			recommendations.push({
				type: 'add_priority',
				title: '전략적 우선순위 추가',
				description: '최소 3-5개의 전략적 우선순위를 설정하여 명확한 방향성을 제시하세요',
				priority: 'high',
				estimatedImpact: '조직 정렬도 30% 향상',
			})
		}

		// 2. KPI 설정 권장
		if (existingKPIs.length < 5) {
			recommendations.push({
				type: 'new_initiative',
				title: 'KPI 설정',
				description: 'AI 추천을 활용하여 전략에 맞는 KPI를 생성하세요',
				priority: 'high',
				estimatedImpact: '성과 가시성 50% 향상',
			})
		}

		// 3. 목표 조정 권장
		const currentYear = new Date().getFullYear()
		const currentGoal = strategy.annualGoals?.find(g => g.year === currentYear)
		if (!currentGoal) {
			recommendations.push({
				type: 'adjust_goal',
				title: '올해 목표 설정',
				description: `${currentYear}년도 연간 목표를 설정하세요`,
				priority: 'high',
				estimatedImpact: '단기 집중도 40% 향상',
			})
		}

		return recommendations
	}

	/**
	 * KPI 커버리지 분석
	 */
	private analyzeKPICoverage(strategy: CompanyStrategy, existingKPIs: KPI[]): any[] {
		const categories: KPICategory[] = ['revenue', 'growth', 'customer', 'product', 'operations', 'team', 'quality', 'efficiency']
		
		return categories.map(category => {
			const currentKPIs = existingKPIs.filter(k => k.category === category)
			const covered = currentKPIs.length > 0
			const suggestedKPIs = covered ? 0 : 1

			return {
				category,
				covered,
				currentKPIs: currentKPIs.length,
				suggestedKPIs,
			}
		})
	}

	/**
	 * 우선순위 점수 계산
	 */
	private calculatePriorityScore(kpi: SuggestedKPI, strategy: CompanyStrategy): number {
		let score = kpi.alignmentScore

		// 카테고리별 가중치
		const categoryWeights: Record<KPICategory, number> = {
			revenue: 1.0,
			growth: 0.95,
			customer: 0.9,
			product: 0.85,
			operations: 0.8,
			team: 0.75,
			quality: 0.85,
			efficiency: 0.8,
		}

		score *= categoryWeights[kpi.category] || 0.7

		// 연결된 전략 수에 따른 보너스
		score += kpi.linkedStrategies.length * 0.05

		return Math.min(1.0, score)
	}

	/**
	 * 전체 신뢰도 계산
	 */
	private calculateOverallConfidence(kpis: SuggestedKPI[]): number {
		if (kpis.length === 0) return 0
		
		const avgAlignment = kpis.reduce((sum, k) => sum + k.alignmentScore, 0) / kpis.length
		return Math.round(avgAlignment * 100) / 100
	}

	/**
	 * 우선순위로부터 카테고리 결정
	 */
	private determineCategoryFromPriority(priority: StrategicPriority): KPICategory {
		const title = priority.title.toLowerCase()
		
		if (title.includes('매출') || title.includes('revenue') || title.includes('수익')) return 'revenue'
		if (title.includes('성장') || title.includes('growth') || title.includes('확장')) return 'growth'
		if (title.includes('고객') || title.includes('customer') || title.includes('사용자')) return 'customer'
		if (title.includes('제품') || title.includes('product') || title.includes('서비스')) return 'product'
		if (title.includes('운영') || title.includes('operation') || title.includes('프로세스')) return 'operations'
		if (title.includes('팀') || title.includes('인력') || title.includes('채용')) return 'team'
		if (title.includes('품질') || title.includes('quality')) return 'quality'
		if (title.includes('효율') || title.includes('efficiency') || title.includes('생산성')) return 'efficiency'
		
		return 'operations'  // 기본값
	}

	/**
	 * 지표에 맞는 단위 결정
	 */
	private determineUnit(metric: string): string {
		const metricLower = metric.toLowerCase()
		
		if (metricLower.includes('율') || metricLower.includes('rate') || metricLower.includes('%')) return '%'
		if (metricLower.includes('금액') || metricLower.includes('매출') || metricLower.includes('비용')) return '원'
		if (metricLower.includes('수') || metricLower.includes('건') || metricLower.includes('명')) return '건'
		if (metricLower.includes('점수') || metricLower.includes('score')) return '점'
		
		return '건'  // 기본값
	}

	/**
	 * 우선순위에 맞는 부서 결정
	 */
	private determineDepartments(title: string): string[] {
		const titleLower = title.toLowerCase()
		const departments: string[] = []

		if (titleLower.includes('매출') || titleLower.includes('영업')) departments.push('영업')
		if (titleLower.includes('마케팅') || titleLower.includes('홍보')) departments.push('마케팅')
		if (titleLower.includes('제품') || titleLower.includes('개발')) departments.push('제품개발')
		if (titleLower.includes('운영') || titleLower.includes('관리')) departments.push('운영')
		if (titleLower.includes('인사') || titleLower.includes('채용')) departments.push('인사')
		
		return departments.length > 0 ? departments : ['전략기획']
	}
}

// Singleton instance
export const strategyAnalyzerService = new StrategyAnalyzerService()

