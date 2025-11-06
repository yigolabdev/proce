import { Card, CardContent, CardHeader } from '../../../components/ui/Card'
import { TrendingUp, TrendingDown, Users, Clock, Target, FolderKanban, AlertCircle, CheckCircle2, ArrowUp, ArrowDown, Minus } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { TrendData, CategoryBreakdown, InsightCard, ComparisonPeriod } from '../_types/analytics.types'

// Recharts Tooltip/Legend payload types
interface TooltipPayload {
	payload: CategoryBreakdown
	value: number
	name: string
}

interface LegendPayload {
	payload: {
		category: string
	}
}

interface OverviewTabProps {
	dateRange: { start: Date; end: Date }
	workEntriesTrend: TrendData
	categoryBreakdown: CategoryBreakdown[]
	insights: InsightCard[]
	comparison: { current: ComparisonPeriod; previous: ComparisonPeriod; changes: Record<string, number> } | null
}

export default function OverviewTab({
	dateRange,
	workEntriesTrend,
	categoryBreakdown,
	insights,
	comparison,
}: OverviewTabProps) {
	// KPI Cards Data
	const totalWorkEntries = comparison?.current.metrics.workEntries || 0
	const totalHours = comparison?.current.metrics.totalHours || 0
	const activeProjects = comparison?.current.metrics.projectsActive || 0
	const avgOkrProgress = comparison?.current.metrics.okrProgress || 0

	const kpis = [
		{
			label: 'Total Work Entries',
			value: totalWorkEntries,
			change: comparison?.changes.workEntries || 0,
			icon: Clock,
			color: 'text-blue-600',
			bgColor: 'bg-blue-50 dark:bg-blue-900/20',
		},
		{
			label: 'Total Hours',
			value: totalHours.toFixed(1),
			change: comparison?.changes.totalHours || 0,
			icon: Clock,
			color: 'text-green-600',
			bgColor: 'bg-green-50 dark:bg-green-900/20',
		},
		{
			label: 'Active Projects',
			value: activeProjects,
			change: comparison?.changes.projectsActive || 0,
			icon: FolderKanban,
			color: 'text-purple-600',
			bgColor: 'bg-purple-50 dark:bg-purple-900/20',
		},
		{
			label: 'Avg OKR Progress',
			value: `${avgOkrProgress.toFixed(0)}%`,
			change: comparison?.changes.okrProgress || 0,
			icon: Target,
			color: 'text-orange-600',
			bgColor: 'bg-orange-50 dark:bg-orange-900/20',
		},
	]

	const getTrendIcon = (change: number) => {
		if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
		if (change < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
		return <Minus className="h-4 w-4 text-gray-600" />
	}

	const getChangeColor = (change: number) => {
		if (change > 0) return 'text-green-600'
		if (change < 0) return 'text-red-600'
		return 'text-gray-600'
	}

	const getInsightIcon = (type: string) => {
		switch (type) {
			case 'success': return <CheckCircle2 className="h-5 w-5 text-green-600" />
			case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-600" />
			case 'danger': return <AlertCircle className="h-5 w-5 text-red-600" />
			default: return <AlertCircle className="h-5 w-5 text-blue-600" />
		}
	}

	const getInsightBorderColor = (type: string) => {
		switch (type) {
			case 'success': return 'border-green-200 dark:border-green-800'
			case 'warning': return 'border-yellow-200 dark:border-yellow-800'
			case 'danger': return 'border-red-200 dark:border-red-800'
			default: return 'border-blue-200 dark:border-blue-800'
		}
	}

	return (
		<div className="space-y-6">
			{/* KPI Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{kpis.map((kpi, index) => (
					<Card key={index}>
						<CardContent className="p-6">
							<div className="flex items-center justify-between mb-4">
								<div className={`p-3 rounded-lg ${kpi.bgColor}`}>
									<kpi.icon className={`h-6 w-6 ${kpi.color}`} />
								</div>
								<div className="flex items-center gap-1">
									{getTrendIcon(kpi.change)}
									<span className={`text-sm font-medium ${getChangeColor(kpi.change)}`}>
										{Math.abs(kpi.change).toFixed(1)}%
									</span>
								</div>
							</div>
							<div className="text-2xl font-bold mb-1">{kpi.value}</div>
							<div className="text-sm text-neutral-600 dark:text-neutral-400">{kpi.label}</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Charts Row */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Work Entries Trend */}
				<Card>
					<CardHeader>
						<h3 className="font-bold flex items-center gap-2">
							<TrendingUp className="h-5 w-5 text-primary" />
							Work Entries Trend
						</h3>
						<p className="text-sm text-neutral-600 dark:text-neutral-400">
							Daily work entry activity over selected period
						</p>
					</CardHeader>
					<CardContent className="p-6">
						<ResponsiveContainer width="100%" height={250}>
							<LineChart data={workEntriesTrend.data}>
								<CartesianGrid strokeDasharray="3 3" opacity={0.1} />
								<XAxis
									dataKey="label"
									tick={{ fontSize: 11 }}
									angle={-45}
									textAnchor="end"
									height={60}
								/>
								<YAxis tick={{ fontSize: 11 }} />
								<Tooltip
									contentStyle={{
										backgroundColor: 'rgba(255, 255, 255, 0.95)',
										border: '1px solid #e5e7eb',
										borderRadius: '8px',
									}}
								/>
								<Line
									type="monotone"
									dataKey="value"
									stroke="#3b82f6"
									strokeWidth={2}
									dot={{ r: 4 }}
									activeDot={{ r: 6 }}
								/>
							</LineChart>
						</ResponsiveContainer>
						<div className="flex items-center justify-center gap-4 mt-4">
							<div className="flex items-center gap-2">
								{workEntriesTrend.trend === 'increasing' && <ArrowUp className="h-4 w-4 text-green-600" />}
								{workEntriesTrend.trend === 'decreasing' && <ArrowDown className="h-4 w-4 text-red-600" />}
								{workEntriesTrend.trend === 'stable' && <Minus className="h-4 w-4 text-gray-600" />}
								<span className="text-sm font-medium capitalize">{workEntriesTrend.trend}</span>
							</div>
							<span className="text-sm text-neutral-600 dark:text-neutral-400">
								{Math.abs(workEntriesTrend.changePercent).toFixed(1)}% change
							</span>
						</div>
					</CardContent>
				</Card>

				{/* Category Breakdown */}
				<Card>
					<CardHeader>
						<h3 className="font-bold flex items-center gap-2">
							<Target className="h-5 w-5 text-primary" />
							Category Distribution
						</h3>
						<p className="text-sm text-neutral-600 dark:text-neutral-400">
							Work breakdown by category
						</p>
					</CardHeader>
					<CardContent className="p-6">
						<ResponsiveContainer width="100%" height={250}>
							<PieChart>
								<Pie
									data={categoryBreakdown}
									cx="50%"
									cy="50%"
									innerRadius={60}
									outerRadius={90}
									paddingAngle={2}
									dataKey="count"
								>
									{categoryBreakdown.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} />
									))}
								</Pie>
								<Tooltip
									contentStyle={{
										backgroundColor: 'rgba(255, 255, 255, 0.95)',
										border: '1px solid #e5e7eb',
										borderRadius: '8px',
									}}
									formatter={(value: number, _name: string, props: TooltipPayload) => [
										`${value} entries (${props.payload.percentage.toFixed(1)}%)`,
										props.payload.category
									]}
								/>
								<Legend
									verticalAlign="bottom"
									height={36}
									iconType="circle"
									formatter={(_value, entry: LegendPayload) => {
										const item = categoryBreakdown.find(c => c.category === entry.payload.category)
										return `${entry.payload.category} (${item?.count || 0})`
									}}
								/>
							</PieChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>

			{/* Insights */}
			{insights.length > 0 && (
				<Card>
					<CardHeader>
						<h3 className="font-bold flex items-center gap-2">
							<AlertCircle className="h-5 w-5 text-primary" />
							AI-Powered Insights
						</h3>
						<p className="text-sm text-neutral-600 dark:text-neutral-400">
							Automated analysis and recommendations
						</p>
					</CardHeader>
					<CardContent className="p-6">
						<div className="space-y-3">
							{insights.map((insight) => (
								<div
									key={insight.id}
									className={`p-4 rounded-lg border-l-4 ${getInsightBorderColor(insight.type)} bg-neutral-50 dark:bg-neutral-900`}
								>
									<div className="flex items-start gap-3">
										{getInsightIcon(insight.type)}
										<div className="flex-1">
											<h4 className="font-semibold mb-1">{insight.title}</h4>
											<p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
												{insight.description}
											</p>
											{insight.metric && (
												<div className="text-xs font-medium text-neutral-500">
													{insight.metric}
												</div>
											)}
											{insight.recommendation && (
												<div className="mt-2 text-sm text-blue-600 dark:text-blue-400">
													💡 {insight.recommendation}
												</div>
											)}
										</div>
										<span className={`text-xs px-2 py-1 rounded-full ${
											insight.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
											insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
											'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
										}`}>
											{insight.priority}
										</span>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Category Details Table */}
			<Card>
				<CardHeader>
					<h3 className="font-bold flex items-center gap-2">
						<Users className="h-5 w-5 text-primary" />
						Category Details
					</h3>
				</CardHeader>
				<CardContent className="p-6">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-neutral-200 dark:border-neutral-800">
									<th className="text-left py-3 px-4 text-sm font-semibold">Category</th>
									<th className="text-right py-3 px-4 text-sm font-semibold">Entries</th>
									<th className="text-right py-3 px-4 text-sm font-semibold">Hours</th>
									<th className="text-right py-3 px-4 text-sm font-semibold">Percentage</th>
									<th className="text-left py-3 px-4 text-sm font-semibold">Indicator</th>
								</tr>
							</thead>
							<tbody>
								{categoryBreakdown.map((cat, index) => (
									<tr key={index} className="border-b border-neutral-100 dark:border-neutral-800">
										<td className="py-3 px-4">
											<div className="flex items-center gap-2">
												<div
													className="w-3 h-3 rounded-full"
													style={{ backgroundColor: cat.color }}
												/>
												<span className="font-medium">{cat.category}</span>
											</div>
										</td>
										<td className="text-right py-3 px-4 font-medium">{cat.count}</td>
										<td className="text-right py-3 px-4">{cat.hours.toFixed(1)}h</td>
										<td className="text-right py-3 px-4">{cat.percentage.toFixed(1)}%</td>
										<td className="py-3 px-4">
											<div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2">
												<div
													className="h-2 rounded-full"
													style={{
														width: `${cat.percentage}%`,
														backgroundColor: cat.color,
													}}
												/>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

