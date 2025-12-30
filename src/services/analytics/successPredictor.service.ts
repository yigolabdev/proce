/**
 * Success Predictor Service
 * 목표 달성 가능성 예측 및 성공 요인 분석
 */

import type { Project, Objective, TaskRecommendation, WorkEntry } from '../../types/common.types'
import type { KPI } from '../../types/kpi.types'
import { storage } from '../../utils/storage'
import { patternAnalyzerService, type AchievabilityPrediction } from './patternAnalyzer.service'
import { differenceInDays } from 'date-fns'

/**
 * 성공 예측 결과
 */
export interface SuccessPrediction {
	targetId: string
	targetType: 'project' | 'okr' | 'kpi'
	targetName: string
	
	// 예측 점수
	successProbability: number  // 0-1
	confidence: number  // 0-1
	
	// 근거
	reasoning: {
		strengths: string[]
		concerns: string[]
		criticalFactors: string[]
	}
	
	// 예측 결과
	estimatedCompletionDate: string
	estimatedFinalProgress: number  // 0-100
	
	// 대응 방안
	suggestedActions: SuggestedAction[]
	
	// 비교 데이터
	comparisonToSimilar: {
		betterThan: number  // 유사 목표 중 몇 %보다 좋은지
		averageProgress: number
		topPerformers: number
	}
}

export interface SuggestedAction {
	type: 'add_resource' | 'adjust_timeline' | 'reduce_scope' | 'increase_focus' | 'seek_help'
	priority: 'high' | 'medium' | 'low'
	title: string
	description: string
	expectedImpact: string
}

/**
 * 예측 서비스
 */
export class SuccessPredictorService {
	/**
	 * 프로젝트 성공 예측
	 */
	async predictProjectSuccess(project: Project): Promise<SuccessPrediction> {
		const projects = storage.get<Project[]>('projects', [])
		const workEntries = storage.get<WorkEntry[]>('workEntries', [])

		// 1. 유사 프로젝트 찾기
		const similarProjects = this.findSimilarProjects(project, projects)
		
		// 2. 성공 확률 계산
		const successProbability = this.calculateProjectSuccessProbability(
			project,
			similarProjects,
			workEntries
		)

		// 3. 강점/우려사항 분석
		const reasoning = this.analyzeProjectFactors(project, workEntries)

		// 4. 완료일 예측
		const estimatedCompletionDate = this.estimateProjectCompletion(project, workEntries)

		// 5. 최종 진척도 예측
		const estimatedFinalProgress = this.predictFinalProgress(
			project.progress,
			successProbability,
			project
		)

		// 6. 제안 생성
		const suggestedActions = this.generateProjectActions(
			project,
			successProbability,
			reasoning
		)

		// 7. 비교 분석
		const comparisonToSimilar = this.compareToSimilarProjects(
			project,
			similarProjects
		)

		return {
			targetId: project.id,
			targetType: 'project',
			targetName: project.name,
			successProbability,
			confidence: similarProjects.length >= 3 ? 0.8 : 0.5,
			reasoning,
			estimatedCompletionDate,
			estimatedFinalProgress,
			suggestedActions,
			comparisonToSimilar,
		}
	}

	/**
	 * OKR 성공 예측
	 */
	async predictOKRSuccess(objective: Objective): Promise<SuccessPrediction> {
		// PatternAnalyzer의 결과 활용
		const prediction = await patternAnalyzerService.predictAchievability(objective)

		const reasoning = {
			strengths: this.identifyOKRStrengths(objective),
			concerns: prediction.risks.map(r => r.type),
			criticalFactors: [
				'Key Results의 측정 가능성',
				'팀의 역량',
				'시간 배분',
			],
		}

		const suggestedActions = this.convertRisksToActions(prediction.risks)

		return {
			targetId: objective.id,
			targetType: 'okr',
			targetName: objective.title,
			successProbability: prediction.achievabilityScore / 100,
			confidence: prediction.confidence,
			reasoning,
			estimatedCompletionDate: prediction.estimatedCompletionDate || (typeof objective.endDate === 'string' ? objective.endDate : objective.endDate?.toISOString()) || '',
			estimatedFinalProgress: prediction.achievabilityScore,
			suggestedActions: [...suggestedActions, ...this.generateOKRActions(objective, prediction.achievabilityScore)],
			comparisonToSimilar: {
				betterThan: prediction.basedOn.historicalSuccessRate * 100,
				averageProgress: 75,
				topPerformers: 90,
			},
		}
	}

