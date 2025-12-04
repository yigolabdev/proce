import { useState, useEffect } from 'react'
import { useI18n } from '../../../i18n/I18nProvider'
import { useAuth } from '../../../context/AuthContext'
import { Button } from '../../../components/ui/Button'
import { PageHeader } from '../../../components/common/PageHeader'
import { Sparkles, Target, ArrowRight, Calendar, Users, Lightbulb, ArrowLeft, RefreshCw, X, MessageSquare, ChevronRight } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { storage } from '../../../utils/storage'
import type { Project } from '../../../types/common.types'
import ProjectFormDialog, { type ProjectFormData } from '../_components/ProjectFormDialog'
import { createAITasksForProject } from '../../ai-recommendations/_utils/aiTaskGenerator'
import { toast } from 'sonner'
import Toaster from '../../../components/ui/Toaster'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../components/ui/Dialog'
import Textarea from '../../../components/ui/Textarea'

interface RecommendedProject {
	id: string
	title: string
	description: string
	reason: string
	objectives: string[]
	estimatedDuration: string
	recommendedTeamSize: number
	confidenceScore: number
	tags: string[]
}

export default function ProjectRecommendationsPage() {
	const { t } = useI18n()
	const { user } = useAuth()
	const navigate = useNavigate()
	const [searchParams, setSearchParams] = useSearchParams()
	const [loading, setLoading] = useState(true)
	const [recommendations, setRecommendations] = useState<RecommendedProject[]>([])
	const [selectedRec, setSelectedRec] = useState<RecommendedProject | null>(null)
	
	// Dialog States
	const [showCreateDialog, setShowCreateDialog] = useState(false)
	const [initialProjectData, setInitialProjectData] = useState<Partial<ProjectFormData> | undefined>(undefined)
	const [rejectDialog, setRejectDialog] = useState<{ open: boolean; projectId: string | null }>({ open: false, projectId: null })
	const [rejectionReason, setRejectionReason] = useState('')

	useEffect(() => {
		generateRecommendations()
	}, [])

	// Handle URL query param for detail view
	useEffect(() => {
		const recId = searchParams.get('id')
		if (recId && recommendations.length > 0) {
			const rec = recommendations.find(r => r.id === recId)
			if (rec) setSelectedRec(rec)
		} else if (!recId) {
			setSelectedRec(null)
		}
	}, [searchParams, recommendations])

	const generateRecommendations = async () => {
		setLoading(true)
		// Simulate AI analysis delay
		setTimeout(() => {
			const generated: RecommendedProject[] = [
				{
					id: 'rec-1',
					title: 'Global Market Expansion Initiative',
					description: 'Strategic project to enter new international markets based on recent growth metrics. Focuses on localization and partnership establishment.',
					reason: 'Aligns with "Growth" KPI targets and builds upon recent successful marketing campaigns.',
					objectives: ['Establish presence in 2 new regions', 'Achieve $1M revenue in new markets', 'Secure 5 strategic partnerships'],
					estimatedDuration: '6 months',
					recommendedTeamSize: 8,
					confidenceScore: 92,
					tags: ['Strategy', 'Expansion', 'Global']
				},
				{
					id: 'rec-2',
					title: 'Customer Experience AI Integration',
					description: 'Implementation of AI-driven support tools to reduce response times and improve customer satisfaction scores.',
					reason: 'Addresses "Operational" efficiency goals and leverages historical success in tech adoption.',
					objectives: ['Reduce support ticket time by 40%', 'Increase CSAT by 15%', 'Automate Tier 1 support'],
					estimatedDuration: '3 months',
					recommendedTeamSize: 5,
					confidenceScore: 88,
					tags: ['AI', 'Customer Support', 'Automation']
				},
				{
					id: 'rec-3',
					title: 'Internal Knowledge Base Modernization',
					description: 'Revamping internal documentation and knowledge sharing systems to improve employee onboarding and productivity.',
					reason: 'Recommended based on team growth trends and need for better operational scalability.',
					objectives: ['Centralize documentation', 'Reduce onboarding time by 2 weeks', 'Implement semantic search'],
					estimatedDuration: '2 months',
					recommendedTeamSize: 3,
					confidenceScore: 85,
					tags: ['Internal', 'Productivity', 'Knowledge']
				},
				{
					id: 'rec-4',
					title: 'Sustainable Supply Chain Optimization',
					description: 'Analyzing and optimizing supply chain processes to reduce carbon footprint and operational costs.',
					reason: 'Responds to increasing market demand for sustainability and cost-saving targets.',
					objectives: ['Reduce carbon emissions by 20%', 'Lower logistics costs by 10%', 'Certify green vendors'],
					estimatedDuration: '5 months',
					recommendedTeamSize: 6,
					confidenceScore: 82,
					tags: ['Sustainability', 'Operations', 'Logistics']
				},
				{
					id: 'rec-5',
					title: 'Mobile App 2.0 Redesign',
					description: 'Complete overhaul of the mobile application to improve user engagement and modernize the tech stack.',
					reason: 'Current app metrics show declining retention; competitors have launched modern alternatives.',
					objectives: ['Increase DAU by 25%', 'Modernize UI/UX', 'Migrate to React Native'],
					estimatedDuration: '4 months',
					recommendedTeamSize: 7,
					confidenceScore: 79,
					tags: ['Product', 'Mobile', 'Design']
				}
			]
			setRecommendations(generated)
			setLoading(false)
		}, 1500)
	}

	const handleCardClick = (rec: RecommendedProject) => {
		setSearchParams({ id: rec.id })
	}

	const handleBackToList = () => {
		setSearchParams({})
	}

	const handleSelect = (rec: RecommendedProject) => {
		setInitialProjectData({
			name: rec.title,
			description: rec.description,
			objectives: rec.objectives,
			startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
			endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
			files: [],
			links: []
		})
		setShowCreateDialog(true)
	}

	const handleOpenRejectDialog = (projectId: string) => {
		setRejectDialog({ open: true, projectId })
		setRejectionReason('')
	}

	const handleConfirmReject = () => {
		if (!rejectDialog.projectId) return

		// Remove from list
		setRecommendations(prev => prev.filter(p => p.id !== rejectDialog.projectId))
		
		// If rejected while in detail view, go back to list
		if (selectedRec?.id === rejectDialog.projectId) {
			handleBackToList()
		}
		
		// In a real app, we would send this to the backend
		console.log('Rejected project:', rejectDialog.projectId, 'Reason:', rejectionReason)
		
		toast.success(t('projects.rejectionSubmitted'))
		setRejectDialog({ open: false, projectId: null })
	}

	const handleCreateProject = async (formData: ProjectFormData) => {
		if (!user) {
			toast.error('User not authenticated')
			return
		}

		try {
			const projects = storage.get<any[]>('projects') || []
			const newProject: Project = {
				id: Date.now().toString(),
				name: formData.name,
				description: formData.description,
				departments: formData.departments.length > 0 ? formData.departments : ['General'],
				objectives: formData.objectives,
				status: 'planning',
				progress: 0,
				startDate: new Date(formData.startDate),
				endDate: new Date(formData.endDate),
				members: [],
				tags: [],
				createdAt: new Date(),
				createdBy: user.name,
				files: formData.files,
				links: formData.links,
			}

			const updated = [...projects, newProject]
			storage.set('projects', updated)
			createAITasksForProject(newProject)
			
			toast.success(t('projectsPage.projectCreated'))
			setTimeout(() => {
				navigate('/app/projects')
			}, 1000)
		} catch (error) {
			console.error('Failed to create project:', error)
			toast.error(t('projectsPage.failedToCreateProject'))
		}
	}

	// Render Detail View
	if (selectedRec) {
		return (
			<div className="min-h-screen bg-neutral-50 dark:bg-background-dark text-neutral-900 dark:text-neutral-100">
				<Toaster />
				<div className="max-w-[1200px] mx-auto px-6 py-6 space-y-8">
					<PageHeader
						title={selectedRec.title}
						description="AI Recommendation Detail"
						actions={
							<Button onClick={handleBackToList} variant="outline" size="sm">
								<ArrowLeft className="h-4 w-4 mr-2" />
								{t('common.back')}
							</Button>
						}
					/>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Main Content */}
						<div className="lg:col-span-2 space-y-6">
							<div className="bg-surface-dark border border-border-dark rounded-xl p-8">
								<div className="flex items-center gap-2 mb-6">
									<div className="bg-indigo-500/10 p-2 rounded-lg">
										<Sparkles className="h-5 w-5 text-indigo-400" />
									</div>
									<span className="text-indigo-300 font-medium">{selectedRec.confidenceScore}% Match</span>
								</div>

								<h2 className="text-xl font-bold text-white mb-4">{t('projects.description')}</h2>
								<p className="text-neutral-300 leading-relaxed mb-8 text-lg">
									{selectedRec.description}
								</p>

								<h2 className="text-xl font-bold text-white mb-4">{t('projects.whyRecommended')}</h2>
								<div className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-5 mb-8">
									<div className="flex gap-3">
										<Lightbulb className="h-5 w-5 text-indigo-400 shrink-0" />
										<p className="text-indigo-200 leading-relaxed">
											{selectedRec.reason}
										</p>
									</div>
								</div>

								<h2 className="text-xl font-bold text-white mb-4">{t('projects.keyObjectives')}</h2>
								<ul className="space-y-3">
									{selectedRec.objectives.map((obj, i) => (
										<li key={i} className="flex items-start gap-3 bg-neutral-900/50 p-4 rounded-lg border border-neutral-800">
											<Target className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
											<span className="text-neutral-300">{obj}</span>
										</li>
									))}
								</ul>
							</div>
						</div>

						{/* Sidebar Info */}
						<div className="space-y-6">
							<div className="bg-surface-dark border border-border-dark rounded-xl p-6">
								<h3 className="text-lg font-bold text-white mb-4">{t('projects.details')}</h3>
								<div className="space-y-4">
									<div className="flex items-center justify-between py-3 border-b border-neutral-800">
										<div className="flex items-center gap-2 text-neutral-400">
											<Calendar className="h-4 w-4" />
											<span>Duration</span>
										</div>
										<span className="text-white font-medium">{selectedRec.estimatedDuration}</span>
									</div>
									<div className="flex items-center justify-between py-3 border-b border-neutral-800">
										<div className="flex items-center gap-2 text-neutral-400">
											<Users className="h-4 w-4" />
											<span>Team Size</span>
										</div>
										<span className="text-white font-medium">{selectedRec.recommendedTeamSize} members</span>
									</div>
								</div>

								<div className="mt-6">
									<h4 className="text-sm font-medium text-neutral-400 mb-3">Tags</h4>
									<div className="flex flex-wrap gap-2">
										{selectedRec.tags.map((tag, i) => (
											<span key={i} className="px-3 py-1 rounded-full text-xs bg-neutral-800 text-neutral-300 border border-neutral-700">
												#{tag}
											</span>
										))}
									</div>
								</div>
							</div>

							<div className="bg-surface-dark border border-border-dark rounded-xl p-6 space-y-3">
								<Button 
									onClick={() => handleSelect(selectedRec)}
									className="w-full bg-indigo-600 hover:bg-indigo-500 text-white border-transparent !bg-indigo-600 py-6 text-base"
								>
									{t('projects.approve')} <ArrowRight className="h-5 w-5 ml-2" />
								</Button>
								<Button 
									onClick={() => handleOpenRejectDialog(selectedRec.id)}
									variant="outline"
									className="w-full border-red-500/30 hover:bg-red-500/10 text-red-400 hover:text-red-300 py-3"
								>
									{t('projects.reject')}
								</Button>
							</div>
						</div>
					</div>

					{/* Create Project Dialog (Shared) */}
					<ProjectFormDialog
						show={showCreateDialog}
						onClose={() => setShowCreateDialog(false)}
						onSubmit={handleCreateProject}
						availableDepartments={[]} 
						initialData={initialProjectData}
						title={t('projects.reviewAndStart')}
						submitLabel={t('projects.editAndStart')}
					/>

					{/* Rejection Dialog (Shared) */}
					<Dialog open={rejectDialog.open} onOpenChange={(open) => !open && setRejectDialog({ open: false, projectId: null })}>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>{t('projects.rejectConfirm')}</DialogTitle>
								<DialogDescription>
									{t('projects.rejectionReasonPlaceholder')}
								</DialogDescription>
							</DialogHeader>
							
							<div className="py-4">
								<Textarea
									value={rejectionReason}
									onChange={(e) => setRejectionReason(e.target.value)}
									placeholder={t('projects.rejectionReasonPlaceholder')}
									rows={4}
									className="resize-none"
								/>
							</div>

							<DialogFooter>
								<Button
									variant="ghost"
									onClick={() => setRejectDialog({ open: false, projectId: null })}
								>
									{t('common.cancel')}
								</Button>
								<Button
									variant="danger"
									onClick={handleConfirmReject}
									disabled={!rejectionReason.trim()}
								>
									{t('projects.reject')}
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			</div>
		)
	}

	// Render List View
	return (
		<div className="min-h-screen bg-neutral-50 dark:bg-background-dark text-neutral-900 dark:text-neutral-100">
			<Toaster />
			<div className="max-w-[1600px] mx-auto px-6 py-6 space-y-8">
				<PageHeader
					title={t('projects.aiProjectRecs')}
					description={t('projects.aiRecDesc')}
					actions={
						<Button onClick={() => navigate('/app/projects')} variant="outline" size="sm">
							<ArrowLeft className="h-4 w-4 mr-2" />
							{t('common.back')}
						</Button>
					}
				/>

				{loading ? (
					<div className="flex flex-col items-center justify-center py-20">
						<RefreshCw className="h-12 w-12 text-indigo-400 animate-spin mb-4" />
						<p className="text-neutral-400">{t('projects.analyzing')}</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{recommendations.map((rec) => (
							<div 
								key={rec.id}
								onClick={() => handleCardClick(rec)}
								className="group relative bg-surface-dark hover:bg-neutral-800 border border-border-dark hover:border-indigo-500/50 rounded-xl p-6 transition-all flex flex-col cursor-pointer"
							>
								<div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-950/30 border border-indigo-500/30">
									<Sparkles className="h-3 w-3 text-indigo-400" />
									<span className="text-xs font-bold text-indigo-300">{rec.confidenceScore}% {t('projects.match')}</span>
								</div>

								<h3 className="text-lg font-bold text-white mb-3 pr-20 group-hover:text-indigo-300 transition-colors">
									{rec.title}
								</h3>
								<p className="text-sm text-neutral-400 mb-4 leading-relaxed flex-1 line-clamp-3">
									{rec.description}
								</p>

								<div className="flex items-start gap-2 mb-4 bg-indigo-500/5 rounded-lg p-3 border border-indigo-500/10">
									<Lightbulb className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
									<p className="text-xs text-indigo-200 line-clamp-2">
										<span className="font-semibold text-indigo-300">{t('projects.whyRecommended')}</span> {rec.reason}
									</p>
								</div>

								<div className="flex flex-wrap gap-4 text-xs text-neutral-500 mb-4">
									<div className="flex items-center gap-1.5">
										<Calendar className="h-3.5 w-3.5" />
										<span>{rec.estimatedDuration}</span>
									</div>
									<div className="flex items-center gap-1.5">
										<Users className="h-3.5 w-3.5" />
										<span>{rec.recommendedTeamSize} {t('projects.members')}</span>
									</div>
									<div className="flex items-center gap-1.5">
										<Target className="h-3.5 w-3.5" />
										<span>{rec.objectives.length} {t('projects.keyObjectives')}</span>
									</div>
								</div>

								<div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-neutral-800">
									{rec.tags.slice(0, 3).map((tag, i) => (
										<span key={i} className="px-2 py-0.5 rounded text-[10px] bg-neutral-800 text-neutral-400 border border-neutral-700">
											#{tag}
										</span>
									))}
									{rec.tags.length > 3 && (
										<span className="px-2 py-0.5 rounded text-[10px] bg-neutral-800 text-neutral-500">
											+{rec.tags.length - 3}
										</span>
									)}
								</div>
								
								<div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
									<div className="bg-indigo-600 p-2 rounded-full shadow-lg shadow-indigo-900/20">
										<ChevronRight className="h-4 w-4 text-white" />
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			<ProjectFormDialog
				show={showCreateDialog}
				onClose={() => setShowCreateDialog(false)}
				onSubmit={handleCreateProject}
				availableDepartments={[]} 
				initialData={initialProjectData}
				title={t('projects.reviewAndStart')}
				submitLabel={t('projects.editAndStart')}
			/>

			<Dialog open={rejectDialog.open} onOpenChange={(open) => !open && setRejectDialog({ open: false, projectId: null })}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t('projects.rejectConfirm')}</DialogTitle>
						<DialogDescription>
							{t('projects.rejectionReasonPlaceholder')}
						</DialogDescription>
					</DialogHeader>
					
					<div className="py-4">
						<Textarea
							value={rejectionReason}
							onChange={(e) => setRejectionReason(e.target.value)}
							placeholder={t('projects.rejectionReasonPlaceholder')}
							rows={4}
							className="resize-none"
						/>
					</div>

					<DialogFooter>
						<Button
							variant="ghost"
							onClick={() => setRejectDialog({ open: false, projectId: null })}
						>
							{t('common.cancel')}
						</Button>
						<Button
							variant="danger"
							onClick={handleConfirmReject}
							disabled={!rejectionReason.trim()}
						>
							{t('projects.reject')}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
