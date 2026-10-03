import {
	IconBan,
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
import {
	PAYMENT_TYPE_APPEARANCE,
	paymentEntryStatusAppearance,
} from "@/features/accounting/utils/accounting-status";
import {
	formatDisplayDate,
	isPositiveAmount,
} from "@/features/accounting/utils/format-amount";
import { cn } from "@/lib/utils";
import {
	DocStatus,
	type PaymentEntryListRow,
} from "@sanad/contracts/runtime/server/accounting/payment-entry/payment-entry.type";

/**
 * [P7.9] The «سندات القبض والصرف» list body — the [P5-UI-fix] twin (table-fixed
 * proportional columns, selection column, 12px semibold muted header, py-2 rows,
 * skeleton rows, in-table empty row, contextual inline action + ⋯ menu). Columns are
 * the §7.4 set: النوع (قبض/صرف/تحويل), الطرف, المبلغ, غير المخصص (the open advance).
 */

const COLUMNS = [
	{ key: "select", label: "", width: "41px", align: "start" },
	{ key: "documentNo", label: "رقم المستند", width: "13%", align: "start" },
	{ key: "type", label: "النوع", width: "10%", align: "start" },
	{ key: "party", label: "الطرف", width: "17%", align: "start" },
	{ key: "postingDate", label: "التاريخ", width: "10%", align: "start" },
	{ key: "mode", label: "وسيلة الدفع", width: "11%", align: "start" },
	{ key: "amount", label: "المبلغ", width: "12%", align: "end" },
	{ key: "unallocated", label: "غير المخصص", width: "12%", align: "end" },
	{ key: "status", label: "الحالة", width: "8%", align: "start" },
	{ key: "actions", label: "الإجراءات", width: "7%", align: "end" },
] as const;

const SKELETON_ROWS = ["s1", "s2", "s3", "s4", "s5", "s6"] as const;

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
export type PaymentEntriesTableProps = {
	entries: PaymentEntryListRow[];
	isLoading: boolean;
	isFiltered: boolean;
	selectedIds: string[];
	onSelectionChange: (ids: string[]) => void;
	dir: "rtl" | "ltr";
	isPending: boolean;
	onEdit: (row: PaymentEntryListRow) => void;
	onSubmit: (row: PaymentEntryListRow) => void;
	onAmend: (row: PaymentEntryListRow) => void;
	onCancel: (row: PaymentEntryListRow) => void;
	onDelete: (row: PaymentEntryListRow) => void;
};

export const PaymentEntriesTable = ({
	entries,
	isLoading,
	isFiltered,
	selectedIds,
	onSelectionChange,
	dir,
	isPending,
	onEdit,
	onSubmit,
	onAmend,
	onCancel,
	onDelete,
}: PaymentEntriesTableProps) => {
	const allSelected = entries.length > 0 && selectedIds.length === entries.length;

	const toggleAll = (checked: boolean) =>
		onSelectionChange(checked ? entries.map((row) => row.id) : []);
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
										aria-label="تحديد كل السندات"
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

					{!isLoading && entries.length === 0 && (
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
											: "لا سندات بعد — أنشئ أول سند قبض أو صرف."}
									</span>
								</div>
							</TableCell>
						</TableRow>
					)}

					{!isLoading &&
						entries.map((row) => {
							const isDraft = row.docstatus === DocStatus.DRAFT;
							const isSubmitted = row.docstatus === DocStatus.SUBMITTED;
							const isCancelled = row.docstatus === DocStatus.CANCELLED;
							const appearance = paymentEntryStatusAppearance(row.status);
							const type = PAYMENT_TYPE_APPEARANCE[row.paymentType];
							const unallocated = row.unallocatedAmount?.toString() ?? "0";
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
											aria-label={`تحديد السند ${row.documentNo ?? "مسودة"}`}
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

									<TableCell className="px-3 py-2">
										<Badge variant={type.variant}>{type.label}</Badge>
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

									<TableCell className="truncate px-3 py-2 text-xs">
										{row.modeOfPayment?.modeOfPaymentName ?? "—"}
									</TableCell>

									<TableCell className="px-3 py-2 text-end">
										<AccountingAmount value={row.paidAmount?.toString()} />
									</TableCell>

									{/* the open advance — what's still unmatched (FR-11.1 feed) */}
									<TableCell className="px-3 py-2 text-end">
										<AccountingAmount
											value={unallocated}
											muted={!isPositiveAmount(unallocated)}
										/>
									</TableCell>

									<TableCell className="px-3 py-2">
										<Badge variant={appearance.variant}>{appearance.label}</Badge>
									</TableCell>

									<TableCell className="px-3 py-2">
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
													{isSubmitted && (
														<DropdownMenuItem asChild>
															<a
																href={`/print/payment-entry?id=${row.id}`}
																target="_blank"
																rel="noreferrer"
															>
																<IconPrinter className="size-4" />
																طباعة السند
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
