/**
 * Error Handling System
 * 통합 에러 처리 및 바운더리 시스템
 */

import React, { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '../components/ui/Button'

/**
 * 에러 타입 정의
 */
export enum ErrorType {
	NETWORK = 'NETWORK',
	API = 'API',
	AUTH = 'AUTH',
	VALIDATION = 'VALIDATION',
	NOT_FOUND = 'NOT_FOUND',
	PERMISSION = 'PERMISSION',
	UNKNOWN = 'UNKNOWN',
}

/**
 * 앱 에러 클래스
 */
export class AppError extends Error {
	public readonly type: ErrorType
	public readonly code: string
	public readonly statusCode?: number
	public readonly details?: any
	public readonly timestamp: Date

	constructor(
		message: string,
		type: ErrorType = ErrorType.UNKNOWN,
		code: string = 'UNKNOWN_ERROR',
		statusCode?: number,
		details?: any
	) {
		super(message)
		this.name = 'AppError'
		this.type = type
		this.code = code
		this.statusCode = statusCode
		this.details = details
		this.timestamp = new Date()

		// Maintains proper stack trace for where our error was thrown (only available on V8)
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, AppError)
		}
	}

	/**
	 * 사용자 친화적 메시지 반환
	 */
	public getUserMessage(): string {
		switch (this.type) {
			case ErrorType.NETWORK:
				return '네트워크 연결을 확인해주세요.'
			case ErrorType.API:
				return '서버와의 통신 중 오류가 발생했습니다.'
			case ErrorType.AUTH:
				return '인증이 필요합니다. 다시 로그인해주세요.'
			case ErrorType.VALIDATION:
				return '입력한 정보를 확인해주세요.'
			case ErrorType.NOT_FOUND:
				return '요청한 데이터를 찾을 수 없습니다.'
			case ErrorType.PERMISSION:
				return '이 작업을 수행할 권한이 없습니다.'
			default:
				return this.message || '오류가 발생했습니다.'
		}
	}

	/**
	 * 로깅용 정보 반환
	 */
	public toLogObject(): Record<string, any> {
		return {
			name: this.name,
			message: this.message,
			type: this.type,
			code: this.code,
			statusCode: this.statusCode,
			details: this.details,
			timestamp: this.timestamp.toISOString(),
			stack: this.stack,
		}
	}
}

/**
 * 에러 처리 유틸리티
 */
export class ErrorHandler {
	/**
	 * 에러를 AppError로 변환
	 */
	static normalize(error: unknown): AppError {
		// 이미 AppError인 경우
		if (error instanceof AppError) {
			return error
		}

		// Error 객체인 경우
		if (error instanceof Error) {
			// API 에러인지 확인
			if ('statusCode' in error) {
				const apiError = error as any
				return new AppError(
					apiError.message || '서버 오류가 발생했습니다',
					this.getErrorTypeFromStatus(apiError.statusCode),
					apiError.code || 'API_ERROR',
					apiError.statusCode,
					apiError.details
				)
			}

			// 네트워크 에러인지 확인
			if (error.message.includes('fetch') || error.message.includes('network')) {
				return new AppError(
					'네트워크 연결을 확인해주세요',
					ErrorType.NETWORK,
					'NETWORK_ERROR'
				)
			}

			return new AppError(
				error.message,
				ErrorType.UNKNOWN,
				'UNKNOWN_ERROR'
			)
		}

		// 문자열 에러인 경우
		if (typeof error === 'string') {
			return new AppError(error, ErrorType.UNKNOWN, 'UNKNOWN_ERROR')
		}

		// 그 외의 경우
		return new AppError(
			'알 수 없는 오류가 발생했습니다',
			ErrorType.UNKNOWN,
			'UNKNOWN_ERROR',
			undefined,
			error
		)
	}

	/**
	 * HTTP 상태 코드로부터 에러 타입 추론
	 */
	private static getErrorTypeFromStatus(statusCode: number): ErrorType {
		if (statusCode === 401 || statusCode === 403) {
			return ErrorType.AUTH
		}
		if (statusCode === 404) {
			return ErrorType.NOT_FOUND
		}
		if (statusCode === 400 || statusCode === 422) {
			return ErrorType.VALIDATION
		}
		if (statusCode >= 500) {
			return ErrorType.API
		}
		return ErrorType.UNKNOWN
	}

