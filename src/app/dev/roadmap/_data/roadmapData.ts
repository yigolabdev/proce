/**
 * Product Roadmap Data
 * AI-Powered Performance Management System
 */

export interface Feature {
	id: string
	title: string
	description: string
	priority: 'critical' | 'high' | 'medium' | 'low'
	impact: 'high' | 'medium' | 'low'
	effort: 'easy' | 'medium' | 'hard'
	status: 'not-started' | 'in-progress' | 'completed'
	estimatedDays: number
	dependencies?: string[]
	technicalNotes?: string[]
	businessValue?: string[]
}

export interface Phase {
	id: string
	title: string
	description: string
	duration: string
	features: Feature[]
}

export const roadmapPhases: Phase[] = [
	{
		id: 'phase-4a',
		title: 'Phase 4A: Quick Wins',
		description: '빠른 성과를 낼 수 있는 핵심 기능 구현 (1-2개월)',
		duration: '1-2 months',
		features: [
			{
				id: 'smart-assistant-v1',
				title: '🤖 Smart Work Assistant v1.0',
				description: '현재 Inbox의 AI Recommendations를 실시간 업무 어시스턴트로 확장. 컨텍스트 기반 업무 추천, 마감 임박 알림, 블로커 감지 기능.',
				priority: 'critical',
				impact: 'high',
				effort: 'medium',
				status: 'not-started',
				estimatedDays: 14,
				technicalNotes: [
					'기존 Inbox 컴포넌트 확장',
					'실시간 데이터 분석 로직 추가',
					'컨텍스트 인식 알고리즘 구현',
					'우선순위 스코어링 시스템',
				],
				businessValue: [
					'사용자 생산성 30% 향상',
					'업무 우선순위 명확화',
					'마감 지연 50% 감소',
				],
			},
			{
				id: 'smart-suggestions',
				title: '📌 Smart Work Suggestions',
				description: '현재 시간, 요일, 사용자 패턴을 분석하여 "지금 집중해야 할 업무 3가지" 추천. 마감 임박 업무 우선 표시.',
				priority: 'critical',
				impact: 'high',
				effort: 'easy',
				status: 'not-started',
				estimatedDays: 5,
				dependencies: ['smart-assistant-v1'],
				technicalNotes: [
					'업무 우선순위 계산 알고리즘',
					'시간대별 사용자 패턴 분석',
					'마감일 기반 긴급도 계산',
				],
				businessValue: [
					'의사결정 피로 감소',
					'중요 업무 집중도 향상',
				],
			},
			{
				id: 'blocker-detection',
				title: '🚨 Blocker Detection',
				description: '프로젝트나 업무에서 차단 요인 자동 감지. "김민수님 승인 대기 중" 같은 의존성 추적 및 알림.',
				priority: 'high',
				impact: 'high',
				effort: 'medium',
				status: 'not-started',
				estimatedDays: 7,
				dependencies: ['smart-assistant-v1'],
				technicalNotes: [
					'의존성 그래프 구축',
					'승인 대기 상태 추적',
					'자동 리마인더 시스템',
				],
				businessValue: [
					'업무 지연 조기 감지',
					'팀 협업 효율 향상',
				],
			},
			{
				id: 'calendar-integration',
				title: '📅 Calendar Integration (Google/Outlook)',
				description: 'Google Calendar와 Outlook 연동으로 미팅 시간 자동 추적. 일정 기반 업무 시간 계획 도움.',
				priority: 'high',
				impact: 'high',
				effort: 'medium',
				status: 'not-started',
				estimatedDays: 10,
				technicalNotes: [
					'Google Calendar API 연동',
					'OAuth 2.0 인증 구현',
					'미팅 → 업무 자동 변환 로직',
					'일정 동기화 스케줄러',
				],
				businessValue: [
					'수동 입력 50% 감소',
					'업무 시간 정확도 향상',
					'일정 충돌 사전 방지',
				],
			},
			{
				id: 'personal-dashboard',
				title: '📊 Personal Performance Profile',
				description: '사용자의 업무 스타일 분석 (아침형/저녁형, 집중형/협업형). 최고 생산성 시간대 및 패턴 시각화.',
				priority: 'high',
				impact: 'medium',
				effort: 'medium',
				status: 'not-started',
				estimatedDays: 8,
				technicalNotes: [
					'업무 시간대 분석 알고리즘',
					'생산성 패턴 시각화 (차트)',
					'업무 스타일 분류 로직',
				],
				businessValue: [
					'개인 최적화 인사이트',
					'자기 인식 향상',
					'일정 계획 개선',
				],
			},
			{
				id: 'slack-integration',
				title: '💬 Slack Basic Integration',
				description: 'Slack 기본 연동: 알림 전송, 업무 상태 업데이트. 양방향 커뮤니케이션 기초 구축.',
				priority: 'medium',
				impact: 'medium',
				effort: 'easy',
				status: 'not-started',
				estimatedDays: 5,
				technicalNotes: [
					'Slack Webhook 설정',
					'알림 메시지 포맷팅',
					'Slack 봇 생성',
				],
				businessValue: [
					'사용자 편의성 향상',
					'알림 도달률 증가',
				],
			},
		],
	},
	{
		id: 'phase-4b',
		title: 'Phase 4B: Core AI Features',
		description: 'AI 기반 핵심 인텔리전스 기능 구현 (2-3개월)',
		duration: '2-3 months',
		features: [
			{
				id: 'auto-work-logging',
				title: '📊 Auto Work Logging (게임체인저!)',
				description: '캘린더, Git, Slack 활동을 자동으로 분석하여 업무 로그 자동 생성. 수동 입력 80% 감소 목표.',
				priority: 'critical',
				impact: 'high',
				effort: 'hard',
				status: 'not-started',
				estimatedDays: 21,
				dependencies: ['calendar-integration', 'slack-integration'],
				technicalNotes: [
					'다중 소스 데이터 통합 파이프라인',
					'활동 → 업무 자동 매핑 AI',
					'중복 제거 로직',
					'사용자 검증 워크플로우',
					'Git commit 파싱 & 분석',
					'Slack 대화 컨텍스트 분석',
				],
				businessValue: [
					'데이터 입력 시간 80% 절감',
					'업무 기록 정확도 향상',
					'사용자 피로도 대폭 감소',
					'실시간 업무 추적 가능',
				],
			},
			{
				id: 'predictive-alerts',
				title: '🔮 Predictive Alerts',
				description: '프로젝트 지연 위험, OKR 달성 가능성, 업무량 과부하 등을 사전에 예측하여 알림.',
				priority: 'critical',
				impact: 'high',
				effort: 'hard',
				status: 'not-started',
				estimatedDays: 14,
				dependencies: ['smart-assistant-v1'],
				technicalNotes: [
					'예측 모델 구축 (시계열 분석)',
					'위험도 스코어링 알고리즘',
					'트렌드 분석 및 외삽',
					'조기 경보 시스템',
				],
				businessValue: [
					'문제 예방으로 비용 절감',
					'프로젝트 성공률 향상',
					'리스크 관리 강화',
				],
			},
			{
				id: 'context-aware-recommendations',
				title: '🎯 Context-Aware Recommendations',
				description: '현재 시간, 에너지 레벨 예측, 팀원 가용성을 고려한 최적 업무 및 협업 타이밍 추천.',
				priority: 'high',
				impact: 'high',
				effort: 'hard',
				status: 'not-started',
				estimatedDays: 12,
				dependencies: ['personal-dashboard', 'auto-work-logging'],
				technicalNotes: [
					'컨텍스트 데이터 수집 파이프라인',
					'에너지 레벨 예측 모델',
					'팀원 가용성 추적 시스템',
					'협업 최적 시간 매칭 알고리즘',
				],
				businessValue: [
					'생산성 극대화',
					'협업 효율성 향상',
					'번아웃 방지',
				],
			},
			{
				id: 'team-collaboration-viz',
				title: '👥 Team Collaboration Visualization',
				description: '팀 협업 패턴 네트워크 그래프 시각화. 누가 누구와 자주 일하는지, 사일로 현상 감지.',
				priority: 'high',
				impact: 'high',
				effort: 'medium',
				status: 'not-started',
				estimatedDays: 10,
				dependencies: ['auto-work-logging'],
				technicalNotes: [
					'협업 데이터 수집 (공동 프로젝트, 공동 OKR)',
					'네트워크 그래프 라이브러리 (D3.js/Cytoscape)',
					'중심성 분석 (centrality metrics)',
					'커뮤니티 감지 알고리즘',
				],
				businessValue: [
					'팀 역학 이해',
					'사일로 조기 발견',
					'협업 최적화',
				],
			},
			{
				id: 'work-distribution-intelligence',
				title: '🔄 Work Distribution Intelligence',
				description: '팀원 간 업무 부하 실시간 모니터링 및 불균형 감지. 재배분 제안 및 최적 리소스 배치 시뮬레이션.',
				priority: 'high',
				impact: 'high',
				effort: 'medium',
				status: 'not-started',
				estimatedDays: 10,
				dependencies: ['team-collaboration-viz'],
				technicalNotes: [
					'업무 부하 계산 알고리즘',
					'부하 균형 임계값 설정',
					'재배분 추천 엔진',
					'시뮬레이션 기능',
				],
				businessValue: [
					'번아웃 방지',
					'팀 생산성 향상',
					'공정한 업무 분배',
				],
			},
			{
				id: 'git-integration',
				title: '👨‍💻 Git Integration (GitHub/GitLab)',
				description: 'Git commit, PR, Issue 자동 추적. 코드 기여도 분석 및 개발 업무 자동 로깅.',
				priority: 'medium',
				impact: 'high',
				effort: 'medium',
				status: 'not-started',
				estimatedDays: 10,
				technicalNotes: [
					'GitHub/GitLab API 연동',
					'Webhook 이벤트 수신',
					'Commit 메시지 파싱',
					'코드 기여 메트릭 계산',
				],
				businessValue: [
					'개발팀 생산성 정확 측정',
					'코드 기여 투명성',
					'자동 업무 로깅',
				],
			},
		],
	},
	{
		id: 'phase-5',
		title: 'Phase 5: Advanced Intelligence',
		description: '고급 분석 및 개인화 기능 (3-4개월)',
		duration: '3-4 months',
		features: [
			{
				id: 'predictive-forecasting',
				title: '📈 Predictive Forecasting',
				description: '다음 분기 목표 달성 확률, KPI 예상치, 프로젝트 완료 날짜 AI 예측 (몬테카를로 시뮬레이션).',
				priority: 'high',
				impact: 'high',
				effort: 'hard',
				status: 'not-started',
				estimatedDays: 21,
				dependencies: ['predictive-alerts', 'work-distribution-intelligence'],
				technicalNotes: [
					'몬테카를로 시뮬레이션 엔진',
					'시계열 예측 모델 (ARIMA/Prophet)',
					'베이지안 추론',
					'신뢰 구간 계산',
				],
				businessValue: [
					'전략적 의사결정 지원',
					'리스크 사전 관리',
					'리소스 계획 최적화',
				],
			},
			{
				id: 'what-if-simulator',
				title: '🎮 What-If Simulator',
				description: '"팀원 1명 추가 시", "우선순위 변경 시" 등 다양한 시나리오 시뮬레이션 및 임팩트 분석.',
				priority: 'high',
				impact: 'high',
				effort: 'hard',
				status: 'not-started',
				estimatedDays: 14,
				dependencies: ['predictive-forecasting'],
				technicalNotes: [
					'시나리오 모델링 프레임워크',
					'임팩트 분석 엔진',
					'시뮬레이션 결과 시각화',
					'비교 분석 대시보드',
				],
				businessValue: [
					'데이터 기반 의사결정',
					'변화 임팩트 사전 파악',
					'최적 전략 선택',
				],
			},
			{
				id: 'performance-coach',
				title: '🏃 Personal Performance Coach',
				description: '개인 업무 스타일, 최고 생산성 시간대 분석. 일일 최적화 제안 및 성장 경로 추천.',
				priority: 'high',
				impact: 'medium',
				effort: 'medium',
				status: 'not-started',
				estimatedDays: 14,
				dependencies: ['personal-dashboard', 'context-aware-recommendations'],
				technicalNotes: [
					'개인 패턴 학습 모델',
					'생산성 최적화 알고리즘',
					'맞춤형 추천 엔진',
					'성장 추적 시스템',
				],
				businessValue: [
					'개인 생산성 극대화',
					'자기 개발 지원',
					'직원 만족도 향상',
				],
			},
			{
				id: 'skill-growth-tracker',
				title: '🌱 Skill Growth Tracker',
				description: '프로젝트 데이터 기반 스킬 레벨 자동 측정. 다음 레벨업 경로 및 멘토 매칭 추천.',
				priority: 'medium',
				impact: 'medium',
				effort: 'medium',
				status: 'not-started',
				estimatedDays: 10,
				dependencies: ['performance-coach'],
				technicalNotes: [
					'스킬 추출 알고리즘',
					'레벨 진척도 계산',
					'학습 경로 추천 엔진',
					'멘토 매칭 알고리즘',
				],
				businessValue: [
					'인재 개발 체계화',
					'내부 전문성 활용',
					'이직률 감소',
				],
			},
			{
				id: 'wellbeing-monitor',
				title: '🧘 Wellbeing & Balance Monitor',
				description: '번아웃 위험도 실시간 모니터링, 워크라이프 밸런스 스코어, 야근 패턴 분석 및 경고.',
				priority: 'high',
				impact: 'high',
				effort: 'medium',
				status: 'not-started',
				estimatedDays: 10,
				dependencies: ['performance-coach'],
				technicalNotes: [
					'번아웃 위험 스코어링',
					'근무 시간 패턴 분석',
					'휴식 권장 알고리즘',
					'밸런스 메트릭 계산',
				],
				businessValue: [
					'직원 건강 보호',
					'생산성 지속 가능성',
					'장기 성과 향상',
				],
			},
			{
				id: 'talent-insights',
				title: '🌟 Talent & Growth Insights',
				description: '숨은 고성과자 발굴, 스킬 갭 분석, 리더 잠재력 스코어링, 이직 위험도 조기 감지.',
				priority: 'medium',
				impact: 'high',
				effort: 'hard',
				status: 'not-started',
				estimatedDays: 14,
				dependencies: ['skill-growth-tracker', 'wellbeing-monitor'],
				technicalNotes: [
					'고성과자 식별 알고리즘',
					'스킬 갭 분석 모델',
					'리더십 잠재력 평가',
					'이직 위험 예측 모델',
				],
				businessValue: [
					'인재 유지',
					'리더십 파이프라인 구축',
					'채용 비용 절감',
				],
			},
			{
				id: 'risk-prediction',
				title: '🚨 Risk Prediction System',
				description: '프로젝트 실패 위험도, 품질 저하 트렌드, 팀 이슈 조기 감지 시스템.',
				priority: 'high',
				impact: 'high',
				effort: 'hard',
				status: 'not-started',
				estimatedDays: 14,
				dependencies: ['predictive-forecasting'],
				technicalNotes: [
					'리스크 스코어링 모델',
					'이상 탐지 알고리즘',
					'조기 경보 시스템',
					'리스크 대시보드',
				],
				businessValue: [
					'프로젝트 성공률 향상',
					'비용 초과 방지',
					'품질 보증',
				],
			},
		],
	},
	{
		id: 'phase-6',
		title: 'Phase 6: Collaboration & Culture',
		description: '피드백, 학습, 협업 문화 구축 (3-4개월)',
		duration: '3-4 months',
		features: [
			{
				id: 'continuous-feedback',
				title: '💬 Continuous Feedback System',
				description: '실시간 피드백, 360도 피드백 자동화, AI 피드백 분석 & 요약, 건설적 피드백 가이드.',
				priority: 'high',
				impact: 'high',
				effort: 'medium',
				status: 'not-started',
				estimatedDays: 14,
				technicalNotes: [
					'피드백 수집 인터페이스',
					'익명/공개 피드백 설정',
					'AI 텍스트 분석 (감정, 주제)',
					'피드백 요약 생성',
				],
				businessValue: [
					'피드백 문화 정착',
					'성장 가속화',
					'팀 커뮤니케이션 개선',
				],
			},
			{
				id: 'one-on-one-manager',
				title: '👤 1:1 Meeting Manager',
				description: '1:1 미팅 자동 스케줄링, AI 생성 토론 주제, 액션 아이템 추적, 미팅 노트 자동 요약.',
				priority: 'high',
				impact: 'high',
				effort: 'medium',
				status: 'not-started',
				estimatedDays: 10,
				dependencies: ['calendar-integration', 'continuous-feedback'],
				technicalNotes: [
					'미팅 템플릿 시스템',
					'자동 토론 주제 생성 AI',
					'액션 아이템 추적',
					'미팅 노트 NLP 요약',
				],
				businessValue: [
					'1:1 효과성 향상',
					'관리자 시간 절약',
					'직원 개발 체계화',
				],
			},
			{
				id: 'knowledge-base',
				title: '🧠 AI-Powered Knowledge Base',
				description: '업무 데이터 자동 지식 문서화, 컨텍스트 기반 문서 추천, FAQ 자동 생성.',
				priority: 'medium',
				impact: 'medium',
				effort: 'hard',
				status: 'not-started',
				estimatedDays: 21,
				technicalNotes: [
					'자동 문서화 파이프라인',
					'지식 그래프 구축',
					'시맨틱 검색 엔진',
					'FAQ 자동 생성 AI',
				],
				businessValue: [
					'지식 자산화',
					'온보딩 시간 단축',
					'반복 질문 감소',
				],
			},
			{
				id: 'learning-path',
				title: '🎓 Learning Path Creator',
				description: '개인 맞춤 학습 경로 생성, 내부 전문가 강의 매칭, 학습 진도 추적.',
				priority: 'medium',
				impact: 'medium',
				effort: 'medium',
				status: 'not-started',
				estimatedDays: 10,
				dependencies: ['skill-growth-tracker', 'knowledge-base'],
				technicalNotes: [
					'학습 경로 추천 알고리즘',
					'전문가 매칭 시스템',
					'진도 추적 대시보드',
					'학습 자료 큐레이션',
				],
				businessValue: [
					'체계적 인재 개발',
					'내부 전문성 활용',
					'학습 문화 조성',
				],
			},
			{
				id: 'mentorship-matching',
				title: '🤝 Mentorship Matching',
				description: 'AI 기반 멘토-멘티 매칭, 스킬/경험 기반 추천, 멘토링 세션 관리 및 효과 측정.',
				priority: 'low',
				impact: 'medium',
				effort: 'medium',
				status: 'not-started',
				estimatedDays: 10,
				dependencies: ['learning-path'],
				technicalNotes: [
					'멘토-멘티 매칭 알고리즘',
					'멘토링 세션 관리',
					'효과 측정 메트릭',
				],
				businessValue: [
					'지식 전수 체계화',
					'조직 유대감 강화',
					'리더십 개발',
				],
			},
			{
				id: 'performance-review',
				title: '📊 Performance Review Automation',
				description: '리뷰 기간 데이터 자동 수집, AI 성과 요약 생성, 객관적 메트릭 기반 평가 보조.',
				priority: 'medium',
				impact: 'high',
				effort: 'hard',
				status: 'not-started',
				estimatedDays: 14,
				dependencies: ['continuous-feedback', 'talent-insights'],
				technicalNotes: [
					'성과 데이터 집계 파이프라인',
					'AI 성과 요약 생성',
					'평가 템플릿 시스템',
					'개발 계획 초안 작성 AI',
				],
				businessValue: [
					'평가 공정성 향상',
					'관리자 부담 감소',
					'데이터 기반 평가',
				],
			},
		],
	},
	{
		id: 'phase-7',
		title: 'Phase 7: Automation & Integration',
		description: '통합 및 자동화 생태계 구축 (4-6개월)',
		duration: '4-6 months',
		features: [
			{
				id: 'workflow-automation',
				title: '🔄 Smart Workflows',
				description: '반복 작업 자동화, 커스텀 워크플로우 빌더, 트리거 기반 자동 액션.',
				priority: 'high',
				impact: 'high',
				effort: 'hard',
				status: 'not-started',
				estimatedDays: 21,
				technicalNotes: [
					'워크플로우 엔진 구축',
					'비주얼 워크플로우 빌더',
					'트리거-액션 시스템',
					'조건부 로직 지원',
				],
				businessValue: [
					'수작업 90% 감소',
					'프로세스 표준화',
					'오류 제거',
				],
			},
			{
				id: 'document-automation',
				title: '📄 Document Automation',
				description: '주간/월간 보고서 자동 생성, AI 문서 검토 & 개선 제안, 다국어 자동 번역.',
				priority: 'medium',
				impact: 'medium',
				effort: 'medium',
				status: 'not-started',
				estimatedDays: 14,
				technicalNotes: [
					'문서 템플릿 엔진',
					'데이터 → 문서 자동 생성',
					'AI 문서 리뷰',
					'다국어 번역 API 연동',
				],
				businessValue: [
					'보고서 작성 시간 80% 절감',
					'문서 품질 일관성',
				],
			},
			{
				id: 'smart-notifications',
				title: '📧 Smart Notifications',
				description: '컨텍스트 기반 중요도 자동 판단, 알림 피로 방지 (배칭, 요약), 선호 채널 학습.',
				priority: 'medium',
				impact: 'medium',
				effort: 'medium',
				status: 'not-started',
				estimatedDays: 10,
				technicalNotes: [
					'알림 우선순위 알고리즘',
					'배칭 & 요약 로직',
					'채널 선호도 학습',
					'Do Not Disturb 지능형 모드',
				],
				businessValue: [
					'알림 피로 감소',
					'중요 정보 놓치지 않음',
				],
			},
			{
				id: 'jira-integration',
				title: '📋 Jira/Asana Integration',
				description: 'Jira, Asana 등 프로젝트 관리 도구 연동. Issue/Task 자동 동기화.',
				priority: 'medium',
				impact: 'medium',
				effort: 'medium',
				status: 'not-started',
				estimatedDays: 10,
				technicalNotes: [
					'Jira API 연동',
					'Asana API 연동',
					'양방향 동기화',
					'Issue → Work Entry 매핑',
				],
				businessValue: [
					'도구 통합',
					'데이터 일관성',
				],
			},
			{
				id: 'crm-integration',
				title: '📊 CRM Integration (Salesforce/HubSpot)',
				description: 'CRM 데이터 연동으로 고객 관련 업무 추적 및 분석.',
				priority: 'low',
				impact: 'medium',
				effort: 'medium',
				status: 'not-started',
				estimatedDays: 10,
				technicalNotes: [
					'Salesforce API 연동',
					'HubSpot API 연동',
					'고객 데이터 동기화',
				],
				businessValue: [
					'고객 중심 업무 추적',
					'영업 생산성 분석',
				],
			},
			{
				id: 'api-platform',
				title: '🔌 API Platform & Webhooks',
				description: 'Public API 제공, Webhook 시스템, 써드파티 통합 지원.',
				priority: 'high',
				impact: 'high',
				effort: 'hard',
				status: 'not-started',
				estimatedDays: 21,
				technicalNotes: [
					'RESTful API 설계',
					'API 인증 (OAuth 2.0)',
					'Webhook 시스템',
					'API 문서 (Swagger)',
					'Rate limiting & 보안',
				],
				businessValue: [
					'확장 가능한 생태계',
					'커스텀 통합 지원',
					'개발자 친화적',
				],
			},
		],
	},
	{
		id: 'phase-8',
		title: 'Phase 8: Next-Gen UX',
		description: '차세대 사용자 경험 혁신 (3-4개월)',
		duration: '3-4 months',
		features: [
			{
				id: 'conversational-ai',
				title: '💬 Proce AI Chat (Conversational Interface)',
				description: '대화형 AI로 모든 기능 제어. "오늘 뭐 하면 돼?", "지난주 성과 요약해줘" 같은 자연어 명령.',
				priority: 'high',
				impact: 'high',
				effort: 'hard',
				status: 'not-started',
				estimatedDays: 28,
				technicalNotes: [
					'OpenAI GPT-4 API 통합',
					'Function calling 구현',
					'대화 컨텍스트 관리',
					'의도 분류 & 엔티티 추출',
					'자연어 → 액션 매핑',
				],
				businessValue: [
					'사용자 진입 장벽 제거',
					'생산성 극대화',
					'차별화된 UX',
				],
			},
			{
				id: 'voice-commands',
				title: '🎤 Voice Commands',
				description: '음성으로 업무 기록, 명령 실행. "업무 완료 표시: 마케팅 기획서 작성"',
				priority: 'medium',
				impact: 'medium',
				effort: 'medium',
				status: 'not-started',
				estimatedDays: 14,
				dependencies: ['conversational-ai'],
				technicalNotes: [
					'Web Speech API',
					'음성 인식 (STT)',
					'명령어 파싱',
					'핸즈프리 모드',
				],
				businessValue: [
					'이동 중 업무 기록',
					'접근성 향상',
				],
			},
			{
				id: 'mobile-app',
				title: '📱 Mobile-First Experience',
				description: 'Progressive Web App (PWA) 또는 네이티브 앱. 스와이프 기반 빠른 입력, 위젯, 오프라인 지원.',
				priority: 'high',
				impact: 'high',
				effort: 'hard',
				status: 'not-started',
				estimatedDays: 35,
				technicalNotes: [
					'React Native 또는 PWA',
					'오프라인 데이터 동기화',
					'푸시 알림',
					'홈 화면 위젯',
					'스와이프 제스처',
				],
				businessValue: [
					'모바일 접근성',
					'항상 연결',
					'사용 빈도 증가',
				],
			},
			{
				id: 'smart-shortcuts',
				title: '🎯 Smart Shortcuts & Personalization',
				description: '개인 맞춤 대시보드, 자주 쓰는 액션 학습, 키보드 단축키 마스터 모드.',
				priority: 'medium',
				impact: 'medium',
				effort: 'easy',
				status: 'not-started',
				estimatedDays: 7,
				technicalNotes: [
					'사용 패턴 학습',
					'대시보드 커스터마이징',
					'단축키 시스템 확장',
				],
				businessValue: [
					'작업 속도 향상',
					'사용자 만족도 증가',
				],
			},
			{
				id: 'gamification',
				title: '🏆 Gamification & Recognition',
				description: '자동 성과 하이라이트, 배지, 레벨, 리더보드, 피어 인정 시스템.',
				priority: 'low',
				impact: 'medium',
				effort: 'medium',
				status: 'not-started',
				estimatedDays: 14,
				technicalNotes: [
					'배지 시스템 설계',
					'레벨링 알고리즘',
					'리더보드 계산',
					'피어 인정 워크플로우',
				],
				businessValue: [
					'동기 부여',
					'참여도 증가',
					'긍정적 문화 조성',
				],
			},
		],
	},
]

