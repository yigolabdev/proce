import { useState, useEffect } from 'react'
import { useLocale } from '../../../i18n/I18nProvider'
import { settingsI18n } from './_i18n/settings.i18n'
import { WorkspaceSettingsSchema } from './_schemas/settings.schema'
import { getDefaultSettings, loadSettings, saveSettings } from './_mocks/settingsApi'
import type { WorkspaceSettings } from './_types/settings.types'
import { Button } from '../../../components/ui/Button'
import { Card, CardContent, CardHeader } from '../../../components/ui/Card'
import Toaster from '../../../components/ui/Toaster'
import { toast } from 'sonner'
import { 
	Building2, 
	Save, 
	RefreshCw, 
	CheckCircle2, 
	AlertCircle,
	Settings,
	Users,
	Tag,
	Globe,
	Shield,
	GitBranch
} from 'lucide-react'
import Tab1Organization from './_components/Tab1Organization'
import Tab2DeptRole from './_components/Tab2DeptRole'
import Tab3Alias from './_components/Tab3Alias'
import Tab4Locale from './_components/Tab4Locale'
import Tab5Privacy from './_components/Tab5Privacy'
import Tab6Decision from './_components/Tab6Decision'

export default function WorkspaceSetup() {
	const { locale } = useLocale()
	const t = settingsI18n[locale]
	const [activeTab, setActiveTab] = useState(0)
	const [settings, setSettings] = useState<WorkspaceSettings>(getDefaultSettings())
	const [savedSettings, setSavedSettings] = useState<WorkspaceSettings>(getDefaultSettings())
	const [isSaving, setIsSaving] = useState(false)
	const [errors, setErrors] = useState<Record<string, string>>({})

	useEffect(() => {
		loadSettings().then((loaded) => {
			if (loaded) {
				setSettings(loaded)
				setSavedSettings(loaded)
			}
		})
	}, [])

	const hasUnsavedChanges = JSON.stringify(settings) !== JSON.stringify(savedSettings)

	const handleSave = async () => {
		const result = WorkspaceSettingsSchema.safeParse(settings)
		if (!result.success) {
			const fieldErrors: Record<string, string> = {}
			result.error.issues.forEach((err) => {
				if (err.path[0]) fieldErrors[err.path.join('.')] = err.message
			})
			setErrors(fieldErrors)
			toast.error('Validation errors detected')
			return
		}

		setErrors({})
		setIsSaving(true)
		try {
			await saveSettings(settings)
			setSavedSettings(settings)
			toast.success(t.success)
		} catch {
			toast.error(t.error)
		} finally {
			setIsSaving(false)
		}
	}

	const handleReset = () => {
		if (confirm(t.resetConfirm)) {
			const defaults = getDefaultSettings()
			setSettings(defaults)
			setErrors({})
		}
	}

	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (hasUnsavedChanges) {
				e.preventDefault()
				e.returnValue = ''
			}
		}
		window.addEventListener('beforeunload', handleBeforeUnload)
		return () => window.removeEventListener('beforeunload', handleBeforeUnload)
	}, [hasUnsavedChanges])

	// Tab configuration with icons
	const tabs = [
		{ label: t.tabs[0], icon: Building2 },
		{ label: t.tabs[1], icon: Users },
		{ label: t.tabs[2], icon: Tag },
		{ label: t.tabs[3], icon: Globe },
		{ label: t.tabs[4], icon: Shield },
		{ label: t.tabs[5], icon: GitBranch },
	]

	// Calculate completion status
	const getCompletionStatus = () => {
		const checks = [
			settings.org.workspaceName.trim() !== '',
			Boolean(settings.org.industry),
			settings.deptRole.departments.length > 0,
			Boolean(settings.locale.language),
		]
		const completed = checks.filter(Boolean).length
		const total = checks.length
		return { completed, total, percentage: Math.round((completed / total) * 100) }
	}

	const completion = getCompletionStatus()

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between flex-wrap gap-4">
				<div className="flex-1 min-w-[300px]">
					<div className="flex items-center gap-3 mb-2">
						<Settings className="h-8 w-8 text-primary" />
						<h1 className="text-3xl font-bold">{t.title}</h1>
					</div>
					<p className="text-sm text-neutral-600 dark:text-neutral-400">
						Configure your workspace settings, departments, and organizational structure
					</p>

					{/* Completion Status */}
					<div className="mt-4 space-y-2">
						<div className="flex items-center justify-between text-xs">
							<span className="text-neutral-600 dark:text-neutral-400">
								Setup Progress: <span className="font-bold text-primary">{completion.completed}/{completion.total}</span>
							</span>
							<span className="font-bold text-sm text-primary">{completion.percentage}%</span>
						</div>
						<div className="relative w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
							<div
								className="absolute top-0 left-0 h-full bg-linear-to-r from-primary to-primary/60 transition-all duration-300"
								style={{ width: `${completion.percentage}%` }}
							/>
						</div>
					</div>

					{/* Unsaved Changes Warning */}
					{hasUnsavedChanges && (
						<div className="mt-3 flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
							<AlertCircle className="h-4 w-4" />
							{t.unsavedChanges}
						</div>
					)}
				</div>

				{/* Action Buttons */}
				<div className="flex items-center gap-2 flex-wrap">
					<Button 
						variant="outline" 
						onClick={handleReset} 
						disabled={isSaving}
						className="flex items-center gap-2"
					>
						<RefreshCw className="h-4 w-4" />
						{t.reset}
					</Button>
					<Button 
						onClick={handleSave} 
						disabled={isSaving || !hasUnsavedChanges}
						className="flex items-center gap-2"
					>
						{isSaving ? (
							<>
								<RefreshCw className="h-4 w-4 animate-spin" />
								Saving...
							</>
						) : (
							<>
								<Save className="h-4 w-4" />
								{t.save}
							</>
						)}
					</Button>
				</div>
			</div>

			{/* Tabs Card */}
			<Card>
				<CardHeader className="border-b border-neutral-200 dark:border-neutral-800">
					<div className="flex gap-1 overflow-x-auto">
						{tabs.map((tab, index) => {
							const Icon = tab.icon
							return (
								<button
									key={index}
									onClick={() => setActiveTab(index)}
									className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap rounded-t-xl transition-all ${
										activeTab === index
											? 'bg-primary text-white'
											: 'bg-transparent text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
									}`}
								>
									<Icon className="h-4 w-4" />
									{tab.label}
								</button>
							)
						})}
					</div>
				</CardHeader>
				<CardContent className="p-6">
					{/* Tab Content */}
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
				</CardContent>
			</Card>

			{/* Info Card */}
			<Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
				<CardContent className="p-4">
					<div className="flex items-start gap-3">
						<CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
						<div>
							<h3 className="font-bold text-blue-900 dark:text-blue-100 text-sm mb-1">
								Setup Tips
							</h3>
							<ul className="space-y-1 text-xs text-blue-800 dark:text-blue-200">
								<li className="flex items-start gap-2">
									<span className="text-blue-500">•</span>
									<span>Complete organization info first for better data organization</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-blue-500">•</span>
									<span>Configure departments before inviting employees</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-blue-500">•</span>
									<span>Set up privacy settings to protect sensitive information</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-blue-500">•</span>
									<span>Use aliases to customize field names for your organization</span>
								</li>
							</ul>
						</div>
					</div>
				</CardContent>
			</Card>

			<Toaster />
		</div>
	)
}
