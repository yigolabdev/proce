/**
 * API Types
 * 
 * 백엔드 API와의 통신을 위한 타입 정의
 */

// ==================== Base API Types ====================

/**
 * 표준 API 응답 형식
 */
export interface ApiResponse<T = any> {
	success: boolean
	data: T
	message?: string
	timestamp: string
}

/**
 * API 에러 응답
 */
export interface ApiError {
	success: false
	code: string
	message: string
	details?: any
	timestamp: string
}

/**
 * 페이지네이션 파라미터
 */
export interface PaginationParams {
	page?: number
	limit?: number
	sort?: string
	order?: 'asc' | 'desc'
	filters?: Record<string, any>
}

/**
 * 페이지네이션 응답
 */
export interface PaginatedResponse<T> {
	data: T[]
	pagination: {
		page: number
		limit: number
		total: number
		totalPages: number
		hasNext: boolean
		hasPrev: boolean
	}
}

// ==================== Request/Response DTOs ====================

/**
 * 작업 입력 DTO
 */
export interface CreateWorkEntryDto {
	title: string
	description: string
	category: string
	duration?: string
	projectId?: string
	objectiveId?: string
	keyResultId?: string
	tags?: string[]
	files?: File[]
	links?: { url: string; title: string }[]
	isConfidential?: boolean
}

/**
 * 작업 업데이트 DTO
 */
export interface UpdateWorkEntryDto extends Partial<CreateWorkEntryDto> {
	status?: 'draft' | 'submitted' | 'approved' | 'rejected'
}

/**
 * 프로젝트 생성 DTO
 */
export interface CreateProjectDto {
	name: string
	description: string
	startDate: string
	endDate?: string
	budget?: number
	departmentId?: string
	teamMemberIds?: string[]
	tags?: string[]
}

/**
 * OKR 생성 DTO
 */
export interface CreateObjectiveDto {
	title: string
	description: string
	quarter: string
	year: number
	departmentId?: string
	ownerId: string
	keyResults: CreateKeyResultDto[]
}

export interface CreateKeyResultDto {
	title: string
	description: string
	targetValue: number
	currentValue: number
	unit: string
}

/**
 * 리뷰 요청 DTO
 */
export interface CreateReviewRequestDto {
	workEntryId: string
	reviewerId: string
	message?: string
	deadline?: string
}

/**
 * 리뷰 제출 DTO
 */
export interface SubmitReviewDto {
	workEntryId: string
	status: 'approved' | 'rejected' | 'needs_revision'
	comment: string
	rating?: number
}

// ==================== Query Params ====================

/**
 * 작업 필터
 */
export interface WorkEntryFilters {
	startDate?: string
	endDate?: string
	category?: string
	projectId?: string
	status?: string
	submittedBy?: string
	tags?: string[]
}

/**
 * 프로젝트 필터
 */
export interface ProjectFilters {
	status?: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled'
	departmentId?: string
	startDate?: string
	endDate?: string
}

/**
 * OKR 필터
 */
export interface OKRFilters {
	quarter?: string
	year?: number
	departmentId?: string
	ownerId?: string
	status?: 'not-started' | 'on-track' | 'at-risk' | 'completed'
}

// ==================== Analytics & Reports ====================

/**
 * 대시보드 통계
 */
export interface DashboardStats {
	workEntries: {
		total: number
		thisWeek: number
		thisMonth: number
		avgDuration: number
	}
	projects: {
		active: number
		completed: number
		onTrack: number
		atRisk: number
	}
	okrs: {
		total: number
		onTrack: number
		atRisk: number
		avgProgress: number
	}
	team: {
		activeMembers: number
		avgProductivity: number
		topPerformers: Array<{
			userId: string
			name: string
			score: number
		}>
	}
}

/**
 * 분석 보고서 요청
 */
export interface AnalyticsRequest {
	type: 'productivity' | 'project-health' | 'okr-progress' | 'team-performance'
	startDate: string
	endDate: string
	departmentId?: string
	userId?: string
	groupBy?: 'day' | 'week' | 'month'
}

/**
 * 분석 보고서 응답
 */
export interface AnalyticsResponse {
	type: string
	period: {
		start: string
		end: string
	}
	summary: Record<string, any>
	data: Array<{
		date: string
		value: number
		metadata?: Record<string, any>
	}>
	insights: string[]
}

// ==================== File Upload ====================

/**
 * 파일 업로드 응답
 */
export interface FileUploadResponse {
	id: string
	url: string
	filename: string
	size: number
	mimeType: string
	uploadedAt: string
}

/**
 * 다중 파일 업로드 응답
 */
export interface MultiFileUploadResponse {
	files: FileUploadResponse[]
	failedFiles: Array<{
		filename: string
		error: string
	}>
}

// ==================== Real-time & WebSocket ====================

/**
 * WebSocket 메시지
 */
export interface WebSocketMessage<T = any> {
	type: 'notification' | 'update' | 'ping' | 'pong'
	event: string
	data: T
	timestamp: string
}

/**
 * 실시간 알림
 */
export interface RealtimeNotification {
	id: string
	type: 'review' | 'mention' | 'assignment' | 'deadline' | 'approval'
	title: string
	message: string
	relatedEntityType: 'work' | 'project' | 'okr' | 'review'
	relatedEntityId: string
	actionUrl?: string
	createdAt: string
	isRead: boolean
}
