import { IconCircleCheck, IconDots } from "@tabler/icons-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	type ColumnDef,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { Stats } from "@/components/common/stats";
import { TableDataView } from "@/components/common/table-data-view";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCrmTaskInbox, useUpdateCrmTask } from "@/features/crm/hooks/use-crm-activities";
import { CrmModuleHeader } from "@/features/crm/navigation/crm-module-header";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSIONS } from "@/lib/permissions";
import type { CrmTaskResponse } from "@/server/crm/crm-leads/crm-leads.type";

/**
 * [CRM-P1] «المهام» (§11.1) — the clinic-wide CRM task inbox. `mine` narrows a full-scope
 * user to their own; a `view_limited` user is already narrowed server-side and the toggle
 * simply cannot widen them (§3.2).
 *
 * [UI] On the `/services/staff` layout contract. The header title is the one exception to
 * the "add a sidebar.items key" rule: the layout derives its title from the LAST path
 * segment, so `/crm/tasks` and `/tasks` both resolve `sidebar.items.tasks` — «مهامي», the
 * personal inbox. A wrong title is worse than none, so this page suppresses the derived
 * title and portals its own, the way `ReportDetailBreadcrumb` already does for the same
 * collision.
 */
export const Route = createFileRoute("/_pathless-layout/crm/tasks")({
	component: CrmTasksRoute,
});

const STATUS_LABEL: Record<string, string> = {
	BACKLOG: "قائمة الانتظار",
	TODO: "للتنفيذ",
	IN_PROGRESS: "قيد التنفيذ",
	DONE: "منجزة",
	CANCELLED: "ملغاة",
};

// الأولوية كانت تُعرض بقيمة الـ enum الخام (LOW/MEDIUM/HIGH) على الشاشة
const PRIORITY_LABEL: Record<string, string> = {
	LOW: "منخفضة",
	MEDIUM: "متوسطة",
	HIGH: "عالية",
};

const formatDue = (value: string | Date | null | undefined): string =>
	value ? new Date(value).toLocaleDateString("ar", { dateStyle: "short" }) : "—";

function CrmTasksRoute() {
	const [mine, setMine] = useState(true);
	const { tasks, isLoading } = useCrmTaskInbox(mine);
	const { updateTask, isUpdating } = useUpdateCrmTask();
	const { hasPermission } = usePermissions();
	const canEdit = hasPermission(PERMISSIONS.CRM_TASKS_EDIT);

	// الأرقام مشتقّة من القائمة المعروضة نفسها — لا استعلام جديد
	const stats = useMemo<StatItem[]>(() => {
		const by = (status: string) => tasks.filter((task) => task.status === status).length;
		return [
			{
				title: "إجمالي المهام",
				value: tasks.length,
				tooltip: mine ? "مهامك أنت في القائمة المعروضة" : "كل مهام الفريق في القائمة المعروضة",
			},
			{ title: "للتنفيذ", value: by("TODO"), tooltip: "مهام لم يبدأ العمل عليها بعد" },
			{ title: "قيد التنفيذ", value: by("IN_PROGRESS"), tooltip: "مهام العمل عليها جارٍ" },
			{ title: "منجزة", value: by("DONE"), tooltip: "مهام أُنهيت" },
		];
	}, [tasks, mine]);

	// useReactTable يشترط مرجعًا ثابتًا لـ data — مصفوفة جديدة كل رسم تُعيد ضبط الترقيم بلا نهاية
	const rows = useMemo(() => tasks, [tasks]);

	const columns = useMemo<ColumnDef<CrmTaskResponse>[]>(
		() => [
			{
				accessorKey: "title",
				header: "المهمة",
				cell: ({ row }) => (
					<span className="font-medium text-sm">
						{/* §8.2 — every CRM task hangs off a lead, so the row links back to it */}
						{row.original.referenceId ? (
							<Link
								to="/crm/leads/$leadId"
								params={{ leadId: row.original.referenceId }}
								className="hover:underline"
								onClick={(e) => e.stopPropagation()}
							>
								{row.original.title}
							</Link>
						) : (
							row.original.title
						)}
					</span>
				),
			},
			{
				accessorKey: "status",
				header: "الحالة",
				cell: ({ row }) => (
					<span className="text-sm">
						{STATUS_LABEL[row.original.status] ?? row.original.status}
					</span>
				),
			},
			{
				accessorKey: "priority",
				header: "الأولوية",
				cell: ({ row }) => (
					<span className="text-sm">
						{PRIORITY_LABEL[row.original.priority] ?? row.original.priority}
					</span>
				),
			},
			{
				accessorKey: "dueAt",
				header: "الاستحقاق",
				cell: ({ row }) => (
					<span className="text-sm tabular-nums">{formatDue(row.original.dueAt)}</span>
				),
			},
			{
				id: "assignedTo",
				header: "المسؤول",
				cell: ({ row }) => (
					<span className="text-sm">{row.original.assignedTo?.name ?? "غير مُسنَد"}</span>
				),
			},
			{
				id: "actions",
				header: "",
				cell: ({ row }) =>
					canEdit && row.original.status !== "DONE" ? (
						// biome-ignore lint/a11y/noStaticElementInteractions: حارس انتشار فقط لإيقاف فتح الصف
						// biome-ignore lint/a11y/useKeyWithClickEvents: حارس انتشار فقط؛ عناصر القائمة قابلة للوصول بلوحة المفاتيح
						<div onClick={(e) => e.stopPropagation()}>
							<DropdownMenu dir="rtl">
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="size-8"
										disabled={isUpdating}
									>
										<IconDots className="size-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start">
									<DropdownMenuItem
										className="gap-2"
										onSelect={() => updateTask({ taskId: row.original.id, status: "DONE" })}
									>
										<IconCircleCheck className="size-4" />
										إنهاء
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					) : null,
			},
		],
		[canEdit, isUpdating, updateTask],
	);

	const table = useReactTable({
		data: rows,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: { pagination: { pageSize: 20 } },
	});

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<CrmModuleHeader active="/crm/tasks" />

			<Stats
				className="px-4 grid-cols-4"
				stats={stats}
			/>

			<TableToolbar
				className="border-t"
				showSearch={false}
				showFilter={false}
				showExport={false}
				showView={false}
				buttonSize="xs"
				leftExtra={
					<Button
						type="button"
						size="xs"
						variant={mine ? "default" : "outline"}
						className="gap-1.5 px-2"
						onClick={() => setMine((current) => !current)}
					>
						{mine ? "مهامي" : "كل المهام"}
					</Button>
				}
			/>

			<TableDataView
				table={table}
				columns={columns}
				isPending={isLoading}
				emptyState={{
					title: "لا توجد مهام",
					description: mine
						? "لا مهام مُسنَدة إليك الآن — بدّل إلى «كل المهام» لرؤية مهام بقيّة الفريق"
						: "تُنشَأ المهام من خطّ زمن العميل المحتمل أو الصفقة",
				}}
			/>
		</div>
	);
}
