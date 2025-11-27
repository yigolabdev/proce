/**
 * Date Utilities
 * 
 * 날짜 변환 및 포맷팅 유틸리티
 * 백엔드 API 연동 시 ISO string ↔ Date 변환에 사용
 */

/**
 * Date 객체를 ISO string으로 변환
 * @param date - Date 객체 또는 ISO string
 * @returns ISO string
 */
export function toISOString(date: Date | string | undefined | null): string | undefined {
	if (!date) return undefined
	if (typeof date === 'string') return date
	return date.toISOString()
}

/**
 * ISO string을 Date 객체로 변환
 * @param dateString - ISO string 또는 Date 객체
 * @returns Date 객체
 */
export function toDate(dateString: Date | string | undefined | null): Date | undefined {
	if (!dateString) return undefined
	if (dateString instanceof Date) return dateString
	return new Date(dateString)
}

/**
 * 여러 날짜를 한 번에 Date로 변환
 * @param dates - 변환할 날짜 객체
 * @returns Date로 변환된 객체
 */
export function parseDates<T extends Record<string, any>>(
	obj: T,
	dateFields: (keyof T)[]
): T {
	const result = { ...obj }
	for (const field of dateFields) {
		if (result[field]) {
			result[field] = toDate(result[field] as any) as any
		}
	}
	return result
}

/**
 * 여러 날짜를 한 번에 ISO string으로 변환
 * @param obj - 변환할 객체
 * @param dateFields - 날짜 필드 이름 배열
 * @returns ISO string으로 변환된 객체
 */
export function serializeDates<T extends Record<string, any>>(
	obj: T,
	dateFields: (keyof T)[]
): T {
	const result = { ...obj }
	for (const field of dateFields) {
		if (result[field]) {
			result[field] = toISOString(result[field] as any) as any
		}
	}
	return result
}

/**
 * WorkEntry의 날짜 필드를 Date로 변환
 */
export function parseWorkEntryDates<T extends Record<string, any>>(entry: T): T {
	return parseDates(entry, [
		'date',
		'createdAt',
		'updatedAt',
		'submittedAt',
		'reviewedAt',
	] as (keyof T)[])
}

/**
 * Project의 날짜 필드를 Date로 변환
 */
export function parseProjectDates<T extends Record<string, any>>(project: T): T {
	const result = parseDates(project, [
		'startDate',
		'endDate',
		'createdAt',
	] as (keyof T)[])
	
	// members의 joinedAt도 변환 (if exists)
	if (Array.isArray((result as any).members)) {
		(result as any).members = (result as any).members.map((m: any) => ({
			...m,
			joinedAt: toDate(m.joinedAt),
		}))
	}
	
	// files의 uploadedAt 변환 (if exists)
	if (Array.isArray((result as any).files)) {
		(result as any).files = (result as any).files.map((f: any) => ({
			...f,
			uploadedAt: toDate(f.uploadedAt),
		}))
	}
	
	// links의 addedAt 변환 (if exists)
	if (Array.isArray((result as any).links)) {
		(result as any).links = (result as any).links.map((l: any) => ({
			...l,
			addedAt: toDate(l.addedAt),
		}))
	}
	
	return result
}

/**
 * 날짜를 로컬 포맷으로 변환
 */
export function formatLocalDate(date: Date | string | undefined | null): string {
	if (!date) return '-'
	const d = toDate(date)
	if (!d) return '-'
	return d.toLocaleDateString()
}

/**
 * 날짜를 상대 시간으로 변환 (예: "2 days ago")
 */
export function formatRelativeTime(date: Date | string | undefined | null): string {
	if (!date) return '-'
	const d = toDate(date)
	if (!d) return '-'
	
	const now = new Date()
	const diffInMs = now.getTime() - d.getTime()
	const diffInSeconds = Math.floor(diffInMs / 1000)
	const diffInMinutes = Math.floor(diffInSeconds / 60)
	const diffInHours = Math.floor(diffInMinutes / 60)
	const diffInDays = Math.floor(diffInHours / 24)
	
	if (diffInSeconds < 60) return 'just now'
	if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
	if (diffInHours < 24) return `${diffInHours} hours ago`
	if (diffInDays < 7) return `${diffInDays} days ago`
	if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
	if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
	return `${Math.floor(diffInDays / 365)} years ago`
}

/**
 * 두 날짜 사이의 일수 계산
 */
export function daysBetween(
	start: Date | string | undefined | null,
	end: Date | string | undefined | null
): number {
	if (!start || !end) return 0
	const startDate = toDate(start)
	const endDate = toDate(end)
	if (!startDate || !endDate) return 0
	
	const diffInMs = endDate.getTime() - startDate.getTime()
	return Math.ceil(diffInMs / (1000 * 60 * 60 * 24))
}

/**
 * 남은 일수 계산
 */
export function daysRemaining(deadline: Date | string | undefined | null): number {
	if (!deadline) return 0
	return daysBetween(new Date(), deadline)
}

