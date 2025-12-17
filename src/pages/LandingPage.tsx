import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Eye, EyeOff, Quote, Loader2, Shield, Users, Briefcase, Languages } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { signInWithPassword } from '../app/auth/_mocks/authApi'
import { track } from '../lib/analytics'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../i18n/I18nProvider'
import { authI18n } from '../app/auth/_i18n/auth.i18n'
import type { UserRole } from '../types/auth.types'

const DAILY_QUOTES = [
	{
		main: "Start your day with balance.",
		sub: "Just add a warm cup of coffee for perfect harmony."
	},
	{
		main: "Designing the future with data.",
		sub: "Today's records become tomorrow's growth."
	},
	{
		main: "Achievements shine brighter together.",
		sub: "Team passion gathers to create innovation."
	},
	{
		main: "The beginning of smart work.",
		sub: "A wise choice to reduce complexity and increase efficiency."
	},
	{
		main: "A sure step towards your goals.",
		sub: "Data turns your intuition into certainty."
	}
]

function validateEmail(email: string) {
	const clean = email.trim().toLowerCase()
	const EMAIL_REGEX = /^(?:[a-zA-Z0-9_'^&+-])+(?:\.(?:[a-zA-Z0-9_'^&+-])+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/
	return EMAIL_REGEX.test(clean)
}

export default function LandingPage() {
	const navigate = useNavigate()
	const { login } = useAuth()
	const { locale, setLocale } = useI18n() // t not used
	const tt = useMemo(() => authI18n[locale as keyof typeof authI18n], [locale])
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [isSubmitting, setSubmitting] = useState(false)

	// Select quote based on date
	const todayQuote = useMemo(() => {
		const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24)
		return DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length]
	}, [])

	// Load saved email
	useEffect(() => {
		try {
			const saved = window.localStorage.getItem('proce:remember')
			if (saved) {
				const { email: savedEmail } = JSON.parse(saved)
				if (savedEmail) {
					setEmail(savedEmail)
				}
			}
		} catch {}
	}, [])

	async function handleSignIn(e: React.FormEvent) {
		e.preventDefault()
		
		const clean = email.trim().toLowerCase()
		if (!validateEmail(clean)) {
			toast.error(tt.errors.enterValidEmail)
			return
		}
		if (!password) {
			toast.error(tt.errors.enterPassword)
			return
		}

		try {
			setSubmitting(true)
			track('sign_in_start', { method: 'password' })
			const res = await signInWithPassword(clean, password)
			
			if (!res.ok) {
				track('sign_in_error', { error: res.error })
				toast.error(tt.errors.invalidCredentials)
				return
			}
			
			track('sign_in_success')
			try { window.localStorage.setItem('proce:remember', JSON.stringify({ email: clean })) } catch {}
			
			navigate('/app/dashboard')
		} catch (error) {
			toast.error(tt.errors.signInError)
		} finally {
			setSubmitting(false)
		}
	}

	const handleQuickLogin = (role: UserRole) => {
		const mockUsers = {
			user: {
				id: '1',
				email: 'user@test.com',
				name: 'John Doe',
				role: 'user' as UserRole,
				department: 'Development',
				position: 'Senior Developer',
			},
			admin: {
				id: '2',
				email: 'admin@test.com',
				name: 'Admin User',
				role: 'admin' as UserRole,
				department: 'IT',
				position: 'System Admin',
			},
			executive: {
				id: '3',
				email: 'executive@test.com',
				name: 'Executive User',
				role: 'executive' as UserRole,
				department: 'Management',
				position: 'CFO',
			},
		}

		login(mockUsers[role])
		navigate('/app/dashboard')
	}

	return (
		<div className="min-h-screen bg-[#050505] text-white flex items-center justify-center overflow-hidden">
			{/* Quick Login Buttons */}
			<div className="fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-neutral-900/90 backdrop-blur-sm p-2 rounded-full border border-neutral-800 shadow-lg">
				<button
					onClick={() => handleQuickLogin('user')}
					className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-full bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors"
				>
					<Users className="h-3 w-3" />
					<span>User</span>
				</button>
				<button
					onClick={() => handleQuickLogin('admin')}
					className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-full bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors"
				>
					<Shield className="h-3 w-3" />
					<span>Admin</span>
				</button>
				<button
					onClick={() => handleQuickLogin('executive')}
					className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-full bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors"
				>
					<Briefcase className="h-3 w-3" />
					<span>Executive</span>
				</button>
			</div>

			{/* Main Content - Centered */}
			<div className="w-full max-w-md px-8">
				{/* Logo and Language Switcher */}
				<div className="flex items-center justify-between mb-12">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg p-1.5">
							<img 
								src="/proce-logo.png" 
								alt="Proce Logo" 
								className="w-full h-full object-contain filter brightness-0 invert"
							/>
						</div>
						<span className="font-bold text-2xl tracking-tight">Proce</span>
					</div>
					
					{/* Language Switcher - Next to Logo */}
					<button
						onClick={() => setLocale(locale === 'en' ? 'ko' : 'en')}
						className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full bg-neutral-900/90 backdrop-blur-sm border border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors shadow-lg"
						aria-label="toggle language"
					>
						<Languages size={14} />
						<span className="text-xs">{locale === 'ko' ? 'EN' : '한글'}</span>
					</button>
				</div>

				{/* Quote Section */}
				<div className="mb-12">
					<Quote className="h-8 w-8 text-neutral-500 mb-6 opacity-50" />
					<h1 className="text-3xl lg:text-4xl font-light leading-tight text-neutral-200">
						{todayQuote.main}<br />
						<span className="text-neutral-400">{todayQuote.sub}</span>
					</h1>
				</div>

				{/* Login Form */}
				<form onSubmit={handleSignIn} className="space-y-4">
					<div className="space-y-4">
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder={tt.landingPage.enterEmail}
							className="w-full h-12 px-4 bg-neutral-800/50 border border-neutral-800 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
						/>
						
						<div className="relative">
							<input
								type={showPassword ? 'text' : 'password'}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder={tt.password}
								className="w-full h-12 px-4 bg-neutral-800/50 border border-neutral-800 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all pr-12"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
							>
								{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
							</button>
						</div>
					</div>

					<div className="flex justify-start py-1">
						<button 
							type="button"
							onClick={() => navigate('/auth/forgot-password')}
							className="text-sm text-neutral-400 hover:text-white transition-colors"
						>
							{tt.landingPage.forgotPassword}
						</button>
					</div>

					<Button 
						type="submit" 
						disabled={isSubmitting}
						variant="brand"
						size="lg"
						className="w-full"
					>
						{isSubmitting ? (
							<Loader2 className="h-5 w-5 animate-spin" />
						) : (
							tt.signIn
						)}
					</Button>

					<div className="relative py-4">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-neutral-800"></div>
						</div>
						<div className="relative flex justify-center">
							<span className="bg-[#050505] px-4 text-sm text-neutral-500">{tt.landingPage.orContinueWith}</span>
						</div>
					</div>

					<div className="text-center">
						<button
							type="button"
							onClick={() => navigate('/auth/sign-up')}
							className="text-sm text-neutral-400 hover:text-white transition-colors"
						>
							{tt.landingPage.noAccount}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
