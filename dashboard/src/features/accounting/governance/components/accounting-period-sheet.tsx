import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { DateField } from "@/components/common/date-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AccountingFormSheet } from "@/features/accounting/components/accounting-form-sheet";
import { useAccountingPeriodActions } from "@/features/accounting/governance/hooks/use-accounting-periods";
import {
	type CreateAccountingPeriodFormInput,
	createAccountingPeriodSchema,
} from "@sanad/contracts/runtime/server/accounting/accounting-period/accounting-period.type";
import { ACCOUNTING_DOCTYPES } from "@sanad/contracts/accounting/permissions";

/**
 * [P11.6] Create sheet for an Accounting Period (FR-12.2). The closed-document-types
 * options come from the SAME doctype registry the server validates against
 * (`validateClosedTypes` → `findAccountingDoctype`) — limited to submittable vouchers,
 * because the FR-12.2 lock only ever guards voucher posting/cancel dates.
 */

const CLOSABLE_DOCTYPES = ACCOUNTING_DOCTYPES.filter((d) => d.kind === "voucher");

const DEFAULTS: CreateAccountingPeriodFormInput = {
	periodName: "",
	startDate: "",
	endDate: "",
	closedDocumentTypes: [],
};

export type AccountingPeriodSheetProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export const AccountingPeriodSheet = ({ open, onOpenChange }: AccountingPeriodSheetProps) => {
	const { create, isSaving } = useAccountingPeriodActions();

	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateAccountingPeriodFormInput>({
		resolver: zodResolver(createAccountingPeriodSchema),
		defaultValues: DEFAULTS,
	});

	useEffect(() => {
		if (open) reset(DEFAULTS);
	}, [open, reset]);

	// toast.promise (inside the hook) owns success/error feedback; close the sheet immediately.
	const onSubmit = handleSubmit((values) => {
		create(values);
		onOpenChange(false);
	});

	return (
		<AccountingFormSheet
			open={open}
			onOpenChange={onOpenChange}
			title="فترة محاسبية جديدة"
			description="فترة معتمدة تمنع ترحيل وإلغاء الأنواع المختارة داخل مداها الزمني (FR-12.2)."
			onSubmit={onSubmit}
			isSaving={isSaving}
			submitLabel="إنشاء"
		>
			<Field data-invalid={!!errors.periodName}>
				<Label>
					اسم الفترة <span className="text-rose-500">*</span>
				</Label>
				<Input
					aria-invalid={!!errors.periodName}
					placeholder="مثال: إقفال الربع الأول 2026"
					{...register("periodName")}
					disabled={isSaving}
				/>
				<FieldError errors={[errors.periodName]} />
			</Field>

			<Controller
				name="startDate"
				control={control}
				render={({ field }) => (
					<Field data-invalid={!!errors.startDate}>
						<Label>
							تاريخ البداية <span className="text-rose-500">*</span>
						</Label>
						<DateField
							value={field.value}
							onChange={field.onChange}
							placeholder="اختر تاريخ البداية..."
							invalid={!!errors.startDate}
							triggerDisabled={isSaving}
						/>
						<FieldError errors={[errors.startDate]} />
					</Field>
				)}
			/>

			<Controller
				name="endDate"
				control={control}
				render={({ field }) => (
					<Field data-invalid={!!errors.endDate}>
						<Label>
							تاريخ النهاية <span className="text-rose-500">*</span>
						</Label>
						<DateField
							value={field.value}
							onChange={field.onChange}
							placeholder="اختر تاريخ النهاية..."
							invalid={!!errors.endDate}
							triggerDisabled={isSaving}
						/>
						<FieldError errors={[errors.endDate]} />
					</Field>
				)}
			/>

			<Controller
				name="closedDocumentTypes"
				control={control}
				render={({ field }) => (
					<Field data-invalid={!!errors.closedDocumentTypes}>
						<Label>
							أنواع المستندات المقفلة <span className="text-rose-500">*</span>
						</Label>
						<div className="grid grid-cols-2 gap-2">
							{CLOSABLE_DOCTYPES.map((doctype) => {
								const checked = field.value.includes(doctype.key);
								const id = `closed-doctype-${doctype.key}`;
								return (
									<div
										key={doctype.key}
										className="flex items-center gap-2"
									>
										<Checkbox
											id={id}
											checked={checked}
											onCheckedChange={(next) =>
												field.onChange(
													next === true
														? [...field.value, doctype.key]
														: field.value.filter((key) => key !== doctype.key),
												)
											}
											disabled={isSaving}
										/>
										<Label
											htmlFor={id}
											className="font-normal text-sm"
										>
											{doctype.labelAr}
										</Label>
									</div>
								);
							})}
						</div>
						<FieldError errors={[errors.closedDocumentTypes]} />
					</Field>
				)}
			/>
		</AccountingFormSheet>
	);
};
