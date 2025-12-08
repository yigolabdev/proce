/**
 * FileUploadZone Component
 * 파일 업로드 및 관리
 */

import React, { useRef, useState } from 'react'
import { Upload, X, FileText, Image as ImageIcon, File } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card, CardContent } from '../ui/Card'
import type { FileAttachment } from '../../types/common.types'

export interface FileUploadZoneProps {
	files: FileAttachment[]
	onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
	onFileDrop: (e: React.DragEvent) => void
	onFileRemove: (id: string) => void
	disabled?: boolean
	isUploading?: boolean
	formatFileSize?: (bytes: number) => string
}

export function FileUploadZone({
	files,
	onFileSelect,
	onFileDrop,
	onFileRemove,
	disabled = false,
	isUploading = false,
	formatFileSize,
}: FileUploadZoneProps) {
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [isDragging, setIsDragging] = useState(false)

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		if (!disabled) {
			setIsDragging(true)
		}
	}

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(false)
	}

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(false)
		if (!disabled) {
			onFileDrop(e)
		}
	}

	const getFileIcon = (type: string) => {
		if (type.startsWith('image/')) {
			return <ImageIcon className="h-5 w-5" />
		}
		return <File className="h-5 w-5" />
	}

	const defaultFormatFileSize = (bytes: number): string => {
		if (bytes === 0) return '0 Bytes'
		const k = 1024
		const sizes = ['Bytes', 'KB', 'MB', 'GB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
	}

	const fileSizeFormatter = formatFileSize || defaultFormatFileSize

	return (
		<div className="space-y-4">
			{/* Upload zone */}
			<div
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				className={`
					border-2 border-dashed rounded-lg p-8 text-center transition-colors
					${isDragging 
						? 'border-orange-500 bg-orange-500/10' 
						: 'border-border-dark hover:border-neutral-600'
					}
					${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
				`}
				onClick={() => !disabled && fileInputRef.current?.click()}
			>
				<Upload className="h-12 w-12 text-neutral-500 mx-auto mb-4" />
				<p className="text-neutral-300 mb-2">
					{isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
				</p>
				<p className="text-sm text-neutral-500">
					Max 10MB per file, up to 10 files
				</p>
				<p className="text-xs text-neutral-600 mt-2">
					Supports: Images, PDF, Documents, Spreadsheets
				</p>

				<input
					ref={fileInputRef}
					type="file"
					multiple
					onChange={onFileSelect}
					disabled={disabled}
					className="hidden"
					accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
				/>
			</div>

			{/* Uploaded files */}
			{files.length > 0 && (
				<div className="space-y-2">
					<p className="text-sm font-medium text-neutral-400">
						Uploaded Files ({files.length})
					</p>
					
					<div className="space-y-2">
						{files.map((file) => (
							<Card key={file.id} className="bg-surface-dark border-border-dark">
								<CardContent className="p-3">
									<div className="flex items-center gap-3">
										<div className="p-2 bg-neutral-800 rounded-lg text-blue-400">
											{getFileIcon(file.type)}
										</div>
										
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium text-white truncate">
												{file.name}
											</p>
											<p className="text-xs text-neutral-500">
												{fileSizeFormatter(file.size)} • {file.type}
											</p>
										</div>

										<Button
											onClick={() => onFileRemove(file.id)}
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

			{/* Uploading state */}
			{isUploading && (
				<div className="text-center py-4">
					<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
					<p className="text-sm text-neutral-400 mt-2">Uploading files...</p>
				</div>
			)}
		</div>
	)
}

