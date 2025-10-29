import { Button } from '../components/ui/Button'
import Textarea from '../components/ui/Textarea'
import { toast } from 'sonner'

export default function PolicyPage() {
	return (
		<div className="grid gap-6 lg:grid-cols-[280px_1fr]">
			<aside className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4">
				<h3 className="font-medium">Policies</h3>
				<ul className="mt-3 space-y-2 text-sm">
					<li className="rounded-2xl bg-neutral-100 dark:bg-neutral-900 px-3 py-2">Sales Approval</li>
					<li className="rounded-2xl px-3 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-900">Budget Control</li>
					<li className="rounded-2xl px-3 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-900">Hiring</li>
				</ul>
				<div className="mt-4">
					<Button onClick={() => toast('New policy (mock)')}>New Policy</Button>
				</div>
			</aside>
			<section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
				<h1 className="text-2xl font-semibold tracking-tight">Policy Editor</h1>
				<p className="mt-1 text-neutral-600 dark:text-neutral-300">Write rules with DSL (mock)</p>
				<Textarea className="mt-4" rows={10} placeholder="when kpi('mql').delta > 0.2 then escalate('marketing')" />
				<div className="mt-3 flex gap-2">
					<Button onClick={() => toast.success('Deployed (mock)')}>Deploy</Button>
					<Button variant="outline" onClick={() => toast('Test ran (mock)')}>Run Test</Button>
				</div>
			</section>
		</div>
	)
}
