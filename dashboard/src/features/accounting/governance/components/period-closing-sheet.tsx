import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

import { DateField } from "@/components/common/date-field";
import { Field, FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAccounts } from "@/features/accounting/chart-of-accounts/hooks/use-chart-of-accounts";
import { AccountingFormSheet } from "@/features/accounting/components/accounting-form-sheet";
import { usePeriodClosingActions } from "@/features/accounting/governance/hooks/use-period-closing-vouchers";
import { AccountRootType } from "@/generated/prisma/enums";
import {
	type CreatePeriodClosingVoucherFormInput,
	createPeriodClosingVoucherSchema,
} from "@sanad/contracts/runtime/server/accounting/period-closing/period-closing.type";

/**
 * [P11.6] Create sheet for a Period Closing Voucher (FR-12.3). The closing head selector
 * mirrors the server rule exactly (`period-closing.service` — a postable, enabled
 * LIABILITY/EQUITY leaf, i.e. Retained Earnings) so the error surfaces inline.
 */

type PeriodClosingFormInput = z.input<typeof createPeriodClosingVoucherSchema>;

const DEFAULTS: PeriodClosingFormInput = {
	periodStartDate: "",
	periodEndDate: "",
	closingAccountHeadId: "",
	remarks: null,
	granularByDimensions: true,
};

export type PeriodClosingSheetProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export const PeriodClosingSheet = ({ open, onOpenChange }: PeriodClosingSheetProps) => {
	const { accounts } = useAccounts();
	const { create, isSaving } = usePeriodClosingActions();

	// same filter the server enforces: enabled LIABILITY/EQUITY leaves only
	const closingLeaves = accounts.filter(
		(account) =>
			!account.isGroup &&
			!account.disabled &&
			(account.rootType === AccountRootType.LIABILITY ||
				account.rootType === AccountRootType.EQUITY),
	);

	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<PeriodClosingFormInput, unknown, CreatePeriodClosingVoucherFormInput>({
		resolver: zodResolver(createPeriodClosingVoucherSchema),
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
			title="سند إقفال فترة جديد"
			description="يرحّل أرصدة قائمة الدخل إلى حساب الإقفال (الأرباح المحتجزة) — التشغيل الفعلي يتم عند الاعتماد كمهمة خلفية (FR-12.3)."
			onSubmit={onSubmit}
			isSaving={isSaving}
			submitLabel="حفظ المسودة"
		>
			<Controller
				name="periodStartDate"
				control={control}
				render={({ field }) => (
					<Field data-invalid={!!errors.periodStartDate}>
						<Label>
							بداية الفترة <span className="text-rose-500">*</span>
						</Label>
						<DateField
							value={field.value}
							onChange={field.onChange}
							placeholder="اختر بداية الفترة..."
							invalid={!!errors.periodStartDate}
							triggerDisabled={isSaving}
						/>
						<FieldError errors={[errors.periodStartDate]} />
					</Field>
				)}
			/>

			<Controller
				name="periodEndDate"
				control={control}
				render={({ field }) => (
					<Field data-invalid={!!errors.periodEndDate}>
						<Label>
							نهاية الفترة <span className="text-rose-500">*</span>
						</Label>
						<DateField
							value={field.value}
							onChange={field.onChange}
							placeholder="اختر نهاية الفترة..."
							invalid={!!errors.periodEndDate}
							triggerDisabled={isSaving}
						/>
						<FieldError errors={[errors.periodEndDate]} />
					</Field>
				)}
			/>

			<Controller
				name="closingAccountHeadId"
				control={control}
				render={({ field }) => (
					<Field data-invalid={!!errors.closingAccountHeadId}>
						<Label>
							حساب الإقفال <span className="text-rose-500">*</span>
						</Label>
						<Select
							value={field.value || ""}
							onValueChange={field.onChange}
							dir="rtl"
							disabled={isSaving}
						>
							<SelectTrigger aria-invalid={!!errors.closingAccountHeadId}>
								<SelectValue placeholder="حساب ورقي من الالتزامات أو حقوق الملكية..." />
							</SelectTrigger>
							<SelectContent dir="rtl">
								{closingLeaves.map((account) => (
									<SelectItem
										key={account.id}
										value={account.id}
									>
										{account.accountName}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<FieldError errors={[errors.closingAccountHeadId]} />
					</Field>
				)}
			/>

			<Field data-invalid={!!errors.remarks}>
				<Label>ملاحظات (اختياري)</Label>
				<Textarea
					aria-invalid={!!errors.remarks}
					{...register("remarks", {
						setValueAs: (value: unknown) =>
							typeof value === "string" && value.trim() === "" ? null : value,
					})}
					disabled={isSaving}
				/>
				<FieldError errors={[errors.remarks]} />
			</Field>

			<Controller
				name="granularByDimensions"
				control={control}
				render={({ field }) => (
					<Field
						orientation="horizontal"
						className="justify-between"
					>
						<Label>إقفال مفصّل حسب الأبعاد ومراكز التكلفة</Label>
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
