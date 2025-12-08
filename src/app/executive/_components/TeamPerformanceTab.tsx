import { Card, CardContent, CardHeader } from '../../../components/ui/Card'
import { Building2, TrendingUp, TrendingDown, Minus, Award, Target, Users, FolderKanban } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { DepartmentPerformance, ProjectAnalytics } from '../_types/analytics.types'

interface TeamPerformanceTabProps {
	departments: DepartmentPerformance[]
	projects: ProjectAnalytics[]
}

export default function TeamPerformanceTab({ departments, projects }: TeamPerformanceTabProps) {
	const getTrendIcon = (trend: string) => {
		switch (trend) {
			case 'up': return <TrendingUp className="h-4 w-4 text-green-400" />
			case 'down': return <TrendingDown className="h-4 w-4 text-red-400" />
			default: return <Minus className="h-4 w-4 text-neutral-400" />
		}
	}

	const getRankBadge = (rank: number) => {
		if (rank === 1) return <span className="text-yellow-500">🥇</span>
		if (rank === 2) return <span className="text-neutral-400">🥈</span>
		if (rank === 3) return <span className="text-orange-500">🥉</span>
		return <span className="text-neutral-500">#{rank}</span>
	}

	const getRiskBadge = (risk: string) => {
		switch (risk) {
			case 'high':
				return <span className="px-2 py-1 text-xs rounded-full bg-red-500/10 text-red-400 border border-red-500/20">High Risk</span>
			case 'medium':
				return <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">Medium Risk</span>
			default:
				return <span className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-400 border border-green-500/20">Low Risk</span>
		}
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
			<Card className="bg-surface-dark border-border-dark">
				<CardHeader>
					<h3 className="font-bold flex items-center gap-2 text-white">
						<Building2 className="h-5 w-5 text-orange-500" />
						Department Performance
					</h3>
					<p className="text-sm text-neutral-400">
						Comparative analysis across departments
					</p>
				</CardHeader>
				<CardContent className="p-6">
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={deptChartData}>
							<CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="#525252" />
							<XAxis
								dataKey="name"
								tick={{ fontSize: 11, fill: '#a3a3a3' }}
								angle={-45}
								textAnchor="end"
								height={80}
								stroke="#525252"
							/>
							<YAxis tick={{ fontSize: 11, fill: '#a3a3a3' }} stroke="#525252" />
							<Tooltip
								contentStyle={{
									backgroundColor: '#1a1a1a',
									border: '1px solid #262626',
									borderRadius: '8px',
									color: '#fff',
								}}
							/>
							<Bar dataKey="entries" fill="#f97316" name="Work Entries" radius={[4, 4, 0, 0]} />
							<Bar dataKey="hours" fill="#8b5cf6" name="Total Hours" radius={[4, 4, 0, 0]} />
						</BarChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>

			{/* Department Ranking Table */}
			<Card className="bg-surface-dark border-border-dark">
				<CardHeader>
					<h3 className="font-bold flex items-center gap-2 text-white">
						<Award className="h-5 w-5 text-orange-500" />
						Department Rankings
					</h3>
				</CardHeader>
				<CardContent className="p-6">
					<div className="overflow-x-auto">
						<table className="w-full text-neutral-200">
							<thead>
								<tr className="border-b border-border-dark">
									<th className="text-left py-3 px-4 text-sm font-semibold text-neutral-400">Rank</th>
									<th className="text-left py-3 px-4 text-sm font-semibold text-neutral-400">Department</th>
									<th className="text-right py-3 px-4 text-sm font-semibold text-neutral-400">Entries</th>
									<th className="text-right py-3 px-4 text-sm font-semibold text-neutral-400">Hours</th>
									<th className="text-right py-3 px-4 text-sm font-semibold text-neutral-400">Projects</th>
									{/* <th className="text-right py-3 px-4 text-sm font-semibold">OKR Rate</th> */}
									<th className="text-center py-3 px-4 text-sm font-semibold text-neutral-400">Trend</th>
								</tr>
							</thead>
							<tbody>
								{departments.map((dept) => (
									<tr key={dept.department} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors">
										<td className="py-3 px-4 text-lg">{getRankBadge(dept.rank)}</td>
										<td className="py-3 px-4 font-medium">{dept.department}</td>
										<td className="text-right py-3 px-4">{dept.metrics.totalWorkEntries}</td>
										<td className="text-right py-3 px-4">{dept.metrics.totalHours.toFixed(1)}h</td>
										<td className="text-right py-3 px-4">{dept.metrics.projectsCount}</td>
										{/* <td className="text-right py-3 px-4">{dept.metrics.okrCompletionRate.toFixed(0)}%</td> */}
										<td className="text-center py-3 px-4">{getTrendIcon(dept.trend)}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>

			{/* Project Status */}
			<Card className="bg-surface-dark border-border-dark">
				<CardHeader>
					<h3 className="font-bold flex items-center gap-2 text-white">
						<FolderKanban className="h-5 w-5 text-orange-500" />
						Project Analytics
					</h3>
					<p className="text-sm text-neutral-400">
						Current project status and risk assessment
					</p>
				</CardHeader>
				<CardContent className="p-6">
					<div className="space-y-3">
						{projects.slice(0, 10).map((project) => (
							<div
								key={project.projectId}
								className="p-4 rounded-lg border border-border-dark hover:bg-neutral-800/50 transition-colors"
							>
								<div className="flex items-start justify-between mb-2">
									<div className="flex-1">
										<h4 className="font-semibold text-white">{project.projectName}</h4>
										<p className="text-sm text-neutral-400">
											{project.department} • {project.teamSize} members
										</p>
									</div>
									{getRiskBadge(project.risk)}
								</div>
								<div className="flex items-center gap-4 text-sm">
									<div className="flex items-center gap-1 text-neutral-400">
										<Target className="h-4 w-4 text-neutral-500" />
										<span>{project.progress}% complete</span>
									</div>
									<div className="flex items-center gap-1 text-neutral-400">
										<Users className="h-4 w-4 text-neutral-500" />
										<span>{project.workEntriesCount} entries</span>
									</div>
									<div className="text-neutral-400">
										{project.daysRemaining} days remaining
									</div>
								</div>
								<div className="mt-2">
									<div className="w-full bg-neutral-800 rounded-full h-2">
										<div
											className="h-2 rounded-full bg-orange-500"
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
			{/* <Card>
				<CardHeader>
					<h3 className="font-bold flex items-center gap-2">
						<Target className="h-5 w-5 text-primary" />
						OKR Performance
					</h3>
					<p className="text-sm text-neutral-400">
						Team objectives and key results tracking
					</p>
				</CardHeader>
				<CardContent className="p-6">
					<div className="space-y-3">
						{okrs.slice(0, 10).map((okr) => (
							<div
								key={okr.objectiveId}
								className="p-4 rounded-lg border border-neutral-800"
							>
								<div className="flex items-start justify-between mb-2">
									<div className="flex-1">
										<h4 className="font-semibold">{okr.title}</h4>
										<p className="text-sm text-neutral-400">
											{okr.owner} • {okr.team}
										</p>
									</div>
									{getOKRStatusBadge(okr.status)}
								</div>
								<div className="flex items-center gap-4 text-sm mb-2">
									<span>{okr.progress}% progress</span>
									<span className="text-neutral-400">
										{okr.keyResultsCompleted}/{okr.keyResultsTotal} KRs completed
									</span>
									<span className="text-neutral-400">
										{okr.daysRemaining} days left
									</span>
								</div>
								<div className="w-full bg-neutral-800 rounded-full h-2">
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
			</Card> */}
		</div>
	)
}

