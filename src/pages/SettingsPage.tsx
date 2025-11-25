import { useI18n } from '../i18n/I18nProvider'
import { useTheme } from '../theme/ThemeProvider'
import { PageHeader } from '../components/common/PageHeader'
import { Settings as SettingsIcon } from 'lucide-react'

export default function SettingsPage() {
	const { locale, setLocale } = useI18n()
	const { theme, setTheme } = useTheme()
	return (
		<div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
			<PageHeader
				title="Settings"
				description="Preferences for your workspace"
				icon={SettingsIcon}
			/>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4 sm:space-y-6">
			<div className="grid gap-4">
				<div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4">
					<label className="block text-sm">Language</label>
					<div className="mt-2 flex gap-2">
						<button className={`rounded-2xl border px-3 py-1.5 ${locale === 'en' ? 'bg-neutral-100 dark:bg-neutral-900' : ''}`} onClick={() => setLocale('en')}>EN</button>
						<button className={`rounded-2xl border px-3 py-1.5 ${locale === 'ko' ? 'bg-neutral-100 dark:bg-neutral-900' : ''}`} onClick={() => setLocale('ko')}>KR</button>
					</div>
				</div>
				<div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4">
					<label className="block text-sm">Theme</label>
					<div className="mt-2 flex gap-2">
						<button className={`rounded-2xl border px-3 py-1.5 ${theme === 'light' ? 'bg-neutral-100 dark:bg-neutral-900' : ''}`} onClick={() => setTheme('light')}>Light</button>
						<button className={`rounded-2xl border px-3 py-1.5 ${theme === 'dark' ? 'bg-neutral-100 dark:bg-neutral-900' : ''}`} onClick={() => setTheme('dark')}>Dark</button>
					</div>
				</div>
			</div>
			</div>
		</div>
	)
}
