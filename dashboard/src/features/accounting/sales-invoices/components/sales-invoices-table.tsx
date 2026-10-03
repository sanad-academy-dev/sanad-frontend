import {
	IconBan,
	IconCornerUpLeft,
	IconDots,
	IconFileText,
	IconPencil,
	IconPrinter,
	IconSend,
	IconTrash,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { AccountingAmount } from "@/features/accounting/components/accounting-amount";
import { useStatusLabel } from "@/features/accounting/hooks/use-status-label";
import { salesInvoiceStatusAppearance } from "@/features/accounting/utils/accounting-status";
import {
	formatDisplayDate,
	isPositiveAmount,
} from "@/features/accounting/utils/format-amount";
import { cn } from "@/lib/utils";
import {
	DocStatus,
	type SalesInvoiceListRow,
} from "@sanad/contracts/runtime/server/accounting/sales-invoice/sales-invoice.type";

/**
 * [P5-UI-fix] The «فواتير المبيعات» list body.
 *
 * Anatomy and behavior are the twin of the legacy invoices table
 * (`features/finance/invoices/components/invoices-table.tsx`): `table-fixed` with
 * proportional column widths, a leading selection column, the same 12px semibold muted
 * header treatment, `py-2` row density with a hover wash, skeleton rows while loading, an
 * in-table empty row, and an actions column that pairs a contextual inline button with the
 * ⋯ menu.
 *
 * It differs from the reference in exactly two deliberate ways:
 *  1. Every colour and spacing value resolves from a design token — the reference's
 *     hardcoded hex (`#08090A`, `#F9F9F9`, …) is NOT copied here, per standing rule #1.
 *  2. The columns are the §7.2 accounting set (document no, posting/due date, outstanding,
 *     docstatus) rather than the operational booking set.
 *
 * Owner-approved carve-out: invoice-type screens follow this table anatomy; masters and
 * vouchers keep the CONTRACT §4.1 list recipe. Purchase Invoice (P6) reuses THIS file's
 * anatomy rather than re-deriving it.
 */

// Widths are proportions so the table keeps the reference's column rhythm at any viewport
// instead of overflowing horizontally. The selection column is fixed — it holds one 18px
// checkbox and must not compress on narrow screens.
const COLUMNS = [
	{ key: "select", label: "", width: "41px", align: "start" },
	{ key: "documentNo", label: "رقم المستند", width: "14%", align: "start" },
	{ key: "party", label: "العميل", width: "18%", align: "start" },
	{ key: "postingDate", label: "تاريخ الترحيل", width: "11%", align: "start" },
	{ key: "dueDate", label: "تاريخ الاستحقاق", width: "11%", align: "start" },
	{ key: "total", label: "الإجمالي", width: "13%", align: "end" },
	{ key: "outstanding", label: "المتبقي", width: "13%", align: "end" },
	{ key: "status", label: "الحالة", width: "12%", align: "start" },
	{ key: "actions", label: "الإجراءات", width: "8%", align: "end" },
] as const;

// Stable keys for the loading skeleton — the reference renders 6 placeholder rows
const SKELETON_ROWS = ["s1", "s2", "s3", "s4", "s5", "s6"] as const;

/** The reference's header treatment, in tokens: 12px semibold, muted. */
const HeadLabel = ({ label, align }: { label: string; align: "start" | "end" }) => (
	<span
		className={cn(
			"flex items-center gap-1.5 font-semibold text-muted-foreground text-xs",
			align === "end" && "justify-end",
		)}
	>
		{label}
	</span>
);

/**
 * A money cell: Latin numeral then the currency, always in that visual order.
 *
 * The numeral and «ر.س» are separate elements inside an explicit `dir="ltr"` flex row
 * rather than one `"1,150 ر.س"` string. A mixed-script string leaves the final position of
 * the Arabic currency run to the bidi algorithm, which resolves it differently depending on
 * what surrounds the cell — that is why the first screenshot rendered «الإجمالي» as
 * `690 ر.س` but «المتبقي» as `ر.س 690`. DOM order in an LTR flex row is not negotiable.
 */
export type SalesInvoicesTableProps = {
	invoices: SalesInvoiceListRow[];
	isLoading: boolean;
	/** true when a search/filter is narrowing the list — changes the empty copy */
	isFiltered: boolean;
	selectedIds: string[];
	onSelectionChange: (ids: string[]) => void;
	dir: "rtl" | "ltr";
	isPending: boolean;
	onEdit: (row: SalesInvoiceListRow) => void;
	onSubmit: (row: SalesInvoiceListRow) => void;
	onReturn: (row: SalesInvoiceListRow) => void;
	onAmend: (row: SalesInvoiceListRow) => void;
	onCancel: (row: SalesInvoiceListRow) => void;
	onDelete: (row: SalesInvoiceListRow) => void;
};

export const SalesInvoicesTable = ({
	invoices,
	isLoading,
	isFiltered,
	selectedIds,
	onSelectionChange,
	dir,
	isPending,
	onEdit,
	onSubmit,
	onReturn,
	onAmend,
	onCancel,
	onDelete,
}: SalesInvoicesTableProps) => {
	const statusLabel = useStatusLabel();
	const allSelected = invoices.length > 0 && selectedIds.length === invoices.length;

	const toggleAll = (checked: boolean) =>
		onSelectionChange(checked ? invoices.map((row) => row.id) : []);

	const toggleOne = (id: string, checked: boolean) =>
		onSelectionChange(
			checked ? [...selectedIds, id] : selectedIds.filter((selected) => selected !== id),
		);

	return (
		<div className="min-h-0 flex-1 overflow-auto">
			<Table className="table-fixed">
				<TableHeader>
					<TableRow className="hover:bg-transparent">
						{COLUMNS.map((column) => (
							<TableHead
								key={column.key}
								style={{ width: column.width }}
								className="h-8 px-3 py-0"
							>
								{column.key === "select" ? (
									<Checkbox
										checked={allSelected}
										onCheckedChange={(checked) => toggleAll(checked === true)}
										aria-label="تحديد كل الفواتير"
									/>
								) : (
									<HeadLabel
										label={column.label}
										align={column.align}
									/>
								)}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>

				<TableBody>
					{isLoading &&
						SKELETON_ROWS.map((rowKey) => (
							<TableRow key={rowKey}>
								{COLUMNS.map((column) => (
									<TableCell
										key={column.key}
										className="px-3 py-2.5"
									>
										<Skeleton className="h-4 w-full" />
									</TableCell>
								))}
							</TableRow>
						))}

					{!isLoading && invoices.length === 0 && (
						<TableRow className="hover:bg-transparent">
							<TableCell
								colSpan={COLUMNS.length}
								className="py-16 text-center"
							>
								<div className="flex flex-col items-center gap-2 text-muted-foreground">
									<IconFileText className="size-6" />
									<span className="text-sm">
										{isFiltered
											? "لا نتائج مطابقة — جرّب تعديل البحث أو التصفية."
											: "لا فواتير مبيعات بعد — أنشئ أول فاتورة."}
									</span>
								</div>
							</TableCell>
						</TableRow>
					)}

					{!isLoading &&
						invoices.map((row) => {
							const isDraft = row.docstatus === DocStatus.DRAFT;
							const isSubmitted = row.docstatus === DocStatus.SUBMITTED;
							const isCancelled = row.docstatus === DocStatus.CANCELLED;
							const appearance = salesInvoiceStatusAppearance(row.status);
							const total = row.disableRoundedTotal ? row.grandTotal : row.roundedTotal;
							const outstanding = row.outstandingAmount?.toString() ?? "0";
							const owes = isPositiveAmount(outstanding);
							const selected = selectedIds.includes(row.id);

							return (
								<TableRow
									key={row.id}
									data-state={selected ? "selected" : undefined}
									className="hover:bg-muted/50"
								>
									<TableCell className="px-3 py-2">
										<Checkbox
											checked={selected}
											onCheckedChange={(checked) => toggleOne(row.id, checked === true)}
											aria-label={`تحديد الفاتورة ${row.documentNo ?? "مسودة"}`}
										/>
									</TableCell>

									<TableCell className="px-3 py-2">
										<span
											className="font-medium font-mono text-xs"
											dir="ltr"
										>
											{row.documentNo ?? "—"}
										</span>
									</TableCell>

									<TableCell className="truncate px-3 py-2 font-medium text-xs">
										{row.partyName ?? "—"}
									</TableCell>

									<TableCell
										className="px-3 py-2 text-xs tabular-nums"
										dir="ltr"
									>
										{formatDisplayDate(row.postingDate?.toString())}
									</TableCell>

									<TableCell
										className="px-3 py-2 text-xs tabular-nums"
										dir="ltr"
									>
										{formatDisplayDate(row.dueDate?.toString())}
									</TableCell>

									<TableCell className="px-3 py-2 text-end">
										<AccountingAmount value={total?.toString()} />
									</TableCell>

									{/* The reference prints an outstanding NOTE under the total because it has
									    no outstanding column. This table has one, so the note is dropped —
									    repeating the same figure twice per row is noise, not parity. */}
									<TableCell className="px-3 py-2 text-end">
										<AccountingAmount
											value={outstanding}
											muted={!owes}
										/>
									</TableCell>

									<TableCell className="px-3 py-2">
										<div className="flex items-center gap-1.5">
											<Badge variant={appearance.variant}>{statusLabel(appearance)}</Badge>
											{row.isReturn && (
												<IconCornerUpLeft
													className="size-3.5 shrink-0 text-muted-foreground"
													aria-label="مرتجع"
												/>
											)}
										</div>
									</TableCell>

									<TableCell className="px-3 py-2">
										{/* reference pattern: contextual inline action + the ⋯ menu */}
										<div className="flex items-center justify-end gap-1.5">
											{isDraft && (
												<Button
													type="button"
													variant="outline"
													size="xs"
													disabled={isPending}
													onClick={() => onSubmit(row)}
												>
													ترحيل
												</Button>
											)}
											<DropdownMenu dir={dir}>
												<DropdownMenuTrigger asChild>
													<Button
														variant="ghost"
														size="icon-sm"
														aria-label={`إجراءات ${row.documentNo ?? "المسودة"}`}
													>
														<IconDots className="size-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuItem onClick={() => onEdit(row)}>
														<IconPencil className="size-4" />
														{isDraft ? "تعديل المسودة" : "عرض"}
													</DropdownMenuItem>
													{isDraft && (
														<DropdownMenuItem
															disabled={isPending}
															onClick={() => onSubmit(row)}
														>
															<IconSend className="size-4" />
															ترحيل
														</DropdownMenuItem>
													)}
													{isSubmitted && !row.isReturn && (
														<DropdownMenuItem onClick={() => onReturn(row)}>
															<IconCornerUpLeft className="size-4" />
															إنشاء مرتجع
														</DropdownMenuItem>
													)}
													{isSubmitted && (
														<DropdownMenuItem asChild>
															<a
																href={`/print/sales-invoice?id=${row.id}`}
																target="_blank"
																rel="noreferrer"
															>
																<IconPrinter className="size-4" />
																طباعة
															</a>
														</DropdownMenuItem>
													)}
													{isCancelled && (
														<DropdownMenuItem
															disabled={isPending}
															onClick={() => onAmend(row)}
														>
															<IconFileText className="size-4" />
															نسخة معدَّلة
														</DropdownMenuItem>
													)}
													<DropdownMenuSeparator />
													{isSubmitted && (
														<DropdownMenuItem
															variant="destructive"
															onClick={() => onCancel(row)}
														>
															<IconBan className="size-4" />
															إلغاء (عكس القيود)
														</DropdownMenuItem>
													)}
													{isDraft && (
														<DropdownMenuItem
															variant="destructive"
															onClick={() => onDelete(row)}
														>
															<IconTrash className="size-4" />
															حذف المسودة
														</DropdownMenuItem>
													)}
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									</TableCell>
								</TableRow>
							);
						})}
				</TableBody>
			</Table>
		</div>
	);
};
