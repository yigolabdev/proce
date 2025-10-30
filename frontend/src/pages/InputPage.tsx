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
	ExternalLink,
	Save,
	FolderOpen,
	AlertCircle,
	Users as UsersIcon,
	Brain,
	Lock,
	ShieldCheck,
	FolderKanban
} from 'lucide-react'
import { toast } from 'sonner'

interface WorkEntry {
	id: string
	title: string
	description: string
	category: string
	projectId?: string
	tags: string[]
	date: Date
	duration: string
	files: UploadedFile[]
	links: LinkedResource[]
	status: 'draft' | 'submitted'
	isConfidential: boolean
}

interface UploadedFile {
	id: string
	name: string
	size: number
	type: string
	url: string
}

interface LinkedResource {
	id: string
	url: string
	title: string
	addedAt: Date
}

interface DraftData {
	id: string
	title: string
	description: string
	category: string
	projectId?: string
	tags: string[]
	files: UploadedFile[]
	links: LinkedResource[]
	savedAt: Date
	isConfidential: boolean
}

interface DecisionIssue {
	id: string
	title: string
	description: string
	priority: 'low' | 'medium' | 'high' | 'urgent'
	assignees: string[]
	useAI: boolean
	deadline?: Date
	status: 'pending' | 'in-progress' | 'resolved'
	createdAt: Date
	createdBy: string
}

