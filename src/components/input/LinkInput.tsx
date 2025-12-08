/**
 * LinkInput Component
 * 링크 리소스 입력 및 관리
 */

import React, { useState } from 'react'
import { Link2, X, ExternalLink } from 'lucide-react'
import Input from '../../ui/Input'
import { Button } from '../../ui/Button'
import { Card, CardContent } from '../../ui/Card'
import { toast } from 'sonner'
import type { LinkResource } from '../../../types/common.types'

export interface LinkInputProps {
	links: LinkResource[]
	onAddLink: (link: LinkResource) => void
	onRemoveLink: (id: string) => void
	disabled?: boolean
	maxLinks?: number
}

export function LinkInput({
	links,
	onAddLink,
	onRemoveLink,
	disabled = false,
	maxLinks = 10,
}: LinkInputProps) {
	const [linkInput, setLinkInput] = useState('')
	const [titleInput, setTitleInput] = useState('')

	const isValidUrl = (url: string): boolean => {
		try {
			new URL(url)
			return true
		} catch {
			return false
		}
	}

	const handleAddLink = () => {
		const trimmedUrl = linkInput.trim()
		
		if (!trimmedUrl) {
			return
		}

		if (!isValidUrl(trimmedUrl)) {
			toast.error('Please enter a valid URL')
			return
		}

		if (links.length >= maxLinks) {
			toast.error(`Maximum ${maxLinks} links allowed`)
			return
		}

		const newLink: LinkResource = {
			id: `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			url: trimmedUrl,
			title: titleInput.trim() || trimmedUrl,
			addedAt: new Date(),
		}

		onAddLink(newLink)
		setLinkInput('')
		setTitleInput('')
		toast.success('Link added')
	}

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			handleAddLink()
		}
	}

	return (
		<div className="space-y-4">
			{/* Input section */}
			<div className="space-y-3">
				<div>
					<label className="block text-sm font-medium text-neutral-300 mb-2">
						Link URL
					</label>
					<div className="flex gap-2">
						<div className="flex-1 relative">
							<Input
								type="url"
								placeholder="https://example.com"
								value={linkInput}
								onChange={(e) => setLinkInput(e.target.value)}
								onKeyPress={handleKeyPress}
								disabled={disabled || links.length >= maxLinks}
								className="pr-10"
							/>
							<Link2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
						</div>
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium text-neutral-300 mb-2">
						Link Title (Optional)
					</label>
					<Input
						type="text"
						placeholder="Descriptive title for the link"
						value={titleInput}
						onChange={(e) => setTitleInput(e.target.value)}
						onKeyPress={handleKeyPress}
						disabled={disabled || links.length >= maxLinks}
					/>
				</div>

				<Button
					type="button"
					onClick={handleAddLink}
					disabled={disabled || !linkInput.trim() || links.length >= maxLinks}
					variant="outline"
					size="sm"
				>
					<Link2 className="h-4 w-4 mr-2" />
					Add Link
				</Button>
			</div>

			{/* Links display */}
			{links.length > 0 && (
				<div className="space-y-2">
					<p className="text-sm font-medium text-neutral-400">
						Added Links ({links.length}/{maxLinks})
					</p>
					
					<div className="space-y-2">
						{links.map((link) => (
							<Card key={link.id} className="bg-surface-dark border-border-dark">
								<CardContent className="p-3">
									<div className="flex items-start gap-3">
										<div className="p-2 bg-neutral-800 rounded-lg text-blue-400 shrink-0">
											<Link2 className="h-4 w-4" />
										</div>
										
										<div className="flex-1 min-w-0">
											<a
												href={link.url}
												target="_blank"
												rel="noopener noreferrer"
												className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1 group"
											>
												<span className="truncate">{link.title}</span>
												<ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
											</a>
											<p className="text-xs text-neutral-500 truncate mt-0.5">
												{link.url}
											</p>
										</div>

										<Button
											type="button"
											onClick={() => onRemoveLink(link.id)}
											disabled={disabled}
											variant="ghost"
											size="sm"
											className="shrink-0"
										>
											<X className="h-4 w-4" />
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			)}
		</div>
	)
}

