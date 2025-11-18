/**
 * API Client
 * 
 * Generic HTTP client for making API requests.
 * Handles authentication, error handling, and response parsing.
 */

import { API_BASE_URL, API_TIMEOUT, getAuthHeaders, ApiError, type ApiResponse } from './config'

/**
 * HTTP methods
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

/**
 * Request options
 */
interface RequestOptions extends Omit<RequestInit, 'method' | 'body'> {
	data?: any
	params?: Record<string, any>
}

/**
 * Build URL with query parameters
 */
function buildUrl(endpoint: string, params?: Record<string, any>): string {
	const url = new URL(`${API_BASE_URL}${endpoint}`)
	
	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				url.searchParams.append(key, String(value))
			}
		})
	}
	
	return url.toString()
}

/**
 * Make HTTP request
 */
async function request<T>(
	method: HttpMethod,
	endpoint: string,
	options: RequestOptions = {}
): Promise<ApiResponse<T>> {
	const { data, params, headers, ...restOptions } = options
	
	const url = buildUrl(endpoint, params)
	
	const config: RequestInit = {
		method,
		headers: {
			...getAuthHeaders(),
			...headers,
		},
		...restOptions,
	}
	
	// Add body for non-GET requests
	if (data && method !== 'GET') {
		config.body = JSON.stringify(data)
	}
	
	// Add timeout
	const controller = new AbortController()
	const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)
	config.signal = controller.signal
	
	try {
		const response = await fetch(url, config)
		clearTimeout(timeoutId)
		
		// Parse response
		const responseData = await response.json()
		
		// Handle error responses
		if (!response.ok) {
			throw new ApiError(
				response.status,
				responseData.message || 'An error occurred',
				responseData
			)
		}
		
		return responseData
	} catch (error) {
		clearTimeout(timeoutId)
		
		// Handle network errors
		if (error instanceof ApiError) {
			throw error
		}
		
		// Handle timeout
		if (error instanceof Error && error.name === 'AbortError') {
			throw new ApiError(408, 'Request timeout')
		}
		
		// Handle other errors
		throw new ApiError(500, 'Network error')
	}
}

/**
 * API Client methods
 */
export const apiClient = {
	get: <T>(endpoint: string, options?: RequestOptions) =>
		request<T>('GET', endpoint, options),
		
	post: <T>(endpoint: string, data?: any, options?: RequestOptions) =>
		request<T>('POST', endpoint, { ...options, data }),
		
	put: <T>(endpoint: string, data?: any, options?: RequestOptions) =>
		request<T>('PUT', endpoint, { ...options, data }),
		
	patch: <T>(endpoint: string, data?: any, options?: RequestOptions) =>
		request<T>('PATCH', endpoint, { ...options, data }),
		
	delete: <T>(endpoint: string, options?: RequestOptions) =>
		request<T>('DELETE', endpoint, options),
}

