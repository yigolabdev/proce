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
					{ id: 'proj-4', name: 'Data Analytics Platform' },
					{ id: 'proj-5', name: 'Customer Portal V2' },
					{ id: 'proj-6', name: 'Infrastructure Modernization' },
					{ id: 'proj-7', name: 'Marketing Automation' },
					{ id: 'proj-8', name: 'AI/ML Pipeline' },
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
						workTitle: 'Payment Gateway Integration - Stripe & PayPal',
						workDescription: 'Integrated multiple payment gateways (Stripe, PayPal) with comprehensive webhook handlers, subscription management, and automated reconciliation system.',
						projectId: 'proj-3',
						projectName: 'API Integration',
						reviewType: 'approved',
						reviewedBy: 'Emily Davis (CTO)',
						reviewedByDepartment: 'Engineering',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
						reviewComments: 'Outstanding work on the payment gateway integration! 🚀 This is exactly what we needed.\n\n✅ **Technical Excellence:**\n• Secure API key management (AWS Secrets Manager)\n• Proper webhook verification and signature validation\n• Comprehensive error handling with retry logic\n• Transaction logging and audit trail\n• Refund and chargeback functionality\n• Multi-currency support (15 currencies)\n• PCI DSS compliance verified\n\n✅ **Integration Quality:**\n• Stripe: Full integration with subscriptions\n• PayPal: Express Checkout implemented\n• Webhook handling: Idempotent processing\n• Database transactions: ACID compliant\n\n✅ **Testing:**\n• Unit test coverage: 96%\n• Integration tests: All passing\n• Sandbox testing: Completed\n• Error scenarios: Well covered\n\n**Performance:**\n• Payment processing: 850ms avg\n• Webhook processing: 120ms avg\n\nNo issues found in code review. Approved for production!',
						isRead: true,
					},
					{
						id: 'review-4',
						workEntryId: 'work-4',
						workTitle: 'Critical Bug Fix - Payment Processing Failure',
						workDescription: 'Fixed critical production bug where payments were failing for Visa and Mastercard issued by certain European banks. Affected approximately 15% of transactions.',
						projectId: 'proj-3',
						projectName: 'API Integration',
						reviewType: 'rejected',
						reviewedBy: 'David Lee (Senior Engineer)',
						reviewedByDepartment: 'Engineering',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
						reviewComments: '❌ **Unable to approve this submission** due to insufficient technical documentation.\n\n**Critical Information Missing:**\n\n1. **Root Cause Analysis**\n   - What was the specific root cause of the bug?\n   - Was it a code issue, configuration, or third-party service?\n   - Include error logs and stack traces\n\n2. **Affected Scope**\n   - Which card types/banks were affected?\n   - What was the failure rate?\n   - How many customers were impacted?\n   - Revenue impact?\n\n3. **Solution Details**\n   - What was the specific fix applied?\n   - Why does this fix resolve the issue?\n   - Are there any side effects or trade-offs?\n\n4. **Testing & Verification**\n   - How did you test the fix?\n   - Are there unit tests covering this case?\n   - Was this deployed to staging and verified?\n   - Do we have regression tests?\n\n5. **Documentation**\n   - Links to relevant PRs or commits\n   - Before/after behavior documentation\n   - Monitoring/alerting setup\n\n**Required for Resubmission:**\n- Detailed technical write-up (RCA document)\n- Test results and coverage report\n- Staging verification screenshots\n- Post-deployment monitoring plan\n\nThis is a critical production issue and requires thorough documentation for future reference and incident prevention.',
						isRead: true,
					},
					{
						id: 'review-5',
						workEntryId: 'work-5',
						workTitle: 'Mobile App Performance Optimization - Phase 2',
						workDescription: 'Comprehensive performance optimization including app startup time reduction, memory usage optimization, lazy loading implementation, image compression, and offline caching strategy.',
						projectId: 'proj-2',
						projectName: 'Mobile App Development',
						reviewType: 'approved',
						reviewedBy: 'Alex Kim (Mobile Lead)',
						reviewedByDepartment: 'Engineering',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
						reviewComments: 'Impressive performance improvements! 📈 This is exactly the kind of work that makes a real difference for our users.\n\n✅ **Performance Metrics:**\n• App startup time: 4.5s → 1.8s (60% improvement)\n• Cold start: 6.2s → 2.3s (63% improvement)\n• Hot start: 2.1s → 0.9s (57% improvement)\n• Memory usage: 185MB → 102MB (45% reduction)\n• Bundle size: 12.3MB → 4.1MB (67% reduction)\n• FPS during scroll: 45 → 60 (smooth)\n• Time to Interactive: 3.8s → 1.2s\n\n✅ **Technical Implementation:**\n• React.memo and useMemo used strategically\n• Code splitting with React.lazy\n• Image optimization (WebP, lazy loading)\n• Removed unused dependencies (-2.8MB)\n• Optimized re-renders (React DevTools profiling)\n• Memory leaks fixed (detachEvent listeners)\n• Offline caching with service worker\n\n✅ **Testing:**\n• Tested on 5 different devices\n• Performance regression tests added\n• Lighthouse score: 68 → 94\n\n**User Impact:**\nThis will significantly improve user experience, especially on low-end devices. Well done! Approved for deployment.',
						isRead: true,
					},
					{
						id: 'review-6',
						workEntryId: 'work-6',
						workTitle: 'REST API v2.0 Documentation Overhaul',
						workDescription: 'Comprehensive update of REST API documentation including new endpoints, authentication flows, rate limiting policies, webhook guides, and SDK integration examples.',
						projectId: 'proj-3',
						projectName: 'API Integration',
						reviewType: 'changes_requested',
						reviewedBy: 'Rachel Green (Product Manager)',
						reviewedByDepartment: 'Product',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
						reviewComments: 'Thanks for the comprehensive documentation update! The structure and content are good, but we need some improvements to make it developer-friendly:\n\n📝 **Requested Changes:**\n\n1. **Code Examples (High Priority)**\n   - Add authentication examples in 5 languages (JS, Python, Ruby, PHP, Go)\n   - Include full request/response examples\n   - Add cURL examples for each endpoint\n   - Show common integration patterns\n\n2. **Error Handling (High Priority)**\n   - Document all error codes (400, 401, 403, 404, 429, 500, 503)\n   - Include error response format\n   - Add troubleshooting guide\n   - Best practices for retry logic\n\n3. **Rate Limiting (Medium Priority)**\n   - Document rate limits per endpoint\n   - Explain rate limit headers\n   - Add upgrade paths for higher limits\n   - Include example code for handling 429 responses\n\n4. **SDKs & Libraries (Medium Priority)**\n   - Add official SDK links (if available)\n   - Community libraries section\n   - Integration guides for popular frameworks\n\n5. **Getting Started (High Priority)**\n   - Quick start guide (5-minute integration)\n   - Common use cases and recipes\n   - Video tutorials (if available)\n\n**Additional Notes:**\n- Please have the technical writing team review for consistency and tone\n- Consider adding an interactive API explorer (like Swagger UI)\n- Add changelog section for version history\n\nLet me know when you\'ve made these updates!',
						isRead: true,
					},
					{
						id: 'review-7',
						workEntryId: 'work-7',
						workTitle: 'Q4 Security Audit & Penetration Testing',
						workDescription: 'Conducted comprehensive security audit including automated scanning, manual penetration testing, code review, and compliance verification for OWASP Top 10, SOC 2, and GDPR requirements.',
						projectId: 'proj-3',
						projectName: 'API Integration',
						reviewType: 'approved',
						reviewedBy: 'Tom Wilson (Security Lead)',
						reviewedByDepartment: 'Security',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
						reviewComments: 'Thorough and professional security audit! 🔒 This is exemplary work.\n\n✅ **Findings Summary:**\n• Critical: 0 vulnerabilities ✅\n• High: 2 (SQL injection risk, XSS vulnerability - both fixed) ✅\n• Medium: 5 (4 fixed, 1 scheduled for next sprint) ✅\n• Low: 12 (documented with remediation plan) ✅\n• Info: 8 (best practice recommendations)\n\n✅ **Security Testing Coverage:**\n• Automated scans: OWASP ZAP, Burp Suite\n• Manual penetration testing: 40+ attack vectors\n• Code review: 100% of critical components\n• Dependency scanning: npm audit, Snyk\n• Authentication testing: OAuth flows, JWT validation\n• Authorization testing: RBAC implementation\n• Input validation: SQL injection, XSS, CSRF\n• Session management: Token expiry, refresh flows\n\n✅ **Compliance Verification:**\n• OWASP Top 10 2021: All items addressed\n• SOC 2 Type II: Controls implemented\n• GDPR: Data protection verified\n• PCI DSS: Payment security compliant\n\n✅ **Remediation Status:**\n• Critical issues: Fixed immediately\n• High priority: Fixed within 48 hours\n• Medium priority: 80% complete\n• Low priority: Documented and scheduled\n\n**Recommendations:**\n1. Implement security monitoring dashboard\n2. Set up automated vulnerability scanning\n3. Conduct quarterly security training\n4. Enable CSP headers on all endpoints\n\nAll critical and high-priority issues resolved. Approved!',
						isRead: true,
					},
					{
						id: 'review-8',
						workEntryId: 'work-8',
						workTitle: 'Sprint Planning & Architecture Discussion',
						workDescription: 'Participated in sprint planning meeting and led architecture discussion for new microservices design.',
						projectId: 'proj-2',
						projectName: 'Mobile App Development',
						reviewType: 'rejected',
						reviewedBy: 'Sarah Chen (Tech Lead)',
						reviewedByDepartment: 'Engineering',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
						reviewComments: '❌ **This submission needs significant improvement** to be approved.\n\n**Issues with Current Submission:**\n- Too vague and generic\n- Lacks specific contributions and outcomes\n- No actionable information\n\n**Required Information for Meeting Submissions:**\n\n1. **Meeting Context**\n   - Meeting date, time, duration\n   - Attendees and their roles\n   - Meeting objectives\n\n2. **Discussion Topics**\n   - Detailed agenda items discussed\n   - Your specific contributions to each topic\n   - Alternative solutions proposed\n   - Technical challenges identified\n\n3. **Decisions Made**\n   - What decisions were finalized?\n   - What was the rationale?\n   - Who made the final call?\n   - What were the alternatives considered?\n\n4. **Action Items**\n   - Tasks assigned to you (with deadlines)\n   - Dependencies identified\n   - Resources needed\n   - Blockers or risks\n\n5. **Architecture Discussion**\n   - Design diagrams or sketches\n   - Technology choices made\n   - Scalability considerations\n   - Security implications\n\n**Example of Good Meeting Submission:**\n"Sprint Planning - Discussed 15 stories, I led the architecture design for the new notification microservice. Proposed event-driven architecture using Kafka, estimated at 3 weeks. Identified dependency on Auth service upgrade. Action items: Create design doc (due Friday), POC for message queue (due next Mon)."\n\nPlease resubmit with meaningful, specific details about your contributions and outcomes.',
						isRead: true,
					},
					{
						id: 'review-9',
						workEntryId: 'work-9',
						workTitle: 'Database Migration & Optimization',
						workDescription: 'Migrated database from PostgreSQL 12 to 14, optimized slow queries, added indexes, and implemented connection pooling.',
						projectId: 'proj-6',
						projectName: 'Infrastructure Modernization',
						reviewType: 'approved',
						reviewedBy: 'Chris Park (DevOps Lead)',
						reviewedByDepartment: 'DevOps',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
						reviewComments: 'Excellent database migration and optimization work! 🎯\n\n✅ **Migration Success:**\n• Zero downtime migration executed flawlessly\n• All data integrity checks passed\n• Rollback plan tested and documented\n• Migration completed in 3.5 hours (under 4hr window)\n\n✅ **Performance Improvements:**\n• Query response time: -73% average\n• Slow queries (>1s): 45 → 3\n• Database CPU usage: -42%\n• Connection pool efficiency: +85%\n• Index hit rate: 67% → 94%\n\n✅ **Optimization Details:**\n• Created 12 new indexes on hot paths\n• Rewrote 8 N+1 queries\n• Implemented query result caching\n• Added monitoring alerts\n\n**Before/After Metrics:**\n• User dashboard load: 2.1s → 0.6s\n• Report generation: 8.5s → 1.2s\n• Analytics queries: 15s → 2.3s\n\nProduction deployment verified. Approved!',
						isRead: true,
					},
					{
						id: 'review-10',
						workEntryId: 'work-10',
						workTitle: 'Customer Support Chat Integration',
						workDescription: 'Integrated Intercom live chat system with user context passing and automated routing.',
						projectId: 'proj-5',
						projectName: 'Customer Portal V2',
						reviewType: 'approved',
						reviewedBy: 'Lisa Anderson (Customer Success)',
						reviewedByDepartment: 'Customer Success',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8),
						reviewComments: 'This integration has already made a huge difference! 🎉\n\n✅ **Feature Implementation:**\n• Live chat widget seamlessly integrated\n• User context (name, email, plan) passed automatically\n• Conversation history synchronized\n• Smart routing to correct team\n• Offline message handling\n• Mobile responsive\n\n✅ **Business Impact:**\n• Response time: 15 min → 2 min (87% improvement)\n• Customer satisfaction: +32%\n• Support ticket volume: -45%\n• First response rate: 94%\n• Resolution time: -38%\n\n✅ **Technical Quality:**\n• No performance impact on page load\n• Proper error handling\n• Privacy controls implemented\n• Analytics integration working\n\nOur support team loves it! Approved and thank you!',
						isRead: true,
					},
					{
						id: 'review-11',
						workEntryId: 'work-11',
						workTitle: 'Machine Learning Model Training - User Behavior Prediction',
						workDescription: 'Trained and deployed ML model for predicting user churn and behavior patterns.',
						projectId: 'proj-8',
						projectName: 'AI/ML Pipeline',
						reviewType: 'changes_requested',
						reviewedBy: 'Dr. Jennifer Lee (Data Science Lead)',
						reviewedByDepartment: 'Data Science',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9),
						reviewComments: 'Good work on the ML model! The approach is sound but needs refinement:\n\n📝 **Required Improvements:**\n\n1. **Model Performance (Critical)**\n   - Current accuracy: 78% (need 85%+ for production)\n   - Precision: 72% (too many false positives)\n   - Recall: 81% (acceptable but can improve)\n   - F1 score: 0.76 (target: 0.82)\n   - Try ensemble methods or neural networks\n\n2. **Feature Engineering**\n   - Add temporal features (time-based patterns)\n   - Include interaction features\n   - Consider user segmentation\n   - Remove 3 low-importance features\n\n3. **Data Quality**\n   - Training data needs rebalancing (70/30 → 60/40)\n   - Add more recent data (last 30 days)\n   - Handle missing values better\n   - Outlier detection and treatment\n\n4. **Model Validation**\n   - Add cross-validation results\n   - Test on holdout dataset\n   - Perform bias analysis\n   - Document failure cases\n\n5. **Documentation**\n   - Model card with performance metrics\n   - Feature importance analysis\n   - Business impact projection\n   - Monitoring and retraining plan\n\nPlease improve the model accuracy and resubmit with complete documentation.',
						isRead: true,
					},
					{
						id: 'review-12',
						workEntryId: 'work-12',
						workTitle: 'Email Marketing Campaign - Q4 Product Launch',
						workDescription: 'Designed and executed email marketing campaign for new product launch with A/B testing and analytics.',
						projectId: 'proj-7',
						projectName: 'Marketing Automation',
						reviewType: 'approved',
						reviewedBy: 'Amanda Foster (Marketing Director)',
						reviewedByDepartment: 'Marketing',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
						reviewComments: 'Outstanding campaign execution! 🚀 Best results we\'ve seen this year.\n\n✅ **Campaign Performance:**\n• Emails sent: 45,000\n• Open rate: 34.5% (industry avg: 21%)\n• Click-through rate: 12.8% (industry avg: 2.6%)\n• Conversion rate: 8.2% (target was 5%)\n• Revenue generated: $127,000\n• ROI: 380%\n\n✅ **A/B Testing Results:**\n• Tested: Subject lines, CTA buttons, send times\n• Winner: Version B (personalized subject line)\n• Statistical significance: 99.5%\n• Lift: +42% conversions\n\n✅ **Segmentation Strategy:**\n• 5 customer segments targeted\n• Personalized content for each\n• Dynamic product recommendations\n• Timezone-optimized send times\n\n✅ **Technical Execution:**\n• Email deliverability: 98.7%\n• Unsubscribe rate: 0.3% (very low)\n• Spam complaints: 0.02% (excellent)\n• Mobile optimization: 65% opened on mobile\n\nExceptional work! This campaign exceeded all our targets. Approved!',
						isRead: false,
					},
					{
						id: 'review-13',
						workEntryId: 'work-13',
						workTitle: 'GraphQL API Implementation',
						workDescription: 'Implemented GraphQL API layer as alternative to REST, with schema design and resolver functions.',
						projectId: 'proj-3',
						projectName: 'API Integration',
						reviewType: 'changes_requested',
						reviewedBy: 'Robert Zhang (Backend Architect)',
						reviewedByDepartment: 'Engineering',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 11),
						reviewComments: 'Good start on GraphQL implementation! The schema design is solid but needs some refinements:\n\n📝 **Changes Needed:**\n\n1. **Performance Issues (High)**\n   - N+1 query problem in user resolver\n   - Use DataLoader for batching\n   - Add query complexity limits\n   - Implement depth limiting\n\n2. **Error Handling (High)**\n   - Generic errors exposed to client\n   - Add proper error codes\n   - Implement error masking for security\n   - Better validation error messages\n\n3. **Schema Design (Medium)**\n   - Some fields should be non-nullable\n   - Add pagination to all list fields\n   - Consider adding filtering/sorting args\n   - Deprecate old fields properly\n\n4. **Authorization (Critical)**\n   - Missing field-level authorization\n   - Implement directive-based auth\n   - Add rate limiting per resolver\n\n5. **Documentation (Medium)**\n   - Add descriptions to all types\n   - Document query examples\n   - Add playground with auth\n\nPlease fix the Critical and High priority items first.',
						isRead: false,
					},
					{
						id: 'review-14',
						workEntryId: 'work-14',
						workTitle: 'CI/CD Pipeline Modernization',
						workDescription: 'Migrated CI/CD from Jenkins to GitHub Actions, implemented automated testing, security scanning, and multi-environment deployments.',
						projectId: 'proj-6',
						projectName: 'Infrastructure Modernization',
						reviewType: 'approved',
						reviewedBy: 'Chris Park (DevOps Lead)',
						reviewedByDepartment: 'DevOps',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
						reviewComments: 'Fantastic CI/CD modernization! 🚀 This is a game-changer for our deployment velocity.\n\n✅ **Pipeline Improvements:**\n• Build time: 12 min → 4.5 min (62% faster)\n• Deployment time: 25 min → 8 min (68% faster)\n• Pipeline success rate: 78% → 96%\n• Parallel job execution\n• Smart caching implemented\n\n✅ **Automation Added:**\n• Automated testing (unit, integration, e2e)\n• Security scanning (SAST, DAST, dependency check)\n• Code quality gates (SonarQube)\n• Automated rollback on failure\n• Slack notifications\n• Automated changelog generation\n\n✅ **Multi-Environment Support:**\n• Dev → Staging → Production pipeline\n• Environment-specific configurations\n• Blue-green deployments\n• Canary releases (10% → 50% → 100%)\n\n✅ **Cost Optimization:**\n• GitHub Actions minutes: 40% reduction\n• Spot instances for test runs\n• Intelligent build caching\n\n**Developer Experience:**\n• PR previews: Automatic\n• Test results: Inline comments\n• Deployment status: Real-time dashboard\n\nThis will dramatically improve our development workflow. Approved!',
						isRead: true,
					},
					{
						id: 'review-15',
						workEntryId: 'work-15',
						workTitle: 'User Onboarding Flow Redesign',
						workDescription: 'Redesigned user onboarding experience with interactive tutorials and progress tracking.',
						projectId: 'proj-5',
						projectName: 'Customer Portal V2',
						reviewType: 'approved',
						reviewedBy: 'Nina Patel (Product Designer)',
						reviewedByDepartment: 'Design',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 13),
						reviewComments: 'Beautiful onboarding redesign! 🎨 The user experience is significantly improved.\n\n✅ **Design Quality:**\n• Modern, clean interface\n• Consistent with design system\n• Smooth animations and transitions\n• Accessibility standards met (WCAG AA)\n• Mobile-first approach\n\n✅ **User Testing Results:**\n• Completion rate: 45% → 87% 🎯\n• Time to complete: 12 min → 5 min\n• User satisfaction: 7.2 → 9.1/10\n• Support tickets: -68%\n• Feature discovery: +156%\n\n✅ **Features Implemented:**\n• Interactive tooltips and hints\n• Progress indicators (5 steps)\n• Skip option for advanced users\n• Contextual help system\n• Video tutorials embedded\n• Personalized recommendations\n\n✅ **Technical Implementation:**\n• Performance optimized\n• Analytics events tracked\n• Responsive design tested on 10+ devices\n• Loading states polished\n\nThis will significantly reduce churn. Approved!',
						isRead: false,
					},
					{
						id: 'review-16',
						workEntryId: 'work-16',
						workTitle: 'Real-time Analytics Dashboard',
						workDescription: 'Built real-time analytics dashboard using WebSocket connections and data streaming.',
						projectId: 'proj-4',
						projectName: 'Data Analytics Platform',
						reviewType: 'approved',
						reviewedBy: 'Kevin Huang (Data Engineer)',
						reviewedByDepartment: 'Data Engineering',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
						reviewComments: 'Impressive real-time dashboard implementation! 📊\n\n✅ **Technical Architecture:**\n• WebSocket connections stable\n• Redis pub/sub for data streaming\n• Efficient data aggregation\n• Smart throttling (updates every 2s)\n• Automatic reconnection logic\n• Fallback to polling if WebSocket fails\n\n✅ **Performance:**\n• Data latency: <500ms\n• Update frequency: 2 seconds\n• CPU usage: <5% (very efficient)\n• Memory: Stable (no leaks)\n• Concurrent users tested: 500+\n\n✅ **Visualizations:**\n• 8 chart types implemented\n• Interactive filtering\n• Export to CSV/PDF\n• Custom date ranges\n• Drill-down capabilities\n\n✅ **Data Accuracy:**\n• All calculations verified\n• Edge cases handled\n• Missing data handled gracefully\n\nThis gives leadership real-time insights. Approved!',
						isRead: true,
					},
					{
						id: 'review-17',
						workEntryId: 'work-17',
						workTitle: 'Code Refactoring - Legacy Authentication Module',
						workDescription: 'Refactored legacy authentication code to improve maintainability.',
						projectId: 'proj-6',
						projectName: 'Infrastructure Modernization',
						reviewType: 'changes_requested',
						reviewedBy: 'Sarah Chen (Tech Lead)',
						reviewedByDepartment: 'Engineering',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
						reviewComments: 'Thanks for tackling this legacy code! Good effort, but needs more work:\n\n📝 **Issues Found:**\n\n1. **Testing Coverage (Critical)**\n   - Current coverage: 45% (need 80%+)\n   - No integration tests\n   - Edge cases not covered\n   - **Action:** Add comprehensive tests before merging\n\n2. **Breaking Changes (Critical)**\n   - Changed public API signatures\n   - Will break 3 dependent services\n   - **Action:** Maintain backward compatibility or coordinate migration\n\n3. **Code Quality (Medium)**\n   - Some functions still too long (>50 lines)\n   - Magic numbers not extracted to constants\n   - Error messages need i18n support\n   - **Action:** Further refactoring needed\n\n4. **Documentation (Medium)**\n   - Migration guide missing\n   - API changes not documented\n   - **Action:** Add detailed migration docs\n\n5. **Performance Regression (High)**\n   - Login time increased by 200ms\n   - **Action:** Profile and optimize\n\n**Required Before Approval:**\n- Increase test coverage to 80%+\n- Fix breaking changes or coordinate migration\n- Resolve performance regression\n\nGood start, but needs more iteration.',
						isRead: false,
					},
					{
						id: 'review-18',
						workEntryId: 'work-18',
						workTitle: 'Mobile Push Notification System',
						workDescription: 'Implemented push notification system for iOS and Android with segmentation and scheduling capabilities.',
						projectId: 'proj-2',
						projectName: 'Mobile App Development',
						reviewType: 'approved',
						reviewedBy: 'Alex Kim (Mobile Lead)',
						reviewedByDepartment: 'Engineering',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 16),
						reviewComments: 'Excellent push notification implementation! 🔔\n\n✅ **Platform Support:**\n• iOS: APNs integration working perfectly\n• Android: FCM integration complete\n• Web: Push API support added\n• Token management: Automatic refresh\n• Permission handling: User-friendly prompts\n\n✅ **Features:**\n• Rich notifications (images, actions)\n• Deep linking to app screens\n• Notification grouping\n• Quiet hours support\n• User preference management\n• A/B testing support\n• Scheduled notifications\n• Geofencing triggers\n\n✅ **Targeting & Segmentation:**\n• User segments (behavioral, demographic)\n• Custom audience targeting\n• Frequency capping\n• Re-engagement campaigns\n\n✅ **Analytics:**\n• Delivery rate: 97.5%\n• Open rate: 23% (excellent)\n• Action rate: 8.5%\n• Opt-out rate: 1.2% (very low)\n\n✅ **Technical Quality:**\n• Queue system: Redis-backed\n• Retry logic: Exponential backoff\n• Error handling: Comprehensive\n• Monitoring: Full observability\n\nThis will greatly improve user engagement. Approved!',
						isRead: true,
					},
					{
						id: 'review-19',
						workEntryId: 'work-19',
						workTitle: 'Product Requirements Document - New Feature',
						workDescription: 'Created PRD for upcoming collaboration feature with user stories and acceptance criteria.',
						projectId: 'proj-5',
						projectName: 'Customer Portal V2',
						reviewType: 'changes_requested',
						reviewedBy: 'Rachel Green (Product Manager)',
						reviewedByDepartment: 'Product',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 17),
						reviewComments: 'Good start on the PRD! The user stories are clear, but we need more detail:\n\n📝 **Required Additions:**\n\n1. **User Research (Critical)**\n   - Add user interview insights (need 10+ interviews)\n   - Include competitive analysis\n   - Add user personas affected\n   - Show problem validation data\n\n2. **Success Metrics (Critical)**\n   - Define specific KPIs\n   - Set measurable targets\n   - Add tracking plan\n   - Include baseline metrics\n\n3. **Technical Specifications (High)**\n   - Add technical architecture overview\n   - Database schema changes\n   - API endpoints needed\n   - Third-party integrations\n   - Performance requirements\n\n4. **User Stories (Medium)**\n   - Current stories too high-level\n   - Add edge cases and error scenarios\n   - Include accessibility requirements\n   - Add internationalization needs\n\n5. **Design Requirements (High)**\n   - Missing wireframes/mockups\n   - No mobile design specified\n   - Add interaction flows\n   - Specify animations/transitions\n\n6. **Timeline & Resources**\n   - Estimated effort missing\n   - Dependencies not identified\n   - Resource allocation unclear\n\nPlease work with Design and Engineering to complete these sections.',
						isRead: false,
					},
					{
						id: 'review-20',
						workEntryId: 'work-20',
						workTitle: 'API Rate Limiting & Throttling Implementation',
						workDescription: 'Implemented comprehensive rate limiting system with Redis-backed token bucket algorithm and tiered limits.',
						projectId: 'proj-3',
						projectName: 'API Integration',
						reviewType: 'approved',
						reviewedBy: 'Emily Davis (CTO)',
						reviewedByDepartment: 'Engineering',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18),
						reviewComments: 'Excellent rate limiting implementation! 🛡️ This protects our infrastructure effectively.\n\n✅ **Rate Limiting Strategy:**\n• Free tier: 100 req/hour\n• Pro tier: 1,000 req/hour\n• Enterprise: 10,000 req/hour\n• Burst allowance: 2x sustained rate\n• Sliding window algorithm\n• Per-endpoint granular limits\n\n✅ **Technical Implementation:**\n• Redis-backed token bucket\n• Distributed rate limiting (works in cluster)\n• Graceful degradation\n• Clear error messages (HTTP 429)\n• Retry-After header\n• Rate limit info in response headers\n\n✅ **Performance:**\n• Latency overhead: <2ms\n• Redis operations optimized\n• Connection pooling efficient\n• Handles 50K req/sec\n\n✅ **Monitoring:**\n• Real-time metrics dashboard\n• Alerts for rate limit violations\n• Per-user analytics\n• Abuse detection\n\n✅ **Documentation:**\n• Clear rate limit policies\n• Upgrade paths documented\n• Error handling examples\n\nPerfect implementation. Approved!',
						isRead: true,
					},
					{
						id: 'review-21',
						workEntryId: 'work-21',
						workTitle: 'Customer Feedback Analysis Report',
						workDescription: 'Analyzed 500+ customer feedback submissions and created actionable insights report.',
						projectId: 'proj-5',
						projectName: 'Customer Portal V2',
						reviewType: 'approved',
						reviewedBy: 'Lisa Anderson (Customer Success)',
						reviewedByDepartment: 'Customer Success',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
						reviewComments: 'Comprehensive and insightful analysis! 📊 This is exactly what we needed.\n\n✅ **Analysis Scope:**\n• Total feedback reviewed: 547 submissions\n• Time period: Q3 2024 (3 months)\n• Response rate: 28% (above target)\n• Sentiment analysis completed\n\n✅ **Key Findings:**\n• Positive feedback: 68%\n• Neutral: 21%\n• Negative: 11%\n• NPS Score: 42 (good, up from 35)\n• Top requested feature: Dark mode (implemented!) ✅\n\n✅ **Themes Identified:**\n1. Performance (mentioned 127 times) - needs attention\n2. Mobile UX (mentioned 89 times) - in progress\n3. Customer support (mentioned 67 times) - improved\n4. Pricing (mentioned 54 times) - under review\n5. Integration requests (mentioned 43 times) - roadmapped\n\n✅ **Actionable Recommendations:**\n• Prioritize performance improvements (high impact)\n• Improve mobile navigation (quick win)\n• Add live chat support (already approved)\n• Review pricing tiers (leadership buy-in needed)\n• Build Slack/Teams integrations (Q1 2025)\n\n✅ **Competitive Analysis:**\n• Feature gaps vs competitors identified\n• Unique strengths highlighted\n• Pricing comparison included\n\nGreat work providing actionable insights! Approved.',
						isRead: true,
					},
					{
						id: 'review-22',
						workEntryId: 'work-22',
						workTitle: 'Docker & Kubernetes Migration',
						workDescription: 'Migrated application infrastructure from VMs to Kubernetes cluster.',
						projectId: 'proj-6',
						projectName: 'Infrastructure Modernization',
						reviewType: 'changes_requested',
						reviewedBy: 'Chris Park (DevOps Lead)',
						reviewedByDepartment: 'DevOps',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21),
						reviewComments: 'Good progress on K8s migration, but critical issues need addressing:\n\n📝 **Critical Issues:**\n\n1. **Security Vulnerabilities**\n   - Base images using :latest tag (use specific versions)\n   - Running containers as root (security risk)\n   - Secrets in environment variables (use K8s secrets)\n   - No network policies defined\n   - Missing Pod Security Policies\n\n2. **Resource Management**\n   - No resource limits defined (CPU/memory)\n   - No resource requests set\n   - Risk of noisy neighbor problems\n   - No autoscaling configured\n\n3. **High Availability**\n   - Single replica for critical services\n   - No pod disruption budgets\n   - Missing health checks\n   - No readiness probes\n\n4. **Monitoring & Logging**\n   - Missing Prometheus metrics\n   - No centralized logging\n   - No alerting rules\n   - Missing dashboards\n\n5. **Deployment Strategy**\n   - Using Recreate instead of RollingUpdate\n   - No rollback plan documented\n   - Missing smoke tests\n\n**Must Fix Before Approval:**\n- Security issues (all of them)\n- Add resource limits/requests\n- Implement health checks\n- Set up monitoring\n\nPlease address these critical items.',
						isRead: false,
					},
					{
						id: 'review-23',
						workEntryId: 'work-23',
						workTitle: 'Automated Testing Framework Implementation',
						workDescription: 'Set up comprehensive automated testing framework including unit, integration, and E2E tests with CI integration.',
						projectId: 'proj-6',
						projectName: 'Infrastructure Modernization',
						reviewType: 'approved',
						reviewedBy: 'David Lee (Senior Engineer)',
						reviewedByDepartment: 'Engineering',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 22),
						reviewComments: 'Outstanding testing infrastructure! 🧪 This is a major quality improvement.\n\n✅ **Testing Coverage:**\n• Unit tests: 847 tests (92% coverage)\n• Integration tests: 156 tests\n• E2E tests: 43 critical flows\n• Visual regression: 28 pages\n• API contract tests: All endpoints\n• Performance tests: Load/stress scenarios\n\n✅ **Framework Setup:**\n• Jest for unit/integration tests\n• Playwright for E2E tests\n• Percy for visual regression\n• K6 for performance testing\n• MSW for API mocking\n• Testing Library for React components\n\n✅ **CI Integration:**\n• Parallel test execution (5x faster)\n• Automatic retry on flaky tests\n• Test reports in PR comments\n• Coverage tracking over time\n• Failed test screenshots\n• Video recordings of E2E failures\n\n✅ **Developer Experience:**\n• Fast test execution (<3min locally)\n• Clear error messages\n• Easy to add new tests\n• Good documentation\n• VSCode test runner integration\n\n**Impact:**\n• Bug detection: +340% in pre-merge\n• Production incidents: -62%\n• Developer confidence: High\n• Regression prevention: Working well\n\nThis foundation will serve us for years. Approved!',
						isRead: true,
					},
					{
						id: 'review-24',
						workEntryId: 'work-24',
						workTitle: 'SEO Optimization & Content Strategy',
						workDescription: 'Implemented SEO best practices and created content strategy for organic growth.',
						projectId: 'proj-1',
						projectName: 'Website Redesign',
						reviewType: 'approved',
						reviewedBy: 'Amanda Foster (Marketing Director)',
						reviewedByDepartment: 'Marketing',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 23),
						reviewComments: 'Fantastic SEO work! 🎯 Already seeing positive results.\n\n✅ **Technical SEO:**\n• Page speed score: 45 → 94 ✅\n• Mobile-friendly test: Passed\n• Core Web Vitals: All green\n• Structured data: Schema.org markup\n• XML sitemap: Generated & submitted\n• Robots.txt: Optimized\n• Canonical URLs: Implemented\n• 404 pages: Custom & helpful\n\n✅ **On-Page SEO:**\n• Title tags: Optimized (50-60 chars)\n• Meta descriptions: Compelling (150-160 chars)\n• H1-H6 hierarchy: Proper structure\n• Alt text: All images covered\n• Internal linking: Strategic\n• URL structure: Clean & meaningful\n\n✅ **Content Strategy:**\n• Keyword research: 200+ target keywords\n• Content calendar: 3 months planned\n• Blog posts: 12 articles drafted\n• Topic clusters: 5 pillar pages\n• FAQ pages: Created\n\n✅ **Early Results (2 weeks):**\n• Organic traffic: +45%\n• Google rankings: 15 keywords in top 10\n• Click-through rate: +38%\n• Bounce rate: -22%\n• Time on page: +67%\n\n**Next Steps:**\n- Monitor rankings weekly\n- Adjust content based on performance\n- Build high-quality backlinks\n\nGreat work! Approved.',
						isRead: false,
					},
					{
						id: 'review-25',
						workEntryId: 'work-25',
						workTitle: 'Data Lake Architecture & ETL Pipeline',
						workDescription: 'Designed and implemented data lake architecture with automated ETL pipelines for analytics.',
						projectId: 'proj-4',
						projectName: 'Data Analytics Platform',
						reviewType: 'approved',
						reviewedBy: 'Kevin Huang (Data Engineer)',
						reviewedByDepartment: 'Data Engineering',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25),
						reviewComments: 'Impressive data engineering work! 🏗️ Solid architecture and implementation.\n\n✅ **Architecture Design:**\n• AWS S3 for data lake storage\n• Apache Airflow for orchestration\n• dbt for transformations\n• Snowflake for data warehouse\n• Lambda for event processing\n• Well-documented architecture diagrams\n\n✅ **ETL Pipelines:**\n• 15 data sources integrated\n• Incremental loading implemented\n• Data validation at each stage\n• Error handling and retry logic\n• Data quality checks\n• Automated schema evolution\n• Partitioning strategy optimized\n\n✅ **Data Quality:**\n• Completeness: 99.7%\n• Accuracy: Manual validation passed\n• Freshness: <15 min latency\n• Consistency: Referential integrity maintained\n• Deduplication: Working correctly\n\n✅ **Performance:**\n• Daily data volume: 2.5TB processed\n• Processing time: 3.2 hours (well under SLA)\n• Cost optimization: 40% reduction vs previous\n• Query performance: <5s for 90% of queries\n\n✅ **Monitoring:**\n• Pipeline success rate: 99.2%\n• Alerting on failures\n• Data lineage tracking\n• Cost monitoring dashboards\n\n**Business Impact:**\n• Analytics team: 5x more productive\n• Report generation: Automated (was manual)\n• Data-driven decisions: Faster\n\nExcellent work! Approved for production.',
						isRead: true,
					},
					{
						id: 'review-26',
						workEntryId: 'work-26',
						workTitle: 'Accessibility Compliance Audit & Fixes',
						workDescription: 'Comprehensive accessibility audit and implementation of WCAG 2.1 AA compliance fixes.',
						projectId: 'proj-1',
						projectName: 'Website Redesign',
						reviewType: 'approved',
						reviewedBy: 'Nina Patel (Product Designer)',
						reviewedByDepartment: 'Design',
						reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 27),
						reviewComments: 'Exceptional accessibility work! ♿ This makes our product usable for everyone.\n\n✅ **WCAG 2.1 AA Compliance:**\n• Color contrast: All issues fixed (4.5:1+)\n• Keyboard navigation: Fully functional\n• Screen reader support: ARIA labels added\n• Focus indicators: Visible and consistent\n• Form labels: All forms accessible\n• Alt text: All images covered\n• Heading hierarchy: Proper structure\n• Skip links: Implemented\n\n✅ **Testing Results:**\n• Automated tools: 0 errors (axe, WAVE)\n• Manual testing: Screen reader verified\n• Keyboard-only: All features accessible\n• Color blindness: Tested with simulators\n• Tested with: JAWS, NVDA, VoiceOver\n\n✅ **Improvements Made:**\n• 127 contrast issues fixed\n• 43 ARIA labels added\n• 18 keyboard traps removed\n• 31 form improvements\n• 12 focus order fixes\n\n✅ **Documentation:**\n• Accessibility guidelines created\n• Testing checklist for developers\n• ARIA pattern library\n• Training materials prepared\n\n**Impact:**\n• Accessibility score: 67 → 98\n• Potential user base: +15% (people with disabilities)\n• Legal risk: Significantly reduced\n• Brand reputation: Enhanced\n\nThis is important work that\'s often overlooked. Thank you! Approved.',
						isRead: false,
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
			
			{/* Header */}
			<PageHeader
				title="Received Reviews"
				description="View and manage feedback on your work submissions"
				icon={MessageSquare}
			/>
			
			<div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
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
