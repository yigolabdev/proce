import { storage } from '../../utils/storage'
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/common/EmptyState'
import { LoadingState } from '../../components/common/LoadingState'
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts'
import {
	CheckCircle2,
	XCircle,
	Clock,
	Calendar,
	User,
	FileText,
	Tag,
	Upload,
	Link2,
	Eye,
	MessageSquare,
	AlertCircle,
	Filter,
	ChevronDown,
	ChevronUp,
	FolderKanban,
	Target,
	TrendingUp,
	Sparkles,
	ThumbsUp,
	ThumbsDown,
	Lightbulb,
	Mail,
} from 'lucide-react'
import { toast } from 'sonner'
import Toaster from '../../components/ui/Toaster'
import { evaluateWorkEntry, type AIEvaluation } from './_utils/aiEvaluator'
import { sendReviewMessage } from './_utils/messageIntegration'

interface WorkEntry {
	id: string
	title: string
	description: string
	category: string
	projectId?: string
	objectiveId?: string
	tags: string[]
	date: Date
	duration: string
	files: Array<{ id: string; name: string; size: number; type: string; url: string }>
	links: Array<{ id: string; url: string; title: string; addedAt: Date }>
	status: 'draft' | 'submitted' | 'pending_approval' | 'approved' | 'rejected'
	submittedBy?: string
	submittedAt?: Date
	reviewedBy?: string
	reviewedAt?: Date
	reviewComments?: string
}

