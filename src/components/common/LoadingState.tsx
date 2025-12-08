import { Card, CardContent, CardHeader } from '../ui/Card'

interface LoadingStateProps {
	type?: 'page' | 'card' | 'list' | 'table'
	count?: number
	className?: string
}

export function LoadingState({ type = 'page', count = 3, className = '' }: LoadingStateProps) {
	if (type === 'page') {
		return (
			<div className={`space-y-4 animate-pulse ${className}`}>
				{/* Header skeleton */}
				<div className="h-8 bg-neutral-800 rounded w-1/4" />
				<div className="h-4 bg-neutral-800 rounded w-1/3" />
				
				{/* Content skeletons */}
				{Array.from({ length: count }).map((_, i) => (
					<div key={i} className="h-32 bg-neutral-800 rounded" />
				))}
			</div>
		)
	}

	if (type === 'card') {
		return (
			<div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
				{Array.from({ length: count }).map((_, i) => (
					<Card key={i} className="animate-pulse">
						<CardHeader>
							<div className="h-6 bg-neutral-800 rounded w-3/4" />
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<div className="h-4 bg-neutral-800 rounded" />
								<div className="h-4 bg-neutral-800 rounded w-5/6" />
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		)
	}

	if (type === 'list') {
		return (
			<div className={`space-y-3 ${className}`}>
				{Array.from({ length: count }).map((_, i) => (
					<div key={i} className="animate-pulse flex items-center space-x-4 p-4 rounded-lg bg-neutral-900">
						<div className="h-12 w-12 bg-neutral-800 rounded-full" />
						<div className="flex-1 space-y-2">
							<div className="h-4 bg-neutral-800 rounded w-3/4" />
							<div className="h-3 bg-neutral-800 rounded w-1/2" />
						</div>
					</div>
				))}
			</div>
		)
	}

	if (type === 'table') {
		return (
			<div className={`space-y-2 ${className}`}>
				{/* Table header */}
				<div className="animate-pulse grid grid-cols-4 gap-4 p-4 bg-neutral-900 rounded">
					<div className="h-4 bg-neutral-800 rounded" />
					<div className="h-4 bg-neutral-800 rounded" />
					<div className="h-4 bg-neutral-800 rounded" />
					<div className="h-4 bg-neutral-800 rounded" />
				</div>
				
				{/* Table rows */}
				{Array.from({ length: count }).map((_, i) => (
					<div key={i} className="animate-pulse grid grid-cols-4 gap-4 p-4 rounded">
						<div className="h-3 bg-neutral-800 rounded" />
						<div className="h-3 bg-neutral-800 rounded" />
						<div className="h-3 bg-neutral-800 rounded" />
						<div className="h-3 bg-neutral-800 rounded" />
					</div>
				))}
			</div>
		)
	}

	return null
}

export default LoadingState

