/**
 * useAutoSave Hook
 * 자동 저장 기능 관리
 */

import { useEffect, useRef, useCallback, useState } from 'react'
import { useDebounce } from './useDebounce'

export type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export interface UseAutoSaveOptions<T> {
	data: T
	onSave: (data: T) => Promise<void> | void
	delay?: number
	enabled?: boolean
}

export interface UseAutoSaveReturn {
	status: AutoSaveStatus
	save: () => Promise<void>
	lastSavedAt: Date | null
}

export function useAutoSave<T>({
	data,
	onSave,
	delay = 3000,
	enabled = true,
}: UseAutoSaveOptions<T>): UseAutoSaveReturn {
	const [status, setStatus] = useState<AutoSaveStatus>('idle')
	const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
	const isMounted = useRef(true)
	const previousData = useRef<T>(data)

	// Debounce data changes
	const debouncedData = useDebounce(data, delay)

	const save = useCallback(async () => {
		if (!enabled) return

		setStatus('saving')
		try {
			await onSave(data)
			if (isMounted.current) {
				setStatus('saved')
				setLastSavedAt(new Date())
				previousData.current = data

				// Reset to idle after 2 seconds
				setTimeout(() => {
					if (isMounted.current) {
						setStatus('idle')
					}
				}, 2000)
			}
		} catch (error) {
			console.error('Auto-save failed:', error)
			if (isMounted.current) {
				setStatus('error')
			}
		}
	}, [data, enabled, onSave])

	// Auto-save when debounced data changes
	useEffect(() => {
		if (!enabled) return

		// Skip initial mount
		if (previousData.current === debouncedData) return

		// Check if data actually changed
		if (JSON.stringify(previousData.current) === JSON.stringify(debouncedData)) {
			return
		}

		save()
	}, [debouncedData, enabled, save])

	// Cleanup
	useEffect(() => {
		return () => {
			isMounted.current = false
		}
	}, [])

	return {
		status,
		save,
		lastSavedAt,
	}
}

