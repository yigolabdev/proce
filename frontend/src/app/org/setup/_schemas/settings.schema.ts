import { z } from 'zod';

export const OrgSchema = z.object({
	workspaceName: z.string().min(2, '워크스페이스 이름은 최소 2자 이상이어야 합니다'),
	legalName: z.string().optional(),
	emailDomains: z.array(z.string().min(3)).min(1, '최소 1개의 이메일 도메인이 필요합니다'),
	industry: z.string().min(2),
	description: z.string().optional(),
	adminContact: z.string().email('올바른 이메일 주소를 입력하세요'),
	fromOnboarding: z.boolean().optional(),
});

export const DeptRoleSchema = z.object({
	departments: z
		.array(
			z.object({
				id: z.string(),
				name: z.string().min(2),
				isDefaultIntake: z.boolean(),
			})
		)
		.min(1, '최소 1개의 부서가 필요합니다')
		.refine(
			(list) => list.filter((d) => d.isDefaultIntake).length === 1,
			'정확히 1개의 기본 접수 부서를 선택하세요'
		),
	roles: z.object({
		admin: z.object({
			canCreateIssue: z.boolean(),
			canApprove: z.boolean(),
			canEditPolicy: z.boolean(),
			canViewAudit: z.boolean(),
			scope: z.literal('org'),
		}),
		manager: z.object({
			canCreateIssue: z.boolean(),
			canApprove: z.boolean(),
			canEditPolicy: z.boolean(),
			canViewAudit: z.boolean(),
			scope: z.enum(['org', 'team']),
		}),
		member: z.object({
			canCreateIssue: z.boolean(),
			canApprove: z.boolean(),
			canEditPolicy: z.boolean(),
			canViewAudit: z.boolean(),
			scope: z.literal('self'),
		}),
	}),
});

export const AliasSchema = z.object({
	enabled: z.boolean(),
	format: z.enum(['alias-numeric', 'nova-numeric', 'word-word']),
	maskRealNames: z.boolean(),
	guardrails: z.array(z.string()).optional(),
});

export const LocaleSchema = z.object({
	language: z.enum(['en', 'ko']),
	timezone: z.string(),
	workingDays: z.array(z.number()).min(1, '최소 1개의 근무일이 필요합니다'),
	workingHours: z
		.object({ start: z.string(), end: z.string() })
		.refine((v) => v.start < v.end, '시작 시간은 종료 시간보다 빨라야 합니다'),
	holidays: z.array(z.object({ name: z.string(), date: z.string() })),
	quietHours: z.object({ start: z.string(), end: z.string() }).optional(),
});

export const PrivacySchema = z.object({
	retention: z.object({
		activityMonths: z.enum(['3', '6', '12', '24']),
		attachmentMonths: z.enum(['3', '6', '12', '24']),
	}),
	exportControls: z.object({ selfExport: z.boolean(), selfDeleteRequest: z.boolean() }),
	pii: z.object({ hasPII: z.boolean() }),
	auditVisibility: z.enum(['admin', 'admin-manager']),
});

export const DecisionDefaultsSchema = z.object({
	mode: z.enum(['hybrid', 'ai', 'human']),
	requireEvidence: z.boolean(),
	showConfidence: z.boolean(),
	autoApproveLowRisk: z.boolean(),
	escalationWindow: z.enum(['4h', '8h', '24h']),
});

export const WorkspaceSettingsSchema = z.object({
	org: OrgSchema,
	deptRole: DeptRoleSchema,
	alias: AliasSchema,
	locale: LocaleSchema,
	privacy: PrivacySchema,
	decision: DecisionDefaultsSchema,
});

