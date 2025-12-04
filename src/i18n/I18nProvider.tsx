import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { translations } from './index'

export type Locale = 'en' | 'ko'

type Dictionary = Record<string, any>

interface I18nContextValue {
	locale: Locale
	setLocale: (locale: Locale) => void
	// t: supports dotted keys (e.g., errors.invalidEmail) and interpolation
	t: (key: string, params?: Record<string, string | number>) => string
	language: Locale // alias for locale for consistency
	formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string
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

	const t = useCallback((key: string, params?: Record<string, string | number>) => {
		const path = key.split('.')
		
		// Try current locale
		// @ts-ignore - dynamic access
		let current: any = translations[locale]
		for (const p of path) {
			if (current === undefined) break
			current = current[p]
		}

		// Fallback to English if not found and current is not English
		if (current === undefined && locale !== 'en') {
			// @ts-ignore
			current = translations['en']
			for (const p of path) {
				if (current === undefined) break
				current = current[p]
			}
		}

		let text = typeof current === 'string' ? current : key

		// Interpolation: Replace {param} with value
		if (params && text) {
			Object.entries(params).forEach(([k, v]) => {
				text = text.replace(new RegExp(`{${k}}`, 'g'), String(v))
			})
		}

		return text
	}, [locale])

	const formatDate = useCallback((date: Date | string | number, options?: Intl.DateTimeFormatOptions) => {
		const d = new Date(date)
		return d.toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', options)
	}, [locale])

	const value = useMemo(() => ({ 
		locale, 
		setLocale, 
		t, 
		language: locale,
		formatDate 
	}), [locale, setLocale, t, formatDate])

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
