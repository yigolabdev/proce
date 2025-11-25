import { storage } from '../../utils/storage'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { PageHeader } from '../../components/common/PageHeader'
import DevMemo from '../../components/dev/DevMemo'
import { DEV_MEMOS } from '../../constants/devMemos'
import { EmptyState } from '../../components/common/EmptyState'
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
	XCircle,
	RefreshCw,
	Brain,
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
	deadline?: string
	dataSource: string // 추천 근거가 되는 데이터 출처
	status: 'pending' | 'accepted' | 'rejected'
}

interface RecommendationInsight {
	type: 'gap' | 'inactive' | 'deadline' | 'info'
	metric: string
	value: string
	status: 'warning' | 'info' | 'urgent'
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
			const projectsData = storage.get<any>('projects')
			const workEntriesData = storage.get<any>('workEntries')
			const objectivesData = storage.get<any>('objectives')
			
			const projects = projectsData ? JSON.parse(projectsData) : []
			const workEntries = workEntriesData ? JSON.parse(workEntriesData).map((e: any) => ({
				...e,
				date: new Date(e.date)
			})) : []
			const objectives = objectivesData ? JSON.parse(objectivesData) : []
			
			// Analyze and generate recommendations
			const generatedRecommendations: TaskRecommendation[] = []
			const generatedInsights: RecommendationInsight[] = []
			
			// 1. OKR Progress Gap Analysis
			objectives.forEach((objective: any) => {
				const avgProgress = objective.keyResults?.reduce((sum: number, kr: any) => 
					sum + ((kr.current / kr.target) * 100), 0) / (objective.keyResults?.length || 1)
				
				if (avgProgress < 50) {
					generatedRecommendations.push({
						id: `okr-${objective.id}`,
						title: `Update OKR: ${objective.title}`,
						description: `Current progress: ${Math.round(avgProgress)}%. Update key results to improve overall goal achievement.`,
						priority: avgProgress < 30 ? 'high' : 'medium',
						category: 'OKR Update',
						deadline: objective.endDate,
						dataSource: `OKR Data (${objective.keyResults?.length || 0} Key Results)`,
						status: 'pending',
					})
					
					generatedInsights.push({
						type: 'gap',
						metric: objective.title,
						value: `${Math.round(avgProgress)}% complete`,
						status: avgProgress < 30 ? 'urgent' : 'warning',
					})
				}
			})
			
			// 2. Inactive Projects Detection
			const sevenDaysAgo = new Date()
			sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
			
			let inactiveProjectCount = 0
			projects
				.filter((p: any) => p.status === 'active')
				.forEach((project: any) => {
					const recentWork = workEntries.filter((e: any) => 
						e.projectId === project.id && new Date(e.date) >= sevenDaysAgo
					)
					
					if (recentWork.length === 0) {
						inactiveProjectCount++
						generatedRecommendations.push({
							id: `project-${project.id}`,
							title: `Update Project: ${project.name}`,
							description: `No activity in 7 days. Consider logging progress or updating status.`,
							priority: 'medium',
							category: 'Project Update',
							dataSource: `Project Status (Last activity: 7+ days ago)`,
							status: 'pending',
						})
					}
				})
			
			if (inactiveProjectCount > 0) {
				generatedInsights.push({
					type: 'inactive',
					metric: 'Projects',
					value: `${inactiveProjectCount} inactive ${inactiveProjectCount === 1 ? 'project' : 'projects'}`,
					status: 'warning',
				})
			}
			
