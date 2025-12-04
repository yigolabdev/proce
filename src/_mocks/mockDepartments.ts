/**
 * Mock Departments Data
 * 
 * 중앙 집중화된 부서 mock 데이터
 */

import type { Department } from '../types/common.types'

export const mockDepartments: Department[] = [
	{
		id: 'dept-1',
		name: 'Engineering',
		code: 'ENG',
		description: 'Software Engineering and Development',
		employeeCount: 7,
		isActive: true
	},
	{
		id: 'dept-2',
		name: 'Product',
		code: 'PRD',
		description: 'Product Management and Strategy',
		employeeCount: 4,
		isActive: true
	},
	{
		id: 'dept-3',
		name: 'Design',
		code: 'DSN',
		description: 'UX/UI Design and Creative',
		employeeCount: 3,
		isActive: true
	},
	{
		id: 'dept-4',
		name: 'Marketing',
		code: 'MKT',
		description: 'Marketing and Communications',
		employeeCount: 3,
		isActive: true
	},
	{
		id: 'dept-5',
		name: 'Sales',
		code: 'SLS',
		description: 'Sales and Business Development',
		employeeCount: 3,
		isActive: true
	},
	{
		id: 'dept-6',
		name: 'Human Resources',
		code: 'HR',
		description: 'Human Resources and People Operations',
		employeeCount: 2,
		isActive: true
	},
	{
		id: 'dept-7',
		name: 'Finance',
		code: 'FIN',
		description: 'Finance and Accounting',
		employeeCount: 0,
		isActive: true
	},
	{
		id: 'dept-8',
		name: 'Operations',
		code: 'OPS',
		description: 'Operations and Administration',
		employeeCount: 0,
		isActive: true
	}
]

/**
 * 부서 mock 데이터 초기화
 */
export function initializeMockDepartments(): void {
	const existing = localStorage.getItem('departments')
	if (!existing || JSON.parse(existing).length === 0) {
		localStorage.setItem('departments', JSON.stringify(mockDepartments))
	}
}

