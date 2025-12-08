import type { PreviewItem } from '../_types/integrations.types';
import { useI18n } from '../../../i18n/I18nProvider';
import { integrationsI18n } from '../_i18n/integrations.i18n';
import { useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ko, enUS } from 'date-fns/locale';

interface SyncPreviewProps {
	items: PreviewItem[];
	isLoading: boolean;
	piiMask: boolean;
}

function maskEmail(email: string): string {
	const [local, domain] = email.split('@');
	if (!domain) return email;
	return `${local.slice(0, 2)}****@${domain}`;
}

function maskTitle(title: string, piiMask: boolean): string {
	if (!piiMask) return title;
	// Simple PII masking: replace email-like patterns
	return title.replace(/[\w.-]+@[\w.-]+\.\w+/g, (email) => maskEmail(email));
}

export default function SyncPreview({ items, isLoading, piiMask }: SyncPreviewProps) {
	const { locale } = useI18n();
	const tt = useMemo(() => integrationsI18n[locale], [locale]);

	const dateLocale = locale === 'ko' ? ko : enUS;

	if (isLoading) {
		return (
			<div className="space-y-3">
				{[...Array(5)].map((_, i) => (
					<div key={i} className="animate-pulse">
						<div className="h-4 bg-neutral-800 rounded w-3/4 mb-2" />
						<div className="h-3 bg-neutral-900 rounded w-1/2" />
					</div>
				))}
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className="text-center py-8 text-neutral-400 text-sm">
				{tt.test.noData}
			</div>
		);
	}

	return (
		<div className="space-y-3">
			{items.map((item) => (
				<div
					key={item.id}
					className="rounded-2xl border border-neutral-900 p-3 hover:hover:bg-neutral-900/50 transition-colors"
				>
					<div className="flex items-start justify-between gap-3">
						<div className="flex-1 min-w-0">
							<h5 className="font-medium text-sm truncate">{maskTitle(item.title, piiMask)}</h5>
							<div className="flex items-center gap-2 mt-1 text-xs text-neutral-400">
								<span>{item.source}</span>
								<span>•</span>
								<span>{formatDistanceToNow(new Date(item.date), { addSuffix: true, locale: dateLocale })}</span>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
								{item.mapped}
							</span>
							<span className="inline-block rounded-full bg-neutral-800 px-2 py-0.5 text-xs text-neutral-400">
								{Math.round(item.confidence * 100)}%
							</span>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

