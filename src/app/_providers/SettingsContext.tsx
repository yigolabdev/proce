import { createContext, useContext, useState, useEffect, useCallback, type PropsWithChildren } from 'react';
import type { WorkspaceSettings } from '../../types/common.types';
import { STORAGE_KEYS } from '../../types/common.types';
import { storage } from '../../utils/safeStorage';

interface SettingsContextValue {
	settings: WorkspaceSettings;
	setSettings: (update: Partial<WorkspaceSettings>) => void;
	reload: () => Promise<void>;
	save: () => Promise<void>;
	hasUnsavedChanges: boolean;
}

// Default workspace settings
const getDefaultSettings = (): WorkspaceSettings => ({
	language: 'en',
	timezone: 'UTC',
	workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
	workingHours: {
		start: '09:00',
		end: '18:00',
	},
	holidays: [],
	quietHours: {
		enabled: false,
		start: '19:00',
		end: '09:00',
	},
	decisionMode: 'flexible',
	requireEvidence: false,
	showAIConfidence: true,
	autoApprovalForLowRisk: false,
	escalationWindow: 48,
});

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: PropsWithChildren) {
	const [settings, setSettingsState] = useState<WorkspaceSettings>(getDefaultSettings());
	const [savedSettings, setSavedSettings] = useState<WorkspaceSettings>(getDefaultSettings());
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

	const reload = useCallback(async () => {
		try {
			const loaded = storage.get(STORAGE_KEYS.WORKSPACE_SETTINGS);
			const data = loaded || getDefaultSettings();
			setSettingsState(data);
			setSavedSettings(data);
			setHasUnsavedChanges(false);
		} catch (error) {
			console.error('Failed to load settings:', error);
			const data = getDefaultSettings();
			setSettingsState(data);
			setSavedSettings(data);
		}
	}, []);

	useEffect(() => {
		reload();
	}, [reload]);

	const setSettings = useCallback((update: Partial<WorkspaceSettings>) => {
		setSettingsState((prev: WorkspaceSettings) => {
			const next = { ...prev, ...update };
			setHasUnsavedChanges(JSON.stringify(next) !== JSON.stringify(savedSettings));
			return next;
		});
	}, [savedSettings]);

	const save = useCallback(async () => {
		try {
			storage.set(STORAGE_KEYS.WORKSPACE_SETTINGS, settings, true);
			setSavedSettings(settings);
			setHasUnsavedChanges(false);
		} catch (error) {
			console.error('Failed to save settings:', error);
			throw error;
		}
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

