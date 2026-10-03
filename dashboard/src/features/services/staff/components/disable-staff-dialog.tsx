import { IconAlertCircle, IconChevronLeft, IconInfoCircle } from "@tabler/icons-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useUpdateStaffStatus } from "@/features/services/staff/hooks/use-update-staff-status";
import { type StaffResponse, StaffStatus } from "@sanad/contracts/runtime/server/staff/staff.type";

function StaffAvatar({ name }: { name: string }) {
	const initials = name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
	return (
		<div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary primarytext-xs font-semibold">
			{initials}
		</div>
	);
}

interface DisableStaffDialogProps {
	staff: StaffResponse | null;
	onClose: () => void;
}

export function DisableStaffDialog({ staff, onClose }: DisableStaffDialogProps) {
	const [notifyManager, setNotifyManager] = useState(false);
	const { updateStatus, isPending } = useUpdateStaffStatus();

	const handleDisable = async () => {
		if (!staff) return;
		await updateStatus({ id: staff.id, status: StaffStatus.INACTIVE });
		onClose();
	};

	return (
		<Dialog
			open={!!staff}
			onOpenChange={(open) => !open && onClose()}
		>
			<DialogContent
				className="sm:max-w-xl! p-0 gap-0"
				dir="rtl"
			>
				<DialogHeader className="px-4 py-3 border-b flex-row items-center gap-2 space-y-0">
					<DialogTitle className="text-amber-600 font-semibold text-sm">
						تعطيل موظف
					</DialogTitle>
					{staff && (
						<>
							<IconChevronLeft className="size-3.5 text-muted-foreground" />
							<div className="flex items-center gap-1.5">
								<StaffAvatar name={staff.name} />
								<span className="text-sm font-medium">{staff.name}</span>
								<span className="text-xs text-muted-foreground tabular-nums">
									{staff.code}
								</span>
							</div>
						</>
					)}
				</DialogHeader>

				<DialogDescription className="sr-only">تأكيد تعطيل الموظف في النظام</DialogDescription>

				<div className="px-5 py-5 flex flex-col gap-4">
					<p className="text-sm text-foreground leading-relaxed">
						هل أنت متأكد من تعطيل الموظف &ldquo;{staff?.name}&rdquo;؟ سيتم إيقاف وصول الموظف
						إلى النظام دون حذف بياناته أو سجلاته السابقة..
					</p>

					<div className="rounded-lg border border-amber-400/40 bg-amber-50/60 dark:bg-amber-950/20 p-4 flex flex-col gap-2.5">
						<p className="text-sm font-semibold text-amber-600 flex items-center gap-1.5">
							<IconAlertCircle className="size-4" />
							النتائج المترتبة:
						</p>
						<ul className="flex flex-col gap-1.5">
							<li className="flex items-start gap-2 text-sm text-foreground">
								<IconInfoCircle className="size-4 text-amber-500 shrink-0 mt-0.5" />
								لن يمكن حجز زيارات جديدة للطفل
							</li>
							<li className="flex items-start gap-2 text-sm text-foreground">
								<IconInfoCircle className="size-4 text-amber-500 shrink-0 mt-0.5" />
								لن يظهر في العمليات النشطة والبحث السريع
							</li>
							<li className="flex items-start gap-2 text-sm text-foreground">
								<IconInfoCircle className="size-4 text-amber-500 shrink-0 mt-0.5" />
								ستظل سجلاته والزيارات السابقة والفواتير والوصفات الطبية محفوظة
							</li>
						</ul>
					</div>
				</div>

				<div className="px-5 py-4 border-t flex gap-2 items-center justify-end">
					<label
						htmlFor="notify-manager-disable"
						className="flex items-center gap-2 cursor-pointer select-none"
					>
						<span className="text-sm text-muted-foreground">إشعار المدير عبر البريد</span>
						<Switch
							id="notify-manager-disable"
							checked={notifyManager}
							onCheckedChange={setNotifyManager}
							disabled={isPending}
						/>
					</label>

					<Button
						onClick={handleDisable}
						disabled={isPending}
						className="gap-2 flex bg-amber-500 primaryhover:bg-amber-600"
					>
						<span>تعطيل</span>
						<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-white/30 bg-white/10 px-1.5 font-mono text-[10px] opacity-60">
							<span>⌘</span>
							<span>↵</span>
						</kbd>
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
