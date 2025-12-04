/**
 * Mock Users Data
 * 
 * 중앙 집중화된 사용자 mock 데이터
 */

export interface MockUser {
	id: string
	name: string
	email: string
	department: string
	role: string
	avatar?: string
}

export const mockUsers: MockUser[] = [
	// Engineering Team (7 members)
	{ id: 'user-1', name: 'John Doe', email: 'john@company.com', department: 'Engineering', role: 'Senior Engineer' },
	{ id: 'user-3', name: 'Mike Johnson', email: 'mike@company.com', department: 'Engineering', role: 'Tech Lead' },
	{ id: 'user-5', name: 'David Lee', email: 'david@company.com', department: 'Engineering', role: 'Engineer' },
	{ id: 'user-7', name: 'Alex Kim', email: 'alex@company.com', department: 'Engineering', role: 'Engineer' },
	{ id: 'user-10', name: 'Chris Brown', email: 'chris@company.com', department: 'Engineering', role: 'Senior Engineer' },
	{ id: 'user-11', name: 'Jennifer Wang', email: 'jennifer@company.com', department: 'Engineering', role: 'Engineer' },
	{ id: 'user-12', name: 'Ryan Martinez', email: 'ryan@company.com', department: 'Engineering', role: 'Engineer' },
	
	// Product Team (4 members)
	{ id: 'user-2', name: 'Sarah Chen', email: 'sarah@company.com', department: 'Product', role: 'Product Manager' },
	{ id: 'user-13', name: 'Emma Thompson', email: 'emma@company.com', department: 'Product', role: 'Product Manager' },
	{ id: 'user-14', name: 'James Wilson', email: 'james@company.com', department: 'Product', role: 'Senior Product Manager' },
	{ id: 'user-15', name: 'Sophie Anderson', email: 'sophie@company.com', department: 'Product', role: 'Product Manager' },
	
	// Design Team (3 members)
	{ id: 'user-4', name: 'Emily Davis', email: 'emily@company.com', department: 'Design', role: 'Senior Designer' },
	{ id: 'user-16', name: 'Oliver Harris', email: 'oliver@company.com', department: 'Design', role: 'UX Designer' },
	{ id: 'user-17', name: 'Maya Patel', email: 'maya@company.com', department: 'Design', role: 'UI Designer' },
	
	// Marketing Team (3 members)
	{ id: 'user-6', name: 'Lisa Park', email: 'lisa@company.com', department: 'Marketing', role: 'Marketing Manager' },
	{ id: 'user-18', name: 'Tom Rodriguez', email: 'tom@company.com', department: 'Marketing', role: 'Content Manager' },
	{ id: 'user-19', name: 'Amy Zhang', email: 'amy@company.com', department: 'Marketing', role: 'Marketing Specialist' },
	
	// Sales Team (3 members)
	{ id: 'user-8', name: 'Robert Taylor', email: 'robert@company.com', department: 'Sales', role: 'Sales Manager' },
	{ id: 'user-20', name: 'Daniel Garcia', email: 'daniel@company.com', department: 'Sales', role: 'Account Executive' },
	{ id: 'user-21', name: 'Isabella Moore', email: 'isabella@company.com', department: 'Sales', role: 'Sales Representative' },
	
	// HR Team (2 members)
	{ id: 'user-9', name: 'Jessica White', email: 'jessica@company.com', department: 'Human Resources', role: 'HR Manager' },
	{ id: 'user-22', name: 'Michael Thomas', email: 'michael@company.com', department: 'Human Resources', role: 'HR Specialist' },
]

/**
 * 사용자 mock 데이터 초기화
 */
export function initializeMockUsers(): void {
	const existing = localStorage.getItem('users')
	if (!existing || JSON.parse(existing).length === 0) {
		localStorage.setItem('users', JSON.stringify(mockUsers))
	}
}

/**
 * 특정 부서의 사용자 가져오기
 */
export function getUsersByDepartment(department: string): MockUser[] {
	return mockUsers.filter(user => user.department === department)
}

/**
 * 현재 사용자를 제외한 사용자 가져오기
 */
export function getUsersExcept(currentUserId: string): MockUser[] {
	return mockUsers.filter(user => user.id !== currentUserId)
}

