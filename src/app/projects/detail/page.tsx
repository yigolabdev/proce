import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { storage } from '../../../utils/storage'
import { Card, CardContent, CardHeader } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { PageHeader } from '../../../components/common/PageHeader'
import { EmptyState } from '../../../components/common/EmptyState'
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
} from 'lucide-react'
import { toast } from 'sonner'
import Toaster from '../../../components/ui/Toaster'
import type { Project, WorkEntry } from '../../../types/common.types'
import { parseProjectsFromStorage, parseWorkEntriesFromStorage } from '../../../utils/mappers'

export default function ProjectDetailPage() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const [project, setProject] = useState<Project | null>(null)
	const [workEntries, setWorkEntries] = useState<WorkEntry[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		loadProjectData()
	}, [id])

	const loadProjectData = () => {
		setLoading(true)
		try {
			// Load project
			const projectsData = storage.get<any[]>('projects') || []
			const projects = parseProjectsFromStorage(projectsData)
			const foundProject = projects.find(p => p.id === id)
			
			if (!foundProject) {
				toast.error('Project not found')
				navigate('/app/projects')
				return
			}

			setProject(foundProject)

			// Load related work entries
			const workEntriesData = storage.get<any[]>('workEntries') || []
			const allWorkEntries = parseWorkEntriesFromStorage(workEntriesData)
			const projectWorkEntries = allWorkEntries
				.filter(entry => entry.projectId === id)
				.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
			
			setWorkEntries(projectWorkEntries)
		} catch (error) {
			console.error('Failed to load project:', error)
			toast.error('Failed to load project data')
		} finally {
			setLoading(false)
		}
	}

	const handleEdit = () => {
		navigate('/app/projects', { state: { editProjectId: id } })
	}

	const handleDelete = async () => {
		if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
			return
		}

		try {
			const projects = storage.get<Project[]>('projects') || []
			const updated = projects.filter(p => p.id !== id)
			storage.set('projects', updated)
			toast.success('Project deleted successfully')
			navigate('/app/projects')
		} catch (error) {
			console.error('Failed to delete project:', error)
			toast.error('Failed to delete project')
		}
	}

	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'planning':
				return { label: 'Planning', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' }
			case 'active':
				return { label: 'Active', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' }
			case 'on-hold':
				return { label: 'On Hold', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' }
			case 'completed':
				return { label: 'Completed', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' }
			case 'cancelled':
				return { label: 'Cancelled', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' }
			default:
				return { label: 'Unknown', color: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400' }
		}
	}

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
			</div>
		)
	}

	if (!project) {
		return (
			<div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
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
		)
	}

	const statusBadge = getStatusBadge(project.status)

	return (
		<div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
			<Toaster />

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
					<Button onClick={handleDelete} variant="outline" size="sm" className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
						<Trash2 className="h-4 w-4 sm:mr-2" />
						<span className="hidden sm:inline">Delete</span>
					</Button>
				</>
			}
		/>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
				{/* Quick Stats */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<Card className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<Activity className="h-8 w-8 text-blue-600 dark:text-blue-400" />
								<div>
									<p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Progress</p>
									<p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{project.progress}%</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-linear-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<Users className="h-8 w-8 text-green-600 dark:text-green-400" />
								<div>
									<p className="text-sm text-green-600 dark:text-green-400 font-medium">Team Size</p>
									<p className="text-2xl font-bold text-green-900 dark:text-green-100">{project.members.length}</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<FileText className="h-8 w-8 text-purple-600 dark:text-purple-400" />
								<div>
									<p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Work Entries</p>
									<p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{workEntries.length}</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-linear-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
								<div>
									<p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Total Hours</p>
									<p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
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
						<Card>
							<CardHeader>
								<h2 className="text-xl font-bold flex items-center gap-2">
									<Target className="h-5 w-5 text-primary" />
									Project Information
								</h2>
							</CardHeader>
							<CardContent className="space-y-4">
								{/* Description */}
								<div>
									<h3 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2">Description</h3>
									<p className="text-neutral-900 dark:text-neutral-100">{project.description}</p>
								</div>

								{/* Objectives */}
								{project.objectives && project.objectives.length > 0 && (
									<div>
										<h3 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2">Objectives</h3>
										<ul className="space-y-2">
											{project.objectives.map((obj, idx) => (
												<li key={idx} className="flex items-start gap-2">
													<ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
													<span className="text-neutral-900 dark:text-neutral-100">{obj}</span>
												</li>
											))}
										</ul>
									</div>
								)}

								{/* Departments */}
								<div>
									<h3 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2">Departments</h3>
									<div className="flex flex-wrap gap-2">
										{project.departments.map((dept, idx) => (
											<span 
												key={idx}
												className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm"
											>
												{dept}
											</span>
										))}
									</div>
								</div>

								{/* Tags */}
								{project.tags && project.tags.length > 0 && (
									<div>
										<h3 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2">Tags</h3>
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
										<h3 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2">Start Date</h3>
										<div className="flex items-center gap-2">
											<Calendar className="h-4 w-4 text-neutral-500" />
											<span className="text-neutral-900 dark:text-neutral-100">
												{new Date(project.startDate).toLocaleDateString()}
											</span>
										</div>
									</div>
									<div>
										<h3 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2">End Date</h3>
										<div className="flex items-center gap-2">
											<Calendar className="h-4 w-4 text-neutral-500" />
											<span className="text-neutral-900 dark:text-neutral-100">
												{new Date(project.endDate).toLocaleDateString()}
											</span>
										</div>
									</div>
								</div>

								{/* Progress Bar */}
								<div>
									<div className="flex items-center justify-between mb-2">
										<h3 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">Overall Progress</h3>
										<span className="text-sm font-bold text-primary">{project.progress}%</span>
									</div>
									<div className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
										<div
											className="h-full bg-primary transition-all duration-300"
											style={{ width: `${project.progress}%` }}
										/>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Work Entries */}
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<h2 className="text-xl font-bold flex items-center gap-2">
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
												className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
												onClick={() => navigate('/app/work-history')}
											>
												<div className="flex items-start justify-between gap-4">
													<div className="flex-1 min-w-0">
														<h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
															{entry.title}
														</h4>
														{entry.description && (
															<p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
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
						<Card>
							<CardHeader>
								<h2 className="text-lg font-bold flex items-center gap-2">
									<Users className="h-5 w-5 text-primary" />
									Team Members
								</h2>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{project.members.map((member) => (
										<div
											key={member.id}
											className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg"
										>
											<div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
												<User className="h-5 w-5 text-primary" />
											</div>
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2">
													<p className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
														{member.name}
													</p>
													{member.role === 'leader' && (
														<span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full font-medium">
															Leader
														</span>
													)}
												</div>
												<p className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
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
						<Card>
							<CardHeader>
								<h2 className="text-lg font-bold flex items-center gap-2">
									<Calendar className="h-5 w-5 text-primary" />
									Timeline
								</h2>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="flex items-start gap-3">
									<div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
										<CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
									</div>
									<div className="flex-1">
										<p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Created</p>
										<p className="text-xs text-neutral-600 dark:text-neutral-400">
											{new Date(project.createdAt).toLocaleDateString()}
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
										<TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
									</div>
									<div className="flex-1">
										<p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Start Date</p>
										<p className="text-xs text-neutral-600 dark:text-neutral-400">
											{new Date(project.startDate).toLocaleDateString()}
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
										<Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
									</div>
									<div className="flex-1">
										<p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Target End Date</p>
										<p className="text-xs text-neutral-600 dark:text-neutral-400">
											{new Date(project.endDate).toLocaleDateString()}
										</p>
									</div>
								</div>

								{/* Days remaining */}
								<div className="mt-4 p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
									<p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Days Remaining</p>
									<p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
										{Math.max(0, Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days
									</p>
								</div>
							</CardContent>
						</Card>

						{/* Files & Links */}
						{((project.files && project.files.length > 0) || (project.links && project.links.length > 0)) && (
							<Card>
								<CardHeader>
									<h2 className="text-lg font-bold flex items-center gap-2">
										<LinkIcon className="h-5 w-5 text-primary" />
										Resources
									</h2>
								</CardHeader>
								<CardContent className="space-y-4">
									{/* Files */}
									{project.files && project.files.length > 0 && (
										<div>
											<h3 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2">Files</h3>
											<div className="space-y-2">
												{project.files.map((file) => (
													<div
														key={file.id}
														className="flex items-center gap-2 p-2 bg-neutral-50 dark:bg-neutral-900 rounded text-sm"
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
											<h3 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2">Links</h3>
											<div className="space-y-2">
												{project.links.map((link) => (
													<a
														key={link.id}
														href={link.url}
														target="_blank"
														rel="noopener noreferrer"
														className="flex items-center gap-2 p-2 bg-neutral-50 dark:bg-neutral-900 rounded text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
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

