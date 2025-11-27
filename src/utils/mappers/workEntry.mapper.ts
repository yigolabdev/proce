/**
 * WorkEntry Mappers
 * 
 * API DTO ↔ Domain Model 변환 레이어
 * 백엔드 API 연동 시 타입 변환 처리
 */

import type { WorkEntry, WorkEntryStatus } from '../../types/common.types'
import type { CreateWorkEntryDto, UpdateWorkEntryDto } from '../../types/api.types'
import { parseWorkEntryDates, toISOString } from '../dateUtils'

/**
 * API 응답 → Domain Model
 * 백엔드 API로부터 받은 데이터를 클라이언트 도메인 모델로 변환
 */
export function mapWorkEntryFromApi(apiData: any): WorkEntry {
	return parseWorkEntryDates({
		id: apiData.id,
		title: apiData.title,
		category: apiData.category,
		description: apiData.description,
		date: apiData.date,
		duration: apiData.duration || '',
		
		// Relations
		projectId: apiData.projectId,
		projectName: apiData.projectName,
		objectiveId: apiData.objectiveId,
		keyResultId: apiData.keyResultId,
		taskId: apiData.taskId,
		
		// Metadata
		tags: apiData.tags || [],
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
		isConfidential: apiData.isConfidential || false,
		
		// User & Department
		submittedBy: apiData.submittedBy || apiData.userId,
		submittedByName: apiData.submittedByName || apiData.userName,
		department: apiData.department,
		
		// Status & Review
		status: (apiData.status as WorkEntryStatus) || 'draft',
		reviewedBy: apiData.reviewedBy,
		reviewedByName: apiData.reviewedByName,
		reviewedAt: apiData.reviewedAt,
		reviewComments: apiData.reviewComments,
		
		// Timestamps
		createdAt: apiData.createdAt,
		updatedAt: apiData.updatedAt,
		submittedAt: apiData.submittedAt,
		
		// AI Analysis
		complexity: apiData.complexity,
		estimatedDuration: apiData.estimatedDuration,
		actualDuration: apiData.actualDuration,
		requiredSkills: apiData.requiredSkills,
		collaborators: apiData.collaborators,
		blockers: apiData.blockers,
	})
}

/**
 * Domain Model → Create DTO
 * 클라이언트 데이터를 백엔드 API 생성 요청 형식으로 변환
 */
export function mapWorkEntryToCreateDto(entry: Partial<WorkEntry>): CreateWorkEntryDto {
	return {
		title: entry.title || '',
		description: entry.description || '',
		category: entry.category || '',
		duration: entry.duration,
		projectId: entry.projectId,
		objectiveId: entry.objectiveId,
		keyResultId: entry.keyResultId,
		tags: entry.tags,
		isConfidential: entry.isConfidential,
		// files와 links는 별도 업로드 후 연결
	}
}

/**
 * Domain Model → Update DTO
 * 클라이언트 데이터를 백엔드 API 수정 요청 형식으로 변환
 */
export function mapWorkEntryToUpdateDto(updates: Partial<WorkEntry>): UpdateWorkEntryDto {
	return {
		title: updates.title,
		description: updates.description,
		category: updates.category,
		duration: updates.duration,
		projectId: updates.projectId,
		objectiveId: updates.objectiveId,
		keyResultId: updates.keyResultId,
		tags: updates.tags,
		isConfidential: updates.isConfidential,
		status: updates.status as any,
	}
}

/**
 * 여러 WorkEntry를 한 번에 변환
 */
export function mapWorkEntriesFromApi(apiData: any[]): WorkEntry[] {
	return apiData.map(mapWorkEntryFromApi)
}

/**
 * localStorage → Domain Model
 * localStorage에 저장된 데이터를 도메인 모델로 변환
 */
export function parseWorkEntryFromStorage(storageData: any): WorkEntry {
	return parseWorkEntryDates({
		...storageData,
		files: storageData.files?.map((f: any) => ({
			...f,
			uploadedAt: f.uploadedAt || f.createdAt || new Date().toISOString(),
		})) || [],
		links: storageData.links?.map((l: any) => ({
			...l,
			addedAt: l.addedAt || new Date().toISOString(),
		})) || [],
		tags: storageData.tags || [],
		status: storageData.status || 'draft',
	})
}

/**
 * 여러 WorkEntry를 storage에서 변환
 */
export function parseWorkEntriesFromStorage(storageData: any[]): WorkEntry[] {
	return storageData.map(parseWorkEntryFromStorage)
}

/**
 * Domain Model → localStorage
 * 도메인 모델을 localStorage 저장 형식으로 변환 (ISO strings)
 */
export function serializeWorkEntryForStorage(entry: WorkEntry): any {
	return {
		...entry,
		date: toISOString(entry.date),
		createdAt: toISOString(entry.createdAt),
		updatedAt: toISOString(entry.updatedAt),
		submittedAt: toISOString(entry.submittedAt),
		reviewedAt: toISOString(entry.reviewedAt),
		files: entry.files?.map(f => ({
			...f,
			uploadedAt: toISOString(f.uploadedAt),
		})),
		links: entry.links?.map(l => ({
			...l,
			addedAt: toISOString(l.addedAt),
		})),
	}
}

