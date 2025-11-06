import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Calendar, ChevronLeft, ChevronRight, Users, Clock } from 'lucide-react'
import type { Project } from '../_types/projects.types'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, isWithinInterval, differenceInDays } from 'date-fns'

interface TimelineViewProps {
	projects: Project[]
	onProjectClick?: (project: Project) => void
}

export default function TimelineView({ projects, onProjectClick }: TimelineViewProps) {
	const [currentMonth, setCurrentMonth] = useState(new Date())
	const [viewMode, setViewMode] = useState<'month' | 'quarter' | 'year'>('quarter')

	// Calculate date range based on view mode
	const dateRange = useMemo(() => {
		const start = startOfMonth(viewMode === 'month' ? currentMonth : subMonths(currentMonth, viewMode === 'quarter' ? 1 : 5))
		const end = endOfMonth(viewMode === 'month' ? currentMonth : addMonths(currentMonth, viewMode === 'quarter' ? 1 : 5))
		return { start, end }
	}, [currentMonth, viewMode])

	// Filter projects that are within the date range
	const visibleProjects = useMemo(() => {
		return projects.filter(project => {
			const projectStart = new Date(project.startDate)
			const projectEnd = new Date(project.endDate)
			return (
				isWithinInterval(projectStart, dateRange) ||
				isWithinInterval(projectEnd, dateRange) ||
				(projectStart <= dateRange.start && projectEnd >= dateRange.end)
			)
		})
	}, [projects, dateRange])

	// Calculate project position and width
	const getProjectBar = (project: Project) => {
		const projectStart = new Date(project.startDate)
		const projectEnd = new Date(project.endDate)
		
		// Clamp to visible range
		const visibleStart = projectStart < dateRange.start ? dateRange.start : projectStart
		const visibleEnd = projectEnd > dateRange.end ? dateRange.end : projectEnd
		
		const totalDays = differenceInDays(dateRange.end, dateRange.start)
		const startOffset = differenceInDays(visibleStart, dateRange.start)
		const duration = differenceInDays(visibleEnd, visibleStart)
		
		const leftPercent = (startOffset / totalDays) * 100
		const widthPercent = (duration / totalDays) * 100
		
		return { leftPercent, widthPercent, isStartClipped: projectStart < dateRange.start, isEndClipped: projectEnd > dateRange.end }
	}

	// Status color mapping
	const getStatusColor = (status: string) => {
		switch (status) {
			case 'completed': return 'bg-green-500'
			case 'active': return 'bg-blue-500'
			case 'planning': return 'bg-yellow-500'
			case 'on-hold': return 'bg-gray-500'
			default: return 'bg-neutral-500'
		}
	}

	const handlePreviousPeriod = () => {
		const months = viewMode === 'month' ? 1 : viewMode === 'quarter' ? 3 : 12
		setCurrentMonth(prev => subMonths(prev, months))
	}

	const handleNextPeriod = () => {
		const months = viewMode === 'month' ? 1 : viewMode === 'quarter' ? 3 : 12
		setCurrentMonth(prev => addMonths(prev, months))
	}

	const handleToday = () => {
		setCurrentMonth(new Date())
	}

	return (
		<div className="space-y-4">
			{/* Controls */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<h3 className="text-lg font-bold flex items-center gap-2">
								<Calendar className="h-5 w-5 text-primary" />
								Project Timeline
							</h3>
							<div className="flex items-center gap-2">
								<Button
									onClick={handlePreviousPeriod}
									variant="outline"
									size="sm"
									className="h-8 w-8 p-0"
								>
									<ChevronLeft className="h-4 w-4" />
								</Button>
								<Button
									onClick={handleToday}
									variant="outline"
									size="sm"
								>
									Today
								</Button>
								<Button
									onClick={handleNextPeriod}
									variant="outline"
									size="sm"
									className="h-8 w-8 p-0"
								>
									<ChevronRight className="h-4 w-4" />
								</Button>
								<span className="text-sm font-medium ml-2">
									{format(dateRange.start, 'MMM yyyy')} - {format(dateRange.end, 'MMM yyyy')}
								</span>
							</div>
						</div>
						<div className="flex items-center gap-2">
						<Button
							onClick={() => setViewMode('month')}
							variant={viewMode === 'month' ? 'primary' : 'outline'}
							size="sm"
						>
							Month
						</Button>
						<Button
							onClick={() => setViewMode('quarter')}
							variant={viewMode === 'quarter' ? 'primary' : 'outline'}
							size="sm"
						>
							Quarter
						</Button>
						<Button
							onClick={() => setViewMode('year')}
							variant={viewMode === 'year' ? 'primary' : 'outline'}
							size="sm"
						>
							Year
						</Button>
						</div>
					</div>
				</CardHeader>
			</Card>

			{/* Timeline */}
			<Card>
				<CardContent className="p-6">
					{visibleProjects.length === 0 ? (
						<div className="text-center py-12 text-neutral-500">
							No projects in this time range
						</div>
					) : (
						<div className="space-y-6">
							{/* Header - Month labels */}
							<div className="relative h-8 border-b border-neutral-200 dark:border-neutral-800">
								<div className="absolute inset-0 flex">
									{Array.from({ length: viewMode === 'month' ? 1 : viewMode === 'quarter' ? 3 : 12 }).map((_, idx) => {
										const monthDate = addMonths(startOfMonth(viewMode === 'month' ? currentMonth : subMonths(currentMonth, viewMode === 'quarter' ? 1 : 5)), idx)
										return (
											<div
												key={idx}
												className="flex-1 text-xs font-medium text-neutral-600 dark:text-neutral-400 text-center border-r border-neutral-200 dark:border-neutral-800 last:border-r-0"
											>
												{format(monthDate, 'MMM yyyy')}
											</div>
										)
									})}
								</div>
							</div>

							{/* Today marker */}
							{isWithinInterval(new Date(), dateRange) && (
								<div
									className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 pointer-events-none"
									style={{
										left: `${(differenceInDays(new Date(), dateRange.start) / differenceInDays(dateRange.end, dateRange.start)) * 100}%`
									}}
								>
									<div className="absolute -top-2 -left-8 text-xs font-medium text-red-500">
										Today
									</div>
								</div>
							)}

							{/* Projects */}
							<div className="space-y-3 relative">
								{visibleProjects.map((project) => {
									const { leftPercent, widthPercent, isStartClipped, isEndClipped } = getProjectBar(project)
									return (
										<div key={project.id} className="relative">
											<div className="flex items-start gap-3">
												{/* Project info */}
												<div className="w-48 flex-shrink-0">
													<div className="space-y-1">
														<h4 className="font-medium text-sm truncate" title={project.name}>
															{project.name}
														</h4>
														<div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
															<span className={`px-2 py-0.5 rounded-full text-white ${getStatusColor(project.status)}`}>
																{project.status}
															</span>
															<span className="flex items-center gap-1">
																<Clock className="h-3 w-3" />
																{project.progress}%
															</span>
														</div>
													</div>
												</div>

												{/* Timeline bar */}
												<div className="flex-1 relative h-12">
													<div
														className={`absolute h-8 rounded-lg ${getStatusColor(project.status)} opacity-80 hover:opacity-100 transition-opacity cursor-pointer group`}
														style={{
															left: `${leftPercent}%`,
															width: `${widthPercent}%`,
														}}
														onClick={() => onProjectClick?.(project)}
													>
														{isStartClipped && (
															<div className="absolute left-0 top-0 bottom-0 w-1 bg-white opacity-50" />
														)}
														{isEndClipped && (
															<div className="absolute right-0 top-0 bottom-0 w-1 bg-white opacity-50" />
														)}
														
														{/* Progress bar */}
														<div
															className="absolute inset-y-0 left-0 bg-white opacity-30 rounded-lg"
															style={{ width: `${project.progress}%` }}
														/>
														
														{/* Hover info */}
														<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
															<div className="bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
																{format(new Date(project.startDate), 'MMM d')} - {format(new Date(project.endDate), 'MMM d, yyyy')}
															</div>
														</div>
													</div>

													{/* Milestones */}
													{project.schedule?.milestones && project.schedule.milestones.map((milestone) => {
														const milestoneDate = new Date(milestone.plannedDate)
														if (!isWithinInterval(milestoneDate, dateRange)) return null
														
														const milestoneOffset = differenceInDays(milestoneDate, dateRange.start)
														const totalDays = differenceInDays(dateRange.end, dateRange.start)
														const milestoneLeftPercent = (milestoneOffset / totalDays) * 100
														
														return (
															<div
																key={milestone.id}
																className="absolute top-0 w-0.5 h-12 bg-orange-500 z-20 group/milestone"
																style={{ left: `${milestoneLeftPercent}%` }}
															>
																<div className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-orange-500 border-2 border-white dark:border-neutral-900" />
																<div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 opacity-0 group-hover/milestone:opacity-100 transition-opacity pointer-events-none">
																	<div className="bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
																		{milestone.name}
																	</div>
																</div>
															</div>
														)
													})}
												</div>

												{/* Team size */}
												<div className="w-20 flex-shrink-0 text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
													<Users className="h-3 w-3" />
													{project.members.length}
												</div>
											</div>
										</div>
									)
								})}
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Legend */}
			<Card>
				<CardContent className="p-4">
					<div className="flex items-center gap-6 text-xs">
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 rounded bg-blue-500" />
							<span>Active</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 rounded bg-green-500" />
							<span>Completed</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 rounded bg-yellow-500" />
							<span>Planning</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 rounded bg-gray-500" />
							<span>On Hold</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 rounded-full bg-orange-500" />
							<span>Milestone</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-0.5 h-4 bg-red-500" />
							<span>Today</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

