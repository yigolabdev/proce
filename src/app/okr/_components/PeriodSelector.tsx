import { Card, CardContent } from '../../../components/ui/Card'
import type { Period } from '../_types/okr.types'

interface PeriodSelectorProps {
	periods: Period[]
	selectedPeriod: string
	onPeriodChange: (period: string) => void
}

/**
 * Period Selector Component
 * Allows switching between Quarter and Month views
 */
export function PeriodSelector({ periods, selectedPeriod, onPeriodChange }: PeriodSelectorProps) {
	const currentPeriodType = periods.find(p => p.value === selectedPeriod)?.type || 'quarter'

	const handleTypeChange = (type: 'quarter' | 'month') => {
		const firstPeriod = periods.find(p => p.type === type)
		if (firstPeriod) onPeriodChange(firstPeriod.value)
	}

	return (
		<Card>
			<CardContent className="p-4">
				<label className="block text-sm font-medium mb-3">Select Period</label>
				
				{/* Period Type Toggle */}
				<div className="flex gap-2 mb-3">
					<button
						onClick={() => handleTypeChange('quarter')}
						className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
							currentPeriodType === 'quarter'
								? 'bg-primary text-white'
								: 'bg-neutral-800 text-neutral-400 hover:hover:bg-neutral-700'
						}`}
					>
						🗓️ Quarter
					</button>
					<button
						onClick={() => handleTypeChange('month')}
						className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
							currentPeriodType === 'month'
								? 'bg-primary text-white'
								: 'bg-neutral-800 text-neutral-400 hover:hover:bg-neutral-700'
						}`}
					>
						📅 Month
					</button>
				</div>
				
				{/* Period Options */}
				<div className="flex flex-wrap gap-1.5">
					{periods
						.filter(p => p.type === currentPeriodType)
						.map((period) => (
							<button
								key={period.value}
								onClick={() => onPeriodChange(period.value)}
								className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
									selectedPeriod === period.value
										? 'bg-primary text-white shadow-sm'
										: 'bg-neutral-800 text-neutral-400 hover:hover:bg-neutral-700'
								}`}
							>
								{period.value}
							</button>
						))}
				</div>
			</CardContent>
		</Card>
	)
}

export default PeriodSelector

