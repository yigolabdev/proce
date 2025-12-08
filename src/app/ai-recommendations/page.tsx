import { useI18n } from '../../i18n/I18nProvider'
import { storage } from '../../utils/storage'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { PageHeader } from '../../components/common/PageHeader'
import { useAuth } from '../../context/AuthContext'
import { useRhythmUpdate } from '../../hooks/useRhythmUpdate'
import {
	Sparkles,
	CheckCircle2,
	XCircle,
	RefreshCw,
	Brain,
	Calendar,
	TrendingUp,
	Clock,
	X,
	Users,
	Target,
	AlertTriangle,
	Lightbulb,
	Plus,
	Folder,
	Zap,
} from 'lucide-react'
import { toast } from 'sonner'
import Toaster from '../../components/ui/Toaster'

// AI Task Recommendation Interface
interface TaskRecommendation {
	id: string
	title: string
	description: string
	priority: 'high' | 'medium' | 'low'
	category: string
	deadline?: string
	dataSource: string // 추천 근거가 되는 데이터 출처
	status: 'pending' | 'accepted' | 'rejected'
	projectId?: string // 프로젝트 ID
	projectName?: string // 프로젝트 이름
	isManual?: boolean // 수동으로 생성된 Task 여부
	createdAt?: string // 생성 시간
	createdBy?: string // 생성자 이름
	assignedTo?: string // 할당받은 사람 이름
	assignedToId?: string // 할당받은 사람 ID
	// 상세 정보
	aiAnalysis?: {
		projectName: string
		analysisDate: string
		analysisReason: string
		relatedMembers: Array<{
			name: string
			role: string
			department: string
			memberType: 'active' | 'related' // active: 직접 참여, related: 관련됨
		}>
		detailedInstructions: string[]
		expectedOutcome: string
		recommendations: string[]
		riskFactors: string[]
	}
}

interface RecommendationInsight {
	type: 'gap' | 'inactive' | 'deadline' | 'info'
	metric: string
	value: string
	status: 'warning' | 'info' | 'urgent'
}

