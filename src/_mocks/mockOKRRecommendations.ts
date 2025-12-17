/**
 * Mock OKR AI Recommendations
 */

import type { OKRRecommendation, OKRInsight } from '../services/ai/okrRecommendation.service'
import { format } from 'date-fns'

const currentPeriod = format(new Date(), 'yyyy-Q')

export const mockOKRRecommendations: OKRRecommendation[] = [
	// Objective Recommendations
	{
		id: 'rec-obj-1',
		type: 'objective',
		title: 'Improve Personal Productivity by 25%',
		description: 'Enhance work efficiency through better time management and focused work sessions',
		reasoning: [
			'Recent work entries show fragmented time blocks',
			'Average completion rate is below team benchmark',
			'Opportunity to improve focus time allocation',
		],
		confidence: 0.85,
		priority: 'high',
		suggestedPeriod: currentPeriod,
		category: 'Personal Development',
		status: 'pending',
		createdAt: new Date(),
	},
	{
		id: 'rec-obj-2',
		type: 'objective',
		title: 'Launch Product Feature MVP',
		description: 'Successfully deliver and launch the new feature to production',
		reasoning: [
			'Active project "Product Feature Development" lacks corresponding OKR',
			'Project progress is at 65% with 45 days remaining',
			'High priority project requires clear success metrics',
		],
		confidence: 0.92,
		priority: 'high',
		suggestedPeriod: currentPeriod,
		category: 'Project Delivery',
		status: 'pending',
		createdAt: new Date(),
		relatedData: {
			projectIds: ['proj-1'],
		},
	},
	{
		id: 'rec-obj-3',
		type: 'objective',
		title: 'Strengthen Team Collaboration',
		description: 'Build better communication channels and increase team engagement',
		reasoning: [
			'Limited cross-functional work entries detected',
			'Collaboration metrics suggest improvement opportunities',
			'Team projects show coordination gaps',
		],
		confidence: 0.75,
		priority: 'medium',
		suggestedPeriod: currentPeriod,
		category: 'Collaboration',
		status: 'pending',
		createdAt: new Date(),
	},
	{
		id: 'rec-obj-4',
		type: 'objective',
		title: 'Enhance Technical Skills',
		description: 'Acquire new technical competencies relevant to current projects',
		reasoning: [
			'Recent projects involve technologies not in current skill set',
			'Learning time allocation is below recommended 10%',
			'Skill development correlates with career growth',
		],
		confidence: 0.78,
		priority: 'medium',
		suggestedPeriod: currentPeriod,
		category: 'Learning & Development',
		status: 'pending',
		createdAt: new Date(),
	},
	{
		id: 'rec-obj-5',
		type: 'objective',
		title: 'Reduce Technical Debt by 30%',
		description: 'Systematically address and reduce accumulated technical debt',
		reasoning: [
			'Code maintenance tasks consuming 25% of work time',
			'Refactoring opportunities identified in recent sprints',
			'Technical debt impacts delivery velocity',
		],
		confidence: 0.82,
		priority: 'high',
		suggestedPeriod: currentPeriod,
		category: 'Engineering Excellence',
		status: 'pending',
		createdAt: new Date(),
	},
]

export const mockOKRInsights: OKRInsight[] = [
	{
		type: 'gap',
		title: 'No OKRs for Current Quarter',
		description: 'You have active projects but no objectives set for the current quarter. Setting clear OKRs will help track progress and maintain focus.',
		severity: 'high',
		actionable: true,
	},
	{
		type: 'progress',
		title: 'Opportunity for Key Results',
		description: 'Your existing objectives have fewer than 3 key results each. Adding more measurable key results will provide better progress tracking.',
		severity: 'medium',
		actionable: true,
	},
	{
		type: 'alignment',
		title: 'Project-OKR Alignment Gap',
		description: '3 active projects are not aligned with any objectives. Connecting projects to OKRs ensures strategic alignment.',
		severity: 'medium',
		actionable: true,
	},
	{
		type: 'suggestion',
		title: 'Work Pattern Analysis',
		description: 'Based on your recent work patterns, we recommend focusing on productivity and skill development objectives this quarter.',
		severity: 'low',
		actionable: false,
	},
]

export const mockOKRSummary = {
	totalRecommendations: mockOKRRecommendations.length,
	objectiveCount: mockOKRRecommendations.filter(r => r.type === 'objective').length,
	keyResultCount: mockOKRRecommendations.filter(r => r.type === 'key_result').length,
	highPriority: mockOKRRecommendations.filter(r => r.priority === 'high').length,
	categories: mockOKRRecommendations.reduce((acc, rec) => {
		acc[rec.category] = (acc[rec.category] || 0) + 1
		return acc
	}, {} as Record<string, number>),
}

/**
 * Initialize mock OKR recommendations in localStorage
 */
export function initializeMockOKRRecommendations() {
	const existing = localStorage.getItem('okr_ai_recommendations')
	
	if (!existing) {
		localStorage.setItem('okr_ai_recommendations', JSON.stringify({
			recommendations: mockOKRRecommendations,
			insights: mockOKRInsights,
			summary: mockOKRSummary,
			lastUpdate: new Date().toISOString(),
		}))
		console.log('✅ Mock OKR AI recommendations initialized')
	}
}

