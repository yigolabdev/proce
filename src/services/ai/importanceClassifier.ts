/**
 * AI Importance Classifier
 * Determines urgency level of AI recommendations
 */

import type { Project, Objective } from '../../types/common.types'
import type { TaskRecommendation } from './recommendation.service'

export type ImportanceLevel = 'critical' | 'high' | 'medium' | 'low'
export type NotificationType = 'toast' | 'badge' | 'silent'

export interface ImportanceResult {
	level: ImportanceLevel
	reason: string
	shouldNotify: boolean
	notificationType: NotificationType
}

/**
 * Classification rules - exported for testing
 */
export const CLASSIFICATION_RULES = {
	critical: {
		projectDeadlineDays: 3,
		projectProgressThreshold: 80,
		okrProgressThreshold: 30,
		okrTimeProgressThreshold: 50,
		noActivityDays: 7,
	},
	high: {
		projectDeadlineDays: 7,
		okrProgressThreshold: 50,
		okrProgressGap: 20,
		noActivityDays: 14,
	},
	medium: {
		projectDeadlineDays: 14,
		okrProgressThreshold: 70,
	},
} as const

/**
 * Importance level hierarchy (for comparison)
 */
const IMPORTANCE_HIERARCHY: readonly ImportanceLevel[] = ['critical', 'high', 'medium', 'low'] as const

/**
 * Calculate days between two dates
 */
function daysBetween(date1: Date, date2: Date): number {
	return Math.ceil((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24))
}

/**
 * Calculate progress percentage
 */
function calculateProgress(current: number, target: number): number {
	return target > 0 ? (current / target) * 100 : 0
}

/**
 * Create importance result
 */
function createResult(
	level: ImportanceLevel,
	reason: string,
	shouldNotify: boolean,
	notificationType: NotificationType
): ImportanceResult {
	return { level, reason, shouldNotify, notificationType }
}

/**
 * Importance Classifier Service
 */
export class ImportanceClassifier {
	/**
	 * Classify project-related recommendation
	 */
	classifyProject(project: Project, _recommendation?: TaskRecommendation): ImportanceResult {
		const now = new Date()
		const endDate = new Date(project.endDate)
		const daysUntilDeadline = daysBetween(now, endDate)
		const { progress } = project

		// Critical: Deadline < 3 days and progress < 80%
		if (
			daysUntilDeadline <= CLASSIFICATION_RULES.critical.projectDeadlineDays &&
			progress < CLASSIFICATION_RULES.critical.projectProgressThreshold
		) {
			return createResult(
				'critical',
				`Project deadline in ${daysUntilDeadline} days with ${progress}% completion`,
				true,
				'toast'
			)
		}

		// High: Deadline < 7 days
		if (daysUntilDeadline <= CLASSIFICATION_RULES.high.projectDeadlineDays) {
			return createResult(
				'high',
				`Project deadline approaching in ${daysUntilDeadline} days`,
				true,
				'badge'
			)
		}

		// Medium: Deadline < 14 days
		if (daysUntilDeadline <= CLASSIFICATION_RULES.medium.projectDeadlineDays) {
			return createResult(
				'medium',
				`Project deadline in ${daysUntilDeadline} days`,
				false,
				'silent'
			)
		}

		// Low: Everything else
		return createResult('low', 'Normal project timeline', false, 'silent')
	}

	/**
	 * Classify OKR-related recommendation
	 */
	classifyOKR(objective: Objective, _recommendation?: any): ImportanceResult {
		const now = new Date()
		const endDate = new Date(objective.endDate)
		const startDate = new Date(objective.startDate)

		const totalDuration = endDate.getTime() - startDate.getTime()
		const elapsed = now.getTime() - startDate.getTime()
		const timeProgress = (elapsed / totalDuration) * 100

		// Calculate actual progress from key results
		const actualProgress = this.calculateOKRProgress(objective)

		// Critical: More than 50% time passed but less than 30% progress
		if (
			timeProgress > CLASSIFICATION_RULES.critical.okrTimeProgressThreshold &&
			actualProgress < CLASSIFICATION_RULES.critical.okrProgressThreshold
		) {
			return createResult(
				'critical',
				`OKR ${Math.round(timeProgress)}% through period but only ${Math.round(actualProgress)}% complete`,
				true,
				'toast'
			)
		}

		// High: Progress lagging behind time
		if (actualProgress < timeProgress - CLASSIFICATION_RULES.high.okrProgressGap) {
			return createResult(
				'high',
				`OKR progress (${Math.round(actualProgress)}%) lagging behind timeline (${Math.round(timeProgress)}%)`,
				true,
				'badge'
			)
		}

		// Medium: On track or slightly behind
		if (actualProgress < timeProgress) {
			return createResult(
				'medium',
				'OKR progress slightly behind schedule',
				false,
				'silent'
			)
		}

		// Low: On track or ahead
		return createResult('low', 'OKR on track', false, 'silent')
	}

