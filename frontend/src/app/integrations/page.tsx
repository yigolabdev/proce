import { useState } from 'react';
import type { Connector } from './_types/integrations.types';
import { useI18n } from '../../i18n/I18nProvider';
import { integrationsI18n } from './_i18n/integrations.i18n';
import { useMemo } from 'react';
import IntegrationGrid from './_components/IntegrationGrid';
import ConnectorDetails from './_components/ConnectorDetails';
import Toaster from '../../components/ui/Toaster';
import { Dialog, DialogContent } from '../../components/ui/Dialog';
import Button from '../../components/ui/Button';
import { disconnect } from './_mocks/integrationsApi';
import { useIntegrations } from '../_providers/IntegrationsContext';
import { toast } from 'sonner';

export default function IntegrationsPage() {
	const { locale } = useI18n();
	const tt = useMemo(() => integrationsI18n[locale], [locale]);
	const { reload } = useIntegrations();

	const [selectedConnector, setSelectedConnector] = useState<Connector | null>(null);
	const [disconnectingConnector, setDisconnectingConnector] = useState<Connector | null>(null);

	const handleDisconnect = async (connector: Connector) => {
		setDisconnectingConnector(connector);
	};

	const confirmDisconnect = async () => {
		if (!disconnectingConnector) return;
		try {
			await disconnect(disconnectingConnector);
			await reload();
			toast.success(`Disconnected successfully`);
			setDisconnectingConnector(null);
		} catch {
			toast.error('Failed to disconnect');
		}
	};

	return (
		<div className="mx-auto w-full max-w-7xl px-4 py-8">
			<header className="mb-8">
				<h1 className="text-3xl font-bold">{tt.title}</h1>
				<p className="mt-2 text-neutral-600 dark:text-neutral-300">{tt.subtitle}</p>
			</header>

			<IntegrationGrid onConfigure={setSelectedConnector} onDisconnect={handleDisconnect} />

			<ConnectorDetails connector={selectedConnector} onClose={() => setSelectedConnector(null)} />

			{/* Disconnect Confirmation Dialog */}
			<Dialog open={!!disconnectingConnector} onOpenChange={(open) => !open && setDisconnectingConnector(null)}>
				<DialogContent>
					<h3 className="text-lg font-semibold mb-2">{tt.connection.confirmDisconnect}</h3>
					<p className="text-sm text-neutral-600 dark:text-neutral-300 mb-6">{tt.connection.confirmDisconnectDesc}</p>
					<div className="flex gap-2">
						<Button onClick={confirmDisconnect} variant="primary" className="flex-1">
							{tt.actions.disconnect}
						</Button>
						<Button onClick={() => setDisconnectingConnector(null)} variant="outline" className="flex-1">
							{tt.actions.cancel}
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			<Toaster />
		</div>
	);
}

