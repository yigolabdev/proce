import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { 
	TrendingUp, 
	TrendingDown,
	Zap,
	Users,
	Award,
	Calendar,
	ArrowRight,
	CheckCircle2,
	AlertCircle,
	Sparkles,
	Target,
	Eye,
	Clock,
	FileText,
	FolderKanban
} from 'lucide-react'

interface WorkEntry {
	id: string
	title: string
	description: string
	category: string
	projectId?: string
	objectiveId?: string
	tags: string[]
	date: Date
	duration?: string
	status: 'draft' | 'submitted'
	isConfidential?: boolean
}

interface Project {
	id: string
	name: string
}

interface Objective {
	id: string
	title: string
}

interface KPIMetric {
	id: string
	name: string
	category: string
	current: number
	target: number
	unit: string
	progress: number
	trend: 'up' | 'down' | 'stable'
	status: 'excellent' | 'good' | 'warning' | 'critical'
}

interface Achievement {
	id: string
	title: string
	description: string
	date: Date
	icon: string
}

export default function DashboardPage() {
	const navigate = useNavigate()
	const [workEntries, setWorkEntries] = useState<WorkEntry[]>([])
	
	// Load work entries from localStorage
	useEffect(() => {
		try {
			const saved = localStorage.getItem('workEntries')
			if (saved) {
				const parsed = JSON.parse(saved)
				const entriesWithDates = parsed.map((entry: any) => ({
					...entry,
					date: new Date(entry.date),
				}))
				setWorkEntries(entriesWithDates)
			}
		} catch (error) {
			console.error('Failed to load work entries:', error)
		}
	}, [])
	
	// Calculate real OKR progress based on actual work entries
	const calculateOKRProgress = (objectiveId: string) => {
		const relatedEntries = workEntries.filter(entry => entry.objectiveId === objectiveId)
		if (relatedEntries.length === 0) return 0
		
		// Simple calculation: each work entry contributes to progress
		// This is a basic approach - in production, you'd have more sophisticated logic
		const baseProgress = Math.min(relatedEntries.length * 15, 100)
		return baseProgress
	}
	
	// OKR Data with real progress calculation
	const myOKRs = [
		{
			id: '1',
			title: 'Increase Product Market Fit',
			progress: calculateOKRProgress('1') || 75,
			keyResultsCount: 3,
			status: (calculateOKRProgress('1') >= 75 ? 'on-track' : calculateOKRProgress('1') >= 50 ? 'at-risk' : 'behind') as const,
		},
		{
			id: '2',
			title: 'Scale Revenue Growth',
			progress: calculateOKRProgress('2') || 64,
			keyResultsCount: 3,
			status: (calculateOKRProgress('2') >= 75 ? 'on-track' : calculateOKRProgress('2') >= 50 ? 'at-risk' : 'behind') as const,
		},
		{
			id: '3',
			title: 'Enhance Team Productivity',
			progress: calculateOKRProgress('3') || 85,
			keyResultsCount: 4,
			status: (calculateOKRProgress('3') >= 75 ? 'on-track' : calculateOKRProgress('3') >= 50 ? 'at-risk' : 'behind') as const,
		},
	]

	const avgOKRProgress = Math.round(
		myOKRs.reduce((sum, okr) => sum + okr.progress, 0) / myOKRs.length
	)
	
	// Recent Work (Last 7 Days)
	const recentWork = useMemo(() => {
		const sevenDaysAgo = new Date()
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
		
		return workEntries
			.filter(entry => {
				const entryDate = new Date(entry.date)
				return entryDate >= sevenDaysAgo
			})
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
			.slice(0, 5)
	}, [workEntries])
	
	// Load projects and objectives for display
	const [projects, setProjects] = useState<Project[]>([])
	const [objectives, setObjectives] = useState<Objective[]>([])
	
	useEffect(() => {
		// Load projects
		const savedProjects = localStorage.getItem('projects')
		if (savedProjects) {
			setProjects(JSON.parse(savedProjects))
		}
		
		// Load objectives (using same as OKR page)
		setObjectives(myOKRs)
	}, [])
	
	const getProjectName = (projectId?: string) => {
		if (!projectId) return null
		const project = projects.find((p: any) => p.id === projectId)
		return project?.name
	}
	
	const getObjectiveName = (objectiveId?: string) => {
		if (!objectiveId) return null
		const objective = objectives.find((o: any) => o.id === objectiveId)
		return objective?.title
	}
	
	const formatRelativeDate = (date: Date) => {
		const now = new Date()
		const diff = now.getTime() - date.getTime()
		const days = Math.floor(diff / (1000 * 60 * 60 * 24))
		
		if (days === 0) return 'Today'
		if (days === 1) return 'Yesterday'
		if (days < 7) return `${days} days ago`
		return date.toLocaleDateString()
	}
	
	// KPI Metrics
	const [kpiMetrics] = useState<KPIMetric[]>([
		{
			id: '1',
			name: 'Monthly Recurring Revenue',
			category: 'Revenue',
			current: 1150000,
			target: 1000000,
			unit: 'USD',
			progress: 115,
			trend: 'up',
			status: 'excellent',
		},
		{
			id: '2',
			name: 'Customer Acquisition Cost',
			category: 'Marketing',
			current: 450,
			target: 500,
			unit: 'USD',
			progress: 110,
			trend: 'up',
			status: 'excellent',
		},
		{
			id: '3',
			name: 'Customer Lifetime Value',
			category: 'Revenue',
			current: 5200,
			target: 5000,
			unit: 'USD',
			progress: 104,
			trend: 'up',
			status: 'good',
		},
		{
			id: '4',
			name: 'Employee Productivity Score',
			category: 'Operations',
			current: 87,
			target: 85,
			unit: '%',
			progress: 102,
			trend: 'up',
			status: 'good',
		},
		{
			id: '5',
			name: 'Customer Satisfaction',
			category: 'Customer',
			current: 4.6,
			target: 4.8,
			unit: '/5.0',
			progress: 96,
			trend: 'down',
			status: 'warning',
		},
		{
			id: '6',
			name: 'Net Promoter Score',
			category: 'Customer',
			current: 42,
			target: 50,
			unit: '',
			progress: 84,
			trend: 'stable',
			status: 'warning',
		},
	])

	// Recent Achievements
	const achievements: Achievement[] = [
		{
			id: '1',
			title: 'Q3 매출 목표 달성',
			description: 'MRR 목표 115% 초과 달성',
			date: new Date('2024-10-25'),
			icon: '🎯',
		},
		{
			id: '2',
			title: '신규 고객 50명 확보',
			description: '목표 대비 125% 달성',
			date: new Date('2024-10-20'),
			icon: '🎉',
		},
		{
			id: '3',
			title: '직원 생산성 향상',
			description: '전월 대비 12% 증가',
			date: new Date('2024-10-15'),
			icon: '📈',
		},
	]

	const getStatusColor = (status: KPIMetric['status']) => {
		switch (status) {
			case 'excellent':
				return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
			case 'good':
				return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
			case 'warning':
				return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
			case 'critical':
				return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
		}
	}

	const getStatusLabel = (status: KPIMetric['status']) => {
		switch (status) {
			case 'excellent':
				return '우수'
			case 'good':
				return '양호'
			case 'warning':
				return '주의'
			case 'critical':
				return '위험'
		}
	}

	const getTrendIcon = (trend: KPIMetric['trend']) => {
		switch (trend) {
			case 'up':
				return <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
			case 'down':
				return <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
			case 'stable':
				return <ArrowRight className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
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
		return `${value.toLocaleString()}${unit}`
	}

	const overallProgress = Math.round(
		kpiMetrics.reduce((sum, kpi) => sum + kpi.progress, 0) / kpiMetrics.length
	)

	const excellentCount = kpiMetrics.filter((kpi) => kpi.status === 'excellent').length
	const goodCount = kpiMetrics.filter((kpi) => kpi.status === 'good').length
	const warningCount = kpiMetrics.filter((kpi) => kpi.status === 'warning').length
	const criticalCount = kpiMetrics.filter((kpi) => kpi.status === 'critical').length

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold">전체 대시보드</h1>
				<p className="mt-2 text-neutral-600 dark:text-neutral-400">
					회사의 목표 달성 현황을 확인하세요
				</p>
			</div>

			{/* Overall Progress */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-xl font-bold flex items-center gap-2">
								<Sparkles className="h-6 w-6 text-primary" />
								전체 목표 달성률
							</h2>
							<p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
								모든 KPI의 평균 달성률
							</p>
						</div>
						<div className="text-right">
							<p className="text-4xl font-bold text-primary">{overallProgress}%</p>
							<p className="text-sm text-neutral-600 dark:text-neutral-400">
								{overallProgress >= 100 ? '목표 초과 달성! 🎉' : '목표를 향해 전진 중'}
							</p>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
						<div
							className={`h-full transition-all duration-500 ${
								overallProgress >= 100
									? 'bg-gradient-to-r from-green-500 to-emerald-500'
									: overallProgress >= 80
									? 'bg-gradient-to-r from-blue-500 to-cyan-500'
									: 'bg-gradient-to-r from-orange-500 to-amber-500'
							}`}
							style={{ width: `${Math.min(overallProgress, 100)}%` }}
						/>
					</div>
					<div className="flex items-center justify-between mt-4 text-sm">
						<div className="flex items-center gap-4">
							<span className="flex items-center gap-1">
								<CheckCircle2 className="h-4 w-4 text-green-600" />
								<span className="font-medium">{excellentCount + goodCount}개 달성</span>
							</span>
							<span className="flex items-center gap-1">
								<AlertCircle className="h-4 w-4 text-orange-600" />
								<span className="font-medium">{warningCount + criticalCount}개 개선 필요</span>
							</span>
						</div>
						<span className="text-neutral-600 dark:text-neutral-400">
							총 {kpiMetrics.length}개 KPI
						</span>
					</div>
				</CardContent>
			</Card>

			{/* My OKR Summary */}
			<Card className="border-primary/20">
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-xl font-bold flex items-center gap-2">
								<Target className="h-6 w-6 text-primary" />
								내 목표 (My OKR)
							</h2>
							<p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
								개인 목표 진행 상황
							</p>
						</div>
						<div className="flex items-center gap-3">
							<div className="text-right">
								<p className="text-3xl font-bold text-primary">{avgOKRProgress}%</p>
								<p className="text-xs text-neutral-600 dark:text-neutral-400">평균 달성률</p>
							</div>
							<Button 
								variant="outline" 
								size="sm" 
								onClick={() => navigate('/okr')}
								className="flex items-center gap-2"
							>
								<Eye className="h-4 w-4" />
								자세히 보기
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{myOKRs.map((okr) => (
							<div
								key={okr.id}
								className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-2xl hover:border-primary transition-colors cursor-pointer"
								onClick={() => navigate('/okr')}
							>
								<div className="flex items-start justify-between mb-3">
									<h3 className="font-bold text-sm flex-1">{okr.title}</h3>
									<span
										className={`text-xs font-medium px-2 py-1 rounded-full ${
											okr.status === 'on-track'
												? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
												: okr.status === 'at-risk'
												? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
												: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
										}`}
									>
										{okr.status === 'on-track' ? '순조' : okr.status === 'at-risk' ? '주의' : '위험'}
									</span>
								</div>
								<div className="space-y-2">
									<div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
										<span>{okr.keyResultsCount}개 핵심 결과</span>
										<span className="font-bold text-primary">{okr.progress}%</span>
									</div>
									<div className="relative w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
										<div
											className={`absolute top-0 left-0 h-full rounded-full transition-all duration-300 ${
												okr.status === 'on-track'
													? 'bg-green-500'
													: okr.status === 'at-risk'
													? 'bg-orange-500'
													: 'bg-red-500'
											}`}
											style={{ width: `${okr.progress}%` }}
										/>
									</div>
								</div>
							</div>
						))}
					</div>
					{myOKRs.length === 0 && (
						<div className="text-center py-12">
							<Target className="h-16 w-16 mx-auto mb-4 text-neutral-300 dark:text-neutral-700" />
							<p className="text-neutral-600 dark:text-neutral-400 mb-4">
								아직 설정된 목표가 없습니다
							</p>
							<Button onClick={() => navigate('/okr')} className="flex items-center gap-2">
								<Target className="h-4 w-4" />
								목표 설정하기
							</Button>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Recent Work Section */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-xl font-bold flex items-center gap-2">
								<FileText className="h-6 w-6 text-primary" />
								최근 업무 (Recent Work)
							</h2>
							<p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
								지난 7일간의 업무 활동
							</p>
						</div>
						<Button 
							variant="outline" 
							size="sm" 
							onClick={() => navigate('/work-history')}
							className="flex items-center gap-2"
						>
							전체 보기
							<ArrowRight className="h-4 w-4" />
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					{recentWork.length === 0 ? (
						<div className="text-center py-12">
							<FileText className="h-16 w-16 mx-auto mb-4 text-neutral-300 dark:text-neutral-700" />
							<p className="text-neutral-600 dark:text-neutral-400 mb-2">
								최근 7일간 업무 기록이 없습니다
							</p>
							<p className="text-sm text-neutral-500 mb-4">
								업무를 입력하면 여기에 표시됩니다
							</p>
							<Button onClick={() => navigate('/input')} className="flex items-center gap-2">
								<FileText className="h-4 w-4" />
								업무 입력하기
							</Button>
						</div>
					) : (
						<div className="space-y-3">
							{recentWork.map(entry => (
								<div
									key={entry.id}
									className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-2xl hover:border-primary hover:shadow-md transition-all cursor-pointer"
									onClick={() => navigate('/work-history')}
								>
									<div className="flex items-start justify-between mb-2">
										<h3 className="font-bold text-sm flex-1">{entry.title}</h3>
										<span className="text-xs text-neutral-500 ml-2 shrink-0">
											{formatRelativeDate(new Date(entry.date))}
										</span>
									</div>
									<p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
										{entry.description}
									</p>
									<div className="flex items-center gap-2 flex-wrap">
										{entry.projectId && getProjectName(entry.projectId) && (
											<span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-full">
												<FolderKanban className="h-3 w-3" />
												{getProjectName(entry.projectId)}
											</span>
										)}
										{entry.objectiveId && getObjectiveName(entry.objectiveId) && (
											<span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
												<Target className="h-3 w-3" />
												{getObjectiveName(entry.objectiveId)}
											</span>
										)}
										{entry.duration && (
											<span className="inline-flex items-center gap-1 text-xs text-neutral-500">
												<Clock className="h-3 w-3" />
												{entry.duration}
											</span>
										)}
									</div>
								</div>
							))}
							{recentWork.length >= 5 && (
								<div className="text-center pt-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => navigate('/work-history')}
										className="flex items-center gap-2"
									>
										더 많은 업무 보기
										<ArrowRight className="h-4 w-4" />
									</Button>
								</div>
							)}
						</div>
					)}
				</CardContent>
			</Card>

			{/* KPI Metrics Grid */}
			<div>
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-xl font-bold">핵심 성과 지표 (KPI)</h2>
					<div className="flex items-center gap-2 text-sm">
						<span className={`px-2 py-1 rounded ${getStatusColor('excellent')}`}>
							우수 {excellentCount}
						</span>
						<span className={`px-2 py-1 rounded ${getStatusColor('good')}`}>
							양호 {goodCount}
						</span>
						<span className={`px-2 py-1 rounded ${getStatusColor('warning')}`}>
							주의 {warningCount}
						</span>
						{criticalCount > 0 && (
							<span className={`px-2 py-1 rounded ${getStatusColor('critical')}`}>
								위험 {criticalCount}
							</span>
						)}
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{kpiMetrics.map((kpi) => (
						<Card key={kpi.id} className="hover:shadow-lg transition-shadow">
							<CardContent className="p-6">
								<div className="flex items-start justify-between mb-4">
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-2">
											<span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
												{kpi.category}
											</span>
											<span className={`text-xs font-medium px-2 py-0.5 rounded ${getStatusColor(kpi.status)}`}>
												{getStatusLabel(kpi.status)}
											</span>
										</div>
										<h3 className="font-bold text-sm mb-1">{kpi.name}</h3>
									</div>
									{getTrendIcon(kpi.trend)}
								</div>

								<div className="space-y-3">
									<div>
										<div className="flex items-end justify-between mb-1">
											<span className="text-xs text-neutral-600 dark:text-neutral-400">현재</span>
											<span className="text-2xl font-bold">
												{formatNumber(kpi.current, kpi.unit)}
											</span>
										</div>
										<div className="flex items-end justify-between">
											<span className="text-xs text-neutral-600 dark:text-neutral-400">목표</span>
											<span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
												{formatNumber(kpi.target, kpi.unit)}
											</span>
										</div>
									</div>

									<div>
										<div className="flex items-center justify-between mb-1">
											<span className="text-xs text-neutral-600 dark:text-neutral-400">달성률</span>
											<span className={`text-sm font-bold ${
												kpi.progress >= 100 ? 'text-green-600 dark:text-green-400' : 
												kpi.progress >= 80 ? 'text-blue-600 dark:text-blue-400' : 
												'text-orange-600 dark:text-orange-400'
											}`}>
												{kpi.progress}%
											</span>
										</div>
										<div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
											<div
												className={`h-full transition-all ${
													kpi.progress >= 100 ? 'bg-green-500' : 
													kpi.progress >= 80 ? 'bg-blue-500' : 
													'bg-orange-500'
												}`}
												style={{ width: `${Math.min(kpi.progress, 100)}%` }}
											/>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			{/* Recent Achievements & Quick Stats */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Recent Achievements */}
				<Card>
					<CardHeader>
						<h2 className="text-xl font-bold flex items-center gap-2">
							<Award className="h-6 w-6 text-primary" />
							최근 성과
						</h2>
					</CardHeader>
					<CardContent className="space-y-3">
						{achievements.map((achievement) => (
							<div
								key={achievement.id}
								className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
							>
								<div className="flex items-start gap-3">
									<span className="text-3xl">{achievement.icon}</span>
									<div className="flex-1 min-w-0">
										<h3 className="font-bold mb-1">{achievement.title}</h3>
										<p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
											{achievement.description}
										</p>
										<div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
											<Calendar className="h-3 w-3" />
											{achievement.date.toLocaleDateString('ko-KR')}
										</div>
									</div>
								</div>
							</div>
						))}
					</CardContent>
				</Card>

				{/* Quick Stats */}
				<Card>
					<CardHeader>
						<h2 className="text-xl font-bold flex items-center gap-2">
							<Zap className="h-6 w-6 text-primary" />
							빠른 통계
						</h2>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
								<div className="flex items-center gap-2 mb-2">
									<CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
									<span className="text-sm font-medium text-green-900 dark:text-green-100">
										목표 달성
									</span>
								</div>
								<p className="text-3xl font-bold text-green-700 dark:text-green-300">
									{excellentCount + goodCount}
								</p>
								<p className="text-xs text-green-600 dark:text-green-400 mt-1">
									전체 KPI 중 {Math.round(((excellentCount + goodCount) / kpiMetrics.length) * 100)}%
								</p>
							</div>

							<div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl">
								<div className="flex items-center gap-2 mb-2">
									<AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
									<span className="text-sm font-medium text-orange-900 dark:text-orange-100">
										개선 필요
									</span>
								</div>
								<p className="text-3xl font-bold text-orange-700 dark:text-orange-300">
									{warningCount + criticalCount}
								</p>
								<p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
									집중 관리 필요
								</p>
							</div>
						</div>

						<div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
							<div className="flex items-center justify-between mb-2">
								<div className="flex items-center gap-2">
									<Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
									<span className="text-sm font-medium text-blue-900 dark:text-blue-100">
										팀 생산성
									</span>
								</div>
								<TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
							</div>
							<p className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-1">87%</p>
							<p className="text-xs text-blue-600 dark:text-blue-400">
								전월 대비 +5% 증가
							</p>
						</div>

						<div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
							<div className="flex items-center justify-between mb-2">
								<div className="flex items-center gap-2">
									<Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
									<span className="text-sm font-medium text-purple-900 dark:text-purple-100">
										이번 달 성과
									</span>
								</div>
								<Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
							</div>
							<p className="text-3xl font-bold text-purple-700 dark:text-purple-300 mb-1">3</p>
							<p className="text-xs text-purple-600 dark:text-purple-400">
								주요 목표 달성
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Motivational Message */}
			<Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
				<CardContent className="p-6">
					<div className="flex items-center gap-4">
						<div className="p-3 rounded-2xl bg-primary/10">
							<Sparkles className="h-8 w-8 text-primary" />
						</div>
						<div className="flex-1">
							<h3 className="font-bold text-lg mb-1">
								{overallProgress >= 100
									? '🎉 목표를 초과 달성했습니다!'
									: overallProgress >= 80
									? '💪 목표 달성까지 조금만 더 힘내세요!'
									: '🚀 함께 목표를 향해 나아가고 있습니다!'}
							</h3>
							<p className="text-sm text-neutral-600 dark:text-neutral-400">
								{overallProgress >= 100
									? '팀의 노력으로 모든 목표를 달성했습니다. 계속해서 우수한 성과를 유지해 주세요!'
									: overallProgress >= 80
									? '거의 다 왔습니다! 현재 페이스를 유지하면 곧 목표를 달성할 수 있습니다.'
									: '우리의 비전과 미션을 기억하며, 하나씩 목표를 달성해 나가고 있습니다. 함께 해주셔서 감사합니다!'}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
