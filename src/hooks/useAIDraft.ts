/**
 * useAIDraft Hook
 * AI 드래프트 생성 상태 및 로직 관리
 */

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import type { AIDraft } from '../types/workInput.types'

export interface UseAIDraftReturn {
	draft: AIDraft
	isGenerating: boolean
	updateDraft: (updates: Partial<AIDraft>) => void
	generateDraft: () => Promise<void>
	applyDraft: (onApply: (content: AIDraft['generatedContent']) => void) => void
	clearDraft: () => void
}

const INITIAL_DRAFT: AIDraft = {
	prompt: '',
	keywords: [],
	tone: 'professional',
	content: '',
}

export function useAIDraft(initialDraft?: Partial<AIDraft>): UseAIDraftReturn {
	const [draft, setDraft] = useState<AIDraft>({
		...INITIAL_DRAFT,
		...initialDraft,
	})
	const [isGenerating, setIsGenerating] = useState(false)

	const updateDraft = useCallback((updates: Partial<AIDraft>) => {
		setDraft((prev) => ({ ...prev, ...updates }))
	}, [])

	const generateDraft = useCallback(async () => {
		if (!draft.prompt?.trim()) {
			toast.error('Please enter a prompt')
			return
		}

		setIsGenerating(true)
		try {
			// Simulate AI generation
			await new Promise((resolve) => setTimeout(resolve, 2000))

			const generatedContent = {
				title: `[${draft.tone}] ${draft.prompt.substring(0, 50)}`,
				description: `Generated content for: "${draft.prompt}"\n\nTone: ${draft.tone}\nKeywords: ${Array.isArray(draft.keywords) ? draft.keywords.join(', ') : ''}`,
				category: 'development',
				tags: Array.isArray(draft.keywords) ? draft.keywords : [],
			}

			setDraft((prev) => ({
				...prev,
				generatedContent,
			}))

			toast.success('AI draft generated successfully!')
		} catch (error) {
			console.error('Failed to generate AI draft:', error)
			toast.error('Failed to generate AI draft')
		} finally {
			setIsGenerating(false)
		}
	}, [draft.prompt, draft.tone, draft.keywords])

	const applyDraft = useCallback((onApply: (content: AIDraft['generatedContent']) => void) => {
		if (draft.generatedContent) {
			onApply(draft.generatedContent)
			toast.success('Draft applied successfully!')
		}
	}, [draft.generatedContent])

	const clearDraft = useCallback(() => {
		setDraft(INITIAL_DRAFT)
	}, [])

	return {
		draft,
		isGenerating,
		updateDraft,
		generateDraft,
		applyDraft,
		clearDraft,
	}
}
