import type React from "react";
import {
	IconUser,
	IconPhone,
	IconSchool,
	IconCalendar,
	IconDroplet,
	IconHeartHandshake,
	IconSparkles,
} from "@tabler/icons-react";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

export interface StudentHoverData {
	id: string;
	name: string;
	code?: string | null;
	gender?: "MALE" | "FEMALE" | "UNKNOWN" | string | null;
	age?: number | null;
	birthDate?: string | Date | null;
	classroom?: string | null;
	bloodType?: string | null;
	level?: string | null;
	learningMethod?: string | null;
	developmentStatus?: string | null;
	status?: string | null;
	active?: boolean;
	nationalId?: string | null;
	owner?: {
		name?: string | null;
		phone?: string | null;
		relationship?: string | null;
	} | null;
	guardianName?: string | null;
	guardianPhone?: string | null;
	guardianRelationship?: string | null;
}

export interface StudentHoverCardProps {
	student: StudentHoverData;
	children: React.ReactNode;
	align?: "start" | "center" | "end";
	side?: "top" | "bottom" | "left" | "right";
	openDelay?: number;
	closeDelay?: number;
}

function formatDate(dateVal?: string | Date | null) {
	if (!dateVal) return "—";
	const d = new Date(dateVal);
	if (Number.isNaN(d.getTime())) return "—";
	const day = d.getDate();
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const year = d.getFullYear();
	return `${day}/${month}/${year}`;
}

export function StudentHoverCard({
	student,
	children,
	align = "start",
	side = "top",
	openDelay = 150,
	closeDelay = 100,
}: StudentHoverCardProps) {
	const isFemale = student.gender === "FEMALE";
	const code = student.code || "PT-2024000";
	const guardianName = student.owner?.name || student.guardianName;
	const guardianPhone = student.owner?.phone || student.guardianPhone;
	const guardianRel =
		student.owner?.relationship || student.guardianRelationship || "ولي الأمر";
	const isActive = student.active !== false && student.status !== "INACTIVE";

	return (
		<HoverCard openDelay={openDelay} closeDelay={closeDelay}>
			<HoverCardTrigger asChild>{children}</HoverCardTrigger>
			<HoverCardContent
				align={align}
				side={side}
				sideOffset={8}
				dir="rtl"
				className="w-80 p-3.5 shadow-xl border border-border/70 rounded-2xl bg-popover/95 backdrop-blur-md"
			>
				{/* 1. الترويسة: الصورة الرمزية، الاسم، المعرف، والحالة */}
				<div className="flex items-start justify-between gap-2.5 pb-2.5 border-b border-border/50">
					<div className="flex items-center gap-2.5 min-w-0">
						{/* الصورة الرمزية بحسب الجنس */}
						<div
							className={cn(
								"flex size-9 shrink-0 items-center justify-center rounded-xl border shadow-2xs",
								isFemale
									? "bg-rose-50 border-rose-200 text-rose-500 dark:bg-rose-950/40 dark:border-rose-900/60"
									: "bg-blue-50 border-blue-200 text-blue-500 dark:bg-blue-950/40 dark:border-blue-900/60",
							)}
						>
							<IconUser className="size-4.5" />
						</div>

						<div className="flex flex-col min-w-0">
							<h4 className="text-xs font-bold text-foreground truncate leading-tight">
								{student.name}
							</h4>
							<span className="font-mono text-[10px] text-muted-foreground tabular-nums">
								{code}
							</span>
						</div>
					</div>

					{/* شارة النشاط */}
					<span
						className={cn(
							"inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold shrink-0 border",
							isActive
								? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900"
								: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
						)}
					>
						<span
							className={cn(
								"size-1.5 rounded-full",
								isActive ? "bg-emerald-500" : "bg-slate-400",
							)}
						/>
						{isActive ? "نشط" : "غير نشط"}
					</span>
				</div>

				{/* 2. شبكة البيانات الأساسية للطالب (فصل، ميلاد، فصيلة، مستوى) */}
				<div className="grid grid-cols-2 gap-2 py-2.5 border-b border-border/50 text-xs">
					{/* الفصل الدراسي */}
					<div className="flex items-center gap-1.5 text-muted-foreground">
						<IconSchool className="size-3.5 shrink-0 text-primary" />
						<span className="text-[11px] font-medium text-foreground truncate">
							{student.classroom || "النجوم"}
						</span>
					</div>

					{/* فصيلة الدم */}
					<div className="flex items-center gap-1.5 text-muted-foreground">
						<IconDroplet className="size-3.5 shrink-0 text-rose-500" />
						<span className="text-[11px] font-medium text-foreground">
							{student.bloodType ? `فصيلة ${student.bloodType}` : "A+"}
						</span>
					</div>

					{/* تاريخ الميلاد أو العمر */}
					<div className="flex items-center gap-1.5 text-muted-foreground">
						<IconCalendar className="size-3.5 shrink-0 text-muted-foreground" />
						<span className="text-[11px] text-foreground font-mono">
							{student.age ? `${student.age} سنة` : formatDate(student.birthDate)}
						</span>
					</div>

					{/* نمط التعلم / المستوى */}
					<div className="flex items-center gap-1.5 text-muted-foreground">
						<IconSparkles className="size-3.5 shrink-0 text-amber-500" />
						<span className="text-[11px] text-foreground truncate">
							{student.level || student.learningMethod || "حضوري"}
						</span>
					</div>
				</div>

				{/* 3. قسم ولي الأمر المرتبط (إن وُجد) */}
				{guardianName && (
					<div className="pt-2 pb-1 text-xs">
						<div className="flex items-center justify-between text-[11px]">
							<div className="flex items-center gap-1 text-muted-foreground truncate">
								<IconHeartHandshake className="size-3.5 shrink-0 text-primary" />
								<span className="truncate">
									{guardianName} ({guardianRel})
								</span>
							</div>

							{guardianPhone && (
								<a
									href={`tel:${guardianPhone}`}
									onClick={(e) => e.stopPropagation()}
									className="flex items-center gap-1 text-primary hover:underline font-mono text-[10px] shrink-0"
									title="اتصال بولي الأمر"
								>
									<IconPhone className="size-3" />
									<span>{guardianPhone}</span>
								</a>
							)}
						</div>
					</div>
				)}

				
			</HoverCardContent>
		</HoverCard>
	);
}
