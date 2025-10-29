import type {
	Connector,
	OAuthResult,
	TestResult,
	PreviewItem,
	IntegrationSettings,
	ImportWindow,
} from '../_types/integrations.types';

const STORAGE_KEY = 'proce.integrations';
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock connector metadata
export const CONNECTOR_INFO = {
	slack: {
		id: 'slack' as Connector,
		name: 'Slack',
		description: 'Sync messages, threads, and files from Slack channels',
		logo: '💬',
		scopes: ['channels:history', 'chat:write', 'files:read', 'users:read'],
		dataCollected: ['Messages', 'Threads', 'Files', 'User profiles', 'Channel metadata'],
		usedFor: ['Agenda extraction', 'Discussion threads', 'Evidence links', 'Team insights'],
		isAvailable: true,
	},
	notion: {
		id: 'notion' as Connector,
		name: 'Notion',
		description: 'Import pages, databases, and comments from Notion',
		logo: '📝',
		scopes: ['databases:read', 'pages:read', 'comments:read'],
		dataCollected: ['Pages', 'Databases', 'Comments', 'Properties'],
		usedFor: ['Artifact tracking', 'Knowledge base', 'Project documentation'],
		isAvailable: true,
	},
	jira: {
		id: 'jira' as Connector,
		name: 'Jira',
		description: 'Sync issues, projects, and status updates from Jira',
		logo: '🎯',
		scopes: ['read:jira-work', 'read:issue:jira', 'offline_access'],
		dataCollected: ['Issues', 'Projects', 'Status updates', 'Comments', 'Attachments'],
		usedFor: ['Task tracking', 'Evidence for decisions', 'KPI normalization'],
		isAvailable: true,
	},
	gdrive: {
		id: 'gdrive' as Connector,
		name: 'Google Drive',
		description: 'Access files, folders, and metadata from Google Drive',
		logo: '📁',
		scopes: ['drive.readonly'],
		dataCollected: ['Files', 'Folders', 'Metadata', 'Comments'],
		usedFor: ['Attachment links', 'Document evidence', 'Collaboration tracking'],
		isAvailable: true,
	},
	github: {
		id: 'github' as Connector,
		name: 'GitHub',
		description: 'Coming soon - Sync repos, issues, and pull requests',
		logo: '🐙',
		scopes: ['repo', 'read:org'],
		dataCollected: ['Repositories', 'Issues', 'Pull requests', 'Commits'],
		usedFor: ['Code activity', 'Development metrics', 'Release tracking'],
		isAvailable: false,
	},
	gcal: {
		id: 'gcal' as Connector,
		name: 'Google Calendar',
		description: 'Coming soon - Import events and meeting data',
		logo: '📅',
		scopes: ['calendar.readonly'],
		dataCollected: ['Events', 'Meeting attendees', 'Time blocks'],
		usedFor: ['Meeting analytics', 'Time allocation', 'Availability tracking'],
		isAvailable: false,
	},
};

// Mock OAuth flow
export async function oauthStart(connector: Connector): Promise<OAuthResult> {
	await sleep(500);
	return {
		ok: true,
		authUrl: `https://mock-oauth.example.com/${connector}`,
	};
}

export async function oauthCallback(connector: Connector, _code?: string): Promise<OAuthResult> {
	await sleep(1000);
	// 90% success rate
	const success = Math.random() > 0.1;
	if (success) {
		return {
			ok: true,
			token: `mock_token_${connector}_${Date.now()}`,
		};
	}
	return {
		ok: false,
		error: Math.random() > 0.5 ? 'OAUTH_DENIED' : 'NETWORK',
	};
}

export async function disconnect(connector: Connector): Promise<{ ok: true }> {
	await sleep(300);
	const integrations = loadIntegrationsSync();
	if (integrations[connector]) {
		integrations[connector].status = 'disconnected';
		integrations[connector].token = undefined;
		integrations[connector].connectedAt = undefined;
		localStorage.setItem(STORAGE_KEY, JSON.stringify(integrations));
	}
	return { ok: true };
}

export async function testConnection(connector: Connector): Promise<TestResult> {
	await sleep(800);
	const integrations = loadIntegrationsSync();
	const settings = integrations[connector];

	if (!settings || settings.status !== 'connected') {
		return { ok: false, error: 'AUTH' };
	}

	// 85% success rate
	const rand = Math.random();
	if (rand > 0.85) {
		return { ok: false, error: rand > 0.92 ? 'RATE_LIMIT' : 'NETWORK' };
	}

	// Update last tested
	integrations[connector].lastTested = new Date().toISOString();
	localStorage.setItem(STORAGE_KEY, JSON.stringify(integrations));

	return { ok: true };
}

