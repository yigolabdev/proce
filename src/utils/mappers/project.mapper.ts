/**
 * Project Mappers
 * 
 * API DTO ↔ Domain Model 변환 레이어
 */

import type { Project } from '../../types/common.types'
import { parseProjectDates, toISOString } from '../dateUtils'

/**
 * API 응답 → Domain Model
 */
export function mapProjectFromApi(apiData: any): Project {
	return parseProjectDates({
		id: apiData.id,
		name: apiData.name,
		description: apiData.description,
		status: apiData.status,
		progress: apiData.progress || 0,
		startDate: apiData.startDate,
		endDate: apiData.endDate,
		
		// Migrate single department to departments array
		departments: apiData.departments || (apiData.department ? [apiData.department] : []),
		objectives: apiData.objectives || apiData.goals?.split('\n').filter(Boolean) || [],
		
		members: apiData.members?.map((m: any) => ({
			id: m.id,
			name: m.name,
			email: m.email,
			role: m.role || 'member',
			department: m.department || '',
			joinedAt: m.joinedAt || apiData.createdAt,
		})) || [],
		
		tags: apiData.tags || [],
		priority: apiData.priority,
		createdAt: apiData.createdAt,
		createdBy: apiData.createdBy || apiData.createdById || '',
		
		// Optional features
		schedule: apiData.schedule,
		resources: apiData.resources,
		risks: apiData.risks,
		aiAnalysis: apiData.aiAnalysis,
		files: apiData.files?.map((f: any) => ({
			id: f.id,
			name: f.name,
			size: f.size,
			type: f.type || f.mimeType,
			url: f.url,
			uploadedAt: f.uploadedAt || f.createdAt,
		})) || [],
		links: apiData.links?.map((l: any) => ({
			id: l.id,
			title: l.title,
			url: l.url,
			description: l.description,
			addedAt: l.addedAt || l.createdAt,
		})) || [],
	})
}

/**
 * 여러 Project를 한 번에 변환
 */
export function mapProjectsFromApi(apiData: any[]): Project[] {
	return apiData.map(mapProjectFromApi)
}

/**
 * localStorage → Domain Model
 */
export function parseProjectFromStorage(storageData: any): Project {
	return mapProjectFromApi(storageData)
}

/**
 * 여러 Project를 storage에서 변환
 */
export function parseProjectsFromStorage(storageData: any[]): Project[] {
	return storageData.map(parseProjectFromStorage)
}

/**
 * Domain Model → localStorage/API
 */
export function serializeProjectForStorage(project: Project): any {
	return {
		...project,
		startDate: toISOString(project.startDate),
		endDate: toISOString(project.endDate),
		createdAt: toISOString(project.createdAt),
		members: project.members?.map(m => ({
			...m,
			joinedAt: toISOString(m.joinedAt),
		})),
		files: project.files?.map(f => ({
			...f,
			uploadedAt: toISOString(f.uploadedAt),
		})),
		links: project.links?.map(l => ({
			...l,
			addedAt: toISOString(l.addedAt),
		})),
	}
}

