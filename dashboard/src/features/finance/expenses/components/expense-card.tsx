import {
	IconCalendar,
	IconCircleCheck,
	IconCircleX,
	IconDotsVertical,
	IconEye,
	IconListNumbers,
	IconTrash,
	IconUserCircle,
	IconWallet,
} from "@tabler/icons-react";
import type { MouseEvent } from "react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExpenseMiniStepper } from "@/features/finance/expenses/components/expense-mini-stepper";
import {
	EXPENSE_CARD_STATUS_META,
	type ExpenseCardAction,
	type ExpenseRecord,
} from "@/features/finance/expenses/data/expense-records";
import { cn } from "@/lib/utils";

// ملاحظة RTL: البطاقة في Figma ليست dir="rtl" — بل تخطيط LTR مع محاذاة يمينية (items-end/text-right).
// لذلك ترتيب العناصر في الـ DOM = الترتيب البصري من اليسار لليمين. لا نضع dir="rtl" هنا.

function CardActionChip({
	action,
	onClick,
}: {
	action: ExpenseCardAction;
	onClick: () => void;
}) {
	const isReject = action.kind === "reject";
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"inline-flex flex-1 items-center justify-center gap-1 rounded-[4px] px-2 py-1 text-[12px] transition-colors",
				isReject
					? "bg-[#ff6467]/[0.04] text-[#ff6467] hover:bg-[#ff6467]/10"
					: "bg-[#22c55e]/[0.04] text-[#22c55e] hover:bg-[#22c55e]/10",
			)}
		>
			{action.label}
			{isReject ? (
				<IconCircleX className="size-3.5" />
			) : (
				<IconCircleCheck className="size-3.5" />
			)}
		</button>
	);
}

export function ExpenseCard({
	record,
	onOpen,
	onDelete,
	onAction,
	onOpenRejection,
}: {
	record: ExpenseRecord;
	onOpen: (id: string) => void;
	onDelete?: (id: string) => void;
	/** اتخاذ قرار (اعتماد/رفض) مباشرة من البطاقة دون فتح اللوحة */
	onAction?: (id: string, kind: ExpenseCardAction["kind"]) => void;
	/** فتح ملخّص الرفض عند النقر على حالة "مرفوض" */
	onOpenRejection?: (id: string) => void;
}) {
	const status = EXPENSE_CARD_STATUS_META[record.status];
	const isRejected = record.status === "rejected";

	return (
		<div
			dir="ltr"
			className="flex flex-col items-end gap-3 rounded-[4px] border bg-card p-3 transition-colors hover:border-primary/40"
		>
			{/* منطقة قابلة للنقر لفتح شاشة المراجعة */}
			<button
				type="button"
				onClick={() => onOpen(record.id)}
				className="flex w-full flex-col items-end gap-3 text-right"
			>
				{/* Header — الشارة (يسار) وعنوان محاذى لليمين (يمين) */}
				<div className="flex w-full items-start justify-between">
					{/* حالة "مرفوض" قابلة للنقر لفتح ملخّص الرفض (span بدور زر لتجنّب زر داخل زر) */}
					<span
						{...(isRejected && onOpenRejection
							? {
									role: "button",
									tabIndex: 0,
									onClick: (e: MouseEvent) => {
										e.stopPropagation();
										onOpenRejection(record.id);
									},
								}
							: {})}
						className={cn(
							"shrink-0 rounded-[4px] px-1.5 py-0.5 text-[10px] font-medium",
							status.className,
							isRejected && onOpenRejection && "cursor-pointer hover:opacity-80",
						)}
					>
						{status.label}
					</span>
					<div className="flex w-[115px] flex-col items-end text-right">
						<p className="w-full truncate text-[14px] font-bold text-foreground">
							{record.title}
						</p>
						<p className="w-full truncate text-[11px] text-muted-foreground">
							{record.categoryLabel} · {record.departmentLabel}
						</p>
					</div>
				</div>

				{/* Meta row — LTR: التاريخ (يسار) ... مقدم الطلب (يمين)، النص ثم الأيقونة */}
				<div className="flex w-full items-center justify-between text-[11px] text-[#9b9b9d]">
					<span className="flex items-center gap-1">
						{record.dateLabel}
						<IconCalendar className="size-3.5" />
					</span>
					<span className="size-0.5 rounded-full bg-current" />
					<span className="flex items-center gap-1">
						{record.amountLabel}
						<IconWallet className="size-3.5" />
					</span>
					<span className="size-0.5 rounded-full bg-current" />
					<span className="flex items-center gap-1">
						{record.code}
						<IconListNumbers className="size-3.5" />
					</span>
					<span className="size-0.5 rounded-full bg-current" />
					<span className="flex items-center gap-1">
						{record.requesterName}
						<IconUserCircle className="size-3.5" />
					</span>
				</div>

				{/* Stepper — LTR: الدفع (يسار) ... إرسال (يمين). الوصلة زرقاء بين العُقد النشطة */}
				<div className="w-full border-t pt-3">
					<ExpenseMiniStepper
						steps={record.steps}
						rejected={isRejected}
					/>
				</div>
			</button>

			{/* Actions — LTR: زر الخيارات (...) يسار، ثم رفض، ثم اعتماد (يمين) */}
			<div className="flex w-full items-center gap-1 border-t pt-3">
				<DropdownMenu dir="rtl">
					<DropdownMenuTrigger asChild>
						<button
							type="button"
							className="flex size-6 shrink-0 items-center justify-center rounded-[4px] border text-muted-foreground hover:bg-muted hover:text-foreground"
						>
							<IconDotsVertical className="size-4" />
							<span className="sr-only">خيارات</span>
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start">
						<DropdownMenuItem onClick={() => onOpen(record.id)}>
							<IconEye className="size-4" />
							عرض التفاصيل
						</DropdownMenuItem>
						{/* الحذف/الإلغاء غير متاح للمُرحَّل من موديول آخر ولا للسجلات المنتهية.
						    [P12A-fix5] «تم الصرف» عاد متاحًا — كإلغاء لا كحذف (destructiveMode). */}
						{onDelete &&
							!record.isPosted &&
							record.rawStatus !== "REJECTED" &&
							record.rawStatus !== "CANCELED" && (
								<DropdownMenuItem
									variant="destructive"
									onClick={() => onDelete(record.id)}
								>
									<IconTrash className="size-4" />
									{record.rawStatus === "DRAFT"
										? "حذف الطلب"
										: record.rawStatus === "PAID"
											? "إلغاء المصروف وعكس القيد"
											: "إلغاء الطلب"}
								</DropdownMenuItem>
							)}
					</DropdownMenuContent>
				</DropdownMenu>
				<div className="flex flex-1 items-center gap-1">
					{record.actions.map((action) => (
						<CardActionChip
							key={action.kind}
							action={action}
							onClick={() => (onAction ? onAction(record.id, action.kind) : onOpen(record.id))}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
