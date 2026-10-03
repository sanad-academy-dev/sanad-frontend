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

// خيارا العرض — الترتيب هو ترتيب DOM في RTL: «جدول» يمينًا و«قائمة» يسارًا
const VIEW_OPTIONS = [
	{ value: "list" as const, label: "جدول", Icon: ViewListIcon },
	{ value: "grid" as const, label: "قائمة", Icon: ViewGridIcon },
];

type StaffView = (typeof VIEW_OPTIONS)[number]["value"];

function StaffAvatar({ name }: { name: string }) {
	const initials = name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
	return (
		<div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary primarytext-xs font-semibold border border-primary/20">
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
			<SelectTrigger className="h-7 text-xs w-28 border-dashed text-right">
				<SelectValue />
			</SelectTrigger>
			<SelectContent dir="rtl">
				<SelectItem value={StaffStatus.ACTIVE}>
					<span className="text-emerald-600">{STATUS_CONFIG[StaffStatus.ACTIVE].label}</span>
				</SelectItem>
				<SelectItem value={StaffStatus.PENDING}>
					{STATUS_CONFIG[StaffStatus.PENDING].label}
				</SelectItem>
				<SelectItem value={StaffStatus.INACTIVE}>
					<span className="text-red-600">{STATUS_CONFIG[StaffStatus.INACTIVE].label}</span>
				</SelectItem>
			</SelectContent>
		</Select>
	);
}

function RegistrationBadge({ staff }: { staff: StaffResponse }) {
	if (staff.user) {
		return (
			<p className="flex items-center gap-1 text-sm">
				<IconCircleCheck className="size-4 text-emerald-500" />
				<span className="text-emerald-500">مفعل</span>
			</p>
		);
	}

	return (
		<p className="flex items-center gap-1 text-sm">
			<IconCircleX className="size-4 text-red-500" />
			<span className="text-red-500">غير مفعل</span>
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
				cell: ({ row }) => (
					<div className="flex items-center gap-2">
						<StaffAvatar name={row.original.name} />
						<div className="flex flex-col">
							<span className="font-semibold text-sm">{row.original.name}</span>
							<span className="text-xs text-muted-foreground tabular-nums">
								{row.original.code}
							</span>
						</div>
					</div>
				),
			},
			{
				accessorKey: "phone",
				header: "الهاتف / البريد الإلكتروني",
				cell: ({ row }) => (
					<div className="flex flex-col gap-0.5">
						{row.original.phone ? (
							<span className="text-sm tabular-nums flex items-center gap-1.5">
								<IconPhone className="size-3 text-muted-foreground shrink-0" />
								{row.original.phone}
							</span>
						) : (
							<span className="text-muted-foreground text-sm flex items-center gap-1.5">
								<IconPhone className="size-3 shrink-0" />—
							</span>
						)}
						<span className="text-xs text-muted-foreground flex items-center gap-1.5 max-w-[160px]">
							<IconMail className="size-3 shrink-0" />
							<span className="truncate">{row.original.email}</span>
						</span>
					</div>
				),
			},
			{
				accessorKey: "primarySpecialization",
				header: "التخصص",
				cell: ({ row }) => {
					const primary = row.original.primarySpecialization;
					const secondary = row.original.secondarySpecialization;
					if (!primary) return <span className="text-muted-foreground text-sm">—</span>;
					return (
						<div className="flex flex-col gap-0.5">
							<span className="text-sm">{(primary as { name: string }).name}</span>
							{secondary && (
								<span className="text-xs text-muted-foreground">
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
				cell: ({ row }) => <span className="text-sm">{row.original.clinic.name}</span>,
			},
			{
				id: "reservations",
				header: "حالة الحجز",
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
				id: "patients",
				header: "عدد الأطفال",
				cell: () => <span className="text-sm tabular-nums text-muted-foreground">0</span>,
			},
			{
				id: "rating",
				header: "التقييم",
				cell: () => (
					<span className="flex items-center gap-1 text-sm tabular-nums">
						<IconStar className="size-3.5 text-amber-400 fill-amber-400" />—
					</span>
				),
			},
			{
				accessorKey: "status",
				header: "الحالة",
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
				cell: ({ row }) => {
					const canRemind = !row.original.user && row.original.status !== StaffStatus.INACTIVE;
					return (
						<div className="flex items-center gap-2">
							<RegistrationBadge staff={row.original} />
							{canRemind && (
								<Button
									variant="outline"
									size="sm"
									className="h-6 px-2 text-xs"
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
				cell: ({ row }) => {
					return (
						// biome-ignore lint/a11y/noStaticElementInteractions: حارس انتشار فقط لإيقاف فتح الصف
						// biome-ignore lint/a11y/useKeyWithClickEvents: حارس انتشار فقط؛ عناصر القائمة قابلة للوصول بلوحة المفاتيح
						<div onClick={(e) => e.stopPropagation()}>
							<DropdownMenu dir="rtl">
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="size-8"
									>
										<IconDots className="size-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start">
									<DropdownMenuItem
										className="gap-2"
										onSelect={() => setSelectedStaff(row.original)}
									>
										<IconEye className="size-4" />
										فتح
									</DropdownMenuItem>
									<DropdownMenuItem
										className="gap-2"
										onSelect={() => setDisablingStaff(row.original)}
									>
										<IconBan className="size-4" />
										تعطيل
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										className="text-destructive gap-2"
										onSelect={() => setDeletingStaff(row.original)}
									>
										<IconTrash className="size-4" />
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
