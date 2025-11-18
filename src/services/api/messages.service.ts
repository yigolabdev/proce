/**
 * Messages Service
 * 
 * Handles all API calls related to messages/notifications.
 */

import { storage } from '../../utils/storage'
import type { ApiResponse } from './config'

/**
 * Message Type
 */
export type MessageType = 'task' | 'review' | 'approval' | 'project' | 'notification' | 'team'

/**
 * Message Interface
 */
export interface Message {
	id: string
	type: MessageType
	priority?: 'normal' | 'urgent'
	subject: string
	from: string
	fromDepartment?: string
	preview: string
	content: string
	timestamp: Date
	isRead: boolean
	isStarred: boolean
	relatedType?: 'work' | 'task' | 'project'
	relatedId?: string
	aiSummary?: string
	reviewType?: 'approved' | 'changes_requested' | 'rejected'
}

/**
 * Message Filters
 */
export interface MessageFilters {
	type?: MessageType
	isRead?: boolean
	isStarred?: boolean
	startDate?: Date
	endDate?: Date
}

/**
 * Create Message Data
 */
export interface CreateMessageData {
	type: MessageType
	priority?: 'normal' | 'urgent'
	subject: string
	from: string
	fromDepartment?: string
	preview: string
	content: string
	relatedType?: 'work' | 'task' | 'project'
	relatedId?: string
	aiSummary?: string
	reviewType?: 'approved' | 'changes_requested' | 'rejected'
}

/**
 * Messages Service
 */
class MessagesService {
	private readonly STORAGE_KEY = 'messages'
	
	/**
	 * Get all messages with optional filtering
	 */
	async getAll(filters?: MessageFilters): Promise<ApiResponse<Message[]>> {
		// TODO: Replace with API call
		// return apiClient.get<Message[]>('/messages', { params: filters })
		
		let messages = storage.get<Message[]>(this.STORAGE_KEY) || []
		
		// Apply filters
		if (filters) {
			if (filters.type) {
				messages = messages.filter(m => m.type === filters.type)
			}
			if (filters.isRead !== undefined) {
				messages = messages.filter(m => m.isRead === filters.isRead)
			}
			if (filters.isStarred !== undefined) {
				messages = messages.filter(m => m.isStarred === filters.isStarred)
			}
			if (filters.startDate) {
				messages = messages.filter(m => new Date(m.timestamp) >= filters.startDate!)
			}
			if (filters.endDate) {
				messages = messages.filter(m => new Date(m.timestamp) <= filters.endDate!)
			}
		}
		
		return {
			data: messages,
			success: true,
		}
	}
	
	/**
	 * Get message by ID
	 */
	async getById(id: string): Promise<ApiResponse<Message | null>> {
		// TODO: Replace with API call
		// return apiClient.get<Message>(`/messages/${id}`)
		
		const messages = storage.get<Message[]>(this.STORAGE_KEY) || []
		const message = messages.find(m => m.id === id)
		
		return {
			data: message || null,
			success: true,
		}
	}
	
	/**
	 * Create new message
	 */
	async create(messageData: CreateMessageData): Promise<ApiResponse<Message>> {
		// TODO: Replace with API call
		// return apiClient.post<Message>('/messages', messageData)
		
		const messages = storage.get<Message[]>(this.STORAGE_KEY) || []
		
		const newMessage: Message = {
			...messageData,
			id: `msg-${Date.now()}`,
			timestamp: new Date(),
			isRead: false,
			isStarred: false,
		}
		
		messages.unshift(newMessage)
		storage.set(this.STORAGE_KEY, messages)
		
		return {
			data: newMessage,
			message: 'Message created successfully',
			success: true,
		}
	}
	
	/**
	 * Mark message as read
	 */
	async markAsRead(id: string): Promise<ApiResponse<Message>> {
		// TODO: Replace with API call
		// return apiClient.patch<Message>(`/messages/${id}/read`)
		
		const messages = storage.get<Message[]>(this.STORAGE_KEY) || []
		const index = messages.findIndex(m => m.id === id)
		
		if (index === -1) {
			throw new Error('Message not found')
		}
		
		messages[index].isRead = true
		storage.set(this.STORAGE_KEY, messages)
		
		return {
			data: messages[index],
			success: true,
		}
	}
	
	/**
	 * Mark message as unread
	 */
	async markAsUnread(id: string): Promise<ApiResponse<Message>> {
		// TODO: Replace with API call
		// return apiClient.patch<Message>(`/messages/${id}/unread`)
		
		const messages = storage.get<Message[]>(this.STORAGE_KEY) || []
		const index = messages.findIndex(m => m.id === id)
		
		if (index === -1) {
			throw new Error('Message not found')
		}
		
		messages[index].isRead = false
		storage.set(this.STORAGE_KEY, messages)
		
		return {
			data: messages[index],
			success: true,
		}
	}
	
	/**
	 * Toggle star
	 */
	async toggleStar(id: string): Promise<ApiResponse<Message>> {
		// TODO: Replace with API call
		// return apiClient.patch<Message>(`/messages/${id}/star`)
		
		const messages = storage.get<Message[]>(this.STORAGE_KEY) || []
		const index = messages.findIndex(m => m.id === id)
		
		if (index === -1) {
			throw new Error('Message not found')
		}
		
		messages[index].isStarred = !messages[index].isStarred
		storage.set(this.STORAGE_KEY, messages)
		
		return {
			data: messages[index],
			success: true,
		}
	}
	
	/**
	 * Delete message
	 */
	async delete(id: string): Promise<ApiResponse<void>> {
		// TODO: Replace with API call
		// return apiClient.delete<void>(`/messages/${id}`)
		
		const messages = storage.get<Message[]>(this.STORAGE_KEY) || []
		const filtered = messages.filter(m => m.id !== id)
		storage.set(this.STORAGE_KEY, filtered)
		
		return {
			data: undefined,
			message: 'Message deleted successfully',
			success: true,
		}
	}
	
	/**
	 * Get unread count
	 */
	async getUnreadCount(): Promise<ApiResponse<number>> {
		// TODO: Replace with API call
		// return apiClient.get<number>('/messages/unread/count')
		
		const messages = storage.get<Message[]>(this.STORAGE_KEY) || []
		const count = messages.filter(m => !m.isRead).length
		
		return {
			data: count,
			success: true,
		}
	}
	
	/**
	 * Get statistics
	 */
	async getStatistics(): Promise<ApiResponse<{
		total: number
		unread: number
		starred: number
		byType: Record<MessageType, number>
	}>> {
		// TODO: Replace with API call
		// return apiClient.get<Statistics>('/messages/statistics')
		
		const messages = storage.get<Message[]>(this.STORAGE_KEY) || []
		
		const byType = messages.reduce((acc, msg) => {
			acc[msg.type] = (acc[msg.type] || 0) + 1
			return acc
		}, {} as Record<MessageType, number>)
		
		return {
			data: {
				total: messages.length,
				unread: messages.filter(m => !m.isRead).length,
				starred: messages.filter(m => m.isStarred).length,
				byType,
			},
			success: true,
		}
	}
}

export const messagesService = new MessagesService()