export default function AIRecommendationsPage() {
	const navigate = useNavigate()
	const { user } = useAuth()
	const { updateAfterTaskChange } = useRhythmUpdate()
	const { t, language } = useI18n()
	
	// AI Recommendations state
	const [recommendations, setRecommendations] = useState<TaskRecommendation[]>([])
	const [insights, setInsights] = useState<RecommendationInsight[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [selectedTask, setSelectedTask] = useState<TaskRecommendation | null>(null)
	
	// Manual task creation state
	const [showManualTaskModal, setShowManualTaskModal] = useState(false)
	const [manualTaskForm, setManualTaskForm] = useState({
		title: '',
		description: '',
		priority: 'medium' as 'high' | 'medium' | 'low',
		category: '',
		deadline: '',
		projectId: '',
		selectedDepartment: '',
		assignedToId: '',
	})
	
	// Project filtering state
	const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([])
	const [selectedProjectFilter] = useState<string>('all')
	
	// Users state
	const [users, setUsers] = useState<Array<{ id: string; name: string; email: string; department?: string }>>([])


	useEffect(() => {
		loadRecommendations()
		loadProjects()
		loadUsers()
	}, [])
	
	// Load projects from localStorage
	const loadProjects = () => {
		const projectsData = storage.get<any[]>('projects')
		const loadedProjects = projectsData || []
		setProjects(loadedProjects.map((p: any) => ({ id: p.id, name: p.name })))
	}
	
	// Load users from localStorage
	const loadUsers = () => {
		const usersData = storage.get<any[]>('users')
		if (usersData && usersData.length > 0) {
			setUsers(usersData.map((u: any) => ({ 
				id: u.id, 
				name: u.name, 
				email: u.email,
				department: u.department 
			})))
		} else {
			// Mock users if none exist
			const mockUsers = [
				// Engineering Team (7 members)
				{ id: '1', name: 'John Doe', email: 'john@company.com', department: 'Engineering' },
				{ id: '3', name: 'Mike Johnson', email: 'mike@company.com', department: 'Engineering' },
				{ id: '5', name: 'David Lee', email: 'david@company.com', department: 'Engineering' },
				{ id: '7', name: 'Alex Kim', email: 'alex@company.com', department: 'Engineering' },
				{ id: '10', name: 'Chris Brown', email: 'chris@company.com', department: 'Engineering' },
				{ id: '11', name: 'Jennifer Wang', email: 'jennifer@company.com', department: 'Engineering' },
				{ id: '12', name: 'Ryan Martinez', email: 'ryan@company.com', department: 'Engineering' },
				
				// Product Team (4 members)
				{ id: '2', name: 'Sarah Chen', email: 'sarah@company.com', department: 'Product' },
				{ id: '13', name: 'Emma Thompson', email: 'emma@company.com', department: 'Product' },
				{ id: '14', name: 'James Wilson', email: 'james@company.com', department: 'Product' },
				{ id: '15', name: 'Sophie Anderson', email: 'sophie@company.com', department: 'Product' },
				
				// Design Team (3 members)
				{ id: '4', name: 'Emily Davis', email: 'emily@company.com', department: 'Design' },
				{ id: '16', name: 'Oliver Harris', email: 'oliver@company.com', department: 'Design' },
				{ id: '17', name: 'Maya Patel', email: 'maya@company.com', department: 'Design' },
				
				// Marketing Team (3 members)
				{ id: '6', name: 'Lisa Park', email: 'lisa@company.com', department: 'Marketing' },
				{ id: '18', name: 'Daniel Kim', email: 'daniel@company.com', department: 'Marketing' },
				{ id: '19', name: 'Isabella Rodriguez', email: 'isabella@company.com', department: 'Marketing' },
				
				// Sales Team (3 members)
				{ id: '8', name: 'Rachel Green', email: 'rachel@company.com', department: 'Sales' },
				{ id: '20', name: 'Michael Scott', email: 'michael@company.com', department: 'Sales' },
				{ id: '21', name: 'Amy Zhang', email: 'amy@company.com', department: 'Sales' },
				
				// Operations Team (2 members)
				{ id: '9', name: 'Tom Wilson', email: 'tom@company.com', department: 'Operations' },
				{ id: '22', name: 'Laura Chen', email: 'laura@company.com', department: 'Operations' },
				
				// HR Team (2 members)
				{ id: '23', name: 'Kevin Lee', email: 'kevin@company.com', department: 'HR' },
				{ id: '24', name: 'Grace Park', email: 'grace@company.com', department: 'HR' },
				
				// Finance Team (2 members)
				{ id: '25', name: 'Robert Johnson', email: 'robert@company.com', department: 'Finance' },
				{ id: '26', name: 'Victoria Lee', email: 'victoria@company.com', department: 'Finance' },
			]
			setUsers(mockUsers)
		}
	}

	// Load AI Recommendations
	const loadRecommendations = () => {
		setIsLoading(true)
		
		// Load manual tasks from localStorage
		const manualTasksData = storage.get<TaskRecommendation[]>('manual_tasks')
		const manualTasks = manualTasksData || []
		
		// Load AI-generated tasks from localStorage
		const aiTasksData = storage.get<TaskRecommendation[]>('ai_recommendations')
		const aiTasks = aiTasksData || []
		
		// QUICK FIX: Show mock data immediately
		const mockRecommendations: TaskRecommendation[] = [
			{
				id: "mock-2",
				title: "Update Project: Mobile App Redesign",
				description: "No activity logged for 10 days. Project deadline is in 3 weeks. Immediate status update required.",
				priority: "high",
				category: "Project Update",
				deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
				dataSource: "Project Activity Monitoring",
				status: "pending",
				aiAnalysis: {
					projectName: "Mobile App Redesign v2.0",
					analysisDate: new Date().toISOString(),
					analysisReason: "AI has detected no work entries or progress updates for this project in the past 10 days, despite the approaching deadline. This unusual silence may indicate blocked progress, team availability issues, or scope changes that haven't been communicated.",
				relatedMembers: [
					{name: "David Kim", role: "UX Designer", department: "Design", memberType: "active"},
					{name: "Lisa Chen", role: "iOS Developer", department: "Engineering", memberType: "active"},
					{name: "James Park", role: "Android Developer", department: "Engineering", memberType: "related"}
				],
					detailedInstructions: [
						"Contact all team members to verify current project status",
						"Review last recorded milestone and identify what has been completed since",
						"Assess if deadline is still achievable or needs adjustment",
						"Document any blockers or dependencies preventing progress",
						"Update project timeline and communicate changes to stakeholders",
						"If project is on hold, formally update status in system"
					],
					expectedOutcome: "Resume regular project activity with daily work logging. Clear communication about project status and realistic timeline.",
					recommendations: [
						"Set up daily standup meetings until project momentum is restored",
						"Create shared project dashboard for real-time visibility",
						"Implement automated reminders for team to log daily progress",
						"Consider whether additional resources are needed"
					],
					riskFactors: [
						"Prolonged silence indicates potential project derailment",
						"Deadline may be at serious risk without immediate intervention",
						"Team may have lost context and need re-onboarding",
						"Stakeholders may be unaware of actual project status"
					]
				}
			},
			{
				id: "mock-3",
				title: "Review Team Capacity: Engineering Department",
				description: "Analysis shows 3 team members are working 45+ hours/week consistently. Consider workload rebalancing.",
				priority: "medium",
				category: "Resource Optimization",
				dataSource: "Work Hours Analysis",
				status: "pending",
				aiAnalysis: {
					projectName: "Engineering Team Capacity",
					analysisDate: new Date().toISOString(),
					analysisReason: "AI detected sustained high work hours for multiple team members over the past 4 weeks. This pattern often leads to burnout, decreased productivity, and increased error rates. Early intervention can prevent these issues.",
				relatedMembers: [
					{name: "Tom Wilson", role: "Senior Developer", department: "Engineering", memberType: "active"},
					{name: "Rachel Green", role: "Full Stack Engineer", department: "Engineering", memberType: "active"},
					{name: "Alex Martinez", role: "Backend Developer", department: "Engineering", memberType: "active"}
				],
					detailedInstructions: [
						"Review current project assignments for these team members",
						"Identify tasks that can be delegated or deprioritized",
						"Schedule 1-on-1 meetings to discuss workload concerns",
						"Evaluate if hiring additional resources is necessary",
						"Implement mandatory time-off policy if burnout risk is high",
						"Redistribute urgent tasks to other available team members"
					],
					expectedOutcome: "Reduce average work hours to sustainable 40 hours/week. Maintain productivity while preventing burnout.",
					recommendations: [
						"Consider bringing in contractors for short-term capacity boost",
						"Identify and automate repetitive tasks to free up time",
						"Reschedule non-critical deadlines to reduce pressure",
						"Implement 'no meeting' days to allow focused work time"
					],
					riskFactors: [
						"Continued overwork leads to increased attrition risk",
						"Quality of work may decline due to fatigue",
						"Team morale and collaboration may suffer",
						"Key knowledge holders may leave if not addressed"
					]
				}
			},
			{
				id: "mock-4",
				title: "Customer Success Initiative Planning",
				description: "AI suggests creating new initiative based on recent customer feedback patterns and support ticket analysis.",
				priority: "medium",
				category: "Strategic Initiative",
				dataSource: "Customer Data Analysis",
				status: "pending",
				aiAnalysis: {
					projectName: "Customer Success Enhancement Program",
					analysisDate: new Date().toISOString(),
					analysisReason: "Machine learning analysis of customer interactions over the past quarter revealed recurring themes: 25% increase in onboarding-related questions, 40% of support tickets related to feature discovery, and 15% improvement in retention for customers who completed product tours.",
				relatedMembers: [
					{name: "Jennifer Lee", role: "Head of Customer Success", department: "Customer Success", memberType: "active"},
					{name: "Mark Anderson", role: "Product Manager", department: "Product", memberType: "active"},
					{name: "Sophia Wang", role: "Support Team Lead", department: "Customer Support", memberType: "related"}
				],
					detailedInstructions: [
						"Analyze detailed customer feedback and support ticket data",
						"Design improved onboarding flow based on common pain points",
						"Create in-app guidance system for feature discovery",
						"Develop customer success playbook for high-touch accounts",
						"Implement NPS tracking at key customer journey milestones",
						"Schedule monthly customer advisory board meetings"
					],
					expectedOutcome: "Reduce onboarding time by 30%, decrease support tickets by 25%, and improve customer retention by 15% within next quarter.",
					recommendations: [
						"Start with pilot program for new customers",
						"Create video tutorials for top 10 most-asked questions",
						"Implement automated check-ins at 7, 30, and 90 day marks",
						"Build customer health score dashboard for proactive outreach"
					],
					riskFactors: [
						"Resource allocation needed from multiple departments",
						"May require product changes which take development time",
						"Success metrics need to be clearly defined upfront",
						"Change management needed to shift from reactive to proactive support"
					]
				}
			},
			{
				id: "mock-5",
				title: "Code Quality Review: Payment Processing Module",
				description: "Static analysis detected 15 potential security vulnerabilities in payment processing code. Immediate review recommended.",
				priority: "high",
				category: "Code Quality",
				dataSource: "Security Scan Results",
				status: "pending",
				aiAnalysis: {
					projectName: "Payment Processing System",
					analysisDate: new Date().toISOString(),
					analysisReason: "Automated security scanning identified multiple issues: 8 medium-severity vulnerabilities, 5 low-severity issues, and 2 high-priority code quality concerns. Given the sensitive nature of payment processing, immediate attention is warranted.",
				relatedMembers: [
					{name: "Robert Chang", role: "Security Engineer", department: "Security", memberType: "active"},
					{name: "Michelle Liu", role: "Backend Lead", department: "Engineering", memberType: "active"},
					{name: "Kevin Brown", role: "DevOps Engineer", department: "Infrastructure", memberType: "related"}
				],
					detailedInstructions: [
						"Conduct immediate security audit of payment processing code",
						"Prioritize fixing high-severity vulnerabilities within 48 hours",
						"Implement additional input validation and sanitization",
						"Review and update PCI DSS compliance documentation",
						"Add comprehensive unit tests for security-critical functions",
						"Schedule penetration testing after fixes are deployed",
						"Update security scanning rules to catch similar issues earlier"
					],
					expectedOutcome: "All high and medium severity issues resolved within 1 week. Enhanced security posture and compliance with industry standards.",
					recommendations: [
						"Implement pre-commit hooks for security scanning",
						"Schedule regular security training for development team",
						"Establish security champion role within engineering team",
						"Consider third-party security audit for critical systems"
					],
					riskFactors: [
						"Unaddressed vulnerabilities could lead to data breaches",
						"Compliance violations may result in fines or legal issues",
						"Customer trust and company reputation at stake",
						"Payment processor may suspend account if issues found during their audit"
					]
				}
			},
			{
				id: "mock-6",
				title: "Marketing Campaign Performance Review",
				description: "AI analysis shows campaign ROI below target by 35%. Recommend strategy adjustment or budget reallocation.",
				priority: "low",
				category: "Marketing Optimization",
				dataSource: "Campaign Analytics",
				status: "pending",
				aiAnalysis: {
					projectName: "Q4 Marketing Campaign",
					analysisDate: new Date().toISOString(),
					analysisReason: "Predictive analysis comparing current campaign performance against historical data and industry benchmarks indicates current trajectory will miss ROI targets by approximately 35%. Early course correction can salvage campaign effectiveness.",
				relatedMembers: [
					{name: "Amanda Stevens", role: "Marketing Director", department: "Marketing", memberType: "active"},
					{name: "Chris Thompson", role: "Growth Manager", department: "Growth", memberType: "active"},
					{name: "Nicole Davis", role: "Content Lead", department: "Marketing", memberType: "related"}
				],
					detailedInstructions: [
						"Analyze which campaign channels are underperforming vs. expectations",
						"Review messaging effectiveness and A/B test results",
						"Assess target audience alignment with actual engagement",
						"Evaluate creative assets performance and refresh underperforming content",
						"Consider reallocating budget from low-performing to high-performing channels",
						"Schedule campaign review meeting with all stakeholders"
					],
					expectedOutcome: "Improve campaign ROI to within 10% of target through optimization. Establish clear metrics for ongoing monitoring.",
					recommendations: [
						"Pause underperforming ad sets and reallocate budget",
						"Test new messaging angles based on customer feedback",
						"Leverage high-performing content across more channels",
						"Consider extending campaign timeline if early results are promising"
					],
					riskFactors: [
						"Budget may be wasted if changes aren't made quickly",
						"Missing targets could affect quarterly revenue goals",
						"Team morale may suffer from underperforming campaign",
						"Stakeholder confidence in marketing effectiveness may decline"
					]
				}
			}
		]
		const mockInsights: RecommendationInsight[] = [
			{type: "deadline", metric: "Upcoming", value: "3 deadlines in 2 weeks", status: "warning"},
			{type: "inactive", metric: "Projects", value: "1 inactive project", status: "warning"},
			{type: "info", metric: "Team Capacity", value: "3 members overworked", status: "warning"}
		]
		
		// Merge all recommendations: AI-generated, manual tasks, and mock data
		const allRecommendations = [...aiTasks, ...manualTasks, ...mockRecommendations]
		setRecommendations(allRecommendations)
		setInsights(mockInsights)
		setIsLoading(false)
	}

	// Recommendation handlers
	const handleAcceptTask = (id: string, startImmediately: boolean = false) => {
		const task = recommendations.find((rec) => rec.id === id)
		if (!task) return

		// 상태 업데이트
		setRecommendations((prev) =>
			prev.map((rec) => (rec.id === id ? { ...rec, status: 'accepted' } : rec))
		)
		
		// manual_tasks 또는 ai_recommendations에 저장
		const taskData = {
			...task,
			status: 'accepted' as const,
			acceptedAt: new Date().toISOString(),
		}
		
		if (task.isManual) {
			const manualTasks = storage.get<any[]>('manual_tasks') || []
			const updatedTasks = manualTasks.map(t => t.id === id ? taskData : t)
			storage.set('manual_tasks', updatedTasks)
		} else {
			const aiTasks = storage.get<any[]>('ai_recommendations') || []
			const updatedTasks = aiTasks.map(t => t.id === id ? taskData : t)
			storage.set('ai_recommendations', updatedTasks)
		}
		
		// 리듬 상태 업데이트
		updateAfterTaskChange()

		if (startImmediately) {
			// Work Input으로 이동하면서 Task 정보 전달
			sessionStorage.setItem('workInputData', JSON.stringify({
				taskId: task.id,
				title: task.title,
				description: task.description,
				category: task.category.toLowerCase().replace(/\s+/g, '-'),
				priority: task.priority,
				deadline: task.deadline,
				projectId: task.projectId,
				projectName: task.projectName,
				source: task.isManual ? 'manual-task' : 'ai-recommendation',
				mode: 'task-progress', // Task Progress Mode로 시작
			}))

			// Work Input 페이지로 이동
			navigate('/app/input')
			toast.success(t('aiRec.toasts.startingTask'))
		} else {
			toast.success(t('aiRec.toasts.taskAccepted'))
		}
	}

	const handleRejectTask = (id: string) => {
		setRecommendations((prev) =>
			prev.map((rec) => (rec.id === id ? { ...rec, status: 'rejected' } : rec))
		)
		
		// 리듬 상태 업데이트
		updateAfterTaskChange()
		
		toast.info(t('aiRec.toasts.taskDeclined'))
	}

	const handleRefreshRecommendations = () => {
		loadRecommendations()
		toast.success(t('aiRec.toasts.refreshed'))
	}
	
	// Handle manual task creation
	const handleCreateManualTask = () => {
		if (!manualTaskForm.title.trim()) {
			toast.error(t('aiRec.toasts.enterTitle'))
			return
		}
		
		if (!manualTaskForm.assignedToId) {
			toast.error(t('aiRec.toasts.selectAssignee'))
			return
		}
		
		const selectedProject = projects.find(p => p.id === manualTaskForm.projectId)
		const assignedUser = users.find(u => u.id === manualTaskForm.assignedToId)
		
		const newTask: TaskRecommendation = {
			id: `manual-${Date.now()}`,
			title: manualTaskForm.title,
			description: manualTaskForm.description,
			priority: manualTaskForm.priority,
			category: manualTaskForm.category || 'Manual Task',
			deadline: manualTaskForm.deadline || undefined,
			dataSource: 'Manual Entry',
			status: 'pending',
			projectId: manualTaskForm.projectId || undefined,
			projectName: selectedProject?.name || undefined,
			isManual: true,
			createdAt: new Date().toISOString(),
			createdBy: user?.name || 'Unknown User',
			assignedTo: assignedUser?.name,
			assignedToId: manualTaskForm.assignedToId,
		}
		
		// Save to localStorage
		const existingTasks = storage.get<TaskRecommendation[]>('manual_tasks') || []
		storage.set('manual_tasks', [...existingTasks, newTask])
		
		// Update state
		setRecommendations(prev => [...prev, newTask])
		
		// Send notification to assignee via Messages (with unified structure)
		if (assignedUser) {
			const messages = storage.get<any[]>('messages') || []
			const newMessage = {
				id: `msg-task-${Date.now()}`,
				type: 'task',
				priority: newTask.priority === 'high' ? 'urgent' : 'normal',
				subject: `New Task Assigned: ${newTask.title}`,
				from: user?.name || 'Unknown User',
				fromDepartment: user?.department,
				preview: `Task: ${newTask.title} - Priority: ${newTask.priority.toUpperCase()}`,
				content: `Hi ${assignedUser.name},\n\nYou have been assigned a new task by ${user?.name || 'Unknown User'}.\n\n**Task Details:**\n• Title: ${newTask.title}\n• Description: ${newTask.description}\n• Priority: ${newTask.priority.toUpperCase()}\n• Category: ${newTask.category}${newTask.deadline ? `\n• Deadline: ${new Date(newTask.deadline).toLocaleDateString()}` : ''}${newTask.projectName ? `\n• Project: ${newTask.projectName}` : ''}\n\nPlease review and take action accordingly.\n\n---\nThis is an automated notification from the Task Management system.`,
				timestamp: new Date(),
				isRead: false,
				isStarred: false,
				relatedType: 'task',
				relatedId: newTask.id,
				aiSummary: `New task assigned with ${newTask.priority} priority${newTask.deadline ? `, deadline: ${new Date(newTask.deadline).toLocaleDateString()}` : ''}`,
			}
			messages.unshift(newMessage)
			storage.set('messages', messages)
		}
		
		// Reset form and close modal
		setManualTaskForm({
			title: '',
			description: '',
			priority: 'medium',
			category: '',
			deadline: '',
			projectId: '',
			selectedDepartment: '',
			assignedToId: '',
		})
		setShowManualTaskModal(false)
		
		// 리듬 상태 업데이트
		updateAfterTaskChange()
		
		toast.success(t('aiRec.toasts.taskAssigned', { name: assignedUser?.name || '' }), {
			description: t('aiRec.toasts.notificationSent'),
		})
	}
	
	// Filter recommendations by project
	const getFilteredRecommendations = () => {
		if (selectedProjectFilter === 'all') {
			return recommendations
		}
		return recommendations.filter(rec => rec.projectId === selectedProjectFilter)
	}

	// Utility functions
	const getPriorityColor = (priority: TaskRecommendation['priority']) => {
		switch (priority) {
			case 'high':
				return 'bg-red-500/10 text-red-400 border border-red-500/20'
			case 'medium':
				return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
			case 'low':
				return 'bg-green-500/10 text-green-400 border border-green-500/20'
		}
	}

	const filteredRecommendations = getFilteredRecommendations()
	const pendingRecommendations = filteredRecommendations.filter((r) => r.status === 'pending')
	const acceptedCount = recommendations.filter((r) => r.status === 'accepted').length
	const manualTaskCount = recommendations.filter((r) => r.isManual).length
	const aiGeneratedCount = recommendations.filter((r) => r.id.startsWith('ai-')).length

	return (
		<div className="min-h-screen bg-background-dark text-neutral-100">
			{/* Header */}
			<div className="max-w-[1600px] mx-auto px-6 py-6 space-y-8">
			<PageHeader
				title={t('aiRec.title')}
				description={t('aiRec.description')}
				actions={
					<div className="flex gap-3">
						<Button
							size="sm"
							onClick={() => setShowManualTaskModal(true)}
							className="flex items-center gap-2 bg-white text-black hover:bg-neutral-200 border-none rounded-full"
						>
							<Plus className="h-4 w-4" />
							<span className="hidden sm:inline">{t('aiRec.createTask')}</span>
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={handleRefreshRecommendations}
							disabled={isLoading}
							className="flex items-center gap-2 border-border-dark hover:bg-border-dark text-white rounded-full"
						>
							<RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
							<span className="hidden sm:inline">{t('aiRec.refresh')}</span>
						</Button>
					</div>
				}
			/>
			
			<div className="space-y-6">
			
			{/* AI Insights */}
			{insights.length > 0 && (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{insights.map((insight, index) => {
						const getStatusColor = (status: string) => {
							switch (status) {
								case 'urgent':
									return 'border-l-red-500 bg-red-500/10'
								case 'warning':
									return 'border-l-orange-500 bg-orange-500/10'
								default:
									return 'border-l-blue-500 bg-blue-500/10'
							}
						}
						
						const getIcon = (type: string) => {
							switch (type) {
								case 'gap':
									return <TrendingUp className="h-5 w-5 text-orange-500" />
								case 'inactive':
									return <Clock className="h-5 w-5 text-orange-500" />
								case 'deadline':
									return <Calendar className="h-5 w-5 text-orange-500" />
								default:
									return <Brain className="h-5 w-5 text-blue-500" />
							}
						}
						
						return (
							<Card key={index} className={`border-l-4 border-t-0 border-r-0 border-b-0 bg-surface-dark border-border-dark ${getStatusColor(insight.status)}`}>
								<CardContent className="p-4 flex items-center gap-4">
									<div className="p-2 rounded-full bg-surface-dark/50 shrink-0">
										{getIcon(insight.type)}
									</div>
									<div className="flex-1 min-w-0">
										<h3 className="font-bold text-sm mb-1 text-white">{insight.metric}</h3>
										<p className="text-xs text-neutral-400">
											{insight.value}
										</p>
									</div>
								</CardContent>
							</Card>
						)
					})}
				</div>
			)}

			{/* Statistics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				{/* AI Generated Tasks */}
				<Card className="bg-surface-dark border-border-dark">
					<CardContent className="p-5">
						<div className="flex items-start justify-between">
							<div>
								<p className="text-sm text-neutral-500 font-medium mb-1">{t('aiRec.aiGenerated')}</p>
								<p className="text-2xl font-bold text-white">
									{aiGeneratedCount}
								</p>
							</div>
							<div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
								<Sparkles className="h-5 w-5" />
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Total Pending */}
				<Card className="bg-surface-dark border-border-dark">
					<CardContent className="p-5">
						<div className="flex items-start justify-between">
							<div>
								<p className="text-sm text-neutral-500 font-medium mb-1">{t('aiRec.totalPending')}</p>
								<p className="text-2xl font-bold text-white">
									{pendingRecommendations.length}
								</p>
							</div>
							<div className="p-3 rounded-2xl bg-neutral-800 text-neutral-400">
								<Brain className="h-5 w-5" />
							</div>
						</div>
					</CardContent>
				</Card>
				
				{/* Manual Tasks */}
				<Card className="bg-surface-dark border-border-dark">
					<CardContent className="p-5">
						<div className="flex items-start justify-between">
							<div>
								<p className="text-sm text-neutral-500 font-medium mb-1">{t('aiRec.manualTasks')}</p>
								<p className="text-2xl font-bold text-white">
									{manualTaskCount}
								</p>
							</div>
							<div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
								<Users className="h-5 w-5" />
							</div>
						</div>
					</CardContent>
				</Card>
				
				{/* Accepted Tasks */}
				<Card className="bg-surface-dark border-border-dark">
					<CardContent className="p-5">
						<div className="flex items-start justify-between">
							<div>
								<p className="text-sm text-neutral-500 font-medium mb-1">{t('aiRec.accepted')}</p>
								<p className="text-2xl font-bold text-white">
									{acceptedCount}
								</p>
							</div>
							<div className="p-3 rounded-2xl bg-green-500/10 text-green-500">
								<CheckCircle2 className="h-5 w-5" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Recommendations List */}
			<div className="mt-8">
				<h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
					<Sparkles className="h-5 w-5 text-orange-500" />
					{t('aiRec.recommendedActions')}
				</h2>
				<div className={isLoading || pendingRecommendations.length === 0 ? "space-y-4" : "grid grid-cols-1 xl:grid-cols-2 gap-6"}>
					{isLoading ? (
					<Card className="bg-surface-dark border-border-dark">
						<CardContent className="p-12 text-center">
							<RefreshCw className="h-12 w-12 mx-auto mb-4 text-orange-500 animate-spin" />
							<p className="text-neutral-400">
								{t('aiRec.loading')}
							</p>
						</CardContent>
					</Card>
				) : pendingRecommendations.length === 0 ? (
					<Card className="bg-surface-dark border-border-dark">
						<CardContent className="p-12 text-center">
							<Sparkles className="h-16 w-16 mx-auto mb-4 text-neutral-700" />
							<h3 className="text-lg font-bold mb-2 text-white">{t('aiRec.allCaughtUp')}</h3>
							<p className="text-neutral-400 mb-4">
								{t('aiRec.noNewRecs')}
							</p>
							<Button onClick={handleRefreshRecommendations} className="bg-white text-black hover:bg-neutral-200">
								<RefreshCw className="h-4 w-4 mr-2" />
								{t('aiRec.refresh')}
							</Button>
						</CardContent>
					</Card>
				) : (
					pendingRecommendations.map((task) => (
						<Card 
							key={task.id} 
							className={`bg-surface-dark border-border-dark hover:border-neutral-700 transition-all cursor-pointer group ${
								task.isManual 
									? 'border-l-4 border-l-blue-500' 
									: task.id.startsWith('ai-') 
									? 'border-l-4 border-l-emerald-500'
									: ''
							}`}
							onClick={() => setSelectedTask(task)}
						>
							<CardHeader className="border-b border-border-dark p-5">
								<div className="flex items-start justify-between gap-4">
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-3 flex-wrap">
											{/* Task Type Badge */}
											{task.isManual && (
												<span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
													<Users className="h-3 w-3" />
													{t('aiRec.manual')}
												</span>
											)}
											{!task.isManual && task.id.startsWith('ai-') && (
												<span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
													<Sparkles className="h-3 w-3" />
													{t('aiRec.aiGenerated')}
												</span>
											)}
											
											{/* Priority Badge */}
											<span
												className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${getPriorityColor(
													task.priority
												)}`}
											>
												{task.priority.toUpperCase()}
											</span>
											
											{/* Category Badge */}
											<span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-neutral-800 text-neutral-400 border border-neutral-700">
												{task.category}
											</span>
											
											{/* Project Badge */}
											{task.projectName && (
												<span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1">
													<Folder className="h-3 w-3" />
													{task.projectName}
												</span>
											)}
										</div>
										
										{/* Title */}
										<div className="flex items-center gap-2 mb-2">
											<h3 className="text-lg font-bold text-white group-hover:text-orange-500 transition-colors">{task.title}</h3>
										</div>
										
										<p className="text-sm text-neutral-400 line-clamp-2">
											{task.description}
										</p>
									</div>
								</div>
							</CardHeader>
							<CardContent className="p-5">
								<div className="space-y-4">
									{/* Task Details */}
									<div className="flex items-center gap-6 text-sm text-neutral-500">
										{task.assignedTo && (
											<div className="flex items-center gap-2">
												<Users className="h-4 w-4" />
												<span>
													{t('aiRec.assignTo')}: <span className="font-medium text-neutral-300">{task.assignedTo}</span>
												</span>
											</div>
										)}
										{task.deadline && (
											<div className="flex items-center gap-2">
												<Calendar className="h-4 w-4" />
												<span>
													{t('aiRec.deadline')}: <span className="font-medium text-neutral-300">{new Date(task.deadline).toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US')}</span>
												</span>
											</div>
										)}
									</div>

									{/* Data Source */}
									<div className="p-3 bg-neutral-900/50 border border-border-dark rounded-lg">
										<div className="flex items-start gap-2">
											<Brain className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
											<div className="flex-1 min-w-0">
												<p className="text-xs font-medium text-neutral-400 mb-0.5">
													{t('aiRec.dataSource')}
												</p>
												<p className="text-sm text-neutral-300">
													{task.dataSource}
													{task.createdBy && <span className="text-neutral-500"> • {t('aiRec.createdBy')} {task.createdBy}</span>}
												</p>
											</div>
										</div>
									</div>

								{/* Actions */}
								<div className="pt-2">
									<Button
										onClick={(e) => {
											e.stopPropagation()
											handleAcceptTask(task.id, true)
										}}
										variant="brand"
										className="w-full flex items-center justify-center gap-2"
									>
										<Zap className="h-4 w-4" />
										{t('aiRec.acceptStart')}
									</Button>
								</div>
								</div>
							</CardContent>
						</Card>
					))
				)}
			</div>
			</div>

			{/* Manual Task Creation Modal */}
			{showManualTaskModal && (
				<div 
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
					onClick={() => setShowManualTaskModal(false)}
				>
					<div 
						className="bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-800 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Modal Header */}
						<div className="p-6 border-b border-neutral-800">
							<div className="flex items-start justify-between gap-4">
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-2">
										<Plus className="h-6 w-6 text-primary" />
										<h2 className="text-2xl font-bold">{t('aiRec.createManual')}</h2>
									</div>
									<p className="text-sm text-neutral-400">
										{t('aiRec.addManualDesc')}
									</p>
								</div>
								<button
									onClick={() => setShowManualTaskModal(false)}
									className="text-neutral-500 hover:hover:text-neutral-300 transition-colors"
								>
									<X className="h-6 w-6" />
								</button>
							</div>
						</div>

						{/* Modal Content */}
						<div className="flex-1 overflow-y-auto p-6 space-y-4">
							{/* Title */}
							<div>
								<label className="block text-sm font-medium mb-2">
									{t('aiRec.taskTitle')} <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									value={manualTaskForm.title}
									onChange={(e) => setManualTaskForm(prev => ({ ...prev, title: e.target.value }))}
									placeholder={t('aiRec.taskTitlePlaceholder')}
									className="w-full px-3 py-2 border border-neutral-700 rounded-lg bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>

							{/* Description */}
							<div>
								<label className="block text-sm font-medium mb-2">
									{t('aiRec.description')}
								</label>
								<textarea
									value={manualTaskForm.description}
									onChange={(e) => setManualTaskForm(prev => ({ ...prev, description: e.target.value }))}
									placeholder={t('aiRec.descriptionPlaceholder')}
									rows={4}
									className="w-full px-3 py-2 border border-neutral-700 rounded-lg bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
								/>
							</div>

							{/* Priority */}
							<div>
								<label className="block text-sm font-medium mb-2">
									{t('aiRec.priority')}
								</label>
								<select
									value={manualTaskForm.priority}
									onChange={(e) => setManualTaskForm(prev => ({ ...prev, priority: e.target.value as 'high' | 'medium' | 'low' }))}
									className="w-full px-3 py-2 border border-neutral-700 rounded-lg bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary"
								>
									<option value="low">{t('aiRec.low')}</option>
									<option value="medium">{t('aiRec.medium')}</option>
									<option value="high">{t('aiRec.high')}</option>
								</select>
							</div>

							{/* Category */}
							<div>
								<label className="block text-sm font-medium mb-2">
									{t('aiRec.category')}
								</label>
								<input
									type="text"
									value={manualTaskForm.category}
									onChange={(e) => setManualTaskForm(prev => ({ ...prev, category: e.target.value }))}
									placeholder={t('aiRec.categoryPlaceholder')}
									className="w-full px-3 py-2 border border-neutral-700 rounded-lg bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>

							{/* Project */}
							<div>
								<label className="block text-sm font-medium mb-2">
									{t('aiRec.project')}
								</label>
								<select
									value={manualTaskForm.projectId}
									onChange={(e) => setManualTaskForm(prev => ({ ...prev, projectId: e.target.value }))}
									className="w-full px-3 py-2 border border-neutral-700 rounded-lg bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary"
								>
									<option value="">{t('aiRec.noProject')}</option>
									{projects.map((project) => (
										<option key={project.id} value={project.id}>
											{project.name}
										</option>
									))}
								</select>
							</div>

							{/* Deadline */}
							<div>
								<label className="block text-sm font-medium mb-2">
									{t('aiRec.deadline')}
								</label>
								<input
									type="date"
									value={manualTaskForm.deadline}
									onChange={(e) => setManualTaskForm(prev => ({ ...prev, deadline: e.target.value }))}
									className="w-full px-3 py-2 border border-neutral-700 rounded-lg bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>

							{/* Assign To */}
							<div className="space-y-4">
								<label className="block text-sm font-medium">
									{t('aiRec.assignTo')} <span className="text-red-500">*</span>
								</label>
								
								{/* Step 1: Department Selection */}
								<div>
									<label className="block text-xs font-medium text-neutral-400 mb-2">
										{t('aiRec.selectDepartment')}
									</label>
									<select
										value={manualTaskForm.selectedDepartment}
										onChange={(e) => setManualTaskForm(prev => ({ 
											...prev, 
											selectedDepartment: e.target.value,
											assignedToId: '' // Reset assignee when department changes
										}))}
										className="w-full px-3 py-2 border border-neutral-700 rounded-lg bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary"
									>
										<option value="">{t('aiRec.chooseDepartment')}</option>
										{Array.from(new Set(users.map(u => u.department).filter(Boolean))).sort().map((dept) => {
											const deptCount = users.filter(u => u.department === dept).length
											return (
												<option key={dept} value={dept}>
													{dept} ({deptCount} {deptCount === 1 ? t('aiRec.person') : t('aiRec.people')})
												</option>
											)
										})}
									</select>
								</div>
								
								{/* Step 2: Person Selection */}
								{manualTaskForm.selectedDepartment && (
									<div className="animate-fadeIn">
										<label className="block text-xs font-medium text-neutral-400 mb-2">
											{t('aiRec.selectPerson')}
										</label>
										<select
											value={manualTaskForm.assignedToId}
											onChange={(e) => setManualTaskForm(prev => ({ ...prev, assignedToId: e.target.value }))}
											className="w-full px-3 py-2 border-2 border-primary/border-primary/30 rounded-lg bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
											required
										>
											<option value="">
												{t('aiRec.selectPersonFromDepartment').replace('{department}', manualTaskForm.selectedDepartment)}
											</option>
											{users
												.filter(user => user.department === manualTaskForm.selectedDepartment)
												.sort((a, b) => a.name.localeCompare(b.name))
												.map((user) => (
													<option key={user.id} value={user.id}>
														{user.name} • {user.email}
													</option>
												))
											}
										</select>
										
										{/* Selected User Info */}
										{manualTaskForm.assignedToId && (
											<div className="mt-3 p-3 bg-primary/bg-primary/10 border border-primary/20 rounded-lg">
												<div className="flex items-center gap-2">
													<Users className="h-4 w-4 text-primary" />
													<div className="flex-1">
														<p className="text-sm font-medium">
															{users.find(u => u.id === manualTaskForm.assignedToId)?.name}
														</p>
														<p className="text-xs text-neutral-400">
															{t('aiRec.selectedUserInfo')}
														</p>
													</div>
													<span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
														{manualTaskForm.selectedDepartment}
													</span>
												</div>
											</div>
										)}
									</div>
								)}
								
								<p className="text-xs text-neutral-400">
									💡 {t('aiRec.notificationSent')}
								</p>
							</div>
						</div>

						{/* Modal Footer */}
						<div className="p-6 border-t border-neutral-800 bg-neutral-800/50">
							<div className="flex items-center gap-3">
								<Button
									onClick={handleCreateManualTask}
									className="flex-1 flex items-center justify-center gap-2"
								>
									<Plus className="h-4 w-4" />
									{t('aiRec.createTask')}
								</Button>
								<Button
									variant="outline"
									onClick={() => setShowManualTaskModal(false)}
									className="px-6"
								>
									{t('aiRec.cancel')}
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Task Detail Modal */}
			{selectedTask && selectedTask.aiAnalysis && (
				<div 
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
					onClick={() => setSelectedTask(null)}
				>
					<div 
						className="bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-800 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Modal Header */}
						<div className="p-6 border-b border-neutral-800">
							<div className="flex items-start justify-between gap-4">
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-3">
										<Sparkles className="h-6 w-6 text-primary" />
										<h2 className="text-2xl font-bold">{t('aiRec.aiAnalysis')}</h2>
									</div>
									<div className="flex items-center gap-2 mb-2">
										<span
											className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor(
												selectedTask.priority
											)}`}
										>
											{selectedTask.priority.toUpperCase()} {t('aiRec.priority')}
										</span>
										<span className="text-xs text-neutral-400 bg-neutral-800 px-2 py-1 rounded">
											{selectedTask.category}
										</span>
									</div>
									<h3 className="text-xl font-bold mb-2">{selectedTask.title}</h3>
									<p className="text-sm text-neutral-400">
										{selectedTask.description}
									</p>
								</div>
								<button
									onClick={() => setSelectedTask(null)}
									className="text-neutral-500 hover:hover:text-neutral-300 transition-colors"
								>
									<X className="h-6 w-6" />
								</button>
							</div>
						</div>

						{/* Modal Content */}
						<div className="flex-1 overflow-y-auto p-6 space-y-6">
							{/* Project Info */}
							<div className="p-4 bg-blue-900/20 border border-blue-800 rounded-xl">
								<div className="flex items-start gap-3">
									<Target className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
									<div className="flex-1">
										<h4 className="font-bold text-blue-100 mb-1">
											{t('aiRec.project')}: {selectedTask.aiAnalysis.projectName}
										</h4>
										<p className="text-sm text-blue-300">
											{t('aiRec.analysisDate')}: {new Date(selectedTask.aiAnalysis.analysisDate).toLocaleString()}
										</p>
									</div>
								</div>
							</div>

							{/* AI Analysis Reason */}
							<div>
								<div className="flex items-center gap-2 mb-3">
									<Brain className="h-5 w-5 text-primary" />
									<h4 className="font-bold text-lg">{t('aiRec.whyAiRecommends')}</h4>
								</div>
								<div className="p-4 bg-neutral-800/50 rounded-xl border border-neutral-700">
									<p className="text-sm leading-relaxed">{selectedTask.aiAnalysis.analysisReason}</p>
								</div>
							</div>

						{/* Related Team Members */}
						<div>
							<div className="flex items-center gap-2 mb-3">
								<Users className="h-5 w-5 text-primary" />
								<h4 className="font-bold text-lg">{t('aiRec.teamMembers')}</h4>
							</div>
							
							{/* Active Participants */}
							{selectedTask.aiAnalysis.relatedMembers.filter(m => m.memberType === 'active').length > 0 && (
								<div className="mb-4">
									<div className="flex items-center gap-2 mb-2">
										<div className="w-2 h-2 rounded-full bg-green-500"></div>
										<h5 className="text-sm font-semibold text-green-400">
											{t('aiRec.activeParticipants')} ({selectedTask.aiAnalysis.relatedMembers.filter(m => m.memberType === 'active').length})
										</h5>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
										{selectedTask.aiAnalysis.relatedMembers
											.filter(member => member.memberType === 'active')
											.map((member, index) => (
												<div
													key={`active-${index}`}
													className="p-3 bg-green-900/20 rounded-xl border-2 border-green-800"
												>
													<div className="flex items-center gap-3">
														<div className="w-10 h-10 rounded-full bg-linear-to-br from-green-600 to-green-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
															{member.name[0]}
														</div>
														<div className="flex-1 min-w-0">
															<p className="font-medium text-sm truncate">{member.name}</p>
															<p className="text-xs text-green-400 truncate font-medium">
																{member.role}
															</p>
															<p className="text-xs text-green-500 truncate">
																{member.department}
															</p>
														</div>
													</div>
												</div>
											))}
									</div>
								</div>
							)}
							
							{/* Related Members */}
							{selectedTask.aiAnalysis.relatedMembers.filter(m => m.memberType === 'related').length > 0 && (
								<div>
									<div className="flex items-center gap-2 mb-2">
										<div className="w-2 h-2 rounded-full bg-blue-500"></div>
										<h5 className="text-sm font-semibold text-blue-400">
											{t('aiRec.relatedMembers')} ({selectedTask.aiAnalysis.relatedMembers.filter(m => m.memberType === 'related').length})
										</h5>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
										{selectedTask.aiAnalysis.relatedMembers
											.filter(member => member.memberType === 'related')
											.map((member, index) => (
												<div
													key={`related-${index}`}
													className="p-3 bg-blue-900/20 rounded-xl border border-blue-800"
												>
													<div className="flex items-center gap-3">
														<div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
															{member.name[0]}
														</div>
														<div className="flex-1 min-w-0">
															<p className="font-medium text-sm truncate">{member.name}</p>
															<p className="text-xs text-blue-400 truncate font-medium">
																{member.role}
															</p>
															<p className="text-xs text-blue-500 truncate">
																{member.department}
															</p>
														</div>
													</div>
												</div>
											))}
									</div>
								</div>
							)}
						</div>

							{/* Detailed Instructions */}
							<div>
								<div className="flex items-center gap-2 mb-3">
									<CheckCircle2 className="h-5 w-5 text-primary" />
									<h4 className="font-bold text-lg">{t('aiRec.detailedInstructions')}</h4>
								</div>
								<div className="space-y-2">
									{selectedTask.aiAnalysis.detailedInstructions.map((instruction, index) => (
										<div
											key={index}
											className="flex items-start gap-3 p-3 bg-neutral-800/50 rounded-xl border border-neutral-700"
										>
											<div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
												{index + 1}
											</div>
											<p className="text-sm flex-1">{instruction}</p>
										</div>
									))}
								</div>
							</div>

							{/* Expected Outcome */}
							<div>
								<div className="flex items-center gap-2 mb-3">
									<Target className="h-5 w-5 text-primary" />
									<h4 className="font-bold text-lg">{t('aiRec.expectedOutcome')}</h4>
								</div>
								<div className="p-4 bg-green-900/20 border border-green-800 rounded-xl">
									<p className="text-sm leading-relaxed text-green-100">
										{selectedTask.aiAnalysis.expectedOutcome}
									</p>
								</div>
							</div>

							{/* AI Recommendations */}
							<div>
								<div className="flex items-center gap-2 mb-3">
									<Lightbulb className="h-5 w-5 text-primary" />
									<h4 className="font-bold text-lg">{t('aiRec.aiRecommendations')}</h4>
								</div>
								<div className="space-y-2">
									{selectedTask.aiAnalysis.recommendations.map((rec, index) => (
										<div
											key={index}
											className="flex items-start gap-3 p-3 bg-yellow-900/20 border border-yellow-800 rounded-xl"
										>
											<Lightbulb className="h-4 w-4 text-yellow-400 shrink-0 mt-0.5" />
											<p className="text-sm flex-1 text-yellow-100">{rec}</p>
										</div>
									))}
								</div>
							</div>

							{/* Risk Factors */}
							<div>
								<div className="flex items-center gap-2 mb-3">
									<AlertTriangle className="h-5 w-5 text-red-600" />
									<h4 className="font-bold text-lg">{t('aiRec.riskFactors')}</h4>
								</div>
								<div className="space-y-2">
									{selectedTask.aiAnalysis.riskFactors.map((risk, index) => (
										<div
											key={index}
											className="flex items-start gap-3 p-3 bg-red-900/20 border border-red-800 rounded-xl"
										>
											<AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
											<p className="text-sm flex-1 text-red-100">{risk}</p>
										</div>
									))}
								</div>
							</div>
						</div>

						{/* Modal Footer */}
						<div className="p-6 border-t border-neutral-800 bg-neutral-800/50">
							<div className="flex items-center gap-3">
								<Button
									onClick={(e) => {
										e.stopPropagation()
										handleAcceptTask(selectedTask.id)
										setSelectedTask(null)
									}}
									variant="brand"
									className="flex-1 flex items-center justify-center gap-2"
								>
									<CheckCircle2 className="h-4 w-4" />
									{t('aiRec.acceptCreate')}
								</Button>
								<Button
									variant="outline"
									onClick={(e) => {
										e.stopPropagation()
										handleRejectTask(selectedTask.id)
										setSelectedTask(null)
									}}
									className="flex-1 flex items-center justify-center gap-2"
								>
									<XCircle className="h-4 w-4" />
									{t('aiRec.decline')}
								</Button>
								<Button
									variant="outline"
									onClick={() => setSelectedTask(null)}
									className="px-6"
								>
									{t('common.close')}
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}

			<Toaster />
			</div>
			</div>
		</div>
	)
}
