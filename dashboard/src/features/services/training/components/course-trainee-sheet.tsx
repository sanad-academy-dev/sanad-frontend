import {
	IconArrowsDiagonal,
	IconArrowsDiagonalMinimize2,
	IconArrowUp,
	IconBuilding,
	IconCalendar,
	IconCalendarDue,
	IconCheck,
	IconChevronLeft,
	IconCoin,
	IconCopy,
	IconDots,
	IconEye,
	IconId,
	IconLink,
	IconListNumbers,
	IconMapPin,
	IconPlayerPlay,
	IconProgress,
	IconStack2,
	IconTrash,
	IconUserCircle,
	IconX,
} from "@tabler/icons-react";
import type { ComponentType, ReactNode } from "react";
import { useState } from "react";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
	courseLocationLabel,
	formatTrainingCost,
} from "@/features/services/training/data/training";
import { getFileUrl } from "@/lib/file-url";
import { cn } from "@/lib/utils";
import type {
	AssignmentResponse,
	AssignmentStatus,
} from "@/server/course-assignments/course-assignments.type";
import type { CourseDetailResponse, UnitResponse } from "@/server/training/training.type";

// تبويبات لوحة المتدرّب — الترتيب هو ترتيب DOM في RTL: «نظرة عامة» يمينًا
const TRAINEE_TABS = [
	{ key: "overview", label: "نظرة عامة" },
	{ key: "activity", label: "سجل النشاط" },
	{ key: "notes", label: "الملاحظات" },
] as const;

type TraineeTab = (typeof TRAINEE_TABS)[number]["key"];

const STATUS_LABEL: Record<AssignmentStatus, string> = {
	ASSIGNED: "لم يبدأ",
	IN_PROGRESS: "قيد التقدم",
	COMPLETED: "مكتمل",
};

const STATUS_COLOR: Record<AssignmentStatus, string> = {
	ASSIGNED: "text-[#9B9B9D]",
	IN_PROGRESS: "text-[#B45309]",
	COMPLETED: "text-[#008A2E]",
};

// تسمية الإجراء الأساسي حسب حالة التعيين — نفس تسميات عمود «الإجراءات» في الجدول
const ACTION_LABEL: Record<AssignmentStatus, string> = {
	ASSIGNED: "بدء الدورة",
	IN_PROGRESS: "استكمال الدورة",
	COMPLETED: "عرض النتيجة",
};

const fmtDate = (d: Date | string | null) =>
	d
		? new Date(d).toLocaleDateString("ar-SA-u-nu-latn", {
				day: "numeric",
				month: "long",
				year: "numeric",
			})
		: null;

const initials = (name: string) =>
	name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase() || "؟";

// عدد الوحدات المكتملة مشتقّ من نسبة التقدّم (لا يوجد تتبّع لكل وحدة على حدة بعد)
const completedUnits = (progress: number | null, total: number) =>
	Math.min(total, Math.round(((progress ?? 0) / 100) * total));

// مدة الوحدة بالدقائق من مجموع مدد دروسها
const unitMinutes = (unit: UnitResponse) => {
	const secs = unit.lessons.reduce((sum, l) => sum + (l.durationSeconds ?? 0), 0);
	return secs > 0 ? Math.round(secs / 60) : null;
};

