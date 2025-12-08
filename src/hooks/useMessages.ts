/**
 * useMessages Hook
 * 메시지 관리 로직
 */

import { useState, useEffect, useCallback } from 'react'
import { storage, MessageUtils } from '../utils/storage'
import type { Message } from '../types/common.types'

export type MessageFilter = 'all' | 'unread' | 'starred' | 'archived'
export type MessageType = 'task_assigned' | 'review_received' | 'project_update' | 'team_message' | 'approval_request' | 'reply' | 'all'

export interface UseMessagesOptions {
	onError?: (error: Error) => void
}

export interface UseMessagesReturn {
	// Data
	messages: Message[]
	selectedMessage: Message | null
	threadMessages: Message[]
	
	// Filters
	filter: MessageFilter
	typeFilter: MessageType
	setFilter: (filter: MessageFilter) => void
	setTypeFilter: (type: MessageType) => void
	
	// Actions
	selectMessage: (message: Message | null) => void
	markAsRead: (id: string) => void
	markAsUnread: (id: string) => void
	toggleStar: (id: string) => void
	archiveMessage: (id: string) => void
	unarchiveMessage: (id: string) => void
	deleteMessage: (id: string) => void
	sendReply: (messageId: string, content: string) => Promise<void>
	
	// Thread
	loadThread: (messageId: string) => void
	
	// Computed
	filteredMessages: Message[]
	unreadCount: number
	
	// State
	isLoading: boolean
	error: Error | null
}

export function useMessages(options: UseMessagesOptions = {}): UseMessagesReturn {
	const { onError } = options
	
	const [messages, setMessages] = useState<Message[]>([])
	const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
	const [threadMessages, setThreadMessages] = useState<Message[]>([])
	const [filter, setFilter] = useState<MessageFilter>('all')
	const [typeFilter, setTypeFilter] = useState<MessageType>('all')
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)

	// Load messages
	const loadMessages = useCallback(() => {
		try {
			setIsLoading(true)
			const savedMessages = storage.get<any[]>('messages', [])
			
			const messagesWithDates = ((savedMessages || [])).map((msg: any) => ({
				...msg,
				timestamp: new Date(msg.timestamp),
				isArchived: msg.isArchived || false,
			}))
			
			setMessages(messagesWithDates)
			setError(null)
		} catch (err) {
			const error = err instanceof Error ? err : new Error('Failed to load messages')
			setError(error)
			onError?.(error)
		} finally {
			setIsLoading(false)
		}
	}, [onError])

	useEffect(() => {
		loadMessages()
	}, [loadMessages])

	// Filter messages
	const filteredMessages = messages.filter((msg) => {
		// Apply filter
		if (filter === 'unread' && msg.isRead) return false
		if (filter === 'starred' && !msg.isStarred) return false
		if (filter === 'archived' && !msg.isArchived) return false
		if (filter === 'all' && msg.isArchived) return false
		
		// Apply type filter
		if (typeFilter !== 'all' && msg.type !== typeFilter) return false
		
		return true
	})

	// Unread count
	const unreadCount = messages.filter((msg) => !msg.isRead && !msg.isArchived).length

	// Select message
	const selectMessage = useCallback((message: Message | null) => {
		setSelectedMessage(message)
		if (message && !message.isRead) {
			markAsRead(message.id)
		}
	}, [])

	// Mark as read
	const markAsRead = useCallback((id: string) => {
		setMessages((prev) => {
			const updated = prev.map((msg) =>
				msg.id === id ? { ...msg, isRead: true } : msg
			)
			storage.set('messages', updated)
			return updated
		})
	}, [])

	// Mark as unread
	const markAsUnread = useCallback((id: string) => {
		setMessages((prev) => {
			const updated = prev.map((msg) =>
				msg.id === id ? { ...msg, isRead: false } : msg
			)
			storage.set('messages', updated)
			return updated
		})
	}, [])

	// Toggle star
	const toggleStar = useCallback((id: string) => {
		setMessages((prev) => {
			const updated = prev.map((msg) =>
				msg.id === id ? { ...msg, isStarred: !msg.isStarred } : msg
			)
			storage.set('messages', updated)
			return updated
		})
	}, [])

	// Archive message
	const archiveMessage = useCallback((id: string) => {
		setMessages((prev) => {
			const updated = prev.map((msg) =>
				msg.id === id ? { ...msg, isArchived: true } : msg
			)
			storage.set('messages', updated)
			return updated
		})
	}, [])

	// Unarchive message
	const unarchiveMessage = useCallback((id: string) => {
		setMessages((prev) => {
			const updated = prev.map((msg) =>
				msg.id === id ? { ...msg, isArchived: false } : msg
			)
			storage.set('messages', updated)
			return updated
		})
	}, [])

	// Delete message
	const deleteMessage = useCallback((id: string) => {
		setMessages((prev) => {
			const updated = prev.filter((msg) => msg.id !== id)
			storage.set('messages', updated)
			return updated
		})
		if (selectedMessage?.id === id) {
			setSelectedMessage(null)
		}
	}, [selectedMessage])

	// Send reply
	const sendReply = useCallback(async (messageId: string, content: string) => {
		const parentMessage = messages.find((m) => m.id === messageId)
		if (!parentMessage) return

		const replyMessage = MessageUtils.createReply(
			parentMessage,
			content,
			'Current User', // Replace with actual user
			'user-current-id',
			undefined // fromDepartment
		)

		setMessages((prev) => {
			const updated = [...prev, replyMessage]
			storage.set('messages', updated)
			return updated
		})

		// Update reply count
		setMessages((prev) => {
			const updated = prev.map((msg) =>
				msg.id === messageId
					? { ...msg, replyCount: (msg.replyCount || 0) + 1 }
					: msg
			)
			storage.set('messages', updated)
			return updated
		})
	}, [messages])

	// Load thread
	const loadThread = useCallback((messageId: string) => {
		const thread = MessageUtils.getThreadMessages(messageId)
		setThreadMessages(thread)
	}, [])

	return {
		// Data
		messages,
		selectedMessage,
		threadMessages,
		
		// Filters
		filter,
		typeFilter,
		setFilter,
		setTypeFilter,
		
		// Actions
		selectMessage,
		markAsRead,
		markAsUnread,
		toggleStar,
		archiveMessage,
		unarchiveMessage,
		deleteMessage,
		sendReply,
		
		// Thread
		loadThread,
		
		// Computed
		filteredMessages,
		unreadCount,
		
		// State
		isLoading,
		error,
	}
}
