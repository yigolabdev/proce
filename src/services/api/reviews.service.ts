/**
 * Reviews Service
 * 
 * Handles all API calls related to work reviews.
 */

import { storage } from '../../utils/storage'
import type { ApiResponse } from './config'

/**
 * Review Type
 */
export type ReviewType = 'approved' | 'changes_requested' | 'rejected'

/**
 * Review Interface
 */
export interface Review {
	id: string
	workEntryId: string
	workTitle: string
	projectName?: string
	reviewType: ReviewType
	reviewer: string
	reviewerDepartment?: string
	comment: string
	timestamp: Date
	isRead: boolean
}

/**
 * Review Filters
 */
export interface ReviewFilters {
	workEntryId?: string
	reviewType?: ReviewType
	projectName?: string
	isRead?: boolean
}

/**
 * Create Review Data
 */
export interface CreateReviewData {
	workEntryId: string
	workTitle: string
	projectName?: string
	reviewType: ReviewType
	reviewer: string
	reviewerDepartment?: string
	comment: string
}

/**
 * Reviews Service
 */
class ReviewsService {
	private readonly STORAGE_KEY = 'received_reviews'
	
	/**
	 * Get all reviews
	 */
	async getAll(filters?: ReviewFilters): Promise<ApiResponse<Review[]>> {
		// TODO: Replace with API call
		// return apiClient.get<Review[]>('/reviews', { params: filters })
		
		let reviews = storage.get<Review[]>(this.STORAGE_KEY) || []
		
		// Apply filters
		if (filters) {
			if (filters.workEntryId) {
				reviews = reviews.filter(r => r.workEntryId === filters.workEntryId)
			}
			if (filters.reviewType) {
				reviews = reviews.filter(r => r.reviewType === filters.reviewType)
			}
			if (filters.projectName) {
				reviews = reviews.filter(r => r.projectName === filters.projectName)
			}
			if (filters.isRead !== undefined) {
				reviews = reviews.filter(r => r.isRead === filters.isRead)
			}
		}
		
		return {
			data: reviews,
			success: true,
		}
	}
	
	/**
	 * Get review by ID
	 */
	async getById(id: string): Promise<ApiResponse<Review | null>> {
		// TODO: Replace with API call
		// return apiClient.get<Review>(`/reviews/${id}`)
		
		const reviews = storage.get<Review[]>(this.STORAGE_KEY) || []
		const review = reviews.find(r => r.id === id)
		
		return {
			data: review || null,
			success: true,
		}
	}
	
	/**
	 * Create review
	 */
	async create(reviewData: CreateReviewData): Promise<ApiResponse<Review>> {
		// TODO: Replace with API call
		// return apiClient.post<Review>('/reviews', reviewData)
		
		const reviews = storage.get<Review[]>(this.STORAGE_KEY) || []
		
		const newReview: Review = {
			...reviewData,
			id: `review-${Date.now()}`,
			timestamp: new Date(),
			isRead: false,
		}
		
		reviews.unshift(newReview)
		storage.set(this.STORAGE_KEY, reviews)
		
		return {
			data: newReview,
			message: 'Review created successfully',
			success: true,
		}
	}
	
	/**
	 * Mark review as read
	 */
	async markAsRead(id: string): Promise<ApiResponse<Review>> {
		// TODO: Replace with API call
		// return apiClient.patch<Review>(`/reviews/${id}/read`)
		
		const reviews = storage.get<Review[]>(this.STORAGE_KEY) || []
		const index = reviews.findIndex(r => r.id === id)
		
		if (index === -1) {
			throw new Error('Review not found')
		}
		
		reviews[index].isRead = true
		storage.set(this.STORAGE_KEY, reviews)
		
		return {
			data: reviews[index],
			success: true,
		}
	}
	
	/**
	 * Delete review
	 */
	async delete(id: string): Promise<ApiResponse<void>> {
		// TODO: Replace with API call
		// return apiClient.delete<void>(`/reviews/${id}`)
		
		const reviews = storage.get<Review[]>(this.STORAGE_KEY) || []
		const filtered = reviews.filter(r => r.id !== id)
		storage.set(this.STORAGE_KEY, filtered)
		
		return {
			data: undefined,
			message: 'Review deleted successfully',
			success: true,
		}
	}
	
	/**
	 * Get unread count
	 */
	async getUnreadCount(): Promise<ApiResponse<number>> {
		// TODO: Replace with API call
		// return apiClient.get<number>('/reviews/unread/count')
		
		const reviews = storage.get<Review[]>(this.STORAGE_KEY) || []
		const count = reviews.filter(r => !r.isRead).length
		
		return {
			data: count,
			success: true,
		}
	}
}

export const reviewsService = new ReviewsService()

