import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Textarea from '../../../components/ui/Textarea'
import { 
	Building2, 
	Plus,
	Trash2,
	FileText,
	ChevronDown,
	ChevronUp,
	Copy,
	Download,
	Upload,
	Sparkles,
	Eye,
	Edit3,
	CheckCircle2,
	Clock
} from 'lucide-react'
import { toast } from 'sonner'
import Toaster from '../../../components/ui/Toaster'
import DevMemo from '../../../components/dev/DevMemo'
import { DEV_MEMOS } from '../../../constants/devMemos'

interface InfoSection {
	id: string
	title: string
	content: string
	order: number
	isCollapsed: boolean
	attachments: Attachment[]
	createdAt: string
	updatedAt: string
}

interface Attachment {
	id: string
	name: string
	type: 'file' | 'image' | 'link'
	url: string
	size?: number
}

interface CompanyInfoData {
	lastSaved: string
	sections: InfoSection[]
}

const SECTION_TEMPLATES = [
	{ title: '회사 개요', content: '회사의 전반적인 소개를 작성해주세요.\n\n- 설립 연도:\n- 주요 사업:\n- 회사 규모:\n- 본사 위치:' },
	{ title: '비전 & 미션', content: '# 비전\n우리가 나아가고자 하는 방향을 작성해주세요.\n\n# 미션\n우리가 달성하고자 하는 목표를 작성해주세요.' },
	{ title: '핵심 가치', content: '회사의 핵심 가치를 작성해주세요.\n\n1. \n2. \n3. ' },
	{ title: '주요 연혁', content: '# 주요 연혁\n\n## 2024\n- \n\n## 2023\n- \n\n## 2022\n- ' },
	{ title: '조직 구조', content: '회사의 조직 구조와 주요 부서를 설명해주세요.' },
	{ title: '사업 영역', content: '# 사업 영역\n\n## 주요 사업\n\n## 제품/서비스\n\n## 시장 및 고객' },
	{ title: '경영 목표', content: '# 단기 목표 (1년)\n\n# 중기 목표 (3년)\n\n# 장기 목표 (5년+)' },
	{ title: '재무 현황', content: '회사의 재무 현황과 성과를 작성해주세요.\n\n※ 민감한 정보는 주의해서 입력해주세요.' },
]

const STORAGE_KEY = 'proce_company_info'

