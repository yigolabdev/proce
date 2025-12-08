/**
 * API Client with Interceptors
 * 통합 API 클라이언트 (인터셉터, 에러 처리, 재시도 로직 포함)
 */

import { API_CONFIG, HttpMethod, type ApiResponse, type ApiError, type ApiRequestOptions } from './config.api'

/**
 * API 클라이언트 클래스
 */
export class ApiClient {
	private baseURL: string
	private timeout: number
	private defaultHeaders: Record<string, string>
	private cache: Map<string, { data: any; timestamp: number }>
	private abortControllers: Map<string, AbortController>

	constructor() {
		this.baseURL = API_CONFIG.baseURL
		this.timeout = API_CONFIG.timeout
		this.defaultHeaders = {
			'Content-Type': 'application/json',
		}
		this.cache = new Map()
		this.abortControllers = new Map()
	}

	/**
	 * 인증 토큰 가져오기
	 */
	private getAuthToken(): string | null {
		return localStorage.getItem(API_CONFIG.auth.tokenKey)
	}

	/**
	 * 인증 헤더 추가
	 */
	private addAuthHeader(headers: Record<string, string>): Record<string, string> {
		const token = this.getAuthToken()
		if (token) {
			headers[API_CONFIG.auth.headerName] = `${API_CONFIG.auth.headerPrefix} ${token}`
		}
		return headers
	}

	/**
	 * 캐시 키 생성
	 */
	private getCacheKey(url: string, method: HttpMethod, params?: any): string {
		return `${method}:${url}:${JSON.stringify(params || {})}`
	}

	/**
	 * 캐시에서 데이터 가져오기
	 */
	private getFromCache<T>(key: string): T | null {
		if (!API_CONFIG.cache.enabled) return null

		const cached = this.cache.get(key)
		if (cached && Date.now() - cached.timestamp < API_CONFIG.cache.ttl) {
			return cached.data as T
		}

		// 만료된 캐시 삭제
		if (cached) {
			this.cache.delete(key)
		}

		return null
	}

	/**
	 * 캐시에 데이터 저장
	 */
	private setCache(key: string, data: any): void {
		if (!API_CONFIG.cache.enabled) return

		this.cache.set(key, {
			data,
			timestamp: Date.now(),
		})
	}

	/**
	 * 캐시 무효화
	 */
	public invalidateCache(pattern?: string): void {
		if (!pattern) {
			this.cache.clear()
			return
		}

		const keysToDelete: string[] = []
		this.cache.forEach((_, key) => {
			if (key.includes(pattern)) {
				keysToDelete.push(key)
			}
		})

		keysToDelete.forEach(key => this.cache.delete(key))
	}

	/**
	 * 요청 취소
	 */
	public cancelRequest(requestId: string): void {
		const controller = this.abortControllers.get(requestId)
		if (controller) {
			controller.abort()
			this.abortControllers.delete(requestId)
		}
	}

	/**
	 * 모든 요청 취소
	 */
	public cancelAllRequests(): void {
		this.abortControllers.forEach(controller => controller.abort())
		this.abortControllers.clear()
	}

