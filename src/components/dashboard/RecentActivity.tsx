import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { ArrowRight, FileText } from 'lucide-react'
import { formatLocalDate } from '../../utils/dateUtils'
import type { WorkEntry } from '../../types/common.types'
import { useI18n } from '../../i18n/I18nProvider'

interface RecentActivityProps {
	activities: WorkEntry[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
	const navigate = useNavigate()
	const { t, locale } = useI18n()

	const getStatusLabel = (status: string | undefined): string => {
		if (!status) return t('common.statuses.pending')
		
		const keyMap: Record<string, string> = {
			approved: 'statuses.approved',
			pending: 'statuses.pending',
			rejected: 'statuses.rejected',
			changes_requested: 'statuses.changesRequested',
		}
		const key = keyMap[status] || 'statuses.pending'
		return t(`common.${key}`)
	}

	return (
		<Card className="bg-surface-dark border-border-dark h-full">
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle className="text-white">{t('dashboard.recentActivity')}</CardTitle>
				<Button variant="ghost" size="sm" onClick={() => navigate('/app/work-history')}>
					{t('dashboard.viewAll')} <ArrowRight className="h-4 w-4 ml-1" />
				</Button>
			</CardHeader>
			<CardContent className="space-y-4">
				{activities.length > 0 ? (
					activities.map((work) => (
						<div key={work.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-800/50 transition-colors group">
							<div className="flex items-center gap-4">
								<div className="p-2 rounded-lg bg-neutral-800 text-neutral-400 group-hover:text-white transition-colors">
									<FileText className="h-5 w-5" />
								</div>
								<div>
									<p className="font-medium text-white">{work.title}</p>
									<p className="text-xs text-neutral-500">
										{formatLocalDate(work.date, locale)} • {work.duration || t('dashboard.noDuration')}
									</p>
								</div>
							</div>
							<span className={`text-xs px-2 py-1 rounded-full ${
								work.status === 'approved' ? 'bg-green-900/30 text-green-400' : 'bg-neutral-800 text-neutral-400'
							}`}>
								{getStatusLabel(work.status)}
							</span>
						</div>
					))
				) : (
					<div className="flex flex-col items-center justify-center py-12 text-center">
						<div className="p-4 rounded-full bg-neutral-900 mb-3">
							<FileText className="h-8 w-8 text-neutral-600" />
						</div>
						<p className="text-neutral-400 font-medium">{t('dashboard.noActivity')}</p>
						<p className="text-sm text-neutral-600 mb-4">{t('dashboard.startAdding')}</p>
						<Button size="sm" onClick={() => navigate('/app/input')} className="rounded-full">
							{t('dashboard.addWorkEntry')}
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	)
}
