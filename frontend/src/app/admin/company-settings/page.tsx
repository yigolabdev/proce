import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Textarea from '../../../components/ui/Textarea'
import { 
	Building2, 
	DollarSign, 
	Target, 
	Save, 
	X,
	Plus,
	Trash2,
	TrendingUp,
	CheckCircle2
} from 'lucide-react'
import { toast } from 'sonner'

interface CompanyInfo {
	// 기본 정보
	name: string
	legalName: string
	businessNumber: string
	taxId: string
	
	// 산업 및 분류
	industry: string
	subIndustry: string
	businessType: string
	companySize: string
	
	// 설립 정보
	foundedYear: string
	foundedDate: string
	
	// 인력 정보
	employeeCount: string
	fullTimeCount: string
	partTimeCount: string
	contractorCount: string
	
	// 연락처 정보
	address: string
	detailedAddress: string
	city: string
	state: string
	postalCode: string
	country: string
	phone: string
	fax: string
	email: string
	
	// 온라인 정보
	website: string
	linkedIn: string
	facebook: string
	twitter: string
	
	// 대표자 정보
	ceoName: string
	ceoEmail: string
	ceoPhone: string
	
	// 재무 담당자 정보
	cfoName: string
	cfoEmail: string
	cfoPhone: string
	
	// 회사 설명
	description: string
	vision: string
	mission: string
	coreValues: string
	
	// 추가 정보
	stockSymbol: string
	stockExchange: string
	fiscalYearEnd: string
	timezone: string
	currency: string
	language: string
}

interface FinancialData {
	year: string
	totalRevenue: string
	netIncome: string
	totalAssets: string
	totalLiabilities: string
	longTermDebt: string
	totalEquity: string
}

interface KPI {
	id: string
	name: string
	target: string
	unit: string
	category: string
	description: string
}

