export type UserRole = 'user' | 'admin' | 'executive'

export interface User {
	id: string
	email: string
	name: string
	role: UserRole
	department?: string
	position?: string
	jobs?: string[] // Multiple jobs support
	avatar?: string
}

export interface AuthState {
	user: User | null
	isAuthenticated: boolean
}

