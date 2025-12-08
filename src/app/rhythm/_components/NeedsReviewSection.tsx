/**
 * Needs Review Section Component
 */

import { useNavigate } from 'react-router-dom'
import { useI18n } from '../../../i18n/I18nProvider'
import { useRhythm } from '../../../context/RhythmContext'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { EmptyState } from '../../../components/common/EmptyState'
import { 
	Calendar,
	User,
	MessageSquare,
	ArrowRight,
	Clock,
	CheckCircle2,
	XCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import type { LoopItem } from '../../../services/rhythm/types'
import { storage } from '../../../utils/storage'

export function NeedsReviewSection() {
	const navigate = useNavigate()
	const { needsReview, refreshRhythm } = useRhythm()
	const { t, formatDate } = useI18n()

	const handleMarkAsRead = (item: LoopItem) => {
		const reviews = storage.get<any[]>('received_reviews') || []
		const updatedReviews = reviews.map(r => 
			r.id === item.sourceId ? { ...r, isRead: true } : r
		)
		storage.set('received_reviews', updatedReviews)
		refreshRhythm()
		toast.success(t('common.success'))
	}

	const handleNavigateToSource = () => {
		navigate('/app/work-review')
	}

	return (
		<div className="space-y-8">
			{/* Summary Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<MessageSquare className="h-4 w-4 text-orange-600" />
							{t('review.unread')}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-orange-600">
							{needsReview.length}
						</div>
						<p className="text-xs text-neutral-400 mt-1">
							{t('rhythm.needsAttention')}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<CheckCircle2 className="h-4 w-4 text-green-600" />
							{t('review.approved')}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">
							{needsReview.filter(item => 
								item.originalData?.reviewType === 'approved'
							).length}
						</div>
						<p className="text-xs text-neutral-400 mt-1">
							{t('rhythm.needsReviewSection.positiveFeedback')}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<XCircle className="h-4 w-4 text-red-600" />
							{t('review.changes')}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-red-600">
							{needsReview.filter(item => 
								item.originalData?.reviewType === 'rejected'
							).length}
						</div>
						<p className="text-xs text-neutral-400 mt-1">
							{t('rhythm.needsReviewSection.needsAction')}
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Reviews */}
			{needsReview.length > 0 ? (
				<div className="grid grid-cols-1 gap-4">
					{needsReview.map((item) => {
						const reviewType = item.originalData?.reviewType
						const isApproved = reviewType === 'approved'
						const isRejected = reviewType === 'rejected'
						
						return (
							<Card
								key={item.id}
								className={`border-l-4 ${
									isApproved ? 'border-l-green-500' : 
									isRejected ? 'border-l-red-500' : 
									'border-l-orange-500'
								} hover:shadow-lg transition-shadow`}
							>
								<CardContent className="p-6">
									<div className="flex items-start justify-between gap-4">
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-2">
												{isApproved && (
													<span className="text-xs px-2 py-1 rounded-full bg-green-900/30 text-green-300 font-medium flex items-center gap-1">
														<CheckCircle2 className="h-3 w-3" />
														{t('review.approved')}
													</span>
												)}
												{isRejected && (
													<span className="text-xs px-2 py-1 rounded-full bg-red-900/30 text-red-300 font-medium flex items-center gap-1">
														<XCircle className="h-3 w-3" />
														{t('review.changes')}
													</span>
												)}
												{!isApproved && !isRejected && (
													<span className="text-xs px-2 py-1 rounded-full bg-orange-900/30 text-orange-300 font-medium">
														{t('rhythm.needsReviewSection.comment')}
													</span>
												)}
											</div>
											<h3 className="text-lg font-semibold mb-2">{item.title}</h3>
											{item.description && (
												<div className="p-3 bg-neutral-900 rounded-lg mb-3">
													<p className="text-sm text-neutral-300">
														"{item.description}"
													</p>
												</div>
											)}
											
											<div className="flex items-center gap-4 text-sm text-neutral-400">
												{item.originalData?.reviewedByName && (
													<div className="flex items-center gap-1">
														<User className="h-4 w-4" />
														{item.originalData.reviewedByName}
													</div>
												)}
												{item.originalData?.reviewedAt && (
													<div className="flex items-center gap-1">
														<Clock className="h-4 w-4" />
														{formatDate(item.originalData.reviewedAt)}
													</div>
												)}
												{item.projectName && (
													<div className="flex items-center gap-1">
														<Calendar className="h-4 w-4" />
														{item.projectName}
													</div>
												)}
											</div>
										</div>
										<div className="flex gap-2">
											<Button
												onClick={() => handleMarkAsRead(item)}
												variant="outline"
												size="sm"
											>
												{t('messages.markRead')}
											</Button>
											<Button
												onClick={handleNavigateToSource}
												variant="outline"
												size="sm"
											>
												<ArrowRight className="h-4 w-4" />
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						)
					})}
				</div>
			) : (
				<EmptyState
					icon={<CheckCircle2 className="h-12 w-12" />}
					title={t('review.allCaughtUp')}
					description={t('review.noPending')}
					action={
						<Button onClick={() => navigate('/app/work-review')}>
							{t('review.viewAll')}
						</Button>
					}
				/>
			)}
		</div>
	)
}

