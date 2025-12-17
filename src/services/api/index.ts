/**
 * API Services Index
 * 
 * Central export point for all API services.
 * This makes it easy to import services throughout the application.
 */

export * from './config'
export * from './client'
export * from './workEntries.service'
export * from './tasks.service'
export * from './messages.service'
export * from './projects.service'
export * from './reviews.service'
export * from './kpi.service'

// Export service instances for convenience
export { workEntriesService } from './workEntries.service'
export { tasksService } from './tasks.service'
export { messagesService } from './messages.service'
export { projectsService } from './projects.service'
export { reviewsService } from './reviews.service'
export { kpiService } from './kpi.service'

