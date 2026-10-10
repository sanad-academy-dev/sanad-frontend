import {
	IconArrowsDiagonal,
	IconCircleX,
	IconInfoCircle,
	IconPlus,
	IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { IconValidationApproval } from "@/features/finance/expenses/components/approval-step-icons";
import type { SubmittedExpenseRequest } from "@/features/finance/expenses/data/expense-review";
import { cn } from "@/lib/utils";

export type ReviewDecision = "approve" | "reject" | "disburse";

// ملاحظة RTL: هذا الحوار تخطيط LTR بمحاذاة نص يمينية (صفوف justify-between، القيمة أولاً).
// نضع dir="ltr" على غلاف داخلي (لا على DialogContent حتى يبقى التوسيط سليماً)، والتذييل RTL.

const DECISION_CONFIG: Record<
	ReviewDecision,
	{
		headerClass: string;
		intro: string;
		notesDefault: string;
		buttonLabel: string;
		buttonClass: string;
	}
> = {
	approve: {
		headerClass: "text-emerald-600",
		intro:
			"هل أنت متأكد من اعتماد هذا المصروف؟ سيتم إرساله إلى قسم المالية للاعتماد النهائي وتسجيل الدفع.",
		notesDefault: "تمت الموافقة مع الالتزام بالمواصفات المعتمدة",
		buttonLabel: "اعتماد المصروف",
		buttonClass: "bg-emerald-500 hover:bg-emerald-600",
	},
	reject: {
		headerClass: "text-rose-600",
		intro: "هل أنت متأكد من رفض هذا المصروف؟ سيتم إشعار مقدم الطلب بالرفض مع سبب القرار.",
		notesDefault: "تم الرفض لعدم مطابقة المواصفات المطلوبة.",
		buttonLabel: "رفض المصروف",
		buttonClass: "bg-rose-500 hover:bg-rose-600",
	},
	disburse: {
		headerClass: "text-emerald-600",
		intro:
			"هل أنت متأكد من صرف هذا المصروف؟ سيتم تسجيل عملية الصرف وتحديث حالة الطلب إلى «تم الصرف».",
		notesDefault: "تم صرف المصروف بعد استكمال جميع الاعتمادات المطلوبة.",
		buttonLabel: "صرف المصروف",
		buttonClass: "bg-emerald-500 hover:bg-emerald-600",
	},
};

const HEADER_LABEL: Record<ReviewDecision, string> = {
	approve: "اعتماد المدير العام",
	reject: "رفض المدير العام",
	disburse: "تأكيد الصرف",
};

export function ReviewDecisionDialog({
	open,
	onOpenChange,
	request,
	decision,
	signerName,
	onConfirm,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	request: SubmittedExpenseRequest;
	decision: ReviewDecision;
	/** اسم المستخدم الحالي — يُستخدم كتوقيع عند الضغط على "إضافة توقيع" */
	signerName: string;
	onConfirm: (signatureName: string, notes: string) => void;
}) {
	const config = DECISION_CONFIG[decision];
	const [notes, setNotes] = useState(config.notesDefault);
	const [notifyManager, setNotifyManager] = useState(false);
	// التوقيع مطلوب — الضغط على "إضافة توقيع" يجلب اسم المستخدم الحالي
	const [signature, setSignature] = useState<string | null>(null);

	useEffect(() => {
		if (!open) return;
		setNotes(config.notesDefault);
		setNotifyManager(false);
		setSignature(null);
	}, [open, config.notesDefault]);

	const handleConfirm = () => {
		if (!signature) return; // التوقيع مطلوب
		onConfirm(signature, notes.trim());
		onOpenChange(false);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				showCloseButton={false}
				className="max-h-[85vh] gap-0 overflow-hidden p-0 sm:max-w-xl"
			>
				<DialogTitle className="sr-only">{config.buttonLabel}</DialogTitle>

				{/* غلاف LTR داخلي (التصميم LTR بمحاذاة يمينية) مع إبقاء توسيط الحوار */}
				<div
					dir="ltr"
					className="flex max-h-[85vh] flex-col"
				>
					{/* Header — RTL: الأيقونات يمين، المسار يسار */}
					<div
						dir="rtl"
						className="flex items-center justify-between gap-2 border-b p-3"
					>
						<div className="flex items-center gap-1.5 text-[13px] font-semibold">
							<span className={config.headerClass}>{HEADER_LABEL[decision]}</span>
							<span className="text-muted-foreground">›</span>
							<span className="text-muted-foreground">طلب مصروف</span>
							<span className="text-muted-foreground">›</span>
							<span className="text-foreground">
								شراء {request.title.replace("مراجعة ", "")} . {request.code}#
							</span>
						</div>
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
					</div>

					<div className="flex-1 space-y-4 overflow-y-auto p-3">
						{/* Intro (right-aligned) */}
						<p className="text-right text-[13px] text-foreground">{config.intro}</p>

						{/* Details box — القيمة يسار، التسمية يمين */}
						<div className="space-y-1.5 rounded-[4px] border px-4 py-3">
							<div className="flex items-center justify-between">
								<span className="text-[12px] font-medium text-foreground">
									{request.amountLabel}
								</span>
								<span className="text-[12px] text-muted-foreground">المبلغ</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-[12px] font-medium text-foreground">
									{request.title.replace("مراجعة ", "")}
								</span>
								<span className="text-[12px] text-muted-foreground">المصروف</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-[12px] font-medium text-foreground">
									{request.departmentLabel}
								</span>
								<span className="text-[12px] text-muted-foreground">القسم</span>
							</div>
						</div>

						{/* Notes */}
						<div className="space-y-1.5">
							<div className="flex items-center justify-end gap-1">
								<span className="text-[12px] font-medium text-foreground">ملاحظات إضافية</span>
								<IconInfoCircle className="size-3.5 text-muted-foreground" />
							</div>
							<Textarea
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								className="min-h-20 text-right"
							/>
						</div>

						{/* Signature */}
						<div className="space-y-1.5">
							<div className="flex items-center justify-end gap-1.5">
								<span className="rounded-[4px] bg-rose-600/[0.06] px-1.5 py-0.5 text-[10px] font-medium text-rose-600">
									مطلوب
								</span>
								<span className="text-[12px] font-medium text-foreground">التوقيع</span>
								<IconInfoCircle className="size-3.5 text-muted-foreground" />
							</div>
							<div className="flex flex-col items-center justify-center gap-2 rounded-[4px] border py-6 text-center">
								{signature ? (
									<p className="font-[cursive] text-2xl text-foreground">{signature}</p>
								) : (
									<>
										<p className="text-[13px] font-medium text-foreground">أضف توقيعك هنا</p>
										<p className="text-[11px] text-muted-foreground">
											وقّع داخل المنطقة أدناه لإتمام{" "}
											{decision === "reject"
												? "رفض"
												: decision === "disburse"
													? "صرف"
													: "اعتماد"}{" "}
											هذا الطلب
										</p>
									</>
								)}
								<Button
									type="button"
									size="sm"
									variant="outline"
									onClick={() => setSignature((s) => (s ? null : signerName))}
								>
									<IconPlus className="size-3.5" />
									{signature ? "إزالة التوقيع" : "إضافة توقيع"}
								</Button>
							</div>
						</div>
					</div>

					{/* Footer — RTL: الزر الرئيسي يمين، ومفتاح الإشعار يساره */}
					<div className="flex items-center gap-2 border-t p-3">
						<Button
							type="button"
							className={cn("text-white", config.buttonClass)}
							onClick={handleConfirm}
						>
							{decision === "reject" ? (
								<IconCircleX className="size-4" />
							) : (
								<IconValidationApproval className="size-4" />
							)}
							{config.buttonLabel}
						</Button>
						<label
							htmlFor="decision-notify-manager"
							className="flex items-center gap-1.5 text-[10px] text-muted-foreground"
						>
							<Switch
								id="decision-notify-manager"
								size="sm"
								checked={notifyManager}
								onCheckedChange={setNotifyManager}
							/>
							إشعار المدير عبر البريد
						</label>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
