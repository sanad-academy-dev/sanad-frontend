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
	IconCheck,
	IconChevronDown,
	IconChevronLeft,
	IconCircleCheckFilled,
	IconClock,
	IconDots,
	IconHeadset,
	IconInfoCircle,
	IconPhone,
	IconMail,
	IconPlus,
	IconUser,
	IconX,
	IconLinkPlus,
	IconFileFilled,
} from "@tabler/icons-react";
import { BirthDatePicker } from "./birth-date-picker";
import { PriorityPickerPopover } from "./priority-picker-popover";
import { REGISTRATION_TRACKS } from "../utils/registration-tracks";
import { useCreateRequest, useRegistrationReviewers, useScheduleAssessmentAppointment, useUpdateRequest } from "../hooks/use-digital-registration";
import type { CampaignRequestItem } from "../types/campaign-request.types";
import { backendFetch } from "@/lib/backend-fetch";
import { useOwners } from "@/features/services/patients/hooks/use-owners";
import { AddStaffSheet } from "@/features/services/staff/components/add-staff-sheet";

interface AddRequestDialogProps {
	open: boolean;
	onClose: () => void;
	campaignId: string;
	defaultColumn?: string;
	initialData?: CampaignRequestItem | null;
	onSuccess?: (result: any) => void;
}

// استخراج الحروف الأولى للاسم العربي للأيقونة الدائرية
function getArabicInitials(name: string): string {
	if (!name) return "م";
	const clean = name.trim().replace(/^(د\.|أ\.د\.|أستاذ|دكتور|مهندس|أ\.)\s+/, "");
	const parts = clean.split(/\s+/).filter(Boolean);
	if (parts.length === 0) return "م";
	if (parts.length === 1) return parts[0].slice(0, 2);
	return (parts[0][0] || "") + (parts[1][0] || "");
}

function parseStrictBirthDate(value: string): Date | null {
	const match = value.trim().match(/^(?:(\d{4})-(\d{2})-(\d{2})|(\d{2})\/(\d{2})\/(\d{4}))$/);
	if (!match) return null;
	const year = Number(match[1] || match[6]);
	const month = Number(match[2] || match[5]);
	const day = Number(match[3] || match[4]);
	const date = new Date(Date.UTC(year, month - 1, day));
	if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
		return null;
	}
	const today = new Date();
	const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
	return date.getTime() <= todayUtc ? date : null;
}

