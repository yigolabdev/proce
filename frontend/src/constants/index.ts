/**
 * Application Constants
 * 
 * 애플리케이션 전체에서 사용되는 상수 정의
 */

// ============================================
// App Configuration
// ============================================

export const APP_NAME = 'Proce'
export const APP_VERSION = '1.0.0'
export const APP_DESCRIPTION = 'AI-powered business intelligence platform'

// ============================================
// API Configuration
// ============================================

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
export const API_TIMEOUT = 30000 // 30 seconds

// ============================================
// Pagination
// ============================================

export const DEFAULT_PAGE_SIZE = 15
export const PAGE_SIZE_OPTIONS = [10, 15, 25, 50, 100]

// ============================================
// File Upload
// ============================================

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
export const ALLOWED_DOCUMENT_TYPES = [
	'application/pdf',
	'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/vnd.ms-excel',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	'text/csv',
]
export const ALLOWED_FINANCIAL_DOCUMENT_TYPES = [
	'application/pdf',
	'application/vnd.ms-excel',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	'text/csv',
]

// ============================================
// Date Formats
// ============================================

export const DATE_FORMAT = {
	SHORT: 'MM/DD/YYYY',
	LONG: 'MMMM DD, YYYY',
	FULL: 'dddd, MMMM DD, YYYY',
	TIME: 'HH:mm:ss',
	DATETIME: 'MM/DD/YYYY HH:mm',
} as const

// ============================================
// User Roles
// ============================================

export const USER_ROLES = {
	WORKER: 'worker',
	ADMIN: 'admin',
	EXECUTIVE: 'executive',
} as const

export const ROLE_LABELS = {
	[USER_ROLES.WORKER]: 'Worker',
	[USER_ROLES.ADMIN]: 'Admin',
	[USER_ROLES.EXECUTIVE]: 'Executive',
} as const

// ============================================
// Status
// ============================================

export const STATUS = {
	PENDING: 'pending',
	ACTIVE: 'active',
	COMPLETED: 'completed',
	CANCELLED: 'cancelled',
	ARCHIVED: 'archived',
} as const

export const STATUS_LABELS = {
	[STATUS.PENDING]: 'Pending',
	[STATUS.ACTIVE]: 'Active',
	[STATUS.COMPLETED]: 'Completed',
	[STATUS.CANCELLED]: 'Cancelled',
	[STATUS.ARCHIVED]: 'Archived',
} as const

