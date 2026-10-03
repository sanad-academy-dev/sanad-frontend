import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { DateField } from "@/components/common/date-field";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useVoucherDemoActions } from "@/features/accounting/voucher-demo/hooks/use-voucher-demo";
import { DocStatus } from "@/generated/prisma/enums";
import { useI18n } from "@/hooks/use-i18n";
import {
	type CreateVoucherDemoFormInput,
	createVoucherDemoSchema,
	type VoucherDemoRecord,
} from "@sanad/contracts/runtime/server/accounting/voucher-demo/voucher-demo.type";

/**
 * [P0.2 UI] Create / edit sheet for the demo voucher — CONTRACT recipe §4.2
 * (`Sheet side="left" dir="rtl"`, scrollable body, pinned footer).
 *
 * Editing a SUBMITTED document exposes only the fields the AR-1 whitelist allows: `amount`
 * is disabled once submitted, because the server will reject it and a form that lets you
 * type a value it cannot save is worse than one that doesn't.
 */

const todayIso = () => new Date().toISOString().slice(0, 10);

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** null ⇒ create a new draft */
	voucher: VoucherDemoRecord | null;
};

export const VoucherDemoSheet = ({ open, onOpenChange, voucher }: Props) => {
	const { t, isRtl } = useI18n();
	const { createVoucher, updateVoucher, isPending } = useVoucherDemoActions();

	const isEdit = voucher !== null;
	const isSubmitted = voucher?.docstatus === DocStatus.SUBMITTED;

	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors, isValid },
	} = useForm<CreateVoucherDemoFormInput>({
		resolver: zodResolver(createVoucherDemoSchema),
		mode: "onChange",
		defaultValues: { title: "", amount: "", postingDate: todayIso() },
	});

	useEffect(() => {
		if (!open) return;
		reset(
			voucher
				? {
						title: voucher.title,
						amount: voucher.amount.toString(),
						postingDate: new Date(voucher.postingDate).toISOString().slice(0, 10),
					}
				: { title: "", amount: "", postingDate: todayIso() },
		);
	}, [open, voucher, reset]);

	const onSubmit = async (values: CreateVoucherDemoFormInput) => {
		try {
			if (voucher) {
				// posting date is not editable after creation in the demo doc
				await updateVoucher(voucher.id, {
					title: values.title,
					...(isSubmitted ? {} : { amount: values.amount }),
				});
			} else {
				await createVoucher(values);
			}
			onOpenChange(false);
		} catch {
			// the hook owns the toast
		}
	};

	return (
		<Sheet
			open={open}
			onOpenChange={onOpenChange}
		>
			<SheetContent
				side="left"
				dir={isRtl ? "rtl" : "ltr"}
				className="w-full gap-0 p-0 sm:max-w-xl!"
			>
				<SheetHeader className="border-b">
					<SheetTitle>
						{isEdit
							? t("accounting.vouchers.editTitle")
							: t("accounting.vouchers.createTitle")}
					</SheetTitle>
				</SheetHeader>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex min-h-0 flex-1 flex-col"
				>
					<div className="flex-1 space-y-5 overflow-y-auto p-4">
						<Field data-invalid={!!errors.title}>
							<Label htmlFor="voucher-title">{t("accounting.vouchers.fields.title")}</Label>
							<Input
								id="voucher-title"
								aria-invalid={!!errors.title}
								disabled={isPending}
								{...register("title")}
							/>
							<FieldError errors={[errors.title]} />
						</Field>

						<Field data-invalid={!!errors.amount}>
							<Label htmlFor="voucher-amount">{t("accounting.vouchers.fields.amount")}</Label>
							<Input
								id="voucher-amount"
								inputMode="decimal"
								// amounts are an LTR island in both locales
								dir="ltr"
								aria-invalid={!!errors.amount}
								disabled={isPending || isSubmitted}
								{...register("amount")}
							/>
							{isSubmitted && (
								<p className="text-muted-foreground text-xs">
									{t("accounting.vouchers.amountLockedAfterSubmit")}
								</p>
							)}
							<FieldError errors={[errors.amount]} />
						</Field>

						<Controller
							name="postingDate"
							control={control}
							render={({ field }) => (
								<Field data-invalid={!!errors.postingDate}>
									<Label>{t("accounting.vouchers.fields.postingDate")}</Label>
									<DateField
										value={field.value}
										onChange={field.onChange}
										placeholder={t("accounting.vouchers.fields.postingDate")}
										invalid={!!errors.postingDate}
										triggerDisabled={isPending || isEdit}
									/>
									<FieldError errors={[errors.postingDate]} />
								</Field>
							)}
						/>
					</div>

					<div className="flex justify-end gap-2 border-t px-4 py-2">
						<Button
							type="button"
							variant="outline"
							disabled={isPending}
							onClick={() => onOpenChange(false)}
						>
							{t("accounting.settings.cancel")}
						</Button>
						<Button
							type="submit"
							disabled={isPending || !isValid}
						>
							{t("accounting.settings.save")}
						</Button>
					</div>
				</form>
			</SheetContent>
		</Sheet>
	);
};
