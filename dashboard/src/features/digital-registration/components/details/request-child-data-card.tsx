import { useEffect, useState } from "react";
import {
	IconCalendar,
	IconCheck,
	IconCopy,
	IconExternalLink,
	IconLoader2,
	IconPaperclip,
	IconPlus,
	IconSparkles,
	IconX,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useClinicInfo } from "@/features/settings/services/hooks/use-clinic-info";
import { formatAppointmentDate, formatAppointmentTime, DEFAULT_CLINIC_TIMEZONE } from "../../utils/date-format";
import { getWhatsAppUrl } from "../../utils/phone-format";
import { getPublicPaymentUrl } from "../../utils/ai-templates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { backendFetch } from "@/lib/backend-fetch";
import type { CampaignRequestItem } from "../../types/campaign-request.types";
import {
	useDigitalRegistrationCapabilities,
	useQuickUpdateRequest,
	useConfirmPaymentManually,
} from "../../hooks/use-digital-registration";

interface RequestChildDataCardProps {
	request: CampaignRequestItem;
	campaignId?: string;
	onStatusChange?: (request: CampaignRequestItem, status: CampaignRequestItem["status"]) => void;
	onOpenReschedule?: () => void;
	onOpenAssignPlan?: () => void;
}

const SUBSCRIPTION_PLANS = [
	{ id: "BASIC", name: "الباقة الأساسية (نصف دوام)", price: 800 },
	{ id: "COMPREHENSIVE", name: "الباقة الشاملة (دوام كامل + أنشطة)", price: 1500 },
	{ id: "PREMIUM", name: "الباقة المتميزة (VIP ورعاية خاصة)", price: 2200 },
];

