/**
 * Rhythm Sidebar
 * 
 * 리듬 기반 사이드바 메인 컴포넌트
 */

import { TodaySection } from './TodaySection'
import { InProgressSection } from './InProgressSection'
import { NeedsReviewSection } from './NeedsReviewSection'
import { CompletedSection } from './CompletedSection'
import { TeamRhythmSection } from './TeamRhythmSection'
import type { LoopItem } from '../../../services/rhythm/types'
import { useNavigate } from 'react-router-dom'

export function RhythmSidebar() {
	const navigate = useNavigate()
	
	const handleItemClick = (item: LoopItem) => {
		// 특수 ID: 섹션 전체 보기
		if (item.id === 'today') {
			navigate('/app/rhythm/today')
			return
		}
		if (item.id === 'in-progress') {
			navigate('/app/rhythm/in-progress')
			return
		}
		if (item.id === 'needs-review') {
			navigate('/app/rhythm/needs-review')
			return
		}
		if (item.id === 'completed') {
			navigate('/app/rhythm/completed')
			return
		}
		if (item.id === 'team-rhythm') {
			navigate('/app/rhythm/team')
			return
		}
		
		// 개별 아이템: 원본 페이지로 이동
		if (item.type === 'task') {
			navigate('/app/ai-recommendations')
		} else if (item.type === 'work') {
			navigate('/app/work-history')
		} else if (item.type === 'review') {
			navigate('/app/work-review')
		}
	}
	
	return (
		<div className="space-y-1">
			<TodaySection onItemClick={handleItemClick} />
			<InProgressSection onItemClick={handleItemClick} />
			<NeedsReviewSection onItemClick={handleItemClick} />
			<CompletedSection onItemClick={handleItemClick} />
			<TeamRhythmSection />
		</div>
	)
}

