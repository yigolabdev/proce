/**
 * Work Input Types
 * InputPage 관련 타입 정의
 */

import type { LinkResource, Project, WorkCategory } from './common.types'

// Export FileAttachment
export interface FileAttachment {
	id: string
	name: string
	size: number
	type: string
	uploadedAt: Date
	url?: string
	data?: string // Base64 data
}

// Export AIDraft
export interface AIDraft {
	prompt?: string
	content: string
	tone: 'professional' | 'casual' | 'detailed' | 'concise'
	keywords?: string[]
	generatedContent?: {
		title: string
		description: string
		category: string
		tags: string[]
	}
}

// Export TaskProgress
export interface TaskProgress {
	totalItems: number
	completedItems: number
	milestone: string
	nextSteps: string
	blockers: string
}

/**
 * 입력 모드
 */
export type InputMode = 'free' | 'task' | 'ai-draft'

/**
 * 업무 입력 폼 데이터
 */
export interface WorkInputFormData {
	title: string
	description: string
	category: string
	customCategory: string
	projectId: string
	tags: string[]
	comment: string
	files: FileAttachment[]
	links: LinkResource[]
	isConfidential: boolean
	reviewerId?: string
}

/**
 * 태스크 진행 상황
 */
export interface TaskProgressData {
	taskId: string
	progress: number // 0-100
	comment: string
}

/**
 * AI 초안 상태
 */
export interface AIDraftState {
	input: string
	isProcessing: boolean
	generatedContent?: {
		title: string
		description: string
		category: string
		tags: string[]
	}
}

/**
 * NoMeet (비동기 논의) 데이터
 */
export interface AsyncDiscussionData {
	agenda: string
	briefing: string
	decisionStatus: 'pending' | 'approved' | 'escalated'
}

/**
 * 자동 저장 상태
 */
export type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error'

/**
 * 업무 초안
 */
export interface WorkDraft {
	id: string
	title: string
	description: string
	category: string
	projectId: string
	tags: string[]
	savedAt: Date
	userId: string
}

/**
 * 할당된 태스크
 */
export interface AssignedTask {
	id: string
	title: string
	description: string
	projectId: string
	projectName: string
	assignedBy: string
	assignedAt: Date
	dueDate?: Date
	priority: 'low' | 'medium' | 'high' | 'urgent'
	status: 'pending' | 'in_progress' | 'completed'
	progress: number // 0-100
}

/**
 * 검토자 정보
 */
export interface Reviewer {
	id: string
	name: string
	department: string
	position: string
	email: string
}

/**
 * 파일 업로드 옵션
 */
export interface FileUploadOptions {
	maxSize: number // bytes
	maxFiles: number
	acceptedTypes: string[]
}

/**
 * 입력 페이지 Props (컴포넌트용)
 */
export interface InputModeSelectorProps {
	mode: InputMode
	onModeChange: (mode: InputMode) => void
	disabled?: boolean
}

export interface WorkInputFormProps {
	formData: WorkInputFormData
	onChange: (data: Partial<WorkInputFormData>) => void
	onSubmit: (e: React.FormEvent) => Promise<void>
	projects: Project[]
	categories: WorkCategory[]
	reviewers: Reviewer[]
	disabled?: boolean
	children?: React.ReactNode
}

export interface FileUploadZoneProps {
	files: FileAttachment[]
	onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
	onFileDrop: (e: React.DragEvent) => void
	onFileRemove: (id: string) => void
	options?: FileUploadOptions
	disabled?: boolean
}

export interface TagInputProps {
	tags: string[]
	onAddTag: (tag: string) => void
	onRemoveTag: (tag: string) => void
	suggestions?: string[]
	disabled?: boolean
}

export interface LinkInputProps {
	links: LinkResource[]
	onAddLink: (link: LinkResource) => void
	onRemoveLink: (id: string) => void
	disabled?: boolean
}

export interface ReviewerSelectorProps {
	reviewers: Reviewer[]
	selectedReviewer: string
	onReviewerSelect: (reviewerId: string) => void
	disabled?: boolean
}

export interface TaskProgressInputProps {
	tasks: AssignedTask[]
	selectedTask: string
	progress: number
	comment: string
	onTaskSelect: (taskId: string) => void
	onProgressChange: (progress: number) => void
	onCommentChange: (comment: string) => void
	onSubmit: () => Promise<void>
	disabled?: boolean
}

export interface AIDraftPanelProps {
	input: string
	isProcessing: boolean
	generatedContent?: AIDraftState['generatedContent']
	onInputChange: (input: string) => void
	onGenerate: () => Promise<void>
	onApply: (content: AIDraftState['generatedContent']) => void
	onReset: () => void
	disabled?: boolean
}

/**
 * 업무 입력 훅 반환 타입
 */
export interface UseWorkInputReturn {
	// Form State
	formData: WorkInputFormData
	setFormData: (data: Partial<WorkInputFormData>) => void
	resetForm: () => void
	
	// Mode
	mode: InputMode
	setMode: (mode: InputMode) => void
	
	// Projects & Categories
	projects: Project[]
	categories: WorkCategory[]
	reviewers: Reviewer[]
	
	// Actions
	handleSubmit: (e: React.FormEvent) => Promise<void>
	saveDraft: () => void
	loadDraft: (draft: WorkDraft) => void
	
	// Status
	isSubmitting: boolean
	autoSaveStatus: AutoSaveStatus
}

/**
 * 파일 업로드 훅 반환 타입
 */
export interface UseFileUploadReturn {
	files: FileAttachment[]
	handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
	handleFileDrop: (e: React.DragEvent) => void
	removeFile: (id: string) => void
	clearFiles: () => void
	isUploading: boolean
}

/**
 * 태그 관리 훅 반환 타입
 */
export interface UseTagsReturn {
	tags: string[]
	tagInput: string
	setTagInput: (input: string) => void
	addTag: (tag: string) => void
	removeTag: (tag: string) => void
	clearTags: () => void
	suggestions: string[]
}

/**
 * 링크 관리 훅 반환 타입
 */
export interface UseLinksReturn {
	links: LinkResource[]
	linkInput: string
	setLinkInput: (input: string) => void
	addLink: (url: string) => void
	removeLink: (id: string) => void
	clearLinks: () => void
}

/**
 * AI 초안 훅 반환 타입
 */
export interface UseAIDraftReturn {
	input: string
	setInput: (input: string) => void
	isProcessing: boolean
	generatedContent?: AIDraftState['generatedContent']
	generateDraft: (input: string) => Promise<void>
	applyDraft: (content: AIDraftState['generatedContent']) => void
	reset: () => void
}

/**
 * 태스크 진행 훅 반환 타입
 */
export interface UseTaskProgressReturn {
	tasks: AssignedTask[]
	selectedTask: string
	setSelectedTask: (taskId: string) => void
	progress: number
	setProgress: (progress: number) => void
	comment: string
	setComment: (comment: string) => void
	submitProgress: () => Promise<void>
	isSubmitting: boolean
}

