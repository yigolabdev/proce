/**
 * Completed Section Component
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRhythm } from '../../../context/RhythmContext'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Select } from '../../../components/ui/Select'
import { EmptyState } from '../../../components/common/EmptyState'
import { 
	CheckCircle2, 
	Calendar,
	User,
	FolderKanban,
	Clock,
	TrendingUp,
	Award,
} from 'lucide-react'
import type { LoopItem } from '../../../services/rhythm/types'

export function CompletedSection() {
	const navigate = useNavigate()
	const { completed } = useRhythm()
	const [filterPeriod, setFilterPeriod] = useState<'today' | 'week' | 'month' | 'all'>('today')

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'high': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
			case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
			case 'low': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
			default: return 'text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900/20'
		}
	}

	const filteredCompleted = completed.filter(item => {
		if (!item.completedAt) return filterPeriod === 'all'
		
		const completedDate = new Date(item.completedAt)
		const now = new Date()
		
		switch (filterPeriod) {
			case 'today': {
				const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
				return completedDate >= today
			}
			case 'week': {
				const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
				return completedDate >= weekAgo
			}
			case 'month': {
				const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
				return completedDate >= monthAgo
			}
			case 'all':
				return true
			default:
				return true
		}
	})

	return (
		<div className="space-y-8">
			{/* Filter */}
			<div className="flex items-center justify-end">
				<Select
					value={filterPeriod}
					onChange={(e) => setFilterPeriod(e.target.value as any)}
					className="w-32"
				>
					<option value="today">Today</option>
					<option value="week">This Week</option>
					<option value="month">This Month</option>
					<option value="all">All Time</option>
				</Select>
			</div>

			{/* Summary Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<CheckCircle2 className="h-4 w-4 text-green-600" />
							Completed
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">
							{filteredCompleted.length}
						</div>
						<p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
							In selected period
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<Award className="h-4 w-4 text-yellow-600" />
							High Priority
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-yellow-600">
							{filteredCompleted.filter(item => item.priority === 'high').length}
						</div>
						<p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
							Important tasks done
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<FolderKanban className="h-4 w-4 text-blue-600" />
							Projects
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-blue-600">
							{new Set(filteredCompleted.map(item => item.projectId).filter(Boolean)).size}
						</div>
						<p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
							Projects contributed to
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<TrendingUp className="h-4 w-4 text-purple-600" />
							Productivity
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-purple-600">
							{filteredCompleted.length > 0 ? Math.round(filteredCompleted.length / 7) : 0}/day
						</div>
						<p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
							Average completion rate
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Completed Tasks */}
			{filteredCompleted.length > 0 ? (
				<div className="grid grid-cols-1 gap-4">
					{filteredCompleted.map((item) => (
						<Card
							key={item.id}
							className="border-l-4 border-l-green-500 opacity-90 hover:opacity-100 transition-opacity"
						>
							<CardContent className="p-6">
								<div className="flex items-start justify-between gap-4">
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-2">
											<CheckCircle2 className="h-4 w-4 text-green-600" />
											<span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(item.priority)}`}>
												{item.priority.toUpperCase()}
											</span>
											{item.type === 'task' && (
												<span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
													Completed
												</span>
											)}
										</div>
										<h3 className="text-lg font-semibold mb-2 line-through decoration-neutral-400">
											{item.title}
										</h3>
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
											{item.completedAt && (
												<div className="flex items-center gap-1">
													<Clock className="h-4 w-4" />
													Completed: {new Date(item.completedAt).toLocaleString()}
												</div>
											)}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			) : (
				<EmptyState
					icon={<CheckCircle2 className="h-12 w-12" />}
					title="No completed tasks"
					description={`No tasks completed ${filterPeriod === 'today' ? 'today' : `in the selected period`}`}
					action={
						<button onClick={() => navigate('/app/ai-recommendations')} className="text-primary hover:underline">
							View Tasks
						</button>
					}
				/>
			)}
		</div>
	)
}

