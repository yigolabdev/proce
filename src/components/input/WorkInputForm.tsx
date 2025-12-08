/**
 * WorkInputForm Component
 * 업무 입력 메인 폼
 */

import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import { FileText, Shield } from 'lucide-react'
import type { WorkInputFormData, Project, WorkCategory } from '../../types/workInput.types'

export interface WorkInputFormProps {
	formData: WorkInputFormData
	setFormData: (data: Partial<WorkInputFormData>) => void
	onSubmit: (e: React.FormEvent) => Promise<void>
	projects: Project[]
	categories: WorkCategory[]
	reviewers: Array<{ id: string; name: string; department: string }>
	disabled?: boolean
	children?: React.ReactNode
}

export function WorkInputForm({
	formData,
	setFormData,
	onSubmit,
	projects,
	categories,
	// reviewers,
	disabled,
	children,
}: WorkInputFormProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<FileText className="h-5 w-5" />
					Work Entry Details
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={onSubmit} className="space-y-6">
					{/* Title */}
					<div>
						<label className="block text-sm font-medium text-neutral-300 mb-2">
							Title <span className="text-red-500">*</span>
						</label>
						<Input
							value={formData.title}
							onChange={(e) => setFormData({ title: e.target.value })}
							placeholder="Enter work title..."
							disabled={disabled}
							required
						/>
					</div>

					{/* Description */}
					<div>
						<label className="block text-sm font-medium text-neutral-300 mb-2">
							Description <span className="text-red-500">*</span>
						</label>
						<Textarea
							value={formData.description}
							onChange={(e) => setFormData({ description: e.target.value })}
							placeholder="Describe your work in detail..."
							rows={6}
							disabled={disabled}
							required
						/>
					</div>

					{/* Project & Category */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-neutral-300 mb-2">
								Project
							</label>
							<select
								value={formData.projectId}
								onChange={(e) => setFormData({ projectId: e.target.value })}
								className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white"
								disabled={disabled}
							>
								<option value="">Select project...</option>
								{projects.map((project) => (
									<option key={project.id} value={project.id}>
										{project.name}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-neutral-300 mb-2">
								Category
							</label>
							<select
								value={formData.category}
								onChange={(e) => setFormData({ category: e.target.value })}
								className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white"
								disabled={disabled}
							>
								<option value="">Select category...</option>
								{categories.map((cat) => (
									<option key={cat.id} value={cat.id}>
										{cat.name}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Comment */}
					<div>
						<label className="block text-sm font-medium text-neutral-300 mb-2">
							Additional Comments
						</label>
						<Textarea
							value={formData.comment}
							onChange={(e) => setFormData({ comment: e.target.value })}
							placeholder="Any additional notes..."
							rows={3}
							disabled={disabled}
						/>
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
