/**
 * Weekly Tasks Widget Component
 * 주간 추천 Tasks 위젯
 */

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { 
	Calendar, 
	Clock, 
	ChevronRight,
	Sparkles,
	AlertCircle,
	Target,
	TrendingUp
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { weeklyTaskRecommendationService, type WeeklyRecommendedTask } from '../../services/ai/weeklyTaskRecommendation.service'
import { useAuth } from '../../context/AuthContext'

export function WeeklyTasksWidget() {
	const { user } = useAuth()
	const navigate = useNavigate()
	const [recommendations, setRecommendations] = useState<WeeklyRecommendedTask[]>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		loadRecommendations()
	}, [user])

	const loadRecommendations = async () => {
		if (!user) return
		
		setIsLoading(true)
		try {
			const recs = await weeklyTaskRecommendationService.generateWeeklyRecommendations(user.id)
			setRecommendations(recs.slice(0, 5))  // 상위 5개만
		} catch (error) {
			console.error('주간 추천 로드 오류:', error)
		} finally {
			setIsLoading(false)
		}
	}

	const getUrgencyColor = (urgency: 'high' | 'medium' | 'low') => {
		switch (urgency) {
			case 'high':
				return 'text-red-400 bg-red-500/10'
			case 'medium':
				return 'text-yellow-400 bg-yellow-500/10'
			case 'low':
				return 'text-green-400 bg-green-500/10'
		}
	}

	const getUrgencyIcon = (urgency: 'high' | 'medium' | 'low') => {
		switch (urgency) {
			case 'high':
				return <AlertCircle className="h-4 w-4" />
			case 'medium':
				return <TrendingUp className="h-4 w-4" />
			case 'low':
				return <Target className="h-4 w-4" />
		}
	}

	const handleTaskClick = (task: WeeklyRecommendedTask) => {
		// Task 정보를 sessionStorage에 저장하고 Work Input으로 이동
		sessionStorage.setItem('workInputData', JSON.stringify({
			taskId: task.task.id,
			title: task.task.title,
			description: task.task.description,
			category: task.task.category,
			mode: 'task-progress',
		}))
		navigate('/app/input')
	}

	if (isLoading) {
		return (
			<Card className="bg-surface-dark border-border-dark">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Calendar className="h-5 w-5 text-primary" />
						이번 주 추천 Tasks
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-center py-8">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
					</div>
				</CardContent>
			</Card>
		)
	}

	if (recommendations.length === 0) {
		return (
			<Card className="bg-surface-dark border-border-dark">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Calendar className="h-5 w-5 text-primary" />
						이번 주 추천 Tasks
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-center py-8">
						<Sparkles className="h-12 w-12 mx-auto mb-3 text-neutral-700" />
						<p className="text-sm text-neutral-400">
							아직 추천할 Task가 없습니다
						</p>
					</div>
				</CardContent>
			</Card>
		)
	}

	const totalEstimatedTime = recommendations.reduce((sum, rec) => sum + rec.estimatedTime, 0)
	const urgentCount = recommendations.filter(rec => rec.urgency === 'high').length

	return (
		<Card className="bg-surface-dark border-border-dark">
			<CardHeader className="border-b border-border-dark">
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						<Calendar className="h-5 w-5 text-primary" />
						이번 주 추천 Tasks
					</CardTitle>
					<div className="flex items-center gap-2">
						{urgentCount > 0 && (
							<span className="text-xs px-2 py-1 rounded bg-red-500/10 text-red-400 font-bold">
								긴급 {urgentCount}
							</span>
						)}
						<Button
							variant="ghost"
							size="sm"
							onClick={() => navigate('/app/ai-recommendations')}
							className="text-xs"
						>
							전체 보기
							<ChevronRight className="h-3 w-3 ml-1" />
						</Button>
					</div>
				</div>
				
				{/* 요약 정보 */}
				<div className="flex items-center gap-4 text-sm text-neutral-400 mt-2">
					<div className="flex items-center gap-1">
						<Target className="h-4 w-4" />
						<span>{recommendations.length}개 Task</span>
					</div>
					<div className="flex items-center gap-1">
						<Clock className="h-4 w-4" />
						<span>약 {Math.round(totalEstimatedTime / 60)}시간</span>
					</div>
				</div>
			</CardHeader>

			<CardContent className="p-4">
				<div className="space-y-3">
					{recommendations.map((rec, index) => (
						<div
							key={rec.task.id}
							className="p-3 bg-neutral-900/50 rounded-lg hover:bg-neutral-900 transition-colors cursor-pointer group"
							onClick={() => handleTaskClick(rec)}
						>
							<div className="flex items-start gap-3">
								{/* 순서 번호 */}
								<div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
									{index + 1}
								</div>

								{/* Task 정보 */}
								<div className="flex-1 min-w-0">
									<div className="flex items-start justify-between gap-2 mb-1">
										<h4 className="font-medium text-white group-hover:text-primary transition-colors line-clamp-1">
											{rec.task.title}
										</h4>
										<div className={`p-1 rounded ${getUrgencyColor(rec.urgency)} shrink-0`}>
											{getUrgencyIcon(rec.urgency)}
										</div>
									</div>

									{/* 이유 */}
									<p className="text-xs text-neutral-400 mb-2 line-clamp-1">
										{rec.reason}
									</p>

									{/* 메타 정보 */}
									<div className="flex items-center gap-3 text-xs text-neutral-500">
										<div className="flex items-center gap-1">
											<Clock className="h-3 w-3" />
											<span>{Math.round(rec.estimatedTime / 60)}시간</span>
										</div>
										{rec.task.priority && (
											<span className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 uppercase text-[10px] font-bold">
												{rec.task.priority}
											</span>
										)}
										{rec.task.deadline && (
											<span>
												마감: {new Date(rec.task.deadline).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
											</span>
										)}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* AI 안내 */}
				<div className="mt-4 p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
					<div className="flex items-start gap-2">
						<Sparkles className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
						<p className="text-xs text-blue-300">
							AI가 KPI, OKR 진척도, 마감일을 분석하여 이번 주 집중해야 할 Task를 추천했습니다.
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
