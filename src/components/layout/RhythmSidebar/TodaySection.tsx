/**
 * Today Section
 * 
 * 오늘의 루프 상태를 표시하는 섹션
 */

import { useState } from 'react'
import { CheckCircle, AlertCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { useRhythm } from '../../../context/RhythmContext'
import { Button } from '../../ui/Button'
import type { LoopItem } from '../../../services/rhythm/types'

interface TodaySectionProps {
	onItemClick?: (item: LoopItem) => void
}

export function TodaySection({ onItemClick }: TodaySectionProps) {
	const { todayStatus, loading, requestNextActions } = useRhythm()
	const [expanded, setExpanded] = useState(true)
	const [showingNext, setShowingNext] = useState(false)
	const [nextActions, setNextActions] = useState<any>(null)
	
	if (loading || !todayStatus) {
		return (
			<div className="px-4 py-2">
				<div className="animate-pulse">
					<div className="h-4 bg-neutral-800 rounded w-20 mb-2"></div>
					<div className="h-3 bg-neutral-800 rounded w-full"></div>
				</div>
			</div>
		)
	}
	
	const { urgent, scheduled, needsReview, isLoopComplete, summary } = todayStatus
	
	const handleShowNext = async () => {
		const actions = await requestNextActions()
		setNextActions(actions)
		setShowingNext(true)
	}
	
	return (
		<div className="mb-2">
			{/* 헤더 */}
			<button
				onClick={() => setExpanded(!expanded)}
				className="w-full flex items-center justify-between px-4 py-2 hover:hover:bg-neutral-900 rounded-lg transition-colors group"
			>
				<div className="flex items-center gap-2 flex-1">
					<Clock size={16} className="text-primary" />
					<span className="text-sm font-medium">Today</span>
					{!isLoopComplete && summary.total > 0 && (
						<span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
							{summary.total}
						</span>
					)}
					{isLoopComplete && (
						<CheckCircle size={14} className="text-green-400" />
					)}
					<button
						onClick={(e) => {
							e.stopPropagation()
							onItemClick?.({ id: 'today', type: 'task', title: 'Today', status: 'pending', priority: 'medium', loopStage: 'today', sourceType: 'manual_task', sourceId: 'today', originalData: {} })
						}}
						className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-xs text-neutral-500 hover:text-primary"
					>
						View All →
					</button>
				</div>
				{expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
			</button>
			
			{/* 내용 */}
			{expanded && (
				<div className="mt-1 px-2">
					{/* 루프 완료 상태 */}
					{isLoopComplete ? (
						<div className="p-3 bg-green-900/10 rounded-lg border border-green-800">
							<div className="flex items-start gap-2 mb-2">
								<CheckCircle size={18} className="text-green-400 shrink-0 mt-0.5" />
								<div className="flex-1">
									<p className="text-sm font-medium text-green-100">
										오늘의 루프는 모두 완료되었습니다
									</p>
									<p className="text-xs text-green-300 mt-1">
										수고하셨습니다! 편히 쉬셔도 됩니다.
									</p>
								</div>
							</div>
							
							{/* 선택적 다음 작업 보기 */}
							{!showingNext && (
								<Button
									onClick={handleShowNext}
									variant="outline"
									className="w-full mt-2 text-xs border-green-700 hover:hover:bg-green-900/20"
								>
									다음 할 수 있는 작업 보기 (선택 사항)
								</Button>
							)}
							
							{/* 다음 작업 표시 */}
							{showingNext && nextActions && nextActions.nextUp.length > 0 && (
								<div className="mt-2 pt-2 border-t border-green-800">
									<p className="text-xs text-green-300 mb-1">
										다음 예정된 작업:
									</p>
									{nextActions.nextUp.slice(0, 3).map((item: LoopItem) => (
										<div
											key={item.id}
											className="text-xs py-1 px-2 hover:hover:bg-green-900/30 rounded cursor-pointer"
											onClick={() => onItemClick?.(item)}
										>
											• {item.title}
										</div>
									))}
								</div>
							)}
						</div>
					) : (
						<>
							{/* 긴급 작업 */}
							{urgent.length > 0 && (
								<div className="mb-2">
									<div className="flex items-center gap-1.5 px-2 py-1">
										<AlertCircle size={12} className="text-red-500" />
										<span className="text-xs font-medium text-red-400">
											긴급 ({urgent.length})
										</span>
									</div>
									{urgent.map(item => (
										<div
											key={item.id}
											className="px-3 py-2 rounded-lg hover:hover:bg-red-900/10 cursor-pointer transition-colors border-l-2 border-red-500 ml-2"
											onClick={() => onItemClick?.(item)}
										>
											<p className="text-sm font-medium text-neutral-100">
												{item.title}
											</p>
											{item.projectName && (
												<p className="text-xs text-neutral-400 mt-0.5">
													{item.projectName}
												</p>
											)}
										</div>
									))}
								</div>
							)}
							
							{/* 예정된 작업 */}
							{scheduled.length > 0 && (
								<div className="mb-2">
									<div className="flex items-center gap-1.5 px-2 py-1">
										<Clock size={12} className="text-blue-500" />
										<span className="text-xs font-medium text-blue-400">
											예정됨 ({scheduled.length})
										</span>
									</div>
									{scheduled.map(item => (
										<div
											key={item.id}
											className="px-3 py-2 rounded-lg hover:hover:bg-blue-900/10 cursor-pointer transition-colors border-l-2 border-blue-500 ml-2"
											onClick={() => onItemClick?.(item)}
										>
											<p className="text-sm text-neutral-100">
												{item.title}
											</p>
											{item.projectName && (
												<p className="text-xs text-neutral-400 mt-0.5">
													{item.projectName}
												</p>
											)}
										</div>
									))}
								</div>
							)}
							
							{/* 검토 필요 */}
							{needsReview.length > 0 && (
								<div className="mb-2">
									<div className="flex items-center gap-1.5 px-2 py-1">
										<AlertCircle size={12} className="text-orange-500" />
										<span className="text-xs font-medium text-orange-400">
											검토 필요 ({needsReview.length})
										</span>
									</div>
									{needsReview.map(item => (
										<div
											key={item.id}
											className="px-3 py-2 rounded-lg hover:hover:bg-orange-900/10 cursor-pointer transition-colors border-l-2 border-orange-500 ml-2"
											onClick={() => onItemClick?.(item)}
										>
											<p className="text-sm text-neutral-100">
												{item.title}
											</p>
											{item.description && (
												<p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">
													{item.description}
												</p>
											)}
										</div>
									))}
								</div>
							)}
						</>
					)}
				</div>
			)}
		</div>
	)
}

