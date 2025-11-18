/**
 * API Configuration
 * 
 * This file contains the base configuration for API calls.
 * When backend is ready, update API_BASE_URL to point to the actual API endpoint.
 */

// Environment-based API URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// API timeout in milliseconds
export const API_TIMEOUT = 30000

// Common headers
export const DEFAULT_HEADERS = {
	'Content-Type': 'application/json',
}

/**
 * Get authentication token from localStorage
 */
export const getAuthToken = (): string | null => {
	return localStorage.getItem('auth_token')
}

/**
 * Get headers with authentication
 */
export const getAuthHeaders = (): HeadersInit => {
	const token = getAuthToken()
	return {
		...DEFAULT_HEADERS,
		...(token && { Authorization: `Bearer ${token}` }),
	}
}

/**
 * API Error class for better error handling
 */
export class ApiError extends Error {
	status: number
	data?: any
	
	constructor(
		status: number,
		message: string,
		data?: any
	) {
		super(message)
		this.name = 'ApiError'
		this.status = status
		this.data = data
	}
}

/**
 * Generic API response type
 */
export interface ApiResponse<T> {
	data: T
	message?: string
	success: boolean
}

/**
 * Paginated API response type
 */
export interface PaginatedResponse<T> {
	data: T[]
	total: number
	page: number
	pageSize: number
	totalPages: number
}

