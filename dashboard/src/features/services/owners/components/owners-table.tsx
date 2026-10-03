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
import { Badge } from "@/components/ui/badge";
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
import { getAnimalIcon } from "@/features/services/owners/utils/animal-icon";
import type { OwnerRelationship, OwnerResponse } from "@/server/owners/owners.type";

const MAX_VISIBLE_PETS = 5;

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

function PetIcons({ patients }: { patients: OwnerResponse["patients"] }) {
	const visible = patients.slice(0, MAX_VISIBLE_PETS);
	const overflow = patients.length - visible.length;

	if (patients.length === 0) {
		return <span className="text-muted-foreground text-sm">—</span>;
	}

	return (
		<div className="flex items-center gap-1">
			{visible.map((patient) => {
				const Icon = getAnimalIcon(patient.animalType?.enName);
				return (
					<div
						key={patient.id}
						className="flex items-center justify-center size-7 rounded-md bg-muted text-muted-foreground"
					>
						<Icon className="size-4" />
					</div>
				);
			})}
			{overflow > 0 && (
				<div className="flex items-center justify-center h-7 px-1.5 rounded-md bg-muted text-muted-foreground text-xs font-medium">
					+{overflow}
				</div>
			)}
		</div>
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
			<SelectTrigger className="h-7 text-xs w-28 border-dashed text-right">
				<SelectValue />
			</SelectTrigger>
			<SelectContent dir="rtl">
				{STATUSES.map((s) => (
					<SelectItem
						key={s.value}
						value={s.value}
					>
						{s.value === "active" ? (
							<span className="text-emerald-600">{s.label}</span>
						) : s.value === "blocked" ? (
							<span className="text-red-600">{s.label}</span>
						) : (
							s.label
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
	OWNER: { label: "وليّ أمر", className: "bg-blue-100 text-blue-700" },
	GUARDIAN: { label: "وصي", className: "bg-purple-100 text-purple-700" },
	DELEGATE: { label: "مفوض", className: "bg-amber-100 text-amber-700" },
	EMERGENCY: { label: "جهة اتصال للطوارئ", className: "bg-red-100 text-red-700" },
};

function RelationshipBadge({ value }: { value: OwnerRelationship | null }) {
	if (!value) return <span className="text-muted-foreground text-sm">—</span>;
	const config = RELATIONSHIP_CONFIG[value];
	return (
		<Badge
			className={config.className}
			variant="secondary"
		>
			{config.label}
		</Badge>
	);
}

function RegistrationBadge() {
	return (
		<p className="flex items-center gap-1 text-sm">
			<IconCircleX className="size-4 text-red-500" />
			<span className="text-red-500">غير مفعل</span>
		</p>
	);
}

export function OwnersTable() {
	const [sheetOpen, setSheetOpen] = useState(false);
	const [viewingOwner, setViewingOwner] = useState<OwnerResponse | null>(null);
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
				header: "العميل / المعرف",
				cell: ({ row }) => (
					<div className="flex items-center gap-2">
						<OwnerAvatar name={row.original.name} />
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
				accessorKey: "email",
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
				accessorKey: "patients",
				header: "الأطفال",
				cell: ({ row }) => <PetIcons patients={row.original.patients} />,
			},
			{
				accessorKey: "relationship",
				header: "العلاقة",
				cell: ({ row }) => <RelationshipBadge value={row.original.relationship} />,
			},
			{
				id: "spending",
				header: "الإنفاق",
				cell: () => <span className="text-sm tabular-nums text-muted-foreground">٠٠ رس</span>,
			},
			{
				id: "appointments",
				header: "عدد الزيارات",
				cell: () => <span className="text-sm tabular-nums text-muted-foreground">0</span>,
			},
			{
				accessorKey: "active",
				header: "الحالة",
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
				cell: () => <RegistrationBadge />,
			},
			{
				id: "actions",
				header: "",
				cell: ({ row }) => (
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
									onSelect={() => setViewingOwner(row.original)}
								>
									<IconEye className="size-4" />
									فتح
								</DropdownMenuItem>
								<DropdownMenuItem
									className="gap-2"
									onSelect={() => setEditingOwner(row.original)}
								>
									<IconEdit className="size-4" />
									تعديل
								</DropdownMenuItem>
								<DropdownMenuItem
									className="gap-2"
									onSelect={() => setDisablingOwner(row.original)}
								>
									<IconBan className="size-4" />
									تعطيل
								</DropdownMenuItem>
								{/*
								 * [PP1] اعتمادات التطبيق.
								 *
								 * موضعها هنا لا في نموذج التعديل: هذا **فعل** يولّد سرًّا لمرّة
								 * واحدة، لا حقلٌ يُحرَّر ويُحفظ مع بقيّة البيانات.
								 */}
								<DropdownMenuItem
									className="gap-2"
									onSelect={() => setPortalOwner(row.original)}
								>
									<IconDeviceMobile className="size-4" />
									كلمة مرور التطبيق
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className="text-destructive gap-2"
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
		[isUpdating, updateOwner],
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
				open={!!viewingOwner}
				onClose={() => setViewingOwner(null)}
				owner={viewingOwner}
				readOnly
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
					searchPlaceholder="ابحث باسم وليّ الأمر..."
					searchValue={(table.getState().globalFilter as string) ?? ""}
					onSearchChange={(v) => table.setGlobalFilter(v)}
					actions={
						<Button
							size="sm"
							onClick={() => setSheetOpen(true)}
						>
							<IconPlus />
							إضافة وليّ أمر جديد
						</Button>
					}
				/>

				<TableDataView
					table={table}
					columns={columns}
					isPending={isLoading}
					onRowClick={(row) => setViewingOwner(row.original)}
					emptyState={{
						title: "لا يوجد ملاك حتى الآن",
						description: "سجّل ملاك الأطفال لتتمكن من ربطهم بمرضاهم ومتابعة زياراتهم",
						action: { label: "إضافة وليّ أمر جديد", onClick: () => setSheetOpen(true) },
					}}
				/>
			</div>
		</>
	);
}
