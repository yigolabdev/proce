import { Card, CardContent, CardHeader } from '../ui/Card'
import { Button } from '../ui/Button'
import { FolderOpen, X } from 'lucide-react'
import type { WorkDraft } from '../../types/common.types'

interface DraftsDialogProps {
	isOpen: boolean
	onClose: () => void
	drafts: WorkDraft[]
	onLoad: (draft: WorkDraft) => void
	onDelete: (id: string) => void
}

export function DraftsDialog({ isOpen, onClose, drafts, onLoad, onDelete }: DraftsDialogProps) {
	if (!isOpen) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
			<Card className="w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col bg-surface-dark border-border-dark">
				<CardHeader className="border-b border-border-dark">
					<div className="flex items-center justify-between">
						<h3 className="text-xl font-bold flex items-center gap-2 text-white">
							<FolderOpen className="h-6 w-6 text-orange-500" />
							Saved Drafts
						</h3>
						<button
							onClick={onClose}
							className="text-neutral-500 hover:text-white"
						>
							<X className="h-6 w-6" />
						</button>
					</div>
				</CardHeader>
				<CardContent className="p-6 overflow-y-auto flex-1">
					{drafts.length === 0 ? (
						<div className="text-center py-12">
							<FolderOpen className="h-16 w-16 text-neutral-800 mx-auto mb-4" />
							<h3 className="text-lg font-bold mb-2 text-white">No Drafts Yet</h3>
							<p className="text-sm text-neutral-500">
								Drafts will be automatically saved as you type
							</p>
						</div>
					) : (
						<div className="space-y-3">
							{drafts.map((draft) => (
								<div
									key={draft.id}
									className="p-4 border border-border-dark rounded-2xl hover:border-orange-500/50 transition-colors bg-neutral-900"
								>
									<div className="flex items-start justify-between gap-4 mb-2">
										<div className="flex-1 min-w-0">
											<h4 className="font-semibold text-sm truncate text-white">{draft.title}</h4>
											<p className="text-xs text-neutral-500 mt-1">
												Saved: {new Date(draft.savedAt).toLocaleString()}
											</p>
										</div>
										<div className="flex items-center gap-2 shrink-0">
											<Button
												variant="outline"
												size="sm"
												onClick={() => onLoad(draft)}
											>
												Load
											</Button>
											<Button
												variant="outline"
												size="sm"
												onClick={() => onDelete(draft.id)}
												className="text-red-500 hover:text-red-400 border-red-900/30 hover:bg-red-900/10"
											>
												<X className="h-4 w-4" />
											</Button>
										</div>
									</div>
									{draft.description && (
										<p className="text-xs text-neutral-400 line-clamp-2">
											{draft.description}
										</p>
									)}
									{draft.tags && draft.tags.length > 0 && (
										<div className="flex flex-wrap gap-1 mt-2">
											{draft.tags.slice(0, 3).map((tag) => (
												<span
													key={tag}
													className="px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded text-xs border border-neutral-700"
												>
													{tag}
												</span>
											))}
											{draft.tags.length > 3 && (
												<span className="px-2 py-0.5 text-neutral-500 text-xs">
													+{draft.tags.length - 3} more
												</span>
											)}
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}

