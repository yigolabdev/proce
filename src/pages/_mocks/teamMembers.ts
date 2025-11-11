/**
 * Team Members 목업 데이터
 * @ Mention 기능을 위한 팀원 목록
 */

export interface TeamMember {
	id: string
	name: string
	email: string
	role: string
	department: string
	jobs?: string[] // Multiple jobs support
}

export const mockTeamMembers: TeamMember[] = [
	{
		id: '1',
		name: 'John Kim',
		email: 'john.kim@company.com',
		role: 'Product Manager',
		department: 'Product',
		jobs: ['Frontend Development', 'Backend Development'],
	},
	{
		id: '2',
		name: 'Sarah Lee',
		email: 'sarah.lee@company.com',
		role: 'Senior Developer',
		department: 'Engineering',
		jobs: ['Frontend Development'],
	},
	{
		id: '3',
		name: 'Michael Park',
		email: 'michael.park@company.com',
		role: 'UX Designer',
		department: 'Design',
		jobs: ['Frontend Development'],
	},
	{
		id: '4',
		name: 'Emily Chen',
		email: 'emily.chen@company.com',
		role: 'Marketing Manager',
		department: 'Marketing',
		jobs: ['Frontend Development', 'Backend Development'],
	},
	{
		id: '5',
		name: 'David Choi',
		email: 'david.choi@company.com',
		role: 'DevOps Engineer',
		department: 'Engineering',
		jobs: ['Backend Development'],
	},
	{
		id: '6',
		name: 'Jessica Jung',
		email: 'jessica.jung@company.com',
		role: 'Data Analyst',
		department: 'Data',
		jobs: ['Backend Development'],
	},
	{
		id: '7',
		name: 'Tom Wilson',
		email: 'tom.wilson@company.com',
		role: 'Sales Director',
		department: 'Sales',
		jobs: ['Frontend Development'],
	},
	{
		id: '8',
		name: 'Lisa Wang',
		email: 'lisa.wang@company.com',
		role: 'HR Manager',
		department: 'Human Resources',
		jobs: ['Frontend Development', 'Backend Development'],
	},
	{
		id: '9',
		name: 'Chris Anderson',
		email: 'chris.anderson@company.com',
		role: 'Backend Developer',
		department: 'Engineering',
		jobs: ['Backend Development'],
	},
	{
		id: '10',
		name: 'Anna Martinez',
		email: 'anna.martinez@company.com',
		role: 'Content Writer',
		department: 'Marketing',
		jobs: ['Frontend Development'],
	},
]

/**
 * 목업 팀 멤버를 localStorage에 초기화하는 함수
 */
export const initializeMockTeamMembers = (): void => {
	try {
		const existing = localStorage.getItem('teamMembers')
		if (!existing) {
			localStorage.setItem('teamMembers', JSON.stringify(mockTeamMembers))
			console.log('✅ Mock team members initialized')
		}
	} catch (error) {
		console.error('Failed to initialize mock team members:', error)
	}
}

