import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import {
	ClinicalLevel,
	ClinicalSymptom,
	DiagnosisSeverity,
	ExamCondition,
} from "@/generated/prisma/enums";
import { vitalSignsSelectShape } from "@sanad/contracts/runtime/server/vital-signs/vital-signs.type";

export type { ClinicalLevel, ClinicalSymptom, DiagnosisSeverity, ExamCondition };

const clinicalExamSelect = {
	id: true,
	appointmentId: true,
	startedAt: true,
	completedAt: true,
	currentStep: true,
	// Step 1
	chiefComplaint: true,
	duration: true,
	presentIllnessHistory: true,
	ownerNotes: true,
	symptoms: true,
	urination: true,
	defecation: true,
	appetite: true,
	waterIntake: true,
	// Step 2 — القياسات تُقرأ من لقطة العلامات الحيوية المرتبطة لا من أعمدة الفحص
	vitalsRecordId: true,
	vitalsRecord: { select: vitalSignsSelectShape },
	hydration: true,
	skinCondition: true,
	hairCondition: true,
	eyeCondition: true,
	boneCondition: true,
	respiratorySystem: true,
	digestiveSystem: true,
	nervousSystem: true,
	earCondition: true,
	checklistPatientData: true,
	checklistChiefComplaint: true,
	checklistSymptomDuration: true,
	checklistDiet: true,
	checklistVaccinations: true,
	vaccinationReviewedAt: true,
	checklistPreviousTreatments: true,
	checklistTemperature: true,
	checklistHeartRate: true,
	checklistBloodPressure: true,
	checklistHydration: true,
	checklistBehavior: true,
	checklistAppetite: true,
	checklistOxygen: true,
	checklistSkin: true,
	checklistSeverity: true,
	checklistAppearance: true,
	checklistRespiration: true,
	checklistDigestive: true,
	checklistNervous: true,
	checklistEar: true,
	checklistVomiting: true,
	checklistConsciousness: true,
	checklistDiagnosis: true,
	checklistUltrasound: true,
	checklistReferral: true,
	checklistXray: true,
	checklistFollowup: true,
	// Step 3
	preliminaryDiagnosis: true,
	severity: true,
	diagnosisDescription: true,
	// Step 4
	dietPlan: true,
	monitoringPlan: true,
	createdAt: true,
	// الطفل يصل عبر الزيارة — الخطوة الثانية تحتاجه لجلب سجل العلامات الحيوية،
	// وتمريره من الأعلى كان سيمرّ عبر موضعَي استدعاء لا يملك أحدهما سوى المعرّف
	appointment: { select: { patientId: true } },
	updatedAt: true,
} satisfies Prisma.ClinicalExamSelect;

export const clinicalExamSelectShape = clinicalExamSelect;

export type ClinicalExamResponse = Prisma.ClinicalExamGetPayload<{
	select: typeof clinicalExamSelect;
}>;

// ── Step 1 ────────────────────────────────────────────────────────────────────

export const symptomsHistoryStrictSchema = z.object({
	chiefComplaint: z
		.string({ error: "الشكوى الرئيسية مطلوبة" })
		.trim()
		.min(1, "الشكوى الرئيسية مطلوبة"),
	duration: z.string().trim().nullish(),
	presentIllnessHistory: z.string().trim().nullish(),
	ownerNotes: z.string().trim().nullish(),
	symptoms: z.array(z.enum(ClinicalSymptom)),
	urination: z.enum(ClinicalLevel).nullish(),
	defecation: z.enum(ClinicalLevel).nullish(),
	appetite: z.enum(ClinicalLevel).nullish(),
	waterIntake: z.enum(ClinicalLevel).nullish(),
});

export const symptomsHistoryPartialSchema = symptomsHistoryStrictSchema.partial();

export type SymptomsHistoryFormInput = z.infer<typeof symptomsHistoryStrictSchema>;
export type SymptomsHistoryPartialInput = z.infer<typeof symptomsHistoryPartialSchema>;

export type UpsertSymptomsHistoryInput = Pick<
	Prisma.ClinicalExamUncheckedCreateInput,
	| "chiefComplaint"
	| "duration"
	| "presentIllnessHistory"
	| "ownerNotes"
	| "urination"
	| "defecation"
	| "appetite"
	| "waterIntake"
> & {
	symptoms?: ClinicalSymptom[];
	currentStep?: number;
};

// ── Step 2 ────────────────────────────────────────────────────────────────────

