import { Card, CardContent, CardHeader } from '../../../../components/ui/Card'
import { Button } from '../../../../components/ui/Button'
import Textarea from '../../../../components/ui/Textarea'
import { Briefcase, Save } from 'lucide-react'
import type { CompanyInfo } from '../_types/types'

interface BusinessTabProps {
	companyInfo: CompanyInfo
	onChange: (field: keyof CompanyInfo, value: string) => void
	onSave: () => void
}

export default function BusinessTab({ companyInfo, onChange, onSave }: BusinessTabProps) {
	return (
		<Card className="bg-surface-dark border-border-dark">
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-xl font-bold flex items-center gap-2 text-white">
							<Briefcase className="h-5 w-5 text-orange-500" />
							Business Information
						</h2>
						<p className="text-sm text-neutral-400 mt-1">
							Company description, vision, mission, market, and customers
						</p>
					</div>
					<Button onClick={onSave} className="flex items-center gap-2 bg-white text-black hover:bg-neutral-200">
						<Save className="h-4 w-4" />
						Save
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					{/* Description */}
					<div>
						<label className="block text-sm font-medium mb-2 text-neutral-300">Company Description</label>
						<Textarea
							value={companyInfo.description}
							onChange={(e) => onChange('description', e.target.value)}
							placeholder="Brief description of your company..."
							rows={4}
						/>
					</div>

					{/* Vision & Mission */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium mb-2 text-neutral-300">Vision</label>
							<Textarea
								value={companyInfo.vision}
								onChange={(e) => onChange('vision', e.target.value)}
								placeholder="Our vision for the future..."
								rows={4}
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-2 text-neutral-300">Mission</label>
							<Textarea
								value={companyInfo.mission}
								onChange={(e) => onChange('mission', e.target.value)}
								placeholder="Our mission statement..."
								rows={4}
							/>
						</div>
					</div>

					{/* Products & Services */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium mb-2 text-neutral-300">Main Products</label>
							<Textarea
								value={companyInfo.mainProducts}
								onChange={(e) => onChange('mainProducts', e.target.value)}
								placeholder="List your main products..."
								rows={4}
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-2 text-neutral-300">Main Services</label>
							<Textarea
								value={companyInfo.mainServices}
								onChange={(e) => onChange('mainServices', e.target.value)}
								placeholder="List your main services..."
								rows={4}
							/>
						</div>
					</div>

					{/* Market & Customers */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium mb-2 text-neutral-300">Target Market</label>
							<Textarea
								value={companyInfo.targetMarket}
								onChange={(e) => onChange('targetMarket', e.target.value)}
								placeholder="Describe your target market (geography, industry, market size)..."
								rows={4}
							/>
							<p className="text-xs text-neutral-500 mt-1">
								💡 e.g., "Global SaaS market, focusing on mid-size enterprises in North America and Europe"
							</p>
						</div>
						<div>
							<label className="block text-sm font-medium mb-2 text-neutral-300">Target Customers</label>
							<Textarea
								value={companyInfo.targetCustomers}
								onChange={(e) => onChange('targetCustomers', e.target.value)}
								placeholder="Describe your ideal customers (demographics, behavior, needs)..."
								rows={4}
							/>
							<p className="text-xs text-neutral-500 mt-1">
								💡 e.g., "HR managers and team leaders in tech companies with 50-500 employees"
							</p>
						</div>
					</div>

					{/* Competitive Advantage */}
					<div>
						<label className="block text-sm font-medium mb-2 text-neutral-300">Competitive Advantage</label>
						<Textarea
							value={companyInfo.competitiveAdvantage}
							onChange={(e) => onChange('competitiveAdvantage', e.target.value)}
							placeholder="What makes your company unique and competitive..."
							rows={4}
						/>
						<p className="text-xs text-neutral-500 mt-1">
							💡 Describe your unique value proposition, technology, expertise, or market position
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

