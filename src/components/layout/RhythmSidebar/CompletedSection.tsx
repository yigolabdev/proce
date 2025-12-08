/**
 * Completed Section
 * 
 * 완료된 작업을 표시하는 섹션
 */

import { useState } from 'react'
import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'
import { useRhythm } from '../../../context/RhythmContext'
import type { LoopItem } from '../../../services/rhythm/types'

interface CompletedSectionProps {
	onItemClick?: (item: LoopItem) => void
}

export function CompletedSection({ onItemClick }: CompletedSectionProps) {
	const { completed, loading } = useRhythm()
	const [expanded, setExpanded] = useState(false) // 기본 접힘
	
	if (loading) {
		return null
	}
	
	if (completed.length === 0) {
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
					<CheckCircle2 size={16} className="text-green-400" />
					<span className="text-sm font-medium">Completed</span>
					{completed.length > 0 && (
						<span className="text-xs px-1.5 py-0.5 bg-green-900/30 text-green-300 rounded-full font-medium">
							{completed.length}
						</span>
					)}
					<button
						onClick={(e) => {
							e.stopPropagation()
							onItemClick?.({ id: 'completed', type: 'task', title: 'Completed', status: 'completed', priority: 'medium', loopStage: 'completed', sourceType: 'manual_task', sourceId: 'completed', originalData: {} })
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
					<p className="text-xs text-neutral-400 px-2 mb-2">
						오늘 완료한 작업
					</p>
					{completed.map(item => (
						<div
							key={item.id}
							className="px-3 py-2 rounded-lg hover:hover:bg-green-900/10 cursor-pointer transition-colors mb-1 opacity-75"
							onClick={() => onItemClick?.(item)}
						>
							<p className="text-sm text-neutral-300 line-through">
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
		</div>
	)
}

