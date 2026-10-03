import { zodResolver } from "@hookform/resolvers/zod";
import { IconAlertTriangleFilled, IconCircleX, IconX } from "@tabler/icons-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { FieldLabel } from "@/components/common/field-label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useDeclineRadiology } from "@/features/services/radiology/hooks/use-radiology-mutations";
import { useRadiologyOrder } from "@/features/services/radiology/hooks/use-radiology-order";
import {
	type DeclineRadiologyFormInput,
	declineRadiologySchema,
} from "@sanad/contracts/runtime/server/radiology/radiology.type";

// نفس بنية حوار رفض الطلب في التحاليل — تخطيط LTR داخلي بمحاذاة يمينية،
// ورأس/تذييل RTL. الرفض يُلغي الطلب ويُشعر المدرّب الطالب بالسبب.

export function RadiologyDeclineDialog({
	orderId,
	open,
	onOpenChange,
	onDeclined,
}: {
	orderId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onDeclined?: () => void;
}) {
	const { order } = useRadiologyOrder(open ? orderId : null);
	const { decline, isPending } = useDeclineRadiology();

	const examsLabel = order?.items.map((i) => i.service.name).join("، ") ?? "—";

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<DeclineRadiologyFormInput>({
		resolver: zodResolver(declineRadiologySchema),
		defaultValues: { reason: "" },
	});

	useEffect(() => {
		if (open) reset({ reason: "" });
	}, [open, reset]);

	const onSubmit = handleSubmit(async (values) => {
		try {
			await decline({ id: orderId, reason: values.reason });
		} catch {
			return; // الفشل يُبقي النافذة مفتوحة (التوست يعرض السبب)
		}
		onOpenChange(false);
		// الطلب حُذف — لوحة التفاصيل لم يعد لها ما تعرضه
		onDeclined?.();
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
				<DialogTitle className="sr-only">رفض طلب الأشعة</DialogTitle>

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
							<span className="text-rose-600">رفض الطلب</span>
							<span className="text-muted-foreground">›</span>
							<span className="text-muted-foreground">الطلبات</span>
							<span className="text-muted-foreground">›</span>
							<span className="truncate text-foreground">
								{order ? `${examsLabel} . ${order.code}#` : "—"}
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
							هل أنت متأكد من رفض هذا الطلب؟ سيُحذف من اللوحة ويصل المدرّب الطالب إشعارٌ في الوارد
							يتضمّن سبب الرفض.
						</p>

						<div className="flex items-start gap-2 rounded-[4px] border border-amber-200 bg-amber-50 p-3">
							<IconAlertTriangleFilled className="mt-0.5 size-4 shrink-0 text-amber-600" />
							<p className="text-right text-[12px] text-amber-800">
								لا يمكن التراجع عن هذا الإجراء — لإعادة الفحص يلزم إنشاء طلب جديد.
							</p>
						</div>

						{/* تفاصيل الطلب — القيمة يسار والتسمية يمين */}
						<div className="space-y-1.5 rounded-[4px] border px-4 py-3">
							<div className="flex items-center justify-between">
								<span className="text-[12px] font-medium text-foreground">{examsLabel}</span>
								<span className="text-[12px] text-muted-foreground">
									{(order?.items.length ?? 0) > 1 ? "الفحوصات" : "الفحص"}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-[12px] font-medium text-foreground">
									{order?.patient.name ?? "—"}
								</span>
								<span className="text-[12px] text-muted-foreground">الطفل</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-[12px] font-medium text-foreground">
									{order?.requestedBy?.name ?? "—"}
								</span>
								<span className="text-[12px] text-muted-foreground">
									المدرّب الطالب (سيصله الإشعار)
								</span>
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
								placeholder="مثال: الفحص غير مبرَّر سريريًا، أو مكرّر لدراسة حديثة"
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
							رفض الطلب
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
