import { Button } from '../../../../components/ui/Button'
import { Card, CardContent, CardHeader } from '../../../../components/ui/Card'
import Input from '../../../../components/ui/Input'
import Textarea from '../../../../components/ui/Textarea'
import { Select } from '../../../../components/ui/Select'
import { Target, Plus, X, Trash2, Edit2, TrendingUp, AlertTriangle, CheckCircle2, BarChart3, Building2 } from 'lucide-react'
import { useState } from 'react'
import type { CompanyKPI } from '../_types/types'

// 산업군 목록
const industries = [
	{ value: 'IT/SaaS', label: 'IT / SaaS / Software' },
	{ value: 'Consulting', label: 'Consulting' },
	{ value: 'Marketing', label: 'Marketing / Advertising' },
	{ value: 'Design', label: 'Design' },
	{ value: 'Retail HQ', label: 'Retail / E-commerce' },
	{ value: 'Logistics', label: 'Logistics / Transportation' },
	{ value: 'Manufacturing', label: 'Manufacturing' },
	{ value: 'Healthcare', label: 'Healthcare' },
	{ value: 'Public', label: 'Public Sector / Government' },
	{ value: 'Education', label: 'Education' },
	{ value: 'Other', label: 'Other' },
]

// 산업군별 KPI 프리셋
const industryKPIPresets: Record<string, string[]> = {
	'IT/SaaS': ['Revenue', 'Active Users', 'Churn Rate', 'NPS', 'Cycle Time', 'Deployment Frequency', 'MRR', 'ARR', 'CAC', 'LTV'],
	'Consulting': ['Revenue', 'Utilization Rate', 'Client Satisfaction', 'Project Margin', 'Win Rate', 'Billable Hours', 'Repeat Client Rate'],
	'Marketing': ['Lead Generation', 'Conversion Rate', 'ROI', 'Engagement Rate', 'Brand Awareness', 'Cost per Lead', 'MQL to SQL'],
	'Design': ['Project Completion', 'Client Satisfaction', 'Design Quality Score', 'Iteration Cycle', 'On-time Delivery'],
	'Retail HQ': ['Revenue', 'Inventory Turnover', 'Margin', 'Same-Store Sales', 'Customer Satisfaction', 'GMV', 'AOV'],
	'Logistics': ['On-Time Delivery', 'Cost per Shipment', 'Inventory Accuracy', 'Order Fulfillment Rate', 'Delivery Time'],
	'Manufacturing': ['Production Output', 'Quality Rate', 'Downtime', 'On-Time Delivery', 'Cost per Unit', 'OEE'],
	'Healthcare': ['Patient Satisfaction', 'Wait Time', 'Treatment Success Rate', 'Cost per Patient', 'Readmission Rate'],
	'Public': ['Service Delivery Time', 'Citizen Satisfaction', 'Budget Utilization', 'Compliance Rate'],
	'Education': ['Student Satisfaction', 'Graduation Rate', 'Enrollment', 'Faculty Retention', 'Course Completion Rate'],
	'Other': ['Revenue', 'Customer Satisfaction', 'Cost Efficiency', 'On-Time Delivery'],
}

interface KPITabProps {
	kpis: CompanyKPI[]
	isAdding: boolean
	editingId: string | null
	newKPI: Partial<CompanyKPI>
	availableDepartments: { id: string; name: string }[]
	leadership: Array<{ id: string; name: string; position: string }>
	companyIndustry?: string // 회사 산업군 정보
	setNewKPI: (kpi: Partial<CompanyKPI>) => void
	setIsAdding: (value: boolean) => void
	setEditingId: (id: string | null) => void
	onAdd: () => void
	onUpdate: (id: string, field: keyof CompanyKPI, value: any) => void
	onDelete: (id: string) => void
	calculateProgress: (current: number, target: number) => number
}

