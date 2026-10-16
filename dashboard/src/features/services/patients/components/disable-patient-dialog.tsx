import type { PatientResponse } from "@sanad/contracts/runtime/server/patients/patients.type";
import {
	IconAlertCircle,
	IconCheck,
	IconChevronLeft,
	IconInfoCircle,
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
import { useDisablePatient } from "@/features/services/patients/hooks/use-disable-patient";
import { cn } from "@/lib/utils";

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

interface DisablePatientDialogProps {
	patient: PatientResponse | null;
	onClose: () => void;
	onSuccess?: (patient: PatientResponse) => void;
}

export function DisablePatientDialog({
	patient,
	onClose,
	onSuccess,
}: DisablePatientDialogProps) {
	const [notifyManager, setNotifyManager] = useState(false);
	const { disablePatient, isPending } = useDisablePatient();

	const isDisabling = patient?.active !== false;

	const handleDisable = async () => {
		if (!patient) return;
		try {
			const updated = await disablePatient(patient.id, !isDisabling);
			onSuccess?.(updated as unknown as PatientResponse);
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

	useHotkey("Mod+Enter", () => void handleDisable(), {
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
						<DialogTitle
							className={cn(
								"font-semibold text-sm",
								isDisabling ? "text-amber-600" : "text-emerald-600",
							)}
						>
							{isDisabling ? "تعطيل الطفل" : "تفعيل الطفل"}
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

				<DialogDescription className="sr-only">
					{isDisabling ? "تأكيد تعطيل الطفل في النظام" : "تأكيد إعادة تفعيل الطفل في النظام"}
				</DialogDescription>

				<div className="px-5 py-5 flex flex-col gap-4">
					<p className="text-sm text-foreground leading-relaxed">
						{isDisabling
							? `هل أنت متأكد من تعطيل الطفل "${patient?.name}"؟ سيتم إيقاف التعامل مع السجل دون حذف بياناته أو سجلاته السابقة.`
							: `هل أنت متأكد من إعادة تفعيل الطفل "${patient?.name}"؟ سيتمكن من استئناف الحضور والأنشطة والظهور في البحث.`}
					</p>

					<div
						className={cn(
							"rounded-lg border p-4 flex flex-col gap-2.5",
							isDisabling
								? "border-amber-400/40 bg-amber-50/60 dark:bg-amber-950/20"
								: "border-emerald-400/40 bg-emerald-50/60 dark:bg-emerald-950/20",
						)}
					>
						<p
							className={cn(
								"text-sm font-semibold flex items-center gap-1.5",
								isDisabling ? "text-amber-600" : "text-emerald-600",
							)}
						>
							<IconAlertCircle className="size-4" />
							النتائج المترتبة:
						</p>
						<ul className="flex flex-col gap-1.5">
							{isDisabling ? (
								<>
									<li className="flex items-start gap-2 text-sm text-foreground">
										<IconInfoCircle className="size-4 text-amber-500 shrink-0 mt-0.5" />
										لن يمكن تسجيل حضور أو خطط أو زيارات جديدة مرتبطة بهذا الطفل
									</li>
									<li className="flex items-start gap-2 text-sm text-foreground">
										<IconInfoCircle className="size-4 text-amber-500 shrink-0 mt-0.5" />
										لن يظهر في القوائم النشطة والبحث السريع
									</li>
									<li className="flex items-start gap-2 text-sm text-foreground">
										<IconInfoCircle className="size-4 text-amber-500 shrink-0 mt-0.5" />
										ستظل السجلات والرسوم السابقة محفوظة بالكامل دون أي تعديل
									</li>
								</>
							) : (
								<>
									<li className="flex items-start gap-2 text-sm text-foreground">
										<IconCheck className="size-4 text-emerald-500 shrink-0 mt-0.5" />
										إعادة إتاحة تسجيل الحضور والخطط والأنشطة للطفل
									</li>
									<li className="flex items-start gap-2 text-sm text-foreground">
										<IconCheck className="size-4 text-emerald-500 shrink-0 mt-0.5" />
										إعادة ظهور الطفل في العمليات النشطة والبحث اليومي
									</li>
								</>
							)}
						</ul>
					</div>
				</div>

				<div className="px-5 py-3.5 border-t flex flex-wrap gap-3 items-center justify-between bg-muted/10">
					<label
						htmlFor="notify-manager-disable-patient"
						className="flex items-center gap-2 cursor-pointer select-none"
					>
						<Switch
							id="notify-manager-disable-patient"
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
							onClick={handleDisable}
							disabled={isPending}
							className={cn(
								"gap-2 flex text-white h-9 px-4",
								isDisabling
									? "bg-amber-500 hover:bg-amber-600"
									: "bg-emerald-600 hover:bg-emerald-700",
							)}
						>
							<span>{isDisabling ? "تعطيل الطفل" : "تفعيل الطفل"}</span>
							<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-white/30 bg-white/10 px-1.5 font-mono text-[10px] opacity-60">
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
