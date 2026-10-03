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
import { ConsultationTypesPicker } from "@/features/services/staff/components/tabs/scheduling/consultation-types-picker";
import { useRemoveStaffConsultationType } from "@/features/services/staff/hooks/use-remove-staff-consultation-type";
import { useStaffConsultationTypes } from "@/features/services/staff/hooks/use-staff-consultation-types";
import { useToggleStaffConsultationType } from "@/features/services/staff/hooks/use-toggle-staff-consultation-type";
import { cn } from "@/lib/utils";
import type { StaffConsultationTypeResponse } from "@/server/staff-consultation-types/staff-consultation-types.type";

const ROW_CLASS = "!flex !w-full items-center gap-3 text-sm" as const;

function HeaderRow() {
	return (
		<div
			className={cn(ROW_CLASS, "!justify-between text-muted-foreground text-xs font-medium")}
		>
			<div className="flex-1 min-w-0">الكشف</div>
			<div className="w-24 shrink-0 text-center">الاستخدامات</div>
			<div className="w-14 shrink-0 text-center">الحالة</div>
			<div className="w-10 shrink-0 text-center">الإجراءات</div>
		</div>
	);
}

function ConsultationTypeRow({
	row,
	staffId,
}: {
	row: StaffConsultationTypeResponse;
	staffId: string;
}) {
	const { toggleConsultationType } = useToggleStaffConsultationType(staffId);
	const { removeConsultationType } = useRemoveStaffConsultationType(staffId);

	const disabledByClinic = !row.clinicActive;

	return (
		<div className={cn(ROW_CLASS, "!justify-between", disabledByClinic && "opacity-60")}>
			<div className="flex-1 min-w-0">
				<p className="truncate font-medium">{row.consultationTypeName}</p>
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
						onCheckedChange={(checked) =>
							toggleConsultationType({ id: row.id, isActive: checked })
						}
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
							onClick={() => removeConsultationType(row.id)}
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

export function ConsultationTypesSection({ staffId }: { staffId: string }) {
	const { consultationTypes, isLoading } = useStaffConsultationTypes(staffId);

	const addedIds = useMemo(
		() => new Set(consultationTypes.map((c) => c.consultationTypeId)),
		[consultationTypes],
	);

	return (
		<Container
			title="الكشوفات"
			action={
				<ConsultationTypesPicker
					staffId={staffId}
					addedConsultationTypeIds={addedIds}
				/>
			}
		>
			<HeaderRow />
			{isLoading ? (
				<div className={cn(ROW_CLASS, "!justify-between")}>
					<Skeleton className="h-4 w-full" />
				</div>
			) : consultationTypes.length === 0 ? (
				<div className={cn(ROW_CLASS, "!justify-center text-muted-foreground")}>
					<span className="text-xs">لم تتم إضافة كشوفات بعد. اضغط على "إضافة كشف" للبدء.</span>
				</div>
			) : (
				consultationTypes.map((row) => (
					<ConsultationTypeRow
						key={row.id}
						row={row}
						staffId={staffId}
					/>
				))
			)}
		</Container>
	);
}
