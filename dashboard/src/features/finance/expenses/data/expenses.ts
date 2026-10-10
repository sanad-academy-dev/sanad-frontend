import type { ExpensePayload } from "@/features/finance/expenses/hooks/use-expense-mutations";
import type {
	ExpensePaymentMethod,
	ExpenseReminderOffset as PrismaExpenseReminderOffset,
} from "@/generated/prisma/enums";
import { createLocalId } from "@/lib/create-local-id";

// ملاحظة: لا يوجد نموذج Prisma للمصروفات بعد — هذه أنواع واجهة فقط (UI-only)،
// مبنية على تصميم Figma (node 2928-40041 وما حوله). عند إضافة مخطط قاعدة البيانات
// يجب اشتقاق هذه الأنواع من `Prisma.ExpenseUncheckedCreateInput` و`z.infer`.

export type ExpenseReminderOffset = "one-day" | "two-days" | "three-days";

export type ExpenseAttachmentKind = "link" | "document";

export interface ExpenseAttachment {
	id: string;
	kind: ExpenseAttachmentKind;
	/** عنوان الرابط أو اسم المستند المعروض */
	label: string;
	/** الرابط، أو اسم الملف للمستند */
	value: string;
	/** التاريخ المعروض للمستندات المرفوعة */
	uploadedAtLabel?: string;
}

export interface CreateExpenseFormValues {
	name: string;
	requesterId: string | undefined;
	departmentId: string | undefined;
	categoryId: string | undefined;
	amount: string;
	paymentMethodId: string | undefined;
	branchId: string | undefined;
	// سلفة/عهدة تخصّ موظفًا — تفعّل خيار الاسترداد من الراتب
	staffId: string | undefined;
	recoverFromPayroll: boolean;
	notes: string;
	reminderEnabled: boolean;
	reminderOffset: ExpenseReminderOffset;
}

export const CREATE_EXPENSE_FORM_DEFAULTS: CreateExpenseFormValues = {
	name: "",
	requesterId: undefined,
	staffId: undefined,
	recoverFromPayroll: false,
	departmentId: undefined,
	categoryId: undefined,
	amount: "",
	paymentMethodId: undefined,
	branchId: undefined,
	notes: "",
	reminderEnabled: false,
	reminderOffset: "one-day",
};

export const EXPENSE_REQUIRED_FIELDS = [
	"name",
	"requesterId",
	"amount",
	"branchId",
] as const satisfies readonly (keyof CreateExpenseFormValues)[];

type Option = { value: string; label: string };

// خيارات تجريبية حتى تتوفر البيانات الحقيقية من الـ API
export const EXPENSE_DEPARTMENT_OPTIONS: Option[] = [
	{ value: "management", label: "الإدارة" },
	{ value: "finance", label: "المالية" },
	{ value: "marketing", label: "التسويق" },
	{ value: "operations", label: "العمليات" },
	{ value: "it", label: "تقنية المعلومات" },
];

export const EXPENSE_CATEGORY_OPTIONS: Option[] = [
	{ value: "rent", label: "إيجار" },
	{ value: "electricity", label: "كهرباء" },
	{ value: "internet", label: "إنترنت" },
	{ value: "salaries", label: "مرتبات" },
	{ value: "equipment", label: "معدات" },
	{ value: "maintenance", label: "صيانة" },
	{ value: "marketing", label: "تسويق" },
	{ value: "other", label: "أخرى" },
];

export const EXPENSE_PAYMENT_METHOD_OPTIONS: Option[] = [
	{ value: "cash", label: "نقدًا" },
	{ value: "bank-transfer", label: "تحويل بنكي" },
	{ value: "card", label: "بطاقة" },
	{ value: "cheque", label: "شيك" },
];

export const EXPENSE_REMINDER_OFFSET_OPTIONS: {
	value: ExpenseReminderOffset;
	label: string;
}[] = [
	{ value: "one-day", label: "قبل يوم واحد" },
	{ value: "two-days", label: "قبل يومين" },
	{ value: "three-days", label: "قبل 3 أيام" },
];

const labelOf = (options: Option[], value: string | undefined) =>
	options.find((o) => o.value === value)?.label ?? null;

const PAYMENT_METHOD_MAP: Record<string, ExpensePaymentMethod> = {
	cash: "CASH",
	"bank-transfer": "BANK_TRANSFER",
	card: "CARD",
	cheque: "CHEQUE",
};

const REMINDER_OFFSET_MAP: Record<ExpenseReminderOffset, PrismaExpenseReminderOffset> = {
	"one-day": "ONE_DAY",
	"two-days": "TWO_DAYS",
	"three-days": "THREE_DAYS",
};

