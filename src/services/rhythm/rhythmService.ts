/**
 * Rhythm Service
 * 
 * 기존 데이터(tasks, workEntries, reviews)를 리듬 기반으로 해석하는 서비스
 * localStorage 데이터를 그대로 사용하되, 리듬 관점으로 재구성
 */

import { storage } from '../../utils/storage'
import type { TaskRecommendation, WorkEntry } from '../../types/common.types'
import type { 
	LoopItem, 
	TodayStatus, 
	TeamRhythmView,
	TeamMemberStatus,
	OptionalNextActions,
	LoopStage
} from './types'

class RhythmService {
	/**
	 * 목업 데이터 초기화 (데이터가 없을 때만)
	 */
	private initializeMockData() {
		const manualTasks = storage.get<TaskRecommendation[]>('manual_tasks') || []
		const aiTasks = storage.get<TaskRecommendation[]>('ai_recommendations') || []
		const reviews = storage.get<any[]>('received_reviews') || []
		const workEntries = storage.get<WorkEntry[]>('workEntries') || []
		
		// 데이터가 하나라도 있으면 초기화하지 않음
		if (manualTasks.length > 0 || aiTasks.length > 0 || reviews.length > 0 || workEntries.length > 0) {
			return
		}
		
		// Mock AI Recommendations
		const mockAITasks: TaskRecommendation[] = [
			{
				id: 'ai-task-1',
				title: '[긴급] 프로덕트 버그 수정',
				description: '사용자 로그인 시 발생하는 세션 관리 버그를 수정해야 합니다. 고객 불만이 증가하고 있어 긴급히 처리가 필요합니다.',
				category: 'Bug Fix',
				priority: 'high',
				deadline: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4시간 후
				estimatedDuration: 180,
				source: 'ai',
				status: 'pending',
				isManual: false,
				aiReason: '최근 사용자 피드백 분석 결과 높은 우선순위로 분류됨',
				projectId: 'project-1',
				projectName: 'Proce Platform',
				assignedTo: 'user-1',
				assignedToName: '김철수',
				suggestedBy: 'AI Assistant',
				createdAt: new Date().toISOString(),
			},
			{
				id: 'ai-task-2',
				title: 'Dashboard UI 개선',
				description: 'Dashboard 페이지의 로딩 속도를 개선하고, 데이터 시각화를 보다 직관적으로 변경합니다.',
				category: 'Feature',
				priority: 'medium',
				deadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 2일 후
				estimatedDuration: 240,
				source: 'ai',
				status: 'accepted',
				isManual: false,
				aiReason: 'UX 개선 제안',
				projectId: 'project-1',
				projectName: 'Proce Platform',
				assignedTo: 'user-1',
				assignedToName: '김철수',
				suggestedBy: 'AI Assistant',
				createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1일 전
				acceptedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12시간 전
			},
			{
				id: 'ai-task-3',
				title: 'API 문서화 작업',
				description: '새로 추가된 API 엔드포인트에 대한 문서를 작성하고 Swagger를 업데이트합니다.',
				category: 'Documentation',
				priority: 'low',
				deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1주일 후
				estimatedDuration: 120,
				source: 'ai',
				status: 'pending',
				isManual: false,
				aiReason: '최근 API 변경 사항 감지',
				projectId: 'project-2',
				projectName: 'API Modernization',
				assignedTo: 'user-1',
				assignedToName: '김철수',
				suggestedBy: 'AI Assistant',
				createdAt: new Date().toISOString(),
			},
			{
				id: 'ai-task-4',
				title: '데이터베이스 마이그레이션',
				description: '새로운 스키마로 데이터베이스를 마이그레이션하고 기존 데이터를 이전합니다.',
				category: 'Backend',
				priority: 'high',
				deadline: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2시간 전 (완료)
				estimatedDuration: 300,
				source: 'ai',
				status: 'completed',
				isManual: false,
				aiReason: '스키마 변경 감지',
				projectId: 'project-2',
				projectName: 'API Modernization',
				assignedTo: 'user-1',
				assignedToName: '김철수',
				suggestedBy: 'AI Assistant',
				createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
				acceptedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
				completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
			},
			{
				id: 'ai-task-5',
				title: '보안 패치 적용',
				description: '최신 보안 취약점을 패치하고 의존성 패키지를 업데이트합니다.',
				category: 'Security',
				priority: 'medium',
				deadline: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
				estimatedDuration: 120,
				source: 'ai',
				status: 'completed',
				isManual: false,
				aiReason: '보안 스캔 결과',
				projectId: 'project-1',
				projectName: 'Proce Platform',
				assignedTo: 'user-1',
				assignedToName: '김철수',
				suggestedBy: 'AI Assistant',
				createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
				acceptedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
				completedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
			},
		]
		
		// Mock Manual Tasks
		const mockManualTasks: TaskRecommendation[] = [
			{
				id: 'manual-task-1',
				title: '[오늘 마감] 월간 보고서 작성',
				description: '이번 달 프로젝트 진행 상황과 성과를 정리하여 경영진에게 보고할 월간 보고서를 작성합니다.',
				category: 'Report',
				priority: 'high',
				deadline: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8시간 후
				estimatedDuration: 120,
				source: 'manual',
				status: 'pending',
				isManual: true,
				projectId: 'project-3',
				projectName: 'Management Reports',
				assignedTo: 'user-1',
				assignedToName: '김철수',
				suggestedBy: '박영희 (팀 리더)',
				createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2일 전
			},
			{
				id: 'manual-task-2',
				title: '팀 회의 준비',
				description: '내일 오전 10시 팀 회의를 위한 안건을 준비하고 자료를 정리합니다.',
				category: 'Meeting',
				priority: 'medium',
				deadline: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(), // 20시간 후
				estimatedDuration: 60,
				source: 'manual',
				status: 'accepted',
				isManual: true,
				projectId: 'project-1',
				projectName: 'Proce Platform',
				assignedTo: 'user-1',
				assignedToName: '김철수',
				suggestedBy: '김철수 (본인)',
				createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
				acceptedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
			},
		]
		
		// Mock Received Reviews
		const mockReviews = [
			{
				id: 'review-1',
				workEntryId: 'work-1',
				workTitle: 'User Authentication Flow 개선',
				workDescription: '로그인/회원가입 플로우를 개선하고 보안을 강화했습니다.',
				projectId: 'project-1',
				projectName: 'Proce Platform',
				reviewType: 'approved',
				comment: '코드 품질이 우수하고 보안 요구사항을 잘 충족했습니다. 승인합니다! 👍',
				reviewedBy: '박영희',
				reviewedByName: '박영희',
				reviewedByRole: '시니어 개발자',
				reviewedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
				isRead: false,
			},
			{
				id: 'review-2',
				workEntryId: 'work-2',
				workTitle: 'Dashboard 성능 최적화',
				workDescription: 'React.memo와 useMemo를 활용한 리렌더링 최적화',
				projectId: 'project-1',
				projectName: 'Proce Platform',
				reviewType: 'rejected',
				comment: '좋은 시도지만 일부 컴포넌트에서 메모리 누수가 발생할 수 있습니다. useEffect 정리 함수를 추가해주세요.',
				reviewedBy: '이민수',
				reviewedByName: '이민수',
				reviewedByRole: '테크 리드',
				reviewedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
				isRead: false,
			},
			{
				id: 'review-3',
				workEntryId: 'work-3',
				workTitle: 'API 에러 핸들링 개선',
				workDescription: '통일된 에러 처리 로직과 사용자 친화적인 에러 메시지 구현',
				projectId: 'project-2',
				projectName: 'API Modernization',
				reviewType: 'approved',
				comment: '에러 처리가 매우 체계적입니다. 사용자 경험도 크게 개선되었네요!',
				reviewedBy: '최지영',
				reviewedByName: '최지영',
				reviewedByRole: '백엔드 개발자',
				reviewedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
				isRead: false,
			},
		]
		
		// Mock Completed Work Entries
		const mockWorkEntries: WorkEntry[] = [
			{
				id: 'work-1',
				title: 'User Authentication Flow 개선',
				description: '로그인/회원가입 플로우를 개선하고 보안을 강화했습니다.',
				date: new Date(Date.now() - 3 * 60 * 60 * 1000),
				category: 'Development',
				tags: ['Frontend', 'Security', 'Authentication'],
				duration: '240',
				projectId: 'project-1',
				submittedBy: '김철수',
				status: 'approved',
			},
			{
				id: 'work-2',
				title: 'Dashboard 성능 최적화',
				description: 'React.memo와 useMemo를 활용한 리렌더링 최적화',
				date: new Date(Date.now() - 6 * 60 * 60 * 1000),
				category: 'Development',
				tags: ['Frontend', 'Performance', 'React'],
				duration: '180',
				projectId: 'project-1',
				submittedBy: '김철수',
				status: 'rejected',
			},
			{
				id: 'work-3',
				title: 'API 에러 핸들링 개선',
				description: '통일된 에러 처리 로직과 사용자 친화적인 에러 메시지 구현',
				date: new Date(Date.now() - 25 * 60 * 60 * 1000),
				category: 'Development',
				tags: ['Backend', 'API', 'Error Handling'],
				duration: '150',
				projectId: 'project-2',
				submittedBy: '김철수',
				status: 'approved',
			},
		]
		
		// Mock Team Members / Users
		const existingUsers = storage.get<any[]>('users') || []
		if (existingUsers.length === 0) {
			const mockUsers = [
				{
					id: 'user-1',
					name: '김철수',
					email: 'kim@proce.com',
					role: 'user',
					department: '개발팀',
					position: '시니어 개발자',
				},
				{
					id: 'user-2',
					name: '박영희',
					email: 'park@proce.com',
					role: 'user',
					department: '개발팀',
					position: '팀 리더',
				},
				{
					id: 'user-3',
					name: '이민수',
					email: 'lee@proce.com',
					role: 'user',
					department: '개발팀',
					position: '테크 리드',
				},
				{
					id: 'user-4',
					name: '최지영',
					email: 'choi@proce.com',
					role: 'user',
					department: '개발팀',
					position: '백엔드 개발자',
				},
				{
					id: 'user-5',
					name: '정수진',
					email: 'jung@proce.com',
					role: 'user',
					department: '디자인팀',
					position: 'UI/UX 디자이너',
				},
			]
			storage.set('users', mockUsers)
		}
		
		// 목업 데이터 저장
		storage.set('ai_recommendations', mockAITasks)
		storage.set('manual_tasks', mockManualTasks)
		storage.set('received_reviews', mockReviews)
		storage.set('workEntries', mockWorkEntries)
		
		if (import.meta.env.DEV) {
			console.log('[RhythmService] Mock data initialized')
		}
	}
	
