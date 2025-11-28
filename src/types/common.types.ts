// Common Types for Proce Application
// Centralized type definitions for localStorage data and shared interfaces

// ==================== Work Entry Types ====================

export interface FileAttachment {
	id: string
	name: string
	size: number
	type: string
	url?: string
	uploadedAt?: Date | string
}

export interface LinkResource {
	id: string
	title: string
	url: string
	description?: string
	addedAt?: Date | string
}

export type WorkEntryStatus = 'draft' | 'submitted' | 'pending_approval' | 'approved' | 'rejected'

export interface WorkEntry {
	id: string
	title: string
	category: string
	description: string
	date: Date | string
	duration: string
	
	// Relations
	projectId?: string
	projectName?: string // Denormalized for display
	objectiveId?: string
	keyResultId?: string
	taskId?: string
	
	// Metadata
	tags?: string[]
	files?: FileAttachment[]
	links?: LinkResource[]
	isConfidential?: boolean
	
	// User & Department
	submittedBy?: string // User ID (legacy) or User name
	submittedById?: string // User ID (preferred)
	submittedByName?: string // User name (denormalized)
	department?: string
	
	// Status & Review
	status?: WorkEntryStatus
	reviewedBy?: string
	reviewedByName?: string
	reviewedAt?: Date | string
	reviewComments?: string
	
	// Timestamps
	createdAt?: Date | string
	updatedAt?: Date | string
	submittedAt?: Date | string
	
	// AI Analysis (optional)
	complexity?: 'low' | 'medium' | 'high'
	estimatedDuration?: string
	actualDuration?: string
	requiredSkills?: string[]
	collaborators?: string[]
	blockers?: string[]
}

/**
 * DTO for creating a new WorkEntry
 * Excludes auto-generated fields like id, timestamps
 */
export interface CreateWorkEntryDto {
	title: string
	category: string
	description: string
	date?: Date | string
	duration: string
	
	// Relations
	projectId?: string
	projectName?: string
	objectiveId?: string
	keyResultId?: string
	taskId?: string
	
	// Metadata
	tags?: string[]
	files?: FileAttachment[]
	links?: LinkResource[]
	isConfidential?: boolean
	
	// User & Department
	submittedBy?: string
	submittedById?: string
	department?: string
}

// ==================== Project Types ====================

export type ProjectStatus = 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled'

export interface ProjectMember {
	id: string
	name: string
	email: string
	role: 'leader' | 'member'
	department: string
	joinedAt?: Date | string
}

export interface Milestone {
	id: string
	name: string
	plannedDate: string
	actualDate?: string
	completionDate?: string
	status: 'pending' | 'in-progress' | 'completed' | 'delayed'
}

export interface ProjectSchedule {
	plannedStartDate: string
	actualStartDate?: string
	plannedEndDate: string
	actualEndDate?: string
	estimatedEndDate?: string
	milestones?: Milestone[]
}

export interface ProjectResources {
	budget?: number
	actualCost?: number
	teamSize: number
	requiredTeamSize?: number
	currentVelocity?: number
	requiredVelocity?: number
}

export interface ProjectRisk {
	id: string
	type: 'schedule' | 'resource' | 'technical' | 'external'
	severity: 'low' | 'medium' | 'high' | 'critical'
	description: string
	probability: number // 0-1
	impact: number // 0-1
	mitigation?: string
	aiDetected?: boolean
}

export interface ProjectAIAnalysis {
	healthScore: number // 0-1
	completionProbability: number // 0-1
	riskScore: number // 0-1
	teamWorkload: number // 0-1
	recommendedActions: string[]
	predictedIssues: string[]
	scheduleVariance?: number // days
}

export interface Project {
	id: string
	name: string
	description: string
	status: ProjectStatus
	progress: number
	startDate: Date | string
	endDate: Date | string
	departments: string[] // Multiple departments (required)
	objectives: string[] // Project objectives/goals (required)
	members: ProjectMember[] // Team members (required)
	tags?: string[]
	priority?: 'low' | 'medium' | 'high'
	createdAt: Date | string
	createdBy: string
	
	// Optional advanced features
	schedule?: ProjectSchedule
	resources?: ProjectResources
	risks?: ProjectRisk[]
	aiAnalysis?: ProjectAIAnalysis
	files?: FileAttachment[] // Attached files
	links?: LinkResource[] // Related links
}

/**
 * 프로젝트 생성 요청 데이터
 */
export type CreateProjectData = Omit<Project, 'id' | 'createdAt' | 'progress'>

/**
 * 프로젝트 수정 요청 데이터
 */
export type UpdateProjectData = Partial<Omit<Project, 'id' | 'createdAt'>>

/**
 * 프로젝트 통계
 */
export interface ProjectStats {
	total: number
	active: number
	planning: number
	completed: number
	onHold: number
	cancelled?: number
}

/**
 * 프로젝트 필터
 */
export type ProjectFilter = 'all' | ProjectStatus

// ==================== OKR Types ====================

export type OKRStatus = 'not-started' | 'on-track' | 'at-risk' | 'behind' | 'completed'

export interface KeyResult {
	id: string
	description: string
	target: number
	current: number
	unit: string
	progress: number
	owner?: string
	ownerId?: string
	createdAt?: Date | string
	updatedAt?: Date | string
}

export interface Objective {
	id: string
	title: string
	description?: string
	period: string // e.g., "Q4 2024" or "2024"
	quarter?: string // e.g., "Q4 2024"
	year?: number
	team?: string
	owner?: string
	ownerId?: string
	department?: string
	status: OKRStatus
	progress: number
	keyResults: KeyResult[]
	startDate?: Date | string
	endDate?: Date | string
	createdAt?: Date | string
	updatedAt?: Date | string
	createdBy?: string
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
	code?: string
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
	duration?: string
	projectId?: string
	objectiveId?: string
	keyResultId?: string
	taskId?: string
	tags?: string[]
	files?: FileAttachment[]
	links?: LinkResource[]
	isConfidential?: boolean
	savedAt: Date | string
	comment?: string
	[key: string]: any // Allow additional fields for flexibility
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
