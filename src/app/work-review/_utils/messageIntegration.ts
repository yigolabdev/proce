import { storage } from '../../../utils/storage'
import type { Message } from '../../../types/common.types'

interface ReviewMessage {
	workEntryId: string
	workTitle: string
	reviewerName: string
	reviewAction: 'approved' | 'rejected' | 'changes_requested'
	comment: string
	recipientName: string
}

/**
 * Send review feedback as a message to the work entry submitter
 */
export function sendReviewMessage(reviewData: ReviewMessage): void {
	const messages = storage.get<Message[]>('messages') || []

	const newMessage: Message = {
		id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
		type: getMessageType(reviewData.reviewAction),
		priority: reviewData.reviewAction === 'rejected' ? 'high' : 'medium',
		title: getMessageTitle(reviewData.reviewAction, reviewData.workTitle),
		content: formatMessageContent(reviewData),
		date: new Date(),
		isRead: false,
		isStarred: false,
		isArchived: false,
		sender: reviewData.reviewerName,
		tags: ['work-review', reviewData.reviewAction, 'feedback'],
	}

	messages.unshift(newMessage) // Add to beginning of array
	storage.set('messages', messages)
}

function getMessageType(action: string): 'info' | 'warning' | 'alert' | 'success' {
	switch (action) {
		case 'approved':
			return 'success'
		case 'rejected':
			return 'alert'
		case 'changes_requested':
			return 'warning'
		default:
			return 'info'
	}
}

function getMessageTitle(action: string, workTitle: string): string {
	switch (action) {
		case 'approved':
			return `✅ Work Approved: ${workTitle}`
		case 'rejected':
			return `❌ Work Rejected: ${workTitle}`
		case 'changes_requested':
			return `💬 Changes Requested: ${workTitle}`
		default:
			return `📋 Review Feedback: ${workTitle}`
	}
}

function formatMessageContent(reviewData: ReviewMessage): string {
	const actionText = {
		approved: 'has approved',
		rejected: 'has rejected',
		changes_requested: 'has requested changes to',
	}[reviewData.reviewAction]

	return `Hi ${reviewData.recipientName},

${reviewData.reviewerName} ${actionText} your work submission: "${reviewData.workTitle}"

**Review Feedback:**
${reviewData.comment}

${
	reviewData.reviewAction === 'approved'
		? '🎉 Great work! Your submission has been approved.'
		: reviewData.reviewAction === 'rejected'
		? '⚠️ Please review the feedback and resubmit if needed.'
		: '📝 Please address the feedback and resubmit for review.'
}

You can view the full details in the Work History page.

---
This is an automated message from the Work Review system.`
}

/**
 * Get unread review messages count
 */
export function getUnreadReviewMessagesCount(): number {
	const messages = storage.get<Message[]>('messages') || []
	return messages.filter((m) => !m.isRead && m.tags?.includes('work-review')).length
}