// تحويل مسميات الحالات السبع للأكواد المعتمدة في قاعدة البيانات
function statusToEnum(
	s?: string,
): "QUEUE" | "SHORTLIST" | "WAITLIST" | "INTERVIEW" | "ACCEPTED" | "AWAITING_PAYMENT" | "REJECTED" | "DUPLICATE" {
	if (!s) return "QUEUE";
	switch (s) {
		case "shortlist":
		case "SHORTLIST":
		case "القائمة المختصرة":
		case "قائمة مختصرة":
			return "SHORTLIST";
		case "waitlist":
		case "WAITLIST":
		case "قائمة الانتظار":
			return "WAITLIST";
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
 * دالة إشعار حفظ التسجيل بنجاح الموحدة.
 * تظهر أسفل الشاشة على اليسار وتستخدم تلقائيًا نظام التوست الموحد مع زر الإغلاق (X) والأيقونة المعتمدة دون تكرار للكود.
 */
export function showRegistrationSuccessToast(message = "تم تسجيل الطلب بنجاح") {
	return toast.success(message, {
		duration: 15000,
	});
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

	// ─── Interview mode (عبر اتصال أو في الأكاديمية، مستقل عن مصدر التسجيل) ───
	const [channel, setChannel] = useState<"CALL" | "ACADEMY" | "">("");

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
		return [];
	}, [owners]);

	const filteredGuardians = useMemo(() => {
		if (!guardian.trim()) return allGuardians;
		const q = guardian.trim().toLowerCase();
		return allGuardians.filter(
			(g) =>
				g.name.toLowerCase().includes(q) ||
				g.phone.includes(q) ||
				Boolean(g.email?.toLowerCase().includes(q)),
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
	const [reviewerStaffId, setReviewerStaffId] = useState<string | null>(null);
	const [isReviewerOpen, setIsReviewerOpen] = useState(false);
	const [searchStaff, setSearchStaff] = useState("");
	const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);

	const { data: systemStaff = [], isLoading: isStaffLoading } = useRegistrationReviewers();

	// تأتي القائمة من الباك بعد التحقق: مدير النظام المؤهل مؤقتاً أو عضو فريق التسجيل
	// بصلاحية can_edit، وفي الحالتين يلزم سجل Staff نشط قابل للحجز.
	const staffList = useMemo(() => {
		if (systemStaff.length > 0) {
			return systemStaff.map((s) => ({
				id: s.id,
				userId: s.userId,
				staffId: s.staffId,
				name: s.name,
				isBusy: false,
			}));
		}
		return [];
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
	const [selectedRoom, setSelectedRoom] = useState("الغرفة");
	const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
	const [selectedRoomBranchId, setSelectedRoomBranchId] = useState<string | null>(null);
	const [selectedColumn, setSelectedColumn] = useState(defaultColumn);
	const [priority, setPriority] = useState<string>("بدون أولوية");

	// ─── Attachments (المستندات والروابط المرفقة من قائمة الثلاث نقط - الصورة 030c9405) ──
	const [attachedDocuments, setAttachedDocuments] = useState<
		Array<{ id: string; name: string; size: string; url?: string; key?: string; type?: string }>
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
		let uploaded = 0;

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
					if (!uploadData.key) throw new Error("لم يُرجع الخادم رابط المستند");
					const fileUrl = uploadData.key.startsWith("/") || uploadData.key.startsWith("http")
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
							type: "OTHER",
						},
					]);
					uploaded += 1;
				} else {
					throw new Error((await res.json().catch(() => null))?.message || "فشل رفع المستند");
				}
			} catch (error) {
				toast.error(`تعذر رفع ${file.name}: ${error instanceof Error ? error.message : "خطأ غير متوقع"}`);
			}
		}

		if (uploaded > 0) {
			toast.success(uploaded > 1 ? `تم رفع ${uploaded} مستندات بنجاح` : `تم رفع المستند: ${files[0].name}`);
		}

		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	// ─── Footer Controls (Matching Screenshot: أنشئ المزيد + إشعار عبر الواتساب) ──
	const [createMore, setCreateMore] = useState(false);
	const [notifyWhatsapp, setNotifyWhatsapp] = useState(false);

	const [error, setError] = useState<string | null>(null);

	const createMutation = useCreateRequest(campaignId);
	const updateMutation = useUpdateRequest(campaignId);
	const scheduleMutation = useScheduleAssessmentAppointment(campaignId);

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
			setSuggestedTrack(initialData.proposedTrack || "");
			setGuardian(initialData.guardianName || "");
			setGuardianPhone(initialData.guardianPhone || "");
			setGuardianEmail(initialData.guardianEmail || "");
			setSelectedOwnerId(initialData.convertedOwnerId || null);
			setNotes(initialData.notes || "");
			setChannel(initialData.interviewMode === "REMOTE" ? "CALL" : "ACADEMY");

			// 1. المراجع (Reviewer)
			let rName = initialData.assignedStaff?.name || (initialData as any).reviewerName || initialData.assessmentAppointment?.staffName || "";
			let rId = initialData.assignedStaff?.id || initialData.assignedStaffId || (initialData as any).reviewerId || null;
			if (!rName && rId && staffList && staffList.length > 0) {
				const match = staffList.find((s) => s.id === rId || (s as any).userId === rId);
				if (match) rName = match.name;
			}
			setReviewer(rName || "المراجع");
			setReviewerId(rId);
			const reviewerMatch = rId
				? staffList.find((staff) => staff.userId === rId || staff.id === rId)
				: undefined;
			setReviewerStaffId(initialData.assessmentAppointment?.staffId || reviewerMatch?.staffId || null);

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
			const rRoom = initialData.roomName || "الغرفة";
			setSelectedRoom(rRoom);
			setSelectedRoomId((initialData as any).roomId || null);
			setSelectedRoomBranchId(null);

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
						key: doc.storageKey || doc.fileUrl,
						type: doc.type || "OTHER",
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
		setChannel("");
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
		setReviewerStaffId(null);
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
		if (!channel) {
			setError("نوع المقابلة مطلوب");
			toast.error("يرجى اختيار نوع المقابلة (في الأكاديمية أو عبر اتصال)");
			return false;
		}
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
		if (!guardianPhone.trim()) {
			setError("رقم هاتف ولي الأمر مطلوب");
			toast.error("يرجى إدخال رقم هاتف ولي الأمر");
			return false;
		}
		if (isNewGuardian) {
			const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (guardianEmail.trim() && !emailPattern.test(guardianEmail.trim())) {
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
		if (!parseStrictBirthDate(birthDate)) {
			setError("تاريخ الميلاد غير صالح");
			toast.error("يرجى إدخال تاريخ ميلاد صحيح");
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

		// التسجيل اليدوي من لوحة الموظفين مصدره OTHER دائماً؛ نوع المقابلة يُحفظ
		// في حقل مستقل حتى لا يختلط مصدر وصول الطلب بطريقة إجراء المقابلة لاحقاً.
		const backendSource = "OTHER" as const;
		const interviewMode = channel === "CALL" ? "REMOTE" : "IN_CLINIC";
		if (appointmentIsoDate && interviewMode === "IN_CLINIC" && !selectedRoomId) {
			setError("يجب اختيار الغرفة قبل جدولة المقابلة الحضورية");
			toast.error("اختر الغرفة قبل حفظ موعد المقابلة في الأكاديمية");
			return;
		}
		const roomForInterview = interviewMode === "IN_CLINIC"
			? {
				roomId: selectedRoomId,
				roomName: selectedRoom !== "الغرفة" ? selectedRoom : null,
			}
			: { roomId: null, roomName: null };
		const validPhone = guardianPhone.trim();
		const reviewerAssignment = reviewerStaffId
			? {
					assignedStaffId: reviewerId,
					reviewerId,
					reviewerName: reviewer !== "المراجع" ? reviewer : null,
				}
			: reviewerId === null
				? { assignedStaffId: null, reviewerId: null, reviewerName: null }
				: {};

		const parsedBirthDate = parseStrictBirthDate(birthDate);
		if (!parsedBirthDate) return;
		const isoBirthDate = parsedBirthDate.toISOString();

		if (initialData) {
			try {
				const updated = await updateMutation.mutateAsync({
					requestId: initialData.id,
					data: {
						studentName: studentName.trim(),
						gender: (gender as "MALE" | "FEMALE" | "UNKNOWN") || "UNKNOWN",
						birthDate: isoBirthDate,
						ageLabel: experienceLevel || null,
						proposedTrack: suggestedTrack || null,
						guardianName: guardian.trim(),
						guardianPhone: validPhone,
						guardianEmail: guardianEmail.trim() || null,
						learningMode: learningMode || null,
						preferredShift: preferredShift || null,
						experienceLevel: experienceLevel || null,
						priority: priority || "بدون أولوية",
						// الموعد والمراجع والغرفة ونوع المقابلة تعدّل من «إعادة الجدولة»
						// فقط؛ لا نحدّث نسخة الطلب من دون تحديث Appointment الفعلي.
						notifyWhatsapp,
						links: attachedLinks.length > 0 ? attachedLinks : [],
						documents: attachedDocuments.length > 0
							? attachedDocuments.map((d) => ({
									id: d.id,
									title: d.name,
									fileUrl: d.key || d.url || "",
									fileSize: d.size,
									type: d.type || "OTHER",
								}))
							: [],
						notes: (() => {
							const parts: string[] = [];
							if (notes.trim()) parts.push(notes.trim());
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
				proposedTrack: suggestedTrack || null,
				guardianName: guardian.trim(),
				guardianPhone: validPhone,
				guardianEmail: guardianEmail.trim() || null,
				source: backendSource,
				interviewMode,

				// الربط المتكامل مع أولياء الأمور والمواعيد والقاعات
				existingOwnerId: selectedOwnerId,
				learningMode: learningMode || null,
				preferredShift: preferredShift || null,
				experienceLevel: experienceLevel || null,
				priority: priority || "بدون أولوية",
				// لا نسجل الطلب كأنه دخل المقابلة قبل نجاح الحجز الفعلي.
				initialStatus: (appointmentIsoDate ? "QUEUE" : statusToEnum(selectedColumn)) as "QUEUE" | "SHORTLIST" | "WAITLIST" | "INTERVIEW" | "AWAITING_PAYMENT" | "DUPLICATE",
				...reviewerAssignment,
				...roomForInterview,
				notes: (() => {
					const parts: string[] = [];
					if (notes.trim()) parts.push(notes.trim());
					return parts.length > 0 ? parts.join("\n") : null;
				})(),
				notifyWhatsapp: notifyWhatsapp,
				links: attachedLinks.map((l) => ({
					id: l.id,
					title: l.title,
					url: l.url,
				})),
				documents: attachedDocuments.map((d: any) => ({
					id: d.id,
					title: d.name,
					fileUrl: d.key || d.url || "",
					fileSize: d.size,
					type: d.type || "OTHER",
				})),
			});

			showRegistrationSuccessToast("تم تسجيل الطلب بنجاح");
			if (appointmentIsoDate) {
				try {
					await scheduleMutation.mutateAsync({
						requestId: created.id,
						data: {
							staffId: reviewerStaffId || undefined,
							startsAt: appointmentIsoDate,
							roomId: roomForInterview.roomId || undefined,
							branchId: interviewMode === "IN_CLINIC" ? selectedRoomBranchId || undefined : undefined,
						},
					});
					toast.success(
						interviewMode === "REMOTE"
							? "تمت جدولة المقابلة عن بُعد بنجاح"
							: "تمت جدولة موعد التقييم والغرفة المطلوبة بنجاح",
					);
				} catch (scheduleError: any) {
					toast.error(`تم إنشاء الطلب لكن تعذر جدولة المقابلة: ${scheduleError?.message || "خطأ غير متوقع"}`);
				}
			}
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
	}, [open, step, initialData, studentName, birthDate, gender, learningMode, suggestedTrack, guardian, guardianPhone, guardianEmail, selectedOwnerId, appointmentDate, appointmentIsoDate, reviewer, reviewerId, reviewerStaffId, selectedRoom, selectedRoomId, selectedRoomBranchId, selectedColumn, priority, notifyWhatsapp, notes, attachedDocuments, attachedLinks]);

	const isSubmitting = createMutation.isPending || updateMutation.isPending;

	const isFormFilled =
		Boolean(channel) &&
		Boolean(studentName.trim()) &&
		Boolean(guardian.trim()) &&
		(!isNewGuardian || (Boolean(guardianPhone.trim()) && Boolean(guardianEmail.trim()))) &&
		Boolean(parseStrictBirthDate(birthDate)) &&
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
							<span className="text-[13px] font-bold text-foreground flex items-center gap-1">
								{initialData ? `تعديل بيانات طلب الطالب - #${initialData.code}` : "تسجيل طلب جديد — المقابلة:"}
								{!initialData && <span className="text-destructive font-bold text-sm leading-none">*</span>}
							</span>
							<DropdownMenu dir="rtl">
								<DropdownMenuTrigger asChild>
									<button
										type="button"
										disabled={Boolean(initialData)}
										title={initialData ? "يُغيَّر نوع المقابلة من إجراء إعادة الجدولة" : "نوع المقابلة"}
										className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border/80 bg-background hover:bg-muted/60 text-foreground text-xs font-medium transition-all cursor-pointer shadow-2xs disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-background"
									>
										{channel === "CALL" ? (
											<IconPhone className="size-3 text-emerald-600 shrink-0" />
										) : channel === "ACADEMY" ? (
											<IconBuildingCommunity className="size-3 text-blue-600 shrink-0" />
										) : null}
										<span className={cn(!channel ? "text-muted-foreground" : "text-foreground font-semibold")}>
											{channel === "CALL" ? "عبر اتصال" : channel === "ACADEMY" ? "في الأكاديمية" : "اختر نوع المقابلة"}
										</span>
										<IconChevronDown className="size-3 text-muted-foreground ms-0.5 shrink-0" />
									</button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start" className="w-52 text-xs z-[99]">
									<DropdownMenuLabel className="text-[10px] text-muted-foreground">
										نوع المقابلة (مطلوب)
									</DropdownMenuLabel>
									<DropdownMenuItem
										onClick={() => {
											setChannel("ACADEMY");
											setError(null);
										}}
										className={cn(
											"cursor-pointer gap-2 py-2 text-xs justify-between",
											channel === "ACADEMY" && "bg-muted font-bold text-blue-600 dark:text-blue-400"
										)}
									>
										<div className="flex items-center gap-2">
											<IconBuildingCommunity className="size-3.5 text-blue-600 shrink-0" />
											<div className="flex flex-col text-right">
												<span className="font-semibold">في الأكاديمية</span>
												<span className="text-[10px] text-muted-foreground font-normal">مقابلة حضورية في المركز</span>
											</div>
										</div>
										{channel === "ACADEMY" && <IconCheck className="size-3 text-blue-600" />}
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => {
											setChannel("CALL");
											setError(null);
										}}
										className={cn(
											"cursor-pointer gap-2 py-2 text-xs justify-between",
											channel === "CALL" && "bg-muted font-bold text-emerald-600 dark:text-emerald-400"
										)}
									>
										<div className="flex items-center gap-2">
											<IconPhone className="size-3.5 text-emerald-600 shrink-0" />
											<div className="flex flex-col text-right">
												<span className="font-semibold">عبر اتصال</span>
												<span className="text-[10px] text-muted-foreground font-normal">مقابلة هاتفية / أونلاين</span>
											</div>
										</div>
										{channel === "CALL" && <IconCheck className="size-3 text-emerald-600" />}
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
							disabled={Boolean(initialData)}
							title={
								initialData
									? "يُعدّل المراجع من إجراء إعادة الجدولة"
									: isExpanded
										? "تصغير"
										: "تكبير"
							}
							onClick={() => setIsExpanded((prev) => !prev)}
							className="size-6.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
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
						"px-4 py-2 overflow-y-auto flex-1 min-h-0 scrollbar-thin",
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
										className="h-9 text-[12px] leading-5 text-right px-2.5 rounded-md border-border/80 bg-background"
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
											className="h-9 text-[12px] leading-5 text-right pr-2.5 pl-8 rounded-md border-border/80 bg-background"
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
												className="h-9 text-[12px] leading-5 text-left rounded-md border-border/80 bg-background pl-8"
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
												className="h-9 text-[12px] leading-5 text-left rounded-md border-border/80 bg-background pl-8"
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
										className="text-[12px] leading-5"
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
										<SelectTrigger className="w-full h-9! min-h-9! text-[12px] leading-5 text-right rounded-md border-border/80" dir="rtl">
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
										<SelectTrigger className="w-full h-9! min-h-9! text-[12px] leading-5 text-right rounded-md border-border/80" dir="rtl">
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
										<SelectTrigger className="w-full h-9! min-h-9! text-[12px] leading-5 text-right rounded-md border-border/80" dir="rtl">
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

							{/* Row 4: المناوبة المفضلة والمسار المقترح. */}
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
										<SelectTrigger className="w-full h-9! min-h-9! text-[12px] leading-5 text-right rounded-md border-border/80" dir="rtl">
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
										<SelectTrigger className="w-full h-9! min-h-9! text-[12px] leading-5 text-right rounded-md border-border/80" dir="rtl">
											<SelectValue placeholder="اختر" />
										</SelectTrigger>
										<SelectContent
											dir="rtl"
											position="popper"
											sideOffset={4}
											className="z-[99] w-[var(--radix-select-trigger-width)] min-w-[200px] bg-popover text-popover-foreground border border-border/80 shadow-xl rounded-lg p-1 text-xs"
										>
											{REGISTRATION_TRACKS.map((track) => (
												<SelectItem key={track} value={track} className="text-right text-xs cursor-pointer py-1.5">{track}</SelectItem>
											))}
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
									className="h-12 min-h-[48px] resize-none rounded-md border-border/80 py-1.5 text-[12px] leading-5 text-right placeholder:text-muted-foreground/60"
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
										<span className="text-muted-foreground text-[11px] font-normal">الأولوية</span>
										<span className="font-semibold text-foreground text-[11.5px]">
											{priority || "بدون أولوية"}
										</span>
									</div>

									<div className="flex items-center justify-between pt-1.5">
										<span className="text-muted-foreground text-[11px] font-normal">المرحلة الحالية</span>
										<span className="font-semibold text-blue-600 dark:text-blue-400 text-[11.5px]">
											{initialData ? (selectedColumn || "طابور") : "طابور (الموعد والقاعة يُحددان في مرحلة المقابلة)"}
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
								<Select
									value={doc.type || "OTHER"}
									onValueChange={(type) => setAttachedDocuments((prev) => prev.map((item) => item.id === doc.id ? { ...item, type } : item))}
								>
									<SelectTrigger className="h-5 w-24 text-[9px] px-1"><SelectValue /></SelectTrigger>
									<SelectContent>
										<SelectItem value="BIRTH_CERTIFICATE">شهادة ميلاد</SelectItem>
										<SelectItem value="VACCINATION_CARD">تطعيمات</SelectItem>
										<SelectItem value="GUARDIAN_ID">هوية ولي الأمر</SelectItem>
										<SelectItem value="MEDICAL_REPORT">تقرير طبي</SelectItem>
										<SelectItem value="OTHER">مستند آخر</SelectItem>
									</SelectContent>
								</Select>
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
								className="max-h-60 overflow-y-auto overscroll-contain p-1.5 space-y-0.5 scrollbar-thin"
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
								if (!s.userId) {
									toast.error("لا يوجد حساب مستخدم مرتبط بهذا الموظف لتعيينه كمراجع");
									return;
								}
													setReviewer(s.name);
								setReviewerId(s.userId);
								setReviewerStaffId(s.staffId);
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
									setReviewerStaffId(null);
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

					{/* شارة مرحلة الطابور (Badge ثابت بدون اختيارات لأن أي طلب جديد يبدأ دائماً من مرحلة الطابور) */}
					<div
						className="h-6.5 px-2.5 rounded-md border border-blue-200/90 bg-blue-50/80 dark:border-blue-900/60 dark:bg-blue-950/40 text-[10.5px] font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-1.5 select-none shrink-0"
						title="مرحلة الطلب: طابور (يبدأ أي طلب جديد تلقائياً في مرحلة الطابور)"
					>
						<IconClock className="size-3 text-blue-600 dark:text-blue-400 shrink-0" />
						<span>{initialData ? (selectedColumn || "طابور") : "طابور"}</span>
					</div>

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
								<div className="flex items-center gap-1.5 select-none">
									<span className="text-[11px] font-medium text-muted-foreground hover:text-foreground">
										أنشئ المزيد
									</span>
									<Checkbox
										aria-label="أنشئ المزيد"
										checked={createMore}
										onCheckedChange={(checked) => setCreateMore(!!checked)}
										className="size-3.5 rounded-[3px]"
									/>
								</div>

								<div className="flex items-center gap-1.5 select-none">
									<span className="text-[11px] font-medium text-muted-foreground hover:text-foreground">
										إشعار عبر الواتساب
									</span>
									<Switch
										aria-label="إشعار عبر الواتساب"
										size="sm"
										checked={notifyWhatsapp}
										onCheckedChange={setNotifyWhatsapp}
									/>
								</div>
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
								<div className="flex items-center gap-1.5 select-none">
									<span className="text-[11px] font-medium text-muted-foreground hover:text-foreground">
										إشعار عبر الواتساب
									</span>
									<Switch
										aria-label="إشعار عبر الواتساب"
										size="sm"
										checked={notifyWhatsapp}
										onCheckedChange={setNotifyWhatsapp}
									/>
								</div>

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

		{/* شيت إضافة موظف جديد للنظام عند الضغط على + إضافة موظف جديد */}
		<AddStaffSheet
			open={isAddStaffOpen}
			onClose={() => setIsAddStaffOpen(false)}
			onCreated={(newStaff) => {
				setIsAddStaffOpen(false);
				toast.success(`تمت إضافة الموظف ${newStaff.name}. أضف له حساب نظام أولاً ليظهر كمراجع.`);
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
