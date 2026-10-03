import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { DateField } from "@/components/common/date-field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxTrigger,
	ComboboxValue,
} from "@/components/ui/combobox";
import { Field } from "@/components/ui/field";
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
import { useCostCenters } from "@/features/accounting/cost-centers/hooks/use-cost-centers";
import {
	type SubscriptionPlanInput,
	useCreateSubscription,
} from "@/features/accounting/extended/hooks/use-extended";
import { useParties } from "@/features/accounting/parties/hooks/use-parties";
import {
	fromNano,
	sumAmountStrings,
	toNano,
} from "@/features/accounting/utils/amount-strings";
import { formatAmount } from "@/features/accounting/utils/format-amount";

/**
 * [P12.15] Create a subscription (FR-17.2).
 *
 * WHY THIS EXISTS AT ALL: the owner's UI pass could not verify that the billing run is
 * idempotent, not because the run failed but because no subscription could be created — an
 * empty list proves nothing about a job that has nothing to do. This sheet is what makes that
 * check runnable: create one, press «توليد الفواتير المستحقّة» twice, and the second press
 * must generate nothing.
 *
 * THE START DATE IS THE ANCHOR, and the description says so, because it is the field
 * operators get wrong. Periods are derived from it by index — never from the previous period
 * and never from today — so a start of 31 January bills 28 February and then 31 March rather
 * than drifting to the 28th for ever. Backdating it deliberately generates the periods that
 * were missed, which is a feature, not an accident to be discovered after the fact.
 *
 * PLANS CARRY THEIR OWN INCOME ACCOUNT AND COST CENTER. Both are required by the server —
 * a generated invoice has to know where its revenue lands — so the sheet asks for them per
 * line rather than guessing a default that would put every subscription's revenue in the same
 * bucket.
 */

const AMOUNT_PATTERN = /^\d+(\.\d{1,9})?$/;

const INTERVALS = [
	{ value: "MONTH", label: "شهري" },
	{ value: "WEEK", label: "أسبوعي" },
	{ value: "DAY", label: "يومي" },
	{ value: "YEAR", label: "سنوي" },
] as const;

type Interval = (typeof INTERVALS)[number]["value"];

const EMPTY_PLAN: SubscriptionPlanInput = {
	itemName: "",
	qty: "1",
	rate: "",
	incomeAccountId: "",
	costCenterId: "",
};

const today = () => new Date().toISOString().slice(0, 10);

const lineTotal = (plan: SubscriptionPlanInput): string => {
	if (!AMOUNT_PATTERN.test(plan.qty.trim()) || !AMOUNT_PATTERN.test(plan.rate.trim())) {
		return "0";
	}
	// C2: الكمّية × السعر بوحدات النانو — الضرب العشري يزيغ عند الكسور
	const product = (toNano(plan.qty.trim()) * toNano(plan.rate.trim())) / 1_000_000_000n;
	return fromNano(product);
};