const kpiCategories = [
	{ value: 'Financial', label: 'Financial', icon: '💰', description: 'Revenue, profit, costs, ROI' },
	{ value: 'Sales', label: 'Sales', icon: '💼', description: 'Deals, pipeline, conversion, revenue' },
	{ value: 'Marketing', label: 'Marketing', icon: '📢', description: 'Campaigns, leads, brand, reach' },
	{ value: 'Customer', label: 'Customer', icon: '👥', description: 'Satisfaction, retention, NPS, CAC' },
	{ value: 'Operational', label: 'Operational', icon: '⚙️', description: 'Efficiency, quality, productivity' },
	{ value: 'HR', label: 'HR & People', icon: '🎯', description: 'Engagement, turnover, training' },
	{ value: 'Growth', label: 'Growth', icon: '📈', description: 'Market share, expansion, new markets' },
	{ value: 'Innovation', label: 'Innovation', icon: '💡', description: 'R&D, new products, patents' },
	{ value: 'Strategic', label: 'Strategic', icon: '🎲', description: 'Long-term goals, initiatives' },
]

const kpiUnits = [
	{ value: '%', label: '% (Percentage)' },
	{ value: 'KRW', label: 'KRW (Korean Won)' },
	{ value: 'USD', label: 'USD (US Dollar)' },
	{ value: 'count', label: 'Count (Number)' },
	{ value: 'hours', label: 'Hours' },
	{ value: 'days', label: 'Days' },
	{ value: 'score', label: 'Score' },
	{ value: 'rate', label: 'Rate' },
	{ value: 'ratio', label: 'Ratio' },
]

const kpiExamples: Record<string, string[]> = {
	Financial: ['Annual Revenue', 'Net Profit Margin', 'Operating Cash Flow', 'EBITDA', 'ROI'],
	Sales: ['Sales Revenue', 'Deal Closing Rate', 'Average Deal Size', 'Sales Pipeline Value', 'Win Rate'],
	Marketing: ['Marketing ROI', 'Lead Generation', 'Conversion Rate', 'Brand Awareness', 'Campaign Performance'],
	Customer: ['Customer Satisfaction Score', 'Net Promoter Score (NPS)', 'Customer Retention Rate', 'Customer Lifetime Value'],
	Operational: ['Production Efficiency', 'Quality Rate', 'On-time Delivery Rate', 'Cycle Time'],
	HR: ['Employee Satisfaction', 'Turnover Rate', 'Training Hours per Employee', 'Time to Hire'],
	Growth: ['Market Share', 'New Customer Acquisition', 'Geographic Expansion', 'Revenue Growth Rate'],
	Innovation: ['R&D Investment Rate', 'New Product Launch', 'Patent Applications', 'Innovation Revenue %'],
	Strategic: ['Strategic Initiative Completion', 'Partnership Development', 'Brand Value Growth'],
}

