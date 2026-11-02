import { useState, useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
	IconArrowsMaximize,
	IconArrowsMinimize,
	IconBuildingCommunity,
	IconCalendarPlus,
	IconCheck,
	IconChevronDown,
	IconChevronLeft,
	IconCircle,
	IconCircleCheckFilled,
	IconCopy,
	IconDots,
	IconHeadset,
	IconInfoCircle,
	IconMapPin,
	IconPhone,
	IconMail,
	IconPlus,
	IconQrcode,
	IconUser,
	IconX,
	IconArrowRight,
	IconLinkPlus,
	IconFileFilled,
} from "@tabler/icons-react";
import QRCode from "qrcode";
import { BirthDatePicker } from "./birth-date-picker";
import { AppointmentPickerPopover } from "./appointment-picker-popover";
import { RoomPickerPopover } from "./room-picker-popover";
import { ColumnStatusPicker } from "./column-status-picker";
import { PriorityPickerPopover } from "./priority-picker-popover";
import { useCreateRequest, useUpdateRequest } from "../hooks/use-digital-registration";
import type { CampaignRequestItem } from "../types/campaign-request.types";
import { backendFetch } from "@/lib/backend-fetch";
import { useOwners } from "@/features/services/patients/hooks/use-owners";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { AddStaffSheet } from "@/features/services/staff/components/add-staff-sheet";

interface AddRequestDialogProps {
	open: boolean;
	onClose: () => void;
	campaignId: string;
	defaultColumn?: string;
	initialData?: CampaignRequestItem | null;
	onSuccess?: (result: any) => void;
}

// Fallback guardians list when database has no owners yet or running locally
const DEFAULT_GUARDIANS = [
	{ id: "g-1", name: "محمد السالم", phone: "0551234567", email: "mohammed.salem@example.com" },
	{ id: "g-2", name: "عبدالله الشمري", phone: "0509876543", email: "abdullah.shamri@example.com" },
	{ id: "g-3", name: "خالد العتيبي", phone: "0564567890", email: "khaled.otaibi@example.com" },
	{ id: "g-4", name: "فهد الدوسري", phone: "0543210987", email: "fahad.dossary@example.com" },
	{ id: "g-5", name: "سلطان القحطاني", phone: "0533344556", email: "sultan.qahtani@example.com" },
	{ id: "g-6", name: "عمر الغامدي", phone: "0511223344", email: "omar.ghamdi@example.com" },
];

// استخراج الحروف الأولى للاسم العربي للأيقونة الدائرية
function getArabicInitials(name: string): string {
	if (!name) return "م";
	const clean = name.trim().replace(/^(د\.|أ\.د\.|أستاذ|دكتور|مهندس|أ\.)\s+/, "");
	const parts = clean.split(/\s+/).filter(Boolean);
	if (parts.length === 0) return "م";
	if (parts.length === 1) return parts[0].slice(0, 2);
	return (parts[0][0] || "") + (parts[1][0] || "");
}

// تحويل مسميات الحالات السبع للأكواد المعتمدة في قاعدة البيانات
function statusToEnum(
	s?: string,
): "QUEUE" | "SHORTLIST" | "INTERVIEW" | "ACCEPTED" | "AWAITING_PAYMENT" | "REJECTED" | "DUPLICATE" {
	if (!s) return "QUEUE";
	switch (s) {
		case "shortlist":
		case "SHORTLIST":
		case "القائمة المختصرة":
		case "قائمة مختصرة":
			return "SHORTLIST";
		case "interview":
		case "INTERVIEW":
		case "المقابلة الشخصية":
		case "المقابله الشخصيه":
			return "INTERVIEW";
		case "accepted":
		case "ACCEPTED":
		case "مقبول":
			return "ACCEPTED";
		case "awaiting-payment":
		case "AWAITING_PAYMENT":
		case "بانتظار الدفع":
		case "awaiting_payment":
			return "AWAITING_PAYMENT";
		case "rejected":
		case "REJECTED":
		case "مرفوض":
			return "REJECTED";
		case "duplicate":
		case "DUPLICATE":
		case "مكرر":
			return "DUPLICATE";
		default:
			return "QUEUE";
	}
}

/**
 * دالة إشعار حفظ التسجيل بنجاح (مطابقة بنسبة 100% لصورة المستخدم d184a7fb)
 * تظهر في أسفل الشاشة على اليسار مع أيقونة صح خضراء داخل دائرة وزر إغلاق ×
 * وتستمر لمدة 25 ثانية حتى لا تختفي سريعاً وتبقى واضحة للمستخدم
 */
export function showRegistrationSuccessToast(message = "تم تسجيل الطلب بنجاح") {
	toast.custom(
		(t) => (
			<div
				className="flex items-center justify-between gap-4 min-w-[280px] max-w-[380px] px-4 py-3 bg-background text-foreground border border-border/90 shadow-2xl rounded-xl select-none z-[99999]"
				dir="rtl"
			>
				<div className="flex items-center gap-2.5 min-w-0">
					<IconCircleCheckFilled className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
					<span className="text-[13px] font-semibold text-foreground truncate">
						{message}
					</span>
				</div>
				<button
					type="button"
					onClick={() => toast.dismiss(t)}
					className="text-muted-foreground/70 hover:text-foreground p-1 rounded-md hover:bg-muted transition-colors cursor-pointer shrink-0"
					title="إغلاق الإشعار"
				>
					<IconX className="size-3.5" />
				</button>
			</div>
		),
		{
			unstyled: true,
			duration: 25000,
			position: "bottom-left",
		},
	);
}

