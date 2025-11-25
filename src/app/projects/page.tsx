/**
 * Projects Page
 * 
 * 프로젝트 관리 페이지 - 리팩토링 완료
 * API Service Layer와 Custom Hooks 사용
 */

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
import type { Project } from './_types/projects.types'
import { initializeMockProjects } from './_mocks/projectsApi'
import ProjectFormDialog, { type ProjectFormData } from './_components/ProjectFormDialog'
import ProjectCard from './_components/ProjectCard'
import TimelineView from './_components/TimelineView'
import { storage } from '../../utils/storage'
import { createAITasksForProject } from '../ai-recommendations/_utils/aiTaskGenerator'

interface WorkEntry {
	id: string
	title: string
	category: string
	projectId?: string
	date: Date
	duration?: string
}

interface Department {
	id: string
	name: string
	description?: string
}

export default function ProjectsPage() {
	const navigate = useNavigate()
	
	// State
	const [projects, setProjects] = useState<Project[]>([])
	const [workEntries, setWorkEntries] = useState<WorkEntry[]>([])
	const [availableDepartments, setAvailableDepartments] = useState<Department[]>([])
	const [loading, setLoading] = useState(true)
	
	// UI State
	const [showCreateDialog, setShowCreateDialog] = useState(false)
	const [filterStatus, setFilterStatus] = useState<string>('all')
	const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list')

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
			toast.error('Failed to load data')
		} finally {
			setLoading(false)
		}
	}

	const loadProjects = async () => {
		try {
			const saved = storage.get<Project[]>('projects')
			if (saved) {
				const parsed = saved.map((proj: any) => ({
					...proj,
					// Migrate old 'department' to 'departments' array
					departments: proj.departments || (proj.department ? [proj.department] : ['General']),
					startDate: new Date(proj.startDate),
					endDate: new Date(proj.endDate),
					createdAt: new Date(proj.createdAt),
					members: proj.members?.map((m: any) => ({
						...m,
						joinedAt: m.joinedAt ? new Date(m.joinedAt) : new Date(),
					})) || [],
				}))
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
				const entriesWithDates = saved.map((entry) => ({
					...entry,
					date: new Date(entry.date),
				}))
				setWorkEntries(entriesWithDates)
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
				createdBy: 'current-user', // TODO: Get from auth context
				files: formData.files,
				links: formData.links,
			}

		const updated = [...projects, newProject]
		setProjects(updated)
		storage.set('projects', updated)
		
		// AI가 자동으로 프로젝트 관련 Task 생성
		createAITasksForProject(newProject)
		
		setShowCreateDialog(false)
		toast.success('Project created successfully!')
		
		// AI Task 생성 알림
		setTimeout(() => {
			toast.info('🤖 AI has generated recommended tasks for this project', {
				description: 'Check AI Recommendations page to review them',
				duration: 5000,
			})
		}, 1000)
		} catch (error) {
			console.error('Failed to create project:', error)
			toast.error('Failed to create project')
		}
	}

	// Note: Delete functionality will be added to ProjectCard context menu later

	// Filter projects by status
	const filteredProjects = projects.filter((project) => {
		if (filterStatus === 'all') return true
		return project.status === filterStatus
	})

	// Get work entries count for each project
	const getWorkEntriesCount = (projectId: string) => {
		return workEntries.filter((entry) => entry.projectId === projectId).length
	}

	// Get latest work entry for each project
	const getLatestWorkEntry = (projectId: string) => {
		const projectEntries = workEntries
			.filter((entry) => entry.projectId === projectId)
			.sort((a, b) => b.date.getTime() - a.date.getTime())
		
		if (projectEntries.length === 0) return undefined
		
		const latest = projectEntries[0]
		return {
			title: latest.title,
			submittedBy: (latest as any).submittedBy,
			date: latest.date,
		}
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
			<Toaster />
			
			{/* Header */}
			<PageHeader
				title="Projects"
				description="Manage and track your projects"
				icon={FolderKanban}
				actions={
					<Button onClick={() => setShowCreateDialog(true)} size="sm">
						<Plus className="h-4 w-4 sm:mr-2" />
						<span className="hidden sm:inline">New Project</span>
					</Button>
				}
			/>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
				{/* Filters and View Toggle */}
				<div className="flex items-center justify-between gap-4 flex-wrap">
					{/* Status Filter */}
					<div className="flex items-center gap-2">
						<Filter className="h-4 w-4 text-neutral-500" />
						<select
							value={filterStatus}
							onChange={(e) => setFilterStatus(e.target.value)}
							className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900"
						>
							<option value="all">All Projects</option>
							<option value="planning">Planning</option>
							<option value="active">Active</option>
							<option value="on-hold">On Hold</option>
							<option value="completed">Completed</option>
							<option value="cancelled">Cancelled</option>
						</select>
					</div>

					{/* View Mode Toggle */}
					<div className="flex items-center gap-2 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-300 dark:border-neutral-700 p-1">
						<button
							onClick={() => setViewMode('list')}
							className={`px-4 py-2 rounded-lg transition-colors ${
								viewMode === 'list'
									? 'bg-primary text-white'
									: 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
							}`}
						>
							<LayoutList className="h-4 w-4 inline mr-2" />
							List
						</button>
						<button
							onClick={() => setViewMode('timeline')}
							className={`px-4 py-2 rounded-lg transition-colors ${
								viewMode === 'timeline'
									? 'bg-primary text-white'
									: 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
							}`}
						>
							<CalendarIcon className="h-4 w-4 inline mr-2" />
							Timeline
						</button>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="max-w-7xl mx-auto">
				{/* List View */}
				{viewMode === 'list' && (
					<>
						{filteredProjects.length === 0 ? (
							<div className="text-center py-12">
								<FolderKanban className="h-16 w-16 mx-auto text-neutral-400 mb-4" />
								<h3 className="text-lg font-semibold mb-2">No projects found</h3>
								<p className="text-neutral-600 dark:text-neutral-400 mb-6">
									{filterStatus === 'all'
										? 'Create your first project to get started'
										: `No projects with status: ${filterStatus}`}
								</p>
								{filterStatus === 'all' ? (
									<Button onClick={() => setShowCreateDialog(true)}>
										<Plus className="h-4 w-4 mr-2" />
										Create Project
									</Button>
								) : (
									<Button variant="outline" onClick={() => setFilterStatus('all')}>
										Clear Filter
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

		{/* Create Project Dialog */}
		<ProjectFormDialog
			show={showCreateDialog}
			onClose={() => setShowCreateDialog(false)}
			onSubmit={handleCreateProject}
			availableDepartments={availableDepartments}
		/>
	</div>
)
}
