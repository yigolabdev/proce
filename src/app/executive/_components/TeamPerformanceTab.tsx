import { Card, CardContent, CardHeader } from '../../../components/ui/Card'
import { Building2, TrendingUp, TrendingDown, Minus, Award, Target, Users, FolderKanban } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { DepartmentPerformance, ProjectAnalytics, OKRAnalytics } from '../_types/analytics.types'

interface TeamPerformanceTabProps {
	departments: DepartmentPerformance[]
	projects: ProjectAnalytics[]
	okrs: OKRAnalytics[]
}

export default function TeamPerformanceTab({ departments, projects, okrs }: TeamPerformanceTabProps) {
	const getTrendIcon = (trend: string) => {
		switch (trend) {
			case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
			case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />
			default: return <Minus className="h-4 w-4 text-gray-600" />
		}
	}

	const getRankBadge = (rank: number) => {
		if (rank === 1) return <span className="text-yellow-600">🥇</span>
		if (rank === 2) return <span className="text-gray-400">🥈</span>
		if (rank === 3) return <span className="text-orange-600">🥉</span>
		return <span className="text-neutral-600">#{rank}</span>
	}

	const getRiskBadge = (risk: string) => {
		switch (risk) {
			case 'high':
				return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">High Risk</span>
			case 'medium':
				return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Medium Risk</span>
			default:
				return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Low Risk</span>
		}
	}

	const getOKRStatusBadge = (status: string) => {
		const styles = {
			'on-track': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
			'at-risk': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
			'behind': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
			'completed': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
		}
		return (
			<span className={`px-2 py-1 text-xs rounded-full ${styles[status as keyof typeof styles] || styles['on-track']}`}>
				{status.replace('-', ' ').toUpperCase()}
			</span>
		)
	}

	// Department chart data
	const deptChartData = departments.map(dept => ({
		name: dept.department.length > 15 ? dept.department.substring(0, 15) + '...' : dept.department,
		entries: dept.metrics.totalWorkEntries,
		hours: dept.metrics.totalHours,
	}))

	return (
		<div className="space-y-6">
			{/* Department Overview */}
			<Card>
				<CardHeader>
					<h3 className="font-bold flex items-center gap-2">
						<Building2 className="h-5 w-5 text-primary" />
						Department Performance
					</h3>
					<p className="text-sm text-neutral-600 dark:text-neutral-400">
						Comparative analysis across departments
					</p>
				</CardHeader>
				<CardContent className="p-6">
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={deptChartData}>
							<CartesianGrid strokeDasharray="3 3" opacity={0.1} />
							<XAxis
								dataKey="name"
								tick={{ fontSize: 11 }}
								angle={-45}
								textAnchor="end"
								height={80}
							/>
							<YAxis tick={{ fontSize: 11 }} />
							<Tooltip
								contentStyle={{
									backgroundColor: 'rgba(255, 255, 255, 0.95)',
									border: '1px solid #e5e7eb',
									borderRadius: '8px',
								}}
							/>
							<Bar dataKey="entries" fill="#3b82f6" name="Work Entries" radius={[4, 4, 0, 0]} />
							<Bar dataKey="hours" fill="#8b5cf6" name="Total Hours" radius={[4, 4, 0, 0]} />
						</BarChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>

			{/* Department Ranking Table */}
			<Card>
				<CardHeader>
					<h3 className="font-bold flex items-center gap-2">
						<Award className="h-5 w-5 text-primary" />
						Department Rankings
					</h3>
				</CardHeader>
				<CardContent className="p-6">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-neutral-200 dark:border-neutral-800">
									<th className="text-left py-3 px-4 text-sm font-semibold">Rank</th>
									<th className="text-left py-3 px-4 text-sm font-semibold">Department</th>
									<th className="text-right py-3 px-4 text-sm font-semibold">Entries</th>
									<th className="text-right py-3 px-4 text-sm font-semibold">Hours</th>
									<th className="text-right py-3 px-4 text-sm font-semibold">Projects</th>
									<th className="text-right py-3 px-4 text-sm font-semibold">OKR Rate</th>
									<th className="text-center py-3 px-4 text-sm font-semibold">Trend</th>
								</tr>
							</thead>
							<tbody>
								{departments.map((dept) => (
									<tr key={dept.department} className="border-b border-neutral-100 dark:border-neutral-800">
										<td className="py-3 px-4 text-lg">{getRankBadge(dept.rank)}</td>
										<td className="py-3 px-4 font-medium">{dept.department}</td>
										<td className="text-right py-3 px-4">{dept.metrics.totalWorkEntries}</td>
										<td className="text-right py-3 px-4">{dept.metrics.totalHours.toFixed(1)}h</td>
										<td className="text-right py-3 px-4">{dept.metrics.projectsCount}</td>
										<td className="text-right py-3 px-4">{dept.metrics.okrCompletionRate.toFixed(0)}%</td>
										<td className="text-center py-3 px-4">{getTrendIcon(dept.trend)}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>

			{/* Project Status */}
			<Card>
				<CardHeader>
					<h3 className="font-bold flex items-center gap-2">
						<FolderKanban className="h-5 w-5 text-primary" />
						Project Analytics
					</h3>
					<p className="text-sm text-neutral-600 dark:text-neutral-400">
						Current project status and risk assessment
					</p>
				</CardHeader>
				<CardContent className="p-6">
					<div className="space-y-3">
						{projects.slice(0, 10).map((project) => (
							<div
								key={project.projectId}
								className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
							>
								<div className="flex items-start justify-between mb-2">
									<div className="flex-1">
										<h4 className="font-semibold">{project.projectName}</h4>
										<p className="text-sm text-neutral-600 dark:text-neutral-400">
											{project.department} • {project.teamSize} members
										</p>
									</div>
									{getRiskBadge(project.risk)}
								</div>
								<div className="flex items-center gap-4 text-sm">
									<div className="flex items-center gap-1">
										<Target className="h-4 w-4 text-neutral-500" />
										<span>{project.progress}% complete</span>
									</div>
									<div className="flex items-center gap-1">
										<Users className="h-4 w-4 text-neutral-500" />
										<span>{project.workEntriesCount} entries</span>
									</div>
									<div className="text-neutral-600 dark:text-neutral-400">
										{project.daysRemaining} days remaining
									</div>
								</div>
								<div className="mt-2">
									<div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2">
										<div
											className="h-2 rounded-full bg-blue-600"
											style={{ width: `${project.progress}%` }}
										/>
									</div>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* OKR Status */}
			<Card>
				<CardHeader>
					<h3 className="font-bold flex items-center gap-2">
						<Target className="h-5 w-5 text-primary" />
						OKR Performance
					</h3>
					<p className="text-sm text-neutral-600 dark:text-neutral-400">
						Team objectives and key results tracking
					</p>
				</CardHeader>
				<CardContent className="p-6">
					<div className="space-y-3">
						{okrs.slice(0, 10).map((okr) => (
							<div
								key={okr.objectiveId}
								className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800"
							>
								<div className="flex items-start justify-between mb-2">
									<div className="flex-1">
										<h4 className="font-semibold">{okr.title}</h4>
										<p className="text-sm text-neutral-600 dark:text-neutral-400">
											{okr.owner} • {okr.team}
										</p>
									</div>
									{getOKRStatusBadge(okr.status)}
								</div>
								<div className="flex items-center gap-4 text-sm mb-2">
									<span>{okr.progress}% progress</span>
									<span className="text-neutral-600 dark:text-neutral-400">
										{okr.keyResultsCompleted}/{okr.keyResultsTotal} KRs completed
									</span>
									<span className="text-neutral-600 dark:text-neutral-400">
										{okr.daysRemaining} days left
									</span>
								</div>
								<div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2">
									<div
										className={`h-2 rounded-full ${
											okr.status === 'completed' ? 'bg-blue-600' :
											okr.status === 'on-track' ? 'bg-green-600' :
											okr.status === 'at-risk' ? 'bg-yellow-600' :
											'bg-red-600'
										}`}
										style={{ width: `${okr.progress}%` }}
									/>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

