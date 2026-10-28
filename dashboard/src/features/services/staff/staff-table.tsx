import {
	IconBan,
	IconCircleCheck,
	IconCircleX,
	IconDots,
	IconDownload,
	IconEye,
	IconMail,
	IconPhone,
	IconPlus,
	IconStar,
	IconTrash,
} from "@tabler/icons-react";
import {
	type ColumnDef,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { FiltersMenu } from "@/components/common/filters-menu";
import { TableDataView } from "@/components/common/table-data-view";
import { TableToolbar } from "@/components/common/table-toolbar";
import {
	ViewGridIcon,
	ViewListIcon,
	ViewOptionsMenu,
} from "@/components/common/view-options-menu";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { AddStaffSheet } from "@/features/services/staff/components/add-staff-sheet";
import { DeleteStaffDialog } from "@/features/services/staff/components/delete-staff-dialog";
import { DisableStaffDialog } from "@/features/services/staff/components/disable-staff-dialog";
import { InviteStaffDialog } from "@/features/services/staff/components/invite-staff-dialog";
import { StaffCard } from "@/features/services/staff/components/staff-card";
import { StaffSchedulingPopover } from "@/features/services/staff/components/staff-scheduling-popover";
import { StaffSheet } from "@/features/services/staff/components/staff-sheet";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { useStaffFilters } from "@/features/services/staff/hooks/use-staff-filters";
import { useUpdateStaffStatus } from "@/features/services/staff/hooks/use-update-staff-status";
import { exportStaffCsv } from "@/features/services/staff/utils/export-staff";
import type { StaffResponse } from "@/server/staff/staff.type";
import { StaffStatus } from "@sanad/contracts/runtime/server/staff/staff.type";

import { cn } from "@/lib/utils";

// خيارا العرض — الترتيب هو ترتيب DOM في RTL: «جدول» يمينًا و«قائمة» يسارًا
const VIEW_OPTIONS = [
	{ value: "list" as const, label: "جدول", Icon: ViewListIcon },
	{ value: "grid" as const, label: "قائمة", Icon: ViewGridIcon },
];

const SHIFT_CONFIG: Record<
	string,
	{ label: string; colorClasses: string; dotColor: string }
> = {
	MORNING: {
		label: "صباحي",
		colorClasses:
			"bg-amber-50 text-amber-700 border-amber-200/90 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800",
		dotColor: "bg-amber-500",
	},
	EVENING: {
		label: "مسائي",
		colorClasses:
			"bg-indigo-50 text-indigo-700 border-indigo-200/90 dark:bg-indigo-950/30 dark:text-indigo-300 dark:border-indigo-800",
		dotColor: "bg-indigo-500",
	},
	NIGHT: {
		label: "ليلي",
		colorClasses:
			"bg-purple-50 text-purple-700 border-purple-200/90 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800",
		dotColor: "bg-purple-500",
	},
	BOTH: {
		label: "صباحي ومسائي",
		colorClasses:
			"bg-sky-50 text-sky-700 border-sky-200/90 dark:bg-sky-950/30 dark:text-sky-300 dark:border-sky-800",
		dotColor: "bg-sky-500",
	},
};

type StaffView = (typeof VIEW_OPTIONS)[number]["value"];

function StaffAvatar({ name }: { name: string }) {
	const initials = name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
	return (
		<div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-semibold border border-primary/20">
			{initials}
		</div>
	);
}

const STATUS_CONFIG: Record<
	StaffStatus,
	{ label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
	[StaffStatus.ACTIVE]: { label: "نشط", variant: "default" },
	[StaffStatus.PENDING]: { label: "معلق", variant: "secondary" },
	[StaffStatus.INACTIVE]: { label: "غير نشط", variant: "destructive" },
};

function StaffStatusSelect({
	staff,
	onStatusChange,
	disabled,
}: {
	staff: StaffResponse;
	onStatusChange: (input: { id: string; status: StaffStatus }) => void;
	disabled?: boolean;
}) {
	return (
		<Select
			value={staff.status}
			onValueChange={(value) => {
				if (value !== staff.status) {
					onStatusChange({ id: staff.id, status: value as StaffStatus });
				}
			}}
			disabled={disabled}
			dir="rtl"
		>
			<SelectTrigger
				size="sm"
				className="!h-5.5 !py-0 px-2 text-[11px] w-20 border-dashed text-right font-medium rounded gap-1 [&_svg]:!size-3"
			>
				<SelectValue />
			</SelectTrigger>
			<SelectContent dir="rtl">
				<SelectItem value={StaffStatus.ACTIVE} className="text-xs">
					<span className="text-emerald-600 font-medium">{STATUS_CONFIG[StaffStatus.ACTIVE].label}</span>
				</SelectItem>
				<SelectItem value={StaffStatus.PENDING} className="text-xs">
					{STATUS_CONFIG[StaffStatus.PENDING].label}
				</SelectItem>
				<SelectItem value={StaffStatus.INACTIVE} className="text-xs">
					<span className="text-red-600 font-medium">{STATUS_CONFIG[StaffStatus.INACTIVE].label}</span>
				</SelectItem>
			</SelectContent>
		</Select>
	);
}

function RegistrationBadge({ staff }: { staff: StaffResponse }) {
	if (staff.user) {
		return (
			<p className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
				<IconCircleCheck className="size-3.5 text-emerald-500" />
				<span>مفعل</span>
			</p>
		);
	}

	return (
		<p className="flex items-center gap-1 text-[11px] font-medium text-red-600 dark:text-red-400">
			<IconCircleX className="size-3.5 text-red-500" />
			<span>غير مفعل</span>
		</p>
	);
}

export function StaffTable() {
	const [addOpen, setAddOpen] = useState(false);
	const [selectedStaff, setSelectedStaff] = useState<StaffResponse | null>(null);
	const [deletingStaff, setDeletingStaff] = useState<StaffResponse | null>(null);
	const [disablingStaff, setDisablingStaff] = useState<StaffResponse | null>(null);
	const [invitingStaff, setInvitingStaff] = useState<StaffResponse | null>(null);
	const { staff, isLoading } = useStaff();
	const { updateStatus, updatingId } = useUpdateStaffStatus();

	const [view, setView] = useState<StaffView>("list");
	const [oldestFirst, setOldestFirst] = useState(false);

	const { filterGroups, applyStaffFilters } = useStaffFilters(staff);

	// useMemo ضروري لا للأداء فقط: useReactTable يشترط مرجعًا ثابتًا لـ data — أي مصفوفة
	// جديدة في كل رسم تُفعّل autoResetPageIndex فيتحدّث الحالة ويعاد الرسم بلا نهاية.
	const visibleStaff = useMemo(() => {
		const list = applyStaffFilters(staff);
		// «الأقدم أولًا» يعكس ترتيب الإنشاء الافتراضي (الأحدث أولًا)
		return oldestFirst
			? [...list].sort(
					(a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
				)
			: list;
	}, [staff, applyStaffFilters, oldestFirst]);

	const columns = useMemo<ColumnDef<StaffResponse>[]>(
		() => [
			{
				accessorKey: "name",
				header: "الاسم / المعرف",
				size: 190,
				minSize: 170,
				cell: ({ row }) => (
					<div className="flex items-center gap-2 min-w-0">
						<StaffAvatar name={row.original.name} />
						<div className="flex flex-col min-w-0">
							<span className="font-semibold text-xs text-foreground truncate cursor-pointer hover:underline">
								{row.original.name}
							</span>
							<span className="font-mono text-[10px] text-muted-foreground tabular-nums">
								{row.original.code}
							</span>
						</div>
					</div>
				),
			},
			{
				accessorKey: "phone",
				header: "الهاتف / البريد الإلكتروني",
				size: 170,
				minSize: 150,
				cell: ({ row }) => (
					<div className="flex flex-col gap-0.5 min-w-0">
						{row.original.phone ? (
							<span className="text-xs tabular-nums text-foreground flex items-center gap-1.5 font-mono">
								<IconPhone className="size-3 text-muted-foreground shrink-0" />
								{row.original.phone}
							</span>
						) : (
							<span className="text-muted-foreground text-xs flex items-center gap-1.5">
								<IconPhone className="size-3 shrink-0" />—
							</span>
						)}
						<span className="text-[10px] text-muted-foreground flex items-center gap-1.5 max-w-[160px]">
							<IconMail className="size-3 shrink-0" />
							<span className="truncate">{row.original.email}</span>
						</span>
					</div>
				),
			},
			{
				accessorKey: "primarySpecialization",
				header: "التخصص",
				size: 130,
				minSize: 110,
				cell: ({ row }) => {
					const primary = row.original.primarySpecialization;
					const secondary = row.original.secondarySpecialization;
					if (!primary) return <span className="text-muted-foreground text-xs">—</span>;
					return (
						<div className="flex flex-col gap-0.5 min-w-0">
							<span className="text-xs text-foreground font-medium truncate">
								{(primary as { name: string }).name}
							</span>
							{secondary && (
								<span className="text-[10px] text-muted-foreground truncate">
									{(secondary as { name: string }).name}
								</span>
							)}
						</div>
					);
				},
			},
			{
				accessorKey: "clinic",
				header: "الأكاديمية",
				size: 120,
				minSize: 100,
				cell: ({ row }) => (
					<span className="text-xs text-foreground truncate">
						{row.original.clinic.name}
					</span>
				),
			},
			{
				id: "reservations",
				header: "أيام العمل",
				size: 110,
				minSize: 95,
				cell: ({ row }) => (
					// biome-ignore lint/a11y/noStaticElementInteractions: حارس انتشار فقط لإيقاف فتح الصف
					// biome-ignore lint/a11y/useKeyWithClickEvents: حارس انتشار فقط؛ عنصر التحكم داخله قابل للوصول بلوحة المفاتيح
					<div onClick={(e) => e.stopPropagation()}>
						<StaffSchedulingPopover
							staffId={row.original.id}
							shift={row.original.schedulingSettings?.shift}
						/>
					</div>
				),
			},
			{
				id: "shift",
				header: "المناوبة",
				size: 115,
				minSize: 95,
				cell: ({ row }) => {
					const rawShift = row.original.schedulingSettings?.shift;
					const cfg = rawShift ? SHIFT_CONFIG[rawShift] : null;
					const label = cfg?.label || "غير محدد";
					const colorClasses =
						cfg?.colorClasses ||
						"bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-700";
					const dotColor = cfg?.dotColor || "bg-slate-400";

					return (
						<div className="flex items-center gap-1.5">
							<span
								className={cn(
									"inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium border shadow-2xs",
									colorClasses,
								)}
							>
								<span className={cn("size-1.5 rounded-full shrink-0", dotColor)} />
								<span>{label}</span>
							</span>
						</div>
					);
				},
			},
			{
				id: "patients",
				header: "عدد الطلاب",
				size: 85,
				minSize: 75,
				cell: () => (
					<span className="text-xs tabular-nums text-muted-foreground font-mono">0</span>
				),
			},
			{
				id: "rating",
				header: "التقييم",
				size: 75,
				minSize: 65,
				cell: () => (
					<span className="flex items-center gap-1 text-xs tabular-nums text-muted-foreground">
						<IconStar className="size-3 text-amber-400 fill-amber-400" />—
					</span>
				),
			},
			{
				accessorKey: "status",
				header: "الحالة",
				size: 110,
				minSize: 95,
				cell: ({ row }) => (
					// biome-ignore lint/a11y/noStaticElementInteractions: حارس انتشار فقط لإيقاف فتح الصف
					// biome-ignore lint/a11y/useKeyWithClickEvents: حارس انتشار فقط؛ عنصر التحكم داخله قابل للوصول بلوحة المفاتيح
					<div onClick={(e) => e.stopPropagation()}>
						<StaffStatusSelect
							staff={row.original}
							onStatusChange={updateStatus}
							disabled={updatingId === row.original.id}
						/>
					</div>
				),
			},
			{
				id: "registrationStatus",
				header: "حالة التسجيل",
				size: 120,
				minSize: 100,
				cell: ({ row }) => {
					const canRemind = !row.original.user && row.original.status !== StaffStatus.INACTIVE;
					return (
						<div className="flex items-center gap-2">
							<RegistrationBadge staff={row.original} />
							{canRemind && (
								<Button
									variant="outline"
									size="sm"
									className="h-5 px-1.5 text-[10px]"
									onClick={(e) => {
										e.stopPropagation();
										setInvitingStaff(row.original);
									}}
								>
									تذكير
								</Button>
							)}
						</div>
					);
				},
			},
			{
				id: "actions",
				header: "",
				size: 48,
				cell: ({ row }) => {
					return (
						// biome-ignore lint/a11y/noStaticElementInteractions: حارس انتشار فقط لإيقاف فتح الصف
						// biome-ignore lint/a11y/useKeyWithClickEvents: حارس انتشار فقط؛ عناصر القائمة قابلة للوصول بلوحة المفاتيح
						<div onClick={(e) => e.stopPropagation()}>
							<DropdownMenu dir="rtl">
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="icon-xs"
										className="size-7"
									>
										<IconDots className="size-3.5" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start">
									<DropdownMenuItem
										className="gap-2 text-xs"
										onSelect={() => setSelectedStaff(row.original)}
									>
										<IconEye className="size-3.5" />
										فتح
									</DropdownMenuItem>
									<DropdownMenuItem
										className="gap-2 text-xs"
										onSelect={() => setDisablingStaff(row.original)}
									>
										<IconBan className="size-3.5" />
										تعطيل
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										className="text-destructive gap-2 text-xs"
										onSelect={() => setDeletingStaff(row.original)}
									>
										<IconTrash className="size-3.5" />
										حذف
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					);
				},
			},
		],
		[updateStatus, updatingId],
	);

	const table = useReactTable({
		data: visibleStaff,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		globalFilterFn: "includesString",
	});

	return (
		<>
			<AddStaffSheet
				open={addOpen}
				onClose={() => setAddOpen(false)}
				onCreated={(created) => {
					setAddOpen(false);
					setInvitingStaff(created);
				}}
			/>
			<StaffSheet
				open={!!selectedStaff}
				staff={selectedStaff}
				onClose={() => setSelectedStaff(null)}
			/>
			<DeleteStaffDialog
				staff={deletingStaff}
				onClose={() => setDeletingStaff(null)}
			/>
			<DisableStaffDialog
				staff={disablingStaff}
				onClose={() => setDisablingStaff(null)}
			/>
			<InviteStaffDialog
				staff={invitingStaff}
				onClose={() => setInvitingStaff(null)}
			/>

			<div className="flex min-h-0 flex-1 flex-col">
				<TableToolbar
					className="border-t"
					searchPlaceholder="ابحث عن الموظف..."
					searchValue={(table.getState().globalFilter as string) ?? ""}
					onSearchChange={(v) => table.setGlobalFilter(v)}
					// «نساعدك» الباقي يأخذ مقاس xs ليطابق ارتفاع بقيّة الأزرار
					buttonSize="xs"
					// بقيّة الأزرار القياسية مستبدَلة ببدائل فعليّة (كصفحة التدريب)
					showFilter={false}
					showView={false}
					showExport={false}
					leftExtra={
						<>
							<FiltersMenu groups={filterGroups} />
							<ViewOptionsMenu
								options={VIEW_OPTIONS}
								view={view}
								onViewChange={setView}
								oldestFirst={oldestFirst}
								onOldestFirstChange={setOldestFirst}
							/>
							{/* ترتيب DOM في RTL: يأتي بعد «العرض» فيظهر على يساره، وبنفس مقاسه (xs) */}
							<Button
								type="button"
								variant="outline"
								size="xs"
								onClick={() => exportStaffCsv(visibleStaff)}
								disabled={visibleStaff.length === 0}
								className="gap-1.5 px-2"
							>
								<IconDownload className="size-3.5" />
								تصدير
							</Button>
						</>
					}
					actions={
						<Button
							size="sm"
							onClick={() => setAddOpen(true)}
						>
							<IconPlus />
							إضافة موظف جديد
						</Button>
					}
				/>

				{view === "grid" ? (
					<div className="min-h-0 flex-1 overflow-auto p-3">
						{visibleStaff.length === 0 ? (
							<p className="py-16 text-center text-[13px] text-muted-foreground">
								لا يوجد موظفون مطابقون
							</p>
						) : (
							<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
								{visibleStaff.map((member) => (
									<StaffCard
										key={member.id}
										staff={member}
										onOpen={() => setSelectedStaff(member)}
										onDisable={() => setDisablingStaff(member)}
										onDelete={() => setDeletingStaff(member)}
									/>
								))}
							</div>
						)}
					</div>
				) : (
					<TableDataView
						table={table}
						columns={columns}
						isPending={isLoading}
						headerTextClassName="text-xs font-semibold text-muted-foreground"
						onRowClick={(row) => setSelectedStaff(row.original)}
						emptyState={{
							title: "لا يوجد موظفين حتى الآن",
							description: "أضف أعضاء الفريق لتتمكن من إدارة المهام والصلاحيات",
							action: { label: "إضافة موظف جديد", onClick: () => setAddOpen(true) },
						}}
					/>
				)}
			</div>
		</>
	);
}
