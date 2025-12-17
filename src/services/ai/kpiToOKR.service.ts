/**
 * AI KPI to OKR Recommendation Service
 * KPI 기반 OKR 자동 생성 서비스
 */

import type { KPI, KPICategory, AIGeneratedOKR, AIGeneratedKeyResult, AIGeneratedTask } from '../../types/kpi.types'

/**
 * OKR 패턴 인터페이스
 */
interface OKRPattern {
	type: string
	titleTemplate: string
	descriptionTemplate: string
	keyResultTemplates: string[]
	taskTemplates: Array<{
		title: string
		description: string
		duration: number  // minutes
	}>
}

/**
 * KPI 기반 OKR 자동 생성 서비스
 */
export class KPIToOKRService {
	
	/**
	 * KPI 분석 후 OKR 자동 추천
	 */
	async generateOKRsForKPI(kpi: KPI): Promise<AIGeneratedOKR[]> {
		// 1. KPI 카테고리별 OKR 패턴 로드
		const patterns = this.getOKRPatternsByCategory(kpi.category)
		
		// 2. 현재 gap 계산
		const gap = kpi.metric.target - kpi.metric.current
		const progressRate = (kpi.metric.current / kpi.metric.target) * 100
		
		// 3. 필요한 OKR 개수 결정
		const numOKRs = this.calculateRequiredOKRs(progressRate)
		
		// 4. AI 기반 OKR 생성
		const generatedOKRs: AIGeneratedOKR[] = []
		
		for (let i = 0; i < Math.min(numOKRs, patterns.length); i++) {
			const okr = await this.generateSingleOKR(kpi, patterns[i], i, numOKRs)
			generatedOKRs.push(okr)
		}
		
		return generatedOKRs
	}
	
	/**
	 * 단일 OKR 생성
	 */
	private async generateSingleOKR(
		kpi: KPI,
		pattern: OKRPattern,
		index: number,
		totalOKRs: number
	): Promise<AIGeneratedOKR> {
		const gap = kpi.metric.target - kpi.metric.current
		const progressRate = (kpi.metric.current / kpi.metric.target) * 100
		
		// OKR별 KPI 기여도 분배
		const contribution = this.calculateExpectedContribution(index, totalOKRs)
		
		// 제목 생성
		const title = this.generateOKRTitle(kpi, pattern, gap, contribution)
		
		// 설명 생성
		const description = this.generateOKRDescription(kpi, pattern, gap)
		
		// Key Results 생성
		const keyResults = await this.generateKeyResults(kpi, pattern, contribution)
		
		// 신뢰도 계산
		const confidenceScore = this.calculateConfidenceScore(kpi, pattern, progressRate)
		
		// 추천 이유
		const reasoning = this.generateReasoning(kpi, pattern, gap, progressRate, contribution)
		
		return {
			id: `okr-ai-${Date.now()}-${index}`,
			title,
			description,
			confidenceScore,
			reasoning,
			expectedKPIContribution: contribution,
			suggestedKeyResults: keyResults,
			estimatedResources: this.estimateResources(kpi, pattern),
			feasibility: this.assessFeasibility(kpi, pattern, progressRate),
			category: pattern.type,
			priority: this.determinePriority(contribution, progressRate),
		}
	}
	
