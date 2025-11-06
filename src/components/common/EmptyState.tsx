import React from 'react'

interface EmptyStateProps {
	icon?: React.ReactNode
	title: string
	description: string
	action?: React.ReactNode
	className?: string
}

export function EmptyState({ 
	icon, 
	title, 
	description, 
	action,
	className = '' 
}: EmptyStateProps) {
	return (
		<div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
			{icon && (
				<div className="text-neutral-400 dark:text-neutral-600 mb-4">
					{icon}
				</div>
			)}
			<h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
				{title}
			</h3>
			<p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 max-w-md">
				{description}
			</p>
			{action && (
				<div className="mt-2">
					{action}
				</div>
			)}
		</div>
	)
}

export default EmptyState

