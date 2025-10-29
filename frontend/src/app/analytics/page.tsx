import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import { BarChart3, TrendingUp, TrendingDown, Users, Clock, Target, Award, AlertCircle } from 'lucide-react'

export default function AnalyticsPage() {
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

	const departments = [
		{ name: '개발팀', members: 15, productivity: 92, avgHours: 7.2, performance: 'excellent' },
		{ name: '마케팅팀', members: 8, productivity: 88, avgHours: 6.5, performance: 'good' },
		{ name: '영업팀', members: 12, productivity: 85, avgHours: 6.8, performance: 'good' },
		{ name: '디자인팀', members: 6, productivity: 90, avgHours: 6.0, performance: 'excellent' },
		{ name: '경영지원팀', members: 7, productivity: 82, avgHours: 5.5, performance: 'average' },
	]

	const topPerformers = [
		{ rank: 1, name: '홍길동', department: '개발팀', score: 98, tasks: 45 },
		{ rank: 2, name: '김영희', department: '마케팅팀', score: 96, tasks: 42 },
		{ rank: 3, name: '이철수', department: '영업팀', score: 94, tasks: 38 },
		{ rank: 4, name: '박민수', department: '디자인팀', score: 92, tasks: 40 },
		{ rank: 5, name: '정수진', department: '개발팀', score: 90, tasks: 37 },
	]

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

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold flex items-center gap-3">
						<BarChart3 className="h-8 w-8 text-primary" />
						성과 분석
					</h1>
					<p className="mt-2 text-neutral-600 dark:text-neutral-400">
						직원 성과와 생산성을 분석하고 인사이트를 확인하세요
					</p>
				</div>
			</div>

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

			{/* Department Performance */}
			<Card>
				<CardHeader>
					<h2 className="text-xl font-bold">부서별 성과</h2>
					<p className="text-sm text-neutral-600 dark:text-neutral-400">
						각 부서의 생산성과 작업 현황을 확인하세요
					</p>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{departments.map((dept) => (
							<div
								key={dept.name}
								className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-2xl"
							>
								<div className="flex items-center justify-between mb-3">
									<div className="flex items-center gap-3">
										<h3 className="font-bold text-lg">{dept.name}</h3>
										{getPerformanceBadge(dept.performance)}
									</div>
									<span className="text-sm text-neutral-600 dark:text-neutral-400">
										{dept.members}명
									</span>
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
											효율성
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
									className="flex items-center gap-4 p-3 border border-neutral-200 dark:border-neutral-800 rounded-2xl"
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
									<div className="flex-1">
										<div className="font-bold">{performer.name}</div>
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
							인사이트
						</h2>
						<p className="text-sm text-neutral-600 dark:text-neutral-400">
							AI가 분석한 주요 인사이트입니다
						</p>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl">
								<div className="flex items-start gap-3">
									<TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
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
									<Users className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
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
									<AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
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
		</div>
	)
}

