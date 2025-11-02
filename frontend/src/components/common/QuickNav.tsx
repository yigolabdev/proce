import { Link, useLocation } from 'react-router-dom'
import { Home, LayoutDashboard, MessageSquareDashed, Gavel, FileText, Settings, HelpCircle, UserPlus, Building2, Users, Plug } from 'lucide-react'
import clsx from 'clsx'

const links = [
	{ to: '/', label: 'Home', Icon: Home },
	{ to: '/auth/sign-up', label: 'Sign Up', Icon: UserPlus },
	{ to: '/auth/join', label: 'Join', Icon: Users },
	{ to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
	{ to: '/org/setup', label: 'Workspace', Icon: Building2 },
	{ to: '/integrations', label: 'Integrations', Icon: Plug },
	{ to: '/nomeet', label: 'NoMeet', Icon: MessageSquareDashed },
	{ to: '/policy', label: 'Policy', Icon: Gavel },
	{ to: '/input', label: 'Input', Icon: FileText },
	{ to: '/settings', label: 'Settings', Icon: Settings },
	{ to: '/help', label: 'Help', Icon: HelpCircle },
] as const

export default function QuickNav() {
	const { pathname } = useLocation()
	return (
		<nav className="fixed right-3 top-3 z-50 hidden md:flex items-center gap-1 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur px-2 py-1 shadow-sm">
			{links.map(({ to, label, Icon }) => {
				const active = pathname === to
				return (
					<Link
						key={to}
						to={to}
						className={clsx(
							'inline-flex items-center gap-1.5 rounded-2xl px-2 py-1 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-900',
							active && 'bg-neutral-100 dark:bg-neutral-900 font-medium',
						)}
						title={label}
					>
						<Icon size={16} /> {label}
					</Link>
				)
			})}
		</nav>
	)
}
