import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

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
import { Switch } from "@/components/ui/switch";
import { useAccounts } from "@/features/accounting/chart-of-accounts/hooks/use-chart-of-accounts";
import { AccountingFormSheet } from "@/features/accounting/components/accounting-form-sheet";
import { useModeOfPaymentActions } from "@/features/accounting/modes-of-payment/hooks/use-modes-of-payment";
import { ModeOfPaymentType } from "@/generated/prisma/enums";
import {
	type CreateModeOfPaymentFormInput,
	type CreateModeOfPaymentFormValues,
	createModeOfPaymentSchema,
	type ModeOfPaymentResponse,
} from "@sanad/contracts/runtime/server/accounting/mode-of-payment/mode-of-payment.type";

export const MODE_OF_PAYMENT_TYPE_LABEL: Record<ModeOfPaymentType, string> = {
	CASH: "نقدًا",
	BANK: "بنك",
	GENERAL: "عام",
	PHONE: "هاتف",
};

const NO_ACCOUNT = "__none__";

const DEFAULTS: CreateModeOfPaymentFormInput = {
	modeOfPaymentName: "",
	type: ModeOfPaymentType.GENERAL,
	enabled: true,
	defaultAccountId: null,
};

export type ModeOfPaymentSheetProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** when set, the sheet edits this mode of payment; otherwise it creates */
	editing?: ModeOfPaymentResponse | null;
};

export const ModeOfPaymentSheet = ({
	open,
	onOpenChange,
	editing,
}: ModeOfPaymentSheetProps) => {
	const { create, update, isSaving } = useModeOfPaymentActions();
	const { accounts } = useAccounts();
	const postable = accounts.filter((a) => !a.isGroup && !a.freezeAccount && !a.disabled);
	const isEdit = !!editing;

	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateModeOfPaymentFormInput, unknown, CreateModeOfPaymentFormValues>({
		resolver: zodResolver(createModeOfPaymentSchema),
		defaultValues: DEFAULTS,
	});

	useEffect(() => {
		if (!open) return;
		if (editing) {
			reset({
				modeOfPaymentName: editing.modeOfPaymentName,
				type: editing.type,
				enabled: editing.enabled,
				defaultAccountId: editing.defaultAccountId,
			});
		} else {
			reset(DEFAULTS);
		}
	}, [open, editing, reset]);

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
			title={isEdit ? "تعديل طريقة الدفع" : "طريقة دفع جديدة"}
			description="حدّد النوع والحساب الافتراضي للتحصيل."
			onSubmit={onSubmit}
			isSaving={isSaving}
			submitLabel={isEdit ? "حفظ" : "إنشاء"}
		>
			<Field data-invalid={!!errors.modeOfPaymentName}>
				<Label>
					الاسم <span className="text-rose-500">*</span>
				</Label>
				<Input
					aria-invalid={!!errors.modeOfPaymentName}
					{...register("modeOfPaymentName")}
					disabled={isSaving}
				/>
				<FieldError errors={[errors.modeOfPaymentName]} />
			</Field>

			<Controller
				name="type"
				control={control}
				render={({ field }) => (
					<Field>
						<Label>النوع</Label>
						<Select
							value={field.value}
							onValueChange={field.onChange}
							dir="rtl"
							disabled={isSaving}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{Object.values(ModeOfPaymentType).map((tp) => (
									<SelectItem
										key={tp}
										value={tp}
									>
										{MODE_OF_PAYMENT_TYPE_LABEL[tp]}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</Field>
				)}
			/>

			<Controller
				name="defaultAccountId"
				control={control}
				render={({ field }) => (
					<Field>
						<Label>الحساب الافتراضي</Label>
						<Select
							value={field.value ?? NO_ACCOUNT}
							onValueChange={(v) => field.onChange(v === NO_ACCOUNT ? null : v)}
							dir="rtl"
							disabled={isSaving}
						>
							<SelectTrigger>
								<SelectValue placeholder="بدون حساب" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={NO_ACCOUNT}>— بدون حساب —</SelectItem>
								{postable.map((a) => (
									<SelectItem
										key={a.id}
										value={a.id}
									>
										{a.accountName}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</Field>
				)}
			/>

			<Controller
				name="enabled"
				control={control}
				render={({ field }) => (
					<Field
						orientation="horizontal"
						className="justify-between"
					>
						<Label>مُفعّلة</Label>
						<Switch
							checked={field.value ?? true}
							onCheckedChange={field.onChange}
							disabled={isSaving}
						/>
					</Field>
				)}
			/>
		</AccountingFormSheet>
	);
};
