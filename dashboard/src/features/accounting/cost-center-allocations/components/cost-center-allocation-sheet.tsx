import { zodResolver } from "@hookform/resolvers/zod";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";

import { DateField } from "@/components/common/date-field";
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
import { AccountingFormSheet } from "@/features/accounting/components/accounting-form-sheet";
import { useCostCenterAllocationActions } from "@/features/accounting/cost-center-allocations/hooks/use-cost-center-allocations";
import { useCostCenters } from "@/features/accounting/cost-centers/hooks/use-cost-centers";
import { DocStatus } from "@/generated/prisma/enums";
import {
	type CostCenterAllocationResponse,
	type CreateCostCenterAllocationFormInput,
	createCostCenterAllocationSchema,
} from "@sanad/contracts/runtime/server/accounting/cost-center-allocation/cost-center-allocation.type";

/**
 * Exact, float-free display sum of the percentage strings (contract C2 — no JS float touches
 * a percentage). Each value is scaled to integer nano-units (9 dp) before summing.
 */
function displaySum(values: { percentage: string }[]): string {
	const NANO = 1_000_000_000n;
	let total = 0n;
	for (const v of values) {
		const raw = (v.percentage ?? "").trim();
		if (!/^\d+(\.\d{1,9})?$/.test(raw)) continue;
		const [int, frac = ""] = raw.split(".");
		total += BigInt(int) * NANO + BigInt(frac.padEnd(9, "0"));
	}
	const whole = total / NANO;
	const frac = (total % NANO).toString().padStart(9, "0").replace(/0+$/, "");
	return frac ? `${whole}.${frac}` : `${whole}`;
}

const DEFAULTS: CreateCostCenterAllocationFormInput = {
	mainCostCenterId: "",
	validFrom: "",
	rows: [{ costCenterId: "", percentage: "" }],
};

export type CostCenterAllocationSheetProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** when set (must be a DRAFT), the sheet edits it; otherwise it creates */
	editing?: CostCenterAllocationResponse | null;
};

export const CostCenterAllocationSheet = ({
	open,
	onOpenChange,
	editing,
}: CostCenterAllocationSheetProps) => {
	const { create, update, isPending } = useCostCenterAllocationActions();
	const { costCenters } = useCostCenters();
	// only leaf cost centers can be a main or a child (BR-4.4.2)
	const leaves = costCenters.filter((c) => !c.isGroup && !c.disabled);
	const isEdit = !!editing && editing.docstatus === DocStatus.DRAFT;

	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateCostCenterAllocationFormInput>({
		resolver: zodResolver(createCostCenterAllocationSchema),
		defaultValues: DEFAULTS,
	});
	const { fields, append, remove } = useFieldArray({ control, name: "rows" });

	useEffect(() => {
		if (!open) return;
		if (editing) {
			reset({
				mainCostCenterId: editing.mainCostCenterId,
				validFrom: new Date(editing.validFrom).toISOString().slice(0, 10),
				rows: editing.percentages.map((p) => ({
					costCenterId: p.costCenterId,
					percentage: p.percentage.toString(),
				})),
			});
		} else {
			reset(DEFAULTS);
		}
	}, [open, editing, reset]);

	const rows = useWatch({ control, name: "rows" });
	const sum = displaySum(rows ?? []);

	// toast.promise (inside the hook) owns success/error feedback; close the sheet immediately.
	const onSubmit = handleSubmit((values) => {
		if (isEdit && editing) update(editing.id, values);
		else create(values);
		onOpenChange(false);
	});

	return (
		<AccountingFormSheet
			open={open}
			onOpenChange={onOpenChange}
			title={isEdit ? "تعديل مسودة التوزيع" : "توزيع مركز تكلفة جديد"}
			description="وزّع تكاليف مركز رئيسي على مراكز فرعية بنسب مجموعها 100٪ بالضبط."
			onSubmit={onSubmit}
			isSaving={isPending}
			submitLabel={isEdit ? "حفظ" : "إنشاء مسودة"}
		>
			<Controller
				name="mainCostCenterId"
				control={control}
				render={({ field }) => (
					<Field data-invalid={!!errors.mainCostCenterId}>
						<Label>
							مركز التكلفة الرئيسي <span className="text-rose-500">*</span>
						</Label>
						<Select
							value={field.value || undefined}
							onValueChange={field.onChange}
							dir="rtl"
							disabled={isPending}
						>
							<SelectTrigger>
								<SelectValue placeholder="اختر مركز التكلفة" />
							</SelectTrigger>
							<SelectContent>
								{leaves.map((c) => (
									<SelectItem
										key={c.id}
										value={c.id}
									>
										{c.costCenterName}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<FieldError errors={[errors.mainCostCenterId]} />
					</Field>
				)}
			/>

			<Controller
				name="validFrom"
				control={control}
				render={({ field }) => (
					<Field data-invalid={!!errors.validFrom}>
						<Label>
							تاريخ السريان <span className="text-rose-500">*</span>
						</Label>
						<DateField
							value={field.value}
							onChange={field.onChange}
							placeholder="YYYY-MM-DD"
							invalid={!!errors.validFrom}
							triggerDisabled={isPending}
						/>
						<FieldError errors={[errors.validFrom]} />
					</Field>
				)}
			/>

			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<Label>صفوف التوزيع</Label>
					<span
						className={`text-xs tabular-nums ${sum === "100" ? "text-emerald-600" : "text-rose-500"}`}
						dir="ltr"
					>
						{sum} / 100٪
					</span>
				</div>

				{fields.map((row, index) => (
					<div
						key={row.id}
						className="flex items-start gap-2"
					>
						<Controller
							name={`rows.${index}.costCenterId`}
							control={control}
							render={({ field }) => (
								<Field
									className="flex-1"
									data-invalid={!!errors.rows?.[index]?.costCenterId}
								>
									<Select
										value={field.value || undefined}
										onValueChange={field.onChange}
										dir="rtl"
										disabled={isPending}
									>
										<SelectTrigger>
											<SelectValue placeholder="مركز التكلفة" />
										</SelectTrigger>
										<SelectContent>
											{leaves.map((c) => (
												<SelectItem
													key={c.id}
													value={c.id}
												>
													{c.costCenterName}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</Field>
							)}
						/>
						<Field
							className="w-24"
							data-invalid={!!errors.rows?.[index]?.percentage}
						>
							<Input
								dir="ltr"
								inputMode="decimal"
								placeholder="0"
								aria-invalid={!!errors.rows?.[index]?.percentage}
								{...register(`rows.${index}.percentage`)}
								disabled={isPending}
							/>
						</Field>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							aria-label="حذف الصف"
							disabled={isPending || fields.length === 1}
							onClick={() => remove(index)}
						>
							<IconTrash className="size-4" />
						</Button>
					</div>
				))}

				<Button
					type="button"
					variant="outline"
					size="sm"
					disabled={isPending}
					onClick={() => append({ costCenterId: "", percentage: "" })}
				>
					<IconPlus className="size-4" />
					إضافة صف
				</Button>
				{typeof errors.rows?.message === "string" && (
					<p className="text-rose-500 text-xs">{errors.rows.message}</p>
				)}
			</div>
		</AccountingFormSheet>
	);
};
