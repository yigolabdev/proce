import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../../../components/ui/Card'
import Input from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { Mail, Lock, ArrowLeft, Check, KeyRound, Home } from 'lucide-react'
import { toast } from 'sonner'
import Toaster from '../../../components/ui/Toaster'

export default function ForgotPasswordPage() {
	const navigate = useNavigate()
	const [step, setStep] = useState(1) // 1: Email, 2: Verification Code, 3: New Password, 4: Complete
	const [email, setEmail] = useState('')
	const [verificationCode, setVerificationCode] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [countdown, setCountdown] = useState(0)

	// Mock: 인증 코드 전송
	const handleSendCode = async () => {
		if (!email) {
			toast.error('Please enter your email address')
			return
		}

		// 이메일 형식 검증
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
			toast.error('Please enter a valid email address')
			return
		}

		setIsLoading(true)

		// Mock API call
		setTimeout(() => {
			const mockCode = Math.floor(100000 + Math.random() * 900000).toString()
			console.log('Mock Verification Code:', mockCode) // 개발용
			toast.success(`Verification code sent to ${email}`)
			toast.info(`Dev Mode: Code is ${mockCode}`, { duration: 10000 })
			setStep(2)
			setCountdown(180) // 3분 카운트다운
			setIsLoading(false)
		}, 1500)
	}

	// Mock: 인증 코드 재전송
	const handleResendCode = () => {
		if (countdown > 0) {
			toast.error(`Please wait ${countdown} seconds before resending`)
			return
		}
		handleSendCode()
	}

	// Mock: 인증 코드 확인
	const handleVerifyCode = async () => {
		if (!verificationCode) {
			toast.error('Please enter the verification code')
			return
		}

		if (verificationCode.length !== 6) {
			toast.error('Verification code must be 6 digits')
			return
		}

		setIsLoading(true)

		// Mock API call
		setTimeout(() => {
			// 실제로는 서버에서 검증
			toast.success('Verification successful!')
			setStep(3)
			setIsLoading(false)
		}, 1000)
	}

	// Mock: 비밀번호 재설정
	const handleResetPassword = async () => {
		if (!newPassword || !confirmPassword) {
			toast.error('Please fill in all fields')
			return
		}

		if (newPassword.length < 8) {
			toast.error('Password must be at least 8 characters')
			return
		}

		if (newPassword !== confirmPassword) {
			toast.error('Passwords do not match')
			return
		}

		setIsLoading(true)

		// Mock API call
		setTimeout(() => {
			toast.success('Password has been reset successfully!')
			setStep(4)
			setIsLoading(false)

			// 3초 후 로그인 페이지로 이동
			setTimeout(() => {
				navigate('/')
			}, 3000)
		}, 1500)
	}

	// 카운트다운 타이머
	useState(() => {
		if (countdown > 0) {
			const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
			return () => clearTimeout(timer)
		}
	})

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60)
		const secs = seconds % 60
		return `${mins}:${secs.toString().padStart(2, '0')}`
	}

	return (
		<div className="mx-auto min-h-dvh w-full bg-neutral-950 flex items-center justify-center px-4 py-12">
			<div className="w-full max-w-md">
				{/* Top Navigation */}
				<div className="flex items-center justify-between mb-6">
					<button
						onClick={() => navigate('/')}
						className="flex items-center gap-2 text-sm text-neutral-400 hover:hover:text-primary transition-colors"
					>
						<Home className="h-4 w-4" />
						<span>Back to Home</span>
					</button>
					{step > 1 && step < 4 && (
						<button
							onClick={() => setStep(step - 1)}
							className="flex items-center gap-2 text-sm text-neutral-400 hover:hover:text-neutral-100 transition-colors"
						>
							<ArrowLeft className="h-4 w-4" />
							<span>Back</span>
						</button>
					)}
				</div>

				{/* Header */}
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
						<KeyRound className="h-8 w-8 text-primary" />
					</div>
					<h1 className="text-3xl font-bold mb-2">
						{step === 1 && 'Forgot Password?'}
						{step === 2 && 'Verify Your Email'}
						{step === 3 && 'Reset Password'}
						{step === 4 && 'Password Reset Complete'}
					</h1>
					<p className="text-neutral-400">
						{step === 1 && "Enter your email and we'll send you a verification code"}
						{step === 2 && 'Enter the 6-digit code sent to your email'}
						{step === 3 && 'Create a new password for your account'}
						{step === 4 && 'Your password has been successfully reset'}
					</p>
				</div>

				{/* Progress Indicator */}
				{step < 4 && (
					<div className="mb-8">
						<div className="flex items-center justify-center gap-2">
							{[1, 2, 3].map((s) => (
								<div
									key={s}
									className={`h-2 rounded-full transition-all duration-300 ${
										s === step
											? 'w-12 bg-primary'
											: s < step
												? 'w-8 bg-green-600'
												: 'w-8 bg-neutral-800'
									}`}
								/>
							))}
						</div>
					</div>
				)}

				{/* Form Card */}
				<Card className="shadow-xl">
					<CardContent className="p-8">
						{/* Step 1: Email Input */}
						{step === 1 && (
							<div className="space-y-6">
								<div>
									<label className="block text-sm font-medium mb-2">
										Email Address <span className="text-red-500">*</span>
									</label>
									<div className="relative">
										<Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
										<Input
											type="email"
											placeholder="your.email@company.com"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											onKeyPress={(e) => e.key === 'Enter' && handleSendCode()}
											className="h-12 pl-12"
											disabled={isLoading}
										/>
									</div>
								</div>
								<Button
									onClick={handleSendCode}
									disabled={isLoading}
									className="w-full h-12 text-base"
								>
									{isLoading ? 'Sending...' : 'Send Verification Code'}
								</Button>
							</div>
						)}

						{/* Step 2: Verification Code */}
						{step === 2 && (
							<div className="space-y-6">
								<div>
									<label className="block text-sm font-medium mb-2">
										Verification Code <span className="text-red-500">*</span>
									</label>
									<Input
										type="text"
										placeholder="000000"
										value={verificationCode}
										onChange={(e) => {
											const value = e.target.value.replace(/\D/g, '').slice(0, 6)
											setVerificationCode(value)
										}}
										onKeyPress={(e) => e.key === 'Enter' && handleVerifyCode()}
										className="h-12 text-center text-2xl tracking-widest font-bold"
										disabled={isLoading}
										maxLength={6}
									/>
									<div className="flex items-center justify-between mt-2">
										<p className="text-xs text-neutral-400">
											Code sent to: <span className="font-medium">{email}</span>
										</p>
										{countdown > 0 && (
											<p className="text-xs font-medium text-primary">
												{formatTime(countdown)}
											</p>
										)}
									</div>
								</div>

								<Button
									onClick={handleVerifyCode}
									disabled={isLoading || verificationCode.length !== 6}
									className="w-full h-12 text-base"
								>
									{isLoading ? 'Verifying...' : 'Verify Code'}
								</Button>

								<div className="text-center">
									<button
										onClick={handleResendCode}
										disabled={countdown > 0}
										className={`text-sm ${
											countdown > 0
												? 'text-neutral-400 cursor-not-allowed'
												: 'text-primary hover:underline'
										}`}
									>
										{countdown > 0
											? `Resend code in ${formatTime(countdown)}`
											: "Didn't receive code? Resend"}
									</button>
								</div>
							</div>
						)}

						{/* Step 3: New Password */}
						{step === 3 && (
							<div className="space-y-6">
								<div>
									<label className="block text-sm font-medium mb-2">
										New Password <span className="text-red-500">*</span>
									</label>
									<div className="relative">
										<Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
										<Input
											type="password"
											placeholder="Minimum 8 characters"
											value={newPassword}
											onChange={(e) => setNewPassword(e.target.value)}
											className="h-12 pl-12"
											disabled={isLoading}
										/>
									</div>
									<p className="text-xs text-neutral-400 mt-1">
										Must be at least 8 characters
									</p>
								</div>

								<div>
									<label className="block text-sm font-medium mb-2">
										Confirm Password <span className="text-red-500">*</span>
									</label>
									<div className="relative">
										<Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
										<Input
											type="password"
											placeholder="Re-enter your password"
											value={confirmPassword}
											onChange={(e) => setConfirmPassword(e.target.value)}
											onKeyPress={(e) => e.key === 'Enter' && handleResetPassword()}
											className="h-12 pl-12"
											disabled={isLoading}
										/>
									</div>
									{confirmPassword && newPassword !== confirmPassword && (
										<p className="text-xs text-red-500 mt-1">Passwords do not match</p>
									)}
								</div>

								<Button
									onClick={handleResetPassword}
									disabled={isLoading || !newPassword || !confirmPassword}
									className="w-full h-12 text-base"
								>
									{isLoading ? 'Resetting...' : 'Reset Password'}
								</Button>
							</div>
						)}

						{/* Step 4: Complete */}
						{step === 4 && (
							<div className="text-center py-8">
								<div className="w-20 h-20 rounded-full bg-green-900/30 flex items-center justify-center mx-auto mb-6">
									<Check className="h-10 w-10 text-green-400" />
								</div>
								<h3 className="text-2xl font-bold mb-2">Success!</h3>
								<p className="text-neutral-400 mb-8">
									Your password has been reset successfully.
									<br />
									Redirecting to sign in page...
								</p>
								<Button onClick={() => navigate('/')} className="w-full h-12 text-base">
									Go to Sign In
								</Button>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Footer */}
				{step < 4 && (
					<div className="text-center mt-6">
						<p className="text-sm text-neutral-400">
							Remember your password?{' '}
							<button
								onClick={() => navigate('/')}
								className="text-primary hover:underline font-medium"
							>
								Sign In
							</button>
						</p>
					</div>
				)}
			</div>

			<Toaster />
		</div>
	)
}

