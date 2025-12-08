/**
 * PageHeader Component - Enhanced
 * 
 * 모든 페이지에서 사용하는 통일된 헤더 디자인 시스템
 * Dashboard 페이지와 동일한 스타일 가이드 적용
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
	iconColor = 'text-white',
	actions,
	tabs,
	children,
	sticky = false,
	className = '',
}: PageHeaderProps) {
	return (
		<div className={`${sticky ? 'sticky top-0 z-10 bg-background-dark pt-4 pb-4 border-b border-border-dark' : ''} ${className}`}>
				{/* Title & Actions */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div className="flex items-center gap-3 min-w-0">
					{/* Icon is optional */}
					{Icon && (
						<div className="p-2 rounded-xl bg-surface-dark border border-border-dark shrink-0">
							<Icon className={`h-6 w-6 ${iconColor}`} />
						</div>
					)}
					<div className="min-w-0">
						<h1 className="text-3xl font-bold tracking-tight text-neutral-100 truncate">
							{title}
						</h1>
						{description && (
							<div className="text-sm text-neutral-400 mt-1 truncate">
								{description}
							</div>
						)}
					</div>
				</div>
				
					{actions && (
					<div className="flex items-center gap-3 shrink-0">
							{actions}
						</div>
					)}
				</div>

				{/* Tabs */}
				{tabs && (
				<div className="mt-8 border-b border-border-dark overflow-x-auto pb-px no-scrollbar">
					<div className="flex items-center gap-6">
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
									className={`flex items-center gap-2 pb-3 text-sm font-medium transition-all relative whitespace-nowrap ${
										isActive
											? 'text-white'
											: 'text-neutral-500 hover:hover:text-neutral-300'
									}`}
								>
									{TabIcon && <TabIcon className={`h-4 w-4 ${isActive ? 'text-orange-500' : 'text-neutral-500'}`} />}
									<span className="hidden sm:inline">{tab.label}</span>
									{mobileLabel && <span className="sm:hidden">{mobileLabel}</span>}
									{!mobileLabel && <span className="sm:hidden">{tab.label}</span>}
									{tab.count !== null && tab.count !== undefined && tab.count > 0 && (
										<span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
											isActive 
												? 'bg-orange-500/10 text-orange-500' 
												: 'bg-surface-elevated text-neutral-500'
										}`}>
											{tab.count}
										</span>
									)}
									{isActive && (
										<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
									)}
								</button>
							)
						})}
					</div>
					</div>
				)}

				{/* Additional Content */}
				{children && (
					<div className="mt-6">
						{children}
					</div>
				)}
		</div>
	)
}
