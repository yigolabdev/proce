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
 * 프로젝트 인터페이스
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

