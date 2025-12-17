/**
 * KPI (Key Performance Indicator) Types
 * KPI 관리를 위한 타입 정의
 */

/**
 * KPI 카테고리
 */
export type KPICategory = 
	| 'revenue'        // 매출
	| 'growth'         // 성장
	| 'customer'       // 고객
	| 'product'        // 제품
	| 'operations'     // 운영
	| 'team'           // 팀/인력
	| 'quality'        // 품질
	| 'efficiency'     // 효율성

/**
 * KPI (핵심 성과 지표)
 */
export interface KPI {
	id: string
	name: string
	description: string
	category: KPICategory
	
	// 측정 지표
	metric: {
		current: number
		target: number
		unit: string  // %, 원, 명, 건 등
		format: 'number' | 'percentage' | 'currency' | 'count'
	}
	
	// 기간
	period: 'quarter' | 'year'
	startDate: string
	endDate: string
	
	// 소유자
	owner: string
	ownerId: string
	department: string
	departmentId: string
	
	// 우선순위
	priority: 'critical' | 'high' | 'medium' | 'low'
	
	// 진척도 (자동 계산)
	progress: number  // 0-100
	status: 'on-track' | 'at-risk' | 'behind' | 'achieved'
	
	// 연결된 OKR (AI가 자동 생성)
	linkedObjectives?: string[]  // Objective IDs
	
	// 메타 정보
	createdAt: string
	updatedAt: string
	createdBy: string
}

/**
 * KPI 폼 데이터
 */
export interface KPIFormData {
	name: string
	description: string
	category: KPICategory
	metric: {
		current: number
		target: number
		unit: string
		format: 'number' | 'percentage' | 'currency' | 'count'
	}
	period: 'quarter' | 'year'
	startDate: string
	endDate: string
	owner: string
	department: string
	priority: 'critical' | 'high' | 'medium' | 'low'
}

/**
 * KPI 통계
 */
export interface KPIStats {
	total: number
	onTrack: number
	atRisk: number
	behind: number
	achieved: number
	averageProgress: number
	byCategory: Record<KPICategory, number>
	byDepartment: Record<string, number>
}

/**
 * KPI 필터
 */
export interface KPIFilter {
	category?: KPICategory
	department?: string
	owner?: string
	status?: KPI['status'][]
	priority?: KPI['priority'][]
	period?: 'quarter' | 'year'
}

/**
 * KPI Props 타입
 */
export interface KPIListProps {
	kpis: KPI[]
	onSelect: (kpi: KPI) => void
	onEdit: (kpi: KPI) => void
	onDelete: (id: string) => void
	filter?: KPIFilter
}

export interface KPIFormProps {
	kpi?: KPI
	onSubmit: (data: KPIFormData) => void
	onCancel: () => void
	departments: Array<{ id: string; name: string }>
	users: Array<{ id: string; name: string }>
	isSubmitting?: boolean
}

export interface KPICardProps {
	kpi: KPI
	onClick?: () => void
	onEdit?: () => void
	onDelete?: () => void
}

/**
 * AI가 생성한 OKR 추천
 */
export interface AIGeneratedOKR {
	id: string
	title: string
	description: string
	confidenceScore: number  // 0-1
	reasoning: string
	
	// 예상 KPI 기여도
	expectedKPIContribution: number  // 0-100%
	
	// 자동 생성된 Key Results
	suggestedKeyResults: AIGeneratedKeyResult[]
	
	// 리소스 예측
	estimatedResources: {
		timeRequired: string  // "2-3 months"
		teamSize: number
		requiredSkills: string[]
	}
	
	// 성공 가능성
	feasibility: {
		score: number  // 0-1
		challenges: string[]
		successFactors: string[]
	}
	
	// 메타 정보
	category: string
	priority: 'high' | 'medium' | 'low'
}

/**
 * AI가 생성한 Key Result
 */
export interface AIGeneratedKeyResult {
	id: string
	description: string
	target: number
	current: number
	unit: string
	suggestedOwner?: string
	confidenceScore: number
	
	// 예상 Task들
	suggestedTasks?: AIGeneratedTask[]
}

/**
 * AI가 생성한 Task
 */
export interface AIGeneratedTask {
	id: string
	title: string
	description: string
	priority: 'high' | 'medium' | 'low'
	estimatedDuration: number  // minutes
	suggestedDeadline: string
	confidenceScore: number
}

/**
 * KPI Hook 반환 타입
 */
export interface UseKPIReturn {
	// Data
	kpis: KPI[]
	selectedKPI: KPI | null
	stats: KPIStats
	
	// Actions
	createKPI: (data: KPIFormData) => Promise<void>
	updateKPI: (id: string, data: Partial<KPI>) => Promise<void>
	deleteKPI: (id: string, cascadeDelete?: boolean) => Promise<any>
	selectKPI: (kpi: KPI | null) => void
	
	// Status
	isLoading: boolean
	error: Error | null
}
