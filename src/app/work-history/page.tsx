/**
 * Work History Page
 * 
 * 리팩토링 완료:
 * - 910줄 → ~180줄 (80% 감소)
 * - useWorkHistory 훅으로 모든 로직 분리
 * - 재사용 가능한 컴포넌트로 UI 구성
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/common/PageHeader'
import { Button } from '../../components/ui/Button'
import { LoadingState } from '../../components/common/LoadingState'
import { useAuth } from '../../context/AuthContext'
import { Plus, ChevronUp, ChevronDown, BarChart3 } from 'lucide-react'
import { Card, CardContent } from '../../components/ui/Card'

// Custom Hook
import { useWorkHistory } from '../../hooks/useWorkHistory'

// Components
import { WorkEntryCard } from '../../components/work-history/WorkEntryCard'
import { WorkHistoryFilters } from '../../components/work-history/WorkHistoryFilters'

export default function WorkHistoryPage() {
	const navigate = useNavigate()
	const { user } = useAuth()
	
	const history = useWorkHistory(user?.id)
	const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

	// Categories
	const categories = [
		{ id: 'all', label: 'All', color: 'bg-neutral-800 text-neutral-400' },
		{ id: 'development', label: 'Development', color: 'bg-blue-900/30 text-blue-400' },
		{ id: 'meeting', label: 'Meeting', color: 'bg-purple-900/30 text-purple-400' },
		{ id: 'research', label: 'Research', color: 'bg-green-900/30 text-green-400' },
		{ id: 'documentation', label: 'Documentation', color: 'bg-orange-900/30 text-orange-400' },
		{ id: 'review', label: 'Review', color: 'bg-pink-900/30 text-pink-400' },
		{ id: 'other', label: 'Other', color: 'bg-neutral-800 text-neutral-400' },
	]

	const getCategoryColor = (categoryId: string) => {
		return categories.find((c) => c.id === categoryId)?.color || categories[0].color
	}

	if (history.isLoading) {
		return <LoadingState message="Loading work history..." />
	}

	return (
		<div className="min-h-screen bg-background-dark">
			<div className="max-w-[1600px] mx-auto px-6 py-6 space-y-6">
				{/* Page Header */}
		<PageHeader
					title="Work History"
					description="View and manage your work entries"
					action={
						<Button onClick={() => navigate('/app/input')} variant="brand">
							<Plus className="h-4 w-4 mr-2" />
							New Entry
					</Button>
				}
			/>
			
				{/* Stats */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<Card className="bg-surface-dark border-border-dark">
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-lg bg-blue-500/20">
									<BarChart3 className="h-5 w-5 text-blue-400" />
								</div>
									<div>
									<p className="text-2xl font-bold text-white">{history.stats.total}</p>
									<p className="text-xs text-neutral-400">Total Entries</p>
									</div>
								</div>
							</CardContent>
						</Card>

					{Object.entries(history.stats.byCategory).slice(0, 3).map(([category, count]) => (
						<Card key={category} className="bg-surface-dark border-border-dark">
							<CardContent className="p-4">
								<div className="flex items-center gap-3">
									<div className="p-2 rounded-lg bg-neutral-800">
										<BarChart3 className="h-5 w-5 text-neutral-400" />
									</div>
									<div>
										<p className="text-2xl font-bold text-white">{count}</p>
										<p className="text-xs text-neutral-400 capitalize">{category}</p>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Filters */}
				<WorkHistoryFilters
					filters={history.filters}
					onFilterChange={history.updateFilter}
					onReset={history.resetFilters}
					projects={history.projects}
					departments={history.departments}
					users={history.users}
					categories={categories}
					showAdvanced={showAdvancedFilters}
					onToggleAdvanced={() => setShowAdvancedFilters(!showAdvancedFilters)}
					currentUserId={user?.id}
				/>

				{/* Results Summary & Actions */}
				<div className="flex items-center justify-between">
					<p className="text-sm text-neutral-400">
						Showing {history.filteredEntries.length} of {history.entries.length} entries
					</p>
					<div className="flex items-center gap-2">
						<Button onClick={history.expandAll} variant="outline" size="sm">
							<ChevronDown className="h-4 w-4 mr-2" />
							Expand All
						</Button>
						<Button onClick={history.collapseAll} variant="outline" size="sm">
							<ChevronUp className="h-4 w-4 mr-2" />
							Collapse All
						</Button>
					</div>
				</div>

				{/* Work Entries */}
				{history.filteredEntries.length === 0 ? (
					<Card className="bg-surface-dark border-border-dark">
						<CardContent className="p-12 text-center">
							<BarChart3 className="h-16 w-16 text-neutral-600 mx-auto mb-4" />
							<p className="text-neutral-400 text-lg">No work entries found</p>
							<p className="text-neutral-500 text-sm mt-2">
								Try adjusting your filters or create a new entry
							</p>
							<Button onClick={() => navigate('/app/input')} variant="brand" className="mt-4">
								<Plus className="h-4 w-4 mr-2" />
								Create Entry
									</Button>
						</CardContent>
					</Card>
				) : (
					<div className="space-y-4">
						{history.filteredEntries.map((entry) => (
							<WorkEntryCard
								key={entry.id}
								entry={entry}
								isExpanded={history.expandedEntries.includes(entry.id)}
								onToggleExpand={() => history.toggleExpand(entry.id)}
								categoryColor={getCategoryColor(entry.category)}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
