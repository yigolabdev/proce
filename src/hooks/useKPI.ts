/**
 * useKPI Hook
 * KPI CRUD 및 상태 관리
 */

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { kpiService } from '../services/api/kpi.service'
import { useAuth } from '../context/AuthContext'
import type { 
	KPI,
	KPIFormData,
	KPIStats,
	UseKPIReturn 
} from '../types/kpi.types'

export function useKPI(): UseKPIReturn {
	const { user } = useAuth()
	const [kpis, setKpis] = useState<KPI[]>([])
	const [selectedKPI, setSelectedKPI] = useState<KPI | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)

	// Load KPIs
	const loadKPIs = useCallback(async () => {
		try {
			setIsLoading(true)
			const response = await kpiService.getAll()
			if (response.success) {
				setKpis(response.data)
			}
		} catch (err) {
			setError(err as Error)
			toast.error('Failed to load KPIs')
		} finally {
			setIsLoading(false)
		}
	}, [])

	// Initial load
	useEffect(() => {
		loadKPIs()
	}, [loadKPIs])

	// Calculate stats
	const stats: KPIStats = {
		total: kpis.length,
		onTrack: kpis.filter(k => k.status === 'on-track').length,
		atRisk: kpis.filter(k => k.status === 'at-risk').length,
		behind: kpis.filter(k => k.status === 'behind').length,
		achieved: kpis.filter(k => k.status === 'achieved').length,
		averageProgress: kpis.length > 0
			? Math.round(kpis.reduce((sum, kpi) => sum + kpi.progress, 0) / kpis.length)
			: 0,
		byCategory: kpis.reduce((acc, kpi) => {
			acc[kpi.category] = (acc[kpi.category] || 0) + 1
			return acc
		}, {} as Record<string, number>),
		byDepartment: kpis.reduce((acc, kpi) => {
			acc[kpi.department] = (acc[kpi.department] || 0) + 1
			return acc
		}, {} as Record<string, number>),
	}

	// Create KPI
	const createKPI = useCallback(async (data: KPIFormData) => {
		try {
			if (!user) {
				toast.error('User not authenticated')
				return
			}

			setIsLoading(true)
			const response = await kpiService.create(data, user.id, user.name)
			
			if (response.success) {
				await loadKPIs()
				toast.success('KPI created successfully')
			}
		} catch (err) {
			setError(err as Error)
			toast.error('Failed to create KPI')
		} finally {
			setIsLoading(false)
		}
	}, [user, loadKPIs])

	// Update KPI
	const updateKPI = useCallback(async (id: string, data: Partial<KPI>) => {
		try {
			setIsLoading(true)
			const response = await kpiService.update(id, data)
			
			if (response.success) {
				await loadKPIs()
				
				if (selectedKPI?.id === id) {
					setSelectedKPI(response.data)
				}
				
				toast.success('KPI updated successfully')
			}
		} catch (err) {
			setError(err as Error)
			toast.error('Failed to update KPI')
		} finally {
			setIsLoading(false)
		}
	}, [selectedKPI, loadKPIs])

	// Delete KPI
	const deleteKPI = useCallback(async (id: string, cascadeDelete: boolean = false) => {
		try {
			setIsLoading(true)
			const response = await kpiService.delete(id, cascadeDelete)
			
			if (response.success) {
				await loadKPIs()
				
				if (selectedKPI?.id === id) {
					setSelectedKPI(null)
				}
				
				toast.success(response.message || 'KPI deleted successfully')
				return response.data
			}
		} catch (err) {
			setError(err as Error)
			toast.error('Failed to delete KPI')
		} finally {
			setIsLoading(false)
		}
	}, [selectedKPI, loadKPIs])

	// Select KPI
	const selectKPI = useCallback((kpi: KPI | null) => {
		setSelectedKPI(kpi)
	}, [])

	return {
		kpis,
		selectedKPI,
		stats,
		createKPI,
		updateKPI,
		deleteKPI,
		selectKPI,
		isLoading,
		error,
	}
}
