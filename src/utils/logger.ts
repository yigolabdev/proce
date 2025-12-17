/**
 * Professional Logging System
 * 
 * 10년차 개발자 수준의 로깅 시스템
 * - 환경별 로깅 레벨 관리
 * - 구조화된 로그 포맷
 * - 에러 추적 및 컨텍스트 정보
 * - 프로덕션 환경 최적화
 */

export enum LogLevel {
	ERROR = 0,
	WARN = 1,
	INFO = 2,
	DEBUG = 3,
}

export interface LogContext {
	component?: string
	function?: string
	userId?: string
	sessionId?: string
	[key: string]: unknown
}

export interface LogEntry {
	level: LogLevel
	message: string
	context?: LogContext
	timestamp: string
	error?: Error
	stack?: string
}

class Logger {
	private currentLevel: LogLevel = 
		import.meta.env.MODE === 'production' ? LogLevel.INFO : LogLevel.DEBUG

	private formatMessage(entry: LogEntry): string {
		const parts = [
			`[${entry.timestamp}]`,
			`[${LogLevel[entry.level]}]`,
		]

		if (entry.context?.component) {
			parts.push(`[${entry.context.component}]`)
		}

		if (entry.context?.function) {
			parts.push(`[${entry.context.function}]`)
		}

		parts.push(entry.message)

		return parts.join(' ')
	}

	private shouldLog(level: LogLevel): boolean {
		return level <= this.currentLevel
	}

	private createEntry(
		level: LogLevel,
		message: string,
		context?: LogContext,
		error?: Error
	): LogEntry {
		return {
			level,
			message,
			context,
			timestamp: new Date().toISOString(),
			error,
			stack: error?.stack,
		}
	}

	private sendToMonitoring(entry: LogEntry): void {
		// TODO: 프로덕션 환경에서 모니터링 서비스로 전송
		// 예: Sentry, DataDog, CloudWatch 등
		if (import.meta.env.MODE === 'production' && entry.level === LogLevel.ERROR) {
			// window.Sentry?.captureException(entry.error, {
			//   contexts: { custom: entry.context }
			// })
		}
	}

	error(message: string, error?: Error, context?: LogContext): void {
		if (!this.shouldLog(LogLevel.ERROR)) return

		const entry = this.createEntry(LogLevel.ERROR, message, context, error)
		
		console.error(this.formatMessage(entry), {
			error,
			context,
			stack: error?.stack,
		})

		this.sendToMonitoring(entry)
	}

	warn(message: string, context?: LogContext): void {
		if (!this.shouldLog(LogLevel.WARN)) return

		const entry = this.createEntry(LogLevel.WARN, message, context)
		console.warn(this.formatMessage(entry), context)
	}

	info(message: string, context?: LogContext): void {
		if (!this.shouldLog(LogLevel.INFO)) return

		const entry = this.createEntry(LogLevel.INFO, message, context)
		console.info(this.formatMessage(entry), context)
	}

	debug(message: string, context?: LogContext): void {
		if (!this.shouldLog(LogLevel.DEBUG)) return

		const entry = this.createEntry(LogLevel.DEBUG, message, context)
		console.debug(this.formatMessage(entry), context)
	}

	setLevel(level: LogLevel): void {
		this.currentLevel = level
	}
}

// Singleton instance
export const logger = new Logger()

// Convenience exports
export default logger
