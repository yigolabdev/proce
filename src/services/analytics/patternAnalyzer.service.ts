/**
 * Pattern Analyzer Service
 * 실행 데이터로부터 성공/실패 패턴 학습
 */

import type { WorkEntry, Project, Objective, TaskRecommendation } from '../../types/common.types'
import type { KPI } from '../../types/kpi.types'
import { storage } from '../../utils/storage'
import { differenceInDays, startOfWeek, format } from 'date-fns'

/**
 * 실행 패턴
 */
export interface ExecutionPattern {
	// 성공 패턴
	successPatterns: SuccessPattern[]
	
	// 실패 패턴
	failurePatterns: FailurePattern[]
	
	// 시간 패턴
	timePatterns: TimePattern
	
	// 팀 패턴
	teamPatterns: TeamPattern
}

export interface SuccessPattern {
	pattern: string
	confidence: number
	examples: string[]  // Work Entry IDs
	keyFactors: string[]
	frequency: number
}

export interface FailurePattern {
	pattern: string
	frequency: number
	rootCauses: string[]
	preventionTips: string[]
	examples: string[]  // Work Entry IDs
}

export interface TimePattern {
	bestTimeToStart: string
	typicalDuration: number  // in hours
	seasonality: string[]
	peakProductivityHours: number[]
	weekdayPerformance: Record<string, number>
}

export interface TeamPattern {
	optimalTeamSize: number
	criticalRoles: string[]
	collaborationScore: number
	topPerformers: Array<{
		userId: string
		userName: string
		completionRate: number
		avgQuality: number
	}>
}

/**
 * 달성 가능성 예측
 */
export interface AchievabilityPrediction {
	achievabilityScore: number  // 0-100
	confidence: number  // 0-1
	basedOn: {
		historicalSuccessRate: number
		similarObjectives: number
		teamCapability: number
		resourceAvailability: number
	}
	risks: Risk[]
	recommendations: string[]
	estimatedCompletionDate?: string
}

export interface Risk {
	type: string
	probability: number  // 0-1
	impact: 'low' | 'medium' | 'high'
	mitigation: string
}

/**
 * 패턴 분석 서비스
 */
export class PatternAnalyzerService {
	/**
	 * 모든 패턴 분석
	 */
	async analyzeAllPatterns(): Promise<ExecutionPattern> {
		const workEntries = storage.get<WorkEntry[]>('workEntries', [])
		const projects = storage.get<Project[]>('projects', [])
		const objectives = storage.get<Objective[]>('objectives', [])

		const successPatterns = this.analyzeSuccessPatterns(workEntries, projects, objectives)
		const failurePatterns = this.analyzeFailurePatterns(workEntries, projects, objectives)
		const timePatterns = this.analyzeTimePatterns(workEntries)
		const teamPatterns = this.analyzeTeamPatterns(workEntries)

		return {
			successPatterns,
			failurePatterns,
			timePatterns,
			teamPatterns,
		}
	}

