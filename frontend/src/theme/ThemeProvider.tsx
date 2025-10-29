import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
	theme: Theme
	setTheme: (t: Theme) => void
	toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const THEME_KEY = 'proce:theme'

export function ThemeProvider({ children }: PropsWithChildren) {
	const [theme, setThemeState] = useState<Theme>('light')

	useEffect(() => {
		const saved = window.localStorage.getItem(THEME_KEY) as Theme | null
		const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
		const initial: Theme = saved ?? (prefersDark ? 'dark' : 'light')
		applyTheme(initial)
		setThemeState(initial)
	}, [])

	const applyTheme = (t: Theme) => {
		const root = document.documentElement
		if (t === 'dark') root.classList.add('dark')
		else root.classList.remove('dark')
	}

	const setTheme = useCallback((t: Theme) => {
		applyTheme(t)
		setThemeState(t)
		try {
			window.localStorage.setItem(THEME_KEY, t)
		} catch {}
	}, [])

	const toggle = useCallback(() => {
		setTheme(theme === 'dark' ? 'light' : 'dark')
	}, [setTheme, theme])

	const value = useMemo(() => ({ theme, setTheme, toggle }), [theme, setTheme, toggle])

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
	const ctx = useContext(ThemeContext)
	if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
	return ctx
}
