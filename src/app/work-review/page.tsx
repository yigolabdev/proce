import { storage } from '../../utils/storage'
import { useI18n } from '../../i18n/I18nProvider'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { PageHeader } from '../../components/common/PageHeader'
import { LoadingState } from '../../components/common/LoadingState'
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts'
import { useAuth } from '../../context/AuthContext'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import {
	MessageSquare,
	Clock,
	Calendar,
	User,
	FileText,
	Filter,
	ChevronDown,
	ChevronUp,
	FolderKanban,
	CheckCircle2,
	XCircle,
	AlertCircle,
	Mail,
	ThumbsUp,
	ThumbsDown,
	Tag,
	Link as LinkIcon,
	Paperclip,
	Shield
} from 'lucide-react'
import { toast } from 'sonner'
import Toaster from '../../components/ui/Toaster'
import type { PendingReview, ReceivedReview } from '../../types/common.types'
import { createReviewCompletionMessage, saveMessage } from '../../utils/messageHelpers'
import { parsePendingReviewsFromStorage, parseReceivedReviewsFromStorage } from '../../utils/mappers'

export default function WorkReviewPage() {
	const navigate = useNavigate()
	const { t, locale } = useI18n()
	const { user } = useAuth()
	
	// State - use custom hooks for better management
	const [activeTab, setActiveTab] = useState<'pending' | 'received'>('pending')
	const [pendingReviews, setPendingReviews, loadingPending] = useLocalStorage<PendingReview[]>('pending_reviews', [])
	const [reviews, setReviews, loadingReceived] = useLocalStorage<ReceivedReview[]>('received_reviews', [])
	const [projects] = useLocalStorage<Array<{ id: string; name: string }>>('projects', [])
	const [filteredReviews, setFilteredReviews] = useState<ReceivedReview[]>([])
	const [filterType, setFilterType] = useState<string>('all')
	const [filterProject, setFilterProject] = useState<string>('all')
	const [filterRead, setFilterRead] = useState<string>('all')
	const [expandedReviews, setExpandedReviews] = useState<string[]>([])

	const loading = loadingPending || loadingReceived

	// Keyboard shortcuts
	useKeyboardShortcuts({
		goToDashboard: () => navigate('/app/dashboard'),
		newWork: () => navigate('/app/input'),
	})

	// Parse dates for reviews (useEffect to convert dates from storage)
	useEffect(() => {
		if (pendingReviews.length > 0) {
			const parsed = parsePendingReviewsFromStorage(pendingReviews as any)
			if (JSON.stringify(parsed) !== JSON.stringify(pendingReviews)) {
				setPendingReviews(parsed)
			}
		}
	}, []) // Only run once on mount

	useEffect(() => {
		if (reviews.length > 0) {
			const parsed = parseReceivedReviewsFromStorage(reviews as any)
			if (JSON.stringify(parsed) !== JSON.stringify(reviews)) {
				setReviews(parsed)
			}
		}
	}, []) // Only run once on mount

	// Handle review action - Memoized for performance
	const handleReviewAction = useCallback((review: PendingReview, action: 'approve' | 'reject', comment: string) => {
		if (!user) {
			toast.error('User not authenticated')
			return
		}

		// 1. Remove from pending reviews
		const updatedPending = pendingReviews.filter(r => r.id !== review.id)
		setPendingReviews(updatedPending)
		storage.set('pending_reviews', updatedPending)

		// 2. Update WorkEntry status
		const workEntries = storage.get<any[]>('workEntries') || []
		const updatedEntries = workEntries.map(entry => 
			entry.id === review.workEntryId 
				? { 
					...entry, 
					status: action === 'approve' ? 'approved' : 'rejected',
					reviewedBy: user.name,
					reviewedById: user.id,
					reviewedAt: new Date().toISOString(),
					reviewComments: comment || (action === 'approve' ? 'Approved.' : 'Rejected.')
				}
				: entry
		)
		storage.set('workEntries', updatedEntries)

		// 3. Add to received reviews (Notify submitter)
		const receivedReviews = storage.get<ReceivedReview[]>('received_reviews') || []
		const newReceivedReview: ReceivedReview = {
			id: `review-${Date.now()}`,
			workEntryId: review.workEntryId,
			workTitle: review.workTitle,
			workDescription: review.workDescription,
			projectId: review.projectId,
			projectName: review.projectName,
			reviewType: action === 'approve' ? 'approved' : 'rejected',
			reviewedBy: user.name,
			reviewedById: user.id,
			reviewedByDepartment: user.department,
			reviewedAt: new Date(),
			reviewComments: comment || (action === 'approve' ? 'Approved.' : 'Rejected.'),
			isRead: false,
			tags: review.tags,
			files: review.files,
			links: review.links,
			category: review.category,
			priority: review.priority,
			isConfidential: review.isConfidential
		}
		storage.set('received_reviews', [newReceivedReview, ...receivedReviews])

		// 4. Send Message using helper function
		const message = createReviewCompletionMessage({
			workEntryId: review.workEntryId,
			workTitle: review.workTitle,
			reviewType: action === 'approve' ? 'approved' : 'rejected',
			reviewerName: user.name,
			reviewerDepartment: user.department,
			submitterName: review.submittedBy,
			submitterId: review.submittedById,
			reviewComments: comment || (action === 'approve' ? 'Approved.' : 'Rejected.')
		})
		saveMessage(message)

		toast.success(`Work ${action === 'approve' ? 'Approved' : 'Rejected'}`, {
			description: `Notification sent to ${review.submittedBy}`
		})
	}, [user, pendingReviews, setPendingReviews])

	// Mark review as read - Memoized
	const markAsRead = useCallback((reviewId: string) => {
		setReviews(prev => {
			const updated = prev.map(r => 
				r.id === reviewId ? { ...r, isRead: true } : r
			)
			return updated
		})
	}, [setReviews])

	// Filter reviews - Using useMemo for better performance
	useEffect(() => {
		let filtered = reviews

		// Filter by review type
		if (filterType !== 'all') {
			filtered = filtered.filter(r => r.reviewType === filterType)
		}

		// Filter by project
		if (filterProject !== 'all') {
			filtered = filtered.filter(r => r.projectId === filterProject)
		}

		// Filter by read status
		if (filterRead === 'unread') {
			filtered = filtered.filter(r => !r.isRead)
		} else if (filterRead === 'read') {
			filtered = filtered.filter(r => r.isRead)
		}

	// Sort by date (newest first)
	filtered.sort((a, b) => {
		const aTime = typeof a.reviewedAt === 'string' ? new Date(a.reviewedAt).getTime() : a.reviewedAt.getTime()
		const bTime = typeof b.reviewedAt === 'string' ? new Date(b.reviewedAt).getTime() : b.reviewedAt.getTime()
		return bTime - aTime
	})

		setFilteredReviews(filtered)
	}, [reviews, filterType, filterProject, filterRead])

	// Statistics - Memoized for performance
	const statistics = useMemo(() => {
		const filtered = filterProject === 'all' 
			? reviews 
			: reviews.filter(r => r.projectId === filterProject)

		return {
			total: filtered.length,
			unread: filtered.filter(r => !r.isRead).length,
			approved: filtered.filter(r => r.reviewType === 'approved').length,
			changesRequested: filtered.filter(r => r.reviewType === 'changes_requested').length,
			rejected: filtered.filter(r => r.reviewType === 'rejected').length,
		}
	}, [reviews, filterProject])

	// Toggle expanded review
	const toggleExpanded = (reviewId: string) => {
		setExpandedReviews(prev => {
			if (prev.includes(reviewId)) {
				return prev.filter(id => id !== reviewId)
			}
			return [...prev, reviewId]
		})
	}

	// Get review type badge
	const getReviewTypeBadge = (type: string) => {
		switch (type) {
			case 'approved':
				return { label: t('common.statuses.approved'), color: 'bg-green-100 bg-green-900/text-green-400', icon: CheckCircle2 }
			case 'rejected':
				return { label: t('common.statuses.rejected'), color: 'bg-red-100 bg-red-900/text-red-400', icon: XCircle }
			case 'changes_requested':
				return { label: t('common.statuses.changesRequested'), color: 'bg-orange-100 bg-orange-900/text-orange-400', icon: AlertCircle }
			default:
				return { label: t('common.status'), color: 'bg-neutral-100 bg-neutral-800 dark:text-neutral-400', icon: MessageSquare }
		}
	}

	// Format time ago
	const formatTimeAgo = (date: Date) => {
		const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
		
		if (seconds < 60) return t('common.time.justNow')
		if (seconds < 3600) return `${Math.floor(seconds / 60)}${t('common.time.minutes')} ${t('common.time.ago')}`
		if (seconds < 86400) return `${Math.floor(seconds / 3600)}${t('common.time.hours')} ${t('common.time.ago')}`
		if (seconds < 604800) return `${Math.floor(seconds / 86400)}${t('common.time.days')} ${t('common.time.ago')}`
		return date.toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US')
	}

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background-dark">
				<LoadingState type="page" />
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-background-dark text-neutral-100">
			<Toaster />
			
			<div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">
			{/* Header */}
			<PageHeader
				title={t('review.title')}
				description={t('review.description')}
			/>
			
				<div className="space-y-6">
			{/* Tabs - Mobile Optimized */}
				<div className="flex border-b border-border-dark overflow-x-auto scrollbar-hide">
				<button
					onClick={() => setActiveTab('pending')}
					className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
						activeTab === 'pending'
							? 'border-orange-500 text-orange-500'
							: 'border-transparent text-neutral-500 hover:text-neutral-300'
					}`}
				>
					{t('review.toReview')} ({pendingReviews.length})
				</button>
				<button
					onClick={() => setActiveTab('received')}
					className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
						activeTab === 'received'
							? 'border-orange-500 text-orange-500'
							: 'border-transparent text-neutral-500 hover:text-neutral-300'
					}`}
				>
					{t('review.myReviews')} ({reviews.length})
				</button>
			</div>

			{/* Pending Reviews (To Review) - Mobile Optimized */}
			{activeTab === 'pending' && (
				<div className={pendingReviews.length === 0 ? "space-y-4" : "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"}>
						{pendingReviews.length === 0 ? (
								<div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border-dark rounded-xl bg-surface-dark/50">
									<div className="p-4 rounded-full bg-surface-dark mb-4">
										<CheckCircle2 className="h-8 w-8 text-neutral-500" />
									</div>
									<h3 className="text-lg font-medium text-white mb-2">{t('review.allCaughtUp')}</h3>
									<p className="text-neutral-500 max-w-md">
										{t('review.noPending')}
									</p>
								</div>
						) : (
							pendingReviews.map((review) => (
									<div key={review.id} className="bg-surface-dark border border-border-dark rounded-xl overflow-hidden">
										<div className="p-6">
										<div className="flex items-start justify-between gap-4">
											<div className="flex-1">
												<div className="flex items-center gap-2 mb-3">
													<span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-neutral-800 text-neutral-300 flex items-center gap-1">
														<FolderKanban className="h-3 w-3" />
														{review.projectName}
													</span>
													<span className="text-xs text-neutral-500">
														{new Date(review.submittedAt).toLocaleString()}
													</span>
												</div>
													<h3 className="text-lg font-bold text-white mb-2">{review.workTitle}</h3>
													<div className="flex items-center gap-2 text-sm text-neutral-400 mb-4">
													<User className="h-4 w-4" />
														<span className="text-white">{review.submittedBy}</span>
													{review.submittedByDepartment && (
														<span className="text-neutral-500">• {review.submittedByDepartment}</span>
													)}
												</div>
													<div className="bg-surface-dark p-4 rounded-lg text-sm text-neutral-300 border border-border-dark space-y-4">
														<p>{review.workDescription}</p>
														
														{/* Metadata Section */}
														<div className="flex flex-wrap gap-3 border-t border-border-dark pt-3 mt-3">
															{/* Priority */}
															{review.priority && (
																<span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wider font-medium ${
																	review.priority === 'high' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
																	review.priority === 'medium' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
																	'bg-blue-500/10 text-blue-400 border-blue-500/20'
																}`}>
																	{t(`common.priorities.${review.priority}`) || review.priority}
																</span>
															)}
															
															{/* Category */}
															{review.category && (
																<span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700 uppercase tracking-wider font-medium">
																	{review.category}
																</span>
															)}

															{/* Confidential */}
															{review.isConfidential && (
																<span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1 uppercase tracking-wider font-medium">
																	<Shield className="h-3 w-3" />
																	{t('input.confidential')}
																</span>
															)}
														</div>

														{/* Tags */}
														{review.tags && review.tags.length > 0 && (
															<div className="flex flex-wrap gap-2">
																{review.tags.map(tag => (
																	<span key={tag} className="text-xs flex items-center gap-1 text-neutral-400 bg-neutral-800/50 px-2 py-1 rounded">
																		<Tag className="h-3 w-3" />
																		{tag}
																	</span>
																))}
															</div>
														)}

													{/* Files & Links */}
													{((review.files && review.files.length > 0) || (review.links && review.links.length > 0)) && (
															<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
																{review.files && review.files.length > 0 && (
																	<div className="space-y-2">
																		<span className="text-xs font-medium text-neutral-500 uppercase tracking-wider flex items-center gap-1">
																			<Paperclip className="h-3 w-3" /> {t('common.attachments')}
																		</span>
																		<div className="space-y-1">
																			{review.files.map((file, idx) => (
																				<div key={idx} className="flex items-center gap-2 text-xs text-neutral-300 bg-neutral-800 p-2 rounded border border-neutral-700">
																					<FileText className="h-3 w-3 text-neutral-500" />
																					<span className="truncate">{file.name}</span>
																				</div>
																			))}
																		</div>
																	</div>
																)}
																{review.links && review.links.length > 0 && (
																	<div className="space-y-2">
																		<span className="text-xs font-medium text-neutral-500 uppercase tracking-wider flex items-center gap-1">
																			<LinkIcon className="h-3 w-3" /> {t('common.links')}
																		</span>
																		<div className="space-y-1">
																			{review.links.map((link, idx) => (
																				<a 
																					key={idx} 
																					href={link.url}
																					target="_blank"
																					rel="noopener noreferrer"
																					className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 bg-neutral-800 p-2 rounded border border-neutral-700 transition-colors"
																				>
																					<LinkIcon className="h-3 w-3" />
																					<span className="truncate">{link.title}</span>
																				</a>
																			))}
																		</div>
																	</div>
																)}
															</div>
														)}
													</div>
											</div>
										</div>
											<div className="mt-6 pt-4 border-t border-border-dark flex gap-3">
											<Button 
												onClick={() => handleReviewAction(review, 'approve', '')}
												variant="primary"
												className="flex-1 h-10"
											>
												<CheckCircle2 className="mr-2 h-4 w-4" /> {t('review.approved')}
											</Button>
											<Button 
												onClick={() => handleReviewAction(review, 'reject', '')}
												variant="danger"
												className="flex-1 h-10"
											>
												<XCircle className="mr-2 h-4 w-4" /> {t('review.rejected')}
											</Button>
										</div>
										</div>
									</div>
							))
						)}
					</div>
				)}

			{/* Received Reviews (My Reviews) */}
			{activeTab === 'received' && (
					<div className="space-y-6">
			{/* Statistics - Improved Compact Layout & Mobile Responsive */}
	<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
					<Card className="bg-surface-dark border-border-dark hover:border-blue-500/50 transition-all">
					<CardContent className="p-4">
						<div className="flex items-center gap-2">
								<div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
									<MessageSquare className="h-5 w-5" />
								</div>
							<div>
									<p className="text-2xl font-bold text-white">{statistics.total}</p>
									<p className="text-xs text-neutral-500 font-medium">{t('review.total')}</p>
							</div>
						</div>
					</CardContent>
				</Card>

					<Card className="bg-surface-dark border-border-dark hover:border-purple-500/50 transition-all">
					<CardContent className="p-4">
						<div className="flex items-center gap-2">
								<div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
									<Mail className="h-5 w-5" />
								</div>
							<div>
									<p className="text-2xl font-bold text-white">{statistics.unread}</p>
									<p className="text-xs text-neutral-500 font-medium">{t('review.unread')}</p>
							</div>
						</div>
					</CardContent>
				</Card>

					<Card className="bg-surface-dark border-border-dark hover:border-green-500/50 transition-all">
					<CardContent className="p-4">
						<div className="flex items-center gap-2">
								<div className="p-2 bg-green-500/10 rounded-lg text-green-500">
									<ThumbsUp className="h-5 w-5" />
								</div>
							<div>
									<p className="text-2xl font-bold text-white">{statistics.approved}</p>
									<p className="text-xs text-neutral-500 font-medium">{t('review.approved')}</p>
							</div>
						</div>
					</CardContent>
				</Card>

					<Card className="bg-surface-dark border-border-dark hover:border-orange-500/50 transition-all">
					<CardContent className="p-4">
						<div className="flex items-center gap-2">
								<div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
									<AlertCircle className="h-5 w-5" />
								</div>
							<div>
									<p className="text-2xl font-bold text-white">{statistics.changesRequested}</p>
									<p className="text-xs text-neutral-500 font-medium">{t('review.changes')}</p>
							</div>
						</div>
					</CardContent>
				</Card>

					<Card className="bg-surface-dark border-border-dark hover:border-red-500/50 transition-all">
					<CardContent className="p-4">
						<div className="flex items-center gap-2">
								<div className="p-2 bg-red-500/10 rounded-lg text-red-500">
									<ThumbsDown className="h-5 w-5" />
								</div>
							<div>
									<p className="text-2xl font-bold text-white">{statistics.rejected}</p>
									<p className="text-xs text-neutral-500 font-medium">{t('review.rejected')}</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Filters - Mobile Optimized */}
				<Card className="bg-surface-dark border-border-dark">
				<CardContent className="p-3 sm:p-4">
					<div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-col sm:flex-row">
						<Filter className="h-4 w-4 text-neutral-500 flex-shrink-0 hidden sm:block" />
						
						{/* Filter Group - Stack on Mobile */}
						<div className="flex items-center gap-3 sm:gap-4 flex-wrap w-full sm:w-auto">
							{/* Review Type Filter */}
							<div className="flex items-center gap-2 flex-1 sm:flex-initial">
									<span className="text-xs font-medium text-neutral-500 uppercase tracking-wider hidden sm:inline">{t('common.type')}</span>
								<select
									value={filterType}
									onChange={(e) => setFilterType(e.target.value)}
										className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm bg-surface-dark border border-border-dark text-white rounded-lg focus:outline-none focus:border-orange-500 w-full sm:w-auto"
								>
									<option value="all">{t('messages.allTypes')}</option>
									<option value="approved">{t('review.approved')}</option>
									<option value="changes_requested">{t('review.changes')}</option>
									<option value="rejected">{t('review.rejected')}</option>
								</select>
							</div>

							{/* Project Filter */}
							<div className="flex items-center gap-2 flex-1 sm:flex-initial">
								<FolderKanban className="h-4 w-4 text-neutral-500 flex-shrink-0 sm:hidden" />
									<span className="text-xs font-medium text-neutral-500 uppercase tracking-wider hidden sm:inline">{t('common.project')}</span>
								<select
									value={filterProject}
									onChange={(e) => setFilterProject(e.target.value)}
										className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm bg-surface-dark border border-border-dark text-white rounded-lg focus:outline-none focus:border-orange-500 w-full sm:w-auto"
								>
									<option value="all">{t('projects.allProjects')}</option>
									{projects.map((project) => (
										<option key={project.id} value={project.id}>
											{project.name}
										</option>
									))}
								</select>
							</div>

							{/* Read Status Filter */}
							<div className="flex items-center gap-2 flex-1 sm:flex-initial">
								<Mail className="h-4 w-4 text-neutral-500 flex-shrink-0 sm:hidden" />
									<span className="text-xs font-medium text-neutral-500 uppercase tracking-wider hidden sm:inline">{t('common.status')}</span>
								<select
									value={filterRead}
									onChange={(e) => setFilterRead(e.target.value)}
										className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm bg-surface-dark border border-border-dark text-white rounded-lg focus:outline-none focus:border-orange-500 w-full sm:w-auto"
								>
									<option value="all">{t('common.all')}</option>
									<option value="unread">{t('review.unread')}</option>
									<option value="read">{t('common.read')}</option>
								</select>
							</div>
						</div>
						</div>
					</CardContent>
				</Card>

			{/* Reviews List - Improved Compact Design */}
			{filteredReviews.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border-dark rounded-xl bg-surface-dark/50">
						<div className="p-4 rounded-full bg-surface-dark mb-4">
							<MessageSquare className="h-8 w-8 text-neutral-500" />
						</div>
						<h3 className="text-lg font-medium text-white mb-2">{t('review.noReviews')}</h3>
						<p className="text-neutral-500 mb-6 max-w-md">
							{t('review.noReviewsDesc')}
						</p>
						<Button
							onClick={() => {
								setFilterType('all')
								setFilterProject('all')
								setFilterRead('all')
							}}
							variant="outline"
							className="rounded-full"
						>
							{t('review.viewAll')}
						</Button>
					</div>
			) : (
				<div className="space-y-3">
					{filteredReviews.map((review) => {
						const isExpanded = expandedReviews.includes(review.id)
						const badge = getReviewTypeBadge(review.reviewType)
						const BadgeIcon = badge.icon

						return (
								<div
								key={review.id}
									className={`group bg-surface-dark border rounded-xl transition-all overflow-hidden cursor-pointer ${
									!review.isRead 
											? 'border-l-4 border-l-orange-500 hover:shadow-lg hover:shadow-orange-500/10' 
											: 'border-border-dark hover:border-neutral-700 hover:shadow-lg'
								}`}
									onClick={() => {
										toggleExpanded(review.id)
										if (!review.isRead) {
											markAsRead(review.id)
										}
									}}
							>
									{/* Compact Header - Always Visible */}
									<div className="p-4">
									<div className="flex items-start justify-between gap-4">
										<div className="flex-1 min-w-0">
											{/* Badges Row */}
											<div className="flex items-center gap-2 mb-2 flex-wrap">
												{/* Unread Indicator */}
												{!review.isRead && (
													<div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
												)}
												
												{/* Review Type Badge */}
													<span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
														review.reviewType === 'approved' ? 'bg-green-900/30 text-green-400 border border-green-500/20' :
														review.reviewType === 'rejected' ? 'bg-red-900/30 text-red-400 border border-red-500/20' :
														'bg-orange-900/30 text-orange-400 border border-orange-500/20'
													} flex items-center gap-1`}>
													<BadgeIcon className="h-3 w-3" />
													{badge.label}
												</span>

												{/* Project Badge */}
												{review.projectName && (
														<span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-neutral-800 text-neutral-300 flex items-center gap-1 border border-neutral-700">
														<FolderKanban className="h-3 w-3" />
														{review.projectName}
													</span>
												)}
											</div>

											{/* Title */}
												<h3 className="text-base font-bold text-white mb-1.5 group-hover:text-orange-500 transition-colors line-clamp-1">{review.workTitle}</h3>
											
											{/* Meta Info */}
												<div className="flex items-center gap-3 text-xs text-neutral-500 flex-wrap">
												<div className="flex items-center gap-1">
														<User className="h-3.5 w-3.5" />
														<span className="text-neutral-400">{review.reviewedBy}</span>
														{review.reviewedByDepartment && (
															<span className="text-neutral-600">• {review.reviewedByDepartment}</span>
														)}
												</div>
												<div className="flex items-center gap-1">
													<Clock className="h-3.5 w-3.5" />
												<span>{formatTimeAgo(typeof review.reviewedAt === 'string' ? new Date(review.reviewedAt) : review.reviewedAt)}</span>
												</div>
											</div>
										</div>

										{/* Expand Button */}
										<div className="flex items-center gap-2">
											<div
													className={`p-1.5 rounded-lg transition-all ${
													isExpanded 
														? 'bg-orange-500/20 text-orange-500' 
														: 'bg-surface-dark text-neutral-500 group-hover:text-white'
												}`}
											>
												{isExpanded ? (
													<ChevronUp className="h-4 w-4" />
												) : (
													<ChevronDown className="h-4 w-4" />
												)}
											</div>
										</div>
									</div>

									{/* Expanded Content - Detailed View */}
									{isExpanded && (
											<div className="space-y-4 pt-4 border-t border-border-dark mt-4 animate-in fade-in duration-200">
											{/* Work Details Section */}
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												{/* Left Column - Main Content */}
												<div className="space-y-4">
													{/* Original Work Description */}
													<div>
															<h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-2">
																<FileText className="h-3.5 w-3.5" />
																{t('review.originalSubmission')}
														</h4>
															<div className="text-sm text-neutral-300 bg-neutral-900/50 p-4 rounded-lg border border-border-dark">
															<p className="leading-relaxed whitespace-pre-wrap">{review.workDescription}</p>
														</div>
													</div>

													{/* Review Feedback */}
													<div>
															<h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-2">
																<MessageSquare className="h-3.5 w-3.5" />
																{t('review.feedback')}
														</h4>
															<div className={`p-4 rounded-lg border-l-4 ${
															review.reviewType === 'approved' 
																	? 'bg-green-500/10 border-l-green-500' 
																: review.reviewType === 'rejected'
																	? 'bg-red-500/10 border-l-red-500'
																	: 'bg-orange-500/10 border-l-orange-500'
														}`}>
																<p className="text-sm text-white whitespace-pre-wrap leading-relaxed">
																{review.reviewComments}
															</p>
														</div>
													</div>
												</div>

												{/* Right Column - Metadata & Attachments */}
												<div className="space-y-4">
													{/* Metadata Grid */}
													<div>
															<h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-2">
																<Tag className="h-3.5 w-3.5" />
																상세 정보
														</h4>
														<div className="space-y-3">
															{/* Date & Time */}
															<div className="bg-neutral-900/50 p-3 rounded-lg border border-border-dark">
																<div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
																	<Calendar className="h-3.5 w-3.5" />
																	검토 완료 일시
																</div>
																<div className="text-sm text-white font-medium">
																	{(typeof review.reviewedAt === 'string' ? new Date(review.reviewedAt) : review.reviewedAt).toLocaleString('ko-KR', {
																		year: 'numeric',
																		month: 'long',
																		day: 'numeric',
																		hour: '2-digit',
																		minute: '2-digit'
																	})}
																</div>
															</div>

															{/* Priority */}
															{review.priority && (
																<div className="bg-neutral-900/50 p-3 rounded-lg border border-border-dark">
																	<div className="flex items-center justify-between">
																		<span className="text-xs text-neutral-500">우선순위</span>
																		<span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
																			review.priority === 'high' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
																			review.priority === 'medium' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
																			'bg-blue-500/10 text-blue-400 border-blue-500/20'
																		}`}>
																			{t(`common.priorities.${review.priority}`) || review.priority}
																		</span>
																	</div>
																</div>
															)}
															
															{/* Category */}
															{review.category && (
																<div className="bg-neutral-900/50 p-3 rounded-lg border border-border-dark">
																	<div className="flex items-center justify-between">
																		<span className="text-xs text-neutral-500">카테고리</span>
																		<span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700 font-medium">
																			{review.category}
																		</span>
																	</div>
																</div>
															)}

															{/* Confidential */}
															{review.isConfidential && (
																<div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
																	<div className="flex items-center gap-2 text-amber-400">
																		<Shield className="h-4 w-4" />
																		<span className="text-xs font-medium">{t('input.confidential')}</span>
																	</div>
																</div>
															)}
														</div>
													</div>

													{/* Tags */}
													{review.tags && review.tags.length > 0 && (
														<div>
																<h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-2">
																	<Tag className="h-3.5 w-3.5" />
																	태그
															</h4>
															<div className="flex flex-wrap gap-2">
																{review.tags.map(tag => (
																	<span key={tag} className="text-xs flex items-center gap-1 text-neutral-300 bg-neutral-800/50 px-2.5 py-1 rounded-full border border-neutral-700 hover:border-orange-500/50 transition-colors">
																		<Tag className="h-3 w-3" />
																		{tag}
																	</span>
																))}
															</div>
														</div>
													)}

													{/* Files & Links */}
													{((review.files && review.files.length > 0) || (review.links && review.links.length > 0)) && (
														<div className="space-y-3">
															{review.files && review.files.length > 0 && (
																<div>
																	<h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-2">
																		<Paperclip className="h-3.5 w-3.5" />
																		{t('common.attachments')} ({review.files.length})
																	</h4>
																	<div className="space-y-2">
																		{review.files.map((file, idx) => (
																			<div key={idx} className="flex items-center gap-2 text-xs text-neutral-300 bg-neutral-900/50 p-2.5 rounded-lg border border-border-dark hover:border-orange-500/50 transition-colors">
																				<FileText className="h-4 w-4 text-neutral-500 flex-shrink-0" />
																				<span className="truncate flex-1">{file.name}</span>
																				<span className="text-neutral-600 text-[10px]">
																					{(file.size / 1024).toFixed(1)}KB
																				</span>
																			</div>
																		))}
																	</div>
																</div>
															)}
															{review.links && review.links.length > 0 && (
																<div>
																	<h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-2">
																		<LinkIcon className="h-3.5 w-3.5" />
																		{t('common.links')} ({review.links.length})
																	</h4>
																	<div className="space-y-2">
																		{review.links.map((link, idx) => (
																			<a 
																				key={idx} 
																				href={link.url}
																				target="_blank"
																				rel="noopener noreferrer"
																				onClick={(e) => e.stopPropagation()}
																				className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 bg-neutral-900/50 p-2.5 rounded-lg border border-border-dark hover:border-blue-500/50 transition-colors group"
																			>
																				<LinkIcon className="h-4 w-4 flex-shrink-0" />
																				<span className="truncate flex-1 group-hover:underline">{link.title}</span>
																				<svg className="h-3 w-3 text-neutral-600 group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
																					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
																				</svg>
																			</a>
																		))}
																	</div>
																</div>
															)}
														</div>
													)}
												</div>
											</div>

											{/* Action Buttons */}
											<div className="flex items-center gap-3 pt-4 border-t border-border-dark">
												{review.reviewType === 'changes_requested' && (
													<Button
														onClick={(e) => {
															e.stopPropagation()
															navigate('/app/input')
															toast.info('업무 수정 페이지로 이동합니다...')
														}}
															variant="brand"
															className="flex items-center gap-2 h-9"
													>
														<FileText className="h-4 w-4" />
														{t('review.updateWork')}
													</Button>
												)}
												{review.reviewType === 'rejected' && (
													<Button
														onClick={(e) => {
															e.stopPropagation()
															navigate('/app/input')
															toast.info('업무 재제출 페이지로 이동합니다...')
														}}
															variant="primary"
															className="flex items-center gap-2 h-9"
													>
														<FileText className="h-4 w-4" />
														{t('review.resubmit')}
													</Button>
												)}
												<Button
													variant="outline"
													onClick={(e) => {
														e.stopPropagation()
														navigate('/app/work-history')
													}}
														className="h-9"
												>
													{t('review.viewHistory')}
												</Button>
											</div>
										</div>
									)}
								</div>
							</div>
						)
					})}
				</div>
			)}
				</div>
			)}
				</div>
			</div>
		</div>
	)
}