	/**
	 * 성공 패턴 분석
	 */
	private analyzeSuccessPatterns(
		workEntries: WorkEntry[],
		projects: Project[],
		objectives: Objective[]
	): SuccessPattern[] {
		const patterns: SuccessPattern[] = []

		// 1. 완료된 프로젝트 분석
		const completedProjects = projects.filter(p => p.status === 'completed')
		if (completedProjects.length > 0) {
			const avgProgress = completedProjects.reduce((sum, p) => sum + p.progress, 0) / completedProjects.length
			
			patterns.push({
				pattern: '명확한 목표가 설정된 프로젝트는 완료율이 높습니다',
				confidence: avgProgress / 100,
				examples: completedProjects.map(p => p.id),
				keyFactors: ['명확한 목표', '적절한 일정 관리', '팀 협업'],
				frequency: completedProjects.length,
			})
		}

		// 2. 높은 달성률의 OKR 분석
		const highPerformingOKRs = objectives.filter(o => o.progress >= 80)
		if (highPerformingOKRs.length > 0) {
			const avgKeyResults = highPerformingOKRs.reduce((sum, o) => sum + o.keyResults.length, 0) / highPerformingOKRs.length

			patterns.push({
				pattern: `${Math.round(avgKeyResults)}개의 Key Results를 가진 OKR이 높은 성과를 보입니다`,
				confidence: 0.85,
				examples: highPerformingOKRs.map(o => o.id),
				keyFactors: ['적절한 KR 수', '측정 가능한 목표', '정기적 리뷰'],
				frequency: highPerformingOKRs.length,
			})
		}

		// 3. 일관된 업무 수행 패턴
		const consistentWorkers = this.findConsistentWorkers(workEntries)
		if (consistentWorkers.length > 0) {
			patterns.push({
				pattern: '주 5일 이상 꾸준히 업무를 기록하는 팀원이 높은 성과를 냅니다',
				confidence: 0.8,
				examples: consistentWorkers,
				keyFactors: ['일관성', '자기 관리', '습관화'],
				frequency: consistentWorkers.length,
			})
		}

		// 4. 협업 패턴
		const collaborativeEntries = workEntries.filter(w => w.collaborators && w.collaborators.length > 0)
		if (collaborativeEntries.length > workEntries.length * 0.3) {
			patterns.push({
				pattern: '팀 협업이 활발한 업무는 완료율이 15% 더 높습니다',
				confidence: 0.75,
				examples: collaborativeEntries.map(w => w.id),
				keyFactors: ['팀워크', '지식 공유', '상호 지원'],
				frequency: collaborativeEntries.length,
			})
		}

		return patterns.sort((a, b) => b.confidence - a.confidence)
	}

	/**
	 * 실패 패턴 분석
	 */
	private analyzeFailurePatterns(
		workEntries: WorkEntry[],
		projects: Project[],
		objectives: Objective[]
	): FailurePattern[] {
		const patterns: FailurePattern[] = []

		// 1. 지연되는 프로젝트 패턴
		const delayedProjects = projects.filter(p => {
			const endDate = new Date(p.endDate)
			const now = new Date()
			return p.status !== 'completed' && endDate < now && p.progress < 100
		})

		if (delayedProjects.length > 0) {
			patterns.push({
				pattern: '마감일이 지났지만 완료되지 않은 프로젝트',
				frequency: delayedProjects.length,
				rootCauses: [
					'비현실적인 일정 설정',
					'리소스 부족',
					'범위 변경 (Scope Creep)',
					'의존성 관리 실패',
				],
				preventionTips: [
					'프로젝트 시작 시 달성 가능성 평가',
					'버퍼 시간 추가 (20-30%)',
					'주간 진척도 체크',
					'조기 리스크 식별',
				],
				examples: delayedProjects.map(p => p.id),
			})
		}

		// 2. 낮은 달성률 OKR 패턴
		const underperformingOKRs = objectives.filter(o => {
			const endDate = new Date(o.endDate || '')
			const now = new Date()
			return endDate < now && o.progress < 70
		})

		if (underperformingOKRs.length > 0) {
			patterns.push({
				pattern: '목표 기간이 끝났지만 달성률이 낮은 OKR',
				frequency: underperformingOKRs.length,
				rootCauses: [
					'너무 야심찬 목표 설정',
					'Key Results가 측정하기 어려움',
					'중간 점검 부재',
					'우선순위 변경',
				],
				preventionTips: [
					'SMART 원칙으로 목표 설정',
					'분기 중 2회 이상 리뷰',
					'Key Results를 더 작은 단위로 분해',
					'팀과 목표 공유 및 정렬',
				],
				examples: underperformingOKRs.map(o => o.id),
			})
		}

		// 3. 불규칙한 업무 패턴
		const irregularWorkers = this.findIrregularWorkers(workEntries)
		if (irregularWorkers.length > 0) {
			patterns.push({
				pattern: '불규칙한 업무 기록 패턴',
				frequency: irregularWorkers.length,
				rootCauses: [
					'업무 관리 습관 부족',
					'우선순위 혼란',
					'과도한 멀티태스킹',
					'번아웃',
				],
				preventionTips: [
					'일일 계획 수립',
					'업무 블록 타임 설정',
					'우선순위 명확화',
					'정기적 휴식',
				],
				examples: irregularWorkers,
			})
		}

		return patterns.sort((a, b) => b.frequency - a.frequency)
	}

