import {
	IconBrandWhatsapp,
	IconCalendar,
	IconInfoCircle,
	IconUser,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CampaignRequestItem } from "../../types/campaign-request.types";

interface RequestStudentHeroProps {
	request: CampaignRequestItem;
	onStatusChange?: (status: CampaignRequestItem["status"]) => void;
	onOpenSchedule?: () => void;
}

function computeAgeLabel(birthDate?: string | null, fallbackAge?: string | null): string {
	if (fallbackAge && fallbackAge.trim()) {
		return fallbackAge;
	}
	if (birthDate) {
		const birth = new Date(birthDate);
		if (!isNaN(birth.getTime())) {
			const now = new Date();
			let years = now.getFullYear() - birth.getFullYear();
			const m = now.getMonth() - birth.getMonth();
			if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
				years--;
			}
			if (years > 0) {
				return `${years} ${years <= 10 ? "سنوات" : "سنة"}`;
			}
			const months = Math.max(1, (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth());
			return `${months} شهر`;
		}
	}
	return "غير محدد";
}

function formatAppointmentDate(dateStr?: string | null): string {
	if (!dateStr) return "";
	try {
		const d = new Date(dateStr);
		if (isNaN(d.getTime())) return dateStr;
		return d.toLocaleDateString("ar-SA", {
			day: "numeric",
			month: "short",
		});
	} catch {
		return dateStr;
	}
}

export function RequestStudentHero({
	request,
	onOpenSchedule,
}: RequestStudentHeroProps) {
	const displayAge = computeAgeLabel(request.birthDate, request.ageLabel);
	const hasAppointment = Boolean(
		request.appointmentDate ||
		request.assessmentAppointment?.startsAt ||
		(request.appointmentId && request.appointmentId.trim().length > 0)
	);

	// تعرض هذه الشاشة التقييم المحفوظ فقط؛ لا تُستنتج نسبة من بيانات الطلب.
	const recordedAttendanceProbability = request.attendanceProbability ?? null;
	const attendanceLevel: "high" | "medium" | "low" | "unknown" =
		recordedAttendanceProbability === null
			? "unknown"
			: recordedAttendanceProbability >= 80
				? "high"
				: recordedAttendanceProbability >= 50
					? "medium"
					: "low";

	// إرسال تذكير الموعد لولي الأمر عبر واتساب مباشرة
	const handleSendWhatsappReminder = () => {
		if (!request.guardianPhone) {
			toast.error("لا يوجد رقم هاتف مسجل لولي الأمر");
			return;
		}
		const cleanPhone = request.guardianPhone.replace(/\D/g, "");
		let dateLabel = "المحدد لاحقاً";
		const rawDate = request.appointmentDate || request.assessmentAppointment?.startsAt;
		if (rawDate) {
			try {
				const d = new Date(rawDate);
				dateLabel = d.toLocaleDateString("ar-SA", {
					weekday: "long",
					month: "long",
					day: "numeric",
				});
				const timeStr = d.toLocaleTimeString("ar-SA", { hour: "numeric", minute: "2-digit" });
				dateLabel += ` في تمام الساعة ${timeStr}`;
			} catch {}
		}

		const message = `مرحباً أستاذ ${request.guardianName || "ولي الأمر"}،\nنود تذكيركم بموعد المقابلة والتقييم للطالب "${request.patientName}" في أكاديمية سند يوم ${dateLabel}.\n\nشاكرين حرصكم واهتمامكم!`;
		const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
		window.open(url, "_blank");
		toast.success("تم فتح تطبيق واتساب لإرسال تذكير المقابلة لولي الأمر");
	};

	return (
		<div className="space-y-2" dir="rtl">
			{/* شريط الهيدر العلوي: اسم الطالب + بيانات العمر + كود الطلب بدون شارة الحالة المكررة */}
			<div className="flex flex-wrap items-center justify-between gap-2">
				<div className="flex items-center gap-2 min-w-0">
					<div className="size-6.5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
						<IconUser className="size-3.5" />
					</div>
					<h2 className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100 truncate">
						{request.patientName}
					</h2>
					<span className="text-[10.5px] text-muted-foreground font-medium shrink-0">
						• {request.gender === "MALE" ? "ذكر" : "أنثى"} • {displayAge}
					</span>
				</div>

				{/* كود الطلب المنظومي مع الحفاظ على الترتيب السليم لعلامة الهاشتاغ في RTL */}
				<Badge
					variant="outline"
					className="font-mono text-[10px] font-bold border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 px-1.5 py-0 shrink-0"
				>
					<span dir="ltr">#{request.code}</span>
				</Badge>
			</div>

			{/* يعرض التقييم المحفوظ فقط، ولا يشتق نسبة حضور من الحقول الأخرى. */}
			<div
				className={cn(
					"flex items-center justify-between gap-2 rounded-md border px-2.5 py-1 text-[10.5px] transition-colors select-none",
					attendanceLevel === "high" && "border-emerald-200/90 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-200",
					attendanceLevel === "medium" && "border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/60 dark:bg-indigo-950/20 text-indigo-950 dark:text-indigo-200",
					attendanceLevel === "low" && "border-amber-200/80 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/20 text-amber-950 dark:text-amber-200",
					attendanceLevel === "unknown" && "border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/30 text-zinc-700 dark:text-zinc-300",
				)}
			>
				<div className="flex items-center gap-1.5 font-semibold">
					<IconInfoCircle className="size-3.5 shrink-0" />
					<span>تقييم حضور المقابلة:</span>
					<span dir="ltr" className="font-bold">
						{recordedAttendanceProbability === null ? "غير مسجل" : `${recordedAttendanceProbability}%`}
					</span>
				</div>

				{/* الجانب الأيسر: حالة التذكير وزر الإجراء الذكي */}
				<div className="flex items-center gap-2 shrink-0">
					{!hasAppointment ? (
						<div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
							<span>التذكير متاح بعد تثبيت الموعد</span>
							{onOpenSchedule && (
								<button
									type="button"
									onClick={onOpenSchedule}
									className="text-primary hover:underline font-bold text-[10px] flex items-center gap-0.5 cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary px-1.5 py-0.5 rounded transition-colors"
								>
									<IconCalendar className="size-2.5" />
									<span>تثبيت الموعد</span>
								</button>
							)}
						</div>
					) : (
						<div className="flex items-center gap-2 text-[10px]">
							{request.notifyWhatsapp ? (
								<span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
									<IconBrandWhatsapp className="size-3 text-emerald-600 shrink-0" />
									<span>تذكير الواتساب مفعّل</span>
								</span>
							) : (
								<span className="text-muted-foreground">
									الموعد: {formatAppointmentDate(request.appointmentDate || request.assessmentAppointment?.startsAt)}
								</span>
							)}

							{request.guardianPhone && (
								<button
									type="button"
									onClick={handleSendWhatsappReminder}
									className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer shadow-2xs"
									title="إرسال رسالة تذكير فورية لولي الأمر عبر واتساب"
								>
									<IconBrandWhatsapp className="size-2.5" />
									<span>إرسال تذكير</span>
								</button>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
