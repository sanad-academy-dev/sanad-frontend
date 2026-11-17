import {
	IconClock,
	IconDots,
	IconLayersSubtract,
	IconMapPin,
	IconPencil,
	IconSchool,
	IconTrash,
	IconUserPlus,
	IconUsers,
} from "@tabler/icons-react";
import type { ReactNode } from "react";
import { AvatarCirclesStack } from "@/components/common/avatar-circles-stack";
import { StaffHoverCard, type StaffHoverData } from "@/components/common/hover-cards";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { resolveCourseAppearance } from "@/features/services/training/utils/course-meta";
import { resolveCover } from "@/features/services/training/utils/cover";
import { cn } from "@/lib/utils";
import { parseTrackStructure } from "./track-structure-step";
import type { TrackRow } from "./tracks-view";

function Chip({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10.5px] font-medium text-muted-foreground",
				className,
			)}
		>
			{children}
		</span>
	);
}

function TrackStatusPill({ status }: { status: TrackRow["status"] }) {
	const statusConfigs = {
		ACTIVE: {
			label: "نشط",
			border:
				"border-emerald-200 text-emerald-600 dark:border-emerald-800 dark:text-emerald-400",
			dot: "bg-emerald-500",
		},
		PENDING: {
			label: "جاري",
			border: "border-amber-200 text-amber-600 dark:border-amber-800 dark:text-amber-400",
			dot: "bg-amber-500",
		},
		COMPLETED: {
			label: "مكتمل",
			border: "border-blue-200 text-blue-600 dark:border-blue-800 dark:text-blue-400",
			dot: "bg-blue-500",
		},
		DRAFT: {
			label: "مسودة",
			border: "border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400",
			dot: "bg-slate-400",
		},
	};

	const cfg = statusConfigs[status] || statusConfigs.DRAFT;

	return (
		<span
			className={cn(
				"inline-flex w-fit shrink-0 items-center gap-1.5 rounded-md border bg-background/90 px-2 py-0.5 text-[10px] font-semibold backdrop-blur-xs",
				cfg.border,
			)}
		>
			<span className={cn("size-1.5 rounded-full", cfg.dot)} />
			{cfg.label}
		</span>
	);
}

export function TrackAssigneeStack({ trainers }: { trainers?: TrackRow["trainers"] }) {
	if (!trainers || trainers.length === 0) {
		return <span className="text-[11px] text-muted-foreground select-none">—</span>;
	}

	const items = trainers.map((s) => {
		const staffData: StaffHoverData = {
			id: s.id,
			name: s.name,
			image: s.avatar || null,
			phone: s.phone || null,
			email: s.email || null,
			role: s.role || "TEACHER",
			branch: s.branch || null,
			employmentType: s.employmentType || null,
			active: s.active !== false,
		};

		return {
			id: s.id,
			name: s.name,
			title: s.name,
			image: s.avatar || null,
			data: staffData,
		};
	});

	return (
		<AvatarCirclesStack
			items={items}
			totalCount={trainers.length}
			variant="mauve"
			maxVisible={3}
			renderItem={(item, element) => {
				const staff = (item.data as StaffHoverData) || {
					id: String(item.id),
					name: item.name,
				};
				return <StaffHoverCard staff={staff}>{element}</StaffHoverCard>;
			}}
		/>
	);
}

