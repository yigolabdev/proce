/**
 * Error Boundary Component
 * 
 * React 컴포넌트 트리에서 발생하는 에러를 캐치하고 fallback UI를 표시
 */

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '../ui/Button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface Props {
	children: ReactNode
	fallback?: ReactNode
	onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
	hasError: boolean
	error: Error | null
	errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = {
			hasError: false,
			error: null,
			errorInfo: null
		}
	}

	static getDerivedStateFromError(error: Error): Partial<State> {
		return {
			hasError: true,
			error
		}
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		// 에러 로깅 (프로덕션에서는 Sentry 등으로 전송)
		console.error('ErrorBoundary caught an error:', error, errorInfo)
		
		this.setState({
			error,
			errorInfo
		})

		// 커스텀 에러 핸들러 호출
		if (this.props.onError) {
			this.props.onError(error, errorInfo)
		}
	}

	handleReset = () => {
		this.setState({
			hasError: false,
			error: null,
			errorInfo: null
		})
	}

	handleGoHome = () => {
		window.location.href = '/app/dashboard'
	}

	render() {
		if (this.state.hasError) {
			// 커스텀 fallback이 제공된 경우
			if (this.props.fallback) {
				return this.props.fallback
			}

			// 기본 에러 UI
			return (
				<div className="min-h-screen bg-background-dark flex items-center justify-center p-4">
					<div className="max-w-md w-full">
						<div className="bg-surface-dark border border-border-dark rounded-xl p-8 text-center">
							{/* 에러 아이콘 */}
							<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
								<AlertTriangle className="w-8 h-8 text-red-500" />
							</div>

							{/* 에러 메시지 */}
							<h2 className="text-2xl font-bold text-white mb-2">
								Something went wrong
							</h2>
							<p className="text-neutral-400 mb-6">
								We're sorry for the inconvenience. The error has been logged and we'll look into it.
							</p>

							{/* 개발 환경에서만 에러 상세 정보 표시 */}
							{process.env.NODE_ENV === 'development' && this.state.error && (
								<div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-left">
									<p className="text-sm font-mono text-red-400 mb-2">
										{this.state.error.toString()}
									</p>
									{this.state.errorInfo && (
										<details className="text-xs text-neutral-500">
											<summary className="cursor-pointer hover:text-neutral-400">
												Stack trace
											</summary>
											<pre className="mt-2 overflow-auto max-h-40">
												{this.state.errorInfo.componentStack}
											</pre>
										</details>
									)}
								</div>
							)}

							{/* 액션 버튼 */}
							<div className="flex gap-3">
								<Button
									onClick={this.handleReset}
									variant="outline"
									className="flex-1"
								>
									<RefreshCw className="w-4 h-4 mr-2" />
									Try Again
								</Button>
								<Button
									onClick={this.handleGoHome}
									variant="primary"
									className="flex-1"
								>
									<Home className="w-4 h-4 mr-2" />
									Go Home
								</Button>
							</div>
						</div>
					</div>
				</div>
			)
		}

		return this.props.children
	}
}

/**
 * 함수형 컴포넌트를 위한 에러 바운더리 HOC
 */
export function withErrorBoundary<P extends object>(
	Component: React.ComponentType<P>,
	fallback?: ReactNode
) {
	return function WithErrorBoundaryComponent(props: P) {
		return (
			<ErrorBoundary fallback={fallback}>
				<Component {...props} />
			</ErrorBoundary>
		)
	}
}
