/**
 * useFileUpload Hook
 * 파일 업로드 관리
 */

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import type { FileAttachment, UseFileUploadReturn } from '../types/workInput.types'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_FILES = 10
const ACCEPTED_TYPES = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/gif',
	'image/webp',
	'application/pdf',
	'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/vnd.ms-excel',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	'text/plain',
	'text/csv',
]

export function useFileUpload(): UseFileUploadReturn {
	const [files, setFiles] = useState<FileAttachment[]>([])
	const [isUploading, setIsUploading] = useState(false)

	/**
	 * Validate file
	 */
	const validateFile = useCallback((file: File): boolean => {
		// Check file size
		if (file.size > MAX_FILE_SIZE) {
			toast.error(`File "${file.name}" is too large. Maximum size is 10MB.`)
			return false
		}

		// Check file type
		if (!ACCEPTED_TYPES.includes(file.type)) {
			toast.error(`File type "${file.type}" is not supported.`)
			return false
		}

		// Check max files
		if (files.length >= MAX_FILES) {
			toast.error(`Maximum ${MAX_FILES} files allowed.`)
			return false
		}

		return true
	}, [files.length])

	/**
	 * Convert file to base64
	 */
	const fileToBase64 = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.onload = () => resolve(reader.result as string)
			reader.onerror = reject
			reader.readAsDataURL(file)
		})
	}

	/**
	 * Handle file select
	 */
	const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = Array.from(e.target.files || [])
		
		if (selectedFiles.length === 0) return

		setIsUploading(true)

		try {
			const newFiles: FileAttachment[] = []

			for (const file of selectedFiles) {
				if (!validateFile(file)) {
					continue
				}

				// Convert to base64
				const data = await fileToBase64(file)

				newFiles.push({
					id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
					name: file.name,
					type: file.type,
					size: file.size,
					data,
					uploadedAt: new Date(),
				})
			}

			if (newFiles.length > 0) {
				setFiles(prev => [...prev, ...newFiles])
				toast.success(`${newFiles.length} file(s) uploaded successfully`)
			}
		} catch (error) {
			console.error('Failed to upload files:', error)
			toast.error('Failed to upload files')
		} finally {
			setIsUploading(false)
			// Reset input
			e.target.value = ''
		}
	}, [validateFile])

	/**
	 * Handle file drop
	 */
	const handleFileDrop = useCallback(async (e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()

		const droppedFiles = Array.from(e.dataTransfer.files)

		if (droppedFiles.length === 0) return

		setIsUploading(true)

		try {
			const newFiles: FileAttachment[] = []

			for (const file of droppedFiles) {
				if (!validateFile(file)) {
					continue
				}

				// Convert to base64
				const data = await fileToBase64(file)

				newFiles.push({
					id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
					name: file.name,
					type: file.type,
					size: file.size,
					data,
					uploadedAt: new Date(),
				})
			}

			if (newFiles.length > 0) {
				setFiles(prev => [...prev, ...newFiles])
				toast.success(`${newFiles.length} file(s) uploaded successfully`)
			}
		} catch (error) {
			console.error('Failed to upload files:', error)
			toast.error('Failed to upload files')
		} finally {
			setIsUploading(false)
		}
	}, [validateFile])

	/**
	 * Remove file
	 */
	const removeFile = useCallback((id: string) => {
		setFiles(prev => prev.filter(f => f.id !== id))
		toast.success('File removed')
	}, [])

	/**
	 * Clear all files
	 */
	const clearFiles = useCallback(() => {
		setFiles([])
		toast.success('All files removed')
	}, [])

	/**
	 * Format file size
	 */
	const formatFileSize = useCallback((bytes: number): string => {
		if (bytes === 0) return '0 Bytes'

		const k = 1024
		const sizes = ['Bytes', 'KB', 'MB', 'GB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))

		return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
	}, [])

	return {
		files,
		handleFileSelect,
		handleFileDrop,
		removeFile,
		clearFiles,
		isUploading,
		formatFileSize,
	}
}

