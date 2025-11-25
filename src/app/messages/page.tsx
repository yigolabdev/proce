import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { PageHeader } from '../../components/common/PageHeader'
import { EmptyState } from '../../components/common/EmptyState'
import { storage } from '../../utils/storage'
import {
	Mail,
	MailOpen,
	Trash2,
	Archive,
	Star,
	Clock,
	CheckCircle2,
	X,
	Sparkles,
	AlertCircle,
	Users,
	FolderKanban,
	MessageSquare,
	Zap,
	TrendingUp,
	RefreshCw,
} from 'lucide-react'
import { toast } from 'sonner'
import Toaster from '../../components/ui/Toaster'

// Message Interface
interface Message {
	id: string
	from: string
	fromDepartment?: string
	subject: string
	preview: string
	content: string
	timestamp: Date
	isRead: boolean
	isStarred: boolean
	type: 'task_assigned' | 'review_received' | 'project_update' | 'team_message' | 'approval_request'
	priority: 'urgent' | 'high' | 'normal' | 'low'
	// Additional data
	relatedId?: string // task ID, project ID, etc.
	relatedPage?: string // where to navigate
	quickActions?: Array<{
		label: string
		action: string
		variant?: 'primary' | 'outline' | 'secondary'
	}>
	aiInsight?: {
		summary: string
		estimatedTime?: string
		deadline?: string
		recommendation?: string
	}
}

