/**
 * Badge Component
 * 
 * 상태, 태그 등을 표시하는 배지 컴포넌트
 */

import { cn } from '../../utils/cn'
import { X } from 'lucide-react'

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'outline'
type BadgeSize = 'sm' | 'md' | 'lg'

interface BadgeProps {
	children: React.ReactNode
	variant?: BadgeVariant
	size?: BadgeSize
	className?: string
	onRemove?: () => void
	icon?: React.ReactNode
}

const variantStyles: Record<BadgeVariant, string> = {
	default: 'bg-neutral-700/50 text-neutral-300 border-neutral-600',
	primary: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
	success: 'bg-green-500/20 text-green-400 border-green-500/30',
	warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
	danger: 'bg-red-500/20 text-red-400 border-red-500/30',
	info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
	outline: 'bg-transparent text-neutral-300 border-neutral-600'
}

const sizeStyles: Record<BadgeSize, string> = {
	sm: 'text-xs px-2 py-0.5',
	md: 'text-sm px-2.5 py-1',
	lg: 'text-base px-3 py-1.5'
}

export function Badge({
	children,
	variant = 'default',
	size = 'sm',
	className,
	onRemove,
	icon
}: BadgeProps) {
	return (
		<span
			className={cn(
				'inline-flex items-center gap-1 font-medium rounded-full border',
				'transition-colors duration-200',
				variantStyles[variant],
				sizeStyles[size],
				className
			)}
		>
			{icon && <span className="flex-shrink-0">{icon}</span>}
			{children}
			{onRemove && (
				<button
					onClick={(e) => {
						e.stopPropagation()
						onRemove()
					}}
					className="flex-shrink-0 ml-1 hover:bg-white/10 rounded-full p-0.5 transition-colors"
					aria-label="Remove badge"
				>
					<X className="w-3 h-3" />
				</button>
			)}
		</span>
	)
}

/**
 * Status Badge with predefined status colors
 */
interface StatusBadgeProps {
	status: 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled' | 'draft' | 'planning' | 'on-hold'
	size?: BadgeSize
	className?: string
}

export function StatusBadge({ status, size = 'sm', className }: StatusBadgeProps) {
	const statusConfig: Record<typeof status, { label: string; variant: BadgeVariant }> = {
		active: { label: 'Active', variant: 'success' },
		inactive: { label: 'Inactive', variant: 'default' },
		pending: { label: 'Pending', variant: 'warning' },
		completed: { label: 'Completed', variant: 'success' },
		cancelled: { label: 'Cancelled', variant: 'danger' },
		draft: { label: 'Draft', variant: 'default' },
		planning: { label: 'Planning', variant: 'info' },
		'on-hold': { label: 'On Hold', variant: 'warning' }
	}

	const config = statusConfig[status]

	return (
		<Badge variant={config.variant} size={size} className={className}>
			{config.label}
		</Badge>
	)
}

/**
 * Priority Badge
 */
interface PriorityBadgeProps {
	priority: 'low' | 'medium' | 'high' | 'urgent'
	size?: BadgeSize
	className?: string
}

export function PriorityBadge({ priority, size = 'sm', className }: PriorityBadgeProps) {
	const priorityConfig: Record<typeof priority, { label: string; variant: BadgeVariant }> = {
		low: { label: 'Low', variant: 'default' },
		medium: { label: 'Medium', variant: 'info' },
		high: { label: 'High', variant: 'warning' },
		urgent: { label: 'Urgent', variant: 'danger' }
	}

	const config = priorityConfig[priority]

	return (
		<Badge variant={config.variant} size={size} className={className}>
			{config.label}
		</Badge>
	)
}

