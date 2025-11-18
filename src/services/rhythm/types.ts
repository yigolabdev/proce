/**
 * Rhythm Types
 * 
 * 기존 데이터 구조를 리듬 기반으로 해석하기 위한 타입 정의
 */

import type { TaskRecommendation, WorkEntry } from '../../types/common.types'

/**
 * Loop Stage - 작업의 현재 리듬 단계
 */
export type LoopStage = 'today' | 'in-progress' | 'needs-review' | 'completed'

/**
 * Loop Item - 리듬 관점에서의 작업 항목
 * 기존 Task, WorkEntry, Review를 통합한 뷰
 */
export interface LoopItem {
	id: string
	type: 'task' | 'work' | 'review'
	title: string
	description?: string
	
	// 상태
	status: 'pending' | 'in-progress' | 'needs-review' | 'completed'
	priority: 'low' | 'medium' | 'high'
	loopStage: LoopStage
	
	// 시간
	dueDate?: Date
	scheduledFor?: Date
	startedAt?: Date
	completedAt?: Date
	
	// 진행률
	progress?: number
	
	// 관계
	assignedTo?: string
	assignedToName?: string
	projectId?: string
	projectName?: string
	
	// 원본 데이터 참조
	sourceType: 'manual_task' | 'ai_recommendation' | 'work_entry' | 'review'
	sourceId: string
	originalData: TaskRecommendation | WorkEntry | any
}

/**
 * Today Status - 오늘의 루프 상태
 */
export interface TodayStatus {
	// 오늘 해야 할 작업들
	urgent: LoopItem[]      // 긴급 (마감 임박)
	scheduled: LoopItem[]   // 예정됨 (오늘 할당)
	needsReview: LoopItem[] // 검토 필요
	
	// 완료 상태
	completed: LoopItem[]
	isLoopComplete: boolean
	completionPercentage: number
	
	// 통계
	summary: {
		total: number
		urgent: number
		completed: number
		pending: number
	}
}

/**
 * Team Rhythm View - 팀 리듬 뷰 (역할별 다름)
 */
export interface TeamRhythmView {
	role: 'user' | 'admin' | 'executive'
	
	// 작업자: 내 팀원만
	myTeam?: TeamMemberStatus[]
	
	// 관리자: 전체 조직
	allTeams?: DepartmentStatus[]
	projectsRhythm?: ProjectRhythmStatus[]
	upcomingMilestones?: Milestone[]
}

/**
 * Team Member Status
 */
export interface TeamMemberStatus {
	userId: string
	name: string
	department: string
	currentStatus: 'available' | 'busy' | 'completed'
	todayProgress: number
	activeTasksCount: number
}

/**
 * Department Status
 */
export interface DepartmentStatus {
	department: string
	totalMembers: number
	activeMembers: number
	completionRate: number
	avgProgress: number
	urgentCount: number
}

/**
 * Project Rhythm Status
 */
export interface ProjectRhythmStatus {
	projectId: string
	projectName: string
	status: 'planning' | 'active' | 'on-hold' | 'completed'
	progress: number
	activeTasksCount: number
	teamMembersCount: number
	nextMilestone?: string
	health: 'healthy' | 'at-risk' | 'delayed'
}

/**
 * Milestone
 */
export interface Milestone {
	id: string
	title: string
	dueDate: Date
	projectId: string
	projectName: string
	status: 'upcoming' | 'due-soon' | 'overdue'
	daysUntilDue: number
}

/**
 * Optional Next Actions - 선택적 다음 작업
 */
export interface OptionalNextActions {
	nextUp: LoopItem[]       // 다음 예정
	upcoming: LoopItem[]     // 곧 시작될 것
	suggestions: LoopItem[]  // AI 추천
}

