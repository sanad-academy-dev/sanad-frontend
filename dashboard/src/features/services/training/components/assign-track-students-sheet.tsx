import {
	IconArrowsDiagonal,
	IconCheck,
	IconChevronDown,
	IconChevronLeft,
	IconSchool,
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
import { Switch } from "@/components/ui/switch";
import { AssignStudentConfirmDialog } from "@/features/services/classrooms/components/assign-student-confirm-dialog";
import { usePatients } from "@/features/services/patients/hooks/use-patients";
import { cn } from "@/lib/utils";
import { useAssignTrackStudents, useTrack, useTracks } from "../hooks/use-tracks";
import type { TrackRow } from "./tracks-view";

export interface AssignTrackStudentsSheetProps {
	track?: TrackRow | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	initialSelectedStudentIds?: string[];
	onSaveStudents?: (studentIds: string[]) => void;
}

type FilterKey = "all" | "assigned" | "unassigned" | "other";

const FILTER_LABELS: Record<FilterKey, string> = {
	all: "كل الطلاب",
	assigned: "المسجلون في هذا المسار",
	unassigned: "بدون أي مسارات",
	other: "مسجلين في مسارات أخرى",
};

function initialsOf(name: string) {
	if (!name) return "ط";
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 1) return parts[0].slice(0, 2);
	return (parts[0][0] || "") + (parts[1][0] || "");
}

