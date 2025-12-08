/**
 * AIDraftPanel Component
 * AI 드래프트 생성 패널
 */

import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import Textarea from '../ui/Textarea'
import Input from '../ui/Input'
import { Sparkles, Check, X } from 'lucide-react'
import type { AIDraft } from '../../types/workInput.types'

export interface AIDraftPanelProps {
	draft: AIDraft
	isGenerating: boolean
	onDraftChange: (updates: Partial<AIDraft>) => void
	onGenerate: () => Promise<void>
	onApply: () => void
	onClear: () => void
	disabled?: boolean
}

export function AIDraftPanel({
	draft,
	isGenerating,
	onDraftChange,
	onGenerate,
	onApply,
	onClear,
	disabled,
}: AIDraftPanelProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Sparkles className="h-5 w-5 text-brand-500" />
					AI Draft Generator
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Prompt Input */}
				<div>
					<label className="block text-sm font-medium text-neutral-300 mb-2">
						What would you like to write about?
					</label>
					<Textarea
						value={draft.prompt || ''}
						onChange={(e) => onDraftChange({ prompt: e.target.value })}
						placeholder="Describe your work or task..."
						rows={4}
						disabled={disabled || isGenerating}
					/>
				</div>

				{/* Tone Selection */}
				<div>
					<label className="block text-sm font-medium text-neutral-300 mb-2">
						Tone
					</label>
					<div className="grid grid-cols-4 gap-2">
						{(['professional', 'casual', 'detailed', 'concise'] as const).map((tone) => (
							<Button
								key={tone}
								variant={draft.tone === tone ? 'brand' : 'outline'}
								onClick={() => onDraftChange({ tone })}
								disabled={disabled || isGenerating}
								className="capitalize"
							>
								{tone}
							</Button>
						))}
					</div>
				</div>

				{/* Keywords */}
				<div>
					<label className="block text-sm font-medium text-neutral-300 mb-2">
						Keywords (comma-separated)
					</label>
					<Input
						value={Array.isArray(draft.keywords) ? draft.keywords.join(', ') : ''}
						onChange={(e) => onDraftChange({ keywords: e.target.value.split(',').map(k => k.trim()) })}
						placeholder="e.g., frontend, React, optimization"
						disabled={disabled || isGenerating}
					/>
				</div>

				{/* Generate Button */}
				<Button
					variant="brand"
					onClick={onGenerate}
					disabled={disabled || isGenerating || !draft.prompt?.trim()}
					className="w-full"
				>
					<Sparkles className="h-4 w-4 mr-2" />
					{isGenerating ? 'Generating...' : 'Generate Draft'}
				</Button>

				{/* Generated Content */}
				{draft.generatedContent && (
					<div className="mt-6 space-y-4 p-4 bg-neutral-900 rounded-lg border border-neutral-700">
						<h4 className="text-sm font-medium text-neutral-300">Generated Content</h4>
						
						<div>
							<label className="text-xs text-neutral-400">Title</label>
							<p className="text-sm text-white mt-1">{draft.generatedContent.title}</p>
						</div>

						<div>
							<label className="text-xs text-neutral-400">Description</label>
							<p className="text-sm text-white mt-1 whitespace-pre-wrap">
								{draft.generatedContent.description}
							</p>
						</div>

						<div>
							<label className="text-xs text-neutral-400">Category</label>
							<p className="text-sm text-white mt-1">{draft.generatedContent.category}</p>
						</div>

						<div>
							<label className="text-xs text-neutral-400">Tags</label>
							<div className="flex flex-wrap gap-2 mt-1">
								{draft.generatedContent.tags.map((tag, index) => (
									<span
										key={index}
										className="px-2 py-1 bg-brand-500/20 text-brand-400 text-xs rounded"
									>
										{tag}
									</span>
								))}
							</div>
						</div>

						<div className="flex gap-2 pt-4">
							<Button
								variant="brand"
								onClick={onApply}
								disabled={disabled}
								className="flex-1"
							>
								<Check className="h-4 w-4 mr-2" />
								Apply Draft
							</Button>
							<Button
								variant="outline"
								onClick={onClear}
								disabled={disabled}
							>
								<X className="h-4 w-4 mr-2" />
								Clear
							</Button>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	)
}
