/**
 * WorkEntry Validators
 * 
 * API 응답 및 사용자 입력 검증
 */

import type { WorkEntry, CreateWorkEntryDto } from '../../types/common.types'

/**
 * WorkEntry 필수 필드 검증
 */
export function validateWorkEntry(entry: Partial<WorkEntry>): string[] {
	const errors: string[] = []
	
	if (!entry.title || entry.title.trim() === '') {
		errors.push('Title is required')
	}
	
	if (!entry.description || entry.description.trim() === '') {
		errors.push('Description is required')
	}
	
	if (!entry.category || entry.category.trim() === '') {
		errors.push('Category is required')
	}
	
	if (!entry.date) {
		errors.push('Date is required')
	}
	
	if (!entry.duration || entry.duration.trim() === '') {
		errors.push('Duration is required')
	}
	
	// Validate duration format (e.g., "2h", "1.5h", "30m")
	if (entry.duration && !/^\d+\.?\d*[hm]$/.test(entry.duration)) {
		errors.push('Duration must be in format like "2h" or "30m"')
	}
	
	return errors
}

/**
 * CreateWorkEntryDto 검증
 */
export function validateCreateWorkEntryDto(dto: CreateWorkEntryDto): string[] {
	return validateWorkEntry(dto as any)
}

/**
 * WorkEntry가 유효한지 확인
 */
export function isValidWorkEntry(entry: Partial<WorkEntry>): boolean {
	return validateWorkEntry(entry).length === 0
}

/**
 * WorkEntry 생성 전 정리 (sanitization)
 */
export function sanitizeWorkEntry(entry: Partial<WorkEntry>): Partial<WorkEntry> {
	return {
		...entry,
		title: entry.title?.trim(),
		description: entry.description?.trim(),
		category: entry.category?.trim(),
		duration: entry.duration?.trim(),
		tags: entry.tags?.map(t => t.trim()).filter(Boolean) || [],
	}
}

