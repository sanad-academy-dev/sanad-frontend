import { useMemo } from "react";
import {
	IconDots,
	IconEdit,
	IconUserPlus,
	IconTrash,
	IconUsers,
	IconCalendar,
	IconClock,
	IconSparkles,
	IconCube,
	IconCode,
	IconCpu,
	IconRobot,
	IconSchool,
	IconBook,
	IconBooks,
	IconBrain,
	IconAtom,
	IconRocket,
	IconPalette,
	IconMusic,
	IconBulb,
	IconAward,
	IconHeart,
	IconBallFootball,
	IconChess,
	IconDeviceLaptop,
	IconBuilding,
	IconGlobe,
	IconLanguage,
	IconPlus,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LEARNING_MODES } from "@/features/services/classrooms/data/constants";
import type { ClassroomResponse, LearningMode } from "@/server/classrooms/classrooms.type";
import { cn } from "@/lib/utils";

// خريطة أيقونات الفصول الشائعة
const ICON_COMPONENTS: Record<string, React.ComponentType<{ className?: string }>> = {
	cube: IconCube,
	code: IconCode,
	cpu: IconCpu,
	robot: IconRobot,
	school: IconSchool,
	book: IconBook,
	books: IconBooks,
	brain: IconBrain,
	atom: IconAtom,
	sparkles: IconSparkles,
	rocket: IconRocket,
	palette: IconPalette,
	music: IconMusic,
	bulb: IconBulb,
	award: IconAward,
	heart: IconHeart,
	ball: IconBallFootball,
	chess: IconChess,
	laptop: IconDeviceLaptop,
	building: IconBuilding,
	globe: IconGlobe,
	language: IconLanguage,
};

// خريطة ألوان خلفية وحدود أيقونة الفصل
const COLOR_STYLES: Record<string, { bg: string; text: string; border: string }> = {
	blue: {
		bg: "bg-blue-50 dark:bg-blue-950/40",
		text: "text-blue-600 dark:text-blue-400",
		border: "border-blue-200 dark:border-blue-900/60",
	},
	indigo: {
		bg: "bg-indigo-50 dark:bg-indigo-950/40",
		text: "text-indigo-600 dark:text-indigo-400",
		border: "border-indigo-200 dark:border-indigo-900/60",
	},
	emerald: {
		bg: "bg-emerald-50 dark:bg-emerald-950/40",
		text: "text-emerald-600 dark:text-emerald-400",
		border: "border-emerald-200 dark:border-emerald-900/60",
	},
	rose: {
		bg: "bg-rose-50 dark:bg-rose-950/40",
		text: "text-rose-600 dark:text-rose-400",
		border: "border-rose-200 dark:border-rose-900/60",
	},
	amber: {
		bg: "bg-amber-50 dark:bg-amber-950/40",
		text: "text-amber-600 dark:text-amber-400",
		border: "border-amber-200 dark:border-amber-900/60",
	},
	cyan: {
		bg: "bg-cyan-50 dark:bg-cyan-950/40",
		text: "text-cyan-600 dark:text-cyan-400",
		border: "border-cyan-200 dark:border-cyan-900/60",
	},
	orange: {
		bg: "bg-orange-50 dark:bg-orange-950/40",
		text: "text-orange-600 dark:text-orange-400",
		border: "border-orange-200 dark:border-orange-900/60",
	},
	red: {
		bg: "bg-red-50 dark:bg-red-950/40",
		text: "text-red-600 dark:text-red-400",
		border: "border-red-200 dark:border-red-900/60",
	},
	peach: {
		bg: "bg-rose-50 dark:bg-rose-950/40",
		text: "text-rose-600 dark:text-rose-400",
		border: "border-rose-200 dark:border-rose-900/60",
	},
	slate: {
		bg: "bg-slate-100 dark:bg-slate-800/60",
		text: "text-slate-600 dark:text-slate-300",
		border: "border-slate-300 dark:border-slate-700",
	},
	gray: {
		bg: "bg-neutral-100 dark:bg-neutral-800/60",
		text: "text-neutral-600 dark:text-neutral-300",
		border: "border-neutral-300 dark:border-neutral-700",
	},
};

