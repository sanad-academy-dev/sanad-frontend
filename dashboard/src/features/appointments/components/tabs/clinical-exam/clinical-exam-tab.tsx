import { zodResolver } from "@hookform/resolvers/zod";
import {
	IconClipboardList,
	IconEye,
	IconEyeOff,
	IconFileDescription,
	IconHeartbeat,
	IconNotes,
	IconPaperclip,
	IconReportMedical,
	IconStethoscope,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Stepper,
	StepperIndicator,
	StepperItem,
	StepperNav,
	StepperSeparator,
	StepperTitle,
	StepperTrigger,
} from "@/components/ui/stepper";
import { TabsContent } from "@/components/ui/tabs";
import { ProtocolPanel } from "@/features/appointments/components/protocol-panel";
import { DiagnosisStep } from "@/features/appointments/components/tabs/clinical-exam/diagnosis-step";
import { SymptomsHistoryStep } from "@/features/appointments/components/tabs/clinical-exam/symptoms-history-step";
import { TreatmentPlanStep } from "@/features/appointments/components/tabs/clinical-exam/treatment-plan-step";
import { VitalsStep } from "@/features/appointments/components/tabs/clinical-exam/vitals-step";
import { useClinicalExam } from "@/features/appointments/hooks/use-clinical-exam";
import { useUpdateDiagnosis } from "@/features/appointments/hooks/use-update-diagnosis";
import { useUpdateSymptomsHistory } from "@/features/appointments/hooks/use-update-symptoms-history";
import { useUpdateTreatmentPlan } from "@/features/appointments/hooks/use-update-treatment-plan";
import { useUpdateVitals } from "@/features/appointments/hooks/use-update-vitals";
import {
	type ClinicalExamResponse,
	type DiagnosisFormInput,
	diagnosisStrictSchema,
	type SymptomsHistoryFormInput,
	symptomsHistoryStrictSchema,
	type TreatmentPlanFormInput,
	treatmentPlanSchema,
	type VitalsFormInput,
	vitalsSchema,
} from "@sanad/contracts/runtime/server/clinical-exams/clinical-exams.type";

interface ClinicalExamTabProps {
	appointmentId: string;
}

const STEPS = [
	{ step: 1, title: "الأعراض والتاريخ", icon: IconClipboardList },
	{ step: 2, title: "العلامات الحيوية", icon: IconHeartbeat },
	{ step: 3, title: "التشخيص", icon: IconStethoscope },
	{ step: 4, title: "خطة العلاج", icon: IconReportMedical },
] as const;

const TOTAL_STEPS = STEPS.length;

function defaultStep1(exam: ClinicalExamResponse | null): SymptomsHistoryFormInput {
	return {
		chiefComplaint: exam?.chiefComplaint ?? "",
		duration: exam?.duration ?? "",
		presentIllnessHistory: exam?.presentIllnessHistory ?? "",
		ownerNotes: exam?.ownerNotes ?? "",
		symptoms: exam?.symptoms ?? [],
		urination: exam?.urination ?? null,
		defecation: exam?.defecation ?? null,
		appetite: exam?.appetite ?? null,
		waterIntake: exam?.waterIntake ?? null,
	};
}

function defaultStep2(exam: ClinicalExamResponse | null): VitalsFormInput {
	return {
		hydration: exam?.hydration ?? null,
		skinCondition: exam?.skinCondition ?? null,
		hairCondition: exam?.hairCondition ?? null,
		eyeCondition: exam?.eyeCondition ?? null,
		boneCondition: exam?.boneCondition ?? null,
		respiratorySystem: exam?.respiratorySystem ?? null,
		digestiveSystem: exam?.digestiveSystem ?? null,
		nervousSystem: exam?.nervousSystem ?? null,
		earCondition: exam?.earCondition ?? null,
		checklistPatientData: exam?.checklistPatientData ?? false,
		checklistChiefComplaint: exam?.checklistChiefComplaint ?? false,
		checklistSymptomDuration: exam?.checklistSymptomDuration ?? false,
		checklistDiet: exam?.checklistDiet ?? false,
		checklistVaccinations: exam?.checklistVaccinations ?? false,
		vaccinationReviewedAt: exam?.vaccinationReviewedAt
			? new Date(exam.vaccinationReviewedAt).toISOString()
			: null,
		checklistPreviousTreatments: exam?.checklistPreviousTreatments ?? false,
		checklistTemperature: exam?.checklistTemperature ?? false,
		checklistHeartRate: exam?.checklistHeartRate ?? false,
		checklistBloodPressure: exam?.checklistBloodPressure ?? false,
		checklistHydration: exam?.checklistHydration ?? false,
		checklistBehavior: exam?.checklistBehavior ?? false,
		checklistAppetite: exam?.checklistAppetite ?? false,
		checklistOxygen: exam?.checklistOxygen ?? false,
		checklistSkin: exam?.checklistSkin ?? false,
		checklistSeverity: exam?.checklistSeverity ?? false,
		checklistAppearance: exam?.checklistAppearance ?? false,
		checklistRespiration: exam?.checklistRespiration ?? false,
		checklistDigestive: exam?.checklistDigestive ?? false,
		checklistNervous: exam?.checklistNervous ?? false,
		checklistEar: exam?.checklistEar ?? false,
		checklistVomiting: exam?.checklistVomiting ?? false,
		checklistConsciousness: exam?.checklistConsciousness ?? false,
		checklistDiagnosis: exam?.checklistDiagnosis ?? false,
		checklistUltrasound: exam?.checklistUltrasound ?? false,
		checklistReferral: exam?.checklistReferral ?? false,
		checklistXray: exam?.checklistXray ?? false,
		checklistFollowup: exam?.checklistFollowup ?? false,
	};
}

