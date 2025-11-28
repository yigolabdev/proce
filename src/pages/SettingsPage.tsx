import { useI18n } from '../i18n/I18nProvider'
import { useTheme } from '../theme/ThemeProvider'
import { PageHeader } from '../components/common/PageHeader'
import { Card, CardContent } from '../components/ui/Card'
import { Globe, Moon, Sun, Check } from 'lucide-react'

export default function SettingsPage() {
	const { locale, setLocale } = useI18n()
	const { theme, setTheme } = useTheme()
	
	return (
		<div className="min-h-screen bg-neutral-50 dark:bg-background-dark text-neutral-900 dark:text-neutral-100">
			<div className="max-w-[1600px] mx-auto px-6 py-6 space-y-8">
				<PageHeader
					title="Settings"
					description="Preferences for your workspace"
				/>

				<div className="grid gap-6 max-w-2xl">
					<Card className="bg-surface-dark border-border-dark">
						<CardContent className="p-6 flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div className="p-3 rounded-2xl bg-surface-dark text-neutral-400">
									<Globe className="h-6 w-6" />
								</div>
								<div>
									<h3 className="font-bold text-white">Language</h3>
									<p className="text-sm text-neutral-400">Select your preferred language</p>
								</div>
							</div>
							<div className="flex bg-surface-dark p-1 rounded-xl border border-border-dark">
								<button 
									className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
										locale === 'en' 
											? 'bg-border-dark text-white shadow-sm' 
											: 'text-neutral-400 hover:text-white'
									}`}  
									onClick={() => setLocale('en')}
								>
									{locale === 'en' && <Check className="h-3 w-3" />}
									English
								</button>
								<button 
									className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
										locale === 'ko' 
											? 'bg-border-dark text-white shadow-sm' 
											: 'text-neutral-400 hover:text-white'
									}`} 
									onClick={() => setLocale('ko')}
								>
									{locale === 'ko' && <Check className="h-3 w-3" />}
									한국어
								</button>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-surface-dark border-border-dark">
						<CardContent className="p-6 flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div className="p-3 rounded-2xl bg-surface-dark text-neutral-400">
									{theme === 'dark' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
								</div>
								<div>
									<h3 className="font-bold text-white">Theme</h3>
									<p className="text-sm text-neutral-400">Choose your interface appearance</p>
								</div>
							</div>
							<div className="flex bg-surface-dark p-1 rounded-xl border border-border-dark">
								<button 
									className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
										theme === 'light' 
											? 'bg-border-dark text-white shadow-sm' 
											: 'text-neutral-400 hover:text-white'
									}`} 
									onClick={() => setTheme('light')}
								>
									<Sun className="h-4 w-4" />
									Light
								</button>
								<button 
									className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
										theme === 'dark' 
											? 'bg-border-dark text-white shadow-sm' 
											: 'text-neutral-400 hover:text-white'
									}`} 
									onClick={() => setTheme('dark')}
								>
									<Moon className="h-4 w-4" />
									Dark
								</button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}
