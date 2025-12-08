/**
 * useAIRecommendations Hook
 * AI 추천 기능을 위한 커스텀 훅
 */

import { useState, useCallback, useEffect } from 'react'
import { storage } from '../utils/storage'
import { toast } from 'sonner'
import { aiRecommendationService } from '../services/ai/recommendation.service'
import type { TaskRecommendation, RecommendationInsight, AnalysisResult } from '../services/ai/recommendation.service'
import type { WorkEntry, Project } from '../types/common.types'

export interface UseAIRecommendationsReturn {
	// Data
	recommendations: TaskRecommendation[]
	insights: RecommendationInsight[]
	summary: AnalysisResult['summary'] | null
	
	// Actions
	generateRecommendations: () => Promise<void>
	acceptRecommendation: (id: string) => Promise<void>
	rejectRecommendation: (id: string) => Promise<void>
	clearRecommendations: () => void
	
	// Status
	isLoading: boolean
	lastUpdated: Date | null
	error: Error | null
}

export function useAIRecommendations(): UseAIRecommendationsReturn {
	const [recommendations, setRecommendations] = useState<TaskRecommendation[]>([])
	const [insights, setInsights] = useState<RecommendationInsight[]>([])
	const [summary, setSummary] = useState<AnalysisResult['summary'] | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
	const [error, setError] = useState<Error | null>(null)

	// 초기 로드
	useEffect(() => {
		const saved = storage.get<{
			recommendations: TaskRecommendation[]
			insights: RecommendationInsight[]
			summary: AnalysisResult['summary']
			lastUpdated: string
		}>('ai_recommendations')

		if (saved) {
			setRecommendations(saved.recommendations)
			setInsights(saved.insights)
			setSummary(saved.summary)
			setLastUpdated(new Date(saved.lastUpdated))
		}
	}, [])

	/**
	 * 추천 생성
	 */
	const generateRecommendations = useCallback(async () => {
		setIsLoading(true)
		setError(null)

		try {
			// 데이터 로드
			const workEntries = storage.get<WorkEntry[]>('workEntries', [])
			const projects = storage.get<Project[]>('projects', [])

			// AI 분석 수행
			const result = await aiRecommendationService.generateRecommendations(
				workEntries,
				projects
			)

			// 상태 업데이트
			setRecommendations(result.recommendations)
			setInsights(result.insights)
			setSummary(result.summary)
			setLastUpdated(new Date())

			// 저장
			storage.set('ai_recommendations', {
				recommendations: result.recommendations,
				insights: result.insights,
				summary: result.summary,
				lastUpdated: new Date().toISOString(),
			})

			toast.success(`Generated ${result.recommendations.length} recommendations`)
		} catch (err) {
			const error = err as Error
			setError(error)
			toast.error('Failed to generate recommendations')
			console.error('AI Recommendations error:', error)
		} finally {
			setIsLoading(false)
		}
	}, [])

	/**
	 * 추천 수락
	 */
	const acceptRecommendation = useCallback(
		async (id: string) => {
			try {
				await aiRecommendationService.acceptRecommendation(id)

				// 상태 업데이트
				const updated = recommendations.map(rec =>
					rec.id === id ? { ...rec, status: 'accepted' as const } : rec
				)
				setRecommendations(updated)

				// 저장
				storage.set('ai_recommendations', {
					recommendations: updated,
					insights,
					summary,
					lastUpdated: lastUpdated?.toISOString() || new Date().toISOString(),
				})

				toast.success('Recommendation accepted')
			} catch (err) {
				const error = err as Error
				setError(error)
				toast.error('Failed to accept recommendation')
			}
		},
		[recommendations, insights, summary, lastUpdated]
	)

	/**
	 * 추천 거절
	 */
	const rejectRecommendation = useCallback(
		async (id: string) => {
			try {
				await aiRecommendationService.rejectRecommendation(id)

				// 상태 업데이트
				const updated = recommendations.map(rec =>
					rec.id === id ? { ...rec, status: 'rejected' as const } : rec
				)
				setRecommendations(updated)

				// 저장
				storage.set('ai_recommendations', {
					recommendations: updated,
					insights,
					summary,
					lastUpdated: lastUpdated?.toISOString() || new Date().toISOString(),
				})

				toast.success('Recommendation rejected')
			} catch (err) {
				const error = err as Error
				setError(error)
				toast.error('Failed to reject recommendation')
			}
		},
		[recommendations, insights, summary, lastUpdated]
	)

	/**
	 * 추천 초기화
	 */
	const clearRecommendations = useCallback(() => {
		setRecommendations([])
		setInsights([])
		setSummary(null)
		setLastUpdated(null)
		storage.remove('ai_recommendations')
		toast.success('Recommendations cleared')
	}, [])

	return {
		recommendations,
		insights,
		summary,
		generateRecommendations,
		acceptRecommendation,
		rejectRecommendation,
		clearRecommendations,
		isLoading,
		lastUpdated,
		error,
	}
}

