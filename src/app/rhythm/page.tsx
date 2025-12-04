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
import { useI18n } from '../../i18n/I18nProvider'

type TabType = 'today' | 'in-progress' | 'needs-review' | 'completed' | 'team'

export default function WorkRhythmPage() {
	const { loading, refreshRhythm } = useRhythm()
	const { t } = useI18n()
	const [activeTab, setActiveTab] = useState<TabType>('today')

	const handleRefresh = async () => {
		await refreshRhythm()
		toast.success(t('common.success'))
	}

	const tabs = [
		{ id: 'today' as TabType, label: t('rhythm.today'), icon: Clock, count: null },
		{ id: 'in-progress' as TabType, label: t('rhythm.inProgress'), icon: PlayCircle, count: null },
		{ id: 'needs-review' as TabType, label: t('rhythm.needsReview'), icon: AlertTriangle, count: null },
		{ id: 'completed' as TabType, label: t('rhythm.completed'), icon: CheckCircle2, count: null },
		{ id: 'team' as TabType, label: t('rhythm.teamRhythm'), icon: Users, count: null },
	]

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<LoadingState type="page" />
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-neutral-50 dark:bg-background-dark text-neutral-900 dark:text-neutral-100">
			<div className="max-w-[1600px] mx-auto px-6 py-6 space-y-8">
				{/* Header */}
				<PageHeader
					title={t('rhythm.title')}
					description={t('rhythm.description')}
					actions={
						<Button onClick={handleRefresh} variant="outline" size="sm">
							<RefreshCw className="h-4 w-4 sm:mr-2" />
							<span className="hidden sm:inline">{t('common.refresh')}</span>
						</Button>
					}
				/>

				{/* Content */}
				<div>
					{/* Tabs */}
					<div className="flex border-b border-border-dark mb-6 overflow-x-auto">
						{tabs.map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
									activeTab === tab.id
										? 'border-orange-500 text-orange-500'
										: 'border-transparent text-neutral-500 hover:text-neutral-300'
								}`}
							>
								<tab.icon className="h-4 w-4" />
								{tab.label}
							</button>
						))}
					</div>

					<div>
						{activeTab === 'today' && <TodaySection />}
						{activeTab === 'in-progress' && <InProgressSection />}
						{activeTab === 'needs-review' && <NeedsReviewSection />}
						{activeTab === 'completed' && <CompletedSection />}
						{activeTab === 'team' && <TeamRhythmSection />}
					</div>
				</div>
			</div>
		</div>
	)
}
