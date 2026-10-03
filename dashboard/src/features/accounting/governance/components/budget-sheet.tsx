import { zodResolver } from "@hookform/resolvers/zod";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import type { z } from "zod";

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
import { Switch } from "@/components/ui/switch";
import { useAccounts } from "@/features/accounting/chart-of-accounts/hooks/use-chart-of-accounts";
import { AccountingFormSheet } from "@/features/accounting/components/accounting-form-sheet";
import { useCostCenters } from "@/features/accounting/cost-centers/hooks/use-cost-centers";
import { useFiscalYears } from "@/features/accounting/fiscal-years/hooks/use-fiscal-years";
import { useBudgetActions } from "@/features/accounting/governance/hooks/use-budgets";
import { AccountRootType, BudgetAction } from "@/generated/prisma/enums";
import {
	type CreateBudgetFormInput,
	createBudgetSchema,
} from "@sanad/contracts/runtime/server/accounting/budget/budget.type";

/**
 * [P11.6] Create sheet for a Budget (§13). `budgetAgainst` stays COST_CENTER — no PROJECT
 * UI in v1 (the schema default carries it). `monthlyDistributionId` has no UI either:
 * there is no monthly-distribution master endpoint to list from yet, and the field is
 * optional. Budget accounts mirror the server rule (non-group P&L accounts —
 * `budget.service`); the cost-center selector allows groups because a group budget covers
 * its whole subtree (ERPNext parity, same service).
 */

type BudgetFormInput = z.input<typeof createBudgetSchema>;

const DEFAULTS: BudgetFormInput = {
	fiscalYear: "",
	budgetAgainst: "COST_CENTER",
	costCenterId: null,
	project: null,
	monthlyDistributionId: null,
	applicableOnBookingActualExpenses: true,
	actionIfAnnualExceeded: BudgetAction.STOP,
	actionIfAccumulatedMonthlyExceeded: BudgetAction.WARN,
	accounts: [{ accountId: "", budgetAmount: "" }],
};

const ACTION_LABELS: Record<BudgetAction, string> = {
	STOP: "إيقاف",
	WARN: "تحذير",
	IGNORE: "تجاهل",
};

