import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import {
	Sparkles,
	TrendingUp,
	Clock,
	Target,
	CheckCircle2,
	XCircle,
	RefreshCw,
	Brain,
	Zap,
	Calendar,
	Users,
	AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'

interface TaskRecommendation {
	id: string
	title: string
	description: string
	priority: 'high' | 'medium' | 'low'
	category: string
	estimatedTime: string
	deadline?: string
	reason: string
	relatedSkills: string[]
	confidence: number
	status: 'pending' | 'accepted' | 'rejected'
}

interface RecommendationInsight {
	type: 'productivity' | 'skill' | 'deadline' | 'workload'
	title: string
	description: string
	icon: React.ReactNode
}

export default function AIRecommendationsPage() {
	const [recommendations, setRecommendations] = useState<TaskRecommendation[]>([])
	const [insights, setInsights] = useState<RecommendationInsight[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

	useEffect(() => {
		loadRecommendations()
	}, [])

	const loadRecommendations = () => {
		setIsLoading(true)

		// Simulate API call
		setTimeout(() => {
			const mockRecommendations: TaskRecommendation[] = [
				{
					id: '1',
					title: 'Review Q4 Financial Reports',
					description: 'Analyze financial performance and prepare summary for stakeholders',
					priority: 'high',
					category: 'Finance',
					estimatedTime: '2 hours',
					deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
					reason: 'Based on your expertise in financial analysis and upcoming board meeting',
					relatedSkills: ['Financial Analysis', 'Data Interpretation', 'Reporting'],
					confidence: 92,
					status: 'pending',
				},
				{
					id: '2',
					title: 'Update Customer Database',
					description: 'Clean and update customer contact information in CRM system',
					priority: 'medium',
					category: 'Data Management',
					estimatedTime: '1.5 hours',
					reason: 'Your recent work on data quality improvement makes you ideal for this task',
					relatedSkills: ['Data Entry', 'CRM Systems', 'Attention to Detail'],
					confidence: 85,
					status: 'pending',
				},
				{
					id: '3',
					title: 'Prepare Team Meeting Agenda',
					description: 'Create agenda for next week\'s team sync meeting',
					priority: 'medium',
					category: 'Meeting',
					estimatedTime: '30 minutes',
					deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
					reason: 'You have consistently organized effective team meetings',
					relatedSkills: ['Communication', 'Organization', 'Leadership'],
					confidence: 88,
					status: 'pending',
				},
				{
					id: '4',
					title: 'Code Review: Authentication Module',
					description: 'Review pull request for new authentication implementation',
					priority: 'high',
					category: 'Development',
					estimatedTime: '1 hour',
					deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
					reason: 'Your security expertise is needed for this critical feature',
					relatedSkills: ['Code Review', 'Security', 'Backend Development'],
					confidence: 95,
					status: 'pending',
				},
				{
					id: '5',
					title: 'Document API Endpoints',
					description: 'Create comprehensive documentation for new REST API endpoints',
					priority: 'low',
					category: 'Documentation',
					estimatedTime: '2 hours',
					reason: 'Your clear writing style would make this documentation excellent',
					relatedSkills: ['Technical Writing', 'API Design', 'Documentation'],
					confidence: 78,
					status: 'pending',
				},
			]

			const mockInsights: RecommendationInsight[] = [
				{
					type: 'productivity',
					title: 'Peak Productivity Time',
					description: 'You work best between 9 AM - 12 PM. Consider scheduling complex tasks during this time.',
					icon: <TrendingUp className="h-5 w-5 text-green-500" />,
				},
				{
					type: 'skill',
					title: 'Skill Match',
					description: 'Your financial analysis skills are in high demand this week.',
					icon: <Target className="h-5 w-5 text-blue-500" />,
				},
				{
					type: 'deadline',
					title: 'Upcoming Deadlines',
					description: '3 tasks require attention within the next 48 hours.',
					icon: <AlertCircle className="h-5 w-5 text-orange-500" />,
				},
				{
					type: 'workload',
					title: 'Balanced Workload',
					description: 'Your current task distribution is optimal for this week.',
					icon: <CheckCircle2 className="h-5 w-5 text-purple-500" />,
				},
			]

			setRecommendations(mockRecommendations)
			setInsights(mockInsights)
			setLastUpdated(new Date())
			setIsLoading(false)
		}, 1500)
	}

	const handleAccept = (id: string) => {
		setRecommendations((prev) =>
			prev.map((rec) => (rec.id === id ? { ...rec, status: 'accepted' } : rec))
		)
		toast.success('Task accepted and added to your work list')
	}

	const handleReject = (id: string) => {
		setRecommendations((prev) =>
			prev.map((rec) => (rec.id === id ? { ...rec, status: 'rejected' } : rec))
		)
		toast.success('Task rejected')
	}

	const handleRefresh = () => {
		loadRecommendations()
		toast.success('Recommendations refreshed')
	}

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'high':
				return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400'
			case 'medium':
				return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400'
			case 'low':
				return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
			default:
				return 'text-neutral-600 bg-neutral-50 dark:bg-neutral-900/20 dark:text-neutral-400'
		}
	}

	const getConfidenceColor = (confidence: number) => {
		if (confidence >= 90) return 'text-green-600'
		if (confidence >= 80) return 'text-blue-600'
		if (confidence >= 70) return 'text-orange-600'
		return 'text-neutral-600'
	}

	const pendingRecommendations = recommendations.filter((rec) => rec.status === 'pending')
	const acceptedRecommendations = recommendations.filter((rec) => rec.status === 'accepted')

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold flex items-center gap-3">
						<Brain className="h-8 w-8 text-primary" />
						AI Task Recommendations
					</h1>
					<p className="mt-2 text-neutral-600 dark:text-neutral-400">
						Personalized task suggestions based on your skills, workload, and productivity patterns
					</p>
				</div>
				<div className="flex items-center gap-3">
					{lastUpdated && (
						<div className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
							<Clock className="h-4 w-4" />
							Updated {lastUpdated.toLocaleTimeString()}
						</div>
					)}
					<Button onClick={handleRefresh} variant="outline" disabled={isLoading}>
						<RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
						Refresh
					</Button>
				</div>
			</div>

			{/* AI Insights */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{insights.map((insight, index) => (
					<Card key={index} className="border-l-4 border-l-primary">
						<CardContent className="p-4">
							<div className="flex items-start gap-3">
								<div className="mt-1">{insight.icon}</div>
								<div className="flex-1">
									<h3 className="font-bold text-sm mb-1">{insight.title}</h3>
									<p className="text-xs text-neutral-600 dark:text-neutral-400">
										{insight.description}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Pending Recommendations */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-bold flex items-center gap-2">
							<Sparkles className="h-5 w-5 text-primary" />
							Recommended Tasks ({pendingRecommendations.length})
						</h2>
					</div>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="flex items-center justify-center py-12">
							<RefreshCw className="h-8 w-8 animate-spin text-primary" />
						</div>
					) : pendingRecommendations.length > 0 ? (
						<div className="space-y-4">
							{pendingRecommendations.map((rec) => (
								<div
									key={rec.id}
									className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
								>
									<div className="flex items-start justify-between mb-3">
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-2">
												<h3 className="font-bold text-lg">{rec.title}</h3>
												<span
													className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(
														rec.priority
													)}`}
												>
													{rec.priority.toUpperCase()}
												</span>
											</div>
											<p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
												{rec.description}
											</p>

											<div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
												<div className="flex items-center gap-2 text-xs">
													<Clock className="h-4 w-4 text-neutral-500" />
													<span>{rec.estimatedTime}</span>
												</div>
												<div className="flex items-center gap-2 text-xs">
													<Target className="h-4 w-4 text-neutral-500" />
													<span>{rec.category}</span>
												</div>
												{rec.deadline && (
													<div className="flex items-center gap-2 text-xs">
														<Calendar className="h-4 w-4 text-neutral-500" />
														<span>
															Due {new Date(rec.deadline).toLocaleDateString()}
														</span>
													</div>
												)}
												<div className="flex items-center gap-2 text-xs">
													<Zap className={`h-4 w-4 ${getConfidenceColor(rec.confidence)}`} />
													<span className={getConfidenceColor(rec.confidence)}>
														{rec.confidence}% match
													</span>
												</div>
											</div>

											<div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-3">
												<div className="flex items-start gap-2">
													<Brain className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
													<div>
														<p className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-1">
															Why this task?
														</p>
														<p className="text-xs text-blue-700 dark:text-blue-300">
															{rec.reason}
														</p>
													</div>
												</div>
											</div>

											<div className="flex flex-wrap gap-2">
												{rec.relatedSkills.map((skill, idx) => (
													<span
														key={idx}
														className="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full"
													>
														{skill}
													</span>
												))}
											</div>
										</div>
									</div>

									<div className="flex items-center gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
										<Button onClick={() => handleAccept(rec.id)} className="flex-1">
											<CheckCircle2 className="h-4 w-4 mr-2" />
											Accept Task
										</Button>
										<Button
											onClick={() => handleReject(rec.id)}
											variant="outline"
											className="flex-1"
										>
											<XCircle className="h-4 w-4 mr-2" />
											Not Now
										</Button>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-12">
							<Sparkles className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
							<p className="text-neutral-600 dark:text-neutral-400">
								No new recommendations at the moment. Check back later!
							</p>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Accepted Tasks */}
			{acceptedRecommendations.length > 0 && (
				<Card>
					<CardHeader>
						<h2 className="text-xl font-bold flex items-center gap-2">
							<CheckCircle2 className="h-5 w-5 text-green-500" />
							Accepted Tasks ({acceptedRecommendations.length})
						</h2>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{acceptedRecommendations.map((rec) => (
								<div
									key={rec.id}
									className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl"
								>
									<div className="flex items-center justify-between">
										<div className="flex-1">
											<h3 className="font-bold text-sm mb-1">{rec.title}</h3>
											<div className="flex items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
												<span className="flex items-center gap-1">
													<Clock className="h-3 w-3" />
													{rec.estimatedTime}
												</span>
												<span className="flex items-center gap-1">
													<Target className="h-3 w-3" />
													{rec.category}
												</span>
											</div>
										</div>
										<CheckCircle2 className="h-5 w-5 text-green-600" />
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* How It Works */}
			<Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
				<CardContent className="p-6">
					<h3 className="font-bold text-lg mb-4 flex items-center gap-2">
						<Brain className="h-5 w-5 text-primary" />
						How AI Recommendations Work
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="flex items-start gap-3">
							<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
								<Users className="h-4 w-4 text-primary" />
							</div>
							<div>
								<h4 className="font-bold text-sm mb-1">Skill Analysis</h4>
								<p className="text-xs text-neutral-600 dark:text-neutral-400">
									Analyzes your past work and expertise to match relevant tasks
								</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
								<TrendingUp className="h-4 w-4 text-primary" />
							</div>
							<div>
								<h4 className="font-bold text-sm mb-1">Productivity Patterns</h4>
								<p className="text-xs text-neutral-600 dark:text-neutral-400">
									Considers your peak performance times and work habits
								</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
								<Target className="h-4 w-4 text-primary" />
							</div>
							<div>
								<h4 className="font-bold text-sm mb-1">Priority Balancing</h4>
								<p className="text-xs text-neutral-600 dark:text-neutral-400">
									Balances urgency, importance, and your current workload
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

