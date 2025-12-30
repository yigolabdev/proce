/**
 * Background Analyzer Service
 * Silent AI analysis without UI updates
 */

import { aiRecommendationManager, type AIFeatureType } from './aiRecommendationManager'
import { importanceClassifier, type ImportanceResult } from './importanceClassifier'
import { AIRecommendationService, type AnalysisResult } from './recommendation.service'
import { OKRRecommendationService, type OKRAnalysisResult } from './okrRecommendation.service'
import type { Project, WorkEntry, Objective } from '../../types/common.types'
import { storage } from '../../utils/storage'
import { toast } from 'sonner'

/**
 * Analysis configuration
 */
const ANALYSIS_CONFIG = {
	DEBOUNCE_MS: 2000,
	TOAST_DURATION: 10000,
	PROJECT_DEADLINE_WARNING_DAYS: 7,
	PROJECT_CRITICAL_PROGRESS: 70,
	PROJECT_INACTIVE_DAYS: 7,
} as const

/**
 * Type labels for notifications
 */
const TYPE_LABELS: Record<AIFeatureType, string> = {
	tasks: 'Task',
	okr: 'OKR',
	projects: 'Project',
} as const

/**
 * Project issue recommendation
 */
interface ProjectIssue {
	id: string
	type: 'project'
	project: Project
	title: string
	description: string
	priority: 'high' | 'medium' | 'low'
	category: string
}

/**
 * Analysis function type
 */
type AnalysisFunction = () => Promise<void>

/**
 * Background Analyzer Class
 */
class BackgroundAnalyzer {
	private timeouts: Map<AIFeatureType, ReturnType<typeof setTimeout>>
	private readonly aiRecommendationService: AIRecommendationService
	private readonly okrRecommendationService: OKRRecommendationService

	constructor() {
		this.timeouts = new Map()
		this.aiRecommendationService = new AIRecommendationService()
		this.okrRecommendationService = new OKRRecommendationService()
	}

	/**
	 * Generic analysis scheduler with debouncing
	 */
	private scheduleAnalysis(
		feature: AIFeatureType,
		analysisFunc: AnalysisFunction,
		immediate: boolean
	): Promise<void> {
		// Clear existing timeout
		const existingTimeout = this.timeouts.get(feature)
		if (existingTimeout) {
			clearTimeout(existingTimeout)
		}

		if (immediate) {
			return analysisFunc()
		}

		return new Promise((resolve) => {
			const timeout = setTimeout(async () => {
				await analysisFunc()
				this.timeouts.delete(feature)
				resolve()
			}, ANALYSIS_CONFIG.DEBOUNCE_MS)
			
			this.timeouts.set(feature, timeout)
		})
	}

	/**
	 * Handle analysis errors
	 */
	private handleAnalysisError(feature: AIFeatureType, error: unknown): void {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error'
		console.error(`Background ${feature} analysis failed:`, errorMessage, error)
		aiRecommendationManager.setError(feature)
	}

	/**
	 * Notify user with appropriate method based on importance
	 */
	private notifyUser(
		feature: AIFeatureType,
		count: number,
		importance: ImportanceResult
	): void {
		if (importance.notificationType !== 'toast') return

		const label = TYPE_LABELS[feature]
		const plural = count > 1 ? 's' : ''

		toast.warning(
			`⚠️ ${count} ${label} recommendation${plural} require attention`,
			{
				description: importance.reason,
				action: {
					label: 'View',
					onClick: () => {
						window.location.href = '/ai-recommendations'
					},
				},
				duration: ANALYSIS_CONFIG.TOAST_DURATION,
			}
		)
	}

	/**
	 * Process analysis results
	 */
	private processAnalysisResults<T>(
		feature: AIFeatureType,
		recommendations: T[],
		type: 'task' | 'okr' | 'project'
	): void {
		// Store recommendations
		aiRecommendationManager.setRecommendationsReady(
			feature,
			recommendations,
			recommendations.length
		)

		// Check importance and notify if needed
		const importance = importanceClassifier.classifyBatch(recommendations, type)

		if (importance.shouldNotify) {
			this.notifyUser(feature, recommendations.length, importance)
		}

		console.log(`✨ Background: Analyzed ${recommendations.length} ${feature} recommendations`)
	}

	/**
	 * Trigger task recommendations analysis
	 */
	async analyzeTaskRecommendations(immediate: boolean = false): Promise<void> {
		return this.scheduleAnalysis('tasks', async () => {
			try {
				aiRecommendationManager.setAnalyzing('tasks')

				const workEntries = storage.get<WorkEntry[]>('workEntries', [])
				const projects = storage.get<Project[]>('projects', [])

				const result = await this.aiRecommendationService.generateRecommendations(
					workEntries,
					projects
				)

				this.processAnalysisResults('tasks', result.recommendations, 'task')
			} catch (error) {
				this.handleAnalysisError('tasks', error)
			}
		}, immediate)
	}

