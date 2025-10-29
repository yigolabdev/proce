import type { Industry } from '../_types/onboarding.types';

export const DEPARTMENT_PRESETS: Record<Industry, string[]> = {
	'IT/SaaS': ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Customer Success', 'Operations'],
	Consulting: ['Strategy', 'Operations', 'Technology', 'HR', 'Finance', 'Marketing', 'Business Development'],
	Marketing: ['Creative', 'Digital', 'Content', 'Analytics', 'Brand', 'Growth', 'Operations'],
	Design: ['UX/UI', 'Visual Design', 'Research', 'Product Design', 'Brand Design', 'Operations'],
	'Retail HQ': ['Merchandising', 'Supply Chain', 'Store Operations', 'Marketing', 'Finance', 'HR', 'IT'],
	Logistics: ['Operations', 'Supply Chain', 'Warehouse', 'Transportation', 'Customer Service', 'IT', 'Finance'],
	Manufacturing: ['Production', 'Quality', 'Supply Chain', 'R&D', 'Maintenance', 'Safety', 'Operations'],
	Healthcare: ['Clinical', 'Operations', 'IT', 'Finance', 'HR', 'Compliance', 'Patient Services'],
	Public: ['Administration', 'Operations', 'IT', 'Finance', 'HR', 'Communications', 'Legal'],
	Education: ['Academic', 'Administration', 'IT', 'Student Services', 'Finance', 'HR', 'Communications'],
	Other: ['Operations', 'Finance', 'HR', 'IT', 'Marketing', 'Sales'],
};

export const JOB_CATEGORY_PRESETS: Record<Industry, string[]> = {
	'IT/SaaS': ['Software Engineer', 'Product Manager', 'Designer', 'Data Analyst', 'DevOps', 'QA Engineer'],
	Consulting: ['Consultant', 'Analyst', 'Project Manager', 'Researcher', 'Strategist'],
	Marketing: ['Content Creator', 'Campaign Manager', 'SEO Specialist', 'Social Media Manager', 'Analyst'],
	Design: ['UX Designer', 'UI Designer', 'Researcher', 'Visual Designer', 'Brand Designer'],
	'Retail HQ': ['Buyer', 'Merchandiser', 'Analyst', 'Store Manager', 'Supply Chain Specialist'],
	Logistics: ['Operations Manager', 'Warehouse Supervisor', 'Driver', 'Analyst', 'Coordinator'],
	Manufacturing: ['Production Manager', 'Quality Engineer', 'Technician', 'Supply Chain Specialist', 'Maintenance'],
	Healthcare: ['Clinician', 'Administrator', 'IT Specialist', 'Analyst', 'Coordinator'],
	Public: ['Administrator', 'Analyst', 'Coordinator', 'IT Specialist', 'Communications Specialist'],
	Education: ['Teacher', 'Administrator', 'Counselor', 'IT Specialist', 'Coordinator'],
	Other: ['Manager', 'Specialist', 'Analyst', 'Coordinator', 'Administrator'],
};

export const KPI_PRESETS: Record<Industry, string[]> = {
	'IT/SaaS': ['Revenue', 'Active Users', 'Churn Rate', 'NPS', 'Cycle Time', 'Deployment Frequency'],
	Consulting: ['Revenue', 'Utilization Rate', 'Client Satisfaction', 'Project Margin', 'Win Rate'],
	Marketing: ['Lead Generation', 'Conversion Rate', 'ROI', 'Engagement Rate', 'Brand Awareness'],
	Design: ['Project Completion', 'Client Satisfaction', 'Design Quality Score', 'Iteration Cycle'],
	'Retail HQ': ['Revenue', 'Inventory Turnover', 'Margin', 'Same-Store Sales', 'Customer Satisfaction'],
	Logistics: ['On-Time Delivery', 'Cost per Shipment', 'Inventory Accuracy', 'Order Fulfillment Rate'],
	Manufacturing: ['Production Output', 'Quality Rate', 'Downtime', 'On-Time Delivery', 'Cost per Unit'],
	Healthcare: ['Patient Satisfaction', 'Wait Time', 'Treatment Success Rate', 'Cost per Patient'],
	Public: ['Service Delivery Time', 'Citizen Satisfaction', 'Budget Utilization', 'Compliance Rate'],
	Education: ['Student Satisfaction', 'Graduation Rate', 'Enrollment', 'Faculty Retention'],
	Other: ['Revenue', 'Customer Satisfaction', 'Cost Efficiency', 'On-Time Delivery'],
};

export const OUTPUT_TYPES = [
	'Report',
	'Code/Release',
	'Design Artifact',
	'Campaign',
	'Ticket',
	'Document',
	'Presentation',
	'Analysis',
];

export const POLICY_DSL_EXAMPLE = `rule: auto_approve_low_risk
when:
  kpi.impact <= 'low'
  risk.score < 0.2
then:
  decision: 'approve'
  escalate_if: 'missing_evidence'
explain: true`;

