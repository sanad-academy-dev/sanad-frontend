"use client";

import { IconChevronDown, IconChevronRight, IconPlus } from "@tabler/icons-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { TableToolbar } from "@/components/common/table-toolbar";
import { UsageBar } from "@/components/common/usage-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
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
import { useCreateSpecializationCategory } from "@/features/settings/specializations/hooks/use-create-specialization-category";
import { useCreateSpecializationSubcategory } from "@/features/settings/specializations/hooks/use-create-specialization-subcategory";
import { useSpecializationsTree } from "@/features/settings/specializations/hooks/use-specializations-tree";
import { useToggleSpecialization } from "@/features/settings/specializations/hooks/use-toggle-specialization";
import type {
	CategoryAddRowProps,
	CategoryRowProps,
	SpecializationDraft,
	SubcategoryRowProps,
} from "@/features/settings/specializations/types/table.types";
import { formatRelativeDate } from "@/features/settings/utils/format-relative-date";
import { cn } from "@/lib/utils";
import type { SpecializationCategoryResponse } from "@/server/specializations/specializations.type";

// ─── Constants ────────────────────────────────────────────────────────────────

const COLS = "grid-cols-[260px_repeat(5,minmax(0,1fr))]" as const;
const COL_COUNT = 6;

const ICON_SLOT_CLASS = "inline-flex h-4 w-4 shrink-0 items-center justify-center" as const;
const LEVEL_SPACER_CLASS = "inline-flex h-4 w-4 shrink-0" as const;

const DRAFT_INITIAL: SpecializationDraft = { name: "", description: "" };

// ─── Level 2: Subcategory row ─────────────────────────────────────────────────

function SubcategoryRow({ sub, maxUsage }: SubcategoryRowProps) {
	const { toggleSpecialization, isPending } = useToggleSpecialization();

	return (
		<TableRow className={cn("grid", COLS)}>
			<TableCell className="px-3 py-2 text-sm">
				<div className="flex items-center gap-2">
					<span
						aria-hidden
						className={LEVEL_SPACER_CLASS}
					/>
					<span
						aria-hidden
						className={ICON_SLOT_CLASS}
					/>
					<span>{sub.name}</span>
				</div>
			</TableCell>
			<TableCell className="px-3 py-2 text-sm text-muted-foreground">
				{sub.description || "—"}
			</TableCell>
			<TableCell className="px-3 py-2 text-center text-sm text-muted-foreground">—</TableCell>
			<TableCell className="px-3 py-2">
				<UsageBar
					count={sub.usageCount}
					max={maxUsage}
				/>
			</TableCell>
			<TableCell className="px-3 py-2">
				<Switch
					size="sm"
					checked={sub.isActive}
					disabled={isPending}
					onCheckedChange={(checked) => toggleSpecialization(sub.id, checked)}
				/>
			</TableCell>
			<TableCell className="px-3 py-2 text-sm text-muted-foreground">
				{sub.clinicId === null ? (
					<Badge
						variant="primary"
						className="rounded-[4px] text-xs"
					>
						افتراضي
					</Badge>
				) : (
					formatRelativeDate(sub.createdAt)
				)}
			</TableCell>
		</TableRow>
	);
}

// ─── Level 1: Category row ────────────────────────────────────────────────────

