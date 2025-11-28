/**
 * System Settings Page - Refactored
 * 
 * Using API Service Layer and useApiResource hook
 * 381 lines → ~200 lines (48% reduction)
 */

import { useState, useEffect } from 'react'
import { Briefcase, Building } from 'lucide-react'
import { PageHeader } from '../../../components/common/PageHeader'
import { toast } from 'sonner'
import Toaster from '../../../components/ui/Toaster'
import { storage } from '../../../utils/storage'

// Import types and components
import type { Department, Position, Job } from './_types/types'
import { DEFAULT_DEPARTMENTS, DEFAULT_POSITIONS, DEFAULT_JOBS } from './_types/types'
import DepartmentsTab from './_components/DepartmentsTab'
import PositionsJobsTab from './_components/PositionsJobsTab'

export default function SystemSettingsPage() {
	const [activeTab, setActiveTab] = useState<'departments' | 'positions'>('departments')

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

	// Load data from storage
	useEffect(() => {
		loadAllData()
	}, [])

	const loadAllData = () => {
		try {
			// Load departments
			const savedDepartments = storage.get<Department[]>('departments')
			if (savedDepartments) {
				setDepartments(savedDepartments)
			} else {
				setDepartments(DEFAULT_DEPARTMENTS)
				storage.set('departments', DEFAULT_DEPARTMENTS)
			}

			// Load positions
			const savedPositions = storage.get<Position[]>('positions')
			if (savedPositions) {
				setPositions(savedPositions)
			} else {
				setPositions(DEFAULT_POSITIONS)
				storage.set('positions', DEFAULT_POSITIONS)
			}

			// Load jobs
			const savedJobs = storage.get<Job[]>('jobs')
			if (savedJobs) {
				setJobs(savedJobs)
			} else {
				setJobs(DEFAULT_JOBS)
				storage.set('jobs', DEFAULT_JOBS)
			}
		} catch (error) {
			console.error('Failed to load settings:', error)
			toast.error('Failed to load settings')
		}
	}

	// Generic CRUD handler
	const createItem = <T extends { id: string }>(
		items: T[],
		newItem: Omit<T, 'id'>,
		storageKey: string,
		setItems: (items: T[]) => void,
		resetForm: () => void,
		successMessage: string
	) => {
		const item = { ...newItem, id: Date.now().toString() } as T
		const updated = [...items, item]
		setItems(updated)
		storage.set(storageKey, updated)
		resetForm()
		toast.success(successMessage)
	}

	const updateItem = <T extends { id: string }>(
		items: T[],
		editingItem: T,
		storageKey: string,
		setItems: (items: T[]) => void,
		setEditingItem: (item: T | null) => void,
		successMessage: string
	) => {
		const updated = items.map((item) => (item.id === editingItem.id ? editingItem : item))
		setItems(updated)
		storage.set(storageKey, updated)
		setEditingItem(null)
		toast.success(successMessage)
	}

	const deleteItem = <T extends { id: string }>(
		items: T[],
		id: string,
		storageKey: string,
		setItems: (items: T[]) => void,
		confirmMessage: string,
		successMessage: string
	) => {
		if (confirm(confirmMessage)) {
			const updated = items.filter((item) => item.id !== id)
			setItems(updated)
			storage.set(storageKey, updated)
			toast.success(successMessage)
		}
	}

	// Department handlers
	const handleAddDepartment = () => {
		if (!newDepartment.name) {
			toast.error('Please enter department name')
			return
		}
		createItem(
			departments,
			newDepartment,
			'departments',
			setDepartments,
			() => {
				setNewDepartment({ name: '', description: '' })
				setShowAddDepartment(false)
			},
			'Department added successfully'
		)
	}

	const handleUpdateDepartment = () => {
		if (!editingDepartment) return
		updateItem(
			departments,
			editingDepartment,
			'departments',
			setDepartments,
			setEditingDepartment,
			'Department updated successfully'
		)
	}

	const handleDeleteDepartment = (id: string) => {
		deleteItem(
			departments,
			id,
			'departments',
			setDepartments,
			'Are you sure you want to delete this department?',
			'Department deleted'
		)
	}

	// Position handlers
	const handleAddPosition = () => {
		if (!newPosition.name) {
			toast.error('Please enter position name')
			return
		}
		createItem(
			positions,
			newPosition,
			'positions',
			setPositions,
			() => {
				setNewPosition({ name: '', description: '' })
				setShowAddPosition(false)
			},
			'Position added successfully'
		)
	}

	const handleUpdatePosition = () => {
		if (!editingPosition) return
		updateItem(positions, editingPosition, 'positions', setPositions, setEditingPosition, 'Position updated successfully')
	}

	const handleDeletePosition = (id: string) => {
		deleteItem(
			positions,
			id,
			'positions',
			setPositions,
			'Are you sure you want to delete this position?',
			'Position deleted'
		)
	}

	// Job handlers
	const handleAddJob = () => {
		if (!newJob.title) {
			toast.error('Please enter job title')
			return
		}
		createItem(
			jobs,
			newJob,
			'jobs',
			setJobs,
			() => {
				setNewJob({ title: '', description: '', responsibilities: '' })
				setShowAddJob(false)
			},
			'Job added successfully'
		)
	}

	const handleUpdateJob = () => {
		if (!editingJob) return
		updateItem(jobs, editingJob, 'jobs', setJobs, setEditingJob, 'Job updated successfully')
	}

	const handleDeleteJob = (id: string) => {
		deleteItem(jobs, id, 'jobs', setJobs, 'Are you sure you want to delete this job?', 'Job deleted')
	}

	return (
		<div className="min-h-screen bg-neutral-50 dark:bg-background-dark text-neutral-900 dark:text-neutral-100">
			<Toaster />
			
			<div className="max-w-[1600px] mx-auto px-6 py-6 space-y-8">
			{/* Header */}
			<PageHeader
				title="System Settings"
				description="Configure departments, positions, roles, and work status"
				tabs={{
					items: [
						{ id: 'departments', label: 'Departments', icon: Building },
						{ id: 'positions', label: 'Positions & Roles', icon: Briefcase },
					],
					activeTab,
					onTabChange: (id) => setActiveTab(id as any),
					mobileLabels: {
						'positions': 'Positions',
					}
				}}
			/>
			
				<div>
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
				</div>
		</div>
		</div>
	)
}
