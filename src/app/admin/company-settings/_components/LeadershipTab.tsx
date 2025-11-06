import { Card, CardContent, CardHeader } from '../../../../components/ui/Card'
import { Button } from '../../../../components/ui/Button'
import Input from '../../../../components/ui/Input'
import {
	Users,
	Plus,
	X,
	Edit2,
	Trash2,
	Save,
	UserCircle,
	Mail,
	Phone,
} from 'lucide-react'
import type { LeadershipMember } from '../_types/types'
import { POSITION_OPTIONS } from '../_types/types'

interface LeadershipTabProps {
	leadership: LeadershipMember[]
	isAddingLeader: boolean
	editingLeader: string | null
	newLeader: Partial<LeadershipMember>
	onSetIsAddingLeader: (value: boolean) => void
	onSetEditingLeader: (id: string | null) => void
	onSetNewLeader: (leader: Partial<LeadershipMember>) => void
	onAddLeader: () => void
	onUpdateLeader: (id: string, field: keyof LeadershipMember, value: string) => void
	onDeleteLeader: (id: string) => void
	onSaveEdit: () => void
}

export default function LeadershipTab({
	leadership,
	isAddingLeader,
	editingLeader,
	newLeader,
	onSetIsAddingLeader,
	onSetEditingLeader,
	onSetNewLeader,
	onAddLeader,
	onUpdateLeader,
	onDeleteLeader,
	onSaveEdit,
}: LeadershipTabProps) {
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-xl font-bold flex items-center gap-2">
								<Users className="h-5 w-5 text-primary" />
								Leadership Team
							</h2>
							<p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
								Manage key leaders and executives in your organization
							</p>
						</div>
						<Button
							onClick={() => onSetIsAddingLeader(true)}
							className="flex items-center gap-2"
						>
							<Plus className="h-4 w-4" />
							Add Leader
						</Button>
					</div>
				</CardHeader>
			</Card>

			{/* Add Leader Form */}
			{isAddingLeader && (
				<Card className="border-primary/30">
					<CardHeader>
						<div className="flex items-center justify-between">
							<h3 className="font-semibold">New Leader</h3>
							<Button variant="outline" size="sm" onClick={() => onSetIsAddingLeader(false)}>
								<X className="h-4 w-4" />
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium mb-2">
										Name <span className="text-red-500">*</span>
									</label>
									<Input
										value={newLeader.name || ''}
										onChange={(e) =>
											onSetNewLeader({ ...newLeader, name: e.target.value })
										}
										placeholder="John Doe"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">
										Position <span className="text-red-500">*</span>
									</label>
									<select
										value={newLeader.position || ''}
										onChange={(e) =>
											onSetNewLeader({ ...newLeader, position: e.target.value })
										}
										className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900"
									>
										<option value="">Select position</option>
										{POSITION_OPTIONS.map((pos) => (
											<option key={pos} value={pos}>
												{pos}
											</option>
										))}
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">Email</label>
									<Input
										type="email"
										value={newLeader.email || ''}
										onChange={(e) =>
											onSetNewLeader({ ...newLeader, email: e.target.value })
										}
										placeholder="john.doe@company.com"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">Phone</label>
									<Input
										value={newLeader.phone || ''}
										onChange={(e) =>
											onSetNewLeader({ ...newLeader, phone: e.target.value })
										}
										placeholder="+82-10-1234-5678"
									/>
								</div>
								<div className="md:col-span-2">
									<label className="block text-sm font-medium mb-2">Department</label>
									<Input
										value={newLeader.department || ''}
										onChange={(e) =>
											onSetNewLeader({ ...newLeader, department: e.target.value })
										}
										placeholder="Executive, Engineering, etc."
									/>
								</div>
							</div>

							<div className="flex justify-end gap-3">
								<Button variant="outline" onClick={() => onSetIsAddingLeader(false)}>
									Cancel
								</Button>
								<Button onClick={onAddLeader}>
									<Plus className="h-4 w-4 mr-2" />
									Add Leader
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Leadership List */}
			<div className="grid grid-cols-1 gap-4">
				{leadership.map((leader) => (
					<Card key={leader.id} className="hover:border-primary/30 transition-colors">
						<CardContent className="p-6">
							<div className="flex items-start justify-between">
								<div className="flex items-start gap-4 flex-1">
									<div className="p-3 rounded-xl bg-primary/10">
										<UserCircle className="h-8 w-8 text-primary" />
									</div>
									<div className="flex-1 space-y-3">
										{editingLeader === leader.id ? (
											<>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
													<Input
														value={leader.name}
														onChange={(e) =>
															onUpdateLeader(leader.id, 'name', e.target.value)
														}
														placeholder="Name"
													/>
													<select
														value={leader.position}
														onChange={(e) =>
															onUpdateLeader(leader.id, 'position', e.target.value)
														}
														className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900"
													>
														{POSITION_OPTIONS.map((pos) => (
															<option key={pos} value={pos}>
																{pos}
															</option>
														))}
													</select>
													<Input
														type="email"
														value={leader.email}
														onChange={(e) =>
															onUpdateLeader(leader.id, 'email', e.target.value)
														}
														placeholder="Email"
													/>
													<Input
														value={leader.phone}
														onChange={(e) =>
															onUpdateLeader(leader.id, 'phone', e.target.value)
														}
														placeholder="Phone"
													/>
													<Input
														value={leader.department || ''}
														onChange={(e) =>
															onUpdateLeader(leader.id, 'department', e.target.value)
														}
														placeholder="Department"
														className="md:col-span-2"
													/>
												</div>
												<Button variant="outline" size="sm" onClick={onSaveEdit}>
													<Save className="h-4 w-4 mr-2" />
													Save Changes
												</Button>
											</>
										) : (
											<>
												<div>
													<h3 className="font-bold text-lg">{leader.name}</h3>
													<p className="text-primary font-medium">{leader.position}</p>
													{leader.department && (
														<p className="text-sm text-neutral-600 dark:text-neutral-400">
															{leader.department}
														</p>
													)}
												</div>
												<div className="space-y-1 text-sm">
													{leader.email && (
														<div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
															<Mail className="h-4 w-4" />
															{leader.email}
														</div>
													)}
													{leader.phone && (
														<div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
															<Phone className="h-4 w-4" />
															{leader.phone}
														</div>
													)}
												</div>
											</>
										)}
									</div>
								</div>
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											onSetEditingLeader(editingLeader === leader.id ? null : leader.id)
										}
									>
										<Edit2 className="h-4 w-4" />
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() => onDeleteLeader(leader.id)}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Empty State */}
			{leadership.length === 0 && !isAddingLeader && (
				<Card className="border-dashed">
					<CardContent className="p-12 text-center">
						<Users className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
						<h3 className="font-semibold text-lg mb-2">No Leaders Added Yet</h3>
						<p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
							Start by adding your first leadership team member
						</p>
						<Button onClick={() => onSetIsAddingLeader(true)}>
							<Plus className="h-4 w-4 mr-2" />
							Add First Leader
						</Button>
					</CardContent>
				</Card>
			)}
		</div>
	)
}

