/**
 * TagInput Component
 * 태그 입력 및 관리
 */

import React from 'react'
import { X, Tag } from 'lucide-react'
import Input from '../../ui/Input'
import { Button } from '../../ui/Button'

export interface TagInputProps {
	tags: string[]
	tagInput: string
	onTagInputChange: (value: string) => void
	onAddTag: (tag: string) => void
	onRemoveTag: (tag: string) => void
	onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void
	suggestions?: string[]
	disabled?: boolean
	maxTags?: number
}

export function TagInput({
	tags,
	tagInput,
	onTagInputChange,
	onAddTag,
	onRemoveTag,
	onKeyPress,
	suggestions = [],
	disabled = false,
	maxTags = 10,
}: TagInputProps) {
	const handleAddClick = () => {
		if (tagInput.trim()) {
			onAddTag(tagInput)
		}
	}

	return (
		<div className="space-y-3">
			{/* Input */}
			<div className="flex gap-2">
				<div className="flex-1 relative">
					<Input
						type="text"
						placeholder="Add tags (press Enter or comma)"
						value={tagInput}
						onChange={(e) => onTagInputChange(e.target.value)}
						onKeyDown={onKeyPress}
						disabled={disabled || tags.length >= maxTags}
						className="pr-10"
					/>
					<Tag className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />

					{/* Suggestions dropdown */}
					{suggestions.length > 0 && tagInput && (
						<div className="absolute top-full left-0 right-0 mt-1 bg-surface-dark border border-border-dark rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
							{suggestions.map((suggestion) => (
								<button
									key={suggestion}
									onClick={() => onAddTag(suggestion)}
									className="w-full px-3 py-2 text-left text-sm text-neutral-300 hover:bg-white/5 transition-colors"
								>
									<Tag className="inline-block h-3 w-3 mr-2" />
									{suggestion}
								</button>
							))}
						</div>
					)}
				</div>
				<Button
					onClick={handleAddClick}
					disabled={disabled || !tagInput.trim() || tags.length >= maxTags}
					variant="outline"
					size="sm"
				>
					Add
				</Button>
			</div>

			{/* Tags display */}
			{tags.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{tags.map((tag) => (
						<span
							key={tag}
							className="inline-flex items-center gap-1 px-3 py-1 bg-blue-900/30 text-blue-400 rounded-full text-sm border border-blue-800/50"
						>
							<Tag className="h-3 w-3" />
							{tag}
							<button
								onClick={() => onRemoveTag(tag)}
								disabled={disabled}
								className="hover:text-blue-300 transition-colors disabled:opacity-50"
								type="button"
							>
								<X className="h-3 w-3" />
							</button>
						</span>
					))}
				</div>
			)}

			{/* Tag count */}
			<div className="text-xs text-neutral-500">
				{tags.length} / {maxTags} tags
			</div>
		</div>
	)
}

