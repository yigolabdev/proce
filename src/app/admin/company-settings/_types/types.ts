// Company Settings Types

export interface CompanyInfo {
	// Basic Info
	name: string
	legalName: string
	businessNumber: string
	industry: string
	companySize: string
	foundedYear: string
	foundedDate: string
	
	// Contact
	address: string
	city: string
	postalCode: string
	country: string
	phone: string
	email: string
	website: string
	socialLinks: Array<{ platform: string; url: string }>
	
	// Business
	description: string
	vision: string
	mission: string
	mainProducts: string
	mainServices: string
	targetMarket: string
	targetCustomers: string
	competitiveAdvantage: string
	
	// Workforce
	employeeCount: string
	fullTimeCount: string
	partTimeCount: string
}

export interface LeadershipMember {
	id: string
	name: string
	position: string
	department?: string
	email?: string
	phone?: string
}

export interface CompanyKPI {
	id: string
	name: string
	description: string
	category: 'Financial' | 'Customer' | 'Operational' | 'HR' | 'Growth' | 'Strategic'
	
	// Target & Progress
	targetValue: number
	currentValue: number
	unit: string
	
	// Period
	period: 'monthly' | 'quarterly' | 'annual'
	startDate: string
	endDate: string
	
	// Responsibility
	owner: string
	department: string
	
	// Measurement
	measurementFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly'
	dataSource: string
	
	// Status
	status: 'on-track' | 'at-risk' | 'behind' | 'achieved'
	priority: 'high' | 'medium' | 'low'
	
	createdAt: Date
	updatedAt: Date
}

export interface FinancialData {
	year: string
	totalRevenue: string
	netIncome: string
	totalAssets: string
	totalLiabilities: string
	documents?: Array<{
		id: string
		name: string
		size: number
		uploadedAt: string
	}>
}

export interface UploadedDocument {
	id: string
	name: string
	size: number
	type: string
	category?: string
	uploadedAt: string
	uploadedBy?: string
}

export interface WorkplaceSettings {
	// Locale
	language: 'en' | 'ko'
	timezone: string
	workingDays: number[]
	workingHours: {
		start: string
		end: string
	}
	quietHours?: {
		start: string
		end: string
	}
}

export interface HistoricalData {
	id: string
	projectName: string
	description: string
	startDate: string
	endDate: string
	outcome: string
	technologies?: string[]
	teamSize?: number
	budget?: string
	keyLearnings?: string
	metrics?: Array<{ name: string; value: string }>
}

// Constants
export const POSITION_OPTIONS = [
	'CEO',
	'CFO',
	'CTO',
	'COO',
	'CMO',
	'Director',
	'Manager',
	'Team Lead',
	'Senior Engineer',
	'Engineer',
	'Analyst',
	'Specialist',
	'Coordinator',
	'Other',
] as const

export const DOCUMENT_CATEGORIES = [
	{ id: 'financial', label: 'Financial Reports', icon: '💰' },
	{ id: 'legal', label: 'Legal Documents', icon: '⚖️' },
	{ id: 'contracts', label: 'Contracts', icon: '📝' },
	{ id: 'hr', label: 'HR Documents', icon: '👥' },
	{ id: 'marketing', label: 'Marketing Materials', icon: '📣' },
	{ id: 'technical', label: 'Technical Docs', icon: '🔧' },
	{ id: 'compliance', label: 'Compliance', icon: '✅' },
	{ id: 'strategy', label: 'Strategy', icon: '🎯' },
	{ id: 'other', label: 'Other', icon: '📄' },
] as const

export const KPI_CATEGORIES = [
	{ id: 'Financial', label: 'Financial', icon: '💰', color: 'text-green-600' },
	{ id: 'Customer', label: 'Customer', icon: '👥', color: 'text-blue-600' },
	{ id: 'Operational', label: 'Operational', icon: '⚙️', color: 'text-purple-600' },
	{ id: 'HR', label: 'HR', icon: '👤', color: 'text-orange-600' },
	{ id: 'Growth', label: 'Growth', icon: '📈', color: 'text-pink-600' },
	{ id: 'Strategic', label: 'Strategic', icon: '🎯', color: 'text-indigo-600' },
] as const

