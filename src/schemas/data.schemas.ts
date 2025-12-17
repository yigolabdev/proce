/**
 * Data Schemas using Zod
 * 
 * 모든 주요 데이터 타입에 대한 Zod 스키마 정의
 * - 타입 안전성 보장
 * - 런타임 검증
 * - 자동 타입 변환 (Date 등)
 */

import { z } from 'zod'

/**
 * Date Schema - string을 Date로 자동 변환
 */
const dateSchema = z.preprocess((arg) => {
	if (typeof arg === 'string' || arg instanceof Date) {
		return new Date(arg)
	}
	return arg
}, z.date())

/**
 * Optional Date Schema
 */
const optionalDateSchema = z.preprocess((arg) => {
	if (!arg) return undefined
	if (typeof arg === 'string' || arg instanceof Date) {
		return new Date(arg)
	}
	return arg
}, z.date().optional())

/**
 * File Attachment Schema
 */
export const fileAttachmentSchema = z.object({
	id: z.string(),
	name: z.string(),
	size: z.number(),
	type: z.string(),
	url: z.string(),
	uploadedAt: optionalDateSchema,
})

/**
 * Link Resource Schema
 */
export const linkResourceSchema = z.object({
	id: z.string(),
	title: z.string(),
	url: z.string().url(),
	addedAt: optionalDateSchema,
})

/**
 * Work Entry Schema
 */
export const workEntrySchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string(),
	category: z.string(),
	projectId: z.string().optional(),
	projectName: z.string().optional(),
	tags: z.array(z.string()).default([]),
	date: dateSchema,
	duration: z.string().optional(),
	files: z.array(fileAttachmentSchema).default([]),
	links: z.array(linkResourceSchema).default([]),
	status: z.enum(['submitted', 'approved', 'rejected', 'pending']).default('submitted'),
	isConfidential: z.boolean().default(false),
	submittedBy: z.string(),
	submittedById: z.string(),
	submittedByName: z.string().optional(),
	department: z.string().optional(),
	createdBy: z.string().optional(),
	createdById: z.string().optional(),
	createdAt: optionalDateSchema,
	reviewedBy: z.string().optional(),
	reviewedById: z.string().optional(),
	reviewedAt: z.string().optional(),
	reviewComments: z.string().optional(),
	taskId: z.string().optional(),
	comment: z.string().optional(),
})

export type WorkEntry = z.infer<typeof workEntrySchema>

/**
 * Project Ownership Schema
 */
export const projectOwnershipSchema = z.object({
	scope: z.enum(['personal', 'team', 'department', 'company']),
	// Personal project
	ownerId: z.string().optional(),
	ownerName: z.string().optional(),
	// Team/Department project
	teamId: z.string().optional(),
	teamName: z.string().optional(),
	departmentId: z.string().optional(),
	departmentName: z.string().optional(),
})

export type ProjectOwnership = z.infer<typeof projectOwnershipSchema>

/**
 * Project Schema
 */
export const projectSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	ownership: projectOwnershipSchema,
	departments: z.array(z.string()).optional().default([]),
	objectives: z.array(z.string()).default([]),
	status: z.enum(['planning', 'active', 'on-hold', 'completed', 'cancelled']).default('planning'),
	progress: z.number().min(0).max(100).default(0),
	startDate: dateSchema,
	endDate: dateSchema,
	members: z.array(z.string()).optional().default([]),
	tags: z.array(z.string()).default([]),
	createdAt: dateSchema,
	createdBy: z.string(),
	createdById: z.string().optional(),
	files: z.array(fileAttachmentSchema).default([]),
	links: z.array(linkResourceSchema).default([]),
})

export type Project = z.infer<typeof projectSchema>

/**
 * Message Schema (Enhanced with Reply/Thread support)
 */
export const messageSchema = z.object({
	id: z.string(),
	from: z.string(),
	fromId: z.string().optional(),
	fromDepartment: z.string().optional(),
	to: z.array(z.string()).default([]),  // 다중 수신자
	toIds: z.array(z.string()).default([]),
	cc: z.array(z.string()).default([]),  // 참조
	ccIds: z.array(z.string()).default([]),
	subject: z.string(),
	preview: z.string(),
	content: z.string(),
	timestamp: dateSchema,
	isRead: z.boolean().default(false),
	isStarred: z.boolean().default(false),
	isArchived: z.boolean().default(false),
	type: z.enum(['task_assigned', 'review_received', 'project_update', 'team_message', 'approval_request', 'reply']),
	priority: z.enum(['urgent', 'high', 'normal', 'low']).default('normal'),
	relatedId: z.string().optional(),
	relatedPage: z.string().optional(),
	quickActions: z.array(z.object({
		label: z.string(),
		action: z.string(),
		variant: z.enum(['primary', 'outline', 'secondary']).optional(),
	})).optional(),
	aiInsight: z.object({
		summary: z.string(),
		estimatedTime: z.string().optional(),
		deadline: z.string().optional(),
		recommendation: z.string().optional(),
	}).optional(),
	// Thread & Reply support
	threadId: z.string().optional(),  // 스레드 ID (원본 메시지 ID)
	parentId: z.string().optional(),  // 부모 메시지 ID (답장 대상)
	replyCount: z.number().default(0),  // 답장 수
	// Read receipts
	readBy: z.array(z.object({
		userId: z.string(),
		userName: z.string(),
		readAt: dateSchema,
	})).default([]),
	// Mentions
	mentions: z.array(z.string()).default([]),  // 멘션된 사용자 ID
	// Attachments (향후 확장)
	attachments: z.array(fileAttachmentSchema).default([]),
})

export type Message = z.infer<typeof messageSchema>

