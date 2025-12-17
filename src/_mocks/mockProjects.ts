/**
 * Mock Projects Data
 * 
 * 중앙 집중화된 프로젝트 mock 데이터
 * 다양한 scope (personal, team, department, company)의 프로젝트 포함
 */

import type { Project } from '../types/common.types'

export const mockProjects: Project[] = [
	// 개인 프로젝트 예시
	{
		id: 'proj-personal-1',
		name: 'Personal Portfolio Website',
		description: '개인 포트폴리오 웹사이트 제작 및 배포',
		ownership: {
			scope: 'personal',
			ownerId: 'user-1',
			ownerName: 'John Doe'
		},
		objectives: [
			'반응형 디자인 구현',
			'프로젝트 갤러리 추가',
			'블로그 기능 개발'
		],
		status: 'active',
		progress: 65,
		startDate: new Date('2024-01-15'),
		endDate: new Date('2024-03-30'),
		members: [],  // 개인 프로젝트는 멤버 불필요
		departments: [],
		tags: ['web', 'portfolio', 'personal'],
		priority: 'medium',
		createdAt: new Date('2024-01-10'),
		createdBy: 'John Doe',
		createdById: 'user-1',
		files: [],
		links: []
	},
	{
		id: 'proj-personal-2',
		name: 'Python Automation Scripts',
		description: '업무 자동화를 위한 Python 스크립트 모음',
		ownership: {
			scope: 'personal',
			ownerId: 'user-2',
			ownerName: 'Jane Smith'
		},
		objectives: [
			'일일 리포트 자동화',
			'데이터 수집 스크립트 개발',
			'알림 시스템 구축'
		],
		status: 'active',
		progress: 40,
		startDate: new Date('2024-02-01'),
		endDate: new Date('2024-04-30'),
		members: [],
		departments: [],
		tags: ['python', 'automation', 'scripts'],
		priority: 'low',
		createdAt: new Date('2024-01-28'),
		createdBy: 'Jane Smith',
		createdById: 'user-2',
		files: [],
		links: []
	},
	
	// 팀 프로젝트 예시
	{
		id: 'proj-team-1',
		name: 'Website Redesign',
		description: 'Complete redesign of the company website with modern UX/UI',
		ownership: {
			scope: 'team',
			teamId: 'team-design',
			teamName: 'Design Team'
		},
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
		members: [
			{
				id: 'user-3',
				name: 'Alice Johnson',
				email: 'alice@company.com',
				role: 'leader',
				department: 'Design'
			},
			{
				id: 'user-4',
				name: 'Bob Wilson',
				email: 'bob@company.com',
				role: 'member',
				department: 'Engineering'
			}
		],
		tags: ['website', 'design', 'frontend'],
		priority: 'high',
		createdAt: new Date('2024-01-10'),
		createdBy: 'Alice Johnson',
		createdById: 'user-3',
		files: [],
		links: []
	},
	{
		id: 'proj-team-2',
		name: 'Mobile App Development',
		description: 'Native mobile application for iOS and Android platforms',
		ownership: {
			scope: 'team',
			teamId: 'team-mobile',
			teamName: 'Mobile Development Team'
		},
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
		members: [
			{
				id: 'user-5',
				name: 'Charlie Brown',
				email: 'charlie@company.com',
				role: 'leader',
				department: 'Engineering'
			},
			{
				id: 'user-6',
				name: 'Diana Prince',
				email: 'diana@company.com',
				role: 'member',
				department: 'Product'
			}
		],
		tags: ['mobile', 'ios', 'android'],
		priority: 'high',
		createdAt: new Date('2023-10-25'),
		createdBy: 'Charlie Brown',
		createdById: 'user-5',
		files: [],
		links: []
	},
	
	// 부서 프로젝트 예시
	{
		id: 'proj-dept-1',
		name: 'API Integration Platform',
		description: 'Integration with third-party payment and analytics APIs',
		ownership: {
			scope: 'department',
			departmentId: 'dept-eng',
			departmentName: 'Engineering Department'
		},
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
		members: [
			{
				id: 'user-7',
				name: 'Eve Anderson',
				email: 'eve@company.com',
				role: 'leader',
				department: 'Engineering'
			},
			{
				id: 'user-8',
				name: 'Frank Miller',
				email: 'frank@company.com',
				role: 'member',
				department: 'Engineering'
			}
		],
		tags: ['api', 'backend', 'integration'],
		priority: 'high',
		createdAt: new Date('2024-02-20'),
		createdBy: 'Eve Anderson',
		createdById: 'user-7',
		files: [],
		links: []
	},
	{
		id: 'proj-dept-2',
		name: 'Data Analytics Platform',
		description: 'Build internal data analytics and visualization platform',
		ownership: {
			scope: 'department',
			departmentId: 'dept-data',
			departmentName: 'Data Science Department'
		},
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
		members: [
			{
				id: 'user-9',
				name: 'Grace Lee',
				email: 'grace@company.com',
				role: 'leader',
				department: 'Data Science'
			},
			{
				id: 'user-10',
				name: 'Henry Clark',
				email: 'henry@company.com',
				role: 'member',
				department: 'Engineering'
			}
		],
		tags: ['analytics', 'data', 'visualization'],
		priority: 'medium',
		createdAt: new Date('2024-01-15'),
		createdBy: 'Grace Lee',
		createdById: 'user-9',
		files: [],
		links: []
	},
	
	// 회사 전체 프로젝트 예시
	{
		id: 'proj-company-1',
		name: 'Digital Transformation Initiative',
		description: 'Company-wide digital transformation and process automation',
		ownership: {
			scope: 'company'
		},
		departments: ['Engineering', 'Product', 'Operations', 'HR'],
		objectives: [
			'Digitize all manual processes',
			'Implement company-wide collaboration tools',
			'Train 100% of employees on new systems',
			'Reduce operational costs by 30%'
		],
		status: 'active',
		progress: 25,
		startDate: new Date('2024-01-01'),
		endDate: new Date('2024-12-31'),
		members: [
			{
				id: 'exec-1',
				name: 'Sarah Executive',
				email: 'sarah@company.com',
				role: 'leader',
				department: 'Executive'
			},
			{
				id: 'user-11',
				name: 'Ivan Tech',
				email: 'ivan@company.com',
				role: 'member',
				department: 'Engineering'
			},
			{
				id: 'user-12',
				name: 'Julia Product',
				email: 'julia@company.com',
				role: 'member',
				department: 'Product'
			}
		],
		tags: ['transformation', 'company-wide', 'strategic'],
		priority: 'high',
		createdAt: new Date('2023-12-01'),
		createdBy: 'Sarah Executive',
		createdById: 'exec-1',
		files: [],
		links: []
	},
	{
		id: 'proj-company-2',
		name: 'Customer Portal V2',
		description: 'Next generation customer self-service portal',
		ownership: {
			scope: 'company'
		},
		departments: ['Engineering', 'Customer Success', 'Product'],
		objectives: [
			'Reduce support tickets by 40%',
			'Improve customer satisfaction',
			'Add self-service features'
		],
		status: 'planning',
		progress: 10,
		startDate: new Date('2024-04-01'),
		endDate: new Date('2024-09-30'),
		members: [
			{
				id: 'exec-2',
				name: 'Kevin Manager',
				email: 'kevin@company.com',
				role: 'leader',
				department: 'Product'
			},
			{
				id: 'user-13',
				name: 'Laura Dev',
				email: 'laura@company.com',
				role: 'member',
				department: 'Engineering'
			}
		],
		tags: ['customer', 'portal', 'self-service'],
		priority: 'high',
		createdAt: new Date('2024-03-15'),
		createdBy: 'Kevin Manager',
		createdById: 'exec-2',
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

