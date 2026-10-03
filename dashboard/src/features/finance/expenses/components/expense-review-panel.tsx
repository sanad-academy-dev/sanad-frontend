import {
	IconAt,
	IconBan,
	IconBuilding,
	IconCalendar,
	IconCategory2,
	IconCircleCheck,
	IconCircleX,
	IconDownload,
	IconEye,
	IconFileText,
	IconLink,
	IconMapPin,
	IconMoodSmile,
	IconPencil,
	IconPlus,
	IconPrinter,
	IconSend,
	IconShare,
	IconTrash,
	IconUpload,
	IconUser,
	IconUserCircle,
	IconWallet,
	IconX,
} from "@tabler/icons-react";
import type { ComponentType, SVGProps } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	IconDocumentValidation,
	IconFileAdd,
	IconMailSend,
	IconValidationApproval,
	IconWebValidation,
} from "@/features/finance/expenses/components/approval-step-icons";
import {
	type ApprovalStep,
	type ApprovalStepAction,
	type ApprovalStepIcon,
	REQUEST_STATUS_META,
	type SubmittedExpenseRequest,
} from "@/features/finance/expenses/data/expense-review";
import type { ExpenseAttachment } from "@/features/finance/expenses/data/expenses";
import { printExpenseReceipt } from "@/features/finance/expenses/utils/print-expense-receipt";
import { cn } from "@/lib/utils";

type IconType = ComponentType<{ className?: string }>;

// الأيقونات الدقيقة من تصميم Figma (مسار الموافقات) — HugeIcons مستخرجة كمكوّنات SVG
const STEP_ICONS: Record<ApprovalStepIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
	created: IconFileAdd,
	sent: IconMailSend,
	"manager-review": IconDocumentValidation,
	"finance-approval": IconValidationApproval,
	disbursement: IconWebValidation,
	comment: IconValidationApproval, // التعليق يستخدم صورة المستخدم لا الأيقونة
};

function DetailRow({
	icon: Icon,
	label,
	value,
}: {
	icon: IconType;
	label: string;
	value: string;
}) {
	return (
		<div
			className="flex items-center justify-between gap-3 py-1"
			dir="rtl"
		>
			<span className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
				<Icon className="size-3.5" />
				{label}
			</span>
			<span className="text-[13px] font-semibold text-foreground">{value}</span>
		</div>
	);
}

function AttachmentRow({ attachment }: { attachment: ExpenseAttachment }) {
	return (
		<div
			className="flex items-center gap-2 rounded-[4px] border bg-muted/40 px-3 py-2"
			dir="rtl"
		>
			<span className="flex size-7 shrink-0 items-center justify-center rounded-[4px] border bg-background">
				{attachment.kind === "link" ? (
					<IconLink className="size-3.5 text-muted-foreground" />
				) : (
					<IconFileText className="size-3.5 text-muted-foreground" />
				)}
			</span>
			<div className="flex min-w-0 flex-1 flex-col">
				<span className="truncate text-xs font-medium text-foreground">
					{attachment.label}
				</span>
				{attachment.uploadedAtLabel && (
					<span className="text-[10px] text-muted-foreground">
						{attachment.uploadedAtLabel}
					</span>
				)}
			</div>
			<div className="flex items-center gap-1">
				<button
					type="button"
					className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
				>
					<IconDownload className="size-3.5" />
					<span className="sr-only">تنزيل</span>
				</button>
				<button
					type="button"
					className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
				>
					<IconEye className="size-3.5" />
					<span className="sr-only">عرض</span>
				</button>
			</div>
		</div>
	);
}

function ActionChip({
	action,
	onClick,
	disabled,
}: {
	action: ApprovalStepAction;
	onClick: () => void;
	disabled?: boolean;
}) {
	const isReject = action.kind === "reject";
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={cn(
				"inline-flex items-center gap-1 rounded-[4px] border px-2 py-1 text-[11px] font-medium transition-colors",
				isReject
					? "border-rose-200 text-rose-600 hover:bg-rose-50"
					: "border-emerald-200 text-emerald-600 hover:bg-emerald-50",
				disabled && "cursor-not-allowed opacity-40 hover:bg-transparent",
			)}
		>
			{isReject ? (
				<IconCircleX className="size-3.5" />
			) : (
				<IconCircleCheck className="size-3.5" />
			)}
			{action.label}
		</button>
	);
}

