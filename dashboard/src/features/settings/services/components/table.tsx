"use client";

import {
	IconBodyScan,
	IconChevronDown,
	IconChevronRight,
	IconFlask,
	IconPlus,
	IconScissors,
} from "@tabler/icons-react";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ConfirmDiscard } from "@/features/settings/components/confirm-discard";
import { LabParametersSheet } from "@/features/settings/lab-templates/components/lab-parameters-sheet";
import { OperationProcedureSheet } from "@/features/settings/operation-procedures/components/operation-procedure-sheet";
import { RadiologyExamSheet } from "@/features/settings/radiology-exams/components/radiology-exam-sheet";
import { useCreateCategory } from "@/features/settings/services/hooks/use-create-category";
import { useCreateServiceItem } from "@/features/settings/services/hooks/use-create-service-item";
import { useCreateSubcategory } from "@/features/settings/services/hooks/use-create-subcategory";
import { useServicesTree } from "@/features/settings/services/hooks/use-services-tree";
import { useToggleServiceItem } from "@/features/settings/services/hooks/use-toggle-service-item";
import { useUpdateServiceConfig } from "@/features/settings/services/hooks/use-update-service-config";
import type {
	CategoryAddRowProps,
	CategoryRowProps,
	ItemRowProps,
	ServiceItemDraft,
	ServicesTableProps,
	SubcategoryRowProps,
	TableConfig,
} from "@/features/settings/services/types/table.types";
import { formatDuration } from "@/features/settings/services/utils/table-formatters";
import { formatRelativeDate } from "@/features/settings/utils/format-relative-date";
import { cn } from "@/lib/utils";
import type {
	ServiceCategoryResponse,
	ServiceSubcategoryResponse,
} from "@/server/services/services.type";

// ─── Variant config ────────────────────────────────────────────────────────────

// النسخة الكاملة: الاسم + 8 أعمدة (آخرها عمود المُحلِّلات لدورات التحاليل)
const FULL_COLS = "grid-cols-[200px_repeat(8,minmax(0,1fr))]" as const;
const TWO_LEVEL_COLS = "grid-cols-[200px_repeat(5,minmax(0,1fr))]" as const;

const TableConfigContext = createContext<TableConfig>({ variant: "full", cols: FULL_COLS });
const useTableConfig = () => useContext(TableConfigContext);

// ─── Shared helpers ────────────────────────────────────────────────────────────

const ICON_SLOT_CLASS = "inline-flex h-4 w-4 shrink-0 items-center justify-center" as const;
const LEVEL_SPACER_CLASS = "inline-flex h-4 w-4 shrink-0" as const;

// ─── Level 3: Item row (full variant only) ────────────────────────────────────

