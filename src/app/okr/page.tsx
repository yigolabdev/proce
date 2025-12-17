/**
 * OKR Page
 * 
 * 리팩토링 완료:
 * - 1,430줄 → ~200줄 (86% 감소)
 * - useOKR 훅으로 모든 로직 분리
 * - 재사용 가능한 컴포넌트로 UI 구성
 * - AI 추천 기능 추가
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { PageHeader } from '../../components/common/PageHeader'
import { Button } from '../../components/ui/Button'
import { Tabs } from '../../components/ui/Tabs'
import { Plus, Target, BarChart3, Sparkles, RefreshCw, CheckCircle2, X, TrendingUp, FolderKanban, Filter } from 'lucide-react'
import { toast } from 'sonner'
import { storage } from '../../utils/storage'

// Custom Hook
import { useOKR } from '../../hooks/useOKR'

// Components
import { OKRList } from '../../components/okr/OKRList'
import { OKRForm } from '../../components/okr/OKRForm'
import { OKRProgress } from '../../components/okr/OKRProgress'
import { KeyResultItem } from '../../components/okr/KeyResultItem'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'

// Types
import type { Objective, ObjectiveFormData } from '../../types/okr.types'
import type { Project, WorkEntry } from '../../types/common.types'

// AI Service
import { 
	okrRecommendationService, 
	type OKRRecommendation,
	type OKRInsight,
	type OKRAnalysisResult
} from '../../services/ai/okrRecommendation.service'

export default function OKRPage() {
	// OKR Hook
	const okr = useOKR()

	// UI State
	const [activeTab, setActiveTab] = useState<'list' | 'analytics' | 'ai'>('list')
	const [showObjectiveForm, setShowObjectiveForm] = useState(false)
	const [editingObjective, setEditingObjective] = useState<Objective | undefined>()
	const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>('all')

	// AI Recommendations State
	const [recommendations, setRecommendations] = useState<OKRRecommendation[]>([])
	const [insights, setInsights] = useState<OKRInsight[]>([])
	const [summary, setSummary] = useState<OKRAnalysisResult['summary'] | null>(null)
	const [isGeneratingAI, setIsGeneratingAI] = useState(false)
	const [lastAIUpdate, setLastAIUpdate] = useState<Date | null>(null)

	// Mock data (replace with real data)
	const users = [
		{ id: 'user1', name: 'John Doe', department: 'Engineering' },
		{ id: 'user2', name: 'Jane Smith', department: 'Product' },
		{ id: 'user3', name: 'Alice Johnson', department: 'Design' },
	]
	
	// Current user (mock - replace with real user context)
	const currentUser = {
		id: 'user1',
		name: 'John Doe',
		department: 'Engineering'
	}

	// Load projects for filtering
	const projects = useMemo(() => {
		return storage.get<Project[]>('projects', []) || []
	}, [])

	// Filter objectives by project
	const filteredObjectives = useMemo(() => {
		if (selectedProjectFilter === 'all') {
			return okr.objectives
		}
		if (selectedProjectFilter === 'none') {
			return okr.objectives.filter(obj => !obj.projectId)
		}
		return okr.objectives.filter(obj => obj.projectId === selectedProjectFilter)
	}, [okr.objectives, selectedProjectFilter])

	// Load AI recommendations from localStorage
	useEffect(() => {
		const saved = storage.get<{
			recommendations: OKRRecommendation[]
			insights: OKRInsight[]
			summary: OKRAnalysisResult['summary']
			lastUpdate: string
		}>('okr_ai_recommendations')

		if (saved) {
			setRecommendations(saved.recommendations)
			setInsights(saved.insights)
			setSummary(saved.summary)
			setLastAIUpdate(new Date(saved.lastUpdate))
		}
	}, [])

	// Generate AI Recommendations
	const handleGenerateAI = useCallback(async () => {
		setIsGeneratingAI(true)
		try {
			// Load data
			const projects = storage.get<Project[]>('projects', [])
			const workEntries = storage.get<WorkEntry[]>('workEntries', [])

			// Generate recommendations
			const result = await okrRecommendationService.generateRecommendations(
				okr.objectives,
				projects || [],
				workEntries,
				currentUser
			)

			// Update state
			setRecommendations(result.recommendations)
			setInsights(result.insights)
			setSummary(result.summary)
			setLastAIUpdate(new Date())

			// Save to localStorage
			storage.set('okr_ai_recommendations', {
				recommendations: result.recommendations,
				insights: result.insights,
				summary: result.summary,
				lastUpdate: new Date().toISOString(),
			})

			toast.success(`Generated ${result.recommendations.length} AI recommendations`)
		} catch (error) {
			console.error('Failed to generate AI recommendations:', error)
			toast.error('Failed to generate AI recommendations')
		} finally {
			setIsGeneratingAI(false)
		}
	}, [okr.objectives, currentUser])

	// Accept AI Recommendation
	const handleAcceptRecommendation = useCallback(async (rec: OKRRecommendation) => {
		try {
			if (rec.type === 'objective') {
				// Create new objective from recommendation
				const newObjective: ObjectiveFormData = {
					title: rec.title,
					description: rec.description,
					period: rec.suggestedPeriod || '',
					periodType: 'quarter',
					owner: currentUser.name,
					ownerId: currentUser.id,
					department: currentUser.department,
					startDate: new Date().toISOString().split('T')[0],
					endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
				}
				
				await okr.createObjective(newObjective)
				toast.success('Objective created from AI recommendation')
			} else if (rec.type === 'key_result' && rec.parentObjectiveId) {
				// Add key result to existing objective
				const objective = okr.objectives.find(o => o.id === rec.parentObjectiveId)
				if (objective) {
					const newKR = {
						id: `kr-${Date.now()}`,
						description: rec.title,
						target: rec.suggestedTarget || 100,
						current: 0,
						unit: rec.suggestedUnit || '%',
						progress: 0,
						owner: objective.owner,
						ownerId: objective.ownerId,
					}
					
					await okr.addKeyResult(rec.parentObjectiveId, newKR as any)
					toast.success('Key Result added from AI recommendation')
				}
			}

			// Mark as accepted
			const updatedRecs = recommendations.map(r => 
				r.id === rec.id ? { ...r, status: 'accepted' as const } : r
			)
			setRecommendations(updatedRecs)

			// Save
			storage.set('okr_ai_recommendations', {
				recommendations: updatedRecs,
				insights,
				summary,
				lastUpdate: lastAIUpdate?.toISOString() || new Date().toISOString(),
			})
		} catch (error) {
			console.error('Failed to accept recommendation:', error)
			toast.error('Failed to accept recommendation')
		}
	}, [recommendations, insights, summary, lastAIUpdate, okr, currentUser])

	// Reject AI Recommendation
	const handleRejectRecommendation = useCallback((recId: string) => {
		const updatedRecs = recommendations.map(r => 
			r.id === recId ? { ...r, status: 'rejected' as const } : r
		)
		setRecommendations(updatedRecs)

		storage.set('okr_ai_recommendations', {
			recommendations: updatedRecs,
			insights,
			summary,
			lastUpdate: lastAIUpdate?.toISOString() || new Date().toISOString(),
		})

		toast.success('Recommendation rejected')
	}, [recommendations, insights, summary, lastAIUpdate])

	// Handlers
	const handleCreateObjective = () => {
		setEditingObjective(undefined)
		setShowObjectiveForm(true)
	}

	const handleEditObjective = (objective: Objective) => {
		setEditingObjective(objective)
		setShowObjectiveForm(true)
	}

	const handleSubmitObjective = async (data: ObjectiveFormData) => {
		try {
			if (editingObjective) {
				await okr.updateObjective(editingObjective.id, data as Partial<Objective>)
				toast.success('Objective updated successfully')
			} else {
				await okr.createObjective(data)
				toast.success('Objective created successfully')
			}
			setShowObjectiveForm(false)
			setEditingObjective(undefined)
		} catch {
			toast.error('Failed to save objective')
		}
	}

	const handleDeleteObjective = async (id: string, shiftKey: boolean = false) => {
		// 연결된 Tasks 확인
		const tasks = storage.get<any[]>('ai_recommendations') || []
		const linkedTasks = tasks.filter(t => t.objectiveId === id)
		
		if (linkedTasks.length > 0 && !shiftKey) {
			// 연결된 Task가 있으면 옵션 제공
			const message = `이 OKR과 연결된 ${linkedTasks.length}개의 Task가 있습니다.\n\n` +
				`"확인"을 누르면 연결만 해제됩니다.\n` +
				`"취소" 후 [Shift+클릭]으로 삭제하면 Task도 함께 삭제됩니다.`
			
			if (window.confirm(message)) {
				await (okr.deleteObjective as any)(id, false)
			}
		} else if (shiftKey && linkedTasks.length > 0) {
			// Shift+클릭으로 연쇄 삭제
			const message = `⚠️ 연쇄 삭제:\n` +
				`- OKR\n` +
				`- ${linkedTasks.length}개의 Task\n\n` +
				`모두 영구적으로 삭제됩니다. 계속하시겠습니까?`
			
			if (window.confirm(message)) {
				await (okr.deleteObjective as any)(id, true)
			}
		} else {
			// 연결된 Task가 없으면 바로 삭제
			if (window.confirm('이 Objective를 삭제하시겠습니까?')) {
				await (okr.deleteObjective as any)(id, false)
			}
		}
	}

	const handleUpdateKeyResultProgress = async (keyResultId: string, current: number) => {
		if (!okr.selectedObjective) return

		try {
			await okr.updateKeyResult(okr.selectedObjective.id, keyResultId, { current })
		} catch {
			toast.error('Failed to update progress')
		}
	}

	return (
		<div className="min-h-screen bg-background-dark">
			<div className="max-w-[1600px] mx-auto px-6 py-6 space-y-8">
				{/* Page Header */}
			<PageHeader
				title="OKR Management"
				description="Set and track your objectives and key results"
				actions={
						<Button onClick={handleCreateObjective} variant="brand">
							<Plus className="h-4 w-4 mr-2" />
							New Objective
						</Button>
					}
				/>

				{/* Tabs */}
				<Tabs
					items={[
						{ id: 'list', label: 'Objectives', icon: Target },
						{ id: 'analytics', label: 'Analytics', icon: BarChart3 },
						{ id: 'ai', label: 'AI Recommendations', icon: Sparkles },
					]}
					activeTab={activeTab}
					onTabChange={(id) => setActiveTab(id as 'list' | 'analytics' | 'ai')}
					variant="underline"
				/>

				{/* Project Filter */}
				{activeTab === 'list' && (
					<Card className="bg-surface-dark border-border-dark">
						<CardContent className="py-4">
							<div className="flex items-center gap-4">
								<div className="flex items-center gap-2 text-sm text-neutral-400">
									<Filter className="h-4 w-4" />
									<span className="font-medium">Filter by Project:</span>
								</div>
								<select
									value={selectedProjectFilter}
									onChange={(e) => setSelectedProjectFilter(e.target.value)}
									className="px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
								>
									<option value="all">All OKRs</option>
									<option value="none">Individual OKRs (No Project)</option>
									{projects.map(project => (
										<option key={project.id} value={project.id}>
											📁 {project.name}
										</option>
									))}
								</select>
								{selectedProjectFilter !== 'all' && (
									<Button
										onClick={() => setSelectedProjectFilter('all')}
										variant="ghost"
										size="sm"
										className="text-neutral-400 hover:text-white"
									>
										<X className="h-4 w-4 mr-1" />
										Clear
									</Button>
								)}
								<div className="ml-auto text-sm text-neutral-500">
									Showing {filteredObjectives.length} of {okr.objectives.length} OKRs
								</div>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Content */}
				{activeTab === 'list' && (
					<div className="space-y-6">
						{/* Objective Form */}
						{showObjectiveForm && (
							<OKRForm
								objective={editingObjective}
								onSubmit={handleSubmitObjective}
								onCancel={() => {
									setShowObjectiveForm(false)
									setEditingObjective(undefined)
								}}
								users={users}
								currentUser={currentUser}
								isSubmitting={okr.isLoading}
							/>
						)}

						{/* Selected Objective Detail */}
						{okr.selectedObjective && !showObjectiveForm && (
							<Card className="bg-surface-dark border-border-dark">
								<CardHeader>
									<div className="flex items-center justify-between">
										<CardTitle className="flex items-center gap-2">
											<Target className="h-5 w-5 text-orange-400" />
											{okr.selectedObjective.title}
										</CardTitle>
										<Button
											onClick={() => okr.selectObjective(null)}
											variant="ghost"
											size="sm"
										>
											Close
										</Button>
									</div>
								</CardHeader>
								<CardContent className="space-y-4">
									<p className="text-neutral-300">{okr.selectedObjective.description}</p>

									{/* Key Results */}
									<div className="space-y-3">
									<div className="flex items-center justify-between">
										<h3 className="font-medium text-white">Key Results</h3>
									</div>

									{okr.selectedObjective.keyResults.map((kr) => (
										<KeyResultItem
											key={kr.id}
											keyResult={kr}
											onEdit={() => toast.info('Edit feature coming soon')}
											onDelete={(id) =>
												okr.deleteKeyResult(okr.selectedObjective!.id, id)
											}
											onUpdateProgress={handleUpdateKeyResultProgress}
											disabled={okr.isLoading}
										/>
									))}

										{okr.selectedObjective.keyResults.length === 0 && (
											<div className="text-center py-8 text-neutral-500">
												No key results yet. Add your first key result to track progress.
											</div>
										)}
									</div>
								</CardContent>
							</Card>
						)}

						{/* OKR List */}
						{!okr.selectedObjective && !showObjectiveForm && (
							<OKRList
								objectives={filteredObjectives}
								onSelect={okr.selectObjective}
								onEdit={handleEditObjective}
								onDelete={(id, e) => handleDeleteObjective(id, e?.shiftKey || false)}
							/>
						)}
					</div>
				)}

				{activeTab === 'analytics' && (
					<OKRProgress stats={okr.stats} />
				)}

				{/* AI Recommendations Tab */}
				{activeTab === 'ai' && (
					<div className="space-y-6">
						{/* Header */}
						<Card className="bg-surface-dark border-border-dark">
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle className="flex items-center gap-2">
											<Sparkles className="h-5 w-5 text-orange-400" />
											AI-Powered OKR Recommendations
										</CardTitle>
										<p className="text-sm text-neutral-400 mt-1">
											Get personalized suggestions based on your projects, work patterns, and existing OKRs
										</p>
									</div>
									<Button
										onClick={handleGenerateAI}
										disabled={isGeneratingAI}
										variant="brand"
									>
										<RefreshCw className={`h-4 w-4 mr-2 ${isGeneratingAI ? 'animate-spin' : ''}`} />
										{isGeneratingAI ? 'Analyzing...' : 'Generate Recommendations'}
									</Button>
								</div>
							</CardHeader>
							
							{lastAIUpdate && (
								<CardContent className="pt-0">
									<p className="text-xs text-neutral-500">
										Last updated: {lastAIUpdate.toLocaleString()}
									</p>
								</CardContent>
							)}
						</Card>

						{/* Summary */}
						{summary && (
							<Card className="bg-surface-dark border-border-dark">
								<CardHeader>
									<CardTitle className="text-base">Summary</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
										<div className="text-center p-4 bg-background-dark rounded-lg">
											<div className="text-2xl font-bold text-orange-400">{summary.totalRecommendations}</div>
											<div className="text-xs text-neutral-400 mt-1">Total Recommendations</div>
										</div>
										<div className="text-center p-4 bg-background-dark rounded-lg">
											<div className="text-2xl font-bold text-blue-400">{summary.objectiveCount}</div>
											<div className="text-xs text-neutral-400 mt-1">Objectives</div>
										</div>
										<div className="text-center p-4 bg-background-dark rounded-lg">
											<div className="text-2xl font-bold text-green-400">{summary.keyResultCount}</div>
											<div className="text-xs text-neutral-400 mt-1">Key Results</div>
										</div>
										<div className="text-center p-4 bg-background-dark rounded-lg">
											<div className="text-2xl font-bold text-red-400">{summary.highPriority}</div>
											<div className="text-xs text-neutral-400 mt-1">High Priority</div>
										</div>
									</div>
								</CardContent>
							</Card>
						)}

						{/* Insights */}
						{insights.length > 0 && (
							<Card className="bg-surface-dark border-border-dark">
								<CardHeader>
									<CardTitle className="text-base">Insights</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									{insights.map((insight, index) => (
										<div
											key={index}
											className={`p-4 rounded-lg border ${
												insight.severity === 'high'
													? 'bg-red-500/10 border-red-500/30'
													: insight.severity === 'medium'
													? 'bg-orange-500/10 border-orange-500/30'
													: 'bg-blue-500/10 border-blue-500/30'
											}`}
										>
											<div className="flex items-start gap-3">
												<TrendingUp className={`h-5 w-5 mt-0.5 ${
													insight.severity === 'high'
														? 'text-red-400'
														: insight.severity === 'medium'
														? 'text-orange-400'
														: 'text-blue-400'
												}`} />
												<div className="flex-1">
													<h4 className="font-medium text-white">{insight.title}</h4>
													<p className="text-sm text-neutral-300 mt-1">{insight.description}</p>
												</div>
											</div>
										</div>
									))}
								</CardContent>
							</Card>
						)}

						{/* Recommendations */}
						{recommendations.length > 0 ? (
							<div className="space-y-4">
								<h3 className="text-lg font-semibold text-white">Recommendations</h3>
								
								{recommendations.filter(r => r.status === 'pending').map((rec) => (
									<Card key={rec.id} className="bg-surface-dark border-border-dark">
										<CardHeader>
											<div className="flex items-start justify-between gap-4">
												<div className="flex-1">
													<div className="flex items-center gap-2 mb-2">
														<span className={`px-2 py-0.5 text-xs font-medium rounded ${
															rec.type === 'objective'
																? 'bg-orange-500/20 text-orange-400'
																: 'bg-blue-500/20 text-blue-400'
														}`}>
															{rec.type === 'objective' ? 'Objective' : 'Key Result'}
														</span>
														<span className={`px-2 py-0.5 text-xs font-medium rounded ${
															rec.priority === 'high'
																? 'bg-red-500/20 text-red-400'
																: rec.priority === 'medium'
																? 'bg-yellow-500/20 text-yellow-400'
																: 'bg-green-500/20 text-green-400'
														}`}>
															{rec.priority}
														</span>
														<span className="px-2 py-0.5 text-xs font-medium rounded bg-neutral-500/20 text-neutral-400">
															{Math.round(rec.confidence * 100)}% confidence
														</span>
													</div>
													<CardTitle className="text-base text-white">{rec.title}</CardTitle>
													<p className="text-sm text-neutral-300 mt-2">{rec.description}</p>
													
													{rec.reasoning.length > 0 && (
														<div className="mt-3 space-y-1">
															<p className="text-xs font-medium text-neutral-400">Reasoning:</p>
															{rec.reasoning.map((reason, idx) => (
																<p key={idx} className="text-xs text-neutral-400 pl-3">
																	• {reason}
																</p>
															))}
														</div>
													)}

													{rec.suggestedTarget && (
														<div className="mt-3 text-sm text-neutral-400">
															Target: <span className="text-white font-medium">{rec.suggestedTarget}{rec.suggestedUnit}</span>
														</div>
													)}
												</div>
												
												<div className="flex flex-col gap-2">
													<Button
														size="sm"
														variant="brand"
														onClick={() => handleAcceptRecommendation(rec)}
													>
														<CheckCircle2 className="h-4 w-4 mr-1" />
														Accept
													</Button>
													<Button
														size="sm"
														variant="outline"
														onClick={() => handleRejectRecommendation(rec.id)}
													>
														<X className="h-4 w-4 mr-1" />
														Reject
													</Button>
												</div>
											</div>
										</CardHeader>
									</Card>
								))}

								{recommendations.filter(r => r.status === 'pending').length === 0 && (
									<Card className="bg-surface-dark border-border-dark">
										<CardContent className="py-12 text-center">
											<CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-4" />
											<p className="text-neutral-400">All recommendations have been reviewed</p>
											<Button
												onClick={handleGenerateAI}
												variant="outline"
												className="mt-4"
											>
												<RefreshCw className="h-4 w-4 mr-2" />
												Generate New Recommendations
											</Button>
										</CardContent>
									</Card>
								)}
							</div>
						) : (
							<Card className="bg-surface-dark border-border-dark">
								<CardContent className="py-12 text-center">
									<Sparkles className="h-12 w-12 text-orange-400 mx-auto mb-4" />
									<p className="text-neutral-400 mb-4">No recommendations yet</p>
									<Button onClick={handleGenerateAI} variant="brand">
										<Sparkles className="h-4 w-4 mr-2" />
										Generate AI Recommendations
									</Button>
								</CardContent>
							</Card>
						)}
					</div>
				)}
			</div>
		</div>
	)
}
