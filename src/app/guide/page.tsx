import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import { PageHeader } from '../../components/common/PageHeader'
import { 
	LayoutDashboard, 
	FileText, 
	Mail, 
	Sparkles, 
	History, 
	CheckCircle2, 
	FolderKanban, 
	Target,
	ArrowRight,
	Users,
	Settings,
	BookOpen,
	Zap,
	Database,
	GitBranch,
	Workflow,
	Bell,
	MessageSquare,
	Languages,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Button } from '../../components/ui/Button'

type Language = 'ko' | 'en'

interface PageInfo {
	id: string
	title: string
	path: string
	icon: any
	category: 'work' | 'management' | 'admin'
	description: string
	keyFeatures: string[]
	dataFlow: {
		input?: string[]
		output?: string[]
		storage?: string[]
	}
}

export default function GuidePage() {
	const navigate = useNavigate()
	const [language, setLanguage] = useState<Language>('ko')
	
	// Load language from localStorage on mount
	useEffect(() => {
		const saved = localStorage.getItem('guide_language') as Language
		if (saved && (saved === 'ko' || saved === 'en')) {
			setLanguage(saved)
		}
	}, [])
	
	// Save language to localStorage when changed
	const toggleLanguage = () => {
		const newLang = language === 'ko' ? 'en' : 'ko'
		setLanguage(newLang)
		localStorage.setItem('guide_language', newLang)
	}
	
	const pages: PageInfo[] = language === 'ko' ? [
		{
			id: 'dashboard',
			title: 'Dashboard',
			path: '/app/dashboard',
			icon: LayoutDashboard,
			category: 'work',
			description: '개인 및 팀의 업무 현황을 한눈에 파악할 수 있는 중앙 허브',
			keyFeatures: [
				'개인 통계 (New Reviews, My Tasks, Urgent, This Week, Total Work)',
				'회사/부서 통계 (Company Total, This Week, Active Projects, Department Performance)',
				'긴급 Task 및 읽지 않은 리뷰 요약',
				'최근 작업 및 팀 활동 표시',
				'Quick Actions (Log Work, View Tasks, Projects, Team History)',
			],
			dataFlow: {
				input: ['workEntries', 'received_reviews', 'manual_tasks', 'ai_recommendations', 'projects'],
				output: ['Statistics', 'Recent Activities', 'Action Items'],
				storage: ['Real-time data from localStorage'],
			},
		},
		{
			id: 'input',
			title: 'Work Input',
			path: '/app/input',
			icon: FileText,
			category: 'work',
			description: '작업 내용을 기록하고 제출하는 페이지. 자유 입력 및 Task 진행상황 입력 지원',
			keyFeatures: [
				'두 가지 입력 모드: Free Input / Task Progress',
				'Task 선택 시 자동으로 제목/설명 로드',
				'진행률 슬라이더 (0-100%) 및 Progress Comment',
				'프로젝트/OKR 연동',
				'파일 업로드 및 링크 첨부',
				'자동 Draft 저장',
				'사용자 정보 자동 저장 (submittedBy, department)',
				'프로젝트 선택 시 자동 Review 요청 알림',
				'Task 100% 완료 시 완료 알림 전송',
			],
			dataFlow: {
				input: ['manual_tasks', 'ai_recommendations', 'projects', 'objectives', 'user info (AuthContext)'],
				output: ['workEntries', 'messages (review request)', 'messages (task complete)'],
				storage: ['workEntries', 'messages'],
			},
		},
		{
			id: 'messages',
			title: 'Messages',
			path: '/app/messages',
			icon: Mail,
			category: 'work',
			description: '통합 알림 센터. Task 할당, 리뷰, 프로젝트 업데이트 등 모든 알림 관리',
			keyFeatures: [
				'5가지 메시지 타입 (Task, Review, Approval, Project, Team)',
				'AI 인사이트 (Summary, Estimated Time, Urgency, Recommendations)',
				'Quick Actions (Accept Task, View Review, Update Work, etc.)',
				'스마트 필터링 (All, Unread, Starred, Type별)',
				'Related Documents 및 Suggested Actions',
				'읽음/별표/보관 상태 관리',
			],
			dataFlow: {
				input: ['messages (from various sources)'],
				output: ['Notifications', 'Action Items'],
				storage: ['messages'],
			},
		},
		{
			id: 'ai-recommendations',
			title: 'AI Recommendations',
			path: '/app/ai-recommendations',
			icon: Sparkles,
			category: 'work',
			description: 'AI가 자동 생성한 Task와 수동으로 생성한 Task 관리',
			keyFeatures: [
				'AI 자동 Task 생성 (프로젝트 생성 시)',
				'Manual Task 생성 (부서 → 사람 2단계 선택)',
				'Task 타입 구분 (AI vs Manual badge)',
				'프로젝트별 필터링',
				'Task 상세 정보 (AI Analysis, Related Members, Instructions)',
				'Active/Related 팀 멤버 구분',
				'Task 할당 시 자동 Messages 알림',
				'통계 카드 (Total Pending, AI Generated, Manual Tasks, Accepted)',
			],
			dataFlow: {
				input: ['projects (for AI generation)', 'users', 'user info (AuthContext)'],
				output: ['manual_tasks', 'ai_recommendations', 'messages (task assignment)'],
				storage: ['manual_tasks', 'ai_recommendations', 'messages'],
			},
		},
		{
			id: 'work-history',
			title: 'Work History',
			path: '/app/work-history',
			icon: History,
			category: 'work',
			description: '팀 전체의 작업 이력 조회. 다양한 필터로 원하는 정보 검색',
			keyFeatures: [
				'팀 전체 작업 이력 표시',
				'다중 필터 (Category, Project, Department, Team Member)',
				'"My History Only" 필터',
				'작성자 및 부서 정보 표시',
				'첨부 파일 및 링크 관리',
				'통계 카드 (Total Entries, This Week, Total Hours, Team Members)',
				'검색 및 정렬 기능',
			],
			dataFlow: {
				input: ['workEntries', 'projects', 'user info (AuthContext)'],
				output: ['Filtered Work History', 'Statistics'],
				storage: ['workEntries (read only)'],
			},
		},
		{
			id: 'work-review',
			title: 'Work Review',
			path: '/app/work-review',
			icon: CheckCircle2,
			category: 'work',
			description: '내가 제출한 작업에 대해 받은 리뷰 및 코멘트 확인',
			keyFeatures: [
				'나에게 온 리뷰만 표시',
				'리뷰 타입별 필터링 (Approved, Changes Requested, Rejected)',
				'프로젝트별 필터링',
				'읽음/읽지 않음 상태 관리',
				'리뷰어 정보 및 타임스탬프',
				'Quick Actions (Update Work, Resubmit, View History)',
				'통계 (Total Reviews, Unread, Approved, Changes, Rejected)',
			],
			dataFlow: {
				input: ['received_reviews', 'projects'],
				output: ['Updated read status'],
				storage: ['received_reviews'],
			},
		},
		{
			id: 'projects',
			title: 'Projects',
			path: '/app/projects',
			icon: FolderKanban,
			category: 'management',
			description: '프로젝트 생성 및 관리. AI Task 자동 생성 통합',
			keyFeatures: [
				'프로젝트 생성 (이름, 설명, 부서, 목표, 일정, 파일, 링크)',
				'프로젝트 생성 시 AI가 자동으로 6가지 Task 생성',
				'프로젝트 카드에 최근 작업 표시',
				'Status별 필터링 (Planning, Active, On-hold, Completed)',
				'List/Timeline 뷰 전환',
				'Progress 추적',
				'팀 멤버 및 목표 관리',
			],
			dataFlow: {
				input: ['departments', 'user info (AuthContext)'],
				output: ['projects', 'ai_recommendations (auto-generated tasks)'],
				storage: ['projects', 'ai_recommendations'],
			},
		},
		{
			id: 'okr',
			title: 'My Goals (OKR)',
			path: '/app/okr',
			icon: Target,
			category: 'management',
			description: 'OKR (Objectives and Key Results) 목표 설정 및 추적',
			keyFeatures: [
				'분기별 목표 설정',
				'Key Results 관리',
				'진행률 추적',
				'Work Entry와 연동',
				'팀별/개인별 목표 관리',
			],
			dataFlow: {
				input: ['objectives', 'workEntries'],
				output: ['Progress Updates'],
				storage: ['objectives'],
			},
		},
		{
			id: 'settings',
			title: 'Settings',
			path: '/app/settings',
			icon: Settings,
			category: 'admin',
			description: '사용자 프로필 및 시스템 설정',
			keyFeatures: [
				'프로필 정보 관리 (이름, 이메일, 부서, 직급)',
				'다중 Job 지원',
				'알림 설정',
				'비밀번호 변경',
				'언어/시간대 설정',
			],
			dataFlow: {
				input: ['user info (AuthContext)', 'departments', 'jobs'],
				output: ['Updated user profile'],
				storage: ['userProfile', 'userPreferences'],
			},
		},
	] : [
		{
			id: 'dashboard',
			title: 'Dashboard',
			path: '/app/dashboard',
			icon: LayoutDashboard,
			category: 'work',
			description: 'Central hub to view personal and team work status at a glance',
			keyFeatures: [
				'Personal stats (New Reviews, My Tasks, Urgent, This Week, Total Work)',
				'Company/Department stats (Company Total, This Week, Active Projects, Department Performance)',
				'Urgent tasks and unread review summary',
				'Recent work and team activity display',
				'Quick Actions (Log Work, View Tasks, Projects, Team History)',
			],
			dataFlow: {
				input: ['workEntries', 'received_reviews', 'manual_tasks', 'ai_recommendations', 'projects'],
				output: ['Statistics', 'Recent Activities', 'Action Items'],
				storage: ['Real-time data from localStorage'],
			},
		},
		{
			id: 'input',
			title: 'Work Input',
			path: '/app/input',
			icon: FileText,
			category: 'work',
			description: 'Record and submit work. Supports free input and task progress input',
			keyFeatures: [
				'Two input modes: Free Input / Task Progress',
				'Auto-load title/description when task selected',
				'Progress slider (0-100%) and Progress Comment',
				'Project/OKR integration',
				'File upload and link attachment',
				'Auto Draft save',
				'Auto save user info (submittedBy, department)',
				'Auto review request notification when project selected',
				'Task completion notification when 100%',
			],
			dataFlow: {
				input: ['manual_tasks', 'ai_recommendations', 'projects', 'objectives', 'user info (AuthContext)'],
				output: ['workEntries', 'messages (review request)', 'messages (task complete)'],
				storage: ['workEntries', 'messages'],
			},
		},
		{
			id: 'messages',
			title: 'Messages',
			path: '/app/messages',
			icon: Mail,
			category: 'work',
			description: 'Integrated notification center. Manage all notifications for task assignment, reviews, project updates',
			keyFeatures: [
				'5 message types (Task, Review, Approval, Project, Team)',
				'AI insights (Summary, Estimated Time, Urgency, Recommendations)',
				'Quick Actions (Accept Task, View Review, Update Work, etc.)',
				'Smart filtering (All, Unread, Starred, By Type)',
				'Related Documents and Suggested Actions',
				'Read/Star/Archive status management',
			],
			dataFlow: {
				input: ['messages (from various sources)'],
				output: ['Notifications', 'Action Items'],
				storage: ['messages'],
			},
		},
		{
			id: 'ai-recommendations',
			title: 'AI Recommendations',
			path: '/app/ai-recommendations',
			icon: Sparkles,
			category: 'work',
			description: 'Manage AI-generated and manually created tasks',
			keyFeatures: [
				'AI auto task generation (when project created)',
				'Manual task creation (2-step: Department → Person)',
				'Task type distinction (AI vs Manual badge)',
				'Project filtering',
				'Task details (AI Analysis, Related Members, Instructions)',
				'Active/Related team member distinction',
				'Auto Messages notification on task assignment',
				'Statistics cards (Total Pending, AI Generated, Manual Tasks, Accepted)',
			],
			dataFlow: {
				input: ['projects (for AI generation)', 'users', 'user info (AuthContext)'],
				output: ['manual_tasks', 'ai_recommendations', 'messages (task assignment)'],
				storage: ['manual_tasks', 'ai_recommendations', 'messages'],
			},
		},
		{
			id: 'work-history',
			title: 'Work History',
			path: '/app/work-history',
			icon: History,
			category: 'work',
			description: 'View team work history. Search with various filters',
			keyFeatures: [
				'Display all team work history',
				'Multiple filters (Category, Project, Department, Team Member)',
				'"My History Only" filter',
				'Author and department info display',
				'Attached files and links management',
				'Statistics cards (Total Entries, This Week, Total Hours, Team Members)',
				'Search and sort functions',
			],
			dataFlow: {
				input: ['workEntries', 'projects', 'user info (AuthContext)'],
				output: ['Filtered Work History', 'Statistics'],
				storage: ['workEntries (read only)'],
			},
		},
		{
			id: 'work-review',
			title: 'Work Review',
			path: '/app/work-review',
			icon: CheckCircle2,
			category: 'work',
			description: 'View reviews and comments received on submitted work',
			keyFeatures: [
				'Show only reviews for me',
				'Filtering by review type (Approved, Changes Requested, Rejected)',
				'Project filtering',
				'Read/Unread status management',
				'Reviewer info and timestamp',
				'Quick Actions (Update Work, Resubmit, View History)',
				'Statistics (Total Reviews, Unread, Approved, Changes, Rejected)',
			],
			dataFlow: {
				input: ['received_reviews', 'projects'],
				output: ['Updated read status'],
				storage: ['received_reviews'],
			},
		},
		{
			id: 'projects',
			title: 'Projects',
			path: '/app/projects',
			icon: FolderKanban,
			category: 'management',
			description: 'Create and manage projects. AI task auto-generation integrated',
			keyFeatures: [
				'Project creation (name, description, dept, goals, schedule, files, links)',
				'AI auto-generates 6 tasks on project creation',
				'Recent work display on project card',
				'Status filtering (Planning, Active, On-hold, Completed)',
				'List/Timeline view toggle',
				'Progress tracking',
				'Team member and goal management',
			],
			dataFlow: {
				input: ['departments', 'user info (AuthContext)'],
				output: ['projects', 'ai_recommendations (auto-generated tasks)'],
				storage: ['projects', 'ai_recommendations'],
			},
		},
		{
			id: 'okr',
			title: 'My Goals (OKR)',
			path: '/app/okr',
			icon: Target,
			category: 'management',
			description: 'OKR (Objectives and Key Results) goal setting and tracking',
			keyFeatures: [
				'Quarterly goal setting',
				'Key Results management',
				'Progress tracking',
				'Work Entry integration',
				'Team/Personal goal management',
			],
			dataFlow: {
				input: ['objectives', 'workEntries'],
				output: ['Progress Updates'],
				storage: ['objectives'],
			},
		},
		{
			id: 'settings',
			title: 'Settings',
			path: '/app/settings',
			icon: Settings,
			category: 'admin',
			description: 'User profile and system settings',
			keyFeatures: [
				'Profile info management (name, email, dept, position)',
				'Multiple job support',
				'Notification settings',
				'Password change',
				'Language/Timezone settings',
			],
			dataFlow: {
				input: ['user info (AuthContext)', 'departments', 'jobs'],
				output: ['Updated user profile'],
				storage: ['userProfile', 'userPreferences'],
			},
		},
	]

	const dataFlowDiagram = language === 'ko' ? [
		{
			title: 'Work Entry Flow',
			steps: [
				'1. Work Input → workEntries (with user info)',
				'2. workEntries → Messages (review request if project selected)',
				'3. workEntries → Work History (all team)',
				'4. workEntries → Dashboard (statistics)',
			],
		},
		{
			title: 'Task Assignment Flow',
			steps: [
				'1. Projects → AI Task Generator → ai_recommendations',
				'2. AI Recommendations (Manual) → manual_tasks + Messages',
				'3. Work Input (Task Mode) → Task Progress Update',
				'4. Task 100% → Messages (completion notification)',
			],
		},
		{
			title: 'Review Flow',
			steps: [
				'1. Work Input → Review Request → Messages',
				'2. Reviewer → received_reviews',
				'3. received_reviews → Work Review Page',
				'4. Work Review → Dashboard (unread count)',
			],
		},
	] : [
		{
			title: 'Work Entry Flow',
			steps: [
				'1. Work Input → workEntries (with user info)',
				'2. workEntries → Messages (review request if project selected)',
				'3. workEntries → Work History (all team)',
				'4. workEntries → Dashboard (statistics)',
			],
		},
		{
			title: 'Task Assignment Flow',
			steps: [
				'1. Projects → AI Task Generator → ai_recommendations',
				'2. AI Recommendations (Manual) → manual_tasks + Messages',
				'3. Work Input (Task Mode) → Task Progress Update',
				'4. Task 100% → Messages (completion notification)',
			],
		},
		{
			title: 'Review Flow',
			steps: [
				'1. Work Input → Review Request → Messages',
				'2. Reviewer → received_reviews',
				'3. received_reviews → Work Review Page',
				'4. Work Review → Dashboard (unread count)',
			],
		},
	]

	const translations = {
		ko: {
			title: 'Service Guide',
			subtitle: 'Complete overview of all pages, features, and data flows in Proce',
			totalPages: '전체 페이지',
			storageKeys: 'Storage Keys',
			dataFlows: '데이터 플로우',
			integrations: '통합 기능',
			pagesOverview: 'Pages Overview',
			dataFlowDiagrams: '데이터 플로우 다이어그램',
			localStorageKeys: 'LocalStorage Keys',
			keyIntegrations: '주요 통합 기능',
			developmentNotes: 'Development Notes',
			completedFeatures: '✅ 완료된 기능',
			backendIntegration: '🔄 백엔드 통합 준비',
			recommendedNext: '📝 권장 다음 단계',
			workManagement: '업무 관리',
			projectManagement: '프로젝트 관리',
			administration: '관리자',
			openPage: 'Open Page',
			keyFeatures: '✨ 주요 기능',
			input: '📥 Input',
			output: '📤 Output',
			storage: '💾 Storage',
		},
		en: {
			title: 'Service Guide',
			subtitle: 'Complete overview of all pages, features, and data flows in Proce',
			totalPages: 'Total Pages',
			storageKeys: 'Storage Keys',
			dataFlows: 'Data Flows',
			integrations: 'Integrations',
			pagesOverview: 'Pages Overview',
			dataFlowDiagrams: 'Data Flow Diagrams',
			localStorageKeys: 'LocalStorage Keys',
			keyIntegrations: 'Key Integrations',
			developmentNotes: 'Development Notes',
			completedFeatures: '✅ Completed Features',
			backendIntegration: '🔄 Backend Integration Ready',
			recommendedNext: '📝 Recommended Next Steps',
			workManagement: 'Work Management',
			projectManagement: 'Project Management',
			administration: 'Administration',
			openPage: 'Open Page',
			keyFeatures: '✨ Key Features',
			input: '📥 Input',
			output: '📤 Output',
			storage: '💾 Storage',
		},
	}

	const t = translations[language]

	const storageKeys = language === 'ko' ? [
		{ key: 'workEntries', description: '모든 작업 기록 (사용자 정보, 프로젝트 정보 포함)' },
		{ key: 'messages', description: '통합 알림 메시지 (Task, Review, Approval, Project, Team)' },
		{ key: 'manual_tasks', description: '수동 생성 Task' },
		{ key: 'ai_recommendations', description: 'AI 자동 생성 Task' },
		{ key: 'received_reviews', description: '받은 리뷰 목록' },
		{ key: 'projects', description: '프로젝트 목록' },
		{ key: 'objectives', description: 'OKR 목표' },
		{ key: 'departments', description: '부서 목록' },
		{ key: 'users', description: '사용자 목록' },
	] : [
		{ key: 'workEntries', description: 'All work entries (includes user info, project info)' },
		{ key: 'messages', description: 'Integrated notification messages (Task, Review, Approval, Project, Team)' },
		{ key: 'manual_tasks', description: 'Manually created tasks' },
		{ key: 'ai_recommendations', description: 'AI auto-generated tasks' },
		{ key: 'received_reviews', description: 'Received reviews list' },
		{ key: 'projects', description: 'Projects list' },
		{ key: 'objectives', description: 'OKR objectives' },
		{ key: 'departments', description: 'Departments list' },
		{ key: 'users', description: 'Users list' },
	]

	const getCategoryColor = (category: string) => {
		switch (category) {
			case 'work':
				return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
			case 'management':
				return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
			case 'admin':
				return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
			default:
				return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
		}
	}

	const getCategoryLabel = (category: string) => {
		if (language === 'en') {
			switch (category) {
				case 'work':
					return 'Work Management'
				case 'management':
					return 'Project Management'
				case 'admin':
					return 'Administration'
				default:
					return 'Other'
			}
		} else {
			switch (category) {
				case 'work':
					return '업무 관리'
				case 'management':
					return '프로젝트 관리'
				case 'admin':
					return '관리자'
				default:
					return '기타'
			}
		}
	}

	return (
		<div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
			{/* Header */}
			<PageHeader
				title={t.title}
				description={t.subtitle}
				icon={BookOpen}
				actions={
					<Button
						onClick={toggleLanguage}
						variant="outline"
						size="sm"
					>
						<Languages className="h-4 w-4 sm:mr-2" />
						<span className="hidden sm:inline">{language === 'ko' ? 'English' : '한국어'}</span>
					</Button>
				}
			/>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
				{/* Quick Stats */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<Card className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<LayoutDashboard className="h-8 w-8 text-blue-600 dark:text-blue-400" />
								<div>
									<p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{t.totalPages}</p>
									<p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{pages.length}</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<Database className="h-8 w-8 text-purple-600 dark:text-purple-400" />
								<div>
									<p className="text-sm text-purple-600 dark:text-purple-400 font-medium">{t.storageKeys}</p>
									<p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{storageKeys.length}</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-linear-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<Workflow className="h-8 w-8 text-green-600 dark:text-green-400" />
								<div>
									<p className="text-sm text-green-600 dark:text-green-400 font-medium">{t.dataFlows}</p>
									<p className="text-2xl font-bold text-green-900 dark:text-green-100">{dataFlowDiagram.length}</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-linear-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<Zap className="h-8 w-8 text-orange-600 dark:text-orange-400" />
								<div>
									<p className="text-sm text-orange-600 dark:text-orange-400 font-medium">{t.integrations}</p>
									<p className="text-2xl font-bold text-orange-900 dark:text-orange-100">AI + Auth</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Pages Overview */}
				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<LayoutDashboard className="h-5 w-5 text-primary" />
							<h2 className="text-xl font-bold">{t.pagesOverview}</h2>
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{pages.map((page) => {
								const Icon = page.icon
								return (
									<div
										key={page.id}
										className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:shadow-md transition-shadow cursor-pointer"
										onClick={() => navigate(page.path)}
									>
										<div className="flex items-start gap-4">
											<div className="p-3 bg-primary/10 rounded-xl shrink-0">
												<Icon className="h-6 w-6 text-primary" />
											</div>
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2 mb-2">
													<h3 className="text-lg font-bold">{page.title}</h3>
													<span className={`text-xs font-medium px-2 py-1 rounded ${getCategoryColor(page.category)}`}>
														{getCategoryLabel(page.category)}
													</span>
													<span className="text-sm text-neutral-500 dark:text-neutral-400">
														{page.path}
													</span>
												</div>
												<p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
													{page.description}
												</p>

												{/* Key Features */}
												<div className="mb-3">
													<p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
														{t.keyFeatures}:
													</p>
													<ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
														{page.keyFeatures.map((feature, idx) => (
															<li key={idx} className="flex items-start gap-2">
																<span className="text-primary mt-1">•</span>
																<span>{feature}</span>
															</li>
														))}
													</ul>
												</div>

												{/* Data Flow */}
												<div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
													{page.dataFlow.input && (
														<div className="p-2 bg-blue-50 dark:bg-blue-900/10 rounded border border-blue-200 dark:border-blue-800">
															<p className="font-semibold text-blue-700 dark:text-blue-300 mb-1">{t.input}</p>
															{page.dataFlow.input.map((item, idx) => (
																<p key={idx} className="text-blue-600 dark:text-blue-400">• {item}</p>
															))}
														</div>
													)}
													{page.dataFlow.output && (
														<div className="p-2 bg-green-50 dark:bg-green-900/10 rounded border border-green-200 dark:border-green-800">
															<p className="font-semibold text-green-700 dark:text-green-300 mb-1">{t.output}</p>
															{page.dataFlow.output.map((item, idx) => (
																<p key={idx} className="text-green-600 dark:text-green-400">• {item}</p>
															))}
														</div>
													)}
													{page.dataFlow.storage && (
														<div className="p-2 bg-purple-50 dark:bg-purple-900/10 rounded border border-purple-200 dark:border-purple-800">
															<p className="font-semibold text-purple-700 dark:text-purple-300 mb-1">{t.storage}</p>
															{page.dataFlow.storage.map((item, idx) => (
																<p key={idx} className="text-purple-600 dark:text-purple-400">• {item}</p>
															))}
														</div>
													)}
												</div>

												<button
													onClick={() => navigate(page.path)}
													className="mt-3 flex items-center gap-2 text-sm text-primary hover:underline"
												>
													{t.openPage}
													<ArrowRight className="h-4 w-4" />
												</button>
											</div>
										</div>
									</div>
								)
							})}
						</div>
					</CardContent>
				</Card>

				{/* Data Flow Diagrams */}
				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<GitBranch className="h-5 w-5 text-primary" />
							<h2 className="text-xl font-bold">{t.dataFlowDiagrams}</h2>
						</div>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							{dataFlowDiagram.map((flow, idx) => (
								<div
									key={idx}
									className="p-4 bg-linear-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700"
								>
									<h3 className="font-bold mb-3 flex items-center gap-2">
										<Workflow className="h-4 w-4 text-primary" />
										{flow.title}
									</h3>
									<div className="space-y-2">
										{flow.steps.map((step, stepIdx) => (
											<div key={stepIdx} className="flex items-start gap-2 text-sm">
												<ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
												<span className="text-neutral-700 dark:text-neutral-300">{step}</span>
											</div>
										))}
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* LocalStorage Keys */}
				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<Database className="h-5 w-5 text-primary" />
							<h2 className="text-xl font-bold">{t.localStorageKeys}</h2>
						</div>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							{storageKeys.map((storage: any, idx: number) => (
								<div
									key={idx}
									className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800"
								>
									<div className="flex items-start gap-2">
										<code className="text-sm font-mono text-primary bg-primary/10 px-2 py-1 rounded shrink-0">
											{storage.key}
										</code>
										<p className="text-sm text-neutral-600 dark:text-neutral-400">
											{storage.description}
										</p>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Key Integrations */}
				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<Zap className="h-5 w-5 text-primary" />
							<h2 className="text-xl font-bold">{t.keyIntegrations}</h2>
						</div>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{/* AuthContext Integration */}
							<div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800">
								<div className="flex items-center gap-2 mb-3">
									<Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
									<h3 className="font-bold text-blue-900 dark:text-blue-100">AuthContext Integration</h3>
								</div>
								<ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
									<li>• 모든 페이지에서 user 정보 일관되게 사용</li>
									<li>• Work Entry 저장 시 자동으로 submittedBy, department 추가</li>
									<li>• Messages 생성 시 from, fromDepartment 자동 설정</li>
									<li>• Dashboard 통계 계산에 currentUserId 사용</li>
								</ul>
							</div>

							{/* AI Integration */}
							<div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-200 dark:border-purple-800">
								<div className="flex items-center gap-2 mb-3">
									<Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
									<h3 className="font-bold text-purple-900 dark:text-purple-100">AI Integration</h3>
								</div>
								<ul className="text-sm text-purple-700 dark:text-purple-300 space-y-2">
									<li>• 프로젝트 생성 시 6가지 AI Task 자동 생성</li>
									<li>• Task 우선순위 및 deadline 자동 설정</li>
									<li>• AI 분석 정보 포함 (분석 이유, 관련 팀원, 추천사항)</li>
									<li>• Messages에 AI Summary 및 Insights 제공</li>
								</ul>
							</div>

							{/* Notification System */}
							<div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-200 dark:border-green-800">
								<div className="flex items-center gap-2 mb-3">
									<Bell className="h-5 w-5 text-green-600 dark:text-green-400" />
									<h3 className="font-bold text-green-900 dark:text-green-100">Notification System</h3>
								</div>
								<ul className="text-sm text-green-700 dark:text-green-300 space-y-2">
									<li>• Sidebar에 실시간 Badge (Messages, Work Review)</li>
									<li>• 10초마다 자동 새로고침</li>
									<li>• Task 할당 시 자동 알림</li>
									<li>• Work Entry 제출 시 Review 요청 알림</li>
									<li>• Task 완료 시 완료 알림</li>
								</ul>
							</div>

							{/* Data Consistency */}
							<div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-200 dark:border-orange-800">
								<div className="flex items-center gap-2 mb-3">
									<MessageSquare className="h-5 w-5 text-orange-600 dark:text-orange-400" />
									<h3 className="font-bold text-orange-900 dark:text-orange-100">Data Consistency</h3>
								</div>
								<ul className="text-sm text-orange-700 dark:text-orange-300 space-y-2">
									<li>• 모든 Work Entry에 사용자 정보 포함</li>
									<li>• Messages 데이터 구조 통일</li>
									<li>• Project name 자동 저장</li>
									<li>• Task ID 연결로 추적 가능</li>
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Development Notes */}
				<Card className="border-2 border-primary/20">
					<CardHeader>
						<div className="flex items-center gap-2">
							<BookOpen className="h-5 w-5 text-primary" />
							<h2 className="text-xl font-bold">{t.developmentNotes}</h2>
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-4 text-sm">
							<div>
								<h3 className="font-bold mb-2">{t.completedFeatures}</h3>
								<ul className="space-y-1 text-neutral-600 dark:text-neutral-400">
									<li>• Phase 1: 데이터 일관성 (AuthContext 통합, Work Entry 필수 필드, Messages 구조 통일)</li>
									<li>• Phase 2: 기능 연동 (Work Entry → Review 요청, Task 완료 알림, Dashboard 실제 데이터)</li>
									<li>• Phase 3: UX 개선 (Sidebar Badge, Project Card 최근 작업)</li>
								</ul>
							</div>
							<div>
								<h3 className="font-bold mb-2">{t.backendIntegration}</h3>
								<ul className="space-y-1 text-neutral-600 dark:text-neutral-400">
									<li>• 모든 localStorage 기반 코드가 API 연동 준비 완료</li>
									<li>• storage.get/set을 API calls로 교체하면 즉시 작동</li>
									<li>• 사용자 인증 시스템 (JWT) 연동 가능</li>
									<li>• 파일 업로드 API 통합 준비됨</li>
								</ul>
							</div>
							<div>
								<h3 className="font-bold mb-2">{t.recommendedNext}</h3>
								<ul className="space-y-1 text-neutral-600 dark:text-neutral-400">
									<li>• 백엔드 API 엔드포인트 정의</li>
									<li>• WebSocket으로 실시간 알림 업그레이드</li>
									<li>• 파일 업로드 서비스 통합</li>
									<li>• 실제 AI 모델 연동 (현재는 목업)</li>
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

