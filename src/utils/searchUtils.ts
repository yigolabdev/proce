/**
 * Advanced Search Utility
 * 고급 검색 기능을 위한 타입 및 유틸리티
 */

import type { WorkEntry } from '../types/common.types'

/**
 * 검색 쿼리 인터페이스
 */
export interface SearchQuery {
	text?: string // 텍스트 검색
	filters: {
		projects?: string[] // 프로젝트 ID 배열
		categories?: string[] // 카테고리 배열
		statuses?: string[] // 상태 배열
		tags?: string[] // 태그 배열
		dateRange?: {
			from: Date
			to: Date
		}
		assignees?: string[] // 담당자 ID 배열
		departments?: string[] // 부서 배열
		isConfidential?: boolean // 기밀 여부
	}
	sortBy: 'date' | 'title' | 'priority' | 'relevance'
	sortOrder: 'asc' | 'desc'
	logic: 'AND' | 'OR' // 필터 조합 로직
}

/**
 * 저장된 검색 쿼리
 */
export interface SavedSearchQuery {
	id: string
	name: string
	query: SearchQuery
	createdAt: Date
	lastUsed?: Date
	useCount: number
}

/**
 * 기본 검색 쿼리
 */
export const DEFAULT_SEARCH_QUERY: SearchQuery = {
	text: '',
	filters: {},
	sortBy: 'date',
	sortOrder: 'desc',
	logic: 'AND',
}

/**
 * 검색 엔진 클래스
 */
export class SearchEngine {
	/**
	 * WorkEntry 검색
	 */
	static search(entries: WorkEntry[], query: SearchQuery): WorkEntry[] {
		let results = [...entries]

		// 1. 텍스트 검색
		if (query.text && query.text.trim()) {
			const searchText = query.text.toLowerCase().trim()
			results = results.filter(entry => {
				const titleMatch = entry.title.toLowerCase().includes(searchText)
				const descMatch = entry.description.toLowerCase().includes(searchText)
				const tagMatch = entry.tags?.some(tag => tag.toLowerCase().includes(searchText))
				const categoryMatch = entry.category?.toLowerCase().includes(searchText)
				
				return titleMatch || descMatch || tagMatch || categoryMatch
			})
		}

		// 2. 필터 적용
		if (query.logic === 'AND') {
			results = this.applyFiltersAND(results, query.filters)
		} else {
			results = this.applyFiltersOR(results, query.filters)
		}

		// 3. 정렬
		results = this.sortResults(results, query.sortBy, query.sortOrder, query.text)

		return results
	}

	/**
	 * AND 로직으로 필터 적용 (모든 조건 만족)
	 */
	private static applyFiltersAND(entries: WorkEntry[], filters: SearchQuery['filters']): WorkEntry[] {
		let results = [...entries]

		if (filters.projects && filters.projects.length > 0) {
			results = results.filter(e => 
				e.projectId && filters.projects!.includes(e.projectId)
			)
		}

		if (filters.categories && filters.categories.length > 0) {
			results = results.filter(e => 
				e.category && filters.categories!.includes(e.category)
			)
		}

		if (filters.statuses && filters.statuses.length > 0) {
			results = results.filter(e => 
				e.status && filters.statuses!.includes(e.status)
			)
		}

		if (filters.tags && filters.tags.length > 0) {
			results = results.filter(e => 
				e.tags && e.tags.some(tag => filters.tags!.includes(tag))
			)
		}

		if (filters.dateRange) {
			results = results.filter(e => {
				const entryDate = new Date(e.date)
				return entryDate >= filters.dateRange!.from && entryDate <= filters.dateRange!.to
			})
		}

		if (filters.assignees && filters.assignees.length > 0) {
			results = results.filter(e => 
				e.submittedById && filters.assignees!.includes(e.submittedById)
			)
		}

		if (filters.departments && filters.departments.length > 0) {
			results = results.filter(e => 
				e.department && filters.departments!.includes(e.department)
			)
		}

		if (filters.isConfidential !== undefined) {
			results = results.filter(e => e.isConfidential === filters.isConfidential)
		}

		return results
	}

	/**
	 * OR 로직으로 필터 적용 (하나 이상의 조건 만족)
	 */
	private static applyFiltersOR(entries: WorkEntry[], filters: SearchQuery['filters']): WorkEntry[] {
		const hasFilters = Object.values(filters).some(f => f !== undefined && (Array.isArray(f) ? f.length > 0 : true))
		
		if (!hasFilters) return entries

		return entries.filter(entry => {
			const matches: boolean[] = []

			if (filters.projects && filters.projects.length > 0) {
				matches.push(entry.projectId !== undefined && filters.projects.includes(entry.projectId))
			}

			if (filters.categories && filters.categories.length > 0) {
				matches.push(entry.category !== undefined && filters.categories.includes(entry.category))
			}

			if (filters.statuses && filters.statuses.length > 0) {
				matches.push(entry.status !== undefined && filters.statuses.includes(entry.status))
			}

			if (filters.tags && filters.tags.length > 0) {
				matches.push(entry.tags !== undefined && entry.tags.some(tag => filters.tags!.includes(tag)))
			}

			if (filters.dateRange) {
				const entryDate = new Date(entry.date)
				matches.push(entryDate >= filters.dateRange.from && entryDate <= filters.dateRange.to)
			}

			if (filters.assignees && filters.assignees.length > 0) {
				matches.push(entry.submittedById !== undefined && filters.assignees.includes(entry.submittedById))
			}

			if (filters.departments && filters.departments.length > 0) {
				matches.push(entry.department !== undefined && filters.departments.includes(entry.department))
			}

			if (filters.isConfidential !== undefined) {
				matches.push(entry.isConfidential === filters.isConfidential)
			}

			return matches.some(m => m === true)
		})
	}

