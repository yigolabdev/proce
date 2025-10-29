import { useLocale } from '../../../../i18n/I18nProvider';
import { settingsI18n } from '../_i18n/settings.i18n';
import type { DecisionDefaultsSettings, DecisionMode, EscalationWindow } from '../_types/settings.types';
import { Card } from '../../../../components/ui/Card';

interface Tab6Props {
	data: DecisionDefaultsSettings;
	onChange: (data: DecisionDefaultsSettings) => void;
}

const POLICY_PREVIEW = `rule: auto_approve_low_risk
when:
  kpi.impact <= 'low'
  risk.score < 0.2
then:
  decision: 'approve'
  escalate_if: 'missing_evidence'
explain: true`;

export default function Tab6Decision({ data, onChange }: Tab6Props) {
	const { locale } = useLocale();
	const t = settingsI18n[locale].decision;

	return (
		<div className="space-y-6">
			<Card className="p-6">
				<div className="space-y-6">
					<div>
						<label className="block text-sm font-medium mb-2">{t.mode}</label>
						<div className="grid gap-3 sm:grid-cols-3">
							{(['hybrid', 'ai', 'human'] as DecisionMode[]).map((mode) => (
								<label
									key={mode}
									className={`cursor-pointer rounded-2xl border px-4 py-3 text-center transition ${
										data.mode === mode
											? 'border-primary bg-primary/5 font-medium'
											: 'border-neutral-200 dark:border-neutral-800 hover:border-primary/50'
									}`}
								>
									<input
										type="radio"
										name="mode"
										value={mode}
										checked={data.mode === mode}
										onChange={(e) => onChange({ ...data, mode: e.target.value as DecisionMode })}
										className="sr-only"
									/>
									{mode === 'hybrid' && t.modeHybrid}
									{mode === 'ai' && t.modeAi}
									{mode === 'human' && t.modeHuman}
								</label>
							))}
						</div>
					</div>

					<div className="space-y-3">
						<label className="flex items-center gap-3 cursor-pointer">
							<input
								type="checkbox"
								checked={data.requireEvidence}
								onChange={(e) => onChange({ ...data, requireEvidence: e.target.checked })}
								className="h-5 w-5 rounded border-neutral-300 text-primary focus:ring-2 focus:ring-primary/20"
							/>
							<span className="text-sm font-medium">{t.requireEvidence}</span>
						</label>

						<label className="flex items-center gap-3 cursor-pointer">
							<input
								type="checkbox"
								checked={data.showConfidence}
								onChange={(e) => onChange({ ...data, showConfidence: e.target.checked })}
								className="h-5 w-5 rounded border-neutral-300 text-primary focus:ring-2 focus:ring-primary/20"
							/>
							<span className="text-sm font-medium">{t.showConfidence}</span>
						</label>

						<label className="flex items-center gap-3 cursor-pointer">
							<input
								type="checkbox"
								checked={data.autoApproveLowRisk}
								onChange={(e) => onChange({ ...data, autoApproveLowRisk: e.target.checked })}
								className="h-5 w-5 rounded border-neutral-300 text-primary focus:ring-2 focus:ring-primary/20"
							/>
							<span className="text-sm font-medium">{t.autoApproveLowRisk}</span>
						</label>
					</div>

					<div>
						<label className="block text-sm font-medium mb-2">{t.escalationWindow}</label>
						<select
							value={data.escalationWindow}
							onChange={(e) => onChange({ ...data, escalationWindow: e.target.value as EscalationWindow })}
							className="w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
						>
							<option value="4h">4시간</option>
							<option value="8h">8시간</option>
							<option value="24h">24시간</option>
						</select>
					</div>
				</div>
			</Card>

			<Card className="p-6">
				<h3 className="text-sm font-medium mb-3">{t.policyPreview}</h3>
				<pre className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-4 text-xs overflow-x-auto">
					<code>{POLICY_PREVIEW}</code>
				</pre>
			</Card>
		</div>
	);
}

