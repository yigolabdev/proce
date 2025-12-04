import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { PageHeader } from '../../components/common/PageHeader'
import { EmptyState } from '../../components/common/EmptyState'
import { storage } from '../../utils/storage'
import { useI18n } from '../../i18n/I18nProvider'
import {
	Mail,
	MailOpen,
	Trash2,
	Archive,
	ArchiveRestore,
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
	isArchived?: boolean
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
	const { t } = useI18n()
	
	// Messages state
	const [messages, setMessages] = useState<Message[]>([])
	const [filter, setFilter] = useState<'all' | 'unread' | 'starred' | 'archived'>('all')
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
				isArchived: msg.isArchived || false, // Ensure isArchived is initialized
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
					isArchived: false,
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
						recommendation: 'Recommended for priority: High customer impact and tight deadline',
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
					isArchived: false,
					type: 'review_received',
					priority: 'normal',
					relatedPage: '/app/work-review',
					quickActions: [
						{ label: 'View Review', action: 'view', variant: 'outline' },
						{ label: 'Say Thanks', action: 'reply', variant: 'secondary' },
					],
					aiInsight: {
						summary: 'Work approved with positive feedback. High quality implementation recognized.',
						recommendation: 'Congratulations! Your team lead highly appreciated your work',
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
					isArchived: false,
					type: 'review_received',
					priority: 'high',
					relatedPage: '/app/work-review',
					quickActions: [
						{ label: 'View Details', action: 'view', variant: 'outline' },
						{ label: 'Update Work', action: 'update', variant: 'primary' },
					],
					aiInsight: {
						summary: '4 changes requested: Color contrast, Responsive, Loading states, Hover effects',
						estimatedTime: '2-3 hours',
						recommendation: 'Resubmission required after changes',
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
					isArchived: false,
					type: 'task_assigned',
					priority: 'normal',
					relatedId: 'task-002',
					relatedPage: '/app/ai-recommendations',
					quickActions: [
						{ label: 'Accept', action: 'accept', variant: 'primary' },
						{ label: 'View Task', action: 'view', variant: 'outline' },
					],
					aiInsight: {
						summary: 'API Documentation Update - New v2.0 endpoints documentation',
						estimatedTime: '4-5 hours',
						deadline: 'End of week',
						recommendation: 'Feasible to complete within this week',
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
					isArchived: false,
					type: 'project_update',
					priority: 'normal',
					relatedPage: '/app/projects',
					quickActions: [
						{ label: 'View Project', action: 'view', variant: 'outline' },
					],
					aiInsight: {
						summary: 'Mobile App project 50% complete. Progressing smoothly.',
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
					isArchived: false,
					type: 'team_message',
					priority: 'normal',
					quickActions: [
						{ label: 'Reply', action: 'reply', variant: 'outline' },
						{ label: 'Volunteer', action: 'accept', variant: 'secondary' },
					],
					aiInsight: {
						summary: 'Marketing team requests tech support - Landing page optimization & analytics',
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
					isArchived: false,
					type: 'approval_request',
					priority: 'normal',
					quickActions: [
						{ label: 'Approve', action: 'approve', variant: 'primary' },
						{ label: 'Decline', action: 'decline', variant: 'outline' },
						{ label: 'Request Info', action: 'reply', variant: 'secondary' },
					],
					aiInsight: {
						summary: '3-day leave request - 8 days remaining, work handover complete',
						recommendation: 'Team workload normal, approval recommended',
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
		toast.success(t('messages.messageDeleted'))
		if (selectedMessage?.id === id) {
			setSelectedMessage(null)
		}
	}

	const handleArchive = (id: string) => {
		setMessages((prev) => {
			const updated = prev.map((msg) => (msg.id === id ? { ...msg, isArchived: !msg.isArchived } : msg))
			storage.set('messages', updated)
			return updated
		})
		// Check the new state to determine message
		const msg = messages.find(m => m.id === id)
		const isNowArchived = !msg?.isArchived // Predict new state
		toast.success(isNowArchived ? t('messages.messageArchived') : t('messages.messageRestored'))
		
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

	const getQuickActionLabel = (action: string) => {
		switch (action) {
			case 'accept': return t('messages.acceptTask')
			case 'view': return t('messages.viewDetails')
			case 'reply': return t('messages.askQuestion')
			case 'update': return t('messages.updateWork')
			case 'approve': return t('messages.approve')
			case 'decline': return t('messages.decline')
			default: return action
		}
	}

	const handleQuickAction = (action: string) => {
		if (!selectedMessage) return

		switch (action) {
			case 'accept':
				toast.success(t('messages.taskAccepted'))
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
				toast.info(t('messages.redirectingToUpdateWork'))
				break
			case 'reply':
				toast.info(t('messages.replyFeatureComingSoon'))
				break
			case 'approve':
				toast.success(t('messages.approved'))
				handleArchive(selectedMessage.id)
				break
			case 'decline':
				toast.info(t('messages.declined'))
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
				return <CheckCircle2 className="h-4 w-4 text-neutral-400" />
			case 'review_received':
				return <MessageSquare className="h-4 w-4 text-neutral-400" />
			case 'project_update':
				return <FolderKanban className="h-4 w-4 text-neutral-400" />
			case 'team_message':
				return <Users className="h-4 w-4 text-neutral-400" />
			case 'approval_request':
				return <Clock className="h-4 w-4 text-neutral-400" />
		}
	}

	const getTypeLabel = (type: Message['type']) => {
		switch (type) {
			case 'task_assigned':
				return t('messages.taskAssigned')
			case 'review_received':
				return t('messages.reviewReceived')
			case 'project_update':
				return t('messages.projectUpdate')
			case 'team_message':
				return t('messages.teamMessage')
			case 'approval_request':
				return t('messages.approvalRequest')
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
		// Special case for archived view
		if (filter === 'archived') {
			return msg.isArchived
		}

		// Default behavior: Hide archived messages in inbox/starred/unread
		if (msg.isArchived) return false

		// Filter by read/starred
		if (filter === 'unread' && msg.isRead) return false
		if (filter === 'starred' && !msg.isStarred) return false
		
		// Filter by type
		if (typeFilter !== 'all' && msg.type !== typeFilter) return false
		
		return true
	})

	// Statistics
	const stats = {
		unread: messages.filter((m) => !m.isRead && !m.isArchived).length,
		urgent: messages.filter((m) => m.priority === 'urgent' && !m.isRead && !m.isArchived).length,
		tasks: messages.filter((m) => m.type === 'task_assigned' && !m.isArchived).length,
		reviews: messages.filter((m) => m.type === 'review_received' && !m.isArchived).length,
		archived: messages.filter((m) => m.isArchived).length,
	}

	return (
		<div className="min-h-screen bg-neutral-50 dark:bg-background-dark text-neutral-900 dark:text-neutral-100">
			<Toaster />
			
			<div className="max-w-[1600px] mx-auto px-6 py-6 space-y-8">
			{/* Header */}
			<PageHeader
				title={t('messages.title')}
				description={t('messages.description')}
				actions={
					<Button variant="outline" size="sm" onClick={loadMessages} className="flex items-center gap-2 border-border-dark hover:bg-border-dark text-white">
						<RefreshCw className="h-4 w-4" />
						<span className="hidden sm:inline">{t('messages.refresh')}</span>
					</Button>
				}
			/>
			
				{/* Quick Stats */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<Card className="bg-surface-dark border-border-dark">
						<CardContent className="p-5 flex items-center justify-between">
							<div>
								<p className="text-sm text-neutral-400 font-medium mb-1">{t('messages.unread')}</p>
								<p className="text-2xl font-bold text-white">{stats.unread}</p>
							</div>
							<div className="p-3 rounded-xl bg-neutral-800 text-neutral-400">
								<Mail className="h-5 w-5" />
							</div>
						</CardContent>
					</Card>

					<Card className="bg-surface-dark border-border-dark">
						<CardContent className="p-5 flex items-center justify-between">
							<div>
								<p className="text-sm text-neutral-400 font-medium mb-1">{t('messages.urgent')}</p>
								<p className="text-2xl font-bold text-white">{stats.urgent}</p>
							</div>
							<div className="p-3 rounded-xl bg-neutral-800 text-neutral-400">
								<Zap className="h-5 w-5" />
							</div>
						</CardContent>
					</Card>

					<Card className="bg-surface-dark border-border-dark">
						<CardContent className="p-5 flex items-center justify-between">
							<div>
								<p className="text-sm text-neutral-400 font-medium mb-1">{t('messages.tasks')}</p>
								<p className="text-2xl font-bold text-white">{stats.tasks}</p>
							</div>
							<div className="p-3 rounded-xl bg-neutral-800 text-neutral-400">
								<CheckCircle2 className="h-5 w-5" />
							</div>
						</CardContent>
					</Card>

					<Card className="bg-surface-dark border-border-dark">
						<CardContent className="p-5 flex items-center justify-between">
							<div>
								<p className="text-sm text-neutral-400 font-medium mb-1">{t('messages.reviews')}</p>
								<p className="text-2xl font-bold text-white">{stats.reviews}</p>
							</div>
							<div className="p-3 rounded-xl bg-neutral-800 text-neutral-400">
								<MessageSquare className="h-5 w-5" />
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Filters */}
				<Card className="bg-surface-dark border-border-dark">
					<CardContent className="p-4">
						<div className="flex flex-col sm:flex-row gap-4">
							{/* Status Filter */}
							<div className="flex items-center gap-2 flex-wrap">
								<span className="text-sm font-medium text-neutral-400">{t('messages.status')}</span>
								<button
									onClick={() => setFilter('all')}
									className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
										filter === 'all'
											? 'bg-neutral-800 text-white border border-neutral-700'
											: 'bg-transparent text-neutral-400 hover:text-white hover:bg-neutral-800'
									}`}
								>
									{t('messages.all')} ({messages.filter(m => !m.isArchived).length})
								</button>
								<button
									onClick={() => setFilter('unread')}
									className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
										filter === 'unread'
											? 'bg-neutral-800 text-white border border-neutral-700'
											: 'bg-transparent text-neutral-400 hover:text-white hover:bg-neutral-800'
									}`}
								>
									{t('messages.unread')} ({stats.unread})
								</button>
								<button
									onClick={() => setFilter('starred')}
									className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
										filter === 'starred'
											? 'bg-neutral-800 text-white border border-neutral-700'
											: 'bg-transparent text-neutral-400 hover:text-white hover:bg-neutral-800'
									}`}
								>
									{t('messages.starred')} ({messages.filter((m) => m.isStarred && !m.isArchived).length})
								</button>
								<button
									onClick={() => setFilter('archived')}
									className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
										filter === 'archived'
											? 'bg-neutral-800 text-white border border-neutral-700'
											: 'bg-transparent text-neutral-400 hover:text-white hover:bg-neutral-800'
									}`}
								>
									{t('messages.archived')} ({stats.archived})
								</button>
							</div>

							{/* Type Filter */}
							<div className="flex items-center gap-2 flex-wrap">
								<span className="text-sm font-medium text-neutral-400">{t('messages.type')}</span>
								<select
									value={typeFilter}
									onChange={(e) => setTypeFilter(e.target.value)}
									className="px-3 py-1.5 text-sm border border-border-dark rounded-lg bg-[#1a1a1a] text-white focus:outline-none focus:border-neutral-700"
								>
									<option value="all">{t('messages.all')}</option>
									<option value="task_assigned">{t('messages.tasks')}</option>
									<option value="review_received">{t('messages.reviews')}</option>
									<option value="project_update">{t('common.project')}</option>
									<option value="team_message">Team</option>
									<option value="approval_request">Approval</option>
								</select>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Messages List */}
				<div className="space-y-3">
					{filteredMessages.length === 0 ? (
						<EmptyState
							icon={filter === 'archived' ? <Archive className="h-12 w-12 text-neutral-600" /> : <Mail className="h-12 w-12 text-neutral-600" />}
							title={
								filter === 'unread' ? t('messages.noMessages') : 
								filter === 'starred' ? t('messages.noMessages') : 
								filter === 'archived' ? t('messages.noMessages') :
								t('messages.noMessages')
							}
							description={
								filter === 'all' ? t('messages.allCaughtUp') :
								filter === 'unread' ? t('messages.allCaughtUp') :
								filter === 'archived' ? t('messages.allCaughtUp') :
								t('messages.allCaughtUp')
							}
						/>
					) : (
						filteredMessages.map((message) => {
							return (
								<Card
									key={message.id}
									className={`transition-all hover:border-neutral-700 cursor-pointer bg-surface-dark border-border-dark group ${
										!message.isRead ? 'bg-[#151515]' : ''
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
																<span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-900/30 text-red-400 border border-red-900/30 animate-pulse">
																	URGENT
																</span>
															)}
															<span className="text-xs font-medium text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
																{getTypeLabel(message.type)}
															</span>
															<span className={`text-sm text-neutral-300 ${!message.isRead ? 'font-bold text-white' : ''}`}>
																{message.from}
															</span>
															{message.fromDepartment && (
																<span className="text-xs text-neutral-500">
																	• {message.fromDepartment}
																</span>
															)}
															{!message.isRead && (
																<span className="w-2 h-2 rounded-full bg-orange-500" />
															)}
														</div>
														<h3
															className={`text-base mb-1 ${
																!message.isRead ? 'font-bold text-white' : 'font-medium text-neutral-300'
															}`}
														>
															{message.subject}
														</h3>
														<p className="text-sm text-neutral-400 line-clamp-2">
															{message.preview}
														</p>
														
														{/* AI Insight Preview */}
														{message.aiInsight && !message.isRead && (
															<div className="mt-3 flex items-center gap-2 text-xs p-2 rounded-lg bg-neutral-800 border border-neutral-700 w-fit">
																<Sparkles className="h-3 w-3 text-neutral-400" />
																<span className="text-neutral-300">{message.aiInsight.summary}</span>
															</div>
														)}
													</div>
													<div className="flex flex-col items-end gap-2 shrink-0">
														<span className="text-xs text-neutral-500">
															{formatTimestamp(message.timestamp)}
														</span>
														{message.aiInsight?.deadline && !message.isRead && (
															<span className="text-xs px-2 py-0.5 bg-red-900/30 text-red-400 border border-red-900/30 rounded">
																{t('messages.deadline')} {message.aiInsight.deadline}
															</span>
														)}
													</div>
												</div>
												<div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
													{!message.isRead && (
														<Button
															size="sm"
															variant="outline"
															onClick={(e) => {
																e.stopPropagation()
																handleMarkAsRead(message.id)
															}}
															className="h-7 text-xs border-border-dark hover:bg-border-dark text-neutral-300"
														>
															<MailOpen className="h-3 w-3 mr-1" />
															{t('messages.markRead')}
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
																: 'text-neutral-500 hover:text-yellow-500 hover:bg-border-dark'
														}`}
														title={message.isStarred ? "Unstar" : "Star"}
													>
														<Star className={`h-4 w-4 ${message.isStarred ? 'fill-current' : ''}`} />
													</button>
													<button
														onClick={(e) => {
															e.stopPropagation()
															handleArchive(message.id)
														}}
														className="p-1.5 rounded-lg text-neutral-500 hover:text-blue-400 hover:bg-border-dark transition-colors"
														title={message.isArchived ? t('messages.restore') : t('messages.archived')}
													>
														{message.isArchived ? (
															<ArchiveRestore className="h-4 w-4" />
														) : (
															<Archive className="h-4 w-4" />
														)}
													</button>
													<button
														onClick={(e) => {
															e.stopPropagation()
															handleDeleteMessage(message.id)
														}}
														className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-border-dark transition-colors"
														title={t('messages.delete')}
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
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
						<div className="bg-surface-dark rounded-2xl shadow-2xl border border-border-dark w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
							{/* Header */}
							<div className="p-6 border-b border-border-dark">
								<div className="flex items-start justify-between gap-4">
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-3 flex-wrap">
											{getTypeIcon(selectedMessage.type)}
											<span className="text-xs font-medium text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
												{getTypeLabel(selectedMessage.type)}
											</span>
											{selectedMessage.priority === 'urgent' && (
												<span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-900/30 text-red-400 border border-red-900/30">
													{t('messages.urgent').toUpperCase()}
												</span>
											)}
										</div>
										<h2 className="text-2xl font-bold mb-2 text-white">{selectedMessage.subject}</h2>
										<div className="flex items-center gap-2 text-sm text-neutral-400">
											<span className="font-medium text-neutral-300">{selectedMessage.from}</span>
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
										className="text-neutral-500 hover:text-white shrink-0"
									>
										<X className="h-6 w-6" />
									</button>
								</div>
							</div>

							{/* Content */}
							<div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#0a0a0a]">
								{/* AI Insight */}
								{selectedMessage.aiInsight && (
									<div className="p-5 bg-neutral-800/50 border border-neutral-700 rounded-2xl">
										<div className="flex items-start gap-3">
											<Sparkles className="h-5 w-5 text-neutral-400 shrink-0 mt-0.5" />
											<div className="flex-1 space-y-3">
												<h3 className="font-bold text-neutral-200">
													{t('messages.aiInsight')}
												</h3>
												<p className="text-sm text-neutral-300 leading-relaxed">
													{selectedMessage.aiInsight.summary}
												</p>
												<div className="flex gap-4 pt-1">
													{selectedMessage.aiInsight.estimatedTime && (
														<div className="flex items-center gap-2 text-xs px-2 py-1 bg-surface-dark rounded-md border border-border-dark">
															<Clock className="h-3 w-3 text-neutral-400" />
															<span className="text-neutral-300">
																{t('messages.estTime')}: {selectedMessage.aiInsight.estimatedTime}
															</span>
														</div>
													)}
													{selectedMessage.aiInsight.deadline && (
														<div className="flex items-center gap-2 text-xs px-2 py-1 bg-surface-dark rounded-md border border-border-dark">
															<AlertCircle className="h-3 w-3 text-red-400" />
															<span className="text-neutral-300">
																{t('messages.deadline')}: {selectedMessage.aiInsight.deadline}
															</span>
														</div>
													)}
												</div>
												{selectedMessage.aiInsight.recommendation && (
													<div className="mt-2 text-xs text-neutral-400 bg-neutral-800 p-2 rounded-lg">
																💡 {selectedMessage.aiInsight.recommendation}
													</div>
												)}
											</div>
										</div>
									</div>
								)}

								{/* Original Content */}
								<div>
									<h3 className="font-bold mb-3 flex items-center gap-2 text-neutral-300">
										<Mail className="h-4 w-4 text-neutral-500" />
										{t('messages.messageContent')}
									</h3>
									<div className="p-6 bg-surface-dark rounded-2xl border border-border-dark whitespace-pre-wrap text-sm text-neutral-300 leading-relaxed">
										{selectedMessage.content}
									</div>
								</div>
							</div>

							{/* Footer Actions */}
							<div className="p-6 border-t border-border-dark bg-surface-dark">
								<div className="flex items-center justify-between gap-4">
									<div className="flex items-center gap-2">
										<button
											onClick={(e) => {
												e.stopPropagation()
												handleToggleStar(selectedMessage.id)
											}}
											className={`p-2 rounded-lg transition-colors ${
												selectedMessage.isStarred
													? 'text-yellow-500 bg-yellow-500/10'
													: 'text-neutral-500 hover:text-yellow-500 hover:bg-border-dark'
											}`}
											title={selectedMessage.isStarred ? "Unstar" : "Star"}
										>
											<Star className={`h-5 w-5 ${selectedMessage.isStarred ? 'fill-current' : ''}`} />
										</button>
										<button
											onClick={(e) => {
												e.stopPropagation()
												handleArchive(selectedMessage.id)
											}}
											className="p-2 rounded-lg text-neutral-500 hover:text-blue-400 hover:bg-border-dark transition-colors"
											title={selectedMessage.isArchived ? t('messages.restore') : t('messages.archived')}
										>
											{selectedMessage.isArchived ? (
												<ArchiveRestore className="h-5 w-5" />
											) : (
												<Archive className="h-5 w-5" />
											)}
										</button>
										<button
											onClick={(e) => {
												e.stopPropagation()
												handleDeleteMessage(selectedMessage.id)
											}}
											className="p-2 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-border-dark transition-colors"
											title={t('messages.delete')}
										>
											<Trash2 className="h-5 w-5" />
										</button>
									</div>
									<div className="flex items-center gap-2 flex-wrap">
										<Button variant="outline" onClick={handleCloseMessage} className="border-border-dark hover:bg-border-dark text-white">
											{t('messages.close')}
										</Button>
										{selectedMessage.quickActions?.map((qa, idx) => (
											<Button
												key={idx}
												variant={qa.variant === 'primary' ? 'brand' : 'outline'}
												onClick={() => handleQuickAction(qa.action)}
											>
												{getQuickActionLabel(qa.action) || qa.label}
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
