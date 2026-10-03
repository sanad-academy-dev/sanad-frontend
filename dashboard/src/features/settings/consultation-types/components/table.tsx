"use client";

import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { TableToolbar } from "@/components/common/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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
import { useConsultationTypes } from "@/features/settings/consultation-types/hooks/use-consultation-types";
import { useCreateConsultationType } from "@/features/settings/consultation-types/hooks/use-create-consultation-type";
import { useToggleConsultationType } from "@/features/settings/consultation-types/hooks/use-toggle-consultation-type";
import { useUpdateConsultationTypeConfig } from "@/features/settings/consultation-types/hooks/use-update-consultation-type-config";
import { useExamTemplates } from "@/features/settings/exam-templates/hooks/use-exam-templates";
import { formatRelativeDate } from "@/features/settings/utils/format-relative-date";
import { cn } from "@/lib/utils";
import type { ConsultationTypeResponse } from "@/server/consultation-types/consultation-types.type";

const COLS = "grid-cols-[1fr_120px_180px_80px_100px_140px]" as const;

/** «بلا تخصيص» — Radix لا يقبل قيمة فارغة لعنصر اختيار */
const NO_TEMPLATE = "__none__";

// ─── Item row ─────────────────────────────────────────────────────────────────

function TypeRow({ type }: { type: ConsultationTypeResponse }) {
	const { templates } = useExamTemplates();
	const { toggleConsultationType, isPending: togglePending } = useToggleConsultationType();
	const { updateConsultationTypeConfig, isPending: updatePending } =
		useUpdateConsultationTypeConfig();
	const isPending = togglePending || updatePending;

	const [editingPrice, setEditingPrice] = useState(false);
	const [priceValue, setPriceValue] = useState("");

	function startEdit() {
		if (isPending) return;
		setEditingPrice(true);
		setPriceValue(type.price !== null ? String(type.price) : "");
	}

	function cancelEdit() {
		setEditingPrice(false);
		setPriceValue("");
	}

	function commitEdit() {
		const trimmed = priceValue.trim();
		const parsed = trimmed === "" ? null : Number(trimmed);
		updateConsultationTypeConfig(type.id, {
			price: parsed !== null ? Math.max(0, parsed) : null,
		});
		setEditingPrice(false);
		setPriceValue("");
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
		<TableRow className={cn("grid", COLS)}>
			<TableCell className="px-3 py-2 text-sm">{type.name}</TableCell>
			<TableCell
				className={cn(
					"tabular-nums px-3 py-2 text-end font-mono text-sm",
					!isPending && "cursor-text hover:bg-muted/50",
				)}
				onClick={() => !editingPrice && startEdit()}
			>
				{editingPrice ? (
					<Input
						autoFocus
						className="h-6 w-full rounded border bg-background px-1 text-end font-mono text-sm shadow-none focus-visible:ring-0"
						type="number"
						min={0}
						value={priceValue}
						onChange={(e) => setPriceValue(e.target.value)}
						onKeyDown={handleKeyDown}
						onBlur={commitEdit}
					/>
				) : type.price !== null ? (
					`${type.price.toLocaleString()} ر.س`
				) : (
					<span className="text-muted-foreground">—</span>
				)}
			</TableCell>
			<TableCell className="px-3 py-2">
				{/* قالب SOAP الافتراضي لهذا الكشف. «القالب العامّ» = لا تخصيص، فيبقى
				    الترشيح كما كان (مطابقة الشكوى ثم GENERAL_V1). */}
				<Select
					value={type.examTemplateId ?? NO_TEMPLATE}
					disabled={isPending || updatePending}
					onValueChange={(value) =>
						updateConsultationTypeConfig(type.id, {
							examTemplateId: value === NO_TEMPLATE ? null : value,
						})
					}
				>
					<SelectTrigger className="h-8 w-full">
						<SelectValue />
					</SelectTrigger>
					<SelectContent position="popper">
						<SelectItem value={NO_TEMPLATE}>القالب العامّ</SelectItem>
						{templates.map((template) => (
							<SelectItem
								key={template.id}
								value={template.id}
							>
								{template.titleAr}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</TableCell>
			<TableCell className="px-3 py-2">
				<Switch
					size="sm"
					checked={type.active}
					disabled={isPending}
					onCheckedChange={(checked) => toggleConsultationType(type.id, checked)}
				/>
			</TableCell>
			<TableCell className="px-3 py-2">
				{type.isDefault && (
					<Badge
						variant="secondary"
						className="rounded-[4px] text-xs"
					>
						افتراضي
					</Badge>
				)}
			</TableCell>
			<TableCell className="px-3 py-2 text-muted-foreground text-sm">
				{type.isDefault ? "—" : formatRelativeDate(type.createdAt)}
			</TableCell>
		</TableRow>
	);
}

// ─── Inline add row ───────────────────────────────────────────────────────────

function AddRow({ addToken, onAdded }: { addToken: number; onAdded?: () => void }) {
	const [isAdding, setIsAdding] = useState(false);
	const [draftName, setDraftName] = useState("");
	const [draftPrice, setDraftPrice] = useState("");
	const { createConsultationType, isPending } = useCreateConsultationType();

	useEffect(() => {
		if (addToken > 0) setIsAdding(true);
	}, [addToken]);

	function handleConfirm() {
		if (!draftName.trim() || isPending) return;
		const price = draftPrice.trim() === "" ? null : Math.max(0, Number(draftPrice.trim()));
		createConsultationType(
			{ name: draftName.trim(), price: Number.isNaN(price as number) ? null : price },
			{ onSuccess: () => setDraftName("") },
		);
		setIsAdding(false);
		setDraftPrice("");
		onAdded?.();
	}

	function handleDiscard() {
		setIsAdding(false);
		setDraftName("");
		setDraftPrice("");
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
						<Input
							autoFocus
							className="h-7 w-full min-w-[150px] border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/40"
							placeholder="اسم نوع الكشف"
							maxLength={80}
							value={draftName}
							onChange={(e) => setDraftName(e.target.value)}
							onKeyDown={handleKeyDown}
						/>
						<span className="shrink-0 tabular-nums text-xs text-muted-foreground">
							{draftName.length}/80
						</span>
					</div>
				</TableCell>
				<TableCell className="px-3 py-1.5">
					<Input
						className="h-7 w-full border-0 bg-transparent px-0 text-end font-mono text-sm shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/40"
						type="number"
						min={0}
						placeholder="0"
						value={draftPrice}
						onChange={(e) => setDraftPrice(e.target.value)}
						onKeyDown={handleKeyDown}
					/>
				</TableCell>
				{/* قالب الفحص — يُضبط بعد الإنشاء، والخلية موجودة لتبقى الأعمدة الستّة
				    محاذية. صفٌّ بخمس خلايا في شبكة من ستّة يزيح ما بعده عمودًا كاملًا. */}
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
			</TableRow>
		</TableBody>
	);
}

// ─── Root table ───────────────────────────────────────────────────────────────

export function ConsultationTypesTable() {
	const { types, isLoading } = useConsultationTypes();
	const [search, setSearch] = useState("");
	const [addToken, setAddToken] = useState(0);

	const filtered = search.trim()
		? types.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))
		: types;

	return (
		<div>
			<TableToolbar
				className="border-t"
				searchPlaceholder="ابحث عن نوع كشف..."
				searchValue={search}
				onSearchChange={setSearch}
				actions={
					<Button
						size="sm"
						variant="outline"
						onClick={() => setAddToken((t) => t + 1)}
					>
						<IconPlus />
						نوع كشف جديد
					</Button>
				}
			/>

			<div className="w-full border-y rounded-none border-border bg-card">
				<Table>
					<TableHeader>
						<TableRow className={cn("grid", COLS)}>
							<TableHead className="p-3 font-semibold text-foreground text-sm">
								اسم نوع الكشف
							</TableHead>
							<TableHead className="p-3 font-semibold text-foreground text-sm text-end">
								السعر
							</TableHead>
							<TableHead className="p-3 font-semibold text-foreground text-sm">
								قالب الفحص
							</TableHead>
							<TableHead className="p-3 font-semibold text-foreground text-sm">حالة</TableHead>
							<TableHead className="p-3 font-semibold text-foreground text-sm">نوع</TableHead>
							<TableHead className="p-3 font-semibold text-foreground text-sm">
								تاريخ الانشاء
							</TableHead>
						</TableRow>
					</TableHeader>

					{isLoading ? (
						<TableBody>
							{Array.from({ length: 8 }).map((_, i) => (
								<TableRow
									key={i}
									className={cn("grid", COLS)}
								>
									<TableCell className="px-3 py-3">
										<Skeleton className="h-4 w-3/4" />
									</TableCell>
									<TableCell className="px-3 py-3">
										<Skeleton className="h-4 w-16" />
									</TableCell>
									<TableCell className="px-3 py-3">
										<Skeleton className="h-4 w-8" />
									</TableCell>
									<TableCell className="px-3 py-3">
										<Skeleton className="h-4 w-16" />
									</TableCell>
									<TableCell className="px-3 py-3">
										<Skeleton className="h-4 w-1/2" />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					) : filtered.length === 0 ? (
						<TableBody>
							<TableRow className={cn("grid", COLS)}>
								<TableCell
									className="col-span-5 px-3 py-8 text-center text-muted-foreground text-sm"
									colSpan={5}
								>
									{search.trim() ? "لا توجد نتائج" : "لا توجد أنواع كشف"}
								</TableCell>
							</TableRow>
						</TableBody>
					) : (
						<TableBody>
							{filtered.map((type) => (
								<TypeRow
									key={type.id}
									type={type}
								/>
							))}
						</TableBody>
					)}

					<AddRow
						addToken={addToken}
						onAdded={() => setAddToken(0)}
					/>
				</Table>
			</div>
		</div>
	);
}
