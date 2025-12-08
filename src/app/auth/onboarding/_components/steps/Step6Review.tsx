import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { OnboardingData } from '../../_types/onboarding.types';
import { useLocale } from '../../../../../i18n/I18nProvider';
import { onboardingI18n } from '../../_i18n/onboarding.i18n';
import { createWorkspace } from '../../_mocks/onboardingApi';
import Button from '../../../../../components/ui/Button';
import { Card } from '../../../../../components/ui/Card';
import { toast } from 'sonner';
import { CheckCircle2 } from 'lucide-react';

interface Step6Props {
	data: OnboardingData;
	onBack: () => void;
	onEdit: (step: number) => void;
}

export default function Step6Review({ data, onBack, onEdit }: Step6Props) {
	const { locale } = useLocale();
	const t = onboardingI18n[locale].review;
	const tSuccess = onboardingI18n[locale].success;
	const navigate = useNavigate();

	const [termsAccepted, setTermsAccepted] = useState(false);
	const [isCreating, setIsCreating] = useState(false);
	const [success, setSuccess] = useState(false);

	const handleCreate = async () => {
		setIsCreating(true);
		const result = await createWorkspace(data);

		if (result.ok) {
			setSuccess(true);
			toast.success('Workspace created successfully!');
		} else {
			setIsCreating(false);
			if (result.error === 'DUPLICATE_DOMAIN') {
				toast.error('This email domain is already registered');
			} else if (result.error === 'NETWORK') {
				toast.error('Network error. Please try again.');
			} else {
				toast.error('Failed to create workspace');
			}
		}
	};

	if (success) {
		return (
			<Card className="p-8 text-center">
				<div className="mx-auto w-16 h-16 rounded-full bg-green-900/30 flex items-center justify-center mb-4">
					<CheckCircle2 className="h-8 w-8 text-green-400" />
				</div>
				<h2 className="text-2xl font-bold">{tSuccess.title}</h2>
				<p className="mt-2 text-neutral-300">{tSuccess.subtitle}</p>

				<div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-4 text-left">
					<p className="text-sm font-medium mb-2">{tSuccess.nextSteps}</p>
					<ul className="space-y-1 text-sm text-neutral-300">
						<li>• {tSuccess.step1}</li>
						<li>• {tSuccess.step2}</li>
						<li>• {tSuccess.step3}</li>
					</ul>
				</div>

				<Button className="mt-6" onClick={() => navigate('/dashboard')}>
					{tSuccess.cta}
				</Button>
			</Card>
		);
	}

	return (
		<Card className="p-6">
			<h2 className="text-2xl font-bold">{t.title}</h2>
			<p className="mt-2 text-sm text-neutral-300">{t.subtitle}</p>

			<div className="mt-6 space-y-4">
				{/* Company Profile */}
				{data.company && (
					<div className="rounded-2xl border border-neutral-800 p-4">
						<div className="flex items-center justify-between mb-3">
							<h3 className="font-medium">{t.company}</h3>
							<button
								type="button"
								onClick={() => onEdit(0)}
								className="text-sm text-primary hover:underline"
							>
								{onboardingI18n[locale].edit}
							</button>
						</div>
						<dl className="grid gap-2 text-sm">
							<div className="flex justify-between">
								<dt className="text-neutral-400">Name:</dt>
								<dd className="font-medium">{data.company.name}</dd>
							</div>
							<div className="flex justify-between">
								<dt className="text-neutral-400">Industry:</dt>
								<dd className="font-medium">{data.company.industry}</dd>
							</div>
							<div className="flex justify-between">
								<dt className="text-neutral-400">Size:</dt>
								<dd className="font-medium">{data.company.size}</dd>
							</div>
							<div className="flex justify-between">
								<dt className="text-neutral-400">Email Domain:</dt>
								<dd className="font-medium">{data.company.emailDomain}</dd>
							</div>
						</dl>
					</div>
				)}

				{/* Organization */}
				{data.org && (
					<div className="rounded-2xl border border-neutral-800 p-4">
						<div className="flex items-center justify-between mb-3">
							<h3 className="font-medium">{t.org}</h3>
							<button
								type="button"
								onClick={() => onEdit(1)}
								className="text-sm text-primary hover:underline"
							>
								{onboardingI18n[locale].edit}
							</button>
						</div>
						<dl className="grid gap-2 text-sm">
							<div>
								<dt className="text-neutral-400 mb-1">Departments:</dt>
								<dd className="flex flex-wrap gap-1">
									{data.org.departments?.map((dept) => (
										<span
											key={dept}
											className="inline-block rounded-full bg-neutral-800 px-2 py-0.5 text-xs"
										>
											{dept}
										</span>
									))}
								</dd>
							</div>
							<div className="flex justify-between">
								<dt className="text-neutral-400">Role Model:</dt>
								<dd className="font-medium capitalize">{data.org.roleModel}</dd>
							</div>
							<div className="flex justify-between">
								<dt className="text-neutral-400">Alias Policy:</dt>
								<dd className="font-medium">{data.org.aliasPolicy ? 'Enabled' : 'Disabled'}</dd>
							</div>
						</dl>
					</div>
				)}

				{/* Jobs & KPIs */}
				{data.jobkpi && (
					<div className="rounded-2xl border border-neutral-800 p-4">
						<div className="flex items-center justify-between mb-3">
							<h3 className="font-medium">{t.jobkpi}</h3>
							<button
								type="button"
								onClick={() => onEdit(2)}
								className="text-sm text-primary hover:underline"
							>
								{onboardingI18n[locale].edit}
							</button>
						</div>
						<dl className="grid gap-2 text-sm">
							<div>
								<dt className="text-neutral-400 mb-1">Job Categories:</dt>
								<dd className="text-xs">{data.jobkpi.jobCategories?.join(', ') || 'None'}</dd>
							</div>
							<div>
								<dt className="text-neutral-400 mb-1">KPIs:</dt>
								<dd className="text-xs">{data.jobkpi.kpis?.join(', ') || 'None'}</dd>
							</div>
							<div className="flex justify-between">
								<dt className="text-neutral-400">Decision Mode:</dt>
								<dd className="font-medium capitalize">{data.jobkpi.decisionMode}</dd>
							</div>
						</dl>
					</div>
				)}

				{/* Integrations */}
				{data.integrations && (
					<div className="rounded-2xl border border-neutral-800 p-4">
						<div className="flex items-center justify-between mb-3">
							<h3 className="font-medium">{t.integrations}</h3>
							<button
								type="button"
								onClick={() => onEdit(3)}
								className="text-sm text-primary hover:underline"
							>
								{onboardingI18n[locale].edit}
							</button>
						</div>
						<dl className="grid gap-2 text-sm">
							<div>
								<dt className="text-neutral-400 mb-1">Connected:</dt>
								<dd className="flex flex-wrap gap-1">
									{data.integrations.connectors
										?.filter((c) => c.status === 'connected')
										.map((c) => (
											<span
												key={c.provider}
												className="inline-block rounded-full bg-green-900/30 px-2 py-0.5 text-xs text-green-300"
											>
												{c.provider}
											</span>
										))}
									{!data.integrations.connectors?.some((c) => c.status === 'connected') && (
										<span className="text-neutral-500">None</span>
									)}
								</dd>
							</div>
							{data.integrations.importWindowDays && (
								<div className="flex justify-between">
									<dt className="text-neutral-400">Import Window:</dt>
									<dd className="font-medium">{data.integrations.importWindowDays} days</dd>
								</div>
							)}
						</dl>
					</div>
				)}

				{/* Policies */}
				{data.policies && (
					<div className="rounded-2xl border border-neutral-800 p-4">
						<div className="flex items-center justify-between mb-3">
							<h3 className="font-medium">{t.policies}</h3>
							<button
								type="button"
								onClick={() => onEdit(4)}
								className="text-sm text-primary hover:underline"
							>
								{onboardingI18n[locale].edit}
							</button>
						</div>
						<dl className="grid gap-2 text-sm">
							<div className="flex justify-between">
								<dt className="text-neutral-400">Template:</dt>
								<dd className="font-medium capitalize">{data.policies.template}</dd>
							</div>
							<div className="flex justify-between">
								<dt className="text-neutral-400">Require Evidence:</dt>
								<dd className="font-medium">{data.policies.requireEvidence ? 'Yes' : 'No'}</dd>
							</div>
							<div className="flex justify-between">
								<dt className="text-neutral-400">Show Confidence:</dt>
								<dd className="font-medium">{data.policies.showConfidence ? 'Yes' : 'No'}</dd>
							</div>
						</dl>
					</div>
				)}
			</div>

			<div className="mt-6">
				<label className="flex items-start gap-3 cursor-pointer">
					<input
						type="checkbox"
						checked={termsAccepted}
						onChange={(e) => setTermsAccepted(e.target.checked)}
						className="mt-0.5 h-5 w-5 rounded border-neutral-300 text-primary focus:ring-2 focus:ring-primary/20"
					/>
					<span className="text-sm">
						{t.terms}{' '}
						<a href="/terms" className="text-primary hover:underline">
							{t.termsLink}
						</a>{' '}
						and{' '}
						<a href="/privacy" className="text-primary hover:underline">
							{t.privacyLink}
						</a>
					</span>
				</label>
			</div>

			<div className="flex justify-between pt-6">
				<Button type="button" variant="secondary" onClick={onBack} disabled={isCreating}>
					{onboardingI18n[locale].back}
				</Button>
				<Button onClick={handleCreate} disabled={isCreating}>
					{isCreating ? 'Creating...' : onboardingI18n[locale].finish}
				</Button>
			</div>
		</Card>
	);
}

