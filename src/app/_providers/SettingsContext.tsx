import { createContext, useContext, useState, useEffect, useCallback, type PropsWithChildren } from 'react';
import type { WorkspaceSettings } from '../org/setup/_types/settings.types';
import { loadSettings, saveSettings as saveSettingsApi, getDefaultSettings } from '../org/setup/_mocks/settingsApi';

interface SettingsContextValue {
	settings: WorkspaceSettings;
	setSettings: (update: Partial<WorkspaceSettings>) => void;
	reload: () => Promise<void>;
	save: () => Promise<void>;
	hasUnsavedChanges: boolean;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: PropsWithChildren) {
	const [settings, setSettingsState] = useState<WorkspaceSettings>(getDefaultSettings());
	const [savedSettings, setSavedSettings] = useState<WorkspaceSettings>(getDefaultSettings());
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

	const reload = useCallback(async () => {
		const loaded = await loadSettings();
		const data = loaded || getDefaultSettings();
		setSettingsState(data);
		setSavedSettings(data);
		setHasUnsavedChanges(false);
	}, []);

	useEffect(() => {
		reload();
	}, [reload]);

	const setSettings = useCallback((update: Partial<WorkspaceSettings>) => {
		setSettingsState((prev) => {
			const next = { ...prev, ...update };
			setHasUnsavedChanges(JSON.stringify(next) !== JSON.stringify(savedSettings));
			return next;
		});
	}, [savedSettings]);

	const save = useCallback(async () => {
		await saveSettingsApi(settings);
		setSavedSettings(settings);
		setHasUnsavedChanges(false);
	}, [settings]);

	return (
		<SettingsContext.Provider value={{ settings, setSettings, reload, save, hasUnsavedChanges }}>
			{children}
		</SettingsContext.Provider>
	);
}

export function useSettings() {
	const ctx = useContext(SettingsContext);
	if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
	return ctx;
}

