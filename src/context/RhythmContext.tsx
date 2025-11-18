/**
 * Rhythm Context
 * 
 * 리듬 기반 상태를 전역으로 관리하는 Context
 */

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { rhythmService } from '../services/rhythm/rhythmService'
import type { TodayStatus, LoopItem, TeamRhythmView, OptionalNextActions } from '../services/rhythm/types'
import { useAuth } from './AuthContext'

interface RhythmContextValue {
	// 상태
	todayStatus: TodayStatus | null
	inProgress: LoopItem[]
	needsReview: LoopItem[]
	completed: LoopItem[]
	teamRhythm: TeamRhythmView | null
	
	// 로딩
	loading: boolean
	
	// 액션
	refreshRhythm: () => Promise<void>
	requestNextActions: () => Promise<OptionalNextActions | null>
	
	// 선택적 다음 작업 표시 상태
	showingNextActions: boolean
	setShowingNextActions: (show: boolean) => void
}

const RhythmContext = createContext<RhythmContextValue | undefined>(undefined)

export function RhythmProvider({ children }: { children: ReactNode }) {
	const { user } = useAuth()
	const [todayStatus, setTodayStatus] = useState<TodayStatus | null>(null)
	const [inProgress, setInProgress] = useState<LoopItem[]>([])
	const [needsReview, setNeedsReview] = useState<LoopItem[]>([])
	const [completed, setCompleted] = useState<LoopItem[]>([])
	const [teamRhythm, setTeamRhythm] = useState<TeamRhythmView | null>(null)
	const [loading, setLoading] = useState(false)
	const [showingNextActions, setShowingNextActions] = useState(false)
	
	/**
	 * 리듬 데이터 새로고침
	 */
	const refreshRhythm = useCallback(async () => {
		if (!user?.id) return
		
		setLoading(true)
		try {
			// 병렬로 모든 데이터 로드
			const [today, progress, review, done, team] = await Promise.all([
				rhythmService.getTodayStatus(user.id),
				rhythmService.getInProgress(user.id),
				rhythmService.getNeedsReview(user.id),
				rhythmService.getCompleted(user.id),
				rhythmService.getTeamRhythm(user.id, user.role),
			])
			
			setTodayStatus(today)
			setInProgress(progress)
			setNeedsReview(review)
			setCompleted(done)
			setTeamRhythm(team)
		} catch (error) {
			console.error('Failed to refresh rhythm:', error)
		} finally {
			setLoading(false)
		}
	}, [user?.id, user?.role])
	
	/**
	 * 선택적 다음 작업 요청
	 */
	const requestNextActions = useCallback(async () => {
		if (!user?.id) return null
		
		try {
			const nextActions = await rhythmService.getOptionalNextActions(user.id)
			setShowingNextActions(true)
			return nextActions
		} catch (error) {
			console.error('Failed to get next actions:', error)
			return null
		}
	}, [user?.id])
	
	// 초기 로드 및 자동 새로고침
	useEffect(() => {
		refreshRhythm()
		
		// 30초마다 자동 새로고침
		const interval = setInterval(refreshRhythm, 30000)
		return () => clearInterval(interval)
	}, [refreshRhythm])
	
	const value: RhythmContextValue = {
		todayStatus,
		inProgress,
		needsReview,
		completed,
		teamRhythm,
		loading,
		refreshRhythm,
		requestNextActions,
		showingNextActions,
		setShowingNextActions,
	}
	
	return (
		<RhythmContext.Provider value={value}>
			{children}
		</RhythmContext.Provider>
	)
}

/**
 * useRhythm Hook
 */
export function useRhythm() {
	const context = useContext(RhythmContext)
	if (context === undefined) {
		throw new Error('useRhythm must be used within a RhythmProvider')
	}
	return context
}

