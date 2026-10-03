import {
	IconBan,
	IconCircleCheck,
	IconCopy,
	IconDots,
	IconExternalLink,
	IconPencil,
	IconSchool,
	IconStarFilled,
	IconTrash,
} from "@tabler/icons-react";
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
import { ContentAvatar } from "@/features/services/training/components/content-avatar";
import { CourseCloneRow } from "@/features/services/training/components/course-clone-row";
import {
	COURSE_TYPE_OPTIONS,
	courseLocationLabel,
	formatCourseDuration,
	formatTrainingCost,
} from "@/features/services/training/data/training";
import { getFileUrl } from "@/lib/file-url";
import { cn } from "@/lib/utils";
import type {
	CourseAssigneePreview,
	CourseListItemResponse,
	CourseStatus,
} from "@/server/training/training.type";

// تاريخ رقمي مضغوط ليتّسع الجدول كاملًا بلا تمرير أفقي
const fmtDate = (d: Date | string) =>
	new Date(d).toLocaleDateString("ar-SA-u-nu-latn", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});

const typeLabel = (t: CourseListItemResponse["type"]) =>
	COURSE_TYPE_OPTIONS.find((o) => o.value === t)?.label ?? t;

// خلية فارغة موحّدة — بيانات مؤجَّلة/غير متوفرة تُعرض «—» (لا بيانات ملفقة)
const Dash = () => <span className="text-muted-foreground">—</span>;

const STATUS: Record<CourseStatus, { label: string; text: string; dot: string }> = {
	PUBLISHED: { label: "منشور", text: "text-[#008A2E]", dot: "bg-[#008A2E]" },
	DRAFT: { label: "مسودة", text: "text-muted-foreground", dot: "bg-muted-foreground" },
	ARCHIVED: { label: "معطلة", text: "text-[#B45309]", dot: "bg-[#F59E0B]" },
};

