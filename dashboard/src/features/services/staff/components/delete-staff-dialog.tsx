import {
	IconAlertCircle,
	IconAlertTriangle,
	IconChevronLeft,
	IconCircleX,
} from "@tabler/icons-react";
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
import { useDeleteStaff } from "@/features/services/staff/hooks/use-delete-staff";
import type { StaffResponse } from "@/server/staff/staff.type";

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

interface DeleteStaffDialogProps {
	staff: StaffResponse | null;
	onClose: () => void;
}

export function DeleteStaffDialog({ staff, onClose }: DeleteStaffDialogProps) {
	const [notifyManager, setNotifyManager] = useState(false);
	const { deleteStaff, isPending } = useDeleteStaff();

	const handleDelete = async () => {
		if (!staff) return;
		await deleteStaff(staff.id);
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
					<DialogTitle className="text-destructive font-semibold text-sm">
						حذف الموظف
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

				<DialogDescription className="sr-only">تأكيد حذف الموظف من النظام</DialogDescription>

				<div className="px-5 py-5 flex flex-col gap-4">
					<p className="text-sm text-foreground leading-relaxed">
						هل أنت متأكد من حذف الموظف &ldquo;{staff?.name}&rdquo;؟ لا يمكن التراجع عن هذا
						الإجراء.
					</p>

					<div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 flex flex-col gap-2.5">
						<p className="text-sm font-semibold text-destructive flex items-center gap-1.5">
							<IconAlertCircle className="size-4" />
							النتائج المترتبة:
						</p>
						<ul className="flex flex-col gap-1.5">
							<li className="flex items-start gap-2 text-sm text-foreground">
								<IconCircleX className="size-4 text-destructive shrink-0 mt-0.5" />
								لن يظهر الموظف داخل النظام بعد الآن
							</li>
							<li className="flex items-start gap-2 text-sm text-foreground">
								<IconCircleX className="size-4 text-destructive shrink-0 mt-0.5" />
								قد تتأثر الزيارات والمهام المرتبطة به
							</li>
							<li className="flex items-start gap-2 text-sm text-foreground">
								<IconAlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
								ستبقى بعض السجلات السابقة للعرض فقط
							</li>
						</ul>
					</div>
				</div>

				<div className="px-5 py-4 border-t flex gap-2 items-center justify-end">
					<label
						htmlFor="notify-manager"
						className="flex items-center gap-2 cursor-pointer select-none"
					>
						<span className="text-sm text-muted-foreground">إشعار المدير عبر البريد</span>
						<Switch
							id="notify-manager"
							checked={notifyManager}
							onCheckedChange={setNotifyManager}
							disabled={isPending}
						/>
					</label>

					<Button
						// variant="destructive"
						onClick={handleDelete}
						disabled={isPending}
						className="gap-2 flex bg-destructive primaryhover:bg-destructive/90"
					>
						<span>حذف</span>
						<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-destructive-foreground/30 bg-destructive-foreground/10 px-1.5 font-mono text-[10px] opacity-60">
							<span>⌘</span>
							<span>↵</span>
						</kbd>
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
