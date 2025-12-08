import clsx from 'clsx'
import type { PropsWithChildren } from 'react'

export function Separator({ children, className }: PropsWithChildren<{ className?: string }>) {
	return (
		<div className={clsx('flex items-center gap-3', className)}>
			<div className="h-px w-full bg-neutral-800" />
			{children ? <span className="text-xs text-neutral-500">{children}</span> : null}
			<div className="h-px w-full bg-neutral-800" />
		</div>
	)
}

export default Separator
