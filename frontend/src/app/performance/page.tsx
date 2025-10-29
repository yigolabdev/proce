import { useState } from 'react'
import { Card, CardContent } from '../../components/ui/Card'
import { Award, TrendingUp, TrendingDown, Target, Clock, CheckCircle2, Star } from 'lucide-react'

interface Employee {
	id: string
	name: string
	department: string
	position: string
	performance: {
		productivity: number
		quality: number
		punctuality: number
		collaboration: number
	}
	tasks: {
		completed: number
		inProgress: number
		overdue: number
	}
	avgWorkHours: number
	rating: number
}

export default function PerformancePage() {
	const [employees] = useState<Employee[]>([
		{
			id: '1',
			name: '홍길동',
			department: '개발팀',
			position: '시니어 개발자',
			performance: { productivity: 95, quality: 92, punctuality: 98, collaboration: 90 },
			tasks: { completed: 45, inProgress: 3, overdue: 0 },
			avgWorkHours: 7.2,
			rating: 4.8,
		},
		{
			id: '2',
			name: '김영희',
			department: '마케팅팀',
			position: '마케팅 매니저',
			performance: { productivity: 92, quality: 95, punctuality: 90, collaboration: 94 },
			tasks: { completed: 42, inProgress: 5, overdue: 1 },
			avgWorkHours: 6.8,
			rating: 4.7,
		},
		{
			id: '3',
			name: '이철수',
			department: '영업팀',
			position: '영업 대표',
			performance: { productivity: 88, quality: 85, punctuality: 92, collaboration: 87 },
			tasks: { completed: 38, inProgress: 4, overdue: 2 },
			avgWorkHours: 7.5,
			rating: 4.3,
		},
		{
			id: '4',
			name: '박민수',
			department: '디자인팀',
			position: '시니어 디자이너',
			performance: { productivity: 90, quality: 93, punctuality: 88, collaboration: 91 },
			tasks: { completed: 40, inProgress: 3, overdue: 0 },
			avgWorkHours: 6.5,
			rating: 4.6,
		},
	])

	const [sortBy, setSortBy] = useState<'productivity' | 'quality' | 'rating'>('productivity')

	const sortedEmployees = [...employees].sort((a, b) => {
		if (sortBy === 'rating') return b.rating - a.rating
		return b.performance[sortBy] - a.performance[sortBy]
	})

	const getPerformanceColor = (value: number) => {
		if (value >= 90) return 'text-green-600 dark:text-green-400'
		if (value >= 70) return 'text-blue-600 dark:text-blue-400'
		if (value >= 50) return 'text-yellow-600 dark:text-yellow-400'
		return 'text-red-600 dark:text-red-400'
	}

	const getPerformanceBarColor = (value: number) => {
		if (value >= 90) return 'bg-green-500'
		if (value >= 70) return 'bg-blue-500'
		if (value >= 50) return 'bg-yellow-500'
		return 'bg-red-500'
	}

	const avgProductivity = Math.round(
		employees.reduce((sum, e) => sum + e.performance.productivity, 0) / employees.length
	)
	const avgQuality = Math.round(
		employees.reduce((sum, e) => sum + e.performance.quality, 0) / employees.length
	)
	const totalCompleted = employees.reduce((sum, e) => sum + e.tasks.completed, 0)
	const totalOverdue = employees.reduce((sum, e) => sum + e.tasks.overdue, 0)

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold flex items-center gap-3">
						<Award className="h-8 w-8 text-primary" />
						직원 성과
					</h1>
					<p className="mt-2 text-neutral-600 dark:text-neutral-400">
						개별 직원의 성과와 업무 현황을 확인하세요
					</p>
				</div>
			</div>

			{/* Summary Stats */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between mb-4">
							<Target className="h-8 w-8 text-primary" />
							<TrendingUp className="h-5 w-5 text-green-600" />
						</div>
						<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
							평균 생산성
						</div>
						<div className="text-3xl font-bold">{avgProductivity}%</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between mb-4">
							<Star className="h-8 w-8 text-primary" />
							<TrendingUp className="h-5 w-5 text-green-600" />
						</div>
						<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
							평균 품질
						</div>
						<div className="text-3xl font-bold">{avgQuality}%</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between mb-4">
							<CheckCircle2 className="h-8 w-8 text-primary" />
						</div>
						<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
							완료된 작업
						</div>
						<div className="text-3xl font-bold">{totalCompleted}</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between mb-4">
							<Clock className="h-8 w-8 text-primary" />
							{totalOverdue > 0 ? (
								<TrendingDown className="h-5 w-5 text-red-600" />
							) : (
								<CheckCircle2 className="h-5 w-5 text-green-600" />
							)}
						</div>
						<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
							지연된 작업
						</div>
						<div className={`text-3xl font-bold ${totalOverdue > 0 ? 'text-red-600' : 'text-green-600'}`}>
							{totalOverdue}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Sort Controls */}
			<Card>
				<CardContent className="p-4">
					<div className="flex items-center gap-2">
						<span className="text-sm font-medium">정렬:</span>
						<button
							onClick={() => setSortBy('productivity')}
							className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
								sortBy === 'productivity'
									? 'bg-primary text-white'
									: 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'
							}`}
						>
							생산성
						</button>
						<button
							onClick={() => setSortBy('quality')}
							className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
								sortBy === 'quality'
									? 'bg-primary text-white'
									: 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'
							}`}
						>
							품질
						</button>
						<button
							onClick={() => setSortBy('rating')}
							className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
								sortBy === 'rating'
									? 'bg-primary text-white'
									: 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'
							}`}
						>
							평점
						</button>
					</div>
				</CardContent>
			</Card>

			{/* Employee List */}
			<div className="space-y-4">
				{sortedEmployees.map((employee, index) => (
					<Card key={employee.id}>
						<CardContent className="p-6">
							<div className="flex items-start justify-between mb-4">
								<div className="flex items-center gap-4">
									<div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-lg">
										{index + 1}
									</div>
									<div>
										<h3 className="font-bold text-lg">{employee.name}</h3>
										<p className="text-sm text-neutral-600 dark:text-neutral-400">
											{employee.department} • {employee.position}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-1">
									<Star className="h-5 w-5 text-yellow-500 fill-current" />
									<span className="font-bold text-lg">{employee.rating}</span>
								</div>
							</div>

							<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
								<div>
									<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
										생산성
									</div>
									<div className="flex items-center gap-2">
										<div className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
											<div
												className={`h-full ${getPerformanceBarColor(employee.performance.productivity)}`}
												style={{ width: `${employee.performance.productivity}%` }}
											/>
										</div>
										<span className={`text-sm font-bold ${getPerformanceColor(employee.performance.productivity)}`}>
											{employee.performance.productivity}%
										</span>
									</div>
								</div>
								<div>
									<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
										품질
									</div>
									<div className="flex items-center gap-2">
										<div className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
											<div
												className={`h-full ${getPerformanceBarColor(employee.performance.quality)}`}
												style={{ width: `${employee.performance.quality}%` }}
											/>
										</div>
										<span className={`text-sm font-bold ${getPerformanceColor(employee.performance.quality)}`}>
											{employee.performance.quality}%
										</span>
									</div>
								</div>
								<div>
									<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
										정시성
									</div>
									<div className="flex items-center gap-2">
										<div className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
											<div
												className={`h-full ${getPerformanceBarColor(employee.performance.punctuality)}`}
												style={{ width: `${employee.performance.punctuality}%` }}
											/>
										</div>
										<span className={`text-sm font-bold ${getPerformanceColor(employee.performance.punctuality)}`}>
											{employee.performance.punctuality}%
										</span>
									</div>
								</div>
								<div>
									<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
										협업
									</div>
									<div className="flex items-center gap-2">
										<div className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
											<div
												className={`h-full ${getPerformanceBarColor(employee.performance.collaboration)}`}
												style={{ width: `${employee.performance.collaboration}%` }}
											/>
										</div>
										<span className={`text-sm font-bold ${getPerformanceColor(employee.performance.collaboration)}`}>
											{employee.performance.collaboration}%
										</span>
									</div>
								</div>
							</div>

							<div className="flex items-center gap-6 text-sm">
								<div className="flex items-center gap-2">
									<CheckCircle2 className="h-4 w-4 text-green-600" />
									<span>완료: <span className="font-bold">{employee.tasks.completed}</span></span>
								</div>
								<div className="flex items-center gap-2">
									<Clock className="h-4 w-4 text-blue-600" />
									<span>진행중: <span className="font-bold">{employee.tasks.inProgress}</span></span>
								</div>
								<div className="flex items-center gap-2">
									<TrendingDown className="h-4 w-4 text-red-600" />
									<span>지연: <span className="font-bold">{employee.tasks.overdue}</span></span>
								</div>
								<div className="flex items-center gap-2 ml-auto">
									<Clock className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
									<span>평균 작업시간: <span className="font-bold">{employee.avgWorkHours}시간</span></span>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	)
}

