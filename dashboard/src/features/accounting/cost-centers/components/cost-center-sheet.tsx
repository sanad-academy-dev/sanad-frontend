import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AccountingFormSheet } from "@/features/accounting/components/accounting-form-sheet";
import { useCostCenterActions } from "@/features/accounting/cost-centers/hooks/use-cost-centers";
import {
	type CostCenterResponse,
	type CreateCostCenterFormInput,
	type CreateCostCenterFormValues,
	createCostCenterSchema,
} from "@sanad/contracts/runtime/server/accounting/cost-center/cost-center.type";

const DEFAULTS: CreateCostCenterFormInput = {
	costCenterName: "",
	costCenterNumber: null,
	parentCostCenterId: null,
	isGroup: false,
	disabled: false,
};

export type CostCenterSheetProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** when set, the sheet edits this cost center; otherwise it creates */
	editing?: CostCenterResponse | null;
	/** when creating a child, the parent group */
	parent?: CostCenterResponse | null;
};

export const CostCenterSheet = ({
	open,
	onOpenChange,
	editing,
	parent,
}: CostCenterSheetProps) => {
	const { create, update, isSaving } = useCostCenterActions();
	const isEdit = !!editing;

	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateCostCenterFormInput, unknown, CreateCostCenterFormValues>({
		resolver: zodResolver(createCostCenterSchema),
		defaultValues: DEFAULTS,
	});

	useEffect(() => {
		if (!open) return;
		if (editing) {
			reset({
				costCenterName: editing.costCenterName,
				costCenterNumber: editing.costCenterNumber,
				parentCostCenterId: editing.parentCostCenterId,
				isGroup: editing.isGroup,
				disabled: editing.disabled,
			});
		} else {
			reset({ ...DEFAULTS, parentCostCenterId: parent?.id ?? null });
		}
	}, [open, editing, parent, reset]);

	// toast.promise (inside the hook) owns success/error feedback; close the sheet immediately.
	const onSubmit = handleSubmit((values) => {
		if (isEdit && editing) {
			update(editing.id, {
				costCenterName: values.costCenterName,
				costCenterNumber: values.costCenterNumber,
				isGroup: values.isGroup,
				disabled: values.disabled,
			});
		} else {
			create(values);
		}
		onOpenChange(false);
	});

	return (
		<AccountingFormSheet
			open={open}
			onOpenChange={onOpenChange}
			title={isEdit ? "تعديل مركز تكلفة" : "مركز تكلفة جديد"}
			description={
				isEdit
					? editing?.costCenterName
					: parent
						? `تحت: ${parent.costCenterName}`
						: "مركز في جذر الشجرة"
			}
			onSubmit={onSubmit}
			isSaving={isSaving}
			submitLabel={isEdit ? "حفظ" : "إنشاء"}
		>
			<Field data-invalid={!!errors.costCenterName}>
				<Label>
					الاسم <span className="text-rose-500">*</span>
				</Label>
				<Input
					aria-invalid={!!errors.costCenterName}
					{...register("costCenterName")}
					disabled={isSaving}
				/>
				<FieldError errors={[errors.costCenterName]} />
			</Field>

			<Field data-invalid={!!errors.costCenterNumber}>
				<Label>الرقم</Label>
				<Input
					dir="ltr"
					{...register("costCenterNumber", {
						// empty input means "no number", never an empty string (schema is min(1).nullish())
						setValueAs: (v) => (typeof v === "string" && v.trim() === "" ? null : v),
					})}
					disabled={isSaving}
				/>
				<FieldError errors={[errors.costCenterNumber]} />
			</Field>

			<Controller
				name="isGroup"
				control={control}
				render={({ field }) => (
					<Field
						orientation="horizontal"
						className="justify-between"
					>
						<Label>مجموعة (يحتوي مراكز فرعية)</Label>
						<Switch
							checked={field.value ?? false}
							onCheckedChange={field.onChange}
							disabled={isSaving}
						/>
					</Field>
				)}
			/>

			<Controller
				name="disabled"
				control={control}
				render={({ field }) => (
					<Field
						orientation="horizontal"
						className="justify-between"
					>
						<Label>معطّل</Label>
						<Switch
							checked={field.value ?? false}
							onCheckedChange={field.onChange}
							disabled={isSaving}
						/>
					</Field>
				)}
			/>
		</AccountingFormSheet>
	);
};
