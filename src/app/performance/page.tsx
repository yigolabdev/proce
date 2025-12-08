'use client'

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function PerformancePage() {
	const navigate = useNavigate()

	useEffect(() => {
		// Redirect to analytics page
		navigate('/analytics', { replace: true })
	}, [navigate])

	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="text-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
				<p className="text-neutral-400">
					Redirecting to Analytics...
				</p>
			</div>
		</div>
	)
}
