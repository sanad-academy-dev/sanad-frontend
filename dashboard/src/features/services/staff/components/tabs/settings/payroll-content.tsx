// عرض الرواتب والتعويضات داخل تبويب الإعدادات (drill-in) — الراتب الأساسي
// والبدلات الثابتة وبيانات الصرف. مصدر بياناته مسير الرواتب.
import { zodResolver } from "@hookform/resolvers/zod";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { type ReactNode, useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import { DateField } from "@/components/common/date-field";
import { FieldLabel } from "@/components/common/field-label";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
	useSaveStaffCompensation,
	useStaffCompensation,
} from "@/features/services/staff/hooks/use-staff-compensation";
import type { StaffTabProps } from "@/features/services/staff/types/tabs.types";
import {
	ALLOWANCE_TYPE_LABEL,
	AllowanceType,
	PAYROLL_PAYMENT_METHOD_LABEL,
	PayrollPaymentMethod,
	type StaffCompensationFormInput,
	type StaffCompensationFormValues,
	staffCompensationFormSchema,
} from "@sanad/contracts/runtime/server/staff-compensation/staff-compensation.type";

const EMPTY_FORM: StaffCompensationFormInput = {
	baseSalary: 0,
	iban: "",
	bankName: "",
	defaultPaymentMethod: "TRANSFER",
	effectiveFrom: "",
	notes: "",
	allowances: [],
};

const toISODate = (value: Date | string | null | undefined): string => {
	if (!value) return "";
	const d = new Date(value);
	return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
};

/** رأس قسم: عنوان بارز مع وصف مكتوم أسفله. */
function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
	return (
		<div className="flex flex-col gap-1 px-1">
			<p className="text-sm font-semibold">{title}</p>
			<p className="text-xs text-muted-foreground">{subtitle}</p>
		</div>
	);
}

function Card({ children }: { children: ReactNode }) {
	return <div className="rounded-lg border">{children}</div>;
}

