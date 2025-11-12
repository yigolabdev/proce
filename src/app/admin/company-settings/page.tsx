import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent } from '../../../components/ui/Card'
import {
	Building2,
	DollarSign,
	Target,
	Users,
	Briefcase,
	CheckCircle2,
	FileText,
	Clock
} from 'lucide-react'
import { toast } from 'sonner'
import Toaster from '../../../components/ui/Toaster'
import { storage } from '../../../utils/storage'
import KPITab from './_components/KPITab'
import WorkplaceTab from './_components/WorkplaceTab'
import BusinessTab from './_components/BusinessTab'
import CompanyInfoTab from './_components/CompanyInfoTab'
import DocumentsTab from './_components/DocumentsTab'
import LeadershipTab from './_components/LeadershipTab'
import FinancialTab from './_components/FinancialTab'
import type {
	CompanyInfo,
	LeadershipMember,
	CompanyKPI,
	FinancialData,
	UploadedDocument,
	WorkplaceSettings,
} from './_types/types'

export default function CompanySettingsPage() {
	const [activeTab, setActiveTab] = useState<'company' | 'leadership' | 'business' | 'goals' | 'financial' | 'documents' | 'workplace'>('company')
	
	// Company Info State
	const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
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
		],
		
		// Business
		description: '',
		vision: '',
		mission: '',
		mainProducts: '',
		mainServices: '',
		targetMarket: '',
		targetCustomers: '',
		competitiveAdvantage: '',
		
		// Workforce
		employeeCount: '247',
		fullTimeCount: '220',
		partTimeCount: '27',
	})

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

	// KPIs State
	const [companyKPIs, setCompanyKPIs] = useState<CompanyKPI[]>([])
	const [isAddingKPI, setIsAddingKPI] = useState(false)
	const [editingKPI, setEditingKPI] = useState<string | null>(null)
	const [newKPI, setNewKPI] = useState<Partial<CompanyKPI>>({
		name: '',
		description: '',
		category: 'Financial',
		targetValue: 0,
		currentValue: 0,
		unit: '%',
		period: 'quarterly',
		startDate: '',
		endDate: '',
		owner: '',
		department: '',
		measurementFrequency: 'monthly',
		dataSource: '',
		status: 'on-track',
		priority: 'medium',
	})

	// Financial State
	const [financialData, setFinancialData] = useState<FinancialData[]>([])
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
	const [documents, setDocuments] = useState<UploadedDocument[]>([])

	// Workplace State
	const [workplaceSettings, setWorkplaceSettings] = useState<WorkplaceSettings>({
		language: 'ko',
		timezone: 'Asia/Seoul',
		workingDays: [1, 2, 3, 4, 5],
		workingHours: { start: '09:00', end: '18:00' },
		holidays: [],
		quietHours: { start: '', end: '' },
		decisionMode: 'hybrid',
		requireEvidence: true,
		showConfidence: true,
		autoApproveLowRisk: false,
		escalationWindow: '8h',
	})

	// Available departments from system settings
	const [availableDepartments, setAvailableDepartments] = useState<{ id: string; name: string }[]>([])

	// Load data from localStorage
	useEffect(() => {
		try {
			const savedInfo = storage.get<any>('companyInfo')
			if (savedInfo) {
				setCompanyInfo(savedInfo)
			}
		} catch (error) {
			console.error('Failed to load company info:', error)
			toast.error('Failed to load company information')
		}
		
		try {
			const savedLeadership = storage.get<any>('leadership')
			if (savedLeadership) {
				setLeadership(savedLeadership)
			}
		} catch (error) {
			console.error('Failed to load leadership:', error)
		}
		
		try {
			const savedKPIs = storage.get<any>('companyKPIs')
			if (savedKPIs) {
				setCompanyKPIs(savedKPIs)
			}
		} catch (error) {
			console.error('Failed to load KPIs:', error)
		}
		
		try {
			const savedFinancial = storage.get<any>('financialData')
			if (savedFinancial) {
				setFinancialData(savedFinancial)
			}
		} catch (error) {
			console.error('Failed to load financial data:', error)
		}
		
		try {
			const savedDocuments = storage.get<any>('companyDocuments')
			if (savedDocuments) {
				setDocuments(savedDocuments)
			}
		} catch (error) {
			console.error('Failed to load documents:', error)
		}
		
		try {
			const savedWorkplace = storage.get<any>('workplaceSettings')
			if (savedWorkplace) {
				setWorkplaceSettings(savedWorkplace)
			}
		} catch (error) {
			console.error('Failed to load workplace settings:', error)
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

	const handleAddKPI = () => {
		if (!newKPI.name || !newKPI.owner) {
			toast.error('Please fill in required fields (Name, Owner)')
			return
		}
		
		const kpi: CompanyKPI = {
			id: Date.now().toString(),
			name: newKPI.name!,
			description: newKPI.description || '',
			category: newKPI.category || 'Financial',
			targetValue: newKPI.targetValue || 0,
			currentValue: newKPI.currentValue || 0,
			unit: newKPI.unit || '%',
			period: newKPI.period || 'quarterly',
			startDate: newKPI.startDate || '',
			endDate: newKPI.endDate || '',
			owner: newKPI.owner!,
			department: newKPI.department || '',
			measurementFrequency: newKPI.measurementFrequency || 'monthly',
			dataSource: newKPI.dataSource || '',
			status: newKPI.status || 'on-track',
			priority: newKPI.priority || 'medium',
			createdAt: new Date(),
			updatedAt: new Date(),
		}
		
		const updatedKPIs = [...companyKPIs, kpi]
		setCompanyKPIs(updatedKPIs)
		localStorage.setItem('companyKPIs', JSON.stringify(updatedKPIs))
		
		setIsAddingKPI(false)
		setNewKPI({
			name: '',
			description: '',
			category: 'Financial',
			targetValue: 0,
			currentValue: 0,
			unit: '%',
			period: 'quarterly',
			startDate: '',
			endDate: '',
			owner: '',
			department: '',
			measurementFrequency: 'monthly',
			dataSource: '',
			status: 'on-track',
			priority: 'medium',
		})
		toast.success('KPI added successfully')
	}

	const handleUpdateKPI = (id: string, field: keyof CompanyKPI, value: any) => {
		const updatedKPIs = companyKPIs.map(kpi => {
			if (kpi.id === id) {
				const updated = { ...kpi, [field]: value, updatedAt: new Date() }
				
				// Auto-calculate status based on progress
				if (field === 'currentValue' || field === 'targetValue') {
					const progress = (updated.currentValue / updated.targetValue) * 100
					if (progress >= 100) {
						updated.status = 'achieved'
					} else if (progress >= 75) {
						updated.status = 'on-track'
					} else if (progress >= 50) {
						updated.status = 'at-risk'
					} else {
						updated.status = 'behind'
					}
				}
				
				return updated
			}
			return kpi
		})
		setCompanyKPIs(updatedKPIs)
		localStorage.setItem('companyKPIs', JSON.stringify(updatedKPIs))
	}

	const handleDeleteKPI = (id: string) => {
		const updatedKPIs = companyKPIs.filter(k => k.id !== id)
		setCompanyKPIs(updatedKPIs)
		localStorage.setItem('companyKPIs', JSON.stringify(updatedKPIs))
		toast.success('KPI deleted')
	}

	const calculateProgress = (current: number, target: number) => {
		if (target === 0) return 0
		return Math.min(Math.round((current / target) * 100), 100)
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
		<div className="space-y-6">

			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Company Settings</h1>
					<p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
						Manage company information, leadership, goals, and financial data
					</p>
				</div>
			</div>

			{/* Progress Bar */}
			<Card className="border-primary/20 bg-linear-to-r from-primary/5 to-transparent">
				<CardContent className="p-6">
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-3">
							<CheckCircle2 className="h-5 w-5 text-primary" />
							<h3 className="font-bold text-lg">Profile Completion</h3>
						</div>
						<div className="text-3xl font-bold text-primary">{completionStats.percentage}%</div>
					</div>
					<div className="relative w-full h-3 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
						<div
							className="absolute top-0 left-0 h-full bg-linear-to-r from-primary to-primary/80 rounded-full transition-all duration-500 ease-out"
							style={{ width: `${completionStats.percentage}%` }}
						/>
					</div>
				</CardContent>
			</Card>

			{/* Tabs */}
			<div className="flex items-center gap-2 overflow-x-auto border-b border-neutral-200 dark:border-neutral-800 pb-px">
				{[
					{ id: 'company', label: 'Company Info', icon: Building2 },
					{ id: 'business', label: 'Business', icon: Briefcase },
					{ id: 'leadership', label: 'Leadership', icon: Users },
					{ id: 'goals', label: 'Company Goals', icon: Target },
					{ id: 'financial', label: 'Financial', icon: DollarSign },
					{ id: 'workplace', label: 'Workplace', icon: Clock },
					{ id: 'documents', label: 'Documents', icon: FileText },
				].map((tab) => {
					const Icon = tab.icon
					return (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id as any)}
							className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
								activeTab === tab.id
									? 'border-primary text-primary'
									: 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
							}`}
						>
							<Icon className="h-4 w-4" />
							{tab.label}
						</button>
					)
				})}
			</div>

			{/* Tab Content */}
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

				{/* Company KPIs Tab */}
				{activeTab === 'goals' && (
					<KPITab
						kpis={companyKPIs}
						isAdding={isAddingKPI}
						editingId={editingKPI}
						newKPI={newKPI}
						availableDepartments={availableDepartments}
						leadership={leadership}
						setNewKPI={setNewKPI}
						setIsAdding={setIsAddingKPI}
						setEditingId={setEditingKPI}
						onAdd={handleAddKPI}
						onUpdate={handleUpdateKPI}
						onDelete={handleDeleteKPI}
						calculateProgress={calculateProgress}
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
			</div>

			<Toaster />
		</div>
	)
}