export default function CompanySettingsPage() {
	// Company Info State
	const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
		// 기본 정보
		name: 'Proce Inc.',
		legalName: 'Proce Incorporated',
		businessNumber: '123-45-67890',
		taxId: 'TAX-2024-001',
		
		// 산업 및 분류
		industry: 'Software & Technology',
		subIndustry: 'Enterprise Software',
		businessType: 'Corporation',
		companySize: 'Medium (100-500)',
		
		// 설립 정보
		foundedYear: '2020',
		foundedDate: '2020-03-15',
		
		// 인력 정보
		employeeCount: '247',
		fullTimeCount: '220',
		partTimeCount: '15',
		contractorCount: '12',
		
		// 연락처 정보
		address: '서울특별시 강남구 테헤란로 123',
		detailedAddress: '프로세 빌딩 10층',
		city: '서울',
		state: '강남구',
		postalCode: '06234',
		country: '대한민국',
		phone: '+82-2-1234-5678',
		fax: '+82-2-1234-5679',
		email: 'contact@proce.com',
		
		// 온라인 정보
		website: 'https://proce.com',
		linkedIn: 'https://linkedin.com/company/proce',
		facebook: 'https://facebook.com/proce',
		twitter: 'https://twitter.com/proce',
		
		// 대표자 정보
		ceoName: '김대표',
		ceoEmail: 'ceo@proce.com',
		ceoPhone: '+82-10-1234-5678',
		
		// 재무 담당자 정보
		cfoName: '이재무',
		cfoEmail: 'cfo@proce.com',
		cfoPhone: '+82-10-2345-6789',
		
		// 회사 설명
		description: '데이터 기반 의사결정 플랫폼을 제공하는 기업입니다.',
		vision: '데이터 기반 의사결정으로 모든 기업이 성공할 수 있는 세상을 만듭니다.',
		mission: '직원들의 업무 데이터를 수집하고 분석하여 실시간 인사이트를 제공합니다.',
		coreValues: '데이터 중심 사고, 지속적인 혁신, 투명한 소통, 고객 성공 우선',
		
		// 추가 정보
		stockSymbol: 'PROC',
		stockExchange: 'KOSDAQ',
		fiscalYearEnd: '12-31',
		timezone: 'Asia/Seoul',
		currency: 'KRW',
		language: 'ko-KR',
	})

	// Financial Data State
	const [financialRecords, setFinancialRecords] = useState<FinancialData[]>([
		{
			year: '2024',
			totalRevenue: '12400000',
			netIncome: '4200000',
			totalAssets: '18500000',
			totalLiabilities: '6200000',
			longTermDebt: '3100000',
			totalEquity: '12300000',
		},
		{
			year: '2023',
			totalRevenue: '10500000',
			netIncome: '3500000',
			totalAssets: '15200000',
			totalLiabilities: '5100000',
			longTermDebt: '2800000',
			totalEquity: '10100000',
		},
	])

	// KPI State
	const [kpis, setKpis] = useState<KPI[]>([
		{
			id: '1',
			name: 'Monthly Recurring Revenue',
			target: '1000000',
			unit: 'USD',
			category: 'Revenue',
			description: '월간 반복 매출',
		},
		{
			id: '2',
			name: 'Customer Acquisition Cost',
			target: '500',
			unit: 'USD',
			category: 'Marketing',
			description: '고객 획득 비용',
		},
		{
			id: '3',
			name: 'Customer Lifetime Value',
			target: '5000',
			unit: 'USD',
			category: 'Revenue',
			description: '고객 생애 가치',
		},
		{
			id: '4',
			name: 'Employee Productivity Score',
			target: '85',
			unit: '%',
			category: 'Operations',
			description: '직원 생산성 점수',
		},
	])

	const [activeTab, setActiveTab] = useState<'company' | 'financial' | 'kpi'>('company')
	const [showAddKPI, setShowAddKPI] = useState(false)
	const [newKPI, setNewKPI] = useState<Omit<KPI, 'id'>>({
		name: '',
		target: '',
		unit: '',
		category: '',
		description: '',
	})

	// Company Info Handlers
	const handleCompanyInfoChange = (field: keyof CompanyInfo, value: string) => {
		setCompanyInfo((prev) => ({ ...prev, [field]: value }))
	}

	const handleSaveCompanyInfo = () => {
		// Mock save
		toast.success('기업 정보가 저장되었습니다')
	}

	// Financial Data Handlers
	const handleAddFinancialRecord = () => {
		const newRecord: FinancialData = {
			year: new Date().getFullYear().toString(),
			totalRevenue: '',
			netIncome: '',
			totalAssets: '',
			totalLiabilities: '',
			longTermDebt: '',
			totalEquity: '',
		}
		setFinancialRecords([newRecord, ...financialRecords])
	}

	const handleFinancialChange = (index: number, field: keyof FinancialData, value: string) => {
		setFinancialRecords((prev) =>
			prev.map((record, i) => (i === index ? { ...record, [field]: value } : record))
		)
	}

	const handleDeleteFinancialRecord = (index: number) => {
		setFinancialRecords((prev) => prev.filter((_, i) => i !== index))
		toast.success('재무 기록이 삭제되었습니다')
	}

	const handleSaveFinancialData = () => {
		toast.success('재무 정보가 저장되었습니다')
	}

	// KPI Handlers
	const handleAddKPI = () => {
		if (!newKPI.name || !newKPI.target || !newKPI.category) {
			toast.error('필수 항목을 입력해주세요')
			return
		}

		const kpi: KPI = {
			id: Math.random().toString(36).substr(2, 9),
			...newKPI,
		}

		setKpis([...kpis, kpi])
		setNewKPI({
			name: '',
			target: '',
			unit: '',
			category: '',
			description: '',
		})
		setShowAddKPI(false)
		toast.success('KPI가 추가되었습니다')
	}

	const handleDeleteKPI = (id: string) => {
		setKpis((prev) => prev.filter((kpi) => kpi.id !== id))
		toast.success('KPI가 삭제되었습니다')
	}

	const handleSaveKPIs = () => {
		toast.success('KPI 설정이 저장되었습니다')
	}

	const formatCurrency = (value: string) => {
		if (!value) return ''
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
		}).format(Number(value))
	}

	const categories = ['Revenue', 'Marketing', 'Operations', 'Customer', 'Product', 'Finance']

	// Calculate completion progress
	const completionStats = useMemo(() => {
		// Count filled fields in CompanyInfo
		const companyInfoFields = Object.values(companyInfo)
		const totalFields = companyInfoFields.length
		const filledFields = companyInfoFields.filter(value => value && value.trim() !== '').length
		const percentage = Math.round((filledFields / totalFields) * 100)

		// Calculate section-wise completion
		const sections = [
			{
				name: 'Basic Information',
				fields: [companyInfo.name, companyInfo.legalName, companyInfo.businessNumber, companyInfo.taxId],
			},
			{
				name: 'Industry & Classification',
				fields: [companyInfo.industry, companyInfo.subIndustry, companyInfo.businessType, companyInfo.companySize],
			},
			{
				name: 'Foundation Information',
				fields: [companyInfo.foundedYear, companyInfo.foundedDate],
			},
			{
				name: 'Workforce Information',
				fields: [companyInfo.employeeCount, companyInfo.fullTimeCount, companyInfo.partTimeCount, companyInfo.contractorCount],
			},
			{
				name: 'Contact Information',
				fields: [companyInfo.address, companyInfo.detailedAddress, companyInfo.city, companyInfo.state, companyInfo.postalCode, companyInfo.country, companyInfo.phone, companyInfo.fax, companyInfo.email],
			},
			{
				name: 'Online Information',
				fields: [companyInfo.website, companyInfo.linkedIn, companyInfo.facebook, companyInfo.twitter],
			},
			{
				name: 'CEO Information',
				fields: [companyInfo.ceoName, companyInfo.ceoEmail, companyInfo.ceoPhone],
			},
			{
				name: 'CFO Information',
				fields: [companyInfo.cfoName, companyInfo.cfoEmail, companyInfo.cfoPhone],
			},
			{
				name: 'Company Description',
				fields: [companyInfo.description, companyInfo.vision, companyInfo.mission, companyInfo.coreValues],
			},
			{
				name: 'Additional Information',
				fields: [companyInfo.stockSymbol, companyInfo.stockExchange, companyInfo.fiscalYearEnd, companyInfo.timezone, companyInfo.currency, companyInfo.language],
			},
		]

		const sectionStats = sections.map(section => {
			const total = section.fields.length
			const filled = section.fields.filter(value => value && value.trim() !== '').length
			return {
				name: section.name,
				total,
				filled,
				percentage: Math.round((filled / total) * 100),
			}
		})

		return {
			totalFields,
			filledFields,
			percentage,
			sections: sectionStats,
		}
	}, [companyInfo])

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold flex items-center gap-3">
						<Building2 className="h-8 w-8 text-primary" />
						Company Settings Management
					</h1>
					<p className="mt-2 text-neutral-600 dark:text-neutral-400">
						Manage company information, financial data, and KPI targets
					</p>
				</div>
			</div>

			{/* Progress Bar - Only show for Company Info tab */}
			{activeTab === 'company' && (
				<Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
					<CardContent className="p-6">
						<div className="flex items-center justify-between mb-3">
							<div className="flex items-center gap-3">
								<CheckCircle2 className="h-5 w-5 text-primary" />
								<div>
									<h3 className="font-bold text-lg">Profile Completion</h3>
									<p className="text-sm text-neutral-600 dark:text-neutral-400">
										{completionStats.filledFields} of {completionStats.totalFields} fields completed
									</p>
								</div>
							</div>
							<div className="text-right">
								<div className="text-3xl font-bold text-primary">{completionStats.percentage}%</div>
								<p className="text-xs text-neutral-600 dark:text-neutral-400">Complete</p>
							</div>
						</div>

						{/* Main Progress Bar */}
						<div className="relative w-full h-3 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
							<div
								className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500 ease-out"
								style={{ width: `${completionStats.percentage}%` }}
							/>
						</div>

						{/* Section-wise Progress */}
						<div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
							{completionStats.sections.map((section, index) => (
								<div
									key={index}
									className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
								>
									<div className="flex items-center justify-between mb-2">
										<p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 truncate">
											{section.name}
										</p>
										<span className={`text-xs font-bold ${
											section.percentage === 100 
												? 'text-green-600 dark:text-green-400' 
												: section.percentage >= 50 
													? 'text-primary' 
													: 'text-neutral-500'
										}`}>
											{section.percentage}%
										</span>
									</div>
									<div className="relative w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
										<div
											className={`absolute top-0 left-0 h-full rounded-full transition-all duration-300 ${
												section.percentage === 100 
													? 'bg-green-600 dark:bg-green-400' 
													: section.percentage >= 50 
														? 'bg-primary' 
														: 'bg-neutral-400'
											}`}
											style={{ width: `${section.percentage}%` }}
										/>
									</div>
									<p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
										{section.filled}/{section.total} fields
									</p>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Tabs */}
			<div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800">
				<button
					onClick={() => setActiveTab('company')}
					className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
						activeTab === 'company'
							? 'border-primary text-primary'
							: 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
					}`}
				>
					<Building2 className="inline h-4 w-4 mr-2" />
					Company Info
				</button>
				<button
					onClick={() => setActiveTab('financial')}
					className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
						activeTab === 'financial'
							? 'border-primary text-primary'
							: 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
					}`}
				>
					<DollarSign className="inline h-4 w-4 mr-2" />
					Financial Data
				</button>
				<button
					onClick={() => setActiveTab('kpi')}
					className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
						activeTab === 'kpi'
							? 'border-primary text-primary'
							: 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
					}`}
				>
					<Target className="inline h-4 w-4 mr-2" />
					KPI Settings
				</button>
			</div>

			{/* Company Info Tab */}
			{activeTab === 'company' && (
				<div className="space-y-6">
					{/* 기본 정보 */}
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<h2 className="text-xl font-bold">기본 정보</h2>
									<p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
										회사의 기본 정보를 입력하세요
									</p>
								</div>
								<Button onClick={handleSaveCompanyInfo} className="flex items-center gap-2">
									<Save className="h-4 w-4" />
									저장
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium mb-2">
										회사명 <span className="text-red-500">*</span>
									</label>
									<Input
										value={companyInfo.name}
										onChange={(e) => handleCompanyInfoChange('name', e.target.value)}
										placeholder="Proce Inc."
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">법인명</label>
									<Input
										value={companyInfo.legalName}
										onChange={(e) => handleCompanyInfoChange('legalName', e.target.value)}
										placeholder="Proce Incorporated"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">사업자등록번호</label>
									<Input
										value={companyInfo.businessNumber}
										onChange={(e) => handleCompanyInfoChange('businessNumber', e.target.value)}
										placeholder="123-45-67890"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">법인등록번호</label>
									<Input
										value={companyInfo.taxId}
										onChange={(e) => handleCompanyInfoChange('taxId', e.target.value)}
										placeholder="TAX-2024-001"
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* 산업 및 분류 */}
					<Card>
						<CardHeader>
							<h2 className="text-xl font-bold">산업 및 분류</h2>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium mb-2">
										산업 분야 <span className="text-red-500">*</span>
									</label>
									<Input
										value={companyInfo.industry}
										onChange={(e) => handleCompanyInfoChange('industry', e.target.value)}
										placeholder="Software & Technology"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">세부 산업</label>
									<Input
										value={companyInfo.subIndustry}
										onChange={(e) => handleCompanyInfoChange('subIndustry', e.target.value)}
										placeholder="Enterprise Software"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">기업 형태</label>
									<Input
										value={companyInfo.businessType}
										onChange={(e) => handleCompanyInfoChange('businessType', e.target.value)}
										placeholder="Corporation"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">기업 규모</label>
									<Input
										value={companyInfo.companySize}
										onChange={(e) => handleCompanyInfoChange('companySize', e.target.value)}
										placeholder="Medium (100-500)"
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* 설립 정보 */}
					<Card>
						<CardHeader>
							<h2 className="text-xl font-bold">설립 정보</h2>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium mb-2">설립 연도</label>
									<Input
										type="number"
										value={companyInfo.foundedYear}
										onChange={(e) => handleCompanyInfoChange('foundedYear', e.target.value)}
										placeholder="2020"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">설립일</label>
									<Input
										type="date"
										value={companyInfo.foundedDate}
										onChange={(e) => handleCompanyInfoChange('foundedDate', e.target.value)}
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* 인력 정보 */}
					<Card>
						<CardHeader>
							<h2 className="text-xl font-bold">인력 정보</h2>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
								<div>
									<label className="block text-sm font-medium mb-2">총 직원 수</label>
									<Input
										type="number"
										value={companyInfo.employeeCount}
										onChange={(e) => handleCompanyInfoChange('employeeCount', e.target.value)}
										placeholder="247"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">정규직</label>
									<Input
										type="number"
										value={companyInfo.fullTimeCount}
										onChange={(e) => handleCompanyInfoChange('fullTimeCount', e.target.value)}
										placeholder="220"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">계약직</label>
									<Input
										type="number"
										value={companyInfo.partTimeCount}
										onChange={(e) => handleCompanyInfoChange('partTimeCount', e.target.value)}
										placeholder="15"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">외주</label>
									<Input
										type="number"
										value={companyInfo.contractorCount}
										onChange={(e) => handleCompanyInfoChange('contractorCount', e.target.value)}
										placeholder="12"
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* 연락처 정보 */}
					<Card>
						<CardHeader>
							<h2 className="text-xl font-bold">연락처 정보</h2>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="md:col-span-2">
									<label className="block text-sm font-medium mb-2">주소</label>
									<Input
										value={companyInfo.address}
										onChange={(e) => handleCompanyInfoChange('address', e.target.value)}
										placeholder="서울특별시 강남구 테헤란로 123"
									/>
								</div>
								<div className="md:col-span-2">
									<label className="block text-sm font-medium mb-2">상세 주소</label>
									<Input
										value={companyInfo.detailedAddress}
										onChange={(e) => handleCompanyInfoChange('detailedAddress', e.target.value)}
										placeholder="프로세 빌딩 10층"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">도시</label>
									<Input
										value={companyInfo.city}
										onChange={(e) => handleCompanyInfoChange('city', e.target.value)}
										placeholder="서울"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">구/군</label>
									<Input
										value={companyInfo.state}
										onChange={(e) => handleCompanyInfoChange('state', e.target.value)}
										placeholder="강남구"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">우편번호</label>
									<Input
										value={companyInfo.postalCode}
										onChange={(e) => handleCompanyInfoChange('postalCode', e.target.value)}
										placeholder="06234"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">국가</label>
									<Input
										value={companyInfo.country}
										onChange={(e) => handleCompanyInfoChange('country', e.target.value)}
										placeholder="대한민국"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">전화번호</label>
									<Input
										type="tel"
										value={companyInfo.phone}
										onChange={(e) => handleCompanyInfoChange('phone', e.target.value)}
										placeholder="+82-2-1234-5678"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">팩스</label>
									<Input
										type="tel"
										value={companyInfo.fax}
										onChange={(e) => handleCompanyInfoChange('fax', e.target.value)}
										placeholder="+82-2-1234-5679"
									/>
								</div>
								<div className="md:col-span-2">
									<label className="block text-sm font-medium mb-2">이메일</label>
									<Input
										type="email"
										value={companyInfo.email}
										onChange={(e) => handleCompanyInfoChange('email', e.target.value)}
										placeholder="contact@proce.com"
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* 온라인 정보 */}
					<Card>
						<CardHeader>
							<h2 className="text-xl font-bold">온라인 정보</h2>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="md:col-span-2">
									<label className="block text-sm font-medium mb-2">웹사이트</label>
									<Input
										type="url"
										value={companyInfo.website}
										onChange={(e) => handleCompanyInfoChange('website', e.target.value)}
										placeholder="https://proce.com"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">LinkedIn</label>
									<Input
										type="url"
										value={companyInfo.linkedIn}
										onChange={(e) => handleCompanyInfoChange('linkedIn', e.target.value)}
										placeholder="https://linkedin.com/company/proce"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">Facebook</label>
									<Input
										type="url"
										value={companyInfo.facebook}
										onChange={(e) => handleCompanyInfoChange('facebook', e.target.value)}
										placeholder="https://facebook.com/proce"
									/>
								</div>
								<div className="md:col-span-2">
									<label className="block text-sm font-medium mb-2">Twitter</label>
									<Input
										type="url"
										value={companyInfo.twitter}
										onChange={(e) => handleCompanyInfoChange('twitter', e.target.value)}
										placeholder="https://twitter.com/proce"
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* 대표자 정보 */}
					<Card>
						<CardHeader>
							<h2 className="text-xl font-bold">대표자 정보</h2>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<label className="block text-sm font-medium mb-2">대표자명</label>
									<Input
										value={companyInfo.ceoName}
										onChange={(e) => handleCompanyInfoChange('ceoName', e.target.value)}
										placeholder="김대표"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">대표자 이메일</label>
									<Input
										type="email"
										value={companyInfo.ceoEmail}
										onChange={(e) => handleCompanyInfoChange('ceoEmail', e.target.value)}
										placeholder="ceo@proce.com"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">대표자 전화번호</label>
									<Input
										type="tel"
										value={companyInfo.ceoPhone}
										onChange={(e) => handleCompanyInfoChange('ceoPhone', e.target.value)}
										placeholder="+82-10-1234-5678"
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* 재무 담당자 정보 */}
					<Card>
						<CardHeader>
							<h2 className="text-xl font-bold">재무 담당자 정보</h2>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<label className="block text-sm font-medium mb-2">CFO명</label>
									<Input
										value={companyInfo.cfoName}
										onChange={(e) => handleCompanyInfoChange('cfoName', e.target.value)}
										placeholder="이재무"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">CFO 이메일</label>
									<Input
										type="email"
										value={companyInfo.cfoEmail}
										onChange={(e) => handleCompanyInfoChange('cfoEmail', e.target.value)}
										placeholder="cfo@proce.com"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">CFO 전화번호</label>
									<Input
										type="tel"
										value={companyInfo.cfoPhone}
										onChange={(e) => handleCompanyInfoChange('cfoPhone', e.target.value)}
										placeholder="+82-10-2345-6789"
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* 회사 설명 */}
					<Card>
						<CardHeader>
							<h2 className="text-xl font-bold">회사 설명</h2>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<label className="block text-sm font-medium mb-2">회사 소개</label>
								<Textarea
									value={companyInfo.description}
									onChange={(e) => handleCompanyInfoChange('description', e.target.value)}
									placeholder="회사에 대한 간단한 소개를 입력하세요"
									rows={3}
								/>
							</div>
							<div>
								<label className="block text-sm font-medium mb-2">비전</label>
								<Textarea
									value={companyInfo.vision}
									onChange={(e) => handleCompanyInfoChange('vision', e.target.value)}
									placeholder="회사의 비전을 입력하세요"
									rows={2}
								/>
							</div>
							<div>
								<label className="block text-sm font-medium mb-2">미션</label>
								<Textarea
									value={companyInfo.mission}
									onChange={(e) => handleCompanyInfoChange('mission', e.target.value)}
									placeholder="회사의 미션을 입력하세요"
									rows={2}
								/>
							</div>
							<div>
								<label className="block text-sm font-medium mb-2">핵심 가치</label>
								<Textarea
									value={companyInfo.coreValues}
									onChange={(e) => handleCompanyInfoChange('coreValues', e.target.value)}
									placeholder="회사의 핵심 가치를 입력하세요 (쉼표로 구분)"
									rows={2}
								/>
							</div>
						</CardContent>
					</Card>

					{/* 추가 정보 */}
					<Card>
						<CardHeader>
							<h2 className="text-xl font-bold">추가 정보</h2>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								<div>
									<label className="block text-sm font-medium mb-2">주식 코드</label>
									<Input
										value={companyInfo.stockSymbol}
										onChange={(e) => handleCompanyInfoChange('stockSymbol', e.target.value)}
										placeholder="PROC"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">거래소</label>
									<Input
										value={companyInfo.stockExchange}
										onChange={(e) => handleCompanyInfoChange('stockExchange', e.target.value)}
										placeholder="KOSDAQ"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">회계연도 종료일</label>
									<Input
										value={companyInfo.fiscalYearEnd}
										onChange={(e) => handleCompanyInfoChange('fiscalYearEnd', e.target.value)}
										placeholder="12-31"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">시간대</label>
									<Input
										value={companyInfo.timezone}
										onChange={(e) => handleCompanyInfoChange('timezone', e.target.value)}
										placeholder="Asia/Seoul"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">통화</label>
									<Input
										value={companyInfo.currency}
										onChange={(e) => handleCompanyInfoChange('currency', e.target.value)}
										placeholder="KRW"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">언어</label>
									<Input
										value={companyInfo.language}
										onChange={(e) => handleCompanyInfoChange('language', e.target.value)}
										placeholder="ko-KR"
									/>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Financial Data Tab */}
			{activeTab === 'financial' && (
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-xl font-bold">재무 정보</h2>
							<p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
								연도별 재무 데이터를 입력하고 관리하세요
							</p>
						</div>
						<div className="flex items-center gap-2">
							<Button variant="outline" onClick={handleAddFinancialRecord} className="flex items-center gap-2">
								<Plus className="h-4 w-4" />
								연도 추가
							</Button>
							<Button onClick={handleSaveFinancialData} className="flex items-center gap-2">
								<Save className="h-4 w-4" />
								저장
							</Button>
						</div>
					</div>

					{financialRecords.map((record, index) => (
						<Card key={index}>
							<CardHeader>
								<div className="flex items-center justify-between">
									<h3 className="text-lg font-bold">{record.year}년 재무 데이터</h3>
									<button
										onClick={() => handleDeleteFinancialRecord(index)}
										className="text-red-500 hover:text-red-600"
									>
										<Trash2 className="h-5 w-5" />
									</button>
								</div>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									<div>
										<label className="block text-sm font-medium mb-2">연도</label>
										<Input
											type="number"
											value={record.year}
											onChange={(e) => handleFinancialChange(index, 'year', e.target.value)}
											placeholder="2024"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium mb-2">총 매출 (USD)</label>
										<Input
											type="number"
											value={record.totalRevenue}
											onChange={(e) => handleFinancialChange(index, 'totalRevenue', e.target.value)}
											placeholder="12400000"
										/>
										{record.totalRevenue && (
											<p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
												{formatCurrency(record.totalRevenue)}
											</p>
										)}
									</div>
									<div>
										<label className="block text-sm font-medium mb-2">순이익 (USD)</label>
										<Input
											type="number"
											value={record.netIncome}
											onChange={(e) => handleFinancialChange(index, 'netIncome', e.target.value)}
											placeholder="4200000"
										/>
										{record.netIncome && (
											<p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
												{formatCurrency(record.netIncome)}
											</p>
										)}
									</div>
									<div>
										<label className="block text-sm font-medium mb-2">총 자산 (USD)</label>
										<Input
											type="number"
											value={record.totalAssets}
											onChange={(e) => handleFinancialChange(index, 'totalAssets', e.target.value)}
											placeholder="18500000"
										/>
										{record.totalAssets && (
											<p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
												{formatCurrency(record.totalAssets)}
											</p>
										)}
									</div>
									<div>
										<label className="block text-sm font-medium mb-2">총 부채 (USD)</label>
										<Input
											type="number"
											value={record.totalLiabilities}
											onChange={(e) => handleFinancialChange(index, 'totalLiabilities', e.target.value)}
											placeholder="6200000"
										/>
										{record.totalLiabilities && (
											<p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
												{formatCurrency(record.totalLiabilities)}
											</p>
										)}
									</div>
									<div>
										<label className="block text-sm font-medium mb-2">장기 부채 (USD)</label>
										<Input
											type="number"
											value={record.longTermDebt}
											onChange={(e) => handleFinancialChange(index, 'longTermDebt', e.target.value)}
											placeholder="3100000"
										/>
										{record.longTermDebt && (
											<p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
												{formatCurrency(record.longTermDebt)}
											</p>
										)}
									</div>
									<div>
										<label className="block text-sm font-medium mb-2">총 자본 (USD)</label>
										<Input
											type="number"
											value={record.totalEquity}
											onChange={(e) => handleFinancialChange(index, 'totalEquity', e.target.value)}
											placeholder="12300000"
										/>
										{record.totalEquity && (
											<p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
												{formatCurrency(record.totalEquity)}
											</p>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{/* KPI Tab */}
			{activeTab === 'kpi' && (
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-xl font-bold">KPI 목표 설정</h2>
							<p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
								회사의 핵심 성과 지표(KPI)를 설정하고 관리하세요
							</p>
						</div>
						<div className="flex items-center gap-2">
							<Button variant="outline" onClick={() => setShowAddKPI(true)} className="flex items-center gap-2">
								<Plus className="h-4 w-4" />
								KPI 추가
							</Button>
							<Button onClick={handleSaveKPIs} className="flex items-center gap-2">
								<Save className="h-4 w-4" />
								저장
							</Button>
						</div>
					</div>

					{/* KPI List */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{kpis.map((kpi) => (
							<Card key={kpi.id}>
								<CardContent className="p-4">
									<div className="flex items-start justify-between mb-3">
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-1">
												<TrendingUp className="h-4 w-4 text-primary" />
												<span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
													{kpi.category}
												</span>
											</div>
											<h3 className="font-bold text-lg mb-1">{kpi.name}</h3>
											<p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
												{kpi.description}
											</p>
										</div>
										<button
											onClick={() => handleDeleteKPI(kpi.id)}
											className="text-red-500 hover:text-red-600 ml-2"
										>
											<Trash2 className="h-4 w-4" />
										</button>
									</div>
									<div className="flex items-center gap-2 p-3 bg-primary/5 rounded-xl">
										<Target className="h-5 w-5 text-primary" />
										<div>
											<p className="text-xs text-neutral-600 dark:text-neutral-400">목표</p>
											<p className="font-bold text-lg">
												{kpi.target} {kpi.unit}
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			)}

			{/* Add KPI Dialog */}
			{showAddKPI && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
					<div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-md">
						<div className="p-6">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-xl font-bold flex items-center gap-2">
									<Plus className="h-5 w-5 text-primary" />
									새 KPI 추가
								</h3>
								<button
									onClick={() => setShowAddKPI(false)}
									className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
								>
									<X className="h-5 w-5" />
								</button>
							</div>

							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium mb-2">
										KPI 이름 <span className="text-red-500">*</span>
									</label>
									<Input
										value={newKPI.name}
										onChange={(e) => setNewKPI({ ...newKPI, name: e.target.value })}
										placeholder="예: Monthly Recurring Revenue"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium mb-2">
										카테고리 <span className="text-red-500">*</span>
									</label>
									<select
										value={newKPI.category}
										onChange={(e) => setNewKPI({ ...newKPI, category: e.target.value })}
										className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900"
									>
										<option value="">선택하세요</option>
										{categories.map((cat) => (
											<option key={cat} value={cat}>
												{cat}
											</option>
										))}
									</select>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium mb-2">
											목표 값 <span className="text-red-500">*</span>
										</label>
										<Input
											type="number"
											value={newKPI.target}
											onChange={(e) => setNewKPI({ ...newKPI, target: e.target.value })}
											placeholder="1000000"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium mb-2">단위</label>
										<Input
											value={newKPI.unit}
											onChange={(e) => setNewKPI({ ...newKPI, unit: e.target.value })}
											placeholder="USD, %, 건"
										/>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium mb-2">설명</label>
									<Textarea
										value={newKPI.description}
										onChange={(e) => setNewKPI({ ...newKPI, description: e.target.value })}
										placeholder="KPI에 대한 설명을 입력하세요"
										rows={3}
									/>
								</div>

								<div className="flex items-center gap-2 pt-2">
									<Button onClick={handleAddKPI} className="flex-1 justify-center">
										추가
									</Button>
									<Button
										variant="outline"
										onClick={() => setShowAddKPI(false)}
										className="flex-1 justify-center"
									>
										취소
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

