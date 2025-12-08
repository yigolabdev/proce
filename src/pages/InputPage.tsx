/**
 * InputPage - Work Entry Input
 * 
 * 리팩토링 완료:
 * - 1,913줄 → 150줄 (92% 감소)
 * - 모든 로직은 커스텀 훅으로 분리
 * - UI는 재사용 가능한 컴포넌트로 구성
 */

import React from 'react'
import { useAuth } from '../context/AuthContext'
import { PageHeader } from '../components/common/PageHeader'
import { Card } from '../components/ui/Card'
import { toast } from 'sonner'

// Custom Hooks
import {
	useWorkInput,
	useFileUpload,
	useTags,
	useLinks,
	useAIDraft,
	useAutoSave,
} from '../hooks'

// Components
import { InputModeSelector } from '../components/input/InputModeSelector'
import { WorkInputForm } from '../components/input/WorkInputForm'
import { TagInput } from '../components/input/TagInput'
import { FileUploadZone } from '../components/input/FileUploadZone'
import { LinkInput } from '../components/input/LinkInput'
import { ReviewerSelector } from '../components/input/ReviewerSelector'
import { TaskProgressInput } from '../components/input/TaskProgressInput'
import { AIDraftPanel } from '../components/input/AIDraftPanel'

import type { InputMode, TaskProgress } from '../types/workInput.types'

export default function InputPage() {
	const { user } = useAuth()
	const [mode, setMode] = React.useState<InputMode>('free')
	const [taskProgress, setTaskProgress] = React.useState<TaskProgress>({
		totalItems: 0,
		completedItems: 0,
		milestone: '',
		nextSteps: '',
		blockers: '',
	})

	// Initialize hooks
	const workInput = useWorkInput({
		onSuccess: () => {
			toast.success('Work entry submitted successfully!')
			handleReset()
		},
		onError: (error) => toast.error(error.message || 'Failed to submit work entry'),
	})
	const fileUpload = useFileUpload({
		maxFiles: 10,
		maxFileSize: 10 * 1024 * 1024,
		onError: (error) => toast.error(error),
	})
	const tags = useTags({
		suggestions: ['Bug Fix', 'Feature', 'Refactoring', 'Documentation', 'Testing'],
		maxTags: 10,
	})
	const links = useLinks()
	const draft = useAIDraft()
	const autoSave = useAutoSave({
		data: { mode, formData: workInput.formData, taskProgress, tags: tags.tags, files: fileUpload.files, links: links.links },
		onSave: async (data) => localStorage.setItem(`work-draft-${Date.now()}`, JSON.stringify(data)),
		delay: 3000,
		enabled: true,
	})

	// Handlers
	const handleApplyDraft = () => draft.applyDraft((content) => workInput.setFormData({ description: content }))
	
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (mode === 'task' && taskProgress.totalItems === 0) {
			return toast.error('Please enter task progress information')
		}
		await workInput.handleSubmit(e, {
			mode,
			taskProgress: mode === 'task' ? taskProgress : undefined,
			tags: tags.tags,
			files: fileUpload.files,
			links: links.links,
		})
	}

	const handleReset = () => {
		workInput.reset()
		setMode('free')
		setTaskProgress({ totalItems: 0, completedItems: 0, milestone: '', nextSteps: '', blockers: '' })
		tags.clearTags()
		fileUpload.clearFiles()
		links.clearLinks()
		draft.clearDraft()
	}

	return (
		<div className="min-h-screen bg-background-dark">
			<div className="max-w-[1600px] mx-auto px-6 py-6 space-y-8">
				{/* Page Header */}
				<PageHeader
					title="Work Entry"
					description={`Record your work progress and achievements, ${user?.name || 'User'}`}
				/>

				{/* Input Mode Selector */}
				<InputModeSelector
					mode={mode}
					onModeChange={setMode}
					disabled={workInput.isSubmitting}
				/>

				{/* Main Form */}
				<form onSubmit={handleSubmit}>
					{/* Free Input Mode */}
					{mode === 'free' && (
						<div className="space-y-6">
							<WorkInputForm
								formData={workInput.formData}
								onFormDataChange={workInput.setFormData}
								onSubmit={handleSubmit}
								projects={workInput.projects}
								categories={workInput.categories}
								reviewers={workInput.reviewers}
								isSubmitting={workInput.isSubmitting}
								autoSaveStatus={autoSave.status}
								onSaveDraft={() => autoSave.save()}
							>
								{/* Tags */}
								<Card className="bg-surface-dark border-border-dark p-6">
									<TagInput {...tags} disabled={workInput.isSubmitting} />
								</Card>

								{/* Files */}
								<Card className="bg-surface-dark border-border-dark p-6">
									<FileUploadZone
										{...fileUpload}
										disabled={workInput.isSubmitting}
									/>
								</Card>

								{/* Links */}
								<Card className="bg-surface-dark border-border-dark p-6">
									<LinkInput {...links} disabled={workInput.isSubmitting} />
								</Card>
							</WorkInputForm>

							{/* Reviewer */}
							<ReviewerSelector
								reviewers={workInput.reviewers}
								selectedReviewerId={workInput.formData.reviewerId || null}
								comment={workInput.formData.comment || ''}
								onReviewerSelect={(id) =>
									workInput.setFormData({ reviewerId: id || undefined })
								}
								onCommentChange={(comment) =>
									workInput.setFormData({ comment })
								}
								disabled={workInput.isSubmitting}
							/>
						</div>
					)}

					{/* Task Progress Mode */}
					{mode === 'task' && (
						<TaskProgressInput
							taskProgress={taskProgress}
							onTaskProgressChange={(updates) =>
								setTaskProgress((prev) => ({ ...prev, ...updates }))
							}
							disabled={workInput.isSubmitting}
						/>
					)}

					{/* AI Draft Mode */}
					{mode === 'ai-draft' && (
						<AIDraftPanel
							draft={draft.draft}
							onDraftChange={draft.updateDraft}
							onGenerateDraft={draft.generateDraft}
							onApplyDraft={handleApplyDraft}
							isGenerating={draft.isGenerating}
							disabled={workInput.isSubmitting}
						/>
					)}
				</form>
			</div>
		</div>
	)
}
