import { useState } from 'react';
import { useLocale } from '../../../../i18n/I18nProvider';
import { settingsI18n } from '../_i18n/settings.i18n';
import type { LocaleSettings, Language } from '../_types/settings.types';
import { Card } from '../../../../components/ui/Card';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';
import { X, Plus } from 'lucide-react';

interface Tab4Props {
	data: LocaleSettings;
	onChange: (data: LocaleSettings) => void;
	errors?: Record<string, string>;
}

export default function Tab4Locale({ data, onChange, errors = {} }: Tab4Props) {
	const { locale } = useLocale();
	const t = settingsI18n[locale].locale;
	const [newHoliday, setNewHoliday] = useState({ name: '', date: '' });

	const toggleDay = (day: number) => {
		const current = data.workingDays;
		const next = current.includes(day) ? current.filter((d) => d !== day) : [...current, day];
		onChange({ ...data, workingDays: next });
	};

	const addHoliday = () => {
		if (!newHoliday.name.trim() || !newHoliday.date) return;
		onChange({
			...data,
			holidays: [...data.holidays, { ...newHoliday }],
		});
		setNewHoliday({ name: '', date: '' });
	};

	const removeHoliday = (index: number) => {
		onChange({
			...data,
			holidays: data.holidays.filter((_, i) => i !== index),
		});
	};

	return (
		<div className="space-y-6">
			<Card className="p-6">
				<div className="space-y-6">
					<div className="grid gap-4 sm:grid-cols-2">
						<div>
							<label className="block text-sm font-medium mb-2">{t.language}</label>
							<select
								value={data.language}
								onChange={(e) => onChange({ ...data, language: e.target.value as Language })}
								className="w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
							>
								<option value="ko">한국어</option>
								<option value="en">English</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium mb-2">{t.timezone}</label>
							<select
								value={data.timezone}
								onChange={(e) => onChange({ ...data, timezone: e.target.value })}
								className="w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
							>
								<option value="Asia/Seoul">Asia/Seoul (KST)</option>
								<option value="America/New_York">America/New_York (EST)</option>
								<option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
								<option value="Europe/London">Europe/London (GMT)</option>
								<option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
							</select>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium mb-2">{t.workingDays}</label>
						<div className="flex flex-wrap gap-2">
							{[1, 2, 3, 4, 5, 6, 0].map((day, index) => (
								<button
									key={day}
									type="button"
									onClick={() => toggleDay(day)}
									className={`rounded-full px-4 py-2 text-sm transition ${
										data.workingDays.includes(day)
											? 'bg-primary text-white'
											: 'border border-neutral-200 dark:border-neutral-800 hover:border-primary'
									}`}
								>
									{t.days[index]}
								</button>
							))}
						</div>
						{errors.workingDays && (
							<p className="mt-2 text-sm text-red-600" role="alert">
								{errors.workingDays}
							</p>
						)}
					</div>

					<div>
						<label className="block text-sm font-medium mb-2">{t.workingHours}</label>
						<div className="grid gap-3 sm:grid-cols-2">
							<div>
								<label className="block text-xs text-neutral-500 mb-1">{t.start}</label>
								<Input
									type="time"
									value={data.workingHours.start}
									onChange={(e) =>
										onChange({
											...data,
											workingHours: { ...data.workingHours, start: e.target.value },
										})
									}
								/>
							</div>
							<div>
								<label className="block text-xs text-neutral-500 mb-1">{t.end}</label>
								<Input
									type="time"
									value={data.workingHours.end}
									onChange={(e) =>
										onChange({
											...data,
											workingHours: { ...data.workingHours, end: e.target.value },
										})
									}
								/>
							</div>
						</div>
						{errors.workingHours && (
							<p className="mt-2 text-sm text-red-600" role="alert">
								{errors.workingHours}
							</p>
						)}
					</div>
				</div>
			</Card>

			<Card className="p-6">
				<h3 className="text-sm font-medium mb-3">{t.holidays}</h3>
				<div className="space-y-2 mb-4">
					{data.holidays.map((holiday, index) => (
						<div
							key={index}
							className="flex items-center justify-between rounded-2xl border border-neutral-200 dark:border-neutral-800 p-3"
						>
							<div>
								<span className="font-medium">{holiday.name}</span>
								<span className="ml-2 text-sm text-neutral-500">{holiday.date}</span>
							</div>
							<button
								type="button"
								onClick={() => removeHoliday(index)}
								className="rounded-full p-1 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600"
							>
								<X className="h-4 w-4" />
							</button>
						</div>
					))}
				</div>

				<div className="grid gap-2 sm:grid-cols-[1fr,auto,auto]">
					<Input
						value={newHoliday.name}
						onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
						placeholder={t.holidayName}
					/>
					<Input
						type="date"
						value={newHoliday.date}
						onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
					/>
					<Button type="button" onClick={addHoliday}>
						<Plus className="h-4 w-4" />
					</Button>
				</div>
			</Card>

			<Card className="p-6">
				<h3 className="text-sm font-medium mb-3">
					{t.quietHours} {t.quietHoursOptional}
				</h3>
				<div className="grid gap-3 sm:grid-cols-2">
					<div>
						<label className="block text-xs text-neutral-500 mb-1">{t.start}</label>
						<Input
							type="time"
							value={data.quietHours?.start || ''}
							onChange={(e) =>
								onChange({
									...data,
									quietHours: { ...data.quietHours, start: e.target.value, end: data.quietHours?.end || '' },
								})
							}
						/>
					</div>
					<div>
						<label className="block text-xs text-neutral-500 mb-1">{t.end}</label>
						<Input
							type="time"
							value={data.quietHours?.end || ''}
							onChange={(e) =>
								onChange({
									...data,
									quietHours: { start: data.quietHours?.start || '', end: e.target.value },
								})
							}
						/>
					</div>
				</div>
			</Card>
		</div>
	);
}

