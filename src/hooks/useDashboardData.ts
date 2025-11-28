import { useState, useEffect, useMemo } from 'react'
import { storage } from '../utils/storage'
import { useAuth } from '../context/AuthContext'
import { parseWorkEntriesFromStorage } from '../utils/mappers'
import { toDate } from '../utils/dateUtils'
import type { WorkEntry } from '../types/common.types'

export function useDashboardData() {
	const { user } = useAuth()
	const currentUserId = user?.id || ''
	
	const [loading, setLoading] = useState(true)
	const [workEntries, setWorkEntries] = useState<WorkEntry[]>([])
	const [receivedReviews, setReceivedReviews] = useState<any[]>([])
	const [tasks, setTasks] = useState<any[]>([])

	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true)

				// Load work entries
				const savedEntries = storage.get<any[]>('workEntries')
				if (savedEntries && savedEntries.length > 0) {
					const parsed = parseWorkEntriesFromStorage(savedEntries)
					setWorkEntries(parsed)
				}

				// Load received reviews
				const savedReviews = storage.get<any[]>('received_reviews')
				if (savedReviews && savedReviews.length > 0) {
					const reviewsWithDates = savedReviews.map((review: any) => ({
						...review,
						reviewedAt: new Date(review.reviewedAt),
					}))
					setReceivedReviews(reviewsWithDates)
				} else {
					setReceivedReviews([])
				}

				// Load tasks
				const manualTasks = storage.get<any[]>('manual_tasks') || []
				const aiTasks = storage.get<any[]>('ai_recommendations') || []
				setTasks([...manualTasks, ...aiTasks])

			} catch (error) {
				console.error('Failed to load dashboard data:', error)
			} finally {
				setLoading(false)
			}
		}

		loadData()
	}, [])

	const personalStats = useMemo(() => {
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

	const myRecentWork = useMemo(() => {
		return workEntries
			.filter(e => e.submittedById === currentUserId)
			.sort((a, b) => (toDate(b.date)?.getTime() || 0) - (toDate(a.date)?.getTime() || 0))
			.slice(0, 3)
	}, [workEntries, currentUserId])

	const performanceData = useMemo(() => {
		const days = []
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
				name: date.toLocaleDateString('en-US', { weekday: 'short' }),
				hours: hours,
				focus: hours > 4 ? 'High' : 'Normal'
			})
		}
		return days
	}, [workEntries, currentUserId])

	return {
		loading,
		personalStats,
		myRecentWork,
		performanceData
	}
}