	/**
	 * KPI 카테고리별 OKR 패턴
	 */
	private getOKRPatternsByCategory(category: KPICategory): OKRPattern[] {
		const patterns: Record<KPICategory, OKRPattern[]> = {
			revenue: [
				{
					type: 'increase-sales',
					titleTemplate: '신규 수익원 확보를 통한 매출 증대',
					descriptionTemplate: '새로운 고객층 확보와 신제품/서비스 출시로 매출 기반을 다각화합니다',
					keyResultTemplates: [
						'신규 고객 {count}명 확보',
						'평균 거래액 {percent}% 증가',
						'신규 제품 라인 {count}개 출시'
					],
					taskTemplates: [
						{ title: '타겟 고객 세그먼트 분석', description: '신규 고객층의 니즈와 페인 포인트 파악', duration: 240 },
						{ title: '영업 전략 수립', description: '신규 고객 확보를 위한 영업 프로세스 설계', duration: 180 },
						{ title: '마케팅 캠페인 기획', description: '타겟 고객 대상 마케팅 자료 및 캠페인 준비', duration: 300 },
						{ title: '영업 팀 교육', description: '신규 고객 대응을 위한 영업팀 역량 강화', duration: 120 },
						{ title: '성과 모니터링 시스템 구축', description: '신규 고객 전환율 추적 대시보드 구축', duration: 180 },
					]
				},
				{
					type: 'optimize-pricing',
					titleTemplate: '가격 정책 최적화로 수익성 개선',
					descriptionTemplate: '데이터 기반 가격 전략으로 마진율을 높이고 고객 가치를 극대화합니다',
					keyResultTemplates: [
						'프리미엄 상품 매출 비중 {percent}% 달성',
						'할인율 {percent}%p 감소',
						'평균 객단가 {percent}% 증가'
					],
					taskTemplates: [
						{ title: '가격 탄력성 분석', description: '제품별 가격 민감도 및 경쟁사 가격 조사', duration: 240 },
						{ title: '가격 전략 시뮬레이션', description: '다양한 가격 시나리오별 매출/마진 예측', duration: 180 },
						{ title: '프리미엄 라인 개발', description: '고마진 프리미엄 제품/서비스 기획', duration: 360 },
						{ title: '가격 정책 문서화', description: '새로운 가격 정책 가이드라인 작성', duration: 120 },
						{ title: '영업팀 가격 교육', description: '신규 가격 정책에 대한 교육 실시', duration: 90 },
					]
				},
				{
					type: 'customer-retention',
					titleTemplate: '고객 유지율 향상을 통한 안정적 매출 확보',
					descriptionTemplate: '기존 고객과의 관계를 강화하여 재구매율을 높이고 이탈을 방지합니다',
					keyResultTemplates: [
						'고객 이탈률 {percent}% 감소',
						'재구매율 {percent}% 달성',
						'고객 생애 가치(LTV) {percent}% 증가'
					],
					taskTemplates: [
						{ title: '이탈 예측 모델 구축', description: '고객 행동 데이터 기반 이탈 위험 고객 식별', duration: 300 },
						{ title: '리텐션 프로그램 설계', description: '고객 충성도 프로그램 및 혜택 체계 구축', duration: 240 },
						{ title: '개인화 커뮤니케이션', description: '고객별 맞춤 메시지 및 오퍼 자동화', duration: 180 },
						{ title: '고객 성공팀 운영', description: '주요 고객 대상 전담 관리 체계 구축', duration: 120 },
						{ title: '피드백 루프 구축', description: '고객 의견 수렴 및 개선 사항 반영 프로세스', duration: 150 },
					]
				}
			],
			customer: [
				{
					type: 'satisfaction',
					titleTemplate: '고객 만족도 {target}점 달성',
					descriptionTemplate: '고객 경험을 개선하여 높은 만족도와 긍정적 평판을 구축합니다',
					keyResultTemplates: [
						'NPS 점수 {score}점 달성',
						'고객 이탈률 {percent}% 이하 감소',
						'고객 리뷰 평점 {score}점 이상 유지'
					],
					taskTemplates: [
						{ title: '고객 여정 맵핑', description: '모든 터치포인트에서 고객 경험 분석', duration: 240 },
						{ title: 'VOC 수집 시스템', description: '고객 피드백 수집 및 분석 자동화', duration: 180 },
						{ title: '페인 포인트 개선', description: '주요 불만 사항 해결 우선순위 실행', duration: 360 },
						{ title: 'CS 팀 교육', description: '고객 응대 품질 향상 교육 프로그램', duration: 120 },
						{ title: '만족도 측정 체계', description: '실시간 만족도 추적 대시보드 구축', duration: 150 },
					]
				},
				{
					type: 'engagement',
					titleTemplate: '고객 참여도 향상으로 활성 사용자 증대',
					descriptionTemplate: '고객의 제품/서비스 사용 빈도와 깊이를 높여 가치를 극대화합니다',
					keyResultTemplates: [
						'월 활성 사용자(MAU) {count}명 달성',
						'평균 사용 시간 {percent}% 증가',
						'기능 활용률 {percent}% 달성'
					],
					taskTemplates: [
						{ title: '사용자 행동 분석', description: '주요 기능별 사용 패턴 및 이탈 지점 파악', duration: 240 },
						{ title: '온보딩 최적화', description: '신규 사용자 활성화율 개선', duration: 180 },
						{ title: '참여 유도 기능', description: '게임화, 알림 등 참여 촉진 요소 추가', duration: 300 },
						{ title: '콘텐츠 전략 수립', description: '고객 관심사 기반 콘텐츠 큐레이션', duration: 150 },
						{ title: '커뮤니티 활성화', description: '사용자 간 네트워크 효과 창출', duration: 180 },
					]
				}
			],
			product: [
				{
					type: 'feature-delivery',
					titleTemplate: '핵심 기능 {count}개 출시로 제품 경쟁력 강화',
					descriptionTemplate: '고객 요구사항을 반영한 핵심 기능을 개발하여 제품 가치를 높입니다',
					keyResultTemplates: [
						'사용자 요청 상위 {count}개 기능 개발 완료',
						'신기능 채택률 {percent}% 달성',
						'기능별 만족도 {score}점 이상'
					],
					taskTemplates: [
						{ title: '기능 우선순위 분석', description: '고객 요청 및 비즈니스 임팩트 기반 우선순위 결정', duration: 180 },
						{ title: '기술 스펙 작성', description: '개발 요구사항 및 아키텍처 설계', duration: 240 },
						{ title: '프로토타입 개발', description: 'MVP 버전 개발 및 내부 테스트', duration: 480 },
						{ title: '베타 테스트', description: '선별된 사용자 그룹 대상 피드백 수집', duration: 240 },
						{ title: '정식 출시 및 모니터링', description: '전체 사용자 대상 출시 및 지표 추적', duration: 120 },
					]
				},
				{
					type: 'quality',
					titleTemplate: '제품 품질 {percent}% 개선',
					descriptionTemplate: '안정성과 성능을 향상시켜 고객 경험을 최적화합니다',
					keyResultTemplates: [
						'버그 발생률 {percent}% 감소',
						'시스템 응답 속도 {percent}% 향상',
						'시스템 가용성 {percent}% 달성'
					],
					taskTemplates: [
						{ title: '품질 지표 정의', description: '주요 품질 메트릭 및 목표치 설정', duration: 120 },
						{ title: '자동화 테스트 구축', description: 'CI/CD 파이프라인에 테스트 자동화 통합', duration: 360 },
						{ title: '코드 리뷰 프로세스', description: '품질 향상을 위한 코드 리뷰 체계화', duration: 180 },
						{ title: '성능 최적화', description: '병목 지점 분석 및 개선', duration: 300 },
						{ title: '모니터링 시스템', description: '실시간 품질 지표 모니터링 대시보드', duration: 240 },
					]
				}
			],
			growth: [
				{
					type: 'user-acquisition',
					titleTemplate: '사용자 기반 {multiplier}배 확대',
					descriptionTemplate: '효과적인 마케팅과 바이럴 전략으로 신규 사용자를 빠르게 확보합니다',
					keyResultTemplates: [
						'신규 가입자 {count}명 확보',
						'월 활성 사용자(MAU) {count}명 달성',
						'전환율 {percent}% 달성'
					],
					taskTemplates: [
						{ title: '채널별 획득 전략', description: '각 마케팅 채널의 ROI 분석 및 최적화', duration: 240 },
						{ title: '바이럴 메커니즘', description: '추천 프로그램 및 공유 인센티브 설계', duration: 180 },
						{ title: '랜딩 페이지 최적화', description: '전환율 향상을 위한 A/B 테스트', duration: 150 },
						{ title: '콘텐츠 마케팅', description: 'SEO 최적화 콘텐츠 제작 및 배포', duration: 300 },
						{ title: '파트너십 개발', description: '전략적 제휴를 통한 사용자 유입', duration: 240 },
					]
				},
				{
					type: 'market-expansion',
					titleTemplate: '신규 시장 진출로 성장 동력 확보',
					descriptionTemplate: '새로운 지역이나 고객 세그먼트로 사업을 확장합니다',
					keyResultTemplates: [
						'신규 시장 {count}개 진출',
						'신규 시장 매출 비중 {percent}% 달성',
						'현지화 완료율 {percent}% 달성'
					],
					taskTemplates: [
						{ title: '시장 조사', description: '타겟 시장의 규모, 경쟁, 규제 환경 분석', duration: 300 },
						{ title: '현지화 전략', description: '언어, 문화, 결제 시스템 등 현지화 계획', duration: 240 },
						{ title: '파일럿 프로그램', description: '소규모 테스트를 통한 시장 반응 확인', duration: 360 },
						{ title: '파트너 네트워크', description: '현지 파트너 발굴 및 협력 체계 구축', duration: 240 },
						{ title: '마케팅 캠페인', description: '현지 특성에 맞는 마케팅 실행', duration: 300 },
					]
				}
			],
			operations: [
				{
					type: 'efficiency',
					titleTemplate: '운영 효율성 {percent}% 향상',
					descriptionTemplate: '프로세스 개선과 자동화로 비용을 절감하고 생산성을 높입니다',
					keyResultTemplates: [
						'처리 시간 {percent}% 단축',
						'운영 비용 {percent}% 절감',
						'자동화율 {percent}% 달성'
					],
					taskTemplates: [
						{ title: '프로세스 매핑', description: '현재 업무 프로세스 전체 흐름 분석', duration: 240 },
						{ title: '병목 지점 식별', description: '비효율 구간 및 개선 기회 발굴', duration: 180 },
						{ title: '자동화 도구 도입', description: '반복 작업 자동화 솔루션 구현', duration: 360 },
						{ title: '표준화 가이드', description: '업무 표준 프로세스 문서화', duration: 150 },
						{ title: '성과 측정', description: '개선 효과 추적 및 지속적 최적화', duration: 120 },
					]
				}
			],
			team: [
				{
					type: 'talent',
					titleTemplate: '팀 역량 강화 및 {count}명 채용',
					descriptionTemplate: '우수 인재를 확보하고 팀원의 역량을 개발하여 조직 경쟁력을 높입니다',
					keyResultTemplates: [
						'핵심 포지션 {count}개 충원',
						'직원 만족도 {score}점 달성',
						'교육 이수율 {percent}% 달성'
					],
					taskTemplates: [
						{ title: '인력 계획 수립', description: '필요 역량 및 채용 우선순위 결정', duration: 180 },
						{ title: '채용 프로세스 개선', description: '효과적인 채용 전략 및 면접 프로세스', duration: 240 },
						{ title: '온보딩 프로그램', description: '신입 사원 적응 및 생산성 향상 지원', duration: 150 },
						{ title: '교육 체계 구축', description: '역량 개발 프로그램 설계 및 운영', duration: 300 },
						{ title: '문화 조성', description: '팀워크 및 협업 문화 강화 활동', duration: 120 },
					]
				}
			],
			quality: [
				{
					type: 'improvement',
					titleTemplate: '품질 지표 {percent}% 개선',
					descriptionTemplate: '체계적인 품질 관리로 고객 신뢰를 높이고 리스크를 최소화합니다',
					keyResultTemplates: [
						'불량률 {percent}% 감소',
						'고객 클레임 {count}건 이하',
						'품질 점수 {score}점 달성'
					],
					taskTemplates: [
						{ title: '품질 기준 정의', description: '명확한 품질 기준 및 검수 체크리스트', duration: 180 },
						{ title: '검수 프로세스', description: '단계별 품질 검증 절차 확립', duration: 240 },
						{ title: '근본 원인 분석', description: '품질 이슈 발생 원인 파악 및 재발 방지', duration: 300 },
						{ title: '교육 프로그램', description: '품질 의식 향상 교육 실시', duration: 150 },
						{ title: '지속적 개선', description: '품질 개선 아이디어 수집 및 실행', duration: 180 },
					]
				}
			],
			efficiency: [
				{
					type: 'productivity',
					titleTemplate: '생산성 {percent}% 향상',
					descriptionTemplate: '업무 방식을 혁신하여 더 적은 리소스로 더 많은 성과를 창출합니다',
					keyResultTemplates: [
						'작업 처리량 {percent}% 증가',
						'리드 타임 {percent}% 단축',
						'리소스 활용률 {percent}% 달성'
					],
					taskTemplates: [
						{ title: '생산성 지표 정의', description: '핵심 생산성 메트릭 설정 및 현황 파악', duration: 120 },
						{ title: '툴 및 시스템 개선', description: '생산성 향상 도구 도입 및 최적화', duration: 300 },
						{ title: '워크플로우 재설계', description: '비효율적인 업무 흐름 개선', duration: 240 },
						{ title: '역량 강화', description: '생산성 향상 기법 교육 및 코칭', duration: 180 },
						{ title: '베스트 프랙티스 공유', description: '우수 사례 발굴 및 전파', duration: 120 },
					]
				}
			]
		}
		
		return patterns[category] || patterns['revenue']
	}
	
