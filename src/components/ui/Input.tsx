import type { InputHTMLAttributes } from 'react'
import clsx from 'clsx'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
	label?: string
	error?: string
}

export const Input = function Input({ className, label, error, id, ...props }: Props) {
	const inputId = id || props.name || 'input-' + Math.random().toString(36).slice(2, 8)
	return (
		<div className={clsx('w-full', className)}>
			{label && (
				<label htmlFor={inputId} className="mb-1 block text-sm text-neutral-300">
					{label}
				</label>
			)}
			<input
				id={inputId}
				className={clsx(
					'w-full rounded-2xl border bg-neutral-900 px-4 py-2.5 outline-none ring-primary/30 transition focus:ring-4',
					{
						'border-border-dark': !error,
						'border-red-500': Boolean(error),
					},
				)}
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

export default Input
