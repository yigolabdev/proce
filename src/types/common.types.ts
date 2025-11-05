/**
 * Common Types
 * 
 * 애플리케이션 전체에서 공통으로 사용되는 타입 정의
 */

// ============================================
// Base Types
// ============================================

export type ID = string

export type Timestamp = Date | string

export interface BaseEntity {
	id: ID
	createdAt: Timestamp
	updatedAt?: Timestamp
}

// ============================================
// Status Types
// ============================================

export type Status = 'pending' | 'active' | 'completed' | 'cancelled' | 'archived'

export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

export type Priority = 'low' | 'medium' | 'high' | 'urgent'

// ============================================
// Financial Types
// ============================================

export interface FinancialData extends BaseEntity {
	year: string
	totalRevenue: string
	netIncome: string
	totalAssets: string
	totalLiabilities: string
	longTermDebt: string
	totalEquity: string
}

export interface ExpenseEntry extends BaseEntity {
	date: string
	category: string
	subcategory: string
	amount: string
	description: string
	paymentMethod: string
	vendor: string
	department: string
	approvedBy: string
	tags: string[]
}

// ============================================
// Work Types
// ============================================

export interface WorkEntry extends BaseEntity {
	title: string
	description: string
	category: string
	tags: string[]
	date: string
	duration?: string
	status: Status
	priority?: Priority
	projectId?: string
	objectiveId?: string
	isConfidential: boolean
	linkedResources: LinkedResource[]
	isDecisionRequired: boolean
	decisionDetails?: DecisionDetails
	
	// AI 분석용 메타데이터
	complexity?: 'low' | 'medium' | 'high'
	estimatedDuration?: string
	actualDuration?: string
	requiredSkills?: string[]
	collaborators?: string[]
	blockers?: string[]
	qualityScore?: number  // 0-1
	performanceMetrics?: {
		onTime: boolean
		qualityRating: number  // 0-5
		effortAccuracy: number  // -1 to 1 (under/over estimation)
	}
	aiInsights?: {
		similarTasks: string[]
		productivityScore: number  // 0-1
		recommendations: string[]
		predictedDuration?: string
		riskFactors?: string[]
	}
}

export interface LinkedResource {
	id: ID
	url: string
	title: string
	addedAt?: string
}

export interface DecisionDetails {
	description: string
	assignedTo: 'team' | 'ai'
	teamMembers?: string[]
	priority: Priority
	deadline?: string
}

export interface DraftData {
	title: string
	description: string
	category: string
	tags: string[]
	linkedResources: LinkedResource[]
	isConfidential: boolean
	isDecisionRequired: boolean
	decisionDetails?: DecisionDetails
	projectId?: string
	savedAt: Timestamp
}

// ============================================
// Project Types
// ============================================

export interface Project extends BaseEntity {
	name: string
	description: string
	status: 'planning' | 'active' | 'on-hold' | 'completed'
	startDate: string
	endDate: string
	objectives: string[]
	teamMembers: TeamMember[]
	progress: number
	department?: string
	
	// 일정 및 리소스 관리
	schedule?: {
		plannedStartDate: string
		actualStartDate?: string
		plannedEndDate: string
		estimatedEndDate?: string
		milestones?: Array<{
			id: string
			name: string
			plannedDate: string
			completionDate?: string
			status: 'pending' | 'in-progress' | 'completed' | 'delayed'
		}>
	}
	resources?: {
		budget?: number
		actualCost?: number
		teamSize: number
		requiredTeamSize?: number
		currentVelocity?: number  // story points/sprint
		requiredVelocity?: number
	}
	
	// 리스크 및 AI 분석
	risks?: Array<{
		id: string
		type: 'schedule' | 'resource' | 'technical' | 'external'
		severity: 'low' | 'medium' | 'high' | 'critical'
		description: string
		probability: number  // 0-1
		impact: number  // 0-1
		mitigation?: string
		aiDetected?: boolean
	}>
	dependencies?: {
		blockedBy?: string[]
		blocking?: string[]
		externalDependencies?: string[]
	}
	aiAnalysis?: {
		healthScore: number  // 0-1
		completionProbability: number  // 0-1
		riskScore: number  // 0-1
		teamWorkload: number  // 0-1
		recommendedActions: string[]
		predictedIssues: string[]
		scheduleVariance?: number  // days
	}
}

export interface TeamMember {
	id: ID
	name: string
	email: string
	role: string
	avatar?: string
}

// ============================================
// OKR Types
// ============================================

export interface Objective extends BaseEntity {
	title: string
	description: string
	quarter: string
	year: number
	owner: string
	team?: string
	status: Status
	progress: number
	keyResults: KeyResult[]
	startDate?: string
	endDate?: string
	
	// 달성 가능성 및 리소스
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
	
