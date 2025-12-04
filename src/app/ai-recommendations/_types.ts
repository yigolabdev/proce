export interface TaskRecommendation {
	id: string
	title: string
	description: string
	priority: 'high' | 'medium' | 'low'
	category: string
	deadline?: string
	dataSource: string
	status: 'pending' | 'accepted' | 'rejected'
	projectId?: string
	projectName?: string
	isManual?: boolean
	createdAt?: string
	createdBy?: string
	assignedTo?: string
	assignedToId?: string
	aiAnalysis?: {
		projectName: string
		analysisDate: string
		analysisReason: string
		relatedMembers: Array<{
			name: string
			role: string
			department: string
			memberType: 'active' | 'related'
		}>
		detailedInstructions: string[]
		expectedOutcome: string
		recommendations: string[]
		riskFactors: string[]
	}
}

export interface RecommendationInsight {
	type: 'gap' | 'inactive' | 'deadline' | 'info'
	metric: string
	value: string
	status: 'warning' | 'info' | 'urgent'
}

