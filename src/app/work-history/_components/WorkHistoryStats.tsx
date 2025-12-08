import { Card, CardContent } from '../../../components/ui/Card'
import { FileText, Clock, TrendingUp, BarChart3 } from 'lucide-react'

interface WorkHistoryStatsProps {
	statistics: {
		totalEntries: number
		thisWeekCount: number
		totalHoursThisWeek: string
		mostActiveProject: { name: string; count: number } | null
		mostActiveGoal: { name: string; count: number } | null
		avgTimePerEntry: string
	}
}

/**
 * Work History Statistics Cards
 * Displays overview statistics for work entries
 */
export function WorkHistoryStats({ statistics }: WorkHistoryStatsProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			{/* Total Entries */}
			<Card>
				<CardContent className="p-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-neutral-400">Total Entries</p>
							<p className="text-2xl font-bold mt-1">{statistics.totalEntries}</p>
						</div>
						<div className="w-12 h-12 bg-blue-900/30 rounded-xl flex items-center justify-center">
							<FileText className="h-6 w-6 text-blue-400" />
						</div>
					</div>
				</CardContent>
			</Card>

			{/* This Week */}
			<Card>
				<CardContent className="p-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-neutral-400">This Week</p>
							<p className="text-2xl font-bold mt-1">{statistics.thisWeekCount}</p>
							<p className="text-xs text-neutral-400 mt-1">
								{statistics.totalHoursThisWeek} hours
							</p>
						</div>
						<div className="w-12 h-12 bg-green-900/30 rounded-xl flex items-center justify-center">
							<Clock className="h-6 w-6 text-green-400" />
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Most Active Project */}
			<Card>
				<CardContent className="p-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-neutral-400">Top Project</p>
							{statistics.mostActiveProject ? (
								<>
									<p className="text-lg font-bold mt-1 truncate">
										{statistics.mostActiveProject.name}
									</p>
									<p className="text-xs text-neutral-400 mt-1">
										{statistics.mostActiveProject.count} entries
									</p>
								</>
							) : (
								<p className="text-sm text-neutral-400 mt-1">No projects</p>
							)}
						</div>
						<div className="w-12 h-12 bg-purple-900/30 rounded-xl flex items-center justify-center">
							<TrendingUp className="h-6 w-6 text-purple-400" />
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Average Time */}
			<Card>
				<CardContent className="p-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-neutral-400">Avg Time</p>
							<p className="text-2xl font-bold mt-1">{statistics.avgTimePerEntry}h</p>
							<p className="text-xs text-neutral-400 mt-1">per entry</p>
						</div>
						<div className="w-12 h-12 bg-orange-900/30 rounded-xl flex items-center justify-center">
							<BarChart3 className="h-6 w-6 text-orange-400" />
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

export default WorkHistoryStats

