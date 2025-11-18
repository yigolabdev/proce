/**
 * Error Boundary Component
 * 
 * Catches React errors and displays a fallback UI.
 */

import { Component, type ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '../ui/Button'

interface ErrorBoundaryProps {
	children: ReactNode
	fallback?: ReactNode
}

interface ErrorBoundaryState {
	hasError: boolean
	error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props)
		this.state = {
			hasError: false,
			error: null,
		}
	}
	
	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return {
			hasError: true,
			error,
		}
	}
	
	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		// Log error in development mode
		if (import.meta.env.DEV) {
			console.error('Error caught by boundary:', error, errorInfo)
		}
		// TODO: Send to error tracking service in production
	}
	
	handleReset = () => {
		this.setState({
			hasError: false,
			error: null,
		})
	}
	
	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback
			}
			
			return (
				<div className="min-h-screen flex items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-950">
					<div className="max-w-md w-full bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-8 text-center">
						<AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
						<h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
						<p className="text-neutral-600 dark:text-neutral-400 mb-6">
							{this.state.error?.message || 'An unexpected error occurred'}
						</p>
						<div className="flex gap-3 justify-center">
							<Button onClick={this.handleReset} variant="primary">
								Try Again
							</Button>
							<Button onClick={() => window.location.href = '/'} variant="outline">
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
