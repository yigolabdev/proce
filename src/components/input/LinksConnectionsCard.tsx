/**
 * Links & Connections Card Component
 * 프로젝트 및 OKR 연결 카드
 */

import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Target, ChevronDown } from 'lucide-react'
import type { WorkInputFormData, Project } from '../../types/workInput.types'
import type { Objective } from '../../types/common.types'

export interface LinksConnectionsCardProps {
	formData: WorkInputFormData
	setFormData: (data: Partial<WorkInputFormData>) => void
	projects: Project[]
	objectives?: Objective[]
	disabled?: boolean
}

export function LinksConnectionsCard({
	formData,
	setFormData,
	projects,
	objectives = [],
	disabled,
}: LinksConnectionsCardProps) {
	// Get selected objective for key results
	const selectedObjective = objectives.find(obj => obj.id === formData.objectiveId)

	return (
		<Card className="bg-neutral-900 border-neutral-800">
			<CardHeader className="border-b border-neutral-800 pb-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Target className="h-5 w-5 text-white" />
						<CardTitle className="text-white">Links & Connections</CardTitle>
					</div>
					<span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
						Optional
					</span>
				</div>
				<p className="text-sm text-neutral-400 mt-1">Connect your work to projects and objectives</p>
			</CardHeader>
			<CardContent className="p-6 space-y-5">
				{/* Related Project */}
				<div>
					<label className="block text-sm font-semibold mb-2 text-neutral-300">
						Related Project
					</label>
					<div className="relative">
						<select
							value={formData.projectId}
							onChange={(e) => setFormData({ projectId: e.target.value })}
							className="w-full px-4 py-2.5 border border-neutral-700 rounded-xl bg-neutral-800 text-white focus:outline-none focus:border-orange-500 appearance-none"
							disabled={disabled}
						>
							<option value="">Not related to any project</option>
							{projects.map((project) => (
								<option key={project.id} value={project.id}>
									{project.name} ({project.status === 'active' ? 'Active' : 'Planning'})
								</option>
							))}
						</select>
						<ChevronDown className="absolute right-3 top-3 h-4 w-4 text-neutral-500 pointer-events-none" />
					</div>
				</div>

				{/* OKR Connection */}
				{objectives.length > 0 && (
					<div className="space-y-4">
						<div className="flex items-center gap-2 text-sm font-semibold text-neutral-300">
							<span>Link to OKR</span>
						</div>

						{/* Objective */}
						<div>
							<label className="block text-sm font-medium text-neutral-400 mb-2">
								Objective
							</label>
							<div className="relative">
								<select
									value={formData.objectiveId || ''}
									onChange={(e) => {
										setFormData({
											objectiveId: e.target.value || undefined,
											keyResultId: undefined, // Reset key result when objective changes
										})
									}}
									className="w-full px-4 py-2.5 border border-neutral-700 rounded-xl bg-neutral-800 text-white focus:outline-none focus:border-orange-500 appearance-none"
									disabled={disabled}
								>
									<option value="">Not linked</option>
									{objectives.map((objective) => (
										<option key={objective.id} value={objective.id}>
											{objective.title} ({objective.period})
										</option>
									))}
								</select>
								<ChevronDown className="absolute right-3 top-3 h-4 w-4 text-neutral-500 pointer-events-none" />
							</div>
						</div>

						{/* Key Result */}
						<div>
							<label className="block text-sm font-medium text-neutral-400 mb-2">
								Key Result
							</label>
							<div className="relative">
								<select
									value={formData.keyResultId || ''}
									onChange={(e) => setFormData({ keyResultId: e.target.value || undefined })}
									className="w-full px-4 py-2.5 border border-neutral-700 rounded-xl bg-neutral-800 text-white focus:outline-none focus:border-orange-500 disabled:opacity-50 appearance-none"
									disabled={disabled || !formData.objectiveId}
								>
									<option value="">Not linked</option>
									{selectedObjective?.keyResults.map((kr) => (
										<option key={kr.id} value={kr.id}>
											{kr.description}
										</option>
									))}
								</select>
								<ChevronDown className="absolute right-3 top-3 h-4 w-4 text-neutral-500 pointer-events-none" />
							</div>
							{!formData.objectiveId && (
								<p className="text-xs text-neutral-500 mt-2">
									Select an objective first to link a key result
								</p>
							)}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	)
}

