import { storage } from '../../utils/storage'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import { PageHeader } from '../../components/common/PageHeader'
import {
	Target,
	Plus,
	X,
	Edit2,
	Trash2,
	CheckCircle2,
	AlertCircle,
	Calendar,
	Users,
	Flag,
	ChevronDown,
	ChevronUp,
	FileText,
	Clock,
	Save,
	TrendingUp,
	BarChart3,
} from 'lucide-react'
import { toast } from 'sonner'
import Toaster from '../../components/ui/Toaster'
import { EmptyState } from '../../components/common/EmptyState'
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

interface KeyResult {
	id: string
	description: string
	target: number
	current: number
	unit: string
	owner: string
	
	// AI 분석 (선택적)
	aiAnalysis?: {
		onTrack: boolean
		predictedFinalValue: number
		confidence: number  // 0-1
		recommendations: string[]
	}
}

interface Objective {
	id: string
	title: string
	description: string
	period: string  // Quarter (Q1-Q4) or Month (Jan-Dec)
	periodType: 'quarter' | 'month'
	owner: string
	team: string
	status: 'on-track' | 'at-risk' | 'behind' | 'completed'
	keyResults: KeyResult[]
	startDate: string
	endDate: string
	
	// 달성 가능성 및 리소스 (선택적)
	feasibility?: {
		achievabilityScore: number  // 0-1
		basedOn: 'historical-data' | 'expert-estimate' | 'ai-prediction'
		similarObjectives: string[]
		successRate?: number  // 0-1
		confidence: number  // 0-1
	}
	resourceRequirements?: {
		estimatedEffort: string
		requiredSkills: string[]
		budgetNeeded?: number
		teamSize?: number
	}
	
	// 역사적 성과 데이터 (선택적)
	historicalData?: {
		previousAttempts: number
		previousBestResult?: number
		averageProgress?: number
		typicalBottlenecks: string[]
		lessonsLearned: string[]
	}
	
	// AI 추천 및 분석 (선택적)
	aiRecommendations?: {
		isRealistic: boolean
		confidenceLevel: number  // 0-1
		recommendationReason: string
		suggestedAdjustments: string[]
		successFactors: string[]
		risksAndMitigation: Array<{
			risk: string
			probability: number  // 0-1
			impact: 'low' | 'medium' | 'high'
			mitigation: string
		}>
		optimalTarget?: number
		predictedCompletion?: string
	}
}

interface WorkEntry {
	id: string
	title: string
	category: string
	objectiveId?: string
	date: Date
	duration?: string
}

