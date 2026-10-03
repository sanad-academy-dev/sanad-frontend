import {
	IconArrowsDiagonal,
	IconCircleCheck,
	IconCircleX,
	IconFileText,
	IconHome,
	IconX,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ExpenseMiniStepper } from "@/features/finance/expenses/components/expense-mini-stepper";
import { buildCardSteps } from "@/features/finance/expenses/data/expense-records";
import { cn } from "@/lib/utils";
import type { ExpenseResponse } from "@/server/expenses/expenses.type";

// عنوان فرعي حسب الخطوة الحالية المعلّقة
const subtitleFor = (steps: ExpenseResponse["steps"]): string => {
	const pending = (type: string) =>
		steps.some((s) => s.type === type && s.state === "PENDING");
	if (pending("MANAGER_REVIEW")) return "تم الإرسال وفي انتظار موافقة المدير العام";
	if (pending("FINANCE_APPROVAL"))
		return "تمت موافقة المدير العام وفي انتظار موافقة المدير المالي";
	if (pending("DISBURSEMENT")) return "تمت الاعتمادات وفي انتظار الصرف";
	return "بانتظار الإجراء";
};

function ApprovalCard({
	expense,
	onDecision,
	onTrack,
}: {
	expense: ExpenseResponse;
	onDecision: (id: string, decision: "approve" | "reject") => void;
	onTrack: (id: string) => void;
}) {
	const steps = buildCardSteps(expense.steps);
	return (
		<div
			className="flex flex-col gap-3 rounded-[4px] border bg-card p-3"
			dir="rtl"
		>
			{/* Header — الأيقونة والعنوان يمين، زر تتبع الحالة يسار */}
			<div className="flex items-center justify-between gap-2 border-b pb-3">
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => onTrack(expense.id)}
					className="h-[22px] border-primary px-2 py-0.5 text-[10px] text-primary hover:bg-primary/5"
				>
					تتبع حالة الطلب
				</Button>
				<div className="flex items-center gap-1.5">
					<div className="flex min-w-0 flex-col items-end gap-1 text-right">
						<p className="truncate text-[12px] font-medium text-foreground">{expense.name}</p>
						<p className="truncate text-[11px] text-muted-foreground">
							{subtitleFor(expense.steps)}
						</p>
					</div>
					<span className="flex size-9 shrink-0 items-center justify-center rounded-[4px] bg-muted">
						<IconFileText className="size-5 text-muted-foreground" />
					</span>
				</div>
			</div>

			{/* Stepper — من اليمين (إرسال) إلى اليسار (الدفع): نعكس الترتيب لأن البطاقة RTL */}
			<div className="border-b pb-3">
				<ExpenseMiniStepper steps={[...steps].reverse()} />
			</div>

			{/* Actions — قبول (يمين) / رفض (يسار) */}
			<div className="flex items-center gap-1.5">
				<button
					type="button"
					onClick={() => onDecision(expense.id, "approve")}
					className="flex h-6 flex-1 items-center justify-center gap-1 rounded-[4px] bg-[#22c55e]/[0.04] text-[10px] font-medium text-[#22c55e] transition-colors hover:bg-[#22c55e]/10"
				>
					قبول
					<IconCircleCheck className="size-3.5" />
				</button>
				<button
					type="button"
					onClick={() => onDecision(expense.id, "reject")}
					className="flex h-6 flex-1 items-center justify-center gap-1 rounded-[4px] bg-[#ff6467]/[0.04] text-[10px] font-medium text-[#ff6467] transition-colors hover:bg-[#ff6467]/10"
				>
					رفض
					<IconCircleX className="size-3.5" />
				</button>
			</div>
		</div>
	);
}

export function ExpenseApprovalsSheet({
	open,
	onOpenChange,
	approvals,
	isLoading,
	onDecision,
	onTrack,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	approvals: ExpenseResponse[];
	isLoading: boolean;
	onDecision: (id: string, decision: "approve" | "reject") => void;
	onTrack: (id: string) => void;
}) {
	return (
		<Sheet
			open={open}
			onOpenChange={onOpenChange}
		>
			<SheetContent
				side="left"
				dir="rtl"
				showCloseButton={false}
				className={cn("flex w-full flex-col gap-0 border p-0 sm:max-w-md", "bg-popover")}
			>
				{/* Header — الأيقونات يسار، المسار يمين */}
				<div className="flex items-center justify-between border-b px-4 py-2">
					<div className="flex items-center gap-1">
						<button
							type="button"
							onClick={() => onOpenChange(false)}
							className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
						>
							<IconX className="size-4" />
							<span className="sr-only">إغلاق</span>
						</button>
						<button
							type="button"
							className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
						>
							<IconArrowsDiagonal className="size-4" />
							<span className="sr-only">توسيع</span>
						</button>
					</div>
					<h2 className="flex items-center gap-1.5 text-[13px] font-bold text-foreground">
						المصروفات
						<span className="text-muted-foreground">›</span>
						<span className="text-[10px] font-medium">طلبات الاعتمادات</span>
					</h2>
				</div>

				{/* Body — قائمة الطلبات */}
				<div className="flex-1 space-y-2.5 overflow-y-auto p-3">
					{isLoading ? (
						<p className="py-10 text-center text-[12px] text-muted-foreground">
							جارٍ التحميل...
						</p>
					) : approvals.length === 0 ? (
						<div className="flex flex-col items-center gap-2 py-16 text-center">
							<IconCircleCheck className="size-10 text-muted-foreground/40" />
							<p className="text-[13px] font-medium text-foreground">
								لا توجد طلبات بانتظار إجرائك
							</p>
							<p className="text-[11px] text-muted-foreground">
								ستظهر هنا الطلبات التي أُرسلت إليك للمراجعة والاعتماد.
							</p>
						</div>
					) : (
						approvals.map((expense) => (
							<ApprovalCard
								key={expense.id}
								expense={expense}
								onDecision={onDecision}
								onTrack={onTrack}
							/>
						))
					)}
				</div>

				{/* Footer — الرجوع للرئيسية */}
				<div className="flex items-center justify-between border-t px-4 py-2">
					<Button
						type="button"
						size="sm"
						onClick={() => onOpenChange(false)}
						className="h-6 gap-1 px-4 text-[10px]"
					>
						<IconHome className="size-3" />
						الرجوع للرئيسية
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
}
