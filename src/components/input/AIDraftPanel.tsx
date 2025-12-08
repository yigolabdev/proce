/**
 * AIDraftPanel Component
 * AI 기반 드래프트 생성 및 관리
 */

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import Textarea from '../ui/Textarea'
import Input from '../ui/Input'
import { Sparkles, Wand2, Copy, RefreshCw, Check, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { AIDraft } from '../../types/workInput.types'

export interface AIDraftPanelProps {
	draft: AIDraft
	onDraftChange: (draft: Partial<AIDraft>) => void
	onGenerateDraft: () => Promise<void>
	onApplyDraft: () => void
	disabled?: boolean
	isGenerating?: boolean
}

export function AIDraftPanel({
	draft,
	onDraftChange,
	onGenerateDraft,
	onApplyDraft,
	disabled = false,
	isGenerating = false,
}: AIDraftPanelProps) {
	const [isCopied, setIsCopied] = React.useState(false)

	const handleCopyDraft = async () => {
		if (!draft.generatedContent) return

		try {
			await navigator.clipboard.writeText(draft.generatedContent)
			setIsCopied(true)
			toast.success('Draft copied to clipboard')
			setTimeout(() => setIsCopied(false), 2000)
		} catch {
			toast.error('Failed to copy')
		}
	}

	const handleGenerate = async () => {
		if (!draft.prompt?.trim()) {
			toast.error('Please enter a prompt')
			return
		}
		await onGenerateDraft()
	}

	return (
		<Card className="bg-surface-dark border-border-dark">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Sparkles className="h-5 w-5 text-purple-400" />
					AI Draft Assistant
				</CardTitle>
				<p className="text-sm text-neutral-400 mt-1">
					Describe what you worked on, and AI will generate a professional draft.
				</p>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Prompt input */}
				<div>
					<label className="block text-sm font-medium text-neutral-300 mb-2">
						What did you work on? <span className="text-red-400">*</span>
					</label>
					<Textarea
						placeholder="e.g., Fixed authentication bug in login flow, improved API response time by 30%..."
						value={draft.prompt || ''}
						onChange={(e) => onDraftChange({ prompt: e.target.value })}
						disabled={disabled || isGenerating}
						rows={4}
						className="resize-none"
					/>
				</div>

				{/* Context inputs */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-neutral-300 mb-2">
							Keywords (Optional)
						</label>
						<Input
							type="text"
							placeholder="e.g., bug fix, optimization, refactoring"
							value={draft.keywords || ''}
							onChange={(e) => onDraftChange({ keywords: e.target.value })}
							disabled={disabled || isGenerating}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-neutral-300 mb-2">
							Tone
						</label>
						<select
							value={draft.tone || 'professional'}
							onChange={(e) => onDraftChange({ tone: e.target.value })}
							disabled={disabled || isGenerating}
							className="w-full px-3 py-2 bg-surface-dark border border-border-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
						>
							<option value="professional">Professional</option>
							<option value="casual">Casual</option>
							<option value="detailed">Detailed</option>
							<option value="concise">Concise</option>
						</select>
					</div>
				</div>

				{/* Generate button */}
				<Button
					type="button"
					onClick={handleGenerate}
					disabled={disabled || isGenerating || !draft.prompt?.trim()}
					variant="outline"
					className="w-full border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
				>
					{isGenerating ? (
						<>
							<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							Generating...
						</>
					) : (
						<>
							<Wand2 className="h-4 w-4 mr-2" />
							Generate Draft
						</>
					)}
				</Button>

				{/* Generated content */}
				{draft.generatedContent && (
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<label className="block text-sm font-medium text-neutral-300">
								Generated Draft
							</label>
							<div className="flex gap-2">
								<Button
									type="button"
									onClick={handleCopyDraft}
									disabled={disabled}
									variant="ghost"
									size="sm"
								>
									{isCopied ? (
										<>
											<Check className="h-4 w-4 mr-1" />
											Copied
										</>
									) : (
										<>
											<Copy className="h-4 w-4 mr-1" />
											Copy
										</>
									)}
								</Button>
								<Button
									type="button"
									onClick={handleGenerate}
									disabled={disabled || isGenerating}
									variant="ghost"
									size="sm"
								>
									<RefreshCw className="h-4 w-4 mr-1" />
									Regenerate
								</Button>
							</div>
						</div>

						<div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
							<p className="text-white whitespace-pre-wrap">{draft.generatedContent}</p>
						</div>

						{/* Apply button */}
						<Button
							type="button"
							onClick={onApplyDraft}
							disabled={disabled}
							variant="brand"
							className="w-full bg-purple-600 hover:bg-purple-700"
						>
							<Check className="h-4 w-4 mr-2" />
							Apply to Description
						</Button>

						<p className="text-xs text-neutral-500 text-center">
							💡 You can edit the generated content after applying it.
						</p>
					</div>
				)}

				{/* Tips */}
				{!draft.generatedContent && (
					<div className="p-3 bg-neutral-900/50 border border-border-dark rounded-lg">
						<p className="text-xs font-medium text-neutral-300 mb-2">
							✨ Tips for better results:
						</p>
						<ul className="text-xs text-neutral-400 space-y-1 list-disc list-inside">
							<li>Be specific about what you accomplished</li>
							<li>Include metrics or numbers if available</li>
							<li>Mention technologies or tools used</li>
							<li>Describe the impact or outcome</li>
						</ul>
					</div>
				)}

				{/* AI disclaimer */}
				<p className="text-xs text-neutral-500 text-center">
					🤖 AI-generated content may require editing for accuracy.
				</p>
			</CardContent>
		</Card>
	)
}

