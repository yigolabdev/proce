import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import {
	Settings as SettingsIcon,
	User,
	Mail,
	Lock,
	Phone,
	Building,
	Calendar,
	Save,
	Eye,
	EyeOff,
	CheckCircle2,
	AlertCircle,
	Bell,
	Globe,
	Clock,
	Briefcase,
	Upload,
	Camera,
	Languages,
	Plus,
	X,
} from 'lucide-react'
import { toast } from 'sonner'
import Toaster from '../../components/ui/Toaster'
import { useAuth } from '../../context/AuthContext'

interface UserProfile {
	// Basic Info
	name: string
	email: string
	phone: string
	birthDate: string
	
	// Work Info
	department: string
	position: string
	jobs: string[] // Multiple jobs support
	employeeId: string
	joinDate: string
	manager: string
	workLocation: string
	
	// Contact Info
	emergencyContact: string
	emergencyPhone: string
	address: string
	city: string
	country: string
	postalCode: string
	
	// Bio & Social
	bio: string
	skills: string[]
	linkedin: string
	github: string
	twitter: string
	website: string
	
	// Preferences
	timezone: string
	language: string
	dateFormat: string
	timeFormat: '12h' | '24h'
}

interface NotificationSettings {
	email: boolean
	push: boolean
	desktop: boolean
	sms: boolean
	weeklyReport: boolean
	monthlyReport: boolean
	taskAssigned: boolean
	taskDue: boolean
	mentions: boolean
	comments: boolean
}

