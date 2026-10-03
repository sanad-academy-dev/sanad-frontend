import {
	IconBolt,
	IconCheck,
	IconCirclePlus,
	IconDotsVertical,
	IconDownload,
	IconFilter,
	IconMail,
	IconPhone,
	IconQuestionMark,
	IconSearch,
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
import { useEffect, useMemo, useRef, useState } from "react";
import { Stats } from "@/components/common/stats";
import { TableDataView } from "@/components/common/table-data-view";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useClinicUsers } from "@/features/dashboard/hooks/use-clinic-users";
import {
	BranchDetailsShell,
	StatusDot,
	UserAvatarBadge,
} from "@/features/settings/branches/components/branch-details/shared";
import { useBranch } from "@/features/settings/branches/hooks/use-branch";
import { useBranchUserMutations } from "@/features/settings/branches/hooks/use-branch-user-mutations";
import { useBranchUsers } from "@/features/settings/branches/hooks/use-branch-users";
import { formatCompactRelativeDate } from "@/features/settings/utils/format-relative-date";
import { cn } from "@/lib/utils";
import type { BranchUserWithDetails } from "@/server/branches/branches.type";

const ROLE_TABS = [
	{ value: "ALL", label: "الكل" },
	{ value: "ADMIN", label: "أدمن" },
	{ value: "MEMBER", label: "عضو" },
] as const;

type RoleTab = (typeof ROLE_TABS)[number]["value"];

const labelChipClassName =
	"w-fit rounded-[4px] bg-primary/10 px-1.5 py-1 text-[10px] leading-none text-primary";

