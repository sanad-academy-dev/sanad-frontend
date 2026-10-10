import { zodResolver } from "@hookform/resolvers/zod";
import {
	IconAlertTriangle,
	IconPencil,
	IconPlus,
	IconTrash,
	IconWand,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useBankAccounts } from "@/features/accounting/bank/hooks/use-bank-reconciliation";
import {
	useBankRuleActions,
	useBankRules,
} from "@/features/accounting/bank/hooks/use-bank-rules";
import { useAccounts } from "@/features/accounting/chart-of-accounts/hooks/use-chart-of-accounts";
import { AccountingConfirmDialog } from "@/features/accounting/components/accounting-confirm-dialog";
import { AccountingFormSheet } from "@/features/accounting/components/accounting-form-sheet";
import {
	useAccountsSettings,
	useUpdateAccountsSettings,
} from "@/features/accounting/settings/hooks/use-accounts-settings";
import { formatAmount } from "@/features/accounting/utils/format-amount";
import { BankRuleDirection } from "@/generated/prisma/enums";
import type { RuleRunResult } from "@/server/accounting/bank/bank-rules.service";
import {
	type BankRuleResponse,
	type UpsertBankRuleFormInput,
	upsertBankRuleSchema,
} from "@sanad/contracts/runtime/server/accounting/bank/bank-transaction.type";

/**
 * [P12A.3] «قواعد البنك» (FR-14.3) — manage the ordered auto-classification rules: first
 * match (by ascending priority) books a JE against the rule's contra account and settles
 * the transaction. The engine sits behind `enable_bank_transaction_rules` (§19); the screen
 * banners while the flag is OFF and flips it through the EXISTING accounts-settings hooks.
 */

const DIRECTION_LABELS: Record<BankRuleDirection, string> = {
	ANY: "أي اتجاه",
	DEPOSIT: "إيداع فقط",
	WITHDRAWAL: "سحب فقط",
};

