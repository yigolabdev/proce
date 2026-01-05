/**
 * User API Service (Employee Management)
 *
 * 직원 계정 생성 및 관리를 위한 API 서비스
 */

// Use environment variable for API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://3.36.126.154/api/v1'

/**
 * Custom fetch for user API endpoints
 */
async function userRequest<T>(
	endpoint: string,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST',
	data?: any
): Promise<T> {
	const url = `${API_BASE_URL}/${endpoint}`

	const config: RequestInit = {
		method,
		headers: {
			'Content-Type': 'application/json',
		},
	}

	if (data && (method === 'POST' || method === 'PUT')) {
		config.body = JSON.stringify(data)
	}

	// 🔍 REQUEST LOGGING
	console.group(`🌐 User API Request: ${method} ${endpoint}`)
	console.log('📍 Full URL:', url)
	console.log('📦 Request Data:', data)
	console.log('📋 Request Config:', config)
	console.groupEnd()

	try {
		const response = await fetch(url, config)

		// 🔍 RESPONSE STATUS LOGGING
		console.group(`📥 User API Response: ${method} ${endpoint}`)
		console.log('📊 Status:', response.status, response.statusText)
		console.log('📝 Headers:', Object.fromEntries(response.headers.entries()))

		const responseData = await response.json()
		console.log('💾 Response Data:', responseData)
		console.groupEnd()

		if (!response.ok) {
			// 🔍 ERROR LOGGING
			console.group(`❌ User API Error: ${method} ${endpoint}`)
			console.error('Status:', response.status)
			console.error('Response:', responseData)
			console.groupEnd()

			throw new Error(responseData.message || responseData.error || 'API 요청 실패')
		}

		return responseData
	} catch (error) {
		// 🔍 EXCEPTION LOGGING
		console.group(`⚠️ User API Exception: ${method} ${endpoint}`)
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

export interface CreateEmployeeRequest {
	// Required fields
	companyId: string
	companyName: string
	username: string
	name: string
	email: string
	password: string

	// Optional fields
	departmentId?: string
	departmentName?: string
	positionId?: string
	position?: string
	roleId?: string
	roleName?: string
	phoneNumber?: string
	birthDate?: string
	joinDate?: string
	address?: string
	city?: string
	country?: string
	postalCode?: string
	bio?: string
	skills?: string
	timezone?: string
	language?: string
	dateFormat?: string
	timeFormat?: string

	// Notification preferences
	emailNotifications?: boolean
	pushNotifications?: boolean
	desktopNotifications?: boolean
	smsNotifications?: boolean
	taskAssigned?: boolean
	taskDue?: boolean
	comments?: boolean
	mentions?: boolean
}

// ==================== Response Types ====================

export interface CreateEmployeeResponse {
	success: boolean
	data?: {
		userId: string
		email: string
		companyId: string
	}
	message?: string
}

export interface ApiErrorResponse {
	success: false
	error: string
}

// ==================== API Functions ====================

/**
 * 직원 사용자 생성
 * POST /user/create
 */
export async function createEmployee(
	data: CreateEmployeeRequest
): Promise<CreateEmployeeResponse> {
	return userRequest<CreateEmployeeResponse>(
		'user/create',
		'POST',
		data
	)
}

/**
 * Export all user services
 */
export const userService = {
	createEmployee,
}
