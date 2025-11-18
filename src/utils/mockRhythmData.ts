/**
 * Mock Rhythm Data
 * 
 * 리듬 기반 시스템을 테스트하기 위한 목업 데이터
 */

import { storage } from './storage'
import type { TaskRecommendation } from '../types/common.types'

/**
 * 리듬 테스트용 목업 데이터 초기화
 */
export function initializeMockRhythmData() {
	// 기존 데이터가 있으면 초기화하지 않음
	const existingManualTasks = storage.get<TaskRecommendation[]>('manual_tasks')
	if (existingManualTasks && existingManualTasks.length > 0) {
		return
	}
	
	// 현재 로그인한 사용자 ID 가져오기
	const authUser = storage.get<any>('auth_user')
	const userId = authUser?.id || 'user-1' // 기본값: user-1
	const now = new Date()
	
	// 긴급 작업 (마감 6시간 이내)
	const urgentTask: TaskRecommendation = {
		id: 'urgent-1',
		title: '클라이언트 미팅 준비 자료 작성',
		description: '오늘 오후 3시 미팅을 위한 발표 자료를 완성해야 합니다.',
		priority: 'high',
		status: 'pending',
		assignedTo: userId,
		assignedToName: '나',
		source: 'manual',
		projectId: 'project-1',
		projectName: '2024 Q4 전략 프로젝트',
		deadline: new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString(), // 3시간 후
		createdAt: now.toISOString(),
		createdBy: 'manager-1',
		createdByName: 'Manager',
		tags: ['urgent', 'presentation'],
		relatedMembers: [],
	}
	
	// 오늘 예정된 작업
	const scheduledTask1: TaskRecommendation = {
		id: 'scheduled-1',
		title: 'API 문서 업데이트',
		description: '새로 추가된 엔드포인트에 대한 문서를 작성합니다.',
		priority: 'medium',
		status: 'pending',
		assignedTo: userId,
		assignedToName: '나',
		source: 'ai',
		projectId: 'project-2',
		projectName: 'Proce 백엔드 개발',
		deadline: new Date(now.getTime() + 10 * 60 * 60 * 1000).toISOString(), // 오늘 안
		createdAt: now.toISOString(),
		createdBy: 'ai',
		createdByName: 'AI Assistant',
		tags: ['documentation'],
		relatedMembers: [],
	}
	
	const scheduledTask2: TaskRecommendation = {
		id: 'scheduled-2',
		title: '주간 업무 보고서 작성',
		description: '이번 주 진행한 업무 내용을 정리합니다.',
		priority: 'medium',
		status: 'pending',
		assignedTo: userId,
		assignedToName: '나',
		source: 'manual',
		projectId: 'project-1',
		projectName: '2024 Q4 전략 프로젝트',
		deadline: new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString(), // 오늘 안
		createdAt: now.toISOString(),
		createdBy: userId,
		createdByName: '나',
		tags: ['report'],
		relatedMembers: [],
	}
	
	// 진행 중인 작업
	const inProgressTask: TaskRecommendation = {
		id: 'progress-1',
		title: '리듬 기반 사이드바 UI 구현',
		description: 'Proce의 리듬 기반 사이드바를 구현하고 있습니다.',
		priority: 'high',
		status: 'accepted',
		assignedTo: userId,
		assignedToName: '나',
		source: 'ai',
		projectId: 'project-2',
		projectName: 'Proce 백엔드 개발',
		deadline: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2일 후
		createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2시간 전 시작
		createdBy: 'ai',
		createdByName: 'AI Assistant',
		tags: ['development', 'ui'],
		relatedMembers: [],
	}
	
	// 다음 예정 작업들 (선택 사항)
	const nextUpTask1: TaskRecommendation = {
		id: 'next-1',
		title: '사용자 피드백 분석',
		description: '베타 테스터들의 피드백을 정리하고 개선 방향을 도출합니다.',
		priority: 'medium',
		status: 'pending',
		assignedTo: userId,
		assignedToName: '나',
		source: 'manual',
		projectId: 'project-1',
		projectName: '2024 Q4 전략 프로젝트',
		deadline: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3일 후
		createdAt: now.toISOString(),
		createdBy: 'manager-1',
		createdByName: 'Manager',
		tags: ['analysis', 'feedback'],
		relatedMembers: [],
	}
	
	const nextUpTask2: TaskRecommendation = {
		id: 'next-2',
		title: '데이터베이스 최적화',
		description: '쿼리 성능을 개선하고 인덱스를 재구성합니다.',
		priority: 'low',
		status: 'pending',
		assignedTo: userId,
		assignedToName: '나',
		source: 'ai',
		projectId: 'project-2',
		projectName: 'Proce 백엔드 개발',
		deadline: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5일 후
		createdAt: now.toISOString(),
		createdBy: 'ai',
		createdByName: 'AI Assistant',
		tags: ['optimization', 'database'],
		relatedMembers: [],
	}
	
	// 완료된 작업
	const completedTask: TaskRecommendation = {
		id: 'completed-1',
		title: '코드 리뷰 완료',
		description: 'PR #234에 대한 코드 리뷰를 완료했습니다.',
		priority: 'medium',
		status: 'completed',
		assignedTo: userId,
		assignedToName: '나',
		source: 'manual',
		projectId: 'project-2',
		projectName: 'Proce 백엔드 개발',
		deadline: now.toISOString(),
		createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(), // 5시간 전
		createdBy: 'manager-1',
		createdByName: 'Manager',
		tags: ['code-review'],
		relatedMembers: [],
	}
	
	// 데이터 저장
	const manualTasks = [urgentTask, scheduledTask2, nextUpTask1]
	const aiTasks = [scheduledTask1, inProgressTask, nextUpTask2, completedTask]
	
	storage.set('manual_tasks', manualTasks)
	storage.set('ai_recommendations', aiTasks)
	
	// 리뷰 데이터 (검토 필요)
	const reviews = [
		{
			id: 'review-1',
			workId: 'work-1',
			workTitle: 'UI 디자인 시안 제출',
			reviewedBy: 'manager-1',
			reviewedByName: 'Manager',
			reviewType: 'commented',
			comment: '전반적으로 좋습니다. 다만 색상 대비를 조금 더 높여주세요.',
			reviewedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
			projectId: 'project-1',
			projectName: '2024 Q4 전략 프로젝트',
			isRead: false,
		},
		{
			id: 'review-2',
			workId: 'work-2',
			workTitle: 'API 성능 테스트 결과',
			reviewedBy: 'tech-lead-1',
			reviewedByName: 'Tech Lead',
			reviewType: 'approved',
			comment: '성능 개선이 눈에 띕니다. 잘하셨습니다!',
			reviewedAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
			projectId: 'project-2',
			projectName: 'Proce 백엔드 개발',
			isRead: false,
		},
	]
	
	storage.set('received_reviews', reviews)
	
	console.log('✅ Mock rhythm data initialized')
}

