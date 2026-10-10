import type { CarePlanIntervalUnit } from "@/generated/prisma/enums";
import { createLocalId } from "@/lib/create-local-id";
import type {
	CarePlanDetailResponse,
	CarePlanMedicationInput,
	CarePlanVisitInput,
	CreateCarePlanInput,
} from "@/server/care-plans/care-plans.type";

export interface CreateCarePlanFormValues {
	name: string;
	serviceId: string | undefined;
	animalTypeId: string | undefined;
	animalStrainId: string | undefined;
	notes: string;
	visitDuration: string | undefined;
	price: string;
}

export const CREATE_CARE_PLAN_FORM_DEFAULTS: CreateCarePlanFormValues = {
	name: "",
	serviceId: undefined,
	animalTypeId: undefined,
	animalStrainId: undefined,
	notes: "",
	visitDuration: undefined,
	price: "",
};

export const CARE_PLAN_REQUIRED_FIELDS = [
	"name",
	"serviceId",
	"animalTypeId",
	"animalStrainId",
	"price",
] as const satisfies readonly (keyof CreateCarePlanFormValues)[];

export const CARE_PLAN_FIELD_LABELS: Record<keyof CreateCarePlanFormValues, string> = {
	name: "اسم الخطة",
	serviceId: "نوع الدورة",
	animalTypeId: "نوع الطفل المستفيد",
	animalStrainId: "السلالة المستفيد",
	notes: "ملاحظات",
	visitDuration: "المدة التقديرية",
	price: "السعر",
};

// أسماء الحقول المعدَّلة مقارنة بالقيم الأساسية (الافتراضية عند الإنشاء، أو المحمّلة عند التعديل) — لعرضها في تنبيه "تغييرات غير محفوظة"
export const getModifiedCarePlanFields = (
	values: CreateCarePlanFormValues,
	visitsChanged: boolean,
	planMedicationsChanged: boolean,
	baseline: CreateCarePlanFormValues = CREATE_CARE_PLAN_FORM_DEFAULTS,
): string[] => {
	const fields = (
		Object.keys(CREATE_CARE_PLAN_FORM_DEFAULTS) as (keyof CreateCarePlanFormValues)[]
	)
		.filter((key) => values[key] !== baseline[key])
		.map((key) => CARE_PLAN_FIELD_LABELS[key]);
	if (visitsChanged) fields.push("الزيارات المتعددة");
	if (planMedicationsChanged) fields.push("الأدوية والمستلزمات");
	return fields;
};

export const VISIT_DURATION_OPTIONS = [
	{ value: "15", label: "15 دقيقة" },
	{ value: "30", label: "30 دقيقة" },
	{ value: "45", label: "45 دقيقة" },
	{ value: "60", label: "ساعة واحدة" },
];

// ─── نموذج الزيارات/المستلزمات على الواجهة — id محلي لأغراض React فقط ───

export interface CarePlanMedicationItem {
	id: string;
	inventoryItemId: string | undefined;
	quantity: number;
	freeQuantity: number;
	fullyFree: boolean;
}

export const createEmptyMedicationItem = (): CarePlanMedicationItem => ({
	id: createLocalId(),
	inventoryItemId: undefined,
	quantity: 1,
	freeQuantity: 1,
	fullyFree: false,
});

export interface CarePlanVisit {
	id: string;
	serviceId: string | undefined;
	consultationTypeId: string | undefined;
	duration: string | undefined; // دقائق كسلسلة نصية (لأغراض <Select>)
	details: string;
	medications: CarePlanMedicationItem[];
	intervalUnit: CarePlanIntervalUnit;
	intervalValue: number;
}

export const createEmptyVisit = (): CarePlanVisit => ({
	id: createLocalId(),
	serviceId: undefined,
	consultationTypeId: undefined,
	duration: undefined,
	details: "",
	medications: [],
	intervalUnit: "DAY",
	intervalValue: 0,
});

export const INTERVAL_UNIT_OPTIONS: { value: CarePlanIntervalUnit; label: string }[] = [
	{ value: "DAY", label: "يوم" },
	{ value: "WEEK", label: "أسبوع" },
];

