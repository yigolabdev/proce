/**
 * LanguageSettings Component
 * 언어 설정
 */

import { Card, CardContent } from '../ui/Card'
import { Globe, Check } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'

export function LanguageSettings() {
	const { locale, setLocale, t } = useI18n()

	return (
		<Card className="bg-surface-dark border-border-dark">
			<CardContent className="p-6 flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div className="p-3 rounded-2xl bg-neutral-800 text-neutral-400">
						<Globe className="h-6 w-6" />
					</div>
					<div>
						<h3 className="font-bold text-white">{t('common.settings.language.title')}</h3>
						<p className="text-sm text-neutral-400">{t('common.settings.language.description')}</p>
					</div>
				</div>
				<div className="flex bg-neutral-900 p-1 rounded-xl border border-border-dark">
					<button
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
							locale === 'en'
								? 'bg-neutral-800 text-white shadow-sm'
								: 'text-neutral-400 hover:text-white'
						}`}
						onClick={() => setLocale('en')}
					>
						{locale === 'en' && <Check className="h-3 w-3" />}
						{t('common.settings.language.english')}
					</button>
					<button
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
							locale === 'ko'
								? 'bg-neutral-800 text-white shadow-sm'
								: 'text-neutral-400 hover:text-white'
						}`}
						onClick={() => setLocale('ko')}
					>
						{locale === 'ko' && <Check className="h-3 w-3" />}
						{t('common.settings.language.korean')}
					</button>
				</div>
			</CardContent>
		</Card>
	)
}

