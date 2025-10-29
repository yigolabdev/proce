import { useNavigate } from 'react-router-dom'
import { Card } from '../../../components/ui/Card'
import { Building2, Users, ArrowRight, Home } from 'lucide-react'
import Toaster from '../../../components/ui/Toaster'

export default function SignUpPage() {
	const navigate = useNavigate()

	return (
		<div className="mx-auto min-h-dvh w-full max-w-4xl px-4 py-12">
			{/* Home Button */}
			<div className="mb-6">
				<button
					onClick={() => navigate('/')}
					className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary transition-colors"
				>
					<Home className="h-4 w-4" />
					<span>Back to Home</span>
				</button>
			</div>

			<div className="mb-8 text-center">
				<h1 className="text-3xl font-bold">회원가입</h1>
				<p className="mt-2 text-neutral-600 dark:text-neutral-300">
					가입 유형을 선택해주세요
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
							<h2 className="text-xl font-bold">기업 가입</h2>
							<p className="text-sm text-neutral-600 dark:text-neutral-400">회사 관리자용</p>
						</div>
					</div>

					<ul className="space-y-3 mb-8">
						<li className="flex items-start gap-3 text-sm">
							<span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-medium">1</span>
							<span className="text-neutral-700 dark:text-neutral-300">회사 정보 등록</span>
						</li>
						<li className="flex items-start gap-3 text-sm">
							<span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-medium">2</span>
							<span className="text-neutral-700 dark:text-neutral-300">관리자 계정 생성</span>
						</li>
						<li className="flex items-start gap-3 text-sm">
							<span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-medium">3</span>
							<span className="text-neutral-700 dark:text-neutral-300">직원 초대 코드 발급</span>
						</li>
					</ul>

					<button
						onClick={() => navigate('/auth/company-signup')}
						className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary text-white px-5 py-3 font-medium transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
					>
						<span>기업 회원가입</span>
						<ArrowRight className="h-5 w-5" />
					</button>
				</Card>

				{/* Employee Registration */}
				<Card className="p-6 hover:shadow-lg transition-shadow">
					<div className="flex items-center gap-3 mb-6">
						<div className="rounded-2xl bg-green-100 dark:bg-green-900/30 p-3">
							<Users className="h-6 w-6 text-green-600 dark:text-green-400" />
						</div>
						<div>
							<h2 className="text-xl font-bold">직원 가입</h2>
							<p className="text-sm text-neutral-600 dark:text-neutral-400">직원용</p>
						</div>
					</div>

					<ul className="space-y-3 mb-8">
						<li className="flex items-start gap-3 text-sm">
							<span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium">1</span>
							<span className="text-neutral-700 dark:text-neutral-300">관리자로부터 초대 코드 받기</span>
						</li>
						<li className="flex items-start gap-3 text-sm">
							<span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium">2</span>
							<span className="text-neutral-700 dark:text-neutral-300">초대 코드로 가입하기</span>
						</li>
						<li className="flex items-start gap-3 text-sm">
							<span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium">3</span>
							<span className="text-neutral-700 dark:text-neutral-300">회사 워크스페이스에서 업무 시작</span>
						</li>
					</ul>

					<button
						onClick={() => navigate('/auth/employee-signup')}
						className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-5 py-3 font-medium transition-all hover:bg-green-50 dark:hover:bg-green-900/20 hover:scale-[1.02] active:scale-[0.98]"
					>
						<span>직원 회원가입</span>
						<ArrowRight className="h-5 w-5" />
					</button>
				</Card>
			</div>

			<div className="mt-8 text-center">
				<p className="text-sm text-neutral-600 dark:text-neutral-400">
					이미 계정이 있으신가요?{' '}
					<button
						onClick={() => navigate('/auth/sign-in')}
						className="text-primary hover:underline font-medium"
					>
						로그인
					</button>
				</p>
			</div>

			<Toaster />
		</div>
	)
}
