import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/Dialog'
import { Sparkles, Info, CheckCircle2 } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { Card, CardContent } from '../ui/Card'

interface TipsDialogProps {
	isOpen: boolean
	onClose: () => void
}

export function TipsDialog({ isOpen, onClose }: TipsDialogProps) {
	const { t } = useI18n()

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-2xl bg-surface-dark border-border-dark text-white">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 text-xl">
						<Sparkles className="h-5 w-5 text-orange-500" />
						{t('input.tipsDocumentation')}
					</DialogTitle>
					<DialogDescription className="text-neutral-400">
						Helpful guides and AI suggestions for better work documentation
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-6 md:grid-cols-2 mt-4">
					{/* AI Suggestion */}
					<Card className="bg-[#1a1a1a] border-border-dark">
						<div className="p-4 border-b border-border-dark flex items-center gap-2">
							<div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
								<Sparkles className="h-4 w-4" />
							</div>
							<h3 className="font-bold text-white text-sm">{t('input.aiSuggestion')}</h3>
						</div>
						<CardContent className="p-4">
							<p className="text-xs text-neutral-400 mb-3">
								{t('input.considerIncluding')}
							</p>
							<ul className="space-y-3 text-xs text-neutral-300">
								<li className="flex items-start gap-2">
									<span className="text-blue-500 mt-0.5">•</span>
									<span>Specific metrics or KPIs affected</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-blue-500 mt-0.5">•</span>
									<span>Collaboration with team members</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-blue-500 mt-0.5">•</span>
									<span>Next steps or follow-up tasks</span>
								</li>
							</ul>
						</CardContent>
					</Card>

					{/* Tips */}
					<Card className="bg-[#1a1a1a] border-border-dark">
						<div className="p-4 border-b border-border-dark flex items-center gap-2">
							<div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500">
								<Info className="h-4 w-4" />
							</div>
							<h3 className="font-bold text-white text-sm">{t('input.tips.clearTitles')}</h3>
						</div>
						<CardContent className="p-4">
							<ul className="space-y-3 text-xs text-neutral-400">
								<li className="flex items-start gap-2.5">
									<CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
									<span>{t('input.tips.clearTitles')}</span>
								</li>
								<li className="flex items-start gap-2.5">
									<CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
									<span>{t('input.tips.context')}</span>
								</li>
								<li className="flex items-start gap-2.5">
									<CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
									<span>{t('input.tips.linkProjects')}</span>
								</li>
								<li className="flex items-start gap-2.5">
									<CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
									<span>{t('input.tips.attachFiles')}</span>
								</li>
								<li className="flex items-start gap-2.5">
									<CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
									<span>{t('input.tips.tagTeam')}</span>
								</li>
							</ul>
						</CardContent>
					</Card>
				</div>
			</DialogContent>
		</Dialog>
	)
}


