import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import DevMemo from '../../components/dev/DevMemo'
import { DEV_MEMOS } from '../../constants/devMemos'
import { EmptyState } from '../../components/common/EmptyState'
import { LoadingState } from '../../components/common/LoadingState'
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts'
import {
	FolderKanban,
	Plus,
	X,
	Calendar,
	Users,
	Target,
	Trash2,
	CheckCircle2,
	AlertCircle,
	Filter,
	FileText,
	ArrowRight,
	Clock,
} from 'lucide-react'
import { toast } from 'sonner'
import Toaster from '../../components/ui/Toaster'
import type { Project, ProjectMember } from './_types/projects.types'
import { initializeMockProjects } from './_mocks/projectsApi'
import TimelineView from './_components/TimelineView'

interface WorkEntry {
	id: string
	title: string
	category: string
	projectId?: string
	date: Date
	duration?: string
}

export default function ProjectsPage() {
	const navigate = useNavigate()
	const [projects, setProjects] = useState<Project[]>([])
	const [showCreateDialog, setShowCreateDialog] = useState(false)
	const [filterStatus, setFilterStatus] = useState<string>('all')
	const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list')
	const [workEntries, setWorkEntries] = useState<WorkEntry[]>([])

	// Form states
	const [projectName, setProjectName] = useState('')
	const [projectDescription, setProjectDescription] = useState('')
	const [projectDepartment, setProjectDepartment] = useState('')
	const [projectObjectives, setProjectObjectives] = useState<string[]>([])
	const [objectiveInput, setObjectiveInput] = useState('')
	const [startDate, setStartDate] = useState('')
	const [endDate, setEndDate] = useState('')
	const [members, setMembers] = useState<ProjectMember[]>([])
	const [memberName, setMemberName] = useState('')
	const [memberEmail, setMemberEmail] = useState('')
	const [memberRole, setMemberRole] = useState<'leader' | 'member'>('member')

	// Keyboard shortcuts
	useKeyboardShortcuts({
		newProject: () => setShowCreateDialog(true),
		cancel: () => setShowCreateDialog(false),
		dashboard: () => navigate('/app/dashboard'),
		newWork: () => navigate('/app/input'),
	})

	useEffect(() => {
		// 목업 데이터 초기화 (localStorage가 비어있으면)
		initializeMockProjects()
		loadProjects()
		loadWorkEntries()
	}, [])

	const loadWorkEntries = () => {
		try {
			const saved = localStorage.getItem('workEntries')
			if (saved) {
				const parsed = JSON.parse(saved)
				const entriesWithDates = parsed.map((entry: any) => ({
					id: entry.id,
					title: entry.title,
					category: entry.category,
					projectId: entry.projectId,
					date: new Date(entry.date),
					duration: entry.duration,
				}))
				setWorkEntries(entriesWithDates)
			}
		} catch (error) {
			console.error('Failed to load work entries:', error)
		}
	}

	const loadProjects = () => {
		try {
			const saved = localStorage.getItem('projects')
			if (saved) {
				const parsed = JSON.parse(saved).map((proj: any) => ({
					...proj,
					startDate: new Date(proj.startDate),
					endDate: new Date(proj.endDate),
					createdAt: new Date(proj.createdAt),
					members: proj.members.map((m: any) => ({
						...m,
						joinedAt: new Date(m.joinedAt),
					})),
				}))
				setProjects(parsed)
			}
		} catch (error) {
			console.error('Failed to load projects:', error)
		}
	}

	const saveProjects = (updatedProjects: Project[]) => {
		try {
			localStorage.setItem('projects', JSON.stringify(updatedProjects))
		} catch (error) {
			console.error('Failed to save projects:', error)
		}
	}

	const handleAddObjective = () => {
		if (objectiveInput.trim() && !projectObjectives.includes(objectiveInput.trim())) {
			setProjectObjectives([...projectObjectives, objectiveInput.trim()])
			setObjectiveInput('')
		}
	}

	const handleRemoveObjective = (objective: string) => {
		setProjectObjectives(projectObjectives.filter((o) => o !== objective))
	}

	const handleAddMember = () => {
		if (!memberName.trim() || !memberEmail.trim()) {
			toast.error('Please enter member name and email')
			return
		}

		if (members.some((m) => m.email === memberEmail.trim())) {
			toast.error('Member already added')
			return
		}

		const newMember: ProjectMember = {
			id: Date.now().toString(),
			name: memberName.trim(),
			email: memberEmail.trim(),
			role: memberRole,
			joinedAt: new Date(),
		}

		setMembers([...members, newMember])
		setMemberName('')
		setMemberEmail('')
		setMemberRole('member')
		toast.success('Member added')
	}

	const handleRemoveMember = (memberId: string) => {
		setMembers(members.filter((m) => m.id !== memberId))
	}

	const handleCreateProject = () => {
		if (!projectName.trim()) {
			toast.error('Please enter project name')
			return
		}

		if (!startDate || !endDate) {
			toast.error('Please select start and end dates')
			return
		}

		if (new Date(startDate) > new Date(endDate)) {
			toast.error('End date must be after start date')
			return
		}

		const newProject: Project = {
			id: Date.now().toString(),
			name: projectName.trim(),
			description: projectDescription.trim(),
			department: projectDepartment.trim() || 'General',
			objectives: projectObjectives,
			startDate: new Date(startDate),
			endDate: new Date(endDate),
			status: 'planning',
			members,
			progress: 0,
			createdAt: new Date(),
			createdBy: 'Current User', // Replace with actual user
		}

		const updatedProjects = [newProject, ...projects]
		setProjects(updatedProjects)
		saveProjects(updatedProjects)

		// Reset form
		setProjectName('')
		setProjectDescription('')
		setProjectDepartment('')
		setProjectObjectives([])
		setStartDate('')
		setEndDate('')
		setMembers([])
		setShowCreateDialog(false)

		toast.success('Project created successfully!')
	}

	const handleDeleteProject = (projectId: string) => {
		if (!confirm('Are you sure you want to delete this project?')) return

		const updatedProjects = projects.filter((p) => p.id !== projectId)
		setProjects(updatedProjects)
		saveProjects(updatedProjects)
		toast.success('Project deleted')
	}

	const handleUpdateStatus = (projectId: string, newStatus: Project['status']) => {
		const updatedProjects = projects.map((p) =>
			p.id === projectId ? { ...p, status: newStatus } : p
		)
		setProjects(updatedProjects)
		saveProjects(updatedProjects)
		toast.success('Project status updated')
	}

	const getStatusBadge = (status: Project['status']) => {
		const styles = {
			planning: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
			active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
			'on-hold': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
			completed: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400',
		}
		const labels = {
			planning: 'Planning',
			active: 'Active',
			'on-hold': 'On Hold',
			completed: 'Completed',
		}
		return (
			<span className={`px-2 py-1 rounded-lg text-xs font-medium ${styles[status]}`}>
				{labels[status]}
			</span>
		)
	}

	const filteredProjects = projects.filter((project) => {
		if (filterStatus === 'all') return true
		return project.status === filterStatus
	})

	const stats = {
		total: projects.length,
		active: projects.filter((p) => p.status === 'active').length,
		planning: projects.filter((p) => p.status === 'planning').length,
		completed: projects.filter((p) => p.status === 'completed').length,
	}

	return (
		<>
			<DevMemo content={DEV_MEMOS.PROJECTS} pagePath="/app/projects/page.tsx" />
			<div className="space-y-6">
				{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold flex items-center gap-3">
						<FolderKanban className="h-8 w-8 text-primary" />
						Projects
					</h1>
					<p className="mt-2 text-neutral-600 dark:text-neutral-400">
						Create and manage projects with goals, timelines, and team members
					</p>
				</div>
				<Button onClick={() => setShowCreateDialog(true)} className="flex items-center gap-2">
					<Plus className="h-5 w-5" />
					Create Project
				</Button>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardContent className="p-4">
						<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Total Projects</div>
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
						<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Planning</div>
						<div className="text-2xl font-bold text-blue-600">{stats.planning}</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Completed</div>
						<div className="text-2xl font-bold text-neutral-600">{stats.completed}</div>
					</CardContent>
				</Card>
			</div>

		{/* View Tabs & Filter */}
		<Card>
			<CardContent className="p-4">
				<div className="flex items-center justify-between">
					{/* View Mode Tabs */}
					<div className="flex items-center gap-2">
						<button
							onClick={() => setViewMode('list')}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
								viewMode === 'list'
									? 'bg-primary text-white'
									: 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'
							}`}
						>
							<FolderKanban className="h-4 w-4" />
							List View
						</button>
						<button
							onClick={() => setViewMode('timeline')}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
								viewMode === 'timeline'
									? 'bg-primary text-white'
									: 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'
							}`}
						>
							<Calendar className="h-4 w-4" />
							Timeline View
						</button>
					</div>

					{/* Filter */}
					<div className="flex items-center gap-2">
						<Filter className="h-5 w-5 text-neutral-500" />
						<span className="text-sm font-medium mr-2">Filter:</span>
						<div className="flex gap-2">
							{['all', 'planning', 'active', 'on-hold', 'completed'].map((status) => (
								<button
									key={status}
									onClick={() => setFilterStatus(status)}
									className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
										filterStatus === status
											? 'bg-primary text-white'
											: 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'
									}`}
								>
									{status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
								</button>
							))}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>

		{/* Timeline View */}
		{viewMode === 'timeline' && (
			<TimelineView
				projects={filteredProjects}
				onProjectClick={(project) => {
					toast.info(`Clicked on ${project.name}`)
				}}
			/>
		)}

		{/* List View */}
		{viewMode === 'list' && (
			filteredProjects.length === 0 ? (
				<EmptyState
					icon={<FolderKanban className="h-12 w-12" />}
					title="No Projects Yet"
					description="Create your first project to start organizing your work"
					action={
						<Button onClick={() => setShowCreateDialog(true)}>
							<Plus className="h-4 w-4 mr-2" />
							Create Project
						</Button>
					}
				/>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{filteredProjects.map((project) => (
						<Card key={project.id} className="hover:shadow-lg transition-shadow">
							<CardHeader className="border-b border-neutral-200 dark:border-neutral-800">
								<div className="flex items-start justify-between">
									<div className="flex-1 min-w-0">
										<h3 className="font-bold text-lg mb-2 truncate">{project.name}</h3>
										<div className="flex items-center gap-2 flex-wrap">
											{getStatusBadge(project.status)}
											<span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full font-medium">
												{project.department}
											</span>
										</div>
									</div>
									<div className="flex items-center gap-1 ml-2">
										<button
											onClick={() => handleDeleteProject(project.id)}
											className="p-1 rounded-lg text-neutral-400 hover:text-red-500 transition-colors"
										>
											<Trash2 className="h-4 w-4" />
										</button>
									</div>
								</div>
							</CardHeader>
							<CardContent className="p-4">
								{project.description && (
									<p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
										{project.description}
									</p>
								)}

								{/* Objectives */}
								{project.objectives.length > 0 && (
									<div className="mb-4">
										<div className="flex items-center gap-2 mb-2">
											<Target className="h-4 w-4 text-neutral-500" />
											<span className="text-sm font-medium">Objectives</span>
										</div>
										<ul className="space-y-1">
											{project.objectives.slice(0, 2).map((objective, index) => (
											<li key={index} className="text-xs text-neutral-600 dark:text-neutral-400 flex items-start gap-2">
												<CheckCircle2 className="h-3 w-3 text-green-600 shrink-0 mt-0.5" />
												<span className="line-clamp-1">{objective}</span>
											</li>
											))}
											{project.objectives.length > 2 && (
												<li className="text-xs text-neutral-500">
													+{project.objectives.length - 2} more
												</li>
											)}
										</ul>
									</div>
								)}

								{/* Timeline */}
								<div className="mb-4">
									<div className="flex items-center gap-2 mb-2">
										<Calendar className="h-4 w-4 text-neutral-500" />
										<span className="text-sm font-medium">Timeline</span>
									</div>
									<div className="text-xs text-neutral-600 dark:text-neutral-400">
										{project.startDate.toLocaleDateString()} - {project.endDate.toLocaleDateString()}
									</div>
								</div>

								{/* Members */}
								<div className="mb-4">
									<div className="flex items-center gap-2 mb-2">
										<Users className="h-4 w-4 text-neutral-500" />
										<span className="text-sm font-medium">Team</span>
									</div>
									<div className="flex items-center gap-2">
										{project.members.slice(0, 3).map((member) => (
											<div
												key={member.id}
											className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-primary/60 flex items-center justify-center text-white text-xs font-bold"
											title={member.name}
										>
											{member.name[0]}
										</div>
										))}
										{project.members.length > 3 && (
											<div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-xs font-medium">
												+{project.members.length - 3}
											</div>
										)}
										{project.members.length === 0 && (
											<span className="text-xs text-neutral-500">No members yet</span>
										)}
									</div>
								</div>

								{/* Related Work Entries */}
								{workEntries.filter((w) => w.projectId === project.id).length > 0 && (
									<div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
										<h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
											<FileText className="h-4 w-4 text-neutral-500" />
											Related Work ({workEntries.filter((w) => w.projectId === project.id).length})
										</h4>
										<div className="space-y-2">
											{workEntries
												.filter((w) => w.projectId === project.id)
												.slice(0, 3)
												.map((entry) => (
													<div
														key={entry.id}
														className="p-2 bg-neutral-50 dark:bg-neutral-900 rounded-lg"
													>
														<p className="text-xs font-medium truncate">{entry.title}</p>
														<div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
															<span className="flex items-center gap-1">
																<Calendar className="h-3 w-3" />
																{entry.date.toLocaleDateString()}
															</span>
															{entry.duration && (
																<span className="flex items-center gap-1">
																	<Clock className="h-3 w-3" />
																	{entry.duration}
																</span>
															)}
														</div>
													</div>
												))}
											{workEntries.filter((w) => w.projectId === project.id).length > 3 && (
												<p className="text-xs text-center text-neutral-500">
													+{workEntries.filter((w) => w.projectId === project.id).length - 3} more
												</p>
											)}
										</div>
									</div>
								)}

								{/* Quick Action: Add Work */}
								<div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
									<Button
										variant="outline"
										size="sm"
										onClick={() => {
											// Store project ID in sessionStorage for Work Input page
											sessionStorage.setItem('workInputPreselect', JSON.stringify({
												projectId: project.id,
												projectName: project.name,
											}))
											navigate('/input')
										}}
										className="w-full flex items-center justify-center gap-2 text-sm"
									>
										<FileText className="h-4 w-4" />
										이 프로젝트에 업무 입력하기
										<ArrowRight className="h-4 w-4" />
									</Button>
								</div>

								{/* Status Actions */}
								<div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
									<div className="text-xs text-neutral-500 mb-2">Change Status:</div>
									<div className="grid grid-cols-2 gap-2">
										{(['planning', 'active', 'on-hold', 'completed'] as const).map((status) => (
											<button
												key={status}
												onClick={() => handleUpdateStatus(project.id, status)}
												disabled={project.status === status}
												className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
													project.status === status
														? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
														: 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'
												}`}
											>
												{status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
											</button>
										))}
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)
		)}

			{/* Create Project Dialog */}
			{showCreateDialog && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
					<Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
						<CardHeader className="border-b border-neutral-200 dark:border-neutral-800 sticky top-0 bg-white dark:bg-neutral-900 z-10">
							<div className="flex items-center justify-between">
								<h3 className="text-xl font-bold flex items-center gap-2">
									<Plus className="h-6 w-6 text-primary" />
									Create New Project
								</h3>
								<button
									onClick={() => setShowCreateDialog(false)}
									className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
								>
									<X className="h-5 w-5" />
								</button>
							</div>
						</CardHeader>
						<CardContent className="p-6">
							<div className="space-y-5">
								{/* Project Name */}
								<div>
									<label className="block text-sm font-medium mb-2">
										Project Name <span className="text-red-500">*</span>
									</label>
									<Input
										value={projectName}
										onChange={(e) => setProjectName(e.target.value)}
										placeholder="e.g., New Product Launch"
										className="text-base"
									/>
								</div>

								{/* Description */}
								<div>
									<label className="block text-sm font-medium mb-2">Description</label>
									<Textarea
										value={projectDescription}
										onChange={(e) => setProjectDescription(e.target.value)}
										placeholder="Describe the project goals and scope..."
										rows={3}
										className="resize-none"
									/>
								</div>

								{/* Department */}
								<div>
									<label className="block text-sm font-medium mb-2">Department</label>
									<Input
										value={projectDepartment}
										onChange={(e) => setProjectDepartment(e.target.value)}
										placeholder="e.g., Engineering, Marketing, Product..."
										className="text-base"
									/>
								</div>

								{/* Objectives */}
								<div>
									<label className="block text-sm font-medium mb-2">
										<Target className="inline h-4 w-4 mr-1" />
										Project Objectives
									</label>
									<div className="flex gap-2 mb-2">
										<Input
											value={objectiveInput}
											onChange={(e) => setObjectiveInput(e.target.value)}
											onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddObjective())}
											placeholder="Add an objective (press Enter)"
											className="flex-1"
										/>
										<Button onClick={handleAddObjective} size="sm">
											<Plus className="h-4 w-4" />
										</Button>
									</div>
									{projectObjectives.length > 0 && (
										<div className="space-y-2">
											{projectObjectives.map((objective, index) => (
												<div
													key={index}
													className="flex items-center justify-between p-2 bg-neutral-50 dark:bg-neutral-900 rounded-lg"
												>
													<span className="text-sm flex items-center gap-2">
														<CheckCircle2 className="h-4 w-4 text-green-600" />
														{objective}
													</span>
													<button
														onClick={() => handleRemoveObjective(objective)}
														className="text-red-500 hover:text-red-600"
													>
														<X className="h-4 w-4" />
													</button>
												</div>
											))}
										</div>
									)}
								</div>

								{/* Timeline */}
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium mb-2">
											<Calendar className="inline h-4 w-4 mr-1" />
											Start Date <span className="text-red-500">*</span>
										</label>
										<Input
											type="date"
											value={startDate}
											onChange={(e) => setStartDate(e.target.value)}
											min={new Date().toISOString().split('T')[0]}
										/>
									</div>
									<div>
										<label className="block text-sm font-medium mb-2">
											<Calendar className="inline h-4 w-4 mr-1" />
											End Date <span className="text-red-500">*</span>
										</label>
										<Input
											type="date"
											value={endDate}
											onChange={(e) => setEndDate(e.target.value)}
											min={startDate || new Date().toISOString().split('T')[0]}
										/>
									</div>
								</div>

								{/* Team Members */}
								<div>
									<label className="block text-sm font-medium mb-2">
										<Users className="inline h-4 w-4 mr-1" />
										Team Members
									</label>
									<div className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 mb-3">
										<Input
											value={memberName}
											onChange={(e) => setMemberName(e.target.value)}
											placeholder="Name"
										/>
										<Input
											type="email"
											value={memberEmail}
											onChange={(e) => setMemberEmail(e.target.value)}
											placeholder="Email"
										/>
										<select
											value={memberRole}
											onChange={(e) => setMemberRole(e.target.value as 'leader' | 'member')}
											className="px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900 text-sm"
										>
											<option value="member">Member</option>
											<option value="leader">Leader</option>
										</select>
										<Button onClick={handleAddMember} size="sm">
											<Plus className="h-4 w-4" />
										</Button>
									</div>
									{members.length > 0 && (
										<div className="space-y-2">
											{members.map((member) => (
												<div
													key={member.id}
													className="flex items-center justify-between p-3 border border-neutral-200 dark:border-neutral-800 rounded-xl"
												>
													<div className="flex items-center gap-3">
													<div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-primary/60 flex items-center justify-center text-white text-xs font-bold">
														{member.name[0]}
													</div>
													<div>
														<p className="font-medium text-sm">{member.name}</p>
														<p className="text-xs text-neutral-600 dark:text-neutral-400">{member.email}</p>
													</div>
													</div>
													<div className="flex items-center gap-2">
														<span
															className={`text-xs px-2 py-1 rounded-full font-medium ${
																member.role === 'leader'
																	? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
																	: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
															}`}
														>
															{member.role.charAt(0).toUpperCase() + member.role.slice(1)}
														</span>
														<button
															onClick={() => handleRemoveMember(member.id)}
															className="text-red-500 hover:text-red-600"
														>
															<X className="h-4 w-4" />
														</button>
													</div>
												</div>
											))}
										</div>
									)}
								</div>

								{/* Info Box */}
								<div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
									<div className="flex items-start gap-3">
									<AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
									<div>
										<p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
											About Projects
										</p>
										<p className="text-xs text-blue-700 dark:text-blue-300">
											Once created, team members can select this project when submitting work entries via Work Input.
											This helps organize and track work by project.
										</p>
									</div>
									</div>
								</div>

								{/* Actions */}
								<div className="flex items-center gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
									<Button onClick={handleCreateProject} className="flex-1">
										<Plus className="h-4 w-4 mr-2" />
										Create Project
									</Button>
									<Button
										variant="outline"
										onClick={() => setShowCreateDialog(false)}
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

			<Toaster />
			</div>
		</>
	)
}

