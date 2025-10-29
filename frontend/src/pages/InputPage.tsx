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
	Clock,
	CheckCircle2,
	Image as ImageIcon,
	FileSpreadsheet,
	File,
	Plus,
	Link2,
	ExternalLink
} from 'lucide-react'
import { toast } from 'sonner'

interface WorkEntry {
	id: string
	title: string
	description: string
	category: string
	tags: string[]
	date: Date
	duration: string
	files: UploadedFile[]
	links: LinkedResource[]
	status: 'draft' | 'submitted'
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

export default function InputPage() {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [category, setCategory] = useState('')
	const [tags, setTags] = useState<string[]>([])
	const [tagInput, setTagInput] = useState('')
	const [duration, setDuration] = useState('')
	const [files, setFiles] = useState<UploadedFile[]>([])
	const [links, setLinks] = useState<LinkedResource[]>([])
	const [isDragging, setIsDragging] = useState(false)
	const [recentEntries, setRecentEntries] = useState<WorkEntry[]>([])
	const [aiSuggestion, setAiSuggestion] = useState('')
	const [showLinkDialog, setShowLinkDialog] = useState(false)
	const [linkUrl, setLinkUrl] = useState('')
	const [linkTitle, setLinkTitle] = useState('')
	const fileInputRef = useRef<HTMLInputElement>(null)

	// Load from system settings
	const [categories, setCategories] = useState<Array<{ id: string; name: string; color: string; description: string }>>([])
	const [systemTags, setSystemTags] = useState<Array<{ id: string; name: string; category: string }>>([])
	const [templates, setTemplates] = useState<Array<{ id: string; title: string; description: string; category: string }>>([])

	// Load system settings
	useEffect(() => {
		try {
			const savedCategories = localStorage.getItem('workCategories')
			const savedTags = localStorage.getItem('workTags')
			const savedTemplates = localStorage.getItem('workTemplates')

			if (savedCategories) {
				setCategories(JSON.parse(savedCategories))
			}
			if (savedTags) {
				setSystemTags(JSON.parse(savedTags))
			}
			if (savedTemplates) {
				setTemplates(JSON.parse(savedTemplates))
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
			tags,
			date: new Date(),
			duration,
			files,
			links,
			status: 'submitted',
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
		setTags([])
		setDuration('')
		setFiles([])
		setLinks([])
		
		toast.success('Work entry submitted successfully!')
	}

	const saveDraft = () => {
		toast.success('Draft saved')
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
					<Button variant="outline" onClick={saveDraft}>
						Save Draft
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
					{/* Quick Templates */}
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<h2 className="text-lg font-bold">Quick Templates</h2>
								<Sparkles className="h-5 w-5 text-primary" />
							</div>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-2">
								{templates.length > 0 ? (
									templates.map((template) => (
										<button
											key={template.id}
											onClick={() => applyTemplate(template)}
											className="p-3 text-sm border border-neutral-200 dark:border-neutral-800 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors text-left"
										>
											{template.title}
										</button>
									))
								) : (
									<p className="col-span-4 text-sm text-neutral-600 dark:text-neutral-400 text-center py-4">
										No templates available. Add templates in System Settings.
									</p>
								)}
							</div>
						</CardContent>
					</Card>

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

							{/* Category & Duration */}
							<div className="grid grid-cols-2 gap-4">
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
								<div>
									<label className="block text-sm font-medium mb-2">
										<Clock className="inline h-4 w-4 mr-1" />
										Duration
									</label>
									<Input
										type="text"
										placeholder="e.g., 3 hours"
										value={duration}
										onChange={(e) => setDuration(e.target.value)}
									/>
								</div>
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
						</CardContent>
					</Card>
				</div>

				{/* Sidebar - 1 column */}
				<div className="space-y-6">
					{/* Quick Actions */}
					<Card>
						<CardHeader>
							<h2 className="text-lg font-bold">Quick Actions</h2>
						</CardHeader>
						<CardContent className="space-y-2">
							<button 
								onClick={() => setShowLinkDialog(true)}
								className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors text-left"
							>
								<Link2 className="h-5 w-5 text-primary" />
								<div>
									<p className="font-medium text-sm">Link Resources</p>
									<p className="text-xs text-neutral-600 dark:text-neutral-400">
										Add external links
									</p>
								</div>
							</button>
							<button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors text-left">
								<CheckCircle2 className="h-5 w-5 text-primary" />
								<div>
									<p className="font-medium text-sm">Create Task</p>
									<p className="text-xs text-neutral-600 dark:text-neutral-400">
										Convert to task
									</p>
								</div>
							</button>
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
								<li>• Track time spent on tasks</li>
							</ul>
						</CardContent>
					</Card>
				</div>
			</div>

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
		</div>
	)
}
