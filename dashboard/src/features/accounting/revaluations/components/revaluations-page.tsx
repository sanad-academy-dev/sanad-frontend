import { IconPlus, IconScale, IconSearch } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { DateField } from "@/components/common/date-field";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { AccountingConfirmDialog } from "@/features/accounting/components/accounting-confirm-dialog";
import {
	useRevaluationActions,
	useRevaluationScan,
	useRevaluations,
} from "@/features/accounting/revaluations/hooks/use-revaluations";
import { formatAmount, formatDisplayDate } from "@/features/accounting/utils/format-amount";
import type { ErrScanRow } from "@/server/accounting/exchange-rate-revaluation/exchange-rate-revaluation.service";
import type { ExchangeRateRevaluationResponse } from "@/server/accounting/exchange-rate-revaluation/exchange-rate-revaluation.type";

/**
 * [P8.4] «إعادة تقييم العملات» (FR-9.3) — placement judgment (logged): sits in الدفاتر
 * beside قيود اليومية because it is a period-end BOOK-revaluation instrument whose output
 * IS a journal entry, not daily cash work. Scan → editable rates → save → submit
 * generates the system JE. All figures come from the server scan; the screen never
 * computes a balance.
 */

// rule 5 (Arabic-first): the three docstatus labels, local to this screen
const ERR_DOCSTATUS: Record<
	string,
	{ label: string; variant: "outline" | "default" | "secondary" }
> = {
	DRAFT: { label: "مسودة", variant: "outline" },
	SUBMITTED: { label: "مُرحَّل", variant: "default" },
	CANCELLED: { label: "ملغى", variant: "secondary" },
};

function today(): string {
	return new Date().toISOString().slice(0, 10);
}

