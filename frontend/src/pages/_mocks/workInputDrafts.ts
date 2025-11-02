import type { DraftData } from '../InputPage'

/**
 * Work Input 임시 저장 목업 데이터
 */
export const mockDrafts: Omit<DraftData, 'savedAt'>[] = [
	{
		id: '1',
		title: '신규 프로젝트 기획안 작성',
		description: 'Q4 신규 프로젝트에 대한 초기 기획안을 작성 중입니다.\n\n주요 내용:\n- 목표 시장 분석\n- 경쟁사 조사\n- 기술 스택 검토\n- 예상 일정 및 리소스',
		category: 'proposal',
		projectId: '1',
		tags: ['로드맵', '중요', '개발'],
		files: [
			{
				id: 'file1',
				name: '시장분석_초안.pdf',
				size: 2458624,
				type: 'application/pdf',
				url: '#',
			},
			{
				id: 'file2',
				name: '경쟁사_리서치.xlsx',
				size: 1245890,
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				url: '#',
			},
		],
		links: [
			{
				id: 'link1',
				url: 'https://notion.so/project-planning',
				title: 'Notion 기획 문서',
				addedAt: new Date('2024-10-28T14:30:00'),
			},
			{
				id: 'link2',
				url: 'https://figma.com/design/prototype',
				title: 'Figma 프로토타입',
				addedAt: new Date('2024-10-28T15:00:00'),
			},
		],
		isConfidential: true,
	},
	{
		id: '2',
		title: '고객 피드백 분석 보고서',
		description: '10월 한 달간 수집된 고객 피드백을 분석하고 있습니다.\n\n주요 발견사항:\n- NPS 점수 85점 달성\n- 주요 불만사항: 로딩 속도\n- 개선 요청사항: 다크모드 지원\n\n다음 주 월요일까지 완성 예정',
		category: 'analysis-report',
		projectId: '2',
		tags: ['데이터', '인사이트', '보고서'],
		files: [
			{
				id: 'file3',
				name: '고객_피드백_원본데이터.csv',
				size: 3567891,
				type: 'text/csv',
				url: '#',
			},
		],
		links: [
			{
				id: 'link3',
				url: 'https://surveymonkey.com/results',
				title: '설문조사 결과',
				addedAt: new Date('2024-10-29T10:00:00'),
			},
		],
		isConfidential: false,
	},
	{
		id: '3',
		title: 'API 문서화 작업',
		description: '새로운 REST API 엔드포인트에 대한 문서 작성 중입니다.\n\n완료된 부분:\n- Authentication endpoints\n- User management\n\n남은 작업:\n- Payment endpoints\n- Webhook documentation',
		category: 'progress-update',
		tags: ['문서화', '개발', '마일스톤'],
		files: [],
		links: [
			{
				id: 'link4',
				url: 'https://swagger.io/docs',
				title: 'Swagger 문서',
				addedAt: new Date('2024-10-29T16:20:00'),
			},
		],
		isConfidential: false,
	},
	{
		id: '4',
		title: 'Q4 마케팅 캠페인 기획',
		description: 'Black Friday 및 연말 마케팅 캠페인 준비\n\n캠페인 목표:\n- 신규 고객 500명 유치\n- 매출 전월 대비 150% 증가\n\n채널:\n- Google Ads\n- Facebook/Instagram\n- 이메일 마케팅',
		category: 'planning',
		projectId: '1',
		tags: ['마케팅', '중요', '마감'],
		files: [
			{
				id: 'file4',
				name: '캠페인_예산안.xlsx',
				size: 987654,
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				url: '#',
			},
			{
				id: 'file5',
				name: '디자인_시안.png',
				size: 4567890,
				type: 'image/png',
				url: '#',
			},
		],
		links: [],
		isConfidential: true,
	},
	{
		id: '5',
		title: '시스템 성능 개선 작업',
		description: '데이터베이스 쿼리 최적화 및 캐싱 전략 수립\n\n현재 이슈:\n- 일부 쿼리 응답 시간 3초 이상\n- 피크 시간대 서버 부하 증가\n\n계획된 개선:\n- Redis 캐싱 도입\n- 인덱스 최적화\n- 쿼리 리팩토링',
		category: 'completed-work',
		tags: ['개발', '버그 수정', '개선'],
		files: [
			{
				id: 'file6',
				name: '성능_분석_리포트.pdf',
				size: 1876543,
				type: 'application/pdf',
				url: '#',
			},
		],
		links: [
			{
				id: 'link5',
				url: 'https://github.com/project/issues/123',
				title: 'GitHub Issue #123',
				addedAt: new Date('2024-10-30T09:15:00'),
			},
		],
		isConfidential: false,
	},
	{
		id: '6',
		title: '팀 회고 회의록 정리',
		description: '10월 마지막 주 팀 회고 내용 정리\n\nGood:\n- 스프린트 목표 100% 달성\n- 팀 협업 개선\n\nBad:\n- 일부 문서화 미흡\n- 코드 리뷰 지연\n\nAction Items:\n- 문서화 템플릿 만들기\n- 코드 리뷰 시간 고정',
		category: 'meeting-notes',
		tags: ['회의 요약', '액션 아이템', '팀 작업'],
		files: [],
		links: [],
		isConfidential: false,
	},
	{
		id: '7',
		title: 'Untitled Draft',
		description: '새로운 기능에 대한 아이디어를 메모 중...\n\n사용자들이 자주 요청하는 기능:\n1. 일괄 처리 기능\n2. 필터 저장\n3. ',
		category: '',
		tags: [],
		files: [],
		links: [],
		isConfidential: false,
	},
]

/**
 * 목업 drafts를 localStorage에 초기화하는 함수
 * 버전 관리를 통해 카테고리 구조 변경 시 자동 업데이트
 */
const WORK_DRAFTS_VERSION = '2.1' // 카테고리 최적화에 맞춰 임시 저장 데이터도 업데이트

export const initializeMockDrafts = (): void => {
	try {
		const currentVersion = localStorage.getItem('workDraftsVersion')
		
		// 버전이 다르거나 없으면 강제 재초기화 (새 카테고리 ID 적용)
		if (currentVersion !== WORK_DRAFTS_VERSION) {
			const draftsWithDates = mockDrafts.map((draft, index) => ({
				...draft,
				savedAt: new Date(Date.now() - (index * 3600000)), // 1시간씩 차이나게
			}))
			localStorage.setItem('workInputDrafts', JSON.stringify(draftsWithDates))
			localStorage.setItem('workDraftsVersion', WORK_DRAFTS_VERSION)
			console.log('✅ Work input drafts updated to version', WORK_DRAFTS_VERSION)
		} else {
			// 버전이 같으면 기존 데이터가 없을 때만 초기화
			const existing = localStorage.getItem('workInputDrafts')
			if (!existing) {
				const draftsWithDates = mockDrafts.map((draft, index) => ({
					...draft,
					savedAt: new Date(Date.now() - (index * 3600000)), // 1시간씩 차이나게
				}))
				localStorage.setItem('workInputDrafts', JSON.stringify(draftsWithDates))
				console.log('✅ Mock work input drafts initialized')
			}
		}
	} catch (error) {
		console.error('Failed to initialize mock drafts:', error)
	}
}