	/**
	 * KPI 목표 달성 예측
	 */
	async predictKPISuccess(kpi: KPI): Promise<SuccessPrediction> {
		const kpis = storage.get<KPI[]>('kpis', [])
		
		// 현재 진척률
		const currentProgress = (kpi.metric.current / kpi.metric.target) * 100

		// 기간 분석
		const startDate = new Date(kpi.startDate)
		const endDate = new Date(kpi.endDate)
		const now = new Date()
		const totalDays = differenceInDays(endDate, startDate)
		const elapsedDays = differenceInDays(now, startDate)
		const remainingDays = differenceInDays(endDate, now)
		const timeProgress = totalDays > 0 ? (elapsedDays / totalDays) * 100 : 0

		// 진척률 vs 시간 비율
		const progressVsTime = currentProgress / (timeProgress || 1)

		// 성공 확률
		let successProbability = 0.5
		if (progressVsTime >= 1.2) successProbability = 0.9  // 앞서가는 경우
		else if (progressVsTime >= 1.0) successProbability = 0.8
		else if (progressVsTime >= 0.8) successProbability = 0.6
		else successProbability = 0.4  // 뒤처지는 경우

		// 최종 진척도 예측
		const estimatedFinalProgress = Math.min(100, currentProgress * (1 / (timeProgress / 100)))

		// 분석
		const reasoning = {
			strengths: this.identifyKPIStrengths(kpi, currentProgress, timeProgress),
			concerns: this.identifyKPIConcerns(kpi, currentProgress, timeProgress),
			criticalFactors: [
				'현재 달성 속도',
				'남은 기간',
				'리소스 가용성',
			],
		}

		// 조치 사항
		const suggestedActions = this.generateKPIActions(
			kpi,
			currentProgress,
			timeProgress,
			remainingDays
		)

		return {
			targetId: kpi.id,
			targetType: 'kpi',
			targetName: kpi.name,
			successProbability,
			confidence: 0.7,
			reasoning,
			estimatedCompletionDate: endDate.toISOString(),
			estimatedFinalProgress,
			suggestedActions,
			comparisonToSimilar: {
				betterThan: progressVsTime >= 1.0 ? 70 : 40,
				averageProgress: 75,
				topPerformers: 95,
			},
		}
	}

	/**
	 * 유사 프로젝트 찾기
	 */
	private findSimilarProjects(project: Project, allProjects: Project[]): Project[] {
		return allProjects.filter(p => {
			if (p.id === project.id || p.status !== 'completed') return false

			// 유사성 점수 계산
			let score = 0

			// 부서가 같으면
			if (p.departments?.some(d => project.departments?.includes(d))) score += 0.3

			// 우선순위가 같으면
			if (p.priority === project.priority) score += 0.2

			// 팀 크기가 비슷하면
			const sizeDiff = Math.abs((p.members?.length || 0) - (project.members?.length || 0))
			if (sizeDiff <= 2) score += 0.3

			// 기간이 비슷하면
			const p1Days = differenceInDays(new Date(p.endDate), new Date(p.startDate))
			const p2Days = differenceInDays(new Date(project.endDate), new Date(project.startDate))
			if (Math.abs(p1Days - p2Days) <= 30) score += 0.2

			return score >= 0.5
		})
	}

	/**
	 * 프로젝트 성공 확률 계산
	 */
	private calculateProjectSuccessProbability(
		project: Project,
		similarProjects: Project[],
		workEntries: WorkEntry[]
	): number {
		let score = 0.5  // 기본값

		// 1. 과거 유사 프로젝트의 성공률
		if (similarProjects.length > 0) {
			const successRate = similarProjects.filter(p => p.progress >= 100).length / similarProjects.length
			score = successRate * 0.4 + score * 0.6
		}

		// 2. 현재 진척도
		const timeElapsed = this.getTimeProgress(project)
		const progressVsTime = project.progress / (timeElapsed || 1)
		
		if (progressVsTime >= 1.2) score += 0.2
		else if (progressVsTime < 0.8) score -= 0.2

		// 3. 최근 활동
		const recentWork = workEntries.filter(w => 
			w.projectId === project.id &&
			differenceInDays(new Date(), new Date(w.date)) <= 7
		)
		if (recentWork.length > 0) score += 0.1

		// 4. 팀 구성
		if (project.members && project.members.length >= 3) score += 0.1

		return Math.max(0, Math.min(1, score))
	}

