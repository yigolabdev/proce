/**
 * InfoCard Component
 * 
 * 정보를 표시하는 간단한 카드 컴포넌트
 */

import { type ReactNode } from 'react'
import { Card, CardContent } from '../ui/Card'
import clsx from 'clsx'
import type { LucideIcon } from 'lucide-react'

interface InfoCardProps {
	/** 제목 */
	title?: string
	/** 설명/내용 */
	children: ReactNode
	/** 아이콘 */
	icon?: LucideIcon
	/** 아이콘 색상 */
	iconColor?: string
	/** 배경 강조 */
	variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
	/** 크기 */
	size?: 'sm' | 'md' | 'lg'
	/** 클릭 가능 여부 */
	clickable?: boolean
	/** 클릭 핸들러 */
	onClick?: () => void
	/** 커스텀 className */
	className?: string
}

export function InfoCard({
	title,
	children,
	icon: Icon,
	iconColor,
	variant = 'default',
	size = 'md',
	clickable = false,
	onClick,
	className,
}: InfoCardProps) {
	const variantStyles = {
		default: 'bg-surface-dark border-border-dark',
		primary: 'bg-orange-500/10 border-orange-500/20',
		success: 'bg-green-500/10 border-green-500/20',
		warning: 'bg-amber-500/10 border-amber-500/20',
		danger: 'bg-red-500/10 border-red-500/20',
		info: 'bg-blue-500/10 border-blue-500/20',
	}

	const defaultIconColors = {
		default: 'text-neutral-400',
		primary: 'text-orange-500',
		success: 'text-green-500',
		warning: 'text-amber-500',
		danger: 'text-red-500',
		info: 'text-blue-500',
	}

	const padding = {
		sm: 'p-3',
		md: 'p-4',
		lg: 'p-6',
	}

	return (
		<Card
			className={clsx(
				variantStyles[variant],
				clickable && 'cursor-pointer hover:shadow-lg transition-all',
				className
			)}
			onClick={clickable ? onClick : undefined}
		>
			<CardContent className={padding[size]}>
				<div className="flex items-start gap-3">
					{Icon && (
						<div className={clsx(
							'shrink-0',
							iconColor || defaultIconColors[variant]
						)}>
							<Icon className={clsx({
								'h-4 w-4': size === 'sm',
								'h-5 w-5': size === 'md',
								'h-6 w-6': size === 'lg',
							})} />
						</div>
					)}
					<div className="flex-1 min-w-0">
						{title && (
							<h3 className="text-sm font-semibold text-white mb-1">
								{title}
							</h3>
						)}
						<div className="text-sm text-neutral-300">
							{children}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