export default function SettingsPage() {
	const { user } = useAuth()
	const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'notifications'>('profile')
	
	// Profile states
	const [profile, setProfile] = useState<UserProfile>({
		name: '',
		email: '',
		phone: '',
		birthDate: '',
		department: '',
		position: '',
		jobs: [], // Multiple jobs support
		employeeId: '',
		joinDate: '',
		manager: '',
		workLocation: '',
		emergencyContact: '',
		emergencyPhone: '',
		address: '',
		city: '',
		country: '',
		postalCode: '',
		bio: '',
		skills: [],
		linkedin: '',
		github: '',
		twitter: '',
		website: '',
		timezone: 'UTC',
		language: 'en',
		dateFormat: 'MM/DD/YYYY',
		timeFormat: '12h',
	})
	const [originalProfile, setOriginalProfile] = useState<UserProfile>(profile)
	const [skillInput, setSkillInput] = useState('')
	const [availableJobs, setAvailableJobs] = useState<{id: string, title: string}[]>([])
	const [departments, setDepartments] = useState<{id: string, name: string}[]>([])
	const [positions, setPositions] = useState<{id: string, name: string}[]>([])
	const [customJobInput, setCustomJobInput] = useState('')

	// Password states
	const [currentPassword, setCurrentPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [showCurrentPassword, setShowCurrentPassword] = useState(false)
	const [showNewPassword, setShowNewPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)

	// Notification states
	const [notifications, setNotifications] = useState<NotificationSettings>({
		email: true,
		push: true,
		desktop: true,
		sms: false,
		weeklyReport: true,
		monthlyReport: false,
		taskAssigned: true,
		taskDue: true,
		mentions: true,
		comments: true,
	})

	useEffect(() => {
		loadSettings()
		loadAvailableJobs()
		loadDepartments()
		loadPositions()
	}, [user])

	const loadSettings = () => {
		// Load profile
		const savedProfile = localStorage.getItem('userProfile')
		if (savedProfile) {
			const parsed = JSON.parse(savedProfile)
			setProfile(parsed)
			setOriginalProfile(parsed)
		} else {
			const mockProfile: UserProfile = {
				name: user?.name || 'John Doe',
				email: user?.email || 'john.doe@company.com',
				phone: '+1 (555) 123-4567',
				birthDate: '1990-01-15',
				department: 'Engineering',
				position: 'Senior Developer',
				jobs: ['Frontend Development', 'Backend Development'],
				employeeId: 'EMP-2023-001',
				joinDate: '2023-01-15',
				manager: 'Jane Smith',
				workLocation: 'New York Office',
				emergencyContact: 'Jane Doe',
				emergencyPhone: '+1 (555) 987-6543',
				address: '123 Main Street',
				city: 'New York',
				country: 'United States',
				postalCode: '10001',
				bio: 'Passionate software developer with 5+ years of experience in full-stack development.',
				skills: ['React', 'TypeScript', 'Node.js', 'Python'],
				linkedin: 'https://linkedin.com/in/johndoe',
				github: 'https://github.com/johndoe',
				twitter: 'https://twitter.com/johndoe',
				website: 'https://johndoe.dev',
				timezone: 'America/New_York',
				language: 'en',
				dateFormat: 'MM/DD/YYYY',
				timeFormat: '12h',
			}
			setProfile(mockProfile)
			setOriginalProfile(mockProfile)
		}

		// Load notifications
		const savedNotifications = localStorage.getItem('notificationSettings')
		if (savedNotifications) {
			setNotifications(JSON.parse(savedNotifications))
		}
	}

	const loadAvailableJobs = () => {
		try {
			const savedJobs = localStorage.getItem('jobs')
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
		}
	}

	const loadDepartments = () => {
		try {
			const savedDepartments = localStorage.getItem('departments')
			if (savedDepartments) {
				const depts = JSON.parse(savedDepartments)
				setDepartments(depts.map((d: any) => ({ id: d.id, name: d.name })))
			} else {
				// Fallback to mock data
				const mockDepts = [
					{ id: '1', name: 'Engineering' },
					{ id: '2', name: 'Product' },
					{ id: '3', name: 'Marketing' },
				]
				setDepartments(mockDepts)
			}
		} catch (error) {
			console.error('Failed to load departments:', error)
		}
	}

	const loadPositions = () => {
		try {
			const savedPositions = localStorage.getItem('positions')
			if (savedPositions) {
				const pos = JSON.parse(savedPositions)
				setPositions(pos.map((p: any) => ({ id: p.id, name: p.name })))
			} else {
				// Fallback to mock data
				const mockPos = [
					{ id: '1', name: 'Software Engineer' },
					{ id: '2', name: 'Senior Software Engineer' },
					{ id: '3', name: 'Product Manager' },
				]
				setPositions(mockPos)
			}
		} catch (error) {
			console.error('Failed to load positions:', error)
		}
	}

	const handleProfileChange = (field: keyof UserProfile, value: any) => {
		setProfile((prev) => ({ ...prev, [field]: value }))
	}

	const handleRemoveJob = (jobTitle: string) => {
		setProfile((prev) => ({
			...prev,
			jobs: prev.jobs.filter((j) => j !== jobTitle),
		}))
	}

	const handleAddCustomJob = () => {
		if (!customJobInput.trim()) {
			toast.error('Please select a job')
			return
		}

		// Check if job already exists in profile
		if (profile.jobs.includes(customJobInput.trim())) {
			toast.error('This job is already selected')
			return
		}

		// Add to profile
		setProfile((prev) => ({
			...prev,
			jobs: [...prev.jobs, customJobInput.trim()],
		}))

		setCustomJobInput('')
		toast.success('Job added successfully!')
	}

	const handleAddSkill = () => {
		if (skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
			setProfile((prev) => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }))
			setSkillInput('')
		}
	}

	const handleRemoveSkill = (skill: string) => {
		setProfile((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }))
	}

	const handleSaveProfile = () => {
		try {
			localStorage.setItem('userProfile', JSON.stringify(profile))
			setOriginalProfile(profile)
			toast.success('Profile updated successfully!')
		} catch (error) {
			console.error('Failed to save profile:', error)
			toast.error('Failed to save profile')
		}
	}

	const handleCancelProfile = () => {
		setProfile(originalProfile)
		toast.info('Changes cancelled')
	}

	const handlePasswordChange = () => {
		if (!currentPassword || !newPassword || !confirmPassword) {
			toast.error('Please fill in all password fields')
			return
		}

		if (newPassword.length < 8) {
			toast.error('New password must be at least 8 characters')
			return
		}

		if (newPassword !== confirmPassword) {
			toast.error('New passwords do not match')
			return
		}

		try {
			toast.success('Password changed successfully!')
			setCurrentPassword('')
			setNewPassword('')
			setConfirmPassword('')
		} catch (error) {
			console.error('Failed to change password:', error)
			toast.error('Failed to change password')
		}
	}

	const handleSaveNotifications = () => {
		try {
			localStorage.setItem('notificationSettings', JSON.stringify(notifications))
			toast.success('Notification settings saved!')
		} catch (error) {
			console.error('Failed to save notifications:', error)
			toast.error('Failed to save settings')
		}
	}

	const isProfileChanged = JSON.stringify(profile) !== JSON.stringify(originalProfile)

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold flex items-center gap-3">
					<SettingsIcon className="h-8 w-8 text-primary" />
					Settings
				</h1>
				<p className="mt-2 text-neutral-600 dark:text-neutral-400">
					Manage your account, preferences, and privacy settings
				</p>
			</div>

			{/* Tabs */}
			<div className="flex gap-2 border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto">
				{[
					{ id: 'profile', label: 'Profile', icon: User },
					{ id: 'account', label: 'Account & Security', icon: Lock },
					{ id: 'notifications', label: 'Notifications', icon: Bell },
				].map((tab) => (
					<button
						key={tab.id}
						onClick={() => setActiveTab(tab.id as any)}
						className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
							activeTab === tab.id
								? 'border-primary text-primary'
								: 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
						}`}
					>
						<tab.icon className="h-4 w-4" />
						{tab.label}
					</button>
				))}
			</div>

			{/* Profile Tab */}
			{activeTab === 'profile' && (
				<div className="space-y-6">
					{/* Profile Picture */}
					<Card>
						<CardHeader>
							<h2 className="text-xl font-bold">Profile Picture</h2>
						</CardHeader>
						<CardContent className="p-6">
							<div className="flex items-center gap-6">
								<div className="relative">
									<div className="w-24 h-24 rounded-full bg-linear-to-br from-primary to-primary/60 flex items-center justify-center text-white text-3xl font-bold">
										{profile.name[0] || 'U'}
									</div>
									<button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-neutral-800 rounded-full shadow-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
										<Camera className="h-4 w-4" />
									</button>
								</div>
								<div>
									<h3 className="font-bold text-lg mb-1">{profile.name}</h3>
									<p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
										{profile.position} • {profile.department}
									</p>
									<div className="flex items-center gap-2">
										<Button size="sm" variant="outline">
											<Upload className="h-4 w-4 mr-2" />
											Upload Photo
										</Button>
										<Button size="sm" variant="outline" className="text-red-600">
											Remove
										</Button>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Basic Information */}
					<Card>
						<CardHeader>
							<h2 className="text-xl font-bold">Basic Information</h2>
						</CardHeader>
						<CardContent className="p-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
								<div>
									<label className="block text-sm font-medium mb-2">
										<User className="inline h-4 w-4 mr-1" />
										Full Name
									</label>
									<Input
										value={profile.name}
										onChange={(e) => handleProfileChange('name', e.target.value)}
										placeholder="Enter your full name"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">
										<Mail className="inline h-4 w-4 mr-1" />
										Email Address
									</label>
									<Input
										type="email"
										value={profile.email}
										onChange={(e) => handleProfileChange('email', e.target.value)}
										placeholder="your.email@company.com"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">
										<Phone className="inline h-4 w-4 mr-1" />
										Phone Number
									</label>
									<Input
										type="tel"
										value={profile.phone}
										onChange={(e) => handleProfileChange('phone', e.target.value)}
										placeholder="+1 (555) 123-4567"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">
										<Calendar className="inline h-4 w-4 mr-1" />
										Birth Date
									</label>
									<Input
										type="date"
										value={profile.birthDate}
										onChange={(e) => handleProfileChange('birthDate', e.target.value)}
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Work Information */}
					<Card>
						<CardHeader>
							<h2 className="text-xl font-bold">Work Information</h2>
						</CardHeader>
						<CardContent className="p-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
								<div>
									<label className="block text-sm font-medium mb-2">
										<Building className="inline h-4 w-4 mr-1" />
										Department
									</label>
									<select
										value={profile.department}
										onChange={(e) => handleProfileChange('department', e.target.value)}
										className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary"
									>
										<option value="">Select department</option>
										{departments.map((dept) => (
											<option key={dept.id} value={dept.name}>
												{dept.name}
											</option>
										))}
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">
										<Briefcase className="inline h-4 w-4 mr-1" />
										Position
									</label>
									<select
										value={profile.position}
										onChange={(e) => handleProfileChange('position', e.target.value)}
										className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary"
									>
										<option value="">Select position</option>
										{positions.map((pos) => (
											<option key={pos.id} value={pos.name}>
												{pos.name}
											</option>
										))}
									</select>
								</div>
							</div>

							{/* Jobs Selection */}
							<div className="mt-5">
								<label className="block text-sm font-medium mb-2">
									<Briefcase className="inline h-4 w-4 mr-1" />
									Jobs <span className="text-neutral-500 text-xs">(Add multiple)</span>
								</label>
								<div className="space-y-3">
									{/* Dropdown and Add Button */}
									<div className="flex gap-2">
										<select
											value={customJobInput}
											onChange={(e) => setCustomJobInput(e.target.value)}
											className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary"
										>
											<option value="">-- Select a job to add --</option>
											{availableJobs
												.filter((job) => !profile.jobs.includes(job.title))
												.map((job) => (
													<option key={job.id} value={job.title}>
														{job.title}
													</option>
												))}
										</select>
										<Button 
											onClick={handleAddCustomJob} 
											size="sm"
											disabled={!customJobInput}
											className="px-4"
										>
											<Plus className="h-4 w-4 mr-1" />
											Add
										</Button>
									</div>

									{/* Selected Jobs Display */}
									{profile.jobs.length > 0 ? (
										<div className="p-4 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50">
											<p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-3">
												Selected Jobs ({profile.jobs.length})
											</p>
											<div className="flex flex-wrap gap-2">
												{profile.jobs.map((job) => (
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
										<div className="p-4 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 text-center">
											<p className="text-sm text-neutral-500 dark:text-neutral-400">
												No jobs added yet. Select from the dropdown above.
											</p>
										</div>
									)}

									{availableJobs.length === 0 && (
										<p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
											💡 No jobs available yet. Contact your administrator.
										</p>
									)}
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
								<div>
									<label className="block text-sm font-medium mb-2">
										Employee ID
										<span className="text-xs text-neutral-500 ml-2">(System Generated)</span>
									</label>
									<Input
										value={profile.employeeId}
										readOnly
										disabled
										placeholder="EMP-2023-001"
										className="bg-neutral-100 dark:bg-neutral-800 cursor-not-allowed"
									/>
									<p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
										🔒 This is a unique identifier assigned by the system
									</p>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">Join Date</label>
									<Input
										type="date"
										value={profile.joinDate}
										onChange={(e) => handleProfileChange('joinDate', e.target.value)}
									/>
								</div>
							</div>
						</CardContent>
				</Card>

				{/* Address */}
					<Card>
						<CardHeader>
							<h2 className="text-xl font-bold">Address</h2>
						</CardHeader>
						<CardContent className="p-6">
							<div className="space-y-5">
								<div>
									<label className="block text-sm font-medium mb-2">Street Address</label>
									<Input
										value={profile.address}
										onChange={(e) => handleProfileChange('address', e.target.value)}
										placeholder="123 Main Street"
									/>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
									<div>
										<label className="block text-sm font-medium mb-2">City</label>
										<Input
											value={profile.city}
											onChange={(e) => handleProfileChange('city', e.target.value)}
											placeholder="New York"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium mb-2">Country</label>
										<Input
											value={profile.country}
											onChange={(e) => handleProfileChange('country', e.target.value)}
											placeholder="United States"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium mb-2">Postal Code</label>
										<Input
											value={profile.postalCode}
											onChange={(e) => handleProfileChange('postalCode', e.target.value)}
											placeholder="10001"
										/>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Bio & Skills */}
					<Card>
						<CardHeader>
							<h2 className="text-xl font-bold">Bio & Skills</h2>
						</CardHeader>
						<CardContent className="p-6">
							<div className="space-y-5">
								<div>
									<label className="block text-sm font-medium mb-2">Bio</label>
									<Textarea
										value={profile.bio}
										onChange={(e) => handleProfileChange('bio', e.target.value)}
										placeholder="Tell us about yourself..."
										rows={4}
										className="resize-none"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">Skills</label>
									<div className="flex gap-2 mb-3">
										<Input
											value={skillInput}
											onChange={(e) => setSkillInput(e.target.value)}
											onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
											placeholder="Add a skill (press Enter)"
											className="flex-1"
										/>
										<Button onClick={handleAddSkill} size="sm">
											Add
										</Button>
									</div>
									{profile.skills.length > 0 && (
										<div className="flex flex-wrap gap-2">
											{profile.skills.map((skill) => (
												<span
													key={skill}
													className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
												>
													{skill}
													<button onClick={() => handleRemoveSkill(skill)}>
														<AlertCircle className="h-3 w-3" />
													</button>
												</span>
											))}
										</div>
									)}
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Regional Settings */}
					<Card>
						<CardHeader>
							<h2 className="text-xl font-bold">Regional Settings</h2>
						</CardHeader>
						<CardContent className="p-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
								<div>
									<label className="block text-sm font-medium mb-2">
										<Globe className="inline h-4 w-4 mr-1" />
										Timezone
									</label>
									<select
										value={profile.timezone}
										onChange={(e) => handleProfileChange('timezone', e.target.value)}
										className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900"
									>
										<option value="UTC">UTC</option>
										<option value="America/New_York">Eastern Time (ET)</option>
										<option value="America/Chicago">Central Time (CT)</option>
										<option value="America/Denver">Mountain Time (MT)</option>
										<option value="America/Los_Angeles">Pacific Time (PT)</option>
										<option value="Europe/London">London (GMT)</option>
										<option value="Asia/Seoul">Seoul (KST)</option>
										<option value="Asia/Tokyo">Tokyo (JST)</option>
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">
										<Languages className="inline h-4 w-4 mr-1" />
										Language
									</label>
									<select
										value={profile.language}
										onChange={(e) => handleProfileChange('language', e.target.value)}
										className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900"
									>
										<option value="en">English</option>
										<option value="ko">한국어</option>
										<option value="ja">日本語</option>
										<option value="zh">中文</option>
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">Date Format</label>
									<select
										value={profile.dateFormat}
										onChange={(e) => handleProfileChange('dateFormat', e.target.value)}
										className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900"
									>
										<option value="MM/DD/YYYY">MM/DD/YYYY</option>
										<option value="DD/MM/YYYY">DD/MM/YYYY</option>
										<option value="YYYY-MM-DD">YYYY-MM-DD</option>
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">
										<Clock className="inline h-4 w-4 mr-1" />
										Time Format
									</label>
									<select
										value={profile.timeFormat}
										onChange={(e) => handleProfileChange('timeFormat', e.target.value as '12h' | '24h')}
										className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900"
									>
										<option value="12h">12-hour (2:30 PM)</option>
										<option value="24h">24-hour (14:30)</option>
									</select>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Actions */}
					{isProfileChanged && (
						<div className="flex items-center gap-3">
							<Button onClick={handleSaveProfile} className="flex items-center gap-2">
								<Save className="h-4 w-4" />
								Save Changes
							</Button>
							<Button variant="outline" onClick={handleCancelProfile}>
								Cancel
							</Button>
						</div>
					)}
				</div>
			)}

			{/* Account & Security Tab */}
			{activeTab === 'account' && (
				<div className="space-y-6">
					{/* Change Password */}
					<Card>
						<CardHeader>
							<h2 className="text-xl font-bold flex items-center gap-2">
								<Lock className="h-5 w-5 text-primary" />
								Change Password
							</h2>
							<p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
								Update your password to keep your account secure
							</p>
						</CardHeader>
						<CardContent className="p-6">
							<div className="space-y-5 max-w-md">
								<div>
									<label className="block text-sm font-medium mb-2">Current Password</label>
									<div className="relative">
										<Input
											type={showCurrentPassword ? 'text' : 'password'}
											value={currentPassword}
											onChange={(e) => setCurrentPassword(e.target.value)}
											placeholder="Enter current password"
										/>
										<button
											type="button"
											onClick={() => setShowCurrentPassword(!showCurrentPassword)}
											className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
										>
											{showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
										</button>
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">New Password</label>
									<div className="relative">
										<Input
											type={showNewPassword ? 'text' : 'password'}
											value={newPassword}
											onChange={(e) => setNewPassword(e.target.value)}
											placeholder="Enter new password"
										/>
										<button
											type="button"
											onClick={() => setShowNewPassword(!showNewPassword)}
											className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
										>
											{showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
										</button>
									</div>
									<p className="text-xs text-neutral-500 mt-1">Must be at least 8 characters</p>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">Confirm New Password</label>
									<div className="relative">
										<Input
											type={showConfirmPassword ? 'text' : 'password'}
											value={confirmPassword}
											onChange={(e) => setConfirmPassword(e.target.value)}
											placeholder="Confirm new password"
										/>
										<button
											type="button"
											onClick={() => setShowConfirmPassword(!showConfirmPassword)}
											className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
										>
											{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
										</button>
									</div>
								</div>
								<div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
									<p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
										Password Requirements:
									</p>
									<ul className="space-y-1 text-xs text-blue-700 dark:text-blue-300">
										<li className="flex items-center gap-2">
											{newPassword.length >= 8 ? (
												<CheckCircle2 className="h-3 w-3 text-green-600" />
											) : (
												<AlertCircle className="h-3 w-3" />
											)}
											At least 8 characters
										</li>
										<li className="flex items-center gap-2">
											{/[A-Z]/.test(newPassword) ? (
												<CheckCircle2 className="h-3 w-3 text-green-600" />
											) : (
												<AlertCircle className="h-3 w-3" />
											)}
											One uppercase letter
										</li>
										<li className="flex items-center gap-2">
											{/[a-z]/.test(newPassword) ? (
												<CheckCircle2 className="h-3 w-3 text-green-600" />
											) : (
												<AlertCircle className="h-3 w-3" />
											)}
											One lowercase letter
										</li>
										<li className="flex items-center gap-2">
											{/[0-9]/.test(newPassword) ? (
												<CheckCircle2 className="h-3 w-3 text-green-600" />
											) : (
												<AlertCircle className="h-3 w-3" />
											)}
											One number
										</li>
									</ul>
								</div>
								<div className="flex items-center gap-3 pt-2">
									<Button onClick={handlePasswordChange} className="flex items-center gap-2">
										<Lock className="h-4 w-4" />
										Change Password
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Two-Factor Authentication */}
					<Card>
						<CardHeader>
							<h2 className="text-xl font-bold">Two-Factor Authentication</h2>
							<p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
								Add an extra layer of security to your account
							</p>
						</CardHeader>
						<CardContent className="p-6">
							<div className="flex items-start justify-between p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl">
								<div className="flex-1">
									<h3 className="font-medium mb-1">Authenticator App</h3>
									<p className="text-sm text-neutral-600 dark:text-neutral-400">
										Use an authenticator app to generate verification codes
									</p>
								</div>
								<Button size="sm" variant="outline">
									Enable
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* Active Sessions */}
					<Card>
						<CardHeader>
							<h2 className="text-xl font-bold">Active Sessions</h2>
							<p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
								Manage your active sessions across devices
							</p>
						</CardHeader>
						<CardContent className="p-6">
							<div className="space-y-3">
								<div className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl">
									<div>
										<h3 className="font-medium">Current Session</h3>
										<p className="text-sm text-neutral-600 dark:text-neutral-400">
											Chrome on Windows • New York, US
										</p>
									</div>
									<span className="text-xs text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
										Active
									</span>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Danger Zone */}
					<Card className="border-red-200 dark:border-red-800">
						<CardHeader>
							<h2 className="text-xl font-bold text-red-600">Danger Zone</h2>
						</CardHeader>
						<CardContent className="p-6">
							<div className="space-y-4">
								<div className="flex items-start justify-between p-4 border border-red-200 dark:border-red-800 rounded-xl">
									<div className="flex-1">
										<h3 className="font-medium text-red-600">Deactivate Account</h3>
										<p className="text-sm text-neutral-600 dark:text-neutral-400">
											Temporarily disable your account
										</p>
									</div>
									<Button size="sm" variant="outline" className="text-red-600 border-red-200">
										Deactivate
									</Button>
								</div>
								<div className="flex items-start justify-between p-4 border border-red-200 dark:border-red-800 rounded-xl">
									<div className="flex-1">
										<h3 className="font-medium text-red-600">Delete Account</h3>
										<p className="text-sm text-neutral-600 dark:text-neutral-400">
											Permanently delete your account and all data
										</p>
									</div>
									<Button size="sm" variant="outline" className="text-red-600 border-red-200">
										Delete
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Notifications Tab */}
			{activeTab === 'notifications' && (
				<div className="space-y-6">
					<Card>
						<CardHeader>
							<h2 className="text-xl font-bold">Notification Channels</h2>
						</CardHeader>
						<CardContent className="p-6">
							<div className="space-y-4">
								{[
									{ key: 'email', label: 'Email Notifications', desc: 'Receive notifications via email' },
									{ key: 'push', label: 'Push Notifications', desc: 'Browser push notifications' },
									{ key: 'desktop', label: 'Desktop Notifications', desc: 'System desktop notifications' },
									{ key: 'sms', label: 'SMS Notifications', desc: 'Text message notifications (charges may apply)' },
								].map((item) => (
									<div key={item.key} className="flex items-start justify-between p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl">
										<div className="flex-1">
											<h3 className="font-medium mb-1">{item.label}</h3>
											<p className="text-sm text-neutral-600 dark:text-neutral-400">{item.desc}</p>
										</div>
										<label className="relative inline-flex items-center cursor-pointer ml-4">
											<input
												type="checkbox"
												checked={notifications[item.key as keyof NotificationSettings] as boolean}
												onChange={(e) => setNotifications((prev) => ({ ...prev, [item.key]: e.target.checked }))}
												className="sr-only peer"
											/>
											<div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-primary"></div>
										</label>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<h2 className="text-xl font-bold">Activity Notifications</h2>
						</CardHeader>
						<CardContent className="p-6">
							<div className="space-y-4">
								{[
									{ key: 'taskAssigned', label: 'Task Assigned', desc: 'When a new task is assigned to you' },
									{ key: 'taskDue', label: 'Task Due', desc: 'Reminders for upcoming task deadlines' },
									{ key: 'mentions', label: 'Mentions', desc: 'When someone mentions you' },
									{ key: 'comments', label: 'Comments', desc: 'New comments on your work' },
								].map((item) => (
									<div key={item.key} className="flex items-start justify-between p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl">
										<div className="flex-1">
											<h3 className="font-medium mb-1">{item.label}</h3>
											<p className="text-sm text-neutral-600 dark:text-neutral-400">{item.desc}</p>
										</div>
										<label className="relative inline-flex items-center cursor-pointer ml-4">
											<input
												type="checkbox"
												checked={notifications[item.key as keyof NotificationSettings] as boolean}
												onChange={(e) => setNotifications((prev) => ({ ...prev, [item.key]: e.target.checked }))}
												className="sr-only peer"
											/>
											<div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-primary"></div>
										</label>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					<div className="flex items-center gap-3">
						<Button onClick={handleSaveNotifications} className="flex items-center gap-2">
							<Save className="h-4 w-4" />
							Save Preferences
						</Button>
					</div>
				</div>
			)}

			<Toaster />
		</div>
	)
}
