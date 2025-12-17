import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { LoadingState } from '../components/common/LoadingState'
import { PageContainer, PageSection } from '../components/common/PageContainer'
import { SectionHeader } from '../components/common/SectionHeader'
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
import { WeeklyTasksWidget } from '../components/dashboard/WeeklyTasksWidget'
import { CompanyKPIWidget } from '../components/dashboard/CompanyKPIWidget'
import { useI18n } from '../i18n/I18nProvider'
import { formatLocalDate } from '../utils/dateUtils'
import { storage } from '../utils/storage'
import { useState, useEffect } from 'react'
import type { CompanyKPI } from '../app/admin/company-settings/_types/types'

export default function DashboardPage() {
	const navigate = useNavigate()
	const { t, locale } = useI18n()
	const { loading, personalStats, myRecentWork, performanceData } = useDashboardData()

	// Load Company KPIs
	const [companyKPIs, setCompanyKPIs] = useState<CompanyKPI[]>([])
	
	useEffect(() => {
		const loadKPIs = () => {
			const kpis = storage.get<CompanyKPI[]>('companyKPIs', [])
			setCompanyKPIs(kpis)
		}
		
		loadKPIs()
		
		// Listen for KPI updates
		const handleKPIUpdate = () => {
			loadKPIs()
		}
		
		window.addEventListener('companyKPIsUpdated', handleKPIUpdate)
		return () => window.removeEventListener('companyKPIsUpdated', handleKPIUpdate)
	}, [])

	// Keyboard shortcuts
	useKeyboardShortcuts({
		newWork: () => navigate('/app/input'),
		goToDashboard: () => navigate('/app/dashboard'),
	})

	if (loading) {
		return (
			<PageContainer>
				<LoadingState type="page" />
			</PageContainer>
		)
	}

	return (
	<PageContainer>
		<PageSection spacing="lg">
			{/* Top Header */}
			<PageHeader
				title={t('dashboard.title')}
				description={t('dashboard.description')}
				actions={
					<div className="flex items-center gap-3">
						<p className="text-sm text-neutral-400 hidden sm:block">
							{formatLocalDate(new Date(), locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
						</p>
					<Button onClick={() => navigate('/app/input')} variant="outline">
						<FileText className="h-4 w-4 mr-2" />
						{t('dashboard.addWork')}
					</Button>
					</div>
				}
			/>

			{/* Company KPIs - Always Visible to Everyone */}
			{companyKPIs.length > 0 && (
				<div>
					<SectionHeader 
						title="Company Goals"
						description="Shared objectives for everyone to align with"
						size="md"
					/>
					<div className="mt-4">
						<CompanyKPIWidget kpis={companyKPIs} compact />
					</div>
				</div>
			)}

			{/* Today's Summary - 4 Cards */}
			<div>
				<SectionHeader 
					title={t('dashboard.todaySummary')}
					size="md"
				/>
				<div className="mt-4">
					<SummaryCards stats={personalStats} />
				</div>
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
					<div className="flex items-center justify-between p-4 rounded-xl bg-surface-elevated border border-border-dark">
						<div className="flex items-center gap-3">
							<AlertTriangle className="h-5 w-5 text-red-500" />
							<div>
								<p className="font-medium text-white">{t('dashboard.lowProgress')}: {t('dashboard.exampleTaskName')}</p>
								<p className="text-sm text-neutral-500">{t('dashboard.lowProgressMsg')}</p>
							</div>
						</div>
						<Button size="sm" variant="outline" onClick={() => navigate('/app/input')}>
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
				
				{/* Weekly Tasks Widget */}
				<WeeklyTasksWidget />
			</div>

			{/* Performance Chart */}
			<div>
				<SectionHeader 
					title={t('dashboard.last7DaysPerformance')}
					size="md"
				/>
				<div className="mt-4">
					<PerformanceChart data={performanceData} />
				</div>
			</div>
		</PageSection>
	</PageContainer>
	)
}
