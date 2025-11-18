// Common Types for Proce Application
// Centralized type definitions for localStorage data and shared interfaces

// ==================== Work Entry Types ====================

export interface WorkEntry {
	id: string
	title: string
	category: string
	description: string
	date: Date | string
	duration: string
	projectId?: string
	objectiveId?: string
	tags?: string[]
	files?: FileAttachment[]
	links?: LinkResource[]
	department?: string
	status?: 'draft' | 'submitted' | 'pending_approval' | 'approved' | 'rejected'
	createdAt?: Date | string
	updatedAt?: Date | string
	submittedBy?: string
	submittedAt?: Date | string
	reviewedBy?: string
	reviewedAt?: Date | string
	reviewComments?: string
}

export interface FileAttachment {
	id: string
	name: string
	size: number
	type: string
	url?: string
	uploadedAt: Date | string
}

export interface LinkResource {
	id: string
	url: string
	title?: string
	description?: string
}

// ==================== Project Types ====================

export type ProjectStatus = 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled'

export interface ProjectMember {
	id: string
	name: string
	email: string
	role: string
}

export interface Milestone {
	id: string
	name: string
	plannedDate: string
	actualDate?: string
	status: 'pending' | 'in-progress' | 'completed' | 'delayed'
	completionDate?: string
}

export interface ProjectSchedule {
	plannedStartDate: string
	actualStartDate?: string
	plannedEndDate: string
	actualEndDate?: string
	estimatedEndDate?: string
	milestones?: Milestone[]
}

export interface Project {
	id: string
	name: string
	description: string
	status: ProjectStatus
	progress: number
	startDate: Date | string
	endDate: Date | string
	department?: string // Legacy: single department (deprecated)
	departments?: string[] // New: multiple departments
	objectives?: string[] // Project objectives/goals
	members?: ProjectMember[]
	tags?: string[]
	priority?: 'low' | 'medium' | 'high'
	budget?: number
	createdAt: Date | string
	createdBy: string
	schedule?: ProjectSchedule
	files?: FileAttachment[] // Attached files
	links?: LinkResource[] // Related links
}

// ==================== OKR Types ====================

export type OKRStatus = 'not-started' | 'on-track' | 'at-risk' | 'behind' | 'completed'

export interface KeyResult {
	id: string
	description: string
	target: number
	current: number
	unit: string
	progress: number
}

export interface Objective {
	id: string
	title: string
	description?: string
	period: string
	team?: string
	owner?: string
	status: OKRStatus
	progress: number
	keyResults: KeyResult[]
	startDate?: Date | string
	endDate?: Date | string
	createdAt?: Date | string
}

// ==================== Category & Tag Types ====================

export interface WorkCategory {
	id: string
	name: string
	color: string
	description: string
	isActive?: boolean
}

export interface WorkTag {
	id: string
	name: string
	category?: string
	color?: string
}

export interface WorkTemplate {
	id: string
	title: string
	description: string
	category: string
	content?: string
	tags?: string[]
}

// ==================== Department & User Types ====================

export interface Department {
	id: string
	name: string
	code: string
	parentId?: string
	managerId?: string
	managerName?: string
	description?: string
	employeeCount?: string | number
	location?: string
	isActive?: boolean
}

export type UserRole = 'user' | 'admin' | 'executive'

export interface User {
	id: string
	email: string
	name: string
	role: UserRole
	department?: string
	position?: string
	avatar?: string
	phone?: string
	isActive?: boolean
	createdAt?: Date | string
}

// ==================== Task Recommendation Types ====================

export interface TaskRecommendation {
	id: string
	title: string
	description: string
	priority: 'high' | 'medium' | 'low'
	category?: string
	deadline?: string
	dataSource?: string // 추천 근거가 되는 데이터 출처
	status: 'pending' | 'accepted' | 'rejected' | 'completed'
	projectId?: string // 프로젝트 ID
	projectName?: string // 프로젝트 이름
	source?: 'ai' | 'manual' // AI 생성 또는 수동 생성
	isManual?: boolean // 수동 생성 여부
	createdAt?: string // 생성 시간
	createdBy?: string // 생성자 ID
	createdByName?: string // 생성자 이름
	assignedTo?: string // 할당받은 사람 ID
	assignedToName?: string // 할당받은 사람 이름
	acceptedAt?: string // 수락 시간
	completedAt?: string // 완료 시간
	estimatedDuration?: number // 예상 소요 시간 (분)
	estimatedTime?: number // 예상 소요 시간 (분) - 별칭
	aiReason?: string // AI 추천 이유
	suggestedBy?: string // 제안자
	tags?: string[]
	relatedMembers?: Array<{
		id: string
		name: string
		role: string
		department: string
		memberType?: 'active' | 'related'
	}>
	aiAnalysis?: {
		projectName: string
		analysisDate: string
		analysisReason: string
		relatedMembers: Array<{
			name: string
			role: string
			department: string
			memberType: 'active' | 'related'
		}>
	}
}

