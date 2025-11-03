/**
 * Validation Utilities
 * 
 * 데이터 유효성 검증을 위한 유틸리티 함수들
 */

/**
 * 이메일 유효성 검증
 */
export const isValidEmail = (email: string): boolean => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return emailRegex.test(email)
}

/**
 * 비밀번호 강도 검증
 */
export const validatePassword = (password: string): {
	isValid: boolean
	errors: string[]
	strength: 'weak' | 'medium' | 'strong'
} => {
	const errors: string[] = []
	let strength: 'weak' | 'medium' | 'strong' = 'weak'
	
	if (password.length < 8) {
		errors.push('Password must be at least 8 characters long')
	}
	if (!/[A-Z]/.test(password)) {
		errors.push('Password must contain at least one uppercase letter')
	}
	if (!/[a-z]/.test(password)) {
		errors.push('Password must contain at least one lowercase letter')
	}
	if (!/[0-9]/.test(password)) {
		errors.push('Password must contain at least one number')
	}
	if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
		errors.push('Password must contain at least one special character')
	}
	
	// 강도 계산
	const hasLength = password.length >= 8
	const hasUpper = /[A-Z]/.test(password)
	const hasLower = /[a-z]/.test(password)
	const hasNumber = /[0-9]/.test(password)
	const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
	
	const criteriaCount = [hasLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length
	
	if (criteriaCount >= 5) strength = 'strong'
	else if (criteriaCount >= 3) strength = 'medium'
	
	return {
		isValid: errors.length === 0,
		errors,
		strength,
	}
}

/**
 * 전화번호 유효성 검증
 */
export const isValidPhoneNumber = (phone: string): boolean => {
	const cleaned = phone.replace(/\D/g, '')
	return cleaned.length >= 10 && cleaned.length <= 11
}

/**
 * URL 유효성 검증
 */
export const isValidUrl = (url: string): boolean => {
	try {
		new URL(url)
		return true
	} catch {
		return false
	}
}

/**
 * 숫자 범위 검증
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
	return value >= min && value <= max
}

/**
 * 날짜 유효성 검증
 */
export const isValidDate = (date: string | Date): boolean => {
	const dateObj = typeof date === 'string' ? new Date(date) : date
	return !isNaN(dateObj.getTime())
}

/**
 * 미래 날짜 검증
 */
export const isFutureDate = (date: string | Date): boolean => {
	const dateObj = typeof date === 'string' ? new Date(date) : date
	return dateObj.getTime() > Date.now()
}

/**
 * 과거 날짜 검증
 */
export const isPastDate = (date: string | Date): boolean => {
	const dateObj = typeof date === 'string' ? new Date(date) : date
	return dateObj.getTime() < Date.now()
}

/**
 * 빈 문자열 검증
 */
export const isEmpty = (value: string | null | undefined): boolean => {
	return !value || value.trim().length === 0
}

/**
 * 파일 타입 검증
 */
export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
	return allowedTypes.includes(file.type)
}

/**
 * 파일 크기 검증
 */
export const isValidFileSize = (file: File, maxSizeInMB: number): boolean => {
	const maxSizeInBytes = maxSizeInMB * 1024 * 1024
	return file.size <= maxSizeInBytes
}

/**
 * 사업자등록번호 검증 (한국)
 */
export const isValidBusinessNumber = (number: string): boolean => {
	const cleaned = number.replace(/[^0-9]/g, '')
	if (cleaned.length !== 10) return false
	
	const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5]
	let sum = 0
	
	for (let i = 0; i < 9; i++) {
		sum += parseInt(cleaned[i]) * weights[i]
	}
	
	sum += Math.floor((parseInt(cleaned[8]) * 5) / 10)
	const checkDigit = (10 - (sum % 10)) % 10
	
	return checkDigit === parseInt(cleaned[9])
}

/**
 * 신용카드 번호 검증 (Luhn 알고리즘)
 */
export const isValidCreditCard = (cardNumber: string): boolean => {
	const cleaned = cardNumber.replace(/\D/g, '')
	if (cleaned.length < 13 || cleaned.length > 19) return false
	
	let sum = 0
	let isEven = false
	
	for (let i = cleaned.length - 1; i >= 0; i--) {
		let digit = parseInt(cleaned[i])
		
		if (isEven) {
			digit *= 2
			if (digit > 9) digit -= 9
		}
		
		sum += digit
		isEven = !isEven
	}
	
	return sum % 10 === 0
}

/**
 * 필수 필드 검증
 */
export const validateRequiredFields = <T extends Record<string, any>>(
	data: T,
	requiredFields: (keyof T)[]
): { isValid: boolean; missingFields: string[] } => {
	const missingFields: string[] = []
	
	for (const field of requiredFields) {
		const value = data[field]
		if (value === undefined || value === null || value === '') {
			missingFields.push(String(field))
		}
	}
	
	return {
		isValid: missingFields.length === 0,
		missingFields,
	}
}

/**
 * 객체 깊은 비교
 */
export const deepEqual = (obj1: any, obj2: any): boolean => {
	if (obj1 === obj2) return true
	
	if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
		return false
	}
	
	const keys1 = Object.keys(obj1)
	const keys2 = Object.keys(obj2)
	
	if (keys1.length !== keys2.length) return false
	
	for (const key of keys1) {
		if (!keys2.includes(key)) return false
		if (!deepEqual(obj1[key], obj2[key])) return false
	}
	
	return true
}