// باليتة ألوان أفاتار المعلمين في أسفل البطاقة مطابقة للصورة بدقة
const AVATAR_COLORS = [
	"bg-[#ECE9FE] text-[#6941C6] border-card dark:bg-purple-950/60 dark:text-purple-300",
	"bg-[#FFE4E8] text-[#C01048] border-card dark:bg-rose-950/60 dark:text-rose-300",
	"bg-[#E0F2FE] text-[#026AA2] border-card dark:bg-sky-950/60 dark:text-sky-300",
	"bg-[#D1FADF] text-[#05603A] border-card dark:bg-emerald-950/60 dark:text-emerald-300",
	"bg-[#FEF0C7] text-[#B54708] border-card dark:bg-amber-950/60 dark:text-amber-300",
	"bg-[#EBE9FE] text-[#5925DC] border-card dark:bg-indigo-950/60 dark:text-indigo-300",
];

// استخراج الحروف الأولى لاسم المعلم
function getInitials(name?: string | null): string {
	if (!name) return "م";
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (parts.length >= 2) {
		return `${parts[0].charAt(0)}.${parts[1].charAt(0)}`;
	}
	return parts[0]?.slice(0, 2) || "م";
}

// استخراج البيانات المرئية من الملاحظات
function getClassroomVisuals(classroom: ClassroomResponse) {
	const rawNotes = classroom.notes || "";
	const matchIcon = rawNotes.match(/رمز_الفصل:\s*([^\n\r]+)/);
	const matchType = rawNotes.match(/نوع_الرمز:\s*([^\n\r]+)/);
	const matchColor = rawNotes.match(/لون_الفصل:\s*([^\n\r]+)/);
	const matchDesc = rawNotes.match(/الوصف:\s*([^\n\r]+)/);

	const iconId = matchIcon?.[1]?.trim() || "cube";
	const iconType = (matchType?.[1]?.trim() || "icon") as "icon" | "emoji";
	const colorId = matchColor?.[1]?.trim() || "blue";

	let description = matchDesc?.[1]?.trim() || "";
	if (!description && rawNotes && !rawNotes.includes("رمز_الفصل:") && !rawNotes.includes("التصنيف:")) {
		description = rawNotes;
	}

	return {
		iconId,
		iconType,
		colorId,
		description,
	};
}

// تنسيق التاريخ بالعربية
function formatArabicDate(dateStr?: string | Date): string {
	if (!dateStr) return "مؤخراً";
	try {
		const d = new Date(dateStr);
		if (Number.isNaN(d.getTime())) return "مؤخراً";
		return new Intl.DateTimeFormat("ar-EG", {
			day: "numeric",
			month: "short",
		}).format(d);
	} catch {
		return "مؤخراً";
	}
}

// تنسيق الوقت المنقضي
function formatRelativeTime(dateStr?: string | Date): string {
	if (!dateStr) return "الآن";
	try {
		const d = new Date(dateStr);
		const now = new Date();
		const diffMs = Math.max(0, now.getTime() - d.getTime());
		const diffMin = Math.floor(diffMs / 60000);
		if (diffMin < 1) return "الآن";
		if (diffMin < 60) return `منذ ${diffMin} د`;
		const diffHours = Math.floor(diffMin / 60);
		if (diffHours < 24) return `منذ ${diffHours} س`;
		const diffDays = Math.floor(diffHours / 24);
		if (diffDays < 30) return `منذ ${diffDays} يوم`;
		return `منذ ${Math.floor(diffDays / 30)} شهر`;
	} catch {
		return "الآن";
	}
}

export interface ClassroomsGridProps {
	classrooms: ClassroomResponse[];
	isLoading?: boolean;
	onEdit: (classroom: ClassroomResponse) => void;
	onAssignStaff: (classroom: ClassroomResponse) => void;
	onDelete: (classroom: ClassroomResponse) => void;
	onSelect?: (classroom: ClassroomResponse) => void;
	onAddClassroom?: () => void;
}

