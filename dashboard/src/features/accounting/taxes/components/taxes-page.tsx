import { IconPencil, IconPlus, IconReceiptTax, IconTrash } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { Stats } from "@/components/common/stats";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AccountingConfirmDialog } from "@/features/accounting/components/accounting-confirm-dialog";
import { ItemTaxTemplateSheet } from "@/features/accounting/taxes/components/item-tax-template-sheet";
import { TaxPreviewPanel } from "@/features/accounting/taxes/components/tax-preview-panel";
import { TaxRuleSheet } from "@/features/accounting/taxes/components/tax-rule-sheet";
import { TaxTemplateSheet } from "@/features/accounting/taxes/components/tax-template-sheet";
import {
	useItemTaxTemplates,
	usePurchaseTaxTemplates,
	useSalesTaxTemplates,
	useTaxActions,
	useTaxCategories,
	useTaxRules,
} from "@/features/accounting/taxes/hooks/use-taxes";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { cn } from "@/lib/utils";
import type {
	ItemTaxTemplateResponse,
	PurchaseTaxTemplateResponse,
	SalesTaxTemplateResponse,
} from "@/server/accounting/tax/tax.type";

/**
 * [P4.4] ONE «الضرائب» hub (contract §10.3 P4 placement + §7.8 hub rule): the five §4.11
 * masters + the §8 preview sandbox as an in-page `?tab=` strip in the legacy pill style.
 */

export const TAX_TABS = [
	{ value: "sales", label: "قوالب المبيعات" },
	{ value: "purchase", label: "قوالب المشتريات" },
	{ value: "items", label: "ضرائب الأصناف" },
	{ value: "categories", label: "الفئات" },
	{ value: "rules", label: "القواعد" },
	{ value: "preview", label: "معاينة الحساب" },
] as const;
export type TaxTab = (typeof TAX_TABS)[number]["value"];
export const isTaxTab = (value: unknown): value is TaxTab =>
	TAX_TABS.some((tab) => tab.value === value);

