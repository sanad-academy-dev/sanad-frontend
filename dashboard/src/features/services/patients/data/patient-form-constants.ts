export const CLASSROOM_OPTIONS = ["النجوم", "القمر", "الشمس", "الزهور", "النحل"] as const;

export const BLOOD_TYPE_OPTIONS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] as const;

export const RELATIONSHIP_OPTIONS = [
	{ value: "FATHER", label: "أب" },
	{ value: "MOTHER", label: "أم" },
	{ value: "GUARDIAN", label: "وصي / كفيل" },
	{ value: "OTHER", label: "أخرى" },
] as const;

export const TRANSPORT_OPTIONS = [
	"حافلة الأكاديمية (ذهاب وعودة)",
	"حافلة الأكاديمية (ذهاب فقط)",
	"حافلة الأكاديمية (عودة فقط)",
	"سيارة خاصة / مع ولي الأمر",
] as const;

export const FEE_TYPE_OPTIONS = [
	"رسوم شهرية",
	"رسوم فصلية",
	"رسوم سنوية",
	"منحة كاملة",
	"أخرى",
] as const;

export const ALLERGY_CHIPS = [
	"حليب البقر",
	"فول سوداني",
	"بيض",
	"قمح (جلوتين)",
	"لا يوجد",
] as const;

export const HEALTH_CHIPS = ["لا يوجد", "ربو", "حساسية جلدية", "فرط حركة"] as const;

export const PATIENT_FIELD_LABELS: Record<string, string> = {
	name: "اسم الطفل",
	birthDate: "تاريخ الميلاد",
	gender: "الجنس",
	nationalId: "رقم الهوية / الإقامة",
	classroom: "الفصل",
	ownerId: "ولي الأمر",
	guardianName: "اسم ولي الأمر",
	guardianRelationship: "صلة القرابة",
	guardianPhone: "رقم التواصل",
	guardianEmail: "البريد الإلكتروني",
	emergencyContactPhone: "رقم الطوارئ",
	emergencyContactName: "اسم جهة الطوارئ",
	bloodType: "فصيلة الدم",
	developmentStatus: "الحالة النمائية",
	allergies: "الحساسيات",
	healthConditions: "حالات صحية",
	transportation: "وسيلة النقل",
	feeType: "نوع الرسوم",
	previousNursery: "الحضانة السابقة",
	notes: "ملاحظات",
};

export const INITIAL_PATIENT_FORM_VALUES = {
	name: "",
	birthDate: "",
	nationalId: "",
	gender: "MALE" as const,
	classroom: "النجوم",
	ownerId: "",
	guardianName: "",
	guardianPhone: "",
	guardianEmail: "",
	guardianRelationship: "FATHER",
	emergencyContactName: "",
	emergencyContactPhone: "",
	pocketMoneyEnabled: true,
	transportation: "",
	feeType: "",
	bloodType: "A+",
	developmentStatus: "NORMAL",
	allergies: "لا يوجد",
	healthConditions: "",
	previousNursery: "",
	notes: "",
	active: true,
	status: "ACTIVE",
};

export function calculatePatientProgress(values: {
	name?: string | null;
	birthDate?: string | null;
	gender?: string | null;
	classroom?: string | null;
	guardianName?: string | null;
	ownerId?: string | null;
	guardianPhone?: string | null;
}) {
	const checks = [
		Boolean(values.name?.trim()),
		Boolean(values.birthDate?.trim()),
		Boolean(values.gender),
		Boolean(values.classroom?.trim()),
		Boolean(values.guardianName?.trim() || values.ownerId),
		Boolean(values.guardianPhone?.trim()),
	];
	const completed = checks.filter(Boolean).length;
	const total = 6;
	const percentage = Math.round((completed / total) * 100);
	return { completed, total, percentage };
}

export function getPatientFilledFields(values: Record<string, unknown>): string[] {
	const str = (val: unknown) => (typeof val === "string" ? val.trim() : null);
	return [
		str(values.name) ? "name" : null,
		str(values.birthDate) ? "birthDate" : null,
		str(values.nationalId) ? "nationalId" : null,
		str(values.classroom) ? "classroom" : null,
		str(values.ownerId) ? "ownerId" : null,
		str(values.guardianName) ? "guardianName" : null,
		str(values.guardianPhone) ? "guardianPhone" : null,
		str(values.guardianEmail) ? "guardianEmail" : null,
		str(values.emergencyContactPhone) ? "emergencyContactPhone" : null,
		str(values.emergencyContactName) ? "emergencyContactName" : null,
		values.allergies && values.allergies !== "لا يوجد" ? "allergies" : null,
		values.healthConditions && values.healthConditions !== "لا يوجد"
			? "healthConditions"
			: null,
		str(values.transportation) ? "transportation" : null,
		str(values.feeType) ? "feeType" : null,
		str(values.previousNursery) ? "previousNursery" : null,
		str(values.notes) ? "notes" : null,
	].filter((f): f is string => f !== null);
}
