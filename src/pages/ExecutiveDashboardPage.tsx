import { useState } from 'react'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { 
	TrendingUp, 
	TrendingDown, 
	DollarSign, 
	Users, 
	Target, 
	AlertCircle,
	Briefcase,
	Activity,
	ArrowUpRight,
	ArrowDownRight,
	FileText,
	Sparkles,
	BarChart3,
	Clock,
	CheckCircle2,
	AlertTriangle,
	Zap,
	Brain,
	Filter
} from 'lucide-react'
import { Button } from '../components/ui/Button'

interface KPICard {
	title: string
	value: string
	change: number
	trend: 'up' | 'down'
	icon: any
	color: string
}

interface Insight {
	id: string
	type: 'success' | 'warning' | 'info' | 'critical'
	title: string
	description: string
	impact: 'high' | 'medium' | 'low'
	timestamp: Date
	actionRequired: boolean
}

interface DepartmentPerformance {
	name: string
	efficiency: number
	revenue: string
	growth: number
	headcount: number
	status: 'excellent' | 'good' | 'attention' | 'critical'
}

interface StrategicInitiative {
	id: string
	name: string
	progress: number
	status: 'on-track' | 'at-risk' | 'delayed'
	owner: string
	dueDate: Date
	impact: string
}

export default function ExecutiveDashboardPage() {
	const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month')

	// Executive KPIs
	const kpis: KPICard[] = [
		{
			title: 'Total Revenue',
			value: '$12.4M',
			change: 18.5,
			trend: 'up',
			icon: DollarSign,
			color: 'text-green-600 dark:text-green-400',
		},
		{
			title: 'Operating Margin',
			value: '34.2%',
			change: 5.3,
			trend: 'up',
			icon: TrendingUp,
			color: 'text-blue-600 dark:text-blue-400',
		},
		{
			title: 'Employee Productivity',
			value: '87.3',
			change: -2.1,
			trend: 'down',
			icon: Activity,
			color: 'text-orange-600 dark:text-orange-400',
		},
		{
			title: 'Customer Satisfaction',
			value: '4.8/5.0',
			change: 0.3,
			trend: 'up',
			icon: Target,
			color: 'text-purple-600 dark:text-purple-400',
		},
		{
			title: 'Cash Flow',
			value: '$3.2M',
			change: 12.8,
			trend: 'up',
			icon: Briefcase,
			color: 'text-teal-600 dark:text-teal-400',
		},
		{
			title: 'Headcount',
			value: '247',
			change: 8.0,
			trend: 'up',
			icon: Users,
			color: 'text-indigo-600 dark:text-indigo-400',
		},
	]

	// AI-Generated Insights
	const insights: Insight[] = [
		{
			id: '1',
			type: 'critical',
			title: 'Revenue Growth Acceleration Detected',
			description: 'Q4 revenue is tracking 23% above forecast. Sales team productivity increased by 45% following new CRM implementation.',
			impact: 'high',
			timestamp: new Date('2025-10-29T09:30:00'),
			actionRequired: false,
		},
		{
			id: '2',
			type: 'warning',
			title: 'Engineering Team Capacity Alert',
			description: 'Development team is at 112% capacity. Consider hiring 2-3 additional engineers or re-prioritizing Q1 roadmap.',
			impact: 'high',
			timestamp: new Date('2025-10-29T08:15:00'),
			actionRequired: true,
		},
		{
			id: '3',
			type: 'success',
			title: 'Customer Retention Improvement',
			description: 'Churn rate decreased by 18% this quarter. New onboarding process showing strong results.',
			impact: 'medium',
			timestamp: new Date('2025-10-28T16:45:00'),
			actionRequired: false,
		},
		{
			id: '4',
			type: 'info',
			title: 'Market Expansion Opportunity',
			description: 'Analysis shows 34% demand increase in APAC region. Recommend exploring partnership opportunities in Singapore and Tokyo.',
			impact: 'high',
			timestamp: new Date('2025-10-28T14:20:00'),
			actionRequired: true,
		},
		{
			id: '5',
			type: 'warning',
			title: 'Operating Costs Trending Up',
			description: 'Cloud infrastructure costs increased 15% MoM. Review usage patterns and consider reserved instance purchases.',
			impact: 'medium',
			timestamp: new Date('2025-10-27T11:30:00'),
			actionRequired: true,
		},
	]

	// Department Performance
	const departments: DepartmentPerformance[] = [
		{
			name: 'Sales',
			efficiency: 92,
			revenue: '$5.2M',
			growth: 28.5,
			headcount: 45,
			status: 'excellent',
		},
		{
			name: 'Engineering',
			efficiency: 88,
			revenue: '$4.1M',
			growth: 15.2,
			headcount: 78,
			status: 'good',
		},
		{
			name: 'Marketing',
			efficiency: 85,
			revenue: '$1.8M',
			growth: 22.1,
			headcount: 32,
			status: 'good',
		},
		{
			name: 'Customer Success',
			efficiency: 78,
			revenue: '$1.1M',
			growth: -3.2,
			headcount: 28,
			status: 'attention',
		},
		{
			name: 'Operations',
			efficiency: 81,
			revenue: '$0.2M',
			growth: 5.5,
			headcount: 24,
			status: 'good',
		},
		{
			name: 'Finance',
			efficiency: 90,
			revenue: '$0.0M',
			growth: 0,
			headcount: 18,
			status: 'excellent',
		},
	]

	// Strategic Initiatives
	const initiatives: StrategicInitiative[] = [
		{
			id: '1',
			name: 'Enterprise Product Launch',
			progress: 78,
			status: 'on-track',
			owner: 'Product Team',
			dueDate: new Date('2025-12-15'),
			impact: 'High - $2M ARR potential',
		},
		{
			id: '2',
			name: 'APAC Market Entry',
			progress: 45,
			status: 'at-risk',
			owner: 'Business Development',
			dueDate: new Date('2026-02-28'),
			impact: 'High - New market segment',
		},
		{
			id: '3',
			name: 'AI Integration Platform',
			progress: 92,
			status: 'on-track',
			owner: 'Engineering',
			dueDate: new Date('2025-11-30'),
			impact: 'Medium - Competitive advantage',
		},
		{
			id: '4',
			name: 'Customer Portal Redesign',
			progress: 34,
			status: 'delayed',
			owner: 'UX Team',
			dueDate: new Date('2025-11-15'),
			impact: 'Medium - Customer satisfaction',
		},
	]

	const getInsightIcon = (type: Insight['type']) => {
		switch (type) {
			case 'critical':
				return <AlertCircle className="h-5 w-5" />
			case 'warning':
				return <AlertTriangle className="h-5 w-5" />
			case 'success':
				return <CheckCircle2 className="h-5 w-5" />
			case 'info':
				return <Sparkles className="h-5 w-5" />
		}
	}

	const getInsightColor = (type: Insight['type']) => {
		switch (type) {
			case 'critical':
				return 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
			case 'warning':
				return 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20'
			case 'success':
				return 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
			case 'info':
				return 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
		}
	}

	const getInsightTextColor = (type: Insight['type']) => {
		switch (type) {
			case 'critical':
				return 'text-red-700 dark:text-red-300'
			case 'warning':
				return 'text-orange-700 dark:text-orange-300'
			case 'success':
				return 'text-green-700 dark:text-green-300'
			case 'info':
				return 'text-blue-700 dark:text-blue-300'
		}
	}

	const getStatusColor = (status: DepartmentPerformance['status']) => {
		switch (status) {
			case 'excellent':
				return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
			case 'good':
				return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
			case 'attention':
				return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
			case 'critical':
				return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
		}
	}

	const getInitiativeStatusColor = (status: StrategicInitiative['status']) => {
		switch (status) {
			case 'on-track':
				return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
			case 'at-risk':
				return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
			case 'delayed':
				return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
		}
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold flex items-center gap-3">
						<Brain className="h-8 w-8 text-primary" />
						Executive Dashboard
					</h1>
					<p className="mt-2 text-neutral-600 dark:text-neutral-400">
						Real-time insights and strategic overview for leadership
					</p>
				</div>
				<div className="flex items-center gap-2">
					<select
						value={timeRange}
						onChange={(e) => setTimeRange(e.target.value as any)}
						className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900 text-sm"
					>
						<option value="week">This Week</option>
						<option value="month">This Month</option>
						<option value="quarter">This Quarter</option>
						<option value="year">This Year</option>
					</select>
					<Button variant="outline" className="flex items-center gap-2">
						<FileText className="h-4 w-4" />
						Export Report
					</Button>
				</div>
			</div>

			{/* Executive KPIs */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{kpis.map((kpi) => {
					const Icon = kpi.icon
					return (
						<Card key={kpi.title} className="hover:shadow-lg transition-shadow">
							<CardContent className="p-6">
								<div className="flex items-start justify-between mb-4">
									<div className={`p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 ${kpi.color}`}>
										<Icon className="h-6 w-6" />
									</div>
									<div className={`flex items-center gap-1 text-sm font-medium ${
										kpi.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
									}`}>
										{kpi.trend === 'up' ? (
											<ArrowUpRight className="h-4 w-4" />
										) : (
											<ArrowDownRight className="h-4 w-4" />
										)}
										{Math.abs(kpi.change)}%
									</div>
								</div>
								<h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
									{kpi.title}
								</h3>
								<p className="text-3xl font-bold">{kpi.value}</p>
							</CardContent>
						</Card>
					)
				})}
			</div>

			{/* AI-Generated Insights */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Sparkles className="h-6 w-6 text-primary" />
							<div>
								<h2 className="text-xl font-bold">AI-Powered Insights</h2>
								<p className="text-sm text-neutral-600 dark:text-neutral-400">
									Real-time analysis and recommendations
								</p>
							</div>
						</div>
						<Button variant="outline" size="sm" className="flex items-center gap-2">
							<Filter className="h-4 w-4" />
							Filter
						</Button>
					</div>
				</CardHeader>
				<CardContent className="space-y-3">
					{insights.map((insight) => (
						<div
							key={insight.id}
							className={`p-4 border rounded-2xl ${getInsightColor(insight.type)}`}
						>
							<div className="flex items-start gap-4">
								<div className={`flex-shrink-0 ${getInsightTextColor(insight.type)}`}>
									{getInsightIcon(insight.type)}
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex items-start justify-between gap-4 mb-2">
										<h3 className={`font-bold ${getInsightTextColor(insight.type)}`}>
											{insight.title}
										</h3>
										<div className="flex items-center gap-2 flex-shrink-0">
											<span className={`text-xs px-2 py-1 rounded-full font-medium ${
												insight.impact === 'high' 
													? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
													: insight.impact === 'medium'
													? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
													: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
											}`}>
												{insight.impact.toUpperCase()} IMPACT
											</span>
											{insight.actionRequired && (
												<span className="text-xs px-2 py-1 rounded-full font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
													ACTION REQUIRED
												</span>
											)}
										</div>
									</div>
									<p className={`text-sm mb-2 ${getInsightTextColor(insight.type)}`}>
										{insight.description}
									</p>
									<div className="flex items-center justify-between">
										<span className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
											<Clock className="h-3 w-3" />
											{insight.timestamp.toLocaleString()}
										</span>
										{insight.actionRequired && (
											<Button size="sm" variant="outline" className="text-xs">
												Review Action
											</Button>
										)}
									</div>
								</div>
							</div>
						</div>
					))}
				</CardContent>
			</Card>

			<div className="grid gap-6 lg:grid-cols-2">
				{/* Department Performance */}
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<BarChart3 className="h-6 w-6 text-primary" />
								<div>
									<h2 className="text-xl font-bold">Department Performance</h2>
									<p className="text-sm text-neutral-600 dark:text-neutral-400">
										Efficiency and growth metrics
									</p>
								</div>
							</div>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						{departments.map((dept) => (
							<div key={dept.name} className="space-y-2">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<h3 className="font-bold">{dept.name}</h3>
										<span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(dept.status)}`}>
											{dept.status.toUpperCase()}
										</span>
									</div>
									<div className="text-right">
										<p className="font-bold">{dept.revenue}</p>
										<p className={`text-xs flex items-center gap-1 ${
											dept.growth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
										}`}>
											{dept.growth >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
											{Math.abs(dept.growth)}%
										</p>
									</div>
								</div>
								<div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
									<div className="flex-1">
										<div className="flex items-center justify-between mb-1">
											<span>Efficiency</span>
											<span className="font-medium">{dept.efficiency}%</span>
										</div>
										<div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
											<div
												className={`h-full ${
													dept.efficiency >= 90 ? 'bg-green-500' :
													dept.efficiency >= 80 ? 'bg-blue-500' :
													dept.efficiency >= 70 ? 'bg-orange-500' :
													'bg-red-500'
												}`}
												style={{ width: `${dept.efficiency}%` }}
											/>
										</div>
									</div>
									<div className="flex items-center gap-1">
										<Users className="h-4 w-4" />
										<span>{dept.headcount}</span>
									</div>
								</div>
							</div>
						))}
					</CardContent>
				</Card>

				{/* Strategic Initiatives */}
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<Target className="h-6 w-6 text-primary" />
								<div>
									<h2 className="text-xl font-bold">Strategic Initiatives</h2>
									<p className="text-sm text-neutral-600 dark:text-neutral-400">
										Key projects and milestones
									</p>
								</div>
							</div>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						{initiatives.map((initiative) => (
							<div key={initiative.id} className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-2xl">
								<div className="flex items-start justify-between mb-3">
									<div className="flex-1 min-w-0">
										<h3 className="font-bold mb-1">{initiative.name}</h3>
										<p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
											{initiative.owner} • Due {initiative.dueDate.toLocaleDateString()}
										</p>
									</div>
									<span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ml-2 ${getInitiativeStatusColor(initiative.status)}`}>
										{initiative.status.toUpperCase().replace('-', ' ')}
									</span>
								</div>
								<div className="mb-2">
									<div className="flex items-center justify-between mb-1">
										<span className="text-sm text-neutral-600 dark:text-neutral-400">Progress</span>
										<span className="text-sm font-medium">{initiative.progress}%</span>
									</div>
									<div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
										<div
											className={`h-full ${
												initiative.status === 'on-track' ? 'bg-green-500' :
												initiative.status === 'at-risk' ? 'bg-orange-500' :
												'bg-red-500'
											}`}
											style={{ width: `${initiative.progress}%` }}
										/>
									</div>
								</div>
								<p className="text-xs text-neutral-600 dark:text-neutral-400">
									{initiative.impact}
								</p>
							</div>
						))}
					</CardContent>
				</Card>
			</div>

			{/* Quick Actions */}
			<Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
				<CardContent className="p-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<div className="p-3 rounded-2xl bg-primary/10">
								<Zap className="h-6 w-6 text-primary" />
							</div>
							<div>
								<h3 className="font-bold text-lg">Need deeper analysis?</h3>
								<p className="text-sm text-neutral-600 dark:text-neutral-400">
									Generate custom reports or schedule executive briefings
								</p>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<Button variant="outline">
								Schedule Briefing
							</Button>
							<Button className="flex items-center gap-2">
								<Brain className="h-4 w-4" />
								Generate Report
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