export const TaxesPage = ({ tab }: { tab: TaxTab }) => {
	const navigate = useNavigate();
	const setTab = (next: TaxTab) =>
		navigate({ to: "/management/accounting/taxes", search: { tab: next } });

	const { rows: salesTemplates, isLoading } = useSalesTaxTemplates();
	const { rows: purchaseTemplates } = usePurchaseTaxTemplates();
	const { rows: itemTemplates } = useItemTaxTemplates();
	const { rows: categories } = useTaxCategories();
	const { rows: rules } = useTaxRules();
	const actions = useTaxActions();

	const [search, setSearch] = useState("");
	const [templateSheet, setTemplateSheet] = useState<{
		open: boolean;
		purchase: boolean;
		editing: SalesTaxTemplateResponse | PurchaseTaxTemplateResponse | null;
	}>({ open: false, purchase: false, editing: null });
	const [itemSheet, setItemSheet] = useState<{
		open: boolean;
		editing: ItemTaxTemplateResponse | null;
	}>({ open: false, editing: null });
	const [ruleSheetOpen, setRuleSheetOpen] = useState(false);
	const [newCategory, setNewCategory] = useState("");
	const [deleting, setDeleting] = useState<{ kind: string; id: string; label: string } | null>(
		null,
	);

	const stats = useMemo<StatItem[]>(
		() => [
			{
				title: "قوالب المبيعات",
				value: salesTemplates.length,
				tooltip: "قوالب ضرائب ورسوم المبيعات (§4.11).",
			},
			{
				title: "قوالب المشتريات",
				value: purchaseTemplates.length,
				tooltip: "قوالب ضرائب ورسوم المشتريات — مع فئتي التقييم والإضافة/الخصم.",
			},
			{
				title: "قوالب الأصناف",
				value: itemTemplates.length,
				tooltip: "معدلات بديلة لكل حساب ضريبة على مستوى الصنف.",
			},
			{
				title: "القواعد",
				value: rules.length,
				tooltip: "قواعد الاختيار الآلي للقالب — الأكثر تحديدًا ثم الأعلى أولوية.",
			},
		],
		[salesTemplates, purchaseTemplates, itemTemplates, rules],
	);

	const q = search.trim().toLowerCase();
	const bySearch = <T,>(rows: T[], pick: (row: T) => string) =>
		q ? rows.filter((row) => pick(row).toLowerCase().includes(q)) : rows;

	const confirmDelete = () => {
		if (!deleting) return;
		if (deleting.kind === "sales") actions.removeSalesTemplate(deleting.id);
		else if (deleting.kind === "purchase") actions.removePurchaseTemplate(deleting.id);
		else if (deleting.kind === "item") actions.removeItemTemplate(deleting.id);
		else if (deleting.kind === "category") actions.removeCategory(deleting.id);
		else if (deleting.kind === "rule") actions.removeRule(deleting.id);
		setDeleting(null);
	};

	const rowShell = "flex items-center gap-3 border-b px-3 py-2";

	const templateList = (
		templates: (SalesTaxTemplateResponse | PurchaseTaxTemplateResponse)[],
		purchase: boolean,
	) =>
		bySearch(templates, (t) => t.title).map((template) => (
			<div
				key={template.id}
				className={rowShell}
			>
				<span className="min-w-0 flex-1 truncate font-medium text-sm">{template.title}</span>
				<span className="text-muted-foreground text-xs">{template.taxes.length} سطر</span>
				{template.isDefault && <Badge variant="secondary">افتراضي</Badge>}
				{template.disabled && <Badge variant="destructive">معطّل</Badge>}
				<Button
					variant="ghost"
					size="icon-xs"
					aria-label="تعديل"
					onClick={() => setTemplateSheet({ open: true, purchase, editing: template })}
				>
					<IconPencil className="size-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon-xs"
					aria-label="حذف"
					onClick={() =>
						setDeleting({
							kind: purchase ? "purchase" : "sales",
							id: template.id,
							label: template.title,
						})
					}
				>
					<IconTrash className="size-4" />
				</Button>
			</div>
		));

	const addButton = (() => {
		if (tab === "sales" || tab === "purchase")
			return (
				<Button
					size="sm"
					onClick={() =>
						setTemplateSheet({ open: true, purchase: tab === "purchase", editing: null })
					}
				>
					<IconPlus className="size-4" /> قالب جديد
				</Button>
			);
		if (tab === "items")
			return (
				<Button
					size="sm"
					onClick={() => setItemSheet({ open: true, editing: null })}
				>
					<IconPlus className="size-4" /> قالب صنف جديد
				</Button>
			);
		if (tab === "rules")
			return (
				<Button
					size="sm"
					onClick={() => setRuleSheetOpen(true)}
				>
					<IconPlus className="size-4" /> قاعدة جديدة
				</Button>
			);
		return undefined;
	})();

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<div className="px-4 pt-3">
				<h1 className="font-medium text-lg">الضرائب</h1>
				<p className="text-muted-foreground text-sm">
					قوالب الضرائب والرسوم وقواعد اختيارها + معاينة محرك الحساب (§4.11 / §8).
				</p>
			</div>

			<Stats
				className="px-4 grid-cols-4"
				stats={stats}
			/>

			{/* the hub's in-page tab strip (§7.8 hub rule) — legacy pill treatment */}
			<nav
				className="flex items-center gap-[3.49px] border-t px-4 py-2"
				dir="rtl"
			>
				{TAX_TABS.map((entry) => (
					<button
						key={entry.value}
						type="button"
						onClick={() => setTab(entry.value)}
						className={cn(
							"flex h-[25px] items-center justify-center rounded-[4px] px-[14px] font-medium text-[11px] leading-[16px]",
							tab === entry.value
								? "border-[0.75px] border-[#E5E7EB] bg-[#F9FAFB] text-[#1F2937]"
								: "text-[#6B7280]",
						)}
					>
						{entry.label}
					</button>
				))}
			</nav>

			{tab !== "preview" && (
				<TableToolbar
					className="border-t"
					searchPlaceholder="ابحث..."
					searchValue={search}
					onSearchChange={setSearch}
					buttonSize="xs"
					showExport={false}
					actions={addButton}
				/>
			)}

			<div className="min-h-0 flex-1 overflow-auto border-t">
				{tab === "sales" &&
					(salesTemplates.length === 0 && !isLoading ? (
						<EmptyHint label="لا قوالب مبيعات بعد." />
					) : (
						templateList(salesTemplates, false)
					))}
				{tab === "purchase" &&
					(purchaseTemplates.length === 0 ? (
						<EmptyHint label="لا قوالب مشتريات بعد." />
					) : (
						templateList(purchaseTemplates, true)
					))}
				{tab === "items" &&
					(itemTemplates.length === 0 ? (
						<EmptyHint label="لا قوالب ضريبة أصناف بعد." />
					) : (
						bySearch(itemTemplates, (t) => t.title).map((template) => (
							<div
								key={template.id}
								className={rowShell}
							>
								<span className="min-w-0 flex-1 truncate font-medium text-sm">
									{template.title}
								</span>
								<span className="w-72 shrink-0 truncate text-muted-foreground text-xs">
									{template.rows
										.map((row) => `${row.taxType.accountName}: ${row.taxRate.toString()}%`)
										.join(" · ")}
								</span>
								<Button
									variant="ghost"
									size="icon-xs"
									aria-label="تعديل"
									onClick={() => setItemSheet({ open: true, editing: template })}
								>
									<IconPencil className="size-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon-xs"
									aria-label="حذف"
									onClick={() =>
										setDeleting({ kind: "item", id: template.id, label: template.title })
									}
								>
									<IconTrash className="size-4" />
								</Button>
							</div>
						))
					))}
				{tab === "categories" && (
					<>
						<div className="flex items-center gap-2 border-b px-3 py-2">
							<Input
								placeholder="فئة جديدة (مثال: معفاة، تصدير)..."
								className="h-8 max-w-72"
								value={newCategory}
								onChange={(e) => setNewCategory(e.target.value)}
							/>
							<Button
								size="sm"
								disabled={!newCategory.trim()}
								onClick={() => {
									actions.createCategory({ title: newCategory.trim(), disabled: false });
									setNewCategory("");
								}}
							>
								<IconPlus className="size-4" /> إضافة
							</Button>
						</div>
						{bySearch(categories, (c) => c.title).map((category) => (
							<div
								key={category.id}
								className={rowShell}
							>
								<span className="min-w-0 flex-1 truncate text-sm">{category.title}</span>
								<Button
									variant="ghost"
									size="icon-xs"
									aria-label="حذف"
									onClick={() =>
										setDeleting({ kind: "category", id: category.id, label: category.title })
									}
								>
									<IconTrash className="size-4" />
								</Button>
							</div>
						))}
					</>
				)}
				{tab === "rules" &&
					(rules.length === 0 ? (
						<EmptyHint label="لا قواعد — القالب الافتراضي هو المستخدم." />
					) : (
						rules.map((rule) => (
							<div
								key={rule.id}
								className={rowShell}
							>
								<Badge variant="outline">
									{rule.taxType === "SALES" ? "مبيعات" : "مشتريات"}
								</Badge>
								<span className="min-w-0 flex-1 truncate text-sm">
									{rule.salesTemplate?.title ?? rule.purchaseTemplate?.title ?? "—"}
								</span>
								<span className="text-muted-foreground text-xs">أولوية {rule.priority}</span>
								{rule.partyId && <Badge variant="secondary">طرف محدد</Badge>}
								{rule.taxCategoryId && <Badge variant="secondary">فئة</Badge>}
								{(rule.fromDate || rule.toDate) && (
									<Badge variant="secondary">نافذة زمنية</Badge>
								)}
								<Button
									variant="ghost"
									size="icon-xs"
									aria-label="حذف"
									onClick={() => setDeleting({ kind: "rule", id: rule.id, label: "القاعدة" })}
								>
									<IconTrash className="size-4" />
								</Button>
							</div>
						))
					))}
				{tab === "preview" && <TaxPreviewPanel />}
			</div>

			<TaxTemplateSheet
				open={templateSheet.open}
				onOpenChange={(open) => setTemplateSheet((s) => ({ ...s, open }))}
				purchase={templateSheet.purchase}
				editing={templateSheet.editing}
			/>
			<ItemTaxTemplateSheet
				open={itemSheet.open}
				onOpenChange={(open) => setItemSheet((s) => ({ ...s, open }))}
				editing={itemSheet.editing}
			/>
			<TaxRuleSheet
				open={ruleSheetOpen}
				onOpenChange={setRuleSheetOpen}
			/>
			<AccountingConfirmDialog
				open={!!deleting}
				onOpenChange={(open) => {
					if (!open) setDeleting(null);
				}}
				title="تأكيد الحذف"
				description={`سيتم حذف «${deleting?.label ?? ""}» نهائيًا.`}
				onConfirm={confirmDelete}
			/>
		</div>
	);
};

const EmptyHint = ({ label }: { label: string }) => (
	<div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-muted-foreground text-sm">
		<IconReceiptTax className="size-6" />
		{label}
	</div>
);
