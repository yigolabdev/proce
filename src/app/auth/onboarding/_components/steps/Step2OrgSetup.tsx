import { useState } from 'react';
import type { OrgSetup, TeamLead } from '../../_types/onboarding.types';
import { OrgSetupSchema } from '../../_schemas/onboarding.schema';
import { useLocale } from '../../../../../i18n/I18nProvider';
import { onboardingI18n } from '../../_i18n/onboarding.i18n';
import { DEPARTMENT_PRESETS } from '../../_constants/presets';
import Input from '../../../../../components/ui/Input';
import Button from '../../../../../components/ui/Button';
import { Card } from '../../../../../components/ui/Card';
import { X, Plus } from 'lucide-react';

interface Step2Props {
	data?: OrgSetup;
	industry?: string;
	onNext: (data: OrgSetup) => void;
	onBack: () => void;
}

export default function Step2OrgSetup({ data, industry, onNext, onBack }: Step2Props) {
	const { locale } = useLocale();
	const t = onboardingI18n[locale].step2;

	const presetDepts = industry ? DEPARTMENT_PRESETS[industry as keyof typeof DEPARTMENT_PRESETS] || [] : [];

	const [form, setForm] = useState<Partial<OrgSetup>>(
		data || {
			departments: [],
			roleModel: 'role',
			aliasPolicy: true,
			leads: [],
		}
	);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const result = OrgSetupSchema.safeParse(form);
		if (!result.success) {
			const fieldErrors: Record<string, string> = {};
			result.error.issues.forEach((err) => {
				if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
			});
			setErrors(fieldErrors);
			return;
		}
		setErrors({});
		onNext(result.data);
	};

	const toggleDepartment = (dept: string) => {
		setForm((prev) => {
			const current = prev.departments || [];
			const next = current.includes(dept) ? current.filter((d) => d !== dept) : [...current, dept];
			return { ...prev, departments: next };
		});
		if (errors.departments) {
			setErrors((prev) => {
				const next = { ...prev };
				delete next.departments;
				return next;
			});
		}
	};

	const addLead = () => {
		setForm((prev) => ({
			...prev,
			leads: [...(prev.leads || []), { alias: '', dept: '' }],
		}));
	};

	const removeLead = (index: number) => {
		setForm((prev) => ({
			...prev,
			leads: (prev.leads || []).filter((_, i) => i !== index),
		}));
	};

	const updateLead = (index: number, field: keyof TeamLead, value: string) => {
		setForm((prev) => ({
			...prev,
			leads: (prev.leads || []).map((lead, i) => (i === index ? { ...lead, [field]: value } : lead)),
		}));
	};

	return (
		<Card className="p-6">
			<h2 className="text-2xl font-bold">{t.title}</h2>
			<p className="mt-2 text-sm text-neutral-300">{t.subtitle}</p>

			<form onSubmit={handleSubmit} className="mt-6 space-y-6">
				<div>
					<label className="block text-sm font-medium mb-2">
						{t.departments}
					</label>
					<div className="flex flex-wrap gap-2">
						{presetDepts.map((dept) => (
							<button
								key={dept}
								type="button"
								onClick={() => toggleDepartment(dept)}
								className={`rounded-full px-4 py-1.5 text-sm transition ${
									form.departments?.includes(dept)
										? 'bg-primary text-white'
										: 'border border-neutral-800 hover:border-primary'
								}`}
							>
								{dept}
							</button>
						))}
					</div>
					{errors.departments && (
						<p className="mt-2 text-sm text-red-600" role="alert">
							{errors.departments}
						</p>
					)}
				</div>

				<div>
					<label className="block text-sm font-medium mb-2">{t.roleModel}</label>
					<div className="grid grid-cols-2 gap-3">
						<label
							className={`cursor-pointer rounded-2xl border px-4 py-3 text-center transition ${
								form.roleModel === 'role'
									? 'border-primary bg-primary/5 font-medium'
									: 'border-neutral-800 hover:border-primary/50'
							}`}
						>
							<input
								type="radio"
								name="roleModel"
								value="role"
								checked={form.roleModel === 'role'}
								onChange={(e) => setForm((prev) => ({ ...prev, roleModel: e.target.value as 'role' }))}
								className="sr-only"
							/>
							{t.roleModelRole}
						</label>
						<label
							className={`cursor-pointer rounded-2xl border px-4 py-3 text-center transition ${
								form.roleModel === 'title'
									? 'border-primary bg-primary/5 font-medium'
									: 'border-neutral-800 hover:border-primary/50'
							}`}
						>
							<input
								type="radio"
								name="roleModel"
								value="title"
								checked={form.roleModel === 'title'}
								onChange={(e) => setForm((prev) => ({ ...prev, roleModel: e.target.value as 'title' }))}
								className="sr-only"
							/>
							{t.roleModelTitle}
						</label>
					</div>
				</div>

				<div>
					<label className="flex items-center gap-3 cursor-pointer">
						<input
							type="checkbox"
							checked={form.aliasPolicy || false}
							onChange={(e) => setForm((prev) => ({ ...prev, aliasPolicy: e.target.checked }))}
							className="h-5 w-5 rounded border-neutral-300 text-primary focus:ring-2 focus:ring-primary/20"
						/>
						<div>
							<span className="text-sm font-medium">{t.aliasPolicy}</span>
							<p className="text-xs text-neutral-500">{t.aliasHelp}</p>
						</div>
					</label>
				</div>

				<div>
					<div className="flex items-center justify-between mb-2">
						<label className="block text-sm font-medium">{t.leads}</label>
						<Button type="button" variant="secondary" size="sm" onClick={addLead}>
							<Plus className="h-4 w-4 mr-1" />
							{t.addLead}
						</Button>
					</div>
					{form.leads && form.leads.length > 0 && (
						<div className="space-y-2">
							{form.leads.map((lead, index) => (
								<div key={index} className="flex gap-2">
									<Input
										placeholder={t.leadAlias}
										value={lead.alias}
										onChange={(e) => updateLead(index, 'alias', e.target.value)}
										className="flex-1"
									/>
									<select
										value={lead.dept || ''}
										onChange={(e) => updateLead(index, 'dept', e.target.value)}
										className="flex-1 rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
									>
										<option value="">{t.leadDept}</option>
										{form.departments?.map((dept) => (
											<option key={dept} value={dept}>
												{dept}
											</option>
										))}
									</select>
									<button
										type="button"
										onClick={() => removeLead(index)}
										className="rounded-2xl border border-neutral-800 p-2.5 hover:bg-red-50 hover:hover:bg-red-950/20"
										aria-label="Remove lead"
									>
										<X className="h-4 w-4" />
									</button>
								</div>
							))}
						</div>
					)}
				</div>

				<div className="flex justify-between pt-4">
					<Button type="button" variant="secondary" onClick={onBack}>
						{onboardingI18n[locale].back}
					</Button>
					<Button type="submit">{onboardingI18n[locale].next}</Button>
				</div>
			</form>
		</Card>
	);
}

