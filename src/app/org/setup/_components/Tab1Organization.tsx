import { useLocale } from '../../../../i18n/I18nProvider';
import { settingsI18n } from '../_i18n/settings.i18n';
import type { OrgSettings, Industry } from '../_types/settings.types';
import { Card } from '../../../../components/ui/Card';
import Input from '../../../../components/ui/Input';
import Textarea from '../../../../components/ui/Textarea';
import { Badge } from 'lucide-react';

interface Tab1Props {
	data: OrgSettings;
	onChange: (data: OrgSettings) => void;
	errors?: Record<string, string>;
}

const INDUSTRIES: Industry[] = [
	'IT/SaaS',
	'Consulting',
	'Marketing',
	'Design',
	'Retail HQ',
	'Logistics',
	'Manufacturing',
	'Healthcare',
	'Public',
	'Education',
	'Other',
];

export default function Tab1Organization({ data, onChange, errors = {} }: Tab1Props) {
	const { locale } = useLocale();
	const t = settingsI18n[locale].org;

	const updateField = (field: keyof OrgSettings, value: string | string[]) => {
		onChange({ ...data, [field]: value });
	};

	const handleEmailDomainsChange = (value: string) => {
		const domains = value
			.split(',')
			.map((d) => d.trim().toLowerCase())
			.filter(Boolean);
		updateField('emailDomains', domains);
	};

	return (
		<Card className="p-6">
			<div className="flex items-center gap-2 mb-6">
				<h2 className="text-xl font-bold">{t.title}</h2>
				{data.fromOnboarding && (
					<span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 text-xs text-blue-700 dark:text-blue-300">
						<Badge className="h-3 w-3" />
						{t.fromOnboarding}
					</span>
				)}
			</div>

			<div className="space-y-4">
				<div>
					<label htmlFor="workspaceName" className="block text-sm font-medium mb-1">
						{t.workspaceName}
					</label>
					<Input
						id="workspaceName"
						value={data.workspaceName}
						onChange={(e) => updateField('workspaceName', e.target.value)}
						aria-invalid={!!errors.workspaceName}
					/>
					{errors.workspaceName && (
						<p className="mt-1 text-sm text-red-600" role="alert">
							{errors.workspaceName}
						</p>
					)}
				</div>

				<div>
					<label htmlFor="legalName" className="block text-sm font-medium mb-1">
						{t.legalName}
					</label>
					<Input
						id="legalName"
						value={data.legalName || ''}
						onChange={(e) => updateField('legalName', e.target.value)}
					/>
				</div>

				<div>
					<label htmlFor="emailDomains" className="block text-sm font-medium mb-1">
						{t.emailDomains}
					</label>
					<Input
						id="emailDomains"
						value={data.emailDomains.join(', ')}
						onChange={(e) => handleEmailDomainsChange(e.target.value)}
						placeholder="example.com, company.com"
						aria-invalid={!!errors.emailDomains}
					/>
					<p className="mt-1 text-xs text-neutral-500">{t.emailDomainsHelp}</p>
					{errors.emailDomains && (
						<p className="mt-1 text-sm text-red-600" role="alert">
							{errors.emailDomains}
						</p>
					)}
				</div>

				<div>
					<label htmlFor="industry" className="block text-sm font-medium mb-1">
						{t.industry}
					</label>
					<select
						id="industry"
						value={data.industry}
						onChange={(e) => updateField('industry', e.target.value)}
						className="w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
					>
						{INDUSTRIES.map((ind) => (
							<option key={ind} value={ind}>
								{ind}
							</option>
						))}
					</select>
				</div>

				<div>
					<label htmlFor="description" className="block text-sm font-medium mb-1">
						{t.description}
					</label>
					<Textarea
						id="description"
						value={data.description || ''}
						onChange={(e) => updateField('description', e.target.value)}
						rows={3}
					/>
				</div>

				<div>
					<label htmlFor="adminContact" className="block text-sm font-medium mb-1">
						{t.adminContact}
					</label>
					<Input
						id="adminContact"
						type="email"
						value={data.adminContact}
						onChange={(e) => updateField('adminContact', e.target.value)}
						aria-invalid={!!errors.adminContact}
					/>
					{errors.adminContact && (
						<p className="mt-1 text-sm text-red-600" role="alert">
							{errors.adminContact}
						</p>
					)}
				</div>
			</div>
		</Card>
	);
}

