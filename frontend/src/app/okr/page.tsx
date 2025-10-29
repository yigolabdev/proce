import { useState } from 'react'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import {
	Target,
	Plus,
	X,
	Edit2,
	Trash2,
	CheckCircle2,
	AlertCircle,
	Calendar,
	Users,
	Flag,
	ChevronDown,
	ChevronUp,
} from 'lucide-react'

interface KeyResult {
	id: string
	description: string
	target: number
	current: number
	unit: string
	owner: string
}

interface Objective {
	id: string
	title: string
	description: string
	quarter: string
	owner: string
	team: string
	status: 'on-track' | 'at-risk' | 'behind' | 'completed'
	keyResults: KeyResult[]
	startDate: string
	endDate: string
}

export default function OKRPage() {
	const [objectives] = useState<Objective[]>([
		{
			id: '1',
			title: 'Increase Product Market Fit',
			description: 'Improve product-market fit by enhancing core features and user satisfaction',
			quarter: 'Q4 2024',
			owner: 'John Doe',
			team: 'Product',
			status: 'on-track',
			startDate: '2024-10-01',
			endDate: '2024-12-31',
			keyResults: [
				{
					id: 'kr1',
					description: 'Achieve Net Promoter Score (NPS) of 50+',
					target: 50,
					current: 42,
					unit: 'score',
					owner: 'John Doe',
				},
				{
					id: 'kr2',
					description: 'Increase daily active users to 10,000',
					target: 10000,
					current: 7500,
					unit: 'users',
					owner: 'Jane Smith',
				},
				{
					id: 'kr3',
					description: 'Reduce customer churn rate to below 5%',
					target: 5,
					current: 7.2,
					unit: '%',
					owner: 'Mike Johnson',
				},
			],
		},
		{
			id: '2',
			title: 'Scale Revenue Growth',
			description: 'Drive sustainable revenue growth through new customer acquisition and expansion',
			quarter: 'Q4 2024',
			owner: 'Sarah Lee',
			team: 'Sales',
			status: 'at-risk',
			startDate: '2024-10-01',
			endDate: '2024-12-31',
			keyResults: [
				{
					id: 'kr4',
					description: 'Generate $500K in new MRR',
					target: 500000,
					current: 320000,
					unit: 'USD',
					owner: 'Sarah Lee',
				},
				{
					id: 'kr5',
					description: 'Close 50 new enterprise deals',
					target: 50,
					current: 28,
					unit: 'deals',
					owner: 'Tom Brown',
				},
				{
					id: 'kr6',
					description: 'Achieve 120% net revenue retention',
					target: 120,
					current: 105,
					unit: '%',
					owner: 'Sarah Lee',
				},
			],
		},
		{
			id: '3',
			title: 'Build High-Performance Engineering Culture',
			description: 'Foster a culture of excellence, innovation, and continuous improvement',
			quarter: 'Q4 2024',
			owner: 'David Kim',
			team: 'Engineering',
			status: 'on-track',
			startDate: '2024-10-01',
			endDate: '2024-12-31',
			keyResults: [
				{
					id: 'kr7',
					description: 'Reduce deployment time to under 10 minutes',
					target: 10,
					current: 8,
					unit: 'minutes',
					owner: 'David Kim',
				},
				{
					id: 'kr8',
					description: 'Achieve 95% code coverage',
					target: 95,
					current: 88,
					unit: '%',
					owner: 'Emily Chen',
				},
				{
					id: 'kr9',
					description: 'Complete 100% of sprint commitments',
					target: 100,
					current: 92,
					unit: '%',
					owner: 'David Kim',
				},
			],
		},
	])

	const [expandedObjectives, setExpandedObjectives] = useState<string[]>(['1', '2', '3'])
	const [selectedQuarter, setSelectedQuarter] = useState<string>('Q4 2024')
	const [showAddObjective, setShowAddObjective] = useState(false)

	const quarters = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025']

	const toggleObjective = (id: string) => {
		setExpandedObjectives((prev) =>
			prev.includes(id) ? prev.filter((objId) => objId !== id) : [...prev, id]
		)
	}

	const calculateProgress = (keyResults: KeyResult[]) => {
		if (keyResults.length === 0) return 0
		const totalProgress = keyResults.reduce((sum, kr) => {
			const progress = Math.min((kr.current / kr.target) * 100, 100)
			return sum + progress
		}, 0)
		return Math.round(totalProgress / keyResults.length)
	}

	const getStatusColor = (status: Objective['status']) => {
		switch (status) {
			case 'on-track':
				return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
			case 'at-risk':
				return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
			case 'behind':
				return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
			case 'completed':
				return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
		}
	}

	const getStatusIcon = (status: Objective['status']) => {
		switch (status) {
			case 'on-track':
				return <CheckCircle2 className="h-4 w-4" />
			case 'at-risk':
				return <AlertCircle className="h-4 w-4" />
			case 'behind':
				return <AlertCircle className="h-4 w-4" />
			case 'completed':
				return <CheckCircle2 className="h-4 w-4" />
		}
	}

	const formatNumber = (value: number, unit: string) => {
		if (unit === 'USD') {
			return new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD',
				minimumFractionDigits: 0,
			}).format(value)
		}
		return `${value.toLocaleString()} ${unit}`
	}

	const filteredObjectives = objectives.filter((obj) => obj.quarter === selectedQuarter)

	const overallStats = {
		totalObjectives: filteredObjectives.length,
		onTrack: filteredObjectives.filter((obj) => obj.status === 'on-track').length,
		atRisk: filteredObjectives.filter((obj) => obj.status === 'at-risk').length,
		behind: filteredObjectives.filter((obj) => obj.status === 'behind').length,
		completed: filteredObjectives.filter((obj) => obj.status === 'completed').length,
		avgProgress: Math.round(
			filteredObjectives.reduce((sum, obj) => sum + calculateProgress(obj.keyResults), 0) /
				(filteredObjectives.length || 1)
		),
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold flex items-center gap-3">
						<Target className="h-8 w-8 text-primary" />
						OKR Management
					</h1>
					<p className="mt-2 text-neutral-600 dark:text-neutral-400">
						Set objectives and track key results to achieve your goals
					</p>
				</div>
				<Button onClick={() => setShowAddObjective(true)} className="flex items-center gap-2">
					<Plus className="h-4 w-4" />
					Add Objective
				</Button>
			</div>

			{/* Quarter Filter & Stats */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				{/* Quarter Selector */}
				<Card>
					<CardContent className="p-4">
						<label className="block text-sm font-medium mb-2">Select Quarter</label>
						<select
							value={selectedQuarter}
							onChange={(e) => setSelectedQuarter(e.target.value)}
							className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900"
						>
							{quarters.map((quarter) => (
								<option key={quarter} value={quarter}>
									{quarter}
								</option>
							))}
						</select>
					</CardContent>
				</Card>

				{/* Overall Progress */}
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
								Overall Progress
							</span>
							<span className="text-2xl font-bold text-primary">{overallStats.avgProgress}%</span>
						</div>
						<div className="relative w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
							<div
								className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-300"
								style={{ width: `${overallStats.avgProgress}%` }}
							/>
						</div>
					</CardContent>
				</Card>

				{/* Status Summary */}
				<Card>
					<CardContent className="p-4">
						<div className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
							Status Summary
						</div>
						<div className="grid grid-cols-2 gap-2">
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 rounded-full bg-green-600" />
								<span className="text-xs">On Track: {overallStats.onTrack}</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 rounded-full bg-orange-600" />
								<span className="text-xs">At Risk: {overallStats.atRisk}</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 rounded-full bg-red-600" />
								<span className="text-xs">Behind: {overallStats.behind}</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 rounded-full bg-blue-600" />
								<span className="text-xs">Completed: {overallStats.completed}</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Objectives List */}
			<div className="space-y-4">
				{filteredObjectives.length === 0 ? (
					<Card>
						<CardContent className="p-12 text-center">
							<Target className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
							<h3 className="text-lg font-bold mb-2">No Objectives for {selectedQuarter}</h3>
							<p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
								Start by creating your first objective for this quarter
							</p>
							<Button onClick={() => setShowAddObjective(true)}>
								<Plus className="h-4 w-4 mr-2" />
								Add Objective
							</Button>
						</CardContent>
					</Card>
				) : (
					filteredObjectives.map((objective) => {
						const progress = calculateProgress(objective.keyResults)
						const isExpanded = expandedObjectives.includes(objective.id)

						return (
							<Card key={objective.id} className="hover:shadow-lg transition-shadow">
								<CardHeader>
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<div className="flex items-center gap-3 mb-2">
												<button
													onClick={() => toggleObjective(objective.id)}
													className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
												>
													{isExpanded ? (
														<ChevronUp className="h-5 w-5" />
													) : (
														<ChevronDown className="h-5 w-5" />
													)}
												</button>
												<h3 className="text-xl font-bold flex-1">{objective.title}</h3>
												<span
													className={`flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(
														objective.status
													)}`}
												>
													{getStatusIcon(objective.status)}
													{objective.status.replace('-', ' ').toUpperCase()}
												</span>
											</div>
											<p className="text-sm text-neutral-600 dark:text-neutral-400 ml-8">
												{objective.description}
											</p>
											<div className="flex items-center gap-4 mt-3 ml-8 text-xs text-neutral-500">
												<span className="flex items-center gap-1">
													<Users className="h-3 w-3" />
													{objective.team}
												</span>
												<span className="flex items-center gap-1">
													<Flag className="h-3 w-3" />
													{objective.owner}
												</span>
												<span className="flex items-center gap-1">
													<Calendar className="h-3 w-3" />
													{objective.startDate} - {objective.endDate}
												</span>
											</div>
										</div>
										<div className="flex items-center gap-2 ml-4">
											<Button variant="outline" size="sm">
												<Edit2 className="h-3 w-3" />
											</Button>
											<Button variant="outline" size="sm">
												<Trash2 className="h-3 w-3 text-red-500" />
											</Button>
										</div>
									</div>

									{/* Progress Bar */}
									<div className="mt-4 ml-8">
										<div className="flex items-center justify-between mb-2">
											<span className="text-sm font-medium">Overall Progress</span>
											<span className="text-sm font-bold text-primary">{progress}%</span>
										</div>
										<div className="relative w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
											<div
												className={`absolute top-0 left-0 h-full rounded-full transition-all duration-300 ${
													progress >= 75
														? 'bg-green-600'
														: progress >= 50
															? 'bg-primary'
															: 'bg-orange-600'
												}`}
												style={{ width: `${progress}%` }}
											/>
										</div>
									</div>
								</CardHeader>

								{/* Key Results */}
								{isExpanded && (
									<CardContent className="pt-0">
										<div className="ml-8 space-y-3">
											<div className="flex items-center justify-between mb-3">
												<h4 className="font-bold text-sm">Key Results</h4>
												<Button variant="outline" size="sm">
													<Plus className="h-3 w-3 mr-1" />
													Add Key Result
												</Button>
											</div>

											{objective.keyResults.map((kr, index) => {
												const krProgress = Math.min((kr.current / kr.target) * 100, 100)

												return (
													<div
														key={kr.id}
														className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl"
													>
														<div className="flex items-start justify-between mb-2">
															<div className="flex-1">
																<div className="flex items-center gap-2 mb-1">
																	<span className="text-xs font-bold text-neutral-500">
																		KR {index + 1}
																	</span>
																	<span className="text-sm font-medium">
																		{kr.description}
																	</span>
																</div>
																<p className="text-xs text-neutral-600 dark:text-neutral-400">
																	Owner: {kr.owner}
																</p>
															</div>
															<div className="text-right ml-4">
																<div className="text-lg font-bold">
																	{formatNumber(kr.current, kr.unit)}
																</div>
																<div className="text-xs text-neutral-600 dark:text-neutral-400">
																	of {formatNumber(kr.target, kr.unit)}
																</div>
															</div>
														</div>

														<div className="relative w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
															<div
																className={`absolute top-0 left-0 h-full rounded-full transition-all duration-300 ${
																	krProgress >= 100
																		? 'bg-green-600'
																		: krProgress >= 75
																			? 'bg-primary'
																			: krProgress >= 50
																				? 'bg-orange-600'
																				: 'bg-red-600'
																}`}
																style={{ width: `${krProgress}%` }}
															/>
														</div>

														<div className="flex items-center justify-between mt-2">
															<span className="text-xs text-neutral-500">
																{Math.round(krProgress)}% Complete
															</span>
															<Button variant="outline" size="sm" className="h-6 text-xs">
																Update Progress
															</Button>
														</div>
													</div>
												)
											})}
										</div>
									</CardContent>
								)}
							</Card>
						)
					})
				)}
			</div>

			{/* Add Objective Dialog */}
			{showAddObjective && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
					<div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							<div className="flex items-center justify-between mb-6">
								<h3 className="text-2xl font-bold flex items-center gap-2">
									<Target className="h-6 w-6 text-primary" />
									Add New Objective
								</h3>
								<button
									onClick={() => setShowAddObjective(false)}
									className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
								>
									<X className="h-6 w-6" />
								</button>
							</div>

							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium mb-2">
										Objective Title <span className="text-red-500">*</span>
									</label>
									<Input placeholder="e.g., Increase Product Market Fit" />
								</div>

								<div>
									<label className="block text-sm font-medium mb-2">Description</label>
									<Textarea
										placeholder="Describe the objective in detail..."
										rows={3}
									/>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium mb-2">
											Quarter <span className="text-red-500">*</span>
										</label>
										<select className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900">
											{quarters.map((quarter) => (
												<option key={quarter} value={quarter}>
													{quarter}
												</option>
											))}
										</select>
									</div>
									<div>
										<label className="block text-sm font-medium mb-2">Team</label>
										<Input placeholder="e.g., Product" />
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium mb-2">Owner</label>
										<Input placeholder="e.g., John Doe" />
									</div>
									<div>
										<label className="block text-sm font-medium mb-2">Status</label>
										<select className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900">
											<option value="on-track">On Track</option>
											<option value="at-risk">At Risk</option>
											<option value="behind">Behind</option>
											<option value="completed">Completed</option>
										</select>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium mb-2">Start Date</label>
										<Input type="date" />
									</div>
									<div>
										<label className="block text-sm font-medium mb-2">End Date</label>
										<Input type="date" />
									</div>
								</div>

								<div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
									<div className="flex items-center justify-between mb-3">
										<h4 className="font-bold">Key Results</h4>
										<Button variant="outline" size="sm">
											<Plus className="h-3 w-3 mr-1" />
											Add Key Result
										</Button>
									</div>
									<p className="text-xs text-neutral-600 dark:text-neutral-400">
										Add key results after creating the objective
									</p>
								</div>

								<div className="flex items-center gap-2 pt-4">
									<Button className="flex-1">Create Objective</Button>
									<Button
										variant="outline"
										onClick={() => setShowAddObjective(false)}
										className="flex-1"
									>
										Cancel
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

