/**
 * Base API Service
 * 
 * 모든 API 호출의 기본이 되는 클래스
 * 백엔드 연동 시 이 파일만 수정하면 전체 API 연동 완료
 */

import type { ApiResponse, ApiError, PaginationParams, PaginatedResponse } from '../../types/api.types'

// API 설정
const API_CONFIG = {
	baseURL: import.meta.env.VITE_API_URL || '/api',
	timeout: 30000,
	headers: {
		'Content-Type': 'application/json',
	},
}

/**
 * API 에러 클래스
 */
export class ApiException extends Error {
	status: number
	code: string
	details?: any
	
	constructor(
		status: number,
		code: string,
		message: string,
		details?: any
	) {
		super(message)
		this.name = 'ApiException'
		this.status = status
		this.code = code
		this.details = details
	}
}

/**
 * Base API Client
 */
class BaseApiClient {
	private baseURL: string
	private timeout: number
	private defaultHeaders: Record<string, string>

	constructor(config = API_CONFIG) {
		this.baseURL = config.baseURL
		this.timeout = config.timeout
		this.defaultHeaders = config.headers
	}

	/**
	 * 인증 토큰 설정
	 */
	setAuthToken(token: string) {
		this.defaultHeaders['Authorization'] = `Bearer ${token}`
	}

	/**
	 * 인증 토큰 제거
	 */
	clearAuthToken() {
		delete this.defaultHeaders['Authorization']
	}

	/**
	 * HTTP 요청 실행
	 */
	private async request<T>(
		endpoint: string,
		options: RequestInit = {}
	): Promise<ApiResponse<T>> {
		const url = `${this.baseURL}${endpoint}`
		
		const config: RequestInit = {
			...options,
			headers: {
				...this.defaultHeaders,
				...options.headers,
			},
		}

		// 개발 환경에서는 localStorage 사용 (목업)
		if (import.meta.env.DEV) {
			return this.mockRequest<T>(endpoint, config)
		}

		// 프로덕션 환경에서는 실제 API 호출
		try {
			const controller = new AbortController()
			const timeoutId = setTimeout(() => controller.abort(), this.timeout)

			const response = await fetch(url, {
				...config,
				signal: controller.signal,
			})

			clearTimeout(timeoutId)

			if (!response.ok) {
				const error: ApiError = await response.json()
				throw new ApiException(
					response.status,
					error.code || 'UNKNOWN_ERROR',
					error.message || 'An error occurred',
					error.details
				)
			}

			const data: ApiResponse<T> = await response.json()
			return data
		} catch (error) {
			if (error instanceof ApiException) {
				throw error
			}
			
			if (error instanceof Error) {
				if (error.name === 'AbortError') {
					throw new ApiException(408, 'TIMEOUT', 'Request timeout')
				}
				throw new ApiException(500, 'NETWORK_ERROR', error.message)
			}
			
			throw new ApiException(500, 'UNKNOWN_ERROR', 'An unknown error occurred')
		}
	}

	/**
	 * 목업 요청 (개발 환경)
	 */
	private async mockRequest<T>(
		_endpoint: string,
		_config: RequestInit
	): Promise<ApiResponse<T>> {
		// localStorage 기반 목업 데이터 반환
		// 실제 백엔드가 없을 때 프론트엔드 개발을 위한 fallback
		await new Promise(resolve => setTimeout(resolve, 300)) // 네트워크 지연 시뮬레이션

		return {
			success: true,
			data: {} as T,
			message: 'Mock response',
			timestamp: new Date().toISOString(),
		}
	}

	/**
	 * GET 요청
	 */
	async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
		const queryString = params ? '?' + new URLSearchParams(params).toString() : ''
		const response = await this.request<T>(`${endpoint}${queryString}`, {
			method: 'GET',
		})
		return response.data
	}

	/**
	 * POST 요청
	 */
	async post<T, D = any>(endpoint: string, data?: D): Promise<T> {
		const response = await this.request<T>(endpoint, {
			method: 'POST',
			body: data ? JSON.stringify(data) : undefined,
		})
		return response.data
	}

	/**
	 * PUT 요청
	 */
	async put<T, D = any>(endpoint: string, data?: D): Promise<T> {
		const response = await this.request<T>(endpoint, {
			method: 'PUT',
			body: data ? JSON.stringify(data) : undefined,
		})
		return response.data
	}

	/**
	 * PATCH 요청
	 */
	async patch<T, D = any>(endpoint: string, data?: D): Promise<T> {
		const response = await this.request<T>(endpoint, {
			method: 'PATCH',
			body: data ? JSON.stringify(data) : undefined,
		})
		return response.data
	}

	/**
	 * DELETE 요청
	 */
	async delete<T>(endpoint: string): Promise<T> {
		const response = await this.request<T>(endpoint, {
			method: 'DELETE',
		})
		return response.data
	}

	/**
	 * 페이지네이션 GET 요청
	 */
	async getPaginated<T>(
		endpoint: string,
		params?: PaginationParams
	): Promise<PaginatedResponse<T>> {
		const queryParams = {
			page: params?.page?.toString() || '1',
			limit: params?.limit?.toString() || '20',
			sort: params?.sort,
			order: params?.order,
			...params?.filters,
		}

		return this.get<PaginatedResponse<T>>(endpoint, queryParams)
	}
}

// Singleton 인스턴스
export const apiClient = new BaseApiClient()

// 편의 함수들
export const api = {
	get: <T>(endpoint: string, params?: Record<string, any>) => 
		apiClient.get<T>(endpoint, params),
	
	post: <T, D = any>(endpoint: string, data?: D) => 
		apiClient.post<T, D>(endpoint, data),
	
	put: <T, D = any>(endpoint: string, data?: D) => 
		apiClient.put<T, D>(endpoint, data),
	
	patch: <T, D = any>(endpoint: string, data?: D) => 
		apiClient.patch<T, D>(endpoint, data),
	
	delete: <T>(endpoint: string) => 
		apiClient.delete<T>(endpoint),
	
	getPaginated: <T>(endpoint: string, params?: PaginationParams) => 
		apiClient.getPaginated<T>(endpoint, params),
	
	setAuthToken: (token: string) => 
		apiClient.setAuthToken(token),
	
	clearAuthToken: () => 
		apiClient.clearAuthToken(),
}

