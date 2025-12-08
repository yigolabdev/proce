/**
 * OKRForm Component
 * OKR 목표 생성/수정 폼
 */

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import { Target, X, Save } from 'lucide-react'
import { toast } from 'sonner'
import type { Objective, ObjectiveFormData } from '../../types/okr.types'

export interface OKRFormProps {
	objective?: Objective
	onSubmit: (data: ObjectiveFormData) => void
	onCancel: () => void
	teams: Array<{ id: string; name: string }>
	users: Array<{ id: string; name: string }>
	isSubmitting?: boolean
}

export function OKRForm({
	objective,
	onSubmit,
	onCancel,
	teams,
	users,
	isSubmitting = false,
}: OKRFormProps) {
	const [formData, setFormData] = useState<ObjectiveFormData>({
		title: objective?.title || '',
		description: objective?.description || '',
		period: objective?.period || '',
		periodType: objective?.periodType || 'quarter',
		owner: objective?.ownerId || '',
		team: objective?.teamId || '',
		startDate: objective?.startDate || '',
		endDate: objective?.endDate || '',
	})

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		// Validation
		if (!formData.title.trim()) {
			toast.error('Please enter a title')
			return
		}
		if (!formData.period) {
			toast.error('Please select a period')
			return
		}
		if (!formData.owner) {
			toast.error('Please select an owner')
			return
		}
		if (!formData.team) {
			toast.error('Please select a team')
			return
		}

		onSubmit(formData)
	}

	const quarters = ['Q1', 'Q2', 'Q3', 'Q4']
	const months = [
		'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
		'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
	]

	return (
		<Card className="bg-surface-dark border-border-dark">
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						<Target className="h-5 w-5 text-orange-400" />
						{objective ? 'Edit Objective' : 'Create New Objective'}
					</CardTitle>
					<Button onClick={onCancel} variant="ghost" size="sm">
						<X className="h-4 w-4" />
					</Button>
				</div>
			</CardHeader>

			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Title */}
					<div>
						<label className="block text-sm font-medium text-neutral-300 mb-2">
							Title <span className="text-red-400">*</span>
						</label>
						<Input
							type="text"
							placeholder="e.g., Increase customer satisfaction"
							value={formData.title}
							onChange={(e) => setFormData({ ...formData, title: e.target.value })}
							disabled={isSubmitting}
							required
						/>
					</div>

					{/* Description */}
					<div>
						<label className="block text-sm font-medium text-neutral-300 mb-2">
							Description
						</label>
						<Textarea
							placeholder="Describe the objective in detail..."
							value={formData.description}
							onChange={(e) => setFormData({ ...formData, description: e.target.value })}
							disabled={isSubmitting}
							rows={3}
						/>
					</div>

					{/* Period Type & Period */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-neutral-300 mb-2">
								Period Type <span className="text-red-400">*</span>
							</label>
							<select
								value={formData.periodType}
								onChange={(e) => setFormData({
									...formData,
									periodType: e.target.value as 'quarter' | 'month',
									period: '', // Reset period when type changes
								})}
								disabled={isSubmitting}
								className="w-full px-3 py-2 bg-surface-dark border border-border-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
								required
							>
								<option value="quarter">Quarter</option>
								<option value="month">Month</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-neutral-300 mb-2">
								Period <span className="text-red-400">*</span>
							</label>
							<select
								value={formData.period}
								onChange={(e) => setFormData({ ...formData, period: e.target.value })}
								disabled={isSubmitting}
								className="w-full px-3 py-2 bg-surface-dark border border-border-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
								required
							>
								<option value="">Select...</option>
								{formData.periodType === 'quarter'
									? quarters.map((q) => (
											<option key={q} value={q}>
												{q}
											</option>
									  ))
									: months.map((m) => (
											<option key={m} value={m}>
												{m}
											</option>
									  ))}
							</select>
						</div>
					</div>

					{/* Dates */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-neutral-300 mb-2">
								Start Date <span className="text-red-400">*</span>
							</label>
							<Input
								type="date"
								value={formData.startDate}
								onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
								disabled={isSubmitting}
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-neutral-300 mb-2">
								End Date <span className="text-red-400">*</span>
							</label>
							<Input
								type="date"
								value={formData.endDate}
								onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
								disabled={isSubmitting}
								required
							/>
						</div>
					</div>

					{/* Team & Owner */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-neutral-300 mb-2">
								Team <span className="text-red-400">*</span>
							</label>
							<select
								value={formData.team}
								onChange={(e) => setFormData({ ...formData, team: e.target.value })}
								disabled={isSubmitting}
								className="w-full px-3 py-2 bg-surface-dark border border-border-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
								required
							>
								<option value="">Select team...</option>
								{teams.map((team) => (
									<option key={team.id} value={team.id}>
										{team.name}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-neutral-300 mb-2">
								Owner <span className="text-red-400">*</span>
							</label>
							<select
								value={formData.owner}
								onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
								disabled={isSubmitting}
								className="w-full px-3 py-2 bg-surface-dark border border-border-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
								required
							>
								<option value="">Select owner...</option>
								{users.map((user) => (
									<option key={user.id} value={user.id}>
										{user.name}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Actions */}
					<div className="flex items-center justify-end gap-3 pt-4 border-t border-border-dark">
						<Button
							type="button"
							onClick={onCancel}
							disabled={isSubmitting}
							variant="outline"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isSubmitting}
							variant="brand"
						>
							{isSubmitting ? (
								<>
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
									Saving...
								</>
							) : (
								<>
									<Save className="h-4 w-4 mr-2" />
									{objective ? 'Update' : 'Create'} Objective
								</>
							)}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	)
}

