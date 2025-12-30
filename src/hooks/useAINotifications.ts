/**
 * useAINotifications Hook
 * Subscribe to AI recommendation notifications and badge counts
 */

import { useState, useEffect, useCallback } from 'react'
import { aiRecommendationManager, type AIFeatureType } from '../services/ai/aiRecommendationManager'

export interface AINotifications {
	tasks: number
	okr: number
	projects: number
	total: number
}

/**
 * Hook to manage AI recommendation notifications
 * Automatically subscribes to state changes and updates badge counts
 */
export function useAINotifications() {
	const [notifications, setNotifications] = useState<AINotifications>(() => {
		// Initialize with current state
		const state = aiRecommendationManager.getAllState()
		return {
			tasks: state.tasks.count,
			okr: state.okr.count,
			projects: state.projects.count,
			total: aiRecommendationManager.getTotalBadgeCount(),
		}
	})

	const updateNotifications = useCallback(() => {
		const state = aiRecommendationManager.getAllState()
		setNotifications({
			tasks: state.tasks.count,
			okr: state.okr.count,
			projects: state.projects.count,
			total: aiRecommendationManager.getTotalBadgeCount(),
		})
	}, [])

	useEffect(() => {
		// Subscribe to changes for all features
		const unsubscribers = [
			aiRecommendationManager.subscribe('tasks', updateNotifications),
			aiRecommendationManager.subscribe('okr', updateNotifications),
			aiRecommendationManager.subscribe('projects', updateNotifications),
		]

		// Cleanup subscriptions on unmount
		return () => {
			unsubscribers.forEach(unsubscribe => unsubscribe())
		}
	}, [updateNotifications])

	const markAsViewed = useCallback((feature: AIFeatureType) => {
		aiRecommendationManager.markAsViewed(feature)
	}, [])

	const clearAll = useCallback(() => {
		const features: AIFeatureType[] = ['tasks', 'okr', 'projects']
		features.forEach(feature => {
			aiRecommendationManager.clearRecommendations(feature)
		})
	}, [])

	return {
		notifications,
		markAsViewed,
		clearAll,
	}
}