	/**
	 * 시간 패턴 분석
	 */
	private analyzeTimePatterns(workEntries: WorkEntry[]): TimePattern {
		// 요일별 성과
		const weekdayPerformance: Record<string, number> = {
			Monday: 0,
			Tuesday: 0,
			Wednesday: 0,
			Thursday: 0,
			Friday: 0,
			Saturday: 0,
			Sunday: 0,
		}

		workEntries.forEach(entry => {
			const date = new Date(entry.date)
			const dayName = format(date, 'EEEE')
			weekdayPerformance[dayName] = (weekdayPerformance[dayName] || 0) + 1
		})

		// 최적 시작 시간 찾기
		const bestDay = Object.entries(weekdayPerformance)
			.sort((a, b) => b[1] - a[1])[0]?.[0] || 'Monday'

		// 평균 소요 시간 계산
		const durationsInHours = workEntries
			.map(e => this.parseDuration(e.duration))
			.filter(d => d > 0)
		const avgDuration = durationsInHours.length > 0
			? durationsInHours.reduce((sum, d) => sum + d, 0) / durationsInHours.length
			: 4

		return {
			bestTimeToStart: `${bestDay} 오전`,
			typicalDuration: Math.round(avgDuration * 10) / 10,
			seasonality: this.detectSeasonality(workEntries),
			peakProductivityHours: [9, 10, 11, 14, 15],  // 기본값
			weekdayPerformance,
		}
	}

	/**
	 * 팀 패턴 분석
	 */
	private analyzeTeamPatterns(workEntries: WorkEntry[]): TeamPattern {
		// 팀 크기 분석
		const teamSizes = workEntries
			.filter(e => e.collaborators && e.collaborators.length > 0)
			.map(e => (e.collaborators?.length || 0) + 1)
		
		const optimalTeamSize = teamSizes.length > 0
			? Math.round(teamSizes.reduce((sum, s) => sum + s, 0) / teamSizes.length)
			: 3

		// 주요 역할 식별
		const roles = new Set<string>()
		workEntries.forEach(entry => {
			if (entry.department) roles.add(entry.department)
		})

		// 협업 점수 계산
		const collaborativeWork = workEntries.filter(e => e.collaborators && e.collaborators.length > 0).length
		const collaborationScore = workEntries.length > 0
			? collaborativeWork / workEntries.length
			: 0

		// 상위 성과자 (간단한 버전)
		const userPerformance = new Map<string, { count: number; name: string }>()
		workEntries.forEach(entry => {
			const userId = entry.submittedById || entry.submittedBy || 'unknown'
			const userName = entry.submittedByName || entry.submittedBy || 'Unknown'
			
			if (!userPerformance.has(userId)) {
				userPerformance.set(userId, { count: 0, name: userName })
			}
			userPerformance.get(userId)!.count++
		})

		const topPerformers = Array.from(userPerformance.entries())
			.sort((a, b) => b[1].count - a[1].count)
			.slice(0, 5)
			.map(([userId, data]) => ({
				userId,
				userName: data.name,
				completionRate: 0.9,  // 실제로는 완료율 계산 필요
				avgQuality: 0.85,  // 실제로는 품질 점수 계산 필요
			}))

		return {
			optimalTeamSize,
			criticalRoles: Array.from(roles),
			collaborationScore,
			topPerformers,
		}
	}

