/**
 * Error Handler Utilities
 * 
 * Centralized error handling utilities for consistent error management.
 */

import { toast } from 'sonner'
import { ApiError } from '../services/api/config'

/**
 * Error message mapping
 */
const ERROR_MESSAGES: Record<number, string> = {
	400: 'Invalid request. Please check your input.',
	401: 'Unauthorized. Please log in again.',
	403: 'Access denied. You don\'t have permission.',
	404: 'Resource not found.',
	408: 'Request timeout. Please try again.',
	409: 'Conflict. The resource already exists.',
	429: 'Too many requests. Please slow down.',
	500: 'Server error. Please try again later.',
	503: 'Service unavailable. Please try again later.',
}

/**
 * Error handler class for better organization
 */
class ErrorHandler {
	/**
	 * Get user-friendly error message
	 */
	getErrorMessage(error: unknown): string {
		if (error instanceof ApiError) {
			return ERROR_MESSAGES[error.status] || error.message
		}
		
		if (error instanceof Error) {
			return error.message
		}
		
		return 'An unexpected error occurred'
	}

	/**
	 * Handle error with toast notification
	 */
	handleError(error: unknown, customMessage?: string): void {
		const message = customMessage || this.getErrorMessage(error)
		
		toast.error(message, {
			duration: 5000,
		})
		
		// Error is logged by logger utility (if imported)
		// Import logger only when needed to avoid circular dependencies
		if (import.meta.env.DEV) {
			console.error('[ErrorHandler]', error)
		}
	}
	
	/**
	 * Handle success with toast notification
	 */
	handleSuccess(message: string, options?: { duration?: number }): void {
		toast.success(message, {
			duration: options?.duration || 3000,
		})
	}
	
	/**
	 * Handle warning with toast notification
	 */
	handleWarning(message: string, options?: { duration?: number }): void {
		toast.warning(message, {
			duration: options?.duration || 4000,
		})
	}
	
	/**
	 * Handle info with toast notification
	 */
	handleInfo(message: string, options?: { duration?: number }): void {
		toast.info(message, {
			duration: options?.duration || 3000,
		})
	}
}

/**
 * Handle async operations with error handling
 */
export async function handleAsync<T>(
	promise: Promise<T>,
	errorMessage?: string
): Promise<[T | null, Error | null]> {
	try {
		const data = await promise
		return [data, null]
	} catch (error) {
		if (errorMessage) {
			handleError(error, errorMessage)
		}
		return [null, error instanceof Error ? error : new Error('Unknown error')]
	}
}

/**
 * Retry failed operations
 */
export async function retryOperation<T>(
	operation: () => Promise<T>,
	maxRetries: number = 3,
	delay: number = 1000
): Promise<T> {
	let lastError: Error
	
	for (let i = 0; i < maxRetries; i++) {
		try {
			return await operation()
		} catch (error) {
			lastError = error instanceof Error ? error : new Error('Unknown error')
			
			// Don't retry on client errors (4xx)
			if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
				throw error
			}
			
			// Wait before retry (exponential backoff)
			if (i < maxRetries - 1) {
				await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
			}
		}
	}
	
	throw lastError!
}

// Export singleton instance
export const errorHandler = new ErrorHandler()

// Export convenience functions for backward compatibility
export const handleError = (error: unknown, customMessage?: string) => {
	errorHandler.handleError(error, customMessage)
}

export const handleSuccess = (message: string, options?: { duration?: number }) => {
	errorHandler.handleSuccess(message, options)
}

export const handleWarning = (message: string, options?: { duration?: number }) => {
	errorHandler.handleWarning(message, options)
}

export const handleInfo = (message: string, options?: { duration?: number }) => {
	errorHandler.handleInfo(message, options)
}