			// 3. Upcoming Deadlines Analysis
			const now = new Date()
			const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)
			
			const upcomingDeadlines = objectives.filter((obj: any) => {
				const endDate = new Date(obj.endDate)
				return endDate >= now && endDate <= twoDaysFromNow
			})
			
			if (upcomingDeadlines.length > 0) {
				upcomingDeadlines.forEach((obj: any) => {
					generatedRecommendations.push({
						id: `deadline-${obj.id}`,
						title: `Deadline Alert: ${obj.title}`,
						description: `OKR deadline: ${new Date(obj.endDate).toLocaleDateString()}. Finalize key results.`,
						priority: 'high',
						category: 'Deadline',
						deadline: obj.endDate,
						dataSource: `OKR Deadline Tracking`,
						status: 'pending',
					})
				})
				
				generatedInsights.push({
					type: 'deadline',
					metric: 'Deadlines',
					value: `${upcomingDeadlines.length} in next 48 hours`,
					status: 'urgent',
				})
			}
			
			// 4. Data Summary Insight
			generatedInsights.unshift({
				type: 'info',
				metric: 'Data Sources',
				value: `${projects.length} projects, ${objectives.length} OKRs, ${workEntries.length} work entries`,
				status: 'info',
			})

			setRecommendations(generatedRecommendations)
			setInsights(generatedInsights)
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
			priority: task.priority,
			deadline: task.deadline,
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
		<>
			<DevMemo content={DEV_MEMOS.INBOX} pagePath="/app/inbox/page.tsx" />
			<div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
				<Toaster />
				
				{/* Header */}
			<PageHeader
				title="Notifications & AI Assistant"
				description="Stay updated with messages, tasks, and AI-powered recommendations"
				icon={Inbox}
				actions={
					<>
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
							>
								<RefreshCw className={`h-4 w-4 sm:mr-2 ${isLoading ? 'animate-spin' : ''}`} />
								<span className="hidden sm:inline">Refresh</span>
							</Button>
						)}
					</>
				}
				tabs={{
					items: [
						{ id: 'messages', label: `Messages (${messages.length})`, icon: Mail },
						{ id: 'recommendations', label: `AI Recommendations (${pendingRecommendations.length})`, icon: Sparkles },
					],
					activeTab,
					onTabChange: (id) => setActiveTab(id as 'messages' | 'recommendations'),
				}}
			/>
			
			<div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">

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
							<EmptyState
								icon={<Inbox className="h-12 w-12" />}
								title={
									filter === 'unread' ? 'No Unread Messages' : 
									filter === 'starred' ? 'No Starred Messages' : 
									'No Messages'
								}
								description={
									filter === 'all' ? "You're all caught up! Messages will appear here when they arrive." :
									filter === 'unread' ? 'All messages have been read.' :
									'Star important messages to find them here later.'
								}
							/>
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
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Card>
						<CardContent className="p-4">
							<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Pending Tasks</div>
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
						{insights.map((insight, index) => {
							const getStatusColor = (status: string) => {
								switch (status) {
									case 'urgent':
										return 'border-l-red-500 bg-red-50/50 dark:bg-red-900/10'
									case 'warning':
										return 'border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10'
									default:
										return 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10'
								}
							}
							
							const getIcon = (type: string) => {
								switch (type) {
									case 'gap':
										return <TrendingUp className="h-4 w-4 text-orange-600" />
									case 'inactive':
										return <Clock className="h-4 w-4 text-yellow-600" />
									case 'deadline':
										return <Calendar className="h-4 w-4 text-red-600" />
									default:
										return <Brain className="h-4 w-4 text-blue-600" />
								}
							}
							
							return (
								<Card key={index} className={`border-l-4 ${getStatusColor(insight.status)}`}>
									<CardContent className="p-4">
										<div className="flex items-start gap-3">
											<div className="flex-shrink-0 mt-0.5">{getIcon(insight.type)}</div>
											<div className="flex-1 min-w-0">
												<h3 className="font-bold text-sm mb-1">{insight.metric}</h3>
												<p className="text-xs text-neutral-600 dark:text-neutral-400">
													{insight.value}
												</p>
											</div>
										</div>
									</CardContent>
								</Card>
							)
						})}
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
											{task.deadline && (
												<div className="flex items-center gap-2 text-sm">
													<Calendar className="h-4 w-4 text-neutral-500" />
													<span className="text-neutral-600 dark:text-neutral-400">
														Deadline: {new Date(task.deadline).toLocaleDateString()}
													</span>
												</div>
											)}

											{/* Data Source */}
											<div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
												<div className="flex items-start gap-2">
													<Brain className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
													<div className="flex-1 min-w-0">
														<p className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-1">
															Data Source
														</p>
														<p className="text-xs text-blue-700 dark:text-blue-300">
															{task.dataSource}
														</p>
													</div>
												</div>
											</div>

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
			</div>
			</div>
		</>
	)
}