// Helper function to calculate phase statistics
export function getPhaseStats(phase: Phase) {
	const total = phase.features.length
	const completed = phase.features.filter((f) => f.status === 'completed').length
	const inProgress = phase.features.filter((f) => f.status === 'in-progress').length
	const notStarted = phase.features.filter((f) => f.status === 'not-started').length

	const totalDays = phase.features.reduce((sum, f) => sum + f.estimatedDays, 0)
	const completedDays = phase.features.filter((f) => f.status === 'completed').reduce((sum, f) => sum + f.estimatedDays, 0)

	return {
		total,
		completed,
		inProgress,
		notStarted,
		completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
		totalDays,
		completedDays,
		remainingDays: totalDays - completedDays,
	}
}

// Helper function to get overall roadmap stats
export function getRoadmapStats() {
	const allFeatures = roadmapPhases.flatMap((p) => p.features)
	const total = allFeatures.length
	const completed = allFeatures.filter((f) => f.status === 'completed').length
	const inProgress = allFeatures.filter((f) => f.status === 'in-progress').length
	const notStarted = allFeatures.filter((f) => f.status === 'not-started').length

	const totalDays = allFeatures.reduce((sum, f) => sum + f.estimatedDays, 0)
	const completedDays = allFeatures.filter((f) => f.status === 'completed').reduce((sum, f) => sum + f.estimatedDays, 0)

	return {
		total,
		completed,
		inProgress,
		notStarted,
		completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
		totalDays,
		completedDays,
		remainingDays: totalDays - completedDays,
	}
}

