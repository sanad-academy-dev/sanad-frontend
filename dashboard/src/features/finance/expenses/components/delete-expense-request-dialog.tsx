import {
	IconAlertCircle,
	IconArrowsDiagonal,
	IconBuilding,
	IconCalendar,
	IconCategory2,
	IconMapPin,
	IconTrash,
	IconUser,
	IconUserCircle,
	IconWallet,
	IconX,
} from "@tabler/icons-react";
import type { ComponentType } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Kbd } from "@/components/ui/kbd";
import { Switch } from "@/components/ui/switch";
import type { SubmittedExpenseRequest } from "@/features/finance/expenses/data/expense-review";

// ملاحظة RTL: التصميم LTR بمحاذاة نص يمينية (صفوف justify-between، القيمة أولاً).
// نضع dir="ltr" على الغلاف الداخلي (لا على DialogContent حتى يبقى التوسيط)، والتذييل RTL.

type IconType = ComponentType<{ className?: string }>;

// صف تفاصيل: القيمة على اليسار، والتسمية + الأيقونة على اليمين
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
		<div className="flex items-center justify-between py-1">
			<span className="text-[13px] font-medium text-foreground">{value}</span>
			<span className="flex items-center gap-1 text-[13px] text-muted-foreground">
				{label}
				<Icon className="size-3.5" />
			</span>
		</div>
	);
}

export function DeleteExpenseRequestDialog({
	open,
	onOpenChange,
	request,
	onConfirm,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	request: SubmittedExpenseRequest;
	onConfirm: () => void;
}) {
	const title = request.title.replace("مراجعة ", "");

	const handleConfirm = () => {
		onConfirm();
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
				<DialogTitle className="sr-only">حذف طلب مصروف</DialogTitle>

				<div
					dir="ltr"
					className="flex max-h-[85vh] flex-col"
				>
					{/* Header — الأيقونات يسار، المسار يمين */}
					<div className="flex items-center justify-between gap-2 border-b p-3">
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
						<div className="flex items-center gap-1.5 text-[13px] font-semibold">
							<span className="text-muted-foreground">مراجعة {title}</span>
							<span className="text-muted-foreground">›</span>
							<span className="flex items-center gap-1 text-rose-600">
								<IconTrash className="size-3.5" />
								حذف طلب مصروف
							</span>
						</div>
					</div>

					<div className="flex-1 space-y-4 overflow-y-auto p-3">
						{/* Intro */}
						<p className="text-right text-[13px] text-foreground">
							هل أنت متأكد من حذف طلب (<span className="font-semibold">مراجعة {title}</span>) ؟
							لا يمكن التراجع عن هذا الإجراء.
						</p>

						{/* Details box */}
						<div className="rounded-[4px] border p-3">
							{/* Title + status */}
							<div className="flex items-center justify-between pb-2">
								<span className="rounded-[4px] bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
									قيد المراجعة
								</span>
								<span className="text-[13px] font-bold text-foreground">
									مراجعة {title} . {request.code}#
								</span>
							</div>
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

						{/* Consequences box */}
						<div className="space-y-2 rounded-[4px] border border-rose-200 bg-rose-50/60 p-3">
							<div className="flex items-center justify-end gap-1 text-[13px] font-semibold text-rose-600">
								النتائج المترتبة:
								<IconAlertCircle className="size-3.5" />
							</div>
							<ul className="space-y-1">
								{[
									"حذف طلب المصروف نهائيًا من النظام.",
									"إزالة الطلب من قوائم المراجعة والاعتماد أو موافقات قيد التنفيذ.",
								].map((line) => (
									<li
										key={line}
										className="flex items-center justify-end gap-1.5 text-[12px] text-rose-600/90"
									>
										{line}
										<IconAlertCircle className="size-3 shrink-0" />
									</li>
								))}
							</ul>
						</div>
					</div>

					{/* Footer — RTL: زر الحذف يمين، والتذكير يساره */}
					<div
						dir="rtl"
						className="flex items-center gap-2 border-t p-3"
					>
						<Button
							type="button"
							variant="destructive"
							onClick={handleConfirm}
						>
							<IconTrash className="size-4" />
							حذف الطلب
							<Kbd className="text-white">⌘↵</Kbd>
						</Button>
						<span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
							<Switch size="sm" />
							ارسل اشعار
						</span>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
