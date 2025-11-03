import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../../../components/ui/Card'
import Input from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { toast } from 'sonner'
import { Sun, Moon, Languages, Loader2 } from 'lucide-react'
import { authI18n } from '../_i18n/auth.i18n'
import { useI18n } from '../../../i18n/I18nProvider'
import { useTheme } from '../../../theme/ThemeProvider'
import { track } from '../../../lib/analytics'
import { signInWithPassword } from '../_mocks/authApi'

function validateEmail(email: string) {
	const clean = email.trim().toLowerCase()
	const EMAIL_REGEX = /^(?:[a-zA-Z0-9_'^&+-])+(?:\.(?:[a-zA-Z0-9_'^&+-])+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/
	return EMAIL_REGEX.test(clean)
}

export default function SignInForm() {
	const navigate = useNavigate()
	const { locale, setLocale, t } = useI18n()
	const tt = useMemo(() => t(authI18n), [t, locale])
	const { theme, toggle } = useTheme()

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [remember, setRemember] = useState(false)
	const [emailError, setEmailError] = useState<string | undefined>()
	const [isSubmitting, setSubmitting] = useState(false)

	// Load saved email
	useEffect(() => {
		try {
			const saved = window.localStorage.getItem('proce:remember')
			if (saved) {
				const { email: savedEmail } = JSON.parse(saved)
				if (savedEmail) {
					setEmail(savedEmail)
					setRemember(true)
				}
			}
		} catch {}
	}, [])

	async function onSignInPassword() {
		setEmailError(undefined)
		const clean = email.trim().toLowerCase()
		if (!validateEmail(clean)) {
			setEmailError(tt('errors.invalidEmail'))
			return
		}
		if (!password) {
			toast.error('Please enter your password')
			return
		}
		try {
			setSubmitting(true)
			track('sign_in_start', { method: 'password' })
			const res = await signInWithPassword(clean, password)
			if (!res.ok) {
				track('sign_in_error', { error: res.error })
				toast.error(tt('errors.invalidCredentials'))
				return
			}
			track('sign_in_success')
			if (remember) {
				try { window.localStorage.setItem('proce:remember', JSON.stringify({ email: clean })) } catch {}
			} else {
				try { window.localStorage.removeItem('proce:remember') } catch {}
			}
			navigate('/app/dashboard')
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<div className="w-full" id="signin">
			{/* Theme/Language toggles - Fixed top right */}
			<div className="fixed right-4 top-4 z-50 flex items-center gap-2">
				<button
					className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur px-3 py-1.5 text-xs hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors shadow-sm"
					onClick={() => setLocale(locale === 'en' ? 'ko' : 'en')}
					aria-label="toggle language"
				>
					<Languages size={12} />
					<span>{locale.toUpperCase()}</span>
				</button>
				<button
					className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur px-3 py-1.5 text-xs hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors shadow-sm"
					onClick={() => toggle()}
					aria-label="toggle theme"
				>
					{theme === 'dark' ? <Sun size={12} /> : <Moon size={12} />}
				</button>
			</div>

			<Card className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl">
				<CardContent className="p-8">
					{/* Email/Password Form */}
					<form
						onSubmit={(e) => {
							e.preventDefault()
							onSignInPassword()
						}}
						className="space-y-5"
					>
						<div className="min-h-[76px]">
							<Input
								id="email"
								type="email"
								placeholder="Email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								error={emailError}
								aria-invalid={Boolean(emailError)}
								aria-describedby={emailError ? 'email-error' : undefined}
								className="h-11"
							/>
						</div>

						<div className="min-h-[44px]">
							<Input
								id="password"
								type="password"
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="h-11"
							/>
						</div>

						<div className="flex items-center justify-between text-sm pt-2">
							<label className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 cursor-pointer">
								<input
									type="checkbox"
									checked={remember}
									onChange={(e) => setRemember(e.target.checked)}
									className="rounded border-neutral-300 dark:border-neutral-700"
								/>
								Remember me
							</label>
							<button
								type="button"
								onClick={() => navigate('/auth/forgot-password')}
								className="text-primary hover:underline"
							>
								Forgot password?
							</button>
						</div>

						<Button type="submit" disabled={isSubmitting} className="w-full justify-center h-11 mt-4">
							{isSubmitting && <Loader2 size={16} className="mr-2 animate-spin" />}
							Sign In
						</Button>
					</form>

					{/* Footer */}
					<div className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
						Don't have an account?{' '}
						<a href="/auth/sign-up" className="text-primary font-medium hover:underline">
							Sign Up
						</a>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
