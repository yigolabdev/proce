import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { PageHeader } from '../components/common/PageHeader'
import { LoadingState } from '../components/common/LoadingState'
import { EmptyState } from '../components/common/EmptyState'
import { storage } from '../utils/storage'
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts'
import { useAuth } from '../context/AuthContext'
import { 
	TrendingUp, 
	Plus,
	ArrowRight,
	CheckCircle2,
	AlertCircle,
	Target,
	Clock,
	FileText,
	FolderKanban,
	BarChart3,
	Sparkles,
	MessageSquare,
	Users,
	Building2,
	Calendar,
	Zap,
	Activity,
	Award,
	Bell,
	Briefcase,
	User,
	Play,
	AlertTriangle,
	RefreshCw,
} from 'lucide-react'
import { toast } from 'sonner'
import type { WorkEntry, Project } from '../types/common.types'
import { parseWorkEntriesFromStorage, parseProjectsFromStorage } from '../utils/mappers'
import { toDate } from '../utils/dateUtils'

interface ReceivedReview {
	id: string
	workTitle: string
	reviewType: string
	reviewedBy: string
	reviewedAt: Date
	isRead: boolean
}

interface TaskRecommendation {
	id: string
	title: string
	priority: string
	status: string
	assignedToId?: string
	projectName?: string
	deadline?: string
	description?: string
}

interface TeamMember {
	id: string
	name: string
	department: string
	position: string
	status: 'active' | 'away' | 'offline'
	currentTask?: {
		id: string
		title: string
		progress: number
		projectName?: string
	}
	tasksCompleted: number
	tasksInProgress: number
	avgResponseTime: string
}

interface ProjectStatus {
	id: string
	name: string
	status: 'active' | 'planning' | 'completed' | 'on-hold'
	progress: number
	members: number
	dueDate?: string
	health: 'good' | 'at-risk' | 'delayed'
}

interface Bottleneck {
	id: string
	type: 'review' | 'task' | 'resource'
	title: string
	description: string
	affectedMembers: string[]
	severity: 'high' | 'medium' | 'low'
	duration: string
}

type ViewMode = 'personal' | 'team'

