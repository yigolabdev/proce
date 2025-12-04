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
				return { label: t('common.statuses.approved'), color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle2 }
			case 'rejected':
				return { label: t('common.statuses.rejected'), color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: XCircle }
			case 'changes_requested':
				return { label: t('common.statuses.changesRequested'), color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', icon: AlertCircle }
			default:
				return { label: t('common.status'), color: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400', icon: MessageSquare }
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
		<div className="min-h-screen bg-neutral-50 dark:bg-background-dark text-neutral-900 dark:text-neutral-100">
			<Toaster />
			
			<div className="max-w-[1600px] mx-auto px-6 py-6 space-y-8">
			{/* Header */}
			<PageHeader
				title={t('review.title')}
				description={t('review.description')}
			/>
			
				<div className="space-y-6">
				{/* Tabs */}
					<div className="flex border-b border-border-dark mb-6">
					<button
						onClick={() => setActiveTab('pending')}
						className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
							activeTab === 'pending'
								? 'border-orange-500 text-orange-500'
								: 'border-transparent text-neutral-500 hover:text-neutral-300'
						}`}
					>
						{t('review.toReview')} ({pendingReviews.length})
					</button>
					<button
						onClick={() => setActiveTab('received')}
						className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
							activeTab === 'received'
								? 'border-orange-500 text-orange-500'
								: 'border-transparent text-neutral-500 hover:text-neutral-300'
						}`}
					>
						{t('review.myReviews')} ({reviews.length})
					</button>
				</div>

				{/* Pending Reviews (To Review) */}
				{activeTab === 'pending' && (
					<div className={pendingReviews.length === 0 ? "space-y-4" : "grid grid-cols-1 lg:grid-cols-2 gap-6"}>
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
						{/* Statistics */}
				<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
						<Card className="bg-surface-dark border-border-dark">
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
									<div className="p-2 bg-surface-dark rounded-lg text-blue-500">
										<MessageSquare className="h-6 w-6" />
									</div>
								<div>
										<p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">{t('review.total')}</p>
										<p className="text-xl font-bold text-white">{statistics.total}</p>
								</div>
							</div>
						</CardContent>
					</Card>

						<Card className="bg-surface-dark border-border-dark">
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
									<div className="p-2 bg-surface-dark rounded-lg text-purple-500">
										<Mail className="h-6 w-6" />
									</div>
								<div>
										<p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">{t('review.unread')}</p>
										<p className="text-xl font-bold text-white">{statistics.unread}</p>
								</div>
							</div>
						</CardContent>
					</Card>

						<Card className="bg-surface-dark border-border-dark">
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
									<div className="p-2 bg-surface-dark rounded-lg text-green-500">
										<ThumbsUp className="h-6 w-6" />
									</div>
								<div>
										<p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">{t('review.approved')}</p>
										<p className="text-xl font-bold text-white">{statistics.approved}</p>
								</div>
							</div>
						</CardContent>
					</Card>

						<Card className="bg-surface-dark border-border-dark">
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
									<div className="p-2 bg-surface-dark rounded-lg text-orange-500">
										<AlertCircle className="h-6 w-6" />
									</div>
								<div>
										<p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">{t('review.changes')}</p>
										<p className="text-xl font-bold text-white">{statistics.changesRequested}</p>
								</div>
							</div>
						</CardContent>
					</Card>

						<Card className="bg-surface-dark border-border-dark">
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
									<div className="p-2 bg-surface-dark rounded-lg text-red-500">
										<ThumbsDown className="h-6 w-6" />
									</div>
								<div>
										<p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">{t('review.rejected')}</p>
										<p className="text-xl font-bold text-white">{statistics.rejected}</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Filters */}
					<Card className="bg-surface-dark border-border-dark">
					<CardContent className="p-4">
						<div className="flex items-center gap-4 flex-wrap">
							<Filter className="h-4 w-4 text-neutral-500" />
							
							{/* Review Type Filter */}
							<div className="flex items-center gap-2">
									<span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{t('common.type')}</span>
								<select
									value={filterType}
									onChange={(e) => setFilterType(e.target.value)}
										className="px-3 py-1.5 text-sm bg-surface-dark border border-border-dark text-white rounded-lg focus:outline-none focus:border-orange-500"
								>
									<option value="all">{t('messages.allTypes')}</option>
									<option value="approved">{t('review.approved')}</option>
									<option value="changes_requested">{t('review.changes')}</option>
									<option value="rejected">{t('review.rejected')}</option>
								</select>
							</div>

							{/* Project Filter */}
							<div className="flex items-center gap-2">
								<FolderKanban className="h-4 w-4 text-neutral-500" />
									<span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{t('common.project')}</span>
								<select
									value={filterProject}
									onChange={(e) => setFilterProject(e.target.value)}
										className="px-3 py-1.5 text-sm bg-surface-dark border border-border-dark text-white rounded-lg focus:outline-none focus:border-orange-500"
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
							<div className="flex items-center gap-2">
								<Mail className="h-4 w-4 text-neutral-500" />
									<span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{t('common.status')}</span>
								<select
									value={filterRead}
									onChange={(e) => setFilterRead(e.target.value)}
										className="px-3 py-1.5 text-sm bg-surface-dark border border-border-dark text-white rounded-lg focus:outline-none focus:border-orange-500"
								>
									<option value="all">{t('common.all')}</option>
									<option value="unread">{t('review.unread')}</option>
									<option value="read">{t('common.read')}</option>
								</select>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Reviews List */}
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
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{filteredReviews.map((review) => {
							const isExpanded = expandedReviews.includes(review.id)
							const badge = getReviewTypeBadge(review.reviewType)
							const BadgeIcon = badge.icon

							return (
									<div
									key={review.id}
										className={`group bg-surface-dark border border-border-dark rounded-xl transition-all overflow-hidden ${
										!review.isRead 
												? 'border-l-4 border-l-orange-500' 
												: 'hover:border-neutral-700'
									}`}
								>
										<div className="p-6">
										<div className="space-y-4">
											{/* Header */}
											<div className="flex items-start justify-between gap-4">
												<div className="flex-1 min-w-0">
														<div className="flex items-center gap-2 mb-3 flex-wrap">
														{/* Unread Badge */}
														{!review.isRead && (
																<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500 text-white uppercase tracking-wider">
																{t('common.new')}
															</span>
														)}
														
														{/* Review Type Badge */}
															<span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
																review.reviewType === 'approved' ? 'bg-green-900/30 text-green-400' :
																review.reviewType === 'rejected' ? 'bg-red-900/30 text-red-400' :
																'bg-orange-900/30 text-orange-400'
															} flex items-center gap-1`}>
															<BadgeIcon className="h-3 w-3" />
															{badge.label}
														</span>

														{/* Project Badge */}
														{review.projectName && (
																<span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-neutral-800 text-neutral-300 flex items-center gap-1">
																<FolderKanban className="h-3 w-3" />
																{review.projectName}
															</span>
														)}
													</div>

														<h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-500 transition-colors">{review.workTitle}</h3>
													
														<div className="flex items-center gap-4 text-xs text-neutral-500 flex-wrap">
														<div className="flex items-center gap-1.5">
																<User className="h-3.5 w-3.5" />
																<span className="text-neutral-400">
																{review.reviewedBy}
																{review.reviewedByDepartment && (
																	<span className="text-neutral-500"> • {review.reviewedByDepartment}</span>
																)}
															</span>
														</div>
														<div className="flex items-center gap-1.5">
													<Clock className="h-3.5 w-3.5" />
												<span>{formatTimeAgo(typeof review.reviewedAt === 'string' ? new Date(review.reviewedAt) : review.reviewedAt)}</span>
														</div>
														<div className="flex items-center gap-1.5">
																<Calendar className="h-3.5 w-3.5" />
															<span>{review.reviewedAt.toLocaleString()}</span>
														</div>
													</div>
												</div>

												<button
													onClick={() => {
														toggleExpanded(review.id)
														if (!review.isRead) {
															markAsRead(review.id)
														}
													}}
														className="p-1 rounded-full hover:bg-surface-dark text-neutral-500 hover:text-white transition-colors"
												>
													{isExpanded ? (
														<ChevronUp className="h-5 w-5" />
													) : (
														<ChevronDown className="h-5 w-5" />
													)}
												</button>
											</div>

											{/* Expanded Content */}
											{isExpanded && (
													<div className="space-y-4 pt-4 border-t border-border-dark mt-4">
													{/* Original Work Description */}
													<div>
															<h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-2">
																<FileText className="h-3 w-3" />
																{t('review.originalSubmission')}
														</h4>
															<div className="text-sm text-neutral-300 bg-surface-dark p-4 rounded-lg border border-border-dark space-y-4">
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

													{/* Review Comments */}
													<div>
															<h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-2">
																<MessageSquare className="h-3 w-3" />
																{t('review.feedback')}
														</h4>
															<div className={`p-4 rounded-lg border-l-2 bg-surface-dark ${
															review.reviewType === 'approved' 
																	? 'border-l-green-500' 
																: review.reviewType === 'rejected'
																	? 'border-l-red-500'
																	: 'border-l-orange-500'
														}`}>
																<p className="text-sm text-white whitespace-pre-wrap leading-relaxed">
																{review.reviewComments}
															</p>
														</div>
													</div>

													{/* Actions */}
													<div className="flex items-center gap-3 pt-2">
														{review.reviewType === 'changes_requested' && (
															<Button
																onClick={() => {
																	navigate('/app/input')
																	toast.info('Redirecting to update your work...')
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
																onClick={() => {
																	navigate('/app/input')
																	toast.info('Redirecting to resubmit...')
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
															onClick={() => {
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
