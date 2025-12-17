/**
 * Central Mock Data Initialization
 * 
 * 모든 mock 데이터를 한 곳에서 초기화
 */

import { initializeMockProjects } from './mockProjects'
import { initializeMockUsers } from './mockUsers'
import { initializeMockDepartments } from './mockDepartments'
import { initializeMockOKRs } from './mockOKRs'
import { initializeMockOKRRecommendations } from './mockOKRRecommendations'

/**
 * 모든 mock 데이터 초기화
 * 
 * 앱 시작 시 한 번만 호출하면 됩니다
 */
export function initializeAllMockData(): void {
	console.log('🔄 Initializing all mock data...')
	
	try {
		initializeMockProjects()
		console.log('✅ Mock projects initialized')
		
		initializeMockUsers()
		console.log('✅ Mock users initialized')
		
		initializeMockDepartments()
		console.log('✅ Mock departments initialized')
		
		initializeMockOKRs()
		console.log('✅ Mock OKRs initialized')
		
		initializeMockOKRRecommendations()
		console.log('✅ Mock OKR recommendations initialized')
		
		console.log('✨ All mock data initialized successfully')
	} catch (error) {
		console.error('❌ Error initializing mock data:', error)
	}
}

/**
 * 모든 mock 데이터 초기화 (강제)
 * 
 * 기존 데이터를 덮어쓰고 초기화합니다
 */
export function resetAllMockData(): void {
	console.warn('⚠️  Resetting all mock data (this will overwrite existing data)...')
	
	localStorage.removeItem('projects')
	localStorage.removeItem('users')
	localStorage.removeItem('departments')
	localStorage.removeItem('objectives')
	localStorage.removeItem('workEntries')
	localStorage.removeItem('pending_reviews')
	localStorage.removeItem('received_reviews')
	localStorage.removeItem('messages')
	localStorage.removeItem('ai_recommendations')
	localStorage.removeItem('manual_tasks')
	localStorage.removeItem('okr_ai_recommendations')
	
	initializeAllMockData()
	
	console.log('✅ All mock data has been reset')
}

// Re-export individual initializers
export { initializeMockProjects, mockProjects } from './mockProjects'
export { initializeMockUsers, mockUsers, getUsersByDepartment, getUsersExcept } from './mockUsers'
export { initializeMockDepartments, mockDepartments } from './mockDepartments'
export { initializeMockOKRs, mockObjectives } from './mockOKRs'
export { initializeMockOKRRecommendations, mockOKRRecommendations, mockOKRInsights, mockOKRSummary } from './mockOKRRecommendations'

