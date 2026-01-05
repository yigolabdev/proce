/**
 * Signup API Service
 *
 * 회사 등록을 위한 3단계 API 서비스:
 * 1. 이메일 인증 코드 발송
 * 2. 이메일 인증 코드 확인
 * 3. 회사 등록 완료
 */

// Use environment variable for API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://3.36.126.154/api/v1'

/**
 * Custom fetch for this specific API endpoint
 * (API 서버가 다른 base URL을 사용하기 때문)
 */
async function signupRequest<T>(
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
	console.group(`🌐 API Request: ${method} ${endpoint}`)
	console.log('📍 Full URL:', url)
	console.log('📦 Request Data:', data)
	console.log('📋 Request Config:', config)
	console.groupEnd()

	try {
		const response = await fetch(url, config)

		// 🔍 RESPONSE STATUS LOGGING
		console.group(`📥 API Response: ${method} ${endpoint}`)
		console.log('📊 Status:', response.status, response.statusText)
		console.log('📝 Headers:', Object.fromEntries(response.headers.entries()))

		const responseData = await response.json()
		console.log('💾 Response Data:', responseData)
		console.groupEnd()

		if (!response.ok) {
			// 🔍 ERROR LOGGING
			console.group(`❌ API Error: ${method} ${endpoint}`)
			console.error('Status:', response.status)
			console.error('Response:', responseData)
			console.groupEnd()

			throw new Error(responseData.message || responseData.error || 'API 요청 실패')
		}

		return responseData
	} catch (error) {
		// 🔍 EXCEPTION LOGGING
		console.group(`⚠️ API Exception: ${method} ${endpoint}`)
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

export interface SendVerificationCodeRequest {
	email: string
}

export interface VerifyEmailCodeRequest {
	email: string
	code: string
}

export interface CompanySignupRequest {
	companyName: string
	companyRegistrationNumber: string
	industry: string
	numberOfEmployees: string
	name: string
	email: string
	password: string
	username: string
	phone_number: string
}

export interface VerifyInviteCodeRequest {
	email: string
	inviteCode: string
}

export interface EmployeeSignupRequest {
	inviteCode: string
	username: string
	name: string
	email: string
	password: string
	phone: string
	countryCode: string
	department: string
	position: string
	jobs: string[]
}

// ==================== Response Types ====================

export interface SendVerificationCodeResponse {
	code: string
	message: string
	success: boolean
}

export interface VerifyEmailCodeResponse {
	code?: string
	message: string
	verified?: boolean
	success?: boolean
}

export interface CompanySignupResponse {
	code: string
	success: boolean
	data?: {
		companyId?: string
		userId?: string
		inviteCode?: string
	}
	message?: string
}

export interface VerifyInviteCodeResponse {
	code: string
	success: boolean
	message: string
	data?: {
		companyName: string
		industry: string
	}
}

export interface EmployeeSignupResponse {
	code: string
	success: boolean
	message: string
	data?: {
		userId: string
		username: string
	}
}

// ==================== API Functions ====================

/**
 * STEP 1: 이메일 인증 코드 발송
 * POST /signup/generateToken
 */
export async function sendVerificationCode(
	email: string
): Promise<SendVerificationCodeResponse> {
	return signupRequest<SendVerificationCodeResponse>(
		'signup/generateToken',
		'POST',
		{ email }
	)
}

/**
 * STEP 2: 이메일 인증 코드 확인
 * POST /signup/verifyToken
 */
export async function verifyEmailCode(
	email: string,
	code: string
): Promise<VerifyEmailCodeResponse> {
	return signupRequest<VerifyEmailCodeResponse>(
		'signup/verifyToken',
		'POST',
		{ email, code }
	)
}

/**
 * STEP 3: 회사 등록 완료
 * POST /signup/
 */
export async function completeCompanySignup(
	data: CompanySignupRequest
): Promise<CompanySignupResponse> {
	return signupRequest<CompanySignupResponse>(
		'signup',
		'POST',
		data
	)
}

/**
 * 직원 초대 코드 검증
 * POST /employee/verify-invite
 */
export async function verifyInviteCode(
	email: string,
	inviteCode: string
): Promise<VerifyInviteCodeResponse> {
	return signupRequest<VerifyInviteCodeResponse>(
		'employee/verify-invite',
		'POST',
		{ email, inviteCode }
	)
}

/**
 * 직원 회원가입 완료
 * POST /employee/signup
 */
export async function completeEmployeeSignup(
	data: EmployeeSignupRequest
): Promise<EmployeeSignupResponse> {
	return signupRequest<EmployeeSignupResponse>(
		'employee/signup',
		'POST',
		data
	)
}

/**
 * Export all signup services
 */
export const signupService = {
	sendVerificationCode,
	verifyEmailCode,
	completeCompanySignup,
	verifyInviteCode,
	completeEmployeeSignup,
}
