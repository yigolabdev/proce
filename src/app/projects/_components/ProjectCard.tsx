/**
 * ProjectCard Component
 * 
 * 개별 프로젝트 카드 컴포넌트
 * 재사용성과 유지보수성 향상
 */

import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardContent } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import {
	Calendar,
	Users,
	Target,
	ArrowRight,
	CheckCircle2,
	AlertCircle,
	Clock,
	Building2,
	FileText,
	User as UserIcon,
} from 'lucide-react'
import type { Project } from '../../../types/common.types'
import { toDate } from '../../../utils/dateUtils'

interface LatestWorkEntry {
	title: string
	submittedBy?: string
	date: Date | string
}

interface ProjectCardProps {
	project: Project
	workEntriesCount?: number
	latestWorkEntry?: LatestWorkEntry
}

export default function ProjectCard({ project, workEntriesCount = 0, latestWorkEntry }: ProjectCardProps) {
	const navigate = useNavigate()

	const formatTimeAgo = (date: Date | string) => {
		const d = toDate(date)
		if (!d) return 'Unknown'
		const seconds = Math.floor((new Date().getTime() - d.getTime()) / 1000)
		
		if (seconds < 60) return 'Just now'
		if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
		if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
		if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
		return d.toLocaleDateString()
	}

	const getStatusBadge = (status: string) => {
		const statusConfig = {
			completed: {
				icon: CheckCircle2,
				className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
				label: 'Completed',
			},
			active: {
				icon: Clock,
				className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
				label: 'Active',
			},
			planning: {
				icon: AlertCircle,
				className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
				label: 'Planning',
			},
			'on-hold': {
				icon: AlertCircle,
				className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
				label: 'On Hold',
			},
			cancelled: {
				icon: AlertCircle,
				className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
				label: 'Cancelled',
			},
		}

		const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.planning
		const Icon = config.icon

		return (
			<div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.className}`}>
				<Icon className="h-3 w-3" />
				{config.label}
			</div>
		)
	}

	const formatDate = (date: Date | string) => {
		const d = typeof date === 'string' ? new Date(date) : date
		return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
	}

	const getDepartmentsList = () => {
		if (!project.departments || project.departments.length === 0) return null
		
		return (
			<div className="flex flex-wrap gap-1.5">
				{project.departments.map((dept: string, idx: number) => (
					<div
						key={idx}
						className="inline-flex items-center gap-1.5 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg text-xs"
					>
						<Building2 className="h-3 w-3" />
						{dept}
					</div>
				))}
			</div>
		)
	}

	return (
		<Card className="hover:shadow-lg transition-shadow cursor-pointer group">
			<CardHeader>
				<div className="flex items-start justify-between gap-3">
					<div className="flex-1 min-w-0">
						<h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors truncate">
							{project.name}
						</h3>
						{project.description && (
							<p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
								{project.description}
							</p>
						)}
					</div>
					{getStatusBadge(project.status)}
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{/* Progress Bar */}
					<div>
						<div className="flex items-center justify-between text-sm mb-2">
							<span className="text-neutral-600 dark:text-neutral-400">Progress</span>
							<span className="font-semibold">{project.progress}%</span>
						</div>
						<div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2">
							<div
								className="bg-primary h-2 rounded-full transition-all duration-300"
								style={{ width: `${project.progress}%` }}
							/>
						</div>
					</div>

					{/* Info Grid */}
					<div className="grid grid-cols-2 gap-3 text-sm">
						{/* Start Date */}
						<div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
							<Calendar className="h-4 w-4 shrink-0" />
							<div>
								<p className="text-xs text-neutral-500 dark:text-neutral-500">Start</p>
								<p className="font-medium text-neutral-900 dark:text-neutral-100">
									{formatDate(project.startDate)}
								</p>
							</div>
						</div>

						{/* End Date */}
						<div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
							<Calendar className="h-4 w-4 shrink-0" />
							<div>
								<p className="text-xs text-neutral-500 dark:text-neutral-500">End</p>
								<p className="font-medium text-neutral-900 dark:text-neutral-100">
									{formatDate(project.endDate)}
								</p>
							</div>
						</div>
					</div>

					{/* Departments */}
					{getDepartmentsList() && (
						<div className="flex flex-wrap gap-2">
							{getDepartmentsList()}
						</div>
					)}

					{/* Latest Work Entry */}
					{latestWorkEntry && (
						<div className="p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg">
							<div className="flex items-start gap-2">
								<FileText className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
								<div className="flex-1 min-w-0">
									<p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-0.5">Latest Update</p>
									<p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
										{latestWorkEntry.title}
									</p>
									<div className="flex items-center gap-2 mt-1 text-xs text-neutral-600 dark:text-neutral-400">
										{latestWorkEntry.submittedBy && (
											<span className="flex items-center gap-1">
												<UserIcon className="h-3 w-3" />
												{latestWorkEntry.submittedBy}
											</span>
										)}
										<span className="flex items-center gap-1">
											<Clock className="h-3 w-3" />
											{formatTimeAgo(latestWorkEntry.date)}
										</span>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Bottom Info */}
					<div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800">
						<div className="flex items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
					{project.members.length > 0 && (
						<div className="flex items-center gap-1.5">
							<Users className="h-4 w-4" />
							<span>{project.members.length}</span>
						</div>
					)}
					{project.objectives.length > 0 && (
						<div className="flex items-center gap-1.5">
							<Target className="h-4 w-4" />
							<span>{project.objectives.length}</span>
						</div>
					)}
							{workEntriesCount > 0 && (
								<div className="flex items-center gap-1.5">
									<Clock className="h-4 w-4" />
									<span>{workEntriesCount} entries</span>
								</div>
							)}
						</div>

					<Button
						variant="outline"
						size="sm"
						onClick={() => navigate(`/app/projects/${project.id}`)}
						className="group-hover:bg-primary group-hover:text-white transition-colors"
					>
						<span>View Details</span>
						<ArrowRight className="h-4 w-4 ml-1" />
					</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

