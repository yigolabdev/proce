import { Card, CardContent } from '../ui/Card'
import { FileText, Clock, CheckCircle2, BarChart3 } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'

interface Stats {
	workEntries: number
	hoursLogged: string
	completed: number
	completionRate: string
}

interface SummaryCardsProps {
	stats: Stats
}

export function SummaryCards({ stats }: SummaryCardsProps) {
	const { t } = useI18n()

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			{[
				{ label: t('dashboard.workEntries'), value: stats.workEntries, icon: FileText },
				{ label: t('dashboard.hoursLogged'), value: `${stats.hoursLogged}h`, icon: Clock },
				{ label: t('dashboard.completed'), value: stats.completed, icon: CheckCircle2 },
				{ label: t('dashboard.completionRate'), value: stats.completionRate, icon: BarChart3 },
			].map((stat, idx) => (
				<Card key={idx} className="bg-surface-dark border-border-dark">
					<CardContent className="p-5 flex items-start justify-between">
						<div>
							<p className="text-sm text-neutral-400 font-medium mb-1">{stat.label}</p>
							<p className="text-2xl font-bold text-white">{stat.value}</p>
						</div>
						<stat.icon className="h-5 w-5 text-neutral-500" />
					</CardContent>
				</Card>
			))}
		</div>
	)
}

