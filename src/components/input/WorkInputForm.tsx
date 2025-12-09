/**
 * WorkInputForm Component
 * 업무 입력 메인 폼 - 기본 정보만 포함
 */

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import { FileText, Shield, ChevronDown } from 'lucide-react'
import type { WorkInputFormData, WorkCategory } from '../../types/workInput.types'

export interface WorkInputFormProps {
	formData: WorkInputFormData
	setFormData: (data: Partial<WorkInputFormData>) => void
	onSubmit: (e: React.FormEvent) => Promise<void>
	categories: WorkCategory[]
	disabled?: boolean
	children?: React.ReactNode
}

export function WorkInputForm({
	formData,
	setFormData,
	onSubmit,
	categories,
	disabled,
	children,
}: WorkInputFormProps) {
	const [showCustomCategory, setShowCustomCategory] = useState(false)

	return (
		<Card className="bg-neutral-900 border-neutral-800">
			<CardHeader className="border-b border-neutral-800 pb-4">
				<CardTitle className="flex items-center gap-2 text-white">
					<FileText className="h-5 w-5" />
					Basic Information
				</CardTitle>
				<p className="text-sm text-neutral-400 mt-1">Essential details about your work</p>
			</CardHeader>
			<CardContent className="p-6">
				<form onSubmit={onSubmit} className="space-y-5">
					{/* Title */}
					<div>
						<label className="block text-sm font-semibold mb-2 text-neutral-300">
							Title <span className="text-red-500">*</span>
						</label>
						<Input
							value={formData.title}
							onChange={(e) => setFormData({ title: e.target.value })}
							placeholder="Enter work title..."
							className="bg-neutral-800 border-neutral-700 text-white focus:border-orange-500 placeholder-neutral-500"
							disabled={disabled}
							required
						/>
					</div>

					{/* Description */}
					<div>
						<label className="block text-sm font-semibold mb-2 text-neutral-300">
							Description <span className="text-red-500">*</span>
						</label>
						<Textarea
							value={formData.description}
							onChange={(e) => setFormData({ description: e.target.value })}
							placeholder="Describe your work in detail..."
							rows={6}
							className="text-sm bg-neutral-800 border-neutral-700 text-white focus:border-orange-500 placeholder-neutral-500"
							disabled={disabled}
							required
						/>
					</div>

				{/* Status & Comment */}
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-semibold mb-2 text-neutral-300">
							Status
						</label>
						<div className="relative">
							<select
								value={showCustomCategory ? 'other' : formData.category}
								onChange={(e) => {
									const value = e.target.value
									if (value === 'other') {
										setShowCustomCategory(true)
										setFormData({ category: 'other' })
									} else {
										setShowCustomCategory(false)
										setFormData({ category: value, customCategory: '' })
									}
								}}
								className="w-full px-4 py-2.5 border border-neutral-700 rounded-xl bg-neutral-800 text-white focus:outline-none focus:border-orange-500 appearance-none"
								disabled={disabled}
							>
								<option value="">Select status...</option>
								{categories.map((cat) => (
									<option key={cat.id} value={cat.id}>
										{cat.name}
									</option>
								))}
							</select>
							<ChevronDown className="absolute right-3 top-3 h-4 w-4 text-neutral-500 pointer-events-none" />
						</div>
						{showCustomCategory && (
							<Input
								type="text"
								placeholder="Enter custom status"
								value={formData.customCategory}
								onChange={(e) => setFormData({ customCategory: e.target.value })}
								className="mt-2 bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500"
								disabled={disabled}
							/>
						)}
					</div>

					<div>
						<label className="block text-sm font-semibold mb-2 text-neutral-300">
							One-line Comment
						</label>
						<Input
							type="text"
							value={formData.comment}
							onChange={(e) => setFormData({ comment: e.target.value })}
							placeholder="Add a quick note..."
							className="w-full bg-neutral-800 border-neutral-700 text-white focus:border-orange-500 placeholder-neutral-500"
							disabled={disabled}
						/>
					</div>
				</div>

				{/* Date & Duration */}
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-semibold mb-2 text-neutral-300">
							Date
						</label>
						<Input
							type="date"
							value={
								formData.date
									? typeof formData.date === 'string'
										? formData.date.split('T')[0]
										: formData.date.toISOString().split('T')[0]
									: new Date().toISOString().split('T')[0]
							}
							onChange={(e) => setFormData({ date: e.target.value })}
							className="bg-neutral-800 border-neutral-700 text-white focus:border-orange-500"
							disabled={disabled}
						/>
					</div>

					<div>
						<label className="block text-sm font-semibold mb-2 text-neutral-300">
							Duration (Time Spent)
						</label>
						<Input
							type="text"
							value={formData.duration || ''}
							onChange={(e) => setFormData({ duration: e.target.value })}
							placeholder="e.g., 2h 30m"
							className="bg-neutral-800 border-neutral-700 text-white focus:border-orange-500 placeholder-neutral-500"
							disabled={disabled}
						/>
						<p className="text-xs text-neutral-500 mt-1">
							Format: 2h 30m, 1.5h, or 90m
						</p>
					</div>
				</div>

					{/* Confidential */}
					<div className="flex items-center gap-2">
						<input
							type="checkbox"
							id="isConfidential"
							checked={formData.isConfidential}
							onChange={(e) => setFormData({ isConfidential: e.target.checked })}
							disabled={disabled}
							className="w-4 h-4"
						/>
						<label htmlFor="isConfidential" className="text-sm text-neutral-300 flex items-center gap-2">
							<Shield className="h-4 w-4 text-orange-400" />
							Confidential (visible only to assigned reviewer)
						</label>
					</div>

					{children}
				</form>
			</CardContent>
		</Card>
	)
}
