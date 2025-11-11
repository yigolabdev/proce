import type { Project } from '../_types/projects.types'

/**
 * 프로젝트 목업 데이터
 */
export const mockProjects: Project[] = [
	{
		id: '1',
		name: 'AI 챗봇 서비스 개발',
		description: '고객 상담을 자동화하기 위한 AI 챗봇 서비스를 개발합니다. 자연어 처리와 머신러닝을 활용하여 고객 문의에 즉각 응답하는 시스템을 구축합니다.',
		departments: ['Engineering'],
		objectives: [
			'자연어 처리 모델 개발 및 학습',
			'챗봇 UI/UX 디자인 및 구현',
			'기존 고객 상담 시스템과 연동',
			'베타 테스트 및 피드백 반영',
		],
		startDate: new Date('2024-01-15'),
		endDate: new Date('2024-06-30'),
		status: 'active',
		members: [
			{
				id: 'm1',
				name: '김민수',
				email: 'minsu.kim@proce.com',
				role: 'leader',
				department: 'Engineering',
				joinedAt: new Date('2024-01-15'),
			},
			{
				id: 'm2',
				name: '이지은',
				email: 'jieun.lee@proce.com',
				role: 'member',
				department: 'Engineering',
				joinedAt: new Date('2024-01-15'),
			},
			{
				id: 'm3',
				name: '박준호',
				email: 'junho.park@proce.com',
				role: 'member',
				department: 'Engineering',
				joinedAt: new Date('2024-01-20'),
			},
			{
				id: 'm4',
				name: '최수진',
				email: 'sujin.choi@proce.com',
				role: 'member',
				department: 'Engineering',
				joinedAt: new Date('2024-01-25'),
			},
		],
		progress: 65,
		createdAt: new Date('2024-01-10'),
		createdBy: '김민수',
		schedule: {
			plannedStartDate: '2024-01-15',
			actualStartDate: '2024-01-15',
			plannedEndDate: '2024-06-30',
			estimatedEndDate: '2024-06-30',
			milestones: [
				{
					id: 'ms1-1',
					name: 'NLP 모델 학습 완료',
					plannedDate: '2024-03-15',
					status: 'completed',
					completionDate: '2024-03-12',
				},
				{
					id: 'ms1-2',
					name: 'UI/UX 디자인 완료',
					plannedDate: '2024-04-30',
					status: 'in-progress',
				},
				{
					id: 'ms1-3',
					name: '베타 테스트 시작',
					plannedDate: '2024-06-01',
					status: 'pending',
				},
			],
		},
	},
	{
		id: '2',
		name: '모바일 앱 리뉴얼',
		description: '사용자 경험 개선을 위한 모바일 앱 전면 리뉴얼 프로젝트입니다. 최신 디자인 트렌드를 반영하고 성능을 최적화합니다.',
		departments: ['Product'],
		objectives: [
			'사용자 리서치 및 페르소나 정의',
			'새로운 디자인 시스템 구축',
			'앱 성능 최적화 (로딩 시간 50% 단축)',
			'접근성 개선 (WCAG 2.1 준수)',
		],
		startDate: new Date('2024-02-01'),
		endDate: new Date('2024-08-31'),
		status: 'active',
		members: [
			{
				id: 'm5',
				name: '정현우',
				email: 'hyunwoo.jung@proce.com',
				role: 'leader',
				department: 'Product',
				joinedAt: new Date('2024-02-01'),
			},
			{
				id: 'm6',
				name: '강서연',
				email: 'seoyeon.kang@proce.com',
				role: 'member',
				department: 'Product',
				joinedAt: new Date('2024-02-01'),
			},
			{
				id: 'm7',
				name: '윤태영',
				email: 'taeyoung.yoon@proce.com',
				role: 'member',
				department: 'Product',
				joinedAt: new Date('2024-02-05'),
			},
		],
		progress: 42,
		createdAt: new Date('2024-01-25'),
		createdBy: '정현우',
		schedule: {
			plannedStartDate: '2024-02-01',
			actualStartDate: '2024-02-01',
			plannedEndDate: '2024-08-31',
			milestones: [
				{
					id: 'ms2-1',
					name: '사용자 리서치 완료',
					plannedDate: '2024-03-15',
					status: 'completed',
					completionDate: '2024-03-10',
				},
				{
					id: 'ms2-2',
					name: '디자인 시스템 구축',
					plannedDate: '2024-05-31',
					status: 'in-progress',
				},
				{
					id: 'ms2-3',
					name: '앱 베타 출시',
					plannedDate: '2024-08-01',
					status: 'pending',
				},
			],
		},
	},
	{
		id: '3',
		name: '데이터 분석 플랫폼 구축',
		description: '비즈니스 인텔리전스를 위한 통합 데이터 분석 플랫폼을 구축합니다. 실시간 데이터 시각화 및 리포팅 기능을 제공합니다.',
		departments: ['Data'],
		objectives: [
			'데이터 파이프라인 설계 및 구축',
			'실시간 대시보드 개발',
			'예측 분석 모델 적용',
			'권한 관리 시스템 구현',
		],
		startDate: new Date('2024-03-01'),
		endDate: new Date('2024-12-31'),
		status: 'planning',
		members: [
			{
				id: 'm8',
				name: '송민재',
				email: 'minjae.song@proce.com',
				role: 'leader',
				department: 'Data',
				joinedAt: new Date('2024-03-01'),
			},
			{
				id: 'm9',
				name: '한지우',
				email: 'jiwoo.han@proce.com',
				role: 'member',
				department: 'Data',
				joinedAt: new Date('2024-03-01'),
			},
			{
				id: 'm10',
				name: '오승훈',
				email: 'seunghoon.oh@proce.com',
				role: 'member',
				department: 'Data',
				joinedAt: new Date('2024-03-05'),
			},
			{
				id: 'm11',
				name: '임다은',
				email: 'daeun.lim@proce.com',
				role: 'member',
				department: 'Data',
				joinedAt: new Date('2024-03-05'),
			},
			{
				id: 'm12',
				name: '서준영',
				email: 'junyoung.seo@proce.com',
				role: 'member',
				department: 'Data',
				joinedAt: new Date('2024-03-10'),
			},
		],
		progress: 15,
		createdAt: new Date('2024-02-20'),
		createdBy: '송민재',
		schedule: {
			plannedStartDate: '2024-03-01',
			actualStartDate: '2024-03-01',
			plannedEndDate: '2024-12-31',
			milestones: [
				{
					id: 'ms3-1',
					name: '데이터 파이프라인 완료',
					plannedDate: '2024-05-31',
					status: 'in-progress',
				},
				{
					id: 'ms3-2',
					name: '대시보드 v1 출시',
					plannedDate: '2024-08-31',
					status: 'pending',
				},
				{
					id: 'ms3-3',
					name: '예측 분석 모델 적용',
					plannedDate: '2024-11-30',
					status: 'pending',
				},
			],
		},
	},
	{
		id: '4',
		name: 'API 문서화 시스템',
		description: '개발자 경험 향상을 위한 인터랙티브 API 문서화 시스템을 구축합니다. Swagger/OpenAPI 기반으로 자동 생성되는 문서를 제공합니다.',
		departments: ['Engineering'],
		objectives: [
			'OpenAPI 3.0 스펙 적용',
			'인터랙티브 API 테스트 기능 구현',
			'코드 예제 자동 생성',
			'버전 관리 시스템 구축',
		],
		startDate: new Date('2023-11-01'),
		endDate: new Date('2024-02-28'),
		status: 'completed',
		members: [
			{
				id: 'm13',
				name: '배수아',
				email: 'sua.bae@proce.com',
				role: 'leader',
				department: 'Engineering',
				joinedAt: new Date('2023-11-01'),
			},
			{
				id: 'm14',
				name: '남궁현',
				email: 'hyun.namgung@proce.com',
				role: 'member',
				department: 'Engineering',
				joinedAt: new Date('2023-11-01'),
			},
		],
		progress: 100,
		createdAt: new Date('2023-10-25'),
		createdBy: '배수아',
		schedule: {
			plannedStartDate: '2023-11-01',
			actualStartDate: '2023-11-01',
			plannedEndDate: '2024-02-28',
			estimatedEndDate: '2024-02-28',
			milestones: [
				{
					id: 'ms4-1',
					name: 'OpenAPI 스펙 적용',
					plannedDate: '2023-12-15',
					status: 'completed',
					completionDate: '2023-12-10',
				},
				{
					id: 'ms4-2',
					name: '테스트 기능 구현',
					plannedDate: '2024-01-31',
					status: 'completed',
					completionDate: '2024-01-28',
				},
				{
					id: 'ms4-3',
					name: '정식 출시',
					plannedDate: '2024-02-28',
					status: 'completed',
					completionDate: '2024-02-25',
				},
			],
		},
	},
	{
		id: '5',
		name: '클라우드 마이그레이션',
		description: '온프레미스 인프라를 AWS 클라우드로 마이그레이션합니다. 고가용성과 확장성을 확보하고 운영 비용을 최적화합니다.',
		departments: ['DevOps'],
		objectives: [
			'현재 인프라 분석 및 마이그레이션 계획 수립',
			'AWS 아키텍처 설계',
			'단계별 마이그레이션 실행',
			'모니터링 및 알람 시스템 구축',
		],
		startDate: new Date('2024-01-10'),
		endDate: new Date('2024-05-31'),
		status: 'on-hold',
		members: [
			{
				id: 'm15',
				name: '차은우',
				email: 'eunwoo.cha@proce.com',
				role: 'leader',
				department: 'DevOps',
				joinedAt: new Date('2024-01-10'),
			},
			{
				id: 'm16',
				name: '홍지훈',
				email: 'jihoon.hong@proce.com',
				role: 'member',
				department: 'DevOps',
				joinedAt: new Date('2024-01-10'),
			},
			{
				id: 'm17',
				name: '노예진',
				email: 'yejin.noh@proce.com',
				role: 'member',
				department: 'DevOps',
				joinedAt: new Date('2024-01-15'),
			},
		],
		progress: 30,
		createdAt: new Date('2024-01-05'),
		createdBy: '차은우',
		schedule: {
			plannedStartDate: '2024-01-10',
			actualStartDate: '2024-01-10',
			plannedEndDate: '2024-05-31',
			milestones: [
				{
					id: 'ms5-1',
					name: '인프라 분석 완료',
					plannedDate: '2024-02-15',
					status: 'completed',
					completionDate: '2024-02-10',
				},
				{
					id: 'ms5-2',
					name: 'AWS 아키텍처 설계',
					plannedDate: '2024-03-31',
					status: 'in-progress',
				},
				{
					id: 'ms5-3',
					name: '마이그레이션 완료',
					plannedDate: '2024-05-31',
					status: 'pending',
				},
			],
		},
	},
	{
		id: '6',
		name: '보안 강화 프로젝트',
		description: '전사 보안 수준 향상을 위한 종합적인 보안 강화 프로젝트입니다. 침투 테스트, 취약점 분석, 보안 정책 수립을 진행합니다.',
		departments: ['Security'],
		objectives: [
			'보안 취약점 분석 및 패치',
			'2단계 인증(2FA) 도입',
			'암호화 통신 강화 (TLS 1.3)',
			'보안 교육 프로그램 개발',
		],
		startDate: new Date('2024-02-15'),
		endDate: new Date('2024-07-31'),
		status: 'active',
		members: [
			{
				id: 'm18',
				name: '안재현',
				email: 'jaehyun.ahn@proce.com',
				role: 'leader',
				department: 'Security',
				joinedAt: new Date('2024-02-15'),
			},
			{
				id: 'm19',
				name: '유하늘',
				email: 'haneul.yoo@proce.com',
				role: 'member',
				department: 'Security',
				joinedAt: new Date('2024-02-15'),
			},
		],
		progress: 55,
		createdAt: new Date('2024-02-10'),
		createdBy: '안재현',
		schedule: {
			plannedStartDate: '2024-02-15',
			actualStartDate: '2024-02-15',
			plannedEndDate: '2024-07-31',
			milestones: [
				{
					id: 'ms6-1',
					name: '취약점 분석 완료',
					plannedDate: '2024-03-31',
					status: 'completed',
					completionDate: '2024-03-28',
				},
				{
					id: 'ms6-2',
					name: '2FA 도입',
					plannedDate: '2024-05-31',
					status: 'in-progress',
				},
				{
					id: 'ms6-3',
					name: '보안 교육 프로그램 론칭',
					plannedDate: '2024-07-31',
					status: 'pending',
				},
			],
		},
	},
]

