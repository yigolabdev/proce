/**
 * Alignment Checker Service
 * 전략-KPI-OKR 정렬도 분석
 */

import type { CompanyStrategy } from '../../types/strategy.types'
import type { KPI } from '../../types/kpi.types'
import type { Objective } from '../../types/okr.types'
import { storage } from '../../utils/storage'

export interface AlignmentResult {
	overallScore: number  // 0-100
	strategyToKPI: number
	kpiToOKR: number
	orphanOKRs: Objective[]
	unlinkedKPIs: KPI[]
	recommendations: string[]
}

export class AlignmentCheckerService {
	async checkAlignment(): Promise<AlignmentResult> {
		const strategy = storage.get<CompanyStrategy>('company_strategy')
		const kpis = storage.get<KPI[]>('kpis', [])
		const objectives = storage.get<Objective[]>('objectives', [])

		const strategyToKPI = strategy ? this.calculateStrategyKPIAlignment(strategy, kpis) : 0
		const kpiToOKR = this.calculateKPIOKRAlignment(kpis, objectives)
		const overallScore = (strategyToKPI + kpiToOKR) / 2

		const orphanOKRs = objectives.filter(o => !o.kpiId)
		const unlinkedKPIs = kpis.filter(k => !k.linkedObjectives || k.linkedObjectives.length === 0)

		return {
			overallScore,
			strategyToKPI,
			kpiToOKR,
			orphanOKRs,
			unlinkedKPIs,
			recommendations: this.generateRecommendations(orphanOKRs, unlinkedKPIs),
		}
	}

	private calculateStrategyKPIAlignment(strategy: CompanyStrategy, kpis: KPI[]): number {
		if (kpis.length === 0) return 0
		// 전략의 각 우선순위가 최소 1개의 KPI를 가지는지 확인
		const linkedCount = strategy.strategicPriorities.filter(p =>
			kpis.some(k => k.description?.includes(p.title))
		).length
		return (linkedCount / strategy.strategicPriorities.length) * 100
	}

	private calculateKPIOKRAlignment(kpis: KPI[], objectives: Objective[]): number {
		if (objectives.length === 0) return 100
		const linked = objectives.filter(o => o.kpiId).length
		return (linked / objectives.length) * 100
	}

	private generateRecommendations(orphanOKRs: Objective[], unlinkedKPIs: KPI[]): string[] {
		const recs: string[] = []
		if (orphanOKRs.length > 0) {
			recs.push(`${orphanOKRs.length}개의 OKR을 상위 KPI에 연결하세요`)
		}
		if (unlinkedKPIs.length > 0) {
			recs.push(`${unlinkedKPIs.length}개의 KPI에 실행 OKR을 생성하세요`)
		}
		return recs
	}
}

export const alignmentCheckerService = new AlignmentCheckerService()

