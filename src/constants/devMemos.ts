import type { DevMemoContent } from '../components/dev/DevMemo'

// Development notes for all pages
// 모든 페이지의 개발 노트를 한 곳에서 관리

export const DEV_MEMOS: Record<string, DevMemoContent> = {
	// ==================== AUTH PAGES ====================
	LANDING: {
		title: {
			ko: '랜딩 페이지',
			en: 'Landing Page',
		},
		purpose: {
			ko: '사용자 유형(User/Admin/Executive)별 빠른 로그인을 제공하고, 회사 및 직원 회원가입으로 안내하는 진입 페이지',
			en: 'Entry page providing quick login by user type (User/Admin/Executive) and guiding to company/employee signup',
		},
		features: {
			ko: [
				'Quick Login: User/Admin/Executive 역할별 원클릭 로그인 (개발용)',
				'Sign In Form: 이메일/비밀번호 로그인',
				'회원가입 안내: Company Signup / Employee Signup 링크',
				'다크모드 지원',
			],
			en: [
				'Quick Login: One-click login by role (User/Admin/Executive) for development',
				'Sign In Form: Email/password authentication',
				'Signup Links: Company Signup / Employee Signup',
				'Dark mode support',
			],
		},
		status: {
			ko: '완료',
			en: 'Completed',
		},
		lastUpdated: '2025-01-05',
		notes: {
			ko: '실제 배포 시 Quick Login 버튼은 제거 필요. AuthContext를 통해 사용자 인증 상태 관리.',
			en: 'Quick Login buttons should be removed in production. User authentication managed via AuthContext.',
		},
	},

	COMPANY_SIGNUP: {
		title: {
			ko: '기업 회원가입',
			en: 'Company Signup',
		},
		purpose: {
			ko: '이메일 인증을 통해 무분별한 가입을 방지하고, 새로운 기업이 Proce 서비스에 등록하며, 최초 관리자 계정을 생성하는 4단계 회원가입 프로세스',
			en: '4-step company registration process with email verification to prevent unauthorized signups, allowing new companies to join Proce and create initial admin account',
		},
		features: {
			ko: [
				'Step 1: 이메일 인증 (비즈니스 이메일 입력 → 인증 코드 발송 → 코드 확인)',
				'Step 2: 회사 정보 입력 (회사명, 사업자번호, 업종, 직원 수)',
				'Step 3: 관리자 정보 입력 (이름, 비밀번호, 전화번호)',
				'Step 4: 등록 완료 확인 및 요약',
				'이메일 인증: 6자리 코드, 3분 타이머, 재전송 기능',
				'검증된 이메일 자동 사용: 관리자 이메일로 자동 설정',
				'프로그레스바: 4단계 시각화',
				'유효성 검사: 이메일 형식, 필수 항목 확인',
				'업종 선택: 27개 산업군 드롭다운',
				'직원 수: 범위 선택 또는 직접 입력',
			],
			en: [
				'Step 1: Email verification (business email → send code → verify code)',
				'Step 2: Company info (name, business number, industry, employee count)',
				'Step 3: Admin info (name, password, phone)',
				'Step 4: Registration confirmation and summary',
				'Email verification: 6-digit code, 3-minute timer, resend function',
				'Verified email auto-use: Automatically set as admin email',
				'Progress bar: 4-step visual indicator',
				'Validation: Email format, required field checks',
				'Industry selection: 27 industry categories dropdown',
				'Employee count: Range selection or direct input',
			],
		},
		status: {
			ko: '완료',
			en: 'Completed',
		},
		lastUpdated: '2025-01-05',
		notes: {
			ko: '이메일 인증 코드는 데모용으로 화면에 표시. 실제 배포 시 이메일로 발송 필요. 사업자번호 검증 API 필요.',
			en: 'Email verification code shown on screen for demo. Should be sent via email in production. Business number verification API needed.',
		},
	},

	EMPLOYEE_SIGNUP: {
		title: {
			ko: '직원 회원가입',
			en: 'Employee Signup',
		},
		purpose: {
			ko: '기업에서 발급한 초대 코드를 통해 직원이 계정을 생성하고 조직에 합류하는 2단계 프로세스',
			en: '2-step process for employees to create accounts and join organization using invite codes',
		},
		features: {
			ko: [
				'Step 1: 초대 코드 입력 및 검증',
				'Step 2: 직원 정보 입력 (이름, 이메일, 비밀번호, 전화번호, 부서, 직급)',
				'국가 코드 선택: 16개국 전화번호 국가 코드 드롭다운',
				'부서 선택: Organization Setup에서 설정된 부서 목록 또는 Mock 데이터 (10개)',
				'직급 선택: 국제 표준 직급 체계 (13개 레벨)',
				'Custom 입력: 부서/직급 직접 입력 옵션',
				'개발 모드: 단계 건너뛰기 버튼',
			],
			en: [
				'Step 1: Invite code entry and verification',
				'Step 2: Employee info (name, email, password, phone, department, position)',
				'Country code selector: 16 countries phone number dropdown',
				'Department selection: From Organization Setup or mock data (10 departments)',
				'Position selection: International standard levels (13 positions)',
				'Custom input: Manual entry option for department/position',
				'Dev mode: Skip step buttons',
			],
		},
		status: {
			ko: '완료',
			en: 'Completed',
		},
		lastUpdated: '2025-01-05',
		notes: {
			ko: '초대 코드는 실제로 서버에서 발급 및 검증 필요. 회원가입 완료 후 Landing Page(/)로 이동.',
			en: 'Invite codes should be generated and verified by server. Redirects to Landing Page (/) after signup.',
		},
	},

	// ==================== MAIN PAGES ====================
	DASHBOARD: {
		title: {
			ko: '대시보드',
			en: 'Dashboard',
		},
		purpose: {
			ko: '사용자의 주요 업무 지표와 OKR 진행 상황을 한눈에 확인할 수 있는 메인 대시보드',
			en: 'Main dashboard providing overview of key work metrics and OKR progress',
		},
		features: {
			ko: [
				'OKR 요약: 진행 중인 목표 및 Key Results 진행률',
				'이번 주 업무: 주간 업무 요약 카드',
				'최근 프로젝트: 진행 중인 프로젝트 목록',
				'업무 통계: 이번 달 업무 시간, 완료 건수 등',
				'빠른 액션: Work Input, OKR, Projects 바로가기',
			],
			en: [
				'OKR summary: Active objectives and Key Results progress',
				'This week\'s work: Weekly work summary cards',
				'Recent projects: List of ongoing projects',
				'Work statistics: Monthly work hours, completed items',
				'Quick actions: Shortcuts to Work Input, OKR, Projects',
			],
		},
		status: {
		ko: '미완성',
		en: 'Not Started',
		},
		lastUpdated: '2025-01-04',
	},

	INPUT: {
		title: {
			ko: '업무 입력 페이지',
			en: 'Work Input Page',
		},
		purpose: {
			ko: '일일 업무 내용을 입력하고, OKR Key Result 진행률을 업데이트하며, AI 분석을 위한 메타데이터를 수집하는 핵심 페이지',
			en: 'Core page for daily work entry, OKR Key Result progress updates, and collecting metadata for AI analysis',
		},
		features: {
			ko: [
				'기본 정보: 제목, 설명, 카테고리, 날짜, 소요 시간(Custom 입력 가능)',
				'프로젝트 연결: 진행 중인 프로젝트 선택',
				'OKR 연결: Objective 및 Key Result 선택, 진행률 업데이트',
				'링크 리소스: 외부 URL 추가 (Google Docs, Figma 등)',
				'파일 첨부: 문서, 이미지 업로드',
				'태그: 업무 분류용 태그 추가',
				'보안: Confidential 설정',
				'자동 저장: 임시 저장 기능',
				'Draft 관리: 저장된 임시 작성 목록',
				'AI 제안: 업무 카테고리 및 태그 추천 (예정)',
				'Decision Issue 생성: 중요 의사결정 사항 기록 (예정)',
			],
			en: [
				'Basic info: Title, description, category, date, duration (custom input available)',
				'Project link: Select ongoing project',
				'OKR link: Select Objective and Key Result, update progress',
				'Linked resources: Add external URLs (Google Docs, Figma, etc.)',
				'File attachments: Upload documents, images',
				'Tags: Add tags for work classification',
				'Security: Confidential setting',
				'Auto-save: Draft save functionality',
				'Draft management: List of saved drafts',
				'AI suggestions: Category and tag recommendations (planned)',
				'Decision Issue: Record important decisions (planned)',
			],
		},
		status: {
		ko: '미완성',
		en: 'Not Started',
		},
		lastUpdated: '2025-01-05',
		notes: {
			ko: 'OKR 진행률 업데이트 시 자동으로 Objective 상태 재계산. 모든 데이터는 localStorage에 저장 (서버 연동 필요). ⚠️ 업무 카테고리는 System Settings의 Add Category 기능과 공유됩니다 (localStorage: workCategories).',
			en: 'Objective status automatically recalculated on Key Result progress update. All data stored in localStorage (server integration needed). ⚠️ Work categories are shared with System Settings Add Category feature (localStorage: workCategories).',
		},
	},

	OKR: {
		title: {
			ko: 'OKR 관리',
			en: 'OKR Management',
		},
		purpose: {
			ko: 'Objectives and Key Results를 생성, 수정, 조회하고 진행 상황을 모니터링하는 목표 관리 페이지 (진행률은 Work Input에서 업데이트)',
			en: 'Goal management page for creating, editing, viewing OKRs and monitoring progress (progress updated via Work Input)',
		},
		features: {
			ko: [
				'Objective 생성/수정/삭제: 분기 또는 월 단위 목표 설정',
				'Key Results 관리: 각 목표에 대한 측정 가능한 핵심 결과',
				'진행률 표시: 각 Key Result 및 전체 Objective 진행률 시각화',
				'기간 선택: 분기(Q1-Q4) 또는 월(Jan-Dec) 단위 필터',
				'현재 분기 + 다음 4개 분기 (총 5개 분기)',
				'현재 월 + 다음 12개월 (총 13개월)',
				'상태 자동 계산: On Track / At Risk / Behind / Completed',
				'팀 및 Owner 지정: 책임자 및 팀 설정',
				'기간 설정: 시작일 및 종료일',
				'진행률 업데이트: Work Input 페이지로 이동하여 업데이트',
			],
			en: [
				'Objective CRUD: Quarter or monthly goal management',
				'Key Results: Measurable outcomes for each objective',
				'Progress display: Visual progress for Key Results and overall Objective',
				'Period filter: Quarter (Q1-Q4) or Month (Jan-Dec) selection',
				'Current quarter + next 4 quarters (5 quarters total)',
				'Current month + next 12 months (13 months total)',
				'Status auto-calculation: On Track / At Risk / Behind / Completed',
				'Team & Owner: Assign responsibility',
				'Period setting: Start and end dates',
				'Progress update: Navigate to Work Input page for updates',
			],
		},
		status: {
		ko: '미완성',
		en: 'Not Started',
		},
		lastUpdated: '2025-01-05',
		notes: {
			ko: 'Status 필드는 자동 계산되어 읽기 전용. 진행률은 Work Input 페이지에서 업무 입력 시 업데이트. Period는 분기 또는 월 단위로 선택 가능하며, 드롭다운에서 그룹화되어 표시.',
			en: 'Status field is auto-calculated and read-only. Progress updated when entering work on Work Input page. Period can be selected as quarters or months, grouped in dropdown.',
		},
	},

	PROJECTS: {
		title: {
			ko: '프로젝트 관리',
			en: 'Project Management',
		},
		purpose: {
			ko: '프로젝트를 생성하고 관리하며, 팀원, 일정, 진행 상황을 추적하는 페이지',
			en: 'Page for creating and managing projects, tracking team members, schedules, and progress',
		},
		features: {
			ko: [
				'프로젝트 생성/수정/삭제',
				'상태 관리: Planning / Active / On Hold / Completed / Cancelled',
				'팀원 관리: 멤버 추가/제거',
				'일정 관리: 시작일/종료일 설정',
				'진행률 추적: 퍼센트 기반 진행 상황',
				'설명 및 메모: 프로젝트 상세 정보',
				'카드 뷰: 프로젝트 카드 그리드 레이아웃',
			],
			en: [
				'Project CRUD operations',
				'Status management: Planning / Active / On Hold / Completed / Cancelled',
				'Team management: Add/remove members',
				'Schedule management: Start/end dates',
				'Progress tracking: Percentage-based progress',
				'Description & notes: Project details',
				'Card view: Project card grid layout',
			],
		},
		status: {
		ko: '미완성',
		en: 'Not Started',
		},
		lastUpdated: '2025-01-04',
	},

	WORK_HISTORY: {
		title: {
			ko: '업무 히스토리',
			en: 'Work History',
		},
		purpose: {
			ko: '과거에 입력한 모든 업무 기록을 조회, 필터링, 검색하고 통계를 확인하는 페이지',
			en: 'Page for viewing, filtering, searching all past work entries and checking statistics',
		},
		features: {
			ko: [
				'업무 목록: 날짜별 업무 기록 표시',
				'필터링: 날짜 범위, 카테고리, 프로젝트별 필터',
				'검색: 제목 및 내용 검색',
				'통계: 기간별 업무 시간, 건수 등',
				'상세 보기: 업무 내용, 첨부 파일, 링크 확인',
				'수정/삭제: 기존 업무 기록 편집',
				'Export: CSV/JSON 내보내기 (예정)',
			],
			en: [
				'Work list: Display work entries by date',
				'Filtering: Date range, category, project filters',
				'Search: Search by title and content',
				'Statistics: Work hours and counts by period',
				'Detail view: View content, attachments, links',
				'Edit/Delete: Modify existing entries',
				'Export: CSV/JSON export (planned)',
			],
		},
		status: {
		ko: '미완성',
		en: 'Not Started',
		},
		lastUpdated: '2025-01-04',
	},

	INBOX: {
		title: {
			ko: '알림 센터',
			en: 'Notification Center',
		},
		purpose: {
			ko: '시스템 알림, 업무 관련 메시지, AI 실시간 추천 업무 등을 확인하는 통합 알림 페이지. AI가 실시간으로 분석하여 누가 언제 어떤 업무를 처리해야 하는지 동적으로 업데이트하여 표시.',
			en: 'Unified notification page for system alerts, work-related messages, and real-time AI-recommended tasks. AI dynamically analyzes and updates recommendations on who should handle what tasks and when.',
		},
		features: {
			ko: [
				'알림 목록: 최근 알림 표시',
				'읽음/안읽음 표시',
				'알림 유형: 시스템, 업무, OKR, 프로젝트, AI 추천',
				'AI 실시간 추천: 업무 패턴, 우선순위, 담당자 분석 기반 실시간 업데이트',
				'동적 업데이트: 조직 내 업무 처리 상황에 따라 추천 업무가 실시간 변경',
				'필터링: 유형별, 읽음 상태별',
				'액션 버튼: 관련 페이지로 이동',
				'일괄 읽음 처리',
				'삭제/보관',
			],
			en: [
				'Notification list: Display recent notifications',
				'Read/unread status',
				'Notification types: System, work, OKR, project, AI recommendations',
				'Real-time AI recommendations: Updated based on work patterns, priorities, and assignee analysis',
				'Dynamic updates: Recommendations change in real-time based on team work processing status',
				'Filtering: By type and read status',
				'Action buttons: Navigate to related pages',
				'Mark all as read',
				'Delete/archive',
			],
		},
		status: {
		ko: '미완성',
		en: 'Not Started',
		},
		lastUpdated: '2025-01-05',
		notes: {
			ko: 'AI 추천 업무는 실시간으로 AI가 판단하여 업데이트됩니다. 누가 언제 어떤 업무를 처리할지 예측할 수 없는 비동기 업무 환경에서, AI는 지속적으로 조직의 업무 흐름을 분석하고 최적의 담당자와 타이밍을 실시간으로 추천합니다. 이러한 추천은 팀원의 업무 처리 속도, 전문성, 현재 워크로드, 업무 긴급도 등을 종합적으로 고려하여 동적으로 변경됩니다.',
			en: 'AI-recommended tasks are updated in real-time by AI judgment. In an asynchronous work environment where it\'s unpredictable who will handle what tasks and when, AI continuously analyzes organizational work flow and recommends optimal assignees and timing in real-time. These recommendations dynamically change based on comprehensive consideration of team members\' processing speed, expertise, current workload, task urgency, and more.',
		},
	},

	// ==================== ADMIN PAGES ====================
	ADMIN_USERS: {
		title: {
			ko: '사용자 관리',
			en: 'User Management',
		},
		purpose: {
			ko: '조직 내 모든 사용자를 조회, 추가, 수정, 삭제하고 역할 및 권한을 관리하는 관리자 페이지',
			en: 'Admin page for viewing, adding, editing, deleting users and managing roles and permissions',
		},
		features: {
			ko: [
				'사용자 목록: 전체 사용자 테이블 뷰',
				'검색 및 필터: 이름, 이메일, 부서, 역할별 필터',
				'역할 관리: User / Admin / Executive 변경',
				'초대 코드 발급: 신규 직원 초대 코드 생성',
				'사용자 상태: Active / Inactive',
				'사용자 통계: 역할별, 부서별 집계',
				'일괄 작업: 선택한 사용자 일괄 처리',
			],
			en: [
				'User list: All users table view',
				'Search & filter: By name, email, department, role',
				'Role management: Change User / Admin / Executive',
				'Invite codes: Generate codes for new employees',
				'User status: Active / Inactive',
				'User statistics: Aggregation by role and department',
				'Bulk actions: Batch processing for selected users',
			],
		},
		status: {
		ko: '미완성',
		en: 'Not Started',
		},
		lastUpdated: '2025-01-05',
		notes: {
			ko: 'Mock 데이터 사용 중. 실제 서버 연동 시 권한 검증 필요.',
			en: 'Using mock data. Permission verification needed for server integration.',
		},
	},

	ADMIN_SYSTEM_SETTINGS: {
		title: {
			ko: '시스템 설정',
			en: 'System Settings',
		},
		purpose: {
			ko: '시스템 전반의 설정을 관리하는 관리자 페이지 (보안, 백업, 로그, 카테고리 관리 등)',
			en: 'Admin page for managing system-wide settings (security, backup, logs, category management, etc.)',
		},
		features: {
			ko: [
				'보안 설정: 비밀번호 정책, 2FA 설정',
				'백업 관리: 자동 백업 설정',
				'시스템 로그: 접속 기록, 에러 로그',
				'API 설정: 외부 연동 API 키 관리',
				'알림 설정: 이메일, 푸시 알림 설정',
				'카테고리 관리: 업무 카테고리 추가/수정/삭제 (Add Category)',
			],
			en: [
				'Security settings: Password policy, 2FA',
				'Backup management: Automatic backup configuration',
				'System logs: Access logs, error logs',
				'API settings: External API key management',
				'Notification settings: Email, push notifications',
				'Category management: Add/edit/delete work categories (Add Category)',
			],
		},
		status: {
		ko: '미완성',
		en: 'Not Started',
		},
		lastUpdated: '2025-01-05',
		notes: {
			ko: '⚠️ Add Category 기능으로 추가/수정된 업무 카테고리는 Work Input 페이지와 실시간으로 공유됩니다 (localStorage: workCategories). 카테고리 변경 시 즉시 Work Input의 카테고리 선택 드롭다운에 반영됩니다.',
			en: '⚠️ Work categories added/modified via Add Category feature are shared in real-time with Work Input page (localStorage: workCategories). Category changes are immediately reflected in Work Input category dropdown.',
		},
	},

	// ==================== EXECUTIVE PAGES ====================
	EXECUTIVE_DASHBOARD: {
		title: {
			ko: '경영진 대시보드',
			en: 'Executive Dashboard',
		},
		purpose: {
			ko: '회사 전체의 핵심 지표와 성과를 한눈에 확인할 수 있는 경영진 전용 대시보드',
			en: 'Executive-only dashboard providing overview of company-wide key metrics and performance',
		},
		features: {
			ko: [
				'전사 OKR 현황: 모든 팀의 OKR 진행 상황',
				'부서별 성과: 부서별 업무 통계',
				'프로젝트 현황: 진행 중인 주요 프로젝트',
				'직원 활동: 업무 입력 현황',
				'AI 인사이트: 성과 분석 및 추천 (예정)',
			],
			en: [
				'Company-wide OKR status: All teams\' OKR progress',
				'Department performance: Work statistics by department',
				'Project status: Major ongoing projects',
				'Employee activity: Work entry status',
				'AI insights: Performance analysis and recommendations (planned)',
			],
		},
		status: {
		ko: '미완성',
		en: 'Not Started',
		},
		lastUpdated: '2025-01-04',
	},

	// EXECUTIVE_COMPANY_INFO removed - Feature moved to Company Settings > Company KPI tab

	ADMIN_COMPANY_SETTINGS: {
		title: {
			ko: '회사 설정 관리',
			en: 'Company Settings Management',
		},
		purpose: {
			ko: '회사의 기본 정보, 재무 데이터, 전사 목표(Company Goals), OKR 템플릿을 통합 관리하는 경영진 전용 종합 설정 페이지',
			en: 'Executive comprehensive settings page for managing company information, financial data, company goals, and OKR templates',
		},
		features: {
			ko: [
				'프로필 완성도: 11개 섹션별 입력 현황 및 전체 완성도 퍼센트 표시',
				'회사 기본 정보: 법인명, 사업자번호, 산업 분류, 설립 정보',
				'인력 정보: 실제 인력 수 + 시스템 사용자 통계 (역할별 집계)',
				'온라인 정보: 웹사이트 + 동적 소셜 미디어 링크 관리 (12개 플랫폼)',
				'연락처 및 대표자 정보: 주소, 연락처, CEO/CFO 정보',
				'재무 데이터: 연도별 재무제표 입력 및 문서 업로드',
				'전사 목표: Company Goals 생성 및 AI 기반 OKR 추천 활성화',
				'OKR 템플릿: 부서/역할별 맞춤 OKR 템플릿 생성 및 자동 할당',
				'버튼 UI: 부서 및 역할 선택을 직관적인 버튼 그리드로 제공',
			],
			en: [
				'Profile completion: 11 section-wise completion status with overall percentage',
				'Company basic info: Legal name, business number, industry, founding details',
				'Workforce info: Actual headcount + system user statistics (by role)',
				'Online info: Website + dynamic social media link management (12 platforms)',
				'Contact & leadership info: Address, contact, CEO/CFO details',
				'Financial data: Year-by-year financial statement entry and document upload',
				'Company goals: Create company goals and enable AI-based OKR recommendations',
				'OKR templates: Create customized OKR templates by department/role with auto-assignment',
				'Button UI: Intuitive button grid for department and role selection',
			],
		},
		status: {
		ko: '미완성',
		en: 'Not Started',
		},
		lastUpdated: '2025-01-05',
		notes: {
			ko: '시스템 사용자 정보는 localStorage의 실제 사용자 데이터를 읽어 자동 집계합니다. 전사 목표와 OKR 템플릿은 직원들의 OKR 생성 시 AI 추천 기반으로 활용됩니다. 소셜 링크는 드롭다운으로 플랫폼 선택 후 동적으로 추가/삭제 가능합니다.',
			en: 'System user info auto-aggregates from actual user data in localStorage. Company goals and OKR templates are used for AI-based recommendations when employees create OKRs. Social links can be dynamically added/removed after selecting platform from dropdown.',
		},
	},

	// ==================== ORGANIZATION PAGES ====================
	ORG_SETUP: {
		title: {
			ko: '조직 설정',
			en: 'Organization Setup',
		},
		purpose: {
			ko: '조직의 기본 정보, 부서, 역할, 별칭, 로케일, 개인정보 보호 정책, 의사결정 기본값을 설정하는 관리자 페이지',
			en: 'Admin page for configuring organization info, departments, roles, aliases, locale, privacy policies, and decision defaults',
		},
		features: {
			ko: [
				'Tab 1 - Organization: 워크스페이스 이름, 업종, 직원 수',
				'Tab 2 - Departments & Roles: 부서 및 직급 관리',
				'Tab 3 - Alias: 사용자 정의 용어 (Objective → 목표 등)',
				'Tab 4 - Locale: 언어, 타임존, 날짜/시간 형식',
				'Tab 5 - Privacy: 데이터 보존 기간, 암호화 설정',
				'Tab 6 - Decision Defaults: 의사결정 이슈 기본 설정',
				'설정 진행률: 완료된 항목 퍼센트 표시',
				'저장 및 초기화: 설정 저장 및 리셋',
			],
			en: [
				'Tab 1 - Organization: Workspace name, industry, employee count',
				'Tab 2 - Departments & Roles: Department and role management',
				'Tab 3 - Alias: Custom terminology (Objective → Goal, etc.)',
				'Tab 4 - Locale: Language, timezone, date/time format',
				'Tab 5 - Privacy: Data retention, encryption settings',
				'Tab 6 - Decision Defaults: Decision issue default settings',
				'Setup progress: Percentage of completed items',
				'Save & Reset: Save and reset settings',
			],
		},
		status: {
		ko: '미완성',
		en: 'Not Started',
		},
		lastUpdated: '2025-01-05',
	},

	// ==================== OTHER PAGES ====================
	SETTINGS: {
		title: {
			ko: '개인 설정',
			en: 'Personal Settings',
		},
		purpose: {
			ko: '개인 프로필, 알림, 표시 설정 등을 관리하는 사용자 설정 페이지',
			en: 'User settings page for managing personal profile, notifications, display preferences',
		},
		features: {
			ko: [
				'프로필 관리: 이름, 이메일, 프로필 사진',
				'비밀번호 변경',
				'알림 설정: 이메일, 푸시 알림 on/off',
				'테마 설정: 라이트/다크 모드',
				'언어 설정',
				'계정 삭제',
			],
			en: [
				'Profile management: Name, email, profile picture',
				'Change password',
				'Notification settings: Email, push notifications on/off',
				'Theme: Light/dark mode',
				'Language settings',
				'Delete account',
			],
		},
		status: {
		ko: '미완성',
		en: 'Not Started',
		},
		lastUpdated: '2025-01-04',
	},

	ANALYTICS: {
		title: {
			ko: '분석 대시보드 (구버전)',
			en: 'Analytics Dashboard (Legacy)',
		},
		purpose: {
			ko: '⚠️ 이 페이지는 /app/executive로 리다이렉트됩니다. Executive 페이지를 참조하세요.',
			en: '⚠️ This page redirects to /app/executive. See Executive page instead.',
		},
		features: {
			ko: [
				'→ /app/executive로 자동 리다이렉트',
			],
			en: [
				'→ Auto-redirects to /app/executive',
			],
		},
		status: {
			ko: '리다이렉트됨',
			en: 'Redirected',
		},
		lastUpdated: '2025-01-06',
	},

	EXECUTIVE: {
		title: {
			ko: '고급 분석 & 인사이트 (Analytics & Insights)',
			en: 'Advanced Analytics & Insights',
		},
		purpose: {
			ko: '실제 localStorage 데이터를 기반으로 한 전문가 수준의 고급 분석 대시보드. 4개 탭으로 구성: Overview, Comparison, Team Performance, Reports',
			en: 'Professional-grade advanced analytics dashboard based on real localStorage data. 4 tabs: Overview, Comparison, Team Performance, Reports',
		},
		features: {
			ko: [
				'📊 Overview Tab: KPI 카드, Work Entries Trend (LineChart), Category Distribution (PieChart), AI-Powered Insights',
				'📈 Comparison Tab: 기간 비교 분석 (Current vs Previous), BarChart, 상세 변화율 분석',
				'👥 Team Performance Tab: Department Rankings, Project Analytics (Risk Assessment), OKR Performance',
				'📄 Reports Tab: CSV/JSON Export, Printable PDF Report, 5가지 리포트 타입',
				'🔄 실시간 필터: 7개 날짜 범위 프리셋 (Last 7/30/90 days, This/Last Month, This Year)',
				'🎯 실제 데이터 활용: workEntries, projects, objectives localStorage 데이터 분석',
				'📊 Recharts 통합: Line, Bar, Pie 차트로 데이터 시각화',
				'💡 AI Insights: 자동 생성된 인사이트 카드 (성과, 위험, 추천사항)',
				'📤 Export 기능: CSV (5종류), JSON (전체 리포트), PDF (Print-friendly)',
				'🎨 Professional UX: 최고 기획자 수준의 UI/UX, 최고 개발자 수준의 코드',
			],
			en: [
				'📊 Overview Tab: KPI cards, Work Entries Trend (LineChart), Category Distribution (PieChart), AI-Powered Insights',
				'📈 Comparison Tab: Period comparison (Current vs Previous), BarChart, detailed change analysis',
				'👥 Team Performance Tab: Department Rankings, Project Analytics (Risk Assessment), OKR Performance',
				'📄 Reports Tab: CSV/JSON Export, Printable PDF Report, 5 report types',
				'🔄 Real-time Filters: 7 date range presets (Last 7/30/90 days, This/Last Month, This Year)',
				'🎯 Real Data: Analyzes workEntries, projects, objectives from localStorage',
				'📊 Recharts Integration: Data visualization with Line, Bar, Pie charts',
				'💡 AI Insights: Auto-generated insight cards (performance, risks, recommendations)',
				'📤 Export Features: CSV (5 types), JSON (full report), PDF (print-friendly)',
				'🎨 Professional UX: Top-tier product manager UX + top-tier developer code quality',
			],
		},
		status: {
			ko: '완료 ✅ (최고 수준 구현)',
			en: 'Completed ✅ (Professional-grade)',
		},
		lastUpdated: '2025-01-06',
		notes: {
			ko: '모든 분석 로직은 실제 localStorage 데이터에서 계산됩니다. Mock 데이터 없음. 9개 파일로 모듈화 (types, utils, 4 tab components, main page).',
			en: 'All analytics calculated from real localStorage data. No mock data. Modularized into 9 files (types, utils, 4 tab components, main page).',
		},
	},

	AI_RECOMMENDATIONS: {
		title: {
			ko: 'AI 추천',
			en: 'AI Recommendations',
		},
		purpose: {
			ko: 'AI가 분석한 업무 패턴 및 추천 사항을 제공하는 페이지 (향후 AI 기능 통합 예정)',
			en: 'Page for AI-analyzed work patterns and recommendations (AI integration planned)',
		},
		features: {
			ko: [
				'업무 패턴 분석',
				'효율성 개선 제안',
				'OKR 달성 가능성 예측',
				'리소스 할당 추천',
			],
			en: [
				'Work pattern analysis',
				'Efficiency improvement suggestions',
				'OKR achievement probability prediction',
				'Resource allocation recommendations',
			],
		},
		status: {
		ko: '미완성',
		en: 'Not Started',
		},
		lastUpdated: '2025-01-04',
	},

	// HELP removed - Feature removed from application
	// POLICY removed - Feature removed from application

	NO_MEET: {
		title: {
			ko: '노미팅데이',
			en: 'No Meeting Day',
		},
		purpose: {
			ko: '집중 업무를 위한 회의 없는 날을 설정하고 관리하는 페이지',
			en: 'Page for setting and managing meeting-free days for focused work',
		},
		features: {
			ko: [
				'노미팅데이 설정: 요일 및 날짜 지정',
				'팀별 설정: 부서별 노미팅데이 설정',
				'예외 설정: 긴급 회의 허용 규칙',
				'달력 뷰: 노미팅데이 시각화',
			],
			en: [
				'No meeting day setup: Specify days of week and dates',
				'Team-based settings: Department-specific no meeting days',
				'Exception rules: Emergency meeting allowance',
				'Calendar view: Visualize no meeting days',
			],
		},
		status: {
		ko: '미완성',
		en: 'Not Started',
		},
		lastUpdated: '2025-01-04',
	},

	// FINANCE removed - Feature integrated into Company Settings > Financial Data tab

	EXPENSES: {
		title: {
			ko: '경비 관리',
			en: 'Expense Management',
		},
		purpose: {
			ko: '직원들의 경비 신청, 승인, 정산을 관리하는 페이지',
			en: 'Page for managing employee expense requests, approvals, and settlements',
		},
		features: {
			ko: [
				'경비 신청: 영수증 업로드, 카테고리 선택',
				'승인 워크플로우: 관리자 승인',
				'정산 내역: 승인/거부/정산 완료 상태',
				'경비 통계: 월별, 카테고리별 집계',
			],
			en: [
				'Expense submission: Receipt upload, category selection',
				'Approval workflow: Manager approval',
				'Settlement history: Approved/rejected/settled status',
				'Expense statistics: Monthly, category aggregation',
			],
		},
		status: {
		ko: '미완성',
		en: 'Not Started',
		},
		lastUpdated: '2025-01-04',
	},
}

export default DEV_MEMOS

