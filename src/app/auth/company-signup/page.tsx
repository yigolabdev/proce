import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '../../../components/ui/Card'
import Input from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { Building2, ArrowRight, ArrowLeft, Check, Home, Mail, RefreshCw, CheckCircle2, X, Languages } from 'lucide-react'
import { toast } from 'sonner'
import Toaster from '../../../components/ui/Toaster'
import { signupService } from '../../../services/api/signup.service'
import { validatePassword, isPasswordValid, type PasswordRequirements } from '../../../utils/passwordValidation'
import { useI18n } from '../../../i18n/I18nProvider'
import { companySignupI18n } from './_i18n/companySignup.i18n'

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
	const { locale, setLocale } = useI18n()
	const t = useMemo(() => companySignupI18n[locale as keyof typeof companySignupI18n], [locale])
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
	const [countdown, setCountdown] = useState(0)
	const [isLoading, setIsLoading] = useState(false)
	const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirements>({
		minLength: false,
		hasUppercase: false,
		hasNumber: false,
		hasSpecialChar: false,
	})
	const timerRef = useRef<number | null>(null)

	const handleChange = (field: keyof CompanyData, value: string) => {
		setData((prev) => ({ ...prev, [field]: value }))

		// 비밀번호 입력 시 실시간 검증
		if (field === 'adminPassword') {
			setPasswordRequirements(validatePassword(value))
		}
	}

	const handleEmployeeCountSelect = (value: string) => {
		setData((prev) => ({ ...prev, employeeCount: value, employeeCountExact: '' }))
	}

	const handleEmployeeCountExact = (value: string) => {
		setData((prev) => ({ ...prev, employeeCountExact: value, employeeCount: '' }))
	}

	// Email verification countdown
	const startCountdown = () => {
		// 기존 타이머가 있다면 정리
		if (timerRef.current) {
			clearInterval(timerRef.current)
		}
		
		setCountdown(180) // 3 minutes
		timerRef.current = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					if (timerRef.current) {
						clearInterval(timerRef.current)
						timerRef.current = null
					}
					return 0
				}
				return prev - 1
			})
		}, 1000)
	}
	
	// Cleanup timer on unmount
	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current)
			}
		}
	}, [])

	const handleSendCode = async () => {
		if (!data.email) {
			toast.error(t.errors.enterEmail)
			return
		}

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(data.email)) {
			toast.error(t.errors.invalidEmail)
			return
		}

		console.log('📧 이메일 인증 코드 발송 시작:', data.email)

		setIsLoading(true)
		try {
			// STEP 1: 백엔드 API 호출 - 인증 코드 발송
			const response = await signupService.sendVerificationCode(data.email)

			console.log('✅ 인증 코드 발송 응답:', response)

			if (response.success) {
				setIsCodeSent(true)
				startCountdown()
				toast.success(t.codeSent, {
					description: t.checkEmail
				})
			}
		} catch (error) {
			console.group('❌ 인증 코드 발송 실패')
			console.error('Error:', error)
			console.groupEnd()

			toast.error(t.errors.sendCodeFailed, {
				description: error instanceof Error ? error.message : t.errors.tryAgain
			})
		} finally {
			setIsLoading(false)
		}
	}

	const handleVerifyCode = async () => {
		if (!data.verificationCode) {
			toast.error('인증 코드를 입력해주세요')
			return
		}

		if (data.verificationCode.length !== 6) {
			toast.error('6자리 인증 코드를 입력해주세요')
			return
		}

		console.log('🔑 이메일 인증 코드 확인 시작:', {
			email: data.email,
			code: data.verificationCode
		})

		setIsLoading(true)
		try {
			// STEP 2: 백엔드 API 호출 - 인증 코드 확인
			const response = await signupService.verifyEmailCode(data.email, data.verificationCode)

			console.log('✅ 인증 코드 확인 응답:', response)

			if (response.success || response.verified) {
				setIsEmailVerified(true)
				toast.success('이메일 인증이 완료되었습니다!')
				setTimeout(() => {
					setStep(2)
				}, 500)
			} else {
				console.warn('⚠️ 인증 실패 (success/verified: false):', response)
				toast.error('유효하지 않은 인증 코드입니다')
			}
		} catch (error) {
			console.group('❌ 인증 코드 확인 실패')
			console.error('Error:', error)
			console.groupEnd()

			toast.error('인증 코드 확인에 실패했습니다', {
				description: error instanceof Error ? error.message : '인증 코드를 다시 확인해주세요'
			})
		} finally {
			setIsLoading(false)
		}
	}

	const handleNext = () => {
		if (step === 1) {
			// Email verification step
			if (!isEmailVerified) {
				toast.error('먼저 이메일 인증을 완료해주세요')
				return
			}
			setStep(2)
		} else if (step === 2) {
			// Company info step
			if (!data.companyName || !data.businessNumber) {
				toast.error('필수 항목을 모두 입력해주세요')
				return
			}
			if (!data.industry) {
				toast.error('업종을 선택해주세요')
				return
			}
			if (!data.employeeCount && !data.employeeCountExact) {
				toast.error('직원 수를 입력해주세요')
				return
			}
			// Set admin email same as verified email
			setData(prev => ({ ...prev, adminEmail: data.email }))
			setStep(3)
		} else if (step === 3) {
			// Admin info step
			if (!data.adminName || !data.adminPassword) {
				toast.error('필수 항목을 모두 입력해주세요')
				return
			}

			// 비밀번호 검증: 최소 8자, 대문자, 숫자, 특수문자 필수
			if (!isPasswordValid(data.adminPassword)) {
				toast.error('비밀번호가 규칙을 충족하지 않습니다', {
					description: '최소 8자, 대문자, 숫자, 특수문자를 포함해야 합니다'
				})
				return
			}

			if (data.adminPassword !== data.adminPasswordConfirm) {
				toast.error('비밀번호가 일치하지 않습니다')
				return
			}
			if (!data.adminPhone) {
				toast.error('전화번호를 입력해주세요')
				return
			}
			setStep(4)
		}
	}

	const handleSubmit = async () => {
		setIsLoading(true)
		try {
			// STEP 3: 백엔드 API 호출 - 회사 등록 완료
			const signupData = {
				companyName: data.companyName,
				companyRegistrationNumber: data.businessNumber,
				industry: data.industry,
				numberOfEmployees: data.employeeCountExact || data.employeeCount,
				name: data.adminName,
				email: data.email,
				password: data.adminPassword,
				username: data.email, // username은 email과 동일
				phone_number: data.adminPhone,
			}

			// 🔍 DETAILED LOGGING FOR DEBUGGING
			console.group('🚀 회사 등록 시작')
			console.log('📋 Form Data (전체):', data)
			console.log('📦 Signup Request (전송 데이터):', signupData)
			console.log('📝 각 필드 상세:')
			console.table({
				'회사명': signupData.companyName,
				'사업자번호': signupData.companyRegistrationNumber,
				'업종': signupData.industry,
				'직원 수': signupData.numberOfEmployees,
				'관리자명': signupData.name,
				'이메일': signupData.email,
				'비밀번호': '***hidden***',
				'사용자명': signupData.username,
				'전화번호': signupData.phone_number,
			})
			console.groupEnd()

			const response = await signupService.completeCompanySignup(signupData)

			// 🔍 RESPONSE LOGGING
			console.group('✅ 회사 등록 응답')
			console.log('📥 Response:', response)
			console.log('🎯 Success:', response.success)
			if (response.data) {
				console.log('💾 Data:', response.data)
			}
			console.groupEnd()

			if (response.success) {
				toast.success('기업 회원가입이 완료되었습니다!', {
					description: '대시보드로 이동합니다...'
				})

				// 초대 코드가 있다면 표시
				if (response.data?.inviteCode) {
					toast.success(`직원 초대 코드: ${response.data.inviteCode}`, {
						duration: 10000
					})
				}

				// 대시보드로 이동
				setTimeout(() => {
					navigate('/dashboard')
				}, 2000)
			} else {
				console.group('⚠️ 회사 등록 실패 (success: false)')
				console.error('Response:', response)
				console.error('Message:', response.message)
				console.groupEnd()

				toast.error('회사 등록에 실패했습니다', {
					description: response.message || '다시 시도해주세요'
				})
			}
		} catch (error) {
			// 🔍 CATCH ERROR LOGGING
			console.group('💥 회사 등록 예외 발생')
			console.error('Error Object:', error)
			console.error('Error Type:', error instanceof Error ? 'Error' : typeof error)
			if (error instanceof Error) {
				console.error('Error Message:', error.message)
				console.error('Error Stack:', error.stack)
			}
			console.groupEnd()

			toast.error('회사 등록에 실패했습니다', {
				description: error instanceof Error ? error.message : '다시 시도해주세요'
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="mx-auto min-h-dvh w-full bg-neutral-950">
			<div className="mx-auto max-w-4xl px-4 py-8">
		{/* Top Navigation */}
		<div className="flex items-center justify-between mb-8">
			<button
				onClick={() => navigate('/')}
				className="flex items-center gap-2 text-sm text-neutral-400 hover:hover:text-primary transition-colors"
			>
				<Home className="h-4 w-4" />
				<span>{t.backToHome}</span>
			</button>
			
		<div className="flex items-center gap-4">
			{/* Language Switcher */}
			<button
				onClick={() => setLocale(locale === 'en' ? 'ko' : 'en')}
				className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full bg-neutral-900/90 backdrop-blur-sm border border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
				aria-label="toggle language"
			>
				<Languages size={14} />
				<span className="text-xs">{locale === 'ko' ? 'EN' : '한글'}</span>
			</button>

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
							adminPassword: 'Password123!',
							adminPasswordConfirm: 'Password123!',
							adminPhone: '010-1234-5678',
						})
						setIsCodeSent(true)
						setIsEmailVerified(true)
						setStep(4)
						toast.success('⚡ Dev Mode: All steps completed')
					}}
					size="sm"
					variant="outline"
					className="text-orange-400 border-orange-700 hover:hover:bg-orange-900/20"
				>
					⚡ {t.skipAll}
				</Button>
			)}
				
				{step > 1 && step < 4 && (
					<button
						onClick={() => setStep(step - 1)}
						className="flex items-center gap-2 text-sm text-neutral-400 hover:hover:text-neutral-100 transition-colors"
					>
						<ArrowLeft className="h-4 w-4" />
						<span>{t.previous}</span>
					</button>
				)}
			</div>
		</div>

		{/* Header */}
		<div className="text-center mb-8">
			<div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
				<Building2 className="h-8 w-8 text-primary" />
			</div>
			<h1 className="text-3xl font-bold mb-2">{t.title}</h1>
			<p className="text-neutral-400">
				{t.subtitle}
			</p>
		</div>

		{/* Progress Steps */}
		<div className="mb-10">
			<div className="flex items-center max-w-3xl mx-auto">
				{[
					{ num: 1, label: t.steps.emailVerification },
					{ num: 2, label: t.steps.companyInfo },
					{ num: 3, label: t.steps.adminInfo },
					{ num: 4, label: t.steps.complete },
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
												: 'bg-neutral-800 text-neutral-500'
									}`}
								>
									{s.num < step ? <Check className="h-6 w-6" /> : s.num}
								</div>
								<span
									className={`mt-2 text-xs font-medium text-center ${
										s.num <= step
											? 'text-neutral-100'
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
			<CardHeader className="border-b border-neutral-800">
				<h2 className="text-2xl font-bold">
					{step === 1 && t.steps.emailVerification}
					{step === 2 && t.steps.companyInfo}
					{step === 3 && t.steps.adminInfo}
					{step === 4 && t.steps.complete}
				</h2>
				<p className="text-sm text-neutral-400 mt-1">
					{step === 1 && t.stepDescriptions.emailVerification}
					{step === 2 && t.stepDescriptions.companyInfo}
					{step === 3 && t.stepDescriptions.adminInfo}
					{step === 4 && t.stepDescriptions.complete}
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
							<h3 className="text-lg font-semibold mb-2">비즈니스 이메일 인증</h3>
							<p className="text-sm text-neutral-400">
								이메일 유효성을 확인하기 위해 인증 코드를 발송합니다
							</p>
						</div>

						<div>
							<label className="block text-sm font-medium mb-2">
								비즈니스 이메일 <span className="text-red-500">*</span>
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
									disabled={isCodeSent && countdown > 0 || isLoading}
									className="h-12 px-6"
								>
									{isLoading 
										? '전송 중...'
										: isCodeSent && countdown > 0 
											? `${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')}`
											: '코드 발송'}
								</Button>
							</div>
					{!isCodeSent && (
						<p className="text-xs text-neutral-500 mt-2">
							💡 공식 비즈니스 이메일 주소를 사용하세요
						</p>
					)}
				</div>

				{/* Dev Mode: Skip Email Verification */}
				{!isEmailVerified && (
					<div className="pt-4 border-t border-orange-800">
						<Button
							onClick={() => {
								setData(prev => ({ ...prev, email: 'test@company.com', verificationCode: '123456' }))
								setIsCodeSent(true)
								setIsEmailVerified(true)
								toast.success('⚡ Dev Mode: Email verification skipped')
							}}
							variant="outline"
							className="w-full h-10 text-sm text-orange-400 border-orange-800 hover:hover:bg-orange-900/20"
						>
							⚡ Skip Email Verification (Dev Only)
						</Button>
					</div>
				)}

						{isCodeSent && !isEmailVerified && (
							<div className="space-y-4 pt-4 border-t border-neutral-800">
								<div>
									<label className="block text-sm font-medium mb-2">
										인증 코드 <span className="text-red-500">*</span>
									</label>
									<Input
										type="text"
										placeholder="6자리 코드를 입력하세요"
										value={data.verificationCode}
										onChange={(e) => handleChange('verificationCode', e.target.value.replace(/\D/g, '').slice(0, 6))}
										className="h-12 text-center text-2xl tracking-widest font-mono"
										maxLength={6}
									/>
									<p className="text-xs text-neutral-500 mt-2">
										이메일에서 인증 코드를 확인하세요
									</p>
								</div>
									
									<div className="flex gap-2">
										<Button
											onClick={handleVerifyCode}
											className="flex-1 h-12"
											disabled={data.verificationCode.length !== 6 || isLoading}
										>
											<Check className="h-5 w-5" />
											{isLoading ? '확인 중...' : '이메일 인증'}
										</Button>
										<Button
											onClick={handleSendCode}
											variant="outline"
											className="h-12"
											disabled={countdown > 0 || isLoading}
										>
											<RefreshCw className="h-5 w-5" />
											재전송
										</Button>
									</div>
								</div>
							)}

						{isEmailVerified && (
							<div className="bg-green-900/20 border border-green-800 rounded-lg p-4 flex items-center gap-3">
								<CheckCircle2 className="h-6 w-6 text-green-400" />
								<div>
									<p className="font-medium text-green-100">이메일 인증 완료!</p>
									<p className="text-sm text-green-300">
										이제 회사 등록을 진행할 수 있습니다
									</p>
								</div>
							</div>
						)}

							{isEmailVerified && (
								<div className="pt-4">
									<Button 
										onClick={handleNext} 
										className="w-full h-12 text-base"
										disabled={isLoading}
									>
										회사 정보 입력으로 계속
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
								회사명 <span className="text-red-500">*</span>
							</label>
							<Input
								type="text"
								placeholder="회사명을 입력하세요"
								value={data.companyName}
								onChange={(e) => handleChange('companyName', e.target.value)}
								className="h-12"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-2">
								사업자 등록번호 <span className="text-red-500">*</span>
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
						<label className="block text-sm font-medium mb-2">업종 <span className="text-red-500">*</span></label>
						<select
							value={data.industry}
							onChange={(e) => handleChange('industry', e.target.value)}
							className="w-full h-12 px-4 py-2 border border-neutral-700 rounded-2xl bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary"
						>
							<option value="">업종을 선택하세요</option>
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
					<label className="block text-sm font-medium mb-2">직원 수 <span className="text-red-500">*</span></label>
					<div className="flex items-center gap-3">
						<div className="flex-1">
							<select
								value={data.employeeCount}
								onChange={(e) => handleEmployeeCountSelect(e.target.value)}
								className="w-full h-12 px-4 py-2 border border-neutral-700 rounded-2xl bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary"
							>
								<option value="">범위 선택</option>
										<option value="1-10">1-10</option>
										<option value="11-50">11-50</option>
										<option value="51-200">51-200</option>
										<option value="201-500">201-500</option>
										<option value="500+">500+</option>
									</select>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-neutral-400">또는</span>
							<Input
								type="number"
								placeholder="직접 입력"
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
					<p className="text-xs text-neutral-400 mt-2">
						범위를 선택하거나 정확한 숫자를 입력하세요
					</p>
				</div>
						<div className="space-y-3 mt-8">
							<Button 
								onClick={handleNext} 
								className="w-full h-12 text-base"
								disabled={isLoading}
							>
								다음
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
								className="w-full h-12 text-base text-orange-400 border-orange-800 hover:hover:bg-orange-900/20"
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
								관리자 이름 <span className="text-red-500">*</span>
							</label>
							<Input
								type="text"
								placeholder="이름을 입력하세요"
								value={data.adminName}
								onChange={(e) => handleChange('adminName', e.target.value)}
								className="h-12"
							/>
						</div>
					<div>
						<label className="block text-sm font-medium mb-2">
							이메일 주소 <span className="text-green-600">(인증 완료 ✓)</span>
						</label>
						<Input
							type="email"
							value={data.email}
							disabled
							className="h-12 bg-neutral-800 cursor-not-allowed"
						/>
						<p className="text-xs text-neutral-500 mt-1">
							인증된 비즈니스 이메일을 사용합니다
						</p>
					</div>
						<div>
							<label className="block text-sm font-medium mb-2">
								비밀번호 <span className="text-red-500">*</span>
							</label>
							<Input
								type="password"
								placeholder="비밀번호 입력"
								value={data.adminPassword}
								onChange={(e) => handleChange('adminPassword', e.target.value)}
								className="h-12"
							/>

							{/* 비밀번호 요구사항 실시간 표시 */}
							{data.adminPassword && (
								<div className="mt-3 p-3 bg-neutral-800/50 rounded-lg border border-neutral-700">
									<p className="text-xs font-medium text-neutral-400 mb-2">비밀번호 요구사항:</p>
									<div className="space-y-1.5">
										<div className="flex items-center gap-2">
											{passwordRequirements.minLength ? (
												<Check className="h-4 w-4 text-green-500" />
											) : (
												<X className="h-4 w-4 text-red-500" />
											)}
											<span className={`text-xs ${passwordRequirements.minLength ? 'text-green-500' : 'text-neutral-400'}`}>
												최소 8자 이상
											</span>
										</div>
										<div className="flex items-center gap-2">
											{passwordRequirements.hasUppercase ? (
												<Check className="h-4 w-4 text-green-500" />
											) : (
												<X className="h-4 w-4 text-red-500" />
											)}
											<span className={`text-xs ${passwordRequirements.hasUppercase ? 'text-green-500' : 'text-neutral-400'}`}>
												대문자 1개 이상 (A-Z)
											</span>
										</div>
										<div className="flex items-center gap-2">
											{passwordRequirements.hasNumber ? (
												<Check className="h-4 w-4 text-green-500" />
											) : (
												<X className="h-4 w-4 text-red-500" />
											)}
											<span className={`text-xs ${passwordRequirements.hasNumber ? 'text-green-500' : 'text-neutral-400'}`}>
												숫자 1개 이상 (0-9)
											</span>
										</div>
										<div className="flex items-center gap-2">
											{passwordRequirements.hasSpecialChar ? (
												<Check className="h-4 w-4 text-green-500" />
											) : (
												<X className="h-4 w-4 text-red-500" />
											)}
											<span className={`text-xs ${passwordRequirements.hasSpecialChar ? 'text-green-500' : 'text-neutral-400'}`}>
												특수문자 1개 이상 (!@#$%^&* 등)
											</span>
										</div>
									</div>

									{/* 모든 조건 충족 시 메시지 */}
									{isPasswordValid(data.adminPassword) && (
										<div className="mt-2 pt-2 border-t border-neutral-700">
											<div className="flex items-center gap-2">
												<CheckCircle2 className="h-4 w-4 text-green-500" />
												<span className="text-xs font-medium text-green-500">
													안전한 비밀번호입니다!
												</span>
											</div>
										</div>
									)}
								</div>
							)}

							{/* 안내 문구 (비밀번호 입력 전) */}
							{!data.adminPassword && (
								<p className="text-xs text-neutral-500 mt-2">
									최소 8자, 대문자, 숫자, 특수문자를 포함해야 합니다
								</p>
							)}
						</div>
						<div>
							<label className="block text-sm font-medium mb-2">
								비밀번호 확인 <span className="text-red-500">*</span>
							</label>
							<Input
								type="password"
								placeholder="비밀번호를 다시 입력하세요"
								value={data.adminPasswordConfirm}
								onChange={(e) => handleChange('adminPasswordConfirm', e.target.value)}
								className="h-12"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-2">전화번호 <span className="text-red-500">*</span></label>
							<Input
								type="tel"
								placeholder="010-0000-0000"
								value={data.adminPhone}
								onChange={(e) => handleChange('adminPhone', e.target.value)}
								className="h-12"
							/>
						</div>
						<div className="space-y-3 mt-8">
							<Button 
								onClick={handleNext} 
								className="w-full h-12 text-base"
								disabled={isLoading}
							>
								다음
								<ArrowRight className="h-5 w-5" />
							</Button>
						
						{/* Dev Mode: Auto-fill and Skip */}
						
							<Button
								onClick={() => {
									setData(prev => ({
										...prev,
										adminName: 'Admin User',
										adminPassword: 'Password123!',
										adminPasswordConfirm: 'Password123!',
										adminPhone: '010-1234-5678',
									}))
									toast.success('⚡ Dev Mode: Admin info auto-filled')
									setTimeout(() => setStep(4), 300)
								}} 
								variant="outline" 
								className="w-full h-12 text-base text-orange-400 border-orange-800 hover:hover:bg-orange-900/20"
							>
								⚡ Auto-fill & Next (Dev Only)
							</Button>
						</div>
						</div>
				)}

			{/* Step 4: Complete */}
			{step === 4 && (
					<div className="text-center py-8">
						<div className="w-24 h-24 rounded-full bg-green-900/30 flex items-center justify-center mx-auto mb-6">
							<Check className="h-12 w-12 text-green-400" />
						</div>
						<h3 className="text-2xl font-bold mb-2">정보 확인</h3>
						<p className="text-neutral-400 mb-8">
							등록 정보를 확인해주세요
						</p>

						<div className="max-w-md mx-auto space-y-4 mb-10">
							<div className="p-5 bg-neutral-900 rounded-2xl border border-neutral-800 text-left">
								<div className="text-sm font-medium text-neutral-400 mb-2">
									회사 정보
								</div>
								<div className="space-y-2">
									<div className="flex justify-between">
										<span className="text-sm text-neutral-400">회사명:</span>
										<span className="font-medium">{data.companyName}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm text-neutral-400">사업자번호:</span>
										<span className="font-medium">{data.businessNumber}</span>
									</div>
									{data.industry && (
										<div className="flex justify-between">
											<span className="text-sm text-neutral-400">업종:</span>
											<span className="font-medium">{data.industry}</span>
										</div>
									)}
								{(data.employeeCount || data.employeeCountExact) && (
									<div className="flex justify-between">
										<span className="text-sm text-neutral-400">직원 수:</span>
										<span className="font-medium">
											{data.employeeCountExact 
												? `${data.employeeCountExact}명` 
												: data.employeeCount}
										</span>
									</div>
								)}
								</div>
							</div>

							<div className="p-5 bg-neutral-900 rounded-2xl border border-neutral-800 text-left">
								<div className="text-sm font-medium text-neutral-400 mb-2">
									관리자
								</div>
								<div className="space-y-2">
									<div className="flex justify-between">
										<span className="text-sm text-neutral-400">이름:</span>
										<span className="font-medium">{data.adminName}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm text-neutral-400">이메일:</span>
										<span className="font-medium">{data.adminEmail}</span>
									</div>
									{data.adminPhone && (
										<div className="flex justify-between">
											<span className="text-sm text-neutral-400">전화번호:</span>
											<span className="font-medium">{data.adminPhone}</span>
										</div>
									)}
								</div>
							</div>
						</div>

							<div className="space-y-3 max-w-md mx-auto">
								<Button 
									onClick={handleSubmit} 
									className="w-full h-12 text-base"
									disabled={isLoading}
								>
									<Check className="h-5 w-5" />
									{isLoading ? '등록 중...' : '등록 완료'}
								</Button>
								<Button 
									onClick={handleSubmit} 
									variant="outline" 
									className="w-full h-12 text-base text-orange-400 border-orange-800 hover:hover:bg-orange-900/20"
									disabled={isLoading}
								>
									완료 (검증 건너뛰기)
								</Button>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

		{/* Footer */}
		<div className="text-center mt-8">
			<p className="text-sm text-neutral-400">
				이미 계정이 있으신가요?{' '}
				<button
					onClick={() => navigate('/')}
					className="text-primary hover:underline font-medium"
				>
					로그인
				</button>
			</p>
		</div>
		</div>

		<Toaster />
		</div>
	)
}
