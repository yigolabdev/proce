import { storage } from '../../utils/storage'
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { PageHeader } from '../../components/common/PageHeader'
import { EmptyState } from '../../components/common/EmptyState'
import { LoadingState } from '../../components/common/LoadingState'
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts'
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
} from 'lucide-react'
import { toast } from 'sonner'
import Toaster from '../../components/ui/Toaster'

// Review/Comment received by the current user
interface ReceivedReview {
	id: string
	workEntryId: string
	workTitle: string
	workDescription: string
	projectId?: string
	projectName?: string
	reviewType: 'approved' | 'rejected' | 'changes_requested'
	reviewedBy: string
	reviewedByDepartment?: string
	reviewedAt: Date
	reviewComments: string
	isRead: boolean
}

export default function WorkReviewPage() {
	const navigate = useNavigate()
	
	// State
	const [reviews, setReviews] = useState<ReceivedReview[]>([])
	const [filteredReviews, setFilteredReviews] = useState<ReceivedReview[]>([])
	const [loading, setLoading] = useState(true)
	const [filterType, setFilterType] = useState<string>('all')
	const [filterProject, setFilterProject] = useState<string>('all')
	const [filterRead, setFilterRead] = useState<string>('all')
	const [expandedReviews, setExpandedReviews] = useState<string[]>([])
	const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([])

	// Keyboard shortcuts
	useKeyboardShortcuts({
		goToDashboard: () => navigate('/app/dashboard'),
		newWork: () => navigate('/app/input'),
	})

	// Load data
	useEffect(() => {
		loadData()
	}, [])

	const loadData = async () => {
		setLoading(true)
		try {
			// Load projects
			const savedProjects = storage.get<any[]>('projects')
			if (savedProjects && savedProjects.length > 0) {
				setProjects(savedProjects.map((p: any) => ({ id: p.id, name: p.name })))
			} else {
				const mockProjects = [
					{ id: 'proj-1', name: 'Website Redesign' },
					{ id: 'proj-2', name: 'Mobile App Development' },
					{ id: 'proj-3', name: 'API Integration' },
				]
				setProjects(mockProjects)
			}

			// Load received reviews
			const savedReviews = storage.get<any[]>('received_reviews')
			if (savedReviews && savedReviews.length > 0) {
				const reviewsWithDates = savedReviews.map((review: any) => ({
					...review,
					reviewedAt: new Date(review.reviewedAt),
				}))
				setReviews(reviewsWithDates)
			} else {
				// Mock received reviews
				const mockReviews: ReceivedReview[] = [
					{
						id: 'review-1',
						workEntryId: 'work-1',
						workTitle: 'Implemented User Authentication System',
						workDescription: 'Completed the comprehensive user authentication module with JWT tokens, social login, and security features.',
						projectId: 'proj-2',
						projectName: 'Mobile App Development',
						reviewType: 'approved',
						reviewedBy: 'Sarah Chen (Tech Lead)',
						reviewedByDepartment: 'Engineering',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
						reviewComments: 'Excellent work! 🎉 The authentication implementation is solid and follows all security best practices. The code is clean, well-tested, and properly documented. Great job on:\n\n✅ Comprehensive test coverage\n✅ Security considerations (password hashing, CSRF protection)\n✅ Clear API documentation\n✅ Proper error handling\n\nApproved for production deployment!',
						isRead: false,
					},
					{
						id: 'review-2',
						workEntryId: 'work-2',
						workTitle: 'Dashboard Redesign',
						workDescription: 'Updated the main dashboard with a new layout and dark mode support.',
						projectId: 'proj-1',
						projectName: 'Website Redesign',
						reviewType: 'changes_requested',
						reviewedBy: 'Mike Johnson (Design Lead)',
						reviewedByDepartment: 'Design',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
						reviewComments: 'Good progress on the dashboard redesign! The new layout is much better. However, I have a few suggestions before we can approve:\n\n📝 Changes Requested:\n1. The color contrast on dark mode needs improvement for accessibility (WCAG AA compliance)\n2. Mobile responsiveness has some issues on tablets (768px - 1024px)\n3. Loading states are missing for async data\n4. Please add hover states for interactive elements\n\nPlease address these points and resubmit. Happy to review again once updated!',
						isRead: false,
					},
					{
						id: 'review-3',
						workEntryId: 'work-3',
						workTitle: 'Payment Gateway Integration',
						workDescription: 'Integrated Stripe payment gateway with webhook handlers.',
						projectId: 'proj-3',
						projectName: 'API Integration',
						reviewType: 'approved',
						reviewedBy: 'Emily Davis (CTO)',
						reviewedByDepartment: 'Engineering',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
						reviewComments: 'Outstanding work on the Stripe integration! 🚀\n\nThe implementation is production-ready:\n✅ Secure API key management\n✅ Proper webhook verification\n✅ Comprehensive error handling\n✅ Transaction logging\n✅ Refund functionality\n\nThe code review found no issues. Approved!',
						isRead: true,
					},
					{
						id: 'review-4',
						workEntryId: 'work-4',
						workTitle: 'Fixed Payment Bug',
						workDescription: 'Fixed the issue where payments were failing for certain card types.',
						projectId: 'proj-3',
						projectName: 'API Integration',
						reviewType: 'rejected',
						reviewedBy: 'David Lee (Senior Engineer)',
						reviewedByDepartment: 'Engineering',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
						reviewComments: '❌ Unable to approve this submission due to insufficient information.\n\nRequired Information Missing:\n1. What was the root cause of the bug?\n2. Which card types were affected?\n3. How did you test the fix?\n4. Are there unit tests covering this case?\n5. Was this deployed to staging and verified?\n\nPlease provide:\n- Detailed description of the issue and fix\n- Test results showing the bug is resolved\n- Links to relevant PRs or commits\n- Before/after behavior documentation\n\nPlease resubmit with complete information.',
						isRead: true,
					},
					{
						id: 'review-5',
						workEntryId: 'work-5',
						workTitle: 'Mobile App Performance Optimization',
						workDescription: 'Optimized app startup time and reduced memory usage.',
						projectId: 'proj-2',
						projectName: 'Mobile App Development',
						reviewType: 'approved',
						reviewedBy: 'Alex Kim (Mobile Lead)',
						reviewedByDepartment: 'Engineering',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
						reviewComments: 'Impressive performance improvements! 📈\n\n**Results:**\n• App startup time: 4.5s → 1.8s (60% improvement) ✅\n• Memory usage: -45% ✅\n• Bundle size: -67% ✅\n\n**Code Quality:**\n✅ Proper use of React.memo and useMemo\n✅ Code splitting implemented correctly\n✅ Image optimization working well\n✅ Memory leaks fixed\n\nThis will significantly improve user experience. Great work! Approved.',
						isRead: true,
					},
					{
						id: 'review-6',
						workEntryId: 'work-6',
						workTitle: 'API Documentation Update',
						workDescription: 'Updated REST API documentation for v2.0.',
						projectId: 'proj-3',
						projectName: 'API Integration',
						reviewType: 'changes_requested',
						reviewedBy: 'Rachel Green (Product Manager)',
						reviewedByDepartment: 'Product',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
						reviewComments: 'Thanks for updating the API docs! The content is good but needs some improvements:\n\n📝 Requested Changes:\n1. Add more code examples (especially for authentication)\n2. Include common error responses and how to handle them\n3. Add rate limiting information\n4. Include SDKs/client libraries section\n5. Add a "Getting Started" quick guide\n\nAlso, please have the technical writing team review for consistency.\n\nLet me know when you\'ve made these updates!',
						isRead: true,
					},
					{
						id: 'review-7',
						workEntryId: 'work-7',
						workTitle: 'Security Audit Report',
						workDescription: 'Conducted comprehensive security audit of the application.',
						projectId: 'proj-3',
						projectName: 'API Integration',
						reviewType: 'approved',
						reviewedBy: 'Tom Wilson (Security Lead)',
						reviewedByDepartment: 'Security',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
						reviewComments: 'Thorough and professional security audit! 🔒\n\n**Findings Summary:**\n• Critical: 0 ✅\n• High: 2 (both fixed) ✅\n• Medium: 5 (4 fixed, 1 scheduled) ✅\n• Low: 12 (documented) ✅\n\n**Compliance:**\n✅ OWASP Top 10 addressed\n✅ SOC 2 requirements met\n✅ GDPR compliance verified\n\nAll critical issues have been resolved. The remediation plan is clear and actionable. Approved!',
						isRead: true,
					},
					{
						id: 'review-8',
						workEntryId: 'work-8',
						workTitle: 'Weekly Team Meeting',
						workDescription: 'Attended weekly engineering team standup.',
						projectId: 'proj-2',
						projectName: 'Mobile App Development',
						reviewType: 'rejected',
						reviewedBy: 'Sarah Chen (Tech Lead)',
						reviewedByDepartment: 'Engineering',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
						reviewComments: '❌ This submission needs more detail to be approved.\n\nFor meeting submissions, please include:\n1. Meeting agenda/topics discussed\n2. Key decisions made\n3. Your contributions to the discussion\n4. Action items assigned to you\n5. Any blockers or concerns raised\n\nA simple "attended meeting" entry doesn\'t provide enough context for review. Please update with meaningful details.',
						isRead: true,
					},
				]
				setReviews(mockReviews)
			}
		} catch (error) {
			console.error('Failed to load data:', error)
			toast.error('Failed to load reviews')
		} finally {
			setLoading(false)
		}
	}

	// Filter reviews
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
		filtered.sort((a, b) => b.reviewedAt.getTime() - a.reviewedAt.getTime())

		setFilteredReviews(filtered)
	}, [reviews, filterType, filterProject, filterRead])

	// Statistics
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

	// Mark review as read
	const markAsRead = (reviewId: string) => {
		setReviews(prev => {
			const updated = prev.map(r => 
				r.id === reviewId ? { ...r, isRead: true } : r
			)
			storage.set('received_reviews', updated)
			return updated
		})
	}

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
				return { label: 'Approved', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle2 }
			case 'rejected':
				return { label: 'Rejected', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: XCircle }
			case 'changes_requested':
				return { label: 'Changes Requested', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', icon: AlertCircle }
			default:
				return { label: 'Unknown', color: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400', icon: MessageSquare }
		}
	}

	// Format time ago
	const formatTimeAgo = (date: Date) => {
		const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
		
		if (seconds < 60) return 'Just now'
		if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
		if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
		if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
		return date.toLocaleDateString()
	}

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<LoadingState type="page" />
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
			<Toaster />
			
			<div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
				{/* Header */}
				<PageHeader
					title="Received Reviews"
					description="View and manage feedback on your work submissions"
					icon={MessageSquare}
				/>
				{/* Statistics */}
				<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
					<Card className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-400" />
								<div>
									<p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Reviews</p>
									<p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{statistics.total}</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<Mail className="h-8 w-8 text-purple-600 dark:text-purple-400" />
								<div>
									<p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Unread</p>
									<p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{statistics.unread}</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-linear-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<ThumbsUp className="h-8 w-8 text-green-600 dark:text-green-400" />
								<div>
									<p className="text-sm text-green-600 dark:text-green-400 font-medium">Approved</p>
									<p className="text-2xl font-bold text-green-900 dark:text-green-100">{statistics.approved}</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-linear-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<AlertCircle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
								<div>
									<p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Changes</p>
									<p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{statistics.changesRequested}</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-linear-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<ThumbsDown className="h-8 w-8 text-red-600 dark:text-red-400" />
								<div>
									<p className="text-sm text-red-600 dark:text-red-400 font-medium">Rejected</p>
									<p className="text-2xl font-bold text-red-900 dark:text-red-100">{statistics.rejected}</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Filters */}
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center gap-4 flex-wrap">
							<Filter className="h-4 w-4 text-neutral-500" />
							
							{/* Review Type Filter */}
							<div className="flex items-center gap-2">
								<span className="text-sm font-medium">Type:</span>
								<select
									value={filterType}
									onChange={(e) => setFilterType(e.target.value)}
									className="px-3 py-1.5 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary"
								>
									<option value="all">All Types</option>
									<option value="approved">Approved</option>
									<option value="changes_requested">Changes Requested</option>
									<option value="rejected">Rejected</option>
								</select>
							</div>

							{/* Project Filter */}
							<div className="flex items-center gap-2">
								<FolderKanban className="h-4 w-4 text-neutral-500" />
								<span className="text-sm font-medium">Project:</span>
								<select
									value={filterProject}
									onChange={(e) => setFilterProject(e.target.value)}
									className="px-3 py-1.5 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary"
								>
									<option value="all">All Projects</option>
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
								<span className="text-sm font-medium">Status:</span>
								<select
									value={filterRead}
									onChange={(e) => setFilterRead(e.target.value)}
									className="px-3 py-1.5 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary"
								>
									<option value="all">All</option>
									<option value="unread">Unread</option>
									<option value="read">Read</option>
								</select>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Reviews List */}
				{filteredReviews.length === 0 ? (
					<EmptyState
						icon={<MessageSquare className="h-12 w-12" />}
						title="No reviews found"
						description="You haven't received any reviews matching the selected filters."
						action={
							<Button
								onClick={() => {
									setFilterType('all')
									setFilterProject('all')
									setFilterRead('all')
								}}
							>
								View All Reviews
							</Button>
						}
					/>
				) : (
					<div className="space-y-4">
						{filteredReviews.map((review) => {
							const isExpanded = expandedReviews.includes(review.id)
							const badge = getReviewTypeBadge(review.reviewType)
							const BadgeIcon = badge.icon

							return (
								<Card
									key={review.id}
									className={`transition-all ${
										!review.isRead 
											? 'border-l-4 border-l-primary shadow-md' 
											: 'hover:shadow-md'
									}`}
								>
									<CardContent className="p-6">
										<div className="space-y-4">
											{/* Header */}
											<div className="flex items-start justify-between gap-4">
												<div className="flex-1 min-w-0">
													<div className="flex items-center gap-2 mb-2 flex-wrap">
														{/* Unread Badge */}
														{!review.isRead && (
															<span className="text-xs font-bold px-2 py-1 rounded-full bg-primary text-white">
																NEW
															</span>
														)}
														
														{/* Review Type Badge */}
														<span className={`text-xs font-medium px-2 py-1 rounded-full ${badge.color} flex items-center gap-1`}>
															<BadgeIcon className="h-3 w-3" />
															{badge.label}
														</span>

														{/* Project Badge */}
														{review.projectName && (
															<span className="text-xs text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded flex items-center gap-1">
																<FolderKanban className="h-3 w-3" />
																{review.projectName}
															</span>
														)}
													</div>

													<h3 className="text-lg font-bold mb-1">{review.workTitle}</h3>
													
													<div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400 flex-wrap">
														<div className="flex items-center gap-1.5">
															<User className="h-4 w-4" />
															<span>
																{review.reviewedBy}
																{review.reviewedByDepartment && (
																	<span className="text-neutral-500"> • {review.reviewedByDepartment}</span>
																)}
															</span>
														</div>
														<div className="flex items-center gap-1.5">
															<Clock className="h-4 w-4" />
															<span>{formatTimeAgo(review.reviewedAt)}</span>
														</div>
														<div className="flex items-center gap-1.5">
															<Calendar className="h-4 w-4" />
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
													className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors shrink-0"
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
												<div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
													{/* Original Work Description */}
													<div>
														<h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
															<FileText className="h-4 w-4" />
															Original Work Submission:
														</h4>
														<p className="text-sm text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-lg">
															{review.workDescription}
														</p>
													</div>

													{/* Review Comments */}
													<div>
														<h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
															<MessageSquare className="h-4 w-4" />
															Review Comments:
														</h4>
														<div className={`p-4 rounded-lg border-l-4 ${
															review.reviewType === 'approved' 
																? 'bg-green-50 dark:bg-green-900/10 border-l-green-500' 
																: review.reviewType === 'rejected'
																? 'bg-red-50 dark:bg-red-900/10 border-l-red-500'
																: 'bg-orange-50 dark:bg-orange-900/10 border-l-orange-500'
														}`}>
															<p className="text-sm whitespace-pre-wrap">
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
																className="flex items-center gap-2"
															>
																<FileText className="h-4 w-4" />
																Update Work
															</Button>
														)}
														{review.reviewType === 'rejected' && (
															<Button
																onClick={() => {
																	navigate('/app/input')
																	toast.info('Redirecting to resubmit...')
																}}
																className="flex items-center gap-2"
															>
																<FileText className="h-4 w-4" />
																Resubmit Work
															</Button>
														)}
														<Button
															variant="outline"
															onClick={() => {
																navigate('/app/work-history')
															}}
														>
															View Work History
														</Button>
													</div>
												</div>
											)}
										</div>
									</CardContent>
								</Card>
							)
						})}
					</div>
				)}
			</div>
		</div>
	)
}
