/**
 * AI Work Evaluator
 * Evaluates work entries and provides AI-powered feedback
 */

interface WorkEntry {
	id: string
	title: string
	description: string
	category: string
	duration: string
	tags?: string[]
	files?: Array<{ id: string; name: string; size: number; type: string }>
	links?: Array<{ id: string; url: string; title: string }>
}

export interface AIEvaluation {
	overallScore: number // 0-100
	quality: {
		score: number // 0-100
		feedback: string
		strengths: string[]
		improvements: string[]
	}
	completeness: {
		score: number // 0-100
		feedback: string
		missingItems: string[]
	}
	documentation: {
		score: number // 0-100
		feedback: string
	}
	recommendations: string[]
	estimatedReviewTime: string
	suggestedAction: 'approve' | 'request_changes' | 'needs_discussion'
	aiConfidence: number // 0-100
}

/**
 * Generate AI evaluation for a work entry
 */
export function evaluateWorkEntry(entry: WorkEntry): AIEvaluation {
	// Calculate quality score based on description length and detail
	const descriptionLength = entry.description.length
	const hasFiles = entry.files && entry.files.length > 0
	const hasLinks = entry.links && entry.links.length > 0
	const hasTags = entry.tags && entry.tags.length > 0

	// Quality Assessment
	const qualityScore = calculateQualityScore(entry)
	const qualityStrengths: string[] = []
	const qualityImprovements: string[] = []

	if (descriptionLength > 200) {
		qualityStrengths.push('Detailed description provided')
	} else if (descriptionLength < 50) {
		qualityImprovements.push('Description is too brief - add more details about what was accomplished')
	}

	if (hasFiles) {
		qualityStrengths.push(`${entry.files!.length} supporting file(s) attached`)
	} else {
		qualityImprovements.push('Consider adding screenshots, documents, or other supporting files')
	}

	if (hasLinks) {
		qualityStrengths.push(`${entry.links!.length} reference link(s) included`)
	}

	if (hasTags) {
		qualityStrengths.push('Properly tagged for easy categorization')
	} else {
		qualityImprovements.push('Add relevant tags for better organization')
	}

	// Check for code-related patterns
	const hasCodePatterns = /```|`[^`]+`|function|class|const|let|var|import|export/i.test(
		entry.description
	)
	if (entry.category === 'development' && hasCodePatterns) {
		qualityStrengths.push('Includes code snippets or technical details')
	}

	// Check for bullet points or structured content
	const hasStructure =
		entry.description.includes('•') ||
		entry.description.includes('✓') ||
		entry.description.includes('-') ||
		entry.description.includes('1.') ||
		entry.description.includes('\n\n')
	if (hasStructure) {
		qualityStrengths.push('Well-structured and organized content')
	}

	// Completeness Assessment
	const completenessScore = calculateCompletenessScore(entry)
	const missingItems: string[] = []

	if (!hasFiles && entry.category === 'development') {
		missingItems.push('Code screenshots or architecture diagrams')
	}
	if (!hasLinks && (entry.category === 'research' || entry.category === 'documentation')) {
		missingItems.push('Reference links or sources')
	}
	if (entry.duration && parseDuration(entry.duration) > 240 && descriptionLength < 100) {
		// More than 4 hours but short description
		missingItems.push('More detailed breakdown of time spent (task took ' + entry.duration + ')')
	}

	// Documentation Assessment
	const documentationScore = calculateDocumentationScore(entry)
	let documentationFeedback = ''

	if (documentationScore >= 80) {
		documentationFeedback = 'Excellent documentation with clear explanations and supporting materials'
	} else if (documentationScore >= 60) {
		documentationFeedback = 'Good documentation, but could benefit from more details or examples'
	} else {
		documentationFeedback = 'Documentation needs improvement - add more context and supporting information'
	}

	// Generate recommendations
	const recommendations: string[] = []

	if (qualityScore < 70) {
		recommendations.push('Enhance the description with more specific details about the work performed')
	}
	if (completenessScore < 70) {
		recommendations.push('Add missing supporting materials (files, links, or references)')
	}
	if (entry.category === 'development' && !hasLinks) {
		recommendations.push('Include links to pull requests, commits, or deployment details')
	}
	if (entry.category === 'meeting' && descriptionLength < 100) {
		recommendations.push('Add meeting notes, decisions made, and action items')
	}
	if (parseDuration(entry.duration) > 480) {
		// More than 8 hours
		recommendations.push('Consider breaking down large tasks into smaller, more manageable work entries')
	}

	// Calculate overall score (weighted average)
	const overallScore = Math.round(qualityScore * 0.4 + completenessScore * 0.3 + documentationScore * 0.3)

	// Determine suggested action
	let suggestedAction: 'approve' | 'request_changes' | 'needs_discussion'
	if (overallScore >= 75) {
		suggestedAction = 'approve'
	} else if (overallScore >= 50) {
		suggestedAction = 'request_changes'
	} else {
		suggestedAction = 'needs_discussion'
	}

	// Estimate review time based on complexity
	const reviewMinutes = Math.max(5, Math.ceil((descriptionLength / 100) * 3 + (hasFiles ? 5 : 0)))
	const estimatedReviewTime = `${reviewMinutes} min`

	// AI confidence based on available data
	const dataPoints =
		(descriptionLength > 100 ? 25 : 10) +
		(hasFiles ? 20 : 0) +
		(hasLinks ? 20 : 0) +
		(hasTags ? 15 : 0) +
		(hasStructure ? 20 : 0)
	const aiConfidence = Math.min(95, dataPoints)

	return {
		overallScore,
		quality: {
			score: qualityScore,
			feedback:
				qualityScore >= 80
					? 'High-quality work submission with comprehensive details'
					: qualityScore >= 60
					? 'Good quality submission with room for improvement'
					: 'Work submission needs more detail and clarity',
			strengths: qualityStrengths,
			improvements: qualityImprovements,
		},
		completeness: {
			score: completenessScore,
			feedback:
				completenessScore >= 80
					? 'All necessary information and materials provided'
					: completenessScore >= 60
					? 'Most information provided, some items missing'
					: 'Several important items missing from submission',
			missingItems,
		},
		documentation: {
			score: documentationScore,
			feedback: documentationFeedback,
		},
		recommendations,
		estimatedReviewTime,
		suggestedAction,
		aiConfidence,
	}
}

function calculateQualityScore(entry: WorkEntry): number {
	let score = 40 // Base score

	const descLength = entry.description.length
	if (descLength > 300) score += 30
	else if (descLength > 150) score += 20
	else if (descLength > 50) score += 10

	if (entry.files && entry.files.length > 0) score += 15
	if (entry.links && entry.links.length > 0) score += 10
	if (entry.tags && entry.tags.length > 0) score += 5

	return Math.min(100, score)
}

function calculateCompletenessScore(entry: WorkEntry): number {
	let score = 50 // Base score

	if (entry.description.length > 100) score += 20
	if (entry.files && entry.files.length > 0) score += 15
	if (entry.links && entry.links.length > 0) score += 10
	if (entry.tags && entry.tags.length > 0) score += 5

	return Math.min(100, score)
}

function calculateDocumentationScore(entry: WorkEntry): number {
	let score = 30 // Base score

	const hasStructure =
		entry.description.includes('•') ||
		entry.description.includes('✓') ||
		entry.description.includes('-') ||
		entry.description.includes('\n\n')

	if (entry.description.length > 200) score += 25
	else if (entry.description.length > 100) score += 15

	if (hasStructure) score += 20
	if (entry.files && entry.files.length > 0) score += 15
	if (entry.links && entry.links.length > 0) score += 10

	return Math.min(100, score)
}

function parseDuration(duration: string): number {
	// Parse duration string like "2h 30m" to minutes
	const hours = duration.match(/(\d+)h/)
	const minutes = duration.match(/(\d+)m/)

	let totalMinutes = 0
	if (hours) totalMinutes += parseInt(hours[1]) * 60
	if (minutes) totalMinutes += parseInt(minutes[1])

	return totalMinutes
}

