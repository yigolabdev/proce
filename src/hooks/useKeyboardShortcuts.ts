import { useEffect } from 'react'

export interface KeyboardShortcuts {
	// New actions
	newWork?: () => void
	newObjective?: () => void
	newProject?: () => void
	
	// Navigation
	focusSearch?: () => void
	goToDashboard?: () => void
	goToInput?: () => void
	
	// Actions
	save?: () => void
	cancel?: () => void
	submit?: () => void
	
	// Other
	toggleTheme?: () => void
	openHelp?: () => void
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcuts, enabled = true) {
	useEffect(() => {
		if (!enabled) return

		const handleKeyDown = (e: KeyboardEvent) => {
			const key = e.key.toLowerCase()
			const modifier = e.metaKey || e.ctrlKey
			const shift = e.shiftKey
			const alt = e.altKey

			// Don't trigger if user is typing in an input
			const target = e.target as HTMLElement
			if (
				target.tagName === 'INPUT' ||
				target.tagName === 'TEXTAREA' ||
				target.isContentEditable
			) {
				// Only allow Cmd+S in inputs
				if (key === 's' && modifier) {
					e.preventDefault()
					shortcuts.save?.()
				}
				return
			}

			// N - New work entry
			if (key === 'n' && !modifier && !shift && !alt) {
				e.preventDefault()
				shortcuts.newWork?.()
			}

			// O - New objective
			if (key === 'o' && !modifier && !shift && !alt) {
				e.preventDefault()
				shortcuts.newObjective?.()
			}

			// P - New project
			if (key === 'p' && !modifier && !shift && !alt) {
				e.preventDefault()
				shortcuts.newProject?.()
			}

			// / - Focus search
			if (key === '/' && !modifier && !shift && !alt) {
				e.preventDefault()
				shortcuts.focusSearch?.()
			}

			// Cmd+K or Ctrl+K - Focus search (alternative)
			if (key === 'k' && modifier && !shift && !alt) {
				e.preventDefault()
				shortcuts.focusSearch?.()
			}

			// D - Go to dashboard
			if (key === 'd' && !modifier && !shift && !alt) {
				e.preventDefault()
				shortcuts.goToDashboard?.()
			}

			// I - Go to input
			if (key === 'i' && !modifier && !shift && !alt) {
				e.preventDefault()
				shortcuts.goToInput?.()
			}

			// Cmd+S or Ctrl+S - Save
			if (key === 's' && modifier && !shift && !alt) {
				e.preventDefault()
				shortcuts.save?.()
			}

			// Escape - Cancel
			if (key === 'escape' && !modifier && !shift && !alt) {
				e.preventDefault()
				shortcuts.cancel?.()
			}

			// Cmd+Enter or Ctrl+Enter - Submit
			if (key === 'enter' && modifier && !shift && !alt) {
				e.preventDefault()
				shortcuts.submit?.()
			}

			// Cmd+Shift+T or Ctrl+Shift+T - Toggle theme
			if (key === 't' && modifier && shift && !alt) {
				e.preventDefault()
				shortcuts.toggleTheme?.()
			}

			// ? - Open help
			if (key === '?' && !modifier && !alt) {
				e.preventDefault()
				shortcuts.openHelp?.()
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [shortcuts, enabled])
}

// Hook to show keyboard shortcuts help
export function useKeyboardShortcutsHelp() {
	const shortcuts = [
		{ key: 'N', description: 'New work entry' },
		{ key: 'O', description: 'New objective' },
		{ key: 'P', description: 'New project' },
		{ key: '/', description: 'Focus search' },
		{ key: 'Cmd/Ctrl + K', description: 'Focus search' },
		{ key: 'D', description: 'Go to dashboard' },
		{ key: 'I', description: 'Go to input' },
		{ key: 'Cmd/Ctrl + S', description: 'Save' },
		{ key: 'Esc', description: 'Cancel / Close' },
		{ key: 'Cmd/Ctrl + Enter', description: 'Submit' },
		{ key: 'Cmd/Ctrl + Shift + T', description: 'Toggle theme' },
		{ key: '?', description: 'Show shortcuts' },
	]

	return shortcuts
}

export default useKeyboardShortcuts