// لوحة تفاصيل المتدرّب في الدورة — تُفتح من يسار الشاشة عند الضغط على صف موظف
// في جدول «الموظفين المعيّنين بالدورة» (Figma node 4073-442998).
export function CourseTraineeSheet({
	course,
	assignment,
	onClose,
	onOpenPlayer,
	onUnassign,
}: {
	course: CourseDetailResponse;
	assignment: AssignmentResponse | null;
	onClose: () => void;
	onOpenPlayer: (assignment: AssignmentResponse) => void;
	onUnassign: (assignment: AssignmentResponse) => void;
}) {
	const [tab, setTab] = useState<TraineeTab>("overview");
	const [expanded, setExpanded] = useState(false);

	return (
		<Sheet
			open={!!assignment}
			onOpenChange={(isOpen) => {
				if (!isOpen) {
					setTab("overview");
					setExpanded(false);
					onClose();
				}
			}}
		>
			<SheetContent
				side="left"
				showCloseButton={false}
				className={cn(
					"flex w-full flex-col gap-0 p-0",
					expanded ? "sm:max-w-[calc(100vw-1rem)]!" : "sm:max-w-[1017px]!",
				)}
			>
				{assignment && (
					<>
						<SheetTitle className="sr-only">
							تفاصيل {assignment.staff.name} في دورة {course.name}
						</SheetTitle>

						{/* ─── الترويسة: مسار التنقّل يمينًا والإجراءات يسارًا ─── */}
						<div className="flex h-[30px] shrink-0 items-center gap-2 border-b-[0.75px] border-[#E5E5E5] ps-3 pe-1.5">
							<nav className="flex min-w-0 shrink items-center gap-[5px]">
								<span className="shrink-0 whitespace-nowrap text-[12px] font-bold leading-[14px] text-[#08090A]">
									الدورات التدريبية
								</span>
								<span className="h-4 w-px shrink-0 bg-[#E5E5E5]" />
								{/* في RTL: الأيقونة أولًا ⇒ يمين التسمية */}
								<span className="flex min-w-0 items-center gap-1 text-[12px] font-semibold leading-[18px] text-[#4F6AE0]">
									<IconStack2 className="size-3.5 shrink-0" />
									<span className="truncate">{course.name}</span>
								</span>
								<span className="h-4 w-px shrink-0 bg-[#E5E5E5]" />
								<span className="shrink-0 font-mono text-[10px] leading-[15px] text-[#9B9B9D]">
									{assignment.code}
								</span>
								<button
									type="button"
									aria-label="خيارات المتدرّب"
									className="flex size-[21px] shrink-0 items-center justify-center rounded-[4px] text-[#9B9B9D] hover:bg-[#F5F5F5]"
								>
									<IconDots className="size-3.5" />
								</button>
							</nav>

							<span className="flex-1" />

							<div className="flex shrink-0 items-center gap-1">
								<button
									type="button"
									onClick={() => onOpenPlayer(assignment)}
									className="flex h-[18px] items-center gap-1 whitespace-nowrap rounded-[3px] bg-[#4F6AE0] px-1.5 text-[10px] font-medium leading-none text-white"
								>
									{assignment.status === "COMPLETED" ? (
										<IconEye className="size-2.5" />
									) : (
										<IconPlayerPlay className="size-2.5" />
									)}
									{ACTION_LABEL[assignment.status]}
								</button>
								<button
									type="button"
									onClick={() => onUnassign(assignment)}
									className="flex h-[18px] items-center gap-1 whitespace-nowrap rounded-[3px] bg-[#FF6467]/[0.05] px-1.5 text-[10px] font-medium leading-none text-[#FF6467]"
								>
									<IconTrash className="size-2.5" />
									إلغاء التعيين
								</button>
								<button
									type="button"
									aria-label="نسخ رابط الدورة"
									className="flex size-6 items-center justify-center rounded-[6px] text-[#6D6E6F] hover:bg-[#F5F5F5]"
								>
									<IconLink className="size-4" />
								</button>
								<button
									type="button"
									aria-label="نسخ معرّف التعيين"
									className="flex size-6 items-center justify-center rounded-[6px] text-[#6D6E6F] hover:bg-[#F5F5F5]"
								>
									<IconCopy className="size-4" />
								</button>
								<span className="h-4 w-px bg-[#E5E5E5]" />
								<button
									type="button"
									onClick={() => setExpanded((v) => !v)}
									aria-label={expanded ? "تصغير اللوحة" : "تكبير اللوحة"}
									className="flex size-[21px] items-center justify-center rounded-[4px] text-[#9B9B9D] hover:bg-[#F5F5F5]"
								>
									{expanded ? (
										<IconArrowsDiagonalMinimize2 className="size-3" />
									) : (
										<IconArrowsDiagonal className="size-3" />
									)}
								</button>
								<button
									type="button"
									onClick={onClose}
									aria-label="إغلاق"
									className="flex size-[21px] items-center justify-center rounded-[4px] text-[#9B9B9D] hover:bg-[#F5F5F5]"
								>
									<IconX className="size-3.5" />
								</button>
							</div>
						</div>

						{/* ─── التبويبات (شريط مقسّم) ─── */}
						<div className="flex shrink-0 items-center border-b-[0.75px] border-[#E5E5E5] px-3 py-1">
							<div className="flex w-full items-center justify-start gap-[1.5px] rounded-[5px] bg-[#F0F0F0] p-[1.5px]">
								{TRAINEE_TABS.map((t) => (
									<button
										key={t.key}
										type="button"
										onClick={() => setTab(t.key)}
										aria-pressed={tab === t.key}
										className={cn(
											"flex h-6 cursor-pointer items-center justify-center whitespace-nowrap rounded-[4px] px-[7.5px] text-[11px] font-medium leading-4 transition-colors",
											tab === t.key
												? "border-[0.75px] border-[#E5E5E5] bg-white text-[#08090A]"
												: "text-[#9B9B9D] hover:text-[#08090A]",
										)}
									>
										{t.label}
									</button>
								))}
							</div>
						</div>

						{/* ─── محتوى التبويب يمينًا و«التفاصيل» يسارًا (Figma: التفاصيل عند x=0) ───
						    في RTL أول عنصر في DOM يظهر يمينًا، فالشريط الجانبي يأتي أخيرًا */}
						<div className="flex min-h-0 flex-1 overflow-hidden">
							{tab === "overview" ? (
								<TraineeOverviewTab
									course={course}
									assignment={assignment}
									onOpenPlayer={onOpenPlayer}
								/>
							) : tab === "activity" ? (
								<TraineeActivityTab assignment={assignment} />
							) : (
								<TraineeNotesTab />
							)}

							<TraineeSideDetails
								course={course}
								assignment={assignment}
							/>
						</div>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}

// صف معلومة في الشريط الجانبي: الأيقونة والتسمية يمينًا والقيمة يسارًا
function SideRow({
	label,
	icon: Icon,
	children,
}: {
	label: string;
	icon: ComponentType<{ className?: string }>;
	children: ReactNode;
}) {
	return (
		<div className="flex items-center justify-between gap-2 py-1">
			<span className="flex shrink-0 items-center gap-1 text-[10px] text-[#9B9B9D]">
				<Icon className="size-3 text-[#9B9B9D]" />
				{label}
			</span>
			{children}
		</div>
	);
}

function SideValue({ children }: { children: ReactNode }) {
	return (
		<span className="min-w-0 truncate text-[10px] font-medium text-[#08090A]">{children}</span>
	);
}

// الشريط الجانبي «التفاصيل»
function TraineeSideDetails({
	course,
	assignment,
}: {
	course: CourseDetailResponse;
	assignment: AssignmentResponse;
}) {
	const avatar = getFileUrl(assignment.staff.avatar);
	const total = course.units.length;
	const done = completedUnits(assignment.progress, total);

	return (
		// الشريط في يسار الحوار، فحدّه الفاصل على حرفه الأيمن (بداية RTL)
		<aside className="w-[242px] shrink-0 overflow-y-auto border-s-[0.75px] border-[#E5E5E5] p-3">
			<h3 className="py-1 text-[12px] font-semibold text-[#08090A]">التفاصيل</h3>

			{/* اسم الموظف يمينًا وزر التواصل يسارًا */}
			<div className="flex items-center justify-between gap-2 py-1">
				<span className="flex min-w-0 items-center gap-1.5">
					<span className="flex size-3 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#4F6AE0] text-[6px] font-medium text-white">
						{avatar ? (
							<img
								src={avatar}
								alt={assignment.staff.name}
								className="size-full object-cover"
							/>
						) : (
							initials(assignment.staff.name)
						)}
					</span>
					<span className="truncate text-[12px] font-medium text-[#08090A]">
						{assignment.staff.name}
					</span>
				</span>
				<span className="flex shrink-0 items-center gap-1">
					<button
						type="button"
						className="flex h-[17px] items-center rounded-[3px] border-[0.75px] border-[#E5E5E5] bg-white px-1 text-[7px] font-medium leading-none text-[#08090A] hover:bg-[#F5F5F5]"
					>
						إرسال رسالة
					</button>
					<IconChevronLeft className="size-3 text-[#08090A]" />
				</span>
			</div>

			<div className="flex flex-col">
				<SideRow
					label="الوظيفة"
					icon={IconUserCircle}
				>
					<SideValue>{assignment.staff.role?.name ?? "—"}</SideValue>
				</SideRow>
				<SideRow
					label="الفرع"
					icon={IconBuilding}
				>
					<SideValue>{assignment.staff.branch?.name ?? "—"}</SideValue>
				</SideRow>
				<SideRow
					label="معرّف الموظف"
					icon={IconId}
				>
					<span className="font-mono text-[10px] text-[#08090A]">
						{assignment.staff.code ?? "—"}
					</span>
				</SideRow>
				<SideRow
					label="معرّف التعيين"
					icon={IconListNumbers}
				>
					<span className="font-mono text-[10px] text-[#08090A]">{assignment.code}</span>
				</SideRow>
				<SideRow
					label="الحالة"
					icon={IconProgress}
				>
					<span
						className={cn(
							"text-[10px] font-medium",
							STATUS_COLOR[assignment.status] ?? STATUS_COLOR.ASSIGNED,
						)}
					>
						{STATUS_LABEL[assignment.status] ?? STATUS_LABEL.ASSIGNED}
					</span>
				</SideRow>
				<SideRow
					label="نسبة التقدّم"
					icon={IconStack2}
				>
					<span className="text-[10px] font-medium tabular-nums text-[#08090A]">
						{assignment.progress ?? 0}% · {done}/{total} وحدة
					</span>
				</SideRow>
				<SideRow
					label="مكان الدورة"
					icon={IconMapPin}
				>
					<SideValue>{courseLocationLabel(course.locationMode) ?? "—"}</SideValue>
				</SideRow>
				<SideRow
					label="تاريخ التعيين"
					icon={IconCalendar}
				>
					<span className="text-[10px] font-medium tabular-nums text-[#08090A]">
						{fmtDate(assignment.assignedAt) ?? "—"}
					</span>
				</SideRow>
				<SideRow
					label="الاستحقاق"
					icon={IconCalendarDue}
				>
					<span className="text-[10px] font-medium tabular-nums text-[#08090A]">
						{fmtDate(assignment.dueDate) ?? "—"}
					</span>
				</SideRow>
				<SideRow
					label="تكلفة الدورة"
					icon={IconCoin}
				>
					<SideValue>{formatTrainingCost(course.trainingCost) ?? "مجانية"}</SideValue>
				</SideRow>
			</div>
		</aside>
	);
}

// بطاقة وحدة: الرقم والاسم يمينًا وزر الفتح يسارًا
function UnitRow({
	unit,
	index,
	done,
	onOpen,
}: {
	unit: UnitResponse;
	index: number;
	done: boolean;
	onOpen: () => void;
}) {
	const minutes = unitMinutes(unit);

	return (
		<div className="flex h-[68px] items-center gap-2.5 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-2.5">
			<span
				className={cn(
					"flex size-10 shrink-0 items-center justify-center rounded-[4px] text-[14px] font-bold tabular-nums",
					done ? "bg-[#4F6AE0] text-white" : "bg-[#F5F5F5] text-[#9B9B9D]",
				)}
			>
				{done ? <IconCheck className="size-5" /> : index + 1}
			</span>
			<div className="flex min-w-0 flex-col gap-1">
				<span className="truncate text-[14px] leading-[21px] text-[#08090A]">
					{unit.title}
				</span>
				<span className="flex items-center gap-1 text-[12px] leading-[19px] text-[#6B6B67]">
					{unit.lessons.length} درس
					{minutes !== null && (
						<>
							<span className="text-[#A2ACBA]">•</span>
							<span className="tabular-nums text-[#A2ACBA]">{minutes} دقيقة</span>
						</>
					)}
				</span>
			</div>

			<span className="flex-1" />

			<button
				type="button"
				onClick={onOpen}
				aria-label={`فتح ${unit.title}`}
				className="flex size-8 items-center justify-center rounded-[8px] text-[#08090A] hover:bg-[#F5F5F5]"
			>
				<IconPlayerPlay className="size-4" />
			</button>
		</div>
	);
}

// مسار التقدّم في وحدات الدورة — الوحدة الأولى يمينًا، والوصلات المكتملة باللون الأساسي
function ProgressStepper({ units, done }: { units: UnitResponse[]; done: number }) {
	return (
		<ol className="flex items-start">
			{units.map((unit, i) => {
				const isDone = i < done;
				const current = i === done;
				// الوصلة تمتلئ حتى آخر وحدة مكتملة
				const startFilled = i > 0 && i <= done;
				const endFilled = i < done && i < units.length - 1;

				return (
					<li
						key={unit.id}
						className="flex min-w-0 flex-1 flex-col items-center gap-2"
					>
						{/* الصف: نصف وصلة يمينًا ثم الدائرة ثم نصف وصلة يسارًا */}
						<div className="flex w-full items-center">
							<span
								className={cn(
									"h-[1.5px] flex-1",
									i === 0 ? "bg-transparent" : startFilled ? "bg-[#4F6AE0]" : "bg-[#F0F0F0]",
								)}
							/>
							<span
								className={cn(
									"flex size-[22px] shrink-0 items-center justify-center rounded-full text-[10px] font-medium tabular-nums",
									isDone || current
										? "bg-[#4F6AE0] text-white"
										: "bg-[#F5F5F5] text-[#9B9B9D]",
								)}
							>
								{i + 1}
							</span>
							<span
								className={cn(
									"h-[1.5px] flex-1",
									i === units.length - 1
										? "bg-transparent"
										: endFilled
											? "bg-[#4F6AE0]"
											: "bg-[#F0F0F0]",
								)}
							/>
						</div>
						<span
							className={cn(
								"line-clamp-2 px-1 text-center text-[9px] leading-[14px]",
								current ? "font-medium text-[#4F6AE0]" : "text-[#9B9B9D]",
							)}
						>
							{unit.title}
						</span>
					</li>
				);
			})}
		</ol>
	);
}

// تبويب «نظرة عامة»: وحدات الدورة + التخصصات + مسار التقدّم
function TraineeOverviewTab({
	course,
	assignment,
	onOpenPlayer,
}: {
	course: CourseDetailResponse;
	assignment: AssignmentResponse;
	onOpenPlayer: (assignment: AssignmentResponse) => void;
}) {
	const total = course.units.length;
	const done = completedUnits(assignment.progress, total);
	const specializations = [
		assignment.staff.primarySpecialization?.name,
		assignment.staff.secondarySpecialization?.name,
	].filter((s): s is string => !!s);

	return (
		<div className="flex min-w-0 flex-1 flex-col gap-3.5 overflow-y-auto p-3">
			<section className="flex flex-col gap-2">
				<h3 className="text-[12px] font-semibold text-[#08090A]">وحدات الدورة</h3>
				{total === 0 ? (
					<p className="text-[11px] text-[#9B9B9D]">لا توجد وحدات في هذه الدورة بعد.</p>
				) : (
					<div className="flex flex-col gap-3">
						{course.units.map((unit, i) => (
							<UnitRow
								key={unit.id}
								unit={unit}
								index={i}
								done={i < done}
								onOpen={() => onOpenPlayer(assignment)}
							/>
						))}
					</div>
				)}
			</section>

			<section className="flex flex-col gap-2">
				<h3 className="text-[12px] font-semibold text-[#08090A]">التخصصات</h3>
				<div className="rounded-[4px] border-[0.75px] border-[#E5E5E5] p-3">
					{specializations.length === 0 ? (
						<p className="text-[11px] text-[#9B9B9D]">لا توجد تخصصات مسجّلة لهذا الموظف.</p>
					) : (
						<div className="flex flex-wrap gap-2">
							{specializations.map((spec) => (
								<span
									key={spec}
									className="flex h-[26px] items-center whitespace-nowrap rounded-[4px] bg-[#F5F5F5] px-2 text-[11px] text-[#08090A]"
								>
									{spec}
								</span>
							))}
						</div>
					)}
				</div>
			</section>

			<section className="flex flex-col gap-2">
				<h3 className="text-[12px] font-semibold text-[#08090A]">مسار التقدّم</h3>
				<div className="rounded-[4px] border-[0.75px] border-[#E5E5E5] px-4 py-5">
					{total === 0 ? (
						<p className="text-center text-[11px] text-[#9B9B9D]">
							يظهر المسار بعد إضافة وحدات للدورة.
						</p>
					) : (
						<ProgressStepper
							units={course.units}
							done={done}
						/>
					)}
				</div>
			</section>
		</div>
	);
}

// تبويب «سجل النشاط»: مبنيّ على تواريخ التعيين الفعلية
function TraineeActivityTab({ assignment }: { assignment: AssignmentResponse }) {
	const events = [
		{ label: "تم التعيين على الدورة", at: assignment.assignedAt },
		{ label: "تاريخ بدء الجدولة", at: assignment.startDate },
		{ label: "بدأ الدورة", at: assignment.startedAt },
		{ label: "أكمل الدورة", at: assignment.completedAt },
	].filter((e) => !!e.at);

	return (
		<div className="flex min-w-0 flex-1 flex-col gap-2 overflow-y-auto p-3">
			<h3 className="text-[12px] font-semibold text-[#08090A]">سجل النشاط</h3>
			{events.length === 0 ? (
				<p className="text-[11px] text-[#9B9B9D]">لا يوجد نشاط مسجّل بعد.</p>
			) : (
				<ol className="flex flex-col">
					{events.map((e, i) => (
						<li
							key={e.label}
							className="flex items-start gap-2"
						>
							{/* العمود الزمني: النقطة والخط يمينًا والنص يساره */}
							<span className="flex flex-col items-center self-stretch">
								<span className="mt-1.5 size-[7px] shrink-0 rounded-full bg-[#4F6AE0]" />
								{i < events.length - 1 && <span className="w-px flex-1 bg-[#E5E5E5]" />}
							</span>
							<span className="flex flex-col gap-0.5 pb-3">
								<span className="text-[11px] font-medium text-[#08090A]">{e.label}</span>
								<span className="text-[10px] tabular-nums text-[#9B9B9D]">
									{fmtDate(e.at)}
								</span>
							</span>
						</li>
					))}
				</ol>
			)}
		</div>
	);
}

// تبويب «الملاحظات»: مربّع ملاحظات عن المتدرّب
function TraineeNotesTab() {
	return (
		<div className="flex min-w-0 flex-1 flex-col gap-2 overflow-y-auto p-3">
			<h3 className="text-[12px] font-semibold text-[#08090A]">الملاحظات</h3>
			<div className="relative rounded-[4px] border-[0.75px] border-[#E5E5E5] p-2.5">
				<textarea
					rows={4}
					placeholder="أضف ملاحظة عن المتدرّب..."
					className="w-full resize-none bg-transparent text-[11px] leading-[18px] text-[#08090A] outline-none placeholder:text-[#9B9B9D]"
				/>
				{/* زاوية ثابتة للزر كما في مربّع ملاحظات المرشّح */}
				<button
					type="button"
					aria-label="حفظ الملاحظة"
					className="absolute bottom-2.5 left-2.5 flex size-[24px] items-center justify-center rounded-full border-[0.75px] border-[#E5E5E5] bg-white"
				>
					<IconArrowUp className="size-3.5 text-[#6D6E6F]" />
				</button>
			</div>
		</div>
	);
}
