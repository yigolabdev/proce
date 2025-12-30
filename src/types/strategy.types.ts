/**
 * Company Strategy Types
 * 기업 전략 관리를 위한 타입 정의
 */

import type { KPICategory } from './kpi.types'

/**
 * 전략 시간 프레임
 */
export type StrategyTimeframe = 'short' | 'mid' | 'long'  // 1년/3년/5년

/**
 * 전략 우선순위 상태
 */
export type StrategyStatus = 'active' | 'achieved' | 'discontinued'

/**
 * 전략적 우선순위
 */
export interface StrategicPriority {
	id: string
	title: string
	description: string
	timeframe: StrategyTimeframe
	targetMetrics: string[]
	status: StrategyStatus
	startDate?: string
	targetDate?: string
	progress?: number  // 0-100
	owner?: string
	ownerId?: string
}

/**
 * 시장 포지션
 */
export interface MarketPosition {
	targetMarket: string
	marketSize?: string
	marketShare?: number
	competitiveAdvantage: string[]
	threats: string[]
	opportunities: string[]
	weaknesses?: string[]
	strengths?: string[]
}

/**
 * 연간 목표
 */
export interface AnnualGoal {
	year: number
	revenue: number
	revenueUnit?: string  // 원, $, 억원 등
	growth: number  // 성장률 (%)
	expansion: string[]  // 확장 계획
	keyInitiatives: string[]  // 주요 이니셔티브
	budget?: number
}

/**
 * 회사 전략
 */
export interface CompanyStrategy {
	id: string
	
	// 핵심 전략
	vision: string
	mission: string
	coreValues: string[]
	
	// 전략적 우선순위
	strategicPriorities: StrategicPriority[]
	
	// 시장 포지션
	marketPosition: MarketPosition
	
	// 연간 목표
	annualGoals: AnnualGoal[]
	
	// 메타 정보
	createdAt: string
	updatedAt: string
	createdBy: string
	createdById?: string
	lastReviewedAt?: string
	lastReviewedBy?: string
}

/**
 * 전략 → KPI 추천
 */
export interface StrategyToKPIRecommendation {
	strategyId: string
	strategyTitle: string
	suggestedKPIs: SuggestedKPI[]
	generatedAt: string
	confidence: number  // 전체 추천 신뢰도 (0-1)
}

/**
 * 제안된 KPI
 */
export interface SuggestedKPI {
	id: string
	name: string
	description: string
	category: KPICategory
	
	// 추천 근거
	reasoning: string
	alignmentScore: number  // 전략과의 정렬도 (0-1)
	priorityScore: number  // 우선순위 점수 (0-1)
	
	// 목표 설정
	suggestedTarget: number
	suggestedUnit: string
	suggestedPeriod: 'quarter' | 'year'
	
	// 책임 부서
	suggestedDepartments: string[]
	suggestedOwner?: string
	
	// 연결된 전략
	linkedStrategies: string[]  // StrategicPriority IDs
	
	// 수락 상태
	status: 'pending' | 'accepted' | 'rejected' | 'modified'
	acceptedAt?: string
	modifiedTarget?: number
}

/**
 * 전략 분석 결과
 */
export interface StrategyAnalysisResult {
	// 전략 건강도
	healthScore: number  // 0-100
	
	// 분석 결과
	strengths: string[]
	weaknesses: string[]
	gaps: string[]  // 전략 갭 (다루지 못한 영역)
	
	// 권장사항
	recommendations: {
		type: 'add_priority' | 'adjust_goal' | 'new_initiative' | 'resource_reallocation'
		title: string
		description: string
		priority: 'high' | 'medium' | 'low'
		estimatedImpact: string
	}[]
	
	// KPI 커버리지
	kpiCoverage: {
		category: KPICategory
		covered: boolean
		currentKPIs: number
		suggestedKPIs: number
	}[]
}

/**
 * 전략 폼 데이터
 */
export interface StrategyFormData {
	vision: string
	mission: string
	coreValues: string[]
	strategicPriorities: Omit<StrategicPriority, 'id'>[]
	marketPosition: MarketPosition
	annualGoals: AnnualGoal[]
}

/**
 * 전략 업데이트 데이터
 */
export type StrategyUpdateData = Partial<StrategyFormData>

/**
 * 전략 통계
 */
export interface StrategyStats {
	totalPriorities: number
	activePriorities: number
	achievedPriorities: number
	averageProgress: number
	kpisGenerated: number
	strategicAlignment: number  // 전체 정렬도 (0-100)
}