export default function KPITab({
	kpis,
	isAdding,
	editingId,
	newKPI,
	availableDepartments,
	leadership,
	companyIndustry,
	setNewKPI,
	setIsAdding,
	setEditingId,
	onAdd,
	onUpdate,
	onDelete,
	calculateProgress,
}: KPITabProps) {
	// 회사 산업군 정보를 기반으로 초기값 설정
	const getInitialIndustry = () => {
		if (companyIndustry) {
			// 회사 정보의 산업군과 매칭
			const matched = industries.find(ind => 
				companyIndustry.includes(ind.value) || 
				ind.label.toLowerCase().includes(companyIndustry.toLowerCase())
			)
			return matched?.value || ''
		}
		return ''
	}
	const [selectedIndustry, setSelectedIndustry] = useState<string>(getInitialIndustry())
	const getStatusColor = (status: string) => {
		switch (status) {
			case 'achieved': return 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
			case 'on-track': return 'text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30'
			case 'at-risk': return 'text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30'
			case 'behind': return 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
			default: return 'text-neutral-700 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900/30'
		}
	}

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'achieved': return <CheckCircle2 className="h-4 w-4" />
			case 'on-track': return <TrendingUp className="h-4 w-4" />
			case 'at-risk': return <AlertTriangle className="h-4 w-4" />
			case 'behind': return <AlertTriangle className="h-4 w-4" />
			default: return <BarChart3 className="h-4 w-4" />
		}
	}

	const groupedKPIs = kpiCategories.map(category => ({
		...category,
		kpis: kpis.filter(k => k.category === category.value)
	})).filter(group => group.kpis.length > 0)

	return (
		<div className="space-y-6">
			<Card className="bg-surface-dark border-border-dark">
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-xl font-bold flex items-center gap-2 text-white">
								<Target className="h-5 w-5 text-orange-500" />
								Company KPIs & Metrics
							</h2>
							<p className="text-sm text-neutral-400 mt-1">
								Track key performance indicators across all business areas
							</p>
						</div>
						<Button
							onClick={() => setIsAdding(true)}
							className="flex items-center gap-2 bg-white text-black hover:bg-neutral-200"
						>
							<Plus className="h-4 w-4" />
							Add KPI
						</Button>
					</div>
				</CardHeader>
			</Card>

			{/* Add KPI Form */}
			{isAdding && (
				<Card className="bg-surface-dark border-border-dark shadow-lg">
					<CardHeader>
						<div className="flex items-center justify-between">
							<h3 className="font-semibold text-lg text-white">New KPI</h3>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setIsAdding(false)}
								className="border-border-dark hover:bg-border-dark text-white"
							>
								<X className="h-4 w-4" />
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-6">
							{/* Industry Selection */}
							<div>
								<label className="flex items-center gap-2 text-sm font-medium mb-2 text-neutral-300">
									<Building2 className="h-4 w-4" />
									Industry (Optional)
								</label>
								<Select
									value={selectedIndustry}
									onChange={(e) => {
										const industry = e.target.value
										setSelectedIndustry(industry)
										// 산업군 선택 시 해당 산업군의 KPI 프리셋 표시를 위해 상태 업데이트
									}}
									className="w-full"
								>
									<option value="">Select industry (optional)</option>
									{industries.map((ind) => (
										<option key={ind.value} value={ind.value}>
											{ind.label}
										</option>
									))}
								</Select>
								<p className="text-xs text-neutral-500 mt-1">
									💡 Select your industry to see relevant KPI suggestions
								</p>
							</div>

							{/* Industry-specific KPI Presets */}
							{selectedIndustry && industryKPIPresets[selectedIndustry] && (
								<div className="p-4 rounded-xl bg-purple-900/10 border border-purple-800">
									<p className="text-sm font-medium text-purple-400 mb-3">
										💡 Common KPIs for {industries.find(i => i.value === selectedIndustry)?.label}:
									</p>
									<div className="flex flex-wrap gap-2">
										{industryKPIPresets[selectedIndustry].map((preset) => (
											<button
												key={preset}
												onClick={() => setNewKPI({ ...newKPI, name: preset })}
												className="px-3 py-1.5 text-xs rounded-lg bg-neutral-900 border border-purple-800 hover:bg-purple-900/40 text-purple-300 transition-colors font-medium"
											>
												{preset}
											</button>
										))}
									</div>
								</div>
							)}

							{/* Category Selection */}
							<div>
								<label className="block text-sm font-medium mb-3 text-neutral-300">
									KPI Category (Optional)
								</label>
								<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
									{kpiCategories.map((cat) => (
										<button
											key={cat.value}
											onClick={() => setNewKPI({ ...newKPI, category: cat.value as any })}
											className={`p-4 rounded-xl border-2 transition-all text-left ${
												newKPI.category === cat.value
													? 'border-orange-500 bg-orange-500/10 text-white'
													: 'border-border-dark text-neutral-400 hover:border-orange-500/50 hover:text-neutral-200'
											}`}
										>
											<div className="text-2xl mb-2">{cat.icon}</div>
											<div className="font-semibold text-sm">{cat.label}</div>
											<div className={`text-xs mt-1 ${
												newKPI.category === cat.value ? 'text-orange-200' : 'text-neutral-500'
											}`}>
												{cat.description}
											</div>
										</button>
									))}
								</div>
							</div>

							{/* Category-specific KPI Examples */}
							{newKPI.category && kpiExamples[newKPI.category] && (
								<div className="p-4 rounded-xl bg-blue-900/10 border border-blue-800">
									<p className="text-sm font-medium text-blue-400 mb-2">
										💡 Common {newKPI.category} KPIs:
									</p>
									<div className="flex flex-wrap gap-2">
										{kpiExamples[newKPI.category].map((example) => (
											<button
												key={example}
												onClick={() => setNewKPI({ ...newKPI, name: example })}
												className="px-3 py-1 text-xs rounded-lg bg-neutral-900 border border-blue-800 hover:bg-blue-900/40 text-blue-300 transition-colors"
											>
												{example}
											</button>
										))}
									</div>
								</div>
							)}

							{/* Basic Information */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="md:col-span-2">
									<label className="block text-sm font-medium mb-2 text-neutral-300">
										KPI Name <span className="text-red-500">*</span>
									</label>
									<Input
										value={newKPI.name || ''}
										onChange={(e) => setNewKPI({ ...newKPI, name: e.target.value })}
										placeholder="e.g., Annual Revenue Growth, Customer Satisfaction Score..."
									/>
									<p className="text-xs text-neutral-500 mt-1">
										💡 Only required field - everything else is optional
									</p>
								</div>
								<div className="md:col-span-2">
									<label className="block text-sm font-medium mb-2 text-neutral-300">Description (Optional)</label>
									<Textarea
										value={newKPI.description || ''}
										onChange={(e) => setNewKPI({ ...newKPI, description: e.target.value })}
										placeholder="Describe the KPI, how it's measured, and why it's important..."
										rows={3}
									/>
								</div>
							</div>

							{/* Target & Current Values */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<label className="block text-sm font-medium mb-2 text-neutral-300">
										Target Value
									</label>
									<Input
										type="number"
										value={newKPI.targetValue}
										onChange={(e) => setNewKPI({ ...newKPI, targetValue: Number(e.target.value) })}
										placeholder="100"
									/>
									<p className="text-xs text-neutral-500 mt-1">
										💡 Optional: Leave empty for qualitative goals
									</p>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2 text-neutral-300">Current Value</label>
									<Input
										type="number"
										value={newKPI.currentValue}
										onChange={(e) => setNewKPI({ ...newKPI, currentValue: Number(e.target.value) })}
										placeholder="75"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2 text-neutral-300">Unit</label>
									<select
										value={newKPI.unit}
										onChange={(e) => setNewKPI({ ...newKPI, unit: e.target.value })}
										className="w-full px-4 py-2 border border-border-dark rounded-xl bg-[#1a1a1a] text-white focus:outline-none focus:border-orange-500"
									>
										{kpiUnits.map(unit => (
											<option key={unit.value} value={unit.value}>{unit.label}</option>
										))}
									</select>
								</div>
							</div>

							{/* Period - Optional */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<label className="block text-sm font-medium mb-2 text-neutral-300">Period (Optional)</label>
									<Select
										value={newKPI.period || 'quarterly'}
										onChange={(e) => setNewKPI({ ...newKPI, period: e.target.value as any })}
									>
										<option value="monthly">Monthly</option>
										<option value="quarterly">Quarterly</option>
										<option value="annual">Annual</option>
									</Select>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2 text-neutral-300">Start Date (Optional)</label>
									<Input
										type="date"
										value={newKPI.startDate || ''}
										onChange={(e) => setNewKPI({ ...newKPI, startDate: e.target.value })}
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2 text-neutral-300">End Date (Optional)</label>
									<Input
										type="date"
										value={newKPI.endDate || ''}
										onChange={(e) => setNewKPI({ ...newKPI, endDate: e.target.value })}
									/>
								</div>
							</div>

							{/* Responsibility - Optional */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium mb-2 text-neutral-300">
										Owner/Responsible Person (Optional)
									</label>
									<Select
										value={newKPI.owner || ''}
										onChange={(e) => setNewKPI({ ...newKPI, owner: e.target.value })}
									>
										<option value="">Not assigned</option>
										{leadership.map((leader) => (
											<option key={leader.id} value={`${leader.name}, ${leader.position}`}>
												{leader.name} - {leader.position}
											</option>
										))}
									</Select>
									{leadership.length === 0 && (
										<p className="text-xs text-neutral-500 mt-1">
											💡 Add leaders in the Leadership tab to assign owners
										</p>
									)}
								</div>
								<div>
									<label className="block text-sm font-medium mb-2 text-neutral-300">Department (Optional)</label>
									<Select
										value={newKPI.department || ''}
										onChange={(e) => setNewKPI({ ...newKPI, department: e.target.value })}
									>
										<option value="">Not assigned</option>
										{availableDepartments.map((dept) => (
											<option key={dept.id} value={dept.name}>
												{dept.name}
											</option>
										))}
									</Select>
								</div>
							</div>

							{/* Measurement - Optional */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium mb-2 text-neutral-300">Measurement Frequency (Optional)</label>
									<Select
										value={newKPI.measurementFrequency || 'monthly'}
										onChange={(e) => setNewKPI({ ...newKPI, measurementFrequency: e.target.value as any })}
									>
										<option value="daily">Daily</option>
										<option value="weekly">Weekly</option>
										<option value="monthly">Monthly</option>
										<option value="quarterly">Quarterly</option>
									</Select>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2 text-neutral-300">Data Source (Optional)</label>
									<Input
										value={newKPI.dataSource || ''}
										onChange={(e) => setNewKPI({ ...newKPI, dataSource: e.target.value })}
										placeholder="e.g., Salesforce, Google Analytics, Internal DB"
									/>
								</div>
							</div>

							{/* Priority - Optional */}
							<div>
								<label className="block text-sm font-medium mb-2 text-neutral-300">Priority (Optional)</label>
								<div className="flex gap-3">
									{['high', 'medium', 'low'].map((p) => (
										<button
											key={p}
											onClick={() => setNewKPI({ ...newKPI, priority: p as any })}
											className={`flex-1 px-4 py-2 rounded-xl border-2 transition-all text-white ${
												(newKPI.priority || 'medium') === p
													? 'border-orange-500 bg-orange-500/10'
													: 'border-border-dark hover:border-orange-500/50'
											}`}
										>
											<span className="font-medium capitalize">{p}</span>
										</button>
									))}
								</div>
							</div>

							{/* Actions */}
							<div className="flex justify-end gap-3 pt-4 border-t border-border-dark">
								<Button
									variant="outline"
									onClick={() => setIsAdding(false)}
									className="border-border-dark hover:bg-border-dark text-white"
								>
									Cancel
								</Button>
								<Button onClick={onAdd} className="bg-white text-black hover:bg-neutral-200">
									<Plus className="h-4 w-4 mr-2" />
									Add KPI
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* KPIs List - Grouped by Category */}
			{groupedKPIs.length > 0 ? (
				<div className="space-y-6">
					{groupedKPIs.map((group) => (
						<Card key={group.value} className="bg-surface-dark border-border-dark">
							<CardHeader>
								<div className="flex items-center gap-3">
									<span className="text-2xl">{group.icon}</span>
									<div>
										<h3 className="font-bold text-lg text-white">{group.label} KPIs</h3>
										<p className="text-xs text-neutral-400">
											{group.description} • {group.kpis.length} KPI(s)
										</p>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{group.kpis.map((kpi) => {
										const progress = calculateProgress(kpi.currentValue, kpi.targetValue)
										const isEditing = editingId === kpi.id

										return (
											<div
												key={kpi.id}
												className="p-4 rounded-xl border border-border-dark hover:border-orange-500/50 transition-all bg-[#1a1a1a]"
											>
												{isEditing ? (
													// Edit Mode
													<div className="space-y-4">
														<div className="grid grid-cols-2 gap-3">
															<Input
																value={kpi.name}
																onChange={(e) => onUpdate(kpi.id, 'name', e.target.value)}
																placeholder="KPI Name"
															/>
															<Input
																value={kpi.owner}
																onChange={(e) => onUpdate(kpi.id, 'owner', e.target.value)}
																placeholder="Owner"
															/>
															<Input
																type="number"
																value={kpi.currentValue}
																onChange={(e) => onUpdate(kpi.id, 'currentValue', Number(e.target.value))}
																placeholder="Current Value"
															/>
															<Input
																type="number"
																value={kpi.targetValue}
																onChange={(e) => onUpdate(kpi.id, 'targetValue', Number(e.target.value))}
																placeholder="Target Value"
															/>
														</div>
														<Button
															variant="outline"
															size="sm"
															onClick={() => setEditingId(null)}
															className="border-border-dark hover:bg-border-dark text-white"
														>
															Save Changes
														</Button>
													</div>
												) : (
													// View Mode
													<>
														<div className="flex items-start justify-between mb-3">
															<div className="flex-1">
																<h4 className="font-bold text-lg mb-1 text-white">{kpi.name}</h4>
																{kpi.description && (
																	<p className="text-sm text-neutral-400 mb-2">
																		{kpi.description}
																	</p>
																)}
																<div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
																	<span className="flex items-center gap-1 text-neutral-400">
																		👤 {kpi.owner}
																	</span>
																	{kpi.department && (
																		<span>• {kpi.department}</span>
																	)}
																	<span>• {kpi.period}</span>
																	<span>• Updated {kpi.measurementFrequency}</span>
																</div>
															</div>
															<div className="flex gap-2">
																<Button
																	variant="outline"
																	size="sm"
																	onClick={() => setEditingId(kpi.id)}
																	className="px-2 border-border-dark hover:bg-border-dark text-neutral-400 hover:text-white"
																>
																	<Edit2 className="h-4 w-4" />
																</Button>
																<Button
																	variant="outline"
																	size="sm"
																	onClick={() => onDelete(kpi.id)}
																	className="px-2 border-border-dark hover:bg-border-dark text-neutral-400 hover:text-red-400"
																>
																	<Trash2 className="h-4 w-4" />
																</Button>
															</div>
														</div>

														{/* Progress Bar */}
														<div className="mb-3">
															<div className="flex items-center justify-between text-sm mb-2">
																<span className="font-medium text-white">Progress: {progress}%</span>
																<span className="text-neutral-500">
																	{kpi.currentValue} / {kpi.targetValue} {kpi.unit}
																</span>
															</div>
															<div className="relative w-full h-3 bg-neutral-800 rounded-full overflow-hidden">
																<div
																	className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${
																		progress >= 100 ? 'bg-green-500' :
																		progress >= 75 ? 'bg-blue-500' :
																		progress >= 50 ? 'bg-yellow-500' :
																		'bg-red-500'
																	}`}
																	style={{ width: `${progress}%` }}
																/>
															</div>
														</div>

														{/* Status & Info */}
														<div className="flex flex-wrap items-center gap-2">
															<div className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1 ${getStatusColor(kpi.status)}`}>
																{getStatusIcon(kpi.status)}
																{kpi.status.replace('-', ' ').toUpperCase()}
															</div>
															<div className={`px-3 py-1 rounded-lg text-xs font-medium ${
																kpi.priority === 'high' ? 'bg-red-900/20 text-red-400 border border-red-900/30' :
																kpi.priority === 'medium' ? 'bg-yellow-900/20 text-yellow-400 border border-yellow-900/30' :
																'bg-green-900/20 text-green-400 border border-green-900/30'
															}`}>
																{kpi.priority.toUpperCase()} PRIORITY
															</div>
															{kpi.dataSource && (
																<div className="px-3 py-1 rounded-lg text-xs bg-neutral-800 text-neutral-400 border border-neutral-700">
																	📊 {kpi.dataSource}
																</div>
															)}
														</div>
													</>
												)}
											</div>
										)
									})}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			) : !isAdding && (
				<Card className="bg-surface-dark border-dashed border-2 border-border-dark">
					<CardContent className="p-12 text-center">
						<Target className="h-12 w-12 mx-auto text-neutral-600 mb-4" />
						<h3 className="font-semibold text-lg mb-2 text-white">No KPIs Yet</h3>
						<p className="text-sm text-neutral-400 mb-4">
							Start by adding your first company KPI to track performance
						</p>
						<Button onClick={() => setIsAdding(true)} className="bg-white text-black hover:bg-neutral-200">
							<Plus className="h-4 w-4 mr-2" />
							Add First KPI
						</Button>
					</CardContent>
				</Card>
			)}
		</div>
	)
}

