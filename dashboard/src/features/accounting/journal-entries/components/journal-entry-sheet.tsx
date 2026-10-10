import { zodResolver } from "@hookform/resolvers/zod";
import { IconPlus, IconScale, IconTrash } from "@tabler/icons-react";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";

import { DateField } from "@/components/common/date-field";
import { Button } from "@/components/ui/button";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxTrigger,
	ComboboxValue,
} from "@/components/ui/combobox";
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
import { useAccounts } from "@/features/accounting/chart-of-accounts/hooks/use-chart-of-accounts";
import { AccountingFormSheet } from "@/features/accounting/components/accounting-form-sheet";
import { JournalEntryPartyFields } from "@/features/accounting/journal-entries/components/journal-entry-party-fields";
import {
	useJournalEntryActions,
	useJournalEntryTemplates,
} from "@/features/accounting/journal-entries/hooks/use-journal-entries";
import { useParties } from "@/features/accounting/parties/hooks/use-parties";
import {
	diffAmountStrings,
	fromNano,
	sumAmountStrings,
	toNano,
} from "@/features/accounting/utils/amount-strings";
import {
	type CreateJournalEntryFormInput,
	type CreateJournalEntryFormValues,
	createJournalEntrySchema,
	JE_VOUCHER_TYPES,
	type JournalEntryResponse,
} from "@sanad/contracts/runtime/server/accounting/journal-entry/journal-entry.type";

export const JE_VOUCHER_TYPE_LABEL: Record<(typeof JE_VOUCHER_TYPES)[number], string> = {
	"Journal Entry": "قيد يومية",
	"Bank Entry": "قيد بنكي",
	"Cash Entry": "قيد نقدي",
	"Exchange Gain Or Loss": "فرق عملة محقق",
	"Exchange Rate Revaluation": "إعادة تقييم عملة",
	"Contra Entry": "تحويل داخلي",
	"Opening Entry": "قيد افتتاحي",
};

const EMPTY_ROW = {
	accountId: "",
	debit: "0",
	credit: "0",
	costCenterId: null,
	userRemark: null,
	partyType: null,
	partyId: null,
	referenceType: null,
	referenceId: null,
};

const DEFAULTS: CreateJournalEntryFormInput = {
	voucherType: "Journal Entry",
	postingDate: "",
	chequeNo: null,
	chequeDate: null,
	remark: null,
	rows: [{ ...EMPTY_ROW }, { ...EMPTY_ROW }],
};

export type JournalEntrySheetProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** when set (must be a DRAFT), the sheet edits it; otherwise it creates */
	editing?: JournalEntryResponse | null;
};

/**
 * [P2.5] The Journal Entry grid (CONTRACT gap G2): editable Dr/Cr rows with an account
 * combobox, live totals + difference indicator (float-free), quick-balance, per-type
 * fields (Bank Entry reference block) and template pre-fill — inside the standard
 * accounting Sheet (wide voucher variant).
 */
