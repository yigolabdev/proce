import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Card, CardContent } from '../ui/Card'

interface PerformanceData {
	name: string
	hours: number
	focus: string
}

interface PerformanceChartProps {
	data: PerformanceData[]
}

export function PerformanceChart({ data }: PerformanceChartProps) {
	return (
		<Card className="bg-surface-dark border-border-dark">
			<CardContent className="p-6 h-[300px]">
				<ResponsiveContainer width="100%" height="100%">
					<AreaChart data={data}>
						<defs>
							<linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
								<stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
							</linearGradient>
						</defs>
						<CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
						<XAxis 
							dataKey="name" 
							stroke="#525252" 
							tick={{fill: '#525252'}} 
							axisLine={false}
							tickLine={false}
						/>
						<YAxis 
							stroke="#525252" 
							tick={{fill: '#525252'}} 
							axisLine={false}
							tickLine={false}
						/>
						<Tooltip 
							contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', color: '#fff' }}
							itemStyle={{ color: '#f97316' }}
						/>
						<Area 
							type="monotone" 
							dataKey="hours" 
							stroke="#f97316" 
							strokeWidth={3}
							fillOpacity={1} 
							fill="url(#colorHours)" 
						/>
					</AreaChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	)
}

