/**
 * AI Generated OKR Card Component
 * AI가 추천한 OKR을 표시하고 수락/거절할 수 있는 카드
 */

import { Card, CardContent, CardHeader } from '../ui/Card'
import { Button } from '../ui/Button'
import { 
	Sparkles, 
	CheckCircle2, 
	XCircle, 
	Users, 
	Clock, 
	TrendingUp,
	Lightbulb,
	Target,
	ChevronDown,
	ChevronUp
} from 'lucide-react'
import { useState } from 'react'
import type { AIGeneratedOKR } from '../../types/kpi.types'

interface AIGeneratedOKRCardProps {
	okr: AIGeneratedOKR
	onAccept: (okr: AIGeneratedOKR) => void
	onReject: (okr: AIGeneratedOKR) => void
}

export function AIGeneratedOKRCard({ okr, onAccept, onReject }: AIGeneratedOKRCardProps) {
	const [isExpanded, setIsExpanded] = useState(false)

	// 신뢰도에 따른 색상
	const getConfidenceColor = () => {
		if (okr.confidenceScore >= 0.8) return 'text-green-400 bg-green-500/10 border-green-500/20'
		if (okr.confidenceScore >= 0.6) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
		return 'text-orange-400 bg-orange-500/10 border-orange-500/20'
	}

	// 우선순위 색상
	const getPriorityColor = () => {
		switch (okr.priority) {
			case 'high':
				return 'bg-red-500/10 text-red-400 border-red-500/20'
			case 'medium':
				return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
			case 'low':
				return 'bg-green-500/10 text-green-400 border-green-500/20'
		}
	}

	return (
		<Card className="bg-surface-dark border-border-dark hover:border-primary/30 transition-all">
			<CardHeader className="border-b border-border-dark">
				<div className="space-y-3">
					{/* 상단 배지들 */}
					<div className="flex items-center gap-2 flex-wrap">
						{/* AI 생성 배지 */}
						<span className="text-xs px-2 py-1 rounded border font-bold uppercase bg-primary/10 text-primary border-primary/20 flex items-center gap-1">
							<Sparkles className="h-3 w-3" />
							AI 추천
						</span>
						
						{/* 신뢰도 배지 */}
						<span className={`text-xs px-2 py-1 rounded border font-bold ${getConfidenceColor()}`}>
							신뢰도: {Math.round(okr.confidenceScore * 100)}%
						</span>
						
						{/* 우선순위 배지 */}
						<span className={`text-xs px-2 py-1 rounded border font-bold uppercase ${getPriorityColor()}`}>
							{okr.priority}
						</span>
						
						{/* KPI 기여도 배지 */}
						<span className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold flex items-center gap-1">
							<TrendingUp className="h-3 w-3" />
							KPI 기여도: {okr.expectedKPIContribution}%
						</span>
					</div>

					{/* OKR 제목 */}
					<h3 className="text-lg font-bold text-white flex items-center gap-2">
						<Target className="h-5 w-5 text-primary" />
						{okr.title}
					</h3>

					{/* OKR 설명 */}
					<p className="text-sm text-neutral-400">
						{okr.description}
					</p>
				</div>
			</CardHeader>

			<CardContent className="p-6 space-y-4">
				{/* AI 추천 이유 */}
				<div className="p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
					<div className="flex items-start gap-3">
						<Lightbulb className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
						<div className="flex-1">
							<p className="text-xs font-medium text-blue-100 mb-1">
								AI 추천 이유
							</p>
							<p className="text-sm text-blue-300">
								{okr.reasoning}
							</p>
						</div>
					</div>
				</div>

				{/* Key Results 미리보기 */}
				<div>
					<p className="text-xs font-medium text-neutral-400 mb-2 flex items-center gap-2">
						<CheckCircle2 className="h-4 w-4" />
						자동 생성될 Key Results ({okr.suggestedKeyResults.length}개)
					</p>
					<div className="space-y-2">
						{okr.suggestedKeyResults.slice(0, 3).map((kr) => (
							<div key={kr.id} className="flex items-start gap-2 text-sm p-2 bg-neutral-900/50 rounded">
								<div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
								<span className="text-neutral-300 flex-1">{kr.description}</span>
								<span className="text-xs text-neutral-500">
									{Math.round(kr.confidenceScore * 100)}%
								</span>
							</div>
						))}
					</div>
				</div>

				{/* 리소스 예측 */}
				<div className="grid grid-cols-2 gap-3">
					<div className="p-3 bg-neutral-900/50 rounded-lg">
						<div className="flex items-center gap-2 mb-1">
							<Clock className="h-4 w-4 text-neutral-500" />
							<p className="text-xs text-neutral-500">예상 기간</p>
						</div>
						<p className="font-bold text-white">{okr.estimatedResources.timeRequired}</p>
					</div>
					<div className="p-3 bg-neutral-900/50 rounded-lg">
						<div className="flex items-center gap-2 mb-1">
							<Users className="h-4 w-4 text-neutral-500" />
							<p className="text-xs text-neutral-500">필요 인원</p>
						</div>
						<p className="font-bold text-white">{okr.estimatedResources.teamSize}명</p>
					</div>
				</div>

				{/* 상세 정보 토글 */}
				<button
					onClick={() => setIsExpanded(!isExpanded)}
					className="w-full py-2 text-sm text-neutral-400 hover:text-white transition-colors flex items-center justify-center gap-2"
				>
					{isExpanded ? (
						<>
							간략히 보기 <ChevronUp className="h-4 w-4" />
						</>
					) : (
						<>
							상세 정보 보기 <ChevronDown className="h-4 w-4" />
						</>
					)}
				</button>

				{/* 확장 영역 */}
				{isExpanded && (
					<div className="space-y-4 pt-4 border-t border-border-dark animate-in fade-in slide-in-from-top-2">
						{/* 필요 역량 */}
						<div>
							<p className="text-xs font-medium text-neutral-400 mb-2">필요 역량</p>
							<div className="flex flex-wrap gap-2">
								{okr.estimatedResources.requiredSkills.map((skill, idx) => (
									<span
										key={idx}
										className="text-xs px-2 py-1 rounded bg-neutral-800 text-neutral-300"
									>
										{skill}
									</span>
								))}
							</div>
						</div>

						{/* 성공 요인 */}
						{okr.feasibility.successFactors.length > 0 && (
							<div>
								<p className="text-xs font-medium text-neutral-400 mb-2">성공 요인</p>
								<div className="space-y-1">
									{okr.feasibility.successFactors.map((factor, idx) => (
										<div key={idx} className="flex items-start gap-2 text-sm">
											<CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
											<span className="text-neutral-300">{factor}</span>
										</div>
									))}
								</div>
							</div>
						)}

						{/* 도전 과제 */}
						{okr.feasibility.challenges.length > 0 && (
							<div>
								<p className="text-xs font-medium text-neutral-400 mb-2">도전 과제</p>
								<div className="space-y-1">
									{okr.feasibility.challenges.map((challenge, idx) => (
										<div key={idx} className="flex items-start gap-2 text-sm">
											<XCircle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
											<span className="text-neutral-300">{challenge}</span>
										</div>
									))}
								</div>
							</div>
						)}

						{/* 실행 가능성 점수 */}
						<div>
							<p className="text-xs font-medium text-neutral-400 mb-2">실행 가능성</p>
							<div className="flex items-center gap-3">
								<div className="flex-1 bg-neutral-800 rounded-full h-2">
									<div
										className="bg-gradient-to-r from-orange-500 to-green-500 h-2 rounded-full transition-all"
										style={{ width: `${okr.feasibility.score * 100}%` }}
									/>
								</div>
								<span className="text-sm font-bold text-white">
									{Math.round(okr.feasibility.score * 100)}%
								</span>
							</div>
						</div>
					</div>
				)}

				{/* 액션 버튼 */}
				<div className="flex items-center gap-3 pt-4 border-t border-border-dark">
					<Button
						onClick={() => onAccept(okr)}
						variant="brand"
						className="flex-1 flex items-center justify-center gap-2"
					>
						<CheckCircle2 className="h-4 w-4" />
						OKR 생성 (KR & Task 포함)
					</Button>
					<Button
						onClick={() => onReject(okr)}
						variant="outline"
						className="flex items-center justify-center gap-2"
					>
						<XCircle className="h-4 w-4" />
						거절
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
