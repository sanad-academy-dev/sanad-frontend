import {
	IconCalendarPlus,
	IconDownload,
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
import { AccountingConfirmDialog } from "@/features/accounting/components/accounting-confirm-dialog";
import { FiscalYearSheet } from "@/features/accounting/fiscal-years/components/fiscal-year-sheet";
import {
	useFiscalYearActions,
	useFiscalYears,
} from "@/features/accounting/fiscal-years/hooks/use-fiscal-years";
import { downloadCsv, isoDay } from "@/features/accounting/utils/export-csv";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import type { FiscalYearResponse } from "@/server/accounting/fiscal-year/fiscal-year.type";

/** [P1.4] Fiscal Year management (BRD §4.2), standard list-screen anatomy: Stats →
 * TableToolbar → table body → standard side Sheet for add/edit → confirm dialog for delete. */
export const FiscalYearsPage = () => {
	const { fiscalYears, isLoading } = useFiscalYears();
	const { createNext, remove, isDeleting } = useFiscalYearActions();

	const [search, setSearch] = useState("");
	const [sheetOpen, setSheetOpen] = useState(false);
	const [editing, setEditing] = useState<FiscalYearResponse | null>(null);
	const [deleting, setDeleting] = useState<FiscalYearResponse | null>(null);

	const stats = useMemo<StatItem[]>(
		() => [
			{
				title: "إجمالي السنوات",
				value: fiscalYears.length,
				tooltip: "عدد السنوات المالية المعرّفة لهذه المنشأة.",
			},
			{
				title: "فعّالة",
				value: fiscalYears.filter((fy) => !fy.disabled).length,
				tooltip: "سنوات مفتوحة يمكن الترحيل ضمن نطاقها.",
			},
			{
				title: "معطّلة",
				value: fiscalYears.filter((fy) => fy.disabled).length,
				tooltip: "سنوات معطّلة — يُرفض الترحيل بتاريخ يقع ضمنها.",
			},
		],
		[fiscalYears],
	);

	const visible = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return fiscalYears;
		return fiscalYears.filter((fy) => fy.year.toLowerCase().includes(q));
	}, [search, fiscalYears]);

	const exportCsv = () =>
		downloadCsv(
			"fiscal-years",
			["السنة", "من", "إلى", "سنة قصيرة", "الحالة"],
			visible.map((fy) => [
				fy.year,
				isoDay(fy.yearStartDate.toString()),
				isoDay(fy.yearEndDate.toString()),
				fy.isShortYear ? "نعم" : "لا",
				fy.disabled ? "معطّلة" : "فعّالة",
			]),
		);

	const openCreate = () => {
		setEditing(null);
		setSheetOpen(true);
	};
	const openEdit = (fy: FiscalYearResponse) => {
		setEditing(fy);
		setSheetOpen(true);
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<div className="px-4 pt-3">
				<h1 className="text-lg font-medium">السنوات المالية</h1>
				<p className="text-sm text-muted-foreground">تُشتق سنة كل قيد من تاريخ ترحيله.</p>
			</div>

			<Stats
				className="px-4 grid-cols-3"
				stats={stats}
			/>

			<TableToolbar
				className="border-t"
				searchPlaceholder="ابحث عن سنة..."
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
					<>
						<Button
							variant="outline"
							size="sm"
							onClick={() => createNext()}
						>
							<IconCalendarPlus className="size-4" /> اشتقاق السنة التالية
						</Button>
						<Button
							size="sm"
							onClick={openCreate}
						>
							<IconPlus className="size-4" /> سنة مالية جديدة
						</Button>
					</>
				}
			/>

			<div className="min-h-0 flex-1 overflow-auto border-t">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>السنة</TableHead>
							<TableHead>من</TableHead>
							<TableHead>إلى</TableHead>
							<TableHead>الحالة</TableHead>
							<TableHead />
						</TableRow>
					</TableHeader>
					<TableBody>
						{!isLoading && visible.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={5}
									className="py-8 text-center text-sm text-muted-foreground"
								>
									{search ? "لا نتائج" : "لا توجد سنوات مالية بعد."}
								</TableCell>
							</TableRow>
						)}
						{visible.map((fy) => (
							<TableRow key={fy.id}>
								<TableCell className="font-medium">{fy.year}</TableCell>
								<TableCell dir="ltr">{fy.yearStartDate.toString().slice(0, 10)}</TableCell>
								<TableCell dir="ltr">{fy.yearEndDate.toString().slice(0, 10)}</TableCell>
								<TableCell>
									{fy.disabled ? (
										<Badge variant="destructive">معطّلة</Badge>
									) : (
										<Badge variant="outline">فعّالة</Badge>
									)}
									{fy.autoCreated && (
										<Badge
											variant="secondary"
											className="ms-1"
										>
											تلقائية
										</Badge>
									)}
								</TableCell>
								<TableCell className="text-end">
									<Button
										variant="ghost"
										size="icon-xs"
										aria-label="تعديل"
										onClick={() => openEdit(fy)}
									>
										<IconPencil className="size-4" />
									</Button>
									<Button
										variant="ghost"
										size="icon-xs"
										aria-label="حذف"
										onClick={() => setDeleting(fy)}
									>
										<IconTrash className="size-4" />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<FiscalYearSheet
				open={sheetOpen}
				onOpenChange={setSheetOpen}
				editing={editing}
			/>

			<AccountingConfirmDialog
				open={!!deleting}
				onOpenChange={(o) => {
					if (!o) setDeleting(null);
				}}
				title="حذف السنة المالية"
				description={`سيتم حذف السنة «${deleting?.year ?? ""}» نهائيًا.`}
				isPending={isDeleting}
				onConfirm={() => {
					if (deleting) remove(deleting.id);
					setDeleting(null);
				}}
			/>
		</div>
	);
};