export default function InputPage() {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [category, setCategory] = useState('')
	const [tags, setTags] = useState<string[]>([])
	const [tagInput, setTagInput] = useState('')
	const [files, setFiles] = useState<UploadedFile[]>([])
	const [links, setLinks] = useState<LinkedResource[]>([])
	const [isDragging, setIsDragging] = useState(false)
	const [recentEntries, setRecentEntries] = useState<WorkEntry[]>([])
	const [aiSuggestion, setAiSuggestion] = useState('')
	const [showLinkDialog, setShowLinkDialog] = useState(false)
	const [linkUrl, setLinkUrl] = useState('')
	const [linkTitle, setLinkTitle] = useState('')
	const [drafts, setDrafts] = useState<DraftData[]>([])
	const [showDraftsDialog, setShowDraftsDialog] = useState(false)
	const [isConfidential, setIsConfidential] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)

	// Decision Issue states
	const [showDecisionDialog, setShowDecisionDialog] = useState(false)
	const [decisionTitle, setDecisionTitle] = useState('')
	const [decisionDescription, setDecisionDescription] = useState('')
	const [decisionPriority, setDecisionPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium')
	const [decisionAssignees, setDecisionAssignees] = useState<string[]>([])
	const [decisionUseAI, setDecisionUseAI] = useState(false)
	const [decisionDeadline, setDecisionDeadline] = useState('')
	const [assigneeInput, setAssigneeInput] = useState('')

	// Load from system settings
	const [categories, setCategories] = useState<Array<{ id: string; name: string; color: string; description: string }>>([])
	const [systemTags, setSystemTags] = useState<Array<{ id: string; name: string; category: string }>>([])
	const [templates, setTemplates] = useState<Array<{ id: string; title: string; description: string; category: string }>>([])
	const [projects, setProjects] = useState<Array<{ id: string; name: string; status: string }>>([])
	const [selectedProject, setSelectedProject] = useState('')

	// Load system settings and drafts
	useEffect(() => {
		try {
			const savedCategories = localStorage.getItem('workCategories')
			const savedTags = localStorage.getItem('workTags')
			const savedTemplates = localStorage.getItem('workTemplates')
			const savedDrafts = localStorage.getItem('workInputDrafts')
			const savedProjects = localStorage.getItem('projects')

			if (savedCategories) {
				setCategories(JSON.parse(savedCategories))
			}
			if (savedTags) {
				setSystemTags(JSON.parse(savedTags))
			}
			if (savedTemplates) {
				setTemplates(JSON.parse(savedTemplates))
			}
			if (savedDrafts) {
				const parsedDrafts = JSON.parse(savedDrafts).map((draft: any) => ({
					...draft,
					savedAt: new Date(draft.savedAt),
				}))
				setDrafts(parsedDrafts)
			}
			if (savedProjects) {
				const parsedProjects = JSON.parse(savedProjects)
					.filter((p: any) => p.status === 'active' || p.status === 'planning')
					.map((p: any) => ({
						id: p.id,
						name: p.name,
						status: p.status,
					}))
				setProjects(parsedProjects)
			}
		} catch (error) {
			console.error('Failed to load system settings:', error)
		}
	}, [])

	const handleFileUpload = (uploadedFiles: FileList | null) => {
		if (!uploadedFiles) return

		const newFiles: UploadedFile[] = Array.from(uploadedFiles).map((file) => ({
			id: Math.random().toString(36).substr(2, 9),
			name: file.name,
			size: file.size,
			type: file.type,
			url: URL.createObjectURL(file),
		}))

		setFiles((prev) => [...prev, ...newFiles])
		toast.success(`${newFiles.length} file(s) uploaded`)
	}

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault()
		setIsDragging(false)
		handleFileUpload(e.dataTransfer.files)
	}

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault()
		setIsDragging(true)
	}

	const handleDragLeave = () => {
		setIsDragging(false)
	}

	const removeFile = (id: string) => {
		setFiles((prev) => prev.filter((f) => f.id !== id))
		toast.success('File removed')
	}

	const addTag = () => {
		if (tagInput.trim() && !tags.includes(tagInput.trim())) {
			setTags([...tags, tagInput.trim()])
			setTagInput('')
		}
	}

	const removeTag = (tag: string) => {
		setTags(tags.filter((t) => t !== tag))
	}

	const addLink = () => {
		if (!linkUrl.trim()) {
			toast.error('Please enter a URL')
			return
		}

		const newLink: LinkedResource = {
			id: Math.random().toString(36).substr(2, 9),
			url: linkUrl.trim(),
			title: linkTitle.trim() || linkUrl.trim(),
			addedAt: new Date(),
		}

		setLinks([...links, newLink])
		setLinkUrl('')
		setLinkTitle('')
		setShowLinkDialog(false)
		toast.success('Link added successfully')
	}

	const removeLink = (id: string) => {
		setLinks(links.filter((link) => link.id !== id))
		toast.success('Link removed')
	}

	const handleSubmit = () => {
		if (!title || !description) {
			toast.error('Please fill in title and description')
			return
		}

		const newEntry: WorkEntry = {
			id: Math.random().toString(36).substr(2, 9),
			title,
			description,
			category,
			projectId: selectedProject || undefined,
			tags,
			date: new Date(),
			duration: '',
			files,
			links,
			status: 'submitted',
			isConfidential,
		}

		// Save to localStorage
		try {
			const existingEntries = localStorage.getItem('workEntries')
			const entries = existingEntries ? JSON.parse(existingEntries) : []
			entries.unshift(newEntry)
			localStorage.setItem('workEntries', JSON.stringify(entries))
		} catch (error) {
			console.error('Failed to save work entry:', error)
		}

		setRecentEntries([newEntry, ...recentEntries])
		
		// Reset form
		setTitle('')
		setDescription('')
		setCategory('')
		setSelectedProject('')
		setTags([])
		setFiles([])
		setLinks([])
		setIsConfidential(false)
		
		toast.success('Work entry submitted successfully!')
	}

	const saveDraft = () => {
		if (!title && !description) {
			toast.error('Please enter at least a title or description to save draft')
			return
		}

		const draftData: DraftData = {
			id: Date.now().toString(),
			title: title || 'Untitled Draft',
			description,
			category,
			projectId: selectedProject || undefined,
			tags,
			files,
			links,
			savedAt: new Date(),
			isConfidential,
		}

		try {
			const updatedDrafts = [draftData, ...drafts]
			localStorage.setItem('workInputDrafts', JSON.stringify(updatedDrafts))
			setDrafts(updatedDrafts)
			toast.success('Draft saved successfully!')
		} catch (error) {
			console.error('Failed to save draft:', error)
			toast.error('Failed to save draft')
		}
	}

	const loadDraft = (draft: DraftData) => {
		setTitle(draft.title === 'Untitled Draft' ? '' : draft.title)
		setDescription(draft.description)
		setCategory(draft.category)
		setSelectedProject(draft.projectId || '')
		setTags(draft.tags)
		setFiles(draft.files)
		setLinks(draft.links)
		setIsConfidential(draft.isConfidential || false)
		setShowDraftsDialog(false)
		toast.success('Draft loaded successfully!')
	}

	const deleteDraft = (draftId: string) => {
		try {
			const updatedDrafts = drafts.filter((d) => d.id !== draftId)
			localStorage.setItem('workInputDrafts', JSON.stringify(updatedDrafts))
			setDrafts(updatedDrafts)
			toast.success('Draft deleted successfully!')
		} catch (error) {
			console.error('Failed to delete draft:', error)
			toast.error('Failed to delete draft')
		}
	}

	const deleteAllDrafts = () => {
		if (!confirm('Are you sure you want to delete all drafts?')) return
		
		try {
			localStorage.removeItem('workInputDrafts')
			setDrafts([])
			setShowDraftsDialog(false)
			toast.success('All drafts deleted successfully!')
		} catch (error) {
			console.error('Failed to delete drafts:', error)
			toast.error('Failed to delete drafts')
		}
	}

	const applyTemplate = (template: typeof templates[0]) => {
		setTitle(template.title)
		setDescription(template.description)
		toast.success('Template applied')
	}

	const generateAISuggestion = () => {
		if (!description) {
			toast.error('Please enter some description first')
			return
		}
		// Mock AI suggestion
		const suggestions = [
			'Consider adding more details about the implementation approach',
			'Great work! This looks comprehensive',
			'You might want to include testing results',
			'Consider documenting any challenges faced',
		]
		setAiSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)])
		toast.success('AI suggestion generated')
	}

	const formatFileSize = (bytes: number) => {
		if (bytes < 1024) return bytes + ' B'
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
		return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
	}

	const getFileIcon = (type: string) => {
		if (type.startsWith('image/')) return <ImageIcon className="h-5 w-5" />
		if (type.includes('spreadsheet') || type.includes('excel')) return <FileSpreadsheet className="h-5 w-5" />
		return <File className="h-5 w-5" />
	}

	const handleAddAssignee = () => {
		if (assigneeInput.trim() && !decisionAssignees.includes(assigneeInput.trim())) {
			setDecisionAssignees([...decisionAssignees, assigneeInput.trim()])
			setAssigneeInput('')
		}
	}

	const handleRemoveAssignee = (assignee: string) => {
		setDecisionAssignees(decisionAssignees.filter((a) => a !== assignee))
	}

	const handleCreateDecisionIssue = () => {
		if (!decisionTitle || !decisionDescription) {
			toast.error('Please enter title and description')
			return
		}

		const newIssue: DecisionIssue = {
			id: Date.now().toString(),
			title: decisionTitle,
			description: decisionDescription,
			priority: decisionPriority,
			assignees: decisionAssignees,
			useAI: decisionUseAI,
			deadline: decisionDeadline ? new Date(decisionDeadline) : undefined,
			status: 'pending',
			createdAt: new Date(),
			createdBy: 'Current User', // Replace with actual user
		}

		// Save to localStorage
		try {
			const existingIssues = localStorage.getItem('decisionIssues')
			const issues = existingIssues ? JSON.parse(existingIssues) : []
			issues.unshift(newIssue)
			localStorage.setItem('decisionIssues', JSON.stringify(issues))
			
			toast.success('Decision issue created successfully!')
			
			// Reset form
			setDecisionTitle('')
			setDecisionDescription('')
			setDecisionPriority('medium')
			setDecisionAssignees([])
			setDecisionUseAI(false)
			setDecisionDeadline('')
			setShowDecisionDialog(false)
		} catch (error) {
			console.error('Failed to save decision issue:', error)
			toast.error('Failed to create decision issue')
		}
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold flex items-center gap-3">
						<FileText className="h-8 w-8 text-primary" />
						Work Input
					</h1>
					<p className="mt-2 text-neutral-600 dark:text-neutral-400">
						Document your work, upload files, and track your progress
					</p>
				</div>
			<div className="flex items-center gap-2">
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
					Create Decision Issue
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
				{/* Main Form */}
				<Card>
					<CardContent className="p-6 space-y-4">
							{/* Title */}
							<div>
								<label className="block text-sm font-medium mb-2">
									Title <span className="text-red-500">*</span>
								</label>
								<Input
									type="text"
									placeholder="e.g., Completed user authentication feature"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									className="text-lg"
								/>
							</div>

							{/* Category */}
							<div>
								<label className="block text-sm font-medium mb-2">
									<Calendar className="inline h-4 w-4 mr-1" />
									Category
								</label>
								<select
									value={category}
									onChange={(e) => setCategory(e.target.value)}
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

							{/* Project */}
							<div>
								<label className="block text-sm font-medium mb-2">
									<FolderKanban className="inline h-4 w-4 mr-1" />
									Project (Optional)
								</label>
								<select
									value={selectedProject}
									onChange={(e) => setSelectedProject(e.target.value)}
									className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900"
								>
									<option value="">No project selected</option>
									{projects.map((project) => (
										<option key={project.id} value={project.id}>
											{project.name} ({project.status})
										</option>
									))}
								</select>
								{projects.length === 0 && (
									<p className="text-xs text-neutral-500 mt-2">
										No active projects. Create a project in the Projects page.
									</p>
								)}
							</div>

							{/* Description */}
							<div>
								<label className="block text-sm font-medium mb-2">
									Description <span className="text-red-500">*</span>
								</label>
								<Textarea
									placeholder="Describe what you worked on, challenges faced, and outcomes achieved..."
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									rows={8}
									className="resize-none"
								/>
								<div className="flex items-center justify-between mt-2">
									<span className="text-xs text-neutral-500">
										{description.length} characters
									</span>
									<button
										onClick={generateAISuggestion}
										className="text-xs text-primary hover:underline flex items-center gap-1"
									>
										<Sparkles className="h-3 w-3" />
										Get AI Suggestion
									</button>
								</div>
							</div>

							{/* AI Suggestion */}
							{aiSuggestion && (
								<div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl">
									<div className="flex items-start gap-3">
										<Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
										<div className="flex-1">
											<p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
												AI Suggestion
											</p>
											<p className="text-sm text-blue-700 dark:text-blue-300">
												{aiSuggestion}
											</p>
										</div>
										<button
											onClick={() => setAiSuggestion('')}
											className="text-blue-600 dark:text-blue-400 hover:text-blue-700"
										>
											<X className="h-4 w-4" />
										</button>
									</div>
								</div>
							)}

							{/* Tags */}
							<div>
								<label className="block text-sm font-medium mb-2">
									<Tag className="inline h-4 w-4 mr-1" />
									Tags
								</label>
								<div className="flex gap-2 mb-2">
									<Input
										type="text"
										placeholder="Add tags (press Enter)"
										value={tagInput}
										onChange={(e) => setTagInput(e.target.value)}
										onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
									/>
									<Button onClick={addTag} size="sm">
										<Plus className="h-4 w-4" />
									</Button>
								</div>
								
								{/* System Tags - Quick Select */}
								{systemTags.length > 0 && (
									<div className="mb-3">
										<p className="text-xs text-neutral-500 mb-2">Quick select:</p>
										<div className="flex flex-wrap gap-2">
											{systemTags.map((tag) => (
												<button
													key={tag.id}
													onClick={() => {
														if (!tags.includes(tag.name)) {
															setTags([...tags, tag.name])
														}
													}}
													className="text-xs px-2 py-1 border border-neutral-300 dark:border-neutral-700 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
													disabled={tags.includes(tag.name)}
												>
													{tag.name}
												</button>
											))}
										</div>
									</div>
								)}
								
								{tags.length > 0 && (
									<div className="flex flex-wrap gap-2">
										{tags.map((tag) => (
											<span
												key={tag}
												className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
											>
												{tag}
												<button onClick={() => removeTag(tag)}>
													<X className="h-3 w-3" />
												</button>
											</span>
										))}
									</div>
								)}
							</div>

							{/* File Upload */}
							<div>
								<label className="block text-sm font-medium mb-2">
									<Upload className="inline h-4 w-4 mr-1" />
									Attachments
								</label>
								<div
									onDrop={handleDrop}
									onDragOver={handleDragOver}
									onDragLeave={handleDragLeave}
									className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
										isDragging
											? 'border-primary bg-primary/5'
											: 'border-neutral-300 dark:border-neutral-700'
									}`}
								>
									<input
										ref={fileInputRef}
										type="file"
										multiple
										onChange={(e) => handleFileUpload(e.target.files)}
										className="hidden"
									/>
									<Upload className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
									<p className="font-medium mb-2">
										Drop files here or{' '}
										<button
											onClick={() => fileInputRef.current?.click()}
											className="text-primary hover:underline"
										>
											browse
										</button>
									</p>
									<p className="text-sm text-neutral-600 dark:text-neutral-400">
										Support for images, documents, spreadsheets (Max 10MB each)
									</p>
								</div>

								{/* Uploaded Files */}
								{files.length > 0 && (
									<div className="mt-4 space-y-2">
										{files.map((file) => (
											<div
												key={file.id}
												className="flex items-center justify-between p-3 border border-neutral-200 dark:border-neutral-800 rounded-xl"
											>
												<div className="flex items-center gap-3 flex-1 min-w-0">
													<div className="text-primary">{getFileIcon(file.type)}</div>
													<div className="flex-1 min-w-0">
														<p className="font-medium truncate">{file.name}</p>
														<p className="text-sm text-neutral-600 dark:text-neutral-400">
															{formatFileSize(file.size)}
														</p>
													</div>
												</div>
												<button
													onClick={() => removeFile(file.id)}
													className="text-red-500 hover:text-red-600 ml-2"
												>
													<X className="h-4 w-4" />
												</button>
											</div>
										))}
									</div>
								)}
							</div>

						{/* Linked Resources */}
						{links.length > 0 && (
							<div>
								<label className="block text-sm font-medium mb-2">
									<Link2 className="inline h-4 w-4 mr-1" />
									Linked Resources
								</label>
								<div className="space-y-2">
									{links.map((link) => (
										<div
											key={link.id}
											className="flex items-center justify-between p-3 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
										>
											<div className="flex items-center gap-3 flex-1 min-w-0">
												<ExternalLink className="h-4 w-4 text-primary flex-shrink-0" />
												<div className="flex-1 min-w-0">
													<p className="font-medium text-sm truncate">{link.title}</p>
													<a
														href={link.url}
														target="_blank"
														rel="noopener noreferrer"
														className="text-xs text-primary hover:underline truncate block"
													>
														{link.url}
													</a>
												</div>
											</div>
											<button
												onClick={() => removeLink(link.id)}
												className="text-red-500 hover:text-red-600 ml-2"
											>
												<X className="h-4 w-4" />
											</button>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Add Link Resource Button */}
						<div>
							<Button 
								variant="outline"
								onClick={() => setShowLinkDialog(true)}
								className="w-full flex items-center justify-center gap-2"
							>
								<Link2 className="h-4 w-4" />
								Add Link Resource
							</Button>
						</div>

						{/* Security - Confidential */}
						<div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
							<div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
								<div className="flex items-center h-6">
									<input
										id="confidential-checkbox"
										type="checkbox"
										checked={isConfidential}
										onChange={(e) => setIsConfidential(e.target.checked)}
										className="w-5 h-5 text-primary border-amber-300 dark:border-amber-700 rounded focus:ring-2 focus:ring-primary cursor-pointer"
									/>
								</div>
								<div className="flex-1">
									<label htmlFor="confidential-checkbox" className="flex items-center gap-2 font-medium text-amber-900 dark:text-amber-100 cursor-pointer mb-1">
										<ShieldCheck className="h-5 w-5 text-amber-600 dark:text-amber-400" />
										Confidential Information
									</label>
									<p className="text-sm text-amber-700 dark:text-amber-300">
										This work entry contains sensitive information and will only be visible to executives and authorized managers.
									</p>
									{isConfidential && (
										<div className="mt-2 flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
											<Lock className="h-4 w-4" />
											<span className="font-medium">Access restricted to executives and managers only</span>
										</div>
									)}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Sidebar - 1 column */}
			<div className="space-y-6">
				{/* Quick Templates */}
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-bold">Quick Templates</h2>
							<Sparkles className="h-5 w-5 text-primary" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							{templates.length > 0 ? (
								templates.map((template) => (
									<button
										key={template.id}
										onClick={() => applyTemplate(template)}
										className="w-full p-3 text-sm border border-neutral-200 dark:border-neutral-800 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors text-left"
									>
										<p className="font-medium mb-1">{template.title}</p>
										<p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
											{template.description}
										</p>
									</button>
								))
							) : (
								<p className="text-sm text-neutral-600 dark:text-neutral-400 text-center py-4">
									No templates available. Add templates in System Settings.
								</p>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Recent Entries */}
					<Card>
						<CardHeader>
							<h2 className="text-lg font-bold">Recent Entries</h2>
						</CardHeader>
						<CardContent>
							{recentEntries.length === 0 ? (
								<p className="text-sm text-neutral-600 dark:text-neutral-400 text-center py-4">
									No recent entries
								</p>
							) : (
								<div className="space-y-3">
									{recentEntries.slice(0, 5).map((entry) => (
										<div
											key={entry.id}
											className="p-3 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:shadow-md transition-shadow cursor-pointer"
										>
											<div className="flex items-start justify-between mb-2">
												<h3 className="font-medium text-sm line-clamp-1">{entry.title}</h3>
												<CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
											</div>
											<p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-2">
												{entry.description}
											</p>
											<div className="flex items-center justify-between text-xs text-neutral-500">
												<span>{entry.date.toLocaleDateString()}</span>
												{entry.files.length > 0 && (
													<span className="flex items-center gap-1">
														<Upload className="h-3 w-3" />
														{entry.files.length}
													</span>
												)}
											</div>
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>

					{/* Tips */}
					<Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
						<CardContent className="p-4">
							<h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2 text-sm">
								💡 Pro Tips
							</h3>
							<ul className="space-y-2 text-xs text-blue-700 dark:text-blue-300">
								<li>• Use templates to save time</li>
								<li>• Add tags for better organization</li>
								<li>• Upload screenshots for clarity</li>
								<li>• Link related resources</li>
							</ul>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Bottom Submit Button */}
			<div className="flex justify-center pt-6">
				<Button 
					onClick={handleSubmit} 
					className="w-full max-w-md h-12 text-lg font-semibold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all"
				>
					<Send className="h-5 w-5" />
					Submit Work Entry
				</Button>
			</div>

			{/* Drafts List Dialog */}
			{showDraftsDialog && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
					<Card className="w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
						<CardHeader className="border-b border-neutral-200 dark:border-neutral-800">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="text-xl font-bold flex items-center gap-2">
										<FolderOpen className="h-6 w-6 text-primary" />
										Saved Drafts
									</h3>
									<p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
										{drafts.length} {drafts.length === 1 ? 'draft' : 'drafts'} saved
									</p>
								</div>
								<div className="flex items-center gap-2">
									{drafts.length > 0 && (
										<Button
											variant="outline"
											size="sm"
											onClick={deleteAllDrafts}
											className="text-red-600 hover:text-red-700"
										>
											Delete All
										</Button>
									)}
									<button
										onClick={() => setShowDraftsDialog(false)}
										className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
									>
										<X className="h-5 w-5" />
									</button>
								</div>
							</div>
						</CardHeader>
						<CardContent className="p-6 overflow-y-auto flex-1">
							{drafts.length === 0 ? (
								<div className="text-center py-12">
									<FolderOpen className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
									<h3 className="text-lg font-bold mb-2">No Drafts Yet</h3>
									<p className="text-neutral-600 dark:text-neutral-400 mb-4">
										Start creating work entries and save them as drafts
									</p>
									<Button onClick={() => setShowDraftsDialog(false)}>
										Close
									</Button>
								</div>
							) : (
								<div className="space-y-3">
									{drafts.map((draft) => (
										<div
											key={draft.id}
											className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:shadow-md transition-shadow"
										>
											<div className="flex items-start justify-between gap-4">
												<div className="flex-1 min-w-0">
													<div className="flex items-center gap-2 mb-2">
														<h4 className="font-bold text-lg truncate">
															{draft.title}
														</h4>
														{draft.isConfidential && (
															<span className="flex items-center gap-1 text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full flex-shrink-0">
																<Lock className="h-3 w-3" />
																Confidential
															</span>
														)}
													</div>
													{draft.description && (
														<p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-3">
															{draft.description}
														</p>
													)}
													<div className="flex items-center gap-4 text-xs text-neutral-500">
														<span className="flex items-center gap-1">
															<Calendar className="h-3 w-3" />
															{draft.savedAt.toLocaleString()}
														</span>
														{draft.category && (
															<span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
																{draft.category}
															</span>
														)}
														{draft.tags.length > 0 && (
															<span className="flex items-center gap-1">
																<Tag className="h-3 w-3" />
																{draft.tags.length} tags
															</span>
														)}
														{draft.files.length > 0 && (
															<span className="flex items-center gap-1">
																<Upload className="h-3 w-3" />
																{draft.files.length} files
															</span>
														)}
													</div>
												</div>
												<div className="flex flex-col gap-2 flex-shrink-0">
													<Button
														size="sm"
														onClick={() => loadDraft(draft)}
														className="whitespace-nowrap"
													>
														Load
													</Button>
													<Button
														size="sm"
														variant="outline"
														onClick={() => deleteDraft(draft.id)}
														className="text-red-600 hover:text-red-700 whitespace-nowrap"
													>
														Delete
													</Button>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			)}

			{/* Link Resources Dialog */}
			{showLinkDialog && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
					<div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-md mx-4">
						<div className="p-6">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-xl font-bold flex items-center gap-2">
									<Link2 className="h-5 w-5 text-primary" />
									Add Link Resource
								</h3>
								<button
									onClick={() => {
										setShowLinkDialog(false)
										setLinkUrl('')
										setLinkTitle('')
									}}
									className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
								>
									<X className="h-5 w-5" />
								</button>
							</div>
							
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium mb-2">
										URL <span className="text-red-500">*</span>
									</label>
									<Input
										type="url"
										placeholder="https://example.com"
										value={linkUrl}
										onChange={(e) => setLinkUrl(e.target.value)}
										onKeyPress={(e) => e.key === 'Enter' && addLink()}
									/>
								</div>
								
								<div>
									<label className="block text-sm font-medium mb-2">
										Title (Optional)
									</label>
									<Input
										type="text"
										placeholder="Resource name or description"
										value={linkTitle}
										onChange={(e) => setLinkTitle(e.target.value)}
										onKeyPress={(e) => e.key === 'Enter' && addLink()}
									/>
								</div>
								
								<div className="flex items-center gap-2 pt-2">
									<Button
										onClick={addLink}
										className="flex-1 justify-center"
									>
										Add Link
									</Button>
									<Button
										variant="outline"
										onClick={() => {
											setShowLinkDialog(false)
											setLinkUrl('')
											setLinkTitle('')
										}}
										className="flex-1 justify-center"
									>
										Cancel
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Decision Issue Dialog */}
			{showDecisionDialog && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
					<Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
						<CardHeader className="border-b border-neutral-200 dark:border-neutral-800 sticky top-0 bg-white dark:bg-neutral-900 z-10">
							<div className="flex items-center justify-between">
								<h3 className="text-xl font-bold flex items-center gap-2">
									<AlertCircle className="h-6 w-6 text-orange-600" />
									Create Decision Issue
								</h3>
								<button
									onClick={() => setShowDecisionDialog(false)}
									className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
								>
									<X className="h-5 w-5" />
								</button>
							</div>
							<p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
								Request decision from team members or AI assistance
							</p>
						</CardHeader>
						<CardContent className="p-6">
							<div className="space-y-5">
								{/* Title */}
								<div>
									<label className="block text-sm font-medium mb-2">
										Issue Title <span className="text-red-500">*</span>
									</label>
									<Input
										value={decisionTitle}
										onChange={(e) => setDecisionTitle(e.target.value)}
										placeholder="e.g., Should we migrate to microservices architecture?"
										className="text-base"
									/>
								</div>

								{/* Description */}
								<div>
									<label className="block text-sm font-medium mb-2">
										Description <span className="text-red-500">*</span>
									</label>
									<Textarea
										value={decisionDescription}
										onChange={(e) => setDecisionDescription(e.target.value)}
										placeholder="Provide context, options, and any relevant information for decision makers..."
										rows={6}
										className="resize-none"
									/>
								</div>

								{/* Priority */}
								<div>
									<label className="block text-sm font-medium mb-2">Priority</label>
									<div className="grid grid-cols-4 gap-2">
										{(['low', 'medium', 'high', 'urgent'] as const).map((priority) => (
											<button
												key={priority}
												onClick={() => setDecisionPriority(priority)}
												className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
													decisionPriority === priority
														? priority === 'urgent'
															? 'bg-red-600 text-white'
															: priority === 'high'
															? 'bg-orange-600 text-white'
															: priority === 'medium'
															? 'bg-yellow-600 text-white'
															: 'bg-blue-600 text-white'
														: 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'
												}`}
											>
												{priority.charAt(0).toUpperCase() + priority.slice(1)}
											</button>
										))}
									</div>
								</div>

								{/* Assignees */}
								<div>
									<label className="block text-sm font-medium mb-2">
										<UsersIcon className="inline h-4 w-4 mr-1" />
										Assign to Team Members
									</label>
									<div className="flex gap-2 mb-3">
										<Input
											value={assigneeInput}
											onChange={(e) => setAssigneeInput(e.target.value)}
											onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAssignee())}
											placeholder="Enter name or email"
											className="flex-1"
										/>
										<Button onClick={handleAddAssignee} size="sm">
											<Plus className="h-4 w-4" />
										</Button>
									</div>
									{decisionAssignees.length > 0 && (
										<div className="flex flex-wrap gap-2">
											{decisionAssignees.map((assignee) => (
												<span
													key={assignee}
													className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm"
												>
													{assignee}
													<button onClick={() => handleRemoveAssignee(assignee)}>
														<X className="h-3 w-3" />
													</button>
												</span>
											))}
										</div>
									)}
								</div>

								{/* AI Assistance */}
								<div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
									<label className="flex items-center gap-3 cursor-pointer">
										<input
											type="checkbox"
											checked={decisionUseAI}
											onChange={(e) => setDecisionUseAI(e.target.checked)}
											className="w-5 h-5 rounded border-purple-300 text-purple-600 focus:ring-purple-500"
										/>
										<div className="flex-1">
											<div className="flex items-center gap-2 font-medium text-purple-900 dark:text-purple-100">
												<Brain className="h-5 w-5" />
												Request AI Analysis
											</div>
											<p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
												AI will analyze the issue and provide recommendations based on data and best practices
											</p>
										</div>
									</label>
								</div>

								{/* Deadline */}
								<div>
									<label className="block text-sm font-medium mb-2">
										<Calendar className="inline h-4 w-4 mr-1" />
										Decision Deadline (Optional)
									</label>
									<Input
										type="date"
										value={decisionDeadline}
										onChange={(e) => setDecisionDeadline(e.target.value)}
										min={new Date().toISOString().split('T')[0]}
									/>
								</div>

								{/* Actions */}
								<div className="flex items-center gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
									<Button onClick={handleCreateDecisionIssue} className="flex-1">
										<AlertCircle className="h-4 w-4 mr-2" />
										Create Issue
									</Button>
									<Button
										variant="outline"
										onClick={() => setShowDecisionDialog(false)}
										className="flex-1"
									>
										Cancel
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	)
}
