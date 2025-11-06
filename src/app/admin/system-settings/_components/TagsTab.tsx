import { Card, CardContent } from '../../../../components/ui/Card'
import { Button } from '../../../../components/ui/Button'
import Input from '../../../../components/ui/Input'
import { Plus, X } from 'lucide-react'
import type { WorkTag } from '../_types/types'

interface TagsTabProps {
	tags: WorkTag[]
	showAddTag: boolean
	newTag: Omit<WorkTag, 'id'>
	onSetShowAddTag: (show: boolean) => void
	onSetNewTag: (tag: Omit<WorkTag, 'id'>) => void
	onAdd: () => void
	onDelete: (id: string) => void
}

export default function TagsTab({
	tags,
	showAddTag,
	newTag,
	onSetShowAddTag,
	onSetNewTag,
	onAdd,
	onDelete,
}: TagsTabProps) {
	return (
		<>
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<p className="text-sm text-neutral-600 dark:text-neutral-400">
						Manage predefined tags for quick selection
					</p>
					<Button onClick={() => onSetShowAddTag(true)}>
						<Plus className="h-4 w-4 mr-2" />
						Add Tag
					</Button>
				</div>

				<Card>
					<CardContent className="p-6">
						<div className="flex flex-wrap gap-2">
							{tags.map((tag) => (
								<div
									key={tag.id}
									className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
								>
									<span className="text-sm font-medium">{tag.name}</span>
									{tag.category && (
										<span className="text-xs text-neutral-500">({tag.category})</span>
									)}
									<button onClick={() => onDelete(tag.id)} className="hover:text-red-500">
										<X className="h-3 w-3" />
									</button>
								</div>
							))}
							{tags.length === 0 && (
								<p className="text-sm text-neutral-600 dark:text-neutral-400">
									No tags yet. Add your first tag!
								</p>
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Add Tag Dialog */}
			{showAddTag && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
					<div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-md">
						<div className="p-6">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-xl font-bold flex items-center gap-2">
									<Plus className="h-5 w-5 text-primary" />
									Add Tag
								</h3>
								<button
									onClick={() => onSetShowAddTag(false)}
									className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
								>
									<X className="h-5 w-5" />
								</button>
							</div>

							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium mb-2">
										Tag Name <span className="text-red-500">*</span>
									</label>
									<Input
										value={newTag.name}
										onChange={(e) => onSetNewTag({ ...newTag, name: e.target.value })}
										placeholder="e.g., urgent, bug-fix"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium mb-2">Category (Optional)</label>
									<Input
										value={newTag.category}
										onChange={(e) => onSetNewTag({ ...newTag, category: e.target.value })}
										placeholder="e.g., priority, type, tech"
									/>
								</div>

								<div className="flex items-center gap-2 pt-4">
									<Button onClick={onAdd} className="flex-1">
										Add Tag
									</Button>
									<Button
										variant="outline"
										onClick={() => onSetShowAddTag(false)}
										className="flex-1"
									>
										Cancel
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	)
}

