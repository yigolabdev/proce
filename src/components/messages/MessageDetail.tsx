/**
 * MessageDetail Component
 * 메시지 상세 내용 표시
 */

import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import {
	X,
	Reply,
	Trash2,
	Archive,
	Star,
	Sparkles,
	Clock,
	User,
	ExternalLink,
} from 'lucide-react'
import type { Message } from '../../types/common.types'

export interface MessageDetailProps {
	message: Message
	onClose: () => void
	onReply: () => void
	onDelete: () => void
	onArchive: () => void
	onToggleStar: () => void
	onQuickAction?: (action: string) => void
}

export function MessageDetail({
	message,
	onClose,
	onReply,
	onDelete,
	onArchive,
	onToggleStar,
	onQuickAction,
}: MessageDetailProps) {
	return (
		<Card className="bg-surface-dark border-border-dark">
			<CardHeader>
				<div className="flex items-start justify-between">
					<div className="flex-1 mr-4">
						<CardTitle className="text-lg mb-2">{message.subject}</CardTitle>
						<div className="flex items-center gap-3 text-sm text-neutral-400">
							<div className="flex items-center gap-1">
								<User className="h-4 w-4" />
								{message.from}
							</div>
							{message.fromDepartment && (
								<span className="text-neutral-600">• {message.fromDepartment}</span>
							)}
							<div className="flex items-center gap-1">
								<Clock className="h-4 w-4" />
								{(message.timestamp || message.date) && new Date(message.timestamp || message.date).toLocaleString()}
							</div>
						</div>
					</div>

					{/* Actions */}
					<div className="flex items-center gap-1 shrink-0">
						<Button onClick={onToggleStar} variant="ghost" size="sm">
							<Star
								className={`h-4 w-4 ${
									message.isStarred
										? 'fill-yellow-400 text-yellow-400'
										: 'text-neutral-500'
								}`}
							/>
						</Button>
						<Button onClick={onReply} variant="ghost" size="sm">
							<Reply className="h-4 w-4" />
						</Button>
						<Button onClick={onArchive} variant="ghost" size="sm">
							<Archive className="h-4 w-4" />
						</Button>
						<Button
							onClick={onDelete}
							variant="ghost"
							size="sm"
							className="text-red-400 hover:text-red-300"
						>
							<Trash2 className="h-4 w-4" />
						</Button>
						<Button onClick={onClose} variant="ghost" size="sm">
							<X className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-6">
				{/* AI Insight */}
				{message.aiInsight && (
					<div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
						<div className="flex items-start gap-3">
							<Sparkles className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
							<div className="space-y-2 flex-1">
								<h4 className="font-medium text-purple-400">AI Analysis</h4>
								<p className="text-sm text-white">{message.aiInsight.summary}</p>
								<div className="flex flex-wrap gap-4 text-xs text-purple-300">
									{message.aiInsight.estimatedTime && (
										<div>
											<span className="text-purple-400">Estimated Time:</span>{' '}
											{message.aiInsight.estimatedTime}
										</div>
									)}
									{message.aiInsight.deadline && (
										<div>
											<span className="text-purple-400">Deadline:</span>{' '}
											{message.aiInsight.deadline}
										</div>
									)}
								</div>
								{message.aiInsight.recommendation && (
									<div className="text-xs text-purple-300 mt-2">
										💡 {message.aiInsight.recommendation}
									</div>
								)}
							</div>
						</div>
					</div>
				)}

				{/* Content */}
				<div className="prose prose-invert max-w-none">
					<div className="text-neutral-300 whitespace-pre-wrap">
						{message.content}
					</div>
				</div>

				{/* Quick Actions */}
				{message.quickActions && message.quickActions.length > 0 && (
					<div className="flex items-center gap-2 pt-4 border-t border-border-dark">
						<span className="text-sm text-neutral-400 mr-2">Quick Actions:</span>
						{message.quickActions.map((action, index) => (
							<Button
								key={index}
								onClick={() => onQuickAction?.(action.action)}
								variant={(action.variant === 'success' ? 'brand' : action.variant) || 'outline'}
								size="sm"
							>
								{action.label}
							</Button>
						))}
					</div>
				)}

				{/* Related Link */}
				{message.relatedPage && (
					<div className="pt-4 border-t border-border-dark">
						<Button
							onClick={() => window.location.href = message.relatedPage!}
							variant="outline"
							size="sm"
							className="w-full"
						>
							<ExternalLink className="h-4 w-4 mr-2" />
							View Related Item
						</Button>
					</div>
				)}

				{/* Reply Count */}
				{message.replyCount && message.replyCount > 0 && (
					<div className="pt-4 border-t border-border-dark">
						<p className="text-sm text-neutral-400">
							{message.replyCount} {message.replyCount === 1 ? 'reply' : 'replies'} to this message
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	)
}

