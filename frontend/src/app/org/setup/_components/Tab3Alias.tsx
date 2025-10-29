import { useLocale } from '../../../../i18n/I18nProvider';
import { settingsI18n } from '../_i18n/settings.i18n';
import type { AliasSettings, AliasFormat } from '../_types/settings.types';
import { Card } from '../../../../components/ui/Card';

interface Tab3Props {
	data: AliasSettings;
	onChange: (data: AliasSettings) => void;
}

export default function Tab3Alias({ data, onChange }: Tab3Props) {
	const { locale } = useLocale();
	const t = settingsI18n[locale].alias;

	const toggleGuardrail = (option: string) => {
		const current = data.guardrails || [];
		const next = current.includes(option)
			? current.filter((g) => g !== option)
			: [...current, option];
		onChange({ ...data, guardrails: next });
	};

	const generatePreviewAlias = () => {
		switch (data.format) {
			case 'alias-numeric':
				return `Alias-${Math.floor(Math.random() * 9000) + 1000}`;
			case 'nova-numeric':
				return `Nova-${Math.floor(Math.random() * 9000) + 1000}`;
			case 'word-word':
				const words = ['Blue', 'Green', 'Swift', 'Calm', 'Bright', 'Silent'];
				const w1 = words[Math.floor(Math.random() * words.length)];
				const w2 = words[Math.floor(Math.random() * words.length)];
				return `${w1}-${w2}`;
			default:
				return 'Alias-1234';
		}
	};

	return (
		<div className="space-y-6">
			<Card className="p-6">
				<div className="space-y-6">
					<div>
						<label className="flex items-center gap-3 cursor-pointer">
							<input
								type="checkbox"
								checked={data.enabled}
								onChange={(e) => onChange({ ...data, enabled: e.target.checked })}
								className="h-5 w-5 rounded border-neutral-300 text-primary focus:ring-2 focus:ring-primary/20"
							/>
							<div>
								<span className="text-sm font-medium">{t.enabled}</span>
								<p className="text-xs text-neutral-500">{t.aliasHelp}</p>
							</div>
						</label>
					</div>

					{data.enabled && (
						<>
							<div>
								<label className="block text-sm font-medium mb-2">{t.format}</label>
								<div className="grid gap-3 sm:grid-cols-3">
									{(['alias-numeric', 'nova-numeric', 'word-word'] as AliasFormat[]).map((format) => (
										<label
											key={format}
											className={`cursor-pointer rounded-2xl border px-4 py-3 text-center transition ${
												data.format === format
													? 'border-primary bg-primary/5 font-medium'
													: 'border-neutral-200 dark:border-neutral-800 hover:border-primary/50'
											}`}
										>
											<input
												type="radio"
												name="format"
												value={format}
												checked={data.format === format}
												onChange={(e) => onChange({ ...data, format: e.target.value as AliasFormat })}
												className="sr-only"
											/>
											{format === 'alias-numeric' && t.formatAliasNumeric}
											{format === 'nova-numeric' && t.formatNovaNumeric}
											{format === 'word-word' && t.formatWordWord}
										</label>
									))}
								</div>
							</div>

							<div>
								<label className="flex items-center gap-3 cursor-pointer">
									<input
										type="checkbox"
										checked={data.maskRealNames}
										onChange={(e) => onChange({ ...data, maskRealNames: e.target.checked })}
										className="h-5 w-5 rounded border-neutral-300 text-primary focus:ring-2 focus:ring-primary/20"
									/>
									<span className="text-sm font-medium">{t.maskRealNames}</span>
								</label>
							</div>

							<div>
								<label className="block text-sm font-medium mb-2">{t.guardrails}</label>
								<div className="space-y-2">
									<label className="flex items-center gap-3 cursor-pointer">
										<input
											type="checkbox"
											checked={data.guardrails?.includes('hide-title')}
											onChange={() => toggleGuardrail('hide-title')}
											className="h-5 w-5 rounded border-neutral-300 text-primary focus:ring-2 focus:ring-primary/20"
										/>
										<span className="text-sm">{t.hideTitle}</span>
									</label>
									<label className="flex items-center gap-3 cursor-pointer">
										<input
											type="checkbox"
											checked={data.guardrails?.includes('neutral-labels')}
											onChange={() => toggleGuardrail('neutral-labels')}
											className="h-5 w-5 rounded border-neutral-300 text-primary focus:ring-2 focus:ring-primary/20"
										/>
										<span className="text-sm">{t.neutralLabels}</span>
									</label>
									<label className="flex items-center gap-3 cursor-pointer">
										<input
											type="checkbox"
											checked={data.guardrails?.includes('hide-confidence')}
											onChange={() => toggleGuardrail('hide-confidence')}
											className="h-5 w-5 rounded border-neutral-300 text-primary focus:ring-2 focus:ring-primary/20"
										/>
										<span className="text-sm">{t.hideConfidence}</span>
									</label>
								</div>
							</div>
						</>
					)}
				</div>
			</Card>

			{data.enabled && (
				<Card className="p-6">
					<h3 className="text-sm font-medium mb-3">{t.preview}</h3>
					<div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-4">
						<div className="space-y-3">
							<div className="flex items-start gap-3">
								<div className="rounded-full bg-primary/10 w-8 h-8 flex items-center justify-center text-xs font-medium">
									{generatePreviewAlias().slice(0, 2)}
								</div>
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-1">
										<span className="font-medium">{generatePreviewAlias()}</span>
										{!data.guardrails?.includes('hide-title') && (
											<span className="text-xs text-neutral-500">· Product Manager</span>
										)}
									</div>
									<p className="text-sm text-neutral-600 dark:text-neutral-300">
										이 제안에 동의합니다. 데이터를 확인했습니다.
									</p>
								</div>
							</div>
						</div>
					</div>
				</Card>
			)}
		</div>
	);
}

