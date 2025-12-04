import { useNavigate } from 'react-router-dom'
import { FileText, CheckCircle2, FolderKanban } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'

export function QuickActions() {
	const navigate = useNavigate()
	const { t } = useI18n()

	return (
		<div>
			<h3 className="text-lg font-semibold text-white mb-4">{t('dashboard.quickActions')}</h3>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<button 
					onClick={() => navigate('/app/input')}
					className="group flex flex-col items-center justify-center p-8 rounded-xl border border-dashed border-border-dark hover:border-primary/50 hover:bg-primary/5 transition-all"
				>
					<div className="mb-3 p-3 rounded-full bg-orange-500/10 text-orange-500 group-hover:scale-110 transition-transform">
						<FileText className="h-6 w-6" />
					</div>
					<span className="font-semibold text-white mb-1">{t('dashboard.addWorkEntry')}</span>
					<span className="text-xs text-neutral-500 mb-3">{t('dashboard.logDailyWork')}</span>
					<span className="text-xs px-2 py-1 rounded bg-border-dark text-neutral-400 font-mono">{t('shortcuts.pressN')}</span>
				</button>

				<button 
					onClick={() => navigate('/app/work-review')}
					className="group flex flex-col items-center justify-center p-8 rounded-xl border border-dashed border-border-dark hover:border-blue-500/50 hover:bg-blue-500/5 transition-all"
				>
					<div className="mb-3 p-3 rounded-full bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
						<CheckCircle2 className="h-6 w-6" />
					</div>
					<span className="font-semibold text-white mb-1">{t('dashboard.manageReviews')}</span>
					<span className="text-xs text-neutral-500 mb-3">{t('dashboard.manageReviewsDesc')}</span>
					<span className="text-xs px-2 py-1 rounded bg-border-dark text-neutral-400 font-mono">{t('shortcuts.pressR')}</span>
				</button>

				<button 
					onClick={() => navigate('/app/projects')}
					className="group flex flex-col items-center justify-center p-8 rounded-xl border border-dashed border-border-dark hover:border-purple-500/50 hover:bg-purple-500/5 transition-all"
				>
					<div className="mb-3 p-3 rounded-full bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform">
						<FolderKanban className="h-6 w-6" />
					</div>
					<span className="font-semibold text-white mb-1">{t('dashboard.manageProjects')}</span>
					<span className="text-xs text-neutral-500 mb-3">{t('dashboard.manageProjectsDesc')}</span>
					<span className="text-xs px-2 py-1 rounded bg-border-dark text-neutral-400 font-mono">{t('shortcuts.pressP')}</span>
				</button>
			</div>
		</div>
	)
}

