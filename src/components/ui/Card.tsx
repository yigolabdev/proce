import type { PropsWithChildren, HTMLAttributes } from 'react'
import clsx from 'clsx'

interface CardProps extends PropsWithChildren<{ className?: string }>, Omit<HTMLAttributes<HTMLDivElement>, 'className'> {}

export function Card({ className, children, ...props }: CardProps) {
	return (
		<div 
			className={clsx(
				'rounded-3xl border border-neutral-200 dark:border-border-dark bg-white dark:bg-surface-dark shadow-sm transition-all', 
				className
			)} 
			{...props}
		>
			{children}
		</div>
	)
}

export function CardHeader({ className, children }: PropsWithChildren<{ className?: string }>) {
	return <div className={clsx('px-6 pt-6 flex flex-col gap-1', className)}>{children}</div>
}

export function CardTitle({ className, children }: PropsWithChildren<{ className?: string }>) {
	return <h3 className={clsx('text-lg font-semibold tracking-tight text-neutral-900 dark:text-white', className)}>{children}</h3>
}

export function CardDescription({ className, children }: PropsWithChildren<{ className?: string }>) {
	return <p className={clsx('text-sm text-neutral-500 dark:text-neutral-400', className)}>{children}</p>
}

export function CardContent({ className, children }: PropsWithChildren<{ className?: string }>) {
	return <div className={clsx('p-6 pt-4', className)}>{children}</div>
}
