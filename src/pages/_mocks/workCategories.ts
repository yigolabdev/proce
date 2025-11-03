/**
 * Work Input 카테고리 목업 데이터
 * 개발 중심이 아닌 모든 업무 형태를 포괄하는 카테고리
 */

export interface WorkCategory {
	id: string
	name: string
	color: string
	description: string
}

export const mockWorkCategories: WorkCategory[] = [
	// 완료/보고
	{
		id: 'completed-work',
		name: '완료한 업무를 보고합니다',
		color: '#10B981', // green
		description: '내가 완료한 작업, 달성한 성과, 마무리된 프로젝트 등을 공유합니다',
	},
	{
		id: 'progress-update',
		name: '진행 상황을 공유합니다',
		color: '#3B82F6', // blue
		description: '현재 진행 중인 업무의 상태, 진척도, 중간 결과 등을 알립니다',
	},

	// 요청
	{
		id: 'approval-request',
		name: '승인을 요청합니다',
		color: '#F59E0B', // amber
		description: '의사결정, 예산 승인, 계획 검토 등 상위자의 승인이 필요합니다',
	},
	{
		id: 'feedback-request',
		name: '의견을 요청합니다',
		color: '#8B5CF6', // purple
		description: '아이디어, 작업물, 제안서 등에 대한 피드백과 조언을 구합니다',
	},
	{
		id: 'review-request',
		name: '검토를 요청합니다',
		color: '#6366F1', // indigo
		description: '문서, 코드, 디자인 등의 결과물에 대한 리뷰를 요청합니다',
	},
	{
		id: 'help-request',
		name: '도움을 요청합니다',
		color: '#EF4444', // red
		description: '문제 해결, 기술 지원, 업무 협조 등이 필요한 상황입니다',
	},

	// 제안/문제
	{
		id: 'proposal',
		name: '제안을 합니다',
		color: '#A855F7', // purple
		description: '새로운 프로젝트, 개선 방안, 비즈니스 아이디어 등을 제시합니다',
	},
	{
		id: 'issue-report',
		name: '문제를 보고합니다',
		color: '#DC2626', // red
		description: '발생한 오류, 이슈, 장애 상황 등을 알리고 해결을 요청합니다',
	},

	// 정보 공유
	{
		id: 'info-sharing',
		name: '정보를 공유합니다',
		color: '#06B6D4', // cyan
		description: '팀원들이 알아야 할 소식, 자료, 참고 정보 등을 전달합니다',
	},
	{
		id: 'knowledge-sharing',
		name: '지식을 공유합니다',
		color: '#8B5CF6', // violet
		description: '학습한 내용, 노하우, 베스트 프랙티스 등을 나눕니다',
	},

	// 기록/문서화
	{
		id: 'meeting-notes',
		name: '회의 내용을 기록합니다',
		color: '#7C3AED', // violet
		description: '회의록, 논의사항, 결정사항, 액션 아이템 등을 정리합니다',
	},
	{
		id: 'documentation',
		name: '문서를 작성합니다',
		color: '#6366F1', // indigo
		description: '매뉴얼, 가이드, 프로세스 문서 등을 만들어 보관합니다',
	},

	// 질문/계획
	{
		id: 'question',
		name: '질문합니다',
		color: '#14B8A6', // teal
		description: '궁금한 점, 확인이 필요한 사항에 대해 답변을 구합니다',
	},
	{
		id: 'planning',
		name: '계획을 수립합니다',
		color: '#3B82F6', // blue
		description: '앞으로의 일정, 업무 계획, 로드맵 등을 세우고 공유합니다',
	},

	// 기타
	{
		id: 'other',
		name: '기타',
		color: '#9CA3AF', // gray
		description: '위 항목에 해당하지 않는 내용을 입력합니다',
	},
]

/**
 * Work Tags 목업 데이터
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
 * Work Templates 목업 데이터
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
 * 목업 데이터를 localStorage에 초기화하는 함수
 * 버전 관리를 통해 카테고리 구조 변경 시 자동 업데이트
 */
const WORK_CATEGORIES_VERSION = '2.1' // 카테고리 최적화: 15개 핵심 항목 + 이모티콘 제거

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
			console.log('📝 Optimized to 15 core categories (이모티콘 제거, 핵심 항목만 유지)')
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

