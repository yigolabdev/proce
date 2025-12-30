/**
 * Insights Page
 * 주간/월간/분기 인사이트 자동 생성 대시보드
 */

import { useState, useCallback, useEffect } from 'react'
import { useI18n } from '../../i18n/I18nProvider'
import { PageHeader } from '../../components/common/PageHeader'
import { Button } from '../../components/ui/Button'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import { Lightbulb, TrendingUp, AlertTriangle, Target, Sparkles, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import { insightGeneratorService, type InsightCollection, type Insight } from '../../services/insights/insightGenerator.service'

type PeriodTab = 'weekly' | 'monthly' | 'quarterly'

export default function InsightsPage() {
	const { t } = useI18n()
	
	const [activePeriod, setActivePeriod] = useState<PeriodTab>('weekly')
	const [insights, setInsights] = useState<InsightCollection | null>(null)
	const [isGenerating, setIsGenerating] = useState(false)

	// Load insights on mount and period change
	useEffect(() => {
		handleGenerate()
	}, [activePeriod])

	const handleGenerate = useCallback(async () => {
		setIsGenerating(true)
		try {
			let result: InsightCollection
			
			switch (activePeriod) {
				case 'weekly':
					result = await insightGeneratorService.generateWeeklyInsights()
					break
				case 'monthly':
					result = await insightGeneratorService.generateMonthlyInsights()
					break
				case 'quarterly':
					result = await insightGeneratorService.generateQuarterlyInsights()
					break
			}
			
			setInsights(result)
			toast.success(`${result.insights.length}개의 인사이트가 생성되었습니다`)
		} catch (error) {
			console.error('Failed to generate insights:', error)
			toast.error('인사이트 생성에 실패했습니다')
		} finally {
			setIsGenerating(false)
		}
	}, [activePeriod])

	const getInsightIcon = (type: Insight['type']) => {
		switch (type) {
			case 'performance':
				return <TrendingUp className="h-5 w-5 text-green-400" />
			case 'risk':
				return <AlertTriangle className="h-5 w-5 text-red-400" />
			case 'opportunity':
				return <Target className="h-5 w-5 text-blue-400" />
			case 'pattern':
				return <Lightbulb className="h-5 w-5 text-yellow-400" />
		}
	}

	const getPriorityColor = (priority: Insight['priority']) => {
		switch (priority) {
			case 'critical':
				return 'bg-red-500/10 text-red-400 border-red-500/20'
			case 'high':
				return 'bg-orange-500/10 text-orange-400 border-orange-500/20'
			case 'medium':
				return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
			case 'low':
				return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
		}
	}

	return (
		<div className="min-h-screen bg-neutral-950 p-6">
			<PageHeader
				title="AI 인사이트"
				description="주간/월간/분기별 성과 및 트렌드 분석"
				icon={Lightbulb}
				actions={
					<Button
						variant="brand"
						size="sm"
						onClick={handleGenerate}
						disabled={isGenerating}
					>
						<Sparkles className="h-4 w-4 mr-2" />
						{isGenerating ? '생성 중...' : '새로고침'}
					</Button>
				}
			/>

			{/* Period Tabs */}
			<div className="mt-6 flex items-center gap-2">
				<Button
					variant={activePeriod === 'weekly' ? 'brand' : 'outline'}
					size="sm"
					onClick={() => setActivePeriod('weekly')}
				>
					<Calendar className="h-4 w-4 mr-2" />
					주간
				</Button>
				<Button
					variant={activePeriod === 'monthly' ? 'brand' : 'outline'}
					size="sm"
					onClick={() => setActivePeriod('monthly')}
				>
					<Calendar className="h-4 w-4 mr-2" />
					월간
				</Button>
				<Button
					variant={activePeriod === 'quarterly' ? 'brand' : 'outline'}
					size="sm"
					onClick={() => setActivePeriod('quarterly')}
				>
					<Calendar className="h-4 w-4 mr-2" />
					분기
				</Button>
			</div>

			{/* Summary */}
			{insights && (
				<div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
					<Card>
						<CardContent className="pt-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-neutral-400">전체 인사이트</p>
									<p className="text-2xl font-bold text-neutral-100">{insights.summary.total}</p>
								</div>
								<Lightbulb className="h-8 w-8 text-primary" />
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="pt-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-neutral-400">리스크</p>
									<p className="text-2xl font-bold text-red-400">{insights.summary.byType.risk}</p>
								</div>
								<AlertTriangle className="h-8 w-8 text-red-400" />
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="pt-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-neutral-400">기회</p>
									<p className="text-2xl font-bold text-blue-400">{insights.summary.byType.opportunity}</p>
								</div>
								<Target className="h-8 w-8 text-blue-400" />
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="pt-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-neutral-400">성과</p>
									<p className="text-2xl font-bold text-green-400">{insights.summary.byType.performance}</p>
								</div>
								<TrendingUp className="h-8 w-8 text-green-400" />
							</div>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Insights List */}
			{insights && insights.insights.length > 0 ? (
				<div className="mt-6 space-y-4">
					{insights.insights.map((insight) => (
						<Card key={insight.id}>
							<CardContent className="pt-6">
								<div className="flex items-start gap-4">
									{/* Icon */}
									<div className="flex-shrink-0 w-12 h-12 bg-neutral-900 rounded-lg flex items-center justify-center">
										{getInsightIcon(insight.type)}
									</div>

									{/* Content */}
									<div className="flex-1">
										<div className="flex items-start justify-between mb-2">
											<div>
												<h3 className="text-lg font-semibold text-neutral-100 mb-1">
													{insight.title}
												</h3>
												<p className="text-sm text-neutral-400">{insight.description}</p>
											</div>
											<span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(insight.priority)}`}>
												{insight.priority === 'critical' ? '긴급' :
												 insight.priority === 'high' ? '높음' :
												 insight.priority === 'medium' ? '보통' : '낮음'}
											</span>
										</div>

										{/* Metrics */}
										{insight.metrics && (
											<div className="mt-3 flex items-center gap-6">
												<div>
													<p className="text-xs text-neutral-500">현재</p>
													<p className="text-sm font-medium text-neutral-200">
														{Math.round(insight.metrics.current)}
													</p>
												</div>
												<div>
													<p className="text-xs text-neutral-500">이전</p>
													<p className="text-sm font-medium text-neutral-200">
														{Math.round(insight.metrics.previous)}
													</p>
												</div>
												<div>
													<p className="text-xs text-neutral-500">변화</p>
													<p className={`text-sm font-medium ${
														insight.metrics.change >= 0 ? 'text-green-400' : 'text-red-400'
													}`}>
														{insight.metrics.changeLabel}
													</p>
												</div>
											</div>
										)}

										{/* Impact */}
										<div className="mt-3 p-3 bg-neutral-900 rounded-lg">
											<p className="text-xs text-neutral-500 mb-1">예상 영향</p>
											<p className="text-sm text-neutral-300">{insight.impact}</p>
										</div>

										{/* Suggested Actions */}
										{insight.suggestedActions.length > 0 && (
											<div className="mt-3">
												<p className="text-xs text-neutral-500 mb-2">권장 조치</p>
												<ul className="space-y-1">
													{insight.suggestedActions.map((action, idx) => (
														<li key={idx} className="flex items-start gap-2">
															<span className="text-primary mt-1">•</span>
															<span className="text-sm text-neutral-400">{action}</span>
														</li>
													))}
												</ul>
											</div>
										)}

										{/* Related Items */}
										{insight.relatedItems.length > 0 && (
											<div className="mt-3 flex flex-wrap gap-2">
												{insight.relatedItems.map((item, idx) => (
													<span
														key={idx}
														className="px-2 py-1 bg-neutral-800 text-neutral-300 rounded text-xs"
													>
														{item.type.toUpperCase()}: {item.name}
													</span>
												))}
											</div>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			) : (
				<Card className="mt-6">
					<CardContent className="py-12 text-center">
						<Lightbulb className="h-12 w-12 text-neutral-600 mx-auto mb-4" />
						<h3 className="text-lg font-semibold text-neutral-300 mb-2">
							{isGenerating ? '인사이트 생성 중...' : '인사이트가 없습니다'}
						</h3>
						<p className="text-neutral-500 mb-6">
							{isGenerating ? '데이터를 분석하고 있습니다' : '새로고침 버튼을 눌러 인사이트를 생성하세요'}
						</p>
					</CardContent>
				</Card>
			)}
		</div>
	)
}

