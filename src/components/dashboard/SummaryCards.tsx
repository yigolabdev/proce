import { Card, CardContent } from '../ui/Card'
import { FileText, Clock, CheckCircle2, BarChart3 } from 'lucide-react'

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
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			{[
				{ label: 'Work Entries', value: stats.workEntries, icon: FileText },
				{ label: 'Hours Logged', value: `${stats.hoursLogged}h`, icon: Clock },
				{ label: 'Completed', value: stats.completed, icon: CheckCircle2 },
				{ label: 'Completion Rate', value: stats.completionRate, icon: BarChart3 },
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

