import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import SignInPage from '../app/auth/sign-in/page'
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
import SettingsPage from '../pages/SettingsPage'
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
	{ path: '/auth/sign-in', element: <SignInPage /> },
	{ path: '/auth/sign-up', element: <SignUpPage /> },
	{ path: '/auth/forgot-password', element: <ForgotPasswordPage /> },
	{ path: '/auth/company-signup', element: <CompanySignUpPage /> },
	{ path: '/auth/employee-signup', element: <EmployeeSignUpPage /> },
	{ path: '/auth/join', element: <JoinWorkspacePage /> },
	{ path: '/auth/onboarding', element: <OnboardingPage /> },
	{
		path: '/',
		element: <AppLayout />,
		children: [
			// 작업자 메뉴
			{ path: '/dashboard', element: <DashboardPage /> },
			{ path: '/input', element: <InputPage /> },
			{ path: '/work-history', element: <WorkHistoryPage /> },
			{ path: '/inbox', element: <InboxPage /> },
			{ path: '/okr', element: <OKRPage /> },
			// 관리자 메뉴
			{ path: '/admin/users', element: <UsersManagementPage /> },
			{ path: '/admin/system-settings', element: <SystemSettingsPage /> },
			{ path: '/admin/company-settings', element: <CompanySettingsPage /> },
			// 임원 메뉴
			{ path: '/executive', element: <ExecutiveDashboardPage /> },
			{ path: '/analytics', element: <AnalyticsPage /> },
			{ path: '/performance', element: <PerformancePage /> },
			// 기타
			{ path: '/org/setup', element: <WorkspaceSetupPage /> },
			{ path: '/integrations', element: <IntegrationsPage /> },
			{ path: '/finance', element: <FinancePage /> },
			{ path: '/settings', element: <SettingsPage /> },
			{ path: '/nomeet', element: <NoMeetPage /> },
			{ path: '/policy', element: <PolicyPage /> },
			{ path: '/help', element: <HelpPage /> },
		],
	},
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
