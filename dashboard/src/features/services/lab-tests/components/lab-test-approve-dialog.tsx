import { zodResolver } from "@hookform/resolvers/zod";
import { IconAlertTriangleFilled, IconCircleCheck, IconX } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { FieldLabel } from "@/components/common/field-label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
	MentionTextarea,
	type MentionUser,
} from "@/features/appointments/components/tabs/visit-info/mention-textarea";
import { useApproveLabTest } from "@/features/services/lab-tests/hooks/use-lab-test-mutations";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { LabResultFlag } from "@/generated/prisma/enums";
import {
	type ApproveLabTestFormInput,
	type ApproveLabTestFormValues,
	approveLabTestSchema,
	type LabTestItemResponse,
	type LabTestOrderResponse,
} from "@sanad/contracts/runtime/server/lab-tests/lab-tests.type";

// نفس بنية حوار قرار المراجعة في المصروفات — تخطيط LTR داخلي بمحاذاة يمينية،
// ورأس/تذييل RTL. التقرير مطلوب قبل الاعتماد.

export function LabTestApproveDialog({
	order,
	item,
	open,
	onOpenChange,
	initialReport,
}: {
	order: LabTestOrderResponse;
	item: LabTestItemResponse;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** مسودّة التقرير المكتوبة في اللوحة (قد تكون غير محفوظة بعد) */
	initialReport?: string;
}) {
	const { approve, isPending } = useApproveLabTest();

	const [mentionedStaffIds, setMentionedStaffIds] = useState<string[]>([]);
	// نفس مصدر الإشارات في ملاحظات الزيارة — طاقم الأكاديمية
	const { staff } = useStaff();
	const mentionables = useMemo<MentionUser[]>(
		() => staff.map((s) => ({ id: s.id, name: s.name })),
		[staff],
	);

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ApproveLabTestFormInput, unknown, ApproveLabTestFormValues>({
		resolver: zodResolver(approveLabTestSchema),
		defaultValues: { report: "", mentionedStaffIds: [] },
	});

	// نبدأ من المسودّة المكتوبة في اللوحة (ولو لم تُحفظ)، وإلا من المحفوظة على الخادم.
	// نضبط عند الفتح فقط حتى لا تُمحى كتابة المراجِع داخل الحوار.
	// biome-ignore lint/correctness/useExhaustiveDependencies: الضبط عند الفتح فقط
	useEffect(() => {
		if (open) {
			reset({
				report: initialReport?.trim() || (item.report ?? ""),
				mentionedStaffIds: [],
			});
			// الإشارات المحفوظة تبقى سارية حتى يُعيد المراجِع كتابتها
			setMentionedStaffIds(item.reportMentions.map((m) => m.staff.id));
		}
	}, [open]);

	const criticalCount = item.results.filter((r) => r.flag !== LabResultFlag.NORMAL).length;

	const onSubmit = handleSubmit(async (values) => {
		try {
			await approve({ itemId: item.id, report: values.report, mentionedStaffIds });
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
				<DialogTitle className="sr-only">اعتماد نتائج التحليل</DialogTitle>

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
							<span className="text-emerald-600">اعتماد النتائج</span>
							<span className="text-muted-foreground">›</span>
							<span className="text-muted-foreground">تحليل</span>
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
							هل أنت متأكد من اعتماد نتائج هذا التحليل؟ سينتقل إلى «مكتملة» ويُحفظ التقرير معه،
							ولن تعود النتائج قابلة للتعديل.
						</p>

						{criticalCount > 0 && (
							<div className="flex items-start gap-2 rounded-[4px] border border-red-200 bg-red-50 p-3">
								<IconAlertTriangleFilled className="mt-0.5 size-4 shrink-0 text-red-600" />
								<p className="text-right text-[12px] text-red-700">
									يحتوي هذا التحليل على {criticalCount} قيمة خارج النطاق الطبيعي — تأكّد من
									ذكرها في التقرير.
								</p>
							</div>
						)}

						{/* تفاصيل التحليل — القيمة يسار والتسمية يمين */}
						<div className="space-y-1.5 rounded-[4px] border px-4 py-3">
							<div className="flex items-center justify-between">
								<span className="text-[12px] font-medium text-foreground">
									{item.service.name}
								</span>
								<span className="text-[12px] text-muted-foreground">التحليل</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-[12px] font-medium text-foreground">
									{order.patient.name}
								</span>
								<span className="text-[12px] text-muted-foreground">الطفل</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-[12px] font-medium tabular-nums text-foreground">
									{item.results.length}
								</span>
								<span className="text-[12px] text-muted-foreground">عدد النتائج</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-[12px] font-medium text-foreground">
									{item.assignedTo?.name ?? "غير معيَّن"}
								</span>
								<span className="text-[12px] text-muted-foreground">فنّي المختبر</span>
							</div>
						</div>

						{/* تقرير المراجعة */}
						<div className="space-y-1.5">
							{/* جسم الحوار LTR — نعكس الصف ليطابق ترتيب نماذج الإنشاء: التسمية يمينًا ثم الوسم */}
							<FieldLabel
								required
								className="flex-row-reverse"
							>
								<span className="text-[12px] font-medium text-foreground">تقرير المراجعة</span>
							</FieldLabel>
							<Controller
								control={control}
								name="report"
								render={({ field }) => (
									<MentionTextarea
										value={field.value ?? ""}
										onChange={field.onChange}
										users={mentionables}
										onMentionsChange={setMentionedStaffIds}
										disabled={isPending}
										placeholder="اكتب خلاصة قراءة النتائج... استخدم @ للإشارة إلى زميل"
										className="min-h-28 text-right"
									/>
								)}
							/>
							{errors.report && (
								<p className="text-right text-[11px] text-destructive">
									{errors.report.message}
								</p>
							)}
						</div>
					</div>

					{/* Footer — RTL: الزر الرئيسي يمين */}
					<div className="flex items-center gap-2 border-t p-3">
						<Button
							type="submit"
							className="bg-emerald-500 primaryhover:bg-emerald-600"
							disabled={isPending}
						>
							<IconCircleCheck className="size-4" />
							اعتماد النتائج
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
