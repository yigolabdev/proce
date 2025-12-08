import { Card, CardContent } from '../../../../components/ui/Card'
import { Button } from '../../../../components/ui/Button'
import Input from '../../../../components/ui/Input'
import Textarea from '../../../../components/ui/Textarea'
import { Plus, Edit2, Trash2, Save, X, Briefcase } from 'lucide-react'
import type { Position, Job } from '../_types/types'

interface PositionsJobsTabProps {
	positions: Position[]
	jobs: Job[]
	editingPosition: Position | null
	editingJob: Job | null
	showAddPosition: boolean
	showAddJob: boolean
	newPosition: Omit<Position, 'id'>
	newJob: Omit<Job, 'id'>
	onSetEditingPosition: (position: Position | null) => void
	onSetEditingJob: (job: Job | null) => void
	onSetShowAddPosition: (show: boolean) => void
	onSetShowAddJob: (show: boolean) => void
	onSetNewPosition: (position: Omit<Position, 'id'>) => void
	onSetNewJob: (job: Omit<Job, 'id'>) => void
	onAddPosition: () => void
	onAddJob: () => void
	onUpdatePosition: () => void
	onUpdateJob: () => void
	onDeletePosition: (id: string) => void
	onDeleteJob: (id: string) => void
}

export default function PositionsJobsTab({
	positions,
	jobs,
	editingPosition,
	editingJob,
	showAddPosition,
	showAddJob,
	newPosition,
	newJob,
	onSetEditingPosition,
	onSetEditingJob,
	onSetShowAddPosition,
	onSetShowAddJob,
	onSetNewPosition,
	onSetNewJob,
	onAddPosition,
	onAddJob,
	onUpdatePosition,
	onUpdateJob,
	onDeletePosition,
	onDeleteJob,
}: PositionsJobsTabProps) {
	return (
		<div className="space-y-8">
			{/* Positions Section */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-lg font-bold flex items-center gap-2">
							<Briefcase className="h-5 w-5 text-orange-500" />
							Positions
						</h3>
						<p className="text-sm text-neutral-400 mt-1">
							Manage job positions and hierarchy levels
						</p>
					</div>
					<Button onClick={() => onSetShowAddPosition(true)}>
						<Plus className="h-4 w-4 mr-2" />
						Add Position
					</Button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{positions.map((position) => (
						<Card key={position.id}>
							<CardContent className="p-4">
							{editingPosition?.id === position.id ? (
								<div className="space-y-3">
									<Input
										value={editingPosition.name}
										onChange={(e) =>
											onSetEditingPosition({ ...editingPosition, name: e.target.value })
										}
										placeholder="Position name"
									/>
									<Textarea
										value={editingPosition.description}
										onChange={(e) =>
											onSetEditingPosition({
												...editingPosition,
												description: e.target.value,
											})
										}
										placeholder="Description"
										rows={3}
									/>
										<div className="flex gap-2">
											<Button onClick={onUpdatePosition} size="sm" className="flex-1">
												<Save className="h-3 w-3 mr-1" />
												Save
											</Button>
											<Button
												onClick={() => onSetEditingPosition(null)}
												variant="outline"
												size="sm"
												className="flex-1"
											>
												<X className="h-3 w-3 mr-1" />
												Cancel
											</Button>
										</div>
									</div>
								) : (
									<div className="space-y-3">
										<h4 className="font-bold text-lg">{position.name}</h4>
										<p className="text-sm text-neutral-400 min-h-12">
											{position.description || 'No description provided'}
										</p>
										<div className="flex gap-2 pt-2 border-t border-border-dark">
											<Button
												onClick={() => onSetEditingPosition(position)}
												variant="outline"
												size="sm"
												className="flex-1"
											>
												<Edit2 className="h-3 w-3 mr-1" />
												Edit
											</Button>
											<Button
												onClick={() => onDeletePosition(position.id)}
												variant="outline"
												size="sm"
												className="flex-1 text-red-600 hover:text-red-700"
											>
												<Trash2 className="h-3 w-3 mr-1" />
												Delete
											</Button>
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					))}
			</div>
		</div>

		{/* Add Position Dialog */}
			{showAddPosition && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
					<div className="bg-surface-dark rounded-2xl shadow-2xl border border-border-dark w-full max-w-lg">
						<div className="p-6">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-xl font-bold flex items-center gap-2">
									<Plus className="h-5 w-5 text-orange-500" />
									Add Position
								</h3>
								<button
									onClick={() => onSetShowAddPosition(false)}
									className="text-neutral-500 hover:hover:text-neutral-300"
								>
									<X className="h-5 w-5" />
								</button>
							</div>

							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium mb-2">
										Position Name <span className="text-red-500">*</span>
									</label>
									<Input
										value={newPosition.name}
										onChange={(e) => onSetNewPosition({ ...newPosition, name: e.target.value })}
										placeholder="e.g., Software Engineer"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium mb-2">Description</label>
									<Textarea
										value={newPosition.description}
										onChange={(e) =>
											onSetNewPosition({ ...newPosition, description: e.target.value })
										}
										placeholder="Brief description of this position"
										rows={4}
									/>
								</div>

								<div className="flex items-center gap-2 pt-4">
									<Button onClick={onAddPosition} className="flex-1">
										Add Position
									</Button>
									<Button
										variant="outline"
										onClick={() => onSetShowAddPosition(false)}
										className="flex-1"
									>
										Cancel
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

		{/* Roles & Responsibilities Section */}
		<div className="space-y-4 pt-8 border-t-2 border-border-dark">
			<div className="flex items-center justify-between">
				<div>
					<h3 className="text-lg font-bold flex items-center gap-2">
						<Briefcase className="h-5 w-5 text-orange-500" />
						Roles & Responsibilities
					</h3>
					<p className="text-sm text-neutral-400 mt-1">
						Define specific roles and their responsibilities
					</p>
				</div>
				<Button onClick={() => onSetShowAddJob(true)}>
					<Plus className="h-4 w-4 mr-2" />
					Add Role
				</Button>
			</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{jobs.map((job) => (
						<Card key={job.id}>
							<CardContent className="p-4">
							{editingJob?.id === job.id ? (
								<div className="space-y-3">
							<Input
								value={editingJob.title}
								onChange={(e) => onSetEditingJob({ ...editingJob, title: e.target.value })}
								placeholder="Role name"
							/>
									<Textarea
										value={editingJob.description}
										onChange={(e) =>
											onSetEditingJob({ ...editingJob, description: e.target.value })
										}
										placeholder="Description"
										rows={2}
									/>
									<Textarea
										value={editingJob.responsibilities}
										onChange={(e) =>
											onSetEditingJob({ ...editingJob, responsibilities: e.target.value })
										}
										placeholder="Responsibilities (one per line)"
										rows={3}
									/>
										<div className="flex gap-2">
											<Button onClick={onUpdateJob} size="sm" className="flex-1">
												<Save className="h-3 w-3 mr-1" />
												Save
											</Button>
											<Button
												onClick={() => onSetEditingJob(null)}
												variant="outline"
												size="sm"
												className="flex-1"
											>
												<X className="h-3 w-3 mr-1" />
												Cancel
											</Button>
										</div>
									</div>
								) : (
									<div className="space-y-3">
										<h4 className="font-bold text-lg">{job.title}</h4>
										<p className="text-sm text-neutral-400">
											{job.description || 'No description provided'}
										</p>
										<div>
											<div className="font-semibold text-xs text-neutral-500 mb-2">
												Responsibilities:
											</div>
											{job.responsibilities ? (
												<ul className="text-xs text-neutral-400 space-y-1">
													{job.responsibilities.split('\n').filter(item => item.trim()).map((item, idx) => (
														<li key={idx} className="flex items-start gap-2">
															<span className="text-orange-500 mt-1">•</span>
															<span>{item}</span>
														</li>
													))}
												</ul>
											) : (
												<p className="text-xs text-neutral-400 italic">No responsibilities specified</p>
											)}
										</div>
										<div className="flex gap-2 pt-2 border-t border-border-dark">
											<Button
												onClick={() => onSetEditingJob(job)}
												variant="outline"
												size="sm"
												className="flex-1"
											>
												<Edit2 className="h-3 w-3 mr-1" />
												Edit
											</Button>
											<Button
												onClick={() => onDeleteJob(job.id)}
												variant="outline"
												size="sm"
												className="flex-1 text-red-600 hover:text-red-700"
											>
												<Trash2 className="h-3 w-3 mr-1" />
												Delete
											</Button>
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					))}
			</div>
		</div>

		{/* Add Role & Responsibilities Dialog */}
		{showAddJob && (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
				<div className="bg-surface-dark rounded-2xl shadow-2xl border border-border-dark w-full max-w-lg">
					<div className="p-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-xl font-bold flex items-center gap-2">
								<Plus className="h-5 w-5 text-orange-500" />
								Add Role & Responsibilities
							</h3>
								<button
									onClick={() => onSetShowAddJob(false)}
									className="text-neutral-500 hover:hover:text-neutral-300"
								>
									<X className="h-5 w-5" />
								</button>
							</div>

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium mb-2">
									Role Name <span className="text-red-500">*</span>
								</label>
								<Input
									value={newJob.title}
									onChange={(e) => onSetNewJob({ ...newJob, title: e.target.value })}
									placeholder="e.g., Frontend Development"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium mb-2">Description</label>
								<Textarea
									value={newJob.description}
									onChange={(e) => onSetNewJob({ ...newJob, description: e.target.value })}
									placeholder="Brief description of this role"
									rows={3}
								/>
							</div>

								<div>
									<label className="block text-sm font-medium mb-2">Responsibilities</label>
									<Textarea
										value={newJob.responsibilities}
										onChange={(e) => onSetNewJob({ ...newJob, responsibilities: e.target.value })}
										placeholder="Enter responsibilities (one per line)"
										rows={4}
									/>
								</div>

							<div className="flex items-center gap-2 pt-4">
								<Button onClick={onAddJob} className="flex-1">
									Add Role
								</Button>
								<Button
									variant="outline"
									onClick={() => onSetShowAddJob(false)}
									className="flex-1"
								>
									Cancel
								</Button>
							</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

