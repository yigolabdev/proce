/**
 * useToggle Hook
 * 
 * 불리언 상태를 쉽게 토글할 수 있는 커스텀 훅
 */

import { useState, useCallback } from 'react'

export function useToggle(
	initialValue: boolean = false
): [boolean, () => void, (value: boolean) => void] {
	const [value, setValue] = useState(initialValue)

	const toggle = useCallback(() => {
		setValue((v) => !v)
	}, [])

	const setExplicit = useCallback((newValue: boolean) => {
		setValue(newValue)
	}, [])

	return [value, toggle, setExplicit]
}

