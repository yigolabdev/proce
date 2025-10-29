import { useState } from 'react'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Upload, Plus, Trash2, FileText, TrendingUp, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface FinancialData {
	id: string
	year: string
	// Income Statement
	totalRevenue: string
	netIncome: string
	// Balance Sheet
	totalAssets: string
	totalLiabilities: string
	longTermDebt: string
	totalEquity: string
}

interface UploadedFile {
	id: string
	name: string
	size: number
	uploadedAt: Date
	year: string
}

export default function FinancePage() {
	const [financialRecords, setFinancialRecords] = useState<FinancialData[]>([])
	const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
	const [isAdding, setIsAdding] = useState(false)
	const [currentRecord, setCurrentRecord] = useState<FinancialData>({
		id: '',
		year: '',
		totalRevenue: '',
		netIncome: '',
		totalAssets: '',
		totalLiabilities: '',
		longTermDebt: '',
		totalEquity: '',
	})

	const handleInputChange = (field: keyof FinancialData, value: string) => {
		setCurrentRecord((prev) => ({ ...prev, [field]: value }))
	}

	const handleAddRecord = () => {
		if (!currentRecord.year) {
			toast.error('연도를 입력해주세요')
			return
		}

		const newRecord: FinancialData = {
			...currentRecord,
			id: Date.now().toString(),
		}

		setFinancialRecords((prev) => [...prev, newRecord])
		setCurrentRecord({
			id: '',
			year: '',
			totalRevenue: '',
			netIncome: '',
			totalAssets: '',
			totalLiabilities: '',
			longTermDebt: '',
			totalEquity: '',
		})
		setIsAdding(false)
		toast.success('재무 정보가 추가되었습니다')
	}

	const handleDeleteRecord = (id: string) => {
		setFinancialRecords((prev) => prev.filter((record) => record.id !== id))
		toast.success('재무 정보가 삭제되었습니다')
	}

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

		const newFile: UploadedFile = {
			id: Date.now().toString(),
			name: file.name,
			size: file.size,
			uploadedAt: new Date(),
			year: new Date().getFullYear().toString(),
		}

		setUploadedFiles((prev) => [...prev, newFile])
		toast.success('재무제표가 업로드되었습니다')
		event.target.value = ''
	}

	const handleDeleteFile = (id: string) => {
		setUploadedFiles((prev) => prev.filter((file) => file.id !== id))
		toast.success('파일이 삭제되었습니다')
	}

	const formatCurrency = (value: string) => {
		if (!value) return '-'
		const num = parseFloat(value)
		if (isNaN(num)) return value
		return new Intl.NumberFormat('ko-KR', {
			style: 'currency',
			currency: 'KRW',
			maximumFractionDigits: 0,
		}).format(num)
	}

	const formatFileSize = (bytes: number) => {
		if (bytes < 1024) return bytes + ' B'
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
		return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold flex items-center gap-3">
						<TrendingUp className="h-8 w-8 text-primary" />
						재무 정보 관리
					</h1>
					<p className="mt-2 text-neutral-600 dark:text-neutral-400">
						기업의 재무 정보를 입력하고 재무제표를 업로드하여 예측 분석을 받아보세요
					</p>
				</div>
			</div>

			{/* Info Alert */}
			<Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
				<CardContent className="p-4">
					<div className="flex items-start gap-3">
						<AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
						<div className="text-sm text-blue-900 dark:text-blue-100">
							<p className="font-medium mb-1">재무 정보 입력 안내</p>
							<p className="text-blue-700 dark:text-blue-300">
								정확한 예측을 위해 최소 3개년 이상의 재무 데이터를 입력해주세요. 재무제표 파일을 업로드하시면 자동으로 데이터가 추출됩니다.
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="grid gap-6 lg:grid-cols-2">
				{/* Manual Input Section */}
				<Card>
					<CardHeader>
						<h2 className="text-xl font-bold">재무 정보 직접 입력</h2>
						<p className="text-sm text-neutral-600 dark:text-neutral-400">
							손익계산서 및 재무상태표 정보를 직접 입력하세요
						</p>
					</CardHeader>
					<CardContent className="space-y-4">
						{!isAdding && (
							<Button
								onClick={() => setIsAdding(true)}
								className="w-full flex items-center justify-center gap-2"
							>
								<Plus className="h-5 w-5" />
								<span>새 재무 정보 추가</span>
							</Button>
						)}

						{isAdding && (
							<div className="space-y-4 p-4 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50">
								<div>
									<label className="block text-sm font-medium mb-2">
										연도 <span className="text-red-500">*</span>
									</label>
									<Input
										type="text"
										placeholder="예: 2024"
										value={currentRecord.year}
										onChange={(e) => handleInputChange('year', e.target.value)}
									/>
								</div>

								<div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
									<h3 className="font-semibold mb-3 text-sm text-neutral-700 dark:text-neutral-300">
										손익계산서 (Income Statement)
									</h3>
									<div className="space-y-3">
										<div>
											<label className="block text-sm mb-2">총 매출 (Total Revenue)</label>
											<Input
												type="text"
												placeholder="예: 1000000000"
												value={currentRecord.totalRevenue}
												onChange={(e) => handleInputChange('totalRevenue', e.target.value)}
											/>
										</div>
										<div>
											<label className="block text-sm mb-2">순이익 (Net Income)</label>
											<Input
												type="text"
												placeholder="예: 100000000"
												value={currentRecord.netIncome}
												onChange={(e) => handleInputChange('netIncome', e.target.value)}
											/>
										</div>
									</div>
								</div>

								<div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
									<h3 className="font-semibold mb-3 text-sm text-neutral-700 dark:text-neutral-300">
										재무상태표 (Balance Sheet)
									</h3>
									<div className="space-y-3">
										<div>
											<label className="block text-sm mb-2">총 자산 (Total Assets)</label>
											<Input
												type="text"
												placeholder="예: 5000000000"
												value={currentRecord.totalAssets}
												onChange={(e) => handleInputChange('totalAssets', e.target.value)}
											/>
										</div>
										<div>
											<label className="block text-sm mb-2">총 부채 (Total Liabilities)</label>
											<Input
												type="text"
												placeholder="예: 3000000000"
												value={currentRecord.totalLiabilities}
												onChange={(e) => handleInputChange('totalLiabilities', e.target.value)}
											/>
										</div>
										<div>
											<label className="block text-sm mb-2">장기 부채 (Long-term Debt)</label>
											<Input
												type="text"
												placeholder="예: 2000000000"
												value={currentRecord.longTermDebt}
												onChange={(e) => handleInputChange('longTermDebt', e.target.value)}
											/>
										</div>
										<div>
											<label className="block text-sm mb-2">총 자본 (Total Equity)</label>
											<Input
												type="text"
												placeholder="예: 2000000000"
												value={currentRecord.totalEquity}
												onChange={(e) => handleInputChange('totalEquity', e.target.value)}
											/>
										</div>
									</div>
								</div>

								<div className="flex gap-2 pt-2">
									<Button onClick={handleAddRecord} className="flex-1">
										저장
									</Button>
									<Button
										variant="outline"
										onClick={() => {
											setIsAdding(false)
											setCurrentRecord({
												id: '',
												year: '',
												totalRevenue: '',
												netIncome: '',
												totalAssets: '',
												totalLiabilities: '',
												longTermDebt: '',
												totalEquity: '',
											})
										}}
										className="flex-1"
									>
										취소
									</Button>
								</div>
							</div>
						)}

						{/* Saved Records */}
						{financialRecords.length > 0 && (
							<div className="space-y-3 mt-6">
								<h3 className="font-semibold text-sm">저장된 재무 정보</h3>
								{financialRecords.map((record) => (
									<div
										key={record.id}
										className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900"
									>
										<div className="flex items-center justify-between mb-3">
											<span className="font-bold text-lg">{record.year}년</span>
											<button
												onClick={() => handleDeleteRecord(record.id)}
												className="text-red-500 hover:text-red-600 transition-colors"
											>
												<Trash2 className="h-4 w-4" />
											</button>
										</div>
										<div className="grid grid-cols-2 gap-2 text-sm">
											<div>
												<span className="text-neutral-600 dark:text-neutral-400">총 매출:</span>
												<p className="font-medium">{formatCurrency(record.totalRevenue)}</p>
											</div>
											<div>
												<span className="text-neutral-600 dark:text-neutral-400">순이익:</span>
												<p className="font-medium">{formatCurrency(record.netIncome)}</p>
											</div>
											<div>
												<span className="text-neutral-600 dark:text-neutral-400">총 자산:</span>
												<p className="font-medium">{formatCurrency(record.totalAssets)}</p>
											</div>
											<div>
												<span className="text-neutral-600 dark:text-neutral-400">총 부채:</span>
												<p className="font-medium">{formatCurrency(record.totalLiabilities)}</p>
											</div>
											<div>
												<span className="text-neutral-600 dark:text-neutral-400">장기 부채:</span>
												<p className="font-medium">{formatCurrency(record.longTermDebt)}</p>
											</div>
											<div>
												<span className="text-neutral-600 dark:text-neutral-400">총 자본:</span>
												<p className="font-medium">{formatCurrency(record.totalEquity)}</p>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>

				{/* File Upload Section */}
				<Card>
					<CardHeader>
						<h2 className="text-xl font-bold">재무제표 업로드</h2>
						<p className="text-sm text-neutral-600 dark:text-neutral-400">
							PDF, Excel, CSV 형식의 재무제표를 업로드하세요
						</p>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl p-8 text-center hover:border-primary transition-colors">
							<input
								type="file"
								id="file-upload"
								className="hidden"
								accept=".pdf,.xls,.xlsx,.csv"
								onChange={handleFileUpload}
							/>
							<label htmlFor="file-upload" className="cursor-pointer">
								<Upload className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
								<p className="font-medium mb-2">파일을 선택하거나 드래그하세요</p>
								<p className="text-sm text-neutral-600 dark:text-neutral-400">
									PDF, Excel, CSV (최대 10MB)
								</p>
							</label>
						</div>

						{/* Uploaded Files */}
						{uploadedFiles.length > 0 && (
							<div className="space-y-3">
								<h3 className="font-semibold text-sm">업로드된 파일</h3>
								{uploadedFiles.map((file) => (
									<div
										key={file.id}
										className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900"
									>
										<div className="flex items-center gap-3 flex-1 min-w-0">
											<FileText className="h-8 w-8 text-primary flex-shrink-0" />
											<div className="min-w-0 flex-1">
												<p className="font-medium truncate">{file.name}</p>
												<p className="text-sm text-neutral-600 dark:text-neutral-400">
													{formatFileSize(file.size)} • {file.year}년 •{' '}
													{file.uploadedAt.toLocaleDateString('ko-KR')}
												</p>
											</div>
										</div>
										<button
											onClick={() => handleDeleteFile(file.id)}
											className="text-red-500 hover:text-red-600 transition-colors ml-2 flex-shrink-0"
										>
											<Trash2 className="h-4 w-4" />
										</button>
									</div>
								))}
							</div>
						)}

						{uploadedFiles.length === 0 && (
							<div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
								<FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
								<p className="text-sm">아직 업로드된 파일이 없습니다</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

