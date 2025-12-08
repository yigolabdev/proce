/**
 * WorkInputForm Component
 * 업무 입력 메인 폼
 */

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import { FileText, Save, Send, Shield } from 'lucide-react'
import type { WorkInputFormData, Project, WorkCategory } from '../../types'

export interface WorkInputFormProps {
	formData: WorkInputFormData
	onFormDataChange: (data: Partial<WorkInputFormData>) => void
	onSubmit: (e: React.FormEvent) => void
	projects: Project[]
	categories: WorkCategory[]
	reviewers?: any[]
	isSubmitting?: boolean
	autoSaveStatus?: 'idle' | 'saving' | 'saved'
	onSaveDraft?: () => void
	children?: React.ReactNode
}

export function WorkInputForm({
	formData,
	onFormDataChange,
	onSubmit,
	projects,
	categories,
	reviewers = [],
	isSubmitting = false,
	autoSaveStatus = 'idle',
	onSaveDraft,
	children,
}: WorkInputFormProps) {
	return (
		<form onSubmit={onSubmit} className="space-y-6">
			{/* Basic Information */}
			<Card className="bg-surface-dark border-border-dark">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<FileText className="h-5 w-5" />
						Basic Information
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Title */}
					<div>
						<label className="block text-sm font-medium text-neutral-300 mb-2">
							Title <span className="text-red-400">*</span>
						</label>
						<Input
							type="text"
							placeholder="Enter work title"
							value={formData.title}
							onChange={(e) => onFormDataChange({ title: e.target.value })}
							required
							disabled={isSubmitting}
						/>
					</div>

					{/* Description */}
					<div>
						<label className="block text-sm font-medium text-neutral-300 mb-2">
							Description <span className="text-red-400">*</span>
						</label>
						<Textarea
							placeholder="Describe what you worked on..."
							value={formData.description}
							onChange={(e) => onFormDataChange({ description: e.target.value })}
							required
							disabled={isSubmitting}
							rows={6}
						/>
					</div>

					{/* Category & Project */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* Category */}
						<div>
							<label className="block text-sm font-medium text-neutral-300 mb-2">
								Category <span className="text-red-400">*</span>
							</label>
							<select
								value={formData.category}
								onChange={(e) => onFormDataChange({ category: e.target.value })}
								required
								disabled={isSubmitting}
								className="w-full px-3 py-2 bg-surface-dark border border-border-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
							>
								<option value="">Select category</option>
								{categories.map((cat) => (
									<option key={cat.id} value={cat.id}>
										{cat.name}
									</option>
								))}
								<option value="custom">Custom Category...</option>
							</select>
						</div>

						{/* Project */}
						<div>
							<label className="block text-sm font-medium text-neutral-300 mb-2">
								Project <span className="text-red-400">*</span>
							</label>
							<select
								value={formData.projectId}
								onChange={(e) => onFormDataChange({ projectId: e.target.value })}
								required
								disabled={isSubmitting}
								className="w-full px-3 py-2 bg-surface-dark border border-border-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
							>
								<option value="">Select project</option>
								{projects.map((project) => (
									<option key={project.id} value={project.id}>
										{project.name}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Custom Category (if selected) */}
					{formData.category === 'custom' && (
						<div>
							<label className="block text-sm font-medium text-neutral-300 mb-2">
								Custom Category Name <span className="text-red-400">*</span>
							</label>
							<Input
								type="text"
								placeholder="Enter custom category"
								value={formData.customCategory}
								onChange={(e) => onFormDataChange({ customCategory: e.target.value })}
								required
								disabled={isSubmitting}
							/>
						</div>
					)}

					{/* Confidential */}
					<div className="flex items-center gap-2">
						<input
							type="checkbox"
							id="confidential"
							checked={formData.isConfidential}
							onChange={(e) => onFormDataChange({ isConfidential: e.target.checked })}
							disabled={isSubmitting}
							className="rounded border-border-dark bg-surface-dark text-orange-500 focus:ring-orange-500"
						/>
						<label htmlFor="confidential" className="text-sm text-neutral-300 flex items-center gap-2">
							<Shield className="h-4 w-4" />
							Mark as confidential
						</label>
					</div>
				</CardContent>
			</Card>

			{/* Additional Content (Tags, Files, Links) */}
			{children}

			{/* Review Request (Optional) */}
			{reviewers.length > 0 && (
				<Card className="bg-surface-dark border-border-dark">
					<CardHeader>
						<CardTitle>Request Review (Optional)</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-neutral-300 mb-2">
								Reviewer
							</label>
							<select
								value={formData.reviewerId || ''}
								onChange={(e) => onFormDataChange({ reviewerId: e.target.value })}
								disabled={isSubmitting}
								className="w-full px-3 py-2 bg-surface-dark border border-border-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
							>
								<option value="">No review needed</option>
								{reviewers.map((reviewer) => (
									<option key={reviewer.id} value={reviewer.id}>
										{reviewer.name} - {reviewer.department}
									</option>
								))}
							</select>
						</div>

						{formData.reviewerId && (
							<div>
								<label className="block text-sm font-medium text-neutral-300 mb-2">
									Comment to Reviewer
								</label>
								<Textarea
									placeholder="Add any notes for the reviewer..."
									value={formData.comment}
									onChange={(e) => onFormDataChange({ comment: e.target.value })}
									disabled={isSubmitting}
									rows={3}
								/>
							</div>
						)}
					</CardContent>
				</Card>
			)}

			{/* Actions */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					{onSaveDraft && (
						<Button
							type="button"
							onClick={onSaveDraft}
							disabled={isSubmitting}
							variant="outline"
						>
							<Save className="h-4 w-4 mr-2" />
							Save Draft
						</Button>
					)}
					
					{autoSaveStatus === 'saved' && (
						<span className="text-sm text-green-400">
							✓ Auto-saved
						</span>
					)}
					{autoSaveStatus === 'saving' && (
						<span className="text-sm text-neutral-400">
							Saving...
						</span>
					)}
				</div>

				<Button
					type="submit"
					disabled={isSubmitting}
					variant="brand"
				>
					{isSubmitting ? (
						<>
							<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
							Submitting...
						</>
					) : (
						<>
							<Send className="h-4 w-4 mr-2" />
							Submit Work Entry
						</>
					)}
				</Button>
			</div>
		</form>
	)
}

