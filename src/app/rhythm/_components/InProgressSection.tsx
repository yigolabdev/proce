/**
 * In Progress Section Component
 */

import { useNavigate } from 'react-router-dom'
import { useRhythm } from '../../../context/RhythmContext'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { EmptyState } from '../../../components/common/EmptyState'
import { 
	PlayCircle, 
	Calendar,
	User,
	FolderKanban,
	ArrowRight,
	Clock,
	TrendingUp,
} from 'lucide-react'
import type { LoopItem } from '../../../services/rhythm/types'

export function InProgressSection() {
	const navigate = useNavigate()
	const { inProgress } = useRhythm()

	const handleNavigateToSource = (item: LoopItem) => {
		if (item.type === 'task') {
			navigate('/app/ai-recommendations')
		} else if (item.type === 'work') {
			navigate('/app/work-history')
		}
	}

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'high': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
			case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
			case 'low': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
			default: return 'text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900/20'
		}
	}

	return (
		<div className="space-y-8">
			{/* Summary Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<PlayCircle className="h-4 w-4 text-blue-600" />
							Active Tasks
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-blue-600">
							{inProgress.length}
						</div>
						<p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
							Currently in progress
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<TrendingUp className="h-4 w-4 text-green-600" />
							High Priority
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">
							{inProgress.filter(item => item.priority === 'high').length}
						</div>
						<p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
							Needs focus
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<Clock className="h-4 w-4 text-orange-600" />
							Due Soon
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-orange-600">
							{inProgress.filter(item => {
								if (!item.dueDate) return false
								const hoursUntil = (new Date(item.dueDate).getTime() - Date.now()) / (1000 * 60 * 60)
								return hoursUntil <= 24
							}).length}
						</div>
						<p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
							Within 24 hours
						</p>
					</CardContent>
				</Card>
			</div>

			{/* In Progress Tasks */}
			{inProgress.length > 0 ? (
				<div className="grid grid-cols-1 gap-4">
					{inProgress.map((item) => (
						<Card
							key={item.id}
							className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow"
						>
							<CardContent className="p-6">
								<div className="flex items-start justify-between gap-4">
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-2">
											<span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(item.priority)}`}>
												{item.priority.toUpperCase()}
											</span>
											{item.type === 'task' && (
												<span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
													Task
												</span>
											)}
										</div>
										<h3 className="text-lg font-semibold mb-2">{item.title}</h3>
										{item.description && (
											<p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
												{item.description}
											</p>
										)}
										
										{item.progress !== undefined && (
											<div className="mb-3">
												<div className="flex items-center justify-between text-sm mb-1">
													<span className="text-neutral-600 dark:text-neutral-400">Progress</span>
													<span className="font-medium">{item.progress}%</span>
												</div>
												<div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
													<div
														className="h-full bg-blue-600 dark:bg-blue-400 transition-all"
														style={{ width: `${item.progress}%` }}
													/>
												</div>
											</div>
										)}
										
										<div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
											{item.projectName && (
												<div className="flex items-center gap-1">
													<FolderKanban className="h-4 w-4" />
													{item.projectName}
												</div>
											)}
											{item.assignedToName && (
												<div className="flex items-center gap-1">
													<User className="h-4 w-4" />
													{item.assignedToName}
												</div>
											)}
											{item.dueDate && (
												<div className="flex items-center gap-1">
													<Calendar className="h-4 w-4" />
													Due: {new Date(item.dueDate).toLocaleDateString()}
												</div>
											)}
										</div>
									</div>
									<Button
										onClick={() => handleNavigateToSource(item)}
										variant="outline"
										size="sm"
									>
										<ArrowRight className="h-4 w-4" />
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			) : (
				<EmptyState
					icon={<PlayCircle className="h-12 w-12" />}
					title="No tasks in progress"
					description="Accept a task from AI Recommendations to get started"
					action={
						<Button onClick={() => navigate('/app/ai-recommendations')}>
							View Recommendations
						</Button>
					}
				/>
			)}
		</div>
	)
}

