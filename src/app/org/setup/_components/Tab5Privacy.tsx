import { useLocale } from '../../../../i18n/I18nProvider';
import { settingsI18n } from '../_i18n/settings.i18n';
import type { PrivacySettings, RetentionPeriod, AuditVisibility } from '../_types/settings.types';
import { Card } from '../../../../components/ui/Card';

interface Tab5Props {
	data: PrivacySettings;
	onChange: (data: PrivacySettings) => void;
}

export default function Tab5Privacy({ data, onChange }: Tab5Props) {
	const { locale } = useLocale();
	const t = settingsI18n[locale].privacy;

	return (
		<div className="space-y-6">
			<Card className="p-6">
				<h3 className="text-sm font-medium mb-4">{t.retention}</h3>
				<div className="grid gap-4 sm:grid-cols-2">
					<div>
						<label className="block text-sm mb-2">{t.activityLogs}</label>
						<select
							value={data.retention.activityMonths}
							onChange={(e) =>
								onChange({
									...data,
									retention: { ...data.retention, activityMonths: e.target.value as RetentionPeriod },
								})
							}
							className="w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
						>
							<option value="3">3 {t.months}</option>
							<option value="6">6 {t.months}</option>
							<option value="12">12 {t.months}</option>
							<option value="24">24 {t.months}</option>
						</select>
					</div>

					<div>
						<label className="block text-sm mb-2">{t.attachments}</label>
						<select
							value={data.retention.attachmentMonths}
							onChange={(e) =>
								onChange({
									...data,
									retention: { ...data.retention, attachmentMonths: e.target.value as RetentionPeriod },
								})
							}
							className="w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
						>
							<option value="3">3 {t.months}</option>
							<option value="6">6 {t.months}</option>
							<option value="12">12 {t.months}</option>
							<option value="24">24 {t.months}</option>
						</select>
					</div>
				</div>
			</Card>

			<Card className="p-6">
				<h3 className="text-sm font-medium mb-4">{t.exportControls}</h3>
				<div className="space-y-3">
					<label className="flex items-center gap-3 cursor-pointer">
						<input
							type="checkbox"
							checked={data.exportControls.selfExport}
							onChange={(e) =>
								onChange({
									...data,
									exportControls: { ...data.exportControls, selfExport: e.target.checked },
								})
							}
							className="h-5 w-5 rounded border-neutral-300 text-primary focus:ring-2 focus:ring-primary/20"
						/>
						<span className="text-sm">{t.selfExport}</span>
					</label>

					<label className="flex items-center gap-3 cursor-pointer">
						<input
							type="checkbox"
							checked={data.exportControls.selfDeleteRequest}
							onChange={(e) =>
								onChange({
									...data,
									exportControls: { ...data.exportControls, selfDeleteRequest: e.target.checked },
								})
							}
							className="h-5 w-5 rounded border-neutral-300 text-primary focus:ring-2 focus:ring-primary/20"
						/>
						<span className="text-sm">{t.selfDeleteRequest}</span>
					</label>
				</div>
			</Card>

			<Card className="p-6">
				<h3 className="text-sm font-medium mb-4">{t.pii}</h3>
				<label className="flex items-center gap-3 cursor-pointer mb-3">
					<input
						type="checkbox"
						checked={data.pii.hasPII}
						onChange={(e) =>
							onChange({
								...data,
								pii: { hasPII: e.target.checked },
							})
						}
						className="h-5 w-5 rounded border-neutral-300 text-primary focus:ring-2 focus:ring-primary/20"
					/>
					<span className="text-sm">{t.hasPII}</span>
				</label>
				{data.pii.hasPII && (
					<p className="text-xs text-neutral-500 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-3">
						{t.dlpNote}
					</p>
				)}
			</Card>

			<Card className="p-6">
				<h3 className="text-sm font-medium mb-4">{t.auditVisibility}</h3>
				<div className="grid gap-3 sm:grid-cols-2">
					{(['admin', 'admin-manager'] as AuditVisibility[]).map((visibility) => (
						<label
							key={visibility}
							className={`cursor-pointer rounded-2xl border px-4 py-3 text-center transition ${
								data.auditVisibility === visibility
									? 'border-primary bg-primary/5 font-medium'
									: 'border-neutral-200 dark:border-neutral-800 hover:border-primary/50'
							}`}
						>
							<input
								type="radio"
								name="auditVisibility"
								value={visibility}
								checked={data.auditVisibility === visibility}
								onChange={(e) => onChange({ ...data, auditVisibility: e.target.value as AuditVisibility })}
								className="sr-only"
							/>
							{visibility === 'admin' ? t.adminOnly : t.adminManager}
						</label>
					))}
				</div>
			</Card>
		</div>
	);
}

