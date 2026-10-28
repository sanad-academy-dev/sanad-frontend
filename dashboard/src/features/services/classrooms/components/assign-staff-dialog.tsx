import {
	IconArrowsDiagonal,
	IconChevronDown,
	IconChevronLeft,
	IconSearch,
	IconX,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { AssignStaffConfirmDialog } from "@/features/services/classrooms/components/assign-staff-confirm-dialog";
import { useAssignClassroomStaff } from "@/features/services/classrooms/hooks/use-classroom-mutations";
import { useClassrooms } from "@/features/services/classrooms/hooks/use-classrooms";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { cn } from "@/lib/utils";
import type { ClassroomResponse } from "@/server/classrooms/classrooms.type";

export interface AssignStaffDialogProps {
	classroom?: ClassroomResponse | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	initialSelectedStaffIds?: string[];
	onSaveStaff?: (staffIds: string[]) => void;
	classroomName?: string;
	title?: string;
}

type FilterKey = "all" | "assigned" | "unassigned" | "other";

const FILTER_LABELS: Record<FilterKey, string> = {
	all: "كل الموظفين",
	assigned: "المعينون في هذا الفصل",
	unassigned: "بدون أي فصول",
	other: "معينين في فصول أخرى",
};

function initialsOf(name: string) {
	if (!name) return "";
	const parts = name.trim().split(/\s+/);
	if (parts.length === 1) return parts[0].slice(0, 2);
	return (parts[0][0] || "") + (parts[1][0] || "");
}

export function AssignStaffDialog({
	classroom,
	open,
	onOpenChange,
	initialSelectedStaffIds,
	onSaveStaff,
	classroomName,
	title,
}: AssignStaffDialogProps) {
	const { staff, isLoading: isStaffLoading } = useStaff();
	const { classrooms } = useClassrooms();
	const { mutate: assignStaff, isPending } = useAssignClassroomStaff();

	const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState<FilterKey>("all");
	const [isExpanded, setIsExpanded] = useState(false);
	const [confirmModalOpen, setConfirmModalOpen] = useState(false);

	// كائنات الموظفين المحددين بالكامل لعرض أفاتاراتهم في البوب أب
	const selectedStaffObjects = useMemo(() => {
		return staff.filter((s) => selectedStaffIds.includes(s.id));
	}, [staff, selectedStaffIds]);

	// عند فتح الشيت أو تغيير الفصل، نقوم بمزامنة الموظفين المحددين وإعادة ضبط البحث
	useEffect(() => {
		if (open) {
			if (initialSelectedStaffIds !== undefined) {
				setSelectedStaffIds(initialSelectedStaffIds);
			} else if (classroom) {
				setSelectedStaffIds((classroom.teachers || []).map((t) => t.id));
			} else {
				setSelectedStaffIds([]);
			}
			setSearch("");
			setFilter("all");
			setConfirmModalOpen(false);
		}
	}, [open, classroom, initialSelectedStaffIds]);

	// خريطة لحساب الفصول ونسبة الطلاب لكل موظف
	const staffStats = useMemo(() => {
		const map = new Map<
			string,
			{ classroomsCount: number; totalStudents: number }
		>();

		for (const c of classrooms) {
			const studentCount = c.enrolledCount ?? c.students?.length ?? 0;
			for (const t of c.teachers ?? []) {
				const current = map.get(t.id) || {
					classroomsCount: 0,
					totalStudents: 0,
				};
				current.classroomsCount += 1;
				current.totalStudents += studentCount;
				map.set(t.id, current);
			}
		}

		return map;
	}, [classrooms]);

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

			const stats = staffStats.get(s.id);
			const isAssignedHere = selectedStaffIds.includes(s.id);
			const hasNoClasses = !stats || stats.classroomsCount === 0;

			if (filter === "assigned") return isAssignedHere;
			if (filter === "unassigned") return hasNoClasses && !isAssignedHere;
			if (filter === "other") return !hasNoClasses && !isAssignedHere;

			return true;
		});
	}, [staff, search, filter, staffStats, selectedStaffIds]);

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

	// عند الضغط على "تعيين"، نفتح البوب أب فوق السايد شيت مع بقاء السايد شيت مفتوحاً في الخلفية
	const handleOpenConfirm = () => {
		if (selectedStaffIds.length === 0) {
			toast.error("يرجى اختيار موظف واحد على الأقل للتعيين");
			return;
		}
		setConfirmModalOpen(true);
	};

	// الحفظ النهائي عند التأكيد من داخل البوب أب
	const handleFinalSave = (options: {
		enableMessage: boolean;
		subject: string;
		message: string;
		notifyManager: boolean;
	}) => {
		if (onSaveStaff) {
			onSaveStaff(selectedStaffIds);
			setConfirmModalOpen(false);
			onOpenChange(false);
			return;
		}

		if (!classroom?.id) {
			setConfirmModalOpen(false);
			onOpenChange(false);
			return;
		}

		assignStaff(
			{ id: classroom.id, staffIds: selectedStaffIds },
			{
				onSuccess: () => {
					if (options.enableMessage) {
						toast.success(`تم تعيين ${selectedStaffIds.length} موظف وإرسال رسالة الإشعار بنجاح!`);
					} else {
						toast.success(`تم تعيين ${selectedStaffIds.length} موظف بنجاح!`);
					}
					setConfirmModalOpen(false);
					onOpenChange(false);
				},
				onError: () => {
					toast.error("حدث خطأ أثناء حفظ التعيينات");
				},
			},
		);
	};

	const displayClassName = classroom?.name || classroomName;

	return (
		<>
			<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="left"
				showCloseButton={false}
				className={cn(
					"flex w-full flex-col gap-0 p-0 transition-all duration-300 dark:bg-card",
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
							الفصول
						</span>
						<IconChevronLeft className="size-[9px] text-[#272829] dark:text-muted-foreground" />
						<SheetTitle className="inline-block p-0 m-0 text-[10px] font-bold text-[#08090A] dark:text-foreground">
							{title || "تعيين موظف"}
						</SheetTitle>
						{displayClassName && (
							<span className="mr-1 text-[10px] font-medium text-muted-foreground">
								· {displayClassName}
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
						<DropdownMenuContent align="end" className="min-w-[130px] p-[3px]">
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
							const stats = staffStats.get(s.id);
							const hasNoClasses = !stats || stats.classroomsCount === 0;
							const ratioVal =
								stats && stats.totalStudents > 0
									? Math.max(
											1,
											Math.round(stats.totalStudents / stats.classroomsCount),
										)
									: 0;

							const roleName =
								typeof s.role === "string"
									? s.role
									: (s.role?.name ?? "معلم");

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
												{roleName} - {s.code || "CHO-1003"}
											</span>
										</div>
									</div>

									{/* الجانب الأيسر: شارات النسبة والفصول */}
									<div className="flex items-center gap-1.5 shrink-0 pr-2">
										{hasNoClasses ? (
											<span className="shrink-0 rounded-[4px] bg-[#F3E8FF] px-1.5 py-0.5 text-[8.5px] font-semibold text-[#9333EA] dark:bg-purple-950/40 dark:text-purple-300">
												بدون أي فصول
											</span>
										) : null}
									</div>
								</button>
							);
						})
					)}
				</div>

				{/* الفوتر — إلغاء (يمين) + حفظ (يسار) */}
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
						disabled={isPending || selectedStaffIds.length === 0}
						onClick={handleOpenConfirm}
						className="flex h-[27px] items-center gap-1.5 rounded-[4px] bg-[#4F6AE0] px-3.5 text-[11px] font-semibold text-white hover:bg-[#435bc4] disabled:opacity-50 cursor-pointer transition-colors shadow-xs"
					>
						<IconChevronLeft className="size-2.5" />
						تعيين ({selectedStaffIds.length})
					</button>
				</div>
			</SheetContent>
		</Sheet>

		{/* البوب أب التأكيدي يظهر فوق السايد شيت مع بقاء السايد شيت مفتوحاً في الخلفية */}
		<AssignStaffConfirmDialog
			open={confirmModalOpen}
			onOpenChange={setConfirmModalOpen}
			classroom={classroom}
			classroomName={displayClassName}
			selectedStaff={selectedStaffObjects}
			onConfirm={handleFinalSave}
			isPending={isPending}
		/>
	</>
);
}

export const AssignStaffSheet = AssignStaffDialog;
