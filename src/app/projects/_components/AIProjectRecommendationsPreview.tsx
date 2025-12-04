import { useState, useEffect } from 'react'
import { useI18n } from '../../../i18n/I18nProvider'
import { Button } from '../../../components/ui/Button'
import { Sparkles, ArrowRight, Lightbulb } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface RecommendedProject {
	id: string
	title: string
	description: string
	reason: string
	objectives: string[]
	estimatedDuration: string
	recommendedTeamSize: number
	confidenceScore: number
	tags: string[]
}

export default function AIProjectRecommendationsPreview() {
	const { t } = useI18n()
	const navigate = useNavigate()
	const [loading, setLoading] = useState(true)
	const [recommendations, setRecommendations] = useState<RecommendedProject[]>([])

	useEffect(() => {
		generateRecommendations()
	}, [])

	const generateRecommendations = async () => {
		setLoading(true)
		
		// Simulate AI analysis delay - shorter for preview
		setTimeout(() => {
			// In a real app, this would fetch from API using company context
			const generated: RecommendedProject[] = [
				{
					id: 'rec-1',
					title: 'Global Market Expansion Initiative',
					description: 'Strategic project to enter new international markets based on recent growth metrics.',
					reason: 'Aligns with "Growth" KPI targets and builds upon recent successful marketing campaigns.',
					objectives: ['Establish presence in 2 new regions', 'Achieve $1M revenue in new markets'],
					estimatedDuration: '6 months',
					recommendedTeamSize: 8,
					confidenceScore: 92,
					tags: ['Strategy', 'Expansion']
				},
				{
					id: 'rec-2',
					title: 'Customer Experience AI Integration',
					description: 'Implementation of AI-driven support tools to reduce response times and improve CSAT.',
					reason: 'Addresses "Operational" efficiency goals and leverages historical success in tech adoption.',
					objectives: ['Reduce support ticket time by 40%', 'Increase CSAT by 15%'],
					estimatedDuration: '3 months',
					recommendedTeamSize: 5,
					confidenceScore: 88,
					tags: ['AI', 'Customer Support']
				},
				{
					id: 'rec-3',
					title: 'Internal Knowledge Base Modernization',
					description: 'Revamping internal documentation systems to improve employee onboarding and productivity.',
					reason: 'Recommended based on team growth trends and need for better operational scalability.',
					objectives: ['Centralize documentation', 'Reduce onboarding time by 2 weeks'],
					estimatedDuration: '2 months',
					recommendedTeamSize: 3,
					confidenceScore: 85,
					tags: ['Internal', 'Knowledge']
				}
			]
			
			setRecommendations(generated)
			setLoading(false)
		}, 1500)
	}

	const handleViewAll = () => {
		navigate('/app/projects/recommendations')
	}

	if (loading) return null // Or a skeleton loader

	return (
		<div className="mb-8">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<Sparkles className="h-5 w-5 text-indigo-400" />
					<h2 className="text-lg font-semibold text-white">{t('projects.aiSuggestions')}</h2>
				</div>
				<Button variant="ghost" onClick={handleViewAll} className="text-sm text-neutral-400 hover:text-white">
					{t('projects.viewAll')} <ArrowRight className="ml-1 h-4 w-4" />
				</Button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{recommendations.map((rec) => (
					<div 
						key={rec.id}
						className="group relative bg-surface-dark hover:bg-neutral-800/80 border border-border-dark hover:border-indigo-500/30 rounded-xl p-5 transition-all cursor-pointer overflow-hidden flex flex-col"
						onClick={handleViewAll}
					>
						{/* Confidence Score Badge */}
						<div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
							<Sparkles className="h-3 w-3 text-indigo-400" />
							<span className="text-[10px] font-bold text-indigo-300">{rec.confidenceScore}%</span>
						</div>

						<h3 className="text-base font-bold text-white mb-2 pr-12 line-clamp-1 group-hover:text-indigo-300 transition-colors">
							{rec.title}
						</h3>
						<p className="text-xs text-neutral-400 mb-3 line-clamp-2 flex-1">
							{rec.description}
						</p>

						<div className="flex items-start gap-2 mb-3 bg-indigo-500/5 rounded-lg p-2 border border-indigo-500/10">
							<Lightbulb className="h-3 w-3 text-indigo-400 shrink-0 mt-0.5" />
							<p className="text-[10px] text-indigo-200 line-clamp-2">
								{rec.reason}
							</p>
						</div>

						<div className="flex flex-wrap gap-2 mt-auto">
							{rec.tags.map((tag, i) => (
								<span key={i} className="px-1.5 py-0.5 rounded text-[10px] bg-neutral-800 text-neutral-400 border border-neutral-700">
									#{tag}
								</span>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

