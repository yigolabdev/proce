import { useState } from 'react'
import { FileText, X, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

export interface DevMemoContent {
	title: {
		ko: string
		en: string
	}
	purpose: {
		ko: string
		en: string
	}
	features: {
		ko: string[]
		en: string[]
	}
	status: {
		ko: string
		en: string
	}
	lastUpdated: string
	notes?: {
		ko: string
		en: string
	}
}

interface DevMemoProps {
	content: DevMemoContent
	pagePath?: string
}

export function DevMemo({ content, pagePath }: DevMemoProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [isExpanded, setIsExpanded] = useState(false)
	
	// Show only in development mode
	if (import.meta.env.PROD) {
		return null
	}

	return (
		<>
			{/* Toggle Button - Top Left */}
			<div className="fixed top-4 left-4 z-50">
				<Button
					onClick={() => setIsOpen(!isOpen)}
					size="sm"
					variant="secondary"
					className="shadow-lg bg-orange-500 hover:bg-orange-600 text-white border-2 border-orange-600"
					title="Developer Notes (Dev Mode Only)"
				>
					<FileText className="h-4 w-4" />
					<span className="ml-1 font-semibold">DEV</span>
				</Button>
			</div>

			{/* Memo Panel */}
			{isOpen && (
				<div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-start p-4">
					<Card className="w-full max-w-2xl mt-16 ml-4 max-h-[80vh] overflow-y-auto bg-white dark:bg-neutral-900 shadow-2xl border-2 border-orange-500">
						{/* Header */}
						<div className="sticky top-0 bg-orange-500 text-white p-4 flex items-center justify-between">
							<div className="flex items-center gap-2">
								<FileText className="h-5 w-5" />
								<h3 className="font-bold text-lg">Developer Notes</h3>
								<span className="text-xs bg-orange-600 px-2 py-1 rounded">DEV MODE</span>
							</div>
							<Button
								onClick={() => setIsOpen(false)}
								size="sm"
								variant="secondary"
								className="bg-orange-600 hover:bg-orange-700 text-white"
							>
								<X className="h-4 w-4" />
							</Button>
						</div>

						{/* Content */}
						<div className="p-6 space-y-6">
							{/* Page Path */}
							{pagePath && (
								<div className="bg-neutral-100 dark:bg-neutral-800 p-3 rounded-lg">
									<p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">
										{pagePath}
									</p>
								</div>
							)}

							{/* Title */}
							<div>
								<h4 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
									{content.title.ko}
								</h4>
								<p className="text-lg text-neutral-600 dark:text-neutral-400">
									{content.title.en}
								</p>
							</div>

							{/* Status & Last Updated */}
							<div className="flex items-center gap-4">
								<div className="flex items-center gap-2">
									<span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
										상태 / Status:
									</span>
									<span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
										{content.status.ko} / {content.status.en}
									</span>
								</div>
								<div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
									<span>Last Updated:</span>
									<span className="font-mono">{content.lastUpdated}</span>
								</div>
							</div>

							{/* Purpose */}
							<div>
								<h5 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2">
									🎯 개발 목적 / Purpose
								</h5>
								<div className="space-y-2">
									<p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
										<strong className="text-orange-600">🇰🇷</strong> {content.purpose.ko}
									</p>
									<p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
										<strong className="text-blue-600">🇺🇸</strong> {content.purpose.en}
									</p>
								</div>
							</div>

							{/* Features */}
							<div>
								<button
									onClick={() => setIsExpanded(!isExpanded)}
									className="flex items-center gap-2 text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2 hover:text-orange-600 transition-colors"
								>
									<span>✨ 주요 기능 / Features</span>
									{isExpanded ? (
										<ChevronUp className="h-5 w-5" />
									) : (
										<ChevronDown className="h-5 w-5" />
									)}
								</button>
								
								{isExpanded && (
									<div className="space-y-4 pl-4 border-l-2 border-orange-500">
										<div>
											<p className="text-sm font-semibold text-orange-600 mb-2">🇰🇷 한국어</p>
											<ul className="space-y-1">
												{content.features.ko.map((feature, index) => (
													<li key={index} className="text-sm text-neutral-700 dark:text-neutral-300 flex gap-2">
														<span className="text-orange-500">•</span>
														<span>{feature}</span>
													</li>
												))}
											</ul>
										</div>
										<div>
											<p className="text-sm font-semibold text-blue-600 mb-2">🇺🇸 English</p>
											<ul className="space-y-1">
												{content.features.en.map((feature, index) => (
													<li key={index} className="text-sm text-neutral-700 dark:text-neutral-300 flex gap-2">
														<span className="text-blue-500">•</span>
														<span>{feature}</span>
													</li>
												))}
											</ul>
										</div>
									</div>
								)}
							</div>

							{/* Additional Notes */}
							{content.notes && (
								<div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded">
									<h5 className="text-sm font-bold text-yellow-800 dark:text-yellow-400 mb-2">
										📝 추가 노트 / Additional Notes
									</h5>
									<div className="space-y-2">
										<p className="text-sm text-yellow-700 dark:text-yellow-300">
											<strong className="text-orange-600">🇰🇷</strong> {content.notes.ko}
										</p>
										<p className="text-sm text-yellow-700 dark:text-yellow-300">
											<strong className="text-blue-600">🇺🇸</strong> {content.notes.en}
										</p>
									</div>
								</div>
							)}

							{/* Footer */}
							<div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
								<p className="text-xs text-neutral-500 dark:text-neutral-500 text-center">
									💡 This note is only visible in development mode and will not appear in production.
								</p>
							</div>
						</div>
					</Card>
				</div>
			)}
		</>
	)
}

export default DevMemo