export interface CarePlanVisitAiSuggestion {
	serviceName: string;
	duration: string;
	details: string;
	medicationNames: string[];
}

// اقتراح توضيحي فقط — لا يوجد اتصال حقيقي بالذكاء الاصطناعي حتى الآن
export const MOCK_VISIT_AI_SUGGESTION: CarePlanVisitAiSuggestion = {
	serviceName: "لقاح رباعي",
	duration: "30",
	details: "تقييم الاستجابة وتعديل الجرعة.",
	medicationNames: ["أمبيسيلين 500mg", "لقاح رباعي", "قطن", "لاصق طبي"],
};

// ─── تحويل النموذج إلى حمولة الـ API ───────────────────────

const toMedicationInput = (m: CarePlanMedicationItem): CarePlanMedicationInput | null => {
	if (!m.inventoryItemId) return null;
	return {
		inventoryItemId: m.inventoryItemId,
		quantity: m.quantity,
		freeQuantity: m.freeQuantity,
		fullyFree: m.fullyFree,
	};
};

const toVisitInput = (v: CarePlanVisit): CarePlanVisitInput | null => {
	// تُحفظ الزيارة إذا كان لها دورة أو سبب (كشف) على الأقل
	if (!v.serviceId && !v.consultationTypeId) return null;
	return {
		serviceId: v.serviceId ?? null,
		consultationTypeId: v.consultationTypeId ?? null,
		durationMins: v.duration ? Number(v.duration) : null,
		details: v.details.trim() ? v.details : null,
		intervalUnit: v.intervalUnit,
		intervalValue: v.intervalValue,
		medications: v.medications.map(toMedicationInput).filter((m) => m !== null),
	};
};

export const toCreateCarePlanPayload = (
	values: CreateCarePlanFormValues,
	visits: CarePlanVisit[],
	planMedications: CarePlanMedicationItem[],
): CreateCarePlanInput => ({
	name: values.name,
	serviceId: values.serviceId ?? "",
	animalTypeId: values.animalTypeId ?? "",
	animalStrainId: values.animalStrainId ?? "",
	notes: values.notes.trim() ? values.notes : null,
	visitDurationMins: values.visitDuration ? Number(values.visitDuration) : null,
	price: Number(values.price) || 0,
	visits: visits.map(toVisitInput).filter((v) => v !== null),
	medications: planMedications.map(toMedicationInput).filter((m) => m !== null),
});

// ─── تحويل استجابة الخادم إلى حالة النموذج (للتعديل/العرض) ───

export const fromCarePlanDetailResponse = (
	plan: CarePlanDetailResponse,
): {
	values: CreateCarePlanFormValues;
	visits: CarePlanVisit[];
	planMedications: CarePlanMedicationItem[];
} => ({
	values: {
		name: plan.name,
		serviceId: plan.service.id,
		animalTypeId: plan.animalType.id,
		animalStrainId: plan.animalStrain.id,
		notes: plan.notes ?? "",
		visitDuration: plan.visitDurationMins != null ? String(plan.visitDurationMins) : undefined,
		price: String(plan.price),
	},
	visits: plan.visits.map((v) => ({
		id: v.id,
		serviceId: v.service?.id ?? undefined,
		consultationTypeId: v.consultationType?.id ?? undefined,
		duration: v.durationMins != null ? String(v.durationMins) : undefined,
		details: v.details ?? "",
		intervalUnit: v.intervalUnit,
		intervalValue: v.intervalValue,
		medications: v.medications.map((m) => ({
			id: m.id,
			inventoryItemId: m.inventoryItemId ?? undefined,
			quantity: m.quantity,
			freeQuantity: m.freeQuantity,
			fullyFree: m.fullyFree,
		})),
	})),
	planMedications: plan.medications.map((m) => ({
		id: m.id,
		inventoryItemId: m.inventoryItemId ?? undefined,
		quantity: m.quantity,
		freeQuantity: m.freeQuantity,
		fullyFree: m.fullyFree,
	})),
});