export const SubscriptionSheet = ({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) => {
	const { parties } = useParties();
	const { accounts } = useAccounts();
	const { costCenters } = useCostCenters();
	const { createSubscription, isPending } = useCreateSubscription();

	const [partyId, setPartyId] = useState("");
	const [interval, setInterval] = useState<Interval>("MONTH");
	const [intervalCount, setIntervalCount] = useState("1");
	const [startDate, setStartDate] = useState(today);
	const [endDate, setEndDate] = useState("");
	const [atPeriodStart, setAtPeriodStart] = useState(true);
	const [submitGenerated, setSubmitGenerated] = useState(false);
	const [daysUntilDue, setDaysUntilDue] = useState("0");
	const [plans, setPlans] = useState<SubscriptionPlanInput[]>([EMPTY_PLAN]);

	const customers = parties.filter((party) => party.partyType === "Owner");
	const income = accounts.filter(
		(a) => !a.isGroup && !a.freezeAccount && !a.disabled && a.rootType === "INCOME",
	);
	const postableCenters = costCenters.filter((c) => !c.isGroup && !c.disabled);

	useEffect(() => {
		if (!open) return;
		setPartyId("");
		setInterval("MONTH");
		setIntervalCount("1");
		setStartDate(today());
		setEndDate("");
		setAtPeriodStart(true);
		setSubmitGenerated(false);
		setDaysUntilDue("0");
		setPlans([EMPTY_PLAN]);
	}, [open]);

	const patch = (index: number, next: Partial<SubscriptionPlanInput>) =>
		setPlans((prev) => prev.map((plan, i) => (i === index ? { ...plan, ...next } : plan)));

	const planInvalid = (plan: SubscriptionPlanInput) =>
		plan.itemName.trim() === "" ||
		!AMOUNT_PATTERN.test(plan.qty.trim()) ||
		!AMOUNT_PATTERN.test(plan.rate.trim()) ||
		plan.incomeAccountId === "" ||
		plan.costCenterId === "";

	const countInvalid = !/^\d+$/.test(intervalCount.trim()) || Number(intervalCount) < 1;
	const daysInvalid = !/^\d+$/.test(daysUntilDue.trim());
	const blocked =
		!partyId || !startDate || countInvalid || daysInvalid || plans.some(planInvalid);

	const periodTotal = sumAmountStrings(plans.map(lineTotal));

	const accountLabel = (id: string) => {
		const account = accounts.find((a) => a.id === id);
		if (!account) return id;
		return account.accountNumber
			? `${account.accountName} (${account.accountNumber})`
			: account.accountName;
	};

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (blocked) return;
		createSubscription({
			partyType: "Owner",
			partyId,
			interval,
			intervalCount: Number(intervalCount),
			startDate,
			endDate: endDate || null,
			generateInvoiceAtPeriodStart: atPeriodStart,
			submitGeneratedInvoice: submitGenerated,
			daysUntilDue: Number(daysUntilDue),
			plans: plans.map((plan) => ({
				itemName: plan.itemName.trim(),
				qty: plan.qty.trim(),
				rate: plan.rate.trim(),
				incomeAccountId: plan.incomeAccountId,
				costCenterId: plan.costCenterId,
			})),
		});
		onOpenChange(false);
	};

	return (
		<AccountingFormSheet
			open={open}
			onOpenChange={onOpenChange}
			title="اشتراك جديد"
			description="يربط عميلًا بخطط تتكرّر فوترتها. الفترات تُشتقّ من تاريخ البدء بالفهرس — تشغيل متأخّر يُعوّض ما فات، وتشغيل مكرَّر لا يُولّد شيئًا."
			onSubmit={onSubmit}
			isSaving={isPending}
			submitLabel="إنشاء"
			submitDisabled={blocked}
			wide
		>
			<Field>
				<Label>
					العميل <span className="text-rose-500">*</span>
				</Label>
				<Combobox
					value={partyId}
					onValueChange={(value) => setPartyId(typeof value === "string" ? value : "")}
				>
					<ComboboxTrigger
						className="flex h-9 w-full items-center justify-between rounded-[4px] border border-input bg-transparent px-3 py-1.5 text-sm"
						aria-disabled={isPending}
					>
						<ComboboxValue
							placeholder="اختر العميل…"
							className="truncate"
						>
							{partyId
								? (customers.find((p) => p.partyId === partyId)?.name ?? partyId)
								: undefined}
						</ComboboxValue>
					</ComboboxTrigger>
					<ComboboxContent dir="rtl">
						<ComboboxList>
							{customers.length === 0 ? (
								<ComboboxEmpty>لا عملاء مسجّلون في الأطراف</ComboboxEmpty>
							) : (
								customers.map((party) => (
									<ComboboxItem
										key={party.partyId}
										value={party.partyId}
									>
										<span className="truncate">{party.name}</span>
									</ComboboxItem>
								))
							)}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
			</Field>

			<div className="grid grid-cols-2 gap-3">
				<Field>
					<Label>الدورة</Label>
					<Select
						value={interval}
						onValueChange={(value) => setInterval(value as Interval)}
						disabled={isPending}
					>
						<SelectTrigger className="w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent dir="rtl">
							{INTERVALS.map((entry) => (
								<SelectItem
									key={entry.value}
									value={entry.value}
								>
									{entry.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</Field>
				<Field data-invalid={countInvalid}>
					<Label>كل كم دورة</Label>
					<Input
						dir="ltr"
						inputMode="numeric"
						className="text-end tabular-nums"
						value={intervalCount}
						onChange={(event) => setIntervalCount(event.target.value)}
						aria-invalid={countInvalid}
						disabled={isPending}
					/>
				</Field>
			</div>

			<div className="grid grid-cols-2 gap-3">
				<Field>
					<Label>
						تاريخ البدء <span className="text-rose-500">*</span>
					</Label>
					<DateField
						value={startDate}
						onChange={setStartDate}
						placeholder="اختر التاريخ..."
						triggerDisabled={isPending}
					/>
				</Field>
				<Field>
					<Label>تاريخ الانتهاء</Label>
					<DateField
						value={endDate}
						onChange={setEndDate}
						placeholder="اختياري"
						triggerDisabled={isPending}
					/>
				</Field>
			</div>
			<p className="-mt-2 text-muted-foreground text-xs">
				تاريخ البدء هو المرساة: كل فترة تُحسب منه لا من سابقتها، فاشتراكٌ يبدأ 31 يناير يفوتر 28
				فبراير ثم 31 مارس. تاريخ بدء في الماضي يولّد الفترات الفائتة عند أول تشغيل — وهذا مقصود.
			</p>

			<div className="grid grid-cols-2 gap-3">
				<Field>
					<Label className="font-normal">
						<Checkbox
							checked={atPeriodStart}
							onCheckedChange={(next) => setAtPeriodStart(next === true)}
							disabled={isPending}
						/>
						الفوترة في بداية الفترة
					</Label>
					<p className="text-muted-foreground text-xs">
						مُفعّلة = دفع مقدّم؛ مُطفأة = تُفوتر الفترة بعد انتهائها.
					</p>
				</Field>
				<Field data-invalid={daysInvalid}>
					<Label>أيام حتى الاستحقاق</Label>
					<Input
						dir="ltr"
						inputMode="numeric"
						className="text-end tabular-nums"
						value={daysUntilDue}
						onChange={(event) => setDaysUntilDue(event.target.value)}
						aria-invalid={daysInvalid}
						disabled={isPending}
					/>
				</Field>
			</div>

			<Field>
				<Label className="font-normal">
					<Checkbox
						checked={submitGenerated}
						onCheckedChange={(next) => setSubmitGenerated(next === true)}
						disabled={isPending}
					/>
					اعتماد الفواتير المولَّدة تلقائيًا
				</Label>
				<p className="text-muted-foreground text-xs">
					مُطفأة (الافتراضي) = الفواتير تبقى مسودّات تُراجَع قبل الاعتماد. مُفعّلة = تُرحَّل إلى الدفتر
					فور توليدها بلا مراجعة بشرية.
				</p>
			</Field>

			<Field>
				<Label>
					الخطط <span className="text-rose-500">*</span>
				</Label>
				<div className="space-y-2">
					{plans.map((plan, index) => (
						<div
							key={index}
							className="space-y-2 rounded-[4px] border p-2"
						>
							<div className="flex items-center gap-2">
								<Input
									placeholder="اسم البند"
									className="h-8 flex-1 text-xs"
									value={plan.itemName}
									onChange={(event) => patch(index, { itemName: event.target.value })}
									aria-invalid={plan.itemName.trim() === ""}
									disabled={isPending}
								/>
								<Input
									dir="ltr"
									inputMode="decimal"
									placeholder="الكمّية"
									className="h-8 w-20 text-end text-xs tabular-nums"
									value={plan.qty}
									onChange={(event) => patch(index, { qty: event.target.value })}
									aria-invalid={!AMOUNT_PATTERN.test(plan.qty.trim())}
									disabled={isPending}
								/>
								<Input
									dir="ltr"
									inputMode="decimal"
									placeholder="السعر"
									className="h-8 w-24 text-end text-xs tabular-nums"
									value={plan.rate}
									onChange={(event) => patch(index, { rate: event.target.value })}
									aria-invalid={!AMOUNT_PATTERN.test(plan.rate.trim())}
									disabled={isPending}
								/>
								<span className="w-24 text-end text-xs tabular-nums">
									{formatAmount(lineTotal(plan))}
								</span>
								<Button
									type="button"
									size="icon-xs"
									variant="ghost"
									disabled={isPending || plans.length === 1}
									onClick={() => setPlans((prev) => prev.filter((_, i) => i !== index))}
								>
									<IconTrash className="size-3.5" />
								</Button>
							</div>
							<div className="flex items-center gap-2">
								<Combobox
									value={plan.incomeAccountId}
									onValueChange={(value) =>
										patch(index, {
											incomeAccountId: typeof value === "string" ? value : "",
										})
									}
								>
									<ComboboxTrigger
										className="flex h-8 flex-1 items-center justify-between rounded-[4px] border border-input bg-transparent px-2.5 text-xs"
										aria-disabled={isPending}
									>
										<ComboboxValue
											placeholder="حساب الإيراد *"
											className="truncate"
										>
											{plan.incomeAccountId ? accountLabel(plan.incomeAccountId) : undefined}
										</ComboboxValue>
									</ComboboxTrigger>
									<ComboboxContent dir="rtl">
										<ComboboxList>
											{income.length === 0 ? (
												<ComboboxEmpty>لا حسابات دخل قابلة للترحيل</ComboboxEmpty>
											) : (
												income.map((account) => (
													<ComboboxItem
														key={account.id}
														value={account.id}
													>
														<span className="truncate">{accountLabel(account.id)}</span>
													</ComboboxItem>
												))
											)}
										</ComboboxList>
									</ComboboxContent>
								</Combobox>
								<Combobox
									value={plan.costCenterId}
									onValueChange={(value) =>
										patch(index, { costCenterId: typeof value === "string" ? value : "" })
									}
								>
									<ComboboxTrigger
										className="flex h-8 flex-1 items-center justify-between rounded-[4px] border border-input bg-transparent px-2.5 text-xs"
										aria-disabled={isPending}
									>
										<ComboboxValue
											placeholder="مركز التكلفة *"
											className="truncate"
										>
											{postableCenters.find((c) => c.id === plan.costCenterId)
												?.costCenterName ?? undefined}
										</ComboboxValue>
									</ComboboxTrigger>
									<ComboboxContent dir="rtl">
										<ComboboxList>
											{postableCenters.length === 0 ? (
												<ComboboxEmpty>لا مراكز تكلفة قابلة للترحيل</ComboboxEmpty>
											) : (
												postableCenters.map((center) => (
													<ComboboxItem
														key={center.id}
														value={center.id}
													>
														<span className="truncate">{center.costCenterName}</span>
													</ComboboxItem>
												))
											)}
										</ComboboxList>
									</ComboboxContent>
								</Combobox>
							</div>
						</div>
					))}
				</div>
				<div className="flex items-center gap-2">
					<Button
						type="button"
						size="xs"
						variant="outline"
						disabled={isPending}
						onClick={() => setPlans((prev) => [...prev, EMPTY_PLAN])}
					>
						<IconPlus className="size-3.5" />
						خطّة
					</Button>
					<span className="ms-auto text-xs">
						إجمالي الفترة{" "}
						<span className="font-medium tabular-nums">{formatAmount(periodTotal)}</span>
					</span>
				</div>
			</Field>
		</AccountingFormSheet>
	);
};
