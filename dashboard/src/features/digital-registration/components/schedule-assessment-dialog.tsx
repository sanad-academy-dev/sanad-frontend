import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
	IconCalendar,
	IconCalendarPlus,
	IconClock,
	IconDeviceFloppy,
	IconUserCheck,
	IconX,
} from "@tabler/icons-react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/common/field-label";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useStaffForBooking } from "@/features/appointments/hooks/use-staff-for-booking";
import type { CampaignRequestItem } from "../types/campaign-request.types";
import { useScheduleAssessmentAppointment } from "../hooks/use-digital-registration";

export function ScheduleAssessmentDialog({
	open,
	onOpenChange,
	request,
	campaignId,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	request: CampaignRequestItem;
	campaignId: string;
}) {
	const { staff = [], isLoading: isLoadingStaff } = useStaffForBooking();
	const scheduleMutation = useScheduleAssessmentAppointment(campaignId);

	const [staffId, setStaffId] = useState("");
	const [date, setDate] = useState("");
	const [time, setTime] = useState("10:00");
	const [durationMinutes, setDurationMinutes] = useState("45");
	const [notes, setNotes] = useState("");
	const [error, setError] = useState<string | null>(null);

	// Initialize default values when opening
	useEffect(() => {
		if (open) {
			const tomorrow = new Date();
			tomorrow.setDate(tomorrow.getDate() + 1);
			setDate(tomorrow.toISOString().split("T")[0]);
			setTime("10:00");
			setDurationMinutes("45");
			setNotes(`جلسة فحص وتقييم قبول مبدئي للمتقدم ${request.patientName || request.name}`);
			setError(null);
			if (staff.length > 0) {
				setStaffId(staff[0].id);
			}
		}
	}, [open]);

	useEffect(() => {
		if (open && staff.length > 0 && !staffId) {
			setStaffId(staff[0].id);
		}
	}, [open, staff, staffId]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!date) {
			setError("تاريخ الجلسة مطلوب");
			return;
		}
		if (!time) {
			setError("وقت بدء الجلسة مطلوب");
			return;
		}

		try {
			const [hours, minutes] = time.split(":").map(Number);
			const scheduledDate = new Date(date);
			scheduledDate.setHours(hours, minutes, 0, 0);

			await scheduleMutation.mutateAsync({
				requestId: request.id,
				data: {
					staffId: staffId || undefined,
					startsAt: scheduledDate.toISOString(),
					durationMinutes: Number(durationMinutes) || 45,
					notes: notes.trim() || undefined,
				},
			});

			toast.success(
				`تم حجز موعد جلسة التقييم (${date} الساعة ${time}) بنجاح وتحويل الطلب لمرحلة التقييم`,
			);
			onOpenChange(false);
		} catch (err: any) {
			const msg = err?.message || "فشل تثبيت موعد جلسة التقييم";
			setError(msg);
			toast.error(msg);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md flex flex-col p-0 gap-0" dir="rtl">
				<DialogHeader className="p-4 border-b bg-muted/20 text-start">
					<div className="flex items-center gap-2">
						<div className="flex size-8 items-center justify-center rounded-md bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300">
							<IconCalendarPlus className="size-4" />
						</div>
						<div>
							<DialogTitle className="text-base font-bold">
								تثبيت موعد الفحص والتقييم بالتقويم
							</DialogTitle>
							<DialogDescription className="text-xs text-muted-foreground mt-0.5">
								جدولة جلسة حضورية رسمية للطالب ({request.patientName || request.name})
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
					{error && (
						<div className="rounded-md bg-destructive/10 border border-destructive/20 p-2.5 text-xs font-semibold text-destructive text-center">
							{error}
						</div>
					)}

					{/* معلومات الطالب وولي الأمر */}
					<div className="rounded-md border p-2.5 bg-muted/30 text-xs flex items-center justify-between">
						<div>
							<span className="font-semibold block text-foreground">
								{request.patientName || request.name}
							</span>
							<span className="text-[11px] text-muted-foreground">
								ولي الأمر: {request.guardianName} ({request.guardianPhone})
							</span>
						</div>
						<div className="font-mono text-[11px] bg-background px-2 py-0.5 rounded border">
							#{request.code}
						</div>
					</div>

					{/* اختيار الأخصائي */}
					<div className="space-y-1">
						<FieldLabel required>الأخصائي / الفاحص المسؤول</FieldLabel>
						<Select value={staffId} onValueChange={setStaffId}>
							<SelectTrigger className="h-8 text-xs">
								<SelectValue placeholder={isLoadingStaff ? "جاري تحميل الكادر..." : "اختر الأخصائي"} />
							</SelectTrigger>
							<SelectContent dir="rtl">
								{staff.map((s) => (
									<SelectItem key={s.id} value={s.id}>
										<div className="flex items-center gap-1.5">
											<IconUserCheck className="size-3.5 text-primary" />
											<span>{s.name}</span>
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* التاريخ والوقت */}
					<div className="grid grid-cols-2 gap-2">
						<div className="space-y-1">
							<FieldLabel required>تاريخ الجلسة</FieldLabel>
							<Input
								type="date"
								value={date}
								onChange={(e) => setDate(e.target.value)}
								className="h-8 text-xs"
								required
							/>
						</div>

						<div className="space-y-1">
							<FieldLabel required>وقت البدء</FieldLabel>
							<Input
								type="time"
								value={time}
								onChange={(e) => setTime(e.target.value)}
								className="h-8 text-xs"
								required
							/>
						</div>
					</div>

					{/* مدة الجلسة */}
					<div className="space-y-1">
						<FieldLabel required>مدة الجلسة المتوقعة</FieldLabel>
						<Select value={durationMinutes} onValueChange={setDurationMinutes}>
							<SelectTrigger className="h-8 text-xs">
								<SelectValue />
							</SelectTrigger>
							<SelectContent dir="rtl">
								<SelectItem value="30">30 دقيقة (تقييم سريع)</SelectItem>
								<SelectItem value="45">45 دقيقة (تقييم شامل قياسي)</SelectItem>
								<SelectItem value="60">60 دقيقة (ساعة كاملة)</SelectItem>
								<SelectItem value="90">90 دقيقة (جلسة متعددة المحاور)</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* الملاحظات */}
					<div className="space-y-1">
						<FieldLabel>ملاحظات الجلسة أو متطلبات الفحص</FieldLabel>
						<Textarea
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							placeholder="اكتب أي توجيهات للأخصائي أو لولي الأمر أثناء الجلسة..."
							className="text-xs min-h-[70px] resize-none"
						/>
					</div>

					<DialogFooter className="p-0 pt-2 flex items-center justify-end gap-2 border-t">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => onOpenChange(false)}
							disabled={scheduleMutation.isPending}
							className="h-8 text-xs gap-1"
						>
							<IconX className="size-3.5" />
							إلغاء
						</Button>
						<Button
							type="submit"
							size="sm"
							disabled={scheduleMutation.isPending}
							className="h-8 text-xs font-semibold gap-1.5 bg-purple-600 hover:bg-purple-700 text-white"
						>
							<IconDeviceFloppy className="size-3.5" />
							{scheduleMutation.isPending ? "جاري التثبيت بالتقويم..." : "تثبيت الموعد ونقل للتقييم"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
