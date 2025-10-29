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

export type AliasFormat = 'alias-numeric' | 'nova-numeric' | 'word-word';
export type DecisionMode = 'hybrid' | 'ai' | 'human';
export type RoleScope = 'org' | 'team' | 'self';
export type AuditVisibility = 'admin' | 'admin-manager';
export type RetentionPeriod = '3' | '6' | '12' | '24';
export type EscalationWindow = '4h' | '8h' | '24h';
export type Language = 'en' | 'ko';

export interface OrgSettings {
	workspaceName: string;
	legalName?: string;
	emailDomains: string[];
	industry: Industry;
	description?: string;
	adminContact: string;
	fromOnboarding?: boolean;
}

export interface Department {
	id: string;
	name: string;
	isDefaultIntake: boolean;
}

export interface RolePermissions {
	canCreateIssue: boolean;
	canApprove: boolean;
	canEditPolicy: boolean;
	canViewAudit: boolean;
	scope: RoleScope;
}

export interface DeptRoleSettings {
	departments: Department[];
	roles: {
		admin: RolePermissions;
		manager: RolePermissions;
		member: RolePermissions;
	};
}

export interface AliasSettings {
	enabled: boolean;
	format: AliasFormat;
	maskRealNames: boolean;
	guardrails: string[];
}

export interface Holiday {
	name: string;
	date: string;
}

export interface LocaleSettings {
	language: Language;
	timezone: string;
	workingDays: number[];
	workingHours: {
		start: string;
		end: string;
	};
	holidays: Holiday[];
	quietHours?: {
		start: string;
		end: string;
	};
}

export interface PrivacySettings {
	retention: {
		activityMonths: RetentionPeriod;
		attachmentMonths: RetentionPeriod;
	};
	exportControls: {
		selfExport: boolean;
		selfDeleteRequest: boolean;
	};
	pii: {
		hasPII: boolean;
	};
	auditVisibility: AuditVisibility;
}

export interface DecisionDefaultsSettings {
	mode: DecisionMode;
	requireEvidence: boolean;
	showConfidence: boolean;
	autoApproveLowRisk: boolean;
	escalationWindow: EscalationWindow;
}

export interface WorkspaceSettings {
	org: OrgSettings;
	deptRole: DeptRoleSettings;
	alias: AliasSettings;
	locale: LocaleSettings;
	privacy: PrivacySettings;
	decision: DecisionDefaultsSettings;
}

