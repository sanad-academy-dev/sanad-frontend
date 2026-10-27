import {
	IconBan,
	IconCircleX,
	IconDeviceMobile,
	IconDots,
	IconEdit,
	IconEye,
	IconMail,
	IconPhone,
	IconPlus,
	IconTrash,
} from "@tabler/icons-react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
	type ColumnDef,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { TableDataView } from "@/components/common/table-data-view";
import { TableToolbar } from "@/components/common/table-toolbar";
import { AvatarCirclesStack } from "@/components/common/avatar-circles-stack";
import { GuardianHoverCard, StudentHoverCard } from "@/components/common/hover-cards";
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
import { DeleteOwnerDialog } from "@/features/services/owners/components/delete-owner-dialog";
import { DisableOwnerDialog } from "@/features/services/owners/components/disable-owner-dialog";
import { OwnerSheet } from "@/features/services/owners/components/owner-sheet";
import { PortalPasswordDialog } from "@/features/services/owners/components/portal-password-dialog";
import { useOwners } from "@/features/services/owners/hooks/use-owners";
import { useUpdateOwner } from "@/features/services/owners/hooks/use-update-owner";
import { cn } from "@/lib/utils";

import type { OwnerRelationship, OwnerResponse } from "@/server/owners/owners.type";

const STATUSES = [
	{
		label: "نشط",
		value: "active",
	},
	{
		label: "غير نشط",
		value: "inactive",
	},
	{
		label: "محظور",
		value: "blocked",
	},
] as const;

function OwnerAvatar({ name }: { name: string }) {
	const initials = name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
	return (
		<div className="flex size-7.5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 text-[11px] font-bold">
			{initials || "؟"}
		</div>
	);
}

function PetIcons({ patients }: { patients: OwnerResponse["patients"] }) {
	if (!patients || patients.length === 0) {
		return <span className="text-[11px] text-muted-foreground">—</span>;
	}
	return (
		<AvatarCirclesStack
			items={patients.map((patient) => ({
				id: patient.id,
				name: patient.name,
				title: patient.name,
				data: patient,
			}))}
			variant="mauve"
			maxVisible={3}
			renderItem={(item, element) => (
				<StudentHoverCard
					student={{
						id: String(item.id),
						name: item.name,
					}}
				>
					{element}
				</StudentHoverCard>
			)}
		/>
	);
}

