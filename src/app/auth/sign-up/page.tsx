import { useNavigate } from 'react-router-dom'
import { Card } from '../../../components/ui/Card'
import { Building2, Users, ArrowRight, Home, Languages } from 'lucide-react'
import Toaster from '../../../components/ui/Toaster'
import { useI18n } from '../../../i18n/I18nProvider'
import { signupI18n } from './_i18n/signup.i18n'
import { useMemo } from 'react'

export default function SignUpPage() {
	const navigate = useNavigate()
	const { locale, setLocale } = useI18n()
	const t = useMemo(() => signupI18n[locale as keyof typeof signupI18n], [locale])

	return (
		<div className="mx-auto min-h-dvh w-full max-w-4xl px-4 py-12">
			{/* Top Bar: Home Button and Language Switcher */}
			<div className="mb-6 flex items-center justify-between">
				<button
					onClick={() => navigate('/')}
					className="flex items-center gap-2 text-sm text-neutral-400 hover:text-primary transition-colors"
				>
					<Home className="h-4 w-4" />
					<span>{t.backToHome}</span>
				</button>
				
				{/* Language Switcher */}
				<button
					onClick={() => setLocale(locale === 'en' ? 'ko' : 'en')}
					className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full bg-neutral-900/90 backdrop-blur-sm border border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
					aria-label="toggle language"
				>
					<Languages size={14} />
					<span className="text-xs">{locale === 'ko' ? 'EN' : '한글'}</span>
				</button>
			</div>

		<div className="mb-8 text-center">
			<h1 className="text-3xl font-bold">{t.signUp}</h1>
			<p className="mt-2 text-neutral-300">
				{t.chooseAccountType}
			</p>
		</div>

			<div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
				{/* Company Registration */}
				<Card className="p-6 hover:shadow-lg transition-shadow">
					<div className="flex items-center gap-3 mb-6">
						<div className="rounded-2xl bg-primary/10 p-3">
							<Building2 className="h-6 w-6 text-primary" />
						</div>
						<div>
							<h2 className="text-xl font-bold">{t.company.title}</h2>
							<p className="text-sm text-neutral-400">{t.company.description}</p>
						</div>
					</div>

					<ul className="space-y-3 mb-8">
						<li className="flex items-start gap-3 text-sm">
							<span className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-medium">1</span>
							<span className="text-neutral-300">{t.company.step1}</span>
						</li>
						<li className="flex items-start gap-3 text-sm">
							<span className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-medium">2</span>
							<span className="text-neutral-300">{t.company.step2}</span>
						</li>
						<li className="flex items-start gap-3 text-sm">
							<span className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-medium">3</span>
							<span className="text-neutral-300">{t.company.step3}</span>
						</li>
					</ul>

					<button
						onClick={() => navigate('/auth/company-signup')}
						className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary text-white px-5 py-3 font-medium transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
					>
						<span>{t.company.cta}</span>
						<ArrowRight className="h-5 w-5" />
					</button>
				</Card>

			{/* Employee Registration */}
			<Card className="p-6 hover:shadow-lg transition-shadow">
				<div className="flex items-center gap-3 mb-6">
					<div className="rounded-2xl bg-green-900/30 p-3">
						<Users className="h-6 w-6 text-green-400" />
					</div>
					<div>
						<h2 className="text-xl font-bold">{t.employee.title}</h2>
						<p className="text-sm text-neutral-400">{t.employee.description}</p>
					</div>
				</div>

				<ul className="space-y-3 mb-8">
					<li className="flex items-start gap-3 text-sm">
						<span className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-green-900/30 text-green-400 text-xs font-medium">1</span>
						<span className="text-neutral-300">{t.employee.step1}</span>
					</li>
					<li className="flex items-start gap-3 text-sm">
						<span className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-green-900/30 text-green-400 text-xs font-medium">2</span>
						<span className="text-neutral-300">{t.employee.step2}</span>
					</li>
					<li className="flex items-start gap-3 text-sm">
						<span className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-green-900/30 text-green-400 text-xs font-medium">3</span>
						<span className="text-neutral-300">{t.employee.step3}</span>
					</li>
				</ul>

				<button
					onClick={() => navigate('/auth/employee-signup')}
					className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-green-800 text-green-400 px-5 py-3 font-medium transition-all hover:bg-green-900/20 hover:scale-[1.02] active:scale-[0.98]"
				>
					<span>{t.employee.cta}</span>
					<ArrowRight className="h-5 w-5" />
				</button>
			</Card>
			</div>

		<div className="mt-8 text-center">
			<p className="text-sm text-neutral-400">
				{t.alreadyHaveAccount}{' '}
				<button
					onClick={() => navigate('/')}
					className="text-primary hover:underline font-medium"
				>
					{t.signIn}
				</button>
			</p>
		</div>

			<Toaster />
		</div>
	)
}
