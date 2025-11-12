import { Card, CardContent } from '../../../components/ui/Card'
import Input from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react'

interface Category {
	id: string
	label: string
	color: string
}

interface Project {
	id: string
	name: string
}

interface Objective {
	id: string
	title: string
}

interface WorkHistoryFiltersProps {
	searchQuery: string
	onSearchChange: (value: string) => void
	selectedCategory: string
	onCategoryChange: (value: string) => void
	selectedProject: string
	onProjectChange: (value: string) => void
	selectedObjective: string
	onObjectiveChange: (value: string) => void
	sortBy: 'date' | 'title'
	onSortChange: (value: 'date' | 'title') => void
	showFilters: boolean
	onToggleFilters: () => void
	categories: Category[]
	projects: Project[]
	objectives: Objective[]
}

/**
 * Work History Filters Component
 * Search, category, project, objective, and sort filters
 */
export function WorkHistoryFilters({
	searchQuery,
	onSearchChange,
	selectedCategory,
	onCategoryChange,
	selectedProject,
	onProjectChange,
	selectedObjective,
	onObjectiveChange,
	sortBy,
	onSortChange,
	showFilters,
	onToggleFilters,
	categories,
	projects,
	objectives,
}: WorkHistoryFiltersProps) {
	return (
		<Card>
			<CardContent className="p-4">
				{/* Search & Filter Toggle */}
				<div className="flex gap-3 mb-4">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
						<Input
							type="text"
							placeholder="Search work entries..."
							value={searchQuery}
							onChange={(e) => onSearchChange(e.target.value)}
							className="pl-10"
						/>
					</div>
					<Button variant="outline" onClick={onToggleFilters} className="gap-2">
						<Filter className="h-4 w-4" />
						Filters
						{showFilters ? (
							<ChevronUp className="h-4 w-4" />
						) : (
							<ChevronDown className="h-4 w-4" />
						)}
					</Button>
				</div>

				{/* Advanced Filters */}
				{showFilters && (
					<div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
						{/* Category Filter */}
						<div>
							<label className="block text-sm font-medium mb-2">Category</label>
							<div className="flex flex-wrap gap-2">
								{categories.map((cat) => (
									<button
										key={cat.id}
										onClick={() => onCategoryChange(cat.id)}
										className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
											selectedCategory === cat.id
												? 'bg-primary text-white'
												: cat.color
										}`}
									>
										{cat.label}
									</button>
								))}
							</div>
						</div>

						{/* Project Filter */}
						<div>
							<label className="block text-sm font-medium mb-2">Project</label>
							<select
								value={selectedProject}
								onChange={(e) => onProjectChange(e.target.value)}
								className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm"
							>
								<option value="all">All Projects</option>
								{projects.map((project) => (
									<option key={project.id} value={project.id}>
										{project.name}
									</option>
								))}
							</select>
						</div>

						{/* Objective Filter */}
						<div>
							<label className="block text-sm font-medium mb-2">Goal (OKR)</label>
							<select
								value={selectedObjective}
								onChange={(e) => onObjectiveChange(e.target.value)}
								className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm"
							>
								<option value="all">All Goals</option>
								{objectives.map((obj) => (
									<option key={obj.id} value={obj.id}>
										{obj.title}
									</option>
								))}
							</select>
						</div>

						{/* Sort By */}
						<div>
							<label className="block text-sm font-medium mb-2">Sort By</label>
							<div className="flex gap-2">
								<button
									onClick={() => onSortChange('date')}
									className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
										sortBy === 'date'
											? 'bg-primary text-white'
											: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
									}`}
								>
									Date
								</button>
								<button
									onClick={() => onSortChange('title')}
									className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
										sortBy === 'title'
											? 'bg-primary text-white'
											: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
									}`}
								>
									Title
								</button>
							</div>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	)
}

export default WorkHistoryFilters

