export interface AssignedTask {
	id: string
	title: string
	description: string
	priority: 'high' | 'medium' | 'low'
	category: string
	projectId?: string
	projectName?: string
	assignedTo?: string
	deadline?: string
}

export const mockTasks: AssignedTask[] = [
	{
		id: 'mock-task-1',
		title: 'Implement User Authentication System',
		description: 'Build a comprehensive user authentication module with JWT tokens, social login (Google, GitHub), password reset flow, and session management. Include security features like rate limiting and CSRF protection.',
		priority: 'high',
		category: 'development',
		projectId: 'proj-2',
		projectName: 'Mobile App Development',
		assignedTo: 'Current User',
		deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: 'mock-task-2',
		title: 'Design Marketing Assets',
		description: 'Create social media banners, email templates, and ad creatives for the upcoming product launch campaign. Ensure brand consistency across all assets.',
		priority: 'medium',
		category: 'design',
		projectId: 'proj-3',
		projectName: 'Marketing Campaign',
		assignedTo: 'Current User',
		deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
	},
	{
		id: 'mock-task-3',
		title: 'Update API Documentation',
		description: 'Review and update the API documentation to reflect the latest endpoints and changes. Add examples for new features and fix any outdated information.',
		priority: 'low',
		category: 'documentation',
		projectId: 'proj-1',
		projectName: 'Platform API',
		assignedTo: 'Current User',
		deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
	}
]

