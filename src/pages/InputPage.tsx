import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import { useAuth } from '../context/AuthContext'
import { PageHeader } from '../components/common/PageHeader'
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
	Target,
	RefreshCw,
	Clock,
	Info,
	Wand2,
	Loader2,
	ChevronDown,
	ChevronUp
} from 'lucide-react'
import { toast } from 'sonner'
import { initializeMockDrafts } from './_mocks/workInputDrafts'
import { initializeMockWorkCategories } from './_mocks/workCategories'
import { initializeMockTeamMembers } from './_mocks/teamMembers'
import type { 
	WorkEntry,
	FileAttachment,
	LinkResource,
	WorkDraft,
	Project,
	WorkCategory
} from '../types/common.types'
import { DraftsDialog } from '../components/input/DraftsDialog'
import { DecisionDialog } from '../components/input/DecisionDialog'

// Task interface
interface AssignedTask {
	id: string
	title: string
	description: string
	priority: 'high' | 'medium' | 'low'
	category: string
	projectId?: string
	projectName?: string
	assignedTo?: string
	deadline?: string
}

export default function InputPage() {
	const { user } = useAuth()
	
	// Task Progress Mode State
	const [inputMode, setInputMode] = useState<'free' | 'task' | 'ai-draft'>('free') // 'free', 'task', or 'ai-draft'
	const [selectedTask, setSelectedTask] = useState<string>('')
	const [assignedTasks, setAssignedTasks] = useState<AssignedTask[]>([])
	const [taskProgress, setTaskProgress] = useState<number>(0)
	const [progressComment, setProgressComment] = useState('')
	
	// AI Draft State
	const [aiDraftInput, setAiDraftInput] = useState('')
	const [isAiProcessing, setIsAiProcessing] = useState(false)
	
	// Form State
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [category, setCategory] = useState('')
	const [customCategory, setCustomCategory] = useState('')
	const [showCustomCategory, setShowCustomCategory] = useState(false)
	const [selectedProject, setSelectedProject] = useState('')
	const [tags, setTags] = useState<string[]>([])
	const [tagInput, setTagInput] = useState('')
	const [comment, setComment] = useState('')
	const [files, setFiles] = useState<FileAttachment[]>([])
	const [links, setLinks] = useState<LinkResource[]>([])
	const [linkInput, setLinkInput] = useState('')
	const [isConfidential, setIsConfidential] = useState(false)
	
	// Review Request State
	const [selectedReviewer, setSelectedReviewer] = useState('')
	const [reviewers, setReviewers] = useState<any[]>([])
	
	// NoMeet (Async Discussion) State
	const [asyncAgenda, setAsyncAgenda] = useState('')
	const [asyncBriefing, setAsyncBriefing] = useState('')
	const [asyncDecisionStatus, setAsyncDecisionStatus] = useState<'pending' | 'approved' | 'escalated'>('pending')
	
	// Data State
	const [projects, setProjects] = useState<Project[]>([])
	const [categories, setCategories] = useState<WorkCategory[]>([])
	const [drafts, setDrafts] = useState<WorkDraft[]>([])
	const [recentProjects, setRecentProjects] = useState<string[]>([])
	
	// UI State
	const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
	const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null)
	const [showDraftsDialog, setShowDraftsDialog] = useState(false)
	const [showDecisionDialog, setShowDecisionDialog] = useState(false)
	const [showAiSuggestions, setShowAiSuggestions] = useState(false)
	const [showTips, setShowTips] = useState(false)
	const [editingEntryId, setEditingEntryId] = useState<string | null>(null)
	const [isDragging, setIsDragging] = useState(false)
	
	// Refs
	const fileInputRef = useRef<HTMLInputElement>(null)

	// Load assigned tasks
	useEffect(() => {
		const loadAssignedTasks = () => {
			const manualTasks = localStorage.getItem('manual_tasks')
			const aiTasks = localStorage.getItem('ai_recommendations')
			
			let tasks: AssignedTask[] = []
			
			// Load manual tasks
			if (manualTasks) {
				const parsedManual = JSON.parse(manualTasks)
				tasks = [...tasks, ...parsedManual.filter((t: any) => 
					t.status === 'pending' && t.assignedToId // Only pending tasks assigned to someone
				)]
			}
			
			// Load AI tasks  
			if (aiTasks) {
				const parsedAI = JSON.parse(aiTasks)
				tasks = [...tasks, ...parsedAI.filter((t: any) => t.status === 'pending')]
			}
			
			// Add mock tasks if no tasks are loaded
			if (tasks.length === 0) {
				const mockTasks: AssignedTask[] = [
					{
						id: 'mock-task-1',
						title: 'Implement User Authentication System',
						description: 'Build a comprehensive user authentication module with JWT tokens, social login (Google, GitHub), password reset flow, and session management. Include security features like rate limiting and CSRF protection.',
						priority: 'high',
						category: 'development',
						projectId: 'proj-2',
						projectName: 'Mobile App Development',
						assignedTo: 'Current User',
						deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
					},
					// ... other mock tasks
				]
				tasks = mockTasks
			}
			
			setAssignedTasks(tasks)
		}
		
		loadAssignedTasks()
	}, [])
	
	// Handle task selection
	const handleTaskSelection = (taskId: string) => {
		setSelectedTask(taskId)
		
		if (taskId) {
			const task = assignedTasks.find(t => t.id === taskId)
			if (task) {
				setTitle(task.title)
				setDescription(task.description)
				setCategory(task.category)
				if (task.projectId) {
					setSelectedProject(task.projectId)
				}
			}
		} else {
			// Clear when unselected
			if (inputMode === 'task') {
				setTitle('')
				setDescription('')
			}
		}
	}
	
	// Initialize data
	useEffect(() => {
		try {
			// Load projects
			const savedProjects = localStorage.getItem('projects')
			if (savedProjects) {
				setProjects(JSON.parse(savedProjects))
			} else {
				setProjects([
					// Mock projects will be loaded from types or handled properly later
				] as any)
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
				// Load again after initialization
				const initializedMembers = localStorage.getItem('teamMembers')
				if (initializedMembers) {
					const members = JSON.parse(initializedMembers)
					// Filter out current user if needed, or just set all
					setReviewers(members.filter((m: any) => m.id !== user?.id))
				}
			} else {
				const members = JSON.parse(savedTeamMembers)
				setReviewers(members.filter((m: any) => m.id !== user?.id))
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
					setComment(data.comment || '')
					setTags(data.tags || [])
					setFiles(data.files || [])
					setLinks(data.links || [])
					setIsConfidential(data.isConfidential || false)
					
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
			
			if (savedRecentProjects) {
				setRecentProjects(JSON.parse(savedRecentProjects))
			}
		} catch (error) {
			console.error('Failed to load recent items:', error)
		}
	}
	
	// Update recent items
	const updateRecentItems = (type: 'project', id: string) => {
		if (!id) return
		
		try {
			if (type === 'project') {
				const updated = [id, ...recentProjects.filter(p => p !== id)].slice(0, 5)
				setRecentProjects(updated)
				localStorage.setItem('recentProjects', JSON.stringify(updated))
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
			
			const autoDraft: WorkDraft = {
				id: 'auto-save',
				title: title || 'Untitled',
				description,
				category: finalCategory,
				projectId: selectedProject || undefined,
				tags,
				files,
				links,
				isConfidential,
				savedAt: new Date(),
			}
			
			try {
				const existingDrafts = localStorage.getItem('workInputDrafts')
				let draftsList = existingDrafts ? JSON.parse(existingDrafts) : []
				
				draftsList = draftsList.filter((d: WorkDraft) => d.id !== 'auto-save')
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
	}, [title, description, category, customCategory, showCustomCategory, selectedProject, tags, files, links, isConfidential, editingEntryId])

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
		const newFiles: FileAttachment[] = selectedFiles.map((file) => ({
			id: `file-${Date.now()}-${Math.random()}`,
			name: file.name,
			size: file.size,
			type: file.type,
			url: URL.createObjectURL(file),
			uploadedAt: new Date(),
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
		const newFiles: FileAttachment[] = droppedFiles.map((file) => ({
			id: `file-${Date.now()}-${Math.random()}`,
			name: file.name,
			size: file.size,
			type: file.type,
			url: URL.createObjectURL(file),
			uploadedAt: new Date(),
		}))
		setFiles([...files, ...newFiles])
		toast.success(`${droppedFiles.length} file(s) uploaded`)
	}

	// Link handling
	const addLink = () => {
		if (!linkInput.trim()) return
		
		const newLink: LinkResource = {
			id: `link-${Date.now()}`,
			title: linkInput.trim(),
			url: linkInput.trim(),
			addedAt: new Date(),
		}
		setLinks([...links, newLink])
		setLinkInput('')
		toast.success('Link added')
	}

	const removeLink = (id: string) => {
		setLinks(links.filter((l) => l.id !== id))
		toast.info('Link removed')
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

		const draft: WorkDraft = {
			id: editingEntryId || `draft-${Date.now()}`,
			title: title || 'Untitled',
			description,
			category: finalCategory,
			projectId: selectedProject || undefined,
			tags,
			files,
			links,
			isConfidential,
			savedAt: new Date(),
			comment,
		}

		try {
			const existingDrafts = localStorage.getItem('workInputDrafts')
			let draftsList = existingDrafts ? JSON.parse(existingDrafts) : []
			
			draftsList = draftsList.filter((d: WorkDraft) => d.id !== draft.id && d.id !== 'auto-save')
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
	const loadDraft = (draft: WorkDraft) => {
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
		setTags(draft.tags || [])
		setFiles(draft.files || [])
		setLinks(draft.links || [])
		setIsConfidential(draft.isConfidential || false)
		
		setComment(draft.comment || '')
		
		setShowDraftsDialog(false)
		toast.success('Draft loaded')
	}

	// Delete draft
	const deleteDraft = (id: string) => {
		try {
			const existingDrafts = localStorage.getItem('workInputDrafts')
			let draftsList = existingDrafts ? JSON.parse(existingDrafts) : []
			
			draftsList = draftsList.filter((d: WorkDraft) => d.id !== id)
			
			localStorage.setItem('workInputDrafts', JSON.stringify(draftsList))
			setDrafts(draftsList)
			toast.info('Draft deleted')
		} catch (error) {
			console.error('Failed to delete draft:', error)
			toast.error('Failed to delete draft')
		}
	}

	// AI Draft Process (Mock Logic)
	const handleAiProcess = () => {
		if (!aiDraftInput.trim()) return

		setIsAiProcessing(true)

		// Mock AI processing delay
		setTimeout(() => {
			const text = aiDraftInput.toLowerCase()
			let detectedCategory = 'general'
			const detectedTags = ['ai-generated']
			let detectedTitle = 'New Work Entry'
			let detectedProject = ''

			// Simple keyword analysis
			if (text.includes('meeting') || text.includes('discussion') || text.includes('sync')) {
				detectedCategory = 'meeting'
				detectedTitle = 'Team Sync & Discussion'
				detectedTags.push('communication')
			} else if (text.includes('fix') || text.includes('bug') || text.includes('error')) {
				detectedCategory = 'development'
				detectedTitle = 'Bug Fix Implementation'
				detectedTags.push('maintenance')
				if (projects.length > 0) detectedProject = projects[0].id
			} else if (text.includes('design') || text.includes('ui') || text.includes('ux')) {
				detectedCategory = 'design'
				detectedTitle = 'UI/UX Design Update'
				detectedTags.push('creative')
			}

			// Fill form
			setTitle(detectedTitle)
			setDescription(aiDraftInput + "\n\n(✨ Organized by AI)")
			setCategory(detectedCategory)
			if (detectedProject) setSelectedProject(detectedProject)
			setTags(prev => [...new Set([...prev, ...detectedTags])])
			
			// Switch mode and notify
			setInputMode('free')
			setAiDraftInput('')
			setIsAiProcessing(false)
			
			toast.success('AI has organized your work!', {
				description: 'Review the details and submit.',
				icon: <Sparkles className="h-4 w-4 text-amber-500" />,
			})
		}, 1500)
	}

	// Clear form
	const clearForm = () => {
		setTitle('')
		setDescription('')
		setCategory('')
		setCustomCategory('')
		setShowCustomCategory(false)
		setSelectedProject('')
		setTags([])
		setComment('')
		setFiles([])
		setLinks([])
		setIsConfidential(false)
		setEditingEntryId(null)
		
		// Clear task progress state
		setInputMode('free')
		setSelectedTask('')
		setTaskProgress(0)
		setProgressComment('')
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
		
		// Validate task mode requirements
		if (inputMode === 'task' && !selectedTask) {
			toast.error('Please select a task')
			return
		}
		
		// Validate custom status if "Other" is selected
		if (showCustomCategory && !customCategory.trim()) {
			toast.error('Please enter a custom status name')
			return
		}

		// Use custom category if "Other" is selected
		const finalCategory = showCustomCategory ? customCategory.trim() : category
		
		// Prepare description with progress comment
		let finalDescription = description.trim()
		if (inputMode === 'task' && selectedTask && progressComment) {
			finalDescription = `${description}\n\n📊 Progress Update (${taskProgress}%):\n${progressComment}`
		}

		// Append comment
		if (comment) {
			finalDescription = `💬 Comment: ${comment}\n\n${finalDescription}`
		}

	// Find project name if project is selected
	const projectName = selectedProject 
		? projects.find(p => p.id === selectedProject)?.name 
		: undefined
	
	// Find task info if in task mode
	const taskInfo = inputMode === 'task' && selectedTask
		? assignedTasks.find(t => t.id === selectedTask)
		: undefined
	
	const workEntry: WorkEntry = {
		id: editingEntryId || `work-${Date.now()}`,
		title: title.trim(),
		description: finalDescription,
		category: finalCategory,
		projectId: selectedProject || undefined,
		projectName: projectName,
		tags,
		date: new Date(),
		duration: '1h',
		files,
		links,
		status: 'submitted',
		isConfidential,
		// User information from AuthContext
		submittedBy: user?.name || 'Unknown User',
		submittedById: user?.id || '',
		department: user?.department || '',
		// Task ID if in task mode
		taskId: taskInfo?.id,
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
				
				// Update task progress if in task mode
				if (inputMode === 'task' && selectedTask) {
					const taskMessage = taskProgress === 100 ? 'Task completed!' : `Task progress updated to ${taskProgress}%`
					toast.success(taskMessage, {
						description: 'Work entry submitted with task progress',
					})
					
					// Update task status if completed
					if (taskProgress === 100) {
						// Update manual tasks
						const manualTasks = localStorage.getItem('manual_tasks')
						if (manualTasks) {
							const parsedManual = JSON.parse(manualTasks)
							const updatedManual = parsedManual.map((t: any) => 
								t.id === selectedTask ? { ...t, status: 'accepted' } : t
							)
							localStorage.setItem('manual_tasks', JSON.stringify(updatedManual))
						}
						
						// Update AI tasks
						const aiTasks = localStorage.getItem('ai_recommendations')
						if (aiTasks) {
							const parsedAI = JSON.parse(aiTasks)
							const updatedAI = parsedAI.map((t: any) =>
								t.id === selectedTask ? { ...t, status: 'accepted' } : t
							)
							localStorage.setItem('ai_recommendations', JSON.stringify(updatedAI))
						}
						
						// Send task completion notification to task creator
						const messages = localStorage.getItem('messages')
						const messagesList = messages ? JSON.parse(messages) : []
						messagesList.unshift({
							id: `msg-task-complete-${Date.now()}`,
							type: 'notification',
							subject: `Task Completed: ${taskInfo?.title}`,
							from: user?.name || 'Unknown User',
							fromDepartment: user?.department,
							preview: `${user?.name || 'Unknown User'} has completed the task`,
							content: `Task "${taskInfo?.title}" has been marked as complete.\n\n${progressComment ? `**Progress Comment:**\n${progressComment}\n\n` : ''}Check the work entry for more details.`,
							timestamp: new Date(),
							isRead: false,
							isStarred: false,
							relatedType: 'work',
							relatedId: workEntry.id,
							aiSummary: '✅ Task marked as complete',
						})
						localStorage.setItem('messages', JSON.stringify(messagesList))
					}
				} else {
					toast.success('Work entry submitted!')
				}
				
			// Send review request notification if reviewer is selected
			if (selectedReviewer && selectedProject && projectName) {
				const reviewer = reviewers.find(r => r.id === selectedReviewer)
				if (reviewer) {
					// Create pending review entry
					const pendingReviews = localStorage.getItem('pending_reviews')
					const reviewsList = pendingReviews ? JSON.parse(pendingReviews) : []
					reviewsList.push({
						id: `pending-review-${Date.now()}`,
						workEntryId: workEntry.id,
						workTitle: title,
						workDescription: description,
						projectId: selectedProject,
						projectName: projectName,
						submittedBy: user?.name || 'Unknown User',
						submittedById: user?.id,
						submittedByDepartment: user?.department,
						reviewerId: reviewer.id,
						reviewerName: reviewer.name,
						reviewerRole: reviewer.role,
						reviewerDepartment: reviewer.department,
						status: 'pending',
						submittedAt: new Date().toISOString(),
					})
					localStorage.setItem('pending_reviews', JSON.stringify(reviewsList))
					
					// Send message to reviewer
					const messages = localStorage.getItem('messages')
					const messagesList = messages ? JSON.parse(messages) : []
					messagesList.unshift({
						id: `msg-review-req-${Date.now()}`,
						type: 'approval',
						priority: 'medium',
						subject: `Review Request: ${title}`,
						from: user?.name || 'Unknown User',
						fromDepartment: user?.department,
						preview: `${user?.name} requests your review on "${title}"`,
						content: `Hi ${reviewer.name},\n\n${user?.name || 'Unknown User'} has requested your review on their work submission.\n\n**Project:** ${projectName}\n**Title:** ${title}\n**Description:**\n${description}\n\n${category ? `**Category:** ${category}\n` : ''}${tags.length > 0 ? `**Tags:** ${tags.join(', ')}\n` : ''}\n\nPlease review and provide feedback at your earliest convenience.\n\n---\nThis is a review request from the Work Input system.`,
						timestamp: new Date(),
						isRead: false,
						isStarred: false,
						relatedType: 'work',
						relatedId: workEntry.id,
						recipientId: reviewer.id,
						aiSummary: `${user?.name} requests your review on work for ${projectName}`,
					})
					localStorage.setItem('messages', JSON.stringify(messagesList))
					
					toast.success(`✅ Review request sent to ${reviewer.name}!`, {
						description: 'They will be notified to review your work',
					})
				}
			} else if (selectedProject && projectName && !selectedReviewer) {
				// Generic notification if no specific reviewer selected
				toast.info('Work linked to project', {
					description: 'Project team can view your work in Work History',
				})
			}
			}
			
			localStorage.setItem('workEntries', JSON.stringify(entriesList))

			// Remove auto-save draft
			const existingDrafts = localStorage.getItem('workInputDrafts')
			let draftsList = existingDrafts ? JSON.parse(existingDrafts) : []
			draftsList = draftsList.filter((d: WorkDraft) => d.id !== 'auto-save' && d.id !== editingEntryId)
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
	const optionalFields = [finalCategoryValue, selectedProject, comment, tags.length > 0]
	const requiredFieldsFilled = requiredFields.filter(Boolean).length
	const optionalFieldsFilled = optionalFields.filter(Boolean).length
	const totalRequiredFields = requiredFields.length
	const totalOptionalFields = optionalFields.length
	const overallProgress = Math.round(((requiredFieldsFilled + optionalFieldsFilled) / (totalRequiredFields + totalOptionalFields)) * 100)
	
	return (
		<div className="min-h-screen bg-neutral-50 dark:bg-background-dark text-neutral-900 dark:text-neutral-100">
			<div className="max-w-[1600px] mx-auto px-6 py-6 space-y-8">
			<PageHeader
				title={editingEntryId ? "Work Input" : "Work Input"}
				description={
					<>
						<span className="hidden sm:inline">Document your work, link to projects, and track your progress</span>
						<span className="sm:hidden">Document your work & progress</span>
					</>
				}
				actions={
					<>
						<Button 
							variant="outline" 
							onClick={saveDraft}
						>
							<Save className="h-4 w-4" />
							<span className="hidden sm:inline">Save Draft</span>
						</Button>
						<Button 
							variant="outline" 
							onClick={() => setShowDraftsDialog(true)}
						>
							<FolderOpen className="h-4 w-4" />
							<span className="hidden sm:inline">Drafts {drafts.length > 0 && `(${drafts.length})`}</span>
							<span className="sm:hidden">{drafts.length > 0 ? drafts.length : ''}</span>
						</Button>
						<Button 
							variant="outline" 
							onClick={() => setShowDecisionDialog(true)}
							className="text-orange-500 border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-400"
						>
							<AlertCircle className="h-4 w-4" />
							<span className="hidden sm:inline">Decision Issue</span>
						</Button>
						<Button variant="primary" onClick={handleSubmit} className="rounded-full border-none">
							<Send className="h-4 w-4" />
							<span className="hidden sm:inline">Submit</span>
						</Button>
					</>
				}
			>
				{/* Edit Badge */}
				{editingEntryId && (
					<div className="mb-4">
						<span className="text-xs font-medium px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-900/30 text-blue-400 rounded-full border border-blue-800">
							Edit Mode
						</span>
					</div>
				)}
				
				{/* Progress Indicator */}
				{!editingEntryId && (
					<div className="mt-4 space-y-2">
						<div className="flex items-center justify-between text-xs">
							<div className="flex items-center gap-4">
								<span className="text-neutral-400">
									Required: <span className="font-bold text-orange-500">{requiredFieldsFilled}/{totalRequiredFields}</span>
								</span>
								<span className="text-neutral-400">
									Optional: <span className="font-bold text-white">{optionalFieldsFilled}/{totalOptionalFields}</span>
								</span>
							</div>
							<span className="font-bold text-sm text-orange-500">{overallProgress}%</span>
						</div>
						<div className="relative w-full h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
							<div
								className="absolute top-0 left-0 h-full bg-linear-to-r from-orange-500 to-amber-500 transition-all duration-300"
								style={{ width: `${overallProgress}%` }}
							/>
						</div>
					</div>
				)}
				
				{/* Auto-save Status */}
				<div className="mt-3 flex items-center gap-2 text-xs">
					{autoSaveStatus === 'saving' && (
						<span className="flex items-center gap-1 text-blue-400">
							<RefreshCw className="h-3 w-3 animate-spin" />
							Saving...
						</span>
					)}
					{autoSaveStatus === 'saved' && (
						<span className="flex items-center gap-1 text-green-400">
							<CheckCircle2 className="h-3 w-3" />
							Saved
						</span>
					)}
					{lastAutoSave && autoSaveStatus === 'idle' && (
						<span className="text-neutral-500">
							Last saved: {lastAutoSave.toLocaleTimeString()}
						</span>
					)}
					<span className="text-neutral-600">•</span>
					<span className="text-neutral-500">
						Shortcuts: Ctrl+S (Save) | Ctrl+Enter (Submit)
					</span>
				</div>
			</PageHeader>

		<div className="grid gap-6 lg:grid-cols-3">
			{/* Main Input Area - 2 columns */}
			<div className="lg:col-span-2 space-y-6">
				{/* Input Mode Selection */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<button
						onClick={() => setInputMode('ai-draft')}
						className={`group flex flex-col items-center justify-center p-6 rounded-xl border transition-all duration-200 ${
							inputMode === 'ai-draft'
								? 'bg-[#1a1a1a] border-orange-500/50 shadow-[0_0_20px_-5px_rgba(249,115,22,0.3)]'
								: 'bg-surface-dark border-dashed border-border-dark hover:border-orange-500/50 hover:bg-orange-500/5'
						}`}
					>
						<div className={`mb-3 p-3 rounded-full transition-colors ${
							inputMode === 'ai-draft' 
								? 'bg-orange-500/20 text-orange-500' 
								: 'bg-orange-500/10 text-orange-500 group-hover:scale-110 transition-transform'
						}`}>
							<Sparkles className="h-6 w-6" />
						</div>
						<span className={`font-semibold mb-1 ${inputMode === 'ai-draft' ? 'text-white' : 'text-white'}`}>AI Quick Draft</span>
						<span className="text-xs text-neutral-500 mb-3">Auto-fill from description</span>
						{inputMode === 'ai-draft' && (
							<span className="text-[10px] px-2 py-1 rounded bg-orange-500/20 text-orange-400 font-mono border border-orange-500/20">Active</span>
						)}
					</button>

					<button
						onClick={() => {
							setInputMode('free')
							setSelectedTask('')
							setTaskProgress(0)
							setProgressComment('')
						}}
						className={`group flex flex-col items-center justify-center p-6 rounded-xl border transition-all duration-200 ${
							inputMode === 'free'
								? 'bg-[#1a1a1a] border-blue-500/50 shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]'
								: 'bg-surface-dark border-dashed border-border-dark hover:border-blue-500/50 hover:bg-blue-500/5'
						}`}
					>
						<div className={`mb-3 p-3 rounded-full transition-colors ${
							inputMode === 'free' 
								? 'bg-blue-500/20 text-blue-500' 
								: 'bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform'
						}`}>
							<FileText className="h-6 w-6" />
						</div>
						<span className={`font-semibold mb-1 ${inputMode === 'free' ? 'text-white' : 'text-white'}`}>Standard Entry</span>
						<span className="text-xs text-neutral-500 mb-3">Manual detailed input</span>
						{inputMode === 'free' && (
							<span className="text-[10px] px-2 py-1 rounded bg-blue-500/20 text-blue-400 font-mono border border-blue-500/20">Active</span>
						)}
					</button>

					<button
						onClick={() => setInputMode('task')}
						className={`group flex flex-col items-center justify-center p-6 rounded-xl border transition-all duration-200 ${
							inputMode === 'task'
								? 'bg-[#1a1a1a] border-purple-500/50 shadow-[0_0_20px_-5px_rgba(168,85,247,0.3)]'
								: 'bg-surface-dark border-dashed border-border-dark hover:border-purple-500/50 hover:bg-purple-500/5'
						}`}
					>
						<div className={`mb-3 p-3 rounded-full transition-colors ${
							inputMode === 'task' 
								? 'bg-purple-500/20 text-purple-500' 
								: 'bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform'
						}`}>
							<CheckCircle2 className="h-6 w-6" />
						</div>
						<span className={`font-semibold mb-1 ${inputMode === 'task' ? 'text-white' : 'text-white'}`}>Task Update</span>
						<span className="text-xs text-neutral-500 mb-3">Log progress on tasks</span>
						{inputMode === 'task' && (
							<span className="text-[10px] px-2 py-1 rounded bg-purple-500/20 text-purple-400 font-mono border border-purple-500/20">Active</span>
						)}
					</button>
				</div>

				{/* AI Draft Input Area */}
				{inputMode === 'ai-draft' && (
					<Card className="border-orange-500/20 bg-surface-dark relative overflow-hidden">
						<div className="absolute top-0 right-0 p-32 bg-orange-500/5 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none"></div>
						
						<CardHeader className="border-b border-border-dark pb-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Wand2 className="h-5 w-5 text-orange-500" />
									<CardTitle className="text-white">AI Quick Input</CardTitle>
								</div>
								<span className="text-[10px] font-medium px-2 py-1 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-full">
									BETA
								</span>
							</div>
							<p className="text-sm text-neutral-400">Describe your work naturally</p>
						</CardHeader>
						<CardContent className="p-6 space-y-4">
							<div className="space-y-2">
								<Textarea
									placeholder="e.g., Fixed the login bug on the authentication page and updated unit tests. It took about 2 hours."
									value={aiDraftInput}
									onChange={(e) => setAiDraftInput(e.target.value)}
									rows={5}
									className="text-base resize-none border-border-dark focus:border-orange-500 bg-[#1a1a1a] text-neutral-200 placeholder-neutral-500 rounded-xl"
									autoFocus
								/>
								<p className="text-xs text-neutral-500 flex items-center gap-1.5 pl-1">
									<Sparkles className="h-3 w-3 text-orange-500" />
									AI will extract title, project, tags, and category automatically.
								</p>
							</div>

							<div className="flex justify-end">
								<Button 
									variant="primary"
									onClick={handleAiProcess} 
									disabled={!aiDraftInput.trim() || isAiProcessing}
									className="rounded-full px-6"
								>
									{isAiProcessing ? (
										<span className="flex items-center gap-2">
											<Loader2 className="h-4 w-4 animate-spin" />
											Analyzing...
										</span>
									) : (
										<span className="flex items-center gap-2">
											<Wand2 className="h-4 w-4" />
											Generate Entry
										</span>
									)}
								</Button>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Task Selection (only in task mode) */}
				{inputMode === 'task' && (
					<Card className="border-purple-500/30 bg-surface-dark">
						<CardHeader className="border-b border-purple-500/20 bg-purple-500/5 pb-4">
							<div className="flex items-center gap-2">
								<CheckCircle2 className="h-5 w-5 text-purple-400" />
								<CardTitle className="text-purple-400">Task Selection</CardTitle>
							</div>
							<p className="text-sm text-purple-300/70">Select your assigned task</p>
						</CardHeader>
						<CardContent className="p-6 space-y-5">
						{/* Task Dropdown - Enhanced with Priority & Deadline */}
						<div>
							<label className="flex items-center gap-2 text-sm font-semibold mb-2 text-neutral-300">
								Select Task <span className="text-red-500">*</span>
								{assignedTasks.filter(t => t.priority === 'high').length > 0 && (
									<span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/20 rounded-full">
										{assignedTasks.filter(t => t.priority === 'high').length} Urgent
									</span>
								)}
							</label>
							<select
								value={selectedTask}
								onChange={(e) => handleTaskSelection(e.target.value)}
								className="w-full px-4 py-3 border-2 border-purple-500/30 rounded-xl bg-[#1a1a1a] text-white focus:outline-none focus:border-purple-500 transition-colors"
							>
								<option value="">Choose a task to update...</option>
								
								{/* High Priority Tasks */}
								{assignedTasks.filter(t => t.priority === 'high').length > 0 && (
									<optgroup label="🔥 High Priority">
										{assignedTasks
											.filter(t => t.priority === 'high')
											.sort((a, b) => {
												// Sort by deadline
												if (a.deadline && b.deadline) {
													return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
												}
												return 0
											})
											.map((task) => {
												const daysLeft = task.deadline 
													? Math.ceil((new Date(task.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
													: null
												return (
													<option key={task.id} value={task.id}>
														{task.title}
														{task.projectName ? ` (${task.projectName})` : ''}
														{daysLeft !== null && ` - ${daysLeft}d left`}
													</option>
												)
											})}
									</optgroup>
								)}
								
								{/* Medium Priority Tasks */}
								{assignedTasks.filter(t => t.priority === 'medium').length > 0 && (
									<optgroup label="📌 Medium Priority">
										{assignedTasks
											.filter(t => t.priority === 'medium')
											.sort((a, b) => {
												if (a.deadline && b.deadline) {
													return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
												}
												return 0
											})
											.map((task) => {
												const daysLeft = task.deadline 
													? Math.ceil((new Date(task.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
													: null
												return (
													<option key={task.id} value={task.id}>
														{task.title}
														{task.projectName ? ` (${task.projectName})` : ''}
														{daysLeft !== null && ` - ${daysLeft}d left`}
													</option>
												)
											})}
									</optgroup>
								)}
								
								{/* Low Priority Tasks */}
								{assignedTasks.filter(t => t.priority === 'low').length > 0 && (
									<optgroup label="📝 Low Priority">
										{assignedTasks
											.filter(t => t.priority === 'low')
											.map((task) => (
												<option key={task.id} value={task.id}>
													{task.title}
													{task.projectName ? ` (${task.projectName})` : ''}
												</option>
											))}
									</optgroup>
								)}
							</select>
							<p className="text-xs text-neutral-500 mt-2 flex items-center gap-1">
								<Info className="h-3 w-3" />
								{assignedTasks.length} task(s) available
								{assignedTasks.filter(t => t.priority === 'high').length > 0 && (
									<span className="ml-2 text-red-400 font-medium">
										• {assignedTasks.filter(t => t.priority === 'high').length} urgent
									</span>
								)}
							</p>
							
							{/* Task Details Preview */}
							{selectedTask && assignedTasks.find(t => t.id === selectedTask) && (
								<div className="mt-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
									{(() => {
										const task = assignedTasks.find(t => t.id === selectedTask)!
										const daysLeft = task.deadline 
											? Math.ceil((new Date(task.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
											: null
										return (
											<>
												<div className="flex items-center gap-2 mb-2">
													<span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
														task.priority === 'high' 
															? 'bg-red-500/20 text-red-400 border border-red-500/20'
															: task.priority === 'medium'
															? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20'
															: 'bg-blue-500/20 text-blue-400 border border-blue-500/20'
													}`}>
														{task.priority.toUpperCase()}
													</span>
													{daysLeft !== null && (
														<span className={`text-xs font-medium ${
															daysLeft > 3 ? 'text-purple-300' : 'text-red-400'
														}`}>
															⏰ {daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? 'Due today!' : 'Overdue!'}
														</span>
													)}
												</div>
												<p className="text-xs text-purple-200/80">
													{task.description.substring(0, 150)}
													{task.description.length > 150 && '...'}
												</p>
											</>
										)
									})()}
								</div>
							)}
						</div>

							{/* Progress Slider */}
							{selectedTask && (
								<div className="space-y-3 p-4 bg-[#1a1a1a] rounded-xl border border-border-dark">
									<div className="flex items-center justify-between">
										<label className="text-sm font-semibold text-neutral-300">Task Progress</label>
										<span className="text-2xl font-bold text-purple-400">
											{taskProgress}%
										</span>
									</div>
									
									{/* Progress Bar */}
									<div className="relative w-full h-3 bg-border-dark rounded-full overflow-hidden">
										<div
											className="absolute top-0 left-0 h-full bg-linear-to-r from-purple-500 to-purple-400 transition-all duration-300"
											style={{ width: `${taskProgress}%` }}
										/>
									</div>
									
									{/* Slider */}
									<input
										type="range"
										min="0"
										max="100"
										step="5"
										value={taskProgress}
										onChange={(e) => setTaskProgress(Number(e.target.value))}
										className="w-full h-2 bg-border-dark rounded-lg appearance-none cursor-pointer accent-purple-500"
									/>
									
									{/* Quick Buttons */}
									<div className="flex gap-2 flex-wrap">
										{[0, 25, 50, 75, 100].map((value) => (
											<button
												key={value}
												onClick={() => setTaskProgress(value)}
												className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
													taskProgress === value
														? 'bg-purple-600 text-white'
														: 'bg-border-dark text-neutral-400 hover:bg-[#333] hover:text-white'
												}`}
											>
												{value}%
											</button>
										))}
									</div>
								</div>
							)}

							{/* Progress Comment */}
							{selectedTask && (
								<div>
									<label className="block text-sm font-semibold mb-2 text-neutral-300">
										Progress Comment <span className="text-neutral-500">(Optional)</span>
									</label>
									<Textarea
										placeholder="Describe what you accomplished, any blockers you faced, or what's next..."
										value={progressComment}
										onChange={(e) => setProgressComment(e.target.value)}
										rows={4}
										className="text-sm border-border-dark bg-[#1a1a1a] text-white focus:border-purple-500"
									/>
									<p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
										<Info className="h-3 w-3" />
										This will be added to your work description
									</p>
								</div>
							)}
						</CardContent>
					</Card>
				)}

				{/* Basic Information */}
				<Card className="bg-surface-dark border-border-dark">
					<CardHeader className="border-b border-border-dark pb-4">
						<div className="flex items-center gap-2">
							<FileText className="h-5 w-5 text-white" />
							<CardTitle className="text-white">Basic Information</CardTitle>
						</div>
						<p className="text-sm text-neutral-400">Essential details about your work</p>
					</CardHeader>
					<CardContent className="p-6 space-y-5">
						{/* Title */}
						<div>
							<label className="block text-sm font-semibold mb-2 text-neutral-300">
								Title <span className="text-red-500">*</span>
								{inputMode === 'task' && selectedTask && (
									<span className="ml-2 text-xs text-purple-400">(Auto-filled from task)</span>
								)}
							</label>
							<Input
								type="text"
								placeholder="e.g., Completed user authentication feature"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								className="text-base bg-[#1a1a1a] border-border-dark text-white focus:border-orange-500 placeholder-neutral-500"
								disabled={inputMode === 'task' && !!selectedTask}
							/>
						</div>

						{/* Description */}
						<div>
							<label className="block text-sm font-semibold mb-2 text-neutral-300">
								Description <span className="text-red-500">*</span>
								{inputMode === 'task' && selectedTask && (
									<span className="ml-2 text-xs text-purple-400">(Auto-filled from task)</span>
								)}
							</label>
							<Textarea
								placeholder={inputMode === 'task' && selectedTask 
									? "Task description will be shown here. Add your progress comment above." 
									: "Describe what you worked on, challenges faced, and outcomes achieved..."}
								value={inputMode === 'task' && selectedTask && progressComment 
									? `${description}\n\n📊 Progress Update (${taskProgress}%):\n${progressComment}`
									: description
								}
								onChange={(e) => setDescription(e.target.value)}
								rows={6}
								className="text-sm bg-[#1a1a1a] border-border-dark text-white focus:border-orange-500 placeholder-neutral-500"
								disabled={inputMode === 'task' && !!selectedTask}
							/>
							<p className="text-xs text-neutral-500 mt-2 flex items-center gap-1.5">
								<Info className="h-3.5 w-3.5" />
								{inputMode === 'task' && selectedTask
									? 'Progress comment will be automatically added to the description'
									: 'Be specific about your work, decisions made, and results'
								}
							</p>
						</div>

				{/* Status & Duration */}
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-semibold mb-2 text-neutral-300">
							Status
						</label>
						<div className="relative">
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
								className="w-full px-4 py-2.5 border border-border-dark rounded-xl bg-[#1a1a1a] text-white focus:outline-none focus:border-orange-500 appearance-none"
							>
								<option value="">Select status</option>
								{categories.map((cat) => (
									<option key={cat.id} value={cat.id}>
										{cat.name}
									</option>
								))}
							</select>
							<ChevronDown className="absolute right-3 top-3 h-4 w-4 text-neutral-500 pointer-events-none" />
						</div>
						{showCustomCategory && (
							<Input
								type="text"
								placeholder="Enter custom status name"
								value={customCategory}
								onChange={(e) => setCustomCategory(e.target.value)}
								className="mt-2 bg-[#1a1a1a] border-border-dark text-white placeholder-neutral-500"
							/>
						)}
					</div>

					<div>
						<label className="block text-sm font-semibold mb-2 text-neutral-300">
							One-line Comment
						</label>
						<Input
							type="text"
							placeholder="Add a quick note (optional)..."
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							className="w-full bg-[#1a1a1a] border-border-dark text-white focus:border-orange-500 placeholder-neutral-500"
						/>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Links & Connections */}
				<Card className="bg-surface-dark border-border-dark">
					<CardHeader className="border-b border-border-dark pb-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Target className="h-5 w-5 text-white" />
								<CardTitle className="text-white">Links & Connections</CardTitle>
							</div>
							<span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Optional</span>
						</div>
						<p className="text-sm text-neutral-400">Connect to projects and resources</p>
					</CardHeader>
					<CardContent className="p-6 space-y-5">
						{/* Project */}
						<div>
							<label className="block text-sm font-semibold mb-2 text-neutral-300">
								Related Project
							</label>
							<div className="relative">
								<select
									value={selectedProject}
									onChange={(e) => {
										setSelectedProject(e.target.value)
										updateRecentItems('project', e.target.value)
									}}
									className="w-full px-4 py-2.5 border border-border-dark rounded-xl bg-[#1a1a1a] text-white focus:outline-none focus:border-orange-500 appearance-none"
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
								<ChevronDown className="absolute right-3 top-3 h-4 w-4 text-neutral-500 pointer-events-none" />
							</div>
						{selectedProject && (
							<>
								<p className="text-xs text-green-400 mt-2 flex items-center gap-1.5">
									<CheckCircle2 className="h-3.5 w-3.5" />
									This work will be linked to the selected project
								</p>
								
								{/* Reviewer Selection */}
								<div className="mt-4 p-4 bg-[#1a1a1a] rounded-xl border border-border-dark">
									<label className="block text-xs font-semibold mb-2 text-neutral-400 uppercase tracking-wider">
										Reviewer
									</label>
									<div className="relative">
										<select
											value={selectedReviewer}
											onChange={(e) => setSelectedReviewer(e.target.value)}
											className="w-full px-4 py-2.5 text-sm border border-border-dark rounded-xl bg-surface-dark text-white focus:outline-none focus:border-orange-500 appearance-none"
										>
											<option value="">Choose a reviewer...</option>
											{reviewers.map((reviewer) => (
												<option key={reviewer.id} value={reviewer.id}>
													{reviewer.name} - {reviewer.role} ({reviewer.department})
												</option>
											))}
										</select>
										<ChevronDown className="absolute right-3 top-3 h-4 w-4 text-neutral-500 pointer-events-none" />
									</div>
									<p className="text-xs text-neutral-500 mt-2">
										Select a team member to review your work (optional)
									</p>
								</div>
							</>
						)}
					</div>
					</CardContent>
				</Card>

				{/* Resources & Attachments */}
				<Card className="bg-surface-dark border-border-dark">
					<CardHeader className="border-b border-border-dark pb-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Upload className="h-5 w-5 text-white" />
								<CardTitle className="text-white">Attachments</CardTitle>
							</div>
							<span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Optional</span>
						</div>
						<p className="text-sm text-neutral-400">Files and external links</p>
					</CardHeader>
					<CardContent className="p-6 space-y-5">
						{/* Linked Resources */}
						<div>
							<label className="block text-sm font-semibold mb-2 text-neutral-300">
								Linked Resources
							</label>
							
							{/* Display Links */}
							{links.length > 0 && (
								<div className="space-y-2 mb-3">
									{links.map((link) => (
										<div
											key={link.id}
											className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-xl border border-border-dark group"
										>
											<div className="p-2 rounded-lg bg-surface-dark">
												<Link2 className="h-4 w-4 text-orange-500 shrink-0" />
											</div>
											<a
												href={link.url}
												target="_blank"
												rel="noopener noreferrer"
												className="flex-1 text-sm text-neutral-200 hover:text-white hover:underline truncate transition-colors"
											>
												{link.title}
											</a>
											<button
												onClick={() => removeLink(link.id)}
												className="text-neutral-500 hover:text-red-500 shrink-0 opacity-0 group-hover:opacity-100 transition-all p-1"
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
									className="flex-1 bg-[#1a1a1a] border-border-dark text-white focus:border-orange-500 placeholder-neutral-500"
								/>
								<Button onClick={addLink} variant="outline" className="px-3">
									<Plus className="h-4 w-4" />
								</Button>
							</div>
						</div>

						{/* Tags */}
						<div>
							<label className="block text-sm font-semibold mb-2 text-neutral-300">
								Tags
							</label>
							
							{/* Display Tags */}
							{tags.length > 0 && (
								<div className="flex flex-wrap gap-2 mb-3">
									{tags.map((tag) => (
										<span
											key={tag}
											className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1a1a1a] text-neutral-200 border border-border-dark rounded-full text-xs font-medium"
										>
											<Tag className="h-3 w-3 text-neutral-500" />
											{tag}
											<button onClick={() => removeTag(tag)} className="hover:text-red-500 ml-1 transition-colors">
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
									className="flex-1 bg-[#1a1a1a] border-border-dark text-white focus:border-orange-500 placeholder-neutral-500"
								/>
								<Button onClick={addTag} variant="outline" className="px-3">
									<Plus className="h-4 w-4" />
								</Button>
							</div>
							<p className="text-xs text-neutral-500 mt-2 pl-1">
								Press Enter or comma to add tags
							</p>
						</div>

						{/* File Upload */}
						<div>
							<label className="block text-sm font-semibold mb-2 text-neutral-300">
								File Attachments
							</label>
							
							{/* Display Files */}
							{files.length > 0 && (
								<div className="space-y-2 mb-3">
									{files.map((file) => (
										<div
											key={file.id}
											className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-xl border border-border-dark group"
										>
											<div className="p-2 rounded-lg bg-surface-dark text-neutral-400">
												{getFileIcon(file.type)}
											</div>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium truncate text-white">{file.name}</p>
												<p className="text-xs text-neutral-500">{formatFileSize(file.size)}</p>
											</div>
											<button
												onClick={() => removeFile(file.id)}
												className="text-neutral-500 hover:text-red-500 shrink-0 opacity-0 group-hover:opacity-100 transition-all p-1"
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
								className={`relative border border-dashed rounded-xl p-8 text-center transition-all ${
									isDragging
										? 'border-orange-500 bg-orange-500/5'
										: 'border-border-dark hover:border-neutral-500 bg-[#1a1a1a]'
								}`}
							>
								<input
									ref={fileInputRef}
									type="file"
									multiple
									onChange={handleFileSelect}
									className="hidden"
								/>
								<div className="mx-auto w-12 h-12 rounded-full bg-border-dark flex items-center justify-center mb-3">
									<Upload className={`h-6 w-6 transition-colors ${
										isDragging ? 'text-orange-500' : 'text-neutral-400'
									}`} />
								</div>
								<p className="text-sm font-medium mb-1 text-white">
									{isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
								</p>
								<p className="text-xs text-neutral-500 mb-4">
									Support for single or bulk upload
								</p>
								<Button
									variant="outline"
									size="sm"
									onClick={() => fileInputRef.current?.click()}
									className="h-8"
								>
									Browse Files
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Security */}
				<Card className="border-amber-500/20 bg-amber-500/5">
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
								<div className="flex items-center gap-2 font-semibold text-amber-200 mb-1">
									<ShieldCheck className="h-4 w-4" />
									Confidential
								</div>
								<p className="text-xs text-amber-200/70">
									This work entry contains sensitive or confidential information. Access will be restricted.
								</p>
							</div>
						</label>
					</CardContent>
				</Card>

				{/* Async Discussion (NoMeet) */}
				{category === 'async-discussion' && (
					<Card className="border-pink-500/30 bg-pink-500/5">
						<CardHeader className="border-b border-pink-500/20 bg-pink-500/5 pb-4">
							<div className="flex items-center gap-2">
								<Calendar className="h-5 w-5 text-pink-400" />
								<CardTitle className="text-pink-400">Async Discussion (NoMeet)</CardTitle>
							</div>
							<p className="text-sm text-pink-300/70">Replace synchronous meetings</p>
						</CardHeader>
						<CardContent className="p-6 space-y-5">
							<p className="text-sm text-pink-200/80">
								This structured async discussion enables decision-making without meetings. Provide context, gather feedback, and reach decisions asynchronously.
							</p>

							{/* Agenda */}
							<div>
								<label className="block text-sm font-semibold mb-2 text-neutral-300">
									Discussion Agenda
								</label>
								<Textarea
									placeholder="Describe what needs to be discussed and decided..."
									value={asyncAgenda}
									onChange={(e) => setAsyncAgenda(e.target.value)}
									rows={4}
									className="w-full bg-[#1a1a1a] border-border-dark text-white focus:border-pink-500"
								/>
								<p className="text-xs text-neutral-500 mt-1">
									Clearly outline the topic, context, and decision points
								</p>
							</div>

							{/* AI Briefing */}
							<div className="p-4 bg-[#1a1a1a] rounded-xl border border-pink-500/20">
								<div className="flex items-center justify-between mb-3">
									<label className="block text-sm font-semibold text-pink-200">
										AI Briefing
									</label>
									<Button
										size="sm"
										onClick={() => {
											setAsyncBriefing('AI-generated summary:\n\n• Key points extracted from agenda\n• Relevant historical decisions\n• Recommended decision framework\n• Estimated timeline for consensus\n\n(This is a mock AI briefing)')
											toast.success('AI Briefing generated')
										}}
										className="h-8 bg-pink-500 hover:bg-pink-600 text-white border-none"
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
										className="w-full text-sm bg-surface-dark border-border-dark text-white"
									/>
								) : (
									<p className="text-sm text-neutral-500 italic">
										Click "Generate Briefing" to create an AI summary of key points and recommendations
									</p>
								)}
							</div>

							{/* Decision Status */}
							<div>
								<label className="block text-sm font-semibold mb-2 text-neutral-300">
									Decision Status
								</label>
								<select
									value={asyncDecisionStatus}
									onChange={(e) => setAsyncDecisionStatus(e.target.value as 'pending' | 'approved' | 'escalated')}
									className="w-full px-4 py-2 border border-border-dark rounded-2xl bg-[#1a1a1a] text-white focus:outline-none focus:border-pink-500"
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
					<Button 
						onClick={saveDraft} 
						variant="outline" 
						className="flex-1 h-12"
					>
						<Save className="h-4 w-4 mr-2" />
						Save Draft
					</Button>
					<Button 
						variant="primary"
						onClick={handleSubmit} 
						className="flex-1 h-12 rounded-full shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.4)] transition-all"
					>
						<Send className="h-4 w-4 mr-2" />
						Submit Work Entry
					</Button>
				</div>
			</div>

			{/* Sidebar - 1 column */}
			<div className="space-y-6">
				{/* AI Suggestions */}
				<Card className="bg-surface-dark border-border-dark overflow-hidden">
					<div 
						className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#1a1a1a] transition-colors group"
						onClick={() => setShowAiSuggestions(!showAiSuggestions)}
					>
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20 transition-colors">
								<Sparkles className="h-4 w-4" />
							</div>
							<div>
								<h3 className="font-bold text-white text-sm">AI Suggestion</h3>
								{!showAiSuggestions && <p className="text-[10px] text-neutral-500">Click to expand</p>}
							</div>
						</div>
						{showAiSuggestions ? (
							<ChevronUp className="h-4 w-4 text-neutral-500" />
						) : (
							<ChevronDown className="h-4 w-4 text-neutral-500" />
						)}
					</div>
					
					{showAiSuggestions && (
						<CardContent className="px-4 pb-4 pt-0 animate-in slide-in-from-top-2 duration-200">
							<div className="h-px bg-border-dark mb-4 mx-2" />
							<p className="text-xs text-neutral-400 mb-3 pl-2">
								Based on your input, consider including:
							</p>
							<ul className="space-y-2 text-xs text-neutral-300 pl-2">
								<li className="flex items-start gap-2">
									<span className="text-blue-500 mt-0.5">•</span>
									<span>Specific metrics or KPIs affected</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-blue-500 mt-0.5">•</span>
									<span>Collaboration with team members</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-blue-500 mt-0.5">•</span>
									<span>Next steps or follow-up tasks</span>
								</li>
							</ul>
						</CardContent>
					)}
				</Card>

				{/* Tips */}
				<Card className="bg-surface-dark border-border-dark overflow-hidden">
					<div 
						className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#1a1a1a] transition-colors group"
						onClick={() => setShowTips(!showTips)}
					>
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-lg bg-orange-500/10 text-orange-500 group-hover:bg-orange-500/20 transition-colors">
								<Info className="h-4 w-4" />
							</div>
							<div>
								<h2 className="text-sm font-bold text-white">Tips for Better Documentation</h2>
								{!showTips && <p className="text-[10px] text-neutral-500">Click to expand</p>}
							</div>
						</div>
						{showTips ? (
							<ChevronUp className="h-4 w-4 text-neutral-500" />
						) : (
							<ChevronDown className="h-4 w-4 text-neutral-500" />
						)}
					</div>
					
					{showTips && (
						<CardContent className="px-4 pb-4 pt-0 animate-in slide-in-from-top-2 duration-200">
							<div className="h-px bg-border-dark mb-4 mx-2" />
							<ul className="space-y-3 text-xs text-neutral-400 pl-2">
								<li className="flex items-start gap-2.5">
									<div className="mt-0.5 bg-green-500/10 p-0.5 rounded-full">
										<CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
									</div>
									<span>Use clear, descriptive titles</span>
								</li>
								<li className="flex items-start gap-2.5">
									<div className="mt-0.5 bg-green-500/10 p-0.5 rounded-full">
										<CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
									</div>
									<span>Include context and background</span>
								</li>
								<li className="flex items-start gap-2.5">
									<div className="mt-0.5 bg-green-500/10 p-0.5 rounded-full">
										<CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
									</div>
									<span>Link to related projects</span>
								</li>
								<li className="flex items-start gap-2.5">
									<div className="mt-0.5 bg-green-500/10 p-0.5 rounded-full">
										<CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
									</div>
									<span>Attach relevant files and resources</span>
								</li>
								<li className="flex items-start gap-2.5">
									<div className="mt-0.5 bg-green-500/10 p-0.5 rounded-full">
										<CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
									</div>
									<span>Tag team members for visibility</span>
								</li>
							</ul>
						</CardContent>
					)}
				</Card>
			</div>
		</div>

		{/* Drafts Dialog */}
		<DraftsDialog 
			isOpen={showDraftsDialog}
			onClose={() => setShowDraftsDialog(false)}
			drafts={drafts}
			onLoad={loadDraft}
			onDelete={deleteDraft}
		/>

		{/* Decision Issue Dialog */}
		<DecisionDialog
			isOpen={showDecisionDialog}
			onClose={() => setShowDecisionDialog(false)}
		/>
		</div>
	</div>
	)
}
