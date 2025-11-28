import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '../../../components/ui/Card'
import Input from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { Building2, ArrowRight, ArrowLeft, Check, Home, Mail, RefreshCw, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import Toaster from '../../../components/ui/Toaster'

interface CompanyData {
	// 이메일 인증
	email: string
	verificationCode: string
	// 회사 정보
	companyName: string
	businessNumber: string
	industry: string
	employeeCount: string
	employeeCountExact: string
	// 관리자 정보
	adminName: string
	adminEmail: string
	adminPassword: string
	adminPasswordConfirm: string
	adminPhone: string
}

export default function CompanySignUpPage() {
	const navigate = useNavigate()
	const [step, setStep] = useState(1) // 1: Email Verification, 2: Company Info, 3: Admin Info, 4: Complete
	const [data, setData] = useState<CompanyData>({
		email: '',
		verificationCode: '',
		companyName: '',
		businessNumber: '',
		industry: '',
		employeeCount: '',
		employeeCountExact: '',
		adminName: '',
		adminEmail: '',
		adminPassword: '',
		adminPasswordConfirm: '',
		adminPhone: '',
	})
	const [isCodeSent, setIsCodeSent] = useState(false)
	const [isEmailVerified, setIsEmailVerified] = useState(false)
	const [sentCode, setSentCode] = useState('')
	const [countdown, setCountdown] = useState(0)

	const handleChange = (field: keyof CompanyData, value: string) => {
		setData((prev) => ({ ...prev, [field]: value }))
	}

	const handleEmployeeCountSelect = (value: string) => {
		setData((prev) => ({ ...prev, employeeCount: value, employeeCountExact: '' }))
	}

	const handleEmployeeCountExact = (value: string) => {
		setData((prev) => ({ ...prev, employeeCountExact: value, employeeCount: '' }))
	}

	// Email verification countdown
	const startCountdown = () => {
		setCountdown(180) // 3 minutes
		const timer = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					clearInterval(timer)
					return 0
				}
				return prev - 1
			})
		}, 1000)
	}

	const handleSendCode = () => {
		if (!data.email) {
			toast.error('Please enter your email address')
			return
		}
		
		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(data.email)) {
			toast.error('Please enter a valid email address')
			return
		}

		// Mock: Generate 6-digit code
		const code = Math.floor(100000 + Math.random() * 900000).toString()
		setSentCode(code)
		setIsCodeSent(true)
		startCountdown()
		
		toast.success('Verification code sent!', {
			description: `Code: ${code} (Demo mode - code will be sent via email in production)`
		})
	}

	const handleVerifyCode = () => {
		if (!data.verificationCode) {
			toast.error('Please enter the verification code')
			return
		}
		
		if (data.verificationCode !== sentCode) {
			toast.error('Invalid verification code')
			return
		}
		
		setIsEmailVerified(true)
		toast.success('Email verified successfully!')
		setTimeout(() => {
			setStep(2)
		}, 500)
	}

	const handleNext = () => {
		if (step === 1) {
			// Email verification step
			if (!isEmailVerified) {
				toast.error('Please verify your email first')
				return
			}
			setStep(2)
		} else if (step === 2) {
			// Company info step
			if (!data.companyName || !data.businessNumber) {
				toast.error('Please fill in all required fields')
				return
			}
			// Set admin email same as verified email
			setData(prev => ({ ...prev, adminEmail: data.email }))
			setStep(3)
		} else if (step === 3) {
			// Admin info step
			if (!data.adminName || !data.adminPassword) {
				toast.error('Please fill in all required fields')
				return
			}
			if (data.adminPassword !== data.adminPasswordConfirm) {
				toast.error('Passwords do not match')
				return
			}
			setStep(4)
		}
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
			
		<div className="flex items-center gap-4">
			{/* TODO: Remove development features before production deployment */}
			{/* Dev Mode: Skip All Steps */}
			{step < 4 && (
				<Button
					onClick={() => {
						setData({
							email: 'test@company.com',
							verificationCode: '123456',
							companyName: 'Test Company Inc.',
							businessNumber: '123-45-67890',
							industry: 'IT / SaaS / Software',
							employeeCount: '10-49',
							employeeCountExact: '',
							adminName: 'Admin User',
							adminEmail: 'test@company.com',
							adminPassword: 'password123',
							adminPasswordConfirm: 'password123',
							adminPhone: '010-1234-5678',
						})
						setSentCode('123456')
						setIsCodeSent(true)
						setIsEmailVerified(true)
						setStep(4)
						toast.success('⚡ Dev Mode: All steps completed')
					}}
					size="sm"
					variant="outline"
					className="text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20"
				>
					⚡ Skip All Steps
				</Button>
			)}
				
				{step > 1 && step < 4 && (
					<button
						onClick={() => setStep(step - 1)}
						className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
					>
						<ArrowLeft className="h-4 w-4" />
						<span>Previous</span>
					</button>
				)}
			</div>
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
				<div className="flex items-center max-w-3xl mx-auto">
					{[
						{ num: 1, label: 'Email Verification' },
						{ num: 2, label: 'Company Info' },
						{ num: 3, label: 'Admin Info' },
						{ num: 4, label: 'Complete' },
					].map((s, index) => (
						<div key={s.num} className="flex items-center flex-1">
							{/* Step Circle */}
							<div className="flex flex-col items-center min-w-[120px]">
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
									className={`mt-2 text-xs font-medium text-center ${
										s.num <= step
											? 'text-neutral-900 dark:text-neutral-100'
											: 'text-neutral-500'
									}`}
								>
									{s.label}
								</span>
							</div>
							
							{/* Progress Line */}
							{index < 3 && (
								<div className="flex-1 h-1 mx-4 transition-all duration-300 rounded-full" style={{
									backgroundColor: s.num < step 
										? 'rgb(22, 163, 74)' 
										: 'rgb(229, 229, 229)'
								}} />
							)}
						</div>
					))}
				</div>
			</div>

			{/* Form Card */}
			<Card className="max-w-2xl mx-auto shadow-xl">
				<CardHeader className="border-b border-neutral-200 dark:border-neutral-800">
					<h2 className="text-2xl font-bold">
						{step === 1 && 'Email Verification'}
						{step === 2 && 'Company Information'}
						{step === 3 && 'Administrator Information'}
						{step === 4 && 'Registration Complete'}
					</h2>
					<p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
						{step === 1 && 'Verify your email to prevent unauthorized signups'}
						{step === 2 && 'Enter your company details'}
						{step === 3 && 'Create your admin account'}
						{step === 4 && 'Review and confirm your registration'}
					</p>
				</CardHeader>
				<CardContent className="p-8">
					{/* Step 1: Email Verification */}
					{step === 1 && (
						<div className="space-y-6">
							<div className="text-center mb-6">
								<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
									<Mail className="h-8 w-8 text-primary" />
								</div>
								<h3 className="text-lg font-semibold mb-2">Verify Your Business Email</h3>
								<p className="text-sm text-neutral-600 dark:text-neutral-400">
									We'll send a verification code to ensure your email is valid
								</p>
							</div>

							<div>
								<label className="block text-sm font-medium mb-2">
									Business Email <span className="text-red-500">*</span>
								</label>
								<div className="flex gap-2">
									<Input
										type="email"
										placeholder="company@example.com"
										value={data.email}
										onChange={(e) => handleChange('email', e.target.value)}
										disabled={isCodeSent}
										className="flex-1 h-12"
									/>
									<Button
										onClick={handleSendCode}
										disabled={isCodeSent && countdown > 0}
										className="h-12 px-6"
									>
										{isCodeSent && countdown > 0 
											? `${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')}`
											: 'Send Code'}
									</Button>
								</div>
						{!isCodeSent && (
							<p className="text-xs text-neutral-500 mt-2">
								💡 Use your official business email address
							</p>
						)}
					</div>

				{/* Dev Mode: Skip Email Verification */}
				{!isEmailVerified && (
					<div className="pt-4 border-t border-orange-200 dark:border-orange-800">
						<Button
							onClick={() => {
								setData(prev => ({ ...prev, email: 'test@company.com', verificationCode: '123456' }))
								setSentCode('123456')
								setIsCodeSent(true)
								setIsEmailVerified(true)
								toast.success('⚡ Dev Mode: Email verification skipped')
							}}
							variant="outline"
							className="w-full h-10 text-sm text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/20"
						>
							⚡ Skip Email Verification (Dev Only)
						</Button>
					</div>
				)}

							{isCodeSent && !isEmailVerified && (
								<div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
									<div>
										<label className="block text-sm font-medium mb-2">
											Verification Code <span className="text-red-500">*</span>
										</label>
										<Input
											type="text"
											placeholder="Enter 6-digit code"
											value={data.verificationCode}
											onChange={(e) => handleChange('verificationCode', e.target.value.replace(/\D/g, '').slice(0, 6))}
											className="h-12 text-center text-2xl tracking-widest font-mono"
											maxLength={6}
										/>
										<p className="text-xs text-neutral-500 mt-2">
											Check your email for the verification code
										</p>
									</div>
									
									<div className="flex gap-2">
										<Button
											onClick={handleVerifyCode}
											className="flex-1 h-12"
											disabled={data.verificationCode.length !== 6}
										>
											<Check className="h-5 w-5" />
											Verify Email
										</Button>
										<Button
											onClick={handleSendCode}
											variant="outline"
											className="h-12"
											disabled={countdown > 0}
										>
											<RefreshCw className="h-5 w-5" />
											Resend
										</Button>
									</div>
								</div>
							)}

							{isEmailVerified && (
								<div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
									<CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
									<div>
										<p className="font-medium text-green-900 dark:text-green-100">Email Verified!</p>
										<p className="text-sm text-green-700 dark:text-green-300">
											You can now proceed to company registration
										</p>
									</div>
								</div>
							)}

							{isEmailVerified && (
								<div className="pt-4">
									<Button onClick={handleNext} className="w-full h-12 text-base">
										Continue to Company Info
										<ArrowRight className="h-5 w-5" />
									</Button>
								</div>
							)}
						</div>
					)}

					{/* Step 2: Company Info */}
					{step === 2 && (
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
							<select
								value={data.industry}
								onChange={(e) => handleChange('industry', e.target.value)}
								className="w-full h-12 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary"
							>
								<option value="">Select industry</option>
								<option value="IT/SaaS/Software">IT / SaaS / Software</option>
								<option value="Manufacturing/Production">Manufacturing / Production</option>
								<option value="Finance/Insurance/Securities">Finance / Insurance / Securities</option>
								<option value="Distribution/Retail/Trading">Distribution / Retail / Trading</option>
								<option value="Service/Consulting">Service / Consulting</option>
								<option value="Construction/Engineering">Construction / Engineering</option>
								<option value="Medical/Pharmaceutical/Bio">Medical / Pharmaceutical / Bio</option>
								<option value="Education/Research">Education / Research</option>
								<option value="Media/Content/Entertainment">Media / Content / Entertainment</option>
								<option value="Food/Beverage/Restaurant">Food / Beverage / Restaurant</option>
								<option value="Fashion/Beauty/Lifestyle">Fashion / Beauty / Lifestyle</option>
								<option value="Logistics/Transportation">Logistics / Transportation</option>
								<option value="Energy/Environment">Energy / Environment</option>
								<option value="Real Estate/Property">Real Estate / Property</option>
								<option value="Telecommunications">Telecommunications</option>
								<option value="Automotive/Mobility">Automotive / Mobility</option>
								<option value="Aerospace/Defense">Aerospace / Defense</option>
								<option value="Agriculture/Fisheries">Agriculture / Fisheries</option>
								<option value="Legal/Accounting/Tax">Legal / Accounting / Tax</option>
								<option value="Marketing/Advertising/PR">Marketing / Advertising / PR</option>
								<option value="Design/Creative">Design / Creative</option>
								<option value="Gaming/Esports">Gaming / Esports</option>
								<option value="Travel/Hospitality">Travel / Hospitality</option>
								<option value="Sports/Fitness">Sports / Fitness</option>
								<option value="Non-profit/NGO">Non-profit / NGO</option>
								<option value="Government/Public">Government / Public</option>
								<option value="Other">Other</option>
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium mb-2">Number of Employees</label>
							<div className="flex items-center gap-3">
								<div className="flex-1">
									<select
										value={data.employeeCount}
										onChange={(e) => handleEmployeeCountSelect(e.target.value)}
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
								<div className="flex items-center gap-2">
									<span className="text-neutral-400">or</span>
									<Input
										type="number"
										placeholder="Enter exact"
										value={data.employeeCountExact}
										onChange={(e) => handleEmployeeCountExact(e.target.value)}
										className="h-12 w-32"
										min="1"
									/>
									{(data.employeeCount || data.employeeCountExact) && (
										<div className="flex items-center justify-center min-w-[100px] h-12 px-4 bg-primary/10 text-primary rounded-2xl font-medium">
											{data.employeeCountExact 
												? `${data.employeeCountExact}명` 
												: data.employeeCount}
										</div>
									)}
								</div>
							</div>
							<p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
								Select a range or enter the exact number
							</p>
						</div>
						<div className="space-y-3 mt-8">
							<Button onClick={handleNext} className="w-full h-12 text-base">
								Next
								<ArrowRight className="h-5 w-5" />
							</Button>
						
						{/* Dev Mode: Auto-fill and Skip */}
						
							<Button 
								onClick={() => {
									setData(prev => ({
										...prev,
										companyName: 'Test Company Inc.',
										businessNumber: '123-45-67890',
										industry: 'IT / SaaS / Software',
										employeeCount: '10-49',
									}))
									toast.success('⚡ Dev Mode: Company info auto-filled')
									setTimeout(() => setStep(3), 300)
								}} 
								variant="outline" 
								className="w-full h-12 text-base text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/20"
							>
								⚡ Auto-fill & Next (Dev Only)
							</Button>
						</div>
						</div>
				)}

				{/* Step 3: Admin Info */}
				{step === 3 && (
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
								Email Address <span className="text-green-600">(Verified ✓)</span>
							</label>
							<Input
								type="email"
								value={data.email}
								disabled
								className="h-12 bg-neutral-50 dark:bg-neutral-800 cursor-not-allowed"
							/>
							<p className="text-xs text-neutral-500 mt-1">
								Using your verified business email
							</p>
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
						<div className="space-y-3 mt-8">
							<Button onClick={handleNext} className="w-full h-12 text-base">
								Next
								<ArrowRight className="h-5 w-5" />
							</Button>
						
						{/* Dev Mode: Auto-fill and Skip */}
						
							<Button 
								onClick={() => {
									setData(prev => ({
										...prev,
										adminName: 'Admin User',
										adminPassword: 'password123',
										adminPasswordConfirm: 'password123',
										adminPhone: '010-1234-5678',
									}))
									toast.success('⚡ Dev Mode: Admin info auto-filled')
									setTimeout(() => setStep(4), 300)
								}} 
								variant="outline" 
								className="w-full h-12 text-base text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/20"
							>
								⚡ Auto-fill & Next (Dev Only)
							</Button>
						</div>
						</div>
				)}

				{/* Step 4: Complete */}
				{step === 4 && (
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
									{(data.employeeCount || data.employeeCountExact) && (
										<div className="flex justify-between">
											<span className="text-sm text-neutral-600 dark:text-neutral-400">Employees:</span>
											<span className="font-medium">
												{data.employeeCountExact 
													? `${data.employeeCountExact} employees` 
													: data.employeeCount}
											</span>
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

							<div className="space-y-3 max-w-md mx-auto">
								<Button onClick={handleSubmit} className="w-full h-12 text-base">
									<Check className="h-5 w-5" />
									Complete Registration
								</Button>
								<Button 
									onClick={handleSubmit} 
									variant="outline" 
									className="w-full h-12 text-base text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/20"
								>
									Complete (Skip Validation)
								</Button>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Footer */}
			<div className="text-center mt-8">
				<p className="text-sm text-neutral-600 dark:text-neutral-400">
					Already have an account?{' '}
					<button
						onClick={() => navigate('/')}
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
