import { IconBug, IconFlame, IconScissors } from "@tabler/icons-react";
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
import { GroomingToolbar } from "@/features/care/grooming/components/grooming-toolbar";
import { GroomingLane, MattingGrade, ParasiteFinding } from "@/generated/prisma/enums";
import type {
	GroomingPeriod,
	GroomingSessionCard,
	GroomingView,
} from "@/server/grooming/grooming.type";
import {
	GROOMING_STATUS_LABELS,
	MATTING_GRADE_LABELS,
} from "@sanad/contracts/runtime/server/grooming/grooming.workflow";

const timeFmt = new Intl.DateTimeFormat("ar", { hour: "2-digit", minute: "2-digit" });
const dateFmt = new Intl.DateTimeFormat("ar", { dateStyle: "medium" });

/** نبرة الحالة — العهدة تُبرز، والنهائية تهدأ */
const STATUS_TONE = (status: GroomingSessionCard["status"]) => {
	if (status === "READY") return "default" as const;
	if (status === "CANCELLED" || status === "NO_SHOW" || status === "ESCALATED")
		return "destructive" as const;
	if (status === "COMPLETED" || status === "PICKED_UP") return "secondary" as const;
	return "outline" as const;
};

export function GroomingSessionsTable({
	cards,
	isLoading,
	search,
	onSearchChange,
	period,
	onPeriodChange,
	view,
	onViewChange,
	onOpen,
	onCreate,
}: {
	cards: GroomingSessionCard[];
	isLoading: boolean;
	search: string;
	onSearchChange: (value: string) => void;
	period: GroomingPeriod;
	onPeriodChange: (value: GroomingPeriod) => void;
	view: GroomingView;
	onViewChange: (value: GroomingView) => void;
	onOpen: (id: string) => void;
	onCreate: () => void;
}) {
	const columns = useMemo<ColumnDef<GroomingSessionCard>[]>(
		() => [
			{
				accessorKey: "code",
				header: "الجلسة",
				cell: ({ row }) => (
					<div className="flex min-w-0 flex-col">
						<span className="truncate font-medium">{row.original.patient.name}</span>
						<span className="truncate text-muted-foreground text-xs tabular-nums">
							{row.original.code}
						</span>
					</div>
				),
			},
			{
				id: "animal",
				header: "النوع والسلالة",
				cell: ({ row }) => (
					<div className="flex min-w-0 flex-col">
						<span className="truncate">{row.original.patient.animalType?.arName ?? "—"}</span>
						<span className="truncate text-muted-foreground text-xs">
							{row.original.patient.animalStrain?.arName ?? "—"}
						</span>
					</div>
				),
			},
			{
				id: "owner",
				header: "وليّ الأمر",
				cell: ({ row }) => (
					<div className="flex min-w-0 flex-col">
						<span className="truncate">{row.original.owner?.name ?? "—"}</span>
						<span
							className="truncate text-muted-foreground text-xs tabular-nums"
							dir="ltr"
						>
							{row.original.owner?.phone ?? ""}
						</span>
					</div>
				),
			},
			{
				accessorKey: "status",
				header: "الحالة",
				cell: ({ row }) => (
					<Badge variant={STATUS_TONE(row.original.status)}>
						{GROOMING_STATUS_LABELS[row.original.status]}
					</Badge>
				),
			},
			{
				id: "risk",
				header: "تنبيهات",
				cell: ({ row }) => {
					const c = row.original;
					const heat =
						c.intake?.heatDryProhibitedSnapshot === true ||
						c.patient.animalStrain?.isBrachycephalic === true;
					const parasites =
						c.intake?.parasiteFinding != null &&
						c.intake.parasiteFinding !== ParasiteFinding.NONE;
					const matted =
						c.intake?.mattingGrade === MattingGrade.SEVERE ||
						c.intake?.mattingGrade === MattingGrade.PELTED;
					if (!heat && !parasites && !matted && c.lane !== GroomingLane.MEDICAL) {
						return <span className="text-muted-foreground">—</span>;
					}
					return (
						<div className="flex flex-wrap items-center gap-1">
							{heat && (
								<Badge
									variant="destructive"
									className="gap-1"
								>
									<IconFlame className="size-3" />
									لا تجفيف حارّ
								</Badge>
							)}
							{parasites && (
								<Badge
									variant="destructive"
									className="gap-1"
								>
									<IconBug className="size-3" />
									طفيليات
								</Badge>
							)}
							{matted && c.intake?.mattingGrade && (
								<Badge variant="outline">
									تعقّد {MATTING_GRADE_LABELS[c.intake.mattingGrade]}
								</Badge>
							)}
							{c.lane === GroomingLane.MEDICAL && <Badge variant="secondary">طبي</Badge>}
						</div>
					);
				},
			},
			{
				accessorKey: "scheduledAt",
				header: "الموعد",
				cell: ({ row }) => (
					<div className="flex min-w-0 flex-col tabular-nums">
						<span>{timeFmt.format(new Date(row.original.scheduledAt))}</span>
						<span className="text-muted-foreground text-xs">
							{dateFmt.format(new Date(row.original.scheduledAt))}
						</span>
					</div>
				),
			},
			{
				id: "groomer",
				header: "المُجمِّل",
				cell: ({ row }) => (
					<span className="truncate">{row.original.groomer?.user?.name ?? "—"}</span>
				),
			},
			{
				accessorKey: "quoteTotal",
				header: "التسعيرة",
				cell: ({ row }) => (
					<span className="tabular-nums">{Number(row.original.quoteTotal)} ر.س</span>
				),
			},
		],
		[],
	);

	const table = useReactTable({
		data: cards,
		columns,
		state: { globalFilter: search },
		onGlobalFilterChange: (updater) =>
			onSearchChange(typeof updater === "function" ? updater(search) : String(updater)),
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<GroomingToolbar
				className="border-t"
				search={search}
				onSearchChange={onSearchChange}
				period={period}
				onPeriodChange={onPeriodChange}
				view={view}
				onViewChange={onViewChange}
				onCreate={onCreate}
			/>
			<TableDataView
				table={table}
				columns={columns}
				isPending={isLoading}
				onRowClick={(row) => onOpen(row.original.id)}
				emptyState={{
					title: "لا جلسات تجميل بعد",
					description: "ابدأ بحجز جلسة — تُسعَّر تلقائيًا حسب سلالة الطفل وحجمه ونوع فروه",
					icon: <IconScissors className="size-10 text-[#9CA3AF]" />,
					action: { label: "جلسة تجميل جديدة", onClick: onCreate },
				}}
			/>
		</div>
	);
}