	/**
	 * 기존 Task를 LoopItem으로 변환
	 */
	private taskToLoopItem(task: TaskRecommendation): LoopItem {
		// 마감일 기반 우선순위 계산
		const now = new Date()
		const dueDate = task.deadline ? new Date(task.deadline) : undefined
		const hoursUntilDue = dueDate ? (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60) : null
		
		// Loop Stage 결정
		let loopStage: LoopStage = 'today'
		if (task.status === 'completed') {
			loopStage = 'completed'
		} else if (task.status === 'accepted') {
			loopStage = 'in-progress'
		} else if (hoursUntilDue && hoursUntilDue <= 24) {
			loopStage = 'today'
		}
		
		return {
			id: task.id,
			type: 'task',
			title: task.title,
			description: task.description,
			status: task.status === 'completed' ? 'completed' : 
			        task.status === 'accepted' ? 'in-progress' : 'pending',
			priority: task.priority,
			loopStage,
			dueDate,
			scheduledFor: dueDate,
			assignedTo: task.assignedTo,
			assignedToName: task.assignedToName,
			projectId: task.projectId,
			projectName: task.projectName,
			sourceType: task.source === 'ai' ? 'ai_recommendation' : 'manual_task',
			sourceId: task.id,
			originalData: task,
		}
	}
	
	
	/**
	 * Today 상태 계산
	 */
	async getTodayStatus(userId: string): Promise<TodayStatus> {
		// 목업 데이터 초기화 (데이터가 없을 때만)
		this.initializeMockData()
		
		// 기존 데이터 로드
		const manualTasks = storage.get<TaskRecommendation[]>('manual_tasks') || []
		const aiTasks = storage.get<TaskRecommendation[]>('ai_recommendations') || []
		const allTasks = [...manualTasks, ...aiTasks]
		
		// 내 작업만 필터링
		const myTasks = allTasks.filter(task => 
			task.assignedTo === userId || !task.assignedTo
		)
		
		// LoopItem으로 변환
		const loopItems = myTasks.map(task => this.taskToLoopItem(task))
		
		// 오늘 기준 필터링
		const now = new Date()
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
		const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
		
		// 긴급 (마감 6시간 이내, 또는 high priority)
		const urgent = loopItems.filter(item => {
			if (item.status === 'completed') return false
			if (item.priority === 'high') return true
			if (item.dueDate) {
				const hoursUntil = (item.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60)
				return hoursUntil > 0 && hoursUntil <= 6
			}
			return false
		})
		
		// 오늘 예정 (마감이 오늘인 것)
		const scheduled = loopItems.filter(item => {
			if (item.status === 'completed') return false
			if (urgent.some(u => u.id === item.id)) return false
			if (item.dueDate) {
				return item.dueDate >= today && item.dueDate < tomorrow
			}
			return false
		})
		
		// 검토 필요 (내가 받은 리뷰)
		const reviews = storage.get<any[]>('received_reviews') || []
		const myReviews = reviews.filter(r => !r.isRead)
		const needsReview = myReviews.map(review => ({
			id: review.id,
			type: 'review' as const,
			title: review.workTitle,
			description: review.comment,
			status: 'needs-review' as const,
			priority: 'medium' as const,
			loopStage: 'needs-review' as const,
			projectName: review.projectName,
			sourceType: 'review' as const,
			sourceId: review.id,
			originalData: review,
		}))
		
		// 완료됨 (오늘 완료한 것)
		const completed = loopItems.filter(item => {
			if (item.status !== 'completed') return false
			if (item.completedAt) {
				return item.completedAt >= today && item.completedAt < tomorrow
			}
			return false
		})
		
		// 통계
		const total = urgent.length + scheduled.length + needsReview.length
		const completedCount = completed.length
		const pending = urgent.length + scheduled.length
		
		// 루프 완료 여부 (긴급 + 예정 모두 완료)
		const isLoopComplete = total === 0 || (urgent.length === 0 && scheduled.length === 0)
		const completionPercentage = total === 0 ? 100 : Math.round((completedCount / total) * 100)
		
		return {
			urgent,
			scheduled,
			needsReview,
			completed,
			isLoopComplete,
			completionPercentage,
			summary: {
				total,
				urgent: urgent.length,
				completed: completedCount,
				pending,
			},
		}
	}
	
