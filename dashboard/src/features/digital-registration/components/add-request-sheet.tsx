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
	IconCircle,
	IconDots,
	IconHeadset,
	IconInfoCircle,
	IconMapPin,
	IconPhone,
	IconPlus,
	IconUser,
	IconX,
	IconArrowRight,
	IconLinkPlus,
	IconFileFilled,
} from "@tabler/icons-react";
import { BirthDatePicker } from "./birth-date-picker";
import { AppointmentPickerPopover } from "./appointment-picker-popover";
import { RoomPickerPopover } from "./room-picker-popover";
import { ColumnStatusPicker } from "./column-status-picker";
import { PriorityPickerPopover } from "./priority-picker-popover";
import { useCreateRequest } from "../hooks/use-digital-registration";
import { backendFetch } from "@/lib/backend-fetch";
import { useOwners } from "@/features/services/patients/hooks/use-owners";
import { usePatients } from "@/features/services/patients/hooks/use-patients";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { AddStaffSheet } from "@/features/services/staff/components/add-staff-sheet";

interface AddRequestDialogProps {
	open: boolean;
	onClose: () => void;
	campaignId: string;
	defaultColumn?: string;
}

// قائمة احتياطية للطلاب المسجلين بالنظام عند العمل محلياً
const DEFAULT_STUDENTS = [
	{
		id: "st-1",
		name: "يوسف أحمد المنصور",
		birthDate: "19/02/2008",
		gender: "MALE",
		guardian: "محمد السالم",
		guardianPhone: "0551234567",
	},
	{
		id: "st-2",
		name: "ريما خالد العتيبي",
		birthDate: "14/05/2010",
		gender: "FEMALE",
		guardian: "خالد العتيبي",
		guardianPhone: "0564567890",
	},
	{
		id: "st-3",
		name: "عمر سلطان القحطاني",
		birthDate: "03/11/2009",
		gender: "MALE",
		guardian: "سلطان القحطاني",
		guardianPhone: "0533344556",
	},
	{
		id: "st-4",
		name: "سارة فهد الدوسري",
		birthDate: "22/08/2011",
		gender: "FEMALE",
		guardian: "فهد الدوسري",
		guardianPhone: "0543210987",
	},
	{
		id: "st-5",
		name: "عبدالرحمن عمر الغامدي",
		birthDate: "07/01/2008",
		gender: "MALE",
		guardian: "عمر الغامدي",
		guardianPhone: "0511223344",
	},
];

// Fallback guardians list when database has no owners yet or running locally
const DEFAULT_GUARDIANS = [
	{ id: "g-1", name: "محمد السالم", phone: "0551234567" },
	{ id: "g-2", name: "عبدالله الشمري", phone: "0509876543" },
	{ id: "g-3", name: "خالد العتيبي", phone: "0564567890" },
	{ id: "g-4", name: "فهد الدوسري", phone: "0543210987" },
	{ id: "g-5", name: "سلطان القحطاني", phone: "0533344556" },
	{ id: "g-6", name: "عمر الغامدي", phone: "0511223344" },
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
): "QUEUE" | "SHORTLIST" | "INTERVIEW" | "IN_EVALUATION" | "WAITLIST" | "ACCEPTED" | "REJECTED" {
	if (!s) return "QUEUE";
	switch (s) {
		case "shortlist":
		case "SHORTLIST":
		case "القائمة المختصرة":
			return "SHORTLIST";
		case "interview":
		case "INTERVIEW":
		case "المقابلة الشخصية":
			return "INTERVIEW";
		case "evaluation":
		case "IN_EVALUATION":
		case "EVALUATION":
		case "داخل التقييم":
			return "IN_EVALUATION";
		case "waitlist":
		case "WAITLIST":
		case "قائمة الانتظار":
			return "WAITLIST";
		case "accepted":
		case "ACCEPTED":
		case "مقبول":
			return "ACCEPTED";
		case "rejected":
		case "REJECTED":
		case "مرفوض":
			return "REJECTED";
		default:
			return "QUEUE";
	}
}

