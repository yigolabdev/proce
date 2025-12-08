/**
 * WorkEntryCard Component
 * 업무 이력 카드 표시
 */

import { Card, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import {
	ChevronDown,
	ChevronUp,
	Calendar,
	Clock,
	User,
	FolderKanban,
	FileText,
	Link2,
	CheckCircle2,
	XCircle,
	Clock as Pending,
} from 'lucide-react'
import type { WorkEntry } from '../../types/common.types'

export interface WorkEntryCardProps {
	entry: WorkEntry
	isExpanded: boolean
	onToggleExpand: () => void
	categoryColor?: string
}

export function WorkEntryCard({
	entry,
	isExpanded,
	onToggleExpand,
	categoryColor = 'bg-neutral-800 text-neutral-400',
}: WorkEntryCardProps) {
	const getStatusIcon = (status?: string) => {
		switch (status) {
			case 'approved':
				return <CheckCircle2 className="h-4 w-4 text-green-400" />
			case 'rejected':
				return <XCircle className="h-4 w-4 text-red-400" />
			case 'pending':
				return <Pending className="h-4 w-4 text-yellow-400" />
			default:
				return null
		}
	}

	const getStatusColor = (status?: string) => {
		switch (status) {
			case 'approved':
				return 'bg-green-500/20 text-green-400 border-green-500/50'
			case 'rejected':
				return 'bg-red-500/20 text-red-400 border-red-500/50'
			case 'pending':
				return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
			default:
				return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/50'
		}
	}

	return (
		<Card className="bg-surface-dark border-border-dark hover:border-neutral-600 transition-colors">
			<CardContent className="p-4">
				{/* Header */}
				<div className="flex items-start justify-between gap-4 mb-3">
					<div className="flex-1 min-w-0">
						<h3 className="text-lg font-medium text-white mb-2">{entry.title}</h3>
						<div className="flex flex-wrap items-center gap-3 text-sm text-neutral-400">
							<div className="flex items-center gap-1">
								<Calendar className="h-4 w-4" />
								{new Date(entry.date).toLocaleDateString()}
							</div>
							{entry.duration && (
								<div className="flex items-center gap-1">
									<Clock className="h-4 w-4" />
									{entry.duration}
								</div>
							)}
							{entry.submittedBy && (
								<div className="flex items-center gap-1">
									<User className="h-4 w-4" />
									{entry.submittedBy}
									{entry.department && (
										<span className="text-neutral-600">• {entry.department}</span>
									)}
								</div>
							)}
							{entry.projectName && (
								<div className="flex items-center gap-1">
									<FolderKanban className="h-4 w-4" />
									{entry.projectName}
								</div>
							)}
						</div>
					</div>

					<Button onClick={onToggleExpand} variant="ghost" size="sm">
						{isExpanded ? (
							<ChevronUp className="h-4 w-4" />
						) : (
							<ChevronDown className="h-4 w-4" />
						)}
					</Button>
				</div>

				{/* Preview */}
				{!isExpanded && (
					<p className="text-neutral-300 line-clamp-2 mb-3">{entry.description}</p>
				)}

				{/* Badges */}
				<div className="flex items-center gap-2 flex-wrap">
					{/* Category */}
					<span className={`text-xs px-2 py-1 rounded ${categoryColor}`}>
						{entry.category}
					</span>

					{/* Status */}
					{entry.status && (
						<span
							className={`text-xs px-2 py-1 rounded border flex items-center gap-1 ${getStatusColor(
								entry.status
							)}`}
						>
							{getStatusIcon(entry.status)}
							{entry.status}
						</span>
					)}

					{/* Files */}
					{entry.files && entry.files.length > 0 && (
						<span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400 flex items-center gap-1">
							<FileText className="h-3 w-3" />
							{entry.files.length} {entry.files.length === 1 ? 'file' : 'files'}
						</span>
					)}

					{/* Links */}
					{entry.links && entry.links.length > 0 && (
						<span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-400 flex items-center gap-1">
							<Link2 className="h-3 w-3" />
							{entry.links.length} {entry.links.length === 1 ? 'link' : 'links'}
						</span>
					)}
				</div>

				{/* Expanded Content */}
				{isExpanded && (
					<div className="mt-4 pt-4 border-t border-border-dark space-y-4">
						{/* Description */}
						<div>
							<h4 className="text-sm font-medium text-neutral-400 mb-2">Description</h4>
							<p className="text-neutral-300 whitespace-pre-wrap">{entry.description}</p>
						</div>

						{/* Tags */}
						{entry.tags && entry.tags.length > 0 && (
							<div>
								<h4 className="text-sm font-medium text-neutral-400 mb-2">Tags</h4>
								<div className="flex flex-wrap gap-2">
									{entry.tags.map((tag, index) => (
										<span
											key={index}
											className="text-xs px-2 py-1 rounded bg-neutral-800 text-neutral-300"
										>
											#{tag}
										</span>
									))}
								</div>
							</div>
						)}

						{/* Files */}
						{entry.files && entry.files.length > 0 && (
							<div>
								<h4 className="text-sm font-medium text-neutral-400 mb-2">Attachments</h4>
								<div className="space-y-2">
									{entry.files.map((file) => (
										<div
											key={file.id}
											className="flex items-center gap-2 p-2 bg-neutral-900 rounded text-sm"
										>
											<FileText className="h-4 w-4 text-blue-400" />
											<span className="text-neutral-300 flex-1">{file.name}</span>
											<span className="text-xs text-neutral-500">
												{(file.size / 1024).toFixed(1)} KB
											</span>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Links */}
						{entry.links && entry.links.length > 0 && (
							<div>
								<h4 className="text-sm font-medium text-neutral-400 mb-2">Links</h4>
								<div className="space-y-2">
									{entry.links.map((link) => (
										<a
											key={link.id}
											href={link.url}
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center gap-2 p-2 bg-neutral-900 rounded text-sm text-blue-400 hover:text-blue-300 transition-colors"
										>
											<Link2 className="h-4 w-4" />
											<span className="flex-1">{link.title || link.url}</span>
										</a>
									))}
								</div>
							</div>
						)}

					{/* Review Comment */}
					{entry.reviewComments && entry.reviewComments.length > 0 && (
						<div>
							<h4 className="text-sm font-medium text-neutral-400 mb-2">Review Comment</h4>
							<p className="text-neutral-300 p-3 bg-neutral-900 rounded">
								{entry.reviewComments[0]}
							</p>
						</div>
					)}
					</div>
				)}
			</CardContent>
		</Card>
	)
}

