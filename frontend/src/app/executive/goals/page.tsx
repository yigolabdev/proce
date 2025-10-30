import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Textarea from '../../../components/ui/Textarea'
import {
	Target,
	Plus,
	X,
	Edit,
	Check,
	Calendar,
	TrendingUp,
	Users,
	Sparkles,
	ChevronRight,
	ChevronDown,
	AlertCircle,
	CheckCircle2,
	Clock,
	Send,
	Brain,
} from 'lucide-react'
import { toast } from 'sonner'
import Toaster from '../../../components/ui/Toaster'

interface AnnualGoal {
	id: string
	title: string
	description: string
	targetValue: string
	currentValue: string
	unit: string
	category: string
	year: number
	status: 'draft' | 'active' | 'completed'
	createdAt: Date
	monthlyGoals: MonthlyGoal[]
}

interface MonthlyGoal {
	id: string
	month: number
	title: string
	targetValue: string
	status: 'pending' | 'approved' | 'rejected'
	weeklyGoals: WeeklyGoal[]
	aiGenerated: boolean
}

interface WeeklyGoal {
	id: string
	week: number
	title: string
	targetValue: string
	status: 'pending' | 'approved' | 'rejected'
	aiGenerated: boolean
}

export default function ExecutiveGoalsPage() {
	const [annualGoals, setAnnualGoals] = useState<AnnualGoal[]>([])
	const [showCreateDialog, setShowCreateDialog] = useState(false)
	const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set())
	const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set())

	// Form states
	const [newGoalTitle, setNewGoalTitle] = useState('')
	const [newGoalDescription, setNewGoalDescription] = useState('')
	const [newGoalTarget, setNewGoalTarget] = useState('')
	const [newGoalUnit, setNewGoalUnit] = useState('')
	const [newGoalCategory, setNewGoalCategory] = useState('')
	const [newGoalYear, setNewGoalYear] = useState(new Date().getFullYear())

	useEffect(() => {
		loadGoals()
	}, [])

	const loadGoals = () => {
		try {
			const saved = localStorage.getItem('annualGoals')
			if (saved) {
				const parsed = JSON.parse(saved)
				// Convert date strings back to Date objects
				const goals = parsed.map((goal: any) => ({
					...goal,
					createdAt: new Date(goal.createdAt),
				}))
				setAnnualGoals(goals)
			}
		} catch (error) {
			console.error('Failed to load goals:', error)
		}
	}

	const saveGoals = (goals: AnnualGoal[]) => {
		try {
			localStorage.setItem('annualGoals', JSON.stringify(goals))
		} catch (error) {
			console.error('Failed to save goals:', error)
		}
	}

	const generateMonthlyGoals = (annualTarget: string, title: string): MonthlyGoal[] => {
		const target = parseFloat(annualTarget) || 0
		const monthlyTarget = (target / 12).toFixed(2)

		return Array.from({ length: 12 }, (_, i) => ({
			id: `month-${Date.now()}-${i}`,
			month: i + 1,
			title: `${title} - ${getMonthName(i + 1)}`,
			targetValue: monthlyTarget,
			status: 'pending' as const,
			weeklyGoals: generateWeeklyGoals(monthlyTarget, title, i + 1),
			aiGenerated: true,
		}))
	}

	const generateWeeklyGoals = (monthlyTarget: string, title: string, month: number): WeeklyGoal[] => {
		const target = parseFloat(monthlyTarget) || 0
		const weeklyTarget = (target / 4).toFixed(2)

		return Array.from({ length: 4 }, (_, i) => ({
			id: `week-${Date.now()}-${month}-${i}`,
			week: i + 1,
			title: `${title} - Week ${i + 1}`,
			targetValue: weeklyTarget,
			status: 'pending' as const,
			aiGenerated: true,
		}))
	}

	const getMonthName = (month: number) => {
		const months = ['January', 'February', 'March', 'April', 'May', 'June',
			'July', 'August', 'September', 'October', 'November', 'December']
		return months[month - 1]
	}

	const handleCreateGoal = () => {
		if (!newGoalTitle || !newGoalTarget) {
			toast.error('Please enter title and target value')
			return
		}

		const newGoal: AnnualGoal = {
			id: Date.now().toString(),
			title: newGoalTitle,
			description: newGoalDescription,
			targetValue: newGoalTarget,
			currentValue: '0',
			unit: newGoalUnit || 'units',
			category: newGoalCategory || 'General',
			year: newGoalYear,
			status: 'draft',
			createdAt: new Date(),
			monthlyGoals: generateMonthlyGoals(newGoalTarget, newGoalTitle),
		}

		const updated = [...annualGoals, newGoal]
		setAnnualGoals(updated)
		saveGoals(updated)

		// Reset form
		setNewGoalTitle('')
		setNewGoalDescription('')
		setNewGoalTarget('')
		setNewGoalUnit('')
		setNewGoalCategory('')
		setShowCreateDialog(false)

		toast.success('Annual goal created with auto-generated monthly and weekly targets!')
	}

	const handleApproveMonthlyGoal = (goalId: string, monthId: string) => {
		const updated = annualGoals.map((goal) => {
			if (goal.id === goalId) {
				return {
					...goal,
					monthlyGoals: goal.monthlyGoals.map((month) =>
						month.id === monthId ? { ...month, status: 'approved' as const } : month
					),
				}
			}
			return goal
		})
		setAnnualGoals(updated)
		saveGoals(updated)
		toast.success('Monthly goal approved!')
	}

	const handleRejectMonthlyGoal = (goalId: string, monthId: string) => {
		const updated = annualGoals.map((goal) => {
			if (goal.id === goalId) {
				return {
					...goal,
					monthlyGoals: goal.monthlyGoals.map((month) =>
						month.id === monthId ? { ...month, status: 'rejected' as const } : month
					),
				}
			}
			return goal
		})
		setAnnualGoals(updated)
		saveGoals(updated)
		toast.success('Monthly goal rejected')
	}

	const handleApproveWeeklyGoal = (goalId: string, monthId: string, weekId: string) => {
		const updated = annualGoals.map((goal) => {
			if (goal.id === goalId) {
				return {
					...goal,
					monthlyGoals: goal.monthlyGoals.map((month) => {
						if (month.id === monthId) {
							return {
								...month,
								weeklyGoals: month.weeklyGoals.map((week) =>
									week.id === weekId ? { ...week, status: 'approved' as const } : week
								),
							}
						}
						return month
					}),
				}
			}
			return goal
		})
		setAnnualGoals(updated)
		saveGoals(updated)
		toast.success('Weekly goal approved!')
	}

	const handleApproveAllMonthly = (goalId: string) => {
		const updated = annualGoals.map((goal) => {
			if (goal.id === goalId) {
				return {
					...goal,
					monthlyGoals: goal.monthlyGoals.map((month) => ({
						...month,
						status: 'approved' as const,
					})),
				}
			}
			return goal
		})
		setAnnualGoals(updated)
		saveGoals(updated)
		toast.success('All monthly goals approved!')
	}

	const handleDistributeToEmployees = (goalId: string) => {
		const goal = annualGoals.find((g) => g.id === goalId)
		if (!goal) return

		const approvedMonths = goal.monthlyGoals.filter((m) => m.status === 'approved')
		if (approvedMonths.length === 0) {
			toast.error('Please approve at least one monthly goal before distributing')
			return
		}

		// Update goal status to active
		const updated = annualGoals.map((g) =>
			g.id === goalId ? { ...g, status: 'active' as const } : g
		)
		setAnnualGoals(updated)
		saveGoals(updated)

		// Simulate distribution
		toast.success(`Goals distributed to all employees! ${approvedMonths.length} monthly goals are now active.`)
	}

	const toggleGoalExpand = (goalId: string) => {
		const newExpanded = new Set(expandedGoals)
		if (newExpanded.has(goalId)) {
			newExpanded.delete(goalId)
		} else {
			newExpanded.add(goalId)
		}
		setExpandedGoals(newExpanded)
	}

	const toggleMonthExpand = (monthId: string) => {
		const newExpanded = new Set(expandedMonths)
		if (newExpanded.has(monthId)) {
			newExpanded.delete(monthId)
		} else {
			newExpanded.add(monthId)
		}
		setExpandedMonths(newExpanded)
	}

	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'draft':
				return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
			case 'active':
				return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
			case 'completed':
				return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
			case 'pending':
				return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
			case 'approved':
				return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
			case 'rejected':
				return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
			default:
				return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
		}
	}

	const stats = {
		total: annualGoals.length,
		active: annualGoals.filter((g) => g.status === 'active').length,
		draft: annualGoals.filter((g) => g.status === 'draft').length,
		completed: annualGoals.filter((g) => g.status === 'completed').length,
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold flex items-center gap-3">
						<Target className="h-8 w-8 text-primary" />
						Annual Goals Management
					</h1>
					<p className="mt-2 text-neutral-600 dark:text-neutral-400">
						Set annual goals and review AI-generated monthly and weekly targets
					</p>
				</div>
				<Button onClick={() => setShowCreateDialog(true)} className="flex items-center gap-2">
					<Plus className="h-5 w-5" />
					Create Annual Goal
				</Button>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardContent className="p-4">
						<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Total Goals</div>
						<div className="text-2xl font-bold">{stats.total}</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Active</div>
						<div className="text-2xl font-bold text-green-600">{stats.active}</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Draft</div>
						<div className="text-2xl font-bold text-yellow-600">{stats.draft}</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Completed</div>
						<div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
					</CardContent>
				</Card>
			</div>

			{/* Goals List */}
			<div className="space-y-4">
				{annualGoals.length === 0 ? (
					<Card>
						<CardContent className="p-12 text-center">
							<Target className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
							<h3 className="text-lg font-bold mb-2">No Annual Goals Yet</h3>
							<p className="text-neutral-600 dark:text-neutral-400 mb-4">
								Create your first annual goal to get started
							</p>
							<Button onClick={() => setShowCreateDialog(true)}>
								<Plus className="h-4 w-4 mr-2" />
								Create Annual Goal
							</Button>
						</CardContent>
					</Card>
				) : (
					annualGoals.map((goal) => (
						<Card key={goal.id} className="overflow-hidden">
							<CardHeader className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<div className="flex items-center gap-3 mb-2">
											<button
												onClick={() => toggleGoalExpand(goal.id)}
												className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded transition-colors"
											>
												{expandedGoals.has(goal.id) ? (
													<ChevronDown className="h-5 w-5" />
												) : (
													<ChevronRight className="h-5 w-5" />
												)}
											</button>
											<h2 className="text-xl font-bold">{goal.title}</h2>
											<span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadge(goal.status)}`}>
												{goal.status.toUpperCase()}
											</span>
											{goal.category && (
												<span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
													{goal.category}
												</span>
											)}
										</div>
										{goal.description && (
											<p className="text-sm text-neutral-600 dark:text-neutral-400 ml-9">
												{goal.description}
											</p>
										)}
										<div className="flex items-center gap-6 mt-3 ml-9 text-sm">
											<div className="flex items-center gap-2">
												<Target className="h-4 w-4 text-neutral-500" />
												<span className="font-medium">{goal.targetValue} {goal.unit}</span>
											</div>
											<div className="flex items-center gap-2">
												<Calendar className="h-4 w-4 text-neutral-500" />
												<span>Year {goal.year}</span>
											</div>
											<div className="flex items-center gap-2">
												<TrendingUp className="h-4 w-4 text-neutral-500" />
												<span>Current: {goal.currentValue} {goal.unit}</span>
											</div>
										</div>
									</div>
									<div className="flex items-center gap-2">
										{goal.status === 'draft' && (
											<>
												<Button
													size="sm"
													onClick={() => handleApproveAllMonthly(goal.id)}
													className="flex items-center gap-1"
												>
													<CheckCircle2 className="h-4 w-4" />
													Approve All
												</Button>
												<Button
													size="sm"
													onClick={() => handleDistributeToEmployees(goal.id)}
													className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
												>
													<Send className="h-4 w-4" />
													Distribute to Employees
												</Button>
											</>
										)}
									</div>
								</div>
							</CardHeader>

							{expandedGoals.has(goal.id) && (
								<CardContent className="p-6">
									<div className="flex items-center gap-2 mb-4">
										<Brain className="h-5 w-5 text-purple-600" />
										<h3 className="font-bold">AI-Generated Monthly & Weekly Goals</h3>
										<span className="text-xs text-neutral-500">
											(Review and approve before distribution)
										</span>
									</div>

									<div className="space-y-3">
										{goal.monthlyGoals.map((month) => (
											<div
												key={month.id}
												className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden"
											>
												<div className="p-4 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-between">
													<div className="flex items-center gap-3 flex-1">
														<button
															onClick={() => toggleMonthExpand(month.id)}
															className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded transition-colors"
														>
															{expandedMonths.has(month.id) ? (
																<ChevronDown className="h-4 w-4" />
															) : (
																<ChevronRight className="h-4 w-4" />
															)}
														</button>
														<div className="flex-1">
															<div className="flex items-center gap-2 mb-1">
																<h4 className="font-bold">{month.title}</h4>
																<span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadge(month.status)}`}>
																	{month.status.toUpperCase()}
																</span>
																{month.aiGenerated && (
																	<span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 flex items-center gap-1">
																		<Sparkles className="h-3 w-3" />
																		AI Generated
																	</span>
																)}
															</div>
															<p className="text-sm text-neutral-600 dark:text-neutral-400">
																Target: {month.targetValue} {goal.unit}
															</p>
														</div>
													</div>
													{month.status === 'pending' && (
														<div className="flex items-center gap-2">
															<Button
																size="sm"
																variant="outline"
																onClick={() => handleApproveMonthlyGoal(goal.id, month.id)}
																className="text-green-600 border-green-200 hover:bg-green-50"
															>
																<Check className="h-4 w-4 mr-1" />
																Approve
															</Button>
															<Button
																size="sm"
																variant="outline"
																onClick={() => handleRejectMonthlyGoal(goal.id, month.id)}
																className="text-red-600 border-red-200 hover:bg-red-50"
															>
																<X className="h-4 w-4 mr-1" />
																Reject
															</Button>
														</div>
													)}
												</div>

												{expandedMonths.has(month.id) && (
													<div className="p-4 space-y-2 bg-white dark:bg-neutral-950">
														<div className="flex items-center gap-2 mb-3">
															<Clock className="h-4 w-4 text-neutral-500" />
															<span className="text-sm font-medium">Weekly Breakdown</span>
														</div>
														{month.weeklyGoals.map((week) => (
															<div
																key={week.id}
																className="flex items-center justify-between p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg"
															>
																<div className="flex-1">
																	<div className="flex items-center gap-2 mb-1">
																		<span className="font-medium text-sm">{week.title}</span>
																		<span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadge(week.status)}`}>
																			{week.status.toUpperCase()}
																		</span>
																	</div>
																	<p className="text-xs text-neutral-600 dark:text-neutral-400">
																		Target: {week.targetValue} {goal.unit}
																	</p>
																</div>
																{week.status === 'pending' && (
																	<Button
																		size="sm"
																		variant="outline"
																		onClick={() => handleApproveWeeklyGoal(goal.id, month.id, week.id)}
																		className="text-green-600 border-green-200 hover:bg-green-50 text-xs"
																	>
																		<Check className="h-3 w-3 mr-1" />
																		Approve
																	</Button>
																)}
															</div>
														))}
													</div>
												)}
											</div>
										))}
									</div>
								</CardContent>
							)}
						</Card>
					))
				)}
			</div>

			{/* Create Goal Dialog */}
			{showCreateDialog && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
					<Card className="w-full max-w-2xl">
						<CardHeader className="border-b border-neutral-200 dark:border-neutral-800">
							<div className="flex items-center justify-between">
								<h3 className="text-xl font-bold flex items-center gap-2">
									<Plus className="h-5 w-5 text-primary" />
									Create Annual Goal
								</h3>
								<button
									onClick={() => setShowCreateDialog(false)}
									className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
								>
									<X className="h-5 w-5" />
								</button>
							</div>
						</CardHeader>
						<CardContent className="p-6">
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium mb-2">
										Goal Title <span className="text-red-500">*</span>
									</label>
									<Input
										value={newGoalTitle}
										onChange={(e) => setNewGoalTitle(e.target.value)}
										placeholder="e.g., Increase Annual Revenue"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium mb-2">Description</label>
									<Textarea
										value={newGoalDescription}
										onChange={(e) => setNewGoalDescription(e.target.value)}
										placeholder="Provide context and details about this goal..."
										rows={3}
									/>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium mb-2">
											Target Value <span className="text-red-500">*</span>
										</label>
										<Input
											type="number"
											value={newGoalTarget}
											onChange={(e) => setNewGoalTarget(e.target.value)}
											placeholder="e.g., 1000000"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium mb-2">Unit</label>
										<Input
											value={newGoalUnit}
											onChange={(e) => setNewGoalUnit(e.target.value)}
											placeholder="e.g., USD, units, customers"
										/>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium mb-2">Category</label>
										<select
											value={newGoalCategory}
											onChange={(e) => setNewGoalCategory(e.target.value)}
											className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900"
										>
											<option value="">Select category</option>
											<option value="Revenue">Revenue</option>
											<option value="Growth">Growth</option>
											<option value="Efficiency">Efficiency</option>
											<option value="Customer">Customer</option>
											<option value="Product">Product</option>
											<option value="Operations">Operations</option>
										</select>
									</div>
									<div>
										<label className="block text-sm font-medium mb-2">Year</label>
										<Input
											type="number"
											value={newGoalYear}
											onChange={(e) => setNewGoalYear(parseInt(e.target.value))}
											min={new Date().getFullYear()}
										/>
									</div>
								</div>

								<div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
									<div className="flex items-start gap-3">
										<Brain className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
										<div>
											<p className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-1">
												AI Auto-Generation
											</p>
											<p className="text-xs text-purple-700 dark:text-purple-300">
												Monthly and weekly goals will be automatically generated based on your annual target.
												You can review and approve them before distributing to employees.
											</p>
										</div>
									</div>
								</div>

								<div className="flex items-center gap-3 pt-4">
									<Button onClick={handleCreateGoal} className="flex-1">
										<Plus className="h-4 w-4 mr-2" />
										Create Goal
									</Button>
									<Button variant="outline" onClick={() => setShowCreateDialog(false)} className="flex-1">
										Cancel
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			)}

			<Toaster />
		</div>
	)
}

