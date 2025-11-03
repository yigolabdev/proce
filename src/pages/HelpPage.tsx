import { useState } from 'react'

export default function HelpPage() {
	const [q, setQ] = useState('')
	return (
		<div className="mx-auto max-w-3xl">
			<h1 className="text-2xl font-semibold tracking-tight">Help</h1>
			<p className="mt-1 text-neutral-600 dark:text-neutral-300">Search guides and FAQs</p>
			<div className="mt-4">
				<input
					value={q}
					onChange={(e) => setQ(e.target.value)}
					placeholder="Search help..."
					className="w-full rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5"
				/>
			</div>
			<div className="mt-6 grid gap-4 md:grid-cols-2">
				<div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4">
					<h3 className="font-medium">FAQs</h3>
					<ul className="mt-2 list-disc pl-5 text-sm text-neutral-600 dark:text-neutral-300">
						<li>NoMeet vs meetings</li>
						<li>Policy DSL basics</li>
						<li>Alias system</li>
					</ul>
				</div>
				<div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4">
					<h3 className="font-medium">Guides</h3>
					<ul className="mt-2 list-disc pl-5 text-sm text-neutral-600 dark:text-neutral-300">
						<li>Connect Slack</li>
						<li>Define KPIs</li>
						<li>Design policies</li>
					</ul>
				</div>
			</div>
		</div>
	)
}
