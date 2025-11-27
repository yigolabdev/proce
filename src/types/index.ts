/**
 * Types Index
 * 
 * 중앙화된 타입 export
 * 모든 타입을 여기서 import하여 사용하는 것을 권장
 */

// Common types - 가장 많이 사용되는 타입들
export type {
	// Work Entry
	WorkEntry,
	WorkEntryStatus,
	FileAttachment,
	LinkResource,
	WorkDraft,
	
	// Project
	Project,
	ProjectStatus,
	ProjectMember,
	ProjectSchedule,
	ProjectResources,
	ProjectRisk,
	ProjectAIAnalysis,
	CreateProjectData,
	UpdateProjectData,
	ProjectStats,
	ProjectFilter,
	Milestone,
	
	// OKR
	Objective,
	KeyResult,
	OKRStatus,
	
	// Category & Tag
	WorkCategory,
	WorkTag,
	WorkTemplate,
	
	// Department & User
	Department,
	User,
	UserRole,
	
	// Task
	TaskRecommendation,
	
	// Message
	Message,
	
	// Settings
	WorkspaceSettings,
	
	// Utility types
	DeepPartial,
	WithRequired,
	WithOptional,
	
	// API types
	ApiResponse,
	PaginatedResponse,
} from './common.types'

// API specific types
export type {
	CreateWorkEntryDto,
	UpdateWorkEntryDto,
	CreateProjectDto,
	CreateObjectiveDto,
	CreateKeyResultDto,
	CreateReviewRequestDto,
	SubmitReviewDto,
	WorkEntryFilters,
	ProjectFilters,
	OKRFilters,
	PaginationParams,
	DashboardStats,
	AnalyticsRequest,
	AnalyticsResponse,
	FileUploadResponse,
	MultiFileUploadResponse,
	WebSocketMessage,
	RealtimeNotification,
} from './api.types'

// Constants
export { STORAGE_KEYS } from './common.types'

