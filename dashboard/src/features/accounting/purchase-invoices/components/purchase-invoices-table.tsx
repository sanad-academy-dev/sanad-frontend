import {
	IconBan,
	IconCornerUpLeft,
	IconDots,
	IconFileText,
	IconLockOpen,
	IconPencil,
	IconPlayerPause,
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
import { purchaseInvoiceStatusAppearance } from "@/features/accounting/utils/accounting-status";
import {
	formatDisplayDate,
	isPositiveAmount,
} from "@/features/accounting/utils/format-amount";
import { cn } from "@/lib/utils";
import {
	DocStatus,
	type PurchaseInvoiceListRow,
} from "@sanad/contracts/runtime/server/accounting/purchase-invoice/purchase-invoice.type";

/**
 * [P6.5] The «فواتير المشتريات» list body — the AP twin of `sales-invoices-table.tsx`,
 * which is itself the [P5-UI-fix] twin of the legacy invoices table. Anatomy is inherited
 * verbatim (table-fixed proportional columns, selection column, 12px semibold muted
 * header, py-2 rows with hover wash, skeleton rows, in-table empty row, contextual inline
 * action + ⋯ menu); the columns swap to the §7.3 set: العميل → المورد, plus the supplier's
 * bill number (BR-7.3.1), and a hold indicator beside the status (BR-7.3.2 — hold is a
 * flag, so it renders as its own icon, never through the status map).
 */

const COLUMNS = [
	{ key: "select", label: "", width: "41px", align: "start" },
	{ key: "documentNo", label: "رقم المستند", width: "12%", align: "start" },
	{ key: "party", label: "المورد", width: "16%", align: "start" },
	{ key: "billNo", label: "فاتورة المورد", width: "11%", align: "start" },
	{ key: "postingDate", label: "تاريخ الترحيل", width: "10%", align: "start" },
	{ key: "dueDate", label: "تاريخ الاستحقاق", width: "10%", align: "start" },
	{ key: "total", label: "الإجمالي", width: "12%", align: "end" },
	{ key: "outstanding", label: "المتبقي", width: "12%", align: "end" },
	{ key: "status", label: "الحالة", width: "11%", align: "start" },
	{ key: "actions", label: "الإجراءات", width: "8%", align: "end" },
] as const;

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

/** Money cell — numeral then «ر.س» as separate LTR elements ([P5-UI-fix] bidi rule). */
export type PurchaseInvoicesTableProps = {
	invoices: PurchaseInvoiceListRow[];
	isLoading: boolean;
	/** true when a search/filter is narrowing the list — changes the empty copy */
	isFiltered: boolean;
	selectedIds: string[];
	onSelectionChange: (ids: string[]) => void;
	dir: "rtl" | "ltr";
	isPending: boolean;
	onEdit: (row: PurchaseInvoiceListRow) => void;
	onSubmit: (row: PurchaseInvoiceListRow) => void;
	onReturn: (row: PurchaseInvoiceListRow) => void;
	onAmend: (row: PurchaseInvoiceListRow) => void;
	onCancel: (row: PurchaseInvoiceListRow) => void;
	onDelete: (row: PurchaseInvoiceListRow) => void;
	onHold: (row: PurchaseInvoiceListRow) => void;
	onRelease: (row: PurchaseInvoiceListRow) => void;
};

export const PurchaseInvoicesTable = ({
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
	onHold,
	onRelease,
}: PurchaseInvoicesTableProps) => {
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
											: "لا فواتير مشتريات بعد — أنشئ أول فاتورة."}
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
							const appearance = purchaseInvoiceStatusAppearance(row.status);
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

									{/* BR-7.3.1 — the supplier's own bill number, an LTR reference code */}
									<TableCell className="truncate px-3 py-2 text-xs">
										<span dir="ltr">{row.billNo ?? "—"}</span>
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

									<TableCell className="px-3 py-2 text-end">
										<AccountingAmount
											value={outstanding}
											muted={!owes}
										/>
									</TableCell>

									<TableCell className="px-3 py-2">
										<div className="flex items-center gap-1.5">
											<Badge variant={appearance.variant}>{statusLabel(appearance)}</Badge>
											{row.onHold && (
												<IconPlayerPause
													className="size-3.5 shrink-0 text-muted-foreground"
													aria-label="معلّقة"
												/>
											)}
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
													{/* BR-7.3.2 — hold/release on submitted invoices only */}
													{isSubmitted && !row.onHold && (
														<DropdownMenuItem
															disabled={isPending}
															onClick={() => onHold(row)}
														>
															<IconPlayerPause className="size-4" />
															تعليق الدفع
														</DropdownMenuItem>
													)}
													{isSubmitted && row.onHold && (
														<DropdownMenuItem
															disabled={isPending}
															onClick={() => onRelease(row)}
														>
															<IconLockOpen className="size-4" />
															إفراج
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
