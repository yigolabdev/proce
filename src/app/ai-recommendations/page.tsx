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
	// 상세 정보
	aiAnalysis?: {
		projectName: string
		analysisDate: string
		analysisReason: string
		relatedMembers: Array<{
			name: string
			role: string
			department: string
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

	useEffect(() => {
		loadRecommendations()
	}, [])

	// Load AI Recommendations
	const loadRecommendations = () => {
		setIsLoading(true)

		setTimeout(() => {
			// Load actual data from localStorage
			const projectsData = storage.get<any>('projects')
			const workEntriesData = storage.get<any>('workEntries')
			const objectivesData = storage.get<any>('objectives')
			
			const projects = projectsData ? JSON.parse(projectsData) : []
			const workEntries = workEntriesData ? JSON.parse(workEntriesData).map((e: { date: string; [key: string]: unknown }) => ({
				...e,
				date: new Date(e.date)
			})) : []
			const objectives = objectivesData ? JSON.parse(objectivesData) : []
			
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
								{ name: 'John Kim', role: 'Team Lead', department: 'Engineering' },
								{ name: 'Sarah Lee', role: 'Product Manager', department: 'Product' },
								{ name: 'Mike Chen', role: 'Developer', department: 'Engineering' },
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
									{ name: 'Emily Park', role: 'Project Manager', department: 'Product' },
									{ name: 'David Kim', role: 'Lead Developer', department: 'Engineering' },
									{ name: 'Lisa Wang', role: 'Designer', department: 'Design' },
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
								{ name: 'Alex Johnson', role: 'Program Manager', department: 'Product' },
								{ name: 'Rachel Green', role: 'Senior Developer', department: 'Engineering' },
								{ name: 'Tom Wilson', role: 'QA Lead', department: 'Quality Assurance' },
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

	const pendingRecommendations = recommendations.filter((r) => r.status === 'pending')
	const acceptedCount = recommendations.filter((r) => r.status === 'accepted').length

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
								className="hover:shadow-lg transition-shadow cursor-pointer"
								onClick={() => setSelectedTask(task)}
							>
								<CardHeader className="border-b border-neutral-200 dark:border-neutral-800">
									<div className="flex items-start justify-between gap-4">
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 mb-2">
												<span
													className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor(
														task.priority
													)}`}
												>
													{task.priority.toUpperCase()}
												</span>
												<span className="text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
													{task.category}
												</span>
											</div>
											<h3 className="text-lg font-bold mb-1">{task.title}</h3>
											<p className="text-sm text-neutral-600 dark:text-neutral-400">
												{task.description}
											</p>
										</div>
									</div>
								</CardHeader>
								<CardContent className="p-4">
									<div className="space-y-4">
										{/* Task Details */}
										{task.deadline && (
											<div className="flex items-center gap-2 text-sm">
												<Calendar className="h-4 w-4 text-neutral-500" />
												<span className="text-neutral-600 dark:text-neutral-400">
													Deadline: {new Date(task.deadline).toLocaleDateString()}
												</span>
											</div>
										)}

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
										<h4 className="font-bold text-lg">Related Team Members</h4>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
										{selectedTask.aiAnalysis.relatedMembers.map((member, index) => (
											<div
												key={index}
												className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700"
											>
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
														{member.name[0]}
													</div>
													<div className="flex-1 min-w-0">
														<p className="font-medium text-sm truncate">{member.name}</p>
														<p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
															{member.role}
														</p>
														<p className="text-xs text-neutral-500 dark:text-neutral-500 truncate">
															{member.department}
														</p>
													</div>
												</div>
											</div>
										))}
									</div>
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
