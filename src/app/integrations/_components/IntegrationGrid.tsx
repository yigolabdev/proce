import type { Connector } from '../_types/integrations.types';
import { useIntegrations } from '../../_providers/IntegrationsContext';
import { CONNECTOR_INFO } from '../_mocks/integrationsApi';
import ConnectorCard from './ConnectorCard';
import { useI18n } from '../../../i18n/I18nProvider';
import { integrationsI18n } from '../_i18n/integrations.i18n';
import { useMemo } from 'react';
import Button from '../../../components/ui/Button';

interface IntegrationGridProps {
	onConfigure: (connector: Connector) => void;
	onDisconnect: (connector: Connector) => void;
}

export default function IntegrationGrid({ onConfigure, onDisconnect }: IntegrationGridProps) {
	const { integrations } = useIntegrations();
	const { locale } = useI18n();
	const tt = useMemo(() => integrationsI18n[locale], [locale]);

	const connectors = Object.values(CONNECTOR_INFO);
	const hasAnyConnected = Object.values(integrations).some((s) => s.status === 'connected');

	if (!hasAnyConnected && connectors.length > 0) {
		return (
			<div className="max-w-md mx-auto text-center py-12">
				<div className="text-6xl mb-4">🔌</div>
				<h3 className="text-xl font-semibold mb-2">{tt.emptyTitle}</h3>
				<p className="text-neutral-300 mb-6">{tt.emptyDescription}</p>
				<Button onClick={() => onConfigure('slack')}>{tt.emptyAction}</Button>
			</div>
		);
	}

	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{connectors.map((connector) => (
				<ConnectorCard
					key={connector.id}
					connector={connector}
					settings={integrations[connector.id]}
					onConfigure={onConfigure}
					onDisconnect={onDisconnect}
				/>
			))}
		</div>
	);
}

