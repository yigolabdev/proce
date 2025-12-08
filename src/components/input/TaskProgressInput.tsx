/**
 * TaskProgressInput Component
 * 작업 진행률 입력 (Task 모드용)
 */

import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import { Target, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react'
import type { TaskProgress } from '../../types/workInput.types'

export interface TaskProgressInputProps {
	taskProgress: TaskProgress
	onTaskProgressChange: (progress: Partial<TaskProgress>) => void
	disabled?: boolean
}

export function TaskProgressInput({
	taskProgress,
	onTaskProgressChange,
	disabled = false,
}: TaskProgressInputProps) {
	const progressPercentage = Math.round(
		(taskProgress.completedItems / taskProgress.totalItems) * 100
	)

	const getProgressColor = (percentage: number) => {
		if (percentage === 0) return 'text-neutral-500'
		if (percentage < 30) return 'text-red-400'
		if (percentage < 70) return 'text-yellow-400'
		if (percentage < 100) return 'text-blue-400'
		return 'text-green-400'
	}

	const getProgressBgColor = (percentage: number) => {
		if (percentage === 0) return 'bg-neutral-500'
		if (percentage < 30) return 'bg-red-500'
		if (percentage < 70) return 'bg-yellow-500'
		if (percentage < 100) return 'bg-blue-500'
		return 'bg-green-500'
	}

	return (
		<Card className="bg-surface-dark border-border-dark">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Target className="h-5 w-5" />
					Task Progress
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Task counts */}
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-neutral-300 mb-2">
							Total Items <span className="text-red-400">*</span>
						</label>
						<Input
							type="number"
							min="1"
							placeholder="e.g., 10"
							value={taskProgress.totalItems || ''}
							onChange={(e) =>
								onTaskProgressChange({
									totalItems: parseInt(e.target.value) || 0,
								})
							}
							disabled={disabled}
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-neutral-300 mb-2">
							Completed Items <span className="text-red-400">*</span>
						</label>
						<Input
							type="number"
							min="0"
							max={taskProgress.totalItems}
							placeholder="e.g., 7"
							value={taskProgress.completedItems || ''}
							onChange={(e) =>
								onTaskProgressChange({
									completedItems: Math.min(
										parseInt(e.target.value) || 0,
										taskProgress.totalItems
									),
								})
							}
							disabled={disabled}
							required
						/>
					</div>
				</div>

				{/* Progress visualization */}
				{taskProgress.totalItems > 0 && (
					<div className="space-y-2">
						<div className="flex items-center justify-between text-sm">
							<span className="text-neutral-400">Progress</span>
							<span className={`font-bold ${getProgressColor(progressPercentage)}`}>
								{progressPercentage}%
							</span>
						</div>
						<div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
							<div
								className={`h-full transition-all duration-300 ${getProgressBgColor(progressPercentage)}`}
								style={{ width: `${progressPercentage}%` }}
							/>
						</div>
						<div className="flex items-center gap-2 text-xs text-neutral-500">
							{progressPercentage === 100 ? (
								<>
									<CheckCircle2 className="h-3 w-3 text-green-400" />
									Task completed!
								</>
							) : (
								<>
									<TrendingUp className="h-3 w-3" />
									{taskProgress.completedItems} of {taskProgress.totalItems} items done
								</>
							)}
						</div>
					</div>
				)}

				{/* Milestone */}
				<div>
					<label className="block text-sm font-medium text-neutral-300 mb-2">
						Milestone / Sprint
					</label>
					<Input
						type="text"
						placeholder="e.g., Sprint 3, Phase 2, Q4 Goals"
						value={taskProgress.milestone || ''}
						onChange={(e) =>
							onTaskProgressChange({ milestone: e.target.value })
						}
						disabled={disabled}
					/>
				</div>

				{/* Next steps */}
				<div>
					<label className="block text-sm font-medium text-neutral-300 mb-2">
						Next Steps
					</label>
					<Textarea
						placeholder="What needs to be done next?"
						value={taskProgress.nextSteps || ''}
						onChange={(e) =>
							onTaskProgressChange({ nextSteps: e.target.value })
						}
						disabled={disabled}
						rows={3}
					/>
				</div>

				{/* Blockers */}
				<div>
					<label className="block text-sm font-medium text-neutral-300 mb-2 flex items-center gap-2">
						<AlertCircle className="h-4 w-4 text-red-400" />
						Blockers / Issues
					</label>
					<Textarea
						placeholder="Any obstacles or challenges?"
						value={taskProgress.blockers || ''}
						onChange={(e) =>
							onTaskProgressChange({ blockers: e.target.value })
						}
						disabled={disabled}
						rows={3}
					/>
					{taskProgress.blockers && (
						<p className="text-xs text-yellow-500 mt-1">
							⚠️ This blocker will be highlighted in the review.
						</p>
					)}
				</div>

				{/* Status indicator */}
				<div className="p-3 bg-neutral-900/50 border border-border-dark rounded-lg">
					<div className="flex items-start gap-3">
						{progressPercentage === 100 ? (
							<CheckCircle2 className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
						) : progressPercentage > 0 ? (
							<TrendingUp className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
						) : (
							<Target className="h-5 w-5 text-neutral-500 shrink-0 mt-0.5" />
						)}
						<div>
							<p className="text-sm font-medium text-white">
								{progressPercentage === 100
									? 'Task Completed'
									: progressPercentage > 0
									? 'Task In Progress'
									: 'Task Not Started'}
							</p>
							<p className="text-xs text-neutral-400 mt-1">
								{progressPercentage === 100
									? 'Great work! All items are complete.'
									: progressPercentage > 0
									? `Keep going! ${taskProgress.totalItems - taskProgress.completedItems} items remaining.`
									: 'Enter your progress to track completion.'}
							</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

