import { createContext, useContext, useState, useMemo, useCallback, type ReactNode } from 'react'
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
		role: 'user', // 기본값: user, admin, executive로 변경 가능
		department: '개발팀',
		position: '시니어 개발자',
		},
		isAuthenticated: true,
	})

	const login = useCallback((user: User) => {
		setAuthState({ user, isAuthenticated: true })
	}, [])

	const logout = useCallback(() => {
		setAuthState({ user: null, isAuthenticated: false })
	}, [])

	const updateUser = useCallback((updates: Partial<User>) => {
		setAuthState((prevState) => {
			if (!prevState.user) return prevState
			return {
				...prevState,
				user: { ...prevState.user, ...updates },
			}
		})
	}, [])

	// Memoize context value to prevent unnecessary re-renders
	const value = useMemo(
		() => ({ ...authState, login, logout, updateUser }),
		[authState, login, logout, updateUser]
	)

	return (
		<AuthContext.Provider value={value}>
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

