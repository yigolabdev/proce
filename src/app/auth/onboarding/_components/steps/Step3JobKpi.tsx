import { useState } from 'react';
import type { JobKpi, DecisionMode } from '../../_types/onboarding.types';
import { JobKpiSchema } from '../../_schemas/onboarding.schema';
import { useLocale } from '../../../../../i18n/I18nProvider';
import { onboardingI18n } from '../../_i18n/onboarding.i18n';
import { JOB_CATEGORY_PRESETS, KPI_PRESETS, OUTPUT_TYPES } from '../../_constants/presets';
import Button from '../../../../../components/ui/Button';
import { Card } from '../../../../../components/ui/Card';
import { X } from 'lucide-react';

interface Step3Props {
	data?: JobKpi;
	industry?: string;
	onNext: (data: JobKpi) => void;
	onBack: () => void;
}

export default function Step3JobKpi({ data, industry, onNext, onBack }: Step3Props) {
	const { locale } = useLocale();
	const t = onboardingI18n[locale].step3;

	const presetJobs = industry ? JOB_CATEGORY_PRESETS[industry as keyof typeof JOB_CATEGORY_PRESETS] || [] : [];
	const presetKpis = industry ? KPI_PRESETS[industry as keyof typeof KPI_PRESETS] || [] : [];

	const [form, setForm] = useState<Partial<JobKpi>>(
		data || {
			jobCategories: [],
			kpis: [],
			outputTypes: [],
			decisionMode: 'hybrid',
		}
	);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [customKpi, setCustomKpi] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const result = JobKpiSchema.safeParse(form);
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

	const toggleItem = (field: 'jobCategories' | 'kpis' | 'outputTypes', item: string) => {
		setForm((prev) => {
			const current = prev[field] || [];
			const next = current.includes(item) ? current.filter((i) => i !== item) : [...current, item];
			return { ...prev, [field]: next };
		});
		if (errors[field]) {
			setErrors((prev) => {
				const next = { ...prev };
				delete next[field];
				return next;
			});
		}
	};

	const addCustomKpi = () => {
		if (customKpi.trim()) {
			setForm((prev) => ({
				...prev,
				kpis: [...(prev.kpis || []), customKpi.trim()],
			}));
			setCustomKpi('');
		}
	};

	const removeKpi = (kpi: string) => {
		setForm((prev) => ({
			...prev,
			kpis: (prev.kpis || []).filter((k) => k !== kpi),
		}));
	};

	return (
		<Card className="p-6">
			<h2 className="text-2xl font-bold">{t.title}</h2>
			<p className="mt-2 text-sm text-neutral-300">{t.subtitle}</p>

			<form onSubmit={handleSubmit} className="mt-6 space-y-6">
				<div>
					<label className="block text-sm font-medium mb-2">
						{t.jobCategories}
					</label>
					<div className="flex flex-wrap gap-2">
						{presetJobs.map((job) => (
							<button
								key={job}
								type="button"
								onClick={() => toggleItem('jobCategories', job)}
								className={`rounded-full px-4 py-1.5 text-sm transition ${
									form.jobCategories?.includes(job)
										? 'bg-primary text-white'
										: 'border border-neutral-800 hover:border-primary'
								}`}
							>
								{job}
							</button>
						))}
					</div>
					{errors.jobCategories && (
						<p className="mt-2 text-sm text-red-600" role="alert">
							{errors.jobCategories}
						</p>
					)}
				</div>

				<div>
					<label className="block text-sm font-medium mb-2">
						{t.kpis}
					</label>
					<p className="text-xs text-neutral-500 mb-2">{t.kpiHelp}</p>
					<div className="flex flex-wrap gap-2 mb-3">
						{presetKpis.map((kpi) => (
							<button
								key={kpi}
								type="button"
								onClick={() => toggleItem('kpis', kpi)}
								className={`rounded-full px-4 py-1.5 text-sm transition ${
									form.kpis?.includes(kpi)
										? 'bg-primary text-white'
										: 'border border-neutral-800 hover:border-primary'
								}`}
							>
								{kpi}
							</button>
						))}
					</div>
					{form.kpis && form.kpis.length > 0 && (
						<div className="flex flex-wrap gap-2 mb-3">
							{form.kpis
								.filter((kpi) => !presetKpis.includes(kpi))
								.map((kpi) => (
									<span
										key={kpi}
										className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm"
									>
										{kpi}
										<button
											type="button"
											onClick={() => removeKpi(kpi)}
											className="hover:text-red-600"
											aria-label={`Remove ${kpi}`}
										>
											<X className="h-3 w-3" />
										</button>
									</span>
								))}
						</div>
					)}
					<div className="flex gap-2">
						<input
							type="text"
							value={customKpi}
							onChange={(e) => setCustomKpi(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									e.preventDefault();
									addCustomKpi();
								}
							}}
							placeholder="Add custom KPI..."
							className="flex-1 rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
						/>
						<Button type="button" variant="secondary" onClick={addCustomKpi}>
							Add
						</Button>
					</div>
					{errors.kpis && (
						<p className="mt-2 text-sm text-red-600" role="alert">
							{errors.kpis}
						</p>
					)}
				</div>

				<div>
					<label className="block text-sm font-medium mb-2">
						{t.outputTypes}
					</label>
					<div className="flex flex-wrap gap-2">
						{OUTPUT_TYPES.map((type) => (
							<button
								key={type}
								type="button"
								onClick={() => toggleItem('outputTypes', type)}
								className={`rounded-full px-4 py-1.5 text-sm transition ${
									form.outputTypes?.includes(type)
										? 'bg-primary text-white'
										: 'border border-neutral-800 hover:border-primary'
								}`}
							>
								{type}
							</button>
						))}
					</div>
					{errors.outputTypes && (
						<p className="mt-2 text-sm text-red-600" role="alert">
							{errors.outputTypes}
						</p>
					)}
				</div>

				<div>
					<label className="block text-sm font-medium mb-2">{t.decisionMode}</label>
					<div className="grid gap-3 sm:grid-cols-3">
						{(['hybrid', 'ai', 'human'] as DecisionMode[]).map((mode) => (
							<label
								key={mode}
								className={`cursor-pointer rounded-2xl border px-4 py-3 text-center transition ${
									form.decisionMode === mode
										? 'border-primary bg-primary/5 font-medium'
										: 'border-neutral-800 hover:border-primary/50'
								}`}
							>
								<input
									type="radio"
									name="decisionMode"
									value={mode}
									checked={form.decisionMode === mode}
									onChange={(e) => setForm((prev) => ({ ...prev, decisionMode: e.target.value as DecisionMode }))}
									className="sr-only"
								/>
								{mode === 'hybrid' && t.decisionModeHybrid}
								{mode === 'ai' && t.decisionModeAi}
								{mode === 'human' && t.decisionModeHuman}
							</label>
						))}
					</div>
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

