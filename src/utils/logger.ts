/**
 * Logger Utility
 * 
 * Centralized logging system that replaces console.error/warn/info
 * with proper error handling and context tracking.
 */

import { handleError } from './errorHandler'

interface LogContext {
	component?: string
	action?: string
	[key: string]: unknown
}

class Logger {
	private isDevelopment = import.meta.env.DEV

	/**
	 * Log error with context
	 */
	error(error: unknown, context?: LogContext | string): void {
		const contextObj = typeof context === 'string' 
			? { component: context } 
			: context

		// Always handle error through error handler
		handleError(error)

		// Log to console in development
		if (this.isDevelopment) {
			console.error('[ERROR]', {
				error,
				context: contextObj,
				timestamp: new Date().toISOString(),
			})
		}

		// TODO: Send to error tracking service in production
		// if (!this.isDevelopment) {
		//   errorTrackingService.captureException(error, contextObj)
		// }
	}

	/**
	 * Log warning
	 */
	warn(message: string, context?: LogContext | string): void {
		const contextObj = typeof context === 'string' 
			? { component: context } 
			: context

		if (this.isDevelopment) {
			console.warn('[WARN]', {
				message,
				context: contextObj,
				timestamp: new Date().toISOString(),
			})
		}
	}

	/**
	 * Log info
	 */
	info(message: string, context?: LogContext | string): void {
		const contextObj = typeof context === 'string' 
			? { component: context } 
			: context

		if (this.isDevelopment) {
			console.info('[INFO]', {
				message,
				context: contextObj,
				timestamp: new Date().toISOString(),
			})
		}
	}

	/**
	 * Log debug (development only)
	 */
	debug(message: string, data?: unknown, context?: LogContext | string): void {
		if (!this.isDevelopment) return

		const contextObj = typeof context === 'string' 
			? { component: context } 
			: context

		console.debug('[DEBUG]', {
			message,
			data,
			context: contextObj,
			timestamp: new Date().toISOString(),
		})
	}

	/**
	 * Log performance metric
	 */
	performance(label: string, duration: number, context?: LogContext): void {
		if (this.isDevelopment) {
			console.log(`[PERF] ${label}: ${duration}ms`, context)
		}

		// TODO: Send to analytics service
	}
}

export const logger = new Logger()

