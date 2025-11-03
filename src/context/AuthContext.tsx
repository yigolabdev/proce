import { createContext, useContext, useState, type ReactNode } from 'react'
import type { User, AuthState } from '../types/auth.types'

interface AuthContextValue extends AuthState {
	login: (user: User) => void
	logout: () => void
	updateUser: (user: Partial<User>) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
	// Mock user - 실제로는 로그인 시 설정됨
	const [authState, setAuthState] = useState<AuthState>({
		user: {
			id: '1',
			email: 'user@example.com',
			name: '홍길동',
			role: 'worker', // 기본값: worker, admin, executive로 변경 가능
			department: '개발팀',
			position: '시니어 개발자',
		},
		isAuthenticated: true,
	})

	const login = (user: User) => {
		setAuthState({ user, isAuthenticated: true })
	}

	const logout = () => {
		setAuthState({ user: null, isAuthenticated: false })
	}

	const updateUser = (updates: Partial<User>) => {
		if (authState.user) {
			setAuthState({
				...authState,
				user: { ...authState.user, ...updates },
			})
		}
	}

	return (
		<AuthContext.Provider value={{ ...authState, login, logout, updateUser }}>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth must be used within AuthProvider')
	}
	return context
}