	/**
	 * HTTP 요청 실행
	 */
	private async executeRequest<T>(
		url: string,
		method: HttpMethod,
		options: ApiRequestOptions = {},
		body?: any,
		attempt: number = 1
	): Promise<ApiResponse<T>> {
		const {
			headers = {},
			params,
			skipAuth = false,
			skipCache = false,
			retryAttempts = API_CONFIG.retry.attempts,
		} = options

		// URL 구성
		const fullURL = new URL(url.startsWith('http') ? url : `${this.baseURL}${url}`)
		if (params) {
			Object.keys(params).forEach(key => {
				if (params[key] !== undefined && params[key] !== null) {
					fullURL.searchParams.append(key, String(params[key]))
				}
			})
		}

		// 캐시 확인 (GET 요청만)
		if (method === HttpMethod.GET && !skipCache) {
			const cacheKey = this.getCacheKey(fullURL.toString(), method, params)
			const cached = this.getFromCache<T>(cacheKey)
			if (cached) {
				return {
					success: true,
					data: cached,
				}
			}
		}

		// 헤더 구성
		const requestHeaders = { ...this.defaultHeaders, ...headers }
		if (!skipAuth) {
			this.addAuthHeader(requestHeaders)
		}

		// AbortController 생성
		const requestId = `${method}:${fullURL.toString()}:${Date.now()}`
		const controller = new AbortController()
		this.abortControllers.set(requestId, controller)

		// 타임아웃 설정
		const timeoutId = setTimeout(() => controller.abort(), this.timeout)

		try {
			const response = await fetch(fullURL.toString(), {
				method,
				headers: requestHeaders,
				body: body ? JSON.stringify(body) : undefined,
				signal: controller.signal,
			})

			clearTimeout(timeoutId)
			this.abortControllers.delete(requestId)

			// 응답 처리
			if (!response.ok) {
				const errorData: ApiError = await response.json().catch(() => ({
					success: false,
					error: {
						code: 'UNKNOWN_ERROR',
						message: response.statusText || 'An error occurred',
					},
					statusCode: response.status,
				}))

				// 401 Unauthorized - 토큰 갱신 시도
				if (response.status === 401 && !skipAuth) {
					const refreshed = await this.refreshToken()
					if (refreshed && attempt === 1) {
						// 재시도
						return this.executeRequest(url, method, options, body, attempt + 1)
					}
				}

				// 재시도 로직 (5xx 에러)
				if (response.status >= 500 && attempt < retryAttempts) {
					const delay = API_CONFIG.retry.delay * Math.pow(API_CONFIG.retry.backoff, attempt - 1)
					await new Promise(resolve => setTimeout(resolve, delay))
					return this.executeRequest(url, method, options, body, attempt + 1)
				}

				throw errorData
			}

			const data: ApiResponse<T> = await response.json()

			// 캐시 저장 (GET 요청만)
			if (method === HttpMethod.GET && !skipCache) {
				const cacheKey = this.getCacheKey(fullURL.toString(), method, params)
				this.setCache(cacheKey, data.data)
			}

			return data

		} catch (error) {
			clearTimeout(timeoutId)
			this.abortControllers.delete(requestId)

			// AbortError는 재시도하지 않음
			if (error instanceof Error && error.name === 'AbortError') {
				throw {
					success: false,
					error: {
						code: 'REQUEST_ABORTED',
						message: 'Request was aborted',
					},
					statusCode: 0,
				} as ApiError
			}

			// 네트워크 에러 재시도
			if (attempt < retryAttempts) {
				const delay = API_CONFIG.retry.delay * Math.pow(API_CONFIG.retry.backoff, attempt - 1)
				await new Promise(resolve => setTimeout(resolve, delay))
				return this.executeRequest(url, method, options, body, attempt + 1)
			}

			throw error
		}
	}

	/**
	 * 토큰 갱신
	 */
	private async refreshToken(): Promise<boolean> {
		try {
			const refreshToken = localStorage.getItem(API_CONFIG.auth.refreshTokenKey)
			if (!refreshToken) return false

			const response = await fetch(`${this.baseURL}/auth/refresh`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ refreshToken }),
			})

			if (!response.ok) return false

			const data = await response.json()
			localStorage.setItem(API_CONFIG.auth.tokenKey, data.data.token)
			localStorage.setItem(API_CONFIG.auth.refreshTokenKey, data.data.refreshToken)

			return true
		} catch (error) {
			console.error('Token refresh failed:', error)
			return false
		}
	}

	/**
	 * GET 요청
	 */
	public async get<T>(url: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
		return this.executeRequest<T>(url, HttpMethod.GET, options)
	}

	/**
	 * POST 요청
	 */
	public async post<T>(url: string, body?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
		return this.executeRequest<T>(url, HttpMethod.POST, options, body)
	}

	/**
	 * PUT 요청
	 */
	public async put<T>(url: string, body?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
		return this.executeRequest<T>(url, HttpMethod.PUT, options, body)
	}

	/**
	 * PATCH 요청
	 */
	public async patch<T>(url: string, body?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
		return this.executeRequest<T>(url, HttpMethod.PATCH, options, body)
	}

	/**
	 * DELETE 요청
	 */
	public async delete<T>(url: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
		return this.executeRequest<T>(url, HttpMethod.DELETE, options)
	}
}

/**
 * 싱글톤 인스턴스
 */
export const apiClient = new ApiClient()

