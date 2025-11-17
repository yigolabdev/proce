import { storage } from '../../utils/storage'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import DevMemo from '../../components/dev/DevMemo'
import { DEV_MEMOS } from '../../constants/devMemos'
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
	Filter,
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
	
	// AI Recommendations state
	const [recommendations, setRecommendations] = useState<TaskRecommendation[]>([])
	const [insights, setInsights] = useState<RecommendationInsight[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
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
		assignedToId: '',
	})
	
	// Project filtering state
	const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([])
	const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>('all')
	
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
				{ id: '1', name: 'John Doe', email: 'john@company.com', department: 'Engineering' },
				{ id: '2', name: 'Sarah Chen', email: 'sarah@company.com', department: 'Product' },
				{ id: '3', name: 'Mike Johnson', email: 'mike@company.com', department: 'Engineering' },
				{ id: '4', name: 'Emily Davis', email: 'emily@company.com', department: 'Design' },
				{ id: '5', name: 'David Lee', email: 'david@company.com', department: 'Engineering' },
				{ id: '6', name: 'Lisa Park', email: 'lisa@company.com', department: 'Marketing' },
				{ id: '7', name: 'Alex Kim', email: 'alex@company.com', department: 'Engineering' },
				{ id: '8', name: 'Rachel Green', email: 'rachel@company.com', department: 'Sales' },
				{ id: '9', name: 'Tom Wilson', email: 'tom@company.com', department: 'Operations' },
				{ id: '10', name: 'Chris Brown', email: 'chris@company.com', department: 'Engineering' },
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
				id: "mock-1",
				title: "Complete Q4 2024 OKR Review",
				description: "AI detected that Q4 OKRs are 45% complete with 2 weeks remaining. Immediate action required to meet quarterly goals.",
				priority: "high",
				category: "OKR Update",
				deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
				dataSource: "OKR Progress Analysis",
				status: "pending",
				aiAnalysis: {
					projectName: "Quarterly Business Objectives Q4 2024",
					analysisDate: new Date().toISOString(),
					analysisReason: "AI analysis shows that current progress rate (45%) is below the expected pace for meeting the end-of-quarter deadline. Based on historical data, teams typically need to be at 70% completion at this stage.",
				relatedMembers: [
					{name: "Sarah Johnson", role: "Product Manager", department: "Product", memberType: "active"},
					{name: "Michael Chen", role: "Engineering Lead", department: "Engineering", memberType: "active"},
					{name: "Emily Park", role: "Team Lead", department: "Operations", memberType: "related"}
				],
					detailedInstructions: [
						"Schedule urgent team meeting to review all key results and current progress",
						"Identify blockers preventing completion of each key result",
						"Reallocate resources to prioritize critical objectives",
						"Update key result metrics to reflect actual current state",
						"Create action plan with daily milestones for remaining 2 weeks",
						"Assign clear owners for each remaining task"
					],
					expectedOutcome: "Achieve at least 85% completion by quarter end. Daily standup meetings and progress tracking will be essential to maintain momentum.",
					recommendations: [
						"Consider extending working hours for critical tasks",
						"Deprioritize non-essential initiatives until quarter end",
						"Schedule daily 15-minute sync meetings to track progress",
						"Prepare stakeholder communication about realistic completion targets"
					],
					riskFactors: [
						"High risk of missing quarterly targets at current pace",
						"Team may be overcommitted with competing priorities",
						"Some key results may need to be rescoped or deferred",
						"Stakeholder expectations may need to be reset"
					]
				}
			},
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
			{type: "gap", metric: "Q4 OKRs", value: "45% complete", status: "urgent"},
			{type: "inactive", metric: "Projects", value: "1 inactive project", status: "warning"},
			{type: "deadline", metric: "Upcoming", value: "3 deadlines in 2 weeks", status: "warning"},
			{type: "info", metric: "Team Capacity", value: "3 members overworked", status: "warning"}
		]
		
		// Merge all recommendations: AI-generated, manual tasks, and mock data
		const allRecommendations = [...aiTasks, ...manualTasks, ...mockRecommendations]
		setRecommendations(allRecommendations)
		setInsights(mockInsights)
		setLastUpdated(new Date())
		setIsLoading(false)
		return


		setTimeout(() => {
			// Load actual data from localStorage
			const projectsData = storage.get<any[]>('projects')
			const workEntriesData = storage.get<any[]>('workEntries')
			const objectivesData = storage.get<any[]>('objectives')
			
			const projects = projectsData || []
			const workEntries = workEntriesData ? workEntriesData.map((e: { date: string; [key: string]: unknown }) => ({
				...e,
				date: new Date(e.date)
			})) : []
			const objectives = objectivesData || []
			
			// Analyze and generate recommendations
			const generatedRecommendations: TaskRecommendation[] = []
			const generatedInsights: RecommendationInsight[] = []
			
			// 1. OKR Progress Gap Analysis
			objectives.forEach((objective: { id: string; title: string; endDate: string; keyResults?: Array<{ current: number; target: number }> }) => {
				if (!objective.keyResults || objective.keyResults.length === 0) return
				
				const avgProgress = objective.keyResults.reduce((sum: number, kr: { current: number; target: number }) => 
					sum + ((kr.current / kr.target) * 100), 0) / objective.keyResults.length
				
				if (avgProgress < 50) {
					generatedRecommendations.push({
						id: `okr-${objective.id}`,
						title: `Update OKR: ${objective.title}`,
						description: `Current progress: ${Math.round(avgProgress)}%. Update key results to improve overall goal achievement.`,
						priority: avgProgress < 30 ? 'high' : 'medium',
						category: 'OKR Update',
						deadline: objective.endDate,
						dataSource: `OKR Data (${objective.keyResults.length} Key Results)`,
						status: 'pending',
						aiAnalysis: {
							projectName: objective.title,
							analysisDate: new Date().toISOString(),
							analysisReason: `AI detected that the current progress rate (${Math.round(avgProgress)}%) is significantly below the expected pace for meeting the deadline. Without intervention, there is a high risk of missing key results.`,
						relatedMembers: [
							{ name: 'John Kim', role: 'Team Lead', department: 'Engineering', memberType: 'active' },
							{ name: 'Sarah Lee', role: 'Product Manager', department: 'Product', memberType: 'active' },
							{ name: 'Mike Chen', role: 'Developer', department: 'Engineering', memberType: 'related' },
						],
							detailedInstructions: [
								'Review current key results and identify blockers preventing progress',
								'Schedule team sync to discuss action items and resource allocation',
								'Update key result metrics to reflect current state accurately',
								'Create action plan with specific tasks and deadlines for each key result',
								'Assign clear owners for each action item',
							],
							expectedOutcome: `Increase progress to at least 60% within the next 2 weeks. This will require daily check-ins and clear task delegation among team members.`,
							recommendations: [
								'Consider breaking down large key results into smaller, measurable milestones',
								'Schedule weekly OKR review meetings to track progress',
								'Identify and remove any blockers affecting team productivity',
								'Reallocate resources if necessary to prioritize critical objectives',
							],
							riskFactors: [
								'Current pace suggests high risk of missing deadline',
								'Low progress may indicate unclear objectives or resource constraints',
								'Team may be overcommitted with competing priorities',
							],
						},
					})
					
					generatedInsights.push({
						type: 'gap',
						metric: objective.title,
						value: `${Math.round(avgProgress)}% complete`,
						status: avgProgress < 30 ? 'urgent' : 'warning',
					})
				}
			})
			
			// 2. Inactive Projects Detection
			const sevenDaysAgo = new Date()
			sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
			
			let inactiveProjectCount = 0
			projects
				.filter((p: { status: string }) => p.status === 'active')
				.forEach((project: { id: string; name: string }) => {
					const recentWork = workEntries.filter((e: { projectId?: string; date: Date }) => 
						e.projectId === project.id && new Date(e.date) >= sevenDaysAgo
					)
					
					if (recentWork.length === 0) {
						inactiveProjectCount++
						generatedRecommendations.push({
							id: `project-${project.id}`,
							title: `Update Project: ${project.name}`,
							description: `No activity in 7 days. Consider logging progress or updating status.`,
							priority: 'medium',
							category: 'Project Update',
							dataSource: `Project Status (Last activity: 7+ days ago)`,
							status: 'pending',
							aiAnalysis: {
								projectName: project.name,
								analysisDate: new Date().toISOString(),
								analysisReason: 'AI has detected that this project has had no work activity logged for over 7 days. This could indicate stalled progress, completed work not being logged, or potential project abandonment.',
							relatedMembers: [
								{ name: 'Emily Park', role: 'Project Manager', department: 'Product', memberType: 'active' },
								{ name: 'David Kim', role: 'Lead Developer', department: 'Engineering', memberType: 'active' },
								{ name: 'Lisa Wang', role: 'Designer', department: 'Design', memberType: 'related' },
							],
								detailedInstructions: [
									'Contact project team members to verify current project status',
									'Review last recorded activity and identify next steps',
									'Update project timeline and milestones if needed',
									'Log any completed work that hasn\'t been recorded',
									'If project is blocked, document blockers and escalate if necessary',
									'Update project status (Active/On Hold/Completed) accordingly',
								],
								expectedOutcome: 'Resume regular work logging and maintain project momentum. Ensure all team members are aligned on current priorities and next steps.',
								recommendations: [
									'Set up automated reminders for team members to log daily progress',
									'Schedule brief daily standups to maintain project visibility',
									'Create a shared dashboard for real-time project status updates',
									'If project is deprioritized, formally update status to avoid confusion',
								],
								riskFactors: [
									'Prolonged inactivity may lead to project failure or cancellation',
									'Team members may lose context and momentum',
									'Stakeholders may lose confidence in project progress',
									'Resources may be reallocated if inactivity continues',
								],
							},
						})
					}
				})
			
			if (inactiveProjectCount > 0) {
				generatedInsights.push({
					type: 'inactive',
					metric: 'Projects',
					value: `${inactiveProjectCount} inactive ${inactiveProjectCount === 1 ? 'project' : 'projects'}`,
					status: 'warning',
				})
			}
			
			// 3. Upcoming Deadlines Analysis
			const now = new Date()
			const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)
			
			const upcomingDeadlines = objectives.filter((obj: { endDate: string }) => {
				const endDate = new Date(obj.endDate)
				return endDate >= now && endDate <= twoDaysFromNow
			})
			
			if (upcomingDeadlines.length > 0) {
				upcomingDeadlines.forEach((obj: { id: string; title: string; endDate: string }) => {
					generatedRecommendations.push({
						id: `deadline-${obj.id}`,
						title: `Deadline Alert: ${obj.title}`,
						description: `OKR deadline: ${new Date(obj.endDate).toLocaleDateString()}. Finalize key results.`,
						priority: 'high',
						category: 'Deadline',
						deadline: obj.endDate,
						dataSource: `OKR Deadline Tracking`,
						status: 'pending',
						aiAnalysis: {
							projectName: obj.title,
							analysisDate: new Date().toISOString(),
							analysisReason: `Critical deadline approaching in less than 48 hours. AI analysis shows this objective requires immediate attention to ensure timely completion and delivery of all key results.`,
						relatedMembers: [
							{ name: 'Alex Johnson', role: 'Program Manager', department: 'Product', memberType: 'active' },
							{ name: 'Rachel Green', role: 'Senior Developer', department: 'Engineering', memberType: 'active' },
							{ name: 'Tom Wilson', role: 'QA Lead', department: 'Quality Assurance', memberType: 'related' },
						],
							detailedInstructions: [
								'Immediately convene emergency team meeting to assess completion status',
								'Review all key results and verify completion percentage',
								'Identify any pending tasks or deliverables',
								'Prioritize critical remaining work for immediate completion',
								'Prepare final status report and documentation',
								'Schedule stakeholder presentation or review meeting',
								'Document lessons learned and improvement opportunities',
							],
							expectedOutcome: 'Complete all key results before deadline. Ensure proper documentation and handoff of deliverables. Prepare comprehensive status report for stakeholders.',
							recommendations: [
								'Cancel or reschedule non-critical meetings to focus on deadline',
								'Consider extending working hours or bringing in additional resources if needed',
								'Set up war room for final push to completion',
								'Prepare contingency plan in case deadline cannot be met',
								'Communicate proactively with stakeholders about status',
							],
							riskFactors: [
								'Very short timeframe increases risk of incomplete deliverables',
								'Team may experience burnout from compressed timeline',
								'Quality may be compromised if rushing to meet deadline',
								'Missing deadline could impact dependent projects or commitments',
							],
						},
					})
				})
				
				generatedInsights.push({
					type: 'deadline',
					metric: 'Deadlines',
					value: `${upcomingDeadlines.length} in next 48 hours`,
					status: 'urgent',
				})
			}
			
			// 4. Data Summary Insight
			generatedInsights.unshift({
				type: 'info',
				metric: 'Data Sources',
				value: `${projects.length} projects, ${objectives.length} OKRs, ${workEntries.length} work entries`,
				status: 'info',
			})

			setRecommendations(generatedRecommendations)
			setInsights(generatedInsights)
			setLastUpdated(new Date())
			setIsLoading(false)
		}, 1000)
	}

	// Recommendation handlers
	const handleAcceptTask = (id: string) => {
		const task = recommendations.find((rec) => rec.id === id)
		if (!task) return

		// Work Input으로 이동하면서 추천 정보 전달
		sessionStorage.setItem('workInputData', JSON.stringify({
			title: task.title,
			description: task.description,
			category: task.category.toLowerCase().replace(/\s+/g, '-'),
			priority: task.priority,
			deadline: task.deadline,
			source: 'ai-recommendation'
		}))

		// 상태 업데이트
		setRecommendations((prev) =>
			prev.map((rec) => (rec.id === id ? { ...rec, status: 'accepted' } : rec))
		)

		// Work Input 페이지로 이동
		navigate('/app/input')
		toast.success('Redirecting to Work Input to complete task details...')
	}

	const handleRejectTask = (id: string) => {
		setRecommendations((prev) =>
			prev.map((rec) => (rec.id === id ? { ...rec, status: 'rejected' } : rec))
		)
		toast.info('Task declined. We\'ll adjust future recommendations.')
	}

	const handleRefreshRecommendations = () => {
		loadRecommendations()
		toast.success('Recommendations refreshed')
	}
	
	// Handle manual task creation
	const handleCreateManualTask = () => {
		if (!manualTaskForm.title.trim()) {
			toast.error('Please enter a task title')
			return
		}
		
		if (!manualTaskForm.assignedToId) {
			toast.error('Please select an assignee')
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
			createdBy: 'Current User', // TODO: Get from auth context
			assignedTo: assignedUser?.name,
			assignedToId: manualTaskForm.assignedToId,
		}
		
		// Save to localStorage
		const existingTasks = storage.get<TaskRecommendation[]>('manual_tasks') || []
		storage.set('manual_tasks', [...existingTasks, newTask])
		
		// Update state
		setRecommendations(prev => [...prev, newTask])
		
		// Send notification to assignee via Messages
		if (assignedUser) {
			const messages = storage.get<any[]>('messages') || []
			const newMessage = {
				id: `msg-task-${Date.now()}`,
				type: 'info',
				priority: newTask.priority === 'high' ? 'high' : 'medium',
				title: `🎯 New Task Assigned: ${newTask.title}`,
				content: `Hi ${assignedUser.name},\n\nYou have been assigned a new task by Current User.\n\n**Task Details:**\n• Title: ${newTask.title}\n• Description: ${newTask.description}\n• Priority: ${newTask.priority.toUpperCase()}\n• Category: ${newTask.category}${newTask.deadline ? `\n• Deadline: ${new Date(newTask.deadline).toLocaleDateString()}` : ''}${newTask.projectName ? `\n• Project: ${newTask.projectName}` : ''}\n\nPlease review and take action accordingly.\n\n---\nThis is an automated notification from the Task Management system.`,
				date: new Date(),
				isRead: false,
				isStarred: false,
				isArchived: false,
				sender: 'Current User',
				tags: ['task-assignment', 'action-required', newTask.priority],
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
			assignedToId: '',
		})
		setShowManualTaskModal(false)
		
		toast.success(`Task assigned to ${assignedUser?.name}`, {
			description: 'Notification sent to Messages',
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
				return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
			case 'medium':
				return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
			case 'low':
				return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
		}
	}

	const formatTimestamp = (date: Date) => {
		const now = new Date()
		const diff = now.getTime() - date.getTime()
		const minutes = Math.floor(diff / 1000 / 60)
		const hours = Math.floor(minutes / 60)
		const days = Math.floor(hours / 24)

		if (minutes < 60) return `${minutes}m ago`
		if (hours < 24) return `${hours}h ago`
		if (days < 7) return `${days}d ago`
		return date.toLocaleDateString()
	}

	const filteredRecommendations = getFilteredRecommendations()
	const pendingRecommendations = filteredRecommendations.filter((r) => r.status === 'pending')
	const acceptedCount = recommendations.filter((r) => r.status === 'accepted').length
	const manualTaskCount = recommendations.filter((r) => r.isManual).length
	const aiGeneratedCount = recommendations.filter((r) => r.id.startsWith('ai-')).length

	return (
		<>
			<DevMemo content={DEV_MEMOS.INBOX} pagePath="/app/ai-recommendations/page.tsx" />
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold flex items-center gap-3">
							<Sparkles className="h-8 w-8 text-primary" />
							AI Recommendations
						</h1>
						<p className="mt-2 text-neutral-600 dark:text-neutral-400">
							AI-powered task recommendations based on your work data
						</p>
					</div>
					<div className="flex items-center gap-2">
						<Button
							variant="primary"
							size="sm"
							onClick={() => setShowManualTaskModal(true)}
							className="flex items-center gap-2"
						>
							<Plus className="h-4 w-4" />
							Create Task
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={handleRefreshRecommendations}
							disabled={isLoading}
							className="flex items-center gap-2"
						>
							<RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
							Refresh
						</Button>
					</div>
				</div>
				
				{/* Statistics Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					{/* Total Tasks */}
					<Card className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 border-neutral-200 dark:border-neutral-700">
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Total Pending</p>
									<p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
										{pendingRecommendations.length}
									</p>
								</div>
								<Brain className="h-8 w-8 text-neutral-600 dark:text-neutral-400" />
							</div>
						</CardContent>
					</Card>
					
					{/* AI Generated Tasks */}
					<Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 border-emerald-200 dark:border-emerald-800">
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xs text-emerald-700 dark:text-emerald-400 mb-1 font-medium">AI Generated</p>
									<p className="text-2xl font-bold text-emerald-900 dark:text-emerald-300">
										{aiGeneratedCount}
									</p>
								</div>
								<Sparkles className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
							</div>
						</CardContent>
					</Card>
					
					{/* Manual Tasks */}
					<Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 border-blue-200 dark:border-blue-800">
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xs text-blue-700 dark:text-blue-400 mb-1 font-medium">Manual Tasks</p>
									<p className="text-2xl font-bold text-blue-900 dark:text-blue-300">
										{manualTaskCount}
									</p>
								</div>
								<Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
							</div>
						</CardContent>
					</Card>
					
					{/* Accepted Tasks */}
					<Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 border-green-200 dark:border-green-800">
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xs text-green-700 dark:text-green-400 mb-1">Accepted</p>
									<p className="text-2xl font-bold text-green-900 dark:text-green-300">
										{acceptedCount}
									</p>
								</div>
								<CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
							</div>
						</CardContent>
					</Card>
				</div>
				
				{/* Project Filter */}
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center gap-4">
							<div className="flex items-center gap-2 text-sm font-medium">
								<Filter className="h-4 w-4 text-neutral-500" />
								Filter by Project:
							</div>
							<select
								value={selectedProjectFilter}
								onChange={(e) => setSelectedProjectFilter(e.target.value)}
								className="flex-1 max-w-md px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary"
							>
								<option value="all">All Projects ({recommendations.filter(r => r.status === 'pending').length})</option>
								{projects.map((project) => {
									const projectTaskCount = recommendations.filter(
										r => r.projectId === project.id && r.status === 'pending'
									).length
									return (
										<option key={project.id} value={project.id}>
											{project.name} ({projectTaskCount})
										</option>
									)
								})}
							</select>
						<div className="flex items-center gap-4">
							{aiGeneratedCount > 0 && (
								<div className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
									<Zap className="h-4 w-4" />
									<span>{aiGeneratedCount} AI generated</span>
								</div>
							)}
							{manualTaskCount > 0 && (
								<div className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-2">
									<Plus className="h-4 w-4" />
									<span>{manualTaskCount} manual</span>
								</div>
							)}
						</div>
						</div>
					</CardContent>
				</Card>

				{/* Stats */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Card>
						<CardContent className="p-4">
							<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Pending Tasks</div>
							<div className="text-2xl font-bold">{pendingRecommendations.length}</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4">
							<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Accepted</div>
							<div className="text-2xl font-bold text-green-600">{acceptedCount}</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4">
							<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Last Updated</div>
							<div className="text-sm font-medium">
								{lastUpdated ? formatTimestamp(lastUpdated) : 'Never'}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* AI Insights */}
				{insights.length > 0 && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						{insights.map((insight, index) => {
							const getStatusColor = (status: string) => {
								switch (status) {
									case 'urgent':
										return 'border-l-red-500 bg-red-50/50 dark:bg-red-900/10'
									case 'warning':
										return 'border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10'
									default:
										return 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10'
								}
							}
							
							const getIcon = (type: string) => {
								switch (type) {
									case 'gap':
										return <TrendingUp className="h-4 w-4 text-orange-600" />
									case 'inactive':
										return <Clock className="h-4 w-4 text-yellow-600" />
									case 'deadline':
										return <Calendar className="h-4 w-4 text-red-600" />
									default:
										return <Brain className="h-4 w-4 text-blue-600" />
								}
							}
							
							return (
								<Card key={index} className={`border-l-4 ${getStatusColor(insight.status)}`}>
									<CardContent className="p-4">
										<div className="flex items-start gap-3">
											<div className="flex-shrink-0 mt-0.5">{getIcon(insight.type)}</div>
											<div className="flex-1 min-w-0">
												<h3 className="font-bold text-sm mb-1">{insight.metric}</h3>
												<p className="text-xs text-neutral-600 dark:text-neutral-400">
													{insight.value}
												</p>
											</div>
										</div>
									</CardContent>
								</Card>
							)
						})}
					</div>
				)}

				{/* Recommendations List */}
				<div className="space-y-4">
					{isLoading ? (
						<Card>
							<CardContent className="p-12 text-center">
								<RefreshCw className="h-12 w-12 mx-auto mb-4 text-primary animate-spin" />
								<p className="text-neutral-600 dark:text-neutral-400">
									Loading recommendations...
								</p>
							</CardContent>
						</Card>
					) : pendingRecommendations.length === 0 ? (
						<Card>
							<CardContent className="p-12 text-center">
								<Sparkles className="h-16 w-16 mx-auto mb-4 text-neutral-300 dark:text-neutral-700" />
								<h3 className="text-lg font-bold mb-2">All Caught Up!</h3>
								<p className="text-neutral-600 dark:text-neutral-400 mb-4">
									No new recommendations at the moment. Check back later!
								</p>
								<Button onClick={handleRefreshRecommendations}>
									<RefreshCw className="h-4 w-4 mr-2" />
									Refresh Recommendations
								</Button>
							</CardContent>
						</Card>
					) : (
						pendingRecommendations.map((task) => (
							<Card 
								key={task.id} 
								className={`hover:shadow-lg transition-shadow cursor-pointer ${
									task.isManual 
										? 'border-l-4 border-l-blue-500' 
										: task.id.startsWith('ai-') 
										? 'border-l-4 border-l-emerald-500'
										: ''
								}`}
								onClick={() => setSelectedTask(task)}
							>
								<CardHeader className="border-b border-neutral-200 dark:border-neutral-800">
									<div className="flex items-start justify-between gap-4">
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 mb-2 flex-wrap">
												{/* Task Type Badge - Most Prominent */}
												{task.isManual && (
													<span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md flex items-center gap-1.5">
														<Users className="h-3.5 w-3.5" />
														MANUAL TASK
													</span>
												)}
												{!task.isManual && task.id.startsWith('ai-') && (
													<span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md flex items-center gap-1.5 animate-pulse">
														<Sparkles className="h-3.5 w-3.5" />
														AI GENERATED
													</span>
												)}
												
												{/* Priority Badge */}
												<span
													className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor(
														task.priority
													)}`}
												>
													{task.priority.toUpperCase()}
												</span>
												
												{/* Category Badge */}
												<span className="text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
													{task.category}
												</span>
												
												{/* Project Badge */}
												{task.projectName && (
													<span className="text-xs text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded flex items-center gap-1">
														<Folder className="h-3 w-3" />
														{task.projectName}
													</span>
												)}
											</div>
											
											{/* Title with Icon */}
											<div className="flex items-center gap-2 mb-1">
												{task.isManual ? (
													<Users className="h-5 w-5 text-blue-500 shrink-0" />
												) : task.id.startsWith('ai-') ? (
													<Sparkles className="h-5 w-5 text-emerald-500 shrink-0" />
												) : null}
												<h3 className="text-lg font-bold">{task.title}</h3>
											</div>
											
											<p className="text-sm text-neutral-600 dark:text-neutral-400">
												{task.description}
											</p>
										</div>
									</div>
								</CardHeader>
								<CardContent className="p-4">
									<div className="space-y-4">
										{/* Task Details */}
										<div className="space-y-2">
											{task.assignedTo && (
												<div className="flex items-center gap-2 text-sm">
													<Users className="h-4 w-4 text-neutral-500" />
													<span className="text-neutral-600 dark:text-neutral-400">
														Assigned to: <span className="font-medium text-neutral-900 dark:text-neutral-100">{task.assignedTo}</span>
													</span>
												</div>
											)}
											{task.deadline && (
												<div className="flex items-center gap-2 text-sm">
													<Calendar className="h-4 w-4 text-neutral-500" />
													<span className="text-neutral-600 dark:text-neutral-400">
														Deadline: {new Date(task.deadline).toLocaleDateString()}
													</span>
												</div>
											)}
										</div>

										{/* Data Source */}
										<div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
											<div className="flex items-start gap-2">
												<Brain className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
												<div className="flex-1 min-w-0">
													<p className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-1">
														Data Source
													</p>
													<p className="text-xs text-blue-700 dark:text-blue-300">
														{task.dataSource}
														{task.createdBy && ` • Created by ${task.createdBy}`}
													</p>
												</div>
											</div>
										</div>

										{/* Actions */}
										<div className="flex items-center gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
											<Button
												onClick={(e) => {
													e.stopPropagation()
													handleAcceptTask(task.id)
												}}
												className="flex-1 flex items-center justify-center gap-2"
											>
												<CheckCircle2 className="h-4 w-4" />
												Accept Task
											</Button>
											<Button
												variant="outline"
												onClick={(e) => {
													e.stopPropagation()
													handleRejectTask(task.id)
												}}
												className="flex-1 flex items-center justify-center gap-2"
											>
												<XCircle className="h-4 w-4" />
												Not Now
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						))
					)}
				</div>

				{/* Manual Task Creation Modal */}
				{showManualTaskModal && (
					<div 
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
						onClick={() => setShowManualTaskModal(false)}
					>
						<div 
							className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
							onClick={(e) => e.stopPropagation()}
						>
							{/* Modal Header */}
							<div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
								<div className="flex items-start justify-between gap-4">
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-2">
											<Plus className="h-6 w-6 text-primary" />
											<h2 className="text-2xl font-bold">Create Manual Task</h2>
										</div>
										<p className="text-sm text-neutral-600 dark:text-neutral-400">
											Add a task manually to your recommendations list
										</p>
									</div>
									<button
										onClick={() => setShowManualTaskModal(false)}
										className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
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
										Task Title <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										value={manualTaskForm.title}
										onChange={(e) => setManualTaskForm(prev => ({ ...prev, title: e.target.value }))}
										placeholder="Enter task title"
										className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary"
									/>
								</div>

								{/* Description */}
								<div>
									<label className="block text-sm font-medium mb-2">
										Description
									</label>
									<textarea
										value={manualTaskForm.description}
										onChange={(e) => setManualTaskForm(prev => ({ ...prev, description: e.target.value }))}
										placeholder="Enter task description"
										rows={4}
										className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
									/>
								</div>

								{/* Priority */}
								<div>
									<label className="block text-sm font-medium mb-2">
										Priority
									</label>
									<select
										value={manualTaskForm.priority}
										onChange={(e) => setManualTaskForm(prev => ({ ...prev, priority: e.target.value as 'high' | 'medium' | 'low' }))}
										className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary"
									>
										<option value="low">Low</option>
										<option value="medium">Medium</option>
										<option value="high">High</option>
									</select>
								</div>

								{/* Category */}
								<div>
									<label className="block text-sm font-medium mb-2">
										Category
									</label>
									<input
										type="text"
										value={manualTaskForm.category}
										onChange={(e) => setManualTaskForm(prev => ({ ...prev, category: e.target.value }))}
										placeholder="e.g., Development, Design, Marketing"
										className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary"
									/>
								</div>

								{/* Project */}
								<div>
									<label className="block text-sm font-medium mb-2">
										Project
									</label>
									<select
										value={manualTaskForm.projectId}
										onChange={(e) => setManualTaskForm(prev => ({ ...prev, projectId: e.target.value }))}
										className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary"
									>
										<option value="">No Project</option>
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
										Deadline
									</label>
									<input
										type="date"
										value={manualTaskForm.deadline}
										onChange={(e) => setManualTaskForm(prev => ({ ...prev, deadline: e.target.value }))}
										className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary"
									/>
								</div>

								{/* Assign To */}
								<div>
									<label className="block text-sm font-medium mb-2">
										Assign To <span className="text-red-500">*</span>
									</label>
									<select
										value={manualTaskForm.assignedToId}
										onChange={(e) => setManualTaskForm(prev => ({ ...prev, assignedToId: e.target.value }))}
										className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary"
										required
									>
										<option value="">Select Assignee</option>
										{users.map((user) => (
											<option key={user.id} value={user.id}>
												{user.name} {user.department ? `(${user.department})` : ''}
											</option>
										))}
									</select>
									<p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
										The selected person will receive a notification in Messages
									</p>
								</div>
							</div>

							{/* Modal Footer */}
							<div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
								<div className="flex items-center gap-3">
									<Button
										onClick={handleCreateManualTask}
										className="flex-1 flex items-center justify-center gap-2"
									>
										<Plus className="h-4 w-4" />
										Create Task
									</Button>
									<Button
										variant="outline"
										onClick={() => setShowManualTaskModal(false)}
										className="px-6"
									>
										Cancel
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
							className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
							onClick={(e) => e.stopPropagation()}
						>
							{/* Modal Header */}
							<div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
								<div className="flex items-start justify-between gap-4">
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-3">
											<Sparkles className="h-6 w-6 text-primary" />
											<h2 className="text-2xl font-bold">AI Analysis & Instructions</h2>
										</div>
										<div className="flex items-center gap-2 mb-2">
											<span
												className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor(
													selectedTask.priority
												)}`}
											>
												{selectedTask.priority.toUpperCase()} PRIORITY
											</span>
											<span className="text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
												{selectedTask.category}
											</span>
										</div>
										<h3 className="text-xl font-bold mb-2">{selectedTask.title}</h3>
										<p className="text-sm text-neutral-600 dark:text-neutral-400">
											{selectedTask.description}
										</p>
									</div>
									<button
										onClick={() => setSelectedTask(null)}
										className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
									>
										<X className="h-6 w-6" />
									</button>
								</div>
							</div>

							{/* Modal Content */}
							<div className="flex-1 overflow-y-auto p-6 space-y-6">
								{/* Project Info */}
								<div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
									<div className="flex items-start gap-3">
										<Target className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
										<div className="flex-1">
											<h4 className="font-bold text-blue-900 dark:text-blue-100 mb-1">
												Project: {selectedTask.aiAnalysis.projectName}
											</h4>
											<p className="text-sm text-blue-700 dark:text-blue-300">
												Analysis Date: {new Date(selectedTask.aiAnalysis.analysisDate).toLocaleString()}
											</p>
										</div>
									</div>
								</div>

								{/* AI Analysis Reason */}
								<div>
									<div className="flex items-center gap-2 mb-3">
										<Brain className="h-5 w-5 text-primary" />
										<h4 className="font-bold text-lg">Why AI Recommends This</h4>
									</div>
									<div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
										<p className="text-sm leading-relaxed">{selectedTask.aiAnalysis.analysisReason}</p>
									</div>
								</div>

							{/* Related Team Members */}
							<div>
								<div className="flex items-center gap-2 mb-3">
									<Users className="h-5 w-5 text-primary" />
									<h4 className="font-bold text-lg">Team Members</h4>
								</div>
								
								{/* Active Participants */}
								{selectedTask.aiAnalysis.relatedMembers.filter(m => m.memberType === 'active').length > 0 && (
									<div className="mb-4">
										<div className="flex items-center gap-2 mb-2">
											<div className="w-2 h-2 rounded-full bg-green-500"></div>
											<h5 className="text-sm font-semibold text-green-700 dark:text-green-400">
												Active Participants ({selectedTask.aiAnalysis.relatedMembers.filter(m => m.memberType === 'active').length})
											</h5>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
											{selectedTask.aiAnalysis.relatedMembers
												.filter(member => member.memberType === 'active')
												.map((member, index) => (
													<div
														key={`active-${index}`}
														className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border-2 border-green-200 dark:border-green-800"
													>
														<div className="flex items-center gap-3">
															<div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-green-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
																{member.name[0]}
															</div>
															<div className="flex-1 min-w-0">
																<p className="font-medium text-sm truncate">{member.name}</p>
																<p className="text-xs text-green-700 dark:text-green-400 truncate font-medium">
																	{member.role}
																</p>
																<p className="text-xs text-green-600 dark:text-green-500 truncate">
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
											<h5 className="text-sm font-semibold text-blue-700 dark:text-blue-400">
												Related Members ({selectedTask.aiAnalysis.relatedMembers.filter(m => m.memberType === 'related').length})
											</h5>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
											{selectedTask.aiAnalysis.relatedMembers
												.filter(member => member.memberType === 'related')
												.map((member, index) => (
													<div
														key={`related-${index}`}
														className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
													>
														<div className="flex items-center gap-3">
															<div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
																{member.name[0]}
															</div>
															<div className="flex-1 min-w-0">
																<p className="font-medium text-sm truncate">{member.name}</p>
																<p className="text-xs text-blue-700 dark:text-blue-400 truncate font-medium">
																	{member.role}
																</p>
																<p className="text-xs text-blue-600 dark:text-blue-500 truncate">
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
										<h4 className="font-bold text-lg">Detailed Instructions</h4>
									</div>
									<div className="space-y-2">
										{selectedTask.aiAnalysis.detailedInstructions.map((instruction, index) => (
											<div
												key={index}
												className="flex items-start gap-3 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700"
											>
												<div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
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
										<h4 className="font-bold text-lg">Expected Outcome</h4>
									</div>
									<div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
										<p className="text-sm leading-relaxed text-green-900 dark:text-green-100">
											{selectedTask.aiAnalysis.expectedOutcome}
										</p>
									</div>
								</div>

								{/* AI Recommendations */}
								<div>
									<div className="flex items-center gap-2 mb-3">
										<Lightbulb className="h-5 w-5 text-primary" />
										<h4 className="font-bold text-lg">AI Recommendations</h4>
									</div>
									<div className="space-y-2">
										{selectedTask.aiAnalysis.recommendations.map((rec, index) => (
											<div
												key={index}
												className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl"
											>
												<Lightbulb className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
												<p className="text-sm flex-1 text-yellow-900 dark:text-yellow-100">{rec}</p>
											</div>
										))}
									</div>
								</div>

								{/* Risk Factors */}
								<div>
									<div className="flex items-center gap-2 mb-3">
										<AlertTriangle className="h-5 w-5 text-red-600" />
										<h4 className="font-bold text-lg">Risk Factors</h4>
									</div>
									<div className="space-y-2">
										{selectedTask.aiAnalysis.riskFactors.map((risk, index) => (
											<div
												key={index}
												className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
											>
												<AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
												<p className="text-sm flex-1 text-red-900 dark:text-red-100">{risk}</p>
											</div>
										))}
									</div>
								</div>
							</div>

							{/* Modal Footer */}
							<div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
								<div className="flex items-center gap-3">
									<Button
										onClick={(e) => {
											e.stopPropagation()
											handleAcceptTask(selectedTask.id)
											setSelectedTask(null)
										}}
										className="flex-1 flex items-center justify-center gap-2"
									>
										<CheckCircle2 className="h-4 w-4" />
										Accept & Create Task
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
										Decline Task
									</Button>
									<Button
										variant="outline"
										onClick={() => setSelectedTask(null)}
										className="px-6"
									>
										Close
									</Button>
								</div>
							</div>
						</div>
					</div>
				)}

				<Toaster />
			</div>
		</>
	)
}
