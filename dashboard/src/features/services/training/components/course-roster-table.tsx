import { IconDots, IconTrash } from "@tabler/icons-react";
import {
	type ColumnDef,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";

import { TableDataView } from "@/components/common/table-data-view";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { courseLocationLabel } from "@/features/services/training/data/training";
import { getFileUrl } from "@/lib/file-url";
import { cn } from "@/lib/utils";
import type {
	AssignmentResponse,
	AssignmentStatus,
} from "@/server/course-assignments/course-assignments.type";
import type { CourseLocationMode } from "@/server/training/training.type";

const Dash = () => <span className="text-muted-foreground">—</span>;

// تاريخ مضغوط بأرقام لاتينية
const fmtDate = (d: Date | string | null) =>
	d
		? new Date(d).toLocaleDateString("ar-SA-u-nu-latn", {
				day: "numeric",
				month: "long",
				year: "numeric",
			})
		: null;

// آخر نشاط نسبيًّا — «اليوم» عند نفس اليوم، وإلا تاريخ مضغوط
const relativeDay = (d: Date | string | null) => {
	if (!d) return null;
	const date = new Date(d);
	const now = new Date();
	const sameDay =
		date.getFullYear() === now.getFullYear() &&
		date.getMonth() === now.getMonth() &&
		date.getDate() === now.getDate();
	if (sameDay) return "اليوم";
	const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
	if (diffDays === 1) return "أمس";
	return fmtDate(d);
};

const STATUS: Record<AssignmentStatus, { label: string; text: string; dot: string }> = {
	ASSIGNED: { label: "لم يبدأ", text: "text-muted-foreground", dot: "bg-muted-foreground" },
	IN_PROGRESS: { label: "قيد التقدم", text: "text-[#B45309]", dot: "bg-[#F59E0B]" },
	COMPLETED: { label: "مكتمل", text: "text-[#008A2E]", dot: "bg-[#008A2E]" },
};

// تسمية زر الإجراء حسب حالة التعيين (Figma عمود «الإجراءات»)
const ACTION_LABEL: Record<AssignmentStatus, string> = {
	ASSIGNED: "بدء الدورة",
	IN_PROGRESS: "استكمال الدورة",
	COMPLETED: "عرض النتيجة",
};

function StatusPill({ status }: { status: AssignmentStatus }) {
	const s = STATUS[status] ?? STATUS.ASSIGNED;
	return (
		<span
			className={cn(
				"inline-flex w-fit items-center gap-1.5 rounded-md border bg-background px-2 py-0.5 text-xs font-medium",
				s.text,
			)}
		>
			<span className={cn("size-1.5 rounded-full", s.dot)} />
			{s.label}
		</span>
	);
}

const initials = (name: string) =>
	name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase() || "؟";

function StaffAvatar({ name, avatar }: { name: string; avatar: string | null }) {
	const url = getFileUrl(avatar);
	return (
		<span className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/15 text-[10px] font-semibold text-primary">
			{url ? (
				<img
					src={url}
					alt={name}
					className="size-full object-cover"
				/>
			) : (
				initials(name)
			)}
		</span>
	);
}

// حلقة تقدّم صغيرة (نسبة مئوية 0..100) + نص «X/N وحدة»
function ProgressRing({ pct, done, total }: { pct: number; done: number; total: number }) {
	const clamped = Math.max(0, Math.min(100, pct));
	return (
		<div className="flex items-center justify-center gap-1.5">
			<span
				className="size-3.5 shrink-0 rounded-full"
				style={{
					background: `conic-gradient(var(--color-primary) ${clamped * 3.6}deg, var(--color-muted) 0deg)`,
				}}
				aria-hidden
			/>
			<span className="text-[11px] tabular-nums text-foreground">
				{done}/{total} وحدة
			</span>
		</div>
	);
}

const COLUMN_SIZES = [190, 104, 92, 116, 92, 100, 72, 112, 86, 140];

function centeredHeader(label: string) {
	return () => <span className="block w-full text-center">{label}</span>;
}

// جدول «الموظفين المعيّنين بالدورة» (Figma node 4413-475459) — صفوف التعيينات مع التقدّم والحالة
export function CourseRosterTable({
	roster,
	isLoading,
	totalUnits,
	locationMode,
	onAction,
	onUnassign,
	onRowClick,
}: {
	roster: AssignmentResponse[];
	isLoading: boolean;
	totalUnits: number;
	locationMode: CourseLocationMode | null;
	// زر الإجراء حسب الحالة (بدء/استكمال/عرض النتيجة)
	onAction: (assignment: AssignmentResponse) => void;
	onUnassign: (assignment: AssignmentResponse) => void;
	// الضغط على الصف نفسه — يفتح لوحة تفاصيل المتدرّب من يسار الشاشة
	onRowClick?: (assignment: AssignmentResponse) => void;
}) {
	const columns = useMemo<ColumnDef<AssignmentResponse>[]>(
		() => [
			{
				id: "staff",
				header: "اسم الموظف / المعرّف",
				cell: ({ row }) => (
					<div className="flex items-center gap-2">
						<StaffAvatar
							name={row.original.staff.name}
							avatar={row.original.staff.avatar}
						/>
						<div className="flex min-w-0 flex-col">
							<span className="line-clamp-1 text-[13px] font-semibold text-foreground">
								{row.original.staff.name}
							</span>
							<span className="text-[11px] text-muted-foreground">
								{row.original.staff.code}
							</span>
						</div>
					</div>
				),
			},
			{
				id: "role",
				header: "الوظيفة",
				cell: ({ row }) =>
					row.original.staff.role ? (
						<span className="text-[12px] text-foreground">{row.original.staff.role.name}</span>
					) : (
						<Dash />
					),
			},
			{
				id: "branch",
				header: "الفرع",
				cell: ({ row }) =>
					row.original.staff.branch ? (
						<span className="text-[12px] text-foreground">
							{row.original.staff.branch.name}
						</span>
					) : (
						<Dash />
					),
			},
			{
				id: "progress",
				header: centeredHeader("نسبة التقدم"),
				cell: ({ row }) => {
					const pct = row.original.progress ?? 0;
					const done = Math.round((pct / 100) * totalUnits);
					return (
						<ProgressRing
							pct={pct}
							done={done}
							total={totalUnits}
						/>
					);
				},
			},
			{
				id: "location",
				header: centeredHeader("مكان الدورة"),
				cell: () => (
					<span className="block text-center text-[12px]">
						{courseLocationLabel(locationMode) ?? <Dash />}
					</span>
				),
			},
			{
				id: "status",
				header: centeredHeader("الحالة"),
				cell: ({ row }) => (
					<div className="flex justify-center">
						<StatusPill status={row.original.status} />
					</div>
				),
			},
			{
				id: "result",
				header: centeredHeader("النتيجة"),
				cell: () => (
					<span className="block text-center">
						<Dash />
					</span>
				),
			},
			{
				id: "due",
				header: centeredHeader("الاستحقاق"),
				cell: ({ row }) => (
					<span className="block text-center text-[12px] text-muted-foreground">
						{fmtDate(row.original.dueDate) ?? <Dash />}
					</span>
				),
			},
			{
				id: "activity",
				header: centeredHeader("آخر نشاط"),
				cell: ({ row }) => (
					<span className="block text-center text-[12px] text-muted-foreground">
						{relativeDay(
							row.original.completedAt ?? row.original.startedAt ?? row.original.assignedAt,
						) ?? <Dash />}
					</span>
				),
			},
			{
				id: "actions",
				header: centeredHeader("الإجراءات"),
				cell: ({ row }) => (
					<div className="flex items-center justify-center gap-1.5">
						{/* زر الإجراء حسب الحالة: بدء الدورة / استكمال الدورة / عرض النتيجة.
						    نوقف انتشار النقرة حتى لا تفتح لوحة تفاصيل المتدرّب معها. */}
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								onAction(row.original);
							}}
							className="flex h-[26px] items-center whitespace-nowrap rounded-[4px] border border-[#E5E5E5] bg-background px-2.5 text-[11px] font-medium text-[#1F2937] hover:bg-muted"
						>
							{ACTION_LABEL[row.original.status] ?? ACTION_LABEL.ASSIGNED}
						</button>
						<DropdownMenu dir="rtl">
							<DropdownMenuTrigger
								aria-label="خيارات التعيين"
								onClick={(e) => e.stopPropagation()}
								className="flex size-6 items-center justify-center rounded-md border bg-muted/40 text-muted-foreground"
							>
								<IconDots className="size-4" />
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="w-[160px] gap-1 rounded-[4px] border border-[#E5E5E5] p-2 shadow-[0px_4px_12px_rgba(0,0,0,0.12)]"
							>
								<DropdownMenuItem
									variant="destructive"
									onSelect={() => onUnassign(row.original)}
									className="h-[29px] rounded-[5px] px-2 text-[12px] font-bold focus:bg-[#F2F2F2]"
								>
									<IconTrash className="size-4" />
									إلغاء التعيين
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				),
			},
		],
		[totalUnits, locationMode, onAction, onUnassign],
	);

	const sizedColumns = useMemo(
		() => columns.map((c, i) => ({ ...c, size: COLUMN_SIZES[i] })),
		[columns],
	);

	const table = useReactTable({
		data: roster,
		columns: sizedColumns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<TableDataView
			table={table}
			columns={sizedColumns}
			isPending={isLoading}
			onRowClick={onRowClick ? (row) => onRowClick(row.original) : undefined}
			tableClassName="w-full"
			emptyState={{
				title: "لا يوجد موظفون معيّنون بعد",
				description: "عيّن موظفين على هذه الدورة لمتابعة تقدّمهم من هنا.",
			}}
			keepHeaderOnEmpty
		/>
	);
}
