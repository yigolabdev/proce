/**
 * KPI Form Component
 * KPI 생성/수정 폼
 */

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { X, Save } from 'lucide-react'
import type { KPI, KPIFormData, KPICategory } from '../../types/kpi.types'

interface KPIFormProps {
	kpi?: KPI
	onSubmit: (data: KPIFormData) => void
	onCancel: () => void
	departments: Array<{ id: string; name: string }>
	users: Array<{ id: string; name: string }>
	isSubmitting?: boolean
}

const KPI_CATEGORIES: Array<{ value: KPICategory; label: string }> = [
	{ value: 'revenue', label: '매출' },
	{ value: 'growth', label: '성장' },
	{ value: 'customer', label: '고객' },
	{ value: 'product', label: '제품' },
	{ value: 'operations', label: '운영' },
	{ value: 'team', label: '팀/인력' },
	{ value: 'quality', label: '품질' },
	{ value: 'efficiency', label: '효율성' },
]

export function KPIForm({ kpi, onSubmit, onCancel, departments, users, isSubmitting }: KPIFormProps) {
	const [formData, setFormData] = useState<KPIFormData>({
		name: kpi?.name || '',
		description: kpi?.description || '',
		category: kpi?.category || 'revenue',
		metric: {
			current: kpi?.metric.current || 0,
			target: kpi?.metric.target || 0,
			unit: kpi?.metric.unit || '',
			format: kpi?.metric.format || 'number',
		},
		period: kpi?.period || 'quarter',
		startDate: kpi?.startDate || '',
		endDate: kpi?.endDate || '',
		owner: kpi?.owner || '',
		department: kpi?.department || '',
		priority: kpi?.priority || 'medium',
	})

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		onSubmit(formData)
	}

	return (
		<Card className="bg-surface-dark border-border-dark">
			<CardHeader className="border-b border-border-dark">
				<div className="flex items-center justify-between">
					<CardTitle>{kpi ? 'KPI 수정' : '새로운 KPI'}</CardTitle>
					<Button variant="ghost" size="sm" onClick={onCancel}>
						<X className="h-4 w-4" />
					</Button>
				</div>
			</CardHeader>

			<CardContent className="p-6">
				<form onSubmit={handleSubmit} className="space-y-6">
					{/* KPI 이름 */}
					<div>
						<label className="block text-sm font-medium mb-2">
							KPI 이름 <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							value={formData.name}
							onChange={(e) => setFormData({ ...formData, name: e.target.value })}
							placeholder="예: 분기 매출 20% 증가"
							className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
							required
						/>
					</div>

					{/* 설명 */}
					<div>
						<label className="block text-sm font-medium mb-2">
							설명
						</label>
						<textarea
							value={formData.description}
							onChange={(e) => setFormData({ ...formData, description: e.target.value })}
							placeholder="KPI에 대한 자세한 설명을 입력하세요"
							rows={3}
							className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white resize-none"
						/>
					</div>

					{/* 카테고리 & 우선순위 */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium mb-2">
								카테고리 <span className="text-red-500">*</span>
							</label>
							<select
								value={formData.category}
								onChange={(e) => setFormData({ ...formData, category: e.target.value as KPICategory })}
								className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
								required
							>
								{KPI_CATEGORIES.map(cat => (
									<option key={cat.value} value={cat.value}>
										{cat.label}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium mb-2">
								우선순위 <span className="text-red-500">*</span>
							</label>
							<select
								value={formData.priority}
								onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
								className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
								required
							>
								<option value="low">Low</option>
								<option value="medium">Medium</option>
								<option value="high">High</option>
								<option value="critical">Critical</option>
							</select>
						</div>
					</div>

					{/* 지표 설정 */}
					<div className="space-y-4 p-4 bg-neutral-900/50 border border-neutral-800 rounded-lg">
						<h4 className="font-medium text-white">지표 설정</h4>
						
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium mb-2">
									현재 값 <span className="text-red-500">*</span>
								</label>
								<input
									type="number"
									value={formData.metric.current}
									onChange={(e) => setFormData({ 
										...formData, 
										metric: { ...formData.metric, current: parseFloat(e.target.value) || 0 }
									})}
									placeholder="0"
									className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium mb-2">
									목표 값 <span className="text-red-500">*</span>
								</label>
								<input
									type="number"
									value={formData.metric.target}
									onChange={(e) => setFormData({ 
										...formData, 
										metric: { ...formData.metric, target: parseFloat(e.target.value) || 0 }
									})}
									placeholder="100"
									className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
									required
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium mb-2">
									단위 <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									value={formData.metric.unit}
									onChange={(e) => setFormData({ 
										...formData, 
										metric: { ...formData.metric, unit: e.target.value }
									})}
									placeholder="%, 원, 명, 건 등"
									className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium mb-2">
									포맷 <span className="text-red-500">*</span>
								</label>
								<select
									value={formData.metric.format}
									onChange={(e) => setFormData({ 
										...formData, 
										metric: { ...formData.metric, format: e.target.value as any }
									})}
									className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
									required
								>
									<option value="number">숫자</option>
									<option value="percentage">퍼센트</option>
									<option value="currency">통화</option>
									<option value="count">개수</option>
								</select>
							</div>
						</div>
					</div>

					{/* 기간 설정 */}
					<div className="grid grid-cols-3 gap-4">
						<div>
							<label className="block text-sm font-medium mb-2">
								기간 <span className="text-red-500">*</span>
							</label>
							<select
								value={formData.period}
								onChange={(e) => setFormData({ ...formData, period: e.target.value as any })}
								className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
								required
							>
								<option value="quarter">분기</option>
								<option value="year">연간</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium mb-2">
								시작일 <span className="text-red-500">*</span>
							</label>
							<input
								type="date"
								value={formData.startDate}
								onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
								className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium mb-2">
								종료일 <span className="text-red-500">*</span>
							</label>
							<input
								type="date"
								value={formData.endDate}
								onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
								className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
								required
							/>
						</div>
					</div>

					{/* 담당자 & 부서 */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium mb-2">
								담당자 <span className="text-red-500">*</span>
							</label>
							<select
								value={formData.owner}
								onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
								className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
								required
							>
								<option value="">선택하세요</option>
								{users.map(user => (
									<option key={user.id} value={user.name}>
										{user.name}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium mb-2">
								부서 <span className="text-red-500">*</span>
							</label>
							<select
								value={formData.department}
								onChange={(e) => setFormData({ ...formData, department: e.target.value })}
								className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
								required
							>
								<option value="">선택하세요</option>
								{departments.map(dept => (
									<option key={dept.id} value={dept.name}>
										{dept.name}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* 액션 버튼 */}
					<div className="flex items-center gap-3 pt-4 border-t border-border-dark">
						<Button
							type="submit"
							variant="brand"
							className="flex-1"
							disabled={isSubmitting}
						>
							<Save className="h-4 w-4 mr-2" />
							{kpi ? 'KPI 수정' : 'KPI 생성'}
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={onCancel}
							disabled={isSubmitting}
						>
							취소
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	)
}
