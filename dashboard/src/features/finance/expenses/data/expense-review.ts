import type { ExpenseAttachment } from "@/features/finance/expenses/data/expenses";
import type { ExpensePaymentMethod } from "@/generated/prisma/enums";
import type { ExpenseResponse } from "@/server/expenses/expenses.type";

// نماذج عرض (view-model) لشاشة "مراجعة الطلب" ومسار الموافقات — مشتقّة من ExpenseResponse
// عبر fromExpenseResponse. مبنية على تصميم Figma (node 2928-43993).

export type ExpenseRequestStatus =
	| "draft"
	| "under-review"
	| "approved"
	| "rejected"
	| "paid"
	| "canceled";

// شارة الحالة في رأس شاشة المراجعة (النص + الألوان) — حسب الحالة الحقيقية
export const REQUEST_STATUS_META: Record<
	ExpenseRequestStatus,
	{ label: string; className: string }
> = {
	draft: { label: "مسودة", className: "bg-muted text-muted-foreground" },
	"under-review": { label: "قيد المراجعة", className: "bg-primary/10 text-primary" },
	approved: { label: "معتمد", className: "bg-emerald-50 text-emerald-600" },
	rejected: { label: "مرفوض", className: "bg-rose-50 text-rose-600" },
	paid: { label: "تم الصرف", className: "bg-emerald-50 text-emerald-600" },
	canceled: { label: "ملغى", className: "bg-muted text-muted-foreground" },
};

// لقطة من الطلب بعد الحفظ — تُعرض في رأس شاشة المراجعة (قيم مقروءة فقط)
export interface SubmittedExpenseRequest {
	code: string;
	title: string;
	status: ExpenseRequestStatus;
	requesterName: string;
	departmentLabel: string;
	categoryLabel: string;
	branchLabel: string;
	vendorLabel: string;
	amountLabel: string;
	paymentMethodLabel: string;
	dateLabel: string;
	attachments: ExpenseAttachment[];
	cancelReason: string | null;
}

export type ApprovalStepIcon =
	| "created"
	| "sent"
	| "manager-review"
	| "finance-approval"
	| "disbursement"
	| "comment";

export type ApprovalStepState = "done" | "sent" | "pending" | "comment";

export interface ApprovalStepAction {
	kind: "approve" | "reject" | "disburse" | "confirm-payment";
	label: string;
}

export interface ApprovalStep {
	id: string;
	icon: ApprovalStepIcon;
	title: string;
	byName: string;
	dateLabel: string;
	state: ApprovalStepState;
	/** نغمة العرض: نشِطة (أزرق)، معلّقة (رمادي)، أو مرفوضة/ميتة (أحمر بعد الرفض) */
	tone: "active" | "pending" | "rejected";
	/** شارة الحالة (مثل: تم الإرسال) */
	statusBadge?: string;
	/** أزرار الإجراء (رفض / اعتماد ...) */
	actions?: ApprovalStepAction[];
	/** true للتعليق الأخير الذي يعرض صورة صاحبه بدل أيقونة المسار */
	isComment?: boolean;
	/** يعرض زر "إرسال للمراجعة" يفتح حوار إرسال الطلب (قبل الإرسال) */
	hasSendButton?: boolean;
}

// حوار "إرسال الطلب للصرف" — قيم واجهة فقط (UI-only)، مبنية على Figma node 2963-837922
export interface ReviewRequestRecipient {
	id: string;
	name: string;
}

export interface SendReviewRequestValues {
	recipients: ReviewRequestRecipient[];
	subject: string;
	body: string;
}

// القيم الافتراضية مشتقّة من المصروف الحقيقي
export const buildSendReviewRequestDefaults = (
	request: SubmittedExpenseRequest,
): SendReviewRequestValues => {
	const name = request.title.replace(/^مراجعة\s*/, "");
	return {
		recipients: [],
		subject: `طلب مراجعة مصروف: ${name} — ${request.code}#`,
		body: `مرحبًا،\nنرجو مراجعة واعتماد طلب المصروف "${name}" بقيمة ${request.amountLabel}.\nمقدّم الطلب: ${request.requesterName}.`,
	};
};

export const REVIEW_REQUEST_EMAIL_TEMPLATES = [
	{ value: "default", label: "قالب افتراضي" },
	{ value: "reminder", label: "قالب تذكير" },
	{ value: "approval", label: "قالب اعتماد" },
];

const PAYMENT_METHOD_LABELS: Record<ExpensePaymentMethod, string> = {
	CASH: "نقدًا",
	BANK_TRANSFER: "تحويل بنكي",
	CARD: "بطاقة",
	CHEQUE: "شيك",
	TREASURY: "خزينة",
};

const fmtAmount = (amount: number) =>
	`${amount.toLocaleString("ar-SA", { minimumFractionDigits: 3, maximumFractionDigits: 3 })} ر.س`;

const STATUS_TO_REQUEST: Record<ExpenseResponse["status"], ExpenseRequestStatus> = {
	DRAFT: "draft",
	PENDING_REVIEW: "under-review",
	APPROVED: "approved",
	REJECTED: "rejected",
	PAID: "paid",
	CANCELED: "canceled",
};

type ServerStep = ExpenseResponse["steps"][number];

// نوع الأزرار لكل خطوة قابلة للإجراء (المدير العام/المالي = اعتماد/رفض، الصرف = زر واحد)
const STEP_META: Record<
	ServerStep["type"],
	{ icon: ApprovalStepIcon; title: string; actionable: "approve" | "disburse" | false }
