import { Card, CardContent } from '../../../../components/ui/Card'
import { TrendingUp, Clock, Calendar, Brain } from 'lucide-react'
import { RecommendationInsight } from '../_types'

interface RecommendationInsightsProps {
	insights: RecommendationInsight[]
}

export function RecommendationInsights({ insights }: RecommendationInsightsProps) {
	const getStatusColor = (status: string) => {
		switch (status) {
			case 'urgent':
				return 'border-l-red-500 bg-red-500/10'
			case 'warning':
				return 'border-l-orange-500 bg-orange-500/10'
			default:
				return 'border-l-blue-500 bg-blue-500/10'
		}
	}
	
	const getIcon = (type: string) => {
		switch (type) {
			case 'gap':
				return <TrendingUp className="h-5 w-5 text-orange-500" />
			case 'inactive':
				return <Clock className="h-5 w-5 text-orange-500" />
			case 'deadline':
				return <Calendar className="h-5 w-5 text-orange-500" />
			default:
				return <Brain className="h-5 w-5 text-blue-500" />
		}
	}

	if (insights.length === 0) return null

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
			{insights.map((insight, index) => (
				<Card key={index} className={`border-l-4 border-t-0 border-r-0 border-b-0 bg-surface-dark border-border-dark ${getStatusColor(insight.status)}`}>
					<CardContent className="p-4 flex items-center gap-4">
						<div className="p-2 rounded-full bg-surface-dark/50 shrink-0">
							{getIcon(insight.type)}
						</div>
						<div className="flex-1 min-w-0">
							<h3 className="font-bold text-sm mb-1 text-white">{insight.metric}</h3>
							<p className="text-xs text-neutral-400">
								{insight.value}
							</p>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	)
}

