import { useNavigate } from 'react-router-dom'
import SignInForm from '../app/auth/_components/SignInForm'
import Toaster from '../components/ui/Toaster'
import { useAuth } from '../context/AuthContext'
import { Shield, Users, Briefcase } from 'lucide-react'
import type { UserRole } from '../types/auth.types'

export default function LandingPage() {
	const navigate = useNavigate()
	const { login } = useAuth()

	const handleQuickLogin = (role: UserRole) => {
		const mockUsers = {
			worker: {
				id: '1',
				email: 'worker@test.com',
				name: '홍길동',
				role: 'worker' as UserRole,
				department: '개발팀',
				position: '시니어 개발자',
			},
			admin: {
				id: '2',
				email: 'admin@test.com',
				name: '이철수',
				role: 'admin' as UserRole,
				department: 'IT팀',
				position: '시스템 관리자',
			},
			executive: {
				id: '3',
				email: 'executive@test.com',
				name: '김영희',
				role: 'executive' as UserRole,
				department: '경영지원팀',
				position: 'CFO',
			},
		}

		login(mockUsers[role])
		navigate('/app/dashboard')
	}

	return (
		<div className="flex min-h-dvh items-center justify-center bg-neutral-50 dark:bg-neutral-950 relative">
			{/* Test Login Buttons - Fixed Bottom Left */}
			<div className="fixed bottom-4 left-4 z-50 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-4">
				<div className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-3">
					🧪 Test Login
				</div>
				<div className="flex flex-col gap-2">
					<button
						onClick={() => handleQuickLogin('worker')}
						className="flex items-center gap-2 px-3 py-2 text-xs rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
					>
						<Users className="h-3 w-3" />
						<span>Worker</span>
					</button>
					<button
						onClick={() => handleQuickLogin('admin')}
						className="flex items-center gap-2 px-3 py-2 text-xs rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
					>
						<Shield className="h-3 w-3" />
						<span>Admin</span>
					</button>
					<button
						onClick={() => handleQuickLogin('executive')}
						className="flex items-center gap-2 px-3 py-2 text-xs rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
					>
						<Briefcase className="h-3 w-3" />
						<span>Executive</span>
					</button>
				</div>
			</div>

			{/* Center: Login Form */}
			<div className="w-full max-w-md px-4">
				{/* Service Name */}
				<div className="mb-12 text-center">
					<h1 className="text-5xl font-bold tracking-tight mb-3">Proce</h1>
					<p className="text-neutral-600 dark:text-neutral-400">
						Data-Driven Decision Platform
					</p>
				</div>

				<SignInForm />
			</div>
			<Toaster />
		</div>
	)
}
