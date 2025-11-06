import { useState } from 'react'
import { Card, CardContent, CardHeader } from '../../../../components/ui/Card'
import { Button } from '../../../../components/ui/Button'
import Input from '../../../../components/ui/Input'
import { X, Plus, Clock, Calendar, Brain } from 'lucide-react'

interface WorkplaceSettings {
	// Locale
	language: 'en' | 'ko'
	timezone: string
	workingDays: number[]
	workingHours: {
		start: string
		end: string
	}
	holidays: Array<{ name: string; date: string }>
	quietHours?: {
		start: string
		end: string
	}
	
	// Decision Defaults
	decisionMode: 'hybrid' | 'ai' | 'human'
	requireEvidence: boolean
	showConfidence: boolean
	autoApproveLowRisk: boolean
	escalationWindow: '4h' | '8h' | '24h'
}

interface WorkplaceTabProps {
	settings: WorkplaceSettings
	onChange: (settings: WorkplaceSettings) => void
	onSave: () => void
}

export default function WorkplaceTab({ settings, onChange, onSave }: WorkplaceTabProps) {
	const [newHoliday, setNewHoliday] = useState({ name: '', date: '' })

	const toggleDay = (day: number) => {
		const current = settings.workingDays
		const next = current.includes(day) ? current.filter((d) => d !== day) : [...current, day]
		onChange({ ...settings, workingDays: next })
	}

	const addHoliday = () => {
		if (!newHoliday.name.trim() || !newHoliday.date) return
		onChange({
			...settings,
			holidays: [...settings.holidays, { ...newHoliday }],
		})
		setNewHoliday({ name: '', date: '' })
	}

	const removeHoliday = (index: number) => {
		onChange({
			...settings,
			holidays: settings.holidays.filter((_, i) => i !== index),
		})
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
							<p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
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
									className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900"
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
									className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900"
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
												: 'border border-neutral-200 dark:border-neutral-800 hover:border-primary'
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

			{/* Company Holidays */}
			<Card>
				<CardHeader>
					<h3 className="text-lg font-bold flex items-center gap-2">
						<Calendar className="h-5 w-5 text-primary" />
						Company Holidays
					</h3>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{/* Holidays List */}
						{settings.holidays.length > 0 && (
							<div className="space-y-2 mb-4">
								{settings.holidays.map((holiday, index) => (
									<div
										key={index}
										className="flex items-center justify-between p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-primary/30 transition-colors"
									>
										<div>
											<span className="font-medium">{holiday.name}</span>
											<span className="ml-3 text-sm text-neutral-600 dark:text-neutral-400">
												{holiday.date}
											</span>
										</div>
										<Button
											variant="outline"
											size="sm"
											onClick={() => removeHoliday(index)}
											className="px-2"
										>
											<X className="h-4 w-4" />
										</Button>
									</div>
								))}
							</div>
						)}

						{/* Add Holiday Form */}
						<div className="grid grid-cols-1 md:grid-cols-[1fr,auto,auto] gap-3">
							<Input
								value={newHoliday.name}
								onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
								placeholder="Holiday Name (e.g., New Year's Day)"
							/>
							<Input
								type="date"
								value={newHoliday.date}
								onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
								className="md:w-48"
							/>
							<Button onClick={addHoliday} className="flex items-center gap-2">
								<Plus className="h-4 w-4" />
								Add
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Decision-Making Defaults */}
			<Card>
				<CardHeader>
					<div>
						<h2 className="text-xl font-bold flex items-center gap-2">
							<Brain className="h-5 w-5 text-primary" />
							Decision-Making Defaults
						</h2>
						<p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
							Configure default settings for AI-powered decision support
						</p>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-6">
						{/* Decision Mode */}
						<div>
							<label className="block text-sm font-medium mb-3">Decision Mode</label>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
								{[
									{ value: 'hybrid', label: 'Hybrid (AI + Human)', description: 'AI suggests, human decides' },
									{ value: 'ai', label: 'AI-Driven', description: 'AI makes decisions with oversight' },
									{ value: 'human', label: 'Human-Only', description: 'Manual decision-making only' },
								].map((mode) => (
									<button
										key={mode.value}
										type="button"
										onClick={() => onChange({ ...settings, decisionMode: mode.value as any })}
										className={`p-4 rounded-xl border-2 text-left transition ${
											settings.decisionMode === mode.value
												? 'border-primary bg-primary/5'
												: 'border-neutral-200 dark:border-neutral-800 hover:border-primary/50'
										}`}
									>
										<div className="font-semibold text-sm mb-1">{mode.label}</div>
										<div className="text-xs text-neutral-600 dark:text-neutral-400">
											{mode.description}
										</div>
									</button>
								))}
							</div>
						</div>

						{/* Options */}
						<div className="space-y-3">
							<label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900 transition">
								<input
									type="checkbox"
									checked={settings.requireEvidence}
									onChange={(e) => onChange({ ...settings, requireEvidence: e.target.checked })}
									className="h-5 w-5 rounded border-neutral-300 text-primary focus:ring-2 focus:ring-primary/20"
								/>
								<div>
									<span className="text-sm font-medium block">Require Evidence</span>
									<span className="text-xs text-neutral-600 dark:text-neutral-400">
										Decisions must be backed by supporting data
									</span>
								</div>
							</label>

							<label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900 transition">
								<input
									type="checkbox"
									checked={settings.showConfidence}
									onChange={(e) => onChange({ ...settings, showConfidence: e.target.checked })}
									className="h-5 w-5 rounded border-neutral-300 text-primary focus:ring-2 focus:ring-primary/20"
								/>
								<div>
									<span className="text-sm font-medium block">Show AI Confidence Scores</span>
									<span className="text-xs text-neutral-600 dark:text-neutral-400">
										Display confidence levels for AI recommendations
									</span>
								</div>
							</label>

							<label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900 transition">
								<input
									type="checkbox"
									checked={settings.autoApproveLowRisk}
									onChange={(e) => onChange({ ...settings, autoApproveLowRisk: e.target.checked })}
									className="h-5 w-5 rounded border-neutral-300 text-primary focus:ring-2 focus:ring-primary/20"
								/>
								<div>
									<span className="text-sm font-medium block">Auto-Approve Low Risk</span>
									<span className="text-xs text-neutral-600 dark:text-neutral-400">
										Automatically approve decisions with low risk scores
									</span>
								</div>
							</label>
						</div>

						{/* Escalation Window */}
						<div>
							<label className="block text-sm font-medium mb-2">Escalation Window</label>
							<select
								value={settings.escalationWindow}
								onChange={(e) => onChange({ ...settings, escalationWindow: e.target.value as any })}
								className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900"
							>
								<option value="4h">4 Hours</option>
								<option value="8h">8 Hours</option>
								<option value="24h">24 Hours</option>
							</select>
							<p className="text-xs text-neutral-500 mt-2">
								💡 Time window for decisions to be escalated to higher authority
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

