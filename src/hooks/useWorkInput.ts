/**
 * useWorkInput Hook
 * 업무 입력 폼 상태 및 로직 관리
 */

import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { storage } from '../utils/storage'
import { toast } from 'sonner'
import { HistoryTracker } from '../utils/storage'
import type { 
	WorkInputFormData, 
	InputMode,
	WorkDraft,
	UseWorkInputReturn 
} from '../types/workInput.types'
import type { WorkEntry, Project, WorkCategory } from '../types/common.types'

const DRAFT_KEY = 'work-input-draft'

export function useWorkInput(): UseWorkInputReturn {
	const navigate = useNavigate()

	// Form state
	const [formData, setFormData] = useState<WorkInputFormData>({
		title: '',
		description: '',
		category: '',
		customCategory: '',
		projectId: '',
		tags: [],
		comment: '',
		files: [],
		links: [],
		isConfidential: false,
	})

	// Mode state
	const [mode, setMode] = useState<InputMode>('free')

	// Data state
	const [projects, setProjects] = useState<Project[]>([])
	const [categories, setCategories] = useState<WorkCategory[]>([])
	const [reviewers, setReviewers] = useState<any[]>([])

	// Status state
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

	// Load initial data
	useEffect(() => {
		loadInitialData()
		loadDraftFromStorage()
	}, [])

	/**
	 * Load projects, categories, reviewers
	 */
	const loadInitialData = useCallback(() => {
		try {
			const savedProjects = storage.get<Project[]>('projects', [])
			const savedCategories = storage.get<WorkCategory[]>('workCategories', [])
			const savedUsers = storage.get<any[]>('users', [])

			setProjects(savedProjects || [])
			setCategories(savedCategories || [])
			setReviewers((savedUsers || []).filter(u => u.role !== 'user'))
		} catch (error) {
			console.error('Failed to load initial data:', error)
			toast.error('Failed to load data')
		}
	}, [])

	/**
	 * Load draft from storage
	 */
	const loadDraftFromStorage = useCallback(() => {
		try {
			const draft = storage.get<WorkInputFormData>(DRAFT_KEY)
			if (draft) {
				setFormData(draft)
			}
		} catch (error) {
			console.error('Failed to load draft:', error)
		}
	}, [])

	/**
	 * Update form data (partial update)
	 */
	const updateFormData = useCallback((updates: Partial<WorkInputFormData>) => {
		setFormData(prev => ({ ...prev, ...updates }))
	}, [])

	/**
	 * Reset form
	 */
	const resetForm = useCallback(() => {
		setFormData({
			title: '',
			description: '',
			category: '',
			customCategory: '',
			projectId: '',
			tags: [],
			comment: '',
			files: [],
			links: [],
			isConfidential: false,
			reviewerId: undefined,
		})
		storage.remove(DRAFT_KEY)
		setAutoSaveStatus('idle')
	}, [])

	/**
	 * Validate form
	 */
	const validateForm = useCallback((): boolean => {
		if (!formData.title.trim()) {
			toast.error('Title is required')
			return false
		}

		if (!formData.description.trim()) {
			toast.error('Description is required')
			return false
		}

		if (!formData.category && !formData.customCategory) {
			toast.error('Category is required')
			return false
		}

		if (!formData.projectId) {
			toast.error('Project is required')
			return false
		}

		return true
	}, [formData])

	/**
	 * Submit form
	 */
	const handleSubmit = useCallback(async (e: React.FormEvent) => {
		e.preventDefault()

		if (!validateForm()) {
			return
		}

		setIsSubmitting(true)

		try {
			// Create work entry
			const newEntry: WorkEntry = {
				id: `work-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
				title: formData.title,
				description: formData.description,
				category: formData.customCategory || formData.category,
				projectId: formData.projectId,
				projectName: projects.find(p => p.id === formData.projectId)?.name || '',
				tags: formData.tags,
				date: new Date(),
				status: 'completed' as const,
				timeSpent: 0,
				userId: 'current-user', // TODO: Get from auth context
				userName: 'Current User', // TODO: Get from auth context
				department: 'Engineering', // TODO: Get from auth context
				files: formData.files,
				links: formData.links,
				isConfidential: formData.isConfidential,
			}

		// Save to storage
		const entries = storage.get<WorkEntry[]>('workEntries', []) || []
		entries.unshift(newEntry)
		storage.set('workEntries', entries)

		// Track history
		HistoryTracker.addHistory({
			workEntryId: newEntry.id,
			action: 'created',
			changedBy: 'Current User',
			changedById: 'current-user-id',
			changedAt: new Date(),
			changedByDepartment: 'Engineering',
		})

		// Create review request if reviewer is selected
		if (formData.reviewerId) {
			const pendingReviews = storage.get<any[]>('pending_reviews', []) || []
			pendingReviews.push({
					id: `review-${Date.now()}`,
					workEntryId: newEntry.id,
					workTitle: newEntry.title,
					projectId: newEntry.projectId,
					projectName: newEntry.projectName,
					requestedBy: 'current-user',
					requestedTo: formData.reviewerId,
					requestedAt: new Date(),
					status: 'pending',
					comment: formData.comment,
				})
				storage.set('pending_reviews', pendingReviews)
			}

			// Clear draft and reset form
			storage.remove(DRAFT_KEY)
			resetForm()

			toast.success('Work entry created successfully')
			navigate('/app/work-history')
		} catch (error) {
			console.error('Failed to submit work entry:', error)
			toast.error('Failed to create work entry')
		} finally {
			setIsSubmitting(false)
		}
	}, [formData, projects, validateForm, resetForm, navigate])

	/**
	 * Save draft
	 */
	const saveDraft = useCallback(() => {
		try {
			setAutoSaveStatus('saving')
			storage.set(DRAFT_KEY, formData)
			
		// Also save to drafts list
		const drafts = storage.get<WorkDraft[]>('work_drafts', []) || []
		const existingIndex = drafts.findIndex(d => d.id === 'auto-draft')
			
			const draft: WorkDraft = {
				id: 'auto-draft',
				title: formData.title || 'Untitled Draft',
				description: formData.description,
				category: formData.category,
				projectId: formData.projectId,
				tags: formData.tags,
				savedAt: new Date(),
				userId: 'current-user', // TODO: Get from auth context
			}

			if (existingIndex >= 0) {
				drafts[existingIndex] = draft
			} else {
				drafts.unshift(draft)
			}

			storage.set('work_drafts', drafts)
			setAutoSaveStatus('saved')

			setTimeout(() => setAutoSaveStatus('idle'), 2000)
		} catch (error) {
			console.error('Failed to save draft:', error)
			setAutoSaveStatus('idle')
		}
	}, [formData])

	/**
	 * Load draft
	 */
	const loadDraft = useCallback((draft: WorkDraft) => {
		setFormData({
			title: draft.title,
			description: draft.description,
			category: draft.category,
			customCategory: '',
			projectId: draft.projectId,
			tags: draft.tags,
			comment: '',
			files: [],
			links: [],
			isConfidential: false,
		})
		toast.success('Draft loaded')
	}, [])

	return {
		// Form State
		formData,
		setFormData: updateFormData,
		resetForm,

		// Mode
		mode,
		setMode,

		// Data
		projects,
		categories,
		reviewers,

		// Actions
		handleSubmit,
		saveDraft,
		loadDraft,

		// Status
		isSubmitting,
		autoSaveStatus,
	}
}

