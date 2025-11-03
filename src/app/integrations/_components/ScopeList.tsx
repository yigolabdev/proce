interface ScopeListProps {
	scopes: string[];
}

export default function ScopeList({ scopes }: ScopeListProps) {
	return (
		<div className="flex flex-wrap gap-2">
			{scopes.map((scope) => (
				<span
					key={scope}
					className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
				>
					{scope}
				</span>
			))}
		</div>
	);
}

