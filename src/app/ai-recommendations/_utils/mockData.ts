import { TaskRecommendation, RecommendationInsight } from '../_types'

export const MOCK_RECOMMENDATIONS: TaskRecommendation[] = [
	{
		id: "mock-2",
		title: "Update Project: Mobile App Redesign",
		description: "No activity logged for 10 days. Project deadline is in 3 weeks. Immediate status update required.",
		priority: "high",
		category: "Project Update",
		deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
		dataSource: "Project Activity Monitoring",
		status: "pending",
		aiAnalysis: {
			projectName: "Mobile App Redesign v2.0",
			analysisDate: new Date().toISOString(),
			analysisReason: "AI has detected no work entries or progress updates for this project in the past 10 days, despite the approaching deadline. This unusual silence may indicate blocked progress, team availability issues, or scope changes that haven't been communicated.",
			relatedMembers: [
				{name: "David Kim", role: "UX Designer", department: "Design", memberType: "active"},
				{name: "Lisa Chen", role: "iOS Developer", department: "Engineering", memberType: "active"},
				{name: "James Park", role: "Android Developer", department: "Engineering", memberType: "related"}
			],
			detailedInstructions: [
				"Contact all team members to verify current project status",
				"Review last recorded milestone and identify what has been completed since",
				"Assess if deadline is still achievable or needs adjustment",
				"Document any blockers or dependencies preventing progress",
				"Update project timeline and communicate changes to stakeholders",
				"If project is on hold, formally update status in system"
			],
			expectedOutcome: "Resume regular project activity with daily work logging. Clear communication about project status and realistic timeline.",
			recommendations: [
				"Set up daily standup meetings until project momentum is restored",
				"Create shared project dashboard for real-time visibility",
				"Implement automated reminders for team to log daily progress",
				"Consider whether additional resources are needed"
			],
			riskFactors: [
				"Prolonged silence indicates potential project derailment",
				"Deadline may be at serious risk without immediate intervention",
				"Team may have lost context and need re-onboarding",
				"Stakeholders may be unaware of actual project status"
			]
		}
	},
	{
		id: "mock-3",
		title: "Review Team Capacity: Engineering Department",
		description: "Analysis shows 3 team members are working 45+ hours/week consistently. Consider workload rebalancing.",
		priority: "medium",
		category: "Resource Optimization",
		dataSource: "Work Hours Analysis",
		status: "pending",
		aiAnalysis: {
			projectName: "Engineering Team Capacity",
			analysisDate: new Date().toISOString(),
			analysisReason: "AI detected sustained high work hours for multiple team members over the past 4 weeks. This pattern often leads to burnout, decreased productivity, and increased error rates. Early intervention can prevent these issues.",
			relatedMembers: [
				{name: "Tom Wilson", role: "Senior Developer", department: "Engineering", memberType: "active"},
				{name: "Rachel Green", role: "Full Stack Engineer", department: "Engineering", memberType: "active"},
				{name: "Alex Martinez", role: "Backend Developer", department: "Engineering", memberType: "active"}
			],
			detailedInstructions: [
				"Review current project assignments for these team members",
				"Identify tasks that can be delegated or deprioritized",
				"Schedule 1-on-1 meetings to discuss workload concerns",
				"Evaluate if hiring additional resources is necessary",
				"Implement mandatory time-off policy if burnout risk is high",
				"Redistribute urgent tasks to other available team members"
			],
			expectedOutcome: "Reduce average work hours to sustainable 40 hours/week. Maintain productivity while preventing burnout.",
			recommendations: [
				"Consider bringing in contractors for short-term capacity boost",
				"Identify and automate repetitive tasks to free up time",
				"Reschedule non-critical deadlines to reduce pressure",
				"Implement 'no meeting' days to allow focused work time"
			],
			riskFactors: [
				"Continued overwork leads to increased attrition risk",
				"Quality of work may decline due to fatigue",
				"Team morale and collaboration may suffer",
				"Key knowledge holders may leave if not addressed"
			]
		}
	},
	{
		id: "mock-4",
		title: "Customer Success Initiative Planning",
		description: "AI suggests creating new initiative based on recent customer feedback patterns and support ticket analysis.",
		priority: "medium",
		category: "Strategic Initiative",
		dataSource: "Customer Data Analysis",
		status: "pending",
		aiAnalysis: {
			projectName: "Customer Success Enhancement Program",
			analysisDate: new Date().toISOString(),
			analysisReason: "Machine learning analysis of customer interactions over the past quarter revealed recurring themes: 25% increase in onboarding-related questions, 40% of support tickets related to feature discovery, and 15% improvement in retention for customers who completed product tours.",
			relatedMembers: [
				{name: "Jennifer Lee", role: "Head of Customer Success", department: "Customer Success", memberType: "active"},
				{name: "Mark Anderson", role: "Product Manager", department: "Product", memberType: "active"},
				{name: "Sophia Wang", role: "Support Team Lead", department: "Customer Support", memberType: "related"}
			],
			detailedInstructions: [
				"Analyze detailed customer feedback and support ticket data",
				"Design improved onboarding flow based on common pain points",
				"Create in-app guidance system for feature discovery",
				"Develop customer success playbook for high-touch accounts",
				"Implement NPS tracking at key customer journey milestones",
				"Schedule monthly customer advisory board meetings"
			],
			expectedOutcome: "Reduce onboarding time by 30%, decrease support tickets by 25%, and improve customer retention by 15% within next quarter.",
			recommendations: [
				"Start with pilot program for new customers",
				"Create video tutorials for top 10 most-asked questions",
				"Implement automated check-ins at 7, 30, and 90 day marks",
				"Build customer health score dashboard for proactive outreach"
			],
			riskFactors: [
				"Resource allocation needed from multiple departments",
				"May require product changes which take development time",
				"Success metrics need to be clearly defined upfront",
				"Change management needed to shift from reactive to proactive support"
			]
		}
	},
	{
		id: "mock-5",
		title: "Code Quality Review: Payment Processing Module",
		description: "Static analysis detected 15 potential security vulnerabilities in payment processing code. Immediate review recommended.",
		priority: "high",
		category: "Code Quality",
		dataSource: "Security Scan Results",
		status: "pending",
		aiAnalysis: {
			projectName: "Payment Processing System",
			analysisDate: new Date().toISOString(),
			analysisReason: "Automated security scanning identified multiple issues: 8 medium-severity vulnerabilities, 5 low-severity issues, and 2 high-priority code quality concerns. Given the sensitive nature of payment processing, immediate attention is warranted.",
			relatedMembers: [
				{name: "Robert Chang", role: "Security Engineer", department: "Security", memberType: "active"},
				{name: "Michelle Liu", role: "Backend Lead", department: "Engineering", memberType: "active"},
				{name: "Kevin Brown", role: "DevOps Engineer", department: "Infrastructure", memberType: "related"}
			],
			detailedInstructions: [
				"Conduct immediate security audit of payment processing code",
				"Prioritize fixing high-severity vulnerabilities within 48 hours",
				"Implement additional input validation and sanitization",
				"Review and update PCI DSS compliance documentation",
				"Add comprehensive unit tests for security-critical functions",
				"Schedule penetration testing after fixes are deployed",
				"Update security scanning rules to catch similar issues earlier"
			],
			expectedOutcome: "All high and medium severity issues resolved within 1 week. Enhanced security posture and compliance with industry standards.",
			recommendations: [
				"Implement pre-commit hooks for security scanning",
				"Schedule regular security training for development team",
				"Establish security champion role within engineering team",
				"Consider third-party security audit for critical systems"
			],
			riskFactors: [
				"Unaddressed vulnerabilities could lead to data breaches",
				"Compliance violations may result in fines or legal issues",
				"Customer trust and company reputation at stake",
				"Payment processor may suspend account if issues found during their audit"
			]
		}
	},
	{
		id: "mock-6",
		title: "Marketing Campaign Performance Review",
		description: "AI analysis shows campaign ROI below target by 35%. Recommend strategy adjustment or budget reallocation.",
		priority: "low",
		category: "Marketing Optimization",
		dataSource: "Campaign Analytics",
		status: "pending",
		aiAnalysis: {
			projectName: "Q4 Marketing Campaign",
			analysisDate: new Date().toISOString(),
			analysisReason: "Predictive analysis comparing current campaign performance against historical data and industry benchmarks indicates current trajectory will miss ROI targets by approximately 35%. Early course correction can salvage campaign effectiveness.",
			relatedMembers: [
				{name: "Amanda Stevens", role: "Marketing Director", department: "Marketing", memberType: "active"},
				{name: "Chris Thompson", role: "Growth Manager", department: "Growth", memberType: "active"},
				{name: "Nicole Davis", role: "Content Lead", department: "Marketing", memberType: "related"}
			],
			detailedInstructions: [
				"Analyze which campaign channels are underperforming vs. expectations",
				"Review messaging effectiveness and A/B test results",
				"Assess target audience alignment with actual engagement",
				"Evaluate creative assets performance and refresh underperforming content",
				"Consider reallocating budget from low-performing to high-performing channels",
				"Schedule campaign review meeting with all stakeholders"
			],
			expectedOutcome: "Improve campaign ROI to within 10% of target through optimization. Establish clear metrics for ongoing monitoring.",
			recommendations: [
				"Pause underperforming ad sets and reallocate budget",
				"Test new messaging angles based on customer feedback",
				"Leverage high-performing content across more channels",
				"Consider extending campaign timeline if early results are promising"
			],
			riskFactors: [
				"Budget may be wasted if changes aren't made quickly",
				"Missing targets could affect quarterly revenue goals",
				"Team morale may suffer from underperforming campaign",
				"Stakeholder confidence in marketing effectiveness may decline"
			]
		}
	}
]

