/**
 * AI Recommendation Background Analyzer Initializer
 * Sets up data change listeners to trigger background analysis
 */

import { backgroundAnalyzer } from '../services/ai/backgroundAnalyzer'

const DEBOUNCE_MS = 2000 as const
const CUSTOM_EVENT_NAME = 'localStorageChange' as const

/**
 * Storage keys that trigger analysis
 */
const TRIGGER_KEYS = {
	TASKS: ['projects', 'workEntries'] as const,
	OKR: ['objectives'] as const,
} as const

/**
 * Debounce timer type
 */
type TimerKey = 'tasks' | 'okr'

/**
 * Module state
 */
let isInitialized = false
let debounceTimers: Partial<Record<TimerKey, ReturnType<typeof setTimeout>>> = {}
let originalSetItem: typeof localStorage.setItem | null = null

/**
 * Handle storage change events from other windows/tabs
 */
function handleStorageChange(event: StorageEvent): void {
	if (event.key) {
		handleLocalStorageChange(event.key)
	}
}

/**
 * Handle custom storage change events from same window
 */
function handleCustomStorageChange(event: Event): void {
	const customEvent = event as CustomEvent<{ key: string; value: string }>
	if (customEvent.detail?.key) {
		handleLocalStorageChange(customEvent.detail.key)
	}
}

/**
 * Clear existing timer for a feature
 */
function clearTimer(timerKey: TimerKey): void {
	const existingTimer = debounceTimers[timerKey]
	if (existingTimer) {
		clearTimeout(existingTimer)
		delete debounceTimers[timerKey]
	}
}

/**
 * Schedule analysis with debouncing
 */
function scheduleAnalysis(timerKey: TimerKey, callback: () => void): void {
	clearTimer(timerKey)
	debounceTimers[timerKey] = setTimeout(callback, DEBOUNCE_MS)
}

/**
 * Handle storage changes and trigger appropriate analysis
 */
function handleLocalStorageChange(key: string): void {
	// Check if key triggers task/project analysis
	if (TRIGGER_KEYS.TASKS.includes(key as any)) {
		scheduleAnalysis('tasks', () => {
			console.log('📊 Data changed, triggering task recommendations analysis')
			backgroundAnalyzer.analyzeTaskRecommendations()
			backgroundAnalyzer.analyzeProjectRecommendations()
		})
		return
	}

	// Check if key triggers OKR analysis
	if (TRIGGER_KEYS.OKR.includes(key as any)) {
		scheduleAnalysis('okr', () => {
			console.log('🎯 OKR data changed, triggering OKR recommendations analysis')
			backgroundAnalyzer.analyzeOKRRecommendations()
		})
		return
	}
}

/**
 * Patch localStorage.setItem to emit custom events
 */
function patchLocalStorage(): void {
	if (originalSetItem) return // Already patched

	originalSetItem = localStorage.setItem
	localStorage.setItem = function (key: string, value: string) {
		// Dispatch custom event for same-window detection
		const event = new CustomEvent(CUSTOM_EVENT_NAME, {
			detail: { key, value },
		})
		window.dispatchEvent(event)

		// Call original method
		originalSetItem!.call(this, key, value)
	}
}

/**
 * Restore original localStorage.setItem
 */
function unpatchLocalStorage(): void {
	if (originalSetItem) {
		localStorage.setItem = originalSetItem
		originalSetItem = null
	}
}

/**
 * Initialize background analysis listeners
 */
export function initializeAIBackgroundAnalysis(): void {
	if (isInitialized) {
		console.log('🤖 AI background analysis already initialized')
		return
	}

	console.log('🤖 Initializing AI background analysis listeners')

	// Listen for storage changes from other windows/tabs
	window.addEventListener('storage', handleStorageChange)

	// Patch localStorage and listen for same-window changes
	patchLocalStorage()
	window.addEventListener(CUSTOM_EVENT_NAME, handleCustomStorageChange)

	isInitialized = true
}

/**
 * Cleanup listeners and restore original localStorage
 * Useful for testing or when unmounting the app
 */
export function cleanupAIBackgroundAnalysis(): void {
	if (!isInitialized) return

	// Remove event listeners
	window.removeEventListener('storage', handleStorageChange)
	window.removeEventListener(CUSTOM_EVENT_NAME, handleCustomStorageChange)

	// Restore original localStorage
	unpatchLocalStorage()

	// Clear all timers
	Object.values(debounceTimers).forEach(timer => {
		if (timer) clearTimeout(timer)
	})
	debounceTimers = {}

	isInitialized = false
	console.log('🤖 AI background analysis listeners cleaned up')
}


