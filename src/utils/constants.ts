/**
 * Application Constants
 * 
 * Centralized constants for the application.
 */

/**
 * API Configuration
 */
export const API = {
	TIMEOUT: 30000,
	RETRY_ATTEMPTS: 3,
	RETRY_DELAY: 1000,
} as const

/**
 * Pagination
 */
export const PAGINATION = {
	DEFAULT_PAGE_SIZE: 10,
	MAX_PAGE_SIZE: 100,
	PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const

/**
 * File Upload
 */
export const FILE_UPLOAD = {
	MAX_SIZE: 10 * 1024 * 1024, // 10MB
	ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
	ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
	ALLOWED_ALL_TYPES: [
		'image/jpeg',
		'image/png',
		'image/gif',
		'image/webp',
		'application/pdf',
		'application/msword',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		'application/vnd.ms-excel',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	],
} as const

/**
 * Date Formats
 */
export const DATE_FORMATS = {
	DISPLAY: 'MMM d, yyyy',
	DISPLAY_WITH_TIME: 'MMM d, yyyy h:mm a',
	ISO: 'yyyy-MM-dd',
	TIME: 'h:mm a',
} as const

/**
 * Task Configuration
 */
export const TASK = {
	PRIORITIES: ['low', 'medium', 'high'] as const,
	STATUSES: ['pending', 'accepted', 'completed'] as const,
	SOURCES: ['ai', 'manual'] as const,
} as const

/**
 * Project Configuration
 */
export const PROJECT = {
	STATUSES: ['planning', 'active', 'on-hold', 'completed'] as const,
} as const

/**
 * Message Configuration
 */
export const MESSAGE = {
	TYPES: ['task', 'review', 'approval', 'project', 'notification', 'team'] as const,
	PRIORITIES: ['normal', 'urgent'] as const,
} as const

/**
 * Review Configuration
 */
export const REVIEW = {
	TYPES: ['approved', 'changes_requested', 'rejected'] as const,
} as const

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
	AUTH_TOKEN: 'auth_token',
	USER: 'user',
	WORK_ENTRIES: 'workEntries',
	MESSAGES: 'messages',
	MANUAL_TASKS: 'manual_tasks',
	AI_RECOMMENDATIONS: 'ai_recommendations',
	RECEIVED_REVIEWS: 'received_reviews',
	PROJECTS: 'projects',
	OBJECTIVES: 'objectives',
	DEPARTMENTS: 'departments',
	USERS: 'users',
	THEME: 'theme',
	LANGUAGE: 'language',
} as const

/**
 * Routes
 */
export const ROUTES = {
	HOME: '/',
	LOGIN: '/auth/sign-up',
	DASHBOARD: '/app/dashboard',
	WORK_INPUT: '/app/input',
	WORK_HISTORY: '/app/work-history',
	WORK_REVIEW: '/app/work-review',
	MESSAGES: '/app/messages',
	AI_RECOMMENDATIONS: '/app/ai-recommendations',
	PROJECTS: '/app/projects',
	OKR: '/app/okr',
	SETTINGS: '/app/settings',
	GUIDE: '/app/guide',
	WORKFLOW: '/app/workflow',
} as const

/**
 * Animation Durations (ms)
 */
export const ANIMATION = {
	FAST: 150,
	NORMAL: 300,
	SLOW: 500,
} as const

/**
 * Breakpoints (px)
 */
export const BREAKPOINTS = {
	SM: 640,
	MD: 768,
	LG: 1024,
	XL: 1280,
	'2XL': 1536,
} as const

