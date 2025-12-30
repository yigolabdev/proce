/**
 * Resource Optimizer Service
 * 리소스 최적 배분 추천
 */

import type { KPI } from '../../types/kpi.types'
import { storage } from '../../utils/storage'

export interface ResourceAllocation {
	departments: Array<{
		departmentId: string
		currentResources: {
			headcount: number
			budget: number
			time: number
		}
		
		optimalAllocation: {
			headcount: number
			budget: number
			expectedImpact: {
				kpiImprovements: Array<{kpiId: string; improvement: number}>
				okrCompletionRate: number
			}
		}
		
		adjustmentNeeded: {
			action: 'increase' | 'maintain' | 'decrease'
			reasoning: string
			priority: number
		}
	}>
	
	reallocationSuggestions: Array<{
		from: string
		to: string
		resource: 'budget' | 'headcount'
		amount: number
		expectedROI: number
		reasoning: string
	}>
}

export class ResourceOptimizerService {
	async optimizeResources(): Promise<ResourceAllocation> {
		const kpis = storage.get<KPI[]>('kpis', [])
		const departments = new Set(kpis.map(k => k.department))

		const allocations = Array.from(departments).map(dept => {
			const deptKPIs = kpis.filter(k => k.department === dept)
			const avgProgress = deptKPIs.reduce((sum, k) =>
				sum + (k.metric.current / k.metric.target) * 100, 0
			) / (deptKPIs.length || 1)

			const action: 'increase' | 'maintain' | 'decrease' = 
				avgProgress < 60 ? 'increase' :
				avgProgress > 90 ? 'decrease' : 'maintain'

			return {
				departmentId: dept,
				currentResources: {
					headcount: 10,  // 가정
					budget: 50000000,
					time: 160,  // 월 160시간
				},
				optimalAllocation: {
					headcount: action === 'increase' ? 12 : action === 'decrease' ? 8 : 10,
					budget: action === 'increase' ? 60000000 : action === 'decrease' ? 40000000 : 50000000,
					expectedImpact: {
						kpiImprovements: deptKPIs.map(k => ({
							kpiId: k.id,
							improvement: action === 'increase' ? 15 : 0,
						})),
						okrCompletionRate: avgProgress + (action === 'increase' ? 15 : 0),
					},
				},
				adjustmentNeeded: {
					action,
					reasoning: action === 'increase' 
						? `KPI 달성률 ${Math.round(avgProgress)}%로 리소스 추가 필요`
						: action === 'decrease'
						? '목표 초과 달성으로 리소스 재배분 가능'
						: '현재 리소스 수준 적정',
					priority: action === 'increase' ? 3 : action === 'decrease' ? 2 : 1,
				},
			}
		})

		// 재배분 제안
		const overAllocated = allocations.filter(a => a.adjustmentNeeded.action === 'decrease')
		const underAllocated = allocations.filter(a => a.adjustmentNeeded.action === 'increase')

		const reallocationSuggestions = []
		for (let i = 0; i < Math.min(overAllocated.length, underAllocated.length); i++) {
			reallocationSuggestions.push({
				from: overAllocated[i].departmentId,
				to: underAllocated[i].departmentId,
				resource: 'headcount' as const,
				amount: 2,
				expectedROI: 1.5,
				reasoning: '성과가 우수한 부서에서 지원이 필요한 부서로 리소스 이동',
			})
		}

		return {
			departments: allocations,
			reallocationSuggestions,
		}
	}
}

export const resourceOptimizerService = new ResourceOptimizerService()