export const BankRulesPage = () => {
	const { settings, isLoading: settingsLoading } = useAccountsSettings();
	const { updateSettings, isPending: settingsSaving } = useUpdateAccountsSettings();
	const { rules, isLoading } = useBankRules();
	const { bankAccounts } = useBankAccounts();
	const actions = useBankRuleActions();

	const [sheetOpen, setSheetOpen] = useState(false);
	const [editing, setEditing] = useState<BankRuleResponse | null>(null);
	const [deleting, setDeleting] = useState<BankRuleResponse | null>(null);
	const [runConfirmOpen, setRunConfirmOpen] = useState(false);
	const [runResult, setRunResult] = useState<RuleRunResult | null>(null);

	const rulesEnabled = settings?.enable_bank_transaction_rules ?? false;
	const bankAccountName = (id: string | null) => {
		if (!id) return null;
		const account = bankAccounts.find((row) => row.id === id);
		return account ? `${account.bank.bankName} — ${account.accountName}` : id;
	};

	/** the وصف يحتوي/الاتجاه/مبلغ من-إلى/حساب بنكي condition column */
	const conditionSummary = (rule: BankRuleResponse): string => {
		const parts: string[] = [];
		if (rule.descriptionContains) parts.push(`الوصف يحتوي «${rule.descriptionContains}»`);
		if (rule.direction !== BankRuleDirection.ANY) {
			parts.push(DIRECTION_LABELS[rule.direction]);
		}
		if (rule.minAmount !== null && rule.maxAmount !== null) {
			parts.push(
				`المبلغ من ${formatAmount(rule.minAmount.toString())} إلى ${formatAmount(rule.maxAmount.toString())}`,
			);
		} else if (rule.minAmount !== null) {
			parts.push(`المبلغ من ${formatAmount(rule.minAmount.toString())}`);
		} else if (rule.maxAmount !== null) {
			parts.push(`المبلغ حتى ${formatAmount(rule.maxAmount.toString())}`);
		}
		const accountName = bankAccountName(rule.bankAccountId);
		if (accountName) parts.push(`الحساب البنكي: ${accountName}`);
		return parts.length > 0 ? parts.join(" · ") : "بلا شروط — تطابق كل الحركات";
	};

	const runNow = async () => {
		setRunConfirmOpen(false);
		try {
			const result = await actions.runRules();
			setRunResult(result);
		} catch {
			// toast already reported the failure (same handling as the adapter run panel)
		}
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<div className="px-4 pt-3">
				<h1 className="font-medium text-lg">قواعد البنك</h1>
				<p className="text-muted-foreground text-sm">
					FR-14.3 — قواعد مرتّبة بالأولوية تصنّف حركات كشف الحساب تلقائيًا: أول قاعدة مطابقة تُنشئ
					قيد اليومية على حسابها المقابل وتقفل الحركة.
				</p>
			</div>

			{/* the §19 engine flag — while OFF the sweep refuses to run, so banner it here
			    (same master-switch row pattern as the dimensions tab; tokens only) */}
			{!settingsLoading && !rulesEnabled ? (
				<div className="mx-4 mt-3 flex items-center gap-3 rounded-md border border-destructive/40 bg-destructive/5 p-3">
					<IconAlertTriangle className="size-5 shrink-0 text-destructive" />
					<div className="flex-1">
						<p className="font-medium text-sm">محرك القواعد متوقف</p>
						<p className="text-muted-foreground text-xs">
							خاصية «قواعد الحركات البنكية» (§19) غير مفعّلة — يمكن إدارة القواعد لكن التشغيل
							معطّل حتى تفعيلها.
						</p>
					</div>
					<Switch
						checked={rulesEnabled}
						onCheckedChange={(next) => updateSettings({ enable_bank_transaction_rules: next })}
						disabled={settingsSaving}
						aria-label="تفعيل قواعد الحركات البنكية"
					/>
				</div>
			) : null}

			{/* toolbar */}
			<div className="flex flex-wrap items-center gap-2 px-4 py-3">
				<Button
					type="button"
					size="sm"
					onClick={() => {
						setEditing(null);
						setSheetOpen(true);
					}}
				>
					<IconPlus className="size-4" /> قاعدة جديدة
				</Button>
				<Button
					type="button"
					variant="outline"
					size="sm"
					className="ms-auto"
					disabled={!rulesEnabled || actions.isPending || rules.length === 0}
					onClick={() => setRunConfirmOpen(true)}
				>
					<IconWand className="size-4" /> تشغيل القواعد الآن
				</Button>
			</div>

			{runResult ? (
				<div className="mx-4 mb-3 space-y-1 rounded-[4px] border p-2 text-sm">
					<p>
						فُحصت <strong dir="ltr">{runResult.scanned}</strong> حركة غير مسوّاة — سُوّيت{" "}
						<strong dir="ltr">{runResult.settled.length}</strong> منها.
					</p>
					{runResult.settled.length > 0 ? (
						<ul className="max-h-32 space-y-1 overflow-y-auto text-muted-foreground text-xs">
							{runResult.settled.map((row) => (
								<li key={row.bankTransactionId}>
									<span dir="ltr">{row.bankTransactionId}</span> ← القاعدة «{row.ruleName}»
								</li>
							))}
						</ul>
					) : null}
				</div>
			) : null}

			<div className="min-h-0 flex-1 overflow-auto border-t">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>الاسم</TableHead>
							<TableHead className="text-end">الأولوية</TableHead>
							<TableHead>الشروط</TableHead>
							<TableHead>الحساب المقابل</TableHead>
							<TableHead>الحالة</TableHead>
							<TableHead className="w-20" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{rules.map((rule) => (
							<TableRow key={rule.id}>
								<TableCell className="font-medium">{rule.ruleName}</TableCell>
								<TableCell
									className="text-end tabular-nums"
									dir="ltr"
								>
									{rule.priority}
								</TableCell>
								<TableCell className="max-w-72">{conditionSummary(rule)}</TableCell>
								<TableCell>{rule.contraAccount.accountName}</TableCell>
								<TableCell>
									{rule.disabled ? (
										<Badge variant="destructive">معطّلة</Badge>
									) : (
										<Badge variant="outline">مُفعّلة</Badge>
									)}
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-1">
										<Button
											variant="ghost"
											size="icon-xs"
											aria-label="تعديل"
											onClick={() => {
												setEditing(rule);
												setSheetOpen(true);
											}}
										>
											<IconPencil className="size-4" />
										</Button>
										<Button
											variant="ghost"
											size="icon-xs"
											aria-label="حذف"
											onClick={() => setDeleting(rule)}
										>
											<IconTrash className="size-4" />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
						{rules.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={6}
									className="py-8 text-center text-muted-foreground"
								>
									{isLoading ? "جارٍ التحميل..." : "لا قواعد بعد — أنشئ أول قاعدة."}
								</TableCell>
							</TableRow>
						) : null}
					</TableBody>
				</Table>
			</div>

			<BankRuleSheet
				open={sheetOpen}
				onOpenChange={setSheetOpen}
				editing={editing}
			/>

			<AccountingConfirmDialog
				open={deleting !== null}
				onOpenChange={(open) => {
					if (!open) setDeleting(null);
				}}
				title="حذف القاعدة"
				description={`سيُحذف تعريف القاعدة «${deleting?.ruleName ?? ""}» نهائيًا — القيود التي أنشأتها سابقًا لا تتأثر.`}
				onConfirm={() => {
					if (deleting) actions.deleteRule(deleting.id);
					setDeleting(null);
				}}
				isPending={actions.isPending}
			/>

			<Dialog
				open={runConfirmOpen}
				onOpenChange={setRunConfirmOpen}
			>
				<DialogContent
					dir="rtl"
					className="sm:max-w-sm"
				>
					<DialogHeader>
						<DialogTitle>تشغيل القواعد الآن</DialogTitle>
						<DialogDescription>
							تُفحص الحركات المرحّلة غير المسوّاة بالترتيب؛ أول قاعدة مطابقة تُنشئ قيد يومية وتقفل
							الحركة — القيود المُنشأة تُلغى من شاشة قيود اليومية عند الحاجة.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setRunConfirmOpen(false)}
						>
							إلغاء
						</Button>
						<Button
							type="button"
							disabled={actions.isPending}
							onClick={runNow}
						>
							<IconWand className="size-4" /> تشغيل
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

type BankRuleFormInput = z.input<typeof upsertBankRuleSchema>;

const DEFAULTS: BankRuleFormInput = {
	ruleName: "",
	priority: 0,
	disabled: false,
	descriptionContains: null,
	direction: BankRuleDirection.ANY,
	minAmount: null,
	maxAmount: null,
	bankAccountId: null,
	contraAccountId: "",
};

/** empty text inputs post as null — the schema's nullish strings reject "" */
const emptyToNull = (value: unknown) =>
	typeof value === "string" && value.trim() === "" ? null : value;

/** sentinel for the optional bank-account Select — Radix rejects empty-string values */
const ANY_BANK_ACCOUNT = "ANY";

/** Create/edit sheet — fields mirror `BankRuleUpsert` (bank-rules.service). */
const BankRuleSheet = ({
	open,
	onOpenChange,
	editing,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	editing: BankRuleResponse | null;
}) => {
	const { bankAccounts } = useBankAccounts();
	const { accounts } = useAccounts();
	const { upsertRule, isPending } = useBankRuleActions();
	const isEdit = !!editing;

	const companyAccounts = bankAccounts.filter((account) => account.isCompanyAccount);
	// the action books a JE against this account — live leaves only (same filter as server)
	const contraLeaves = accounts.filter((account) => !account.isGroup && !account.disabled);

	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<BankRuleFormInput, unknown, UpsertBankRuleFormInput>({
		resolver: zodResolver(upsertBankRuleSchema),
		defaultValues: DEFAULTS,
	});

	useEffect(() => {
		if (!open) return;
		if (editing) {
			reset({
				ruleName: editing.ruleName,
				priority: editing.priority,
				disabled: editing.disabled,
				descriptionContains: editing.descriptionContains,
				direction: editing.direction,
				minAmount: editing.minAmount?.toString() ?? null,
				maxAmount: editing.maxAmount?.toString() ?? null,
				bankAccountId: editing.bankAccountId,
				contraAccountId: editing.contraAccountId,
			});
		} else {
			reset(DEFAULTS);
		}
	}, [open, editing, reset]);

	// toast.promise (inside the hook) owns success/error feedback; close the sheet immediately.
	const onSubmit = handleSubmit((values) => {
		upsertRule(isEdit && editing ? { ...values, id: editing.id } : values);
		onOpenChange(false);
	});

	return (
		<AccountingFormSheet
			open={open}
			onOpenChange={onOpenChange}
			title={isEdit ? `تعديل القاعدة «${editing?.ruleName ?? ""}»` : "قاعدة جديدة"}
			description="كل الشروط المُعبّأة يجب أن تتحقق معًا؛ الأولوية الأصغر تُفحص أولًا (FR-14.3)."
			onSubmit={onSubmit}
			isSaving={isPending}
			submitLabel={isEdit ? "حفظ" : "إنشاء"}
		>
			<Field data-invalid={!!errors.ruleName}>
				<Label>
					اسم القاعدة <span className="text-rose-500">*</span>
				</Label>
				<Input
					aria-invalid={!!errors.ruleName}
					{...register("ruleName")}
					disabled={isPending}
				/>
				<FieldError errors={[errors.ruleName]} />
			</Field>

			<Field data-invalid={!!errors.priority}>
				<Label>الأولوية (الأصغر أولًا)</Label>
				<Input
					type="number"
					min={0}
					step={1}
					dir="ltr"
					aria-invalid={!!errors.priority}
					{...register("priority")}
					disabled={isPending}
				/>
				<FieldError errors={[errors.priority]} />
			</Field>

			<Field data-invalid={!!errors.descriptionContains}>
				<Label>الوصف يحتوي (اختياري)</Label>
				<Input
					aria-invalid={!!errors.descriptionContains}
					{...register("descriptionContains", { setValueAs: emptyToNull })}
					disabled={isPending}
					placeholder="نص يُبحث عنه داخل بيان الحركة..."
				/>
				<FieldError errors={[errors.descriptionContains]} />
			</Field>

			<Controller
				name="direction"
				control={control}
				render={({ field }) => (
					<Field data-invalid={!!errors.direction}>
						<Label>الاتجاه</Label>
						<Select
							value={field.value ?? BankRuleDirection.ANY}
							onValueChange={field.onChange}
							dir="rtl"
							disabled={isPending}
						>
							<SelectTrigger aria-invalid={!!errors.direction}>
								<SelectValue />
							</SelectTrigger>
							<SelectContent dir="rtl">
								{Object.values(BankRuleDirection).map((direction) => (
									<SelectItem
										key={direction}
										value={direction}
									>
										{DIRECTION_LABELS[direction]}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<FieldError errors={[errors.direction]} />
					</Field>
				)}
			/>

			<div className="grid grid-cols-2 gap-3">
				<Field data-invalid={!!errors.minAmount}>
					<Label>المبلغ من (اختياري)</Label>
					<Input
						dir="ltr"
						inputMode="decimal"
						aria-invalid={!!errors.minAmount}
						{...register("minAmount", { setValueAs: emptyToNull })}
						disabled={isPending}
					/>
					<FieldError errors={[errors.minAmount]} />
				</Field>
				<Field data-invalid={!!errors.maxAmount}>
					<Label>المبلغ إلى (اختياري)</Label>
					<Input
						dir="ltr"
						inputMode="decimal"
						aria-invalid={!!errors.maxAmount}
						{...register("maxAmount", { setValueAs: emptyToNull })}
						disabled={isPending}
					/>
					<FieldError errors={[errors.maxAmount]} />
				</Field>
			</div>

			<Controller
				name="bankAccountId"
				control={control}
				render={({ field }) => (
					<Field data-invalid={!!errors.bankAccountId}>
						<Label>الحساب البنكي (اختياري)</Label>
						<Select
							value={field.value ?? ANY_BANK_ACCOUNT}
							onValueChange={(value) =>
								field.onChange(value === ANY_BANK_ACCOUNT ? null : value)
							}
							dir="rtl"
							disabled={isPending}
						>
							<SelectTrigger aria-invalid={!!errors.bankAccountId}>
								<SelectValue placeholder="كل الحسابات البنكية" />
							</SelectTrigger>
							<SelectContent dir="rtl">
								<SelectItem value={ANY_BANK_ACCOUNT}>كل الحسابات البنكية</SelectItem>
								{companyAccounts.map((account) => (
									<SelectItem
										key={account.id}
										value={account.id}
									>
										{account.bank.bankName} — {account.accountName}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<FieldError errors={[errors.bankAccountId]} />
					</Field>
				)}
			/>

			<Controller
				name="contraAccountId"
				control={control}
				render={({ field }) => (
					<Field data-invalid={!!errors.contraAccountId}>
						<Label>
							الحساب المقابل <span className="text-rose-500">*</span>
						</Label>
						<Select
							value={field.value || ""}
							onValueChange={field.onChange}
							dir="rtl"
							disabled={isPending}
						>
							<SelectTrigger aria-invalid={!!errors.contraAccountId}>
								<SelectValue placeholder="اختر حسابًا ورقيًا فعّالًا..." />
							</SelectTrigger>
							<SelectContent dir="rtl">
								{contraLeaves.map((account) => (
									<SelectItem
										key={account.id}
										value={account.id}
									>
										{account.accountName}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<FieldError errors={[errors.contraAccountId]} />
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
						<Label>معطّلة (تُتجاهل أثناء التشغيل)</Label>
						<Switch
							checked={field.value ?? false}
							onCheckedChange={field.onChange}
							disabled={isPending}
						/>
					</Field>
				)}
			/>
		</AccountingFormSheet>
	);
};
