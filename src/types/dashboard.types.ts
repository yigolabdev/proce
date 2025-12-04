export interface DashboardStats {
	workEntries: number
	hoursLogged: string
	completed: number
	completionRate: string
	unreadReviews: number
	pendingTasks: number
	urgentTasks: number
}

export interface PerformanceDataPoint {
	name: string
	hours: number
	focus: 'High' | 'Normal'
}

