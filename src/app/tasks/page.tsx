/**
 * Tasks Management Page
 * 모든 Task를 관리하는 페이지
 * - 필터링: 상태, 우선순위, 마감일, KPI/OKR
 * - 검색: Task 제목
 * - Work Entry 연결 확인
 */

import { useState, useMemo } from 'react'
import { PageHeader } from '../../components/common/PageHeader'
import { Button } from '../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Tabs } from '../../components/ui/Tabs'
import { 
	ListTodo, 
	CheckCircle2, 
	XCircle, 
	Clock, 
	Search,
	Filter,
	Calendar,
	AlertCircle,
	ArrowUpDown,
	Target,
	BarChart3,
	FileText,
	X,
	Users,
	Sparkles
} from 'lucide-react'
import { toast } from 'sonner'
import { useTasks } from '../../hooks/useTasks'
import { storage } from '../../utils/storage'
import type { TaskRecommendation } from '../../types/common.types'
import type { Objective } from '../../types/okr.types'
import type { KPI } from '../../types/kpi.types'

export default function TasksPage() {
	const { tasks, loading, updateTask, deleteTask, completeTask } = useTasks()
	
	// UI State
	const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'accepted' | 'completed' | 'rejected'>('all')
	const [searchQuery, setSearchQuery] = useState('')
	const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')
	const [sortBy, setSortBy] = useState<'deadline' | 'priority' | 'created'>('deadline')
	const [showFilters, setShowFilters] = useState(false)
	const [selectedTask, setSelectedTask] = useState<TaskRecommendation | null>(null)

	// Load related data
	const objectives = useMemo(() => storage.get<Objective[]>('objectives') || [], [])
	const kpis = useMemo(() => storage.get<KPI[]>('kpis') || [], [])
	const workEntries = useMemo(() => storage.get<any[]>('work_entries') || [], [])

	// Filter and sort tasks
	const filteredTasks = useMemo(() => {
		let filtered = tasks

		// Status filter
		if (activeTab !== 'all') {
			filtered = filtered.filter(t => t.status === activeTab)
		}

		// Search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase()
			filtered = filtered.filter(t => 
				t.title.toLowerCase().includes(query) ||
				t.description?.toLowerCase().includes(query)
			)
		}

		// Priority filter
		if (priorityFilter !== 'all') {
			filtered = filtered.filter(t => t.priority === priorityFilter)
		}

		// Sort
		filtered = [...filtered].sort((a, b) => {
			if (sortBy === 'deadline') {
				const aDeadline = a.deadline || '9999-12-31'
				const bDeadline = b.deadline || '9999-12-31'
				return aDeadline.localeCompare(bDeadline)
			} else if (sortBy === 'priority') {
				const priorityOrder = { high: 0, medium: 1, low: 2 }
				return priorityOrder[a.priority] - priorityOrder[b.priority]
			} else {
				const aCreated = a.createdAt || '2000-01-01'
				const bCreated = b.createdAt || '2000-01-01'
				return bCreated.localeCompare(aCreated)
			}
		})

		return filtered
	}, [tasks, activeTab, searchQuery, priorityFilter, sortBy])

	// Statistics
	const stats = useMemo(() => {
		return {
			total: tasks.length,
			pending: tasks.filter(t => t.status === 'pending').length,
			accepted: tasks.filter(t => t.status === 'accepted').length,
			completed: tasks.filter(t => t.status === 'completed').length,
			rejected: tasks.filter(t => t.status === 'rejected').length,
		}
	}, [tasks])

	// Get related info
	const getTaskRelations = (task: TaskRecommendation) => {
		const objective = objectives.find(o => o.id === task.objectiveId)
		const kpi = kpis.find(k => k.id === task.kpiId)
		const relatedWorkEntries = workEntries.filter(we => we.taskId === task.id)
		
		return { objective, kpi, workEntriesCount: relatedWorkEntries.length }
	}

	// Get deadline urgency
	const getDeadlineUrgency = (deadline?: string) => {
		if (!deadline) return { color: 'text-neutral-500', label: '마감일 없음' }
		
		const today = new Date()
		const deadlineDate = new Date(deadline)
		const daysUntil = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
		
		if (daysUntil < 0) return { color: 'text-red-500', label: `${Math.abs(daysUntil)}일 지연` }
		if (daysUntil === 0) return { color: 'text-orange-500', label: '오늘 마감' }
		if (daysUntil <= 3) return { color: 'text-orange-400', label: `${daysUntil}일 남음` }
		if (daysUntil <= 7) return { color: 'text-yellow-500', label: `${daysUntil}일 남음` }
		return { color: 'text-neutral-400', label: `${daysUntil}일 남음` }
	}

	// Get priority badge
	const getPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
		const badges = {
			high: { color: 'bg-red-500/10 text-red-400 border-red-500/20', label: '높음' },
			medium: { color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', label: '보통' },
			low: { color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', label: '낮음' },
		}
		return badges[priority]
	}

	// Handlers
	const handleStatusChange = async (taskId: string, newStatus: TaskRecommendation['status']) => {
		try {
			await updateTask(taskId, { status: newStatus })
			toast.success('Task 상태가 변경되었습니다')
		} catch {
			toast.error('상태 변경에 실패했습니다')
		}
	}

	const handleComplete = async (taskId: string) => {
		try {
			await completeTask(taskId)
			toast.success('Task가 완료되었습니다')
		} catch {
			toast.error('Task 완료에 실패했습니다')
		}
	}

	const handleDelete = async (taskId: string) => {
		if (!confirm('이 Task를 삭제하시겠습니까?')) return
		
		try {
			await deleteTask(taskId)
			toast.success('Task가 삭제되었습니다')
		} catch {
			toast.error('Task 삭제에 실패했습니다')
		}
	}

	return (
		<div className="min-h-screen bg-background-dark">
			<div className="max-w-[1600px] mx-auto px-6 py-6 space-y-8">
				{/* Page Header */}
				<PageHeader
					title="Task 관리"
					description="모든 Task를 조회하고 관리합니다"
					actions={
						<Button onClick={() => setShowFilters(!showFilters)} variant="outline">
							<Filter className="h-4 w-4 mr-2" />
							필터 {showFilters ? '숨기기' : '보기'}
						</Button>
					}
				/>

				{/* Statistics */}
				<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
					<Card className="bg-surface-dark border-border-dark">
						<CardContent className="pt-6">
							<div className="text-2xl font-bold text-white">{stats.total}</div>
							<div className="text-sm text-neutral-400 mt-1">전체 Tasks</div>
						</CardContent>
					</Card>
					<Card className="bg-surface-dark border-border-dark">
						<CardContent className="pt-6">
							<div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
							<div className="text-sm text-neutral-400 mt-1">대기 중</div>
						</CardContent>
					</Card>
					<Card className="bg-surface-dark border-border-dark">
						<CardContent className="pt-6">
							<div className="text-2xl font-bold text-blue-400">{stats.accepted}</div>
							<div className="text-sm text-neutral-400 mt-1">진행 중</div>
						</CardContent>
					</Card>
					<Card className="bg-surface-dark border-border-dark">
						<CardContent className="pt-6">
							<div className="text-2xl font-bold text-green-400">{stats.completed}</div>
							<div className="text-sm text-neutral-400 mt-1">완료</div>
						</CardContent>
					</Card>
					<Card className="bg-surface-dark border-border-dark">
						<CardContent className="pt-6">
							<div className="text-2xl font-bold text-red-400">{stats.rejected}</div>
							<div className="text-sm text-neutral-400 mt-1">거절</div>
						</CardContent>
					</Card>
				</div>

				{/* Filters */}
				{showFilters && (
					<Card className="bg-surface-dark border-border-dark">
						<CardContent className="pt-6">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								{/* Priority Filter */}
								<div>
									<label className="block text-sm font-medium text-neutral-300 mb-2">
										우선순위
									</label>
									<select
										value={priorityFilter}
										onChange={(e) => setPriorityFilter(e.target.value as any)}
										className="w-full bg-background-dark border border-border-dark rounded-lg px-3 py-2 text-white"
									>
										<option value="all">전체</option>
										<option value="high">높음</option>
										<option value="medium">보통</option>
										<option value="low">낮음</option>
									</select>
								</div>

								{/* Sort By */}
								<div>
									<label className="block text-sm font-medium text-neutral-300 mb-2">
										정렬 기준
									</label>
									<select
										value={sortBy}
										onChange={(e) => setSortBy(e.target.value as any)}
										className="w-full bg-background-dark border border-border-dark rounded-lg px-3 py-2 text-white"
									>
										<option value="deadline">마감일 순</option>
										<option value="priority">우선순위 순</option>
										<option value="created">생성일 순</option>
									</select>
								</div>

								{/* Search */}
								<div>
									<label className="block text-sm font-medium text-neutral-300 mb-2">
										검색
									</label>
									<div className="relative">
										<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
										<input
											type="text"
											value={searchQuery}
											onChange={(e) => setSearchQuery(e.target.value)}
											placeholder="Task 제목 검색..."
											className="w-full bg-background-dark border border-border-dark rounded-lg pl-10 pr-3 py-2 text-white placeholder-neutral-500"
										/>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Tabs */}
				<Tabs
					items={[
						{ id: 'all', label: `전체 (${stats.total})`, icon: ListTodo },
						{ id: 'pending', label: `대기 중 (${stats.pending})`, icon: Clock },
						{ id: 'accepted', label: `진행 중 (${stats.accepted})`, icon: CheckCircle2 },
						{ id: 'completed', label: `완료 (${stats.completed})`, icon: CheckCircle2 },
						{ id: 'rejected', label: `거절 (${stats.rejected})`, icon: XCircle },
					]}
					activeTab={activeTab}
					onTabChange={(id) => setActiveTab(id as any)}
					variant="underline"
				/>

				{/* Task List */}
				<div className="space-y-4">
					{loading && (
						<Card className="bg-surface-dark border-border-dark">
							<CardContent className="py-12 text-center">
								<div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
								<p className="text-neutral-400 mt-4">로딩 중...</p>
							</CardContent>
						</Card>
					)}

					{!loading && filteredTasks.length === 0 && (
						<Card className="bg-surface-dark border-border-dark">
							<CardContent className="py-12 text-center">
								<ListTodo className="h-12 w-12 text-neutral-600 mx-auto mb-4" />
								<p className="text-neutral-400">표시할 Task가 없습니다</p>
							</CardContent>
						</Card>
					)}

					{!loading && filteredTasks.map((task) => {
						const { objective, kpi, workEntriesCount } = getTaskRelations(task)
						const urgency = getDeadlineUrgency(task.deadline)
						const priorityBadge = getPriorityBadge(task.priority)

						return (
							<Card 
								key={task.id} 
								className="bg-surface-dark border-border-dark hover:border-orange-500/30 transition-colors cursor-pointer"
								onClick={() => setSelectedTask(task)}
							>
								<CardHeader>
									<div className="flex items-start justify-between gap-4">
										<div className="flex-1 min-w-0">
											<CardTitle className="text-white text-lg flex items-center gap-2 mb-2">
												<ListTodo className="h-5 w-5 text-orange-400 flex-shrink-0" />
												<span className="truncate">{task.title}</span>
											</CardTitle>
											<p className="text-sm text-neutral-400 line-clamp-2 mb-3">
												{task.description}
											</p>

											{/* Badges */}
											<div className="flex flex-wrap items-center gap-2">
												{/* Priority */}
												<span className={`px-2 py-1 rounded-lg text-xs font-medium border ${priorityBadge.color}`}>
													{priorityBadge.label}
												</span>

												{/* Status */}
												<span className={`px-2 py-1 rounded-lg text-xs font-medium ${
													task.status === 'completed' ? 'bg-green-500/10 text-green-400' :
													task.status === 'accepted' ? 'bg-blue-500/10 text-blue-400' :
													task.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
													'bg-red-500/10 text-red-400'
												}`}>
													{task.status === 'completed' ? '완료' :
													 task.status === 'accepted' ? '진행 중' :
													 task.status === 'pending' ? '대기 중' : '거절됨'}
												</span>

												{/* Deadline */}
												{task.deadline && (
													<span className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${urgency.color}`}>
														<Calendar className="h-3 w-3" />
														{urgency.label}
													</span>
												)}

												{/* AI Generated */}
												{task.source === 'ai' && (
													<span className="px-2 py-1 rounded-lg text-xs font-medium bg-purple-500/10 text-purple-400">
														AI 추천
													</span>
												)}

												{/* Work Entries Count */}
												{workEntriesCount > 0 && (
													<span className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-neutral-700/50 text-neutral-300">
														<FileText className="h-3 w-3" />
														{workEntriesCount}개 작업 기록
													</span>
												)}
											</div>

											{/* Relations */}
											{(kpi || objective) && (
												<div className="mt-3 pt-3 border-t border-border-dark">
													<div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
														{kpi && (
															<div className="flex items-center gap-1">
																<Target className="h-3 w-3 text-orange-400" />
																<span>KPI: {kpi.name}</span>
															</div>
														)}
														{objective && (
															<div className="flex items-center gap-1">
																<BarChart3 className="h-3 w-3 text-blue-400" />
																<span>OKR: {objective.title}</span>
															</div>
														)}
													</div>
												</div>
											)}
										</div>

										{/* Actions */}
										<div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
											{task.status === 'pending' && (
												<>
													<Button 
														size="sm" 
														variant="brand"
														onClick={() => handleStatusChange(task.id, 'accepted')}
													>
														수락
													</Button>
													<Button 
														size="sm" 
														variant="outline"
														onClick={() => handleStatusChange(task.id, 'rejected')}
													>
														거절
													</Button>
												</>
											)}
											{task.status === 'accepted' && (
												<Button 
													size="sm" 
													variant="brand"
													onClick={() => handleComplete(task.id)}
												>
													완료
												</Button>
											)}
											{(task.status === 'rejected' || task.status === 'completed') && (
												<Button 
													size="sm" 
													variant="outline"
													onClick={() => handleDelete(task.id)}
												>
													삭제
												</Button>
											)}
										</div>
									</div>
								</CardHeader>
							</Card>
						)
					})}
				</div>

				{/* Task Detail Modal */}
				{selectedTask && (
					<div 
						className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
						onClick={() => setSelectedTask(null)}
					>
						<div 
							className="bg-surface-dark border border-border-dark rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
							onClick={(e) => e.stopPropagation()}
						>
							{/* Modal Header */}
							<div className="flex items-start justify-between p-6 border-b border-border-dark">
								<div className="flex-1">
									<div className="flex items-center gap-3 mb-2">
										<ListTodo className="h-6 w-6 text-orange-400" />
										<h2 className="text-xl font-bold text-white">{selectedTask.title}</h2>
									</div>
									<div className="flex flex-wrap items-center gap-2 mt-3">
										{/* Priority Badge */}
										<span className={`px-3 py-1 rounded-lg text-xs font-medium border ${
											getPriorityBadge(selectedTask.priority).color
										}`}>
											{getPriorityBadge(selectedTask.priority).label}
										</span>
										
										{/* Status Badge */}
										<span className={`px-3 py-1 rounded-lg text-xs font-medium ${
											selectedTask.status === 'completed' ? 'bg-green-500/10 text-green-400' :
											selectedTask.status === 'accepted' ? 'bg-blue-500/10 text-blue-400' :
											selectedTask.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
											'bg-red-500/10 text-red-400'
										}`}>
											{selectedTask.status === 'completed' ? '완료' :
											 selectedTask.status === 'accepted' ? '진행 중' :
											 selectedTask.status === 'pending' ? '대기 중' : '거절됨'}
										</span>

										{/* AI Badge */}
										{selectedTask.source === 'ai' && (
											<span className="px-3 py-1 rounded-lg text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
												AI 추천
											</span>
										)}

										{/* Deadline */}
										{selectedTask.deadline && (
											<span className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium ${
												getDeadlineUrgency(selectedTask.deadline).color
											}`}>
												<Calendar className="h-3 w-3" />
												{getDeadlineUrgency(selectedTask.deadline).label}
											</span>
										)}
									</div>
								</div>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setSelectedTask(null)}
									className="text-neutral-400 hover:text-white"
								>
									<X className="h-5 w-5" />
								</Button>
							</div>

							{/* Modal Content */}
							<div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
								{/* Description */}
								<div className="mb-6">
									<h3 className="text-sm font-semibold text-neutral-300 mb-2">설명</h3>
									<p className="text-neutral-400 whitespace-pre-wrap">{selectedTask.description}</p>
								</div>

								{/* Task Info Grid */}
								<div className="grid grid-cols-2 gap-4 mb-6">
									{selectedTask.category && (
										<div>
											<h3 className="text-sm font-semibold text-neutral-300 mb-1">카테고리</h3>
											<p className="text-neutral-400">{selectedTask.category}</p>
										</div>
									)}
									{selectedTask.estimatedDuration && (
										<div>
											<h3 className="text-sm font-semibold text-neutral-300 mb-1">예상 소요 시간</h3>
											<p className="text-neutral-400">{selectedTask.estimatedDuration}분</p>
										</div>
									)}
									{selectedTask.assignedToName && (
										<div>
											<h3 className="text-sm font-semibold text-neutral-300 mb-1">담당자</h3>
											<p className="text-neutral-400">{selectedTask.assignedToName}</p>
										</div>
									)}
									{selectedTask.createdByName && (
										<div>
											<h3 className="text-sm font-semibold text-neutral-300 mb-1">생성자</h3>
											<p className="text-neutral-400">{selectedTask.createdByName}</p>
										</div>
									)}
								</div>

								{/* Project Info */}
								{selectedTask.projectName && (
									<div className="mb-6">
										<h3 className="text-sm font-semibold text-neutral-300 mb-2">프로젝트</h3>
										<div className="bg-background-dark rounded-lg p-3 border border-border-dark">
											<p className="text-white font-medium">{selectedTask.projectName}</p>
										</div>
									</div>
								)}

								{/* OKR/KPI Relations */}
								{(() => {
									const { objective, kpi, workEntriesCount } = getTaskRelations(selectedTask)
									return (objective || kpi || workEntriesCount > 0) && (
										<div className="mb-6">
											<h3 className="text-sm font-semibold text-neutral-300 mb-2">연결 정보</h3>
											<div className="space-y-2">
												{kpi && (
													<div className="flex items-center gap-2 text-sm text-neutral-400 bg-background-dark rounded-lg p-3 border border-border-dark">
														<Target className="h-4 w-4 text-orange-400" />
														<span className="font-medium">KPI:</span>
														<span>{kpi.name}</span>
													</div>
												)}
												{objective && (
													<div className="flex items-center gap-2 text-sm text-neutral-400 bg-background-dark rounded-lg p-3 border border-border-dark">
														<BarChart3 className="h-4 w-4 text-blue-400" />
														<span className="font-medium">OKR:</span>
														<span>{objective.title}</span>
													</div>
												)}
												{workEntriesCount > 0 && (
													<div className="flex items-center gap-2 text-sm text-neutral-400 bg-background-dark rounded-lg p-3 border border-border-dark">
														<FileText className="h-4 w-4 text-green-400" />
														<span className="font-medium">업무 기록:</span>
														<span>{workEntriesCount}개</span>
													</div>
												)}
											</div>
										</div>
									)
								})()}

								{/* AI Reason */}
								{selectedTask.aiReason && (
									<div className="mb-6">
										<h3 className="text-sm font-semibold text-neutral-300 mb-2 flex items-center gap-2">
											<Sparkles className="h-4 w-4 text-purple-400" />
											AI 추천 이유
										</h3>
										<div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
											<p className="text-neutral-400">{selectedTask.aiReason}</p>
										</div>
									</div>
								)}

								{/* Related Members */}
								{selectedTask.relatedMembers && selectedTask.relatedMembers.length > 0 && (
									<div className="mb-6">
										<h3 className="text-sm font-semibold text-neutral-300 mb-2">관련 멤버</h3>
										<div className="space-y-2">
											{selectedTask.relatedMembers.map((member, idx) => (
												<div 
													key={idx}
													className="flex items-center gap-3 bg-background-dark rounded-lg p-3 border border-border-dark"
												>
													<Users className="h-4 w-4 text-neutral-500" />
													<div className="flex-1">
														<p className="text-white text-sm font-medium">{member.name}</p>
														<p className="text-neutral-500 text-xs">
															{member.role} · {member.department}
														</p>
													</div>
												</div>
											))}
										</div>
									</div>
								)}

								{/* Tags */}
								{selectedTask.tags && selectedTask.tags.length > 0 && (
									<div className="mb-6">
										<h3 className="text-sm font-semibold text-neutral-300 mb-2">태그</h3>
										<div className="flex flex-wrap gap-2">
											{selectedTask.tags.map((tag, idx) => (
												<span 
													key={idx}
													className="px-3 py-1 bg-background-dark border border-border-dark rounded-lg text-xs text-neutral-400"
												>
													#{tag}
												</span>
											))}
										</div>
									</div>
								)}

								{/* Timestamps */}
								<div className="grid grid-cols-2 gap-4 pt-4 border-t border-border-dark">
									{selectedTask.createdAt && (
										<div>
											<h3 className="text-xs font-semibold text-neutral-500 mb-1">생성일</h3>
											<p className="text-sm text-neutral-400">
												{new Date(selectedTask.createdAt).toLocaleString('ko-KR')}
											</p>
										</div>
									)}
									{selectedTask.acceptedAt && (
										<div>
											<h3 className="text-xs font-semibold text-neutral-500 mb-1">수락일</h3>
											<p className="text-sm text-neutral-400">
												{new Date(selectedTask.acceptedAt).toLocaleString('ko-KR')}
											</p>
										</div>
									)}
									{selectedTask.completedAt && (
										<div>
											<h3 className="text-xs font-semibold text-neutral-500 mb-1">완료일</h3>
											<p className="text-sm text-neutral-400">
												{new Date(selectedTask.completedAt).toLocaleString('ko-KR')}
											</p>
										</div>
									)}
								</div>
							</div>

							{/* Modal Footer Actions */}
							<div className="flex items-center justify-end gap-3 p-6 border-t border-border-dark bg-background-dark/50">
								<Button
									variant="outline"
									onClick={() => setSelectedTask(null)}
								>
									닫기
								</Button>
								{selectedTask.status === 'pending' && (
									<>
										<Button 
											variant="outline"
											onClick={() => {
												handleStatusChange(selectedTask.id, 'rejected')
												setSelectedTask(null)
											}}
										>
											거절
										</Button>
										<Button 
											variant="brand"
											onClick={() => {
												handleStatusChange(selectedTask.id, 'accepted')
												setSelectedTask(null)
											}}
										>
											수락
										</Button>
									</>
								)}
								{selectedTask.status === 'accepted' && (
									<Button 
										variant="brand"
										onClick={() => {
											handleComplete(selectedTask.id)
											setSelectedTask(null)
										}}
									>
										<CheckCircle2 className="h-4 w-4 mr-2" />
										완료
									</Button>
								)}
								{(selectedTask.status === 'rejected' || selectedTask.status === 'completed') && (
									<Button 
										variant="outline"
										onClick={() => {
											handleDelete(selectedTask.id)
											setSelectedTask(null)
										}}
									>
										삭제
									</Button>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
