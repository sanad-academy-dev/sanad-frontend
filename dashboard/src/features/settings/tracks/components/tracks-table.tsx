"use client";

import {
	IconAlertTriangle,
	IconCompass,
	IconDots,
	IconPlus,
	IconRoute,
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
import { useTrackClassifications } from "../hooks/use-track-classifications";
import type {
	TrackClassificationDraft,
	TrackClassificationItem,
} from "../types/tracks.types";

const COLS = "grid-cols-[240px_1fr_120px_150px_90px_70px]" as const;
const COL_COUNT = 6;
const DRAFT_INITIAL: TrackClassificationDraft = { name: "", description: "" };

interface TrackAddRowProps {
	isAdding: boolean;
	onClose: () => void;
	onAdd: (name: string, description?: string) => Promise<void>;
	isPending: boolean;
}

function TrackAddRow({ isAdding, onClose, onAdd, isPending }: TrackAddRowProps) {
	const [draft, setDraft] = useState<TrackClassificationDraft>(DRAFT_INITIAL);

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
							<IconRoute className="size-4" />
						</span>
						<Input
							autoFocus
							className="h-8 min-w-[140px] w-full border-0 bg-transparent px-1 text-sm font-medium shadow-none focus-visible:ring-1 focus-visible:ring-primary placeholder:text-muted-foreground/50"
							placeholder="اسم المسار التدريبي..."
							maxLength={60}
							value={draft.name}
							onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
							onKeyDown={handleKeyDown}
						/>
					</div>
				</TableCell>
				<TableCell className="px-3 py-2">
					<Input
						className="h-8 w-full border-0 bg-transparent px-1 text-sm text-muted-foreground shadow-none focus-visible:ring-1 focus-visible:ring-primary placeholder:text-muted-foreground/50"
						placeholder="وصف المسار ومجاله التخصصي (اختياري)..."
						maxLength={200}
						value={draft.description}
						onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
						onKeyDown={handleKeyDown}
					/>
				</TableCell>
				<TableCell className="flex items-center justify-center px-3 py-2">
					<span className="text-xs text-muted-foreground">—</span>
				</TableCell>
				<TableCell className="flex items-center justify-center px-3 py-2">
					<span className="text-xs text-muted-foreground">—</span>
				</TableCell>
				<TableCell className="flex items-center justify-center px-3 py-2">
					<span className="text-xs text-muted-foreground">—</span>
				</TableCell>
				<TableCell className="flex items-center justify-center px-3 py-2">
					<ConfirmDiscard
						onConfirm={handleConfirm}
						onDiscard={handleDiscard}
						confirmDisabled={!draft.name.trim() || isPending}
					/>
				</TableCell>
			</TableRow>
		</TableBody>
	);
}

