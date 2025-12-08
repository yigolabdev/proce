import { useState } from 'react';
import Button from '../../../components/ui/Button';
import type { Connector, PreviewItem } from '../_types/integrations.types';
import { testConnection, getPreview } from '../_mocks/integrationsApi';
import { useI18n } from '../../../i18n/I18nProvider';
import { integrationsI18n } from '../_i18n/integrations.i18n';
import { useMemo } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import SyncPreview from './SyncPreview';

interface TestPanelProps {
	connector: Connector;
	windowDays: '30' | '60' | '90';
	piiMask: boolean;
}

export default function TestPanel({ connector, windowDays, piiMask }: TestPanelProps) {
	const { locale } = useI18n();
	const tt = useMemo(() => integrationsI18n[locale], [locale]);

	const [isTesting, setIsTesting] = useState(false);
	const [isLoadingPreview, setIsLoadingPreview] = useState(false);
	const [preview, setPreview] = useState<PreviewItem[]>([]);
	const [dryRun, setDryRun] = useState(true);

	const handleTest = async () => {
		setIsTesting(true);
		try {
			const result = await testConnection(connector);
			if (result.ok) {
				toast.success(tt.test.success);
				// Auto-load preview on success
				handleLoadPreview();
			} else {
				const errorMsg =
					result.error === 'AUTH'
						? tt.test.errorAuth
						: result.error === 'RATE_LIMIT'
							? tt.test.errorRate
							: tt.test.errorNetwork;
				toast.error(errorMsg);
			}
		} catch {
			toast.error(tt.test.errorNetwork);
		} finally {
			setIsTesting(false);
		}
	};

	const handleLoadPreview = async () => {
		setIsLoadingPreview(true);
		try {
			const items = await getPreview(connector, { windowDays });
			setPreview(items);
		} catch {
			toast.error(tt.test.errorNetwork);
		} finally {
			setIsLoadingPreview(false);
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Button onClick={handleTest} disabled={isTesting} size="sm">
						{isTesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						{tt.actions.test}
					</Button>
					<label className="flex items-center gap-2 text-sm">
						<input
							type="checkbox"
							checked={dryRun}
							onChange={(e) => setDryRun(e.target.checked)}
							className="rounded"
						/>
						<span>{tt.test.dryRun}</span>
					</label>
				</div>
			</div>

			<div className="rounded-2xl border border-neutral-800 p-4">
				<h4 className="font-medium mb-3">{tt.test.preview}</h4>
				<SyncPreview items={preview} isLoading={isLoadingPreview} piiMask={piiMask} />
			</div>
		</div>
	);
}

