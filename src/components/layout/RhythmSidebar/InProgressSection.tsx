/**
 * In Progress Section
 * 
 * 진행 중인 작업을 표시하는 섹션
 */

import { useState } from 'react'
import { PlayCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { useRhythm } from '../../../context/RhythmContext'
import type { LoopItem } from '../../../services/rhythm/types'

interface InProgressSectionProps {
	onItemClick?: (item: LoopItem) => void
}

export function InProgressSection({ onItemClick }: InProgressSectionProps) {
	const { inProgress, loading } = useRhythm()
	const [expanded, setExpanded] = useState(true)
	
	if (loading) {
		return null
	}
	
	if (inProgress.length === 0) {
		return null
	}
	
	return (
		<div className="mb-2">
			{/* 헤더 */}
			<button
				onClick={() => setExpanded(!expanded)}
				className="w-full flex items-center justify-between px-4 py-2 hover:hover:bg-neutral-900 rounded-lg transition-colors group"
			>
				<div className="flex items-center gap-2 flex-1">
					<PlayCircle size={16} className="text-blue-400" />
					<span className="text-sm font-medium">In Progress</span>
					{inProgress.length > 0 && (
						<span className="text-xs px-1.5 py-0.5 bg-blue-900/30 text-blue-300 rounded-full font-medium">
							{inProgress.length}
						</span>
					)}
					<button
						onClick={(e) => {
							e.stopPropagation()
							onItemClick?.({ id: 'in-progress', type: 'task', title: 'In Progress', status: 'in-progress', priority: 'medium', loopStage: 'in-progress', sourceType: 'manual_task', sourceId: 'in-progress', originalData: {} })
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
					{inProgress.map(item => (
						<div
							key={item.id}
							className="px-3 py-2 rounded-lg hover:hover:bg-blue-900/10 cursor-pointer transition-colors mb-1"
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
							{item.progress !== undefined && (
								<div className="mt-1.5">
									<div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
										<div
											className="h-full bg-blue-400 transition-all"
											style={{ width: `${item.progress}%` }}
										/>
									</div>
									<p className="text-xs text-neutral-400 mt-0.5">
										{item.progress}%
									</p>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	)
}

