import { useState } from "react";

import { DateField } from "@/components/common/date-field";
import { Badge } from "@/components/ui/badge";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useAccounts } from "@/features/accounting/chart-of-accounts/hooks/use-chart-of-accounts";
import { AccountingConfirmDialog } from "@/features/accounting/components/accounting-confirm-dialog";
import {
	type AdapterListRow,
	useAdapterActions,
	useAdapters,
} from "@/features/accounting/governance/hooks/use-adapters";
import {
	useAccountsSettings,
	useUpdateAccountsSettings,
} from "@/features/accounting/settings/hooks/use-accounts-settings";
import { formatDisplayDate } from "@/features/accounting/utils/format-amount";
import type { AdapterRunResult } from "@/server/accounting/adapters/adapter.type";

/**
 * [P12A.2e] Tab «المحولات» — §C3 run-control: the source-module adapters (three since
 * [P12B.4]; the list is derived from the registry, so a fourth needs no change here) with their
 * kill-switch flags (default OFF; OFF freezes ledger posting without touching operations),
 * a date-ranged manual run (posts REAL GLEs — hence the confirm dialog), and the
 * `adapter_vat_account_id` leg. Flags and the VAT account live in accounts-settings and are
 * read/written through the existing §19 settings hooks — no adapter-local settings client.
 */

/** Combobox items can't carry an empty value — sentinel row maps back to "" on change. */
const NONE = "__none__";

/**
 * [P12B.5] رجل حساب واحدة في إعدادات المحولات. كانت الكتلة مكتوبة بالكامل للضريبة، فلمّا
 * لزم رجلان أخريان صار النسخ ثلاث مرّات هو الخيار السيّئ الواضح.
 */
function AccountLegPicker({
	title,
	hint,
	value,
	onChange,
	accounts,
	accountLabel,
}: {
	title: string;
	hint: string;
	value: string;
	onChange: (next: string) => void;
	accounts: { id: string }[];
	accountLabel: (id: string) => string;
}) {
	return (
		<div className="flex flex-wrap items-center gap-3 rounded-md border border-border p-3">
			<div className="min-w-48">
				<p className="font-medium text-sm">{title}</p>
				<p className="text-muted-foreground text-xs">{hint}</p>
			</div>
			<div className="w-72">
				<Combobox
					value={value || NONE}
					onValueChange={(next) =>
						onChange(typeof next === "string" && next !== NONE ? next : "")
					}
				>
					<ComboboxTrigger className="flex h-9 w-full items-center justify-between rounded-[4px] border border-input bg-transparent px-3 py-2 text-sm">
						<ComboboxValue
							placeholder={title}
							className="truncate"
						>
							{value ? accountLabel(value) : "— بدون —"}
						</ComboboxValue>
					</ComboboxTrigger>
					<ComboboxContent dir="rtl">
						<ComboboxList>
							<ComboboxItem value={NONE}>— بدون —</ComboboxItem>
							{accounts.length === 0 ? (
								<ComboboxEmpty>لا حسابات قابلة للترحيل</ComboboxEmpty>
							) : (
								accounts.map((account) => (
									<ComboboxItem
										key={account.id}
										value={account.id}
									>
										{accountLabel(account.id)}
									</ComboboxItem>
								))
							)}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
			</div>
		</div>
	);
}

const yearStart = () => `${new Date().getFullYear()}-01-01`;
const yearEnd = () => `${new Date().getFullYear()}-12-31`;

export const AdaptersTab = () => {
	const { adapters, isLoading } = useAdapters();
	const { settings, isLoading: settingsLoading } = useAccountsSettings();
	const { updateSettings, isPending: settingsPending } = useUpdateAccountsSettings();
	const { accounts } = useAccounts();

	if (isLoading || settingsLoading || !settings) {
		return (
			<div className="min-h-0 flex-1 overflow-y-auto border-t p-4">
				<Skeleton className="h-48 w-full" />
			</div>
		);
	}

	// postable leaf accounts only — the assertPostableAccount mirror (company-defaults pattern)
	const postable = accounts.filter((a) => !a.isGroup && !a.freezeAccount && !a.disabled);
	const accountLabel = (id: string) => {
		const account = accounts.find((a) => a.id === id);
		if (!account) return id;
		return account.accountNumber
			? `${account.accountName} (${account.accountNumber})`
			: account.accountName;
	};

	return (
		<div className="min-h-0 flex-1 overflow-y-auto border-t p-4">
			{/* أرجل الحسابات المشتركة بين جولات المحولات. [P12B.5] أضاف رجلَي §7.2 سطر 5،
			    وثلاث نسخ من الكتلة نفسها لم تكن خيارًا — استُخرجت في مكوّن واحد. */}
			<div className="flex flex-col gap-3">
				<AccountLegPicker
					title="حساب ضريبة المحول"
					hint="الحساب الذي يستقبل ضريبة الفواتير المرحّلة — مطلوب متى حملت فاتورة ضريبة (§C3)."
					value={settings.adapter_vat_account_id}
					onChange={(next) => updateSettings({ adapter_vat_account_id: next })}
					accounts={postable}
					accountLabel={accountLabel}
				/>
				<AccountLegPicker
					title="حساب تكلفة البضاعة المباعة"
					hint="يُقيَّد مدينًا بتكلفة أصناف نقطة البيع وقت صرفها — مطلوب لمحول نقطة البيع (§7.2 سطر 5)."
					value={settings.adapter_cogs_account_id}
					onChange={(next) => updateSettings({ adapter_cogs_account_id: next })}
					accounts={postable}
					accountLabel={accountLabel}
				/>
				<AccountLegPicker
					title="حساب المخزون"
					hint="الطرف المقابل: يُقيَّد دائنًا بنفس التكلفة عند صرف أصناف نقطة البيع (§7.2 سطر 5)."
					value={settings.adapter_stock_account_id}
					onChange={(next) => updateSettings({ adapter_stock_account_id: next })}
					accounts={postable}
					accountLabel={accountLabel}
				/>
			</div>

			<div className="mt-4 flex flex-col gap-4">
				{adapters.map((adapter) => (
					<AdapterCard
						key={adapter.key}
						adapter={adapter}
						enabled={settings[adapter.flagKey]}
						onToggle={(next) => updateSettings({ [adapter.flagKey]: next })}
						togglePending={settingsPending}
					/>
				))}
				{adapters.length === 0 ? (
					<p className="py-10 text-center text-muted-foreground text-sm">لا محولات مسجّلة.</p>
				) : null}
			</div>
		</div>
	);
};