	/**
	 * 프로젝트 요인 분석
	 */
	private analyzeProjectFactors(project: Project, workEntries: WorkEntry[]) {
		const strengths: string[] = []
		const concerns: string[] = []

		// 진척도 확인
		if (project.progress >= 70) {
			strengths.push('높은 진척률')
		} else if (project.progress < 30) {
			concerns.push('낮은 진척률')
		}

		// 팀 구성
		if (project.members && project.members.length >= 3) {
			strengths.push('충분한 팀 구성')
		} else {
			concerns.push('제한적인 팀 크기')
		}

		// 최근 활동
		const recentWork = workEntries.filter(w =>
			w.projectId === project.id &&
			differenceInDays(new Date(), new Date(w.date)) <= 7
		)
		if (recentWork.length >= 5) {
			strengths.push('활발한 최근 활동')
		} else if (recentWork.length === 0) {
			concerns.push('최근 활동 없음')
		}

		// 마감일
		const daysRemaining = differenceInDays(new Date(project.endDate), new Date())
		if (daysRemaining > 30) {
			strengths.push('충분한 남은 기간')
		} else if (daysRemaining < 7) {
			concerns.push('마감일 임박')
		}

		return {
			strengths,
			concerns,
			criticalFactors: ['팀 협업', '일정 관리', '리소스 배분'],
		}
	}

	/**
	 * 프로젝트 완료일 예측
	 */
	private estimateProjectCompletion(project: Project, workEntries: WorkEntry[]): string {
		const projectWork = workEntries.filter(w => w.projectId === project.id)
		if (projectWork.length === 0) return new Date(project.endDate).toISOString()

		// 최근 4주의 평균 진척도 계산
		const recentWork = projectWork
			.filter(w => differenceInDays(new Date(), new Date(w.date)) <= 28)
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

		if (recentWork.length < 3) return new Date(project.endDate).toISOString()

		// 주간 평균 진척도
		const weeklyProgress = (recentWork.length / 4) * 2.5  // 추정
		const remainingProgress = 100 - project.progress
		const weeksNeeded = remainingProgress / weeklyProgress

		const estimatedDate = new Date()
		estimatedDate.setDate(estimatedDate.getDate() + weeksNeeded * 7)

		return estimatedDate.toISOString()
	}

	/**
	 * 최종 진척도 예측
	 */
	private predictFinalProgress(
		currentProgress: number,
		successProbability: number,
		project: Project
	): number {
		const timeProgress = this.getTimeProgress(project)
		const progressRate = currentProgress / (timeProgress || 1)
		
		// 현재 속도로 진행 시
		const projected = Math.min(100, progressRate * 100)
		
		// 성공 확률로 조정
		return Math.round(projected * (0.5 + successProbability * 0.5))
	}

	/**
	 * 프로젝트 조치사항 생성
	 */
	private generateProjectActions(
		project: Project,
		successProbability: number,
		reasoning: any
	): SuggestedAction[] {
		const actions: SuggestedAction[] = []

		// 성공 확률이 낮은 경우
		if (successProbability < 0.6) {
			actions.push({
				type: 'add_resource',
				priority: 'high',
				title: '리소스 추가 투입',
				description: '프로젝트 성공 확률을 높이기 위해 팀원을 추가하거나 예산을 증액하세요',
				expectedImpact: '성공 확률 20-30% 향상',
			})
		}

		// 일정이 촉박한 경우
		const daysRemaining = differenceInDays(new Date(project.endDate), new Date())
		if (daysRemaining < 14 && project.progress < 80) {
			actions.push({
				type: 'adjust_timeline',
				priority: 'high',
				title: '일정 재조정',
				description: '현실적인 완료 시점을 재설정하세요',
				expectedImpact: '스트레스 감소, 품질 향상',
			})
		}

		// 진척이 느린 경우
		if (project.progress < 50 && this.getTimeProgress(project) > 50) {
			actions.push({
				type: 'increase_focus',
				priority: 'high',
				title: '집중도 향상',
				description: '핵심 기능에 집중하고 우선순위를 명확히 하세요',
				expectedImpact: '진척도 15-20% 개선',
			})
		}

		return actions
	}

