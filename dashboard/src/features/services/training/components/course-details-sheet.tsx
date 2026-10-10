import {
	IconAlertTriangle,
	IconChevronLeft,
	IconClock,
	IconCoin,
	IconFileDescription,
	IconFileText,
	IconSchool,
	IconStack2,
	IconUser,
	IconUserCircle,
	IconX,
} from "@tabler/icons-react";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
	COURSE_TYPE_OPTIONS,
	courseLocationLabel,
	formatCourseDuration,
	formatTrainingCost,
} from "@/features/services/training/data/training";
import { cn } from "@/lib/utils";
import type { AssignmentResponse } from "@/server/course-assignments/course-assignments.type";
import type { CourseDetailResponse } from "@/server/training/training.type";

const typeLabel = (t: CourseDetailResponse["type"]) =>
	COURSE_TYPE_OPTIONS.find((o) => o.value === t)?.label ?? t;

const initials = (name: string) =>
	name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase() || "؟";

// إجمالي زمن الدروس بالدقائق (مشتقّ من durationSeconds) — «—» عند غيابه
function totalMinutes(course: CourseDetailResponse) {
	const secs = course.units.reduce(
		(sum, u) => sum + u.lessons.reduce((s, l) => s + (l.durationSeconds ?? 0), 0),
		0,
	);
	return secs > 0 ? Math.round(secs / 60) : null;
}

// شارة إحصائية علوية: الوسم وأيقونته (يمين) + القيمة (يسار)
function StatChip({
	value,
	label,
	icon,
}: {
	value: string;
	label: string;
	icon?: React.ReactNode;
}) {
	return (
		// grow بدل flex-1: عرض الشارة لا يقلّ عن محتواها فيبقى النص على سطر واحد،
		// وإن ضاق الصف تنزل الشارة كاملة لسطر جديد (الحاوي flex-wrap) بدل أن يلتفّ نصّها.
		<div className="flex h-[37px] grow items-center justify-between gap-2 whitespace-nowrap rounded-[4px] border border-[#E5E5E5] px-3">
			<span className="flex shrink-0 items-center gap-1 text-[10px] font-medium text-[#08090A]">
				{icon}
				{label}
			</span>
			<span className="shrink-0 text-[11px] font-bold text-[#08090A]">{value}</span>
		</div>
	);
}

// صف تفاصيل: الوسم + الأيقونة (يمين) والقيمة (يسار)
function DetailRow({
	label,
	value,
	icon,
}: {
	label: string;
	value: string;
	icon: React.ReactNode;
}) {
	return (
		<div className="flex items-center justify-between gap-2 py-1">
			<span className="flex items-center gap-1.5 text-[14px] text-[#737373]">
				{icon}
				{label}
			</span>
			<span className="text-[14px] font-medium text-[#08090A]">{value}</span>
		</div>
	);
}

// التعليمات الثابتة (لا يوجد حقل إرشادات في نموذج الدورة بعد)
const INSTRUCTIONS = [
	"اقرأ محتوى كل وحدة بعناية وتأكد من فهمها قبل الانتقال إلى التالية.",
	"تابع دروس الدورة بالترتيب لضمان تسلسل التعلّم الصحيح.",
	"لا يوجد وقت محدد للإكمال — خذ الوقت الكافي لتغطية المادة.",
	"يتم حفظ تقدّمك تلقائيًا أثناء الدورة — يمكنك الاستكمال لاحقًا.",
	"عند إكمال الدورة سيتم توليد تقرير وتوصيات وشهادة الإتمام (إن كانت مفعّلة).",
];

