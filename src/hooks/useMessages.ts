/**
 * useMessages Hook
 * 
 * Custom hook for managing messages/notifications.
 */

import { useState, useEffect, useCallback } from 'react'
import { messagesService, type MessageFilters, type CreateMessageData, type Message } from '../services/api'

interface UseMessagesResult {
	messages: Message[]
	loading: boolean
	error: Error | null
	unreadCount: number
	refetch: () => Promise<void>
	createMessage: (messageData: CreateMessageData) => Promise<Message>
	markAsRead: (id: string) => Promise<void>
	markAsUnread: (id: string) => Promise<void>
	toggleStar: (id: string) => Promise<void>
	deleteMessage: (id: string) => Promise<void>
}

/**
 * Hook for managing messages
 * 
 * @param filters - Optional filters to apply
 * @param autoFetch - Whether to fetch data automatically on mount (default: true)
 */
export function useMessages(
	filters?: MessageFilters,
	autoFetch: boolean = true
): UseMessagesResult {
	const [messages, setMessages] = useState<Message[]>([])
	const [unreadCount, setUnreadCount] = useState(0)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)
	
	/**
	 * Fetch messages
	 */
	const fetchMessages = useCallback(async () => {
		setLoading(true)
		setError(null)
		
		try {
			const response = await messagesService.getAll(filters)
			setMessages(response.data)
			
			// Update unread count
			const countResponse = await messagesService.getUnreadCount()
			setUnreadCount(countResponse.data)
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Failed to fetch messages'))
		} finally {
			setLoading(false)
		}
	}, [filters])
	
	/**
	 * Create message
	 */
	const createMessage = useCallback(async (messageData: CreateMessageData) => {
		setLoading(true)
		setError(null)
		
		try {
			const response = await messagesService.create(messageData)
			await fetchMessages() // Refetch to update list
			return response.data
		} catch (err) {
			const error = err instanceof Error ? err : new Error('Failed to create message')
			setError(error)
			throw error
		} finally {
			setLoading(false)
		}
	}, [fetchMessages])
	
	/**
	 * Mark message as read
	 */
	const markAsRead = useCallback(async (id: string) => {
		try {
			await messagesService.markAsRead(id)
			await fetchMessages() // Refetch to update list
		} catch (err) {
			const error = err instanceof Error ? err : new Error('Failed to mark as read')
			setError(error)
			throw error
		}
	}, [fetchMessages])
	
	/**
	 * Mark message as unread
	 */
	const markAsUnread = useCallback(async (id: string) => {
		try {
			await messagesService.markAsUnread(id)
			await fetchMessages() // Refetch to update list
		} catch (err) {
			const error = err instanceof Error ? err : new Error('Failed to mark as unread')
			setError(error)
			throw error
		}
	}, [fetchMessages])
	
	/**
	 * Toggle star
	 */
	const toggleStar = useCallback(async (id: string) => {
		try {
			await messagesService.toggleStar(id)
			await fetchMessages() // Refetch to update list
		} catch (err) {
			const error = err instanceof Error ? err : new Error('Failed to toggle star')
			setError(error)
			throw error
		}
	}, [fetchMessages])
	
	/**
	 * Delete message
	 */
	const deleteMessage = useCallback(async (id: string) => {
		setLoading(true)
		setError(null)
		
		try {
			await messagesService.delete(id)
			await fetchMessages() // Refetch to update list
		} catch (err) {
			const error = err instanceof Error ? err : new Error('Failed to delete message')
			setError(error)
			throw error
		} finally {
			setLoading(false)
		}
	}, [fetchMessages])
	
	// Auto-fetch on mount if enabled
	useEffect(() => {
		if (autoFetch) {
			fetchMessages()
		}
	}, [autoFetch, fetchMessages])
	
	return {
		messages,
		loading,
		error,
		unreadCount,
		refetch: fetchMessages,
		createMessage,
		markAsRead,
		markAsUnread,
		toggleStar,
		deleteMessage,
	}
}