export function PayrollContent({ staffId }: StaffTabProps) {
	const { compensation, isLoading } = useStaffCompensation(staffId);
	const { saveCompensation, isPending } = useSaveStaffCompensation(staffId);

	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors, isDirty },
	} = useForm<StaffCompensationFormInput, unknown, StaffCompensationFormValues>({
		resolver: zodResolver(staffCompensationFormSchema),
		defaultValues: EMPTY_FORM,
	});

	const { fields, append, remove } = useFieldArray({ control, name: "allowances" });

	// تعبئة النموذج عند وصول الملف المحفوظ (المبالغ تصل كنصوص Decimal)
	useEffect(() => {
		if (!compensation) return;
		reset({
			baseSalary: Number(compensation.baseSalary),
			iban: compensation.iban ?? "",
			bankName: compensation.bankName ?? "",
			defaultPaymentMethod: compensation.defaultPaymentMethod,
			effectiveFrom: toISODate(compensation.effectiveFrom),
			notes: compensation.notes ?? "",
			allowances: (compensation.allowances ?? []).map((a) => ({
				type: a.type,
				amount: Number(a.amount),
				note: a.note ?? "",
			})),
		});
	}, [compensation, reset]);

	const onSubmit = handleSubmit(async (values) => {
		await saveCompensation(values);
		reset(values); // يعيد ضبط حالة "معدَّل" بعد الحفظ
	});

	if (isLoading) {
		return (
			<div className="flex flex-col gap-3">
				<Skeleton className="h-5 w-32" />
				<Skeleton className="h-9 w-full" />
				<Skeleton className="h-9 w-full" />
			</div>
		);
	}

	return (
		<form
			onSubmit={onSubmit}
			className="flex flex-col gap-6"
			dir="rtl"
		>
			{/* الراتب الأساسي وبيانات الصرف */}
			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between gap-2 px-1">
					<SectionHeader
						title="الراتب والصرف"
						subtitle="الراتب الأساسي وطريقة الصرف وبيانات الحساب البنكي"
					/>
					{!compensation && (
						<span className="shrink-0 rounded bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
							لم يُنشأ بعد
						</span>
					)}
				</div>
				<Card>
					<div className="grid grid-cols-2 gap-3 p-4">
						<div className="flex flex-col gap-1.5">
							<FieldLabel required>
								<Label
									className="text-sm font-medium"
									htmlFor="base-salary"
								>
									الراتب الأساسي (ر.س)
								</Label>
							</FieldLabel>
							<Field data-invalid={!!errors.baseSalary}>
								<Input
									id="base-salary"
									type="number"
									inputMode="numeric"
									min={0}
									step="0.01"
									placeholder="مثال: 12000"
									className="text-sm tabular-nums"
									aria-invalid={!!errors.baseSalary}
									disabled={isPending}
									{...register("baseSalary")}
								/>
								<FieldError errors={[errors.baseSalary]} />
							</Field>
						</div>

						<div className="flex flex-col gap-1.5">
							<FieldLabel required>
								<Label className="text-sm font-medium">طريقة الصرف</Label>
							</FieldLabel>
							<Controller
								name="defaultPaymentMethod"
								control={control}
								render={({ field }) => (
									<Field data-invalid={!!errors.defaultPaymentMethod}>
										<Select
											value={field.value}
											onValueChange={field.onChange}
											disabled={isPending}
											dir="rtl"
										>
											<SelectTrigger className="text-sm">
												<SelectValue placeholder="اختر طريقة الصرف..." />
											</SelectTrigger>
											<SelectContent dir="rtl">
												{Object.values(PayrollPaymentMethod).map((m) => (
													<SelectItem
														key={m}
														value={m}
													>
														{PAYROLL_PAYMENT_METHOD_LABEL[m]}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FieldError errors={[errors.defaultPaymentMethod]} />
									</Field>
								)}
							/>
						</div>

						<div className="flex flex-col gap-1.5">
							<Label
								className="text-sm font-medium"
								htmlFor="iban"
							>
								الآيبان
							</Label>
							<Field data-invalid={!!errors.iban}>
								<Input
									id="iban"
									dir="ltr"
									placeholder="SA0000000000000000000000"
									className="text-sm tabular-nums"
									aria-invalid={!!errors.iban}
									disabled={isPending}
									{...register("iban")}
								/>
								<FieldError errors={[errors.iban]} />
							</Field>
						</div>

						<div className="flex flex-col gap-1.5">
							<Label
								className="text-sm font-medium"
								htmlFor="bank-name"
							>
								اسم البنك
							</Label>
							<Field data-invalid={!!errors.bankName}>
								<Input
									id="bank-name"
									placeholder="مثال: مصرف الراجحي"
									className="text-sm"
									aria-invalid={!!errors.bankName}
									disabled={isPending}
									{...register("bankName")}
								/>
								<FieldError errors={[errors.bankName]} />
							</Field>
						</div>

						<div className="flex flex-col gap-1.5">
							<Label className="text-sm font-medium">تاريخ سريان الملف</Label>
							<Controller
								name="effectiveFrom"
								control={control}
								render={({ field }) => (
									<Field data-invalid={!!errors.effectiveFrom}>
										<DateField
											value={field.value ?? ""}
											onChange={field.onChange}
											placeholder="اختر التاريخ..."
											triggerDisabled={isPending}
											invalid={!!errors.effectiveFrom}
										/>
										<FieldError errors={[errors.effectiveFrom]} />
									</Field>
								)}
							/>
						</div>
					</div>
				</Card>
			</div>

			{/* البدلات الثابتة المتكررة */}
			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between gap-2 px-1">
					<SectionHeader
						title="البدلات الثابتة"
						subtitle="بدلات متكررة تُضاف إلى الراتب كل دورة صرف"
					/>
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="h-8 shrink-0 gap-1 text-xs"
						disabled={isPending}
						onClick={() => append({ type: "HOUSING", amount: 0, note: "" })}
					>
						<IconPlus className="size-3.5" />
						إضافة بدل
					</Button>
				</div>
				<Card>
					{fields.length === 0 ? (
						<p className="px-4 py-6 text-center text-xs text-muted-foreground">
							لا توجد بدلات ثابتة مضافة.
						</p>
					) : (
						<div className="flex flex-col gap-2 p-4">
							{fields.map((row, index) => (
								<div
									key={row.id}
									className="flex items-start gap-2"
								>
									<Controller
										name={`allowances.${index}.type`}
										control={control}
										render={({ field }) => (
											<Field
												className="flex-1"
												data-invalid={!!errors.allowances?.[index]?.type}
											>
												<Select
													value={field.value}
													onValueChange={field.onChange}
													disabled={isPending}
													dir="rtl"
												>
													<SelectTrigger className="text-sm">
														<SelectValue />
													</SelectTrigger>
													<SelectContent dir="rtl">
														{Object.values(AllowanceType).map((t) => (
															<SelectItem
																key={t}
																value={t}
															>
																{ALLOWANCE_TYPE_LABEL[t]}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FieldError errors={[errors.allowances?.[index]?.type]} />
											</Field>
										)}
									/>

									<Field
										className="w-32"
										data-invalid={!!errors.allowances?.[index]?.amount}
									>
										<Input
											type="number"
											inputMode="numeric"
											min={0}
											step="0.01"
											placeholder="المبلغ"
											className="text-sm tabular-nums"
											aria-invalid={!!errors.allowances?.[index]?.amount}
											disabled={isPending}
											{...register(`allowances.${index}.amount`)}
										/>
										<FieldError errors={[errors.allowances?.[index]?.amount]} />
									</Field>

									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="size-9 shrink-0 text-muted-foreground hover:text-destructive"
										aria-label="حذف البدل"
										disabled={isPending}
										onClick={() => remove(index)}
									>
										<IconTrash className="size-4" />
									</Button>
								</div>
							))}
						</div>
					)}
				</Card>
			</div>

			<div className="flex justify-start">
				<Button
					type="submit"
					size="sm"
					className="h-9 text-xs"
					disabled={isPending || !isDirty}
				>
					حفظ بيانات التعويضات
				</Button>
			</div>
		</form>
	);
}
