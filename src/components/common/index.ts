/**
 * Common Components Barrel Export
 * 
 * Proce Frontend - 공통 컴포넌트들을 중앙에서 관리하는 배럴 export
 */

// Layout Components
export { PageContainer, PageSection } from './PageContainer'
export { PageHeader } from './PageHeader'
export type { TabItem, TabsConfig } from './PageHeader'
export { SectionHeader } from './SectionHeader'

// UI Components
export { Badge, StatusBadge, PriorityBadge } from './Badge'
export { DataGrid, DataList, DataListItem } from './DataDisplay'
export { EmptyState } from './EmptyState'
export { ErrorBoundary } from './ErrorBoundary'
export { FilterBar } from './FilterBar'
export { InfoCard } from './InfoCard'
export { LanguageSwitcher } from './LanguageSwitcher'
export { default as QuickNav } from './QuickNav'
export { StatCard, StatCardGrid } from './StatCard'
export type { StatCardProps } from './StatCard'

// Status & Badge Components
export { 
	WorkStatusBadge, 
	PriorityBadge as PriorityBadgeAlt,
	type BadgeVariant,
	type BadgeSize 
} from './StatusBadge'

// Loading & Skeleton Components
export { LoadingState } from './LoadingState'
export { 
	Skeleton,
	CardSkeleton,
	TableSkeleton,
	ListSkeleton,
	PageSkeleton
} from './LoadingSkeleton'