function defaultStep3(exam: ClinicalExamResponse | null): DiagnosisFormInput {
	return {
		preliminaryDiagnosis: exam?.preliminaryDiagnosis ?? "",
		severity: exam?.severity ?? null,
		diagnosisDescription: exam?.diagnosisDescription ?? "",
	};
}

function defaultStep4(exam: ClinicalExamResponse | null): TreatmentPlanFormInput {
	return {
		dietPlan: exam?.dietPlan ?? "",
		monitoringPlan: exam?.monitoringPlan ?? "",
	};
}

export function ClinicalExamTab({ appointmentId }: ClinicalExamTabProps) {
	const { exam, isLoading } = useClinicalExam(appointmentId);
	const { updateSymptomsHistory, isPending: isSaving1 } =
		useUpdateSymptomsHistory(appointmentId);
	const { updateVitals, isPending: isSaving2 } = useUpdateVitals(appointmentId);
	const { updateDiagnosis, isPending: isSaving3 } = useUpdateDiagnosis(appointmentId);
	const { updateTreatmentPlan, isPending: isSaving4 } = useUpdateTreatmentPlan(appointmentId);

	const isSaving = isSaving1 || isSaving2 || isSaving3 || isSaving4;

	const [isStepperOpen, setIsStepperOpen] = useState(false);
	const [protocolOpen, setProtocolOpen] = useState(false);
	const [activeStep, setActiveStep] = useState(1);
	const [furthestStep, setFurthestStep] = useState(1);
	// نتتبّع أي موعد/فحص جرت له استعادة الخطوة، حتى لا تُعاد عند كل تحديث بيانات،
	// مع إعادة الاستعادة تلقائيًا عند فتح موعد آخر (تغيّر appointmentId).
	const [resumedFor, setResumedFor] = useState<string | null>(null);

	const isCompleted = !!exam?.completedAt;
	// الفحص "قيد التقدّم": بدأ (تُوجد سجل فحص) ولم يكتمل بعد
	const isInProgress = !!exam?.startedAt && !isCompleted;

	const form1 = useForm<SymptomsHistoryFormInput>({
		resolver: zodResolver(symptomsHistoryStrictSchema),
		defaultValues: defaultStep1(null),
		mode: "onSubmit",
	});
	const form2 = useForm<VitalsFormInput>({
		resolver: zodResolver(vitalsSchema),
		defaultValues: defaultStep2(null),
		mode: "onSubmit",
	});
	const form3 = useForm<DiagnosisFormInput>({
		resolver: zodResolver(diagnosisStrictSchema),
		defaultValues: defaultStep3(null),
		mode: "onSubmit",
	});
	const form4 = useForm<TreatmentPlanFormInput>({
		resolver: zodResolver(treatmentPlanSchema),
		defaultValues: defaultStep4(null),
		mode: "onSubmit",
	});

	useEffect(() => {
		if (isLoading) return;
		form1.reset(defaultStep1(exam));
		form2.reset(defaultStep2(exam));
		form3.reset(defaultStep3(exam));
		form4.reset(defaultStep4(exam));
		// استأنف من آخر خطوة محفوظة مرة واحدة لكل موعد
		if (resumedFor !== appointmentId) {
			const resume = exam?.currentStep ?? 1;
			setActiveStep(resume);
			setFurthestStep(resume);
			// لو كان الفحص قيد التقدّم، افتح المُدرِّج مباشرة على الخطوة المحفوظة
			// بدل إظهار بطاقة "بدء الفحص" من جديد.
			setIsStepperOpen(!!exam?.startedAt && !exam?.completedAt);
			setResumedFor(appointmentId);
		}
	}, [exam, isLoading, resumedFor, appointmentId, form1, form2, form3, form4]);

	const handleStartExam = () => {
		// متابعة من آخر خطوة محفوظة إن كان الفحص قيد التقدّم، وإلا البدء من الأولى
		const resume = isInProgress ? (exam?.currentStep ?? 1) : 1;
		setActiveStep(resume);
		setFurthestStep(resume);
		setIsStepperOpen(true);
	};

	const handleEditExam = () => {
		// فحص مكتمل — كل الخطوات متاحة للتعديل، ونفتح على آخر خطوة محفوظة (خطة العلاج غالبًا)
		setActiveStep(exam?.currentStep ?? TOTAL_STEPS);
		setFurthestStep(TOTAL_STEPS);
		setIsStepperOpen(true);
	};

	const persistCurrentStepIfDirty = async () => {
		if (activeStep === 1 && form1.formState.isDirty) {
			const values = form1.getValues();
			await updateSymptomsHistory(values);
			form1.reset(values);
		} else if (activeStep === 2 && form2.formState.isDirty) {
			const values = form2.getValues();
			await updateVitals(values);
			form2.reset(values);
		} else if (activeStep === 3 && form3.formState.isDirty) {
			const values = form3.getValues();
			await updateDiagnosis(values);
			form3.reset(values);
		} else if (activeStep === 4 && form4.formState.isDirty) {
			const values = form4.getValues();
			await updateTreatmentPlan(values);
			form4.reset(values);
		}
	};

	const goToStep = async (target: number) => {
		if (target === activeStep) return;
		if (target < 1 || target > TOTAL_STEPS) return;
		if (target > furthestStep) return; // block forward past furthest
		await persistCurrentStepIfDirty();
		setActiveStep(target);
	};

	const handleNext = async () => {
		if (activeStep === 1) {
			await form1.handleSubmit(async (valid) => {
				await updateSymptomsHistory({ ...valid, currentStep: 2 });
				form1.reset(valid);
				setActiveStep(2);
				setFurthestStep((p) => Math.max(p, 2));
			})();
			return;
		}

		if (activeStep === 2) {
			await form2.handleSubmit(async (valid) => {
				await updateVitals({ ...valid, currentStep: 3 });
				form2.reset(valid);
				setActiveStep(3);
				setFurthestStep((p) => Math.max(p, 3));
			})();
			return;
		}

		if (activeStep === 3) {
			await form3.handleSubmit(async (valid) => {
				await updateDiagnosis({ ...valid, currentStep: 4 });
				form3.reset(valid);
				setActiveStep(4);
				setFurthestStep((p) => Math.max(p, 4));
			})();
			return;
		}

		if (activeStep === 4) {
			await form4.handleSubmit(async (valid) => {
				await updateTreatmentPlan({ ...valid, complete: true });
				setIsStepperOpen(false);
			})();
		}
	};

	const handlePrevious = () => {
		void goToStep(activeStep - 1);
	};

	const nextLabel = useMemo(() => {
		if (activeStep === TOTAL_STEPS) return "حفظ الفحص";
		const nextTitle = STEPS[activeStep]?.title;
		return nextTitle ? `التالي: ${nextTitle}` : "التالي";
	}, [activeStep]);

	const isFirst = activeStep === 1;

	return (
		<TabsContent
			value="clinical-exam"
			className="flex min-h-0 flex-col overflow-hidden"
			dir="rtl"
		>
			{isLoading ? (
				<div className="p-6">
					<p className="text-muted-foreground text-sm">جاري التحميل...</p>
				</div>
			) : !isStepperOpen ? (
				<div className="flex flex-col gap-3 p-6">
					{/* Questionnaire card — static mock */}
					<div className="flex items-center gap-3 rounded-lg border px-4 py-3">
						<div className="flex min-w-0 flex-1 items-center gap-2">
							<IconFileDescription className="text-primary size-5 shrink-0" />
							<span className="text-sm font-semibold">الاستبيان الطبي</span>
							<span className="text-muted-foreground truncate text-xs">
								تم تعبئة الإستبيان • 24 مايو 2026 • 3:45 م
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Badge
								variant="secondary"
								className="gap-1"
							>
								<IconPaperclip className="size-3" />2 مرفق
							</Badge>
							<Button
								type="button"
								variant="outline"
								size="sm"
							>
								عرض الإجابات
							</Button>
						</div>
					</div>

					{/* SOAP card */}
					<div className="flex items-center gap-3 rounded-lg border px-4 py-3">
						<div className="flex min-w-0 flex-1 items-center gap-2">
							<IconNotes className="text-primary size-5 shrink-0" />
							<span className="text-sm font-semibold">ملاحظات SOAP</span>
							{isCompleted ? (
								<span className="text-muted-foreground text-xs">تم تعبئة الفحص الطبي</span>
							) : isInProgress ? (
								<Badge
									variant="secondary"
									className="border-amber-200 bg-amber-50 text-amber-700"
								>
									قيد التقدّم • خطوة {exam?.currentStep ?? 1} من {TOTAL_STEPS}
								</Badge>
							) : (
								<Badge variant="secondary">لم تبدأ</Badge>
							)}
						</div>
						<div className="flex items-center gap-2">
							{isCompleted ? (
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={handleEditExam}
								>
									تعديل
								</Button>
							) : (
								<Button
									type="button"
									size="sm"
									onClick={handleStartExam}
								>
									{isInProgress ? "متابعة الفحص" : "بدء الفحص"}
								</Button>
							)}
						</div>
					</div>
				</div>
			) : (
				<div className="flex min-h-0 flex-1 flex-col">
					<div className="border-b py-3 px-6 flex items-center justify-between">
						<p className="font-bold">الفحص الطبي</p>

						<Button
							type="button"
							variant="outline"
							size="sm"
							className="gap-1 text-xs"
							onClick={() => setProtocolOpen((v) => !v)}
						>
							{protocolOpen ? (
								<>
									<IconEyeOff className="size-4" />
									إخفاء البروتوكول
								</>
							) : (
								<>
									<IconEye className="size-4" />
									إظهار البروتوكول
								</>
							)}
						</Button>
					</div>

					<ProtocolPanel
						open={protocolOpen}
						onClose={() => setProtocolOpen(false)}
						form={form2}
						disabled={isSaving}
						patientId={exam?.appointment?.patientId ?? null}
					/>

					<Stepper
						value={activeStep}
						onValueChange={(step) => {
							void goToStep(step);
						}}
						className="flex min-h-0 flex-1 flex-col overflow-hidden"
					>
						<div className="shrink-0 overflow-x-auto px-6 pt-6 pb-4">
							<StepperNav className="min-w-max flex-nowrap gap-3">
								{STEPS.map((s, idx) => {
									const Icon = s.icon;
									const isDisabled = s.step > furthestStep;
									return (
										<StepperItem
											key={s.step}
											step={s.step}
											disabled={isDisabled}
											className="relative w-28 shrink-0 items-start"
										>
											<StepperTrigger
												className="flex grow flex-col items-start justify-center gap-2.5 rounded-md"
												disabled={isDisabled}
											>
												<StepperIndicator className="size-8 border-2 data-[state=inactive]:border-border data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground">
													<Icon className="size-4" />
												</StepperIndicator>
												<StepperTitle className="text-start text-sm font-semibold group-data-[state=inactive]/step:text-muted-foreground">
													{s.title}
												</StepperTitle>
											</StepperTrigger>
											{idx < STEPS.length - 1 && (
												<StepperSeparator className="absolute inset-x-0 start-9 top-4 m-0 group-data-[orientation=horizontal]/stepper-nav:w-[calc(100%-2rem)] group-data-[orientation=horizontal]/stepper-nav:flex-none group-data-[state=completed]/step:bg-primary" />
											)}
										</StepperItem>
									);
								})}
							</StepperNav>
						</div>

						<div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
							{activeStep === 1 && (
								<SymptomsHistoryStep
									form={form1}
									disabled={isSaving}
									isCompleted={isCompleted}
								/>
							)}
							{activeStep === 2 && (
								<VitalsStep
									form={form2}
									appointmentId={appointmentId}
									patientId={exam?.appointment?.patientId ?? ""}
									attachedVitals={exam?.vitalsRecord ?? null}
									disabled={isSaving}
									isCompleted={isCompleted}
								/>
							)}
							{activeStep === 3 && (
								<DiagnosisStep
									form={form3}
									disabled={isSaving}
									isCompleted={isCompleted}
								/>
							)}
							{activeStep === 4 && (
								<TreatmentPlanStep
									form={form4}
									appointmentId={appointmentId}
									disabled={isSaving}
									isCompleted={isCompleted}
								/>
							)}
						</div>

						<div className="mt-auto flex shrink-0 items-center justify-between gap-2 border-t bg-background px-6 py-3">
							<div className="flex items-center gap-2">
								<Button
									type="button"
									onClick={handleNext}
									disabled={isSaving}
								>
									{nextLabel}
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={handlePrevious}
									disabled={isSaving || isFirst}
								>
									السابق
								</Button>
							</div>
							<Button
								type="button"
								variant="ghost"
								onClick={() => setIsStepperOpen(false)}
								disabled={isSaving}
							>
								إلغاء
							</Button>
						</div>
					</Stepper>
				</div>
			)}
		</TabsContent>
	);
}
