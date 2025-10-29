import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '../../../components/ui/Card'
import Input from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { Building2, ArrowRight, ArrowLeft, Check, Home } from 'lucide-react'
import { toast } from 'sonner'
import Toaster from '../../../components/ui/Toaster'

interface CompanyData {
	// 회사 정보
	companyName: string
	businessNumber: string
	industry: string
	employeeCount: string
	// 관리자 정보
	adminName: string
	adminEmail: string
	adminPassword: string
	adminPasswordConfirm: string
	adminPhone: string
}

export default function CompanySignUpPage() {
	const navigate = useNavigate()
	const [step, setStep] = useState(1)
	const [data, setData] = useState<CompanyData>({
		companyName: '',
		businessNumber: '',
		industry: '',
		employeeCount: '',
		adminName: '',
		adminEmail: '',
		adminPassword: '',
		adminPasswordConfirm: '',
		adminPhone: '',
	})

	const handleChange = (field: keyof CompanyData, value: string) => {
		setData((prev) => ({ ...prev, [field]: value }))
	}

	const handleNext = () => {
		if (step === 1) {
			if (!data.companyName || !data.businessNumber) {
				toast.error('필수 항목을 입력해주세요')
				return
			}
		} else if (step === 2) {
			if (!data.adminName || !data.adminEmail || !data.adminPassword) {
				toast.error('필수 항목을 입력해주세요')
				return
			}
			if (data.adminPassword !== data.adminPasswordConfirm) {
				toast.error('비밀번호가 일치하지 않습니다')
				return
			}
		}
		setStep(step + 1)
	}

	const handleSubmit = async () => {
		// Mock API call
		toast.success('기업 회원가입이 완료되었습니다!')
		
		// 초대 코드 생성 (Mock)
		const inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase()
		
		// 초대 코드 표시
		toast.success(`직원 초대 코드: ${inviteCode}`, { duration: 10000 })
		
		// 대시보드로 이동
		setTimeout(() => {
			navigate('/dashboard')
		}, 2000)
	}

	return (
		<div className="mx-auto min-h-dvh w-full bg-neutral-50 dark:bg-neutral-950">
			<div className="mx-auto max-w-4xl px-4 py-8">
				{/* Top Navigation */}
				<div className="flex items-center justify-between mb-8">
					<button
						onClick={() => navigate('/')}
						className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary transition-colors"
					>
						<Home className="h-4 w-4" />
						<span>Back to Home</span>
					</button>
					{step > 1 && step < 3 && (
						<button
							onClick={() => setStep(step - 1)}
							className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
						>
							<ArrowLeft className="h-4 w-4" />
							<span>Previous</span>
						</button>
					)}
				</div>

				{/* Header */}
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
						<Building2 className="h-8 w-8 text-primary" />
					</div>
					<h1 className="text-3xl font-bold mb-2">Company Registration</h1>
					<p className="text-neutral-600 dark:text-neutral-400">
						Register your company and create an admin account
					</p>
				</div>

				{/* Progress Steps */}
				<div className="mb-10">
					<div className="flex items-center justify-center gap-4 max-w-2xl mx-auto">
						{[
							{ num: 1, label: 'Company Info' },
							{ num: 2, label: 'Admin Info' },
							{ num: 3, label: 'Complete' },
						].map((s, index) => (
							<div key={s.num} className="flex items-center flex-1">
								<div className="flex flex-col items-center flex-1">
									<div
										className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg transition-all duration-300 ${
											s.num < step
												? 'bg-green-600 text-white'
												: s.num === step
													? 'bg-primary text-white shadow-lg scale-110'
													: 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
										}`}
									>
										{s.num < step ? <Check className="h-6 w-6" /> : s.num}
									</div>
									<span
										className={`mt-2 text-xs font-medium ${
											s.num <= step
												? 'text-neutral-900 dark:text-neutral-100'
												: 'text-neutral-500'
										}`}
									>
										{s.label}
									</span>
								</div>
								{index < 2 && (
									<div
										className={`h-1 flex-1 mx-4 transition-all duration-300 rounded-full ${
											s.num < step ? 'bg-green-600' : 'bg-neutral-200 dark:bg-neutral-800'
										}`}
									/>
								)}
							</div>
						))}
					</div>
				</div>

				{/* Form Card */}
				<Card className="max-w-2xl mx-auto shadow-xl">
					<CardHeader className="border-b border-neutral-200 dark:border-neutral-800">
						<h2 className="text-2xl font-bold">
							{step === 1 && 'Company Information'}
							{step === 2 && 'Administrator Information'}
							{step === 3 && 'Registration Complete'}
						</h2>
						<p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
							{step === 1 && 'Enter your company details'}
							{step === 2 && 'Create your admin account'}
							{step === 3 && 'Review and confirm your registration'}
						</p>
					</CardHeader>
					<CardContent className="p-8">
						{/* Step 1: Company Info */}
						{step === 1 && (
							<div className="space-y-6">
								<div>
									<label className="block text-sm font-medium mb-2">
										Company Name <span className="text-red-500">*</span>
									</label>
									<Input
										type="text"
										placeholder="Enter company name"
										value={data.companyName}
										onChange={(e) => handleChange('companyName', e.target.value)}
										className="h-12"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">
										Business Registration Number <span className="text-red-500">*</span>
									</label>
									<Input
										type="text"
										placeholder="000-00-00000"
										value={data.businessNumber}
										onChange={(e) => handleChange('businessNumber', e.target.value)}
										className="h-12"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">Industry</label>
									<Input
										type="text"
										placeholder="e.g., IT/Software"
										value={data.industry}
										onChange={(e) => handleChange('industry', e.target.value)}
										className="h-12"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">Number of Employees</label>
									<select
										value={data.employeeCount}
										onChange={(e) => handleChange('employeeCount', e.target.value)}
										className="w-full h-12 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary"
									>
										<option value="">Select range</option>
										<option value="1-10">1-10</option>
										<option value="11-50">11-50</option>
										<option value="51-200">51-200</option>
										<option value="201-500">201-500</option>
										<option value="500+">500+</option>
									</select>
								</div>
								<Button onClick={handleNext} className="w-full h-12 text-base mt-8">
									Next <ArrowRight className="ml-2 h-5 w-5" />
								</Button>
							</div>
						)}

						{/* Step 2: Admin Info */}
						{step === 2 && (
							<div className="space-y-6">
								<div>
									<label className="block text-sm font-medium mb-2">
										Administrator Name <span className="text-red-500">*</span>
									</label>
									<Input
										type="text"
										placeholder="Enter your name"
										value={data.adminName}
										onChange={(e) => handleChange('adminName', e.target.value)}
										className="h-12"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">
										Email Address <span className="text-red-500">*</span>
									</label>
									<Input
										type="email"
										placeholder="admin@company.com"
										value={data.adminEmail}
										onChange={(e) => handleChange('adminEmail', e.target.value)}
										className="h-12"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">
										Password <span className="text-red-500">*</span>
									</label>
									<Input
										type="password"
										placeholder="Minimum 8 characters"
										value={data.adminPassword}
										onChange={(e) => handleChange('adminPassword', e.target.value)}
										className="h-12"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">
										Confirm Password <span className="text-red-500">*</span>
									</label>
									<Input
										type="password"
										placeholder="Re-enter your password"
										value={data.adminPasswordConfirm}
										onChange={(e) => handleChange('adminPasswordConfirm', e.target.value)}
										className="h-12"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">Phone Number</label>
									<Input
										type="tel"
										placeholder="010-0000-0000"
										value={data.adminPhone}
										onChange={(e) => handleChange('adminPhone', e.target.value)}
										className="h-12"
									/>
								</div>
								<Button onClick={handleNext} className="w-full h-12 text-base mt-8">
									Next <ArrowRight className="ml-2 h-5 w-5" />
								</Button>
							</div>
						)}

						{/* Step 3: Complete */}
						{step === 3 && (
							<div className="text-center py-8">
								<div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
									<Check className="h-12 w-12 text-green-600 dark:text-green-400" />
								</div>
								<h3 className="text-2xl font-bold mb-2">Review Your Information</h3>
								<p className="text-neutral-600 dark:text-neutral-400 mb-8">
									Please confirm your registration details
								</p>

								<div className="max-w-md mx-auto space-y-4 mb-10">
									<div className="p-5 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-left">
										<div className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">
											Company Information
										</div>
										<div className="space-y-2">
											<div className="flex justify-between">
												<span className="text-sm text-neutral-600 dark:text-neutral-400">Name:</span>
												<span className="font-medium">{data.companyName}</span>
											</div>
											<div className="flex justify-between">
												<span className="text-sm text-neutral-600 dark:text-neutral-400">Business #:</span>
												<span className="font-medium">{data.businessNumber}</span>
											</div>
											{data.industry && (
												<div className="flex justify-between">
													<span className="text-sm text-neutral-600 dark:text-neutral-400">Industry:</span>
													<span className="font-medium">{data.industry}</span>
												</div>
											)}
											{data.employeeCount && (
												<div className="flex justify-between">
													<span className="text-sm text-neutral-600 dark:text-neutral-400">Employees:</span>
													<span className="font-medium">{data.employeeCount}</span>
												</div>
											)}
										</div>
									</div>

									<div className="p-5 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-left">
										<div className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">
											Administrator
										</div>
										<div className="space-y-2">
											<div className="flex justify-between">
												<span className="text-sm text-neutral-600 dark:text-neutral-400">Name:</span>
												<span className="font-medium">{data.adminName}</span>
											</div>
											<div className="flex justify-between">
												<span className="text-sm text-neutral-600 dark:text-neutral-400">Email:</span>
												<span className="font-medium">{data.adminEmail}</span>
											</div>
											{data.adminPhone && (
												<div className="flex justify-between">
													<span className="text-sm text-neutral-600 dark:text-neutral-400">Phone:</span>
													<span className="font-medium">{data.adminPhone}</span>
												</div>
											)}
										</div>
									</div>
								</div>

								<Button onClick={handleSubmit} className="w-full max-w-md h-12 text-base">
									<Check className="mr-2 h-5 w-5" />
									Complete Registration
								</Button>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Footer */}
				<div className="text-center mt-8">
					<p className="text-sm text-neutral-600 dark:text-neutral-400">
						Already have an account?{' '}
						<button
							onClick={() => navigate('/auth/sign-in')}
							className="text-primary hover:underline font-medium"
						>
							Sign In
						</button>
					</p>
				</div>
			</div>

			<Toaster />
		</div>
	)
}
