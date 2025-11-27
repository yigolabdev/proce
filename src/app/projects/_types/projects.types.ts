/**
 * Projects Types
 * 
 * @deprecated This file is deprecated. Use types from '../../../types/common.types' instead.
 * This file will be removed in future updates.
 * 
 * For now, it re-exports types from common.types to maintain backward compatibility.
 */

// Re-export all project-related types from common.types
export type {
	Project,
	ProjectStatus,
	ProjectMember,
	Milestone,
	ProjectSchedule,
	ProjectResources,
	ProjectRisk,
	ProjectAIAnalysis,
	CreateProjectData,
	UpdateProjectData,
	ProjectStats,
	ProjectFilter,
	FileAttachment as UploadedFile, // Alias for backward compatibility
	LinkResource as LinkedResource, // Alias for backward compatibility
} from '../../../types/common.types'