export async function getPreview(
	connector: Connector,
	_opts: { windowDays: ImportWindow }
): Promise<PreviewItem[]> {
	await sleep(1200);

	const mockData: Record<Connector, PreviewItem[]> = {
		slack: [
			{
				id: '1',
				title: 'Q4 Planning Discussion',
				date: '2024-01-15T10:30:00Z',
				source: '#product-team',
				mapped: 'Discussion',
				confidence: 0.92,
			},
			{
				id: '2',
				title: 'Design feedback thread',
				date: '2024-01-14T14:20:00Z',
				source: '#design',
				mapped: 'Discussion',
				confidence: 0.88,
			},
			{
				id: '3',
				title: 'API documentation.pdf',
				date: '2024-01-13T09:15:00Z',
				source: '#engineering',
				mapped: 'Attachment',
				confidence: 0.95,
			},
		],
		notion: [
			{
				id: '4',
				title: 'Product Roadmap 2024',
				date: '2024-01-16T11:00:00Z',
				source: 'Product Database',
				mapped: 'Artifact',
				confidence: 0.94,
			},
			{
				id: '5',
				title: 'Sprint Retrospective',
				date: '2024-01-15T16:30:00Z',
				source: 'Team Wiki',
				mapped: 'Artifact',
				confidence: 0.89,
			},
		],
		jira: [
			{
				id: '6',
				title: 'PROJ-123: Implement user authentication',
				date: '2024-01-17T08:45:00Z',
				source: 'Engineering Project',
				mapped: 'Task',
				confidence: 0.97,
			},
			{
				id: '7',
				title: 'PROJ-124: Design system updates',
				date: '2024-01-16T13:20:00Z',
				source: 'Design Project',
				mapped: 'Task',
				confidence: 0.91,
			},
		],
		gdrive: [
			{
				id: '8',
				title: 'Q1 Budget Proposal.xlsx',
				date: '2024-01-18T10:00:00Z',
				source: 'Finance Folder',
				mapped: 'Attachment',
				confidence: 0.93,
			},
			{
				id: '9',
				title: 'Marketing Strategy.pptx',
				date: '2024-01-17T15:30:00Z',
				source: 'Marketing Folder',
				mapped: 'Attachment',
				confidence: 0.90,
			},
		],
		github: [],
		gcal: [],
	};

	return mockData[connector] || [];
}

export async function saveIntegration(
	connector: Connector,
	payload: Partial<IntegrationSettings>
): Promise<{ ok: true; savedAt: string }> {
	await sleep(500);
	const integrations = loadIntegrationsSync();
	integrations[connector] = {
		...integrations[connector],
		...payload,
	} as IntegrationSettings;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(integrations));
	return { ok: true, savedAt: new Date().toISOString() };
}

export async function loadIntegrations(): Promise<Record<string, IntegrationSettings>> {
	await sleep(200);
	return loadIntegrationsSync();
}

function loadIntegrationsSync(): Record<string, IntegrationSettings> {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : {};
	} catch {
		return {};
	}
}

export function getDefaultSettings(connector: Connector): IntegrationSettings {
	const base = {
		status: 'disconnected' as const,
		windowDays: '60' as ImportWindow,
		autoSync: false,
		frequency: '1h' as const,
		piiMask: true,
		mapping: [],
	};

	switch (connector) {
		case 'slack':
			return {
				...base,
				channels: [],
				includePrivate: false,
				mapping: [
					{ source: 'Thread', target: 'Discussion' },
					{ source: 'File', target: 'Attachment' },
				],
			};
		case 'notion':
			return {
				...base,
				databases: [],
				includeComments: true,
				mapping: [{ source: 'Page', target: 'Artifact' }],
			};
		case 'jira':
			return {
				...base,
				projects: [],
				statuses: ['todo', 'inprogress', 'done'],
				mapping: [
					{ source: 'Issue', target: 'Task' },
					{ source: 'Done Issue', target: 'Task', signal: 'evidence' },
				],
			};
		case 'gdrive':
			return {
				...base,
				folders: [],
				fileTypes: ['doc', 'pdf', 'sheet', 'presentation'],
				mapping: [{ source: 'File', target: 'Attachment' }],
			};
		default:
			return base as IntegrationSettings;
	}
}

