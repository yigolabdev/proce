import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { I18nProvider } from '../i18n/I18nProvider'
import { ThemeProvider } from '../theme/ThemeProvider'
import { IntegrationsProvider } from '../app/_providers/IntegrationsContext'
import { AuthProvider } from '../context/AuthContext'
import { RhythmProvider } from '../context/RhythmContext'
import AppLayout from '../components/layout/AppLayout'

// Loading component for code splitting
function PageLoader() {
	return (
		<div className="flex items-center justify-center min-h-[60vh]">
			<div className="flex flex-col items-center gap-4">
				<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
				<p className="text-sm text-neutral-400">Loading...</p>
			</div>
		</div>
	)
}

// Error Boundary Component
function RouteError() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-neutral-950">
			<div className="text-center p-6">
				<h2 className="text-2xl font-bold text-neutral-100 mb-2">Something went wrong</h2>
				<p className="text-neutral-400 mb-6">Failed to load this page. Please try refreshing.</p>
				<button
					onClick={() => window.location.reload()}
					className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
				>
					Refresh Page
				</button>
			</div>
		</div>
	)
}

// Lazy load pages for better performance (Code Splitting)
const LandingPage = lazy(() => import('../pages/LandingPage'))

// Auth Pages
const SignUpPage = lazy(() => import('../app/auth/sign-up/page'))
const ForgotPasswordPage = lazy(() => import('../app/auth/forgot-password/page'))
const CompanySignUpPage = lazy(() => import('../app/auth/company-signup/page'))
const EmployeeSignUpPage = lazy(() => import('../app/auth/employee-signup/page'))
const JoinWorkspacePage = lazy(() => import('../app/auth/join/page'))
const OnboardingPage = lazy(() => import('../app/auth/onboarding/page'))

// Work Pages
const DashboardPage = lazy(() => import('../pages/DashboardPage'))
const InputPage = lazy(() => import('../pages/InputPage'))
const ProjectsPage = lazy(() => import('../app/projects/page'))
const ProjectDetailPage = lazy(() => import('../app/projects/detail/page'))
const ProjectRecommendationsPage = lazy(() => import('../app/projects/recommendations/page'))
const WorkHistoryPage = lazy(() => import('../app/work-history/page'))
const WorkReviewPage = lazy(() => import('../app/work-review/page'))
const MessagesPage = lazy(() => import('../app/messages/page'))
const AIRecommendationsPage = lazy(() => import('../app/ai-recommendations/page'))
// const OKRPage = lazy(() => import('../app/okr/page'))

// Admin Pages
const UsersManagementPage = lazy(() => import('../app/admin/users/page'))
const SystemSettingsPage = lazy(() => import('../app/admin/system-settings/page'))
const CompanySettingsPage = lazy(() => import('../app/admin/company-settings/page'))

// Executive Pages
const ExecutiveDashboardPage = lazy(() => import('../app/executive/page'))
const ExecutiveGoalsPage = lazy(() => import('../app/executive/goals/page'))
const PerformancePage = lazy(() => import('../app/performance/page'))

// Other Pages
const IntegrationsPage = lazy(() => import('../app/integrations/page'))
const SettingsPage = lazy(() => import('../app/settings/page'))

// 404 Not Found Page Component
function NotFoundPage() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-neutral-950">
			<div className="text-center">
				<h1 className="text-6xl font-bold text-neutral-100 mb-4">404</h1>
				<p className="text-xl text-neutral-400 mb-8">Page not found</p>
				<a
					href="/"
					className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
				>
					Go back home
				</a>
			</div>
		</div>
	)
}

// QueryClient 설정 - 기본 옵션 추가
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5분
			gcTime: 1000 * 60 * 10, // 10분 (구 cacheTime)
			retry: 1,
			refetchOnWindowFocus: false,
		},
	},
})

// Helper to wrap lazy components with Suspense
const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType>) => (
	<Suspense fallback={<PageLoader />}>
		<Component />
	</Suspense>
)