export function ClassroomsGrid({
	classrooms,
	isLoading = false,
	onEdit,
	onAssignStaff,
	onDelete,
	onSelect,
	onAddClassroom,
}: ClassroomsGridProps) {
	if (isLoading) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5 p-5">
				{Array.from({ length: 6 }).map((_, i) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: هيكل تحميل مؤقت
						key={i}
						className="h-48 rounded-2xl border border-border/60 bg-card/60 p-5 animate-pulse flex flex-col justify-between"
					>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="size-9 rounded-xl bg-muted" />
								<div className="space-y-1.5">
									<div className="h-4 w-28 bg-muted rounded" />
									<div className="h-2.5 w-14 bg-muted rounded" />
								</div>
							</div>
							<div className="h-5 w-16 bg-muted rounded-full" />
						</div>
						<div className="space-y-2">
							<div className="h-3 w-full bg-muted rounded" />
							<div className="h-3 w-3/4 bg-muted rounded" />
						</div>
						<div className="h-1.5 w-full bg-muted rounded-full" />
						<div className="flex items-center justify-between pt-2 border-t border-border/40">
							<div className="h-3 w-20 bg-muted rounded" />
							<div className="h-5 w-14 bg-muted rounded-full" />
						</div>
					</div>
				))}
			</div>
		);
	}

	if (classrooms.length === 0) {
		return (
			<div className="flex min-h-[360px] flex-1 items-center justify-center p-8 text-center">
				<div className="flex flex-col items-center gap-3 max-w-sm">
					<div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
						<IconSchool className="size-7 stroke-[1.8]" />
					</div>
					<h3 className="text-base font-bold text-foreground">
						لا توجد فصول دراسية حتى الآن
					</h3>
					<p className="text-xs text-muted-foreground leading-relaxed">
						قم بإنشاء الفصول لتنظيم الطلاب ومجموعات التعلم وتعيين المعلمين والمشرفين
					</p>
					{onAddClassroom && (
						<Button
							size="sm"
							onClick={onAddClassroom}
							className="mt-2 gap-1.5 text-xs font-semibold"
						>
							<IconPlus className="size-3.5" />
							إضافة فصل جديد
						</Button>
					)}
				</div>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5 p-5 overflow-y-auto">
			{classrooms.map((classroom) => (
				<ClassroomCard
					key={classroom.id}
					classroom={classroom}
					onSelect={onSelect ? () => onSelect(classroom) : undefined}
					onEdit={() => onEdit(classroom)}
					onAssignStaff={() => onAssignStaff(classroom)}
					onDelete={() => onDelete(classroom)}
				/>
			))}
		</div>
	);
}

interface ClassroomCardProps {
	classroom: ClassroomResponse;
	onSelect?: () => void;
	onEdit: () => void;
	onAssignStaff: () => void;
	onDelete: () => void;
}

