/**
 * FilterBar Component
 * 
 * 재사용 가능한 필터 바 컴포넌트
 */

import { type ReactNode } from 'react'
import { Button } from '../ui/Button'
import { Filter, X } from 'lucide-react'
import clsx from 'clsx'

export interface FilterOption {
	id: string
	label: string
	count?: number
	icon?: ReactNode
}

interface FilterBarProps {
	/** 필터 옵션들 */
	options: FilterOption[]
	/** 현재 선택된 필터 */
	selectedFilter: string
	/** 필터 변경 핸들러 */
	onFilterChange: (filterId: string) => void
	/** 필터 타입 (스타일 변형) */
	variant?: 'tabs' | 'buttons' | 'pills'
	/** 추가 액션 버튼들 */
	actions?: ReactNode
	/** 필터 접기/펼치기 가능 여부 */
	collapsible?: boolean
	/** 초기 접힌 상태 */
	defaultCollapsed?: boolean
	/** 커스텀 className */
	className?: string
}

export function FilterBar({
	options,
	selectedFilter,
	onFilterChange,
	variant = 'tabs',
	actions,
	collapsible = false,
	defaultCollapsed = false,
	className,
}: FilterBarProps) {
	const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)

	if (variant === 'tabs') {
		return (
			<div className={clsx(
				'flex items-center justify-between gap-4 border-b border-border-dark pb-px',
				className
			)}>
				<div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
					{options.map((option) => {
						const isActive = selectedFilter === option.id
						return (
							<button
								key={option.id}
								onClick={() => onFilterChange(option.id)}
								className={clsx(
									'flex items-center gap-2 pb-3 px-1 text-sm font-medium transition-all relative whitespace-nowrap',
									isActive
										? 'text-white'
										: 'text-neutral-500 hover:text-neutral-300'
								)}
							>
								{option.icon}
								<span>{option.label}</span>
								{option.count !== undefined && option.count > 0 && (
									<span className={clsx(
										'ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold',
										isActive
											? 'bg-orange-500/10 text-orange-500'
											: 'bg-neutral-800 text-neutral-500'
									)}>
										{option.count}
									</span>
								)}
								{isActive && (
									<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
								)}
							</button>
						)
					})}
				</div>
				{actions && (
					<div className="flex items-center gap-2 shrink-0">
						{actions}
					</div>
				)}
			</div>
		)
	}

	if (variant === 'buttons') {
		return (
			<div className={clsx(
				'flex flex-wrap items-center gap-2',
				className
			)}>
				{options.map((option) => {
					const isActive = selectedFilter === option.id
					return (
						<Button
							key={option.id}
							onClick={() => onFilterChange(option.id)}
							variant={isActive ? 'primary' : 'outline'}
							size="sm"
							className={clsx(
								'gap-2',
								isActive && 'ring-1 ring-white/20'
							)}
						>
							{option.icon}
							<span>{option.label}</span>
							{option.count !== undefined && option.count > 0 && (
								<span className={clsx(
									'px-1.5 py-0.5 rounded-full text-[10px] font-bold',
									isActive ? 'bg-black/20' : 'bg-neutral-700'
								)}>
									{option.count}
								</span>
							)}
						</Button>
					)
				})}
				{actions && (
					<div className="ml-auto flex items-center gap-2">
						{actions}
					</div>
				)}
			</div>
		)
	}

	// Pills variant
	return (
		<div className={clsx('space-y-3', className)}>
			{collapsible && (
				<div className="flex items-center justify-between">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setIsCollapsed(!isCollapsed)}
						className="gap-2"
					>
						<Filter className="h-4 w-4" />
						<span>Filters</span>
						{isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
					</Button>
					{selectedFilter !== 'all' && (
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onFilterChange('all')}
							className="gap-1"
						>
							<X className="h-3 w-3" />
							Clear
						</Button>
					)}
				</div>
			)}
			{(!collapsible || !isCollapsed) && (
				<div className="flex flex-wrap items-center gap-2">
					{options.map((option) => {
						const isActive = selectedFilter === option.id
						return (
							<button
								key={option.id}
								onClick={() => onFilterChange(option.id)}
								className={clsx(
									'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
									isActive
										? 'bg-orange-500 text-white shadow-sm'
										: 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
								)}
							>
								{option.icon}
								<span>{option.label}</span>
								{option.count !== undefined && option.count > 0 && (
									<span className={clsx(
										'px-1.5 py-0.5 rounded-full text-[10px] font-bold',
										isActive ? 'bg-white/20' : 'bg-neutral-700'
									)}>
										{option.count}
									</span>
								)}
							</button>
						)
					})}
					{actions && (
						<div className="ml-auto flex items-center gap-2">
							{actions}
						</div>
					)}
				</div>
			)}
		</div>
	)
}

import React from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

