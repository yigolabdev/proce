/**
 * KPI Card Component
 * KPI 정보를 카드 형태로 표시
 */

import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Target, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { KPI } from '../../types/kpi.types'

interface KPICardProps {
	kpi: KPI
	onClick?: () => void
}

export function KPICard({ kpi, onClick }: KPICardProps) {
	// 진척도에 따른 색상
	const getProgressColor = () => {
		if (kpi.status === 'achieved') return 'text-green-500'
		if (kpi.status === 'on-track') return 'text-blue-500'
		if (kpi.status === 'at-risk') return 'text-yellow-500'
		return 'text-red-500'
	}

	const getProgressBgColor = () => {
		if (kpi.status === 'achieved') return 'bg-green-500'
		if (kpi.status === 'on-track') return 'bg-blue-500'
		if (kpi.status === 'at-risk') return 'bg-yellow-500'
		return 'bg-red-500'
	}

	// 상태 아이콘
	const getStatusIcon = () => {
		if (kpi.status === 'achieved' || kpi.status === 'on-track') {
			return <TrendingUp className="h-4 w-4" />
		}
		if (kpi.status === 'at-risk') {
			return <Minus className="h-4 w-4" />
		}
		return <TrendingDown className="h-4 w-4" />
	}

	// 우선순위 배지 색상
	const getPriorityColor = () => {
		switch (kpi.priority) {
			case 'critical':
				return 'bg-red-500/10 text-red-400 border-red-500/20'
			case 'high':
				return 'bg-orange-500/10 text-orange-400 border-orange-500/20'
			case 'medium':
				return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
			case 'low':
				return 'bg-green-500/10 text-green-400 border-green-500/20'
		}
	}

	// 값 포맷팅
	const formatValue = (value: number) => {
		switch (kpi.metric.format) {
			case 'percentage':
				return `${value}%`
			case 'currency':
				return `${value.toLocaleString()}원`
			case 'count':
				return `${value.toLocaleString()}건`
			default:
				return value.toLocaleString()
		}
	}

	return (
		<Card
			className="bg-surface-dark border-border-dark hover:border-neutral-700 transition-all cursor-pointer"
			onClick={onClick}
		>
			<CardHeader>
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2 mb-2">
							{/* 우선순위 배지 */}
							<span className={`text-xs px-2 py-1 rounded border font-bold uppercase ${getPriorityColor()}`}>
								{kpi.priority}
							</span>
							
							{/* 카테고리 배지 */}
							<span className="text-xs px-2 py-1 rounded bg-neutral-800 text-neutral-400">
								{kpi.category}
							</span>
						</div>
						
						<CardTitle className="flex items-center gap-2 text-lg">
							<Target className="h-5 w-5 text-primary" />
							{kpi.name}
						</CardTitle>
					</div>
					
					{/* 상태 아이콘 */}
					<div className={`p-2 rounded-lg ${getProgressColor()} bg-opacity-10`}>
						{getStatusIcon()}
					</div>
				</div>
			</CardHeader>

			<CardContent>
				<div className="space-y-4">
					{/* 설명 */}
					<p className="text-sm text-neutral-400 line-clamp-2">
						{kpi.description}
					</p>

					{/* 현재값 vs 목표값 */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<p className="text-xs text-neutral-500 mb-1">현재</p>
							<p className="text-xl font-bold text-white">
								{formatValue(kpi.metric.current)}
							</p>
						</div>
						<div>
							<p className="text-xs text-neutral-500 mb-1">목표</p>
							<p className="text-xl font-bold text-primary">
								{formatValue(kpi.metric.target)}
							</p>
						</div>
					</div>

					{/* 진척도 바 */}
					<div>
						<div className="flex items-center justify-between mb-2">
							<span className="text-xs text-neutral-500">진척도</span>
							<span className={`text-sm font-bold ${getProgressColor()}`}>
								{Math.round(kpi.progress)}%
							</span>
						</div>
						<div className="w-full bg-neutral-800 rounded-full h-2">
							<div
								className={`h-2 rounded-full transition-all ${getProgressBgColor()}`}
								style={{ width: `${Math.min(kpi.progress, 100)}%` }}
							/>
						</div>
					</div>

					{/* 메타 정보 */}
					<div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-border-dark">
						<div className="flex items-center gap-3">
							<span>{kpi.department}</span>
							<span>•</span>
							<span>{kpi.owner}</span>
						</div>
						{kpi.linkedObjectives && kpi.linkedObjectives.length > 0 && (
							<span className="text-primary">
								{kpi.linkedObjectives.length} OKR 연결됨
							</span>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
