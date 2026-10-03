import { zodResolver } from "@hookform/resolvers/zod";
import { IconCircleX, IconX } from "@tabler/icons-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { FieldLabel } from "@/components/common/field-label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useRejectRadiology } from "@/features/services/radiology/hooks/use-radiology-mutations";
import {
	type RadiologyItemResponse,
	type RadiologyOrderResponse,
	type RejectRadiologyFormInput,
	rejectRadiologySchema,
} from "@sanad/contracts/runtime/server/radiology/radiology.type";
import { MODALITY_META } from "@sanad/contracts/runtime/server/radiology/radiology-procedure.type";

// ملاحظة RTL: نفس بنية حوار قرار المراجعة في التحاليل — تخطيط LTR داخلي
// بمحاذاة نص يمينية (صفوف justify-between: القيمة يسارًا والتسمية يمينًا)،
// مع رأس وتذييل RTL. نضع dir على غلاف داخلي لا على DialogContent حتى يبقى التوسيط سليمًا.

export function RadiologyRejectDialog({
	order,
	item,
	open,
	onOpenChange,
}: {
	order: RadiologyOrderResponse;
	item: RadiologyItemResponse;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const { reject, isPending } = useRejectRadiology();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<RejectRadiologyFormInput>({
		resolver: zodResolver(rejectRadiologySchema),
		defaultValues: { reason: "" },
	});

	useEffect(() => {
		if (open) reset({ reason: "" });
	}, [open, reset]);

	const imagesCount = item.studies.reduce(
		(sum, study) => sum + study.series.reduce((s, series) => s + series.instances.length, 0),
		0,
	);

	const onSubmit = handleSubmit(async (values) => {
		try {
			await reject({ itemId: item.id, reason: values.reason });
		} catch {
			return; // الفشل يُبقي النافذة مفتوحة (التوست يعرض السبب)
		}
		onOpenChange(false);
	});

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				showCloseButton={false}
				className="max-h-[85vh] gap-0 overflow-hidden p-0 sm:max-w-xl"
			>
				<DialogTitle className="sr-only">رفض تقرير الأشعة</DialogTitle>

				<form
					dir="ltr"
					className="flex max-h-[85vh] flex-col"
					onSubmit={onSubmit}
				>
					{/* Header — RTL: المسار يمين وأزرار التحكم يسار */}
					<div
						dir="rtl"
						className="flex items-center justify-between gap-2 border-b p-3"
					>
						<div className="flex min-w-0 items-center gap-1.5 text-[13px] font-semibold">
							<span className="text-rose-600">رفض التقرير</span>
							<span className="text-muted-foreground">›</span>
							<span className="text-muted-foreground">أشعة</span>
							<span className="text-muted-foreground">›</span>
							<span className="truncate text-foreground">
								{`${item.service.name} . ${order.code}#`}
							</span>
						</div>
						<button
							type="button"
							onClick={() => onOpenChange(false)}
							className="flex size-6 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
						>
							<IconX className="size-4" />
							<span className="sr-only">إغلاق</span>
						</button>
					</div>

					<div className="flex-1 space-y-4 overflow-y-auto p-3">
						<p className="text-right text-[13px] text-foreground">
							هل أنت متأكد من رفض هذا التقرير؟ سيعود الفحص إلى «كتابة التقرير» مع شارة «تم
							رفضها»، ويظهر السبب لفنّي الأشعة.
						</p>

						{/* تفاصيل الفحص — القيمة يسار والتسمية يمين */}
						<div className="space-y-1.5 rounded-[4px] border px-4 py-3">
							<div className="flex items-center justify-between">
								<span className="text-[12px] font-medium text-foreground">
									{item.service.name}
								</span>
								<span className="text-[12px] text-muted-foreground">الفحص</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-[12px] font-medium text-foreground">
									{order.patient.name}
								</span>
								<span className="text-[12px] text-muted-foreground">الطفل</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-[12px] font-medium text-foreground">
									{MODALITY_META[item.modality].label}
								</span>
								<span className="text-[12px] text-muted-foreground">طريقة التصوير</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-[12px] font-medium tabular-nums text-foreground">
									{imagesCount}
								</span>
								<span className="text-[12px] text-muted-foreground">عدد الصور</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-[12px] font-medium text-foreground">
									{item.assignedTo?.name ?? "غير معيَّن"}
								</span>
								<span className="text-[12px] text-muted-foreground">فنّي الأشعة</span>
							</div>
						</div>

						{/* سبب الرفض */}
						<div className="space-y-1.5">
							{/* جسم الحوار LTR — نعكس الصف ليطابق ترتيب نماذج الإنشاء: التسمية يمينًا ثم الوسم */}
							<FieldLabel
								required
								className="flex-row-reverse"
							>
								<span className="text-[12px] font-medium text-foreground">سبب الرفض</span>
							</FieldLabel>
							<Textarea
								disabled={isPending}
								aria-invalid={!!errors.reason}
								placeholder="مثال: الموجودات لا تغطي كل الإسقاطات — يلزم استكمال القراءة"
								className="min-h-20 text-right"
								{...register("reason")}
							/>
							{errors.reason && (
								<p className="text-right text-[11px] text-destructive">
									{errors.reason.message}
								</p>
							)}
						</div>
					</div>

					{/* Footer — RTL: الزر الرئيسي يمين */}
					<div className="flex items-center gap-2 border-t p-3">
						<Button
							type="submit"
							className="bg-rose-500 primaryhover:bg-rose-600"
							disabled={isPending}
						>
							<IconCircleX className="size-4" />
							رفض التقرير
						</Button>
						<Button
							type="button"
							variant="outline"
							disabled={isPending}
							onClick={() => onOpenChange(false)}
						>
							إلغاء
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
