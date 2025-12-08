import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, FileText, Mail, Sparkles, Users, BarChart3, LogOut, Settings, History, FolderKanban, Building2, CheckCircle2, Menu, X } from 'lucide-react'
import Toaster from '../ui/Toaster'
import type { UserRole } from '../../types/auth.types'
import { useState, useEffect, Fragment, useCallback, useMemo } from 'react'
import { storage } from '../../utils/storage'
import { useI18n } from '../../i18n/I18nProvider'

interface MenuItem {
	to: string
	label: string
	icon: any
	roles: UserRole[]
	badge?: number
}

export default function AppLayout() {
	const { user } = useAuth()
	const { t } = useI18n()
	const location = useLocation()
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
	}, [location.pathname])

	// Memoize link component to prevent recreation on every render
	const link = useCallback((to: string, label: string, Icon: any, badge?: number) => (
		<NavLink
			key={to}
			to={to}
			end
			className={({ isActive }) =>
				`relative flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm transition-all duration-300 group overflow-hidden ${
					isActive 
						? 'text-white bg-white/5 font-medium shadow-[0_0_20px_-10px_rgba(255,255,255,0.1)] border border-white/5' 
						: 'text-neutral-500 hover:text-neutral-200 hover:bg-white/5'
				}`
			}
		>
			{({ isActive }) => (
				<>
					{isActive && (
						<div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-orange-500/80 rounded-r-full blur-[2px]" />
					)}
					<Icon size={20} className={`shrink-0 transition-colors duration-300 ${isActive ? 'text-orange-500' : 'group-hover:text-neutral-300'}`} />
					<span className="flex-1 truncate tracking-wide">{label}</span>
					{badge !== undefined && badge > 0 && (
						<span className={`shrink-0 min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full text-[10px] font-bold shadow-sm transition-colors ${
							isActive ? 'bg-orange-500 text-white' : 'bg-neutral-800 text-neutral-400 group-hover:bg-neutral-700 group-hover:text-white'
						}`}>
							{badge > 99 ? '99+' : badge}
						</span>
					)}
				</>
			)}
		</NavLink>
	), [])

	// Menu definition by role - memoized to prevent recreation
	const menuGroups = useMemo(() => [
	{
		title: t('menu.work'),
		roles: ['user', 'admin', 'executive'] as UserRole[],
		items: [
			{ to: '/app/dashboard', label: t('menu.dashboard'), icon: LayoutDashboard, roles: ['user', 'admin', 'executive'] },
			{ to: '/app/input', label: t('menu.workInput'), icon: FileText, roles: ['user', 'admin', 'executive'] },
			{ to: '/app/messages', label: t('menu.messages'), icon: Mail, roles: ['user', 'admin', 'executive'], badge: unreadMessages },
			{ to: '/app/ai-recommendations', label: t('menu.aiSuggestions'), icon: Sparkles, roles: ['user', 'admin', 'executive'] },
			{ to: '/app/work-history', label: t('menu.workHistory'), icon: History, roles: ['user', 'admin', 'executive'] },
			{ to: '/app/work-review', label: t('menu.workReview'), icon: CheckCircle2, roles: ['user', 'admin', 'executive'], badge: unreadReviews },
			{ to: '/app/projects', label: t('menu.projects'), icon: FolderKanban, roles: ['user', 'admin', 'executive'] },
		] as MenuItem[],
	},
		{
			title: t('menu.administration'),
			roles: ['admin', 'executive'] as UserRole[],
			items: [
				{ to: '/app/admin/users', label: t('menu.userManagement'), icon: Users, roles: ['admin', 'executive'] },
				{ to: '/app/admin/system-settings', label: t('menu.systemSettings'), icon: Settings, roles: ['admin', 'executive'] },
			] as MenuItem[],
		},
	{
		title: t('menu.executive'),
		roles: ['executive', 'admin'] as UserRole[],
		items: [
			{ to: '/app/executive', label: t('menu.analyticsInsights'), icon: BarChart3, roles: ['executive', 'admin'] },
			{ to: '/app/admin/company-settings', label: t('menu.companySettings'), icon: Building2, roles: ['executive', 'admin'] },
		] as MenuItem[],
	},
], [t, unreadMessages, unreadReviews])

