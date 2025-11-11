/**
 * Work Input Category Mock Data
 * Comprehensive categories covering all types of work, not just development
 */

export interface WorkCategory {
	id: string
	name: string
	color: string
	description: string
}

export const mockWorkCategories: WorkCategory[] = [
	// Completion & Progress
	{
		id: 'completed-work',
		name: 'Completed Work',
		color: '#10B981', // green
		description: 'Report completed tasks, achievements, and finished projects',
	},
	{
		id: 'progress-update',
		name: 'Progress Update',
		color: '#3B82F6', // blue
		description: 'Share current work status, progress, and intermediate results',
	},

	// Requests (Consolidated)
	{
		id: 'request',
		name: 'Request',
		color: '#F59E0B', // amber
		description: 'Request approval, feedback, review, or help from team members',
	},

	// Issues
	{
		id: 'issue-report',
		name: 'Issue Report',
		color: '#DC2626', // red
		description: 'Report errors, issues, or problems that need resolution',
	},

	// Other (with custom input)
	{
		id: 'other',
		name: 'Other',
		color: '#9CA3AF', // gray
		description: 'Custom category for content that does not fit above categories',
	},
]

/**
 * Work Tags Mock Data
 */
export interface WorkTag {
	id: string
	name: string
	category: string
}

export const mockWorkTags: WorkTag[] = [
	// 우선순위
	{ id: 'urgent', name: '긴급', category: 'completed-work' },
	{ id: 'important', name: '중요', category: 'completed-work' },
	{ id: 'high-priority', name: '높은 우선순위', category: 'progress-update' },
	
	// 업무 분야
	{ id: 'development', name: '개발', category: 'completed-work' },
	{ id: 'design', name: '디자인', category: 'completed-work' },
	{ id: 'marketing', name: '마케팅', category: 'info-sharing' },
	{ id: 'sales', name: '영업', category: 'progress-update' },
	{ id: 'hr', name: '인사', category: 'announcement' },
	{ id: 'finance', name: '재무', category: 'approval-request' },
	
	// 작업 유형
	{ id: 'bug-fix', name: '버그 수정', category: 'completed-work' },
	{ id: 'feature', name: '신규 기능', category: 'progress-update' },
	{ id: 'improvement', name: '개선', category: 'proposal' },
	{ id: 'maintenance', name: '유지보수', category: 'completed-work' },
	
	// 프로젝트 관련
	{ id: 'milestone', name: '마일스톤', category: 'progress-update' },
	{ id: 'deadline', name: '마감', category: 'schedule-update' },
	{ id: 'sprint', name: '스프린트', category: 'planning' },
	{ id: 'roadmap', name: '로드맵', category: 'planning' },
	
	// 협업 관련
	{ id: 'team-work', name: '팀 작업', category: 'collaboration' },
	{ id: 'cross-team', name: '팀간 협업', category: 'collaboration' },
	{ id: 'delegation', name: '위임', category: 'task-assignment' },
	
	// 문서/회의
	{ id: 'meeting-summary', name: '회의 요약', category: 'meeting-notes' },
	{ id: 'action-items', name: '액션 아이템', category: 'meeting-notes' },
	{ id: 'decision', name: '의사결정', category: 'meeting-notes' },
	{ id: 'documentation', name: '문서화', category: 'documentation' },
	{ id: 'guide', name: '가이드', category: 'documentation' },
	
	// 리뷰/피드백
	{ id: 'code-review', name: '코드 리뷰', category: 'review-request' },
	{ id: 'design-review', name: '디자인 리뷰', category: 'review-request' },
	{ id: 'peer-review', name: '동료 리뷰', category: 'feedback-request' },
	
	// 이슈/문제
	{ id: 'blocker', name: '블로커', category: 'issue-report' },
	{ id: 'critical', name: '심각', category: 'issue-report' },
	{ id: 'incident', name: '장애', category: 'issue-report' },
	{ id: 'risk', name: '리스크', category: 'risk-alert' },
	
	// 학습/공유
	{ id: 'learning', name: '학습', category: 'knowledge-sharing' },
	{ id: 'best-practice', name: '모범 사례', category: 'knowledge-sharing' },
	{ id: 'tips', name: '팁', category: 'info-sharing' },
	{ id: 'news', name: '소식', category: 'announcement' },
	
	// 분석/데이터
	{ id: 'data', name: '데이터', category: 'analysis-report' },
	{ id: 'metrics', name: '지표', category: 'analysis-report' },
	{ id: 'insights', name: '인사이트', category: 'analysis-report' },
	{ id: 'report', name: '보고서', category: 'analysis-report' },
]

/**
 * Work Templates Mock Data
 */
export interface WorkTemplate {
	id: string
	title: string
	description: string
	category: string
}