export default function MessagesPage() {
	const navigate = useNavigate()
	
	// Messages state
	const [messages, setMessages] = useState<Message[]>([])
	const [filter, setFilter] = useState<'all' | 'unread' | 'starred'>('all')
	const [typeFilter, setTypeFilter] = useState<string>('all')
	const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

	useEffect(() => {
		loadMessages()
	}, [])

	// Load Messages
	const loadMessages = () => {
		// Load from localStorage (can be populated from other pages)
		const savedMessages = storage.get<any[]>('messages')
		
		if (savedMessages && savedMessages.length > 0) {
			const messagesWithDates = savedMessages.map((msg: any) => ({
				...msg,
				timestamp: new Date(msg.timestamp),
			}))
			setMessages(messagesWithDates)
		} else {
			// Mock messages for demonstration
			const mockMessages: Message[] = [
				// Urgent Task
				{
					id: '1',
					from: 'Sarah Chen',
					fromDepartment: 'Engineering',
					subject: 'Urgent: Fix Payment Gateway Bug',
					preview: 'High priority task assigned - Payment failures reported by customers',
					content: 'Hi,\n\nWe\'re experiencing payment failures for international cards. This is blocking customer purchases and needs immediate attention.\n\nDetails:\n• Issue: International card payments failing\n• Impact: ~50 customers affected\n• Priority: Urgent\n• Deadline: Today EOD\n\nPlease investigate and fix ASAP. Let me know if you need any help.',
					timestamp: new Date(Date.now() - 1000 * 60 * 30),
					isRead: false,
					isStarred: true,
					type: 'task_assigned',
					priority: 'urgent',
					relatedId: 'task-001',
					relatedPage: '/app/ai-recommendations',
					quickActions: [
						{ label: 'Accept Task', action: 'accept', variant: 'primary' },
						{ label: 'View Details', action: 'view', variant: 'outline' },
						{ label: 'Ask Question', action: 'reply', variant: 'secondary' },
					],
					aiInsight: {
						summary: 'Urgent bug fix required for payment gateway affecting international customers',
						estimatedTime: '3-4 hours',
						deadline: 'Today EOD',
						recommendation: '우선 처리 추천: 고객 영향도가 높고 마감 시간이 촉박합니다',
					},
				},
				// Work Review - Approved
				{
					id: '2',
					from: 'Mike Johnson (Tech Lead)',
					fromDepartment: 'Engineering',
					subject: '✅ Work Approved: User Authentication System',
					preview: 'Your work has been approved! Excellent implementation.',
					content: 'Great work! 🎉\n\nYour authentication implementation is excellent:\n\n✅ Clean, well-structured code\n✅ Comprehensive test coverage (95%)\n✅ Proper security measures\n✅ Clear documentation\n✅ Follows best practices\n\nThe PR has been merged to main. Keep up the great work!',
					timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
					isRead: false,
					isStarred: false,
					type: 'review_received',
					priority: 'normal',
					relatedPage: '/app/work-review',
					quickActions: [
						{ label: 'View Review', action: 'view', variant: 'outline' },
						{ label: 'Say Thanks', action: 'reply', variant: 'secondary' },
					],
					aiInsight: {
						summary: 'Work approved with positive feedback. High quality implementation recognized.',
						recommendation: '축하합니다! 팀 리더가 당신의 작업을 높이 평가했습니다',
					},
				},
				// Work Review - Changes Requested
				{
					id: '3',
					from: 'Emily Davis (Design Lead)',
					fromDepartment: 'Design',
					subject: '⚠️ Changes Requested: Dashboard UI Redesign',
					preview: 'Please make a few adjustments before final approval',
					content: 'Good progress on the dashboard redesign!\n\nHowever, a few changes are needed:\n\n1. **Color Contrast**: Dark mode needs better accessibility (WCAG AA)\n2. **Mobile Responsive**: Issues on tablets (768-1024px)\n3. **Loading States**: Add skeleton screens for async data\n4. **Hover Effects**: Interactive elements need visual feedback\n\nPlease update and resubmit. Let me know if you need design resources.',
					timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
					isRead: true,
					isStarred: true,
					type: 'review_received',
					priority: 'high',
					relatedPage: '/app/work-review',
					quickActions: [
						{ label: 'View Details', action: 'view', variant: 'outline' },
						{ label: 'Update Work', action: 'update', variant: 'primary' },
					],
					aiInsight: {
						summary: '4가지 수정 사항이 요청되었습니다: 색상 대비, 반응형, 로딩 상태, 호버 효과',
						estimatedTime: '2-3 hours',
						recommendation: '수정 후 재제출이 필요합니다',
					},
				},
				// New Task Assignment
				{
					id: '4',
					from: 'Alex Kim',
					fromDepartment: 'Engineering',
					subject: 'New Task: API Documentation Update',
					preview: 'Update REST API documentation for v2.0 endpoints',
					content: 'Hi,\n\nCan you update our API documentation for the new v2.0 endpoints?\n\nScope:\n• Add examples for new authentication endpoints\n• Update error response codes\n• Add rate limiting information\n• Include SDK usage examples\n\nDeadline: End of this week\nPriority: Medium\n\nLet me know if you have questions!',
					timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
					isRead: true,
					isStarred: false,
					type: 'task_assigned',
					priority: 'normal',
					relatedId: 'task-002',
					relatedPage: '/app/ai-recommendations',
					quickActions: [
						{ label: 'Accept', action: 'accept', variant: 'primary' },
						{ label: 'View Task', action: 'view', variant: 'outline' },
					],
					aiInsight: {
						summary: 'API 문서 업데이트 작업 - 새로운 v2.0 엔드포인트 문서화',
						estimatedTime: '4-5 hours',
						deadline: 'End of week',
						recommendation: '이번 주 내 완료 가능한 작업량입니다',
					},
				},
				// Project Update
				{
					id: '5',
					from: 'Project System',
					fromDepartment: 'System',
					subject: '🎉 Project Milestone: Mobile App 50% Complete',
					preview: 'Mobile App Development project reached 50% completion',
					content: 'Great progress on the Mobile App Development project!\n\n📊 Current Status: 50% Complete\n\n✅ Completed:\n• User Authentication\n• Dashboard UI\n• Basic Navigation\n\n🔄 In Progress:\n• Payment Integration (70%)\n• Push Notifications (40%)\n\n⏳ Upcoming:\n• Offline Mode\n• Performance Optimization\n\nKeep up the momentum! 🚀',
					timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
					isRead: true,
					isStarred: false,
					type: 'project_update',
					priority: 'normal',
					relatedPage: '/app/projects',
					quickActions: [
						{ label: 'View Project', action: 'view', variant: 'outline' },
					],
					aiInsight: {
						summary: 'Mobile App 프로젝트가 절반 완료되었습니다. 순조롭게 진행 중',
					},
				},
				// Team Message
				{
					id: '6',
					from: 'Lisa Park',
					fromDepartment: 'Marketing',
					subject: 'Q4 Marketing Campaign - Need Engineering Support',
					preview: 'Requesting technical support for landing page optimization',
					content: 'Hi Team,\n\nFor our Q4 marketing campaign, we need some engineering support:\n\n1. Landing page optimization (loading speed)\n2. Analytics integration (conversion tracking)\n3. A/B testing setup\n\nTimeline: Next 2 weeks\nPriority: Medium\n\nWho can help with this? Please let me know your availability.\n\nThanks!',
					timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
					isRead: true,
					isStarred: false,
					type: 'team_message',
					priority: 'normal',
					quickActions: [
						{ label: 'Reply', action: 'reply', variant: 'outline' },
						{ label: 'Volunteer', action: 'accept', variant: 'secondary' },
					],
					aiInsight: {
						summary: 'Marketing 팀이 기술 지원 요청 - 랜딩 페이지 최적화 및 분석',
						estimatedTime: '6-8 hours total',
					},
				},
				// Approval Request
				{
					id: '7',
					from: 'Chris Brown',
					fromDepartment: 'Engineering',
					subject: 'Approval Request: 3-Day Leave (Nov 10-12)',
					preview: 'Requesting annual leave approval for personal matters',
					content: 'Hi,\n\nI would like to request annual leave for 3 days:\n\nDates: Nov 10-12 (Mon-Wed)\nReason: Personal matters\nRemaining Leave: 8 days\n\nWork Status:\n• All urgent tasks completed\n• Ongoing projects documented\n• Handover to Mike Johnson\n\nPlease let me know if this works. Thanks!',
					timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
					isRead: true,
					isStarred: false,
					type: 'approval_request',
					priority: 'normal',
					quickActions: [
						{ label: 'Approve', action: 'approve', variant: 'primary' },
						{ label: 'Decline', action: 'decline', variant: 'outline' },
						{ label: 'Request Info', action: 'reply', variant: 'secondary' },
					],
					aiInsight: {
						summary: '3일 휴가 신청 - 남은 휴가 8일, 업무 인수인계 완료',
						recommendation: '팀 업무량 정상, 승인 가능',
					},
				},
			]
			setMessages(mockMessages)
		}
	}

	// Message handlers
	const handleMarkAsRead = (id: string) => {
		setMessages((prev) => {
			const updated = prev.map((msg) => (msg.id === id ? { ...msg, isRead: true } : msg))
			storage.set('messages', updated)
			return updated
		})
	}

	const handleToggleStar = (id: string) => {
		setMessages((prev) => {
			const updated = prev.map((msg) => (msg.id === id ? { ...msg, isStarred: !msg.isStarred } : msg))
			storage.set('messages', updated)
			return updated
		})
	}

	const handleDeleteMessage = (id: string) => {
		setMessages((prev) => {
			const updated = prev.filter((msg) => msg.id !== id)
			storage.set('messages', updated)
			return updated
		})
		toast.success('Message deleted')
		if (selectedMessage?.id === id) {
			setSelectedMessage(null)
		}
	}

	const handleArchive = (id: string) => {
		setMessages((prev) => {
			const updated = prev.filter((msg) => msg.id !== id)
			storage.set('messages', updated)
			return updated
		})
		toast.success('Message archived')
		if (selectedMessage?.id === id) {
			setSelectedMessage(null)
		}
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

	const handleQuickAction = (action: string) => {
		if (!selectedMessage) return

		switch (action) {
			case 'accept':
				toast.success('Task accepted!')
				if (selectedMessage.relatedPage) {
					navigate(selectedMessage.relatedPage)
				}
				break
			case 'view':
				if (selectedMessage.relatedPage) {
					navigate(selectedMessage.relatedPage)
				}
				break
			case 'update':
				navigate('/app/input')
				toast.info('Redirecting to update work...')
				break
			case 'reply':
				toast.info('Reply feature coming soon!')
				break
			case 'approve':
				toast.success('Approved!')
				handleArchive(selectedMessage.id)
				break
			case 'decline':
				toast.info('Declined')
				handleArchive(selectedMessage.id)
				break
			default:
				break
		}
	}

	// Utility functions
	const getTypeIcon = (type: Message['type']) => {
		switch (type) {
			case 'task_assigned':
				return <CheckCircle2 className="h-4 w-4 text-blue-500" />
			case 'review_received':
				return <MessageSquare className="h-4 w-4 text-purple-500" />
			case 'project_update':
				return <FolderKanban className="h-4 w-4 text-green-500" />
			case 'team_message':
				return <Users className="h-4 w-4 text-orange-500" />
			case 'approval_request':
				return <Clock className="h-4 w-4 text-amber-500" />
		}
	}

	const getTypeLabel = (type: Message['type']) => {
		switch (type) {
			case 'task_assigned':
				return 'Task'
			case 'review_received':
				return 'Review'
			case 'project_update':
				return 'Project'
			case 'team_message':
				return 'Team'
			case 'approval_request':
				return 'Approval'
		}
	}

	const getPriorityBadge = (priority: Message['priority']) => {
		switch (priority) {
			case 'urgent':
				return { label: '🔴 URGENT', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' }
			case 'high':
				return { label: 'HIGH', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' }
			case 'normal':
				return { label: 'NORMAL', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' }
			case 'low':
				return { label: 'LOW', color: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400' }
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

	// Filtered messages
	const filteredMessages = messages.filter((msg) => {
		// Filter by read/starred
		if (filter === 'unread' && msg.isRead) return false
		if (filter === 'starred' && !msg.isStarred) return false
		
		// Filter by type
		if (typeFilter !== 'all' && msg.type !== typeFilter) return false
		
		return true
	})

	// Statistics
	const stats = {
		unread: messages.filter((m) => !m.isRead).length,
		urgent: messages.filter((m) => m.priority === 'urgent' && !m.isRead).length,
		tasks: messages.filter((m) => m.type === 'task_assigned').length,
		reviews: messages.filter((m) => m.type === 'review_received').length,
	}

	return (
		<div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
			<Toaster />
			
			{/* Header */}
			<PageHeader
				title="Messages"
				description="모든 업무 알림과 커뮤니케이션을 한곳에서 관리하세요"
				icon={Mail}
				actions={
					<Button variant="outline" size="sm" onClick={loadMessages} className="flex items-center gap-2">
						<RefreshCw className="h-4 w-4" />
						<span className="hidden sm:inline">Refresh</span>
					</Button>
				}
			/>
			
			<div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
				{/* Quick Stats */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<Card className="bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<Mail className="h-6 w-6 text-purple-600 dark:text-purple-400" />
								<div>
									<p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Unread</p>
									<p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.unread}</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-linear-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<Zap className="h-6 w-6 text-red-600 dark:text-red-400" />
								<div>
									<p className="text-sm text-red-600 dark:text-red-400 font-medium">Urgent</p>
									<p className="text-2xl font-bold text-red-900 dark:text-red-100">{stats.urgent}</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<CheckCircle2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
								<div>
									<p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Tasks</p>
									<p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.tasks}</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-linear-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<MessageSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
								<div>
									<p className="text-sm text-green-600 dark:text-green-400 font-medium">Reviews</p>
									<p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.reviews}</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Filters */}
				<Card>
					<CardContent className="p-4">
						<div className="flex flex-col sm:flex-row gap-4">
							{/* Status Filter */}
							<div className="flex items-center gap-2 flex-wrap">
								<span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Status:</span>
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
									Unread ({stats.unread})
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

							{/* Type Filter */}
							<div className="flex items-center gap-2 flex-wrap">
								<span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Type:</span>
								<select
									value={typeFilter}
									onChange={(e) => setTypeFilter(e.target.value)}
									className="px-3 py-1.5 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary"
								>
									<option value="all">All Types</option>
									<option value="task_assigned">Tasks</option>
									<option value="review_received">Reviews</option>
									<option value="project_update">Projects</option>
									<option value="team_message">Team</option>
									<option value="approval_request">Approvals</option>
								</select>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Messages List */}
				<div className="space-y-3">
					{filteredMessages.length === 0 ? (
						<EmptyState
							icon={<Mail className="h-12 w-12" />}
							title={
								filter === 'unread' ? 'No Unread Messages' : 
								filter === 'starred' ? 'No Starred Messages' : 
								'No Messages'
							}
							description={
								filter === 'all' ? "모든 메시지를 확인했습니다! 새로운 알림이 오면 여기에 표시됩니다." :
								filter === 'unread' ? '모든 메시지를 읽었습니다. 잘하셨어요! 👏' :
								'중요한 메시지에 별표를 표시하여 나중에 쉽게 찾을 수 있습니다.'
							}
						/>
					) : (
						filteredMessages.map((message) => {
							const priorityBadge = getPriorityBadge(message.priority)
							
							return (
								<Card
									key={message.id}
									className={`transition-all hover:shadow-lg cursor-pointer ${
										!message.isRead ? 'border-l-4 border-l-primary bg-blue-50/30 dark:bg-blue-900/10' : ''
									} ${
										message.priority === 'urgent' ? 'ring-2 ring-red-200 dark:ring-red-800' : ''
									}`}
									onClick={() => handleOpenMessage(message)}
								>
									<CardContent className="p-4">
										<div className="flex items-start gap-4">
											<div className="shrink-0 mt-1">{getTypeIcon(message.type)}</div>
											<div className="flex-1 min-w-0">
												<div className="flex items-start justify-between gap-4 mb-2">
													<div className="flex-1 min-w-0">
														<div className="flex items-center gap-2 mb-2 flex-wrap">
															{message.priority === 'urgent' && (
																<span className={`text-xs font-bold px-2 py-1 rounded ${priorityBadge.color} animate-pulse`}>
																	{priorityBadge.label}
																</span>
															)}
															<span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
																{getTypeLabel(message.type)}
															</span>
															<span className={`text-sm ${!message.isRead ? 'font-bold' : 'font-medium'}`}>
																{message.from}
															</span>
															{message.fromDepartment && (
																<span className="text-xs text-neutral-500 dark:text-neutral-400">
																	• {message.fromDepartment}
																</span>
															)}
														</div>
														<h3
															className={`text-base mb-1 ${
																!message.isRead ? 'font-bold text-neutral-900 dark:text-neutral-100' : 'font-medium'
															}`}
														>
															{message.subject}
														</h3>
														<p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
															{message.preview}
														</p>
														
														{/* AI Insight Preview */}
														{message.aiInsight && !message.isRead && (
															<div className="mt-2 flex items-center gap-2 text-xs text-primary">
																<Sparkles className="h-3 w-3" />
																<span>{message.aiInsight.summary}</span>
															</div>
														)}
													</div>
													<div className="flex flex-col items-end gap-2 shrink-0">
														<span className="text-xs text-neutral-500 dark:text-neutral-400">
															{formatTimestamp(message.timestamp)}
														</span>
														{message.aiInsight?.deadline && !message.isRead && (
															<span className="text-xs px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded">
																⏰ {message.aiInsight.deadline}
															</span>
														)}
													</div>
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
							)
						})
					)}
				</div>

				{/* Message Detail Modal */}
				{selectedMessage && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
						<div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
							{/* Header */}
							<div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
								<div className="flex items-start justify-between gap-4">
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-2 flex-wrap">
											{getTypeIcon(selectedMessage.type)}
											<span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
												{getTypeLabel(selectedMessage.type)}
											</span>
											{selectedMessage.priority !== 'normal' && (
												<span className={`text-xs font-bold px-2 py-1 rounded ${getPriorityBadge(selectedMessage.priority).color}`}>
													{getPriorityBadge(selectedMessage.priority).label}
												</span>
											)}
										</div>
										<h2 className="text-2xl font-bold mb-2">{selectedMessage.subject}</h2>
										<div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
											<span className="font-medium">{selectedMessage.from}</span>
											{selectedMessage.fromDepartment && (
												<>
													<span>•</span>
													<span>{selectedMessage.fromDepartment}</span>
												</>
											)}
											<span>•</span>
											<span>{formatTimestamp(selectedMessage.timestamp)}</span>
										</div>
									</div>
									<button
										onClick={handleCloseMessage}
										className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 shrink-0"
									>
										<X className="h-6 w-6" />
									</button>
								</div>
							</div>

							{/* Content */}
							<div className="flex-1 overflow-y-auto p-6 space-y-6">
								{/* AI Insight */}
								{selectedMessage.aiInsight && (
									<div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl">
										<div className="flex items-start gap-3">
											<Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
											<div className="flex-1 space-y-2">
												<h3 className="font-bold text-blue-900 dark:text-blue-100">
													AI 분석 및 추천
												</h3>
												<p className="text-sm text-blue-700 dark:text-blue-300">
													{selectedMessage.aiInsight.summary}
												</p>
												<div className="grid grid-cols-2 gap-2 mt-3">
													{selectedMessage.aiInsight.estimatedTime && (
														<div className="flex items-center gap-2 text-xs">
															<Clock className="h-3 w-3 text-blue-600 dark:text-blue-400" />
															<span className="text-blue-700 dark:text-blue-300">
																예상 시간: {selectedMessage.aiInsight.estimatedTime}
															</span>
														</div>
													)}
													{selectedMessage.aiInsight.deadline && (
														<div className="flex items-center gap-2 text-xs">
															<AlertCircle className="h-3 w-3 text-blue-600 dark:text-blue-400" />
															<span className="text-blue-700 dark:text-blue-300">
																마감: {selectedMessage.aiInsight.deadline}
															</span>
														</div>
													)}
												</div>
												{selectedMessage.aiInsight.recommendation && (
													<div className="mt-3 p-3 bg-white/50 dark:bg-neutral-900/50 rounded-lg">
														<div className="flex items-start gap-2">
															<TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
															<p className="text-xs text-blue-800 dark:text-blue-200">
																💡 {selectedMessage.aiInsight.recommendation}
															</p>
														</div>
													</div>
												)}
											</div>
										</div>
									</div>
								)}

								{/* Original Content */}
								<div>
									<h3 className="font-bold mb-3 flex items-center gap-2">
										<Mail className="h-5 w-5 text-primary" />
										메시지 내용
									</h3>
									<div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 whitespace-pre-wrap text-sm">
										{selectedMessage.content}
									</div>
								</div>
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
											}}
											className="p-2 rounded-lg text-neutral-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
										>
											<Archive className="h-5 w-5" />
										</button>
										<button
											onClick={(e) => {
												e.stopPropagation()
												handleDeleteMessage(selectedMessage.id)
											}}
											className="p-2 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
										>
											<Trash2 className="h-5 w-5" />
										</button>
									</div>
									<div className="flex items-center gap-2 flex-wrap">
										<Button variant="outline" onClick={handleCloseMessage}>
											Close
										</Button>
										{selectedMessage.quickActions?.map((qa, idx) => (
											<Button
												key={idx}
												variant={qa.variant || 'outline'}
												onClick={() => handleQuickAction(qa.action)}
											>
												{qa.label}
											</Button>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