	/**
	 * Calculate OKR progress from key results
	 */
	private calculateOKRProgress(objective: Objective): number {
		if (!objective.keyResults || objective.keyResults.length === 0) {
			return 0
		}

		const totalProgress = objective.keyResults.reduce((sum, kr) => {
			return sum + calculateProgress(kr.current, kr.target)
		}, 0)

		return totalProgress / objective.keyResults.length
	}

	/**
	 * Classify task recommendation
	 */
	classifyTask(recommendation: TaskRecommendation): ImportanceResult {
		switch (recommendation.priority) {
			case 'high':
				return createResult('high', 'High priority task recommendation', true, 'badge')
			case 'medium':
				return createResult('medium', 'Medium priority task recommendation', false, 'silent')
			case 'low':
			default:
				return createResult('low', 'Low priority task recommendation', false, 'silent')
		}
	}

	/**
	 * Classify based on inactivity
	 */
	classifyInactivity(lastActivityDate: Date): ImportanceResult {
		const now = new Date()
		const daysSinceActivity = daysBetween(lastActivityDate, now)

		// Critical: No activity for 7+ days
		if (daysSinceActivity >= CLASSIFICATION_RULES.critical.noActivityDays) {
			return createResult(
				'critical',
				`No activity for ${daysSinceActivity} days`,
				true,
				'toast'
			)
		}

		// High: No activity for 14+ days
		if (daysSinceActivity >= CLASSIFICATION_RULES.high.noActivityDays) {
			return createResult(
				'high',
				`No activity for ${daysSinceActivity} days`,
				true,
				'badge'
			)
		}

		return createResult('low', 'Recent activity detected', false, 'silent')
	}

	/**
	 * Classify a batch of recommendations and return highest importance
	 */
	classifyBatch(
		recommendations: unknown[],
		type: 'project' | 'okr' | 'task'
	): ImportanceResult {
		if (recommendations.length === 0) {
			return createResult('low', 'No recommendations', false, 'silent')
		}

		let highestLevel: ImportanceLevel = 'low'
		let highestReason = ''

		for (const rec of recommendations) {
			const result = this.classifyRecommendation(rec, type)
			
			if (this.isHigherPriority(result.level, highestLevel)) {
				highestLevel = result.level
				highestReason = result.reason
			}
		}

		const shouldNotify = highestLevel === 'critical' || highestLevel === 'high'
		const notificationType: NotificationType = 
			highestLevel === 'critical' ? 'toast' : shouldNotify ? 'badge' : 'silent'

		return createResult(
			highestLevel,
			highestReason || `${recommendations.length} ${type} recommendations available`,
			shouldNotify,
			notificationType
		)
	}

	/**
	 * Classify a single recommendation based on type
	 */
	private classifyRecommendation(rec: unknown, type: 'project' | 'okr' | 'task'): ImportanceResult {
		const recommendation = rec as Record<string, any>

		switch (type) {
			case 'task':
				return this.classifyTask(recommendation as TaskRecommendation)
			case 'okr':
				return recommendation.objective
					? this.classifyOKR(recommendation.objective as Objective, recommendation)
					: createResult('low', '', false, 'silent')
			case 'project':
				return recommendation.project
					? this.classifyProject(recommendation.project as Project, recommendation as TaskRecommendation)
					: createResult('low', '', false, 'silent')
			default:
				return createResult('low', '', false, 'silent')
		}
	}

	/**
	 * Compare importance levels
	 */
	private isHigherPriority(level1: ImportanceLevel, level2: ImportanceLevel): boolean {
		const index1 = IMPORTANCE_HIERARCHY.indexOf(level1)
		const index2 = IMPORTANCE_HIERARCHY.indexOf(level2)
		return index1 < index2
	}
}

// Singleton instance
export const importanceClassifier = new ImportanceClassifier()


