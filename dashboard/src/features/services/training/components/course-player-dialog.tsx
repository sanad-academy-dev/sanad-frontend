import {
	IconCheck,
	IconChevronDown,
	IconChevronLeft,
	IconFileUpload,
	IconX,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { LESSON_TYPE_OPTIONS } from "@/features/services/training/data/training";
import {
	useLessonProgress,
	useMarkLesson,
} from "@/features/services/training/hooks/use-course-assignments";
import { cn } from "@/lib/utils";
import type { AssignmentResponse } from "@/server/course-assignments/course-assignments.type";
import type { CourseDetailResponse, UnitResponse } from "@/server/training/training.type";

type Lesson = UnitResponse["lessons"][number];

const initials = (name: string) =>
	name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase() || "؟";

const lessonTypeLabel = (t: Lesson["type"]) =>
	LESSON_TYPE_OPTIONS.find((o) => o.value === t)?.label ?? t;

// حلقة تقدّم دائرية صغيرة (0..1)
function Ring({ ratio, className }: { ratio: number; className?: string }) {
	const deg = Math.max(0, Math.min(1, ratio)) * 360;
	return (
		<span
			className={cn("size-3.5 shrink-0 rounded-full", className)}
			style={{ background: `conic-gradient(#3B82F6 ${deg}deg, #E5E5E5 0deg)` }}
			aria-hidden
		/>
	);
}

// مشغّل الدورة (Figma node 4422-499951) — حوار متمركز: تفاصيل الدرس + قائمة الوحدات + تنقّل.
export function CoursePlayerDialog({
	course,
	assignment,
	onClose,
}: {
	course: CourseDetailResponse;
	assignment: AssignmentResponse | null;
	onClose: () => void;
}) {
	const { completedLessonIds } = useLessonProgress(assignment?.id ?? null);
	const { markLesson } = useMarkLesson(course.id);

	// كل الدروس بترتيبها عبر الوحدات — للتنقّل السابق/التالي
	const flat = useMemo(
		() => course.units.flatMap((u) => u.lessons.map((l) => ({ lesson: l, unitId: u.id }))),
		[course.units],
	);

	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [expanded, setExpanded] = useState<Set<string>>(() => new Set());

	const selectedIndex = flat.findIndex((f) => f.lesson.id === selectedId);
	const selected = selectedIndex >= 0 ? flat[selectedIndex].lesson : null;

	const totalUnits = course.units.length;
	const unitsDone = course.units.filter(
		(u) => u.lessons.length > 0 && u.lessons.every((l) => completedLessonIds.has(l.id)),
	).length;

	const openLesson = (lesson: Lesson, unitId: string) => {
		setSelectedId(lesson.id);
		setExpanded((prev) => new Set(prev).add(unitId));
	};

	const toggleUnit = (unitId: string) =>
		setExpanded((prev) => {
			const next = new Set(prev);
			next.has(unitId) ? next.delete(unitId) : next.add(unitId);
			return next;
		});

	const goNext = () => {
		if (!assignment) return;
		// لا شيء محدد بعد → ابدأ أول درس
		if (selectedIndex < 0) {
			if (flat[0]) openLesson(flat[0].lesson, flat[0].unitId);
			return;
		}
		// حدّد الدرس الحالي كمكتمل ثم انتقل للتالي
		markLesson({ assignmentId: assignment.id, lessonId: flat[selectedIndex].lesson.id });
		const nxt = flat[selectedIndex + 1];
		if (nxt) openLesson(nxt.lesson, nxt.unitId);
		else onClose(); // اكتملت آخر درس
	};

	const goPrev = () => {
		if (selectedIndex > 0) {
			const prev = flat[selectedIndex - 1];
			openLesson(prev.lesson, prev.unitId);
		}
	};

	const nextLabel = selectedIndex < 0 ? "ابدأ" : "التالي";

	return (
		<Dialog
			open={!!assignment}
			onOpenChange={(next) => !next && onClose()}
		>
			<DialogContent
				showCloseButton={false}
				dir="rtl"
				className="grid h-[88vh] max-h-[88vh] w-[95vw] max-w-[1280px] grid-rows-[auto_1fr_auto] gap-0 rounded-[4px] border-[0.75px] border-[#E5E5E5] p-0 sm:max-w-[1280px]"
				onKeyDown={(e) => {
					if ((e.metaKey || e.ctrlKey) && e.key === "Enter") goNext();
				}}
			>
				{/* الرأس — مسار التنقّل يمينًا (أول عنصر) وزر الإغلاق يسارًا (آخر عنصر) */}
				<div className="flex h-11 items-center justify-between gap-3 border-b border-[#E5E5E5] px-3">
					<div className="flex min-w-0 items-center gap-1.5">
						<span className="shrink-0 text-[10px] font-bold text-[#08090A]">
							الدورات التدريبية
						</span>
						<IconChevronLeft className="size-[9px] shrink-0 text-[#272829]" />
						<span className="truncate text-[10px] font-bold text-[#08090A]">
							{course.name}
						</span>
						<IconChevronLeft className="size-[9px] shrink-0 text-[#272829]" />
						{assignment && (
							<span className="flex shrink-0 items-center gap-1">
								<span className="text-[13px] font-bold text-[#08090A]">
									{assignment.staff.name}
								</span>
								<span className="flex size-[17px] items-center justify-center rounded-full bg-primary text-[9px] text-white">
									{initials(assignment.staff.name)}
								</span>
							</span>
						)}
						<span className="shrink-0 font-mono text-[10px] text-[#9B9B9D]">
							{course.code} ·
						</span>
						<span className="flex shrink-0 items-center gap-1.5">
							<span className="text-[10px] tabular-nums text-[#08090A]">
								{unitsDone}/{totalUnits}
							</span>
							<Ring ratio={totalUnits ? unitsDone / totalUnits : 0} />
						</span>
					</div>

					<button
						type="button"
						onClick={onClose}
						aria-label="إغلاق"
						className="flex size-[21px] shrink-0 items-center justify-center rounded-[4px] text-[#9B9B9D] hover:bg-muted"
					>
						<IconX className="size-3.5" />
					</button>
				</div>

				{/* الجسم — الوحدات يمينًا، تفاصيل الدرس يسارًا */}
				<div className="grid min-h-0 grid-cols-[minmax(0,340px)_1px_minmax(0,1fr)] overflow-hidden">
					{/* عمود الوحدات */}
					<div className="flex flex-col gap-3 overflow-y-auto p-3">
						<div className="flex items-center gap-2">
							<span className="shrink-0 text-[11px] font-semibold text-[#08090A]">
								الوحدات
							</span>
							<span className="h-px flex-1 bg-[#E5E5E5]" />
						</div>

						<div className="flex flex-col gap-2">
							{course.units.map((unit) => {
								const done = unit.lessons.filter((l) => completedLessonIds.has(l.id)).length;
								const isOpen = expanded.has(unit.id);
								return (
									<div
										key={unit.id}
										className="overflow-hidden rounded-[4px] border-[0.75px] border-[#E5E5E5]"
									>
										<button
											type="button"
											onClick={() => toggleUnit(unit.id)}
											className="flex w-full items-center gap-2 bg-[#FAFAFA] px-3 py-2 text-right"
										>
											<IconChevronDown
												className={cn(
													"size-3.5 shrink-0 text-[#9B9B9D] transition-transform",
													!isOpen && "-rotate-90",
												)}
											/>
											<span className="flex items-center gap-1.5">
												<span className="text-[10px] tabular-nums text-[#08090A]">
													{done}/{unit.lessons.length}
												</span>
												<Ring ratio={unit.lessons.length ? done / unit.lessons.length : 0} />
											</span>
											<span className="flex-1 truncate text-[11px] text-[#08090A]">
												{unit.title}
											</span>
										</button>

										{isOpen && unit.lessons.length > 0 && (
											<div className="flex flex-col">
												{unit.lessons.map((lesson) => {
													const isDone = completedLessonIds.has(lesson.id);
													const isActive = lesson.id === selectedId;
													return (
														<button
															key={lesson.id}
															type="button"
															onClick={() => openLesson(lesson, unit.id)}
															className={cn(
																"flex items-center gap-2 border-t border-[#F0F0F0] px-3 py-2 text-right hover:bg-muted/50",
																isActive && "bg-primary/5",
															)}
														>
															<span
																className={cn(
																	"flex size-4 shrink-0 items-center justify-center rounded-full border",
																	isDone
																		? "border-[#3B82F6] bg-[#3B82F6] text-white"
																		: "border-[#D8D8D8] text-transparent",
																)}
															>
																<IconCheck className="size-2.5" />
															</span>
															<span className="flex-1 truncate text-[11px] text-[#08090A]">
																{lesson.title}
															</span>
															<span className="shrink-0 text-[9px] text-[#9B9B9D]">
																{lessonTypeLabel(lesson.type)}
															</span>
														</button>
													);
												})}
											</div>
										)}
									</div>
								);
							})}
							{course.units.length === 0 && (
								<p className="py-8 text-center text-[11px] text-muted-foreground">
									لا توجد وحدات في هذه الدورة بعد.
								</p>
							)}
						</div>
					</div>

					{/* الفاصل الرأسي */}
					<span className="bg-[#E8E8E8]" />

					{/* عمود تفاصيل الدرس */}
					<div className="flex flex-col gap-3 overflow-y-auto p-3">
						<span className="text-right text-[11px] font-semibold text-[#08090A]">
							تفاصيل الدرس
						</span>

						{selected ? (
							<div className="flex flex-col gap-3">
								<div className="flex items-center justify-between gap-2">
									<span className="rounded-[4px] bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
										{lessonTypeLabel(selected.type)}
									</span>
									<h3 className="text-[14px] font-bold text-[#08090A]">{selected.title}</h3>
								</div>
								<div className="min-h-[200px] rounded-[4px] border-[0.75px] border-[#E5E5E5] p-4">
									{selected.content?.trim() ? (
										<p className="whitespace-pre-wrap text-right text-[12px] leading-[22px] text-[#08090A]">
											{selected.content}
										</p>
									) : selected.description?.trim() ? (
										<p className="text-right text-[12px] leading-[22px] text-[#08090A]">
											{selected.description}
										</p>
									) : (
										<p className="text-right text-[12px] text-muted-foreground">
											محتوى هذا الدرس من نوع «{lessonTypeLabel(selected.type)}».
										</p>
									)}
								</div>
							</div>
						) : (
							// الحالة الفارغة — كما في التصميم
							<div className="flex h-[110px] flex-col items-center justify-center gap-3 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-6 py-3">
								<IconFileUpload className="size-6 text-[#08090A]" />
								<div className="flex flex-col items-center gap-2">
									<p className="text-center text-[11px] font-semibold leading-6 text-[#08090A]">
										اضغط على بدء أول درس ليبدأ هنا
									</p>
									<p className="text-center text-[10px] leading-[18px] text-[#6B6B67]">
										بمجرد النقر على «ابدأ» سيبدأ عرض الدرس هنا.
									</p>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* التذييل — حفظ/إلغاء يمينًا، السابق/التالي يسارًا */}
				<div className="flex items-center justify-between gap-3 border-t border-[#E5E5E5] px-3 py-2">
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={onClose}
							className="flex h-[27px] items-center rounded-[4px] border-[0.75px] border-[#E5E5E5] px-[9px] text-[11px] font-medium text-[#08090A] hover:bg-muted"
						>
							حفظ كمسودة
						</button>
						<button
							type="button"
							onClick={onClose}
							className="flex h-[27px] items-center rounded-[4px] border-[0.75px] border-[#E5E5E5] px-[9px] text-[11px] font-medium text-[#08090A] hover:bg-muted"
						>
							إلغاء
						</button>
					</div>

					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={goPrev}
							disabled={selectedIndex <= 0}
							className={cn(
								"flex h-[27px] items-center rounded-[4px] border-[0.75px] border-[#E5E5E5] px-[9px] text-[11px] font-medium text-[#08090A] hover:bg-muted",
								selectedIndex <= 0 && "cursor-not-allowed opacity-50",
							)}
						>
							السابق
						</button>
						<button
							type="button"
							onClick={goNext}
							disabled={flat.length === 0}
							className={cn(
								"flex h-[25.5px] items-center justify-center gap-1.5 rounded-[4px] bg-primary px-3 text-[11px] font-semibold primarytransition-colors hover:bg-primary/90",
								flat.length === 0 && "cursor-not-allowed opacity-40",
							)}
						>
							{nextLabel}
							<span className="rounded-[4px] bg-white/20 px-[3px] py-[1.5px] text-[8px] leading-3 text-white">
								⌘↵
							</span>
						</button>
					</div>
				</div>

				<DialogTitle className="sr-only">مشغّل الدورة — {course.name}</DialogTitle>
			</DialogContent>
		</Dialog>
	);
}
