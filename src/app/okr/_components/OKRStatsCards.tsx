import { Card, CardContent } from '../../../components/ui/Card'
import { Target, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react'
import type { OKRStats } from '../_types/okr.types'

interface OKRStatsCardsProps {
	stats: OKRStats
}

/**
 * OKR Statistics Cards
 * Displays overview statistics for objectives
 */
export function OKRStatsCards({ stats }: OKRStatsCardsProps) {
	return (
		<>
			{/* Total Objectives */}
			<Card>
				<CardContent className="p-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-neutral-400">
								Total Objectives
							</p>
							<p className="text-2xl font-bold mt-1">{stats.totalObjectives}</p>
						</div>
						<div className="w-12 h-12 bg-blue-900/30 rounded-xl flex items-center justify-center">
							<Target className="h-6 w-6 text-blue-400" />
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Average Progress */}
			<Card>
				<CardContent className="p-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-neutral-400">
								Average Progress
							</p>
							<p className="text-2xl font-bold mt-1">{stats.avgProgress}%</p>
						</div>
						<div className="w-12 h-12 bg-green-900/30 rounded-xl flex items-center justify-center">
							<TrendingUp className="h-6 w-6 text-green-400" />
						</div>
					</div>
					{/* Progress Bar */}
					<div className="mt-3 h-2 bg-neutral-800 rounded-full overflow-hidden">
						<div
							className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
							style={{ width: `${stats.avgProgress}%` }}
						/>
					</div>
				</CardContent>
			</Card>

			{/* Status Breakdown */}
			<Card>
				<CardContent className="p-4">
					<p className="text-sm text-neutral-400 mb-3">
						Status Breakdown
					</p>
					<div className="space-y-2">
						<div className="flex items-center justify-between text-sm">
							<div className="flex items-center gap-2">
								<CheckCircle2 className="h-4 w-4 text-green-400" />
								<span>On Track</span>
							</div>
							<span className="font-medium">{stats.onTrack}</span>
						</div>
						<div className="flex items-center justify-between text-sm">
							<div className="flex items-center gap-2">
								<AlertCircle className="h-4 w-4 text-yellow-400" />
								<span>At Risk</span>
							</div>
							<span className="font-medium">{stats.atRisk}</span>
						</div>
						<div className="flex items-center justify-between text-sm">
							<div className="flex items-center gap-2">
								<AlertCircle className="h-4 w-4 text-red-400" />
								<span>Behind</span>
							</div>
							<span className="font-medium">{stats.behind}</span>
						</div>
						<div className="flex items-center justify-between text-sm">
							<div className="flex items-center gap-2">
								<CheckCircle2 className="h-4 w-4 text-blue-400" />
								<span>Completed</span>
							</div>
							<span className="font-medium">{stats.completed}</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</>
	)
}

export default OKRStatsCards

