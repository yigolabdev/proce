/**
 * Message Helper Functions
 * 
 * 일관된 메시지 생성을 위한 헬퍼 함수들
 */

import { storage } from './storage'

export interface MessageData {
	id: string
	type: string
	priority: string
	subject: string
	from: string
	fromDepartment?: string
	preview: string
	content: string
	timestamp: Date
	isRead: boolean
	isStarred: boolean
	relatedType?: string
	relatedId?: string
	recipientId?: string
	aiSummary?: string
}

/**
 * 리뷰 요청 메시지 생성
 */
export function createReviewRequestMessage(params: {
	workEntryId: string
	workTitle: string
	workDescription: string
	projectName: string
	submitterName: string
	submitterDepartment?: string
	reviewerName: string
	reviewerId: string
	category?: string
	tags?: string[]
}): MessageData {
	const { 
		workEntryId, 
		workTitle, 
		workDescription, 
		projectName, 
		submitterName, 
		submitterDepartment,
		reviewerName,
		reviewerId,
		category,
		tags = []
	} = params

	return {
		id: `msg-review-req-${Date.now()}`,
		type: 'approval',
		priority: 'medium',
		subject: `Review Request: ${workTitle}`,
		from: submitterName,
		fromDepartment: submitterDepartment,
		preview: `${submitterName} requests your review on "${workTitle}"`,
		content: `Hi ${reviewerName},

${submitterName} has requested your review on their work submission.

**Project:** ${projectName}
**Title:** ${workTitle}
**Description:**
${workDescription}

${category ? `**Category:** ${category}\n` : ''}${tags.length > 0 ? `**Tags:** ${tags.join(', ')}\n` : ''}
Please review and provide feedback at your earliest convenience.

---
This is a review request from the Work Input system.`,
		timestamp: new Date(),
		isRead: false,
		isStarred: false,
		relatedType: 'work',
		relatedId: workEntryId,
		recipientId: reviewerId,
		aiSummary: `${submitterName} requests your review on work for ${projectName}`,
	}
}

/**
 * 리뷰 완료 메시지 생성
 */
export function createReviewCompletionMessage(params: {
	workEntryId: string
	workTitle: string
	reviewType: 'approved' | 'rejected' | 'changes_requested'
	reviewerName: string
	reviewerDepartment?: string
	submitterName: string
	submitterId: string
	reviewComments: string
}): MessageData {
	const {
		workEntryId,
		workTitle,
		reviewType,
		reviewerName,
		reviewerDepartment,
		submitterName,
		submitterId,
		reviewComments
	} = params

	const typeLabels = {
		approved: 'Approved',
		rejected: 'Rejected',
		changes_requested: 'Changes Requested'
	}

	const emoji = {
		approved: '✅',
		rejected: '❌',
		changes_requested: '🔄'
	}

	return {
		id: `msg-review-${Date.now()}`,
		type: 'notification',
		priority: reviewType === 'rejected' ? 'high' : 'medium',
		subject: `Work Review Completed: ${workTitle}`,
		from: reviewerName,
		fromDepartment: reviewerDepartment,
		preview: `${reviewerName} has reviewed your work: ${typeLabels[reviewType]}`,
		content: `Hi ${submitterName},

${reviewerName} has completed the review of your work submission.

**Work Title:** ${workTitle}
**Review Status:** ${emoji[reviewType]} ${typeLabels[reviewType]}

**Review Comments:**
${reviewComments}

${reviewType === 'changes_requested' ? 'Please make the requested changes and resubmit.' : ''}

---
Check your work entry for more details.`,
		timestamp: new Date(),
		isRead: false,
		isStarred: false,
		relatedType: 'work',
		relatedId: workEntryId,
		recipientId: submitterId,
		aiSummary: `${reviewerName} ${reviewType === 'approved' ? 'approved' : reviewType === 'rejected' ? 'rejected' : 'requested changes on'} your work`,
	}
}

/**
 * 태스크 완료 알림 메시지 생성
 */
export function createTaskCompletionMessage(params: {
	taskId: string
	taskTitle: string
	completedBy: string
	completedByDepartment?: string
	progressComment?: string
	workEntryId: string
}): MessageData {
	const {
		taskTitle,
		completedBy,
		completedByDepartment,
		progressComment,
		workEntryId
	} = params

	return {
		id: `msg-task-complete-${Date.now()}`,
		type: 'notification',
		priority: 'normal',
		subject: `Task Completed: ${taskTitle}`,
		from: completedBy,
		fromDepartment: completedByDepartment,
		preview: `${completedBy} has completed the task`,
		content: `Task "${taskTitle}" has been marked as complete.

${progressComment ? `**Progress Comment:**\n${progressComment}\n\n` : ''}Check the work entry for more details.`,
		timestamp: new Date(),
		isRead: false,
		isStarred: false,
		relatedType: 'work',
		relatedId: workEntryId,
		aiSummary: '✅ Task marked as complete',
	}
}

/**
 * 태스크 할당 메시지 생성
 */
export function createTaskAssignmentMessage(params: {
	taskId: string
	taskTitle: string
	taskDescription: string
	priority: 'high' | 'medium' | 'low'
	assignedBy: string
	assignedByDepartment?: string
	assignedToName: string
	assignedToId: string
	deadline?: string
	projectName?: string
}): MessageData {
	const {
		taskId,
		taskTitle,
		taskDescription,
		priority,
		assignedBy,
		assignedByDepartment,
		assignedToName,
		assignedToId,
		deadline,
		projectName
	} = params

	const priorityEmoji = {
		high: '🔴',
		medium: '🟡',
		low: '🟢'
	}

	return {
		id: `msg-task-assign-${Date.now()}`,
		type: 'task',
		priority: priority === 'high' ? 'urgent' : priority === 'medium' ? 'high' : 'normal',
		subject: `New Task Assigned: ${taskTitle}`,
		from: assignedBy,
		fromDepartment: assignedByDepartment,
		preview: `${assignedBy} assigned you a new ${priority} priority task`,
		content: `Hi ${assignedToName},

${assignedBy} has assigned a new task to you.

**Task:** ${taskTitle}
**Priority:** ${priorityEmoji[priority]} ${priority.toUpperCase()}
${projectName ? `**Project:** ${projectName}\n` : ''}${deadline ? `**Deadline:** ${deadline}\n` : ''}
**Description:**
${taskDescription}

Please review and start working on this task at your earliest convenience.`,
		timestamp: new Date(),
		isRead: false,
		isStarred: priority === 'high',
		relatedType: 'task',
		relatedId: taskId,
		recipientId: assignedToId,
		aiSummary: `New ${priority} priority task assigned`,
	}
}

/**
 * 메시지를 localStorage에 저장
 */
export function saveMessage(message: MessageData): void {
	const messages = storage.get<MessageData[]>('messages') || []
	messages.unshift(message)
	storage.set('messages', messages)
}

/**
 * 여러 메시지를 localStorage에 저장
 */
export function saveMessages(messages: MessageData[]): void {
	const existingMessages = storage.get<MessageData[]>('messages') || []
	const updatedMessages = [...messages, ...existingMessages]
	storage.set('messages', updatedMessages)
}

