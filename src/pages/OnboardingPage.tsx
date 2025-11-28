import { Card, CardContent } from '../components/ui/Card'
import { CheckCircle2, User, Link, Users } from 'lucide-react'

export default function OnboardingPage() {
	return (
		<div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
			<div className="w-full max-w-2xl space-y-8">
				<div className="text-center">
					<h1 className="text-3xl font-bold tracking-tight text-white">Welcome to Proce</h1>
					<p className="mt-2 text-neutral-400">Let's set up your workspace</p>
				</div>
				
				<div className="space-y-4">
					<Card className="bg-[#0f0f0f] border-[#262626] hover:bg-[#1a1a1a] transition-colors cursor-pointer group">
						<CardContent className="p-6 flex items-center gap-4">
							<div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500 group-hover:scale-110 transition-transform">
								<User className="h-6 w-6" />
							</div>
							<div>
								<h3 className="font-bold text-white mb-1">1. Choose your role</h3>
								<p className="text-sm text-neutral-400">This helps personalize AI suggestions for your work.</p>
							</div>
							<div className="ml-auto">
								<CheckCircle2 className="h-5 w-5 text-[#262626]" />
							</div>
						</CardContent>
					</Card>

					<Card className="bg-[#0f0f0f] border-[#262626] hover:bg-[#1a1a1a] transition-colors cursor-pointer group">
						<CardContent className="p-6 flex items-center gap-4">
							<div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
								<Link className="h-6 w-6" />
							</div>
							<div>
								<h3 className="font-bold text-white mb-1">2. Connect tools</h3>
								<p className="text-sm text-neutral-400">Integration with Slack, Notion, and Jira.</p>
							</div>
							<div className="ml-auto">
								<CheckCircle2 className="h-5 w-5 text-[#262626]" />
							</div>
						</CardContent>
					</Card>

					<Card className="bg-[#0f0f0f] border-[#262626] hover:bg-[#1a1a1a] transition-colors cursor-pointer group">
						<CardContent className="p-6 flex items-center gap-4">
							<div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform">
								<Users className="h-6 w-6" />
							</div>
							<div>
								<h3 className="font-bold text-white mb-1">3. Invite teammates</h3>
								<p className="text-sm text-neutral-400">Collaborate with your team effectively.</p>
							</div>
							<div className="ml-auto">
								<CheckCircle2 className="h-5 w-5 text-[#262626]" />
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}
