/**
 * SectionHeader Component
 * 
 * 섹션 제목과 액션을 표시하는 공통 컴포넌트
 */

import { type ReactNode } from 'react'
import clsx from 'clsx'
import type { LucideIcon } from 'lucide-react'

interface SectionHeaderProps {
	/** 제목 */
	title: string
	/** 설명 */
	description?: string
	/** 아이콘 */
	icon?: LucideIcon
	/** 아이콘 색상 */
	iconColor?: string
	/** 우측 액션들 */
	actions?: ReactNode
	/** 크기 */
	size?: 'sm' | 'md' | 'lg'
	/** 하단 구분선 */
	divider?: boolean
	/** 커스텀 className */
	className?: string
}

export function SectionHeader({
	title,
	description,
	icon: Icon,
	iconColor = 'text-orange-500',
	actions,
	size = 'md',
	divider = false,
	className,
}: SectionHeaderProps) {
	return (
		<div className={clsx(
			'flex items-center justify-between gap-4',
			divider && 'pb-4 border-b border-border-dark',
			className
		)}>
			<div className="flex items-center gap-3 min-w-0">
				{Icon && (
					<Icon className={clsx(
						iconColor,
						{
							'h-4 w-4': size === 'sm',
							'h-5 w-5': size === 'md',
							'h-6 w-6': size === 'lg',
						}
					)} />
				)}
				<div className="min-w-0">
					<h2 className={clsx(
						'font-semibold text-white truncate',
						{
							'text-base': size === 'sm',
							'text-lg': size === 'md',
							'text-xl': size === 'lg',
						}
					)}>
						{title}
					</h2>
					{description && (
						<p className="text-sm text-neutral-400 mt-0.5 truncate">
							{description}
						</p>
					)}
				</div>
			</div>
			{actions && (
				<div className="flex items-center gap-2 shrink-0">
					{actions}
				</div>
			)}
		</div>
	)
}