function ApprovalTimelineItem({
	step,
	isLast,
	onAction,
	onSendReview,
	reviewSent,
	actionsLocked,
}: {
	step: ApprovalStep;
	isLast: boolean;
	onAction: (step: ApprovalStep, action: ApprovalStepAction) => void;
	onSendReview: () => void;
	reviewSent: boolean;
	/** طلب نهائي (ملغى/مرفوض) — لا تُعرض أزرار الاعتماد/الرفض إطلاقاً */
	actionsLocked?: boolean;
}) {
	const StepIcon = STEP_ICONS[step.icon];
	// النغمة: نشِطة (أزرق)، مرفوضة/ميتة (أحمر)، معلّقة (رمادي)
	const isRejectedTone = step.tone === "rejected";
	const isActiveBadge = step.tone === "active";

	return (
		<div
			className="flex gap-3"
			dir="rtl"
		>
			{/* Timeline icon + connector (right side in RTL) */}
			<div className="flex flex-col items-center">
				{step.isComment ? (
					<Avatar size="sm">
						<AvatarFallback>
							<IconUser className="size-3.5" />
						</AvatarFallback>
					</Avatar>
				) : (
					<span
						className={cn(
							"flex size-6 shrink-0 items-center justify-center rounded-full",
							isRejectedTone
								? "bg-rose-500 text-white"
								: isActiveBadge
									? "bg-[#4f6ae0] text-white"
									: "border bg-[#f4f4f4] text-[#0a0a0a]",
						)}
					>
						<StepIcon className="size-3.5" />
					</span>
				)}
				{!isLast && (
					<span
						className={cn("mt-1 w-px flex-1", isRejectedTone ? "bg-rose-300" : "bg-border")}
					/>
				)}
			</div>

			{/* Content */}
			<div className="flex-1 pb-6">
				<div className="flex items-start justify-between gap-2">
					<p className="text-[13px] font-semibold text-foreground">{step.title}</p>
					<div className="flex shrink-0 items-center gap-1.5">
						{step.statusBadge && (
							<span
								className={cn(
									"rounded-[4px] px-2 py-0.5 text-[10px] font-medium",
									isRejectedTone ? "bg-rose-50 text-rose-600" : "bg-primary/10 text-primary",
								)}
							>
								{step.statusBadge}
							</span>
						)}
						{/* زر "إرسال للمراجعة" يفتح حوار الإرسال — الأزرار التالية معطّلة قبله */}
						{step.hasSendButton &&
							(reviewSent ? (
								<span className="rounded-[4px] bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
									تم الارسال
								</span>
							) : (
								<Button
									type="button"
									size="sm"
									className="h-6 gap-1 px-2 text-[11px]"
									onClick={onSendReview}
								>
									<IconSend className="size-3" />
									إرسال للمراجعة
								</Button>
							))}
						{!actionsLocked &&
							step.actions?.map((action) => (
								<ActionChip
									key={action.kind}
									action={action}
									disabled={!reviewSent}
									onClick={() => onAction(step, action)}
								/>
							))}
					</div>
				</div>
				<div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
					<span>{step.dateLabel}</span>
					<span>·</span>
					<span>بواسطة:</span>
					<Avatar
						size="sm"
						className="size-3.5"
					>
						<AvatarFallback className="text-[8px]">{step.byName.charAt(0)}</AvatarFallback>
					</Avatar>
					<span>{step.byName}</span>
				</div>
			</div>
		</div>
	);
}