	/**
	 * 에러 로깅
	 */
	static log(error: AppError, context?: string): void {
		const logObject = error.toLogObject()
		
		if (context) {
			logObject.context = context
		}

		// 개발 환경에서는 콘솔에 출력
		if (import.meta.env.DEV) {
			console.error('[AppError]', logObject)
		}

		// 프로덕션 환경에서는 에러 트래킹 서비스로 전송
		if (import.meta.env.PROD) {
			// TODO: Send to error tracking service (Sentry, DataDog, etc.)
			// this.sendToErrorTracking(logObject)
		}
	}

	/**
	 * 사용자에게 에러 표시
	 */
	static show(error: AppError): void {
		// Toast를 통한 에러 표시
		const { toast } = require('sonner')
		
		toast.error(error.getUserMessage(), {
			description: import.meta.env.DEV ? error.message : undefined,
		})
	}

	/**
	 * 에러 처리 (로깅 + 표시)
	 */
	static handle(error: unknown, context?: string, showToUser: boolean = true): AppError {
		const appError = this.normalize(error)
		this.log(appError, context)
		
		if (showToUser) {
			this.show(appError)
		}
		
		return appError
	}
}

/**
 * Error Boundary Props
 */
interface ErrorBoundaryProps {
	children: ReactNode
	fallback?: (error: AppError, reset: () => void) => ReactNode
	onError?: (error: AppError, errorInfo: ErrorInfo) => void
}

/**
 * Error Boundary State
 */
interface ErrorBoundaryState {
	error: AppError | null
	errorInfo: ErrorInfo | null
}

/**
 * React Error Boundary Component
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props)
		this.state = {
			error: null,
			errorInfo: null,
		}
	}

	static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
		return {
			error: ErrorHandler.normalize(error),
		}
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		const appError = ErrorHandler.normalize(error)
		
		this.setState({
			errorInfo,
		})

		// 에러 로깅
		ErrorHandler.log(appError, 'ErrorBoundary')

		// 커스텀 에러 핸들러 호출
		if (this.props.onError) {
			this.props.onError(appError, errorInfo)
		}
	}

	private handleReset = (): void => {
		this.setState({
			error: null,
			errorInfo: null,
		})
	}

	render(): ReactNode {
		const { error, errorInfo } = this.state
		const { children, fallback } = this.props

		if (error) {
			// 커스텀 fallback이 제공된 경우
			if (fallback) {
				return fallback(error, this.handleReset)
			}

			// 기본 에러 UI
			return (
				<div className="min-h-screen bg-background-dark text-neutral-100 flex items-center justify-center p-6">
					<div className="max-w-md w-full">
						<div className="bg-surface-dark border border-border-dark rounded-2xl p-8 text-center space-y-6">
							<div className="flex justify-center">
								<div className="p-4 bg-red-900/20 rounded-full">
									<AlertTriangle className="h-12 w-12 text-red-400" />
								</div>
							</div>
							
							<div className="space-y-2">
								<h1 className="text-2xl font-bold text-white">오류가 발생했습니다</h1>
								<p className="text-neutral-400">{error.getUserMessage()}</p>
							</div>

							{import.meta.env.DEV && error.message && (
								<div className="p-4 bg-neutral-900 rounded-lg text-left">
									<p className="text-xs text-red-400 font-mono">{error.message}</p>
									{errorInfo && (
										<details className="mt-2">
											<summary className="text-xs text-neutral-500 cursor-pointer">
												Stack trace
											</summary>
											<pre className="text-xs text-neutral-600 mt-2 overflow-auto max-h-40">
												{errorInfo.componentStack}
											</pre>
										</details>
									)}
								</div>
							)}

							<div className="flex gap-3">
								<Button
									variant="outline"
									onClick={() => window.location.href = '/'}
									className="flex-1"
								>
									<Home className="h-4 w-4 mr-2" />
									홈으로
								</Button>
								<Button
									variant="brand"
									onClick={this.handleReset}
									className="flex-1"
								>
									<RefreshCw className="h-4 w-4 mr-2" />
									다시 시도
								</Button>
							</div>
						</div>
					</div>
				</div>
			)
		}

		return children
	}
}

/**
 * useErrorHandler Hook
 */
export function useErrorHandler() {
	const [error, setError] = React.useState<AppError | null>(null)

	const handleError = React.useCallback((err: unknown, context?: string, showToUser: boolean = true) => {
		const appError = ErrorHandler.handle(err, context, showToUser)
		setError(appError)
		return appError
	}, [])

	const clearError = React.useCallback(() => {
		setError(null)
	}, [])

	return {
		error,
		handleError,
		clearError,
	}
}