function StatusSelect({
	active,
	disabled,
	onValueChange,
}: {
	active: boolean;
	disabled?: boolean;
	onValueChange: (value: string) => void;
}) {
	const value = active ? "active" : "inactive";
	return (
		<Select
			value={value}
			onValueChange={onValueChange}
			dir="rtl"
			disabled={disabled}
		>
			<SelectTrigger
				size="sm"
				className={cn(
					"!h-5.5 !py-0 px-2 text-[11px] w-20 border-dashed font-medium text-right rounded gap-1 [&_svg]:!size-3",
					active
						? "border-emerald-200 bg-emerald-50/40 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300"
						: "border-slate-200 bg-slate-50/40 text-muted-foreground dark:border-slate-800 dark:bg-slate-900/20",
				)}
			>
				<SelectValue />
			</SelectTrigger>
			<SelectContent dir="rtl">
				{STATUSES.map((s) => (
					<SelectItem
						key={s.value}
						value={s.value}
						className="text-xs"
					>
						{s.value === "active" ? (
							<span className="text-emerald-600 dark:text-emerald-400 font-medium">{s.label}</span>
						) : s.value === "blocked" ? (
							<span className="text-rose-600 dark:text-rose-400 font-medium">{s.label}</span>
						) : (
							<span className="text-muted-foreground">{s.label}</span>
						)}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

const RELATIONSHIP_CONFIG: Record<
	NonNullable<OwnerRelationship>,
	{ label: string; className: string }
> = {
	OWNER: {
		label: "وليّ أمر",
		className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900",
	},
	GUARDIAN: {
		label: "وصي",
		className: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900",
	},
	DELEGATE: {
		label: "مفوض",
		className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
	},
	EMERGENCY: {
		label: "طوارئ",
		className: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900",
	},
};

function RelationshipBadge({ value }: { value: OwnerRelationship | null }) {
	if (!value) return <span className="text-muted-foreground text-[11px]">—</span>;
	const config = RELATIONSHIP_CONFIG[value];
	return (
		<span
			className={cn(
				"inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border",
				config?.className ?? "bg-slate-50 text-slate-700 border-slate-200",
			)}
		>
			{config?.label ?? value}
		</span>
	);
}

function RegistrationBadge() {
	return (
		<span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900">
			<IconCircleX className="size-3 shrink-0" />
			<span>غير مفعّل</span>
		</span>
	);
}

export function OwnersTable() {
	const navigate = useNavigate();
	const [sheetOpen, setSheetOpen] = useState(false);
	const [editingOwner, setEditingOwner] = useState<OwnerResponse | null>(null);
	const [deletingOwner, setDeletingOwner] = useState<OwnerResponse | null>(null);
	const [portalOwner, setPortalOwner] = useState<OwnerResponse | null>(null);
	const [disablingOwner, setDisablingOwner] = useState<OwnerResponse | null>(null);
	const { owners, isLoading } = useOwners();
	const { updateOwner, isPending: isUpdating } = useUpdateOwner();

	const columns = useMemo<ColumnDef<OwnerResponse>[]>(
		() => [
			{
				accessorKey: "name",
				header: "ولي الأمر",
				size: 190,
				minSize: 170,
				cell: ({ row }) => (
					// <GuardianHoverCard
					// 	guardian={{
					// 		id: row.original.id,
					// 		code: row.original.code,
					// 		name: row.original.name,
					// 		phone: row.original.phone,
					// 		email: row.original.email,
					// 		relationship: row.original.relationship,
					// 		address: row.original.address,
					// 		active: row.original.active,
					// 		patientsCount: row.original.patients?.length ?? 0,
					// 		patients: row.original.patients,
					// 	}}
					// >
						<div className="flex items-center gap-2.5 min-w-[170px] group cursor-pointer">
							<OwnerAvatar name={row.original.name} />
							<div className="flex flex-col min-w-0">
								<Link
									to="/services/owners/$ownerId"
									params={{ ownerId: row.original.id }}
									className="font-semibold text-xs text-foreground group-hover:underline truncate"
									onClick={(e) => e.stopPropagation()}
									title={row.original.name}
								>
									{row.original.name}
								</Link>
								<span className="font-mono text-[10px] text-muted-foreground tabular-nums">
									{row.original.code}
								</span>
							</div>
						</div>
					// </GuardianHoverCard>
				),
			},
			{
				accessorKey: "email",
				header: "الهاتف / البريد",
				size: 180,
				minSize: 160,
				cell: ({ row }) => (
					<div className="flex flex-col gap-0.5">
						{row.original.phone ? (
							<span className="text-xs font-mono tabular-nums flex items-center gap-1.5 text-foreground">
								<IconPhone className="size-3 text-muted-foreground shrink-0" />
								{row.original.phone}
							</span>
						) : (
							<span className="text-muted-foreground text-xs flex items-center gap-1.5">
								<IconPhone className="size-3 shrink-0" />—
							</span>
						)}
						{row.original.email ? (
							<span className="text-[11px] text-muted-foreground flex items-center gap-1.5 max-w-[160px]">
								<IconMail className="size-3 shrink-0" />
								<span className="truncate">{row.original.email}</span>
							</span>
						) : null}
					</div>
				),
			},
			{
				accessorKey: "patients",
				header: "الطلاب",
				size: 110,
				minSize: 95,
				cell: ({ row }) => <PetIcons patients={row.original.patients} />,
			},
			{
				accessorKey: "relationship",
				header: "صلة القرابة",
				size: 100,
				minSize: 85,
				cell: ({ row }) => <RelationshipBadge value={row.original.relationship} />,
			},
			{
				id: "spending",
				header: "الإنفاق",
				size: 90,
				minSize: 80,
				cell: () => <span className="text-xs font-mono tabular-nums text-muted-foreground">0.00 ر.س</span>,
			},
			{
				id: "appointments",
				header: "عدد الزيارات",
				size: 85,
				minSize: 75,
				cell: () => <span className="text-xs font-mono tabular-nums text-muted-foreground">0</span>,
			},
			{
				accessorKey: "active",
				header: "الحالة",
				size: 105,
				minSize: 95,
				cell: ({ row }) => (
					// biome-ignore lint/a11y/noStaticElementInteractions: حارس انتشار فقط لإيقاف فتح الصف
					// biome-ignore lint/a11y/useKeyWithClickEvents: حارس انتشار فقط؛ عنصر التحكم داخله قابل للوصول بلوحة المفاتيح
					<div onClick={(e) => e.stopPropagation()}>
						<StatusSelect
							active={row.original.active}
							disabled={isUpdating}
							onValueChange={(value) => {
								if (value === "active" && !row.original.active) {
									updateOwner(row.original.id, { active: true });
								} else if (value === "inactive" || value === "blocked") {
									if (row.original.active) setDisablingOwner(row.original);
								}
							}}
						/>
					</div>
				),
			},
			{
				id: "registrationStatus",
				header: "حالة التسجيل",
				size: 95,
				minSize: 85,
				cell: () => <RegistrationBadge />,
			},
			{
				id: "actions",
				header: "",
				size: 40,
				minSize: 35,
				cell: ({ row }) => (
					// biome-ignore lint/a11y/noStaticElementInteractions: حارس انتشار فقط لإيقاف فتح الصف
					// biome-ignore lint/a11y/useKeyWithClickEvents: حارس انتشار فقط؛ عناصر القائمة قابلة للوصول بلوحة المفاتيح
					<div
						className="flex items-center justify-center"
						onClick={(e) => e.stopPropagation()}
					>
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
								<DropdownMenuItem
									className="gap-2 text-xs"
									onSelect={() => {
										navigate({
											to: "/services/owners/$ownerId",
											params: { ownerId: row.original.id },
										});
									}}
								>
									<IconEye className="size-4" />
									فتح
								</DropdownMenuItem>
								<DropdownMenuItem
									className="gap-2 text-xs"
									onSelect={() => setEditingOwner(row.original)}
								>
									<IconEdit className="size-4" />
									تعديل
								</DropdownMenuItem>
								<DropdownMenuItem
									className="gap-2 text-xs"
									onSelect={() => setDisablingOwner(row.original)}
								>
									<IconBan className="size-4" />
									تعطيل
								</DropdownMenuItem>
								<DropdownMenuItem
									className="gap-2 text-xs"
									onSelect={() => setPortalOwner(row.original)}
								>
									<IconDeviceMobile className="size-4" />
									كلمة مرور التطبيق
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className="text-destructive gap-2 text-xs"
									onSelect={() => setDeletingOwner(row.original)}
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
		[isUpdating, updateOwner, navigate],
	);

	const table = useReactTable({
		data: owners,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		globalFilterFn: "includesString",
	});

	return (
		<>
			<OwnerSheet
				open={sheetOpen}
				onClose={() => setSheetOpen(false)}
			/>
			<OwnerSheet
				open={!!editingOwner}
				onClose={() => setEditingOwner(null)}
				owner={editingOwner}
			/>
			<DisableOwnerDialog
				owner={disablingOwner}
				onClose={() => setDisablingOwner(null)}
			/>
			<DeleteOwnerDialog
				owner={deletingOwner}
				onClose={() => setDeletingOwner(null)}
			/>

			<PortalPasswordDialog
				owner={portalOwner}
				open={Boolean(portalOwner)}
				onOpenChange={(next) => !next && setPortalOwner(null)}
			/>

			<div className="flex min-h-0 flex-1 flex-col">
				<TableToolbar
					className="border-t"
					searchPlaceholder="ابحث باسم وليّ الأمر أو رقم الهاتف..."
					searchValue={(table.getState().globalFilter as string) ?? ""}
					onSearchChange={(v) => table.setGlobalFilter(v)}
					actions={
						<Button
							size="sm"
							onClick={() => setSheetOpen(true)}
						>
							<IconPlus className="size-4" />
							إضافة وليّ أمر جديد
						</Button>
					}
				/>

				<TableDataView
					table={table}
					columns={columns}
					isPending={isLoading}
					tableClassName="w-full min-w-[1000px]"
					onRowClick={(row) => {
						navigate({
							to: "/services/owners/$ownerId",
							params: { ownerId: row.original.id },
						});
					}}
					emptyState={{
						title: "لا يوجد أولياء أمور حتى الآن",
						description: "سجّل أولياء الأمور لتتمكن من ربطهم بالطلاب ومتابعة زياراتهم",
						action: { label: "إضافة وليّ أمر جديد", onClick: () => setSheetOpen(true) },
					}}
				/>
			</div>
		</>
	);
}
