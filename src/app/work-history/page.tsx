import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import DevMemo from '../../components/dev/DevMemo'
import { DEV_MEMOS } from '../../constants/devMemos'
import { EmptyState } from '../../components/common/EmptyState'
import { LoadingState } from '../../components/common/LoadingState'
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts'
import {
	FileText,
	Calendar,
	Clock,
	Tag,
	Upload,
	Link2,
	Search,
	ChevronDown,
	ChevronUp,
	Edit2,
	Trash2,
	Download,
	Eye,
	FolderKanban,
	Target,
	Filter,
	TrendingUp,
	BarChart3,
} from 'lucide-react'
import Input from '../../components/ui/Input'
import { toast } from 'sonner'

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

interface WorkEntry {
	id: string
	title: string
	description: string
	category: string
	projectId?: string
	objectiveId?: string
	tags: string[]
	date: Date
	duration: string
	files: UploadedFile[]
	links: LinkedResource[]
	status: 'draft' | 'submitted'
}

export default function WorkHistoryPage() {
	const navigate = useNavigate()
	const [entries, setEntries] = useState<WorkEntry[]>([])
	const [filteredEntries, setFilteredEntries] = useState<WorkEntry[]>([])
	const [expandedEntries, setExpandedEntries] = useState<string[]>([])
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedCategory, setSelectedCategory] = useState<string>('all')
	const [selectedProject, setSelectedProject] = useState<string>('all')
	const [selectedObjective, setSelectedObjective] = useState<string>('all')
	const [sortBy, setSortBy] = useState<'date' | 'title'>('date')
	const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([])
	const [objectives, setObjectives] = useState<Array<{ id: string; title: string }>>([])
	const [showFilters, setShowFilters] = useState(false)
	const [loading, setLoading] = useState(true)

	// Keyboard shortcuts
	useKeyboardShortcuts({
		newWork: () => navigate('/app/input'),
		goToDashboard: () => navigate('/app/dashboard'),
	})

	// Categories
	const categories = [
		{ id: 'all', label: 'All', color: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400' },
		{ id: 'development', label: 'Development', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
		{ id: 'meeting', label: 'Meeting', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
		{ id: 'research', label: 'Research', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
		{ id: 'documentation', label: 'Documentation', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
		{ id: 'review', label: 'Review', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' },
		{ id: 'other', label: 'Other', color: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400' },
	]

	// Load entries from localStorage
	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true)
				// Load projects
				const savedProjects = localStorage.getItem('projects')
				if (savedProjects) {
					const parsedProjects = JSON.parse(savedProjects).map((p: any) => ({
						id: p.id,
						name: p.name,
					}))
					setProjects(parsedProjects)
				}

				// Load OKR objectives (mock for now)
				const mockObjectives = [
					{ id: '1', title: 'Increase Product Market Fit' },
					{ id: '2', title: 'Scale Revenue Growth' },
					{ id: '3', title: 'Enhance Team Productivity' },
				]
				setObjectives(mockObjectives)

				const saved = localStorage.getItem('workEntries')
				if (saved) {
					const parsed = JSON.parse(saved)
					const entriesWithDates = parsed.map((entry: any) => ({
						...entry,
						date: new Date(entry.date),
						links: entry.links?.map((link: any) => ({
							...link,
							addedAt: new Date(link.addedAt),
						})) || [],
					}))
					setEntries(entriesWithDates)
				} else {
				// Mock data for demonstration
				const mockEntries: WorkEntry[] = [
					{
						id: '1',
						title: 'Implemented User Authentication',
						description: 'Completed the user authentication module with JWT tokens and refresh token mechanism. Implemented login, logout, and password reset functionality.',
						category: 'development',
						projectId: '1',
						objectiveId: '1',
						tags: ['authentication', 'security', 'backend'],
						date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
						duration: '4h 30m',
						files: [
							{ id: 'f1', name: 'auth-diagram.png', size: 245000, type: 'image/png', url: '#' },
							{ id: 'f2', name: 'test-results.pdf', size: 128000, type: 'application/pdf', url: '#' },
						],
						links: [
							{ id: 'l1', url: 'https://github.com/project/pull/123', title: 'Pull Request #123', addedAt: new Date() },
						],
						status: 'submitted',
					},
					{
						id: '2',
						title: 'Weekly Team Meeting',
						description: 'Discussed Q4 roadmap and sprint planning. Key decisions:\n- Move to bi-weekly sprints\n- Focus on performance optimization\n- Allocate resources for documentation',
						category: 'meeting',
						projectId: '2',
						objectiveId: '3',
						tags: ['planning', 'team', 'roadmap'],
						date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
						duration: '1h 30m',
						files: [],
						links: [
							{ id: 'l2', url: 'https://docs.google.com/meeting-notes', title: 'Meeting Notes', addedAt: new Date() },
						],
						status: 'submitted',
					},
					{
						id: '3',
						title: 'Research: State Management Solutions',
						description: 'Evaluated different state management solutions for the frontend:\n- Redux Toolkit\n- Zustand\n- Jotai\n\nRecommendation: Zustand for its simplicity and performance.',
						category: 'research',
						objectiveId: '1',
						tags: ['frontend', 'state-management', 'evaluation'],
						date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
						duration: '3h',
						files: [
							{ id: 'f3', name: 'comparison-table.xlsx', size: 45000, type: 'application/vnd.ms-excel', url: '#' },
						],
						links: [],
						status: 'submitted',
					},
				]
					setEntries(mockEntries)
					localStorage.setItem('workEntries', JSON.stringify(mockEntries))
				}
			} catch (error) {
				console.error('Failed to load work entries:', error)
			} finally {
				setLoading(false)
			}
		}
		
		loadData()
	}, [])

	// Filter and sort entries
	useEffect(() => {
		let filtered = [...entries]

		// Filter by search query
		if (searchQuery) {
			filtered = filtered.filter(
				(entry) =>
					entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
					entry.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
			)
		}

		// Filter by category
		if (selectedCategory !== 'all') {
			filtered = filtered.filter((entry) => entry.category === selectedCategory)
		}

		// Filter by project
		if (selectedProject !== 'all') {
			filtered = filtered.filter((entry) => entry.projectId === selectedProject)
		}

		// Filter by objective
		if (selectedObjective !== 'all') {
			filtered = filtered.filter((entry) => entry.objectiveId === selectedObjective)
		}

		// Sort
		filtered.sort((a, b) => {
			if (sortBy === 'date') {
				return b.date.getTime() - a.date.getTime()
			} else {
				return a.title.localeCompare(b.title)
			}
		})

		setFilteredEntries(filtered)
	}, [entries, searchQuery, selectedCategory, selectedProject, selectedObjective, sortBy])

	// Calculate statistics
	const statistics = useMemo(() => {
		const totalEntries = filteredEntries.length
		
		// This week's entries
		const oneWeekAgo = new Date()
		oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
		const thisWeekEntries = filteredEntries.filter(e => e.date >= oneWeekAgo)
		
		// Calculate total hours this week
		const parseTime = (duration: string) => {
			if (!duration) return 0
			const match = duration.match(/(\d+)h?\s*(\d+)?m?/)
			if (!match) return 0
			const hours = parseInt(match[1] || '0')
			const minutes = parseInt(match[2] || '0')
			return hours + minutes / 60
		}
		
		const totalHoursThisWeek = thisWeekEntries.reduce((sum, entry) => {
			return sum + parseTime(entry.duration || '')
		}, 0)
		
		// Most active project
		const projectCounts: Record<string, number> = {}
		filteredEntries.forEach(entry => {
			if (entry.projectId) {
				projectCounts[entry.projectId] = (projectCounts[entry.projectId] || 0) + 1
			}
		})
		const mostActiveProjectId = Object.entries(projectCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
		const mostActiveProject = mostActiveProjectId 
			? { name: projects.find(p => p.id === mostActiveProjectId)?.name || 'Unknown', count: projectCounts[mostActiveProjectId] }
			: null
		
		// Most active goal
		const goalCounts: Record<string, number> = {}
		filteredEntries.forEach(entry => {
			if (entry.objectiveId) {
				goalCounts[entry.objectiveId] = (goalCounts[entry.objectiveId] || 0) + 1
			}
		})
		const mostActiveGoalId = Object.entries(goalCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
		const mostActiveGoal = mostActiveGoalId
			? { name: objectives.find(o => o.id === mostActiveGoalId)?.title || 'Unknown', count: goalCounts[mostActiveGoalId] }
			: null
		
		// Average time per entry
		const totalHours = filteredEntries.reduce((sum, entry) => sum + parseTime(entry.duration || ''), 0)
		const avgTimePerEntry = totalEntries > 0 ? totalHours / totalEntries : 0
		
		return {
			totalEntries,
			thisWeekCount: thisWeekEntries.length,
			totalHoursThisWeek: totalHoursThisWeek.toFixed(1),
			mostActiveProject,
			mostActiveGoal,
			avgTimePerEntry: avgTimePerEntry.toFixed(1),
		}
	}, [filteredEntries, projects, objectives])

	const toggleExpand = (id: string) => {
		setExpandedEntries((prev) =>
			prev.includes(id) ? prev.filter((entryId) => entryId !== id) : [...prev, id]
		)
	}

	const handleEdit = (entry: WorkEntry) => {
		// Store entry data in sessionStorage for editing
		sessionStorage.setItem('workInputEditData', JSON.stringify({
			entryId: entry.id,
			title: entry.title,
			description: entry.description,
			category: entry.category,
			projectId: entry.projectId,
			objectiveId: entry.objectiveId,
			tags: entry.tags,
			files: entry.files,
			links: entry.links,
		}))
		
		toast.success('Opening editor...', {
			description: 'Navigating to Work Input page to edit this entry',
		})
		
		// Navigate to input page
		navigate('/input')
	}

	const handleDelete = (id: string) => {
		const entry = entries.find(e => e.id === id)
		if (!entry) {
			toast.error('Entry not found')
			return
		}
		
		// Build detailed confirmation message
		let confirmMessage = `Are you sure you want to delete this work entry?\n\nTitle: ${entry.title}\n`
		
		if (entry.projectId) {
			const projectName = projects.find(p => p.id === entry.projectId)?.name
			confirmMessage += `\nProject: ${projectName || 'Unknown'}`
		}
		
		if (entry.objectiveId) {
			const objectiveName = objectives.find(o => o.id === entry.objectiveId)?.title
			confirmMessage += `\nGoal: ${objectiveName || 'Unknown'}`
		}
		
		confirmMessage += '\n\nThis action cannot be undone.'
		
		if (confirm(confirmMessage)) {
			const updated = entries.filter((entry) => entry.id !== id)
			setEntries(updated)
			localStorage.setItem('workEntries', JSON.stringify(updated))
			
			toast.success('Work entry deleted', {
				description: 'The entry has been permanently removed',
			})
		}
	}

	const getCategoryColor = (categoryId: string) => {
		return categories.find((cat) => cat.id === categoryId)?.color || categories[0].color
	}

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return '0 Bytes'
		const k = 1024
		const sizes = ['Bytes', 'KB', 'MB', 'GB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
	}

	const formatDate = (date: Date) => {
		const now = new Date()
		const diff = now.getTime() - date.getTime()
		const days = Math.floor(diff / (1000 * 60 * 60 * 24))

		if (days === 0) return 'Today'
		if (days === 1) return 'Yesterday'
		if (days < 7) return `${days} days ago`
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
	}

	if (loading) {
		return (
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold flex items-center gap-3">
							<FileText className="h-8 w-8 text-primary" />
							Work History
						</h1>
						<p className="mt-2 text-neutral-600 dark:text-neutral-400">
							View and manage your submitted work entries
						</p>
					</div>
				</div>
				<LoadingState type="list" count={5} />
			</div>
		)
	}

	return (
		<>
			<DevMemo content={DEV_MEMOS.WORK_HISTORY} pagePath="/app/work-history/page.tsx" />
			<div className="space-y-6">
				{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold flex items-center gap-3">
						<FileText className="h-8 w-8 text-primary" />
						Work History
					</h1>
					<p className="mt-2 text-neutral-600 dark:text-neutral-400">
						View and manage your submitted work entries
					</p>
				</div>
			</div>

			{/* Statistics Dashboard */}
			<Card className="bg-linear-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 border-primary/20">
				<CardContent className="p-6">
					<div className="flex items-center gap-2 mb-4">
						<BarChart3 className="h-5 w-5 text-primary" />
						<h3 className="font-bold text-lg">Work Statistics</h3>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
						<div className="bg-white/50 dark:bg-neutral-900/50 p-4 rounded-xl">
							<div className="flex items-center gap-2 mb-2">
								<FileText className="h-4 w-4 text-neutral-500" />
								<p className="text-xs text-neutral-600 dark:text-neutral-400">Total Entries</p>
							</div>
							<p className="text-2xl font-bold text-primary">{statistics.totalEntries}</p>
						</div>
						<div className="bg-white/50 dark:bg-neutral-900/50 p-4 rounded-xl">
							<div className="flex items-center gap-2 mb-2">
								<Calendar className="h-4 w-4 text-neutral-500" />
								<p className="text-xs text-neutral-600 dark:text-neutral-400">This Week</p>
							</div>
							<p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{statistics.thisWeekCount}</p>
							<p className="text-xs text-neutral-500 mt-1">{statistics.totalHoursThisWeek}h total</p>
						</div>
						<div className="bg-white/50 dark:bg-neutral-900/50 p-4 rounded-xl">
							<div className="flex items-center gap-2 mb-2">
								<Clock className="h-4 w-4 text-neutral-500" />
								<p className="text-xs text-neutral-600 dark:text-neutral-400">Avg Time</p>
							</div>
							<p className="text-2xl font-bold text-green-600 dark:text-green-400">{statistics.avgTimePerEntry}h</p>
							<p className="text-xs text-neutral-500 mt-1">per entry</p>
						</div>
						<div className="bg-white/50 dark:bg-neutral-900/50 p-4 rounded-xl col-span-2 md:col-span-1 lg:col-span-1">
							<div className="flex items-center gap-2 mb-2">
								<FolderKanban className="h-4 w-4 text-neutral-500" />
								<p className="text-xs text-neutral-600 dark:text-neutral-400">Top Project</p>
							</div>
							{statistics.mostActiveProject ? (
								<>
									<p className="text-sm font-bold text-purple-600 dark:text-purple-400 truncate">
										{statistics.mostActiveProject.name}
									</p>
									<p className="text-xs text-neutral-500 mt-1">{statistics.mostActiveProject.count} entries</p>
								</>
							) : (
								<p className="text-sm text-neutral-500">No data</p>
							)}
						</div>
						<div className="bg-white/50 dark:bg-neutral-900/50 p-4 rounded-xl col-span-2 md:col-span-1 lg:col-span-2">
							<div className="flex items-center gap-2 mb-2">
								<Target className="h-4 w-4 text-neutral-500" />
								<p className="text-xs text-neutral-600 dark:text-neutral-400">Top Goal</p>
							</div>
							{statistics.mostActiveGoal ? (
								<>
									<p className="text-sm font-bold text-green-600 dark:text-green-400 truncate">
										{statistics.mostActiveGoal.name}
									</p>
									<p className="text-xs text-neutral-500 mt-1">{statistics.mostActiveGoal.count} entries</p>
								</>
							) : (
								<p className="text-sm text-neutral-500">No data</p>
							)}
						</div>
					</div>
					{filteredEntries.length !== entries.length && (
						<div className="mt-4 pt-4 border-t border-primary/20">
							<p className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
								<TrendingUp className="h-3 w-3" />
								Statistics are based on filtered results ({filteredEntries.length} of {entries.length} entries)
							</p>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Filters */}
			<Card>
				<CardContent className="p-6">
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-semibold flex items-center gap-2">
							<Filter className="h-4 w-4" />
							Filters
						</h3>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setShowFilters(!showFilters)}
							className="flex items-center gap-2"
						>
							{showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
							{showFilters ? 'Hide' : 'Show'} Advanced Filters
						</Button>
					</div>

					<div className="space-y-4">
						{/* Basic Filters */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							{/* Search */}
							<div className="lg:col-span-2">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
									<Input
										placeholder="Search by title, description, or tags..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="pl-10"
									/>
								</div>
							</div>

							{/* Category Filter */}
							<div>
								<select
									value={selectedCategory}
									onChange={(e) => setSelectedCategory(e.target.value)}
									className="w-full h-11 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary"
								>
									{categories.map((cat) => (
										<option key={cat.id} value={cat.id}>
											{cat.label}
										</option>
									))}
								</select>
							</div>

							{/* Sort */}
							<div>
								<select
									value={sortBy}
									onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
									className="w-full h-11 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary"
								>
									<option value="date">Sort by Date</option>
									<option value="title">Sort by Title</option>
								</select>
							</div>
						</div>

						{/* Advanced Filters */}
						{showFilters && (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
								{/* Project Filter */}
								<div>
									<label className="block text-sm font-medium mb-2 flex items-center gap-2">
										<FolderKanban className="h-4 w-4" />
										Filter by Project
									</label>
									<select
										value={selectedProject}
										onChange={(e) => setSelectedProject(e.target.value)}
										className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary"
									>
										<option value="all">All Projects</option>
										{projects.map((project) => (
											<option key={project.id} value={project.id}>
												📁 {project.name}
											</option>
										))}
									</select>
								</div>

								{/* OKR Filter */}
								<div>
									<label className="block text-sm font-medium mb-2 flex items-center gap-2">
										<Target className="h-4 w-4" />
										Filter by Goal (OKR)
									</label>
									<select
										value={selectedObjective}
										onChange={(e) => setSelectedObjective(e.target.value)}
										className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary"
									>
										<option value="all">All Goals</option>
										{objectives.map((objective) => (
											<option key={objective.id} value={objective.id}>
												🎯 {objective.title}
											</option>
										))}
									</select>
								</div>
							</div>
						)}
					</div>

					{/* Active Filters Summary */}
					{(searchQuery || selectedCategory !== 'all' || selectedProject !== 'all' || selectedObjective !== 'all') && (
						<div className="mt-4 flex items-center gap-2 flex-wrap">
							<span className="text-sm text-neutral-600 dark:text-neutral-400">Active filters:</span>
							{searchQuery && (
								<span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
									Search: "{searchQuery}"
									<button onClick={() => setSearchQuery('')} className="hover:text-primary/70">
										×
									</button>
								</span>
							)}
							{selectedCategory !== 'all' && (
								<span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
									Category: {categories.find((c) => c.id === selectedCategory)?.label}
									<button onClick={() => setSelectedCategory('all')} className="hover:text-primary/70">
										×
									</button>
								</span>
							)}
							{selectedProject !== 'all' && (
								<span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-sm">
									📁 Project: {projects.find((p) => p.id === selectedProject)?.name}
									<button onClick={() => setSelectedProject('all')} className="hover:opacity-70">
										×
									</button>
								</span>
							)}
							{selectedObjective !== 'all' && (
								<span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-sm">
									🎯 Goal: {objectives.find((o) => o.id === selectedObjective)?.title}
									<button onClick={() => setSelectedObjective('all')} className="hover:opacity-70">
										×
									</button>
								</span>
							)}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Results Summary */}
			<div className="flex items-center justify-between">
				<p className="text-sm text-neutral-600 dark:text-neutral-400">
					Showing {filteredEntries.length} of {entries.length} entries
				</p>
			</div>

			{/* Entries List */}
			{filteredEntries.length === 0 ? (
				<EmptyState
					icon={<FileText className="h-12 w-12" />}
					title="No Work Entries Found"
					description={
						searchQuery || selectedCategory !== 'all' || selectedProject !== 'all' || selectedObjective !== 'all'
							? 'Try adjusting your filters to see more results'
							: 'Start logging your work to build your history'
					}
					action={
						!(searchQuery || selectedCategory !== 'all' || selectedProject !== 'all' || selectedObjective !== 'all') ? (
							<Button onClick={() => navigate('/app/input')}>
								<FileText className="h-4 w-4 mr-2" />
								Add Work Entry
							</Button>
						) : undefined
					}
				/>
			) : (
				<div className="space-y-4">
					{filteredEntries.map((entry) => {
						const isExpanded = expandedEntries.includes(entry.id)

						return (
							<Card key={entry.id} className="hover:shadow-lg transition-shadow">
								<CardContent className="p-6">
									{/* Header */}
									<div className="flex items-start justify-between mb-4">
										<div className="flex-1">
											<div className="flex items-center gap-3 mb-2">
												<button
													onClick={() => toggleExpand(entry.id)}
													className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
												>
													{isExpanded ? (
														<ChevronUp className="h-5 w-5" />
													) : (
														<ChevronDown className="h-5 w-5" />
													)}
												</button>
												<h3 className="text-xl font-bold flex-1">{entry.title}</h3>
												<span className={`text-xs font-medium px-3 py-1 rounded-full ${getCategoryColor(entry.category)}`}>
													{categories.find((c) => c.id === entry.category)?.label}
												</span>
											</div>
											<div className="flex items-center gap-4 ml-8 text-sm text-neutral-600 dark:text-neutral-400 flex-wrap">
												<span className="flex items-center gap-1">
													<Calendar className="h-4 w-4" />
													{formatDate(entry.date)}
												</span>
												{entry.duration && (
													<span className="flex items-center gap-1">
														<Clock className="h-4 w-4" />
														{entry.duration}
													</span>
												)}
												{entry.files.length > 0 && (
													<span className="flex items-center gap-1">
														<Upload className="h-4 w-4" />
														{entry.files.length} file{entry.files.length > 1 ? 's' : ''}
													</span>
												)}
												{entry.links.length > 0 && (
													<span className="flex items-center gap-1">
														<Link2 className="h-4 w-4" />
														{entry.links.length} link{entry.links.length > 1 ? 's' : ''}
													</span>
												)}
												{entry.projectId && (
													<span className="flex items-center gap-1 text-xs px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-full">
														<FolderKanban className="h-3 w-3" />
														{projects.find((p) => p.id === entry.projectId)?.name || 'Project'}
													</span>
												)}
												{entry.objectiveId && (
													<span className="flex items-center gap-1 text-xs px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
														<Target className="h-3 w-3" />
														{objectives.find((o) => o.id === entry.objectiveId)?.title || 'Goal'}
													</span>
												)}
											</div>
										</div>
										<div className="flex items-center gap-2 ml-4">
											<Button variant="outline" size="sm" onClick={() => handleEdit(entry)}>
												<Edit2 className="h-4 w-4" />
											</Button>
											<Button variant="outline" size="sm" onClick={() => handleDelete(entry.id)}>
												<Trash2 className="h-4 w-4 text-red-500" />
											</Button>
										</div>
									</div>

									{/* Preview */}
									{!isExpanded && (
										<div className="ml-8">
											<p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
												{entry.description}
											</p>
											{entry.tags.length > 0 && (
												<div className="flex items-center gap-2 mt-3">
													<Tag className="h-4 w-4 text-neutral-400" />
													<div className="flex flex-wrap gap-2">
														{entry.tags.slice(0, 3).map((tag) => (
															<span
																key={tag}
																className="text-xs px-2 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
															>
																{tag}
															</span>
														))}
														{entry.tags.length > 3 && (
															<span className="text-xs text-neutral-500">
																+{entry.tags.length - 3} more
															</span>
														)}
													</div>
												</div>
											)}
										</div>
									)}

									{/* Expanded Content */}
									{isExpanded && (
										<div className="ml-8 space-y-4 mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
											{/* Description */}
											<div>
												<h4 className="font-bold text-sm mb-2">Description</h4>
												<p className="text-sm text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap">
													{entry.description}
												</p>
											</div>

											{/* Tags */}
											{entry.tags.length > 0 && (
												<div>
													<h4 className="font-bold text-sm mb-2 flex items-center gap-2">
														<Tag className="h-4 w-4" />
														Tags
													</h4>
													<div className="flex flex-wrap gap-2">
														{entry.tags.map((tag) => (
															<span
																key={tag}
																className="text-xs px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
															>
																{tag}
															</span>
														))}
													</div>
												</div>
											)}

											{/* Files */}
											{entry.files.length > 0 && (
												<div>
													<h4 className="font-bold text-sm mb-2 flex items-center gap-2">
														<Upload className="h-4 w-4" />
														Attached Files
													</h4>
													<div className="space-y-2">
														{entry.files.map((file) => (
															<div
																key={file.id}
																className="flex items-center justify-between p-3 border border-neutral-200 dark:border-neutral-800 rounded-xl"
															>
																<div className="flex items-center gap-3 flex-1 min-w-0">
																	<FileText className="h-5 w-5 text-primary flex-shrink-0" />
																	<div className="flex-1 min-w-0">
																		<p className="font-medium text-sm truncate">{file.name}</p>
																		<p className="text-xs text-neutral-600 dark:text-neutral-400">
																			{formatFileSize(file.size)}
																		</p>
																	</div>
																</div>
																<Button variant="outline" size="sm">
																	<Download className="h-4 w-4" />
																</Button>
															</div>
														))}
													</div>
												</div>
											)}

											{/* Links */}
											{entry.links.length > 0 && (
												<div>
													<h4 className="font-bold text-sm mb-2 flex items-center gap-2">
														<Link2 className="h-4 w-4" />
														Linked Resources
													</h4>
													<div className="space-y-2">
														{entry.links.map((link) => (
															<a
																key={link.id}
																href={link.url}
																target="_blank"
																rel="noopener noreferrer"
																className="flex items-center gap-3 p-3 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
															>
																<Link2 className="h-5 w-5 text-primary flex-shrink-0" />
																<div className="flex-1 min-w-0">
																	<p className="font-medium text-sm truncate">{link.title}</p>
																	<p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
																		{link.url}
																	</p>
																</div>
																<Eye className="h-4 w-4 text-neutral-400" />
															</a>
														))}
													</div>
												</div>
											)}
										</div>
									)}
								</CardContent>
							</Card>
						)
					})}
				</div>
			)}
			</div>
		</>
	)
}

