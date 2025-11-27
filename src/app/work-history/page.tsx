import { storage } from '../../utils/storage'
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { PageHeader } from '../../components/common/PageHeader'
import { EmptyState } from '../../components/common/EmptyState'
import { LoadingState } from '../../components/common/LoadingState'
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts'
import { useAuth } from '../../context/AuthContext'
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
	Eye,
	FolderKanban,
	Filter,
	TrendingUp,
	BarChart3,
	User,
	Users,
	Building2,
	Plus,
} from 'lucide-react'
import Input from '../../components/ui/Input'
import { toast } from 'sonner'
import Toaster from '../../components/ui/Toaster'
import type { WorkEntry } from '../../types/common.types'
import { parseWorkEntriesFromStorage } from '../../utils/mappers'
import { toDate } from '../../utils/dateUtils'

export default function WorkHistoryPage() {
	const navigate = useNavigate()
	const { user } = useAuth()
	const [entries, setEntries] = useState<WorkEntry[]>([])
	const [filteredEntries, setFilteredEntries] = useState<WorkEntry[]>([])
	const [expandedEntries, setExpandedEntries] = useState<string[]>([])
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedCategory, setSelectedCategory] = useState<string>('all')
	const [selectedProject, setSelectedProject] = useState<string>('all')
	const [selectedDepartment, setSelectedDepartment] = useState<string>('all')
	const [selectedUser, setSelectedUser] = useState<string>('all') // 'all', 'me', or specific user ID
	const [sortBy, setSortBy] = useState<'date' | 'title'>('date')
	const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([])
	const [departments, setDepartments] = useState<string[]>([])
	const [users, setUsers] = useState<Array<{ id: string; name: string; department: string }>>([])
	const [showFilters, setShowFilters] = useState(false)
	const [loading, setLoading] = useState(true)
	
	// Get current user ID from AuthContext
	const currentUserId = user?.id || ''

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
				const projectsData = storage.get<any[]>('projects')
				if (projectsData && projectsData.length > 0) {
					setProjects(projectsData.map((p: any) => ({ id: p.id, name: p.name })))
				} else {
					const mockProjects = [
						{ id: 'proj-1', name: 'Website Redesign' },
						{ id: 'proj-2', name: 'Mobile App Development' },
						{ id: 'proj-3', name: 'API Integration' },
					]
					setProjects(mockProjects)
				}

				// Load work entries
				const saved = storage.get<any[]>('workEntries')
				if (saved && saved.length > 0) {
					const entriesWithDates = parseWorkEntriesFromStorage(saved)
					setEntries(entriesWithDates)
					
					// Extract departments and users
					const depts = Array.from(new Set(entriesWithDates.map((e: WorkEntry) => e.department).filter(Boolean)))
					setDepartments(depts as string[])
					
					const uniqueUsers = Array.from(
						new Map(
							entriesWithDates
								.filter((e: WorkEntry) => e.submittedBy)
								.map((e: WorkEntry) => [
									e.submittedById || e.submittedBy,
									{ 
										id: e.submittedById || e.submittedBy || '', 
										name: e.submittedBy || '', 
										department: e.department || '' 
									}
								])
						).values()
					)
					setUsers(uniqueUsers as any)
				} else {
					// Enhanced mock data with multiple users from different departments
					const mockEntries: WorkEntry[] = [
						// John Doe - Engineering
						{
							id: 'work-1',
							title: 'Implemented User Authentication System',
							description: 'Completed the comprehensive user authentication module with JWT tokens, social login (Google, GitHub), password reset flow, and session management.',
							category: 'development',
							projectId: 'proj-2',
							projectName: 'Mobile App Development',
							tags: ['authentication', 'security', 'backend', 'jwt'],
							date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
							duration: '6h 30m',
							files: [
								{ id: 'f1', name: 'auth-flow-diagram.png', size: 245000, type: 'image/png', url: '#' },
								{ id: 'f2', name: 'test-coverage-report.pdf', size: 128000, type: 'application/pdf', url: '#' },
							],
							links: [
								{ id: 'l1', url: 'https://github.com/project/pull/123', title: 'Pull Request #123', addedAt: new Date() },
							],
							status: 'approved',
							submittedBy: 'John Doe',
							submittedById: 'user-1',
							department: 'Engineering',
						},
						// Sarah Chen - Product
						{
							id: 'work-2',
							title: 'Q4 2024 Product Roadmap Planning',
							description: 'Led the quarterly product roadmap planning session with stakeholders. Defined priorities, success metrics, and resource allocation for Q4 2024.',
							category: 'meeting',
							projectId: 'proj-1',
							projectName: 'Website Redesign',
							tags: ['planning', 'roadmap', 'strategy'],
							date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
							duration: '3h',
							files: [
								{ id: 'f3', name: 'q4-roadmap.pdf', size: 890000, type: 'application/pdf', url: '#' },
							],
							links: [],
							status: 'approved',
							submittedBy: 'Sarah Chen',
							submittedById: 'user-2',
							department: 'Product',
						},
						// Mike Johnson - Engineering
						{
							id: 'work-3',
							title: 'Fixed Payment Gateway Bug',
							description: 'Investigated and fixed the issue where payments were failing for certain international card types. Root cause was incorrect currency conversion logic.',
							category: 'development',
							projectId: 'proj-3',
							projectName: 'API Integration',
							tags: ['bugfix', 'payment', 'stripe'],
							date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
							duration: '4h',
							files: [],
							links: [
								{ id: 'l2', url: 'https://github.com/project/pull/124', title: 'PR #124: Payment Fix', addedAt: new Date() },
							],
							status: 'approved',
							submittedBy: 'Mike Johnson',
							submittedById: 'user-3',
							department: 'Engineering',
						},
						// Emily Davis - Design
						{
							id: 'work-4',
							title: 'Dashboard UI/UX Redesign',
							description: 'Redesigned the main dashboard with improved information architecture, better visual hierarchy, and modern UI components. Added dark mode support.',
							category: 'development',
							projectId: 'proj-1',
							projectName: 'Website Redesign',
							tags: ['ui', 'ux', 'design', 'figma'],
							date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
							duration: '8h',
							files: [
								{ id: 'f4', name: 'dashboard-mockup.png', size: 450000, type: 'image/png', url: '#' },
							],
							links: [
								{ id: 'l3', url: 'https://figma.com/dashboard-redesign', title: 'Figma Design File', addedAt: new Date() },
							],
							status: 'approved',
							submittedBy: 'Emily Davis',
							submittedById: 'user-4',
							department: 'Design',
						},
						// David Lee - Engineering
						{
							id: 'work-5',
							title: 'Database Performance Optimization',
							description: 'Optimized slow-running queries in the analytics database. Added indexes, refactored N+1 queries, and implemented caching. Achieved 70% performance improvement.',
							category: 'development',
							projectId: 'proj-3',
							projectName: 'API Integration',
							tags: ['database', 'performance', 'optimization', 'postgresql'],
							date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
							duration: '5h 30m',
							files: [
								{ id: 'f5', name: 'performance-metrics.png', size: 180000, type: 'image/png', url: '#' },
							],
							links: [],
							status: 'approved',
							submittedBy: 'David Lee',
							submittedById: 'user-5',
							department: 'Engineering',
						},
						// Lisa Park - Marketing
						{
							id: 'work-6',
							title: 'Q4 Marketing Campaign Strategy',
							description: 'Developed comprehensive marketing campaign strategy for Q4 including social media, content marketing, and paid advertising plans.',
							category: 'documentation',
							projectId: 'proj-1',
							projectName: 'Website Redesign',
							tags: ['marketing', 'strategy', 'campaign'],
							date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
							duration: '6h',
							files: [
								{ id: 'f6', name: 'marketing-strategy.pdf', size: 1200000, type: 'application/pdf', url: '#' },
							],
							links: [],
							status: 'approved',
							submittedBy: 'Lisa Park',
							submittedById: 'user-6',
							department: 'Marketing',
						},
						// Alex Kim - Engineering
						{
							id: 'work-7',
							title: 'CI/CD Pipeline Setup',
							description: 'Set up automated CI/CD pipeline with GitHub Actions. Includes linting, testing, security scanning, and automated deployments to staging and production.',
							category: 'development',
							projectId: 'proj-2',
							projectName: 'Mobile App Development',
							tags: ['ci-cd', 'devops', 'automation', 'github-actions'],
							date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
							duration: '10h',
							files: [
								{ id: 'f7', name: 'pipeline-diagram.png', size: 310000, type: 'image/png', url: '#' },
							],
							links: [
								{ id: 'l4', url: 'https://github.com/project/actions', title: 'GitHub Actions', addedAt: new Date() },
							],
							status: 'approved',
							submittedBy: 'Alex Kim',
							submittedById: 'user-7',
							department: 'Engineering',
						},
						// Rachel Green - Sales
						{
							id: 'work-8',
							title: 'Customer Onboarding Process Documentation',
							description: 'Created comprehensive documentation for the customer onboarding process including step-by-step guides, video tutorials, and FAQ.',
							category: 'documentation',
							projectId: 'proj-1',
							projectName: 'Website Redesign',
							tags: ['documentation', 'onboarding', 'customer-success'],
							date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
							duration: '4h 30m',
							files: [
								{ id: 'f8', name: 'onboarding-guide.pdf', size: 520000, type: 'application/pdf', url: '#' },
							],
							links: [],
							status: 'approved',
							submittedBy: 'Rachel Green',
							submittedById: 'user-8',
							department: 'Sales',
						},
						// Tom Wilson - Operations
						{
							id: 'work-9',
							title: 'Server Infrastructure Audit',
							description: 'Conducted comprehensive audit of server infrastructure including security review, performance analysis, and cost optimization recommendations.',
							category: 'review',
							projectId: 'proj-3',
							projectName: 'API Integration',
							tags: ['infrastructure', 'security', 'audit'],
							date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
							duration: '12h',
							files: [
								{ id: 'f9', name: 'infrastructure-audit.pdf', size: 1800000, type: 'application/pdf', url: '#' },
							],
							links: [],
							status: 'approved',
							submittedBy: 'Tom Wilson',
							submittedById: 'user-9',
							department: 'Operations',
						},
						// Chris Brown - Engineering
						{
							id: 'work-10',
							title: 'Mobile App Performance Optimization',
							description: 'Optimized mobile app performance by implementing code splitting, lazy loading, and reducing bundle size. Achieved 60% improvement in startup time.',
							category: 'development',
							projectId: 'proj-2',
							projectName: 'Mobile App Development',
							tags: ['performance', 'mobile', 'optimization', 'react-native'],
							date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
							duration: '11h',
							files: [
								{ id: 'f10', name: 'performance-report.pdf', size: 420000, type: 'application/pdf', url: '#' },
							],
							links: [],
							status: 'approved',
							submittedBy: 'Chris Brown',
							submittedById: 'user-10',
							department: 'Engineering',
						},
						// Jennifer Wang - Engineering
						{
							id: 'work-11',
							title: 'Stripe Payment Integration',
							description: 'Integrated Stripe payment gateway with support for credit cards, digital wallets, and subscription billing. Implemented webhook handlers and refund functionality.',
							category: 'development',
							projectId: 'proj-3',
							projectName: 'API Integration',
							tags: ['payment', 'stripe', 'integration', 'backend'],
							date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
							duration: '9h 30m',
							files: [
								{ id: 'f11', name: 'stripe-integration-guide.pdf', size: 340000, type: 'application/pdf', url: '#' },
							],
							links: [
								{ id: 'l5', url: 'https://github.com/project/pull/156', title: 'PR #156', addedAt: new Date() },
							],
							status: 'approved',
							submittedBy: 'Jennifer Wang',
							submittedById: 'user-11',
							department: 'Engineering',
						},
						// Emma Thompson - Product
						{
							id: 'work-12',
							title: 'User Research Interviews',
							description: 'Conducted 15 user interviews to gather feedback on new features. Key findings documented with actionable recommendations for product improvements.',
							category: 'research',
							projectId: 'proj-1',
							projectName: 'Website Redesign',
							tags: ['user-research', 'interviews', 'ux'],
							date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
							duration: '12h',
							files: [
								{ id: 'f12', name: 'research-findings.pdf', size: 780000, type: 'application/pdf', url: '#' },
							],
							links: [],
							status: 'approved',
							submittedBy: 'Emma Thompson',
							submittedById: 'user-12',
							department: 'Product',
						},
					]

					setEntries(mockEntries)
					
					// Extract departments
					const depts = Array.from(new Set(mockEntries.map(e => e.department).filter(Boolean)))
					setDepartments(depts as string[])
					
					// Extract unique users
					const uniqueUsers = Array.from(
						new Map(
							mockEntries
								.filter(e => e.submittedBy)
								.map(e => [
									e.submittedById,
									{ id: e.submittedById || '', name: e.submittedBy || '', department: e.department || '' }
								])
						).values()
					)
					setUsers(uniqueUsers as any)
				}
			} catch (error) {
				console.error('Error loading work history:', error)
				toast.error('Failed to load work history')
			} finally {
				setLoading(false)
			}
		}

		loadData()
	}, [])

	// Filter and search entries
	useEffect(() => {
		let filtered = entries

		// Search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase()
			filtered = filtered.filter(
				(entry) =>
					entry.title.toLowerCase().includes(query) ||
					entry.description.toLowerCase().includes(query) ||
					entry.tags?.some((tag) => tag.toLowerCase().includes(query)) ||
					entry.submittedBy?.toLowerCase().includes(query)
			)
		}

		// Category filter
		if (selectedCategory !== 'all') {
			filtered = filtered.filter((entry) => entry.category === selectedCategory)
		}

		// Project filter
		if (selectedProject !== 'all') {
			filtered = filtered.filter((entry) => entry.projectId === selectedProject)
		}

		// Department filter
		if (selectedDepartment !== 'all') {
			filtered = filtered.filter((entry) => entry.department === selectedDepartment)
		}

		// User filter
		if (selectedUser === 'me') {
			filtered = filtered.filter((entry) => entry.submittedById === currentUserId)
		} else if (selectedUser !== 'all') {
			filtered = filtered.filter((entry) => entry.submittedById === selectedUser)
		}

		// Sort
		filtered.sort((a, b) => {
			if (sortBy === 'date') {
				return new Date(b.date).getTime() - new Date(a.date).getTime()
			}
			return a.title.localeCompare(b.title)
		})

		setFilteredEntries(filtered)
	}, [entries, searchQuery, selectedCategory, selectedProject, selectedDepartment, selectedUser, sortBy, currentUserId])

	// Statistics
	const statistics = useMemo(() => {
		return {
			total: entries.length,
			thisWeek: entries.filter((e) => {
				const weekAgo = new Date()
				weekAgo.setDate(weekAgo.getDate() - 7)
				return e.date >= weekAgo
			}).length,
			totalHours: entries.reduce((sum, e) => {
				const hours = parseFloat(e.duration.replace(/[^0-9.]/g, ''))
				return sum + (isNaN(hours) ? 0 : hours)
			}, 0),
			byDepartment: departments.map(dept => ({
				name: dept,
				count: entries.filter(e => e.department === dept).length
			}))
		}
	}, [entries, departments])

	// Toggle entry expansion
	const toggleExpand = (entryId: string) => {
		setExpandedEntries((prev) =>
			prev.includes(entryId) ? prev.filter((id) => id !== entryId) : [...prev, entryId]
		)
	}

	// Get category color
	const getCategoryColor = (categoryId: string) => {
		const category = categories.find((c) => c.id === categoryId)
		return category?.color || categories[categories.length - 1].color
	}

	// Format file size
	const formatFileSize = (bytes: number) => {
		if (bytes < 1024) return bytes + ' B'
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
		return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
	}

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<LoadingState type="page" />
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
			<Toaster />
			
			{/* Header */}
			<PageHeader
				title="Team Work History"
				description="View and track work history across the entire team"
				icon={FileText}
				actions={
					<Button onClick={() => navigate('/app/input')} size="sm">
						<Plus className="h-4 w-4 sm:mr-2" />
						<span className="hidden sm:inline">New Entry</span>
					</Button>
				}
			/>
			
			<div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
				{/* Statistics Cards */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<Card className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
							<CardContent className="p-4">
								<div className="flex items-center gap-3">
									<BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
									<div>
										<p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Entries</p>
										<p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{statistics.total}</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-linear-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
							<CardContent className="p-4">
								<div className="flex items-center gap-3">
									<TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
									<div>
										<p className="text-sm text-green-600 dark:text-green-400 font-medium">This Week</p>
										<p className="text-2xl font-bold text-green-900 dark:text-green-100">{statistics.thisWeek}</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
							<CardContent className="p-4">
								<div className="flex items-center gap-3">
									<Clock className="h-8 w-8 text-purple-600 dark:text-purple-400" />
									<div>
										<p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Total Hours</p>
										<p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{statistics.totalHours.toFixed(1)}h</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-linear-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
							<CardContent className="p-4">
								<div className="flex items-center gap-3">
									<Users className="h-8 w-8 text-orange-600 dark:text-orange-400" />
									<div>
										<p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Team Members</p>
										<p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{users.length}</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>

				<div className="space-y-4">
				{/* Search and Filters */}
				<Card>
					<CardContent className="p-4 space-y-4">
						{/* Search */}
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
							<Input
								type="text"
								placeholder="Search by title, description, tags, or person..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10"
							/>
						</div>

						{/* Filter Toggle */}
						<button
							onClick={() => setShowFilters(!showFilters)}
							className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-primary transition-colors"
						>
							<Filter className="h-4 w-4" />
							{showFilters ? 'Hide Filters' : 'Show Filters'}
							{showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
						</button>

						{/* Filters */}
						{showFilters && (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
								{/* Category Filter */}
								<div>
									<label className="block text-sm font-medium mb-2">Category</label>
									<select
										value={selectedCategory}
										onChange={(e) => setSelectedCategory(e.target.value)}
										className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary"
									>
										{categories.map((cat) => (
											<option key={cat.id} value={cat.id}>
												{cat.label}
											</option>
										))}
									</select>
								</div>

								{/* Project Filter */}
								<div>
									<label className="flex items-center gap-2 text-sm font-medium mb-2">
										<FolderKanban className="h-4 w-4" />
										Project
									</label>
									<select
										value={selectedProject}
										onChange={(e) => setSelectedProject(e.target.value)}
										className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary"
									>
										<option value="all">All Projects</option>
										{projects.map((proj) => (
											<option key={proj.id} value={proj.id}>
												{proj.name}
											</option>
										))}
									</select>
								</div>

								{/* Department Filter */}
								<div>
									<label className="flex items-center gap-2 text-sm font-medium mb-2">
										<Building2 className="h-4 w-4" />
										Department
									</label>
									<select
										value={selectedDepartment}
										onChange={(e) => setSelectedDepartment(e.target.value)}
										className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary"
									>
										<option value="all">All Departments</option>
										{departments.map((dept) => (
											<option key={dept} value={dept}>
												{dept}
											</option>
										))}
									</select>
								</div>

								{/* User Filter */}
								<div>
									<label className="flex items-center gap-2 text-sm font-medium mb-2">
										<User className="h-4 w-4" />
										Team Member
									</label>
									<select
										value={selectedUser}
										onChange={(e) => setSelectedUser(e.target.value)}
										className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary"
									>
										<option value="all">All Team Members</option>
										<option value="me">My History Only</option>
										<optgroup label="Team Members">
											{users.map((user) => (
												<option key={user.id} value={user.id}>
													{user.name} ({user.department})
												</option>
											))}
										</optgroup>
									</select>
								</div>

								{/* Sort */}
								<div>
									<label className="block text-sm font-medium mb-2">Sort By</label>
									<select
										value={sortBy}
										onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
										className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary"
									>
										<option value="date">Date (Newest First)</option>
										<option value="title">Title (A-Z)</option>
									</select>
								</div>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Results Summary */}
				<div className="flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-400">
					<p>
						Showing <span className="font-semibold text-neutral-900 dark:text-neutral-100">{filteredEntries.length}</span>{' '}
						of <span className="font-semibold text-neutral-900 dark:text-neutral-100">{entries.length}</span> entries
					</p>
					{(selectedCategory !== 'all' || selectedProject !== 'all' || selectedDepartment !== 'all' || selectedUser !== 'all') && (
						<button
							onClick={() => {
								setSelectedCategory('all')
								setSelectedProject('all')
								setSelectedDepartment('all')
								setSelectedUser('all')
								setSearchQuery('')
							}}
							className="text-primary hover:underline"
						>
							Clear all filters
						</button>
					)}
				</div>

				{/* Entries List */}
				{filteredEntries.length === 0 ? (
					<EmptyState
						icon={<FileText className="h-12 w-12" />}
						title="No work entries found"
						description={
							searchQuery || selectedCategory !== 'all' || selectedProject !== 'all'
								? 'Try adjusting your filters or search query'
								: 'No work has been logged yet'
						}
						action={
							searchQuery || selectedCategory !== 'all' || selectedProject !== 'all'
								? (
									<Button
										onClick={() => {
											setSearchQuery('')
											setSelectedCategory('all')
											setSelectedProject('all')
											setSelectedDepartment('all')
											setSelectedUser('all')
										}}
									>
										Clear Filters
									</Button>
								)
								: (
									<Button onClick={() => navigate('/app/input')}>
										Log Work
									</Button>
								)
						}
					/>
				) : (
					<div className="space-y-4">
						{filteredEntries.map((entry) => {
							const isExpanded = expandedEntries.includes(entry.id)
							
							return (
								<Card key={entry.id} className="hover:shadow-md transition-shadow">
									<CardContent className="p-6">
										<div className="space-y-4">
											{/* Header */}
											<div className="flex items-start justify-between gap-4">
												<div className="flex-1 min-w-0">
													<div className="flex items-center gap-2 mb-2 flex-wrap">
														{/* Category Badge */}
														<span className={`text-xs font-medium px-2 py-1 rounded ${getCategoryColor(entry.category)}`}>
															{categories.find((c) => c.id === entry.category)?.label || entry.category}
														</span>

														{/* Status Badge */}
														{entry.status === 'approved' && (
															<span className="text-xs font-medium px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
																Approved
															</span>
														)}

														{/* Project Badge */}
														{entry.projectName && (
															<span className="text-xs text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded flex items-center gap-1">
																<FolderKanban className="h-3 w-3" />
																{entry.projectName}
															</span>
														)}

														{/* Department Badge */}
														{entry.department && (
															<span className="text-xs text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded flex items-center gap-1">
																<Building2 className="h-3 w-3" />
																{entry.department}
															</span>
														)}
													</div>

													<h3 className="text-lg font-bold mb-1">{entry.title}</h3>

													<div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400 flex-wrap">
														{/* Submitted By */}
														{entry.submittedBy && (
															<div className="flex items-center gap-1.5">
																<User className="h-4 w-4" />
																<span>{entry.submittedBy}</span>
															</div>
														)}

													{/* Date */}
													<div className="flex items-center gap-1.5">
														<Calendar className="h-4 w-4" />
														<span>{toDate(entry.date)?.toLocaleDateString() || 'N/A'}</span>
													</div>

														{/* Duration */}
														<div className="flex items-center gap-1.5">
															<Clock className="h-4 w-4" />
															<span>{entry.duration}</span>
														</div>
													</div>

													{/* Progress Bar */}
													<div className="w-full mt-3 max-w-xs">
														<div className="flex justify-between text-xs mb-1">
															<span className="text-neutral-500">Progress</span>
															<span className="font-medium text-neutral-900 dark:text-neutral-100">{entry.status === 'approved' ? '100%' : '65%'}</span>
														</div>
														<div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-1.5">
															<div 
																className={`h-1.5 rounded-full ${entry.status === 'approved' ? 'bg-green-500' : 'bg-blue-500'}`} 
																style={{ width: entry.status === 'approved' ? '100%' : '65%' }}
															></div>
														</div>
													</div>

													{/* Tags */}
													{entry.tags && entry.tags.length > 0 && (
														<div className="flex items-center gap-2 mt-2 flex-wrap">
															<Tag className="h-3 w-3 text-neutral-400" />
															{entry.tags.map((tag, idx) => (
																<span
																	key={idx}
																	className="text-xs px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded"
																>
																	{tag}
																</span>
															))}
														</div>
													)}
												</div>

												<button
													onClick={() => toggleExpand(entry.id)}
													className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors shrink-0"
												>
													{isExpanded ? (
														<ChevronUp className="h-5 w-5" />
													) : (
														<ChevronDown className="h-5 w-5" />
													)}
												</button>
											</div>

											{/* Expanded Content */}
											{isExpanded && (
												<div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
													{/* Description */}
													<div>
														<h4 className="text-sm font-semibold mb-2">Description</h4>
														<p className="text-sm text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap">
															{entry.description}
														</p>
													</div>

												{/* Files */}
												{entry.files && entry.files.length > 0 && (
													<div>
														<h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
															<Upload className="h-4 w-4" />
															Attachments ({entry.files.length})
														</h4>
														<div className="space-y-2">
															{entry.files.map((file) => (
																	<div
																		key={file.id}
																		className="flex items-center gap-3 p-2 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg"
																	>
																		<FileText className="h-4 w-4 text-neutral-500" />
																		<div className="flex-1 min-w-0">
																			<p className="text-sm font-medium truncate">{file.name}</p>
																			<p className="text-xs text-neutral-500">{formatFileSize(file.size)}</p>
																		</div>
																		<Button variant="outline" size="sm">
																			<Eye className="h-3 w-3" />
																		</Button>
																	</div>
																))}
															</div>
														</div>
													)}

												{/* Links */}
												{entry.links && entry.links.length > 0 && (
													<div>
														<h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
															<Link2 className="h-4 w-4" />
															Links ({entry.links.length})
														</h4>
														<div className="space-y-2">
															{entry.links.map((link) => (
																	<a
																		key={link.id}
																		href={link.url}
																		target="_blank"
																		rel="noopener noreferrer"
																		className="flex items-center gap-2 p-2 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group"
																	>
																		<Link2 className="h-4 w-4 text-neutral-500" />
																		<span className="text-sm text-primary group-hover:underline truncate">
																			{link.title}
																		</span>
																	</a>
																))}
															</div>
														</div>
													)}
												</div>
											)}
										</div>
									</CardContent>
								</Card>
							)
						})}
					</div>
				)}
			</div>
		</div>
	)
}
