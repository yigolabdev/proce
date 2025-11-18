/**
 * Work Rhythm Main Page
 * 
 * 모든 리듬 섹션을 탭으로 통합한 메인 페이지
 */

import { useState } from 'react'
import { useRhythm } from '../../context/RhythmContext'
import { Button } from '../../components/ui/Button'
import { PageHeader } from '../../components/common/PageHeader'
import { LoadingState } from '../../components/common/LoadingState'
import { 
	Clock, 
	PlayCircle,
	AlertTriangle,
	CheckCircle2,
	Users,
	RefreshCw,
} from 'lucide-react'
import { toast } from 'sonner'
import { TodaySection } from './_components/TodaySection'
import { InProgressSection } from './_components/InProgressSection'
import { NeedsReviewSection } from './_components/NeedsReviewSection'
import { CompletedSection } from './_components/CompletedSection'
import { TeamRhythmSection } from './_components/TeamRhythmSection'

type TabType = 'today' | 'in-progress' | 'needs-review' | 'completed' | 'team'

export default function WorkRhythmPage() {
	const { loading, refreshRhythm } = useRhythm()
	const [activeTab, setActiveTab] = useState<TabType>('today')

	const handleRefresh = async () => {
		await refreshRhythm()
		toast.success('Work Rhythm refreshed')
	}

	const tabs = [
		{ id: 'today' as TabType, label: 'Today', icon: Clock, count: null },
		{ id: 'in-progress' as TabType, label: 'In Progress', icon: PlayCircle, count: null },
		{ id: 'needs-review' as TabType, label: 'Needs Review', icon: AlertTriangle, count: null },
		{ id: 'completed' as TabType, label: 'Completed', icon: CheckCircle2, count: null },
		{ id: 'team' as TabType, label: 'Team Rhythm', icon: Users, count: null },
	]

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<LoadingState type="page" />
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
			{/* Header with Tabs */}
			<PageHeader
				title="Work Rhythm"
				description="Your work execution flow and team status"
				icon={Clock}
				sticky
				actions={
					<Button onClick={handleRefresh} variant="outline" size="sm">
						<RefreshCw className="h-4 w-4 sm:mr-2" />
						<span className="hidden sm:inline">Refresh</span>
					</Button>
				}
				tabs={{
					items: tabs,
					activeTab,
					onTabChange: (id) => setActiveTab(id as TabType),
					mobileLabels: {
						'in-progress': 'Progress',
						'needs-review': 'Review',
						'completed': 'Done',
						'team': 'Team',
					}
				}}
			/>

			{/* Content */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
				{activeTab === 'today' && <TodaySection />}
				{activeTab === 'in-progress' && <InProgressSection />}
				{activeTab === 'needs-review' && <NeedsReviewSection />}
				{activeTab === 'completed' && <CompletedSection />}
				{activeTab === 'team' && <TeamRhythmSection />}
			</div>
		</div>
	)
}