	/**
	 * OKR 제목 생성
	 */
	private generateOKRTitle(
		kpi: KPI,
		pattern: OKRPattern,
		gap: number,
		contribution: number
	): string {
		let title = pattern.titleTemplate
		
		// 템플릿 변수 치환
		const percentGap = Math.round((gap / kpi.metric.target) * 100)
		const targetIncrease = Math.round((gap / kpi.metric.current) * 100)
		
		title = title.replace('{target}', kpi.metric.target.toString())
		title = title.replace('{percent}', percentGap.toString())
		title = title.replace('{count}', Math.ceil(gap / 10).toString())
		title = title.replace('{multiplier}', Math.ceil(targetIncrease / 100).toString())
		
		return title
	}
	
	/**
	 * OKR 설명 생성
	 */
	private generateOKRDescription(
		kpi: KPI,
		pattern: OKRPattern,
		gap: number
	): string {
		return pattern.descriptionTemplate
	}
	
	/**
	 * Key Results 자동 생성
	 */
	private async generateKeyResults(
		kpi: KPI,
		pattern: OKRPattern,
		okrContribution: number
	): Promise<AIGeneratedKeyResult[]> {
		const keyResults: AIGeneratedKeyResult[] = []
		
		pattern.keyResultTemplates.forEach((template, index) => {
			// 각 KR의 기여도 계산 (OKR 기여도를 KR들에게 분배)
			const krContribution = okrContribution / pattern.keyResultTemplates.length
			const krTarget = Math.round((kpi.metric.target * krContribution) / 100)
			
			// 템플릿 변수 치환
			let description = template
			description = description.replace('{count}', Math.ceil(krTarget / 5).toString())
			description = description.replace('{percent}', Math.round(krContribution).toString())
			description = description.replace('{score}', (80 + index * 5).toString())
			
			const kr: AIGeneratedKeyResult = {
				id: `kr-ai-${Date.now()}-${index}`,
				description,
				target: krTarget || 100,
				current: 0,
				unit: kpi.metric.unit,
				confidenceScore: 0.85 - (index * 0.05),
				suggestedTasks: this.generateTasksForKR(pattern, index)
			}
			
			keyResults.push(kr)
		})
		
		return keyResults
	}
	
