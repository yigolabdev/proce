/**
 * Workflow Visualization Page
 * 
 * 현재 구현된 업무 흐름을 시각적으로 표현
 */

import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import { 
	Workflow,
	ArrowRight,
	ArrowDown,
	User,
	FileText,
	CheckCircle2,
	Sparkles,
	Bell,
	Zap,
	Users,
	Send,
	Languages,
	Clock,
	PlayCircle,
	AlertTriangle,
	Target,
	MessageSquare,
	History,
	FolderKanban,
	Plus,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '../../components/ui/Button'
import { useNavigate } from 'react-router-dom'

type Language = 'ko' | 'en'

const translations = {
	ko: {
		title: '워크플로우 시각화',
		subtitle: 'Proce의 실제 업무 실행 흐름',
		rhythmFlow: 'Work Rhythm 흐름',
		taskFlow: 'Task 관리 흐름',
		workInputFlow: '작업 입력 흐름',
		reviewFlow: '리뷰 & 피드백 흐름',
		teamFlow: '팀 협업 흐름',
		rhythmFlowDesc: '일일 업무 루프: Today → In Progress → Needs Review → Completed',
		taskFlowDesc: 'AI 자동 생성 및 수동 Task 할당',
		workInputFlowDesc: '자유 입력 및 Task 진행률 입력',
		reviewFlowDesc: '작업 제출 → 리뷰 → 피드백 → 완료',
		teamFlowDesc: '팀 전체 가시성 및 협업',
		
		// Work Rhythm Flow
		rhythm: {
			title: 'Work Rhythm 흐름',
			step1: { title: 'Today', desc: '오늘의 루프 상태\n긴급/예정/검토 필요', page: '/app/rhythm' },
			step2: { title: 'In Progress', desc: '진행 중인 작업\n활발히 작업 중', page: '/app/rhythm' },
			step3: { title: 'Needs Review', desc: '받은 리뷰 확인\n피드백 대기', page: '/app/rhythm' },
			step4: { title: 'Completed', desc: '완료된 작업\n아카이브', page: '/app/rhythm' },
			step5: { title: 'Team Rhythm', desc: '팀원 상태\n부서/프로젝트 현황', page: '/app/rhythm' },
			features: 'Work Rhythm 특징',
			featureItems: [
				'• 실행 리듬 기반 구조 (함수/역할 기반 아님)',
				'• Today는 현재 루프 상태 안내 (할 일 목록 아님)',
				'• 루프 완료 시 추가 작업 강요하지 않음',
				'• 선택적 다음 작업 제공',
				'• 30초 자동 새로고침',
			],
		},
		
		// Task Management Flow
		taskManagement: {
			title: 'Task 관리 흐름',
			aiGeneration: 'AI Task 자동 생성',
			manualAssignment: '수동 Task 할당',
			aiStep1: { title: '프로젝트 생성', desc: 'Projects 페이지에서\n새 프로젝트 생성', page: '/app/projects' },
			aiStep2: { title: 'AI 분석', desc: '프로젝트 속성 기반\n6개 Task 자동 생성', page: '/app/ai-recommendations' },
			aiStep3: { title: 'Task 표시', desc: 'AI Recommendations\n페이지에 표시', page: '/app/ai-recommendations' },
			aiStep4: { title: 'Task 수락', desc: '사용자가 Task 수락\n→ Work Rhythm 업데이트', page: '/app/ai-recommendations' },
			manualStep1: { title: 'Task 생성', desc: '누구나 생성 가능\n부서 → 사람 선택', page: '/app/ai-recommendations' },
			manualStep2: { title: '할당', desc: '담당자에게 자동\n알림 전송', page: '/app/messages' },
			manualStep3: { title: '작업 시작', desc: 'Work Input에서\nTask 선택', page: '/app/input' },
			aiTasks: 'AI 생성 Task 유형',
			aiTaskItems: [
				'• Kickoff Meeting (높은 우선순위)',
				'• 기획 문서 작성',
				'• 팀 구조 설정',
				'• 리스크 평가 (60일 이상)',
				'• 중간 점검 (30일 이상)',
				'• 최종 리뷰',
			],
			manualFeatures: '수동 Task 기능',
			manualFeatureItems: [
				'• 누구나 생성 및 할당 가능',
				'• 부서 → 사람 2단계 선택',
				'• 우선순위 설정',
				'• 마감일 설정',
				'• 프로젝트 연결',
				'• 자동 알림',
			],
		},
		
		// Work Input Flow
		workInput: {
			title: '작업 입력 흐름',
			mode1: '자유 입력 모드',
			mode2: 'Task 진행률 모드',
			step1: { title: '모드 선택', desc: '자유 입력 / Task 진행률', page: '/app/input' },
			step2: { title: 'Task 선택', desc: 'Task 모드: 드롭다운에서\nTask 선택 (선택사항)', page: '/app/input' },
			step3: { title: '정보 입력', desc: '제목/설명 자동 로드\n진행률 0-100%', page: '/app/input' },
			step4: { title: '제출', desc: '작업 저장\n자동 알림', page: '/app/input' },
			step5: { title: '리듬 업데이트', desc: 'Work Rhythm\n자동 반영', page: '/app/rhythm' },
			freeMode: '자유 입력 모드',
			freeModeItems: [
				'• 제목 & 설명 직접 입력',
				'• 카테고리 & 태그',
				'• 프로젝트 & OKR 선택',
				'• 파일 & 링크 첨부',
				'• 소요시간',
			],
			taskMode: 'Task 진행률 모드',
			taskModeItems: [
				'• Task 드롭다운 선택',
				'• 제목/설명 자동 로드',
				'• 진행률 슬라이더 (0-100%)',
				'• 진행률 코멘트',
				'• Task 완료 시 알림',
			],
			autoActions: '자동 액션',
			autoActionItems: [
				'• 사용자 정보 자동 추가',
				'• 프로젝트 정보 자동 추가',
				'• 리뷰 요청 (프로젝트 있을 경우)',
				'• Task 완료 알림 (100% 달성)',
				'• Work Rhythm 업데이트',
			],
		},
		
		// Review & Approval Flow
		reviewApproval: {
			title: '리뷰 & 피드백 흐름',
			step1: { title: '작업 제출', desc: 'Work Input에서\n프로젝트와 함께 제출', page: '/app/input' },
			step2: { title: '리뷰 요청', desc: '자동으로 프로젝트\n멤버에게 알림', page: '/app/messages' },
			step3: { title: 'AI 평가', desc: 'AI가 작업 결과\n자동 평가', page: '/app/work-review' },
			step4: { title: '리뷰어 확인', desc: 'Work Review에서\n작업 확인', page: '/app/work-review' },
			step5: { title: '피드백 작성', desc: '승인/수정요청/거부\n코멘트 작성', page: '/app/work-review' },
			step6: { title: '알림 전송', desc: '제출자에게\n메시지 전송', page: '/app/messages' },
			step7: { title: '리뷰 확인', desc: 'Work Review에서\n받은 리뷰 확인', page: '/app/work-review' },
			step8: { title: '리듬 업데이트', desc: 'Needs Review →\nCompleted', page: '/app/rhythm' },
			reviewTypes: '리뷰 유형',
			approved: '승인됨',
			approvedItems: [
				'• 작업 완료 & 우수함',
				'• 긍정적 피드백',
				'• Work Rhythm: Completed',
			],
			changesRequested: '수정 요청',
			changesRequestedItems: [
				'• 개선 필요',
				'• 구체적 피드백',
				'• 재제출 가능',
			],
			rejected: '거부됨',
			rejectedItems: [
				'• 주요 이슈',
				'• 상세한 이유',
				'• 처음부터 다시',
			],
		},
		
		// Team Collaboration Flow
		teamCollaboration: {
			title: '팀 협업 흐름',
			step1: { title: 'Work History', desc: '팀 전체 작업 이력\n프로젝트/부서 필터', page: '/app/work-history' },
			step2: { title: 'Team Rhythm', desc: '팀원 상태 확인\n부서/프로젝트 현황', page: '/app/rhythm' },
			step3: { title: 'Messages', desc: '통합 알림 센터\n5가지 메시지 타입', page: '/app/messages' },
			step4: { title: 'Projects', desc: '프로젝트 관리\n최근 작업 표시', page: '/app/projects' },
			step5: { title: 'Dashboard', desc: '개인 & 회사 현황\n통합 대시보드', page: '/app/dashboard' },
			messageTypes: '메시지 타입',
			messageTypeItems: [
				'• Task 알림 (할당/완료)',
				'• Review 요청/응답',
				'• Approval 알림',
				'• Project 업데이트',
				'• Team 알림',
			],
			collaborationFeatures: '협업 기능',
			collaborationFeatureItems: [
				'• 실시간 팀 현황',
				'• 프로젝트 기반 필터링',
				'• 부서별 가시성',
				'• 통합 알림 시스템',
				'• Work Rhythm 동기화',
			],
		},
		
		// User Journey
		userJourney: '실제 사용자 여정',
		journeySteps: [
			{ action: '로그인', page: 'Dashboard', desc: '개인 현황, 읽지 않은 리뷰, 긴급 Task 확인', route: '/app/dashboard' },
			{ action: 'Work Rhythm 확인', page: 'Work Rhythm', desc: 'Today 섹션에서 오늘의 루프 상태 확인', route: '/app/rhythm' },
			{ action: 'Task 확인', page: 'AI Recommendations', desc: 'AI 생성 및 수동 Task 확인, 수락/거부', route: '/app/ai-recommendations' },
			{ action: '작업 시작', page: 'Work Input', desc: 'Task 선택 또는 자유 입력, 진행률 기록', route: '/app/input' },
			{ action: '작업 제출', page: 'Work Input', desc: 'Task 완료 (100%), 자동으로 리뷰 요청 전송', route: '/app/input' },
			{ action: '메시지 확인', page: 'Messages', desc: '알림 및 리뷰 요청 확인', route: '/app/messages' },
			{ action: '리뷰 확인', page: 'Work Review', desc: '받은 리뷰 확인, 읽음 처리', route: '/app/work-review' },
			{ action: '팀 현황', page: 'Work History', desc: '팀원들의 작업 내용, 프로젝트별 필터', route: '/app/work-history' },
			{ action: '루프 완료', page: 'Work Rhythm', desc: 'Today 완료, Completed로 이동', route: '/app/rhythm' },
		],
	},
	en: {
		title: 'Workflow Visualization',
		subtitle: 'Actual work execution flow in Proce',
		rhythmFlow: 'Work Rhythm Flow',
		taskFlow: 'Task Management Flow',
		workInputFlow: 'Work Input Flow',
		reviewFlow: 'Review & Feedback Flow',
		teamFlow: 'Team Collaboration Flow',
		rhythmFlowDesc: 'Daily work loop: Today → In Progress → Needs Review → Completed',
		taskFlowDesc: 'AI auto-generation and manual task assignment',
		workInputFlowDesc: 'Free input and task progress input',
		reviewFlowDesc: 'Work submission → Review → Feedback → Completion',
		teamFlowDesc: 'Team-wide visibility and collaboration',
		
		// Work Rhythm Flow
		rhythm: {
			title: 'Work Rhythm Flow',
			step1: { title: 'Today', desc: 'Today\'s loop status\nUrgent/Scheduled/Reviews', page: '/app/rhythm' },
			step2: { title: 'In Progress', desc: 'Active tasks\nCurrently working', page: '/app/rhythm' },
			step3: { title: 'Needs Review', desc: 'Received reviews\nWaiting for feedback', page: '/app/rhythm' },
			step4: { title: 'Completed', desc: 'Completed tasks\nArchive', page: '/app/rhythm' },
			step5: { title: 'Team Rhythm', desc: 'Team member status\nDept/Project status', page: '/app/rhythm' },
			features: 'Work Rhythm Features',
			featureItems: [
				'• Execution rhythm-based structure (not function/role-based)',
				'• Today is current loop status guide (not a to-do list)',
				'• No forced additional work when loop complete',
				'• Optional next actions provided',
				'• 30-second auto refresh',
			],
		},
		
		// Task Management Flow
		taskManagement: {
			title: 'Task Management Flow',
			aiGeneration: 'AI Task Auto-Generation',
			manualAssignment: 'Manual Task Assignment',
			aiStep1: { title: 'Create Project', desc: 'Create new project\nin Projects page', page: '/app/projects' },
			aiStep2: { title: 'AI Analysis', desc: 'Auto-generate 6 tasks\nbased on project', page: '/app/ai-recommendations' },
			aiStep3: { title: 'Display Tasks', desc: 'Show in AI\nRecommendations page', page: '/app/ai-recommendations' },
			aiStep4: { title: 'Accept Task', desc: 'User accepts task\n→ Work Rhythm updated', page: '/app/ai-recommendations' },
			manualStep1: { title: 'Create Task', desc: 'Anyone can create\nDept → Person select', page: '/app/ai-recommendations' },
			manualStep2: { title: 'Assign', desc: 'Auto notification\nto assignee', page: '/app/messages' },
			manualStep3: { title: 'Start Work', desc: 'Select task in\nWork Input', page: '/app/input' },
			aiTasks: 'AI Generated Task Types',
			aiTaskItems: [
				'• Kickoff Meeting (High priority)',
				'• Planning Document',
				'• Team Structure',
				'• Risk Assessment (60+ days)',
				'• Checkpoint (30+ days)',
				'• Final Review',
			],
			manualFeatures: 'Manual Task Features',
			manualFeatureItems: [
				'• Anyone can create & assign',
				'• Dept → Person 2-step selection',
				'• Priority setting',
				'• Deadline setting',
				'• Project linking',
				'• Auto notification',
			],
		},
		
		// Work Input Flow
		workInput: {
			title: 'Work Input Flow',
			mode1: 'Free Input Mode',
			mode2: 'Task Progress Mode',
			step1: { title: 'Select Mode', desc: 'Free Input / Task Progress', page: '/app/input' },
			step2: { title: 'Select Task', desc: 'Task Mode: Select task\nfrom dropdown (optional)', page: '/app/input' },
			step3: { title: 'Enter Info', desc: 'Title/Desc auto-loaded\nProgress 0-100%', page: '/app/input' },
			step4: { title: 'Submit', desc: 'Save work\nAuto notification', page: '/app/input' },
			step5: { title: 'Rhythm Update', desc: 'Work Rhythm\nauto-reflected', page: '/app/rhythm' },
			freeMode: 'Free Input Mode',
			freeModeItems: [
				'• Title & Description direct input',
				'• Category & Tags',
				'• Project & OKR selection',
				'• Files & Links attachment',
				'• Duration',
			],
			taskMode: 'Task Progress Mode',
			taskModeItems: [
				'• Task dropdown selection',
				'• Title/Description auto-load',
				'• Progress slider (0-100%)',
				'• Progress comment',
				'• Task completion notification',
			],
			autoActions: 'Auto Actions',
			autoActionItems: [
				'• User info auto-added',
				'• Project info auto-added',
				'• Review request (if project)',
				'• Task completion (if 100%)',
				'• Work Rhythm update',
			],
		},
		
		// Review & Approval Flow
		reviewApproval: {
			title: 'Review & Feedback Flow',
			step1: { title: 'Submit Work', desc: 'Submit with project\nin Work Input', page: '/app/input' },
			step2: { title: 'Review Request', desc: 'Auto notification\nto project members', page: '/app/messages' },
			step3: { title: 'AI Evaluation', desc: 'AI auto-evaluates\nwork results', page: '/app/work-review' },
			step4: { title: 'Reviewer Check', desc: 'Check work in\nWork Review', page: '/app/work-review' },
			step5: { title: 'Write Feedback', desc: 'Approve/Request/Reject\nWrite comment', page: '/app/work-review' },
			step6: { title: 'Send Notification', desc: 'Send message\nto submitter', page: '/app/messages' },
			step7: { title: 'View Review', desc: 'Check received review\nin Work Review', page: '/app/work-review' },
			step8: { title: 'Rhythm Update', desc: 'Needs Review →\nCompleted', page: '/app/rhythm' },
			reviewTypes: 'Review Types',
			approved: 'Approved',
			approvedItems: [
				'• Work complete & excellent',
				'• Positive feedback',
				'• Work Rhythm: Completed',
			],
			changesRequested: 'Changes Requested',
			changesRequestedItems: [
				'• Needs improvement',
				'• Specific feedback',
				'• Can resubmit',
			],
			rejected: 'Rejected',
			rejectedItems: [
				'• Major issues',
				'• Detailed reasons',
				'• Fresh start needed',
			],
		},
		
		// Team Collaboration Flow
		teamCollaboration: {
			title: 'Team Collaboration Flow',
			step1: { title: 'Work History', desc: 'Team-wide work history\nProject/Dept filters', page: '/app/work-history' },
			step2: { title: 'Team Rhythm', desc: 'Team member status\nDept/Project status', page: '/app/rhythm' },
			step3: { title: 'Messages', desc: 'Integrated notification center\n5 message types', page: '/app/messages' },
			step4: { title: 'Projects', desc: 'Project management\nRecent work display', page: '/app/projects' },
			step5: { title: 'Dashboard', desc: 'Personal & Company status\nIntegrated dashboard', page: '/app/dashboard' },
			messageTypes: 'Message Types',
			messageTypeItems: [
				'• Task notifications (assign/complete)',
				'• Review requests/responses',
				'• Approval notifications',
				'• Project updates',
				'• Team notifications',
			],
			collaborationFeatures: 'Collaboration Features',
			collaborationFeatureItems: [
				'• Real-time team status',
				'• Project-based filtering',
				'• Department visibility',
				'• Integrated notification system',
				'• Work Rhythm synchronization',
			],
		},
		
		// User Journey
		userJourney: 'Actual User Journey',
		journeySteps: [
			{ action: 'Login', page: 'Dashboard', desc: 'See personal status, unread reviews, urgent tasks', route: '/app/dashboard' },
			{ action: 'Check Work Rhythm', page: 'Work Rhythm', desc: 'Check today\'s loop status in Today section', route: '/app/rhythm' },
			{ action: 'Check Tasks', page: 'AI Recommendations', desc: 'View AI-generated and manual tasks, accept/reject', route: '/app/ai-recommendations' },
			{ action: 'Start Work', page: 'Work Input', desc: 'Select task or free input, log progress', route: '/app/input' },
			{ action: 'Submit Work', page: 'Work Input', desc: 'Complete task (100%), auto-sends review request', route: '/app/input' },
			{ action: 'Check Messages', page: 'Messages', desc: 'See notifications and review requests', route: '/app/messages' },
			{ action: 'View Review', page: 'Work Review', desc: 'Check received reviews, mark as read', route: '/app/work-review' },
			{ action: 'Team Status', page: 'Work History', desc: 'Team members\' work, project filters', route: '/app/work-history' },
			{ action: 'Loop Complete', page: 'Work Rhythm', desc: 'Today complete, move to Completed', route: '/app/rhythm' },
		],
	},
}

export default function WorkflowPage() {
	const navigate = useNavigate()
	const [selectedFlow, setSelectedFlow] = useState<'rhythm' | 'task' | 'work' | 'review' | 'team'>('rhythm')
	const [language, setLanguage] = useState<Language>('ko')
	
	// Load language from localStorage on mount
	useEffect(() => {
		const saved = localStorage.getItem('workflow_language') as Language
		if (saved && (saved === 'ko' || saved === 'en')) {
			setLanguage(saved)
		}
	}, [])
	
	// Save language to localStorage when changed
	const toggleLanguage = () => {
		const newLang = language === 'ko' ? 'en' : 'ko'
		setLanguage(newLang)
		localStorage.setItem('workflow_language', newLang)
	}
	
	const t = translations[language]

	const flowOptions = [
		{ id: 'rhythm' as const, label: t.rhythmFlow, icon: Clock, color: 'primary' },
		{ id: 'task' as const, label: t.taskFlow, icon: Sparkles, color: 'purple' },
		{ id: 'work' as const, label: t.workInputFlow, icon: FileText, color: 'blue' },
		{ id: 'review' as const, label: t.reviewFlow, icon: CheckCircle2, color: 'green' },
		{ id: 'team' as const, label: t.teamFlow, icon: Users, color: 'orange' },
	]

	const getColorClasses = (color: string, isActive: boolean) => {
		if (!isActive) {
			return 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
		}
		switch (color) {
			case 'primary':
				return 'border-primary bg-primary/5 dark:bg-primary/10'
			case 'purple':
				return 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
			case 'blue':
				return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
			case 'green':
				return 'border-green-500 bg-green-50 dark:bg-green-900/20'
			case 'orange':
				return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
			default:
				return 'border-neutral-200 dark:border-neutral-800'
		}
	}

	const getTextColorClasses = (color: string, isActive: boolean) => {
		if (!isActive) return 'text-neutral-500'
		switch (color) {
			case 'primary':
				return 'text-primary'
			case 'purple':
				return 'text-purple-600 dark:text-purple-400'
			case 'blue':
				return 'text-blue-600 dark:text-blue-400'
			case 'green':
				return 'text-green-600 dark:text-green-400'
			case 'orange':
				return 'text-orange-600 dark:text-orange-400'
			default:
				return 'text-neutral-600'
		}
	}

	return (
		<div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-6">
			{/* Header */}
			<div className="max-w-7xl mx-auto mb-8">
				<div className="flex items-center justify-between mb-2">
					<div className="flex items-center gap-3">
						<Workflow className="h-8 w-8 text-primary" />
						<h1 className="text-3xl font-bold">{t.title}</h1>
					</div>
					<Button
						onClick={toggleLanguage}
						variant="outline"
						className="flex items-center gap-2"
					>
						<Languages className="h-4 w-4" />
						{language === 'ko' ? 'English' : '한국어'}
					</Button>
				</div>
				<p className="text-neutral-600 dark:text-neutral-400">
					{t.subtitle}
				</p>
			</div>

			<div className="max-w-7xl mx-auto space-y-6">
				{/* Flow Selection Tabs */}
				<Card>
					<CardContent className="p-4">
						<div className="grid grid-cols-2 md:grid-cols-5 gap-3">
							{flowOptions.map((option) => {
								const Icon = option.icon
								const isActive = selectedFlow === option.id
								return (
									<button
										key={option.id}
										onClick={() => setSelectedFlow(option.id)}
										className={`p-4 rounded-xl border-2 transition-all ${getColorClasses(option.color, isActive)}`}
									>
										<Icon className={`h-6 w-6 mx-auto mb-2 ${getTextColorClasses(option.color, isActive)}`} />
										<p className={`text-sm font-medium text-center ${
											isActive ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-700 dark:text-neutral-300'
										}`}>
											{option.label}
										</p>
									</button>
								)
							})}
						</div>
					</CardContent>
				</Card>

				{/* Work Rhythm Flow */}
				{selectedFlow === 'rhythm' && (
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<div className="flex items-center gap-2">
									<Clock className="h-5 w-5 text-primary" />
									<h2 className="text-xl font-bold">{t.rhythm.title}</h2>
								</div>
								<p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
									{t.rhythmFlowDesc}
								</p>
							</CardHeader>
							<CardContent>
								<div className="relative">
									{/* Flow Steps */}
									<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
										{[
											{ step: t.rhythm.step1, icon: Clock, color: 'primary' },
											{ step: t.rhythm.step2, icon: PlayCircle, color: 'blue' },
											{ step: t.rhythm.step3, icon: AlertTriangle, color: 'orange' },
											{ step: t.rhythm.step4, icon: CheckCircle2, color: 'green' },
											{ step: t.rhythm.step5, icon: Users, color: 'purple' },
										].map((item, idx) => {
											const Icon = item.icon
											const isLast = idx === 4
											return (
												<div key={idx} className="relative">
													<button
														onClick={() => navigate(item.step.page)}
														className="w-full p-4 bg-primary/5 dark:bg-primary/10 border-2 border-primary rounded-xl hover:bg-primary/10 dark:hover:bg-primary/20 transition-all group"
													>
														<div className="flex flex-col items-center gap-2">
															<Icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
															<h3 className="font-bold text-sm text-center">{idx + 1}. {item.step.title}</h3>
															<p className="text-xs text-center text-neutral-600 dark:text-neutral-400 whitespace-pre-line">
																{item.step.desc}
															</p>
														</div>
													</button>
													{!isLast && (
														<>
															<ArrowRight className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 h-6 w-6 text-primary" />
															<ArrowDown className="md:hidden mx-auto mt-2 h-6 w-6 text-primary" />
														</>
													)}
												</div>
											)
										})}
									</div>

									{/* Features */}
									<div className="mt-6 p-4 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20">
										<h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
											<Zap className="h-4 w-4 text-primary" />
											{t.rhythm.features}
										</h4>
										<ul className="text-xs space-y-1 text-neutral-600 dark:text-neutral-400">
											{t.rhythm.featureItems.map((item, idx) => (
												<li key={idx}>{item}</li>
											))}
										</ul>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				)}

				{/* Task Management Flow */}
				{selectedFlow === 'task' && (
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<div className="flex items-center gap-2">
									<Sparkles className="h-5 w-5 text-purple-600" />
									<h2 className="text-xl font-bold">{t.taskManagement.title}</h2>
								</div>
								<p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
									{t.taskFlowDesc}
								</p>
							</CardHeader>
							<CardContent>
								<div className="space-y-8">
									{/* AI Generation Flow */}
									<div>
										<h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
											<Sparkles className="h-5 w-5 text-purple-600" />
											{t.taskManagement.aiGeneration}
										</h3>
										<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
											{[
												{ step: t.taskManagement.aiStep1, icon: FolderKanban },
												{ step: t.taskManagement.aiStep2, icon: Sparkles },
												{ step: t.taskManagement.aiStep3, icon: Target },
												{ step: t.taskManagement.aiStep4, icon: CheckCircle2 },
											].map((item, idx) => {
												const Icon = item.icon
												const isLast = idx === 3
												return (
													<div key={idx} className="relative">
														<button
															onClick={() => navigate(item.step.page)}
															className="w-full p-4 bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-500 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all group"
														>
															<div className="flex flex-col items-center gap-2">
																<Icon className="h-8 w-8 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
																<h3 className="font-bold text-sm text-center">{idx + 1}. {item.step.title}</h3>
																<p className="text-xs text-center text-neutral-600 dark:text-neutral-400 whitespace-pre-line">
																	{item.step.desc}
																</p>
															</div>
														</button>
														{!isLast && (
															<>
																<ArrowRight className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 h-6 w-6 text-purple-500" />
																<ArrowDown className="md:hidden mx-auto mt-2 h-6 w-6 text-purple-500" />
															</>
														)}
													</div>
												)
											})}
										</div>
										<div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-800">
											<h4 className="font-semibold text-sm mb-2">{t.taskManagement.aiTasks}</h4>
											<ul className="text-xs space-y-1 text-neutral-600 dark:text-neutral-400">
												{t.taskManagement.aiTaskItems.map((item, idx) => (
													<li key={idx}>{item}</li>
												))}
											</ul>
										</div>
									</div>

									{/* Manual Assignment Flow */}
									<div>
										<h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
											<User className="h-5 w-5 text-blue-600" />
											{t.taskManagement.manualAssignment}
										</h3>
										<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
											{[
												{ step: t.taskManagement.manualStep1, icon: Plus },
												{ step: t.taskManagement.manualStep2, icon: Send },
												{ step: t.taskManagement.manualStep3, icon: FileText },
											].map((item, idx) => {
												const Icon = item.icon
												const isLast = idx === 2
												return (
													<div key={idx} className="relative">
														<button
															onClick={() => navigate(item.step.page)}
															className="w-full p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all group"
														>
															<div className="flex flex-col items-center gap-2">
																<Icon className="h-8 w-8 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
																<h3 className="font-bold text-sm text-center">{idx + 1}. {item.step.title}</h3>
																<p className="text-xs text-center text-neutral-600 dark:text-neutral-400 whitespace-pre-line">
																	{item.step.desc}
																</p>
															</div>
														</button>
														{!isLast && (
															<>
																<ArrowRight className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 h-6 w-6 text-blue-500" />
																<ArrowDown className="md:hidden mx-auto mt-2 h-6 w-6 text-blue-500" />
															</>
														)}
													</div>
												)
											})}
										</div>
										<div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
											<h4 className="font-semibold text-sm mb-2">{t.taskManagement.manualFeatures}</h4>
											<ul className="text-xs space-y-1 text-neutral-600 dark:text-neutral-400">
												{t.taskManagement.manualFeatureItems.map((item, idx) => (
													<li key={idx}>{item}</li>
												))}
											</ul>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				)}

				{/* Work Input Flow */}
				{selectedFlow === 'work' && (
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<div className="flex items-center gap-2">
									<FileText className="h-5 w-5 text-blue-600" />
									<h2 className="text-xl font-bold">{t.workInput.title}</h2>
								</div>
								<p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
									{t.workInputFlowDesc}
								</p>
							</CardHeader>
							<CardContent>
								<div className="relative">
									{/* Flow Steps */}
									<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
										{[
											{ step: t.workInput.step1, icon: FileText },
											{ step: t.workInput.step2, icon: Target },
											{ step: t.workInput.step3, icon: FileText },
											{ step: t.workInput.step4, icon: Send },
											{ step: t.workInput.step5, icon: Clock },
										].map((item, idx) => {
											const Icon = item.icon
											const isLast = idx === 4
											return (
												<div key={idx} className="relative">
													<button
														onClick={() => navigate(item.step.page)}
														className="w-full p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all group"
													>
														<div className="flex flex-col items-center gap-2">
															<Icon className="h-8 w-8 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
															<h3 className="font-bold text-sm text-center">{idx + 1}. {item.step.title}</h3>
															<p className="text-xs text-center text-neutral-600 dark:text-neutral-400 whitespace-pre-line">
																{item.step.desc}
															</p>
														</div>
													</button>
													{!isLast && (
														<>
															<ArrowRight className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 h-6 w-6 text-blue-500" />
															<ArrowDown className="md:hidden mx-auto mt-2 h-6 w-6 text-blue-500" />
														</>
													)}
												</div>
											)
										})}
									</div>

									{/* Input Modes */}
									<div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
											<h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
												<FileText className="h-4 w-4 text-blue-600" />
												{t.workInput.freeMode}
											</h4>
											<ul className="text-xs space-y-1 text-neutral-600 dark:text-neutral-400">
												{t.workInput.freeModeItems.map((item, idx) => (
													<li key={idx}>{item}</li>
												))}
											</ul>
										</div>
										<div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-800">
											<h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
												<Target className="h-4 w-4 text-purple-600" />
												{t.workInput.taskMode}
											</h4>
											<ul className="text-xs space-y-1 text-neutral-600 dark:text-neutral-400">
												{t.workInput.taskModeItems.map((item, idx) => (
													<li key={idx}>{item}</li>
												))}
											</ul>
										</div>
									</div>

									{/* Auto Actions */}
									<div className="mt-4 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
										<h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
											<Zap className="h-4 w-4 text-green-600" />
											{t.workInput.autoActions}
										</h4>
										<ul className="text-xs space-y-1 text-neutral-600 dark:text-neutral-400">
											{t.workInput.autoActionItems.map((item, idx) => (
												<li key={idx}>{item}</li>
											))}
										</ul>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				)}

				{/* Review & Approval Flow */}
				{selectedFlow === 'review' && (
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<div className="flex items-center gap-2">
									<CheckCircle2 className="h-5 w-5 text-green-600" />
									<h2 className="text-xl font-bold">{t.reviewApproval.title}</h2>
								</div>
								<p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
									{t.reviewFlowDesc}
								</p>
							</CardHeader>
							<CardContent>
								<div className="relative">
									{/* Flow Steps */}
									<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
										{[
											{ step: t.reviewApproval.step1, icon: FileText },
											{ step: t.reviewApproval.step2, icon: Bell },
											{ step: t.reviewApproval.step3, icon: Sparkles },
											{ step: t.reviewApproval.step4, icon: User },
										].map((item, idx) => {
											const Icon = item.icon
											const isLast = idx === 3
											return (
												<div key={idx} className="relative">
													<button
														onClick={() => navigate(item.step.page)}
														className="w-full p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-all group"
													>
														<div className="flex flex-col items-center gap-2">
															<Icon className="h-8 w-8 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
															<h3 className="font-bold text-sm text-center">{idx + 1}. {item.step.title}</h3>
															<p className="text-xs text-center text-neutral-600 dark:text-neutral-400 whitespace-pre-line">
																{item.step.desc}
															</p>
														</div>
													</button>
													{!isLast && (
														<>
															<ArrowRight className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 h-6 w-6 text-green-500" />
															<ArrowDown className="md:hidden mx-auto mt-2 h-6 w-6 text-green-500" />
														</>
													)}
												</div>
											)
										})}
									</div>

									<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
										{[
											{ step: t.reviewApproval.step5, icon: MessageSquare },
											{ step: t.reviewApproval.step6, icon: Send },
											{ step: t.reviewApproval.step7, icon: CheckCircle2 },
											{ step: t.reviewApproval.step8, icon: Clock },
										].map((item, idx) => {
											const Icon = item.icon
											const isLast = idx === 3
											return (
												<div key={idx} className="relative">
													<button
														onClick={() => navigate(item.step.page)}
														className="w-full p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-all group"
													>
														<div className="flex flex-col items-center gap-2">
															<Icon className="h-8 w-8 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
															<h3 className="font-bold text-sm text-center">{idx + 5}. {item.step.title}</h3>
															<p className="text-xs text-center text-neutral-600 dark:text-neutral-400 whitespace-pre-line">
																{item.step.desc}
															</p>
														</div>
													</button>
													{!isLast && (
														<>
															<ArrowRight className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 h-6 w-6 text-green-500" />
															<ArrowDown className="md:hidden mx-auto mt-2 h-6 w-6 text-green-500" />
														</>
													)}
												</div>
											)
										})}
									</div>

									{/* Review Types */}
									<div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
										<div className="p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
											<h4 className="font-semibold text-sm mb-2 text-green-700 dark:text-green-300">
												✓ {t.reviewApproval.approved}
											</h4>
											<ul className="text-xs space-y-1 text-neutral-600 dark:text-neutral-400">
												{t.reviewApproval.approvedItems.map((item, idx) => (
													<li key={idx}>{item}</li>
												))}
											</ul>
										</div>
										<div className="p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800">
											<h4 className="font-semibold text-sm mb-2 text-yellow-700 dark:text-yellow-300">
												⚠ {t.reviewApproval.changesRequested}
											</h4>
											<ul className="text-xs space-y-1 text-neutral-600 dark:text-neutral-400">
												{t.reviewApproval.changesRequestedItems.map((item, idx) => (
													<li key={idx}>{item}</li>
												))}
											</ul>
										</div>
										<div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
											<h4 className="font-semibold text-sm mb-2 text-red-700 dark:text-red-300">
												✗ {t.reviewApproval.rejected}
											</h4>
											<ul className="text-xs space-y-1 text-neutral-600 dark:text-neutral-400">
												{t.reviewApproval.rejectedItems.map((item, idx) => (
													<li key={idx}>{item}</li>
												))}
											</ul>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				)}

				{/* Team Collaboration Flow */}
				{selectedFlow === 'team' && (
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<div className="flex items-center gap-2">
									<Users className="h-5 w-5 text-orange-600" />
									<h2 className="text-xl font-bold">{t.teamCollaboration.title}</h2>
								</div>
								<p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
									{t.teamFlowDesc}
								</p>
							</CardHeader>
							<CardContent>
								<div className="relative">
									{/* Flow Steps */}
									<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
										{[
											{ step: t.teamCollaboration.step1, icon: History },
											{ step: t.teamCollaboration.step2, icon: Users },
											{ step: t.teamCollaboration.step3, icon: MessageSquare },
											{ step: t.teamCollaboration.step4, icon: FolderKanban },
											{ step: t.teamCollaboration.step5, icon: Target },
										].map((item, idx) => {
											const Icon = item.icon
											const isLast = idx === 4
											return (
												<div key={idx} className="relative">
													<button
														onClick={() => navigate(item.step.page)}
														className="w-full p-4 bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-500 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-all group"
													>
														<div className="flex flex-col items-center gap-2">
															<Icon className="h-8 w-8 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform" />
															<h3 className="font-bold text-sm text-center">{idx + 1}. {item.step.title}</h3>
															<p className="text-xs text-center text-neutral-600 dark:text-neutral-400 whitespace-pre-line">
																{item.step.desc}
															</p>
														</div>
													</button>
													{!isLast && (
														<>
															<ArrowRight className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 h-6 w-6 text-orange-500" />
															<ArrowDown className="md:hidden mx-auto mt-2 h-6 w-6 text-orange-500" />
														</>
													)}
												</div>
											)
										})}
									</div>

									{/* Message Types & Collaboration Features */}
									<div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-200 dark:border-orange-800">
											<h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
												<MessageSquare className="h-4 w-4 text-orange-600" />
												{t.teamCollaboration.messageTypes}
											</h4>
											<ul className="text-xs space-y-1 text-neutral-600 dark:text-neutral-400">
												{t.teamCollaboration.messageTypeItems.map((item, idx) => (
													<li key={idx}>{item}</li>
												))}
											</ul>
										</div>
										<div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
											<h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
												<Users className="h-4 w-4 text-blue-600" />
												{t.teamCollaboration.collaborationFeatures}
											</h4>
											<ul className="text-xs space-y-1 text-neutral-600 dark:text-neutral-400">
												{t.teamCollaboration.collaborationFeatureItems.map((item, idx) => (
													<li key={idx}>{item}</li>
												))}
											</ul>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				)}

				{/* User Journey - 모든 플로우에 공통으로 표시 */}
				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<User className="h-5 w-5 text-primary" />
							<h2 className="text-xl font-bold">{t.userJourney}</h2>
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{t.journeySteps.map((item, idx) => (
								<button
									key={idx}
									onClick={() => navigate(item.route)}
									className="w-full flex items-start gap-3 p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-primary/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all group"
								>
									<div className="shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm group-hover:scale-110 transition-transform">
										{idx + 1}
									</div>
									<div className="flex-1 text-left">
										<div className="flex items-center gap-2 mb-1">
											<h4 className="font-bold text-sm">{item.action}</h4>
											<span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
												{item.page}
											</span>
										</div>
										<p className="text-xs text-neutral-600 dark:text-neutral-400">{item.desc}</p>
									</div>
									<ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
								</button>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
