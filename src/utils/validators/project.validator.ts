/**
 * Project Validators
 * 
 * API 응답 및 사용자 입력 검증
 */

import type { Project } from '../../types/common.types'

/**
 * Project 필수 필드 검증
 */
export function validateProject(project: Partial<Project>): string[] {
	const errors: string[] = []
	
	if (!project.name || project.name.trim() === '') {
		errors.push('Project name is required')
	}
	
	if (!project.description || project.description.trim() === '') {
		errors.push('Project description is required')
	}
	
	if (!project.departments || project.departments.length === 0) {
		errors.push('At least one department is required')
	}
	
	if (!project.objectives || project.objectives.length === 0) {
		errors.push('At least one objective is required')
	}
	
	if (!project.startDate) {
		errors.push('Start date is required')
	}
	
	if (!project.endDate) {
		errors.push('End date is required')
	}
	
	// Validate date range
	if (project.startDate && project.endDate) {
		const start = new Date(project.startDate)
		const end = new Date(project.endDate)
		if (end <= start) {
			errors.push('End date must be after start date')
		}
	}
	
	if (!project.members || project.members.length === 0) {
		errors.push('At least one team member is required')
	}
	
	// Validate progress
	if (project.progress !== undefined) {
		if (project.progress < 0 || project.progress > 100) {
			errors.push('Progress must be between 0 and 100')
		}
	}
	
	// Validate members have required fields
	if (project.members) {
		project.members.forEach((member, idx) => {
			if (!member.name || !member.email || !member.role || !member.department) {
				errors.push(`Member ${idx + 1} is missing required fields`)
			}
		})
	}
	
	return errors
}

/**
 * Project가 유효한지 확인
 */
export function isValidProject(project: Partial<Project>): boolean {
	return validateProject(project).length === 0
}

/**
 * Project 생성 전 정리
 */
export function sanitizeProject(project: Partial<Project>): Partial<Project> {
	return {
		...project,
		name: project.name?.trim(),
		description: project.description?.trim(),
		departments: project.departments?.map(d => d.trim()).filter(Boolean) || [],
		objectives: project.objectives?.map(o => o.trim()).filter(Boolean) || [],
		tags: project.tags?.map(t => t.trim()).filter(Boolean) || [],
	}
}