	/**
	 * Task 자동 생성
	 */
	private generateTasksForKR(
		pattern: OKRPattern,
		krIndex: number
	): AIGeneratedTask[] {
		// 각 KR마다 해당 패턴의 태스크 중 일부를 할당
		const tasksPerKR = Math.ceil(pattern.taskTemplates.length / 3)
		const startIdx = krIndex * tasksPerKR
		const endIdx = Math.min(startIdx + tasksPerKR, pattern.taskTemplates.length)
		
		return pattern.taskTemplates.slice(startIdx, endIdx).map((template, idx) => ({
			id: `task-ai-${Date.now()}-${krIndex}-${idx}`,
			title: template.title,
			description: template.description,
			priority: idx === 0 ? 'high' : 'medium',
			estimatedDuration: template.duration,
			suggestedDeadline: this.calculateTaskDeadline(idx, tasksPerKR),
			confidenceScore: 0.8
		}))
	}
	
	/**
	 * Task 마감일 계산
	 */
	private calculateTaskDeadline(taskIndex: number, totalTasks: number): string {
		const weeksPerTask = 12 / totalTasks  // 분기(12주) 기준
		const deadline = new Date()
		deadline.setDate(deadline.getDate() + (taskIndex + 1) * weeksPerTask * 7)
		return deadline.toISOString().split('T')[0]
	}
	
