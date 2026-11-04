import {
	IconAlertTriangle,
	IconCalendarOff,
	IconClock,
	IconMapPin,
	IconUser,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { CampaignRequestItem } from "../../types/campaign-request.types";

interface CancelAppointmentConfirmDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	request: CampaignRequestItem | null;
	targetColumnName: string;
	onConfirm: () => void;
	onCancel: () => void;
	isLoading?: boolean;
}

export function CancelAppointmentConfirmDialog({
	open,
	onOpenChange,
	request,
	targetColumnName,
	onConfirm,
	onCancel,
	isLoading = false,
}: CancelAppointmentConfirmDialogProps) {
	if (!request) return null;

	const studentName = request.patientName || request.name || "الطالب";
	const rawDate = request.appointmentDate || request.assessmentAppointment?.startsAt;

	let formattedDateStr = "موعد محدد";
	let formattedTimeStr = "";
	if (rawDate) {
		try {
			const d = new Date(rawDate);
			if (!Number.isNaN(d.getTime())) {
				formattedDateStr = d.toLocaleDateString("ar-EG", {
					weekday: "long",
					year: "numeric",
					month: "long",
					day: "numeric",
				});
				formattedTimeStr = d.toLocaleTimeString("ar-EG", {
					hour: "2-digit",
					minute: "2-digit",
				});
			}
		} catch {
			formattedDateStr = String(rawDate);
		}
	}

	const reviewerName =
		request.assignedStaff?.name ||
		request.assessmentAppointment?.staffName ||
		request.reviewerName ||
		"المراجع المختص";

	const roomName = request.roomName || "القاعة المحددة";

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				showCloseButton={false}
				dir="rtl"
				className="w-[94vw] sm:max-w-[480px] p-6 rounded-2xl gap-5 border border-border/80 shadow-2xl bg-background text-right font-sans z-[70]"
			>
				{/* Header */}
				<DialogHeader className="flex flex-col items-center sm:items-start text-right gap-3">
					<div className="size-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 shadow-xs">
						<IconCalendarOff className="size-6" />
					</div>
					<div>
						<DialogTitle className="text-base font-bold text-foreground">
							تأكيد إلغاء الموعد وتفريغ الخانة
						</DialogTitle>
						<p className="text-xs text-muted-foreground mt-1">
							الطالب: <span className="font-semibold text-foreground">{studentName}</span> · #
							{request.code}
						</p>
					</div>
				</DialogHeader>

				{/* Appointment Details Box */}
				<div className="rounded-xl border border-border/60 bg-muted/40 p-3.5 space-y-2 text-xs">
					<div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
						تفاصيل الموعد المرتبط حالياً:
					</div>
					<div className="flex items-center gap-2 text-foreground font-medium">
						<IconClock className="size-3.5 text-muted-foreground shrink-0" />
						<span>
							{formattedDateStr} {formattedTimeStr && `(${formattedTimeStr})`}
						</span>
					</div>
					<div className="flex items-center gap-2 text-muted-foreground">
						<IconUser className="size-3.5 shrink-0" />
						<span>
							المراجع:{" "}
							<strong className="text-foreground font-semibold">{reviewerName}</strong>
						</span>
					</div>
					{roomName && (
						<div className="flex items-center gap-2 text-muted-foreground">
							<IconMapPin className="size-3.5 shrink-0" />
							<span>
								القاعة: <strong className="text-foreground font-semibold">{roomName}</strong>
							</span>
						</div>
					)}
				</div>

				{/* Notice Banner */}
				<div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
					<IconAlertTriangle className="size-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
					<p>
						إعادة الطلب إلى عمود <strong>«{targetColumnName}»</strong> ستؤدي تلقائياً إلى{" "}
						<strong>إلغاء الموعد وتفريغ وقت الأخصائي والقاعة</strong> في التقويم لإتاحتها فوراً
						لأي طالب آخر.
					</p>
				</div>

				{/* Actions */}
				<div className="flex items-center justify-end gap-2.5 pt-1">
					<Button
						type="button"
						variant="outline"
						size="sm"
						disabled={isLoading}
						onClick={onCancel}
						className="h-9 px-4 text-xs font-medium cursor-pointer"
					>
						تراجع والاحتفاظ بالموعد
					</Button>
					<Button
						type="button"
						size="sm"
						disabled={isLoading}
						onClick={onConfirm}
						className="h-9 px-4 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white cursor-pointer transition-colors shadow-xs"
					>
						{isLoading ? "جارٍ الإلغاء والنقل..." : "إلغاء الموعد ونقل الطلب"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
