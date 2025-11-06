import { Card, CardContent, CardHeader } from '../../../../components/ui/Card'
import { Button } from '../../../../components/ui/Button'
import { FileText, Upload, File, Download, Trash2 } from 'lucide-react'
import type { UploadedDocument } from '../_types/types'
import { DOCUMENT_CATEGORIES } from '../_types/types'

interface DocumentsTabProps {
	documents: UploadedDocument[]
	onUpload: (event: React.ChangeEvent<HTMLInputElement>, category?: string) => void
	onDelete: (docId: string) => void
	formatFileSize: (bytes: number) => string
}

export default function DocumentsTab({
	documents,
	onUpload,
	onDelete,
	formatFileSize,
}: DocumentsTabProps) {
	const documentCategories = DOCUMENT_CATEGORIES.map(cat => cat.label)

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-xl font-bold flex items-center gap-2">
								<FileText className="h-5 w-5 text-primary" />
								Company Documents
							</h2>
							<p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
								Upload and manage various company documents and files
							</p>
						</div>
					</div>
				</CardHeader>
			</Card>

			{/* Upload Section */}
			<Card className="border-dashed border-2">
				<CardContent className="p-8">
					<div className="text-center">
						<Upload className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
						<h3 className="font-semibold text-lg mb-2">Upload Documents</h3>
						<p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
							Upload contracts, certificates, reports, and other important documents
						</p>

						<div className="flex flex-wrap gap-2 justify-center mb-4">
							{documentCategories.map((category) => (
								<label key={category} className="cursor-pointer">
									<input
										type="file"
										multiple
										onChange={(e) => onUpload(e, category)}
										className="hidden"
									/>
									<Button
										variant="outline"
										size="sm"
										onClick={(e) => {
											e.preventDefault()
											const input = e.currentTarget.previousElementSibling as HTMLInputElement
											input?.click()
										}}
									>
										{category}
									</Button>
								</label>
							))}
						</div>

						<p className="text-xs text-neutral-500">
							Supported formats: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, Images
						</p>
					</div>
				</CardContent>
			</Card>

			{/* Documents Grid */}
			{documents.length > 0 ? (
				<div className="space-y-6">
					{/* Group by Category */}
					{documentCategories.map((category) => {
						const categoryDocs = documents.filter((d) => d.category === category)
						if (categoryDocs.length === 0) return null

						return (
							<Card key={category}>
								<CardHeader>
									<div className="flex items-center justify-between">
										<h3 className="font-bold flex items-center gap-2">
											<FileText className="h-5 w-5" />
											{category}
										</h3>
										<span className="text-sm text-neutral-600 dark:text-neutral-400">
											{categoryDocs.length} file(s)
										</span>
									</div>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
										{categoryDocs.map((doc) => (
											<div
												key={doc.id}
												className="flex items-start justify-between p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors border border-neutral-200 dark:border-neutral-800"
											>
												<div className="flex items-start gap-3 flex-1 min-w-0">
													<div className="p-2 rounded-lg bg-primary/10 shrink-0">
														<File className="h-5 w-5 text-primary" />
													</div>
													<div className="min-w-0 flex-1">
														<p className="font-medium text-sm truncate" title={doc.name}>
															{doc.name}
														</p>
														<p className="text-xs text-neutral-500 mt-1">
															{formatFileSize(doc.size)}
														</p>
														<p className="text-xs text-neutral-400 mt-1">
															{new Date(doc.uploadedAt).toLocaleDateString()}
														</p>
													</div>
												</div>
												<div className="flex flex-col gap-1 ml-2">
													<Button
														variant="outline"
														size="sm"
														className="px-2"
														title="Download"
													>
														<Download className="h-4 w-4" />
													</Button>
													<Button
														variant="outline"
														size="sm"
														onClick={() => onDelete(doc.id)}
														className="px-2"
														title="Delete"
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						)
					})}
				</div>
			) : (
				<Card className="border-dashed">
					<CardContent className="p-12 text-center">
						<FileText className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
						<h3 className="font-semibold text-lg mb-2">No Documents Yet</h3>
						<p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
							Start by uploading your first document using the buttons above
						</p>
					</CardContent>
				</Card>
			)}
		</div>
	)
}

