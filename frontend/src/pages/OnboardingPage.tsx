export default function OnboardingPage() {
	return (
		<div className="mx-auto max-w-2xl">
			<h1 className="text-2xl font-semibold tracking-tight">Welcome to Proce</h1>
			<p className="mt-1 text-neutral-600 dark:text-neutral-300">Let's set up your workspace</p>
			<ol className="mt-6 space-y-4">
				<li className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4">
					<span className="font-medium">1. Choose your role</span>
					<p className="text-sm text-neutral-600 dark:text-neutral-300">This helps personalize suggestions.</p>
				</li>
				<li className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4">
					<span className="font-medium">2. Connect tools</span>
					<p className="text-sm text-neutral-600 dark:text-neutral-300">Slack/Notion/Jira (optional in this mock).</p>
				</li>
				<li className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4">
					<span className="font-medium">3. Invite teammates</span>
					<p className="text-sm text-neutral-600 dark:text-neutral-300">Use aliases by default for fairness.</p>
				</li>
			</ol>
		</div>
	)
}