export function TracksTable() {
	const {
		trackClassifications,
		isLoading,
		isAdding,
		isDeleting,
		isUpdating,
		addClassification,
		deleteClassification,
		toggleClassification,
	} = useTrackClassifications();

	const [isAddingRow, setIsAddingRow] = useState(false);
	const [search, setSearch] = useState("");
	const [deletingItem, setDeletingItem] = useState<TrackClassificationItem | null>(null);
	const [itemToDisable, setItemToDisable] = useState<TrackClassificationItem | null>(null);
	const [targetCategory, setTargetCategory] = useState("");

	const otherActiveTracks = useMemo(() => {
		if (!itemToDisable) return [];
		return trackClassifications.filter((t) => t.name !== itemToDisable.name && t.isActive);
	}, [trackClassifications, itemToDisable]);

	const handleToggleClassification = (item: TrackClassificationItem, checked: boolean) => {
		if (!checked && item.tracksCount > 0) {
			setItemToDisable(item);
			setTargetCategory("");
		} else {
			toggleClassification(item.name, checked);
		}
	};

	const handleConfirmDisable = async () => {
		if (!itemToDisable || !targetCategory) return;
		await toggleClassification(itemToDisable.name, false, targetCategory);
		setItemToDisable(null);
		setTargetCategory("");
	};

	const maxUsage = useMemo(() => {
		if (trackClassifications.length === 0) return 10;
		const max = Math.max(...trackClassifications.map((s) => s.usageCount));
		return max > 0 ? max : 10;
	}, [trackClassifications]);

	const isSearching = search.trim().length > 0;
	const filteredTracks = useMemo(() => {
		if (!isSearching) return trackClassifications;
		const q = search.toLowerCase().trim();
		return trackClassifications.filter(
			(s) =>
				s.name.toLowerCase().includes(q) ||
				(s.description && s.description.toLowerCase().includes(q)),
		);
	}, [trackClassifications, search, isSearching]);

	const handleDeleteConfirm = async () => {
		if (!deletingItem) return;
		await deleteClassification(deletingItem.name);
		setDeletingItem(null);
	};

	return (
		<div>
			<TableToolbar
				className="border-t"
				searchPlaceholder="ابحث باسم تصنيف المسار..."
				searchValue={search}
				onSearchChange={setSearch}
				actions={
					<Button
						size="sm"
						onClick={() => setIsAddingRow(true)}
						className="gap-1.5"
					>
						<IconPlus className="size-4" />
						<span>مسار جديد</span>
					</Button>
				}
			/>

			<div className="w-full border-y rounded-none border-border bg-card">
				<Table>
					<TableHeader>
						<TableRow className={cn("grid", COLS)}>
							<TableHead className="p-3 font-semibold text-foreground text-sm">
								اسم المسار
							</TableHead>
							<TableHead className="p-3 font-semibold text-foreground text-sm">
								الوصف
							</TableHead>
							<TableHead className="p-3 text-center font-semibold text-foreground text-sm">
								البرامج التابعة
							</TableHead>
							<TableHead className="p-3 text-center font-semibold text-foreground text-sm">
								إجمالي الطلاب
							</TableHead>
							<TableHead className="p-3 font-semibold text-foreground text-sm text-center">
								الحالة
							</TableHead>
							<TableHead className="p-3 font-semibold text-foreground text-sm text-center">
								إجراءات
							</TableHead>
						</TableRow>
					</TableHeader>

					{/* صف إضافة مسار جديد من الأعلى */}
					<TrackAddRow
						isAdding={isAddingRow}
						onClose={() => setIsAddingRow(false)}
						onAdd={addClassification}
						isPending={isAdding}
					/>

					{isLoading ? (
						<TableBody>
							{Array.from({ length: 6 }).map((_, i) => (
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
										<Skeleton className="h-4 w-16" />
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
					) : trackClassifications.length === 0 && !isAddingRow ? (
						<TableBody>
							<TableRow className={cn("grid", COLS)}>
								<TableCell
									className="col-span-6 px-3 py-10 text-center text-muted-foreground text-sm"
									colSpan={COL_COUNT}
								>
									لا توجد مسارات مسجلة حالياً
								</TableCell>
							</TableRow>
						</TableBody>
					) : filteredTracks.length === 0 && !isAddingRow ? (
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
							{filteredTracks.map((item) => (
								<TableRow
									key={item.id}
									className={cn(
										"grid items-center",
										COLS,
										"hover:bg-muted/40 transition-colors",
										!item.isActive && "opacity-60",
									)}
								>
									{/* اسم المسار */}
									<TableCell className="px-3 py-3">
										<div className="flex items-center gap-2.5">
											<span className="inline-flex size-7 items-center justify-center rounded-lg border border-border/80 bg-muted/40 text-primary shrink-0 shadow-2xs">
												<IconRoute className="size-4" />
											</span>
											<span className="font-semibold text-sm text-foreground">
												{item.name}
											</span>
										</div>
									</TableCell>

									{/* الوصف */}
									<TableCell className="px-3 py-3 text-sm text-muted-foreground truncate">
										{item.description}
									</TableCell>

									{/* البرامج التابعة */}
									<TableCell className="px-3 py-3 text-center">
										<Badge
											variant="secondary"
											className="rounded-md font-mono text-xs px-2 py-0.5"
										>
											{item.tracksCount} مسار
										</Badge>
									</TableCell>

									{/* الطلاب والاستخدام */}
									<TableCell className="px-3 py-3">
										<UsageBar
											value={item.usageCount}
											max={maxUsage}
											unit="طالب"
										/>
									</TableCell>

									{/* الحالة */}
									<TableCell className="px-3 py-3 flex items-center justify-center">
										<Switch
											size="sm"
											checked={item.isActive}
											onCheckedChange={(checked) => handleToggleClassification(item, checked)}
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
													onSelect={() => setDeletingItem(item)}
												>
													<IconTrash className="size-3.5" />
													<span>حذف المسار</span>
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
			<Dialog open={Boolean(deletingItem)} onOpenChange={(open) => !open && setDeletingItem(null)}>
				<DialogContent className="max-w-md" dir="rtl">
					<DialogHeader>
						<DialogTitle>حذف تصنيف المسار</DialogTitle>
						<DialogDescription>
							هل أنت متأكد من حذف تصنيف{" "}
							<span className="font-bold text-foreground">({deletingItem?.name})</span>؟ سيتم فك
							ارتباط المسارات التدريبية الحالية التابعة لهذا التصنيف.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="gap-2 sm:gap-0">
						<Button
							variant="outline"
							onClick={() => setDeletingItem(null)}
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

			{/* بوب أب نقل المسارات قبل التعطيل */}
			<Dialog
				open={Boolean(itemToDisable)}
				onOpenChange={(open) => !open && setItemToDisable(null)}
			>
				<DialogContent className="max-w-md" dir="rtl">
					<DialogHeader className="gap-2">
						<div className="flex items-center gap-2">
							<span className="inline-flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
								<IconAlertTriangle className="size-5" />
							</span>
							<DialogTitle className="text-base font-semibold">
								نقل المسارات التدريبية قبل التعطيل
							</DialogTitle>
						</div>
						<DialogDescription className="text-xs text-muted-foreground leading-relaxed">
							لا يمكن تعطيل تصنيف{" "}
							<span className="font-bold text-foreground">({itemToDisable?.name})</span> لوجود{" "}
							<span className="font-bold text-amber-600 dark:text-amber-400 font-mono">
								({itemToDisable?.tracksCount} مسارات)
							</span>{" "}
							مرتبطة به حالياً. يرجى اختيار تصنيف مسار بديل لنقل المسارات والبرامج التدريبية إليه تلقائياً قبل التعطيل.
						</DialogDescription>
					</DialogHeader>

					<div className="py-3 flex flex-col gap-2.5">
						<label className="text-xs font-semibold text-foreground">
							تصنيف المسار البديل <span className="text-destructive">*</span>
						</label>
						{otherActiveTracks.length > 0 ? (
							<Select
								value={targetCategory}
								onValueChange={setTargetCategory}
								dir="rtl"
							>
								<SelectTrigger className="w-full h-10 text-xs">
									<SelectValue placeholder="اختر تصنيف المسار البديل..." />
								</SelectTrigger>
								<SelectContent dir="rtl" className="max-h-56">
									{otherActiveTracks.map((t) => (
										<SelectItem
											key={t.id}
											value={t.name}
											className="text-xs cursor-pointer py-2"
										>
											<div className="flex items-center justify-between gap-3 w-full">
												<span className="font-medium">{t.name}</span>
												<span className="text-2xs text-muted-foreground font-mono">
													({t.tracksCount} مسار حالياً)
												</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						) : (
							<div className="p-3 text-xs rounded-lg border border-destructive/30 bg-destructive/5 text-destructive">
								لا توجد تصنيفات مسارات نشطة أخرى حالياً لنقل المسارات إليها. يرجى تفعيل أو إنشاء تصنيف آخر أولاً.
							</div>
						)}
					</div>

					<DialogFooter className="gap-2 sm:gap-0">
						<Button
							variant="outline"
							onClick={() => setItemToDisable(null)}
							disabled={isUpdating}
						>
							إلغاء
						</Button>
						<Button
							variant="destructive"
							onClick={handleConfirmDisable}
							disabled={!targetCategory || isUpdating || otherActiveTracks.length === 0}
							className="gap-1.5"
						>
							{isUpdating && <Spinner className="size-4" />}
							<span>نقل المسارات وتعطيل التصنيف</span>
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

