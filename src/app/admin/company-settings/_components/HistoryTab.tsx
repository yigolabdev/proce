import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card'
import { Button } from '../../../../components/ui/Button'
import Input from '../../../../components/ui/Input'
import Textarea from '../../../../components/ui/Textarea'
import { 
	Plus, 
	Trash2, 
	Save, 
	History, 
	Calendar, 
	Target, 
	Code, 
	Users, 
	DollarSign, 
	Lightbulb 
} from 'lucide-react'
import type { HistoricalData } from '../_types/types'
import { useI18n } from '../../../../i18n/I18nProvider'

interface HistoryTabProps {
	historicalData: HistoricalData[]
	onAdd: (data: Omit<HistoricalData, 'id'>) => void
	onUpdate: (id: string, data: Partial<HistoricalData>) => void
	onDelete: (id: string) => void
}

export default function HistoryTab({
	historicalData,
	onAdd,
	onUpdate,
	onDelete
}: HistoryTabProps) {
	const { t } = useI18n()
	const [isAdding, setIsAdding] = useState(false)
	const [editingId, setEditingId] = useState<string | null>(null)
	const [formData, setFormData] = useState<Partial<HistoricalData>>({})

	const handleEdit = (item: HistoricalData) => {
		setEditingId(item.id)
		setFormData(item)
		setIsAdding(true)
	}

	const handleSave = () => {
		if (!formData.projectName || !formData.description) return

		if (editingId) {
			onUpdate(editingId, formData)
		} else {
			onAdd(formData as Omit<HistoricalData, 'id'>)
		}
		resetForm()
	}

	const resetForm = () => {
		setFormData({})
		setEditingId(null)
		setIsAdding(false)
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h2 className="text-lg font-bold text-white">{t('companySettings.history.title')}</h2>
					<p className="text-sm text-neutral-400">
						{t('companySettings.history.description')}
					</p>
				</div>
				{!isAdding && (
					<Button onClick={() => setIsAdding(true)} className="gap-2">
						<Plus className="h-4 w-4" />
						{t('companySettings.history.addRecord')}
					</Button>
				)}
			</div>

			{isAdding && (
				<Card className="border-border-dark bg-surface-dark animate-in slide-in-from-top-2">
					<CardHeader className="border-b border-border-dark pb-4">
						<CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
							<History className="h-5 w-5 text-blue-500" />
							{editingId ? t('companySettings.history.editRecord') : t('companySettings.history.newRecord')}
						</CardTitle>
					</CardHeader>
					<CardContent className="p-6 space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<label className="text-sm font-medium text-neutral-300">{t('companySettings.history.projectName')} *</label>
								<Input
									value={formData.projectName || ''}
									onChange={e => setFormData({ ...formData, projectName: e.target.value })}
									placeholder="e.g. Q3 Marketing Campaign"
									className="bg-neutral-900 border-neutral-700"
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium text-neutral-300">{t('companySettings.history.outcome')}</label>
								<Input
									value={formData.outcome || ''}
									onChange={e => setFormData({ ...formData, outcome: e.target.value })}
									placeholder="e.g. Successfully launched"
									className="bg-neutral-900 border-neutral-700"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium text-neutral-300">{t('companySettings.history.projectDescription')} *</label>
							<Textarea
								value={formData.description || ''}
								onChange={e => setFormData({ ...formData, description: e.target.value })}
								placeholder="Detailed description of the project goals and execution..."
								rows={3}
								className="bg-neutral-900 border-neutral-700"
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<label className="text-sm font-medium text-neutral-300">{t('companySettings.history.startDate')}</label>
								<div className="relative">
									<Calendar className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
									<Input
										type="date"
										value={formData.startDate || ''}
										onChange={e => setFormData({ ...formData, startDate: e.target.value })}
										className="pl-9 bg-neutral-900 border-neutral-700"
									/>
								</div>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium text-neutral-300">{t('companySettings.history.endDate')}</label>
								<div className="relative">
									<Calendar className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
									<Input
										type="date"
										value={formData.endDate || ''}
										onChange={e => setFormData({ ...formData, endDate: e.target.value })}
										className="pl-9 bg-neutral-900 border-neutral-700"
									/>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="space-y-2">
								<label className="text-sm font-medium text-neutral-300">{t('companySettings.history.technologies')}</label>
								<div className="relative">
									<Code className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
									<Input
										value={formData.technologies?.join(', ') || ''}
										onChange={e => setFormData({ ...formData, technologies: e.target.value.split(',').map(s => s.trim()) })}
										placeholder="React, Node.js, Figma..."
										className="pl-9 bg-neutral-900 border-neutral-700"
									/>
								</div>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium text-neutral-300">{t('companySettings.history.teamSize')}</label>
								<div className="relative">
									<Users className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
									<Input
										type="number"
										value={formData.teamSize || ''}
										onChange={e => setFormData({ ...formData, teamSize: parseInt(e.target.value) || 0 })}
										placeholder="5"
										className="pl-9 bg-neutral-900 border-neutral-700"
									/>
								</div>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium text-neutral-300">{t('companySettings.history.budget')}</label>
								<div className="relative">
									<DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
									<Input
										value={formData.budget || ''}
										onChange={e => setFormData({ ...formData, budget: e.target.value })}
										placeholder="$10,000"
										className="pl-9 bg-neutral-900 border-neutral-700"
									/>
								</div>
							</div>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium text-neutral-300">{t('companySettings.history.keyLearnings')}</label>
							<div className="relative">
								<Lightbulb className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
								<Textarea
									value={formData.keyLearnings || ''}
									onChange={e => setFormData({ ...formData, keyLearnings: e.target.value })}
									placeholder="What went well? What could be improved?"
									rows={2}
									className="pl-9 bg-neutral-900 border-neutral-700"
								/>
							</div>
						</div>

						<div className="flex justify-end gap-3 pt-4">
							<Button variant="outline" onClick={resetForm}>{t('common.cancel')}</Button>
							<Button onClick={handleSave} className="gap-2">
								<Save className="h-4 w-4" />
								{t('companySettings.history.save')}
							</Button>
						</div>
					</CardContent>
				</Card>
			)}

			<div className="grid grid-cols-1 gap-4">
				{historicalData.map((item) => (
					<Card key={item.id} className="border-border-dark bg-surface-dark hover:border-neutral-600 transition-colors">
						<CardContent className="p-5">
							<div className="flex justify-between items-start">
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<h3 className="text-lg font-semibold text-white">{item.projectName}</h3>
										<span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
											{item.startDate} - {item.endDate}
										</span>
									</div>
									<p className="text-sm text-neutral-400">{item.description}</p>
									
									{item.outcome && (
										<div className="flex items-center gap-2 text-sm text-green-400">
											<Target className="h-4 w-4" />
											<span>{t('companySettings.history.outcome')}: {item.outcome}</span>
										</div>
									)}

									<div className="flex gap-4 pt-2 text-xs text-neutral-500">
										{item.technologies && item.technologies.length > 0 && (
											<div className="flex items-center gap-1">
												<Code className="h-3 w-3" />
												{item.technologies.join(', ')}
											</div>
										)}
										{item.teamSize && (
											<div className="flex items-center gap-1">
												<Users className="h-3 w-3" />
												{item.teamSize} members
											</div>
										)}
									</div>
								</div>
								<div className="flex gap-2">
									<Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
										{t('common.edit')}
									</Button>
									<Button size="sm" variant="outline" className="text-red-500 hover:text-red-400" onClick={() => onDelete(item.id)}>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
				
				{historicalData.length === 0 && !isAdding && (
					<div className="text-center py-12 border-2 border-dashed border-neutral-800 rounded-xl">
						<History className="h-12 w-12 text-neutral-700 mx-auto mb-3" />
						<h3 className="text-lg font-medium text-neutral-400">{t('companySettings.history.noData')}</h3>
						<p className="text-sm text-neutral-600 mt-1">
							{t('companySettings.history.noDataDesc')}
						</p>
						<Button variant="outline" className="mt-4" onClick={() => setIsAdding(true)}>
							{t('companySettings.history.addFirst')}
						</Button>
					</div>
				)}
			</div>
		</div>
	)
}
