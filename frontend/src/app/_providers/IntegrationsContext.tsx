import type { PropsWithChildren } from 'react';
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { Connector, IntegrationSettings } from '../integrations/_types/integrations.types';
import { loadIntegrations, saveIntegration } from '../integrations/_mocks/integrationsApi';

interface IntegrationsContextValue {
	integrations: Record<string, IntegrationSettings>;
	updateIntegration: (connector: Connector, settings: Partial<IntegrationSettings>) => Promise<void>;
	reload: () => Promise<void>;
	isLoading: boolean;
}

const IntegrationsContext = createContext<IntegrationsContextValue | null>(null);

export function IntegrationsProvider({ children }: PropsWithChildren) {
	const [integrations, setIntegrations] = useState<Record<string, IntegrationSettings>>({});
	const [isLoading, setIsLoading] = useState(true);

	const reload = useCallback(async () => {
		setIsLoading(true);
		try {
			const data = await loadIntegrations();
			setIntegrations(data);
		} catch (error) {
			console.error('Failed to load integrations:', error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const updateIntegration = useCallback(
		async (connector: Connector, settings: Partial<IntegrationSettings>) => {
			await saveIntegration(connector, settings);
			await reload();
		},
		[reload]
	);

	useEffect(() => {
		reload();
	}, [reload]);

	const value = useMemo(
		() => ({ integrations, updateIntegration, reload, isLoading }),
		[integrations, updateIntegration, reload, isLoading]
	);

	return <IntegrationsContext.Provider value={value}>{children}</IntegrationsContext.Provider>;
}

export function useIntegrations() {
	const ctx = useContext(IntegrationsContext);
	if (!ctx) throw new Error('useIntegrations must be used within IntegrationsProvider');
	return ctx;
}

