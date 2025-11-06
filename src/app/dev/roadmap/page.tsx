import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import {
	Rocket,
	CheckCircle2,
	Circle,
	Clock,
	Target,
	TrendingUp,
	AlertCircle,
	ChevronDown,
	ChevronUp,
	Calendar,
	Zap,
} from 'lucide-react'
import { roadmapPhases, getPhaseStats, getRoadmapStats } from './_data/roadmapData'
import type { Feature, Phase } from './_data/roadmapData'

export default function DevelopmentRoadmapPage() {
	const [activePhase, setActivePhase] = useState('phase-4a')
	const [expandedFeatures, setExpandedFeatures] = useState<string[]>([])
	const [featureStatuses, setFeatureStatuses] = useState<Record<string, Feature['status']>>({})

	// Load feature statuses from localStorage
	useEffect(() => {
		try {
			const saved = localStorage.getItem('roadmap-feature-statuses')
			if (saved) {
				setFeatureStatuses(JSON.parse(saved))
			}
		} catch (error) {
			console.error('Failed to load feature statuses:', error)
		}
	}, [])

	// Save feature statuses to localStorage
	const updateFeatureStatus = (featureId: string, status: Feature['status']) => {
		const newStatuses = { ...featureStatuses, [featureId]: status }
		setFeatureStatuses(newStatuses)
		try {
			localStorage.setItem('roadmap-feature-statuses', JSON.stringify(newStatuses))
		} catch (error) {
			console.error('Failed to save feature status:', error)
		}
	}

	const toggleFeatureExpansion = (featureId: string) => {
		setExpandedFeatures((prev) =>
			prev.includes(featureId) ? prev.filter((id) => id !== featureId) : [...prev, featureId]
		)
	}

	const currentPhase = roadmapPhases.find((p) => p.id === activePhase)
	const overallStats = getRoadmapStats()

	const getStatusColor = (status: Feature['status']) => {
		switch (status) {
			case 'completed':
				return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
			case 'in-progress':
				return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
			default:
				return 'text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800/50'
		}
	}

	const getStatusIcon = (status: Feature['status']) => {
		switch (status) {
			case 'completed':
				return <CheckCircle2 className="h-5 w-5 text-green-600" />
			case 'in-progress':
				return <Clock className="h-5 w-5 text-blue-600" />
			default:
				return <Circle className="h-5 w-5 text-neutral-400" />
		}
	}

	const getPriorityBadge = (priority: Feature['priority']) => {
		const colors = {
			critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
			high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
			medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
			low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
		}
		return (
			<span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[priority]}`}>
				{priority.toUpperCase()}
			</span>
		)
	}

	const getImpactIcon = (impact: Feature['impact']) => {
		if (impact === 'high') return '🔥🔥🔥'
		if (impact === 'medium') return '🔥🔥'
		return '🔥'
	}

	const getEffortIcon = (effort: Feature['effort']) => {
		if (effort === 'hard') return '💪💪💪'
		if (effort === 'medium') return '💪💪'
		return '💪'
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold flex items-center gap-3">
						<Rocket className="h-8 w-8 text-primary" />
						Development Roadmap
					</h1>
					<p className="mt-2 text-neutral-600 dark:text-neutral-400">
						AI-Powered Performance Management System - Full Feature Implementation Plan
					</p>
					<div className="mt-2 flex items-center gap-2 text-sm">
						<span className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-full font-medium">
							⚠️ DEVELOPMENT ONLY
						</span>
						<span className="text-neutral-500">This page is not visible in production</span>
					</div>
				</div>
			</div>

			{/* Overall Progress */}
			<Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
				<CardContent className="p-6">
					<div className="flex items-center justify-between mb-4">
						<div>
							<h3 className="text-lg font-bold">Overall Progress</h3>
							<p className="text-sm text-neutral-600 dark:text-neutral-400">
								{overallStats.completed} of {overallStats.total} features completed
							</p>
						</div>
						<div className="text-right">
							<div className="text-3xl font-bold text-primary">{overallStats.completionRate}%</div>
							<p className="text-sm text-neutral-600 dark:text-neutral-400">
								{overallStats.remainingDays} days remaining
							</p>
						</div>
					</div>
					<div className="relative w-full h-4 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
						<div
							className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
							style={{ width: `${overallStats.completionRate}%` }}
						/>
					</div>
					<div className="mt-4 grid grid-cols-4 gap-4">
						<div className="text-center">
							<div className="text-2xl font-bold text-green-600">{overallStats.completed}</div>
							<div className="text-xs text-neutral-600 dark:text-neutral-400">Completed</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-blue-600">{overallStats.inProgress}</div>
							<div className="text-xs text-neutral-600 dark:text-neutral-400">In Progress</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-neutral-600">{overallStats.notStarted}</div>
							<div className="text-xs text-neutral-600 dark:text-neutral-400">Not Started</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-primary">{overallStats.totalDays}</div>
							<div className="text-xs text-neutral-600 dark:text-neutral-400">Total Days</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Phase Tabs */}
			<div className="flex flex-wrap gap-2">
				{roadmapPhases.map((phase) => {
					const stats = getPhaseStats(phase)
					const isActive = activePhase === phase.id
					return (
						<button
							key={phase.id}
							onClick={() => setActivePhase(phase.id)}
							className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
								isActive
									? 'bg-primary text-white shadow-lg'
									: 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'
							}`}
						>
							<div className="flex items-center gap-2">
								<span>{phase.title}</span>
								<span
									className={`px-2 py-0.5 rounded-full text-xs ${
										isActive ? 'bg-white/20' : 'bg-primary/10 text-primary'
									}`}
								>
									{stats.completionRate}%
								</span>
							</div>
						</button>
					)
				})}
			</div>

			{/* Current Phase Details */}
			{currentPhase && (
				<Card>
					<CardHeader>
						<div className="flex items-start justify-between">
							<div className="flex-1">
								<h2 className="text-2xl font-bold">{currentPhase.title}</h2>
								<p className="text-neutral-600 dark:text-neutral-400 mt-1">{currentPhase.description}</p>
								<div className="flex items-center gap-4 mt-2">
									<div className="flex items-center gap-2 text-sm">
										<Calendar className="h-4 w-4 text-neutral-500" />
										<span className="text-neutral-600 dark:text-neutral-400">
											Duration: {currentPhase.duration}
										</span>
									</div>
									<div className="flex items-center gap-2 text-sm">
										<Target className="h-4 w-4 text-neutral-500" />
										<span className="text-neutral-600 dark:text-neutral-400">
											{currentPhase.features.length} features
										</span>
									</div>
								</div>
							</div>
							<div className="text-right">
								{(() => {
									const stats = getPhaseStats(currentPhase)
									return (
										<div>
											<div className="text-3xl font-bold text-primary">{stats.completionRate}%</div>
											<div className="text-sm text-neutral-600 dark:text-neutral-400">
												{stats.completed}/{stats.total} completed
											</div>
										</div>
									)
								})()}
							</div>
						</div>
					</CardHeader>
					<CardContent className="p-6 space-y-4">
						{currentPhase.features.map((feature) => {
							const isExpanded = expandedFeatures.includes(feature.id)
							const currentStatus = featureStatuses[feature.id] || feature.status

							return (
								<Card
									key={feature.id}
									className={`border-2 transition-all ${
										currentStatus === 'completed'
											? 'border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-900/10'
											: currentStatus === 'in-progress'
												? 'border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-900/10'
												: 'border-neutral-200 dark:border-neutral-800'
									}`}
								>
									<CardContent className="p-4">
										{/* Feature Header */}
										<div className="flex items-start gap-4">
											{/* Status Checkbox */}
											<div className="flex flex-col gap-2 pt-1">
												{getStatusIcon(currentStatus)}
												<select
													value={currentStatus}
													onChange={(e) =>
														updateFeatureStatus(
															feature.id,
															e.target.value as Feature['status']
														)
													}
													className="text-xs px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
												>
													<option value="not-started">Not Started</option>
													<option value="in-progress">In Progress</option>
													<option value="completed">Completed</option>
												</select>
											</div>

											{/* Feature Info */}
											<div className="flex-1">
												<div className="flex items-start justify-between gap-4">
													<div className="flex-1">
														<h3 className="text-lg font-bold flex items-center gap-2">
															{feature.title}
														</h3>
														<p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
															{feature.description}
														</p>
													</div>
													<button
														onClick={() => toggleFeatureExpansion(feature.id)}
														className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
													>
														{isExpanded ? (
															<ChevronUp className="h-5 w-5" />
														) : (
															<ChevronDown className="h-5 w-5" />
														)}
													</button>
												</div>

												{/* Badges */}
												<div className="flex flex-wrap items-center gap-2 mt-3">
													{getPriorityBadge(feature.priority)}
													<span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
														{getImpactIcon(feature.impact)} Impact: {feature.impact}
													</span>
													<span className="px-2 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300">
														{getEffortIcon(feature.effort)} Effort: {feature.effort}
													</span>
													<span className="px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 flex items-center gap-1">
														<Clock className="h-3 w-3" />
														{feature.estimatedDays} days
													</span>
												</div>

												{/* Expanded Details */}
												{isExpanded && (
													<div className="mt-4 space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
														{/* Dependencies */}
														{feature.dependencies && feature.dependencies.length > 0 && (
															<div>
																<h4 className="text-sm font-bold flex items-center gap-2 mb-2">
																	<AlertCircle className="h-4 w-4 text-orange-600" />
																	Dependencies
																</h4>
																<div className="flex flex-wrap gap-2">
																	{feature.dependencies.map((depId) => {
																		const dep = roadmapPhases
																			.flatMap((p) => p.features)
																			.find((f) => f.id === depId)
																		return dep ? (
																			<span
																				key={depId}
																				className="px-2 py-1 rounded text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
																			>
																				{dep.title}
																			</span>
																		) : null
																	})}
																</div>
															</div>
														)}

														{/* Technical Notes */}
														{feature.technicalNotes && feature.technicalNotes.length > 0 && (
															<div>
																<h4 className="text-sm font-bold flex items-center gap-2 mb-2">
																	<Zap className="h-4 w-4 text-blue-600" />
																	Technical Implementation
																</h4>
																<ul className="space-y-1">
																	{feature.technicalNotes.map((note, idx) => (
																		<li
																			key={idx}
																			className="text-sm text-neutral-600 dark:text-neutral-400 flex items-start gap-2"
																		>
																			<span className="text-primary">•</span>
																			<span>{note}</span>
																		</li>
																	))}
																</ul>
															</div>
														)}

														{/* Business Value */}
														{feature.businessValue && feature.businessValue.length > 0 && (
															<div>
																<h4 className="text-sm font-bold flex items-center gap-2 mb-2">
																	<TrendingUp className="h-4 w-4 text-green-600" />
																	Business Value
																</h4>
																<ul className="space-y-1">
																	{feature.businessValue.map((value, idx) => (
																		<li
																			key={idx}
																			className="text-sm text-neutral-600 dark:text-neutral-400 flex items-start gap-2"
																		>
																			<span className="text-green-600">✓</span>
																			<span>{value}</span>
																		</li>
																	))}
																</ul>
															</div>
														)}
													</div>
												)}
											</div>
										</div>
									</CardContent>
								</Card>
							)
						})}
					</CardContent>
				</Card>
			)}

			{/* Quick Actions */}
			<Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
				<CardContent className="p-6">
					<h3 className="font-bold mb-4">Quick Actions</h3>
					<div className="flex flex-wrap gap-3">
						<Button
							variant="outline"
							onClick={() => {
								const confirmReset = window.confirm(
									'Are you sure you want to reset all feature statuses?'
								)
								if (confirmReset) {
									setFeatureStatuses({})
									localStorage.removeItem('roadmap-feature-statuses')
								}
							}}
						>
							Reset All Statuses
						</Button>
						<Button
							variant="outline"
							onClick={() => {
								const data = {
									exportDate: new Date().toISOString(),
									roadmap: roadmapPhases,
									statuses: featureStatuses,
									stats: getRoadmapStats(),
								}
								const blob = new Blob([JSON.stringify(data, null, 2)], {
									type: 'application/json',
								})
								const url = URL.createObjectURL(blob)
								const a = document.createElement('a')
								a.href = url
								a.download = `roadmap-export-${new Date().toISOString().split('T')[0]}.json`
								a.click()
							}}
						>
							Export Roadmap
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

