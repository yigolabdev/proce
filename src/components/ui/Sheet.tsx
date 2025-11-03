import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';

interface SheetProps extends PropsWithChildren {
	open: boolean;
	onClose: () => void;
	title?: string;
	description?: string;
}

export function Sheet({ open, onClose, title, description, children }: SheetProps) {
	useEffect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [open]);

	if (!open) return null;

	return (
		<>
			{/* Backdrop */}
			<div
				className="fixed inset-0 bg-black/50 z-40 transition-opacity"
				onClick={onClose}
				aria-hidden="true"
			/>

			{/* Sheet */}
			<div
				className={clsx(
					'fixed right-0 top-0 bottom-0 w-full md:w-[600px] lg:w-[700px]',
					'bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-800',
					'z-50 overflow-y-auto',
					'transition-transform duration-300',
					open ? 'translate-x-0' : 'translate-x-full'
				)}
			>
				{/* Header */}
				<div className="sticky top-0 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 flex items-center justify-between">
					<div className="flex-1 min-w-0">
						{title && <h2 className="text-xl font-semibold">{title}</h2>}
						{description && (
							<p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">{description}</p>
						)}
					</div>
					<button
						onClick={onClose}
						className="ml-4 rounded-2xl p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900"
						aria-label="Close"
					>
						<X size={20} />
					</button>
				</div>

				{/* Content */}
				<div className="p-6">{children}</div>
			</div>
		</>
	);
}

export default Sheet;

