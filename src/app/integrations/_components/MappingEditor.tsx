import type { EntityMapping } from '../_types/integrations.types';
import { useI18n } from '../../../i18n/I18nProvider';
import { integrationsI18n } from '../_i18n/integrations.i18n';
import { useMemo } from 'react';

interface MappingEditorProps {
	mappings: EntityMapping[];
	onChange: (mappings: EntityMapping[]) => void;
}

export default function MappingEditor({ mappings }: MappingEditorProps) {
	const { locale } = useI18n();
	const tt = useMemo(() => integrationsI18n[locale], [locale]);

	return (
		<div className="space-y-2">
			<div className="grid grid-cols-3 gap-4 text-sm font-medium text-neutral-400 pb-2 border-b border-neutral-800">
				<div>{tt.mapping.source}</div>
				<div>{tt.mapping.target}</div>
				<div>{tt.mapping.signal}</div>
			</div>
			{mappings.map((mapping, index) => (
				<div
					key={index}
					className="grid grid-cols-3 gap-4 text-sm py-2 border-b border-neutral-900"
				>
					<div className="font-medium">{mapping.source}</div>
					<div className="text-primary">{mapping.target}</div>
					<div className="text-neutral-400">{mapping.signal || '—'}</div>
				</div>
			))}
		</div>
	);
}

