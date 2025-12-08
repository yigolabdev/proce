import { Card, CardContent } from '../../../../components/ui/Card'
import { Button } from '../../../../components/ui/Button'
import Input from '../../../../components/ui/Input'
import Textarea from '../../../../components/ui/Textarea'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import type { WorkTemplate, WorkCategory } from '../_types/types'

interface TemplatesTabProps {
	templates: WorkTemplate[]
	categories: WorkCategory[]
	editingTemplate: WorkTemplate | null
	showAddTemplate: boolean
	newTemplate: Omit<WorkTemplate, 'id'>
	onSetEditingTemplate: (template: WorkTemplate | null) => void
	onSetShowAddTemplate: (show: boolean) => void
	onSetNewTemplate: (template: Omit<WorkTemplate, 'id'>) => void
	onAdd: () => void
	onUpdate: () => void
	onDelete: (id: string) => void
}

export default function TemplatesTab({
	templates,
	categories,
	editingTemplate,
	showAddTemplate,
	newTemplate,
	onSetEditingTemplate,
	onSetShowAddTemplate,
	onSetNewTemplate,
	onAdd,
	onUpdate,
	onDelete,
}: TemplatesTabProps) {
	return (
		<>
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<p className="text-sm text-neutral-400">
						Manage work entry templates for quick input
					</p>
					<Button onClick={() => onSetShowAddTemplate(true)}>
						<Plus className="h-4 w-4 mr-2" />
						Add Template
					</Button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{templates.map((template) => (
						<Card key={template.id}>
							<CardContent className="p-4">
								{editingTemplate?.id === template.id ? (
									<div className="space-y-3">
										<Input
											value={editingTemplate.title}
											onChange={(e) =>
												onSetEditingTemplate({ ...editingTemplate, title: e.target.value })
											}
											placeholder="Template title"
										/>
										<Textarea
											value={editingTemplate.description}
											onChange={(e) =>
												onSetEditingTemplate({
													...editingTemplate,
													description: e.target.value,
												})
											}
											placeholder="Template content"
											rows={6}
										/>
										<select
											value={editingTemplate.category}
											onChange={(e) =>
												onSetEditingTemplate({ ...editingTemplate, category: e.target.value })
											}
											className="w-full px-3 py-2 border border-neutral-700 rounded-xl bg-neutral-900"
										>
											<option value="">Select category</option>
											{categories.map((cat) => (
												<option key={cat.id} value={cat.id}>
													{cat.name}
												</option>
											))}
										</select>
										<div className="flex items-center gap-2">
											<Button onClick={onUpdate} size="sm" className="flex-1">
												<Save className="h-4 w-4 mr-1" />
												Save
											</Button>
											<Button
												onClick={() => onSetEditingTemplate(null)}
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
											<h3 className="font-bold text-lg">{template.title}</h3>
											<div className="flex items-center gap-1">
												<button
													onClick={() => onSetEditingTemplate(template)}
													className="p-1 hover:hover:bg-neutral-800 rounded"
												>
													<Edit2 className="h-4 w-4 text-neutral-600" />
												</button>
												<button
													onClick={() => onDelete(template.id)}
													className="p-1 hover:hover:bg-neutral-800 rounded"
												>
													<Trash2 className="h-4 w-4 text-red-500" />
												</button>
											</div>
										</div>
										<p className="text-sm text-neutral-400 whitespace-pre-wrap mb-3">
											{template.description}
										</p>
										{template.category && (
											<span className="inline-block text-xs px-2 py-1 rounded-full bg-neutral-800">
												{categories.find((c) => c.id === template.category)?.name ||
													template.category}
											</span>
										)}
									</>
								)}
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			{/* Add Template Dialog */}
			{showAddTemplate && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
					<div className="bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-800 w-full max-w-2xl">
						<div className="p-6">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-xl font-bold flex items-center gap-2">
									<Plus className="h-5 w-5 text-primary" />
									Add Template
								</h3>
								<button
									onClick={() => onSetShowAddTemplate(false)}
									className="text-neutral-500 hover:hover:text-neutral-300"
								>
									<X className="h-5 w-5" />
								</button>
							</div>

							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium mb-2">
										Title <span className="text-red-500">*</span>
									</label>
									<Input
										value={newTemplate.title}
										onChange={(e) => onSetNewTemplate({ ...newTemplate, title: e.target.value })}
										placeholder="e.g., Daily Standup"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium mb-2">
										Content <span className="text-red-500">*</span>
									</label>
									<Textarea
										value={newTemplate.description}
										onChange={(e) =>
											onSetNewTemplate({ ...newTemplate, description: e.target.value })
										}
										placeholder="Template content with placeholders..."
										rows={8}
									/>
								</div>

								<div>
									<label className="block text-sm font-medium mb-2">Category</label>
									<select
										value={newTemplate.category}
										onChange={(e) => onSetNewTemplate({ ...newTemplate, category: e.target.value })}
										className="w-full px-4 py-2 border border-neutral-700 rounded-2xl bg-neutral-900"
									>
										<option value="">Select category</option>
										{categories.map((cat) => (
											<option key={cat.id} value={cat.id}>
												{cat.name}
											</option>
										))}
									</select>
								</div>

								<div className="flex items-center gap-2 pt-4">
									<Button onClick={onAdd} className="flex-1">
										Add Template
									</Button>
									<Button
										variant="outline"
										onClick={() => onSetShowAddTemplate(false)}
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

