import { Card, CardContent, CardHeader } from '../../../components/ui/Card'
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown, Minus, Calendar } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import type { ComparisonPeriod } from '../_types/analytics.types'

interface ComparisonTabProps {
	current: ComparisonPeriod
	previous: ComparisonPeriod
	changes: Record<string, number>
}

export default function ComparisonTab({ current, previous, changes }: ComparisonTabProps) {
	// Prepare comparison data for chart
	const comparisonData = [
		{
			metric: 'Work Entries',
			current: current.metrics.workEntries,
			previous: previous.metrics.workEntries,
		},
		{
			metric: 'Total Hours',
			current: current.metrics.totalHours,
			previous: previous.metrics.totalHours,
		},
		{
			metric: 'Active Projects',
			current: current.metrics.projectsActive,
			previous: previous.metrics.projectsActive,
		},
		{
			metric: 'OKR Progress',
			current: current.metrics.okrProgress,
			previous: previous.metrics.okrProgress,
		},
	]

	const getChangeIcon = (change: number) => {
		if (change > 0) return <ArrowUp className="h-5 w-5 text-green-400" />
		if (change < 0) return <ArrowDown className="h-5 w-5 text-red-400" />
		return <Minus className="h-5 w-5 text-neutral-400" />
	}

	const getChangeColor = (change: number) => {
		if (change > 0) return 'text-green-400'
		if (change < 0) return 'text-red-400'
		return 'text-neutral-400'
	}

	const getChangeBackground = (change: number) => {
		if (change > 0) return 'bg-green-500/10 border-green-500/20'
		if (change < 0) return 'bg-red-500/10 border-red-500/20'
		return 'bg-neutral-500/10 border-neutral-500/20'
	}

	const metrics = [
		{
			label: 'Work Entries',
			current: current.metrics.workEntries,
			previous: previous.metrics.workEntries,
			change: changes.workEntries,
			unit: '',
		},
		{
			label: 'Total Hours',
			current: current.metrics.totalHours.toFixed(1),
			previous: previous.metrics.totalHours.toFixed(1),
			change: changes.totalHours,
			unit: 'h',
		},
		{
			label: 'Active Projects',
			current: current.metrics.projectsActive,
			previous: previous.metrics.projectsActive,
			change: changes.projectsActive,
			unit: '',
		},
		{
			label: 'OKR Progress',
			current: current.metrics.okrProgress.toFixed(1),
			previous: previous.metrics.okrProgress.toFixed(1),
			change: changes.okrProgress,
			unit: '%',
		},
	]

	return (
		<div className="space-y-6">
			{/* Period Info */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Card className="bg-surface-dark border-border-dark">
					<CardContent className="p-6">
						<div className="flex items-center gap-3 mb-2">
							<Calendar className="h-5 w-5 text-orange-500" />
							<h3 className="font-bold text-lg text-white">Current Period</h3>
						</div>
						<div className="text-sm text-neutral-400">
							{format(current.startDate, 'MMM d, yyyy')} - {format(current.endDate, 'MMM d, yyyy')}
						</div>
						<div className="mt-4 text-3xl font-bold text-orange-500">
							{current.metrics.workEntries} entries
						</div>
					</CardContent>
				</Card>

				<Card className="bg-surface-dark border-border-dark">
					<CardContent className="p-6">
						<div className="flex items-center gap-3 mb-2">
							<Calendar className="h-5 w-5 text-neutral-500" />
							<h3 className="font-bold text-lg text-white">Previous Period</h3>
						</div>
						<div className="text-sm text-neutral-400">
							{format(previous.startDate, 'MMM d, yyyy')} - {format(previous.endDate, 'MMM d, yyyy')}
						</div>
						<div className="mt-4 text-3xl font-bold text-neutral-500">
							{previous.metrics.workEntries} entries
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Comparison Chart */}
			<Card className="bg-surface-dark border-border-dark">
				<CardHeader>
					<h3 className="font-bold flex items-center gap-2 text-white">
						<TrendingUp className="h-5 w-5 text-orange-500" />
						Period Comparison
					</h3>
					<p className="text-sm text-neutral-400">
						Side-by-side comparison of key metrics
					</p>
				</CardHeader>
				<CardContent className="p-6">
					<ResponsiveContainer width="100%" height={350}>
						<BarChart data={comparisonData}>
							<CartesianGrid strokeDasharray="3 3" opacity={0.1} stroke="#525252" />
							<XAxis dataKey="metric" tick={{ fontSize: 12, fill: '#a3a3a3' }} stroke="#525252" />
							<YAxis tick={{ fontSize: 12, fill: '#a3a3a3' }} stroke="#525252" />
							<Tooltip
								contentStyle={{
									backgroundColor: '#1a1a1a',
									border: '1px solid #262626',
									borderRadius: '8px',
									color: '#fff',
								}}
							/>
							<Legend />
							<Bar dataKey="previous" fill="#525252" name="Previous Period" radius={[4, 4, 0, 0]} />
							<Bar dataKey="current" fill="#f97316" name="Current Period" radius={[4, 4, 0, 0]} />
						</BarChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>

			{/* Detailed Metrics */}
			<Card className="bg-surface-dark border-border-dark">
				<CardHeader>
					<h3 className="font-bold flex items-center gap-2 text-white">
						<TrendingDown className="h-5 w-5 text-orange-500" />
						Detailed Changes
					</h3>
				</CardHeader>
				<CardContent className="p-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{metrics.map((metric, index) => (
							<div
								key={index}
								className={`p-4 rounded-lg border ${getChangeBackground(metric.change)}`}
							>
								<div className="flex items-start justify-between mb-3">
									<div>
										<h4 className="font-semibold text-lg text-white">{metric.label}</h4>
									</div>
									<div className="flex items-center gap-2">
										{getChangeIcon(metric.change)}
										<span className={`text-lg font-bold ${getChangeColor(metric.change)}`}>
											{metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
										</span>
									</div>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<div className="text-xs text-neutral-400 mb-1">Current</div>
										<div className="text-2xl font-bold text-white">
											{metric.current}{metric.unit}
										</div>
									</div>
									<div>
										<div className="text-xs text-neutral-400 mb-1">Previous</div>
										<div className="text-xl font-semibold text-neutral-500">
											{metric.previous}{metric.unit}
										</div>
									</div>
								</div>
							<div className="mt-3 text-xs text-neutral-400">
								{metric.change > 0 ? 'Increased' : metric.change < 0 ? 'Decreased' : 'No change'} by{' '}
								{Math.abs(parseFloat(String(metric.current)) - parseFloat(String(metric.previous))).toFixed(1)}{metric.unit}
							</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Summary */}
			<Card className="bg-surface-dark border-border-dark">
				<CardHeader>
					<h3 className="font-bold text-white">Period Summary</h3>
				</CardHeader>
				<CardContent className="p-6">
					<div className="space-y-3">
						<p className="text-sm text-neutral-300">
							{changes.workEntries > 0 ? (
								<span className="text-green-400 font-semibold">✓ Positive growth</span>
							) : changes.workEntries < 0 ? (
								<span className="text-red-400 font-semibold">⚠ Decline</span>
							) : (
								<span className="text-neutral-400 font-semibold">− Stable</span>
							)}{' '}
							in work activity compared to previous period
						</p>
						<p className="text-sm text-neutral-300">
							Team productivity {changes.totalHours > 0 ? 'increased' : 'decreased'} by{' '}
							<span className="font-semibold text-white">{Math.abs(changes.totalHours).toFixed(1)}%</span> in total hours worked
						</p>
						<p className="text-sm text-neutral-300">
							OKR progress {changes.okrProgress > 0 ? 'improved' : 'declined'} by{' '}
							<span className="font-semibold text-white">{Math.abs(changes.okrProgress).toFixed(1)} percentage points</span>
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

