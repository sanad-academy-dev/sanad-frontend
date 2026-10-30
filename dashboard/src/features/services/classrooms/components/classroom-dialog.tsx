import {
	IconAtom,
	IconAward,
	IconBallFootball,
	IconBook,
	IconBooks,
	IconBrain,
	IconBrandWhatsapp,
	IconBriefcase,
	IconBuilding,
	IconBulb,
	IconCalculator,
	IconCalendarPlus,
	IconCertificate,
	IconCheck,
	IconChess,
	IconCircle,
	IconCode,
	IconCompass,
	IconCopy,
	IconCpu,
	IconCube,
	IconDeviceLaptop,
	IconDiamond,
	IconDots,
	IconFileDescription,
	IconFlag,
	IconFlame,
	IconGlobe,
	IconHeadphones,
	IconHeart,
	IconLanguage,
	IconMapPinFilled,
	IconMaximize,
	IconMoodHappy,
	IconMoodSmile,
	IconMusic,
	IconPalette,
	IconPencil,
	IconPlus,
	IconPuzzle,
	IconRobot,
	IconRocket,
	IconScan,
	IconSchool,
	IconSearch,
	IconSparkles,
	IconStar,
	IconTools,
	IconUsers,
	IconX,
} from "@tabler/icons-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { FieldLabel } from "@/components/common/field-label";
import { FormFooter } from "@/components/common/form-footer";
import { FormHeader } from "@/components/common/form-header";
import { RichNotesEditor } from "@/components/common/rich-notes-editor";
import { SanadLogo } from "@/components/common/sanad-logo";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
	AGE_GROUPS,
	CATEGORIES,
	LEARNING_MODES,
} from "@/features/services/classrooms/data/constants";
import {
	useAddClassroomClassification,
	useCreateClassroom,
	useDeleteClassroomClassification,
	useUpdateClassroom,
} from "@/features/services/classrooms/hooks/use-classroom-mutations";
import { useClassroomClassifications } from "@/features/services/classrooms/hooks/use-classrooms";
import { useBranches } from "@/features/settings/branches/hooks/use-branches";
import { cn } from "@/lib/utils";
import type { ClassroomResponse, LearningMode } from "@/server/classrooms/classrooms.type";
import { AssignStaffSheet } from "./assign-staff-dialog";
import { ClassroomAgentPanel } from "./classroom-agent-panel";
import { ClassroomReviewStep } from "./classroom-review-step";
import { SaveDraftConfirmDialog } from "./save-draft-confirm-dialog";

// قائمة الأيقونات المتاحة للاختيار مع وسوم البحث
const POPULAR_ICONS = [
	{ id: "cube", name: "مكعب فضاء", icon: IconCube },
	{ id: "code", name: "برمجة كود", icon: IconCode },
	{ id: "cpu", name: "معالج تقنية", icon: IconCpu },
	{ id: "robot", name: "روبوت ذكاء اصطناعي", icon: IconRobot },
	{ id: "school", name: "مدرسة أكاديمية", icon: IconSchool },
	{ id: "book", name: "كتاب قراءة", icon: IconBook },
	{ id: "books", name: "كتب مكتبة", icon: IconBooks },
	{ id: "brain", name: "عقل تفكير ذكاء", icon: IconBrain },
	{ id: "atom", name: "ذرة علوم فيزياء", icon: IconAtom },
	{ id: "sparkles", name: "تميز إبداع لمعان", icon: IconSparkles },
	{ id: "rocket", name: "صاروخ سرعة انطلاق", icon: IconRocket },
	{ id: "palette", name: "رسم فن ألوان", icon: IconPalette },
	{ id: "music", name: "موسيقى نغم صوت", icon: IconMusic },
	{ id: "headphones", name: "سماعات استماع لغات", icon: IconHeadphones },
	{ id: "bulb", name: "فكرة إلهام لمبة", icon: IconBulb },
	{ id: "flame", name: "حماس نار شعلة", icon: IconFlame },
	{ id: "star", name: "نجمة تفوق أداء", icon: IconStar },
	{ id: "award", name: "جائزة وسام بطولة", icon: IconAward },
	{ id: "heart", name: "قلب صحة رعاية", icon: IconHeart },
	{ id: "happy", name: "سعادة ابتسامة فرح", icon: IconMoodHappy },
	{ id: "smile", name: "مبتسم مرح أطفال", icon: IconMoodSmile },
	{ id: "users", name: "فريق طلاب جماعي", icon: IconUsers },
	{ id: "ball", name: "كرة رياضة نشاط", icon: IconBallFootball },
	{ id: "chess", name: "شطرنج استراتيجية تخطيط", icon: IconChess },
	{ id: "laptop", name: "لابتوب كمبيوتر حاسوب", icon: IconDeviceLaptop },
	{ id: "flag", name: "راية علم هدف", icon: IconFlag },
	{ id: "briefcase", name: "حقيبة عمل مهام", icon: IconBriefcase },
	{ id: "compass", name: "بوصلة توجيه استكشاف", icon: IconCompass },
	{ id: "building", name: "مبنى قاعة فرع", icon: IconBuilding },
	{ id: "globe", name: "عالم لغات دولي", icon: IconGlobe },
	{ id: "calculator", name: "حاسبة رياضيات أرقام", icon: IconCalculator },
	{ id: "certificate", name: "شهادة تخرج إنجاز", icon: IconCertificate },
	{ id: "language", name: "لغات ترجمة إنجليزي", icon: IconLanguage },
	{ id: "pencil", name: "قلم كتابة تدريب", icon: IconPencil },
	{ id: "tools", name: "أدوات مهارات يدوي", icon: IconTools },
	{ id: "puzzle", name: "لغز بازل تركيب", icon: IconPuzzle },
	{ id: "diamond", name: "الماسة قيمة مميز", icon: IconDiamond },
];

// قائمة الإيموجي الشائعة للفصول
const POPULAR_EMOJIS = [
	"💻",
	"🤖",
	"🚀",
	"🧠",
	"🎨",
	"📚",
	"🎓",
	"🔬",
	"🧪",
	"💡",
	"⭐",
	"🏆",
	"🧩",
	"🎮",
	"📐",
	"✏️",
	"⚽",
	"🏀",
	"🎯",
	"👾",
	"🦄",
	"🌟",
	"🎪",
	"🎭",
	"🎵",
	"🎸",
	"🥋",
	"🌍",
	"🏕️",
	"⚡",
	"🔔",
	"💼",
	"🏅",
	"✨",
	"🔥",
	"🛸",
	"🕹️",
	"📖",
	"🥇",
	"🎉",
	"👶",
	"👦",
	"👧",
	"👨‍🏫",
	"👩‍🏫",
	"🧑‍💻",
	"👩‍🔬",
	"👨‍🎨",
];

// ألوان الأيقونة المعتمدة
const COLOR_OPTIONS = [
	{
		id: "red",
		label: "أحمر مرجاني",
		hex: "#EF4444",
		bg: "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:border-red-900 dark:text-red-400",
	},
	{
		id: "peach",
		label: "وردي ناعم",
		hex: "#E0A597",
		bg: "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-400",
	},
	{
		id: "orange",
		label: "برتقالي",
		hex: "#F97316",
		bg: "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950/40 dark:border-orange-900 dark:text-orange-400",
	},
	{
		id: "amber",
		label: "أصفر ذهبي",
		hex: "#F59E0B",
		bg: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-400",
	},
	{
		id: "emerald",
		label: "أخضر زمردي",
		hex: "#10B981",
		bg: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-400",
	},
	{
		id: "cyan",
		label: "سماوي",
		hex: "#06B6D4",
		bg: "bg-cyan-50 text-cyan-600 border-cyan-200 dark:bg-cyan-950/40 dark:border-cyan-900 dark:text-cyan-400",
	},
	{
		id: "blue",
		label: "أزرق ملكي",
		hex: "#3B82F6",
		bg: "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-400",
	},
	{
		id: "rose",
		label: "وردي زاهي",
		hex: "#F43F5E",
		bg: "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-400",
	},
	{
		id: "indigo",
		label: "بنفسجي نيلي",
		hex: "#6366F1",
		bg: "bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-900 dark:text-indigo-400",
	},
	{
		id: "slate",
		label: "رمادي معدني",
		hex: "#64748B",
		bg: "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300",
	},
	{
		id: "gray",
		label: "رمادي داكن",
		hex: "#94A3B8",
		bg: "bg-neutral-100 text-neutral-700 border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300",
	},
];