export const STATUS_COLORS = {
	[STATUS.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
	[STATUS.ACTIVE]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
	[STATUS.COMPLETED]: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
	[STATUS.CANCELLED]: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
	[STATUS.ARCHIVED]: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
} as const

// ============================================
// Priority
// ============================================

export const PRIORITY = {
	LOW: 'low',
	MEDIUM: 'medium',
	HIGH: 'high',
	URGENT: 'urgent',
} as const

export const PRIORITY_LABELS = {
	[PRIORITY.LOW]: 'Low',
	[PRIORITY.MEDIUM]: 'Medium',
	[PRIORITY.HIGH]: 'High',
	[PRIORITY.URGENT]: 'Urgent',
} as const

export const PRIORITY_COLORS = {
	[PRIORITY.LOW]: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
	[PRIORITY.MEDIUM]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
	[PRIORITY.HIGH]: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
	[PRIORITY.URGENT]: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
} as const

// ============================================
// Work Categories
// ============================================

export const WORK_CATEGORIES = [
	'Development',
	'Design',
	'Marketing',
	'Sales',
	'Support',
	'Management',
	'Research',
	'Operations',
	'Finance',
	'HR',
	'Other',
] as const

// ============================================
// Expense Categories
// ============================================

export const EXPENSE_CATEGORIES = {
	PERSONNEL: 'Personnel',
	OPERATIONS: 'Operations',
	MARKETING: 'Marketing',
	TECHNOLOGY: 'Technology',
	SALES: 'Sales',
	RND: 'R&D',
	FINANCE: 'Finance',
	OTHER: 'Other',
} as const

export const EXPENSE_SUBCATEGORIES = {
	[EXPENSE_CATEGORIES.PERSONNEL]: ['Salaries', 'Bonuses', 'Benefits', 'Training', 'Recruitment', 'Consulting'],
	[EXPENSE_CATEGORIES.OPERATIONS]: ['Rent', 'Utilities', 'Maintenance', 'Supplies', 'Equipment', 'Insurance'],
	[EXPENSE_CATEGORIES.MARKETING]: ['Advertising', 'Events', 'PR', 'Digital Marketing', 'Content Creation', 'Sponsorship'],
	[EXPENSE_CATEGORIES.TECHNOLOGY]: ['Software Licenses', 'Cloud Services', 'Hardware', 'IT Support', 'Development', 'Security'],
	[EXPENSE_CATEGORIES.SALES]: ['Commissions', 'Travel', 'Entertainment', 'Client Gifts', 'Trade Shows'],
	[EXPENSE_CATEGORIES.RND]: ['Research', 'Prototyping', 'Testing', 'Patents', 'Lab Equipment'],
	[EXPENSE_CATEGORIES.FINANCE]: ['Bank Fees', 'Interest', 'Accounting', 'Legal', 'Taxes', 'Audit'],
	[EXPENSE_CATEGORIES.OTHER]: ['Miscellaneous', 'One-time', 'Emergency'],
} as const

// ============================================
// Payment Methods
// ============================================

export const PAYMENT_METHODS = [
	'Corporate Card',
	'Bank Transfer',
	'Cash',
	'Check',
	'Online Payment',
	'Other',
] as const

// ============================================
// KPI Categories
// ============================================

export const KPI_CATEGORIES = [
	'Revenue',
	'Marketing',
	'Operations',
	'Customer',
	'Product',
	'Finance',
	'HR',
	'Sales',
] as const

// ============================================
// Industries
// ============================================

export const INDUSTRIES = [
	'IT / SaaS / Software',
	'Manufacturing / Production',
	'Finance / Insurance / Securities',
	'Distribution / Retail / Trading',
	'Service / Consulting',
	'Construction / Engineering',
	'Medical / Pharmaceutical / Bio',
	'Education / Research',
	'Media / Content / Entertainment',
	'Food / Beverage / Restaurant',
	'Fashion / Beauty / Lifestyle',
	'Logistics / Transportation',
	'Energy / Environment',
	'Real Estate / Property',
	'Telecommunications',
	'Automotive / Mobility',
	'Aerospace / Defense',
	'Agriculture / Fisheries',
	'Legal / Accounting / Tax',
	'Marketing / Advertising / PR',
	'Design / Creative',
	'Gaming / Esports',
	'Travel / Hospitality',
	'Sports / Fitness',
	'Non-profit / NGO',
	'Government / Public',
	'Other',
] as const

// ============================================
// Company Sizes
// ============================================

export const COMPANY_SIZES = [
	'1-10',
	'11-50',
	'51-100',
	'101-500',
	'501-1000',
	'1001-5000',
	'5000+',
] as const

// ============================================
// Project Status
// ============================================

export const PROJECT_STATUS = {
	PLANNING: 'planning',
	ACTIVE: 'active',
	ON_HOLD: 'on-hold',
	COMPLETED: 'completed',
} as const

export const PROJECT_STATUS_LABELS = {
	[PROJECT_STATUS.PLANNING]: 'Planning',
	[PROJECT_STATUS.ACTIVE]: 'Active',
	[PROJECT_STATUS.ON_HOLD]: 'On Hold',
	[PROJECT_STATUS.COMPLETED]: 'Completed',
} as const

// ============================================
// Date Ranges
// ============================================

export const DATE_RANGES = {
	TODAY: 'today',
	YESTERDAY: 'yesterday',
	LAST_7_DAYS: 'last_7_days',
	LAST_30_DAYS: 'last_30_days',
	LAST_90_DAYS: 'last_90_days',
	THIS_WEEK: 'this_week',
	THIS_MONTH: 'this_month',
	THIS_QUARTER: 'this_quarter',
	THIS_YEAR: 'this_year',
	ALL_TIME: 'all_time',
	CUSTOM: 'custom',
} as const

export const DATE_RANGE_LABELS = {
	[DATE_RANGES.TODAY]: 'Today',
	[DATE_RANGES.YESTERDAY]: 'Yesterday',
	[DATE_RANGES.LAST_7_DAYS]: 'Last 7 Days',
	[DATE_RANGES.LAST_30_DAYS]: 'Last 30 Days',
	[DATE_RANGES.LAST_90_DAYS]: 'Last 90 Days',
	[DATE_RANGES.THIS_WEEK]: 'This Week',
	[DATE_RANGES.THIS_MONTH]: 'This Month',
	[DATE_RANGES.THIS_QUARTER]: 'This Quarter',
	[DATE_RANGES.THIS_YEAR]: 'This Year',
	[DATE_RANGES.ALL_TIME]: 'All Time',
	[DATE_RANGES.CUSTOM]: 'Custom',
} as const

// ============================================
// Notification Types
// ============================================

export const NOTIFICATION_TYPES = {
	INFO: 'info',
	SUCCESS: 'success',
	WARNING: 'warning',
	ERROR: 'error',
} as const

// ============================================
// Theme
// ============================================

export const THEMES = {
	LIGHT: 'light',
	DARK: 'dark',
	AUTO: 'auto',
} as const

// ============================================
// Languages
// ============================================

export const LANGUAGES = {
	EN: 'en',
	KO: 'ko',
} as const

export const LANGUAGE_LABELS = {
	[LANGUAGES.EN]: 'English',
	[LANGUAGES.KO]: '한국어',
} as const

// ============================================
// Currencies
// ============================================

export const CURRENCIES = {
	USD: 'USD',
	KRW: 'KRW',
	EUR: 'EUR',
	JPY: 'JPY',
	CNY: 'CNY',
} as const

export const CURRENCY_SYMBOLS = {
	[CURRENCIES.USD]: '$',
	[CURRENCIES.KRW]: '₩',
	[CURRENCIES.EUR]: '€',
	[CURRENCIES.JPY]: '¥',
	[CURRENCIES.CNY]: '¥',
} as const

// ============================================
// Regex Patterns
// ============================================

export const REGEX_PATTERNS = {
	EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
	PHONE: /^[0-9]{10,11}$/,
	URL: /^https?:\/\/.+/,
	PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
} as const

// ============================================
// Error Messages
// ============================================

export const ERROR_MESSAGES = {
	REQUIRED_FIELD: 'This field is required',
	INVALID_EMAIL: 'Please enter a valid email address',
	INVALID_PHONE: 'Please enter a valid phone number',
	INVALID_URL: 'Please enter a valid URL',
	WEAK_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
	FILE_TOO_LARGE: 'File size exceeds the maximum limit',
	INVALID_FILE_TYPE: 'Invalid file type',
	NETWORK_ERROR: 'Network error. Please check your connection',
	SERVER_ERROR: 'Server error. Please try again later',
	UNAUTHORIZED: 'You are not authorized to perform this action',
	NOT_FOUND: 'The requested resource was not found',
} as const

