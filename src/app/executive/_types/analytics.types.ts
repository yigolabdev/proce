// Advanced Analytics Types

export interface TimeSeriesDataPoint {
	date: Date
	value: number
	label?: string
}

export interface TrendData {
	metric: string
	data: TimeSeriesDataPoint[]
	trend: 'increasing' | 'decreasing' | 'stable'
	changePercent: number
}

export interface ComparisonPeriod {
	label: string
	startDate: Date
	endDate: Date
	value: number
	metrics: {
		workEntries: number
		totalHours: number
		projectsActive: number
		okrProgress: number
	}
}

export interface DepartmentPerformance {
	department: string
	metrics: {
		totalWorkEntries: number
		totalHours: number
		averageProgress: number
		projectsCount: number
		okrCompletionRate: number
	}
	trend: 'up' | 'down' | 'stable'
	rank: number
}

export interface TeamMemberPerformance {
	userId: string
	name: string
	department: string
	metrics: {
		workEntries: number
		totalHours: number
		projectsInvolved: number
		okrProgress: number
		productivityScore: number
	}
	trend: 'up' | 'down' | 'stable'
}

export interface CategoryBreakdown {
	category: string
	count: number
	hours: number
	percentage: number
	color: string
}

export interface ProjectAnalytics {
	projectId: string
	projectName: string
	department: string
	status: string
	progress: number
	daysRemaining: number
	workEntriesCount: number
	teamSize: number
	velocity: number
	risk: 'low' | 'medium' | 'high'
}

export interface OKRAnalytics {
	objectiveId: string
	title: string
	owner: string
	team: string
	progress: number
	status: 'on-track' | 'at-risk' | 'behind' | 'completed'
	keyResultsTotal: number
	keyResultsCompleted: number
	daysRemaining: number
}

export interface ExportData {
	reportName: string
	generatedAt: Date
	dateRange: {
		start: Date
		end: Date
	}
	data: unknown
	charts?: string[] // base64 encoded chart images
}

export interface AnalyticsFilters {
	dateRange: {
		start: Date
		end: Date
	}
	departments?: string[]
	users?: string[]
	projects?: string[]
	categories?: string[]
}

export interface InsightCard {
	id: string
	type: 'success' | 'warning' | 'info' | 'danger'
	title: string
	description: string
	metric?: string
	change?: number
	recommendation?: string
	priority: 'high' | 'medium' | 'low'
}

