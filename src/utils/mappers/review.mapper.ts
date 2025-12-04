/**
 * Review Mappers
 * 
 * Review 데이터 변환 레이어
 */

import type { PendingReview, ReceivedReview } from '../../types/common.types'
import { parseReviewDates, toISOString } from '../dateUtils'

/**
 * localStorage → Domain Model (PendingReview)
 */
export function parsePendingReviewFromStorage(storageData: any): PendingReview {
	return parseReviewDates({
		...storageData,
		tags: storageData.tags || [],
		files: storageData.files || [],
		links: storageData.links || [],
	})
}

/**
 * 여러 PendingReview를 storage에서 변환
 */
export function parsePendingReviewsFromStorage(storageData: any[]): PendingReview[] {
	return storageData.map(parsePendingReviewFromStorage)
}

/**
 * localStorage → Domain Model (ReceivedReview)
 */
export function parseReceivedReviewFromStorage(storageData: any): ReceivedReview {
	return parseReviewDates({
		...storageData,
		tags: storageData.tags || [],
		files: storageData.files || [],
		links: storageData.links || [],
	})
}

/**
 * 여러 ReceivedReview를 storage에서 변환
 */
export function parseReceivedReviewsFromStorage(storageData: any[]): ReceivedReview[] {
	return storageData.map(parseReceivedReviewFromStorage)
}

/**
 * Domain Model → localStorage (PendingReview)
 */
export function serializePendingReviewForStorage(review: PendingReview): any {
	return {
		...review,
		submittedAt: toISOString(review.submittedAt),
	}
}

/**
 * Domain Model → localStorage (ReceivedReview)
 */
export function serializeReceivedReviewForStorage(review: ReceivedReview): any {
	return {
		...review,
		reviewedAt: toISOString(review.reviewedAt),
	}
}

