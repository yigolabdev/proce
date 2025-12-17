/**
 * OKR Types
 * Type definitions for OKR (Objectives and Key Results) system
 */

export interface KeyResult {
	id: string
	description: string
	target: number
	current: number
	unit: string
	owner: string
	ownerId: string  // 소유자 ID 추가
	
	// AI 분석 (선택적)
	aiAnalysis?: {
		onTrack: boolean
		predictedFinalValue: number
		confidence: number  // 0-1
		recommendations: string[]
	}
}

export interface Objective {
	id: string
	title: string
	description: string
	period: string  // Quarter (Q1-Q4) or Month (Jan-Dec)
	periodType: 'quarter' | 'month'
	
	// 개인 소유권 (필수)
	owner: string      // 소유자 이름
	ownerId: string    // 소유자 ID
	
	// 부서 정보 (선택적)
	department?: string
	
	status: 'on-track' | 'at-risk' | 'behind' | 'completed'
	keyResults: KeyResult[]
	startDate: string
	endDate: string
	
	// 달성 가능성 및 리소스 (선택적)
	feasibility?: {
		achievabilityScore: number  // 0-1
		basedOn: 'historical-data' | 'expert-estimate' | 'ai-prediction'
		similarObjectives: string[]
		successRate?: number  // 0-1
		confidence: number  // 0-1
	}
	resourceRequirements?: {
		estimatedEffort: string
		requiredSkills: string[]
		budgetNeeded?: number
		teamSize?: number
	}
	
	// 역사적 성과 데이터 (선택적)
	historicalData?: {
		previousAttempts: number
		previousBestResult?: number
		averageProgress?: number
		typicalBottlenecks: string[]
		lessonsLearned: string[]
	}
	
	// AI 추천 및 분석 (선택적)
	aiRecommendations?: {
		isRealistic: boolean
		confidenceLevel: number  // 0-1
		recommendationReason: string
		suggestedAdjustments: string[]
		successFactors: string[]
		risksAndMitigation: Array<{
			risk: string
			probability: number  // 0-1
			impact: 'low' | 'medium' | 'high'
			mitigation: string
		}>
		optimalTarget?: number
		predictedCompletion?: string
	}
}

export interface OKRStats {
	totalObjectives: number
	onTrack: number
	atRisk: number
	behind: number
	completed: number
	avgProgress: number
}

export interface Period {
	value: string
	label: string
	type: 'quarter' | 'month'
}

