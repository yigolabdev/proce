import { Card } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import type { Connector, IntegrationSettings } from '../_types/integrations.types';
import type { ConnectorInfo } from '../_types/integrations.types';
import { useI18n } from '../../../i18n/I18nProvider';
import { integrationsI18n } from '../_i18n/integrations.i18n';
import { useMemo } from 'react';
import { testConnection } from '../_mocks/integrationsApi';
import { toast } from 'sonner';

interface ConnectorCardProps {
	connector: ConnectorInfo;
	settings?: IntegrationSettings;
	onConfigure: (connector: Connector) => void;
	onDisconnect: (connector: Connector) => void;
}

export default function ConnectorCard({
	connector,
	settings,
	onConfigure,
	onDisconnect,
}: ConnectorCardProps) {
	const { locale } = useI18n();
	const tt = useMemo(() => integrationsI18n[locale], [locale]);

	const status = settings?.status || 'disconnected';
	const isConnected = status === 'connected';

	const handleTest = async () => {
		try {
			const result = await testConnection(connector.id);
			if (result.ok) {
				toast.success(tt.test.success);
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
		}
	};

	const statusColor =
		status === 'connected'
			? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
			: status === 'error'
				? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
				: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400';

	return (
		<Card className="p-6 relative">
			{!connector.isAvailable && (
				<div className="absolute top-3 right-3">
					<span className="inline-block rounded-full bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
						{tt.comingSoon}
					</span>
				</div>
			)}

			<div className="flex items-start gap-4">
				<div className="text-4xl">{connector.logo}</div>
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 mb-1">
						<h3 className="font-semibold text-lg">{connector.name}</h3>
						<span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColor}`}>
							{tt.statuses[status]}
						</span>
					</div>
					<p className="text-sm text-neutral-600 dark:text-neutral-300">{connector.description}</p>
				</div>
			</div>

			<div className="mt-4 flex flex-wrap gap-2">
				<Button
					size="sm"
					variant={isConnected ? 'secondary' : 'primary'}
					onClick={() => onConfigure(connector.id)}
					disabled={!connector.isAvailable}
				>
					{tt.actions.configure}
				</Button>

				{isConnected && (
					<>
						<Button size="sm" variant="outline" onClick={handleTest}>
							{tt.actions.test}
						</Button>
						<Button size="sm" variant="outline" onClick={() => onDisconnect(connector.id)}>
							{tt.actions.disconnect}
						</Button>
					</>
				)}
			</div>
		</Card>
	);
}