// Build app routes with conditional dev routes
const appRoutes = [
	// 작업자 메뉴
	{ path: 'dashboard', element: withSuspense(DashboardPage) },
	{ path: 'input', element: withSuspense(InputPage) },
	{ path: 'projects/recommendations', element: withSuspense(ProjectRecommendationsPage) },
	{ path: 'projects/:id', element: withSuspense(ProjectDetailPage) },
	{ path: 'projects', element: withSuspense(ProjectsPage) },
	{ path: 'work-history', element: withSuspense(WorkHistoryPage) },
	{ path: 'work-review', element: withSuspense(WorkReviewPage) },
	{ path: 'messages', element: withSuspense(MessagesPage) },
	{ path: 'ai-recommendations', element: withSuspense(AIRecommendationsPage) },
	{ path: 'inbox', element: <Navigate to="/app/messages" replace /> },
	// { path: 'okr', element: withSuspense(OKRPage) },
	// 관리자 메뉴
	{ path: 'admin/users', element: withSuspense(UsersManagementPage) },
	{ path: 'admin/system-settings', element: withSuspense(SystemSettingsPage) },
	{ path: 'admin/company-settings', element: withSuspense(CompanySettingsPage), errorElement: <RouteError /> },
	// 임원 메뉴
	{ path: 'executive', element: withSuspense(ExecutiveDashboardPage) },
	{ path: 'executive/goals', element: withSuspense(ExecutiveGoalsPage) },
	{ path: 'analytics', element: <Navigate to="/app/executive" replace /> },
	{ path: 'performance', element: withSuspense(PerformancePage) },
	// 기타
	{ path: 'org/setup', element: <Navigate to="/app/admin/company-settings?tab=workplace" replace /> },
	{ path: 'integrations', element: withSuspense(IntegrationsPage) },
	{ path: 'guide', element: <Navigate to="/app/dashboard" replace /> },
	{ path: 'workflow', element: <Navigate to="/app/dashboard" replace /> },
	{ path: 'settings', element: withSuspense(SettingsPage) },
		
	// Work Rhythm - Redirect to dashboard (준비 중)
	{ path: 'rhythm', element: <Navigate to="/app/dashboard" replace /> },
	{ path: 'rhythm/*', element: <Navigate to="/app/dashboard" replace /> },
]

// 라우터 설정 - 컴포넌트 외부에서 한 번만 생성
const router = createBrowserRouter([
	{ path: '/', element: withSuspense(LandingPage) },
	{ path: '/auth/sign-up', element: withSuspense(SignUpPage) },
	{ path: '/auth/forgot-password', element: withSuspense(ForgotPasswordPage) },
	{ path: '/auth/company-signup', element: withSuspense(CompanySignUpPage) },
	{ path: '/auth/employee-signup', element: withSuspense(EmployeeSignUpPage) },
	{ path: '/auth/join', element: withSuspense(JoinWorkspacePage) },
	{ path: '/auth/onboarding', element: withSuspense(OnboardingPage) },
	{
		path: '/app',
		element: <AppLayout />,
		children: appRoutes,
	},
	// Legacy routes - redirect to new paths
	{ path: '/dashboard', element: <Navigate to="/app/dashboard" replace /> },
	{ path: '/input', element: <Navigate to="/app/input" replace /> },
	{ path: '/projects', element: <Navigate to="/app/projects" replace /> },
	{ path: '/work-history', element: <Navigate to="/app/work-history" replace /> },
	{ path: '/inbox', element: <Navigate to="/app/messages" replace /> },
	{ path: '/messages', element: <Navigate to="/app/messages" replace /> },
	// { path: '/okr', element: <Navigate to="/app/okr" replace /> },
	{ path: '/ai-recommendations', element: <Navigate to="/app/ai-recommendations" replace /> },
	{ path: '/admin/users', element: <Navigate to="/app/admin/users" replace /> },
	{ path: '/admin/system-settings', element: <Navigate to="/app/admin/system-settings" replace /> },
	{ path: '/admin/company-settings', element: <Navigate to="/app/admin/company-settings" replace /> },
	{ path: '/executive', element: <Navigate to="/app/executive" replace /> },
	{ path: '/executive/goals', element: <Navigate to="/app/executive/goals" replace /> },
	{ path: '/analytics', element: <Navigate to="/app/executive" replace /> },
	{ path: '/performance', element: <Navigate to="/app/performance" replace /> },
	{ path: '/expenses', element: <Navigate to="/app/expenses" replace /> },
	{ path: '/org/setup', element: <Navigate to="/app/admin/company-settings?tab=workplace" replace /> },
	{ path: '/integrations', element: <Navigate to="/app/integrations" replace /> },
	{ path: '/finance', element: <Navigate to="/app/finance" replace /> },
	{ path: '/settings', element: <Navigate to="/app/settings" replace /> },
	// 404 - Catch all
	{ path: '*', element: <NotFoundPage /> },
])

/**
 * 앱의 최상위 프로바이더 컴포넌트
 * 
 * 프로바이더 계층 구조:
 * 1. QueryClientProvider - React Query (서버 상태 관리)
 * 2. I18nProvider - 국제화 (영어/한국어)
 * 3. ThemeProvider - 테마 (라이트/다크)
 * 4. AuthProvider - 인증 및 권한 관리
 * 5. IntegrationsProvider - 연동 설정 전역 상태
 * 6. RouterProvider - React Router (라우팅)
 */
export function AppProviders() {
	return (
		<QueryClientProvider client={queryClient}>
			<I18nProvider>
				<ThemeProvider>
					<AuthProvider>
						<RhythmProvider>
							<IntegrationsProvider>
								<RouterProvider router={router} />
							</IntegrationsProvider>
						</RhythmProvider>
					</AuthProvider>
				</ThemeProvider>
			</I18nProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	)
}

export default AppProviders
