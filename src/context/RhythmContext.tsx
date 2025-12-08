/**
 * Rhythm Context
 * 
 * 리듬 기반 상태를 전역으로 관리하는 Context
 */

import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef, type ReactNode } from 'react'
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
	
	// user.id와 user.role을 ref로 저장하여 안정적인 참조 유지
	const userIdRef = useRef(user?.id)
	const userRoleRef = useRef(user?.role)
	
	useEffect(() => {
		userIdRef.current = user?.id
		userRoleRef.current = user?.role
	}, [user?.id, user?.role])
	
	/**
	 * 리듬 데이터 새로고침
	 */
	const refreshRhythm = useCallback(async () => {
		const userId = userIdRef.current
		const userRole = userRoleRef.current
		
		if (!userId) return
		
		setLoading(true)
		try {
			// 병렬로 모든 데이터 로드
			const [today, progress, review, done, team] = await Promise.all([
				rhythmService.getTodayStatus(userId),
				rhythmService.getInProgress(userId),
				rhythmService.getNeedsReview(userId),
				rhythmService.getCompleted(userId),
				rhythmService.getTeamRhythm(userId, userRole),
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
	}, []) // 의존성 배열을 비움
	
	/**
	 * 선택적 다음 작업 요청
	 */
	const requestNextActions = useCallback(async () => {
		const userId = userIdRef.current
		if (!userId) return null
		
		try {
			const nextActions = await rhythmService.getOptionalNextActions(userId)
			setShowingNextActions(true)
			return nextActions
		} catch (error) {
			console.error('Failed to get next actions:', error)
			return null
		}
	}, [])
	
	// 초기 로드 및 자동 새로고침
	useEffect(() => {
		if (!user?.id) return
		
		refreshRhythm()
		
		// 30초마다 자동 새로고침
		const interval = setInterval(refreshRhythm, 30000)
		return () => clearInterval(interval)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user?.id]) // user.id가 변경될 때만 실행
	
	// Memoize context value to prevent unnecessary re-renders
	const value: RhythmContextValue = useMemo(() => ({
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
	}), [
		todayStatus,
		inProgress,
		needsReview,
		completed,
		teamRhythm,
		loading,
		refreshRhythm,
		requestNextActions,
		showingNextActions,
	])
	
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

