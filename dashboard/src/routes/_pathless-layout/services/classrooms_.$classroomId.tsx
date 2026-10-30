import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
	IconAlertTriangle,
	IconChevronLeft,
	IconDots,
	IconEdit,
	IconTrash,
	IconUserPlus,
	IconUsers,
} from "@tabler/icons-react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ClassroomDialog } from "@/features/services/classrooms/components/classroom-dialog";
import { AssignStaffDialog } from "@/features/services/classrooms/components/assign-staff-dialog";
import { AssignStudentDialog } from "@/features/services/classrooms/components/assign-student-dialog";
import { DeleteClassroomDialog } from "@/features/services/classrooms/components/delete-classroom-dialog";
import { ClassroomOverviewTab } from "@/features/services/classrooms/components/tabs/classroom-overview-tab";
import { ClassroomStaffTab } from "@/features/services/classrooms/components/tabs/classroom-staff-tab";
import { ClassroomStudentsTab } from "@/features/services/classrooms/components/tabs/classroom-students-tab";
import { ClassroomScheduleTab } from "@/features/services/classrooms/components/tabs/classroom-schedule-tab";
import { ClassroomStatsTab } from "@/features/services/classrooms/components/tabs/classroom-stats-tab";
import { useClassroom } from "@/features/services/classrooms/hooks/use-classrooms";
import { usePageHeaderTakeover } from "@/hooks/use-page-header-takeover";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_pathless-layout/services/classrooms_/$classroomId")({
	component: ClassroomDetailPage,
});

const CLASSROOM_TABS = [
	{ value: "overview", label: "معلومات الفصل" },
	{ value: "staff", label: "الموظفين" },
	{ value: "students", label: "الطلاب" },
	{ value: "schedule", label: "التقويم" },
	{ value: "stats", label: "الإحصائيات" },
] as const;

type ClassroomTabValue = (typeof CLASSROOM_TABS)[number]["value"];

