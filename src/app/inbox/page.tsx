import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import {
	Inbox,
	Mail,
	MailOpen,
	Trash2,
	Archive,
	Star,
	Clock,
	CheckCircle2,
	X,
	Sparkles,
	FileText,
	ArrowRight,
	TrendingUp,
	Target,
	XCircle,
	RefreshCw,
	Brain,
	Zap,
	Calendar,
} from 'lucide-react'
import { toast } from 'sonner'
import Toaster from '../../components/ui/Toaster'

// Inbox Message Interface
interface Message {
	id: string
	from: string
	subject: string
	preview: string
	content: string
	aiSummary: string
	aiInsights: string[]
	suggestedActions: string[]
	relatedLinks: Array<{ title: string; url: string }>
	timestamp: Date
	isRead: boolean
	isStarred: boolean
	type: 'task' | 'notification' | 'approval' | 'message'
}

// AI Task Recommendation Interface
interface TaskRecommendation {
	id: string
	title: string
	description: string
	priority: 'high' | 'medium' | 'low'
	category: string
	estimatedTime: string
	deadline?: string
	reason: string
	relatedSkills: string[]
	confidence: number
	status: 'pending' | 'accepted' | 'rejected'
}

interface RecommendationInsight {
	type: 'productivity' | 'skill' | 'deadline' | 'workload'
	title: string
	description: string
	icon: React.ReactNode
}

