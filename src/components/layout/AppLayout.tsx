import { NavLink, Outlet, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, FileText, Mail, Sparkles, Users, BarChart3, LogOut, Settings, Target, History, FolderKanban, Building2, Rocket, CheckCircle2, BookOpen, Workflow, Menu, X } from 'lucide-react'
import Toaster from '../ui/Toaster'
import type { UserRole } from '../../types/auth.types'
import { useState, useEffect, Fragment } from 'react'
import { storage } from '../../utils/storage'
import { Clock } from 'lucide-react'

interface MenuItem {
	to: string
	label: string
	icon: any
	roles: UserRole[]
	badge?: number
}

export default function AppLayout() {
	const { user } = useAuth()
	const [unreadMessages, setUnreadMessages] = useState(0)
	const [unreadReviews, setUnreadReviews] = useState(0)
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

	// Load unread counts
	useEffect(() => {
		const loadUnreadCounts = () => {
			// Load unread messages
			const messages = storage.get<any[]>('messages') || []
			const unreadMsgCount = messages.filter(m => !m.isRead).length
			setUnreadMessages(unreadMsgCount)

			// Load unread reviews
			const reviews = storage.get<any[]>('received_reviews') || []
			const unreadRevCount = reviews.filter(r => !r.isRead).length
			setUnreadReviews(unreadRevCount)
		}

		loadUnreadCounts()

		// Refresh counts every 10 seconds
		const interval = setInterval(loadUnreadCounts, 10000)
		return () => clearInterval(interval)
	}, [])

	// Close mobile sidebar when route changes
	useEffect(() => {
		setIsMobileSidebarOpen(false)
	}, [window.location.pathname])

	const link = (to: string, label: string, Icon: any, badge?: number) => (
		<NavLink
			to={to}
			end
			className={({ isActive }) =>
				`flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900 ${isActive ? 'bg-neutral-100 dark:bg-neutral-900 font-medium text-primary' : 'text-neutral-700 dark:text-neutral-300'}`
			}
		>
			<Icon size={20} />
			<span className="flex-1">{label}</span>
			{badge !== undefined && badge > 0 && (
				<span className="shrink-0 min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-primary text-white text-xs font-bold animate-pulse">
					{badge > 99 ? '99+' : badge}
				</span>
			)}
		</NavLink>
	)

	// Menu definition by role
	const menuGroups = [
	{
		title: 'Work',
		roles: ['user', 'admin', 'executive'] as UserRole[],
		items: [
			{ to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['user', 'admin', 'executive'] },
			{ to: '/app/input', label: 'Work Input', icon: FileText, roles: ['user', 'admin', 'executive'] },
			{ to: '/app/messages', label: 'Messages', icon: Mail, roles: ['user', 'admin', 'executive'], badge: unreadMessages },
			{ to: '/app/ai-recommendations', label: 'AI Recommendations', icon: Sparkles, roles: ['user', 'admin', 'executive'] },
			{ to: '/app/work-history', label: 'Work History', icon: History, roles: ['user', 'admin', 'executive'] },
			{ to: '/app/work-review', label: 'Work Review', icon: CheckCircle2, roles: ['user', 'admin', 'executive'], badge: unreadReviews },
			{ to: '/app/projects', label: 'Projects', icon: FolderKanban, roles: ['user', 'admin', 'executive'] },
			{ to: '/app/okr', label: 'My Goals (OKR)', icon: Target, roles: ['user', 'admin', 'executive'] },
		] as MenuItem[],
	},
		{
			title: 'Administration',
			roles: ['admin', 'executive'] as UserRole[],
			items: [
				{ to: '/app/admin/users', label: 'User Management', icon: Users, roles: ['admin', 'executive'] },
				{ to: '/app/admin/system-settings', label: 'System Settings', icon: Settings, roles: ['admin', 'executive'] },
			] as MenuItem[],
		},
	{
		title: 'Executive',
		roles: ['executive', 'admin'] as UserRole[],
		items: [
			{ to: '/app/executive', label: 'Analytics & Insights', icon: BarChart3, roles: ['executive', 'admin'] },
			{ to: '/app/admin/company-settings', label: 'Company Settings', icon: Building2, roles: ['executive', 'admin'] },
		] as MenuItem[],
	},
]

// 현재 사용자 권한에 따라 메뉴 필터링
const visibleMenuGroups = menuGroups
		.filter((group) => user && group.roles.includes(user.role))
		.map((group) => ({
			...group,
			items: group.items.filter((item) => user && item.roles.includes(user.role)),
		}))
		.filter((group) => group.items.length > 0)

	// Sidebar Component
	const SidebarContent = () => (
		<>
			{/* 사이드바 헤더 */}
			<div className="flex items-center gap-3 px-6 py-5 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
				<div className="size-8 rounded-2xl bg-primary" />
				<div className="flex-1 min-w-0">
					<div className="text-lg font-semibold">Proce</div>
					{user && (
						<div className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
							{user.name} • {user.role === 'user' ? 'User' : user.role === 'admin' ? 'Admin' : 'Executive'}
						</div>
					)}
				</div>
				{/* Mobile close button */}
				<button
					onClick={() => setIsMobileSidebarOpen(false)}
					className="lg:hidden p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
					aria-label="Close menu"
				>
					<X size={20} />
				</button>
			</div>

			{/* 메인 네비게이션 */}
			<nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
				{/* Work Rhythm 메뉴 */}
				<div className="mb-6">
					<div className="mb-2 px-4 text-xs font-medium text-neutral-500 dark:text-neutral-400">
						Work Rhythm
					</div>
					{link('/app/rhythm', 'Work Rhythm', Clock)}
				</div>
				
				{/* 구분선 */}
				<div className="my-4 border-t border-neutral-200 dark:border-neutral-800" />
				
				{/* 기존 메뉴 */}
				{visibleMenuGroups.map((group, groupIndex) => (
					<div key={group.title}>
						{groupIndex > 0 && <div className="my-4 border-t border-neutral-200 dark:border-neutral-800" />}
						<div className="mb-2 px-4 text-xs font-medium text-neutral-500 dark:text-neutral-400">
							{group.title}
						</div>
						{group.items.map((item) => (
							<Fragment key={item.to}>
								{link(item.to, item.label, item.icon, item.badge)}
							</Fragment>
						))}
					</div>
				))}
				
				<div className="my-4 border-t border-neutral-200 dark:border-neutral-800" />
				
				<div className="mb-2 px-4 text-xs font-medium text-neutral-500 dark:text-neutral-400">
					Other
				</div>
				{link('/app/settings', 'Settings', Settings)}
				
				{/* Development menu (only visible in dev mode) */}
				{import.meta.env.DEV && (
					<>
						<div className="my-4 border-t border-neutral-200 dark:border-neutral-800" />
						<div className="mb-2 px-4 text-xs font-medium text-neutral-500 dark:text-neutral-400">
							Development
						</div>
						{link('/app/guide', 'Service Guide', BookOpen)}
						{link('/app/workflow', 'Workflow Visualization', Workflow)}
						{link('/app/dev/roadmap', '🚀 Product Roadmap', Rocket)}
					</>
				)}
			</nav>

			{/* Sidebar Footer - Logout */}
			<div className="px-3 py-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2 shrink-0">
				<Link
					to="/"
					className="flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
				>
					<LogOut size={20} />
					Logout
				</Link>
			</div>
		</>
	)

	return (
		<div className="min-h-screen flex bg-neutral-50 dark:bg-neutral-950">
			{/* Mobile Overlay */}
			{isMobileSidebarOpen && (
				<div 
					className="fixed inset-0 bg-black/50 z-40 lg:hidden"
					onClick={() => setIsMobileSidebarOpen(false)}
				/>
			)}

			{/* 좌측 사이드바 - Desktop: 고정형, Mobile: Overlay */}
			<aside className={`
				w-64 flex flex-col border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900
				fixed left-0 top-0 bottom-0 z-50
				transition-transform duration-300 ease-in-out
				lg:translate-x-0
				${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
			`}>
				<SidebarContent />
			</aside>

			{/* 메인 컨텐츠 영역 */}
			<main className="flex-1 lg:ml-64 overflow-y-auto">
				{/* Mobile Header with Hamburger Menu */}
				<div className="lg:hidden sticky top-0 z-30 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 py-3 flex items-center gap-3">
					<button
						onClick={() => setIsMobileSidebarOpen(true)}
						className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
						aria-label="Open menu"
					>
						<Menu size={24} />
					</button>
					<div className="size-6 rounded-lg bg-primary" />
					<span className="text-lg font-semibold">Proce</span>
				</div>

				{/* Page Content */}
				<div className="p-4 sm:p-6">
					<div className="mx-auto max-w-6xl">
						<Outlet />
					</div>
				</div>
			</main>

			<Toaster />
		</div>
	)
}
