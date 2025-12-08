/**
 * NotificationSettingsCard Component
 * 알림 설정
 */

import React from 'react'
import { Card, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import { Bell, BellOff, Clock } from 'lucide-react'
import type { NotificationSettings } from '../../utils/notificationUtils'

export interface NotificationSettingsCardProps {
	settings: NotificationSettings
	permission: NotificationPermission
	onToggleBrowser: (enabled: boolean) => void
	onToggleCategory: (category: keyof NotificationSettings['categories']) => void
	onRequestPermission: () => void
	onSaveQuietHours: (start: string, end: string) => void
}

export function NotificationSettingsCard({
	settings,
	permission,
	onToggleBrowser,
	onToggleCategory,
	onRequestPermission,
	onSaveQuietHours,
}: NotificationSettingsCardProps) {
	const [showQuietHours, setShowQuietHours] = React.useState(false)
	const [quietStart, setQuietStart] = React.useState(settings.quietHours?.start || '22:00')
	const [quietEnd, setQuietEnd] = React.useState(settings.quietHours?.end || '08:00')

	const categories = [
		{ key: 'taskAssigned' as const, label: 'Task Assigned', description: '새로운 작업이 할당되었을 때' },
		{ key: 'reviewReceived' as const, label: 'Review Received', description: '검토 결과를 받았을 때' },
		{ key: 'projectUpdate' as const, label: 'Project Update', description: '프로젝트 업데이트가 있을 때' },
		{ key: 'teamMessage' as const, label: 'Team Message', description: '팀 메시지를 받았을 때' },
		{ key: 'approvalRequest' as const, label: 'Approval Request', description: '승인 요청을 받았을 때' },
	]

	const handleSaveQuietHours = () => {
		onSaveQuietHours(quietStart, quietEnd)
		setShowQuietHours(false)
	}

	return (
		<Card className="bg-surface-dark border-border-dark">
			<CardContent className="p-6 space-y-6">
				{/* Header */}
				<div className="flex items-start justify-between">
					<div className="flex items-center gap-4">
						<div className="p-3 rounded-2xl bg-neutral-800 text-neutral-400">
							{settings.browser ? <Bell className="h-6 w-6" /> : <BellOff className="h-6 w-6" />}
						</div>
						<div>
							<h3 className="font-bold text-white">Browser Notifications</h3>
							<p className="text-sm text-neutral-400">Receive real-time updates</p>
						</div>
					</div>

					{permission === 'granted' ? (
						<label className="relative inline-flex items-center cursor-pointer">
							<input
								type="checkbox"
								className="sr-only peer"
								checked={settings.browser}
								onChange={(e) => onToggleBrowser(e.target.checked)}
							/>
							<div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
						</label>
					) : permission === 'denied' ? (
						<span className="text-xs text-red-400 px-3 py-1 bg-red-900/20 rounded-full">
							Permission Denied
						</span>
					) : (
						<Button size="sm" onClick={onRequestPermission}>
							Request Permission
						</Button>
					)}
				</div>

				{/* Categories */}
				{permission === 'granted' && settings.browser && (
					<>
						<div className="border-t border-border-dark pt-6 space-y-4">
							<h4 className="text-sm font-semibold text-neutral-300">Notification Categories</h4>
							<div className="space-y-3">
								{categories.map((category) => (
									<div
										key={category.key}
										className="flex items-center justify-between p-3 bg-neutral-900 rounded-lg"
									>
										<div>
											<p className="text-sm font-medium text-white">{category.label}</p>
											<p className="text-xs text-neutral-400">{category.description}</p>
										</div>
										<label className="relative inline-flex items-center cursor-pointer">
											<input
												type="checkbox"
												className="sr-only peer"
												checked={settings.categories[category.key]}
												onChange={() => onToggleCategory(category.key)}
											/>
											<div className="w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
										</label>
									</div>
								))}
							</div>
						</div>

						{/* Quiet Hours */}
						<div className="border-t border-border-dark pt-6 space-y-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Clock className="h-5 w-5 text-neutral-400" />
									<h4 className="text-sm font-semibold text-neutral-300">Quiet Hours</h4>
								</div>
								<Button
									size="sm"
									variant="outline"
									onClick={() => setShowQuietHours(!showQuietHours)}
								>
									{showQuietHours ? 'Cancel' : 'Set'}
								</Button>
							</div>

							{settings.quietHours && !showQuietHours && (
								<p className="text-sm text-neutral-400">
									No notifications from {settings.quietHours.start} to {settings.quietHours.end}
								</p>
							)}

							{showQuietHours && (
								<div className="space-y-3">
									<div className="grid grid-cols-2 gap-4">
										<div>
											<label className="block text-xs text-neutral-400 mb-2">Start Time</label>
											<input
												type="time"
												value={quietStart}
												onChange={(e) => setQuietStart(e.target.value)}
												className="w-full px-3 py-2 bg-neutral-900 border border-border-dark rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
											/>
										</div>
										<div>
											<label className="block text-xs text-neutral-400 mb-2">End Time</label>
											<input
												type="time"
												value={quietEnd}
												onChange={(e) => setQuietEnd(e.target.value)}
												className="w-full px-3 py-2 bg-neutral-900 border border-border-dark rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
											/>
										</div>
									</div>
									<Button size="sm" onClick={handleSaveQuietHours} className="w-full">
										Save Quiet Hours
									</Button>
								</div>
							)}
						</div>
					</>
				)}
			</CardContent>
		</Card>
	)
}

