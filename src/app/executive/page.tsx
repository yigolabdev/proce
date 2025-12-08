import { useState, useEffect, useMemo } from 'react'
import { Button } from '../../components/ui/Button'
import { PageHeader } from '../../components/common/PageHeader'
import { BarChart3, RefreshCw, TrendingUp, LineChart, FileText, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'sonner'
import Toaster from '../../components/ui/Toaster'
import { LoadingState } from '../../components/common/LoadingState'
import { subDays, startOfDay, endOfDay } from 'date-fns'

// Import components
import OverviewTab from './_components/OverviewTab'
import ComparisonTab from './_components/ComparisonTab'
import TeamPerformanceTab from './_components/TeamPerformanceTab'
import ReportsTab from './_components/ReportsTab'
import ExecutiveChat from './_components/ExecutiveChat'
import StrategicOverview from './_components/StrategicOverview'

// Import utils
import {
	analyzeWorkEntriesTrend,
	comparePeriods,
	analyzeDepartmentPerformance,
	analyzeCategoryBreakdown,
	analyzeProjects,
	generateInsights,
} from './_utils/analyticsCalculations'

type TabType = 'overview' | 'comparison' | 'team' | 'reports'
type DateRangePreset = 'last7days' | 'last30days' | 'last90days' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'custom'

export default function ExecutivePage() {
	const { user } = useAuth()
	
	// State
	const [activeTab, setActiveTab] = useState<TabType>('overview')
	const [dateRangePreset, setDateRangePreset] = useState<DateRangePreset>('last30days')
	const [customDateRange] = useState<{ start: Date; end: Date }>({
		start: subDays(new Date(), 30),
		end: new Date(),
	})
	const [loading, setLoading] = useState(true)
	const [refreshing, setRefreshing] = useState(false)

	// Check permissions
	const canViewOverview = user?.role === 'executive'
	const canViewTeam = user?.role === 'executive' || user?.role === 'admin'

	// Calculate date range based on preset
	const dateRange = useMemo(() => {
		const now = new Date()
		let start: Date
		let end: Date = endOfDay(now)

		switch (dateRangePreset) {
			case 'last7days':
				start = startOfDay(subDays(now, 7))
				break
			case 'last30days':
				start = startOfDay(subDays(now, 30))
				break
			case 'last90days':
				start = startOfDay(subDays(now, 90))
				break
			case 'thisMonth':
				start = startOfDay(new Date(now.getFullYear(), now.getMonth(), 1))
				break
			case 'lastMonth':
				start = startOfDay(new Date(now.getFullYear(), now.getMonth() - 1, 1))
				end = endOfDay(new Date(now.getFullYear(), now.getMonth(), 0))
				break
			case 'thisYear':
				start = startOfDay(new Date(now.getFullYear(), 0, 1))
				break
			case 'custom':
				start = customDateRange.start
				end = customDateRange.end
				break
			default:
				start = startOfDay(subDays(now, 30))
		}

		return { start, end }
	}, [dateRangePreset, customDateRange])

	// Calculate previous period for comparison
	const previousPeriod = useMemo(() => {
		const daysDiff = Math.floor((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24))
		return {
			start: subDays(dateRange.start, daysDiff),
			end: subDays(dateRange.end, daysDiff),
		}
	}, [dateRange])

	// Compute analytics data
	const analyticsData = useMemo(() => {
		try {
			const workEntriesTrend = analyzeWorkEntriesTrend(dateRange.start, dateRange.end)
			const comparison = comparePeriods(
				dateRange.start,
				dateRange.end,
				previousPeriod.start,
				previousPeriod.end
			)
			const departments = analyzeDepartmentPerformance(dateRange.start, dateRange.end)
			const categoryBreakdown = analyzeCategoryBreakdown(dateRange.start, dateRange.end)
			const projects = analyzeProjects(dateRange.start, dateRange.end)
			const insights = generateInsights(dateRange.start, dateRange.end)

			return {
				workEntriesTrend,
				comparison,
				departments,
				categoryBreakdown,
				projects,
				insights,
			}
		} catch (error) {
			console.error('Analytics calculation error:', error)
			toast.error('Failed to calculate analytics')
			return null
		}
	}, [dateRange, previousPeriod])

	// Initial load
	useEffect(() => {
		const loadData = async () => {
			setLoading(true)
			await new Promise(resolve => setTimeout(resolve, 500))
			setLoading(false)
		}
		loadData()
	}, [])

	// Handle refresh
	const handleRefresh = async () => {
		setRefreshing(true)
		await new Promise(resolve => setTimeout(resolve, 800))
		setRefreshing(false)
		toast.success('Analytics refreshed successfully')
	}

	// Handle date range change
	const handleDateRangeChange = (preset: DateRangePreset) => {
		setDateRangePreset(preset)
		toast.info(`Date range updated: ${preset}`)
	}

	// Tabs configuration
	const tabs = [
		{ 
			id: 'overview' as TabType, 
			label: 'Executive Dashboard', 
			icon: LayoutDashboard,
			visible: canViewOverview,
			description: 'High-level executive summary'
		},
		{ 
			id: 'comparison' as TabType, 
			label: 'Trend Analysis', 
			icon: LineChart,
			visible: true,
			description: 'Period-over-period analysis'
		},
		{ 
			id: 'team' as TabType, 
			label: 'Team Performance', 
			icon: TrendingUp,
			visible: canViewTeam,
			description: 'Department and project metrics'
		},
		{ 
			id: 'reports' as TabType, 
			label: 'Reports & Export', 
			icon: FileText,
			visible: true,
			description: 'Export and download analytics'
		},
	].filter(tab => tab.visible)

	// Date range presets
	const datePresets = [
		{ id: 'last7days' as DateRangePreset, label: '7 Days' },
		{ id: 'last30days' as DateRangePreset, label: '30 Days' },
		{ id: 'thisMonth' as DateRangePreset, label: 'This Month' },
		{ id: 'thisYear' as DateRangePreset, label: 'YTD' },
	]

	if (loading) {
		return (
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold flex items-center gap-3">
							<BarChart3 className="h-8 w-8 text-primary" />
							Executive Insights
						</h1>
					</div>
				</div>
				<LoadingState type="card" count={4} />
			</div>
		)
	}

	if (!analyticsData) {
		return (
			<div className="min-h-screen bg-neutral-950">
				<PageHeader
					title="Executive Insights"
					description="Strategic overview and performance analytics"
					icon={BarChart3}
					actions={
						<Button onClick={handleRefresh} variant="outline" size="sm">
							<RefreshCw className="h-4 w-4 sm:mr-2" />
							<span className="hidden sm:inline">Refresh</span>
						</Button>
					}
				/>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
					<div className="flex items-center justify-center h-96">
						<div className="text-center">
							<BarChart3 className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
							<h2 className="text-xl font-semibold mb-2">Analytics Error</h2>
							<p className="text-neutral-400">
								Failed to load analytics data. Please try again.
							</p>
							<Button onClick={handleRefresh} variant="primary" className="mt-4">
								<RefreshCw className="h-4 w-4 mr-2" />
								Retry
							</Button>
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-background-dark text-neutral-100 pb-20">
			<Toaster />
			<ExecutiveChat />
			
			<div className="max-w-[1600px] mx-auto px-6 py-6 space-y-8">
			{/* Header */}
			<PageHeader
				title="Executive Insights"
				description="Strategic overview, risks, and performance pulse"
				actions={
					<div className="flex items-center gap-2">
						<div className="hidden md:flex items-center bg-surface-dark rounded-lg border border-border-dark p-1">
							{datePresets.map((preset) => (
								<button
									key={preset.id}
									onClick={() => handleDateRangeChange(preset.id)}
									className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
										dateRangePreset === preset.id
											? 'bg-border-dark text-white'
											: 'text-neutral-500 hover:text-neutral-300'
									}`}
								>
									{preset.label}
								</button>
							))}
						</div>
						<Button
							onClick={handleRefresh}
							variant="outline"
							size="sm"
							disabled={refreshing}
							className="text-neutral-300 hover:text-white"
						>
							<RefreshCw className={`h-4 w-4 sm:mr-2 ${refreshing ? 'animate-spin' : ''}`} />
							<span className="hidden sm:inline">Refresh</span>
						</Button>
					</div>
				}
			/>
			
			<div className="space-y-6">
				
				{/* Strategic Overview Section - Always visible on Overview tab */}
				{activeTab === 'overview' && (
					<StrategicOverview />
				)}

				{/* Tabs */}
				<div className="flex items-center gap-2 border-b border-border-dark overflow-x-auto">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
								activeTab === tab.id
									? 'border-orange-500 text-orange-500'
									: 'border-transparent text-neutral-500 hover:text-neutral-300'
							}`}
							title={tab.description}
						>
							<tab.icon className="h-4 w-4" />
							{tab.label}
						</button>
					))}
				</div>

				{/* Tab Content */}
				<div className="min-h-[500px]">
					{activeTab === 'overview' && canViewOverview && (
						<OverviewTab
							dateRange={dateRange}
							workEntriesTrend={analyticsData.workEntriesTrend}
							categoryBreakdown={analyticsData.categoryBreakdown}
							insights={analyticsData.insights}
							comparison={analyticsData.comparison}
						/>
					)}

					{activeTab === 'comparison' && (
						<ComparisonTab
							current={analyticsData.comparison.current}
							previous={analyticsData.comparison.previous}
							changes={analyticsData.comparison.changes}
						/>
					)}

					{activeTab === 'team' && canViewTeam && (
						<TeamPerformanceTab
							departments={analyticsData.departments}
							projects={analyticsData.projects}
						/>
					)}

					{activeTab === 'reports' && (
						<ReportsTab
							dateRange={dateRange}
							departments={analyticsData.departments}
							categoryBreakdown={analyticsData.categoryBreakdown}
							projects={analyticsData.projects}
							comparison={analyticsData.comparison}
						/>
					)}
				</div>
			</div>
		</div>
	</div>
	)
}
