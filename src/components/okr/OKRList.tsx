/**
 * OKRList Component
 * OKR 목표 목록 표시
 */

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { Target, Edit, Trash2, Users, Calendar, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react'
import type { Objective } from '../../../types/okr.types'

export interface OKRListProps {
	objectives: Objective[]
	onSelect: (objective: Objective) => void
	onEdit: (objective: Objective) => void
	onDelete: (id: string) => void
}

export function OKRList({ objectives, onSelect, onEdit, onDelete }: OKRListProps) {
	const getStatusIcon = (status: Objective['status']) => {
		switch (status) {
			case 'completed':
				return <CheckCircle2 className="h-4 w-4 text-green-400" />
			case 'on-track':
				return <TrendingUp className="h-4 w-4 text-blue-400" />
			case 'at-risk':
				return <AlertTriangle className="h-4 w-4 text-yellow-400" />
			case 'behind':
				return <AlertTriangle className="h-4 w-4 text-red-400" />
		}
	}

	const getStatusColor = (status: Objective['status']) => {
		switch (status) {
			case 'completed':
				return 'bg-green-500/20 text-green-400 border-green-500/50'
			case 'on-track':
				return 'bg-blue-500/20 text-blue-400 border-blue-500/50'
			case 'at-risk':
				return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
			case 'behind':
				return 'bg-red-500/20 text-red-400 border-red-500/50'
		}
	}

	const calculateProgress = (objective: Objective): number => {
		if (objective.keyResults.length === 0) return 0
		const totalProgress = objective.keyResults.reduce((sum, kr) => {
			return sum + (kr.current / kr.target) * 100
		}, 0)
		return Math.round(totalProgress / objective.keyResults.length)
	}

	if (objectives.length === 0) {
		return (
			<Card className="bg-surface-dark border-border-dark">
				<CardContent className="p-12 text-center">
					<Target className="h-16 w-16 text-neutral-600 mx-auto mb-4" />
					<p className="text-neutral-400 text-lg">No OKRs found</p>
					<p className="text-neutral-500 text-sm mt-2">
						Create your first objective to get started
					</p>
				</CardContent>
			</Card>
		)
	}

	return (
		<div className="space-y-4">
			{objectives.map((objective) => {
				const progress = calculateProgress(objective)

				return (
					<Card
						key={objective.id}
						className="bg-surface-dark border-border-dark hover:border-neutral-600 transition-colors cursor-pointer"
						onClick={() => onSelect(objective)}
					>
						<CardHeader>
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-2">
										<Target className="h-5 w-5 text-orange-400" />
										<CardTitle className="text-lg">{objective.title}</CardTitle>
									</div>
									<p className="text-sm text-neutral-400 line-clamp-2">
										{objective.description}
									</p>
								</div>

								<div className="flex items-center gap-2 ml-4">
									<Button
										onClick={(e) => {
											e.stopPropagation()
											onEdit(objective)
										}}
										variant="ghost"
										size="sm"
									>
										<Edit className="h-4 w-4" />
									</Button>
									<Button
										onClick={(e) => {
											e.stopPropagation()
											if (confirm('Are you sure you want to delete this objective?')) {
												onDelete(objective.id)
											}
										}}
										variant="ghost"
										size="sm"
										className="text-red-400 hover:text-red-300"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</CardHeader>

						<CardContent className="space-y-4">
							{/* Metadata */}
							<div className="flex flex-wrap items-center gap-4 text-sm text-neutral-400">
								<div className="flex items-center gap-1">
									<Calendar className="h-4 w-4" />
									{objective.period}
								</div>
								<div className="flex items-center gap-1">
									<Users className="h-4 w-4" />
									{objective.team}
								</div>
								<div className="flex items-center gap-1">
									{getStatusIcon(objective.status)}
									<span className={`px-2 py-0.5 rounded-full text-xs border ${getStatusColor(objective.status)}`}>
										{objective.status.replace('-', ' ').toUpperCase()}
									</span>
								</div>
							</div>

							{/* Progress */}
							<div className="space-y-2">
								<div className="flex items-center justify-between text-sm">
									<span className="text-neutral-400">
										Progress: {objective.keyResults.length} Key Results
									</span>
									<span className="font-bold text-white">{progress}%</span>
								</div>
								<div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
									<div
										className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-300"
										style={{ width: `${progress}%` }}
									/>
								</div>
							</div>

							{/* AI Analysis Badge */}
							{objective.aiRecommendations && (
								<div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg flex items-center gap-2">
									<div className="flex items-center gap-1 text-xs text-purple-400">
										<TrendingUp className="h-3 w-3" />
										AI Analysis: {objective.aiRecommendations.isRealistic ? 'Realistic' : 'Needs Adjustment'}
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				)
			})}
		</div>
	)
}

