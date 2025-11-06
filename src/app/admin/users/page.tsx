import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import { Users, UserPlus, Mail, Trash2, Edit, Search, X, ChevronLeft, ChevronRight, Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import Toaster from '../../../components/ui/Toaster'
import type { UserRole } from '../../../types/auth.types'

interface TeamMember {
	id: string
	name: string
	email: string
	role: UserRole
	department: string
	position: string
	status: 'active' | 'inactive' | 'pending'
	joinedAt: Date
}

const ITEMS_PER_PAGE = 15

export default function UsersManagementPage() {
	const [members, setMembers] = useState<TeamMember[]>([
		{
			id: '1',
		name: 'John Doe',
		email: 'john@example.com',
		role: 'user',
			department: 'Engineering',
			position: 'Senior Developer',
			status: 'active',
			joinedAt: new Date('2024-01-15'),
		},
		{
			id: '2',
			name: 'Jane Smith',
			email: 'jane@example.com',
			role: 'executive',
			department: 'Management',
			position: 'CFO',
			status: 'active',
			joinedAt: new Date('2023-06-01'),
		},
		{
			id: '3',
			name: 'Mike Johnson',
			email: 'mike@example.com',
			role: 'admin',
			department: 'IT',
			position: 'System Admin',
			status: 'active',
			joinedAt: new Date('2023-09-20'),
		},
		{
			id: '4',
			name: 'Sarah Williams',
			email: 'sarah@example.com',
			role: 'user',
			department: 'Marketing',
			position: 'Marketing Manager',
			status: 'pending',
			joinedAt: new Date('2024-10-25'),
		},
		{
			id: '5',
			name: 'David Brown',
			email: 'david@example.com',
			role: 'user',
			department: 'Sales',
			position: 'Sales Representative',
			status: 'active',
			joinedAt: new Date('2024-02-10'),
		},
		{
			id: '6',
			name: 'Emily Davis',
			email: 'emily@example.com',
			role: 'user',
			department: 'Design',
			position: 'UI/UX Designer',
			status: 'active',
			joinedAt: new Date('2024-03-15'),
		},
		{
			id: '7',
			name: 'Robert Wilson',
			email: 'robert@example.com',
			role: 'admin',
			department: 'HR',
			position: 'HR Manager',
			status: 'active',
			joinedAt: new Date('2023-11-05'),
		},
		{
			id: '8',
			name: 'Lisa Anderson',
			email: 'lisa@example.com',
			role: 'user',
			department: 'Engineering',
			position: 'Backend Developer',
			status: 'active',
			joinedAt: new Date('2024-04-20'),
		},
		{
			id: '9',
			name: 'James Taylor',
			email: 'james@example.com',
			role: 'user',
			department: 'Engineering',
			position: 'Frontend Developer',
			status: 'active',
			joinedAt: new Date('2024-05-12'),
		},
		{
			id: '10',
			name: 'Patricia Martinez',
			email: 'patricia@example.com',
			role: 'user',
			department: 'Sales',
			position: 'Account Manager',
			status: 'active',
			joinedAt: new Date('2024-06-08'),
		},
		{
			id: '11',
			name: 'Christopher Lee',
			email: 'chris@example.com',
			role: 'user',
			department: 'Marketing',
			position: 'Content Strategist',
			status: 'active',
			joinedAt: new Date('2024-07-01'),
		},
		{
			id: '12',
			name: 'Linda Garcia',
			email: 'linda@example.com',
			role: 'admin',
			department: 'Operations',
			position: 'Operations Manager',
			status: 'active',
			joinedAt: new Date('2024-01-20'),
		},
		{
			id: '13',
			name: 'Daniel Rodriguez',
			email: 'daniel@example.com',
			role: 'user',
			department: 'Engineering',
			position: 'DevOps Engineer',
			status: 'active',
			joinedAt: new Date('2024-08-15'),
		},
		{
			id: '14',
			name: 'Barbara Hernandez',
			email: 'barbara@example.com',
			role: 'user',
			department: 'Design',
			position: 'Graphic Designer',
			status: 'pending',
			joinedAt: new Date('2024-10-28'),
		},
		{
			id: '15',
			name: 'Matthew Lopez',
			email: 'matthew@example.com',
			role: 'user',
			department: 'Sales',
			position: 'Sales Manager',
			status: 'active',
			joinedAt: new Date('2023-12-10'),
		},
		{
			id: '16',
			name: 'Susan Gonzalez',
			email: 'susan@example.com',
			role: 'user',
			department: 'Marketing',
			position: 'Social Media Manager',
			status: 'active',
			joinedAt: new Date('2024-09-05'),
		},
		{
			id: '17',
			name: 'Joseph Wilson',
			email: 'joseph@example.com',
			role: 'user',
			department: 'Engineering',
			position: 'QA Engineer',
			status: 'active',
			joinedAt: new Date('2024-03-22'),
		},
		{
			id: '18',
			name: 'Jessica Moore',
			email: 'jessica@example.com',
			role: 'executive',
			department: 'Management',
			position: 'CTO',
			status: 'active',
			joinedAt: new Date('2023-05-15'),
		},
		{
			id: '19',
			name: 'Thomas Taylor',
			email: 'thomas@example.com',
			role: 'user',
			department: 'Finance',
			position: 'Financial Analyst',
			status: 'active',
			joinedAt: new Date('2024-04-10'),
		},
		{
			id: '20',
			name: 'Nancy Anderson',
			email: 'nancy@example.com',
			role: 'user',
			department: 'HR',
			position: 'Recruiter',
			status: 'active',
			joinedAt: new Date('2024-02-28'),
		},
		{
			id: '21',
			name: 'Charles Thomas',
			email: 'charles@example.com',
			role: 'user',
			department: 'Engineering',
			position: 'Mobile Developer',
			status: 'active',
			joinedAt: new Date('2024-06-20'),
		},
		{
			id: '22',
			name: 'Karen Jackson',
			email: 'karen@example.com',
			role: 'user',
			department: 'Design',
			position: 'Product Designer',
			status: 'inactive',
			joinedAt: new Date('2023-08-12'),
		},
		{
			id: '23',
			name: 'Steven White',
			email: 'steven@example.com',
			role: 'user',
			department: 'Sales',
			position: 'Business Development',
			status: 'active',
			joinedAt: new Date('2024-07-18'),
		},
		{
			id: '24',
			name: 'Betty Harris',
			email: 'betty@example.com',
			role: 'user',
			department: 'Marketing',
			position: 'SEO Specialist',
			status: 'active',
			joinedAt: new Date('2024-08-25'),
		},
		{
			id: '25',
			name: 'Paul Martin',
			email: 'paul@example.com',
			role: 'admin',
			department: 'IT',
			position: 'Network Admin',
			status: 'active',
			joinedAt: new Date('2023-10-05'),
		},
		{
			id: '26',
			name: 'Helen Thompson',
			email: 'helen@example.com',
			role: 'user',
			department: 'Customer Support',
			position: 'Support Specialist',
			status: 'active',
			joinedAt: new Date('2024-09-12'),
		},
		{
			id: '27',
			name: 'Mark Garcia',
			email: 'mark@example.com',
			role: 'user',
			department: 'Engineering',
			position: 'Data Engineer',
			status: 'active',
			joinedAt: new Date('2024-05-30'),
		},
		{
			id: '28',
			name: 'Sandra Martinez',
			email: 'sandra@example.com',
			role: 'user',
			department: 'Finance',
			position: 'Accountant',
			status: 'pending',
			joinedAt: new Date('2024-10-29'),
		},
		{
			id: '29',
			name: 'Donald Robinson',
			email: 'donald@example.com',
			role: 'user',
			department: 'Operations',
			position: 'Operations Coordinator',
			status: 'active',
			joinedAt: new Date('2024-04-05'),
		},
		{
			id: '30',
			name: 'Ashley Clark',
			email: 'ashley@example.com',
			role: 'user',
			department: 'Marketing',
			position: 'Brand Manager',
			status: 'active',
			joinedAt: new Date('2024-03-18'),
		},
	])

	const [searchQuery, setSearchQuery] = useState('')
	const [isInviting, setIsInviting] = useState(false)
	const [inviteEmail, setInviteEmail] = useState('')
	const [inviteEmails, setInviteEmails] = useState<string[]>([])
	const [currentPage, setCurrentPage] = useState(1)
	const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
	const [editForm, setEditForm] = useState<Partial<TeamMember>>({})
	const [showBulkUpload, setShowBulkUpload] = useState(false)
	const [uploadedEmails, setUploadedEmails] = useState<Array<{ email: string; name?: string; valid: boolean; error?: string }>>([])
	const fileInputRef = useRef<HTMLInputElement>(null)

	// Email validation
	const validateEmail = (email: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		return emailRegex.test(email.trim())
	}

	// Handle email input for Gmail-style tags
	const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
			e.preventDefault()
			addEmail()
		} else if (e.key === 'Backspace' && !inviteEmail && inviteEmails.length > 0) {
			// Remove last email tag when backspace is pressed with empty input
			setInviteEmails((prev) => prev.slice(0, -1))
		}
	}

	const addEmail = () => {
		const email = inviteEmail.trim()
		if (!email) return

		if (!validateEmail(email)) {
			toast.error('Please enter a valid email address')
			return
		}

		if (inviteEmails.includes(email)) {
			toast.error('This email is already added')
			return
		}

		if (members.some((m) => m.email === email)) {
			toast.error('This user is already a member')
			return
		}

		setInviteEmails((prev) => [...prev, email])
		setInviteEmail('')
	}

	const removeEmail = (emailToRemove: string) => {
		setInviteEmails((prev) => prev.filter((e) => e !== emailToRemove))
	}

	const handleSendInvites = () => {
		if (inviteEmails.length === 0) {
			toast.error('Please add at least one email address')
			return
		}

		// Send invitations
		toast.success(`Invitation${inviteEmails.length > 1 ? 's' : ''} sent to ${inviteEmails.length} user${inviteEmails.length > 1 ? 's' : ''}`)
		
		// Reset state
		setInviteEmails([])
		setInviteEmail('')
		setIsInviting(false)
	}

	// Handle file upload for bulk invites
	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		const fileExtension = file.name.split('.').pop()?.toLowerCase()
		
		if (fileExtension === 'csv') {
			// Handle CSV file
			const reader = new FileReader()
			reader.onload = (event) => {
				const text = event.target?.result as string
				parseCsvData(text)
			}
			reader.readAsText(file)
		} else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
			// For Excel files, show instructions for CSV conversion
			toast.error('Please convert your Excel file to CSV format first')
		} else {
			toast.error('Please upload a CSV file')
		}

		// Reset file input
		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}
	}

	const parseCsvData = (csvText: string) => {
		const lines = csvText.split('\n').filter((line) => line.trim())
		const emails: Array<{ email: string; name?: string; valid: boolean; error?: string }> = []

		lines.forEach((line, index) => {
			// Skip header row if it contains "email" or "name"
			if (index === 0 && (line.toLowerCase().includes('email') || line.toLowerCase().includes('name'))) {
				return
			}

			const columns = line.split(',').map((col) => col.trim().replace(/['"]/g, ''))
			const email = columns[0]
			const name = columns[1] || undefined

			if (!email) return

			const valid = validateEmail(email)
			const alreadyMember = members.some((m) => m.email === email)
			const duplicate = emails.some((e) => e.email === email)

			if (!valid) {
				emails.push({ email, name, valid: false, error: 'Invalid email format' })
			} else if (alreadyMember) {
				emails.push({ email, name, valid: false, error: 'Already a member' })
			} else if (duplicate) {
				emails.push({ email, name, valid: false, error: 'Duplicate in file' })
			} else {
				emails.push({ email, name, valid: true })
			}
		})

		setUploadedEmails(emails)
		setShowBulkUpload(true)
		
		const validCount = emails.filter((e) => e.valid).length
		const invalidCount = emails.length - validCount
		
		if (invalidCount > 0) {
			toast.warning(`Found ${validCount} valid email(s) and ${invalidCount} invalid/duplicate email(s)`)
		} else {
			toast.success(`Found ${validCount} valid email(s)`)
		}
	}

	const handleBulkInvite = () => {
		const validEmails = uploadedEmails.filter((e) => e.valid)
		
		if (validEmails.length === 0) {
			toast.error('No valid emails to invite')
			return
		}

		toast.success(`Invitation${validEmails.length > 1 ? 's' : ''} sent to ${validEmails.length} user${validEmails.length > 1 ? 's' : ''}`)
		
		// Reset state
		setUploadedEmails([])
		setShowBulkUpload(false)
	}

	const downloadTemplate = () => {
		const csvContent = 'email,name\nexample1@company.com,John Doe\nexample2@company.com,Jane Smith\nexample3@company.com,Mike Johnson'
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
		const link = document.createElement('a')
		const url = URL.createObjectURL(blob)
		link.setAttribute('href', url)
		link.setAttribute('download', 'email_template.csv')
		link.style.visibility = 'hidden'
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
		toast.success('Template downloaded!')
	}

	const handleDelete = (id: string, name: string) => {
		if (confirm(`Are you sure you want to remove ${name}?`)) {
			setMembers((prev) => prev.filter((m) => m.id !== id))
			toast.success('User removed successfully')
		}
	}

	const handleEditClick = (member: TeamMember) => {
		setEditingMember(member)
		setEditForm({
			name: member.name,
			email: member.email,
			department: member.department,
			position: member.position,
			role: member.role,
			status: member.status,
		})
	}

	const handleEditSave = () => {
		if (!editingMember) return

		setMembers((prev) =>
			prev.map((m) =>
				m.id === editingMember.id
					? { ...m, ...editForm }
					: m
			)
		)
		toast.success('User updated successfully')
		setEditingMember(null)
		setEditForm({})
	}

	const handleEditCancel = () => {
		setEditingMember(null)
		setEditForm({})
	}

	const getRoleBadge = (role: UserRole) => {
		const styles = {
			user: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
			admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
			executive: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
		}
		const labels = {
			user: 'User',
			admin: 'Admin',
			executive: 'Executive',
		}
		return (
			<span className={`px-2 py-1 rounded-lg text-xs font-medium ${styles[role]}`}>
				{labels[role]}
			</span>
		)
	}

	const getStatusBadge = (status: TeamMember['status']) => {
		const styles = {
			active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
			inactive: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400',
			pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
		}
		const labels = {
			active: 'Active',
			inactive: 'Inactive',
			pending: 'Pending',
		}
		return (
			<span className={`px-2 py-1 rounded-lg text-xs font-medium ${styles[status]}`}>
				{labels[status]}
			</span>
		)
	}

	const filteredMembers = members.filter(
		(member) =>
			member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
			member.department.toLowerCase().includes(searchQuery.toLowerCase())
	)

	// Pagination
	const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE)
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
	const endIndex = startIndex + ITEMS_PER_PAGE
	const currentMembers = filteredMembers.slice(startIndex, endIndex)

	const stats = {
		total: members.length,
		active: members.filter((m) => m.status === 'active').length,
		users: members.filter((m) => m.role === 'user').length,
		admins: members.filter((m) => m.role === 'admin').length,
		executives: members.filter((m) => m.role === 'executive').length,
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold flex items-center gap-3">
						<Users className="h-8 w-8 text-primary" />
						User Management
					</h1>
					<p className="mt-2 text-neutral-600 dark:text-neutral-400">
						Invite team members and manage permissions
					</p>
				</div>
				<Button
					onClick={() => setIsInviting(true)}
					className="flex items-center gap-2"
				>
					<UserPlus className="h-5 w-5" />
					<span>Invite User</span>
				</Button>
			</div>

			{/* Stats */}
			<div className="grid gap-4 md:grid-cols-5">
				<Card>
					<CardContent className="p-4">
						<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Total</div>
						<div className="text-2xl font-bold">{stats.total}</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Active</div>
						<div className="text-2xl font-bold text-green-600">{stats.active}</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Users</div>
						<div className="text-2xl font-bold text-blue-600">{stats.users}</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Admins</div>
						<div className="text-2xl font-bold text-purple-600">{stats.admins}</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Executives</div>
						<div className="text-2xl font-bold text-orange-600">{stats.executives}</div>
					</CardContent>
				</Card>
			</div>

			{/* Invite Modal - Gmail Style */}
			{isInviting && (
				<Card className="border-primary/50 bg-primary/5">
					<CardContent className="p-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="font-bold text-lg flex items-center gap-2">
								<Mail className="h-5 w-5 text-primary" />
								Invite Users
							</h3>
							<button
								onClick={() => {
									setIsInviting(false)
									setInviteEmails([])
									setInviteEmail('')
								}}
								className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
							>
								<X className="h-5 w-5" />
							</button>
						</div>

						{/* Gmail-style Email Input */}
						<div className="space-y-4">
							<div className="border border-neutral-300 dark:border-neutral-700 rounded-2xl p-3 bg-white dark:bg-neutral-900 min-h-[100px]">
								<div className="flex flex-wrap gap-2 mb-2">
									{inviteEmails.map((email) => (
										<div
											key={email}
											className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
										>
											<span>{email}</span>
											<button
												onClick={() => removeEmail(email)}
												className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
											>
												<X className="h-3 w-3" />
											</button>
										</div>
									))}
									<input
										type="text"
										value={inviteEmail}
										onChange={(e) => setInviteEmail(e.target.value)}
										onKeyDown={handleEmailKeyDown}
										onBlur={addEmail}
										placeholder={inviteEmails.length === 0 ? 'Enter email addresses (separate with comma, space, or Enter)' : ''}
										className="flex-1 min-w-[200px] outline-none bg-transparent text-sm"
									/>
								</div>
								{inviteEmails.length > 0 && (
									<div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
										{inviteEmails.length} email{inviteEmails.length > 1 ? 's' : ''} added
									</div>
								)}
							</div>

							{/* Bulk Upload Option */}
							<div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
								<div className="flex items-center justify-between mb-3">
									<h4 className="font-medium text-sm flex items-center gap-2">
										<FileSpreadsheet className="h-4 w-4 text-primary" />
										Bulk Upload from CSV
									</h4>
									<Button
										variant="outline"
										size="sm"
										onClick={downloadTemplate}
										className="flex items-center gap-1 text-xs"
									>
										<Download className="h-3 w-3" />
										Download Template
									</Button>
								</div>
								<div className="flex gap-2">
									<input
										ref={fileInputRef}
										type="file"
										accept=".csv,.xlsx,.xls"
										onChange={handleFileUpload}
										className="hidden"
									/>
									<Button
										variant="outline"
										onClick={() => fileInputRef.current?.click()}
										className="flex-1 flex items-center justify-center gap-2"
									>
										<Upload className="h-4 w-4" />
										Upload CSV File
									</Button>
								</div>
								<p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
									CSV format: email,name (optional)
								</p>
							</div>

							{/* Action Buttons */}
							<div className="flex items-center gap-3">
								<Button onClick={handleSendInvites} className="flex-1">
									<Mail className="h-4 w-4 mr-2" />
									Send {inviteEmails.length > 0 ? `${inviteEmails.length} ` : ''}Invite{inviteEmails.length !== 1 ? 's' : ''}
								</Button>
								<Button
									variant="outline"
									onClick={() => {
										setIsInviting(false)
										setInviteEmails([])
										setInviteEmail('')
									}}
									className="flex-1"
								>
									Cancel
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Bulk Upload Preview Modal */}
			{showBulkUpload && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
					<Card className="w-full max-w-4xl max-h-[80vh] flex flex-col">
						<CardHeader className="border-b border-neutral-200 dark:border-neutral-800">
							<div className="flex items-center justify-between">
								<h3 className="font-bold text-xl flex items-center gap-2">
									<FileSpreadsheet className="h-6 w-6 text-primary" />
									Bulk Invite Preview
								</h3>
								<button
									onClick={() => {
										setShowBulkUpload(false)
										setUploadedEmails([])
									}}
									className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
								>
									<X className="h-5 w-5" />
								</button>
							</div>
						</CardHeader>
						<CardContent className="p-6 overflow-y-auto flex-1">
							<div className="space-y-4">
								{/* Summary */}
								<div className="grid grid-cols-2 gap-4">
									<div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
										<div className="flex items-center gap-2 mb-2">
											<CheckCircle2 className="h-5 w-5 text-green-600" />
											<span className="font-medium text-green-900 dark:text-green-100">Valid Emails</span>
										</div>
										<div className="text-3xl font-bold text-green-600">
											{uploadedEmails.filter((e) => e.valid).length}
										</div>
									</div>
									<div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
										<div className="flex items-center gap-2 mb-2">
											<AlertCircle className="h-5 w-5 text-red-600" />
											<span className="font-medium text-red-900 dark:text-red-100">Invalid/Duplicate</span>
										</div>
										<div className="text-3xl font-bold text-red-600">
											{uploadedEmails.filter((e) => !e.valid).length}
										</div>
									</div>
								</div>

								{/* Email List */}
								<div className="space-y-2">
									<h4 className="font-medium text-sm text-neutral-600 dark:text-neutral-400">Email List</h4>
									<div className="max-h-[400px] overflow-y-auto space-y-2">
										{uploadedEmails.map((item, index) => (
											<div
												key={index}
												className={`p-3 border rounded-xl flex items-center justify-between ${
													item.valid
														? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10'
														: 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10'
												}`}
											>
												<div className="flex items-center gap-3 flex-1 min-w-0">
													{item.valid ? (
														<CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
													) : (
														<AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
													)}
													<div className="flex-1 min-w-0">
														<div className="font-medium text-sm truncate">{item.email}</div>
														{item.name && <div className="text-xs text-neutral-600 dark:text-neutral-400">{item.name}</div>}
													</div>
												</div>
												{!item.valid && item.error && (
													<span className="text-xs text-red-600 dark:text-red-400 ml-2">
														{item.error}
													</span>
												)}
											</div>
										))}
									</div>
								</div>

								{/* Action Buttons */}
								<div className="flex items-center gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
									<Button
										onClick={handleBulkInvite}
										disabled={uploadedEmails.filter((e) => e.valid).length === 0}
										className="flex-1"
									>
										<Mail className="h-4 w-4 mr-2" />
										Send {uploadedEmails.filter((e) => e.valid).length} Invite{uploadedEmails.filter((e) => e.valid).length !== 1 ? 's' : ''}
									</Button>
									<Button
										variant="outline"
										onClick={() => {
											setShowBulkUpload(false)
											setUploadedEmails([])
										}}
										className="flex-1"
									>
										Cancel
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Edit Modal */}
			{editingMember && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
					<Card className="w-full max-w-2xl mx-4">
						<CardHeader className="border-b border-neutral-200 dark:border-neutral-800">
							<div className="flex items-center justify-between">
								<h3 className="font-bold text-xl flex items-center gap-2">
									<Edit className="h-5 w-5 text-primary" />
									Edit User
								</h3>
								<button
									onClick={handleEditCancel}
									className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
								>
									<X className="h-5 w-5" />
								</button>
							</div>
						</CardHeader>
						<CardContent className="p-6">
							<div className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium mb-2">Name</label>
										<Input
											value={editForm.name || ''}
											onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
											placeholder="Enter name"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium mb-2">Email</label>
										<Input
											type="email"
											value={editForm.email || ''}
											onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
											placeholder="Enter email"
										/>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium mb-2">Department</label>
										<Input
											value={editForm.department || ''}
											onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
											placeholder="Enter department"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium mb-2">Position</label>
										<Input
											value={editForm.position || ''}
											onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
											placeholder="Enter position"
										/>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
									<label className="block text-sm font-medium mb-2">Role</label>
									<select
										value={editForm.role || 'user'}
										onChange={(e) => setEditForm({ ...editForm, role: e.target.value as UserRole })}
										className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary"
									>
										<option value="user">User</option>
										<option value="admin">Admin</option>
										<option value="executive">Executive</option>
									</select>
									</div>
									<div>
										<label className="block text-sm font-medium mb-2">Status</label>
										<select
											value={editForm.status || 'active'}
											onChange={(e) => setEditForm({ ...editForm, status: e.target.value as TeamMember['status'] })}
											className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary"
										>
											<option value="active">Active</option>
											<option value="inactive">Inactive</option>
											<option value="pending">Pending</option>
										</select>
									</div>
								</div>

								<div className="flex items-center gap-3 pt-4">
									<Button onClick={handleEditSave} className="flex-1">
										Save Changes
									</Button>
									<Button variant="outline" onClick={handleEditCancel} className="flex-1">
										Cancel
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Search */}
			<Card>
				<CardContent className="p-4">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
						<Input
							type="text"
							placeholder="Search by name, email, or department..."
							value={searchQuery}
							onChange={(e) => {
								setSearchQuery(e.target.value)
								setCurrentPage(1) // Reset to first page on search
							}}
							className="pl-10"
						/>
					</div>
				</CardContent>
			</Card>

			{/* Members List */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-bold">Team Members</h2>
						<div className="text-sm text-neutral-600 dark:text-neutral-400">
							Showing {startIndex + 1}-{Math.min(endIndex, filteredMembers.length)} of {filteredMembers.length}
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						{currentMembers.map((member) => (
							<div
								key={member.id}
								className="flex items-center justify-between p-3 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:shadow-md transition-shadow"
							>
							<div className="flex items-center flex-1">
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2 mb-0.5">
										<h3 className="font-bold text-sm">{member.name}</h3>
										{getRoleBadge(member.role)}
										{getStatusBadge(member.status)}
									</div>
									<div className="flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400">
										<span className="truncate">{member.email}</span>
										<span>•</span>
										<span>{member.department}</span>
										<span>•</span>
										<span>{member.position}</span>
									</div>
								</div>
							</div>

							<div className="flex items-center gap-2">
								<button
									className="p-2 rounded-lg text-neutral-400 hover:text-blue-500 transition-colors"
									onClick={() => handleEditClick(member)}
									title="Edit user"
								>
									<Edit className="h-4 w-4" />
								</button>
								<button
									className="p-2 rounded-lg text-neutral-400 hover:text-red-500 transition-colors"
									onClick={() => handleDelete(member.id, member.name)}
									title="Delete user"
								>
									<Trash2 className="h-4 w-4" />
								</button>
							</div>
							</div>
						))}

						{currentMembers.length === 0 && (
							<div className="text-center py-12 text-neutral-600 dark:text-neutral-400">
								No users found
							</div>
						)}
					</div>

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
							<div className="text-sm text-neutral-600 dark:text-neutral-400">
								Showing <span className="font-medium text-neutral-900 dark:text-neutral-100">{startIndex + 1}-{Math.min(endIndex, filteredMembers.length)}</span> of <span className="font-medium text-neutral-900 dark:text-neutral-100">{filteredMembers.length}</span> users
							</div>
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
									disabled={currentPage === 1}
									className="flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<ChevronLeft className="h-4 w-4" />
									Previous
								</Button>
								<div className="flex items-center gap-1">
									{Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
										// Show first page, last page, current page, and pages around current
										let pageNumber: number
										if (totalPages <= 5) {
											pageNumber = i + 1
										} else if (currentPage <= 3) {
											pageNumber = i + 1
										} else if (currentPage >= totalPages - 2) {
											pageNumber = totalPages - 4 + i
										} else {
											pageNumber = currentPage - 2 + i
										}
										
										return (
											<button
												key={pageNumber}
												onClick={() => setCurrentPage(pageNumber)}
												className={`min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition-all ${
													pageNumber === currentPage
														? 'bg-primary text-white shadow-md'
														: 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
												}`}
											>
												{pageNumber}
											</button>
										)
									})}
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
									disabled={currentPage === totalPages}
									className="flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Next
									<ChevronRight className="h-4 w-4" />
								</Button>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			<Toaster />
		</div>
	)
}
