/**
 * AI Recommendation Manager
 * Centralized state management for all AI recommendations
 */

import { storage } from '../../utils/storage'

export type AIFeatureType = 'tasks' | 'okr' | 'projects'
export type AIStatus = 'idle' | 'analyzing' | 'ready' | 'error'

export interface AIFeatureState<T = unknown> {
	count: number
	lastGenerated: Date | null
	status: AIStatus
	data: T[]
}

export interface AIRecommendationState {
	tasks: AIFeatureState
	okr: AIFeatureState
	projects: AIFeatureState
}

const STORAGE_KEY = 'ai_recommendation_state' as const
const DEFAULT_MAX_AGE_MINUTES = 60 as const

/**
 * Create default feature state
 */
const createDefaultFeatureState = <T = unknown>(): AIFeatureState<T> => ({
	count: 0,
	lastGenerated: null,
	status: 'idle',
	data: [],
})

/**
 * AI Recommendation Manager Class
 */
class AIRecommendationManager {
	private state: AIRecommendationState
	private listeners: Map<AIFeatureType, Set<() => void>>

	constructor() {
		this.state = this.loadState()
		this.listeners = new Map<AIFeatureType, Set<() => void>>([
			['tasks', new Set()],
			['okr', new Set()],
			['projects', new Set()],
		])
	}

	/**
	 * Load state from localStorage with proper date deserialization
	 */
	private loadState(): AIRecommendationState {
		const saved = storage.get<AIRecommendationState>(STORAGE_KEY)
		
		if (saved) {
			return {
				tasks: this.deserializeFeatureState(saved.tasks),
				okr: this.deserializeFeatureState(saved.okr),
				projects: this.deserializeFeatureState(saved.projects),
			}
		}

		return {
			tasks: createDefaultFeatureState(),
			okr: createDefaultFeatureState(),
			projects: createDefaultFeatureState(),
		}
	}

	/**
	 * Deserialize feature state with date conversion
	 */
	private deserializeFeatureState<T>(state: AIFeatureState<T>): AIFeatureState<T> {
		return {
			...state,
			lastGenerated: state.lastGenerated ? new Date(state.lastGenerated) : null,
		}
	}

	/**
	 * Save state to localStorage
	 */
	private saveState(): void {
		storage.set(STORAGE_KEY, this.state)
	}

	/**
	 * Get current state for a feature
	 */
	getState<T = unknown>(feature: AIFeatureType): AIFeatureState<T> {
		return this.state[feature] as AIFeatureState<T>
	}

	/**
	 * Get all state
	 */
	getAllState(): Readonly<AIRecommendationState> {
		return this.state
	}

	/**
	 * Update state for a feature
	 */
	updateState<T = unknown>(
		feature: AIFeatureType,
		updates: Partial<AIFeatureState<T>>
	): void {
		this.state[feature] = {
			...this.state[feature],
			...updates,
		} as AIFeatureState
		
		this.saveState()
		this.notifyListeners(feature)
	}

	/**
	 * Set recommendations ready
	 */
	setRecommendationsReady<T = unknown>(
		feature: AIFeatureType,
		data: T[],
		count?: number
	): void {
		this.updateState(feature, {
			status: 'ready',
			data,
			count: count ?? data.length,
			lastGenerated: new Date(),
		})
	}

	/**
	 * Set analyzing status
	 */
	setAnalyzing(feature: AIFeatureType): void {
		this.updateState(feature, {
			status: 'analyzing',
		})
	}

	/**
	 * Set error status
	 */
	setError(feature: AIFeatureType): void {
		this.updateState(feature, {
			status: 'error',
		})
	}

	/**
	 * Clear recommendations
	 */
	clearRecommendations(feature: AIFeatureType): void {
		this.updateState(feature, {
			count: 0,
			data: [],
			status: 'idle',
		})
	}

	/**
	 * Mark recommendations as viewed (reset badge count only)
	 */
	markAsViewed(feature: AIFeatureType): void {
		this.updateState(feature, {
			count: 0,
		})
	}

	/**
	 * Get total badge count across all features
	 */
	getTotalBadgeCount(): number {
		return Object.values(this.state).reduce((total, feature) => total + feature.count, 0)
	}

	/**
	 * Subscribe to state changes
	 */
	subscribe(feature: AIFeatureType, callback: () => void): () => void {
		const featureListeners = this.listeners.get(feature)
		if (featureListeners) {
			featureListeners.add(callback)
		}

		// Return unsubscribe function
		return () => {
			const listeners = this.listeners.get(feature)
			listeners?.delete(callback)
		}
	}

	/**
	 * Notify all listeners for a feature
	 */
	private notifyListeners(feature: AIFeatureType): void {
		const featureListeners = this.listeners.get(feature)
		featureListeners?.forEach(callback => {
			try {
				callback()
			} catch (error) {
				console.error(`Error in AI recommendation listener for ${feature}:`, error)
			}
		})
	}

	/**
	 * Check if recommendations need refresh based on age
	 */
	needsRefresh(feature: AIFeatureType, maxAgeMinutes: number = DEFAULT_MAX_AGE_MINUTES): boolean {
		const state = this.state[feature]
		
		if (!state.lastGenerated) {
			return true
		}

		const ageMinutes = (Date.now() - state.lastGenerated.getTime()) / 60000
		return ageMinutes > maxAgeMinutes
	}

	/**
	 * Reset all state (for testing/debugging)
	 */
	reset(): void {
		this.state = {
			tasks: createDefaultFeatureState(),
			okr: createDefaultFeatureState(),
			projects: createDefaultFeatureState(),
		}
		this.saveState()
		
		// Notify all listeners
		this.listeners.forEach((_, feature) => this.notifyListeners(feature))
	}
}

// Singleton instance
export const aiRecommendationManager = new AIRecommendationManager()



