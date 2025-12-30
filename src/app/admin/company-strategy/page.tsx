/**
 * Company Strategy Page
 * 기업 전략 관리 및 KPI 자동 생성
 */

import { useState, useCallback, useEffect } from 'react'
import { useI18n } from '../../../i18n/I18nProvider'
import { PageHeader } from '../../../components/common/PageHeader'
import { Button } from '../../../components/ui/Button'
import { Card, CardContent, CardHeader } from '../../../components/ui/Card'
import { Target, TrendingUp, Users, Sparkles, AlertCircle, CheckCircle2, Plus, Edit2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { storage } from '../../../utils/storage'
import type { CompanyStrategy, StrategicPriority, StrategyToKPIRecommendation, StrategyAnalysisResult } from '../../../types/strategy.types'
import type { KPI } from '../../../types/kpi.types'
import { strategyAnalyzerService } from '../../../services/strategy/strategyAnalyzer.service'

export default function CompanyStrategyPage() {
	const { t } = useI18n()
	
	// State
	const [strategy, setStrategy] = useState<CompanyStrategy | null>(null)
	const [isEditing, setIsEditing] = useState(false)
	const [isGenerating, setIsGenerating] = useState(false)
	const [kpiRecommendations, setKpiRecommendations] = useState<StrategyToKPIRecommendation | null>(null)
	const [analysis, setAnalysis] = useState<StrategyAnalysisResult | null>(null)
	
	// Form state
	const [vision, setVision] = useState('')
	const [mission, setMission] = useState('')
	const [coreValues, setCoreValues] = useState<string[]>([])
	const [newValue, setNewValue] = useState('')

	// Load strategy
	useEffect(() => {
		loadStrategy()
	}, [])

	const loadStrategy = () => {
		const saved = storage.get<CompanyStrategy>('company_strategy')
		if (saved) {
			setStrategy(saved)
			setVision(saved.vision)
			setMission(saved.mission)
			setCoreValues(saved.coreValues || [])
		}
	}

	// Generate KPIs from strategy
	const handleGenerateKPIs = useCallback(async () => {
		if (!strategy) {
			toast.error('전략을 먼저 저장해주세요')
			return
		}

		setIsGenerating(true)
		try {
			const recommendations = await strategyAnalyzerService.generateKPIsFromStrategy(strategy)
			setKpiRecommendations(recommendations)
			
			toast.success(`${recommendations.suggestedKPIs.length}개의 KPI가 추천되었습니다`)
		} catch (error) {
			console.error('Failed to generate KPIs:', error)
			toast.error('KPI 생성에 실패했습니다')
		} finally {
			setIsGenerating(false)
		}
	}, [strategy])

	// Analyze strategy
	const handleAnalyze = useCallback(async () => {
		if (!strategy) return

		try {
			const result = await strategyAnalyzerService.analyzeStrategy(strategy)
			setAnalysis(result)
			toast.success('전략 분석이 완료되었습니다')
		} catch (error) {
			console.error('Failed to analyze strategy:', error)
			toast.error('전략 분석에 실패했습니다')
		}
	}, [strategy])

	// Save strategy
	const handleSave = () => {
		if (!vision || !mission) {
			toast.error('비전과 미션을 입력해주세요')
			return
		}

		const newStrategy: CompanyStrategy = {
			id: strategy?.id || `strategy-${Date.now()}`,
			vision,
			mission,
			coreValues,
			strategicPriorities: strategy?.strategicPriorities || [],
			marketPosition: strategy?.marketPosition || {
				targetMarket: '',
				competitiveAdvantage: [],
				threats: [],
				opportunities: [],
			},
			annualGoals: strategy?.annualGoals || [],
			createdAt: strategy?.createdAt || new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			createdBy: 'current-user',
		}

		storage.set('company_strategy', newStrategy)
		setStrategy(newStrategy)
		setIsEditing(false)
		toast.success('전략이 저장되었습니다')
	}

	// Accept KPI
	const handleAcceptKPI = (kpiId: string) => {
		if (!kpiRecommendations) return

		const suggestedKPI = kpiRecommendations.suggestedKPIs.find(k => k.id === kpiId)
		if (!suggestedKPI) return

		// Convert to KPI and save
		const newKPI: KPI = {
			id: `kpi-${Date.now()}`,
			name: suggestedKPI.name,
			description: suggestedKPI.description,
			category: suggestedKPI.category,
			metric: {
				current: 0,
				target: suggestedKPI.suggestedTarget,
				unit: suggestedKPI.suggestedUnit,
				format: 'number',
			},
			period: suggestedKPI.suggestedPeriod,
			startDate: new Date().toISOString(),
			endDate: new Date(new Date().setMonth(new Date().getMonth() + (suggestedKPI.suggestedPeriod === 'quarter' ? 3 : 12))).toISOString(),
			owner: 'CEO',
			ownerId: 'user-1',
			department: suggestedKPI.suggestedDepartments[0] || '전략기획',
			departmentId: 'dept-1',
			priority: 'high',
			progress: 0,
			status: 'on-track',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			createdBy: 'current-user',
		}

		const kpis = storage.get<KPI[]>('kpis', [])
		storage.set('kpis', [...kpis, newKPI])

		toast.success(`KPI "${suggestedKPI.name}"가 생성되었습니다`)

		// Update recommendations
		const updated = {
			...kpiRecommendations,
			suggestedKPIs: kpiRecommendations.suggestedKPIs.map(k =>
				k.id === kpiId ? { ...k, status: 'accepted' as const } : k
			),
		}
		setKpiRecommendations(updated)
	}

	// Add core value
	const handleAddValue = () => {
		if (!newValue.trim()) return
		setCoreValues([...coreValues, newValue.trim()])
		setNewValue('')
	}

	// Remove core value
	const handleRemoveValue = (index: number) => {
		setCoreValues(coreValues.filter((_, i) => i !== index))
	}

	return (
		<div className="min-h-screen bg-neutral-950 p-6">
			<PageHeader
				title="기업 전략 관리"
				description="비전, 미션, 전략적 우선순위를 관리하고 KPI를 자동 생성합니다"
				icon={Target}
				actions={
					<div className="flex items-center gap-3">
						{strategy && !isEditing && (
							<>
								<Button
									variant="outline"
									size="sm"
									onClick={handleAnalyze}
								>
									<AlertCircle className="h-4 w-4 mr-2" />
									전략 분석
								</Button>
								<Button
									variant="brand"
									size="sm"
									onClick={handleGenerateKPIs}
									disabled={isGenerating}
								>
									<Sparkles className="h-4 w-4 mr-2" />
									{isGenerating ? 'KPI 생성 중...' : 'KPI 자동 생성'}
								</Button>
							</>
						)}
						<Button
							variant={isEditing ? 'brand' : 'outline'}
							size="sm"
							onClick={() => {
								if (isEditing) {
									handleSave()
								} else {
									setIsEditing(true)
								}
							}}
						>
							{isEditing ? '저장' : '편집'}
						</Button>
					</div>
				}
			/>

			<div className="mt-6 space-y-6">
				{/* Vision & Mission */}
				<Card>
					<CardHeader>
						<h2 className="text-lg font-semibold text-neutral-100">비전과 미션</h2>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-neutral-300 mb-2">
								비전 (Vision)
							</label>
							{isEditing ? (
								<textarea
									className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-neutral-100 focus:border-primary focus:ring-1 focus:ring-primary"
									rows={3}
									value={vision}
									onChange={(e) => setVision(e.target.value)}
									placeholder="우리 회사가 달성하고자 하는 장기적인 목표를 입력하세요..."
								/>
							) : (
								<p className="text-neutral-300">
									{strategy?.vision || '비전이 설정되지 않았습니다.'}
								</p>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium text-neutral-300 mb-2">
								미션 (Mission)
							</label>
							{isEditing ? (
								<textarea
									className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-neutral-100 focus:border-primary focus:ring-1 focus:ring-primary"
									rows={3}
									value={mission}
									onChange={(e) => setMission(e.target.value)}
									placeholder="우리 회사의 존재 이유와 목적을 입력하세요..."
								/>
							) : (
								<p className="text-neutral-300">
									{strategy?.mission || '미션이 설정되지 않았습니다.'}
								</p>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium text-neutral-300 mb-2">
								핵심 가치 (Core Values)
							</label>
							{isEditing ? (
								<div className="space-y-2">
									{coreValues.map((value, index) => (
										<div key={index} className="flex items-center gap-2">
											<span className="flex-1 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-neutral-100">
												{value}
											</span>
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleRemoveValue(index)}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									))}
									<div className="flex items-center gap-2">
										<input
											type="text"
											className="flex-1 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-neutral-100 focus:border-primary focus:ring-1 focus:ring-primary"
											value={newValue}
											onChange={(e) => setNewValue(e.target.value)}
											onKeyPress={(e) => e.key === 'Enter' && handleAddValue()}
											placeholder="새로운 핵심 가치 입력..."
										/>
										<Button
											variant="outline"
											size="sm"
											onClick={handleAddValue}
										>
											<Plus className="h-4 w-4" />
										</Button>
									</div>
								</div>
							) : (
								<div className="flex flex-wrap gap-2">
									{strategy?.coreValues?.map((value, index) => (
										<span
											key={index}
											className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
										>
											{value}
										</span>
									)) || <p className="text-neutral-500">핵심 가치가 설정되지 않았습니다.</p>}
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Analysis Results */}
				{analysis && (
					<Card>
						<CardHeader>
							<h2 className="text-lg font-semibold text-neutral-100">전략 분석 결과</h2>
						</CardHeader>
						<CardContent className="space-y-4">
							{/* Health Score */}
							<div>
								<div className="flex items-center justify-between mb-2">
									<span className="text-sm font-medium text-neutral-300">전략 건강도</span>
									<span className="text-2xl font-bold text-primary">{analysis.healthScore}점</span>
								</div>
								<div className="w-full bg-neutral-800 rounded-full h-2">
									<div
										className="bg-primary rounded-full h-2 transition-all"
										style={{ width: `${analysis.healthScore}%` }}
									/>
								</div>
							</div>

							{/* Strengths */}
							{analysis.strengths.length > 0 && (
								<div>
									<h3 className="text-sm font-medium text-neutral-300 mb-2">강점</h3>
									<div className="space-y-2">
										{analysis.strengths.map((strength, index) => (
											<div key={index} className="flex items-start gap-2">
												<CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
												<span className="text-sm text-neutral-400">{strength}</span>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Weaknesses */}
							{analysis.weaknesses.length > 0 && (
								<div>
									<h3 className="text-sm font-medium text-neutral-300 mb-2">개선 필요 사항</h3>
									<div className="space-y-2">
										{analysis.weaknesses.map((weakness, index) => (
											<div key={index} className="flex items-start gap-2">
												<AlertCircle className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
												<span className="text-sm text-neutral-400">{weakness}</span>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Recommendations */}
							{analysis.recommendations.length > 0 && (
								<div>
									<h3 className="text-sm font-medium text-neutral-300 mb-2">권장사항</h3>
									<div className="space-y-3">
										{analysis.recommendations.map((rec, index) => (
											<div
												key={index}
												className="p-3 bg-neutral-900 border border-neutral-700 rounded-lg"
											>
												<div className="flex items-center justify-between mb-1">
													<span className="text-sm font-medium text-neutral-200">{rec.title}</span>
													<span className={`text-xs px-2 py-1 rounded-full ${
														rec.priority === 'high' ? 'bg-red-500/10 text-red-400' :
														rec.priority === 'medium' ? 'bg-orange-500/10 text-orange-400' :
														'bg-blue-500/10 text-blue-400'
													}`}>
														{rec.priority === 'high' ? '높음' : rec.priority === 'medium' ? '중간' : '낮음'}
													</span>
												</div>
												<p className="text-sm text-neutral-400 mb-2">{rec.description}</p>
												<p className="text-xs text-neutral-500">예상 효과: {rec.estimatedImpact}</p>
											</div>
										))}
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				)}

				{/* KPI Recommendations */}
				{kpiRecommendations && (
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<h2 className="text-lg font-semibold text-neutral-100">
									AI 추천 KPI ({kpiRecommendations.suggestedKPIs.length}개)
								</h2>
								<span className="text-sm text-neutral-400">
									신뢰도: {Math.round(kpiRecommendations.confidence * 100)}%
								</span>
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{kpiRecommendations.suggestedKPIs.map((kpi) => (
									<div
										key={kpi.id}
										className="p-4 bg-neutral-900 border border-neutral-700 rounded-lg"
									>
										<div className="flex items-start justify-between mb-2">
											<div className="flex-1">
												<h3 className="text-sm font-semibold text-neutral-100 mb-1">
													{kpi.name}
												</h3>
												<p className="text-sm text-neutral-400 mb-2">{kpi.description}</p>
												<div className="flex items-center gap-4 text-xs text-neutral-500">
													<span>목표: {kpi.suggestedTarget} {kpi.suggestedUnit}</span>
													<span>기간: {kpi.suggestedPeriod === 'quarter' ? '분기' : '연간'}</span>
													<span>정렬도: {Math.round(kpi.alignmentScore * 100)}%</span>
												</div>
												<div className="mt-2 flex flex-wrap gap-1">
													{kpi.suggestedDepartments.map((dept, idx) => (
														<span
															key={idx}
															className="px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded text-xs"
														>
															{dept}
														</span>
													))}
												</div>
											</div>
											<Button
												variant={kpi.status === 'accepted' ? 'outline' : 'brand'}
												size="sm"
												onClick={() => handleAcceptKPI(kpi.id)}
												disabled={kpi.status === 'accepted'}
											>
												{kpi.status === 'accepted' ? '생성됨' : 'KPI 생성'}
											</Button>
										</div>
										<div className="mt-3 pt-3 border-t border-neutral-700">
											<p className="text-xs text-neutral-400">
												<span className="font-medium text-neutral-300">추천 이유:</span> {kpi.reasoning}
											</p>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				)}

				{/* Empty State */}
				{!strategy && !isEditing && (
					<Card>
						<CardContent className="py-12 text-center">
							<Target className="h-12 w-12 text-neutral-600 mx-auto mb-4" />
							<h3 className="text-lg font-semibold text-neutral-300 mb-2">
								전략을 설정하세요
							</h3>
							<p className="text-neutral-500 mb-6">
								회사의 비전과 미션을 설정하고 AI가 전략에 맞는 KPI를 추천합니다
							</p>
							<Button variant="brand" onClick={() => setIsEditing(true)}>
								<Plus className="h-4 w-4 mr-2" />
								전략 설정 시작
							</Button>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	)
}

