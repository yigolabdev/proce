/**
 * Today Section Component
 * 
 * Work Rhythm 페이지의 Today 탭 내용
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRhythm } from '../../../context/RhythmContext'
import { useAuth } from '../../../context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { EmptyState } from '../../../components/common/EmptyState'
import { 
	Clock, 
	AlertCircle, 
	CheckCircle2, 
	Calendar,
	User,
	FolderKanban,
	ArrowRight,
	TrendingUp,
	Target,
	Sparkles,
} from 'lucide-react'
import type { LoopItem } from '../../../services/rhythm/types'

export function TodaySection() {
	const navigate = useNavigate()
	const { user } = useAuth()
	const { todayStatus, requestNextActions } = useRhythm()
	const [showingNext, setShowingNext] = useState(false)
	const [nextActions, setNextActions] = useState<any>(null)

	const handleShowNextActions = async () => {
		const actions = await requestNextActions()
		setNextActions(actions)
		setShowingNext(true)
	}

	const handleNavigateToSource = (item: LoopItem) => {
		if (item.type === 'task') {
			navigate('/app/ai-recommendations')
		} else if (item.type === 'work') {
			navigate('/app/work-history')
		} else if (item.type === 'review') {
			navigate('/app/work-review')
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

	if (!todayStatus) {
		return (
			<EmptyState
				icon={<Clock className="h-12 w-12" />}
				title="No Today Status"
				description="Unable to load today's status"
			/>
		)
	}

	const { urgent, scheduled, needsReview, completed, isLoopComplete, summary } = todayStatus

	return (
		<div className="space-y-8">
			{/* Summary Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card className={isLoopComplete ? 'border-green-500 dark:border-green-600' : ''}>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							{isLoopComplete ? (
								<CheckCircle2 className="h-4 w-4 text-green-600" />
							) : (
								<Target className="h-4 w-4 text-primary" />
							)}
							Status
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{isLoopComplete ? (
								<span className="text-green-600">Complete</span>
							) : (
								<span>{summary.pending} pending</span>
							)}
						</div>
						<p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
							{summary.completed} completed today
						</p>
					</CardContent>
				</Card>

				<Card className={urgent.length > 0 ? 'border-red-500 dark:border-red-600' : ''}>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<AlertCircle className="h-4 w-4 text-red-600" />
							Urgent
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-red-600">
							{urgent.length}
						</div>
						<p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
							Needs immediate attention
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<Calendar className="h-4 w-4 text-blue-600" />
							Scheduled
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-blue-600">
							{scheduled.length}
						</div>
						<p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
							Due today
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<AlertCircle className="h-4 w-4 text-orange-600" />
							Reviews
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-orange-600">
							{needsReview.length}
						</div>
						<p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
							Needs your attention
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Loop Complete State */}
			{isLoopComplete && (
				<Card className="bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800">
					<CardContent className="p-6">
						<div className="flex items-start gap-4">
							<CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400 shrink-0" />
							<div className="flex-1">
								<h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-1">
									오늘의 루프는 모두 완료되었습니다! 🎉
								</h3>
								<p className="text-sm text-green-700 dark:text-green-300 mb-4">
									수고하셨습니다! 편히 쉬셔도 됩니다.
								</p>
								
								{!showingNext && (
									<Button
										onClick={handleShowNextActions}
										variant="outline"
										className="border-green-300 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/20"
									>
										<Sparkles className="h-4 w-4 mr-2" />
										다음 할 수 있는 작업 보기 (선택 사항)
									</Button>
								)}
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Urgent Tasks */}
			{urgent.length > 0 && (
				<div>
					<div className="flex items-center gap-2 mb-4">
						<AlertCircle className="h-5 w-5 text-red-600" />
						<h2 className="text-xl font-semibold">Urgent Tasks</h2>
						<span className="text-sm text-neutral-600 dark:text-neutral-400">
							({urgent.length})
						</span>
					</div>
					<div className="grid grid-cols-1 gap-4">
						{urgent.map((item) => (
							<Card
								key={item.id}
								className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow cursor-pointer"
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
														<Clock className="h-4 w-4" />
														{new Date(item.dueDate).toLocaleString()}
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
				</div>
			)}

			{/* Scheduled Tasks */}
			{scheduled.length > 0 && (
				<div>
					<div className="flex items-center gap-2 mb-4">
						<Calendar className="h-5 w-5 text-blue-600" />
						<h2 className="text-xl font-semibold">Scheduled for Today</h2>
						<span className="text-sm text-neutral-600 dark:text-neutral-400">
							({scheduled.length})
						</span>
					</div>
					<div className="grid grid-cols-1 gap-4">
						{scheduled.map((item) => (
							<Card
								key={item.id}
								className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow cursor-pointer"
							>
								<CardContent className="p-6">
									<div className="flex items-start justify-between gap-4">
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-2">
												<span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(item.priority)}`}>
													{item.priority.toUpperCase()}
												</span>
											</div>
											<h3 className="text-lg font-semibold mb-2">{item.title}</h3>
											{item.description && (
												<p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
													{item.description}
												</p>
											)}
											<div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
												{item.projectName && (
													<div className="flex items-center gap-1">
														<FolderKanban className="h-4 w-4" />
														{item.projectName}
													</div>
												)}
												{item.dueDate && (
													<div className="flex items-center gap-1">
														<Clock className="h-4 w-4" />
														{new Date(item.dueDate).toLocaleString()}
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
				</div>
			)}

			{/* Needs Review */}
			{needsReview.length > 0 && (
				<div>
					<div className="flex items-center gap-2 mb-4">
						<AlertCircle className="h-5 w-5 text-orange-600" />
						<h2 className="text-xl font-semibold">Needs Your Review</h2>
						<span className="text-sm text-neutral-600 dark:text-neutral-400">
							({needsReview.length})
						</span>
					</div>
					<div className="grid grid-cols-1 gap-4">
						{needsReview.map((item) => (
							<Card
								key={item.id}
								className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow cursor-pointer"
							>
								<CardContent className="p-6">
									<div className="flex items-start justify-between gap-4">
										<div className="flex-1">
											<h3 className="text-lg font-semibold mb-2">{item.title}</h3>
											{item.description && (
												<p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
													{item.description}
												</p>
											)}
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
				</div>
			)}

			{/* Optional Next Actions */}
			{showingNext && nextActions && nextActions.nextUp && nextActions.nextUp.length > 0 && (
				<div>
					<div className="flex items-center gap-2 mb-4">
						<TrendingUp className="h-5 w-5 text-purple-600" />
						<h2 className="text-xl font-semibold">Next Up (Optional)</h2>
						<span className="text-sm text-neutral-600 dark:text-neutral-400">
							({nextActions.nextUp.length})
						</span>
					</div>
					<div className="grid grid-cols-1 gap-4">
						{nextActions.nextUp.map((item: LoopItem) => (
							<Card
								key={item.id}
								className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow cursor-pointer opacity-75"
							>
								<CardContent className="p-6">
									<div className="flex items-start justify-between gap-4">
										<div className="flex-1">
											<h3 className="text-lg font-semibold mb-2">{item.title}</h3>
											{item.description && (
												<p className="text-sm text-neutral-600 dark:text-neutral-400">
													{item.description}
												</p>
											)}
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
				</div>
			)}

			{/* Empty State */}
			{!isLoopComplete && urgent.length === 0 && scheduled.length === 0 && needsReview.length === 0 && (
				<EmptyState
					icon={<CheckCircle2 className="h-12 w-12" />}
					title="No tasks for today"
					description="You're all caught up! Enjoy your day."
				/>
			)}
		</div>
	)
}