	/**
	 * OKR 강점 식별
	 */
	private identifyOKRStrengths(objective: Objective): string[] {
		const strengths: string[] = []

		if (objective.keyResults.length >= 3 && objective.keyResults.length <= 5) {
			strengths.push('적절한 Key Results 수')
		}

		if (objective.keyResults.every(kr => kr.target > 0)) {
			strengths.push('측정 가능한 목표 설정')
		}

		if (objective.progress >= 50) {
			strengths.push('순조로운 진척도')
		}

		return strengths
	}

	/**
	 * 리스크를 조치사항으로 변환
	 */
	private convertRisksToActions(risks: any[]): SuggestedAction[] {
		return risks.slice(0, 3).map(risk => ({
			type: 'reduce_scope',
			priority: risk.impact === 'high' ? 'high' : 'medium',
			title: `${risk.type} 대응`,
			description: risk.mitigation,
			expectedImpact: '리스크 완화',
		}))
	}

	/**
	 * OKR 조치사항 생성
	 */
	private generateOKRActions(objective: Objective, achievabilityScore: number): SuggestedAction[] {
		const actions: SuggestedAction[] = []

		if (achievabilityScore < 70 && objective.keyResults.length > 5) {
			actions.push({
				type: 'reduce_scope',
				priority: 'medium',
				title: 'Key Results 간소화',
				description: '핵심 KR 3-5개로 집중하세요',
				expectedImpact: '집중도 향상, 달성 확률 증가',
			})
		}

		return actions
	}

	/**
	 * KPI 강점 식별
	 */
	private identifyKPIStrengths(kpi: KPI, currentProgress: number, timeProgress: number): string[] {
		const strengths: string[] = []

		if (currentProgress >= timeProgress) {
			strengths.push('목표를 앞서가는 진척도')
		}

		if (kpi.priority === 'critical' || kpi.priority === 'high') {
			strengths.push('높은 우선순위로 관리됨')
		}

		return strengths
	}

	/**
	 * KPI 우려사항 식별
	 */
	private identifyKPIConcerns(kpi: KPI, currentProgress: number, timeProgress: number): string[] {
		const concerns: string[] = []

		if (currentProgress < timeProgress * 0.7) {
			concerns.push('진척도가 시간 대비 부족')
		}

		if (kpi.metric.current < kpi.metric.target * 0.5 && timeProgress > 75) {
			concerns.push('목표 달성이 어려울 수 있음')
		}

		return concerns
	}

	/**
	 * KPI 조치사항 생성
	 */
	private generateKPIActions(
		kpi: KPI,
		currentProgress: number,
		timeProgress: number,
		remainingDays: number
	): SuggestedAction[] {
		const actions: SuggestedAction[] = []

		// 뒤처지는 경우
		if (currentProgress < timeProgress * 0.8) {
			actions.push({
				type: 'increase_focus',
				priority: 'high',
				title: '가속화 필요',
				description: `목표 달성을 위해 ${kpi.name}에 더 집중하세요`,
				expectedImpact: '진척도 개선',
			})
		}

		// 목표 조정 고려
		if (remainingDays < 14 && currentProgress < 60) {
			actions.push({
				type: 'adjust_timeline',
				priority: 'medium',
				title: '목표치 재검토',
				description: '현실적인 목표로 조정을 고려하세요',
				expectedImpact: '달성 가능성 향상',
			})
		}

		return actions
	}

	/**
	 * Helper: 시간 진척률 계산
	 */
	private getTimeProgress(project: Project): number {
		const startDate = new Date(project.startDate)
		const endDate = new Date(project.endDate)
		const now = new Date()

		const totalDays = differenceInDays(endDate, startDate)
		const elapsedDays = differenceInDays(now, startDate)

		return totalDays > 0 ? (elapsedDays / totalDays) * 100 : 0
	}

	/**
	 * Helper: 유사 프로젝트와 비교
	 */
	private compareToSimilarProjects(project: Project, similarProjects: Project[]) {
		if (similarProjects.length === 0) {
			return {
				betterThan: 50,
				averageProgress: 75,
				topPerformers: 95,
			}
		}

		const avgProgress = similarProjects.reduce((sum, p) => sum + p.progress, 0) / similarProjects.length
		const betterCount = similarProjects.filter(p => project.progress > p.progress).length
		const betterThan = (betterCount / similarProjects.length) * 100

		const topProgress = Math.max(...similarProjects.map(p => p.progress))

		return {
			betterThan,
			averageProgress: Math.round(avgProgress),
			topPerformers: Math.round(topProgress),
		}
	}
}

// Singleton instance
export const successPredictorService = new SuccessPredictorService()

