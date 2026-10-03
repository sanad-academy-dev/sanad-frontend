import { IconPlus } from "@tabler/icons-react";
import {
	type ColumnDef,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";

import { Stats } from "@/components/common/stats";
import { TableDataView } from "@/components/common/table-data-view";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { TabIntro } from "@/features/accounting/extended/components/extended-shared";
import { EnrollSheet } from "@/features/accounting/memberships/components/enroll-sheet";
import { MemberDetailSheet } from "@/features/accounting/memberships/components/member-detail-sheet";
import { MEMBERSHIP_STATUS_META } from "@/features/accounting/memberships/components/membership-status-meta";
import {
	useMembershipPlans,
	useMemberships,
	useRunMembershipDaily,
} from "@/features/accounting/memberships/hooks/use-memberships";
import { formatAmount, formatDisplayDate } from "@/features/accounting/utils/format-amount";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import type { MembershipStatus } from "@/generated/prisma/enums";
import type { MembershipResponse } from "@/server/accounting/membership/membership.type";

/**
 * [MI-P1] Tab «الأعضاء» (FR-M5): filterable list with the six status chips, the enroll
 * sheet, the detail sheet, and the manual daily-run button — the SAME service the daily
 * job calls, so what the operator triggers by hand is what runs unattended.
 *
 * [UI] On the `/services/staff` contract: `TableToolbar` + `TableDataView`. The search field
 * stays hidden — `useMemberships` filters by status and plan on the SERVER and takes no
 * search term, so a search box here could only slice the loaded page while the filters beside
 * it query the server. The two filters keep their single-select server semantics.
 */

const ALL = "__all__";

export const MembersTab = ({
	enrollOwnerId,
	enrollPlanId,
}: {
	/** [CRM-P2] §7.3 — arriving from the CRM win flow opens the sheet pre-filled. */
	enrollOwnerId?: string;
	enrollPlanId?: string;
} = {}) => {
	const [statusFilter, setStatusFilter] = useState<string>(ALL);
	const [planFilter, setPlanFilter] = useState<string>(ALL);
	const { memberships, isLoading } = useMemberships({
		status: statusFilter === ALL ? undefined : (statusFilter as MembershipStatus),
		planId: planFilter === ALL ? undefined : planFilter,
	});
	const { plans } = useMembershipPlans();
	const { runDaily, isPending: running } = useRunMembershipDaily();
	const [enrollOpen, setEnrollOpen] = useState(false);
	const [detailId, setDetailId] = useState<string | null>(null);

	/**
	 * [CRM-P2] §7.3 — the deep link opens the sheet with the owner and plan already chosen.
	 * It stops there: the operator still presses «تسجيل», because enrolling on navigation
	 * would make a link a financial action.
	 */
	useEffect(() => {
		if (enrollOwnerId && enrollPlanId) setEnrollOpen(true);
	}, [enrollOwnerId, enrollPlanId]);

	// الأرقام مشتقّة من القائمة المعروضة نفسها — لا استعلام جديد
	const stats = useMemo<StatItem[]>(() => {
		const by = (status: string) => memberships.filter((row) => row.status === status).length;
		return [
			{
				title: "إجمالي العضويات",
				value: memberships.length,
				tooltip: "عدد العضويات في القائمة المعروضة حاليًا بعد تطبيق التصفية",
			},
			{ title: "نشطة", value: by("ACTIVE"), tooltip: "عضويات سُدِّدت فاتورتها وهي سارية" },
			{
				title: "بانتظار الدفع",
				value: by("PENDING_PAYMENT"),
				tooltip: "عضويات صدرت فاتورتها ولم تُسدَّد بعد",
			},
			{
				title: "متأخرة أو منقضية",
				value: by("PAST_DUE") + by("LAPSED"),
				tooltip: "عضويات تجاوزت موعد السداد — ضمن مهلة السماح أو بعدها",
			},
		];
	}, [memberships]);

	// useReactTable يشترط مرجعًا ثابتًا لـ data — مصفوفة جديدة كل رسم تُعيد ضبط الترقيم بلا نهاية
	const rows = useMemo(() => memberships, [memberships]);

	const columns = useMemo<ColumnDef<MembershipResponse>[]>(
		() => [
			{
				accessorKey: "owner",
				header: "وليّ الأمر",
				cell: ({ row }) => (
					<div className="flex flex-col">
						<span className="font-semibold text-sm">{row.original.owner.name}</span>
						<span className="text-muted-foreground text-xs tabular-nums">
							{row.original.code}
						</span>
					</div>
				),
			},
			{
				accessorKey: "plan",
				header: "الخطة",
				cell: ({ row }) => (
					<span className="text-sm">
						{row.original.plan.name}
						{row.original.scheduledPlan && (
							<span className="text-muted-foreground text-xs">
								{" "}
								← {row.original.scheduledPlan.name}
							</span>
						)}
					</span>
				),
			},
			{
				accessorKey: "feeSnapshot",
				header: "الرسم",
				cell: ({ row }) => (
					<span className="text-sm tabular-nums">
						{formatAmount(row.original.feeSnapshot.toString())}
					</span>
				),
			},
			{
				id: "period",
				header: "الفترة الحالية",
				cell: ({ row }) => (
					<span className="text-sm tabular-nums">
						{formatDisplayDate(row.original.currentPeriodStart)} ←{" "}
						{formatDisplayDate(row.original.currentPeriodEnd)}
					</span>
				),
			},
			{
				accessorKey: "status",
				header: "الحالة",
				cell: ({ row }) => (
					<Badge variant={MEMBERSHIP_STATUS_META[row.original.status].variant}>
						{MEMBERSHIP_STATUS_META[row.original.status].label}
					</Badge>
				),
			},
		],
		[],
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
		<>
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
					<>
						<Select
							value={statusFilter}
							onValueChange={setStatusFilter}
						>
							<SelectTrigger className="h-6 w-44 text-[12px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent dir="rtl">
								<SelectItem value={ALL}>كل الحالات</SelectItem>
								{Object.entries(MEMBERSHIP_STATUS_META).map(([value, meta]) => (
									<SelectItem
										key={value}
										value={value}
									>
										{meta.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Select
							value={planFilter}
							onValueChange={setPlanFilter}
						>
							<SelectTrigger className="h-6 w-44 text-[12px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent dir="rtl">
								<SelectItem value={ALL}>كل الخطط</SelectItem>
								{plans.map((plan) => (
									<SelectItem
										key={plan.id}
										value={plan.id}
									>
										{plan.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Button
							type="button"
							size="xs"
							variant="outline"
							className="gap-1.5 px-2"
							disabled={running}
							onClick={() => runDaily({})}
						>
							تشغيل معالجة اليوم
						</Button>
					</>
				}
				actions={
					<Button
						size="sm"
						onClick={() => setEnrollOpen(true)}
					>
						<IconPlus />
						تسجيل عضوية
					</Button>
				}
			/>

			<TabIntro
				title="الأعضاء"
				hint="الحالات مشتقّة من سداد فاتورة الاشتراك — لا أحد «يضبطها» يدويًا: الدفع يُفعّل، والتأخر يُعلّق ثم يُنقضي، والإلغاء وحده قرار مشغّل بسبب إلزامي."
			/>

			<TableDataView
				table={table}
				columns={columns}
				isPending={isLoading}
				onRowClick={(row) => setDetailId(row.original.id)}
				emptyState={{
					title: "لا عضويات بعد",
					description:
						"سجّل وليّ أمرًا في خطة — تصدر فاتورة الفترة الأولى فورًا وتتفعّل العضوية بسدادها.",
					action: { label: "تسجيل عضوية", onClick: () => setEnrollOpen(true) },
				}}
			/>

			<EnrollSheet
				open={enrollOpen}
				onOpenChange={setEnrollOpen}
				defaultOwnerId={enrollOwnerId}
				defaultPlanId={enrollPlanId}
			/>
			<MemberDetailSheet
				membershipId={detailId}
				onOpenChange={(open) => {
					if (!open) setDetailId(null);
				}}
			/>
		</>
	);
};
