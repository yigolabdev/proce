import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Toaster from '../../../components/ui/Toaster';
import { toast } from 'sonner';
import { CheckCircle2, Users } from 'lucide-react';

export default function JoinWorkspacePage() {
	const navigate = useNavigate();

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
			toast.error('초대 코드를 입력하세요');
			return;
		}

		setIsLoading(true);
		// Mock API call
		await new Promise((resolve) => setTimeout(resolve, 800));

		// Mock: Accept any 6-character code
		if (inviteCode.length >= 6) {
			setWorkspaceName('Acme Corporation'); // Mock workspace name
			setStep('profile');
			toast.success('초대 코드가 확인되었습니다');
		} else {
			toast.error('유효하지 않은 초대 코드입니다');
		}
		setIsLoading(false);
	};

	const handleCreateProfile = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!profile.name || !profile.email || !profile.password) {
			toast.error('모든 필드를 입력하세요');
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
				<Card className="p-8 text-center">
					<div className="mx-auto w-16 h-16 rounded-full bg-green-900/30 flex items-center justify-center mb-4">
						<CheckCircle2 className="h-8 w-8 text-green-400" />
					</div>
					<h2 className="text-2xl font-bold">환영합니다!</h2>
					<p className="mt-2 text-neutral-300">
						<span className="font-medium text-primary">{workspaceName}</span> 워크스페이스에 참여했습니다
					</p>

					<Button className="mt-6 w-full" onClick={() => navigate('/dashboard')}>
						대시보드로 이동
					</Button>
				</Card>
				<Toaster />
			</div>
		);
	}

	if (step === 'profile') {
		return (
			<div className="mx-auto min-h-dvh w-full max-w-md px-4 py-12">
				<Card className="p-6">
					<div className="flex items-center gap-3 mb-6">
						<div className="rounded-2xl bg-primary/10 p-3">
							<Users className="h-6 w-6 text-primary" />
						</div>
						<div>
							<h2 className="text-xl font-bold">프로필 생성</h2>
							<p className="text-sm text-neutral-300">
								{workspaceName}에 참여합니다
							</p>
						</div>
					</div>

					<form onSubmit={handleCreateProfile} className="space-y-4">
						<div>
							<label htmlFor="name" className="block text-sm font-medium mb-1">
								이름
							</label>
							<Input
								id="name"
								value={profile.name}
								onChange={(e) => setProfile({ ...profile, name: e.target.value })}
								placeholder="홍길동"
							/>
						</div>

						<div>
							<label htmlFor="email" className="block text-sm font-medium mb-1">
								이메일
							</label>
							<Input
								id="email"
								type="email"
								value={profile.email}
								onChange={(e) => setProfile({ ...profile, email: e.target.value })}
								placeholder="hong@example.com"
							/>
						</div>

						<div>
							<label htmlFor="password" className="block text-sm font-medium mb-1">
								비밀번호
							</label>
							<Input
								id="password"
								type="password"
								value={profile.password}
								onChange={(e) => setProfile({ ...profile, password: e.target.value })}
								placeholder="비밀번호 입력"
							/>
						</div>

						<div className="flex gap-2 pt-4">
							<Button type="button" variant="secondary" onClick={() => setStep('code')} className="flex-1">
								이전
							</Button>
							<Button type="submit" disabled={isLoading} className="flex-1">
								{isLoading ? '생성 중...' : '계정 만들기'}
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
			<Card className="p-6">
				<div className="flex items-center gap-3 mb-6">
					<div className="rounded-2xl bg-primary/10 p-3">
						<Users className="h-6 w-6 text-primary" />
					</div>
					<div>
						<h2 className="text-xl font-bold">워크스페이스 참여</h2>
						<p className="text-sm text-neutral-300">초대 코드를 입력하세요</p>
					</div>
				</div>

				<form onSubmit={handleVerifyCode} className="space-y-4">
					<div>
						<label htmlFor="inviteCode" className="block text-sm font-medium mb-1">
							초대 코드
						</label>
						<Input
							id="inviteCode"
							value={inviteCode}
							onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
							placeholder="ABC123"
							className="text-center text-lg tracking-wider font-mono"
							maxLength={10}
						/>
						<p className="mt-2 text-xs text-neutral-500">
							관리자로부터 받은 6자리 초대 코드를 입력하세요
						</p>
					</div>

					<div className="flex gap-2 pt-4">
						<Button type="button" variant="secondary" onClick={() => navigate('/auth/sign-up')} className="flex-1">
							취소
						</Button>
						<Button type="submit" disabled={isLoading} className="flex-1">
							{isLoading ? '확인 중...' : '다음'}
						</Button>
					</div>
				</form>

				<div className="mt-6 p-4 rounded-2xl bg-neutral-900">
					<p className="text-xs text-neutral-400">
						<strong>초대 코드가 없나요?</strong>
						<br />
						워크스페이스 관리자에게 초대 코드를 요청하세요. 관리자는 워크스페이스 설정에서 초대 코드를 생성할 수 있습니다.
					</p>
				</div>
			</Card>
			<Toaster />
		</div>
	);
}

