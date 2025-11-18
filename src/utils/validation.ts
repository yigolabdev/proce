/**
 * Validation Utilities
 * 
 * Common validation functions for forms and data.
 */

/**
 * Email validation
 */
export function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return emailRegex.test(email)
}

/**
 * Check if string is empty or whitespace
 */
export function isEmpty(value: string): boolean {
	return !value || value.trim().length === 0
}

/**
 * Check if value is within range
 */
export function isInRange(value: number, min: number, max: number): boolean {
	return value >= min && value <= max
}

/**
 * Validate required field
 */
export function validateRequired(value: string, fieldName: string): string | null {
	if (isEmpty(value)) {
		return `${fieldName} is required`
	}
	return null
}

/**
 * Validate minimum length
 */
export function validateMinLength(value: string, minLength: number, fieldName: string): string | null {
	if (value.length < minLength) {
		return `${fieldName} must be at least ${minLength} characters`
	}
	return null
}

/**
 * Validate maximum length
 */
export function validateMaxLength(value: string, maxLength: number, fieldName: string): string | null {
	if (value.length > maxLength) {
		return `${fieldName} must be no more than ${maxLength} characters`
	}
	return null
}

/**
 * Validate date range
 */
export function validateDateRange(startDate: Date, endDate: Date): string | null {
	if (startDate > endDate) {
		return 'Start date must be before end date'
	}
	return null
}

/**
 * Validate file size (in bytes)
 */
export function validateFileSize(file: File, maxSize: number): string | null {
	if (file.size > maxSize) {
		const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2)
		return `File size must be less than ${maxSizeMB}MB`
	}
	return null
}

/**
 * Validate file type
 */
export function validateFileType(file: File, allowedTypes: string[]): string | null {
	if (!allowedTypes.includes(file.type)) {
		return `File type must be one of: ${allowedTypes.join(', ')}`
	}
	return null
}
