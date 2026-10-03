import { IconCash, IconDownload, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { Stats } from "@/components/common/stats";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AccountingConfirmDialog } from "@/features/accounting/components/accounting-confirm-dialog";
import {
	MODE_OF_PAYMENT_TYPE_LABEL,
	ModeOfPaymentSheet,
} from "@/features/accounting/modes-of-payment/components/mode-of-payment-sheet";
import {
	useModeOfPaymentActions,
	useModesOfPayment,
} from "@/features/accounting/modes-of-payment/hooks/use-modes-of-payment";
import { downloadCsv } from "@/features/accounting/utils/export-csv";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { ModeOfPaymentType } from "@/generated/prisma/enums";
import type { ModeOfPaymentResponse } from "@/server/accounting/mode-of-payment/mode-of-payment.type";

/** [P1.7] Mode of Payment master (BRD §4.8), standard list-screen anatomy: Stats →
 * TableToolbar → list body → standard side Sheet for create/edit → confirm dialog for delete. */
export const ModesOfPaymentPage = () => {
	const { modes, isLoading } = useModesOfPayment();
	const { remove } = useModeOfPaymentActions();

	const [search, setSearch] = useState("");
	const [sheetOpen, setSheetOpen] = useState(false);
	const [editing, setEditing] = useState<ModeOfPaymentResponse | null>(null);
	const [deleting, setDeleting] = useState<ModeOfPaymentResponse | null>(null);

	const stats = useMemo<StatItem[]>(
		() => [
			{
				title: "إجمالي الطرق",
				value: modes.length,
				tooltip: "العدد الكلي لطرق الدفع المعرّفة.",
			},
			{
				title: "نقدي",
				value: modes.filter((m) => m.type === ModeOfPaymentType.CASH).length,
				tooltip: "طرق التحصيل النقدي.",
			},
			{
				title: "بنكي",
				value: modes.filter((m) => m.type === ModeOfPaymentType.BANK).length,
				tooltip: "طرق التحويل والتحصيل البنكي.",
			},
			{
				title: "معطّلة",
				value: modes.filter((m) => !m.enabled).length,
				tooltip: "طرق معطّلة لا تظهر عند تسجيل الدفعات.",
			},
		],
		[modes],
	);

	const visible = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return modes;
		return modes.filter((m) => m.modeOfPaymentName.toLowerCase().includes(q));
	}, [search, modes]);

	const exportCsv = () =>
		downloadCsv(
			"modes-of-payment",
			["الاسم", "النوع", "الحساب الافتراضي", "الحالة"],
			visible.map((m) => [
				m.modeOfPaymentName,
				MODE_OF_PAYMENT_TYPE_LABEL[m.type],
				m.defaultAccount?.accountName ?? "",
				m.enabled ? "مُفعّلة" : "معطّلة",
			]),
		);

	const openCreate = () => {
		setEditing(null);
		setSheetOpen(true);
	};
	const openEdit = (m: ModeOfPaymentResponse) => {
		setEditing(m);
		setSheetOpen(true);
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<div className="px-4 pt-3">
				<h1 className="font-medium text-lg">طرق الدفع</h1>
				<p className="text-muted-foreground text-sm">
					أنواع التحصيل (نقدًا / بنك / هاتف) وحسابها الافتراضي ({modes.length}).
				</p>
			</div>

			<Stats
				className="px-4 grid-cols-4"
				stats={stats}
			/>

			<TableToolbar
				className="border-t"
				searchPlaceholder="ابحث عن طريقة دفع..."
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
						<IconPlus className="size-4" /> طريقة دفع جديدة
					</Button>
				}
			/>

			<div className="min-h-0 flex-1 overflow-auto border-t">
				{!isLoading && visible.length === 0 ? (
					<div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-muted-foreground text-sm">
						<IconCash className="size-6" />
						{search ? "لا نتائج" : "لا توجد طرق دفع بعد."}
					</div>
				) : (
					visible.map((m) => (
						<div
							key={m.id}
							className="flex items-center gap-3 border-b px-3 py-2"
						>
							<span className="min-w-0 flex-1 truncate font-medium text-sm">
								{m.modeOfPaymentName}
							</span>
							<Badge variant="outline">{MODE_OF_PAYMENT_TYPE_LABEL[m.type]}</Badge>
							<span className="w-48 shrink-0 truncate text-muted-foreground text-xs">
								{m.defaultAccount ? m.defaultAccount.accountName : "— بدون حساب —"}
							</span>
							{!m.enabled && (
								<Badge
									variant="destructive"
									className="text-[10px]"
								>
									معطّل
								</Badge>
							)}
							<div className="flex items-center gap-1">
								<Button
									variant="ghost"
									size="icon-xs"
									aria-label="تعديل"
									onClick={() => openEdit(m)}
								>
									<IconPencil className="size-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon-xs"
									aria-label="حذف"
									onClick={() => setDeleting(m)}
								>
									<IconTrash className="size-4" />
								</Button>
							</div>
						</div>
					))
				)}
			</div>

			<ModeOfPaymentSheet
				open={sheetOpen}
				onOpenChange={setSheetOpen}
				editing={editing}
			/>

			<AccountingConfirmDialog
				open={!!deleting}
				onOpenChange={(o) => {
					if (!o) setDeleting(null);
				}}
				title="حذف طريقة الدفع"
				description={`سيتم حذف «${deleting?.modeOfPaymentName ?? ""}» نهائيًا.`}
				onConfirm={() => {
					if (deleting) remove(deleting.id);
					setDeleting(null);
				}}
			/>
		</div>
	);
};
