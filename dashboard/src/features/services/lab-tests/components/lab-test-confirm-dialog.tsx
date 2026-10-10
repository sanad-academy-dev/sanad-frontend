import { zodResolver } from "@hookform/resolvers/zod";
import { IconCircleCheck, IconInfoCircle, IconX } from "@tabler/icons-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PRIORITY_META } from "@/features/appointments/data/status-meta";
import { useClinicUsers } from "@/features/dashboard/hooks/use-clinic-users";
import { useLabTest } from "@/features/services/lab-tests/hooks/use-lab-test";
import { useConfirmLabTest } from "@/features/services/lab-tests/hooks/use-lab-test-mutations";
import { TaskPriority } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import {
	type ConfirmLabTestFormInput,
	type ConfirmLabTestFormValues,
	confirmLabTestSchema,
} from "@sanad/contracts/runtime/server/lab-tests/lab-tests.type";

// نفس بنية حوارات القرار في المصروفات — تخطيط LTR داخلي بمحاذاة يمينية،
// ورأس/تذييل RTL. تأكيد الطلب ينقله من الطابور إلى "مجدول".

/** Radix لا يقبل قيمة فارغة لعنصر Select — رمز للخيار "بدون" */
const NONE = "__none__";

const PRIORITY_ORDER = [
	TaskPriority.URGENT,
	TaskPriority.HIGH,
	TaskPriority.MEDIUM,
	TaskPriority.LOW,
] as const;

export function LabTestConfirmDialog({
	labTestId,
	open,
	onOpenChange,
}: {
	labTestId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const { labTest } = useLabTest(open ? labTestId : null);
	const { users, isLoading: usersLoading } = useClinicUsers();
	const { confirmLabTest, isPending } = useConfirmLabTest();

	// الطلب قد يضم عدة تحاليل — نعرضها مجموعة ونبدأ من فنّيها الموحّد إن وُجد
	const testsLabel = labTest?.items.map((i) => i.service.name).join("، ") ?? "—";
	const assigneeIds = new Set(labTest?.items.map((i) => i.assignedTo?.id ?? null) ?? []);
	const uniformAssigneeId = assigneeIds.size === 1 ? [...assigneeIds][0] : null;

	const { control, handleSubmit, register, reset } = useForm<
		ConfirmLabTestFormInput,
		unknown,
		ConfirmLabTestFormValues
	>({
		resolver: zodResolver(confirmLabTestSchema),
		defaultValues: { assignedToId: null, priority: null, notes: "" },
	});

	// نبدأ من القيم الحالية للطلب — التأكيد قد يكون مجرد تثبيت لما هو موجود
	// biome-ignore lint/correctness/useExhaustiveDependencies: الضبط عند الفتح فقط
	useEffect(() => {
		if (open) {
			reset({
				// الفنّي يُعيَّن لكل تحاليل الطلب — نبدأ من الفنّي الموحّد إن وُجد
				assignedToId: uniformAssigneeId,
				priority: labTest?.priority ?? null,
				notes: labTest?.notes ?? "",
			});
		}
	}, [open, labTest?.id]);

	const onSubmit = handleSubmit(async (values) => {
		try {
			await confirmLabTest({ id: labTestId, ...values });
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
				<DialogTitle className="sr-only">تأكيد طلب التحليل</DialogTitle>

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
							<span className="text-emerald-600">تأكيد الطلب</span>
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
							سينتقل الطلب من «الطابور» إلى «مجدول» ويدخل سير عمل المختبر. يمكنك تعيين فنّي
							المختبر وتحديد الأولوية قبل التأكيد.
						</p>

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
								<span className="text-[12px] text-muted-foreground">المدرّب الطالب</span>
							</div>
						</div>

						{/* فنّي المختبر */}
						<div className="space-y-1.5">
							<div className="flex items-center justify-end gap-1.5">
								<span className="text-[12px] font-medium text-foreground">فنّي المختبر</span>
								<IconInfoCircle className="size-3.5 text-muted-foreground" />
							</div>
							<Controller
								control={control}
								name="assignedToId"
								render={({ field }) => (
									<Select
										dir="rtl"
										value={field.value || NONE}
										onValueChange={(v) => field.onChange(v === NONE ? null : v)}
										disabled={isPending || usersLoading}
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="اختر الفنّي" />
										</SelectTrigger>
										<SelectContent
											dir="rtl"
											position="popper"
										>
											<SelectGroup>
												<SelectItem value={NONE}>بدون تعيين</SelectItem>
												{users.map((u) => (
													<SelectItem
														key={u.id}
														value={u.id}
													>
														{u.name}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
								)}
							/>
						</div>

						{/* الأولوية */}
						<div className="space-y-1.5">
							<div className="flex items-center justify-end gap-1.5">
								<span className="text-[12px] font-medium text-foreground">الأولوية</span>
								<IconInfoCircle className="size-3.5 text-muted-foreground" />
							</div>
							<Controller
								control={control}
								name="priority"
								render={({ field }) => (
									<Select
										dir="rtl"
										value={field.value || NONE}
										onValueChange={(v) => field.onChange(v === NONE ? null : v)}
										disabled={isPending}
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="بدون أولوية" />
										</SelectTrigger>
										<SelectContent
											dir="rtl"
											position="popper"
										>
											<SelectGroup>
												<SelectItem value={NONE}>بدون أولوية</SelectItem>
												{PRIORITY_ORDER.map((value) => (
													<SelectItem
														key={value}
														value={value}
													>
														<span
															className={cn("font-medium", PRIORITY_META[value].className)}
														>
															{PRIORITY_META[value].label}
														</span>
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
								)}
							/>
							<p className="text-right text-[11px] text-muted-foreground">
								اختيار «عاجلة» يضع التحليل في مقدمة اللوحة بشارة «عاجل».
							</p>
						</div>

						{/* ملاحظة اختيارية */}
						<div className="space-y-1.5">
							<div className="flex items-center justify-end gap-1.5">
								<span className="text-[10px] text-muted-foreground">اختياري</span>
								<span className="text-[12px] font-medium text-foreground">ملاحظة للمختبر</span>
								<IconInfoCircle className="size-3.5 text-muted-foreground" />
							</div>
							<Textarea
								disabled={isPending}
								placeholder="تعليمات إضافية لفنّي المختبر..."
								className="min-h-20 text-right"
								{...register("notes")}
							/>
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
							تأكيد الطلب
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
