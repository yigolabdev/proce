import { NavLink, Outlet, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, FileText, Inbox, Users, BarChart3, Award, HelpCircle, LogOut, Settings, Target, History, FolderKanban, TrendingDown } from 'lucide-react'
import Toaster from '../ui/Toaster'
import type { UserRole } from '../../types/auth.types'

interface MenuItem {
	to: string
	label: string
	icon: any
	roles: UserRole[]
}

export default function AppLayout() {
	const { user } = useAuth()

	const link = (to: string, label: string, Icon: any) => (
		<NavLink
			to={to}
			end
			className={({ isActive }) =>
				`flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900 ${isActive ? 'bg-neutral-100 dark:bg-neutral-900 font-medium text-primary' : 'text-neutral-700 dark:text-neutral-300'}`
			}
		>
			<Icon size={20} /> {label}
		</NavLink>
	)

	// Menu definition by role
	const menuGroups = [
		{
			title: 'Work',
			roles: ['worker', 'admin', 'executive'] as UserRole[],
			items: [
				{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['worker', 'admin', 'executive'] },
				{ to: '/input', label: 'Work Input', icon: FileText, roles: ['worker', 'admin', 'executive'] },
				{ to: '/work-history', label: 'Work History', icon: History, roles: ['worker', 'admin', 'executive'] },
				{ to: '/inbox', label: 'Inbox', icon: Inbox, roles: ['worker', 'admin', 'executive'] },
				{ to: '/projects', label: 'Projects', icon: FolderKanban, roles: ['worker', 'admin', 'executive'] },
				{ to: '/okr', label: 'OKR', icon: Target, roles: ['worker', 'admin', 'executive'] },
			] as MenuItem[],
		},
		{
			title: 'Administration',
			roles: ['admin', 'executive'] as UserRole[],
			items: [
				{ to: '/admin/users', label: 'User Management', icon: Users, roles: ['admin', 'executive'] },
				{ to: '/admin/system-settings', label: 'System Settings', icon: Settings, roles: ['admin', 'executive'] },
			] as MenuItem[],
		},
	{
		title: 'Executive',
		roles: ['executive'] as UserRole[],
		items: [
			{ to: '/executive', label: 'Executive Dashboard', icon: BarChart3, roles: ['executive'] },
			{ to: '/executive/goals', label: 'Annual Goals', icon: Target, roles: ['executive'] },
			{ to: '/admin/company-settings', label: 'Company Settings', icon: Settings, roles: ['executive'] },
			{ to: '/expenses', label: 'Expenses', icon: TrendingDown, roles: ['executive'] },
			{ to: '/analytics', label: 'Analytics', icon: BarChart3, roles: ['executive', 'admin'] },
			{ to: '/performance', label: 'Performance', icon: Award, roles: ['executive', 'admin'] },
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

	return (
		<div className="min-h-screen flex bg-neutral-50 dark:bg-neutral-950">
			{/* 좌측 사이드바 - 고정형 */}
			<aside className="w-64 flex flex-col border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 fixed left-0 top-0 bottom-0 z-40">
				{/* 사이드바 헤더 */}
				<div className="flex items-center gap-3 px-6 py-5 border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0">
					<div className="size-8 rounded-2xl bg-primary" />
					<div className="flex-1 min-w-0">
						<div className="text-lg font-semibold">Proce</div>
					{user && (
						<div className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
							{user.name} • {user.role === 'worker' ? 'Worker' : user.role === 'admin' ? 'Admin' : 'Executive'}
						</div>
					)}
					</div>
				</div>

				{/* 메인 네비게이션 - 권한별 */}
				<nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
					{visibleMenuGroups.map((group, groupIndex) => (
						<div key={group.title}>
							{groupIndex > 0 && <div className="my-4 border-t border-neutral-200 dark:border-neutral-800" />}
							<div className="mb-2 px-4 text-xs font-medium text-neutral-500 dark:text-neutral-400">
								{group.title}
							</div>
							{group.items.map((item) => link(item.to, item.label, item.icon))}
						</div>
					))}
					
				<div className="my-4 border-t border-neutral-200 dark:border-neutral-800" />
				
				<div className="mb-2 px-4 text-xs font-medium text-neutral-500 dark:text-neutral-400">
					Other
				</div>
				{link('/settings', 'Settings', Settings)}
				{link('/help', 'Help', HelpCircle)}
				</nav>

			{/* Sidebar Footer - Logout */}
			<div className="px-3 py-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2 flex-shrink-0">
				{/* Logout */}
				<Link
					to="/"
					className="flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
				>
					<LogOut size={20} />
					Logout
				</Link>
			</div>
			</aside>

			{/* 메인 컨텐츠 영역 - 사이드바 너비만큼 왼쪽 여백 */}
			<main className="flex-1 ml-64 p-6 overflow-y-auto">
				<div className="mx-auto max-w-6xl">
					<Outlet />
				</div>
			</main>

			<Toaster />
		</div>
	)
}