function ClassroomDetailPage() {
	const { classroomId } = Route.useParams();
	const navigate = useNavigate();
	const { classroom, isLoading, refetch } = useClassroom(classroomId);

	// التبويب النشط افتراضياً هو "معلومات الفصل"
	const [activeTab, setActiveTab] = useState<ClassroomTabValue>("overview");
	const [editOpen, setEditOpen] = useState(false);
	const [assignStaffOpen, setAssignStaffOpen] = useState(false);
	const [assignStudentOpen, setAssignStudentOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

	// فتحة الهيدر العلوي في التخطيط العام — نحقن فيها مسار التنقل والتبويبات الموحدة
	const setTitleSuppressed = usePageHeaderTakeover((state) => state.setTitleSuppressed);
	const [slot, setSlot] = useState<HTMLElement | null>(null);

	useEffect(() => {
		setSlot(document.getElementById("page-header-slot"));
	}, []);

	useEffect(() => {
		setTitleSuppressed(true);
		return () => setTitleSuppressed(false);
	}, [setTitleSuppressed]);

	if (isLoading) {
		return (
			<div className="flex flex-1 items-center justify-center min-h-[400px]">
				<Spinner /> ى
			</div>
		);
	}

	if (!classroom) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
				<IconAlertTriangle className="size-10 text-amber-500" />
				<h2 className="text-lg font-bold">لم يتم العثور على الفصل الدراسي</h2>
				<p className="text-sm text-muted-foreground">الفصل المطلوب غير موجود أو ربما تم حذفه.</p>
				<Button asChild variant="outline">
					<Link to="/services/classrooms">العودة لقائمة الفصول</Link>
				</Button>
			</div>
		);
	}

	// ترويسة الصفحة الموحدة — تُحقن عبر الـ Portal في شريط الهيدر العلوي مطابقة للصورة تماماً
	const headerContent = (
		<div className="flex items-center gap-2" dir="rtl">
			{/* مسار التنقل: الفصول > اسم الفصل */}
			<Link
				to="/services/classrooms"
				className="whitespace-nowrap text-xs font-semibold text-foreground hover:underline"
			>
				الفصول
			</Link>
			<IconChevronLeft className="size-3 shrink-0 text-muted-foreground ltr:rotate-180" />
			<span className="whitespace-nowrap text-xs font-bold text-foreground">
				{classroom.name}
			</span>

			{/* كود ومعرف الفصل */}
			{classroom.code && (
				<span className="text-[11px] font-mono text-muted-foreground bg-muted/70 px-1.5 py-0.5 rounded border border-border/60">
					#{classroom.code}
				</span>
			)}

			{/* قائمة خيارات الفصل المصغرة (3 نقاط) */}
			<DropdownMenu dir="rtl">
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="size-6 text-muted-foreground hover:text-foreground"
					>
						<IconDots className="size-3.5" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					<DropdownMenuItem className="gap-2 text-xs" onSelect={() => setEditOpen(true)}>
						<IconEdit className="size-3.5" />
						تعديل الفصل
					</DropdownMenuItem>
					<DropdownMenuItem className="gap-2 text-xs" onSelect={() => setAssignStaffOpen(true)}>
						<IconUserPlus className="size-3.5" />
						تعيين موظف
					</DropdownMenuItem>
					<DropdownMenuItem className="gap-2 text-xs" onSelect={() => setAssignStudentOpen(true)}>
						<IconUsers className="size-3.5" />
						تعيين طالب
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="gap-2 text-xs text-destructive"
						onSelect={() => setDeleteOpen(true)}
					>
						<IconTrash className="size-3.5" />
						حذف الفصل
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* فاصل */}
			<span className="h-4 w-px bg-border shrink-0" />

			{/* تبويبات الفصل في الهيدر العلوي مطابقة للصورة تماماً */}
			<nav className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
				{CLASSROOM_TABS.map((tItem) => {
					const isActive = activeTab === tItem.value;
					return (
						<button
							key={tItem.value}
							type="button"
							onClick={() => setActiveTab(tItem.value)}
							aria-pressed={isActive}
							className={cn(
								"flex h-[26px] items-center justify-center whitespace-nowrap rounded-[4px] border-[0.75px] px-2.5 text-[11px] font-medium transition-colors cursor-pointer",
								isActive
									? "border-border bg-background font-semibold text-foreground shadow-2xs"
									: "border-transparent text-muted-foreground hover:bg-muted/70 hover:text-foreground",
							)}
						>
							{tItem.label}
						</button>
					);
				})}
			</nav>
		</div>
	);

	return (
		<div className="flex flex-1 flex-col min-h-0 overflow-hidden" dir="rtl">
			{/* حقن الترويسة والتبويبات في الهيدر العلوي الموحد */}
			{slot && createPortal(headerContent, slot)}

			{/* محتوى التبويب النشط */}
			<div className="flex-1 flex flex-col min-h-0">
				{activeTab === "staff" && (
					<ClassroomStaffTab classroom={classroom} onRefetch={refetch} />
				)}

				{activeTab === "overview" && (
					<ClassroomOverviewTab
						classroom={classroom}
						onEdit={() => setEditOpen(true)}
						onAssignStaff={() => setAssignStaffOpen(true)}
						onAssignStudent={() => setAssignStudentOpen(true)}
					/>
				)}

				{activeTab === "students" && (
					<ClassroomStudentsTab classroom={classroom} onRefetch={refetch} />
				)}

				{activeTab === "schedule" && (
					<ClassroomScheduleTab classroom={classroom} />
				)}

				{activeTab === "stats" && (
					<ClassroomStatsTab classroom={classroom} />
				)}
			</div>

			{/* نوافذ الإجراءات (تعديل / تعيين / حذف) */}
			<ClassroomDialog
				open={editOpen}
				onClose={() => {
					setEditOpen(false);
					refetch();
				}}
				classroom={classroom}
			/>

			<AssignStaffDialog
				open={assignStaffOpen}
				onOpenChange={(open) => {
					setAssignStaffOpen(open);
					if (!open) refetch();
				}}
				classroom={classroom}
			/>

			<AssignStudentDialog
				open={assignStudentOpen}
				onOpenChange={(open) => {
					setAssignStudentOpen(open);
					if (!open) refetch();
				}}
				classroom={classroom}
			/>

			<DeleteClassroomDialog
				classroom={deleteOpen ? classroom : null}
				onClose={() => {
					setDeleteOpen(false);
				}}
				onSuccess={() => {
					setDeleteOpen(false);
					navigate({ to: "/services/classrooms" });
				}}
			/>
		</div>
	);
}
