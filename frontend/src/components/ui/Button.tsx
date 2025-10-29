import type { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'outline'
	size?: 'sm' | 'md' | 'lg'
}

export function Button({ className, variant = 'primary', size = 'md', ...props }: ButtonProps) {
	return (
		<button
			className={clsx(
				'rounded-2xl font-medium transition-shadow disabled:opacity-50 disabled:cursor-not-allowed',
				{
					'bg-primary text-white shadow-sm hover:shadow-md': variant === 'primary',
					'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700': variant === 'secondary',
					'border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-900':
						variant === 'outline',
					'px-3 py-1.5 text-xs': size === 'sm',
					'px-5 py-2.5 text-sm': size === 'md',
					'px-6 py-3 text-base': size === 'lg',
				},
				className,
			)}
			{...props}
		/>
	)
}

export default Button
