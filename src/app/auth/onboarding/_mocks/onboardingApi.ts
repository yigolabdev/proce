import type {
	OnboardingData,
	CreateWorkspaceResult,
	IntegrationProvider,
} from '../_types/onboarding.types';

const STORAGE_KEY = 'proce.setup';
const usedDomains = new Set<string>();

export async function saveDraft(partial: Partial<OnboardingData>): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(() => {
			const existing = getDraft();
			const merged = { ...existing, ...partial };
			localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
			resolve();
		}, 100);
	});
}

export function getDraft(): OnboardingData {
	const raw = localStorage.getItem(STORAGE_KEY);
	if (!raw) return {};
	try {
		return JSON.parse(raw) as OnboardingData;
	} catch {
		return {};
	}
}

export function clearDraft(): void {
	localStorage.removeItem(STORAGE_KEY);
}

export async function createWorkspace(payload: OnboardingData): Promise<CreateWorkspaceResult> {
	return new Promise((resolve) => {
		setTimeout(() => {
			const domain = payload.company?.emailDomain;
			if (domain && usedDomains.has(domain)) {
				resolve({ ok: false, error: 'DUPLICATE_DOMAIN' });
				return;
			}

			// Simulate random network error (5% chance)
			if (Math.random() < 0.05) {
				resolve({ ok: false, error: 'NETWORK' });
				return;
			}

			// Success
			if (domain) usedDomains.add(domain);
			const workspaceId = `ws_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
			clearDraft();
			resolve({ ok: true, workspaceId });
		}, Math.random() * 400 + 800);
	});
}

export async function connectIntegration(
	_provider: IntegrationProvider
): Promise<{ ok: boolean; error?: string }> {
	return new Promise((resolve) => {
		setTimeout(() => {
			// Simulate 10% failure rate
			if (Math.random() < 0.1) {
				resolve({ ok: false, error: 'CONNECTION_FAILED' });
			} else {
				resolve({ ok: true });
			}
		}, Math.random() * 600 + 400);
	});
}