export default function DashboardPage() {
	const navigate = useNavigate()
	const { user } = useAuth()
	const [viewMode, setViewMode] = useState<ViewMode>('personal')
	const [loading, setLoading] = useState(true)
	const [workEntries, setWorkEntries] = useState<WorkEntry[]>([])
	const [receivedReviews, setReceivedReviews] = useState<ReceivedReview[]>([])
	const [tasks, setTasks] = useState<TaskRecommendation[]>([])
	const [projects, setProjects] = useState<Project[]>([])
	const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
	const [projectStatuses, setProjectStatuses] = useState<ProjectStatus[]>([])
	const [bottlenecks, setBottlenecks] = useState<Bottleneck[]>([])
	const [selectedDepartment, setSelectedDepartment] = useState<string>('all')
	
	// Get current user info from AuthContext
	const currentUserId = user?.id || ''
	const currentUserName = user?.name || 'User'
	const currentUserDepartment = user?.department || 'Unknown Department'

	// Keyboard shortcuts
	useKeyboardShortcuts({
		newWork: () => navigate('/app/input'),
		goToDashboard: () => navigate('/app/dashboard'),
	})

	// Load all data
	useEffect(() => {
		loadData()
	}, [])

	const loadData = async () => {
		try {
			setLoading(true)

			// Load work entries (all team)
			const savedEntries = storage.get<any[]>('workEntries')
			if (savedEntries && savedEntries.length > 0) {
				const parsed = parseWorkEntriesFromStorage(savedEntries)
				setWorkEntries(parsed)
			}

			// Load received reviews - filter by current user
			const savedReviews = storage.get<any[]>('received_reviews')
			if (savedReviews && savedReviews.length > 0) {
				const reviewsWithDates = savedReviews
					.map((review: any) => ({
						...review,
						reviewedAt: new Date(review.reviewedAt),
					}))
					.filter(() => true) // Accept all reviews for now
				setReceivedReviews(reviewsWithDates)
			} else {
				setReceivedReviews([])
			}

			// Load tasks (AI + Manual)
			const manualTasks = storage.get<any[]>('manual_tasks') || []
			const aiTasks = storage.get<any[]>('ai_recommendations') || []
			const allTasks = [...manualTasks, ...aiTasks]
			setTasks(allTasks)

			// Load projects
			const savedProjects = storage.get<any[]>('projects')
			if (savedProjects && savedProjects.length > 0) {
				const parsed = parseProjectsFromStorage(savedProjects)
				setProjects(parsed)
			}

			// Load users for team view
			const users = storage.get<any[]>('users') || []
			
			// Load pending reviews
			const pendingReviews = storage.get<any[]>('pending_reviews') || []

			// Transform users to team members
			const members: TeamMember[] = users.map(u => {
				const userTasks = allTasks.filter(t => t.assignedToId === u.id)
				const inProgressTasks = userTasks.filter(t => t.status === 'accepted')
				const currentTask = inProgressTasks[0]
				
				const userEntries = savedEntries?.filter(e => e.submittedById === u.id) || []
				const recentEntries = userEntries.filter(e => {
					const entryDate = new Date(e.date)
					const weekAgo = new Date()
					weekAgo.setDate(weekAgo.getDate() - 7)
					return entryDate >= weekAgo
				})

				return {
					id: u.id,
					name: u.name,
					department: u.department || 'General',
					position: u.position || 'Team Member',
					status: recentEntries.length > 0 ? 'active' : 'away',
					currentTask: currentTask ? {
						id: currentTask.id,
						title: currentTask.title,
						progress: Math.floor(Math.random() * 100), // Mock progress
						projectName: currentTask.projectName,
					} : undefined,
					tasksCompleted: userEntries.length,
					tasksInProgress: inProgressTasks.length,
					avgResponseTime: '2.5h',
				}
			})
			setTeamMembers(members)

			// Transform projects for team view
			const projectStats: ProjectStatus[] = savedProjects?.map(p => {
				const projectTasks = allTasks.filter(t => t.projectId === p.id)
				const completedTasks = projectTasks.filter(t => t.status === 'completed').length
				const totalTasks = projectTasks.length || 1
				const progress = Math.round((completedTasks / totalTasks) * 100)
				
				const projectMembers = new Set(
					allTasks.filter(t => t.projectId === p.id && t.assignedToId).map(t => t.assignedToId)
				).size

				let health: 'good' | 'at-risk' | 'delayed' = 'good'
				if (progress < 30 && p.status === 'active') health = 'at-risk'
				if (progress < 50 && p.endDate && new Date(p.endDate) < new Date()) health = 'delayed'

				return {
					id: p.id,
					name: p.name,
					status: p.status || 'active',
					progress,
					members: projectMembers || 0,
					dueDate: p.endDate,
					health,
				}
			}) || []
			setProjectStatuses(projectStats)

			// Detect bottlenecks
			const detectedBottlenecks: Bottleneck[] = []
			
			// Review bottlenecks
			const oldReviews = pendingReviews.filter(r => {
				const submittedAt = new Date(r.submittedAt)
				const daysSince = Math.floor((Date.now() - submittedAt.getTime()) / (1000 * 60 * 60 * 24))
				return daysSince > 2 && r.status === 'pending'
			})
			
			if (oldReviews.length > 0) {
				detectedBottlenecks.push({
					id: 'review-bottleneck-1',
					type: 'review',
					title: `${oldReviews.length} Pending Reviews`,
					description: `Reviews waiting for more than 2 days`,
					affectedMembers: oldReviews.map(r => r.submittedBy),
					severity: 'high',
					duration: '2+ days',
				})
			}

			// Task bottlenecks
			const overdueTasks = allTasks.filter(t => {
				if (!t.deadline) return false
				return new Date(t.deadline) < new Date() && t.status !== 'completed'
			})
			
			if (overdueTasks.length > 0) {
				detectedBottlenecks.push({
					id: 'task-bottleneck-1',
					type: 'task',
					title: `${overdueTasks.length} Overdue Tasks`,
					description: `Tasks past their deadline`,
					affectedMembers: overdueTasks.map(t => t.assignedToName).filter(Boolean),
					severity: 'high',
					duration: 'Various',
				})
			}
			setBottlenecks(detectedBottlenecks)

		} catch (error) {
			console.error('Failed to load dashboard data:', error)
			toast.error('Failed to load dashboard data')
		} finally {
			setLoading(false)
		}
	}

	// Personal Statistics
	const personalStats = useMemo(() => {
		const myEntries = workEntries.filter(e => e.submittedById === currentUserId)
		const thisWeek = workEntries.filter(e => {
			const weekAgo = new Date()
			weekAgo.setDate(weekAgo.getDate() - 7)
			return e.submittedById === currentUserId && e.date >= weekAgo
		})
		
		const unreadReviews = receivedReviews.filter(r => !r.isRead).length
		const myTasks = tasks.filter(t => t.assignedToId === currentUserId && t.status === 'pending').length
		const urgentTasks = tasks.filter(t => 
			t.assignedToId === currentUserId && 
			t.priority === 'high' &&
			t.deadline &&
			new Date(t.deadline) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
		).length

		return {
			totalWork: myEntries.length,
			thisWeekWork: thisWeek.length,
			unreadReviews,
			pendingTasks: myTasks,
			urgentTasks,
		}
	}, [workEntries, receivedReviews, tasks, currentUserId])

	// Company/Department Statistics
	const companyStats = useMemo(() => {
		const thisWeek = new Date()
		thisWeek.setDate(thisWeek.getDate() - 7)

		// Department stats
		const departments = Array.from(new Set(workEntries.map(e => e.department).filter(Boolean)))
		const departmentStats = departments.map(dept => ({
			name: dept,
			count: workEntries.filter(e => e.department === dept).length,
			thisWeek: workEntries.filter(e => e.department === dept && e.date >= thisWeek).length,
		}))

		// My department stats
		const myDeptEntries = workEntries.filter(e => e.department === currentUserDepartment)
		const myDeptThisWeek = myDeptEntries.filter(e => e.date >= thisWeek)

		return {
			totalEntries: workEntries.length,
			totalThisWeek: workEntries.filter(e => e.date >= thisWeek).length,
			totalProjects: projects.length,
			activeProjects: projects.filter(p => p.status === 'active' || !p.status).length,
			departments: departmentStats.sort((a, b) => b.count - a.count),
			myDepartment: {
				name: currentUserDepartment,
				total: myDeptEntries.length,
				thisWeek: myDeptThisWeek.length,
			},
		}
	}, [workEntries, projects, currentUserDepartment])

	// Team Statistics
	const teamStats = useMemo(() => {
		const filteredMembers = selectedDepartment === 'all' 
			? teamMembers 
			: teamMembers.filter(m => m.department === selectedDepartment)
		
		const activeMembers = filteredMembers.filter(m => m.status === 'active').length
		const totalTasksInProgress = filteredMembers.reduce((sum, m) => sum + m.tasksInProgress, 0)
		const totalTasksCompleted = filteredMembers.reduce((sum, m) => sum + m.tasksCompleted, 0)
		const activeProjects = projectStatuses.filter(p => p.status === 'active').length

		return {
			activeMembers,
			totalMembers: filteredMembers.length,
			totalTasksInProgress,
			totalTasksCompleted,
			activeProjects,
			totalProjects: projectStatuses.length,
		}
	}, [teamMembers, projectStatuses, selectedDepartment])

	// Recent activities (company-wide)
	const recentActivities = useMemo(() => {
		return workEntries
			.filter(e => e.status === 'approved')
			.sort((a, b) => (toDate(b.date)?.getTime() || 0) - (toDate(a.date)?.getTime() || 0))
			.slice(0, 5)
	}, [workEntries])

	// My recent work
	const myRecentWork = useMemo(() => {
		return workEntries
			.filter(e => e.submittedById === currentUserId)
			.sort((a, b) => (toDate(b.date)?.getTime() || 0) - (toDate(a.date)?.getTime() || 0))
			.slice(0, 3)
	}, [workEntries, currentUserId])

	// Urgent tasks
	const urgentTasks = useMemo(() => {
		return tasks
			.filter(t => {
				if (t.assignedToId !== currentUserId) return false
				if (t.priority !== 'high') return false
				if (!t.deadline) return false
				const daysUntilDeadline = Math.ceil(
					(new Date(t.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
				)
				return daysUntilDeadline <= 3 && daysUntilDeadline >= 0
			})
			.slice(0, 3)
	}, [tasks, currentUserId])

	// Filter team members by department
	const filteredMembers = useMemo(() => {
		if (selectedDepartment === 'all') return teamMembers
		return teamMembers.filter(m => m.department === selectedDepartment)
	}, [teamMembers, selectedDepartment])

	// Get unique departments
	const departments = useMemo(() => {
		return Array.from(new Set(teamMembers.map(m => m.department)))
	}, [teamMembers])

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<LoadingState type="page" />
			</div>
		)
	}

	return (
	<div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
		{/* Header with Tabs */}
		<PageHeader
			title="Dashboard"
			description={viewMode === 'personal' 
				? `Welcome back, ${currentUserName}!`
				: 'Team overview'}
			icon={BarChart3}
			actions={
				<>
					<Button variant="outline" onClick={loadData} size="sm">
						<RefreshCw className="h-4 w-4 sm:mr-2" />
						<span className="hidden sm:inline">Refresh</span>
					</Button>
					<Button onClick={() => navigate('/app/input')} size="sm" className="shrink-0">
						<Plus className="h-4 w-4 sm:mr-2" />
						<span className="hidden sm:inline">New Entry</span>
					</Button>
				</>
			}
			tabs={{
				items: [
					{ id: 'personal', label: 'My Dashboard', icon: User },
					{ id: 'team', label: 'Team Dashboard', icon: Users },
				],
				activeTab: viewMode,
				onTabChange: (id: string) => setViewMode(id as ViewMode),
			}}
		/>

		<div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
				{viewMode === 'personal' ? (
					<>
						{/* Personal Overview Section */}
						<div>
							<div className="flex items-center gap-2 mb-4">
								<User className="h-5 w-5 text-primary" />
								<h2 className="text-xl font-bold">My Overview</h2>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
								{/* Unread Reviews */}
								<Card className="bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800 cursor-pointer hover:shadow-lg transition-shadow"
									onClick={() => navigate('/app/work-review')}
								>
									<CardContent className="p-4">
										<div className="flex items-center gap-3">
											<div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
												<Bell className="h-6 w-6 text-purple-600 dark:text-purple-400" />
											</div>
											<div className="flex-1">
												<p className="text-sm text-purple-600 dark:text-purple-400 font-medium">New Reviews</p>
												<p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
													{personalStats.unreadReviews}
												</p>
											</div>
										</div>
									</CardContent>
								</Card>

								{/* Pending Tasks */}
								<Card className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800 cursor-pointer hover:shadow-lg transition-shadow"
									onClick={() => navigate('/app/ai-recommendations')}
								>
									<CardContent className="p-4">
										<div className="flex items-center gap-3">
											<div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
												<CheckCircle2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
											</div>
											<div className="flex-1">
												<p className="text-sm text-blue-600 dark:text-blue-400 font-medium">My Tasks</p>
												<p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
													{personalStats.pendingTasks}
												</p>
											</div>
										</div>
									</CardContent>
								</Card>

								{/* Urgent Tasks */}
								<Card className="bg-linear-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
									<CardContent className="p-4">
										<div className="flex items-center gap-3">
											<div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
												<AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
											</div>
											<div className="flex-1">
												<p className="text-sm text-red-600 dark:text-red-400 font-medium">Urgent (3 days)</p>
												<p className="text-2xl font-bold text-red-900 dark:text-red-100">
													{personalStats.urgentTasks}
												</p>
											</div>
										</div>
									</CardContent>
								</Card>

								{/* My Work This Week */}
								<Card className="bg-linear-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
									<CardContent className="p-4">
										<div className="flex items-center gap-3">
											<div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
												<TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
											</div>
											<div className="flex-1">
												<p className="text-sm text-green-600 dark:text-green-400 font-medium">This Week</p>
												<p className="text-2xl font-bold text-green-900 dark:text-green-100">
													{personalStats.thisWeekWork}
												</p>
											</div>
										</div>
									</CardContent>
								</Card>

								{/* Total Work */}
								<Card className="bg-linear-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
									<CardContent className="p-4">
										<div className="flex items-center gap-3">
											<div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
												<BarChart3 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
											</div>
											<div className="flex-1">
												<p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Total Work</p>
												<p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
													{personalStats.totalWork}
												</p>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>

						{/* Personal Action Items */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{/* Urgent Tasks */}
							{urgentTasks.length > 0 && (
								<Card>
									<CardContent className="p-6">
										<div className="flex items-center justify-between mb-4">
											<div className="flex items-center gap-2">
												<Zap className="h-5 w-5 text-red-500" />
												<h3 className="text-lg font-bold">Urgent Tasks</h3>
											</div>
											<Button variant="outline" size="sm" onClick={() => navigate('/app/ai-recommendations')}>
												View All
												<ArrowRight className="h-4 w-4 ml-2" />
											</Button>
										</div>
										<div className="space-y-3">
											{urgentTasks.map((task) => {
												const daysLeft = task.deadline 
													? Math.ceil((new Date(task.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
													: null
												
												return (
													<div key={task.id} className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
														<div className="flex items-start justify-between gap-3">
															<div className="flex-1 min-w-0">
																<h4 className="font-medium text-sm mb-1 truncate">{task.title}</h4>
																<div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
																	{task.projectName && (
																		<span className="flex items-center gap-1">
																			<FolderKanban className="h-3 w-3" />
																			{task.projectName}
																		</span>
																	)}
																	{daysLeft !== null && (
																		<span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-medium">
																			<Clock className="h-3 w-3" />
																			{daysLeft} days left
																		</span>
																	)}
																</div>
															</div>
															<span className="text-xs font-medium px-2 py-1 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 shrink-0">
																{task.priority.toUpperCase()}
															</span>
														</div>
													</div>
												)
											})}
										</div>
									</CardContent>
								</Card>
							)}

							{/* Recent Reviews */}
							{receivedReviews.filter(r => !r.isRead).length > 0 && (
								<Card>
									<CardContent className="p-6">
										<div className="flex items-center justify-between mb-4">
											<div className="flex items-center gap-2">
												<MessageSquare className="h-5 w-5 text-purple-500" />
												<h3 className="text-lg font-bold">New Reviews</h3>
											</div>
											<Button variant="outline" size="sm" onClick={() => navigate('/app/work-review')}>
												View All
												<ArrowRight className="h-4 w-4 ml-2" />
											</Button>
										</div>
										<div className="space-y-3">
											{receivedReviews.filter(r => !r.isRead).slice(0, 3).map((review) => {
												const icon = review.reviewType === 'approved' 
													? <CheckCircle2 className="h-4 w-4 text-green-500" />
													: review.reviewType === 'rejected'
													? <AlertCircle className="h-4 w-4 text-red-500" />
													: <Clock className="h-4 w-4 text-orange-500" />
												
												const bgColor = review.reviewType === 'approved'
													? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
													: review.reviewType === 'rejected'
													? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
													: 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800'

												return (
													<div key={review.id} className={`p-3 border rounded-lg ${bgColor}`}>
														<div className="flex items-start gap-3">
															{icon}
															<div className="flex-1 min-w-0">
																<h4 className="font-medium text-sm mb-1 truncate">{review.workTitle}</h4>
																<p className="text-xs text-neutral-600 dark:text-neutral-400">
																	By {review.reviewedBy} • {Math.floor((Date.now() - review.reviewedAt.getTime()) / (1000 * 60 * 60))}h ago
																</p>
															</div>
														</div>
													</div>
												)
											})}
										</div>
									</CardContent>
								</Card>
							)}
						</div>

						{/* My Recent Work */}
						{myRecentWork.length > 0 && (
							<Card>
								<CardContent className="p-6">
									<div className="flex items-center justify-between mb-4">
										<div className="flex items-center gap-2">
											<FileText className="h-5 w-5 text-blue-500" />
											<h3 className="text-lg font-bold">My Recent Work</h3>
										</div>
										<Button variant="outline" size="sm" onClick={() => navigate('/app/work-history')}>
											View All
											<ArrowRight className="h-4 w-4 ml-2" />
										</Button>
									</div>
									<div className="space-y-3">
										{myRecentWork.map((entry) => (
											<div key={entry.id} className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
												<div className="flex items-start justify-between gap-4">
													<div className="flex-1 min-w-0">
														<h4 className="font-medium mb-1 truncate">{entry.title}</h4>
														<p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2 line-clamp-1">
															{entry.description}
														</p>
														<div className="flex items-center gap-3 text-xs text-neutral-500">
															{entry.projectName && (
																<span className="flex items-center gap-1">
																	<FolderKanban className="h-3 w-3" />
																	{entry.projectName}
																</span>
															)}
														<span className="flex items-center gap-1">
															<Calendar className="h-3 w-3" />
															{toDate(entry.date)?.toLocaleDateString() || 'N/A'}
														</span>
															{entry.duration && (
																<span className="flex items-center gap-1">
																	<Clock className="h-3 w-3" />
																	{entry.duration}
																</span>
															)}
														</div>
													</div>
													{entry.status === 'approved' && (
														<CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
													)}
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						)}

						{/* Company Overview Section */}
						<div>
							<div className="flex items-center gap-2 mb-4">
								<Building2 className="h-5 w-5 text-primary" />
								<h2 className="text-xl font-bold">Company & Department Overview</h2>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
								{/* Company Total Work */}
								<Card className="bg-linear-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border-indigo-200 dark:border-indigo-800">
									<CardContent className="p-4">
										<div className="flex items-center gap-3">
											<div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
												<Activity className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
											</div>
											<div className="flex-1">
												<p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">Company Total</p>
												<p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
													{companyStats.totalEntries}
												</p>
											</div>
										</div>
									</CardContent>
								</Card>

								{/* Company This Week */}
								<Card className="bg-linear-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 border-teal-200 dark:border-teal-800">
									<CardContent className="p-4">
										<div className="flex items-center gap-3">
											<div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
												<TrendingUp className="h-6 w-6 text-teal-600 dark:text-teal-400" />
											</div>
											<div className="flex-1">
												<p className="text-sm text-teal-600 dark:text-teal-400 font-medium">This Week</p>
												<p className="text-2xl font-bold text-teal-900 dark:text-teal-100">
													{companyStats.totalThisWeek}
												</p>
											</div>
										</div>
									</CardContent>
								</Card>

								{/* Active Projects */}
								<Card className="bg-linear-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20 border-cyan-200 dark:border-cyan-800 cursor-pointer hover:shadow-lg transition-shadow"
									onClick={() => navigate('/app/projects')}
								>
									<CardContent className="p-4">
										<div className="flex items-center gap-3">
											<div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
												<Briefcase className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
											</div>
											<div className="flex-1">
												<p className="text-sm text-cyan-600 dark:text-cyan-400 font-medium">Active Projects</p>
												<p className="text-2xl font-bold text-cyan-900 dark:text-cyan-100">
													{companyStats.activeProjects}
												</p>
											</div>
										</div>
									</CardContent>
								</Card>

								{/* My Department */}
								<Card className="bg-linear-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800">
									<CardContent className="p-4">
										<div className="flex items-center gap-3">
											<div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
												<Award className="h-6 w-6 text-amber-600 dark:text-amber-400" />
											</div>
											<div className="flex-1">
												<p className="text-sm text-amber-600 dark:text-amber-400 font-medium">{companyStats.myDepartment.name}</p>
												<p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
													{companyStats.myDepartment.thisWeek}
													<span className="text-sm font-normal text-amber-600 dark:text-amber-400 ml-1">this week</span>
												</p>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>

						{/* Department Stats & Recent Activities */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{/* Department Performance */}
							<Card>
								<CardContent className="p-6">
									<div className="flex items-center justify-between mb-4">
										<div className="flex items-center gap-2">
											<BarChart3 className="h-5 w-5 text-indigo-500" />
											<h3 className="text-lg font-bold">Department Performance</h3>
										</div>
										<Button variant="outline" size="sm" onClick={() => navigate('/app/work-history')}>
											View Details
											<ArrowRight className="h-4 w-4 ml-2" />
										</Button>
									</div>
									<div className="space-y-3">
										{companyStats.departments.slice(0, 5).map((dept) => {
											const percentage = (dept.count / companyStats.totalEntries) * 100
											const isMyDept = dept.name === currentUserDepartment
											
											return (
												<div key={dept.name}>
													<div className="flex items-center justify-between mb-1">
														<div className="flex items-center gap-2">
															<span className="text-sm font-medium">{dept.name}</span>
															{isMyDept && (
																<span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded">
																	Your Team
																</span>
															)}
														</div>
														<div className="flex items-center gap-2">
															<span className="text-sm text-neutral-600 dark:text-neutral-400">
																{dept.count} total
															</span>
															{dept.thisWeek > 0 && (
																<span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
																	<TrendingUp className="h-3 w-3" />
																	{dept.thisWeek} this week
																</span>
															)}
														</div>
													</div>
													<div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
														<div 
															className={`h-full ${
																isMyDept 
																	? 'bg-primary' 
																	: 'bg-indigo-500 dark:bg-indigo-400'
															} transition-all`}
															style={{ width: `${percentage}%` }}
														/>
													</div>
												</div>
											)
										})}
									</div>
								</CardContent>
							</Card>

							{/* Recent Company Activity */}
							<Card>
								<CardContent className="p-6">
									<div className="flex items-center justify-between mb-4">
										<div className="flex items-center gap-2">
											<Sparkles className="h-5 w-5 text-teal-500" />
											<h3 className="text-lg font-bold">Recent Team Activity</h3>
										</div>
										<Button variant="outline" size="sm" onClick={() => navigate('/app/work-history')}>
											View All
											<ArrowRight className="h-4 w-4 ml-2" />
										</Button>
									</div>
									<div className="space-y-3">
										{recentActivities.map((entry) => (
											<div key={entry.id} className="flex items-start gap-3 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
												<CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
												<div className="flex-1 min-w-0">
													<h4 className="font-medium text-sm mb-1 truncate">{entry.title}</h4>
													<div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 flex-wrap">
														<span className="flex items-center gap-1">
															<Users className="h-3 w-3" />
															{entry.submittedBy || 'Team Member'}
														</span>
														{entry.department && (
															<span className="flex items-center gap-1">
																<Building2 className="h-3 w-3" />
																{entry.department}
															</span>
														)}
														{entry.projectName && (
															<span className="flex items-center gap-1">
																<FolderKanban className="h-3 w-3" />
																{entry.projectName}
															</span>
														)}
													<span className="flex items-center gap-1">
														<Clock className="h-3 w-3" />
														{Math.floor((Date.now() - (toDate(entry.date)?.getTime() || 0)) / (1000 * 60 * 60))}h ago
													</span>
													</div>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Quick Actions */}
						<Card>
							<CardContent className="p-6">
								<h3 className="text-lg font-bold mb-4">Quick Actions</h3>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
									<Button variant="outline" onClick={() => navigate('/app/input')} className="justify-start">
										<Plus className="h-4 w-4 mr-2" />
										Log Work
									</Button>
									<Button variant="outline" onClick={() => navigate('/app/ai-recommendations')} className="justify-start">
										<Target className="h-4 w-4 mr-2" />
										View Tasks
									</Button>
									<Button variant="outline" onClick={() => navigate('/app/projects')} className="justify-start">
										<FolderKanban className="h-4 w-4 mr-2" />
										Projects
									</Button>
									<Button variant="outline" onClick={() => navigate('/app/work-history')} className="justify-start">
										<FileText className="h-4 w-4 mr-2" />
										Team History
									</Button>
								</div>
							</CardContent>
						</Card>
					</>
				) : (
					<>
						{/* Team Dashboard View */}
						
						{/* Department Filter */}
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center gap-4">
									<label className="text-sm font-semibold shrink-0">Department:</label>
									<div className="flex gap-2 flex-wrap">
										<button
											onClick={() => setSelectedDepartment('all')}
											className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
												selectedDepartment === 'all'
													? 'bg-primary text-white'
													: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
											}`}
										>
											All Departments ({teamMembers.length})
										</button>
										{departments.map(dept => (
											<button
												key={dept}
												onClick={() => setSelectedDepartment(dept)}
												className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
													selectedDepartment === dept
														? 'bg-primary text-white'
														: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
												}`}
											>
												{dept} ({teamMembers.filter(m => m.department === dept).length})
											</button>
										))}
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Team Statistics */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							<Card>
								<CardContent className="p-6">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm text-neutral-600 dark:text-neutral-400">Active Members</p>
											<p className="text-2xl font-bold mt-1">
												{teamStats.activeMembers}/{teamStats.totalMembers}
											</p>
										</div>
										<div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
											<Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
										</div>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="p-6">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm text-neutral-600 dark:text-neutral-400">In Progress</p>
											<p className="text-2xl font-bold mt-1">{teamStats.totalTasksInProgress}</p>
										</div>
										<div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
											<Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
										</div>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="p-6">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm text-neutral-600 dark:text-neutral-400">Completed</p>
											<p className="text-2xl font-bold mt-1">{teamStats.totalTasksCompleted}</p>
										</div>
										<div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
											<CheckCircle2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
										</div>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="p-6">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm text-neutral-600 dark:text-neutral-400">Active Projects</p>
											<p className="text-2xl font-bold mt-1">
												{teamStats.activeProjects}/{teamStats.totalProjects}
											</p>
										</div>
										<div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-900/30">
											<FolderKanban className="h-6 w-6 text-orange-600 dark:text-orange-400" />
										</div>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Bottlenecks Alert */}
						{bottlenecks.length > 0 && (
							<Card className="border-2 border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-900/10">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-orange-900 dark:text-orange-100">
										<AlertTriangle className="h-5 w-5 text-orange-600" />
										Bottlenecks Detected ({bottlenecks.length})
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										{bottlenecks.map(bottleneck => (
											<div
												key={bottleneck.id}
												className="p-4 bg-white dark:bg-neutral-900 rounded-lg border border-orange-200 dark:border-orange-800"
											>
												<div className="flex items-start justify-between">
													<div className="flex-1">
														<div className="flex items-center gap-2 mb-2">
															<span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
																bottleneck.severity === 'high'
																	? 'bg-red-200 dark:bg-red-900/30 text-red-700 dark:text-red-400'
																	: 'bg-yellow-200 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
															}`}>
																{bottleneck.severity.toUpperCase()}
															</span>
															<span className="text-xs text-neutral-500">
																{bottleneck.duration}
															</span>
														</div>
														<h4 className="font-semibold mb-1">{bottleneck.title}</h4>
														<p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
															{bottleneck.description}
														</p>
														<div className="flex items-center gap-2 text-xs text-neutral-500">
															<Users className="h-3 w-3" />
															{bottleneck.affectedMembers.length} members affected
														</div>
													</div>
													<Button
														variant="outline"
														size="sm"
														onClick={() => {
															if (bottleneck.type === 'review') {
																navigate('/app/work-review')
															} else if (bottleneck.type === 'task') {
																navigate('/app/ai-recommendations')
															}
														}}
													>
														View
														<ArrowRight className="h-3 w-3 ml-1" />
													</Button>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						)}

						{/* Main Content Grid */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{/* Team Members Status */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center justify-between">
										<span className="flex items-center gap-2">
											<Users className="h-5 w-5" />
											Team Members ({filteredMembers.length})
										</span>
										<Button variant="outline" size="sm" onClick={() => navigate('/app/admin/users')}>
											Manage
										</Button>
									</CardTitle>
								</CardHeader>
								<CardContent>
									{filteredMembers.length === 0 ? (
										<EmptyState
											icon={<Users className="h-12 w-12" />}
											title="No team members"
											description="No members in this department"
										/>
									) : (
										<div className="space-y-3 max-h-[600px] overflow-y-auto">
											{filteredMembers.map(member => (
												<div
													key={member.id}
													className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-shadow"
												>
													<div className="flex items-start justify-between mb-3">
														<div className="flex items-center gap-3">
															<div className={`p-2 rounded-lg ${
																member.status === 'active'
																	? 'bg-green-100 dark:bg-green-900/30'
																	: 'bg-neutral-200 dark:bg-neutral-800'
															}`}>
																<User className={`h-4 w-4 ${
																	member.status === 'active'
																		? 'text-green-600 dark:text-green-400'
																		: 'text-neutral-500'
																}`} />
															</div>
															<div>
																<h4 className="font-semibold">{member.name}</h4>
																<p className="text-xs text-neutral-500">
																	{member.position} • {member.department}
																</p>
															</div>
														</div>
														<span className={`px-2 py-1 text-xs rounded-full font-medium ${
															member.status === 'active'
																? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
																: 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600'
														}`}>
															{member.status === 'active' ? '🟢 Active' : '⚪ Away'}
														</span>
													</div>

													{member.currentTask && (
														<div className="p-3 bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 mb-2">
															<div className="flex items-center gap-2 mb-2">
																<Play className="h-3 w-3 text-blue-600" />
																<p className="text-xs font-medium text-blue-600 dark:text-blue-400">
																	Currently Working On
																</p>
															</div>
															<p className="text-sm font-medium mb-2">{member.currentTask.title}</p>
															{member.currentTask.projectName && (
																<p className="text-xs text-neutral-500 mb-2">
																	{member.currentTask.projectName}
																</p>
															)}
															<div className="relative w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
																<div
																	className="absolute top-0 left-0 h-full bg-blue-600"
																	style={{ width: `${member.currentTask.progress}%` }}
																/>
															</div>
															<p className="text-xs text-neutral-500 mt-1 text-right">
																{member.currentTask.progress}% Complete
															</p>
														</div>
													)}

													<div className="flex items-center justify-between text-xs text-neutral-500">
														<span>{member.tasksInProgress} in progress</span>
														<span>{member.tasksCompleted} completed</span>
														<span>⚡ {member.avgResponseTime} avg</span>
													</div>
												</div>
											))}
										</div>
									)}
								</CardContent>
							</Card>

							{/* Active Projects */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center justify-between">
										<span className="flex items-center gap-2">
											<FolderKanban className="h-5 w-5" />
											Active Projects ({projectStatuses.filter(p => p.status === 'active').length})
										</span>
										<Button variant="outline" size="sm" onClick={() => navigate('/app/projects')}>
											View All
										</Button>
									</CardTitle>
								</CardHeader>
								<CardContent>
									{projectStatuses.filter(p => p.status === 'active').length === 0 ? (
										<EmptyState
											icon={<FolderKanban className="h-12 w-12" />}
											title="No active projects"
											description="Create a new project to get started"
											action={
												<Button onClick={() => navigate('/app/projects')}>
													<Plus className="h-4 w-4 mr-2" />
													New Project
												</Button>
											}
										/>
									) : (
										<div className="space-y-3 max-h-[600px] overflow-y-auto">
											{projectStatuses
												.filter(p => p.status === 'active')
												.map(project => (
													<div
														key={project.id}
														className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-shadow cursor-pointer"
														onClick={() => navigate('/app/projects')}
													>
														<div className="flex items-start justify-between mb-3">
															<div className="flex-1">
																<h4 className="font-semibold mb-1">{project.name}</h4>
																<div className="flex items-center gap-2 text-xs text-neutral-500">
																	<Users className="h-3 w-3" />
																	{project.members} members
																	{project.dueDate && (
																		<>
																			<span>•</span>
																			<Calendar className="h-3 w-3" />
																			{new Date(project.dueDate).toLocaleDateString()}
																		</>
																	)}
																</div>
															</div>
															<span className={`px-2 py-1 text-xs rounded-full font-medium ${
																project.health === 'good'
																	? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
																	: project.health === 'at-risk'
																	? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
																	: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
															}`}>
																{project.health === 'good' ? '✓ Good' : project.health === 'at-risk' ? '⚠ At Risk' : '✗ Delayed'}
															</span>
														</div>

														<div className="space-y-2">
															<div className="flex items-center justify-between text-xs">
																<span className="text-neutral-600 dark:text-neutral-400">Progress</span>
																<span className="font-medium">{project.progress}%</span>
															</div>
															<div className="relative w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
																<div
																	className={`absolute top-0 left-0 h-full ${
																		project.health === 'good'
																			? 'bg-green-600'
																			: project.health === 'at-risk'
																			? 'bg-yellow-600'
																			: 'bg-red-600'
																	}`}
																	style={{ width: `${project.progress}%` }}
																/>
															</div>
														</div>
													</div>
												))}
										</div>
									)}
								</CardContent>
							</Card>
						</div>
					</>
				)}
			</div>
		</div>
	)
}
