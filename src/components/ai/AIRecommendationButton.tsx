/**
 * AI Recommendation Button Component
 * Reusable button with badge indicator for AI recommendations
 */

import { useState, useCallback, memo } from 'react'
import { Button } from '../ui/Button'
import { Sparkles, Loader2 } from 'lucide-react'
import type { AIFeatureType } from '../../services/ai/aiRecommendationManager'

const BADGE_MAX = 9 as const

const DEFAULT_LABELS: Record<AIFeatureType, string> = {
	tasks: 'AI Task Recommendations',
	okr: 'AI OKR Recommendations',
	projects: 'AI Project Analysis',
} as const

export interface AIRecommendationButtonProps {
	type: AIFeatureType
	onGenerate: () => Promise<void>
	badge?: number
	variant?: 'primary' | 'secondary' | 'outline'
	size?: 'sm' | 'md' | 'lg'
	className?: string
	label?: string
	showBadge?: boolean
	disabled?: boolean
}

/**
 * AI Recommendation Button with loading state and badge indicator
 */
export const AIRecommendationButton = memo(function AIRecommendationButton({
	type,
	onGenerate,
	badge = 0,
	variant = 'outline',
	size = 'md',
	className = '',
	label,
	showBadge = true,
	disabled = false,
}: AIRecommendationButtonProps) {
	const [isGenerating, setIsGenerating] = useState(false)

	const displayLabel = label ?? DEFAULT_LABELS[type]
	const buttonLabel = isGenerating ? 'Generating...' : displayLabel
	const shouldShowBadge = showBadge && badge > 0 && !isGenerating
	const badgeText = badge > BADGE_MAX ? `${BADGE_MAX}+` : String(badge)

	const handleClick = useCallback(async () => {
		if (isGenerating || disabled) return

		setIsGenerating(true)
		try {
			await onGenerate()
		} catch (error) {
			console.error('Failed to generate AI recommendations:', error)
		} finally {
			setIsGenerating(false)
		}
	}, [onGenerate, isGenerating, disabled])

	return (
		<div className="relative inline-block">
			<Button
				variant={variant}
				size={size}
				onClick={handleClick}
				disabled={isGenerating || disabled}
				className={`gap-2 ${className}`}
				aria-label={`${displayLabel}${shouldShowBadge ? ` (${badge} new)` : ''}`}
			>
				{isGenerating ? (
					<Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
				) : (
					<Sparkles className="h-4 w-4" aria-hidden="true" />
				)}
				<span>{buttonLabel}</span>
			</Button>

			{shouldShowBadge && (
				<span
					className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-semibold text-white shadow-lg"
					aria-label={`${badge} new recommendations`}
				>
					{badgeText}
				</span>
			)}
		</div>
	)
})


