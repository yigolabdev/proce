/**
 * Company KPI Display Component
 * 회사 전체 KPI를 보여주는 위젯
 */

import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { TrendingUp, TrendingDown, Target, AlertCircle } from 'lucide-react'
import type { CompanyKPI } from '../../app/admin/company-settings/_types/types'

interface CompanyKPIWidgetProps {
	kpis: CompanyKPI[]
	compact?: boolean
}

export function CompanyKPIWidget({ kpis, compact = false }: CompanyKPIWidgetProps) {
	const getStatusColor = (status: CompanyKPI['status']) => {
		switch (status) {
			case 'achieved':
				return 'text-green-400 bg-green-500/10 border-green-500/30'
			case 'on-track':
				return 'text-blue-400 bg-blue-500/10 border-blue-500/30'
			case 'at-risk':
				return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
			case 'behind':
				return 'text-red-400 bg-red-500/10 border-red-500/30'
			default:
				return 'text-neutral-400 bg-neutral-500/10 border-neutral-500/30'
		}
	}

	const getCategoryColor = (category: CompanyKPI['category']) => {
		switch (category) {
			case 'Financial':
				return 'text-green-400 bg-green-500/10'
			case 'Customer':
				return 'text-blue-400 bg-blue-500/10'
			case 'Operational':
				return 'text-orange-400 bg-orange-500/10'
			case 'HR':
				return 'text-purple-400 bg-purple-500/10'
			case 'Growth':
				return 'text-pink-400 bg-pink-500/10'
			case 'Strategic':
				return 'text-cyan-400 bg-cyan-500/10'
			default:
				return 'text-neutral-400 bg-neutral-500/10'
		}
	}

	const calculateProgress = (current: number, target: number): number => {
		if (target === 0) return 0
		return Math.min(Math.round((current / target) * 100), 100)
	}

	const calculateTrend = (current: number, target: number): 'up' | 'down' | 'neutral' => {
		const progress = (current / target) * 100
		if (progress >= 90) return 'up'
		if (progress < 70) return 'down'
		return 'neutral'
	}

	if (kpis.length === 0) {
		return (
			<Card className="bg-surface-dark border-border-dark">
				<CardContent className="py-12 text-center">
					<Target className="h-12 w-12 text-neutral-600 mx-auto mb-4" />
					<p className="text-neutral-400">No company KPIs set yet</p>
					<p className="text-sm text-neutral-500 mt-2">
						Executives can add company-wide KPIs in Company Settings
					</p>
				</CardContent>
			</Card>
		)
	}

	if (compact) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{kpis.slice(0, 4).map((kpi) => {
					const progress = calculateProgress(kpi.currentValue, kpi.targetValue)
					const trend = calculateTrend(kpi.currentValue, kpi.targetValue)

					return (
						<Card key={kpi.id} className="bg-surface-dark border-border-dark">
							<CardContent className="p-4">
								<div className="flex items-start justify-between mb-3">
									<div className="flex-1">
										<span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(kpi.category)}`}>
											{kpi.category}
										</span>
										<h4 className="text-sm font-medium text-white mt-2 line-clamp-2">
											{kpi.name}
										</h4>
									</div>
									{trend === 'up' ? (
										<TrendingUp className="h-4 w-4 text-green-400 flex-shrink-0 ml-2" />
									) : trend === 'down' ? (
										<TrendingDown className="h-4 w-4 text-red-400 flex-shrink-0 ml-2" />
									) : (
										<AlertCircle className="h-4 w-4 text-yellow-400 flex-shrink-0 ml-2" />
									)}
								</div>

								<div className="space-y-2">
									<div className="flex items-end justify-between">
										<div>
											<div className="text-2xl font-bold text-white">
												{kpi.currentValue.toLocaleString()}
												<span className="text-sm text-neutral-400 ml-1">{kpi.unit}</span>
											</div>
											<div className="text-xs text-neutral-500">
												Target: {kpi.targetValue.toLocaleString()}{kpi.unit}
											</div>
										</div>
										<span className={`text-xs px-2 py-1 rounded border ${getStatusColor(kpi.status)}`}>
											{progress}%
										</span>
									</div>

									{/* Progress Bar */}
									<div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
										<div
											className={`h-full transition-all duration-500 ${
												progress >= 90
													? 'bg-green-500'
													: progress >= 70
													? 'bg-blue-500'
													: progress >= 50
													? 'bg-yellow-500'
													: 'bg-red-500'
											}`}
											style={{ width: `${progress}%` }}
										/>
									</div>

									<div className="flex items-center justify-between text-xs text-neutral-500">
										<span>{kpi.owner}</span>
										<span className="uppercase">{kpi.period}</span>
									</div>
								</div>
							</CardContent>
						</Card>
					)
				})}
			</div>
		)
	}

	// Full view
	return (
		<Card className="bg-surface-dark border-border-dark">
			<CardHeader className="border-b border-border-dark">
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="flex items-center gap-2">
							<Target className="h-5 w-5 text-orange-400" />
							Company KPIs
						</CardTitle>
						<p className="text-sm text-neutral-400 mt-1">
							Company-wide key performance indicators for all teams
						</p>
					</div>
				</div>
			</CardHeader>
			<CardContent className="p-6">
				<div className="space-y-4">
					{kpis.map((kpi) => {
						const progress = calculateProgress(kpi.currentValue, kpi.targetValue)
						const trend = calculateTrend(kpi.currentValue, kpi.targetValue)

						return (
							<div
								key={kpi.id}
								className="p-4 rounded-lg border border-border-dark bg-background-dark hover:border-orange-500/30 transition-colors"
							>
								<div className="flex items-start justify-between mb-3">
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-2">
											<span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(kpi.category)}`}>
												{kpi.category}
											</span>
											<span className={`text-xs px-2 py-1 rounded border ${getStatusColor(kpi.status)}`}>
												{kpi.status.replace('-', ' ').toUpperCase()}
											</span>
											{kpi.priority === 'high' && (
												<span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">
													High Priority
												</span>
											)}
										</div>
										<h4 className="text-base font-semibold text-white">{kpi.name}</h4>
										<p className="text-sm text-neutral-400 mt-1">{kpi.description}</p>
									</div>
									{trend === 'up' ? (
										<TrendingUp className="h-6 w-6 text-green-400 flex-shrink-0 ml-4" />
									) : trend === 'down' ? (
										<TrendingDown className="h-6 w-6 text-red-400 flex-shrink-0 ml-4" />
									) : (
										<AlertCircle className="h-6 w-6 text-yellow-400 flex-shrink-0 ml-4" />
									)}
								</div>

								<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
									<div>
										<p className="text-xs text-neutral-500 mb-1">Current Value</p>
										<p className="text-xl font-bold text-white">
											{kpi.currentValue.toLocaleString()}
											<span className="text-sm text-neutral-400 ml-1">{kpi.unit}</span>
										</p>
									</div>
									<div>
										<p className="text-xs text-neutral-500 mb-1">Target Value</p>
										<p className="text-xl font-bold text-white">
											{kpi.targetValue.toLocaleString()}
											<span className="text-sm text-neutral-400 ml-1">{kpi.unit}</span>
										</p>
									</div>
									<div>
										<p className="text-xs text-neutral-500 mb-1">Progress</p>
										<p className={`text-xl font-bold ${
											progress >= 90
												? 'text-green-400'
												: progress >= 70
												? 'text-blue-400'
												: progress >= 50
												? 'text-yellow-400'
												: 'text-red-400'
										}`}>
											{progress}%
										</p>
									</div>
								</div>

								{/* Progress Bar */}
								<div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden mb-3">
									<div
										className={`h-full transition-all duration-500 ${
											progress >= 90
												? 'bg-gradient-to-r from-green-500 to-green-400'
												: progress >= 70
												? 'bg-gradient-to-r from-blue-500 to-blue-400'
												: progress >= 50
												? 'bg-gradient-to-r from-yellow-500 to-yellow-400'
												: 'bg-gradient-to-r from-red-500 to-red-400'
										}`}
										style={{ width: `${progress}%` }}
									/>
								</div>

								<div className="flex items-center justify-between text-xs text-neutral-500">
									<div className="flex items-center gap-4">
										<span>Owner: <span className="text-neutral-300">{kpi.owner}</span></span>
										<span>Department: <span className="text-neutral-300">{kpi.department}</span></span>
									</div>
									<div className="flex items-center gap-4">
										<span className="uppercase">{kpi.period}</span>
										<span>{kpi.startDate} ~ {kpi.endDate}</span>
									</div>
								</div>
							</div>
						)
					})}
				</div>
			</CardContent>
		</Card>
	)
}

