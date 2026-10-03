import {
	IconBan,
	IconBriefcase,
	IconBuildingStore,
	IconDots,
	IconEye,
	IconMail,
	IconPhone,
	IconTrash,
} from "@tabler/icons-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getFileUrl } from "@/lib/file-url";
import type { StaffResponse } from "@/server/staff/staff.type";
import { StaffStatus } from "@sanad/contracts/runtime/server/staff/staff.type";

const STATUS_CONFIG: Record<
	StaffStatus,
	{ label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
	[StaffStatus.ACTIVE]: { label: "نشط", variant: "default" },
	[StaffStatus.PENDING]: { label: "معلق", variant: "secondary" },
	[StaffStatus.INACTIVE]: { label: "غير نشط", variant: "destructive" },
};

const EMPLOYMENT_LABEL = { FULL_TIME: "دوام كلي", PART_TIME: "دوام جزئي" } as const;

const initialsOf = (name: string) =>
	name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();

function Chip({ children }: { children: ReactNode }) {
	return (
		<span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
			{children}
		</span>
	);
}

// بطاقة موظف في عرض «قائمة» (الشبكة) — تقابل بطاقة الدورة في التدريب
export function StaffCard({
	staff,
	onOpen,
	onDisable,
	onDelete,
}: {
	staff: StaffResponse;
	onOpen: () => void;
	onDisable: () => void;
	onDelete: () => void;
}) {
	const status = STATUS_CONFIG[staff.status] ?? STATUS_CONFIG[StaffStatus.PENDING];
	const avatarUrl = getFileUrl(staff.avatar);

	return (
		<div className="relative flex flex-col overflow-hidden rounded-lg border bg-card">
			{/* طبقة شفافة تغطّي البطاقة لفتح ملف الموظف — والقائمة فوقها بـ z-20 */}
			<button
				type="button"
				onClick={onOpen}
				aria-label={`فتح ملف ${staff.name}`}
				className="absolute inset-0 z-10 cursor-pointer rounded-lg focus-visible:outline-2 focus-visible:outline-primary"
			/>

			<div className="flex flex-1 flex-col gap-2.5 p-3.5">
				{/* الصورة والاسم يمينًا وشارة الحالة يسارًا */}
				<div className="flex items-start justify-between gap-2">
					<div className="flex min-w-0 flex-1 items-center gap-2">
						<span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-primary/20 bg-primary text-xs font-semibold text-white">
							{avatarUrl ? (
								<img
									src={avatarUrl}
									alt={staff.name}
									className="size-full object-cover"
								/>
							) : (
								initialsOf(staff.name)
							)}
						</span>
						<div className="flex min-w-0 flex-col">
							<span className="line-clamp-1 text-[14px] font-bold text-foreground">
								{staff.prefix ? `${staff.prefix} ` : ""}
								{staff.name}
							</span>
							<span className="text-[11px] text-muted-foreground">{staff.code}</span>
						</div>
					</div>
					<Badge
						variant={status.variant}
						className="shrink-0 text-[10px]"
					>
						{status.label}
					</Badge>
				</div>

				<div className="flex flex-wrap items-center gap-1">
					{staff.role && (
						<Chip>
							<IconBriefcase className="size-2.5" />
							{staff.role.name}
						</Chip>
					)}
					{staff.branch && (
						<Chip>
							<IconBuildingStore className="size-2.5" />
							{staff.branch.name}
						</Chip>
					)}
					{staff.employmentType && <Chip>{EMPLOYMENT_LABEL[staff.employmentType]}</Chip>}
				</div>

				<div className="mt-auto flex items-center justify-between gap-2 border-t pt-2.5">
					<div className="flex min-w-0 flex-col gap-1 text-[11px] text-muted-foreground">
						{staff.email && (
							<span className="flex min-w-0 items-center gap-1.5">
								<IconMail className="size-3.5 shrink-0" />
								<span
									dir="ltr"
									className="truncate"
								>
									{staff.email}
								</span>
							</span>
						)}
						{staff.phone && (
							<span className="flex items-center gap-1.5">
								<IconPhone className="size-3.5 shrink-0" />
								<span dir="ltr">{staff.phone}</span>
							</span>
						)}
					</div>

					<DropdownMenu dir="rtl">
						<DropdownMenuTrigger
							aria-label="خيارات الموظف"
							className="relative z-20 flex size-7 shrink-0 items-center justify-center rounded-md border text-muted-foreground hover:bg-muted"
						>
							<IconDots className="size-4" />
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start">
							<DropdownMenuItem
								className="gap-2"
								onSelect={onOpen}
							>
								<IconEye className="size-4" />
								فتح
							</DropdownMenuItem>
							<DropdownMenuItem
								className="gap-2"
								onSelect={onDisable}
							>
								<IconBan className="size-4" />
								تعطيل
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="gap-2 text-destructive"
								onSelect={onDelete}
							>
								<IconTrash className="size-4" />
								حذف
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</div>
	);
}
