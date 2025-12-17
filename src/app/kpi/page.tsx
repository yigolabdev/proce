/**
 * KPI Management Page
 * Settings UI 스타일 기반 Company KPI 관리 페이지
 */

import { useState, useEffect } from 'react'
import { PageHeader } from '../../components/common/PageHeader'
import { Button } from '../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Plus, Target, TrendingUp, TrendingDown, AlertCircle, Trash2, Edit2, Save, X } from 'lucide-react'
import { toast } from 'sonner'
import Toaster from '../../components/ui/Toaster'
import { storage } from '../../utils/storage'
import Input from '../../components/ui/Input'
import type { CompanyKPI } from '../../app/admin/company-settings/_types/types'

export default function KPIPage() {
	const [kpis, setKPIs] = useState<CompanyKPI[]>([])
	const [isAdding, setIsAdding] = useState(false)
	const [editingId, setEditingId] = useState<string | null>(null)
	const [formData, setFormData] = useState<Partial<CompanyKPI>>({
		name: '',
		description: '',
		category: 'Financial',
		targetValue: 0,
		currentValue: 0,
		unit: '%',
		period: 'quarterly',
		startDate: '',
		endDate: '',
		owner: '',
		department: '',
		measurementFrequency: 'monthly',
		dataSource: '',
		status: 'on-track',
		priority: 'medium',
	})

	// Load KPIs
	useEffect(() => {
		const loadedKPIs = storage.get<CompanyKPI[]>('companyKPIs', [])
		setKPIs(loadedKPIs)
	}, [])

	// Calculate progress
	const calculateProgress = (current: number, target: number): number => {
		if (target === 0) return 0
		return Math.min(Math.round((current / target) * 100), 100)
	}

	// Get status color
	const getStatusColor = (status: CompanyKPI['status']) => {
		switch (status) {
			case 'achieved':
				return 'text-green-400 bg-green-500/10 border-green-500/30'
			case 'on-track':
				return 'text-blue-400 bg-blue-500/10 border-blue-500/30'
			case 'at-risk':
				return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
			case 'behind':
				return 'text-red-400 bg-red-500/10 border-red-500/30'
			default:
				return 'text-neutral-400 bg-neutral-500/10 border-neutral-500/30'
		}
	}

	// Get category color
	const getCategoryColor = (category: CompanyKPI['category']) => {
		switch (category) {
			case 'Financial':
				return 'text-green-400 bg-green-500/10'
			case 'Customer':
				return 'text-blue-400 bg-blue-500/10'
			case 'Operational':
				return 'text-orange-400 bg-orange-500/10'
			case 'HR':
				return 'text-purple-400 bg-purple-500/10'
			case 'Growth':
				return 'text-pink-400 bg-pink-500/10'
			case 'Strategic':
				return 'text-cyan-400 bg-cyan-500/10'
			default:
				return 'text-neutral-400 bg-neutral-500/10'
		}
	}

	// Calculate trend
	const calculateTrend = (current: number, target: number): 'up' | 'down' | 'neutral' => {
		const progress = (current / target) * 100
		if (progress >= 90) return 'up'
		if (progress < 70) return 'down'
		return 'neutral'
	}

	// Handle Add/Edit
	const handleSave = () => {
		if (!formData.name) {
			toast.error('Please enter KPI name')
			return
		}

		const newKPI: CompanyKPI = {
			id: editingId || Date.now().toString(),
			name: formData.name!,
			description: formData.description || '',
			category: formData.category || 'Financial',
			targetValue: formData.targetValue || 0,
			currentValue: formData.currentValue || 0,
			unit: formData.unit || '%',
			period: formData.period || 'quarterly',
			startDate: formData.startDate || '',
			endDate: formData.endDate || '',
			owner: formData.owner || '',
			department: formData.department || '',
			measurementFrequency: formData.measurementFrequency || 'monthly',
			dataSource: formData.dataSource || '',
			status: formData.status || 'on-track',
			priority: formData.priority || 'medium',
			createdAt: editingId ? kpis.find(k => k.id === editingId)?.createdAt || new Date() : new Date(),
			updatedAt: new Date(),
		}

		let updatedKPIs: CompanyKPI[]
		if (editingId) {
			updatedKPIs = kpis.map(k => k.id === editingId ? newKPI : k)
			toast.success('KPI updated successfully')
		} else {
			updatedKPIs = [newKPI, ...kpis]
			toast.success('KPI added successfully')
		}

		setKPIs(updatedKPIs)
		storage.set('companyKPIs', updatedKPIs)
		window.dispatchEvent(new Event('companyKPIsUpdated'))

		// Reset form
		setFormData({
			name: '',
			description: '',
			category: 'Financial',
			targetValue: 0,
			currentValue: 0,
			unit: '%',
			period: 'quarterly',
			startDate: '',
			endDate: '',
			owner: '',
			department: '',
			measurementFrequency: 'monthly',
			dataSource: '',
			status: 'on-track',
			priority: 'medium',
		})
		setIsAdding(false)
		setEditingId(null)
	}

	// Handle Edit
	const handleEdit = (kpi: CompanyKPI) => {
		setFormData(kpi)
		setEditingId(kpi.id)
		setIsAdding(true)
	}

	// Handle Delete
	const handleDelete = (id: string) => {
		if (window.confirm('Are you sure you want to delete this KPI?')) {
			const updatedKPIs = kpis.filter(k => k.id !== id)
			setKPIs(updatedKPIs)
			storage.set('companyKPIs', updatedKPIs)
			window.dispatchEvent(new Event('companyKPIsUpdated'))
			toast.success('KPI deleted')
		}
	}

	// Handle Cancel
	const handleCancel = () => {
		setFormData({
			name: '',
			description: '',
			category: 'Financial',
			targetValue: 0,
			currentValue: 0,
			unit: '%',
			period: 'quarterly',
			startDate: '',
			endDate: '',
			owner: '',
			department: '',
			measurementFrequency: 'monthly',
			dataSource: '',
			status: 'on-track',
			priority: 'medium',
		})
		setIsAdding(false)
		setEditingId(null)
	}

	return (
		<div className="min-h-screen bg-background-dark">
			<Toaster />
			
			<div className="max-w-[1400px] mx-auto px-6 py-6 space-y-8">
				{/* Page Header */}
				<PageHeader
					title="Company KPI Management"
					description="Manage company-wide key performance indicators visible to all employees"
					actions={
						!isAdding && (
							<Button onClick={() => setIsAdding(true)} variant="brand">
								<Plus className="h-4 w-4 mr-2" />
								New KPI
							</Button>
						)
					}
				/>

				{/* Add/Edit Form */}
				{isAdding && (
					<Card className="bg-surface-dark border-border-dark">
						<CardHeader className="border-b border-border-dark">
							<div className="flex items-center justify-between">
								<CardTitle>{editingId ? 'Edit KPI' : 'Add New KPI'}</CardTitle>
								<div className="flex gap-2">
									<Button onClick={handleSave} variant="brand" size="sm">
										<Save className="h-4 w-4 mr-2" />
										Save
									</Button>
									<Button onClick={handleCancel} variant="ghost" size="sm">
										<X className="h-4 w-4 mr-2" />
										Cancel
									</Button>
								</div>
							</div>
						</CardHeader>
						<CardContent className="p-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{/* Basic Info */}
								<div className="md:col-span-2">
									<label className="block text-sm font-medium text-neutral-300 mb-2">
										KPI Name *
									</label>
									<Input
										value={formData.name}
										onChange={(e) => setFormData({ ...formData, name: e.target.value })}
										placeholder="Enter KPI name"
									/>
								</div>

								<div className="md:col-span-2">
									<label className="block text-sm font-medium text-neutral-300 mb-2">
										Description
									</label>
									<Input
										value={formData.description}
										onChange={(e) => setFormData({ ...formData, description: e.target.value })}
										placeholder="Enter description"
									/>
								</div>

								{/* Category and Priority */}
								<div>
									<label className="block text-sm font-medium text-neutral-300 mb-2">
										Category
									</label>
									<select
										value={formData.category}
										onChange={(e) => setFormData({ ...formData, category: e.target.value as CompanyKPI['category'] })}
										className="w-full px-3 py-2 bg-background-dark border border-border-dark rounded-lg text-white"
									>
										<option value="Financial">Financial</option>
										<option value="Customer">Customer</option>
										<option value="Operational">Operational</option>
										<option value="HR">HR</option>
										<option value="Growth">Growth</option>
										<option value="Strategic">Strategic</option>
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-neutral-300 mb-2">
										Priority
									</label>
									<select
										value={formData.priority}
										onChange={(e) => setFormData({ ...formData, priority: e.target.value as CompanyKPI['priority'] })}
										className="w-full px-3 py-2 bg-background-dark border border-border-dark rounded-lg text-white"
									>
										<option value="high">High</option>
										<option value="medium">Medium</option>
										<option value="low">Low</option>
									</select>
								</div>

								{/* Target and Current */}
								<div>
									<label className="block text-sm font-medium text-neutral-300 mb-2">
										Target Value *
									</label>
									<Input
										type="number"
										value={formData.targetValue}
										onChange={(e) => setFormData({ ...formData, targetValue: parseFloat(e.target.value) })}
										placeholder="0"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-neutral-300 mb-2">
										Current Value
									</label>
									<Input
										type="number"
										value={formData.currentValue}
										onChange={(e) => setFormData({ ...formData, currentValue: parseFloat(e.target.value) })}
										placeholder="0"
									/>
								</div>

								{/* Unit and Period */}
								<div>
									<label className="block text-sm font-medium text-neutral-300 mb-2">
										Unit
									</label>
									<Input
										value={formData.unit}
										onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
										placeholder="%"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-neutral-300 mb-2">
										Period
									</label>
									<select
										value={formData.period}
										onChange={(e) => setFormData({ ...formData, period: e.target.value as CompanyKPI['period'] })}
										className="w-full px-3 py-2 bg-background-dark border border-border-dark rounded-lg text-white"
									>
										<option value="monthly">Monthly</option>
										<option value="quarterly">Quarterly</option>
										<option value="annual">Annual</option>
									</select>
								</div>

								{/* Dates */}
								<div>
									<label className="block text-sm font-medium text-neutral-300 mb-2">
										Start Date
									</label>
									<Input
										type="date"
										value={formData.startDate}
										onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-neutral-300 mb-2">
										End Date
									</label>
									<Input
										type="date"
										value={formData.endDate}
										onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
									/>
								</div>

								{/* Owner and Department */}
								<div>
									<label className="block text-sm font-medium text-neutral-300 mb-2">
										Owner
									</label>
									<Input
										value={formData.owner}
										onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
										placeholder="Enter owner name"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-neutral-300 mb-2">
										Department
									</label>
									<Input
										value={formData.department}
										onChange={(e) => setFormData({ ...formData, department: e.target.value })}
										placeholder="Enter department"
									/>
								</div>

								{/* Measurement Frequency and Data Source */}
								<div>
									<label className="block text-sm font-medium text-neutral-300 mb-2">
										Measurement Frequency
									</label>
									<select
										value={formData.measurementFrequency}
										onChange={(e) => setFormData({ ...formData, measurementFrequency: e.target.value as CompanyKPI['measurementFrequency'] })}
										className="w-full px-3 py-2 bg-background-dark border border-border-dark rounded-lg text-white"
									>
										<option value="daily">Daily</option>
										<option value="weekly">Weekly</option>
										<option value="monthly">Monthly</option>
										<option value="quarterly">Quarterly</option>
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-neutral-300 mb-2">
										Data Source
									</label>
									<Input
										value={formData.dataSource}
										onChange={(e) => setFormData({ ...formData, dataSource: e.target.value })}
										placeholder="Enter data source"
									/>
								</div>
							</div>
						</CardContent>
					</Card>
				)}

				{/* KPI List */}
				{!isAdding && kpis.length === 0 && (
					<Card className="bg-surface-dark border-border-dark">
						<CardContent className="py-16 text-center">
							<Target className="h-16 w-16 text-neutral-700 mx-auto mb-4" />
							<h3 className="text-xl font-bold text-white mb-2">No KPIs Yet</h3>
							<p className="text-neutral-400 mb-6">
								Start by adding your first company-wide KPI to track performance
							</p>
							<Button onClick={() => setIsAdding(true)} variant="brand">
								<Plus className="h-4 w-4 mr-2" />
								Add First KPI
							</Button>
						</CardContent>
					</Card>
				)}

				{!isAdding && kpis.length > 0 && (
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{kpis.map((kpi) => {
							const progress = calculateProgress(kpi.currentValue, kpi.targetValue)
							const trend = calculateTrend(kpi.currentValue, kpi.targetValue)

							return (
								<Card key={kpi.id} className="bg-surface-dark border-border-dark hover:border-orange-500/30 transition-colors">
									<CardHeader className="border-b border-border-dark">
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<div className="flex items-center gap-2 mb-2">
													<span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(kpi.category)}`}>
														{kpi.category}
													</span>
													<span className={`text-xs px-2 py-1 rounded border ${getStatusColor(kpi.status)}`}>
														{kpi.status.replace('-', ' ').toUpperCase()}
													</span>
													{kpi.priority === 'high' && (
														<span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">
															High Priority
														</span>
													)}
												</div>
												<CardTitle className="text-lg">{kpi.name}</CardTitle>
												<p className="text-sm text-neutral-400 mt-1">{kpi.description}</p>
											</div>
											{trend === 'up' ? (
												<TrendingUp className="h-6 w-6 text-green-400 flex-shrink-0 ml-4" />
											) : trend === 'down' ? (
												<TrendingDown className="h-6 w-6 text-red-400 flex-shrink-0 ml-4" />
											) : (
												<AlertCircle className="h-6 w-6 text-yellow-400 flex-shrink-0 ml-4" />
											)}
										</div>
									</CardHeader>
									<CardContent className="p-6">
										<div className="space-y-4">
											{/* Progress */}
											<div className="grid grid-cols-3 gap-4">
												<div>
													<p className="text-xs text-neutral-500 mb-1">Current</p>
													<p className="text-xl font-bold text-white">
														{kpi.currentValue.toLocaleString()}
														<span className="text-sm text-neutral-400 ml-1">{kpi.unit}</span>
													</p>
												</div>
												<div>
													<p className="text-xs text-neutral-500 mb-1">Target</p>
													<p className="text-xl font-bold text-orange-400">
														{kpi.targetValue.toLocaleString()}
														<span className="text-sm text-neutral-400 ml-1">{kpi.unit}</span>
													</p>
												</div>
												<div>
													<p className="text-xs text-neutral-500 mb-1">Progress</p>
													<p className={`text-xl font-bold ${
														progress >= 90
															? 'text-green-400'
															: progress >= 70
															? 'text-blue-400'
															: progress >= 50
															? 'text-yellow-400'
															: 'text-red-400'
													}`}>
														{progress}%
													</p>
												</div>
											</div>

											{/* Progress Bar */}
											<div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
												<div
													className={`h-full transition-all duration-500 ${
														progress >= 90
															? 'bg-gradient-to-r from-green-500 to-green-400'
															: progress >= 70
															? 'bg-gradient-to-r from-blue-500 to-blue-400'
															: progress >= 50
															? 'bg-gradient-to-r from-yellow-500 to-yellow-400'
															: 'bg-gradient-to-r from-red-500 to-red-400'
													}`}
													style={{ width: `${progress}%` }}
												/>
											</div>

											{/* Meta Info */}
											<div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-border-dark">
												<div className="flex items-center gap-4">
													<span>Owner: <span className="text-neutral-300">{kpi.owner}</span></span>
													<span>Dept: <span className="text-neutral-300">{kpi.department}</span></span>
												</div>
												<span className="uppercase">{kpi.period}</span>
											</div>

											{/* Actions */}
											<div className="flex gap-2 pt-2">
												<Button onClick={() => handleEdit(kpi)} variant="outline" size="sm" className="flex-1">
													<Edit2 className="h-4 w-4 mr-2" />
													Edit
												</Button>
												<Button onClick={() => handleDelete(kpi.id)} variant="outline" size="sm" className="text-red-400 hover:text-red-300">
													<Trash2 className="h-4 w-4 mr-2" />
													Delete
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							)
						})}
					</div>
				)}
			</div>
		</div>
	)
}