export default function WorkReviewPage() {
	const navigate = useNavigate()
	
	// State
	const [entries, setEntries] = useState<WorkEntry[]>([])
	const [filteredEntries, setFilteredEntries] = useState<WorkEntry[]>([])
	const [selectedEntry, setSelectedEntry] = useState<WorkEntry | null>(null)
	const [aiEvaluation, setAiEvaluation] = useState<AIEvaluation | null>(null)
	const [reviewComment, setReviewComment] = useState('')
	const [sendToMessages, setSendToMessages] = useState(true)
	const [loading, setLoading] = useState(true)
	const [filterStatus, setFilterStatus] = useState<string>('pending_approval')
	const [filterProject, setFilterProject] = useState<string>('all')
	const [expandedEntries, setExpandedEntries] = useState<string[]>([])
	const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([])
	const [objectives, setObjectives] = useState<Array<{ id: string; title: string }>>([])

	// Keyboard shortcuts
	useKeyboardShortcuts({
		goToDashboard: () => navigate('/app/dashboard'),
		newWork: () => navigate('/app/input'),
	})

	// Categories
	const categories = [
		{ id: 'development', label: 'Development', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
		{ id: 'meeting', label: 'Meeting', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
		{ id: 'research', label: 'Research', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
		{ id: 'documentation', label: 'Documentation', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
		{ id: 'review', label: 'Review', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' },
		{ id: 'other', label: 'Other', color: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400' },
	]

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
				// Mock projects if none exist
				const mockProjects = [
					{ id: '1', name: 'Mobile App Redesign' },
					{ id: '2', name: 'Backend API Migration' },
					{ id: '3', name: 'Customer Dashboard v2' },
				]
				setProjects(mockProjects)
			}

			// Load objectives
			const mockObjectives = [
				{ id: '1', title: 'Increase Product Market Fit' },
				{ id: '2', title: 'Scale Revenue Growth' },
				{ id: '3', title: 'Enhance Team Productivity' },
			]
			setObjectives(mockObjectives)

			// Load work entries
			const saved = storage.get<any[]>('workEntries')
			if (saved && saved.length > 0) {
				const entriesWithDates = saved.map((entry: any) => ({
					...entry,
					date: new Date(entry.date),
					submittedAt: entry.submittedAt ? new Date(entry.submittedAt) : undefined,
					reviewedAt: entry.reviewedAt ? new Date(entry.reviewedAt) : undefined,
					links: entry.links?.map((link: any) => ({
						...link,
						addedAt: new Date(link.addedAt),
					})) || [],
				}))
				setEntries(entriesWithDates)
			} else {
				// Enhanced mock data for demonstration
				const mockEntries: WorkEntry[] = [
					// Pending Approval - High Quality
					{
						id: '1',
						title: 'Implemented User Authentication System',
						description: 'Completed the comprehensive user authentication module with JWT tokens and refresh token mechanism. The implementation includes:\n\n✅ Login with email/password\n✅ Social authentication (Google, GitHub)\n✅ Password reset flow with email verification\n✅ Token refresh mechanism\n✅ Session management\n✅ Rate limiting for security\n\nTested with 100+ test cases covering edge cases and security scenarios. All security best practices have been followed including password hashing with bcrypt, HTTPS-only cookies, and CSRF protection.',
						category: 'development',
						projectId: '2',
						objectiveId: '1',
						tags: ['authentication', 'security', 'backend', 'jwt', 'api'],
						date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
						duration: '6h 30m',
						files: [
							{ id: 'f1', name: 'auth-flow-diagram.png', size: 245000, type: 'image/png', url: '#' },
							{ id: 'f2', name: 'test-coverage-report.pdf', size: 128000, type: 'application/pdf', url: '#' },
							{ id: 'f3', name: 'api-documentation.md', size: 15000, type: 'text/markdown', url: '#' },
						],
						links: [
							{ id: 'l1', url: 'https://github.com/project/pull/123', title: 'Pull Request #123: Auth Implementation', addedAt: new Date() },
							{ id: 'l2', url: 'https://jira.company.com/AUTH-456', title: 'Jira Ticket AUTH-456', addedAt: new Date() },
						],
						status: 'pending_approval',
						submittedBy: 'John Doe',
						submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
					},
					// Pending Approval - Good Quality
					{
						id: '2',
						title: 'Redesigned Dashboard Layout',
						description: 'Updated the main dashboard with a new, more intuitive layout. Changes include:\n\n• Reorganized widget placement for better information hierarchy\n• Improved responsive design for mobile devices\n• Added customizable widget system\n• Implemented dark mode support\n\nUser testing showed 40% improvement in task completion time.',
						category: 'development',
						projectId: '3',
						objectiveId: '1',
						tags: ['ui', 'dashboard', 'react', 'frontend'],
						date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
						duration: '8h',
						files: [
							{ id: 'f4', name: 'dashboard-mockup.png', size: 450000, type: 'image/png', url: '#' },
							{ id: 'f5', name: 'user-testing-results.pdf', size: 320000, type: 'application/pdf', url: '#' },
						],
						links: [
							{ id: 'l3', url: 'https://figma.com/dashboard-redesign', title: 'Figma Design File', addedAt: new Date() },
						],
						status: 'pending_approval',
						submittedBy: 'Sarah Chen',
						submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
					},
					// Pending Approval - Needs Improvement
					{
						id: '3',
						title: 'Fixed payment gateway bug',
						description: 'Fixed the issue where payments were failing for certain card types.',
						category: 'development',
						projectId: '3',
						tags: ['bugfix', 'payment'],
						date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
						duration: '3h',
						files: [],
						links: [],
						status: 'pending_approval',
						submittedBy: 'Mike Johnson',
						submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
					},
					// Pending Approval - Meeting
					{
						id: '4',
						title: 'Q4 Planning Meeting',
						description: 'Attended quarterly planning meeting with the product team.\n\nKey Decisions:\n1. Prioritize mobile app performance improvements\n2. Postpone feature X to Q1 next year\n3. Increase QA team by 2 members\n\nAction Items:\n- Create detailed roadmap (assigned to me)\n- Schedule follow-up with stakeholders\n- Review budget allocation',
						category: 'meeting',
						projectId: '1',
						objectiveId: '2',
						tags: ['planning', 'quarterly', 'strategy'],
						date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
						duration: '2h',
						files: [
							{ id: 'f6', name: 'meeting-notes.pdf', size: 85000, type: 'application/pdf', url: '#' },
						],
						links: [
							{ id: 'l4', url: 'https://calendar.google.com/event/123', title: 'Calendar Event', addedAt: new Date() },
						],
						status: 'pending_approval',
						submittedBy: 'Emily Davis',
						submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
					},
					// Submitted - Awaiting Review Assignment
					{
						id: '5',
						title: 'Database Performance Optimization',
						description: 'Optimized slow-running queries in the analytics database:\n\n• Added indexes on frequently queried columns\n• Refactored N+1 queries to use batch loading\n• Implemented query caching for read-heavy operations\n• Set up query monitoring and alerting\n\nResults:\n- 70% reduction in average query time\n- 45% reduction in database CPU usage\n- Page load time improved from 3.2s to 1.1s',
						category: 'development',
						projectId: '2',
						objectiveId: '3',
						tags: ['database', 'performance', 'optimization', 'postgresql'],
						date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
						duration: '5h 30m',
						files: [
							{ id: 'f7', name: 'performance-metrics.png', size: 180000, type: 'image/png', url: '#' },
							{ id: 'f8', name: 'query-analysis.xlsx', size: 95000, type: 'application/vnd.ms-excel', url: '#' },
						],
						links: [
							{ id: 'l5', url: 'https://github.com/project/pull/145', title: 'Pull Request #145', addedAt: new Date() },
						],
						status: 'submitted',
						submittedBy: 'Alex Kim',
						submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
					},
					// Submitted - Simple Task
					{
						id: '6',
						title: 'Updated API documentation',
						description: 'Updated the REST API documentation to reflect recent endpoint changes.',
						category: 'documentation',
						projectId: '2',
						tags: ['documentation', 'api'],
						date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
						duration: '1h 30m',
						files: [],
						links: [
							{ id: 'l6', url: 'https://docs.company.com/api', title: 'API Documentation', addedAt: new Date() },
						],
						status: 'submitted',
						submittedBy: 'Lisa Park',
						submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 18),
					},
					// Approved - Recent
					{
						id: '7',
						title: 'Implemented Email Notification System',
						description: 'Built a comprehensive email notification system using SendGrid:\n\n✓ Transactional emails (password reset, verification)\n✓ Marketing emails (newsletters, announcements)\n✓ Email templates with company branding\n✓ Unsubscribe management\n✓ Email delivery tracking and analytics\n\nIntegrated with our user preferences system to respect notification settings.',
						category: 'development',
						projectId: '3',
						objectiveId: '1',
						tags: ['email', 'notifications', 'sendgrid', 'backend'],
						date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
						duration: '7h',
						files: [
							{ id: 'f9', name: 'email-templates.zip', size: 520000, type: 'application/zip', url: '#' },
						],
						links: [
							{ id: 'l7', url: 'https://github.com/project/pull/138', title: 'Pull Request #138', addedAt: new Date() },
						],
						status: 'approved',
						submittedBy: 'David Lee',
						submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
						reviewedBy: 'Tech Lead',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
						reviewComments: 'Excellent implementation! The code is clean, well-tested, and follows our best practices. Email templates look professional. Great work! 🎉',
					},
					// Approved
					{
						id: '8',
						title: 'Conducted User Research Interviews',
						description: 'Completed 15 user interviews to gather feedback on the new feature set.\n\nKey Findings:\n• 87% of users found the new workflow intuitive\n• Top requested feature: bulk actions\n• Pain point: mobile app is slow on older devices\n\nRecommendations:\n1. Implement bulk actions in next sprint\n2. Optimize mobile performance\n3. Add onboarding tutorial',
						category: 'research',
						projectId: '1',
						objectiveId: '1',
						tags: ['user-research', 'interviews', 'ux'],
						date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
						duration: '12h',
						files: [
							{ id: 'f10', name: 'research-findings.pdf', size: 780000, type: 'application/pdf', url: '#' },
							{ id: 'f11', name: 'interview-recordings.zip', size: 3500000, type: 'application/zip', url: '#' },
						],
						links: [],
						status: 'approved',
						submittedBy: 'Rachel Green',
						submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
						reviewedBy: 'Product Manager',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
						reviewComments: 'Very thorough research! The findings are actionable and well-documented. This will be very valuable for our product roadmap. Approved.',
					},
					// Rejected - Needs Rework
					{
						id: '9',
						title: 'Mobile App Icon Update',
						description: 'Updated app icon.',
						category: 'development',
						projectId: '1',
						tags: ['mobile', 'design'],
						date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
						duration: '30m',
						files: [],
						links: [],
						status: 'rejected',
						submittedBy: 'Tom Wilson',
						submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
						reviewedBy: 'Design Lead',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
						reviewComments: 'Please provide more details:\n\n1. Where are the icon files?\n2. Did you test on both iOS and Android?\n3. What sizes did you create?\n4. Did this go through design review?\n\nPlease attach the icon files and documentation, then resubmit.',
					},
					// Rejected - Quality Issues
					{
						id: '10',
						title: 'Code review',
						description: 'Reviewed code.',
						category: 'review',
						tags: ['code-review'],
						date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
						duration: '2h',
						files: [],
						links: [],
						status: 'rejected',
						submittedBy: 'Chris Brown',
						submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
						reviewedBy: 'Engineering Manager',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
						reviewComments: 'This submission lacks detail. For code reviews, please include:\n\n- Link to the PR you reviewed\n- Summary of what was reviewed\n- Key feedback provided\n- Any security or performance concerns found\n- Time spent on different aspects\n\nWithout this information, we cannot validate the work performed.',
					},
				]

				setEntries(mockEntries)
			}
		} catch (error) {
			console.error('Failed to load data:', error)
			toast.error('Failed to load work entries')
		} finally {
			setLoading(false)
		}
	}

	// Filter entries by status and project
	useEffect(() => {
		let filtered = [...entries]
		
		// Filter by status
		if (filterStatus !== 'all') {
			filtered = filtered.filter((entry) => entry.status === filterStatus)
		}
		
		// Filter by project
		if (filterProject !== 'all') {
			filtered = filtered.filter((entry) => entry.projectId === filterProject)
		}
		
		// Sort by submission date (newest first)
		filtered.sort((a, b) => {
			const dateA = a.submittedAt || a.date
			const dateB = b.submittedAt || b.date
			return dateB.getTime() - dateA.getTime()
		})
		
		setFilteredEntries(filtered)
	}, [entries, filterStatus, filterProject])

	// Statistics (filtered by project)
	const statistics = useMemo(() => {
		// Apply project filter to statistics
		const filteredByProject = filterProject === 'all' 
			? entries 
			: entries.filter(e => e.projectId === filterProject)
		
		const pendingCount = filteredByProject.filter(e => e.status === 'pending_approval').length
		const approvedCount = filteredByProject.filter(e => e.status === 'approved').length
		const rejectedCount = filteredByProject.filter(e => e.status === 'rejected').length
		const submittedCount = filteredByProject.filter(e => e.status === 'submitted').length
		
		return {
			pending: pendingCount,
			approved: approvedCount,
			rejected: rejectedCount,
			submitted: submittedCount,
			total: filteredByProject.length,
		}
	}, [entries, filterProject])

	// Handle approve
	const handleApprove = (entryId: string) => {
		const entry = entries.find(e => e.id === entryId)
		if (!entry) return

		const finalComment = reviewComment || 'Approved - Great work!'

		const updated = entries.map((e) =>
			e.id === entryId
				? {
						...e,
						status: 'approved' as const,
						reviewedBy: 'Current User', // TODO: Get from auth context
						reviewedAt: new Date(),
						reviewComments: finalComment,
				  }
				: e
		)

		setEntries(updated)
		storage.set('workEntries', updated)
		
		// Send notification to Messages if enabled
		if (sendToMessages) {
			sendReviewMessage({
				workEntryId: entry.id,
				workTitle: entry.title,
				reviewerName: 'Current User', // TODO: Get from auth context
				reviewAction: 'approved',
				comment: finalComment,
				recipientName: entry.submittedBy || 'Team Member',
			})
		}
		
		setSelectedEntry(null)
		setAiEvaluation(null)
		setReviewComment('')
		
		toast.success('Work entry approved!', {
			description: `"${entry.title}" has been approved ${sendToMessages ? 'and notification sent' : 'successfully'}`,
		})
	}

	// Handle reject
	const handleReject = (entryId: string) => {
		if (!reviewComment.trim()) {
			toast.error('Please provide a reason for rejection')
			return
		}

		const entry = entries.find(e => e.id === entryId)
		if (!entry) return

		const updated = entries.map((e) =>
			e.id === entryId
				? {
						...e,
						status: 'rejected' as const,
						reviewedBy: 'Current User', // TODO: Get from auth context
						reviewedAt: new Date(),
						reviewComments: reviewComment,
				  }
				: e
		)

		setEntries(updated)
		storage.set('workEntries', updated)
		
		// Send notification to Messages if enabled
		if (sendToMessages) {
			sendReviewMessage({
				workEntryId: entry.id,
				workTitle: entry.title,
				reviewerName: 'Current User', // TODO: Get from auth context
				reviewAction: 'rejected',
				comment: reviewComment,
				recipientName: entry.submittedBy || 'Team Member',
			})
		}
		
		setSelectedEntry(null)
		setAiEvaluation(null)
		setReviewComment('')
		
		toast.info('Work entry rejected', {
			description: `"${entry.title}" has been rejected ${sendToMessages ? 'and feedback sent' : 'with feedback'}`,
		})
	}

	// Handle request changes
	const handleRequestChanges = (entryId: string) => {
		if (!reviewComment.trim()) {
			toast.error('Please provide feedback for requested changes')
			return
		}

		const entry = entries.find(e => e.id === entryId)
		if (!entry) return

		const updated = entries.map((e) =>
			e.id === entryId
				? {
						...e,
						status: 'submitted' as const, // Back to submitted for revision
						reviewComments: reviewComment,
				  }
				: e
		)

		setEntries(updated)
		storage.set('workEntries', updated)
		
		// Send notification to Messages if enabled
		if (sendToMessages) {
			sendReviewMessage({
				workEntryId: entry.id,
				workTitle: entry.title,
				reviewerName: 'Current User', // TODO: Get from auth context
				reviewAction: 'changes_requested',
				comment: reviewComment,
				recipientName: entry.submittedBy || 'Team Member',
			})
		}
		
		setSelectedEntry(null)
		setAiEvaluation(null)
		setReviewComment('')
		
		toast.info('Changes requested', {
			description: `Feedback ${sendToMessages ? 'sent' : 'added'} for "${entry.title}"`,
		})
	}

	const toggleExpand = (id: string) => {
		setExpandedEntries((prev) =>
			prev.includes(id) ? prev.filter((entryId) => entryId !== id) : [...prev, id]
		)
	}

	const getCategoryColor = (categoryId: string) => {
		return categories.find((cat) => cat.id === categoryId)?.color || categories[0].color
	}

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return '0 Bytes'
		const k = 1024
		const sizes = ['Bytes', 'KB', 'MB', 'GB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
	}

	const formatDate = (date: Date) => {
		const now = new Date()
		const diff = now.getTime() - date.getTime()
		const days = Math.floor(diff / (1000 * 60 * 60 * 24))

		if (days === 0) return 'Today'
		if (days === 1) return 'Yesterday'
		if (days < 7) return `${days} days ago`
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
	}

	const getStatusBadge = (status: string) => {
		const badges = {
			pending_approval: {
				label: 'Pending Review',
				color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
				icon: Clock,
			},
			submitted: {
				label: 'Submitted',
				color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
				icon: FileText,
			},
			approved: {
				label: 'Approved',
				color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
				icon: CheckCircle2,
			},
			rejected: {
				label: 'Rejected',
				color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
				icon: XCircle,
			},
		}
		return badges[status as keyof typeof badges] || badges.submitted
	}

	if (loading) {
		return (
			<div className="space-y-6">
				<div>
					<h1 className="text-3xl font-bold flex items-center gap-3">
						<CheckCircle2 className="h-8 w-8 text-primary" />
						Work Review & Approval
					</h1>
					<p className="mt-2 text-neutral-600 dark:text-neutral-400">
						Review and approve team work submissions
					</p>
				</div>
				<LoadingState type="list" count={5} />
			</div>
		)
	}

	return (
		<>
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold flex items-center gap-3">
							<CheckCircle2 className="h-8 w-8 text-primary" />
							Work Review & Approval
						</h1>
						<p className="mt-2 text-neutral-600 dark:text-neutral-400">
							Review and approve team work submissions
						</p>
					</div>
				</div>

				{/* Statistics */}
				<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
					<Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-900/10 border-yellow-200 dark:border-yellow-800">
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xs text-yellow-700 dark:text-yellow-400 mb-1">Pending</p>
									<p className="text-2xl font-bold text-yellow-900 dark:text-yellow-300">{statistics.pending}</p>
								</div>
								<Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
							</div>
						</CardContent>
					</Card>

					<Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 border-blue-200 dark:border-blue-800">
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xs text-blue-700 dark:text-blue-400 mb-1">Submitted</p>
									<p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{statistics.submitted}</p>
								</div>
								<FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
							</div>
						</CardContent>
					</Card>

					<Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 border-green-200 dark:border-green-800">
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xs text-green-700 dark:text-green-400 mb-1">Approved</p>
									<p className="text-2xl font-bold text-green-900 dark:text-green-300">{statistics.approved}</p>
								</div>
								<CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
							</div>
						</CardContent>
					</Card>

					<Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 border-red-200 dark:border-red-800">
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xs text-red-700 dark:text-red-400 mb-1">Rejected</p>
									<p className="text-2xl font-bold text-red-900 dark:text-red-300">{statistics.rejected}</p>
								</div>
								<XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
							</div>
						</CardContent>
					</Card>

					<Card className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 border-neutral-200 dark:border-neutral-700">
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xs text-neutral-700 dark:text-neutral-400 mb-1">Total</p>
									<p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{statistics.total}</p>
								</div>
								<TrendingUp className="h-8 w-8 text-neutral-600 dark:text-neutral-400" />
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Filters */}
				<Card>
					<CardContent className="p-4">
						<div className="space-y-4">
							{/* Status Filter */}
							<div className="flex items-center gap-2 flex-wrap">
								<Filter className="h-4 w-4 text-neutral-500" />
								<span className="text-sm font-medium">Filter by Status:</span>
								<div className="flex gap-2 flex-wrap">
									{[
										{ value: 'all', label: 'All', count: statistics.total },
										{ value: 'pending_approval', label: 'Pending', count: statistics.pending },
										{ value: 'submitted', label: 'Submitted', count: statistics.submitted },
										{ value: 'approved', label: 'Approved', count: statistics.approved },
										{ value: 'rejected', label: 'Rejected', count: statistics.rejected },
									].map((filter) => (
										<button
											key={filter.value}
											onClick={() => setFilterStatus(filter.value)}
											className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
												filterStatus === filter.value
													? 'bg-primary text-white'
													: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
											}`}
										>
											{filter.label} ({filter.count})
										</button>
									))}
								</div>
							</div>

							{/* Project Filter */}
							<div className="flex items-center gap-2">
								<FolderKanban className="h-4 w-4 text-neutral-500" />
								<span className="text-sm font-medium">Filter by Project:</span>
								<select
									value={filterProject}
									onChange={(e) => setFilterProject(e.target.value)}
									className="flex-1 max-w-md px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary"
								>
									<option value="all">All Projects ({entries.length})</option>
									{projects.map((project) => {
										const projectCount = entries.filter(e => e.projectId === project.id).length
										return (
											<option key={project.id} value={project.id}>
												{project.name} ({projectCount})
											</option>
										)
									})}
								</select>
								{filterProject !== 'all' && (
									<button
										onClick={() => setFilterProject('all')}
										className="px-3 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
									>
										Clear
									</button>
								)}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Entries List */}
				{filteredEntries.length === 0 ? (
					<EmptyState
						icon={<CheckCircle2 className="h-12 w-12" />}
						title="No Work Entries to Review"
						description={
							filterStatus === 'pending_approval'
								? 'All work submissions have been reviewed'
								: `No entries with status: ${filterStatus.replace('_', ' ')}`
						}
					/>
				) : (
					<div className="space-y-4">
						{filteredEntries.map((entry) => {
							const isExpanded = expandedEntries.includes(entry.id)
							const StatusBadge = getStatusBadge(entry.status)

							return (
								<Card key={entry.id} className="hover:shadow-lg transition-shadow">
									<CardContent className="p-6">
										{/* Header */}
										<div className="flex items-start justify-between mb-4">
											<div className="flex-1">
												<div className="flex items-center gap-3 mb-2">
													<button
														onClick={() => toggleExpand(entry.id)}
														className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
													>
														{isExpanded ? (
															<ChevronUp className="h-5 w-5" />
														) : (
															<ChevronDown className="h-5 w-5" />
														)}
													</button>
													<h3 className="text-xl font-bold flex-1">{entry.title}</h3>
													<span className={`text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1 ${StatusBadge.color}`}>
														<StatusBadge.icon className="h-3 w-3" />
														{StatusBadge.label}
													</span>
													<span className={`text-xs font-medium px-3 py-1 rounded-full ${getCategoryColor(entry.category)}`}>
														{categories.find((c) => c.id === entry.category)?.label}
													</span>
												</div>
												<div className="flex items-center gap-4 ml-8 text-sm text-neutral-600 dark:text-neutral-400 flex-wrap">
													{entry.submittedBy && (
														<span className="flex items-center gap-1">
															<User className="h-4 w-4" />
															{entry.submittedBy}
														</span>
													)}
													<span className="flex items-center gap-1">
														<Calendar className="h-4 w-4" />
														{formatDate(entry.submittedAt || entry.date)}
													</span>
													{entry.duration && (
														<span className="flex items-center gap-1">
															<Clock className="h-4 w-4" />
															{entry.duration}
														</span>
													)}
													{entry.projectId && (
														<span className="flex items-center gap-1 text-xs px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-full">
															<FolderKanban className="h-3 w-3" />
															{projects.find((p) => p.id === entry.projectId)?.name || 'Project'}
														</span>
													)}
													{entry.objectiveId && (
														<span className="flex items-center gap-1 text-xs px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
															<Target className="h-3 w-3" />
															{objectives.find((o) => o.id === entry.objectiveId)?.title || 'Goal'}
														</span>
													)}
												</div>
											</div>
											{entry.status === 'pending_approval' && (
												<div className="flex items-center gap-2 ml-4">
													<Button
														variant="primary"
														size="sm"
														onClick={() => {
															setSelectedEntry(entry)
															// Generate AI evaluation
															const evaluation = evaluateWorkEntry(entry)
															setAiEvaluation(evaluation)
														}}
														className="flex items-center gap-2"
													>
														<Eye className="h-4 w-4" />
														Review
													</Button>
												</div>
											)}
										</div>

										{/* Preview */}
										{!isExpanded && (
											<div className="ml-8">
												<p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
													{entry.description}
												</p>
											</div>
										)}

										{/* Expanded Content */}
										{isExpanded && (
											<div className="ml-8 space-y-4 mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
												{/* Description */}
												<div>
													<h4 className="font-bold text-sm mb-2">Description</h4>
													<p className="text-sm text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap">
														{entry.description}
													</p>
												</div>

												{/* Tags */}
												{entry.tags && entry.tags.length > 0 && (
													<div>
														<h4 className="font-bold text-sm mb-2 flex items-center gap-2">
															<Tag className="h-4 w-4" />
															Tags
														</h4>
														<div className="flex flex-wrap gap-2">
															{entry.tags.map((tag) => (
																<span
																	key={tag}
																	className="text-xs px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
																>
																	{tag}
																</span>
															))}
														</div>
													</div>
												)}

												{/* Files */}
												{entry.files && entry.files.length > 0 && (
													<div>
														<h4 className="font-bold text-sm mb-2 flex items-center gap-2">
															<Upload className="h-4 w-4" />
															Attached Files ({entry.files.length})
														</h4>
														<div className="space-y-2">
															{entry.files.map((file) => (
																<div
																	key={file.id}
																	className="flex items-center justify-between p-3 border border-neutral-200 dark:border-neutral-800 rounded-xl"
																>
																	<div className="flex items-center gap-3">
																		<FileText className="h-5 w-5 text-primary" />
																		<div>
																			<p className="font-medium text-sm">{file.name}</p>
																			<p className="text-xs text-neutral-600 dark:text-neutral-400">
																				{formatFileSize(file.size)}
																			</p>
																		</div>
																	</div>
																</div>
															))}
														</div>
													</div>
												)}

												{/* Links */}
												{entry.links && entry.links.length > 0 && (
													<div>
														<h4 className="font-bold text-sm mb-2 flex items-center gap-2">
															<Link2 className="h-4 w-4" />
															Linked Resources ({entry.links.length})
														</h4>
														<div className="space-y-2">
															{entry.links.map((link) => (
																<a
																	key={link.id}
																	href={link.url}
																	target="_blank"
																	rel="noopener noreferrer"
																	className="flex items-center gap-3 p-3 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
																>
																	<Link2 className="h-5 w-5 text-primary" />
																	<div className="flex-1">
																		<p className="font-medium text-sm">{link.title}</p>
																		<p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
																			{link.url}
																		</p>
																	</div>
																	<Eye className="h-4 w-4 text-neutral-400" />
																</a>
															))}
														</div>
													</div>
												)}

												{/* Review Comments */}
												{entry.reviewComments && (
													<div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
														<div className="flex items-start gap-2">
															<MessageSquare className="h-5 w-5 text-primary mt-0.5" />
															<div>
																<h4 className="font-bold text-sm mb-1">Review Feedback</h4>
																<p className="text-sm text-neutral-600 dark:text-neutral-400">
																	{entry.reviewComments}
																</p>
																{entry.reviewedBy && entry.reviewedAt && (
																	<p className="text-xs text-neutral-500 mt-2">
																		By {entry.reviewedBy} on {formatDate(entry.reviewedAt)}
																	</p>
																)}
															</div>
														</div>
													</div>
												)}
											</div>
										)}
									</CardContent>
								</Card>
							)
						})}
					</div>
				)}

				{/* Review Modal */}
				{selectedEntry && (
					<div
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
						onClick={() => {
							setSelectedEntry(null)
							setReviewComment('')
						}}
					>
						<div
							className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
							onClick={(e) => e.stopPropagation()}
						>
							{/* Modal Header */}
							<div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
								<div className="flex items-start justify-between gap-4">
									<div>
										<h2 className="text-2xl font-bold mb-2">Review Work Submission</h2>
										<p className="text-sm text-neutral-600 dark:text-neutral-400">{selectedEntry.title}</p>
									</div>
									<button
										onClick={() => {
											setSelectedEntry(null)
											setReviewComment('')
										}}
										className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
									>
										<XCircle className="h-6 w-6" />
									</button>
								</div>
							</div>

							{/* Modal Content */}
							<div className="flex-1 overflow-y-auto p-6 space-y-4">
								{/* Entry Info */}
								<div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
									<div className="grid grid-cols-2 gap-4 text-sm">
										<div>
											<span className="text-neutral-500">Submitted by:</span>
											<p className="font-medium">{selectedEntry.submittedBy || 'Unknown'}</p>
										</div>
										<div>
											<span className="text-neutral-500">Date:</span>
											<p className="font-medium">{formatDate(selectedEntry.submittedAt || selectedEntry.date)}</p>
										</div>
										<div>
											<span className="text-neutral-500">Duration:</span>
											<p className="font-medium">{selectedEntry.duration}</p>
										</div>
										<div>
											<span className="text-neutral-500">Category:</span>
											<p className="font-medium">
												{categories.find((c) => c.id === selectedEntry.category)?.label}
											</p>
										</div>
									</div>
								</div>

								{/* AI Evaluation Results */}
								{aiEvaluation && (
									<div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-xl">
										<div className="flex items-center gap-2 mb-3">
											<Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
											<h3 className="font-bold text-lg">AI Evaluation</h3>
											<span className="ml-auto text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
												{aiEvaluation.aiConfidence}% confidence
											</span>
										</div>

										{/* Overall Score */}
										<div className="mb-4">
											<div className="flex items-center justify-between mb-2">
												<span className="text-sm font-medium">Overall Score</span>
												<span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
													{aiEvaluation.overallScore}/100
												</span>
											</div>
											<div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3">
												<div
													className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all"
													style={{ width: `${aiEvaluation.overallScore}%` }}
												/>
											</div>
										</div>

										{/* Quality, Completeness, Documentation */}
										<div className="grid grid-cols-3 gap-3 mb-4">
											<div className="text-center p-3 bg-white dark:bg-neutral-800 rounded-lg">
												<p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Quality</p>
												<p className="text-lg font-bold">{aiEvaluation.quality.score}</p>
											</div>
											<div className="text-center p-3 bg-white dark:bg-neutral-800 rounded-lg">
												<p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Complete</p>
												<p className="text-lg font-bold">{aiEvaluation.completeness.score}</p>
											</div>
											<div className="text-center p-3 bg-white dark:bg-neutral-800 rounded-lg">
												<p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Docs</p>
												<p className="text-lg font-bold">{aiEvaluation.documentation.score}</p>
											</div>
										</div>

										{/* Strengths */}
										{aiEvaluation.quality.strengths.length > 0 && (
											<div className="mb-3">
												<div className="flex items-center gap-2 mb-2">
													<ThumbsUp className="h-4 w-4 text-green-600 dark:text-green-400" />
													<h4 className="text-sm font-bold">Strengths</h4>
												</div>
												<ul className="space-y-1">
													{aiEvaluation.quality.strengths.map((strength, idx) => (
														<li key={idx} className="text-xs text-green-700 dark:text-green-400 flex items-start gap-2">
															<span className="mt-0.5">✓</span>
															<span>{strength}</span>
														</li>
													))}
												</ul>
											</div>
										)}

										{/* Improvements */}
										{aiEvaluation.quality.improvements.length > 0 && (
											<div className="mb-3">
												<div className="flex items-center gap-2 mb-2">
													<ThumbsDown className="h-4 w-4 text-orange-600 dark:text-orange-400" />
													<h4 className="text-sm font-bold">Suggested Improvements</h4>
												</div>
												<ul className="space-y-1">
													{aiEvaluation.quality.improvements.map((improvement, idx) => (
														<li key={idx} className="text-xs text-orange-700 dark:text-orange-400 flex items-start gap-2">
															<span className="mt-0.5">→</span>
															<span>{improvement}</span>
														</li>
													))}
												</ul>
											</div>
										)}

										{/* Recommendations */}
										{aiEvaluation.recommendations.length > 0 && (
											<div>
												<div className="flex items-center gap-2 mb-2">
													<Lightbulb className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
													<h4 className="text-sm font-bold">AI Recommendations</h4>
												</div>
												<ul className="space-y-1">
													{aiEvaluation.recommendations.map((rec, idx) => (
														<li key={idx} className="text-xs text-neutral-700 dark:text-neutral-300 flex items-start gap-2">
															<span className="mt-0.5">💡</span>
															<span>{rec}</span>
														</li>
													))}
												</ul>
											</div>
										)}

										{/* Suggested Action */}
										<div className="mt-4 p-3 bg-white dark:bg-neutral-800 rounded-lg">
											<div className="flex items-center justify-between">
												<span className="text-sm font-medium">AI Suggests:</span>
												<span className={`text-sm font-bold ${
													aiEvaluation.suggestedAction === 'approve' 
														? 'text-green-600 dark:text-green-400' 
														: aiEvaluation.suggestedAction === 'request_changes'
														? 'text-yellow-600 dark:text-yellow-400'
														: 'text-orange-600 dark:text-orange-400'
												}`}>
													{aiEvaluation.suggestedAction === 'approve' 
														? '✓ Approve' 
														: aiEvaluation.suggestedAction === 'request_changes'
														? '💬 Request Changes'
														: '💭 Needs Discussion'}
												</span>
											</div>
										</div>
									</div>
								)}

								{/* Description */}
								<div>
									<h3 className="font-bold mb-2">Description</h3>
									<p className="text-sm text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap">
										{selectedEntry.description}
									</p>
								</div>

								{/* Review Comment Input */}
								<div>
									<label className="block text-sm font-bold mb-2">Review Comments</label>
									<textarea
										value={reviewComment}
										onChange={(e) => setReviewComment(e.target.value)}
										placeholder="Add your feedback here (required for rejection)..."
										rows={4}
										className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
									/>
								</div>

								{/* Send to Messages Option */}
								<div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
									<input
										type="checkbox"
										id="sendToMessages"
										checked={sendToMessages}
										onChange={(e) => setSendToMessages(e.target.checked)}
										className="w-4 h-4 text-primary border-neutral-300 rounded focus:ring-primary"
									/>
									<label htmlFor="sendToMessages" className="flex-1 text-sm cursor-pointer">
										<div className="flex items-center gap-2">
											<Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
											<span className="font-medium text-blue-700 dark:text-blue-300">
												Send notification to Messages
											</span>
										</div>
										<p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
											The submitter will receive a message with your review feedback
										</p>
									</label>
								</div>

								{/* Warning for rejection */}
								{reviewComment.trim() && (
									<div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl flex items-start gap-2">
										<AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
										<div className="text-sm text-yellow-700 dark:text-yellow-300">
											<p className="font-medium">Your feedback will be shared with the submitter</p>
											<p className="text-xs mt-1">
												Be constructive and specific about what needs improvement
											</p>
										</div>
									</div>
								)}
							</div>

							{/* Modal Footer */}
							<div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
								<div className="flex items-center gap-3">
									<Button
										onClick={() => handleApprove(selectedEntry.id)}
										className="flex-1 bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
									>
										<CheckCircle2 className="h-4 w-4" />
										Approve
									</Button>
									<Button
										variant="outline"
										onClick={() => handleRequestChanges(selectedEntry.id)}
										className="flex-1 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 flex items-center justify-center gap-2"
									>
										<MessageSquare className="h-4 w-4" />
										Request Changes
									</Button>
									<Button
										variant="outline"
										onClick={() => handleReject(selectedEntry.id)}
										className="flex-1 border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center gap-2"
									>
										<XCircle className="h-4 w-4" />
										Reject
									</Button>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
			<Toaster />
		</>
	)
}