> = {
	CREATED: { icon: "created", title: "تم إنشاء المصروف", actionable: false },
	SENT_FOR_REVIEW: { icon: "sent", title: "ارسال طلب المصروف للمراجعة", actionable: false },
	MANAGER_REVIEW: {
		icon: "manager-review",
		title: "مراجعة المدير العام",
		actionable: "approve",
	},
	FINANCE_APPROVAL: {
		icon: "finance-approval",
		title: "اعتماد المدير المالي",
		actionable: "approve",
	},
	DISBURSEMENT: { icon: "disbursement", title: "تأكيد الصرف", actionable: "disburse" },
};

// الترتيب في RTL: أول عنصر = يمين. اعتماد على اليمين، رفض على اليسار.
const APPROVE_REJECT: ApprovalStepAction[] = [
	{ kind: "approve", label: "اعتماد" },
	{ kind: "reject", label: "رفض" },
];
const DISBURSE_ACTION: ApprovalStepAction[] = [{ kind: "disburse", label: "صرف المصروف" }];

// خطوة الإجراء لا تظهر أزرارها إلا بعد اكتمال كل الخطوات القابلة للإجراء السابقة عليها
const toApprovalStep = (
	step: ServerStep,
	allSteps: ServerStep[],
	requesterName: string,
): ApprovalStep => {
	const meta = STEP_META[step.type];
	const stateLabel =
		step.state === "SENT"
			? "تم الارسال"
			: step.state === "APPROVED"
				? "تم الاعتماد"
				: step.state === "REJECTED"
					? "مرفوض"
					: step.state === "DONE" && step.type === "DISBURSEMENT"
						? "تم الصرف"
						: undefined;

	// كل الخطوات القابلة للإجراء الأدنى ترتيباً يجب أن تكون منجزة
	const priorActionableDone = allSteps
		.filter((s) => s.order < step.order && STEP_META[s.type].actionable)
		.every((s) => s.state === "APPROVED" || s.state === "DONE");

	const showActions =
		meta.actionable !== false && step.state === "PENDING" && priorActionableDone;

	const isActive = step.state === "DONE" || step.state === "APPROVED" || step.state === "SENT";
	// عند وجود رفض في المسار: الخطوة المرفوضة وكل الخطوات المعلّقة بعدها تُعرض بالأحمر
	const rejectedStep = allSteps.find((s) => s.state === "REJECTED");
	const isRejected =
		step.state === "REJECTED" ||
		(!!rejectedStep && !isActive && step.order >= rejectedStep.order);

	const tone: ApprovalStep["tone"] = isRejected ? "rejected" : isActive ? "active" : "pending";

	return {
		id: step.id,
		icon: meta.icon,
		title: meta.title,
		// خطوة الإنشاء ينفّذها مقدّم الطلب دائماً؛ الباقي حسب الفاعل الفعلي
		byName: step.type === "CREATED" ? requesterName : (step.actor?.name ?? requesterName),
		dateLabel: step.actedAt ? new Date(step.actedAt).toLocaleDateString("en-CA") : "—",
		state:
			step.state === "DONE" || step.state === "APPROVED"
				? "done"
				: step.state === "SENT"
					? "sent"
					: "pending",
		tone,
		statusBadge: stateLabel,
		hasSendButton: step.type === "SENT_FOR_REVIEW" && step.state === "PENDING",
		actions: showActions
			? meta.actionable === "disburse"
				? DISBURSE_ACTION
				: APPROVE_REJECT
			: undefined,
	};
};

// يشتقّ لقطة العرض ومسار الموافقات من استجابة الخادم
export const fromExpenseResponse = (
	e: ExpenseResponse,
): { request: SubmittedExpenseRequest; steps: ApprovalStep[]; reviewSent: boolean } => {
	const request: SubmittedExpenseRequest = {
		code: e.code,
		title: `مراجعة ${e.name}`,
		status: STATUS_TO_REQUEST[e.status],
		requesterName: e.requester.name,
		departmentLabel: e.departmentLabel ?? "—",
		categoryLabel: e.categoryLabel ?? "—",
		branchLabel: e.branch?.name ?? "—",
		vendorLabel: e.supplier?.legalName ?? "—",
		amountLabel: fmtAmount(Number(e.amount)),
		paymentMethodLabel: e.paymentMethod ? PAYMENT_METHOD_LABELS[e.paymentMethod] : "—",
		dateLabel: new Date(e.createdAt).toLocaleDateString("en-CA"),
		cancelReason: e.cancelReason ?? null,
		attachments: e.attachments.map(
			(a): ExpenseAttachment => ({
				id: a.id,
				kind: a.kind === "LINK" ? "link" : "document",
				label: a.label,
				value: a.url,
				uploadedAtLabel: new Date(a.createdAt).toLocaleDateString("en-CA"),
			}),
		),
	};
	const reviewSent = e.steps.some(
		(s) => s.type === "SENT_FOR_REVIEW" && s.state !== "PENDING",
	);
	return {
		request,
		steps: e.steps.map((s) => toApprovalStep(s, e.steps, e.requester.name)),
		reviewSent,
	};
};

// يعيد معرّف الخطوة الحالية القابلة للإجراء (التي تظهر عليها أزرار اعتماد/رفض/صرف).
// يُستخدم عند اتخاذ القرار مباشرة من الجدول/الشبكة دون فتح اللوحة الجانبية.
export const findCurrentActionableStep = (
	e: ExpenseResponse,
): { stepId: string; actions: ApprovalStepAction[] } | null => {
	for (const s of e.steps) {
		const step = toApprovalStep(s, e.steps, e.requester.name);
		if (step.actions?.length) return { stepId: step.id, actions: step.actions };
	}
	return null;
};
