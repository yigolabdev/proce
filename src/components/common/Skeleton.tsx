/**
 * Skeleton Component
 * 
 * 로딩 상태를 나타내는 스켈레톤 UI
 */

import { cn } from '../../utils/cn'

interface SkeletonProps {
	className?: string
	variant?: 'text' | 'circular' | 'rectangular'
	width?: string | number
	height?: string | number
	count?: number
}

export function Skeleton({
	className,
	variant = 'rectangular',
	width,
	height,
	count = 1
}: SkeletonProps) {
	const baseClass = cn(
		'animate-pulse bg-neutral-700/50',
		{
			'rounded-full': variant === 'circular',
			'rounded': variant === 'rectangular',
			'rounded-md h-4': variant === 'text'
		},
		className
	)

	const style = {
		width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
		height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined
	}

	if (count > 1) {
		return (
			<div className="space-y-2">
				{Array.from({ length: count }).map((_, i) => (
					<div key={i} className={baseClass} style={style} />
				))}
			</div>
		)
	}

	return <div className={baseClass} style={style} />
}

/**
 * 카드 스켈레톤
 */
export function CardSkeleton({ className }: { className?: string }) {
	return (
		<div className={cn('bg-surface-dark border border-border-dark rounded-xl p-6', className)}>
			<div className="flex items-start justify-between mb-4">
				<Skeleton variant="text" width="60%" />
				<Skeleton variant="circular" width={32} height={32} />
			</div>
			<Skeleton variant="text" count={3} />
			<div className="flex gap-2 mt-4">
				<Skeleton width={60} height={24} className="rounded-full" />
				<Skeleton width={80} height={24} className="rounded-full" />
			</div>
		</div>
	)
}

/**
 * 테이블 스켈레톤
 */
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
	return (
		<div className="space-y-3">
			{/* Header */}
			<div className="flex gap-4 pb-3 border-b border-border-dark">
				{Array.from({ length: columns }).map((_, i) => (
					<Skeleton key={i} width="100%" height={20} />
				))}
			</div>
			
			{/* Rows */}
			{Array.from({ length: rows }).map((_, rowIndex) => (
				<div key={rowIndex} className="flex gap-4 py-3">
					{Array.from({ length: columns }).map((_, colIndex) => (
						<Skeleton key={colIndex} width="100%" height={16} />
					))}
				</div>
			))}
		</div>
	)
}

/**
 * 리스트 스켈레톤
 */
export function ListSkeleton({ count = 5 }: { count?: number }) {
	return (
		<div className="space-y-4">
			{Array.from({ length: count }).map((_, i) => (
				<div key={i} className="flex items-center gap-4">
					<Skeleton variant="circular" width={48} height={48} />
					<div className="flex-1 space-y-2">
						<Skeleton variant="text" width="40%" />
						<Skeleton variant="text" width="80%" />
					</div>
				</div>
			))}
		</div>
	)
}