export default function CompanyInfoPage() {
	const [data, setData] = useState<CompanyInfoData>({
		lastSaved: new Date().toISOString(),
		sections: []
	})
	const [previewMode, setPreviewMode] = useState(false)
	const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
	const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
	const [showTemplateMenu, setShowTemplateMenu] = useState(false)

	// Load data
	useEffect(() => {
		const saved = localStorage.getItem(STORAGE_KEY)
		if (saved) {
			try {
				const parsed = JSON.parse(saved)
				setData(parsed)
				// Expand all sections by default
				const allIds = new Set<string>(parsed.sections.map((s: InfoSection) => s.id))
				setExpandedSections(allIds)
			} catch (e) {
				console.error('Failed to parse saved data', e)
			}
		}
	}, [])

	// Auto-save
	useEffect(() => {
		if (data.sections.length === 0) return

		setAutoSaveStatus('unsaved')
		const timer = setTimeout(() => {
			setAutoSaveStatus('saving')
			localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
			setTimeout(() => {
				setAutoSaveStatus('saved')
				setData(prev => ({ ...prev, lastSaved: new Date().toISOString() }))
			}, 300)
		}, 2000)

		return () => clearTimeout(timer)
	}, [data.sections])

	const addSection = (template?: { title: string; content: string }) => {
		const newSection: InfoSection = {
			id: `section_${Date.now()}`,
			title: template?.title || '새 섹션',
			content: template?.content || '',
			order: data.sections.length,
			isCollapsed: false,
			attachments: [],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		}

		setData(prev => ({
			...prev,
			sections: [...prev.sections, newSection]
		}))
		setExpandedSections(prev => new Set([...prev, newSection.id]))
		toast.success('새 섹션이 추가되었습니다')
	}

	const deleteSection = (sectionId: string) => {
		setData(prev => ({
			...prev,
			sections: prev.sections.filter(s => s.id !== sectionId)
		}))
		toast.success('섹션이 삭제되었습니다')
	}

	const updateSection = (sectionId: string, updates: Partial<InfoSection>) => {
		setData(prev => ({
			...prev,
			sections: prev.sections.map(s => 
				s.id === sectionId 
					? { ...s, ...updates, updatedAt: new Date().toISOString() }
					: s
			)
		}))
	}

	const moveSectionUp = (index: number) => {
		if (index === 0) return
		setData(prev => {
			const newSections = [...prev.sections]
			;[newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]]
			return { ...prev, sections: newSections.map((s, i) => ({ ...s, order: i })) }
		})
	}

	const moveSectionDown = (index: number) => {
		if (index === data.sections.length - 1) return
		setData(prev => {
			const newSections = [...prev.sections]
			;[newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]]
			return { ...prev, sections: newSections.map((s, i) => ({ ...s, order: i })) }
		})
	}

	const duplicateSection = (section: InfoSection) => {
		const newSection: InfoSection = {
			...section,
			id: `section_${Date.now()}`,
			title: `${section.title} (복사본)`,
			order: data.sections.length,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		}
		setData(prev => ({
			...prev,
			sections: [...prev.sections, newSection]
		}))
		toast.success('섹션이 복사되었습니다')
	}

	const toggleSection = (sectionId: string) => {
		setExpandedSections(prev => {
			const newSet = new Set(prev)
			if (newSet.has(sectionId)) {
				newSet.delete(sectionId)
			} else {
				newSet.add(sectionId)
			}
			return newSet
		})
	}

	const exportData = () => {
		const dataStr = JSON.stringify(data, null, 2)
		const dataBlob = new Blob([dataStr], { type: 'application/json' })
		const url = URL.createObjectURL(dataBlob)
		const link = document.createElement('a')
		link.href = url
		link.download = `company-info-${new Date().toISOString().split('T')[0]}.json`
		link.click()
		URL.revokeObjectURL(url)
		toast.success('데이터가 다운로드되었습니다')
	}

	const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (!file) return

		const reader = new FileReader()
		reader.onload = (e) => {
			try {
				const imported = JSON.parse(e.target?.result as string)
				setData(imported)
				toast.success('데이터를 불러왔습니다')
			} catch (err) {
				toast.error('파일을 읽을 수 없습니다')
			}
		}
		reader.readAsText(file)
	}

	return (
		<div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-6">
			<Toaster />
			
			{/* Developer Memo */}
			<DevMemo content={DEV_MEMOS.EXECUTIVE_COMPANY_INFO} />
			
			{/* Header */}
			<div className="max-w-7xl mx-auto mb-6">
				<div className="flex items-center justify-between mb-4">
					<div>
						<div className="flex items-center gap-3 mb-2">
							<Building2 className="h-8 w-8 text-primary" />
							<h1 className="text-3xl font-bold">회사 정보 관리</h1>
						</div>
						<p className="text-neutral-600 dark:text-neutral-400">
							경영진이 자유롭게 회사의 정보를 입력하고 관리할 수 있습니다
						</p>
					</div>
					
					<div className="flex items-center gap-3">
						{/* Auto-save status */}
						<div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
							{autoSaveStatus === 'saved' && (
								<>
									<CheckCircle2 className="h-4 w-4 text-green-500" />
									<span>자동 저장됨</span>
								</>
							)}
							{autoSaveStatus === 'saving' && (
								<>
									<Clock className="h-4 w-4 animate-spin text-blue-500" />
									<span>저장 중...</span>
								</>
							)}
							{autoSaveStatus === 'unsaved' && (
								<>
									<Clock className="h-4 w-4 text-orange-500" />
									<span>저장 대기 중</span>
								</>
							)}
						</div>
						
					<Button
						variant={previewMode ? 'primary' : 'outline'}
						onClick={() => setPreviewMode(!previewMode)}
					>
							{previewMode ? <Edit3 className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
							{previewMode ? '편집 모드' : '미리보기'}
						</Button>

						{/* Import/Export */}
						<div className="flex gap-2">
							<label className="cursor-pointer">
								<span className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
									<Upload className="h-4 w-4 mr-2" />
									불러오기
								</span>
								<input
									type="file"
									accept=".json"
									className="hidden"
									onChange={importData}
								/>
							</label>
							<Button variant="outline" onClick={exportData}>
								<Download className="h-4 w-4 mr-2" />
								내보내기
							</Button>
						</div>
					</div>
				</div>

				{/* Last saved */}
				{data.lastSaved && (
					<p className="text-sm text-neutral-500">
						마지막 저장: {new Date(data.lastSaved).toLocaleString('ko-KR')}
					</p>
				)}
			</div>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto">
				{/* Add Section Buttons */}
				{!previewMode && (
					<Card className="mb-6 bg-linear-to-r from-primary/5 to-blue-500/5 border-primary/20">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
										<Sparkles className="h-5 w-5 text-primary" />
										섹션 추가
									</h3>
									<p className="text-sm text-neutral-600 dark:text-neutral-400">
										빈 섹션을 추가하거나 템플릿을 선택하세요
									</p>
								</div>
								<div className="flex gap-2">
									<Button
										variant="outline"
										onClick={() => addSection()}
									>
										<Plus className="h-4 w-4 mr-2" />
										빈 섹션 추가
									</Button>
									<div className="relative">
										<Button
											variant="primary"
											onClick={() => setShowTemplateMenu(!showTemplateMenu)}
										>
											<FileText className="h-4 w-4 mr-2" />
											템플릿에서 추가
										</Button>
										
										{showTemplateMenu && (
											<div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-800 z-50 max-h-96 overflow-y-auto">
												{SECTION_TEMPLATES.map((template, idx) => (
													<button
														key={idx}
														onClick={() => {
															addSection(template)
															setShowTemplateMenu(false)
														}}
														className="w-full text-left px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors border-b border-neutral-100 dark:border-neutral-800 last:border-b-0"
													>
														<div className="font-medium">{template.title}</div>
														<div className="text-xs text-neutral-500 mt-1 line-clamp-2">
															{template.content.split('\n')[0]}
														</div>
													</button>
												))}
											</div>
										)}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Sections */}
				{data.sections.length === 0 ? (
					<Card>
						<CardContent className="p-12 text-center">
							<Building2 className="h-16 w-16 mx-auto mb-4 text-neutral-300 dark:text-neutral-700" />
							<h3 className="text-xl font-semibold mb-2">회사 정보를 추가하세요</h3>
							<p className="text-neutral-600 dark:text-neutral-400 mb-6">
								빈 섹션을 추가하거나 템플릿을 사용하여 회사 정보를 작성할 수 있습니다
							</p>
							<div className="flex gap-3 justify-center">
								<Button onClick={() => addSection()}>
									<Plus className="h-4 w-4 mr-2" />
									첫 섹션 추가
								</Button>
								<Button variant="outline" onClick={() => setShowTemplateMenu(true)}>
									<FileText className="h-4 w-4 mr-2" />
									템플릿 선택
								</Button>
							</div>
						</CardContent>
					</Card>
				) : (
					<div className="space-y-4">
						{data.sections.map((section, index) => (
							<Card key={section.id} className="overflow-hidden">
								{/* Section Header */}
								<CardHeader className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3 flex-1">
											{!previewMode && (
												<button
													onClick={() => toggleSection(section.id)}
													className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
												>
													{expandedSections.has(section.id) ? (
														<ChevronUp className="h-5 w-5" />
													) : (
														<ChevronDown className="h-5 w-5" />
													)}
												</button>
											)}
											
											{!previewMode && expandedSections.has(section.id) ? (
												<Input
													value={section.title}
													onChange={(e) => updateSection(section.id, { title: e.target.value })}
													className="font-semibold text-lg border-0 bg-transparent p-0 h-auto focus:ring-0"
													placeholder="섹션 제목"
												/>
											) : (
												<h3 className="font-semibold text-lg">{section.title}</h3>
											)}
										</div>

										{!previewMode && (
											<div className="flex items-center gap-2">
												{/* Move buttons */}
												<button
													onClick={() => moveSectionUp(index)}
													disabled={index === 0}
													className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed"
													title="위로 이동"
												>
													<ChevronUp className="h-4 w-4" />
												</button>
												<button
													onClick={() => moveSectionDown(index)}
													disabled={index === data.sections.length - 1}
													className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed"
													title="아래로 이동"
												>
													<ChevronDown className="h-4 w-4" />
												</button>

												{/* Duplicate */}
												<button
													onClick={() => duplicateSection(section)}
													className="p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800"
													title="복사"
												>
													<Copy className="h-4 w-4" />
												</button>

												{/* Delete */}
												<button
													onClick={() => {
														if (confirm('이 섹션을 삭제하시겠습니까?')) {
															deleteSection(section.id)
														}
													}}
													className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600"
													title="삭제"
												>
													<Trash2 className="h-4 w-4" />
												</button>
											</div>
										)}
									</div>
								</CardHeader>

								{/* Section Content */}
								{(expandedSections.has(section.id) || previewMode) && (
									<CardContent className="p-6">
										{!previewMode ? (
											<Textarea
												value={section.content}
												onChange={(e) => updateSection(section.id, { content: e.target.value })}
												placeholder="내용을 입력하세요... (Markdown 문법 지원)"
												rows={12}
												className="font-mono text-sm"
											/>
										) : (
											<div className="prose dark:prose-invert max-w-none">
												{section.content.split('\n').map((line, idx) => {
													// Simple markdown rendering
													if (line.startsWith('# ')) {
														return <h1 key={idx} className="text-2xl font-bold mt-6 mb-3">{line.slice(2)}</h1>
													}
													if (line.startsWith('## ')) {
														return <h2 key={idx} className="text-xl font-bold mt-5 mb-2">{line.slice(3)}</h2>
													}
													if (line.startsWith('### ')) {
														return <h3 key={idx} className="text-lg font-semibold mt-4 mb-2">{line.slice(4)}</h3>
													}
													if (line.startsWith('- ')) {
														return <li key={idx} className="ml-4">{line.slice(2)}</li>
													}
													if (line.match(/^\d+\. /)) {
														return <li key={idx} className="ml-4 list-decimal">{line.replace(/^\d+\. /, '')}</li>
													}
													if (line.trim() === '') {
														return <br key={idx} />
													}
													return <p key={idx} className="mb-2">{line}</p>
												})}
											</div>
										)}

										{/* Metadata */}
										{!previewMode && (
											<div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
												<span>작성일: {new Date(section.createdAt).toLocaleString('ko-KR')}</span>
												<span>수정일: {new Date(section.updatedAt).toLocaleString('ko-KR')}</span>
											</div>
										)}
									</CardContent>
								)}
							</Card>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

