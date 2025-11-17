/**
 * AI Task Generator
 * 프로젝트 생성 시 자동으로 추천 Task를 생성하는 유틸리티
 */

import { storage } from '../../../utils/storage'

interface Project {
	id: string
	name: string
	description: string
	departments: string[]
	objectives: string[]
	startDate: Date
	endDate: Date
	status: string
	members?: any[]
}

interface TaskRecommendation {
	id: string
	title: string
	description: string
	priority: 'high' | 'medium' | 'low'
	category: string
	deadline?: string
	dataSource: string
	status: 'pending' | 'accepted' | 'rejected'
	projectId?: string
	projectName?: string
	isManual?: boolean
	createdAt?: string
	aiAnalysis?: {
		projectName: string
		analysisDate: string
		analysisReason: string
		relatedMembers: Array<{
			name: string
			role: string
			department: string
			memberType: 'active' | 'related'
		}>
		detailedInstructions: string[]
		expectedOutcome: string
		recommendations: string[]
		riskFactors: string[]
	}
}

/**
 * 프로젝트 기간 계산 (일 단위)
 */
function calculateProjectDuration(startDate: Date, endDate: Date): number {
	const diff = endDate.getTime() - startDate.getTime()
	return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/**
 * 프로젝트 단계별 마일스톤 날짜 계산
 */
function calculateMilestoneDate(startDate: Date, endDate: Date, percentage: number): string {
	const duration = endDate.getTime() - startDate.getTime()
	const milestoneTime = startDate.getTime() + (duration * percentage)
	return new Date(milestoneTime).toISOString()
}

/**
 * 프로젝트 생성 시 AI가 자동으로 추천 Task 생성
 */
export function generateAITasksForNewProject(project: Project): TaskRecommendation[] {
	const tasks: TaskRecommendation[] = []
	const projectDuration = calculateProjectDuration(project.startDate, project.endDate)
	const now = new Date()
	
	// 프로젝트 시작까지 남은 일수
	const daysUntilStart = Math.ceil((project.startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
	
	// 1. 프로젝트 킥오프 미팅 (프로젝트 시작 3일 전 또는 즉시)
	const kickoffDeadline = daysUntilStart > 3 
		? new Date(project.startDate.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()
		: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString()
	
	tasks.push({
		id: `ai-kickoff-${project.id}-${Date.now()}`,
		title: `Schedule Project Kickoff Meeting: ${project.name}`,
		description: `Organize and conduct initial kickoff meeting for ${project.name}. Align all stakeholders on project goals, timeline, and responsibilities.`,
		priority: 'high',
		category: 'Project Planning',
		deadline: kickoffDeadline,
		dataSource: 'AI Project Analysis',
		status: 'pending',
		projectId: project.id,
		projectName: project.name,
		createdAt: new Date().toISOString(),
		aiAnalysis: {
			projectName: project.name,
			analysisDate: new Date().toISOString(),
			analysisReason: `AI detected a newly created project. A kickoff meeting is critical to establish clear communication, set expectations, and ensure all team members understand their roles and the project objectives.`,
			relatedMembers: [
				{ name: 'Project Manager', role: 'Lead', department: project.departments[0] || 'General', memberType: 'active' },
				{ name: 'Team Leads', role: 'Participants', department: project.departments.join(', '), memberType: 'active' },
				{ name: 'Key Stakeholders', role: 'Attendees', department: 'Multiple', memberType: 'related' }
			],
			detailedInstructions: [
				'Schedule meeting with all key stakeholders and team members',
				'Prepare project overview presentation covering goals, scope, and timeline',
				'Create and distribute meeting agenda 24 hours in advance',
				'Review project objectives and success criteria',
				'Assign roles and responsibilities to team members',
				'Establish communication channels and meeting cadence',
				'Document action items and next steps',
				'Share meeting minutes with all participants within 24 hours'
			],
			expectedOutcome: 'All team members aligned on project vision, goals, and their individual responsibilities. Clear next steps established with assigned owners.',
			recommendations: [
				'Use video conferencing for remote team members',
				'Allocate 60-90 minutes for comprehensive discussion',
				'Prepare Q&A session to address concerns',
				'Create shared project workspace (Slack channel, Teams, etc.)'
			],
			riskFactors: [
				'Without proper kickoff, team may have misaligned expectations',
				'Lack of clarity on roles can cause confusion and delays',
				'Poor initial communication sets negative tone for project',
				'Missing stakeholders may cause rework and scope creep'
			]
		}
	})
	
	// 2. 프로젝트 계획 문서 작성
	tasks.push({
		id: `ai-planning-${project.id}-${Date.now()}`,
		title: `Create Project Plan Document: ${project.name}`,
		description: `Develop comprehensive project plan including scope, timeline, resource allocation, and risk management strategy for ${project.name}.`,
		priority: 'high',
		category: 'Documentation',
		deadline: calculateMilestoneDate(project.startDate, project.endDate, 0.1),
		dataSource: 'AI Project Analysis',
		status: 'pending',
		projectId: project.id,
		projectName: project.name,
		createdAt: new Date().toISOString(),
		aiAnalysis: {
			projectName: project.name,
			analysisDate: new Date().toISOString(),
			analysisReason: `Project duration: ${projectDuration} days. A detailed project plan is essential for ${projectDuration > 90 ? 'long-term' : projectDuration > 30 ? 'medium-term' : 'short-term'} projects to maintain focus and track progress effectively.`,
			relatedMembers: [
				{ name: 'Project Manager', role: 'Owner', department: project.departments[0] || 'General', memberType: 'active' },
				{ name: 'Technical Lead', role: 'Contributor', department: 'Engineering', memberType: 'active' },
				{ name: 'Product Owner', role: 'Reviewer', department: 'Product', memberType: 'related' }
			],
			detailedInstructions: [
				'Define clear project scope and deliverables',
				'Break down project into phases and milestones',
				'Create work breakdown structure (WBS)',
				'Estimate effort and duration for each task',
				'Identify resource requirements and dependencies',
				'Document assumptions and constraints',
				'Develop risk register and mitigation strategies',
				'Define success metrics and KPIs'
			],
			expectedOutcome: 'Comprehensive project plan document that serves as single source of truth for all project activities, timelines, and deliverables.',
			recommendations: [
				'Use project management templates for consistency',
				'Include Gantt chart or timeline visualization',
				'Get stakeholder sign-off before proceeding',
				'Set up version control for plan updates'
			],
			riskFactors: [
				'Incomplete planning leads to scope creep and missed deadlines',
				'Underestimated effort causes resource shortages',
				'Unclear deliverables create stakeholder dissatisfaction',
				'Missing risk analysis leaves project vulnerable'
			]
		}
	})
	
	// 3. 팀 구성 및 역할 할당 (멤버가 없을 경우)
	if (!project.members || project.members.length === 0) {
		tasks.push({
			id: `ai-team-${project.id}-${Date.now()}`,
			title: `Assign Team Members: ${project.name}`,
			description: `Identify and assign appropriate team members with required skills for ${project.name}. Ensure balanced workload distribution.`,
			priority: 'high',
			category: 'Resource Management',
			deadline: calculateMilestoneDate(project.startDate, project.endDate, 0.15),
			dataSource: 'AI Project Analysis',
			status: 'pending',
			projectId: project.id,
			projectName: project.name,
			createdAt: new Date().toISOString(),
			aiAnalysis: {
				projectName: project.name,
				analysisDate: new Date().toISOString(),
				analysisReason: 'AI detected that no team members are currently assigned to this project. Proper resource allocation is critical for project success.',
				relatedMembers: [
					{ name: 'Resource Manager', role: 'Owner', department: 'HR/Operations', memberType: 'active' },
					{ name: 'Department Heads', role: 'Collaborators', department: project.departments.join(', '), memberType: 'active' },
					{ name: 'Project Manager', role: 'Requestor', department: project.departments[0] || 'General', memberType: 'related' }
				],
				detailedInstructions: [
					'Review project requirements and identify needed skill sets',
					'Check team member availability and current workload',
					'Match skills to project tasks and requirements',
					'Consider team dynamics and collaboration history',
					'Assign clear roles and responsibilities to each member',
					'Ensure adequate coverage for all project areas',
					'Communicate assignments to selected team members',
					'Update project documentation with team roster'
				],
				expectedOutcome: 'Fully staffed project team with clearly defined roles, adequate skills coverage, and balanced workload distribution.',
				recommendations: [
					'Prefer team members with relevant domain experience',
					'Balance senior and junior resources for knowledge transfer',
					'Consider time zone alignment for distributed teams',
					'Plan for backup resources for critical roles'
				],
				riskFactors: [
					'Delayed team assignment causes project start delays',
					'Wrong skill mix leads to quality issues and rework',
					'Overloaded team members may cause burnout',
					'Lack of ownership creates accountability gaps'
				]
			}
		})
	}
	
	// 4. 초기 리스크 평가 (프로젝트가 긴 경우)
	if (projectDuration > 60) {
		tasks.push({
			id: `ai-risk-${project.id}-${Date.now()}`,
			title: `Conduct Initial Risk Assessment: ${project.name}`,
			description: `Identify potential risks, assess their impact and probability, and develop mitigation strategies for ${project.name}.`,
			priority: 'medium',
			category: 'Risk Management',
			deadline: calculateMilestoneDate(project.startDate, project.endDate, 0.2),
			dataSource: 'AI Project Analysis',
			status: 'pending',
			projectId: project.id,
			projectName: project.name,
			createdAt: new Date().toISOString(),
			aiAnalysis: {
				projectName: project.name,
				analysisDate: new Date().toISOString(),
				analysisReason: `This is a ${projectDuration}-day project. Longer projects face higher uncertainty and risk. Proactive risk management is essential to prevent issues from derailing the project.`,
				relatedMembers: [
					{ name: 'Project Manager', role: 'Facilitator', department: project.departments[0] || 'General', memberType: 'active' },
					{ name: 'Technical Leads', role: 'Contributors', department: 'Engineering', memberType: 'active' },
					{ name: 'Business Analysts', role: 'Contributors', department: 'Product', memberType: 'related' }
				],
				detailedInstructions: [
					'Brainstorm potential risks with team members',
					'Categorize risks: technical, schedule, resource, external',
					'Assess probability and impact for each risk',
					'Prioritize risks using risk matrix',
					'Develop mitigation and contingency plans',
					'Assign risk owners for monitoring',
					'Create risk tracking dashboard',
					'Schedule regular risk review meetings'
				],
				expectedOutcome: 'Comprehensive risk register with clear mitigation strategies and assigned owners. Regular monitoring process established.',
				recommendations: [
					'Use lessons learned from similar past projects',
					'Consider both positive opportunities and negative threats',
					'Include external dependencies and market risks',
					'Update risk register monthly or when changes occur'
				],
				riskFactors: [
					'Unidentified risks can cause unexpected project failures',
					'Reactive risk management is costly and time-consuming',
					'Major risks without mitigation can halt project progress',
					'Stakeholder confidence erodes with frequent surprises'
				]
			}
		})
	}
	
	// 5. 중간 체크포인트 설정 (프로젝트 중반)
	if (projectDuration > 30) {
		tasks.push({
			id: `ai-checkpoint-${project.id}-${Date.now()}`,
			title: `Mid-Project Review Checkpoint: ${project.name}`,
			description: `Schedule comprehensive mid-project review to assess progress, adjust plans, and address any issues for ${project.name}.`,
			priority: 'medium',
			category: 'Project Review',
			deadline: calculateMilestoneDate(project.startDate, project.endDate, 0.5),
			dataSource: 'AI Project Analysis',
			status: 'pending',
			projectId: project.id,
			projectName: project.name,
			createdAt: new Date().toISOString(),
			aiAnalysis: {
				projectName: project.name,
				analysisDate: new Date().toISOString(),
				analysisReason: 'Mid-project reviews are critical checkpoints for longer projects. They provide opportunity to course-correct before issues become major problems.',
				relatedMembers: [
					{ name: 'Project Manager', role: 'Lead', department: project.departments[0] || 'General', memberType: 'active' },
					{ name: 'Team Members', role: 'Participants', department: project.departments.join(', '), memberType: 'active' },
					{ name: 'Stakeholders', role: 'Reviewers', department: 'Multiple', memberType: 'related' }
				],
				detailedInstructions: [
					'Review progress against original plan and milestones',
					'Assess budget and resource utilization',
					'Evaluate quality of deliverables completed so far',
					'Identify blockers and challenges faced by team',
					'Gather feedback from stakeholders',
					'Update project timeline and scope if needed',
					'Adjust resource allocation based on learnings',
					'Document decisions and communicate changes'
				],
				expectedOutcome: 'Clear understanding of project health, updated plan reflecting reality, renewed team alignment and stakeholder confidence.',
				recommendations: [
					'Use objective metrics to assess progress',
					'Create safe space for honest feedback',
					'Focus on solutions rather than blame',
					'Celebrate wins to maintain team morale'
				],
				riskFactors: [
					'Ignoring mid-project signals leads to late-stage failures',
					'Without course correction, small issues become crises',
					'Team burnout goes unnoticed without regular check-ins',
					'Stakeholder expectations drift without periodic alignment'
				]
			}
		})
	}
	
	// 6. 최종 검토 및 마감 준비
	tasks.push({
		id: `ai-closure-${project.id}-${Date.now()}`,
		title: `Prepare for Project Closure: ${project.name}`,
		description: `Ensure all deliverables are complete, conduct final review, and prepare for project handoff and closure activities.`,
		priority: 'medium',
		category: 'Project Closure',
		deadline: calculateMilestoneDate(project.startDate, project.endDate, 0.9),
		dataSource: 'AI Project Analysis',
		status: 'pending',
		projectId: project.id,
		projectName: project.name,
		createdAt: new Date().toISOString(),
		aiAnalysis: {
			projectName: project.name,
			analysisDate: new Date().toISOString(),
			analysisReason: 'Proper project closure ensures knowledge transfer, captures lessons learned, and maintains stakeholder satisfaction beyond project completion.',
			relatedMembers: [
				{ name: 'Project Manager', role: 'Owner', department: project.departments[0] || 'General', memberType: 'active' },
				{ name: 'Quality Assurance', role: 'Validator', department: 'QA', memberType: 'active' },
				{ name: 'Stakeholders', role: 'Approvers', department: 'Multiple', memberType: 'related' }
			],
			detailedInstructions: [
				'Verify all deliverables meet acceptance criteria',
				'Conduct final quality assurance review',
				'Prepare handoff documentation and training materials',
				'Schedule stakeholder acceptance sign-off meeting',
				'Document lessons learned with team',
				'Archive project documentation and assets',
				'Release project resources back to organization',
				'Celebrate project completion with team'
			],
			expectedOutcome: 'Clean project closure with satisfied stakeholders, captured knowledge, and smooth transition to operations or next phase.',
			recommendations: [
				'Start closure activities 2-3 weeks before deadline',
				'Ensure comprehensive documentation for maintenance',
				'Conduct retrospective to improve future projects',
				'Get formal sign-off from all stakeholders'
			],
			riskFactors: [
				'Rushed closure leaves gaps in documentation',
				'Missing sign-offs create ambiguity about completion',
				'Lost lessons learned opportunity wastes organizational knowledge',
				'Poor handoff leads to operational issues post-launch'
			]
		}
	})
	
	return tasks
}

/**
 * AI Task를 localStorage에 저장
 */
export function saveAITasksToStorage(tasks: TaskRecommendation[]): void {
	const existingTasks = storage.get<TaskRecommendation[]>('ai_recommendations') || []
	const updatedTasks = [...existingTasks, ...tasks]
	storage.set('ai_recommendations', updatedTasks)
}

/**
 * 프로젝트 생성 시 자동으로 AI Task 생성 및 저장
 */
export function createAITasksForProject(project: Project): void {
	const aiTasks = generateAITasksForNewProject(project)
	saveAITasksToStorage(aiTasks)
	
	console.log(`✨ AI generated ${aiTasks.length} tasks for project: ${project.name}`)
}

