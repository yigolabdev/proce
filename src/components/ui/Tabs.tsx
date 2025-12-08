/**
 * Tabs Component - Design System
 * 통일된 탭 디자인 시스템
 */

import React from 'react'
import type { LucideIcon } from 'lucide-react'

/**
 * 탭 아이템 인터페이스
 */
export interface TabItem {
	id: string
	label: string
	icon?: LucideIcon
	count?: number
	disabled?: boolean
	badge?: string | number
}

/**
 * 탭 스타일 variants
 */
export type TabVariant = 'default' | 'pills' | 'underline' | 'contained'

/**
 * Tabs Props
 */
export interface TabsProps {
	items: TabItem[]
	activeTab: string
	onTabChange: (tabId: string) => void
	variant?: TabVariant
	className?: string
	fullWidth?: boolean
	size?: 'sm' | 'md' | 'lg'
}

/**
 * Tabs Component
 */
export const Tabs: React.FC<TabsProps> = ({
	items,
	activeTab,
	onTabChange,
	variant = 'underline',
	className = '',
	fullWidth = false,
	size = 'md',
}) => {
	const sizeClasses = {
		sm: 'px-3 py-2 text-xs',
		md: 'px-4 py-3 text-sm',
		lg: 'px-6 py-4 text-base',
	}

	const getTabClasses = (item: TabItem, isActive: boolean) => {
		const baseClasses = `font-medium transition-all duration-200 flex items-center gap-2 ${sizeClasses[size]}`
		const widthClass = fullWidth ? 'flex-1 justify-center' : ''
		const disabledClass = item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'

		switch (variant) {
			case 'pills':
				return `${baseClasses} ${widthClass} ${disabledClass} rounded-full ${
					isActive
						? 'bg-orange-500 text-white shadow-sm'
						: 'bg-transparent text-neutral-400 hover:text-white hover:bg-white/5'
				}`

			case 'contained':
				return `${baseClasses} ${widthClass} ${disabledClass} rounded-lg ${
					isActive
						? 'bg-surface-elevated text-white border border-border-dark'
						: 'bg-transparent text-neutral-400 hover:text-white hover:bg-surface-elevated/50'
				}`

			case 'default':
				return `${baseClasses} ${widthClass} ${disabledClass} rounded-lg ${
					isActive
						? 'bg-white/10 text-white'
						: 'bg-transparent text-neutral-400 hover:text-white hover:bg-white/5'
				}`

			case 'underline':
			default:
				return `${baseClasses} ${widthClass} ${disabledClass} relative ${
					isActive
						? 'text-white'
						: 'text-neutral-400 hover:text-white'
				}`
		}
	}

	const getContainerClasses = () => {
		const baseClasses = 'flex items-center gap-1'
		
		switch (variant) {
			case 'pills':
			case 'contained':
			case 'default':
				return `${baseClasses} p-1 bg-surface-dark rounded-xl border border-border-dark`
			
			case 'underline':
			default:
				return `${baseClasses} border-b border-border-dark overflow-x-auto scrollbar-hide`
		}
	}

	return (
		<div className={`${getContainerClasses()} ${className}`}>
			{items.map((item) => {
				const isActive = activeTab === item.id
				const Icon = item.icon

				return (
					<button
						key={item.id}
						onClick={() => !item.disabled && onTabChange(item.id)}
						className={getTabClasses(item, isActive)}
						disabled={item.disabled}
						type="button"
					>
						{/* Icon */}
						{Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
						
						{/* Label */}
						<span className="whitespace-nowrap">{item.label}</span>
						
						{/* Badge/Count */}
						{(item.count !== undefined || item.badge !== undefined) && (
							<span
								className={`px-2 py-0.5 text-xs rounded-full ${
									isActive
										? variant === 'pills'
											? 'bg-white/20 text-white'
											: 'bg-neutral-800 text-neutral-300'
										: 'bg-neutral-800 text-neutral-500'
								}`}
							>
								{item.badge || item.count}
							</span>
						)}

						{/* Underline indicator */}
						{variant === 'underline' && isActive && (
							<span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
						)}

						{/* Border indicator for default variant */}
						{variant === 'default' && isActive && (
							<span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-500 rounded-r" />
						)}
					</button>
				)
			})}
		</div>
	)
}

/**
 * TabPanel Component (탭 콘텐츠 래퍼)
 */
interface TabPanelProps {
	id: string
	activeTab: string
	children: React.ReactNode
	className?: string
	unmountOnHide?: boolean // true면 숨김 시 DOM에서 제거
}

export const TabPanel: React.FC<TabPanelProps> = ({
	id,
	activeTab,
	children,
	className = '',
	unmountOnHide = false,
}) => {
	const isActive = id === activeTab

	if (unmountOnHide && !isActive) {
		return null
	}

	return (
		<div
			role="tabpanel"
			aria-hidden={!isActive}
			className={`${isActive ? 'block' : 'hidden'} ${className}`}
		>
			{children}
		</div>
	)
}

/**
 * TabGroup Component (Tabs + TabPanels 통합)
 */
interface TabGroupProps {
	items: TabItem[]
	activeTab: string
	onTabChange: (tabId: string) => void
	variant?: TabVariant
	size?: 'sm' | 'md' | 'lg'
	fullWidth?: boolean
	children: React.ReactNode
	className?: string
	contentClassName?: string
}

export const TabGroup: React.FC<TabGroupProps> = ({
	items,
	activeTab,
	onTabChange,
	variant = 'underline',
	size = 'md',
	fullWidth = false,
	children,
	className = '',
	contentClassName = '',
}) => {
	return (
		<div className={className}>
			<Tabs
				items={items}
				activeTab={activeTab}
				onTabChange={onTabChange}
				variant={variant}
				size={size}
				fullWidth={fullWidth}
			/>
			<div className={`mt-6 ${contentClassName}`}>
				{children}
			</div>
		</div>
	)
}

