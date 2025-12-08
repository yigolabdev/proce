/**
 * MessageComposer Component
 * 메시지/답장 작성
 */

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import Textarea from '../ui/Textarea'
import { Send, X } from 'lucide-react'
import { toast } from 'sonner'

export interface MessageComposerProps {
	replyTo?: {
		id: string
		subject: string
		from: string
	}
	onSend: (content: string) => Promise<void>
	onCancel: () => void
	placeholder?: string
}

export function MessageComposer({
	replyTo,
	onSend,
	onCancel,
	placeholder = 'Type your message...',
}: MessageComposerProps) {
	const [content, setContent] = useState('')
	const [isSending, setIsSending] = useState(false)

	const handleSend = async () => {
		if (!content.trim()) {
			toast.error('Please enter a message')
			return
		}

		setIsSending(true)
		try {
			await onSend(content)
			setContent('')
			toast.success(replyTo ? 'Reply sent' : 'Message sent')
			onCancel()
		} catch (error) {
			toast.error('Failed to send message')
		} finally {
			setIsSending(false)
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault()
			handleSend()
		}
	}

	return (
		<Card className="bg-surface-dark border-border-dark">
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="text-base">
						{replyTo ? `Reply to: ${replyTo.subject}` : 'New Message'}
					</CardTitle>
					<Button onClick={onCancel} variant="ghost" size="sm">
						<X className="h-4 w-4" />
					</Button>
				</div>
				{replyTo && (
					<p className="text-sm text-neutral-400 mt-1">
						Replying to {replyTo.from}
					</p>
				)}
			</CardHeader>

			<CardContent className="space-y-4">
				<Textarea
					value={content}
					onChange={(e) => setContent(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					disabled={isSending}
					rows={6}
					className="resize-none"
				/>

				<div className="flex items-center justify-between">
					<p className="text-xs text-neutral-500">
						💡 Tip: Press {navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'} + Enter to send
					</p>
					<div className="flex items-center gap-2">
						<Button
							onClick={onCancel}
							disabled={isSending}
							variant="outline"
						>
							Cancel
						</Button>
						<Button
							onClick={handleSend}
							disabled={isSending || !content.trim()}
							variant="brand"
						>
							{isSending ? (
								<>
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
									Sending...
								</>
							) : (
								<>
									<Send className="h-4 w-4 mr-2" />
									Send
								</>
							)}
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

