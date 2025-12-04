import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { LoadingState } from '../components/common/LoadingState'
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts'
import { PageHeader } from '../components/common/PageHeader'
import { 
	FileText,
	Sparkles,
	AlertTriangle,
	Clock
} from 'lucide-react'
import { useDashboardData } from '../hooks/useDashboardData'
import { PerformanceChart } from '../components/dashboard/PerformanceChart'
import { SummaryCards } from '../components/dashboard/SummaryCards'
import { RecentActivity } from '../components/dashboard/RecentActivity'
import { QuickActions } from '../components/dashboard/QuickActions'
import { useI18n } from '../i18n/I18nProvider'
import { formatLocalDate } from '../utils/dateUtils'

export default function DashboardPage() {
	const navigate = useNavigate()
	const { t, locale } = useI18n()
	const { loading, personalStats, myRecentWork, performanceData } = useDashboardData()

	// Keyboard shortcuts
	useKeyboardShortcuts({
		newWork: () => navigate('/app/input'),
		goToDashboard: () => navigate('/app/dashboard'),
	})

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-background-dark">
				<LoadingState type="page" />
			</div>
		)
	}

	return (
	<div className="min-h-screen bg-neutral-50 dark:bg-background-dark text-neutral-900 dark:text-neutral-100">
		<div className="max-w-[1600px] mx-auto px-6 py-6 space-y-8">
			{/* Top Header */}
			<PageHeader
				title={t('dashboard.title')}
				description={t('dashboard.description')}
				actions={
					<div className="flex items-center gap-3">
						<p className="text-sm text-neutral-500 dark:text-neutral-400 hidden sm:block">
							{formatLocalDate(new Date(), locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
						</p>
					<Button onClick={() => navigate('/app/input')} variant="outline" className="rounded-full border-border-dark hover:bg-border-dark text-white">
						<FileText className="h-4 w-4 mr-2" />
						{t('dashboard.addWork')}
					</Button>
					</div>
				}
			/>

			{/* Today's Summary - 4 Cards */}
			<div>
				<h2 className="text-lg font-semibold mb-4 text-neutral-400">{t('dashboard.todaySummary')}</h2>
				<SummaryCards stats={personalStats} />
			</div>

			{/* AI Suggestions & Quick Actions */}
			<Card className="bg-surface-dark border-border-dark overflow-hidden relative">
				<CardHeader className="border-b border-border-dark pb-4">
					<div className="flex items-center gap-2">
						<Sparkles className="h-5 w-5 text-white" />
						<CardTitle className="text-white">{t('dashboard.aiSuggestions')}</CardTitle>
					</div>
					<p className="text-sm text-neutral-400">{t('dashboard.aiSuggestionsDesc')}</p>
				</CardHeader>
				<CardContent className="p-6 space-y-6">
					{/* Warning Strip */}
					<div className="flex items-center justify-between p-4 rounded-xl bg-surface-dark border border-border-dark">
						<div className="flex items-center gap-3">
							<AlertTriangle className="h-5 w-5 text-red-500" />
							<div>
								<p className="font-medium text-white">{t('dashboard.lowProgress')}: {t('dashboard.exampleTaskName')}</p>
								<p className="text-sm text-neutral-500">{t('dashboard.lowProgressMsg')}</p>
							</div>
						</div>
						<Button size="sm" variant="outline" className="rounded-full" onClick={() => navigate('/app/input')}>
							{t('dashboard.addWorkEntry')}
						</Button>
					</div>

					{/* Quick Actions Grid */}
					<QuickActions />
				</CardContent>
			</Card>

			{/* Bottom Section: Activity & Chart */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<RecentActivity activities={myRecentWork} />

				{/* Upcoming Deadlines (Placeholder as in image) */}
				<Card className="bg-surface-dark border-border-dark h-full flex flex-col justify-center items-center text-center p-8">
					<div className="mb-4 relative">
						<div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full" />
						<Clock className="h-12 w-12 text-orange-500 relative z-10" />
					</div>
					<h3 className="text-lg font-bold text-white mb-2">{t('dashboard.upcomingDeadlines')}</h3>
					<p className="text-neutral-400 text-sm mb-6 max-w-xs">
						{t('dashboard.noDeadlines')}
					</p>
					<div className="flex gap-2">
						<span className="w-2 h-2 rounded-full bg-neutral-700" />
						<span className="w-2 h-2 rounded-full bg-neutral-700" />
						<span className="w-2 h-2 rounded-full bg-border-dark" />
					</div>
				</Card>
			</div>

			{/* Performance Chart */}
			<div className="mt-6">
				<h2 className="text-lg font-semibold mb-4 text-neutral-400">{t('dashboard.last7DaysPerformance')}</h2>
				<PerformanceChart data={performanceData} />
			</div>
		</div>
	</div>
	)
}
