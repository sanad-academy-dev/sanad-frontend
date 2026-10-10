import {
	IconBan,
	IconBook2,
	IconDots,
	IconDownload,
	IconFileText,
	IconPencil,
	IconPlus,
	IconSend,
	IconTrash,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { Stats } from "@/components/common/stats";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AccountingConfirmDialog } from "@/features/accounting/components/accounting-confirm-dialog";
import {
	JE_VOUCHER_TYPE_LABEL,
	JournalEntrySheet,
} from "@/features/accounting/journal-entries/components/journal-entry-sheet";
import {
	useJournalEntries,
	useJournalEntryActions,
} from "@/features/accounting/journal-entries/hooks/use-journal-entries";
import { docStatusAppearance } from "@/features/accounting/utils/accounting-status";
import { downloadCsv, isoDay } from "@/features/accounting/utils/export-csv";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { DocStatus } from "@/generated/prisma/enums";
import { useI18n } from "@/hooks/use-i18n";
import type { JournalEntryResponse } from "@/server/accounting/journal-entry/journal-entry.type";

const STATUS_LABEL: Record<DocStatus, string> = {
	[DocStatus.DRAFT]: "مسودة",
	[DocStatus.SUBMITTED]: "مُرحّل",
	[DocStatus.CANCELLED]: "ملغى",
};

/** [P2.5] Journal Entries (BRD §7.1), standard list-screen anatomy; the G2 grid opens in
 * the wide accounting Sheet. Submit is the only ledger event; cancel reverses per AR-2. */
