/**
 * OKR Page
 * 
 * 리팩토링 완료:
 * - 1,430줄 → ~200줄 (86% 감소)
 * - useOKR 훅으로 모든 로직 분리
 * - 재사용 가능한 컴포넌트로 UI 구성
 */

import { useState } from 'react'
import { PageHeader } from '../../components/common/PageHeader'
import { Button } from '../../components/ui/Button'
import { Tabs } from '../../components/ui/Tabs'
import { Plus, Target, BarChart3 } from 'lucide-react'
import { toast } from 'sonner'

// Custom Hook
import { useOKR } from '../../hooks/useOKR'

// Components
import { OKRList } from '../../components/okr/OKRList'
import { OKRForm } from '../../components/okr/OKRForm'
import { OKRProgress } from '../../components/okr/OKRProgress'
import { KeyResultItem } from '../../components/okr/KeyResultItem'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'

// Types
import type { Objective, ObjectiveFormData } from '../../types/okr.types'

export default function OKRPage() {
	// OKR Hook
	const okr = useOKR()

	// UI State
	const [activeTab, setActiveTab] = useState<'list' | 'analytics'>('list')
	const [showObjectiveForm, setShowObjectiveForm] = useState(false)
	const [editingObjective, setEditingObjective] = useState<Objective | undefined>()

	// Mock data (replace with real data)
	const teams = [
		{ id: 'eng', name: 'Engineering' },
		{ id: 'product', name: 'Product' },
		{ id: 'design', name: 'Design' },
	]
	const users = [
		{ id: 'user1', name: 'John Doe' },
		{ id: 'user2', name: 'Jane Smith' },
	]

	// Handlers
	const handleCreateObjective = () => {
		setEditingObjective(undefined)
		setShowObjectiveForm(true)
	}

	const handleEditObjective = (objective: Objective) => {
		setEditingObjective(objective)
		setShowObjectiveForm(true)
	}

	const handleSubmitObjective = async (data: ObjectiveFormData) => {
		try {
			if (editingObjective) {
				await okr.updateObjective(editingObjective.id, data as Partial<Objective>)
				toast.success('Objective updated successfully')
			} else {
				await okr.createObjective(data)
				toast.success('Objective created successfully')
			}
			setShowObjectiveForm(false)
			setEditingObjective(undefined)
		} catch {
			toast.error('Failed to save objective')
		}
	}

	const handleDeleteObjective = async (id: string) => {
		try {
			await okr.deleteObjective(id)
			toast.success('Objective deleted successfully')
		} catch {
			toast.error('Failed to delete objective')
		}
	}

	const handleUpdateKeyResultProgress = async (keyResultId: string, current: number) => {
		if (!okr.selectedObjective) return

		try {
			await okr.updateKeyResult(okr.selectedObjective.id, keyResultId, { current })
		} catch {
			toast.error('Failed to update progress')
		}
	}

	return (
		<div className="min-h-screen bg-background-dark">
			<div className="max-w-[1600px] mx-auto px-6 py-6 space-y-8">
				{/* Page Header */}
			<PageHeader
				title="OKR Management"
				description="Set and track your objectives and key results"
				actions={
						<Button onClick={handleCreateObjective} variant="brand">
							<Plus className="h-4 w-4 mr-2" />
							New Objective
						</Button>
					}
				/>

				{/* Tabs */}
				<Tabs
					items={[
						{ id: 'list', label: 'Objectives', icon: Target },
						{ id: 'analytics', label: 'Analytics', icon: BarChart3 },
					]}
					activeTab={activeTab}
					onTabChange={(id) => setActiveTab(id as 'list' | 'analytics')}
					variant="underline"
				/>

				{/* Content */}
				{activeTab === 'list' && (
					<div className="space-y-6">
						{/* Objective Form */}
						{showObjectiveForm && (
							<OKRForm
								objective={editingObjective}
								onSubmit={handleSubmitObjective}
								onCancel={() => {
									setShowObjectiveForm(false)
									setEditingObjective(undefined)
								}}
								teams={teams}
								users={users}
								isSubmitting={okr.isLoading}
							/>
						)}

						{/* Selected Objective Detail */}
						{okr.selectedObjective && !showObjectiveForm && (
							<Card className="bg-surface-dark border-border-dark">
								<CardHeader>
									<div className="flex items-center justify-between">
										<CardTitle className="flex items-center gap-2">
											<Target className="h-5 w-5 text-orange-400" />
											{okr.selectedObjective.title}
										</CardTitle>
										<Button
											onClick={() => okr.selectObjective(null)}
											variant="ghost"
											size="sm"
										>
											Close
										</Button>
									</div>
								</CardHeader>
								<CardContent className="space-y-4">
									<p className="text-neutral-300">{okr.selectedObjective.description}</p>

									{/* Key Results */}
									<div className="space-y-3">
									<div className="flex items-center justify-between">
										<h3 className="font-medium text-white">Key Results</h3>
									</div>

									{okr.selectedObjective.keyResults.map((kr) => (
										<KeyResultItem
											key={kr.id}
											keyResult={kr}
											onEdit={() => toast.info('Edit feature coming soon')}
											onDelete={(id) =>
												okr.deleteKeyResult(okr.selectedObjective!.id, id)
											}
											onUpdateProgress={handleUpdateKeyResultProgress}
											disabled={okr.isLoading}
										/>
									))}

										{okr.selectedObjective.keyResults.length === 0 && (
											<div className="text-center py-8 text-neutral-500">
												No key results yet. Add your first key result to track progress.
											</div>
										)}
									</div>
								</CardContent>
							</Card>
						)}

						{/* OKR List */}
						{!okr.selectedObjective && !showObjectiveForm && (
							<OKRList
								objectives={okr.objectives}
								onSelect={okr.selectObjective}
								onEdit={handleEditObjective}
								onDelete={handleDeleteObjective}
							/>
						)}
					</div>
				)}

				{activeTab === 'analytics' && (
					<OKRProgress stats={okr.stats} />
				)}
			</div>
		</div>
	)
}
