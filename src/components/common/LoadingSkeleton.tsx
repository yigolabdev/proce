import { cn } from '../../lib/utils'

interface SkeletonProps {
	className?: string
	variant?: 'text' | 'circular' | 'rectangular'
	animation?: 'pulse' | 'wave' | 'none'
}

/**
 * Skeleton Component
 * 
 * 콘텐츠 로딩 중 표시되는 스켈레톤 UI
 * 
 * @example
 * <Skeleton className="h-4 w-[250px]" />
 * <Skeleton variant="circular" className="h-12 w-12" />
 */
export function Skeleton({
	className,
	variant = 'rectangular',
	animation = 'pulse',
	...props
}: SkeletonProps & React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				'bg-neutral-800',
				animation === 'pulse' && 'animate-pulse',
				animation === 'wave' && 'animate-shimmer',
				variant === 'text' && 'rounded h-4',
				variant === 'circular' && 'rounded-full',
				variant === 'rectangular' && 'rounded-lg',
				className
			)}
			{...props}
		/>
	)
}

/**
 * Card Skeleton
 * 카드 형태의 로딩 스켈레톤
 */
export function CardSkeleton() {
	return (
		<div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
			<div className="flex items-center gap-4 mb-4">
				<Skeleton variant="circular" className="h-12 w-12" />
				<div className="flex-1">
					<Skeleton className="h-4 w-[200px] mb-2" />
					<Skeleton className="h-3 w-[150px]" />
				</div>
			</div>
			<Skeleton className="h-3 w-full mb-2" />
			<Skeleton className="h-3 w-[80%]" />
		</div>
	)
}

/**
 * Table Skeleton
 * 테이블 형태의 로딩 스켈레톤
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
	return (
		<div className="space-y-3">
			{/* Header */}
			<div className="flex gap-4 p-4 bg-neutral-900 rounded-lg">
				<Skeleton className="h-4 w-[150px]" />
				<Skeleton className="h-4 w-[200px]" />
				<Skeleton className="h-4 w-[100px]" />
				<Skeleton className="h-4 w-[120px]" />
			</div>

			{/* Rows */}
			{Array.from({ length: rows }).map((_, i) => (
				<div key={i} className="flex gap-4 p-4 bg-neutral-900 rounded-lg border border-neutral-800">
					<Skeleton className="h-4 w-[150px]" />
					<Skeleton className="h-4 w-[200px]" />
					<Skeleton className="h-4 w-[100px]" />
					<Skeleton className="h-4 w-[120px]" />
				</div>
			))}
		</div>
	)
}

/**
 * List Skeleton
 * 리스트 형태의 로딩 스켈레톤
 */
export function ListSkeleton({ items = 5 }: { items?: number }) {
	return (
		<div className="space-y-3">
			{Array.from({ length: items }).map((_, i) => (
				<div key={i} className="flex items-center gap-4 p-4 bg-neutral-900 rounded-xl border border-neutral-800">
					<Skeleton variant="circular" className="h-10 w-10" />
					<div className="flex-1">
						<Skeleton className="h-4 w-[60%] mb-2" />
						<Skeleton className="h-3 w-[40%]" />
					</div>
					<Skeleton className="h-8 w-20" />
				</div>
			))}
		</div>
	)
}

/**
 * Page Skeleton
 * 전체 페이지 로딩 스켈레톤
 */
export function PageSkeleton() {
	return (
		<div className="space-y-6 p-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<Skeleton className="h-8 w-[300px] mb-2" />
					<Skeleton className="h-4 w-[200px]" />
				</div>
				<Skeleton className="h-10 w-[120px]" />
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{Array.from({ length: 3 }).map((_, i) => (
					<CardSkeleton key={i} />
				))}
			</div>

			{/* Content */}
			<div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6">
				<Skeleton className="h-6 w-[200px] mb-4" />
				<TableSkeleton rows={6} />
			</div>
		</div>
	)
}

export default Skeleton

