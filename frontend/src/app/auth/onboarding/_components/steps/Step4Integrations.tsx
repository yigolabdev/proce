import { useState } from 'react';
import type { Integrations, IntegrationProvider, IntegrationConnector, ImportWindow } from '../../_types/onboarding.types';
import { IntegrationsSchema } from '../../_schemas/onboarding.schema';
import { useLocale } from '../../../../../i18n/I18nProvider';
import { onboardingI18n } from '../../_i18n/onboarding.i18n';
import { connectIntegration } from '../../_mocks/onboardingApi';
import Button from '../../../../../components/ui/Button';
import { Card } from '../../../../../components/ui/Card';
import { toast } from 'sonner';

interface Step4Props {
	data?: Integrations;
	onNext: (data: Integrations) => void;
	onBack: () => void;
	onSkip: () => void;
}

const PROVIDERS: { id: IntegrationProvider; name: string; icon: string }[] = [
	{ id: 'slack', name: 'Slack', icon: '💬' },
	{ id: 'notion', name: 'Notion', icon: '📝' },
	{ id: 'jira', name: 'Jira', icon: '🎯' },
	{ id: 'gdrive', name: 'Google Drive', icon: '📁' },
];

export default function Step4Integrations({ data, onNext, onBack, onSkip }: Step4Props) {
	const { locale } = useLocale();
	const t = onboardingI18n[locale].step4;

	const [form, setForm] = useState<Partial<Integrations>>(
		data || {
			connectors: PROVIDERS.map((p) => ({ provider: p.id, status: 'idle' as const })),
			importWindowDays: '30',
			consent: false,
		}
	);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const result = IntegrationsSchema.safeParse(form);
		if (!result.success) {
			const fieldErrors: Record<string, string> = {};
			result.error.issues.forEach((err) => {
				if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
			});
			setErrors(fieldErrors);
			return;
		}
		setErrors({});
		onNext(result.data || { consent: true });
	};

	const handleConnect = async (provider: IntegrationProvider) => {
		setForm((prev) => ({
			...prev,
			connectors: (prev.connectors || []).map((c) =>
				c.provider === provider ? { ...c, status: 'connecting' as const } : c
			),
		}));

		const result = await connectIntegration(provider);

		if (result.ok) {
			setForm((prev) => ({
				...prev,
				connectors: (prev.connectors || []).map((c) =>
					c.provider === provider ? { ...c, status: 'connected' as const } : c
				),
			}));
			toast.success(`${provider} connected successfully`);
		} else {
			setForm((prev) => ({
				...prev,
				connectors: (prev.connectors || []).map((c) =>
					c.provider === provider ? { ...c, status: 'error' as const } : c
				),
			}));
			toast.error(`Failed to connect ${provider}`);
		}
	};

	const handleDisconnect = (provider: IntegrationProvider) => {
		setForm((prev) => ({
			...prev,
			connectors: (prev.connectors || []).map((c) =>
				c.provider === provider ? { ...c, status: 'idle' as const } : c
			),
		}));
		toast.info(`${provider} disconnected`);
	};

	const getConnector = (provider: IntegrationProvider): IntegrationConnector | undefined => {
		return form.connectors?.find((c) => c.provider === provider);
	};

	return (
		<Card className="p-6">
			<h2 className="text-2xl font-bold">{t.title}</h2>
			<p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{t.subtitle}</p>

			<form onSubmit={handleSubmit} className="mt-6 space-y-6">
				<div>
					<label className="block text-sm font-medium mb-3">{t.connectors}</label>
					<div className="grid gap-3 sm:grid-cols-2">
						{PROVIDERS.map((provider) => {
							const connector = getConnector(provider.id);
							const status = connector?.status || 'idle';
							return (
								<div
									key={provider.id}
									className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 flex items-center justify-between"
								>
									<div className="flex items-center gap-3">
										<span className="text-2xl">{provider.icon}</span>
										<div>
											<p className="font-medium">{provider.name}</p>
											{status === 'connected' && (
												<span className="inline-block mt-1 rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs text-green-700 dark:text-green-300">
													{t.connected}
												</span>
											)}
											{status === 'error' && (
												<span className="inline-block mt-1 rounded-full bg-red-100 dark:bg-red-900/30 px-2 py-0.5 text-xs text-red-700 dark:text-red-300">
													{t.error}
												</span>
											)}
										</div>
									</div>
									<div>
										{status === 'idle' && (
											<Button type="button" size="sm" onClick={() => handleConnect(provider.id)}>
												{t.connect}
											</Button>
										)}
										{status === 'connecting' && (
											<Button type="button" size="sm" disabled>
												{t.connecting}
											</Button>
										)}
										{status === 'connected' && (
											<Button
												type="button"
												size="sm"
												variant="secondary"
												onClick={() => handleDisconnect(provider.id)}
											>
												{t.disconnect}
											</Button>
										)}
										{status === 'error' && (
											<Button type="button" size="sm" onClick={() => handleConnect(provider.id)}>
												Retry
											</Button>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium mb-2">{t.importWindow}</label>
					<div className="grid grid-cols-3 gap-3">
						{(['30', '60', '90'] as ImportWindow[]).map((days) => (
							<label
								key={days}
								className={`cursor-pointer rounded-2xl border px-4 py-3 text-center transition ${
									form.importWindowDays === days
										? 'border-primary bg-primary/5 font-medium'
										: 'border-neutral-200 dark:border-neutral-800 hover:border-primary/50'
								}`}
							>
								<input
									type="radio"
									name="importWindowDays"
									value={days}
									checked={form.importWindowDays === days}
									onChange={(e) => setForm((prev) => ({ ...prev, importWindowDays: e.target.value as ImportWindow }))}
									className="sr-only"
								/>
								{t.importWindowLabel} {days} {t.days}
							</label>
						))}
					</div>
				</div>

				<div>
					<label className="flex items-start gap-3 cursor-pointer">
						<input
							type="checkbox"
							checked={form.consent || false}
							onChange={(e) => {
								setForm((prev) => ({ ...prev, consent: e.target.checked }));
								if (errors.consent) {
									setErrors((prev) => {
										const next = { ...prev };
										delete next.consent;
										return next;
									});
								}
							}}
							className="mt-0.5 h-5 w-5 rounded border-neutral-300 text-primary focus:ring-2 focus:ring-primary/20"
							aria-invalid={!!errors.consent}
							aria-describedby={errors.consent ? 'consent-error' : undefined}
						/>
						<span className="text-sm">{t.consent}</span>
					</label>
					{errors.consent && (
						<p id="consent-error" className="mt-2 text-sm text-red-600" role="alert">
							{errors.consent}
						</p>
					)}
				</div>

				<div className="flex justify-between pt-4">
					<Button type="button" variant="secondary" onClick={onBack}>
						{onboardingI18n[locale].back}
					</Button>
					<div className="flex gap-2">
						<Button type="button" variant="secondary" onClick={onSkip}>
							{onboardingI18n[locale].skip}
						</Button>
						<Button type="submit">{onboardingI18n[locale].next}</Button>
					</div>
				</div>
			</form>
		</Card>
	);
}

