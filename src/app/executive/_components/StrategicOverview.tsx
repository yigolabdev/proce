import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Target, ArrowUpRight, Activity } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

export default function StrategicOverview() {
	// Mock Data for Strategic Pillars
	const strategicPillars = [
		{ name: 'Innovation', value: 35, color: '#3B82F6', status: 'On Track' },
		{ name: 'Operational Excellence', value: 45, color: '#10B981', status: 'Ahead' },
		{ name: 'Customer Satisfaction', value: 20, color: '#F59E0B', status: 'At Risk' },
	]

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
			{/* Executive Summary Card */}
			<Card className="lg:col-span-2 bg-surface-dark border-border-dark">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-white">
						<Activity className="h-5 w-5 text-orange-500" />
						Executive Summary
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<p className="text-lg font-medium text-neutral-200">
							Company performance is <span className="text-green-400 font-bold">Strong</span> this quarter.
						</p>
						<p className="text-neutral-400 leading-relaxed">
							Overall productivity has increased by <strong>12%</strong> month-over-month, driven by the Engineering team's completion of the 'Infrastructure Modernization' project. However, attention is needed in the <strong>Mobile App V2</strong> project which is showing signs of schedule slippage due to resource constraints. Customer satisfaction metrics remain high following the recent support portal launch.
						</p>
						<div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border-dark">
							<div>
								<div className="text-sm text-neutral-500 mb-1">Revenue Pace</div>
								<div className="text-2xl font-bold text-white">98%</div>
								<div className="text-xs text-green-400 flex items-center">
									<ArrowUpRight className="h-3 w-3 mr-1" /> On Track
								</div>
							</div>
							<div>
								<div className="text-sm text-neutral-500 mb-1">Productivity</div>
								<div className="text-2xl font-bold text-white">High</div>
								<div className="text-xs text-green-400 flex items-center">
									<ArrowUpRight className="h-3 w-3 mr-1" /> +12% MoM
								</div>
							</div>
							<div>
								<div className="text-sm text-neutral-500 mb-1">Risk Level</div>
								<div className="text-2xl font-bold text-white">Low</div>
								<div className="text-xs text-neutral-500 flex items-center">
									Stable
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Strategic Allocation */}
			<Card className="bg-surface-dark border-border-dark">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-white">
						<Target className="h-5 w-5 text-orange-500" />
						Strategic Focus
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="h-[180px] w-full relative">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={strategicPillars}
									cx="50%"
									cy="50%"
									innerRadius={50}
									outerRadius={70}
									paddingAngle={5}
									dataKey="value"
									stroke="none"
								>
									{strategicPillars.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} />
									))}
								</Pie>
								<Tooltip 
									contentStyle={{
										backgroundColor: '#1a1a1a',
										border: '1px solid #262626',
										borderRadius: '8px',
										color: '#fff',
									}}
								/>
							</PieChart>
						</ResponsiveContainer>
						<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
							<div className="text-center">
								<span className="text-2xl font-bold text-white">100%</span>
								<p className="text-xs text-neutral-500">Alignment</p>
							</div>
						</div>
					</div>
					<div className="space-y-2 mt-4">
						{strategicPillars.map((pillar) => (
							<div key={pillar.name} className="flex items-center justify-between text-sm">
								<div className="flex items-center gap-2">
									<div className="w-2 h-2 rounded-full" style={{ backgroundColor: pillar.color }} />
									<span className="text-neutral-400">{pillar.name}</span>
								</div>
								<span className={`font-medium ${
									pillar.status === 'On Track' ? 'text-green-400' :
									pillar.status === 'Ahead' ? 'text-blue-400' :
									'text-orange-400'
								}`}>{pillar.status}</span>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