	/**
	 * 신뢰도 점수 계산
	 */
	private calculateConfidenceScore(
		kpi: KPI,
		pattern: OKRPattern,
		progressRate: number
	): number {
		let score = 0.7  // 기본 점수
		
		// 진척률이 높을수록 신뢰도 증가
		if (progressRate > 50) score += 0.15
		else if (progressRate > 30) score += 0.10
		
		// 우선순위가 높을수록 신뢰도 증가
		if (kpi.priority === 'critical') score += 0.10
		else if (kpi.priority === 'high') score += 0.05
		
		return Math.min(score, 0.95)
	}
	
	/**
	 * 추천 이유 생성
	 */
	private generateReasoning(
		kpi: KPI,
		pattern: OKRPattern,
		gap: number,
		progressRate: number,
		contribution: number
	): string {
		const reasons: string[] = []
		
		reasons.push(`현재 KPI "${kpi.name}" 달성률은 ${Math.round(progressRate)}%입니다.`)
		reasons.push(`목표 달성을 위해 ${gap}${kpi.metric.unit}의 갭을 해소해야 합니다.`)
		reasons.push(`이 OKR은 KPI 목표의 약 ${Math.round(contribution)}%를 달성하는 데 기여할 것으로 예상됩니다.`)
		
		if (progressRate < 30) {
			reasons.push('현재 진척률이 낮아 적극적인 액션이 필요한 상황입니다.')
		} else if (progressRate < 70) {
			reasons.push('목표 달성 가능성을 높이기 위한 추가 노력이 필요합니다.')
		}
		
		return reasons.join(' ')
	}
	
