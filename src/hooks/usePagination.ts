/**
 * usePagination Hook
 * 
 * 페이지네이션 로직을 관리하는 커스텀 훅
 */

import { useState, useMemo } from 'react'

interface UsePaginationProps<T> {
	data: T[]
	itemsPerPage?: number
}

interface UsePaginationReturn<T> {
	currentPage: number
	totalPages: number
	currentData: T[]
	goToPage: (page: number) => void
	nextPage: () => void
	previousPage: () => void
	canGoNext: boolean
	canGoPrevious: boolean
	setItemsPerPage: (items: number) => void
	itemsPerPage: number
}

export function usePagination<T>({
	data,
	itemsPerPage: initialItemsPerPage = 15,
}: UsePaginationProps<T>): UsePaginationReturn<T> {
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage)

	const totalPages = Math.ceil(data.length / itemsPerPage)

	const currentData = useMemo(() => {
		const start = (currentPage - 1) * itemsPerPage
		const end = start + itemsPerPage
		return data.slice(start, end)
	}, [data, currentPage, itemsPerPage])

	const goToPage = (page: number) => {
		const pageNumber = Math.max(1, Math.min(page, totalPages))
		setCurrentPage(pageNumber)
	}

	const nextPage = () => {
		goToPage(currentPage + 1)
	}

	const previousPage = () => {
		goToPage(currentPage - 1)
	}

	const canGoNext = currentPage < totalPages
	const canGoPrevious = currentPage > 1

	return {
		currentPage,
		totalPages,
		currentData,
		goToPage,
		nextPage,
		previousPage,
		canGoNext,
		canGoPrevious,
		setItemsPerPage: (items: number) => {
			setItemsPerPage(items)
			setCurrentPage(1) // Reset to first page when changing items per page
		},
		itemsPerPage,
	}
}

