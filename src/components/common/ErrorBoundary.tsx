import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '../ui/Button'

interface Props {
	children: ReactNode
	fallback?: ReactNode
}

interface State {
	hasError: boolean
	error: Error | null
	errorInfo: ErrorInfo | null
}

/**
 * Error Boundary Component
 * 
 * React 컴포넌트 트리에서 발생하는 JavaScript 에러를 포착하고,
 * 에러를 로그로 기록하며, 폴백 UI를 표시합니다.
 * 
 * @example
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = {
			hasError: false,
			error: null,
			errorInfo: null,
		}
	}

	static getDerivedStateFromError(error: Error): State {
		return {
			hasError: true,
			error,
			errorInfo: null,
		}
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		// 에러 로깅 서비스에 전송 (예: Sentry, LogRocket 등)
		console.error('Error Boundary caught an error:', error, errorInfo)
		
		this.setState({
			error,
			errorInfo,
		})
	}

	handleReset = () => {
		this.setState({
			hasError: false,
			error: null,
			errorInfo: null,
		})
	}

	render() {
		if (this.state.hasError) {
			// 커스텀 폴백 UI가 제공된 경우
			if (this.props.fallback) {
				return this.props.fallback
			}

			// 기본 에러 UI
			return (
				<div className="min-h-[60vh] flex items-center justify-center p-4">
					<div className="max-w-md w-full bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-8 text-center">
						<div className="mb-6 flex justify-center">
							<div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
								<AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
							</div>
						</div>

						<h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
							Something went wrong
						</h1>
						
						<p className="text-neutral-600 dark:text-neutral-400 mb-6">
							We're sorry for the inconvenience. An unexpected error has occurred.
						</p>

						{import.meta.env.DEV && this.state.error && (
							<div className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl text-left">
								<p className="text-sm font-mono text-red-600 dark:text-red-400 mb-2">
									{this.state.error.toString()}
								</p>
								{this.state.errorInfo && (
									<details className="mt-2">
										<summary className="text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer hover:underline">
											Stack trace
										</summary>
										<pre className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 overflow-auto max-h-40">
											{this.state.errorInfo.componentStack}
										</pre>
									</details>
								)}
							</div>
						)}

						<div className="flex flex-col sm:flex-row gap-3 justify-center">
							<Button onClick={this.handleReset} className="gap-2">
								<RefreshCw className="w-4 h-4" />
								Try Again
							</Button>
							<Button
								variant="outline"
								onClick={() => window.location.href = '/'}
							>
								Go Home
							</Button>
						</div>
					</div>
				</div>
			)
		}

		return this.props.children
	}
}

export default ErrorBoundary

