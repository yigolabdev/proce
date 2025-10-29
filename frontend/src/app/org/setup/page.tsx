import { useState, useEffect } from 'react';
import { useLocale } from '../../../i18n/I18nProvider';
import { settingsI18n } from './_i18n/settings.i18n';
import { WorkspaceSettingsSchema } from './_schemas/settings.schema';
import { getDefaultSettings, loadSettings, saveSettings } from './_mocks/settingsApi';
import type { WorkspaceSettings } from './_types/settings.types';
import Button from '../../../components/ui/Button';
import Toaster from '../../../components/ui/Toaster';
import { toast } from 'sonner';
import Tab1Organization from './_components/Tab1Organization';
import Tab2DeptRole from './_components/Tab2DeptRole';
import Tab3Alias from './_components/Tab3Alias';
import Tab4Locale from './_components/Tab4Locale';
import Tab5Privacy from './_components/Tab5Privacy';
import Tab6Decision from './_components/Tab6Decision';

export default function WorkspaceSetup() {
	const { locale } = useLocale();
	const t = settingsI18n[locale];
	const [activeTab, setActiveTab] = useState(0);
	const [settings, setSettings] = useState<WorkspaceSettings>(getDefaultSettings());
	const [savedSettings, setSavedSettings] = useState<WorkspaceSettings>(getDefaultSettings());
	const [isSaving, setIsSaving] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		loadSettings().then((loaded) => {
			if (loaded) {
				setSettings(loaded);
				setSavedSettings(loaded);
			}
		});
	}, []);

	const hasUnsavedChanges = JSON.stringify(settings) !== JSON.stringify(savedSettings);

	const handleSave = async () => {
		const result = WorkspaceSettingsSchema.safeParse(settings);
		if (!result.success) {
			const fieldErrors: Record<string, string> = {};
			result.error.issues.forEach((err) => {
				if (err.path[0]) fieldErrors[err.path.join('.')] = err.message;
			});
			setErrors(fieldErrors);
			toast.error('검증 오류가 있습니다');
			return;
		}

		setErrors({});
		setIsSaving(true);
		try {
			await saveSettings(settings);
			setSavedSettings(settings);
			toast.success(t.success);
		} catch {
			toast.error(t.error);
		} finally {
			setIsSaving(false);
		}
	};

	const handleReset = () => {
		if (confirm(t.resetConfirm)) {
			const defaults = getDefaultSettings();
			setSettings(defaults);
			setErrors({});
		}
	};

	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (hasUnsavedChanges) {
				e.preventDefault();
				e.returnValue = '';
			}
		};
		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => window.removeEventListener('beforeunload', handleBeforeUnload);
	}, [hasUnsavedChanges]);

	return (
		<div className="mx-auto min-h-dvh w-full max-w-6xl px-4 py-8">
			{/* Header */}
			<div className="sticky top-0 z-10 bg-white dark:bg-neutral-950 pb-4 mb-6 border-b border-neutral-200 dark:border-neutral-800">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold">{t.title}</h1>
						{hasUnsavedChanges && (
							<p className="text-sm text-amber-600 dark:text-amber-400 mt-1">{t.unsavedChanges}</p>
						)}
					</div>
					<div className="flex gap-2">
						<Button variant="secondary" onClick={handleReset} disabled={isSaving}>
							{t.reset}
						</Button>
						<Button onClick={handleSave} disabled={isSaving || !hasUnsavedChanges}>
							{isSaving ? '저장 중...' : t.save}
						</Button>
					</div>
				</div>
			</div>

			{/* Tabs */}
			<div className="mb-6 overflow-x-auto">
				<div className="flex gap-2 border-b border-neutral-200 dark:border-neutral-800">
					{t.tabs.map((tab, index) => (
						<button
							key={index}
							onClick={() => setActiveTab(index)}
							className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition ${
								activeTab === index
									? 'border-primary text-primary'
									: 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
							}`}
						>
							{tab}
						</button>
					))}
				</div>
			</div>

			{/* Tab Content */}
			<div className="pb-8">
				{activeTab === 0 && (
					<Tab1Organization
						data={settings.org}
						onChange={(org) => setSettings({ ...settings, org })}
						errors={errors}
					/>
				)}
				{activeTab === 1 && (
					<Tab2DeptRole
						data={settings.deptRole}
						onChange={(deptRole) => setSettings({ ...settings, deptRole })}
						errors={errors}
					/>
				)}
				{activeTab === 2 && (
					<Tab3Alias
						data={settings.alias}
						onChange={(alias) => setSettings({ ...settings, alias })}
					/>
				)}
				{activeTab === 3 && (
					<Tab4Locale
						data={settings.locale}
						onChange={(locale) => setSettings({ ...settings, locale })}
						errors={errors}
					/>
				)}
				{activeTab === 4 && (
					<Tab5Privacy
						data={settings.privacy}
						onChange={(privacy) => setSettings({ ...settings, privacy })}
					/>
				)}
				{activeTab === 5 && (
					<Tab6Decision
						data={settings.decision}
						onChange={(decision) => setSettings({ ...settings, decision })}
					/>
				)}
			</div>

			<Toaster />
		</div>
	);
}

