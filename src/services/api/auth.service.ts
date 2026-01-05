/**
 * Authentication API Service
 *
 * 로그인/로그아웃/토큰 관리를 위한 API 서비스
 */

// Use environment variable for API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://3.36.126.154/api/v1'

/**
 * Custom fetch for auth API endpoints
 */
async function authRequest<T>(
	endpoint: string,
	method: 'GET' | 'POST' = 'POST',
	data?: any
): Promise<T> {
	const url = `${API_BASE_URL}/${endpoint}`

	const config: RequestInit = {
		method,
		headers: {
			'Content-Type': 'application/json',
		},
	}

	if (data && method === 'POST') {
		config.body = JSON.stringify(data)
	}

	// 🔍 REQUEST LOGGING
	console.group(`🌐 Auth API Request: ${method} ${endpoint}`)
	console.log('📍 Full URL:', url)
	console.log('📦 Request Data:', data)
	console.log('📋 Request Config:', config)
	console.groupEnd()

	try {
		const response = await fetch(url, config)

		// 🔍 RESPONSE STATUS LOGGING
		console.group(`📥 Auth API Response: ${method} ${endpoint}`)
		console.log('📊 Status:', response.status, response.statusText)
		console.log('📝 Headers:', Object.fromEntries(response.headers.entries()))

		const responseData = await response.json()
		console.log('💾 Response Data:', responseData)
		console.groupEnd()

		if (!response.ok) {
			// 🔍 ERROR LOGGING
			console.group(`❌ Auth API Error: ${method} ${endpoint}`)
			console.error('Status:', response.status)
			console.error('Response:', responseData)
			console.groupEnd()

			throw new Error(responseData.message || responseData.error || 'API 요청 실패')
		}

		return responseData
	} catch (error) {
		// 🔍 EXCEPTION LOGGING
		console.group(`⚠️ Auth API Exception: ${method} ${endpoint}`)
		console.error('Error Type:', error instanceof TypeError ? 'Network Error' : 'API Error')
		console.error('Error:', error)
		console.groupEnd()

		// Network errors (CORS, connection refused, etc.)
		if (error instanceof TypeError) {
			throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.')
		}
		// API errors
		if (error instanceof Error) {
			throw error
		}
		throw new Error('네트워크 오류가 발생했습니다')
	}
}

// ==================== Request Types ====================

export interface SignInRequest {
	email: string
	password: string
}

export interface RefreshTokenRequest {
	refreshToken: string
	email: string
}

// ==================== Response Types ====================

export interface SignInResponse {
	message: string
	tokens: {
		AccessToken: string
		ExpiresIn: number
		TokenType: string
		RefreshToken: string
	}
}

export interface RefreshTokenResponse {
	message: string
	tokens: {
		AccessToken: string
		ExpiresIn: number
		TokenType: string
		RefreshToken: string
	}
}

// ==================== API Functions ====================

/**
 * 로그인
 * POST /auth/signin
 *
 * 성공: 200 OK
 * 실패: 400 Bad Request (Invalid credentials)
 */
export async function signIn(
	credentials: SignInRequest
): Promise<SignInResponse> {
	const response = await authRequest<SignInResponse>(
		'auth/signin',
		'POST',
		credentials
	)
	return response
}

/**
 * 토큰 갱신
 * POST /auth/refresh-token
 */
export async function refreshToken(
	data: RefreshTokenRequest
): Promise<RefreshTokenResponse> {
	return authRequest<RefreshTokenResponse>(
		'auth/refresh-token',
		'POST',
		data
	)
}

/**
 * Export all auth services
 */
export const authService = {
	signIn,
	refreshToken,
}
