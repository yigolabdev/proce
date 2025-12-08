import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { storage, CascadeDelete, ProjectMemberManager } from '../../../utils/storage'
import { Card, CardContent, CardHeader } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { PageHeader } from '../../../components/common/PageHeader'
import { EmptyState } from '../../../components/common/EmptyState'
import { useAuth } from '../../../context/AuthContext'
import {
	FolderKanban,
	ArrowLeft,
	Calendar,
	Users,
	Target,
	Activity,
	FileText,
	Link as LinkIcon,
	Edit2,
	Trash2,
	Clock,
	TrendingUp,
	CheckCircle2,
	User,
	Briefcase,
	ChevronRight,
	UserPlus,
	Shield,
	Eye,
	X,
} from 'lucide-react'
import { toast } from 'sonner'
import Toaster from '../../../components/ui/Toaster'
import type { Project, WorkEntry } from '../../../types/common.types'
import type { ProjectMember } from '../../../schemas/data.schemas'
import { parseProjectsFromStorage, parseWorkEntriesFromStorage } from '../../../utils/mappers'

export default function ProjectDetailPage() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const { user } = useAuth()
	const [project, setProject] = useState<Project | null>(null)
	const [workEntries, setWorkEntries] = useState<WorkEntry[]>([])
	const [loading, setLoading] = useState(true)
	
	// Member management state
	const [members, setMembers] = useState<ProjectMember[]>([])
	const [showAddMember, setShowAddMember] = useState(false)
	const [newMemberEmail, setNewMemberEmail] = useState('')
	const [newMemberRole, setNewMemberRole] = useState<ProjectMember['role']>('member')

	useEffect(() => {
		loadProjectData()
	}, [id])

	const loadProjectData = () => {
		setLoading(true)
		try {
		// Load project
		const projectsData = storage.get<Project[]>('projects') || []
		const projects = parseProjectsFromStorage(projectsData)
			const foundProject = projects.find(p => p.id === id)
			
			if (!foundProject) {
				toast.error('Project not found')
				navigate('/app/projects')
				return
			}

			setProject(foundProject)

		// Load related work entries
		const workEntriesData = storage.get<WorkEntry[]>('workEntries') || []
		const allWorkEntries = parseWorkEntriesFromStorage(workEntriesData)
			const projectWorkEntries = allWorkEntries
				.filter(entry => entry.projectId === id)
				.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
			
			setWorkEntries(projectWorkEntries)
			
			// Load project members
			if (id) {
				const projectMembers = ProjectMemberManager.getMembers(id)
				setMembers(projectMembers)
			}
		} catch (error) {
			console.error('Failed to load project:', error)
			toast.error('Failed to load project data')
		} finally {
			setLoading(false)
		}
	}
	
	const handleAddMember = () => {
		if (!id || !newMemberEmail.trim()) {
			toast.error('이메일을 입력해주세요')
			return
		}
		
		// Mock user lookup (실제로는 API로 사용자 검색)
		const mockUser = {
			userId: `user-${Date.now()}`,
			userName: newMemberEmail.split('@')[0],
			userEmail: newMemberEmail,
			role: newMemberRole,
		}
		
		const success = ProjectMemberManager.addMember(
			id,
			mockUser,
			user?.id || 'current-user'
		)
		
		if (success) {
			toast.success('멤버가 추가되었습니다')
			setNewMemberEmail('')
			setNewMemberRole('member')
			setShowAddMember(false)
			loadProjectData()
		} else {
			toast.error('이미 프로젝트에 포함된 멤버입니다')
		}
	}
	
	const handleRemoveMember = (userId: string) => {
		if (!id) return
		
		if (!confirm('정말 이 멤버를 제거하시겠습니까?')) return
		
		const success = ProjectMemberManager.removeMember(id, userId)
		
		if (success) {
			toast.success('멤버가 제거되었습니다')
			loadProjectData()
		} else {
			toast.error('멤버 제거에 실패했습니다')
		}
	}
	
	const handleChangeRole = (userId: string, newRole: ProjectMember['role']) => {
		if (!id) return
		
		const success = ProjectMemberManager.updateMemberRole(id, userId, newRole)
		
		if (success) {
			toast.success('역할이 변경되었습니다')
			loadProjectData()
		} else {
			toast.error('역할 변경에 실패했습니다')
		}
	}

	const handleEdit = () => {
		navigate('/app/projects', { state: { editProjectId: id } })
	}

	const handleDelete = async () => {
		if (!id || !project) return
		
		// 연결된 업무 수 확인
		const relatedWorkCount = workEntries.length
		
		// 삭제 확인 다이얼로그
		const deleteConfirmed = confirm(
			`이 프로젝트를 삭제하시겠습니까?\n\n` +
			`프로젝트: ${project.name}\n` +
			`연결된 업무: ${relatedWorkCount}개\n\n` +
			`⚠️ 이 작업은 되돌릴 수 없습니다.`
		)
		
		if (!deleteConfirmed) return
		
		// 연결된 업무가 있는 경우 추가 확인
		let deleteWorkEntries = false
		if (relatedWorkCount > 0) {
			const deleteWorkConfirmed = confirm(
				`연결된 ${relatedWorkCount}개의 업무를 어떻게 처리할까요?\n\n` +
				`- "확인": 업무도 함께 삭제 (영구 삭제)\n` +
				`- "취소": 업무는 유지하고 프로젝트 연결만 해제\n\n` +
				`업무를 함께 삭제하시겠습니까?`
			)
			deleteWorkEntries = deleteWorkConfirmed
		}

		try {
			// Cascade Delete 실행
			const result = CascadeDelete.deleteProject(id, {
				deleteWorkEntries,
				archiveMessages: true,
			})
			
			if (result.success) {
				// 삭제 결과 요약 표시
				const summary = []
				if (result.deletedCount.projects > 0) {
					summary.push(`프로젝트 ${result.deletedCount.projects}개 삭제`)
				}
				if (result.deletedCount.workEntries > 0) {
					summary.push(`업무 ${result.deletedCount.workEntries}개 삭제`)
				} else if (relatedWorkCount > 0) {
					summary.push(`업무 ${relatedWorkCount}개 연결 해제`)
				}
				if (result.deletedCount.reviews > 0) {
					summary.push(`검토 ${result.deletedCount.reviews}개 정리`)
				}
				
				toast.success('프로젝트가 삭제되었습니다', {
					description: summary.join(', '),
					duration: 5000,
				})
				
				// 프로젝트 목록으로 이동
				navigate('/app/projects')
			} else {
				toast.error('프로젝트 삭제에 실패했습니다', {
					description: result.errors.join(', '),
				})
			}
		} catch (error) {
			console.error('Failed to delete project:', error)
			toast.error('프로젝트 삭제 중 오류가 발생했습니다')
		}
	}

	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'planning':
				return { label: 'Planning', color: 'bg-blue-100 bg-blue-900/text-blue-400' }
			case 'active':
				return { label: 'Active', color: 'bg-green-100 bg-green-900/text-green-400' }
			case 'on-hold':
				return { label: 'On Hold', color: 'bg-orange-100 bg-orange-900/text-orange-400' }
			case 'completed':
				return { label: 'Completed', color: 'bg-purple-100 bg-purple-900/text-purple-400' }
			case 'cancelled':
				return { label: 'Cancelled', color: 'bg-red-100 bg-red-900/text-red-400' }
			default:
				return { label: 'Unknown', color: 'bg-neutral-100 bg-neutral-800 dark:text-neutral-400' }
		}
	}

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background-dark">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
			</div>
		)
	}

	if (!project) {
		return (
			<div className="min-h-screen bg-background-dark text-neutral-100">
				<div className="max-w-[1600px] mx-auto px-6 py-6 space-y-8">
					<EmptyState
						icon={<FolderKanban className="h-12 w-12" />}
						title="Project Not Found"
						description="The project you're looking for doesn't exist or has been deleted."
						action={
							<Button onClick={() => navigate('/app/projects')}>
								<ArrowLeft className="h-4 w-4 mr-2" />
								Back to Projects
							</Button>
						}
					/>
				</div>
			</div>
		)
	}

	const statusBadge = getStatusBadge(project.status)

	return (
		<div className="min-h-screen bg-background-dark text-neutral-100">
			<Toaster />

			<div className="max-w-[1600px] mx-auto px-6 py-6 space-y-8">
				<PageHeader
					title={project.name}
					description={project.description}
					icon={FolderKanban}
					actions={
						<>
							<span className={`text-xs font-medium px-2 py-1 rounded-full ${statusBadge.color}`}>
								{statusBadge.label}
							</span>
							<Button onClick={() => navigate('/app/projects')} variant="outline" size="sm">
								<ArrowLeft className="h-4 w-4 sm:mr-2" />
								<span className="hidden sm:inline">Back</span>
							</Button>
							<Button onClick={handleEdit} variant="outline" size="sm">
								<Edit2 className="h-4 w-4 sm:mr-2" />
								<span className="hidden sm:inline">Edit</span>
							</Button>
							<Button onClick={handleDelete} variant="outline" size="sm" className="text-red-600 hover:hover:bg-red-900/20">
								<Trash2 className="h-4 w-4 sm:mr-2" />
								<span className="hidden sm:inline">Delete</span>
							</Button>
						</>
					}
				/>

				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<Card className="bg-surface-dark border-border-dark">
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<Activity className="h-8 w-8 text-blue-400" />
								<div>
									<p className="text-sm text-blue-400 font-medium">Progress</p>
									<p className="text-2xl font-bold text-white">{project.progress}%</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-surface-dark border-border-dark">
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<Users className="h-8 w-8 text-green-400" />
								<div>
									<p className="text-sm text-green-400 font-medium">Team Size</p>
									<p className="text-2xl font-bold text-white">{project.members.length}</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-surface-dark border-border-dark">
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<FileText className="h-8 w-8 text-purple-400" />
								<div>
									<p className="text-sm text-purple-400 font-medium">Work Entries</p>
									<p className="text-2xl font-bold text-white">{workEntries.length}</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-surface-dark border-border-dark">
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<Clock className="h-8 w-8 text-orange-400" />
								<div>
									<p className="text-sm text-orange-400 font-medium">Total Hours</p>
									<p className="text-2xl font-bold text-white">
										{workEntries.reduce((sum, entry) => {
											if (!entry.duration) return sum
											const match = entry.duration.match(/(\d+\.?\d*)/)
											return sum + (match ? parseFloat(match[1]) : 0)
										}, 0).toFixed(1)}h
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Left Column - Project Details */}
					<div className="lg:col-span-2 space-y-6">
						{/* Project Information */}
						<Card className="bg-surface-dark border-border-dark">
							<CardHeader>
								<h2 className="text-xl font-bold flex items-center gap-2 text-white">
									<Target className="h-5 w-5 text-primary" />
									Project Information
								</h2>
							</CardHeader>
							<CardContent className="space-y-4">
								{/* Description */}
								<div>
									<h3 className="text-sm font-semibold text-neutral-400 mb-2">Description</h3>
									<p className="text-white">{project.description}</p>
								</div>

								{/* Objectives */}
								{project.objectives && project.objectives.length > 0 && (
									<div>
										<h3 className="text-sm font-semibold text-neutral-400 mb-2">Objectives</h3>
										<ul className="space-y-2">
											{project.objectives.map((obj, idx) => (
												<li key={idx} className="flex items-start gap-2">
													<ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
													<span className="text-white">{obj}</span>
												</li>
											))}
										</ul>
									</div>
								)}

								{/* Departments */}
								<div>
									<h3 className="text-sm font-semibold text-neutral-400 mb-2">Departments</h3>
									<div className="flex flex-wrap gap-2">
										{project.departments.map((dept, idx) => (
											<span 
												key={idx}
												className="px-3 py-1 bg-neutral-800 rounded-full text-sm text-white"
											>
												{dept}
											</span>
										))}
									</div>
								</div>

								{/* Tags */}
								{project.tags && project.tags.length > 0 && (
									<div>
										<h3 className="text-sm font-semibold text-neutral-400 mb-2">Tags</h3>
										<div className="flex flex-wrap gap-2">
											{project.tags.map((tag, idx) => (
												<span 
													key={idx}
													className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
												>
													#{tag}
												</span>
											))}
										</div>
									</div>
								)}

								{/* Timeline */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<h3 className="text-sm font-semibold text-neutral-400 mb-2">Start Date</h3>
										<div className="flex items-center gap-2">
											<Calendar className="h-4 w-4 text-neutral-500" />
											<span className="text-white">
												{new Date(project.startDate).toLocaleDateString()}
											</span>
										</div>
									</div>
									<div>
										<h3 className="text-sm font-semibold text-neutral-400 mb-2">End Date</h3>
										<div className="flex items-center gap-2">
											<Calendar className="h-4 w-4 text-neutral-500" />
											<span className="text-white">
												{new Date(project.endDate).toLocaleDateString()}
											</span>
										</div>
									</div>
								</div>

								{/* Progress Bar */}
								<div>
									<div className="flex items-center justify-between mb-2">
										<h3 className="text-sm font-semibold text-neutral-400">Overall Progress</h3>
										<span className="text-sm font-bold text-primary">{project.progress}%</span>
									</div>
									<div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
										<div
											className="h-full bg-primary transition-all duration-300"
											style={{ width: `${project.progress}%` }}
										/>
									</div>
								</div>
							</CardContent>
						</Card>
						
						{/* Project Members */}
						<Card className="bg-surface-dark border-border-dark">
							<CardHeader>
								<div className="flex items-center justify-between">
									<h2 className="text-xl font-bold flex items-center gap-2 text-white">
										<Users className="h-5 w-5 text-primary" />
										프로젝트 멤버 ({members.length})
									</h2>
									<Button 
										onClick={() => setShowAddMember(true)}
										size="sm"
										className="flex items-center gap-2"
									>
										<UserPlus className="h-4 w-4" />
										멤버 추가
									</Button>
								</div>
							</CardHeader>
							<CardContent>
								{members.length === 0 ? (
									<EmptyState
										icon={<Users className="h-12 w-12" />}
										title="멤버가 없습니다"
										description="프로젝트에 팀원을 추가하여 협업을 시작하세요."
										action={
											<Button onClick={() => setShowAddMember(true)}>
												첫 멤버 추가
											</Button>
										}
									/>
								) : (
									<div className="space-y-2">
										{members.map((member) => {
											const roleIcon = {
												owner: <Shield className="h-4 w-4 text-orange-400" />,
												admin: <Shield className="h-4 w-4 text-blue-400" />,
												member: <User className="h-4 w-4 text-neutral-400" />,
												viewer: <Eye className="h-4 w-4 text-neutral-500" />,
											}[member.role]
											
											const roleName = {
												owner: '소유자',
												admin: '관리자',
												member: '멤버',
												viewer: '뷰어',
											}[member.role]
											
											return (
												<div
													key={member.userId}
													className="p-4 border border-border-dark rounded-lg bg-surface-elevated hover:border-neutral-600 transition-colors"
												>
													<div className="flex items-center justify-between gap-4">
														<div className="flex items-center gap-3 flex-1 min-w-0">
															<div className="p-2 bg-neutral-800 rounded-lg">
																{roleIcon}
															</div>
															<div className="flex-1 min-w-0">
																<div className="flex items-center gap-2">
																	<h4 className="font-semibold text-white truncate">
																		{member.userName}
																	</h4>
																	{!member.isActive && (
																		<span className="px-2 py-0.5 text-xs bg-neutral-800 text-neutral-500 rounded">
																			비활성
																		</span>
																	)}
																</div>
																{member.userEmail && (
																	<p className="text-sm text-neutral-400 truncate">
																		{member.userEmail}
																	</p>
																)}
																<div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
																	<span>{roleName}</span>
																	<span>•</span>
																	<span>
																		{new Date(member.joinedAt).toLocaleDateString('ko-KR')} 가입
																	</span>
																</div>
															</div>
														</div>
														<div className="flex items-center gap-2 shrink-0">
															{member.role !== 'owner' && (
																<>
																	<select
																		value={member.role}
																		onChange={(e) => handleChangeRole(member.userId, e.target.value as ProjectMember['role'])}
																		className="px-2 py-1 text-xs border border-border-dark rounded bg-surface-dark text-white focus:outline-none focus:border-neutral-600"
																	>
																		<option value="viewer">뷰어</option>
																		<option value="member">멤버</option>
																		<option value="admin">관리자</option>
																	</select>
																	<button
																		onClick={() => handleRemoveMember(member.userId)}
																		className="p-2 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors"
																		title="멤버 제거"
																	>
																		<X className="h-4 w-4" />
																	</button>
																</>
															)}
														</div>
													</div>
												</div>
											)
										})}
									</div>
								)}
								
								{/* Add Member Dialog */}
								{showAddMember && (
									<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
										<div className="bg-surface-dark rounded-2xl shadow-2xl border border-border-dark w-full max-w-md">
											<div className="p-6 border-b border-border-dark">
												<h3 className="text-xl font-bold text-white">멤버 추가</h3>
												<p className="text-sm text-neutral-400 mt-1">
													프로젝트에 새로운 멤버를 초대하세요
												</p>
											</div>
											<div className="p-6 space-y-4">
												<div>
													<label className="block text-sm font-medium text-neutral-300 mb-2">
														이메일
													</label>
													<input
														type="email"
														value={newMemberEmail}
														onChange={(e) => setNewMemberEmail(e.target.value)}
														placeholder="member@example.com"
														className="w-full px-3 py-2 bg-surface-elevated border border-border-dark rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
														autoFocus
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-neutral-300 mb-2">
														역할
													</label>
													<select
														value={newMemberRole}
														onChange={(e) => setNewMemberRole(e.target.value as ProjectMember['role'])}
														className="w-full px-3 py-2 bg-surface-elevated border border-border-dark rounded-lg text-white focus:outline-none focus:border-neutral-600"
													>
														<option value="viewer">뷰어 - 읽기 전용</option>
														<option value="member">멤버 - 기본 권한</option>
														<option value="admin">관리자 - 전체 관리</option>
													</select>
												</div>
											</div>
											<div className="p-6 border-t border-border-dark flex items-center justify-end gap-2">
												<Button
													variant="outline"
													onClick={() => {
														setShowAddMember(false)
														setNewMemberEmail('')
														setNewMemberRole('member')
													}}
												>
													취소
												</Button>
												<Button
													variant="brand"
													onClick={handleAddMember}
													disabled={!newMemberEmail.trim()}
												>
													추가
												</Button>
											</div>
										</div>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Work Entries */}
						<Card className="bg-surface-dark border-border-dark">
							<CardHeader>
								<div className="flex items-center justify-between">
									<h2 className="text-xl font-bold flex items-center gap-2 text-white">
										<FileText className="h-5 w-5 text-primary" />
										Work Entries ({workEntries.length})
									</h2>
									<Button 
										onClick={() => navigate('/app/input', { state: { projectId: id } })}
										size="sm"
									>
										Add Work Entry
									</Button>
								</div>
							</CardHeader>
							<CardContent>
								{workEntries.length === 0 ? (
									<EmptyState
										icon={<FileText className="h-12 w-12" />}
										title="No Work Entries"
										description="No work has been logged for this project yet."
										action={
											<Button onClick={() => navigate('/app/input', { state: { projectId: id } })}>
												Add First Entry
											</Button>
										}
									/>
								) : (
									<div className="space-y-3">
										{workEntries.map((entry) => (
											<div
												key={entry.id}
												className="p-4 border border-border-dark rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-surface-elevated"
												onClick={() => navigate('/app/work-history')}
											>
												<div className="flex items-start justify-between gap-4">
													<div className="flex-1 min-w-0">
														<h4 className="font-semibold text-white mb-1">
															{entry.title}
														</h4>
														{entry.description && (
															<p className="text-sm text-neutral-400 line-clamp-2">
																{entry.description}
															</p>
														)}
														<div className="flex items-center gap-4 mt-2 text-xs text-neutral-500">
															<div className="flex items-center gap-1">
																<Calendar className="h-3 w-3" />
																{new Date(entry.date).toLocaleDateString()}
															</div>
															{entry.duration && (
																<div className="flex items-center gap-1">
																	<Clock className="h-3 w-3" />
																	{entry.duration}
																</div>
															)}
														</div>
													</div>
													<ChevronRight className="h-5 w-5 text-neutral-400 shrink-0" />
												</div>
											</div>
										))}
									</div>
								)}
							</CardContent>
						</Card>
					</div>

					{/* Right Column - Team & Metadata */}
					<div className="space-y-6">
						{/* Team Members */}
						<Card className="bg-surface-dark border-border-dark">
							<CardHeader>
								<h2 className="text-lg font-bold flex items-center gap-2 text-white">
									<Users className="h-5 w-5 text-primary" />
									Team Members
								</h2>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{project.members.map((member) => (
										<div
											key={member.id}
											className="flex items-center gap-3 p-3 bg-neutral-900 rounded-lg"
										>
											<div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
												<User className="h-5 w-5 text-primary" />
											</div>
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2">
													<p className="font-semibold text-sm text-white">
														{member.name}
													</p>
													{member.role === 'leader' && (
														<span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full font-medium">
															Leader
														</span>
													)}
												</div>
												<p className="text-xs text-neutral-400 flex items-center gap-1">
													<Briefcase className="h-3 w-3" />
													{member.department}
												</p>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						{/* Project Timeline */}
						<Card className="bg-surface-dark border-border-dark">
							<CardHeader>
								<h2 className="text-lg font-bold flex items-center gap-2 text-white">
									<Calendar className="h-5 w-5 text-primary" />
									Timeline
								</h2>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="flex items-start gap-3">
									<div className="w-8 h-8 rounded-full bg-green-900/30 flex items-center justify-center shrink-0">
										<CheckCircle2 className="h-4 w-4 text-green-400" />
									</div>
									<div className="flex-1">
										<p className="text-sm font-semibold text-white">Created</p>
										<p className="text-xs text-neutral-400">
											{new Date(project.createdAt).toLocaleDateString()}
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center shrink-0">
										<TrendingUp className="h-4 w-4 text-blue-400" />
									</div>
									<div className="flex-1">
										<p className="text-sm font-semibold text-white">Start Date</p>
										<p className="text-xs text-neutral-400">
											{new Date(project.startDate).toLocaleDateString()}
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<div className="w-8 h-8 rounded-full bg-purple-900/30 flex items-center justify-center shrink-0">
										<Target className="h-4 w-4 text-purple-400" />
									</div>
									<div className="flex-1">
										<p className="text-sm font-semibold text-white">Target End Date</p>
										<p className="text-xs text-neutral-400">
											{new Date(project.endDate).toLocaleDateString()}
										</p>
									</div>
								</div>

								{/* Days remaining */}
								<div className="mt-4 p-3 bg-neutral-900 rounded-lg">
									<p className="text-xs text-neutral-400 mb-1">Days Remaining</p>
									<p className="text-lg font-bold text-white">
										{Math.max(0, Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days
									</p>
								</div>
							</CardContent>
						</Card>

						{/* Files & Links */}
						{((project.files && project.files.length > 0) || (project.links && project.links.length > 0)) && (
							<Card className="bg-surface-dark border-border-dark">
								<CardHeader>
									<h2 className="text-lg font-bold flex items-center gap-2 text-white">
										<LinkIcon className="h-5 w-5 text-primary" />
										Resources
									</h2>
								</CardHeader>
								<CardContent className="space-y-4">
									{/* Files */}
									{project.files && project.files.length > 0 && (
										<div>
											<h3 className="text-sm font-semibold text-neutral-400 mb-2">Files</h3>
											<div className="space-y-2">
												{project.files.map((file) => (
													<div
														key={file.id}
														className="flex items-center gap-2 p-2 bg-neutral-900 rounded text-sm text-white"
													>
														<FileText className="h-4 w-4 text-neutral-500 shrink-0" />
														<span className="flex-1 truncate">{file.name}</span>
														<span className="text-xs text-neutral-500">
															{(file.size / 1024).toFixed(1)}KB
														</span>
													</div>
												))}
											</div>
										</div>
									)}

									{/* Links */}
									{project.links && project.links.length > 0 && (
										<div>
											<h3 className="text-sm font-semibold text-neutral-400 mb-2">Links</h3>
											<div className="space-y-2">
												{project.links.map((link) => (
													<a
														key={link.id}
														href={link.url}
														target="_blank"
														rel="noopener noreferrer"
														className="flex items-center gap-2 p-2 bg-neutral-900 rounded text-sm hover:bg-neutral-800 transition-colors"
													>
														<LinkIcon className="h-4 w-4 text-primary shrink-0" />
														<span className="flex-1 truncate text-primary">{link.title}</span>
													</a>
												))}
											</div>
										</div>
									)}
								</CardContent>
							</Card>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