	/**
	 * In Progress 항목 가져오기
	 */
	async getInProgress(userId: string): Promise<LoopItem[]> {
		const manualTasks = storage.get<TaskRecommendation[]>('manual_tasks') || []
		const aiTasks = storage.get<TaskRecommendation[]>('ai_recommendations') || []
		const allTasks = [...manualTasks, ...aiTasks]
		
		const myTasks = allTasks.filter(task => 
			task.assignedTo === userId && task.status === 'accepted'
		)
		
		return myTasks.map(task => this.taskToLoopItem(task))
	}
	
	/**
	 * Needs Review 항목 가져오기
	 */
	async getNeedsReview(_userId: string): Promise<LoopItem[]> {
		const reviews = storage.get<any[]>('received_reviews') || []
		// TODO: userId로 필터링 필요 시 추가
		const myReviews = reviews.filter(r => !r.isRead)
		
		return myReviews.map(review => ({
			id: review.id,
			type: 'review' as const,
			title: review.workTitle,
			description: review.comment,
			status: 'needs-review' as const,
			priority: review.reviewType === 'rejected' ? 'high' as const : 'medium' as const,
			loopStage: 'needs-review' as const,
			projectName: review.projectName,
			sourceType: 'review' as const,
			sourceId: review.id,
			originalData: review,
		}))
	}
	