export function TrackCard({
	track,
	onEdit,
	onDelete,
	onAssignStaff,
	onAssignStudent,
}: {
	track: TrackRow;
	onEdit?: () => void;
	onDelete?: () => void;
	onAssignStaff?: () => void;
	onAssignStudent?: () => void;
}) {
	// استخراج الغلاف إن وُجد من هيكل المسار
	const structure = parseTrackStructure(track.notes || track.description || "");
	const cover = structure?.coverKey ? resolveCover(structure.coverKey) : null;

	// استخراج المظهر اللوني والأيقونة المخصصة
	const { Icon: TrackIcon, colorClass } = resolveCourseAppearance(
		track.description || track.notes,
	);

	const locationLabel =
		track.locationLabel ||
		(track.locationMode === "ONLINE"
			? "أونلاين"
			: track.locationMode === "IN_PERSON"
				? "حضوري"
				: track.locationMode === "HYBRID"
					? "مدمج"
					: null);

	return (
		<div
			className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:border-primary/40 hover:shadow-sm text-right"
			dir="rtl"
		>
			{/* رأس الغلاف أو الرمز */}
			<div
				className="relative flex h-28 items-center justify-center overflow-hidden bg-muted/40 border-b border-border/60"
				style={cover?.type === "color" ? { backgroundColor: cover.color } : undefined}
			>
				{cover?.type === "image" ? (
					<img
						src={cover.url}
						alt={track.name}
						className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
					/>
				) : cover?.type === "color" ? null : (
					<div
						className={cn(
							"flex size-13 items-center justify-center rounded-2xl border shadow-xs transition-transform duration-200 group-hover:scale-105",
							colorClass,
						)}
					>
						<TrackIcon className="size-6.5" />
					</div>
				)}

				{/* شارة الحالة أعلى اليسار */}
				<div className="absolute top-2.5 left-2.5 z-10">
					<TrackStatusPill status={track.status} />
				</div>
			</div>

			{/* تفاصيل المسار */}
			<div className="flex flex-1 flex-col gap-2.5 p-3.5">
				{/* الاسم والمعرف */}
				<div className="flex flex-col gap-1">
					<button
						type="button"
						onClick={onEdit}
						className="line-clamp-1 text-right text-[14px] font-bold text-foreground hover:text-primary transition-colors cursor-pointer"
						title={track.name}
					>
						{track.name}
					</button>
					<div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
						<span>{track.code}</span>
						{track.duration && (
							<>
								<span>•</span>
								<span className="flex items-center gap-1 font-sans font-medium text-foreground/80">
									<IconClock className="size-3 text-muted-foreground" />
									{track.duration}
								</span>
							</>
						)}
					</div>
				</div>

				{/* رقاقات التصنيف والمرحلة ومكان التعلم والسعر */}
				<div className="flex flex-wrap items-center gap-1 pt-0.5">
					{track.academicStage && (
						<Chip className="bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800">
							<IconSchool className="size-2.5" />
							{track.academicStage}
						</Chip>
					)}
					{track.category && <Chip>{track.category}</Chip>}
					{locationLabel && (
						<Chip>
							<IconMapPin className="size-2.5" />
							{locationLabel}
						</Chip>
					)}
					{track.price > 0 && (
						<Chip className="font-semibold text-foreground">
							{track.price.toLocaleString("ar-EG")} ج.م
						</Chip>
					)}
				</div>

				{/* تذييل البطاقة: الدورات والمدربون وقائمة الإجراءات */}
				<div className="mt-auto flex items-center justify-between gap-2 border-t border-border/70 pt-2.5">
					<div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
						<IconLayersSubtract className="size-3.5" />
						<span>{track.coursesCount || 0} دورات</span>
					</div>

					<div className="flex items-center gap-1.5">
						<TrackAssigneeStack trainers={track.trainers} />

						<DropdownMenu dir="rtl">
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="size-7 text-muted-foreground hover:text-foreground cursor-pointer"
								>
									<IconDots className="size-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start">
								{onAssignStaff && (
									<DropdownMenuItem
										className="gap-2 text-xs cursor-pointer"
										onSelect={onAssignStaff}
									>
										<IconUserPlus className="size-3.5" />
										تعيين موظف
									</DropdownMenuItem>
								)}
								{onAssignStudent && (
									<DropdownMenuItem
										className="gap-2 text-xs cursor-pointer"
										onSelect={onAssignStudent}
									>
										<IconUsers className="size-3.5" />
										تسجيل طالب
									</DropdownMenuItem>
								)}
								{onEdit && (
									<DropdownMenuItem
										className="gap-2 text-xs cursor-pointer"
										onSelect={onEdit}
									>
										<IconPencil className="size-3.5" />
										تعديل المسار
									</DropdownMenuItem>
								)}
								{onDelete && (
									<>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											variant="destructive"
											className="gap-2 text-xs cursor-pointer"
											onSelect={onDelete}
										>
											<IconTrash className="size-3.5" />
											حذف المسار
										</DropdownMenuItem>
									</>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>
		</div>
	);
}
