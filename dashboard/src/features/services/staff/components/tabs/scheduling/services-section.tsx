import { IconDots, IconTrash } from "@tabler/icons-react";
import { useMemo } from "react";

import { Container } from "@/components/common/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { ServicesPicker } from "@/features/services/staff/components/tabs/scheduling/services-picker";
import { useRemoveStaffService } from "@/features/services/staff/hooks/use-remove-staff-service";
import { useStaffServices } from "@/features/services/staff/hooks/use-staff-services";
import { useToggleStaffService } from "@/features/services/staff/hooks/use-toggle-staff-service";
import { formatDuration } from "@/features/settings/services/utils/table-formatters";
import { cn } from "@/lib/utils";
import type { StaffServiceResponse } from "@/server/staff-services/staff-services.type";

const ROW_CLASS = "!flex !w-full items-center gap-3 text-sm" as const;

function HeaderRow() {
	return (
		<div
			className={cn(ROW_CLASS, "!justify-between text-muted-foreground text-xs font-medium")}
		>
			<div className="flex-1 min-w-0">الدورة</div>
			<div className="w-28 shrink-0">الفئة</div>
			<div className="w-20 shrink-0 text-center">الوقت</div>
			<div className="w-24 shrink-0 text-center">الاستخدامات</div>
			<div className="w-14 shrink-0 text-center">الحالة</div>
			<div className="w-10 shrink-0 text-center">الإجراءات</div>
		</div>
	);
}

function ServiceRow({ row, staffId }: { row: StaffServiceResponse; staffId: string }) {
	const { toggleService } = useToggleStaffService(staffId);
	const { removeService } = useRemoveStaffService(staffId);

	const disabledByClinic = !row.clinicActive;

	return (
		<div className={cn(ROW_CLASS, "!justify-between", disabledByClinic && "opacity-60")}>
			<div className="flex-1 min-w-0">
				<p className="truncate font-medium">{row.serviceName}</p>
			</div>
			<div className="w-28 shrink-0">
				<span className="truncate text-muted-foreground">{row.categoryName}</span>
			</div>
			<div className="w-20 shrink-0 text-center text-muted-foreground tabular-nums">
				{formatDuration(row.duration)}
			</div>
			<div className="w-24 shrink-0 text-center tabular-nums">
				{row.usageCount.toLocaleString()} مرة
			</div>
			<div className="w-14 shrink-0 flex justify-center">
				{disabledByClinic ? (
					<Badge
						variant="outline"
						className="text-[10px] border-amber-300 bg-amber-50 text-amber-700"
					>
						غير متاحة بالأكاديمية
					</Badge>
				) : (
					<Switch
						size="sm"
						checked={row.isActive}
						onCheckedChange={(checked) => toggleService({ id: row.id, isActive: checked })}
					/>
				)}
			</div>
			<div className="w-10 shrink-0 flex justify-center">
				<DropdownMenu dir="rtl">
					<DropdownMenuTrigger asChild>
						<Button
							size="sm"
							variant="ghost"
							className="size-7 p-0"
						>
							<IconDots className="size-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem
							variant="destructive"
							onClick={() => removeService(row.id)}
						>
							<IconTrash className="size-4" />
							حذف
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}

export function ServicesSection({ staffId }: { staffId: string }) {
	const { services, isLoading } = useStaffServices(staffId);

	const addedIds = useMemo(() => new Set(services.map((s) => s.serviceId)), [services]);

	return (
		<Container
			title="الدورات"
			action={
				<ServicesPicker
					staffId={staffId}
					addedServiceIds={addedIds}
				/>
			}
		>
			<HeaderRow />
			{isLoading ? (
				<div className={cn(ROW_CLASS, "!justify-between")}>
					<Skeleton className="h-4 w-full" />
				</div>
			) : services.length === 0 ? (
				<div className={cn(ROW_CLASS, "!justify-center text-muted-foreground")}>
					<span className="text-xs">لم تتم إضافة دورات بعد. اضغط على "إضافة دورة" للبدء.</span>
				</div>
			) : (
				services.map((row) => (
					<ServiceRow
						key={row.id}
						row={row}
						staffId={staffId}
					/>
				))
			)}
		</Container>
	);
}
