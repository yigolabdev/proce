import type { PropsWithChildren, HTMLAttributes } from 'react'
import clsx from 'clsx'

interface CardProps extends PropsWithChildren<{ className?: string }>, Omit<HTMLAttributes<HTMLDivElement>, 'className'> {}

export function Card({ className, children, ...props }: CardProps) {
	return <div className={clsx('rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm', className)} {...props}>{children}</div>
}

export function CardHeader({ className, children }: PropsWithChildren<{ className?: string }>) {
	return <div className={clsx('px-6 pt-6', className)}>{children}</div>
}

export function CardTitle({ className, children }: PropsWithChildren<{ className?: string }>) {
	return <h3 className={clsx('text-xl font-semibold tracking-tight', className)}>{children}</h3>
}

export function CardDescription({ className, children }: PropsWithChildren<{ className?: string }>) {
	return <p className={clsx('text-neutral-600 dark:text-neutral-300 mt-1', className)}>{children}</p>
}

export function CardContent({ className, children }: PropsWithChildren<{ className?: string }>) {
	return <div className={clsx('px-6 pb-6', className)}>{children}</div>
}
