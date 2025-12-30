/**
 * Goal Simulator Service
 * 목표 달성 시뮬레이션 엔진 (What-if 분석)
 */

import type { Project, Objective } from '../../types/common.types'
import type { KPI } from '../../types/kpi.types'

export type ChangeType = 'resource' | 'timeline' | 'scope' | 'team'

export interface SimulationScenario {
	name: string
	changes: {
		type: ChangeType
		description: string
		value: any
	}[]
	
	predictedOutcome: {
		successProbability: number
		expectedCompletion: Date
		estimatedCost: number
		riskLevel: 'low' | 'medium' | 'high'
		
		impact: {
			onKPIs: Array<{kpiId: string; change: number}>
			onOKRs: Array<{okrId: string; change: number}>
			onTeam: string
		}
	}
	
	recommendations: {
		shouldProceed: boolean
		alternatives: string[]
		considerations: string[]
	}
}

export class GoalSimulatorService {
	async simulateScenario(
		targetType: 'project' | 'okr' | 'kpi',
		targetId: string,
		changes: SimulationScenario['changes']
	): Promise<SimulationScenario> {
		// 변경사항 분석
		const resourceChange = changes.find(c => c.type === 'resource')
		const timelineChange = changes.find(c => c.type === 'timeline')
		const scopeChange = changes.find(c => c.type === 'scope')

		// 성공 확률 계산
		let successProbability = 0.7  // 기본값

		if (resourceChange && resourceChange.value > 0) {
			successProbability += 0.15  // 리소스 추가 시 15% 증가
		}

		if (timelineChange && timelineChange.value > 0) {
			successProbability += 0.1  // 기간 연장 시 10% 증가
		}

		if (scopeChange && scopeChange.value < 0) {
			successProbability += 0.1  // 범위 축소 시 10% 증가
		}

		successProbability = Math.min(1, successProbability)

		// 예상 완료일 계산
		const baseDate = new Date()
		const timeExtension = timelineChange?.value || 0
		const expectedCompletion = new Date(baseDate)
		expectedCompletion.setDate(expectedCompletion.getDate() + timeExtension)

		// 비용 추정
		const baseCost = 10000000  // 기본 비용
		const resourceCost = (resourceChange?.value || 0) * 5000000  // 인당 500만원
		const estimatedCost = baseCost + resourceCost

		// 리스크 레벨
		const riskLevel: 'low' | 'medium' | 'high' = 
			successProbability >= 0.8 ? 'low' :
			successProbability >= 0.6 ? 'medium' : 'high'

		return {
			name: '시나리오 분석',
			changes,
			predictedOutcome: {
				successProbability,
				expectedCompletion,
				estimatedCost,
				riskLevel,
				impact: {
					onKPIs: [],
					onOKRs: [],
					onTeam: `팀 부담 ${resourceChange?.value > 0 ? '완화' : '유지'}`,
				},
			},
			recommendations: {
				shouldProceed: successProbability >= 0.7,
				alternatives: successProbability < 0.7 ? [
					'추가 리소스 투입 검토',
					'범위 재조정',
					'단계별 출시 고려',
				] : [],
				considerations: [
					'팀 역량 확인 필요',
					'예산 승인 필요',
					'일정 조율 필요',
				],
			},
		}
	}
}

export const goalSimulatorService = new GoalSimulatorService()