/**
 * 프로젝트 목업 데이터를 localStorage에 초기화하는 함수
 */
export const initializeMockProjects = (): void => {
	try {
		const existing = localStorage.getItem('projects')
		if (!existing) {
			localStorage.setItem('projects', JSON.stringify(mockProjects))
			console.log('✅ Mock projects initialized')
		}
	} catch (error) {
		console.error('Failed to initialize mock projects:', error)
	}
}

/**
 * 프로젝트 목업 API
 */
export const projectsApi = {
	/**
	 * 모든 프로젝트 조회
	 */
	getProjects: async (): Promise<Project[]> => {
		// 실제 API 호출 시뮬레이션
		await new Promise((resolve) => setTimeout(resolve, 300))
		return mockProjects
	},

	/**
	 * 특정 프로젝트 조회
	 */
	getProject: async (id: string): Promise<Project | null> => {
		await new Promise((resolve) => setTimeout(resolve, 200))
		return mockProjects.find((p) => p.id === id) || null
	},

	/**
	 * 프로젝트 생성
	 */
	createProject: async (project: Omit<Project, 'id' | 'createdAt' | 'progress'>): Promise<Project> => {
		await new Promise((resolve) => setTimeout(resolve, 400))
		const newProject: Project = {
			...project,
			id: Date.now().toString(),
			progress: 0,
			createdAt: new Date(),
		}
		return newProject
	},

	/**
	 * 프로젝트 수정
	 */
	updateProject: async (id: string, updates: Partial<Project>): Promise<Project> => {
		await new Promise((resolve) => setTimeout(resolve, 400))
		const project = mockProjects.find((p) => p.id === id)
		if (!project) throw new Error('Project not found')
		return { ...project, ...updates }
	},

	/**
	 * 프로젝트 삭제
	 */
	deleteProject: async (_id: string): Promise<void> => {
		await new Promise((resolve) => setTimeout(resolve, 300))
	},
}

