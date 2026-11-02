import {
	IconArrowsDiagonal,
	IconChevronDown,
	IconChevronLeft,
	IconSearch,
	IconX,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { cn } from "@/lib/utils";
import { useAssignTrackStaff, useTracks } from "../hooks/use-tracks";
import type { TrackRow } from "./tracks-view";

export interface AssignTrackStaffSheetProps {
	track?: TrackRow | null;
	trackName?: string;
	title?: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	initialSelectedStaffIds?: string[];
	onSaveStaff?: (
		staffIds: string[],
		staffObjects: { id: string; name: string; avatar?: string }[],
	) => void;
	allTracks?: TrackRow[];
}

type FilterKey = "all" | "assigned" | "unassigned" | "other";

const FILTER_LABELS: Record<FilterKey, string> = {
	all: "كل الموظفين",
	assigned: "المعينون في هذا المسار",
	unassigned: "بدون أي مسارات",
	other: "معينين في مسارات أخرى",
};

function initialsOf(name: string) {
	if (!name) return "";
	const parts = name.trim().split(/\s+/);
	if (parts.length === 1) return parts[0].slice(0, 2);
	return (parts[0][0] || "") + (parts[1][0] || "");
}

export function AssignTrackStaffSheet({
	track,
	trackName,
	title,
	open,
	onOpenChange,
	initialSelectedStaffIds,
	onSaveStaff,
	allTracks,
}: AssignTrackStaffSheetProps) {
	const { staff, isLoading: isStaffLoading } = useStaff();
	const { tracks: serverTracks } = useTracks();
	const { mutate: assignStaff, isPending } = useAssignTrackStaff();

	const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState<FilterKey>("all");
	const [isExpanded, setIsExpanded] = useState(false);

	// قائمة المسارات الكاملة لحساب ارتباطات الموظفين بالمسارات الأخرى
	const effectiveTracks = useMemo(() => {
		const list = allTracks || serverTracks || [];
		if (track && !list.some((t) => t.id === track.id)) {
			return [track, ...list];
		}
		return list;
	}, [allTracks, serverTracks, track]);

	// خريطة لتحديد المسارات المرتبطة بكل موظف
	const staffTracksMap = useMemo(() => {
		const map = new Map<string, TrackRow[]>();
		for (const t of effectiveTracks) {
			for (const tr of t.trainers || []) {
				const existing = map.get(tr.id) || [];
				if (!existing.some((item) => item.id === t.id)) {
					existing.push(t);
				}
				map.set(tr.id, existing);
			}
		}
		return map;
	}, [effectiveTracks]);

	// عند فتح الشيت أو تغيير المسار المحدد، نقوم بمزامنة الموظفين المحددين
	useEffect(() => {
		if (open) {
			if (initialSelectedStaffIds !== undefined) {
				setSelectedStaffIds(initialSelectedStaffIds);
			} else if (track) {
				setSelectedStaffIds((track.trainers || []).map((t) => t.id));
			} else {
				setSelectedStaffIds([]);
			}
			setSearch("");
			setFilter("all");
		}
	}, [open, track, initialSelectedStaffIds]);

	// كائنات الموظفين المحددين
	const selectedStaffObjects = useMemo(() => {
		return staff
			.filter((s) => selectedStaffIds.includes(s.id))
			.map((s) => ({
				id: s.id,
				name: s.name,
				avatar: s.avatar || undefined,
			}));
	}, [staff, selectedStaffIds]);

	// تصفية الموظفين بناءً على البحث والفلتر
	const filteredStaff = useMemo(() => {
		const q = search.trim().toLowerCase();

		return staff.filter((s) => {
			if (q) {
				const nameMatch = s.name?.toLowerCase().includes(q);
				const codeMatch = s.code?.toLowerCase().includes(q);
				const phoneMatch = s.phone?.includes(q);
				if (!nameMatch && !codeMatch && !phoneMatch) return false;
			}

			const assignedTracks = staffTracksMap.get(s.id) || [];
			const isAssignedHere = selectedStaffIds.includes(s.id);
			const hasNoTracks = assignedTracks.length === 0;

			if (filter === "assigned") return isAssignedHere;
			if (filter === "unassigned") return hasNoTracks && !isAssignedHere;
			if (filter === "other") return !hasNoTracks && !isAssignedHere;

			return true;
		});
	}, [staff, search, filter, staffTracksMap, selectedStaffIds]);

	const allChecked =
		filteredStaff.length > 0 &&
		filteredStaff.every((s) => selectedStaffIds.includes(s.id));

	const toggleAll = (checked: boolean) => {
		setSelectedStaffIds((prev) => {
			const filteredIds = new Set(filteredStaff.map((s) => s.id));
			if (checked) {
				return Array.from(new Set([...prev, ...filteredIds]));
			}
			return prev.filter((id) => !filteredIds.has(id));
		});
	};

	const toggleStaff = (id: string) => {
		setSelectedStaffIds((prev) =>
			prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id],
		);
	};

	// حفظ التعيينات
	const handleSave = () => {
		if (onSaveStaff) {
			onSaveStaff(selectedStaffIds, selectedStaffObjects);
			onOpenChange(false);
			return;
		}

		if (!track?.id) {
			onOpenChange(false);
			return;
		}

		assignStaff(
			{ id: track.id, staffIds: selectedStaffIds },
			{
				onSuccess: () => {
					toast.success(`تم تعيين ${selectedStaffIds.length} موظف في المسار بنجاح!`);
					onOpenChange(false);
				},
				onError: () => {
					toast.error("حدث خطأ أثناء حفظ تعيينات الموظفين");
				},
			},
		);
	};

	const displayTrackName = track?.name || trackName;

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="left"
				showCloseButton={false}
				className={cn(
					"flex w-full flex-col gap-0 p-0 transition-all duration-300 dark:bg-card z-[9999]",
					isExpanded ? "sm:max-w-[850px]!" : "sm:max-w-[643px]!",
				)}
			>
				{/* الشريط العلوي — مسار التنقل + أزرار التكبير والإغلاق */}
				<div
					className="flex items-center justify-between border-b border-[#E5E5E5] px-4 py-2 dark:border-border"
					dir="rtl"
				>
					<div className="flex items-center gap-1.5">
						<span className="text-[10px] font-bold text-[#08090A] dark:text-foreground">
							المسارات التدريبية
						</span>
						<IconChevronLeft className="size-[9px] text-[#272829] dark:text-muted-foreground" />
						<SheetTitle className="inline-block p-0 m-0 text-[10px] font-bold text-[#08090A] dark:text-foreground">
							{title || "تعيين موظف"}
						</SheetTitle>
						{displayTrackName && (
							<span className="mr-1 text-[10px] font-medium text-muted-foreground truncate max-w-[220px]">
								· {displayTrackName}
							</span>
						)}
					</div>
					<div className="flex items-center gap-1.5">
						<button
							type="button"
							onClick={() => setIsExpanded((prev) => !prev)}
							aria-label={isExpanded ? "تصغير" : "توسيع"}
							className="flex size-[21px] items-center justify-center rounded-[4px] text-[#9B9B9D] hover:bg-muted transition-colors cursor-pointer"
						>
							<IconArrowsDiagonal className="size-3" />
						</button>
						<button
							type="button"
							onClick={() => onOpenChange(false)}
							aria-label="إغلاق"
							className="flex size-[21px] items-center justify-center rounded-[4px] text-[#9B9B9D] hover:bg-muted transition-colors cursor-pointer"
						>
							<IconX className="size-3.5" />
						</button>
					</div>
				</div>

				{/* شريط الفلتر والبحث */}
				<div className="flex items-center gap-2 px-3 pt-3" dir="rtl">
					<div className="relative flex-1">
						<IconSearch className="pointer-events-none absolute right-2.5 top-1/2 size-2.5 -translate-y-1/2 text-[#9B9B9D]" />
						<input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="بحث باسم الموظف أو بالمعرف..."
							className="h-[27px] w-full rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white pr-7 pl-2 text-right text-[10px] text-[#08090A] outline-none placeholder:text-[#08090A]/50 dark:border-border dark:bg-background dark:text-foreground dark:placeholder:text-muted-foreground"
						/>
					</div>

					<DropdownMenu dir="rtl">
						<DropdownMenuTrigger asChild>
							<button
								type="button"
								className="flex h-[27px] shrink-0 items-center gap-1.5 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-2 text-[11px] font-medium text-[#08090A] cursor-pointer dark:border-border dark:bg-background dark:text-foreground hover:bg-muted/50"
							>
								{FILTER_LABELS[filter]}
								<IconChevronDown className="size-2.5 text-[#9B9B9D]" />
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="min-w-[140px] p-[3px]">
							{(Object.keys(FILTER_LABELS) as FilterKey[]).map((key) => (
								<DropdownMenuItem
									key={key}
									onSelect={() => setFilter(key)}
									className="h-6 justify-start rounded-[4px] px-2 text-[11px] cursor-pointer"
								>
									{FILTER_LABELS[key]}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{/* تحديد الكل */}
				<div
					className="flex items-center justify-start gap-2 border-b border-[#E5E5E5] px-3 pt-2 pb-1.5 dark:border-border"
					dir="rtl"
				>
					<Checkbox
						checked={allChecked}
						onCheckedChange={(c) => toggleAll(c === true)}
						aria-label="تحديد الكل"
						className="size-4 rounded-[4px] border-[1.5px] border-[#E5E5E5] dark:border-border"
					/>
					<span className="text-[10px] font-medium text-[#08090A] dark:text-foreground">
						تحديد الكل ({filteredStaff.length})
					</span>
				</div>

				{/* قائمة الموظفين */}
				<div
					className="flex min-h-0 flex-1 flex-col gap-[1.5px] overflow-y-auto px-3 py-2"
					dir="rtl"
				>
					{isStaffLoading ? (
						<div className="py-12 text-center text-xs text-muted-foreground">
							جاري تحميل قائمة الموظفين...
						</div>
					) : filteredStaff.length === 0 ? (
						<div className="py-12 text-center text-xs text-muted-foreground">
							لا يوجد موظفون مطابقون
						</div>
					) : (
						filteredStaff.map((s) => {
							const isSelected = selectedStaffIds.includes(s.id);
							const assignedTracks = staffTracksMap.get(s.id) || [];
							const hasNoTracks = assignedTracks.length === 0;

							const roleName =
								typeof s.role === "string"
									? s.role
									: (s.role?.name ?? "مدرب معتمد");

							return (
								<button
									key={s.id}
									type="button"
									onClick={() => toggleStaff(s.id)}
									className={cn(
										"flex h-[44px] w-full cursor-pointer items-center justify-between rounded-[4px] px-2 text-right transition-colors hover:bg-[#F9FAFB] dark:hover:bg-muted/40",
										isSelected && "bg-[#F4F7FF] dark:bg-muted/20",
									)}
								>
									{/* الجانب الأيمن: مربع الاختيار + الأفاتار + الاسم والبيانات */}
									<div className="flex items-center gap-2 min-w-0 flex-1">
										<Checkbox
											checked={isSelected}
											aria-hidden
											tabIndex={-1}
											className="pointer-events-none size-4 rounded-[4px] border-[1.5px] border-[#E5E5E5] dark:border-border shrink-0"
										/>
										<span className="flex size-[25px] shrink-0 items-center justify-center rounded-full text-[9.5px] font-bold text-white bg-[#4F6AE0] overflow-hidden">
											{s.avatar ? (
												<img
													src={s.avatar}
													alt={s.name}
													className="size-full object-cover"
												/>
											) : (
												initialsOf(s.name)
											)}
										</span>
										<div className="flex min-w-0 flex-1 flex-col text-right">
											<span className="truncate text-[11px] font-semibold text-[#08090A] dark:text-foreground">
												{s.name}
											</span>
											<span className="truncate text-[9px] text-[#9B9B9D]">
												{roleName} {s.code ? `- ${s.code}` : ""}
											</span>
										</div>
									</div>

									{/* الجانب الأيسر: شارات المسارات المرتبطة بالموظف */}
									<div className="flex items-center gap-1.5 shrink-0 pr-2">
										{hasNoTracks ? (
											<span className="shrink-0 rounded-[4px] bg-[#F3E8FF] px-1.5 py-0.5 text-[8.5px] font-semibold text-[#9333EA] dark:bg-purple-950/40 dark:text-purple-300">
												بدون أي مسارات
											</span>
										) : (
											<div className="flex items-center gap-1">
												<span
													title={assignedTracks.map((t) => t.name).join(" • ")}
													className="shrink-0 rounded-[4px] bg-[#EDE9FE] text-[#7C3AED] dark:bg-[#7C3AED]/25 dark:text-[#DDD6FE] px-1.5 py-0.5 text-[9px] font-bold truncate max-w-[130px]"
												>
													{assignedTracks[0].name}
												</span>
												{assignedTracks.length > 1 && (
													<span className="shrink-0 rounded-[4px] bg-muted px-1 py-0.5 text-[8.5px] font-bold text-muted-foreground">
														+{assignedTracks.length - 1}
													</span>
												)}
											</div>
										)}
									</div>
								</button>
							);
						})
					)}
				</div>

				{/* الفوتر — إلغاء (يمين) + حفظ تعيين (يسار) */}
				<div
					className="flex items-center justify-between border-t border-[#E5E5E5] px-4 py-2 dark:border-border"
					dir="rtl"
				>
					<button
						type="button"
						onClick={() => onOpenChange(false)}
						className="flex h-[27px] items-center rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-3 text-[11px] font-medium text-[#08090A] hover:bg-muted cursor-pointer transition-colors dark:border-border dark:bg-background dark:text-foreground"
					>
						إلغاء
					</button>

					<button
						type="button"
						disabled={isPending}
						onClick={handleSave}
						className="flex h-[27px] items-center gap-1.5 rounded-[4px] bg-primary px-3.5 text-[11px] font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 cursor-pointer transition-colors shadow-xs"
					>
						{isPending ? (
							<Spinner className="size-3" />
						) : (
							<IconChevronLeft className="size-2.5" />
						)}
						تعيين ({selectedStaffIds.length})
					</button>
				</div>
			</SheetContent>
		</Sheet>
	);
}