function ClassroomCard({
	classroom,
	onSelect,
	onEdit,
	onAssignStaff,
	onDelete,
}: ClassroomCardProps) {
	const visuals = useMemo(() => getClassroomVisuals(classroom), [classroom]);
	const styleConfig = COLOR_STYLES[visuals.colorId] || COLOR_STYLES.blue;
	const IconComp = ICON_COMPONENTS[visuals.iconId] || IconCube;

	const percent = useMemo(() => {
		const cap = Number(classroom.capacity) || 1;
		const enr = Number(classroom.enrolledCount) || 0;
		return Math.min(100, Math.round((enr / cap) * 100));
	}, [classroom.capacity, classroom.enrolledCount]);

	const modeConfig = useMemo(() => {
		const mode = (classroom.learningMode || "REMOTE") as LearningMode;
		return LEARNING_MODES[mode] || LEARNING_MODES.REMOTE;
	}, [classroom.learningMode]);

	// تحديد نص وشارة الحالة المطابقة تماماً للصورة
	const statusBadge = useMemo(() => {
		if (!classroom.active) {
			return {
				label: "غير نشط",
				dotClass: "bg-slate-400",
			};
		}
		if (percent === 100) {
			return {
				label: "مكتمل",
				dotClass: "bg-emerald-500",
			};
		}
		if (percent >= 80) {
			return {
				label: "شارف الاكتمال",
				dotClass: "bg-amber-500",
			};
		}
		return {
			label: "نشط",
			dotClass: "bg-blue-600",
		};
	}, [classroom.active, percent]);

	return (
		<div
			onClick={onSelect || onEdit}
			className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-2xs hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer text-right select-none"
		>
			{/* القسم العلوي: الأيقونة + الاسم والمعرف + شارة الحالة + زر القائمة */}
			<div>
				<div className="flex items-start justify-between gap-2.5 mb-2.5">
					{/* أيقونة الفصل واسمه ومعرفه */}
					<div className="flex items-center gap-2.5 min-w-0 flex-1">
						<div
							className={cn(
								"size-9 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:scale-105 shadow-2xs",
								styleConfig.bg,
								styleConfig.text,
								styleConfig.border,
							)}
						>
							{visuals.iconType === "emoji" ? (
								<span className="text-base leading-none select-none">
									{visuals.iconId}
								</span>
							) : (
								<IconComp className="size-4.5 stroke-[1.8]" />
							)}
						</div>

						<div className="min-w-0 flex-1 text-right">
							<h3 className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
								{classroom.name}
							</h3>
							{classroom.code && (
								<span className="text-[10px] font-mono text-muted-foreground block truncate">
									#{classroom.code}
								</span>
							)}
						</div>
					</div>

					{/* شارة الحالة + زر الخيارات */}
					<div
						className="flex items-center gap-1.5 shrink-0"
						onClick={(e) => e.stopPropagation()}
					>
						{/* شارة الحالة بالنقطة الملونة مطابقة للصورة */}
						<span
							className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border border-border/80 bg-background/80 text-foreground shadow-2xs"
						>
							<span className={cn("size-1.5 rounded-full", statusBadge.dotClass)} />
							<span>{statusBadge.label}</span>
						</span>

						{/* قائمة إجراءات الفصل (تعديل / تعيين موظف / حذف) */}
						<DropdownMenu dir="rtl">
							<DropdownMenuTrigger asChild>
								<Button
									type="button"
									variant="ghost"
									size="icon-xs"
									className="size-7 text-muted-foreground hover:text-foreground opacity-60 group-hover:opacity-100 transition-opacity"
									title="خيارات إضافية"
								>
									<IconDots className="size-3.5" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-36">
								<DropdownMenuItem onClick={onEdit} className="gap-2 text-xs cursor-pointer">
									<IconEdit className="size-3.5 text-muted-foreground" />
									تعديل الفصل
								</DropdownMenuItem>
								<DropdownMenuItem onClick={onAssignStaff} className="gap-2 text-xs cursor-pointer">
									<IconUserPlus className="size-3.5 text-muted-foreground" />
									تعيين موظف
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={onDelete}
									className="gap-2 text-xs text-destructive cursor-pointer"
								>
									<IconTrash className="size-3.5" />
									حذف الفصل
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				{/* وصف الفصل (سطرين كحد أقصى) */}
				<p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-[34px] mb-3">
					{visuals.description || "لا يوجد وصف مسجل بعد."}
				</p>
			</div>

			{/* القسم الأوسط: شريط التقدم والنسبة المئوية مطابق للصورة تماماً */}
			<div className="space-y-1.5 my-3">
				<div className="flex items-center justify-between gap-2.5">
					{/* شريط الإنجاز/السعة */}
					<div className="h-1.5 flex-1 bg-muted/70 rounded-full overflow-hidden">
						<div
							className={cn(
								"h-full rounded-full transition-all duration-300",
								percent === 100
									? "bg-emerald-500"
									: percent >= 80
									? "bg-amber-500"
									: percent > 0
									? "bg-primary"
									: "bg-transparent",
							)}
							style={{ width: `${percent}%` }}
						/>
					</div>

					{/* النسبة المئوية للسعة في نهاية السطر */}
					<span className="text-xs font-semibold font-mono text-muted-foreground shrink-0 tabular-nums">
						{percent}%
					</span>
				</div>
			</div>

			{/* القسم السفلي: إحصائيات السعة والتاريخ + أفاتار المعلمين */}
			<div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs text-muted-foreground">
				{/* الجانب الأيمن (في RTL): عدد الطلاب/السعة + التاريخ + الوقت المنقضي + نمط التعلم */}
				<div className="flex items-center gap-2.5 text-[11px] flex-wrap">
					{/* عدد الطلاب من السعة مثل 4/18 أو 0/5 في الصورة */}
					<div
						className="flex items-center gap-1 font-mono font-semibold text-foreground/90"
						title={`المسجلون: ${classroom.enrolledCount} من إجمالي ${classroom.capacity}`}
					>
						<span className="text-muted-foreground select-none font-sans text-xs">⊘</span>
						<span>
							{classroom.enrolledCount}/{classroom.capacity}
						</span>
					</div>

					{/* تاريخ الإنشاء مثل Nov 13 في الصورة */}
					<div
						className="flex items-center gap-1 text-muted-foreground"
						title="تاريخ الإنشاء"
					>
						<IconCalendar className="size-3.5 text-muted-foreground/70 shrink-0" />
						<span>{formatArabicDate(classroom.createdAt)}</span>
					</div>

					{/* الوقت المنقضي مثل 12m ago في الصورة */}
					<div
						className="flex items-center gap-1 text-muted-foreground"
						title="منذ"
					>
						<IconClock className="size-3.5 text-muted-foreground/70 shrink-0" />
						<span>{formatRelativeTime(classroom.createdAt)}</span>
					</div>

					{/* نمط التعلم (عن بعد / حضوري / مدمج) */}
					<span
						className={cn(
							"text-[10px] px-1.5 py-0.2 rounded font-medium border",
							modeConfig.className,
						)}
					>
						{modeConfig.label}
					</span>
				</div>

				{/* الجانب الأيسر (في RTL): ستاك أفاتار المعلمين مطابقة للأفاتار في الصورة */}
				<div
					className="flex items-center -space-x-2 space-x-reverse shrink-0"
					title="المعلمون والمشرفون على الفصل"
				>
					{classroom.teachers && classroom.teachers.length > 0 ? (
						<>
							{classroom.teachers.slice(0, 3).map((teacher, idx, arr) => (
								<div
									key={teacher.id}
									style={{ zIndex: arr.length - idx }}
									title={`${teacher.name}${teacher.role ? ` (${teacher.role})` : ""}`}
									className="relative size-6.5 rounded-full ring-2 ring-background flex items-center justify-center text-[10px] font-bold bg-[#EDE9FE] text-[#7C3AED] dark:bg-[#7C3AED]/25 dark:text-[#DDD6FE] shadow-2xs transition-transform hover:scale-115 hover:z-30 select-none cursor-default"
								>
									{teacher.image ? (
										<img
											src={teacher.image}
											alt={teacher.name}
											className="size-full object-cover rounded-full"
										/>
									) : (
										<span>{getInitials(teacher.name)}</span>
									)}
								</div>
							))}

							{classroom.teachers.length > 3 && (
								<div
									style={{ zIndex: 0 }}
									className="relative size-6.5 rounded-full ring-2 ring-background bg-muted text-[10px] font-bold text-muted-foreground flex items-center justify-center shadow-2xs select-none"
									title={`+${classroom.teachers.length - 3} معلمين إضافيين`}
								>
									+{classroom.teachers.length - 3}
								</div>
							)}
						</>
					) : (
						<span className="text-[10px] text-muted-foreground/50 font-normal">
							بلا معلم
						</span>
					)}
				</div>
			</div>
		</div>
	);
}