/**
 * Pending Review Schema
 */
export const pendingReviewSchema = z.object({
	id: z.string(),
	workEntryId: z.string(),
	workTitle: z.string(),
	workDescription: z.string(),
	projectId: z.string().optional(),
	projectName: z.string().optional(),
	submittedBy: z.string(),
	submittedById: z.string(),
	submittedByDepartment: z.string().optional(),
	reviewerId: z.string().optional(),
	reviewerName: z.string().optional(),
	reviewerRole: z.string().optional(),
	reviewerDepartment: z.string().optional(),
	status: z.string().default('pending'),
	submittedAt: z.union([z.string(), dateSchema]),
	tags: z.array(z.string()).default([]),
	files: z.array(fileAttachmentSchema).default([]),
	links: z.array(linkResourceSchema).default([]),
	category: z.string().optional(),
	isConfidential: z.boolean().default(false),
	priority: z.string().optional(),
})

export type PendingReview = z.infer<typeof pendingReviewSchema>

/**
 * Received Review Schema
 */
export const receivedReviewSchema = z.object({
	id: z.string(),
	workEntryId: z.string(),
	workTitle: z.string(),
	workDescription: z.string(),
	projectId: z.string().optional(),
	projectName: z.string().optional(),
	reviewType: z.enum(['approved', 'rejected', 'changes_requested']),
	reviewedBy: z.string(),
	reviewedById: z.string(),
	reviewedByDepartment: z.string().optional(),
	reviewedAt: dateSchema,
	reviewComments: z.string(),
	isRead: z.boolean().default(false),
	tags: z.array(z.string()).default([]),
	files: z.array(fileAttachmentSchema).default([]),
	links: z.array(linkResourceSchema).default([]),
	category: z.string().optional(),
	priority: z.string().optional(),
	isConfidential: z.boolean().default(false),
})

export type ReceivedReview = z.infer<typeof receivedReviewSchema>

/**
 * Department Schema
 */
export const departmentSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	parentId: z.string().optional(),
	managerId: z.string().optional(),
	memberCount: z.number().optional(),
	createdAt: optionalDateSchema,
})

export type Department = z.infer<typeof departmentSchema>

/**
 * User Schema
 */
export const userSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().email(),
	role: z.enum(['user', 'admin', 'executive']),
	department: z.string().optional(),
	position: z.string().optional(),
	avatar: z.string().optional(),
	createdAt: optionalDateSchema,
})

export type User = z.infer<typeof userSchema>

/**
 * Work Draft Schema
 */
export const workDraftSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string(),
	category: z.string().optional(),
	projectId: z.string().optional(),
	tags: z.array(z.string()).default([]),
	files: z.array(fileAttachmentSchema).default([]),
	links: z.array(linkResourceSchema).default([]),
	isConfidential: z.boolean().default(false),
	savedAt: dateSchema,
	comment: z.string().optional(),
})

export type WorkDraft = z.infer<typeof workDraftSchema>

/**
 * AI Task Schema
 */
export const aiTaskSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string(),
	category: z.string(),
	priority: z.enum(['high', 'medium', 'low']).default('medium'),
	estimatedTime: z.string().optional(),
	deadline: z.string().optional(),
	status: z.enum(['pending', 'accepted', 'rejected', 'completed']).default('pending'),
	assignedToId: z.string().optional(),
	assignedToName: z.string().optional(),
	projectId: z.string().optional(),
	projectName: z.string().optional(),
	createdAt: dateSchema,
	createdBy: z.string().optional(),
	aiConfidence: z.number().min(0).max(1).optional(),
	completedWorkEntries: z.array(z.string()).default([]),
})

export type AITask = z.infer<typeof aiTaskSchema>

/**
 * Work Entry History Schema
 * 업무 변경 이력 추적
 */
export const workEntryHistorySchema = z.object({
	id: z.string(),
	workEntryId: z.string(),
	action: z.enum(['created', 'updated', 'deleted', 'reviewed', 'status_changed', 'assigned']),
	changedFields: z.array(z.object({
		field: z.string(),
		oldValue: z.any(),
		newValue: z.any(),
	})).optional(),
	changedBy: z.string(),
	changedById: z.string(),
	changedByDepartment: z.string().optional(),
	changedAt: dateSchema,
	comment: z.string().optional(),
	// metadata: z.record(z.string(), z.any()).optional(),  // 추가 메타데이터
})

export type WorkEntryHistory = z.infer<typeof workEntryHistorySchema>

/**
 * Project Member Schema
 * 프로젝트 팀 멤버 관리
 */
export const projectMemberSchema = z.object({
	userId: z.string(),
	userName: z.string(),
	userEmail: z.string().optional(),
	role: z.enum(['owner', 'admin', 'member', 'viewer']).default('member'),
	permissions: z.array(z.string()).default([]),
	joinedAt: dateSchema,
	joinedBy: z.string().optional(),
	isActive: z.boolean().default(true),
})

export type ProjectMember = z.infer<typeof projectMemberSchema>

/**
 * Array Schemas for batch operations
 */
export const workEntriesSchema = z.array(workEntrySchema)
export const projectsSchema = z.array(projectSchema)
export const messagesSchema = z.array(messageSchema)
export const pendingReviewsSchema = z.array(pendingReviewSchema)
export const receivedReviewsSchema = z.array(receivedReviewSchema)
export const departmentsSchema = z.array(departmentSchema)
export const usersSchema = z.array(userSchema)
export const workDraftsSchema = z.array(workDraftSchema)
export const aiTasksSchema = z.array(aiTaskSchema)
export const workEntryHistoriesSchema = z.array(workEntryHistorySchema)
export const projectMembersSchema = z.array(projectMemberSchema)