// قوالب سريعة لملء النموذج
const CLASSROOM_TEMPLATES = [
	{
		id: "digital_registration",
		title: "التسجيل الرقمي",
		category: "مختلط",
		ageGroup: "17+ سنة",
		learningMode: "REMOTE" as LearningMode,
		capacity: 20,
		description:
			"دورة تدريبية متقدمة في استراتيجيات التسجيل الرقمي وإدارة الحملات وتحليل البيانات.",
		notes: "يشمل شهادة إتمام معتمدة وتطبيق عملي.",
		icon: "chart",
		Icon: IconFileDescription,
		color: "indigo",
	},
	{
		id: "kids_coding",
		title: "مسار البرمجه للاطفال",
		category: "مختلط",
		ageGroup: "8-12 سنة",
		learningMode: "REMOTE" as LearningMode,
		capacity: 10,
		description:
			"فصل تدريبي تفاعلي لتعليم أساسيات البرمجة والتفكير المنطقي عبر مشاريع عملية ممتعة.",
		notes: "يتطلب حاسوب شخصي واتصال بالإنترنت.",
		icon: "code",
		Icon: IconCube,
		color: "blue",
	},
	// {
	// 	id: "robotics",
	// 	title: "الروبوت والذكاء الاصطناعي",
	// 	category: "بنين",
	// 	ageGroup: "13-16 سنة",
	// 	learningMode: "IN_PERSON" as LearningMode,
	// 	capacity: 15,
	// 	description: "تطبيق عملي لمشاريع الروبوتات وتحديات الذكاء الاصطناعي في مختبر الابتكار.",
	// 	notes: "الأدوات والمعدات متوفرة داخل المختبر.",
	// 	icon: "robot",
	// 	Icon: IconRobot,
	// 	color: "indigo",
	// },
	// {
	// 	id: "speech",
	// 	title: "النطق وتنمية المهارات",
	// 	category: "مختلط",
	// 	ageGroup: "4-7 سنوات",
	// 	learningMode: "IN_PERSON" as LearningMode,
	// 	capacity: 6,
	// 	description: "جلسات جماعية مصغرة لتطوير مهارات التخاطب والنطق والتفاعل الاجتماعي.",
	// 	notes: "متابعة فردية لكل طالب مع تقييم دوري.",
	// 	icon: "brain",
	// 	Icon: IconBrain,
	// 	color: "rose",
	// },
	// {
	// 	id: "english",
	// 	title: "اللغة الإنجليزية التفاعلية",
	// 	category: "بنات",
	// 	ageGroup: "8-12 سنة",
	// 	learningMode: "HYBRID" as LearningMode,
	// 	capacity: 12,
	// 	description: "تطوير مهارات المحادثة والاستماع باللغة الإنجليزية من خلال ألعاب وأنشطة تفاعلية.",
	// 	notes: "حصص حضورية ومتابعة دورية عن بعد.",
	// 	icon: "language",
	// 	Icon: IconLanguage,
	// 	color: "emerald",
	// },
];

// تصنيفات الفصول الافتراضية للدروب داون
const DEFAULT_CLASSIFICATIONS = ["برمجة", "ذكاء اصطناعي", "روبوتكس", "إدارة أعمال"];

export interface ClassroomDialogProps {
	open: boolean;
	onClose: () => void;
	classroom?: ClassroomResponse | null;
}

