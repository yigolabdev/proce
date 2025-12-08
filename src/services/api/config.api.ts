/**
 * API Base Configuration
 * 백엔드 API 연동을 위한 기본 설정
 */

/**
 * API 환경 설정
 */
export const API_CONFIG = {
	// 환경별 API URL
	baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
	timeout: 30000, // 30초
	
	// 재시도 설정
	retry: {
		attempts: 3,
		delay: 1000, // 1초
		backoff: 2, // 지수 백오프
	},
	
	// 인증 설정
	auth: {
		tokenKey: 'auth_token',
		refreshTokenKey: 'refresh_token',
		headerName: 'Authorization',
		headerPrefix: 'Bearer',
	},
	
	// 캐시 설정
	cache: {
		enabled: true,
		ttl: 5 * 60 * 1000, // 5분
	},
} as const

/**
 * API 엔드포인트
 */
export const API_ENDPOINTS = {
	// 인증
	auth: {
		login: '/auth/login',
		logout: '/auth/logout',
		refresh: '/auth/refresh',
		signup: '/auth/signup',
		forgotPassword: '/auth/forgot-password',
		resetPassword: '/auth/reset-password',
	},
	
	// 업무 기록
	workEntries: {
		list: '/work-entries',
		create: '/work-entries',
		get: (id: string) => `/work-entries/${id}`,
		update: (id: string) => `/work-entries/${id}`,
		delete: (id: string) => `/work-entries/${id}`,
		history: (id: string) => `/work-entries/${id}/history`,
	},
	
	// 프로젝트
	projects: {
		list: '/projects',
		create: '/projects',
		get: (id: string) => `/projects/${id}`,
		update: (id: string) => `/projects/${id}`,
		delete: (id: string) => `/projects/${id}`,
		members: (id: string) => `/projects/${id}/members`,
		addMember: (id: string) => `/projects/${id}/members`,
		removeMember: (id: string, userId: string) => `/projects/${id}/members/${userId}`,
		workEntries: (id: string) => `/projects/${id}/work-entries`,
	},
	
	// 메시지
	messages: {
		list: '/messages',
		create: '/messages',
		get: (id: string) => `/messages/${id}`,
		update: (id: string) => `/messages/${id}`,
		delete: (id: string) => `/messages/${id}`,
		thread: (id: string) => `/messages/${id}/thread`,
		reply: (id: string) => `/messages/${id}/reply`,
		markAsRead: (id: string) => `/messages/${id}/read`,
	},
	
	// 검토
	reviews: {
		pending: '/reviews/pending',
		received: '/reviews/received',
		create: '/reviews',
		update: (id: string) => `/reviews/${id}`,
		approve: (id: string) => `/reviews/${id}/approve`,
		reject: (id: string) => `/reviews/${id}/reject`,
	},
	
	// 태스크
	tasks: {
		list: '/tasks',
		create: '/tasks',
		get: (id: string) => `/tasks/${id}`,
		update: (id: string) => `/tasks/${id}`,
		delete: (id: string) => `/tasks/${id}`,
		assign: (id: string) => `/tasks/${id}/assign`,
		complete: (id: string) => `/tasks/${id}/complete`,
	},
	
	// AI 추천
	ai: {
		recommendations: '/ai/recommendations',
		generateTasks: '/ai/generate-tasks',
		analyze: '/ai/analyze',
	},
	
	// 사용자
	users: {
		me: '/users/me',
		list: '/users',
		get: (id: string) => `/users/${id}`,
		update: (id: string) => `/users/${id}`,
		delete: (id: string) => `/users/${id}`,
	},
	
	// 부서
	departments: {
		list: '/departments',
		create: '/departments',
		get: (id: string) => `/departments/${id}`,
		update: (id: string) => `/departments/${id}`,
		delete: (id: string) => `/departments/${id}`,
	},
	
	// 대시보드
	dashboard: {
		stats: '/dashboard/stats',
		recentWork: '/dashboard/recent-work',
		performance: '/dashboard/performance',
	},
} as const

/**
 * HTTP 메서드
 */
export enum HttpMethod {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	PATCH = 'PATCH',
	DELETE = 'DELETE',
}

/**
 * API 응답 타입
 */
export interface ApiResponse<T = any> {
	success: boolean
	data: T
	message?: string
	meta?: {
		page?: number
		limit?: number
		total?: number
		hasMore?: boolean
	}
}

/**
 * API 에러 타입
 */
export interface ApiError {
	success: false
	error: {
		code: string
		message: string
		details?: any
	}
	statusCode: number
}

/**
 * 페이지네이션 파라미터
 */
export interface PaginationParams {
	page?: number
	limit?: number
	sortBy?: string
	sortOrder?: 'asc' | 'desc'
}

/**
 * 필터 파라미터
 */
export interface FilterParams {
	search?: string
	status?: string[]
	category?: string[]
	dateFrom?: string
	dateTo?: string
	[key: string]: any
}

/**
 * API 요청 옵션
 */
export interface ApiRequestOptions {
	headers?: Record<string, string>
	params?: Record<string, any>
	skipAuth?: boolean
	skipCache?: boolean
	retryAttempts?: number
}