function ItemRow({
	item,
	isLab = false,
	isRadiology = false,
	isOperation = false,
}: ItemRowProps) {
	const { cols } = useTableConfig();
	const { toggleServiceItem, isPending: togglePending } = useToggleServiceItem();
	const { updateServiceConfig, isPending: updatePending } = useUpdateServiceConfig();
	const isPending = togglePending || updatePending;

	const [editingField, setEditingField] = useState<"price" | "duration" | null>(null);
	const [editValue, setEditValue] = useState("");
	// لوحة مُحلِّلات التحليل (تُفتح من الزر المقابل للتحليل)
	const [paramsOpen, setParamsOpen] = useState(false);
	// لوحة تعريف فحص الأشعة (طريقة التصوير والإسقاطات)
	const [examOpen, setExamOpen] = useState(false);
	const [procedureOpen, setProcedureOpen] = useState(false);

	function startEdit(field: "price" | "duration") {
		if (isPending) return;
		setEditingField(field);
		setEditValue(
			field === "price"
				? item.price !== null
					? String(item.price)
					: ""
				: item.duration !== null
					? String(item.duration)
					: "",
		);
	}

	function cancelEdit() {
		setEditingField(null);
		setEditValue("");
	}

	function commitEdit() {
		if (!editingField) return;
		const trimmed = editValue.trim();
		const parsed = trimmed === "" ? null : Number(trimmed);
		if (editingField === "price") {
			updateServiceConfig(item.id, { price: parsed !== null ? Math.max(0, parsed) : null });
		} else {
			updateServiceConfig(item.id, {
				duration: parsed !== null ? Math.max(1, Math.floor(parsed)) : null,
			});
		}
		setEditingField(null);
		setEditValue("");
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") {
			e.preventDefault();
			e.currentTarget.blur();
		}
		if (e.key === "Escape") {
			e.preventDefault();
			cancelEdit();
		}
	}

	return (
		<TableRow className={cn("grid", cols)}>
			<TableCell className="px-3 py-2 text-sm">
				<div className="flex items-center justify-start gap-2">
					<span
						aria-hidden
						className={LEVEL_SPACER_CLASS}
					/>
					<span
						aria-hidden
						className={LEVEL_SPACER_CLASS}
					/>
					<span
						aria-hidden
						className={ICON_SLOT_CLASS}
					/>
					<span className="truncate">{item.name}</span>
				</div>
			</TableCell>
			<TableCell
				className={cn(
					"tabular-nums px-3 py-2 text-end font-mono text-sm",
					!isPending && "cursor-text hover:bg-muted/50",
				)}
				onClick={() => editingField !== "price" && startEdit("price")}
			>
				{editingField === "price" ? (
					<Input
						autoFocus
						className="h-6 w-full rounded border bg-background px-1 text-end font-mono text-sm shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/40"
						type="number"
						min={0}
						placeholder="0"
						value={editValue}
						onChange={(e) => setEditValue(e.target.value)}
						onKeyDown={handleKeyDown}
						onBlur={commitEdit}
					/>
				) : item.price !== null ? (
					`${item.price.toLocaleString()} ر.س`
				) : (
					"—"
				)}
			</TableCell>
			<TableCell
				className={cn(
					"px-3 py-2 text-muted-foreground text-sm",
					!isPending && "cursor-text hover:bg-muted/50",
				)}
				onClick={() => editingField !== "duration" && startEdit("duration")}
			>
				{editingField === "duration" ? (
					<Input
						autoFocus
						className="h-6 w-full rounded border bg-background px-1 text-sm shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/40"
						type="number"
						min={1}
						placeholder="دقائق"
						value={editValue}
						onChange={(e) => setEditValue(e.target.value)}
						onKeyDown={handleKeyDown}
						onBlur={commitEdit}
					/>
				) : (
					formatDuration(item.duration)
				)}
			</TableCell>
			<TableCell className="px-3 py-2 text-center text-muted-foreground text-sm">—</TableCell>
			<TableCell className="px-3 py-2 text-sm">
				<div className="flex items-center gap-2">
					<Progress
						value={item.popularityScore}
						className="h-1.5 flex-1"
					/>
					<span className="w-8 shrink-0 text-end text-muted-foreground text-xs tabular-nums">
						{item.popularityScore}%
					</span>
				</div>
			</TableCell>
			<TableCell className="tabular-nums px-3 py-2 text-center text-sm">
				{item.usageCount.toLocaleString()}
			</TableCell>
			<TableCell className="px-3 py-2 text-sm">
				<Switch
					size="sm"
					checked={item.isActive}
					disabled={isPending}
					onCheckedChange={(checked) => toggleServiceItem(item.id, checked)}
				/>
			</TableCell>
			<TableCell className="px-3 py-2 text-muted-foreground text-sm">
				{item.isDefault ? (
					<Badge
						variant="secondary"
						className="rounded-[4px] text-xs"
					>
						افتراضي
					</Badge>
				) : (
					formatRelativeDate(item.createdAt)
				)}
			</TableCell>
			{/* عمود المُحلِّلات/التعريف — لدورات فئتي التحاليل والأشعة فقط */}
			<TableCell className="px-3 py-2 text-sm">
				{isLab && (
					<>
						<Button
							variant="outline"
							size="xs"
							className="h-6 gap-1 px-1.5 text-[11px]"
							title="إدارة مُحلِّلات هذا التحليل"
							onClick={() => setParamsOpen(true)}
						>
							<IconFlask className="h-3 w-3" />
							المُحلِّلات
						</Button>
						<LabParametersSheet
							serviceId={item.id}
							serviceName={item.name}
							open={paramsOpen}
							onOpenChange={setParamsOpen}
						/>
					</>
				)}
				{isRadiology && (
					<>
						<Button
							variant="outline"
							size="xs"
							className="h-6 gap-1 px-1.5 text-[11px]"
							title="تعريف طريقة التصوير وخصائص الفحص"
							onClick={() => setExamOpen(true)}
						>
							<IconBodyScan className="h-3 w-3" />
							تعريف الفحص
						</Button>
						<RadiologyExamSheet
							serviceId={item.id}
							serviceName={item.name}
							open={examOpen}
							onOpenChange={setExamOpen}
						/>
					</>
				)}
				{isOperation && (
					<>
						<Button
							variant="outline"
							size="xs"
							className="h-6 gap-1 px-1.5 text-[11px]"
							title="تعريف درجة التعقيد والتخدير وخصائص الإجراء"
							onClick={() => setProcedureOpen(true)}
						>
							<IconScissors className="h-3 w-3" />
							تعريف الإجراء
						</Button>
						<OperationProcedureSheet
							serviceId={item.id}
							serviceName={item.name}
							open={procedureOpen}
							onOpenChange={setProcedureOpen}
						/>
					</>
				)}
			</TableCell>
		</TableRow>
	);
}

const DRAFT_INITIAL: ServiceItemDraft = { name: "", price: "", duration: "", isActive: true };

// ─── Level 2: Subcategory row ─────────────────────────────────────────────────

