import { differenceInDays, eachDayOfInterval, format, isWithinInterval } from 'date-fns'
import type {
	TrendData,
	ComparisonPeriod,
	DepartmentPerformance,
	CategoryBreakdown,
	ProjectAnalytics,
	InsightCard,
	TimeSeriesDataPoint,
} from '../_types/analytics.types'
import type { WorkEntry, Project } from '../../../types/common.types'
import { STORAGE_KEYS } from '../../../types/common.types'
import { safeGetArray } from '../../../utils/safeStorage'

// Helper: Load data from localStorage safely with proper typing
export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
	try {
		const saved = localStorage.getItem(key)
		if (!saved) return defaultValue
		return JSON.parse(saved) as T
	} catch (error) {
		console.error(`Failed to load ${key}:`, error)
		return defaultValue
	}
}

// Helper: Safely parse date strings
const parseDate = (date: Date | string): Date => {
	return typeof date === 'string' ? new Date(date) : date
}

// Helper: Calculate trend direction
export const calculateTrend = (current: number, previous: number): 'up' | 'down' | 'stable' => {
	const change = ((current - previous) / previous) * 100
	if (Math.abs(change) < 5) return 'stable'
	return change > 0 ? 'up' : 'down'
}

// 1. Work Entries Trend Analysis
export const analyzeWorkEntriesTrend = (
	startDate: Date,
	endDate: Date
): TrendData => {
	const rawEntries = safeGetArray<WorkEntry>(STORAGE_KEYS.WORK_ENTRIES)
	const workEntries = rawEntries.map((entry) => ({
		...entry,
		date: parseDate(entry.date),
	}))

	const days = eachDayOfInterval({ start: startDate, end: endDate })
	const dataPoints: TimeSeriesDataPoint[] = days.map((day) => {
		const dayEntries = workEntries.filter((entry) =>
			format(entry.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
		)
		return {
			date: day,
			value: dayEntries.length,
			label: format(day, 'MMM d'),
		}
	})

	// Calculate trend
	const firstHalf = dataPoints.slice(0, Math.floor(dataPoints.length / 2))
	const secondHalf = dataPoints.slice(Math.floor(dataPoints.length / 2))
	const firstAvg = firstHalf.reduce((sum, d) => sum + d.value, 0) / firstHalf.length
	const secondAvg = secondHalf.reduce((sum, d) => sum + d.value, 0) / secondHalf.length
	const changePercent = ((secondAvg - firstAvg) / firstAvg) * 100

	return {
		metric: 'Work Entries',
		data: dataPoints,
		trend: changePercent > 5 ? 'increasing' : changePercent < -5 ? 'decreasing' : 'stable',
		changePercent,
	}
}

// 2. Period Comparison
export const comparePeriods = (
	currentStart: Date,
	currentEnd: Date,
	previousStart: Date,
	previousEnd: Date
): { current: ComparisonPeriod; previous: ComparisonPeriod; changes: Record<string, number> } => {
	const rawEntries = safeGetArray<WorkEntry>(STORAGE_KEYS.WORK_ENTRIES)
	const workEntries = rawEntries.map((entry) => ({
		...entry,
		date: parseDate(entry.date),
	}))
	
	const rawProjects = safeGetArray<Project>(STORAGE_KEYS.PROJECTS)
	const projects = rawProjects.map((proj) => ({
		...proj,
		startDate: parseDate(proj.startDate),
		endDate: parseDate(proj.endDate),
	}))
	
	const getCurrentMetrics = (start: Date, end: Date) => {
		const entries = workEntries.filter((e) => isWithinInterval(e.date, { start, end }))
		const activeProjects = projects.filter((p) =>
			p.status === 'active' && (
				isWithinInterval(p.startDate, { start, end }) ||
				isWithinInterval(p.endDate, { start, end }) ||
				(p.startDate <= start && p.endDate >= end)
			)
		)
		// const avgOkrProgress = objectives.length > 0
		// 	? objectives.reduce((sum, obj) => sum + (obj.progress || 0), 0) / objectives.length
		// 	: 0

		return {
			workEntries: entries.length,
			totalHours: entries.reduce((sum, e) => {
				const hours = e.duration ? parseFloat(e.duration.replace('h', '')) || 0 : 0
				return sum + hours
			}, 0),
			projectsActive: activeProjects.length,
			okrProgress: 0, // avgOkrProgress,
		}
	}

	const currentMetrics = getCurrentMetrics(currentStart, currentEnd)
	const previousMetrics = getCurrentMetrics(previousStart, previousEnd)

	const current: ComparisonPeriod = {
		label: 'Current Period',
		startDate: currentStart,
		endDate: currentEnd,
		value: currentMetrics.workEntries,
		metrics: currentMetrics,
	}

	const previous: ComparisonPeriod = {
		label: 'Previous Period',
		startDate: previousStart,
		endDate: previousEnd,
		value: previousMetrics.workEntries,
		metrics: previousMetrics,
	}

	const changes = {
		workEntries: ((currentMetrics.workEntries - previousMetrics.workEntries) / previousMetrics.workEntries) * 100 || 0,
		totalHours: ((currentMetrics.totalHours - previousMetrics.totalHours) / previousMetrics.totalHours) * 100 || 0,
		projectsActive: ((currentMetrics.projectsActive - previousMetrics.projectsActive) / previousMetrics.projectsActive) * 100 || 0,
		okrProgress: currentMetrics.okrProgress - previousMetrics.okrProgress,
	}

	return { current, previous, changes }
}

// 3. Department Performance Analysis
export const analyzeDepartmentPerformance = (startDate: Date, endDate: Date): DepartmentPerformance[] => {
	const rawEntries = safeGetArray<WorkEntry>(STORAGE_KEYS.WORK_ENTRIES)
	const workEntries = rawEntries
		.map((entry) => ({
			...entry,
			date: parseDate(entry.date),
		}))
		.filter((e) => isWithinInterval(e.date, { start: startDate, end: endDate }))

	const projects = safeGetArray<Project>(STORAGE_KEYS.PROJECTS)
	// const objectives = safeGetArray<Objective>(STORAGE_KEYS.OBJECTIVES)

	// Group by department
	const departments = new Map<string, WorkEntry[]>()
	
	// From work entries
	workEntries.forEach((entry) => {
		const dept = entry.department || 'Unassigned'
		if (!departments.has(dept)) departments.set(dept, [])
		departments.get(dept)!.push(entry)
	})

	// From projects
	projects.forEach((project) => {
		const dept = project.departments?.[0] || 'Unassigned'
		if (!departments.has(dept)) departments.set(dept, [])
	})

	const results: DepartmentPerformance[] = Array.from(departments.entries()).map(([dept, entries]) => {
		const deptProjects = projects.filter((p) => p.departments?.includes(dept))
		// const deptObjectives = objectives.filter((o) => o.team === dept)

		const totalHours = entries.reduce((sum, e) => {
			const hours = e.duration ? parseFloat(e.duration.replace('h', '')) || 0 : 0
			return sum + hours
		}, 0)

		const avgProgress = deptProjects.length > 0
			? deptProjects.reduce((sum, p) => sum + p.progress, 0) / deptProjects.length
			: 0

		// const okrCompletionRate = deptObjectives.length > 0
		// 	? deptObjectives.filter((o) => o.status === 'completed').length / deptObjectives.length * 100
		// 	: 0

		return {
			department: dept,
			metrics: {
				totalWorkEntries: entries.length,
				totalHours,
				averageProgress: avgProgress,
				projectsCount: deptProjects.length,
				okrCompletionRate: 0, // okrCompletionRate,
			},
			trend: 'stable', // TODO: Calculate based on historical data
			rank: 0, // Will be set after sorting
		}
	})

	// Sort by productivity score and assign ranks
	results.sort((a, b) => b.metrics.totalWorkEntries - a.metrics.totalWorkEntries)
	results.forEach((dept, index) => {
		dept.rank = index + 1
	})

	return results
}

// 4. Category Breakdown
export const analyzeCategoryBreakdown = (startDate: Date, endDate: Date): CategoryBreakdown[] => {
	const rawEntries = safeGetArray<WorkEntry>(STORAGE_KEYS.WORK_ENTRIES)
	const workEntries = rawEntries
		.map((entry) => ({
			...entry,
			date: parseDate(entry.date),
		}))
		.filter((e) => isWithinInterval(e.date, { start: startDate, end: endDate }))

	const categoryMap = new Map<string, { count: number; hours: number }>()
	const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#6B7280', '#14B8A6', '#F97316', '#A855F7']

	workEntries.forEach((entry) => {
		const category = entry.category || 'Uncategorized'
		if (!categoryMap.has(category)) {
			categoryMap.set(category, { count: 0, hours: 0 })
		}
		const data = categoryMap.get(category)!
		data.count++
		const hours = entry.duration ? parseFloat(entry.duration.replace('h', '')) || 0 : 0
		data.hours += hours
	})

	const total = workEntries.length
	const results: CategoryBreakdown[] = Array.from(categoryMap.entries()).map(([category, data], index) => ({
		category,
		count: data.count,
		hours: data.hours,
		percentage: (data.count / total) * 100,
		color: colors[index % colors.length],
	}))

	return results.sort((a, b) => b.count - a.count)
}

// 5. Project Analytics
export const analyzeProjects = (startDate: Date, endDate: Date): ProjectAnalytics[] => {
	const rawProjects = safeGetArray<Project>(STORAGE_KEYS.PROJECTS)
	const projects = rawProjects.map((proj) => ({
		...proj,
		startDate: parseDate(proj.startDate),
		endDate: parseDate(proj.endDate),
	}))
	const workEntries = safeGetArray<WorkEntry>(STORAGE_KEYS.WORK_ENTRIES)

	return projects.map((project) => {
		const projectEntries = workEntries.filter((e) => e.projectId === project.id)
		const daysTotal = differenceInDays(project.endDate, project.startDate)
		const daysPassed = differenceInDays(new Date(), project.startDate)
		const daysRemaining = Math.max(0, differenceInDays(project.endDate, new Date()))
		const expectedProgress = daysTotal > 0 ? (daysPassed / daysTotal) * 100 : 0
		const progressDiff = project.progress - expectedProgress

		let risk: 'low' | 'medium' | 'high' = 'low'
		if (progressDiff < -20) risk = 'high'
		else if (progressDiff < -10) risk = 'medium'

		return {
			projectId: project.id,
			projectName: project.name,
			department: project.departments?.[0] || 'Unassigned',
			status: project.status,
			progress: project.progress,
			daysRemaining,
			workEntriesCount: projectEntries.length,
			teamSize: project.members?.length || 0,
			velocity: projectEntries.length / Math.max(1, daysPassed),
			risk,
		}
	}).filter((p) =>
		isWithinInterval(p.projectId, { start: startDate, end: endDate }) ||
		p.status === 'active' || p.status === 'planning'
	)
}

// 6. OKR Analytics (Deprecated)
// export const analyzeOKRs = (): OKRAnalytics[] => {
// 	return []
// }

// 7. Generate AI Insights
export const generateInsights = (startDate: Date, endDate: Date): InsightCard[] => {
	const rawEntries = safeGetArray<WorkEntry>(STORAGE_KEYS.WORK_ENTRIES)
	const workEntries = rawEntries
		.map((entry) => ({
			...entry,
			date: parseDate(entry.date),
		}))
		.filter((e) => isWithinInterval(e.date, { start: startDate, end: endDate }))

	const projects = safeGetArray<Project>(STORAGE_KEYS.PROJECTS)
	// const objectives = safeGetArray<Objective>(STORAGE_KEYS.OBJECTIVES)

	const insights: InsightCard[] = []

	// Insight 1: Work Entry Trend
	const avgEntriesPerDay = workEntries.length / Math.max(1, differenceInDays(endDate, startDate))
	if (avgEntriesPerDay > 5) {
		insights.push({
			id: 'high-activity',
			type: 'success',
			title: 'High Team Activity',
			description: `Averaging ${avgEntriesPerDay.toFixed(1)} work entries per day`,
			metric: `${workEntries.length} total entries`,
			priority: 'high',
		})
	}

	// Insight 2: At-risk Projects
	const atRiskProjects = projects.filter((p) => {
		const daysRemaining = differenceInDays(new Date(p.endDate), new Date())
		return p.status === 'active' && p.progress < 50 && daysRemaining < 30
	})
	if (atRiskProjects.length > 0) {
		insights.push({
			id: 'at-risk-projects',
			type: 'warning',
			title: `${atRiskProjects.length} Project${atRiskProjects.length > 1 ? 's' : ''} At Risk`,
			description: 'Projects are behind schedule with less than 30 days remaining',
			recommendation: 'Review resource allocation and timelines',
			priority: 'high',
		})
	}

	// Insight 3: OKR Progress (Removed)

	// Insight 4: Category Distribution
	const categories = new Map<string, number>()
	workEntries.forEach((entry) => {
		const cat = entry.category || 'Uncategorized'
		categories.set(cat, (categories.get(cat) || 0) + 1)
	})
	const topCategory = Array.from(categories.entries()).sort((a, b) => b[1] - a[1])[0]
	if (topCategory) {
		const percentage = (topCategory[1] / workEntries.length) * 100
		if (percentage > 40) {
			insights.push({
				id: 'category-focus',
				type: 'info',
				title: `Focus on ${topCategory[0]}`,
				description: `${percentage.toFixed(0)}% of work is in this category`,
				metric: `${topCategory[1]} entries`,
				priority: 'low',
			})
		}
	}

	return insights.sort((a, b) => {
		const priorityOrder = { high: 0, medium: 1, low: 2 }
		return priorityOrder[a.priority] - priorityOrder[b.priority]
	})
}

