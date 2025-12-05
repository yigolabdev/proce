/**
 * PageContainer Component
 * 
 * 모든 페이지에서 사용하는 통일된 레이아웃 컨테이너
 */

import { type ReactNode } from 'react'
import clsx from 'clsx'

interface PageContainerProps {
	children: ReactNode
	/** 최대 너비 제한 */
	maxWidth?: 'default' | 'wide' | 'full'
	/** 패딩 제거 (특수한 경우) */
	noPadding?: boolean
	/** 커스텀 className */
	className?: string
}

export function PageContainer({
	children,
	maxWidth = 'default',
	noPadding = false,
	className,
}: PageContainerProps) {
	return (
		<div className={clsx(
			'min-h-screen bg-background-dark text-neutral-100',
			className
		)}>
			<div className={clsx(
				'mx-auto',
				{
					'max-w-[1600px]': maxWidth === 'default',
					'max-w-[1920px]': maxWidth === 'wide',
					'max-w-full': maxWidth === 'full',
					'px-6 py-6': !noPadding,
				}
			)}>
				{children}
			</div>
		</div>
	)
}

/**
 * PageSection Component
 * 
 * 페이지 내 섹션 구분
 */
interface PageSectionProps {
	children: ReactNode
	/** 섹션 간격 */
	spacing?: 'sm' | 'md' | 'lg'
	className?: string
}

export function PageSection({ 
	children, 
	spacing = 'md',
	className 
}: PageSectionProps) {
	return (
		<div className={clsx(
			{
				'space-y-4': spacing === 'sm',
				'space-y-6': spacing === 'md',
				'space-y-8': spacing === 'lg',
			},
			className
		)}>
			{children}
		</div>
	)
}

