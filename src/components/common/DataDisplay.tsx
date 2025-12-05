/**
 * DataGrid Component
 * 
 * 데이터를 그리드 형태로 표시하는 공통 컴포넌트
 */

import { type ReactNode } from 'react'
import clsx from 'clsx'

interface DataGridProps {
	/** 그리드 아이템들 */
	children: ReactNode
	/** 컬럼 수 (반응형) */
	cols?: {
		default?: 1 | 2 | 3 | 4 | 5 | 6
		sm?: 1 | 2 | 3 | 4 | 5 | 6
		md?: 1 | 2 | 3 | 4 | 5 | 6
		lg?: 1 | 2 | 3 | 4 | 5 | 6
		xl?: 1 | 2 | 3 | 4 | 5 | 6
	}
	/** 간격 크기 */
	gap?: 'sm' | 'md' | 'lg'
	/** 커스텀 className */
	className?: string
}

export function DataGrid({
	children,
	cols = { default: 1, md: 2, lg: 3 },
	gap = 'md',
	className,
}: DataGridProps) {
	const colClasses = {
		1: 'grid-cols-1',
		2: 'grid-cols-2',
		3: 'grid-cols-3',
		4: 'grid-cols-4',
		5: 'grid-cols-5',
		6: 'grid-cols-6',
	}

	const gapClasses = {
		sm: 'gap-3',
		md: 'gap-4',
		lg: 'gap-6',
	}

	return (
		<div className={clsx(
			'grid',
			cols.default && colClasses[cols.default],
			cols.sm && `sm:${colClasses[cols.sm]}`,
			cols.md && `md:${colClasses[cols.md]}`,
			cols.lg && `lg:${colClasses[cols.lg]}`,
			cols.xl && `xl:${colClasses[cols.xl]}`,
			gapClasses[gap],
			className
		)}>
			{children}
		</div>
	)
}

/**
 * DataList Component
 * 
 * 데이터를 리스트 형태로 표시하는 공통 컴포넌트
 */
interface DataListProps {
	children: ReactNode
	/** 구분선 표시 */
	divided?: boolean
	/** 간격 크기 */
	spacing?: 'sm' | 'md' | 'lg'
	/** 커스텀 className */
	className?: string
}

export function DataList({
	children,
	divided = false,
	spacing = 'md',
	className,
}: DataListProps) {
	const spacingClasses = {
		sm: 'space-y-2',
		md: 'space-y-3',
		lg: 'space-y-4',
	}

	return (
		<div className={clsx(
			divided ? 'divide-y divide-border-dark' : spacingClasses[spacing],
			className
		)}>
			{children}
		</div>
	)
}

/**
 * DataListItem Component
 * 
 * DataList의 개별 아이템
 */
interface DataListItemProps {
	children: ReactNode
	/** 호버 효과 */
	hoverable?: boolean
	/** 클릭 가능 여부 */
	clickable?: boolean
	/** 클릭 핸들러 */
	onClick?: () => void
	/** 커스텀 className */
	className?: string
}

export function DataListItem({
	children,
	hoverable = false,
	clickable = false,
	onClick,
	className,
}: DataListItemProps) {
	return (
		<div
			className={clsx(
				'py-3',
				(hoverable || clickable) && 'hover:bg-neutral-800/30 rounded-lg px-3 -mx-3 transition-colors',
				clickable && 'cursor-pointer',
				className
			)}
			onClick={clickable ? onClick : undefined}
		>
			{children}
		</div>
	)
}

