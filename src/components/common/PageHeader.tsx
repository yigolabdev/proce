/**
 * PageHeader Component - Enhanced
 * 
 * 모든 페이지에서 사용하는 통일된 헤더 디자인 시스템
 * 탭, 특수 컨텐츠 등을 지원하는 확장 가능한 헤더
 */

import { type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

export interface TabItem {
	id: string
	label: string
	icon?: LucideIcon
	count?: number | null
	onClick?: () => void
}

export interface TabsConfig {
	items: TabItem[]
	activeTab: string
	onTabChange: (tabId: string) => void
	/** 모바일에서 축약된 라벨 매핑 */
	mobileLabels?: Record<string, string>
}

export interface PageHeaderProps {
	/** 페이지 제목 */
	title: string
	/** 설명 텍스트 */
	description?: string | ReactNode
	/** 아이콘 */
	icon?: LucideIcon
	/** 아이콘 색상 클래스 */
	iconColor?: string
	/** 우측 액션 버튼들 */
	actions?: ReactNode
	/** 탭 메뉴 (선택적) */
	tabs?: TabsConfig
	/** 헤더 아래 추가 컨텐츠 (Progress bar, 필터 등) */
	children?: ReactNode
	/** sticky 헤더 여부 */
	sticky?: boolean
	/** 커스텀 className */
	className?: string
}

export function PageHeader({
	title,
	description,
	icon: Icon,
	iconColor = 'text-primary',
	actions,
	tabs,
	children,
	sticky = false,
	className = '',
}: PageHeaderProps) {
	return (
		<div 
			className={`${
				sticky ? 'sticky top-0 z-10 bg-neutral-50 dark:bg-neutral-950' : ''
			} ${className}`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
				{/* Title & Actions */}
				<div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${tabs || children ? 'mb-6' : ''}`}>
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2 sm:gap-3 mb-2">
							{Icon && <Icon className={`h-7 w-7 sm:h-8 sm:w-8 ${iconColor} shrink-0`} />}
							<h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-50">{title}</h1>
						</div>
						{description && (
							<p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
								{description}
							</p>
						)}
					</div>
					{actions && (
						<div className="flex items-center gap-2 flex-wrap shrink-0">
							{actions}
						</div>
					)}
				</div>

				{/* Tabs */}
				{tabs && (
					<div className="flex items-center gap-1 sm:gap-2 border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto pb-px">
						{tabs.items.map((tab) => {
							const TabIcon = tab.icon
							const isActive = tabs.activeTab === tab.id
							const mobileLabel = tabs.mobileLabels?.[tab.id]
							
							return (
								<button
									key={tab.id}
									onClick={() => {
										if (tab.onClick) {
											tab.onClick()
										} else {
											tabs.onTabChange(tab.id)
										}
									}}
									className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 text-sm font-medium transition-colors relative whitespace-nowrap ${
										isActive
											? 'text-primary'
											: 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
									}`}
								>
									{TabIcon && <TabIcon className="h-4 w-4 shrink-0" />}
									<span className="hidden sm:inline">{tab.label}</span>
									{mobileLabel && <span className="sm:hidden">{mobileLabel}</span>}
									{!mobileLabel && <span className="sm:hidden">{tab.label}</span>}
									{tab.count !== null && tab.count !== undefined && tab.count > 0 && (
										<span className="ml-1 px-1.5 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-semibold">
											{tab.count}
										</span>
									)}
									{isActive && (
										<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
									)}
								</button>
							)
						})}
					</div>
				)}

				{/* Additional Content */}
				{children && (
					<div className="mt-6">
						{children}
					</div>
				)}
			</div>
		</div>
	)
}
