import type { PatientResponse } from "@sanad/contracts/runtime/server/patients/patients.type";
import {
	IconAlertCircle,
	IconAlertTriangle,
	IconChevronLeft,
	IconCircleX,
	IconTrash,
	IconX,
} from "@tabler/icons-react";
import { useHotkey } from "@tanstack/react-hotkeys";
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

function PatientAvatar({ name }: { name?: string | null }) {
	const initials =
		(name ?? "")
			.trim()
			.split(/\s+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((w) => w[0])
			.join("")
			.toUpperCase() || "—";
	return (
		<div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold select-none">
			{initials}
		</div>
	);
}

interface DeletePatientDialogProps {
	patient: PatientResponse | null;
	onClose: () => void;
	onSuccess?: (deletedId: string) => void;
}

export function DeletePatientDialog({
	patient,
	onClose,
	onSuccess,
}: DeletePatientDialogProps) {
	const [notifyManager, setNotifyManager] = useState(false);
	const { deletePatient, isPending } = useDeletePatient();

	const handleDelete = async () => {
		if (!patient) return;
		try {
			const id = patient.id;
			await deletePatient(id);
			onSuccess?.(id);
			onClose();
		} catch {
			// Toast notification handled by hook
		}
	};

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			setNotifyManager(false);
			onClose();
		}
	};

	useHotkey("Mod+Enter", () => void handleDelete(), {
		enabled: !!patient && !isPending,
	});

	return (
		<Dialog
			open={!!patient}
			onOpenChange={handleOpenChange}
		>
			<DialogContent
				className="sm:max-w-xl! p-0 gap-0"
				dir="rtl"
			>
				<DialogHeader className="px-4 py-3 border-b flex-row items-center justify-between gap-2 space-y-0">
					<div className="flex items-center gap-2">
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
					</div>

					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="size-7 text-muted-foreground hover:text-foreground"
						onClick={onClose}
					>
						<IconX className="size-4" />
					</Button>
				</DialogHeader>

				<DialogDescription className="sr-only">تأكيد حذف الطفل من النظام</DialogDescription>

				<div className="px-5 py-5 flex flex-col gap-4">
					<p className="text-sm text-foreground leading-relaxed">
						هل أنت متأكد من حذف الطفل &ldquo;{patient?.name}&rdquo;؟ هذا الإجراء لا يمكن
						التراجع عنه وسيتم حذف السجل وكافة البيانات المرتبطة به.
					</p>

					<div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 flex flex-col gap-2.5">
						<p className="text-sm font-semibold text-destructive flex items-center gap-1.5">
							<IconAlertCircle className="size-4" />
							النتائج المترتبة:
						</p>
						<ul className="flex flex-col gap-1.5">
							<li className="flex items-start gap-2 text-sm text-foreground">
								<IconCircleX className="size-4 text-destructive shrink-0 mt-0.5" />
								لن يظهر الطفل داخل النظام أو البحث أو القوائم بعد الآن
							</li>
							<li className="flex items-start gap-2 text-sm text-foreground">
								<IconCircleX className="size-4 text-destructive shrink-0 mt-0.5" />
								ستُحذف جميع بيانات الطفل والملاحظات والاشتراكات المرتبطة به
							</li>
							<li className="flex items-start gap-2 text-sm text-foreground">
								<IconAlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
								ستتوقف الإشعارات والجداول الزمنية المرتبطة بهذا الطفل
							</li>
						</ul>
					</div>
				</div>

				<div className="px-5 py-3.5 border-t flex flex-wrap gap-3 items-center justify-between bg-muted/10">
					<label
						htmlFor="notify-manager-delete-patient"
						className="flex items-center gap-2 cursor-pointer select-none"
					>
						<Switch
							id="notify-manager-delete-patient"
							checked={notifyManager}
							onCheckedChange={setNotifyManager}
							disabled={isPending}
						/>
						<span className="text-xs text-muted-foreground">إشعار الإدارة عبر البريد</span>
					</label>

					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="h-9 px-4"
							onClick={onClose}
							disabled={isPending}
						>
							إلغاء
						</Button>

						<Button
							onClick={handleDelete}
							disabled={isPending}
							variant="destructive"
							className="h-9 px-4 gap-2"
						>
							<IconTrash className="size-4" />
							<span>تأكيد الحذف</span>
							<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-destructive-foreground/30 bg-destructive-foreground/10 px-1.5 font-mono text-[10px] opacity-60">
								<span>⌘</span>
								<span>↵</span>
							</kbd>
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
