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
import { AssignStudentConfirmDialog } from "@/features/services/classrooms/components/assign-student-confirm-dialog";
import { useAssignClassroomStudents } from "@/features/services/classrooms/hooks/use-classroom-mutations";
import { useClassrooms } from "@/features/services/classrooms/hooks/use-classrooms";
import { usePatients } from "@/features/services/patients/hooks/use-patients";
import { cn } from "@/lib/utils";
import type { ClassroomResponse } from "@/server/classrooms/classrooms.type";

export interface AssignStudentDialogProps {
	classroom?: ClassroomResponse | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	initialSelectedStudentIds?: string[];
	onSaveStudents?: (studentIds: string[]) => void;
	classroomName?: string;
	title?: string;
}

type FilterKey = "all" | "assigned" | "unassigned" | "other";

const FILTER_LABELS: Record<FilterKey, string> = {
	all: "كل الطلاب",
	assigned: "المسجلون في هذا الفصل",
	unassigned: "بدون أي فصول",
	other: "مسجلين في فصول أخرى",
};

function initialsOf(name: string) {
	if (!name) return "ط";
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 1) return parts[0].slice(0, 2);
	return (parts[0][0] || "") + (parts[1][0] || "");
}

export function AssignStudentDialog({
	classroom,
	open,
	onOpenChange,
	initialSelectedStudentIds,
	onSaveStudents,
	classroomName,
	title,
}: AssignStudentDialogProps) {
	const { patients, isLoading: isPatientsLoading } = usePatients();
	const { classrooms } = useClassrooms();
	const { mutate: assignStudents, isPending } = useAssignClassroomStudents();

	const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState<FilterKey>("all");
	const [isExpanded, setIsExpanded] = useState(false);
	const [confirmModalOpen, setConfirmModalOpen] = useState(false);

	// كائنات الطلاب المحددين لعرض أفاتاراتهم في البوب أب
	const selectedStudentObjects = useMemo(() => {
		return patients.filter((p) => selectedStudentIds.includes(p.id));
	}, [patients, selectedStudentIds]);

	// مزامنة الطلاب المحددين عند فتح الشيت
	useEffect(() => {
		if (open) {
			if (initialSelectedStudentIds !== undefined) {
				setSelectedStudentIds(initialSelectedStudentIds);
			} else if (classroom) {
				setSelectedStudentIds((classroom.students || []).map((s) => s.id));
			} else {
				setSelectedStudentIds([]);
			}
			setSearch("");
			setFilter("all");
			setConfirmModalOpen(false);
		}
	}, [open, classroom, initialSelectedStudentIds]);

	// خريطة لتحديد الفصول التي ينتمي إليها كل طالب
	const studentClassroomMap = useMemo(() => {
		const map = new Map<string, { classroomName: string; classroomId: string }>();
		for (const c of classrooms) {
			for (const st of c.students || []) {
				map.set(st.id, { classroomName: c.name, classroomId: c.id });
			}
		}
		if (classroom?.students) {
			for (const st of classroom.students) {
				map.set(st.id, { classroomName: classroom.name, classroomId: classroom.id });
			}
		}
		for (const p of patients) {
			if (!map.has(p.id) && p.classroom) {
				const matchingClass = classrooms.find((c) => c.name === p.classroom);
				if (matchingClass) {
					map.set(p.id, { classroomName: matchingClass.name, classroomId: matchingClass.id });
				} else {
					map.set(p.id, { classroomName: p.classroom, classroomId: "" });
				}
			}
		}
		return map;
	}, [classrooms, classroom, patients]);

	// تصفية الطلاب بناءً على البحث والفلتر
	const filteredStudents = useMemo(() => {
		const q = search.trim().toLowerCase();

		return patients.filter((p) => {
			if (q) {
				const nameMatch = p.name?.toLowerCase().includes(q);
				const codeMatch = p.code?.toLowerCase().includes(q);
				const guardianMatch =
					p.guardianName?.toLowerCase().includes(q) ||
					p.owner?.name?.toLowerCase().includes(q);
				const phoneMatch = p.guardianPhone?.includes(q) || p.owner?.phone?.includes(q);

				if (!nameMatch && !codeMatch && !guardianMatch && !phoneMatch) return false;
			}

			const assignedInfo = studentClassroomMap.get(p.id);
			const isAssignedHere = selectedStudentIds.includes(p.id);
			const hasNoClasses = !assignedInfo;

			if (filter === "assigned") return isAssignedHere;
			if (filter === "unassigned") return hasNoClasses && !isAssignedHere;
			if (filter === "other") return !hasNoClasses && !isAssignedHere;

			return true;
		});
	}, [patients, search, filter, studentClassroomMap, selectedStudentIds]);

	const allChecked =
		filteredStudents.length > 0 &&
		filteredStudents.every((p) => selectedStudentIds.includes(p.id));

	const toggleAll = (checked: boolean) => {
		setSelectedStudentIds((prev) => {
			const filteredIds = new Set(filteredStudents.map((p) => p.id));
			if (checked) {
				return Array.from(new Set([...prev, ...filteredIds]));
			}
			return prev.filter((id) => !filteredIds.has(id));
		});
	};

	const toggleStudent = (id: string) => {
		setSelectedStudentIds((prev) =>
			prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id],
		);
	};

	// عند الضغط على "تعيين"، فتح البوب أب فوق السايد شيت
	const handleOpenConfirm = () => {
		if (selectedStudentIds.length === 0) {
			toast.error("يرجى اختيار طالب واحد على الأقل للتعيين");
			return;
		}
		setConfirmModalOpen(true);
	};

	// الحفظ النهائي
	const handleFinalSave = (options: {
		enableMessage: boolean;
		subject: string;
		message: string;
		notifySupervisor: boolean;
	}) => {
		if (onSaveStudents) {
			onSaveStudents(selectedStudentIds);
			setConfirmModalOpen(false);
			onOpenChange(false);
			return;
		}

		if (!classroom?.id) {
			setConfirmModalOpen(false);
			onOpenChange(false);
			return;
		}

		assignStudents(
			{ id: classroom.id, studentIds: selectedStudentIds },
			{
				onSuccess: () => {
					if (options.enableMessage) {
						toast.success(
							`تم تسجيل ${selectedStudentIds.length} طالب وإرسال إشعار لولي الأمر بنجاح!`,
						);
					} else {
						toast.success(`تم تسجيل ${selectedStudentIds.length} طالب في الفصل بنجاح!`);
					}
					setConfirmModalOpen(false);
					onOpenChange(false);
				},
				onError: () => {
					toast.error("حدث خطأ أثناء حفظ تسجيل الطلاب");
				},
			},
		);
	};

	const displayClassName = classroom?.name || classroomName;

	return (
		<>
			<Sheet
				open={open}
				onOpenChange={onOpenChange}
			>
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
								{title || "تعيين طالب"}
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
					<div
						className="flex items-center gap-2 px-3 pt-3"
						dir="rtl"
					>
						<div className="relative flex-1">
							<IconSearch className="pointer-events-none absolute right-2.5 top-1/2 size-2.5 -translate-y-1/2 text-[#9B9B9D]" />
							<input
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="بحث باسم الطالب، المعرف، أو ولي الأمر..."
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
							<DropdownMenuContent
								align="end"
								className="min-w-[130px] p-[3px]"
							>
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
							تحديد الكل ({filteredStudents.length})
						</span>
					</div>

					{/* قائمة الطلاب */}
					<div
						className="flex min-h-0 flex-1 flex-col gap-[1.5px] overflow-y-auto px-3 py-2"
						dir="rtl"
					>
						{isPatientsLoading ? (
							<div className="py-12 text-center text-xs text-muted-foreground">
								جاري تحميل قائمة الطلاب...
							</div>
						) : filteredStudents.length === 0 ? (
							<div className="py-12 text-center text-xs text-muted-foreground">
								لا يوجد طلاب مطابقون للبحث
							</div>
						) : (
							filteredStudents.map((p) => {
								const isSelected = selectedStudentIds.includes(p.id);
								const assignedInfo = studentClassroomMap.get(p.id);
								const hasNoClasses = !assignedInfo;
								const guardian =
									p.owner?.name ||
									p.emergencyContactName ||
									(p as { guardianName?: string | null }).guardianName;
								const avatar = (p as { avatar?: string | null }).avatar;

								return (
									<button
										key={p.id}
										type="button"
										onClick={() => toggleStudent(p.id)}
										className={cn(
											"flex h-[48px] w-full cursor-pointer items-center justify-between rounded-[4px] px-2 text-right transition-colors hover:bg-[#F9FAFB] dark:hover:bg-muted/40",
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
											<span className="flex size-[28px] shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white bg-emerald-500 overflow-hidden shadow-2xs">
												{avatar ? (
													<img
														src={avatar}
														alt={p.name}
														className="size-full object-cover"
													/>
												) : (
													initialsOf(p.name)
												)}
											</span>
											<div className="flex min-w-0 flex-1 flex-col text-right">
												<div className="flex items-center gap-1.5 truncate">
													<span className="truncate text-[11px] font-semibold text-[#08090A] dark:text-foreground">
														{p.name}
													</span>
													<span className="text-[9px] font-mono text-muted-foreground tabular-nums">
														#{p.code || p.id.slice(0, 5)}
													</span>
												</div>
												<span className="truncate text-[9px] text-[#9B9B9D]">
													{guardian ? `ولي الأمر: ${guardian}` : "بدون ولي أمر مسجل"}
													{p.gender === "FEMALE" ? " • أنثى" : " • ذكر"}
													{p.age ? ` • ${p.age} سنوات` : ""}
												</span>
											</div>
										</div>

										{/* الجانب الأيسر: شارات الفصل المسجل به */}
										<div className="flex items-center gap-1.5 shrink-0 pr-2">
											{hasNoClasses ? (
												<span className="shrink-0 rounded-[4px] bg-[#F3E8FF] px-1.5 py-0.5 text-[8.5px] font-semibold text-[#9333EA] dark:bg-purple-950/40 dark:text-purple-300">
													بدون أي فصول
												</span>
											) : assignedInfo.classroomId === classroom?.id ? (
												<span className="shrink-0 rounded-[4px] bg-emerald-50 px-1.5 py-0.5 text-[8.5px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
													في هذا الفصل
												</span>
											) : (
												<span className="shrink-0 rounded-[4px] bg-slate-100 px-1.5 py-0.5 text-[8.5px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
													{assignedInfo.classroomName}
												</span>
											)}
										</div>
									</button>
								);
							})
						)}
					</div>

					{/* الفوتر — إلغاء (يمين) + تعيين (يسار) */}
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
							disabled={isPending || selectedStudentIds.length === 0}
							onClick={handleOpenConfirm}
							className="flex h-[27px] items-center gap-1.5 rounded-[4px] bg-[#4F6AE0] px-3.5 text-[11px] font-semibold text-white hover:bg-[#435bc4] disabled:opacity-50 cursor-pointer transition-colors shadow-xs"
						>
							<IconChevronLeft className="size-2.5" />
							تعيين الطلاب ({selectedStudentIds.length})
						</button>
					</div>
				</SheetContent>
			</Sheet>

			{/* البوب أب التأكيدي يظهر فوق السايد شيت مع بقاء السايد شيت مفتوحاً في الخلفية */}
			<AssignStudentConfirmDialog
				open={confirmModalOpen}
				onOpenChange={setConfirmModalOpen}
				classroom={classroom}
				classroomName={displayClassName}
				selectedStudents={selectedStudentObjects}
				onConfirm={handleFinalSave}
				isPending={isPending}
			/>
		</>
	);
}

export const AssignStudentSheet = AssignStudentDialog;
