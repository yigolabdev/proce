import { z } from 'zod';

const BaseSettings = z.object({
	status: z.enum(['disconnected', 'connected', 'error']),
	windowDays: z.enum(['30', '60', '90']),
	autoSync: z.boolean(),
	frequency: z.enum(['15m', '1h', '6h', '24h']).optional(),
	piiMask: z.boolean(),
	mapping: z.array(
		z.object({
			source: z.string(),
			target: z.enum(['Discussion', 'Artifact', 'Task', 'Attachment']),
			signal: z.string().optional(),
		})
	),
	connectedAt: z.string().optional(),
	lastTested: z.string().optional(),
	token: z.string().optional(),
});

export const SlackSettingsSchema = BaseSettings.extend({
	channels: z.array(z.string()).optional(),
	includePrivate: z.boolean().default(false),
});

export const NotionSettingsSchema = BaseSettings.extend({
	databases: z.array(z.string()).optional(),
	includeComments: z.boolean().default(true),
});

export const JiraSettingsSchema = BaseSettings.extend({
	projects: z.array(z.string()).optional(),
	statuses: z.array(z.enum(['todo', 'inprogress', 'done'])).optional(),
});

export const DriveSettingsSchema = BaseSettings.extend({
	folders: z.array(z.string()).optional(),
	fileTypes: z.array(z.enum(['doc', 'pdf', 'sheet', 'presentation'])).optional(),
});

export type SlackSettingsType = z.infer<typeof SlackSettingsSchema>;
export type NotionSettingsType = z.infer<typeof NotionSettingsSchema>;
export type JiraSettingsType = z.infer<typeof JiraSettingsSchema>;
export type DriveSettingsType = z.infer<typeof DriveSettingsSchema>;

