import { Card, CardContent, CardHeader } from '../../../../components/ui/Card'
import { Button } from '../../../../components/ui/Button'
import Input from '../../../../components/ui/Input'
import { Select } from '../../../../components/ui/Select'
import {
	Building2,
	Save,
	Plus,
	X,
	Users,
	MapPin,
	Phone,
	Mail,
	Globe,
} from 'lucide-react'
import type { CompanyInfo } from '../_types/types'

interface CompanyInfoTabProps {
	companyInfo: CompanyInfo
	onChange: (field: keyof CompanyInfo, value: string) => void
	onSave: () => void
	onAddSocialLink: () => void
	onRemoveSocialLink: (index: number) => void
	onSocialLinkChange: (index: number, field: 'platform' | 'url', value: string) => void
}

const INDUSTRIES = [
	'IT / SaaS / Software',
	'Manufacturing / Production',
	'Finance / Insurance / Securities',
	'Distribution / Retail / Trading',
	'Service / Consulting',
	'Construction / Engineering',
	'Medical / Pharmaceutical / Bio',
	'Education / Research',
	'Media / Content / Entertainment',
	'Other',
]

const COMPANY_SIZES = [
	'Startup (1-10)',
	'Small (11-50)',
	'Medium (51-200)',
	'Large (201-1000)',
	'Enterprise (1000+)',
]