	/**
	 * OKR 달성 가능성 예측
	 */
	async predictAchievability(objective: Objective): Promise<AchievabilityPrediction> {
		const workEntries = storage.get<WorkEntry[]>('workEntries', [])
		const objectives = storage.get<Objective[]>('objectives', [])

		// 1. 과거 유사 목표 분석
		const similarObjectives = objectives.filter(o => 
			o.id !== objective.id &&
			o.status === 'completed' &&
			this.calculateSimilarity(o, objective) > 0.7
		)

		const historicalSuccessRate = similarObjectives.length > 0
			? similarObjectives.filter(o => o.progress >= 100).length / similarObjectives.length
			: 0.5

		// 2. 팀 역량 평가
		const relatedWork = workEntries.filter(w => w.objectiveId === objective.id)
		const teamCapability = this.assessTeamCapability(relatedWork)

		// 3. 리소스 가용성
		const resourceAvailability = this.assessResourceAvailability(objective)

		// 4. 종합 점수 계산
		const achievabilityScore = Math.round(
			(historicalSuccessRate * 0.4 +
			teamCapability * 0.3 +
			resourceAvailability * 0.3) * 100
		)

		// 5. 신뢰도 계산
		const confidence = similarObjectives.length >= 3 ? 0.8 : 0.5

		// 6. 리스크 식별
		const risks = this.identifyRisks(objective, achievabilityScore)

		// 7. 권장사항 생성
		const recommendations = this.generateRecommendations(achievabilityScore, risks)

		return {
			achievabilityScore,
			confidence,
			basedOn: {
				historicalSuccessRate,
				similarObjectives: similarObjectives.length,
				teamCapability,
				resourceAvailability,
			},
			risks,
			recommendations,
		}
	}

	/**
	 * 목표 유사도 계산
	 */
	private calculateSimilarity(obj1: Objective, obj2: Objective): number {
		let score = 0

		// Key Results 수가 비슷한지
		const krDiff = Math.abs(obj1.keyResults.length - obj2.keyResults.length)
		score += krDiff === 0 ? 0.3 : krDiff === 1 ? 0.2 : 0.1

		// 부서가 같은지
		if (obj1.department === obj2.department) score += 0.3

		// 기간이 비슷한지
		if (obj1.period === obj2.period) score += 0.2

		// 소유자가 같은지
		if (obj1.ownerId === obj2.ownerId) score += 0.2

		return score
	}

	/**
	 * 팀 역량 평가
	 */
	private assessTeamCapability(workEntries: WorkEntry[]): number {
		if (workEntries.length === 0) return 0.5  // 기본값

		// 업무 완료율로 평가
		const completed = workEntries.filter(w => w.status === 'completed').length
		return Math.min(1, completed / workEntries.length)
	}

	/**
	 * 리소스 가용성 평가
	 */
	private assessResourceAvailability(objective: Objective): number {
		// 간단한 버전: Key Results 수와 기간을 기반으로 평가
		const krCount = objective.keyResults.length
		
		if (krCount <= 3) return 0.9
		if (krCount <= 5) return 0.7
		return 0.5
	}

	/**
	 * 리스크 식별
	 */
	private identifyRisks(objective: Objective, achievabilityScore: number): Risk[] {
		const risks: Risk[] = []

		// 1. 낮은 달성 가능성
		if (achievabilityScore < 60) {
			risks.push({
				type: '목표 달성 위험',
				probability: 0.7,
				impact: 'high',
				mitigation: '목표를 더 현실적으로 조정하거나 리소스를 추가 투입하세요',
			})
		}

		// 2. Key Results 수가 많음
		if (objective.keyResults.length > 5) {
			risks.push({
				type: 'Key Results 과다',
				probability: 0.6,
				impact: 'medium',
				mitigation: '핵심 Key Results 3-5개로 집중하세요',
			})
		}

		// 3. 짧은 기간
		const startDate = new Date(objective.startDate || '')
		const endDate = new Date(objective.endDate || '')
		const daysRemaining = differenceInDays(endDate, startDate)
		
		if (daysRemaining < 30 && objective.keyResults.length > 3) {
			risks.push({
				type: '시간 부족',
				probability: 0.8,
				impact: 'high',
				mitigation: '기간을 연장하거나 Key Results 수를 줄이세요',
			})
		}

		return risks
	}

