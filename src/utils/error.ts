/**
 * Error Handling Utilities
 * 
 * 에러 처리를 위한 유틸리티 함수들
 */

import { toast } from 'sonner'
import { ERROR_MESSAGES } from '../constants'

/**
 * 에러 타입 정의
 */
export class AppError extends Error {
	code?: string
	statusCode?: number
	details?: any
	
	constructor(
		message: string,
		code?: string,
		statusCode?: number,
		details?: any
	) {
		super(message)
		this.name = 'AppError'
		this.code = code
		this.statusCode = statusCode
		this.details = details
	}
}

/**
 * API 에러 처리
 */
export const handleApiError = (error: any): string => {
	if (error.response) {
		// 서버 응답이 있는 경우
		const { status, data } = error.response
		
		switch (status) {
			case 400:
				return data?.message || ERROR_MESSAGES.INVALID_EMAIL
			case 401:
				return ERROR_MESSAGES.UNAUTHORIZED
			case 404:
				return ERROR_MESSAGES.NOT_FOUND
			case 500:
				return ERROR_MESSAGES.SERVER_ERROR
			default:
				return data?.message || ERROR_MESSAGES.SERVER_ERROR
		}
	} else if (error.request) {
		// 요청은 보냈지만 응답이 없는 경우
		return ERROR_MESSAGES.NETWORK_ERROR
	} else {
		// 요청 설정 중 에러가 발생한 경우
		return error.message || ERROR_MESSAGES.SERVER_ERROR
	}
}

/**
 * 에러 토스트 표시
 */
export const showErrorToast = (error: any, customMessage?: string) => {
	const message = customMessage || handleApiError(error)
	toast.error(message)
}

/**
 * 성공 토스트 표시
 */
export const showSuccessToast = (message: string) => {
	toast.success(message)
}

/**
 * 경고 토스트 표시
 */
export const showWarningToast = (message: string) => {
	toast.warning(message)
}

/**
 * 정보 토스트 표시
 */
export const showInfoToast = (message: string) => {
	toast.info(message)
}

/**
 * Try-Catch 래퍼
 */
export const tryCatch = async <T>(
	fn: () => Promise<T>,
	errorMessage?: string
): Promise<[T | null, Error | null]> => {
	try {
		const result = await fn()
		return [result, null]
	} catch (error) {
		if (errorMessage) {
			showErrorToast(error, errorMessage)
		}
		return [null, error as Error]
	}
}

/**
 * 에러 로깅
 */
export const logError = (error: any, context?: string) => {
	console.error(`[Error${context ? ` - ${context}` : ''}]:`, error)
	
	// 프로덕션 환경에서는 에러 추적 서비스로 전송
	if (import.meta.env.PROD) {
		// TODO: Sentry, LogRocket 등 에러 추적 서비스 연동
	}
}

/**
 * 폼 에러 처리
 */
export const handleFormError = (error: any): Record<string, string> => {
	if (error.response?.data?.errors) {
		return error.response.data.errors
	}
	return {}
}

/**
 * 에러 재시도 로직
 */
export const retryWithBackoff = async <T>(
	fn: () => Promise<T>,
	maxRetries: number = 3,
	delay: number = 1000
): Promise<T> => {
	let lastError: Error
	
	for (let i = 0; i < maxRetries; i++) {
		try {
			return await fn()
		} catch (error) {
			lastError = error as Error
			if (i < maxRetries - 1) {
				await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)))
			}
		}
	}
	
	throw lastError!
}

/**
 * 에러 경계 래퍼
 */
export const withErrorBoundary = <T extends (...args: any[]) => any>(
	fn: T,
	onError?: (error: Error) => void
): T => {
	return ((...args: Parameters<T>) => {
		try {
			const result = fn(...args)
			if (result instanceof Promise) {
				return result.catch((error) => {
					logError(error, fn.name)
					onError?.(error)
					throw error
				})
			}
			return result
		} catch (error) {
			logError(error as Error, fn.name)
			onError?.(error as Error)
			throw error
		}
	}) as T
}