// تحويل قيم النموذج إلى حمولة الـ API. الفرع الآن معرّف حقيقي من قائمة الأفرع؛ المورّد
// ما زال null حتى تُربَط قائمة الموردين.
export const toCreateExpensePayload = (
	values: CreateExpenseFormValues,
	attachments: ExpenseAttachment[],
): ExpensePayload => ({
	name: values.name.trim(),
	amount: Number(values.amount),
	requesterId: values.requesterId ?? null,
	paymentMethod: values.paymentMethodId
		? (PAYMENT_METHOD_MAP[values.paymentMethodId] ?? null)
		: null,
	categoryLabel: labelOf(EXPENSE_CATEGORY_OPTIONS, values.categoryId),
	departmentLabel: labelOf(EXPENSE_DEPARTMENT_OPTIONS, values.departmentId),
	branchId: values.branchId ?? null,
	supplierId: null,
	// سلفة موظف: تُخصم من راتبه في المسير التالي عند تعليمها للاسترداد
	staffId: values.staffId ?? null,
	recoverFromPayroll: !!values.staffId && values.recoverFromPayroll,
	notes: values.notes.trim() ? values.notes.trim() : null,
	reminderEnabled: values.reminderEnabled,
	reminderOffset: REMINDER_OFFSET_MAP[values.reminderOffset],
	attachments: attachments.map((a) => ({
		kind: a.kind === "link" ? "LINK" : "DOCUMENT",
		label: a.label,
		url: a.value,
	})),
});

// عكس labelOf — يعيد قيمة الخيار من نصّه المخزّن (الفئة/القسم محفوظان كنصوص عرض)
const valueOfLabel = (options: Option[], label: string | null | undefined) =>
	options.find((o) => o.label === label)?.value;

const PAYMENT_METHOD_TO_ID: Record<ExpensePaymentMethod, string> = {
	CASH: "cash",
	BANK_TRANSFER: "bank-transfer",
	CARD: "card",
	CHEQUE: "cheque",
	TREASURY: "cash",
};

const REMINDER_OFFSET_TO_ID: Record<PrismaExpenseReminderOffset, ExpenseReminderOffset> = {
	ONE_DAY: "one-day",
	TWO_DAYS: "two-days",
	THREE_DAYS: "three-days",
};

// يملأ قيم النموذج من مصروف محفوظ (لتعديل الطلب). المرفقات تُعاد بصيغة الواجهة.
// amount من الاستجابة نوعه Decimal — نحوّله بـ String() لذلك نقبله كـ unknown.
export const toFormValues = (e: {
	name: string;
	amount: unknown;
	requesterId?: string | null;
	requester?: { id: string } | null;
	paymentMethod?: ExpensePaymentMethod | null;
	categoryLabel?: string | null;
	departmentLabel?: string | null;
	branchId?: string | null;
	staffId?: string | null;
	recoverFromPayroll?: boolean;
	notes?: string | null;
	reminderEnabled?: boolean;
	reminderOffset?: PrismaExpenseReminderOffset | null;
}): CreateExpenseFormValues => ({
	name: e.name,
	requesterId: e.requester?.id ?? e.requesterId ?? undefined,
	departmentId: valueOfLabel(EXPENSE_DEPARTMENT_OPTIONS, e.departmentLabel),
	categoryId: valueOfLabel(EXPENSE_CATEGORY_OPTIONS, e.categoryLabel),
	amount: e.amount == null ? "" : String(e.amount),
	paymentMethodId: e.paymentMethod ? PAYMENT_METHOD_TO_ID[e.paymentMethod] : undefined,
	branchId: e.branchId ?? undefined, // الفرع الحقيقي من المصروف المحفوظ
	staffId: e.staffId ?? undefined,
	recoverFromPayroll: e.recoverFromPayroll ?? false,
	notes: e.notes ?? "",
	reminderEnabled: e.reminderEnabled ?? false,
	reminderOffset: e.reminderOffset ? REMINDER_OFFSET_TO_ID[e.reminderOffset] : "one-day",
});

export const createExpenseLinkAttachment = (url: string): ExpenseAttachment => ({
	id: createLocalId(),
	kind: "link",
	label: url,
	value: url,
});

export const createExpenseDocumentAttachment = (
	fileName: string,
	url: string,
): ExpenseAttachment => ({
	id: createLocalId(),
	kind: "document",
	label: fileName,
	value: url, // مفتاح التخزين السحابي (S3 key)
	uploadedAtLabel: new Date().toLocaleString("ar-SA", {
		day: "numeric",
		month: "long",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}),
});
