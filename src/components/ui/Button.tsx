import type { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'brand'
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon'
	isLoading?: boolean
}

export function Button({ 
	className, 
	variant = 'primary', 
	size = 'md', 
	isLoading = false, 
	children, 
	disabled, 
	...props 
}: ButtonProps) {
	return (
		<button
			disabled={disabled || isLoading}
			className={clsx(
				'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
				{
					// Variants
					// Primary: High contrast white on dark
					'bg-white text-black hover:bg-neutral-200 border border-transparent shadow-sm': variant === 'primary',
					
					// Secondary: Dark grey background
					'bg-neutral-800 text-white hover:bg-neutral-700 border border-transparent': variant === 'secondary',
					
					// Outline: Border only, transparent bg
					'bg-transparent text-neutral-200 border border-border-dark hover:bg-border-dark hover:text-white': variant === 'outline',
					
					// Ghost: No background, text change on hover
					'bg-transparent text-neutral-400 hover:text-white hover:bg-neutral-800/50': variant === 'ghost',
					
					// Danger: Red theme
					'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20': variant === 'danger',
					
					// Brand: Orange theme
					'bg-orange-500 text-white hover:bg-orange-600 shadow-sm shadow-orange-500/20': variant === 'brand',
					
					// Sizes
					'h-7 px-2.5 text-[11px] rounded-lg': size === 'xs',
					'h-8 px-3 text-xs': size === 'sm',
					'h-10 px-4 py-2 text-sm': size === 'md',
					'h-12 px-6 text-base': size === 'lg',
					'h-9 w-9 p-0': size === 'icon',
				},
				className,
			)}
			{...props}
		>
			{isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
			{children}
		</button>
	)
}

export default Button