	/**
	 * Completed 항목 가져오기 (오늘 완료한 것)
	 */
	async getCompleted(userId: string, _date?: Date): Promise<LoopItem[]> {
		const manualTasks = storage.get<TaskRecommendation[]>('manual_tasks') || []
		const aiTasks = storage.get<TaskRecommendation[]>('ai_recommendations') || []
		const allTasks = [...manualTasks, ...aiTasks]
		
		const completedTasks = allTasks.filter(task => 
			task.assignedTo === userId && task.status === 'completed'
		)
		
		return completedTasks.map(task => this.taskToLoopItem(task))
	}
	
	/**
	 * Team Rhythm 가져오기 (역할별 다름)
	 */
	async getTeamRhythm(userId: string, role: 'user' | 'admin' | 'executive'): Promise<TeamRhythmView> {
		if (role === 'user') {
			// 작업자: 내 팀원들만
			const users = storage.get<any[]>('users') || []
			const me = users.find(u => u.id === userId)
			const myDepartment = me?.department
			
			const teamMembers = users
				.filter(u => u.department === myDepartment && u.id !== userId)
				.slice(0, 5) // 최대 5명만
			
			// 모든 작업 데이터 로드
			const manualTasks = storage.get<TaskRecommendation[]>('manual_tasks') || []
			const aiTasks = storage.get<TaskRecommendation[]>('ai_recommendations') || []
			const allTasks = [...manualTasks, ...aiTasks]
			
			const myTeam: TeamMemberStatus[] = teamMembers.map(member => {
				// 각 팀원의 작업 계산
				const memberTasks = allTasks.filter(t => t.assignedTo === member.id)
				const activeTasksCount = memberTasks.filter(t => t.status === 'accepted').length
				const completedToday = memberTasks.filter(t => {
					if (t.status !== 'completed' || !t.completedAt) return false
					const completedDate = new Date(t.completedAt)
					const today = new Date()
					return completedDate.toDateString() === today.toDateString()
				}).length
				
				const totalTasks = memberTasks.filter(t => {
					if (!t.deadline) return false
					const today = new Date()
					const deadline = new Date(t.deadline)
					return deadline.toDateString() === today.toDateString()
				}).length
				
				// 진행률 계산
				const todayProgress = totalTasks > 0 ? Math.round((completedToday / totalTasks) * 100) : 0
				
				// 상태 결정
				let currentStatus: 'available' | 'busy' | 'completed' = 'available'
				if (totalTasks > 0 && completedToday >= totalTasks) {
					currentStatus = 'completed'
				} else if (activeTasksCount > 0) {
					currentStatus = 'busy'
				}
				
				return {
					userId: member.id,
					name: member.name,
					department: member.department,
					currentStatus,
					todayProgress,
					activeTasksCount,
				}
			})
			
			return {
				role: 'user',
				myTeam,
			}
		} else {
			// 관리자: 전체 조직 (TODO: 구현)
			return {
				role,
				allTeams: [],
				projectsRhythm: [],
				upcomingMilestones: [],
			}
		}
	}
	
	/**
	 * 선택적 다음 작업 (사용자가 요청한 경우에만)
	 */
	async getOptionalNextActions(userId: string): Promise<OptionalNextActions> {
		const manualTasks = storage.get<TaskRecommendation[]>('manual_tasks') || []
		const aiTasks = storage.get<TaskRecommendation[]>('ai_recommendations') || []
		const allTasks = [...manualTasks, ...aiTasks]
		
		const myTasks = allTasks.filter(task => 
			task.assignedTo === userId && task.status === 'pending'
		)
		
		const loopItems = myTasks.map(task => this.taskToLoopItem(task))
		
		// 다음 예정 (마감일 기준 정렬)
		const nextUp = loopItems
			.filter(item => item.dueDate)
			.sort((a, b) => a.dueDate!.getTime() - b.dueDate!.getTime())
			.slice(0, 5)
		
		// 곧 시작될 것 (우선순위 높은 것)
		const upcoming = loopItems
			.filter(item => item.priority === 'high')
			.slice(0, 5)
		
		return {
			nextUp,
			upcoming,
			suggestions: [], // AI 추천은 나중에
		}
	}
}

export const rhythmService = new RhythmService()

