import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import { 
	FileText, 
	Upload, 
	X, 
	Send, 
	Sparkles, 
	Calendar, 
	Tag,
	CheckCircle2,
	Image as ImageIcon,
	FileSpreadsheet,
	File,
	Plus,
	Link2,
	Save,
	FolderOpen,
	AlertCircle,
	ShieldCheck,
	FolderKanban,
	Target,
	RefreshCw,
	TrendingUp,
	Clock,
	Info
} from 'lucide-react'
import DevMemo from '../components/dev/DevMemo'
import { DEV_MEMOS } from '../constants/devMemos'
import { toast } from 'sonner'
import { initializeMockDrafts } from './_mocks/workInputDrafts'
import { initializeMockWorkCategories } from './_mocks/workCategories'
import { initializeMockTeamMembers } from './_mocks/teamMembers'

// Local interfaces
interface UploadedFile {
	id: string
	name: string
	size: number
	type: string
	url?: string
	uploadedAt?: string
	createdAt?: string
}

interface LinkedResource {
	id: string
	title: string
	url: string
	addedAt: string
}

// OKR Interfaces (from OKR page)
interface KeyResult {
	id: string
	description: string
	target: number
	current: number
	unit: string
	owner: string
}

interface Objective {
	id: string
	title: string
	description: string
	quarter: string
	owner: string
	team: string
	status: 'on-track' | 'at-risk' | 'behind' | 'completed'
	keyResults: KeyResult[]
	startDate: string
	endDate: string
}

// Local WorkEntry interface
export interface WorkEntry {
	id: string
	title: string
	description: string
	category: string
	projectId?: string
	objectiveId?: string
	keyResultId?: string
	keyResultProgress?: number
	tags: string[]
	date: Date
	duration: string
	files: UploadedFile[]
	links: LinkedResource[]
	status: 'draft' | 'submitted'
	isConfidential: boolean
	
	// AI Analysis (optional)
	complexity?: 'low' | 'medium' | 'high'
	estimatedDuration?: string
	actualDuration?: string
	requiredSkills?: string[]
	collaborators?: string[]
	blockers?: string[]
}

export interface DraftData {
	id: string
	title: string
	description: string
	category: string
	projectId?: string
	objectiveId?: string
	keyResultId?: string
	keyResultProgress?: number
	tags: string[]
	files: UploadedFile[]
	links: LinkedResource[]
	isConfidential: boolean
	savedAt: Date
}

interface Project {
	id: string
	name: string
	status: 'active' | 'planning' | 'completed' | 'on-hold'
}

interface WorkCategory {
	id: string
	name: string
}

