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
 * @param date - 날짜
 * @param locale - 로케일 코드 (기본값: 'en-US')
 * @param options - Intl.DateTimeFormatOptions
 */
export function formatLocalDate(
	date: Date | string | undefined | null, 
	locale: string = 'en-US',
	options: Intl.DateTimeFormatOptions = {}
): string {
	if (!date) return '-'
	const d = toDate(date)
	if (!d) return '-'
	
	// 로케일 매핑
	const targetLocale = locale === 'ko' ? 'ko-KR' : 'en-US'
	return d.toLocaleDateString(targetLocale, options)
}

/**
 * 날짜를 상대 시간으로 변환 (예: "2 days ago", "2일 전")
 * @param date - 날짜
 * @param locale - 로케일 코드 (기본값: 'en-US')
 */
export function formatRelativeTime(
	date: Date | string | undefined | null, 
	locale: string = 'en-US'
): string {
	if (!date) return '-'
	const d = toDate(date)
	if (!d) return '-'
	
	const now = new Date()
	const diffInSeconds = Math.floor((d.getTime() - now.getTime()) / 1000)
	
	// 로케일 매핑
	const targetLocale = locale === 'ko' ? 'ko-KR' : 'en-US'
	const rtf = new Intl.RelativeTimeFormat(targetLocale, { numeric: 'auto' })
	
	const absDiff = Math.abs(diffInSeconds)
	
	if (absDiff < 60) return rtf.format(diffInSeconds, 'second')
	if (absDiff < 3600) return rtf.format(Math.ceil(diffInSeconds / 60), 'minute')
	if (absDiff < 86400) return rtf.format(Math.ceil(diffInSeconds / 3600), 'hour')
	if (absDiff < 604800) return rtf.format(Math.ceil(diffInSeconds / 86400), 'day') // 7 days
	if (absDiff < 2592000) return rtf.format(Math.ceil(diffInSeconds / 604800), 'week') // 30 days
	if (absDiff < 31536000) return rtf.format(Math.ceil(diffInSeconds / 2592000), 'month') // 365 days
	
	return rtf.format(Math.ceil(diffInSeconds / 31536000), 'year')
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

/**
 * Review의 날짜 필드를 Date로 변환
 */
export function parseReviewDates<T extends Record<string, any>>(review: T): T {
	return parseDates(review, [
		'submittedAt',
		'reviewedAt',
	] as (keyof T)[])
}

/**
 * Message의 날짜 필드를 Date로 변환
 */
export function parseMessageDates<T extends Record<string, any>>(message: T): T {
	return parseDates(message, [
		'date',
		'timestamp',
	] as (keyof T)[])
}

/**
 * Task의 날짜 필드를 Date로 변환
 */
export function parseTaskDates<T extends Record<string, any>>(task: T): T {
	return parseDates(task, [
		'createdAt',
		'acceptedAt',
		'completedAt',
		'deadline',
	] as (keyof T)[])
}
