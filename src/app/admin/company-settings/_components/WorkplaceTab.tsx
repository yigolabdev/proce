import { Card, CardContent, CardHeader } from '../../../../components/ui/Card'
import { Button } from '../../../../components/ui/Button'
import Input from '../../../../components/ui/Input'
import { Clock } from 'lucide-react'

interface WorkplaceSettings {
	// Locale
	language: 'en' | 'ko'
	timezone: string
	workingDays: number[]
	workingHours: {
		start: string
		end: string
	}
	quietHours?: {
		start: string
		end: string
	}
}

interface WorkplaceTabProps {
	settings: WorkplaceSettings
	onChange: (settings: WorkplaceSettings) => void
	onSave: () => void
}

export default function WorkplaceTab({ settings, onChange, onSave }: WorkplaceTabProps) {
	const toggleDay = (day: number) => {
		const current = settings.workingDays
		const next = current.includes(day) ? current.filter((d) => d !== day) : [...current, day]
		onChange({ ...settings, workingDays: next })
	}

	const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

	return (
		<div className="space-y-6">
			{/* Working Hours Section */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-xl font-bold flex items-center gap-2">
								<Clock className="h-5 w-5 text-primary" />
								Working Hours & Schedule
							</h2>
							<p className="text-sm text-neutral-400 mt-1">
								Configure working days, hours, and company holidays
							</p>
						</div>
						<Button onClick={onSave} className="flex items-center gap-2">
							<Clock className="h-4 w-4" />
							Save
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-6">
						{/* Language & Timezone */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium mb-2">Language</label>
								<select
									value={settings.language}
									onChange={(e) => onChange({ ...settings, language: e.target.value as 'en' | 'ko' })}
									className="w-full px-4 py-2 border border-neutral-700 rounded-xl bg-neutral-900"
								>
									<option value="ko">한국어 (Korean)</option>
									<option value="en">English</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium mb-2">Timezone</label>
								<select
									value={settings.timezone}
									onChange={(e) => onChange({ ...settings, timezone: e.target.value })}
									className="w-full px-4 py-2 border border-neutral-700 rounded-xl bg-neutral-900"
								>
									<option value="Asia/Seoul">Asia/Seoul (KST)</option>
									<option value="America/New_York">America/New_York (EST)</option>
									<option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
									<option value="Europe/London">Europe/London (GMT)</option>
									<option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
								</select>
							</div>
						</div>

						{/* Working Days */}
						<div>
							<label className="block text-sm font-medium mb-3">Working Days</label>
							<div className="flex flex-wrap gap-2">
								{[1, 2, 3, 4, 5, 6, 0].map((day, index) => (
									<button
										key={day}
										type="button"
										onClick={() => toggleDay(day)}
										className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
											settings.workingDays.includes(day)
												? 'bg-primary text-white'
												: 'border border-neutral-800 hover:border-primary'
										}`}
									>
										{dayNames[index]}
									</button>
								))}
							</div>
						</div>

						{/* Working Hours */}
						<div>
							<label className="block text-sm font-medium mb-3">Working Hours</label>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-xs text-neutral-500 mb-1">Start Time</label>
									<Input
										type="time"
										value={settings.workingHours.start}
										onChange={(e) =>
											onChange({
												...settings,
												workingHours: { ...settings.workingHours, start: e.target.value },
											})
										}
									/>
								</div>
								<div>
									<label className="block text-xs text-neutral-500 mb-1">End Time</label>
									<Input
										type="time"
										value={settings.workingHours.end}
										onChange={(e) =>
											onChange({
												...settings,
												workingHours: { ...settings.workingHours, end: e.target.value },
											})
										}
									/>
								</div>
							</div>
						</div>

						{/* Quiet Hours (Optional) */}
						<div>
							<label className="block text-sm font-medium mb-3">
								Quiet Hours <span className="text-xs text-neutral-500">(Optional)</span>
							</label>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-xs text-neutral-500 mb-1">Start Time</label>
									<Input
										type="time"
										value={settings.quietHours?.start || ''}
										onChange={(e) =>
											onChange({
												...settings,
												quietHours: { ...settings.quietHours, start: e.target.value, end: settings.quietHours?.end || '' },
											})
										}
									/>
								</div>
								<div>
									<label className="block text-xs text-neutral-500 mb-1">End Time</label>
									<Input
										type="time"
										value={settings.quietHours?.end || ''}
										onChange={(e) =>
											onChange({
												...settings,
												quietHours: { start: settings.quietHours?.start || '', end: e.target.value },
											})
										}
									/>
								</div>
							</div>
							<p className="text-xs text-neutral-500 mt-2">
								💡 Notifications will be muted during quiet hours
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

