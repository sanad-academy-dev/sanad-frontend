import { IconAlertTriangle, IconClockHour4, IconPlayerPlay } from "@tabler/icons-react";
import {
	type ColumnDef,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";

import { TableDataView } from "@/components/common/table-data-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ACUITY_META, DUE_STATUS_META } from "@/features/care/inpatients/data/inpatients-data";
import { cn } from "@/lib/utils";
import type { InpatientDueStatus } from "@/server/inpatients/inpatient-due.service";

const timeFmt = new Intl.DateTimeFormat("ar", { dateStyle: "short", timeStyle: "short" });
const at = (v: Date | string | null | undefined) => (v ? timeFmt.format(new Date(v)) : "—");

/**
 * قائمة المستحقّ — «ما الذي فات في العنبر الآن؟»
 *
 * جدول لا لوحة: السؤال هنا ترتيبٌ بالإلحاح عبر كل الإقامات، لا حالةُ إقامة
 * بعينها. والصفّ يُفتح على ورقة الإقامة، فالانتقال من «فات» إلى «نفّذه» خطوة
 * واحدة لا بحثٌ في اللوحة عن الطفل.
 */

export type InpatientDueRow = {
	id: string;
	code: string;
	acuity: keyof typeof ACUITY_META;
	patient: { name: string; code: string };
	owner: { name: string };
	attendingStaff: { name: string };
	cageAssignments: { cage: { name: string; room: { name: string } } }[];
	due: {
		status: InpatientDueStatus;
		overdue: { id: string; label: string; minutesLate: number; dueAt: string }[];
		due: { id: string; label: string; dueAt: string }[];
		vitals: { state: string; minutesLate: number };
	};
};

/**
 * ما المطلوب الآن، ومن يفعله بضغطة.
 *
 * الجدول كان يقول «فات» ولا يقول «افعل»: من يقرأ صفًّا أحمر كان عليه أن يفتح
 * الورقة ثم يبحث عن اللسان ثم عن السطر. الزرّ هنا يسمّي الفعل ويفتح الورقة على
 * لسانه مباشرة — والفعل نفسه يبقى في مكانه الواحد لا يُستنسخ هنا.
 */
const quickAction = (
	row: InpatientDueRow,
): { label: string; tab: string; urgent: boolean } | null => {
	const d = row.due;
	if (d.overdue.length > 0) return { label: "أعطِ الجرعة", tab: "mar", urgent: true };
	if (d.vitals.state === "OVERDUE" || d.vitals.state === "NO_BASELINE") {
		return { label: "سجّل القياس", tab: "flowsheet", urgent: true };
	}
	if (d.due.length > 0) return { label: "أعطِ الجرعة", tab: "mar", urgent: false };
	if (d.vitals.state === "DUE")
		return { label: "سجّل القياس", tab: "flowsheet", urgent: false };
	return null;
};

export function InpatientsDueTable({
	rows,
	onOpen,
	isLoading,
}: {
	rows: InpatientDueRow[];
	onOpen: (id: string, tab?: string) => void;
	isLoading?: boolean;
}) {
	const columns = useMemo<ColumnDef<InpatientDueRow>[]>(
		() => [
			{
				accessorKey: "patient",
				header: "الطفل",
				cell: ({ row }) => (
					<div className="flex min-w-0 items-center gap-2">
						<span
							className={cn(
								"size-2 shrink-0 rounded-full",
								ACUITY_META[row.original.acuity]?.dot,
							)}
							aria-hidden
						/>
						<div className="flex min-w-0 flex-col">
							<span className="truncate font-medium">{row.original.patient.name}</span>
							<span className="truncate text-muted-foreground text-xs tabular-nums">
								{row.original.code}
							</span>
						</div>
					</div>
				),
			},
			{
				id: "cage",
				header: "القفص",
				cell: ({ row }) => {
					const cage = row.original.cageAssignments[0]?.cage;
					return cage ? (
						<div className="flex min-w-0 flex-col">
							<span className="truncate">{cage.name}</span>
							<span className="truncate text-muted-foreground text-xs">{cage.room.name}</span>
						</div>
					) : (
						<span className="text-muted-foreground text-xs">بلا إسكان</span>
					);
				},
			},
			{
				id: "overdue",
				header: "ما فات موعده",
				cell: ({ row }) => {
					const items = row.original.due.overdue;
					if (items.length === 0) {
						return <span className="text-muted-foreground text-xs">—</span>;
					}
					const first = items[0];
					return (
						<div className="flex min-w-0 items-center gap-1.5">
							<IconAlertTriangle className="size-3.5 shrink-0 text-destructive" />
							<span className="truncate text-sm">{first.label}</span>
							<span className="shrink-0 text-destructive text-xs tabular-nums">
								{first.minutesLate} د
							</span>
							{items.length > 1 && (
								<Badge
									variant="outline"
									className="h-4 shrink-0 px-1 text-[10px]"
								>
									+{items.length - 1}
								</Badge>
							)}
						</div>
					);
				},
			},
			{
				id: "dueNow",
				header: "مستحقّ الآن",
				cell: ({ row }) => {
					const items = row.original.due.due;
					if (items.length === 0) {
						return <span className="text-muted-foreground text-xs">—</span>;
					}
					return (
						<div className="flex min-w-0 items-center gap-1.5">
							<IconClockHour4 className="size-3.5 shrink-0 text-amber-600" />
							<span className="truncate text-sm">{items[0].label}</span>
							<span className="shrink-0 text-muted-foreground text-xs tabular-nums">
								{at(items[0].dueAt)}
							</span>
							{items.length > 1 && (
								<Badge
									variant="outline"
									className="h-4 shrink-0 px-1 text-[10px]"
								>
									+{items.length - 1}
								</Badge>
							)}
						</div>
					);
				},
			},
			{
				id: "vitals",
				header: "القياس",
				cell: ({ row }) => {
					const v = row.original.due.vitals;
					if (v.state === "NO_BASELINE") {
						return <span className="text-destructive text-xs">لم يُسجَّل بعد</span>;
					}
					if (v.state === "OVERDUE") {
						return (
							<span className="text-destructive text-xs tabular-nums">
								فات {v.minutesLate} د
							</span>
						);
					}
					if (v.state === "DUE") {
						return <span className="text-amber-600 text-xs">مستحقّ</span>;
					}
					return <span className="text-muted-foreground text-xs">منضبط</span>;
				},
			},
			{
				accessorKey: "attendingStaff",
				header: "المدرّب المعالج",
				cell: ({ row }) => (
					<span className="truncate text-sm">{row.original.attendingStaff.name}</span>
				),
			},
			{
				id: "action",
				header: "المطلوب الآن",
				cell: ({ row }) => {
					const action = quickAction(row.original);
					if (!action) return <span className="text-muted-foreground text-xs">—</span>;
					return (
						<Button
							size="sm"
							variant={action.urgent ? "default" : "outline"}
							className="h-7 gap-1 px-2 text-xs"
							onClick={(e) => {
								// الصفّ نفسه يفتح الورقة على «نظرة عامة» — لا تُفتح مرّتين
								e.stopPropagation();
								onOpen(row.original.id, action.tab);
							}}
						>
							<IconPlayerPlay className="size-3.5" />
							{action.label}
						</Button>
					);
				},
			},
			{
				id: "status",
				header: "الحالة",
				cell: ({ row }) => {
					const meta = DUE_STATUS_META[row.original.due.status];
					const Icon = meta.icon;
					return (
						<span
							className={cn(
								"inline-flex items-center gap-1 rounded border px-2 py-1 text-[11px]",
								meta.className,
							)}
						>
							<Icon className="size-3.5" />
							{meta.label}
						</span>
					);
				},
			},
		],
		[onOpen],
	);

	const table = useReactTable({
		data: rows,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<TableDataView
			table={table}
			columns={columns}
			isPending={Boolean(isLoading)}
			onRowClick={(row) => onOpen(row.original.id)}
			emptyState={{
				title: "لا شيء مستحقّ الآن",
				description: "كل جرعات العنبر وقياساته في موعدها.",
			}}
		/>
	);
}