	/**
	 * Trigger OKR recommendations analysis
	 */
	async analyzeOKRRecommendations(immediate: boolean = false): Promise<void> {
		return this.scheduleAnalysis('okr', async () => {
			try {
				aiRecommendationManager.setAnalyzing('okr')

				const objectives = storage.get<Objective[]>('objectives', [])
				const projects = storage.get<Project[]>('projects', [])
				const workEntries = storage.get<WorkEntry[]>('workEntries', [])

				// Convert common.types Objective to okr.types Objective if needed
				const okrObjectives = objectives.map(obj => ({
					...obj,
					periodType: 'quarter' as const,
				}))

				const result = await this.okrRecommendationService.generateRecommendations(
					okrObjectives as any,
					projects,
					workEntries
				)

				this.processAnalysisResults('okr', result.recommendations, 'okr')
			} catch (error) {
				this.handleAnalysisError('okr', error)
			}
		}, immediate)
	}

	/**
	 * Trigger project recommendations analysis
	 */
	async analyzeProjectRecommendations(immediate: boolean = false): Promise<void> {
		return this.scheduleAnalysis('projects', async () => {
			try {
				aiRecommendationManager.setAnalyzing('projects')

				const projects = storage.get<Project[]>('projects', [])
				const workEntries = storage.get<WorkEntry[]>('workEntries', [])

				const recommendations = this.analyzeProjectsForIssues(projects, workEntries)

				this.processAnalysisResults('projects', recommendations, 'project')
			} catch (error) {
				this.handleAnalysisError('projects', error)
			}
		}, immediate)
	}

	/**
	 * Analyze projects for critical issues
	 */
	private analyzeProjectsForIssues(
		projects: Project[],
		workEntries: WorkEntry[]
	): ProjectIssue[] {
		const recommendations: ProjectIssue[] = []
		const now = new Date()

		for (const project of projects) {
			if (project.status === 'completed') continue

			// Check deadline warnings
			const deadlineIssue = this.checkProjectDeadline(project, now)
			if (deadlineIssue) {
				recommendations.push(deadlineIssue)
			}

			// Check inactivity
			const inactivityIssue = this.checkProjectInactivity(project, workEntries, now)
			if (inactivityIssue) {
				recommendations.push(inactivityIssue)
			}
		}

		return recommendations
	}

	/**
	 * Check project deadline status
	 */
	private checkProjectDeadline(project: Project, now: Date): ProjectIssue | null {
		const endDate = new Date(project.endDate)
		const daysUntilDeadline = Math.ceil(
			(endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
		)

		if (
			daysUntilDeadline <= ANALYSIS_CONFIG.PROJECT_DEADLINE_WARNING_DAYS &&
			project.progress < ANALYSIS_CONFIG.PROJECT_CRITICAL_PROGRESS
		) {
			return {
				id: `project-deadline-${project.id}`,
				type: 'project',
				project,
				title: `Action needed: ${project.name}`,
				description: `Deadline in ${daysUntilDeadline} days with ${project.progress}% completion`,
				priority: daysUntilDeadline <= 3 ? 'high' : 'medium',
				category: 'Project Deadline',
			}
		}

		return null
	}

	/**
	 * Check project inactivity
	 */
	private checkProjectInactivity(
		project: Project,
		workEntries: WorkEntry[],
		now: Date
	): ProjectIssue | null {
		const projectWorkEntries = workEntries.filter(we => we.projectId === project.id)
		
		if (projectWorkEntries.length === 0) return null

		const latestEntry = projectWorkEntries.reduce((latest, current) =>
			new Date(current.date) > new Date(latest.date) ? current : latest
		)

		const daysSinceLastActivity = Math.floor(
			(now.getTime() - new Date(latestEntry.date).getTime()) / (1000 * 60 * 60 * 24)
		)

		if (daysSinceLastActivity >= ANALYSIS_CONFIG.PROJECT_INACTIVE_DAYS) {
			return {
				id: `project-inactive-${project.id}`,
				type: 'project',
				project,
				title: `Inactive project: ${project.name}`,
				description: `No activity for ${daysSinceLastActivity} days`,
				priority: 'medium',
				category: 'Project Activity',
			}
		}

		return null
	}

	/**
	 * Trigger analysis for all features
	 */
	async analyzeAll(immediate: boolean = false): Promise<void> {
		await Promise.all([
			this.analyzeTaskRecommendations(immediate),
			this.analyzeOKRRecommendations(immediate),
			this.analyzeProjectRecommendations(immediate),
		])
	}

	/**
	 * Cancel all pending analyses
	 */
	cancelAll(): void {
		this.timeouts.forEach(timeout => clearTimeout(timeout))
		this.timeouts.clear()
	}
}

// Singleton instance
export const backgroundAnalyzer = new BackgroundAnalyzer()