function StatusPill({ status }: { status: CourseStatus }) {
	const s = STATUS[status] ?? STATUS.DRAFT;
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

// مكدّس المدربين — دوائر 12px متداخلة بألوان متناوبة + عدّاد فائض «+N» (Figma node 4413-490160).
// اللون البنفسجي مأخوذ من رمز primary بدرجتَي شفافية بدل hex خام.
function TrainerStack({ people }: { people: CourseAssigneePreview[] }) {
	if (people.length === 0) return <Dash />;
	const shown = people.slice(0, 4);
	const extra = people.length - shown.length;
	return (
		<div className="flex items-center justify-center">
			{shown.map((p, i) => {
				const url = getFileUrl(p.avatar);
				return (
					<span
						key={p.id}
						title={p.name}
						className={cn(
							"flex size-3 items-center justify-center overflow-hidden rounded-full text-[5px] leading-none primaryring-1 ring-background",
							i % 2 === 0 ? "bg-primary/50" : "bg-primary/30",
							i > 0 && "-ms-1",
						)}
					>
						{url ? (
							<img
								src={url}
								alt={p.name}
								className="size-full object-cover"
							/>
						) : (
							initials(p.name)
						)}
					</span>
				);
			})}
			{extra > 0 && (
				<span className="-ms-1 flex size-3 items-center justify-center rounded-full bg-primary/50 text-[4px] leading-none primaryring-1 ring-background">
					+{extra}
				</span>
			)}
		</div>
	);
}

// أحجام أعمدة الجدول الثلاثة عشر (px) — مجموعها < عرض الحاوية ليتّسع بلا تمرير أفقي
// (name, cost, type, institution, location, trainers, duration, assigned, rating, updated, created, status, actions)
const COLUMN_SIZES = [180, 80, 90, 135, 82, 92, 84, 86, 76, 88, 88, 92, 122];

// عنوان مُتوسّط: w-full ليملأ غلاف الفلكس في TableDataView فيتوسّط فعليًا فوق قيم الخلية
function centeredHeader(label: string) {
	return () => <span className="block w-full text-center">{label}</span>;
}

// جدول الدورات — أعمدة صفحة القائمة الكاملة (RTL) بنمط جداول التطبيق
export function CourseTable({
	courses,
	isLoading,
	onDelete,
	onEdit,
	onOpen,
	onDuplicate,
	onDisable,
	onEnable,
	onAssign,
	onRowOpen,
	cloningCourseId,
}: {
	courses: CourseListItemResponse[];
	isLoading: boolean;
	onDelete: (course: CourseListItemResponse) => void;
	onEdit: (course: CourseListItemResponse) => void;
	onOpen: (course: CourseListItemResponse) => void;
	onDuplicate: (course: CourseListItemResponse) => void;
	onDisable: (course: CourseListItemResponse) => void;
	onEnable: (course: CourseListItemResponse) => void;
	onAssign: (course: CourseListItemResponse) => void;
	// النقر على صفّ الدورة يفتح صفحة تفاصيلها
	onRowOpen?: (course: CourseListItemResponse) => void;
	// معرّف الدورة قيد الاستنساخ — يُعرض صفّ تقدّم مضمّن أسفلها
	cloningCourseId?: string | null;
}) {
	const columns = useMemo<ColumnDef<CourseListItemResponse>[]>(
		() => [
			// 1) اسم الدورة / المعرّف
			{
				accessorKey: "name",
				header: "اسم الدورة / المعرّف",
				// في RTL أول عنصر في ترتيب DOM = أقصى اليمين، فالأفاتار يمين الاسم/المعرّف
				cell: ({ row }) => (
					<div className="flex items-center gap-2">
						<ContentAvatar
							Icon={IconSchool}
							coverKey={row.original.coverKey}
						/>
						<div className="flex min-w-0 flex-col">
							<span className="line-clamp-1 text-[13px] font-semibold text-foreground">
								{row.original.name}
							</span>
							<span className="text-[11px] text-muted-foreground">{row.original.code}</span>
						</div>
					</div>
				),
			},
			// 2) تكلفة التدريب
			{
				id: "cost",
				header: centeredHeader("تكلفة التدريب"),
				cell: ({ row }) => {
					const c = formatTrainingCost(row.original.trainingCost);
					return (
						<span className="block text-center text-[12px] tabular-nums">{c ?? <Dash />}</span>
					);
				},
			},
			// 3) نوع الدورة
			{
				accessorKey: "type",
				header: "نوع الدورة",
				cell: ({ row }) => (
					<span className="text-[12px] text-foreground">{typeLabel(row.original.type)}</span>
				),
			},
			// 4) الجهة المنفذة — الجهة التي نفّذت الدورة (institution)؛ «—» عند الغياب
			{
				id: "institution",
				header: "الجهة المنفذة",
				cell: ({ row }) =>
					row.original.institution ? (
						<span className="line-clamp-1 text-[12px] text-foreground">
							{row.original.institution}
						</span>
					) : (
						<Dash />
					),
			},
			// 6) مكان الدورة
			{
				id: "location",
				header: centeredHeader("مكان الدورة"),
				cell: ({ row }) => {
					const l = courseLocationLabel(row.original.locationMode);
					return <span className="block text-center text-[12px]">{l ?? <Dash />}</span>;
				},
			},
			// 7) المدربين
			{
				id: "trainers",
				header: centeredHeader("المدربين"),
				cell: ({ row }) => (
					<div className="flex justify-center">
						<TrainerStack people={row.original.trainers} />
					</div>
				),
			},
			// 8) فترة الدورة — مشتقّة (بدء→استحقاق) أو المدة المتوقعة؛ «—» عند الغياب
			{
				id: "duration",
				header: centeredHeader("فترة الدورة"),
				cell: ({ row }) => {
					const d = formatCourseDuration(
						row.original.startDate,
						row.original.dueDate,
						row.original.estimatedDurationWeeks,
					);
					return <span className="block text-center text-[12px]">{d ?? <Dash />}</span>;
				},
			},
			// 9) # المستفيدين
			{
				id: "assigned",
				header: centeredHeader("# المستفيدين"),
				cell: ({ row }) => (
					<span className="block text-center text-[12px] tabular-nums">
						{row.original.assignedCount}
					</span>
				),
			},
			// 10) التقييم (★) — يُعرض فقط عند وجود تقييمات، وإلا «—» (لا 4.9 ملفقة)
			{
				id: "rating",
				header: centeredHeader("التقييم"),
				cell: ({ row }) =>
					row.original.reviewCount > 0 ? (
						<span className="flex items-center justify-center gap-1 text-[12px] tabular-nums">
							<IconStarFilled className="size-3.5 text-amber-500" />
							{row.original.avgRating?.toFixed(1)}
							<span className="text-muted-foreground">({row.original.reviewCount})</span>
						</span>
					) : (
						<span className="block text-center">
							<Dash />
						</span>
					),
			},
			// 11) آخر تحديث
			{
				accessorKey: "updatedAt",
				header: "آخر تحديث",
				cell: ({ row }) => (
					<span className="text-[12px] text-muted-foreground">
						{fmtDate(row.original.updatedAt)}
					</span>
				),
			},
			// 12) تاريخ الإنشاء
			{
				accessorKey: "createdAt",
				header: "تاريخ الإنشاء",
				cell: ({ row }) => (
					<span className="text-[12px] text-muted-foreground">
						{fmtDate(row.original.createdAt)}
					</span>
				),
			},
			// 13) حالة الدورة
			{
				accessorKey: "status",
				header: "حالة الدورة",
				cell: ({ row }) => <StatusPill status={row.original.status} />,
			},
			// 14) الإجراءات — زر «تعيين لموظف» + قائمة الخيارات
			{
				id: "actions",
				header: centeredHeader("الإجراءات"),
				cell: ({ row }) => (
					// إيقاف الانتشار: النقر على الإجراءات لا يفتح صفحة تفاصيل الدورة
					// biome-ignore lint/a11y/noStaticElementInteractions: غلاف لإيقاف انتشار نقر الصف فقط
					// biome-ignore lint/a11y/useKeyWithClickEvents: لا تفاعل لوحة مفاتيح — إيقاف انتشار فقط
					<div
						className="flex items-center justify-center gap-1.5"
						onClick={(e) => e.stopPropagation()}
					>
						<button
							type="button"
							onClick={() => onAssign(row.original)}
							className="flex h-[21px] items-center whitespace-nowrap rounded-[4px] border border-primary/15 bg-background px-1.5 text-[10px] font-medium text-foreground hover:bg-muted"
						>
							تعيين لموظف
						</button>
						<DropdownMenu dir="rtl">
							<DropdownMenuTrigger
								aria-label="خيارات الدورة"
								className="flex size-6 items-center justify-center rounded-md border text-muted-foreground"
							>
								<IconDots className="size-4" />
							</DropdownMenuTrigger>
							{/* قائمة الخيارات (Figma node 4413-494398): فتح/تعديل/استنساخ/تعطيل/حذف — RTL بوسم يمينًا وأيقونة يسارًا */}
							<DropdownMenuContent
								align="end"
								className="w-[177px] gap-1 rounded-[4px] border border-[#E5E5E5] p-3 shadow-[0px_4px_12px_rgba(0,0,0,0.12)]"
							>
								{[
									{ label: "فتح", Icon: IconExternalLink, on: () => onOpen(row.original) },
									{ label: "تعديل", Icon: IconPencil, on: () => onEdit(row.original) },
									{ label: "استنساخ", Icon: IconCopy, on: () => onDuplicate(row.original) },
									// الدورة المعطّلة (ARCHIVED) يُعرض لها الإجراء المعاكس
									row.original.status === "ARCHIVED"
										? {
												label: "إلغاء التعطيل",
												Icon: IconCircleCheck,
												on: () => onEnable(row.original),
											}
										: { label: "تعطيل", Icon: IconBan, on: () => onDisable(row.original) },
								].map(({ label, Icon, on }) => (
									<DropdownMenuItem
										key={label}
										onSelect={on}
										// الأيقونة تتصدّر يمينًا والنص يليها يسارًا (التدفّق يبدأ من اليمين في RTL)
										className="h-[29px] rounded-[4px] px-2 text-[12px] font-bold text-[#08090A] focus:bg-[#F2F2F2]"
									>
										<Icon className="size-4 text-[#08090A]" />
										{label}
									</DropdownMenuItem>
								))}
								<DropdownMenuItem
									variant="destructive"
									onSelect={() => onDelete(row.original)}
									className="h-[29px] rounded-[4px] px-2 text-[12px] font-bold focus:bg-[#F2F2F2]"
								>
									<IconTrash className="size-4" />
									حذف
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				),
			},
		],
		[onDelete, onEdit, onOpen, onDuplicate, onDisable, onEnable, onAssign],
	);

	// TableDataView يضع عرض كل عمود من getSize() (افتراضي 150px × 14 = تمرير أفقي).
	// نُعيّن أحجامًا مضغوطة (COLUMN_SIZES) مجموعها أقلّ من عرض الحاوية فيمدّدها table-fixed لملئها بلا تمرير.
	const sizedColumns = useMemo(
		() => columns.map((c, i) => ({ ...c, size: COLUMN_SIZES[i] })),
		[columns],
	);

	const table = useReactTable({
		data: courses,
		columns: sizedColumns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<TableDataView
			table={table}
			columns={sizedColumns}
			isPending={isLoading}
			// 14 عمودًا تتّسع ضمن عرض الحاوية (table-fixed) بلا تمرير أفقي — خلايا مضغوطة
			tableClassName="w-full"
			onRowClick={onRowOpen ? (row) => onRowOpen(row.original) : undefined}
			renderAfterRow={(row) =>
				cloningCourseId === row.original.id ? (
					<CourseCloneRow
						name={row.original.name}
						colSpan={sizedColumns.length}
					/>
				) : null
			}
		/>
	);
}