export type BudgetSheetProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export const BudgetSheet = ({ open, onOpenChange }: BudgetSheetProps) => {
	const { fiscalYears } = useFiscalYears();
	const { costCenters } = useCostCenters();
	const { accounts } = useAccounts();
	const { create, isSaving } = useBudgetActions();

	// same filter the server enforces: budget lines are non-group P&L accounts (§13)
	const budgetableLeaves = accounts.filter(
		(account) =>
			!account.isGroup &&
			(account.rootType === AccountRootType.EXPENSE ||
				account.rootType === AccountRootType.INCOME),
	);

	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<BudgetFormInput, unknown, CreateBudgetFormInput>({
		resolver: zodResolver(createBudgetSchema),
		defaultValues: DEFAULTS,
	});
	const { fields, append, remove } = useFieldArray({ control, name: "accounts" });

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
			title="موازنة جديدة"
			description="سقف سنوي لكل (سنة مالية، مركز تكلفة، حساب) مع إجراء عند التجاوز (§13)."
			onSubmit={onSubmit}
			isSaving={isSaving}
			submitLabel="إنشاء"
			wide
		>
			<Controller
				name="fiscalYear"
				control={control}
				render={({ field }) => (
					<Field data-invalid={!!errors.fiscalYear}>
						<Label>
							السنة المالية <span className="text-rose-500">*</span>
						</Label>
						<Select
							value={field.value || ""}
							onValueChange={field.onChange}
							dir="rtl"
							disabled={isSaving}
						>
							<SelectTrigger aria-invalid={!!errors.fiscalYear}>
								<SelectValue placeholder="اختر السنة المالية..." />
							</SelectTrigger>
							<SelectContent dir="rtl">
								{fiscalYears.map((fy) => (
									<SelectItem
										key={fy.id}
										value={fy.year}
									>
										{fy.year}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{/* static Arabic message — the schema's own min(1) text is not localized */}
						<FieldError
							errors={[errors.fiscalYear ? { message: "اختر السنة المالية" } : undefined]}
						/>
					</Field>
				)}
			/>

			<Controller
				name="costCenterId"
				control={control}
				render={({ field }) => (
					<Field data-invalid={!!errors.costCenterId}>
						<Label>
							مركز التكلفة <span className="text-rose-500">*</span>
						</Label>
						<Select
							value={field.value ?? ""}
							onValueChange={field.onChange}
							dir="rtl"
							disabled={isSaving}
						>
							<SelectTrigger aria-invalid={!!errors.costCenterId}>
								<SelectValue placeholder="اختر مركز التكلفة..." />
							</SelectTrigger>
							<SelectContent dir="rtl">
								{costCenters.map((costCenter) => (
									<SelectItem
										key={costCenter.id}
										value={costCenter.id}
									>
										{costCenter.costCenterName}
										{costCenter.isGroup ? " (مجموعة)" : ""}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<FieldError errors={[errors.costCenterId]} />
					</Field>
				)}
			/>

			<div className="grid grid-cols-2 gap-4">
				<Controller
					name="actionIfAnnualExceeded"
					control={control}
					render={({ field }) => (
						<Field data-invalid={!!errors.actionIfAnnualExceeded}>
							<Label>عند تجاوز السقف السنوي</Label>
							<Select
								value={field.value ?? BudgetAction.STOP}
								onValueChange={field.onChange}
								dir="rtl"
								disabled={isSaving}
							>
								<SelectTrigger aria-invalid={!!errors.actionIfAnnualExceeded}>
									<SelectValue />
								</SelectTrigger>
								<SelectContent dir="rtl">
									{Object.values(BudgetAction).map((action) => (
										<SelectItem
											key={action}
											value={action}
										>
											{ACTION_LABELS[action]}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FieldError errors={[errors.actionIfAnnualExceeded]} />
						</Field>
					)}
				/>

				<Controller
					name="actionIfAccumulatedMonthlyExceeded"
					control={control}
					render={({ field }) => (
						<Field data-invalid={!!errors.actionIfAccumulatedMonthlyExceeded}>
							<Label>عند تجاوز المتراكم الشهري</Label>
							<Select
								value={field.value ?? BudgetAction.WARN}
								onValueChange={field.onChange}
								dir="rtl"
								disabled={isSaving}
							>
								<SelectTrigger aria-invalid={!!errors.actionIfAccumulatedMonthlyExceeded}>
									<SelectValue />
								</SelectTrigger>
								<SelectContent dir="rtl">
									{Object.values(BudgetAction).map((action) => (
										<SelectItem
											key={action}
											value={action}
										>
											{ACTION_LABELS[action]}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FieldError errors={[errors.actionIfAccumulatedMonthlyExceeded]} />
						</Field>
					)}
				/>
			</div>

			<Controller
				name="applicableOnBookingActualExpenses"
				control={control}
				render={({ field }) => (
					<Field
						orientation="horizontal"
						className="justify-between"
					>
						<Label>تطبيق عند ترحيل المصروف الفعلي</Label>
						<Switch
							checked={field.value ?? true}
							onCheckedChange={field.onChange}
							disabled={isSaving}
						/>
					</Field>
				)}
			/>

			{/* dynamic budget lines — account + annual cap per row */}
			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<Label>
						حسابات الموازنة <span className="text-rose-500">*</span>
					</Label>
					<Button
						type="button"
						variant="outline"
						size="xs"
						disabled={isSaving}
						onClick={() => append({ accountId: "", budgetAmount: "" })}
					>
						<IconPlus className="size-4" /> إضافة حساب
					</Button>
				</div>

				{fields.map((row, index) => (
					<div
						key={row.id}
						className="flex items-start gap-2"
					>
						<Controller
							name={`accounts.${index}.accountId`}
							control={control}
							render={({ field }) => (
								<Field
									data-invalid={!!errors.accounts?.[index]?.accountId}
									className="flex-1"
								>
									<Select
										value={field.value || ""}
										onValueChange={field.onChange}
										dir="rtl"
										disabled={isSaving}
									>
										<SelectTrigger aria-invalid={!!errors.accounts?.[index]?.accountId}>
											<SelectValue placeholder="حساب مصروف أو إيراد ورقي..." />
										</SelectTrigger>
										<SelectContent dir="rtl">
											{budgetableLeaves.map((account) => (
												<SelectItem
													key={account.id}
													value={account.id}
												>
													{account.accountName}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{/* static Arabic message — the schema's own min(1) text is not localized */}
									<FieldError
										errors={[
											errors.accounts?.[index]?.accountId
												? { message: "اختر الحساب" }
												: undefined,
										]}
									/>
								</Field>
							)}
						/>

						<Field
							data-invalid={!!errors.accounts?.[index]?.budgetAmount}
							className="w-40"
						>
							<Input
								dir="ltr"
								inputMode="decimal"
								placeholder="السقف السنوي"
								className="text-end tabular-nums"
								aria-invalid={!!errors.accounts?.[index]?.budgetAmount}
								{...register(`accounts.${index}.budgetAmount`)}
								disabled={isSaving}
							/>
							<FieldError errors={[errors.accounts?.[index]?.budgetAmount]} />
						</Field>

						<Button
							type="button"
							variant="ghost"
							size="icon-xs"
							className="mt-1.5"
							aria-label="حذف السطر"
							disabled={isSaving || fields.length === 1}
							onClick={() => remove(index)}
						>
							<IconTrash className="size-4" />
						</Button>
					</div>
				))}
				{/* the array-level min(1) message ("أضف حساب موازنة واحدًا على الأقل") */}
				<FieldError
					errors={[
						errors.accounts?.message || errors.accounts?.root?.message
							? { message: errors.accounts?.message ?? errors.accounts?.root?.message }
							: undefined,
					]}
				/>
			</div>
		</AccountingFormSheet>
	);
};
