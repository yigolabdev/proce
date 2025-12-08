/**
 * useSettings Hook
 * 설정 관리 로직
 */

import { useState, useEffect, useCallback } from 'react'
import { NotificationManager, type NotificationSettings } from '../utils/notificationUtils'

export interface UseSettingsReturn {
	// Notification settings
	notificationSettings: NotificationSettings
	notificationPermission: NotificationPermission
	updateNotificationSettings: (updates: Partial<NotificationSettings>) => void
	toggleNotificationCategory: (category: keyof NotificationSettings['categories']) => void
	requestNotificationPermission: () => Promise<void>
	
	// State
	isLoading: boolean
	error: Error | null
}

export function useSettings(): UseSettingsReturn {
	const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(
		NotificationManager.getSettings()
	)
	const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
		'Notification' in window ? Notification.permission : 'denied'
	)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	// Load settings
	useEffect(() => {
		try {
			const settings = NotificationManager.getSettings()
			setNotificationSettings(settings)
		} catch (err) {
			const error = err instanceof Error ? err : new Error('Failed to load settings')
			setError(error)
		}
	}, [])

	// Update notification settings
	const updateNotificationSettings = useCallback((updates: Partial<NotificationSettings>) => {
		try {
			const newSettings = { ...notificationSettings, ...updates }
			setNotificationSettings(newSettings)
			NotificationManager.saveSettings(newSettings)
		} catch (err) {
			const error = err instanceof Error ? err : new Error('Failed to save settings')
			setError(error)
			throw error
		}
	}, [notificationSettings])

	// Toggle category
	const toggleNotificationCategory = useCallback(
		(category: keyof NotificationSettings['categories']) => {
			try {
				updateNotificationSettings({
					categories: {
						...notificationSettings.categories,
						[category]: !notificationSettings.categories[category],
					},
				})
			} catch (err) {
				const error = err instanceof Error ? err : new Error('Failed to toggle category')
				setError(error)
			}
		},
		[notificationSettings, updateNotificationSettings]
	)

	// Request permission
	const requestNotificationPermission = useCallback(async () => {
		try {
			setIsLoading(true)
			const permission = await NotificationManager.requestPermission()
			setNotificationPermission(permission)

			if (permission === 'granted') {
				// Send test notification
				NotificationManager.send({
					title: 'Notifications Enabled',
					body: 'You will now receive important updates from Proce',
					category: 'teamMessage',
				})
			}
		} catch (err) {
			const error = err instanceof Error ? err : new Error('Failed to request permission')
			setError(error)
			throw error
		} finally {
			setIsLoading(false)
		}
	}, [])

	return {
		// Notification settings
		notificationSettings,
		notificationPermission,
		updateNotificationSettings,
		toggleNotificationCategory,
		requestNotificationPermission,

		// State
		isLoading,
		error,
	}
}