function CategoryRow({
	category,
	isOpen,
	onOpenChange,
	subAddToken = 0,
	maxUsage,
}: CategoryRowProps) {
	const { toggleSpecialization, isPending } = useToggleSpecialization();
	const [isAdding, setIsAdding] = useState(false);
	const [draft, setDraft] = useState(DRAFT_INITIAL);
	const { createSubcategory, isPending: isCreating } = useCreateSpecializationSubcategory();

	useEffect(() => {
		if (subAddToken > 0) setIsAdding(true);
	}, [subAddToken]);

	function handleConfirm() {
		if (!draft.name.trim() || isCreating) return;
		createSubcategory(
			{
				categoryId: category.id,
				name: draft.name.trim(),
				description: draft.description.trim() || undefined,
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

	return (
		<Collapsible
			asChild
			open={isOpen}
			onOpenChange={() => onOpenChange(category.id)}
		>
			<TableBody className="[&_tr:last-child]:border-b last:[&_tr:last-child]:border-0">
				<TableRow className={cn("grid", COLS, "hover:bg-muted/50", isOpen && "border-b-0")}>
					<TableCell className="px-3 py-2">
						<div className="flex items-center gap-2">
							<button
								aria-label={isOpen ? "طي" : "توسيع"}
								className={cn(
									ICON_SLOT_CLASS,
									"text-muted-foreground transition-colors hover:text-foreground",
								)}
								onClick={() => onOpenChange(category.id)}
								type="button"
							>
								{isOpen ? (
									<IconChevronDown className="h-4 w-4" />
								) : (
									<IconChevronRight className="h-4 w-4" />
								)}
							</button>
							<span className="font-semibold text-sm">{category.name}</span>
						</div>
					</TableCell>
					<TableCell className="px-3 py-2 text-sm text-muted-foreground">
						{category.description || "—"}
					</TableCell>
					<TableCell className="px-3 py-2 text-center font-medium text-sm">
						{category.children.length}
					</TableCell>
					<TableCell className="px-3 py-2">
						<UsageBar
							count={category.usageCount}
							max={maxUsage}
						/>
					</TableCell>
					<TableCell className="px-3 py-2">
						<Switch
							size="sm"
							checked={category.isActive}
							disabled={isPending}
							onCheckedChange={(checked) => toggleSpecialization(category.id, checked)}
						/>
					</TableCell>
					<TableCell className="px-3 py-2 text-sm text-muted-foreground">
						{category.clinicId === null ? (
							<Badge
								variant="secondary"
								className="rounded-[4px] text-xs"
							>
								افتراضي
							</Badge>
						) : (
							formatRelativeDate(category.createdAt)
						)}
					</TableCell>
				</TableRow>

				<TableRow className={cn("grid", COLS, "border-b-0 hover:bg-transparent")}>
					<TableCell
						className="col-span-6 p-0"
						colSpan={COL_COUNT}
					>
						<CollapsibleContent>
							<div className="w-full border-border border-b bg-muted/10">
								<Table>
									<TableBody>
										{category.children.map((sub) => (
											<SubcategoryRow
												key={sub.id}
												sub={sub}
												maxUsage={maxUsage}
											/>
										))}
										{isAdding ? (
											<TableRow className={cn("grid", COLS, "hover:bg-muted/20")}>
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
															className="h-7 w-full min-w-[100px] border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/40"
															placeholder="اسم التخصص الفرعي"
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
														className="h-7 w-full border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/40"
														placeholder="الوصف (اختياري)"
														maxLength={120}
														value={draft.description}
														onChange={(e) =>
															setDraft((d) => ({ ...d, description: e.target.value }))
														}
														onKeyDown={handleKeyDown}
													/>
												</TableCell>
												<TableCell className="px-3 py-1.5" />
												<TableCell className="px-3 py-1.5" />
												<TableCell className="px-3 py-1.5" />
												<TableCell className="px-3 py-1.5">
													<ConfirmDiscard
														onConfirm={handleConfirm}
														onDiscard={handleDiscard}
														disabled={isCreating}
														confirmDisabled={isCreating || !draft.name.trim()}
													/>
												</TableCell>
											</TableRow>
										) : (
											<TableRow className={cn("grid", COLS, "hover:bg-transparent")}>
												<TableCell
													className="col-span-6 px-3 py-2"
													colSpan={COL_COUNT}
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
															أضف تخصصاً فرعياً
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

// ─── Category add row ─────────────────────────────────────────────────────────

function CategoryAddRow({ addToken, onAdded }: CategoryAddRowProps) {
	const [isAdding, setIsAdding] = useState(false);
	const [draft, setDraft] = useState(DRAFT_INITIAL);
	const { createCategory, isPending } = useCreateSpecializationCategory();

	useEffect(() => {
		if (addToken > 0) setIsAdding(true);
	}, [addToken]);

	function handleConfirm() {
		if (!draft.name.trim() || isPending) return;
		createCategory(
			{
				name: draft.name.trim(),
				description: draft.description.trim() || undefined,
			},
			{
				onSuccess: () => {
					setDraft(DRAFT_INITIAL);
					onAdded?.();
				},
			},
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

	if (!isAdding) return null;

	return (
		<TableBody>
			<TableRow className={cn("grid", COLS, "hover:bg-muted/20")}>
				<TableCell className="px-3 py-1.5 text-sm">
					<div className="flex items-center gap-2">
						<span
							aria-hidden
							className={ICON_SLOT_CLASS}
						/>
						<Input
							autoFocus
							className="h-7 min-w-[120px] w-full border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/40"
							placeholder="اسم التصنيف"
							maxLength={60}
							value={draft.name}
							onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
							onKeyDown={handleKeyDown}
						/>
						<span className="shrink-0 tabular-nums text-xs text-muted-foreground">
							{draft.name.length}/60
						</span>
					</div>
				</TableCell>
				<TableCell className="px-3 py-1.5">
					<Input
						className="h-7 w-full border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/40"
						placeholder="الوصف (اختياري)"
						maxLength={120}
						value={draft.description}
						onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
						onKeyDown={handleKeyDown}
					/>
				</TableCell>
				<TableCell className="px-3 py-1.5" />
				<TableCell className="px-3 py-1.5" />
				<TableCell className="px-3 py-1.5" />
				<TableCell className="px-3 py-1.5">
					<ConfirmDiscard
						onConfirm={handleConfirm}
						onDiscard={handleDiscard}
						disabled={isPending}
						confirmDisabled={isPending || !draft.name.trim()}
					/>
				</TableCell>
			</TableRow>
		</TableBody>
	);
}

// ─── Root table ───────────────────────────────────────────────────────────────

export function SpecializationsTable() {
	const { tree, isLoading } = useSpecializationsTree();
	const maxUsage = tree.length
		? Math.max(
				...tree.map((c) => c.usageCount),
				...tree.flatMap((c) => c.children.map((s) => s.usageCount)),
			)
		: 0;
	const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
	const [subAddToken, setSubAddToken] = useState(0);
	const [catAddToken, setCatAddToken] = useState(0);
	const [search, setSearch] = useState("");
	const hasInitialized = useRef(false);
	const isSearching = search.trim().length > 0;

	const filteredTree = useMemo(() => {
		if (!isSearching) return tree;
		const q = search.toLowerCase();
		return tree
			.map((cat) => {
				const catMatches =
					cat.name.toLowerCase().includes(q) ||
					(cat.description?.toLowerCase().includes(q) ?? false);
				const matchingChildren = cat.children.filter(
					(sub) =>
						sub.name.toLowerCase().includes(q) ||
						(sub.description?.toLowerCase().includes(q) ?? false),
				);
				if (catMatches || matchingChildren.length > 0) {
					return { ...cat, children: catMatches ? cat.children : matchingChildren };
				}
				return null;
			})
			.filter((cat): cat is SpecializationCategoryResponse => cat !== null);
	}, [tree, search, isSearching]);

	useEffect(() => {
		if (!hasInitialized.current && tree.length > 0) {
			hasInitialized.current = true;
			setOpenCategoryId(tree[0].id);
		}
	}, [tree]);

	function handleCategoryOpen(id: string) {
		setOpenCategoryId((prev) => (prev === id ? null : id));
	}

	return (
		<div>
			<TableToolbar
				className="border-t"
				searchPlaceholder="ابحث بإسم التخصص..."
				searchValue={search}
				onSearchChange={setSearch}
				actions={
					<>
						<Button
							size="sm"
							variant="outline"
							onClick={() => setCatAddToken((t) => t + 1)}
						>
							<IconPlus />
							تصنيف جديد
						</Button>
						<Button
							size="sm"
							disabled={openCategoryId === null}
							onClick={() => setSubAddToken((t) => t + 1)}
						>
							<IconPlus />
							تخصص فرعي جديد
						</Button>
					</>
				}
			/>

			<div className="w-full border-y rounded-none border-border bg-card">
				<Table>
					<TableHeader>
						<TableRow className={cn("grid", COLS)}>
							<TableHead className="p-3 font-semibold text-foreground text-sm">
								اسم التخصص
							</TableHead>
							<TableHead className="p-3 font-semibold text-foreground text-sm">
								الوصف
							</TableHead>
							<TableHead className="p-3 text-center font-semibold text-foreground text-sm">
								فرعي
							</TableHead>
							<TableHead className="p-3 text-center font-semibold text-foreground text-sm">
								الاستخدامات
							</TableHead>
							<TableHead className="p-3 font-semibold text-foreground text-sm">حالة</TableHead>
							<TableHead className="p-3 font-semibold text-foreground text-sm">
								تاريخ الانشاء
							</TableHead>
						</TableRow>
					</TableHeader>

					{isLoading ? (
						<TableBody>
							{Array.from({ length: 5 }).map((_, i) => (
								<TableRow
									key={i}
									className={cn("grid", COLS)}
								>
									<TableCell className="px-3 py-3">
										<Skeleton className="h-4 w-3/4" />
									</TableCell>
									<TableCell className="px-3 py-3">
										<Skeleton className="h-4 w-full" />
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
								</TableRow>
							))}
						</TableBody>
					) : tree.length === 0 ? (
						<>
							<TableBody>
								<TableRow className={cn("grid", COLS)}>
									<TableCell
										className="col-span-6 px-3 py-8 text-center text-muted-foreground text-sm"
										colSpan={COL_COUNT}
									>
										لا توجد تخصصات
									</TableCell>
								</TableRow>
							</TableBody>
							<CategoryAddRow addToken={catAddToken} />
						</>
					) : filteredTree.length === 0 ? (
						<TableBody>
							<TableRow className={cn("grid", COLS)}>
								<TableCell
									className="col-span-6 px-3 py-8 text-center text-muted-foreground text-sm"
									colSpan={COL_COUNT}
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
									subAddToken={openCategoryId === category.id ? subAddToken : 0}
									maxUsage={maxUsage}
								/>
							))}
							<CategoryAddRow addToken={catAddToken} />
						</>
					)}
				</Table>
			</div>
		</div>
	);
}
