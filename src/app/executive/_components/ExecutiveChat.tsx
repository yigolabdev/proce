import { useState, useRef, useEffect } from 'react'
import { Button } from '../../../components/ui/Button'
import { Send, Sparkles, Bot, X, Maximize2, Minimize2 } from 'lucide-react'

interface Message {
	id: string
	role: 'user' | 'assistant'
	content: string
	timestamp: Date
}

export default function ExecutiveChat() {
	const [isOpen, setIsOpen] = useState(false)
	const [isExpanded, setIsExpanded] = useState(false)
	const [input, setInput] = useState('')
	const [isTyping, setIsTyping] = useState(false)
	const [messages, setMessages] = useState<Message[]>([
		{
			id: '1',
			role: 'assistant',
			content: 'Hello! I am your Executive AI Assistant. I can help you analyze company performance, identify risks, or find specific data points. How can I assist you today?',
			timestamp: new Date()
		}
	])
	const messagesEndRef = useRef<HTMLDivElement>(null)

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}

	useEffect(() => {
		scrollToBottom()
	}, [messages, isOpen])

	const handleSend = async () => {
		if (!input.trim()) return

		const userMessage: Message = {
			id: Date.now().toString(),
			role: 'user',
			content: input,
			timestamp: new Date()
		}

		setMessages(prev => [...prev, userMessage])
		setInput('')
		setIsTyping(true)

		// Simulate AI processing delay
		setTimeout(() => {
			const response = generateResponse(userMessage.content)
			setMessages(prev => [...prev, {
				id: (Date.now() + 1).toString(),
				role: 'assistant',
				content: response,
				timestamp: new Date()
			}])
			setIsTyping(false)
		}, 1500)
	}

	const generateResponse = (query: string): string => {
		const lowerQuery = query.toLowerCase()
		
		if (lowerQuery.includes('risk') || lowerQuery.includes('problem') || lowerQuery.includes('issue')) {
			return "Based on current data, here are the top risks:\n\n1. **Resource Bottleneck**: Engineering team is at 95% capacity, which puts the 'API Integration' project at risk of delay.\n2. **Budget Variance**: Marketing spend is 12% over budget due to the recent Q4 campaign.\n3. **Turnover Risk**: 3 key members in the Design team have high workload indicators (>50h/week) for the last month."
		}
		
		if (lowerQuery.includes('performance') || lowerQuery.includes('team') || lowerQuery.includes('productivity')) {
			return "Team performance summary:\n\n• **Engineering**: High productivity (145 PRs this week), but code review turnaround time has increased by 15%.\n• **Marketing**: Exceeding campaign targets. Lead generation is up 22% MoM.\n• **Sales**: Q4 quota attainment is at 85% with 3 weeks remaining.\n• **Product**: Roadmap delivery is on track, with 'Customer Portal V2' launching next week."
		}

		if (lowerQuery.includes('financial') || lowerQuery.includes('budget') || lowerQuery.includes('cost')) {
			return "Financial snapshot:\n\n• **Q4 Revenue**: $1.2M (98% of target)\n• **OpEx**: $450k (On track)\n• **Projected EOY**: We are projected to hit $4.5M ARR, which is a 12% increase YoY.\n• **Cost Savings**: Infrastructure migration saved approx. $5k/month."
		}

		if (lowerQuery.includes('project') || lowerQuery.includes('status')) {
			return "Project Status Overview:\n\n• **Website Redesign**: 🟢 On Track (Launch: Dec 15)\n• **Mobile App V2**: 🟡 At Risk (Testing delays)\n• **API Integration**: 🟢 On Track (90% complete)\n• **Data Lake**: 🔴 Delayed (Resource constraints)"
		}
		
		if (lowerQuery.includes('recommend') || lowerQuery.includes('suggestion')) {
			return "Strategic Recommendations:\n\n1. **Reallocate Resources**: Move 2 backend engineers to the 'Mobile App V2' project to mitigate launch risks.\n2. **Review Marketing Spend**: Audit Q4 ad spend to ensure ROI remains positive despite overage.\n3. **Wellness Check**: Schedule 1:1s with the Design team to address burnout risks."
		}

		return "I can provide insights on:\n• Team Performance & Productivity\n• Project Health & Status\n• Financials & Budgeting\n• Strategic Risks & Opportunities\n\nTry asking: 'What are the current project risks?' or 'How is the engineering team performing?'"
	}

	if (!isOpen) {
		return (
			<button
				onClick={() => setIsOpen(true)}
				className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-orange-500 text-white shadow-lg hover:bg-orange-600 hover:scale-105 transition-all flex items-center justify-center z-50 shadow-orange-500/20"
			>
				<Sparkles className="h-6 w-6" />
			</button>
		)
	}

	return (
		<div className={`fixed bottom-6 right-6 bg-surface-dark rounded-2xl shadow-2xl border border-border-dark flex flex-col z-50 transition-all duration-300 ${
			isExpanded ? 'w-[600px] h-[800px] max-w-[calc(100vw-48px)] max-h-[calc(100vh-48px)]' : 'w-[400px] h-[600px]'
		}`}>
			{/* Header */}
			<div className="flex items-center justify-between p-4 border-b border-border-dark bg-surface-elevated rounded-t-2xl">
				<div className="flex items-center gap-2">
					<div className="p-2 bg-orange-500/10 rounded-lg">
						<Bot className="h-5 w-5 text-orange-500" />
					</div>
					<div>
						<h3 className="font-semibold text-sm text-white">Executive Assistant</h3>
						<p className="text-xs text-neutral-400">AI-Powered Insights</p>
					</div>
				</div>
				<div className="flex items-center gap-1">
					<button
						onClick={() => setIsExpanded(!isExpanded)}
						className="p-1.5 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white"
					>
						{isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
					</button>
					<button
						onClick={() => setIsOpen(false)}
						className="p-1.5 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white"
					>
						<X className="h-4 w-4" />
					</button>
				</div>
			</div>

			{/* Messages */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{messages.map((msg) => (
					<div
						key={msg.id}
						className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
					>
						<div
							className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
								msg.role === 'user'
									? 'bg-orange-600 text-white rounded-br-none'
									: 'bg-neutral-800 text-neutral-200 rounded-bl-none'
							}`}
						>
							{msg.content}
						</div>
					</div>
				))}
				{isTyping && (
					<div className="flex justify-start">
						<div className="bg-neutral-800 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1">
							<div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
							<div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
							<div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
						</div>
					</div>
				)}
				<div ref={messagesEndRef} />
			</div>

			{/* Input */}
			<div className="p-4 border-t border-border-dark bg-surface-dark rounded-b-2xl">
				<form
					onSubmit={(e) => {
						e.preventDefault()
						handleSend()
					}}
					className="flex gap-2"
				>
					<input
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="Ask about performance, risks, or strategy..."
						className="flex-1 px-4 py-2 text-sm bg-surface-elevated border border-border-dark rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all text-white placeholder-neutral-500"
					/>
					<Button type="submit" size="icon" disabled={!input.trim() || isTyping} className="bg-orange-500 hover:bg-orange-600 text-white border-none">
						<Send className="h-4 w-4" />
					</Button>
				</form>
			</div>
		</div>
	)
}