export const JournalEntriesPage = () => {
	const { isRtl } = useI18n();
	const { journalEntries, isLoading } = useJournalEntries();
	const { submit, cancel, amend, remove, isPending } = useJournalEntryActions();

	const [search, setSearch] = useState("");
	const [sheetOpen, setSheetOpen] = useState(false);
	const [editing, setEditing] = useState<JournalEntryResponse | null>(null);
	const [deleting, setDeleting] = useState<JournalEntryResponse | null>(null);

	const stats = useMemo<StatItem[]>(
		() => [
			{
				title: "إجمالي القيود",
				value: journalEntries.length,
				tooltip: "العدد الكلي لقيود اليومية.",
			},
			{
				title: "مسودة",
				value: journalEntries.filter((je) => je.docstatus === DocStatus.DRAFT).length,
				tooltip: "قيود لم تُرحَّل بعد — لا أثر لها على دفتر الأستاذ.",
			},
			{
				title: "مُرحّلة",
				value: journalEntries.filter((je) => je.docstatus === DocStatus.SUBMITTED).length,
				tooltip: "قيود كتبت في دفتر الأستاذ برقم متسلسل بلا فجوات.",
			},
			{
				title: "ملغاة",
				value: journalEntries.filter((je) => je.docstatus === DocStatus.CANCELLED).length,
				tooltip: "قيود مُلغاة — عُكست قيود أستاذها حسب وضع الدفتر.",
			},
		],
		[journalEntries],
	);

	const visible = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return journalEntries;
		return journalEntries.filter(
			(je) =>
				(je.documentNo ?? "").toLowerCase().includes(q) ||
				(je.remark ?? "").toLowerCase().includes(q) ||
				je.rows.some((row) => row.account.accountName.toLowerCase().includes(q)),
		);
	}, [search, journalEntries]);

	const exportCsv = () =>
		downloadCsv(
			"journal-entries",
			["رقم المستند", "النوع", "تاريخ الترحيل", "مدين", "دائن", "الحالة", "ملاحظة"],
			visible.map((je) => [
				je.documentNo ?? "",
				JE_VOUCHER_TYPE_LABEL[je.voucherType as keyof typeof JE_VOUCHER_TYPE_LABEL] ??
					je.voucherType,
				isoDay(je.postingDate.toString()),
				je.totalDebit.toString(),
				je.totalCredit.toString(),
				STATUS_LABEL[je.docstatus],
				je.remark ?? "",
			]),
		);

	const openCreate = () => {
		setEditing(null);
		setSheetOpen(true);
	};
	const openEdit = (je: JournalEntryResponse) => {
		setEditing(je);
		setSheetOpen(true);
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<div className="px-4 pt-3">
				<h1 className="font-medium text-lg">قيود اليومية</h1>
				<p className="text-muted-foreground text-sm">
					المستند الأساسي لتحريك دفتر الأستاذ ({journalEntries.length}).
				</p>
			</div>

			<Stats
				className="px-4 grid-cols-4"
				stats={stats}
			/>

			<TableToolbar
				className="border-t"
				searchPlaceholder="ابحث بالرقم أو الحساب أو الملاحظة..."
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
						onClick={openCreate}
					>
						<IconPlus className="size-4" /> قيد جديد
					</Button>
				}
			/>

			<div className="min-h-0 flex-1 overflow-auto border-t">
				{!isLoading && visible.length === 0 ? (
					<div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-muted-foreground text-sm">
						<IconBook2 className="size-6" />
						{search ? "لا نتائج" : "لا توجد قيود بعد — سجّل أول قيد يومية."}
					</div>
				) : (
					visible.map((je) => {
						const isDraft = je.docstatus === DocStatus.DRAFT;
						const isSubmitted = je.docstatus === DocStatus.SUBMITTED;
						const isCancelled = je.docstatus === DocStatus.CANCELLED;
						const appearance = docStatusAppearance(je.docstatus);
						return (
							<div
								key={je.id}
								className="flex items-center gap-3 border-b px-3 py-2"
							>
								<span
									className="w-32 shrink-0 font-mono text-muted-foreground text-xs"
									dir="ltr"
								>
									{je.documentNo ?? "—"}
								</span>
								<div className="min-w-0 flex-1">
									<div className="truncate font-medium text-sm">
										{JE_VOUCHER_TYPE_LABEL[
											je.voucherType as keyof typeof JE_VOUCHER_TYPE_LABEL
										] ?? je.voucherType}
										{je.amendedFromId && (
											<Badge
												variant="outline"
												className="ms-2 text-[10px]"
											>
												معدَّل
											</Badge>
										)}
									</div>
									<div className="truncate text-muted-foreground text-xs">
										{je.rows.map((row) => row.account.accountName).join(" · ")}
									</div>
								</div>
								<span
									className="shrink-0 text-sm tabular-nums"
									dir="ltr"
								>
									{je.totalDebit.toString()}
								</span>
								<span
									className="shrink-0 text-muted-foreground text-xs tabular-nums"
									dir="ltr"
								>
									{isoDay(je.postingDate.toString())}
								</span>
								<Badge variant={appearance.variant}>{STATUS_LABEL[je.docstatus]}</Badge>
								<DropdownMenu dir={isRtl ? "rtl" : "ltr"}>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											size="icon-sm"
											aria-label="إجراءات"
										>
											<IconDots className="size-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem
											disabled={isPending || !isDraft}
											onClick={() => openEdit(je)}
										>
											<IconPencil className="size-4" /> تعديل المسودة
										</DropdownMenuItem>
										<DropdownMenuItem
											disabled={isPending || !isDraft}
											onClick={() => submit(je.id)}
										>
											<IconSend className="size-4" /> ترحيل
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											variant="destructive"
											disabled={isPending || !isSubmitted}
											onClick={() => cancel(je.id)}
										>
											<IconBan className="size-4" /> إلغاء (عكس القيود)
										</DropdownMenuItem>
										<DropdownMenuItem
											disabled={isPending || !isCancelled}
											onClick={() => amend(je.id)}
										>
											<IconFileText className="size-4" /> تعديل (نسخة جديدة)
										</DropdownMenuItem>
										<DropdownMenuItem
											variant="destructive"
											disabled={isPending || !isDraft}
											onClick={() => setDeleting(je)}
										>
											<IconTrash className="size-4" /> حذف المسودة
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						);
					})
				)}
			</div>

			<JournalEntrySheet
				open={sheetOpen}
				onOpenChange={setSheetOpen}
				editing={editing}
			/>

			<AccountingConfirmDialog
				open={!!deleting}
				onOpenChange={(o) => {
					if (!o) setDeleting(null);
				}}
				title="حذف مسودة القيد"
				description="ستُحذف المسودة نهائيًا — المسودات بلا أثر على دفتر الأستاذ."
				onConfirm={() => {
					if (deleting) remove(deleting.id);
					setDeleting(null);
				}}
			/>
		</div>
	);
};
