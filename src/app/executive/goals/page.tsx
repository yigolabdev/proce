'use client'

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ExecutiveGoalsPage() {
	const navigate = useNavigate()

	useEffect(() => {
		// Redirect to company settings annual goals tab
		navigate('/admin/company-settings', { replace: true })
	}, [navigate])

	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="text-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
				<p className="text-neutral-600 dark:text-neutral-400">
					Redirecting to Company Settings...
				</p>
			</div>
		</div>
	)
}
