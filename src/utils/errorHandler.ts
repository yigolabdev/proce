/**
 * Professional Error Handling System
 * 
 * 10년차 개발자 수준의 에러 처리
 * - 타입 안전한 에러 분류
 * - 사용자 친화적 메시지 생성
 * - 에러 복구 전략
 * - 구조화된 에러 로깅
 */

import { toast } from 'sonner'
import { logger } from './logger'

/**
 * Application Error Types
 */
export enum ErrorType {
	// Network Errors
	NETWORK_ERROR = 'NETWORK_ERROR',
	API_ERROR = 'API_ERROR',
	TIMEOUT_ERROR = 'TIMEOUT_ERROR',
	
	// Data Errors
	VALIDATION_ERROR = 'VALIDATION_ERROR',
	PARSE_ERROR = 'PARSE_ERROR',
	NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
	
	// Auth Errors
	AUTH_ERROR = 'AUTH_ERROR',
	PERMISSION_ERROR = 'PERMISSION_ERROR',
	
	// System Errors
	STORAGE_ERROR = 'STORAGE_ERROR',
	UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Structured Application Error
 */
export class AppError extends Error {
	constructor(
		public type: ErrorType,
		public message: string,
		public userMessage: string,
		public originalError?: unknown,
		public context?: Record<string, unknown>
	) {
		super(message)
		this.name = 'AppError'
		
		// Maintains proper stack trace (if available)
		if (typeof (Error as any).captureStackTrace === 'function') {
			(Error as any).captureStackTrace(this, AppError)
		}
	}

	toJSON() {
		return {
			type: this.type,
			message: this.message,
			userMessage: this.userMessage,
			context: this.context,
			stack: this.stack,
		}
	}
}

/**
 * Error Handler Class
 */
class ErrorHandler {
	/**
	 * Normalize any error to AppError
	 */
	normalize(error: unknown, context?: Record<string, unknown>): AppError {
		// Already an AppError
		if (error instanceof AppError) {
			return error
		}

		// Standard Error
		if (error instanceof Error) {
			return new AppError(
				ErrorType.UNKNOWN_ERROR,
				error.message,
				'문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
				error,
				context
			)
		}

		// Network/Fetch Error
		if (error instanceof TypeError && error.message.includes('fetch')) {
			return new AppError(
				ErrorType.NETWORK_ERROR,
				'Network request failed',
				'네트워크 연결을 확인해주세요.',
				error,
				context
			)
		}

		// Object with message property
		if (typeof error === 'object' && error !== null && 'message' in error) {
			const err = error as { message: string; [key: string]: unknown }
			return new AppError(
				ErrorType.UNKNOWN_ERROR,
				err.message,
				'문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
				error,
				context
			)
		}

		// String error
		if (typeof error === 'string') {
			return new AppError(
				ErrorType.UNKNOWN_ERROR,
				error,
				'문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
				error,
				context
			)
		}

		// Unknown error type
		return new AppError(
			ErrorType.UNKNOWN_ERROR,
			'An unknown error occurred',
			'알 수 없는 오류가 발생했습니다.',
			error,
			context
		)
	}

	/**
	 * Handle error with logging and user notification
	 */
	handle(
		error: unknown,
		options?: {
			context?: Record<string, unknown>
			showToast?: boolean
			silent?: boolean
			component?: string
			function?: string
		}
	): AppError {
		const appError = this.normalize(error, options?.context)

		// Log error
		if (!options?.silent) {
			logger.error(
				appError.message,
				appError.originalError instanceof Error 
					? appError.originalError 
					: new Error(String(appError.originalError)),
				{
					component: options?.component,
					function: options?.function,
					errorType: appError.type,
					...appError.context,
				}
			)
		}

		// Show toast notification
		if (options?.showToast !== false) {
			this.showUserNotification(appError)
		}

		return appError
	}

	/**
	 * Show user-friendly error notification
	 */
	private showUserNotification(error: AppError): void {
		const duration = error.type === ErrorType.NETWORK_ERROR ? 10000 : 5000

		toast.error(error.userMessage, {
			duration,
			description: import.meta.env.MODE === 'development' 
				? error.message 
				: undefined,
		})
	}

	/**
	 * Create specific error types
	 */
	createNetworkError(message: string, originalError?: unknown): AppError {
		return new AppError(
			ErrorType.NETWORK_ERROR,
			message,
			'네트워크 연결을 확인해주세요.',
			originalError
		)
	}

	createValidationError(message: string, context?: Record<string, unknown>): AppError {
		return new AppError(
			ErrorType.VALIDATION_ERROR,
			message,
			'입력하신 정보를 다시 확인해주세요.',
			undefined,
			context
		)
	}

	createAuthError(message: string): AppError {
		return new AppError(
			ErrorType.AUTH_ERROR,
			message,
			'로그인이 필요합니다.',
			undefined
		)
	}

	createStorageError(message: string, originalError?: unknown): AppError {
		return new AppError(
			ErrorType.STORAGE_ERROR,
			message,
			'데이터 저장에 실패했습니다. 브라우저 설정을 확인해주세요.',
			originalError
		)
	}
}

// Singleton instance
export const errorHandler = new ErrorHandler()

// Convenience export
export default errorHandler
