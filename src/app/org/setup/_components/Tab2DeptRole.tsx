import { useState } from 'react';
import { useLocale } from '../../../../i18n/I18nProvider';
import { settingsI18n } from '../_i18n/settings.i18n';
import type { DeptRoleSettings, Department } from '../_types/settings.types';
import { Card } from '../../../../components/ui/Card';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';
import { X, Plus, Check } from 'lucide-react';

interface Tab2Props {
	data: DeptRoleSettings;
	onChange: (data: DeptRoleSettings) => void;
	errors?: Record<string, string>;
}

export default function Tab2DeptRole({ data, onChange, errors = {} }: Tab2Props) {
	const { locale } = useLocale();
	const t = settingsI18n[locale].deptRole;
	const [newDeptName, setNewDeptName] = useState('');

	const addDepartment = () => {
		if (!newDeptName.trim()) return;
		const newDept: Department = {
			id: Date.now().toString(),
			name: newDeptName.trim(),
			isDefaultIntake: data.departments.length === 0,
		};
		onChange({
			...data,
			departments: [...data.departments, newDept],
		});
		setNewDeptName('');
	};

	const removeDepartment = (id: string) => {
		const filtered = data.departments.filter((d) => d.id !== id);
		// If removing default, make first one default
		if (filtered.length > 0 && !filtered.some((d) => d.isDefaultIntake)) {
			filtered[0].isDefaultIntake = true;
		}
		onChange({ ...data, departments: filtered });
	};

	const setDefaultIntake = (id: string) => {
		onChange({
			...data,
			departments: data.departments.map((d) => ({
				...d,
				isDefaultIntake: d.id === id,
			})),
		});
	};

	const updateManagerScope = (scope: 'org' | 'team') => {
		onChange({
			...data,
			roles: {
				...data.roles,
				manager: { ...data.roles.manager, scope },
			},
		});
	};

	return (
		<div className="space-y-6">
			{/* Departments */}
			<Card className="p-6">
				<h3 className="text-lg font-bold mb-4">{t.departments}</h3>

				<div className="space-y-2 mb-4">
					{data.departments.map((dept) => (
						<div
							key={dept.id}
							className="flex items-center justify-between rounded-2xl border border-neutral-200 dark:border-neutral-800 p-3"
						>
							<div className="flex items-center gap-3">
								<button
									type="button"
									onClick={() => setDefaultIntake(dept.id)}
									className={`rounded-full p-1 transition ${
										dept.isDefaultIntake
											? 'bg-primary text-white'
											: 'border border-neutral-300 dark:border-neutral-700 hover:border-primary'
									}`}
									title={t.defaultIntake}
								>
									<Check className="h-3 w-3" />
								</button>
								<span className="font-medium">{dept.name}</span>
								{dept.isDefaultIntake && (
									<span className="text-xs text-neutral-500">({t.defaultIntake})</span>
								)}
							</div>
							<button
								type="button"
								onClick={() => removeDepartment(dept.id)}
								className="rounded-full p-1 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600"
								disabled={data.departments.length === 1}
							>
								<X className="h-4 w-4" />
							</button>
						</div>
					))}
				</div>

				<div className="flex gap-2">
					<Input
						value={newDeptName}
						onChange={(e) => setNewDeptName(e.target.value)}
						placeholder="새 부서 이름"
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								e.preventDefault();
								addDepartment();
							}
						}}
					/>
					<Button type="button" onClick={addDepartment}>
						<Plus className="h-4 w-4 mr-1" />
						{t.addDept}
					</Button>
				</div>

				{errors.departments && (
					<p className="mt-2 text-sm text-red-600" role="alert">
						{errors.departments}
					</p>
				)}
			</Card>

			{/* Roles */}
			<Card className="p-6">
				<h3 className="text-lg font-bold mb-4">{t.roles}</h3>

				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-neutral-200 dark:border-neutral-800">
								<th className="text-left py-2 px-3">{t.roleName}</th>
								<th className="text-center py-2 px-3">{t.canCreateIssue}</th>
								<th className="text-center py-2 px-3">{t.canApprove}</th>
								<th className="text-center py-2 px-3">{t.canEditPolicy}</th>
								<th className="text-center py-2 px-3">{t.canViewAudit}</th>
								<th className="text-center py-2 px-3">{t.scope}</th>
							</tr>
						</thead>
						<tbody>
							{/* Admin */}
							<tr className="border-b border-neutral-200 dark:border-neutral-800">
								<td className="py-3 px-3 font-medium">{t.admin}</td>
								<td className="text-center py-3 px-3">
									<Check className="h-4 w-4 mx-auto text-green-600" />
								</td>
								<td className="text-center py-3 px-3">
									<Check className="h-4 w-4 mx-auto text-green-600" />
								</td>
								<td className="text-center py-3 px-3">
									<Check className="h-4 w-4 mx-auto text-green-600" />
								</td>
								<td className="text-center py-3 px-3">
									<Check className="h-4 w-4 mx-auto text-green-600" />
								</td>
								<td className="text-center py-3 px-3">
									<span className="inline-block rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-xs">
										{t.scopeOrg}
									</span>
								</td>
							</tr>

							{/* Manager */}
							<tr className="border-b border-neutral-200 dark:border-neutral-800">
								<td className="py-3 px-3 font-medium">{t.manager}</td>
								<td className="text-center py-3 px-3">
									<Check className="h-4 w-4 mx-auto text-green-600" />
								</td>
								<td className="text-center py-3 px-3">
									<Check className="h-4 w-4 mx-auto text-green-600" />
								</td>
								<td className="text-center py-3 px-3">
									<X className="h-4 w-4 mx-auto text-neutral-400" />
								</td>
								<td className="text-center py-3 px-3">
									<Check className="h-4 w-4 mx-auto text-green-600" />
								</td>
								<td className="text-center py-3 px-3">
									<div className="flex gap-1 justify-center">
										<button
											type="button"
											onClick={() => updateManagerScope('org')}
											className={`rounded-full px-2 py-0.5 text-xs transition ${
												data.roles.manager.scope === 'org'
													? 'bg-primary text-white'
													: 'border border-neutral-300 dark:border-neutral-700 hover:border-primary'
											}`}
										>
											{t.scopeOrg}
										</button>
										<button
											type="button"
											onClick={() => updateManagerScope('team')}
											className={`rounded-full px-2 py-0.5 text-xs transition ${
												data.roles.manager.scope === 'team'
													? 'bg-primary text-white'
													: 'border border-neutral-300 dark:border-neutral-700 hover:border-primary'
											}`}
										>
											{t.scopeTeam}
										</button>
									</div>
								</td>
							</tr>

							{/* Member */}
							<tr>
								<td className="py-3 px-3 font-medium">{t.member}</td>
								<td className="text-center py-3 px-3">
									<Check className="h-4 w-4 mx-auto text-green-600" />
								</td>
								<td className="text-center py-3 px-3">
									<X className="h-4 w-4 mx-auto text-neutral-400" />
								</td>
								<td className="text-center py-3 px-3">
									<X className="h-4 w-4 mx-auto text-neutral-400" />
								</td>
								<td className="text-center py-3 px-3">
									<X className="h-4 w-4 mx-auto text-neutral-400" />
								</td>
								<td className="text-center py-3 px-3">
									<span className="inline-block rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-xs">
										{t.scopeSelf}
									</span>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</Card>
		</div>
	);
}

