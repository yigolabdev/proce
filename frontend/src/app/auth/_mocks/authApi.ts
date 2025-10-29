import type { OAuthProvider, SignInStartResult, VerifyCodeResult, AttemptState } from '../_types/auth.types'

const attempts: Record<string, AttemptState> = {}
const windows: Record<string, { attempts: number; start: number }> = {}

const DISPOSABLE_DOMAINS = new Set([
	"mailinator.com",
	"tempmail.com",
	"10minutemail.com",
	"guerrillamail.com",
])

const EMAIL_REGEX = /^(?:[a-zA-Z0-9_'^&+-])+(?:\.(?:[a-zA-Z0-9_'^&+-])+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/

function sleep(min = 400, max = 800) {
	const ms = Math.floor(Math.random() * (max - min + 1)) + min
	return new Promise((r) => setTimeout(r, ms))
}

export function getAttemptState(emailOrProvider: string): AttemptState {
	const key = emailOrProvider.toLowerCase()
	if (!attempts[key]) attempts[key] = { attempts: 0 }
	return attempts[key]
}

function registerAttempt(key: string) {
	const now = Date.now()
	const state = getAttemptState(key)
	if (state.lockedUntil && now < state.lockedUntil) {
		return { locked: true }
	}
	state.attempts += 1
	// simple rate limit: >5 attempts/min lock 60s
	const windowKey = `${key}:window`
	if (!windows[windowKey]) windows[windowKey] = { attempts: 0, start: now }
	const win = windows[windowKey]
	if (now - win.start > 60_000) {
		win.start = now
		win.attempts = 0
	}
	win.attempts++
	if (win.attempts > 5) {
		state.lockedUntil = now + 60_000
	}
	return { locked: false }
}

export async function signInWithPassword(email: string, password: string): Promise<{ ok: boolean; firstTime?: boolean; error?: 'INVALID_CREDENTIALS' | 'RATE_LIMIT' }>{
	await sleep()
	const clean = email.trim().toLowerCase()
	const { locked } = registerAttempt(`pwd:${clean}`)
	if (locked) return { ok: false, error: 'RATE_LIMIT' }
	if (!EMAIL_REGEX.test(clean)) return { ok: false, error: 'INVALID_CREDENTIALS' }
	// simple mock rule: password must be at least 6 chars; 'password1' passes
	if (!password || password.length < 6) return { ok: false, error: 'INVALID_CREDENTIALS' }
	const firstTime = Math.random() < 0.5
	return { ok: true, firstTime }
}

export async function startEmailSignIn(email: string): Promise<SignInStartResult> {
	await sleep()
	const clean = email.trim().toLowerCase()
	const { locked } = registerAttempt(clean)
	if (locked) throw Object.assign(new Error('RATE_LIMIT'), { code: 'RATE_LIMIT' })
	if (!EMAIL_REGEX.test(clean)) throw Object.assign(new Error('INVALID_EMAIL'), { code: 'INVALID_EMAIL' })
	const domain = clean.split('@')[1]
	if (DISPOSABLE_DOMAINS.has(domain)) throw Object.assign(new Error('DISPOSABLE'), { code: 'DISPOSABLE' })
	return { ok: true, requestId: `req_${Math.random().toString(36).slice(2, 10)}` }
}

export async function verifyMagicCode(requestId: string, code: string): Promise<VerifyCodeResult> {
	await sleep()
	const key = `code:${requestId}`
	const { locked } = registerAttempt(key)
	if (locked) return { ok: false, error: 'RATE_LIMIT' }
	if (code === '000000') return { ok: false, error: 'INVALID_CODE' }
	if (Math.floor(Math.random() * 20) === 0) return { ok: false, error: 'EXPIRED' }
	const ok = code === '123456'
	if (!ok) return { ok: false, error: 'INVALID_CODE' }
	const firstTime = Math.random() < 0.5
	return {
		ok: true,
		firstTime,
		user: { id: 'u_' + requestId.slice(-6), email: 'user@example.com', alias: 'alpha-49' },
	}
}

export async function signInWithProvider(provider: OAuthProvider): Promise<{ ok: boolean; firstTime?: boolean; error?: 'OAUTH_DENIED' | 'NETWORK' }> {
	await sleep()
	const { locked } = registerAttempt(`oauth:${provider}`)
	if (locked) return { ok: false, error: 'NETWORK' }
	const roll = Math.random()
	if (roll < 0.05) return { ok: false, error: 'OAUTH_DENIED' }
	if (roll < 0.08) return { ok: false, error: 'NETWORK' }
	return { ok: true, firstTime: Math.random() < 0.5 }
}