export const MOCK_INSIGHTS: RecommendationInsight[] = [
	{type: "deadline", metric: "Upcoming", value: "3 deadlines in 2 weeks", status: "warning"},
	{type: "inactive", metric: "Projects", value: "1 inactive project", status: "warning"},
	{type: "info", metric: "Team Capacity", value: "3 members overworked", status: "warning"}
]

export const MOCK_USERS = [
	// Engineering Team (7 members)
	{ id: '1', name: 'John Doe', email: 'john@company.com', department: 'Engineering' },
	{ id: '3', name: 'Mike Johnson', email: 'mike@company.com', department: 'Engineering' },
	{ id: '5', name: 'David Lee', email: 'david@company.com', department: 'Engineering' },
	{ id: '7', name: 'Alex Kim', email: 'alex@company.com', department: 'Engineering' },
	{ id: '10', name: 'Chris Brown', email: 'chris@company.com', department: 'Engineering' },
	{ id: '11', name: 'Jennifer Wang', email: 'jennifer@company.com', department: 'Engineering' },
	{ id: '12', name: 'Ryan Martinez', email: 'ryan@company.com', department: 'Engineering' },
	
	// Product Team (4 members)
	{ id: '2', name: 'Sarah Chen', email: 'sarah@company.com', department: 'Product' },
	{ id: '13', name: 'Emma Thompson', email: 'emma@company.com', department: 'Product' },
	{ id: '14', name: 'James Wilson', email: 'james@company.com', department: 'Product' },
	{ id: '15', name: 'Sophie Anderson', email: 'sophie@company.com', department: 'Product' },
	
	// Design Team (3 members)
	{ id: '4', name: 'Emily Davis', email: 'emily@company.com', department: 'Design' },
	{ id: '16', name: 'Oliver Harris', email: 'oliver@company.com', department: 'Design' },
	{ id: '17', name: 'Maya Patel', email: 'maya@company.com', department: 'Design' },
	
	// Marketing Team (3 members)
	{ id: '6', name: 'Lisa Park', email: 'lisa@company.com', department: 'Marketing' },
	{ id: '18', name: 'Daniel Kim', email: 'daniel@company.com', department: 'Marketing' },
	{ id: '19', name: 'Isabella Rodriguez', email: 'isabella@company.com', department: 'Marketing' },
	
	// Sales Team (3 members)
	{ id: '8', name: 'Rachel Green', email: 'rachel@company.com', department: 'Sales' },
	{ id: '20', name: 'Michael Scott', email: 'michael@company.com', department: 'Sales' },
	{ id: '21', name: 'Amy Zhang', email: 'amy@company.com', department: 'Sales' },
	
	// Operations Team (2 members)
	{ id: '9', name: 'Tom Wilson', email: 'tom@company.com', department: 'Operations' },
	{ id: '22', name: 'Laura Chen', email: 'laura@company.com', department: 'Operations' },
	
	// HR Team (2 members)
	{ id: '23', name: 'Kevin Lee', email: 'kevin@company.com', department: 'HR' },
	{ id: '24', name: 'Grace Park', email: 'grace@company.com', department: 'HR' },
	
	// Finance Team (2 members)
	{ id: '25', name: 'Robert Johnson', email: 'robert@company.com', department: 'Finance' },
	{ id: '26', name: 'Victoria Lee', email: 'victoria@company.com', department: 'Finance' },
]