function SubcategoryRow({
	sub,
	isOpen,
	onOpenChange,
	itemAddToken = 0,
	forceOpen = false,
	isLab = false,
	isRadiology = false,
	isOperation = false,
}: SubcategoryRowProps) {
	const { variant, cols } = useTableConfig();
	const effectiveOpen = forceOpen || isOpen;
	const [isAdding, setIsAdding] = useState(false);

	useEffect(() => {
		if (itemAddToken > 0) setIsAdding(true);
	}, [itemAddToken]);
	const [draft, setDraft] = useState(DRAFT_INITIAL);
	const { createServiceItem, isPending } = useCreateServiceItem();

	const totalUsage = sub.children.reduce((sum, i) => sum + i.usageCount, 0);
	const maxPopularity =
		sub.children.length > 0 ? Math.max(...sub.children.map((i) => i.popularityScore)) : null;

	function handleConfirm() {
		if (!draft.name.trim() || isPending) return;
		createServiceItem(
			{
				subcategoryId: sub.id,
				name: draft.name.trim(),
				price: draft.price !== "" ? Number(draft.price) : null,
				duration: draft.duration !== "" ? Number(draft.duration) : null,
				isActive: draft.isActive,
			},
			{ onSuccess: () => setDraft(DRAFT_INITIAL) },
		);
		setIsAdding(false);
	}

	function handleDiscard() {
		setIsAdding(false);
		setDraft(DRAFT_INITIAL);
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter") handleConfirm();
		if (e.key === "Escape") handleDiscard();
	}

	// Two-level: render as leaf (no expand, no item children)
	if (variant === "two-level") {
		return (
			<Collapsible
				asChild
				open={false}
				onOpenChange={() => {}}
			>
				<TableBody className="[&_tr:last-child]:border-b last:[&_tr:last-child]:border-0">
					<TableRow className={cn("grid", cols, "bg-muted/30 hover:bg-muted/30")}>
						<TableCell className="px-3 py-2">
							<div className="flex items-center justify-start gap-2">
								<span
									aria-hidden
									className={LEVEL_SPACER_CLASS}
								/>
								<span
									aria-hidden
									className={ICON_SLOT_CLASS}
								/>
								<span className="font-medium text-sm">{sub.name}</span>
							</div>
						</TableCell>
						<TableCell className="px-3 py-2 text-center font-medium text-sm">
							{sub.children.length}
						</TableCell>
						<TableCell className="px-3 py-2 text-center text-sm">
							{maxPopularity !== null ? `${maxPopularity}%` : "—"}
						</TableCell>
						<TableCell className="tabular-nums px-3 py-2 text-center text-sm">
							{totalUsage.toLocaleString()}
						</TableCell>
						<TableCell className="px-3 py-2" />
						<TableCell className="px-3 py-2">
							{sub.isDefault && (
								<Badge
									variant="secondary"
									className="rounded-[4px] text-xs"
								>
									افتراضي
								</Badge>
							)}
						</TableCell>
					</TableRow>
				</TableBody>
			</Collapsible>
		);
	}

	// Full: expandable row with item children
	return (
		<Collapsible
			asChild
			open={effectiveOpen}
			onOpenChange={() => onOpenChange(sub.id)}
		>
			<TableBody className="[&_tr:last-child]:border-b last:[&_tr:last-child]:border-0">
				<TableRow
					className={cn(
						"grid",
						cols,
						"bg-muted/30 hover:bg-muted/30",
						effectiveOpen && "border-b-0",
					)}
				>
					<TableCell className="px-3 py-2">
						<div className="flex items-center justify-start gap-2">
							<span
								aria-hidden
								className={LEVEL_SPACER_CLASS}
							/>
							<button
								aria-label={effectiveOpen ? "طي" : "توسيع"}
								className={cn(
									ICON_SLOT_CLASS,
									"text-muted-foreground transition-colors hover:text-foreground",
								)}
								onClick={() => onOpenChange(sub.id)}
								type="button"
							>
								{effectiveOpen ? (
									<IconChevronDown className="h-4 w-4" />
								) : (
									<IconChevronRight className="h-4 w-4" />
								)}
							</button>
							<span className="font-medium text-sm">{sub.name}</span>
						</div>
					</TableCell>
					<TableCell className="px-3 py-2" />
					<TableCell className="px-3 py-2" />
					<TableCell className="px-3 py-2 text-center font-medium text-sm">
						{sub.children.length}
					</TableCell>
					<TableCell className="px-3 py-2 text-center text-sm">
						{maxPopularity !== null ? `${maxPopularity}%` : "—"}
					</TableCell>
					<TableCell className="tabular-nums px-3 py-2 text-center text-sm">
						{totalUsage.toLocaleString()}
					</TableCell>
					<TableCell className="px-3 py-2" />
					<TableCell className="px-3 py-2">
						{sub.isDefault && (
							<Badge
								variant="secondary"
								className="rounded-[4px] text-xs"
							>
								افتراضي
							</Badge>
						)}
					</TableCell>
					{/* عمود المُحلِّلات — فارغ على مستوى المجموعة الفرعية */}
					<TableCell className="px-3 py-2" />
				</TableRow>

				<TableRow className={cn("grid", cols, "border-b-0 hover:bg-transparent")}>
					<TableCell
						className="col-span-9 p-0"
						colSpan={9}
					>
						<CollapsibleContent>
							<div className="w-full border-border border-b bg-background">
								<Table>
									<TableBody>
										{sub.children.map((item) => (
											<ItemRow
												key={item.id}
												item={item}
												isLab={isLab}
												isRadiology={isRadiology}
												isOperation={isOperation}
											/>
										))}
										{isAdding ? (
											<TableRow className={cn("grid", cols, "hover:bg-muted/20")}>
												<TableCell className="px-3 py-1.5 text-sm">
													<div className="flex items-center gap-2">
														<span
															aria-hidden
															className={LEVEL_SPACER_CLASS}
														/>
														<span
															aria-hidden
															className={LEVEL_SPACER_CLASS}
														/>
														<span
															aria-hidden
															className={ICON_SLOT_CLASS}
														/>
														<Input
															autoFocus
															className="h-7 w-full min-w-[100px] border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/40"
															placeholder="اسم الدورة"
															maxLength={60}
															value={draft.name}
															onChange={(e) =>
																setDraft((d) => ({ ...d, name: e.target.value }))
															}
															onKeyDown={handleKeyDown}
														/>
														<span className="shrink-0 tabular-nums text-xs text-muted-foreground">
															{draft.name.length}/60
														</span>
													</div>
												</TableCell>
												<TableCell className="px-3 py-1.5">
													<Input
														className="h-7 w-full border-0 bg-transparent px-0 text-end font-mono text-sm shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/40"
														placeholder="0"
														type="number"
														min={0}
														value={draft.price}
														onChange={(e) =>
															setDraft((d) => ({ ...d, price: e.target.value }))
														}
														onKeyDown={handleKeyDown}
													/>
												</TableCell>
												<TableCell className="px-3 py-1.5">
													<Input
														className="h-7 w-full border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/40"
														placeholder="دقائق"
														type="number"
														min={0}
														value={draft.duration}
														onChange={(e) =>
															setDraft((d) => ({ ...d, duration: e.target.value }))
														}
														onKeyDown={handleKeyDown}
													/>
												</TableCell>
												<TableCell className="px-3 py-1.5 text-center text-muted-foreground text-sm">
													—
												</TableCell>
												<TableCell className="px-3 py-1.5" />
												<TableCell className="px-3 py-1.5" />
												<TableCell className="px-3 py-1.5">
													<Switch
														size="sm"
														checked={draft.isActive}
														onCheckedChange={(v) => setDraft((d) => ({ ...d, isActive: v }))}
													/>
												</TableCell>
												<TableCell className="px-3 py-1.5">
													<ConfirmDiscard
														onConfirm={handleConfirm}
														onDiscard={handleDiscard}
														disabled={isPending}
														confirmDisabled={isPending || !draft.name.trim()}
													/>
												</TableCell>
												{/* عمود المُحلِّلات — يُضاف بعد حفظ الدورة */}
												<TableCell className="px-3 py-1.5" />
											</TableRow>
										) : (
											<TableRow className={cn("grid", cols, "hover:bg-transparent")}>
												<TableCell
													className="col-span-9 px-3 py-2"
													colSpan={9}
												>
													<div className="flex items-center gap-2">
														<span
															aria-hidden
															className={LEVEL_SPACER_CLASS}
														/>
														<span
															aria-hidden
															className={LEVEL_SPACER_CLASS}
														/>
														<span
															aria-hidden
															className={ICON_SLOT_CLASS}
														/>
														<Button
															variant="outline"
															size="sm"
															className="gap-1.5"
															onClick={() => setIsAdding(true)}
														>
															<IconPlus className="h-3.5 w-3.5" />
															اضف دورة
														</Button>
													</div>
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</div>
						</CollapsibleContent>
					</TableCell>
				</TableRow>
			</TableBody>
		</Collapsible>
	);
}

// ─── Level 1: Category row ────────────────────────────────────────────────────

function CategoryRow({
	category,
	isOpen,
	onOpenChange,
	openSubId,
	onSubOpenChange,
	itemAddToken = 0,
	forceOpen = false,
}: CategoryRowProps) {
	const { variant, cols } = useTableConfig();
	const effectiveOpen = forceOpen || isOpen;
	const [isAdding, setIsAdding] = useState(false);
	const [draftName, setDraftName] = useState("");
	const { createSubcategory, isPending } = useCreateSubcategory();

	const allItems = category.children.flatMap((s) => s.children);
	const totalUsage = allItems.reduce((sum, i) => sum + i.usageCount, 0);
	const maxPopularity =
		allItems.length > 0 ? Math.max(...allItems.map((i) => i.popularityScore)) : null;

	function handleConfirm() {
		if (!draftName.trim() || isPending) return;
		createSubcategory(
			{ categoryId: category.id, name: draftName.trim() },
			{ onSuccess: () => setDraftName("") },
		);
		setIsAdding(false);
	}

	function handleDiscard() {
		setIsAdding(false);
		setDraftName("");
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter") handleConfirm();
		if (e.key === "Escape") handleDiscard();
	}

	const isTwoLevel = variant === "two-level";
	// دورات فئة التحاليل وحدها تعرض زر إدارة المُحلِّلات — والأشعة زر تعريف
	// الفحص — والعمليات الجراحية زر تعريف الإجراء
	const isLab = category.isLabCategory;
	const isRadiology = category.isRadiologyCategory;
	const isOperation = category.isOperationCategory;

	return (
		<Collapsible
			asChild
			open={effectiveOpen}
			onOpenChange={() => onOpenChange(category.id)}
		>
			<TableBody className="[&_tr:last-child]:border-b last:[&_tr:last-child]:border-0">
				<TableRow
					className={cn("grid", cols, "hover:bg-muted/50", effectiveOpen && "border-b-0")}
				>
					<TableCell className="px-3 py-2">
						<div className="flex items-center justify-start gap-2">
							<button
								aria-label={effectiveOpen ? "طي" : "توسيع"}
								className={cn(
									ICON_SLOT_CLASS,
									"text-muted-foreground transition-colors hover:text-foreground",
								)}
								onClick={() => onOpenChange(category.id)}
								type="button"
							>
								{effectiveOpen ? (
									<IconChevronDown className="h-4 w-4" />
								) : (
									<IconChevronRight className="h-4 w-4" />
								)}
							</button>
							<span className="font-semibold text-sm">{category.name}</span>
						</div>
					</TableCell>
					{isTwoLevel ? (
						<>
							<TableCell className="px-3 py-2 text-center font-medium text-sm">
								{category.children.length}
							</TableCell>
							<TableCell className="px-3 py-2 text-center text-sm">
								{maxPopularity !== null ? `${maxPopularity}%` : "—"}
							</TableCell>
							<TableCell className="tabular-nums px-3 py-2 text-center text-sm">
								{totalUsage.toLocaleString()}
							</TableCell>
							<TableCell className="px-3 py-2" />
							<TableCell className="px-3 py-2">
								{category.isDefault && (
									<Badge
										variant="secondary"
										className="rounded-[4px] text-xs"
									>
										افتراضي
									</Badge>
								)}
							</TableCell>
						</>
					) : (
						<>
							<TableCell className="px-3 py-2" />
							<TableCell className="px-3 py-2" />
							<TableCell className="px-3 py-2 text-center font-medium text-sm">
								{category.children.length}
							</TableCell>
							<TableCell className="px-3 py-2 text-center text-sm">
								{maxPopularity !== null ? `${maxPopularity}%` : "—"}
							</TableCell>
							<TableCell className="tabular-nums px-3 py-2 text-center text-sm">
								{totalUsage.toLocaleString()}
							</TableCell>
							<TableCell className="px-3 py-2" />
							<TableCell className="px-3 py-2">
								{category.isDefault && (
									<Badge
										variant="secondary"
										className="rounded-[4px] text-xs"
									>
										افتراضي
									</Badge>
								)}
							</TableCell>
							{/* عمود المُحلِّلات — فارغ على مستوى التصنيف */}
							<TableCell className="px-3 py-2" />
						</>
					)}
				</TableRow>

				<TableRow className={cn("grid", cols, "border-b-0 hover:bg-transparent")}>
					<TableCell
						className={isTwoLevel ? "col-span-6 p-0" : "col-span-9 p-0"}
						colSpan={isTwoLevel ? 6 : 9}
					>
						<CollapsibleContent>
							<div className="w-full border-border border-b bg-muted/10">
								<Table>
									{category.children.map((sub) => (
										<SubcategoryRow
											key={sub.id}
											sub={sub}
											isOpen={openSubId === sub.id}
											onOpenChange={onSubOpenChange}
											itemAddToken={openSubId === sub.id ? itemAddToken : 0}
											forceOpen={forceOpen}
											isLab={isLab}
											isRadiology={isRadiology}
											isOperation={isOperation}
										/>
									))}
									<TableBody>
										{isAdding ? (
											<TableRow className={cn("grid", cols, "hover:bg-muted/20")}>
												<TableCell className="px-3 py-1.5 text-sm">
													<div className="flex items-center gap-2">
														<span
															aria-hidden
															className={LEVEL_SPACER_CLASS}
														/>
														<span
															aria-hidden
															className={ICON_SLOT_CLASS}
														/>
														<Input
															autoFocus
															className="h-7 w-full min-w-[150px] border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/40"
															placeholder="اسم المجموعة الفرعية"
															maxLength={60}
															value={draftName}
															onChange={(e) => setDraftName(e.target.value)}
															onKeyDown={handleKeyDown}
														/>
														<span className="shrink-0 tabular-nums text-xs text-muted-foreground">
															{draftName.length}/60
														</span>
													</div>
												</TableCell>
												{isTwoLevel ? (
													<>
														<TableCell className="px-3 py-1.5" />
														<TableCell className="px-3 py-1.5" />
														<TableCell className="px-3 py-1.5" />
														<TableCell className="px-3 py-1.5" />
														<TableCell className="px-3 py-1.5">
															<ConfirmDiscard
																onConfirm={handleConfirm}
																onDiscard={handleDiscard}
																disabled={isPending}
																confirmDisabled={isPending || !draftName.trim()}
															/>
														</TableCell>
													</>
												) : (
													<>
														<TableCell className="px-3 py-1.5" />
														<TableCell className="px-3 py-1.5" />
														<TableCell className="px-3 py-1.5" />
														<TableCell className="px-3 py-1.5" />
														<TableCell className="px-3 py-1.5" />
														<TableCell className="px-3 py-1.5" />
														<TableCell className="px-3 py-1.5">
															<ConfirmDiscard
																onConfirm={handleConfirm}
																onDiscard={handleDiscard}
																disabled={isPending}
																confirmDisabled={isPending || !draftName.trim()}
															/>
														</TableCell>
														<TableCell className="px-3 py-1.5" />
													</>
												)}
											</TableRow>
										) : (
											<TableRow className={cn("grid", cols, "hover:bg-transparent")}>
												<TableCell
													className={
														isTwoLevel ? "col-span-6 px-3 py-2" : "col-span-9 px-3 py-2"
													}
													colSpan={isTwoLevel ? 6 : 9}
												>
													<div className="flex items-center gap-2">
														<span
															aria-hidden
															className={LEVEL_SPACER_CLASS}
														/>
														<span
															aria-hidden
															className={ICON_SLOT_CLASS}
														/>
														<Button
															variant="outline"
															size="sm"
															className="gap-1.5"
															onClick={() => setIsAdding(true)}
														>
															<IconPlus className="h-3.5 w-3.5" />
															أضف مجموعة فرعية
														</Button>
													</div>
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</div>
						</CollapsibleContent>
					</TableCell>
				</TableRow>
			</TableBody>
		</Collapsible>
	);
}

// ─── Inline category add row ──────────────────────────────────────────────────

function CategoryAddRow({ addToken, onAdded }: CategoryAddRowProps) {
	const { cols, variant } = useTableConfig();
	const colSpan = variant === "full" ? 9 : 6;
	const [isAdding, setIsAdding] = useState(false);
	const [draftName, setDraftName] = useState("");
	const { createCategory, isPending } = useCreateCategory();

	useEffect(() => {
		if (addToken > 0) setIsAdding(true);
	}, [addToken]);

	function handleConfirm() {
		if (!draftName.trim() || isPending) return;
		createCategory({ name: draftName.trim() }, { onSuccess: () => setDraftName("") });
		setIsAdding(false);
		onAdded?.();
	}

	function handleDiscard() {
		setIsAdding(false);
		setDraftName("");
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter") handleConfirm();
		if (e.key === "Escape") handleDiscard();
	}

	if (!isAdding) return null;

	return (
		<TableBody>
			<TableRow className={cn("grid", cols, "hover:bg-muted/20")}>
				<TableCell className="px-3 py-1.5 text-sm">
					<div className="flex items-center gap-2">
						<span
							aria-hidden
							className={ICON_SLOT_CLASS}
						/>
						<Input
							autoFocus
							className="h-7 min-w-[150px] w-full border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/40"
							placeholder="اسم التصنيف"
							maxLength={60}
							value={draftName}
							onChange={(e) => setDraftName(e.target.value)}
							onKeyDown={handleKeyDown}
						/>
						<span className="shrink-0 tabular-nums text-xs text-muted-foreground">
							{draftName.length}/60
						</span>
					</div>
				</TableCell>
				{Array.from({ length: colSpan - 2 }).map((_, i) => (
					<TableCell
						key={i}
						className="px-3 py-1.5"
					/>
				))}
				<TableCell className="px-3 py-1.5">
					<ConfirmDiscard
						onConfirm={handleConfirm}
						onDiscard={handleDiscard}
						disabled={isPending}
						confirmDisabled={isPending || !draftName.trim()}
					/>
				</TableCell>
			</TableRow>
		</TableBody>
	);
}

// ─── Root table ───────────────────────────────────────────────────────────────

export function ServicesTable({ variant = "full", scope = "all" }: ServicesTableProps) {
	const cols = variant === "full" ? FULL_COLS : TWO_LEVEL_COLS;
	const colSpan = variant === "full" ? 9 : 6;
	const config: TableConfig = { variant, cols };

	const { tree: fullTree, isLoading } = useServicesTree();
	// فئتا «التحاليل» و«الأشعة» انتقلتا إلى إعدادات قسمَيهما — كل صفحة تعرض نصيبها
	const tree = useMemo(() => {
		if (scope === "all") return fullTree;
		if (scope === "lab") return fullTree.filter((cat) => cat.isLabCategory);
		if (scope === "radiology") return fullTree.filter((cat) => cat.isRadiologyCategory);
		if (scope === "operations") return fullTree.filter((cat) => cat.isOperationCategory);
		if (scope === "grooming") return fullTree.filter((cat) => cat.isGroomingCategory);
		return fullTree.filter(
			(cat) =>
				!cat.isLabCategory &&
				!cat.isRadiologyCategory &&
				!cat.isOperationCategory &&
				!cat.isGroomingCategory,
		);
	}, [fullTree, scope]);
	const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
	const [openSubId, setOpenSubId] = useState<string | null>(null);
	const [itemAddToken, setItemAddToken] = useState(0);
	const [catAddToken, setCatAddToken] = useState(0);
	const [search, setSearch] = useState("");
	const hasInitialized = useRef(false);
	const isTwoLevel = variant === "two-level";
	const isSearching = search.trim().length > 0;

	const filteredTree = useMemo(() => {
		if (!isSearching) return tree;
		const q = search.toLowerCase();
		if (isTwoLevel) {
			return tree
				.map((cat) => {
					const catMatches = cat.name.toLowerCase().includes(q);
					const matchingSubs = cat.children.filter((sub) =>
						sub.name.toLowerCase().includes(q),
					);
					if (catMatches || matchingSubs.length > 0) {
						return { ...cat, children: catMatches ? cat.children : matchingSubs };
					}
					return null;
				})
				.filter((cat): cat is ServiceCategoryResponse => cat !== null);
		}
		return tree
			.map((cat) => {
				const catMatches = cat.name.toLowerCase().includes(q);
				if (catMatches) return cat;
				const filteredSubs = cat.children
					.map((sub) => {
						const subMatches = sub.name.toLowerCase().includes(q);
						if (subMatches) return sub;
						const matchingItems = sub.children.filter((item) =>
							item.name.toLowerCase().includes(q),
						);
						if (matchingItems.length > 0) return { ...sub, children: matchingItems };
						return null;
					})
					.filter((sub): sub is ServiceSubcategoryResponse => sub !== null);
				if (filteredSubs.length > 0) return { ...cat, children: filteredSubs };
				return null;
			})
			.filter((cat): cat is ServiceCategoryResponse => cat !== null);
	}, [tree, search, isSearching, isTwoLevel]);

	useEffect(() => {
		if (!hasInitialized.current && tree.length > 0) {
			hasInitialized.current = true;
			setOpenCategoryId(tree[0].id);
		}
	}, [tree]);

	function handleCategoryOpen(id: string) {
		setOpenCategoryId((prev) => (prev === id ? null : id));
	}

	function handleSubOpen(id: string) {
		setOpenSubId((prev) => (prev === id ? null : id));
	}

	return (
		<TableConfigContext.Provider value={config}>
			<TableToolbar
				className="border-t"
				searchPlaceholder="ابحث عن بإسم التخصص..."
				searchValue={search}
				onSearchChange={setSearch}
				actions={
					<>
						{/* المجموعة الجديدة تُنشأ خارج فئات «التحاليل» و«الأشعة» و«العمليات»، فلا تظهر في صفحاتها */}
						{scope !== "lab" &&
							scope !== "radiology" &&
							scope !== "operations" &&
							scope !== "grooming" && (
								<Button
									size="sm"
									variant="outline"
									onClick={() => setCatAddToken((t) => t + 1)}
								>
									<IconPlus />
									مجموعة جديدة
								</Button>
							)}
						<Button
							size="sm"
							disabled={openSubId === null}
							onClick={() => setItemAddToken((t) => t + 1)}
						>
							<IconPlus />
							دورة جديدة
						</Button>
					</>
				}
			/>

			<div className="w-full border-y rounded-none border-border bg-card">
				<Table>
					<TableHeader>
						<TableRow className={cn("grid", cols)}>
							<TableHead className="p-3 font-semibold text-foreground text-sm">
								اسم الدورة
							</TableHead>
							{isTwoLevel ? (
								<>
									<TableHead className="p-3 text-center font-semibold text-foreground text-sm">
										فرعي
									</TableHead>
									<TableHead className="p-3 text-center font-semibold text-foreground text-sm">
										الشعبية
									</TableHead>
									<TableHead className="p-3 text-center font-semibold text-foreground text-sm">
										الاستخدامات
									</TableHead>
									<TableHead className="p-3 font-semibold text-foreground text-sm">
										حالة
									</TableHead>
									<TableHead className="p-3 font-semibold text-foreground text-sm">
										تاريخ الانشاء
									</TableHead>
								</>
							) : (
								<>
									<TableHead className="p-3 text-end font-semibold text-foreground text-sm">
										السعر
									</TableHead>
									<TableHead className="p-3 font-semibold text-foreground text-sm">
										المدة
									</TableHead>
									<TableHead className="p-3 text-center font-semibold text-foreground text-sm">
										فرعي
									</TableHead>
									<TableHead className="p-3 text-center font-semibold text-foreground text-sm">
										الشعبية
									</TableHead>
									<TableHead className="p-3 text-center font-semibold text-foreground text-sm">
										الاستخدامات
									</TableHead>
									<TableHead className="p-3 font-semibold text-foreground text-sm">
										حالة
									</TableHead>
									<TableHead className="p-3 font-semibold text-foreground text-sm">
										تاريخ الانشاء
									</TableHead>
									<TableHead className="p-3 font-semibold text-foreground text-sm">
										المُحلِّلات
									</TableHead>
								</>
							)}
						</TableRow>
					</TableHeader>

					{isLoading ? (
						<TableBody>
							{Array.from({ length: 5 }).map((_, i) => (
								<TableRow
									key={i}
									className={cn("grid", cols)}
								>
									<TableCell className="px-3 py-3">
										<Skeleton className="h-4 w-3/4" />
									</TableCell>
									{isTwoLevel ? (
										<>
											<TableCell className="flex justify-center px-3 py-3">
												<Skeleton className="h-4 w-8" />
											</TableCell>
											<TableCell className="flex justify-center px-3 py-3">
												<Skeleton className="h-4 w-8" />
											</TableCell>
											<TableCell className="flex justify-center px-3 py-3">
												<Skeleton className="h-4 w-8" />
											</TableCell>
											<TableCell className="px-3 py-3">
												<Skeleton className="h-4 w-1/2" />
											</TableCell>
											<TableCell className="px-3 py-3">
												<Skeleton className="h-4 w-2/3" />
											</TableCell>
										</>
									) : (
										<>
											<TableCell className="px-3 py-3">
												<Skeleton className="h-4 w-2/3" />
											</TableCell>
											<TableCell className="px-3 py-3">
												<Skeleton className="h-4 w-1/2" />
											</TableCell>
											<TableCell className="flex justify-center px-3 py-3">
												<Skeleton className="h-4 w-8" />
											</TableCell>
											<TableCell className="flex justify-center px-3 py-3">
												<Skeleton className="h-4 w-8" />
											</TableCell>
											<TableCell className="flex justify-center px-3 py-3">
												<Skeleton className="h-4 w-8" />
											</TableCell>
											<TableCell className="px-3 py-3">
												<Skeleton className="h-4 w-1/2" />
											</TableCell>
											<TableCell className="px-3 py-3">
												<Skeleton className="h-4 w-2/3" />
											</TableCell>
											<TableCell className="px-3 py-3">
												<Skeleton className="h-4 w-1/2" />
											</TableCell>
										</>
									)}
								</TableRow>
							))}
						</TableBody>
					) : tree.length === 0 ? (
						<>
							<TableBody>
								<TableRow className={cn("grid", cols)}>
									<TableCell
										className={cn(
											"px-3 py-8 text-center text-muted-foreground text-sm",
											isTwoLevel ? "col-span-6" : "col-span-9",
										)}
										colSpan={colSpan}
									>
										لا توجد دورات
									</TableCell>
								</TableRow>
							</TableBody>
							<CategoryAddRow addToken={catAddToken} />
						</>
					) : filteredTree.length === 0 ? (
						<TableBody>
							<TableRow className={cn("grid", cols)}>
								<TableCell
									className={cn(
										"px-3 py-8 text-center text-muted-foreground text-sm",
										isTwoLevel ? "col-span-6" : "col-span-9",
									)}
									colSpan={colSpan}
								>
									لا توجد نتائج
								</TableCell>
							</TableRow>
						</TableBody>
					) : (
						<>
							{filteredTree.map((category) => (
								<CategoryRow
									key={category.id}
									category={category}
									isOpen={isSearching || openCategoryId === category.id}
									onOpenChange={handleCategoryOpen}
									openSubId={openCategoryId === category.id ? openSubId : null}
									onSubOpenChange={handleSubOpen}
									itemAddToken={openCategoryId === category.id ? itemAddToken : 0}
									forceOpen={isSearching}
								/>
							))}
							<CategoryAddRow addToken={catAddToken} />
						</>
					)}
				</Table>
			</div>
		</TableConfigContext.Provider>
	);
}
