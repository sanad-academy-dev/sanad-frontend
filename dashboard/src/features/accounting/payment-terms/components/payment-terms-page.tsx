import {
	IconCalendarDollar,
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
import { AccountingConfirmDialog } from "@/features/accounting/components/accounting-confirm-dialog";
import {
	DUE_DATE_BASIS_LABEL,
	PaymentTermSheet,
} from "@/features/accounting/payment-terms/components/payment-term-sheet";
import { PaymentTermsTemplateSheet } from "@/features/accounting/payment-terms/components/payment-terms-template-sheet";
import {
	usePaymentTerms,
	usePaymentTermsActions,
	usePaymentTermsTemplates,
} from "@/features/accounting/payment-terms/hooks/use-payment-terms";
import { downloadCsv } from "@/features/accounting/utils/export-csv";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import type {
	PaymentTermResponse,
	PaymentTermsTemplateResponse,
} from "@/server/accounting/payment-terms/payment-terms.type";

/** [P3.5] «شروط الدفع» (BRD §4.9) — the two §4.9 masters on one tab, standard anatomy. */
export const PaymentTermsPage = () => {
	const { terms, isLoading } = usePaymentTerms();
	const { templates } = usePaymentTermsTemplates();
	const { removeTerm, removeTemplate } = usePaymentTermsActions();

	const [search, setSearch] = useState("");
	const [termSheetOpen, setTermSheetOpen] = useState(false);
	const [editingTerm, setEditingTerm] = useState<PaymentTermResponse | null>(null);
	const [templateSheetOpen, setTemplateSheetOpen] = useState(false);
	const [editingTemplate, setEditingTemplate] = useState<PaymentTermsTemplateResponse | null>(
		null,
	);
	const [deletingTerm, setDeletingTerm] = useState<PaymentTermResponse | null>(null);
	const [deletingTemplate, setDeletingTemplate] =
		useState<PaymentTermsTemplateResponse | null>(null);

	const stats = useMemo<StatItem[]>(
		() => [
			{ title: "الشروط", value: terms.length, tooltip: "شروط الدفع المعرّفة (§4.9)." },
			{ title: "القوالب", value: templates.length, tooltip: "قوالب الشروط المرتّبة." },
			{
				title: "بخصم مبكر",
				value: terms.filter((t) => Number(t.discount) > 0).length,
				tooltip: "شروط تمنح خصم سداد مبكر.",
			},
			{
				title: "توزيع حسب الشروط",
				value: templates.filter((t) => t.allocatePaymentBasedOnPaymentTerms).length,
				tooltip: "قوالب تفعّل توزيع الدفعات على الشروط.",
			},
		],
		[terms, templates],
	);

	const visibleTerms = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return terms;
		return terms.filter((t) => t.paymentTermName.toLowerCase().includes(q));
	}, [search, terms]);

	const visibleTemplates = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return templates;
		return templates.filter((t) => t.templateName.toLowerCase().includes(q));
	}, [search, templates]);

	const exportCsv = () =>
		downloadCsv(
			"payment-terms",
			["الاسم", "النسبة", "أساس الاستحقاق", "أيام", "شهور", "الخصم"],
			visibleTerms.map((t) => [
				t.paymentTermName,
				`${t.invoicePortion.toString()}%`,
				DUE_DATE_BASIS_LABEL[t.dueDateBasedOn],
				String(t.creditDays),
				String(t.creditMonths),
				t.discount.toString(),
			]),
		);

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<div className="px-4 pt-3">
				<h1 className="font-medium text-lg">شروط الدفع</h1>
				<p className="text-muted-foreground text-sm">
					شروط السداد وقوالبها المرتّبة — أساس جداول الاستحقاق في الفواتير ({terms.length} شرطًا
					· {templates.length} قالبًا).
				</p>
			</div>

			<Stats
				className="px-4 grid-cols-4"
				stats={stats}
			/>

			<TableToolbar
				className="border-t"
				searchPlaceholder="ابحث في الشروط والقوالب..."
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
						disabled={visibleTerms.length === 0}
						className="gap-1.5 px-2"
					>
						<IconDownload className="size-3.5" />
						تصدير
					</Button>
				}
				actions={
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								setEditingTemplate(null);
								setTemplateSheetOpen(true);
							}}
						>
							<IconPlus className="size-4" /> قالب جديد
						</Button>
						<Button
							size="sm"
							onClick={() => {
								setEditingTerm(null);
								setTermSheetOpen(true);
							}}
						>
							<IconPlus className="size-4" /> شرط جديد
						</Button>
					</div>
				}
			/>

			<div className="min-h-0 flex-1 overflow-auto border-t">
				{!isLoading && visibleTerms.length === 0 && visibleTemplates.length === 0 ? (
					<div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-muted-foreground text-sm">
						<IconCalendarDollar className="size-6" />
						{search ? "لا نتائج" : "لا شروط دفع بعد."}
					</div>
				) : (
					<>
						<div className="border-b bg-muted/30 px-3 py-1.5 font-medium text-muted-foreground text-xs">
							الشروط
						</div>
						{visibleTerms.map((term) => (
							<div
								key={term.id}
								className="flex items-center gap-3 border-b px-3 py-2"
							>
								<span className="min-w-0 flex-1 truncate font-medium text-sm">
									{term.paymentTermName}
								</span>
								<Badge variant="outline">{term.invoicePortion.toString()}%</Badge>
								<span className="w-56 shrink-0 truncate text-muted-foreground text-xs">
									{DUE_DATE_BASIS_LABEL[term.dueDateBasedOn]} (
									{term.dueDateBasedOn === "MONTHS_AFTER_INVOICE_MONTH_END"
										? `${term.creditMonths} شهر`
										: `${term.creditDays} يوم`}
									)
								</span>
								{Number(term.discount) > 0 && (
									<Badge
										variant="secondary"
										className="text-[10px]"
									>
										خصم مبكر
									</Badge>
								)}
								<div className="flex items-center gap-1">
									<Button
										variant="ghost"
										size="icon-xs"
										aria-label="تعديل"
										onClick={() => {
											setEditingTerm(term);
											setTermSheetOpen(true);
										}}
									>
										<IconPencil className="size-4" />
									</Button>
									<Button
										variant="ghost"
										size="icon-xs"
										aria-label="حذف"
										onClick={() => setDeletingTerm(term)}
									>
										<IconTrash className="size-4" />
									</Button>
								</div>
							</div>
						))}

						<div className="border-b bg-muted/30 px-3 py-1.5 font-medium text-muted-foreground text-xs">
							القوالب
						</div>
						{visibleTemplates.map((template) => (
							<div
								key={template.id}
								className="flex items-center gap-3 border-b px-3 py-2"
							>
								<span className="min-w-0 flex-1 truncate font-medium text-sm">
									{template.templateName}
								</span>
								<span className="w-72 shrink-0 truncate text-muted-foreground text-xs">
									{template.rows
										.map(
											(row) =>
												`${row.term.paymentTermName} (${row.term.invoicePortion.toString()}%)`,
										)
										.join(" ← ")}
								</span>
								{template.allocatePaymentBasedOnPaymentTerms && (
									<Badge
										variant="secondary"
										className="text-[10px]"
									>
										توزيع حسب الشروط
									</Badge>
								)}
								<div className="flex items-center gap-1">
									<Button
										variant="ghost"
										size="icon-xs"
										aria-label="تعديل"
										onClick={() => {
											setEditingTemplate(template);
											setTemplateSheetOpen(true);
										}}
									>
										<IconPencil className="size-4" />
									</Button>
									<Button
										variant="ghost"
										size="icon-xs"
										aria-label="حذف"
										onClick={() => setDeletingTemplate(template)}
									>
										<IconTrash className="size-4" />
									</Button>
								</div>
							</div>
						))}
					</>
				)}
			</div>

			<PaymentTermSheet
				open={termSheetOpen}
				onOpenChange={setTermSheetOpen}
				editing={editingTerm}
			/>
			<PaymentTermsTemplateSheet
				open={templateSheetOpen}
				onOpenChange={setTemplateSheetOpen}
				editing={editingTemplate}
			/>

			<AccountingConfirmDialog
				open={!!deletingTerm}
				onOpenChange={(o) => {
					if (!o) setDeletingTerm(null);
				}}
				title="حذف شرط الدفع"
				description={`سيتم حذف «${deletingTerm?.paymentTermName ?? ""}» نهائيًا.`}
				onConfirm={() => {
					if (deletingTerm) removeTerm(deletingTerm.id);
					setDeletingTerm(null);
				}}
			/>
			<AccountingConfirmDialog
				open={!!deletingTemplate}
				onOpenChange={(o) => {
					if (!o) setDeletingTemplate(null);
				}}
				title="حذف القالب"
				description={`سيتم حذف «${deletingTemplate?.templateName ?? ""}» نهائيًا.`}
				onConfirm={() => {
					if (deletingTemplate) removeTemplate(deletingTemplate.id);
					setDeletingTemplate(null);
				}}
			/>
		</div>
	);
};
