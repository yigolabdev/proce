import { cn } from '../../lib/utils'
import { CheckCircle2, Clock, AlertCircle, XCircle, Loader2, Pause } from 'lucide-react'

export type BadgeVariant = 
	| 'success' 
	| 'warning' 
	| 'error' 
	| 'info' 
	| 'pending'
	| 'default'

export type BadgeSize = 'sm' | 'md' | 'lg'

interface StatusBadgeProps {
	variant?: BadgeVariant
	size?: BadgeSize
	icon?: boolean
	children: React.ReactNode
	className?: string
}

/**
 * Status Badge Component
 * 
 * 상태를 시각적으로 표시하는 배지 컴포넌트
 * 
 * @example
 * <StatusBadge variant="success">Complete</StatusBadge>
 * <StatusBadge variant="warning" icon>In Progress</StatusBadge>
 */
export function StatusBadge({
	variant = 'default',
	size = 'md',
	icon = false,
	children,
	className,
}: StatusBadgeProps) {
	const variantStyles = {
		success: 'bg-green-100 bg-green-900/text-green-400',
		warning: 'bg-yellow-100 bg-yellow-900/text-yellow-400',
		error: 'bg-red-100 bg-red-900/text-red-400',
		info: 'bg-blue-100 bg-blue-900/text-blue-400',
		pending: 'bg-neutral-100 bg-neutral-800 dark:text-neutral-400',
		default: 'bg-neutral-100 bg-neutral-800 dark:text-neutral-300',
	}

	const sizeStyles = {
		sm: 'text-xs px-2 py-0.5 gap-1',
		md: 'text-sm px-2.5 py-1 gap-1.5',
		lg: 'text-base px-3 py-1.5 gap-2',
	}

	const iconSizes = {
		sm: 12,
		md: 14,
		lg: 16,
	}

	const icons = {
		success: CheckCircle2,
		warning: AlertCircle,
		error: XCircle,
		info: Clock,
		pending: Loader2,
		default: Pause,
	}

	const Icon = icons[variant]

	return (
		<span
			className={cn(
				'inline-flex items-center rounded-full font-medium',
				variantStyles[variant],
				sizeStyles[size],
				className
			)}
		>
			{icon && <Icon size={iconSizes[size]} className={variant === 'pending' ? 'animate-spin' : ''} />}
			{children}
		</span>
	)
}

/**
 * Work Status Badge
 * 업무 상태를 표시하는 특화된 배지
 */
interface WorkStatusBadgeProps {
	status: string
	size?: BadgeSize
	className?: string
}

export function WorkStatusBadge({ status, size = 'md', className }: WorkStatusBadgeProps) {
	const statusMap: Record<string, { variant: BadgeVariant; label: string }> = {
		pending: { variant: 'pending', label: 'Pending' },
		'in-progress': { variant: 'info', label: 'In Progress' },
		'in-review': { variant: 'warning', label: 'In Review' },
		completed: { variant: 'success', label: 'Completed' },
		blocked: { variant: 'error', label: 'Blocked' },
		cancelled: { variant: 'default', label: 'Cancelled' },
	}

	const config = statusMap[status.toLowerCase()] || { variant: 'default' as BadgeVariant, label: status }

	return (
		<StatusBadge variant={config.variant} size={size} icon className={className}>
			{config.label}
		</StatusBadge>
	)
}

/**
 * Priority Badge
 * 우선순위를 표시하는 특화된 배지
 */
interface PriorityBadgeProps {
	priority: 'high' | 'medium' | 'low'
	size?: BadgeSize
	className?: string
}

export function PriorityBadge({ priority, size = 'md', className }: PriorityBadgeProps) {
	const priorityMap = {
		high: { variant: 'error' as BadgeVariant, label: 'High' },
		medium: { variant: 'warning' as BadgeVariant, label: 'Medium' },
		low: { variant: 'info' as BadgeVariant, label: 'Low' },
	}

	const config = priorityMap[priority]

	return (
		<StatusBadge variant={config.variant} size={size} className={className}>
			{config.label}
		</StatusBadge>
	)
}

export default StatusBadge