export function AddRequestDialog({
	open,
	onClose,
	campaignId,
	defaultColumn = "طابور",
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
	const [notes, setNotes] = useState("");
	const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
	const [selectedOwnerId, setSelectedOwnerId] = useState<string | null>(null);

	// ─── Student Combobox Filtering from System ─────────────────────────────────
	const [studentDropdownOpen, setStudentDropdownOpen] = useState(false);
	const studentContainerRef = useRef<HTMLDivElement>(null);
	const { patients = [] } = usePatients();

	const allStudents = useMemo(() => {
		if (patients && patients.length > 0) {
			return patients.map((p) => {
				let gName = (p as any).guardianName || "";
				let gPhone = (p as any).guardianPhone || "";
				if ((p as any).guardians && (p as any).guardians.length > 0) {
					const g0 = (p as any).guardians[0];
					gName = g0.owner?.name || gName;
					gPhone = g0.owner?.phone || gPhone;
				}
				let bDate = "";
				if ((p as any).birthDate) {
					const d = new Date((p as any).birthDate);
					if (!isNaN(d.getTime())) {
						const dd = String(d.getDate()).padStart(2, "0");
						const mm = String(d.getMonth() + 1).padStart(2, "0");
						const yy = d.getFullYear();
						bDate = `${dd}/${mm}/${yy}`;
					}
				}
				return {
					id: p.id,
					name: p.name || "بدون اسم",
					gender: (p as any).gender || "",
					birthDate: bDate,
					guardian: gName,
					guardianPhone: gPhone,
				};
			});
		}
		return DEFAULT_STUDENTS;
	}, [patients]);

	const filteredStudents = useMemo(() => {
		if (!studentName.trim()) return allStudents;
		const q = studentName.trim().toLowerCase();
		return allStudents.filter((s) => s.name.toLowerCase().includes(q));
	}, [allStudents, studentName]);

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
			}));
		}
		return DEFAULT_GUARDIANS;
	}, [owners]);

	const filteredGuardians = useMemo(() => {
		if (!guardian.trim()) return allGuardians;
		const q = guardian.trim().toLowerCase();
		return allGuardians.filter(
			(g) => g.name.toLowerCase().includes(q) || g.phone.includes(q),
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
			if (
				studentContainerRef.current &&
				!studentContainerRef.current.contains(e.target as Node)
			) {
				setStudentDropdownOpen(false);
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
		setNotes("");
		setReviewer("المراجع");
		setReviewerId(null);
		setStudentDropdownOpen(false);
		setGuardianDropdownOpen(false);
		setSearchStaff("");
		setIsReviewerOpen(false);
		setIsAddStaffOpen(false);
		setAppointmentDate("تاريخ الموعد");
		setAppointmentIsoDate(null);
		setSelectedRoom("الغرفة");
		setSelectedColumn(defaultColumn);
		setPriority("بدون أولوية");
		setSelectedStudentId(null);
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

	// Validation
	const validateForm = () => {
		if (!studentName.trim()) {
			setError("اختر الطالب مطلوب");
			toast.error("يرجى إدخال اسم الطالب");
			return false;
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
		if (!guardian.trim()) {
			setError("ولي الأمر مطلوب");
			toast.error("يرجى اختيار أو إدخال ولي الأمر");
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

		try {
			await createMutation.mutateAsync({
				campaignId,
				studentName: studentName.trim(),
				gender: (gender as "MALE" | "FEMALE" | "UNKNOWN") || "UNKNOWN",
				birthDate: isoBirthDate,
				ageLabel: experienceLevel || null,
				targetClass: suggestedTrack,
				guardianName: guardian.trim(),
				guardianPhone: validPhone,
				source: backendSource,

				// الربط المتكامل مع الطلاب وأولياء الأمور والمواعيد والقاعات
				existingPatientId: selectedStudentId,
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
				notes: notes.trim() || null,
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

			toast.success(
				notifyWhatsapp
					? "تم تسجيل المتقدم وإضافته إلى طابور الانتظار وتجهيز إشعار الواتساب"
					: "تم تسجيل المتقدم وإضافته إلى طابور الانتظار بنجاح",
			);

			if (createMore) {
				// Keep dialog open and reset inputs for adding another candidate
				setStep(1);
				setStudentName("");
				setSelectedStudentId(null);
				setSelectedOwnerId(null);
				setBirthDate("");
				setGender("");
				setExperienceLevel("");
				setLearningMode("");
				setPreferredShift("");
				setSuggestedTrack("");
				setGuardian("");
				setGuardianPhone("");
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
				if (step === 1) {
					handleNext();
				} else {
					handleSubmit();
				}
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [open, step, studentName, birthDate, gender, learningMode, suggestedTrack, guardian]);

	const isSubmitting = createMutation.isPending;

	const isFormFilled =
		Boolean(studentName.trim()) &&
		Boolean(birthDate.trim()) &&
		Boolean(gender) &&
		Boolean(learningMode) &&
		Boolean(suggestedTrack) &&
		Boolean(guardian.trim());

	return (
		<>
			<Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
			<DialogContent
				showCloseButton={false}
				className={cn(
					"p-0 gap-0 overflow-hidden rounded-xl bg-card border border-border/80 shadow-2xl transition-all duration-150",
					isExpanded ? "sm:max-w-4xl max-w-[96vw]" : "sm:max-w-[530px] max-w-[94vw]",
				)}
				dir="rtl"
			>
				{/* ─── 1. Header Bar: تسجيل طلب جديد في: [عبر اتصال / في الأكاديمية] ── */}
				<div className="flex items-center justify-between px-4 pt-3 pb-2 bg-card select-none">
					{/* Title + Channel Dropdown */}
					<div className="flex items-center gap-2">
						<span className="text-[13px] font-bold text-foreground">
							تسجيل طلب جديد في:
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

				{/* ─── 2. Body Content ──────────────────────────────────────────── */}
				<div className="px-4 py-2 max-h-[calc(100vh-165px)] overflow-y-auto">
					{error && (
						<div className="mb-2.5 rounded-md bg-destructive/10 border border-destructive/20 p-2 text-[11px] font-semibold text-destructive text-center">
							{error}
						</div>
					)}

					{step === 1 ? (
						<div className="flex flex-col gap-2.5">
							{/* Row 1: اختر الطالب | تاريخ الميلاد */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								{/* اختر الطالب (Searchable Combobox من طلاب النظام مع الفلترة والملء التلقائي) */}
								<div ref={studentContainerRef} className="relative">
									<FieldHeader
										label="اختر الطالب"
										required
										tooltip="اختر من الطلاب المسجلين بالنظام أو اكتب للفلترة وإضافة طالب جديد"
									/>
									<div className="relative">
										<Input
											value={studentName}
											onChange={(e) => {
												setStudentName(e.target.value);
												setSelectedStudentId(null);
												setStudentDropdownOpen(true);
											}}
											onFocus={() => setStudentDropdownOpen(true)}
											placeholder="مثال: يوسف"
											className="h-8 text-xs text-right pr-2.5 pl-8 rounded-md border-border/80 bg-background"
											required
										/>
										<button
											type="button"
											onClick={() => setStudentDropdownOpen((prev) => !prev)}
											className="absolute inset-y-0 left-2.5 flex items-center text-muted-foreground/60 hover:text-foreground cursor-pointer"
										>
											<IconChevronDown className="size-3" />
										</button>
									</div>

									{/* القائمة المنسدلة التفاعلية للطلاب مع الفلترة اللحظية */}
									{studentDropdownOpen && (
										<div
											className="absolute z-[99] mt-1 w-full rounded-lg border border-border/80 bg-popover text-popover-foreground shadow-2xl p-1 max-h-48 overflow-y-auto"
											dir="rtl"
										>
											<div className="px-2 py-1 text-[10px] text-muted-foreground font-semibold border-b border-border/50 flex items-center justify-between">
												<span>الطلاب المسجلين بالنظام</span>
												<span className="font-mono text-[9px]">
													{filteredStudents.length} متاح
												</span>
											</div>

											{filteredStudents.length > 0 ? (
												<div className="py-1 space-y-0.5">
													{filteredStudents.map((st) => (
														<button
															key={st.id}
															type="button"
															onClick={() => {
																setStudentName(st.name);
																setSelectedStudentId(st.id.startsWith("s-") ? null : st.id);
																if (st.birthDate) setBirthDate(st.birthDate);
																if (st.gender) setGender(st.gender);
																if (st.guardian) {
																	setGuardian(st.guardian);
																	if (st.guardianPhone) setGuardianPhone(st.guardianPhone);
																}
																setStudentDropdownOpen(false);
															}}
															className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs text-right hover:bg-muted/70 transition-colors cursor-pointer group"
														>
															<div className="flex items-center gap-1.5">
																<IconUser className="size-3 text-muted-foreground group-hover:text-primary transition-colors" />
																<span className="font-semibold text-foreground">{st.name}</span>
															</div>
															{st.guardian && (
																<span className="text-[10px] text-muted-foreground truncate max-w-[120px]">
																	ولي الأمر: {st.guardian}
																</span>
															)}
														</button>
													))}
												</div>
											) : (
												<div className="p-2.5 text-center text-xs text-muted-foreground space-y-1">
													<p>لا يوجد طالب مسجل بهذا الاسم</p>
													{studentName.trim() && (
														<button
															type="button"
															onClick={() => setStudentDropdownOpen(false)}
															className="text-primary hover:underline font-semibold text-[11px] cursor-pointer"
														>
															استخدام "{studentName}" كاسم طالب جديد
														</button>
													)}
												</div>
											)}
										</div>
									)}
								</div>

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
							</div>

							{/* Row 2: الجنس | مستوى */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
										<SelectTrigger className="w-full h-8 text-xs text-right rounded-md border-border/80" dir="rtl">
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
										<SelectTrigger className="w-full h-8 text-xs text-right rounded-md border-border/80" dir="rtl">
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
							</div>

							{/* Row 3: طريقة التعلم | المناوبة المفضلة */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
										<SelectTrigger className="w-full h-8 text-xs text-right rounded-md border-border/80" dir="rtl">
											<SelectValue placeholder="اختر الطريقة..." />
										</SelectTrigger>
										<SelectContent
											dir="rtl"
											position="popper"
											sideOffset={4}
											className="z-[99] w-[var(--radix-select-trigger-width)] min-w-[160px] bg-popover text-popover-foreground border border-border/80 shadow-xl rounded-lg p-1 text-xs"
										>
											<SelectItem value="حضوري" className="text-right text-xs cursor-pointer py-1.5">
												حضوري
											</SelectItem>
											<SelectItem value="عن بعد" className="text-right text-xs cursor-pointer py-1.5">
												عن بعد
											</SelectItem>
											<SelectItem value="مدمج" className="text-right text-xs cursor-pointer py-1.5">
												مدمج
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

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
										<SelectTrigger className="w-full h-8 text-xs text-right rounded-md border-border/80" dir="rtl">
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
							</div>

							{/* Row 4: المجال المقترح (عرض كامل) */}
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
									<SelectTrigger className="w-full h-8 text-xs text-right rounded-md border-border/80" dir="rtl">
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

							{/* Row 5: ولي الأمر (Searchable Combobox من أولياء الأمور مع الفلترة أثناء الكتابة) */}
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
										placeholder="اختر"
										className="h-8 text-xs text-right pr-2.5 pl-8 rounded-md border-border/80 bg-background"
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
											<span>أولياء الأمور المتاحين</span>
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
															setSelectedOwnerId(g.id.startsWith("g-") ? null : g.id);
															setGuardianPhone(g.phone);
															setGuardianDropdownOpen(false);
														}}
														className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs text-right hover:bg-muted/70 transition-colors cursor-pointer group"
													>
														<div className="flex items-center gap-1.5">
															<IconUser className="size-3 text-muted-foreground group-hover:text-primary transition-colors" />
															<span className="font-semibold text-foreground">{g.name}</span>
														</div>
														{g.phone && (
															<span className="text-[10px] text-muted-foreground font-mono" dir="ltr">
																{g.phone}
															</span>
														)}
													</button>
												))}
											</div>
										) : (
											<div className="p-2.5 text-center text-xs text-muted-foreground space-y-1">
												<p>لا يوجد ولي أمر بهذا الاسم</p>
												{guardian.trim() && (
													<button
														type="button"
														onClick={() => setGuardianDropdownOpen(false)}
														className="text-primary hover:underline font-semibold text-[11px] cursor-pointer"
													>
														استخدام "{guardian}" كاسم ولي أمر جديد
													</button>
												)}
											</div>
										)}
									</div>
								)}
							</div>

							{/* Row 6: ملاحظات (اختياري) */}
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
									className="text-xs text-right h-14 min-h-[56px] resize-none rounded-md border-border/80 placeholder:text-muted-foreground/60 py-1.5"
								/>
							</div>
						</div>
					) : (
						/* ─── Step 2: Confirmation & Review ────────────────────────── */
						<div className="flex flex-col gap-3">
							<div className="rounded-xl border border-border/80 bg-muted/20 p-3.5 space-y-2.5">
								<div className="flex items-center justify-between border-b border-border/60 pb-2">
									<span className="text-xs font-bold text-foreground">ملخص مراجعة الطلب</span>
									<span className="text-[11px] text-primary font-semibold font-mono">
										{channel === "CALL" ? "عبر اتصال" : "في الأكاديمية"}
									</span>
								</div>

								<div className="grid grid-cols-2 gap-2 text-xs">
									<div>
										<span className="text-muted-foreground block text-[10px]">اسم الطالب</span>
										<span className="font-bold text-foreground">{studentName}</span>
									</div>
									<div>
										<span className="text-muted-foreground block text-[10px]">تاريخ الميلاد</span>
										<span className="font-mono text-foreground">{birthDate}</span>
									</div>
									<div>
										<span className="text-muted-foreground block text-[10px]">الجنس</span>
										<span className="text-foreground">{gender === "MALE" ? "ذكر" : "أنثى"}</span>
									</div>
									<div>
										<span className="text-muted-foreground block text-[10px]">مستوى الخبرة</span>
										<span className="text-foreground">{experienceLevel || "غير محدد"}</span>
									</div>
									<div>
										<span className="text-muted-foreground block text-[10px]">طريقة التعلم</span>
										<span className="text-foreground">{learningMode}</span>
									</div>
									<div>
										<span className="text-muted-foreground block text-[10px]">المناوبة</span>
										<span className="text-foreground">{preferredShift || "غير محدد"}</span>
									</div>
									<div className="col-span-2">
										<span className="text-muted-foreground block text-[10px]">المجال المقترح</span>
										<span className="font-semibold text-foreground">{suggestedTrack}</span>
									</div>
									<div className="col-span-2">
										<span className="text-muted-foreground block text-[10px]">ولي الأمر</span>
										<span className="text-foreground">
											{guardian} {guardianPhone ? `(${guardianPhone})` : ""}
										</span>
									</div>
									{notes && (
										<div className="col-span-2">
											<span className="text-muted-foreground block text-[10px]">ملاحظات</span>
											<span className="text-muted-foreground text-[11px]">{notes}</span>
										</div>
									)}
									{(attachedDocuments.length > 0 || attachedLinks.length > 0) && (
										<div className="col-span-2 pt-1 border-t border-border/40">
											<span className="text-muted-foreground block text-[10px]">المرفقات والروابط</span>
											<div className="flex flex-wrap gap-1 mt-1">
												{attachedDocuments.map((d) => (
													<span key={d.id} className="text-[10px] px-1.5 py-0.5 bg-muted rounded inline-flex items-center gap-1">
														<IconFileFilled className="size-2.5 text-muted-foreground" />
														<span>{d.name}</span>
													</span>
												))}
												{attachedLinks.map((l) => (
													<span key={l.id} className="text-[10px] px-1.5 py-0.5 bg-muted rounded inline-flex items-center gap-1 text-[#4F6BF5]">
														<IconLinkPlus className="size-2.5" />
														<span>{l.title || l.url}</span>
													</span>
												))}
											</div>
										</div>
									)}
								</div>
							</div>

							<div className="flex flex-wrap items-center gap-1.5 text-xs">
								<span className="text-muted-foreground text-[10.5px]">التوزيع المبدئي:</span>
								<span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-semibold text-[10.5px]">
									{selectedColumn}
								</span>
								<span className="px-2 py-0.5 rounded-md bg-muted text-foreground font-semibold text-[10.5px]">
									{priority}
								</span>
								{selectedRoom !== "الغرفة" && (
									<span className="px-2 py-0.5 rounded-md bg-muted text-foreground text-[10.5px]">
										الغرفة: {selectedRoom}
									</span>
								)}
								{reviewer !== "المراجع" && (
									<span className="px-2 py-0.5 rounded-md bg-muted text-foreground text-[10.5px]">
										المراجع: {reviewer}
									</span>
								)}
							</div>
						</div>
					)}
				</div>

				{/* ─── المرفقات والروابط المضافة من قائمة الثلاث نقط ───────────── */}
				{(attachedDocuments.length > 0 || attachedLinks.length > 0) && (
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

				{/* ─── 3. Action Pills Bar (مطابق 100% لصورة المستخدم المرفقة e3a48d0f) ── */}
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
								className="max-h-60 overflow-y-auto overscroll-contain p-1.5 space-y-0.5 [scrollbar-width:thin] [scrollbar-color:hsl(var(--muted-foreground)/0.3)_transparent]"
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

				{/* ─── 4. Footer Bar (مطابق 100% لصورة المستخدم المرفقة e3a48d0f) ── */}
				<div className="px-4 py-2.5 border-t border-border/70 bg-card flex items-center justify-between gap-2" dir="rtl">
					{/* أقصى اليمين في RTL: أنشئ المزيد (Checkbox) */}
					<div className="flex items-center gap-4">
						<label className="flex items-center gap-1.5 cursor-pointer select-none">
							<span className="text-[11.5px] text-muted-foreground hover:text-foreground">
								أنشئ المزيد
							</span>
							<Checkbox
								checked={createMore}
								onCheckedChange={(checked) => setCreateMore(!!checked)}
								className="size-3.5 rounded-[3px]"
							/>
						</label>

						{/* في المنتصف: إشعار عبر الواتساب (Switch) */}
						<label className="flex items-center gap-1.5 cursor-pointer select-none">
							<span className="text-[11.5px] text-muted-foreground hover:text-foreground">
								إشعار عبر الواتساب
							</span>
							<Switch
								size="sm"
								checked={notifyWhatsapp}
								onCheckedChange={setNotifyWhatsapp}
							/>
						</label>
					</div>

					{/* أقصى اليسار في RTL: زر التالي: مراجعة الطلب  ⌘K */}
					<div className="flex items-center gap-2">
						{step === 2 && (
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => setStep(1)}
								disabled={isSubmitting}
								className="h-8 px-2.5 text-xs"
							>
								<IconArrowRight className="size-3.5 ms-1" />
								<span>السابق</span>
							</Button>
						)}

						{step === 1 ? (
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
						) : (
							<Button
								type="button"
								size="sm"
								onClick={handleSubmit}
								disabled={isSubmitting}
								className="h-8 px-3.5 text-xs font-bold bg-[#5B50E5] hover:bg-[#4E43D8] text-white shadow-xs rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
							>
								<IconCheck className="size-3.5" />
								<span>{isSubmitting ? "جاري الحفظ..." : "تأكيد وتسجيل المتقدم"}</span>
							</Button>
						)}
					</div>
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
		<div className="flex items-center justify-between mb-1 select-none">
			<div className="flex items-center gap-1.5">
				<Label className="text-[11.5px] font-bold text-foreground">{label}</Label>
				{required && (
					<span className="bg-[#FFF1F2] dark:bg-rose-950/60 text-[#E11D48] dark:text-rose-400 text-[8.5px] font-bold px-1.5 py-0.2 rounded-full leading-tight border border-rose-200/50 dark:border-rose-900/50">
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
