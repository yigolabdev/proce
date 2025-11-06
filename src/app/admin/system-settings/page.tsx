import { useState, useEffect } from 'react'
import { Settings, Tag, Folder, FileText, Building } from 'lucide-react'
import { toast } from 'sonner'
import Toaster from '../../../components/ui/Toaster'
import DevMemo from '../../../components/dev/DevMemo'
import { DEV_MEMOS } from '../../../constants/devMemos'

// Import types and components
import type { WorkCategory, WorkTag, WorkTemplate, Department } from './_types/types'
import { DEFAULT_CATEGORIES, DEFAULT_TAGS, DEFAULT_TEMPLATES, DEFAULT_DEPARTMENTS } from './_types/types'
import CategoriesTab from './_components/CategoriesTab'
import TagsTab from './_components/TagsTab'
import TemplatesTab from './_components/TemplatesTab'
import DepartmentsTab from './_components/DepartmentsTab'

export default function SystemSettingsPage() {
	const [activeTab, setActiveTab] = useState<'categories' | 'tags' | 'templates' | 'departments'>('categories')

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

	// Departments
	const [departments, setDepartments] = useState<Department[]>([])
	const [showAddDepartment, setShowAddDepartment] = useState(false)
	const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
	const [newDepartment, setNewDepartment] = useState<Omit<Department, 'id'>>({
		name: '',
		code: '',
		parentId: '',
		managerId: '',
		managerName: '',
		description: '',
		employeeCount: '',
		location: '',
	})

	// Load data from localStorage
	useEffect(() => {
		try {
			const savedCategories = localStorage.getItem('workCategories')
			const savedTags = localStorage.getItem('workTags')
			const savedTemplates = localStorage.getItem('workTemplates')
			const savedDepartments = localStorage.getItem('departments')

			if (savedCategories) {
				setCategories(JSON.parse(savedCategories))
			} else {
				setCategories(DEFAULT_CATEGORIES)
				localStorage.setItem('workCategories', JSON.stringify(DEFAULT_CATEGORIES))
			}

			if (savedTags) {
				setTags(JSON.parse(savedTags))
			} else {
				setTags(DEFAULT_TAGS)
				localStorage.setItem('workTags', JSON.stringify(DEFAULT_TAGS))
			}

			if (savedTemplates) {
				setTemplates(JSON.parse(savedTemplates))
			} else {
				setTemplates(DEFAULT_TEMPLATES)
				localStorage.setItem('workTemplates', JSON.stringify(DEFAULT_TEMPLATES))
			}

			if (savedDepartments) {
				setDepartments(JSON.parse(savedDepartments))
			} else {
				setDepartments(DEFAULT_DEPARTMENTS)
				localStorage.setItem('departments', JSON.stringify(DEFAULT_DEPARTMENTS))
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

	// Department handlers
	const handleAddDepartment = () => {
		if (!newDepartment.name || !newDepartment.code) {
			toast.error('Please enter department name and code')
			return
		}

		const department: Department = {
			id: Date.now().toString(),
			...newDepartment,
		}

		const updated = [...departments, department]
		setDepartments(updated)
		localStorage.setItem('departments', JSON.stringify(updated))
		setNewDepartment({
			name: '',
			code: '',
			parentId: '',
			managerId: '',
			managerName: '',
			description: '',
			employeeCount: '',
			location: '',
		})
		setShowAddDepartment(false)
		toast.success('Department added successfully')
	}

	const handleUpdateDepartment = () => {
		if (!editingDepartment) return

		const updated = departments.map((dept) =>
			dept.id === editingDepartment.id ? editingDepartment : dept
		)
		setDepartments(updated)
		localStorage.setItem('departments', JSON.stringify(updated))
		setEditingDepartment(null)
		toast.success('Department updated successfully')
	}

	const handleDeleteDepartment = (id: string) => {
		if (confirm('Are you sure you want to delete this department?')) {
			const updated = departments.filter((dept) => dept.id !== id)
			setDepartments(updated)
			localStorage.setItem('departments', JSON.stringify(updated))
			toast.success('Department deleted')
		}
	}

	return (
		<>
			<DevMemo content={DEV_MEMOS.ADMIN_SYSTEM_SETTINGS} pagePath="/app/admin/system-settings/page.tsx" />
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold flex items-center gap-3">
							<Settings className="h-8 w-8 text-primary" />
							System Settings
						</h1>
						<p className="mt-2 text-neutral-600 dark:text-neutral-400">
							Configure work categories, tags, templates, and departments
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
					<button
						onClick={() => setActiveTab('departments')}
						className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
							activeTab === 'departments'
								? 'border-primary text-primary'
								: 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
						}`}
					>
						<Building className="inline h-4 w-4 mr-2" />
						Departments
					</button>
				</div>

				{/* Categories Tab */}
				{activeTab === 'categories' && (
					<CategoriesTab
						categories={categories}
						editingCategory={editingCategory}
						showAddCategory={showAddCategory}
						newCategory={newCategory}
						onSetEditingCategory={setEditingCategory}
						onSetShowAddCategory={setShowAddCategory}
						onSetNewCategory={setNewCategory}
						onAdd={handleAddCategory}
						onUpdate={handleUpdateCategory}
						onDelete={handleDeleteCategory}
					/>
				)}

				{/* Tags Tab */}
				{activeTab === 'tags' && (
					<TagsTab
						tags={tags}
						showAddTag={showAddTag}
						newTag={newTag}
						onSetShowAddTag={setShowAddTag}
						onSetNewTag={setNewTag}
						onAdd={handleAddTag}
						onDelete={handleDeleteTag}
					/>
				)}

				{/* Templates Tab */}
				{activeTab === 'templates' && (
					<TemplatesTab
						templates={templates}
						categories={categories}
						editingTemplate={editingTemplate}
						showAddTemplate={showAddTemplate}
						newTemplate={newTemplate}
						onSetEditingTemplate={setEditingTemplate}
						onSetShowAddTemplate={setShowAddTemplate}
						onSetNewTemplate={setNewTemplate}
						onAdd={handleAddTemplate}
						onUpdate={handleUpdateTemplate}
						onDelete={handleDeleteTemplate}
					/>
				)}

				{/* Departments Tab */}
				{activeTab === 'departments' && (
					<DepartmentsTab
						departments={departments}
						editingDepartment={editingDepartment}
						showAddDepartment={showAddDepartment}
						newDepartment={newDepartment}
						onSetEditingDepartment={setEditingDepartment}
						onSetShowAddDepartment={setShowAddDepartment}
						onSetNewDepartment={setNewDepartment}
						onAdd={handleAddDepartment}
						onUpdate={handleUpdateDepartment}
						onDelete={handleDeleteDepartment}
					/>
				)}

				<Toaster />
			</div>
		</>
	)
}