const AdapterCard = ({
	adapter,
	enabled,
	onToggle,
	togglePending,
}: {
	adapter: AdapterListRow;
	enabled: boolean;
	onToggle: (next: boolean) => void;
	togglePending: boolean;
}) => {
	const { runAdapter, isPending } = useAdapterActions();
	const [fromDate, setFromDate] = useState(yearStart());
	const [toDate, setToDate] = useState(yearEnd());
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [lastResult, setLastResult] = useState<AdapterRunResult | null>(null);

	const onConfirmRun = async () => {
		try {
			const result = await runAdapter({ key: adapter.key, fromDate, toDate });
			setLastResult(result);
		} catch {
			// toast already reported the failure; keep the range for correction
		} finally {
			setConfirmOpen(false);
		}
	};

	return (
		<div className="rounded-md border border-border p-3">
			<div className="flex flex-wrap items-center gap-3">
				<p className="font-medium text-sm">{adapter.labelAr}</p>
				{enabled ? (
					<Badge variant="secondary">عامل</Badge>
				) : (
					<Badge variant="outline">متوقف</Badge>
				)}
				<span className="text-muted-foreground text-xs">
					ترحيلات سارية: {adapter.postings}
				</span>
				<div className="ms-auto">
					<Switch
						checked={enabled}
						onCheckedChange={onToggle}
						disabled={togglePending}
						aria-label={`تفعيل ${adapter.labelAr}`}
					/>
				</div>
			</div>

			<div className="mt-3 flex flex-wrap items-center gap-2">
				<DateField
					value={fromDate}
					onChange={setFromDate}
					placeholder="من تاريخ"
				/>
				<DateField
					value={toDate}
					onChange={setToDate}
					placeholder="إلى تاريخ"
				/>
				<Button
					type="button"
					size="sm"
					disabled={!enabled || isPending || !fromDate || !toDate}
					onClick={() => setConfirmOpen(true)}
				>
					تشغيل المحول
				</Button>
				{!enabled ? (
					<span className="text-muted-foreground text-xs">
						المحول متوقف — فعِّله أولًا؛ الإيقاف يجمّد الترحيل دون المساس بالتشغيل.
					</span>
				) : null}
			</div>

			<AccountingConfirmDialog
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
				title={`تشغيل ${adapter.labelAr}`}
				description={`سيرحّل هذا التشغيل قيود دفتر أستاذ فعلية للمستندات المؤهلة من ${formatDisplayDate(fromDate)} إلى ${formatDisplayDate(toDate)}، ويعكس ترحيلات المستندات الملغاة. المتابعة؟`}
				confirmLabel="تشغيل"
				onConfirm={onConfirmRun}
				isPending={isPending}
			/>

			{lastResult ? (
				<div className="mt-3 rounded-md border p-3 text-sm">
					<p className="font-medium">
						نتيجة آخر تشغيل: {lastResult.posted.length} ترحيل · {lastResult.reversed.length}{" "}
						عكس · {lastResult.errors.length} خطأ
					</p>
					{/* [P12A-fix5] العكس يُسمّي سببه: مستند دخل حالة عاكسة، أو مستند حُذف
					    نهائيًا. الحالة الثانية كانت تترك ترحيلًا يتيمًا للأبد قبل ذلك الإصلاح.
					    [P12B.1] «ملغى» وحدها لم تعد تصف الحالة الأولى — الفاتورة المدفوعة
					    تُردّ لا تُلغى، فالنصّ يذكر الحالتين. */}
					{lastResult.reversed.length > 0 ? (
						<ul className="mt-2 space-y-1">
							{lastResult.reversed.map((row) => (
								<li
									key={row.sourceId}
									className="text-muted-foreground"
								>
									<span dir="ltr">{row.sourceCode}</span>:{" "}
									{row.reason === "source_missing"
										? "عُكس القيد — المستند المصدر محذوف"
										: "عُكس القيد — المستند المصدر ملغى أو مردود"}
								</li>
							))}
						</ul>
					) : null}
					{lastResult.errors.length > 0 ? (
						<ul className="mt-2 space-y-1">
							{lastResult.errors.map((row) => (
								<li
									key={row.sourceId}
									className="text-destructive"
								>
									<span dir="ltr">{row.sourceCode}</span>: {row.message}
								</li>
							))}
						</ul>
					) : null}
				</div>
			) : null}
		</div>
	);
};
