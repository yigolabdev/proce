/**
 * useOKR Hook
 * OKR CRUD 및 상태 관리
 */

import { useState, useEffect, useCallback } from 'react'
import { storage } from '../utils/storage'
import { toast } from 'sonner'
import type { 
	Objective, 
	ObjectiveFormData, 
	KeyResultFormData, 
	KeyResult,
	OKRStats,
	UseOKRReturn 
} from '../types/okr.types'

const STORAGE_KEY = 'objectives'

export function useOKR(): UseOKRReturn {
	const [objectives, setObjectives] = useState<Objective[]>([])
	const [selectedObjective, setSelectedObjective] = useState<Objective | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)

	// Load objectives from storage
	useEffect(() => {
		try {
			const saved = storage.get<Objective[]>(STORAGE_KEY, [])
			setObjectives(saved || [])
		} catch (err) {
			setError(err as Error)
			toast.error('Failed to load OKRs')
		} finally {
			setIsLoading(false)
		}
	}, [])

	// Save to storage whenever objectives change
	const saveObjectives = useCallback((newObjectives: Objective[]) => {
		try {
			storage.set(STORAGE_KEY, newObjectives)
			setObjectives(newObjectives)
		} catch (err) {
			setError(err as Error)
			toast.error('Failed to save OKRs')
		}
	}, [])

	// Calculate stats
	const stats: OKRStats = {
		totalObjectives: objectives.length,
		completedObjectives: objectives.filter(o => o.status === 'completed').length,
		onTrackObjectives: objectives.filter(o => o.status === 'on-track').length,
		atRiskObjectives: objectives.filter(o => o.status === 'at-risk').length,
		behindObjectives: objectives.filter(o => o.status === 'behind').length,
		averageProgress: objectives.length > 0
			? objectives.reduce((sum, obj) => {
					const progress = obj.keyResults.reduce((krSum, kr) => 
						krSum + (kr.current / kr.target * 100), 0
					) / obj.keyResults.length
					return sum + progress
				}, 0) / objectives.length
			: 0,
		totalKeyResults: objectives.reduce((sum, obj) => sum + obj.keyResults.length, 0),
		completedKeyResults: objectives.reduce((sum, obj) => 
			sum + obj.keyResults.filter(kr => kr.current >= kr.target).length, 0
		),
	}

	// Create objective
	const createObjective = useCallback(async (data: ObjectiveFormData) => {
		try {
			const newObjective: Objective = {
				id: `okr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
				...data,
				status: 'on-track',
				keyResults: [],
			}
			
			const updated = [newObjective, ...objectives]
			saveObjectives(updated)
			toast.success('Objective created successfully')
		} catch (err) {
			setError(err as Error)
			toast.error('Failed to create objective')
		}
	}, [objectives, saveObjectives])

	// Update objective
	const updateObjective = useCallback(async (id: string, data: Partial<Objective>) => {
		try {
			const updated = objectives.map(obj => 
				obj.id === id ? { ...obj, ...data } : obj
			)
			saveObjectives(updated)
			
			if (selectedObjective?.id === id) {
				setSelectedObjective({ ...selectedObjective, ...data })
			}
			
			toast.success('Objective updated successfully')
		} catch (err) {
			setError(err as Error)
			toast.error('Failed to update objective')
		}
	}, [objectives, selectedObjective, saveObjectives])

	// Delete objective
	const deleteObjective = useCallback(async (id: string, cascadeDelete: boolean = false) => {
		try {
			// 연결된 Tasks 확인
			const tasks = storage.get<any[]>('ai_recommendations') || []
			const linkedTasks = tasks.filter(t => t.objectiveId === id)
			
			if (cascadeDelete) {
				// 연쇄 삭제: 연결된 Task들도 삭제
				const filteredTasks = tasks.filter(t => t.objectiveId !== id)
				storage.set('ai_recommendations', filteredTasks)
			} else {
				// 연결만 해제: Task는 유지하되 objectiveId, keyResultId 제거
				linkedTasks.forEach(task => {
					task.objectiveId = undefined
					task.keyResultId = undefined
				})
				storage.set('ai_recommendations', tasks)
			}
			
			// KPI에서 연결 해제
			const objective = objectives.find(o => o.id === id)
			if (objective?.kpiId) {
				const kpis = storage.get<any[]>('kpis') || []
				const kpi = kpis.find(k => k.id === objective.kpiId)
				if (kpi && kpi.linkedObjectives) {
					kpi.linkedObjectives = kpi.linkedObjectives.filter((oid: string) => oid !== id)
					storage.set('kpis', kpis)
				}
			}
			
			// Objective 삭제
			const updated = objectives.filter(obj => obj.id !== id)
			saveObjectives(updated)
			
			if (selectedObjective?.id === id) {
				setSelectedObjective(null)
			}
			
			const message = cascadeDelete
				? `Objective와 연결된 ${linkedTasks.length}개 Task가 함께 삭제되었습니다`
				: linkedTasks.length > 0
					? `Objective가 삭제되었습니다. ${linkedTasks.length}개 Task의 연결이 해제되었습니다`
					: 'Objective deleted successfully'
			
			toast.success(message)
		} catch (err) {
			setError(err as Error)
			toast.error('Failed to delete objective')
		}
	}, [objectives, selectedObjective, saveObjectives])

	// Select objective
	const selectObjective = useCallback((objective: Objective | null) => {
		setSelectedObjective(objective)
	}, [])

	// Add key result
	const addKeyResult = useCallback(async (objectiveId: string, data: KeyResultFormData) => {
		try {
			const newKeyResult: KeyResult = {
				id: `kr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
				...data,
			}
			
			const updated = objectives.map(obj => 
				obj.id === objectiveId
					? { ...obj, keyResults: [...obj.keyResults, newKeyResult] }
					: obj
			)
			saveObjectives(updated)
			
			if (selectedObjective?.id === objectiveId) {
				setSelectedObjective({
					...selectedObjective,
					keyResults: [...selectedObjective.keyResults, newKeyResult]
				})
			}
			
			toast.success('Key result added successfully')
		} catch (err) {
			setError(err as Error)
			toast.error('Failed to add key result')
		}
	}, [objectives, selectedObjective, saveObjectives])

	// Update key result
	const updateKeyResult = useCallback(async (
		objectiveId: string, 
		keyResultId: string, 
		data: Partial<KeyResult>
	) => {
		try {
			const updated = objectives.map(obj => 
				obj.id === objectiveId
					? {
							...obj,
							keyResults: obj.keyResults.map(kr =>
								kr.id === keyResultId ? { ...kr, ...data } : kr
							)
						}
					: obj
			)
			saveObjectives(updated)
			
			if (selectedObjective?.id === objectiveId) {
				setSelectedObjective({
					...selectedObjective,
					keyResults: selectedObjective.keyResults.map(kr =>
						kr.id === keyResultId ? { ...kr, ...data } : kr
					)
				})
			}
			
			toast.success('Key result updated successfully')
		} catch (err) {
			setError(err as Error)
			toast.error('Failed to update key result')
		}
	}, [objectives, selectedObjective, saveObjectives])

	// Delete key result
	const deleteKeyResult = useCallback(async (objectiveId: string, keyResultId: string) => {
		try {
			const updated = objectives.map(obj => 
				obj.id === objectiveId
					? {
							...obj,
							keyResults: obj.keyResults.filter(kr => kr.id !== keyResultId)
						}
					: obj
			)
			saveObjectives(updated)
			
			if (selectedObjective?.id === objectiveId) {
				setSelectedObjective({
					...selectedObjective,
					keyResults: selectedObjective.keyResults.filter(kr => kr.id !== keyResultId)
				})
			}
			
			toast.success('Key result deleted successfully')
		} catch (err) {
			setError(err as Error)
			toast.error('Failed to delete key result')
		}
	}, [objectives, selectedObjective, saveObjectives])

	return {
		objectives,
		selectedObjective,
		stats,
		createObjective,
		updateObjective,
		deleteObjective,
		selectObjective,
		addKeyResult,
		updateKeyResult,
		deleteKeyResult,
		isLoading,
		error,
	}
}

