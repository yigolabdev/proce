import { useState, useEffect } from 'react';
import type { CompanyProfile, Industry, CompanySize } from '../../_types/onboarding.types';
import { CompanyProfileSchema } from '../../_schemas/onboarding.schema';
import { useLocale } from '../../../../../i18n/I18nProvider';
import { onboardingI18n } from '../../_i18n/onboarding.i18n';
import Input from '../../../../../components/ui/Input';
import Button from '../../../../../components/ui/Button';
import { Card } from '../../../../../components/ui/Card';

interface Step1Props {
	data?: CompanyProfile;
	onNext: (data: CompanyProfile) => void;
}

export default function Step1CompanyProfile({ data, onNext }: Step1Props) {
	const { locale } = useLocale();
	const t = onboardingI18n[locale].step1;
	const tIndustries = onboardingI18n[locale].industries;
	const tSizes = onboardingI18n[locale].sizes;

	const [form, setForm] = useState<Partial<CompanyProfile>>(data || {});
	const [errors, setErrors] = useState<Record<string, string>>({});

	// Auto-fill emailDomain from website
	useEffect(() => {
		if (form.website && !form.emailDomain) {
			try {
				const url = new URL(form.website.startsWith('http') ? form.website : `https://${form.website}`);
				const domain = url.hostname.replace('www.', '');
				setForm((prev) => ({ ...prev, emailDomain: domain }));
			} catch {
				// Invalid URL, ignore
			}
		}
	}, [form.website, form.emailDomain]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const result = CompanyProfileSchema.safeParse(form);
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

	const updateField = (field: keyof CompanyProfile, value: string) => {
		setForm((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => {
				const next = { ...prev };
				delete next[field];
				return next;
			});
		}
	};

	return (
		<Card className="p-6">
			<h2 className="text-2xl font-bold">{t.title}</h2>
			<p className="mt-2 text-sm text-neutral-300">{t.subtitle}</p>

			<form onSubmit={handleSubmit} className="mt-6 space-y-4">
				<div>
					<label htmlFor="name" className="block text-sm font-medium mb-1">
						{t.name}
					</label>
					<Input
						id="name"
						value={form.name || ''}
						onChange={(e) => updateField('name', e.target.value)}
						placeholder="Acme Inc."
						aria-invalid={!!errors.name}
						aria-describedby={errors.name ? 'name-error' : undefined}
					/>
					{errors.name && (
						<p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
							{errors.name}
						</p>
					)}
				</div>

				<div>
					<label htmlFor="regNo" className="block text-sm font-medium mb-1">
						{t.regNo}
					</label>
					<Input
						id="regNo"
						value={form.regNo || ''}
						onChange={(e) => updateField('regNo', e.target.value)}
						placeholder="123-45-67890"
					/>
				</div>

				<div>
					<label htmlFor="website" className="block text-sm font-medium mb-1">
						{t.website}
					</label>
					<Input
						id="website"
						type="url"
						value={form.website || ''}
						onChange={(e) => updateField('website', e.target.value)}
						placeholder="https://acme.com"
						aria-invalid={!!errors.website}
						aria-describedby={errors.website ? 'website-error' : undefined}
					/>
					{errors.website && (
						<p id="website-error" className="mt-1 text-sm text-red-600" role="alert">
							{errors.website}
						</p>
					)}
				</div>

				<div>
					<label htmlFor="industry" className="block text-sm font-medium mb-1">
						{t.industry}
					</label>
					<select
						id="industry"
						value={form.industry || ''}
						onChange={(e) => updateField('industry', e.target.value)}
						className="w-full rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
						aria-invalid={!!errors.industry}
						aria-describedby={errors.industry ? 'industry-error' : undefined}
					>
						<option value="">Select industry</option>
						{(Object.keys(tIndustries) as Industry[]).map((ind) => (
							<option key={ind} value={ind}>
								{tIndustries[ind]}
							</option>
						))}
					</select>
					{errors.industry && (
						<p id="industry-error" className="mt-1 text-sm text-red-600" role="alert">
							{errors.industry}
						</p>
					)}
				</div>

				<div>
					<label className="block text-sm font-medium mb-2">
						{t.size}
					</label>
					<div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
						{(Object.keys(tSizes) as CompanySize[]).map((size) => (
							<label
								key={size}
								className={`cursor-pointer rounded-2xl border px-4 py-2.5 text-center text-sm transition ${
									form.size === size
										? 'border-primary bg-primary/5 font-medium'
										: 'border-neutral-800 hover:border-primary/50'
								}`}
							>
								<input
									type="radio"
									name="size"
									value={size}
									checked={form.size === size}
									onChange={(e) => updateField('size', e.target.value)}
									className="sr-only"
								/>
								{tSizes[size]}
							</label>
						))}
					</div>
					{errors.size && (
						<p className="mt-1 text-sm text-red-600" role="alert">
							{errors.size}
						</p>
					)}
				</div>

				<div className="grid gap-4 sm:grid-cols-2">
					<div>
						<label htmlFor="hqCountry" className="block text-sm font-medium mb-1">
							{t.hqCountry}
						</label>
						<Input
							id="hqCountry"
							value={form.hqCountry || ''}
							onChange={(e) => updateField('hqCountry', e.target.value)}
							placeholder="South Korea"
						/>
					</div>
					<div>
						<label htmlFor="hqCity" className="block text-sm font-medium mb-1">
							{t.hqCity}
						</label>
						<Input
							id="hqCity"
							value={form.hqCity || ''}
							onChange={(e) => updateField('hqCity', e.target.value)}
							placeholder="Seoul"
						/>
					</div>
				</div>

				<div>
					<label htmlFor="emailDomain" className="block text-sm font-medium mb-1">
						{t.emailDomain}
					</label>
					<Input
						id="emailDomain"
						value={form.emailDomain || ''}
						onChange={(e) => updateField('emailDomain', e.target.value)}
						placeholder="acme.com"
						aria-invalid={!!errors.emailDomain}
						aria-describedby={errors.emailDomain ? 'emailDomain-error' : 'emailDomain-help'}
					/>
					<p id="emailDomain-help" className="mt-1 text-xs text-neutral-500">
						{t.emailDomainHelp}
					</p>
					{errors.emailDomain && (
						<p id="emailDomain-error" className="mt-1 text-sm text-red-600" role="alert">
							{errors.emailDomain}
						</p>
					)}
				</div>

				<div className="flex justify-end pt-4">
					<Button type="submit">{onboardingI18n[locale].next}</Button>
				</div>
			</form>
		</Card>
	);
}

