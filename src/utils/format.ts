/**
 * Format Utilities
 * 
 * 데이터 포맷팅을 위한 유틸리티 함수들
 */

/**
 * 숫자를 통화 형식으로 포맷팅
 */
export const formatCurrency = (
	value: string | number,
	currency: 'USD' | 'KRW' = 'USD',
	minimumFractionDigits: number = 0
): string => {
	if (!value) return currency === 'USD' ? '$0' : '₩0'
	
	const num = typeof value === 'string' ? parseFloat(value) : value
	if (isNaN(num)) return typeof value === 'string' ? value : '0'
	
	return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'ko-KR', {
		style: 'currency',
		currency,
		minimumFractionDigits,
		maximumFractionDigits: minimumFractionDigits,
	}).format(num)
}

/**
 * 파일 크기를 사람이 읽기 쉬운 형식으로 포맷팅
 */
export const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return '0 B'
	if (bytes < 1024) return `${bytes} B`
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
	if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
	return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

/**
 * 날짜를 포맷팅
 */
export const formatDate = (
	date: Date | string,
	format: 'short' | 'long' | 'full' = 'short',
	locale: string = 'en-US'
): string => {
	const dateObj = typeof date === 'string' ? new Date(date) : date
	
	if (isNaN(dateObj.getTime())) return 'Invalid Date'
	
	switch (format) {
		case 'short':
			return dateObj.toLocaleDateString(locale, {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
			})
		case 'long':
			return dateObj.toLocaleDateString(locale, {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			})
		case 'full':
			return dateObj.toLocaleDateString(locale, {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			})
		default:
			return dateObj.toLocaleDateString(locale)
	}
}

/**
 * 상대 시간 포맷팅 (예: "2 hours ago")
 */
export const formatRelativeTime = (date: Date | string): string => {
	const dateObj = typeof date === 'string' ? new Date(date) : date
	const now = new Date()
	const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
	
	if (diffInSeconds < 60) return 'just now'
	if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
	if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
	if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
	if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`
	return `${Math.floor(diffInSeconds / 31536000)} years ago`
}

/**
 * 퍼센트 포맷팅
 */
export const formatPercentage = (value: number, decimals: number = 0): string => {
	return `${value.toFixed(decimals)}%`
}

/**
 * 숫자를 천 단위 구분자와 함께 포맷팅
 */
export const formatNumber = (value: number, decimals: number = 0): string => {
	return value.toLocaleString('en-US', {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	})
}

/**
 * 전화번호 포맷팅
 */
export const formatPhoneNumber = (phone: string): string => {
	const cleaned = phone.replace(/\D/g, '')
	
	if (cleaned.length === 10) {
		return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
	}
	if (cleaned.length === 11) {
		return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
	}
	return phone
}

/**
 * 이메일 마스킹 (개인정보 보호)
 */
export const maskEmail = (email: string): string => {
	const [username, domain] = email.split('@')
	if (!username || !domain) return email
	
	const maskedUsername = username.length > 2
		? username[0] + '*'.repeat(username.length - 2) + username[username.length - 1]
		: username
	
	return `${maskedUsername}@${domain}`
}

/**
 * 텍스트 줄임 (ellipsis)
 */
export const truncateText = (text: string, maxLength: number): string => {
	if (text.length <= maxLength) return text
	return text.slice(0, maxLength) + '...'
}

/**
 * 이름 이니셜 추출
 */
export const getInitials = (name: string): string => {
	return name
		.split(' ')
		.map((word) => word[0])
		.join('')
		.toUpperCase()
		.slice(0, 2)
}

/**
 * 색상 코드 생성 (이름 기반)
 */
export const getColorFromString = (str: string): string => {
	let hash = 0
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash)
	}
	
	const hue = hash % 360
	return `hsl(${hue}, 70%, 60%)`
}