// 현재 사용자 권한에 따라 메뉴 필터링 - memoized
const visibleMenuGroups = useMemo(() => menuGroups
		.filter((group) => user && group.roles.includes(user.role))
		.map((group) => ({
			...group,
			items: group.items.filter((item) => user && item.roles.includes(user.role)),
		}))
		.filter((group) => group.items.length > 0), [menuGroups, user])

	// Sidebar Component
	const SidebarContent = () => (
		<div className="flex flex-col h-full bg-[#050505] border-r border-[#1a1a1a]/50 backdrop-blur-xl">
			{/* Sidebar Header with Logo - More Spacious */}
			<div className="px-6 py-8 flex items-center gap-4 shrink-0">
				<div className="relative group cursor-pointer">
                    <div className="absolute -inset-2 bg-orange-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative size-10 rounded-2xl bg-linear-to-br from-white to-neutral-300 text-black flex items-center justify-center font-bold text-xl shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
				</div>
				<div className="flex flex-col">
					<div className="text-base font-bold text-white tracking-tight leading-none mb-1">Proce</div>
					<div className="text-[10px] text-neutral-500 font-medium tracking-widest uppercase">{t('menu.workspace')}</div>
				</div>

				{/* Mobile close button */}
				<button
					onClick={() => setIsMobileSidebarOpen(false)}
					className="lg:hidden ml-auto p-1 text-neutral-500 hover:text-white transition-colors"
				>
					<X size={24} />
				</button>
			</div>
				
			{/* Main Navigation - Increased Spacing & Breathability */}
			<nav className="flex-1 px-4 pb-6 space-y-8 overflow-y-auto overflow-x-hidden scrollbar-hide">
				{/* Visible Menu Groups */}
				{visibleMenuGroups.map((group) => (
					<div key={group.title} className="animate-in slide-in-from-left-4 duration-500 fade-in">
						<div className="px-4 mb-3 text-[11px] font-bold uppercase tracking-widest text-neutral-600">
							{group.title}
						</div>
						<div className="space-y-1.5">
						{group.items.map((item) => (
							<Fragment key={item.to}>
								{link(item.to, item.label, item.icon, item.badge)}
							</Fragment>
						))}
						</div>
					</div>
				))}
				
				{/* System Group */}
				<div>
					<div className="px-4 mb-3 text-[11px] font-bold uppercase tracking-widest text-neutral-600">
						{t('menu.system')}
					</div>
					<div className="space-y-1.5">
						{link('/app/settings', t('menu.settings'), Settings)}
					</div>
				</div>
			</nav>

			{/* Sidebar Footer - Floating User Card */}
			<div className="p-4 mt-auto bg-linear-to-t from-[#050505] via-[#050505] to-transparent">
				{user && (
                    <div className="relative group rounded-2xl bg-[#0f0f0f] border border-[#1f1f1f] hover:border-[#2f2f2f] transition-all duration-300 p-4 shadow-lg cursor-default">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="relative shrink-0">
                                <div className="size-10 rounded-full bg-linear-to-br from-orange-500 to-amber-500 p-[1px]">
                                    <div className="size-full rounded-full bg-surface-elevated flex items-center justify-center text-white font-medium text-sm">
                                        {user.name.charAt(0)}
                                    </div>
                                </div>
                                <div className="absolute bottom-0 right-0 size-2.5 bg-green-500 rounded-full border-2 border-[#0f0f0f]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-white truncate">{user.name}</div>
                                <div className="text-xs text-neutral-500 truncate">{user.role}</div>
                            </div>
                        </div>
                        <Link
                            to="/"
                            className="flex items-center justify-center gap-2 w-full rounded-xl py-2.5 text-xs font-medium bg-surface-elevated text-neutral-400 hover:text-white hover:bg-[#252525] transition-all border border-transparent hover:border-[#333]"
                        >
                            <LogOut size={14} />
                            <span>{t('menu.signOut')}</span>
                        </Link>
                    </div>
				)}
			</div>
		</div>
	)

	return (
		<div className="min-h-screen flex bg-[#050505]">
			{/* Mobile Overlay */}
			{isMobileSidebarOpen && (
				<div 
					className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
					onClick={() => setIsMobileSidebarOpen(false)}
				/>
			)}

			{/* Sidebar - Fixed width, dark theme */}
			<aside className={`
				w-[280px] fixed left-0 top-0 bottom-0 z-50
				transition-transform duration-300 ease-in-out
				lg:translate-x-0
				${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
			`}>
				<SidebarContent />
			</aside>

			{/* Main Content Area - Adjusted margin for wider sidebar */}
			<main className="flex-1 lg:ml-[280px] min-h-screen bg-[#050505] text-neutral-200">
				{/* Mobile Header */}
				<div className="lg:hidden sticky top-0 z-30 bg-background-dark/80 backdrop-blur-md border-b border-[#1a1a1a] px-4 py-3 flex items-center justify-between">
					<div className="flex items-center gap-3">
					<button
						onClick={() => setIsMobileSidebarOpen(true)}
							className="p-2 text-neutral-400 hover:text-white rounded-lg"
					>
						<Menu size={24} />
					</button>
						<span className="text-lg font-bold text-white">Proce</span>
					</div>
				</div>

				{/* Page Content */}
				<Outlet />
			</main>

			<Toaster />
		</div>
	)
}
