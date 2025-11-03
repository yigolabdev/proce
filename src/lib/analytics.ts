export type TrackEvent = 'sign_in_start' | 'sign_in_success' | 'sign_in_error'

export function track(event: TrackEvent, payload?: Record<string, unknown>) {
	// Minimal analytics stub — replace with real provider later
	// eslint-disable-next-line no-console
	console.log(`[track] ${event}`, payload ?? {})
}
