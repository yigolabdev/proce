/**
 * Projects Page
 * 
 * 프로젝트 관리 페이지 - 리팩토링 완료
 * API Service Layer와 Custom Hooks 사용
 */

import { useI18n } from '../../i18n/I18nProvider'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { PageHeader } from '../../components/common/PageHeader'
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts'
import {
	FolderKanban,
	Plus,
	Filter,
	LayoutList,
	Calendar as CalendarIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import Toaster from '../../components/ui/Toaster'
import type { Project, WorkEntry, Department } from '../../types/common.types'
import { initializeMockProjects } from './_mocks/projectsApi'
import ProjectFormDialog, { type ProjectFormData } from './_components/ProjectFormDialog'
import ProjectCard from './_components/ProjectCard'
import TimelineView from './_components/TimelineView'
import AIProjectRecommendationsPreview from './_components/AIProjectRecommendationsPreview'
import { storage } from '../../utils/storage'
import { parseProjectsFromStorage, parseWorkEntriesFromStorage } from '../../utils/mappers'
import { useAuth } from '../../context/AuthContext'
import { backgroundAnalyzer } from '../../services/ai/backgroundAnalyzer'
import { AIRecommendationButton } from '../../components/ai/AIRecommendationButton'
import { useAINotifications } from '../../hooks/useAINotifications'

export default function ProjectsPage() {
	const navigate = useNavigate()
	const { t } = useI18n()
	const { user } = useAuth()
	const { notifications } = useAINotifications()
	
	// State
	const [projects, setProjects] = useState<Project[]>([])
	const [workEntries, setWorkEntries] = useState<WorkEntry[]>([])
	const [availableDepartments, setAvailableDepartments] = useState<Department[]>([])
	const [loading, setLoading] = useState(true)
	
	// UI State
	const [showCreateDialog, setShowCreateDialog] = useState(false)
	const [filterStatus, setFilterStatus] = useState<string>('all')
	const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list')
	const [initialProjectData, setInitialProjectData] = useState<Partial<ProjectFormData> | undefined>(undefined)
	useKeyboardShortcuts({
		newProject: () => setShowCreateDialog(true),
		cancel: () => setShowCreateDialog(false),
		goToDashboard: () => navigate('/app/dashboard'),
		newWork: () => navigate('/app/input'),
	})

	// Keyboard shortcuts
	useKeyboardShortcuts({
		newProject: () => setShowCreateDialog(true),
		cancel: () => setShowCreateDialog(false),
		goToDashboard: () => navigate('/app/dashboard'),
		newWork: () => navigate('/app/input'),
	})

	// Load data on mount
	useEffect(() => {
		initializeMockProjects()
		loadAllData()
	}, [])

	const loadAllData = async () => {
		setLoading(true)
		try {
			await Promise.all([
				loadProjects(),
				loadWorkEntries(),
				loadDepartments(),
			])
		} catch (error) {
			console.error('Failed to load data:', error)
			toast.error(t('projects.failedToLoadData'))
		} finally {
			setLoading(false)
		}
	}

	const loadProjects = async () => {
		try {
			const saved = storage.get<any[]>('projects')
			if (saved) {
				const parsed = parseProjectsFromStorage(saved)
				setProjects(parsed)
			}
		} catch (error) {
			console.error('Failed to load projects:', error)
		}
	}

	const loadWorkEntries = async () => {
		try {
			const saved = storage.get<any[]>('workEntries')
			if (saved) {
				const parsed = parseWorkEntriesFromStorage(saved)
				setWorkEntries(parsed)
			}
		} catch (error) {
			console.error('Failed to load work entries:', error)
		}
	}

	const loadDepartments = async () => {
		try {
			const saved = storage.get<Department[]>('departments')
			if (saved && saved.length > 0) {
				setAvailableDepartments(saved)
			} else {
				// Fallback to mock data
				const mockDepts: Department[] = [
					{ id: '1', name: 'Engineering', description: 'Engineering team' },
					{ id: '2', name: 'Product', description: 'Product team' },
					{ id: '3', name: 'Marketing', description: 'Marketing team' },
				]
				setAvailableDepartments(mockDepts)
			}
		} catch (error) {
			console.error('Failed to load departments:', error)
		}
	}

	const handleCreateProject = async (formData: ProjectFormData) => {
		try {
			const newProject: Project = {
				id: Date.now().toString(),
				name: formData.name,
				description: formData.description,
				departments: formData.departments.length > 0 ? formData.departments : ['General'],
				objectives: formData.objectives,
				status: 'planning',
				progress: 0,
				startDate: new Date(formData.startDate),
				endDate: new Date(formData.endDate),
				members: [],
				tags: [],
				createdAt: new Date(),
				createdBy: user?.name || 'Unknown User',
				files: formData.files,
				links: formData.links,
			}

		const updated = [...projects, newProject]
		setProjects(updated)
		storage.set('projects', updated)
		
		// Trigger background analysis for project tasks
		backgroundAnalyzer.analyzeTaskRecommendations()
		backgroundAnalyzer.analyzeProjectRecommendations()
		
		setShowCreateDialog(false)
		setInitialProjectData(undefined)
		toast.success(t('projects.projectCreated'), {
			description: 'AI recommendations will be available shortly',
		})
	} catch (error) {
		console.error('Failed to create project:', error)
		toast.error(t('projects.failedToCreateProject'))
	}
}

// Note: Delete functionality will be added to ProjectCard context menu later

	// AI Recommendations handler
	const handleGenerateAIRecommendations = async () => {
		try {
			await backgroundAnalyzer.analyzeTaskRecommendations(true)
			await backgroundAnalyzer.analyzeProjectRecommendations(true)
			toast.success('AI recommendations generated successfully')
		} catch (error) {
			console.error('Failed to generate AI recommendations:', error)
			toast.error('Failed to generate AI recommendations')
		}
	}

	// Filter projects by status
	const filteredProjects = projects.filter((project) => {
		if (filterStatus === 'all') return true
		return project.status === filterStatus
	})

	// Auto-update project progress based on work entries
	useEffect(() => {
		if (projects.length === 0 || workEntries.length === 0) return

		const updatedProjects = projects.map(project => {
			// Calculate progress based on objectives completion
			const totalObjectives = project.objectives?.length || 0
			if (totalObjectives === 0) return project

			// Get work entries for this project
			const projectWorkEntries = workEntries.filter(e => e.projectId === project.id)
			
			// Simple heuristic: assume each objective needs at least one work entry
			// In a real app, you'd track objective completion separately
			const estimatedProgress = Math.min(
				100,
				Math.round((projectWorkEntries.length / totalObjectives) * 100)
			)

			// Only update if progress has changed
			if (project.progress !== estimatedProgress) {
				return { ...project, progress: estimatedProgress }
			}
			return project
		})

		// Check if any progress changed
		const hasChanges = updatedProjects.some((p, i) => p.progress !== projects[i].progress)
		if (hasChanges) {
			setProjects(updatedProjects)
			storage.set('projects', updatedProjects)
		}
	}, [workEntries]) // Only run when workEntries change

	// Get work entries count for each project
	const getWorkEntriesCount = (projectId: string) => {
		return workEntries.filter((entry) => entry.projectId === projectId).length
	}

	// Get latest work entry for each project
	const getLatestWorkEntry = (projectId: string): { title: string; submittedBy?: string; date: Date | string } | undefined => {
		const projectEntries = workEntries
			.filter((entry) => entry.projectId === projectId)
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
		
		if (projectEntries.length === 0) return undefined
		
		const latest = projectEntries[0]
		return {
			title: latest.title,
			submittedBy: latest.submittedByName || latest.submittedBy,
			date: latest.date,
		}
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-background-dark">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-background-dark text-neutral-100">
			<Toaster />
			
			<div className="max-w-[1600px] mx-auto px-6 py-6 space-y-8">
			{/* Header */}
			<PageHeader
				title={t('projects.title')}
				description={t('projects.description')}
				actions={
					<div className="flex items-center gap-3">
						<AIRecommendationButton
							type="projects"
							onGenerate={handleGenerateAIRecommendations}
							badge={notifications.projects + notifications.tasks}
							variant="outline"
							size="sm"
							label="AI Recommendations"
						/>
						<Button onClick={() => setShowCreateDialog(true)} size="sm" className="rounded-full bg-white text-black hover:bg-neutral-200 border-none">
							<Plus className="h-4 w-4 sm:mr-2" />
							<span className="hidden sm:inline">{t('projects.newProject')}</span>
						</Button>
					</div>
				}
			/>

				<div className="space-y-6">
				
				{/* AI Recommendations Preview */}
				<AIProjectRecommendationsPreview />

				{/* Filters and View Toggle */}
				<div className="flex items-center justify-between gap-4 flex-wrap">
					{/* Status Filter */}
					<div className="flex items-center gap-2">
							<div className="relative">
								<Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
						<select
							value={filterStatus}
							onChange={(e) => setFilterStatus(e.target.value)}
									className="pl-10 pr-8 py-2 bg-surface-dark border border-border-dark rounded-lg text-sm focus:outline-none focus:border-neutral-600 text-neutral-300 appearance-none"
						>
							<option value="all">{t('projects.allProjects')}</option>
							<option value="planning">{t('projects.planning')}</option>
							<option value="active">{t('projects.active')}</option>
							<option value="on-hold">{t('projects.onHold')}</option>
							<option value="completed">{t('projects.completed')}</option>
							<option value="cancelled">{t('projects.cancelled')}</option>
						</select>
							</div>
					</div>

					{/* View Mode Toggle */}
						<div className="flex bg-surface-dark rounded-lg p-1 border border-border-dark">
						<button
							onClick={() => setViewMode('list')}
								className={`flex items-center px-3 py-1.5 rounded-md text-sm transition-colors ${
								viewMode === 'list'
										? 'bg-border-dark text-white'
										: 'text-neutral-500 hover:text-neutral-300'
							}`}
						>
								<LayoutList className="h-4 w-4 mr-2" />
							{t('projects.list')}
						</button>
						<button
							onClick={() => setViewMode('timeline')}
								className={`flex items-center px-3 py-1.5 rounded-md text-sm transition-colors ${
								viewMode === 'timeline'
										? 'bg-border-dark text-white'
										: 'text-neutral-500 hover:text-neutral-300'
							}`}
						>
								<CalendarIcon className="h-4 w-4 mr-2" />
							{t('projects.timeline')}
						</button>
				</div>
			</div>

			{/* Content */}
					<div>
				{/* List View */}
				{viewMode === 'list' && (
					<>
						{filteredProjects.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border-dark rounded-xl bg-surface-dark/50">
								<div className="p-4 rounded-full bg-surface-dark mb-4">
									<FolderKanban className="h-8 w-8 text-neutral-500" />
								</div>
								<h3 className="text-lg font-medium text-white mb-2">{t('projects.noProjectsFound')}</h3>
								<p className="text-neutral-500 mb-6 max-w-md">
									{filterStatus === 'all'
										? t('projects.noProjectsFoundDescription')
										: t('projects.noProjectsFoundWithStatus').replace('{status}', filterStatus)}
								</p>
								{filterStatus === 'all' ? (
									<Button onClick={() => setShowCreateDialog(true)} className="rounded-full">
										<Plus className="h-4 w-4 mr-2" />
										{t('projects.createProject')}
									</Button>
								) : (
									<Button variant="outline" onClick={() => setFilterStatus('all')}>
										{t('projects.clearFilter')}
									</Button>
								)}
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{filteredProjects.map((project) => (
								<ProjectCard
									key={project.id}
									project={project}
									workEntriesCount={getWorkEntriesCount(project.id)}
									latestWorkEntry={getLatestWorkEntry(project.id)}
								/>
								))}
							</div>
						)}
					</>
				)}

			{/* Timeline View */}
			{viewMode === 'timeline' && (
				<TimelineView
					projects={filteredProjects}
					onProjectClick={(project) => navigate(`/app/projects/${project.id}`)}
				/>
			)}
					</div>
				</div>
			</div>

		{/* Create Project Dialog */}
		<ProjectFormDialog
			show={showCreateDialog}
			onClose={() => setShowCreateDialog(false)}
			onSubmit={handleCreateProject}
			availableDepartments={availableDepartments}
			initialData={initialProjectData}
		/>
	</div>
)
}
