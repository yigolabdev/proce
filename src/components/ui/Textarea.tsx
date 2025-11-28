import type { TextareaHTMLAttributes } from 'react'
import clsx from 'clsx'

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string
	error?: string
}

export default function Textarea({ className, label, error, id, ...props }: Props) {
	const inputId = id || props.name || 'textarea-' + Math.random().toString(36).slice(2, 8)
	return (
		<div className={clsx('w-full', className)}>
			{label && (
				<label htmlFor={inputId} className="mb-1 block text-sm text-neutral-700 dark:text-neutral-300">
					{label}
				</label>
			)}
			<textarea
				id={inputId}
				className={clsx(
					'w-full rounded-2xl border bg-white dark:bg-neutral-900 px-4 py-2.5 outline-none ring-primary/30 transition focus:ring-4',
					{
						'border-neutral-300 dark:border-border-dark': !error,
						'border-red-500': Boolean(error),
					},
				)}
				rows={props.rows ?? 5}
				{...props}
			/>
			{error && (
				<p role="alert" className="mt-1 text-sm text-red-600">
					{error}
				</p>
			)}
		</div>
	)
}
