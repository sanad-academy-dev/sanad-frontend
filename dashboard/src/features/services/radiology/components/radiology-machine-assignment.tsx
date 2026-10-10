import { IconDeviceDesktopAnalytics } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
	useAssignRadiologyMachine,
	useRadiologyMachines,
} from "@/features/services/radiology/hooks/use-radiology-machines";
import { cn } from "@/lib/utils";
import type { RadiologyItemResponse } from "@/server/radiology/radiology.type";
import { MODALITY_META } from "@sanad/contracts/runtime/server/radiology/radiology-procedure.type";

// ③ تعيين جهاز التصوير — أجهزة الفرع بإشغالها الحالي؛ المعطّل والمشغول
// يظهران بسبب المنع، والخادم يتحقّق مرة أخرى عند التعيين.

export function RadiologyMachineAssignment({ item }: { item: RadiologyItemResponse }) {
	const { machines, isLoading } = useRadiologyMachines(item.id);
	const { assignMachine, isPending } = useAssignRadiologyMachine();
	const assignedId = item.execution?.machineId ?? null;

	if (isLoading) {
		return <p className="text-sm text-muted-foreground">جارٍ جلب أجهزة الفرع...</p>;
	}

	if (machines.length === 0) {
		return (
			<p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
				لا يوجد جهاز {MODALITY_META[item.modality].label} في هذا الفرع — أضِفه من إعدادات الفرع
				← الأشعة ← أجهزة التصوير، أو اختر فرعًا يملك الجهاز المناسب.
			</p>
		);
	}

	// الخادم يُرجع أجهزة طريقة تصوير هذا الفحص وحدها — لا فرز ولا تمييز لازم
	return (
		<div className="flex flex-col gap-2">
			<p className="text-[11px] text-muted-foreground">
				أجهزة {MODALITY_META[item.modality].label} في هذا الفرع
			</p>
			{machines.map((machine) => {
				const isAssigned = machine.id === assignedId;
				const isBlocked = !machine.available && !isAssigned;
				return (
					<button
						key={machine.id}
						type="button"
						disabled={isBlocked || isPending}
						title={machine.blockedReason ?? undefined}
						className={cn(
							"flex items-center justify-between gap-2 rounded-md border p-3 text-start transition-colors",
							isAssigned
								? "border-indigo-300 bg-indigo-50"
								: isBlocked
									? "cursor-not-allowed opacity-50"
									: "hover:bg-muted/50",
						)}
						onClick={() => {
							void assignMachine({
								itemId: item.id,
								machineId: isAssigned ? null : machine.id,
							}).catch(() => {});
						}}
					>
						<div className="flex min-w-0 items-center gap-2">
							<IconDeviceDesktopAnalytics
								className={cn(
									"size-5 shrink-0",
									isAssigned ? "text-indigo-600" : "text-muted-foreground",
								)}
							/>
							<div className="flex min-w-0 flex-col">
								<span className="truncate text-sm font-medium">{machine.name}</span>
								<span className="truncate text-xs text-muted-foreground">
									{machine.room || "بلا قاعة محددة"}
								</span>
							</div>
						</div>
						<div className="flex shrink-0 items-center gap-1.5">
							{machine.blockedReason ? (
								<Badge
									variant="outline"
									className="border-rose-200 bg-rose-50 text-[10px] text-rose-700"
								>
									{machine.blockedReason}
								</Badge>
							) : (
								<Badge
									variant="outline"
									className="text-[10px] tabular-nums"
								>
									{machine.used}/{machine.slots}
								</Badge>
							)}
							{isAssigned && (
								<Badge className="bg-indigo-600 text-[10px] text-white">المعيَّن</Badge>
							)}
						</div>
					</button>
				);
			})}
		</div>
	);
}