export default function InboxPage() {
	const navigate = useNavigate()
	const [activeTab, setActiveTab] = useState<'messages' | 'recommendations'>('messages')

	// Messages state
	const [messages, setMessages] = useState<Message[]>([])
	const [filter, setFilter] = useState<'all' | 'unread' | 'starred'>('all')
	const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

	// AI Recommendations state
	const [recommendations, setRecommendations] = useState<TaskRecommendation[]>([])
	const [insights, setInsights] = useState<RecommendationInsight[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

	useEffect(() => {
		loadMessages()
		loadRecommendations()
	}, [])

	// Load Messages
	const loadMessages = () => {
		const mockMessages: Message[] = [
			{
				id: '1',
				from: 'Team Lead',
				subject: 'Q4 Project Status Report Request',
				preview: 'Please submit your project status report by Friday.',
				content: 'Hello,\n\nPlease submit your Q4 project status report by this Friday.\n\nRequired sections:\n- Completed tasks\n- Current progress\n- Issues and solutions\n- Next week plans\n\nThank you.',
				aiSummary: 'Team Lead requests Q4 project status report by Friday. Include completed/ongoing tasks, issues, and next week plans.',
				aiInsights: [
					'Urgency: High - Due Friday',
					'Estimated time: 2-3 hours',
					'3 similar previous reports found',
				],
				suggestedActions: [
					'Organize task list',
					'Document issues',
					'Plan next week schedule',
				],
				relatedLinks: [
					{ title: 'Previous Weekly Report', url: '#' },
					{ title: 'Project Timeline', url: '#' },
				],
				timestamp: new Date(Date.now() - 1000 * 60 * 30),
				isRead: false,
				isStarred: true,
				type: 'task',
			},
			{
				id: '2',
				from: 'System',
				subject: 'New Task Assigned',
				preview: 'Customer data entry task has been assigned.',
				content: 'New task assigned.\n\nTask: Customer Data Entry\nAssignee: You\nDeadline: 2025-11-05\nPriority: Medium\n\nDescription:\nEnter data for 50 new customers who joined in October.',
				aiSummary: 'Customer data entry task for 50 new customers assigned. Deadline: November 5, Priority: Medium.',
				aiInsights: [
					'Estimated time: 4-5 hours',
					'Similar task average completion: 4.2 hours',
					'Data entry template recommended',
				],
				suggestedActions: [
					'Download customer data file',
					'Check data validation checklist',
					'Track progress',
				],
				relatedLinks: [
					{ title: 'Data Entry Guide', url: '#' },
					{ title: 'Customer Info Template', url: '#' },
				],
				timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
				isRead: false,
				isStarred: false,
				type: 'notification',
			},
			{
				id: '3',
				from: 'Employee',
				subject: 'Leave Request Approval',
				preview: 'Requesting 3 days leave starting next Monday.',
				content: 'Hello,\n\nI am requesting annual leave for 3 days from Monday (Nov 4) to Wednesday (Nov 6).\n\nReason: Personal matters\n\nWork handover will be completed by Friday.\nThank you.',
				aiSummary: 'Employee requesting 3 days annual leave from Nov 4-6. Work handover by Friday.',
				aiInsights: [
					'Employee remaining annual leave: 5 days',
					'Team workload during period: Normal',
					'No replacement needed',
				],
				suggestedActions: [
					'Approve leave',
					'Update team calendar',
					'Confirm handover',
				],
				relatedLinks: [
					{ title: 'Leave Management System', url: '#' },
					{ title: 'Team Schedule', url: '#' },
				],
				timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
				isRead: true,
				isStarred: false,
				type: 'approval',
			},
		]
		setMessages(mockMessages)
	}

	// Load AI Recommendations
	const loadRecommendations = () => {
		setIsLoading(true)

		setTimeout(() => {
			// Load actual data from localStorage
			const projectsData = localStorage.getItem('projects')
			const workEntriesData = localStorage.getItem('workEntries')
			
			const projects = projectsData ? JSON.parse(projectsData) : []
			const workEntries = workEntriesData ? JSON.parse(workEntriesData).map((e: any) => ({
				...e,
				date: new Date(e.date)
			})) : []
			
			// Mock OKR data (would come from localStorage in production)
			const objectives = [
				{ id: '1', title: 'Increase Product Market Fit', progress: 45, target: 80 },
				{ id: '2', title: 'Scale Revenue Growth', progress: 30, target: 100 },
				{ id: '3', title: 'Enhance Team Productivity', progress: 70, target: 90 },
			]
			
			// Analyze and generate recommendations
			const generatedRecommendations: TaskRecommendation[] = []
			
			// 1. Check for low-progress objectives
			objectives.forEach(objective => {
				if (objective.progress < 50) {
					const gap = objective.target - objective.progress
					generatedRecommendations.push({
						id: `okr-${objective.id}`,
						title: `Boost Progress on "${objective.title}"`,
						description: `Your goal "${objective.title}" is at ${objective.progress}% (target: ${objective.target}%). Focus on key results to close the ${gap}% gap.`,
						priority: objective.progress < 30 ? 'high' : 'medium',
						category: 'goal-progress',
						estimatedTime: '2-4 hours',
						deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
						reason: `AI detected low progress (${objective.progress}%) on this critical goal. Recommended action to avoid falling behind.`,
						relatedSkills: ['Strategic Planning', 'Goal Management', 'Execution'],
						confidence: 90,
						status: 'pending',
					})
				}
			})
			
			// 2. Check for projects with no recent activity
			const sevenDaysAgo = new Date()
			sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
			
			projects
				.filter((p: any) => p.status === 'active')
				.forEach((project: any) => {
					const recentWork = workEntries.filter((e: any) => 
						e.projectId === project.id && new Date(e.date) >= sevenDaysAgo
					)
					
					if (recentWork.length === 0) {
						generatedRecommendations.push({
							id: `project-${project.id}`,
							title: `Update Project: ${project.name}`,
							description: `No activity recorded for "${project.name}" in the last 7 days. Consider updating progress or scheduling next steps.`,
							priority: 'medium',
							category: 'project-update',
							estimatedTime: '1-2 hours',
							deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
							reason: 'AI detected no recent activity on this active project. Regular updates ensure project momentum.',
							relatedSkills: ['Project Management', 'Communication', 'Planning'],
							confidence: 85,
							status: 'pending',
						})
					}
				})
			
			// 3. Add some standard recommendations
			const standardRecommendations: TaskRecommendation[] = [
				{
					id: '1',
					title: 'Review Q4 Financial Reports',
					description: 'Analyze financial performance and prepare summary for stakeholders',
					priority: 'high',
					category: 'Finance',
					estimatedTime: '2 hours',
					deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
					reason: 'Based on your expertise in financial analysis and upcoming board meeting',
					relatedSkills: ['Financial Analysis', 'Data Interpretation', 'Reporting'],
					confidence: 92,
					status: 'pending',
				},
				{
					id: '2',
					title: 'Update Customer Database',
					description: 'Clean and update customer contact information in CRM system',
					priority: 'medium',
					category: 'Data Management',
					estimatedTime: '1.5 hours',
					reason: 'Your recent work on data quality improvement makes you ideal for this task',
					relatedSkills: ['Data Entry', 'CRM Systems', 'Attention to Detail'],
					confidence: 85,
					status: 'pending',
				},
				{
					id: '3',
					title: 'Prepare Team Meeting Agenda',
					description: 'Create agenda for next week\'s team sync meeting',
					priority: 'medium',
					category: 'Meeting',
					estimatedTime: '30 minutes',
					deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
					reason: 'You have consistently organized effective team meetings',
					relatedSkills: ['Communication', 'Organization', 'Leadership'],
					confidence: 88,
					status: 'pending',
				},
				{
					id: '4',
					title: 'Code Review: Authentication Module',
					description: 'Review pull request for new authentication implementation',
					priority: 'high',
					category: 'Development',
					estimatedTime: '1 hour',
					deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
					reason: 'Your security expertise is needed for this critical review',
					relatedSkills: ['Security', 'Code Review', 'Authentication'],
					confidence: 95,
					status: 'pending',
				},
				{
					id: '5',
					title: 'Document API Endpoints',
					description: 'Create comprehensive documentation for new API endpoints',
					priority: 'low',
					category: 'Documentation',
					estimatedTime: '3 hours',
					reason: 'You have experience writing clear technical documentation',
					relatedSkills: ['Technical Writing', 'API Design', 'Documentation'],
					confidence: 78,
					status: 'pending',
				},
			]

			const mockInsights: RecommendationInsight[] = [
				{
					type: 'productivity',
					title: 'Peak Productivity Time',
					description: 'Your productivity is highest between 9 AM - 11 AM. Schedule important tasks during this time.',
					icon: <TrendingUp className="h-5 w-5 text-green-600" />,
				},
				{
					type: 'skill',
					title: 'Skill Match',
					description: 'These recommendations match your top skills: Financial Analysis, Data Management, Code Review.',
					icon: <Target className="h-5 w-5 text-blue-600" />,
				},
				{
					type: 'deadline',
					title: 'Upcoming Deadlines',
					description: '2 high-priority tasks have deadlines within 48 hours.',
					icon: <Clock className="h-5 w-5 text-orange-600" />,
				},
				{
					type: 'workload',
					title: 'Balanced Workload',
					description: 'Your current workload is well-balanced. You can take on 1-2 more tasks this week.',
					icon: <Zap className="h-5 w-5 text-purple-600" />,
				},
			]
			
			// Combine AI-generated and standard recommendations
			const allRecommendations = [
				...generatedRecommendations,
				...standardRecommendations.slice(0, Math.max(0, 5 - generatedRecommendations.length))
			]

			setRecommendations(allRecommendations)
			
			// Update insights based on actual data
			const updatedInsights: RecommendationInsight[] = [
				{
					type: 'productivity',
					title: 'AI Analysis Active',
					description: `Analyzed ${projects.length} projects and ${objectives.length} goals to generate personalized recommendations.`,
					icon: <Brain className="h-5 w-5 text-blue-600" />,
				},
				...mockInsights.slice(0, 3)
			]
			
			setInsights(updatedInsights)
			setLastUpdated(new Date())
			setIsLoading(false)
		}, 1000)
	}

	// Message handlers
	const handleMarkAsRead = (id: string) => {
		setMessages((prev) =>
			prev.map((msg) => (msg.id === id ? { ...msg, isRead: true } : msg))
		)
		toast.success('Marked as read')
	}

	const handleToggleStar = (id: string) => {
		setMessages((prev) =>
			prev.map((msg) => (msg.id === id ? { ...msg, isStarred: !msg.isStarred } : msg))
		)
	}

	const handleDeleteMessage = (id: string) => {
		setMessages((prev) => prev.filter((msg) => msg.id !== id))
		toast.success('Message deleted')
	}

	const handleArchive = (id: string) => {
		setMessages((prev) => prev.filter((msg) => msg.id !== id))
		toast.success('Message archived')
	}

	const handleOpenMessage = (message: Message) => {
		setSelectedMessage(message)
		if (!message.isRead) {
			handleMarkAsRead(message.id)
		}
	}

	const handleCloseMessage = () => {
		setSelectedMessage(null)
	}

	const handleGoToWorkInput = () => {
		if (selectedMessage) {
			sessionStorage.setItem('workInputData', JSON.stringify({
				title: selectedMessage.subject,
				description: selectedMessage.content,
				category: selectedMessage.type === 'task' ? 'development' : 'other',
			}))
			navigate('/input')
			toast.success('Navigating to Work Input')
		}
	}

	// Recommendation handlers
	const handleAcceptTask = (id: string) => {
		const task = recommendations.find((rec) => rec.id === id)
		if (!task) return

		// Work Input으로 이동하면서 추천 정보 전달
		sessionStorage.setItem('workInputData', JSON.stringify({
			title: task.title,
			description: task.description,
			category: task.category.toLowerCase().replace(/\s+/g, '-'),
			estimatedTime: task.estimatedTime,
			priority: task.priority,
			deadline: task.deadline,
			skills: task.relatedSkills,
			aiReason: task.reason,
			source: 'ai-recommendation'
		}))

		// 상태 업데이트
		setRecommendations((prev) =>
			prev.map((rec) => (rec.id === id ? { ...rec, status: 'accepted' } : rec))
		)

		// Work Input 페이지로 이동
		navigate('/input')
		toast.success('Redirecting to Work Input to complete task details...')
	}

	const handleRejectTask = (id: string) => {
		setRecommendations((prev) =>
			prev.map((rec) => (rec.id === id ? { ...rec, status: 'rejected' } : rec))
		)
		toast.info('Task declined. We\'ll adjust future recommendations.')
	}

	const handleRefreshRecommendations = () => {
		loadRecommendations()
		toast.success('Recommendations refreshed')
	}

	// Utility functions
	const getTypeIcon = (type: Message['type']) => {
		switch (type) {
			case 'task':
				return <CheckCircle2 className="h-4 w-4 text-blue-500" />
			case 'notification':
				return <Mail className="h-4 w-4 text-green-500" />
			case 'approval':
				return <Clock className="h-4 w-4 text-orange-500" />
			case 'message':
				return <MailOpen className="h-4 w-4 text-neutral-500" />
		}
	}

	const getTypeLabel = (type: Message['type']) => {
		switch (type) {
			case 'task':
				return 'Task'
			case 'notification':
				return 'Notification'
			case 'approval':
				return 'Approval'
			case 'message':
				return 'Message'
		}
	}

	const getPriorityColor = (priority: TaskRecommendation['priority']) => {
		switch (priority) {
			case 'high':
				return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
			case 'medium':
				return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
			case 'low':
				return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
		}
	}

	const formatTimestamp = (date: Date) => {
		const now = new Date()
		const diff = now.getTime() - date.getTime()
		const minutes = Math.floor(diff / 1000 / 60)
		const hours = Math.floor(minutes / 60)
		const days = Math.floor(hours / 24)

		if (minutes < 60) return `${minutes}m ago`
		if (hours < 24) return `${hours}h ago`
		if (days < 7) return `${days}d ago`
		return date.toLocaleDateString()
	}

	const filteredMessages = messages.filter((msg) => {
		if (filter === 'unread') return !msg.isRead
		if (filter === 'starred') return msg.isStarred
		return true
	})

	const unreadCount = messages.filter((msg) => !msg.isRead).length
	const pendingRecommendations = recommendations.filter((r) => r.status === 'pending')
	const acceptedCount = recommendations.filter((r) => r.status === 'accepted').length

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold flex items-center gap-3">
						<Inbox className="h-8 w-8 text-primary" />
						Notifications & AI Assistant
					</h1>
					<p className="mt-2 text-neutral-600 dark:text-neutral-400">
						Stay updated with messages, tasks, and AI-powered recommendations
					</p>
				</div>
				<div className="flex items-center gap-4">
					{activeTab === 'messages' && (
						<span className="text-sm text-neutral-600 dark:text-neutral-400">
							Unread: <span className="font-bold text-primary">{unreadCount}</span>
						</span>
					)}
					{activeTab === 'recommendations' && (
						<Button
							variant="outline"
							size="sm"
							onClick={handleRefreshRecommendations}
							disabled={isLoading}
							className="flex items-center gap-2"
						>
							<RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
							Refresh
						</Button>
					)}
				</div>
			</div>

			{/* Tabs */}
			<div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800">
				<button
					onClick={() => setActiveTab('messages')}
					className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
						activeTab === 'messages'
							? 'border-primary text-primary'
							: 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
					}`}
				>
					<div className="flex items-center gap-2">
						<Mail className="h-4 w-4" />
						Messages ({messages.length})
					</div>
				</button>
				<button
					onClick={() => setActiveTab('recommendations')}
					className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
						activeTab === 'recommendations'
							? 'border-primary text-primary'
							: 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
					}`}
				>
					<div className="flex items-center gap-2">
						<Sparkles className="h-4 w-4" />
						AI Recommendations ({pendingRecommendations.length})
					</div>
				</button>
			</div>

			{/* Messages Tab */}
			{activeTab === 'messages' && (
				<>
					{/* Filter Tabs */}
					<div className="flex items-center gap-2">
						<button
							onClick={() => setFilter('all')}
							className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
								filter === 'all'
									? 'bg-primary text-white'
									: 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'
							}`}
						>
							All ({messages.length})
						</button>
						<button
							onClick={() => setFilter('unread')}
							className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
								filter === 'unread'
									? 'bg-primary text-white'
									: 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'
							}`}
						>
							Unread ({unreadCount})
						</button>
						<button
							onClick={() => setFilter('starred')}
							className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
								filter === 'starred'
									? 'bg-primary text-white'
									: 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'
							}`}
						>
							Starred ({messages.filter((m) => m.isStarred).length})
						</button>
					</div>

					{/* Messages List */}
					<div className="space-y-2">
						{filteredMessages.length === 0 ? (
							<Card>
								<CardContent className="p-12 text-center">
									<Inbox className="h-16 w-16 mx-auto mb-4 text-neutral-300 dark:text-neutral-700" />
									<p className="text-neutral-600 dark:text-neutral-400">
										{filter === 'unread' && 'No unread messages'}
										{filter === 'starred' && 'No starred messages'}
										{filter === 'all' && 'No messages'}
									</p>
								</CardContent>
							</Card>
						) : (
							filteredMessages.map((message) => (
								<Card
									key={message.id}
									className={`transition-all hover:shadow-md cursor-pointer ${
										!message.isRead ? 'border-l-4 border-l-primary bg-blue-50/30 dark:bg-blue-900/10' : ''
									}`}
									onClick={() => handleOpenMessage(message)}
								>
									<CardContent className="p-4">
										<div className="flex items-start gap-4">
											<div className="flex-shrink-0 mt-1">{getTypeIcon(message.type)}</div>
											<div className="flex-1 min-w-0">
												<div className="flex items-start justify-between gap-4 mb-2">
													<div className="flex-1 min-w-0">
														<div className="flex items-center gap-2 mb-1">
															<span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
																{getTypeLabel(message.type)}
															</span>
															<span className={`text-sm ${!message.isRead ? 'font-bold' : 'font-medium'}`}>
																{message.from}
															</span>
														</div>
														<h3
															className={`text-base mb-1 truncate ${
																!message.isRead ? 'font-bold text-neutral-900 dark:text-neutral-100' : 'font-medium'
															}`}
														>
															{message.subject}
														</h3>
														<p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
															{message.preview}
														</p>
													</div>
													<span className="text-xs text-neutral-500 dark:text-neutral-400 flex-shrink-0">
														{formatTimestamp(message.timestamp)}
													</span>
												</div>
												<div className="flex items-center gap-2 mt-3">
													{!message.isRead && (
														<Button
															size="sm"
															variant="outline"
															onClick={(e) => {
																e.stopPropagation()
																handleMarkAsRead(message.id)
															}}
															className="text-xs"
														>
															<MailOpen className="h-3 w-3 mr-1" />
															Read
														</Button>
													)}
													<button
														onClick={(e) => {
															e.stopPropagation()
															handleToggleStar(message.id)
														}}
														className={`p-1.5 rounded-lg transition-colors ${
															message.isStarred
																? 'text-yellow-500 hover:text-yellow-600'
																: 'text-neutral-400 hover:text-yellow-500'
														}`}
													>
														<Star className={`h-4 w-4 ${message.isStarred ? 'fill-current' : ''}`} />
													</button>
													<button
														onClick={(e) => {
															e.stopPropagation()
															handleArchive(message.id)
														}}
														className="p-1.5 rounded-lg text-neutral-400 hover:text-blue-500 transition-colors"
													>
														<Archive className="h-4 w-4" />
													</button>
													<button
														onClick={(e) => {
															e.stopPropagation()
															handleDeleteMessage(message.id)
														}}
														className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 transition-colors"
													>
														<Trash2 className="h-4 w-4" />
													</button>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							))
						)}
					</div>
				</>
			)}

			{/* AI Recommendations Tab */}
			{activeTab === 'recommendations' && (
				<>
					{/* Stats */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<Card>
							<CardContent className="p-4">
								<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Pending</div>
								<div className="text-2xl font-bold">{pendingRecommendations.length}</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4">
								<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Accepted</div>
								<div className="text-2xl font-bold text-green-600">{acceptedCount}</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4">
								<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Avg Confidence</div>
								<div className="text-2xl font-bold text-blue-600">
									{Math.round(recommendations.reduce((acc, r) => acc + r.confidence, 0) / recommendations.length || 0)}%
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4">
								<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Last Updated</div>
								<div className="text-sm font-medium">
									{lastUpdated ? formatTimestamp(lastUpdated) : 'Never'}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* AI Insights */}
					{insights.length > 0 && (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							{insights.map((insight, index) => (
								<Card key={index} className="border-l-4 border-l-primary">
									<CardContent className="p-4">
										<div className="flex items-start gap-3">
											<div className="flex-shrink-0 mt-0.5">{insight.icon}</div>
											<div className="flex-1 min-w-0">
												<h3 className="font-bold text-sm mb-1">{insight.title}</h3>
												<p className="text-xs text-neutral-600 dark:text-neutral-400">
													{insight.description}
												</p>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}

					{/* Recommendations List */}
					<div className="space-y-4">
						{isLoading ? (
							<Card>
								<CardContent className="p-12 text-center">
									<RefreshCw className="h-12 w-12 mx-auto mb-4 text-primary animate-spin" />
									<p className="text-neutral-600 dark:text-neutral-400">
										Loading recommendations...
									</p>
								</CardContent>
							</Card>
						) : pendingRecommendations.length === 0 ? (
							<Card>
								<CardContent className="p-12 text-center">
									<Sparkles className="h-16 w-16 mx-auto mb-4 text-neutral-300 dark:text-neutral-700" />
									<h3 className="text-lg font-bold mb-2">All Caught Up!</h3>
									<p className="text-neutral-600 dark:text-neutral-400 mb-4">
										No new recommendations at the moment. Check back later!
									</p>
									<Button onClick={handleRefreshRecommendations}>
										<RefreshCw className="h-4 w-4 mr-2" />
										Refresh Recommendations
									</Button>
								</CardContent>
							</Card>
						) : (
							pendingRecommendations.map((task) => (
								<Card key={task.id} className="hover:shadow-lg transition-shadow">
									<CardHeader className="border-b border-neutral-200 dark:border-neutral-800">
										<div className="flex items-start justify-between gap-4">
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2 mb-2">
													<span
														className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor(
															task.priority
														)}`}
													>
														{task.priority.toUpperCase()}
													</span>
													<span className="text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
														{task.category}
													</span>
													<div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
														<Brain className="h-3 w-3" />
														{task.confidence}% match
													</div>
												</div>
												<h3 className="text-lg font-bold mb-1">{task.title}</h3>
												<p className="text-sm text-neutral-600 dark:text-neutral-400">
													{task.description}
												</p>
											</div>
										</div>
									</CardHeader>
									<CardContent className="p-4">
										<div className="space-y-4">
											{/* Task Details */}
											<div className="grid grid-cols-2 gap-4">
												<div className="flex items-center gap-2 text-sm">
													<Clock className="h-4 w-4 text-neutral-500" />
													<span className="text-neutral-600 dark:text-neutral-400">
														Est. {task.estimatedTime}
													</span>
												</div>
												{task.deadline && (
													<div className="flex items-center gap-2 text-sm">
														<Calendar className="h-4 w-4 text-neutral-500" />
														<span className="text-neutral-600 dark:text-neutral-400">
															Due: {new Date(task.deadline).toLocaleDateString()}
														</span>
													</div>
												)}
											</div>

											{/* AI Reason */}
											<div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
												<div className="flex items-start gap-2">
													<Brain className="h-4 w-4 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
													<div className="flex-1 min-w-0">
														<p className="text-xs font-medium text-purple-900 dark:text-purple-100 mb-1">
															Why this task?
														</p>
														<p className="text-xs text-purple-700 dark:text-purple-300">
															{task.reason}
														</p>
													</div>
												</div>
											</div>

											{/* Related Skills */}
											{task.relatedSkills.length > 0 && (
												<div>
													<p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2">
														Related Skills:
													</p>
													<div className="flex flex-wrap gap-2">
														{task.relatedSkills.map((skill, index) => (
															<span
																key={index}
																className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full"
															>
																{skill}
															</span>
														))}
													</div>
												</div>
											)}

											{/* Actions */}
											<div className="flex items-center gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
												<Button
													onClick={() => handleAcceptTask(task.id)}
													className="flex-1 flex items-center justify-center gap-2"
												>
													<CheckCircle2 className="h-4 w-4" />
													Accept Task
												</Button>
												<Button
													variant="outline"
													onClick={() => handleRejectTask(task.id)}
													className="flex-1 flex items-center justify-center gap-2"
												>
													<XCircle className="h-4 w-4" />
													Not Now
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							))
						)}
					</div>
				</>
			)}

			{/* Message Detail Modal */}
			{selectedMessage && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
					<div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
						{/* Header */}
						<div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
							<div className="flex items-start justify-between gap-4">
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2 mb-2">
										{getTypeIcon(selectedMessage.type)}
										<span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
											{getTypeLabel(selectedMessage.type)}
										</span>
										<span className="text-sm text-neutral-600 dark:text-neutral-400">
											{selectedMessage.from}
										</span>
									</div>
									<h2 className="text-2xl font-bold mb-2">{selectedMessage.subject}</h2>
									<p className="text-sm text-neutral-600 dark:text-neutral-400">
										{formatTimestamp(selectedMessage.timestamp)}
									</p>
								</div>
								<button
									onClick={handleCloseMessage}
									className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 flex-shrink-0"
								>
									<X className="h-6 w-6" />
								</button>
							</div>
						</div>

						{/* Content */}
						<div className="flex-1 overflow-y-auto p-6 space-y-6">
							{/* AI Summary */}
							<div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl">
								<div className="flex items-start gap-3">
									<Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
									<div className="flex-1">
										<h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2">
											AI Summary
										</h3>
										<p className="text-sm text-blue-700 dark:text-blue-300">
											{selectedMessage.aiSummary}
										</p>
									</div>
								</div>
							</div>

							{/* Original Content */}
							<div>
								<h3 className="font-bold mb-3 flex items-center gap-2">
									<Mail className="h-5 w-5 text-primary" />
									Original Content
								</h3>
								<div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 whitespace-pre-wrap text-sm">
									{selectedMessage.content}
								</div>
							</div>

							{/* AI Insights */}
							{selectedMessage.aiInsights.length > 0 && (
								<div>
									<h3 className="font-bold mb-3 flex items-center gap-2">
										<Sparkles className="h-5 w-5 text-primary" />
										AI Insights
									</h3>
									<div className="space-y-2">
										{selectedMessage.aiInsights.map((insight, index) => (
											<div
												key={index}
												className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl"
											>
												<CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
												<p className="text-sm text-purple-700 dark:text-purple-300">
													{insight}
												</p>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Suggested Actions */}
							{selectedMessage.suggestedActions.length > 0 && (
								<div>
									<h3 className="font-bold mb-3 flex items-center gap-2">
										<CheckCircle2 className="h-5 w-5 text-primary" />
										Suggested Actions
									</h3>
									<div className="space-y-2">
										{selectedMessage.suggestedActions.map((action, index) => (
											<div
												key={index}
												className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl"
											>
												<div className="h-2 w-2 rounded-full bg-green-600 dark:bg-green-400 flex-shrink-0" />
												<p className="text-sm text-green-700 dark:text-green-300">
													{action}
												</p>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Related Links */}
							{selectedMessage.relatedLinks.length > 0 && (
								<div>
									<h3 className="font-bold mb-3 flex items-center gap-2">
										<FileText className="h-5 w-5 text-primary" />
										Related Documents
									</h3>
									<div className="space-y-2">
										{selectedMessage.relatedLinks.map((link, index) => (
											<a
												key={index}
												href={link.url}
												className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
											>
												<FileText className="h-4 w-4 text-primary flex-shrink-0" />
												<span className="text-sm font-medium flex-1">{link.title}</span>
												<ArrowRight className="h-4 w-4 text-neutral-400" />
											</a>
										))}
									</div>
								</div>
							)}
						</div>

						{/* Footer Actions */}
						<div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
							<div className="flex items-center justify-between gap-4">
								<div className="flex items-center gap-2">
									<button
										onClick={(e) => {
											e.stopPropagation()
											handleToggleStar(selectedMessage.id)
										}}
										className={`p-2 rounded-lg transition-colors ${
											selectedMessage.isStarred
												? 'text-yellow-500 hover:text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
												: 'text-neutral-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
										}`}
									>
										<Star className={`h-5 w-5 ${selectedMessage.isStarred ? 'fill-current' : ''}`} />
									</button>
									<button
										onClick={(e) => {
											e.stopPropagation()
											handleArchive(selectedMessage.id)
											handleCloseMessage()
										}}
										className="p-2 rounded-lg text-neutral-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
									>
										<Archive className="h-5 w-5" />
									</button>
									<button
										onClick={(e) => {
											e.stopPropagation()
											handleDeleteMessage(selectedMessage.id)
											handleCloseMessage()
										}}
										className="p-2 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
									>
										<Trash2 className="h-5 w-5" />
									</button>
								</div>
								<div className="flex items-center gap-2">
									<Button variant="outline" onClick={handleCloseMessage}>
										Close
									</Button>
									<Button onClick={handleGoToWorkInput} className="flex items-center gap-2">
										<FileText className="h-4 w-4" />
										Go to Work Input
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
