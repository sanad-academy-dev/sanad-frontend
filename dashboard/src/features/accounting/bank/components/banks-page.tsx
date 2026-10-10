import {
	IconBuildingBank,
	IconCircleCheck,
	IconCircleOff,
	IconPencil,
	IconPlus,
	IconTrash,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { Stats } from "@/components/common/stats";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { BankAccountSheet } from "@/features/accounting/bank/components/bank-account-sheet";
import { BankSheet } from "@/features/accounting/bank/components/bank-sheet";
import { useBankAccounts } from "@/features/accounting/bank/hooks/use-bank-reconciliation";
import { useBankActions, useBanks } from "@/features/accounting/bank/hooks/use-banks";
import { AccountingConfirmDialog } from "@/features/accounting/components/accounting-confirm-dialog";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import type { BankAccountResponse, BankResponse } from "@/server/accounting/bank/bank.type";

/**
 * [P11.1] «البنوك والحسابات البنكية» masters (BRD §14) — the two §14 masters on one screen:
 * the banks list on top, the bank accounts under it. A COMPANY account shows its GL-leaf
 * link (the reconciliation anchor everything in P11.2–P11.4 hangs off).
 */
export const BanksPage = () => {
	const { banks, isLoading: banksLoading } = useBanks();
	const { bankAccounts, isLoading: accountsLoading } = useBankAccounts();
	const { setBankDisabled, removeBank } = useBankActions();

	const [search, setSearch] = useState("");
	const [bankSheetOpen, setBankSheetOpen] = useState(false);
	const [editingBank, setEditingBank] = useState<BankResponse | null>(null);
	const [togglingBank, setTogglingBank] = useState<BankResponse | null>(null);
	const [deletingBank, setDeletingBank] = useState<BankResponse | null>(null);
	const [accountSheetOpen, setAccountSheetOpen] = useState(false);
	const [editingAccount, setEditingAccount] = useState<BankAccountResponse | null>(null);

	const stats = useMemo<StatItem[]>(
		() => [
			{
				title: "البنوك",
				value: banks.length,
				tooltip: "عدد البنوك المعرّفة.",
			},
			{
				title: "الحسابات البنكية",
				value: bankAccounts.length,
				tooltip: "العدد الكلي للحسابات البنكية.",
			},
			{
				title: "حسابات الشركة",
				value: bankAccounts.filter((account) => account.isCompanyAccount).length,
				tooltip: "حسابات الشركة المرتبطة بدفتر الأستاذ — مرساة التسوية البنكية.",
			},
			{
				title: "معطّلة",
				value:
					banks.filter((bank) => bank.disabled).length +
					bankAccounts.filter((account) => account.disabled).length,
				tooltip: "بنوك وحسابات معطّلة لا تظهر في شاشات التسوية.",
			},
		],
		[banks, bankAccounts],
	);

	const query = search.trim().toLowerCase();
	const visibleBanks = useMemo(() => {
		if (!query) return banks;
		return banks.filter((bank) => bank.bankName.toLowerCase().includes(query));
	}, [query, banks]);
	const visibleAccounts = useMemo(() => {
		if (!query) return bankAccounts;
		return bankAccounts.filter(
			(account) =>
				account.accountName.toLowerCase().includes(query) ||
				account.bank.bankName.toLowerCase().includes(query) ||
				(account.iban ?? "").toLowerCase().includes(query) ||
				(account.bankAccountNo ?? "").toLowerCase().includes(query),
		);
	}, [query, bankAccounts]);

	const openCreateBank = () => {
		setEditingBank(null);
		setBankSheetOpen(true);
	};
	const openEditBank = (bank: BankResponse) => {
		setEditingBank(bank);
		setBankSheetOpen(true);
	};
	const openCreateAccount = () => {
		setEditingAccount(null);
		setAccountSheetOpen(true);
	};
	const openEditAccount = (account: BankAccountResponse) => {
		setEditingAccount(account);
		setAccountSheetOpen(true);
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<div className="px-4 pt-3">
				<h1 className="font-medium text-lg">البنوك والحسابات البنكية</h1>
				<p className="text-muted-foreground text-sm">
					§14 — البنوك وحساباتها؛ حساب الشركة يرتبط بحساب دفتر أستاذ من نوع «بنك» وهو مرساة
					التسوية والمقاصة.
				</p>
			</div>

			<Stats
				className="px-4 grid-cols-4"
				stats={stats}
			/>

			<TableToolbar
				className="border-t"
				searchPlaceholder="ابحث باسم البنك أو الحساب أو IBAN..."
				searchValue={search}
				onSearchChange={setSearch}
				buttonSize="xs"
				showExport={false}
				actions={
					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={openCreateAccount}
							disabled={banks.length === 0}
						>
							<IconPlus className="size-4" /> حساب بنكي جديد
						</Button>
						<Button
							type="button"
							size="sm"
							onClick={openCreateBank}
						>
							<IconPlus className="size-4" /> بنك جديد
						</Button>
					</div>
				}
			/>

			<div className="min-h-0 flex-1 overflow-auto border-t">
				{/* banks list */}
				<p className="px-3 pt-2 font-semibold text-muted-foreground text-xs">البنوك</p>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>اسم البنك</TableHead>
							<TableHead>SWIFT</TableHead>
							<TableHead>الموقع</TableHead>
							<TableHead className="text-end">عدد الحسابات</TableHead>
							<TableHead>الحالة</TableHead>
							<TableHead className="w-28" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{visibleBanks.map((bank) => {
							const accountCount = bankAccounts.filter(
								(account) => account.bankId === bank.id,
							).length;
							return (
								<TableRow key={bank.id}>
									<TableCell className="font-medium">{bank.bankName}</TableCell>
									<TableCell dir="ltr">{bank.swiftNumber ?? "—"}</TableCell>
									<TableCell
										dir="ltr"
										className="max-w-48 truncate"
									>
										{bank.website ?? "—"}
									</TableCell>
									<TableCell
										className="text-end tabular-nums"
										dir="ltr"
									>
										{accountCount}
									</TableCell>
									<TableCell>
										{bank.disabled ? (
											<Badge variant="destructive">معطّل</Badge>
										) : (
											<Badge variant="outline">مُفعّل</Badge>
										)}
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-1">
											<Button
												variant="ghost"
												size="icon-xs"
												aria-label="تعديل"
												onClick={() => openEditBank(bank)}
											>
												<IconPencil className="size-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon-xs"
												aria-label={bank.disabled ? "تفعيل" : "تعطيل"}
												onClick={() => setTogglingBank(bank)}
											>
												{bank.disabled ? (
													<IconCircleCheck className="size-4" />
												) : (
													<IconCircleOff className="size-4" />
												)}
											</Button>
											<Button
												variant="ghost"
												size="icon-xs"
												aria-label="حذف"
												onClick={() => setDeletingBank(bank)}
											>
												<IconTrash className="size-4" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							);
						})}
						{visibleBanks.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={6}
									className="py-8 text-center text-muted-foreground"
								>
									{banksLoading ? "جارٍ التحميل..." : search ? "لا نتائج" : "لا توجد بنوك بعد."}
								</TableCell>
							</TableRow>
						) : null}
					</TableBody>
				</Table>

				{/* bank accounts list */}
				<p className="border-t px-3 pt-2 font-semibold text-muted-foreground text-xs">
					الحسابات البنكية
				</p>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>اسم الحساب</TableHead>
							<TableHead>البنك</TableHead>
							<TableHead>النوع</TableHead>
							<TableHead>حساب دفتر الأستاذ</TableHead>
							<TableHead>IBAN / رقم الحساب</TableHead>
							<TableHead>الحالة</TableHead>
							<TableHead className="w-16" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{visibleAccounts.map((account) => (
							<TableRow key={account.id}>
								<TableCell className="font-medium">{account.accountName}</TableCell>
								<TableCell>{account.bank.bankName}</TableCell>
								<TableCell>
									{account.isCompanyAccount ? (
										<Badge variant="primary">حساب شركة</Badge>
									) : (
										<Badge variant="secondary">حساب طرف</Badge>
									)}
								</TableCell>
								<TableCell>{account.glAccount?.accountName ?? "—"}</TableCell>
								<TableCell dir="ltr">{account.iban ?? account.bankAccountNo ?? "—"}</TableCell>
								<TableCell>
									{account.disabled ? (
										<Badge variant="destructive">معطّل</Badge>
									) : (
										<Badge variant="outline">مُفعّل</Badge>
									)}
								</TableCell>
								<TableCell>
									<Button
										variant="ghost"
										size="icon-xs"
										aria-label="تعديل"
										onClick={() => openEditAccount(account)}
									>
										<IconPencil className="size-4" />
									</Button>
								</TableCell>
							</TableRow>
						))}
						{visibleAccounts.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={7}
									className="py-8 text-center text-muted-foreground"
								>
									{accountsLoading ? (
										"جارٍ التحميل..."
									) : search ? (
										"لا نتائج"
									) : (
										<span className="inline-flex items-center gap-2">
											<IconBuildingBank className="size-4" />
											لا حسابات بنكية بعد.
										</span>
									)}
								</TableCell>
							</TableRow>
						) : null}
					</TableBody>
				</Table>
			</div>

			<BankSheet
				open={bankSheetOpen}
				onOpenChange={setBankSheetOpen}
				editing={editingBank}
			/>
			<BankAccountSheet
				open={accountSheetOpen}
				onOpenChange={setAccountSheetOpen}
				editing={editingAccount}
			/>

			<AccountingConfirmDialog
				open={!!togglingBank}
				onOpenChange={(open) => {
					if (!open) setTogglingBank(null);
				}}
				title={togglingBank?.disabled ? "تفعيل البنك" : "تعطيل البنك"}
				description={
					togglingBank?.disabled
						? `سيُعاد تفعيل «${togglingBank?.bankName ?? ""}».`
						: `سيُعطَّل «${togglingBank?.bankName ?? ""}» — يبقى محفوظًا ولا يظهر في شاشات التسوية.`
				}
				confirmLabel={togglingBank?.disabled ? "تفعيل" : "تعطيل"}
				onConfirm={() => {
					if (togglingBank) setBankDisabled(togglingBank.id, !togglingBank.disabled);
					setTogglingBank(null);
				}}
			/>
			<AccountingConfirmDialog
				open={!!deletingBank}
				onOpenChange={(open) => {
					if (!open) setDeletingBank(null);
				}}
				title="حذف البنك"
				description={`سيتم حذف «${deletingBank?.bankName ?? ""}» نهائيًا — الحذف ممنوع لبنك له حسابات.`}
				onConfirm={() => {
					if (deletingBank) removeBank(deletingBank.id);
					setDeletingBank(null);
				}}
			/>
		</div>
	);
};