export function AssignTrackStudentsSheet({
	track,
	open,
	onOpenChange,
	initialSelectedStudentIds,
	onSaveStudents,
}: AssignTrackStudentsSheetProps) {
	const { patients, isLoading: isPatientsLoading } = usePatients();
	const { tracks } = useTracks(undefined, 1, 100, true, open);
	const { track: loadedTrack } = useTrack(track?.id, open);
	const { mutate: assignStudents, isPending } = useAssignTrackStudents();

	const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState<FilterKey>("all");
	const [matchStageOnly, setMatchStageOnly] = useState(true);
	const [isExpanded, setIsExpanded] = useState(false);
	const [confirmModalOpen, setConfirmModalOpen] = useState(false);

	// كائنات الطلاب المحددين لعرض أفاتاراتهم في البوب أب التأكيدي بدقة
	const selectedStudentObjects = useMemo(() => {
		const patientMap = new Map<string, (typeof patients)[number]>();
		for (const p of patients) {
			patientMap.set(p.id, p);
		}

		return selectedStudentIds.map((id) => {
			const p = patientMap.get(id);
			return {
				id,
				name: p?.name || "طالب",
				code: p?.code || id.slice(0, 5),
				avatar: (p as { avatar?: string | null } | undefined)?.avatar || null,
				gender: p?.gender || null,
			};
		});
	}, [patients, selectedStudentIds]);

	// مزامنة الطلاب المحددين عند فتح الشيت
	useEffect(() => {
		if (open) {
			if (initialSelectedStudentIds !== undefined) {
				setSelectedStudentIds(initialSelectedStudentIds);
			} else if (track) {
				setSelectedStudentIds(loadedTrack?.studentIds || track.studentIds || []);
			} else {
				setSelectedStudentIds([]);
			}
			setSearch("");
			setFilter("all");
			setMatchStageOnly(Boolean(track?.academicStage));
			setConfirmModalOpen(false);
		}
	}, [open, track, loadedTrack?.studentIds, initialSelectedStudentIds]);

	// خريطة لتحديد المسارات التي ينتمي إليها كل طالب
	const studentTrackMap = useMemo(() => {
		const map = new Map<string, { trackName: string; trackId: string }>();
		for (const tr of tracks) {
			for (const stId of tr.studentIds || []) {
				map.set(stId, { trackName: tr.name, trackId: tr.id });
			}
			for (const st of tr.students || []) {
				map.set(st.id, { trackName: tr.name, trackId: tr.id });
			}
		}
		if (track?.studentIds) {
			for (const stId of track.studentIds) {
				map.set(stId, { trackName: track.name, trackId: track.id });
			}
		}
		if (track?.students) {
			for (const st of track.students) {
				map.set(st.id, { trackName: track.name, trackId: track.id });
			}
		}
		return map;
	}, [tracks, track]);

	// تصفية الطلاب بناءً على المرحلة الدراسية والبحث والفلتر
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

			const assignedInfo = studentTrackMap.get(p.id);
			const isAssignedHere = selectedStudentIds.includes(p.id);
			const hasNoTracks = !assignedInfo;

			// التحقق من توافق المرحلة الدراسية مع المسار التدريبي
			const trackStage = track?.academicStage;
			if (matchStageOnly && trackStage) {
				const normalizeStage = (value?: string | null) => value?.trim().toLowerCase() || "";
				const matchesStage = normalizeStage(p.academicStage) === normalizeStage(trackStage);
				// نسمح للطالب المسجل بالفعل في هذا المسار بالظهور دائماً، بينما الآخرين يجب مطابقتهم للمرحلة الدراسية
				if (!matchesStage && !isAssignedHere) {
					return false;
				}
			}

			if (filter === "assigned") return isAssignedHere;
			if (filter === "unassigned") return hasNoTracks && !isAssignedHere;
			if (filter === "other") return !hasNoTracks && !isAssignedHere;

			return true;
		});
	}, [patients, search, filter, matchStageOnly, studentTrackMap, selectedStudentIds, track]);

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

	// عند الضغط على "تسجيل"، فتح البوب أب التأكيدي
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

		if (!track?.id) {
			setConfirmModalOpen(false);
			onOpenChange(false);
			return;
		}

		assignStudents(
			{ id: track.id, studentIds: selectedStudentIds },
			{
				onSuccess: () => {
					if (options.enableMessage) {
						toast.success(
							`تم تسجيل ${selectedStudentIds.length} طالب وإرسال إشعار لولي الأمر بنجاح!`,
						);
					} else {
						toast.success(`تم تسجيل ${selectedStudentIds.length} طالب في المسار بنجاح!`);
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
					{/* 1. الشريط العلوي — مسار التنقل + أزرار التكبير والإغلاق */}
					<div
						className="flex items-center justify-between border-b border-[#E5E5E5] px-4 py-2 dark:border-border"
						dir="rtl"
					>
						<div className="flex items-center gap-1.5 flex-wrap">
							<span className="text-[10px] font-bold text-[#08090A] dark:text-foreground">
								المسارات
							</span>
							<IconChevronLeft className="size-[9px] text-[#272829] dark:text-muted-foreground" />
							<SheetTitle className="inline-block p-0 m-0 text-[10px] font-bold text-[#08090A] dark:text-foreground">
								تسجيل طالب
							</SheetTitle>
							{track?.name && (
								<span className="mr-1 text-[10px] font-medium text-muted-foreground">
									· {track.name}
								</span>
							)}
							{track?.academicStage && (
								<span className="mr-1 text-[9px] font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800 px-1.5 py-0.5 rounded-full inline-flex items-center gap-1">
									<IconSchool className="size-2.5" />
									<span>{track.academicStage}</span>
								</span>
							)}
						</div>

						<div className="flex items-center gap-1.5 shrink-0">
							<button
								type="button"
								onClick={() => setIsExpanded((prev) => !prev)}
								aria-label={isExpanded ? "تصغير" : "توسيع"}
								className="flex size-[21px] items-center justify-center rounded-[4px] text-[#9B9B9D] hover:bg-muted transition-colors cursor-pointer"
								title={isExpanded ? "تصغير الشيت" : "توسيع الشيت"}
							>
								<IconArrowsDiagonal className="size-3" />
							</button>
							<button
								type="button"
								onClick={() => onOpenChange(false)}
								aria-label="إغلاق"
								className="flex size-[21px] items-center justify-center rounded-[4px] text-[#9B9B9D] hover:bg-muted transition-colors cursor-pointer"
								title="إغلاق"
							>
								<IconX className="size-3.5" />
							</button>
						</div>
					</div>

					{/* 2. شريط الفلتر والبحث */}
					<div
						className="flex items-center gap-2 px-3 pt-3"
						dir="rtl"
					>
						{/* حقل البحث */}
						<div className="relative flex-1">
							<IconSearch className="pointer-events-none absolute right-2.5 top-1/2 size-2.5 -translate-y-1/2 text-[#9B9B9D]" />
							<input
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="بحث باسم الطالب، المعرف، أو ولي الأمر..."
								className="h-[27px] w-full rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white pr-7 pl-2 text-right text-[10px] text-[#08090A] outline-none placeholder:text-[#08090A]/50 dark:border-border dark:bg-background dark:text-foreground dark:placeholder:text-muted-foreground"
							/>
						</div>

						{/* قائمة تصفية الحالة */}
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

					{/* 3. شريط مطابقة الفئة العمرية وتحديد الكل */}
					<div
						className="flex items-center justify-between border-b border-[#E5E5E5] px-3 pt-2 pb-1.5 dark:border-border text-xs"
						dir="rtl"
					>
						<div className="flex items-center gap-2">
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

						{/* مفتاح تبديل مطابقة المرحلة الدراسية إذا كان المسار محدداً له مرحلة دراسية */}
						{track?.academicStage && (
							<div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
								<span>مطابقة المرحلة الدراسية ({track.academicStage})</span>
								<Switch
									checked={matchStageOnly}
									onCheckedChange={setMatchStageOnly}
									className="scale-75"
								/>
							</div>
						)}
					</div>

					{/* 4. قائمة الطلاب */}
					<div
						className="flex min-h-0 flex-1 flex-col gap-[1.5px] overflow-y-auto px-3 py-2"
						dir="rtl"
					>
						{isPatientsLoading ? (
							<div className="py-12 text-center text-xs text-muted-foreground">
								جاري تحميل قائمة الطلاب...
							</div>
						) : filteredStudents.length === 0 ? (
							<div className="py-12 text-center text-xs text-muted-foreground space-y-1">
								<p>
									{matchStageOnly && track?.academicStage
										? `لا يوجد طلاب مطابقون للمرحلة الدراسية لهذا المسار (${track.academicStage})`
										: "لا يوجد طلاب مطابقون للبحث"}
								</p>
								{matchStageOnly && track?.academicStage && (
									<button
										type="button"
										onClick={() => setMatchStageOnly(false)}
										className="text-primary hover:underline font-semibold cursor-pointer text-[11px]"
									>
										إلغاء قفل المرحلة وعرض كل الطلاب
									</button>
								)}
							</div>
						) : (
							filteredStudents.map((p) => {
								const isSelected = selectedStudentIds.includes(p.id);
								const assignedInfo = studentTrackMap.get(p.id);
								const hasNoTracks = !assignedInfo;
								const guardian =
									p.owner?.name ||
									p.emergencyContactName ||
									(p as { guardianName?: string | null }).guardianName;
								const avatar = (p as { avatar?: string | null }).avatar;

								return (
									<div
										key={p.id}
										role="button"
										tabIndex={0}
										onClick={() => toggleStudent(p.id)}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												e.preventDefault();
												toggleStudent(p.id);
											}
										}}
										className={cn(
											"flex h-[48px] w-full cursor-pointer items-center justify-between rounded-[4px] px-2 text-right transition-colors hover:bg-[#F9FAFB] dark:hover:bg-muted/40",
											isSelected && "bg-[#F4F7FF] dark:bg-muted/20",
										)}
									>
										{/* الجانب الأيمن: مربع الاختيار + الأفاتار + الاسم والبيانات */}
										<div className="flex items-center gap-2 min-w-0 flex-1">
											<div
												className={cn(
													"flex size-4 shrink-0 items-center justify-center rounded-[4px] border-[1.5px] transition-colors",
													isSelected
														? "border-primary bg-primary text-primary-foreground"
														: "border-[#E5E5E5] bg-transparent dark:border-border",
												)}
											>
												{isSelected && <IconCheck className="size-3" />}
											</div>
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
													{" • "}
													<span className="font-semibold text-purple-700 dark:text-purple-300">
														{p.academicStage ? `المرحلة: ${p.academicStage}` : "بدون مرحلة دراسية"}
													</span>
												</span>
											</div>
										</div>

										{/* الجانب الأيسر: شارات المسار المسجل به */}
										<div className="flex items-center gap-1.5 shrink-0 pr-2">
											{hasNoTracks ? (
												<span className="shrink-0 rounded-[4px] bg-[#F3E8FF] px-1.5 py-0.5 text-[8.5px] font-semibold text-[#9333EA] dark:bg-purple-950/40 dark:text-purple-300">
													بدون أي مسارات
												</span>
											) : assignedInfo.trackId === track?.id ? (
												<span className="shrink-0 rounded-[4px] bg-emerald-50 px-1.5 py-0.5 text-[8.5px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
													في هذا المسار
												</span>
											) : (
												<span className="shrink-0 rounded-[4px] bg-slate-100 px-1.5 py-0.5 text-[8.5px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300 max-w-[120px] truncate">
													{assignedInfo.trackName}
												</span>
											)}
										</div>
									</div>
								);
							})
						)}
					</div>

					{/* 5. الفوتر — إلغاء (يمين) + تسجيل (يسار) */}
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
							className="flex h-[27px] items-center gap-1.5 rounded-[4px] bg-primary px-3.5 text-[11px] font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 cursor-pointer transition-colors shadow-xs"
						>
							<IconChevronLeft className="size-2.5" />
							تسجيل الطلاب ({selectedStudentIds.length})
						</button>
					</div>
				</SheetContent>
			</Sheet>

			{/* البوب أب التأكيدي يظهر فوق السايد شيت مع بقاء السايد شيت مفتوحاً في الخلفية */}
			<AssignStudentConfirmDialog
				open={confirmModalOpen}
				onOpenChange={setConfirmModalOpen}
				classroomName={track?.name}
				selectedStudents={selectedStudentObjects}
				onConfirm={handleFinalSave}
				isPending={isPending}
			/>
		</>
	);
}
