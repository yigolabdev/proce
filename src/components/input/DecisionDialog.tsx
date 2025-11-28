import { Card, CardContent, CardHeader } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import Textarea from '../ui/Textarea'
import { AlertCircle, X, Save } from 'lucide-react'

interface DecisionDialogProps {
	isOpen: boolean
	onClose: () => void
}

export function DecisionDialog({ isOpen, onClose }: DecisionDialogProps) {
	if (!isOpen) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
			<Card className="w-full max-w-2xl bg-surface-dark border-border-dark">
				<CardHeader className="border-b border-border-dark">
					<div className="flex items-center justify-between">
						<h3 className="text-xl font-bold flex items-center gap-2 text-white">
							<AlertCircle className="h-6 w-6 text-orange-500" />
							Create Decision Issue
						</h3>
						<button
							onClick={onClose}
							className="text-neutral-500 hover:text-white"
						>
							<X className="h-6 w-6" />
						</button>
					</div>
				</CardHeader>
				<CardContent className="p-6">
					<div className="space-y-4">
						<p className="text-sm text-neutral-400">
							Document important decisions that need to be made or have been made during your work.
						</p>
						<div>
							<label className="block text-sm font-semibold mb-2 text-neutral-300">Issue Title *</label>
							<Input placeholder="e.g., Choose authentication method" />
						</div>
						<div>
							<label className="block text-sm font-semibold mb-2 text-neutral-300">Description *</label>
							<Textarea
								placeholder="Describe the decision that needs to be made..."
								rows={4}
							/>
						</div>
						<div>
							<label className="block text-sm font-semibold mb-2 text-neutral-300">Decision Needed</label>
							<Input placeholder="What specific decision needs to be made?" />
						</div>
						<div className="flex items-center gap-2 pt-4">
							<Button variant="primary" className="flex-1 rounded-full">
								<Save className="h-4 w-4 mr-2" />
								Create Issue
							</Button>
							<Button variant="outline" onClick={onClose}>
								Cancel
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

