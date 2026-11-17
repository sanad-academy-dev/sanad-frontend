import {
	IconArrowsDiagonal,
	IconCheck,
	IconChevronDown,
	IconChevronLeft,
	IconSearch,
	IconX,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/common/spinner";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import {
	useAssignmentActions,
	useCourseRoster,
	useEligibleLearners,
} from "@/features/services/training/hooks/use-course-assignments";
import { useCourses } from "@/features/services/training/hooks/use-courses";
import { useBranches } from "@/features/settings/branches/hooks/use-branches";
import { getFileUrl } from "@/lib/file-url";
import { cn } from "@/lib/utils";
import type { CourseListItemResponse } from "@sanad/contracts/runtime/server/training/training.type";

const ALL = "__ALL__";

type FilterKey = "all" | "assigned" | "unassigned" | "other";

const FILTER_LABELS: Record<FilterKey, string> = {
	all: "كل الموظفين",
	assigned: "المعينون في هذه الدورة",
	unassigned: "بدون أي دورات",
	other: "معينين في دورات أخرى",
};

function initialsOf(name: string) {
	if (!name) return "—";
	const parts = name.trim().split(/\s+/);
	if (parts.length === 1) return parts[0].slice(0, 2);
	return (parts[0][0] || "") + (parts[1][0] || "");
}

