import Textarea from '../components/ui/Textarea'
import { Button } from '../components/ui/Button'
import { toast } from 'sonner'

export default function NoMeetPage() {
	return (
		<div className="grid gap-6">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">NoMeet</h1>
				<p className="mt-1 text-neutral-600 dark:text-neutral-300">Asynchronous structured discussion</p>
			</div>
			<div className="grid gap-4 lg:grid-cols-2">
				<div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
					<h3 className="font-medium">Agenda</h3>
					<Textarea placeholder="Describe the agenda..." className="mt-3" />
					<div className="mt-3 flex gap-2">
						<Button onClick={() => toast.success('Briefing generated (mock)')}>AI Briefing</Button>
						<Button variant="outline" onClick={() => toast('Draft saved')}>Save Draft</Button>
					</div>
				</div>
				<div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
					<h3 className="font-medium">AI Briefing</h3>
					<p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">Key points summary will appear here (mock).</p>
					<div className="mt-4 flex gap-2">
						<Button onClick={() => toast.success('AI proposal created (mock)')}>Create Decision Proposal</Button>
						<Button variant="outline" onClick={() => toast('Shared to Slack (mock)')}>Share</Button>
					</div>
				</div>
			</div>
			<div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
				<h3 className="font-medium">Feedback</h3>
				<ul className="mt-3 space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
					<li>Alias-43: Prefer option B (cost impact lower)</li>
					<li>Alias-21: Need market data for Q3</li>
				</ul>
				<div className="mt-4 flex gap-2">
					<Button onClick={() => toast.success('Approved (mock)')}>Approve</Button>
					<Button variant="outline" onClick={() => toast('Escalated (mock)')}>Escalate</Button>
				</div>
			</div>
		</div>
	)
}
