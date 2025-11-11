import { Card, CardContent } from '../../../../components/ui/Card'
import { Button } from '../../../../components/ui/Button'
import Input from '../../../../components/ui/Input'
import Textarea from '../../../../components/ui/Textarea'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import type { WorkCategory } from '../_types/types'
import { COLOR_OPTIONS } from '../_types/types'

interface CategoriesTabProps {
	categories: WorkCategory[]
	editingCategory: WorkCategory | null
	showAddCategory: boolean
	newCategory: Omit<WorkCategory, 'id'>
	onSetEditingCategory: (category: WorkCategory | null) => void
	onSetShowAddCategory: (show: boolean) => void
	onSetNewCategory: (category: Omit<WorkCategory, 'id'>) => void
	onAdd: () => void
	onUpdate: () => void
	onDelete: (id: string) => void
}

export default function CategoriesTab({
	categories,
	editingCategory,
	showAddCategory,
	newCategory,
	onSetEditingCategory,
	onSetShowAddCategory,
	onSetNewCategory,
	onAdd,
	onUpdate,
	onDelete,
}: CategoriesTabProps) {
	return (
		<>
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<p className="text-sm text-neutral-600 dark:text-neutral-400">
						Manage work status used in Work Input
					</p>
					<Button onClick={() => onSetShowAddCategory(true)}>
						<Plus className="h-4 w-4 mr-2" />
						Add Status
					</Button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{categories.map((category) => (
						<Card key={category.id}>
							<CardContent className="p-4">
								{editingCategory?.id === category.id ? (
									<div className="space-y-3">
									<Input
										value={editingCategory.name}
										onChange={(e) =>
											onSetEditingCategory({ ...editingCategory, name: e.target.value })
										}
										placeholder="Status name"
									/>
										<Textarea
											value={editingCategory.description}
											onChange={(e) =>
												onSetEditingCategory({
													...editingCategory,
													description: e.target.value,
												})
											}
											placeholder="Description"
											rows={2}
										/>
										<div className="flex items-center gap-2">
											<span className="text-sm">Color:</span>
											<select
												value={editingCategory.color}
												onChange={(e) =>
													onSetEditingCategory({ ...editingCategory, color: e.target.value })
												}
												className="flex-1 px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900"
											>
												{COLOR_OPTIONS.map((opt) => (
													<option key={opt.value} value={opt.value}>
														{opt.label}
													</option>
												))}
											</select>
										</div>
										<div className="flex items-center gap-2">
											<Button onClick={onUpdate} size="sm" className="flex-1">
												<Save className="h-4 w-4 mr-1" />
												Save
											</Button>
											<Button
												onClick={() => onSetEditingCategory(null)}
												variant="outline"
												size="sm"
												className="flex-1"
											>
												Cancel
											</Button>
										</div>
									</div>
								) : (
									<>
										<div className="flex items-start justify-between mb-3">
											<div className="flex items-center gap-2">
												<div
													className="w-4 h-4 rounded-full"
													style={{ backgroundColor: category.color }}
												/>
												<h3 className="font-bold">{category.name}</h3>
											</div>
											<div className="flex items-center gap-1">
												<button
													onClick={() => onSetEditingCategory(category)}
													className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
												>
													<Edit2 className="h-4 w-4 text-neutral-600" />
												</button>
												<button
													onClick={() => onDelete(category.id)}
													className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
												>
													<Trash2 className="h-4 w-4 text-red-500" />
												</button>
											</div>
										</div>
										<p className="text-sm text-neutral-600 dark:text-neutral-400">
											{category.description}
										</p>
									</>
								)}
							</CardContent>
						</Card>
					))}
				</div>
			</div>

		{/* Add Status Dialog */}
		{showAddCategory && (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
				<div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-md">
					<div className="p-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-xl font-bold flex items-center gap-2">
								<Plus className="h-5 w-5 text-primary" />
								Add Status
							</h3>
								<button
									onClick={() => onSetShowAddCategory(false)}
									className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
								>
									<X className="h-5 w-5" />
								</button>
							</div>

							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium mb-2">
										Name <span className="text-red-500">*</span>
									</label>
								<Input
									value={newCategory.name}
									onChange={(e) => onSetNewCategory({ ...newCategory, name: e.target.value })}
									placeholder="e.g., Completed Work"
								/>
								</div>

								<div>
									<label className="block text-sm font-medium mb-2">Description</label>
									<Textarea
										value={newCategory.description}
										onChange={(e) =>
											onSetNewCategory({ ...newCategory, description: e.target.value })
										}
										placeholder="Brief description of this status"
										rows={3}
									/>
								</div>

								<div>
									<label className="block text-sm font-medium mb-2">Color</label>
									<select
										value={newCategory.color}
										onChange={(e) => onSetNewCategory({ ...newCategory, color: e.target.value })}
										className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900"
									>
										{COLOR_OPTIONS.map((opt) => (
											<option key={opt.value} value={opt.value}>
												{opt.label}
											</option>
										))}
									</select>
								</div>

							<div className="flex items-center gap-2 pt-4">
								<Button onClick={onAdd} className="flex-1">
									Add Status
								</Button>
								<Button
									variant="outline"
									onClick={() => onSetShowAddCategory(false)}
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

