import { useState, useEffect } from 'react';
import type { OnboardingData } from '../_types/onboarding.types';
import { useLocale } from '../../../../i18n/I18nProvider';
import { onboardingI18n } from '../_i18n/onboarding.i18n';
import { saveDraft, getDraft } from '../_mocks/onboardingApi';
import Step1CompanyProfile from './steps/Step1CompanyProfile';
import Step2OrgSetup from './steps/Step2OrgSetup';
import Step3JobKpi from './steps/Step3JobKpi';
import Step4Integrations from './steps/Step4Integrations';
import Step5Policies from './steps/Step5Policies';
import Step6Review from './steps/Step6Review';

const TOTAL_STEPS = 6;

export default function OnboardingWizard() {
	const { locale } = useLocale();
	const t = onboardingI18n[locale];

	const [currentStep, setCurrentStep] = useState(0);
	const [data, setData] = useState<OnboardingData>({});
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

	// Load draft on mount
	useEffect(() => {
		const draft = getDraft();
		if (Object.keys(draft).length > 0) {
			setData(draft);
		}
	}, []);

	// Save draft on data change
	useEffect(() => {
		if (hasUnsavedChanges) {
			saveDraft(data);
			setHasUnsavedChanges(false);
		}
	}, [data, hasUnsavedChanges]);

	// Unsaved changes guard
	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (currentStep < TOTAL_STEPS - 1) {
				e.preventDefault();
				e.returnValue = '';
			}
		};
		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => window.removeEventListener('beforeunload', handleBeforeUnload);
	}, [currentStep]);

	const handleNext = (stepData: Partial<OnboardingData>) => {
		setData((prev) => ({ ...prev, ...stepData }));
		setHasUnsavedChanges(true);
		setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
	};

	const handleBack = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 0));
	};

	const handleSkip = () => {
		setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
	};

	const handleEdit = (step: number) => {
		setCurrentStep(step);
	};

	const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;

	return (
		<div className="mx-auto min-h-dvh w-full max-w-3xl px-4 py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold">{t.title}</h1>
				<p className="mt-2 text-neutral-600 dark:text-neutral-300">{t.subtitle}</p>
			</div>

			{/* Progress bar */}
			<div className="mb-6">
				<div className="flex items-center justify-between mb-2">
					{t.steps.map((step, index) => (
						<div
							key={index}
							className={`flex-1 text-center text-xs font-medium ${
								index === currentStep
									? 'text-primary'
									: index < currentStep
									? 'text-green-600 dark:text-green-400'
									: 'text-neutral-400'
							}`}
						>
							{step}
						</div>
					))}
				</div>
				<div className="h-2 w-full rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
					<div
						className="h-full bg-primary transition-all duration-300"
						style={{ width: `${progress}%` }}
						role="progressbar"
						aria-valuenow={progress}
						aria-valuemin={0}
						aria-valuemax={100}
					/>
				</div>
			</div>

			{/* Step content */}
			<div>
				{currentStep === 0 && (
					<Step1CompanyProfile
						data={data.company}
						onNext={(company) => handleNext({ company })}
					/>
				)}
				{currentStep === 1 && (
					<Step2OrgSetup
						data={data.org}
						industry={data.company?.industry}
						onNext={(org) => handleNext({ org })}
						onBack={handleBack}
					/>
				)}
				{currentStep === 2 && (
					<Step3JobKpi
						data={data.jobkpi}
						industry={data.company?.industry}
						onNext={(jobkpi) => handleNext({ jobkpi })}
						onBack={handleBack}
					/>
				)}
				{currentStep === 3 && (
					<Step4Integrations
						data={data.integrations}
						onNext={(integrations) => handleNext({ integrations })}
						onBack={handleBack}
						onSkip={handleSkip}
					/>
				)}
				{currentStep === 4 && (
					<Step5Policies
						data={data.policies}
						onNext={(policies) => handleNext({ policies })}
						onBack={handleBack}
					/>
				)}
				{currentStep === 5 && (
					<Step6Review
						data={data}
						onBack={handleBack}
						onEdit={handleEdit}
					/>
				)}
			</div>
		</div>
	);
}