export const mockWorkTemplates: WorkTemplate[] = [
	{
		id: '1',
		title: '업무 완료 보고',
		description: '완료한 작업:\n\n주요 성과:\n- \n\n소요 시간:\n\n특이사항:\n- ',
		category: 'completed-work',
	},
	{
		id: '2',
		title: '진행 상황 업데이트',
		description: '현재 진행 중인 작업:\n\n진척도: ___%\n\n완료된 부분:\n- \n\n남은 작업:\n- \n\n예상 완료일: ',
		category: 'progress-update',
	},
	{
		id: '3',
		title: '승인 요청',
		description: '요청 사항:\n\n배경/이유:\n\n예상 효과:\n\n필요한 리소스:\n\n승인 기한: ',
		category: 'approval-request',
	},
	{
		id: '4',
		title: '피드백 요청',
		description: '검토 대상:\n\n피드백이 필요한 부분:\n- \n\n고려사항:\n- \n\n회신 희망일: ',
		category: 'feedback-request',
	},
	{
		id: '5',
		title: '문제 보고',
		description: '발생한 문제:\n\n발생 시점:\n\n영향 범위:\n\n긴급도: [높음/보통/낮음]\n\n해결 방안 제안:\n- ',
		category: 'issue-report',
	},
	{
		id: '6',
		title: '정보 공유',
		description: '공유 주제:\n\n주요 내용:\n\n참고 자료:\n\n적용 가능한 부분:\n- ',
		category: 'info-sharing',
	},
	{
		id: '7',
		title: '회의록',
		description: '회의 제목:\n\n일시:\n\n참석자:\n\n주요 논의사항:\n- \n\n결정사항:\n- \n\n액션 아이템:\n- [ ] \n- [ ] ',
		category: 'meeting-notes',
	},
	{
		id: '8',
		title: '제안서',
		description: '제안 제목:\n\n제안 배경:\n\n목표:\n\n실행 계획:\n1. \n2. \n\n기대 효과:\n\n필요 지원:\n',
		category: 'proposal',
	},
	{
		id: '9',
		title: '질문',
		description: '질문:\n\n배경/상황:\n\n궁금한 이유:\n\n관련 자료:\n',
		category: 'question',
	},
	{
		id: '10',
		title: '업무 계획',
		description: '기간: \n\n목표:\n\n주요 작업:\n1. \n2. \n3. \n\n마일스톤:\n- \n\n필요 지원:\n',
		category: 'planning',
	},
	{
		id: '11',
		title: '도움 요청',
		description: '도움이 필요한 부분:\n\n현재 상황:\n\n시도한 방법:\n- \n\n원하는 결과:\n',
		category: 'help-request',
	},
	{
		id: '12',
		title: '문서 작성',
		description: '문서 제목:\n\n목적:\n\n대상:\n\n주요 내용:\n- \n\n참고 자료:\n',
		category: 'documentation',
	},
]

/**
 * Initialize mock data to localStorage
 * Automatic update on category structure changes through version control
 */
const WORK_CATEGORIES_VERSION = '5.0' // Consolidated to 5 essential categories

export const initializeMockWorkCategories = (): void => {
	try {
		const currentVersion = localStorage.getItem('workCategoriesVersion')
		
		// 버전이 다르거나 없으면 강제 재초기화
		if (currentVersion !== WORK_CATEGORIES_VERSION) {
			localStorage.setItem('workCategories', JSON.stringify(mockWorkCategories))
			localStorage.setItem('workTags', JSON.stringify(mockWorkTags))
			localStorage.setItem('workTemplates', JSON.stringify(mockWorkTemplates))
			localStorage.setItem('workCategoriesVersion', WORK_CATEGORIES_VERSION)
			
			console.log('✅ Work categories updated to version', WORK_CATEGORIES_VERSION)
			console.log('📝 Consolidated to 5 essential categories with custom "Other" option')
		} else {
			// 버전이 같으면 기존 데이터가 없을 때만 초기화
			const existingCategories = localStorage.getItem('workCategories')
			const existingTags = localStorage.getItem('workTags')
			const existingTemplates = localStorage.getItem('workTemplates')

			if (!existingCategories) {
				localStorage.setItem('workCategories', JSON.stringify(mockWorkCategories))
				console.log('✅ Mock work categories initialized')
			}

			if (!existingTags) {
				localStorage.setItem('workTags', JSON.stringify(mockWorkTags))
				console.log('✅ Mock work tags initialized')
			}

			if (!existingTemplates) {
				localStorage.setItem('workTemplates', JSON.stringify(mockWorkTemplates))
				console.log('✅ Mock work templates initialized')
			}
		}
	} catch (error) {
		console.error('Failed to initialize mock work categories:', error)
	}
}