export default function CompanyInfoTab({
	companyInfo,
	onChange,
	onSave,
	onAddSocialLink,
	onRemoveSocialLink,
	onSocialLinkChange,
}: CompanyInfoTabProps) {
	return (
		<Card className="bg-surface-dark border-border-dark">
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-xl font-bold flex items-center gap-2 text-white">
							<Building2 className="h-5 w-5 text-orange-500" />
							Company Information
						</h2>
						<p className="text-sm text-neutral-400 mt-1">
							Basic information, location, and contact details
						</p>
					</div>
					<Button onClick={onSave} variant="primary">
						<Save className="h-4 w-4" />
						Save
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-8">
					{/* Company Identity */}
					<div>
						<h3 className="font-semibold text-sm text-neutral-400 mb-4 flex items-center gap-2">
							<Building2 className="h-4 w-4" />
							Company Identity
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium mb-2">
									Company Name <span className="text-red-500">*</span>
								</label>
								<Input
									value={companyInfo.name}
									onChange={(e) => onChange('name', e.target.value)}
									placeholder="Proce Inc."
								/>
							</div>
							<div>
								<label className="block text-sm font-medium mb-2">Legal Name</label>
								<Input
									value={companyInfo.legalName}
									onChange={(e) => onChange('legalName', e.target.value)}
									placeholder="Proce Incorporated"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium mb-2">Business Registration Number</label>
								<Input
									value={companyInfo.businessNumber}
									onChange={(e) => onChange('businessNumber', e.target.value)}
									placeholder="123-45-67890"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium mb-2 text-neutral-300">
									Industry <span className="text-red-500">*</span>
								</label>
								<Select
									value={companyInfo.industry}
									onChange={(e) => onChange('industry', e.target.value)}
								>
									{INDUSTRIES.map((ind) => (
										<option key={ind} value={ind}>
											{ind}
										</option>
									))}
								</Select>
							</div>
						</div>
					</div>

					{/* Size & Foundation */}
					<div>
						<h3 className="font-semibold text-sm text-neutral-400 mb-4">
							Size & Foundation
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<label className="block text-sm font-medium mb-2 text-neutral-300">Company Size</label>
								<Select
									value={companyInfo.companySize}
									onChange={(e) => onChange('companySize', e.target.value)}
								>
									{COMPANY_SIZES.map((size) => (
										<option key={size} value={size}>
											{size}
										</option>
									))}
								</Select>
							</div>
							<div>
								<label className="block text-sm font-medium mb-2">Founded Year</label>
								<Input
									type="text"
									value={companyInfo.foundedYear}
									onChange={(e) => onChange('foundedYear', e.target.value)}
									placeholder="2020"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium mb-2">Founded Date</label>
								<Input
									type="date"
									value={companyInfo.foundedDate}
									onChange={(e) => onChange('foundedDate', e.target.value)}
								/>
							</div>
						</div>
					</div>

					{/* Workforce */}
					<div>
						<h3 className="font-semibold text-sm text-neutral-400 mb-4 flex items-center gap-2">
							<Users className="h-4 w-4" />
							Workforce Information
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<label className="block text-sm font-medium mb-2 text-neutral-300">Total Employees</label>
								<Input
									type="number"
									value={companyInfo.employeeCount}
									onChange={(e) => onChange('employeeCount', e.target.value)}
									placeholder="247"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium mb-2">Full-time</label>
								<Input
									type="number"
									value={companyInfo.fullTimeCount}
									onChange={(e) => onChange('fullTimeCount', e.target.value)}
									placeholder="220"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium mb-2">Part-time / Contract</label>
								<Input
									type="number"
									value={companyInfo.partTimeCount}
									onChange={(e) => onChange('partTimeCount', e.target.value)}
									placeholder="27"
								/>
							</div>
						</div>
					</div>

					{/* Office Location */}
					<div>
						<h3 className="font-semibold text-sm text-neutral-700 dark:text-neutral-300 mb-4 flex items-center gap-2">
							<MapPin className="h-4 w-4" />
							Office Location
						</h3>
						<div className="grid grid-cols-1 gap-4">
							<div>
								<label className="block text-sm font-medium mb-2">Address</label>
								<Input
									value={companyInfo.address}
									onChange={(e) => onChange('address', e.target.value)}
									placeholder="123 Main Street"
								/>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<label className="block text-sm font-medium mb-2">City</label>
									<Input
										value={companyInfo.city}
										onChange={(e) => onChange('city', e.target.value)}
										placeholder="Seoul"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">Postal Code</label>
									<Input
										value={companyInfo.postalCode}
										onChange={(e) => onChange('postalCode', e.target.value)}
										placeholder="06234"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">Country</label>
									<Input
										value={companyInfo.country}
										onChange={(e) => onChange('country', e.target.value)}
										placeholder="South Korea"
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Contact Channels */}
					<div>
						<h3 className="font-semibold text-sm text-neutral-700 dark:text-neutral-300 mb-4 flex items-center gap-2">
							<Phone className="h-4 w-4" />
							Contact Channels
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="text-sm font-medium mb-2 flex items-center gap-2">
									<Phone className="h-4 w-4" />
									Phone
								</label>
								<Input
									value={companyInfo.phone}
									onChange={(e) => onChange('phone', e.target.value)}
									placeholder="+82-2-1234-5678"
								/>
							</div>
							<div>
								<label className="text-sm font-medium mb-2 flex items-center gap-2">
									<Mail className="h-4 w-4" />
									Email
								</label>
								<Input
									type="email"
									value={companyInfo.email}
									onChange={(e) => onChange('email', e.target.value)}
									placeholder="contact@company.com"
								/>
							</div>
							<div className="md:col-span-2">
								<label className="text-sm font-medium mb-2 flex items-center gap-2">
									<Globe className="h-4 w-4" />
									Website
								</label>
								<Input
									type="url"
									value={companyInfo.website}
									onChange={(e) => onChange('website', e.target.value)}
									placeholder="https://www.company.com"
								/>
							</div>
						</div>
					</div>

					{/* Social Media */}
					<div>
						<div className="flex items-center justify-between mb-3">
							<label className="text-sm font-medium flex items-center gap-2">
								<Globe className="h-4 w-4" />
								Social Media
							</label>
							<Button
								variant="outline"
								size="sm"
								onClick={onAddSocialLink}
								className="flex items-center gap-2"
							>
								<Plus className="h-4 w-4" />
								Add Link
							</Button>
						</div>
						<div className="space-y-3">
							{companyInfo.socialLinks.map((link, index) => (
								<div key={index} className="flex gap-3">
									<Input
										placeholder="Platform (e.g., LinkedIn)"
										value={link.platform}
										onChange={(e) => onSocialLinkChange(index, 'platform', e.target.value)}
										className="flex-1"
									/>
									<Input
										placeholder="URL"
										value={link.url}
										onChange={(e) => onSocialLinkChange(index, 'url', e.target.value)}
										className="flex-[2]"
									/>
									<Button
										variant="outline"
										size="sm"
										onClick={() => onRemoveSocialLink(index)}
										className="px-3"
									>
										<X className="h-4 w-4" />
									</Button>
								</div>
							))}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

