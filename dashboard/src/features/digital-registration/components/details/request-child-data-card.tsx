import { useEffect, useState } from "react";
import {
	IconCalendar,
	IconCash,
	IconCheck,
	IconCopy,
	IconExternalLink,
	IconEye,
	IconFileDescription,
	IconLoader2,
	IconPaperclip,
	IconPlus,
	IconReceipt,
	IconSparkles,
	IconX,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useClinicInfo } from "@/features/settings/services/hooks/use-clinic-info";
import {
	formatAppointmentDate,
	formatAppointmentTime,
	DEFAULT_CLINIC_TIMEZONE,
	computeAgeLabel,
	getStudentLevel,
	isInterviewOngoing,
} from "../../utils/date-format";
import { getWhatsAppUrl } from "../../utils/phone-format";
import { getChildAssessmentUrl, getPublicPaymentUrl } from "../../utils/ai-templates";
import { getAttendanceProbability } from "../../utils/attendance-probability";
import {
	formatMoneyNumber,
	formatPaymentMethodLabelArabic,
	parseRegistrationPaymentMetadata,
	resolveClinicCurrencySymbol,
} from "../../utils/payment-helpers";
import { AssessmentDetailsDrawer } from "./assessment-details-drawer";
import { FillAssessmentDrawer } from "./fill-assessment-drawer";
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
	useCurrentTimeMs,
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
	onOpenCashPayment?: () => void;
	onOpenViewReceipt?: () => void;
	onOpenFillAssessment?: () => void;
	onOpenViewAssessment?: () => void;
	isExpanded?: boolean;
}

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