	/**
	 * OKR별 KPI 기여도 계산
	 */
	private calculateExpectedContribution(index: number, totalOKRs: number): number {
		// 첫 번째 OKR이 가장 높은 기여도
		const weights = [40, 35, 25, 20]  // 합이 100%를 넘을 수 있음 (중복 효과)
		return weights[index] || 20
	}
	
	/**
	 * 리소스 예측
	 */
	private estimateResources(kpi: KPI, pattern: OKRPattern) {
		const timeMap: Record<string, string> = {
			'increase-sales': '2-3개월',
			'optimize-pricing': '1-2개월',
			'customer-retention': '2-4개월',
			'satisfaction': '2-3개월',
			'engagement': '1-2개월',
			'feature-delivery': '3-4개월',
			'quality': '2-3개월',
			'user-acquisition': '2-3개월',
			'market-expansion': '4-6개월',
			'efficiency': '1-2개월',
			'talent': '2-4개월',
			'improvement': '2-3개월',
			'productivity': '1-2개월'
		}
		
		const skillsMap: Record<string, string[]> = {
			'increase-sales': ['영업', '마케팅', '데이터 분석'],
			'optimize-pricing': ['재무 분석', '데이터 분석', '마케팅'],
			'customer-retention': ['고객 성공', 'CRM', '데이터 분석'],
			'satisfaction': ['고객 서비스', 'UX 디자인', '프로젝트 관리'],
			'engagement': ['제품 관리', 'UX 디자인', '데이터 분석'],
			'feature-delivery': ['소프트웨어 개발', '제품 관리', 'QA'],
			'quality': ['QA', '프로세스 개선', '프로젝트 관리'],
			'user-acquisition': ['디지털 마케팅', 'SEO/SEM', '콘텐츠 제작'],
			'market-expansion': ['시장 조사', '사업 개발', '현지화'],
			'efficiency': ['프로세스 개선', '자동화', '데이터 분석'],
			'talent': ['HR', '채용', '교육 및 개발'],
			'improvement': ['품질 관리', '프로세스 개선', '교육'],
			'productivity': ['프로세스 개선', '도구 관리', '프로젝트 관리']
		}
		
		return {
			timeRequired: timeMap[pattern.type] || '2-3개월',
			teamSize: pattern.type.includes('expansion') || pattern.type.includes('feature') ? 5 : 3,
			requiredSkills: skillsMap[pattern.type] || ['프로젝트 관리', '데이터 분석']
		}
	}
	
	/**
	 * 실행 가능성 평가
	 */
	private assessFeasibility(
		kpi: KPI,
		pattern: OKRPattern,
		progressRate: number
	) {
		let score = 0.7
		
		// 현재 진척률이 높으면 실행 가능성 증가
		if (progressRate > 50) score += 0.15
		else if (progressRate < 30) score -= 0.10
		
		const challenges: string[] = []
		const successFactors: string[] = []
		
		if (progressRate < 30) {
			challenges.push('현재 진척률이 낮아 목표 달성에 많은 노력이 필요합니다')
		}
		if (kpi.priority === 'critical') {
			challenges.push('높은 우선순위로 인해 리소스 집중이 필요합니다')
			successFactors.push('경영진의 높은 관심과 지원')
		}
		
		successFactors.push('명확한 목표와 측정 가능한 지표')
		successFactors.push('정기적인 진척도 모니터링')
		
		return {
			score: Math.max(0.4, Math.min(0.9, score)),
			challenges,
			successFactors
		}
	}
	
	/**
	 * 필요한 OKR 개수 계산
	 */
	private calculateRequiredOKRs(progressRate: number): number {
		if (progressRate < 30) return 3  // 진척률 낮음 → 3개
		if (progressRate < 70) return 2  // 진척률 보통 → 2개
		return 2  // 진척률 높음 → 2개 (마무리 집중)
	}
	
	/**
	 * 우선순위 결정
	 */
	private determinePriority(
		contribution: number,
		progressRate: number
	): 'high' | 'medium' | 'low' {
		if (contribution >= 35 || progressRate < 30) return 'high'
		if (contribution >= 25 || progressRate < 50) return 'medium'
		return 'low'
	}
}

export const kpiToOKRService = new KPIToOKRService()
