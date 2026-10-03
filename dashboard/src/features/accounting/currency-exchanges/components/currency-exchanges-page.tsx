import { IconCurrencyDollar, IconDownload, IconPlus, IconTrash } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { Stats } from "@/components/common/stats";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AccountingConfirmDialog } from "@/features/accounting/components/accounting-confirm-dialog";
import { CurrencyExchangeSheet } from "@/features/accounting/currency-exchanges/components/currency-exchange-sheet";
import {
	useCurrencyExchangeActions,
	useCurrencyExchanges,
} from "@/features/accounting/currency-exchanges/hooks/use-currency-exchanges";
import { downloadCsv, isoDay } from "@/features/accounting/utils/export-csv";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import type { CurrencyExchangeResponse } from "@/server/accounting/currency-exchange/currency-exchange.type";

/**
 * [P1.8] Manual Currency Exchange table (BRD §4.7), standard list-screen anatomy: Stats →
 * TableToolbar → list body → standard side Sheet for add → confirm dialog for delete.
 * Rates are immutable, so correcting one is delete + re-add.
 */
export const CurrencyExchangesPage = () => {
	const { rates, isLoading } = useCurrencyExchanges();
	const { remove } = useCurrencyExchangeActions();

	const [search, setSearch] = useState("");
	const [sheetOpen, setSheetOpen] = useState(false);
	const [deleting, setDeleting] = useState<CurrencyExchangeResponse | null>(null);

	const stats = useMemo<StatItem[]>(() => {
		const pairs = new Set(rates.map((r) => `${r.fromCurrencyCode}→${r.toCurrencyCode}`));
		const latest = rates.reduce<string | null>((acc, r) => {
			const d = isoDay(r.date.toString());
			return !acc || d > acc ? d : acc;
		}, null);
		return [
			{
				title: "إجمالي الأسعار",
				value: rates.length,
				tooltip: "عدد أسعار الصرف اليدوية المخزّنة.",
			},
			{
				title: "أزواج مغطاة",
				value: pairs.size,
				tooltip: "عدد أزواج العملات التي يوجد لها سعر واحد على الأقل.",
			},
			{
				title: "أحدث تحديث",
				value: 0,
				valueLabel: latest ?? "—",
				tooltip: "تاريخ أحدث سعر صرف مُدخل.",
			},
		];
	}, [rates]);

	const visible = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return rates;
		return rates.filter((r) =>
			`${r.fromCurrencyCode} ${r.toCurrencyCode}`.toLowerCase().includes(q),
		);
	}, [search, rates]);

	const exportCsv = () =>
		downloadCsv(
			"currency-exchanges",
			["التاريخ", "من", "إلى", "السعر", "للشراء", "للبيع"],
			visible.map((r) => [
				isoDay(r.date.toString()),
				r.fromCurrencyCode,
				r.toCurrencyCode,
				r.exchangeRate.toString(),
				r.forBuying ? "نعم" : "لا",
				r.forSelling ? "نعم" : "لا",
			]),
		);

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<div className="px-4 pt-3">
				<h1 className="font-medium text-lg">أسعار الصرف</h1>
				<p className="text-muted-foreground text-sm">
					الأسعار اليدوية المؤرّخة التي تعتمدها المستندات ({rates.length}).
				</p>
			</div>

			<Stats
				className="px-4 grid-cols-3"
				stats={stats}
			/>

			<TableToolbar
				className="border-t"
				searchPlaceholder="ابحث برمز العملة..."
				searchValue={search}
				onSearchChange={setSearch}
				buttonSize="xs"
				showExport={false}
				leftExtra={
					<Button
						type="button"
						variant="outline"
						size="xs"
						onClick={exportCsv}
						disabled={visible.length === 0}
						className="gap-1.5 px-2"
					>
						<IconDownload className="size-3.5" />
						تصدير
					</Button>
				}
				actions={
					<Button
						size="sm"
						onClick={() => setSheetOpen(true)}
					>
						<IconPlus className="size-4" /> سعر صرف جديد
					</Button>
				}
			/>

			<div className="min-h-0 flex-1 overflow-auto border-t">
				{!isLoading && visible.length === 0 ? (
					<div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-muted-foreground text-sm">
						<IconCurrencyDollar className="size-6" />
						{search ? "لا نتائج" : "لا توجد أسعار صرف يدوية بعد."}
					</div>
				) : (
					visible.map((r) => (
						<div
							key={r.id}
							className="flex items-center gap-3 border-b px-3 py-2"
						>
							<span
								className="w-24 shrink-0 text-muted-foreground text-xs tabular-nums"
								dir="ltr"
							>
								{new Date(r.date).toISOString().slice(0, 10)}
							</span>
							<span
								className="w-28 shrink-0 font-medium text-sm"
								dir="ltr"
							>
								{r.fromCurrencyCode} → {r.toCurrencyCode}
							</span>
							<span
								className="flex-1 text-sm tabular-nums"
								dir="ltr"
							>
								{r.exchangeRate.toString()}
							</span>
							{r.forBuying && <Badge variant="outline">شراء</Badge>}
							{r.forSelling && <Badge variant="outline">بيع</Badge>}
							<Button
								variant="ghost"
								size="icon-xs"
								aria-label="حذف"
								onClick={() => setDeleting(r)}
							>
								<IconTrash className="size-4" />
							</Button>
						</div>
					))
				)}
			</div>

			<CurrencyExchangeSheet
				open={sheetOpen}
				onOpenChange={setSheetOpen}
			/>

			<AccountingConfirmDialog
				open={!!deleting}
				onOpenChange={(o) => {
					if (!o) setDeleting(null);
				}}
				title="حذف سعر الصرف"
				description={
					deleting
						? `سيتم حذف سعر ${deleting.fromCurrencyCode} → ${deleting.toCurrencyCode} بتاريخ ${isoDay(deleting.date.toString())} نهائيًا.`
						: ""
				}
				onConfirm={() => {
					if (deleting) remove(deleting.id);
					setDeleting(null);
				}}
			/>
		</div>
	);
};
