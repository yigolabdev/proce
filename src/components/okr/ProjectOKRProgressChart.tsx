/**
 * ProjectOKRProgressChart Component
 * 프로젝트와 연결된 OKR의 진행률을 비교하는 차트
 */

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { TrendingUp, Target, FolderKanban } from 'lucide-react'
import type { Project } from '../../types/common.types'
import type { Objective } from '../../types/okr.types'

interface ProjectOKRProgressChartProps {
	project: Project
	relatedOKRs: Objective[]
}

export function ProjectOKRProgressChart({ project, relatedOKRs }: ProjectOKRProgressChartProps) {
	// Calculate project progress
	const projectProgress = project.progress || 0

	// Calculate average OKR progress
	const okrProgress = useMemo(() => {
		if (relatedOKRs.length === 0) return 0

		const totalProgress = relatedOKRs.reduce((sum, okr) => {
			const okrAvg = okr.keyResults.length > 0
				? okr.keyResults.reduce((krSum, kr) => krSum + (kr.current / kr.target * 100), 0) / okr.keyResults.length
				: 0
			return sum + okrAvg
		}, 0)

		return totalProgress / relatedOKRs.length
	}, [relatedOKRs])

	// Calculate difference
	const difference = Math.abs(okrProgress - projectProgress)
	const isOKRAhead = okrProgress > projectProgress
	const isAligned = difference < 5 // Consider aligned if within 5%

	return (
		<Card className="bg-surface-dark border-border-dark">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-white">
					<TrendingUp className="h-5 w-5 text-primary" />
					Progress Comparison
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Project Progress */}
				<div>
					<div className="flex items-center justify-between mb-2">
						<div className="flex items-center gap-2">
							<FolderKanban className="h-4 w-4 text-blue-400" />
							<span className="text-sm font-medium text-neutral-300">Project Progress</span>
						</div>
						<span className="text-lg font-bold text-white">{Math.round(projectProgress)}%</span>
					</div>
					<div className="w-full bg-neutral-800 rounded-full h-3">
						<div
							className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full transition-all"
							style={{ width: `${Math.min(100, projectProgress)}%` }}
						/>
					</div>
				</div>

				{/* OKR Progress */}
				<div>
					<div className="flex items-center justify-between mb-2">
						<div className="flex items-center gap-2">
							<Target className="h-4 w-4 text-orange-400" />
							<span className="text-sm font-medium text-neutral-300">
								OKR Progress ({relatedOKRs.length} {relatedOKRs.length === 1 ? 'OKR' : 'OKRs'})
							</span>
						</div>
						<span className="text-lg font-bold text-white">{Math.round(okrProgress)}%</span>
					</div>
					<div className="w-full bg-neutral-800 rounded-full h-3">
						<div
							className="bg-gradient-to-r from-orange-500 to-orange-400 h-3 rounded-full transition-all"
							style={{ width: `${Math.min(100, okrProgress)}%` }}
						/>
					</div>
				</div>

				{/* Analysis */}
				<div className="pt-4 border-t border-neutral-800">
					<div className="flex items-start gap-3">
						<div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
							isAligned 
								? 'bg-green-900/30' 
								: isOKRAhead 
									? 'bg-orange-900/30' 
									: 'bg-yellow-900/30'
						}`}>
							<TrendingUp className={`h-5 w-5 ${
								isAligned 
									? 'text-green-400' 
									: isOKRAhead 
										? 'text-orange-400' 
										: 'text-yellow-400'
							}`} />
						</div>
						<div className="flex-1">
							<h4 className={`text-sm font-semibold mb-1 ${
								isAligned 
									? 'text-green-400' 
									: isOKRAhead 
										? 'text-orange-400' 
										: 'text-yellow-400'
							}`}>
								{isAligned && '✓ Well Aligned'}
								{!isAligned && isOKRAhead && '↑ OKRs Ahead'}
								{!isAligned && !isOKRAhead && '↓ OKRs Behind'}
							</h4>
							<p className="text-xs text-neutral-400">
								{isAligned && (
									`Project and OKRs are progressing together (${Math.round(difference)}% difference).`
								)}
								{!isAligned && isOKRAhead && (
									`OKRs are ${Math.round(difference)}% ahead of project progress. This may indicate excellent execution on objectives.`
								)}
								{!isAligned && !isOKRAhead && (
									`OKRs are ${Math.round(difference)}% behind project progress. Consider updating OKR key results or creating new objectives.`
								)}
							</p>
						</div>
					</div>
				</div>

				{/* Individual OKR Breakdown */}
				{relatedOKRs.length > 0 && (
					<div className="pt-4 border-t border-neutral-800">
						<h4 className="text-sm font-semibold text-neutral-300 mb-3">Individual OKR Progress</h4>
						<div className="space-y-3">
							{relatedOKRs.map(okr => {
								const progress = okr.keyResults.length > 0
									? okr.keyResults.reduce((sum, kr) => sum + (kr.current / kr.target * 100), 0) / okr.keyResults.length
									: 0

								return (
									<div key={okr.id}>
										<div className="flex items-center justify-between mb-1">
											<span className="text-xs text-neutral-400 truncate flex-1 mr-2">{okr.title}</span>
											<span className="text-xs font-semibold text-white">{Math.round(progress)}%</span>
										</div>
										<div className="w-full bg-neutral-800 rounded-full h-1.5">
											<div
												className="bg-gradient-to-r from-orange-500 to-orange-400 h-1.5 rounded-full transition-all"
												style={{ width: `${Math.min(100, progress)}%` }}
											/>
										</div>
									</div>
								)
							})}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	)
}

