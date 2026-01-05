/**
 * Password Validation Utility
 *
 * Provides password strength validation and requirement checking.
 */

export interface PasswordRequirements {
	minLength: boolean
	hasUppercase: boolean
	hasNumber: boolean
	hasSpecialChar: boolean
}

/**
 * Validate password against requirements
 *
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter (A-Z)
 * - At least one number (0-9)
 * - At least one special character (!@#$%^&*(),.?":{}|<> etc.)
 */
export function validatePassword(password: string): PasswordRequirements {
	return {
		minLength: password.length >= 8,
		hasUppercase: /[A-Z]/.test(password),
		hasNumber: /\d/.test(password),
		hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
	}
}

/**
 * Check if password meets all requirements
 */
export function isPasswordValid(password: string): boolean {
	const requirements = validatePassword(password)
	return Object.values(requirements).every(Boolean)
}

/**
 * Get password strength level
 *
 * @returns 'weak' | 'medium' | 'strong'
 */
export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
	const requirements = validatePassword(password)
	const metCount = Object.values(requirements).filter(Boolean).length

	if (metCount <= 1) return 'weak'
	if (metCount <= 2) return 'medium'
	return 'strong'
}

/**
 * Get password strength color
 */
export function getPasswordStrengthColor(strength: string): string {
	switch (strength) {
		case 'weak':
			return 'text-red-500'
		case 'medium':
			return 'text-yellow-500'
		case 'strong':
			return 'text-green-500'
		default:
			return 'text-neutral-500'
	}
}

/**
 * Get human-readable requirement message
 */
export function getRequirementMessage(requirement: keyof PasswordRequirements): string {
	const messages: Record<keyof PasswordRequirements, string> = {
		minLength: '최소 8자 이상',
		hasUppercase: '대문자 1개 이상',
		hasNumber: '숫자 1개 이상',
		hasSpecialChar: '특수문자 1개 이상 (!@#$%^&* 등)',
	}
	return messages[requirement]
}
