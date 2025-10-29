import { useState, useEffect, useMemo } from 'react';
import Sheet from '../../../components/ui/Sheet';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Separator from '../../../components/ui/Separator';
import type { Connector, IntegrationSettings } from '../_types/integrations.types';
import { CONNECTOR_INFO, oauthStart, oauthCallback, disconnect, getDefaultSettings } from '../_mocks/integrationsApi';
import { useIntegrations } from '../../_providers/IntegrationsContext';
import { useI18n } from '../../../i18n/I18nProvider';
import { integrationsI18n } from '../_i18n/integrations.i18n';
import { toast } from 'sonner';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko, enUS } from 'date-fns/locale';
import ScopeList from './ScopeList';
import MappingEditor from './MappingEditor';
import TestPanel from './TestPanel';
import { Dialog, DialogContent } from '../../../components/ui/Dialog';

interface ConnectorDetailsProps {
	connector: Connector | null;
	onClose: () => void;
}

export default function ConnectorDetails({ connector, onClose }: ConnectorDetailsProps) {
	const { integrations, updateIntegration } = useIntegrations();
	const { locale } = useI18n();
	const tt = useMemo(() => integrationsI18n[locale], [locale]);

	const [settings, setSettings] = useState<IntegrationSettings | null>(null);
	const [isConnecting, setIsConnecting] = useState(false);
	const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);

	const connectorInfo = connector ? CONNECTOR_INFO[connector] : null;
	const dateLocale = locale === 'ko' ? ko : enUS;

	useEffect(() => {
		if (connector) {
			const existing = integrations[connector];
			setSettings(existing || getDefaultSettings(connector));
			setHasChanges(false);
		}
	}, [connector, integrations]);

	const handleConnect = async () => {
		if (!connector) return;
		setIsConnecting(true);
		try {
			const startResult = await oauthStart(connector);
			if (startResult.ok) {
				// Simulate OAuth flow
				const callbackResult = await oauthCallback(connector, 'mock_code');
				if (callbackResult.ok) {
					await updateIntegration(connector, {
						...settings!,
						status: 'connected',
						token: callbackResult.token,
						connectedAt: new Date().toISOString(),
					});
					toast.success(`${connectorInfo?.name} connected successfully`);
				} else {
					toast.error(callbackResult.error === 'OAUTH_DENIED' ? 'OAuth denied' : 'Network error');
				}
			}
		} catch {
			toast.error('Connection failed');
		} finally {
			setIsConnecting(false);
		}
	};

	const handleDisconnect = async () => {
		if (!connector) return;
		try {
			await disconnect(connector);
			await updateIntegration(connector, { ...settings!, status: 'disconnected' });
			toast.success(`${connectorInfo?.name} disconnected`);
			setShowDisconnectDialog(false);
		} catch {
			toast.error('Disconnect failed');
		}
	};

	const handleSave = async () => {
		if (!connector || !settings) return;
		setIsSaving(true);
		try {
			await updateIntegration(connector, settings);
			toast.success(`Settings saved at ${new Date().toLocaleTimeString()}`);
			setHasChanges(false);
		} catch {
			toast.error('Failed to save settings');
		} finally {
			setIsSaving(false);
		}
	};

	const updateSettings = (partial: Partial<IntegrationSettings>) => {
		setSettings((prev) => (prev ? { ...prev, ...partial } : null));
		setHasChanges(true);
	};

	if (!connector || !connectorInfo || !settings) return null;

	const isConnected = settings.status === 'connected';

	return (
		<>
			<Sheet open={!!connector} onClose={onClose} title={connectorInfo.name} description={connectorInfo.description}>
				<div className="space-y-6">
					{/* Section 1: Overview */}
					<section>
						<h3 className="font-semibold mb-3">{tt.sections.overview}</h3>
						<div className="space-y-4">
							<div>
								<h4 className="text-sm font-medium mb-2">{tt.overview.requiredScopes}</h4>
								<ScopeList scopes={connectorInfo.scopes} />
							</div>
							<div>
								<h4 className="text-sm font-medium mb-2">{tt.overview.dataCollected}</h4>
								<ul className="list-disc list-inside text-sm text-neutral-600 dark:text-neutral-300 space-y-1">
									{connectorInfo.dataCollected.map((item) => (
										<li key={item}>{item}</li>
									))}
								</ul>
							</div>
							<div>
								<h4 className="text-sm font-medium mb-2">{tt.overview.usedFor}</h4>
								<ul className="list-disc list-inside text-sm text-neutral-600 dark:text-neutral-300 space-y-1">
									{connectorInfo.usedFor.map((item) => (
										<li key={item}>{item}</li>
									))}
								</ul>
							</div>
						</div>
					</section>

					<Separator />

					{/* Section 2: Connection */}
					<section>
						<h3 className="font-semibold mb-3">{tt.sections.connection}</h3>
						<div className="space-y-4">
							<div className="flex items-center gap-3">
								<span className="text-sm font-medium">{tt.connection.status}:</span>
								{isConnected ? (
									<div className="flex items-center gap-2 text-green-600 dark:text-green-400">
										<CheckCircle2 size={16} />
										<span className="text-sm">{tt.statuses.connected}</span>
									</div>
								) : (
									<span className="text-sm text-neutral-600 dark:text-neutral-400">{tt.statuses.disconnected}</span>
								)}
							</div>
							{settings.lastTested && (
								<div className="text-sm text-neutral-600 dark:text-neutral-300">
									{tt.connection.lastTested}:{' '}
									{formatDistanceToNow(new Date(settings.lastTested), { addSuffix: true, locale: dateLocale })}
								</div>
							)}
							<div className="flex flex-wrap gap-2">
								{!isConnected ? (
									<Button onClick={handleConnect} disabled={isConnecting} size="sm">
										{isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
										{tt.actions.connect}
									</Button>
								) : (
									<>
										<Button onClick={handleConnect} disabled={isConnecting} size="sm" variant="secondary">
											{isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
											{tt.actions.reauth}
										</Button>
										<Button onClick={() => setShowDisconnectDialog(true)} size="sm" variant="outline">
											{tt.actions.disconnect}
										</Button>
									</>
								)}
							</div>
						</div>
					</section>

					<Separator />

					{/* Section 3: Sync Settings */}
					<section>
						<h3 className="font-semibold mb-3">{tt.sections.sync}</h3>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium mb-2">
									{tt.sync.importWindow} ({tt.sync.days})
								</label>
								<select
									value={settings.windowDays}
									onChange={(e) => updateSettings({ windowDays: e.target.value as '30' | '60' | '90' })}
									className="w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-2 text-sm"
								>
									<option value="30">30 {tt.sync.days}</option>
									<option value="60">60 {tt.sync.days}</option>
									<option value="90">90 {tt.sync.days}</option>
								</select>
							</div>

							<div>
								<label className="flex items-center gap-2 text-sm">
									<input
										type="checkbox"
										checked={settings.autoSync}
										onChange={(e) => updateSettings({ autoSync: e.target.checked })}
										className="rounded"
									/>
									<span className="font-medium">{tt.sync.autoSync}</span>
								</label>
								<p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">{tt.sync.autoSyncDesc}</p>
							</div>

							{settings.autoSync && (
								<div>
									<label className="block text-sm font-medium mb-2">{tt.sync.frequency}</label>
									<select
										value={settings.frequency || '1h'}
										onChange={(e) => updateSettings({ frequency: e.target.value as any })}
										className="w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-2 text-sm"
									>
										<option value="15m">15 minutes</option>
										<option value="1h">1 hour</option>
										<option value="6h">6 hours</option>
										<option value="24h">24 hours</option>
									</select>
								</div>
							)}

							<div>
								<h4 className="text-sm font-medium mb-2">{tt.sync.dataFilters}</h4>
								{connector === 'slack' && 'channels' in settings && (
									<div className="space-y-2">
										<Input
											placeholder={tt.slack.channelsDesc}
											value={(settings.channels || []).join(', ')}
											onChange={(e) =>
												updateSettings({
													channels: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
												})
											}
										/>
										<label className="flex items-center gap-2 text-sm">
											<input
												type="checkbox"
												checked={settings.includePrivate}
												onChange={(e) => updateSettings({ includePrivate: e.target.checked })}
												className="rounded"
											/>
											<span>{tt.slack.includePrivate}</span>
										</label>
									</div>
								)}
								{connector === 'notion' && 'databases' in settings && (
									<div className="space-y-2">
										<Input
											placeholder={tt.notion.databasesDesc}
											value={(settings.databases || []).join(', ')}
											onChange={(e) =>
												updateSettings({
													databases: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
												})
											}
										/>
										<label className="flex items-center gap-2 text-sm">
											<input
												type="checkbox"
												checked={settings.includeComments}
												onChange={(e) => updateSettings({ includeComments: e.target.checked })}
												className="rounded"
											/>
											<span>{tt.notion.includeComments}</span>
										</label>
									</div>
								)}
								{connector === 'jira' && 'projects' in settings && (
									<div className="space-y-2">
										<Input
											placeholder={tt.jira.projectsDesc}
											value={(settings.projects || []).join(', ')}
											onChange={(e) =>
												updateSettings({
													projects: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
												})
											}
										/>
									</div>
								)}
								{connector === 'gdrive' && 'folders' in settings && (
									<div className="space-y-2">
										<Input
											placeholder={tt.drive.foldersDesc}
											value={(settings.folders || []).join(', ')}
											onChange={(e) =>
												updateSettings({
													folders: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
												})
											}
										/>
									</div>
								)}
							</div>

							<div>
								<label className="flex items-center gap-2 text-sm">
									<input
										type="checkbox"
										checked={settings.piiMask}
										onChange={(e) => updateSettings({ piiMask: e.target.checked })}
										className="rounded"
									/>
									<span>{tt.sync.piiMask}</span>
								</label>
							</div>
						</div>
					</section>

					<Separator />

					{/* Section 4: Entity Mapping */}
					<section>
						<h3 className="font-semibold mb-3">{tt.sections.mapping}</h3>
						<MappingEditor mappings={settings.mapping} onChange={(mapping) => updateSettings({ mapping })} />
					</section>

					<Separator />

					{/* Section 5: Test & Preview */}
					{isConnected && (
						<section>
							<h3 className="font-semibold mb-3">{tt.sections.test}</h3>
							<TestPanel connector={connector} windowDays={settings.windowDays} piiMask={settings.piiMask} />
						</section>
					)}

					{/* Save Button */}
					<div className="sticky bottom-0 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 -mx-6 px-6 py-4 flex gap-2">
						<Button onClick={handleSave} disabled={!hasChanges || isSaving} className="flex-1">
							{isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							{tt.actions.save}
						</Button>
						<Button onClick={onClose} variant="outline">
							{tt.actions.close}
						</Button>
					</div>
				</div>
			</Sheet>

			{/* Disconnect Confirmation Dialog */}
			<Dialog open={showDisconnectDialog} onOpenChange={setShowDisconnectDialog}>
				<DialogContent>
					<h3 className="text-lg font-semibold mb-2">{tt.connection.confirmDisconnect}</h3>
					<p className="text-sm text-neutral-600 dark:text-neutral-300 mb-6">{tt.connection.confirmDisconnectDesc}</p>
					<div className="flex gap-2">
						<Button onClick={handleDisconnect} variant="primary" className="flex-1">
							{tt.actions.disconnect}
						</Button>
						<Button onClick={() => setShowDisconnectDialog(false)} variant="outline" className="flex-1">
							{tt.actions.cancel}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}

