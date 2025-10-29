import type { AccountType, IndividualProfile, SignUpResult } from '../_types/signup.types';

const STORAGE_KEY = 'proce.signup';
const usedEmails = new Set<string>();

export function saveSignUpDraft(data: { accountType?: AccountType; profile?: IndividualProfile }): void {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getSignUpDraft(): { accountType?: AccountType; profile?: IndividualProfile } {
	const raw = localStorage.getItem(STORAGE_KEY);
	if (!raw) return {};
	try {
		return JSON.parse(raw);
	} catch {
		return {};
	}
}

export function clearSignUpDraft(): void {
	localStorage.removeItem(STORAGE_KEY);
}

export async function createIndividualAccount(profile: IndividualProfile): Promise<SignUpResult> {
	return new Promise((resolve) => {
		setTimeout(() => {
			const email = profile.email;
			if (email && usedEmails.has(email)) {
				resolve({ ok: false, error: 'DUPLICATE_EMAIL' });
				return;
			}

			// Simulate random network error (5% chance)
			if (Math.random() < 0.05) {
				resolve({ ok: false, error: 'NETWORK' });
				return;
			}

			// Success
			if (email) usedEmails.add(email);
			const userId = `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
			clearSignUpDraft();
			resolve({ ok: true, accountType: 'individual', userId });
		}, Math.random() * 400 + 600);
	});
}