export function ExpenseReviewPanel({
	request,
	steps,
	reviewSent,
	onClose,
	onEdit,
	onDelete,
	onCancel,
	onAction,
	onSendReview,
	onViewRejection,
}: {
	request: SubmittedExpenseRequest;
	steps: ApprovalStep[];
	reviewSent: boolean;
	onClose: () => void;
	onEdit: () => void;
	onDelete: () => void;
	onCancel: () => void;
	onAction: (step: ApprovalStep, action: ApprovalStepAction) => void;
	onSendReview: () => void;
	/** عند حالة "مرفوض" — فتح ملخّص الرفض */
	onViewRejection?: () => void;
}) {
	const statusMeta = REQUEST_STATUS_META[request.status];
	const isCanceled = request.status === "canceled";
	const isPaid = request.status === "paid";
	// بعد إرسال الطلب للمراجعة تُقفل تعديلات المستندات، ويتحوّل الحذف إلى إلغاء.
	// الطلب الملغى نهائي — يُقفل كل شيء (كالمرفوض) بلا استثناء.
	//
	// [P12A-fix5] «تم الصرف» يُقفل أيضًا. كان القفل مشتقًّا من إرسال المراجعة وحدها، فمصروف
	// مدفوع لم يمرّ بمراجعة كان يظهر بزر «حذف الطلب» — حذفٌ نهائي لمستند رحّله محول C3 إلى
	// دفتر الأستاذ. هذا ما وقع في مراجعة وليّ الأمر: حُذف مصروف 453 وبقي ترحيله يتيمًا.
	const locked = reviewSent || isCanceled || isPaid;
	// [P12A-fix5] الإلغاء متاح بعد الصرف — وهو المُطلِق الحقيقي لعكس القيد (AR-2). كان
	// `!isPaid` يمنعه، فلم يكن للمصروف المُرحَّل أي مخرج من الشاشة سوى الحذف.
	const canCancel = locked && request.status !== "rejected" && !isCanceled;
	// مشاركة/طباعة/تنزيل تظهر فقط بعد إتمام الصرف
	const showExport = isPaid;
	// طباعة / تنزيل PDF — يفتح إيصالاً نظيفاً للطباعة (يتفادى الشاشة البيضاء عند طباعة الصفحة كاملة)
	const handlePrint = () => printExpenseReceipt(request, steps);

	return (
		<div
			className="relative order-2 flex min-h-0 flex-1 flex-col rounded-lg border bg-popover"
			dir="rtl"
		>
			<button
				type="button"
				onClick={onClose}
				className="absolute top-1 left-1 flex size-7 items-center justify-center rounded hover:bg-muted"
			>
				<IconX className="size-4" />
				<span className="sr-only">إغلاق</span>
			</button>

			{/* Header */}
			<div className="border-b px-4 py-2">
				<h2 className="flex items-center gap-1.5 text-sm font-bold text-foreground">
					المصروفات
					<span className="text-muted-foreground">›</span>
					<span className="font-semibold text-muted-foreground">طلب مصروف</span>
					<span className="text-muted-foreground">›</span>
					<span className="font-semibold text-muted-foreground">مراجعة الطلب</span>
				</h2>
			</div>

			<div className="flex-1 space-y-5 overflow-y-auto p-4">
				{/* Title + status */}
				<div
					className="flex items-center justify-between gap-2"
					dir="rtl"
				>
					{/* حالة "مرفوض" قابلة للنقر لفتح ملخّص الرفض */}
					{request.status === "rejected" && onViewRejection ? (
						<button
							type="button"
							onClick={onViewRejection}
							className={cn(
								"rounded-[4px] px-2 py-1 text-[11px] font-medium transition-opacity hover:opacity-80",
								statusMeta.className,
							)}
						>
							{statusMeta.label}
						</button>
					) : (
						<span
							className={cn(
								"rounded-[4px] px-2 py-1 text-[11px] font-medium",
								statusMeta.className,
							)}
						>
							{statusMeta.label}
						</span>
					)}
					<span className="text-sm font-bold text-foreground">
						{request.title} . {request.code}#
					</span>
				</div>

				{/* Detail rows */}
				<div className="space-y-0.5 rounded-[4px] border px-3 py-2">
					<DetailRow
						icon={IconUserCircle}
						label="مقدم الطلب"
						value={request.requesterName}
					/>
					<DetailRow
						icon={IconBuilding}
						label="القسم"
						value={request.departmentLabel}
					/>
					<DetailRow
						icon={IconCategory2}
						label="الفئة"
						value={request.categoryLabel}
					/>
					<DetailRow
						icon={IconMapPin}
						label="الفرع"
						value={request.branchLabel}
					/>
					<DetailRow
						icon={IconUser}
						label="المورد"
						value={request.vendorLabel}
					/>
					<DetailRow
						icon={IconWallet}
						label="المبلغ"
						value={request.amountLabel}
					/>
					<DetailRow
						icon={IconWallet}
						label="طريقة الدفع"
						value={request.paymentMethodLabel}
					/>
					<DetailRow
						icon={IconCalendar}
						label="التاريخ"
						value={request.dateLabel}
					/>
				</div>

				{/* Documents */}
				<div className="space-y-3">
					<div
						className="flex items-center justify-between gap-2"
						dir="rtl"
					>
						<span className="text-[11px] font-semibold text-foreground">
							المستندات والروابط
						</span>
						<Button
							type="button"
							size="sm"
							variant="outline"
							disabled={locked}
							title={locked ? "لا يمكن إضافة مستندات بعد إرسال الطلب للمراجعة" : undefined}
							className="border-primary text-primary hover:bg-primary/5"
						>
							<IconPlus className="size-3" />
							أضف مستندًا أو رابطًا...
						</Button>
					</div>
					{request.attachments.length > 0 && (
						<div className="space-y-2">
							{request.attachments.map((attachment) => (
								<AttachmentRow
									key={attachment.id}
									attachment={attachment}
								/>
							))}
						</div>
					)}
				</div>

				{/* Approval path */}
				<div className="space-y-3">
					<span className="text-[11px] font-semibold text-foreground">مسار الموافقات</span>
					<div>
						{steps.map((step, i) => (
							<ApprovalTimelineItem
								key={step.id}
								step={step}
								isLast={i === steps.length - 1}
								onAction={onAction}
								onSendReview={onSendReview}
								reviewSent={reviewSent}
								// الطلب الملغى أو المرفوض نهائي — لا اعتماد ولا رفض
								actionsLocked={isCanceled || request.status === "rejected"}
							/>
						))}
					</div>

					{/* بعد الصرف: إيصال "تم الصرف" بدل صندوق التعليقات */}
					{request.status === "paid" ? (
						<div className="flex flex-col items-center gap-3 py-2 text-center">
							<p className="text-[13px] text-muted-foreground">
								هذا الإيصال وثيقة رسمية صادرة عن نظام إدارة المصروفات
							</p>
							<span className="flex size-[72px] flex-col items-center justify-center gap-0.5 rounded-full border-2 border-dashed border-emerald-400 text-emerald-600">
								<span className="text-[11px] font-semibold leading-tight">
									تم
									<br />
									الصرف
								</span>
								<IconCircleCheck className="size-3.5" />
							</span>
						</div>
					) : request.status === "canceled" ? (
						/* بعد الإلغاء: سبب الإلغاء بدل صندوق التعليقات */
						<div className="space-y-2 rounded-lg border border-muted bg-muted/40 p-3">
							<div className="flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground">
								<IconBan className="size-3.5" />
								تم إلغاء الطلب
							</div>
							<p className="text-[12px] text-foreground">
								{request.cancelReason || "لم يُذكر سبب الإلغاء."}
							</p>
						</div>
					) : (
						<div className="rounded-lg border p-3">
							<Input
								placeholder="اضافة تعليق..."
								className="border-0 px-0 shadow-none focus-visible:ring-0"
							/>
							<div className="mt-2 flex items-center gap-3 text-muted-foreground">
								<button
									type="button"
									className="hover:text-foreground"
								>
									<IconUpload className="size-4" />
								</button>
								<button
									type="button"
									className="hover:text-foreground"
								>
									<IconMoodSmile className="size-4" />
								</button>
								<button
									type="button"
									className="hover:text-foreground"
								>
									<IconAt className="size-4" />
								</button>
								<button
									type="button"
									className="hover:text-foreground"
								>
									<IconLink className="size-4" />
								</button>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Footer */}
			<div className="flex items-center justify-between gap-3 border-t px-4 py-2">
				{/* مشاركة/طباعة/تنزيل تظهر فقط بعد إتمام الصرف */}
				<div className="flex items-center gap-2">
					{showExport && (
						<>
							<Button
								type="button"
								variant="outline"
								size="sm"
							>
								<IconShare className="size-3.5" />
								مشاركة
							</Button>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={handlePrint}
							>
								<IconPrinter className="size-3.5" />
								طباعة
							</Button>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={handlePrint}
							>
								<IconDownload className="size-3.5" />
								تنزيل PDF
							</Button>
						</>
					)}
				</div>

				<div className="flex items-center gap-2">
					{/* قبل الإرسال حذف نهائي؛ بعده إلغاء الطلب — ويُخفى الإلغاء بعد الحالات النهائية */}
					{!locked ? (
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="border-destructive text-destructive hover:bg-destructive/5 hover:text-destructive"
							onClick={onDelete}
						>
							<IconTrash className="size-3.5" />
							حذف الطلب
						</Button>
					) : canCancel ? (
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="border-destructive text-destructive hover:bg-destructive/5 hover:text-destructive"
							onClick={onCancel}
						>
							<IconBan className="size-3.5" />
							إلغاء الطلب
						</Button>
					) : null}
					{/* لا تعديل بعد الصرف (تم الصرف) ولا بعد الإلغاء (ملغى — نهائي) */}
					{!isPaid && !isCanceled && (
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={onEdit}
						>
							<IconPencil className="size-3.5" />
							تعديل الطلب
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
