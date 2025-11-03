import { useState } from 'react';
import type { Policies, PolicyTemplate } from '../../_types/onboarding.types';
import { PoliciesSchema } from '../../_schemas/onboarding.schema';
import { useLocale } from '../../../../../i18n/I18nProvider';
import { onboardingI18n } from '../../_i18n/onboarding.i18n';
import { POLICY_DSL_EXAMPLE } from '../../_constants/presets';
import Button from '../../../../../components/ui/Button';
import { Card } from '../../../../../components/ui/Card';

interface Step5Props {
	data?: Policies;
	onNext: (data: Policies) => void;
	onBack: () => void;
}

export default function Step5Policies({ data, onNext, onBack }: Step5Props) {
	const { locale } = useLocale();
	const t = onboardingI18n[locale].step5;

	const [form, setForm] = useState<Partial<Policies>>(
		data || {
			template: 'balanced',
			requireEvidence: true,
			showConfidence: true,
			auditLogging: true,
		}
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const result = PoliciesSchema.safeParse(form);
		if (!result.success) {
			return;
		}
		onNext(result.data);
	};

	return (
		<Card className="p-6">
			<h2 className="text-2xl font-bold">{t.title}</h2>
			<p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{t.subtitle}</p>

			<form onSubmit={handleSubmit} className="mt-6 space-y-6">
				<div>
					<label className="block text-sm font-medium mb-2">{t.template}</label>
					<div className="grid gap-3 sm:grid-cols-3">
						{(['conservative', 'balanced', 'progressive'] as PolicyTemplate[]).map((template) => (
							<label
								key={template}
								className={`cursor-pointer rounded-2xl border px-4 py-3 text-center transition ${
									form.template === template
										? 'border-primary bg-primary/5 font-medium'
										: 'border-neutral-200 dark:border-neutral-800 hover:border-primary/50'
								}`}
							>
								<input
									type="radio"
									name="template"
									value={template}
									checked={form.template === template}
									onChange={(e) => setForm((prev) => ({ ...prev, template: e.target.value as PolicyTemplate }))}
									className="sr-only"
								/>
								{template === 'conservative' && t.templateConservative}
								{template === 'balanced' && t.templateBalanced}
								{template === 'progressive' && t.templateProgressive}
							</label>
						))}
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium mb-2">{t.exampleRule}</label>
					<pre className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-4 text-xs overflow-x-auto">
						<code>{POLICY_DSL_EXAMPLE}</code>
					</pre>
				</div>

				<div className="space-y-3">
					<label className="flex items-center gap-3 cursor-pointer">
						<input
							type="checkbox"
							checked={form.requireEvidence || false}
							onChange={(e) => setForm((prev) => ({ ...prev, requireEvidence: e.target.checked }))}
							className="h-5 w-5 rounded border-neutral-300 text-primary focus:ring-2 focus:ring-primary/20"
						/>
						<span className="text-sm font-medium">{t.requireEvidence}</span>
					</label>

					<label className="flex items-center gap-3 cursor-pointer">
						<input
							type="checkbox"
							checked={form.showConfidence || false}
							onChange={(e) => setForm((prev) => ({ ...prev, showConfidence: e.target.checked }))}
							className="h-5 w-5 rounded border-neutral-300 text-primary focus:ring-2 focus:ring-primary/20"
						/>
						<span className="text-sm font-medium">{t.showConfidence}</span>
					</label>

					<label className="flex items-center gap-3 cursor-not-allowed opacity-60">
						<input
							type="checkbox"
							checked={form.auditLogging || false}
							disabled
							className="h-5 w-5 rounded border-neutral-300 text-primary"
						/>
						<span className="text-sm font-medium">{t.auditLogging}</span>
					</label>
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