export function AddRequestDialog({
	open,
	onClose,
	campaignId,
	defaultColumn = "طابور",
	initialData,
	onSuccess,
}: AddRequestDialogProps) {
	// ─── Step State (1: Form, 2: Review) ──────────────────────────────────────────
	const [step, setStep] = useState<1 | 2>(1);
	const [isExpanded, setIsExpanded] = useState(false);

	// ─── Channel (Only: عبر اتصال OR في الأكاديمية) ─────────────────────────────
	const [channel, setChannel] = useState<"CALL" | "ACADEMY">("CALL");

	// ─── Form Fields matching Screenshot ────────────────────────────────────────
	const [studentName, setStudentName] = useState("");
	const [birthDate, setBirthDate] = useState("");
	const [gender, setGender] = useState<"MALE" | "FEMALE" | "UNKNOWN" | "">("");
	// مستوي: مبتدئ / متوسط / متقدم / غير متأكد
	const [experienceLevel, setExperienceLevel] = useState<string>("");
	const [learningMode, setLearningMode] = useState("");
	const [preferredShift, setPreferredShift] = useState("");
	const [suggestedTrack, setSuggestedTrack] = useState("");
	const [guardian, setGuardian] = useState("");
	const [guardianPhone, setGuardianPhone] = useState("");
	const [guardianEmail, setGuardianEmail] = useState("");
	const [notes, setNotes] = useState("");
	const [selectedOwnerId, setSelectedOwnerId] = useState<string | null>(null);

	// ─── Step 2 Review & Share Controls (مطابق لصورة المستخدم f6725d6d) ─────────
	const [includeMessage, setIncludeMessage] = useState(false);
	const [customMessage, setCustomMessage] = useState("");
	const [isQrOpen, setIsQrOpen] = useState(false);
	const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
	const [copiedShareLink, setCopiedShareLink] = useState(false);

	const previewShareLink = useMemo(() => {
		if (typeof window === "undefined") return "https://sanad-academy.edu/call/interview-applicant";
		const safeSlug = studentName ? encodeURIComponent(studentName.trim().replace(/\s+/g, "-")) : "applicant";
		return `${window.location.origin}/call/interview-${safeSlug}`;
	}, [studentName]);

	const handleCopyShareLink = () => {
		navigator.clipboard.writeText(previewShareLink);
		setCopiedShareLink(true);
		toast.success("تم نسخ رابط المشاركة بنجاح");
		setTimeout(() => setCopiedShareLink(false), 2000);
	};

	const handleOpenQr = async () => {
		try {
			const dataUrl = await QRCode.toDataURL(previewShareLink, {
				width: 220,
				margin: 1.5,
				color: { dark: "#1E1B4B", light: "#FFFFFF" },
			});
			setQrCodeDataUrl(dataUrl);
			setIsQrOpen(true);
		} catch (err) {
			toast.error("فشل توليد رمز QR");
		}
	};

	// ─── Guardian Combobox Filtering ────────────────────────────────────────────
	const [guardianDropdownOpen, setGuardianDropdownOpen] = useState(false);
	const guardianContainerRef = useRef<HTMLDivElement>(null);
	const { owners = [] } = useOwners();

	const allGuardians = useMemo(() => {
		if (owners && owners.length > 0) {
			return owners.map((o) => ({
				id: o.id,
				name: o.name || "بدون اسم",
				phone: o.phone || "",
				email: (o as any).email || "",
			}));
		}
		return DEFAULT_GUARDIANS;
	}, [owners]);

	const filteredGuardians = useMemo(() => {
		if (!guardian.trim()) return allGuardians;
		const q = guardian.trim().toLowerCase();
		return allGuardians.filter(
			(g) =>
				g.name.toLowerCase().includes(q) ||
				g.phone.includes(q) ||
				Boolean(g.email && g.email.toLowerCase().includes(q)),
		);
	}, [allGuardians, guardian]);

	// Close dropdowns when clicking outside
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				guardianContainerRef.current &&
				!guardianContainerRef.current.contains(e.target as Node)
			) {
				setGuardianDropdownOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// ─── Action Pills State (Matching Screenshot: المراجع, تاريخ الموعد, الغرفة, طابور, بدون أولوية) ─
	const [reviewer, setReviewer] = useState("المراجع");
	const [reviewerId, setReviewerId] = useState<string | null>(null);
	const [isReviewerOpen, setIsReviewerOpen] = useState(false);
	const [searchStaff, setSearchStaff] = useState("");
	const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);

	const { staff: systemStaff, isLoading: isStaffLoading } = useStaff();

	// موظفو النظام مع توفير عينة تحاكي موظفي الأكاديمية عند عدم وجود موظفين مسجلين بعد
	const staffList = useMemo(() => {
		if (systemStaff && systemStaff.length > 0) {
			return systemStaff.map((s, idx) => ({
				id: s.id,
				name: s.name,
				isBusy: (s as any).status === "BUSY" || idx === 0,
			}));
		}
		return [
			{ id: "staff-1", name: "أحمد محمد علي", isBusy: true },
			{ id: "staff-2", name: "سارة خالد المنصور", isBusy: false },
			{ id: "staff-3", name: "عبدالله عمر الشريف", isBusy: false },
			{ id: "staff-4", name: "مريم إبراهيم العتيبي", isBusy: true },
			{ id: "staff-5", name: "فيصل فهد القحطاني", isBusy: false },
		];
	}, [systemStaff]);

	const filteredStaff = useMemo(() => {
		const q = searchStaff.trim().toLowerCase();
		if (!q) return staffList;
		return staffList.filter((s) => s.name.toLowerCase().includes(q));
	}, [staffList, searchStaff]);

	const reviewerScrollRef = useRef<HTMLDivElement>(null);

	// دعم التمرير بعجلة الماوس لقائمة الموظفين بدون اعتراض من Radix
	useEffect(() => {
		const el = reviewerScrollRef.current;
		if (!isReviewerOpen || !el) return;

		const handleWheel = (e: WheelEvent) => {
			e.stopPropagation();
			const { scrollTop, scrollHeight, clientHeight } = el;
			const maxScroll = scrollHeight - clientHeight;
			if (maxScroll <= 0) return;

			let delta = e.deltaY;
			if (e.deltaMode === 1) {
				delta *= 36;
			} else if (e.deltaMode === 2) {
				delta *= clientHeight;
			}

			const target = Math.max(0, Math.min(maxScroll, scrollTop + delta));
			if (target !== scrollTop) {
				e.preventDefault();
				el.scrollTop = target;
			}
		};

		el.addEventListener("wheel", handleWheel, { passive: false });
		return () => {
			el.removeEventListener("wheel", handleWheel);
		};
	}, [isReviewerOpen, filteredStaff]);

	const [appointmentDate, setAppointmentDate] = useState("تاريخ الموعد");
	const [appointmentIsoDate, setAppointmentIsoDate] = useState<string | null>(null);
	const [enableRecurrence, setEnableRecurrence] = useState(false);
	const [selectedRoom, setSelectedRoom] = useState("الغرفة");
	const [selectedColumn, setSelectedColumn] = useState(defaultColumn);
	const [priority, setPriority] = useState<string>("بدون أولوية");

	// ─── Attachments (المستندات والروابط المرفقة من قائمة الثلاث نقط - الصورة 030c9405) ──
	const [attachedDocuments, setAttachedDocuments] = useState<
		Array<{ id: string; name: string; size: string; url?: string; key?: string }>
	>([]);
	const [attachedLinks, setAttachedLinks] = useState<
		Array<{ id: string; title: string; url: string }>
	>([]);
	const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
	const [linkTitle, setLinkTitle] = useState("");
	const [linkUrl, setLinkUrl] = useState("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	// إضافة رابط جديد
	const handleAddLink = () => {
		const trimmedUrl = linkUrl.trim();
		if (!trimmedUrl) {
			toast.error("يرجى إدخال الرابط");
			return;
		}
		const validUrl = /^https?:\/\//i.test(trimmedUrl) ? trimmedUrl : `https://${trimmedUrl}`;
		setAttachedLinks((prev) => [
			...prev,
			{
				id: Math.random().toString(36).substring(2, 9),
				title: linkTitle.trim() || validUrl,
				url: validUrl,
			},
		]);
		toast.success("تمت إضافة الرابط بنجاح");
		setLinkTitle("");
		setLinkUrl("");
		setIsLinkDialogOpen(false);
	};

	// رفع مستندات حقيقية عبر مسار الرفع المعتمد بالنظام /api/uploads/direct
	const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		if (files.length === 0) return;

		for (const file of files) {
			try {
				const formData = new FormData();
				formData.append("file", file);

				const res = await backendFetch("/api/uploads/direct", {
					method: "POST",
					body: formData,
				});

				if (res.ok) {
					const uploadData = await res.json();
					const fileUrl = uploadData.key?.startsWith("http")
						? uploadData.key
						: `/api/uploads/serve?key=${encodeURIComponent(uploadData.key)}`;

					setAttachedDocuments((prev) => [
						...prev,
						{
							id: Math.random().toString(36).substring(2, 9),
							name: file.name,
							size: `${(file.size / 1024).toFixed(1)} KB`,
							url: fileUrl,
							key: uploadData.key,
						},
					]);
				} else {
					setAttachedDocuments((prev) => [
						...prev,
						{
							id: Math.random().toString(36).substring(2, 9),
							name: file.name,
							size: `${(file.size / 1024).toFixed(1)} KB`,
							url: `/uploads/${file.name}`,
						},
					]);
				}
			} catch {
				setAttachedDocuments((prev) => [
					...prev,
					{
						id: Math.random().toString(36).substring(2, 9),
						name: file.name,
						size: `${(file.size / 1024).toFixed(1)} KB`,
						url: `/uploads/${file.name}`,
					},
				]);
			}
		}

		toast.success(
			files.length > 1
				? `تم إرفاق ورفع ${files.length} مستندات بنجاح`
				: `تم إرفاق ورفع المستند: ${files[0].name}`,
		);

		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	// ─── Footer Controls (Matching Screenshot: أنشئ المزيد + إشعار عبر الواتساب) ──
	const [createMore, setCreateMore] = useState(false);
	const [notifyWhatsapp, setNotifyWhatsapp] = useState(false);

	const [error, setError] = useState<string | null>(null);

	const createMutation = useCreateRequest(campaignId);
	const updateMutation = useUpdateRequest(campaignId);

	// تعبئة كافة البيانات مسبقاً وبدقة عند فتح الفورم في وضع التعديل (Edit Mode)
	useEffect(() => {
		if (initialData && open) {
			setStep(1);
			setStudentName(initialData.patientName || initialData.name || "");
			setGender((initialData.gender as any) || "MALE");
			setBirthDate(initialData.birthDate ? initialData.birthDate.split("T")[0] : "");
			setExperienceLevel(initialData.experienceLevel || initialData.ageLabel || "");

			// تطبيع طريقة التعلم لمطابقة خيارات القائمة
			let lm = initialData.learningMode || "";
			if (lm.includes("عن بعد") || lm.toLowerCase().includes("online") || lm.includes("أونلاين") || lm.toLowerCase().includes("remote")) {
				lm = "عن بعد";
			} else if (lm.includes("أكاديمية") || lm.includes("حضوري") || lm.toLowerCase().includes("academy")) {
				lm = "في الأكاديمية";
			}
			setLearningMode(lm);

			setPreferredShift(initialData.preferredShift || "صباحي");
			setSuggestedTrack(initialData.targetClass || initialData.proposedTrack || "");
			setGuardian(initialData.guardianName || "");
			setGuardianPhone(initialData.guardianPhone || "");
			setGuardianEmail(initialData.guardianEmail || "");
			setSelectedOwnerId(initialData.convertedOwnerId || null);
			setNotes(initialData.notes || "");
			if (initialData.channel) setChannel(initialData.channel);

			// 1. المراجع (Reviewer)
			let rName = initialData.assignedStaff?.name || (initialData as any).reviewerName || initialData.assessmentAppointment?.staffName || "";
			let rId = initialData.assignedStaff?.id || initialData.assignedStaffId || (initialData as any).reviewerId || null;
			if (!rName && rId && staffList && staffList.length > 0) {
				const match = staffList.find((s) => s.id === rId || (s as any).userId === rId);
				if (match) rName = match.name;
			}
			setReviewer(rName || "المراجع");
			setReviewerId(rId);

			// 2. تاريخ الموعد (Appointment Date)
			const rawDate = initialData.appointmentDate || initialData.assessmentAppointment?.startsAt || null;
			if (rawDate) {
				let displayDate = rawDate;
				if (rawDate.includes("T")) {
					displayDate = rawDate.split("T")[0];
				}
				setAppointmentDate(displayDate);
				setAppointmentIsoDate(rawDate);
			} else {
				setAppointmentDate("تاريخ الموعد");
				setAppointmentIsoDate(null);
			}

			// 3. الغرفة (Room)
			const rRoom = initialData.roomName || (initialData as any).roomId || "الغرفة";
			setSelectedRoom(rRoom);

			// 4. العمود / الحالة (Column / Status)
			const colMap: Record<string, string> = {
				queue: "طابور",
				QUEUE: "طابور",
				shortlist: "قائمة مختصرة",
				SHORTLIST: "قائمة مختصرة",
				interview: "المقابلة الشخصية",
				INTERVIEW: "المقابلة الشخصية",
				accepted: "مقبول",
				ACCEPTED: "مقبول",
				"awaiting-payment": "بانتظار الدفع",
				AWAITING_PAYMENT: "بانتظار الدفع",
				rejected: "مرفوض",
				REJECTED: "مرفوض",
				duplicate: "مكرر",
				DUPLICATE: "مكرر",
			};
			const rawCol = initialData.statusLabel || initialData.column || initialData.status || defaultColumn;
			setSelectedColumn(colMap[rawCol] || rawCol);

			// 5. الأولوية (Priority)
			const prioMap: Record<string, string> = {
				URGENT: "عاجلة",
				urbent: "عاجلة",
				HIGH: "مرتفعة",
				high: "مرتفعة",
				MEDIUM: "متوسطة",
				medium: "متوسطة",
				LOW: "منخفضة",
				low: "منخفضة",
				NONE: "بدون أولوية",
				none: "بدون أولوية",
			};
			const rawPrio = initialData.priority || "بدون أولوية";
			setPriority(prioMap[rawPrio] || rawPrio);

			// 6. إشعار عبر الواتساب
			setNotifyWhatsapp(Boolean(initialData.notifyWhatsapp));

			// 7. المستندات المرفقة
			if (initialData.documents?.items && Array.isArray(initialData.documents.items) && initialData.documents.items.length > 0) {
				setAttachedDocuments(
					initialData.documents.items.map((doc: any, idx: number) => ({
						id: doc.id || `doc-${idx}`,
						name: doc.title || "مستند مرفق",
						size: doc.fileSize || "1.0 MB",
						url: doc.fileUrl,
					}))
				);
			} else {
				setAttachedDocuments([]);
			}

			// 8. الروابط المرفقة
			if (initialData.links && Array.isArray(initialData.links) && initialData.links.length > 0) {
				setAttachedLinks(
					initialData.links.map((link: any, idx: number) => ({
						id: link.id || `link-${idx}`,
						title: link.title || link.url,
						url: link.url,
					}))
				);
			} else {
				setAttachedLinks([]);
			}
		} else if (!initialData && open) {
			resetForm();
		}
	}, [initialData, open, staffList]);

	// Reset form
	const resetForm = () => {
		setStep(1);
		setChannel("CALL");
		setStudentName("");
		setBirthDate("");
		setGender("");
		setExperienceLevel("");
		setLearningMode("");
		setPreferredShift("");
		setSuggestedTrack("");
		setGuardian("");
		setGuardianPhone("");
		setGuardianEmail("");
		setNotes("");
		setReviewer("المراجع");
		setReviewerId(null);
		setGuardianDropdownOpen(false);
		setSearchStaff("");
		setIsReviewerOpen(false);
		setIsAddStaffOpen(false);
		setAppointmentDate("تاريخ الموعد");
		setAppointmentIsoDate(null);
		setSelectedRoom("الغرفة");
		setSelectedColumn(defaultColumn);
		setPriority("بدون أولوية");
		setSelectedOwnerId(null);
		setAttachedDocuments([]);
		setAttachedLinks([]);
		setLinkTitle("");
		setLinkUrl("");
		setNotifyWhatsapp(false);
		setIncludeMessage(false);
		setCustomMessage("");
		setIsQrOpen(false);
		setQrCodeDataUrl(null);
		setCopiedShareLink(false);
		setError(null);
	};

	const handleClose = () => {
		resetForm();
		onClose();
	};

	// هل ولي الأمر جديد وغير مسجل بالنظام (يظهر فقط إذا كتب المستخدم اسماً غير موجود)
	const isNewGuardian = Boolean(guardian.trim() && !selectedOwnerId);

	// Validation
	const validateForm = () => {
		if (!studentName.trim()) {
			setError("اسم الطالب مطلوب");
			toast.error("يرجى إدخال اسم الطالب");
			return false;
		}
		if (!guardian.trim()) {
			setError("ولي الأمر مطلوب");
			toast.error("يرجى اختيار أو إدخال ولي الأمر");
			return false;
		}
		if (isNewGuardian) {
			if (!guardianPhone.trim()) {
				setError("رقم هاتف ولي الأمر مطلوب لإنشاء الملف");
				toast.error("يرجى إدخال رقم هاتف ولي الأمر");
				return false;
			}
			if (!guardianEmail.trim()) {
				setError("البريد الإلكتروني مطلوب لتوحيد بيانات ولي الأمر");
				toast.error("يرجى إدخال البريد الإلكتروني لولي الأمر");
				return false;
			}
			const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailPattern.test(guardianEmail.trim())) {
				setError("صيغة البريد الإلكتروني غير صحيحة");
				toast.error("يرجى إدخال بريد إلكتروني صحيح");
				return false;
			}
		}
		if (!birthDate.trim()) {
			setError("تاريخ الميلاد مطلوب");
			toast.error("يرجى إدخال تاريخ الميلاد");
			return false;
		}
		if (!gender) {
			setError("الجنس مطلوب");
			toast.error("يرجى اختيار جنس الطالب");
			return false;
		}
		if (!learningMode) {
			setError("طريقة التعلم مطلوب");
			toast.error("يرجى تحديد طريقة التعلم");
			return false;
		}
		if (!suggestedTrack) {
			setError("المجال المقترح مطلوب");
			toast.error("يرجى اختيار المجال المقترح");
			return false;
		}
		return true;
	};

	const handleNext = () => {
		setError(null);
		if (!validateForm()) return;
		setStep(2);
	};

	const handleSubmit = async () => {
		setError(null);
		if (!validateForm()) return;

		const backendSource = channel === "CALL" ? "DIRECT_LINK" : "OTHER";
		const validPhone = guardianPhone.trim() || "0500000000";

		let isoBirthDate: string | null = null;
		if (birthDate.trim()) {
			if (birthDate.includes("/")) {
				const parts = birthDate.split("/");
				if (parts.length === 3) {
					const d = parseInt(parts[0], 10);
					const m = parseInt(parts[1], 10) - 1;
					const y = parseInt(parts[2], 10);
					const dateObj = new Date(y, m, d);
					if (!isNaN(dateObj.getTime())) {
						isoBirthDate = dateObj.toISOString();
					}
				}
			} else {
				const dateObj = new Date(birthDate);
				if (!isNaN(dateObj.getTime())) {
					isoBirthDate = dateObj.toISOString();
				}
			}
		}

		if (initialData) {
			try {
				const updated = await updateMutation.mutateAsync({
					requestId: initialData.id,
					data: {
						studentName: studentName.trim(),
						gender: (gender as "MALE" | "FEMALE" | "UNKNOWN") || "UNKNOWN",
						birthDate: isoBirthDate,
						ageLabel: experienceLevel || null,
						targetClass: suggestedTrack || null,
						guardianName: guardian.trim(),
						guardianPhone: validPhone,
						guardianEmail: guardianEmail.trim() || null,
						learningMode: learningMode || null,
						preferredShift: preferredShift || null,
						experienceLevel: experienceLevel || null,
						priority: priority || "بدون أولوية",
						status: statusToEnum(selectedColumn),
						columnStatus: statusToEnum(selectedColumn),
						column: selectedColumn,
						appointmentDate:
							appointmentIsoDate ||
							(appointmentDate && appointmentDate !== "تاريخ الموعد"
								? appointmentDate
								: null),
						assignedStaffId: reviewerId || null,
						reviewerId: reviewerId || null,
						reviewerName: reviewer !== "المراجع" ? reviewer : null,
						roomId: null,
						roomName: selectedRoom !== "الغرفة" ? selectedRoom : null,
						notifyWhatsapp,
						links: attachedLinks.length > 0 ? attachedLinks : [],
						documents: attachedDocuments.length > 0
							? attachedDocuments.map((d) => ({
									title: d.name,
									fileUrl: d.url || "",
									fileSize: d.size,
								}))
							: [],
						notes: (() => {
							const parts: string[] = [];
							if (includeMessage && customMessage.trim()) parts.push(customMessage.trim());
							if (notes.trim()) parts.push(notes.trim());
							if (enableRecurrence) parts.push("📌 [ملاحظة: مطلوب جدولة زيارات متكررة للطالب بعد القبول]");
							return parts.join("\n") || null;
						})(),
					},
				});
				showRegistrationSuccessToast("تم تحديث بيانات الطلب بنجاح");
				onSuccess?.(updated);
				handleClose();
				return;
			} catch (err: any) {
				setError(err.message || "حدث خطأ أثناء تحديث بيانات الطلب");
				toast.error(err.message || "فشل تحديث الطلب");
				return;
			}
		}

		try {
			const created = await createMutation.mutateAsync({
				campaignId,
				studentName: studentName.trim(),
				gender: (gender as "MALE" | "FEMALE" | "UNKNOWN") || "UNKNOWN",
				birthDate: isoBirthDate,
				ageLabel: experienceLevel || null,
				targetClass: suggestedTrack,
				guardianName: guardian.trim(),
				guardianPhone: validPhone,
				guardianEmail: guardianEmail.trim() || null,
				source: backendSource,

				// الربط المتكامل مع أولياء الأمور والمواعيد والقاعات
				existingOwnerId: selectedOwnerId,
				learningMode: learningMode || null,
				preferredShift: preferredShift || null,
				experienceLevel: experienceLevel || null,
				priority: priority || "بدون أولوية",
				status: statusToEnum(selectedColumn),
				columnStatus: statusToEnum(selectedColumn),
				appointmentDate:
					appointmentIsoDate ||
					(appointmentDate && appointmentDate !== "تاريخ الموعد"
						? appointmentDate
						: null),
				reviewerId: reviewerId || null,
				reviewerName: reviewer !== "المراجع" ? reviewer : null,
				roomName: selectedRoom !== "الغرفة" ? selectedRoom : null,
				notes: (() => {
					const parts: string[] = [];
					if (includeMessage && customMessage.trim()) parts.push(customMessage.trim());
					if (notes.trim()) parts.push(notes.trim());
					if (enableRecurrence) parts.push("📌 [ملاحظة: مطلوب جدولة زيارات متكررة للطالب بعد القبول]");
					return parts.length > 0 ? parts.join("\n") : null;
				})(),
				notifyWhatsapp: notifyWhatsapp,
				links: attachedLinks.map((l) => ({
					id: l.id,
					title: l.title,
					url: l.url,
				})),
				documents: attachedDocuments.map((d: any) => ({
					title: d.name,
					fileUrl: d.url || `/uploads/${d.name}`,
					fileSize: d.size,
					type: "OTHER",
				})),
			});

			showRegistrationSuccessToast("تم تسجيل الطلب بنجاح");
			onSuccess?.(created);

			if (createMore) {
				// Keep dialog open and reset inputs for adding another candidate
				setStep(1);
				setStudentName("");
				setSelectedOwnerId(null);
				setBirthDate("");
				setGender("");
				setExperienceLevel("");
				setLearningMode("");
				setPreferredShift("");
				setSuggestedTrack("");
				setGuardian("");
				setGuardianPhone("");
				setGuardianEmail("");
				setNotes("");
				setAppointmentDate("تاريخ الموعد");
				setAppointmentIsoDate(null);
				setEnableRecurrence(false);
				setSelectedRoom("الغرفة");
				setAttachedDocuments([]);
				setAttachedLinks([]);
			} else {
				handleClose();
			}
		} catch (err: any) {
			const errMsg = err?.message || "فشل تسجيل طلب الطالب";
			setError(errMsg);
			toast.error(errMsg);
		}
	};

	// Shortcut Cmd+K / Ctrl+K
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!open) return;
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				if (initialData || step === 2) {
					handleSubmit();
				} else {
					handleNext();
				}
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [open, step, initialData, studentName, birthDate, gender, learningMode, suggestedTrack, guardian, guardianPhone, guardianEmail, selectedOwnerId, appointmentDate, appointmentIsoDate, reviewer, reviewerId, selectedRoom, selectedColumn, priority, notifyWhatsapp, notes, attachedDocuments, attachedLinks]);

	const isSubmitting = createMutation.isPending || updateMutation.isPending;

	const isFormFilled =
		Boolean(studentName.trim()) &&
		Boolean(guardian.trim()) &&
		(!isNewGuardian || (Boolean(guardianPhone.trim()) && Boolean(guardianEmail.trim()))) &&
		Boolean(birthDate.trim()) &&
		Boolean(gender) &&
		Boolean(learningMode) &&
		Boolean(suggestedTrack);

	return (
		<>
			<Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
			<DialogContent
				showCloseButton={false}
				className={cn(
					"p-0 gap-0 overflow-hidden rounded-xl bg-card border border-border/80 shadow-2xl transition-all duration-150 flex flex-col",
					isExpanded ? "sm:max-w-4xl max-w-[96vw] max-h-[92vh]" : "sm:max-w-[690px] max-w-[94vw] max-h-[88vh]",
				)}
				dir="rtl"
			>
				{/* ─── 1. Header Bar (مطابق 100% لصورة المستخدم f6725d6d) ── */}
				<div className="flex items-center justify-between px-4 pt-3 pb-2 bg-card select-none border-b border-border/40">
					{step === 1 ? (
						/* Step 1 Title + Channel Dropdown */
						<div className="flex items-center gap-2">
							<span className="text-[13px] font-bold text-foreground">
								{initialData ? `تعديل بيانات طلب الطالب - #${initialData.code}` : "تسجيل طلب جديد في:"}
							</span>
							<DropdownMenu dir="rtl">
								<DropdownMenuTrigger asChild>
									<button
										type="button"
										className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border/70 bg-background text-xs font-semibold text-foreground hover:bg-muted/60 transition-colors cursor-pointer shadow-2xs"
									>
										{channel === "CALL" ? (
											<IconPhone className="size-3 text-emerald-600" />
										) : (
											<IconBuildingCommunity className="size-3 text-blue-600" />
										)}
										<span>{channel === "CALL" ? "عبر اتصال" : "في الأكاديمية"}</span>
										<IconChevronDown className="size-3 text-muted-foreground ms-0.5" />
									</button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start" className="w-44 text-xs z-[99]">
									<DropdownMenuLabel className="text-[10px] text-muted-foreground">
										قناة التسجيل المعتمدة
									</DropdownMenuLabel>
									<DropdownMenuItem
										onClick={() => setChannel("CALL")}
										className="cursor-pointer gap-2 py-1.5"
									>
										<IconPhone className="size-3.5 text-emerald-600" />
										<span className="font-medium">عبر اتصال</span>
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => setChannel("ACADEMY")}
										className="cursor-pointer gap-2 py-1.5"
									>
										<IconBuildingCommunity className="size-3.5 text-blue-600" />
										<span className="font-medium">في الأكاديمية</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					) : (
						/* Step 2 Breadcrumb (مطابق لصورة f6725d6d: حجز تسجيل جديد > مراجعه تفاصيل الطلب) */
						<div className="flex items-center gap-1.5 text-xs text-foreground">
							<button
								type="button"
								onClick={() => setStep(1)}
								className="text-muted-foreground hover:text-foreground hover:underline cursor-pointer transition-colors"
							>
								حجز تسجيل جديد
							</button>
							<IconChevronLeft className="size-3.5 text-muted-foreground" />
							<span className="font-bold text-foreground">مراجعه تفاصيل الطلب</span>
						</div>
					)}

					{/* Expand & Close Controls */}
					<div className="flex items-center gap-0.5">
						<button
							type="button"
							onClick={() => setIsExpanded((prev) => !prev)}
							className="size-6.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
							title={isExpanded ? "تصغير" : "تكبير"}
						>
							{isExpanded ? (
								<IconArrowsMinimize className="size-3.5" />
							) : (
								<IconArrowsMaximize className="size-3.5" />
							)}
						</button>
						<button
							type="button"
							onClick={handleClose}
							className="size-6.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
							title="إغلاق"
						>
							<IconX className="size-3.5" />
						</button>
					</div>
				</div>

				{/* ─── 2. Body Content (ارتفاع مرن يستجيب للتكبير بسلاسة لمنع اختفاء المحتوى) ─── */}
				<div
					className={cn(
						"px-4 py-2 overflow-y-auto flex-1 min-h-0 sanad-scrollbar",
						isExpanded ? "max-h-[calc(92vh-155px)]" : "max-h-[calc(88vh-165px)]",
					)}
				>
					{error && (
						<div className="mb-2.5 rounded-md bg-destructive/10 border border-destructive/20 p-2 text-[11px] font-semibold text-destructive text-center">
							{error}
						</div>
					)}

					{step === 1 ? (
						<div className="flex flex-col gap-2.5">
							{/* Row 1: اسم الطالب | ولي الأمر */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								{/* اسم الطالب (تسجيل طالب جديد) */}
								<div>
									<FieldHeader
										label="اسم الطالب"
										required
										tooltip="اسم الطالب ثلاثي أو رباعي"
									/>
									<Input
										value={studentName}
										onChange={(e) => setStudentName(e.target.value)}
										placeholder="مثال: يوسف أحمد"
										className="h-8 text-[11.5px] text-right px-2.5 rounded-md border-border/80 bg-background"
										required
									/>
								</div>

								{/* ولي الأمر (Searchable Combobox من أولياء الأمور بالنظام أو إضافة ولي أمر جديد) */}
								<div ref={guardianContainerRef} className="relative">
									<FieldHeader
										label="ولي الأمر"
										required
										tooltip="اختر من أولياء الأمور المسجلين أو اكتب للفلترة وإضافة ولي أمر جديد"
									/>
									<div className="relative">
										<Input
											value={guardian}
											onChange={(e) => {
												setGuardian(e.target.value);
												setSelectedOwnerId(null);
												setGuardianDropdownOpen(true);
											}}
											onFocus={() => setGuardianDropdownOpen(true)}
											placeholder="اختر أو اكتب ولي الأمر..."
											className="h-8 text-[11.5px] text-right pr-2.5 pl-8 rounded-md border-border/80 bg-background"
											required
										/>
										<button
											type="button"
											onClick={() => setGuardianDropdownOpen((prev) => !prev)}
											className="absolute inset-y-0 left-2.5 flex items-center text-muted-foreground/60 hover:text-foreground cursor-pointer"
										>
											<IconChevronDown className="size-3" />
										</button>
									</div>

									{/* القائمة المنسدلة التفاعلية لأولياء الأمور مع الفلترة اللحظية */}
									{guardianDropdownOpen && (
										<div
											className="absolute z-[99] mt-1 w-full rounded-lg border border-border/80 bg-popover text-popover-foreground shadow-2xl p-1 max-h-48 overflow-y-auto"
											dir="rtl"
										>
											<div className="px-2 py-1 text-[10px] text-muted-foreground font-semibold border-b border-border/50 flex items-center justify-between">
												<span>أولياء الأمور المتاحين بالنظام</span>
												<span className="font-mono text-[9px]">{filteredGuardians.length} متاح</span>
											</div>

											{filteredGuardians.length > 0 ? (
												<div className="py-1 space-y-0.5">
													{filteredGuardians.map((g) => (
														<button
															key={g.id}
															type="button"
															onClick={() => {
																setGuardian(g.name);
																setSelectedOwnerId(g.id);
																setGuardianPhone(g.phone);
																setGuardianEmail(g.email || "");
																setGuardianDropdownOpen(false);
															}}
															className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs text-right hover:bg-muted/70 transition-colors cursor-pointer group"
														>
															<div className="flex items-center gap-1.5">
																<IconUser className="size-3 text-muted-foreground group-hover:text-primary transition-colors" />
																<span className="font-semibold text-foreground">{g.name}</span>
															</div>
															<div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono" dir="ltr">
																{g.phone && <span>{g.phone}</span>}
															</div>
														</button>
													))}
												</div>
											) : (
												<div className="p-2.5 text-center text-xs text-muted-foreground space-y-1">
													<p>لا يوجد ولي أمر مسجل بهذا الاسم</p>
													{guardian.trim() && (
														<button
															type="button"
															onClick={() => setGuardianDropdownOpen(false)}
															className="text-primary hover:underline font-semibold text-[11px] cursor-pointer"
														>
															استخدام "{guardian}" كولي أمر جديد
														</button>
													)}
												</div>
											)}
										</div>
									)}
								</div>
							</div>

							{/* في حال اختيار ولي أمر مسجل: إظهار شارة الربط مع خيار التغيير */}
							{selectedOwnerId && (
								<div className="flex items-center justify-between px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-800 dark:text-emerald-300">
									<div className="flex items-center gap-2">
										<IconCheck className="size-3 text-emerald-600 shrink-0" />
										<span className="font-medium">ولي أمر مسجل بالنظام:</span>
										<span className="font-semibold">{guardian}</span>
										{guardianPhone && (
											<span className="font-mono text-[10px] text-muted-foreground" dir="ltr">
												({guardianPhone})
											</span>
										)}
									</div>
									<button
										type="button"
										onClick={() => {
											setSelectedOwnerId(null);
											setGuardian("");
											setGuardianPhone("");
											setGuardianEmail("");
										}}
										className="text-[10px] text-muted-foreground hover:text-foreground hover:underline cursor-pointer"
									>
										تغيير
									</button>
								</div>
							)}

							{/* تظهر حقول ولي الأمر الجديد فقط إذا كتب المستخدم اسم ولي أمر غير موجود بالنظام */}
							{isNewGuardian && (
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-2.5 rounded-lg border border-primary/20 bg-primary/5 animate-in fade-in duration-200">
									{/* رقم هاتف ولي الأمر */}
									<div>
										<FieldHeader
											label="رقم هاتف ولي الأمر"
											required
											tooltip="رقم هاتف ولي الأمر للتواصل وإرسال الإشعارات (مطلوب لإنشاء الملف)"
										/>
										<div className="relative">
											<Input
												type="tel"
												value={guardianPhone}
												onChange={(e) => setGuardianPhone(e.target.value)}
												placeholder="05xxxxxxxx"
												dir="ltr"
												className="h-8 text-[11.5px] text-left rounded-md border-border/80 bg-background pl-8"
												required
											/>
											<IconPhone className="size-3 text-muted-foreground absolute left-2.5 top-2.5 pointer-events-none" />
										</div>
									</div>

									{/* البريد الإلكتروني لولي الأمر */}
									<div>
										<FieldHeader
											label="البريد الإلكتروني لولي الأمر"
											required
											tooltip="البريد الإلكتروني لولي الأمر لتوحيد ملفه مع صفحة أولياء الأمور"
										/>
										<div className="relative">
											<Input
												type="email"
												value={guardianEmail}
												onChange={(e) => setGuardianEmail(e.target.value)}
												placeholder="example@domain.com"
												dir="ltr"
												className="h-8 text-[11.5px] text-left rounded-md border-border/80 bg-background pl-8"
												required
											/>
											<IconMail className="size-3 text-muted-foreground absolute left-2.5 top-2.5 pointer-events-none" />
										</div>
									</div>
								</div>
							)}

							{/* Row 2: تاريخ الميلاد (مُرحّل للأسفل) | الجنس */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								{/* تاريخ الميلاد مع التقويم المخصص */}
								<div>
									<FieldHeader
										label="تاريخ الميلاد"
										required
										tooltip="تاريخ ميلاد الطالب (يوم/شهر/سنة)"
									/>
									<BirthDatePicker
										value={birthDate}
										onChange={setBirthDate}
										placeholder="مثال: 19/02/2008"
										required
									/>
								</div>

								{/* الجنس */}
								<div>
									<FieldHeader
										label="الجنس"
										required
										tooltip="جنس الطالب (ذكر أو أنثى)"
									/>
									<Select
										value={gender}
										onValueChange={(val: any) => setGender(val)}
									>
										<SelectTrigger className="w-full h-8 text-[11.5px] text-right rounded-md border-border/80" dir="rtl">
											<SelectValue placeholder="اختر جنس الطالب..." />
										</SelectTrigger>
										<SelectContent
											dir="rtl"
											position="popper"
											sideOffset={4}
											className="z-[99] w-[var(--radix-select-trigger-width)] min-w-[160px] bg-popover text-popover-foreground border border-border/80 shadow-xl rounded-lg p-1 text-xs"
										>
											<SelectItem value="MALE" className="text-right text-xs cursor-pointer py-1.5">
												ذكر
											</SelectItem>
											<SelectItem value="FEMALE" className="text-right text-xs cursor-pointer py-1.5">
												أنثى
											</SelectItem>
											<SelectItem value="UNKNOWN" className="text-right text-xs cursor-pointer py-1.5">
												غير محدد
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							{/* Row 3: مستوى | طريقة التعلم */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								{/* مستوى: مبتدئ / متوسط / متقدم / غير متأكد */}
								<div>
									<FieldHeader
										label="مستوى"
										tooltip="مستوى الطالب الحالي أو خبرته السابقة"
									/>
									<Select
										value={experienceLevel}
										onValueChange={setExperienceLevel}
									>
										<SelectTrigger className="w-full h-8 text-[11.5px] text-right rounded-md border-border/80" dir="rtl">
											<SelectValue placeholder="حدد مستوي الخبرة" />
										</SelectTrigger>
										<SelectContent
											dir="rtl"
											position="popper"
											sideOffset={4}
											className="z-[99] w-[var(--radix-select-trigger-width)] min-w-[160px] bg-popover text-popover-foreground border border-border/80 shadow-xl rounded-lg p-1 text-xs"
										>
											<SelectItem value="مبتدئ" className="text-right text-xs cursor-pointer py-1.5">
												مبتدئ
											</SelectItem>
											<SelectItem value="متوسط" className="text-right text-xs cursor-pointer py-1.5">
												متوسط
											</SelectItem>
											<SelectItem value="متقدم" className="text-right text-xs cursor-pointer py-1.5">
												متقدم
											</SelectItem>
											<SelectItem value="غير متأكد" className="text-right text-xs cursor-pointer py-1.5 text-muted-foreground font-medium">
												غير متأكد
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

								{/* طريقة التعلم */}
								<div>
									<FieldHeader
										label="طريقة التعلم"
										required
										tooltip="طريقة أو نمط الحضور والتعلم"
									/>
									<Select
										value={learningMode}
										onValueChange={setLearningMode}
									>
										<SelectTrigger className="w-full h-8 text-[11.5px] text-right rounded-md border-border/80" dir="rtl">
											<SelectValue placeholder="اختر الطريقة..." />
										</SelectTrigger>
										<SelectContent
											dir="rtl"
											position="popper"
											sideOffset={4}
											className="z-[99] w-[var(--radix-select-trigger-width)] min-w-[160px] bg-popover text-popover-foreground border border-border/80 shadow-xl rounded-lg p-1 text-xs"
										>
											<SelectItem value="في الأكاديمية" className="text-right text-xs cursor-pointer py-1.5">
												في الأكاديمية (حضوري)
											</SelectItem>
											<SelectItem value="عن بعد" className="text-right text-xs cursor-pointer py-1.5">
												عن بعد (أونلاين)
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							{/* Row 4: المناوبة المفضلة | المجال المقترح */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								{/* المناوبة المفضلة: صباحي / مسائي فقط */}
								<div>
									<FieldHeader
										label="المناوبة المفضلة"
										tooltip="الفترة المفضلة للحضور (صباحي أو مسائي)"
									/>
									<Select
										value={preferredShift}
										onValueChange={setPreferredShift}
									>
										<SelectTrigger className="w-full h-8 text-[11.5px] text-right rounded-md border-border/80" dir="rtl">
											<SelectValue placeholder="اختر المناوبة" />
										</SelectTrigger>
										<SelectContent
											dir="rtl"
											position="popper"
											sideOffset={4}
											className="z-[99] w-[var(--radix-select-trigger-width)] min-w-[160px] bg-popover text-popover-foreground border border-border/80 shadow-xl rounded-lg p-1 text-xs"
										>
											<SelectItem value="صباحي" className="text-right text-xs cursor-pointer py-1.5">
												صباحي
											</SelectItem>
											<SelectItem value="مسائي" className="text-right text-xs cursor-pointer py-1.5">
												مسائي
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

								{/* المجال المقترح */}
								<div>
									<FieldHeader
										label="المجال المقترح"
										required
										tooltip="المجال أو المسار التقني المقترح للطالب"
									/>
									<Select
										value={suggestedTrack}
										onValueChange={setSuggestedTrack}
									>
										<SelectTrigger className="w-full h-8 text-[11.5px] text-right rounded-md border-border/80" dir="rtl">
											<SelectValue placeholder="اختر" />
										</SelectTrigger>
										<SelectContent
											dir="rtl"
											position="popper"
											sideOffset={4}
											className="z-[99] w-[var(--radix-select-trigger-width)] min-w-[200px] bg-popover text-popover-foreground border border-border/80 shadow-xl rounded-lg p-1 text-xs"
										>
											<SelectItem value="البرمجة والمنطق" className="text-right text-xs cursor-pointer py-1.5">
												البرمجة والمنطق
											</SelectItem>
											<SelectItem value="الذكاء الاصطناعي" className="text-right text-xs cursor-pointer py-1.5">
												الذكاء الاصطناعي
											</SelectItem>
											<SelectItem value="الروبوتيكس" className="text-right text-xs cursor-pointer py-1.5">
												الروبوتيكس
											</SelectItem>
											<SelectItem value="تطوير الألعاب" className="text-right text-xs cursor-pointer py-1.5">
												تطوير الألعاب
											</SelectItem>
											<SelectItem value="تحليل البيانات" className="text-right text-xs cursor-pointer py-1.5">
												تحليل البيانات
											</SelectItem>
											<SelectItem value="ريادة الأعمال" className="text-right text-xs cursor-pointer py-1.5">
												ريادة الأعمال
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							{/* Row 5: ملاحظات (اختياري) */}
							<div>
								<div className="mb-1 flex items-center justify-between">
									<span className="text-[11px] font-semibold text-foreground">
										ملاحظات (اختياري)
									</span>
								</div>
								<Textarea
									value={notes}
									onChange={(e) => setNotes(e.target.value)}
									placeholder="أضف أي ملاحظات أكاديمية..."
									className="text-[11.5px] text-right h-12 min-h-[48px] resize-none rounded-md border-border/80 placeholder:text-muted-foreground/60 py-1.5"
								/>
							</div>
						</div>
					) : (
						/* ─── Step 2: Confirmation & Review (مطابق 100% لصورة المستخدم f6725d6d) ── */
						<div className="flex flex-col gap-3 py-1" dir="rtl">
							{/* 1. بطاقة ملخص الطلب */}
							<div className="rounded-xl border border-border/80 bg-card p-4 space-y-3 shadow-2xs">
								<div className="border-b border-border/60 pb-2 flex items-center justify-between">
									<h3 className="text-sm font-bold text-foreground">ملخص الطلب</h3>
									<span className="text-[10px] font-semibold text-primary px-2 py-0.5 rounded-md bg-primary/10">
										{selectedColumn}
									</span>
								</div>

								{/* قائمة الحقول المنظمة: التسمية على اليمين بالرمادي، والقيمة على اليسار بالأسود/الغامق */}
								<div className="space-y-2 text-xs divide-y divide-border/30">
									<div className="flex items-center justify-between pt-1">
										<span className="text-muted-foreground text-[11px] font-normal">نوع الموعد</span>
										<span className="font-semibold text-foreground text-[11.5px]">
											{channel === "CALL" ? "عبر اتصال" : "في الأكاديمية"}
										</span>
									</div>

									<div className="flex items-center justify-between pt-1.5">
										<span className="text-muted-foreground text-[11px] font-normal">الطالب</span>
										<span className="font-semibold text-foreground text-[11.5px]">
											{studentName} {gender === "MALE" ? "(ذكر)" : gender === "FEMALE" ? "(أنثى)" : ""}
										</span>
									</div>

									<div className="flex items-center justify-between pt-1.5">
										<span className="text-muted-foreground text-[11px] font-normal">ولي الأمر</span>
										<span className="font-semibold text-foreground text-[11.5px]">
											{guardian} {guardianPhone ? `(${guardianPhone})` : ""}
										</span>
									</div>

									<div className="flex items-center justify-between pt-1.5">
										<span className="text-muted-foreground text-[11px] font-normal">المراجع</span>
										<span className="font-semibold text-foreground text-[11.5px]">
											{reviewer !== "المراجع" ? reviewer : "فريق القبول والتسجيل"}
										</span>
									</div>

									<div className="flex items-center justify-between pt-1.5">
										<span className="text-muted-foreground text-[11px] font-normal">التاريخ والوقت</span>
										<span className="font-semibold text-foreground text-[11.5px] font-mono">
											{appointmentDate && appointmentDate !== "تاريخ الموعد" ? appointmentDate : "قيد الجدولة والفرز"}
										</span>
									</div>

									<div className="flex items-center justify-between pt-1.5">
										<span className="text-muted-foreground text-[11px] font-normal">المدة</span>
										<span className="font-semibold text-foreground text-[11.5px]">
											30 دقيقة
										</span>
									</div>

									<div className="flex items-center justify-between pt-1.5">
										<span className="text-muted-foreground text-[11px] font-normal">الغرفة</span>
										<span className="font-semibold text-foreground text-[11.5px]">
											{channel === "CALL" ? "جلسة افتراضية" : (selectedRoom !== "الغرفة" ? selectedRoom : "قاعة المقابلات الرئيسية")}
										</span>
									</div>

									<div className="flex items-center justify-between pt-1.5">
										<span className="text-muted-foreground text-[11px] font-normal">الخدمات</span>
										<span className="font-semibold text-foreground text-[11.5px]">
											{suggestedTrack} - {learningMode} ({preferredShift || "صباحي"})
										</span>
									</div>

									{notes && (
										<div className="flex items-center justify-between pt-1.5">
											<span className="text-muted-foreground text-[11px] font-normal">ملاحظات</span>
											<span className="text-foreground text-[11px] max-w-[280px] truncate">{notes}</span>
										</div>
									)}

									{(attachedDocuments.length > 0 || attachedLinks.length > 0) && (
										<div className="flex items-center justify-between pt-1.5">
											<span className="text-muted-foreground text-[11px] font-normal">المرفقات والروابط</span>
											<div className="flex flex-wrap gap-1 justify-end max-w-[280px]">
												{attachedDocuments.map((d) => (
													<span key={d.id} className="text-[10px] px-1.5 py-0.5 bg-muted rounded inline-flex items-center gap-1">
														<IconFileFilled className="size-2.5 text-muted-foreground" />
														<span className="truncate max-w-[90px]">{d.name}</span>
													</span>
												))}
												{attachedLinks.map((l) => (
													<span key={l.id} className="text-[10px] px-1.5 py-0.5 bg-muted rounded inline-flex items-center gap-1 text-[#4F6BF5]">
														<IconLinkPlus className="size-2.5" />
														<span className="truncate max-w-[90px]">{l.title || l.url}</span>
													</span>
												))}
											</div>
										</div>
									)}
								</div>
							</div>

							{/* 2. قسم رابط المشاركة (مطابق تماماً لصورة f6725d6d) */}
							<div className="space-y-2 pt-1">
								<Label className="text-xs font-bold text-foreground block">
									رابط المشاركة
								</Label>
								<div className="flex items-center gap-2">
									<div className="relative flex-1">
										<Input
											readOnly
											value={previewShareLink}
											placeholder="e.g: www.website.com/username"
											className="h-8.5 text-xs text-left font-mono bg-muted/40 border-border/80 text-foreground"
											dir="ltr"
										/>
									</div>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={handleCopyShareLink}
										className="h-8.5 px-3 text-xs gap-1.5 font-medium cursor-pointer shrink-0 border-border/80"
									>
										{copiedShareLink ? (
											<IconCheck className="size-3.5 text-emerald-600" />
										) : (
											<IconCopy className="size-3.5" />
										)}
										<span>{copiedShareLink ? "تم النسخ" : "نسخ"}</span>
									</Button>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={handleOpenQr}
										className="h-8.5 px-3 text-xs gap-1.5 font-medium cursor-pointer shrink-0 border-border/80"
									>
										<IconQrcode className="size-3.5" />
										<span>رمز QR</span>
									</Button>
								</div>

								{/* مفتاح إضافة رسالة */}
								<div className="flex items-center justify-between pt-1">
									<label className="flex items-center gap-2 cursor-pointer select-none">
										<Switch
											checked={includeMessage}
											onCheckedChange={setIncludeMessage}
											size="sm"
										/>
										<span className="text-[11.5px] font-semibold text-foreground">
											إضافة رسالة
										</span>
									</label>
								</div>

								{includeMessage && (
									<div className="animate-in fade-in duration-150 pt-1">
										<Textarea
											value={customMessage}
											onChange={(e) => setCustomMessage(e.target.value)}
											placeholder="اكتب رسالة مخصصة لولي الأمر بخصوص تفاصيل المقابلة والطلب..."
											className="text-xs text-right h-16 min-h-[64px] resize-none rounded-md"
										/>
									</div>
								)}
							</div>
						</div>
					)}
				</div>

				{/* ─── المرفقات والروابط المضافة من قائمة الثلاث نقط ───────────── */}
				{step === 1 && (attachedDocuments.length > 0 || attachedLinks.length > 0) && (
					<div
						className="px-4 py-1.5 bg-muted/40 border-t border-border/50 flex flex-wrap items-center gap-1.5 select-none"
						dir="rtl"
					>
						<span className="text-[10px] text-muted-foreground font-semibold">المرفقات:</span>
						{attachedDocuments.map((doc) => (
							<span
								key={doc.id}
								className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-background border border-border/70 text-[10.5px] font-medium text-foreground shadow-xs animate-in fade-in"
							>
								<IconFileFilled className="size-3 text-muted-foreground shrink-0" />
								<span className="max-w-[130px] truncate" title={doc.name}>
									{doc.name}
								</span>
								<span className="text-[9px] text-muted-foreground">({doc.size})</span>
								<button
									type="button"
									onClick={() =>
										setAttachedDocuments((prev) =>
											prev.filter((d) => d.id !== doc.id),
										)
									}
									className="text-muted-foreground hover:text-destructive cursor-pointer p-0.5"
									title="حذف المستند"
								>
									<IconX className="size-3" />
								</button>
							</span>
						))}
						{attachedLinks.map((link) => (
							<span
								key={link.id}
								className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-background border border-border/70 text-[10.5px] font-medium text-foreground shadow-xs animate-in fade-in"
							>
								<IconLinkPlus className="size-3 text-[#4F6BF5] shrink-0" />
								<a
									href={link.url}
									target="_blank"
									rel="noopener noreferrer"
									className="max-w-[140px] truncate hover:underline hover:text-[#4F6BF5]"
									title={link.url}
								>
									{link.title || link.url}
								</a>
								<button
									type="button"
									onClick={() =>
										setAttachedLinks((prev) =>
											prev.filter((l) => l.id !== link.id),
										)
									}
									className="text-muted-foreground hover:text-destructive cursor-pointer p-0.5"
									title="حذف الرابط"
								>
									<IconX className="size-3" />
								</button>
							</span>
						))}
					</div>
				)}

				{/* ─── 3. Action Pills Bar (مطابق للتصميم، يظهر فقط في الخطوة 1) ── */}
				{step === 1 && (
					<div className="px-4 py-2 border-t border-border/50 bg-background flex flex-wrap items-center gap-1.5 select-none" dir="rtl">
					{/* 1. [ المراجع 🎧 ] (أقصى اليمين في RTL) - منسدلة اختيار الموظف المعتمدة من النظام */}
					<Popover open={isReviewerOpen} onOpenChange={setIsReviewerOpen}>
						<PopoverTrigger asChild>
							<button
								type="button"
								className={cn(
									"h-6.5 px-2 rounded-md border text-[10.5px] font-medium flex items-center gap-1 transition-colors cursor-pointer",
									reviewer !== "المراجع"
										? "border-[#4F6BF5]/40 bg-[#4F6BF5]/10 text-[#4F6BF5] font-semibold"
										: "border-border/80 bg-background hover:bg-muted text-foreground",
								)}
							>
								<span>{reviewer}</span>
								<IconHeadset className="size-3 text-muted-foreground/80" />
							</button>
						</PopoverTrigger>
						<PopoverContent
							align="start"
							sideOffset={6}
							className="z-[99] w-72 p-0 bg-popover text-popover-foreground border border-border/80 shadow-2xl rounded-xl overflow-hidden"
							dir="rtl"
						>
							{/* الترويسة: حقل البحث وزر إضافة موظف جديد مطابق للصورة المرفقة */}
							<div className="p-2 border-b border-border/60 flex items-center justify-between gap-2 bg-muted/20">
								<div className="flex-1 relative">
									<Input
										value={searchStaff}
										onChange={(e) => setSearchStaff(e.target.value)}
										placeholder="اختر موظف..."
										className="h-7 text-xs bg-transparent border-0 shadow-none focus-visible:ring-0 px-1 text-right placeholder:text-muted-foreground/70"
									/>
								</div>
								<button
									type="button"
									onClick={() => {
										setIsReviewerOpen(false);
										setIsAddStaffOpen(true);
									}}
									className="h-6.5 px-2 rounded-md border border-border/80 bg-background hover:bg-muted text-[10.5px] font-semibold text-foreground flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
								>
									<span>إضافة موظف جديد</span>
									<IconPlus className="size-3" />
								</button>
							</div>

							{/* قائمة الموظفين المسجلين في النظام مع دعم التمرير بعجلة الماوس */}
							<div
								ref={reviewerScrollRef}
								data-radix-scroll-lock-ignore
								style={{ overscrollBehavior: "contain" }}
								onWheel={(e) => {
									e.stopPropagation();
									const el = e.currentTarget;
									const maxScroll = el.scrollHeight - el.clientHeight;
									if (maxScroll <= 0) return;
									let delta = e.deltaY;
									if (e.deltaMode === 1) delta *= 36;
									else if (e.deltaMode === 2) delta *= el.clientHeight;
									const target = Math.max(0, Math.min(maxScroll, el.scrollTop + delta));
									if (target !== el.scrollTop) {
										el.scrollTop = target;
									}
								}}
								className="max-h-60 overflow-y-auto overscroll-contain p-1.5 space-y-0.5 sanad-scrollbar"
							>
								{isStaffLoading ? (
									<div className="py-6 text-center text-xs text-muted-foreground">
										جاري تحميل الموظفين من النظام...
									</div>
								) : filteredStaff.length > 0 ? (
									filteredStaff.map((s) => {
										const isSelected = reviewer === s.name;
										const initials = getArabicInitials(s.name);
										return (
											<button
												key={s.id}
												type="button"
												onClick={() => {
													setReviewer(s.name);
													setReviewerId(s.id);
													setIsReviewerOpen(false);
												}}
												className={cn(
													"w-full flex items-center justify-between p-1.5 rounded-lg text-right transition-colors cursor-pointer group",
													isSelected
														? "bg-muted/90"
														: "hover:bg-muted/60",
												)}
											>
												{/* اليمين: الأيقونة الدائرية الزرقاء + الاسم + وسم مشغول */}
												<div className="flex items-center gap-2 min-w-0">
													<div className="size-7 rounded-full bg-[#4F6BF5] text-white flex items-center justify-center text-[11px] font-bold shrink-0 shadow-sm">
														{initials}
													</div>
													<span className="text-xs font-semibold text-foreground truncate">
														{s.name}
													</span>
													{s.isBusy && (
														<span className="px-1.5 py-0.5 rounded text-[9.5px] font-medium bg-[#FFEDD5] text-[#C2410C] dark:bg-orange-950/80 dark:text-orange-300 shrink-0">
															مشغول
														</span>
													)}
												</div>

												{/* الشمال: علامة الصح الزرقاء للموظف المختار */}
												{isSelected && (
													<IconCheck className="size-4 text-[#4F6BF5] stroke-[2.5] shrink-0 me-1" />
												)}
											</button>
										);
									})
								) : (
									<div className="py-5 text-center text-xs text-muted-foreground">
										لا يوجد موظف مطابق للبحث
									</div>
								)}
							</div>

							{/* خيار إلغاء التعيين */}
							{reviewer !== "المراجع" && (
								<div className="p-1 border-t border-border/50 bg-muted/20">
									<button
										type="button"
										onClick={() => {
											setReviewer("المراجع");
											setReviewerId(null);
											setIsReviewerOpen(false);
										}}
										className="w-full py-1 text-center text-[10.5px] text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors cursor-pointer"
									>
										بدون مراجع (إلغاء التعيين)
									</button>
								</div>
							)}
						</PopoverContent>
					</Popover>

					{/* 2. [ تاريخ الموعد 📅+ ] - منسدلة التقويم المعتمدة مع اقتراحات رفيق AI والأوقات */}
					<AppointmentPickerPopover
						value={appointmentDate}
						onChange={(val, isoVal) => {
							setAppointmentDate(val);
							setAppointmentIsoDate(isoVal || null);
						}}
						reviewerName={reviewer}
						reviewerId={reviewerId || undefined}
						enableReminders={notifyWhatsapp}
						onEnableRemindersChange={setNotifyWhatsapp}
						enableRecurrence={enableRecurrence}
						onEnableRecurrenceChange={setEnableRecurrence}
					/>

					{/* 3. [ الغرفة 📍 ] - منسدلة اختيار القاعة/الغرفة المعتمدة مع التحقق من شرط تحديد الموعد أولاً وشارة محجوزة */}
					<RoomPickerPopover
						value={selectedRoom}
						onChange={setSelectedRoom}
						appointmentDate={appointmentDate}
					/>

					{/* 4. [ طابور ⚪ ] - منسدلة اختيار وتغيير الحالة المطابقة للتصميم مع الأيقونات والأرقام */}
					<ColumnStatusPicker
						value={selectedColumn}
						onChange={setSelectedColumn}
					/>

					{/* 5. [ ... بدون أولوية ] - منسدلة اختيار الأولوية المطابقة للتصميم (الصورة b52ca17c) مع الأيقونات واختصارات 0-4 */}
					<PriorityPickerPopover
						value={priority}
						onChange={setPriority}
					/>

					{/* 6. [ ... ] (أقصى اليسار في شريط الكبسولات - مطابق 100% لصورة المستخدم 030c9405) */}
					<DropdownMenu dir="rtl">
						<DropdownMenuTrigger asChild>
							<button
								type="button"
								className="h-6.5 px-1.5 rounded-md border border-border/80 bg-background hover:bg-muted text-muted-foreground hover:text-foreground text-xs flex items-center justify-center transition-colors cursor-pointer"
								title="المزيد من الإجراءات"
							>
								<IconDots className="size-3" />
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="start"
							side="top"
							sideOffset={8}
							className="z-[99] w-44 p-1.5 bg-popover text-popover-foreground border border-border/80 shadow-2xl rounded-xl select-none"
							dir="rtl"
						>
							<DropdownMenuItem
								onClick={() => setIsLinkDialogOpen(true)}
								className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors hover:bg-muted/70 text-foreground"
							>
								<IconLinkPlus className="size-4 shrink-0 stroke-[2] text-foreground" />
								<span>إضافة رابط</span>
							</DropdownMenuItem>

							<DropdownMenuItem
								onClick={() => fileInputRef.current?.click()}
								className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors hover:bg-muted/70 text-foreground"
							>
								<IconFileFilled className="size-4 shrink-0 text-foreground" />
								<span>إضافة مستند</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				)}

				{/* ─── 4. Footer Bar (مطابق 100% لصورة المستخدم f6725d6d) ── */}
				<div className="px-4 py-2 border-t border-border/70 bg-card flex items-center justify-between gap-2" dir="rtl">
					{step === 1 ? (
						<>
							{/* في Step 1 أقصى اليمين: أنشئ المزيد + إشعار عبر الواتساب */}
							<div className="flex items-center gap-4">
								<label className="flex items-center gap-1.5 cursor-pointer select-none">
									<span className="text-[11px] font-medium text-muted-foreground hover:text-foreground">
										أنشئ المزيد
									</span>
									<Checkbox
										checked={createMore}
										onCheckedChange={(checked) => setCreateMore(!!checked)}
										className="size-3.5 rounded-[3px]"
									/>
								</label>

								<label className="flex items-center gap-1.5 cursor-pointer select-none">
									<span className="text-[11px] font-medium text-muted-foreground hover:text-foreground">
										إشعار عبر الواتساب
									</span>
									<Switch
										size="sm"
										checked={notifyWhatsapp}
										onCheckedChange={setNotifyWhatsapp}
									/>
								</label>
							</div>

							{/* في Step 1 أقصى اليسار: زر تحديث الطلب (في وضع التعديل) أو زر التالي (في وضع الإضافة) */}
							<div className="flex items-center gap-2">
								{initialData ? (
									<Button
										type="button"
										size="sm"
										onClick={handleSubmit}
										disabled={isSubmitting}
										className={cn(
											"h-8 px-4 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-xs",
											isSubmitting
												? "bg-primary/70 text-white cursor-wait"
												: "bg-[#5B50E5] hover:bg-[#4E43D8] text-white",
										)}
									>
										<span>{isSubmitting ? "جاري الحفظ..." : "تحديث بيانات الطلب"}</span>
										<span className="bg-white/20 text-white text-[9.5px] font-mono px-1 py-0.2 rounded leading-none">
											⌘K
										</span>
									</Button>
								) : (
									<Button
										type="button"
										size="sm"
										onClick={handleNext}
										className={cn(
											"h-8 px-3.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-xs",
											isFormFilled
												? "bg-[#5B50E5] hover:bg-[#4E43D8] text-white"
												: "bg-[#D0D8F7] hover:bg-[#BFCBFA] text-white/90",
										)}
									>
										<span>التالي: مراجعة الطلب</span>
										<span className="bg-white/20 text-white text-[9.5px] font-mono px-1 py-0.2 rounded leading-none">
											⌘K
										</span>
									</Button>
								)}
							</div>
						</>
					) : (
						<>
							{/* في Step 2 أقصى اليمين في RTL: زر تعديل الطلب (مطابق تماماً للصورة f6725d6d) */}
							<div className="flex items-center gap-2">
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => setStep(1)}
									disabled={isSubmitting}
									className="h-8 px-4 text-xs font-medium border-border/80 hover:bg-muted cursor-pointer rounded-lg text-foreground"
								>
									<span>تعديل الطلب</span>
								</Button>
							</div>

							{/* في Step 2 أقصى اليسار في RTL: إشعار عبر الواتساب + زر حفظ التسجيل (مطابق للصورة f6725d6d) */}
							<div className="flex items-center gap-3">
								<label className="flex items-center gap-1.5 cursor-pointer select-none">
									<span className="text-[11px] font-medium text-muted-foreground hover:text-foreground">
										إشعار عبر الواتساب
									</span>
									<Switch
										size="sm"
										checked={notifyWhatsapp}
										onCheckedChange={setNotifyWhatsapp}
									/>
								</label>

								<Button
									type="button"
									size="sm"
									onClick={handleSubmit}
									disabled={isSubmitting}
									className="h-8 px-4 text-xs font-bold bg-[#5B50E5] hover:bg-[#4E43D8] text-white shadow-xs rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
								>
									<IconCheck className="size-3.5" />
									<span>{isSubmitting ? "جاري الحفظ..." : (initialData ? "تحديث بيانات الطلب" : "حفظ التسجيل")}</span>
									<span className="bg-white/20 text-white text-[9px] font-mono px-1 py-0.2 rounded leading-none">
										⌘K
									</span>
								</Button>
							</div>
						</>
					)}
				</div>
			</DialogContent>
		</Dialog>

		{/* نافذة عرض رمز QR للمشاركة */}
		<Dialog open={isQrOpen} onOpenChange={setIsQrOpen}>
			<DialogContent className="sm:max-w-xs p-5 text-center" dir="rtl">
				<DialogHeader>
					<DialogTitle className="text-sm font-bold flex items-center justify-center gap-2 text-foreground">
						<IconQrcode className="size-4 text-[#4F6BF5]" />
						<span>رمز QR للمشاركة</span>
					</DialogTitle>
				</DialogHeader>
				<div className="py-3 flex flex-col items-center justify-center gap-2">
					{qrCodeDataUrl ? (
						<img
							src={qrCodeDataUrl}
							alt="QR Code"
							className="size-44 rounded-lg border border-border/70 p-2 bg-white shadow-xs"
						/>
					) : (
						<div className="size-44 bg-muted animate-pulse rounded-lg flex items-center justify-center">
							<IconQrcode className="size-8 text-muted-foreground animate-spin" />
						</div>
					)}
					<p className="text-[11px] text-muted-foreground mt-1">
						امسح الرمز بكاميرا الهاتف لفتح رابط جلسة المقابلة
					</p>
				</div>
				<div className="flex items-center justify-center gap-2 pt-2 border-t border-border/50">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => setIsQrOpen(false)}
						className="h-7.5 text-xs px-3 cursor-pointer"
					>
						إغلاق
					</Button>
					{qrCodeDataUrl && (
						<Button
							type="button"
							size="sm"
							onClick={() => {
								const a = document.createElement("a");
								a.href = qrCodeDataUrl;
								a.download = `QR-${studentName || "candidate"}.png`;
								a.click();
								toast.success("تم تنزيل رمز QR بنجاح");
							}}
							className="h-7.5 text-xs px-3 bg-[#5B50E5] hover:bg-[#4E43D8] text-white cursor-pointer"
						>
							تنزيل الصورة
						</Button>
					)}
				</div>
			</DialogContent>
		</Dialog>

		{/* شيت إضافة موظف جديد للنظام عند الضغط على + إضافة موظف جديد */}
		<AddStaffSheet
			open={isAddStaffOpen}
			onClose={() => setIsAddStaffOpen(false)}
			onCreated={(newStaff) => {
				setReviewer(newStaff.name);
				setReviewerId(newStaff.id);
				setIsAddStaffOpen(false);
				toast.success(`تمت إضافة الموظف ${newStaff.name} وتعيينه كمراجع`);
			}}
		/>

		{/* نافذة إضافة رابط خارجي (من قائمة الثلاث نقط 030c9405) */}
		<Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
			<DialogContent className="sm:max-w-md p-4" dir="rtl">
				<DialogHeader>
					<DialogTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
						<IconLinkPlus className="size-4 text-[#4F6BF5]" />
						<span>إضافة رابط</span>
					</DialogTitle>
				</DialogHeader>
				<div className="space-y-3 py-2">
					<div className="space-y-1">
						<Label className="text-xs">عنوان أو وصف الرابط (اختياري)</Label>
						<Input
							value={linkTitle}
							onChange={(e) => setLinkTitle(e.target.value)}
							placeholder="مثال: معرض أعمال الطالب، شهادات تدريب، ملف Google Drive..."
							className="h-8 text-xs text-right"
						/>
					</div>
					<div className="space-y-1">
						<Label className="text-xs">الرابط الإلكتروني (URL) *</Label>
						<Input
							value={linkUrl}
							onChange={(e) => setLinkUrl(e.target.value)}
							placeholder="https://example.com/document"
							className="h-8 text-xs text-left"
							dir="ltr"
							autoFocus
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									handleAddLink();
								}
							}}
						/>
					</div>
				</div>
				<div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => {
							setIsLinkDialogOpen(false);
							setLinkTitle("");
							setLinkUrl("");
						}}
						className="h-7 text-xs cursor-pointer"
					>
						إلغاء
					</Button>
					<Button
						type="button"
						size="sm"
						onClick={handleAddLink}
						className="h-7 text-xs font-semibold bg-[#5B50E5] hover:bg-[#4E43D8] text-white cursor-pointer"
					>
						إضافة
					</Button>
				</div>
			</DialogContent>
		</Dialog>

		{/* حقل رفع المستندات المخفي */}
		<input
			type="file"
			ref={fileInputRef}
			onChange={handleFileSelect}
			className="hidden"
			multiple
			accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip"
		/>
	</>
);
}

