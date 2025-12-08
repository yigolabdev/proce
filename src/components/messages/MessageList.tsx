/**
 * MessageList Component
 * 메시지 목록 표시
 */

import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import {
	Mail,
	Star,
	Clock,
	Sparkles,
	AlertCircle,
	Users,
	MessageSquare,
	Zap,
} from 'lucide-react'
import type { Message } from '../../types/common.types'

export interface MessageListProps {
	messages: Message[]
	selectedMessage: Message | null
	onSelectMessage: (message: Message) => void
	onToggleStar: (id: string) => void
}

export function MessageList({
	messages,
	selectedMessage,
	onSelectMessage,
	onToggleStar,
}: MessageListProps) {
	const getTypeIcon = (type: Message['type']) => {
		switch (type) {
			case 'task_assigned':
				return <Zap className="h-4 w-4" />
			case 'review_received':
				return <MessageSquare className="h-4 w-4" />
			case 'project_update':
				return <Users className="h-4 w-4" />
			case 'approval_request':
				return <AlertCircle className="h-4 w-4" />
			default:
				return <Mail className="h-4 w-4" />
		}
	}

	const getTypeColor = (type: Message['type']) => {
		switch (type) {
			case 'task_assigned':
				return 'text-orange-400'
			case 'review_received':
				return 'text-blue-400'
			case 'project_update':
				return 'text-purple-400'
			case 'approval_request':
				return 'text-yellow-400'
			default:
				return 'text-neutral-400'
		}
	}

	const getPriorityBadge = (priority: Message['priority']) => {
		switch (priority) {
			case 'urgent':
				return 'bg-red-500/20 text-red-400 border-red-500/50'
			case 'high':
				return 'bg-orange-500/20 text-orange-400 border-orange-500/50'
			case 'normal':
				return 'bg-blue-500/20 text-blue-400 border-blue-500/50'
			case 'low':
				return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/50'
		}
	}

	const formatTime = (date: Date) => {
		const now = new Date()
		const diff = now.getTime() - date.getTime()
		const minutes = Math.floor(diff / 60000)
		const hours = Math.floor(diff / 3600000)
		const days = Math.floor(diff / 86400000)

		if (minutes < 1) return 'Just now'
		if (minutes < 60) return `${minutes}m ago`
		if (hours < 24) return `${hours}h ago`
		if (days < 7) return `${days}d ago`
		return date.toLocaleDateString()
	}

	if (messages.length === 0) {
		return (
			<Card className="bg-surface-dark border-border-dark">
				<div className="p-12 text-center">
					<Mail className="h-16 w-16 text-neutral-600 mx-auto mb-4" />
					<p className="text-neutral-400 text-lg">No messages</p>
					<p className="text-neutral-500 text-sm mt-2">
						You're all caught up!
					</p>
				</div>
			</Card>
		)
	}

	return (
		<div className="space-y-2">
			{messages.map((message) => {
				const isSelected = selectedMessage?.id === message.id
				const hasAI = Boolean(message.aiInsight)
				const hasReplies = (message.replyCount || 0) > 0

				return (
					<Card
						key={message.id}
						className={`
							cursor-pointer transition-all
							${isSelected
								? 'bg-orange-500/10 border-orange-500/50'
								: 'bg-surface-dark border-border-dark hover:border-neutral-600'
							}
							${!message.isRead ? 'border-l-4 border-l-orange-500' : ''}
						`}
						onClick={() => onSelectMessage(message)}
					>
						<div className="p-4">
							<div className="flex items-start gap-3">
								{/* Icon */}
								<div className={`p-2 rounded-lg bg-neutral-800 ${getTypeColor(message.type)}`}>
									{getTypeIcon(message.type)}
								</div>

								{/* Content */}
								<div className="flex-1 min-w-0">
									<div className="flex items-start justify-between gap-2 mb-1">
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 mb-1">
												<h3 className={`text-sm font-medium truncate ${
													message.isRead ? 'text-neutral-300' : 'text-white'
												}`}>
													{message.subject}
												</h3>
												{!message.isRead && (
													<div className="w-2 h-2 bg-orange-500 rounded-full shrink-0" />
												)}
											</div>
											<p className="text-xs text-neutral-400">
												{message.from}
												{message.fromDepartment && (
													<span className="text-neutral-600"> • {message.fromDepartment}</span>
												)}
											</p>
										</div>

										{/* Time */}
										<div className="flex items-center gap-2 shrink-0">
											<span className="text-xs text-neutral-500 flex items-center gap-1">
												<Clock className="h-3 w-3" />
												{formatTime(message.timestamp || message.date)}
											</span>
											<Button
												onClick={(e) => {
													e.stopPropagation()
													onToggleStar(message.id)
												}}
												variant="ghost"
												size="sm"
												className="p-1"
											>
												<Star
													className={`h-4 w-4 ${
														message.isStarred
															? 'fill-yellow-400 text-yellow-400'
															: 'text-neutral-500'
													}`}
												/>
											</Button>
										</div>
									</div>

									{/* Preview */}
									<p className="text-sm text-neutral-400 line-clamp-2 mb-2">
										{message.preview}
									</p>

									{/* Badges */}
									<div className="flex items-center gap-2 flex-wrap">
										{/* Priority */}
										<span className={`
											text-xs px-2 py-0.5 rounded-full border
											${getPriorityBadge(message.priority)}
										`}>
											{message.priority.toUpperCase()}
										</span>

										{/* AI Insight */}
										{hasAI && (
											<span className="text-xs px-2 py-0.5 rounded-full border bg-purple-500/20 text-purple-400 border-purple-500/50 flex items-center gap-1">
												<Sparkles className="h-3 w-3" />
												AI Analysis
											</span>
										)}

										{/* Reply Count */}
										{hasReplies && (
											<span className="text-xs px-2 py-0.5 rounded-full border bg-blue-500/20 text-blue-400 border-blue-500/50 flex items-center gap-1">
												<MessageSquare className="h-3 w-3" />
												{message.replyCount} {message.replyCount === 1 ? 'reply' : 'replies'}
											</span>
										)}
									</div>
								</div>
							</div>
						</div>
					</Card>
				)
			})}
		</div>
	)
}

