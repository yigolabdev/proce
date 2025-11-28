import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { LoadingState } from '../components/common/LoadingState'
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts'
import { PageHeader } from '../components/common/PageHeader'
import { 
	FileText,
	FolderKanban,
	Sparkles,
	AlertTriangle,
	CheckCircle2,
	Clock
} from 'lucide-react'
import { useDashboardData } from '../hooks/useDashboardData'
import { PerformanceChart } from '../components/dashboard/PerformanceChart'
import { SummaryCards } from '../components/dashboard/SummaryCards'
import { RecentActivity } from '../components/dashboard/RecentActivity'

export default function DashboardPage() {
	const navigate = useNavigate()
	const { loading, personalStats, myRecentWork, performanceData } = useDashboardData()

	// Keyboard shortcuts
	useKeyboardShortcuts({
		newWork: () => navigate('/app/input'),
		goToDashboard: () => navigate('/app/dashboard'),
	})

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-background-dark">
				<LoadingState type="page" />
			</div>
		)
	}

	return (
	<div className="min-h-screen bg-neutral-50 dark:bg-background-dark text-neutral-900 dark:text-neutral-100">
		<div className="max-w-[1600px] mx-auto px-6 py-6 space-y-8">
			{/* Top Header */}
			<PageHeader
				title="Dashboard"
				description="Overview of your daily activities, performance metrics, and upcoming tasks"
				actions={
					<div className="flex items-center gap-3">
						<p className="text-sm text-neutral-500 dark:text-neutral-400 hidden sm:block">
							{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
						</p>
					<Button onClick={() => navigate('/app/input')} variant="outline" className="rounded-full border-border-dark hover:bg-border-dark text-white">
						<FileText className="h-4 w-4 mr-2" />
						Add Work
					</Button>
					</div>
				}
			/>

			{/* Today's Summary - 4 Cards */}
			<div>
				<h2 className="text-lg font-semibold mb-4 text-neutral-400">Today's Summary</h2>
				<SummaryCards stats={personalStats} />
			</div>

			{/* AI Suggestions & Quick Actions */}
			<Card className="bg-surface-dark border-border-dark overflow-hidden relative">
				<CardHeader className="border-b border-border-dark pb-4">
					<div className="flex items-center gap-2">
						<Sparkles className="h-5 w-5 text-white" />
						<CardTitle className="text-white">AI Suggestions</CardTitle>
					</div>
					<p className="text-sm text-neutral-400">Based on your activity and goals</p>
				</CardHeader>
				<CardContent className="p-6 space-y-6">
					{/* Warning Strip */}
					<div className="flex items-center justify-between p-4 rounded-xl bg-surface-dark border border-border-dark">
						<div className="flex items-center gap-3">
							<AlertTriangle className="h-5 w-5 text-red-500" />
							<div>
								<p className="font-medium text-white">Low progress: Expand Market Presence in APAC</p>
								<p className="text-sm text-neutral-500">You haven't logged any work entries today. Keep your progress up to date!</p>
							</div>
						</div>
						<Button size="sm" variant="outline" className="rounded-full" onClick={() => navigate('/app/input')}>
							Add Work Entry
						</Button>
					</div>

					{/* Quick Actions Grid */}
					<div>
						<h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<button 
								onClick={() => navigate('/app/input')}
								className="group flex flex-col items-center justify-center p-8 rounded-xl border border-dashed border-border-dark hover:border-primary/50 hover:bg-primary/5 transition-all"
							>
								<div className="mb-3 p-3 rounded-full bg-orange-500/10 text-orange-500 group-hover:scale-110 transition-transform">
									<FileText className="h-6 w-6" />
								</div>
								<span className="font-semibold text-white mb-1">Add Work Entry</span>
								<span className="text-xs text-neutral-500 mb-3">Log your daily work activities</span>
								<span className="text-[10px] px-2 py-1 rounded bg-border-dark text-neutral-400 font-mono">Press N</span>
							</button>

							<button 
								onClick={() => navigate('/app/work-review')}
								className="group flex flex-col items-center justify-center p-8 rounded-xl border border-dashed border-border-dark hover:border-blue-500/50 hover:bg-blue-500/5 transition-all"
							>
								<div className="mb-3 p-3 rounded-full bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
									<CheckCircle2 className="h-6 w-6" />
								</div>
								<span className="font-semibold text-white mb-1">Manage Reviews</span>
								<span className="text-xs text-neutral-500 mb-3">Check pending work reviews</span>
								<span className="text-[10px] px-2 py-1 rounded bg-border-dark text-neutral-400 font-mono">Press R</span>
							</button>

							<button 
								onClick={() => navigate('/app/projects')}
								className="group flex flex-col items-center justify-center p-8 rounded-xl border border-dashed border-border-dark hover:border-purple-500/50 hover:bg-purple-500/5 transition-all"
							>
								<div className="mb-3 p-3 rounded-full bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform">
									<FolderKanban className="h-6 w-6" />
								</div>
								<span className="font-semibold text-white mb-1">Manage Projects</span>
								<span className="text-xs text-neutral-500 mb-3">View and update your projects</span>
								<span className="text-[10px] px-2 py-1 rounded bg-border-dark text-neutral-400 font-mono">Press P</span>
							</button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Bottom Section: Activity & Chart */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<RecentActivity activities={myRecentWork} />

				{/* Upcoming Deadlines (Placeholder as in image) */}
				<Card className="bg-surface-dark border-border-dark h-full flex flex-col justify-center items-center text-center p-8">
					<div className="mb-4 relative">
						<div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full" />
						<Clock className="h-12 w-12 text-orange-500 relative z-10" />
					</div>
					<h3 className="text-lg font-bold text-white mb-2">Upcoming Deadlines</h3>
					<p className="text-neutral-400 text-sm mb-6 max-w-xs">
						You have no immediate deadlines for the next 7 days. Keep up the good work!
					</p>
					<div className="flex gap-2">
						<span className="w-2 h-2 rounded-full bg-neutral-700" />
						<span className="w-2 h-2 rounded-full bg-neutral-700" />
						<span className="w-2 h-2 rounded-full bg-border-dark" />
					</div>
				</Card>
			</div>

			{/* Performance Chart */}
			<div className="mt-6">
				<h2 className="text-lg font-semibold mb-4 text-neutral-400">Last 7 Days Performance</h2>
				<PerformanceChart data={performanceData} />
			</div>
		</div>
	</div>
	)
}