// لوحة تفاصيل الدورة التدريبية (Figma node 4421-496773) — تنزلق من اليسار عند بدء/استكمال الدورة.
export function CourseDetailsSheet({
	course,
	assignment,
	onClose,
	onStart,
	isStarting,
}: {
	course: CourseDetailResponse;
	assignment: AssignmentResponse | null;
	onClose: () => void;
	onStart: (assignmentId: string) => void;
	isStarting: boolean;
}) {
	const minutes = totalMinutes(course);
	const duration = formatCourseDuration(
		course.startDate,
		course.dueDate,
		course.estimatedDurationWeeks,
	);
	const cost = formatTrainingCost(course.trainingCost);
	const trainerName = course.trainers[0]?.staff.name ?? "—";
	const status = assignment?.status;
	const primaryLabel =
		status === "COMPLETED"
			? "عرض النتيجة"
			: status === "IN_PROGRESS"
				? "استكمال الدورة"
				: "بدء الدورة";

	const onPrimary = () => {
		if (!assignment) return;
		if (status === "COMPLETED") {
			onClose();
			return;
		}
		onStart(assignment.id);
	};

	return (
		<Sheet
			open={!!assignment}
			onOpenChange={(next) => !next && onClose()}
		>
			<SheetContent
				side="left"
				showCloseButton={false}
				dir="rtl"
				// data-[side=left]:sm:max-w-[581px] ضروري لتجاوز max-w-sm الافتراضي للـ Sheet
				className="flex w-[581px] max-w-[calc(100%-2rem)] flex-col gap-0 border-e-[0.75px] border-[#E5E5E5] p-0 sm:max-w-[581px] data-[side=left]:sm:max-w-[581px]"
				onKeyDown={(e) => {
					if ((e.metaKey || e.ctrlKey) && e.key === "Enter") onPrimary();
				}}
			>
				{/* الرأس — مسار التنقّل يمينًا وزر الإغلاق يسارًا.
				    ترتيب DOM في RTL: أوّل عنصر يمينًا، فيبدأ المسار بالصفحة الأمّ ثم ينزل
				    إلى الدورة ثم المتدرّب ثم الكود. الشيفرون في RTL يشير يسارًا وهو الصحيح. */}
				<div className="flex shrink-0 items-center justify-between gap-3 border-b px-4 py-2">
					<nav className="flex min-w-0 items-center gap-1.5">
						<span className="shrink-0 text-[10px] font-bold text-[#08090A]">
							الدورات التدريبية
						</span>
						<IconChevronLeft className="size-[9px] shrink-0 text-[#272829]" />
						<span className="truncate text-[10px] font-bold text-[#08090A]">
							{course.name}
						</span>
						{assignment && (
							<>
								<IconChevronLeft className="size-[9px] shrink-0 text-[#272829]" />
								<span className="flex shrink-0 items-center gap-1">
									<span className="flex size-[17px] items-center justify-center rounded-full bg-primary text-[9px] text-white">
										{initials(assignment.staff.name)}
									</span>
									<span className="text-[13px] font-bold text-[#08090A]">
										{assignment.staff.name}
									</span>
								</span>
							</>
						)}
						<span className="shrink-0 font-mono text-[10px] text-[#9B9B9D]">
							· {course.code}
						</span>
					</nav>

					<button
						type="button"
						onClick={onClose}
						aria-label="إغلاق"
						className="flex size-[21px] shrink-0 items-center justify-center rounded-[4px] text-[#9B9B9D] hover:bg-muted"
					>
						<IconX className="size-3.5" />
					</button>
				</div>

				{/* الجسم */}
				<div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 pt-4 pb-3">
					<SheetTitle className="text-[14px] font-semibold text-[#08090A]">
						تفاصيل الدورة التدريبية
					</SheetTitle>

					{/* شارات علوية */}
					<div className="flex flex-wrap items-center gap-3">
						<StatChip
							value={course.completionSettings?.certificateEnabled ? "نعم" : "لا"}
							label="بها شهادة"
						/>
						<StatChip
							value={typeLabel(course.type)}
							label="نوع الدورة"
						/>
						<StatChip
							value={minutes ? `${minutes} دقيقة` : "—"}
							label="الوقت"
							icon={<IconClock className="size-2.5" />}
						/>
						<StatChip
							value={String(course.units.length)}
							label="# الوحدات"
							icon={<IconStack2 className="size-2.5" />}
						/>
					</div>

					{/* بطاقة التفاصيل */}
					<div className="flex flex-col gap-1 rounded-[4px] border-[0.75px] border-[#E5E5E5] p-3">
						<DetailRow
							label="اسم التدريب"
							value={course.name}
							icon={<IconUser className="size-3.5" />}
						/>
						<DetailRow
							label="الجهة المانحة"
							value={course.institution ?? "—"}
							icon={<IconSchool className="size-3.5" />}
						/>
						<DetailRow
							label="مدة التدريب"
							value={duration ?? "—"}
							icon={<IconClock className="size-3.5" />}
						/>
						<DetailRow
							label="نوع التدريب"
							value={courseLocationLabel(course.locationMode) ?? "—"}
							icon={<IconFileText className="size-3.5" />}
						/>
						<DetailRow
							label="المدرب"
							value={trainerName}
							icon={<IconUserCircle className="size-3.5" />}
						/>
						<DetailRow
							label="تكلفة التدريب"
							value={cost ?? "مجانية"}
							icon={<IconCoin className="size-3.5" />}
						/>
					</div>

					{/* وصف الدورة — الوسم في بداية السطر (يمينًا في RTL) والنص تحته */}
					<div className="flex flex-col items-start gap-2 py-1">
						<span className="flex items-center gap-1.5 text-[14px] text-[#737373]">
							<IconFileDescription className="size-3.5" />
							وصف الدورة
						</span>
						<p className="w-full text-start text-[14px] font-medium leading-[21px] text-[#08090A]">
							{course.description?.trim() || "لا يوجد وصف لهذه الدورة."}
						</p>
					</div>

					{/* إرشادات وتعليمات الدورة */}
					<SheetTitle className="text-[14px] font-semibold text-[#08090A]">
						إرشادات وتعليمات الدورة التدريبية
					</SheetTitle>

					{/* ترتيب DOM في RTL: الأيقونة أولًا ⇒ تظهر يمين النص.
					    items-start مع هامش علوي صغير تُبقيها على مستوى السطر الأول لا وسط النص. */}
					<div className="flex items-start gap-1.5 rounded-[4px] bg-[#F59E0B]/[0.12] px-1.5 py-1">
						<IconAlertTriangle className="mt-[1.5px] size-3 shrink-0 text-[#F59E0B]" />
						<span className="text-start text-[10px] leading-[14px] text-[#F59E0B]">
							موجّه للمختصين فقط، هذه الدورة التدريبية مخصّصة للمدرّب المسؤول فقط. يرجى التأكد من
							صلاحيتك لإجراء هذا النوع من التقييمات قبل البدء.
						</span>
					</div>

					<p className="text-right text-[11px] font-semibold text-[#08090A]">
						قبل البدء، يرجى مراعاة التالي:
					</p>

					<div className="flex flex-col gap-2">
						{INSTRUCTIONS.map((line) => (
							<div
								key={line}
								className="flex items-center justify-between gap-3 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-2 py-2.5"
							>
								<span className="text-right text-[10px] font-semibold leading-[14px] text-[#08090A]">
									{line}
								</span>
								<span className="size-[18px] shrink-0 rounded-[4px] border-[1.5px] border-[#E5E5E5] bg-background" />
							</div>
						))}
					</div>
				</div>

				{/* التذييل — الأزرار يسارًا؛ الزر الأساسي أقصى اليسار و«إلغاء» على يمينه */}
				<div className="flex shrink-0 items-center justify-end gap-2 border-t px-4 py-2">
					<button
						type="button"
						onClick={onClose}
						className="flex h-[27px] items-center rounded-[4px] border-[0.75px] border-[#E5E5E5] px-[9px] text-[11px] font-medium text-[#08090A] hover:bg-muted"
					>
						إلغاء
					</button>
					<button
						type="button"
						onClick={onPrimary}
						disabled={isStarting}
						className={cn(
							"flex h-[25.5px] items-center justify-center gap-1.5 rounded-[4px] bg-primary px-3 text-[11px] font-semibold primarytransition-colors hover:bg-primary/90",
							isStarting && "cursor-not-allowed opacity-70",
						)}
					>
						{primaryLabel}
						<span className="rounded-[4px] bg-white/20 px-[3px] py-[1.5px] text-[8px] leading-3 text-white">
							⌘↵
						</span>
					</button>
				</div>
			</SheetContent>
		</Sheet>
	);
}