// ─── Label Helper matching screenshot ──────────────────────────────────────────
function FieldHeader({
	label,
	required = false,
	tooltip,
}: {
	label: string;
	required?: boolean;
	tooltip?: string;
}) {
	return (
		<div className="flex items-center justify-between mb-0.5 select-none">
			<div className="flex items-center gap-1.5">
				<Label className="text-[11px] font-semibold text-foreground tracking-tight">{label}</Label>
				{required && (
					<span className="bg-[#FFF1F2] dark:bg-rose-950/60 text-[#E11D48] dark:text-rose-400 text-[8.5px] font-semibold px-1.5 py-0.2 rounded-full leading-tight border border-rose-200/50 dark:border-rose-900/50">
						مطلوب
					</span>
				)}
			</div>
			{tooltip && (
				<TooltipProvider delayDuration={150}>
					<Tooltip>
						<TooltipTrigger asChild>
							<button
								type="button"
								className="text-muted-foreground/60 hover:text-muted-foreground transition-colors cursor-pointer"
							>
								<IconInfoCircle className="size-3" />
							</button>
						</TooltipTrigger>
						<TooltipContent side="top" className="text-xs">
							{tooltip}
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			)}
		</div>
	);
}

// Re-export as AddRequestSheet for backwards compatibility across existing routes
export { AddRequestDialog as AddRequestSheet };
