import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Toaster from '../../../components/ui/Toaster';
import { toast } from 'sonner';
import { CheckCircle2, Users, Languages } from 'lucide-react';
import { useI18n } from '../../../i18n/I18nProvider';
import { joinI18n } from './_i18n/join.i18n';

export default function JoinWorkspacePage() {
	const navigate = useNavigate();
	const { locale, setLocale } = useI18n();
	const t = useMemo(() => joinI18n[locale as keyof typeof joinI18n], [locale]);

	const [step, setStep] = useState<'code' | 'profile' | 'success'>('code');
	const [inviteCode, setInviteCode] = useState('');
	const [workspaceName, setWorkspaceName] = useState('');
	const [profile, setProfile] = useState({
		name: '',
		email: '',
		password: '',
	});
	const [isLoading, setIsLoading] = useState(false);

	const handleVerifyCode = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!inviteCode.trim()) {
			toast.error(t.errors.enterCode);
			return;
		}

		setIsLoading(true);
		// Mock API call
		await new Promise((resolve) => setTimeout(resolve, 800));

		// Mock: Accept any 6-character code
		if (inviteCode.length >= 6) {
			setWorkspaceName('Acme Corporation'); // Mock workspace name
			setStep('profile');
			toast.success(t.errors.codeVerified);
		} else {
			toast.error(t.errors.invalidCode);
		}
		setIsLoading(false);
	};

	const handleCreateProfile = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!profile.name || !profile.email || !profile.password) {
			toast.error(t.errors.fillAllFields);
			return;
		}

		setIsLoading(true);
		// Mock API call
		await new Promise((resolve) => setTimeout(resolve, 1000));
		setStep('success');
		setIsLoading(false);
	};

	if (step === 'success') {
		return (
			<div className="mx-auto min-h-dvh w-full max-w-md px-4 py-12">
				{/* Language Switcher */}
				<div className="flex justify-end mb-4">
					<button
						onClick={() => setLocale(locale === 'en' ? 'ko' : 'en')}
						className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full bg-neutral-900/90 backdrop-blur-sm border border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
						aria-label="toggle language"
					>
						<Languages size={14} />
						<span className="text-xs">{locale === 'ko' ? 'EN' : '한글'}</span>
					</button>
				</div>

				<Card className="p-8 text-center">
					<div className="mx-auto w-16 h-16 rounded-full bg-green-900/30 flex items-center justify-center mb-4">
						<CheckCircle2 className="h-8 w-8 text-green-400" />
					</div>
					<h2 className="text-2xl font-bold">{t.welcome}</h2>
					<p className="mt-2 text-neutral-300">
						<span className="font-medium text-primary">{workspaceName}</span> {t.joinedWorkspace.replace('{workspace}', '')}
					</p>

					<Button className="mt-6 w-full" onClick={() => navigate('/dashboard')}>
						{t.goToDashboard}
					</Button>
				</Card>
				<Toaster />
			</div>
		);
	}

	if (step === 'profile') {
		return (
			<div className="mx-auto min-h-dvh w-full max-w-md px-4 py-12">
				{/* Language Switcher */}
				<div className="flex justify-end mb-4">
					<button
						onClick={() => setLocale(locale === 'en' ? 'ko' : 'en')}
						className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full bg-neutral-900/90 backdrop-blur-sm border border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
						aria-label="toggle language"
					>
						<Languages size={14} />
						<span className="text-xs">{locale === 'ko' ? 'EN' : '한글'}</span>
					</button>
				</div>

				<Card className="p-6">
					<div className="flex items-center gap-3 mb-6">
						<div className="rounded-2xl bg-primary/10 p-3">
							<Users className="h-6 w-6 text-primary" />
						</div>
						<div>
							<h2 className="text-xl font-bold">{t.profileTitle}</h2>
							<p className="text-sm text-neutral-300">
								{t.joiningWorkspace.replace('{workspace}', workspaceName)}
							</p>
						</div>
					</div>

					<form onSubmit={handleCreateProfile} className="space-y-4">
						<div>
							<label htmlFor="name" className="block text-sm font-medium mb-1">
								{t.name}
							</label>
							<Input
								id="name"
								value={profile.name}
								onChange={(e) => setProfile({ ...profile, name: e.target.value })}
								placeholder={t.namePlaceholder}
							/>
						</div>

						<div>
							<label htmlFor="email" className="block text-sm font-medium mb-1">
								{t.email}
							</label>
							<Input
								id="email"
								type="email"
								value={profile.email}
								onChange={(e) => setProfile({ ...profile, email: e.target.value })}
								placeholder={t.emailPlaceholder}
							/>
						</div>

						<div>
							<label htmlFor="password" className="block text-sm font-medium mb-1">
								{t.password}
							</label>
							<Input
								id="password"
								type="password"
								value={profile.password}
								onChange={(e) => setProfile({ ...profile, password: e.target.value })}
								placeholder={t.passwordPlaceholder}
							/>
						</div>

						<div className="flex gap-2 pt-4">
							<Button type="button" variant="secondary" onClick={() => setStep('code')} className="flex-1">
								{t.cancel}
							</Button>
							<Button type="submit" disabled={isLoading} className="flex-1">
								{isLoading ? '...' : t.createProfile}
							</Button>
						</div>
					</form>
				</Card>
				<Toaster />
			</div>
		);
	}

	return (
		<div className="mx-auto min-h-dvh w-full max-w-md px-4 py-12">
			{/* Language Switcher */}
			<div className="flex justify-end mb-4">
				<button
					onClick={() => setLocale(locale === 'en' ? 'ko' : 'en')}
					className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full bg-neutral-900/90 backdrop-blur-sm border border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
					aria-label="toggle language"
				>
					<Languages size={14} />
					<span className="text-xs">{locale === 'ko' ? 'EN' : '한글'}</span>
				</button>
			</div>

			<Card className="p-6">
				<div className="flex items-center gap-3 mb-6">
					<div className="rounded-2xl bg-primary/10 p-3">
						<Users className="h-6 w-6 text-primary" />
					</div>
					<div>
						<h2 className="text-xl font-bold">{t.title}</h2>
						<p className="text-sm text-neutral-300">{t.subtitle}</p>
					</div>
				</div>

				<form onSubmit={handleVerifyCode} className="space-y-4">
					<div>
						<label htmlFor="inviteCode" className="block text-sm font-medium mb-1">
							{t.inviteCode}
						</label>
						<Input
							id="inviteCode"
							value={inviteCode}
							onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
							placeholder={t.inviteCodePlaceholder}
							className="text-center text-lg tracking-wider font-mono"
							maxLength={10}
						/>
						<p className="mt-2 text-xs text-neutral-500">
							{t.inviteCodeHint}
						</p>
					</div>

					<div className="flex gap-2 pt-4">
						<Button type="button" variant="secondary" onClick={() => navigate('/auth/sign-up')} className="flex-1">
							{t.cancel}
						</Button>
						<Button type="submit" disabled={isLoading} className="flex-1">
							{isLoading ? '...' : t.next}
						</Button>
					</div>
				</form>

				<div className="mt-6 p-4 rounded-2xl bg-neutral-900">
					<p className="text-xs text-neutral-400">
						<strong>{t.noCode}</strong>
						<br />
						{t.noCodeDescription}
					</p>
				</div>
			</Card>
			<Toaster />
		</div>
	);
}

