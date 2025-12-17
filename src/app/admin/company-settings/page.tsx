import { useI18n } from '../../../i18n/I18nProvider'
import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent } from '../../../components/ui/Card'
import { PageHeader } from '../../../components/common/PageHeader'
import {
	Building2,
	DollarSign,
	Users,
	Briefcase,
	CheckCircle2,
	FileText,
	Clock,
	History,
} from 'lucide-react'
import { toast } from 'sonner'
import Toaster from '../../../components/ui/Toaster'
import { storage } from '../../../utils/storage'
import WorkplaceTab from './_components/WorkplaceTab'
import BusinessTab from './_components/BusinessTab'
import CompanyInfoTab from './_components/CompanyInfoTab'
import DocumentsTab from './_components/DocumentsTab'
import LeadershipTab from './_components/LeadershipTab'
import FinancialTab from './_components/FinancialTab'
import HistoryTab from './_components/HistoryTab'
import type {
	CompanyInfo,
	LeadershipMember,
	FinancialData,
	UploadedDocument,
	WorkplaceSettings,
	HistoricalData,
} from './_types/types'

// Company Settings Page
export default function CompanySettingsPage() {
	const { t } = useI18n()
	const [activeTab, setActiveTab] = useState<'company' | 'leadership' | 'business' | 'financial' | 'documents' | 'workplace' | 'history'>('company')
	
	// Helper function to get initial company info
	const getInitialCompanyInfo = (): CompanyInfo => {
		// Try to load from localStorage
		const saved = localStorage.getItem('companyInfo') || localStorage.getItem('company_settings')
		if (saved) {
			try {
				return JSON.parse(saved)
			} catch (error) {
				console.error('Failed to parse company info:', error)
			}
		}
		
		// Default values
		return {
			// Basic Info
			name: 'Proce Inc.',
			legalName: 'Proce Incorporated',
			businessNumber: '123-45-67890',
			industry: 'IT / SaaS / Software',
			companySize: 'Medium (100-500)',
			foundedYear: '2020',
			foundedDate: '2020-03-15',
			
			// Contact
			address: '서울특별시 강남구 테헤란로 123',
			city: '서울',
			postalCode: '06234',
			country: '대한민국',
			phone: '+82-2-1234-5678',
			email: 'contact@proce.com',
			website: 'https://proce.com',
			socialLinks: [
				{ platform: 'LinkedIn', url: 'https://linkedin.com/company/proce' },
				{ platform: 'Twitter', url: 'https://twitter.com/proce' },
				{ platform: 'Facebook', url: 'https://facebook.com/proce' },
			],
			
			// Business
			description: 'Proce는 조직의 실행 리듬을 최적화하는 AI 기반 워크플로우 플랫폼입니다. 팀의 업무 흐름을 자동화하고, 프로젝트 관리를 효율화하며, 데이터 기반 의사결정을 지원합니다.',
			vision: '모든 조직이 자신만의 실행 리듬을 찾아 지속 가능한 성장을 이루도록 돕는다',
			mission: 'AI와 인간의 협업을 통해 조직의 생산성과 효율성을 극대화하고, 직원들의 워크라이프 밸런스를 개선한다',
			mainProducts: 'Proce Workflow Platform, Proce Analytics, Proce AI Assistant',
			mainServices: '워크플로우 자동화, 프로젝트 관리, 데이터 분석 및 인사이트, AI 기반 작업 추천',
			targetMarket: '중소기업부터 대기업까지, 프로젝트 기반 업무를 수행하는 모든 조직',
			targetCustomers: '프로젝트 매니저, 팀 리더, 임원진, HR 담당자',
			competitiveAdvantage: 'AI 기반 자동화, 실행 리듬 기반 UX, 실시간 협업 도구, 데이터 기반 인사이트',
			
			// Workforce
			employeeCount: '247',
			fullTimeCount: '220',
			partTimeCount: '27',
		}
	}
	
	// Company Info State
	const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(getInitialCompanyInfo())

	// Leadership State
	const [leadership, setLeadership] = useState<LeadershipMember[]>([
		{
			id: '1',
			name: '김대표',
			position: 'CEO',
			email: 'ceo@proce.com',
			phone: '+82-10-1234-5678',
			department: 'Executive',
		},
		{
			id: '2',
			name: '이재무',
			position: 'CFO',
			email: 'cfo@proce.com',
			phone: '+82-10-2345-6789',
			department: 'Finance',
		},
		{
			id: '3',
			name: '박기술',
			position: 'CTO',
			email: 'cto@proce.com',
			phone: '+82-10-3456-7890',
			department: 'Engineering',
		},
		{
			id: '4',
			name: '최운영',
			position: 'COO',
			email: 'coo@proce.com',
			phone: '+82-10-4567-8901',
			department: 'Operations',
		},
		{
			id: '5',
			name: '정마케팅',
			position: 'CMO',
			email: 'cmo@proce.com',
			phone: '+82-10-5678-9012',
			department: 'Marketing',
		},
		{
			id: '6',
			name: '강인사',
			position: 'CHRO',
			email: 'chro@proce.com',
			phone: '+82-10-6789-0123',
			department: 'HR',
		},
	])
	const [isAddingLeader, setIsAddingLeader] = useState(false)
	const [newLeader, setNewLeader] = useState<Partial<LeadershipMember>>({
		name: '',
		position: '',
		email: '',
		phone: '',
		department: '',
	})
	const [editingLeader, setEditingLeader] = useState<string | null>(null)

	// Financial State
	const [financialData, setFinancialData] = useState<FinancialData[]>([
		{
			year: '2024',
			totalRevenue: '50000000000',
			netIncome: '8000000000',
			totalAssets: '120000000000',
			totalLiabilities: '70000000000',
			documents: [
				{
					id: '1',
					name: '2024_Q3_Financial_Report.pdf',
					size: 2456789,
					uploadedAt: '2024-10-15T10:30:00Z',
				},
				{
					id: '2',
					name: '2024_Annual_Budget.xlsx',
					size: 1234567,
					uploadedAt: '2024-01-10T09:00:00Z',
				},
			],
		},
		{
			year: '2023',
			totalRevenue: '35000000000',
			netIncome: '5000000000',
			totalAssets: '90000000000',
			totalLiabilities: '55000000000',
			documents: [
				{
					id: '3',
					name: '2023_Annual_Report.pdf',
					size: 3456789,
					uploadedAt: '2024-02-20T14:00:00Z',
				},
			],
		},
		{
			year: '2022',
			totalRevenue: '25000000000',
			netIncome: '3000000000',
			totalAssets: '60000000000',
			totalLiabilities: '35000000000',
			documents: [
				{
					id: '4',
					name: '2022_Financial_Statement.pdf',
					size: 2234567,
					uploadedAt: '2023-03-15T11:00:00Z',
				},
			],
		},
	])
	const [isAddingFinancial, setIsAddingFinancial] = useState(false)
	const [newFinancialYear, setNewFinancialYear] = useState<Omit<FinancialData, 'documents'> & { documents?: UploadedDocument[] }>({
		year: new Date().getFullYear().toString(),
		totalRevenue: '',
		netIncome: '',
		totalAssets: '',
		totalLiabilities: '',
		documents: [],
	})

	// Documents State
	const [documents, setDocuments] = useState<UploadedDocument[]>([
		{
			id: '1',
			name: 'Company_Registration_Certificate.pdf',
			size: 1234567,
			type: 'application/pdf',
			category: 'legal',
			uploadedAt: '2024-01-15T10:00:00Z',
			uploadedBy: '김대표',
		},
		{
			id: '2',
			name: 'Employee_Handbook_2024.pdf',
			size: 2345678,
			type: 'application/pdf',
			category: 'hr',
			uploadedAt: '2024-02-01T14:30:00Z',
			uploadedBy: '강인사',
		},
		{
			id: '3',
			name: 'Partnership_Agreement_ABC_Corp.pdf',
			size: 3456789,
			type: 'application/pdf',
			category: 'contracts',
			uploadedAt: '2024-03-10T09:15:00Z',
			uploadedBy: '이재무',
		},
		{
			id: '4',
			name: 'Marketing_Strategy_2024.pptx',
			size: 4567890,
			type: 'application/vnd.ms-powerpoint',
			category: 'strategy',
			uploadedAt: '2024-04-05T16:45:00Z',
			uploadedBy: '정마케팅',
		},
		{
			id: '5',
			name: 'Technical_Architecture_Document.pdf',
			size: 5678901,
			type: 'application/pdf',
			category: 'technical',
			uploadedAt: '2024-05-20T11:20:00Z',
			uploadedBy: '박기술',
		},
		{
			id: '6',
			name: 'Compliance_Report_Q3_2024.pdf',
			size: 2345678,
			type: 'application/pdf',
			category: 'compliance',
			uploadedAt: '2024-10-15T13:00:00Z',
			uploadedBy: '최운영',
		},
	])

	// Workplace State
	const [workplaceSettings, setWorkplaceSettings] = useState<WorkplaceSettings>({
		language: 'ko',
		timezone: 'Asia/Seoul',
		workingDays: [1, 2, 3, 4, 5],
		workingHours: { start: '09:00', end: '18:00' },
		quietHours: { start: '22:00', end: '08:00' },
	})

	// Historical Data State
	const [historicalData, setHistoricalData] = useState<HistoricalData[]>([
		{
			id: '1',
			projectName: 'Legacy System Migration',
			description: 'Migrated on-premise monolithic system to cloud-based microservices architecture.',
			startDate: '2022-01-15',
			endDate: '2022-11-30',
			outcome: 'Reduced maintenance costs by 40% and improved uptime to 99.99%.',
			technologies: ['AWS', 'Docker', 'Kubernetes', 'Node.js'],
			teamSize: 12,
			budget: '500,000,000 KRW',
			keyLearnings: 'Importance of comprehensive automated testing before migration.'
		}
	])

	// Available departments from system settings
	const [availableDepartments, setAvailableDepartments] = useState<{ id: string; name: string }[]>([])

	// Load data from localStorage
	useEffect(() => {
		try {
			const savedInfo = storage.get<any>('companyInfo')
			if (savedInfo && Object.keys(savedInfo).length > 0) {
				setCompanyInfo(savedInfo)
			}
		} catch (error) {
			console.error('Failed to load company info:', error)
			toast.error('Failed to load company information')
		}
		
		try {
			const savedLeadership = storage.get<any>('leadership')
			if (savedLeadership && Array.isArray(savedLeadership) && savedLeadership.length > 0) {
				setLeadership(savedLeadership)
			}
		} catch (error) {
			console.error('Failed to load leadership:', error)
		}
		
		try {
			const savedFinancial = storage.get<any>('financialData')
			if (savedFinancial && Array.isArray(savedFinancial) && savedFinancial.length > 0) {
				setFinancialData(savedFinancial)
			}
		} catch (error) {
			console.error('Failed to load financial data:', error)
		}
		
		try {
			const savedDocuments = storage.get<any>('companyDocuments')
			if (savedDocuments && Array.isArray(savedDocuments) && savedDocuments.length > 0) {
				setDocuments(savedDocuments)
			}
		} catch (error) {
			console.error('Failed to load documents:', error)
		}
		
		try {
			const savedWorkplace = storage.get<any>('workplaceSettings')
			if (savedWorkplace && Object.keys(savedWorkplace).length > 0) {
				setWorkplaceSettings(savedWorkplace)
			}
		} catch (error) {
			console.error('Failed to load workplace settings:', error)
		}
		
		try {
			const savedHistory = storage.get<any>('historicalData')
			if (savedHistory && Array.isArray(savedHistory) && savedHistory.length > 0) {
				setHistoricalData(savedHistory)
			}
		} catch (error) {
			console.error('Failed to load historical data:', error)
		}

		// Load departments from system settings
		try {
			const savedDepartments = storage.get<any>('departments')
			if (savedDepartments) {
				const depts = savedDepartments
				setAvailableDepartments(depts.map((d: { id: string; name: string }) => ({ id: d.id, name: d.name })))
			} else {
				// Fallback to mock data
				const mockDepts = [
					{ id: '1', name: 'Executive' },
					{ id: '2', name: 'Engineering' },
					{ id: '3', name: 'Product' },
					{ id: '4', name: 'Marketing' },
				]
				setAvailableDepartments(mockDepts)
			}
		} catch (error) {
			console.error('Failed to load departments:', error)
		}
	}, [])

	// Calculate completion progress
	const completionStats = useMemo(() => {
		const allFields = Object.values(companyInfo)
		const filledFields = allFields.filter(value => {
			if (Array.isArray(value)) {
				return value.length > 0
			}
			return value && typeof value === 'string' && value.trim() !== ''
		}).length
		const percentage = Math.round((filledFields / allFields.length) * 100)
		return { filledFields, totalFields: allFields.length, percentage }
	}, [companyInfo])

	// Handlers
	const handleCompanyInfoChange = (field: keyof CompanyInfo, value: string | string[] | Array<{ platform: string; url: string }>) => {
		setCompanyInfo(prev => ({ ...prev, [field]: value }))
	}

	const handleSaveCompanyInfo = () => {
		try {
			localStorage.setItem('companyInfo', JSON.stringify(companyInfo))
			localStorage.setItem('company_settings', JSON.stringify(companyInfo))
			
			// Trigger a custom event to notify other components
			window.dispatchEvent(new CustomEvent('companySettingsChanged', { 
				detail: { name: companyInfo.name } 
			}))
			
			toast.success('Company information saved successfully')
		} catch (error) {
			console.error('Failed to save company info:', error)
			toast.error('Failed to save company information')
		}
	}

	const handleAddSocialLink = () => {
		setCompanyInfo(prev => ({
			...prev,
			socialLinks: [...prev.socialLinks, { platform: '', url: '' }]
		}))
	}

	const handleRemoveSocialLink = (index: number) => {
		setCompanyInfo(prev => ({
			...prev,
			socialLinks: prev.socialLinks.filter((_, i) => i !== index)
		}))
	}

	const handleSocialLinkChange = (index: number, field: 'platform' | 'url', value: string) => {
		setCompanyInfo(prev => ({
			...prev,
			socialLinks: prev.socialLinks.map((link, i) => 
				i === index ? { ...link, [field]: value } : link
			)
		}))
	}

	// Leadership handlers
	const handleAddLeader = () => {
		if (!newLeader.name || !newLeader.position) {
			toast.error('Please fill in name and position')
			return
		}
		
		const leader: LeadershipMember = {
			id: Date.now().toString(),
			name: newLeader.name!,
			position: newLeader.position!,
			email: newLeader.email || '',
			phone: newLeader.phone || '',
			department: newLeader.department || '',
		}
		
		const updatedLeadership = [...leadership, leader]
		setLeadership(updatedLeadership)
		
		try {
			localStorage.setItem('leadership', JSON.stringify(updatedLeadership))
		} catch (error) {
			console.error('Failed to save leadership:', error)
		}
		
		setIsAddingLeader(false)
		setNewLeader({
			name: '',
			position: '',
			email: '',
			phone: '',
			department: '',
		})
		toast.success('Leader added successfully')
	}

	const handleDeleteLeader = (id: string) => {
		const updatedLeadership = leadership.filter(l => l.id !== id)
		setLeadership(updatedLeadership)
		
		try {
			localStorage.setItem('leadership', JSON.stringify(updatedLeadership))
			toast.success('Leader deleted')
		} catch (error) {
			console.error('Failed to delete leader:', error)
			toast.error('Failed to delete leader')
		}
	}

	const handleUpdateLeader = (id: string, field: keyof LeadershipMember, value: string) => {
		const updatedLeadership = leadership.map(l => 
			l.id === id ? { ...l, [field]: value } : l
		)
		setLeadership(updatedLeadership)
		localStorage.setItem('leadership', JSON.stringify(updatedLeadership))
	}

	const handleSaveLeaderEdit = () => {
		setEditingLeader(null)
		localStorage.setItem('leadership', JSON.stringify(leadership))
		toast.success('Leader updated')
	}

	const handleAddFinancialData = () => {
		if (!newFinancialYear.year || !newFinancialYear.totalRevenue) {
			toast.error('Please fill in required fields')
			return
		}
		
		const updatedData = [...financialData, newFinancialYear].sort((a, b) => 
			parseInt(b.year) - parseInt(a.year)
		)
		setFinancialData(updatedData)
		localStorage.setItem('financialData', JSON.stringify(updatedData))
		
		setIsAddingFinancial(false)
		setNewFinancialYear({
			year: (parseInt(newFinancialYear.year) + 1).toString(),
			totalRevenue: '',
			netIncome: '',
			totalAssets: '',
			totalLiabilities: '',
			documents: [],
		})
		toast.success('Financial data added successfully')
	}

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, year: string) => {
		const files = event.target.files
		if (!files || files.length === 0) return

		const newDocuments: UploadedDocument[] = Array.from(files).map(file => ({
			id: `${Date.now()}-${Math.random()}`,
			name: file.name,
			size: file.size,
			type: file.type,
			uploadedAt: new Date().toISOString(),
		}))

		const updatedData = financialData.map(data => 
			data.year === year 
				? { ...data, documents: [...(data.documents || []), ...newDocuments] }
				: data
		)
		setFinancialData(updatedData)
		localStorage.setItem('financialData', JSON.stringify(updatedData))
		toast.success(`${newDocuments.length} file(s) uploaded successfully`)
	}

	const handleDeleteFinancialDocument = (year: string, docId: string) => {
		const updatedData = financialData.map(data =>
			data.year === year
				? { ...data, documents: (data.documents || []).filter(d => d.id !== docId) }
				: data
		)
		setFinancialData(updatedData)
		localStorage.setItem('financialData', JSON.stringify(updatedData))
		toast.success('Document deleted')
	}

	const handleGeneralFileUpload = (event: React.ChangeEvent<HTMLInputElement>, category?: string) => {
		const files = event.target.files
		if (!files || files.length === 0) return

		const newDocuments: UploadedDocument[] = Array.from(files).map(file => ({
			id: `${Date.now()}-${Math.random()}`,
			name: file.name,
			size: file.size,
			type: file.type,
			category: category || 'General',
			uploadedAt: new Date().toISOString(),
			uploadedBy: 'User', // Fallback if auth user not available
		}))

		const updatedDocuments = [...documents, ...newDocuments]
		setDocuments(updatedDocuments)
		localStorage.setItem('companyDocuments', JSON.stringify(updatedDocuments))
		toast.success(`${newDocuments.length} file(s) uploaded successfully`)
	}

	const handleDeleteGeneralDocument = (docId: string) => {
		const updatedDocuments = documents.filter(d => d.id !== docId)
		setDocuments(updatedDocuments)
		localStorage.setItem('companyDocuments', JSON.stringify(updatedDocuments))
		toast.success('Document deleted')
	}

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return '0 Bytes'
		const k = 1024
		const sizes = ['Bytes', 'KB', 'MB', 'GB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
	}

	const handleSaveWorkplace = () => {
		try {
			localStorage.setItem('workplaceSettings', JSON.stringify(workplaceSettings))
			toast.success('Workplace settings saved successfully')
		} catch (error) {
			console.error('Failed to save workplace settings:', error)
			toast.error('Failed to save workplace settings')
		}
	}

	const handleAddHistory = (data: Omit<HistoricalData, 'id'>) => {
		const newRecord: HistoricalData = {
			...data,
			id: Date.now().toString(),
		}
		const updatedHistory = [...historicalData, newRecord]
		setHistoricalData(updatedHistory)
		localStorage.setItem('historicalData', JSON.stringify(updatedHistory))
		toast.success('Historical record added')
	}

	const handleUpdateHistory = (id: string, data: Partial<HistoricalData>) => {
		const updatedHistory = historicalData.map(item => 
			item.id === id ? { ...item, ...data } : item
		)
		setHistoricalData(updatedHistory)
		localStorage.setItem('historicalData', JSON.stringify(updatedHistory))
		toast.success('Historical record updated')
	}

	const handleDeleteHistory = (id: string) => {
		const updatedHistory = historicalData.filter(item => item.id !== id)
		setHistoricalData(updatedHistory)
		localStorage.setItem('historicalData', JSON.stringify(updatedHistory))
		toast.success('Historical record deleted')
	}

	const handleDeleteFinancialData = (year: string) => {
		const updatedData = financialData.filter(f => f.year !== year)
		setFinancialData(updatedData)
		localStorage.setItem('financialData', JSON.stringify(updatedData))
		toast.success('Financial data deleted')
	}

	const formatCurrency = (value: string) => {
		if (!value) return ''
		return new Intl.NumberFormat('ko-KR', {
			style: 'currency',
			currency: 'KRW',
			maximumFractionDigits: 0
		}).format(Number(value))
	}

	return (
		<>
			<div className="min-h-screen bg-background-dark text-neutral-100">
				<Toaster />
				
				<div className="max-w-[1600px] mx-auto px-6 py-6 space-y-8">
					{/* Header */}
					<PageHeader
						title={t('companySettings.title')}
						description={t('companySettings.description')}
						tabs={{
							items: [
								{ id: 'company', label: t('companySettings.tabs.company'), icon: Building2 },
								{ id: 'business', label: t('companySettings.tabs.business'), icon: Briefcase },
								{ id: 'leadership', label: t('companySettings.tabs.leadership'), icon: Users },
								{ id: 'financial', label: t('companySettings.tabs.financial'), icon: DollarSign },
								{ id: 'workplace', label: t('companySettings.tabs.workplace'), icon: Clock },
							{ id: 'documents', label: t('companySettings.tabs.documents'), icon: FileText },
							{ id: 'history', label: t('companySettings.tabs.projectHistory'), icon: History },
						],
							activeTab,
							onTabChange: (id) => setActiveTab(id as any),
							mobileLabels: {
								'company': 'Info',
								'leadership': 'Leaders',
								'financial': 'Finance',
								'workplace': 'Work',
								'documents': 'Docs',
								'history': 'History',
							}
						}}
					>
						{/* Progress Bar */}
						<Card className="border-border-dark bg-surface-dark mt-6">
							<CardContent className="p-6">
								<div className="flex items-center justify-between mb-4">
									<div className="flex items-center gap-3">
										<CheckCircle2 className="h-5 w-5 text-orange-500" />
										<h3 className="font-bold text-lg text-white">Profile Completion</h3>
									</div>
									<div className="text-3xl font-bold text-orange-500">{completionStats.percentage}%</div>
								</div>
								<div className="relative w-full h-3 bg-neutral-800 rounded-full overflow-hidden">
									<div
										className="absolute top-0 left-0 h-full bg-orange-500 rounded-full transition-all duration-500 ease-out"
										style={{ width: `${completionStats.percentage}%` }}
									/>
								</div>
							</CardContent>
						</Card>
					</PageHeader>
					
					<div className="space-y-6">
						{/* Company Info Tab (Basic + Contact merged) */}
						{activeTab === 'company' && (
							<CompanyInfoTab
								companyInfo={companyInfo}
								onChange={handleCompanyInfoChange}
								onSave={handleSaveCompanyInfo}
								onAddSocialLink={handleAddSocialLink}
								onRemoveSocialLink={handleRemoveSocialLink}
								onSocialLinkChange={handleSocialLinkChange}
							/>
						)}

						{/* Leadership Tab */}
						{activeTab === 'leadership' && (
							<LeadershipTab
								leadership={leadership}
								isAddingLeader={isAddingLeader}
								editingLeader={editingLeader}
								newLeader={newLeader}
								availableDepartments={availableDepartments}
								onSetIsAddingLeader={setIsAddingLeader}
								onSetEditingLeader={setEditingLeader}
								onSetNewLeader={setNewLeader}
								onAddLeader={handleAddLeader}
								onUpdateLeader={handleUpdateLeader}
								onDeleteLeader={handleDeleteLeader}
								onSaveEdit={handleSaveLeaderEdit}
							/>
						)}

						{/* Business Tab */}
						{activeTab === 'business' && (
							<BusinessTab
								companyInfo={companyInfo}
								onChange={handleCompanyInfoChange}
								onSave={handleSaveCompanyInfo}
							/>
						)}

						{/* Workplace Tab */}
						{activeTab === 'workplace' && (
							<WorkplaceTab
								settings={workplaceSettings}
								onChange={setWorkplaceSettings}
								onSave={handleSaveWorkplace}
							/>
						)}

						{/* Financial Tab */}
						{activeTab === 'financial' && (
							<FinancialTab
								financialData={financialData}
								isAddingFinancial={isAddingFinancial}
								newFinancialYear={newFinancialYear}
								onSetIsAddingFinancial={setIsAddingFinancial}
								onSetNewFinancialYear={setNewFinancialYear}
								onAddFinancialData={handleAddFinancialData}
								onDeleteFinancialData={handleDeleteFinancialData}
								onFileUpload={handleFileUpload}
								onDeleteFinancialDocument={handleDeleteFinancialDocument}
								formatCurrency={formatCurrency}
								formatFileSize={formatFileSize}
							/>
						)}

						{/* Documents Tab */}
						{activeTab === 'documents' && (
							<DocumentsTab
								documents={documents}
								onUpload={handleGeneralFileUpload}
								onDelete={handleDeleteGeneralDocument}
								formatFileSize={formatFileSize}
							/>
						)}

						{/* History Tab */}
						{activeTab === 'history' && (
							<HistoryTab
								historicalData={historicalData}
								onAdd={handleAddHistory}
								onUpdate={handleUpdateHistory}
								onDelete={handleDeleteHistory}
							/>
						)}
					</div>
				</div>
			</div>
		</>
	)
}
