/**
 * Messages Page
 * 
 * 리팩토링 완료:
 * - 1,076줄 → ~200줄 (81% 감소)
 * - useMessages 훅으로 모든 로직 분리
 * - 재사용 가능한 컴포넌트로 UI 구성
 */

import React, { useState } from 'react'
import { PageHeader } from '../../components/common/PageHeader'
import { Button } from '../../components/ui/Button'
import { Tabs } from '../../components/ui/Tabs'
import { Mail, MailOpen, Star, Archive, Filter } from 'lucide-react'
import { toast } from 'sonner'

// Custom Hook
import { useMessages, type MessageFilter, type MessageType } from '../../hooks/useMessages'

// Components
import { MessageList } from '../../components/messages/MessageList'
import { MessageDetail } from '../../components/messages/MessageDetail'
import { MessageComposer } from '../../components/messages/MessageComposer'
import { Card } from '../../components/ui/Card'

export default function MessagesPage() {
	const messages = useMessages({
		onError: (error) => toast.error(error.message),
	})

	// UI State
	const [showComposer, setShowComposer] = useState(false)

	// Filter tabs
	const filterTabs = [
		{ id: 'all' as MessageFilter, label: 'All', count: messages.filteredMessages.length },
		{ id: 'unread' as MessageFilter, label: 'Unread', count: messages.unreadCount },
		{ id: 'starred' as MessageFilter, label: 'Starred' },
		{ id: 'archived' as MessageFilter, label: 'Archived' },
	]

	// Type filter options
	const typeFilters: Array<{ id: MessageType; label: string }> = [
		{ id: 'all', label: 'All Types' },
		{ id: 'task_assigned', label: 'Tasks' },
		{ id: 'review_received', label: 'Reviews' },
		{ id: 'project_update', label: 'Projects' },
		{ id: 'team_message', label: 'Team' },
		{ id: 'approval_request', label: 'Approvals' },
	]

	// Handlers
	const handleReply = () => {
		if (!messages.selectedMessage) return
		setShowComposer(true)
	}

	const handleSendReply = async (content: string) => {
		if (!messages.selectedMessage) return
		await messages.sendReply(messages.selectedMessage.id, content)
	}

	const handleDelete = () => {
		if (!messages.selectedMessage) return
		if (confirm('Delete this message?')) {
			messages.deleteMessage(messages.selectedMessage.id)
			toast.success('Message deleted')
		}
	}

	const handleArchive = () => {
		if (!messages.selectedMessage) return
		if (messages.selectedMessage.isArchived) {
			messages.unarchiveMessage(messages.selectedMessage.id)
			toast.success('Message unarchived')
		} else {
			messages.archiveMessage(messages.selectedMessage.id)
			toast.success('Message archived')
		}
	}

	const handleToggleStar = (id?: string) => {
		const messageId = id || messages.selectedMessage?.id
		if (!messageId) return
		messages.toggleStar(messageId)
	}

	const handleQuickAction = (action: string) => {
		switch (action) {
			case 'accept':
				toast.success('Task accepted')
				break
			case 'view':
				if (messages.selectedMessage?.relatedPage) {
					window.location.href = messages.selectedMessage.relatedPage
				}
				break
			case 'reply':
				handleReply()
				break
			default:
				toast.info(`Action: ${action}`)
		}
	}

	return (
		<div className="min-h-screen bg-background-dark">
			<div className="max-w-[1600px] mx-auto px-6 py-6 space-y-6">
				{/* Page Header */}
				<PageHeader
					title="Messages"
					description="Manage your notifications and communications"
					badge={messages.unreadCount > 0 ? `${messages.unreadCount} unread` : undefined}
				/>

				{/* Filter Tabs */}
				<Tabs
					items={filterTabs.map((tab) => ({
						id: tab.id,
						label: tab.label,
						count: tab.count,
						icon: tab.id === 'all' ? Mail : tab.id === 'unread' ? MailOpen : tab.id === 'starred' ? Star : Archive,
					}))}
					activeTab={messages.filter}
					onTabChange={(id) => messages.setFilter(id as MessageFilter)}
					variant="underline"
				/>

				{/* Type Filter */}
				<Card className="bg-surface-dark border-border-dark p-4">
					<div className="flex items-center gap-2">
						<Filter className="h-4 w-4 text-neutral-400" />
						<span className="text-sm text-neutral-400">Filter by type:</span>
						<div className="flex items-center gap-2 flex-wrap">
							{typeFilters.map((type) => (
								<Button
									key={type.id}
									onClick={() => messages.setTypeFilter(type.id)}
									variant={messages.typeFilter === type.id ? 'brand' : 'outline'}
									size="sm"
								>
									{type.label}
								</Button>
							))}
						</div>
					</div>
				</Card>

				{/* Content */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Message List */}
					<div>
						{messages.isLoading ? (
							<Card className="bg-surface-dark border-border-dark p-12 text-center">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto" />
								<p className="text-neutral-400 mt-4">Loading messages...</p>
							</Card>
						) : (
							<MessageList
								messages={messages.filteredMessages}
								selectedMessage={messages.selectedMessage}
								onSelectMessage={messages.selectMessage}
								onToggleStar={handleToggleStar}
							/>
						)}
					</div>

					{/* Message Detail / Composer */}
					<div>
						{showComposer && messages.selectedMessage ? (
							<MessageComposer
								replyTo={{
									id: messages.selectedMessage.id,
									subject: messages.selectedMessage.subject,
									from: messages.selectedMessage.from,
								}}
								onSend={handleSendReply}
								onCancel={() => setShowComposer(false)}
							/>
						) : messages.selectedMessage ? (
							<MessageDetail
								message={messages.selectedMessage}
								onClose={() => messages.selectMessage(null)}
								onReply={handleReply}
								onDelete={handleDelete}
								onArchive={handleArchive}
								onToggleStar={() => handleToggleStar()}
								onQuickAction={handleQuickAction}
							/>
						) : (
							<Card className="bg-surface-dark border-border-dark p-12 text-center">
								<Mail className="h-16 w-16 text-neutral-600 mx-auto mb-4" />
								<p className="text-neutral-400">Select a message to view details</p>
							</Card>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