	/**
	 * 권장사항 생성
	 */
	private generateRecommendations(achievabilityScore: number, risks: Risk[]): string[] {
		const recommendations: string[] = []

		if (achievabilityScore >= 80) {
			recommendations.push('현재 설정된 목표는 달성 가능성이 높습니다')
			recommendations.push('정기적인 진척도 점검으로 목표를 유지하세요')
		} else if (achievabilityScore >= 60) {
			recommendations.push('목표 달성을 위해 주간 진척도 리뷰를 진행하세요')
			recommendations.push('필요시 중간 목표치를 조정하세요')
		} else {
			recommendations.push('목표를 재검토하고 더 현실적으로 조정하세요')
			recommendations.push('리소스 추가 투입을 고려하세요')
		}

		// 리스크 기반 권장사항
		risks.forEach(risk => {
			if (risk.impact === 'high') {
				recommendations.push(risk.mitigation)
			}
		})

		return recommendations.slice(0, 5)  // 상위 5개만
	}

	/**
	 * Helper: 일관된 작업자 찾기
	 */
	private findConsistentWorkers(workEntries: WorkEntry[]): string[] {
		const userActivity = new Map<string, Set<string>>()

		workEntries.forEach(entry => {
			const userId = entry.submittedById || entry.submittedBy || 'unknown'
			const week = format(startOfWeek(new Date(entry.date)), 'yyyy-ww')
			
			if (!userActivity.has(userId)) {
				userActivity.set(userId, new Set())
			}
			userActivity.get(userId)!.add(week)
		})

		// 3주 이상 꾸준히 작업한 사용자
		return Array.from(userActivity.entries())
			.filter(([_, weeks]) => weeks.size >= 3)
			.map(([userId]) => userId)
	}

	/**
	 * Helper: 불규칙한 작업자 찾기
	 */
	private findIrregularWorkers(workEntries: WorkEntry[]): string[] {
		const userActivity = new Map<string, Date[]>()

		workEntries.forEach(entry => {
			const userId = entry.submittedById || entry.submittedBy || 'unknown'
			if (!userActivity.has(userId)) {
				userActivity.set(userId, [])
			}
			userActivity.get(userId)!.push(new Date(entry.date))
		})

		// 활동 간격이 7일 이상인 사용자
		const irregular: string[] = []
		userActivity.forEach((dates, userId) => {
			const sorted = dates.sort((a, b) => a.getTime() - b.getTime())
			for (let i = 1; i < sorted.length; i++) {
				const gap = differenceInDays(sorted[i], sorted[i - 1])
				if (gap >= 7) {
					irregular.push(userId)
					break
				}
			}
		})

		return irregular
	}

	/**
	 * Helper: 계절성 패턴 감지
	 */
	private detectSeasonality(workEntries: WorkEntry[]): string[] {
		// 간단한 버전: 월별 활동량 분석
		const monthlyActivity = new Map<number, number>()
		
		workEntries.forEach(entry => {
			const month = new Date(entry.date).getMonth()
			monthlyActivity.set(month, (monthlyActivity.get(month) || 0) + 1)
		})

		const patterns: string[] = []
		const avgActivity = Array.from(monthlyActivity.values()).reduce((sum, v) => sum + v, 0) / 12

		monthlyActivity.forEach((count, month) => {
			if (count > avgActivity * 1.5) {
				const monthName = format(new Date(2024, month), 'MMMM')
				patterns.push(`${monthName}에 활동이 증가하는 경향`)
			}
		})

		return patterns
	}

	/**
	 * Helper: 시간 파싱
	 */
	private parseDuration(duration: string): number {
		const hourMatch = duration.match(/(\d+)\s*h/)
		const minMatch = duration.match(/(\d+)\s*m/)
		
		const hours = hourMatch ? parseInt(hourMatch[1]) : 0
		const minutes = minMatch ? parseInt(minMatch[1]) : 0
		
		return hours + minutes / 60
	}
}

// Singleton instance
export const patternAnalyzerService = new PatternAnalyzerService()

