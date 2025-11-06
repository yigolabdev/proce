import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import DevMemo from '../components/dev/DevMemo'
import { DEV_MEMOS } from '../constants/devMemos'
import { EmptyState } from '../components/common/EmptyState'
import { LoadingState } from '../components/common/LoadingState'
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts'
import { 
	TrendingUp, 
	Plus,
	Calendar,
	ArrowRight,
	CheckCircle2,
	AlertCircle,
	AlertTriangle,
	Target,
	Clock,
	FileText,
	FolderKanban,
	BarChart3,
	Sparkles
} from 'lucide-react'
import { format, differenceInDays, addDays, startOfDay, parseISO } from 'date-fns'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface WorkEntry {
	id: string
	title: string
	description: string
	category: string
	projectId?: string
	objectiveId?: string
	tags: string[]
	date: Date | string
	duration?: string
	status: 'draft' | 'submitted'
	isConfidential?: boolean
}

interface Project {
	id: string
	name: string
	status?: string
	endDate?: string
}

interface Objective {
	id: string
	title: string
	period: string
	status: string
	endDate?: string
	keyResults: Array<{
		id: string
		current: number
		target: number
	}>
}

export default function DashboardPage() {
	const navigate = useNavigate()
	const searchRef = useRef<HTMLInputElement>(null)
	const [workEntries, setWorkEntries] = useState<WorkEntry[]>([])
	const [projects, setProjects] = useState<Project[]>([])
	const [objectives, setObjectives] = useState<Objective[]>([])
	const [loading, setLoading] = useState(true)

	// Keyboard shortcuts
	useKeyboardShortcuts({
		newWork: () => navigate('/app/input'),
		newObjective: () => navigate('/app/okr'),
		newProject: () => navigate('/app/projects'),
		goToDashboard: () => navigate('/app/dashboard'),
		goToInput: () => navigate('/app/input'),
		focusSearch: () => searchRef.current?.focus(),
	})

	// Load all data
	useEffect(() => {
		const loadData = async () => {
			try {
				// Load work entries
				const savedEntries = localStorage.getItem('workEntries')
				if (savedEntries) {
					const parsed = JSON.parse(savedEntries)
					const entriesWithDates = parsed.map((entry: any) => ({
						...entry,
						date: new Date(entry.date),
					}))
					setWorkEntries(entriesWithDates)
				}

				// Load projects
				const savedProjects = localStorage.getItem('projects')
				if (savedProjects) {
					setProjects(JSON.parse(savedProjects))
				}

				// Load objectives
				const savedObjectives = localStorage.getItem('objectives')
				if (savedObjectives) {
					setObjectives(JSON.parse(savedObjectives))
				}
			} catch (error) {
				console.error('Failed to load dashboard data:', error)
			} finally {
				setLoading(false)
			}
		}

		loadData()
	}, [])

	// ============================================
	// TODAY'S SUMMARY
	// ============================================
	const todaySummary = useMemo(() => {
		const today = startOfDay(new Date())
		const todayEntries = workEntries.filter(entry => {
			const entryDate = startOfDay(new Date(entry.date))
			return entryDate.getTime() === today.getTime()
		})

		const totalHours = todayEntries.reduce((sum, entry) => {
			return sum + parseFloat(entry.duration || '0')
		}, 0)

		const completedCount = todayEntries.filter(e => e.status === 'submitted').length

		return {
			entriesCount: todayEntries.length,
			totalHours: totalHours.toFixed(1),
			completedCount,
			completionRate: todayEntries.length > 0 
				? Math.round((completedCount / todayEntries.length) * 100) 
				: 0
		}
	}, [workEntries])

	// ============================================
	// RECENT ACTIVITY (Last 5)
	// ============================================
	const recentActivity = useMemo(() => {
		return workEntries
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
			.slice(0, 5)
	}, [workEntries])

	// ============================================
	// UPCOMING DEADLINES (Next 7 days)
	// ============================================
	const upcomingDeadlines = useMemo(() => {
		const now = new Date()
		const next7Days = addDays(now, 7)
		const deadlines: Array<{
			type: 'OKR' | 'Project'
			title: string
			deadline: Date
			daysLeft: number
			priority: 'high' | 'medium' | 'low'
			id: string
		}> = []

		// Check OKR deadlines
		objectives.forEach(obj => {
			if (obj.endDate && obj.status !== 'completed') {
				const deadline = typeof obj.endDate === 'string' ? parseISO(obj.endDate) : new Date(obj.endDate)
				if (deadline >= now && deadline <= next7Days) {
					const daysLeft = differenceInDays(deadline, now)
					deadlines.push({
						type: 'OKR',
						title: obj.title,
						deadline,
						daysLeft,
						priority: daysLeft <= 2 ? 'high' : daysLeft <= 4 ? 'medium' : 'low',
						id: obj.id
					})
				}
			}
		})

		// Check Project deadlines
		projects.forEach(proj => {
			if (proj.endDate && proj.status !== 'completed') {
				const deadline = typeof proj.endDate === 'string' ? parseISO(proj.endDate) : new Date(proj.endDate)
				if (deadline >= now && deadline <= next7Days) {
					const daysLeft = differenceInDays(deadline, now)
					deadlines.push({
						type: 'Project',
						title: proj.name,
						deadline,
						daysLeft,
						priority: daysLeft <= 2 ? 'high' : daysLeft <= 4 ? 'medium' : 'low',
						id: proj.id
					})
				}
			}
		})

		return deadlines.sort((a, b) => a.daysLeft - b.daysLeft)
	}, [objectives, projects])

	// ============================================
	// PERFORMANCE CHART (Last 7 Days)
	// ============================================
	const last7DaysData = useMemo(() => {
		const data = []
		for (let i = 6; i >= 0; i--) {
			const date = new Date()
			date.setDate(date.getDate() - i)
			const dayStart = startOfDay(date)
			
			const dayEntries = workEntries.filter(entry => {
				const entryDate = startOfDay(new Date(entry.date))
				return entryDate.getTime() === dayStart.getTime()
			})

			const dayHours = dayEntries.reduce((sum, e) => 
				sum + parseFloat(e.duration || '0'), 0
			)

			data.push({
				date: format(date, 'EEE'),
				fullDate: format(date, 'MMM d'),
				hours: parseFloat(dayHours.toFixed(1)),
				entries: dayEntries.length,
			})
		}
		return data
	}, [workEntries])

	// ============================================
	// AI SUGGESTIONS
	// ============================================
	const aiSuggestions = useMemo(() => {
		const suggestions: Array<{
			type: 'okr' | 'project' | 'work'
			priority: 'high' | 'medium' | 'low'
			title: string
			description: string
			action: string
			link: string
		}> = []

		// 1. Low progress OKRs (<30%)
		objectives.forEach(obj => {
			if (obj.status !== 'completed' && obj.keyResults) {
				const progress = obj.keyResults.reduce((sum, kr) => 
					sum + (kr.current / kr.target) * 100, 0
				) / obj.keyResults.length

				if (progress < 30) {
					suggestions.push({
						type: 'okr',
						priority: 'high',
						title: `Low progress: ${obj.title}`,
						description: `Only ${Math.round(progress)}% complete. Add work entries to track progress.`,
						action: 'Update OKR',
						link: '/app/okr'
					})
				}
			}
		})

		// 2. Inactive projects (no activity in 7+ days)
		projects.forEach(proj => {
			if (proj.status === 'active') {
				const projectEntries = workEntries.filter(e => e.projectId === proj.id)
				if (projectEntries.length > 0) {
					const lastEntry = projectEntries.sort((a, b) => 
						new Date(b.date).getTime() - new Date(a.date).getTime()
					)[0]
					const daysSinceActivity = differenceInDays(new Date(), new Date(lastEntry.date))
					
					if (daysSinceActivity >= 7) {
						suggestions.push({
							type: 'project',
							priority: 'medium',
							title: `Inactive project: ${proj.name}`,
							description: `No activity in the last ${daysSinceActivity} days.`,
							action: 'Review Project',
							link: '/app/projects'
						})
					}
				}
			}
		})

		// 3. No work entries today
		if (todaySummary.entriesCount === 0) {
			suggestions.push({
				type: 'work',
				priority: 'high',
				title: 'Log your work for today',
				description: 'You haven\'t logged any work entries today. Keep your progress up to date!',
				action: 'Add Work Entry',
				link: '/app/input'
			})
		}

		return suggestions.slice(0, 3) // Top 3
	}, [objectives, projects, workEntries, todaySummary])

	// Format relative time
	const formatRelativeTime = (date: Date | string) => {
		const entryDate = new Date(date)
		const now = new Date()
		const diffMs = now.getTime() - entryDate.getTime()
		const diffMins = Math.floor(diffMs / 60000)
		const diffHours = Math.floor(diffMs / 3600000)
		const diffDays = Math.floor(diffMs / 86400000)

		if (diffMins < 1) return 'Just now'
		if (diffMins < 60) return `${diffMins}m ago`
		if (diffHours < 24) return `${diffHours}h ago`
		if (diffDays === 1) return 'Yesterday'
		if (diffDays < 7) return `${diffDays}d ago`
		return format(entryDate, 'MMM d')
	}

	if (loading) {
		return (
			<div className="space-y-6">
				<LoadingState type="page" count={4} />
			</div>
		)
	}

	return (
		<>
			<DevMemo content={DEV_MEMOS.DASHBOARD} pagePath="/pages/DashboardPage.tsx" />
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold">Dashboard</h1>
						<p className="text-neutral-600 dark:text-neutral-400 mt-1">
							{format(new Date(), 'EEEE, MMMM d, yyyy')}
						</p>
					</div>
					<div className="flex gap-3">
						<Button
							variant="outline"
							onClick={() => navigate('/app/input')}
							className="flex items-center gap-2"
						>
							<FileText className="h-4 w-4" />
							Add Work
						</Button>
					</div>
				</div>

				{/* Today's Summary */}
				<Card>
					<CardHeader>
						<h2 className="text-xl font-semibold">Today's Summary</h2>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
								<div className="flex items-center justify-between mb-2">
									<p className="text-sm text-neutral-600 dark:text-neutral-400">Work Entries</p>
									<FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
								</div>
								<p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
									{todaySummary.entriesCount}
								</p>
							</div>

							<div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
								<div className="flex items-center justify-between mb-2">
									<p className="text-sm text-neutral-600 dark:text-neutral-400">Hours Logged</p>
									<Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
								</div>
								<p className="text-2xl font-bold text-green-700 dark:text-green-300">
									{todaySummary.totalHours}h
								</p>
							</div>

							<div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
								<div className="flex items-center justify-between mb-2">
									<p className="text-sm text-neutral-600 dark:text-neutral-400">Completed</p>
									<CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
								</div>
								<p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
									{todaySummary.completedCount}
								</p>
							</div>

							<div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
								<div className="flex items-center justify-between mb-2">
									<p className="text-sm text-neutral-600 dark:text-neutral-400">Completion Rate</p>
									<BarChart3 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
								</div>
								<p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
									{todaySummary.completionRate}%
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Recent Activity */}
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<h2 className="text-xl font-semibold">Recent Activity</h2>
							<Button
								variant="secondary"
								size="sm"
								onClick={() => navigate('/app/work-history')}
							>
								View All
									<ArrowRight className="h-4 w-4 ml-2" />
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							{recentActivity.length === 0 ? (
								<EmptyState
									icon={<FileText className="h-12 w-12" />}
									title="No recent activity"
									description="Start by adding your first work entry"
									action={
										<Button onClick={() => navigate('/app/input')}>
											<Plus className="h-4 w-4 mr-2" />
											Add Work Entry
										</Button>
									}
								/>
							) : (
								<div className="space-y-3">
									{recentActivity.map(entry => (
										<div
											key={entry.id}
											className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
											onClick={() => navigate('/app/work-history')}
										>
											<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
												<FileText className="h-5 w-5 text-primary" />
											</div>
											<div className="flex-1 min-w-0">
												<p className="font-medium truncate">{entry.title}</p>
												<p className="text-sm text-neutral-600 dark:text-neutral-400">
													{formatRelativeTime(entry.date)}
													{entry.duration && ` • ${entry.duration}h`}
												</p>
											</div>
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>

					{/* Upcoming Deadlines */}
					<Card>
						<CardHeader>
							<div className="flex items-center gap-2">
								<AlertCircle className="h-5 w-5 text-amber-500" />
								<h2 className="text-xl font-semibold">Upcoming Deadlines</h2>
							</div>
							<p className="text-sm text-neutral-600 dark:text-neutral-400">Next 7 days</p>
						</CardHeader>
						<CardContent>
							{upcomingDeadlines.length === 0 ? (
								<EmptyState
									icon={<Calendar className="h-12 w-12" />}
									title="No upcoming deadlines"
									description="All clear for the next 7 days"
								/>
							) : (
								<div className="space-y-3">
									{upcomingDeadlines.map((deadline, idx) => (
										<div
											key={`${deadline.type}-${deadline.id}-${idx}`}
											className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-primary/50 transition-colors cursor-pointer"
											onClick={() => navigate(deadline.type === 'OKR' ? '/app/okr' : '/app/projects')}
										>
											{deadline.type === 'OKR' ? (
												<Target className="h-5 w-5 text-blue-500 shrink-0" />
											) : (
												<FolderKanban className="h-5 w-5 text-purple-500 shrink-0" />
											)}
											<div className="flex-1 min-w-0">
												<p className="font-medium truncate">{deadline.title}</p>
												<p className="text-sm text-neutral-600 dark:text-neutral-400">
													{deadline.daysLeft === 0 ? 'Due today' : 
													 deadline.daysLeft === 1 ? 'Due tomorrow' : 
													 `Due in ${deadline.daysLeft} days`}
												</p>
											</div>
											{deadline.priority === 'high' && (
												<span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
													Urgent
												</span>
											)}
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Performance Chart */}
				<Card>
					<CardHeader>
						<h2 className="text-xl font-semibold">Last 7 Days Performance</h2>
					</CardHeader>
					<CardContent>
						{last7DaysData.every(d => d.hours === 0) ? (
							<EmptyState
								icon={<TrendingUp className="h-12 w-12" />}
								title="No data yet"
								description="Start logging work to see your performance trends"
							/>
						) : (
							<div className="h-64">
								<ResponsiveContainer width="100%" height="100%">
									<LineChart data={last7DaysData}>
										<CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200 dark:stroke-neutral-800" />
										<XAxis 
											dataKey="date" 
											className="text-xs"
											tick={{ fill: 'currentColor' }}
										/>
										<YAxis 
											className="text-xs"
											tick={{ fill: 'currentColor' }}
											label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}
										/>
										<Tooltip
											contentStyle={{
												backgroundColor: 'var(--card-bg)',
												border: '1px solid var(--border)',
												borderRadius: '8px',
											}}
											labelStyle={{ color: 'var(--text)' }}
										/>
										<Line 
											type="monotone" 
											dataKey="hours" 
											stroke="#3B82F6" 
											strokeWidth={3}
											dot={{ r: 4, fill: '#3B82F6' }}
											activeDot={{ r: 6 }}
										/>
									</LineChart>
								</ResponsiveContainer>
							</div>
						)}
					</CardContent>
				</Card>

				{/* AI Suggestions */}
				{aiSuggestions.length > 0 && (
					<Card>
						<CardHeader>
							<div className="flex items-center gap-2">
								<Sparkles className="h-5 w-5 text-primary" />
								<h2 className="text-xl font-semibold">AI Suggestions</h2>
							</div>
							<p className="text-sm text-neutral-600 dark:text-neutral-400">
								Based on your activity and goals
							</p>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{aiSuggestions.map((suggestion, idx) => (
									<div
										key={idx}
										className="flex items-start gap-3 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-primary/50 transition-colors"
									>
										{suggestion.priority === 'high' ? (
											<AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
										) : suggestion.priority === 'medium' ? (
											<AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
										) : (
											<CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
										)}
										<div className="flex-1">
											<p className="font-medium">{suggestion.title}</p>
											<p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
												{suggestion.description}
											</p>
										</div>
										<Button
											variant="outline"
											size="sm"
											onClick={() => navigate(suggestion.link)}
										>
											{suggestion.action}
										</Button>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				)}

				{/* Quick Actions */}
				<Card>
					<CardHeader>
						<h2 className="text-xl font-semibold">Quick Actions</h2>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<button
								onClick={() => navigate('/app/input')}
								className="p-6 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-primary hover:bg-primary/5 transition-all text-left group"
							>
								<FileText className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
								<h3 className="font-semibold mb-1">Add Work Entry</h3>
								<p className="text-sm text-neutral-600 dark:text-neutral-400">
									Log your daily work activities
								</p>
								<div className="mt-3 text-xs text-neutral-500">
									Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">N</kbd>
								</div>
							</button>

							<button
								onClick={() => navigate('/app/okr')}
								className="p-6 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-primary hover:bg-primary/5 transition-all text-left group"
							>
								<Target className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
								<h3 className="font-semibold mb-1">Update OKR</h3>
								<p className="text-sm text-neutral-600 dark:text-neutral-400">
									Track your objectives progress
								</p>
								<div className="mt-3 text-xs text-neutral-500">
									Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">O</kbd>
								</div>
							</button>

							<button
								onClick={() => navigate('/app/projects')}
								className="p-6 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-primary hover:bg-primary/5 transition-all text-left group"
							>
								<FolderKanban className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
								<h3 className="font-semibold mb-1">Manage Projects</h3>
								<p className="text-sm text-neutral-600 dark:text-neutral-400">
									View and update your projects
								</p>
								<div className="mt-3 text-xs text-neutral-500">
									Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">P</kbd>
								</div>
							</button>
						</div>
					</CardContent>
				</Card>
			</div>
		</>
	)
}
