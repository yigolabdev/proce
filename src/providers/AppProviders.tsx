import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import SignUpPage from '../app/auth/sign-up/page'
import ForgotPasswordPage from '../app/auth/forgot-password/page'
import CompanySignUpPage from '../app/auth/company-signup/page'
import EmployeeSignUpPage from '../app/auth/employee-signup/page'
import JoinWorkspacePage from '../app/auth/join/page'
import OnboardingPage from '../app/auth/onboarding/page'
import WorkspaceSetupPage from '../app/org/setup/page'
import IntegrationsPage from '../app/integrations/page'
import { I18nProvider } from '../i18n/I18nProvider'
import { ThemeProvider } from '../theme/ThemeProvider'
import { IntegrationsProvider } from '../app/_providers/IntegrationsContext'
import { AuthProvider } from '../context/AuthContext'
import AppLayout from '../components/layout/AppLayout'
import DashboardPage from '../pages/DashboardPage'
import NoMeetPage from '../pages/NoMeetPage'
import PolicyPage from '../pages/PolicyPage'
import InputPage from '../pages/InputPage'
import WorkHistoryPage from '../app/work-history/page'
import HelpPage from '../pages/HelpPage'
import LandingPage from '../pages/LandingPage'
import FinancePage from '../app/finance/page'
import InboxPage from '../app/inbox/page'
import UsersManagementPage from '../app/admin/users/page'
import CompanySettingsPage from '../app/admin/company-settings/page'
import SystemSettingsPage from '../app/admin/system-settings/page'
import AnalyticsPage from '../app/analytics/page'
import PerformancePage from '../app/performance/page'
import ExecutiveDashboardPage from '../pages/ExecutiveDashboardPage'
import OKRPage from '../app/okr/page'
import AIRecommendationsPage from '../app/ai-recommendations/page'
import ExecutiveGoalsPage from '../app/executive/goals/page'
import ProjectsPage from '../app/projects/page'
import SettingsPage from '../app/settings/page'
import ExpensesPage from '../app/expenses/page'

// 404 Not Found Page Component
function NotFoundPage() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
			<div className="text-center">
				<h1 className="text-6xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">404</h1>
				<p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8">Page not found</p>
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

// 라우터 설정
const router = createBrowserRouter([
	{ path: '/', element: <LandingPage /> },
	{ path: '/auth/sign-up', element: <SignUpPage /> },
	{ path: '/auth/forgot-password', element: <ForgotPasswordPage /> },
	{ path: '/auth/company-signup', element: <CompanySignUpPage /> },
	{ path: '/auth/employee-signup', element: <EmployeeSignUpPage /> },
	{ path: '/auth/join', element: <JoinWorkspacePage /> },
	{ path: '/auth/onboarding', element: <OnboardingPage /> },
	{
		path: '/app',
		element: <AppLayout />,
		children: [
			// 작업자 메뉴
			{ path: '/app/dashboard', element: <DashboardPage /> },
			{ path: '/app/input', element: <InputPage /> },
			{ path: '/app/projects', element: <ProjectsPage /> },
			{ path: '/app/work-history', element: <WorkHistoryPage /> },
			{ path: '/app/inbox', element: <InboxPage /> },
			{ path: '/app/okr', element: <OKRPage /> },
			{ path: '/app/ai-recommendations', element: <AIRecommendationsPage /> },
			// 관리자 메뉴
			{ path: '/app/admin/users', element: <UsersManagementPage /> },
			{ path: '/app/admin/system-settings', element: <SystemSettingsPage /> },
			{ path: '/app/admin/company-settings', element: <CompanySettingsPage /> },
			// 임원 메뉴
			{ path: '/app/executive', element: <ExecutiveDashboardPage /> },
			{ path: '/app/executive/goals', element: <ExecutiveGoalsPage /> },
			{ path: '/app/analytics', element: <AnalyticsPage /> },
			{ path: '/app/performance', element: <PerformancePage /> },
			{ path: '/app/expenses', element: <ExpensesPage /> },
			// 기타
			{ path: '/app/org/setup', element: <WorkspaceSetupPage /> },
			{ path: '/app/integrations', element: <IntegrationsPage /> },
			{ path: '/app/finance', element: <FinancePage /> },
			{ path: '/app/settings', element: <SettingsPage /> },
			{ path: '/app/nomeet', element: <NoMeetPage /> },
			{ path: '/app/policy', element: <PolicyPage /> },
			{ path: '/app/help', element: <HelpPage /> },
		],
	},
	// Legacy routes - redirect to new paths
	{ path: '/dashboard', element: <Navigate to="/app/dashboard" replace /> },
	{ path: '/input', element: <Navigate to="/app/input" replace /> },
	{ path: '/projects', element: <Navigate to="/app/projects" replace /> },
	{ path: '/work-history', element: <Navigate to="/app/work-history" replace /> },
	{ path: '/inbox', element: <Navigate to="/app/inbox" replace /> },
	{ path: '/okr', element: <Navigate to="/app/okr" replace /> },
	{ path: '/ai-recommendations', element: <Navigate to="/app/ai-recommendations" replace /> },
	{ path: '/admin/users', element: <Navigate to="/app/admin/users" replace /> },
	{ path: '/admin/system-settings', element: <Navigate to="/app/admin/system-settings" replace /> },
	{ path: '/admin/company-settings', element: <Navigate to="/app/admin/company-settings" replace /> },
	{ path: '/executive', element: <Navigate to="/app/executive" replace /> },
	{ path: '/executive/goals', element: <Navigate to="/app/executive/goals" replace /> },
	{ path: '/analytics', element: <Navigate to="/app/analytics" replace /> },
	{ path: '/performance', element: <Navigate to="/app/performance" replace /> },
	{ path: '/expenses', element: <Navigate to="/app/expenses" replace /> },
	{ path: '/org/setup', element: <Navigate to="/app/org/setup" replace /> },
	{ path: '/integrations', element: <Navigate to="/app/integrations" replace /> },
	{ path: '/finance', element: <Navigate to="/app/finance" replace /> },
	{ path: '/settings', element: <Navigate to="/app/settings" replace /> },
	{ path: '/nomeet', element: <Navigate to="/app/nomeet" replace /> },
	{ path: '/policy', element: <Navigate to="/app/policy" replace /> },
	{ path: '/help', element: <Navigate to="/app/help" replace /> },
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
						<IntegrationsProvider>
							<RouterProvider router={router} />
						</IntegrationsProvider>
					</AuthProvider>
				</ThemeProvider>
			</I18nProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	)
}

export default AppProviders
