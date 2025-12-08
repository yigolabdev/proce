/**
 * useLinks Hook
 * 링크 리소스 상태 및 로직 관리
 */

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import type { LinkResource } from '../types/common.types'

export interface UseLinksReturn {
	links: LinkResource[]
	addLink: (link: LinkResource) => void
	removeLink: (id: string) => void
	clearLinks: () => void
	hasLinks: boolean
}

export function useLinks(initialLinks: LinkResource[] = []): UseLinksReturn {
	const [links, setLinks] = useState<LinkResource[]>(initialLinks)

	const addLink = useCallback((link: LinkResource) => {
		setLinks((prev) => {
			// Check for duplicates
			if (prev.some((l) => l.url === link.url)) {
				toast.error('This link has already been added')
				return prev
			}
			
			return [...prev, link]
		})
	}, [])

	const removeLink = useCallback((id: string) => {
		setLinks((prev) => prev.filter((link) => link.id !== id))
		toast.success('Link removed')
	}, [])

	const clearLinks = useCallback(() => {
		setLinks([])
	}, [])

	return {
		links,
		addLink,
		removeLink,
		clearLinks,
		hasLinks: links.length > 0,
	}
}

