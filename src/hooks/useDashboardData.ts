import { useState, useEffect, useMemo, useCallback } from 'react'
import { storage } from '../utils/storage'
import { useAuth } from '../context/AuthContext'
import { parseWorkEntriesFromStorage } from '../utils/mappers'
import { toDate, formatLocalDate } from '../utils/dateUtils'
import type { WorkEntry } from '../types/common.types'
import type { DashboardStats, PerformanceDataPoint } from '../types/dashboard.types'
import { useI18n } from '../i18n/I18nProvider'

// 캐시 관리
interface CacheEntry<T> {
	data: T
	timestamp: number
}

const CACHE_DURATION = 5 * 60 * 1000 // 5분
const dashboardCache = new Map<string, CacheEntry<any>>()

export function useDashboardData() {
	const { user } = useAuth()
	const { locale } = useI18n()
	const currentUserId = user?.id || ''
	
	const [loading, setLoading] = useState(true)
	const [workEntries, setWorkEntries] = useState<WorkEntry[]>([])
	const [receivedReviews, setReceivedReviews] = useState<any[]>([])
	const [tasks, setTasks] = useState<any[]>([])
	const [lastUpdate, setLastUpdate] = useState(Date.now())

	// 캐시된 데이터 가져오기
	const getCachedData = useCallback(<T,>(key: string): T | null => {
		const cached = dashboardCache.get(key)
		if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
			return cached.data as T
		}
		return null
	}, [])

	// 캐시에 데이터 저장
	const setCachedData = useCallback(<T,>(key: string, data: T) => {
		dashboardCache.set(key, {
			data,
			timestamp: Date.now(),
		})
	}, [])

	const loadData = useCallback(async () => {
		try {
			setLoading(true)

			// Load work entries with cache
			const cachedEntries = getCachedData<WorkEntry[]>('workEntries')
			if (cachedEntries) {
				setWorkEntries(cachedEntries)
			} else {
				const savedEntries = storage.get<any[]>('workEntries')
				if (savedEntries && savedEntries.length > 0) {
					const parsed = parseWorkEntriesFromStorage(savedEntries)
					setWorkEntries(parsed)
					setCachedData('workEntries', parsed)
				}
			}

			// Load received reviews with cache
			const cachedReviews = getCachedData<any[]>('receivedReviews')
			if (cachedReviews) {
				setReceivedReviews(cachedReviews)
			} else {
				const savedReviews = storage.get<any[]>('received_reviews')
				if (savedReviews && savedReviews.length > 0) {
					const reviewsWithDates = savedReviews.map((review: any) => ({
						...review,
						reviewedAt: new Date(review.reviewedAt),
					}))
					setReceivedReviews(reviewsWithDates)
					setCachedData('receivedReviews', reviewsWithDates)
				} else {
					setReceivedReviews([])
				}
			}

			// Load tasks with cache
			const cachedTasks = getCachedData<any[]>('tasks')
			if (cachedTasks) {
				setTasks(cachedTasks)
			} else {
				const manualTasks = storage.get<any[]>('manual_tasks') || []
				const aiTasks = storage.get<any[]>('ai_recommendations') || []
				const allTasks = [...manualTasks, ...aiTasks]
				setTasks(allTasks)
				setCachedData('tasks', allTasks)
			}

		} catch (error) {
			console.error('Failed to load dashboard data:', error)
		} finally {
			setLoading(false)
		}
	}, [getCachedData, setCachedData])

	// Storage 변경 감지
	useEffect(() => {
		const handleStorageChange = (e: StorageEvent) => {
			// 관련 키가 변경되면 캐시 무효화 및 재로딩
			if (e.key === 'workEntries' || e.key === 'received_reviews' || 
			    e.key === 'manual_tasks' || e.key === 'ai_recommendations') {
				dashboardCache.clear()
				setLastUpdate(Date.now())
			}
		}

		window.addEventListener('storage', handleStorageChange)
		return () => window.removeEventListener('storage', handleStorageChange)
	}, [])

	// 초기 로딩 및 lastUpdate 변경 시 재로딩
	useEffect(() => {
		loadData()
	}, [loadData, lastUpdate])

	// 통계 계산 메모이제이션 (의존성 최소화)
	const personalStats = useMemo<DashboardStats>(() => {
		const myEntries = workEntries.filter(e => e.submittedById === currentUserId)
		
		const totalHours = myEntries.reduce((sum, entry) => {
			const hours = entry.duration ? parseFloat(entry.duration.replace('h', '')) : 0
			return sum + (isNaN(hours) ? 0 : hours)
		}, 0)

		const completedTasks = tasks.filter(t => t.assignedToId === currentUserId && t.status === 'completed').length
		const totalAssignedTasks = tasks.filter(t => t.assignedToId === currentUserId).length || 1
		const completionRate = Math.round((completedTasks / totalAssignedTasks) * 100)

		const unreadReviews = receivedReviews.filter(r => !r.isRead).length
		const myTasks = tasks.filter(t => t.assignedToId === currentUserId && t.status === 'pending').length
		const urgentTasks = tasks.filter(t => 
			t.assignedToId === currentUserId && 
			t.priority === 'high' &&
			t.deadline &&
			new Date(t.deadline) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
		).length

		return {
			workEntries: myEntries.length,
			hoursLogged: totalHours.toFixed(1),
			completed: completedTasks,
			completionRate: `${completionRate}%`,
			unreadReviews,
			pendingTasks: myTasks,
			urgentTasks,
		}
	}, [workEntries, receivedReviews, tasks, currentUserId])

	// 최근 업무 메모이제이션
	const myRecentWork = useMemo(() => {
		return workEntries
			.filter(e => e.submittedById === currentUserId)
			.sort((a, b) => (toDate(b.date)?.getTime() || 0) - (toDate(a.date)?.getTime() || 0))
			.slice(0, 3)
	}, [workEntries, currentUserId])

	// 성과 데이터 메모이제이션
	const performanceData = useMemo<PerformanceDataPoint[]>(() => {
		const days: PerformanceDataPoint[] = []
		for (let i = 6; i >= 0; i--) {
			const date = new Date()
			date.setDate(date.getDate() - i)
			const dateStr = date.toISOString().split('T')[0]
			
			const dailyEntries = workEntries.filter(e => {
				const entryDate = new Date(e.date).toISOString().split('T')[0]
				return e.submittedById === currentUserId && entryDate === dateStr
			})
			
			const hours = dailyEntries.reduce((sum, e) => {
				return sum + (e.duration ? parseFloat(e.duration.replace('h', '')) || 0 : 0)
			}, 0)

			days.push({
				name: formatLocalDate(date, locale, { weekday: 'short' }),
				hours: hours,
				focus: hours > 4 ? 'High' : 'Normal'
			})
		}
		return days
	}, [workEntries, currentUserId, locale])

	// 수동 새로고침 함수
	const refresh = useCallback(() => {
		dashboardCache.clear()
		setLastUpdate(Date.now())
	}, [])

	return {
		loading,
		personalStats,
		myRecentWork,
		performanceData,
		refresh, // 새로고침 함수 export
	}
}

