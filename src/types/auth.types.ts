export type UserRole = 'worker' | 'admin' | 'executive'

export interface User {
	id: string
	email: string
	name: string
	role: UserRole
	department?: string
	position?: string
	avatar?: string
}

export interface AuthState {
	user: User | null
	isAuthenticated: boolean
}

