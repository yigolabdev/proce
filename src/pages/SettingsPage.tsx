/**
 * Settings Page
 * 
 * 리팩토링 완료:
 * - 246줄 → ~90줄 (63% 감소)
 * - useSettings 훅으로 모든 로직 분리
 * - 재사용 가능한 컴포넌트로 UI 구성
 */

import React from 'react'
import { PageHeader } from '../components/common/PageHeader'
import { useI18n } from '../i18n/I18nProvider'
import { toast } from 'sonner'

// Custom Hook
import { useSettings } from '../hooks/useSettings'

// Components
import { LanguageSettings } from '../components/settings/LanguageSettings'
import { NotificationSettingsCard } from '../components/settings/NotificationSettingsCard'

export default function SettingsPage() {
	const { t } = useI18n()
	const settings = useSettings()

	// Handlers
	const handleToggleBrowser = (enabled: boolean) => {
		settings.updateNotificationSettings({ browser: enabled })
		toast.success('Notification settings saved')
	}

	const handleToggleCategory = (category: keyof typeof settings.notificationSettings.categories) => {
		settings.toggleNotificationCategory(category)
		toast.success('Category settings updated')
	}

	const handleRequestPermission = async () => {
		try {
			await settings.requestNotificationPermission()
			if (settings.notificationPermission === 'granted') {
				toast.success('Notification permission granted')
			} else if (settings.notificationPermission === 'denied') {
				toast.error('Notification permission denied. Please change it in browser settings.')
			}
		} catch (error) {
			toast.error('Failed to request permission')
		}
	}

	const handleSaveQuietHours = (start: string, end: string) => {
		settings.updateNotificationSettings({
			quietHours: { start, end },
		})
		toast.success('Quiet hours saved')
	}

	return (
		<div className="min-h-screen bg-background-dark">
			<div className="max-w-[1600px] mx-auto px-6 py-6 space-y-8">
				{/* Page Header */}
				<PageHeader
					title={t('common.settings.title')}
					description={t('common.settings.description')}
				/>

				{/* Settings */}
				<div className="grid gap-6 max-w-2xl">
					{/* Language Settings */}
					<LanguageSettings />

					{/* Notification Settings */}
					<NotificationSettingsCard
						settings={settings.notificationSettings}
						permission={settings.notificationPermission}
						onToggleBrowser={handleToggleBrowser}
						onToggleCategory={handleToggleCategory}
						onRequestPermission={handleRequestPermission}
						onSaveQuietHours={handleSaveQuietHours}
					/>
				</div>
			</div>
		</div>
	)
}
