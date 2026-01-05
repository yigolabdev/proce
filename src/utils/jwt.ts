/**
 * JWT Token Utilities
 */

/**
 * Decode JWT token payload
 * Note: This only decodes the payload, does NOT verify signature
 */
export function decodeJWT(token: string): any {
	try {
		const base64Url = token.split('.')[1]
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split('')
				.map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
				.join('')
		)

		return JSON.parse(jsonPayload)
	} catch (error) {
		console.error('Failed to decode JWT:', error)
		return null
	}
}

/**
 * Check if JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
	try {
		const payload = decodeJWT(token)
		if (!payload || !payload.exp) return true

		const currentTime = Math.floor(Date.now() / 1000)
		return payload.exp < currentTime
	} catch (error) {
		return true
	}
}

/**
 * Get token expiration time in seconds
 */
export function getTokenExpiration(token: string): number | null {
	try {
		const payload = decodeJWT(token)
		return payload?.exp || null
	} catch (error) {
		return null
	}
}
