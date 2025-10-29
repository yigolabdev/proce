export type Industry =
	| 'IT/SaaS'
	| 'Consulting'
	| 'Marketing'
	| 'Design'
	| 'Retail HQ'
	| 'Logistics'
	| 'Manufacturing'
	| 'Healthcare'
	| 'Public'
	| 'Education'
	| 'Other';

export type CompanySize = '<50' | '50-200' | '200-500' | '500-2k' | '2k+';

export type RoleModel = 'role' | 'title';

export type DecisionMode = 'hybrid' | 'ai' | 'human';

export type PolicyTemplate = 'conservative' | 'balanced' | 'progressive';

export type IntegrationProvider = 'slack' | 'notion' | 'jira' | 'gdrive';

export type ImportWindow = '30' | '60' | '90';

export interface CompanyProfile {
	name?: string;
	regNo?: string;
	website?: string;
	industry?: Industry;
	size?: CompanySize;
	hqCountry?: string;
	hqCity?: string;
	emailDomain?: string;
}

export interface TeamLead {
	alias?: string;
	dept?: string;
}

export interface OrgSetup {
	departments?: string[];
	roleModel?: RoleModel;
	aliasPolicy?: boolean;
	leads?: TeamLead[];
}

export interface JobKpi {
	jobCategories?: string[];
	kpis?: string[];
	outputTypes?: string[];
	decisionMode?: DecisionMode;
}

export interface IntegrationConnector {
	provider: IntegrationProvider;
	status: 'idle' | 'connecting' | 'connected' | 'error';
}

export interface Integrations {
	connectors?: IntegrationConnector[];
	importWindowDays?: ImportWindow;
	consent?: boolean;
}

export interface Policies {
	template?: PolicyTemplate;
	requireEvidence?: boolean;
	showConfidence?: boolean;
	auditLogging?: boolean;
}

export interface OnboardingData {
	company?: CompanyProfile;
	org?: OrgSetup;
	jobkpi?: JobKpi;
	integrations?: Integrations;
	policies?: Policies;
}

export interface CreateWorkspaceResult {
	ok: boolean;
	workspaceId?: string;
	error?: 'DUPLICATE_DOMAIN' | 'NETWORK' | 'VALIDATION';
}

