import { zodResolver } from "@hookform/resolvers/zod";
import { IconCircleCheck, IconInfoCircle, IconX } from "@tabler/icons-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { DateTimePopover, nextQuarterHourDate } from "@/components/common/date-time-popover";
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
import { useConfirmRadiology } from "@/features/services/radiology/hooks/use-radiology-mutations";
import { useRadiologyOrder } from "@/features/services/radiology/hooks/use-radiology-order";
import { TaskPriority } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import {
	type ConfirmRadiologyFormInput,
	type ConfirmRadiologyFormValues,
	confirmRadiologySchema,
} from "@sanad/contracts/runtime/server/radiology/radiology.type";

// نفس بنية حوار التأكيد في التحاليل — تخطيط LTR داخلي بمحاذاة يمينية،
// ورأس/تذييل RTL. التأكيد ينقل فحوصات الطلب من «الطلبات» إلى «مجدول».

/** Radix لا يقبل قيمة فارغة لعنصر Select — نستخدم رمزًا للخيار "بدون" */
const NONE = "__none__";

const PRIORITY_ORDER = Object.values(TaskPriority);

export function RadiologyConfirmDialog({
	orderId,
	open,
	onOpenChange,
}: {
	orderId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const { order } = useRadiologyOrder(open ? orderId : null);
	const { users, isLoading: usersLoading } = useClinicUsers();
	const { confirmOrder, isPending } = useConfirmRadiology();

	const examsLabel = order?.items.map((i) => i.service.name).join("، ") ?? "—";
	// الفنّي يُعيَّن لكل فحوصات الطلب — نبدأ من الفنّي الموحّد إن وُجد
	const uniformAssigneeId = (() => {
		const ids = new Set((order?.items ?? []).map((i) => i.assignedTo?.id ?? null));
		return ids.size === 1 ? ([...ids][0] ?? null) : null;
	})();

	const { control, handleSubmit, register, reset } = useForm<
		ConfirmRadiologyFormInput,
		unknown,
		ConfirmRadiologyFormValues
	>({
		resolver: zodResolver(confirmRadiologySchema),
		defaultValues: {
			scheduledAt: nextQuarterHourDate(),
			assignedToId: null,
			priority: null,
			notes: "",
		},
	});

	// نبدأ من القيم الحالية للطلب — التأكيد قد يكون مجرد تثبيت لما هو موجود
	// biome-ignore lint/correctness/useExhaustiveDependencies: الضبط عند الفتح فقط
	useEffect(() => {
		if (open) {
			// الطلب قد يحمل موعدًا سابقًا (أُعيد إلى الطلبات مثلًا) — نبدأ منه
			const existing = order?.items.find((i) => i.scheduledAt)?.scheduledAt;
			reset({
				scheduledAt: existing ? new Date(existing) : nextQuarterHourDate(),
				assignedToId: uniformAssigneeId,
				priority: order?.priority ?? null,
				notes: order?.notes ?? "",
			});
		}
	}, [open, order?.id]);

	const onSubmit = handleSubmit(async (values) => {
		try {
			await confirmOrder({ id: orderId, ...values });
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
				<DialogTitle className="sr-only">تأكيد طلب الأشعة</DialogTitle>

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
							سينتقل الطلب من «الطلبات» إلى «مجدول» ويدخل سير عمل قسم الأشعة. يمكنك تعيين فنّي
							الأشعة وتحديد الأولوية قبل التأكيد.
						</p>

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
								<span className="text-[12px] text-muted-foreground">المدرّب الطالب</span>
							</div>
						</div>

						{/* موعد الفحص — يبقى الفحص في «مجدول» حتى يحين */}
						<div className="space-y-1.5">
							<div className="flex items-center justify-end gap-1.5">
								<span className="text-[12px] font-medium text-foreground">موعد الفحص</span>
								<IconInfoCircle className="size-3.5 text-muted-foreground" />
							</div>
							<Controller
								control={control}
								name="scheduledAt"
								render={({ field }) => (
									<DateTimePopover
										value={(field.value as Date | null) ?? null}
										onChange={field.onChange}
										placeholder="موعد الفحص"
										disabled={isPending}
										timeLabel="وقت الفحص"
										className="w-full justify-start"
									/>
								)}
							/>
							<p className="text-right text-[11px] text-muted-foreground">
								يبقى الفحص في «مجدول» حتى موعده، ولا يُسحب منه تلقائيًا قبله.
							</p>
						</div>

						{/* فنّي الأشعة */}
						<div className="space-y-1.5">
							<div className="flex items-center justify-end gap-1.5">
								<span className="text-[12px] font-medium text-foreground">فنّي الأشعة</span>
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
										onValueChange={(v) =>
											field.onChange(v === NONE ? null : (v as TaskPriority))
										}
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
								اختيار «عاجلة» يضع الفحص في مقدمة اللوحة بشارة «عاجل».
							</p>
						</div>

						{/* ملاحظة اختيارية */}
						<div className="space-y-1.5">
							<div className="flex items-center justify-end gap-1.5">
								<span className="text-[10px] text-muted-foreground">اختياري</span>
								<span className="text-[12px] font-medium text-foreground">
									ملاحظة لقسم الأشعة
								</span>
								<IconInfoCircle className="size-3.5 text-muted-foreground" />
							</div>
							<Textarea
								disabled={isPending}
								placeholder="تعليمات إضافية لفنّي الأشعة..."
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
