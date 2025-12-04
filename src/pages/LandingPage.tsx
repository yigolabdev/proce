import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Eye, EyeOff, Quote, Loader2, Shield, Users, Briefcase } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { signInWithPassword } from '../app/auth/_mocks/authApi'
import { track } from '../lib/analytics'
import { useAuth } from '../context/AuthContext'
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
			toast.error('Please enter a valid email address.')
			return
		}
		if (!password) {
			toast.error('Please enter your password.')
			return
		}

		try {
			setSubmitting(true)
			track('sign_in_start', { method: 'password' })
			const res = await signInWithPassword(clean, password)
			
			if (!res.ok) {
				track('sign_in_error', { error: res.error })
				toast.error('Invalid email or password.')
				return
			}
			
			track('sign_in_success')
			try { window.localStorage.setItem('proce:remember', JSON.stringify({ email: clean })) } catch {}
			
			navigate('/app/dashboard')
		} catch (error) {
			toast.error('An error occurred during sign in.')
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
		<div className="min-h-screen bg-[#050505] text-white flex overflow-hidden">
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

			{/* Left Section - Content */}
			<div className="flex-1 flex flex-col p-8 lg:p-12 xl:p-16 relative z-10">
				{/* Logo */}
				<div className="flex items-center gap-2 mb-auto">
					<div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-black font-bold text-xs">
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							<path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							<path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
						</svg>
					</div>
					<span className="font-bold text-xl tracking-tight">Proce</span>
				</div>

				{/* Main Content Wrapper */}
				<div className="w-full max-w-md mx-auto">
					{/* Quote Section */}
					<div className="mb-16">
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
								placeholder="Enter your email"
								className="w-full h-12 px-4 bg-neutral-800/50 border border-neutral-800 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
							/>
							
							<div className="relative">
								<input
									type={showPassword ? 'text' : 'password'}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Password"
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
								Forgot Password?
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
								'Sign in'
							)}
						</Button>

						<div className="relative py-4">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-neutral-800"></div>
							</div>
							<div className="relative flex justify-center">
								<span className="bg-[#050505] px-4 text-sm text-neutral-500">or continue with</span>
							</div>
						</div>

						<div className="text-center">
							<button
								type="button"
								onClick={() => navigate('/auth/sign-up')}
								className="text-sm text-neutral-400 hover:text-white transition-colors"
							>
								Don't have an account yet?
							</button>
						</div>
					</form>
				</div>

				<div className="mt-auto"></div>
			</div>

			{/* Right Section - Image */}
			<div className="hidden lg:block lg:w-[55%] p-4 pl-0">
				<div className="w-full h-full rounded-3xl overflow-hidden relative">
					<img 
						src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2670&auto=format&fit=crop" 
						alt="Office Interior" 
						className="w-full h-full object-cover"
					/>
					{/* Gradient Overlay for better text readability if needed, though image is distinct */}
					<div className="absolute inset-0 bg-black/10"></div>
				</div>
			</div>
		</div>
	)
}
