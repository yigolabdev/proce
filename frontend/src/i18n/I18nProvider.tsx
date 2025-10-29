import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type Locale = 'en' | 'ko'

type Dictionary = Record<string, any>

interface I18nContextValue {
	locale: Locale
	setLocale: (locale: Locale) => void
	// naive t: supports dotted keys (e.g., errors.invalidEmail)
	t: (dict: Dictionary) => (key: string) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

const LOCALE_KEY = 'proce:locale'

export function I18nProvider({ children }: PropsWithChildren) {
	const [locale, setLocaleState] = useState<Locale>('ko')

	useEffect(() => {
		const saved = window.localStorage.getItem(LOCALE_KEY) as Locale | null
		if (saved === 'en' || saved === 'ko') setLocaleState(saved)
	}, [])

	const setLocale = useCallback((next: Locale) => {
		setLocaleState(next)
		try {
			window.localStorage.setItem(LOCALE_KEY, next)
		} catch {}
	}, [])

	const t = useCallback((dict: Dictionary) => {
		return (key: string) => {
			const path = key.split('.')
			let current: any = dict[locale]
			for (const p of path) current = current?.[p]
			return typeof current === 'string' ? current : key
		}
	}, [locale])

	const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t])

	return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
	const ctx = useContext(I18nContext)
	if (!ctx) throw new Error('useI18n must be used within I18nProvider')
	return ctx
}

export function useLocale() {
	const ctx = useContext(I18nContext)
	if (!ctx) throw new Error('useLocale must be used within I18nProvider')
	return { locale: ctx.locale, setLocale: ctx.setLocale }
}