export interface AssignEmployeeDialogProps {
	course: CourseListItemResponse | null;
	onClose: () => void;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

/**
 * شيت تعيين وتعديل الموظفين على الدورات التدريبية
 * مطابقة تماماً لشيت تعيين موظفي المسارات والفصول بالثيم الموحد لمنصة سند
 */
export function AssignEmployeeDialog({
	course,
	onClose,
	open: controlledOpen,
	onOpenChange,
}: AssignEmployeeDialogProps) {
	const isOpen = controlledOpen !== undefined ? controlledOpen : Boolean(course);
	const courseId = course?.id ?? null;

	const { staff, isLoading: isStaffLoading } = useStaff();
	const { courses } = useCourses();
	const { branches } = useBranches();
	const { roster, isLoading: isRosterLoading } = useCourseRoster(courseId);
	const { assignMany, unassign } = useAssignmentActions(courseId);
	const { learners } = useEligibleLearners(courseId);

	const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState<FilterKey>("all");
	const [branchFilter, setBranchFilter] = useState(ALL);
	const [roleFilter, setRoleFilter] = useState(ALL);
	const [isExpanded, setIsExpanded] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// خريطة لمعرفة التعيينات الأصلية لتحديد التعديلات (إضافة / إزالة)
	const initialAssignedMap = useMemo(() => {
		const map = new Map<string, string>(); // staffId -> assignmentId
		for (const r of roster) {
			if (r.staffId) {
				map.set(r.staffId, r.id);
			}
		}
		// أيضاً من assignees كاحتياط
		for (const a of course?.assignees || []) {
			if (a.id && !map.has(a.id)) {
				map.set(a.id, a.id);
			}
		}
		return map;
	}, [roster, course?.assignees]);

	// إعادة ضبط الحالة عند فتح الشيت
	useEffect(() => {
		if (isOpen) {
			const currentIds = Array.from(initialAssignedMap.keys());
			setSelectedStaffIds(currentIds);
			setSearch("");
			setFilter("all");
			setBranchFilter(ALL);
			setRoleFilter(ALL);
		}
	}, [isOpen, initialAssignedMap]);

	// خريطة لتحديد الدورات المرتبطة بكل موظف
	const staffCoursesMap = useMemo(() => {
		const map = new Map<string, CourseListItemResponse[]>();
		for (const c of courses) {
			for (const a of c.assignees || []) {
				const existing = map.get(a.id) || [];
				if (!existing.some((item) => item.id === c.id)) {
					existing.push(c);
					map.set(a.id, existing);
				}
			}
		}
		return map;
	}, [courses]);

	// قائمة الموظفين الفعليين مع دمج بيانات التأهيل والأدوار
	const allStaffList = useMemo(() => {
		if (staff && staff.length > 0) return staff;
		return learners || [];
	}, [staff, learners]);

	// قائمة الأدوار الوظيفية المتاحة للفلترة
	const roleOptions = useMemo(() => {
		const m = new Map<string, string>();
		for (const s of allStaffList) {
			const r = s.role;
			if (r && typeof r === "object" && r.id && r.name) {
				m.set(r.id, r.name);
			}
		}
		return Array.from(m.entries());
	}, [allStaffList]);

	// تصفية الموظفين بناءً على البحث والفلتر والفرع والدور
	const filteredStaff = useMemo(() => {
		const q = search.trim().toLowerCase();

		return allStaffList.filter((s) => {
			// فلتر البحث
			if (q) {
				const nameMatch = s.name?.toLowerCase().includes(q);
				const codeMatch = s.code?.toLowerCase().includes(q);
				const phoneMatch = "phone" in s && s.phone?.includes(q);
				if (!nameMatch && !codeMatch && !phoneMatch) return false;
			}

			// فلتر الفرع
			if (branchFilter !== ALL) {
				const bId = s.branch?.id || (s as { branchId?: string }).branchId;
				if (bId !== branchFilter) return false;
			}

			// فلتر الدور
			if (roleFilter !== ALL) {
				const rId = s.role?.id || (s as { roleId?: string }).roleId;
				if (rId !== roleFilter) return false;
			}

			// تبويب التصفية الأساسي
			const assignedCourses = staffCoursesMap.get(s.id) || [];
			const isAssignedHere = selectedStaffIds.includes(s.id);
			const hasNoCourses = assignedCourses.length === 0;

			if (filter === "assigned") return isAssignedHere;
			if (filter === "unassigned") return hasNoCourses && !isAssignedHere;
			if (filter === "other") return !hasNoCourses && !isAssignedHere;

			return true;
		});
	}, [
		allStaffList,
		search,
		branchFilter,
		roleFilter,
		filter,
		staffCoursesMap,
		selectedStaffIds,
	]);

	const allChecked =
		filteredStaff.length > 0 && filteredStaff.every((s) => selectedStaffIds.includes(s.id));

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

	// إغلاق الشيت
	const handleClose = () => {
		if (onOpenChange) {
			onOpenChange(false);
		} else {
			onClose();
		}
	};

	// حفظ التعيينات
	const handleSave = async () => {
		if (!courseId) {
			handleClose();
			return;
		}

		setIsSubmitting(true);
		try {
			// الموظفون الجدد الذين سيتم تعيينهم
			const toAdd = selectedStaffIds.filter((id) => !initialAssignedMap.has(id));
			// الموظفون الذين تم إلغاء تعيينهم
			const toRemoveStaffIds = Array.from(initialAssignedMap.keys()).filter(
				(id) => !selectedStaffIds.includes(id),
			);

			if (toAdd.length > 0) {
				await assignMany(toAdd);
			}

			if (toRemoveStaffIds.length > 0) {
				for (const sId of toRemoveStaffIds) {
					const assignmentId = initialAssignedMap.get(sId);
					if (assignmentId && assignmentId !== sId) {
						unassign(assignmentId);
					}
				}
			}

			toast.success(`تم حفظ تعيينات المدربين (${selectedStaffIds.length}) بنجاح!`);
			handleClose();
		} catch (_error) {
			toast.error("تعذّر حفظ تعيينات المدربين");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Sheet
			open={isOpen}
			onOpenChange={(o) => !o && handleClose()}
		>
			<SheetContent
				side="left"
				showCloseButton={false}
				className={cn(
					"flex w-full flex-col gap-0 p-0 transition-all duration-300 dark:bg-card z-[9999]",
					isExpanded ? "sm:max-w-[850px]!" : "sm:max-w-[643px]!",
				)}
			>
				{/* 1. الشريط العلوي: مسار التنقل + أزرار التكبير والإغلاق */}
				<div
					className="flex items-center justify-between border-b border-[#E5E5E5] px-4 py-2 dark:border-border"
					dir="rtl"
				>
					<div className="flex items-center gap-1.5">
						<span className="text-[10px] font-bold text-[#08090A] dark:text-foreground">
							الدورات التدريبية
						</span>
						<IconChevronLeft className="size-[9px] text-[#272829] dark:text-muted-foreground" />
						<SheetTitle className="inline-block p-0 m-0 text-[10px] font-bold text-[#08090A] dark:text-foreground">
							تعيين مدربي الدورة
						</SheetTitle>
						{course?.name && (
							<span className="mr-1 text-[10px] font-medium text-muted-foreground truncate max-w-[220px]">
								· {course.name}
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
							onClick={handleClose}
							aria-label="إغلاق"
							className="flex size-[21px] items-center justify-center rounded-[4px] text-[#9B9B9D] hover:bg-muted transition-colors cursor-pointer"
						>
							<IconX className="size-3.5" />
						</button>
					</div>
				</div>

				{/* 2. شريط البحث والفلاتر */}
				<div
					className="flex flex-col gap-2 p-3 border-b border-[#E5E5E5] dark:border-border"
					dir="rtl"
				>
					<div className="flex items-center gap-2">
						{/* حقل البحث */}
						<div className="relative flex-1">
							<IconSearch className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#9B9B9D]" />
							<input
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="بحث باسم الموظف، المعرّف، أو رقم الهاتف..."
								className="h-[29px] w-full rounded-[4px] border border-[#E5E5E5] bg-white pr-8 pl-2 text-right text-[11px] text-[#08090A] outline-none placeholder:text-[#08090A]/50 dark:border-border dark:bg-background dark:text-foreground dark:placeholder:text-muted-foreground"
							/>
						</div>

						{/* فلتر حالة التعيين الموحد */}
						<DropdownMenu dir="rtl">
							<DropdownMenuTrigger asChild>
								<button
									type="button"
									className="flex h-[29px] shrink-0 items-center gap-1.5 rounded-[4px] border border-[#E5E5E5] bg-white px-2.5 text-[11px] font-medium text-[#08090A] cursor-pointer dark:border-border dark:bg-background dark:text-foreground hover:bg-muted/50"
								>
									{FILTER_LABELS[filter]}
									<IconChevronDown className="size-3 text-[#9B9B9D]" />
								</button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="min-w-[150px] p-1"
							>
								{(Object.keys(FILTER_LABELS) as FilterKey[]).map((key) => (
									<DropdownMenuItem
										key={key}
										onSelect={() => setFilter(key)}
										className="h-7 justify-start rounded-[4px] px-2 text-[11px] cursor-pointer"
									>
										{FILTER_LABELS[key]}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					{/* صف فلاتر إضافية: الفرع والقسم */}
					<div className="flex items-center gap-2">
						{branches && branches.length > 0 && (
							<DropdownMenu dir="rtl">
								<DropdownMenuTrigger asChild>
									<button
										type="button"
										className="flex h-[26px] items-center gap-1 rounded-[4px] border border-[#E5E5E5] bg-white px-2 text-[10px] font-medium text-muted-foreground hover:text-foreground cursor-pointer dark:border-border dark:bg-background"
									>
										<span>
											{branchFilter === ALL
												? "كل الفروع"
												: (branches.find((b) => b.id === branchFilter)?.name ?? "فرع محدد")}
										</span>
										<IconChevronDown className="size-2.5 text-[#9B9B9D]" />
									</button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="start"
									className="min-w-[140px] p-1"
								>
									<DropdownMenuItem
										onSelect={() => setBranchFilter(ALL)}
										className="h-6 text-[10.5px] cursor-pointer"
									>
										كل الفروع
									</DropdownMenuItem>
									{branches.map((b) => (
										<DropdownMenuItem
											key={b.id}
											onSelect={() => setBranchFilter(b.id)}
											className="h-6 text-[10.5px] cursor-pointer"
										>
											{b.name}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						)}

						{roleOptions.length > 0 && (
							<DropdownMenu dir="rtl">
								<DropdownMenuTrigger asChild>
									<button
										type="button"
										className="flex h-[26px] items-center gap-1 rounded-[4px] border border-[#E5E5E5] bg-white px-2 text-[10px] font-medium text-muted-foreground hover:text-foreground cursor-pointer dark:border-border dark:bg-background"
									>
										<span>
											{roleFilter === ALL
												? "كل الأقسام"
												: (roleOptions.find(([id]) => id === roleFilter)?.[1] ?? "قسم محدد")}
										</span>
										<IconChevronDown className="size-2.5 text-[#9B9B9D]" />
									</button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="start"
									className="min-w-[140px] p-1"
								>
									<DropdownMenuItem
										onSelect={() => setRoleFilter(ALL)}
										className="h-6 text-[10.5px] cursor-pointer"
									>
										كل الأقسام
									</DropdownMenuItem>
									{roleOptions.map(([id, name]) => (
										<DropdownMenuItem
											key={id}
											onSelect={() => setRoleFilter(id)}
											className="h-6 text-[10.5px] cursor-pointer"
										>
											{name}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						)}

						{(branchFilter !== ALL || roleFilter !== ALL || filter !== "all" || search) && (
							<button
								type="button"
								onClick={() => {
									setSearch("");
									setFilter("all");
									setBranchFilter(ALL);
									setRoleFilter(ALL);
								}}
								className="text-[10px] text-primary hover:underline cursor-pointer mr-auto"
							>
								إعادة تعيين الفلاتر
							</button>
						)}
					</div>
				</div>

				{/* 3. شريط تحديد الكل وإحصاء المحددين */}
				<div
					className="flex items-center justify-between border-b border-[#E5E5E5] px-3 py-2 dark:border-border"
					dir="rtl"
				>
					<div className="flex items-center gap-2">
						<Checkbox
							checked={allChecked}
							onCheckedChange={(c) => toggleAll(c === true)}
							aria-label="تحديد الكل"
							className="size-4 rounded-[4px] border-[1.5px] border-[#E5E5E5] dark:border-border"
						/>
						<span className="text-[10.5px] font-semibold text-[#08090A] dark:text-foreground">
							تحديد الكل ({filteredStaff.length})
						</span>
					</div>

					<span className="text-[10px] font-medium text-muted-foreground">
						محدد: <strong className="text-primary">{selectedStaffIds.length}</strong> موظف
					</span>
				</div>

				{/* 4. قائمة الموظفين */}
				<div
					className="flex min-h-0 flex-1 flex-col gap-[2px] overflow-y-auto px-3 py-2"
					dir="rtl"
				>
					{isStaffLoading || isRosterLoading ? (
						<Spinner containerClassName="py-16 min-h-0" />
					) : filteredStaff.length === 0 ? (
						<div className="py-16 text-center text-xs text-muted-foreground">
							لا يوجد موظفون مطابقون لشروط البحث
						</div>
					) : (
						filteredStaff.map((s) => {
							const isSelected = selectedStaffIds.includes(s.id);
							const isInitiallyAssigned = initialAssignedMap.has(s.id);
							const assignedCourses = staffCoursesMap.get(s.id) || [];
							const hasNoCourses = assignedCourses.length === 0 && !isInitiallyAssigned;

							const roleName =
								typeof s.role === "string" ? s.role : (s.role?.name ?? "موظف الأكاديمية");

							return (
								<button
									type="button"
									key={s.id}
									onClick={() => toggleStaff(s.id)}
									className={cn(
										"flex h-[46px] w-full cursor-pointer items-center justify-between rounded-[4px] px-2 text-right transition-colors hover:bg-[#F9FAFB] dark:hover:bg-muted/40 select-none",
										isSelected && "bg-[#F4F7FF] dark:bg-muted/20",
									)}
								>
									{/* الجانب الأيمن: شيك بوكس + أفاتار + بيانات الموظف */}
									<div className="flex items-center gap-2.5 min-w-0 flex-1">
										<div
											className={cn(
												"size-4 rounded-[4px] border-[1.5px] flex items-center justify-center transition-colors shrink-0",
												isSelected
													? "bg-primary border-primary text-primary-foreground"
													: "border-[#E5E5E5] dark:border-border bg-white dark:bg-background",
											)}
										>
											{isSelected && <IconCheck className="size-3 text-white stroke-[3]" />}
										</div>

										<span className="flex size-[28px] shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white bg-[#4F6AE0] overflow-hidden">
											{s.avatar ? (
												<img
													src={getFileUrl(s.avatar) || s.avatar}
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
											<span className="truncate text-[9.5px] text-[#9B9B9D]">
												{roleName} {s.code ? `· ${s.code}` : ""}
												{s.branch?.name ? ` · ${s.branch.name}` : ""}
											</span>
										</div>
									</div>

									{/* الجانب الأيسر: شارة التعيين والدورات */}
									<div className="flex items-center gap-1.5 shrink-0 pr-2">
										{isInitiallyAssigned ? (
											<span className="shrink-0 rounded-[4px] bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900 px-1.5 py-0.5 text-[8.5px] font-semibold">
												معين بالدورة
											</span>
										) : hasNoCourses ? (
											<span className="shrink-0 rounded-[4px] bg-[#F3E8FF] px-1.5 py-0.5 text-[8.5px] font-semibold text-[#9333EA] dark:bg-purple-950/40 dark:text-purple-300">
												بدون أي دورات
											</span>
										) : (
											<div className="flex items-center gap-1">
												<span
													title={assignedCourses.map((c) => c.name).join(" • ")}
													className="shrink-0 rounded-[4px] bg-[#EDE9FE] text-[#7C3AED] dark:bg-[#7C3AED]/25 dark:text-[#DDD6FE] px-1.5 py-0.5 text-[9px] font-bold truncate max-w-[120px]"
												>
													{assignedCourses[0].name}
												</span>
												{assignedCourses.length > 1 && (
													<span className="shrink-0 rounded-[4px] bg-muted px-1 py-0.5 text-[8.5px] font-bold text-muted-foreground">
														+{assignedCourses.length - 1}
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

				{/* 5. الفوتر */}
				<div
					className="flex items-center justify-between border-t border-[#E5E5E5] px-4 py-2.5 dark:border-border"
					dir="rtl"
				>
					<button
						type="button"
						onClick={handleClose}
						className="flex h-[28px] items-center rounded-[4px] border border-[#E5E5E5] bg-white px-3 text-[11px] font-medium text-[#08090A] hover:bg-muted cursor-pointer transition-colors dark:border-border dark:bg-background dark:text-foreground"
					>
						إلغاء
					</button>

					<button
						type="button"
						disabled={isSubmitting}
						onClick={handleSave}
						className="flex h-[28px] items-center gap-1.5 rounded-[4px] bg-primary px-4 text-[11px] font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 cursor-pointer transition-colors shadow-xs"
					>
						{isSubmitting ? (
							<Spinner className="size-3 text-primary-foreground" />
						) : (
							<IconChevronLeft className="size-3" />
						)}
						حفظ وتعيين ({selectedStaffIds.length})
					</button>
				</div>
			</SheetContent>
		</Sheet>
	);
}

// تصدير باسم بديل للتوافق المباشر
export const AssignCourseStaffSheet = AssignEmployeeDialog;
