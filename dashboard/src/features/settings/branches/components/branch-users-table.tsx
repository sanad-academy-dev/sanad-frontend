import { IconMail, IconPhone } from "@tabler/icons-react";
import { type ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo } from "react";
import { TableDataView } from "@/components/common/table-data-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBranchUsers } from "@/features/settings/branches/hooks/use-branch-users";
import type {
	BranchUsersTableProps,
	UserAvatarProps,
} from "@/features/settings/branches/types/branch-users-table.types";
import type { BranchUserWithDetails } from "@/server/branches/branches.type";

function UserAvatar({ name }: UserAvatarProps) {
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

export function BranchUsersTable({ branchId }: BranchUsersTableProps) {
	const { branchUsers, isLoading } = useBranchUsers(branchId);

	const columns = useMemo<ColumnDef<BranchUserWithDetails>[]>(
		() => [
			{
				accessorKey: "user.name",
				header: "الاسم",
				cell: ({ row }) => {
					const user = row.original.user;
					return (
						<div className="flex items-center gap-2">
							<UserAvatar name={user.name} />
							<span className="font-medium text-sm">{user.name}</span>
						</div>
					);
				},
			},
			{
				id: "contact",
				header: "الهاتف / البريد الإلكتروني",
				cell: ({ row }) => {
					const user = row.original.user;
					return (
						<div className="flex flex-col gap-0.5">
							{user.phone && (
								<div className="flex items-center gap-1.5 text-sm">
									<IconPhone className="size-3.5 text-muted-foreground shrink-0" />
									<span className="tabular-nums">{user.phone}</span>
								</div>
							)}
							<div className="flex items-center gap-1.5 text-sm text-muted-foreground">
								<IconMail className="size-3.5 shrink-0" />
								<span>{user.email}</span>
							</div>
						</div>
					);
				},
			},
			{
				id: "role",
				header: "الدور",
				cell: ({ row }) => {
					const role = row.original.user.clinicUsers[0]?.role;
					return (
						<Badge variant={role === "ADMIN" ? "primary" : "secondary"}>
							{role === "ADMIN" ? "أدمن" : "عضو"}
						</Badge>
					);
				},
			},
			{
				id: "status",
				header: "الحالة",
				cell: () => (
					<Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800">
						نشط
					</Badge>
				),
			},
			{
				id: "verified",
				header: "حالة التسجيل",
				cell: ({ row }) => {
					const accepted = row.original.inviteAccepted;
					if (accepted) {
						return (
							<Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800">
								مفعّل
							</Badge>
						);
					}
					return (
						<div className="flex items-center gap-2">
							<Badge
								variant="destructive"
								className="bg-red-50 text-red-600 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800"
							>
								غير مفعّل
							</Badge>
							<Button
								variant="outline"
								size="sm"
								className="h-7 text-xs px-2"
							>
								تذكير
							</Button>
						</div>
					);
				},
			},
		],
		[],
	);

	const table = useReactTable({
		data: branchUsers,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="w-full border rounded-lg border-border bg-card overflow-hidden">
			<TableDataView
				table={table}
				columns={columns}
				isPending={isLoading}
				pagination={false}
				emptyState={{
					title: "لا يوجد مستخدمين في هذا الفرع",
					description: "أضف موظفين للفرع لتتمكن من توزيع المهام وإدارة الصلاحيات",
				}}
			/>
		</div>
	);
}
