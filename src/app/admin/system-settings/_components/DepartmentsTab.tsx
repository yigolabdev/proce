import { Card, CardContent } from '../../../../components/ui/Card'
import { Button } from '../../../../components/ui/Button'
import Input from '../../../../components/ui/Input'
import Textarea from '../../../../components/ui/Textarea'
import { Plus, Edit2, Trash2, Save, X, Building, Users } from 'lucide-react'
import type { Department } from '../_types/types'

interface DepartmentsTabProps {
	departments: Department[]
	editingDepartment: Department | null
	showAddDepartment: boolean
	newDepartment: Omit<Department, 'id'>
	onSetEditingDepartment: (department: Department | null) => void
	onSetShowAddDepartment: (show: boolean) => void
	onSetNewDepartment: (department: Omit<Department, 'id'>) => void
	onAdd: () => void
	onUpdate: () => void
	onDelete: (id: string) => void
}

export default function DepartmentsTab({
	departments,
	editingDepartment,
	showAddDepartment,
	newDepartment,
	onSetEditingDepartment,
	onSetShowAddDepartment,
	onSetNewDepartment,
	onAdd,
	onUpdate,
	onDelete,
}: DepartmentsTabProps) {
	return (
		<>
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<p className="text-sm text-neutral-600 dark:text-neutral-400">
						Manage company departments and organizational structure
					</p>
					<Button onClick={() => onSetShowAddDepartment(true)}>
						<Plus className="h-4 w-4 mr-2" />
						Add Department
					</Button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{departments.map((department) => (
						<Card key={department.id}>
							<CardContent className="p-4">
								{editingDepartment?.id === department.id ? (
									<div className="space-y-3">
										<Input
											value={editingDepartment.name}
											onChange={(e) =>
												onSetEditingDepartment({ ...editingDepartment, name: e.target.value })
											}
											placeholder="Department name"
										/>
										<Input
											value={editingDepartment.code}
											onChange={(e) =>
												onSetEditingDepartment({ ...editingDepartment, code: e.target.value })
											}
											placeholder="Department code"
										/>
										<Input
											value={editingDepartment.managerName}
											onChange={(e) =>
												onSetEditingDepartment({
													...editingDepartment,
													managerName: e.target.value,
												})
											}
											placeholder="Manager name"
										/>
										<Input
											value={editingDepartment.location}
											onChange={(e) =>
												onSetEditingDepartment({
													...editingDepartment,
													location: e.target.value,
												})
											}
											placeholder="Location"
										/>
										<Input
											type="number"
											value={editingDepartment.employeeCount}
											onChange={(e) =>
												onSetEditingDepartment({
													...editingDepartment,
													employeeCount: e.target.value,
												})
											}
											placeholder="Employee count"
										/>
										<Textarea
											value={editingDepartment.description}
											onChange={(e) =>
												onSetEditingDepartment({
													...editingDepartment,
													description: e.target.value,
												})
											}
											placeholder="Description"
											rows={2}
										/>
										<div className="flex items-center gap-2">
											<Button onClick={onUpdate} size="sm" className="flex-1">
												<Save className="h-4 w-4 mr-1" />
												Save
											</Button>
											<Button
												onClick={() => onSetEditingDepartment(null)}
												variant="outline"
												size="sm"
												className="flex-1"
											>
												Cancel
											</Button>
										</div>
									</div>
								) : (
									<>
										<div className="flex items-start justify-between mb-3">
											<div className="flex items-center gap-2">
												<Building className="h-5 w-5 text-primary" />
												<div>
													<h3 className="font-bold">{department.name}</h3>
													<span className="text-xs text-neutral-500 dark:text-neutral-400">
														{department.code}
													</span>
												</div>
											</div>
											<div className="flex items-center gap-1">
												<button
													onClick={() => onSetEditingDepartment(department)}
													className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
												>
													<Edit2 className="h-4 w-4 text-neutral-600" />
												</button>
												<button
													onClick={() => onDelete(department.id)}
													className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
												>
													<Trash2 className="h-4 w-4 text-red-500" />
												</button>
											</div>
										</div>
										<p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
											{department.description}
										</p>
										<div className="space-y-2 text-xs">
											{department.managerName && (
												<div className="flex items-center gap-2">
													<Users className="h-3 w-3 text-neutral-500" />
													<span className="text-neutral-600 dark:text-neutral-400">
														Manager: {department.managerName}
													</span>
												</div>
											)}
											{department.employeeCount && (
												<div className="flex items-center gap-2">
													<Users className="h-3 w-3 text-neutral-500" />
													<span className="text-neutral-600 dark:text-neutral-400">
														{department.employeeCount} employees
													</span>
												</div>
											)}
											{department.location && (
												<div className="flex items-center gap-2">
													<Building className="h-3 w-3 text-neutral-500" />
													<span className="text-neutral-600 dark:text-neutral-400">
														{department.location}
													</span>
												</div>
											)}
										</div>
									</>
								)}
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			{/* Add Department Dialog */}
			{showAddDepartment && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
					<div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-2xl">
						<div className="p-6">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-xl font-bold flex items-center gap-2">
									<Plus className="h-5 w-5 text-primary" />
									Add Department
								</h3>
								<button
									onClick={() => onSetShowAddDepartment(false)}
									className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
								>
									<X className="h-5 w-5" />
								</button>
							</div>

							<div className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium mb-2">
											Department Name <span className="text-red-500">*</span>
										</label>
										<Input
											value={newDepartment.name}
											onChange={(e) => onSetNewDepartment({ ...newDepartment, name: e.target.value })}
											placeholder="e.g., Engineering"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium mb-2">
											Department Code <span className="text-red-500">*</span>
										</label>
										<Input
											value={newDepartment.code}
											onChange={(e) => onSetNewDepartment({ ...newDepartment, code: e.target.value })}
											placeholder="e.g., ENG"
										/>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium mb-2">Description</label>
									<Textarea
										value={newDepartment.description}
										onChange={(e) =>
											onSetNewDepartment({ ...newDepartment, description: e.target.value })
										}
										placeholder="Brief description of this department"
										rows={3}
									/>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium mb-2">Manager Name</label>
										<Input
											value={newDepartment.managerName}
											onChange={(e) =>
												onSetNewDepartment({ ...newDepartment, managerName: e.target.value })
											}
											placeholder="e.g., John Doe"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium mb-2">Location</label>
										<Input
											value={newDepartment.location}
											onChange={(e) =>
												onSetNewDepartment({ ...newDepartment, location: e.target.value })
											}
											placeholder="e.g., Seoul HQ"
										/>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium mb-2">Employee Count</label>
										<Input
											type="number"
											value={newDepartment.employeeCount}
											onChange={(e) =>
												onSetNewDepartment({ ...newDepartment, employeeCount: e.target.value })
											}
											placeholder="e.g., 50"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium mb-2">Parent Department</label>
										<select
											value={newDepartment.parentId}
											onChange={(e) =>
												onSetNewDepartment({ ...newDepartment, parentId: e.target.value })
											}
											className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900"
										>
											<option value="">None (Top Level)</option>
											{departments.map((dept) => (
												<option key={dept.id} value={dept.id}>
													{dept.name} ({dept.code})
												</option>
											))}
										</select>
									</div>
								</div>

								<div className="flex items-center gap-2 pt-4">
									<Button onClick={onAdd} className="flex-1">
										Add Department
									</Button>
									<Button
										variant="outline"
										onClick={() => onSetShowAddDepartment(false)}
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
		</>
	)
}