export const RevaluationsPage = () => {
	const { revaluations, isLoading } = useRevaluations();
	const actions = useRevaluationActions();
	const { scan, isScanning } = useRevaluationScan();

	const [search, setSearch] = useState("");
	const [sheetOpen, setSheetOpen] = useState(false);
	const [scanDate, setScanDate] = useState(today());
	const [rows, setRows] = useState<ErrScanRow[]>([]);
	const [scanned, setScanned] = useState(false);
	const [cancelling, setCancelling] = useState<ExchangeRateRevaluationResponse | null>(null);
	const [deleting, setDeleting] = useState<ExchangeRateRevaluationResponse | null>(null);

	const visible = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return revaluations;
		return revaluations.filter((row) => (row.documentNo ?? "").toLowerCase().includes(q));
	}, [revaluations, search]);

	const runScan = async () => {
		const result = await scan(scanDate);
		setRows(result);
		setScanned(true);
	};

	const save = () => {
		actions.create({
			postingDate: scanDate,
			roundingLossAllowance: "0.05",
			rows: rows.map((row) => ({
				accountId: row.accountId,
				accountCurrencyCode: row.accountCurrencyCode,
				partyType: row.partyType,
				partyId: row.partyId,
				balanceInAccountCurrency: row.balanceInAccountCurrency,
				bookedBase: row.bookedBase,
				currentExchangeRate: row.currentExchangeRate,
			})),
		});
		setSheetOpen(false);
		setRows([]);
		setScanned(false);
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<div className="px-4 pt-3">
				<h1 className="font-medium text-lg">إعادة تقييم العملات</h1>
				<p className="text-muted-foreground text-sm">
					FR-9.3 — فروق العملة غير المحققة: افحص أرصدة الحسابات الأجنبية، عدِّل السعر، والترحيل
					يولّد قيد إعادة التقييم ({revaluations.length}).
				</p>
			</div>

			<TableToolbar
				className="border-t"
				searchPlaceholder="ابحث برقم المستند..."
				searchValue={search}
				onSearchChange={setSearch}
				buttonSize="xs"
				showFilter={false}
				showExport={false}
				actions={
					<Button
						size="sm"
						onClick={() => setSheetOpen(true)}
					>
						<IconPlus className="size-4" /> إعادة تقييم جديدة
					</Button>
				}
			/>

			<div className="min-h-0 flex-1 overflow-auto border-t">
				{isLoading ? (
					<p className="py-10 text-center text-muted-foreground text-sm">جارٍ التحميل...</p>
				) : (
					<Table className="table-fixed">
						<TableHeader>
							<TableRow>
								<TableHead className="w-40">رقم المستند</TableHead>
								<TableHead className="w-32">التاريخ</TableHead>
								<TableHead className="w-24">الصفوف</TableHead>
								<TableHead className="w-36 text-end">فرق التقييم</TableHead>
								<TableHead className="w-28">الحالة</TableHead>
								<TableHead className="w-40">إجراءات</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{visible.map((row) => (
								<TableRow key={row.id}>
									<TableCell dir="ltr">{row.documentNo ?? "—"}</TableCell>
									<TableCell dir="ltr">
										{formatDisplayDate(row.postingDate.toString())}
									</TableCell>
									<TableCell
										className="tabular-nums"
										dir="ltr"
									>
										{row.rows.length}
									</TableCell>
									<TableCell
										className="text-end tabular-nums"
										dir="ltr"
									>
										{formatAmount(row.totalGainLoss.toString())}
									</TableCell>
									<TableCell>
										<Badge variant={ERR_DOCSTATUS[row.docstatus]?.variant ?? "secondary"}>
											{ERR_DOCSTATUS[row.docstatus]?.label ?? row.docstatus}
										</Badge>
									</TableCell>
									<TableCell>
										<div className="flex gap-1.5">
											{row.docstatus === "DRAFT" ? (
												<>
													<Button
														size="xs"
														variant="outline"
														disabled={actions.isPending}
														onClick={() => actions.submit(row.id)}
													>
														ترحيل
													</Button>
													<Button
														size="xs"
														variant="ghost"
														disabled={actions.isPending}
														onClick={() => setDeleting(row)}
													>
														حذف
													</Button>
												</>
											) : null}
											{row.docstatus === "SUBMITTED" ? (
												<Button
													size="xs"
													variant="outline"
													disabled={actions.isPending}
													onClick={() => setCancelling(row)}
												>
													إلغاء
												</Button>
											) : null}
										</div>
									</TableCell>
								</TableRow>
							))}
							{visible.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={6}
										className="py-8 text-center text-muted-foreground"
									>
										لا مستندات إعادة تقييم بعد.
									</TableCell>
								</TableRow>
							) : null}
						</TableBody>
					</Table>
				)}
			</div>

			<Sheet
				open={sheetOpen}
				onOpenChange={(next) => {
					setSheetOpen(next);
					if (!next) {
						setRows([]);
						setScanned(false);
					}
				}}
			>
				<SheetContent
					dir="rtl"
					className="w-full overflow-y-auto sm:max-w-3xl"
				>
					<SheetHeader>
						<SheetTitle>إعادة تقييم عملات جديدة</SheetTitle>
						<SheetDescription>
							اختر التاريخ ثم افحص الأرصدة الأجنبية؛ عدِّل السعر لكل صف قبل الحفظ.
						</SheetDescription>
					</SheetHeader>

					<div className="flex items-end gap-2 px-4">
						<DateField
							value={scanDate}
							onChange={setScanDate}
							placeholder="تاريخ التقييم"
						/>
						<Button
							type="button"
							size="sm"
							variant="outline"
							disabled={isScanning}
							onClick={runScan}
						>
							<IconSearch className="size-4" /> افحص الأرصدة
						</Button>
					</div>

					<div className="px-4">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>الحساب</TableHead>
									<TableHead className="text-end">الرصيد (عملة)</TableHead>
									<TableHead className="text-end">الأساس المسجل</TableHead>
									<TableHead className="w-28 text-end">السعر الجديد</TableHead>
									<TableHead className="text-end">الفرق</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{rows.map((row, index) => (
									<TableRow key={`${row.accountId}-${row.partyId ?? index}`}>
										<TableCell>
											{row.accountName}
											<span
												dir="ltr"
												className="ms-1 text-muted-foreground text-xs"
											>
												({row.accountCurrencyCode})
											</span>
											{row.isZeroForeignSweep ? (
												<Badge
													variant="secondary"
													className="ms-1"
												>
													<IconScale className="size-3" /> تصفية
												</Badge>
											) : null}
										</TableCell>
										<TableCell
											className="text-end tabular-nums"
											dir="ltr"
										>
											{formatAmount(row.balanceInAccountCurrency)}
										</TableCell>
										<TableCell
											className="text-end tabular-nums"
											dir="ltr"
										>
											{formatAmount(row.bookedBase)}
										</TableCell>
										<TableCell>
											<Input
												dir="ltr"
												inputMode="decimal"
												className="h-8 text-end tabular-nums"
												value={row.currentExchangeRate}
												disabled={row.isZeroForeignSweep}
												onChange={(event) =>
													setRows((prev) =>
														prev.map((r, i) =>
															i === index
																? { ...r, currentExchangeRate: event.target.value }
																: r,
														),
													)
												}
												aria-label={`سعر ${row.accountName}`}
											/>
										</TableCell>
										<TableCell
											className="text-end tabular-nums"
											dir="ltr"
										>
											{formatAmount(row.gainLoss)}
										</TableCell>
									</TableRow>
								))}
								{rows.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={5}
											className="py-8 text-center text-muted-foreground"
										>
											{scanned
												? "لا أرصدة أجنبية لإعادة تقييمها في هذا التاريخ."
												: "افحص الأرصدة أولًا."}
										</TableCell>
									</TableRow>
								) : null}
							</TableBody>
						</Table>
					</div>

					<div className="flex justify-end gap-2 px-4 pb-4">
						<Button
							type="button"
							disabled={rows.length === 0 || actions.isPending}
							onClick={save}
						>
							حفظ المسودة
						</Button>
					</div>
				</SheetContent>
			</Sheet>

			<AccountingConfirmDialog
				open={deleting !== null}
				onOpenChange={(next) => !next && setDeleting(null)}
				title="حذف مسودة إعادة التقييم؟"
				description="المسودات لا أثر لها على الدفاتر — الحذف نهائي."
				confirmLabel="حذف"
				onConfirm={() => {
					if (deleting) actions.remove(deleting.id);
					setDeleting(null);
				}}
			/>
			<AccountingConfirmDialog
				open={cancelling !== null}
				onOpenChange={(next) => !next && setCancelling(null)}
				title={`إلغاء ${cancelling?.documentNo ?? "المستند"}؟`}
				description="الإلغاء يعكس قيد إعادة التقييم المرتبط (AR-2) — لا حذف."
				confirmLabel="إلغاء المستند"
				onConfirm={() => {
					if (cancelling) actions.cancel(cancelling.id);
					setCancelling(null);
				}}
			/>
		</div>
	);
};
