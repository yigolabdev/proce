import { useState } from 'react'
import { Card, CardContent, CardHeader } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import { Users, UserPlus, Mail, Trash2, Edit, Search } from 'lucide-react'
import { toast } from 'sonner'
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

export default function UsersManagementPage() {
	const [members, setMembers] = useState<TeamMember[]>([
		{
			id: '1',
			name: '홍길동',
			email: 'hong@example.com',
			role: 'worker',
			department: '개발팀',
			position: '시니어 개발자',
			status: 'active',
			joinedAt: new Date('2024-01-15'),
		},
		{
			id: '2',
			name: '김영희',
			email: 'kim@example.com',
			role: 'executive',
			department: '경영지원팀',
			position: 'CFO',
			status: 'active',
			joinedAt: new Date('2023-06-01'),
		},
		{
			id: '3',
			name: '이철수',
			email: 'lee@example.com',
			role: 'admin',
			department: 'IT팀',
			position: '시스템 관리자',
			status: 'active',
			joinedAt: new Date('2023-09-20'),
		},
		{
			id: '4',
			name: '박민수',
			email: 'park@example.com',
			role: 'worker',
			department: '마케팅팀',
			position: '마케터',
			status: 'pending',
			joinedAt: new Date('2024-10-25'),
		},
	])

	const [searchQuery, setSearchQuery] = useState('')
	const [isInviting, setIsInviting] = useState(false)
	const [inviteEmail, setInviteEmail] = useState('')

	const handleInvite = () => {
		if (!inviteEmail) {
			toast.error('이메일을 입력해주세요')
			return
		}
		toast.success(`${inviteEmail}로 초대 메일을 발송했습니다`)
		setInviteEmail('')
		setIsInviting(false)
	}

	const handleDelete = (id: string, name: string) => {
		if (confirm(`${name}님을 삭제하시겠습니까?`)) {
			setMembers((prev) => prev.filter((m) => m.id !== id))
			toast.success('사용자가 삭제되었습니다')
		}
	}

	const handleRoleChange = (id: string, newRole: UserRole) => {
		setMembers((prev) =>
			prev.map((m) => (m.id === id ? { ...m, role: newRole } : m))
		)
		toast.success('권한이 변경되었습니다')
	}

	const getRoleBadge = (role: UserRole) => {
		const styles = {
			worker: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
			admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
			executive: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
		}
		const labels = {
			worker: '작업자',
			admin: '관리자',
			executive: '임원',
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
			active: '활성',
			inactive: '비활성',
			pending: '대기중',
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

	const stats = {
		total: members.length,
		active: members.filter((m) => m.status === 'active').length,
		workers: members.filter((m) => m.role === 'worker').length,
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
						사용자 관리
					</h1>
					<p className="mt-2 text-neutral-600 dark:text-neutral-400">
						팀원을 초대하고 권한을 관리하세요
					</p>
				</div>
				<Button
					onClick={() => setIsInviting(true)}
					className="flex items-center gap-2"
				>
					<UserPlus className="h-5 w-5" />
					<span>사용자 초대</span>
				</Button>
			</div>

			{/* Stats */}
			<div className="grid gap-4 md:grid-cols-5">
				<Card>
					<CardContent className="p-4">
						<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">전체</div>
						<div className="text-2xl font-bold">{stats.total}</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">활성</div>
						<div className="text-2xl font-bold text-green-600">{stats.active}</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">작업자</div>
						<div className="text-2xl font-bold text-blue-600">{stats.workers}</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">관리자</div>
						<div className="text-2xl font-bold text-purple-600">{stats.admins}</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">임원</div>
						<div className="text-2xl font-bold text-orange-600">{stats.executives}</div>
					</CardContent>
				</Card>
			</div>

			{/* Invite Modal */}
			{isInviting && (
				<Card className="border-primary/50 bg-primary/5">
					<CardContent className="p-6">
						<h3 className="font-bold text-lg mb-4 flex items-center gap-2">
							<Mail className="h-5 w-5 text-primary" />
							사용자 초대
						</h3>
						<div className="flex gap-3">
							<Input
								type="email"
								placeholder="이메일 주소 입력"
								value={inviteEmail}
								onChange={(e) => setInviteEmail(e.target.value)}
								className="flex-1"
							/>
							<Button onClick={handleInvite}>초대 발송</Button>
							<Button variant="outline" onClick={() => setIsInviting(false)}>
								취소
							</Button>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Search */}
			<Card>
				<CardContent className="p-4">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
						<Input
							type="text"
							placeholder="이름, 이메일, 부서로 검색..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10"
						/>
					</div>
				</CardContent>
			</Card>

			{/* Members List */}
			<Card>
				<CardHeader>
					<h2 className="text-xl font-bold">팀원 목록</h2>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{filteredMembers.map((member) => (
							<div
								key={member.id}
								className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-800 rounded-2xl hover:shadow-md transition-shadow"
							>
								<div className="flex items-center gap-4 flex-1">
									<div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-lg">
										{member.name[0]}
									</div>
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-1">
											<h3 className="font-bold">{member.name}</h3>
											{getRoleBadge(member.role)}
											{getStatusBadge(member.status)}
										</div>
										<div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
											<span>{member.email}</span>
											<span>•</span>
											<span>{member.department}</span>
											<span>•</span>
											<span>{member.position}</span>
										</div>
									</div>
								</div>

								<div className="flex items-center gap-2">
									<select
										value={member.role}
										onChange={(e) => handleRoleChange(member.id, e.target.value as UserRole)}
										className="px-3 py-1.5 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900"
									>
										<option value="worker">작업자</option>
										<option value="admin">관리자</option>
										<option value="executive">임원</option>
									</select>
									<button
										className="p-2 rounded-lg text-neutral-400 hover:text-blue-500 transition-colors"
										onClick={() => toast.info('편집 기능 준비중')}
									>
										<Edit className="h-4 w-4" />
									</button>
									<button
										className="p-2 rounded-lg text-neutral-400 hover:text-red-500 transition-colors"
										onClick={() => handleDelete(member.id, member.name)}
									>
										<Trash2 className="h-4 w-4" />
									</button>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

