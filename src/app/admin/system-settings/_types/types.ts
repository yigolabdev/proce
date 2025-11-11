// System Settings Types

export interface WorkCategory {
	id: string
	name: string
	color: string
	description: string
}

export interface WorkTag {
	id: string
	name: string
	category: string
}

export interface WorkTemplate {
	id: string
	title: string
	description: string
	category: string
}

export interface Department {
	id: string
	name: string
	description: string
}

export interface Position {
	id: string
	name: string
	description: string
}

export interface Job {
	id: string
	title: string
	description: string
	responsibilities: string
}

// Color options for categories
export const COLOR_OPTIONS = [
	{ value: '#3B82F6', label: 'Blue' },
	{ value: '#8B5CF6', label: 'Purple' },
	{ value: '#10B981', label: 'Green' },
	{ value: '#F59E0B', label: 'Orange' },
	{ value: '#EF4444', label: 'Red' },
	{ value: '#EC4899', label: 'Pink' },
	{ value: '#6B7280', label: 'Gray' },
] as const

// Default data
export const DEFAULT_CATEGORIES: WorkCategory[] = [
	{ id: '1', name: 'Development', color: '#3B82F6', description: 'Software development tasks' },
	{ id: '2', name: 'Meeting', color: '#8B5CF6', description: 'Team meetings and discussions' },
	{ id: '3', name: 'Research', color: '#10B981', description: 'Research and analysis' },
	{ id: '4', name: 'Documentation', color: '#F59E0B', description: 'Documentation and writing' },
	{ id: '5', name: 'Review', color: '#EC4899', description: 'Code and document reviews' },
	{ id: '6', name: 'Other', color: '#6B7280', description: 'Other tasks' },
]

export const DEFAULT_TAGS: WorkTag[] = [
	{ id: '1', name: 'urgent', category: 'priority' },
	{ id: '2', name: 'bug-fix', category: 'type' },
	{ id: '3', name: 'feature', category: 'type' },
	{ id: '4', name: 'frontend', category: 'tech' },
	{ id: '5', name: 'backend', category: 'tech' },
	{ id: '6', name: 'database', category: 'tech' },
]

export const DEFAULT_TEMPLATES: WorkTemplate[] = [
	{
		id: '1',
		title: 'Daily Standup',
		description: 'What I did today:\n\nWhat I plan to do:\n\nBlockers:',
		category: 'meeting',
	},
	{
		id: '2',
		title: 'Bug Fix',
		description: 'Issue:\n\nRoot Cause:\n\nSolution:\n\nTested:',
		category: 'development',
	},
	{
		id: '3',
		title: 'Feature Complete',
		description: 'Feature:\n\nImplementation:\n\nTesting:\n\nDocumentation:',
		category: 'development',
	},
]

export const DEFAULT_DEPARTMENTS: Department[] = [
	{
		id: '1',
		name: 'Engineering',
		description: 'Software engineering and development',
	},
	{
		id: '2',
		name: 'Product',
		description: 'Product management and strategy',
	},
	{
		id: '3',
		name: 'Marketing',
		description: 'Marketing and communications',
	},
]

export const DEFAULT_POSITIONS: Position[] = [
	{
		id: '1',
		name: 'Software Engineer',
		description: 'Entry-level software developer',
	},
	{
		id: '2',
		name: 'Senior Software Engineer',
		description: 'Experienced software developer',
	},
	{
		id: '3',
		name: 'Product Manager',
		description: 'Product strategy and roadmap',
	},
]

export const DEFAULT_JOBS: Job[] = [
	{
		id: '1',
		title: 'Frontend Development',
		description: 'Build user interfaces and web applications',
		responsibilities: 'Develop responsive web applications\nImplement UI/UX designs\nOptimize performance',
	},
	{
		id: '2',
		title: 'Backend Development',
		description: 'Build APIs and server-side logic',
		responsibilities: 'Design and implement APIs\nDatabase management\nServer optimization',
	},
]

