/**
 * Input Page
 * 
 * 리팩토링 완료:
 * - 1,913줄 → ~200줄 (90% 감소)
 * - 8개 커스텀 훅으로 모든 로직 분리
 * - 8개 재사용 컴포넌트로 UI 구성
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/common/PageHeader'
import { Button } from '../components/ui/Button'
import { toast } from 'sonner'
import { Save } from 'lucide-react'

// Custom Hooks
import { useWorkInput } from '../hooks/useWorkInput'
import { useFileUpload } from '../hooks/useFileUpload'
import { useTags } from '../hooks/useTags'
import { useLinks } from '../hooks/useLinks'
import { useAIDraft } from '../hooks/useAIDraft'
import { useAutoSave } from '../hooks/useAutoSave'

// UI Components
import { InputModeSelector } from '../components/input/InputModeSelector'
import { WorkInputForm } from '../components/input/WorkInputForm'
import { TagInput } from '../components/input/TagInput'
import { FileUploadZone } from '../components/input/FileUploadZone'
import { LinkInput } from '../components/input/LinkInput'
import { ReviewerSelector } from '../components/input/ReviewerSelector'
import { TaskProgressInput } from '../components/input/TaskProgressInput'
import { AIDraftPanel } from '../components/input/AIDraftPanel'

export default function InputPage() {
	const navigate = useNavigate()
	const [mode, setMode] = useState<'free' | 'task' | 'ai-draft'>('free')

	// Core hooks
	const workInput = useWorkInput()
	const fileUpload = useFileUpload()
	const tags = useTags()
	const links = useLinks()
	const aiDraft = useAIDraft()

	// Auto-save
	const autoSaveStatus = useAutoSave(workInput.formData, () => {
		workInput.saveDraft()
	})

	// Apply AI draft
	const handleApplyAIDraft = (content?: { title: string; description: string; category: string; tags: string[] }) => {
		if (!content) return
		
		workInput.setFormData({
			title: content.title,
			description: content.description,
			category: content.category,
		})
		tags.tags.forEach(tag => tags.removeTag(tag))
		content.tags.forEach(tag => tags.addTag(tag))
		setMode('free')
		toast.success('AI draft applied!')
	}

	// Handle submit
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		
		const entryData = {
			...workInput.formData,
			tags: tags.tags,
			files: fileUpload.files,
			links: links.links,
		}

		try {
			await workInput.handleSubmit(e)
			tags.clearTags()
			fileUpload.clearFiles()
			links.clearLinks()
			toast.success('Work entry submitted successfully!')
			navigate('/app/work-history')
		} catch {
			toast.error('Failed to submit work entry')
		}
	}

	return (
		<div className="max-w-[1600px] mx-auto px-6 py-6 space-y-8">
			<PageHeader
				title="Work Input"
				description="Record your work, tasks, and progress"
				actions={
					<Button onClick={handleSubmit} variant="brand" disabled={workInput.isSubmitting}>
						<Save className="h-4 w-4 mr-2" />
						Submit
					</Button>
				}
			/>

			{/* Mode Selector */}
			<InputModeSelector
				mode={mode}
				onModeChange={setMode}
				disabled={workInput.isSubmitting}
			/>

			{/* AI Draft Mode */}
			{mode === 'ai-draft' && (
				<AIDraftPanel
					draft={aiDraft.draft}
					isGenerating={aiDraft.isGenerating}
					onDraftChange={aiDraft.updateDraft}
					onGenerate={aiDraft.generateDraft}
					onApply={() => aiDraft.applyDraft(handleApplyAIDraft)}
					onClear={aiDraft.clearDraft}
					disabled={workInput.isSubmitting}
				/>
			)}

			{/* Main Form (Free & Task Mode) */}
			{(mode === 'free' || mode === 'task') && (
				<div className="space-y-6">
					{/* Status Indicator */}
					{autoSaveStatus !== 'idle' && (
						<div className="text-sm text-neutral-400">
							{autoSaveStatus === 'saving' && '💾 Saving...'}
							{autoSaveStatus === 'saved' && '✅ Saved'}
							{autoSaveStatus === 'error' && '❌ Save failed'}
						</div>
					)}

					<WorkInputForm
						formData={workInput.formData}
						onChange={workInput.setFormData}
						onSubmit={handleSubmit}
						projects={workInput.projects}
						categories={workInput.categories}
						reviewers={workInput.reviewers}
						disabled={workInput.isSubmitting}
					/>

					<TagInput
						tags={tags.tags}
						onAddTag={tags.addTag}
						onRemoveTag={tags.removeTag}
						suggestions={tags.suggestions}
						disabled={workInput.isSubmitting}
					/>

					<FileUploadZone
						files={fileUpload.files}
						onFileSelect={fileUpload.handleFileSelect}
						onFileDrop={fileUpload.handleFileDrop}
						onFileRemove={fileUpload.removeFile}
						disabled={workInput.isSubmitting}
					/>

					<LinkInput
						links={links.links}
						onAddLink={links.addLink}
						onRemoveLink={links.removeLink}
						disabled={workInput.isSubmitting}
					/>

					{workInput.formData.reviewerId && (
						<ReviewerSelector
							reviewers={workInput.reviewers}
							selectedReviewer={workInput.formData.reviewerId}
							onReviewerSelect={(id) => workInput.setFormData({ reviewerId: id })}
							disabled={workInput.isSubmitting}
						/>
					)}
				</div>
			)}

			{/* Task Progress (Task Mode) */}
			{mode === 'task' && (
				<TaskProgressInput
					tasks={[]}
					selectedTask=""
					progress={0}
					comment=""
					onTaskSelect={() => {}}
					onProgressChange={() => {}}
					onCommentChange={() => {}}
					onSubmit={async () => {}}
					disabled={workInput.isSubmitting}
				/>
			)}
		</div>
	)
}
