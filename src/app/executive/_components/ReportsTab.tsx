import { useState } from 'react'
import { Card, CardContent, CardHeader } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Download, FileText, Table, Printer, FileJson, CheckCircle2 } from 'lucide-react'
import { format } from 'date-fns'
import { exportToCSV, exportToJSON, generatePrintableReport, formatNumber, formatPercentage } from '../_utils/exportUtils'
import type { DepartmentPerformance, CategoryBreakdown, ProjectAnalytics, ComparisonPeriod } from '../_types/analytics.types'
import { toast } from 'sonner'

interface ReportsTabProps {
	dateRange: { start: Date; end: Date }
	departments: DepartmentPerformance[]
	categoryBreakdown: CategoryBreakdown[]
	projects: ProjectAnalytics[]
	comparison: { current: ComparisonPeriod; previous: ComparisonPeriod; changes: Record<string, number> } | null
}

export default function ReportsTab({
	dateRange,
	departments,
	categoryBreakdown,
	projects,
	comparison,
}: ReportsTabProps) {
	const [exporting, setExporting] = useState(false)

	const handleExportDepartments = () => {
		const data = departments.map(dept => ({
			Department: dept.department,
			Rank: dept.rank,
			'Work Entries': dept.metrics.totalWorkEntries,
			'Total Hours': formatNumber(dept.metrics.totalHours),
			'Projects Count': dept.metrics.projectsCount,
			'Avg Progress': formatPercentage(dept.metrics.averageProgress),
			'OKR Completion Rate': formatPercentage(dept.metrics.okrCompletionRate),
			Trend: dept.trend,
		}))
		exportToCSV(data, 'department-performance')
		toast.success('Department performance exported successfully')
	}

	const handleExportCategories = () => {
		const data = categoryBreakdown.map(cat => ({
			Category: cat.category,
			Entries: cat.count,
			Hours: formatNumber(cat.hours),
			Percentage: formatPercentage(cat.percentage),
		}))
		exportToCSV(data, 'category-breakdown')
		toast.success('Category breakdown exported successfully')
	}

	const handleExportProjects = () => {
		const data = projects.map(proj => ({
			'Project Name': proj.projectName,
			Department: proj.department,
			Status: proj.status,
			'Progress (%)': proj.progress,
			'Days Remaining': proj.daysRemaining,
			'Work Entries': proj.workEntriesCount,
			'Team Size': proj.teamSize,
			Velocity: formatNumber(proj.velocity),
			Risk: proj.risk,
		}))
		exportToCSV(data, 'project-analytics')
		toast.success('Project analytics exported successfully')
	}

	// const handleExportOKRs = () => {
	// 	const data = okrs.map(okr => ({
	// 		Objective: okr.title,
	// 		Owner: okr.owner,
	// 		Team: okr.team,
	// 		'Progress (%)': okr.progress,
	// 		Status: okr.status,
	// 		'Total KRs': okr.keyResultsTotal,
	// 		'Completed KRs': okr.keyResultsCompleted,
	// 		'Days Remaining': okr.daysRemaining,
	// 	}))
	// 	exportToCSV(data, 'okr-performance')
	// 	toast.success('OKR performance exported successfully')
	// }

	const handleExportComparison = () => {
		if (!comparison) {
			toast.error('No comparison data available')
			return
		}
		const data = [
			{
				Metric: 'Work Entries',
				Current: comparison.current.metrics.workEntries,
				Previous: comparison.previous.metrics.workEntries,
				'Change (%)': formatPercentage(comparison.changes.workEntries),
			},
			{
				Metric: 'Total Hours',
				Current: formatNumber(comparison.current.metrics.totalHours),
				Previous: formatNumber(comparison.previous.metrics.totalHours),
				'Change (%)': formatPercentage(comparison.changes.totalHours),
			},
			{
				Metric: 'Active Projects',
				Current: comparison.current.metrics.projectsActive,
				Previous: comparison.previous.metrics.projectsActive,
				'Change (%)': formatPercentage(comparison.changes.projectsActive),
			},
			// {
			// 	Metric: 'OKR Progress',
			// 	Current: formatPercentage(comparison.current.metrics.okrProgress),
			// 	Previous: formatPercentage(comparison.previous.metrics.okrProgress),
			// 	'Change (pp)': formatNumber(comparison.changes.okrProgress),
			// },
		]
		exportToCSV(data, 'period-comparison')
		toast.success('Period comparison exported successfully')
	}

	const handleExportFullReport = () => {
		const allData = {
			meta: {
				reportName: 'Advanced Analytics Report',
				generatedAt: new Date().toISOString(),
				dateRange: {
					start: dateRange.start.toISOString(),
					end: dateRange.end.toISOString(),
				},
			},
			departments,
			categoryBreakdown,
			projects,
			comparison,
		}
		exportToJSON(allData, 'full-analytics-report')
		toast.success('Full report exported successfully')
	}

	const handleGeneratePDF = async () => {
		setExporting(true)
		try {
			const sections = []

			// Summary Section
			if (comparison) {
				sections.push({
					title: 'Executive Summary',
					content: `
						<p><strong>Report Period:</strong> ${format(dateRange.start, 'MMM d, yyyy')} - ${format(dateRange.end, 'MMM d, yyyy')}</p>
						<p><strong>Total Work Entries:</strong> ${comparison.current.metrics.workEntries} (${comparison.changes.workEntries > 0 ? '+' : ''}${formatPercentage(comparison.changes.workEntries)} vs previous period)</p>
						<p><strong>Total Hours:</strong> ${formatNumber(comparison.current.metrics.totalHours)} hours</p>
						<p><strong>Active Projects:</strong> ${comparison.current.metrics.projectsActive}</p>
						<p><strong>Average OKR Progress:</strong> ${formatPercentage(comparison.current.metrics.okrProgress)}</p>
					`,
				})
			}

			// Departments Section
			sections.push({
				title: 'Department Performance',
				content: `
					<table>
						<thead>
							<tr>
								<th>Rank</th>
								<th>Department</th>
								<th>Work Entries</th>
								<th>Total Hours</th>
								<th>Projects</th>
								<th>OKR Rate</th>
							</tr>
						</thead>
						<tbody>
							${departments.map(dept => `
								<tr>
									<td>${dept.rank}</td>
									<td>${dept.department}</td>
									<td>${dept.metrics.totalWorkEntries}</td>
									<td>${formatNumber(dept.metrics.totalHours)}h</td>
									<td>${dept.metrics.projectsCount}</td>
									<td>${formatPercentage(dept.metrics.okrCompletionRate)}</td>
								</tr>
							`).join('')}
						</tbody>
					</table>
				`,
			})

			// Categories Section
			sections.push({
				title: 'Category Distribution',
				content: `
					<table>
						<thead>
							<tr>
								<th>Category</th>
								<th>Entries</th>
								<th>Hours</th>
								<th>Percentage</th>
							</tr>
						</thead>
						<tbody>
							${categoryBreakdown.map(cat => `
								<tr>
									<td>${cat.category}</td>
									<td>${cat.count}</td>
									<td>${formatNumber(cat.hours)}h</td>
									<td>${formatPercentage(cat.percentage)}</td>
								</tr>
							`).join('')}
						</tbody>
					</table>
				`,
			})

			generatePrintableReport(
				'Advanced Analytics Report',
				dateRange,
				sections
			)
			
			toast.success('PDF report generated! Use Print > Save as PDF')
		} catch (error) {
			console.error('Failed to generate PDF:', error)
			toast.error('Failed to generate PDF report')
		} finally {
			setExporting(false)
		}
	}

	const reports = [
		{
			title: 'Department Performance',
			description: 'Detailed department metrics and rankings',
			icon: Table,
			color: 'text-blue-400',
			bgColor: 'bg-blue-500/10 border border-blue-500/20',
			action: handleExportDepartments,
			dataCount: departments.length,
		},
		{
			title: 'Category Breakdown',
			description: 'Work distribution by category',
			icon: FileText,
			color: 'text-green-400',
			bgColor: 'bg-green-500/10 border border-green-500/20',
			action: handleExportCategories,
			dataCount: categoryBreakdown.length,
		},
		{
			title: 'Project Analytics',
			description: 'Project status and risk assessment',
			icon: FileText,
			color: 'text-purple-400',
			bgColor: 'bg-purple-500/10 border border-purple-500/20',
			action: handleExportProjects,
			dataCount: projects.length,
		},
		// {
		// 	title: 'OKR Performance',
		// 	description: 'Objectives and key results tracking',
		// 	icon: FileText,
		// 	color: 'text-orange-400',
		// 	bgColor: 'bg-orange-500/10 border border-orange-500/20',
		// 	action: handleExportOKRs,
		// 	dataCount: okrs.length,
		// },
		{
			title: 'Period Comparison',
			description: 'Current vs previous period analysis',
			icon: FileText,
			color: 'text-pink-400',
			bgColor: 'bg-pink-500/10 border border-pink-500/20',
			action: handleExportComparison,
			dataCount: comparison ? 4 : 0,
		},
	]

	return (
		<div className="space-y-6">
			{/* Export Options */}
			<Card className="bg-surface-dark border-border-dark">
				<CardHeader>
					<h3 className="font-bold flex items-center gap-2 text-white">
						<Download className="h-5 w-5 text-orange-500" />
						Export Reports
					</h3>
					<p className="text-sm text-neutral-400">
						Download analytics data in various formats
					</p>
				</CardHeader>
				<CardContent className="p-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{reports.map((report, index) => (
							<div
								key={index}
								className="p-4 rounded-lg border border-border-dark hover:bg-neutral-800/50 transition-colors"
							>
								<div className="flex items-start gap-4">
									<div className={`p-3 rounded-lg ${report.bgColor}`}>
										<report.icon className={`h-6 w-6 ${report.color}`} />
									</div>
									<div className="flex-1">
										<h4 className="font-semibold mb-1 text-white">{report.title}</h4>
										<p className="text-sm text-neutral-400 mb-3">
											{report.description}
										</p>
										<div className="flex items-center justify-between">
											<span className="text-xs text-neutral-500">
												{report.dataCount} records
											</span>
											<Button
												onClick={report.action}
												size="sm"
												variant="outline"
												className="flex items-center gap-2 border-border-dark hover:bg-border-dark text-neutral-300 hover:text-white"
											>
												<Download className="h-4 w-4" />
												Export CSV
											</Button>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Full Report Export */}
			<Card className="bg-surface-dark border-border-dark">
				<CardHeader>
					<h3 className="font-bold flex items-center gap-2 text-white">
						<FileJson className="h-5 w-5 text-orange-500" />
						Full Report Export
					</h3>
					<p className="text-sm text-neutral-400">
						Export complete analytics data for external processing
					</p>
				</CardHeader>
				<CardContent className="p-6">
					<div className="flex items-center justify-between p-4 rounded-lg border border-border-dark bg-[#1a1a1a]">
						<div>
							<h4 className="font-semibold mb-1 text-white">Complete Analytics Report</h4>
							<p className="text-sm text-neutral-400">
								Includes all departments, categories, projects, OKRs, and comparisons in JSON format
							</p>
						</div>
						<Button
							onClick={handleExportFullReport}
							className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white border-none"
						>
							<FileJson className="h-4 w-4" />
							Export JSON
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* PDF Report */}
			<Card className="bg-surface-dark border-border-dark">
				<CardHeader>
					<h3 className="font-bold flex items-center gap-2 text-white">
						<Printer className="h-5 w-5 text-orange-500" />
						Printable Report
					</h3>
					<p className="text-sm text-neutral-400">
						Generate a formatted report for printing or PDF export
					</p>
				</CardHeader>
				<CardContent className="p-6">
					<div className="flex items-center justify-between p-4 rounded-lg border border-border-dark bg-[#1a1a1a]">
						<div>
							<h4 className="font-semibold mb-1 text-white">Executive Report</h4>
							<p className="text-sm text-neutral-400">
								Professional formatted report with summary, tables, and insights
							</p>
						</div>
						<Button
							onClick={handleGeneratePDF}
							disabled={exporting}
							className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white border-none"
						>
							<Printer className="h-4 w-4" />
							{exporting ? 'Generating...' : 'Generate PDF'}
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Export History/Tips */}
			<Card className="bg-surface-dark border-border-dark">
				<CardHeader>
					<h3 className="font-bold flex items-center gap-2 text-white">
						<CheckCircle2 className="h-5 w-5 text-orange-500" />
						Export Tips
					</h3>
				</CardHeader>
				<CardContent className="p-6">
					<div className="space-y-2 text-sm text-neutral-400">
						<p className="flex items-start gap-2">
							<span className="text-blue-400">💡</span>
							<span>CSV files can be opened in Excel or Google Sheets for further analysis</span>
						</p>
						<p className="flex items-start gap-2">
							<span className="text-blue-400">💡</span>
							<span>JSON format preserves all data structure and is ideal for integration with other systems</span>
						</p>
						<p className="flex items-start gap-2">
							<span className="text-blue-400">💡</span>
							<span>Use &quot;Print &gt; Save as PDF&quot; in the browser to create PDF reports from the printable version</span>
						</p>
						<p className="flex items-start gap-2">
							<span className="text-blue-400">💡</span>
							<span>All exports include the current date range filter applied in the dashboard</span>
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

