"use client";

import {
	IconAlertTriangle,
	IconDots,
	IconPlus,
	IconSchool,
	IconTrash,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { TableToolbar } from "@/components/common/table-toolbar";
import { UsageBar } from "@/components/common/usage-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
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
import { cn } from "@/lib/utils";
import { useAcademicStages } from "../hooks/use-academic-stages";
import type { AcademicStageItem, StageDraft } from "../types/stages.types";

const COLS = "grid-cols-[240px_1fr_120px_90px_70px]" as const;
const COL_COUNT = 5;
const DRAFT_INITIAL: StageDraft = { name: "", description: "" };

interface StageAddRowProps {
	isAdding: boolean;
	onClose: () => void;
	onAdd: (name: string, description?: string) => Promise<void>;
	isPending: boolean;
}

function StageAddRow({ isAdding, onClose, onAdd, isPending }: StageAddRowProps) {
	const [draft, setDraft] = useState<StageDraft>(DRAFT_INITIAL);

	if (!isAdding) return null;

	const handleConfirm = async () => {
		if (!draft.name.trim() || isPending) return;
		try {
			await onAdd(draft.name.trim(), draft.description.trim());
			setDraft(DRAFT_INITIAL);
			onClose();
		} catch {
			// الخطأ يظهر عبر الـ toast الخاص بالـ mutation
		}
	};

	const handleDiscard = () => {
		setDraft(DRAFT_INITIAL);
		onClose();
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") handleConfirm();
		if (e.key === "Escape") handleDiscard();
	};

	return (
		<TableBody>
			<TableRow className={cn("grid", COLS, "bg-muted/20 border-b border-border")}>
				<TableCell className="px-3 py-2 text-sm">
					<div className="flex items-center gap-2">
						<span className="inline-flex size-6 items-center justify-center text-primary shrink-0">
							<IconSchool className="size-4" />
						</span>
						<Input
							autoFocus
							className="h-8 min-w-[140px] w-full border-0 bg-transparent px-1 text-sm font-medium shadow-none focus-visible:ring-1 focus-visible:ring-primary placeholder:text-muted-foreground/50"
							placeholder="اسم المرحلة الدراسية..."
							maxLength={60}
							value={draft.name}
							onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
							onKeyDown={handleKeyDown}
						/>
					</div>
				</TableCell>
				<TableCell className="px-3 py-2">
					<Input
						className="h-8 w-full border-0 bg-transparent px-1 text-sm shadow-none focus-visible:ring-1 focus-visible:ring-primary placeholder:text-muted-foreground/50"
						placeholder="الوصف أو الملاحظات (اختياري)..."
						maxLength={120}
						value={draft.description}
						onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
						onKeyDown={handleKeyDown}
					/>
				</TableCell>
				<TableCell className="px-3 py-2 text-center text-xs text-muted-foreground">—</TableCell>
				<TableCell className="px-3 py-2 text-center text-xs text-muted-foreground">—</TableCell>
				<TableCell className="px-3 py-2 flex items-center justify-center">
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

export function StagesTable() {
	const {
		stages,
		isLoading,
		isAdding,
		isDeleting,
		isUpdating,
		addStage,
		deleteStage,
		toggleStage,
	} = useAcademicStages();

	const [isAddingRow, setIsAddingRow] = useState(false);
	const [search, setSearch] = useState("");
	const [deletingStage, setDeletingStage] = useState<AcademicStageItem | null>(null);
	const [stageToDisable, setStageToDisable] = useState<AcademicStageItem | null>(null);
	const [targetStage, setTargetStage] = useState("");

	const otherActiveStages = useMemo(() => {
		if (!stageToDisable) return [];
		return stages.filter((s) => s.name !== stageToDisable.name && s.isActive);
	}, [stages, stageToDisable]);

	const handleToggleStage = (stage: AcademicStageItem, checked: boolean) => {
		if (!checked && stage.classroomsCount > 0) {
			setStageToDisable(stage);
			setTargetStage("");
		} else {
			toggleStage(stage.name, checked);
		}
	};

	const handleConfirmDisable = async () => {
		if (!stageToDisable || !targetStage) return;
		await toggleStage(stageToDisable.name, false, targetStage);
		setStageToDisable(null);
		setTargetStage("");
	};

	const maxUsage = useMemo(() => {
		if (stages.length === 0) return 10;
		const max = Math.max(...stages.map((s) => s.usageCount));
		return max > 0 ? max : 10;
	}, [stages]);

	const isSearching = search.trim().length > 0;
	const filteredStages = useMemo(() => {
		if (!isSearching) return stages;
		const q = search.toLowerCase().trim();
		return stages.filter(
			(s) =>
				s.name.toLowerCase().includes(q) ||
				(s.description && s.description.toLowerCase().includes(q)),
		);
	}, [stages, search, isSearching]);

	const handleDeleteConfirm = async () => {
		if (!deletingStage) return;
		await deleteStage(deletingStage.name);
		setDeletingStage(null);
	};

	return (
		<div>
			<TableToolbar
				className="border-t"
				searchPlaceholder="ابحث باسم المرحلة التعليمية..."
				searchValue={search}
				onSearchChange={setSearch}
				actions={
					<Button
						size="sm"
						onClick={() => setIsAddingRow(true)}
						className="gap-1.5"
					>
						<IconPlus className="size-4" />
						<span>مرحلة جديدة</span>
					</Button>
				}
			/>

			<div className="w-full border-y rounded-none border-border bg-card">
				<Table>
					<TableHeader>
						<TableRow className={cn("grid", COLS)}>
							<TableHead className="p-3 font-semibold text-foreground text-sm">
								اسم المرحلة التعليمية
							</TableHead>
							<TableHead className="p-3 font-semibold text-foreground text-sm">
								الوصف
							</TableHead>
							<TableHead className="p-3 text-center font-semibold text-foreground text-sm">
								الفصول التابعة
							</TableHead>
							
							<TableHead className="p-3 font-semibold text-foreground text-sm text-center">
								الحالة
							</TableHead>
							<TableHead className="p-3 font-semibold text-foreground text-sm text-center">
								إجراءات
							</TableHead>
						</TableRow>
					</TableHeader>

					{/* صف إضافة مرحلة جديدة من الأعلى */}
					<StageAddRow
						isAdding={isAddingRow}
						onClose={() => setIsAddingRow(false)}
						onAdd={addStage}
						isPending={isAdding}
					/>

					{isLoading ? (
						<TableBody>
							{Array.from({ length: 5 }).map((_, i) => (
								<TableRow key={i} className={cn("grid", COLS)}>
									<TableCell className="px-3 py-3">
										<Skeleton className="h-4 w-3/4" />
									</TableCell>
									<TableCell className="px-3 py-3">
										<Skeleton className="h-4 w-full" />
									</TableCell>
									<TableCell className="flex justify-center px-3 py-3">
										<Skeleton className="h-4 w-12" />
									</TableCell>
									<TableCell className="flex justify-center px-3 py-3">
										<Skeleton className="h-4 w-8" />
									</TableCell>
									<TableCell className="flex justify-center px-3 py-3">
										<Skeleton className="h-4 w-6" />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					) : stages.length === 0 && !isAddingRow ? (
						<TableBody>
							<TableRow className={cn("grid", COLS)}>
								<TableCell
									className="col-span-6 px-3 py-10 text-center text-muted-foreground text-sm"
									colSpan={COL_COUNT}
								>
									لا توجد مراحل دراسية مسجلة حالياً
								</TableCell>
							</TableRow>
						</TableBody> 
					) : filteredStages.length === 0 && !isAddingRow ? (
						<TableBody>
							<TableRow className={cn("grid", COLS)}>
								<TableCell
									className="col-span-6 px-3 py-10 text-center text-muted-foreground text-sm"
									colSpan={COL_COUNT}
								>
									لا توجد نتائج مطابقة لبحثك
								</TableCell>
							</TableRow>
						</TableBody>
					) : (
						<TableBody className="divide-y divide-border/60">
							{filteredStages.map((stage) => (
								<TableRow
									key={stage.id}
									className={cn(
										"grid items-center",
										COLS,
										"hover:bg-muted/40 transition-colors",
										!stage.isActive && "opacity-60",
									)}
								>
									{/* اسم المرحلة */}
									<TableCell className="px-3 py-3">
										<div className="flex items-center gap-2.5">
											<span className="inline-flex size-7 items-center justify-center rounded-lg border border-border/80 bg-muted/40 text-primary shrink-0 shadow-2xs">
												<IconSchool className="size-4" />
											</span>
											<span className="font-semibold text-sm text-foreground">
												{stage.name}
											</span>
										</div>
									</TableCell>

									{/* الوصف */}
									<TableCell className="px-3 py-3 text-sm text-muted-foreground truncate">
										{stage.description}
									</TableCell>

									{/* الفصول التابعة */}
									<TableCell className="px-3 py-3 text-center">
										<Badge
											variant="secondary"
											className="rounded-md font-mono text-xs px-2 py-0.5"
										>
											{stage.classroomsCount} فصول
										</Badge>
									</TableCell>

									{/* شريط الاستخدام */}
									

									{/* الحالة */}
									<TableCell className="px-3 py-3 flex items-center justify-center">
										<Switch
											size="sm"
											checked={stage.isActive}
											onCheckedChange={(checked) => handleToggleStage(stage, checked)}
										/>
									</TableCell>

									{/* الإجراءات */}
									<TableCell className="px-3 py-3 flex items-center justify-center">
										<DropdownMenu dir="rtl">
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="size-7 text-muted-foreground hover:text-foreground"
												>
													<IconDots className="size-3.5" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="start">
												<DropdownMenuItem
													className="gap-2 text-xs text-destructive focus:text-destructive"
													onSelect={() => setDeletingStage(stage)}
												>
													<IconTrash className="size-3.5" />
													<span>حذف المرحلة</span>
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					)}
				</Table>
			</div>

			{/* تأكيد الحذف */}
			<Dialog open={Boolean(deletingStage)} onOpenChange={(open) => !open && setDeletingStage(null)}>
				<DialogContent className="max-w-md" dir="rtl">
					<DialogHeader>
						<DialogTitle>حذف المرحلة الدراسية</DialogTitle>
						<DialogDescription>
							هل أنت متأكد من حذف مرحلة{" "}
							<span className="font-bold text-foreground">({deletingStage?.name})</span>؟ سيتم فك
							ارتباط الفصول الحالية التابعة لهذه المرحلة.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="gap-2 sm:gap-0">
						<Button
							variant="outline"
							onClick={() => setDeletingStage(null)}
						>
							إلغاء
						</Button>
						<Button
							variant="destructive"
							onClick={handleDeleteConfirm}
							disabled={isDeleting}
						>
							تأكيد الحذف
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* بوب أب نقل الفصول قبل التعطيل */}
			<Dialog
				open={Boolean(stageToDisable)}
				onOpenChange={(open) => !open && setStageToDisable(null)}
			>
				<DialogContent className="max-w-md" dir="rtl">
					<DialogHeader className="gap-2">
						<div className="flex items-center gap-2">
							<span className="inline-flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
								<IconAlertTriangle className="size-5" />
							</span>
							<DialogTitle className="text-base font-semibold">
								نقل الفصول الدراسية قبل التعطيل
							</DialogTitle>
						</div>
						<DialogDescription className="text-xs text-muted-foreground leading-relaxed">
							لا يمكن تعطيل مرحلة{" "}
							<span className="font-bold text-foreground">({stageToDisable?.name})</span> لوجود{" "}
							<span className="font-bold text-amber-600 dark:text-amber-400 font-mono">
								({stageToDisable?.classroomsCount} فصول)
							</span>{" "}
							مرتبطة بها حالياً. يرجى اختيار مرحلة دراسية بديلة لنقل الفصول إليها تلقائياً قبل التعطيل.
						</DialogDescription>
					</DialogHeader>

					<div className="py-3 flex flex-col gap-2.5">
						<label className="text-xs font-semibold text-foreground">
							المرحلة الدراسية البديلة <span className="text-destructive">*</span>
						</label>
						{otherActiveStages.length > 0 ? (
							<Select
								value={targetStage}
								onValueChange={setTargetStage}
								dir="rtl"
							>
								<SelectTrigger className="w-full h-10 text-xs">
									<SelectValue placeholder="اختر المرحلة الدراسية البديلة..." />
								</SelectTrigger>
								<SelectContent dir="rtl" className="max-h-56">
									{otherActiveStages.map((s) => (
										<SelectItem
											key={s.id}
											value={s.name}
											className="text-xs cursor-pointer py-2"
										>
											<div className="flex items-center justify-between gap-3 w-full">
												<span className="font-medium">{s.name}</span>
												<span className="text-2xs text-muted-foreground font-mono">
													({s.classroomsCount} فصول حالياً)
												</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						) : (
							<div className="p-3 text-xs rounded-lg border border-destructive/30 bg-destructive/5 text-destructive">
								لا توجد مراحل دراسية نشطة أخرى حالياً لنقل الفصول إليها. يرجى تفعيل أو إنشاء مرحلة أخرى أولاً.
							</div>
						)}
					</div>

					<DialogFooter className="gap-2 sm:gap-0">
						<Button
							variant="outline"
							onClick={() => setStageToDisable(null)}
							disabled={isUpdating}
						>
							إلغاء
						</Button>
						<Button
							variant="destructive"
							onClick={handleConfirmDisable}
							disabled={!targetStage || isUpdating || otherActiveStages.length === 0}
							className="gap-1.5"
						>
							{isUpdating && <Spinner className="size-4" />}
							<span>نقل الفصول وتعطيل المرحلة</span>
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