// ==================== Draft & Settings Types ====================

export interface WorkDraft {
	id: string
	title: string
	category: string
	description: string
	savedAt: Date | string
	[key: string]: any // Allow additional fields
}

export interface WorkspaceSettings {
	language: string
	timezone: string
	workingDays: string[]
	workingHours: {
		start: string
		end: string
	}
	holidays: string[]
	quietHours: {
		enabled: boolean
		start: string
		end: string
	}
	decisionMode: 'strict' | 'flexible' | 'custom'
	requireEvidence: boolean
	showAIConfidence: boolean
	autoApprovalForLowRisk: boolean
	escalationWindow: number
}

// ==================== Message Types ====================

export type MessageType = 'info' | 'warning' | 'alert' | 'success'
export type MessagePriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Message {
	id: string
	type: MessageType
	priority: MessagePriority
	title: string
	content: string
	date: Date | string
	isRead: boolean
	isStarred: boolean
	isArchived: boolean
	sender?: string
	tags?: string[]
}

// ==================== localStorage Keys ====================

export const STORAGE_KEYS = {
	// Work Management
	WORK_ENTRIES: 'workEntries',
	WORK_DRAFTS: 'workDrafts',
	WORK_CATEGORIES: 'workCategories',
	WORK_TAGS: 'workTags',
	WORK_TEMPLATES: 'workTemplates',
	
	// Projects & OKR
	PROJECTS: 'projects',
	OBJECTIVES: 'objectives',
	
	// Organization
	DEPARTMENTS: 'departments',
	USERS: 'users',
	
	// Settings
	WORKSPACE_SETTINGS: 'workspaceSettings',
	USER_PREFERENCES: 'userPreferences',
	
	// Messages
	MESSAGES: 'messages',
	
	// Company
	COMPANY_INFO: 'companyInfo',
	LEADERSHIP: 'leadership',
	COMPANY_KPIS: 'companyKPIs',
	FINANCIAL_DATA: 'financialData',
	DOCUMENTS: 'documents',
	
	// Auth
	AUTH_USER: 'user',
	AUTH_TOKEN: 'token',
} as const

// ==================== localStorage Type Map ====================

export interface StorageTypeMap {
	[STORAGE_KEYS.WORK_ENTRIES]: WorkEntry[]
	[STORAGE_KEYS.WORK_DRAFTS]: WorkDraft[]
	[STORAGE_KEYS.WORK_CATEGORIES]: WorkCategory[]
	[STORAGE_KEYS.WORK_TAGS]: WorkTag[]
	[STORAGE_KEYS.WORK_TEMPLATES]: WorkTemplate[]
	[STORAGE_KEYS.PROJECTS]: Project[]
	[STORAGE_KEYS.OBJECTIVES]: Objective[]
	[STORAGE_KEYS.DEPARTMENTS]: Department[]
	[STORAGE_KEYS.USERS]: User[]
	[STORAGE_KEYS.WORKSPACE_SETTINGS]: WorkspaceSettings
	[STORAGE_KEYS.MESSAGES]: Message[]
	[STORAGE_KEYS.AUTH_USER]: User | null
}

// ==================== Utility Types ====================

export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

export type WithOptional<T, K extends keyof T> = Omit<T, K> & { [P in K]?: T[P] }

// ==================== API Response Types ====================

export interface ApiResponse<T = any> {
	success: boolean
	data?: T
	error?: string
	message?: string
}

export interface PaginatedResponse<T = any> {
	data: T[]
	total: number
	page: number
	pageSize: number
	totalPages: number
}
