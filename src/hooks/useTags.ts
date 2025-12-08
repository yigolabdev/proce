/**
 * useTags Hook
 * 태그 관리
 */

import { useState, useCallback, useEffect } from 'react'
import { storage } from '../utils/storage'
import { toast } from 'sonner'
import type { UseTagsReturn } from '../types/workInput.types'

export function useTags(initialTags: string[] = []): UseTagsReturn {
	const [tags, setTags] = useState<string[]>(initialTags)
	const [tagInput, setTagInput] = useState('')
	const [suggestions, setSuggestions] = useState<string[]>([])

	// Load tag suggestions from storage
	useEffect(() => {
		try {
			const allWorkEntries = storage.get<any[]>('workEntries', [])
			const allTags = new Set<string>()

			allWorkEntries.forEach(entry => {
				if (entry.tags && Array.isArray(entry.tags)) {
					entry.tags.forEach((tag: string) => allTags.add(tag))
				}
			})

			setSuggestions(Array.from(allTags))
		} catch (error) {
			console.error('Failed to load tag suggestions:', error)
		}
	}, [])

	/**
	 * Add tag
	 */
	const addTag = useCallback((tag: string) => {
		const trimmedTag = tag.trim().toLowerCase()

		if (!trimmedTag) {
			return
		}

		if (tags.includes(trimmedTag)) {
			toast.error('Tag already exists')
			return
		}

		if (tags.length >= 10) {
			toast.error('Maximum 10 tags allowed')
			return
		}

		setTags(prev => [...prev, trimmedTag])
		setTagInput('')
		toast.success('Tag added')
	}, [tags])

	/**
	 * Remove tag
	 */
	const removeTag = useCallback((tag: string) => {
		setTags(prev => prev.filter(t => t !== tag))
		toast.success('Tag removed')
	}, [])

	/**
	 * Clear all tags
	 */
	const clearTags = useCallback(() => {
		setTags([])
		setTagInput('')
		toast.success('All tags removed')
	}, [])

	/**
	 * Handle tag input key press
	 */
	const handleTagInputKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' || e.key === ',') {
			e.preventDefault()
			addTag(tagInput)
		}
	}, [tagInput, addTag])

	/**
	 * Get filtered suggestions
	 */
	const getFilteredSuggestions = useCallback((): string[] => {
		if (!tagInput) return []

		return suggestions
			.filter(s => 
				s.toLowerCase().includes(tagInput.toLowerCase()) && 
				!tags.includes(s)
			)
			.slice(0, 5)
	}, [tagInput, suggestions, tags])

	return {
		tags,
		tagInput,
		setTagInput,
		addTag,
		removeTag,
		clearTags,
		handleTagInputKeyPress,
		suggestions: getFilteredSuggestions(),
	}
}

