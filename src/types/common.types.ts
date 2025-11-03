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
	isConfidential: boolean
	linkedResources: LinkedResource[]
	isDecisionRequired: boolean
	decisionDetails?: DecisionDetails
}

export interface LinkedResource {
	id: ID
	url: string
	title: string
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
	status: Status
	progress: number
	keyResults: KeyResult[]
}

export interface KeyResult extends BaseEntity {
	title: string
	description: string
	targetValue: number
	currentValue: number
	unit: string
	status: Status
	progress: number
}

// ============================================
// User Types
// ============================================

export interface User extends BaseEntity {
	name: string
	email: string
	role: 'worker' | 'admin' | 'executive'
	department: string
	position: string
	avatar?: string
	isActive: boolean
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

export interface UploadedFile extends BaseEntity {
	name: string
	size: number
	type: string
	url?: string
	uploadedBy?: ID
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

