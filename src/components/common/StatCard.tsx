/**
 * StatCard Component
 * 
 * 통계 정보를 표시하는 재사용 가능한 카드 컴포넌트
 */

import { type ReactNode } from 'react'
import { Card, CardContent } from '../ui/Card'
import type { LucideIcon } from 'lucide-react'

export interface StatCardProps {
	/** 카드 제목 */
	title: string
	/** 주요 값 */
	value: string | number
	/** 설명 텍스트 */
	description?: string
	/** 아이콘 */
	icon?: LucideIcon
	/** 아이콘 색상 클래스 */
	iconColor?: string
	/** 배경 색상 클래스 */
	bgColor?: string
	/** 변화율 (예: +12.5) */
	change?: number
	/** 변화율 레이블 */
	changeLabel?: string
	/** 추가 액션 */
	action?: ReactNode
	/** 클릭 핸들러 */
	onClick?: () => void
	/** 커스텀 className */
	className?: string
	/** 로딩 상태 */
	loading?: boolean
}

export function StatCard({
	title,
	value,
	description,
	icon: Icon,
	iconColor = 'text-primary',
	bgColor,
	change,
	changeLabel,
	action,
	onClick,
	className = '',
	loading = false,
}: StatCardProps) {
	const isPositiveChange = change !== undefined && change >= 0
	const changeColor = isPositiveChange ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'

	return (
		<Card
			className={`
				${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}
				${bgColor || ''}
				${className}
			`}
			onClick={onClick}
		>
			<CardContent className="p-4 sm:p-6">
				{loading ? (
					<div className="space-y-3">
						<div className="h-4 w-20 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
						<div className="h-8 w-16 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
						<div className="h-3 w-24 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
					</div>
				) : (
					<>
						{/* Header */}
						<div className="flex items-start justify-between mb-3">
							<div className="flex items-center gap-2">
								{Icon && (
									<div className={`p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg ${iconColor}`}>
						<Icon className="h-4 w-4 sm:h-5 sm:w-5" />
									</div>
								)}
								<p className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400">
									{title}
								</p>
							</div>
							{action && <div className="shrink-0">{action}</div>}
						</div>

						{/* Value */}
						<div className="mb-2">
							<p className="text-2xl sm:text-3xl font-bold">
								{value}
							</p>
						</div>

						{/* Description & Change */}
						<div className="flex items-center justify-between flex-wrap gap-2">
							{description && (
								<p className="text-xs text-neutral-600 dark:text-neutral-400">
									{description}
								</p>
							)}
							{change !== undefined && (
								<div className="flex items-center gap-1">
									<span className={`text-xs font-medium ${changeColor}`}>
										{isPositiveChange ? '+' : ''}{change}%
									</span>
									{changeLabel && (
										<span className="text-xs text-neutral-500 dark:text-neutral-400">
											{changeLabel}
										</span>
									)}
								</div>
							)}
						</div>
					</>
				)}
			</CardContent>
		</Card>
	)
}

/**
 * StatCard 그리드 컨테이너
 */
interface StatCardGridProps {
	children: ReactNode
	cols?: 1 | 2 | 3 | 4 | 5 | 6
	className?: string
}

export function StatCardGrid({ children, cols = 4, className = '' }: StatCardGridProps) {
	const gridCols = {
		1: 'grid-cols-1',
		2: 'grid-cols-1 md:grid-cols-2',
		3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
		4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
		5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
		6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
	}

	return (
		<div className={`grid ${gridCols[cols]} gap-4 ${className}`}>
			{children}
		</div>
	)
}

