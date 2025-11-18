/**
 * Team Rhythm Section Component
 */

import { useRhythm } from '../../../context/RhythmContext'
import { useAuth } from '../../../context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/common/EmptyState'
import { 
	Users, 
	User,
	TrendingUp,
	Building2,
	CheckCircle2,
	Clock,
	AlertCircle,
	Calendar,
} from 'lucide-react'

export function TeamRhythmSection() {
	const { user } = useAuth()
	const { teamRhythm } = useRhythm()

	if (!teamRhythm) {
		return (
			<EmptyState
				icon={<Users className="h-12 w-12" />}
				title="No Team Rhythm Data"
				description="Unable to load team rhythm"
			/>
		)
	}

	const isUser = user?.role === 'user'
	const myTeam = teamRhythm.myTeam || []

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'completed': return 'bg-green-500'
			case 'busy': return 'bg-orange-500'
			case 'available': return 'bg-blue-500'
			default: return 'bg-neutral-500'
		}
	}

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-600" />
			case 'busy': return <Clock className="h-4 w-4 text-orange-600" />
			case 'available': return <CheckCircle2 className="h-4 w-4 text-blue-600" />
			default: return <User className="h-4 w-4 text-neutral-600" />
		}
	}

	const getStatusText = (status: string) => {
		switch (status) {
			case 'completed': return 'Loop Complete'
			case 'busy': return 'In Progress'
			case 'available': return 'Available'
			default: return 'Unknown'
		}
	}

	return (
		<div className="space-y-8">
			{/* User View: My Team */}
			{isUser && myTeam.length > 0 && (
				<>
					{/* Summary Stats */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium flex items-center gap-2">
									<Users className="h-4 w-4 text-purple-600" />
									Team Members
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold text-purple-600">
									{myTeam.length}
								</div>
								<p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
									In your department
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium flex items-center gap-2">
									<CheckCircle2 className="h-4 w-4 text-green-600" />
									Completed Today
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold text-green-600">
									{myTeam.filter(m => m.currentStatus === 'completed').length}
								</div>
								<p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
									Finished their loop
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium flex items-center gap-2">
									<Clock className="h-4 w-4 text-orange-600" />
									In Progress
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold text-orange-600">
									{myTeam.filter(m => m.currentStatus === 'busy').length}
								</div>
								<p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
									Actively working
								</p>
							</CardContent>
						</Card>
					</div>

					{/* Team Members */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{myTeam.map((member) => (
							<Card key={member.userId} className="hover:shadow-lg transition-shadow">
								<CardContent className="p-6">
									<div className="flex items-start justify-between gap-4">
										<div className="flex items-start gap-3 flex-1">
											<div className="relative">
												<div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-lg">
													{member.name.charAt(0).toUpperCase()}
												</div>
												<div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-neutral-900 ${getStatusColor(member.currentStatus)}`} />
											</div>
											<div className="flex-1">
												<h3 className="text-lg font-semibold mb-1">{member.name}</h3>
												<p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
													{member.department}
												</p>
												<div className="flex items-center gap-2 mb-2">
													{getStatusIcon(member.currentStatus)}
													<span className="text-sm font-medium">
														{getStatusText(member.currentStatus)}
													</span>
												</div>
												{member.todayProgress > 0 && (
													<div className="mt-2">
														<div className="flex items-center justify-between text-xs mb-1">
															<span className="text-neutral-600 dark:text-neutral-400">
																Today's Progress
															</span>
															<span className="font-medium">{member.todayProgress}%</span>
														</div>
														<div className="h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
															<div
																className="h-full bg-purple-600 dark:bg-purple-400 transition-all"
																style={{ width: `${member.todayProgress}%` }}
															/>
														</div>
													</div>
												)}
												{member.activeTasksCount > 0 && (
													<p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2">
														{member.activeTasksCount} active tasks
													</p>
												)}
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</>
			)}

			{/* Admin/Executive View */}
			{!isUser && (
				<>
					{/* Organization Overview */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium flex items-center gap-2">
									<Building2 className="h-4 w-4 text-purple-600" />
									Total Employees
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold text-purple-600">
									48
								</div>
								<p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
									Across 5 departments
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium flex items-center gap-2">
									<CheckCircle2 className="h-4 w-4 text-green-600" />
									Loops Completed
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold text-green-600">
									32
								</div>
								<p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
									67% completion rate
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium flex items-center gap-2">
									<Clock className="h-4 w-4 text-orange-600" />
									In Progress
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold text-orange-600">
									12
								</div>
								<p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
									Currently working
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium flex items-center gap-2">
									<AlertCircle className="h-4 w-4 text-red-600" />
									At Risk
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold text-red-600">
									4
								</div>
								<p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
									Needs attention
								</p>
							</CardContent>
						</Card>
					</div>

					{/* Department Performance */}
					<div>
						<div className="flex items-center gap-2 mb-4">
							<Building2 className="h-5 w-5 text-purple-600" />
							<h2 className="text-xl font-semibold">Department Performance</h2>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{[
								{ name: 'Engineering', members: 15, completed: 12, inProgress: 2, atRisk: 1, avgProgress: 85 },
								{ name: 'Product', members: 8, completed: 6, inProgress: 2, atRisk: 0, avgProgress: 92 },
								{ name: 'Design', members: 6, completed: 5, inProgress: 1, atRisk: 0, avgProgress: 90 },
								{ name: 'Marketing', members: 10, completed: 7, inProgress: 2, atRisk: 1, avgProgress: 78 },
								{ name: 'Sales', members: 9, completed: 2, inProgress: 5, atRisk: 2, avgProgress: 65 },
							].map((dept) => (
								<Card key={dept.name} className="hover:shadow-lg transition-shadow">
									<CardContent className="p-6">
										<div className="flex items-start justify-between mb-4">
											<div>
												<h3 className="text-lg font-semibold mb-1">{dept.name}</h3>
												<p className="text-sm text-neutral-600 dark:text-neutral-400">
													{dept.members} members
												</p>
											</div>
											<div className={`px-3 py-1 rounded-full text-sm font-medium ${
												dept.avgProgress >= 85 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
												dept.avgProgress >= 70 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
												'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
											}`}>
												{dept.avgProgress}%
											</div>
										</div>
										
										<div className="space-y-2 mb-3">
											<div className="flex items-center justify-between text-sm">
												<span className="text-neutral-600 dark:text-neutral-400">Progress</span>
												<span className="font-medium">{dept.avgProgress}%</span>
											</div>
											<div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
												<div
													className={`h-full transition-all ${
														dept.avgProgress >= 85 ? 'bg-green-600' :
														dept.avgProgress >= 70 ? 'bg-yellow-600' :
														'bg-red-600'
													}`}
													style={{ width: `${dept.avgProgress}%` }}
												/>
											</div>
										</div>
										
										<div className="grid grid-cols-3 gap-2 text-center">
											<div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
												<div className="text-lg font-bold text-green-600">{dept.completed}</div>
												<div className="text-xs text-neutral-600 dark:text-neutral-400">Completed</div>
											</div>
											<div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
												<div className="text-lg font-bold text-blue-600">{dept.inProgress}</div>
												<div className="text-xs text-neutral-600 dark:text-neutral-400">Active</div>
											</div>
											<div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
												<div className="text-lg font-bold text-red-600">{dept.atRisk}</div>
												<div className="text-xs text-neutral-600 dark:text-neutral-400">At Risk</div>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</>
			)}

			{/* Empty State for Users */}
			{isUser && myTeam.length === 0 && (
				<EmptyState
					icon={<Users className="h-12 w-12" />}
					title="No team members found"
					description="You don't have any team members in your department yet"
				/>
			)}
		</div>
	)
}

