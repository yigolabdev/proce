import type { WorkspaceSettings } from '../_types/settings.types';

const STORAGE_KEY = 'proce.settings';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function loadSettings(): Promise<WorkspaceSettings | null> {
	await sleep(300);
	const raw = localStorage.getItem(STORAGE_KEY);
	return raw ? JSON.parse(raw) : null;
}

export async function saveSettings(payload: WorkspaceSettings): Promise<{ ok: true }> {
	await sleep(500);
	localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
	return { ok: true };
}

export function getDefaultSettings(): WorkspaceSettings {
	return {
		org: {
			workspaceName: 'My Workspace',
			legalName: '',
			emailDomains: ['example.com'],
			industry: 'IT/SaaS',
			description: '',
			adminContact: 'admin@example.com',
			fromOnboarding: false,
		},
		deptRole: {
			departments: [
				{ id: '1', name: 'Engineering', isDefaultIntake: true },
				{ id: '2', name: 'Product', isDefaultIntake: false },
				{ id: '3', name: 'Design', isDefaultIntake: false },
			],
			roles: {
				admin: {
					canCreateIssue: true,
					canApprove: true,
					canEditPolicy: true,
					canViewAudit: true,
					scope: 'org',
				},
				manager: {
					canCreateIssue: true,
					canApprove: true,
					canEditPolicy: false,
					canViewAudit: true,
					scope: 'team',
				},
				member: {
					canCreateIssue: true,
					canApprove: false,
					canEditPolicy: false,
					canViewAudit: false,
					scope: 'self',
				},
			},
		},
		alias: {
			enabled: true,
			format: 'alias-numeric',
			maskRealNames: true,
			guardrails: ['hide-title', 'neutral-labels'],
		},
		locale: {
			language: 'ko',
			timezone: 'Asia/Seoul',
			workingDays: [1, 2, 3, 4, 5],
			workingHours: {
				start: '09:00',
				end: '18:00',
			},
			holidays: [],
			quietHours: {
				start: '22:00',
				end: '08:00',
			},
		},
		privacy: {
			retention: {
				activityMonths: '12',
				attachmentMonths: '12',
			},
			exportControls: {
				selfExport: true,
				selfDeleteRequest: true,
			},
			pii: {
				hasPII: false,
			},
			auditVisibility: 'admin',
		},
		decision: {
			mode: 'hybrid',
			requireEvidence: true,
			showConfidence: true,
			autoApproveLowRisk: false,
			escalationWindow: '24h',
		},
	};
}

