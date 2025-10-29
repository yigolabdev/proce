export type Connector = 'slack' | 'notion' | 'jira' | 'gdrive' | 'github' | 'gcal';
export type Status = 'disconnected' | 'connected' | 'error';
export type EntityTarget = 'Discussion' | 'Artifact' | 'Task' | 'Attachment';
export type SyncFrequency = '15m' | '1h' | '6h' | '24h';
export type ImportWindow = '30' | '60' | '90';

export interface EntityMapping {
	source: string;
	target: EntityTarget;
	signal?: string;
}

export interface BaseIntegrationSettings {
	status: Status;
	windowDays: ImportWindow;
	autoSync: boolean;
	frequency?: SyncFrequency;
	piiMask: boolean;
	mapping: EntityMapping[];
	connectedAt?: string;
	lastTested?: string;
	token?: string;
}

export interface SlackSettings extends BaseIntegrationSettings {
	channels?: string[];
	includePrivate: boolean;
}

export interface NotionSettings extends BaseIntegrationSettings {
	databases?: string[];
	includeComments: boolean;
}

export interface JiraSettings extends BaseIntegrationSettings {
	projects?: string[];
	statuses?: Array<'todo' | 'inprogress' | 'done'>;
}

export interface DriveSettings extends BaseIntegrationSettings {
	folders?: string[];
	fileTypes?: Array<'doc' | 'pdf' | 'sheet' | 'presentation'>;
}

export type IntegrationSettings = SlackSettings | NotionSettings | JiraSettings | DriveSettings;

export interface ConnectorInfo {
	id: Connector;
	name: string;
	description: string;
	logo: string;
	scopes: string[];
	dataCollected: string[];
	usedFor: string[];
	isAvailable: boolean;
}

export interface PreviewItem {
	id: string;
	title: string;
	date: string;
	source: string;
	mapped: EntityTarget;
	confidence: number;
}

export interface OAuthResult {
	ok: boolean;
	authUrl?: string;
	token?: string;
	error?: 'OAUTH_DENIED' | 'NETWORK';
}

export interface TestResult {
	ok: boolean;
	error?: 'AUTH' | 'RATE_LIMIT' | 'NETWORK';
}

