/**
 * OKRForm Component
 * OKR 목표 생성/수정 폼
 * OKR은 개인 목표로 정의됨 (team 필드 제거)
 */

import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import { Target, X, Save, FolderKanban } from 'lucide-react'
import { toast } from 'sonner'
import type { Objective, ObjectiveFormData } from '../../types/okr.types'
import type { Project } from '../../types/common.types'
import { storage } from '../../utils/storage'

export interface OKRFormProps {
	objective?: Objective
	onSubmit: (data: ObjectiveFormData) => void
	onCancel: () => void
	users: Array<{ id: string; name: string; department?: string }>
	currentUser?: { id: string; name: string; department?: string }
	isSubmitting?: boolean
}

export function OKRForm({
	objective,
	onSubmit,
	onCancel,
	users,
	currentUser,
	isSubmitting = false,
}: OKRFormProps) {
	const [formData, setFormData] = useState<ObjectiveFormData>({
		title: objective?.title || '',
		description: objective?.description || '',
		period: objective?.period || '',
		periodType: objective?.periodType || 'quarter',
		owner: objective?.owner || currentUser?.name || '',
		ownerId: objective?.ownerId || currentUser?.id || '',
		department: objective?.department || currentUser?.department || '',
		projectId: objective?.projectId || '',
		projectName: objective?.projectName || '',
		startDate: objective?.startDate || '',
		endDate: objective?.endDate || '',
	})

	// 진행 중인 프로젝트 목록 가져오기
	const projects = useMemo(() => {
		const allProjects = storage.get<Project[]>('projects', []) || []
		// 진행 중인 프로젝트만 필터링 (completed가 아닌 것들)
		return allProjects.filter(p => p.status !== 'completed')
	}, [])

	// 소유자가 변경될 때 부서 정보도 업데이트
	useEffect(() => {
		if (formData.ownerId) {
			const selectedUser = users.find(u => u.id === formData.ownerId)
			if (selectedUser) {
				setFormData(prev => ({
					...prev,
					owner: selectedUser.name,
					department: selectedUser.department || prev.department
				}))
			}
		}
	}, [formData.ownerId, users])

	// 프로젝트가 변경될 때 프로젝트 이름도 업데이트
	useEffect(() => {
		if (formData.projectId) {
			const selectedProject = projects.find(p => p.id === formData.projectId)
			if (selectedProject) {
				setFormData(prev => ({
					...prev,
					projectName: selectedProject.name
				}))
			}
		} else {
			setFormData(prev => ({
				...prev,
				projectName: ''
			}))
		}
	}, [formData.projectId, projects])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		// Validation
		if (!formData.title.trim()) {
			toast.error('Please enter a title')
			return
		}
		if (!formData.period) {
			toast.error('Please select a period')
			return
		}
		if (!formData.ownerId) {
			toast.error('Please select an owner')
			return
		}
		if (!formData.startDate || !formData.endDate) {
			toast.error('Please select start and end dates')
			return
		}

		onSubmit(formData)
	}

	const quarters = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025']
	const months = [
		'Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024',
		'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024',
		'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025',
	]

	return (
		<Card className="bg-surface-dark border-border-dark">
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						<Target className="h-5 w-5 text-orange-400" />
						{objective ? 'Edit Personal Objective' : 'Create Personal Objective'}
					</CardTitle>
					<Button onClick={onCancel} variant="ghost" size="sm">
						<X className="h-4 w-4" />
					</Button>
				</div>
			</CardHeader>

			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Title */}
					<div>
						<label className="block text-sm font-medium text-neutral-300 mb-2">
							Title <span className="text-red-400">*</span>
						</label>
						<Input
							type="text"
							placeholder="e.g., Improve code quality and reduce bugs"
							value={formData.title}
							onChange={(e) => setFormData({ ...formData, title: e.target.value })}
							disabled={isSubmitting}
							required
						/>
					</div>

					{/* Description */}
					<div>
						<label className="block text-sm font-medium text-neutral-300 mb-2">
							Description
						</label>
						<Textarea
							placeholder="Describe your objective in detail..."
							value={formData.description}
							onChange={(e) => setFormData({ ...formData, description: e.target.value })}
							disabled={isSubmitting}
							rows={3}
						/>
					</div>

					{/* Period Type & Period */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-neutral-300 mb-2">
								Period Type <span className="text-red-400">*</span>
							</label>
							<select
								value={formData.periodType}
								onChange={(e) => setFormData({
									...formData,
									periodType: e.target.value as 'quarter' | 'month',
									period: '', // Reset period when type changes
								})}
								disabled={isSubmitting}
								className="w-full px-3 py-2 bg-surface-dark border border-border-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
								required
							>
								<option value="quarter">Quarter</option>
								<option value="month">Month</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-neutral-300 mb-2">
								Period <span className="text-red-400">*</span>
							</label>
							<select
								value={formData.period}
								onChange={(e) => setFormData({ ...formData, period: e.target.value })}
								disabled={isSubmitting}
								className="w-full px-3 py-2 bg-surface-dark border border-border-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
								required
							>
								<option value="">Select...</option>
								{formData.periodType === 'quarter'
									? quarters.map((q) => (
											<option key={q} value={q}>
												{q}
											</option>
									  ))
									: months.map((m) => (
											<option key={m} value={m}>
												{m}
											</option>
									  ))}
							</select>
						</div>
					</div>

					{/* Dates */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-neutral-300 mb-2">
								Start Date <span className="text-red-400">*</span>
							</label>
							<Input
								type="date"
								value={formData.startDate}
								onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
								disabled={isSubmitting}
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-neutral-300 mb-2">
								End Date <span className="text-red-400">*</span>
							</label>
							<Input
								type="date"
								value={formData.endDate}
								onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
								disabled={isSubmitting}
								required
							/>
						</div>
					</div>

					{/* Owner (개인 선택) */}
					<div>
						<label className="block text-sm font-medium text-neutral-300 mb-2">
							Owner (You) <span className="text-red-400">*</span>
						</label>
						<select
							value={formData.ownerId}
							onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
							disabled={isSubmitting}
							className="w-full px-3 py-2 bg-surface-dark border border-border-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
							required
						>
							<option value="">Select owner...</option>
							{users.map((user) => (
								<option key={user.id} value={user.id}>
									{user.name}
									{user.department && ` (${user.department})`}
								</option>
							))}
						</select>
						<p className="mt-1 text-xs text-neutral-500">
							OKRs are personal objectives. Select yourself as the owner.
						</p>
					</div>

					{/* Project (선택적) */}
					<div>
						<label className="block text-sm font-medium text-neutral-300 mb-2 flex items-center gap-2">
							<FolderKanban className="h-4 w-4 text-orange-400" />
							Related Project (Optional)
						</label>
						<select
							value={formData.projectId || ''}
							onChange={(e) => setFormData({ ...formData, projectId: e.target.value || undefined })}
							disabled={isSubmitting}
							className="w-full px-3 py-2 bg-surface-dark border border-border-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
						>
							<option value="">No project (Individual OKR)</option>
							{projects.length === 0 ? (
								<option value="" disabled>No active projects available</option>
							) : (
								projects.map((project) => (
									<option key={project.id} value={project.id}>
										{project.name}
										{project.status && ` • ${project.status}`}
									</option>
								))
							)}
						</select>
						<p className="mt-1 text-xs text-neutral-500">
							Link this OKR to a specific project to track progress together.
						</p>
					</div>

					{/* Department (자동 표시) */}
					{formData.department && (
						<div>
							<label className="block text-sm font-medium text-neutral-300 mb-2">
								Department
							</label>
							<Input
								type="text"
								value={formData.department}
								disabled
								className="bg-surface-darker"
							/>
							<p className="mt-1 text-xs text-neutral-500">
								Department is automatically set based on the owner.
							</p>
						</div>
					)}

					{/* Actions */}
					<div className="flex items-center justify-end gap-3 pt-4 border-t border-border-dark">
						<Button
							type="button"
							onClick={onCancel}
							disabled={isSubmitting}
							variant="outline"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isSubmitting}
							variant="brand"
						>
							{isSubmitting ? (
								<>
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
									Saving...
								</>
							) : (
								<>
									<Save className="h-4 w-4 mr-2" />
									{objective ? 'Update' : 'Create'} Objective
								</>
							)}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	)
}
