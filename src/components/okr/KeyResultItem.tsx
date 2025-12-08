/**
 * KeyResultItem Component
 * 개별 핵심 결과 아이템 표시
 */

import React from 'react'
import { Button } from '../../ui/Button'
import { Edit, Trash2, User, TrendingUp, AlertCircle } from 'lucide-react'
import type { KeyResult } from '../../../types/okr.types'

export interface KeyResultItemProps {
	keyResult: KeyResult
	onEdit: (keyResult: KeyResult) => void
	onDelete: (id: string) => void
	onUpdateProgress: (id: string, current: number) => void
	disabled?: boolean
}

export function KeyResultItem({
	keyResult,
	onEdit,
	onDelete,
	onUpdateProgress,
	disabled = false,
}: KeyResultItemProps) {
	const progress = Math.round((keyResult.current / keyResult.target) * 100)
	const isCompleted = keyResult.current >= keyResult.target
	const isAtRisk = keyResult.aiAnalysis && !keyResult.aiAnalysis.onTrack

	const getProgressColor = () => {
		if (isCompleted) return 'bg-green-500'
		if (isAtRisk) return 'bg-yellow-500'
		return 'bg-blue-500'
	}

	return (
		<div className="p-4 bg-neutral-900/50 border border-border-dark rounded-lg space-y-3">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div className="flex-1">
					<p className="text-white font-medium">{keyResult.description}</p>
					<div className="flex items-center gap-2 mt-1 text-sm text-neutral-400">
						<User className="h-3 w-3" />
						{keyResult.owner}
					</div>
				</div>

				<div className="flex items-center gap-1 ml-4">
					<Button
						onClick={() => onEdit(keyResult)}
						disabled={disabled}
						variant="ghost"
						size="sm"
					>
						<Edit className="h-4 w-4" />
					</Button>
					<Button
						onClick={() => {
							if (confirm('Delete this key result?')) {
								onDelete(keyResult.id)
							}
						}}
						disabled={disabled}
						variant="ghost"
						size="sm"
						className="text-red-400 hover:text-red-300"
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* Progress Input */}
			<div className="flex items-center gap-3">
				<input
					type="number"
					value={keyResult.current}
					onChange={(e) => onUpdateProgress(keyResult.id, Number(e.target.value))}
					disabled={disabled}
					min={0}
					max={keyResult.target}
					className="w-24 px-3 py-1 bg-surface-dark border border-border-dark rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
				/>
				<span className="text-neutral-400">/</span>
				<span className="text-white font-medium">{keyResult.target}</span>
				<span className="text-neutral-400 text-sm">{keyResult.unit}</span>
			</div>

			{/* Progress Bar */}
			<div className="space-y-1">
				<div className="flex items-center justify-between text-xs">
					<span className="text-neutral-400">Progress</span>
					<span className={`font-bold ${isCompleted ? 'text-green-400' : 'text-white'}`}>
						{progress}%
					</span>
				</div>
				<div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
					<div
						className={`h-full transition-all duration-300 ${getProgressColor()}`}
						style={{ width: `${Math.min(progress, 100)}%` }}
					/>
				</div>
			</div>

			{/* AI Analysis */}
			{keyResult.aiAnalysis && (
				<div className={`p-2 rounded-lg border text-xs ${
					keyResult.aiAnalysis.onTrack
						? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
						: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
				}`}>
					<div className="flex items-start gap-2">
						{keyResult.aiAnalysis.onTrack ? (
							<TrendingUp className="h-4 w-4 shrink-0 mt-0.5" />
						) : (
							<AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
						)}
						<div className="space-y-1">
							<p className="font-medium">
								{keyResult.aiAnalysis.onTrack ? 'On Track' : 'At Risk'}
								{' '}
								(Confidence: {Math.round(keyResult.aiAnalysis.confidence * 100)}%)
							</p>
							<p className="text-xs opacity-90">
								Predicted: {keyResult.aiAnalysis.predictedFinalValue} {keyResult.unit}
							</p>
							{keyResult.aiAnalysis.recommendations.length > 0 && (
								<div className="mt-2 space-y-1">
									<p className="font-medium">Recommendations:</p>
									<ul className="list-disc list-inside space-y-0.5 opacity-90">
										{keyResult.aiAnalysis.recommendations.map((rec, idx) => (
											<li key={idx}>{rec}</li>
										))}
									</ul>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

