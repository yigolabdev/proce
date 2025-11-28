import { useState } from 'react'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import { PageHeader } from '../../components/common/PageHeader'
import {
	BarChart3,
	TrendingUp,
	TrendingDown,
	Users,
	Clock,
	Target,
	Award,
	AlertCircle,
	Star,
	CheckCircle2,
	Building2,
	UserCircle2,
} from 'lucide-react'

type ViewMode = 'overview' | 'departments' | 'individuals'

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

export default function AnalyticsPage() {
	const [viewMode, setViewMode] = useState<ViewMode>('overview')
	const [sortBy, setSortBy] = useState<'productivity' | 'quality' | 'rating'>('productivity')

	// KPI Data
	const kpis = [
		{
			label: '전체 직원 수',
			value: '48명',
			change: '+3',
			trend: 'up' as const,
			icon: Users,
		},
		{
			label: '평균 생산성',
			value: '87%',
			change: '+5%',
			trend: 'up' as const,
			icon: TrendingUp,
		},
		{
			label: '평균 작업 시간',
			value: '6.2시간',
			change: '-0.3시간',
			trend: 'up' as const,
			icon: Clock,
		},
		{
			label: '목표 달성률',
			value: '92%',
			change: '+8%',
			trend: 'up' as const,
			icon: Target,
		},
	]

	// Department Data
	const departments = [
		{ name: '개발팀', members: 15, productivity: 92, avgHours: 7.2, performance: 'excellent' },
		{ name: '마케팅팀', members: 8, productivity: 88, avgHours: 6.5, performance: 'good' },
		{ name: '영업팀', members: 12, productivity: 85, avgHours: 6.8, performance: 'good' },
		{ name: '디자인팀', members: 6, productivity: 90, avgHours: 6.0, performance: 'excellent' },
		{ name: '경영지원팀', members: 7, productivity: 82, avgHours: 5.5, performance: 'average' },
	]

	// Top Performers
	const topPerformers = [
		{ rank: 1, name: '홍길동', department: '개발팀', score: 98, tasks: 45 },
		{ rank: 2, name: '김영희', department: '마케팅팀', score: 96, tasks: 42 },
		{ rank: 3, name: '이철수', department: '영업팀', score: 94, tasks: 38 },
		{ rank: 4, name: '박민수', department: '디자인팀', score: 92, tasks: 40 },
		{ rank: 5, name: '정수진', department: '개발팀', score: 90, tasks: 37 },
	]

	// Employees Data
	const employees: Employee[] = [
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
	]

	// Helper Functions
	const getPerformanceBadge = (performance: string) => {
		const styles = {
			excellent: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
			good: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
			average: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
		}
		const labels = {
			excellent: '우수',
			good: '양호',
			average: '보통',
		}
		return (
			<span className={`px-2 py-1 rounded-lg text-xs font-medium ${styles[performance as keyof typeof styles]}`}>
				{labels[performance as keyof typeof labels]}
			</span>
		)
	}

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

	const sortedEmployees = [...employees].sort((a, b) => {
		if (sortBy === 'rating') return b.rating - a.rating
		return b.performance[sortBy] - a.performance[sortBy]
	})

	const avgProductivity = Math.round(
		employees.reduce((sum, e) => sum + e.performance.productivity, 0) / employees.length
	)
	const avgQuality = Math.round(
		employees.reduce((sum, e) => sum + e.performance.quality, 0) / employees.length
	)
	const totalCompleted = employees.reduce((sum, e) => sum + e.tasks.completed, 0)
	const totalOverdue = employees.reduce((sum, e) => sum + e.tasks.overdue, 0)

	return (
		<div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
			{/* Header */}
			<PageHeader
				title="성과 분석"
				description="전사 성과와 개인 생산성을 통합 분석하고 인사이트를 확인하세요"
				icon={BarChart3}
			/>
			
			<div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">

			{/* View Mode Tabs */}
			<Card>
				<CardContent className="p-2">
					<div className="flex gap-2">
						<button
							onClick={() => setViewMode('overview')}
							className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
								viewMode === 'overview'
									? 'bg-primary text-white shadow-lg'
									: 'bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800'
							}`}
						>
							<Target className="h-5 w-5" />
							<span>전체 현황</span>
						</button>
						<button
							onClick={() => setViewMode('departments')}
							className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
								viewMode === 'departments'
									? 'bg-primary text-white shadow-lg'
									: 'bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800'
							}`}
						>
							<Building2 className="h-5 w-5" />
							<span>부서별 분석</span>
						</button>
						<button
							onClick={() => setViewMode('individuals')}
							className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
								viewMode === 'individuals'
									? 'bg-primary text-white shadow-lg'
									: 'bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800'
							}`}
						>
							<UserCircle2 className="h-5 w-5" />
							<span>개인별 성과</span>
						</button>
					</div>
				</CardContent>
			</Card>

			{/* Overview View */}
			{viewMode === 'overview' && (
				<>
					{/* KPIs */}
					<div className="grid gap-4 md:grid-cols-4">
						{kpis.map((kpi) => (
							<Card key={kpi.label}>
								<CardContent className="p-6">
									<div className="flex items-start justify-between mb-4">
										<kpi.icon className="h-8 w-8 text-primary" />
										<div
											className={`flex items-center gap-1 text-sm font-medium ${
												kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
											}`}
										>
											{kpi.trend === 'up' ? (
												<TrendingUp className="h-4 w-4" />
											) : (
												<TrendingDown className="h-4 w-4" />
											)}
											<span>{kpi.change}</span>
										</div>
									</div>
									<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
										{kpi.label}
									</div>
									<div className="text-3xl font-bold">{kpi.value}</div>
								</CardContent>
							</Card>
						))}
					</div>

					<div className="grid gap-6 lg:grid-cols-2">
						{/* Top Performers */}
						<Card>
							<CardHeader>
								<h2 className="text-xl font-bold flex items-center gap-2">
									<Award className="h-6 w-6 text-primary" />
									우수 직원
								</h2>
								<p className="text-sm text-neutral-600 dark:text-neutral-400">
									이번 달 성과가 우수한 직원들입니다
								</p>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{topPerformers.map((performer) => (
										<div
											key={performer.rank}
											className="flex items-center gap-4 p-3 border border-neutral-200 dark:border-neutral-800 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
										>
											<div
												className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
													performer.rank === 1
														? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
														: performer.rank === 2
														? 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
														: performer.rank === 3
														? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
														: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-500'
												}`}
											>
												{performer.rank}
											</div>
											<div className="flex-1 min-w-0">
												<div className="font-bold truncate">{performer.name}</div>
												<div className="text-sm text-neutral-600 dark:text-neutral-400">
													{performer.department}
												</div>
											</div>
											<div className="text-right">
												<div className="font-bold text-primary">{performer.score}점</div>
												<div className="text-sm text-neutral-600 dark:text-neutral-400">
													{performer.tasks}개 완료
												</div>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						{/* Insights */}
						<Card>
							<CardHeader>
								<h2 className="text-xl font-bold flex items-center gap-2">
									<AlertCircle className="h-6 w-6 text-primary" />
									AI 인사이트
								</h2>
								<p className="text-sm text-neutral-600 dark:text-neutral-400">
									AI가 분석한 주요 인사이트입니다
								</p>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl">
										<div className="flex items-start gap-3">
											<TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
											<div>
												<h4 className="font-bold text-green-900 dark:text-green-100 mb-1">
													생산성 증가
												</h4>
												<p className="text-sm text-green-700 dark:text-green-300">
													지난 달 대비 전체 생산성이 5% 증가했습니다. 특히 개발팀의 성과가 두드러집니다.
												</p>
											</div>
										</div>
									</div>

									<div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl">
										<div className="flex items-start gap-3">
											<Users className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
											<div>
												<h4 className="font-bold text-blue-900 dark:text-blue-100 mb-1">
													팀 협업 개선
												</h4>
												<p className="text-sm text-blue-700 dark:text-blue-300">
													부서 간 협업 프로젝트가 증가하면서 전체적인 업무 효율이 향상되었습니다.
												</p>
											</div>
										</div>
									</div>

									<div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-2xl">
										<div className="flex items-start gap-3">
											<AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
											<div>
												<h4 className="font-bold text-orange-900 dark:text-orange-100 mb-1">
													주의 필요
												</h4>
												<p className="text-sm text-orange-700 dark:text-orange-300">
													경영지원팀의 평균 작업 시간이 감소하고 있습니다. 업무 분배를 재검토해보세요.
												</p>
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</>
			)}

			{/* Departments View */}
			{viewMode === 'departments' && (
				<>
					{/* Department Summary Stats */}
					<div className="grid gap-4 md:grid-cols-4">
						<Card>
							<CardContent className="p-6">
								<div className="flex items-center justify-between mb-4">
									<Building2 className="h-8 w-8 text-primary" />
								</div>
								<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
									전체 부서 수
								</div>
								<div className="text-3xl font-bold">{departments.length}</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-6">
								<div className="flex items-center justify-between mb-4">
									<Target className="h-8 w-8 text-primary" />
									<TrendingUp className="h-5 w-5 text-green-600" />
								</div>
								<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
									최고 생산성
								</div>
								<div className="text-3xl font-bold">{Math.max(...departments.map(d => d.productivity))}%</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-6">
								<div className="flex items-center justify-between mb-4">
									<Users className="h-8 w-8 text-primary" />
								</div>
								<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
									평균 팀 규모
								</div>
								<div className="text-3xl font-bold">
									{Math.round(departments.reduce((sum, d) => sum + d.members, 0) / departments.length)}명
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-6">
								<div className="flex items-center justify-between mb-4">
									<Clock className="h-8 w-8 text-primary" />
								</div>
								<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
									평균 작업시간
								</div>
								<div className="text-3xl font-bold">
									{(departments.reduce((sum, d) => sum + d.avgHours, 0) / departments.length).toFixed(1)}h
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Department Performance */}
					<Card>
						<CardHeader>
							<h2 className="text-xl font-bold">부서별 성과 상세</h2>
							<p className="text-sm text-neutral-600 dark:text-neutral-400">
								각 부서의 생산성과 작업 현황을 확인하세요
							</p>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{departments.map((dept) => (
									<div
										key={dept.name}
										className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-2xl hover:border-primary transition-colors"
									>
										<div className="flex items-center justify-between mb-3">
											<div className="flex items-center gap-3">
												<div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold">
													{dept.name[0]}
												</div>
												<div>
													<h3 className="font-bold text-lg">{dept.name}</h3>
													<div className="flex items-center gap-2">
														{getPerformanceBadge(dept.performance)}
														<span className="text-sm text-neutral-600 dark:text-neutral-400">
															{dept.members}명
														</span>
													</div>
												</div>
											</div>
										</div>
										<div className="grid grid-cols-3 gap-4">
											<div>
												<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
													생산성
												</div>
												<div className="flex items-center gap-2">
													<div className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
														<div
															className="h-full bg-primary rounded-full"
															style={{ width: `${dept.productivity}%` }}
														/>
													</div>
													<span className="text-sm font-bold">{dept.productivity}%</span>
												</div>
											</div>
											<div>
												<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
													평균 작업시간
												</div>
												<div className="text-lg font-bold">{dept.avgHours}시간</div>
											</div>
											<div>
												<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
													효율성 지수
												</div>
												<div className="text-lg font-bold">
													{Math.round((dept.productivity / dept.avgHours) * 10)}점
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</>
			)}

			{/* Individuals View */}
			{viewMode === 'individuals' && (
				<>
					{/* Individual Summary Stats */}
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
								<span className="text-sm font-medium">정렬 기준:</span>
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
											<div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-lg">
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

									<div className="flex items-center gap-6 text-sm flex-wrap">
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
											<span>평균: <span className="font-bold">{employee.avgWorkHours}시간</span></span>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</>
			)}
		</div>
		</div>
	)
}
