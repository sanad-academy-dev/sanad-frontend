import type { ExpenseSource, ExpenseStatus } from "@/generated/prisma/enums";
import type {
	ExpenseApprovalStepType,
	ExpenseListItemResponse,
} from "@/server/expenses/expenses.type";

// نموذج عرض (view-model) للبطاقات/القائمة — مشتقّ من نوع الخادم عبر fromExpenseListItem.
// يبقى منفصلاً عن نوع الخادم لأن الـ UI بُني على تصميم Figma (node 2928-38741) بحقول عرض جاهزة.

export type ExpenseCardStatus =
	| "pending-review" // بانتظار المراجعة (برتقالي)
	| "under-review" // قيد المراجعة (أزرق)
	| "draft" // مسودة (رمادي)
	| "approved" // معتمد (أخضر)
	| "rejected" // مرفوض (أحمر)
	| "canceled"; // ملغى (رمادي)

// خطوات المسار المصغّر داخل البطاقة (من اليسار: إرسال → ... → الدفع)
export type ExpenseCardStepKey = "send" | "general-manager" | "finance-manager" | "payment";

export interface ExpenseCardStep {
	key: ExpenseCardStepKey;
	label: string;
	/** الخطوة الحالية/المكتملة تُعرض بشارة زرقاء */
	active: boolean;
}

export interface ExpenseCardAction {
	kind: "approve" | "reject" | "disburse";
	label: string;
}

export interface ExpenseRecord {
	id: string;
	code: string;
	title: string;
	categoryLabel: string;
	departmentLabel: string;
	branchLabel: string;
	amountLabel: string;
	dateLabel: string;
	requesterName: string;
	status: ExpenseCardStatus;
	/** الحالة الخام من الخادم — للتمييز الدقيق (PAID مقابل APPROVED) في قرارات الإجراءات */
	rawStatus: ExpenseStatus;
	/** مصروف مُرحَّل تلقائيًا من موديول آخر — يُقرأ فقط ولا يقبل إجراءات */
	isPosted: boolean;
	/** وصف مصدر الترحيل للعرض، أو null للمصروف اليدوي */
	sourceLabel: string | null;
	steps: ExpenseCardStep[];
	actions: ExpenseCardAction[];
}

// تسمية مصدر الترحيل — MANUAL بلا تسمية لأنه الحالة الطبيعية
export const EXPENSE_SOURCE_LABEL: Partial<Record<ExpenseSource, string>> = {
	PAYROLL_RUN: "مُرحَّل من مسير الرواتب",
	END_OF_SERVICE: "مُرحَّل من نهاية الدورة",
	PURCHASE_ORDER: "مُرحَّل من أمر شراء",
};

export const EXPENSE_CARD_STATUS_META: Record<
	ExpenseCardStatus,
	{ label: string; className: string }
> = {
	"pending-review": { label: "بانتظار المراجعة", className: "bg-amber-50 text-amber-600" },
	"under-review": { label: "قيد المراجعة", className: "bg-blue-50 text-blue-600" },
	draft: { label: "مسودة", className: "bg-muted text-muted-foreground" },
	approved: { label: "معتمد", className: "bg-emerald-50 text-emerald-600" },
	rejected: { label: "مرفوض", className: "bg-rose-50 text-rose-600" },
	canceled: { label: "ملغى", className: "bg-muted text-muted-foreground" },
};

// نوع العرض المتاح من زر "العرض"
export type ExpensesViewMode = "grid" | "list";

// ─── تحويل نوع الخادم إلى نموذج العرض ───────────────────────

const STATUS_TO_CARD: Record<ExpenseStatus, ExpenseCardStatus> = {
	DRAFT: "draft",
	PENDING_REVIEW: "pending-review",
	APPROVED: "approved",
	REJECTED: "rejected",
	PAID: "approved",
	CANCELED: "canceled",
};

const formatAmount = (amount: number) =>
	`${amount.toLocaleString("ar-SA", { minimumFractionDigits: 3, maximumFractionDigits: 3 })} ر.س`;

const formatDate = (date: string | Date) => new Date(date).toLocaleDateString("en-CA");

// المسار المصغّر (من اليمين: الدفع → إرسال)؛ الخطوة نشطة إذا تجاوز التقدّم موضعها
export const buildCardSteps = (
	steps: { type: ExpenseApprovalStepType; state: string }[],
): ExpenseCardStep[] => {
	const doneCount = steps.filter((s) => s.state !== "PENDING").length;
	return [
		{ key: "payment", label: "الدفع", active: doneCount >= 5 },
		{ key: "finance-manager", label: "المدير المالي", active: doneCount >= 4 },
		{ key: "general-manager", label: "المدير العام", active: doneCount >= 3 },
		{ key: "send", label: "إرسال", active: doneCount >= 2 },
	];
};

// الأزرار تعتمد على الخطوة الحالية القابلة للإجراء، لا على الحالة الإجمالية:
// - مراجعة المدير العام / اعتماد المدير المالي (PENDING) → اعتماد + رفض
// - تأكيد الصرف (PENDING) → صرف المصروف (زر واحد)
// - لم يُرسل بعد أو انتهى المسار → لا أزرار
// الترتيب القانوني = [رفض، اعتماد]؛ البطاقة (LTR) تعرضه كما هو، والجدول (RTL) يعكسه.
const cardActions = (
	status: ExpenseStatus,
	steps: { type: ExpenseApprovalStepType; state: string }[],
): ExpenseCardAction[] => {
	// السجلات المنتهية لا تُظهر أي إجراء
	if (status === "REJECTED" || status === "CANCELED" || status === "PAID") return [];

	// يجب أن يكون الطلب قد أُرسل للمراجعة أولاً
	const sent = steps.some((s) => s.type === "SENT_FOR_REVIEW" && s.state !== "PENDING");
	if (!sent) return [];

	// أول خطوة قابلة للإجراء ما زالت معلّقة تحدّد الأزرار المعروضة
	const order: ExpenseApprovalStepType[] = [
		"MANAGER_REVIEW",
		"FINANCE_APPROVAL",
		"DISBURSEMENT",
	];
	const current = order.find((type) =>
		steps.some((s) => s.type === type && s.state === "PENDING"),
	);

	if (current === "DISBURSEMENT") return [{ kind: "disburse", label: "صرف المصروف" }];
	if (current === "MANAGER_REVIEW" || current === "FINANCE_APPROVAL")
		return [
			{ kind: "reject", label: "رفض" },
			{ kind: "approve", label: "اعتماد" },
		];
	return [];
};

export const fromExpenseListItem = (item: ExpenseListItemResponse): ExpenseRecord => {
	const status = STATUS_TO_CARD[item.status];
	return {
		id: item.id,
		code: item.code,
		title: item.name,
		categoryLabel: item.categoryLabel ?? "—",
		departmentLabel: item.departmentLabel ?? "—",
		branchLabel: item.branch?.name ?? "—",
		amountLabel: formatAmount(Number(item.amount)),
		dateLabel: formatDate(item.createdAt),
		requesterName: item.requester.name,
		status,
		rawStatus: item.status,
		isPosted: item.source !== "MANUAL",
		sourceLabel: EXPENSE_SOURCE_LABEL[item.source] ?? null,
		steps: buildCardSteps(item.steps),
		// المصروف المُرحَّل لا يقبل اعتمادًا ولا رفضًا — قراره اتُّخذ في مستنده المصدر
		actions: item.source === "MANUAL" ? cardActions(item.status, item.steps) : [],
	};
};
