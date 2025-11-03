import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '../../../components/ui/Card'
import Input from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { Users, ArrowLeft, Key, Building2, Mail, Lock, User, Phone } from 'lucide-react'
import { toast } from 'sonner'

interface EmployeeData {
	inviteCode: string
	name: string
	email: string
	password: string
	passwordConfirm: string
	phone: string
	department: string
	position: string
}

export default function EmployeeSignUpPage() {
	const navigate = useNavigate()
	const [step, setStep] = useState(1) // 1: 초대코드, 2: 직원정보
	const [data, setData] = useState<EmployeeData>({
		inviteCode: '',
		name: '',
		email: '',
		password: '',
		passwordConfirm: '',
		phone: '',
		department: '',
		position: '',
	})
	const [companyInfo, setCompanyInfo] = useState<{ name: string; industry: string } | null>(null)

	const handleChange = (field: keyof EmployeeData, value: string) => {
		setData((prev) => ({ ...prev, [field]: value }))
	}

	const handleVerifyCode = async () => {
		if (!data.inviteCode) {
			toast.error('초대 코드를 입력해주세요')
			return
		}

		// Mock API call - 초대 코드 검증
		if (data.inviteCode.length < 6) {
			toast.error('올바른 초대 코드를 입력해주세요')
			return
		}

		// Mock company info
		setCompanyInfo({
			name: '(주)테크컴퍼니',
			industry: 'IT/소프트웨어',
		})
		toast.success('초대 코드가 확인되었습니다')
		setStep(2)
	}

	const handleSubmit = async () => {
		if (!data.name || !data.email || !data.password) {
			toast.error('필수 항목을 입력해주세요')
			return
		}
		if (data.password !== data.passwordConfirm) {
			toast.error('비밀번호가 일치하지 않습니다')
			return
		}

		// Mock API call
		toast.success('직원 회원가입이 완료되었습니다!')
		setTimeout(() => {
			navigate('/dashboard')
		}, 1500)
	}

	return (
		<div className="mx-auto min-h-dvh w-full max-w-2xl px-4 py-12">
			<div className="mb-8">
				<button
					onClick={() => step === 1 ? navigate('/auth/sign-up') : setStep(1)}
					className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors mb-4"
				>
					<ArrowLeft className="h-4 w-4" />
					이전
				</button>
				<h1 className="text-3xl font-bold flex items-center gap-3">
					<Users className="h-8 w-8 text-green-600 dark:text-green-400" />
					직원 회원가입
				</h1>
				<p className="mt-2 text-neutral-600 dark:text-neutral-300">
					관리자로부터 받은 초대 코드로 가입하세요
				</p>
			</div>

			<Card>
				<CardHeader>
					<h2 className="text-xl font-bold">
						{step === 1 && '초대 코드 입력'}
						{step === 2 && '직원 정보 입력'}
					</h2>
				</CardHeader>
				<CardContent>
					{/* Step 1: Invite Code */}
					{step === 1 && (
						<div className="space-y-6">
							<div className="text-center py-8">
								<div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
									<Key className="h-10 w-10 text-green-600 dark:text-green-400" />
								</div>
								<p className="text-neutral-600 dark:text-neutral-400 mb-6">
									회사 관리자로부터 받은 초대 코드를 입력해주세요
								</p>
							</div>

							<div>
								<label className="block text-sm font-medium mb-2">
									초대 코드 <span className="text-red-500">*</span>
								</label>
								<Input
									type="text"
									placeholder="예: ABC12345"
									value={data.inviteCode}
									onChange={(e) => handleChange('inviteCode', e.target.value.toUpperCase())}
									className="text-center text-lg font-mono tracking-wider"
								/>
								<p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
									초대 코드는 대소문자를 구분하지 않습니다
								</p>
							</div>

							<Button onClick={handleVerifyCode} className="w-full">
								초대 코드 확인
							</Button>
						</div>
					)}

					{/* Step 2: Employee Info */}
					{step === 2 && (
						<div className="space-y-6">
							{/* Company Info Display */}
							{companyInfo && (
								<div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl">
									<div className="flex items-center gap-3 mb-2">
										<Building2 className="h-5 w-5 text-green-600 dark:text-green-400" />
										<span className="font-bold text-green-900 dark:text-green-100">
											{companyInfo.name}
										</span>
									</div>
									<p className="text-sm text-green-700 dark:text-green-300">
										{companyInfo.industry}
									</p>
								</div>
							)}

							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium mb-2">
										<User className="inline h-4 w-4 mr-1" />
										이름 <span className="text-red-500">*</span>
									</label>
									<Input
										type="text"
										placeholder="이름을 입력하세요"
										value={data.name}
										onChange={(e) => handleChange('name', e.target.value)}
									/>
								</div>

								<div>
									<label className="block text-sm font-medium mb-2">
										<Mail className="inline h-4 w-4 mr-1" />
										이메일 <span className="text-red-500">*</span>
									</label>
									<Input
										type="email"
										placeholder="your.email@company.com"
										value={data.email}
										onChange={(e) => handleChange('email', e.target.value)}
									/>
								</div>

								<div>
									<label className="block text-sm font-medium mb-2">
										<Lock className="inline h-4 w-4 mr-1" />
										비밀번호 <span className="text-red-500">*</span>
									</label>
									<Input
										type="password"
										placeholder="8자 이상 입력하세요"
										value={data.password}
										onChange={(e) => handleChange('password', e.target.value)}
									/>
								</div>

								<div>
									<label className="block text-sm font-medium mb-2">
										<Lock className="inline h-4 w-4 mr-1" />
										비밀번호 확인 <span className="text-red-500">*</span>
									</label>
									<Input
										type="password"
										placeholder="비밀번호를 다시 입력하세요"
										value={data.passwordConfirm}
										onChange={(e) => handleChange('passwordConfirm', e.target.value)}
									/>
								</div>

								<div>
									<label className="block text-sm font-medium mb-2">
										<Phone className="inline h-4 w-4 mr-1" />
										연락처
									</label>
									<Input
										type="tel"
										placeholder="010-0000-0000"
										value={data.phone}
										onChange={(e) => handleChange('phone', e.target.value)}
									/>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium mb-2">부서</label>
										<Input
											type="text"
											placeholder="예: 개발팀"
											value={data.department}
											onChange={(e) => handleChange('department', e.target.value)}
										/>
									</div>
									<div>
										<label className="block text-sm font-medium mb-2">직급</label>
										<Input
											type="text"
											placeholder="예: 대리"
											value={data.position}
											onChange={(e) => handleChange('position', e.target.value)}
										/>
									</div>
								</div>
							</div>

							<Button onClick={handleSubmit} className="w-full mt-6">
								가입 완료
							</Button>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}

