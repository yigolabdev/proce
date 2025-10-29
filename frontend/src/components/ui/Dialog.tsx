import * as DialogPrimitive from '@radix-ui/react-dialog'
import type { PropsWithChildren } from 'react'
import clsx from 'clsx'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close

export function DialogContent({ className, children }: PropsWithChildren<{ className?: string }>) {
	return (
		<DialogPrimitive.Portal>
			<DialogPrimitive.Overlay className="fixed inset-0 bg-black/40" />
			<DialogPrimitive.Content
				className={clsx(
					'fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-lg focus:outline-none',
					className,
				)}
			>
				{children}
			</DialogPrimitive.Content>
		</DialogPrimitive.Portal>
	)
}
