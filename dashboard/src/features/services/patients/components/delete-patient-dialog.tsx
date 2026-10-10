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
import { useDeletePatient } from "@/features/services/patients/hooks/use-delete-patient";
import type { PatientResponse } from "@/server/patients/patients.type";

function PatientAvatar({ name }: { name: string }) {
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

interface DeletePatientDialogProps {
	patient: PatientResponse | null;
	onClose: () => void;
}

export function DeletePatientDialog({ patient, onClose }: DeletePatientDialogProps) {
	const [notifyManager, setNotifyManager] = useState(false);
	const { deletePatient, isPending } = useDeletePatient();

	const handleDelete = async () => {
		if (!patient) return;
		await deletePatient(patient.id);
		onClose();
	};

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			setNotifyManager(false);
			onClose();
		}
	};

	return (
		<Dialog
			open={!!patient}
			onOpenChange={handleOpenChange}
		>
			<DialogContent
				className="sm:max-w-xl! p-0 gap-0"
				dir="rtl"
			>
				<DialogHeader className="px-4 py-3 border-b flex-row items-center gap-2 space-y-0">
					<DialogTitle className="text-destructive font-semibold text-sm">
						حذف الطفل
					</DialogTitle>
					{patient && (
						<>
							<IconChevronLeft className="size-3.5 text-muted-foreground" />
							<div className="flex items-center gap-1.5">
								<PatientAvatar name={patient.name} />
								<span className="text-sm font-medium">{patient.name}</span>
								<span className="text-xs text-muted-foreground tabular-nums">
									{patient.code}
								</span>
							</div>
						</>
					)}
				</DialogHeader>

				<DialogDescription className="sr-only">تأكيد حذف الطفل من النظام</DialogDescription>

				<div className="px-5 py-5 flex flex-col gap-4">
					<p className="text-sm text-foreground leading-relaxed">
						هل أنت متأكد من حذف الطفل &ldquo;{patient?.name}&rdquo;؟ لا يمكن التراجع عن هذا
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
								لن يظهر الطفل داخل النظام بعد الآن
							</li>
							<li className="flex items-start gap-2 text-sm text-foreground">
								<IconCircleX className="size-4 text-destructive shrink-0 mt-0.5" />
								ستُحذف جميع بيانات الطفل والسجلات المرتبطة به
							</li>
							<li className="flex items-start gap-2 text-sm text-foreground">
								<IconAlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
								ستتوقف الإشعارات والزيارات المرتبطة بهذا الطفل
							</li>
						</ul>
					</div>
				</div>

				<div className="px-5 py-4 border-t flex gap-2 items-center justify-end">
					<label
						htmlFor="notify-manager-delete-patient"
						className="flex items-center gap-2 cursor-pointer select-none"
					>
						<span className="text-sm text-muted-foreground">إشعار المدير عبر البريد</span>
						<Switch
							id="notify-manager-delete-patient"
							checked={notifyManager}
							onCheckedChange={setNotifyManager}
							disabled={isPending}
						/>
					</label>

					<Button
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
