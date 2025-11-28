/**
 * Select Component
 * 
 * 기본 select 드롭다운 컴포넌트
 */

import React from 'react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
	children: React.ReactNode
	className?: string
}

export function Select({ children, className = '', ...props }: SelectProps) {
	return (
		<select
			className={`
				w-full px-3 py-2 
				bg-white dark:bg-neutral-900 
				border border-neutral-300 dark:border-border-dark 
				rounded-lg 
				text-sm 
				text-neutral-900 dark:text-neutral-100
				focus:outline-none 
				focus:ring-2 
				focus:ring-primary 
				focus:border-transparent
				transition-colors
				${className}
			`}
			{...props}
		>
			{children}
		</select>
	)
}

