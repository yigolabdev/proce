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
	applyDraft: (onApply: (content: string) => void) => void
	clearDraft: () => void
}

const INITIAL_DRAFT: AIDraft = {
	prompt: '',
	keywords: '',
	tone: 'professional',
	generatedContent: '',
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
			// Simulate AI generation (replace with actual API call)
			await new Promise((resolve) => setTimeout(resolve, 2000))

			// Mock AI response based on prompt
			const mockContent = generateMockContent(draft)

			setDraft((prev) => ({
				...prev,
				generatedContent: mockContent,
			}))

			toast.success('Draft generated successfully!')
		} catch (error) {
			console.error('Failed to generate draft:', error)
			toast.error('Failed to generate draft. Please try again.')
		} finally {
			setIsGenerating(false)
		}
	}, [draft])

	const applyDraft = useCallback(
		(onApply: (content: string) => void) => {
			if (!draft.generatedContent) {
				toast.error('No draft to apply')
				return
			}

			onApply(draft.generatedContent)
			toast.success('Draft applied to description')
		},
		[draft.generatedContent]
	)

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

/**
 * Generate mock AI content based on prompt
 * TODO: Replace with actual AI API integration
 */
function generateMockContent(draft: AIDraft): string {
	const { prompt, keywords, tone } = draft

	let content = ''

	// Generate based on tone
	switch (tone) {
		case 'professional':
			content = `I have successfully completed work on ${prompt}. `
			if (keywords) {
				content += `This involved ${keywords}. `
			}
			content += `The implementation was thorough and meets all requirements. Key outcomes include improved system performance and enhanced user experience.`
			break

		case 'casual':
			content = `Worked on ${prompt} today. `
			if (keywords) {
				content += `Focused mainly on ${keywords}. `
			}
			content += `Everything went smoothly and the results look good!`
			break

		case 'detailed':
			content = `Completed comprehensive work on ${prompt}.\n\n`
			content += `**Activities:**\n`
			content += `- Analyzed requirements and existing implementation\n`
			content += `- Developed and tested solution\n`
			if (keywords) {
				content += `- Applied best practices in ${keywords}\n`
			}
			content += `- Validated results and documented changes\n\n`
			content += `**Outcomes:**\n`
			content += `- Enhanced functionality and reliability\n`
			content += `- Improved code quality and maintainability\n`
			content += `- Met all acceptance criteria`
			break

		case 'concise':
			content = `Completed: ${prompt}`
			if (keywords) {
				content += ` (${keywords})`
			}
			content += `. Tested and verified.`
			break

		default:
			content = prompt
	}

	return content
}

