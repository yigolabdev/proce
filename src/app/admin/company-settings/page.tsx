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
	CheckCircle2,
	Upload,
	FileText,
	Sparkles,
	Lightbulb,
	Brain
} from 'lucide-react'
import { toast } from 'sonner'
import Toaster from '../../../components/ui/Toaster'

interface CompanyInfo {
	// 기본 정보
	name: string
	legalName: string
	businessNumber: string
	taxId: string
	corporateNumber: string
	establishmentType: string
	
	// 산업 및 분류
	industry: string
	subIndustry: string
	businessType: string
	companySize: string
	mainProducts: string
	mainServices: string
	
	// 설립 정보
	foundedYear: string
	foundedDate: string
	registrationDate: string
	
	// 인력 정보
	employeeCount: string
	fullTimeCount: string
	partTimeCount: string
	contractorCount: string
	averageAge: string
	averageTenure: string
	
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
	supportEmail: string
	salesEmail: string
	
	// 온라인 정보
	website: string
	linkedIn: string
	facebook: string
	twitter: string
	instagram: string
	youtube: string
	github: string
	
	// 대표자 정보
	ceoName: string
	ceoEmail: string
	ceoPhone: string
	ceoLinkedIn: string
	
	// 재무 담당자 정보
	cfoName: string
	cfoEmail: string
	cfoPhone: string
	
	// 인사 담당자 정보
	hrName: string
	hrEmail: string
	hrPhone: string
	
	// 기술 담당자 정보
	ctoName: string
	ctoEmail: string
	ctoPhone: string
	
	// 회사 설명
	description: string
	vision: string
	mission: string
	coreValues: string
	companyHistory: string
	
	// 추가 정보
	stockSymbol: string
	stockExchange: string
	fiscalYearEnd: string
	timezone: string
	currency: string
	language: string
	
	// 인증 및 자격
	certifications: string
	awards: string
	partnerships: string
	
