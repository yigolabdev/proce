import { storage } from '../../utils/storage'
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import DevMemo from '../../components/dev/DevMemo'
import { DEV_MEMOS } from '../../constants/devMemos'
import { EmptyState } from '../../components/common/EmptyState'
import { LoadingState } from '../../components/common/LoadingState'
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts'
import {
	FileText,
	Calendar,
	Clock,
	Tag,
	Upload,
	Link2,
	Search,
	ChevronDown,
	ChevronUp,
	Edit2,
	Trash2,
	Download,
	Eye,
	FolderKanban,
	Target,
	Filter,
	TrendingUp,
	BarChart3,
} from 'lucide-react'
import Input from '../../components/ui/Input'
import { toast } from 'sonner'

interface UploadedFile {
	id: string
	name: string
	size: number
	type: string
	url: string
}

interface LinkedResource {
	id: string
	url: string
	title: string
	addedAt: Date
}

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
	files: UploadedFile[]
	links: LinkedResource[]
	status: 'draft' | 'submitted'
}

export default function WorkHistoryPage() {
	const navigate = useNavigate()
	const [entries, setEntries] = useState<WorkEntry[]>([])
	const [filteredEntries, setFilteredEntries] = useState<WorkEntry[]>([])
	const [expandedEntries, setExpandedEntries] = useState<string[]>([])
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedCategory, setSelectedCategory] = useState<string>('all')
	const [selectedProject, setSelectedProject] = useState<string>('all')
	const [selectedObjective, setSelectedObjective] = useState<string>('all')
	const [sortBy, setSortBy] = useState<'date' | 'title'>('date')
	const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([])
	const [objectives, setObjectives] = useState<Array<{ id: string; title: string }>>([])
	const [showFilters, setShowFilters] = useState(false)
	const [loading, setLoading] = useState(true)

	// Keyboard shortcuts
	useKeyboardShortcuts({
		newWork: () => navigate('/app/input'),
		goToDashboard: () => navigate('/app/dashboard'),
	})

	// Categories
	const categories = [
		{ id: 'all', label: 'All', color: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400' },
		{ id: 'development', label: 'Development', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
		{ id: 'meeting', label: 'Meeting', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
		{ id: 'research', label: 'Research', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
		{ id: 'documentation', label: 'Documentation', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
		{ id: 'review', label: 'Review', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' },
		{ id: 'other', label: 'Other', color: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400' },
	]

	// Load entries from localStorage
	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true)
				// Load projects
				const savedProjects = storage.get<any[]>('projects')
				if (savedProjects) {
					const parsedProjects = savedProjects.map((p: any) => ({
						id: p.id,
						name: p.name,
					}))
					setProjects(parsedProjects)
				}

				// Load OKR objectives (mock for now)
				const mockObjectives = [
					{ id: '1', title: 'Increase Product Market Fit' },
					{ id: '2', title: 'Scale Revenue Growth' },
					{ id: '3', title: 'Enhance Team Productivity' },
				]
				setObjectives(mockObjectives)

				const saved = storage.get<any[]>('workEntries')
				if (saved) {
					const entriesWithDates = saved.map((entry: any) => ({
						...entry,
						date: new Date(entry.date),
						links: entry.links?.map((link: any) => ({
							...link,
							addedAt: new Date(link.addedAt),
						})) || [],
					}))
					setEntries(entriesWithDates)
				} else {
				// Enhanced mock data for demonstration
				const mockEntries: WorkEntry[] = [
					{
						id: '1',
						title: 'Implemented User Authentication System',
						description: 'Completed the comprehensive user authentication module with JWT tokens and refresh token mechanism. Implemented the following features:\n\n✅ Login with email/password\n✅ Social authentication (Google, GitHub)\n✅ Password reset flow with email verification\n✅ Token refresh mechanism\n✅ Session management\n✅ Rate limiting for security\n\nTested with 100+ test cases covering edge cases and security scenarios.',
						category: 'development',
						projectId: '1',
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
						status: 'submitted',
					},
					{
						id: '2',
						title: 'Q4 Strategy Planning Meeting',
						description: 'Participated in quarterly strategy planning session with executive team and department leads.\n\nKey Discussions:\n• Q3 Performance Review (exceeded targets by 15%)\n• Q4 Revenue Goals and KPIs\n• Resource allocation for new initiatives\n• Market expansion opportunities\n• Competitive landscape analysis\n\nDecisions Made:\n✓ Launch new product feature in December\n✓ Increase marketing budget by 20%\n✓ Hire 3 additional engineers\n✓ Focus on enterprise customers\n\nAction Items:\n→ Finalize Q4 budget by end of week\n→ Create hiring plan with HR\n→ Schedule product launch kickoff',
						category: 'meeting',
						projectId: '2',
						objectiveId: '2',
						tags: ['strategy', 'planning', 'leadership', 'okr', 'quarterly'],
						date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
						duration: '2h 15m',
						files: [
							{ id: 'f4', name: 'Q4-strategy-presentation.pdf', size: 3500000, type: 'application/pdf', url: '#' },
							{ id: 'f5', name: 'budget-forecast.xlsx', size: 85000, type: 'application/vnd.ms-excel', url: '#' },
						],
						links: [
							{ id: 'l3', url: 'https://docs.google.com/Q4-strategy-notes', title: 'Meeting Notes & Decisions', addedAt: new Date() },
							{ id: 'l4', url: 'https://miro.com/board/q4-planning', title: 'Strategy Board', addedAt: new Date() },
						],
						status: 'submitted',
					},
					{
						id: '3',
						title: 'Frontend State Management Research',
						description: 'Conducted comprehensive research on modern state management solutions for our React application.\n\nEvaluated Libraries:\n1. Redux Toolkit - Feature-rich, large ecosystem\n2. Zustand - Minimal API, excellent performance\n3. Jotai - Atomic approach, great for complex state\n4. Recoil - Facebook-backed, experimental\n5. MobX - Observable-based, intuitive\n\nEvaluation Criteria:\n• Bundle size impact\n• Developer experience\n• Performance benchmarks\n• TypeScript support\n• Learning curve\n• Community & ecosystem\n\nRecommendation: Zustand\nReasoning: Best balance of simplicity, performance, and DX. 2.5KB size, intuitive API, excellent TypeScript support.',
						category: 'research',
						projectId: '1',
						objectiveId: '1',
						tags: ['frontend', 'react', 'state-management', 'architecture', 'performance'],
						date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
						duration: '5h',
						files: [
							{ id: 'f6', name: 'state-management-comparison.xlsx', size: 67000, type: 'application/vnd.ms-excel', url: '#' },
							{ id: 'f7', name: 'performance-benchmarks.pdf', size: 156000, type: 'application/pdf', url: '#' },
							{ id: 'f8', name: 'demo-app.zip', size: 2400000, type: 'application/zip', url: '#' },
						],
						links: [
							{ id: 'l5', url: 'https://github.com/research/state-mgmt-demo', title: 'Demo Repository', addedAt: new Date() },
						],
						status: 'submitted',
					},
					{
						id: '4',
						title: 'API Documentation Update',
						description: 'Updated and expanded API documentation for v2.0 release.\n\nCompleted Sections:\n📝 Authentication endpoints (OAuth2, JWT)\n📝 User management APIs\n📝 Project CRUD operations\n📝 File upload/download\n📝 Webhook configuration\n📝 Rate limiting policies\n📝 Error codes reference\n📝 SDK examples (Python, JavaScript, Ruby)\n\nImprovedments:\n✨ Added interactive API playground\n✨ Included cURL examples for all endpoints\n✨ Created Postman collection\n✨ Added troubleshooting guide\n✨ Improved search functionality',
						category: 'documentation',
						projectId: '1',
						objectiveId: '1',
						tags: ['documentation', 'api', 'technical-writing', 'developer-experience'],
						date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
						duration: '4h',
						files: [
							{ id: 'f9', name: 'api-docs-v2.pdf', size: 890000, type: 'application/pdf', url: '#' },
							{ id: 'f10', name: 'postman-collection.json', size: 45000, type: 'application/json', url: '#' },
						],
						links: [
							{ id: 'l6', url: 'https://docs.company.com/api/v2', title: 'Published API Docs', addedAt: new Date() },
							{ id: 'l7', url: 'https://github.com/docs/api-v2', title: 'Documentation Source', addedAt: new Date() },
						],
						status: 'submitted',
					},
					{
						id: '5',
						title: 'Code Review: Payment Integration',
						description: 'Conducted thorough code review for Stripe payment integration PR.\n\nReviewed Components:\n🔍 Payment processing logic\n🔍 Error handling and retry mechanisms\n🔍 Webhook event processing\n🔍 Transaction logging\n🔍 Security considerations\n🔍 Test coverage\n\nFindings:\n✅ Good: Clean architecture, proper error handling\n⚠️ Minor: Add more unit tests for edge cases\n⚠️ Minor: Improve webhook signature verification\n❌ Critical: Sensitive data exposure in logs\n\nSuggestions:\n💡 Add idempotency keys for retry safety\n💡 Implement circuit breaker pattern\n💡 Add monitoring and alerting\n💡 Create runbook for payment failures\n\nStatus: Approved with requested changes',
						category: 'review',
						projectId: '2',
						objectiveId: '2',
						tags: ['code-review', 'payments', 'stripe', 'security', 'quality'],
						date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
						duration: '2h 30m',
						files: [
							{ id: 'f11', name: 'review-checklist.pdf', size: 78000, type: 'application/pdf', url: '#' },
						],
						links: [
							{ id: 'l8', url: 'https://github.com/project/pull/234', title: 'Pull Request #234: Stripe Integration', addedAt: new Date() },
							{ id: 'l9', url: 'https://stripe.com/docs/webhooks', title: 'Stripe Webhook Docs', addedAt: new Date() },
						],
						status: 'submitted',
					},
					{
						id: '6',
						title: 'Database Performance Optimization',
						description: 'Investigated and resolved database performance bottlenecks affecting user dashboard.\n\nIssues Identified:\n🔴 N+1 query problem in user posts endpoint\n🔴 Missing indexes on frequently queried columns\n🔴 Inefficient JOIN operations\n🔴 Large result sets without pagination\n\nOptimizations Implemented:\n✅ Added eager loading to reduce queries from 150+ to 5\n✅ Created composite indexes (users.email, posts.created_at)\n✅ Rewrote complex queries using CTEs\n✅ Implemented cursor-based pagination\n✅ Added query result caching (Redis)\n\nPerformance Impact:\n📈 API response time: 2.5s → 180ms (93% improvement)\n📈 Database CPU usage: 85% → 25%\n📈 Concurrent user capacity: 100 → 500+\n\nMonitoring dashboards updated with new metrics.',
						category: 'development',
						projectId: '2',
						objectiveId: '2',
						tags: ['database', 'optimization', 'performance', 'postgresql', 'backend'],
						date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
						duration: '7h 45m',
						files: [
							{ id: 'f12', name: 'before-after-benchmarks.pdf', size: 234000, type: 'application/pdf', url: '#' },
							{ id: 'f13', name: 'query-optimization-report.xlsx', size: 93000, type: 'application/vnd.ms-excel', url: '#' },
							{ id: 'f14', name: 'index-analysis.sql', size: 12000, type: 'text/plain', url: '#' },
						],
						links: [
							{ id: 'l10', url: 'https://github.com/project/pull/245', title: 'PR #245: DB Optimization', addedAt: new Date() },
							{ id: 'l11', url: 'https://grafana.company.com/db-performance', title: 'Performance Dashboard', addedAt: new Date() },
						],
						status: 'submitted',
					},
					{
						id: '7',
						title: 'Sprint Retrospective & Planning',
						description: 'Facilitated bi-weekly sprint retrospective and planning session.\n\nRetrospective Highlights:\n😊 What Went Well:\n• Successfully launched mobile app beta\n• Improved deployment process (CI/CD)\n• Better communication with design team\n• Zero critical bugs in production\n\n😟 What Didn\'t Go Well:\n• Scope creep in user profile feature\n• Testing environment instability\n• Last-minute requirement changes\n• Underestimated technical debt tasks\n\n💡 Action Items:\n→ Implement stricter scope control\n→ Allocate 20% of sprint for tech debt\n→ Improve test environment reliability\n→ Better stakeholder communication\n\nSprint Planning:\n📋 Story points committed: 42\n📋 Stories selected: 12\n📋 Focus areas: Mobile app improvements, API v2, Infrastructure',
						category: 'meeting',
						objectiveId: '3',
						tags: ['agile', 'scrum', 'retrospective', 'sprint-planning', 'team'],
						date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
						duration: '2h',
						files: [
							{ id: 'f15', name: 'retro-board-export.pdf', size: 145000, type: 'application/pdf', url: '#' },
							{ id: 'f16', name: 'sprint-16-plan.xlsx', size: 67000, type: 'application/vnd.ms-excel', url: '#' },
						],
						links: [
							{ id: 'l12', url: 'https://miro.com/retro-sprint-15', title: 'Retrospective Board', addedAt: new Date() },
							{ id: 'l13', url: 'https://jira.company.com/sprint/16', title: 'Sprint 16 Board', addedAt: new Date() },
						],
						status: 'submitted',
					},
					{
						id: '8',
						title: 'Security Audit & Vulnerability Assessment',
						description: 'Performed comprehensive security audit of application infrastructure and codebase.\n\nAudit Scope:\n🔒 Authentication & Authorization\n🔒 Data encryption (at rest & in transit)\n🔒 API security (rate limiting, CORS, CSRF)\n🔒 Dependency vulnerabilities\n🔒 Infrastructure configuration\n🔒 Logging & monitoring\n\nFindings:\n🔴 HIGH: Outdated npm packages with known CVEs\n🟡 MEDIUM: Weak password policy (no complexity requirements)\n🟡 MEDIUM: Missing HTTPS on staging environment\n🟢 LOW: Verbose error messages expose internal details\n✅ PASSED: Proper token management\n✅ PASSED: SQL injection protection\n✅ PASSED: XSS prevention measures\n\nRemediation Plan:\n1. Update all dependencies (priority: critical)\n2. Implement stronger password requirements\n3. Enforce HTTPS across all environments\n4. Sanitize error messages for production\n5. Schedule penetration testing\n\nCompliance: SOC 2, GDPR requirements verified',
						category: 'review',
						projectId: '1',
						objectiveId: '1',
						tags: ['security', 'audit', 'compliance', 'vulnerabilities', 'best-practices'],
						date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8),
						duration: '5h 30m',
						files: [
							{ id: 'f17', name: 'security-audit-report.pdf', size: 456000, type: 'application/pdf', url: '#' },
							{ id: 'f18', name: 'vulnerability-scan-results.json', size: 89000, type: 'application/json', url: '#' },
							{ id: 'f19', name: 'remediation-plan.xlsx', size: 78000, type: 'application/vnd.ms-excel', url: '#' },
						],
						links: [
							{ id: 'l14', url: 'https://snyk.io/project/report', title: 'Snyk Vulnerability Report', addedAt: new Date() },
							{ id: 'l15', url: 'https://owasp.org/top10', title: 'OWASP Top 10 Checklist', addedAt: new Date() },
						],
						status: 'submitted',
					},
					{
						id: '9',
						title: 'Customer Feedback Analysis',
						description: 'Analyzed customer feedback from multiple channels to identify product improvement opportunities.\n\nData Sources:\n📊 Support tickets (500+ tickets reviewed)\n📊 User interviews (15 sessions)\n📊 NPS survey responses (1,200+ responses)\n📊 App store reviews (iOS & Android)\n📊 Social media mentions\n\nKey Themes Identified:\n1️⃣ Feature Requests (45%):\n   • Dark mode support (mentioned 120+ times)\n   • Offline functionality\n   • Advanced filtering options\n   • Bulk operations\n\n2️⃣ Pain Points (35%):\n   • Slow load times on dashboard\n   • Confusing navigation\n   • Mobile app crashes\n   • Limited export options\n\n3️⃣ Positive Feedback (20%):\n   • Intuitive UI design\n   • Excellent customer support\n   • Powerful search functionality\n\nRecommendations:\n✅ Priority 1: Implement dark mode (high demand, low effort)\n✅ Priority 2: Dashboard performance optimization\n✅ Priority 3: Improve mobile app stability\n✅ Priority 4: Navigation redesign (UX research needed)\n\nNext Steps: Present findings to product team',
						category: 'research',
						projectId: '2',
						objectiveId: '2',
						tags: ['customer-feedback', 'product', 'ux', 'research', 'analysis'],
						date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
						duration: '6h 15m',
						files: [
							{ id: 'f20', name: 'feedback-analysis-report.pdf', size: 678000, type: 'application/pdf', url: '#' },
							{ id: 'f21', name: 'sentiment-analysis.xlsx', size: 123000, type: 'application/vnd.ms-excel', url: '#' },
							{ id: 'f22', name: 'user-quotes.docx', size: 45000, type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', url: '#' },
						],
						links: [
							{ id: 'l16', url: 'https://analytics.company.com/feedback', title: 'Feedback Dashboard', addedAt: new Date() },
							{ id: 'l17', url: 'https://docs.google.com/analysis', title: 'Detailed Analysis Document', addedAt: new Date() },
						],
						status: 'submitted',
					},
					{
						id: '10',
						title: 'CI/CD Pipeline Enhancement',
						description: 'Improved continuous integration and deployment pipeline for faster and more reliable releases.\n\nCurrent State Analysis:\n⏱️ Build time: 25 minutes\n⏱️ Deploy time: 15 minutes\n❌ 15% flaky test rate\n❌ Manual approval steps\n❌ No automated rollback\n\nImplemented Improvements:\n✅ Docker layer caching (build time -60%)\n✅ Parallel test execution (test time -70%)\n✅ Automated canary deployments\n✅ Health check verification\n✅ Automatic rollback on failures\n✅ Slack notifications for pipeline events\n✅ Blue-green deployment strategy\n✅ Infrastructure as Code (Terraform)\n\nNew Performance:\n⚡ Build time: 10 minutes (60% faster)\n⚡ Deploy time: 5 minutes (67% faster)\n⚡ Flaky test rate: 2% (87% improvement)\n⚡ Zero-downtime deployments\n⚡ Automated rollback in <1 minute\n\nRelease Frequency: 2-3 per week → 5-10 per day (capability)\n\nDocumentation updated with runbooks and troubleshooting guides.',
						category: 'development',
						projectId: '1',
						objectiveId: '3',
						tags: ['cicd', 'devops', 'automation', 'infrastructure', 'docker', 'kubernetes'],
						date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
						duration: '8h',
						files: [
							{ id: 'f23', name: 'pipeline-architecture.png', size: 234000, type: 'image/png', url: '#' },
							{ id: 'f24', name: 'before-after-metrics.pdf', size: 167000, type: 'application/pdf', url: '#' },
							{ id: 'f25', name: 'terraform-configs.zip', size: 89000, type: 'application/zip', url: '#' },
						],
						links: [
							{ id: 'l18', url: 'https://github.com/infra/cicd-v2', title: 'Pipeline Configuration Repo', addedAt: new Date() },
							{ id: 'l19', url: 'https://jenkins.company.com/pipeline', title: 'Jenkins Pipeline', addedAt: new Date() },
						],
						status: 'submitted',
					},
					{
						id: '11',
						title: 'Onboarding New Team Members',
						description: 'Facilitated onboarding process for 2 new engineers joining the team.\n\nOnboarding Activities:\n👋 Welcome meeting & team introduction\n📚 Codebase walkthrough session\n🔧 Development environment setup\n📖 Architecture deep-dive presentation\n🏗️ Access provisioning (GitHub, AWS, tools)\n📝 Documentation review\n🎯 First tasks assignment\n👥 Pair programming sessions\n\nTopics Covered:\n• Technology stack overview\n• Development workflow & git practices\n• Code review process\n• Testing strategies\n• Deployment procedures\n• Team rituals & ceremonies\n• Product roadmap & vision\n• Customer personas\n\nFirst Week Accomplishments:\n✅ Environment fully configured\n✅ Completed 2 small bug fixes\n✅ Participated in code reviews\n✅ Attended all team meetings\n✅ Started first feature ticket\n\nFeedback from New Members:\n💬 "Very comprehensive onboarding process"\n💬 "Team is welcoming and helpful"\n💬 "Documentation could be more detailed"\n\nAction Items:\n→ Improve onboarding documentation\n→ Create video tutorials for common tasks\n→ Assign mentors for first month',
						category: 'other',
						projectId: '1',
						objectiveId: '3',
						tags: ['onboarding', 'team', 'mentoring', 'training', 'people'],
						date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
						duration: '4h 30m',
						files: [
							{ id: 'f26', name: 'onboarding-checklist.pdf', size: 123000, type: 'application/pdf', url: '#' },
							{ id: 'f27', name: 'architecture-diagrams.pdf', size: 567000, type: 'application/pdf', url: '#' },
						],
						links: [
							{ id: 'l20', url: 'https://notion.so/onboarding-guide', title: 'Engineering Onboarding Guide', addedAt: new Date() },
							{ id: 'l21', url: 'https://github.com/company/wiki', title: 'Engineering Wiki', addedAt: new Date() },
						],
						status: 'submitted',
					},
					{
						id: '12',
						title: 'Mobile App Crash Investigation',
						description: 'Investigated and resolved critical crash affecting 12% of iOS users.\n\nIssue Details:\n🔴 Crash Rate: 12% of iOS users (v3.2.1)\n🔴 Affected Versions: iOS 14.x and 15.x\n🔴 Frequency: Occurs during image upload\n🔴 User Impact: HIGH (cannot complete core workflow)\n\nInvestigation Process:\n1️⃣ Analyzed crash reports from Firebase Crashlytics\n2️⃣ Reproduced issue on multiple devices\n3️⃣ Reviewed recent code changes\n4️⃣ Identified memory leak in image compression\n5️⃣ Tested fix on staging\n6️⃣ Deployed hotfix to production\n\nRoot Cause:\n🐛 Image processing library not releasing memory properly\n🐛 Large images (>5MB) causing out-of-memory crashes\n🐛 Missing error handling for edge cases\n\nSolution Implemented:\n✅ Fixed memory leak in image processor\n✅ Added automatic image compression before upload\n✅ Implemented proper error handling\n✅ Added file size validation (max 10MB)\n✅ Improved memory management\n\nResults:\n📉 Crash rate: 12% → 0.3% (97% reduction)\n📈 Upload success rate: 88% → 99.5%\n⚡ Upload speed improved by 40%\n\nHotfix released within 4 hours of issue detection.\nMonitoring dashboards updated with new alerts.',
						category: 'development',
						projectId: '2',
						objectiveId: '1',
						tags: ['mobile', 'ios', 'bug-fix', 'crash', 'performance', 'hotfix'],
						date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
						duration: '6h 45m',
						files: [
							{ id: 'f28', name: 'crash-report-analysis.pdf', size: 289000, type: 'application/pdf', url: '#' },
							{ id: 'f29', name: 'memory-profiling.png', size: 456000, type: 'image/png', url: '#' },
							{ id: 'f30', name: 'fix-verification.mp4', size: 3400000, type: 'video/mp4', url: '#' },
						],
						links: [
							{ id: 'l22', url: 'https://github.com/mobile/pull/189', title: 'PR #189: iOS Crash Hotfix', addedAt: new Date() },
							{ id: 'l23', url: 'https://console.firebase.google.com/crashlytics', title: 'Crashlytics Dashboard', addedAt: new Date() },
						],
						status: 'submitted',
					},
				]
					setEntries(mockEntries)
					localStorage.setItem('workEntries', JSON.stringify(mockEntries))
				}
			} catch (error) {
				console.error('Failed to load work entries:', error)
			} finally {
				setLoading(false)
			}
		}
		
		loadData()
	}, [])

	// Filter and sort entries
	useEffect(() => {
		let filtered = [...entries]

		// Filter by search query
		if (searchQuery) {
			filtered = filtered.filter(
				(entry) =>
					entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
					entry.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
			)
		}

		// Filter by category
		if (selectedCategory !== 'all') {
			filtered = filtered.filter((entry) => entry.category === selectedCategory)
		}

		// Filter by project
		if (selectedProject !== 'all') {
			filtered = filtered.filter((entry) => entry.projectId === selectedProject)
		}

		// Filter by objective
		if (selectedObjective !== 'all') {
			filtered = filtered.filter((entry) => entry.objectiveId === selectedObjective)
		}

		// Sort
		filtered.sort((a, b) => {
			if (sortBy === 'date') {
				return b.date.getTime() - a.date.getTime()
			} else {
				return a.title.localeCompare(b.title)
			}
		})

		setFilteredEntries(filtered)
	}, [entries, searchQuery, selectedCategory, selectedProject, selectedObjective, sortBy])

	// Calculate statistics
	const statistics = useMemo(() => {
		const totalEntries = filteredEntries.length
		
		// This week's entries
		const oneWeekAgo = new Date()
		oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
		const thisWeekEntries = filteredEntries.filter(e => e.date >= oneWeekAgo)
		
		// Calculate total hours this week
		const parseTime = (duration: string) => {
			if (!duration) return 0
			const match = duration.match(/(\d+)h?\s*(\d+)?m?/)
			if (!match) return 0
			const hours = parseInt(match[1] || '0')
			const minutes = parseInt(match[2] || '0')
			return hours + minutes / 60
		}
		
		const totalHoursThisWeek = thisWeekEntries.reduce((sum, entry) => {
			return sum + parseTime(entry.duration || '')
		}, 0)
		
		// Most active project
		const projectCounts: Record<string, number> = {}
		filteredEntries.forEach(entry => {
			if (entry.projectId) {
				projectCounts[entry.projectId] = (projectCounts[entry.projectId] || 0) + 1
			}
		})
		const mostActiveProjectId = Object.entries(projectCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
		const mostActiveProject = mostActiveProjectId 
			? { name: projects.find(p => p.id === mostActiveProjectId)?.name || 'Unknown', count: projectCounts[mostActiveProjectId] }
			: null
		
		// Most active goal
		const goalCounts: Record<string, number> = {}
		filteredEntries.forEach(entry => {
			if (entry.objectiveId) {
				goalCounts[entry.objectiveId] = (goalCounts[entry.objectiveId] || 0) + 1
			}
		})
		const mostActiveGoalId = Object.entries(goalCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
		const mostActiveGoal = mostActiveGoalId
			? { name: objectives.find(o => o.id === mostActiveGoalId)?.title || 'Unknown', count: goalCounts[mostActiveGoalId] }
			: null
		
		// Average time per entry
		const totalHours = filteredEntries.reduce((sum, entry) => sum + parseTime(entry.duration || ''), 0)
		const avgTimePerEntry = totalEntries > 0 ? totalHours / totalEntries : 0
		
		return {
			totalEntries,
			thisWeekCount: thisWeekEntries.length,
			totalHoursThisWeek: totalHoursThisWeek.toFixed(1),
			mostActiveProject,
			mostActiveGoal,
			avgTimePerEntry: avgTimePerEntry.toFixed(1),
		}
	}, [filteredEntries, projects, objectives])

	const toggleExpand = (id: string) => {
		setExpandedEntries((prev) =>
			prev.includes(id) ? prev.filter((entryId) => entryId !== id) : [...prev, id]
		)
	}

	const handleEdit = (entry: WorkEntry) => {
		// Store entry data in sessionStorage for editing
		sessionStorage.setItem('workInputEditData', JSON.stringify({
			entryId: entry.id,
			title: entry.title,
			description: entry.description,
			category: entry.category,
			projectId: entry.projectId,
			objectiveId: entry.objectiveId,
			tags: entry.tags,
			files: entry.files,
			links: entry.links,
		}))
		
		toast.success('Opening editor...', {
			description: 'Navigating to Work Input page to edit this entry',
		})
		
		// Navigate to input page
		navigate('/input')
	}

	const handleDelete = (id: string) => {
		const entry = entries.find(e => e.id === id)
		if (!entry) {
			toast.error('Entry not found')
			return
		}
		
		// Build detailed confirmation message
		let confirmMessage = `Are you sure you want to delete this work entry?\n\nTitle: ${entry.title}\n`
		
		if (entry.projectId) {
			const projectName = projects.find(p => p.id === entry.projectId)?.name
			confirmMessage += `\nProject: ${projectName || 'Unknown'}`
		}
		
		if (entry.objectiveId) {
			const objectiveName = objectives.find(o => o.id === entry.objectiveId)?.title
			confirmMessage += `\nGoal: ${objectiveName || 'Unknown'}`
		}
		
		confirmMessage += '\n\nThis action cannot be undone.'
		
		if (confirm(confirmMessage)) {
			const updated = entries.filter((entry) => entry.id !== id)
			setEntries(updated)
			localStorage.setItem('workEntries', JSON.stringify(updated))
			
			toast.success('Work entry deleted', {
				description: 'The entry has been permanently removed',
			})
		}
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

	if (loading) {
		return (
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold flex items-center gap-3">
							<FileText className="h-8 w-8 text-primary" />
							Work History
						</h1>
						<p className="mt-2 text-neutral-600 dark:text-neutral-400">
							View and manage your submitted work entries
						</p>
					</div>
				</div>
				<LoadingState type="list" count={5} />
			</div>
		)
	}

	return (
		<>
			<DevMemo content={DEV_MEMOS.WORK_HISTORY} pagePath="/app/work-history/page.tsx" />
			<div className="space-y-6">
				{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold flex items-center gap-3">
						<FileText className="h-8 w-8 text-primary" />
						Work History
					</h1>
					<p className="mt-2 text-neutral-600 dark:text-neutral-400">
						View and manage your submitted work entries
					</p>
				</div>
			</div>

			{/* Statistics Dashboard */}
			<Card className="bg-linear-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 border-primary/20">
				<CardContent className="p-6">
					<div className="flex items-center gap-2 mb-4">
						<BarChart3 className="h-5 w-5 text-primary" />
						<h3 className="font-bold text-lg">Work Statistics</h3>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
						<div className="bg-white/50 dark:bg-neutral-900/50 p-4 rounded-xl">
							<div className="flex items-center gap-2 mb-2">
								<FileText className="h-4 w-4 text-neutral-500" />
								<p className="text-xs text-neutral-600 dark:text-neutral-400">Total Entries</p>
							</div>
							<p className="text-2xl font-bold text-primary">{statistics.totalEntries}</p>
						</div>
						<div className="bg-white/50 dark:bg-neutral-900/50 p-4 rounded-xl">
							<div className="flex items-center gap-2 mb-2">
								<Calendar className="h-4 w-4 text-neutral-500" />
								<p className="text-xs text-neutral-600 dark:text-neutral-400">This Week</p>
							</div>
							<p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{statistics.thisWeekCount}</p>
							<p className="text-xs text-neutral-500 mt-1">{statistics.totalHoursThisWeek}h total</p>
						</div>
						<div className="bg-white/50 dark:bg-neutral-900/50 p-4 rounded-xl">
							<div className="flex items-center gap-2 mb-2">
								<Clock className="h-4 w-4 text-neutral-500" />
								<p className="text-xs text-neutral-600 dark:text-neutral-400">Avg Time</p>
							</div>
							<p className="text-2xl font-bold text-green-600 dark:text-green-400">{statistics.avgTimePerEntry}h</p>
							<p className="text-xs text-neutral-500 mt-1">per entry</p>
						</div>
						<div className="bg-white/50 dark:bg-neutral-900/50 p-4 rounded-xl col-span-2 md:col-span-1 lg:col-span-1">
							<div className="flex items-center gap-2 mb-2">
								<FolderKanban className="h-4 w-4 text-neutral-500" />
								<p className="text-xs text-neutral-600 dark:text-neutral-400">Top Project</p>
							</div>
							{statistics.mostActiveProject ? (
								<>
									<p className="text-sm font-bold text-purple-600 dark:text-purple-400 truncate">
										{statistics.mostActiveProject.name}
									</p>
									<p className="text-xs text-neutral-500 mt-1">{statistics.mostActiveProject.count} entries</p>
								</>
							) : (
								<p className="text-sm text-neutral-500">No data</p>
							)}
						</div>
						<div className="bg-white/50 dark:bg-neutral-900/50 p-4 rounded-xl col-span-2 md:col-span-1 lg:col-span-2">
							<div className="flex items-center gap-2 mb-2">
								<Target className="h-4 w-4 text-neutral-500" />
								<p className="text-xs text-neutral-600 dark:text-neutral-400">Top Goal</p>
							</div>
							{statistics.mostActiveGoal ? (
								<>
									<p className="text-sm font-bold text-green-600 dark:text-green-400 truncate">
										{statistics.mostActiveGoal.name}
									</p>
									<p className="text-xs text-neutral-500 mt-1">{statistics.mostActiveGoal.count} entries</p>
								</>
							) : (
								<p className="text-sm text-neutral-500">No data</p>
							)}
						</div>
					</div>
					{filteredEntries.length !== entries.length && (
						<div className="mt-4 pt-4 border-t border-primary/20">
							<p className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
								<TrendingUp className="h-3 w-3" />
								Statistics are based on filtered results ({filteredEntries.length} of {entries.length} entries)
							</p>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Filters */}
			<Card>
				<CardContent className="p-6">
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-semibold flex items-center gap-2">
							<Filter className="h-4 w-4" />
							Filters
						</h3>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setShowFilters(!showFilters)}
							className="flex items-center gap-2"
						>
							{showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
							{showFilters ? 'Hide' : 'Show'} Advanced Filters
						</Button>
					</div>

					<div className="space-y-4">
						{/* Basic Filters */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							{/* Search */}
							<div className="lg:col-span-2">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
									<Input
										placeholder="Search by title, description, or tags..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="pl-10"
									/>
								</div>
							</div>

							{/* Category Filter */}
							<div>
								<select
									value={selectedCategory}
									onChange={(e) => setSelectedCategory(e.target.value)}
									className="w-full h-11 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary"
								>
									{categories.map((cat) => (
										<option key={cat.id} value={cat.id}>
											{cat.label}
										</option>
									))}
								</select>
							</div>

							{/* Sort */}
							<div>
								<select
									value={sortBy}
									onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
									className="w-full h-11 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary"
								>
									<option value="date">Sort by Date</option>
									<option value="title">Sort by Title</option>
								</select>
							</div>
						</div>

						{/* Advanced Filters */}
						{showFilters && (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
								{/* Project Filter */}
								<div>
									<label className="block text-sm font-medium mb-2 flex items-center gap-2">
										<FolderKanban className="h-4 w-4" />
										Filter by Project
									</label>
									<select
										value={selectedProject}
										onChange={(e) => setSelectedProject(e.target.value)}
										className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary"
									>
										<option value="all">All Projects</option>
										{projects.map((project) => (
											<option key={project.id} value={project.id}>
												📁 {project.name}
											</option>
										))}
									</select>
								</div>

								{/* OKR Filter */}
								<div>
									<label className="block text-sm font-medium mb-2 flex items-center gap-2">
										<Target className="h-4 w-4" />
										Filter by Goal (OKR)
									</label>
									<select
										value={selectedObjective}
										onChange={(e) => setSelectedObjective(e.target.value)}
										className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary"
									>
										<option value="all">All Goals</option>
										{objectives.map((objective) => (
											<option key={objective.id} value={objective.id}>
												🎯 {objective.title}
											</option>
										))}
									</select>
								</div>
							</div>
						)}
					</div>

					{/* Active Filters Summary */}
					{(searchQuery || selectedCategory !== 'all' || selectedProject !== 'all' || selectedObjective !== 'all') && (
						<div className="mt-4 flex items-center gap-2 flex-wrap">
							<span className="text-sm text-neutral-600 dark:text-neutral-400">Active filters:</span>
							{searchQuery && (
								<span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
									Search: "{searchQuery}"
									<button onClick={() => setSearchQuery('')} className="hover:text-primary/70">
										×
									</button>
								</span>
							)}
							{selectedCategory !== 'all' && (
								<span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
									Category: {categories.find((c) => c.id === selectedCategory)?.label}
									<button onClick={() => setSelectedCategory('all')} className="hover:text-primary/70">
										×
									</button>
								</span>
							)}
							{selectedProject !== 'all' && (
								<span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-sm">
									📁 Project: {projects.find((p) => p.id === selectedProject)?.name}
									<button onClick={() => setSelectedProject('all')} className="hover:opacity-70">
										×
									</button>
								</span>
							)}
							{selectedObjective !== 'all' && (
								<span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-sm">
									🎯 Goal: {objectives.find((o) => o.id === selectedObjective)?.title}
									<button onClick={() => setSelectedObjective('all')} className="hover:opacity-70">
										×
									</button>
								</span>
							)}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Results Summary */}
			<div className="flex items-center justify-between">
				<p className="text-sm text-neutral-600 dark:text-neutral-400">
					Showing {filteredEntries.length} of {entries.length} entries
				</p>
			</div>

			{/* Entries List */}
			{filteredEntries.length === 0 ? (
				<EmptyState
					icon={<FileText className="h-12 w-12" />}
					title="No Work Entries Found"
					description={
						searchQuery || selectedCategory !== 'all' || selectedProject !== 'all' || selectedObjective !== 'all'
							? 'Try adjusting your filters to see more results'
							: 'Start logging your work to build your history'
					}
					action={
						!(searchQuery || selectedCategory !== 'all' || selectedProject !== 'all' || selectedObjective !== 'all') ? (
							<Button onClick={() => navigate('/app/input')}>
								<FileText className="h-4 w-4 mr-2" />
								Add Work Entry
							</Button>
						) : undefined
					}
				/>
			) : (
				<div className="space-y-4">
					{filteredEntries.map((entry) => {
						const isExpanded = expandedEntries.includes(entry.id)

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
												<span className={`text-xs font-medium px-3 py-1 rounded-full ${getCategoryColor(entry.category)}`}>
													{categories.find((c) => c.id === entry.category)?.label}
												</span>
											</div>
											<div className="flex items-center gap-4 ml-8 text-sm text-neutral-600 dark:text-neutral-400 flex-wrap">
												<span className="flex items-center gap-1">
													<Calendar className="h-4 w-4" />
													{formatDate(entry.date)}
												</span>
												{entry.duration && (
													<span className="flex items-center gap-1">
														<Clock className="h-4 w-4" />
														{entry.duration}
													</span>
												)}
												{entry.files.length > 0 && (
													<span className="flex items-center gap-1">
														<Upload className="h-4 w-4" />
														{entry.files.length} file{entry.files.length > 1 ? 's' : ''}
													</span>
												)}
												{entry.links.length > 0 && (
													<span className="flex items-center gap-1">
														<Link2 className="h-4 w-4" />
														{entry.links.length} link{entry.links.length > 1 ? 's' : ''}
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
										<div className="flex items-center gap-2 ml-4">
											<Button variant="outline" size="sm" onClick={() => handleEdit(entry)}>
												<Edit2 className="h-4 w-4" />
											</Button>
											<Button variant="outline" size="sm" onClick={() => handleDelete(entry.id)}>
												<Trash2 className="h-4 w-4 text-red-500" />
											</Button>
										</div>
									</div>

									{/* Preview */}
									{!isExpanded && (
										<div className="ml-8">
											<p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
												{entry.description}
											</p>
											{entry.tags.length > 0 && (
												<div className="flex items-center gap-2 mt-3">
													<Tag className="h-4 w-4 text-neutral-400" />
													<div className="flex flex-wrap gap-2">
														{entry.tags.slice(0, 3).map((tag) => (
															<span
																key={tag}
																className="text-xs px-2 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
															>
																{tag}
															</span>
														))}
														{entry.tags.length > 3 && (
															<span className="text-xs text-neutral-500">
																+{entry.tags.length - 3} more
															</span>
														)}
													</div>
												</div>
											)}
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
											{entry.tags.length > 0 && (
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
											{entry.files.length > 0 && (
												<div>
													<h4 className="font-bold text-sm mb-2 flex items-center gap-2">
														<Upload className="h-4 w-4" />
														Attached Files
													</h4>
													<div className="space-y-2">
														{entry.files.map((file) => (
															<div
																key={file.id}
																className="flex items-center justify-between p-3 border border-neutral-200 dark:border-neutral-800 rounded-xl"
															>
																<div className="flex items-center gap-3 flex-1 min-w-0">
																	<FileText className="h-5 w-5 text-primary flex-shrink-0" />
																	<div className="flex-1 min-w-0">
																		<p className="font-medium text-sm truncate">{file.name}</p>
																		<p className="text-xs text-neutral-600 dark:text-neutral-400">
																			{formatFileSize(file.size)}
																		</p>
																	</div>
																</div>
																<Button variant="outline" size="sm">
																	<Download className="h-4 w-4" />
																</Button>
															</div>
														))}
													</div>
												</div>
											)}

											{/* Links */}
											{entry.links.length > 0 && (
												<div>
													<h4 className="font-bold text-sm mb-2 flex items-center gap-2">
														<Link2 className="h-4 w-4" />
														Linked Resources
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
																<Link2 className="h-5 w-5 text-primary flex-shrink-0" />
																<div className="flex-1 min-w-0">
																	<p className="font-medium text-sm truncate">{link.title}</p>
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
										</div>
									)}
								</CardContent>
							</Card>
						)
					})}
				</div>
			)}
			</div>
		</>
	)
}

