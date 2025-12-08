/**
 * ReviewerSelector Component
 * 검토자 선택 및 코멘트 입력
 */

import React from 'react'
import { UserCheck, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card'
import Textarea from '../../ui/Textarea'

export interface Reviewer {
	id: string
	name: string
	department: string
	role?: string
	avatar?: string
}

export interface ReviewerSelectorProps {
	reviewers: Reviewer[]
	selectedReviewerId: string | null
	comment: string
	onReviewerSelect: (reviewerId: string | null) => void
	onCommentChange: (comment: string) => void
	disabled?: boolean
	required?: boolean
}

export function ReviewerSelector({
	reviewers,
	selectedReviewerId,
	comment,
	onReviewerSelect,
	onCommentChange,
	disabled = false,
	required = false,
}: ReviewerSelectorProps) {
	const selectedReviewer = reviewers.find(r => r.id === selectedReviewerId)

	return (
		<Card className="bg-surface-dark border-border-dark">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<UserCheck className="h-5 w-5" />
					Request Review {required && <span className="text-red-400">*</span>}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Reviewer selection */}
				<div>
					<label className="block text-sm font-medium text-neutral-300 mb-2">
						Select Reviewer {required && <span className="text-red-400">*</span>}
					</label>
					<select
						value={selectedReviewerId || ''}
						onChange={(e) => onReviewerSelect(e.target.value || null)}
						disabled={disabled}
						required={required}
						className="w-full px-3 py-2 bg-surface-dark border border-border-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
					>
						<option value="">
							{required ? 'Select a reviewer...' : 'No review needed'}
						</option>
						{reviewers.map((reviewer) => (
							<option key={reviewer.id} value={reviewer.id}>
								{reviewer.name} - {reviewer.department}
								{reviewer.role && ` (${reviewer.role})`}
							</option>
						))}
					</select>
				</div>

				{/* Selected reviewer info */}
				{selectedReviewer && (
					<div className="p-3 bg-neutral-900/50 border border-border-dark rounded-lg">
						<div className="flex items-center gap-3">
							{selectedReviewer.avatar ? (
								<img
									src={selectedReviewer.avatar}
									alt={selectedReviewer.name}
									className="w-10 h-10 rounded-full"
								/>
							) : (
								<div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
									<UserCheck className="h-5 w-5 text-orange-400" />
								</div>
							)}
							<div>
								<p className="text-sm font-medium text-white">
									{selectedReviewer.name}
								</p>
								<p className="text-xs text-neutral-400">
									{selectedReviewer.department}
									{selectedReviewer.role && ` • ${selectedReviewer.role}`}
								</p>
							</div>
						</div>
					</div>
				)}

				{/* Comment to reviewer */}
				{selectedReviewerId && (
					<div>
						<label className="block text-sm font-medium text-neutral-300 mb-2 flex items-center gap-2">
							<MessageSquare className="h-4 w-4" />
							Comment to Reviewer
						</label>
						<Textarea
							placeholder="Add any notes or questions for the reviewer..."
							value={comment}
							onChange={(e) => onCommentChange(e.target.value)}
							disabled={disabled}
							rows={3}
							className="resize-none"
						/>
						<p className="text-xs text-neutral-500 mt-1">
							This message will be sent to the reviewer along with your work entry.
						</p>
					</div>
				)}

				{/* Helper text */}
				{!selectedReviewerId && !required && (
					<p className="text-xs text-neutral-500">
						💡 Select a reviewer if you need feedback or approval on this work entry.
					</p>
				)}
			</CardContent>
		</Card>
	)
}

