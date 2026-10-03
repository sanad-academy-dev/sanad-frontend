import {
	IconAlertCircle,
	IconCalendarX,
	IconPaw,
	IconSparkles,
	IconX,
} from "@tabler/icons-react";
import { type ReactNode, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useUpdateAppointmentStatus } from "@/features/appointments/hooks/use-update-appointment-status";
import { AppointmentStatus } from "@/generated/prisma/enums";

const CANCEL_REASONS = [
	"الدورة غير متاحة",
	"الحالة تحتاج طوارئ",
	"المدرّب غير متواجد",
	"سبب آخر",
] as const;

const CONSEQUENCES = [
	"سيتم إزالة الزيارة من جدول الزيارات والمدرّب الحالي",
	"سيتم إشعار الثلاثة/ المدرّب/ الوالد بإلغاء الزيارة",
	"سيتم تحرير القاعة أو الولاد لارتباط بالجدول",
];

interface CancelAppointmentDialogProps {
	appointmentId: string;
	appointmentCode: string;
	patientName: string;
	trigger?: ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function CancelAppointmentDialog({
	appointmentId,
	appointmentCode,
	patientName,
	trigger,
	open: controlledOpen,
	onOpenChange: controlledOnOpenChange,
}: CancelAppointmentDialogProps) {
	const [internalOpen, setInternalOpen] = useState(false);
	const open = controlledOpen ?? internalOpen;
	const setOpen = controlledOnOpenChange ?? setInternalOpen;

	const [reason, setReason] = useState<string>("");
	const { updateStatus, isPending } = useUpdateAppointmentStatus();

	const handleOpenChange = (next: boolean) => {
		if (!next) setReason("");
		setOpen(next);
	};

	const handleCancel = async () => {
		await updateStatus({ id: appointmentId, status: AppointmentStatus.CANCELLED });
		handleOpenChange(false);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={handleOpenChange}
		>
			{trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

			<DialogContent
				dir="rtl"
				className="p-0 gap-0 max-w-lg!"
				showCloseButton={false}
			>
				<DialogHeader className="border-b px-4 py-2 flex flex-row items-center justify-between gap-3">
					<DialogTitle className="text-base flex items-center gap-2">
						<IconCalendarX className="size-4 text-destructive" />
						<span>إلغاء الزيارة</span>
						<span className="text-muted-foreground">·</span>
						<IconPaw className="size-4 text-muted-foreground" />
						<IconSparkles className="size-4 text-amber-500" />
						<span>{patientName}</span>
						<span className="text-xs font-normal text-muted-foreground tabular-nums">
							{appointmentCode}
						</span>
					</DialogTitle>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="size-8 shrink-0"
						onClick={() => handleOpenChange(false)}
						aria-label="إغلاق"
					>
						<IconX className="size-4" />
					</Button>
				</DialogHeader>

				<div className="p-4 space-y-4">
					<p className="text-sm text-muted-foreground">
						هل أنت متأكد من إلغاء زيارة اللالك{" "}
						<span className="font-semibold text-foreground">"{patientName}"</span>؟ لا يمكن
						التراجع عن هذا الإجراء.
					</p>

					<div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 space-y-2">
						<p className="text-xs font-semibold text-destructive flex items-center gap-1.5">
							<IconAlertCircle className="size-3.5 shrink-0" />
							النتائج المترتبة:
						</p>
						<ul className="space-y-1.5">
							{CONSEQUENCES.map((c) => (
								<li
									key={c}
									className="text-xs text-destructive/80 flex items-start gap-1.5"
								>
									<span className="mt-1 size-1.5 rounded-full bg-destructive/60 shrink-0" />
									{c}
								</li>
							))}
						</ul>
					</div>

					<div className="space-y-2">
						<Label className="text-sm text-muted-foreground">سبب الإلغاء</Label>
						<Select
							value={reason}
							onValueChange={setReason}
							dir="rtl"
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="بدون سبب" />
							</SelectTrigger>
							<SelectContent>
								{CANCEL_REASONS.map((r) => (
									<SelectItem
										key={r}
										value={r}
									>
										{r}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				<Separator />

				<div className="flex items-center justify-between gap-2 p-3.5">
					<div className="flex items-center gap-2">
						<Switch
							id="cancel-email"
							checked={false}
							disabled
						/>
						<Label
							htmlFor="cancel-email"
							className="text-sm text-muted-foreground"
						>
							إشعار عبر البريد
						</Label>
					</div>

					<Button
						variant="destructive"
						onClick={handleCancel}
						disabled={isPending}
					>
						<IconCalendarX className="size-4" />
						إلغاء الزيارة
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
