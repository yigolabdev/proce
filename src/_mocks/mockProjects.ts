/**
 * Mock Projects Data
 * 
 * 중앙 집중화된 프로젝트 mock 데이터
 */

import type { Project } from '../types/common.types'

export const mockProjects: Project[] = [
	{
		id: 'proj-1',
		name: 'Website Redesign',
		description: 'Complete redesign of the company website with modern UX/UI',
		departments: ['Engineering', 'Design'],
		objectives: [
			'Improve user experience',
			'Increase conversion rate by 25%',
			'Reduce page load time'
		],
		status: 'active',
		progress: 45,
		startDate: new Date('2024-01-15'),
		endDate: new Date('2024-06-30'),
		members: [],
		tags: ['website', 'design', 'frontend'],
		createdAt: new Date('2024-01-10'),
		createdBy: 'Product Manager',
		files: [],
		links: []
	},
	{
		id: 'proj-2',
		name: 'Mobile App Development',
		description: 'Native mobile application for iOS and Android platforms',
		departments: ['Engineering', 'Product'],
		objectives: [
			'Launch MVP by Q2',
			'Achieve 10,000 downloads in first month',
			'Maintain 4.5+ star rating'
		],
		status: 'active',
		progress: 60,
		startDate: new Date('2023-11-01'),
		endDate: new Date('2024-05-15'),
		members: [],
		tags: ['mobile', 'ios', 'android'],
		createdAt: new Date('2023-10-25'),
		createdBy: 'CTO',
		files: [],
		links: []
	},
	{
		id: 'proj-3',
		name: 'API Integration',
		description: 'Integration with third-party payment and analytics APIs',
		departments: ['Engineering'],
		objectives: [
			'Integrate payment gateway',
			'Set up analytics tracking',
			'Implement webhook handlers'
		],
		status: 'planning',
		progress: 15,
		startDate: new Date('2024-03-01'),
		endDate: new Date('2024-04-30'),
		members: [],
		tags: ['api', 'backend', 'integration'],
		createdAt: new Date('2024-02-20'),
		createdBy: 'Tech Lead',
		files: [],
		links: []
	},
	{
		id: 'proj-4',
		name: 'Data Analytics Platform',
		description: 'Build internal data analytics and visualization platform',
		departments: ['Engineering', 'Data Science'],
		objectives: [
			'Create real-time dashboards',
			'Implement data pipelines',
			'Enable self-service analytics'
		],
		status: 'active',
		progress: 30,
		startDate: new Date('2024-01-20'),
		endDate: new Date('2024-08-31'),
		members: [],
		tags: ['analytics', 'data', 'visualization'],
		createdAt: new Date('2024-01-15'),
		createdBy: 'Data Team Lead',
		files: [],
		links: []
	},
	{
		id: 'proj-5',
		name: 'Customer Portal V2',
		description: 'Next generation customer self-service portal',
		departments: ['Engineering', 'Customer Success'],
		objectives: [
			'Reduce support tickets by 40%',
			'Improve customer satisfaction',
			'Add self-service features'
		],
		status: 'planning',
		progress: 10,
		startDate: new Date('2024-04-01'),
		endDate: new Date('2024-09-30'),
		members: [],
		tags: ['customer', 'portal', 'self-service'],
		createdAt: new Date('2024-03-15'),
		createdBy: 'Head of Customer Success',
		files: [],
		links: []
	}
]

/**
 * 프로젝트 mock 데이터 초기화
 */
export function initializeMockProjects(): void {
	const existing = localStorage.getItem('projects')
	if (!existing || JSON.parse(existing).length === 0) {
		localStorage.setItem('projects', JSON.stringify(mockProjects))
	}
}