export default function OKRPage() {
	const navigate = useNavigate()
	const [objectives, setObjectives] = useState<Objective[]>([])
	const [workEntries, setWorkEntries] = useState<WorkEntry[]>([])
	const [expandedObjectives, setExpandedObjectives] = useState<string[]>([])
	
	// Keyboard shortcuts
	useKeyboardShortcuts({
		newObjective: () => handleOpenAddObjective(),
		cancel: () => {
			setShowAddObjective(false)
			setShowEditObjective(false)
			setShowAddKeyResult(false)
		},
		goToDashboard: () => navigate('/app/dashboard'),
		newWork: () => navigate('/app/input'),
	})
	
	// Get current quarter dynamically
	const getCurrentPeriod = () => {
		const now = new Date()
		const currentYear = now.getFullYear()
		const currentMonth = now.getMonth()
		const currentQuarter = Math.floor(currentMonth / 3) + 1
		return `Q${currentQuarter} ${currentYear}`
	}
	
	const [selectedQuarter, setSelectedQuarter] = useState<string>(getCurrentPeriod())
	
	// Dialog states
	const [showAddObjective, setShowAddObjective] = useState(false)
	const [showEditObjective, setShowEditObjective] = useState(false)
	const [showAddKeyResult, setShowAddKeyResult] = useState(false)
	
	// Current editing states
	const [editingObjective, setEditingObjective] = useState<Objective | null>(null)
	const [selectedObjectiveId, setSelectedObjectiveId] = useState<string>('')
	
	// Form states for Objective
	const [objectiveTitle, setObjectiveTitle] = useState('')
	const [objectiveDescription, setObjectiveDescription] = useState('')
	const [objectivePeriod, setObjectivePeriod] = useState('')
	const [objectivePeriodType, setObjectivePeriodType] = useState<'quarter' | 'month'>('quarter')
	const [objectiveTeam, setObjectiveTeam] = useState('')
	const [objectiveOwner, setObjectiveOwner] = useState('')
	const [objectiveStatus, setObjectiveStatus] = useState<Objective['status']>('on-track')
	const [objectiveStartDate, setObjectiveStartDate] = useState('')
	const [objectiveEndDate, setObjectiveEndDate] = useState('')
	
	// Form states for Key Result
	const [krDescription, setKrDescription] = useState('')
	const [krTarget, setKrTarget] = useState('')
	const [krCurrent, setKrCurrent] = useState('')
	const [krUnit, setKrUnit] = useState('')
	const [krOwner, setKrOwner] = useState('')

	// Generate periods dynamically (quarters and months)
	const generatePeriods = () => {
		const now = new Date()
		const currentYear = now.getFullYear()
		const currentMonth = now.getMonth() // 0-11
		const currentQuarter = Math.floor(currentMonth / 3) + 1 // 1-4
		
		const periods: Array<{ value: string; type: 'quarter' | 'month'; label: string }> = []
		
		// Generate quarters (current + next 4 quarters = 5 quarters)
		let year = currentYear
		let quarter = currentQuarter
		for (let i = 0; i < 5; i++) {
			const value = `Q${quarter} ${year}`
			periods.push({
				value,
				type: 'quarter',
				label: `🗓️ ${value} (Quarter)`
			})
			quarter++
			if (quarter > 4) {
				quarter = 1
				year++
			}
		}
		
		// Generate months (current + next 12 months = 13 months)
		const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
		let monthYear = currentYear
		let month = currentMonth
		for (let i = 0; i < 13; i++) {
			const value = `${monthNames[month]} ${monthYear}`
			periods.push({
				value,
				type: 'month',
				label: `📅 ${value} (Month)`
			})
			month++
			if (month > 11) {
				month = 0
				monthYear++
			}
		}
		
		return periods
	}

	const periods = generatePeriods()

	useEffect(() => {
		loadObjectives()
		loadWorkEntries()
	}, [])

	const loadObjectives = () => {
		try {
			const saved = storage.get<any>('objectives')
			if (saved) {
				setObjectives(JSON.parse(saved))
			} else {
				// Initialize with mock data
				const mockObjectives: Objective[] = [
					{
						id: '1',
						title: 'Increase Product Market Fit',
						description: 'Improve product-market fit by enhancing core features and user satisfaction',
						period: 'Q4 2024',
						periodType: 'quarter',
						owner: 'John Doe',
						team: 'Product',
						status: 'on-track',
						startDate: '2024-10-01',
						endDate: '2024-12-31',
						keyResults: [
							{
								id: 'kr1',
								description: 'Achieve Net Promoter Score (NPS) of 50+',
								target: 50,
								current: 42,
								unit: 'score',
								owner: 'John Doe',
							},
							{
								id: 'kr2',
								description: 'Increase daily active users to 10,000',
								target: 10000,
								current: 7500,
								unit: 'users',
								owner: 'Jane Smith',
							},
							{
								id: 'kr3',
								description: 'Reduce customer churn rate to below 5%',
								target: 5,
								current: 7.2,
								unit: '%',
								owner: 'Mike Johnson',
							},
						],
					},
					{
						id: '2',
						title: 'Scale Revenue Growth',
						description: 'Drive sustainable revenue growth through new customer acquisition and expansion',
						period: 'Dec 2024',
						periodType: 'month',
						owner: 'Sarah Lee',
						team: 'Sales',
						status: 'at-risk',
						startDate: '2024-10-01',
						endDate: '2024-12-31',
						keyResults: [
							{
								id: 'kr4',
								description: 'Generate $500K in new MRR',
								target: 500000,
								current: 320000,
								unit: 'USD',
								owner: 'Sarah Lee',
							},
							{
								id: 'kr5',
								description: 'Close 50 new enterprise deals',
								target: 50,
								current: 28,
								unit: 'deals',
								owner: 'Tom Brown',
							},
							{
								id: 'kr6',
								description: 'Achieve 120% net revenue retention',
								target: 120,
								current: 105,
								unit: '%',
								owner: 'Sarah Lee',
							},
						],
					},
					// ... (rest of mock data omitted for brevity, assume it's there or loaded from storage)
				]
			setObjectives(mockObjectives)
			localStorage.setItem('objectives', JSON.stringify(mockObjectives))
			}
		} catch (error) {
			console.error('Failed to load objectives:', error)
			toast.error('목표 데이터 로드 실패')
		}
	}

	const loadWorkEntries = () => {
		try {
			const saved = storage.get<any>('workEntries')
			if (saved) {
				const parsed = JSON.parse(saved)
				const entriesWithDates = parsed.map((entry: any) => ({
					id: entry.id,
					title: entry.title,
					category: entry.category,
					objectiveId: entry.objectiveId,
					date: new Date(entry.date),
					duration: entry.duration,
				}))
				setWorkEntries(entriesWithDates)
			}
		} catch (error) {
			console.error('Failed to load work entries:', error)
		}
	}

	const saveObjectives = (updatedObjectives: Objective[]) => {
		try {
			localStorage.setItem('objectives', JSON.stringify(updatedObjectives))
			setObjectives(updatedObjectives)
		} catch (error) {
			console.error('Failed to save objectives:', error)
			toast.error('목표 저장 실패')
		}
	}

	const toggleObjective = (id: string) => {
		setExpandedObjectives((prev) =>
			prev.includes(id) ? prev.filter((objId) => objId !== id) : [...prev, id]
		)
	}

	const calculateProgress = (keyResults: KeyResult[]) => {
		if (keyResults.length === 0) return 0
		const totalProgress = keyResults.reduce((sum, kr) => {
			const progress = Math.min((kr.current / kr.target) * 100, 100)
			return sum + progress
		}, 0)
		return Math.round(totalProgress / keyResults.length)
	}

	const getStatusColor = (status: Objective['status']) => {
		switch (status) {
			case 'on-track':
				return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
			case 'at-risk':
				return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
			case 'behind':
				return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
			case 'completed':
				return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
		}
	}

	const getStatusIcon = (status: Objective['status']) => {
		switch (status) {
			case 'on-track':
				return <CheckCircle2 className="h-4 w-4" />
			case 'at-risk':
				return <AlertCircle className="h-4 w-4" />
			case 'behind':
				return <AlertCircle className="h-4 w-4" />
			case 'completed':
				return <CheckCircle2 className="h-4 w-4" />
		}
	}

	const formatNumber = (value: number, unit: string) => {
		if (unit === 'USD') {
			return new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD',
				minimumFractionDigits: 0,
			}).format(value)
		}
		return `${value.toLocaleString()} ${unit}`
	}

	// Handle Add Objective
	const handleOpenAddObjective = () => {
		resetObjectiveForm()
		setShowAddObjective(true)
	}

	const handleCreateObjective = () => {
		if (!objectiveTitle.trim()) {
			toast.error('목표 제목을 입력해주세요')
			return
		}

		const newObjective: Objective = {
			id: Date.now().toString(),
			title: objectiveTitle,
			description: objectiveDescription,
			period: objectivePeriod,
			periodType: objectivePeriodType,
			team: objectiveTeam,
			owner: objectiveOwner,
			status: objectiveStatus,
			startDate: objectiveStartDate,
			endDate: objectiveEndDate,
			keyResults: [],
		}

		const updatedObjectives = [...objectives, newObjective]
		saveObjectives(updatedObjectives)
		setShowAddObjective(false)
		toast.success('목표가 생성되었습니다')
		resetObjectiveForm()
	}

	// Handle Edit Objective
	const handleOpenEditObjective = (objective: Objective) => {
		setEditingObjective(objective)
		setObjectiveTitle(objective.title)
		setObjectiveDescription(objective.description)
		setObjectivePeriod(objective.period)
		setObjectivePeriodType(objective.periodType)
		setObjectiveTeam(objective.team)
		setObjectiveOwner(objective.owner)
		setObjectiveStatus(objective.status)
		setObjectiveStartDate(objective.startDate)
		setObjectiveEndDate(objective.endDate)
		setShowEditObjective(true)
	}

	const handleUpdateObjective = () => {
		if (!editingObjective || !objectiveTitle.trim()) {
			toast.error('목표 제목을 입력해주세요')
			return
		}

		const updatedObjectives = objectives.map((obj) =>
			obj.id === editingObjective.id
				? {
						...obj,
						title: objectiveTitle,
						description: objectiveDescription,
						period: objectivePeriod,
						periodType: objectivePeriodType,
						team: objectiveTeam,
						owner: objectiveOwner,
						status: objectiveStatus,
						startDate: objectiveStartDate,
						endDate: objectiveEndDate,
					}
				: obj
		)

		saveObjectives(updatedObjectives)
		setShowEditObjective(false)
		toast.success('목표가 수정되었습니다')
		resetObjectiveForm()
	}

	// Handle Delete Objective
	const handleDeleteObjective = (objectiveId: string) => {
		if (!confirm('이 목표를 삭제하시겠습니까?')) return

		const updatedObjectives = objectives.filter((obj) => obj.id !== objectiveId)
		saveObjectives(updatedObjectives)
		toast.success('목표가 삭제되었습니다')
	}

	// Handle Add Key Result
	const handleOpenAddKeyResult = (objectiveId: string) => {
		setSelectedObjectiveId(objectiveId)
		resetKeyResultForm()
		setShowAddKeyResult(true)
	}

	const handleCreateKeyResult = () => {
		if (!krDescription.trim() || !krTarget || !krUnit.trim()) {
			toast.error('모든 필수 항목을 입력해주세요')
			return
		}

		const newKeyResult: KeyResult = {
			id: Date.now().toString(),
			description: krDescription,
			target: parseFloat(krTarget),
			current: parseFloat(krCurrent) || 0,
			unit: krUnit,
			owner: krOwner,
		}

		const updatedObjectives = objectives.map((obj) =>
			obj.id === selectedObjectiveId
				? { ...obj, keyResults: [...obj.keyResults, newKeyResult] }
				: obj
		)

		saveObjectives(updatedObjectives)
		setShowAddKeyResult(false)
		toast.success('핵심 결과가 추가되었습니다')
		resetKeyResultForm()
	}


	// Helper functions
	const resetObjectiveForm = () => {
		setObjectiveTitle('')
		setObjectiveDescription('')
		setObjectivePeriod(periods[0].value) // Set to current quarter
		setObjectivePeriodType(periods[0].type)
		setObjectiveTeam('')
		setObjectiveOwner('')
		setObjectiveStatus('on-track')
		setObjectiveStartDate('')
		setObjectiveEndDate('')
		setEditingObjective(null)
	}

	const resetKeyResultForm = () => {
		setKrDescription('')
		setKrTarget('')
		setKrCurrent('')
		setKrUnit('')
		setKrOwner('')
	}

	const filteredObjectives = objectives.filter((obj) => obj.period === selectedQuarter)

	const overallStats = {
		totalObjectives: filteredObjectives.length,
		onTrack: filteredObjectives.filter((obj) => obj.status === 'on-track').length,
		atRisk: filteredObjectives.filter((obj) => obj.status === 'at-risk').length,
		behind: filteredObjectives.filter((obj) => obj.status === 'behind').length,
		completed: filteredObjectives.filter((obj) => obj.status === 'completed').length,
		avgProgress: Math.round(
			filteredObjectives.reduce((sum, obj) => sum + calculateProgress(obj.keyResults), 0) /
				(filteredObjectives.length || 1)
		),
	}

	return (
		<div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
			<Toaster />
		
		{/* Header */}
		<PageHeader
			title="My Goals (OKR)"
			description="Set objectives and track key results to achieve your goals"
			icon={Target}
			actions={
				<Button onClick={handleOpenAddObjective} size="sm">
					<Plus className="h-4 w-4 sm:mr-2" />
					<span className="hidden sm:inline">Add Objective</span>
				</Button>
			}
		/>
		
		<div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">

	{/* Period Filter & Stats */}
	<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
		{/* Period Selector */}
		<Card>
			<CardContent className="p-4">
				<label className="block text-sm font-medium mb-3">Select Period</label>
				
				{/* Period Type Toggle */}
				<div className="flex gap-2 mb-3">
					<button
						onClick={() => {
							const firstQuarter = periods.find(p => p.type === 'quarter')
							if (firstQuarter) setSelectedQuarter(firstQuarter.value)
						}}
						className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
							periods.find(p => p.value === selectedQuarter)?.type === 'quarter'
								? 'bg-primary text-white'
								: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
						}`}
					>
						🗓️ Quarter
					</button>
					<button
						onClick={() => {
							const firstMonth = periods.find(p => p.type === 'month')
							if (firstMonth) setSelectedQuarter(firstMonth.value)
						}}
						className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
							periods.find(p => p.value === selectedQuarter)?.type === 'month'
								? 'bg-primary text-white'
								: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
						}`}
					>
						📅 Month
					</button>
				</div>
				
				{/* Period Options */}
				<div className="flex flex-wrap gap-1.5">
					{periods
						.filter(p => p.type === (periods.find(p => p.value === selectedQuarter)?.type || 'quarter'))
						.map((period) => (
							<button
								key={period.value}
								onClick={() => setSelectedQuarter(period.value)}
								className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
									selectedQuarter === period.value
										? 'bg-primary text-white shadow-sm'
										: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
								}`}
							>
								{period.value}
							</button>
						))}
				</div>
			</CardContent>
		</Card>

			{/* Overall Progress */}
			<Card>
				<CardContent className="p-4">
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
							Overall Progress
						</span>
						<span className="text-2xl font-bold text-primary">{overallStats.avgProgress}%</span>
					</div>
					<div className="relative w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
						<div
							className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-300"
							style={{ width: `${overallStats.avgProgress}%` }}
						/>
					</div>
				</CardContent>
			</Card>

			{/* Status Summary */}
			<Card>
				<CardContent className="p-4">
					<div className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
						Status Summary
					</div>
					<div className="grid grid-cols-2 gap-2">
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 rounded-full bg-green-600" />
							<span className="text-xs">On Track: {overallStats.onTrack}</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 rounded-full bg-orange-600" />
							<span className="text-xs">At Risk: {overallStats.atRisk}</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 rounded-full bg-red-600" />
							<span className="text-xs">Behind: {overallStats.behind}</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 rounded-full bg-blue-600" />
							<span className="text-xs">Completed: {overallStats.completed}</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>

		{/* Charts Section */}
		{filteredObjectives.length > 0 && (
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				{/* Status Distribution Donut Chart */}
				<Card>
					<CardHeader>
						<h3 className="font-bold flex items-center gap-2">
							<BarChart3 className="h-5 w-5 text-primary" />
							Status Distribution
						</h3>
					</CardHeader>
					<CardContent className="p-6">
						<ResponsiveContainer width="100%" height={250}>
							<PieChart>
								<Pie
									data={[
										{ name: 'On Track', value: overallStats.onTrack, color: '#16a34a' },
										{ name: 'At Risk', value: overallStats.atRisk, color: '#ea580c' },
										{ name: 'Behind', value: overallStats.behind, color: '#dc2626' },
										{ name: 'Completed', value: overallStats.completed, color: '#2563eb' },
									].filter(item => item.value > 0)}
									cx="50%"
									cy="50%"
									innerRadius={60}
									outerRadius={90}
									paddingAngle={2}
									dataKey="value"
								>
									{[
										{ name: 'On Track', value: overallStats.onTrack, color: '#16a34a' },
										{ name: 'At Risk', value: overallStats.atRisk, color: '#ea580c' },
										{ name: 'Behind', value: overallStats.behind, color: '#dc2626' },
										{ name: 'Completed', value: overallStats.completed, color: '#2563eb' },
									].filter(item => item.value > 0).map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} />
									))}
								</Pie>
								<Tooltip 
									contentStyle={{ 
										backgroundColor: 'rgba(255, 255, 255, 0.95)', 
										border: '1px solid #e5e7eb',
										borderRadius: '8px',
										padding: '8px 12px'
									}}
								/>
								<Legend 
									verticalAlign="bottom" 
									height={36}
									iconType="circle"
								/>
							</PieChart>
						</ResponsiveContainer>
						<div className="text-center mt-2">
							<div className="text-2xl font-bold text-primary">{overallStats.totalObjectives}</div>
							<div className="text-xs text-neutral-600 dark:text-neutral-400">Total Objectives</div>
						</div>
					</CardContent>
				</Card>

				{/* Progress by Objective Bar Chart */}
				<Card>
					<CardHeader>
						<h3 className="font-bold flex items-center gap-2">
							<TrendingUp className="h-5 w-5 text-primary" />
							Progress Overview
						</h3>
					</CardHeader>
					<CardContent className="p-6">
						<ResponsiveContainer width="100%" height={250}>
							<BarChart
								data={filteredObjectives.map(obj => ({
									name: obj.title.length > 15 ? obj.title.substring(0, 15) + '...' : obj.title,
									progress: calculateProgress(obj.keyResults),
								}))}
								margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
							>
								<CartesianGrid strokeDasharray="3 3" opacity={0.1} />
								<XAxis 
									dataKey="name" 
									tick={{ fontSize: 11 }}
									angle={-45}
									textAnchor="end"
									height={80}
								/>
								<YAxis 
									tick={{ fontSize: 11 }}
									domain={[0, 100]}
								/>
								<Tooltip 
									contentStyle={{ 
										backgroundColor: 'rgba(255, 255, 255, 0.95)', 
										border: '1px solid #e5e7eb',
										borderRadius: '8px',
										padding: '8px 12px'
									}}
									formatter={(value: number) => [`${value}%`, 'Progress']}
								/>
								<Bar 
									dataKey="progress" 
									fill="#3b82f6"
									radius={[4, 4, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
						<div className="flex items-center justify-center gap-2 mt-2">
							<div className="w-3 h-3 rounded-sm bg-primary"></div>
							<span className="text-xs text-neutral-600 dark:text-neutral-400">
								Average: {overallStats.avgProgress}%
							</span>
						</div>
					</CardContent>
				</Card>
			</div>
		)}

		{/* Objectives List */}
		<div className="space-y-4">
			{filteredObjectives.length === 0 ? (
				<EmptyState
					icon={<Target className="h-12 w-12" />}
					title={`No Objectives for ${selectedQuarter}`}
					description="Create your first objective to start tracking your goals"
					action={
						<Button onClick={handleOpenAddObjective}>
							<Plus className="h-4 w-4 mr-2" />
							Add Objective
						</Button>
					}
				/>
			) : (
				filteredObjectives.map((objective) => {
					const progress = calculateProgress(objective.keyResults)
					const isExpanded = expandedObjectives.includes(objective.id)

					return (
						<Card key={objective.id} className="hover:shadow-lg transition-shadow">
							<CardHeader>
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<div className="flex items-center gap-3 mb-2">
											<button
												onClick={() => toggleObjective(objective.id)}
												className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
											>
												{isExpanded ? (
													<ChevronUp className="h-5 w-5" />
												) : (
													<ChevronDown className="h-5 w-5" />
												)}
											</button>
											<h3 className="text-xl font-bold flex-1">{objective.title}</h3>
											<span
												className={`flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(
													objective.status
												)}`}
											>
												{getStatusIcon(objective.status)}
												{objective.status.replace('-', ' ').toUpperCase()}
											</span>
										</div>
										<p className="text-sm text-neutral-600 dark:text-neutral-400 ml-8">
											{objective.description}
										</p>
										<div className="flex items-center gap-4 mt-3 ml-8 text-xs text-neutral-500">
											<span className="flex items-center gap-1">
												<Users className="h-3 w-3" />
												{objective.team}
											</span>
											<span className="flex items-center gap-1">
												<Flag className="h-3 w-3" />
												{objective.owner}
											</span>
											<span className="flex items-center gap-1">
												<Calendar className="h-3 w-3" />
												{objective.startDate} - {objective.endDate}
											</span>
										</div>
									</div>
									<div className="flex items-center gap-2 ml-4">
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleOpenEditObjective(objective)}
										>
											<Edit2 className="h-3 w-3" />
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleDeleteObjective(objective.id)}
										>
											<Trash2 className="h-3 w-3 text-red-500" />
										</Button>
									</div>
								</div>

								{/* Progress Bar */}
								<div className="mt-4 ml-8">
									<div className="flex items-center justify-between mb-2">
										<span className="text-sm font-medium">Overall Progress</span>
										<span className="text-sm font-bold text-primary">{progress}%</span>
									</div>
									<div className="relative w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
										<div
											className={`absolute top-0 left-0 h-full rounded-full transition-all duration-300 ${
												progress >= 75
													? 'bg-green-600'
													: progress >= 50
														? 'bg-primary'
														: 'bg-orange-600'
											}`}
											style={{ width: `${progress}%` }}
										/>
									</div>
								</div>
							</CardHeader>

							{/* Key Results */}
							{isExpanded && (
								<CardContent className="pt-0">
									<div className="ml-8 space-y-3">
										<div className="flex items-center justify-between mb-3">
											<h4 className="font-bold text-sm">Key Results</h4>
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleOpenAddKeyResult(objective.id)}
											>
												<Plus className="h-3 w-3 mr-1" />
												Add Key Result
											</Button>
										</div>

										{objective.keyResults.length === 0 ? (
											<p className="text-sm text-neutral-500 italic py-4">
												No key results yet. Add your first key result to track progress.
											</p>
										) : (
											objective.keyResults.map((kr, index) => {
												const krProgress = Math.min((kr.current / kr.target) * 100, 100)

												return (
													<div
														key={kr.id}
														className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl"
													>
														<div className="flex items-start justify-between mb-2">
															<div className="flex-1">
																<div className="flex items-center gap-2 mb-1">
																	<span className="text-xs font-bold text-neutral-500">
																		KR {index + 1}
																	</span>
																	<span className="text-sm font-medium">
																		{kr.description}
																	</span>
																</div>
																<p className="text-xs text-neutral-600 dark:text-neutral-400">
																	Owner: {kr.owner}
																</p>
															</div>
															<div className="text-right ml-4">
																<div className="text-lg font-bold">
																	{formatNumber(kr.current, kr.unit)}
																</div>
																<div className="text-xs text-neutral-600 dark:text-neutral-400">
																	of {formatNumber(kr.target, kr.unit)}
																</div>
															</div>
														</div>

														<div className="relative w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
															<div
																className={`absolute top-0 left-0 h-full rounded-full transition-all duration-300 ${
																	krProgress >= 100
																		? 'bg-green-600'
																		: krProgress >= 75
																			? 'bg-primary'
																			: krProgress >= 50
																				? 'bg-orange-600'
																				: 'bg-red-600'
																}`}
																style={{ width: `${krProgress}%` }}
															/>
														</div>

										<div className="flex items-center justify-between mt-2">
											<span className="text-xs text-neutral-500">
												{Math.round(krProgress)}% Complete
											</span>
											<span className="text-xs text-neutral-500 italic flex items-center gap-1">
												<FileText className="h-3 w-3" />
												Update via Work Input
											</span>
										</div>
													</div>
												)
											})
										)}

										{/* Related Work Entries */}
										<div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
											<h4 className="font-bold text-sm mb-3 flex items-center gap-2">
												<FileText className="h-4 w-4" />
												Related Work ({workEntries.filter((w) => w.objectiveId === objective.id).length})
											</h4>
											{workEntries.filter((w) => w.objectiveId === objective.id).length === 0 ? (
												<p className="text-xs text-neutral-500 italic">
													No work entries linked to this objective yet
												</p>
											) : (
												<div className="space-y-2">
													{workEntries
														.filter((w) => w.objectiveId === objective.id)
														.slice(0, 5)
														.map((entry) => (
															<div
																key={entry.id}
																className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg"
															>
																<div className="flex-1 min-w-0">
																	<p className="text-sm font-medium truncate">
																		{entry.title}
																	</p>
																	<div className="flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400 mt-1">
																		<span className="flex items-center gap-1">
																			<Calendar className="h-3 w-3" />
																			{entry.date.toLocaleDateString()}
																		</span>
																		{entry.duration && (
																			<span className="flex items-center gap-1">
																				<Clock className="h-3 w-3" />
																				{entry.duration}
																			</span>
																		)}
																	</div>
																</div>
															</div>
														))}
													{workEntries.filter((w) => w.objectiveId === objective.id).length > 5 && (
														<p className="text-xs text-center text-neutral-500">
															+{workEntries.filter((w) => w.objectiveId === objective.id).length - 5} more
														</p>
													)}
												</div>
											)}
										</div>
									</div>
								</CardContent>
							)}
						</Card>
					)
				})
			)}
		</div>

		{/* Add Objective Dialog */}
		{showAddObjective && (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
				<div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
					<div className="p-6">
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-2xl font-bold flex items-center gap-2">
								<Target className="h-6 w-6 text-primary" />
								Add New Objective
							</h3>
							<button
								onClick={() => setShowAddObjective(false)}
								className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
							>
								<X className="h-6 w-6" />
							</button>
						</div>

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium mb-2">
									Objective Title <span className="text-red-500">*</span>
								</label>
								<Input
									value={objectiveTitle}
									onChange={(e) => setObjectiveTitle(e.target.value)}
									placeholder="e.g., Increase Product Market Fit"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium mb-2">Description</label>
								<Textarea
									value={objectiveDescription}
									onChange={(e) => setObjectiveDescription(e.target.value)}
									placeholder="Describe the objective in detail..."
									rows={3}
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium mb-2">
										Period <span className="text-red-500">*</span>
									</label>
									<select
										value={objectivePeriod}
										onChange={(e) => {
											const selectedPeriod = periods.find(p => p.value === e.target.value)
											if (selectedPeriod) {
												setObjectivePeriod(selectedPeriod.value)
												setObjectivePeriodType(selectedPeriod.type)
											}
										}}
										className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900"
									>
										<optgroup label="📅 Quarters">
											{periods.filter(p => p.type === 'quarter').map((period) => (
												<option key={period.value} value={period.value}>
													{period.value}
												</option>
											))}
										</optgroup>
										<optgroup label="🗓️ Months">
											{periods.filter(p => p.type === 'month').map((period) => (
												<option key={period.value} value={period.value}>
													{period.value}
												</option>
											))}
										</optgroup>
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">Team</label>
									<Input
										value={objectiveTeam}
										onChange={(e) => setObjectiveTeam(e.target.value)}
										placeholder="e.g., Product"
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium mb-2">Owner</label>
								<Input
									value={objectiveOwner}
									onChange={(e) => setObjectiveOwner(e.target.value)}
									placeholder="e.g., John Doe"
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium mb-2">Start Date</label>
									<Input
										type="date"
										value={objectiveStartDate}
										onChange={(e) => setObjectiveStartDate(e.target.value)}
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">End Date</label>
									<Input
										type="date"
										value={objectiveEndDate}
										onChange={(e) => setObjectiveEndDate(e.target.value)}
									/>
								</div>
							</div>

							<div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
								<p className="text-xs text-neutral-600 dark:text-neutral-400">
									💡 You can add key results after creating the objective
								</p>
							</div>

							<div className="flex items-center gap-2 pt-4">
								<Button className="flex-1" onClick={handleCreateObjective}>
									<Save className="h-4 w-4 mr-2" />
									Create Objective
								</Button>
								<Button
									variant="outline"
									onClick={() => setShowAddObjective(false)}
									className="flex-1"
								>
									Cancel
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		)}

		{/* Edit Objective Dialog */}
		{showEditObjective && editingObjective && (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
				<div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
					<div className="p-6">
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-2xl font-bold flex items-center gap-2">
								<Edit2 className="h-6 w-6 text-primary" />
								Edit Objective
							</h3>
							<button
								onClick={() => setShowEditObjective(false)}
								className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
							>
								<X className="h-6 w-6" />
							</button>
						</div>

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium mb-2">
									Objective Title <span className="text-red-500">*</span>
								</label>
								<Input
									value={objectiveTitle}
									onChange={(e) => setObjectiveTitle(e.target.value)}
									placeholder="e.g., Increase Product Market Fit"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium mb-2">Description</label>
								<Textarea
									value={objectiveDescription}
									onChange={(e) => setObjectiveDescription(e.target.value)}
									placeholder="Describe the objective in detail..."
									rows={3}
								/>
							</div>

							{/* Status Display (Read-only) */}
							{editingObjective && (
								<div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-200 dark:border-neutral-700">
									<div className="flex items-center justify-between">
										<div>
											<label className="block text-sm font-medium mb-1">Current Status</label>
											<p className="text-xs text-neutral-500 dark:text-neutral-400">
												Auto-calculated from Key Results progress
											</p>
										</div>
										<span
											className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full ${getStatusColor(
												objectiveStatus
											)}`}
										>
											{getStatusIcon(objectiveStatus)}
											{objectiveStatus.charAt(0).toUpperCase() + objectiveStatus.slice(1)}
										</span>
									</div>
									{editingObjective.keyResults.length > 0 && (
										<div className="mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
											<div className="flex items-center justify-between text-xs">
												<span className="text-neutral-600 dark:text-neutral-400">Overall Progress</span>
												<span className="font-medium">
													{calculateProgress(editingObjective.keyResults)}%
												</span>
											</div>
										</div>
									)}
								</div>
							)}

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium mb-2">Period</label>
									<select
										value={objectivePeriod}
										onChange={(e) => {
											const selectedPeriod = periods.find(p => p.value === e.target.value)
											if (selectedPeriod) {
												setObjectivePeriod(selectedPeriod.value)
												setObjectivePeriodType(selectedPeriod.type)
											}
										}}
										className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900"
									>
										<optgroup label="📅 Quarters">
											{periods.filter(p => p.type === 'quarter').map((period) => (
												<option key={period.value} value={period.value}>
													{period.value}
												</option>
											))}
										</optgroup>
										<optgroup label="🗓️ Months">
											{periods.filter(p => p.type === 'month').map((period) => (
												<option key={period.value} value={period.value}>
													{period.value}
												</option>
											))}
										</optgroup>
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">Team</label>
									<Input
										value={objectiveTeam}
										onChange={(e) => setObjectiveTeam(e.target.value)}
										placeholder="e.g., Product"
									/>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium mb-2">Owner</label>
									<Input
										value={objectiveOwner}
										onChange={(e) => setObjectiveOwner(e.target.value)}
										placeholder="e.g., John Doe"
									/>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium mb-2">Start Date</label>
									<Input
										type="date"
										value={objectiveStartDate}
										onChange={(e) => setObjectiveStartDate(e.target.value)}
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">End Date</label>
									<Input
										type="date"
										value={objectiveEndDate}
										onChange={(e) => setObjectiveEndDate(e.target.value)}
									/>
								</div>
							</div>

							<div className="flex items-center gap-2 pt-4">
								<Button className="flex-1" onClick={handleUpdateObjective}>
									<Save className="h-4 w-4 mr-2" />
									Save Changes
								</Button>
								<Button
									variant="outline"
									onClick={() => setShowEditObjective(false)}
									className="flex-1"
								>
									Cancel
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		)}

		{/* Add Key Result Dialog */}
		{showAddKeyResult && (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
				<div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-lg">
					<div className="p-6">
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-xl font-bold flex items-center gap-2">
								<Target className="h-5 w-5 text-primary" />
								Add Key Result
							</h3>
							<button
								onClick={() => setShowAddKeyResult(false)}
								className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
							>
								<X className="h-5 w-5" />
							</button>
						</div>

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium mb-2">
									Description <span className="text-red-500">*</span>
								</label>
								<Textarea
									value={krDescription}
									onChange={(e) => setKrDescription(e.target.value)}
									placeholder="e.g., Achieve Net Promoter Score (NPS) of 50+"
									rows={2}
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium mb-2">
										Target <span className="text-red-500">*</span>
									</label>
									<Input
										type="number"
										value={krTarget}
										onChange={(e) => setKrTarget(e.target.value)}
										placeholder="e.g., 50"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">
										Unit <span className="text-red-500">*</span>
									</label>
									<Input
										value={krUnit}
										onChange={(e) => setKrUnit(e.target.value)}
										placeholder="e.g., score, %, USD"
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium mb-2">Current Progress</label>
								<Input
									type="number"
									value={krCurrent}
									onChange={(e) => setKrCurrent(e.target.value)}
									placeholder="e.g., 42"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium mb-2">Owner</label>
								<Input
									value={krOwner}
									onChange={(e) => setKrOwner(e.target.value)}
									placeholder="e.g., John Doe"
								/>
							</div>

							<div className="flex items-center gap-2 pt-4">
								<Button className="flex-1" onClick={handleCreateKeyResult}>
									<Save className="h-4 w-4 mr-2" />
									Add Key Result
								</Button>
								<Button
									variant="outline"
									onClick={() => setShowAddKeyResult(false)}
									className="flex-1"
								>
									Cancel
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		)}

		</div>
		</div>
	)
}
