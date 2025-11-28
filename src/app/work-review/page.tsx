import { storage } from '../../utils/storage'
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { PageHeader } from '../../components/common/PageHeader'
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

// Review pending for the current user (as a reviewer)
interface PendingReview {
	id: string
	workEntryId: string
	workTitle: string
	workDescription: string
	projectId: string
	projectName: string
	submittedBy: string
	submittedById?: string
	submittedByDepartment?: string
	reviewerId: string
	status: 'pending'
	submittedAt: Date | string
}

export default function WorkReviewPage() {
	const navigate = useNavigate()
	
	// State
	const [activeTab, setActiveTab] = useState<'pending' | 'received'>('pending')
	const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([])
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
					{ id: 'proj-4', name: 'Data Analytics Platform' },
					{ id: 'proj-5', name: 'Customer Portal V2' },
					{ id: 'proj-6', name: 'Infrastructure Modernization' },
					{ id: 'proj-7', name: 'Marketing Automation' },
					{ id: 'proj-8', name: 'AI/ML Pipeline' },
				]
				setProjects(mockProjects)
			}

			// Load pending reviews (To Review)
			const savedPending = storage.get<any[]>('pending_reviews')
			if (savedPending && savedPending.length > 0) {
				setPendingReviews(savedPending)
			} else {
				// Mock pending reviews
				setPendingReviews([
					{
						id: 'pending-1',
						workEntryId: 'work-new-1',
						workTitle: 'New Feature Implementation',
						workDescription: 'Implemented the new dashboard widget system.',
						projectId: 'proj-1',
						projectName: 'Website Redesign',
						submittedBy: 'John Doe',
						submittedById: 'user-1',
						submittedByDepartment: 'Engineering',
						reviewerId: 'current-user',
						status: 'pending',
						submittedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
					},
					{
						id: 'pending-2',
						workEntryId: 'work-new-2',
						workTitle: 'Data Pipeline Fix',
						workDescription: 'Fixed the data ingestion issue in the ETL pipeline.',
						projectId: 'proj-4',
						projectName: 'Data Analytics Platform',
						submittedBy: 'Alice Smith',
						submittedById: 'user-2',
						submittedByDepartment: 'Engineering',
						reviewerId: 'current-user',
						status: 'pending',
						submittedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString()
					},
					{
						id: 'pending-3',
						workEntryId: 'work-new-3',
						workTitle: 'Security Audit Report',
						workDescription: 'Completed the quarterly security audit report.',
						projectId: 'proj-6',
						projectName: 'Infrastructure Modernization',
						submittedBy: 'Bob Jones',
						submittedById: 'user-3',
						submittedByDepartment: 'Security',
						reviewerId: 'current-user',
						status: 'pending',
						submittedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString()
					}
				])
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
				// Mock received reviews - Enhanced dataset
				const mockReviews: ReceivedReview[] = [
					{
						id: 'review-1',
						workEntryId: 'work-1',
						workTitle: 'Implemented User Authentication System',
						workDescription: 'Completed the comprehensive user authentication module with JWT tokens, OAuth 2.0 integration, multi-factor authentication, and advanced security features including rate limiting and session management.',
						projectId: 'proj-2',
						projectName: 'Mobile App Development',
						reviewType: 'approved',
						reviewedBy: 'Sarah Chen (Tech Lead)',
						reviewedByDepartment: 'Engineering',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
						reviewComments: 'Excellent work! 🎉 The authentication implementation is exceptional and follows all security best practices. The code is clean, well-tested, and properly documented.\n\n✅ **Strengths:**\n• Comprehensive test coverage (98%)\n• Advanced security (password hashing, CSRF, XSS protection)\n• Clear API documentation with examples\n• Proper error handling and user feedback\n• OAuth integration (Google, GitHub, LinkedIn)\n• MFA support with backup codes\n• Session management and token refresh\n\n**Performance Metrics:**\n• Login time: 340ms (excellent)\n• Token validation: 12ms (excellent)\n• Memory usage: +2.3MB (acceptable)\n\nApproved for production deployment! This sets a high standard for the team.',
						isRead: false,
					},
					{
						id: 'review-2',
						workEntryId: 'work-2',
						workTitle: 'Dashboard UI/UX Redesign',
						workDescription: 'Updated the main dashboard with a modern layout, improved data visualization, dark mode support, and responsive design for mobile/tablet devices.',
						projectId: 'proj-1',
						projectName: 'Website Redesign',
						reviewType: 'changes_requested',
						reviewedBy: 'Mike Johnson (Design Lead)',
						reviewedByDepartment: 'Design',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
						reviewComments: 'Good progress on the dashboard redesign! The new layout is much cleaner and more intuitive. However, I have a few important suggestions before we can approve:\n\n📝 **Changes Requested:**\n\n1. **Accessibility Issues (High Priority)**\n   - Color contrast in dark mode needs improvement (currently 3.2:1, need 4.5:1 for WCAG AA)\n   - Missing ARIA labels on interactive elements\n   - Keyboard navigation issues on the chart filters\n\n2. **Responsive Design (Medium Priority)**\n   - Tablet view (768px - 1024px) has layout breaking issues\n   - Charts overflow on mobile landscape mode\n   - Sidebar toggle doesn\'t work on iPad\n\n3. **Loading States (Medium Priority)**\n   - Add skeleton screens for async data\n   - Loading spinners need positioning fix\n   - Empty states need better messaging\n\n4. **Interaction Polish (Low Priority)**\n   - Add hover states for all interactive elements\n   - Smooth transitions on data updates\n   - Tooltip positioning issues on charts\n\nPlease address the High and Medium priority items and resubmit. Happy to review again once updated!',
						isRead: false,
					},
					{
						id: 'review-3',
						workEntryId: 'work-3',
						workTitle: 'API Optimization',
						workDescription: 'Optimized database queries for the reporting API endpoint, reducing response time by 40%.',
						projectId: 'proj-3',
						projectName: 'API Integration',
						reviewType: 'approved',
						reviewedBy: 'David Kim (Senior Dev)',
						reviewedByDepartment: 'Engineering',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
						reviewComments: 'Great job on the query optimization! The response times are much better now.',
						isRead: true,
					},
					{
						id: 'review-4',
						workEntryId: 'work-4',
						workTitle: 'Marketing Landing Page',
						workDescription: 'Created the new landing page for the Q4 marketing campaign with A/B testing support.',
						projectId: 'proj-7',
						projectName: 'Marketing Automation',
						reviewType: 'approved',
						reviewedBy: 'Sarah Lee (Marketing Lead)',
						reviewedByDepartment: 'Marketing',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
						reviewComments: 'Love the new design! It looks fantastic and the A/B testing setup is exactly what we needed.',
						isRead: true,
					},
					{
						id: 'review-5',
						workEntryId: 'work-5',
						workTitle: 'Customer Portal Analytics',
						workDescription: 'Implemented the analytics dashboard for the customer portal.',
						projectId: 'proj-5',
						projectName: 'Customer Portal V2',
						reviewType: 'rejected',
						reviewedBy: 'James Park (Product Manager)',
						reviewedByDepartment: 'Product',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
						reviewComments: 'The analytics are not accurate. Please double check the data aggregation logic.',
						isRead: true,
					},
					{
						id: 'review-6',
						workEntryId: 'work-6',
						workTitle: 'Internal Tools Update',
						workDescription: 'Updated the internal admin tools with new user management features.',
						projectId: 'proj-6',
						projectName: 'Infrastructure Modernization',
						reviewType: 'changes_requested',
						reviewedBy: 'Alex Chen (DevOps)',
						reviewedByDepartment: 'Engineering',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 96),
						reviewComments: 'Please add audit logs for the user management actions.',
						isRead: true,
					}
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

	// Handle review action
	const handleReviewAction = (review: PendingReview, action: 'approve' | 'reject', comment: string) => {
		// 1. Remove from pending reviews
		const updatedPending = pendingReviews.filter(r => r.id !== review.id)
		setPendingReviews(updatedPending)
		storage.set('pending_reviews', updatedPending)

		// 2. Update WorkEntry status
		const workEntries = storage.get<any[]>('workEntries') || []
		const updatedEntries = workEntries.map(entry => 
			entry.id === review.workEntryId 
				? { ...entry, status: action === 'approve' ? 'approved' : 'rejected' }
				: entry
		)
		storage.set('workEntries', updatedEntries)

		// 3. Add to received reviews (Notify submitter)
		const receivedReviews = storage.get<any[]>('received_reviews') || []
		const newReceivedReview = {
			id: `review-${Date.now()}`,
			workEntryId: review.workEntryId,
			workTitle: review.workTitle,
			workDescription: review.workDescription,
			projectId: review.projectId,
			projectName: review.projectName,
			reviewType: action === 'approve' ? 'approved' : 'rejected',
			reviewedBy: 'Current User', // In real app, get from auth context
			reviewedByDepartment: 'Management',
			reviewedAt: new Date().toISOString(),
			reviewComments: comment || (action === 'approve' ? 'Approved.' : 'Rejected.'),
			isRead: false
		}
		storage.set('received_reviews', [newReceivedReview, ...receivedReviews])

		// 4. Send Message
		const messages = storage.get<any[]>('messages') || []
		messages.unshift({
			id: `msg-review-${Date.now()}`,
			type: 'notification',
			priority: 'normal',
			subject: `Work Review: ${action === 'approve' ? 'Approved' : 'Rejected'} - ${review.workTitle}`,
			from: 'Current User',
			fromDepartment: 'Management',
			preview: `Your work "${review.workTitle}" was ${action === 'approve' ? 'approved' : 'rejected'}`,
			content: `Your work submission "${review.workTitle}" has been ${action === 'approve' ? 'approved' : 'rejected'}.\n\n**Comments:**\n${comment}`,
			timestamp: new Date(),
			isRead: false,
			recipientId: review.submittedById,
			relatedType: 'work',
			relatedId: review.workEntryId
		})
		storage.set('messages', messages)

		toast.success(`Work ${action === 'approve' ? 'Approved' : 'Rejected'}`, {
			description: `Notification sent to ${review.submittedBy}`
		})
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
				title="Received Reviews"
				description="View and manage feedback on your work submissions"
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
						To Review ({pendingReviews.length})
					</button>
					<button
						onClick={() => setActiveTab('received')}
						className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
							activeTab === 'received'
								? 'border-orange-500 text-orange-500'
								: 'border-transparent text-neutral-500 hover:text-neutral-300'
						}`}
					>
						My Reviews ({reviews.length})
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
									<h3 className="text-lg font-medium text-white mb-2">All Caught Up!</h3>
									<p className="text-neutral-500 max-w-md">
										You have no pending reviews at the moment. Great job keeping up!
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
													<div className="bg-surface-dark p-4 rounded-lg text-sm text-neutral-300 border border-border-dark">
													{review.workDescription}
												</div>
											</div>
										</div>
											<div className="mt-6 pt-4 border-t border-border-dark flex gap-3">
											<Button 
												onClick={() => handleReviewAction(review, 'approve', '')}
												variant="primary"
												className="flex-1 h-10"
											>
												<CheckCircle2 className="mr-2 h-4 w-4" /> Approve
											</Button>
											<Button 
												onClick={() => handleReviewAction(review, 'reject', '')}
												variant="danger"
												className="flex-1 h-10"
											>
												<XCircle className="mr-2 h-4 w-4" /> Reject
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
										<p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Total</p>
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
										<p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Unread</p>
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
										<p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Approved</p>
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
										<p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Changes</p>
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
										<p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Rejected</p>
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
									<span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Type:</span>
								<select
									value={filterType}
									onChange={(e) => setFilterType(e.target.value)}
										className="px-3 py-1.5 text-sm bg-surface-dark border border-border-dark text-white rounded-lg focus:outline-none focus:border-orange-500"
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
									<span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Project:</span>
								<select
									value={filterProject}
									onChange={(e) => setFilterProject(e.target.value)}
										className="px-3 py-1.5 text-sm bg-surface-dark border border-border-dark text-white rounded-lg focus:outline-none focus:border-orange-500"
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
									<span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Status:</span>
								<select
									value={filterRead}
									onChange={(e) => setFilterRead(e.target.value)}
										className="px-3 py-1.5 text-sm bg-surface-dark border border-border-dark text-white rounded-lg focus:outline-none focus:border-orange-500"
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
						<div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border-dark rounded-xl bg-surface-dark/50">
							<div className="p-4 rounded-full bg-surface-dark mb-4">
								<MessageSquare className="h-8 w-8 text-neutral-500" />
							</div>
							<h3 className="text-lg font-medium text-white mb-2">No reviews found</h3>
							<p className="text-neutral-500 mb-6 max-w-md">
								You haven't received any reviews matching the selected filters.
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
								View All Reviews
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
																NEW
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
															<span>{formatTimeAgo(review.reviewedAt)}</span>
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
																Original Submission
														</h4>
															<p className="text-sm text-neutral-300 bg-surface-dark p-3 rounded-lg border border-border-dark">
															{review.workDescription}
														</p>
													</div>

													{/* Review Comments */}
													<div>
															<h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-2">
																<MessageSquare className="h-3 w-3" />
																Feedback
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
																Update Work
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
																Resubmit Work
															</Button>
														)}
														<Button
															variant="outline"
															onClick={() => {
																navigate('/app/work-history')
															}}
																className="h-9"
														>
															View Work History
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
