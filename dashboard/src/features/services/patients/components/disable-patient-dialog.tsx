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
import { useDisablePatient } from "@/features/services/patients/hooks/use-disable-patient";
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

interface DisablePatientDialogProps {
	patient: PatientResponse | null;
	onClose: () => void;
}

export function DisablePatientDialog({ patient, onClose }: DisablePatientDialogProps) {
	const [notifyManager, setNotifyManager] = useState(false);
	const { disablePatient, isPending } = useDisablePatient();

	const handleDisable = async () => {
		if (!patient) return;
		await disablePatient(patient.id);
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
					<DialogTitle className="text-amber-600 font-semibold text-sm">
						تعطيل الطفل
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

				<DialogDescription className="sr-only">تأكيد تعطيل الطفل في النظام</DialogDescription>

				<div className="px-5 py-5 flex flex-col gap-4">
					<p className="text-sm text-foreground leading-relaxed">
						هل أنت متأكد من تعطيل الطفل &ldquo;{patient?.name}&rdquo;؟ سيتم إيقاف التعامل مع
						السجل دون حذف بياناته أو سجلاته السابقة.
					</p>

					<div className="rounded-lg border border-amber-400/40 bg-amber-50/60 dark:bg-amber-950/20 p-4 flex flex-col gap-2.5">
						<p className="text-sm font-semibold text-amber-600 flex items-center gap-1.5">
							<IconAlertCircle className="size-4" />
							النتائج المترتبة:
						</p>
						<ul className="flex flex-col gap-1.5">
							<li className="flex items-start gap-2 text-sm text-foreground">
								<IconInfoCircle className="size-4 text-amber-500 shrink-0 mt-0.5" />
								لن يمكن حجز زيارات جديدة مرتبطة بهذا الطفل
							</li>
							<li className="flex items-start gap-2 text-sm text-foreground">
								<IconInfoCircle className="size-4 text-amber-500 shrink-0 mt-0.5" />
								لن يظهر في العمليات النشطة والبحث السريع
							</li>
							<li className="flex items-start gap-2 text-sm text-foreground">
								<IconInfoCircle className="size-4 text-amber-500 shrink-0 mt-0.5" />
								ستظل السجلات الطبية والفواتير السابقة محفوظة
							</li>
						</ul>
					</div>
				</div>

				<div className="px-5 py-4 border-t flex gap-2 items-center justify-end">
					<label
						htmlFor="notify-manager-disable-patient"
						className="flex items-center gap-2 cursor-pointer select-none"
					>
						<span className="text-sm text-muted-foreground">إشعار المدير عبر البريد</span>
						<Switch
							id="notify-manager-disable-patient"
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