	// 역사적 성과 데이터
	historicalData?: {
		previousAttempts: number
		previousBestResult?: number
		averageProgress?: number
		typicalBottlenecks: string[]
		lessonsLearned: string[]
	}
	
	// 관계 분석
	relationships?: {
		dependsOn: string[]
		supports: string[]
		conflictsWith?: string[]
		relatedProjects: string[]
	}
	
	// AI 추천 및 분석
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

export interface KeyResult extends BaseEntity {
	title: string
	description: string
	targetValue: number
	currentValue: number
	unit: string
	owner?: string
	status: Status
	progress: number
	
	// AI 분석
	aiAnalysis?: {
		onTrack: boolean
		predictedFinalValue: number
		confidence: number  // 0-1
		recommendations: string[]
	}
}

// ============================================
// User Types
// ============================================

export interface User extends BaseEntity {
	name: string
	email: string
	role: 'user' | 'admin' | 'executive'
	department: string
	position: string
	avatar?: string
	isActive: boolean
	
	// AI 개인화를 위한 프로필
	skills?: Array<{
		name: string
		level: number  // 0-1
		verifiedBy?: 'self' | 'manager' | 'peer' | 'system'
		lastUsed?: string
	}>
	preferences?: {
		workingHours?: { start: string; end: string }
		preferredTaskTypes?: string[]
		communicationStyle?: 'written' | 'verbal' | 'mixed'
		workStyle?: 'collaborative' | 'independent' | 'deep-work'
		notificationPreferences?: {
			email: boolean
			push: boolean
			slack?: boolean
		}
	}
	performance?: {
		avgTaskCompletionTime?: string
		onTimeDeliveryRate?: number  // 0-1
		qualityScore?: number  // 0-1
		collaborationScore?: number  // 0-1
		productivityTrend?: 'improving' | 'stable' | 'declining'
	}
	learningProfile?: {
		fastLearner?: boolean
		preferredLearningMethod?: 'hands-on' | 'reading' | 'mentoring' | 'course'
		recentSkillGains?: string[]
		developmentAreas?: string[]
	}
	aiInteractionHistory?: {
		totalInteractions?: number
		acceptedRecommendations?: number
		rejectedRecommendations?: number
		acceptanceRate?: number  // 0-1
		rejectedCategories?: string[]
		feedbackScore?: number  // 0-1
		lastInteractionDate?: string
	}
}

// ============================================
// Department Types
// ============================================

export interface Department extends BaseEntity {
	name: string
	description: string
	parentId?: ID
	managerId?: ID
	employeeCount: number
}

// ============================================
// KPI Types
// ============================================

export interface KPI extends BaseEntity {
	name: string
	description: string
	category: string
	target: string
	current?: string
	unit: string
	status: Status
	progress?: number
}

// ============================================
// File Upload Types
// ============================================

export interface UploadedFile {
	id: string
	name: string
	size: number
	type: string
	url: string
	uploadedBy?: string
	createdAt?: string
	updatedAt?: string
}

export interface UploadedFinancialDocument extends UploadedFile {
	year: string
}

// ============================================
// Notification Types
// ============================================

export interface Notification extends BaseEntity {
	type: 'info' | 'warning' | 'error' | 'success'
	title: string
	message: string
	read: boolean
	actionUrl?: string
}

// ============================================
// Message Types
// ============================================

export interface Message extends BaseEntity {
	from: string
	subject: string
	preview: string
	read: boolean
	starred: boolean
	category: 'inbox' | 'sent' | 'draft' | 'archive'
}

// ============================================
// AI Recommendation Types
// ============================================

export interface TaskRecommendation extends BaseEntity {
	title: string
	description: string
	priority: Priority
	estimatedTime: string
	category: string
	aiConfidence: number
	reasoning: string
	status: 'pending' | 'accepted' | 'rejected'
}

// ============================================
// Pagination Types
// ============================================

export interface PaginationParams {
	page: number
	limit: number
	sortBy?: string
	sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
	data: T[]
	total: number
	page: number
	limit: number
	totalPages: number
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T = any> {
	success: boolean
	data?: T
	error?: string
	message?: string
}

// ============================================
// Form Types
// ============================================

export interface FormField {
	name: string
	label: string
	type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox'
	placeholder?: string
	required?: boolean
	options?: { value: string; label: string }[]
	validation?: {
		min?: number
		max?: number
		pattern?: RegExp
		message?: string
	}
}

// ============================================
// Filter Types
// ============================================

export interface FilterOption {
	label: string
	value: string
	count?: number
}

export interface DateRange {
	start: string
	end: string
}

export interface FilterParams {
	search?: string
	category?: string
	status?: Status
	dateRange?: DateRange
	tags?: string[]
}

