export type AccountType = 'business' | 'individual';

export interface IndividualProfile {
	name?: string;
	email?: string;
	jobTitle?: string;
	industry?: string;
	interests?: string[];
	bio?: string;
}

export interface SignUpResult {
	ok: boolean;
	accountType?: AccountType;
	userId?: string;
	error?: 'DUPLICATE_EMAIL' | 'NETWORK' | 'VALIDATION';
}