export default function InputPage() {
	// Form State
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [category, setCategory] = useState('')
	const [customCategory, setCustomCategory] = useState('')
	const [showCustomCategory, setShowCustomCategory] = useState(false)
	const [selectedProject, setSelectedProject] = useState('')
	const [selectedObjective, setSelectedObjective] = useState('')
	const [selectedKeyResult, setSelectedKeyResult] = useState('')
	const [keyResultProgress, setKeyResultProgress] = useState<string>('')
	const [tags, setTags] = useState<string[]>([])
	const [tagInput, setTagInput] = useState('')
	const [duration, setDuration] = useState('')
	const [showCustomDuration, setShowCustomDuration] = useState(false)
	const [customDuration, setCustomDuration] = useState('')
	const [files, setFiles] = useState<UploadedFile[]>([])
	const [links, setLinks] = useState<LinkedResource[]>([])
	const [linkInput, setLinkInput] = useState('')
	const [isConfidential, setIsConfidential] = useState(false)
	
	// NoMeet (Async Discussion) State
	const [asyncAgenda, setAsyncAgenda] = useState('')
	const [asyncBriefing, setAsyncBriefing] = useState('')
	const [asyncDecisionStatus, setAsyncDecisionStatus] = useState<'pending' | 'approved' | 'escalated'>('pending')
	
	// Data State
	const [projects, setProjects] = useState<Project[]>([])
	const [objectives, setObjectives] = useState<Objective[]>([])
	const [categories, setCategories] = useState<WorkCategory[]>([])
	const [drafts, setDrafts] = useState<DraftData[]>([])
	const [recentProjects, setRecentProjects] = useState<string[]>([])
	const [recentObjectives, setRecentObjectives] = useState<string[]>([])
	
	// UI State
	const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
	const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null)
	const [showDraftsDialog, setShowDraftsDialog] = useState(false)
	const [showDecisionDialog, setShowDecisionDialog] = useState(false)
	const [editingEntryId, setEditingEntryId] = useState<string | null>(null)
	const [isDragging, setIsDragging] = useState(false)
	
	// Refs
	const fileInputRef = useRef<HTMLInputElement>(null)

	// Initialize data
	useEffect(() => {
		try {
			// Load projects
			const savedProjects = localStorage.getItem('projects')
			if (savedProjects) {
				setProjects(JSON.parse(savedProjects))
			} else {
				setProjects([
					{ id: 'proj-1', name: 'Website Redesign', status: 'active' },
					{ id: 'proj-2', name: 'Mobile App Development', status: 'planning' },
					{ id: 'proj-3', name: 'API Integration', status: 'active' },
				])
			}

			// Load objectives
			const savedObjectives = localStorage.getItem('objectives')
			if (savedObjectives) {
				setObjectives(JSON.parse(savedObjectives))
			}

		// Load statuses (formerly categories)
		const savedStatuses = localStorage.getItem('workStatuses')
		if (savedStatuses) {
			setCategories(JSON.parse(savedStatuses))
		} else {
			initializeMockWorkCategories()
			const initialStatuses = localStorage.getItem('workStatuses')
			if (initialStatuses) {
				setCategories(JSON.parse(initialStatuses))
			}
		}

			// Initialize team members (for future use)
			const savedTeamMembers = localStorage.getItem('teamMembers')
			if (!savedTeamMembers) {
				initializeMockTeamMembers()
			}

			// Load drafts
			const savedDrafts = localStorage.getItem('workInputDrafts')
			if (savedDrafts) {
				setDrafts(JSON.parse(savedDrafts))
			} else {
				initializeMockDrafts()
				const initialDrafts = localStorage.getItem('workInputDrafts')
				if (initialDrafts) {
					setDrafts(JSON.parse(initialDrafts))
				}
			}

			// Check for edit mode
			const editData = sessionStorage.getItem('workInputEditData')
			if (editData) {
				try {
					const data = JSON.parse(editData)
					setEditingEntryId(data.id)
					setTitle(data.title)
					setDescription(data.description)
					setCategory(data.category || '')
					setSelectedProject(data.projectId || '')
					setDuration(data.duration || '')
					setTags(data.tags || [])
					setFiles(data.files || [])
					setLinks(data.links || [])
					setIsConfidential(data.isConfidential || false)
					
					if (data.objectiveId) {
						setSelectedObjective(data.objectiveId)
					}
					
					toast.info('Editing Work Entry', {
						description: 'Make your changes and submit to update',
					})
					
					sessionStorage.removeItem('workInputEditData')
				} catch (error) {
					console.error('Error loading edit data:', error)
				}
			}
		} catch (error) {
			console.error('Failed to load system settings:', error)
		}
		
		loadRecentItems()
	}, [])

	// Load recent items
	const loadRecentItems = () => {
		try {
			const savedRecentProjects = localStorage.getItem('recentProjects')
			const savedRecentObjectives = localStorage.getItem('recentObjectives')
			
			if (savedRecentProjects) {
				setRecentProjects(JSON.parse(savedRecentProjects))
			}
			if (savedRecentObjectives) {
				setRecentObjectives(JSON.parse(savedRecentObjectives))
			}
		} catch (error) {
			console.error('Failed to load recent items:', error)
		}
	}
	
	// Update recent items
	const updateRecentItems = (type: 'project' | 'objective', id: string) => {
		if (!id) return
		
		try {
			if (type === 'project') {
				const updated = [id, ...recentProjects.filter(p => p !== id)].slice(0, 5)
				setRecentProjects(updated)
				localStorage.setItem('recentProjects', JSON.stringify(updated))
			} else {
				const updated = [id, ...recentObjectives.filter(o => o !== id)].slice(0, 5)
				setRecentObjectives(updated)
				localStorage.setItem('recentObjectives', JSON.stringify(updated))
			}
		} catch (error) {
			console.error('Failed to update recent items:', error)
		}
	}

	// Auto-save functionality
	useEffect(() => {
		if (editingEntryId) return
		if (!title && !description) return
		
		const timer = setTimeout(() => {
			setAutoSaveStatus('saving')
			
			// Use custom category if "Other" is selected
			const finalCategory = showCustomCategory ? customCategory.trim() : category
			
			const autoDraft: DraftData = {
				id: 'auto-save',
				title: title || 'Untitled',
				description,
				category: finalCategory,
				projectId: selectedProject || undefined,
				objectiveId: selectedObjective || undefined,
				tags,
				files,
				links,
				isConfidential,
				savedAt: new Date(),
			}
			
			try {
				const existingDrafts = localStorage.getItem('workInputDrafts')
				let draftsList = existingDrafts ? JSON.parse(existingDrafts) : []
				
				draftsList = draftsList.filter((d: DraftData) => d.id !== 'auto-save')
				draftsList.unshift(autoDraft)
				draftsList = draftsList.slice(0, 10)
				
				localStorage.setItem('workInputDrafts', JSON.stringify(draftsList))
				setDrafts(draftsList)
				setAutoSaveStatus('saved')
				setLastAutoSave(new Date())
				
				setTimeout(() => setAutoSaveStatus('idle'), 2000)
			} catch (error) {
				console.error('Auto-save failed:', error)
				setAutoSaveStatus('idle')
			}
		}, 2000)
		
		return () => clearTimeout(timer)
	}, [title, description, category, customCategory, showCustomCategory, selectedProject, selectedObjective, tags, files, links, isConfidential, editingEntryId])

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key === 's') {
				e.preventDefault()
				saveDraft()
			}
			if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
				e.preventDefault()
				handleSubmit()
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [title, description])

	// File handling
	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = Array.from(e.target.files || [])
		const newFiles: UploadedFile[] = selectedFiles.map((file) => ({
			id: `file-${Date.now()}-${Math.random()}`,
			name: file.name,
			size: file.size,
			type: file.type,
			url: URL.createObjectURL(file),
			createdAt: new Date().toISOString(),
		}))
		setFiles([...files, ...newFiles])
		toast.success(`${selectedFiles.length} file(s) uploaded`)
	}

	const removeFile = (id: string) => {
		setFiles(files.filter((f) => f.id !== id))
		toast.info('File removed')
	}

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(true)
	}

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(false)
	}

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(false)

		const droppedFiles = Array.from(e.dataTransfer.files)
		const newFiles: UploadedFile[] = droppedFiles.map((file) => ({
			id: `file-${Date.now()}-${Math.random()}`,
			name: file.name,
			size: file.size,
			type: file.type,
			url: URL.createObjectURL(file),
			createdAt: new Date().toISOString(),
		}))
		setFiles([...files, ...newFiles])
		toast.success(`${droppedFiles.length} file(s) uploaded`)
	}

	// Link handling
	const addLink = () => {
		if (!linkInput.trim()) return
		
		const newLink: LinkedResource = {
			id: `link-${Date.now()}`,
			title: linkInput.trim(),
			url: linkInput.trim(),
			addedAt: new Date().toISOString(),
		}
		setLinks([...links, newLink])
		setLinkInput('')
		toast.success('Link added')
	}

	const removeLink = (id: string) => {
		setLinks(links.filter((l) => l.id !== id))
		toast.info('Link removed')
	}

	// Duration handling
	const handleDurationChange = (value: string) => {
		if (value === 'custom') {
			setShowCustomDuration(true)
			setDuration('')
		} else {
			setShowCustomDuration(false)
			setCustomDuration('')
			setDuration(value)
		}
	}

	// Tag handling
	const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' || e.key === ',') {
			e.preventDefault()
			addTag()
		}
	}

	const addTag = () => {
		const tag = tagInput.trim()
		if (!tag) return
		if (tags.includes(tag)) {
			toast.error('Tag already exists')
			return
		}
		
		setTags([...tags, tag])
		setTagInput('')
	}

	const removeTag = (tag: string) => {
		setTags(tags.filter((t) => t !== tag))
	}

	// Save draft
	const saveDraft = () => {
		if (!title && !description) {
			toast.error('Please enter at least a title or description')
			return
		}
		
		// Use custom category if "Other" is selected
		const finalCategory = showCustomCategory ? customCategory.trim() : category

		const draft: DraftData = {
			id: editingEntryId || `draft-${Date.now()}`,
			title: title || 'Untitled',
			description,
			category: finalCategory,
			projectId: selectedProject || undefined,
			objectiveId: selectedObjective || undefined,
			keyResultId: selectedKeyResult || undefined,
			keyResultProgress: keyResultProgress ? parseFloat(keyResultProgress) : undefined,
			tags,
			files,
			links,
			isConfidential,
			savedAt: new Date(),
		}

		try {
			const existingDrafts = localStorage.getItem('workInputDrafts')
			let draftsList = existingDrafts ? JSON.parse(existingDrafts) : []
			
			draftsList = draftsList.filter((d: DraftData) => d.id !== draft.id && d.id !== 'auto-save')
			draftsList.unshift(draft)
			draftsList = draftsList.slice(0, 10)
			
			localStorage.setItem('workInputDrafts', JSON.stringify(draftsList))
			setDrafts(draftsList)
			toast.success('Draft saved!')
		} catch (error) {
			console.error('Failed to save draft:', error)
			toast.error('Failed to save draft')
		}
	}

	// Load draft
	const loadDraft = (draft: DraftData) => {
		setTitle(draft.title)
		setDescription(draft.description)
		
		// Check if category is a predefined one or custom
		const draftCategory = draft.category || ''
		const isPredefinedCategory = categories.some(cat => cat.id === draftCategory)
		
		if (isPredefinedCategory) {
			setCategory(draftCategory)
			setShowCustomCategory(false)
			setCustomCategory('')
		} else if (draftCategory) {
			// Custom category
			setCategory('other')
			setShowCustomCategory(true)
			setCustomCategory(draftCategory)
		} else {
			setCategory('')
			setShowCustomCategory(false)
			setCustomCategory('')
		}
		
		setSelectedProject(draft.projectId || '')
		setSelectedObjective(draft.objectiveId || '')
		setSelectedKeyResult(draft.keyResultId || '')
		setKeyResultProgress(draft.keyResultProgress?.toString() || '')
		setTags(draft.tags || [])
		setFiles(draft.files || [])
		setLinks(draft.links || [])
		setIsConfidential(draft.isConfidential || false)
		
		setShowDraftsDialog(false)
		toast.success('Draft loaded')
	}

	// Delete draft
	const deleteDraft = (id: string) => {
		try {
			const existingDrafts = localStorage.getItem('workInputDrafts')
			let draftsList = existingDrafts ? JSON.parse(existingDrafts) : []
			
			draftsList = draftsList.filter((d: DraftData) => d.id !== id)
			
			localStorage.setItem('workInputDrafts', JSON.stringify(draftsList))
			setDrafts(draftsList)
			toast.info('Draft deleted')
		} catch (error) {
			console.error('Failed to delete draft:', error)
			toast.error('Failed to delete draft')
		}
	}

	// Clear form
	const clearForm = () => {
		setTitle('')
		setDescription('')
		setCategory('')
		setCustomCategory('')
		setShowCustomCategory(false)
		setSelectedProject('')
		setSelectedObjective('')
		setSelectedKeyResult('')
		setKeyResultProgress('')
		setTags([])
		setDuration('')
		setShowCustomDuration(false)
		setCustomDuration('')
		setFiles([])
		setLinks([])
		setIsConfidential(false)
		setEditingEntryId(null)
	}

	// Submit work entry
	const handleSubmit = () => {
		// Validation
		if (!title.trim()) {
			toast.error('Please enter a title')
			return
		}
		if (!description.trim()) {
			toast.error('Please enter a description')
			return
		}
		
		// Validate custom status if "Other" is selected
		if (showCustomCategory && !customCategory.trim()) {
			toast.error('Please enter a custom status name')
			return
		}

		// Use custom duration if provided
		const finalDuration = showCustomDuration ? customDuration : duration
		
		// Use custom category if "Other" is selected
		const finalCategory = showCustomCategory ? customCategory.trim() : category

		const workEntry: WorkEntry = {
			id: editingEntryId || `work-${Date.now()}`,
			title: title.trim(),
			description: description.trim(),
			category: finalCategory,
			projectId: selectedProject || undefined,
			objectiveId: selectedObjective || undefined,
			keyResultId: selectedKeyResult || undefined,
			keyResultProgress: keyResultProgress ? parseFloat(keyResultProgress) : undefined,
			tags,
			date: new Date(),
			duration: finalDuration || '1h',
			files,
			links,
			status: 'submitted',
			isConfidential,
		}

		try {
			// Save work entry
			const existingEntries = localStorage.getItem('workEntries')
			let entriesList = existingEntries ? JSON.parse(existingEntries) : []
			
			if (editingEntryId) {
				entriesList = entriesList.map((entry: WorkEntry) =>
					entry.id === editingEntryId ? workEntry : entry
				)
				toast.success('Work entry updated!')
			} else {
				entriesList.unshift(workEntry)
				toast.success('Work entry submitted!')
			}
			
			localStorage.setItem('workEntries', JSON.stringify(entriesList))

			// Update Key Result progress if selected
			if (selectedKeyResult && keyResultProgress) {
				const updatedObjectives = objectives.map((obj) => {
					if (obj.id === selectedObjective) {
						const updatedKeyResults = obj.keyResults.map((kr) => {
							if (kr.id === selectedKeyResult) {
								return { ...kr, current: parseFloat(keyResultProgress) }
							}
							return kr
						})
						
						const overallProgress = updatedKeyResults.length > 0
							? Math.round(updatedKeyResults.reduce((sum, kr) => sum + (kr.current / kr.target) * 100, 0) / updatedKeyResults.length)
							: 0
						
						let newStatus: 'on-track' | 'at-risk' | 'behind' | 'completed' = 'on-track'
						if (overallProgress >= 100) {
							newStatus = 'completed'
						} else if (overallProgress >= 75) {
							newStatus = 'on-track'
						} else if (overallProgress >= 50) {
							newStatus = 'at-risk'
						} else {
							newStatus = 'behind'
						}
						
						const updatedObj = { ...obj, keyResults: updatedKeyResults, status: newStatus }
						
						toast.success('🎯 Key Result Updated!', { 
							description: `Progress: ${overallProgress}% | Status: ${newStatus}` 
						})
						
						return updatedObj
					}
					return obj
				})
				localStorage.setItem('objectives', JSON.stringify(updatedObjectives))
				setObjectives(updatedObjectives)
			}

			// Remove auto-save draft
			const existingDrafts = localStorage.getItem('workInputDrafts')
			let draftsList = existingDrafts ? JSON.parse(existingDrafts) : []
			draftsList = draftsList.filter((d: DraftData) => d.id !== 'auto-save' && d.id !== editingEntryId)
			localStorage.setItem('workInputDrafts', JSON.stringify(draftsList))
			setDrafts(draftsList)

			clearForm()
		} catch (error) {
			console.error('Failed to submit work entry:', error)
			toast.error('Failed to submit work entry')
		}
	}

	// Helper functions
	const getFileIcon = (type: string) => {
		if (type.startsWith('image/')) return <ImageIcon className="h-4 w-4" />
		if (type.includes('spreadsheet') || type.includes('excel')) return <FileSpreadsheet className="h-4 w-4" />
		return <File className="h-4 w-4" />
	}

	const formatFileSize = (bytes: number) => {
		if (bytes < 1024) return bytes + ' B'
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
		return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
	}

	// Calculate progress
	const requiredFields = [title, description]
	const finalCategoryValue = showCustomCategory ? customCategory : category
	const optionalFields = [finalCategoryValue, selectedProject, selectedObjective, duration, tags.length > 0]
	const requiredFieldsFilled = requiredFields.filter(Boolean).length
	const optionalFieldsFilled = optionalFields.filter(Boolean).length
	const totalRequiredFields = requiredFields.length
	const totalOptionalFields = optionalFields.length
	const overallProgress = Math.round(((requiredFieldsFilled + optionalFieldsFilled) / (totalRequiredFields + totalOptionalFields)) * 100)
	
	return (
		<>
			<DevMemo content={DEV_MEMOS.INPUT} pagePath="/pages/InputPage.tsx" />
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between flex-wrap gap-4">
				<div className="flex-1 min-w-[300px]">
					<div className="flex items-center gap-3 mb-2">
						<FileText className="h-8 w-8 text-primary" />
						<h1 className="text-3xl font-bold">Work Input</h1>
						{editingEntryId && (
							<span className="text-xs font-medium px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
								Editing Mode
							</span>
						)}
					</div>
					<p className="text-sm text-neutral-600 dark:text-neutral-400">
						Document your work, link to projects/OKRs, and track your progress
					</p>
					
					{/* Progress Indicator */}
					{!editingEntryId && (
						<div className="mt-4 space-y-2">
							<div className="flex items-center justify-between text-xs">
								<div className="flex items-center gap-4">
									<span className="text-neutral-600 dark:text-neutral-400">
										Required: <span className="font-bold text-primary">{requiredFieldsFilled}/{totalRequiredFields}</span>
									</span>
									<span className="text-neutral-600 dark:text-neutral-400">
										Optional: <span className="font-bold">{optionalFieldsFilled}/{totalOptionalFields}</span>
									</span>
								</div>
								<span className="font-bold text-sm text-primary">{overallProgress}%</span>
							</div>
							<div className="relative w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
								<div
									className="absolute top-0 left-0 h-full bg-linear-to-r from-primary to-primary/60 transition-all duration-300"
									style={{ width: `${overallProgress}%` }}
								/>
							</div>
						</div>
					)}
					
					{/* Auto-save Status */}
					<div className="mt-3 flex items-center gap-2 text-xs">
						{autoSaveStatus === 'saving' && (
							<span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
								<RefreshCw className="h-3 w-3 animate-spin" />
								Saving...
							</span>
						)}
						{autoSaveStatus === 'saved' && (
							<span className="flex items-center gap-1 text-green-600 dark:text-green-400">
								<CheckCircle2 className="h-3 w-3" />
								Saved
							</span>
						)}
						{lastAutoSave && autoSaveStatus === 'idle' && (
							<span className="text-neutral-500">
								Last saved: {lastAutoSave.toLocaleTimeString()}
							</span>
						)}
						<span className="text-neutral-400">•</span>
						<span className="text-neutral-500">
							Shortcuts: Ctrl+S (Save) | Ctrl+Enter (Submit)
						</span>
					</div>
				</div>
				
				{/* Action Buttons */}
				<div className="flex items-center gap-2 flex-wrap">
					<Button 
						variant="outline" 
						onClick={saveDraft}
						className="flex items-center gap-2"
					>
						<Save className="h-4 w-4" />
						Save Draft
					</Button>
					<Button 
						variant="outline" 
						onClick={() => setShowDraftsDialog(true)}
						className="flex items-center gap-2"
					>
						<FolderOpen className="h-4 w-4" />
						Drafts {drafts.length > 0 && `(${drafts.length})`}
					</Button>
					<Button 
						variant="outline" 
						onClick={() => setShowDecisionDialog(true)}
						className="flex items-center gap-2 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/20"
					>
						<AlertCircle className="h-4 w-4" />
						Decision Issue
					</Button>
					<Button onClick={handleSubmit} className="flex items-center gap-2">
						<Send className="h-4 w-4" />
						Submit
					</Button>
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				{/* Main Input Area - 2 columns */}
				<div className="lg:col-span-2 space-y-6">
					{/* Basic Information */}
					<Card>
						<CardHeader className="border-b border-neutral-200 dark:border-neutral-800">
							<h2 className="text-lg font-bold flex items-center gap-2">
								<FileText className="h-5 w-5 text-primary" />
								Basic Information
								<span className="text-xs font-normal text-red-500">* Required</span>
							</h2>
						</CardHeader>
						<CardContent className="p-6 space-y-5">
							{/* Title */}
							<div>
								<label className="block text-sm font-semibold mb-2">
									Title <span className="text-red-500">*</span>
								</label>
								<Input
									type="text"
									placeholder="e.g., Completed user authentication feature"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									className="text-base"
								/>
							</div>

							{/* Description */}
							<div>
								<label className="block text-sm font-semibold mb-2">
									Description <span className="text-red-500">*</span>
								</label>
								<Textarea
									placeholder="Describe what you worked on, challenges faced, and outcomes achieved..."
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									rows={6}
									className="text-sm"
								/>
								<p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
									<Info className="h-3 w-3" />
									Be specific about your work, decisions made, and results
								</p>
							</div>

					{/* Status & Duration */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-semibold mb-2">
								<Calendar className="inline h-4 w-4 mr-1" />
								Status
							</label>
							<select
								value={showCustomCategory ? 'other' : category}
								onChange={(e) => {
									const value = e.target.value
									if (value === 'other') {
										setShowCustomCategory(true)
										setCategory('other')
									} else {
										setShowCustomCategory(false)
										setCategory(value)
										setCustomCategory('')
									}
								}}
								className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900"
							>
								<option value="">Select status</option>
								{categories.map((cat) => (
									<option key={cat.id} value={cat.id}>
										{cat.name}
									</option>
								))}
							</select>
							{showCustomCategory && (
								<Input
									type="text"
									placeholder="Enter custom status name"
									value={customCategory}
									onChange={(e) => setCustomCategory(e.target.value)}
									className="mt-2"
								/>
							)}
						</div>

								<div>
									<label className="block text-sm font-semibold mb-2">
										<Clock className="inline h-4 w-4 mr-1" />
										Duration
									</label>
									<select
										value={showCustomDuration ? 'custom' : duration}
										onChange={(e) => handleDurationChange(e.target.value)}
										className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900"
									>
										<option value="">Select duration</option>
										<option value="15m">15 minutes</option>
										<option value="30m">30 minutes</option>
										<option value="1h">1 hour</option>
										<option value="2h">2 hours</option>
										<option value="4h">4 hours</option>
										<option value="1d">1 day</option>
										<option value="2d">2 days</option>
										<option value="1w">1 week</option>
										<option value="custom">Custom (Enter manually)</option>
									</select>
									{showCustomDuration && (
										<Input
											type="text"
											placeholder="e.g., 3h 30m, 2.5 hours, 90 minutes"
											value={customDuration}
											onChange={(e) => setCustomDuration(e.target.value)}
											className="mt-2"
										/>
									)}
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Links & Connections */}
					<Card>
						<CardHeader className="border-b border-neutral-200 dark:border-neutral-800">
							<h2 className="text-lg font-bold flex items-center gap-2">
								<Target className="h-5 w-5 text-primary" />
								Links & Connections
								<span className="text-xs font-normal text-neutral-500">Optional</span>
							</h2>
						</CardHeader>
						<CardContent className="p-6 space-y-5">
							{/* Project */}
							<div>
								<label className="block text-sm font-semibold mb-2">
									<FolderKanban className="inline h-4 w-4 mr-1" />
									Related Project
								</label>
								<select
									value={selectedProject}
									onChange={(e) => {
										setSelectedProject(e.target.value)
										updateRecentItems('project', e.target.value)
									}}
									className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900"
								>
									<option value="">Not related to any project</option>
									
									{/* Recent Projects */}
									{recentProjects.length > 0 && projects.filter(p => recentProjects.includes(p.id)).length > 0 && (
										<>
											<optgroup label="Recent">
												{recentProjects
													.map(id => projects.find(p => p.id === id))
													.filter(Boolean)
													.map((project) => (
														<option key={project!.id} value={project!.id}>
															{project!.name} ({project!.status === 'active' ? 'Active' : 'Planning'})
														</option>
													))}
											</optgroup>
											<optgroup label="All Projects">
												{projects
													.filter(p => !recentProjects.includes(p.id))
													.map((project) => (
														<option key={project.id} value={project.id}>
															{project.name} ({project.status === 'active' ? 'Active' : 'Planning'})
														</option>
													))}
											</optgroup>
										</>
									)}
									
									{/* All Projects */}
									{(recentProjects.length === 0 || projects.filter(p => recentProjects.includes(p.id)).length === 0) && (
										projects.map((project) => (
											<option key={project.id} value={project.id}>
												{project.name} ({project.status === 'active' ? 'Active' : 'Planning'})
											</option>
										))
									)}
								</select>
								{selectedProject && (
									<p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
										<CheckCircle2 className="h-3 w-3" />
										This work will be linked to the selected project
									</p>
								)}
							</div>

							{/* OKR - Objective & Key Result */}
							<div className="space-y-4 p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border border-neutral-200 dark:border-neutral-800">
								<div className="flex items-center gap-2 text-sm font-semibold text-primary">
									<Target className="h-4 w-4" />
									OKR Progress Update
								</div>
								
								{/* Objective */}
								<div>
									<label className="block text-xs font-semibold mb-2">
										Related Objective
									</label>
									<select
										value={selectedObjective}
										onChange={(e) => {
											setSelectedObjective(e.target.value)
											setSelectedKeyResult('')
											setKeyResultProgress('')
											updateRecentItems('objective', e.target.value)
										}}
										className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900"
									>
										<option value="">Not related to any objective</option>
										{objectives.length === 0 ? (
											<option disabled>No objectives available</option>
										) : (
											objectives.map((obj) => {
												const progress = obj.keyResults.length > 0
													? Math.round(obj.keyResults.reduce((sum, kr) => sum + (kr.current / kr.target) * 100, 0) / obj.keyResults.length)
													: 0
												return (
													<option key={obj.id} value={obj.id}>
														{obj.title} ({obj.quarter}) - {progress}%
													</option>
												)
											})
										)}
									</select>
								</div>

								{/* Key Result */}
								{selectedObjective && (
									<>
										<div>
											<label className="block text-xs font-semibold mb-2">
												Key Result to Update
											</label>
											<select
												value={selectedKeyResult}
												onChange={(e) => setSelectedKeyResult(e.target.value)}
												className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900"
											>
												<option value="">Select a key result</option>
												{objectives
													.find((obj) => obj.id === selectedObjective)
													?.keyResults.map((kr) => (
														<option key={kr.id} value={kr.id}>
															{kr.description} (Current: {kr.current}/{kr.target} {kr.unit})
														</option>
													))}
											</select>
										</div>

										{/* Progress Input */}
										{selectedKeyResult && (
											<div>
												<label className="block text-xs font-semibold mb-2">
													<TrendingUp className="inline h-3 w-3 mr-1" />
													Update Progress
												</label>
												<Input
													type="number"
													placeholder={`Current: ${objectives.find(o => o.id === selectedObjective)?.keyResults.find(kr => kr.id === selectedKeyResult)?.current || 0}`}
													value={keyResultProgress}
													onChange={(e) => setKeyResultProgress(e.target.value)}
													className="text-sm"
												/>
												<p className="text-xs text-neutral-500 mt-1">
													Enter the new progress value for this key result
												</p>
											</div>
										)}
									</>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Resources & Attachments */}
					<Card>
						<CardHeader className="border-b border-neutral-200 dark:border-neutral-800">
							<h2 className="text-lg font-bold flex items-center gap-2">
								<Upload className="h-5 w-5 text-primary" />
								Resources & Attachments
								<span className="text-xs font-normal text-neutral-500">Optional</span>
							</h2>
						</CardHeader>
						<CardContent className="p-6 space-y-5">
							{/* Linked Resources */}
							<div>
								<label className="block text-sm font-semibold mb-2">
									<Link2 className="inline h-4 w-4 mr-1" />
									Linked Resources
								</label>
								
								{/* Display Links */}
								{links.length > 0 && (
									<div className="space-y-2 mb-3">
										{links.map((link) => (
											<div
												key={link.id}
												className="flex items-center gap-2 p-3 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl border border-neutral-200 dark:border-neutral-800"
											>
												<Link2 className="h-4 w-4 text-primary shrink-0" />
												<a
													href={link.url}
													target="_blank"
													rel="noopener noreferrer"
													className="flex-1 text-sm text-primary hover:underline truncate"
												>
													{link.title}
												</a>
												<button
													onClick={() => removeLink(link.id)}
													className="text-neutral-400 hover:text-red-500 shrink-0"
												>
													<X className="h-4 w-4" />
												</button>
											</div>
										))}
									</div>
								)}

								{/* Add Link */}
								<div className="flex items-center gap-2">
									<Input
										type="url"
										placeholder="https://example.com/resource"
										value={linkInput}
										onChange={(e) => setLinkInput(e.target.value)}
										onKeyDown={(e) => e.key === 'Enter' && addLink()}
										className="flex-1"
									/>
									<Button onClick={addLink} variant="outline">
										<Plus className="h-4 w-4" />
									</Button>
								</div>
							</div>

							{/* Tags */}
							<div>
								<label className="block text-sm font-semibold mb-2">
									<Tag className="inline h-4 w-4 mr-1" />
									Tags
								</label>
								
								{/* Display Tags */}
								{tags.length > 0 && (
									<div className="flex flex-wrap gap-2 mb-3">
										{tags.map((tag) => (
											<span
												key={tag}
												className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
											>
												{tag}
												<button onClick={() => removeTag(tag)} className="hover:text-red-500">
													<X className="h-3 w-3" />
												</button>
											</span>
										))}
									</div>
								)}

								{/* Add Tag */}
								<div className="flex items-center gap-2">
									<Input
										placeholder="Add tags (press Enter) or @mention someone"
										value={tagInput}
										onChange={(e) => setTagInput(e.target.value)}
										onKeyDown={handleTagInputKeyDown}
										className="flex-1"
									/>
									<Button onClick={addTag} variant="outline">
										<Plus className="h-4 w-4" />
									</Button>
								</div>
								<p className="text-xs text-neutral-500 mt-1">
									Press Enter or comma to add tags
								</p>
							</div>

							{/* File Upload */}
							<div>
								<label className="block text-sm font-semibold mb-2">
									<Upload className="inline h-4 w-4 mr-1" />
									File Attachments
								</label>
								
								{/* Display Files */}
								{files.length > 0 && (
									<div className="space-y-2 mb-3">
										{files.map((file) => (
											<div
												key={file.id}
												className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl border border-neutral-200 dark:border-neutral-800"
											>
												{getFileIcon(file.type)}
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium truncate">{file.name}</p>
													<p className="text-xs text-neutral-500">{formatFileSize(file.size)}</p>
												</div>
												<button
													onClick={() => removeFile(file.id)}
													className="text-neutral-400 hover:text-red-500 shrink-0"
												>
													<X className="h-4 w-4" />
												</button>
											</div>
										))}
									</div>
								)}

								{/* Drag & Drop Zone */}
								<div
									onDragOver={handleDragOver}
									onDragLeave={handleDragLeave}
									onDrop={handleDrop}
									className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
										isDragging
											? 'border-primary bg-primary/5 scale-[1.02]'
											: 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600'
									}`}
								>
									<input
										ref={fileInputRef}
										type="file"
										multiple
										onChange={handleFileSelect}
										className="hidden"
									/>
									<Upload className={`h-8 w-8 mx-auto mb-2 transition-colors ${
										isDragging ? 'text-primary' : 'text-neutral-400'
									}`} />
									<p className="text-sm font-medium mb-1">
										{isDragging ? 'Drop files here' : 'Drag & drop files here'}
									</p>
									<p className="text-xs text-neutral-500 mb-3">
										or click the button below to browse
									</p>
									<Button
										variant="outline"
										onClick={() => fileInputRef.current?.click()}
										className="w-full"
									>
										<Upload className="h-4 w-4 mr-2" />
										Browse Files
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Security */}
					<Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10">
						<CardContent className="p-4">
							<label className="flex items-start gap-3 cursor-pointer">
								<input
									type="checkbox"
									id="confidential-checkbox"
									checked={isConfidential}
									onChange={(e) => setIsConfidential(e.target.checked)}
									className="mt-1"
								/>
								<div>
									<div className="flex items-center gap-2 font-semibold text-amber-900 dark:text-amber-100 mb-1">
										<ShieldCheck className="h-4 w-4" />
										Confidential
									</div>
									<p className="text-xs text-amber-800 dark:text-amber-200">
										This work entry contains sensitive or confidential information. Access will be restricted.
									</p>
								</div>
							</label>
						</CardContent>
					</Card>

					{/* Async Discussion (NoMeet) */}
					{category === 'async-discussion' && (
						<Card className="border-pink-200 dark:border-pink-800 bg-pink-50/50 dark:bg-pink-900/10">
							<CardHeader className="border-b border-pink-200 dark:border-pink-800">
								<h2 className="text-lg font-bold flex items-center gap-2">
									<Calendar className="h-5 w-5 text-pink-600 dark:text-pink-400" />
									Async Discussion (NoMeet)
									<span className="text-xs font-normal text-neutral-500">Replace synchronous meetings</span>
								</h2>
							</CardHeader>
							<CardContent className="p-6 space-y-5">
								<p className="text-sm text-pink-800 dark:text-pink-200">
									This structured async discussion enables decision-making without meetings. Provide context, gather feedback, and reach decisions asynchronously.
								</p>

								{/* Agenda */}
								<div>
									<label className="block text-sm font-semibold mb-2">
										Discussion Agenda
									</label>
									<Textarea
										placeholder="Describe what needs to be discussed and decided..."
										value={asyncAgenda}
										onChange={(e) => setAsyncAgenda(e.target.value)}
										rows={4}
										className="w-full"
									/>
									<p className="text-xs text-neutral-500 mt-1">
										Clearly outline the topic, context, and decision points
									</p>
								</div>

								{/* AI Briefing */}
								<div className="p-4 bg-white dark:bg-neutral-900 rounded-xl border border-pink-200 dark:border-pink-800">
									<div className="flex items-center justify-between mb-3">
										<label className="block text-sm font-semibold">
											AI Briefing
										</label>
										<Button
											size="sm"
											onClick={() => {
												setAsyncBriefing('AI-generated summary:\n\n• Key points extracted from agenda\n• Relevant historical decisions\n• Recommended decision framework\n• Estimated timeline for consensus\n\n(This is a mock AI briefing)')
												toast.success('AI Briefing generated')
											}}
											className="h-8"
										>
											<Sparkles className="h-3 w-3 mr-1" />
											Generate Briefing
										</Button>
									</div>
									{asyncBriefing ? (
										<Textarea
											value={asyncBriefing}
											onChange={(e) => setAsyncBriefing(e.target.value)}
											rows={6}
											className="w-full text-sm"
										/>
									) : (
										<p className="text-sm text-neutral-500 italic">
											Click "Generate Briefing" to create an AI summary of key points and recommendations
										</p>
									)}
								</div>

								{/* Decision Status */}
								<div>
									<label className="block text-sm font-semibold mb-2">
										Decision Status
									</label>
									<select
										value={asyncDecisionStatus}
										onChange={(e) => setAsyncDecisionStatus(e.target.value as 'pending' | 'approved' | 'escalated')}
										className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900"
									>
										<option value="pending">Pending - Awaiting feedback</option>
										<option value="approved">Approved - Decision reached</option>
										<option value="escalated">Escalated - Needs leadership review</option>
									</select>
								</div>

								{/* Quick Actions */}
								<div className="flex gap-2 pt-2">
									<Button
										variant="outline"
										onClick={() => {
											toast.success('Shared to team (mock)')
										}}
										className="flex-1"
									>
										<Send className="h-4 w-4 mr-2" />
										Share to Team
									</Button>
									<Button
										variant="outline"
										onClick={() => {
											toast.success('Reminder set (mock)')
										}}
										className="flex-1"
									>
										<Clock className="h-4 w-4 mr-2" />
										Set Reminder
									</Button>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Bottom Submit Button */}
					<div className="flex items-center gap-3 pt-4">
						<Button onClick={saveDraft} variant="outline" className="flex-1 h-12">
							<Save className="h-4 w-4 mr-2" />
							Save Draft
						</Button>
						<Button onClick={handleSubmit} className="flex-1 h-12">
							<Send className="h-4 w-4 mr-2" />
							Submit Work Entry
						</Button>
					</div>
				</div>

				{/* Sidebar - 1 column */}
				<div className="space-y-6">
					{/* AI Suggestions */}
					<Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
						<CardContent className="p-4">
							<h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2 text-sm flex items-center gap-2">
								<Sparkles className="h-4 w-4" />
								AI Suggestion
							</h3>
							<p className="text-xs text-blue-800 dark:text-blue-200 mb-3">
								Based on your input, consider including:
							</p>
							<ul className="space-y-1 text-xs text-blue-800 dark:text-blue-200">
								<li className="flex items-start gap-2">
									<span className="text-blue-500">•</span>
									<span>Specific metrics or KPIs affected</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-blue-500">•</span>
									<span>Collaboration with team members</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-blue-500">•</span>
									<span>Next steps or follow-up tasks</span>
								</li>
							</ul>
						</CardContent>
					</Card>

					{/* Tips */}
					<Card className="border-neutral-200 dark:border-neutral-800">
						<CardHeader>
							<h2 className="text-sm font-bold flex items-center gap-2">
								<Info className="h-4 w-4 text-primary" />
								Tips for Better Documentation
							</h2>
						</CardHeader>
						<CardContent>
							<ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
								<li className="flex items-start gap-2">
									<CheckCircle2 className="h-3 w-3 text-green-600 shrink-0 mt-0.5" />
									<span>Use clear, descriptive titles</span>
								</li>
								<li className="flex items-start gap-2">
									<CheckCircle2 className="h-3 w-3 text-green-600 shrink-0 mt-0.5" />
									<span>Include context and background</span>
								</li>
								<li className="flex items-start gap-2">
									<CheckCircle2 className="h-3 w-3 text-green-600 shrink-0 mt-0.5" />
									<span>Link to related projects and OKRs</span>
								</li>
								<li className="flex items-start gap-2">
									<CheckCircle2 className="h-3 w-3 text-green-600 shrink-0 mt-0.5" />
									<span>Attach relevant files and resources</span>
								</li>
								<li className="flex items-start gap-2">
									<CheckCircle2 className="h-3 w-3 text-green-600 shrink-0 mt-0.5" />
									<span>Tag team members for visibility</span>
								</li>
							</ul>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Drafts Dialog */}
			{showDraftsDialog && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
					<Card className="w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
						<CardHeader className="border-b border-neutral-200 dark:border-neutral-800">
							<div className="flex items-center justify-between">
								<h3 className="text-xl font-bold flex items-center gap-2">
									<FolderOpen className="h-6 w-6 text-primary" />
									Saved Drafts
								</h3>
								<button
									onClick={() => setShowDraftsDialog(false)}
									className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
								>
									<X className="h-6 w-6" />
								</button>
							</div>
						</CardHeader>
						<CardContent className="p-6 overflow-y-auto flex-1">
							{drafts.length === 0 ? (
								<div className="text-center py-12">
									<FolderOpen className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
									<h3 className="text-lg font-bold mb-2">No Drafts Yet</h3>
									<p className="text-sm text-neutral-600 dark:text-neutral-400">
										Drafts will be automatically saved as you type
									</p>
								</div>
							) : (
								<div className="space-y-3">
									{drafts.map((draft) => (
										<div
											key={draft.id}
											className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-2xl hover:border-primary dark:hover:border-primary transition-colors"
										>
											<div className="flex items-start justify-between gap-4 mb-2">
												<div className="flex-1 min-w-0">
													<h4 className="font-semibold text-sm truncate">{draft.title}</h4>
													<p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
														Saved: {new Date(draft.savedAt).toLocaleString()}
													</p>
												</div>
												<div className="flex items-center gap-2 shrink-0">
													<Button
														variant="outline"
														size="sm"
														onClick={() => loadDraft(draft)}
													>
														Load
													</Button>
													<Button
														variant="outline"
														size="sm"
														onClick={() => deleteDraft(draft.id)}
														className="text-red-600 hover:text-red-700"
													>
														<X className="h-4 w-4" />
													</Button>
												</div>
											</div>
											{draft.description && (
												<p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
													{draft.description}
												</p>
											)}
											{draft.tags && draft.tags.length > 0 && (
												<div className="flex flex-wrap gap-1 mt-2">
													{draft.tags.slice(0, 3).map((tag) => (
														<span
															key={tag}
															className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-xs"
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
			)}

			{/* Decision Issue Dialog */}
			{showDecisionDialog && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
					<Card className="w-full max-w-2xl">
						<CardHeader className="border-b border-neutral-200 dark:border-neutral-800">
							<div className="flex items-center justify-between">
								<h3 className="text-xl font-bold flex items-center gap-2">
									<AlertCircle className="h-6 w-6 text-orange-600" />
									Create Decision Issue
								</h3>
								<button
									onClick={() => setShowDecisionDialog(false)}
									className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
								>
									<X className="h-6 w-6" />
								</button>
							</div>
						</CardHeader>
						<CardContent className="p-6">
							<div className="space-y-4">
								<p className="text-sm text-neutral-600 dark:text-neutral-400">
									Document important decisions that need to be made or have been made during your work.
								</p>
								<div>
									<label className="block text-sm font-semibold mb-2">Issue Title *</label>
									<Input placeholder="e.g., Choose authentication method" />
								</div>
								<div>
									<label className="block text-sm font-semibold mb-2">Description *</label>
									<Textarea
										placeholder="Describe the decision that needs to be made..."
										rows={4}
									/>
								</div>
								<div>
									<label className="block text-sm font-semibold mb-2">Decision Needed</label>
									<Input placeholder="What specific decision needs to be made?" />
								</div>
								<div className="flex items-center gap-2 pt-4">
									<Button className="flex-1">
										<Save className="h-4 w-4 mr-2" />
										Create Issue
									</Button>
									<Button variant="outline" onClick={() => setShowDecisionDialog(false)}>
										Cancel
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			)}
			</div>
		</>
	)
}
