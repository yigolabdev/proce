/**
 * ProjectFormDialog Component
 * 
 * 프로젝트 생성 폼을 별도 컴포넌트로 분리
 * 책임 분리 및 재사용성 향상
 */

import { useState, useRef } from 'react'
import { useI18n } from '../../../i18n/I18nProvider'
import { Button } from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Textarea from '../../../components/ui/Textarea'
import {
	X,
	Calendar,
	Target,
	Plus,
	Upload,
	Link2,
	Image as ImageIcon,
	FileSpreadsheet,
	File,
	Building2,
	Trash2,
} from 'lucide-react'
import type { FileAttachment, LinkResource } from '../../../types/common.types'

interface ProjectFormDialogProps {
	show: boolean
	onClose: () => void
	onSubmit: (formData: ProjectFormData) => void
	availableDepartments: { id: string; name: string }[]
	initialData?: Partial<ProjectFormData>
	title?: string
	submitLabel?: string
}

export interface ProjectFormData {
	name: string
	description: string
	departments: string[]
	objectives: string[]
	startDate: string
	endDate: string
	files: FileAttachment[]
	links: LinkResource[]
}

export default function ProjectFormDialog({
	show,
	onClose,
	onSubmit,
	availableDepartments,
	initialData,
	title,
	submitLabel,
}: ProjectFormDialogProps) {
	const { t } = useI18n()
	// Form states
	const [projectName, setProjectName] = useState(initialData?.name || '')
	const [projectDescription, setProjectDescription] = useState(initialData?.description || '')
	const [projectDepartments, setProjectDepartments] = useState<string[]>(initialData?.departments || [])
	const [projectObjectives, setProjectObjectives] = useState<string[]>(initialData?.objectives || [])
	const [objectiveInput, setObjectiveInput] = useState('')
	const [startDate, setStartDate] = useState(initialData?.startDate || '')
	const [endDate, setEndDate] = useState(initialData?.endDate || '')
	const [selectedDept, setSelectedDept] = useState('')

	// Files and Links states
	const [files, setFiles] = useState<FileAttachment[]>(initialData?.files || [])
	const [links, setLinks] = useState<LinkResource[]>(initialData?.links || [])
	const [linkInput, setLinkInput] = useState('')
	const [isDragging, setIsDragging] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleSubmit = () => {
		if (!projectName || !startDate || !endDate) {
			return
		}

		onSubmit({
			name: projectName,
			description: projectDescription,
			departments: projectDepartments,
			objectives: projectObjectives,
			startDate,
			endDate,
			files,
			links,
		})

		// Reset form
		resetForm()
	}

	const resetForm = () => {
		setProjectName('')
		setProjectDescription('')
		setProjectDepartments([])
		setProjectObjectives([])
		setObjectiveInput('')
		setStartDate('')
		setEndDate('')
		setFiles([])
		setLinks([])
		setLinkInput('')
		setSelectedDept('')
	}

	const handleAddObjective = () => {
		if (objectiveInput.trim() && !projectObjectives.includes(objectiveInput.trim())) {
			setProjectObjectives([...projectObjectives, objectiveInput.trim()])
			setObjectiveInput('')
		}
	}

	const handleRemoveObjective = (objective: string) => {
		setProjectObjectives(projectObjectives.filter((o) => o !== objective))
	}

	const handleAddDepartment = () => {
		if (!selectedDept) return

		const dept = availableDepartments.find((d) => d.id === selectedDept)
		if (dept && !projectDepartments.includes(dept.name)) {
			setProjectDepartments([...projectDepartments, dept.name])
			setSelectedDept('')
		}
	}

	const handleRemoveDepartment = (deptName: string) => {
		setProjectDepartments(projectDepartments.filter((d) => d !== deptName))
	}

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = e.target.files
		if (selectedFiles) {
			const newFiles: FileAttachment[] = Array.from(selectedFiles).map((file): FileAttachment => ({
				id: `${Date.now()}-${file.name}`,
				name: file.name,
				size: file.size,
				type: file.type,
				uploadedAt: new Date().toISOString(),
			}))
			setFiles([...files, ...newFiles])
		}
	}

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault()
		setIsDragging(true)
	}

	const handleDragLeave = () => {
		setIsDragging(false)
	}

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault()
		setIsDragging(false)

		const droppedFiles = e.dataTransfer.files
		if (droppedFiles) {
			const newFiles: FileAttachment[] = Array.from(droppedFiles).map((file) => ({
				id: `${Date.now()}-${file.name}`,
				name: file.name,
				size: file.size,
				type: file.type,
				url: '',
				uploadedAt: new Date(),
			}))
			setFiles([...files, ...newFiles])
		}
	}

	const handleRemoveFile = (fileId: string) => {
		setFiles(files.filter((f) => f.id !== fileId))
	}

	const handleAddLink = () => {
		if (linkInput.trim()) {
			try {
				const newLink: LinkResource = {
					id: Date.now().toString(),
					url: linkInput.trim(),
					title: new URL(linkInput.trim()).hostname,
					addedAt: new Date().toISOString(),
				}
			setLinks([...links, newLink])
			setLinkInput('')
		} catch {
			// Invalid URL, but still add it
			const newLink: LinkResource = {
					id: Date.now().toString(),
					url: linkInput.trim(),
					title: linkInput.trim(),
					addedAt: new Date().toISOString(),
				}
				setLinks([...links, newLink])
				setLinkInput('')
			}
		}
	}

	const handleRemoveLink = (linkId: string) => {
		setLinks(links.filter((l) => l.id !== linkId))
	}

	const getFileIcon = (type: string) => {
		if (type.startsWith('image/')) return <ImageIcon className="h-5 w-5 text-blue-500" />
		if (type.includes('pdf')) return <File className="h-5 w-5 text-red-500" />
		if (type.includes('sheet') || type.includes('excel'))
			return <FileSpreadsheet className="h-5 w-5 text-green-500" />
		return <File className="h-5 w-5 text-neutral-500" />
	}

	const formatFileSize = (bytes: number): string => {
		if (bytes < 1024) return bytes + ' B'
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
		return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
	}

	if (!show) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
			<div className="bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-800 w-full max-w-3xl my-8">
				<div className="sticky top-0 bg-neutral-900 border-b border-neutral-800 p-6 rounded-t-3xl z-10">
					<div className="flex items-center justify-between">
						<h2 className="text-2xl font-bold">{title || t('projects.createProject')}</h2>
						<button
							onClick={() => {
								resetForm()
								onClose()
							}}
							className="text-neutral-500 hover:hover:text-neutral-300"
						>
							<X className="h-6 w-6" />
						</button>
					</div>
				</div>

				<div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
					{/* Project Name & Description */}
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium mb-2">
								{t('input.projectLabel')} <span className="text-red-500">*</span>
							</label>
							<Input
								value={projectName}
								onChange={(e) => setProjectName(e.target.value)}
								placeholder={t('input.projectLabel')}
							/>
						</div>

						<div>
							<label className="block text-sm font-medium mb-2">{t('input.descriptionLabel')}</label>
							<Textarea
								value={projectDescription}
								onChange={(e) => setProjectDescription(e.target.value)}
								placeholder={t('input.descriptionPlaceholder')}
								rows={3}
							/>
						</div>
					</div>

					{/* Departments */}
					<div>
						<label className="block text-sm font-medium mb-2">
							<Building2 className="inline h-4 w-4 mr-1" />
							{t('input.department')}
						</label>
						<div className="flex gap-2 mb-3">
							<select
								value={selectedDept}
								onChange={(e) => setSelectedDept(e.target.value)}
								className="flex-1 px-3 py-2 border border-neutral-700 rounded-2xl bg-neutral-900"
							>
								<option value="">{t('aiRecommendations.selectDepartment')}</option>
								{availableDepartments.map((dept) => (
									<option key={dept.id} value={dept.id}>
										{dept.name}
									</option>
								))}
							</select>
							<Button onClick={handleAddDepartment} size="sm">
								<Plus className="h-4 w-4 mr-1" />
								{t('common.add')}
							</Button>
						</div>
						{projectDepartments.length > 0 && (
							<div className="flex flex-wrap gap-2">
								{projectDepartments.map((dept) => (
									<div
										key={dept}
										className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
									>
										<Building2 className="h-3 w-3" />
										<span>{dept}</span>
										<button
											onClick={() => handleRemoveDepartment(dept)}
											className="hover:text-red-600"
										>
											<X className="h-3 w-3" />
										</button>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Objectives */}
					<div>
						<label className="block text-sm font-medium mb-2">
							<Target className="inline h-4 w-4 mr-1" />
							{t('aiRecommendations.expectedOutcome')}
						</label>
						<div className="flex gap-2 mb-3">
							<Input
								value={objectiveInput}
								onChange={(e) => setObjectiveInput(e.target.value)}
								onKeyPress={(e) => e.key === 'Enter' && handleAddObjective()}
								placeholder={t('aiRecommendations.expectedOutcome')}
								className="flex-1"
							/>
							<Button onClick={handleAddObjective} size="sm">
								<Plus className="h-4 w-4 mr-1" />
								{t('common.add')}
							</Button>
						</div>
						{projectObjectives.length > 0 && (
							<ul className="space-y-2">
								{projectObjectives.map((obj, index) => (
									<li
										key={index}
										className="flex items-center justify-between p-3 border border-neutral-800 rounded-xl"
									>
										<span className="text-sm">{obj}</span>
										<button
											onClick={() => handleRemoveObjective(obj)}
											className="text-red-500 hover:text-red-600"
										>
											<Trash2 className="h-4 w-4" />
										</button>
									</li>
								))}
							</ul>
						)}
					</div>

					{/* Dates */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium mb-2">
								<Calendar className="inline h-4 w-4 mr-1" />
								Start Date <span className="text-red-500">*</span>
							</label>
							<input
								type="date"
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
								className="w-full px-4 py-2 border border-neutral-700 rounded-2xl bg-neutral-900"
								min={new Date().toISOString().split('T')[0]}
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-2">
								<Calendar className="inline h-4 w-4 mr-1" />
								{t('aiRecommendations.deadline')} <span className="text-red-500">*</span>
							</label>
							<input
								type="date"
								value={endDate}
								onChange={(e) => setEndDate(e.target.value)}
								className="w-full px-4 py-2 border border-neutral-700 rounded-2xl bg-neutral-900"
								min={startDate || new Date().toISOString().split('T')[0]}
							/>
						</div>
					</div>

					{/* File Upload */}
					<div>
						<label className="block text-sm font-medium mb-2">
							<Upload className="inline h-4 w-4 mr-1" />
							{t('input.fileAttachments')}
							<span className="text-xs font-normal text-neutral-500 ml-2">{t('common.optional')}</span>
						</label>
						<div
							className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors ${
								isDragging
									? 'border-primary bg-primary/5'
									: 'border-neutral-700'
							}`}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
						>
							<input
								ref={fileInputRef}
								type="file"
								multiple
								onChange={handleFileSelect}
								className="hidden"
							/>
							<Upload className="h-12 w-12 mx-auto mb-3 text-neutral-400" />
							<p className="text-sm text-neutral-400 mb-2">
								{t('input.dragDropInfo')}
							</p>
							<Button
								variant="outline"
								size="sm"
								onClick={() => fileInputRef.current?.click()}
							>
								{t('input.browseFiles')}
							</Button>
						</div>

						{files.length > 0 && (
							<div className="mt-4 space-y-2">
								{files.map((file) => (
									<div
										key={file.id}
										className="flex items-center justify-between p-3 border border-neutral-800 rounded-xl"
									>
										<div className="flex items-center gap-3 flex-1">
											{getFileIcon(file.type)}
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium truncate">{file.name}</p>
												<p className="text-xs text-neutral-500">{formatFileSize(file.size)}</p>
											</div>
										</div>
										<button
											onClick={() => handleRemoveFile(file.id)}
											className="text-red-500 hover:text-red-600 ml-2"
										>
											<X className="h-4 w-4" />
										</button>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Links */}
					<div>
						<label className="block text-sm font-medium mb-2">
							<Link2 className="inline h-4 w-4 mr-1" />
							{t('input.linksConnections')}
							<span className="text-xs font-normal text-neutral-500 ml-2">{t('common.optional')}</span>
						</label>
						<div className="flex gap-2 mb-3">
							<Input
								type="url"
								value={linkInput}
								onChange={(e) => setLinkInput(e.target.value)}
								onKeyPress={(e) => e.key === 'Enter' && handleAddLink()}
								placeholder={t('input.addLinkPlaceholder')}
								className="flex-1"
							/>
							<Button onClick={handleAddLink} size="sm">
								<Plus className="h-4 w-4 mr-1" />
								{t('common.add')}
							</Button>
						</div>

						{links.length > 0 && (
							<div className="space-y-2">
								{links.map((link) => (
									<div
										key={link.id}
										className="flex items-center justify-between p-3 border border-neutral-800 rounded-xl"
									>
										<div className="flex items-center gap-3 flex-1 min-w-0">
											<Link2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
											<a
												href={link.url}
												target="_blank"
												rel="noopener noreferrer"
												className="text-sm text-blue-400 hover:underline truncate"
											>
												{link.url}
											</a>
										</div>
										<button
											onClick={() => handleRemoveLink(link.id)}
											className="text-red-500 hover:text-red-600 ml-2 flex-shrink-0"
										>
											<X className="h-4 w-4" />
										</button>
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				<div className="sticky bottom-0 bg-neutral-900 border-t border-neutral-800 p-6 rounded-b-3xl">
					<div className="flex gap-3">
						<Button
							onClick={() => {
								resetForm()
								onClose()
							}}
							variant="outline"
							className="flex-1"
						>
							{t('common.cancel')}
						</Button>
					<Button
						onClick={handleSubmit}
						disabled={!projectName || !startDate || !endDate}
						className="flex-1"
					>
						{submitLabel || t('projects.createProject')}
					</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

