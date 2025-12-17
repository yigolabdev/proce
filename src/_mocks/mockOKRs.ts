/**
 * Mock OKRs Data
 * 
 * OKR은 개인 목표로 정의됨
 * team 필드 없이 개인 중심으로 구성
 */

import type { Objective } from '../types/okr.types'

export const mockObjectives: Objective[] = [
	{
		id: 'okr-1',
		title: '코드 품질 향상',
		description: '코드 리뷰 프로세스 개선 및 테스트 커버리지 증가',
		period: 'Q1 2024',
		periodType: 'quarter',
		owner: 'John Doe',
		ownerId: 'user-1',
		department: 'Engineering',
		status: 'on-track',
		startDate: '2024-01-01',
		endDate: '2024-03-31',
		keyResults: [
			{
				id: 'kr-1-1',
				description: '테스트 커버리지 80% 이상 달성',
				target: 80,
				current: 65,
				unit: '%',
				owner: 'John Doe',
				ownerId: 'user-1',
				aiAnalysis: {
					onTrack: true,
					predictedFinalValue: 78,
					confidence: 0.85,
					recommendations: [
						'주요 모듈부터 테스트 작성 시작',
						'매주 5% 증가 목표 유지'
					]
				}
			},
			{
				id: 'kr-1-2',
				description: '코드 리뷰 완료율 95% 이상',
				target: 95,
				current: 88,
				unit: '%',
				owner: 'John Doe',
				ownerId: 'user-1',
				aiAnalysis: {
					onTrack: true,
					predictedFinalValue: 94,
					confidence: 0.9,
					recommendations: [
						'리뷰 시간 단축을 위한 가이드라인 정립'
					]
				}
			},
			{
				id: 'kr-1-3',
				description: '버그 발견률 30% 감소',
				target: 30,
				current: 18,
				unit: '%',
				owner: 'John Doe',
				ownerId: 'user-1'
			}
		],
		kpiId: 'kpi-quality',
		kpiName: 'Code Quality Score',
		kpiContribution: 40
	},
	{
		id: 'okr-2',
		title: '개인 기술 역량 강화',
		description: '새로운 기술 스택 학습 및 인증 취득',
		period: 'Q1 2024',
		periodType: 'quarter',
		owner: 'Jane Smith',
		ownerId: 'user-2',
		department: 'Engineering',
		status: 'at-risk',
		startDate: '2024-01-01',
		endDate: '2024-03-31',
		keyResults: [
			{
				id: 'kr-2-1',
				description: 'AWS Certified Solutions Architect 자격증 취득',
				target: 1,
				current: 0,
				unit: '개',
				owner: 'Jane Smith',
				ownerId: 'user-2',
				aiAnalysis: {
					onTrack: false,
					predictedFinalValue: 0.7,
					confidence: 0.6,
					recommendations: [
						'학습 시간 증가 필요',
						'모의고사 점수 80점 이상 도달 후 시험 응시'
					]
				}
			},
			{
				id: 'kr-2-2',
				description: '기술 블로그 포스트 작성',
				target: 12,
				current: 5,
				unit: '개',
				owner: 'Jane Smith',
				ownerId: 'user-2',
				aiAnalysis: {
					onTrack: false,
					predictedFinalValue: 9,
					confidence: 0.75,
					recommendations: [
						'주당 1개 작성으로 페이스 증가',
						'짧은 포스트로 시작하여 부담 감소'
					]
				}
			}
		]
	},
	{
		id: 'okr-3',
		title: '프로젝트 리드 역량 개발',
		description: '프로젝트 관리 능력 향상 및 팀 리더십 강화',
		period: 'Q1 2024',
		periodType: 'quarter',
		owner: 'Alice Johnson',
		ownerId: 'user-3',
		department: 'Design',
		status: 'on-track',
		startDate: '2024-01-01',
		endDate: '2024-03-31',
		keyResults: [
			{
				id: 'kr-3-1',
				description: '프로젝트 일정 준수율',
				target: 90,
				current: 85,
				unit: '%',
				owner: 'Alice Johnson',
				ownerId: 'user-3',
				aiAnalysis: {
					onTrack: true,
					predictedFinalValue: 92,
					confidence: 0.88,
					recommendations: [
						'버퍼 시간 10% 확보',
						'주간 진행 상황 체크 유지'
					]
				}
			},
			{
				id: 'kr-3-2',
				description: '팀원 만족도 점수',
				target: 4.5,
				current: 4.3,
				unit: '점',
				owner: 'Alice Johnson',
				ownerId: 'user-3'
			},
			{
				id: 'kr-3-3',
				description: '1:1 미팅 완료율',
				target: 100,
				current: 95,
				unit: '%',
				owner: 'Alice Johnson',
				ownerId: 'user-3'
			}
		]
	},
	{
		id: 'okr-4',
		title: '고객 만족도 향상',
		description: '고객 응대 품질 개선 및 응답 시간 단축',
		period: 'Q1 2024',
		periodType: 'quarter',
		owner: 'Bob Wilson',
		ownerId: 'user-4',
		department: 'Customer Success',
		status: 'on-track',
		startDate: '2024-01-01',
		endDate: '2024-03-31',
		keyResults: [
			{
				id: 'kr-4-1',
				description: '평균 응답 시간 4시간 이내',
				target: 4,
				current: 5.2,
				unit: '시간',
				owner: 'Bob Wilson',
				ownerId: 'user-4',
				aiAnalysis: {
					onTrack: true,
					predictedFinalValue: 3.8,
					confidence: 0.82,
					recommendations: [
						'템플릿 활용으로 응답 시간 단축',
						'우선순위 높은 티켓 먼저 처리'
					]
				}
			},
			{
				id: 'kr-4-2',
				description: '고객 만족도 점수 (CSAT)',
				target: 4.7,
				current: 4.5,
				unit: '점',
				owner: 'Bob Wilson',
				ownerId: 'user-4'
			}
		]
	},
	{
		id: 'okr-5',
		title: '데이터 분석 역량 강화',
		description: '데이터 기반 의사결정을 위한 분석 능력 향상',
		period: '2024년 1월',
		periodType: 'month',
		owner: 'Charlie Brown',
		ownerId: 'user-5',
		department: 'Data Science',
		status: 'completed',
		startDate: '2024-01-01',
		endDate: '2024-01-31',
		keyResults: [
			{
				id: 'kr-5-1',
				description: 'SQL 쿼리 최적화 건수',
				target: 10,
				current: 12,
				unit: '건',
				owner: 'Charlie Brown',
				ownerId: 'user-5',
				aiAnalysis: {
					onTrack: true,
					predictedFinalValue: 12,
					confidence: 1.0,
					recommendations: [
						'목표 달성 완료'
					]
				}
			},
			{
				id: 'kr-5-2',
				description: '대시보드 구축',
				target: 3,
				current: 3,
				unit: '개',
				owner: 'Charlie Brown',
				ownerId: 'user-5'
			}
		]
	},
	{
		id: 'okr-6',
		title: '영업 실적 목표 달성',
		description: '분기별 영업 목표 달성 및 신규 고객 확보',
		period: 'Q1 2024',
		periodType: 'quarter',
		owner: 'Diana Prince',
		ownerId: 'user-6',
		department: 'Sales',
		status: 'behind',
		startDate: '2024-01-01',
		endDate: '2024-03-31',
		keyResults: [
			{
				id: 'kr-6-1',
				description: '신규 계약 건수',
				target: 15,
				current: 6,
				unit: '건',
				owner: 'Diana Prince',
				ownerId: 'user-6',
				aiAnalysis: {
					onTrack: false,
					predictedFinalValue: 11,
					confidence: 0.65,
					recommendations: [
						'파이프라인 강화 필요',
						'주간 미팅 횟수 증가',
						'프로모션 활용 고려'
					]
				}
			},
			{
				id: 'kr-6-2',
				description: '영업 목표 달성률',
				target: 100,
				current: 55,
				unit: '%',
				owner: 'Diana Prince',
				ownerId: 'user-6',
				aiAnalysis: {
					onTrack: false,
					predictedFinalValue: 85,
					confidence: 0.7,
					recommendations: [
						'리드 전환율 개선 집중',
						'기존 고객 업셀 기회 탐색'
					]
				}
			}
		]
	}
]

/**
 * OKR mock 데이터 초기화
 */
export function initializeMockOKRs(): void {
	const existing = localStorage.getItem('objectives')
	if (!existing || JSON.parse(existing).length === 0) {
		localStorage.setItem('objectives', JSON.stringify(mockObjectives))
	}
}

