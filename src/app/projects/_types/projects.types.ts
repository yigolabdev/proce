/**
 * 프로젝트 멤버 인터페이스
 */
export interface ProjectMember {
	id: string
	name: string
	email: string
	role: 'leader' | 'member'
	joinedAt: Date
}

/**
 * 프로젝트 상태
 */
export type ProjectStatus = 'planning' | 'active' | 'on-hold' | 'completed'

/**
 * 프로젝트 인터페이스 (AI 메타데이터 포함)
 */
export interface Project {
	id: string
	name: string
	description: string
	department: string
	objectives: string[]
	startDate: Date
	endDate: Date
	status: ProjectStatus
	members: ProjectMember[]
	progress: number
	createdAt: Date
	createdBy: string
	
	// 일정 및 리소스 관리 (선택적)
	schedule?: {
		plannedStartDate: string
		actualStartDate?: string
		plannedEndDate: string
		estimatedEndDate?: string
		milestones?: Array<{
			id: string
			name: string
			plannedDate: string
			completionDate?: string
			status: 'pending' | 'in-progress' | 'completed' | 'delayed'
		}>
	}
	resources?: {
		budget?: number
		actualCost?: number
		teamSize: number
		requiredTeamSize?: number
		currentVelocity?: number
		requiredVelocity?: number
	}
	
	// 리스크 및 AI 분석 (선택적)
	risks?: Array<{
		id: string
		type: 'schedule' | 'resource' | 'technical' | 'external'
		severity: 'low' | 'medium' | 'high' | 'critical'
		description: string
		probability: number  // 0-1
		impact: number  // 0-1
		mitigation?: string
		aiDetected?: boolean
	}>
	aiAnalysis?: {
		healthScore: number  // 0-1
		completionProbability: number  // 0-1
		riskScore: number  // 0-1
		teamWorkload: number  // 0-1
		recommendedActions: string[]
		predictedIssues: string[]
		scheduleVariance?: number  // days
	}
}

/**
 * 프로젝트 생성 요청 데이터
 */
export type CreateProjectData = Omit<Project, 'id' | 'createdAt' | 'progress'>

/**
 * 프로젝트 수정 요청 데이터
 */
export type UpdateProjectData = Partial<Omit<Project, 'id' | 'createdAt'>>

/**
 * 프로젝트 통계
 */
export interface ProjectStats {
	total: number
	active: number
	planning: number
	completed: number
	onHold: number
}

/**
 * 프로젝트 필터
 */
export type ProjectFilter = 'all' | ProjectStatus

