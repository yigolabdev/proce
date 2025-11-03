export type OAuthProvider = 'google' | 'microsoft' | 'slack'

export type SignInStartResult = { ok: true; requestId: string; mfaRequired?: boolean }
export type VerifyCodeResult = {
	ok: boolean
	error?: 'INVALID_CODE' | 'EXPIRED' | 'RATE_LIMIT'
	firstTime?: boolean
	user?: { id: string; email: string; alias: string }
}

export interface AttemptState {
	attempts: number
	lockedUntil?: number
}
