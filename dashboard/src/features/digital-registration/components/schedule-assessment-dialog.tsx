import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
	IconCalendar,
	IconCalendarPlus,
	IconClock,
	IconFileDescription,
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
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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

	// تعبئة البيانات الافتراضية أو قراءة الموعد الحالي إن وُجد
	useEffect(() => {
		if (open) {
			setError(null);

			if (request.assessmentAppointment?.startsAt) {
				const existingDate = new Date(request.assessmentAppointment.startsAt);
				setDate(existingDate.toISOString().split("T")[0]);
				const hours = String(existingDate.getHours()).padStart(2, "0");
				const mins = String(existingDate.getMinutes()).padStart(2, "0");
				setTime(`${hours}:${mins}`);
				setDurationMinutes(String(request.assessmentAppointment.durationMinutes || 45));
			} else {
				const tomorrow = new Date();
				tomorrow.setDate(tomorrow.getDate() + 1);
				setDate(tomorrow.toISOString().split("T")[0]);
				setTime("10:00");
				setDurationMinutes("45");
			}

			setNotes(`جلسة فحص وتقييم قبول مبدئي للمتقدم ${request.patientName || request.name}`);

			if (staff.length > 0 && !staffId) {
				setStaffId(staff[0].id);
			}
		}
	}, [open, request]);

	useEffect(() => {
		if (open && staff.length > 0 && !staffId) {
			setStaffId(staff[0].id);
		}
	}, [open, staff, staffId]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!date) {
			setError("يرجى تحديد تاريخ الجلسة");
			return;
		}
		if (!time) {
			setError("يرجى تحديد وقت بدء الجلسة");
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
				`تم حجز وتثبيت موعد جلسة التقييم (${date} الساعة ${time}) بنجاح ونقل الطلب لمرحلة التقييم`,
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
			<DialogContent className="max-w-lg p-0 gap-0 overflow-hidden sm:rounded-xl" dir="rtl">
				{/* رأس النافذة */}
				<DialogHeader className="p-4 sm:p-5 border-b bg-muted/20 text-start flex flex-row items-center gap-3 space-y-0 pe-10">
					<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-purple-100/80 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/50 shadow-xs">
						<IconCalendarPlus className="size-5" />
					</div>
					<div className="min-w-0">
						<DialogTitle className="text-base font-bold text-foreground">
							تثبيت موعد الفحص والتقييم بالتقويم
						</DialogTitle>
						<DialogDescription className="text-xs text-muted-foreground mt-0.5 truncate">
							جدولة جلسة تقييم حضورية رسمية وتعيين الأخصائي المسؤول
						</DialogDescription>
					</div>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="flex flex-col">
					<div className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto">
						{error && (
							<div className="rounded-md bg-destructive/10 border border-destructive/20 p-2.5 text-xs font-semibold text-destructive text-center">
								{error}
							</div>
						)}

						{/* بطاقة معلومات الطالب وولي الأمر */}
						<div className="rounded-lg border border-purple-200/70 bg-purple-50/40 dark:border-purple-900/50 dark:bg-purple-950/20 p-3 flex items-center justify-between gap-3">
							<div className="flex items-center gap-2.5 min-w-0">
								<div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700 font-bold text-xs dark:bg-purple-900 dark:text-purple-300">
									{(request.patientName || request.name)?.[0] || "ط"}
								</div>
								<div className="min-w-0">
									<div className="flex items-center gap-1.5 flex-wrap">
										<span className="font-bold text-xs text-foreground truncate">
											{request.patientName || request.name}
										</span>
										{request.targetClass && (
											<Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4 bg-background border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-300">
												{request.targetClass}
											</Badge>
										)}
									</div>
									<span className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
										<span>ولي الأمر: {request.guardianName}</span>
										<span className="opacity-40">•</span>
										<span dir="ltr">{request.guardianPhone}</span>
									</span>
								</div>
							</div>

							<div className="shrink-0 flex flex-col items-end gap-1">
								<span className="font-mono text-[11px] font-bold bg-background px-2 py-0.5 rounded border text-muted-foreground shadow-xs" dir="ltr">
									#{request.code}
								</span>
							</div>
						</div>

						{/* اختيار الأخصائي */}
						<div className="space-y-1.5">
							<Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
								<IconUserCheck className="size-3.5 text-muted-foreground" />
								<span>الأخصائي / الفاحص المسؤول</span>
								<span className="text-destructive">*</span>
							</Label>
							<Select value={staffId} onValueChange={setStaffId}>
								<SelectTrigger className="w-full h-9 text-xs bg-background">
									<SelectValue placeholder={isLoadingStaff ? "جاري تحميل قائمة الكادر..." : "اختر الأخصائي المسؤول"} />
								</SelectTrigger>
								<SelectContent dir="rtl" position="popper" sideOffset={4} className="w-[--radix-select-trigger-width]">
									{staff.map((s) => (
										<SelectItem key={s.id} value={s.id}>
											<div className="flex items-center gap-2">
												<IconUserCheck className="size-3.5 text-purple-600" />
												<span>{s.name}</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* التاريخ والوقت */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<div className="space-y-1.5">
								<Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
									<IconCalendar className="size-3.5 text-muted-foreground" />
									<span>تاريخ الجلسة</span>
									<span className="text-destructive">*</span>
								</Label>
								<Input
									type="date"
									value={date}
									onChange={(e) => setDate(e.target.value)}
									className="h-9 text-xs bg-background"
									required
								/>
							</div>

							<div className="space-y-1.5">
								<Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
									<IconClock className="size-3.5 text-muted-foreground" />
									<span>وقت البدء</span>
									<span className="text-destructive">*</span>
								</Label>
								<Input
									type="time"
									value={time}
									onChange={(e) => setTime(e.target.value)}
									className="h-9 text-xs bg-background"
									required
								/>
							</div>
						</div>

						{/* مدة الجلسة */}
						<div className="space-y-1.5">
							<Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
								<IconClock className="size-3.5 text-muted-foreground" />
								<span>مدة الجلسة المتوقعة</span>
								<span className="text-destructive">*</span>
							</Label>
							<Select value={durationMinutes} onValueChange={setDurationMinutes}>
								<SelectTrigger className="w-full h-9 text-xs bg-background">
									<SelectValue />
								</SelectTrigger>
								<SelectContent dir="rtl" position="popper" sideOffset={4} className="w-[--radix-select-trigger-width]">
									<SelectItem value="30">تقييم سريع ومبدئي (30 دقيقة)</SelectItem>
									<SelectItem value="45">تقييم قياسي شامل (45 دقيقة)</SelectItem>
									<SelectItem value="60">جلسة فحص وتدقيق كاملة (60 دقيقة)</SelectItem>
									<SelectItem value="90">تقييم متعدد التخصصات (90 دقيقة)</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* الملاحظات */}
						<div className="space-y-1.5">
							<Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
								<IconFileDescription className="size-3.5 text-muted-foreground" />
								<span>ملاحظات الجلسة أو متطلبات الفحص</span>
								<span className="text-[11px] font-normal text-muted-foreground">(اختياري)</span>
							</Label>
							<Textarea
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								placeholder="اكتب أي تعليمات للأخصائي أو شروط يجب على ولي الأمر إحضارها للجلسة..."
								className="text-xs min-h-[75px] resize-none bg-background leading-relaxed"
							/>
						</div>
					</div>

					{/* تذييل النافذة والأزرار */}
					<DialogFooter className="m-0 px-4 sm:px-5 py-3 border-t bg-muted/30 flex items-center justify-end gap-2.5 rounded-b-xl">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => onOpenChange(false)}
							disabled={scheduleMutation.isPending}
							className="h-9 text-xs px-3"
						>
							<IconX className="size-3.5 me-1" />
							إلغاء
						</Button>
						<Button
							type="submit"
							size="sm"
							disabled={scheduleMutation.isPending}
							className="h-9 text-xs font-semibold px-4 gap-1.5 bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
						>
							<IconCalendarPlus className="size-4" />
							{scheduleMutation.isPending ? "جاري التثبيت بالتقويم..." : "تثبيت الموعد ونقل للتقييم"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
