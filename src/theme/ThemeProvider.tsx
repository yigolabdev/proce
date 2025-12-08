import type { PropsWithChildren } from 'react'
import { createContext, useContext, useEffect } from 'react'

type Theme = 'dark'

interface ThemeContextValue {
	theme: Theme
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: PropsWithChildren) {
	useEffect(() => {
		// 항상 다크모드 적용
		document.documentElement.classList.add('dark')
	}, [])

	const value = { theme: 'dark' as Theme }

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
	const ctx = useContext(ThemeContext)
	if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
	return ctx
}