export const JournalEntrySheet = ({ open, onOpenChange, editing }: JournalEntrySheetProps) => {
	const { create, update, isPending } = useJournalEntryActions();
	const { accounts } = useAccounts();
	const { templates } = useJournalEntryTemplates();
	const { parties } = useParties();
	const postable = accounts.filter((a) => !a.isGroup && !a.freezeAccount && !a.disabled);
	// [P3.3] BR-4.3.3 — party fields appear only when the row's account is AR/AP
	const accountTypeOf = (id: string | null | undefined) =>
		postable.find((a) => a.id === id)?.accountType ?? null;
	const isEdit = !!editing && editing.docstatus === "DRAFT";

	const {
		control,
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { errors },
	} = useForm<CreateJournalEntryFormInput, unknown, CreateJournalEntryFormValues>({
		resolver: zodResolver(createJournalEntrySchema),
		defaultValues: DEFAULTS,
	});
	const { fields, append, remove } = useFieldArray({ control, name: "rows" });

	useEffect(() => {
		if (!open) return;
		if (editing) {
			reset({
				voucherType: editing.voucherType as CreateJournalEntryFormInput["voucherType"],
				postingDate: new Date(editing.postingDate).toISOString().slice(0, 10),
				chequeNo: editing.chequeNo,
				chequeDate: editing.chequeDate
					? new Date(editing.chequeDate).toISOString().slice(0, 10)
					: null,
				remark: editing.remark,
				rows: editing.rows.map((row) => ({
					accountId: row.accountId,
					debit: row.debit.toString(),
					credit: row.credit.toString(),
					costCenterId: row.costCenterId,
					userRemark: row.userRemark,
					partyType: row.partyType,
					partyId: row.partyId,
				})),
			});
		} else {
			reset({ ...DEFAULTS, rows: [{ ...EMPTY_ROW }, { ...EMPTY_ROW }] });
		}
	}, [open, editing, reset]);

	const watchedRows = useWatch({ control, name: "rows" }) ?? [];
	const voucherType = useWatch({ control, name: "voucherType" });
	const totalDebit = sumAmountStrings(watchedRows.map((r) => r?.debit));
	const totalCredit = sumAmountStrings(watchedRows.map((r) => r?.credit));
	const difference = diffAmountStrings(
		watchedRows.map((r) => r?.debit),
		watchedRows.map((r) => r?.credit),
	);
	const isBalanced = difference === "0";

	/** Close the difference on the LAST row's lighter side (quick-balance). */
	const quickBalance = () => {
		const diffNano = toNano(totalDebit) - toNano(totalCredit);
		if (diffNano === 0n || watchedRows.length === 0) return;
		const last = watchedRows.length - 1;
		if (diffNano > 0n) {
			const current = toNano(watchedRows[last]?.credit);
			setValue(`rows.${last}.credit`, fromNano(current + diffNano));
			setValue(`rows.${last}.debit`, "0");
		} else {
			const current = toNano(watchedRows[last]?.debit);
			setValue(`rows.${last}.debit`, fromNano(current - diffNano));
			setValue(`rows.${last}.credit`, "0");
		}
	};

	const applyTemplate = (templateId: string) => {
		const template = templates.find((t) => t.id === templateId);
		if (!template) return;
		setValue(
			"voucherType",
			template.voucherType as CreateJournalEntryFormInput["voucherType"],
		);
		setValue(
			"rows",
			template.accountIds.map((accountId) => ({ ...EMPTY_ROW, accountId })),
		);
	};

	// toast.promise (inside the hook) owns success/error feedback; close the sheet immediately.
	const onSubmit = handleSubmit((values) => {
		if (isEdit && editing) update(editing.id, values);
		else create(values);
		onOpenChange(false);
	});

	const accountLabel = (id: string | undefined) => {
		const account = postable.find((a) => a.id === id);
		return account
			? account.accountNumber
				? `${account.accountNumber} - ${account.accountName}`
				: account.accountName
			: undefined;
	};

	return (
		<AccountingFormSheet
			open={open}
			onOpenChange={onOpenChange}
			title={isEdit ? `تعديل مسودة قيد` : "قيد يومية جديد"}
			description="الترحيل هو الحدث الوحيد الذي يكتب في دفتر الأستاذ — المسودة بلا أثر."
			onSubmit={onSubmit}
			isSaving={isPending}
			submitLabel={isEdit ? "حفظ" : "إنشاء مسودة"}
			submitDisabled={!isBalanced}
			wide
		>
			<div className="grid grid-cols-2 gap-3">
				<Controller
					name="voucherType"
					control={control}
					render={({ field }) => (
						<Field>
							<Label>نوع القيد</Label>
							<Select
								value={field.value}
								onValueChange={field.onChange}
								dir="rtl"
								disabled={isPending}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{JE_VOUCHER_TYPES.map((vt) => (
										<SelectItem
											key={vt}
											value={vt}
										>
											{JE_VOUCHER_TYPE_LABEL[vt]}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</Field>
					)}
				/>
				<Controller
					name="postingDate"
					control={control}
					render={({ field }) => (
						<Field data-invalid={!!errors.postingDate}>
							<Label>
								تاريخ الترحيل <span className="text-rose-500">*</span>
							</Label>
							<DateField
								value={field.value}
								onChange={field.onChange}
								placeholder="YYYY-MM-DD"
								invalid={!!errors.postingDate}
								triggerDisabled={isPending}
							/>
							<FieldError errors={[errors.postingDate]} />
						</Field>
					)}
				/>
			</div>

			{voucherType === "Bank Entry" && (
				<div className="grid grid-cols-2 gap-3">
					<Field data-invalid={!!errors.chequeNo}>
						<Label>
							رقم المرجع <span className="text-rose-500">*</span>
						</Label>
						<Input
							dir="ltr"
							{...register("chequeNo")}
							disabled={isPending}
						/>
					</Field>
					<Controller
						name="chequeDate"
						control={control}
						render={({ field }) => (
							<Field>
								<Label>
									تاريخ المرجع <span className="text-rose-500">*</span>
								</Label>
								<DateField
									value={field.value ?? ""}
									onChange={field.onChange}
									placeholder="YYYY-MM-DD"
									triggerDisabled={isPending}
								/>
							</Field>
						)}
					/>
				</div>
			)}

			{templates.length > 0 && !isEdit && (
				<Field>
					<Label>قالب (FR-7.1.6)</Label>
					<Select
						onValueChange={applyTemplate}
						dir="rtl"
						disabled={isPending}
					>
						<SelectTrigger>
							<SelectValue placeholder="ابدأ من قالب..." />
						</SelectTrigger>
						<SelectContent>
							{templates.map((template) => (
								<SelectItem
									key={template.id}
									value={template.id}
								>
									{template.templateTitle}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</Field>
			)}

			<div className="space-y-2">
				{/* grid header — RTL flow: account (widest) → debit → credit → delete */}
				<div className="flex items-center gap-2 text-muted-foreground text-xs">
					<span className="flex-1">الحساب</span>
					<span className="w-28 text-center">مدين</span>
					<span className="w-28 text-center">دائن</span>
					<span className="w-8" />
				</div>

				{fields.map((rowField, index) => (
					<div
						key={rowField.id}
						className="space-y-1"
					>
						<div className="flex items-start gap-2">
							<Controller
								name={`rows.${index}.accountId`}
								control={control}
								render={({ field }) => (
									<Field
										className="flex-1"
										data-invalid={!!errors.rows?.[index]?.accountId}
									>
										<Combobox
											value={field.value ?? ""}
											onValueChange={(value) => {
												const next = typeof value === "string" ? value : "";
												field.onChange(next);
												// BR-4.3.3: party belongs to AR/AP rows only — clear it
												// whenever the account moves off (or across) the ledger side
												const type = accountTypeOf(next);
												if (type !== "RECEIVABLE" && type !== "PAYABLE") {
													setValue(`rows.${index}.partyType`, null);
													setValue(`rows.${index}.partyId`, null);
												}
											}}
										>
											<ComboboxTrigger className="flex h-9 w-full items-center justify-between rounded-[4px] border border-input bg-transparent px-3 py-2 text-sm">
												<ComboboxValue
													placeholder="اختر الحساب..."
													className="truncate"
												>
													{accountLabel(field.value)}
												</ComboboxValue>
											</ComboboxTrigger>
											<ComboboxContent dir="rtl">
												<ComboboxList>
													{postable.length === 0 ? (
														<ComboboxEmpty>لا حسابات قابلة للترحيل</ComboboxEmpty>
													) : (
														postable.map((account) => (
															<ComboboxItem
																key={account.id}
																value={account.id}
															>
																<span className="truncate">{account.accountName}</span>
																{account.accountNumber && (
																	<span
																		dir="ltr"
																		className="ms-auto font-mono text-muted-foreground text-xs"
																	>
																		{account.accountNumber}
																	</span>
																)}
															</ComboboxItem>
														))
													)}
												</ComboboxList>
											</ComboboxContent>
										</Combobox>
									</Field>
								)}
							/>
							<Field className="w-28">
								<Input
									dir="ltr"
									inputMode="decimal"
									className="text-end tabular-nums"
									aria-invalid={!!errors.rows?.[index]?.debit}
									{...register(`rows.${index}.debit`)}
									disabled={isPending}
								/>
							</Field>
							<Field className="w-28">
								<Input
									dir="ltr"
									inputMode="decimal"
									className="text-end tabular-nums"
									aria-invalid={!!errors.rows?.[index]?.credit}
									{...register(`rows.${index}.credit`)}
									disabled={isPending}
								/>
							</Field>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								aria-label="حذف السطر"
								disabled={isPending || fields.length <= 2}
								onClick={() => remove(index)}
							>
								<IconTrash className="size-4" />
							</Button>
						</div>

						{/* [P3.3/P3.4] party + settle-against sub-row — AR/AP accounts only */}
						{(() => {
							const type = accountTypeOf(watchedRows[index]?.accountId);
							if (type !== "RECEIVABLE" && type !== "PAYABLE") return null;
							return (
								<JournalEntryPartyFields
									side={type}
									partyType={watchedRows[index]?.partyType ?? null}
									partyId={watchedRows[index]?.partyId ?? null}
									referenceId={watchedRows[index]?.referenceId ?? null}
									disabled={isPending}
									parties={parties}
									onPartyChange={(partyType, partyId) => {
										setValue(`rows.${index}.partyType`, partyType);
										setValue(`rows.${index}.partyId`, partyId);
										// a new party invalidates any previous settlement target
										setValue(`rows.${index}.referenceType`, null);
										setValue(`rows.${index}.referenceId`, null);
									}}
									onReferenceChange={(referenceType, referenceId) => {
										setValue(`rows.${index}.referenceType`, referenceType);
										setValue(`rows.${index}.referenceId`, referenceId);
									}}
								/>
							);
						})()}
					</div>
				))}

				<div className="flex items-center gap-2">
					<Button
						type="button"
						variant="outline"
						size="sm"
						disabled={isPending}
						onClick={() => append({ ...EMPTY_ROW })}
					>
						<IconPlus className="size-4" />
						إضافة سطر
					</Button>
					<Button
						type="button"
						variant="outline"
						size="sm"
						disabled={isPending || isBalanced}
						onClick={quickBalance}
					>
						<IconScale className="size-4" />
						موازنة سريعة
					</Button>
				</div>

				{/* live totals + difference indicator (G2) */}
				<div className="flex items-center justify-between rounded-[4px] border bg-muted/40 px-3 py-2 text-sm">
					<span>
						الإجمالي — مدين:{" "}
						<b
							dir="ltr"
							className="tabular-nums"
						>
							{totalDebit}
						</b>{" "}
						· دائن:{" "}
						<b
							dir="ltr"
							className="tabular-nums"
						>
							{totalCredit}
						</b>
					</span>
					<span
						className={isBalanced ? "text-emerald-600" : "text-rose-500"}
						dir="ltr"
					>
						{isBalanced ? "متوازن ✓" : `الفرق: ${difference}`}
					</span>
				</div>
			</div>

			<Field>
				<Label>ملاحظة</Label>
				<Input
					{...register("remark")}
					disabled={isPending}
				/>
			</Field>
		</AccountingFormSheet>
	);
};