// القياسات نفسها لم تعد هنا: الخطوة تربط سجل علامات حيوية بالمعرّف، وفحوصات
// الحالة أدناه تبقى نتائج فحص تخصّ الزيارة (docs/vital-signs-plan.md §3.3)
export const vitalsSchema = z.object({
	hydration: z.enum(ExamCondition).nullish(),
	skinCondition: z.enum(ExamCondition).nullish(),
	hairCondition: z.enum(ExamCondition).nullish(),
	eyeCondition: z.enum(ExamCondition).nullish(),
	boneCondition: z.enum(ExamCondition).nullish(),
	respiratorySystem: z.enum(ExamCondition).nullish(),
	digestiveSystem: z.enum(ExamCondition).nullish(),
	nervousSystem: z.enum(ExamCondition).nullish(),
	earCondition: z.enum(ExamCondition).nullish(),
	checklistPatientData: z.boolean(),
	checklistChiefComplaint: z.boolean(),
	checklistSymptomDuration: z.boolean(),
	checklistDiet: z.boolean(),
	checklistVaccinations: z.boolean(),
	checklistPreviousTreatments: z.boolean(),
	checklistTemperature: z.boolean(),
	checklistHeartRate: z.boolean(),
	checklistBloodPressure: z.boolean(),
	checklistHydration: z.boolean(),
	checklistBehavior: z.boolean(),
	checklistAppetite: z.boolean(),
	checklistOxygen: z.boolean(),
	checklistSkin: z.boolean(),
	checklistSeverity: z.boolean(),
	checklistAppearance: z.boolean(),
	checklistRespiration: z.boolean(),
	checklistDigestive: z.boolean(),
	checklistNervous: z.boolean(),
	checklistEar: z.boolean(),
	checklistVomiting: z.boolean(),
	checklistConsciousness: z.boolean(),
	checklistDiagnosis: z.boolean(),
	checklistUltrasound: z.boolean(),
	checklistReferral: z.boolean(),
	checklistXray: z.boolean(),
	checklistFollowup: z.boolean(),
	// لحظة مراجعة سجل التطعيمات الحقيقي. هي ما يمنح `checklistVaccinations` قيمته:
	// البند لم يعد إقرارًا حرًّا بل انعكاسًا لمراجعة موثّقة. نص ISO لأنه يسافر نصًّا.
	vaccinationReviewedAt: z.string().nullable().optional(),
});

export type VitalsFormInput = z.infer<typeof vitalsSchema>;

export type UpsertVitalsInput = Pick<
	Prisma.ClinicalExamUncheckedCreateInput,
	| "hydration"
	| "skinCondition"
	| "hairCondition"
	| "eyeCondition"
	| "boneCondition"
	| "respiratorySystem"
	| "digestiveSystem"
	| "nervousSystem"
	| "earCondition"
	| "checklistPatientData"
	| "checklistChiefComplaint"
	| "checklistSymptomDuration"
	| "checklistDiet"
	| "checklistVaccinations"
	| "checklistPreviousTreatments"
	| "checklistTemperature"
	| "checklistHeartRate"
	| "checklistBloodPressure"
	| "checklistHydration"
	| "checklistBehavior"
	| "checklistAppetite"
	| "checklistOxygen"
	| "checklistSkin"
	| "checklistSeverity"
	| "checklistAppearance"
	| "checklistRespiration"
	| "checklistDigestive"
	| "checklistNervous"
	| "checklistEar"
	| "checklistVomiting"
	| "checklistConsciousness"
	| "checklistDiagnosis"
	| "checklistUltrasound"
	| "checklistReferral"
	| "checklistXray"
	| "checklistFollowup"
	| "vaccinationReviewedAt"
> & { currentStep?: number };

// ── Step 3 ────────────────────────────────────────────────────────────────────

export const diagnosisStrictSchema = z.object({
	preliminaryDiagnosis: z
		.string({ error: "التشخيص البدئي مطلوب" })
		.trim()
		.min(1, "التشخيص البدئي مطلوب"),
	severity: z.enum(DiagnosisSeverity).nullish(),
	diagnosisDescription: z.string().trim().nullish(),
});

export type DiagnosisFormInput = z.infer<typeof diagnosisStrictSchema>;

export type UpsertDiagnosisInput = Pick<
	Prisma.ClinicalExamUncheckedCreateInput,
	"preliminaryDiagnosis" | "severity" | "diagnosisDescription"
> & { currentStep?: number };

// ── Step 4 ────────────────────────────────────────────────────────────────────

export const treatmentPlanSchema = z.object({
	dietPlan: z.string().trim().nullish(),
	monitoringPlan: z.string().trim().nullish(),
});

export type TreatmentPlanFormInput = z.infer<typeof treatmentPlanSchema>;

export type UpsertTreatmentPlanInput = Pick<
	Prisma.ClinicalExamUncheckedCreateInput,
	"dietPlan" | "monitoringPlan"
> & { currentStep?: number; complete?: boolean };