export function RequestChildDataCard({
	request,
	campaignId = "",
	onStatusChange: _onStatusChange,
	onOpenReschedule,
	onOpenAssignPlan,
	onOpenCashPayment,
	onOpenViewReceipt,
	onOpenFillAssessment,
	onOpenViewAssessment,
	isExpanded,
}: RequestChildDataCardProps) {
	const { capabilities } = useDigitalRegistrationCapabilities(campaignId);
	const quickUpdateMutation = useQuickUpdateRequest(campaignId);
	const confirmPaymentMutation = useConfirmPaymentManually(campaignId);

	const handleConfirmManualPayment = () => {
		confirmPaymentMutation.mutate(
			{
				requestId: request.id,
				method: request.paymentReceiptUrl ? "BANK_TRANSFER" : "CASH",
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

	// Assessment drawer state
	const [isAssessmentDrawerOpen, setIsAssessmentDrawerOpen] = useState(false);
	const [isFillAssessmentOpen, setIsFillAssessmentOpen] = useState(false);

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
	const displayLevel = getStudentLevel(request);

	const attendanceProb = getAttendanceProbability(request);
	const attendanceProbability = attendanceProb.percentage;

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

	// قاعدة الحيادية المطلقة: بطاقة نتائج التقييم تظهر حصراً بعد الفرز الأولي (المقابلة، انتظار الدفع، القبول، والرفض)
	const isPostScreening = isInterview || isAwaitingPayment || isAccepted || isRejected;

	// التحقق من اكتمال التقييم الأولي (سواء عبر الحقل المهيكل الجديد أو النص الموروث)
	const isAssessmentDone = Boolean(
		(request.assessmentData &&
			((Array.isArray(request.assessmentData.answers) && request.assessmentData.answers.length > 0) ||
				request.assessmentData.score !== undefined ||
				request.assessmentData.candidate)) ||
		(request.notes &&
			(request.notes.includes("إجابات التقييم:") ||
				request.notes.includes("تم التقييم حضورياً") ||
				request.notes.includes("استبيان التقييم الأولي")))
	);

	const assessmentFormattedDate = (() => {
		const rawDate = request.assessmentData?.submittedAt || request.submittedAt || request.createdAt;
		if (!rawDate) return "مؤخراً";
		const d = new Date(rawDate);
		if (isNaN(d.getTime())) return "مؤخراً";
		return new Intl.DateTimeFormat("ar-EG", {
			day: "numeric",
			month: "long",
			year: "numeric",
			hour: "numeric",
			minute: "numeric",
			hour12: true,
		}).format(d);
	})();

	const handleCopyAssessmentLink = () => {
		const url = getChildAssessmentUrl(request.code);
		navigator.clipboard.writeText(url);
		toast.success("تم نسخ رابط التقييم الأولي المخصص للطالب بنجاح");
	};

	const handleSendAssessmentLink = () => {
		const url = getChildAssessmentUrl(request.code);
		navigator.clipboard.writeText(url);

		if (!request.guardianPhone) {
			toast.info("تم نسخ رابط التقييم الأولي (لم يتوفر رقم هاتف لولي الأمر)");
			return;
		}

		const cleanPhone = request.guardianPhone.replace(/\D/g, "");
		const childDisplayName = request.patientName || request.childName || "الطفل";
		const guardianDisplayName = request.guardianName ? `أ/ ${request.guardianName}` : "ولي الأمر";
		const message = `السلام عليكم ورحمة الله وبركاته،\nأهلاً بحضرتك ${guardianDisplayName}،\nنرجو منكم التكرم بتعبئة التقييم الأولي للطالب (${childDisplayName}) لاستكمال إجراءات القبول في الأكاديمية:\n${url}\n\nشاكرين ومقدرين حسن تعاونكم.`;
		const waUrl = getWhatsAppUrl(cleanPhone, message);
		if (waUrl) {
			window.open(waUrl, "_blank");
			toast.success("تم نسخ الرابط وفتح محادثة واتساب لإرسال رابط التقييم لولي الأمر");
		} else {
			toast.success("تم نسخ رابط التقييم الأولي المخصص للطالب بنجاح");
		}
	};

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

	const nowMs = useCurrentTimeMs();
	const { clinicInfo } = useClinicInfo();
	const clinicTimezone = clinicInfo?.timezone || DEFAULT_CLINIC_TIMEZONE;

	const effectiveAppointmentDate =
		request.appointmentDate || request.assessmentAppointment?.startsAt;
	const effectiveDurationMinutes =
		request.assessmentAppointment?.durationMinutes ?? request.interviewDurationMinutes ?? 60;
	const isRemoteInterview = request.interviewMode
		? request.interviewMode === "REMOTE"
		: request.channel === "CALL";
	const isAppointmentOngoing = isInterviewOngoing({
		isInterviewStage: isInterview,
		appointmentDate: effectiveAppointmentDate,
		durationMinutes: effectiveDurationMinutes,
		nowMs,
	});

	const appointmentTimeFormatted = effectiveAppointmentDate
		? `${formatAppointmentDate(effectiveAppointmentDate, clinicTimezone, "ar-EG-u-nu-latn", { month: "short", day: "numeric", weekday: undefined, year: undefined })} • ${formatAppointmentTime(effectiveAppointmentDate, clinicTimezone, "ar-EG-u-nu-latn")}`
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
					{displayLevel && (
						<>
							<span className="text-zinc-300 dark:text-zinc-600 font-bold">•</span>
							<span className="text-zinc-500 dark:text-zinc-400 font-medium text-xs shrink-0">
								المستوى: {displayLevel}
							</span>
						</>
					)}
				</div>

				{/* 2. بانر احتمالية الحضور الذكية - مخفي في الطابور والقائمة المختصرة والانتظار، ويظهر في المقابلة وانتظار الدفع والقبول والرفض */}
				{attendanceProb.shouldShow && (
					<div
						className={cn(
							"flex items-center justify-between gap-2 rounded-md border px-3 py-1.5 text-xs transition-colors",
							attendanceProb.variant === "emerald" && "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300",
							attendanceProb.variant === "blue" && "bg-[#EEF2FF] dark:bg-indigo-950/40 border-[#E0E7FF] dark:border-indigo-900/40 text-[#4F46E5] dark:text-indigo-300",
							attendanceProb.variant === "amber" && "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300",
							attendanceProb.variant === "rose" && "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/40 text-rose-800 dark:text-rose-300",
						)}
					>
						<div className="flex items-center gap-1.5 font-medium">
							<IconSparkles
								className={cn(
									"size-3.5 shrink-0",
									attendanceProb.variant === "emerald" && "text-emerald-600",
									attendanceProb.variant === "blue" && "text-[#6366F1]",
									attendanceProb.variant === "amber" && "text-amber-600",
									attendanceProb.variant === "rose" && "text-rose-600",
								)}
							/>
							<span>{attendanceProb.label}{attendanceProb.reason ? ` (${attendanceProb.reason})` : ""}</span>
						</div>
						{isInterview && hasAppointment && request.guardianPhone && (
							<button
								type="button"
								onClick={handleSendWhatsappReminder}
								className="h-6 px-2.5 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[11px] font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors shadow-2xs cursor-pointer shrink-0"
							>
								إرسال تذكير
							</button>
						)}
					</div>
				)}

				{/* 2.5 قسم التقييم الأولي - لا يظهر في الطابور ولا القائمة المختصرة ولا قائمة الانتظار، ويظهر فقط في المقابلة وانتظار الدفع والقبول والرفض */}
				{!isDuplicate && !(["QUEUE", "SHORTLIST", "WAITLIST"].includes(request.status) || ["queue", "shortlist", "waitlist"].includes((request as any).column)) && (
					isAssessmentDone ? (
						<div className="flex items-center justify-between gap-2 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 px-3 py-2 shadow-2xs">
							{/* الطرف الأيمن: الأيقونة والعنوان وشارة الحالة */}
							<div className="flex items-center gap-2 min-w-0">
								<div className="size-6 rounded-md flex items-center justify-center shrink-0 border bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400">
									<IconFileDescription className="size-4" />
								</div>
								<span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 shrink-0">
									التقييم الأولي
								</span>
								<span className="inline-flex items-center text-[11px] px-2 py-0.5 rounded-md border truncate font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/80 border-zinc-200/90 dark:border-zinc-700">
									تم تعبئة التقييم • {assessmentFormattedDate}
								</span>
							</div>

							{/* الطرف الأيسر: زر عرض الإجابات */}
							<button
								type="button"
								onClick={() => {
									if (onOpenViewAssessment) {
										onOpenViewAssessment();
									} else {
										setIsAssessmentDrawerOpen(true);
									}
								}}
								className="inline-flex items-center gap-1.5 h-6.5 px-2.5 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[11px] font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors shadow-2xs cursor-pointer shrink-0"
							>
								<IconEye className="size-3 text-zinc-500" />
								<span>عرض الإجابات</span>
							</button>
						</div>
					) : (
						<div
							className="w-full rounded-md bg-[#FFFDF0] dark:bg-amber-950/25 border border-[#FDE68A]/80 dark:border-amber-900/40 px-3 py-2 flex items-center justify-between gap-2 shadow-2xs"
							dir="rtl"
						>
							<span className="text-xs text-[#92400E] dark:text-amber-200 font-medium">
								لم يتم تعبئة التقييم الأولي.
							</span>
							<div className="flex items-center gap-3 shrink-0">
								<button
									type="button"
									onClick={() => {
										if (onOpenFillAssessment) {
											onOpenFillAssessment();
										} else {
											setIsFillAssessmentOpen(true);
										}
									}}
									className="text-xs font-bold text-[#4F46E5] dark:text-indigo-400 hover:underline cursor-pointer transition-colors"
								>
									تعبئة
								</button>
								<button
									type="button"
									onClick={handleSendAssessmentLink}
									className="text-xs font-bold text-[#D97706] dark:text-amber-400 hover:underline cursor-pointer transition-colors"
								>
									إرسال
								</button>
							</div>
						</div>
					)
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
							{request.proposedTrack || request.targetClass || "مسار عام"}
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
										جدولة مقابلة
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
									<span
										className={cn(
											"font-semibold transition-colors",
											isAppointmentOngoing
												? "text-red-600 dark:text-red-400"
												: "text-zinc-900 dark:text-zinc-100",
										)}
									>
										{appointmentTimeFormatted}
									</span>
								</div>
							</div>

							{!isRemoteInterview && (
								<div className="flex items-center justify-between py-1">
									<span className="font-medium text-zinc-600 dark:text-zinc-400">الغرفة</span>
									<span className="font-semibold text-zinc-900 dark:text-zinc-100">
										{request.roomName && request.roomName !== "الغرفة"
											? request.roomName
											: "غير محددة"}
									</span>
								</div>
							)}

							<div className="flex items-center justify-between py-1">
								<span className="font-medium text-zinc-600 dark:text-zinc-400">مدة المقابلة</span>
								<span className="font-semibold text-zinc-900 dark:text-zinc-100">
									{effectiveDurationMinutes} دقيقة
								</span>
							</div>
						</>
					)}

					{(isAwaitingPayment || isAccepted) && hasAppointment && (
						<>
							<div className="flex items-center justify-between py-1">
								<span className="font-medium text-zinc-600 dark:text-zinc-400">تاريخ المقابلة</span>
								<span className="font-semibold text-emerald-700 dark:text-emerald-400">
									{appointmentTimeFormatted} (تمت المقابلة)
								</span>
							</div>

							{!isRemoteInterview && request.roomName && request.roomName !== "الغرفة" && (
								<div className="flex items-center justify-between py-1">
									<span className="font-medium text-zinc-600 dark:text-zinc-400">الغرفة</span>
									<span className="font-semibold text-zinc-900 dark:text-zinc-100">
										{request.roomName}
									</span>
								</div>
							)}
						</>
					)}

					{/* الفصل المقترح (المقابلة/السداد) أو الفصل الدراسي (المقبول) - مخفي تماماً في القائمة المختصرة وقائمة الانتظار */}
					{(isInterview || isAwaitingPayment || isAccepted) && (
						<div className="flex items-center justify-between py-1">
							<span className="font-medium text-zinc-600 dark:text-zinc-400">
								{isAccepted ? "الفصل الدراسي" : "الفصل المقترح"}
							</span>
							{capabilities.canEdit && !isRejected && !isDuplicate ? (
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
											{isAccepted ? "تسكين الطالب في فصل" : "اختر الفصل المناسب للطالب"}
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
				<div className="space-y-2 border-t border-zinc-200 dark:border-zinc-700 pt-3 text-xs">
					<h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 pb-0.5">المعلومات الطبية</h4>

					{/* الحساسية */}
					<div className="space-y-1.5 py-0.5">
						<div className="flex items-center justify-between">
							<span className="font-medium text-zinc-600 dark:text-zinc-400">الحساسية</span>
							<div className="flex items-center gap-1">
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

						{/* البوكس الذي يظهر تحته ويحتوي على عناصر الحساسية المضافة مع إكس رمادي */}
						{allergies.length > 0 && (
							<div className="w-full rounded-lg border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 p-2 flex flex-wrap gap-1.5">
								{allergies.map((item, idx) => (
									<div
										key={idx}
										className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[11px] font-medium text-zinc-800 dark:text-zinc-200 shadow-2xs select-none"
									>
										<span>{item}</span>
										{capabilities.canEdit && (
											<button
												type="button"
												onClick={() => handleRemoveAllergy(idx)}
												className="text-zinc-400 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-200 p-0.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
												title={`إزالة ${item}`}
											>
												<IconX className="size-3 text-zinc-400 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-200" />
											</button>
										)}
									</div>
								))}
							</div>
						)}
					</div>

					{/* الأدوية */}
					<div className="space-y-1.5 py-0.5">
						<div className="flex items-center justify-between">
							<span className="font-medium text-zinc-600 dark:text-zinc-400">الأدوية</span>
							<div className="flex items-center gap-1">
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

						{/* البوكس الذي يظهر تحته ويحتوي على عناصر الأدوية المضافة مع إكس رمادي */}
						{medications.length > 0 && (
							<div className="w-full rounded-lg border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 p-2 flex flex-wrap gap-1.5">
								{medications.map((item, idx) => (
									<div
										key={idx}
										className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[11px] font-medium text-zinc-800 dark:text-zinc-200 shadow-2xs select-none"
									>
										<span>{item}</span>
										{capabilities.canEdit && (
											<button
												type="button"
												onClick={() => handleRemoveMedication(idx)}
												className="text-zinc-400 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-200 p-0.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
												title={`إزالة ${item}`}
											>
												<IconX className="size-3 text-zinc-400 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-200" />
											</button>
										)}
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				{/* 6. الاشتراك: يظهر في مراحل الدفع والاعتماد والتقييم فقط */}
				{(isAwaitingPayment || isAccepted || isInterview) && (
					<div className="space-y-2 border-t border-zinc-200 dark:border-zinc-700 pt-3 text-xs">
						<h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 pb-0.5">
							{isAwaitingPayment ? "باقة الرسوم الأكاديمية والاشتراك" : "الاشتراك"}
						</h4>

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
							<span className="font-medium text-zinc-600 dark:text-zinc-400">قيمة الباقة</span>
							<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700">
								{(() => {
									const cur = resolveClinicCurrencySymbol(clinicInfo?.currencyCode);
									return request.subscriptionAmount
										? `${formatMoneyNumber(request.subscriptionAmount)} ${cur}`
										: `0 ${cur}`;
								})()}
							</span>
						</div>

						{/* تضمين الوجبات */}
						<div className="flex items-center justify-between py-1">
							<span className="font-medium text-zinc-600 dark:text-zinc-400">تضمين الوجبات (ضمن مشمولات الباقة)</span>
							<Switch
								checked={request.includeMeals ?? false}
								onCheckedChange={handleToggleMeals}
								disabled={!capabilities.canEdit || isAccepted || Boolean(request.paidAt) || quickUpdateMutation.isPending}
								className="scale-85"
							/>
						</div>

						{/* تفعيل المصروف اليومي */}
						<div className="flex items-center justify-between py-1">
							<span className="font-medium text-zinc-600 dark:text-zinc-400">تفعيل المصروف اليومي (ضمن مشمولات الباقة)</span>
							<Switch
								checked={request.enableDailyStipend ?? false}
								onCheckedChange={handleToggleStipend}
								disabled={!capabilities.canEdit || isAccepted || Boolean(request.paidAt) || quickUpdateMutation.isPending}
								className="scale-85"
							/>
						</div>

						{/* حالة السداد والفاتورة (يبقى ظاهراً بعد القبول لعرض الوسيلة وطباعة الإيصال) */}
						{(isAwaitingPayment || isAccepted || Boolean(request.paymentToken) || Boolean(request.paidAt) || Boolean(request.paymentReceiptUrl)) && (
							<div className="pt-2 border-t border-zinc-200/80 dark:border-zinc-700/80 space-y-2.5">
								<div className="flex items-center justify-between gap-2">
									<span className="font-semibold text-zinc-700 dark:text-zinc-300">سداد الرسوم:</span>
									<div className="flex items-center gap-1.5 flex-wrap">
										{(request.paidAt || isAccepted) && (
											<span className="inline-flex items-center gap-1 rounded bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/70 px-2 py-0.5 text-[10.5px] font-bold text-blue-700 dark:text-blue-300">
												{formatPaymentMethodLabelArabic(request.paymentMethodType, request.paymentGateway)}
											</span>
										)}
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
								</div>

								{/* ملخص الإيصال الدائم بعد السداد وزر فتح/طباعة الفاتورة */}
								{(request.paidAt || isAccepted) && (() => {
									const cur = resolveClinicCurrencySymbol(clinicInfo?.currencyCode);
									const meta = parseRegistrationPaymentMetadata(request.paymentNotes);
									const paidDateText = request.paidAt
										? new Intl.DateTimeFormat("ar-EG-u-nu-latn", {
												day: "numeric",
												month: "long",
												year: "numeric",
										  }).format(new Date(request.paidAt))
										: null;
									return (
										<div className="rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 p-2.5 space-y-2">
											<div className="flex items-center justify-between gap-3 flex-wrap text-[11px]">
												<div className="flex items-center gap-5 flex-wrap">
													{request.paymentReference && (
														<div>
															<span className="text-muted-foreground block text-[10px]">معرف الإيصال</span>
															<span className="font-semibold text-zinc-900 dark:text-zinc-100" dir="ltr">
																{request.paymentReference}
															</span>
														</div>
													)}
													{paidDateText && (
														<div>
															<span className="text-muted-foreground block text-[10px]">تاريخ السداد</span>
															<span className="font-semibold text-zinc-900 dark:text-zinc-100">{paidDateText}</span>
														</div>
													)}
												</div>

												{onOpenViewReceipt && (
													<Button
														type="button"
														size="sm"
														variant="outline"
														onClick={onOpenViewReceipt}
														className="h-7 px-2.5 text-[11px] font-semibold gap-1.5 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 shrink-0 cursor-pointer"
													>
														<IconReceipt className="size-3.5 text-zinc-500" />
														<span>عرض / طباعة الفاتورة</span>
													</Button>
												)}
											</div>

											{meta.changeAmount !== undefined && meta.changeAmount > 0 && (
												<div className="flex items-center justify-between pt-1.5 border-t border-zinc-200/70 dark:border-zinc-800 text-[10.5px]">
													<span className="text-muted-foreground">
														المستلم نقداً: {formatMoneyNumber(meta.cashReceived)} {cur}
													</span>
													<span className="font-semibold text-zinc-700 dark:text-zinc-300">
														الباقي المرتجع: {formatMoneyNumber(meta.changeAmount)} {cur}
													</span>
												</div>
											)}
										</div>
									);
								})()}

								{/* رابط الدفع الإلكتروني وزر الدفع كاش في مرحلة بانتظار الدفع */}
								{!isAccepted && !request.paidAt && (
									<>
										{request.paymentToken && (
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

										{isAwaitingPayment && capabilities.canEdit && onOpenCashPayment && (
											<div className="flex items-center justify-end pt-0.5">
												<Button
													type="button"
													size="sm"
													onClick={onOpenCashPayment}
													className="h-7 px-3 text-[11px] font-bold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs cursor-pointer"
												>
													<IconCash className="size-3.5" />
													<span>الدفع كاش</span>
												</Button>
											</div>
										)}

										{/* إيصال السداد المرفوع واعتماده (للسجلات التراثية فقط إن وُجدت) */}
										{request.paymentReceiptUrl && capabilities.canEdit && (
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
									</>
								)}
							</div>
						)}
					</div>
				)}
			</div>

			{/* دراور تعبئة التقييم الأولي كاحتياط في حال استُخدم المكون خارج الحملة */}
			{!onOpenFillAssessment && (
				<FillAssessmentDrawer
					open={isFillAssessmentOpen}
					onOpenChange={setIsFillAssessmentOpen}
					request={request}
					campaignId={campaignId}
				/>
			)}

			{/* دراور تفاصيل وإجابات التقييم الأولي المستوفية للشروط */}
			<AssessmentDetailsDrawer
				open={isAssessmentDrawerOpen}
				onOpenChange={setIsAssessmentDrawerOpen}
				request={request}
				campaignId={campaignId}
				isExpanded={isExpanded}
			/>
		</div>
	);
}
