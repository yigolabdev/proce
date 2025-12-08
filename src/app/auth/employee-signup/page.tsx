import { storage } from '../../../utils/storage'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '../../../components/ui/Card'
import Input from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { Users, ArrowLeft, Key, Building2, Mail, Lock, User, Phone, Briefcase, UserCog, Plus, X } from 'lucide-react'
import { toast } from 'sonner'

interface Department {
	id: string
	name: string
	isDefaultIntake: boolean
}

interface EmployeeData {
	inviteCode: string
	username: string
	name: string
	email: string
	password: string
	passwordConfirm: string
	phone: string
	countryCode: string
	department: string
	position: string
	jobs: string[] // Multiple jobs support
}

export default function EmployeeSignUpPage() {
	const navigate = useNavigate()
	const [step, setStep] = useState(1) // 1: invite code, 2: employee info
	const [data, setData] = useState<EmployeeData>({
		inviteCode: '',
		username: '',
		name: '',
		email: '',
		password: '',
		passwordConfirm: '',
		phone: '',
		countryCode: '+82', // Default to South Korea
		department: '',
		position: '',
		jobs: [], // Multiple jobs support
	})
	const [companyInfo, setCompanyInfo] = useState<{ name: string; industry: string } | null>(null)
	const [departments, setDepartments] = useState<Department[]>([])
	const [availableJobs, setAvailableJobs] = useState<{id: string, title: string}[]>([])
	const [showCustomDepartment, setShowCustomDepartment] = useState(false)
	const [showCustomPosition, setShowCustomPosition] = useState(false)
	const [customDepartment, setCustomDepartment] = useState('')
	const [customPosition, setCustomPosition] = useState('')
	const [selectedJobId, setSelectedJobId] = useState('')
	
	// Email verification states
	const [isCodeSent, setIsCodeSent] = useState(false)
	const [sentCode, setSentCode] = useState('')
	const [verificationCode, setVerificationCode] = useState('')
	const [timeLeft, setTimeLeft] = useState(0)
	const [isEmailVerified, setIsEmailVerified] = useState(false)
	
	// TODO: Remove development features before production deployment
	// Development mode check
	const isDevelopment = true // import.meta.env.DEV
	
	// Timer effect for email verification
	useEffect(() => {
		if (timeLeft > 0) {
			const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
			return () => clearTimeout(timer)
		}
	}, [timeLeft])
	
	// Country codes for phone numbers
	const countryCodes = [
		{ code: '+82', country: '🇰🇷 South Korea', flag: '🇰🇷' },
		{ code: '+1', country: '🇺🇸 United States', flag: '🇺🇸' },
		{ code: '+86', country: '🇨🇳 China', flag: '🇨🇳' },
		{ code: '+81', country: '🇯🇵 Japan', flag: '🇯🇵' },
		{ code: '+44', country: '🇬🇧 United Kingdom', flag: '🇬🇧' },
		{ code: '+49', country: '🇩🇪 Germany', flag: '🇩🇪' },
		{ code: '+33', country: '🇫🇷 France', flag: '🇫🇷' },
		{ code: '+61', country: '🇦🇺 Australia', flag: '🇦🇺' },
		{ code: '+65', country: '🇸🇬 Singapore', flag: '🇸🇬' },
		{ code: '+91', country: '🇮🇳 India', flag: '🇮🇳' },
		{ code: '+55', country: '🇧🇷 Brazil', flag: '🇧🇷' },
		{ code: '+7', country: '🇷🇺 Russia', flag: '🇷🇺' },
		{ code: '+34', country: '🇪🇸 Spain', flag: '🇪🇸' },
		{ code: '+39', country: '🇮🇹 Italy', flag: '🇮🇹' },
		{ code: '+852', country: '🇭🇰 Hong Kong', flag: '🇭🇰' },
		{ code: '+886', country: '🇹🇼 Taiwan', flag: '🇹🇼' },
	]
	
	// Common job positions (International standards)
	const positions = [
		{ value: 'intern', label: 'Intern' },
		{ value: 'junior', label: 'Junior' },
		{ value: 'staff', label: 'Staff' },
		{ value: 'senior-staff', label: 'Senior Staff' },
		{ value: 'associate', label: 'Associate' },
		{ value: 'senior-associate', label: 'Senior Associate' },
		{ value: 'manager', label: 'Manager' },
		{ value: 'senior-manager', label: 'Senior Manager' },
		{ value: 'director', label: 'Director' },
		{ value: 'senior-director', label: 'Senior Director' },
		{ value: 'vp', label: 'Vice President' },
		{ value: 'svp', label: 'Senior Vice President' },
		{ value: 'cxo', label: 'C-Level Executive' },
		{ value: 'custom', label: '✏️ Custom (Enter manually)' },
	]
	
	// Load departments and jobs from Organization Setup
	useEffect(() => {
		const loadDepartments = () => {
			try {
				const savedSettings = storage.get<any>('workspaceSettings')
				if (savedSettings) {
					const settings = JSON.parse(savedSettings)
					if (settings.deptRole && settings.deptRole.departments && settings.deptRole.departments.length > 0) {
						setDepartments(settings.deptRole.departments)
						return
					}
				}
				
				// If no departments configured, use mock data
				const mockDepartments: Department[] = [
					{ id: '1', name: 'Engineering', isDefaultIntake: true },
					{ id: '2', name: 'Product', isDefaultIntake: false },
					{ id: '3', name: 'Design', isDefaultIntake: false },
					{ id: '4', name: 'Marketing', isDefaultIntake: false },
					{ id: '5', name: 'Sales', isDefaultIntake: false },
					{ id: '6', name: 'Human Resources', isDefaultIntake: false },
					{ id: '7', name: 'Finance', isDefaultIntake: false },
					{ id: '8', name: 'Operations', isDefaultIntake: false },
					{ id: '9', name: 'Customer Success', isDefaultIntake: false },
					{ id: '10', name: 'Legal', isDefaultIntake: false },
				]
				setDepartments(mockDepartments)
			} catch (error) {
				console.error('Failed to load departments:', error)
				// Fallback to mock data on error
				const mockDepartments: Department[] = [
					{ id: '1', name: 'Engineering', isDefaultIntake: true },
					{ id: '2', name: 'Product', isDefaultIntake: false },
					{ id: '3', name: 'Design', isDefaultIntake: false },
					{ id: '4', name: 'Marketing', isDefaultIntake: false },
					{ id: '5', name: 'Sales', isDefaultIntake: false },
				]
				setDepartments(mockDepartments)
			}
		}
		
		const loadJobs = () => {
			try {
				const savedJobs = storage.get<any>('jobs')
				if (savedJobs) {
					const jobs = JSON.parse(savedJobs)
					setAvailableJobs(jobs)
				} else {
					// Fallback to mock data
					const mockJobs = [
						{ id: '1', title: 'Frontend Development' },
						{ id: '2', title: 'Backend Development' },
						{ id: '3', title: 'UI/UX Design' },
						{ id: '4', title: 'Product Management' },
						{ id: '5', title: 'Data Analysis' },
						{ id: '6', title: 'DevOps Engineering' },
						{ id: '7', title: 'Quality Assurance' },
						{ id: '8', title: 'Technical Writing' },
						{ id: '9', title: 'Project Management' },
						{ id: '10', title: 'Business Analysis' },
						{ id: '11', title: 'Database Administration' },
						{ id: '12', title: 'Security Engineering' },
						{ id: '13', title: 'Mobile Development' },
						{ id: '14', title: 'Machine Learning' },
						{ id: '15', title: 'System Architecture' },
					]
					setAvailableJobs(mockJobs)
				}
			} catch (error) {
				console.error('Failed to load jobs:', error)
				const mockJobs = [
					{ id: '1', title: 'Frontend Development' },
					{ id: '2', title: 'Backend Development' },
					{ id: '3', title: 'UI/UX Design' },
					{ id: '4', title: 'Product Management' },
					{ id: '5', title: 'Data Analysis' },
					{ id: '6', title: 'DevOps Engineering' },
					{ id: '7', title: 'Quality Assurance' },
					{ id: '8', title: 'Technical Writing' },
					{ id: '9', title: 'Project Management' },
					{ id: '10', title: 'Business Analysis' },
					{ id: '11', title: 'Database Administration' },
					{ id: '12', title: 'Security Engineering' },
					{ id: '13', title: 'Mobile Development' },
					{ id: '14', title: 'Machine Learning' },
					{ id: '15', title: 'System Architecture' },
				]
				setAvailableJobs(mockJobs)
			}
		}
		
		if (step === 2) {
			loadDepartments()
			loadJobs()
		}
	}, [step])

	const handleChange = (field: keyof EmployeeData, value: string) => {
		setData((prev) => ({ ...prev, [field]: value }))
	}

	// Send email verification code
	const handleSendCode = async () => {
		if (!data.email) {
			toast.error('Please enter your email address')
			return
		}
		
		// Simple email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(data.email)) {
			toast.error('Please enter a valid email address')
			return
		}
		
		// Generate random 6-digit code
		const code = Math.floor(100000 + Math.random() * 900000).toString()
		setSentCode(code)
		setIsCodeSent(true)
		setTimeLeft(180) // 3 minutes
		
		// TODO: Replace with actual API call to send email
		toast.success(`Verification code sent to ${data.email}`)
		toast.info(`Demo code: ${code}`, { duration: 5000 })
	}
	
	// Verify email code
	const handleVerifyEmailCode = async () => {
		if (!verificationCode) {
			toast.error('Please enter the verification code')
			return
		}
		
		if (verificationCode !== sentCode) {
			toast.error('Invalid verification code')
			return
		}
		
		setIsEmailVerified(true)
		toast.success('Email verified successfully!')
	}
	
	// Resend verification code
	const handleResendCode = () => {
		handleSendCode()
	}

	const handleVerifyCode = async () => {
		if (!data.inviteCode) {
			toast.error('Please enter the invite code')
			return
		}
		
		if (!isEmailVerified) {
			toast.error('Please verify your email first')
			return
		}

		// Mock API call - verify invite code
		if (data.inviteCode.length < 6) {
			toast.error('Please enter a valid invite code')
			return
		}

		// Mock company info
		setCompanyInfo({
			name: 'Tech Company Inc.',
			industry: 'IT/Software',
		})
		toast.success('Invite code verified successfully')
		setStep(2)
	}

	const handleSubmit = async () => {
		if (!data.username || !data.name || !data.email || !data.password) {
			toast.error('Please fill in all required fields')
			return
		}
		if (data.username.length < 3) {
			toast.error('Username must be at least 3 characters')
			return
		}
		if (data.password !== data.passwordConfirm) {
			toast.error('Passwords do not match')
			return
		}

		// Use custom department if selected
		const finalDepartment = showCustomDepartment ? customDepartment : data.department
		const finalPosition = showCustomPosition ? customPosition : data.position

		if (!finalDepartment || !finalPosition) {
			toast.error('Please select or enter department and position')
			return
		}

		// Mock API call
		console.log('Submitting with:', {
			...data,
			department: finalDepartment,
			position: finalPosition,
			jobs: data.jobs,
		})
		
		toast.success('Employee registration completed successfully! Please sign in.')
		setTimeout(() => {
			navigate('/')
		}, 1500)
	}

	const handleDepartmentChange = (value: string) => {
		if (value === 'custom') {
			setShowCustomDepartment(true)
			handleChange('department', '')
		} else {
			setShowCustomDepartment(false)
			setCustomDepartment('')
			handleChange('department', value)
		}
	}

	const handlePositionChange = (value: string) => {
		if (value === 'custom') {
			setShowCustomPosition(true)
			handleChange('position', '')
		} else {
			setShowCustomPosition(false)
			setCustomPosition('')
			handleChange('position', value)
		}
	}

	const handleAddJob = () => {
		if (!selectedJobId) {
			toast.error('Please select a job')
			return
		}

		const selectedJob = availableJobs.find((job) => job.id === selectedJobId)
		if (!selectedJob) return

		// Check if job already exists
		if (data.jobs.includes(selectedJob.title)) {
			toast.error('This job is already added')
			return
		}

		// Add to jobs array
		setData((prev) => ({
			...prev,
			jobs: [...prev.jobs, selectedJob.title],
		}))

		setSelectedJobId('')
		toast.success('Job added successfully!')
	}

	const handleRemoveJob = (jobTitle: string) => {
		setData((prev) => ({
			...prev,
			jobs: prev.jobs.filter((j) => j !== jobTitle),
		}))
	}

	return (
		<div className="mx-auto min-h-dvh w-full max-w-2xl px-4 py-12">
			<div className="mb-8">
			<button
				onClick={() => step === 1 ? navigate('/auth/sign-up') : setStep(1)}
				className="flex items-center gap-2 text-sm text-neutral-400 hover:hover:text-neutral-100 transition-colors mb-4"
			>
				<ArrowLeft className="h-4 w-4" />
				Back
			</button>
			<h1 className="text-3xl font-bold flex items-center gap-3">
				<Users className="h-8 w-8 text-green-400" />
				Employee Sign Up
			</h1>
			<p className="mt-2 text-neutral-300">
				Join your company using the invite code from your administrator
			</p>
		</div>

		<Card>
			<CardHeader>
				<h2 className="text-xl font-bold">
					{step === 1 && 'Enter Invite Code'}
					{step === 2 && 'Employee Information'}
				</h2>
			</CardHeader>
			<CardContent>
			{/* Step 1: Invite Code */}
			{step === 1 && (
				<div className="space-y-6">
					<div className="text-center py-8">
						<div className="w-20 h-20 rounded-full bg-green-900/30 flex items-center justify-center mx-auto mb-6">
							<Key className="h-10 w-10 text-green-400" />
						</div>
						<p className="text-neutral-400 mb-6">
							Verify your email and enter the invite code from your administrator
						</p>
					</div>

					{/* Email Input & Verification */}
					<div>
						<label className="block text-sm font-medium mb-2">
							Email Address <span className="text-red-500">*</span>
						</label>
						<div className="flex gap-2">
							<Input
								type="email"
								placeholder="your.email@company.com"
								value={data.email}
								onChange={(e) => handleChange('email', e.target.value)}
								disabled={isEmailVerified}
								className={isEmailVerified ? 'bg-green-900/20 border-green-500' : ''}
							/>
							{!isEmailVerified && (
								<Button
									onClick={handleSendCode}
									variant="outline"
									disabled={isCodeSent && timeLeft > 0}
									className="whitespace-nowrap"
								>
									{isCodeSent && timeLeft > 0 ? `Resend (${timeLeft}s)` : 'Send Code'}
								</Button>
							)}
							{isEmailVerified && (
								<Button variant="outline" disabled className="bg-green-900/20 border-green-500 text-green-400">
									✓ Verified
								</Button>
							)}
						</div>
						{!isEmailVerified && (
							<p className="text-xs text-neutral-400 mt-2">
								💡 Use your company email address
							</p>
						)}
						{isEmailVerified && (
							<p className="text-xs text-green-400 mt-2">
								✓ Email verified successfully
							</p>
						)}
					</div>

					{/* Email Verification Code Input */}
					{isCodeSent && !isEmailVerified && (
						<div className="space-y-4 pt-4 border-t border-neutral-800">
							<div>
								<label className="block text-sm font-medium mb-2">
									Verification Code <span className="text-red-500">*</span>
								</label>
								<Input
									type="text"
									placeholder="Enter 6-digit code"
									value={verificationCode}
									onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
									className="text-center text-lg font-mono tracking-wider"
									maxLength={6}
								/>
								<div className="flex items-center justify-between mt-2">
									<p className="text-xs text-neutral-400">
										Code sent to {data.email}
									</p>
									{timeLeft > 0 ? (
										<p className="text-xs text-orange-400 font-mono">
											{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
										</p>
									) : (
										<button
											onClick={handleResendCode}
											className="text-xs text-green-400 hover:underline"
										>
											Resend code
										</button>
									)}
								</div>
							</div>
							<Button onClick={handleVerifyEmailCode} className="w-full">
								Verify Email
							</Button>
						</div>
					)}

					{/* Invite Code Input - Only show after email verification */}
					{isEmailVerified && (
						<div className="pt-4 border-t border-neutral-800">
							<label className="block text-sm font-medium mb-2">
								Invite Code <span className="text-red-500">*</span>
							</label>
							<Input
								type="text"
								placeholder="e.g., ABC12345"
								value={data.inviteCode}
								onChange={(e) => handleChange('inviteCode', e.target.value.toUpperCase())}
								className="text-center text-lg font-mono tracking-wider"
							/>
							<p className="text-xs text-neutral-400 mt-2">
								Enter the invite code from your administrator
							</p>
						</div>
					)}

					{isEmailVerified && (
						<Button onClick={handleVerifyCode} className="w-full">
							Verify & Continue
						</Button>
					)}

					{/* Development: Skip to Step 2 */}
					{isDevelopment && (
						<div className="pt-4 border-t border-dashed border-neutral-700">
							<p className="text-xs text-neutral-500 mb-2 text-center">
								🔧 Development Mode
							</p>
							<Button
								variant="outline"
								onClick={() => {
									setData(prev => ({ ...prev, email: 'employee@company.com' }))
									setIsEmailVerified(true)
									setCompanyInfo({
										name: 'Tech Company Inc.',
										industry: 'IT/Software',
									})
									setStep(2)
									toast.info('Skipped to Step 2 (Dev Mode)')
								}}
								className="w-full border-dashed"
							>
								⚡ Skip to Step 2
							</Button>
						</div>
					)}
				</div>
			)}

				{/* Step 2: Employee Info */}
				{step === 2 && (
					<div className="space-y-6">
						{/* Company Info Display */}
						{companyInfo && (
							<div className="p-4 bg-green-900/20 border border-green-800 rounded-2xl">
								<div className="flex items-center gap-3 mb-2">
									<Building2 className="h-5 w-5 text-green-400" />
									<span className="font-bold text-green-100">
										{companyInfo.name}
									</span>
								</div>
								<p className="text-sm text-green-300">
									{companyInfo.industry}
								</p>
							</div>
					)}

					<div className="space-y-4">
						{/* Username Field */}
						<div>
							<label className="block text-sm font-medium mb-2">
								<UserCog className="inline h-4 w-4 mr-1" />
								User Name <span className="text-red-500">*</span>
							</label>
							<Input
								type="text"
								placeholder="Enter your username (e.g., john.doe)"
								value={data.username}
								onChange={(e) => handleChange('username', e.target.value.toLowerCase().replace(/\s/g, ''))}
								className="font-mono"
							/>
							<p className="text-xs text-neutral-400 mt-1">
								💡 This will be your unique ID for login
							</p>
						</div>

						<div>
							<label className="block text-sm font-medium mb-2">
								<User className="inline h-4 w-4 mr-1" />
								Full Name <span className="text-red-500">*</span>
							</label>
							<Input
								type="text"
								placeholder="Enter your full name"
								value={data.name}
								onChange={(e) => handleChange('name', e.target.value)}
							/>
						</div>

						<div>
							<label className="block text-sm font-medium mb-2">
								<Mail className="inline h-4 w-4 mr-1" />
								Email <span className="text-green-400 text-xs">(Verified)</span>
							</label>
							<Input
								type="email"
								placeholder="your.email@company.com"
								value={data.email}
								disabled
								className="bg-green-900/20 border-green-500"
							/>
							<p className="text-xs text-green-400 mt-1">
								✓ This email has been verified
							</p>
						</div>

							<div>
								<label className="block text-sm font-medium mb-2">
									<Lock className="inline h-4 w-4 mr-1" />
									Password <span className="text-red-500">*</span>
								</label>
								<Input
									type="password"
									placeholder="At least 8 characters"
									value={data.password}
									onChange={(e) => handleChange('password', e.target.value)}
								/>
							</div>

							<div>
								<label className="block text-sm font-medium mb-2">
									<Lock className="inline h-4 w-4 mr-1" />
									Confirm Password <span className="text-red-500">*</span>
								</label>
								<Input
									type="password"
									placeholder="Re-enter your password"
									value={data.passwordConfirm}
									onChange={(e) => handleChange('passwordConfirm', e.target.value)}
								/>
							</div>

							<div>
								<label className="block text-sm font-medium mb-2">
									<Phone className="inline h-4 w-4 mr-1" />
									Phone Number
								</label>
								<div className="flex gap-2">
									<select
										value={data.countryCode}
										onChange={(e) => handleChange('countryCode', e.target.value)}
										className="w-32 px-3 py-2 border border-neutral-700 rounded-2xl bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
									>
										{countryCodes.map((country) => (
											<option key={country.code} value={country.code}>
												{country.flag} {country.code}
											</option>
										))}
									</select>
									<Input
										type="tel"
										placeholder="10-1234-5678"
										value={data.phone}
										onChange={(e) => handleChange('phone', e.target.value)}
										className="flex-1"
									/>
								</div>
								<p className="text-xs text-neutral-500 mt-1">
									Enter your phone number without country code
								</p>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium mb-2">
										<Briefcase className="inline h-4 w-4 mr-1" />
										Department
									</label>
									<select
										value={showCustomDepartment ? 'custom' : data.department}
										onChange={(e) => handleDepartmentChange(e.target.value)}
										className="w-full px-4 py-2 border border-neutral-700 rounded-2xl bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary"
									>
										<option value="">-- Select Department --</option>
										{departments.map((dept) => (
											<option key={dept.id} value={dept.name}>
												{dept.name}
												{dept.isDefaultIntake && ' (Default)'}
											</option>
										))}
										<option value="custom">✏️ Custom (Enter manually)</option>
									</select>
									{showCustomDepartment && (
										<Input
											type="text"
											placeholder="Enter department name"
											value={customDepartment}
											onChange={(e) => setCustomDepartment(e.target.value)}
											className="mt-2"
										/>
									)}
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">
										<UserCog className="inline h-4 w-4 mr-1" />
										Position
									</label>
									<select
										value={showCustomPosition ? 'custom' : data.position}
										onChange={(e) => handlePositionChange(e.target.value)}
										className="w-full px-4 py-2 border border-neutral-700 rounded-2xl bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary"
									>
										<option value="">-- Select Position --</option>
										{positions.map((pos) => (
											<option key={pos.value} value={pos.value}>
												{pos.label}
											</option>
										))}
									</select>
									{showCustomPosition && (
										<Input
											type="text"
											placeholder="Enter position title"
											value={customPosition}
											onChange={(e) => setCustomPosition(e.target.value)}
											className="mt-2"
										/>
									)}
								</div>
							</div>

						{/* Roles & Responsibilities Selection */}
						<div>
							<label className="block text-sm font-medium mb-2">
								<Briefcase className="inline h-4 w-4 mr-1" />
								Roles & Responsibilities <span className="text-neutral-500 text-xs">(Add multiple)</span>
							</label>
								<div className="space-y-3">
									{/* Dropdown and Add Button */}
									<div className="flex gap-2">
										<select
											value={selectedJobId}
											onChange={(e) => setSelectedJobId(e.target.value)}
											className="flex-1 px-4 py-2 border border-neutral-700 rounded-2xl bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary"
										>
											<option value="">-- Select a job to add --</option>
											{availableJobs
												.filter((job) => !data.jobs.includes(job.title))
												.map((job) => (
													<option key={job.id} value={job.id}>
														{job.title}
													</option>
												))}
										</select>
										<Button 
											type="button"
											onClick={handleAddJob} 
											size="sm"
											disabled={!selectedJobId}
											className="px-4"
										>
											<Plus className="h-4 w-4 mr-1" />
											Add
										</Button>
									</div>

								{/* Selected Roles Display */}
								{data.jobs.length > 0 ? (
									<div className="p-4 border border-neutral-700 rounded-2xl bg-neutral-900/50">
										<p className="text-xs font-medium text-neutral-400 mb-3">
											Selected Roles ({data.jobs.length})
										</p>
											<div className="flex flex-wrap gap-2">
												{data.jobs.map((job) => (
													<div
														key={job}
														className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm border border-primary/20"
													>
														<span className="font-medium">{job}</span>
														<button
															onClick={() => handleRemoveJob(job)}
															className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
															type="button"
														>
															<X className="h-3 w-3" />
														</button>
													</div>
												))}
											</div>
										</div>
								) : (
									<div className="p-4 border border-dashed border-neutral-700 rounded-2xl bg-neutral-900/50 text-center">
										<p className="text-sm text-neutral-400">
											No roles added yet. Select from the dropdown above.
										</p>
									</div>
								)}

								{availableJobs.length === 0 && (
									<p className="text-xs text-neutral-400 mt-2">
										💡 No roles available yet. Contact your administrator.
									</p>
								)}
								</div>
							</div>
						</div>

						<Button onClick={handleSubmit} className="w-full mt-6">
							Complete Registration
						</Button>

						{/* Development: Skip to Login */}
						{isDevelopment && (
							<div className="pt-4 mt-4 border-t border-dashed border-neutral-700">
								<p className="text-xs text-neutral-500 mb-2 text-center">
									🔧 Development Mode
								</p>
								<div className="grid grid-cols-2 gap-2">
									<Button
										variant="outline"
										onClick={() => {
											toast.success('Skipped to Landing/Login (Dev Mode)')
											navigate('/')
										}}
										className="border-dashed"
									>
										⚡ Skip to Login
									</Button>
									<Button
										variant="outline"
									onClick={() => {
										// Simulate successful login for development
					const mockUser = {
						id: 'dev-user-001',
						name: 'Dev User',
						email: 'dev@example.com',
						role: 'user' as const,
						department: 'Engineering',
						position: 'Developer',
						jobs: ['Frontend Development', 'Backend Development'],
					}
											localStorage.setItem('proce:user', JSON.stringify(mockUser))
											toast.success('Auto-logged in (Dev Mode)')
											navigate('/app/dashboard')
										}}
										className="border-dashed"
									>
										⚡ Skip to Dashboard
									</Button>
								</div>
							</div>
						)}
					</div>
				)}
			</CardContent>
		</Card>
		</div>
	)
}
