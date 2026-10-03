import type { FieldPath, FieldPathValue, FieldValues } from "react-hook-form";

import type {
	DiagnosisFormInput,
	SymptomsHistoryFormInput,
	TreatmentPlanFormInput,
} from "@/server/clinical-exams/clinical-exams.type";

export type AISuggestion<T extends FieldValues> = {
	[P in FieldPath<T>]: {
		field: P;
		value: FieldPathValue<T, P>;
		label: string;
	};
}[FieldPath<T>];

export const step1Suggestions: AISuggestion<SymptomsHistoryFormInput>[] = [
	{ field: "duration", value: "3 أيام", label: "مدة المرض: 3 أيام" },
	{ field: "chiefComplaint", value: "ألم في المعدة", label: "الشكوى: ألم في المعدة" },
	{
		field: "ownerNotes",
		value: "يعاني من ألم في المعدة وقلة أكل",
		label: "ملاحظات وليّ الأمر: يعاني من ألم في المعدة وقلة أكل",
	},
	{ field: "symptoms", value: ["VOMITING", "LETHARGY"], label: "الأعراض: قيء، خمول" },
	{ field: "urination", value: "DECREASED", label: "التبول: ناقص" },
	{ field: "defecation", value: "NORMAL", label: "التبرز: طبيعي" },
	{ field: "appetite", value: "NORMAL", label: "الشهية: طبيعي" },
	{ field: "waterIntake", value: "NORMAL", label: "شرب الماء: طبيعي" },
];

export const step2InfoMessage =
	"أدخل القياسات بدقة؛ سيقوم الـ AI بتنبيه المدرّب تلقائياً إذا كانت القياسات خارج النطاق الطبيعي لهذا النوع والعمر، ويبدأ التشخيص.";

export const step3Suggestions: AISuggestion<DiagnosisFormInput>[] = [
	{
		field: "preliminaryDiagnosis",
		value: "قرحة في المعدة + مكروب",
		label: "التشخيص: قرحة في المعدة + مكروب",
	},
	{ field: "severity", value: "MODERATE", label: "درجة الخطورة: متوسط" },
	{
		field: "diagnosisDescription",
		value: "يعاني من ألم في المعدة يحتاج إلى عناية خاصة وبعض الفحوصات",
		label: "وصف التشخيص: يعاني من ألم في المعدة يحتاج إلى عناية خاصة وبعض الفحوصات",
	},
];

export const step4Suggestions: AISuggestion<TreatmentPlanFormInput>[] = [
	{
		field: "dietPlan",
		value: "طعام مسلوق + بدون زيت",
		label: "النظام الغذائي: طعام مسلوق + بدون زيت",
	},
	{
		field: "monitoringPlan",
		value: "قياس درجة الحرارة",
		label: "المراقبة والمتابعة: قياس درجة الحرارة",
	},
];
