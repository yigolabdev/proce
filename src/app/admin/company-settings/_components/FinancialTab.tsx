import { Card, CardContent, CardHeader } from '../../../../components/ui/Card'
import { Button } from '../../../../components/ui/Button'
import Input from '../../../../components/ui/Input'
import {
	DollarSign,
	Plus,
	X,
	Trash2,
	FileText,
	Upload,
	File,
} from 'lucide-react'
import type { FinancialData } from '../_types/types'

interface FinancialTabProps {
	financialData: FinancialData[]
	isAddingFinancial: boolean
	newFinancialYear: Omit<FinancialData, 'documents'> & { documents?: any[] }
	onSetIsAddingFinancial: (value: boolean) => void
	onSetNewFinancialYear: (year: Omit<FinancialData, 'documents'> & { documents?: any[] }) => void
	onAddFinancialData: () => void
	onDeleteFinancialData: (year: string) => void
	onFileUpload: (event: React.ChangeEvent<HTMLInputElement>, year: string) => void
	onDeleteFinancialDocument: (year: string, docId: string) => void
	formatCurrency: (value: string) => string
	formatFileSize: (bytes: number) => string
}

export default function FinancialTab({
	financialData,
	isAddingFinancial,
	newFinancialYear,
	onSetIsAddingFinancial,
	onSetNewFinancialYear,
	onAddFinancialData,
	onDeleteFinancialData,
	onFileUpload,
	onDeleteFinancialDocument,
	formatCurrency,
	formatFileSize,
}: FinancialTabProps) {
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-xl font-bold flex items-center gap-2">
								<DollarSign className="h-5 w-5 text-primary" />
								Financial Data
							</h2>
							<p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
								Year-by-year financial information and statements
							</p>
						</div>
						<Button
							onClick={() => onSetIsAddingFinancial(true)}
							className="flex items-center gap-2"
						>
							<Plus className="h-4 w-4" />
							Add Year
						</Button>
					</div>
				</CardHeader>
			</Card>

			{/* Add Financial Data Form */}
			{isAddingFinancial && (
				<Card className="border-primary/30">
					<CardHeader>
						<div className="flex items-center justify-between">
							<h3 className="font-semibold">New Financial Year</h3>
							<Button variant="outline" size="sm" onClick={() => onSetIsAddingFinancial(false)}>
								<X className="h-4 w-4" />
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium mb-2">
									Fiscal Year <span className="text-red-500">*</span>
								</label>
								<Input
									type="number"
									value={newFinancialYear.year}
									onChange={(e) =>
										onSetNewFinancialYear({ ...newFinancialYear, year: e.target.value })
									}
									placeholder="2024"
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium mb-2">
										Total Revenue <span className="text-red-500">*</span>
									</label>
									<Input
										type="number"
										value={newFinancialYear.totalRevenue}
										onChange={(e) =>
											onSetNewFinancialYear({
												...newFinancialYear,
												totalRevenue: e.target.value,
											})
										}
										placeholder="100000000"
									/>
									<p className="text-xs text-neutral-500 mt-1">
										{newFinancialYear.totalRevenue &&
											formatCurrency(newFinancialYear.totalRevenue)}
									</p>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">Net Income</label>
									<Input
										type="number"
										value={newFinancialYear.netIncome}
										onChange={(e) =>
											onSetNewFinancialYear({ ...newFinancialYear, netIncome: e.target.value })
										}
										placeholder="10000000"
									/>
									<p className="text-xs text-neutral-500 mt-1">
										{newFinancialYear.netIncome && formatCurrency(newFinancialYear.netIncome)}
									</p>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">Total Assets</label>
									<Input
										type="number"
										value={newFinancialYear.totalAssets}
										onChange={(e) =>
											onSetNewFinancialYear({
												...newFinancialYear,
												totalAssets: e.target.value,
											})
										}
										placeholder="200000000"
									/>
									<p className="text-xs text-neutral-500 mt-1">
										{newFinancialYear.totalAssets &&
											formatCurrency(newFinancialYear.totalAssets)}
									</p>
								</div>
								<div>
									<label className="block text-sm font-medium mb-2">Total Liabilities</label>
									<Input
										type="number"
										value={newFinancialYear.totalLiabilities}
										onChange={(e) =>
											onSetNewFinancialYear({
												...newFinancialYear,
												totalLiabilities: e.target.value,
											})
										}
										placeholder="50000000"
									/>
									<p className="text-xs text-neutral-500 mt-1">
										{newFinancialYear.totalLiabilities &&
											formatCurrency(newFinancialYear.totalLiabilities)}
									</p>
								</div>
							</div>

							{/* File Upload Section */}
							<div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
								<label className="block text-sm font-medium mb-3">
									<FileText className="inline h-4 w-4 mr-1" />
									Financial Documents (Optional)
								</label>
								<div className="space-y-3">
									<label className="cursor-pointer">
										<input
											type="file"
											multiple
											onChange={(e) => {
												const files = e.target.files
												if (files && files.length > 0) {
													const newDocs = Array.from(files).map(file => ({
														id: `${Date.now()}-${Math.random()}`,
														name: file.name,
														size: file.size,
														type: file.type,
														uploadedAt: new Date().toISOString(),
													}))
													onSetNewFinancialYear({
														...newFinancialYear,
														documents: [...(newFinancialYear.documents || []), ...newDocs]
													})
												}
											}}
											className="hidden"
											accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
										/>
										<div className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl hover:border-primary hover:bg-primary/5 transition-colors">
											<Upload className="h-5 w-5 text-neutral-500" />
											<span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
												Click to upload documents
											</span>
										</div>
									</label>

									{/* Uploaded Files List */}
									{newFinancialYear.documents && newFinancialYear.documents.length > 0 && (
										<div className="space-y-2">
											{newFinancialYear.documents.map((doc: any) => (
												<div
													key={doc.id}
													className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
												>
													<div className="flex items-center gap-3 flex-1 min-w-0">
														<File className="h-5 w-5 text-primary shrink-0" />
														<div className="min-w-0 flex-1">
															<p className="font-medium text-sm truncate">{doc.name}</p>
															<p className="text-xs text-neutral-500">
																{formatFileSize(doc.size)}
															</p>
														</div>
													</div>
													<Button
														variant="outline"
														size="sm"
														onClick={() => {
															onSetNewFinancialYear({
																...newFinancialYear,
																documents: newFinancialYear.documents?.filter((d: any) => d.id !== doc.id) || []
															})
														}}
														className="ml-2"
													>
														<X className="h-4 w-4" />
													</Button>
												</div>
											))}
										</div>
									)}
								</div>
							</div>

							<div className="flex justify-end gap-3">
								<Button variant="outline" onClick={() => onSetIsAddingFinancial(false)}>
									Cancel
								</Button>
								<Button onClick={onAddFinancialData}>
									<Plus className="h-4 w-4 mr-2" />
									Add Financial Data
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Financial Data List */}
			{financialData.length > 0 ? (
				<div className="space-y-4">
					{financialData.map((data) => (
						<Card key={data.year}>
							<CardContent className="p-6">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-xl font-bold">Fiscal Year {data.year}</h3>
									<Button
										variant="outline"
										size="sm"
										onClick={() => onDeleteFinancialData(data.year)}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>

								{/* Financial Metrics */}
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
									<div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
										<p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
											Total Revenue
										</p>
										<p className="text-lg font-bold text-green-700 dark:text-green-400">
											{formatCurrency(data.totalRevenue)}
										</p>
									</div>
									<div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
										<p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
											Net Income
										</p>
										<p className="text-lg font-bold text-blue-700 dark:text-blue-400">
											{formatCurrency(data.netIncome)}
										</p>
									</div>
									<div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
										<p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
											Total Assets
										</p>
										<p className="text-lg font-bold text-purple-700 dark:text-purple-400">
											{formatCurrency(data.totalAssets)}
										</p>
									</div>
									<div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
										<p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
											Total Liabilities
										</p>
										<p className="text-lg font-bold text-orange-700 dark:text-orange-400">
											{formatCurrency(data.totalLiabilities)}
										</p>
									</div>
								</div>

								{/* Documents Section */}
								<div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
									<div className="flex items-center justify-between mb-3">
										<h4 className="font-semibold text-sm flex items-center gap-2">
											<FileText className="h-4 w-4" />
											Financial Documents
										</h4>
										<label className="cursor-pointer">
											<input
												type="file"
												multiple
												onChange={(e) => onFileUpload(e, data.year)}
												className="hidden"
												accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
											/>
											<Button
												variant="outline"
												size="sm"
												className="flex items-center gap-2"
												onClick={(e) => {
													e.preventDefault()
													const input = e.currentTarget
														.previousElementSibling as HTMLInputElement
													input?.click()
												}}
											>
												<Upload className="h-4 w-4" />
												Upload
											</Button>
										</label>
									</div>

									{data.documents && data.documents.length > 0 ? (
										<div className="space-y-2">
											{data.documents.map((doc) => (
												<div
													key={doc.id}
													className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
												>
													<div className="flex items-center gap-3 flex-1 min-w-0">
														<File className="h-5 w-5 text-primary shrink-0" />
														<div className="min-w-0 flex-1">
															<p className="font-medium text-sm truncate">{doc.name}</p>
															<p className="text-xs text-neutral-500">
																{formatFileSize(doc.size)} •{' '}
																{new Date(doc.uploadedAt).toLocaleDateString()}
															</p>
														</div>
													</div>
													<Button
														variant="outline"
														size="sm"
														onClick={() => onDeleteFinancialDocument(data.year, doc.id)}
														className="ml-2"
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											))}
										</div>
									) : (
										<p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-4">
											No documents uploaded yet
										</p>
									)}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			) : (
				!isAddingFinancial && (
					<Card className="border-dashed">
						<CardContent className="p-12 text-center">
							<DollarSign className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
							<h3 className="font-semibold text-lg mb-2">No Financial Data Yet</h3>
							<p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
								Add your company's financial information by year
							</p>
							<Button onClick={() => onSetIsAddingFinancial(true)}>
								<Plus className="h-4 w-4 mr-2" />
								Add Financial Data
							</Button>
						</CardContent>
					</Card>
				)
			)}
		</div>
	)
}

