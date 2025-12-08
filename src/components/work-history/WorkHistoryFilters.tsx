/**
 * WorkHistoryFilters Component
 * 업무 이력 필터
 */

import React from 'react'
import { Card, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import Input from '../ui/Input'
import { Search, Filter, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'
import type { WorkHistoryFilters as Filters } from '../../hooks/useWorkHistory'
import type { Project } from '../../types/common.types'

export interface WorkHistoryFiltersProps {
	filters: Filters
	onFilterChange: <K extends keyof Filters>(key: K, value: Filters[K]) => void
	onReset: () => void
	projects: Project[]
	departments: string[]
	users: Array<{ id: string; name: string; department: string }>
	categories: Array<{ id: string; label: string }>
	showAdvanced: boolean
	onToggleAdvanced: () => void
	currentUserId?: string
}

export function WorkHistoryFilters({
	filters,
	onFilterChange,
	onReset,
	projects,
	departments,
	users,
	categories,
	showAdvanced,
	onToggleAdvanced,
	currentUserId,
}: WorkHistoryFiltersProps) {
	return (
		<Card className="bg-surface-dark border-border-dark">
			<CardContent className="p-4 space-y-4">
				{/* Search */}
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
					<Input
						type="text"
						placeholder="Search by title, description, or tags..."
						value={filters.search}
						onChange={(e) => onFilterChange('search', e.target.value)}
						className="pl-10"
					/>
				</div>

				{/* Quick Filters */}
				<div className="flex items-center gap-2 flex-wrap">
					<span className="text-sm text-neutral-400">Quick filters:</span>
					
					{/* Category */}
					<select
						value={filters.category}
						onChange={(e) => onFilterChange('category', e.target.value)}
						className="px-3 py-1.5 bg-neutral-800 border border-border-dark rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
					>
						{categories.map((cat) => (
							<option key={cat.id} value={cat.id}>
								{cat.label}
							</option>
						))}
					</select>

					{/* Project */}
					<select
						value={filters.project}
						onChange={(e) => onFilterChange('project', e.target.value)}
						className="px-3 py-1.5 bg-neutral-800 border border-border-dark rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
					>
						<option value="all">All Projects</option>
						{projects.map((project) => (
							<option key={project.id} value={project.id}>
								{project.name}
							</option>
						))}
					</select>

					{/* Sort */}
					<select
						value={filters.sortBy}
						onChange={(e) => onFilterChange('sortBy', e.target.value as 'date' | 'title')}
						className="px-3 py-1.5 bg-neutral-800 border border-border-dark rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
					>
						<option value="date">Sort by Date</option>
						<option value="title">Sort by Title</option>
					</select>

					{/* Advanced Toggle */}
					<Button onClick={onToggleAdvanced} variant="outline" size="sm">
						<Filter className="h-4 w-4 mr-2" />
						Advanced
						{showAdvanced ? (
							<ChevronUp className="h-4 w-4 ml-2" />
						) : (
							<ChevronDown className="h-4 w-4 ml-2" />
						)}
					</Button>

					{/* Reset */}
					<Button onClick={onReset} variant="ghost" size="sm">
						<RefreshCw className="h-4 w-4 mr-2" />
						Reset
					</Button>
				</div>

				{/* Advanced Filters */}
				{showAdvanced && (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border-dark">
						{/* Department */}
						<div>
							<label className="block text-sm font-medium text-neutral-400 mb-2">
								Department
							</label>
							<select
								value={filters.department}
								onChange={(e) => onFilterChange('department', e.target.value)}
								className="w-full px-3 py-2 bg-neutral-800 border border-border-dark rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
							>
								<option value="all">All Departments</option>
								{departments.map((dept) => (
									<option key={dept} value={dept}>
										{dept}
									</option>
								))}
							</select>
						</div>

						{/* User */}
						<div>
							<label className="block text-sm font-medium text-neutral-400 mb-2">
								User
							</label>
							<select
								value={filters.user}
								onChange={(e) => onFilterChange('user', e.target.value)}
								className="w-full px-3 py-2 bg-neutral-800 border border-border-dark rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
							>
								<option value="all">All Users</option>
								{currentUserId && <option value="me">My Work</option>}
								{users.map((user) => (
									<option key={user.id} value={user.id}>
										{user.name} {user.department && `(${user.department})`}
									</option>
								))}
							</select>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	)
}