	/**
	 * 결과 정렬
	 */
	private static sortResults(
		entries: WorkEntry[], 
		sortBy: SearchQuery['sortBy'], 
		sortOrder: SearchQuery['sortOrder'],
		searchText?: string
	): WorkEntry[] {
		const sorted = [...entries]

		sorted.sort((a, b) => {
			let comparison = 0

			switch (sortBy) {
				case 'date':
					comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
					break
				case 'title':
					comparison = a.title.localeCompare(b.title)
					break
				case 'priority':
					// 상태 기반 우선순위 (pending > in_progress > completed)
					const priorityOrder = { pending: 3, in_progress: 2, completed: 1, submitted: 2, approved: 0, rejected: 1 }
					const aPriority = priorityOrder[a.status as keyof typeof priorityOrder] || 0
					const bPriority = priorityOrder[b.status as keyof typeof priorityOrder] || 0
					comparison = bPriority - aPriority
					break
				case 'relevance':
					if (searchText) {
						const aScore = this.calculateRelevanceScore(a, searchText)
						const bScore = this.calculateRelevanceScore(b, searchText)
						comparison = bScore - aScore
					}
					break
			}

			return sortOrder === 'asc' ? comparison : -comparison
		})

		return sorted
	}

	/**
	 * 관련성 점수 계산
	 */
	private static calculateRelevanceScore(entry: WorkEntry, searchText: string): number {
		const text = searchText.toLowerCase()
		let score = 0

		// 제목 일치 (가중치 높음)
		if (entry.title.toLowerCase().includes(text)) {
			score += 10
			if (entry.title.toLowerCase().startsWith(text)) {
				score += 5 // 시작 일치 보너스
			}
		}

		// 설명 일치
		if (entry.description.toLowerCase().includes(text)) {
			score += 5
		}

		// 태그 완전 일치
		if (entry.tags?.some(tag => tag.toLowerCase() === text)) {
			score += 8
		}

		// 태그 부분 일치
		if (entry.tags?.some(tag => tag.toLowerCase().includes(text))) {
			score += 3
		}

		// 카테고리 일치
		if (entry.category?.toLowerCase().includes(text)) {
			score += 3
		}

		return score
	}

	/**
	 * 검색 제안 (자동완성)
	 */
	static getSuggestions(entries: WorkEntry[], partial: string): string[] {
		if (!partial || partial.length < 2) return []

		const text = partial.toLowerCase()
		const suggestions = new Set<string>()

		entries.forEach(entry => {
			// 제목에서 추출
			if (entry.title.toLowerCase().includes(text)) {
				suggestions.add(entry.title)
			}

			// 태그에서 추출
			entry.tags?.forEach(tag => {
				if (tag.toLowerCase().includes(text)) {
					suggestions.add(tag)
				}
			})

			// 카테고리에서 추출
			if (entry.category && entry.category.toLowerCase().includes(text)) {
				suggestions.add(entry.category)
			}
		})

		return Array.from(suggestions).slice(0, 10)
	}
}

/**
 * 저장된 검색 쿼리 관리
 */
export class SavedSearchManager {
	private static readonly STORAGE_KEY = 'savedSearchQueries'

	/**
	 * 검색 쿼리 저장
	 */
	static save(name: string, query: SearchQuery): SavedSearchQuery {
		const saved: SavedSearchQuery = {
			id: `search-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			name,
			query,
			createdAt: new Date(),
			useCount: 0,
		}

		const existing = this.getAll()
		existing.push(saved)

		localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existing))

		return saved
	}

	/**
	 * 모든 저장된 검색 쿼리 조회
	 */
	static getAll(): SavedSearchQuery[] {
		try {
			const data = localStorage.getItem(this.STORAGE_KEY)
			if (!data) return []

			const parsed = JSON.parse(data)
			return parsed.map((item: any) => ({
				...item,
				createdAt: new Date(item.createdAt),
				lastUsed: item.lastUsed ? new Date(item.lastUsed) : undefined,
			}))
		} catch (error) {
			console.error('Failed to load saved searches:', error)
			return []
		}
	}

	/**
	 * 검색 쿼리 삭제
	 */
	static delete(id: string): boolean {
		try {
			const existing = this.getAll()
			const filtered = existing.filter(item => item.id !== id)
			localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered))
			return true
		} catch (error) {
			console.error('Failed to delete saved search:', error)
			return false
		}
	}

	/**
	 * 사용 기록 업데이트
	 */
	static markAsUsed(id: string): void {
		const existing = this.getAll()
		const updated = existing.map(item => {
			if (item.id === id) {
				return {
					...item,
					lastUsed: new Date(),
					useCount: item.useCount + 1,
				}
			}
			return item
		})
		localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated))
	}

	/**
	 * 검색 쿼리 업데이트
	 */
	static update(id: string, updates: Partial<SavedSearchQuery>): boolean {
		try {
			const existing = this.getAll()
			const updated = existing.map(item => {
				if (item.id === id) {
					return { ...item, ...updates }
				}
				return item
			})
			localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated))
			return true
		} catch (error) {
			console.error('Failed to update saved search:', error)
			return false
		}
	}
}

