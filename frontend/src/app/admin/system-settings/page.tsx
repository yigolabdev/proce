import { useState, useEffect } from 'react'
import { Card, CardContent } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Textarea from '../../../components/ui/Textarea'
import {
	Settings,
	Plus,
	X,
	Edit2,
	Trash2,
	Save,
	Tag,
	Folder,
	FileText,
} from 'lucide-react'
import { toast } from 'sonner'
import Toaster from '../../../components/ui/Toaster'

interface WorkCategory {
	id: string
	name: string
	color: string
	description: string
}

interface WorkTag {
	id: string
	name: string
	category: string
}

interface WorkTemplate {
	id: string
	title: string
	description: string
	category: string
}

export default function SystemSettingsPage() {
	const [activeTab, setActiveTab] = useState<'categories' | 'tags' | 'templates'>('categories')

	// Categories
	const [categories, setCategories] = useState<WorkCategory[]>([])
	const [showAddCategory, setShowAddCategory] = useState(false)
	const [editingCategory, setEditingCategory] = useState<WorkCategory | null>(null)
	const [newCategory, setNewCategory] = useState<Omit<WorkCategory, 'id'>>({
		name: '',
		color: '#3B82F6',
		description: '',
	})

	// Tags
	const [tags, setTags] = useState<WorkTag[]>([])
	const [showAddTag, setShowAddTag] = useState(false)
	const [newTag, setNewTag] = useState<Omit<WorkTag, 'id'>>({
		name: '',
		category: '',
	})

	// Templates
	const [templates, setTemplates] = useState<WorkTemplate[]>([])
	const [showAddTemplate, setShowAddTemplate] = useState(false)
	const [editingTemplate, setEditingTemplate] = useState<WorkTemplate | null>(null)
	const [newTemplate, setNewTemplate] = useState<Omit<WorkTemplate, 'id'>>({
		title: '',
		description: '',
		category: '',
	})

	// Color options
	const colorOptions = [
		{ value: '#3B82F6', label: 'Blue' },
		{ value: '#8B5CF6', label: 'Purple' },
		{ value: '#10B981', label: 'Green' },
		{ value: '#F59E0B', label: 'Orange' },
		{ value: '#EF4444', label: 'Red' },
		{ value: '#EC4899', label: 'Pink' },
		{ value: '#6B7280', label: 'Gray' },
	]

	// Load data from localStorage
	useEffect(() => {
		try {
			const savedCategories = localStorage.getItem('workCategories')
			const savedTags = localStorage.getItem('workTags')
			const savedTemplates = localStorage.getItem('workTemplates')

			if (savedCategories) {
				setCategories(JSON.parse(savedCategories))
			} else {
				// Default categories
				const defaultCategories: WorkCategory[] = [
					{ id: '1', name: 'Development', color: '#3B82F6', description: 'Software development tasks' },
					{ id: '2', name: 'Meeting', color: '#8B5CF6', description: 'Team meetings and discussions' },
					{ id: '3', name: 'Research', color: '#10B981', description: 'Research and analysis' },
					{ id: '4', name: 'Documentation', color: '#F59E0B', description: 'Documentation and writing' },
					{ id: '5', name: 'Review', color: '#EC4899', description: 'Code and document reviews' },
					{ id: '6', name: 'Other', color: '#6B7280', description: 'Other tasks' },
				]
				setCategories(defaultCategories)
				localStorage.setItem('workCategories', JSON.stringify(defaultCategories))
			}

			if (savedTags) {
				setTags(JSON.parse(savedTags))
			} else {
				// Default tags
				const defaultTags: WorkTag[] = [
					{ id: '1', name: 'urgent', category: 'priority' },
					{ id: '2', name: 'bug-fix', category: 'type' },
					{ id: '3', name: 'feature', category: 'type' },
					{ id: '4', name: 'frontend', category: 'tech' },
					{ id: '5', name: 'backend', category: 'tech' },
					{ id: '6', name: 'database', category: 'tech' },
				]
				setTags(defaultTags)
				localStorage.setItem('workTags', JSON.stringify(defaultTags))
			}

			if (savedTemplates) {
				setTemplates(JSON.parse(savedTemplates))
			} else {
				// Default templates
				const defaultTemplates: WorkTemplate[] = [
					{
						id: '1',
						title: 'Daily Standup',
						description: 'What I did today:\n\nWhat I plan to do:\n\nBlockers:',
						category: 'meeting',
					},
					{
						id: '2',
						title: 'Bug Fix',
						description: 'Issue:\n\nRoot Cause:\n\nSolution:\n\nTested:',
						category: 'development',
					},
					{
						id: '3',
						title: 'Feature Complete',
						description: 'Feature:\n\nImplementation:\n\nTesting:\n\nDocumentation:',
						category: 'development',
					},
				]
				setTemplates(defaultTemplates)
				localStorage.setItem('workTemplates', JSON.stringify(defaultTemplates))
			}
		} catch (error) {
			console.error('Failed to load settings:', error)
		}
	}, [])

	// Category handlers
	const handleAddCategory = () => {
		if (!newCategory.name) {
			toast.error('Please enter a category name')
			return
		}

		const category: WorkCategory = {
			id: Date.now().toString(),
			...newCategory,
		}

		const updated = [...categories, category]
		setCategories(updated)
		localStorage.setItem('workCategories', JSON.stringify(updated))
		setNewCategory({ name: '', color: '#3B82F6', description: '' })
		setShowAddCategory(false)
		toast.success('Category added successfully')
	}

	const handleUpdateCategory = () => {
		if (!editingCategory) return

		const updated = categories.map((cat) =>
			cat.id === editingCategory.id ? editingCategory : cat
		)
		setCategories(updated)
		localStorage.setItem('workCategories', JSON.stringify(updated))
		setEditingCategory(null)
		toast.success('Category updated successfully')
	}

	const handleDeleteCategory = (id: string) => {
		if (confirm('Are you sure you want to delete this category?')) {
			const updated = categories.filter((cat) => cat.id !== id)
			setCategories(updated)
			localStorage.setItem('workCategories', JSON.stringify(updated))
			toast.success('Category deleted')
		}
	}

	// Tag handlers
	const handleAddTag = () => {
		if (!newTag.name) {
			toast.error('Please enter a tag name')
			return
		}

		const tag: WorkTag = {
			id: Date.now().toString(),
			...newTag,
		}

		const updated = [...tags, tag]
		setTags(updated)
		localStorage.setItem('workTags', JSON.stringify(updated))
		setNewTag({ name: '', category: '' })
		setShowAddTag(false)
		toast.success('Tag added successfully')
	}

	const handleDeleteTag = (id: string) => {
		if (confirm('Are you sure you want to delete this tag?')) {
			const updated = tags.filter((tag) => tag.id !== id)
			setTags(updated)
			localStorage.setItem('workTags', JSON.stringify(updated))
			toast.success('Tag deleted')
		}
	}

	// Template handlers
	const handleAddTemplate = () => {
		if (!newTemplate.title || !newTemplate.description) {
			toast.error('Please fill in all required fields')
			return
		}

		const template: WorkTemplate = {
			id: Date.now().toString(),
			...newTemplate,
		}

		const updated = [...templates, template]
		setTemplates(updated)
		localStorage.setItem('workTemplates', JSON.stringify(updated))
		setNewTemplate({ title: '', description: '', category: '' })
		setShowAddTemplate(false)
		toast.success('Template added successfully')
	}

	const handleUpdateTemplate = () => {
		if (!editingTemplate) return

		const updated = templates.map((tmpl) =>
			tmpl.id === editingTemplate.id ? editingTemplate : tmpl
		)
		setTemplates(updated)
		localStorage.setItem('workTemplates', JSON.stringify(updated))
		setEditingTemplate(null)
		toast.success('Template updated successfully')
	}

	const handleDeleteTemplate = (id: string) => {
		if (confirm('Are you sure you want to delete this template?')) {
			const updated = templates.filter((tmpl) => tmpl.id !== id)
			setTemplates(updated)
			localStorage.setItem('workTemplates', JSON.stringify(updated))
			toast.success('Template deleted')
		}
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold flex items-center gap-3">
						<Settings className="h-8 w-8 text-primary" />
						System Settings
					</h1>
					<p className="mt-2 text-neutral-600 dark:text-neutral-400">
						Configure work categories, tags, and templates
					</p>
				</div>
			</div>

			{/* Tabs */}
			<div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800">
				<button
					onClick={() => setActiveTab('categories')}
					className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
						activeTab === 'categories'
							? 'border-primary text-primary'
							: 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
					}`}
				>
					<Folder className="inline h-4 w-4 mr-2" />
					Work Categories
				</button>
				<button
					onClick={() => setActiveTab('tags')}
					className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
						activeTab === 'tags'
							? 'border-primary text-primary'
							: 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
					}`}
				>
					<Tag className="inline h-4 w-4 mr-2" />
					Tags
				</button>
				<button
					onClick={() => setActiveTab('templates')}
					className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
						activeTab === 'templates'
							? 'border-primary text-primary'
							: 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
					}`}
				>
					<FileText className="inline h-4 w-4 mr-2" />
					Templates
				</button>
			</div>

			{/* Categories Tab */}
			{activeTab === 'categories' && (
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<p className="text-sm text-neutral-600 dark:text-neutral-400">
							Manage work categories used in Work Input
						</p>
						<Button onClick={() => setShowAddCategory(true)}>
							<Plus className="h-4 w-4 mr-2" />
							Add Category
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
													setEditingCategory({ ...editingCategory, name: e.target.value })
												}
												placeholder="Category name"
											/>
											<Textarea
												value={editingCategory.description}
												onChange={(e) =>
													setEditingCategory({ ...editingCategory, description: e.target.value })
												}
												placeholder="Description"
												rows={2}
											/>
											<div className="flex items-center gap-2">
												<span className="text-sm">Color:</span>
												<select
													value={editingCategory.color}
													onChange={(e) =>
														setEditingCategory({ ...editingCategory, color: e.target.value })
													}
													className="flex-1 px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900"
												>
													{colorOptions.map((opt) => (
														<option key={opt.value} value={opt.value}>
															{opt.label}
														</option>
													))}
												</select>
											</div>
											<div className="flex items-center gap-2">
												<Button onClick={handleUpdateCategory} size="sm" className="flex-1">
													<Save className="h-4 w-4 mr-1" />
													Save
												</Button>
												<Button
													onClick={() => setEditingCategory(null)}
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
														onClick={() => setEditingCategory(category)}
														className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
													>
														<Edit2 className="h-4 w-4 text-neutral-600" />
													</button>
													<button
														onClick={() => handleDeleteCategory(category.id)}
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
			)}

			{/* Tags Tab */}
			{activeTab === 'tags' && (
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<p className="text-sm text-neutral-600 dark:text-neutral-400">
							Manage predefined tags for quick selection
						</p>
						<Button onClick={() => setShowAddTag(true)}>
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
										<button
											onClick={() => handleDeleteTag(tag.id)}
											className="hover:text-red-500"
										>
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
			)}

			{/* Templates Tab */}
			{activeTab === 'templates' && (
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<p className="text-sm text-neutral-600 dark:text-neutral-400">
							Manage work entry templates for quick input
						</p>
						<Button onClick={() => setShowAddTemplate(true)}>
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
													setEditingTemplate({ ...editingTemplate, title: e.target.value })
												}
												placeholder="Template title"
											/>
											<Textarea
												value={editingTemplate.description}
												onChange={(e) =>
													setEditingTemplate({ ...editingTemplate, description: e.target.value })
												}
												placeholder="Template content"
												rows={6}
											/>
											<select
												value={editingTemplate.category}
												onChange={(e) =>
													setEditingTemplate({ ...editingTemplate, category: e.target.value })
												}
												className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900"
											>
												<option value="">Select category</option>
												{categories.map((cat) => (
													<option key={cat.id} value={cat.id}>
														{cat.name}
													</option>
												))}
											</select>
											<div className="flex items-center gap-2">
												<Button onClick={handleUpdateTemplate} size="sm" className="flex-1">
													<Save className="h-4 w-4 mr-1" />
													Save
												</Button>
												<Button
													onClick={() => setEditingTemplate(null)}
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
														onClick={() => setEditingTemplate(template)}
														className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
													>
														<Edit2 className="h-4 w-4 text-neutral-600" />
													</button>
													<button
														onClick={() => handleDeleteTemplate(template.id)}
														className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
													>
														<Trash2 className="h-4 w-4 text-red-500" />
													</button>
												</div>
											</div>
											<p className="text-sm text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap mb-3">
												{template.description}
											</p>
											{template.category && (
												<span className="inline-block text-xs px-2 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800">
													{categories.find((c) => c.id === template.category)?.name || template.category}
												</span>
											)}
										</>
									)}
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			)}

			{/* Add Category Dialog */}
			{showAddCategory && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
					<div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-md">
						<div className="p-6">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-xl font-bold flex items-center gap-2">
									<Plus className="h-5 w-5 text-primary" />
									Add Category
								</h3>
								<button
									onClick={() => setShowAddCategory(false)}
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
										onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
										placeholder="e.g., Development"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium mb-2">Description</label>
									<Textarea
										value={newCategory.description}
										onChange={(e) =>
											setNewCategory({ ...newCategory, description: e.target.value })
										}
										placeholder="Brief description of this category"
										rows={3}
									/>
								</div>

								<div>
									<label className="block text-sm font-medium mb-2">Color</label>
									<select
										value={newCategory.color}
										onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
										className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900"
									>
										{colorOptions.map((opt) => (
											<option key={opt.value} value={opt.value}>
												{opt.label}
											</option>
										))}
									</select>
								</div>

								<div className="flex items-center gap-2 pt-4">
									<Button onClick={handleAddCategory} className="flex-1">
										Add Category
									</Button>
									<Button
										variant="outline"
										onClick={() => setShowAddCategory(false)}
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
									onClick={() => setShowAddTag(false)}
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
										onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
										placeholder="e.g., urgent, bug-fix"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium mb-2">Category (Optional)</label>
									<Input
										value={newTag.category}
										onChange={(e) => setNewTag({ ...newTag, category: e.target.value })}
										placeholder="e.g., priority, type, tech"
									/>
								</div>

								<div className="flex items-center gap-2 pt-4">
									<Button onClick={handleAddTag} className="flex-1">
										Add Tag
									</Button>
									<Button variant="outline" onClick={() => setShowAddTag(false)} className="flex-1">
										Cancel
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Add Template Dialog */}
			{showAddTemplate && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
					<div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-2xl">
						<div className="p-6">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-xl font-bold flex items-center gap-2">
									<Plus className="h-5 w-5 text-primary" />
									Add Template
								</h3>
								<button
									onClick={() => setShowAddTemplate(false)}
									className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
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
										onChange={(e) => setNewTemplate({ ...newTemplate, title: e.target.value })}
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
											setNewTemplate({ ...newTemplate, description: e.target.value })
										}
										placeholder="Template content with placeholders..."
										rows={8}
									/>
								</div>

								<div>
									<label className="block text-sm font-medium mb-2">Category</label>
									<select
										value={newTemplate.category}
										onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
										className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900"
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
									<Button onClick={handleAddTemplate} className="flex-1">
										Add Template
									</Button>
									<Button
										variant="outline"
										onClick={() => setShowAddTemplate(false)}
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

			<Toaster />
		</div>
	)
}