export function BranchStaffPage({ branchId }: { branchId: string }) {
	const { branch, isLoading: branchLoading } = useBranch(branchId);
	const { branchUsers, isLoading } = useBranchUsers(branchId);
	const { users: clinicUsers } = useClinicUsers();
	const { assignUser, removeUser, isPending } = useBranchUserMutations(branchId);

	const [roleTab, setRoleTab] = useState<RoleTab>("ALL");
	const [assignOpen, setAssignOpen] = useState(false);
	const [removeTarget, setRemoveTarget] = useState<BranchUserWithDetails | null>(null);

	// اختصار «/» يركّز حقل البحث (نفس نمط جدول القاعات)
	const searchInputRef = useRef<HTMLInputElement>(null);
	useEffect(() => {
		const onKeyDown = (e: globalThis.KeyboardEvent) => {
			const target = e.target as HTMLElement | null;
			if (
				e.key === "/" &&
				!(target instanceof HTMLInputElement) &&
				!(target instanceof HTMLTextAreaElement)
			) {
				e.preventDefault();
				searchInputRef.current?.focus();
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, []);

	const columns = useMemo<ColumnDef<BranchUserWithDetails>[]>(
		() => [
			{
				id: "name",
				accessorFn: (row) => row.user.name,
				header: "الاسم",
				cell: ({ row }) => (
					<div className="flex items-center gap-2">
						<UserAvatarBadge name={row.original.user.name} />
						<span className="text-sm font-semibold">{row.original.user.name}</span>
					</div>
				),
			},
			{
				id: "contact",
				accessorFn: (row) => `${row.user.phone ?? ""} ${row.user.email}`,
				header: "الهاتف / البريد الإلكتروني",
				cell: ({ row }) => {
					const user = row.original.user;
					return (
						<div className="flex flex-col gap-0.5">
							{user.phone && (
								<span className="flex items-center gap-1.5 text-xs">
									<IconPhone className="size-3.5 shrink-0 text-muted-foreground" />
									<span
										className="tabular-nums"
										dir="ltr"
									>
										{user.phone}
									</span>
								</span>
							)}
							<span className="flex items-center gap-1.5 text-xs text-muted-foreground">
								<IconMail className="size-3.5 shrink-0" />
								{user.email}
							</span>
						</div>
					);
				},
			},
			{
				id: "role",
				accessorFn: (row) => row.user.clinicUsers[0]?.role ?? "MEMBER",
				filterFn: "equalsString",
				header: "الدور",
				cell: ({ row }) => {
					const role = row.original.user.clinicUsers[0]?.role;
					return (
						<span className={labelChipClassName}>{role === "ADMIN" ? "أدمن" : "عضو"}</span>
					);
				},
			},
			{
				id: "verified",
				header: "حالة التسجيل",
				cell: ({ row }) => {
					if (row.original.inviteAccepted) return <StatusDot on />;
					return (
						<div className="flex items-center gap-2">
							<StatusDot
								on={false}
								offLabel="غير مفعّل"
							/>
							<Button
								variant="outline"
								size="sm"
								disabled
								title="متاح قريبًا"
								className="h-6 rounded-lg px-2 text-[10px]"
							>
								تذكير
							</Button>
						</div>
					);
				},
			},
			{
				accessorKey: "createdAt",
				header: "تاريخ الإضافة",
				cell: ({ row }) => {
					const label = formatCompactRelativeDate(row.original.createdAt);
					return (
						<p
							className={cn(
								"w-fit rounded-lg px-2 py-0.5 text-xs font-semibold",
								label === "اليوم"
									? "bg-primary/10 text-primary"
									: "bg-secondary text-secondary-foreground",
							)}
						>
							{label}
						</p>
					);
				},
			},
			{
				id: "actions",
				header: "",
				cell: ({ row }) => (
					<DropdownMenu dir="rtl">
						<DropdownMenuTrigger asChild>
							<button
								type="button"
								className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
							>
								<IconDotsVertical className="size-4" />
								<span className="sr-only">خيارات</span>
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start">
							<DropdownMenuItem
								variant="destructive"
								onClick={() => setRemoveTarget(row.original)}
							>
								<IconTrash className="size-4" />
								إزالة من الفرع
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				),
			},
		],
		[],
	);

	const table = useReactTable({
		data: branchUsers,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		globalFilterFn: "includesString",
	});

	if (branchLoading || !branch) {
		return (
			<div className="flex w-full flex-col gap-4 px-4 pt-10">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-96 w-full rounded-[4px]" />
			</div>
		);
	}

	const acceptedCount = branchUsers.filter((bu) => bu.inviteAccepted).length;
	const adminsCount = branchUsers.filter(
		(bu) => bu.user.clinicUsers[0]?.role === "ADMIN",
	).length;

	// المستخدمون المتاحون للتعيين — أعضاء الأكاديمية غير المعينين لهذا الفرع
	const assignedIds = new Set(branchUsers.map((bu) => bu.user.id));
	const assignableUsers = clinicUsers.filter((user) => !assignedIds.has(user.id));

	const selectRoleTab = (value: RoleTab) => {
		setRoleTab(value);
		table.getColumn("role")?.setFilterValue(value === "ALL" ? undefined : value);
	};

	return (
		<BranchDetailsShell
			branchName={branch.name}
			branchId={branch.id}
			section="الموظفين"
			wide
		>
			<Stats
				variant="inventory"
				stats={[
					{
						title: "إجمالي الموظفين",
						value: branchUsers.length,
						tooltip: "كل الموظفين المعينين لهذا الفرع",
					},
					{
						title: "مفعّل",
						value: acceptedCount,
						tooltip: "الموظفون الذين قبلوا الدعوة وفعّلوا حسابهم",
					},
					{
						title: "بانتظار التفعيل",
						value: branchUsers.length - acceptedCount,
						tooltip: "دعوات لم تُقبل بعد",
					},
					{
						title: "مدراء",
						value: adminsCount,
						tooltip: "الموظفون بدور أدمن في الأكاديمية",
					},
				]}
			/>

			<div className="flex items-center justify-between gap-3">
				{/* يمين (بداية RTL): بحث + فلترة + تصدير + مساعدة */}
				<div className="flex items-center gap-2">
					<InputGroup className="w-64">
						<InputGroupInput
							ref={searchInputRef}
							value={(table.getState().globalFilter as string) ?? ""}
							onChange={(e) => table.setGlobalFilter(e.target.value)}
							placeholder="ابحث بالاسم أو البريد أو الهاتف..."
						/>
						<InputGroupAddon align="inline-end">
							<IconSearch />
						</InputGroupAddon>
						<InputGroupAddon align="inline-end">
							<Kbd className="bg-primary/10 text-primary">/</Kbd>
							<IconBolt className="text-primary" />
						</InputGroupAddon>
					</InputGroup>

					<DropdownMenu dir="rtl">
						<DropdownMenuTrigger asChild>
							<Button
								size="sm"
								variant="outline"
							>
								<IconFilter />
								{roleTab === "ALL"
									? "فلترة"
									: ROLE_TABS.find((t) => t.value === roleTab)?.label}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="start"
							className="w-40"
						>
							{ROLE_TABS.map((tab) => (
								<DropdownMenuItem
									key={tab.value}
									onClick={() => selectRoleTab(tab.value)}
								>
									{tab.label}
									<IconCheck
										className={cn(
											"ms-auto size-4",
											roleTab === tab.value ? "opacity-100" : "opacity-0",
										)}
									/>
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					<Button
						size="sm"
						variant="outline"
					>
						<IconDownload />
						تصدير
					</Button>

					<Button
						size="sm"
						variant="outline"
					>
						<IconQuestionMark />
						نساعدك
					</Button>

					<Separator
						orientation="vertical"
						className="my-auto h-5"
					/>
				</div>

				{/* يسار (نهاية RTL): إجراء التعيين الأساسي */}
				<div className="flex items-center gap-2">
					<Popover
						open={assignOpen}
						onOpenChange={setAssignOpen}
					>
						<PopoverTrigger asChild>
							<Button size="sm">
								<IconCirclePlus />
								تعيين موظف
							</Button>
						</PopoverTrigger>
						<PopoverContent
							align="end"
							className="w-64 p-1"
						>
							<div className="flex max-h-72 flex-col overflow-y-auto">
								{assignableUsers.map((user) => (
									<button
										type="button"
										key={user.id}
										disabled={isPending}
										onClick={async () => {
											setAssignOpen(false);
											try {
												await assignUser(user.id);
											} catch {
												return;
											}
										}}
										className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-muted disabled:opacity-50"
									>
										<UserAvatarBadge name={user.name} />
										<span className="flex-1 text-start">{user.name}</span>
									</button>
								))}
								{assignableUsers.length === 0 && (
									<p className="px-2 py-1.5 text-[11px] text-muted-foreground">
										كل أعضاء الأكاديمية معينون بالفعل
									</p>
								)}
							</div>
						</PopoverContent>
					</Popover>
				</div>
			</div>

			<div className="flex flex-col overflow-hidden rounded-[4px] border bg-card">
				<TableDataView
					table={table}
					columns={columns}
					isPending={isLoading}
					emptyState={{
						title: "لا يوجد موظفون في هذا الفرع",
						description: "عيّن موظفين للفرع لتتمكن من توزيع المهام وإدارة الصلاحيات",
						action: {
							label: "تعيين موظف",
							onClick: () => setAssignOpen(true),
						},
					}}
				/>
			</div>

			<Dialog
				open={!!removeTarget}
				onOpenChange={(open) => {
					if (!open) setRemoveTarget(null);
				}}
			>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle>إزالة موظف من الفرع</DialogTitle>
						<DialogDescription>
							هل أنت متأكد من إزالة «{removeTarget?.user.name}» من هذا الفرع؟ يبقى حسابه في
							الأكاديمية ويمكن تعيينه لفرع آخر.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setRemoveTarget(null)}
						>
							إلغاء
						</Button>
						<Button
							variant="destructive"
							size="sm"
							disabled={isPending}
							onClick={async () => {
								if (!removeTarget) return;
								try {
									await removeUser(removeTarget.user.id);
								} catch {
									return;
								}
								setRemoveTarget(null);
							}}
						>
							إزالة الموظف
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</BranchDetailsShell>
	);
}