	// 사무실 정보
	officeCount: string
	headquartersLocation: string
	branchLocations: string
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

interface CompanyGoal {
	id: string
	name: string
	description: string
	category: string
	period: 'quarterly' | 'annual'
	quarter?: string
	year: string
	targetValue: string
	unit: string
	measurementMethod: string
	department: string[] // 연관 부서
	priority: 'high' | 'medium' | 'low'
	aiRecommendationEnabled: boolean
	createdAt: Date
	updatedAt: Date
}

interface OKRTemplate {
	id: string
	goalId: string // 연결된 전사 목표 ID
	name: string
	description: string
	targetRole: string[] // 추천 대상 역할/직책
	targetDepartment: string[] // 추천 대상 부서
	keyResults: {
		id: string
		description: string
		targetValue: string
		unit: string
	}[]
	recommendationScore: number // AI 추천 우선순위 점수
	autoAssign: boolean // 자동 할당 여부
	createdAt: Date
}

interface KPI {
	id: string
	name: string
	target: string
	unit: string
	category: string
	description: string
}

interface UploadedFinancialDocument {
	id: string
	name: string
	size: number
	year: string
	uploadedAt: Date
	type: string
}

export default function CompanySettingsPage() {
	// Company Info State
	const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
		// 기본 정보
		name: 'Proce Inc.',
		legalName: 'Proce Incorporated',
		businessNumber: '123-45-67890',
		taxId: 'TAX-2024-001',
		corporateNumber: '',
		establishmentType: '',
		
		// 산업 및 분류
		industry: 'Software & Technology',
		subIndustry: 'Enterprise Software',
		businessType: 'Corporation',
		companySize: 'Medium (100-500)',
		mainProducts: '',
		mainServices: '',
		
		// 설립 정보
		foundedYear: '2020',
		foundedDate: '2020-03-15',
		registrationDate: '',
		
		// 인력 정보
		employeeCount: '247',
		fullTimeCount: '220',
		partTimeCount: '15',
		contractorCount: '12',
		averageAge: '',
		averageTenure: '',
		
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
		supportEmail: '',
		salesEmail: '',
		
		// 온라인 정보
		website: 'https://proce.com',
		linkedIn: 'https://linkedin.com/company/proce',
		facebook: 'https://facebook.com/proce',
		twitter: 'https://twitter.com/proce',
		instagram: '',
		youtube: '',
		github: '',
		
		// 대표자 정보
		ceoName: '김대표',
		ceoEmail: 'ceo@proce.com',
		ceoPhone: '+82-10-1234-5678',
		ceoLinkedIn: '',
		
		// 재무 담당자 정보
		cfoName: '이재무',
		cfoEmail: 'cfo@proce.com',
		cfoPhone: '+82-10-2345-6789',
		
		// 인사 담당자 정보
		hrName: '',
		hrEmail: '',
		hrPhone: '',
		
		// 기술 담당자 정보
		ctoName: '',
		ctoEmail: '',
		ctoPhone: '',
		
		// 회사 설명
		description: '데이터 기반 의사결정 플랫폼을 제공하는 기업입니다.',
		vision: '데이터 기반 의사결정으로 모든 기업이 성공할 수 있는 세상을 만듭니다.',
		mission: '직원들의 업무 데이터를 수집하고 분석하여 실시간 인사이트를 제공합니다.',
		coreValues: '데이터 중심 사고, 지속적인 혁신, 투명한 소통, 고객 성공 우선',
		companyHistory: '',
		
		// 추가 정보
		stockSymbol: 'PROC',
		stockExchange: 'KOSDAQ',
		fiscalYearEnd: '12-31',
		timezone: 'Asia/Seoul',
		currency: 'KRW',
		language: 'ko-KR',
		
		// 인증 및 자격
		certifications: '',
		awards: '',
		partnerships: '',
		
		// 사무실 정보
		officeCount: '',
		headquartersLocation: '',
		branchLocations: '',
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

	// Company Goals State
	const [companyGoals, setCompanyGoals] = useState<CompanyGoal[]>([
		{
			id: '1',
			name: '연매출 100억 달성',
			description: '2024년 연매출 목표 100억원을 달성하여 시장 선도 기업으로 성장',
			category: 'Revenue',
			period: 'annual',
			year: '2024',
			targetValue: '10000000000',
			unit: 'KRW',
			measurementMethod: '월별 매출 집계',
			department: ['Sales', 'Marketing', 'Product'],
			priority: 'high',
			aiRecommendationEnabled: true,
			createdAt: new Date('2024-01-01'),
			updatedAt: new Date('2024-01-01'),
		},
		{
			id: '2',
			name: '고객 만족도 90점 이상 유지',
			description: 'NPS 기준 고객 만족도를 90점 이상 유지하여 고객 충성도 향상',
			category: 'Customer',
			period: 'quarterly',
			quarter: 'Q4',
			year: '2024',
			targetValue: '90',
			unit: 'NPS',
			measurementMethod: '분기별 고객 설문조사',
			department: ['Customer Support', 'Product', 'Engineering'],
			priority: 'high',
			aiRecommendationEnabled: true,
			createdAt: new Date('2024-10-01'),
			updatedAt: new Date('2024-10-01'),
		},
	])

	// OKR Templates State
	const [okrTemplates, setOKRTemplates] = useState<OKRTemplate[]>([
		{
			id: '1',
			goalId: '1',
			name: '신규 고객 획득 증대',
			description: '연매출 목표 달성을 위한 신규 고객 100명 확보',
			targetRole: ['Sales Manager', 'Account Executive', 'Business Development'],
			targetDepartment: ['Sales'],
			keyResults: [
				{ id: 'kr1', description: '신규 리드 300개 생성', targetValue: '300', unit: '건' },
				{ id: 'kr2', description: '리드-고객 전환율 33% 이상', targetValue: '33', unit: '%' },
				{ id: 'kr3', description: '평균 계약 금액 1억원 이상', targetValue: '100000000', unit: 'KRW' },
			],
			recommendationScore: 95,
			autoAssign: true,
			createdAt: new Date('2024-01-02'),
		},
		{
			id: '2',
			goalId: '1',
			name: '마케팅 캠페인 ROI 향상',
			description: '효율적인 마케팅 캠페인으로 매출 기여',
			targetRole: ['Marketing Manager', 'Growth Marketing', 'Content Marketing'],
			targetDepartment: ['Marketing'],
			keyResults: [
				{ id: 'kr1', description: '광고 ROAS 500% 달성', targetValue: '500', unit: '%' },
				{ id: 'kr2', description: '월간 MQL 200개 생성', targetValue: '200', unit: '건' },
				{ id: 'kr3', description: '콘텐츠 조회수 100만 달성', targetValue: '1000000', unit: '회' },
			],
			recommendationScore: 90,
			autoAssign: true,
			createdAt: new Date('2024-01-02'),
		},
		{
			id: '3',
			goalId: '2',
			name: '고객 응답 시간 단축',
			description: '고객 만족도 향상을 위한 빠른 응답 체계 구축',
			targetRole: ['Customer Support', 'Support Engineer'],
			targetDepartment: ['Customer Support'],
			keyResults: [
				{ id: 'kr1', description: '평균 응답 시간 1시간 이내', targetValue: '1', unit: 'hour' },
				{ id: 'kr2', description: '첫 응답률 95% 이상', targetValue: '95', unit: '%' },
				{ id: 'kr3', description: '고객 만족도 4.5점 이상', targetValue: '4.5', unit: '점' },
			],
			recommendationScore: 92,
			autoAssign: false,
			createdAt: new Date('2024-10-02'),
		},
	])

	// KPI State (기존 호환성 유지)
	const [kpis, setKpis] = useState<KPI[]>([])

	const [activeTab, setActiveTab] = useState<'company' | 'annual-goals' | 'financial'>('company')
	const [showAddGoal, setShowAddGoal] = useState(false)
	const [showAddTemplate, setShowAddTemplate] = useState(false)
	const [showAddKPI, setShowAddKPI] = useState(false)
	const [newKPI, setNewKPI] = useState<Omit<KPI, 'id'>>({
		name: '',
		target: '',
		unit: '',
		category: '',
		description: '',
	})
	
	const [newGoal, setNewGoal] = useState<Partial<CompanyGoal>>({
		name: '',
		description: '',
		category: '',
		period: 'quarterly',
		year: new Date().getFullYear().toString(),
		quarter: 'Q1',
		targetValue: '',
		unit: '',
		measurementMethod: '',
		department: [],
		priority: 'medium',
		aiRecommendationEnabled: true,
	})

	const [newTemplate, setNewTemplate] = useState<Partial<OKRTemplate>>({
		goalId: '',
		name: '',
		description: '',
		targetRole: [],
		targetDepartment: [],
		keyResults: [],
		recommendationScore: 50,
		autoAssign: false,
	})

	const [uploadedDocuments, setUploadedDocuments] = useState<UploadedFinancialDocument[]>([])

	const departments = ['Sales', 'Marketing', 'Engineering', 'Product', 'Customer Support', 'Finance', 'HR', 'Operations']
	const roles = ['Manager', 'Team Lead', 'Senior', 'Junior', 'Engineer', 'Designer', 'Analyst', 'Executive']

	// Company Info Handlers
	const handleCompanyInfoChange = (field: keyof CompanyInfo, value: string) => {
		setCompanyInfo((prev) => ({ ...prev, [field]: value }))
	}

	const handleSaveCompanyInfo = () => {
		// Mock save
		toast.success('Company information saved successfully')
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
		toast.success('Financial record deleted successfully')
	}

	const handleSaveFinancialData = () => {
		toast.success('Financial data saved successfully')
	}

	// Company Goal Handlers
	const handleAddGoal = () => {
		if (!newGoal.name || !newGoal.targetValue || !newGoal.category) {
			toast.error('필수 항목을 모두 입력해주세요')
			return
		}

		const goal: CompanyGoal = {
			id: Date.now().toString(),
			name: newGoal.name,
			description: newGoal.description || '',
			category: newGoal.category,
			period: newGoal.period || 'quarterly',
			quarter: newGoal.quarter,
			year: newGoal.year || new Date().getFullYear().toString(),
			targetValue: newGoal.targetValue,
			unit: newGoal.unit || '',
			measurementMethod: newGoal.measurementMethod || '',
			department: newGoal.department || [],
			priority: newGoal.priority || 'medium',
			aiRecommendationEnabled: newGoal.aiRecommendationEnabled ?? true,
			createdAt: new Date(),
			updatedAt: new Date(),
		}

		setCompanyGoals([...companyGoals, goal])
		setNewGoal({
			name: '',
			description: '',
			category: '',
			period: 'quarterly',
			year: new Date().getFullYear().toString(),
			quarter: 'Q1',
			targetValue: '',
			unit: '',
			measurementMethod: '',
			department: [],
			priority: 'medium',
			aiRecommendationEnabled: true,
		})
		setShowAddGoal(false)
		toast.success('전사 목표가 추가되었습니다')
	}

	const handleDeleteGoal = (id: string) => {
		// 연관된 템플릿도 삭제할지 확인
		const relatedTemplates = okrTemplates.filter((t) => t.goalId === id)
		if (relatedTemplates.length > 0 && !confirm(`이 목표와 연관된 ${relatedTemplates.length}개의 OKR 템플릿도 삭제됩니다. 계속하시겠습니까?`)) {
			return
		}

		setCompanyGoals((prev) => prev.filter((g) => g.id !== id))
		setOKRTemplates((prev) => prev.filter((t) => t.goalId !== id))
		toast.success('전사 목표가 삭제되었습니다')
	}

	const handleAddTemplate = () => {
		if (!newTemplate.name || !newTemplate.goalId || !newTemplate.targetDepartment || newTemplate.targetDepartment.length === 0) {
			toast.error('필수 항목을 모두 입력해주세요')
			return
		}

		const template: OKRTemplate = {
			id: Date.now().toString(),
			goalId: newTemplate.goalId,
			name: newTemplate.name,
			description: newTemplate.description || '',
			targetRole: newTemplate.targetRole || [],
			targetDepartment: newTemplate.targetDepartment,
			keyResults: newTemplate.keyResults || [],
			recommendationScore: newTemplate.recommendationScore || 50,
			autoAssign: newTemplate.autoAssign || false,
			createdAt: new Date(),
		}

		setOKRTemplates([...okrTemplates, template])
		setNewTemplate({
			goalId: '',
			name: '',
			description: '',
			targetRole: [],
			targetDepartment: [],
			keyResults: [],
			recommendationScore: 50,
			autoAssign: false,
		})
		setShowAddTemplate(false)
		toast.success('OKR 템플릿이 추가되었습니다')
	}

	const handleDeleteTemplate = (id: string) => {
		setOKRTemplates((prev) => prev.filter((t) => t.id !== id))
		toast.success('OKR 템플릿이 삭제되었습니다')
	}

	const handleSaveGoalsAndTemplates = () => {
		// localStorage에 저장
		localStorage.setItem('companyGoals', JSON.stringify(companyGoals))
		localStorage.setItem('okrTemplates', JSON.stringify(okrTemplates))
		toast.success('전사 목표 및 OKR 템플릿이 저장되었습니다')
	}

	const addKeyResult = () => {
		const newKR = {
			id: Date.now().toString(),
			description: '',
			targetValue: '',
			unit: '',
		}
		setNewTemplate({
			...newTemplate,
			keyResults: [...(newTemplate.keyResults || []), newKR],
		})
	}

	const removeKeyResult = (krId: string) => {
		setNewTemplate({
			...newTemplate,
			keyResults: (newTemplate.keyResults || []).filter((kr) => kr.id !== krId),
		})
	}

	const updateKeyResult = (krId: string, field: string, value: string) => {
		setNewTemplate({
			...newTemplate,
			keyResults: (newTemplate.keyResults || []).map((kr) =>
				kr.id === krId ? { ...kr, [field]: value } : kr
			),
		})
	}

	// KPI Handlers (기존 호환성 유지)
	const handleAddKPI = () => {
		if (!newKPI.name || !newKPI.target || !newKPI.category) {
			toast.error('필수 항목을 모두 입력해주세요')
			return
		}

		const kpi: KPI = {
			id: Date.now().toString(),
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

	// Document Upload Handlers
	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files
		if (!files || files.length === 0) return

		const file = files[0]
		const allowedTypes = [
			'application/pdf',
			'application/vnd.ms-excel',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'text/csv',
		]

		if (!allowedTypes.includes(file.type)) {
			toast.error('PDF, Excel, CSV 파일만 업로드 가능합니다')
			return
		}

		if (file.size > 10 * 1024 * 1024) {
			toast.error('파일 크기는 10MB를 초과할 수 없습니다')
			return
		}

		const newDocument: UploadedFinancialDocument = {
			id: Date.now().toString(),
			name: file.name,
			size: file.size,
			year: new Date().getFullYear().toString(),
			uploadedAt: new Date(),
			type: file.type,
		}

		setUploadedDocuments((prev) => [...prev, newDocument])
		toast.success('재무제표가 업로드되었습니다')
		event.target.value = ''
	}

	const handleDeleteDocument = (id: string) => {
		setUploadedDocuments((prev) => prev.filter((doc) => doc.id !== id))
		toast.success('문서가 삭제되었습니다')
	}

	const formatFileSize = (bytes: number) => {
		if (bytes < 1024) return bytes + ' B'
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
		return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
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
				name: 'Basic Info',
				fields: [companyInfo.name, companyInfo.legalName, companyInfo.businessNumber, companyInfo.taxId, companyInfo.corporateNumber, companyInfo.establishmentType],
			},
			{
				name: 'Industry',
				fields: [companyInfo.industry, companyInfo.subIndustry, companyInfo.businessType, companyInfo.companySize, companyInfo.mainProducts, companyInfo.mainServices],
			},
			{
				name: 'Foundation',
				fields: [companyInfo.foundedYear, companyInfo.foundedDate, companyInfo.registrationDate],
			},
			{
				name: 'Workforce',
				fields: [companyInfo.employeeCount, companyInfo.fullTimeCount, companyInfo.partTimeCount, companyInfo.contractorCount, companyInfo.averageAge, companyInfo.averageTenure],
			},
			{
				name: 'Contact',
				fields: [companyInfo.address, companyInfo.detailedAddress, companyInfo.city, companyInfo.state, companyInfo.postalCode, companyInfo.country, companyInfo.phone, companyInfo.fax, companyInfo.email, companyInfo.supportEmail, companyInfo.salesEmail],
			},
			{
				name: 'Online',
				fields: [companyInfo.website, companyInfo.linkedIn, companyInfo.facebook, companyInfo.twitter, companyInfo.instagram, companyInfo.youtube, companyInfo.github],
			},
			{
				name: 'Leadership',
				fields: [companyInfo.ceoName, companyInfo.ceoEmail, companyInfo.ceoPhone, companyInfo.ceoLinkedIn, companyInfo.cfoName, companyInfo.cfoEmail, companyInfo.cfoPhone, companyInfo.hrName, companyInfo.hrEmail, companyInfo.hrPhone, companyInfo.ctoName, companyInfo.ctoEmail, companyInfo.ctoPhone],
			},
			{
				name: 'Description',
				fields: [companyInfo.description, companyInfo.vision, companyInfo.mission, companyInfo.coreValues, companyInfo.companyHistory],
			},
			{
				name: 'Additional',
				fields: [companyInfo.stockSymbol, companyInfo.stockExchange, companyInfo.fiscalYearEnd, companyInfo.timezone, companyInfo.currency, companyInfo.language],
			},
			{
				name: 'Certifications',
				fields: [companyInfo.certifications, companyInfo.awards, companyInfo.partnerships],
			},
			{
				name: 'Offices',
				fields: [companyInfo.officeCount, companyInfo.headquartersLocation, companyInfo.branchLocations],
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
					onClick={() => setActiveTab('annual-goals')}
					className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
						activeTab === 'annual-goals'
							? 'border-primary text-primary'
							: 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
					}`}
				>
					<Target className="inline h-4 w-4 mr-2" />
					Annual Goals
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
								<div>
									<label className="block text-sm font-medium mb-2">고유번호</label>
									<Input
										value={companyInfo.corporateNumber}
										onChange={(e) => handleCompanyInfoChange('corporateNumber', e.target.value)}
										placeholder="110111-1234567"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">설립 형태</label>
									<Input
										value={companyInfo.establishmentType}
										onChange={(e) => handleCompanyInfoChange('establishmentType', e.target.value)}
										placeholder="주식회사, 유한회사 등"
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

			{/* Annual Goals Tab */}
			{activeTab === 'annual-goals' && (
				<div className="space-y-6">
					{/* Summary Dashboard */}
					<div className="grid gap-4 md:grid-cols-2">
						<Card className="border-primary/20">
							<CardContent className="p-6">
								<div className="flex items-center justify-between mb-4">
									<Target className="h-8 w-8 text-primary" />
									<TrendingUp className="h-5 w-5 text-green-600" />
								</div>
								<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
									전사 목표
								</div>
								<div className="text-3xl font-bold">{companyGoals.length}</div>
							</CardContent>
						</Card>
						<Card className="border-green-200 dark:border-green-800">
							<CardContent className="p-6">
								<div className="flex items-center justify-between mb-4">
									<Sparkles className="h-8 w-8 text-green-600" />
								</div>
								<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
									OKR 템플릿
								</div>
								<div className="text-3xl font-bold">{okrTemplates.length}</div>
							</CardContent>
						</Card>
					</div>

					{/* Company Goals Section */}
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<h2 className="text-xl font-bold flex items-center gap-2">
										<Target className="h-6 w-6 text-primary" />
										전사 목표 (Company Goals)
									</h2>
									<p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
										회사의 핵심 목표를 설정하고 AI 기반 OKR 추천을 활성화하세요
									</p>
								</div>
								<div className="flex items-center gap-2">
									<Button variant="outline" onClick={() => setShowAddGoal(true)} className="flex items-center gap-2">
										<Plus className="h-4 w-4" />
										목표 추가
									</Button>
									<Button onClick={handleSaveGoalsAndTemplates} className="flex items-center gap-2">
										<Save className="h-4 w-4" />
										저장
									</Button>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							{companyGoals.length === 0 ? (
								<div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
									<Target className="h-16 w-16 mx-auto mb-4 opacity-30" />
									<p className="text-lg font-medium mb-2">아직 설정된 목표가 없습니다</p>
									<p className="text-sm mb-4">전사 목표를 추가하여 시작하세요</p>
									<Button onClick={() => setShowAddGoal(true)} className="flex items-center gap-2">
										<Plus className="h-4 w-4" />
										첫 목표 추가하기
									</Button>
								</div>
							) : (
								<div className="space-y-4">
									{companyGoals.map((goal) => (
										<div
											key={goal.id}
											className="p-6 border border-neutral-200 dark:border-neutral-800 rounded-2xl hover:border-primary transition-colors"
										>
											<div className="flex items-start justify-between mb-4">
												<div className="flex-1">
													<div className="flex items-center gap-2 mb-2">
														<span className={`px-3 py-1 rounded-full text-xs font-medium ${
															goal.priority === 'high'
																? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
																: goal.priority === 'medium'
																? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
																: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
														}`}>
															{goal.priority === 'high' ? '높음' : goal.priority === 'medium' ? '중간' : '낮음'}
														</span>
														<span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
															{goal.category}
														</span>
														<span className="text-xs text-neutral-500 dark:text-neutral-400">
															{goal.period === 'annual' ? `${goal.year}년` : `${goal.year} ${goal.quarter}`}
														</span>
														{goal.aiRecommendationEnabled && (
															<span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1">
																<Brain className="h-3 w-3" />
																AI 추천 활성화
															</span>
														)}
													</div>
													<h3 className="font-bold text-lg mb-2">{goal.name}</h3>
													<p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
														{goal.description}
													</p>
													<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
														<div>
															<p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">목표 값</p>
															<p className="font-bold">{Number(goal.targetValue).toLocaleString()} {goal.unit}</p>
														</div>
														<div>
															<p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">측정 방법</p>
															<p className="text-sm">{goal.measurementMethod}</p>
														</div>
														<div className="md:col-span-2">
															<p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">연관 부서</p>
															<div className="flex items-center gap-1 flex-wrap">
																{goal.department.map((dept, idx) => (
																	<span key={idx} className="text-xs px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded">
																		{dept}
																	</span>
																))}
															</div>
														</div>
													</div>
												</div>
												<button
													onClick={() => handleDeleteGoal(goal.id)}
													className="text-red-500 hover:text-red-600 transition-colors ml-4 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
												>
													<Trash2 className="h-5 w-5" />
												</button>
											</div>
											{okrTemplates.filter(t => t.goalId === goal.id).length > 0 && (
												<div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
													<p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2">
														연결된 OKR 템플릿: {okrTemplates.filter(t => t.goalId === goal.id).length}개
													</p>
												</div>
											)}
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>

					{/* OKR Templates Section */}
					<Card className="border-green-200 dark:border-green-800">
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<h2 className="text-xl font-bold flex items-center gap-2">
										<Sparkles className="h-6 w-6 text-green-600" />
										OKR 템플릿 (OKR Templates)
									</h2>
									<p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
										직원들에게 추천될 OKR 템플릿을 생성하고 관리하세요
									</p>
								</div>
								<Button variant="outline" onClick={() => setShowAddTemplate(true)} className="flex items-center gap-2">
									<Plus className="h-4 w-4" />
									템플릿 추가
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							{okrTemplates.length === 0 ? (
								<div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
									<Lightbulb className="h-16 w-16 mx-auto mb-4 opacity-30" />
									<p className="text-lg font-medium mb-2">아직 생성된 OKR 템플릿이 없습니다</p>
									<p className="text-sm mb-4">전사 목표와 연결된 OKR 템플릿을 추가하세요</p>
									<Button onClick={() => setShowAddTemplate(true)} className="flex items-center gap-2">
										<Plus className="h-4 w-4" />
										첫 템플릿 추가하기
									</Button>
								</div>
							) : (
								<div className="space-y-4">
									{okrTemplates.map((template) => {
										const relatedGoal = companyGoals.find(g => g.id === template.goalId)
										return (
											<div
												key={template.id}
												className="p-6 border border-neutral-200 dark:border-neutral-800 rounded-2xl hover:border-green-500 transition-colors"
											>
												<div className="flex items-start justify-between mb-4">
													<div className="flex-1">
														<div className="flex items-center gap-2 mb-2">
															{relatedGoal && (
																<span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
																	{relatedGoal.name}
																</span>
															)}
															{template.autoAssign && (
																<span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
																	자동 할당
																</span>
															)}
															<span className="text-xs text-neutral-500 dark:text-neutral-400">
																추천 점수: {template.recommendationScore}
															</span>
														</div>
														<h3 className="font-bold text-lg mb-2">{template.name}</h3>
														<p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
															{template.description}
														</p>
														<div className="grid grid-cols-2 gap-4 mb-3">
															<div>
																<p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">대상 부서</p>
																<div className="flex items-center gap-1 flex-wrap">
																	{template.targetDepartment.map((dept, idx) => (
																		<span key={idx} className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">
																			{dept}
																		</span>
																	))}
																</div>
															</div>
															<div>
																<p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">대상 역할</p>
																<div className="flex items-center gap-1 flex-wrap">
																	{template.targetRole.map((role, idx) => (
																		<span key={idx} className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded">
																			{role}
																		</span>
																	))}
																</div>
															</div>
														</div>
														{template.keyResults.length > 0 && (
															<div className="pt-3 border-t border-neutral-200 dark:border-neutral-800">
																<p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2">
																	핵심 결과 (Key Results):
																</p>
																<ul className="space-y-1">
																	{template.keyResults.map((kr) => (
																		<li key={kr.id} className="text-sm flex items-start gap-2">
																			<CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
																			<span>{kr.description} - <span className="font-bold">{kr.targetValue} {kr.unit}</span></span>
																		</li>
																	))}
																</ul>
															</div>
														)}
													</div>
													<button
														onClick={() => handleDeleteTemplate(template.id)}
														className="text-red-500 hover:text-red-600 transition-colors ml-4 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
													>
														<Trash2 className="h-5 w-5" />
													</button>
												</div>
											</div>
										)
									})}
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			)}

			{/* Financial Data Tab */}
			{activeTab === 'financial' && (
				<div className="space-y-6">
					{/* Summary Dashboard */}
					<div className="grid gap-4 md:grid-cols-2">
						<Card className="border-blue-200 dark:border-blue-800">
							<CardContent className="p-6">
								<div className="flex items-center justify-between mb-4">
									<DollarSign className="h-8 w-8 text-blue-600" />
								</div>
								<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
									재무 연도
								</div>
								<div className="text-3xl font-bold">{financialRecords.length}</div>
							</CardContent>
						</Card>
						<Card className="border-purple-200 dark:border-purple-800">
							<CardContent className="p-6">
								<div className="flex items-center justify-between mb-4">
									<FileText className="h-8 w-8 text-purple-600" />
								</div>
								<div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
									재무 문서
								</div>
								<div className="text-3xl font-bold">{uploadedDocuments.length}</div>
							</CardContent>
						</Card>
					</div>

					{/* Financial Data Section */}
					<Card className="border-blue-200 dark:border-blue-800">
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<h2 className="text-xl font-bold flex items-center gap-2">
										<DollarSign className="h-6 w-6 text-blue-600" />
										재무 데이터 (Financial Data)
									</h2>
									<p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
										연도별 재무 데이터를 입력하고 재무제표 문서를 업로드하세요
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
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Document Upload */}
							<div className="border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-2xl p-8 text-center hover:border-blue-500 transition-colors bg-blue-50/30 dark:bg-blue-900/10">
								<input
									type="file"
									id="financial-file-upload"
									className="hidden"
									accept=".pdf,.xls,.xlsx,.csv"
									onChange={handleFileUpload}
								/>
								<label htmlFor="financial-file-upload" className="cursor-pointer">
									<Upload className="h-12 w-12 mx-auto mb-4 text-blue-400" />
									<p className="font-medium mb-2">재무제표 파일 업로드</p>
									<p className="text-sm text-neutral-600 dark:text-neutral-400">
										PDF, Excel, CSV (최대 10MB)
									</p>
								</label>
							</div>

							{/* Uploaded Documents */}
							{uploadedDocuments.length > 0 && (
								<div className="space-y-3">
									<h4 className="font-semibold text-sm flex items-center gap-2">
										<FileText className="h-4 w-4" />
										업로드된 문서 ({uploadedDocuments.length})
									</h4>
									{uploadedDocuments.map((doc) => (
										<div
											key={doc.id}
											className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900 hover:border-primary transition-colors"
										>
											<div className="flex items-center gap-3 flex-1 min-w-0">
												<FileText className="h-8 w-8 text-blue-600 shrink-0" />
												<div className="min-w-0 flex-1">
													<p className="font-medium truncate">{doc.name}</p>
													<p className="text-sm text-neutral-600 dark:text-neutral-400">
														{formatFileSize(doc.size)} • {doc.year}년 • {doc.uploadedAt.toLocaleDateString('ko-KR')}
													</p>
												</div>
											</div>
											<button
												onClick={() => handleDeleteDocument(doc.id)}
												className="text-red-500 hover:text-red-600 transition-colors ml-2 shrink-0 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
											>
												<Trash2 className="h-4 w-4" />
											</button>
										</div>
									))}
								</div>
							)}

							{/* Financial Records */}
							<div className="space-y-4">
								{financialRecords.map((record, index) => (
									<div key={index} className="p-6 border border-neutral-200 dark:border-neutral-800 rounded-2xl">
										<div className="flex items-center justify-between mb-4">
											<h3 className="text-lg font-bold">{record.year}년 재무 데이터</h3>
											<button
												onClick={() => handleDeleteFinancialRecord(index)}
												className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
											>
												<Trash2 className="h-5 w-5" />
											</button>
										</div>
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
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Add Goal Dialog */}
			{showAddGoal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
					<div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-xl font-bold flex items-center gap-2">
									<Target className="h-5 w-5 text-primary" />
									새 전사 목표 추가
								</h3>
								<button
									onClick={() => setShowAddGoal(false)}
									className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
								>
									<X className="h-5 w-5" />
								</button>
							</div>

							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium mb-2">
										목표 이름 <span className="text-red-500">*</span>
									</label>
									<Input
										value={newGoal.name || ''}
										onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
										placeholder="예: 연매출 100억 달성"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium mb-2">설명</label>
									<Textarea
										value={newGoal.description || ''}
										onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
										placeholder="목표에 대한 상세 설명을 입력하세요"
										rows={3}
									/>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium mb-2">
											카테고리 <span className="text-red-500">*</span>
										</label>
										<select
											value={newGoal.category || ''}
											onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
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

									<div>
										<label className="block text-sm font-medium mb-2">우선순위</label>
										<select
											value={newGoal.priority || 'medium'}
											onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value as 'high' | 'medium' | 'low' })}
											className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900"
										>
											<option value="high">높음</option>
											<option value="medium">중간</option>
											<option value="low">낮음</option>
										</select>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium mb-2">기간</label>
										<select
											value={newGoal.period || 'quarterly'}
											onChange={(e) => setNewGoal({ ...newGoal, period: e.target.value as 'quarterly' | 'annual' })}
											className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900"
										>
											<option value="quarterly">분기</option>
											<option value="annual">연간</option>
										</select>
									</div>

									<div>
										<label className="block text-sm font-medium mb-2">연도</label>
										<Input
											type="number"
											value={newGoal.year || new Date().getFullYear()}
											onChange={(e) => setNewGoal({ ...newGoal, year: e.target.value })}
											placeholder="2024"
										/>
									</div>
								</div>

								{newGoal.period === 'quarterly' && (
									<div>
										<label className="block text-sm font-medium mb-2">분기</label>
										<select
											value={newGoal.quarter || 'Q1'}
											onChange={(e) => setNewGoal({ ...newGoal, quarter: e.target.value })}
											className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900"
										>
											<option value="Q1">Q1</option>
											<option value="Q2">Q2</option>
											<option value="Q3">Q3</option>
											<option value="Q4">Q4</option>
										</select>
									</div>
								)}

								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium mb-2">
											목표 값 <span className="text-red-500">*</span>
										</label>
										<Input
											type="number"
											value={newGoal.targetValue || ''}
											onChange={(e) => setNewGoal({ ...newGoal, targetValue: e.target.value })}
											placeholder="10000000000"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium mb-2">단위</label>
										<Input
											value={newGoal.unit || ''}
											onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
											placeholder="KRW, USD, %, 건"
										/>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium mb-2">측정 방법</label>
									<Input
										value={newGoal.measurementMethod || ''}
										onChange={(e) => setNewGoal({ ...newGoal, measurementMethod: e.target.value })}
										placeholder="예: 월별 매출 집계"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium mb-2">연관 부서</label>
									<select
										multiple
										value={newGoal.department || []}
										onChange={(e) => {
											const selected = Array.from(e.target.selectedOptions, option => option.value)
											setNewGoal({ ...newGoal, department: selected })
										}}
										className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900 min-h-[120px]"
									>
										{departments.map((dept) => (
											<option key={dept} value={dept}>
												{dept}
											</option>
										))}
									</select>
									<p className="text-xs text-neutral-500 mt-1">Ctrl/Cmd를 눌러 여러 부서를 선택하세요</p>
								</div>

								<div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800">
									<input
										type="checkbox"
										id="ai-recommendation"
										checked={newGoal.aiRecommendationEnabled ?? true}
										onChange={(e) => setNewGoal({ ...newGoal, aiRecommendationEnabled: e.target.checked })}
										className="w-4 h-4"
									/>
									<label htmlFor="ai-recommendation" className="text-sm font-medium flex items-center gap-2">
										<Brain className="h-4 w-4 text-green-600" />
										AI 기반 OKR 추천 활성화
									</label>
								</div>

								<div className="flex items-center gap-2 pt-2">
									<Button onClick={handleAddGoal} className="flex-1 justify-center">
										추가
									</Button>
									<Button
										variant="outline"
										onClick={() => setShowAddGoal(false)}
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

			{/* Add Template Dialog */}
			{showAddTemplate && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
					<div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-xl font-bold flex items-center gap-2">
									<Sparkles className="h-5 w-5 text-green-600" />
									새 OKR 템플릿 추가
								</h3>
								<button
									onClick={() => setShowAddTemplate(false)}
									className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
								>
									<X className="h-5 w-5" />
								</button>
							</div>

							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium mb-2">
										연결할 전사 목표 <span className="text-red-500">*</span>
									</label>
									<select
										value={newTemplate.goalId || ''}
										onChange={(e) => setNewTemplate({ ...newTemplate, goalId: e.target.value })}
										className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900"
									>
										<option value="">선택하세요</option>
										{companyGoals.map((goal) => (
											<option key={goal.id} value={goal.id}>
												{goal.name} ({goal.period === 'annual' ? goal.year : `${goal.year} ${goal.quarter}`})
											</option>
										))}
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium mb-2">
										템플릿 이름 <span className="text-red-500">*</span>
									</label>
									<Input
										value={newTemplate.name || ''}
										onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
										placeholder="예: 신규 고객 획득 증대"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium mb-2">설명</label>
									<Textarea
										value={newTemplate.description || ''}
										onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
										placeholder="템플릿에 대한 상세 설명을 입력하세요"
										rows={3}
									/>
								</div>

								<div>
									<label className="block text-sm font-medium mb-2">
										대상 부서 <span className="text-red-500">*</span>
									</label>
									<select
										multiple
										value={newTemplate.targetDepartment || []}
										onChange={(e) => {
											const selected = Array.from(e.target.selectedOptions, option => option.value)
											setNewTemplate({ ...newTemplate, targetDepartment: selected })
										}}
										className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900 min-h-[100px]"
									>
										{departments.map((dept) => (
											<option key={dept} value={dept}>
												{dept}
											</option>
										))}
									</select>
									<p className="text-xs text-neutral-500 mt-1">Ctrl/Cmd를 눌러 여러 부서를 선택하세요</p>
								</div>

								<div>
									<label className="block text-sm font-medium mb-2">대상 역할</label>
									<select
										multiple
										value={newTemplate.targetRole || []}
										onChange={(e) => {
											const selected = Array.from(e.target.selectedOptions, option => option.value)
											setNewTemplate({ ...newTemplate, targetRole: selected })
										}}
										className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900 min-h-[100px]"
									>
										{roles.map((role) => (
											<option key={role} value={role}>
												{role}
											</option>
										))}
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium mb-2">추천 점수 (0-100)</label>
									<Input
										type="number"
										min="0"
										max="100"
										value={newTemplate.recommendationScore || 50}
										onChange={(e) => setNewTemplate({ ...newTemplate, recommendationScore: Number(e.target.value) })}
									/>
								</div>

								<div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800">
									<input
										type="checkbox"
										id="auto-assign"
										checked={newTemplate.autoAssign || false}
										onChange={(e) => setNewTemplate({ ...newTemplate, autoAssign: e.target.checked })}
										className="w-4 h-4"
									/>
									<label htmlFor="auto-assign" className="text-sm font-medium">
										해당 부서/역할에 자동 할당
									</label>
								</div>

								{/* Key Results */}
								<div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
									<div className="flex items-center justify-between mb-3">
										<label className="block text-sm font-medium">핵심 결과 (Key Results)</label>
										<Button variant="outline" size="sm" onClick={addKeyResult} className="flex items-center gap-1">
											<Plus className="h-3 w-3" />
											추가
										</Button>
									</div>
									
									{(newTemplate.keyResults || []).length === 0 ? (
										<p className="text-sm text-neutral-500 text-center py-4">
											핵심 결과를 추가하세요
										</p>
									) : (
										<div className="space-y-3">
											{(newTemplate.keyResults || []).map((kr) => (
												<div key={kr.id} className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-2xl">
													<div className="flex items-start gap-2 mb-3">
														<Input
															value={kr.description}
															onChange={(e) => updateKeyResult(kr.id, 'description', e.target.value)}
															placeholder="핵심 결과 설명"
															className="flex-1"
														/>
														<button
															onClick={() => removeKeyResult(kr.id)}
															className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
														>
															<X className="h-4 w-4" />
														</button>
													</div>
													<div className="grid grid-cols-2 gap-2">
														<Input
															type="number"
															value={kr.targetValue}
															onChange={(e) => updateKeyResult(kr.id, 'targetValue', e.target.value)}
															placeholder="목표 값"
														/>
														<Input
															value={kr.unit}
															onChange={(e) => updateKeyResult(kr.id, 'unit', e.target.value)}
															placeholder="단위"
														/>
													</div>
												</div>
											))}
										</div>
									)}
								</div>

								<div className="flex items-center gap-2 pt-2">
									<Button onClick={handleAddTemplate} className="flex-1 justify-center">
										추가
									</Button>
									<Button
										variant="outline"
										onClick={() => setShowAddTemplate(false)}
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
			
			<Toaster />
		</div>
	)
}