function getInitials(name?: string | null): string {
	if (!name) return "م";
	const clean = name
		.trim()
		.replace(/^(د\.|أ\.|م\.|مهندس|دكتور|أستاذ)\s*/i, "")
		.split(/\s+/);
	if (clean.length === 0 || !clean[0]) return "م";
	if (clean.length === 1) return clean[0].slice(0, 2);
	return `${clean[0][0]}${clean[1][0]}`;
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

export function RequestChildDataCard({
	request,
	campaignId = "",
	onStatusChange: _onStatusChange,
	onOpenReschedule,
	onOpenAssignPlan,
}: RequestChildDataCardProps) {
	const { capabilities } = useDigitalRegistrationCapabilities(campaignId);
	const quickUpdateMutation = useQuickUpdateRequest(campaignId);
	const confirmPaymentMutation = useConfirmPaymentManually(campaignId);

	const handleConfirmManualPayment = () => {
		confirmPaymentMutation.mutate(
			{
				requestId: request.id,
				amount: request.subscriptionAmount ? Number(request.subscriptionAmount) : undefined,
				notes: "تم التحقق من إيصال السداد واعتماد القبول يدوياً من المشرف",
			},
			{
				onSuccess: () => {
					toast.success("تم اعتماد سداد الرسوم وقبول الطالب رسمياً في الأكاديمية");
				},
				onError: (err: any) => {
					toast.error(err?.message || "فشل اعتماد السداد");
				},
			}
		);
	};

	// Notes state
	const [isEditingNotes, setIsEditingNotes] = useState(false);
	const [noteText, setNoteText] = useState(request.notes || "");

	// Classrooms state
	const [classrooms, setClassrooms] = useState<Array<{ id: string; name: string }>>([]);
	const [classPopoverOpen, setClassPopoverOpen] = useState(false);

	// Medical state
	const [allergyInput, setAllergyInput] = useState("");
	const [allergyPopoverOpen, setAllergyPopoverOpen] = useState(false);
	const [medicationInput, setMedicationInput] = useState("");
	const [medicationPopoverOpen, setMedicationPopoverOpen] = useState(false);

	useEffect(() => {
		setNoteText(request.notes || "");
	}, [request.notes]);

	useEffect(() => {
		backendFetch("/api/classrooms")
			.then(async (res) => (res.ok ? res.json() : []))
			.then((items) => setClassrooms(Array.isArray(items) ? items.filter((i) => i?.name) : []))
			.catch(() => setClassrooms([]));
	}, []);

	const displayAge = computeAgeLabel(request.birthDate, request.ageLabel);

	const attendanceProbability = request.attendanceProbability ?? 92;

	// مؤشرات الحالة المنطقية
	const status = request.status;
	const isQueue = status === "QUEUE";
	const isShortlist = status === "SHORTLIST" || status === "REVIEW";
	const isInterview = status === "INTERVIEW" || status === "IN_EVALUATION" || status === "EVALUATION";
	const isWaitlist = status === "WAITLIST";
	const isAwaitingPayment = status === "AWAITING_PAYMENT";
	const isAccepted = status === "ACCEPTED";
	const isRejected = status === "REJECTED";
	const isDuplicate = status === "DUPLICATE";

	const hasAppointment = Boolean(
		request.appointmentDate ||
		(request.assessmentAppointment && request.assessmentAppointment.status !== "CANCELLED")
	);

	// Date formatters
	const birthDateFormatted = (() => {
		if (!request.birthDate) return "غير محدد";
		const d = new Date(request.birthDate);
		if (isNaN(d.getTime())) return "غير محدد";
		return new Intl.DateTimeFormat("ar-EG-u-nu-latn", {
			year: "numeric",
			month: "long",
			day: "numeric",
		}).format(d);
	})();

	const shiftLabel = request.preferredShift
		? request.preferredShift === "MORNING"
			? "صباحي"
			: request.preferredShift === "EVENING"
			? "مسائي"
			: request.preferredShift
		: null;
	const learningModeLabel = request.learningMode
		? request.learningMode === "IN_PERSON"
			? "حضوري"
			: request.learningMode === "REMOTE"
			? "عن بعد"
			: request.learningMode === "HYBRID"
			? "مدمج"
			: request.learningMode
		: null;
	const studyPeriodDisplay =
		[shiftLabel, learningModeLabel].filter(Boolean).join(" • ") || "غير محدد";

	const { clinicInfo } = useClinicInfo();
	const clinicTimezone = clinicInfo?.timezone || DEFAULT_CLINIC_TIMEZONE;

	const appointmentTimeFormatted = request.appointmentDate
		? `${formatAppointmentDate(request.appointmentDate, clinicTimezone, "ar-EG-u-nu-latn", { month: "short", day: "numeric", weekday: undefined, year: undefined })} • ${formatAppointmentTime(request.appointmentDate, clinicTimezone, "ar-EG-u-nu-latn")}`
		: "لم يُحدد بعد";

	// Allergies list
	const allergies: string[] = Array.isArray(request.allergiesList) && request.allergiesList.length > 0
		? (request.allergiesList as string[])
		: request.allergies
		? [request.allergies]
		: [];

	// Medications list
	const medications: string[] = Array.isArray(request.medications) && request.medications.length > 0
		? request.medications.map((m: any) => typeof m === "string" ? m : m.name)
		: [];

	// Handlers
	const handleSendWhatsappReminder = () => {
		if (!request.guardianPhone) {
			toast.error("لا يوجد رقم هاتف مسجل لولي الأمر");
			return;
		}

		const fullDateFormatted = request.appointmentDate
			? formatAppointmentDate(request.appointmentDate, clinicTimezone, "ar-EG-u-nu-latn", {
					weekday: "long",
					day: "numeric",
					month: "long",
					year: "numeric",
			  })
			: "";
		const timeFormatted = request.appointmentDate
			? formatAppointmentTime(request.appointmentDate, clinicTimezone, "ar-EG-u-nu-latn")
			: "";

		const isRemote = request.interviewMode === "REMOTE";
		let locationLine = "";
		if (isRemote) {
			locationLine = "📍 المقر: عبر اتصال مرئي عن بُعد";
			if (request.meetingUrl) {
				locationLine += `\n🔗 رابط الاتصال: ${request.meetingUrl}`;
			}
		} else {
			locationLine = request.roomName
				? `📍 المقر: حضورياً بمقر الأكاديمية - ${request.roomName}`
				: "📍 المقر: حضورياً بمقر الأكاديمية";
		}

		const arrivalAdvice = isRemote
			? "نرجو التكرم بالانضمام للرابط قبل الموعد بـ 5 دقائق للتأكد من جودة الاتصال والصوت."
			: "نرجو التكرم بالحضور قبل الموعد بـ 10 دقائق لضمان انتظام الجلسة.";

		const message =
			`السلام عليكم ورحمة الله وبركاته،\n` +
			`عزيزي ولي أمر الطالب: ${request.patientName} (${request.guardianName ? `أ/ ${request.guardianName}` : "ولي الأمر الكريم"})،\n\n` +
			`نود تذكيركم بموعد جلسة المقابلة والتقييم في أكاديمية سند:\n` +
			(fullDateFormatted ? `📅 اليوم والتاريخ: ${fullDateFormatted}\n` : "") +
			(timeFormatted ? `⏰ الوقت: ${timeFormatted}\n` : "") +
			`${locationLine}\n\n` +
			`${arrivalAdvice}\n` +
			`شاكرين ومقدرين حسن تعاونكم وحرصكم الدائم!\n` +
			`— إدارة القبول والتسجيل | أكاديمية سند`;

		const waUrl = getWhatsAppUrl(request.guardianPhone, message);
		if (!waUrl) {
			toast.error("رقم هاتف ولي الأمر غير صالح لفتح واتساب");
			return;
		}
		window.open(waUrl, "_blank");
		toast.success("تم تجهيز رسالة التذكير وفتح واتساب");
	};

	const handleSaveNotes = () => {
		if (!capabilities.canEdit) return;
		quickUpdateMutation.mutate(
			{
				requestId: request.id,
				data: { notes: noteText.trim() || null },
			},
			{
				onSuccess: () => {
					toast.success("تم تحديث ملاحظات المراجع");
					setIsEditingNotes(false);
				},
				onError: (err: any) => toast.error(err.message || "فشل تحديث الملاحظات"),
			},
		);
	};

	const handleAssignClass = (clsName: string) => {
		if (!capabilities.canEdit) return;
		quickUpdateMutation.mutate(
			{ requestId: request.id, data: { targetClass: clsName } },
			{
				onSuccess: () => {
					toast.success(`تم تعيين الفصل: ${clsName}`);
					setClassPopoverOpen(false);
				},
			},
		);
	};

	const handleAddAllergy = () => {
		if (!capabilities.canEdit) return;
		const val = allergyInput.trim();
		if (!val) return;
		const next = [...allergies, val];
		quickUpdateMutation.mutate(
			{
				requestId: request.id,
				data: { allergiesList: next, allergies: next.join("، ") },
			},
			{
				onSuccess: () => {
					toast.success(`تمت إضافة حساسية: ${val}`);
					setAllergyInput("");
					setAllergyPopoverOpen(false);
				},
			},
		);
	};

	const handleRemoveAllergy = (idx: number) => {
		if (!capabilities.canEdit) return;
		const next = allergies.filter((_, i) => i !== idx);
		quickUpdateMutation.mutate({
			requestId: request.id,
			data: { allergiesList: next, allergies: next.join("، ") },
		});
	};

	const handleAddMedication = () => {
		if (!capabilities.canEdit) return;
		const val = medicationInput.trim();
		if (!val) return;
		const next = [...medications, val];
		quickUpdateMutation.mutate(
			{
				requestId: request.id,
				data: { medications: next },
			},
			{
				onSuccess: () => {
					toast.success(`تمت إضافة دواء: ${val}`);
					setMedicationInput("");
					setMedicationPopoverOpen(false);
				},
			},
		);
	};

	const handleRemoveMedication = (idx: number) => {
		if (!capabilities.canEdit) return;
		const next = medications.filter((_, i) => i !== idx);
		quickUpdateMutation.mutate({
			requestId: request.id,
			data: { medications: next },
		});
	};

	const handleToggleMeals = (val: boolean) => {
		if (!capabilities.canEdit) return;
		quickUpdateMutation.mutate(
			{ requestId: request.id, data: { includeMeals: val } },
			{
				onSuccess: () => toast.success(val ? "تم تفعيل تضمين الوجبات" : "تم إلغاء تضمين الوجبات"),
			},
		);
	};

	const handleToggleStipend = (val: boolean) => {
		if (!capabilities.canEdit) return;
		quickUpdateMutation.mutate(
			{ requestId: request.id, data: { enableDailyStipend: val } },
			{
				onSuccess: () => toast.success(val ? "تم تفعيل المصروف اليومي" : "تم إلغاء المصروف اليومي"),
			},
		);
	};

	return (
		<div className="space-y-1.5 font-sans" dir="rtl">
			{/* عنوان القسم الخارجي */}
			<h3 className="text-[13.5px] font-bold text-zinc-900 dark:text-zinc-100">
				بيانات الطالب
			</h3>

			{/* البوكس الموحد الكبير الشامل من الاسم حتى الاشتراك */}
			<div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-4 px-[13px] space-y-4 shadow-2xs">
				{/* 1. السطر الأول: الاسم والعمر */}
				<div className="flex items-center gap-2 min-w-0">
					<div className="size-6.5 rounded-full bg-[#4F46E5] text-white flex items-center justify-center font-bold text-[11px] shrink-0 select-none">
						{getInitials(request.patientName)}
					</div>
					<span className="font-bold text-[13.5px] text-zinc-900 dark:text-zinc-100 truncate">
						{request.patientName}
					</span>
					<span className="text-zinc-300 dark:text-zinc-600 font-bold">•</span>
					<span className="text-[#3B82F6] font-medium text-xs shrink-0">
						{request.gender === "MALE" ? "ذكر" : "أنثى"}
					</span>
					<span className="text-zinc-300 dark:text-zinc-600 font-bold">•</span>
					<span className="text-zinc-500 text-xs shrink-0">
						{displayAge}
					</span>
				</div>

				{/* 2. بانر احتمال حضور المقابلة - يظهر فقط في مرحلة المقابلة إذا كان هناك موعد محدد */}
				{isInterview && hasAppointment && (
					<div className="flex items-center justify-between gap-2 rounded-md bg-[#EEF2FF] dark:bg-indigo-950/40 border border-[#E0E7FF] dark:border-indigo-900/40 px-3 py-1.5 text-xs">
						<div className="flex items-center gap-1.5 font-medium text-[#4F46E5] dark:text-indigo-300">
							<IconSparkles className="size-3.5 text-[#6366F1] shrink-0" />
							<span>احتمال حضور المقابلة: {attendanceProbability}% (تقدير آلي).</span>
						</div>
						{request.guardianPhone && (
							<button
								type="button"
								onClick={handleSendWhatsappReminder}
								className="h-6 px-2.5 rounded border border-[#C7D2FE] dark:border-indigo-800 bg-white dark:bg-zinc-800 text-[11px] font-medium text-[#4F46E5] dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-zinc-700 transition-colors shadow-2xs cursor-pointer shrink-0"
							>
								إرسال تذكير
							</button>
						)}
					</div>
				)}

				{/* 3. ملاحظات المراجع */}
				<div className="space-y-1.5">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-1.5">
							<span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">ملاحظات المراجع</span>
							<span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
								<IconPaperclip className="size-2.5 rotate-45" />
								<span>داخلية</span>
							</span>
						</div>

						{capabilities.canEdit && !isEditingNotes && (
							<button
								type="button"
								onClick={() => setIsEditingNotes(true)}
								className="inline-flex items-center gap-1 h-6 px-2 text-[11px] font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
							>
								<IconPlus className="size-3 text-zinc-500" />
								<span>{request.notes ? "تعديل الملاحظة" : "إضافة ملاحظة"}</span>
							</button>
						)}
					</div>

					{isEditingNotes ? (
						<div className="rounded-md border border-primary/40 bg-white dark:bg-zinc-900 p-2 space-y-1.5">
							<Textarea
								value={noteText}
								onChange={(e) => setNoteText(e.target.value)}
								placeholder="اكتب ملاحظات التدقيق الداخلي للطالب..."
								className="min-h-14 text-xs resize-none"
							/>
							<div className="flex items-center justify-end gap-1.5">
								<Button
									size="sm"
									variant="outline"
									className="h-6 text-[10px]"
									onClick={() => setIsEditingNotes(false)}
									disabled={quickUpdateMutation.isPending}
								>
									<IconX className="size-2.5" />
									<span>إلغاء</span>
								</Button>
								<Button
									size="sm"
									className="h-6 text-[10px] gap-1"
									onClick={handleSaveNotes}
									disabled={quickUpdateMutation.isPending}
								>
									<IconCheck className="size-2.5" />
									<span>{quickUpdateMutation.isPending ? "جاري الحفظ..." : "حفظ"}</span>
								</Button>
							</div>
						</div>
					) : (
						<div className="rounded-md border border-zinc-200 dark:border-zinc-800 p-2.5 text-xs text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-900/50 min-h-[38px] flex items-center">
							{request.notes ? (
								<span>{request.notes}</span>
							) : (
								<span className="text-zinc-400 italic text-[11px]">لا توجد ملاحظات مراجع مسجلة.</span>
							)}
						</div>
					)}
				</div>

				{/* 4. قائمة البيانات الأساسية (تاريخ الميلاد، المسار المطلوب، فترة الدراسة، الموعد، المدة، الفصل) بدون خطوط سفلية داخلية */}
				<div className="space-y-1.5 pt-1 text-xs">
					{/* تاريخ الميلاد */}
					<div className="flex items-center justify-between py-1">
						<span className="font-medium text-zinc-600 dark:text-zinc-400">تاريخ الميلاد</span>
						<span className="font-semibold text-zinc-900 dark:text-zinc-100">{birthDateFormatted}</span>
					</div>

					{/* المسار المطلوب */}
					<div className="flex items-center justify-between py-1">
						<span className="font-medium text-zinc-600 dark:text-zinc-400">المسار المطلوب</span>
						<span className="font-semibold text-zinc-900 dark:text-zinc-100">
							{request.proposedTrack || "مسار عام"}
						</span>
					</div>

					{/* فترة وطريقة الدراسة */}
					<div className="flex items-center justify-between py-1">
						<span className="font-medium text-zinc-600 dark:text-zinc-400">فترة الدراسة</span>
						<span className="font-semibold text-zinc-900 dark:text-zinc-100">
							{studyPeriodDisplay}
						</span>
					</div>

					{/* موعد المقابلة - منطق ذكي متخصص لكل مرحلة */}
					{isShortlist && !hasAppointment && (
						<div className="flex items-center justify-between py-1">
							<span className="font-medium text-zinc-600 dark:text-zinc-400">موعد المقابلة</span>
							<div className="flex items-center gap-2">
								{capabilities.canSchedule && onOpenReschedule && (
									<button
										type="button"
										onClick={onOpenReschedule}
										className="h-6 px-2.5 text-[11px] font-semibold text-primary border border-primary/30 bg-primary/5 hover:bg-primary/10 rounded transition-colors cursor-pointer"
									>
										تثبيت موعد المقابلة
									</button>
								)}
								{!capabilities.canSchedule && (
									<span className="text-zinc-400 italic text-[11px]">بانتظار تحديد موعد</span>
								)}
							</div>
						</div>
					)}

					{isInterview && (
						<>
							<div className="flex items-center justify-between py-1">
								<span className="font-medium text-zinc-600 dark:text-zinc-400">موعد المقابلة</span>
								<div className="flex items-center gap-2">
									{capabilities.canSchedule && onOpenReschedule && (
										<button
											type="button"
											onClick={onOpenReschedule}
											className="h-5 px-1.5 text-[10px] font-medium text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
										>
											{hasAppointment ? "إعادة الجدولة" : "جدولة موعد"}
										</button>
									)}
									<span className="font-semibold text-zinc-900 dark:text-zinc-100">
										{appointmentTimeFormatted}
									</span>
								</div>
							</div>

							<div className="flex items-center justify-between py-1">
								<span className="font-medium text-zinc-600 dark:text-zinc-400">مدة المقابلة</span>
								<span className="font-semibold text-zinc-900 dark:text-zinc-100">
									{request.assessmentAppointment?.durationMinutes ?? request.interviewDurationMinutes ?? 60} دقيقة
								</span>
							</div>
						</>
					)}

					{(isAwaitingPayment || isAccepted) && hasAppointment && (
						<div className="flex items-center justify-between py-1">
							<span className="font-medium text-zinc-600 dark:text-zinc-400">تاريخ المقابلة</span>
							<span className="font-semibold text-emerald-700 dark:text-emerald-400">
								{appointmentTimeFormatted} (تمت المقابلة)
							</span>
						</div>
					)}

					{/* الفصل المقترح - يظهر في المراحل النشطة أو إذا كان الفصل محدداً مسبقاً */}
					{((isShortlist || isInterview || isAwaitingPayment || isAccepted) || Boolean(request.targetClass)) && (
						<div className="flex items-center justify-between py-1">
							<span className="font-medium text-zinc-600 dark:text-zinc-400">الفصل المقترح</span>
							{capabilities.canEdit && !isAccepted && !isRejected && !isDuplicate ? (
								<Popover open={classPopoverOpen} onOpenChange={setClassPopoverOpen}>
									<PopoverTrigger asChild>
										{request.targetClass ? (
											<button
												type="button"
												className="h-6 px-2 text-[11px] font-semibold text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
											>
												{request.targetClass}
											</button>
										) : (
											<button
												type="button"
												className="inline-flex items-center gap-1 h-6 px-2 text-[11px] font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
											>
												<IconPlus className="size-3 text-zinc-500" />
												<span>تعيين فصل</span>
											</button>
										)}
									</PopoverTrigger>
									<PopoverContent align="end" className="w-52 p-1.5" dir="rtl">
										<p className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200 px-1.5 py-0.5">
											اختر الفصل المناسب للطالب
										</p>
										<div className="space-y-0.5 mt-1 max-h-48 overflow-y-auto">
											{classrooms.map((cls) => (
												<button
													key={cls.id}
													type="button"
													onClick={() => handleAssignClass(cls.name)}
													className="w-full text-right text-[11px] px-1.5 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium transition-colors cursor-pointer"
												>
													{cls.name}
												</button>
											))}
										</div>
									</PopoverContent>
								</Popover>
							) : (
								<span className="font-semibold text-zinc-900 dark:text-zinc-100">
									{request.targetClass || "غير محدد"}
								</span>
							)}
						</div>
					)}
				</div>

				{/* 5. المعلومات الطبية: فاصل علوي واضح بين السكاشن */}
				<div className="space-y-1 border-t border-zinc-200 dark:border-zinc-700 pt-3 text-xs">
					<h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 pb-0.5">المعلومات الطبية</h4>

					{/* الحساسية */}
					<div className="flex items-center justify-between py-0.5">
						<span className="font-medium text-zinc-600 dark:text-zinc-400">الحساسية</span>
						<div className="flex items-center gap-1 flex-wrap justify-end">
							{allergies.map((item, idx) => (
								<Badge
									key={idx}
									variant="outline"
									className="gap-0.5 border-rose-200 text-rose-700 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/40 text-[9.5px] px-1.5 py-0 font-semibold"
								>
									<span>{item}</span>
									{capabilities.canEdit && (
										<button
											type="button"
											onClick={() => handleRemoveAllergy(idx)}
											className="text-rose-400 hover:text-rose-700"
										>
											<IconX className="size-2" />
										</button>
									)}
								</Badge>
							))}
							{capabilities.canEdit && (
								<Popover open={allergyPopoverOpen} onOpenChange={setAllergyPopoverOpen}>
									<PopoverTrigger asChild>
										<button
											type="button"
											className="inline-flex items-center gap-1 h-6 px-2 text-[11px] font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
										>
											<IconPlus className="size-3 text-zinc-500" />
											<span>إضافة حساسية</span>
										</button>
									</PopoverTrigger>
									<PopoverContent align="end" className="w-56 p-2" dir="rtl">
										<p className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100 mb-1.5">
											اسم الحساسية أو المسبب
										</p>
										<div className="flex items-center gap-1">
											<Input
												value={allergyInput}
												onChange={(e) => setAllergyInput(e.target.value)}
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														e.preventDefault();
														handleAddAllergy();
													}
												}}
												placeholder="مثال: الفول السوداني"
												className="h-6.5 text-[10.5px] flex-1"
											/>
											<Button size="sm" className="h-6.5 text-[10.5px] px-2" onClick={handleAddAllergy}>
												إضافة
											</Button>
										</div>
									</PopoverContent>
								</Popover>
							)}
							{!capabilities.canEdit && allergies.length === 0 && (
								<span className="text-zinc-400 italic text-[11px]">لا توجد</span>
							)}
						</div>
					</div>

					{/* الأدوية */}
					<div className="flex items-center justify-between py-0.5">
						<span className="font-medium text-zinc-600 dark:text-zinc-400">الأدوية</span>
						<div className="flex items-center gap-1 flex-wrap justify-end">
							{medications.map((item, idx) => (
								<Badge
									key={idx}
									variant="outline"
									className="gap-0.5 border-blue-200 text-blue-700 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/40 text-[9.5px] px-1.5 py-0 font-semibold"
								>
									<span>{item}</span>
									{capabilities.canEdit && (
										<button
											type="button"
											onClick={() => handleRemoveMedication(idx)}
											className="text-blue-400 hover:text-blue-700"
										>
											<IconX className="size-2" />
										</button>
									)}
								</Badge>
							))}
							{capabilities.canEdit && (
								<Popover open={medicationPopoverOpen} onOpenChange={setMedicationPopoverOpen}>
									<PopoverTrigger asChild>
										<button
											type="button"
											className="inline-flex items-center gap-1 h-6 px-2 text-[11px] font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
										>
											<IconPlus className="size-3 text-zinc-500" />
											<span>إضافة دواء</span>
										</button>
									</PopoverTrigger>
									<PopoverContent align="end" className="w-56 p-2" dir="rtl">
										<p className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100 mb-1.5">
											اسم الدواء والجرعة
										</p>
										<div className="flex items-center gap-1">
											<Input
												value={medicationInput}
												onChange={(e) => setMedicationInput(e.target.value)}
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														e.preventDefault();
														handleAddMedication();
													}
												}}
												placeholder="مثال: بخاخ فنتولين"
												className="h-6.5 text-[10.5px] flex-1"
											/>
											<Button size="sm" className="h-6.5 text-[10.5px] px-2" onClick={handleAddMedication}>
												إضافة
											</Button>
										</div>
									</PopoverContent>
								</Popover>
							)}
							{!capabilities.canEdit && medications.length === 0 && (
								<span className="text-zinc-400 italic text-[11px]">لا توجد</span>
							)}
						</div>
					</div>
				</div>

				{/* 6. الاشتراك: يظهر في مراحل الدفع والاعتماد والتقييم فقط */}
				{(isAwaitingPayment || isAccepted || isInterview) && (
					<div
						className={cn(
							"space-y-2 border-t border-zinc-200 dark:border-zinc-700 pt-3 text-xs transition-colors",
							isAwaitingPayment &&
								"p-3 rounded-lg border border-indigo-200/90 dark:border-indigo-900/60 bg-indigo-50/30 dark:bg-indigo-950/20",
						)}
					>
						<div className="flex items-center justify-between pb-0.5">
							<h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
								{isAwaitingPayment ? "باقة الرسوم الأكاديمية والاشتراك المقترح للسداد" : "الاشتراك"}
							</h4>
							{isAwaitingPayment && (
								<span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
									مرحلة السداد المالي
								</span>
							)}
						</div>

						{/* اختيار الباقة */}
						<div className="flex items-center justify-between py-1">
							<span className="font-medium text-zinc-600 dark:text-zinc-400">اختيار الباقة</span>
							{capabilities.canEdit && !isAccepted ? (
								request.subscriptionPlanName ? (
									<button
										type="button"
										onClick={onOpenAssignPlan}
										className="inline-flex items-center gap-1.5 h-6 px-2.5 text-[11px] font-semibold text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200/80 dark:hover:bg-zinc-700 rounded transition-colors cursor-pointer"
										title="انقر لتعديل باقة الاشتراك"
									>
										<span>{request.subscriptionPlanName}</span>
										<span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-normal">تغيير</span>
									</button>
								) : (
									<button
										type="button"
										onClick={onOpenAssignPlan}
										className="inline-flex items-center gap-1 h-6 px-2 text-[11px] font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
									>
										<IconPlus className="size-3 text-zinc-500" />
										<span>تعيين إشتراك</span>
									</button>
								)
							) : (
								<span className="font-semibold text-zinc-900 dark:text-zinc-100">
									{request.subscriptionPlanName || "غير محدد"}
								</span>
							)}
						</div>

						{/* المبلغ */}
						<div className="flex items-center justify-between py-1">
							<span className="font-medium text-zinc-600 dark:text-zinc-400">المبلغ (يُحسب بعد اختيار الباقة)</span>
							<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700">
								{request.subscriptionAmount ? `${request.subscriptionAmount} ج.م` : "00 ج.م"}
							</span>
						</div>

						{/* تضمين الوجبات */}
						<div className="flex items-center justify-between py-1">
							<span className="font-medium text-zinc-600 dark:text-zinc-400">تضمين الوجبات (تُضاف تكلفتها للاشتراك)</span>
							<Switch
								checked={request.includeMeals ?? false}
								onCheckedChange={handleToggleMeals}
								disabled={!capabilities.canEdit || isAccepted || quickUpdateMutation.isPending}
								className="scale-85"
							/>
						</div>

						{/* تفعيل المصروف اليومي */}
						<div className="flex items-center justify-between py-1">
							<span className="font-medium text-zinc-600 dark:text-zinc-400">تفعيل المصروف اليومي</span>
							<Switch
								checked={request.enableDailyStipend ?? false}
								onCheckedChange={handleToggleStipend}
								disabled={!capabilities.canEdit || isAccepted || quickUpdateMutation.isPending}
								className="scale-85"
							/>
						</div>

						{/* حالة ورابط سداد الرسوم الأكاديمية */}
						{(request.paymentToken || request.paidAt || request.paymentReceiptUrl) && (
							<div className="pt-2 border-t border-zinc-200/80 dark:border-zinc-700/80 space-y-2">
								<div className="flex items-center justify-between">
									<span className="font-semibold text-zinc-700 dark:text-zinc-300">سداد الرسوم:</span>
									{request.paidAt || isAccepted ? (
										<span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
											<IconCheck className="size-3" />
											تم السداد بنجاح
										</span>
									) : request.paymentReceiptUrl ? (
										<span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
											إيصال مرفوع للمراجعة
										</span>
									) : (
										<span className="inline-flex items-center gap-1 rounded bg-indigo-500/10 px-2 py-0.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
											بانتظار السداد
										</span>
									)}
								</div>

								{request.paymentToken && !request.paidAt && (
									<div className="flex items-center justify-between gap-1.5 rounded bg-zinc-50 dark:bg-zinc-800/80 p-1.5 border border-zinc-200 dark:border-zinc-700">
										<span className="text-[10px] text-muted-foreground truncate font-mono select-all flex-1" dir="ltr">
											{getPublicPaymentUrl(request.paymentToken)}
										</span>
										<button
											type="button"
											onClick={() => {
												navigator.clipboard.writeText(getPublicPaymentUrl(request.paymentToken!));
												toast.success("تم نسخ رابط سداد الرسوم");
											}}
											className="inline-flex items-center gap-1 h-5 px-1.5 text-[10px] font-semibold bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded hover:bg-zinc-100 dark:hover:bg-zinc-600 transition-colors cursor-pointer"
											title="نسخ الرابط"
										>
											<IconCopy className="size-3" />
											<span>نسخ</span>
										</button>
										<button
											type="button"
											onClick={() => window.open(getPublicPaymentUrl(request.paymentToken!), "_blank")}
											className="inline-flex items-center h-5 px-1 text-[10px] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
											title="معاينة"
										>
											<IconExternalLink className="size-3" />
										</button>
									</div>
								)}

								{/* إيصال السداد المرفوع واعتماده */}
								{request.paymentReceiptUrl && !request.paidAt && capabilities.canEdit && (
									<div className="flex items-center justify-between gap-2 pt-1">
										<button
											type="button"
											onClick={() => window.open(request.paymentReceiptUrl!, "_blank")}
											className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer"
										>
											<IconExternalLink className="size-3" />
											<span>معاينة إيصال التحويل</span>
										</button>
										<button
											type="button"
											onClick={handleConfirmManualPayment}
											disabled={confirmPaymentMutation.isPending}
											className="inline-flex items-center gap-1 h-6 px-2.5 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors shadow-2xs cursor-pointer"
										>
											{confirmPaymentMutation.isPending ? (
												<IconLoader2 className="size-3 animate-spin" />
											) : (
												<IconCheck className="size-3" />
											)}
											<span>اعتماد السداد والقبول</span>
										</button>
									</div>
								)}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
