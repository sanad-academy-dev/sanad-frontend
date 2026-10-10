import { zodResolver } from "@hookform/resolvers/zod";
import { IconAlertTriangleFilled, IconCircleX, IconX } from "@tabler/icons-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { FieldLabel } from "@/components/common/field-label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useLabTest } from "@/features/services/lab-tests/hooks/use-lab-test";
import { useDeclineLabTest } from "@/features/services/lab-tests/hooks/use-lab-test-mutations";
import {
	type DeclineLabTestFormInput,
	declineLabTestSchema,
} from "@sanad/contracts/runtime/server/lab-tests/lab-tests.type";

// نفس بنية حوارات القرار في المصروفات — تخطيط LTR داخلي بمحاذاة يمينية،
// ورأس/تذييل RTL. رفض الطلب من الطابور: حذف + إشعار المدرّب الطالب بالسبب.

export function LabTestDeclineDialog({
	labTestId,
	open,
	onOpenChange,
	onDeclined,
}: {
	labTestId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** يُستدعى بعد نجاح الرفض (لإغلاق لوحة التفاصيل مثلًا) */
	onDeclined?: () => void;
}) {
	const { labTest } = useLabTest(open ? labTestId : null);
	const { decline, isPending } = useDeclineLabTest();

	// رفض الطلب يرفض كل تحاليله — نعرضها مجموعة حتى يعرف المُراجع ما يرفضه
	const testsLabel = labTest?.items.map((i) => i.service.name).join("، ") ?? "—";

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<DeclineLabTestFormInput>({
		resolver: zodResolver(declineLabTestSchema),
		defaultValues: { reason: "" },
	});

	useEffect(() => {
		if (open) reset({ reason: "" });
	}, [open, reset]);

	const onSubmit = handleSubmit(async (values) => {
		try {
			await decline({ id: labTestId, reason: values.reason });
		} catch {
			return; // الفشل يُبقي النافذة مفتوحة (التوست يعرض السبب)
		}
		onOpenChange(false);
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
				<DialogTitle className="sr-only">رفض طلب التحليل</DialogTitle>

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
							<span className="text-muted-foreground">الطابور</span>
							<span className="text-muted-foreground">›</span>
							<span className="truncate text-foreground">
								{labTest ? `${testsLabel} . ${labTest.code}#` : "—"}
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
								لا يمكن التراجع عن هذا الإجراء — لإعادة التحليل يلزم إنشاء طلب جديد.
							</p>
						</div>

						{/* تفاصيل الطلب — القيمة يسار والتسمية يمين */}
						<div className="space-y-1.5 rounded-[4px] border px-4 py-3">
							<div className="flex items-center justify-between">
								<span className="text-[12px] font-medium text-foreground">{testsLabel}</span>
								<span className="text-[12px] text-muted-foreground">
									{(labTest?.items.length ?? 0) > 1 ? "التحاليل" : "التحليل"}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-[12px] font-medium text-foreground">
									{labTest?.patient.name ?? "—"}
								</span>
								<span className="text-[12px] text-muted-foreground">الطفل</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-[12px] font-medium text-foreground">
									{labTest?.requestedBy?.name ?? "—"}
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
								placeholder="مثال: التحليل غير متوفّر حاليًا — يُرجى تحويل الطفل لمختبر خارجي"
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
							رفض وحذف الطلب
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
