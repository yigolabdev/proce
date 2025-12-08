/**
 * OKRProgress Component
 * OKR 진행률 시각화 및 통계
 */

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card'
import { TrendingUp, Target, CheckCircle2, AlertTriangle, Clock } from 'lucide-react'
import type { OKRStats } from '../../../types/okr.types'

export interface OKRProgressProps {
	stats: OKRStats
}

export function OKRProgress({ stats }: OKRProgressProps) {
	const completionRate = stats.totalObjectives > 0
		? Math.round((stats.completedObjectives / stats.totalObjectives) * 100)
		: 0

	const krCompletionRate = stats.totalKeyResults > 0
		? Math.round((stats.completedKeyResults / stats.totalKeyResults) * 100)
		: 0

	const statCards = [
		{
			label: 'Total Objectives',
			value: stats.totalObjectives,
			icon: Target,
			color: 'text-blue-400',
			bgColor: 'bg-blue-500/20',
		},
		{
			label: 'Completed',
			value: stats.completedObjectives,
			icon: CheckCircle2,
			color: 'text-green-400',
			bgColor: 'bg-green-500/20',
		},
		{
			label: 'On Track',
			value: stats.onTrackObjectives,
			icon: TrendingUp,
			color: 'text-blue-400',
			bgColor: 'bg-blue-500/20',
		},
		{
			label: 'At Risk',
			value: stats.atRiskObjectives,
			icon: AlertTriangle,
			color: 'text-yellow-400',
			bgColor: 'bg-yellow-500/20',
		},
		{
			label: 'Behind',
			value: stats.behindObjectives,
			icon: Clock,
			color: 'text-red-400',
			bgColor: 'bg-red-500/20',
		},
	]

	return (
		<div className="space-y-6">
			{/* Overview Cards */}
			<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
				{statCards.map((stat) => {
					const Icon = stat.icon
					return (
						<Card key={stat.label} className="bg-surface-dark border-border-dark">
							<CardContent className="p-4">
								<div className="flex items-center gap-3">
									<div className={`p-2 rounded-lg ${stat.bgColor}`}>
										<Icon className={`h-5 w-5 ${stat.color}`} />
									</div>
									<div>
										<p className="text-2xl font-bold text-white">{stat.value}</p>
										<p className="text-xs text-neutral-400">{stat.label}</p>
									</div>
								</div>
							</CardContent>
						</Card>
					)
				})}
			</div>

			{/* Progress Bars */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Objectives Completion */}
				<Card className="bg-surface-dark border-border-dark">
					<CardHeader>
						<CardTitle className="text-base">Objectives Completion</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="text-center">
							<p className="text-4xl font-bold text-white">{completionRate}%</p>
							<p className="text-sm text-neutral-400 mt-1">
								{stats.completedObjectives} of {stats.totalObjectives} completed
							</p>
						</div>
						<div className="h-3 bg-neutral-800 rounded-full overflow-hidden">
							<div
								className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
								style={{ width: `${completionRate}%` }}
							/>
						</div>
					</CardContent>
				</Card>

				{/* Key Results Completion */}
				<Card className="bg-surface-dark border-border-dark">
					<CardHeader>
						<CardTitle className="text-base">Key Results Completion</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="text-center">
							<p className="text-4xl font-bold text-white">{krCompletionRate}%</p>
							<p className="text-sm text-neutral-400 mt-1">
								{stats.completedKeyResults} of {stats.totalKeyResults} completed
							</p>
						</div>
						<div className="h-3 bg-neutral-800 rounded-full overflow-hidden">
							<div
								className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
								style={{ width: `${krCompletionRate}%` }}
							/>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Average Progress */}
			<Card className="bg-surface-dark border-border-dark">
				<CardHeader>
					<CardTitle className="text-base">Average Progress</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-4">
						<div className="flex-1">
							<div className="h-4 bg-neutral-800 rounded-full overflow-hidden">
								<div
									className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-500"
									style={{ width: `${stats.averageProgress}%` }}
								/>
							</div>
						</div>
						<div className="text-right">
							<p className="text-2xl font-bold text-white">{Math.round(stats.averageProgress)}%</p>
							<p className="text-xs text-neutral-400">Overall</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Health Indicator */}
			<Card className="bg-surface-dark border-border-dark">
				<CardHeader>
					<CardTitle className="text-base">OKR Health</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{/* On Track */}
						<div className="flex items-center gap-3">
							<div className="w-32 text-sm text-neutral-400">On Track</div>
							<div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
								<div
									className="h-full bg-blue-500 transition-all duration-300"
									style={{
										width: `${stats.totalObjectives > 0 ? (stats.onTrackObjectives / stats.totalObjectives) * 100 : 0}%`
									}}
								/>
							</div>
							<div className="w-12 text-right text-sm font-medium text-blue-400">
								{stats.onTrackObjectives}
							</div>
						</div>

						{/* At Risk */}
						<div className="flex items-center gap-3">
							<div className="w-32 text-sm text-neutral-400">At Risk</div>
							<div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
								<div
									className="h-full bg-yellow-500 transition-all duration-300"
									style={{
										width: `${stats.totalObjectives > 0 ? (stats.atRiskObjectives / stats.totalObjectives) * 100 : 0}%`
									}}
								/>
							</div>
							<div className="w-12 text-right text-sm font-medium text-yellow-400">
								{stats.atRiskObjectives}
							</div>
						</div>

						{/* Behind */}
						<div className="flex items-center gap-3">
							<div className="w-32 text-sm text-neutral-400">Behind</div>
							<div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
								<div
									className="h-full bg-red-500 transition-all duration-300"
									style={{
										width: `${stats.totalObjectives > 0 ? (stats.behindObjectives / stats.totalObjectives) * 100 : 0}%`
									}}
								/>
							</div>
							<div className="w-12 text-right text-sm font-medium text-red-400">
								{stats.behindObjectives}
							</div>
						</div>

						{/* Completed */}
						<div className="flex items-center gap-3">
							<div className="w-32 text-sm text-neutral-400">Completed</div>
							<div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
								<div
									className="h-full bg-green-500 transition-all duration-300"
									style={{
										width: `${stats.totalObjectives > 0 ? (stats.completedObjectives / stats.totalObjectives) * 100 : 0}%`
									}}
								/>
							</div>
							<div className="w-12 text-right text-sm font-medium text-green-400">
								{stats.completedObjectives}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

