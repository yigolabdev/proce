import { z } from 'zod';

export const CompanyProfileSchema = z.object({
	name: z.string().optional(),
	regNo: z.string().optional(),
	website: z.string().optional(),
	industry: z.enum([
		'IT/SaaS',
		'Consulting',
		'Marketing',
		'Design',
		'Retail HQ',
		'Logistics',
		'Manufacturing',
		'Healthcare',
		'Public',
		'Education',
		'Other',
	]).optional(),
	size: z.enum(['<50', '50-200', '200-500', '500-2k', '2k+']).optional(),
	hqCountry: z.string().optional(),
	hqCity: z.string().optional(),
	emailDomain: z.string().optional(),
});

export const OrgSetupSchema = z.object({
	departments: z.array(z.string()).optional(),
	roleModel: z.enum(['role', 'title']).optional(),
	aliasPolicy: z.boolean().optional(),
	leads: z
		.array(
			z.object({
				alias: z.string().optional(),
				dept: z.string().optional(),
			})
		)
		.optional(),
});

export const JobKpiSchema = z.object({
	jobCategories: z.array(z.string()).optional(),
	kpis: z.array(z.string()).optional(),
	outputTypes: z.array(z.string()).optional(),
	decisionMode: z.enum(['hybrid', 'ai', 'human']).optional(),
});

export const IntegrationsSchema = z
	.object({
		connectors: z
			.array(
				z.object({
					provider: z.enum(['slack', 'notion', 'jira', 'gdrive']),
					status: z.enum(['idle', 'connecting', 'connected', 'error']),
				})
			)
			.optional(),
		importWindowDays: z.enum(['30', '60', '90']).optional(),
		consent: z.boolean().optional(),
	})
	.optional();

export const PoliciesSchema = z.object({
	template: z.enum(['conservative', 'balanced', 'progressive']).optional(),
	requireEvidence: z.boolean().optional(),
	showConfidence: z.boolean().optional(),
	auditLogging: z.boolean().optional(),
});

export const OnboardingSchema = z.object({
	company: CompanyProfileSchema.optional(),
	org: OrgSetupSchema.optional(),
	jobkpi: JobKpiSchema.optional(),
	integrations: IntegrationsSchema.optional(),
	policies: PoliciesSchema.optional(),
});

export type OnboardingSchemaType = z.infer<typeof OnboardingSchema>;

