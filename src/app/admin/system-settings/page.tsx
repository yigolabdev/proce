import { useState, useEffect } from 'react'
import { Settings, Activity, Briefcase, Building } from 'lucide-react'
import { toast } from 'sonner'
import Toaster from '../../../components/ui/Toaster'
import DevMemo from '../../../components/dev/DevMemo'
import { DEV_MEMOS } from '../../../constants/devMemos'

// Import types and components
import type { WorkCategory, Department, Position, Job } from './_types/types'
import { DEFAULT_CATEGORIES, DEFAULT_DEPARTMENTS, DEFAULT_POSITIONS, DEFAULT_JOBS } from './_types/types'
import CategoriesTab from './_components/CategoriesTab'
import DepartmentsTab from './_components/DepartmentsTab'
import PositionsJobsTab from './_components/PositionsJobsTab'

export default function SystemSettingsPage() {
	const [activeTab, setActiveTab] = useState<'departments' | 'positions' | 'status'>('departments')

	// Departments
	const [departments, setDepartments] = useState<Department[]>([])
	const [showAddDepartment, setShowAddDepartment] = useState(false)
	const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
	const [newDepartment, setNewDepartment] = useState<Omit<Department, 'id'>>({
		name: '',
		description: '',
	})

	// Positions
	const [positions, setPositions] = useState<Position[]>([])
	const [showAddPosition, setShowAddPosition] = useState(false)
	const [editingPosition, setEditingPosition] = useState<Position | null>(null)
	const [newPosition, setNewPosition] = useState<Omit<Position, 'id'>>({
		name: '',
		description: '',
	})

	// Jobs
	const [jobs, setJobs] = useState<Job[]>([])
	const [showAddJob, setShowAddJob] = useState(false)
	const [editingJob, setEditingJob] = useState<Job | null>(null)
	const [newJob, setNewJob] = useState<Omit<Job, 'id'>>({
		title: '',
		description: '',
		responsibilities: '',
	})

	// Status (formerly Categories)
	const [statuses, setStatuses] = useState<WorkCategory[]>([])
	const [showAddStatus, setShowAddStatus] = useState(false)
	const [editingStatus, setEditingStatus] = useState<WorkCategory | null>(null)
	const [newStatus, setNewStatus] = useState<Omit<WorkCategory, 'id'>>({
		name: '',
		color: '#3B82F6',
		description: '',
	})

	// Load data from localStorage
	useEffect(() => {
		try {
			const savedDepartments = localStorage.getItem('departments')
			const savedPositions = localStorage.getItem('positions')
			const savedJobs = localStorage.getItem('jobs')
			const savedStatuses = localStorage.getItem('workStatuses')

			if (savedDepartments) {
				setDepartments(JSON.parse(savedDepartments))
			} else {
				setDepartments(DEFAULT_DEPARTMENTS)
				localStorage.setItem('departments', JSON.stringify(DEFAULT_DEPARTMENTS))
			}

			if (savedPositions) {
				setPositions(JSON.parse(savedPositions))
			} else {
				setPositions(DEFAULT_POSITIONS)
				localStorage.setItem('positions', JSON.stringify(DEFAULT_POSITIONS))
			}

			if (savedJobs) {
				setJobs(JSON.parse(savedJobs))
			} else {
				setJobs(DEFAULT_JOBS)
				localStorage.setItem('jobs', JSON.stringify(DEFAULT_JOBS))
			}

			if (savedStatuses) {
				setStatuses(JSON.parse(savedStatuses))
			} else {
				setStatuses(DEFAULT_CATEGORIES)
				localStorage.setItem('workStatuses', JSON.stringify(DEFAULT_CATEGORIES))
			}
		} catch (error) {
			console.error('Failed to load settings:', error)
		}
	}, [])

	// Department handlers
	const handleAddDepartment = () => {
		if (!newDepartment.name) {
			toast.error('Please enter department name')
			return
		}

		const department: Department = {
			id: Date.now().toString(),
			...newDepartment,
		}

		const updated = [...departments, department]
		setDepartments(updated)
		localStorage.setItem('departments', JSON.stringify(updated))
		setNewDepartment({
			name: '',
			description: '',
		})
		setShowAddDepartment(false)
		toast.success('Department added successfully')
	}

	const handleUpdateDepartment = () => {
		if (!editingDepartment) return

		const updated = departments.map((dept) =>
			dept.id === editingDepartment.id ? editingDepartment : dept
		)
		setDepartments(updated)
		localStorage.setItem('departments', JSON.stringify(updated))
		setEditingDepartment(null)
		toast.success('Department updated successfully')
	}

	const handleDeleteDepartment = (id: string) => {
		if (confirm('Are you sure you want to delete this department?')) {
			const updated = departments.filter((dept) => dept.id !== id)
			setDepartments(updated)
			localStorage.setItem('departments', JSON.stringify(updated))
			toast.success('Department deleted')
		}
	}

	// Position handlers
	const handleAddPosition = () => {
		if (!newPosition.name) {
			toast.error('Please enter position name')
			return
		}

		const position: Position = {
			id: Date.now().toString(),
			...newPosition,
		}

		const updated = [...positions, position]
		setPositions(updated)
		localStorage.setItem('positions', JSON.stringify(updated))
		setNewPosition({
			name: '',
			description: '',
		})
		setShowAddPosition(false)
		toast.success('Position added successfully')
	}

	const handleUpdatePosition = () => {
		if (!editingPosition) return

		const updated = positions.map((pos) => (pos.id === editingPosition.id ? editingPosition : pos))
		setPositions(updated)
		localStorage.setItem('positions', JSON.stringify(updated))
		setEditingPosition(null)
		toast.success('Position updated successfully')
	}

	const handleDeletePosition = (id: string) => {
		if (confirm('Are you sure you want to delete this position?')) {
			const updated = positions.filter((pos) => pos.id !== id)
			setPositions(updated)
			localStorage.setItem('positions', JSON.stringify(updated))
			toast.success('Position deleted')
		}
	}

	// Job handlers
	const handleAddJob = () => {
		if (!newJob.title) {
			toast.error('Please enter job title')
			return
		}

		const job: Job = {
			id: Date.now().toString(),
			...newJob,
		}

		const updated = [...jobs, job]
		setJobs(updated)
		localStorage.setItem('jobs', JSON.stringify(updated))
		setNewJob({
			title: '',
			description: '',
			responsibilities: '',
		})
		setShowAddJob(false)
		toast.success('Job added successfully')
	}

	const handleUpdateJob = () => {
		if (!editingJob) return

		const updated = jobs.map((job) => (job.id === editingJob.id ? editingJob : job))
		setJobs(updated)
		localStorage.setItem('jobs', JSON.stringify(updated))
		setEditingJob(null)
		toast.success('Job updated successfully')
	}

	const handleDeleteJob = (id: string) => {
		if (confirm('Are you sure you want to delete this job?')) {
			const updated = jobs.filter((job) => job.id !== id)
			setJobs(updated)
			localStorage.setItem('jobs', JSON.stringify(updated))
			toast.success('Job deleted')
		}
	}

	// Status handlers
	const handleAddStatus = () => {
		if (!newStatus.name) {
			toast.error('Please enter a status name')
			return
		}

		const status: WorkCategory = {
			id: Date.now().toString(),
			...newStatus,
		}

		const updated = [...statuses, status]
		setStatuses(updated)
		localStorage.setItem('workStatuses', JSON.stringify(updated))
		setNewStatus({ name: '', color: '#3B82F6', description: '' })
		setShowAddStatus(false)
		toast.success('Status added successfully')
	}

	const handleUpdateStatus = () => {
		if (!editingStatus) return

		const updated = statuses.map((status) => (status.id === editingStatus.id ? editingStatus : status))
		setStatuses(updated)
		localStorage.setItem('workStatuses', JSON.stringify(updated))
		setEditingStatus(null)
		toast.success('Status updated successfully')
	}

	const handleDeleteStatus = (id: string) => {
		if (confirm('Are you sure you want to delete this status?')) {
			const updated = statuses.filter((status) => status.id !== id)
			setStatuses(updated)
			localStorage.setItem('workStatuses', JSON.stringify(updated))
			toast.success('Status deleted')
		}
	}

	return (
		<>
			<DevMemo content={DEV_MEMOS.ADMIN_SYSTEM_SETTINGS} pagePath="/app/admin/system-settings/page.tsx" />
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold flex items-center gap-3">
							<Settings className="h-8 w-8 text-primary" />
							System Settings
						</h1>
						<p className="mt-2 text-neutral-600 dark:text-neutral-400">
							Configure departments, positions, jobs, and work status
						</p>
					</div>
				</div>

				{/* Tabs */}
				<div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800">
					<button
						onClick={() => setActiveTab('departments')}
						className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
							activeTab === 'departments'
								? 'border-primary text-primary'
								: 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
						}`}
					>
						<Building className="inline h-4 w-4 mr-2" />
						Departments
					</button>
					<button
						onClick={() => setActiveTab('positions')}
						className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
							activeTab === 'positions'
								? 'border-primary text-primary'
								: 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
						}`}
					>
					<Briefcase className="inline h-4 w-4 mr-2" />
					Positions & Roles
				</button>
					<button
						onClick={() => setActiveTab('status')}
						className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
							activeTab === 'status'
								? 'border-primary text-primary'
								: 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
						}`}
					>
						<Activity className="inline h-4 w-4 mr-2" />
						Status
					</button>
				</div>

				{/* Departments Tab */}
				{activeTab === 'departments' && (
					<DepartmentsTab
						departments={departments}
						editingDepartment={editingDepartment}
						showAddDepartment={showAddDepartment}
						newDepartment={newDepartment}
						onSetEditingDepartment={setEditingDepartment}
						onSetShowAddDepartment={setShowAddDepartment}
						onSetNewDepartment={setNewDepartment}
						onAdd={handleAddDepartment}
						onUpdate={handleUpdateDepartment}
						onDelete={handleDeleteDepartment}
					/>
				)}

				{/* Positions & Roles Tab */}
				{activeTab === 'positions' && (
					<PositionsJobsTab
						positions={positions}
						jobs={jobs}
						editingPosition={editingPosition}
						editingJob={editingJob}
						showAddPosition={showAddPosition}
						showAddJob={showAddJob}
						newPosition={newPosition}
						newJob={newJob}
						onSetEditingPosition={setEditingPosition}
						onSetEditingJob={setEditingJob}
						onSetShowAddPosition={setShowAddPosition}
						onSetShowAddJob={setShowAddJob}
						onSetNewPosition={setNewPosition}
						onSetNewJob={setNewJob}
						onAddPosition={handleAddPosition}
						onAddJob={handleAddJob}
						onUpdatePosition={handleUpdatePosition}
						onUpdateJob={handleUpdateJob}
						onDeletePosition={handleDeletePosition}
						onDeleteJob={handleDeleteJob}
					/>
				)}

				{/* Status Tab */}
				{activeTab === 'status' && (
					<CategoriesTab
						categories={statuses}
						editingCategory={editingStatus}
						showAddCategory={showAddStatus}
						newCategory={newStatus}
						onSetEditingCategory={setEditingStatus}
						onSetShowAddCategory={setShowAddStatus}
						onSetNewCategory={setNewStatus}
						onAdd={handleAddStatus}
						onUpdate={handleUpdateStatus}
						onDelete={handleDeleteStatus}
					/>
				)}

				<Toaster />
			</div>
		</>
	)
}

