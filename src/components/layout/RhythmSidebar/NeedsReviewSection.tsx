/**
 * Needs Review Section
 * 
 * 검토가 필요한 작업을 표시하는 섹션
 */

import { useState } from 'react'
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import { useRhythm } from '../../../context/RhythmContext'
import type { LoopItem } from '../../../services/rhythm/types'

interface NeedsReviewSectionProps {
	onItemClick?: (item: LoopItem) => void
}

export function NeedsReviewSection({ onItemClick }: NeedsReviewSectionProps) {
	const { needsReview, loading } = useRhythm()
	const [expanded, setExpanded] = useState(true)
	
	if (loading) {
		return null
	}
	
	if (needsReview.length === 0) {
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
					<AlertTriangle size={16} className="text-orange-400" />
					<span className="text-sm font-medium">Needs Review</span>
					{needsReview.length > 0 && (
						<span className="text-xs px-1.5 py-0.5 bg-orange-900/30 text-orange-300 rounded-full font-medium">
							{needsReview.length}
						</span>
					)}
					<button
						onClick={(e) => {
							e.stopPropagation()
							onItemClick?.({ id: 'needs-review', type: 'review', title: 'Needs Review', status: 'needs-review', priority: 'medium', loopStage: 'needs-review', sourceType: 'review', sourceId: 'needs-review', originalData: {} })
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
					{needsReview.map(item => (
						<div
							key={item.id}
							className="px-3 py-2 rounded-lg hover:hover:bg-orange-900/10 cursor-pointer transition-colors mb-1 border-l-2 border-orange-500"
							onClick={() => onItemClick?.(item)}
						>
							<p className="text-sm font-medium text-neutral-100">
								{item.title}
							</p>
							{item.description && (
								<p className="text-xs text-neutral-400 mt-0.5 line-clamp-2">
									{item.description}
								</p>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	)
}