export function ClassroomDialog({ open, onClose, classroom }: ClassroomDialogProps) {
	const isEdit = Boolean(classroom);
	const { branches } = useBranches();
	const { classifications: backendClassifications, isLoading: isClassificationsLoading } =
		useClassroomClassifications();
	const { mutate: addClassificationMutation, isPending: isAddingClassification } =
		useAddClassroomClassification();
	const { mutate: deleteClassificationMutation } = useDeleteClassroomClassification();
	const { mutate: createClassroom, isPending: isCreating } = useCreateClassroom();
	const { mutate: updateClassroom, isPending: isUpdating } = useUpdateClassroom();
	const isPending = isCreating || isUpdating;

	// الحالات الأساسية للنموذج
	const [name, setName] = useState("");
	const [code, setCode] = useState("");
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState<string>("");
	const [capacity, setCapacity] = useState<number | string>("");
	const [notes, setNotes] = useState("");

	// حالة الأيقونة المنبثقة واللون المختار
	const [selectedIcon, setSelectedIcon] = useState<string>("cube");
	const [selectedIconType, setSelectedIconType] = useState<"icon" | "emoji">("icon");
	const [selectedColor, setSelectedColor] = useState<string>("blue");
	const [iconPickerOpen, setIconPickerOpen] = useState(false);
	const [iconSearch, setIconSearch] = useState("");
	const [activeIconTab, setActiveIconTab] = useState<"icons" | "emoji">("icons");

	// حالات الدروب داونز السفلية (Drop-downs)
	const [ageGroup, setAgeGroup] = useState<string>("");
	const [branch, setBranch] = useState<string>("");
	const [classification, setClassification] = useState<string>("");
	const [classificationsList, setClassificationsList] = useState<string[]>([]);
	const [newClassificationInput, setNewClassificationInput] = useState<string>("");
	const [learningMode, setLearningMode] = useState<LearningMode | "">("");

	// دمج التصنيفات الافتراضية مع تصنيفات الباك إند والإضافات المحلية
	const mergedClassifications = useMemo(() => {
		const set = new Set([
			...DEFAULT_CLASSIFICATIONS,
			...(backendClassifications || []),
			...classificationsList,
		]);
		return Array.from(set).filter(Boolean);
	}, [backendClassifications, classificationsList]);

	// خيارات إضافية وتفاعلية
	const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
	const [_showManagerSection, setShowManagerSection] = useState(false);
	const [isStaffSheetOpen, setIsStaffSheetOpen] = useState(false);
	const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>("none");
	const [templateSearch, setTemplateSearch] = useState("");
	const [templateMenuOpen, setTemplateMenuOpen] = useState(false);
	const [showNotice, setShowNotice] = useState(true);
	const [createAnother, setCreateAnother] = useState(false);
	const [notifyWhatsApp, setNotifyWhatsApp] = useState(false);
	const [showDraftConfirm, setShowDraftConfirm] = useState(false);
	const [hasDraft, setHasDraft] = useState(false);
	const [isAgentOpen, setIsAgentOpen] = useState(false);
	const [isReviewStep, setIsReviewStep] = useState(false);

	// حالات التحقق من صحة المدخلات (Validation)
	const [errors, setErrors] = useState<{
		name?: string;
		category?: string;
		capacity?: string;
	}>({});
	const [touched, setTouched] = useState<{
		name?: boolean;
		category?: boolean;
		capacity?: boolean;
	}>({});

	// دالة التحقق الشاملة من الحقول المطلوبة (الاسم، الفئة، السعة)
	const validateForm = useCallback(
		(customValues?: { name?: string; category?: string; capacity?: number | string }) => {
			const checkName = customValues && "name" in customValues ? customValues.name : name;
			const checkCategory =
				customValues && "category" in customValues ? customValues.category : category;
			const checkCapacity =
				customValues && "capacity" in customValues ? customValues.capacity : capacity;

			const newErrors: {
				name?: string;
				category?: string;
				capacity?: string;
			} = {};

			// 1. التحقق من اسم الفصل (مطلوب)
			const trimmedName = (checkName || "").trim();
			if (!trimmedName) {
				newErrors.name = "اسم الفصل مطلوب";
			} else if (trimmedName.length < 2) {
				newErrors.name = "يجب أن يحتوي اسم الفصل على حرفين على الأقل";
			} else if (trimmedName.length > 100) {
				newErrors.name = "اسم الفصل لا يمكن أن يتجاوز 100 حرف";
			}

			// 2. التحقق من فئة الفصل (مطلوبة)
			const trimmedCategory = (checkCategory || "").trim();
			if (!trimmedCategory) {
				newErrors.category = "يرجى تحديد فئة الفصل (مختلط / بنين / بنات)";
			} else if (!CATEGORIES.includes(trimmedCategory as (typeof CATEGORIES)[number])) {
				newErrors.category = "فئة الفصل المحددة غير صالحة";
			}

			// 3. التحقق من السعة القصوى (مطلوبة)
			if (checkCapacity === "" || checkCapacity === null || checkCapacity === undefined) {
				newErrors.capacity = "السعة القصوى مطلوبة";
			} else {
				const num = Number(checkCapacity);
				if (!Number.isFinite(num) || !Number.isInteger(num)) {
					newErrors.capacity = "يرجى إدخال عدد صحيح موجب للسعة";
				} else if (num < 1) {
					newErrors.capacity = "السعة يجب أن تكون 1 على الأقل";
				} else if (num > 500) {
					newErrors.capacity = "السعة لا يمكن أن تتجاوز 500 طالب";
				}
			}

			return newErrors;
		},
		[name, category, capacity],
	);

	// التحقق اللحظي من حقل معين
	const validateField = useCallback(
		(field: "name" | "category" | "capacity", value: unknown) => {
			const tempErrors = validateForm({
				name: field === "name" ? value : name,
				category: field === "category" ? value : category,
				capacity: field === "capacity" ? value : capacity,
			});
			setErrors((prev) => {
				const updated = { ...prev };
				if (tempErrors[field]) {
					updated[field] = tempErrors[field];
				} else {
					delete updated[field];
				}
				return updated;
			});
		},
		[validateForm, name, category, capacity],
	);

	const resetForm = useCallback(() => {
		setIsReviewStep(false);
		setIsAgentOpen(false);
		setName("");
		setCode("");
		setDescription("");
		setCategory("");
		setCapacity("");
		setNotes("");
		setAgeGroup("");
		setBranch("");
		setClassification("");
		setNewClassificationInput("");
		setLearningMode("");
		setSelectedStaffIds([]);
		setShowManagerSection(false);
		setSelectedTemplateId("none");
		setTemplateSearch("");
		setTemplateMenuOpen(false);
		setSelectedIcon("cube");
		setSelectedIconType("icon");
		setSelectedColor("blue");
		setIconSearch("");
		setIconPickerOpen(false);
		setErrors({});
		setTouched({});
	}, []);

	// مزامنة البيانات عند فتح النموذج
	// biome-ignore lint/correctness/useExhaustiveDependencies: مزامنة عند فتح الحوار أو تغير السجل
	useEffect(() => {
		if (classroom) {
			setName(classroom.name || "");
			setCode(classroom.code || "");
			setCategory(classroom.category || "مختلط");
			setAgeGroup(classroom.ageGroup || "8-12 سنة");
			setLearningMode(classroom.learningMode || "");
			setCapacity(classroom.capacity || 10);

			// استخراج البيانات من الملاحظات إن وجدت
			const rawNotes = classroom.notes || "";
			const matchDesc = rawNotes.match(/الوصف:\s*([^\n\r]+)/);
			const matchNotes = rawNotes.match(/الملاحظات:\s*([^\n\r]+)/);
			const matchBranch = rawNotes.match(/الفرع:\s*([^\n\r]+)/);
			const matchClass = rawNotes.match(/التصنيف:\s*([^\n\r]+)/);
			const matchIcon = rawNotes.match(/رمز_الفصل:\s*([^\n\r]+)/);
			const matchType = rawNotes.match(/نوع_الرمز:\s*([^\n\r]+)/);
			const matchColor = rawNotes.match(/لون_الفصل:\s*([^\n\r]+)/);

			setDescription(matchDesc?.[1]?.trim() || "");

			if (matchNotes?.[1]) {
				setNotes(matchNotes[1].trim());
			} else if (
				rawNotes &&
				!rawNotes.includes("الوصف:") &&
				!rawNotes.includes("التصنيف:") &&
				!rawNotes.includes("رمز_الفصل:")
			) {
				setNotes(rawNotes);
			} else {
				setNotes("");
			}

			setBranch(matchBranch?.[1]?.trim() || "");

			if (classroom.classification) {
				const savedClass = classroom.classification.trim();
				setClassification(savedClass);
				setClassificationsList((prev) =>
					prev.includes(savedClass) ? prev : [...prev, savedClass],
				);
			} else if (matchClass?.[1]) {
				const savedClass = matchClass[1].trim();
				setClassification(savedClass);
				setClassificationsList((prev) =>
					prev.includes(savedClass) ? prev : [...prev, savedClass],
				);
			} else {
				setClassification("");
			}

			if (matchIcon?.[1]) {
				const savedIcon = matchIcon[1].trim();
				setSelectedIcon(savedIcon);
				if (matchType?.[1]) {
					setSelectedIconType(matchType[1].trim() as "icon" | "emoji");
				} else {
					setSelectedIconType(POPULAR_EMOJIS.includes(savedIcon) ? "emoji" : "icon");
				}
			} else {
				setSelectedIcon("cube");
				setSelectedIconType("icon");
			}

			if (matchColor?.[1]) {
				setSelectedColor(matchColor[1].trim());
			} else {
				setSelectedColor("blue");
			}

			setSelectedStaffIds(classroom.teachers?.map((t) => t.id) || []);
			setShowManagerSection(Boolean(classroom.teachers?.length));
			setIsReviewStep(false);
		} else {
			resetForm();
		}
	}, [classroom, open, resetForm]);

	const applyTemplate = (tpl: (typeof CLASSROOM_TEMPLATES)[0]) => {
		setName(tpl.title);
		setCategory(tpl.category);
		setAgeGroup(tpl.ageGroup);
		setLearningMode(tpl.learningMode);
		setCapacity(tpl.capacity);
		setDescription(tpl.description);
		setNotes(tpl.notes);
		if (tpl.icon) {
			setSelectedIcon(tpl.icon);
			setSelectedIconType("icon");
		}
		if (tpl.color) {
			setSelectedColor(tpl.color);
		}
		setErrors({});
		setTouched({});
	};

	const handleSelectTemplate = (tpl: (typeof CLASSROOM_TEMPLATES)[0] | null) => {
		if (!tpl) {
			setSelectedTemplateId("none");
			setName("");
			setCategory("");
			setAgeGroup("");
			setLearningMode("");
			setCapacity("");
			setDescription("");
			setNotes("");
			setSelectedIcon("cube");
			setSelectedColor("blue");
			setTemplateMenuOpen(false);
			setErrors({});
			setTouched({});
			return;
		}

		setSelectedTemplateId(tpl.id);
		applyTemplate(tpl);
		setTemplateMenuOpen(false);
	};

	const filteredTemplates = useMemo(() => {
		if (!templateSearch.trim()) return CLASSROOM_TEMPLATES;
		const q = templateSearch.trim().toLowerCase();
		return CLASSROOM_TEMPLATES.filter(
			(t) =>
				t.title.toLowerCase().includes(q) ||
				(t.id === "digital_registration" && "التسويق الرقمي".includes(q)),
		);
	}, [templateSearch]);

	// فحص وجود مسودة محفوظة عند فتح النموذج لإنشاء فصل جديد
	useEffect(() => {
		if (open && !isEdit) {
			try {
				const saved = localStorage.getItem("sanad_classroom_draft");
				if (saved) {
					const parsed = JSON.parse(saved);
					if (parsed && typeof parsed === "object") {
						setHasDraft(true);
					}
				} else {
					setHasDraft(false);
				}
			} catch {
				localStorage.removeItem("sanad_classroom_draft");
				setHasDraft(false);
			}
		}
	}, [open, isEdit]);

	const isFormDirty = Boolean(
		name.trim() ||
			code.trim() ||
			description.trim() ||
			category ||
			capacity ||
			notes.trim() ||
			branch ||
			classification ||
			learningMode ||
			selectedStaffIds.length > 0 ||
			selectedIcon !== "cube" ||
			selectedColor !== "blue",
	);

	const handleCloseAttempt = useCallback(() => {
		if (!isEdit && isFormDirty) {
			setShowDraftConfirm(true);
		} else {
			resetForm();
			onClose();
		}
	}, [isEdit, isFormDirty, resetForm, onClose]);

	const handleSaveDraft = () => {
		const draftData = {
			name,
			code,
			description,
			category,
			capacity,
			notes,
			branch,
			classification,
			learningMode,
			selectedStaffIds,
			selectedIcon,
			selectedIconType,
			selectedColor,
			savedAt: new Date().toISOString(),
		};
		localStorage.setItem("sanad_classroom_draft", JSON.stringify(draftData));
		setHasDraft(true);
		setShowDraftConfirm(false);
		toast.success("تم حفظ المسودة بنجاح، يمكنك إكمالها لاحقاً");
		resetForm();
		onClose();
	};

	const handleDiscardDraft = () => {
		localStorage.removeItem("sanad_classroom_draft");
		setHasDraft(false);
		setShowDraftConfirm(false);
		resetForm();
		onClose();
	};

	const handleCancelDraftConfirm = () => {
		setShowDraftConfirm(false);
	};

	const handleRestoreDraft = () => {
		const saved = localStorage.getItem("sanad_classroom_draft");
		if (!saved) return;
		try {
			const d = JSON.parse(saved);
			if (d.name) setName(d.name);
			if (d.code) setCode(d.code);
			if (d.description) setDescription(d.description);
			if (d.category) setCategory(d.category);
			if (d.capacity) setCapacity(d.capacity);
			if (d.notes) setNotes(d.notes);
			if (d.branch) setBranch(d.branch);
			if (d.classification) setClassification(d.classification);
			if (d.learningMode) setLearningMode(d.learningMode);
			if (Array.isArray(d.selectedStaffIds)) setSelectedStaffIds(d.selectedStaffIds);
			if (d.selectedIcon) setSelectedIcon(d.selectedIcon);
			if (d.selectedIconType) setSelectedIconType(d.selectedIconType);
			if (d.selectedColor) setSelectedColor(d.selectedColor);
			setHasDraft(false);
			toast.success("تم استعادة المسودة بنجاح");
		} catch (e) {
			console.error("Failed to restore draft", e);
		}
	};

	const handleClearDraft = () => {
		localStorage.removeItem("sanad_classroom_draft");
		setHasDraft(false);
		toast.info("تم مسح المسودة المحفوظة");
	};

	const _toggleStaff = (id: string) => {
		setSelectedStaffIds((prev) =>
			prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id],
		);
	};

	// تصفية الأيقونات حسب البحث
	const filteredIcons = useMemo(() => {
		if (!iconSearch.trim()) return POPULAR_ICONS;
		const query = iconSearch.trim().toLowerCase();
		return POPULAR_ICONS.filter(
			(item) => item.name.includes(query) || item.id.includes(query),
		);
	}, [iconSearch]);

	// تصفية الإيموجي
	const filteredEmojis = useMemo(() => {
		return POPULAR_EMOJIS;
	}, []);

	// إعداد نمط ولون الأيقونة النشطة
	const currentColorConfig = useMemo(() => {
		return COLOR_OPTIONS.find((c) => c.id === selectedColor) || COLOR_OPTIONS[0];
	}, [selectedColor]);

	// إيجاد مكون الأيقونة النشطة
	const ActiveIconComponent = useMemo(() => {
		const found = POPULAR_ICONS.find((i) => i.id === selectedIcon);
		return found ? found.icon : IconCube;
	}, [selectedIcon]);

	// إضافة تصنيف مخصص جديد
	const handleAddCustomClassification = (
		e?: React.FormEvent | React.MouseEvent | React.KeyboardEvent,
	) => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		const trimmed = newClassificationInput.trim();
		if (!trimmed) return;
		if (!classificationsList.includes(trimmed)) {
			setClassificationsList((prev) => [...prev, trimmed]);
		}
		setClassification(trimmed);
		setNewClassificationInput("");

		// حفظ وتخزين التصنيف فورياً في الباك إند وقاعدة البيانات
		addClassificationMutation(trimmed);
	};

	// 3 حقول مطلوبة أساسية لإنشاء الفصل: اسم الفصل، فئة الفصل، والسعة القصوى
	const formProgress = useMemo(() => {
		const trimmedName = name.trim();
		const isNameFilled = trimmedName.length >= 2 && trimmedName.length <= 100;

		const trimmedCategory = category.trim();
		const isCategoryFilled =
			Boolean(trimmedCategory) &&
			CATEGORIES.includes(trimmedCategory as (typeof CATEGORIES)[number]);

		const capNum = Number(capacity);
		const isCapacityFilled =
			capacity !== "" &&
			!Number.isNaN(capNum) &&
			Number.isInteger(capNum) &&
			capNum >= 1 &&
			capNum <= 500;

		let filled = 0;
		if (isNameFilled) filled++;
		if (isCategoryFilled) filled++;
		if (isCapacityFilled) filled++;

		const requiredCount = 3;
		const progress = Math.round((filled / requiredCount) * 100);
		const isComplete = filled === requiredCount;

		return {
			filledCount: filled,
			requiredCount,
			progress,
			isComplete,
		};
	}, [name, category, capacity]);

	// 1. الانتقال إلى خطوة مراجعة تفاصيل الفصل قبل الإرسال مع التحقق الكامل
	const handleFormSubmitToReview = (e?: React.FormEvent) => {
		if (e) e.preventDefault();

		if (!formProgress.isComplete) {
			setTouched({
				name: true,
				category: true,
				capacity: true,
			});
			const validationErrors = validateForm();
			setErrors(validationErrors);
			if (validationErrors.name) {
				toast.error(validationErrors.name);
				document.getElementById("cls-name")?.focus();
			} else if (validationErrors.category) {
				toast.error(validationErrors.category);
			} else if (validationErrors.capacity) {
				toast.error(validationErrors.capacity);
				document.getElementById("cls-capacity")?.focus();
			}
			return;
		}

		setTouched({
			name: true,
			category: true,
			capacity: true,
		});

		const validationErrors = validateForm();
		setErrors(validationErrors);

		if (Object.keys(validationErrors).length > 0) {
			if (validationErrors.name) {
				toast.error(validationErrors.name);
				document.getElementById("cls-name")?.focus();
			} else if (validationErrors.category) {
				toast.error(validationErrors.category);
			} else if (validationErrors.capacity) {
				toast.error(validationErrors.capacity);
				document.getElementById("cls-capacity")?.focus();
			}
			return;
		}

		setIsReviewStep(true);
	};

	// 2. تأكيد الإرسال الفعلي بعد مراجعة البيانات
	const handleFinalSubmit = () => {
		const validationErrors = validateForm();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			setIsReviewStep(false);
			toast.error("يرجى التأكد من ملء جميع الحقول المطلوبة بشكل صحيح");
			return;
		}

		const trimmedName = name.trim();
		const trimmedCategory = category.trim();
		const validCapacity = Math.floor(Number(capacity));

		const combinedNotes = [
			description.trim() ? `الوصف: ${description.trim()}` : "",
			notes.trim() ? `الملاحظات: ${notes.trim()}` : "",
			branch ? `الفرع: ${branch}` : "",
			classification ? `التصنيف: ${classification}` : "",
			`رمز_الفصل: ${selectedIcon}`,
			`نوع_الرمز: ${selectedIconType}`,
			`لون_الفصل: ${selectedColor}`,
		]
			.filter(Boolean)
			.join("\n");

		const payload = {
			name: trimmedName,
			code: code.trim() || undefined,
			category: trimmedCategory,
			classification: classification || null,
			ageGroup: ageGroup || "8-12 سنة",
			learningMode: (learningMode as LearningMode) || "REMOTE",
			capacity: validCapacity,
			active: true,
			notes: combinedNotes || null,
			staffIds: selectedStaffIds,
		};

		if (isEdit && classroom) {
			updateClassroom(
				{ id: classroom.id, data: payload },
				{
					onSuccess: () => {
						if (notifyWhatsApp) {
							toast.success("تم إرسال إشعار عبر الواتساب بنجاح");
						}
						setIsReviewStep(false);
						onClose();
					},
				},
			);
		} else {
			createClassroom(payload, {
				onSuccess: () => {
					localStorage.removeItem("sanad_classroom_draft");
					setHasDraft(false);
					if (notifyWhatsApp) {
						toast.success("تم إرسال إشعار عبر الواتساب بنجاح");
					}
					setIsReviewStep(false);
					if (createAnother) {
						resetForm();
					} else {
						onClose();
					}
				},
			});
		}
	};

	useHotkey(
		"Mod+Enter",
		() => {
			if (isReviewStep) {
				handleFinalSubmit();
			} else if (formProgress.isComplete) {
				handleFormSubmitToReview();
			}
		},
		{
			enabled: open && !isPending && (isReviewStep || formProgress.isComplete),
		},
	);

	useHotkey("Mod+Alt+T", () => setTemplateMenuOpen((prev) => !prev), {
		enabled: open,
	});

	return (
		<>
			<Dialog
				open={open}
				onOpenChange={(val) => {
					if (!val) handleCloseAttempt();
				}}
			>
				<DialogContent
					dir="rtl"
					showCloseButton={false}
					className={cn(
						"w-full p-0 gap-0 overflow-hidden transition-all duration-300 ease-out",
						isReviewStep
							? "max-w-xl!"
							: isAgentOpen
								? "max-w-4xl! sm:max-w-5xl! lg:max-w-[1020px]!"
								: "max-w-xl!",
					)}
					onInteractOutside={(e) => {
						if (!isEdit && isFormDirty) {
							e.preventDefault();
							setShowDraftConfirm(true);
						}
					}}
					onEscapeKeyDown={(e) => {
						if (isReviewStep) {
							e.preventDefault();
							setIsReviewStep(false);
							return;
						}
						if (!isEdit && isFormDirty) {
							e.preventDefault();
							setShowDraftConfirm(true);
						}
					}}
				>
					<DialogDescription className="sr-only">
						{isEdit ? "نموذج تعديل بيانات الفصل الدراسي" : "نموذج إنشاء وإضافة فصل دراسي جديد"}
					</DialogDescription>

					{isReviewStep ? (
						<ClassroomReviewStep
							isEdit={isEdit}
							classroom={classroom}
							name={name}
							code={code}
							classification={classification}
							category={category}
							learningMode={learningMode}
							branch={branch}
							capacity={capacity}
							notes={notes}
							description={description}
							selectedStaffIds={selectedStaffIds}
							notifyWhatsApp={notifyWhatsApp}
							onNotifyWhatsAppChange={setNotifyWhatsApp}
							onBackToForm={() => setIsReviewStep(false)}
							onSubmit={handleFinalSubmit}
							isPending={isPending}
							onClose={handleCloseAttempt}
						/>
					) : (
						<div className="flex flex-col md:flex-row w-full items-stretch overflow-hidden max-h-[88vh]">
							{/* الجانب الأساسي: نموذج إنشاء/تعديل الفصل (يظهر على اليمين في نمط RTL) */}
							<div className="flex-1 min-w-[480px] sm:min-w-[520px] flex flex-col min-h-0">
								{/* 1. ترويسة النموذج الموحدة للمنصة (FormHeader) */}
								<FormHeader
									variant="dialog"
									title={isEdit ? "تعديل بيانات الفصل" : "أنشئ فصل جديد"}
									identity={
										isEdit && classroom ? { name: classroom.name, code: classroom.code } : null
									}
									progress={formProgress}
									onClose={handleCloseAttempt}
									actions={
										<Button
											type="button"
											variant="ghost"
											size="icon-sm"
											onClick={() => setIsAgentOpen((prev) => !prev)}
											className="text-muted-foreground hover:text-foreground hidden sm:flex cursor-pointer"
											title={isAgentOpen ? "إخفاء المساعد الذكي" : "توسيع وعرض المساعد الذكي"}
										>
											<IconMaximize className="size-3.5" />
										</Button>
									}
									titleActions={
										<div className="flex items-center gap-1.5 ms-2">
											{/* زر القوالب الجاهزة */}
											<DropdownMenu
												dir="rtl"
												open={templateMenuOpen}
												onOpenChange={setTemplateMenuOpen}
												modal={false}
											>
												<DropdownMenuTrigger asChild>
													<Button
														type="button"
														variant="outline"
														size="sm"
														className="h-7 px-3 text-xs gap-1.5 rounded-full border border-border bg-white dark:bg-card hover:bg-muted font-medium cursor-pointer"
													>
														<IconCopy className="size-3.5" />
														<span>قالب</span>
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													align="start"
													className="w-64! min-w-64 p-1.5 rounded-xl border border-border shadow-md bg-popover"
													onCloseAutoFocus={(e) => e.preventDefault()}
												>
													{/* حقل البحث العلوي مع اختصار لوحة المفاتيح */}
													<div className="flex items-center justify-between gap-1.5 px-2 py-1 mb-1 border-b border-border/60">
														<input
															value={templateSearch}
															onChange={(e) => setTemplateSearch(e.target.value)}
															placeholder="تطبيق قالب مشروع..."
															className="w-full text-xs bg-transparent outline-none placeholder:text-muted-foreground/60 text-right"
															onClick={(e) => e.stopPropagation()}
															onKeyDown={(e) => e.stopPropagation()}
														/>
													</div>

													{/* قائمة الخيارات */}
													<div className="space-y-0.5">
														{/* خيار بدون قالب */}
														<DropdownMenuItem
															onClick={() => handleSelectTemplate(null)}
															className={cn(
																"w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs cursor-pointer transition-colors text-right",
																selectedTemplateId === "none" || !selectedTemplateId
																	? "bg-muted font-medium text-foreground"
																	: "text-foreground",
															)}
														>
															<div className="flex items-center gap-2">
																<IconScan className="size-4 text-foreground/80 shrink-0" />
																<span className="text-xs">بدون قالب</span>
															</div>
															{(selectedTemplateId === "none" || !selectedTemplateId) && (
																<IconCheck className="size-3.5 text-foreground shrink-0" />
															)}
														</DropdownMenuItem>

														{/* قائمة القوالب */}
														{filteredTemplates.map((tpl) => {
															const isSelected = selectedTemplateId === tpl.id;
															const IconComp = tpl.Icon;
															return (
																<DropdownMenuItem
																	key={tpl.id}
																	onClick={() => handleSelectTemplate(tpl)}
																	className={cn(
																		"w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs cursor-pointer transition-colors text-right",
																		isSelected
																			? "bg-muted font-medium text-foreground"
																			: "text-foreground",
																	)}
																>
																	<div className="flex items-center gap-2">
																		{IconComp ? (
																			<IconComp className="size-4 text-foreground/80 shrink-0" />
																		) : (
																			<span className="size-4 shrink-0" />
																		)}
																		<span className="text-xs">{tpl.title}</span>
																	</div>
																	{isSelected && (
																		<IconCheck className="size-3.5 text-foreground shrink-0" />
																	)}
																</DropdownMenuItem>
															);
														})}
													</div>
												</DropdownMenuContent>
											</DropdownMenu>

											{/* زر أنشئ مع سند */}
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() => {
													setIsAgentOpen((prev) => !prev);
												}}
												className={cn(
													"h-7 px-2.5 text-xs gap-1.5 rounded-full border border-border bg-white dark:bg-card hover:bg-muted font-medium cursor-pointer flex items-center shrink-0 transition-all",
													isAgentOpen &&
														"bg-primary/10 border-primary/40 text-primary font-semibold shadow-2xs",
												)}
												title="أنشئ مع سند"
												aria-label="أنشئ مع سند"
											>
												<SanadLogo
													iconOnly
													className="h-3.5 w-auto shrink-0"
												/>
												<span className="whitespace-nowrap">أنشئ مع سند</span>
											</Button>
										</div>
									}
								/>

								{/* 2. جسم النموذج */}
								<form
									onSubmit={handleFormSubmitToReview}
									className="flex flex-col flex-1 min-h-0 overflow-hidden"
								>
									<div className="space-y-4 p-5 flex-1 min-h-0 overflow-y-auto">
										{/* شريط استعادة المسودة إن وُجدت */}
										{hasDraft && !isEdit && (
											<div className="flex items-center justify-between gap-2 rounded-lg border border-primary/25 bg-primary/5 px-3.5 py-2 text-xs text-primary transition-colors">
												<div className="flex items-center gap-2">
													<IconSparkles className="size-4 shrink-0 text-primary" />
													<span>يوجد مسودة غير مكتملة محفوظة مسبقاً.</span>
												</div>
												<div className="flex items-center gap-1.5 shrink-0">
													<Button
														type="button"
														variant="outline"
														size="sm"
														onClick={handleRestoreDraft}
														className="h-6.5 text-[11px] px-2.5 font-medium border-primary/30 hover:bg-primary/10 text-primary cursor-pointer"
													>
														استعادة المسودة
													</Button>
													<Button
														type="button"
														variant="ghost"
														size="sm"
														onClick={handleClearDraft}
														className="h-6.5 text-[11px] px-2 text-muted-foreground hover:text-destructive cursor-pointer"
													>
														مسح
													</Button>
												</div>
											</div>
										)}
										{/* الصف الأول: المعرّف (يمين) + زر الأيقونة (وسط) + اسم الفصل (يسار) — جميع الحقول على نفس السطر أفقياً بدقة مطلقة */}
										<div className="w-full space-y-2">
											{/* 1. صف التسميات والعناوين */}
											<div className="flex items-center gap-2.5 w-full">
												{/* عنوان المعرّف (في اليمين) */}
												<div className="w-36 sm:w-44 shrink-0">
													<FieldLabel info="المعرّف الكودي الخاص بالفصل (يُولد تلقائياً إن ترك فارغاً)">
														<Label
															htmlFor="cls-code"
															className="text-xs font-semibold flex items-center gap-1.5"
														>
															<span>المعرّف</span>
															<span className="text-[10px] text-muted-foreground font-normal">
																يُولد تلقائياً
															</span>
														</Label>
													</FieldLabel>
												</div>

												{/* فراغ توازن للأيقونة (في الوسط) */}
												<div
													className="w-10 shrink-0"
													aria-hidden="true"
												/>

												{/* عنوان اسم الفصل (في اليسار) */}
												<div className="flex-1 min-w-0">
													<FieldLabel
														required
														info="أدخل اسماً واضحاً ومميزاً للفصل الدراسي"
													>
														<Label
															htmlFor="cls-name"
															className={cn(
																"text-xs font-semibold",
																touched.name && errors.name && "text-destructive",
															)}
														>
															اسم الفصل
														</Label>
													</FieldLabel>
												</div>
											</div>

											{/* 2. صف الحقول والأيقونة على نفس السطر أفقياً تماماً وبنفس الارتفاع (h-10) */}
											<div className="flex items-center gap-2.5 w-full">
												{/* حقل المعرّف */}
												<div className="w-36 sm:w-44 shrink-0">
													<Input
														id="cls-code"
														value={code}
														onChange={(e) => setCode(e.target.value)}
														placeholder="مثال: PR-02"
														className="w-full h-10 text-xs font-mono text-center sm:text-right bg-muted/40"
													/>
												</div>

												{/* زر الأيقونة المنبثق لاختيار رمز ولون الفصل */}
												<div className="shrink-0 w-10 flex items-center justify-center">
													<Popover
														modal={false}
														open={iconPickerOpen}
														onOpenChange={setIconPickerOpen}
													>
														<PopoverTrigger asChild>
															<button
																type="button"
																className={cn(
																	"size-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95",
																	currentColorConfig.bg,
																)}
																title="اختر رمز ولون الفصل"
															>
																{selectedIconType === "emoji" ? (
																	<span className="text-lg leading-none select-none">
																		{selectedIcon}
																	</span>
																) : (
																	<ActiveIconComponent className="size-5" />
																)}
															</button>
														</PopoverTrigger>

														<PopoverContent
															className="w-[360px] sm:w-[380px] p-3 shadow-xl rounded-xl border bg-popover"
															align="start"
															side="bottom"
															sideOffset={6}
															dir="rtl"
															onOpenAutoFocus={(e) => e.preventDefault()}
															onCloseAutoFocus={(e) => e.preventDefault()}
														>
															{/* تبويبات الأيقونات / الإيموجي */}
															<div className="flex border-b pb-2 mb-2.5">
																<button
																	type="button"
																	onClick={() => setActiveIconTab("icons")}
																	className={cn(
																		"flex-1 text-center text-xs pb-1.5 transition-colors font-medium border-b-2 -mb-2.5",
																		activeIconTab === "icons"
																			? "border-primary text-primary font-semibold"
																			: "border-transparent text-muted-foreground hover:text-foreground",
																	)}
																>
																	الأيقونات
																</button>
																<button
																	type="button"
																	onClick={() => setActiveIconTab("emoji")}
																	className={cn(
																		"flex-1 text-center text-xs pb-1.5 transition-colors font-medium border-b-2 -mb-2.5",
																		activeIconTab === "emoji"
																			? "border-primary text-primary font-semibold"
																			: "border-transparent text-muted-foreground hover:text-foreground",
																	)}
																>
																	الإيموجي
																</button>
															</div>

															{/* شريط اختيار لون الأيقونة */}
															<div className="flex items-center gap-1.5 py-1 px-0.5 overflow-x-auto no-scrollbar">
																{/* دائرة تدرج ألوان */}
																<button
																	type="button"
																	onClick={() => setSelectedColor("blue")}
																	className="size-5.5 rounded-full bg-gradient-to-tr from-pink-500 via-amber-400 to-indigo-500 shrink-0 border border-border/50 shadow-2xs transition-transform hover:scale-110"
																	title="تدرج ألوان"
																/>
																<div className="h-4 w-px bg-border shrink-0 mx-0.5" />

																{/* دوائر الألوان المعتمدة */}
																{COLOR_OPTIONS.map((c) => {
																	const isSelected = selectedColor === c.id;
																	return (
																		<button
																			key={c.id}
																			type="button"
																			onClick={() => setSelectedColor(c.id)}
																			style={{ backgroundColor: c.hex }}
																			className={cn(
																				"size-5.5 rounded-full shrink-0 flex items-center justify-center transition-transform hover:scale-110 shadow-2xs",
																				isSelected && "ring-2 ring-primary ring-offset-1",
																			)}
																			title={c.label}
																		>
																			{isSelected && (
																				<IconCheck className="size-3 text-white stroke-[3]" />
																			)}
																		</button>
																	);
																})}
															</div>

															{/* حقل البحث */}
															<div className="relative my-2">
																<Input
																	value={iconSearch}
																	onChange={(e) => setIconSearch(e.target.value)}
																	placeholder={
																		activeIconTab === "icons"
																			? "ابحث في الأيقونات..."
																			: "ابحث في الإيموجي..."
																	}
																	className="h-8 text-xs text-right pr-7 pl-7 bg-muted/20"
																/>
																<IconSearch className="size-3.5 text-muted-foreground absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
																{iconSearch && (
																	<button
																		type="button"
																		onClick={() => setIconSearch("")}
																		className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
																	>
																		<IconX className="size-3" />
																	</button>
																)}
															</div>

															{/* شبكة الأيقونات أو الإيموجي */}
															<div className="max-h-52 overflow-y-auto p-1.5 border rounded-lg bg-muted/20">
																{activeIconTab === "icons" ? (
																	<div className="grid grid-cols-8 gap-1.5">
																		{filteredIcons.map((item) => {
																			const IconComp = item.icon;
																			const isSelected =
																				selectedIcon === item.id &&
																				selectedIconType === "icon";
																			return (
																				<button
																					key={item.id}
																					type="button"
																					onClick={() => {
																						setSelectedIcon(item.id);
																						setSelectedIconType("icon");
																						setIconPickerOpen(false);
																					}}
																					className={cn(
																						"size-7.5 rounded-md flex items-center justify-center transition-all text-muted-foreground hover:text-foreground hover:bg-background shadow-2xs",
																						isSelected &&
																							"bg-primary/10 text-primary border border-primary/30",
																					)}
																					title={item.name}
																				>
																					<IconComp className="size-4" />
																				</button>
																			);
																		})}
																	</div>
																) : (
																	<div className="grid grid-cols-8 gap-1.5">
																		{filteredEmojis.map((emoji) => {
																			const isSelected =
																				selectedIcon === emoji && selectedIconType === "emoji";
																			return (
																				<button
																					key={emoji}
																					type="button"
																					onClick={() => {
																						setSelectedIcon(emoji);
																						setSelectedIconType("emoji");
																						setIconPickerOpen(false);
																					}}
																					className={cn(
																						"size-7.5 rounded-md flex items-center justify-center text-sm transition-all hover:bg-background hover:scale-110",
																						isSelected &&
																							"bg-primary/15 border border-primary/30",
																					)}
																				>
																					{emoji}
																				</button>
																			);
																		})}
																	</div>
																)}
															</div>
														</PopoverContent>
													</Popover>
												</div>

												{/* حقل اسم الفصل (في اليسار مع flex-1 ليأخذ بقية المساحة وبنفس ارتفاع h-10) */}
												<div className="flex-1 min-w-0">
													<Input
														id="cls-name"
														value={name}
														onChange={(e) => {
															setName(e.target.value);
															if (touched.name) validateField("name", e.target.value);
														}}
														onBlur={() => {
															setTouched((prev) => ({ ...prev, name: true }));
															validateField("name", name);
														}}
														placeholder="للمبرمجين الصغار"
														aria-invalid={Boolean(touched.name && errors.name)}
														className={cn(
															"w-full h-10 text-xs text-right transition-colors",
															touched.name &&
																errors.name &&
																"border-destructive focus-visible:ring-destructive",
														)}
													/>
												</div>
											</div>

											{/* 3. رسالة خطأ اسم الفصل إن وُجدت — أسفل الحقل مباشرة وبدون أي تأثير على محاذاة الحقول */}
											{touched.name && errors.name && (
												<div className="flex items-center gap-2.5 w-full">
													<div
														className="w-36 sm:w-44 shrink-0"
														aria-hidden="true"
													/>
													<div
														className="w-10 shrink-0"
														aria-hidden="true"
													/>
													<div className="flex-1 min-w-0">
														<p className="text-[11px] text-destructive font-medium">
															{errors.name}
														</p>
													</div>
												</div>
											)}
										</div>

										{/* حقل وصف الفصل — كامل العرض */}
										<Field>
											<FieldLabel info="وصف توضيحي لطبيعة الفصل الدراسي وأهدافه">
												<Label
													htmlFor="cls-desc"
													className="text-xs font-semibold"
												>
													وصف الفصل
												</Label>
											</FieldLabel>
											<Textarea
												id="cls-desc"
												value={description}
												onChange={(e) => setDescription(e.target.value)}
												placeholder="أضف وصف..."
												rows={3}
												className="w-full text-xs text-right resize-none"
											/>
										</Field>

										{/* حقل فئة الفصل — كامل العرض */}
										<Field data-invalid={Boolean(touched.category && errors.category)}>
											<FieldLabel
												required
												info="حدد فئة الفصل: مختلط أو بنين أو بنات"
											>
												<Label
													className={cn(
														"text-xs font-semibold",
														touched.category && errors.category && "text-destructive",
													)}
												>
													فئة الفصل
												</Label>
											</FieldLabel>
											<Select
												value={category || undefined}
												onValueChange={(val) => {
													setCategory(val);
													setTouched((prev) => ({ ...prev, category: true }));
													validateField("category", val);
												}}
												dir="rtl"
											>
												<SelectTrigger
													aria-invalid={Boolean(touched.category && errors.category)}
													className={cn(
														"w-full h-9 text-xs text-right transition-colors",
														touched.category &&
															errors.category &&
															"border-destructive focus-visible:ring-destructive",
													)}
												>
													<SelectValue placeholder="حدد فئة الفصل (مختلط / بنين / بنات)" />
												</SelectTrigger>
												<SelectContent dir="rtl">
													{CATEGORIES.map((cat) => (
														<SelectItem
															key={cat}
															value={cat}
															className="text-xs"
														>
															{cat}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											{touched.category && errors.category && (
												<FieldError className="text-[11px] mt-1 text-destructive font-medium">
													{errors.category}
												</FieldError>
											)}
										</Field>

										{/* حقل السعة القصوى — كامل العرض */}
										<Field data-invalid={Boolean(touched.capacity && errors.capacity)}>
											<FieldLabel
												required
												info="الحد الأقصى لعدد الطلاب المسموح بانضمامهم (1 على الأقل)"
											>
												<Label
													htmlFor="cls-capacity"
													className={cn(
														"text-xs font-semibold",
														touched.capacity && errors.capacity && "text-destructive",
													)}
												>
													السعة القصوى
												</Label>
											</FieldLabel>
											<Input
												id="cls-capacity"
												type="number"
												min={1}
												max={500}
												value={capacity}
												onChange={(e) => {
													setCapacity(e.target.value);
													if (touched.capacity) validateField("capacity", e.target.value);
												}}
												onBlur={() => {
													setTouched((prev) => ({ ...prev, capacity: true }));
													validateField("capacity", capacity);
												}}
												placeholder="00"
												aria-invalid={Boolean(touched.capacity && errors.capacity)}
												className={cn(
													"w-full h-9 text-xs font-mono text-right transition-colors",
													touched.capacity &&
														errors.capacity &&
														"border-destructive focus-visible:ring-destructive",
												)}
											/>
											{touched.capacity && errors.capacity && (
												<FieldError className="text-[11px] mt-1 text-destructive font-medium">
													{errors.capacity}
												</FieldError>
											)}
										</Field>

										{/* محرر الملاحظات المتقدم والموحّد للمنصة (RichNotesEditor) — بورد فوق ومفيش أي بوردر يمين ولا شمال ولا تحت */}
										<div className="-mx-5 pt-1">
											<RichNotesEditor
												value={notes}
												onChange={setNotes}
												placeholder="أضف ملاحظات أو أهداف أو تفاصيل لهذا الفصل..."
												variant="border-top-only"
												minHeight={90}
											/>
										</div>
									</div>

									{/* 3. شريط التحكم والإجراءات السفلي الثابت في البوب أب (Fixed Bottom Section) */}
									<div className="shrink-0 bg-background border-t border-border flex flex-col z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
										{/* أ) رسالة التحذير — تأخذ العرض الكامل للبوب أب من الحافة للحافة */}
										{showNotice && (
											<div className="w-full bg-[#FFFBEB] dark:bg-amber-950/40 border-b border-amber-200/80 dark:border-amber-900/40 px-5 py-2.5 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
												<div className="flex items-center gap-1.5 font-medium">
													<span className="font-bold">تنبيه:</span>
													<span>يمكنك تخطي الخطوات التالية وإضافتها بعد إنشاء الفصل</span>
												</div>
												<button
													type="button"
													onClick={() => setShowNotice(false)}
													className="text-amber-700/80 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-200 p-0.5 rounded transition-colors cursor-pointer"
													title="إغلاق التنبيه"
												>
													<IconX className="size-4" />
												</button>
											</div>
										)}

										{/* ب) شريط أزرار الخطوات الإضافية (الدروب داونز الأربعة + زر النقاط) */}
										<div className="flex items-center gap-2 flex-wrap justify-start px-5 py-2.5 bg-background">
											{/* 1. الفئة العمرية */}
											<DropdownMenu
												dir="rtl"
												modal={false}
											>
												<DropdownMenuTrigger asChild>
													<Button
														type="button"
														variant={ageGroup ? "secondary" : "outline"}
														size="sm"
														className="gap-1.5"
													>
														<IconCalendarPlus className="size-3.5 shrink-0" />
														<span>{ageGroup || "الفئة العمرية"}</span>
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													align="end"
													className="w-44! min-w-44"
												>
													<DropdownMenuLabel className="px-2 py-1 text-[11px] font-semibold text-muted-foreground">
														اختر الفئة العمرية
													</DropdownMenuLabel>
													<DropdownMenuSeparator />
													{AGE_GROUPS.map((ag) => (
														<DropdownMenuItem
															key={ag}
															onClick={() => setAgeGroup(ag)}
															className="cursor-pointer text-xs flex items-center justify-between"
														>
															<span>{ag}</span>
															{ageGroup === ag && (
																<IconCheck className="size-3.5 text-primary" />
															)}
														</DropdownMenuItem>
													))}
													{ageGroup && (
														<>
															<DropdownMenuSeparator />
															<DropdownMenuItem
																onClick={() => setAgeGroup("")}
																className="cursor-pointer text-xs text-destructive"
															>
																إلغاء التحديد
															</DropdownMenuItem>
														</>
													)}
												</DropdownMenuContent>
											</DropdownMenu>

											{/* 2. الفرع */}
											<DropdownMenu
												dir="rtl"
												modal={false}
											>
												<DropdownMenuTrigger asChild>
													<Button
														type="button"
														variant={branch ? "secondary" : "outline"}
														size="sm"
														className="gap-1.5"
													>
														<div className="size-3.5 rounded-full bg-muted-foreground/30 flex items-center justify-center shrink-0">
															<IconMapPinFilled className="size-2 text-foreground" />
														</div>
														<span>{branch || "الفرع"}</span>
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													align="end"
													className="w-48! min-w-48"
												>
													<DropdownMenuLabel className="px-2 py-1 text-[11px] font-semibold text-muted-foreground">
														اختر الفرع
													</DropdownMenuLabel>
													<DropdownMenuSeparator />
													{branches.length > 0
														? branches.map((b) => (
																<DropdownMenuItem
																	key={b.id}
																	onClick={() => setBranch(b.name)}
																	className="cursor-pointer text-xs flex items-center justify-between"
																>
																	<span>{b.name}</span>
																	{branch === b.name && (
																		<IconCheck className="size-3.5 text-primary" />
																	)}
																</DropdownMenuItem>
															))
														: [
																"الفرع الرئيسي",
																"فرع التجمع",
																"فرع المعادي",
																"عن بعد (أونلاين)",
															].map((bName) => (
																<DropdownMenuItem
																	key={bName}
																	onClick={() => setBranch(bName)}
																	className="cursor-pointer text-xs flex items-center justify-between"
																>
																	<span>{bName}</span>
																	{branch === bName && (
																		<IconCheck className="size-3.5 text-primary" />
																	)}
																</DropdownMenuItem>
															))}
													{branch && (
														<>
															<DropdownMenuSeparator />
															<DropdownMenuItem
																onClick={() => setBranch("")}
																className="cursor-pointer text-xs text-destructive"
															>
																إلغاء التحديد
															</DropdownMenuItem>
														</>
													)}
												</DropdownMenuContent>
											</DropdownMenu>

											{/* 3. التصنيف (مع إمكانية إضافة تصنيف مخصص داخل القائمة) */}
											<DropdownMenu
												dir="rtl"
												modal={false}
											>
												<DropdownMenuTrigger asChild>
													<Button
														type="button"
														variant={classification ? "secondary" : "outline"}
														size="sm"
														className="gap-1.5"
													>
														<IconCircle className="size-3.5 text-muted-foreground/70 shrink-0" />
														<span>{classification || "التصنيف"}</span>
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													align="end"
													className="w-56! min-w-56 p-1.5"
												>
													<DropdownMenuLabel className="px-2 py-1 text-[11px] font-semibold text-muted-foreground">
														اختر أو أضف تصنيف
													</DropdownMenuLabel>

													{/* حقل تخصيص وإضافة تصنيف جديد */}
													{/* biome-ignore lint/a11y/noStaticElementInteractions: stops dropdown closing on click */}
													<div
														className="p-1 mb-1.5 border-b"
														onClickCapture={(e) => e.stopPropagation()}
														onKeyDownCapture={(e) => e.stopPropagation()}
														onPointerDownCapture={(e) => e.stopPropagation()}
														onMouseDown={(e) => e.stopPropagation()}
													>
														<div className="flex items-center gap-1.5">
															<Input
																value={newClassificationInput}
																onChange={(e) => setNewClassificationInput(e.target.value)}
																onKeyDown={(e) => {
																	e.stopPropagation();
																	if (e.key === "Enter") {
																		e.preventDefault();
																		handleAddCustomClassification(e);
																	}
																}}
																placeholder="تصنيف جديد..."
																className="h-7 text-xs px-2 flex-1"
															/>
															<Button
																type="button"
																size="sm"
																variant="secondary"
																onPointerDown={(e) => {
																	e.preventDefault();
																	e.stopPropagation();
																}}
																onMouseDown={(e) => {
																	e.preventDefault();
																	e.stopPropagation();
																	handleAddCustomClassification(e);
																}}
																onClick={handleAddCustomClassification}
																disabled={
																	!newClassificationInput.trim() || isAddingClassification
																}
																className="h-7 px-2 text-xs shrink-0 gap-1 cursor-pointer"
															>
																{isAddingClassification ? (
																	<Spinner className="size-3" />
																) : (
																	<IconPlus className="size-3" />
																)}
																<span>إضافة</span>
															</Button>
														</div>
													</div>

													{/* قائمة التصنيفات المتاحة */}
													<div className="max-h-48 overflow-y-auto space-y-0.5">
														{isClassificationsLoading && mergedClassifications.length === 0 ? (
															<div className="py-2 text-center text-xs text-muted-foreground">
																جاري التحميل...
															</div>
														) : (
															mergedClassifications.map((item) => {
																const isCustom = !DEFAULT_CLASSIFICATIONS.includes(item);
																return (
																	// biome-ignore lint/a11y/noStaticElementInteractions: dropdown option
																	// biome-ignore lint/a11y/useKeyWithClickEvents: dropdown option
																	<div
																		key={item}
																		onClick={() => setClassification(item)}
																		className={cn(
																			"relative flex cursor-pointer select-none items-center justify-between rounded-sm px-2 py-1.5 text-xs outline-none transition-colors hover:bg-accent hover:text-accent-foreground group",
																			classification === item && "bg-accent/60 font-medium",
																		)}
																	>
																		<div className="flex items-center gap-1.5 min-w-0">
																			<span>{item}</span>
																			{classification === item && (
																				<IconCheck className="size-3.5 text-primary shrink-0" />
																			)}
																		</div>

																		{isCustom && (
																			<button
																				type="button"
																				title="حذف هذا التصنيف"
																				onPointerDown={(e) => {
																					e.preventDefault();
																					e.stopPropagation();
																				}}
																				onMouseDown={(e) => {
																					e.preventDefault();
																					e.stopPropagation();
																				}}
																				onClick={(e) => {
																					e.preventDefault();
																					e.stopPropagation();
																					if (classification === item) setClassification("");
																					setClassificationsList((prev) =>
																						prev.filter((c) => c !== item),
																					);
																					deleteClassificationMutation(item);
																				}}
																				className="opacity-50 hover:opacity-100 hover:text-destructive p-0.5 rounded transition-opacity"
																			>
																				<IconX className="size-3.5" />
																			</button>
																		)}
																	</div>
																);
															})
														)}
													</div>

													{classification && (
														<>
															<DropdownMenuSeparator />
															<DropdownMenuItem
																onClick={() => setClassification("")}
																className="cursor-pointer text-xs text-destructive"
															>
																إلغاء التحديد
															</DropdownMenuItem>
														</>
													)}
												</DropdownMenuContent>
											</DropdownMenu>

											{/* 4. نمط التعلم */}
											<DropdownMenu
												dir="rtl"
												modal={false}
											>
												<DropdownMenuTrigger asChild>
													<Button
														type="button"
														variant={learningMode ? "secondary" : "outline"}
														size="sm"
														className="gap-1.5"
													>
														<span className="text-[10px] text-muted-foreground/60 tracking-tighter">
															•••
														</span>
														<span>
															{learningMode
																? LEARNING_MODES[learningMode]?.label
																: "نمط التعلم"}
														</span>
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													align="end"
													className="w-44! min-w-44"
												>
													<DropdownMenuLabel className="px-2 py-1 text-[11px] font-semibold text-muted-foreground">
														اختر نمط التعلم
													</DropdownMenuLabel>
													<DropdownMenuSeparator />
													{(
														Object.entries(LEARNING_MODES) as [
															LearningMode,
															{ label: string },
														][]
													).map(([mode, config]) => (
														<DropdownMenuItem
															key={mode}
															onClick={() => setLearningMode(mode)}
															className="cursor-pointer text-xs flex items-center justify-between"
														>
															<span>{config.label}</span>
															{learningMode === mode && (
																<IconCheck className="size-3.5 text-primary" />
															)}
														</DropdownMenuItem>
													))}
													{learningMode && (
														<>
															<DropdownMenuSeparator />
															<DropdownMenuItem
																onClick={() => setLearningMode("")}
																className="cursor-pointer text-xs text-destructive"
															>
																إلغاء التحديد
															</DropdownMenuItem>
														</>
													)}
												</DropdownMenuContent>
											</DropdownMenu>

											{/* 5. زر النقاط الإضافية (...) */}
											<DropdownMenu
												dir="rtl"
												modal={false}
											>
												<DropdownMenuTrigger asChild>
													<Button
														type="button"
														variant="outline"
														size="icon-sm"
														title="خيارات إضافية"
													>
														<IconDots className="size-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													align="start"
													className="w-44! min-w-44"
												>
													<DropdownMenuItem
														onClick={() => setIsStaffSheetOpen(true)}
														className="cursor-pointer text-xs flex items-center justify-between"
													>
														<span>تعيين موظف</span>
														{selectedStaffIds.length > 0 && (
															<span className="text-[10px] bg-primary/10 text-primary font-medium px-1.5 py-0.5 rounded">
																{selectedStaffIds.length} محدد
															</span>
														)}
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => {
															setAgeGroup("");
															setBranch("");
															setClassification("");
															setLearningMode("");
															setSelectedStaffIds([]);
														}}
														className="cursor-pointer text-xs text-destructive"
													>
														إعادة ضبط الخيارات
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>

										{/* ج) شريط الإجراءات والفوتر الموحد للمنصة (FormFooter) */}
										<FormFooter
											continueAdding={createAnother}
											onContinueAddingChange={!isEdit ? setCreateAnother : undefined}
											disabled={isPending}
											showShortcut={true}
											extra={
												<div className="flex items-center gap-2 text-xs text-muted-foreground">
													<IconBrandWhatsapp className="size-4 text-emerald-600" />
													<span>إشعار عبر الواتساب</span>
													<Switch
														checked={notifyWhatsApp}
														onCheckedChange={setNotifyWhatsApp}
														disabled={isPending}
													/>
												</div>
											}
										>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={handleCloseAttempt}
												disabled={isPending}
											>
												إلغاء
											</Button>

											<Button
												type="submit"
												size="sm"
												disabled={isPending || !formProgress.isComplete}
												className={cn(
													"gap-1.5 transition-all",
													!formProgress.isComplete
														? "opacity-50 cursor-not-allowed"
														: "cursor-pointer font-semibold shadow-xs",
												)}
												title={
													!formProgress.isComplete
														? `يرجى إكمال الحقول المطلوبة (${formProgress.filledCount} من ${formProgress.requiredCount})`
														: undefined
												}
											>
												{isPending && <Spinner className="size-3.5" />}
												<span>{isEdit ? "حفظ التعديلات" : "إنشاء الفصل"}</span>
											</Button>
										</FormFooter>
									</div>
								</form>
							</div>

							{/* الجانب الأيسر (في RTL): لوحة سند للذكاء الاصطناعي (مطابقة تماماً للصورة) */}
							{isAgentOpen && (
								<ClassroomAgentPanel
									onClose={() => setIsAgentOpen(false)}
									onApplyData={(data) => {
										if (data.name !== undefined) {
											setName(data.name);
											setErrors((prev) => ({ ...prev, name: undefined }));
										}
										if (data.code !== undefined) setCode(data.code);
										if (data.description !== undefined) setDescription(data.description);
										if (data.category !== undefined) {
											setCategory(data.category);
											setErrors((prev) => ({ ...prev, category: undefined }));
										}
										if (data.capacity !== undefined) {
											setCapacity(data.capacity);
											setErrors((prev) => ({ ...prev, capacity: undefined }));
										}
										if (data.notes !== undefined) setNotes(data.notes);
										if (data.ageGroup !== undefined) setAgeGroup(data.ageGroup);
										if (data.branch !== undefined) setBranch(data.branch);
										if (data.classification !== undefined)
											setClassification(data.classification);
										if (data.learningMode !== undefined) setLearningMode(data.learningMode);
										if (data.selectedIcon !== undefined) setSelectedIcon(data.selectedIcon);
										if (data.selectedIconType !== undefined)
											setSelectedIconType(data.selectedIconType);
										if (data.selectedColor !== undefined) setSelectedColor(data.selectedColor);
									}}
									currentValues={{
										name,
										code,
										description,
										category,
										capacity,
										notes,
										ageGroup,
										branch,
										classification,
										learningMode,
										selectedIcon,
										selectedIconType,
										selectedColor,
									}}
								/>
							)}
						</div>
					)}
				</DialogContent>
			</Dialog>

			{/* سايد شيت تعيين وتعديل الموظفين المطابق للتصميم الموحد */}
			<AssignStaffSheet
				open={isStaffSheetOpen}
				onOpenChange={setIsStaffSheetOpen}
				classroom={classroom}
				classroomName={name || classroom?.name}
				title={isEdit ? "تعيين موظفي الفصل" : "تعيين موظفي الفصل الجديد"}
				initialSelectedStaffIds={selectedStaffIds}
				onSaveStaff={(ids) => {
					setSelectedStaffIds(ids);
					setIsStaffSheetOpen(false);
				}}
			/>

			{/* نافذة التأكيد لحفظ المسودة عند الإغلاق أو النقر خارج الحوار */}
			<SaveDraftConfirmDialog
				open={showDraftConfirm}
				onSave={handleSaveDraft}
				onDiscard={handleDiscardDraft}
				onCancel={handleCancelDraftConfirm}
			/>
		</>
	);
}
