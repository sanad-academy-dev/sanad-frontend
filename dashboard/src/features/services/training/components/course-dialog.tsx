import {
	IconAlertCircle,
	IconArrowLeft,
	IconArrowRight,
	IconArrowsDiagonal,
	IconArrowsDiagonalMinimize2,
	IconAtom,
	IconAward,
	IconBook,
	IconBooks,
	IconBrain,
	IconBrandWhatsapp,
	IconCheck,
	IconClock,
	IconCode,
	IconCopy,
	IconCpu,
	IconCube,
	IconDots,
	IconGlobe,
	IconHeart,
	IconPlus,
	IconRobot,
	IconRocket,
	IconRoute,
	IconScan,
	IconSchool,
	IconSearch,
	IconSparkles,
	IconStar,
	IconSun,
	IconUsers,
	IconX,
} from "@tabler/icons-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { DiscardConfirmDialog } from "@/components/common/discard-confirm-dialog";
import { FieldLabel } from "@/components/common/field-label";
import { FormFooter } from "@/components/common/form-footer";
import { FormHeader } from "@/components/common/form-header";
import { RichNotesEditor } from "@/components/common/rich-notes-editor";
import { SanadLogo } from "@/components/common/sanad-logo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAcademicStageOptions } from "@/features/services/classrooms/hooks/use-classrooms";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { useAcademicStages } from "@/features/settings/academic-stages/hooks/use-academic-stages";
import { useTrackClassifications } from "@/features/settings/tracks/hooks/use-track-classifications";
import { cn } from "@/lib/utils";
import type { CourseLocationMode, CourseType } from "@/server/training/training.type";
import { useAssignTime } from "../hooks/use-assign-time";
import {
	useCourse,
	useCreateCourse,
	useSetTrainers,
	useUpdateCourse,
} from "../hooks/use-courses";
import { AiCourseSheet } from "./ai-course-sheet";
import { AssignLearnersStep } from "./assign-learners-step";
import { AssignTrackStaffSheet } from "./assign-track-staff-sheet";
import { CourseBuilderStep } from "./course-builder-step";
import { CourseCompletionStep } from "./course-completion-step";
import { CourseSheetStepper } from "./course-sheet-stepper";
import {
	CourseTimeSection,
	type CourseTimeValue,
	isCourseTimeValid,
	LOCAL_TZ,
} from "./course-time-section";

// تجريد الملاحظات من أي وسوم داخلية لحفظ المرحلة أو البيانات لكي لا تظهر للمستخدم كنص مشوه
const stripSystemTags = (text?: string | null): string => {
	if (!text) return "";
	return text
		.replace(/<p>\s*\[courses:[^\]]*\]\s*<\/p>/gi, "")
		.replace(/<div>\s*\[courses:[^\]]*\]\s*<\/div>/gi, "")
		.replace(/\[courses:[^\]]*\]/gi, "")
		.replace(/(?:\[(?:المرحلة|stage):[^\]]+\]|\n?(?:المرحلة|stage):[^\n]+)/gi, "")
		.replace(/(?:\[(?:notes|ملاحظات):[\s\S]*?\])/gi, "")
		.replace(/(?:\[icon:[^\]]+\])/gi, "")
		.replace(/(?:\[color:[^\]]+\])/gi, "")
		.replace(/&#91;courses:[^&]*&#93;/gi, "")
		.trim();
};

const extractSystemTag = (text: string | null | undefined, tag: string): string => {
	if (!text) return "";
	const regex = new RegExp(`\\[${tag}:([^\\]]+)\\]`, "i");
	const match = text.match(regex);
	return match?.[1]?.trim() || "";
};

const extractNotesTag = (text: string | null | undefined): string => {
	if (!text) return "";
	const match = text.match(/\[notes:([\s\S]*?)\]/i);
	return match?.[1]?.trim() || "";
};

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
	{ id: "star", name: "نجمة تفوق أداء", icon: IconStar },
	{ id: "award", name: "جائزة وسام بطولة", icon: IconAward },
	{ id: "heart", name: "قلب صحة رعاية", icon: IconHeart },
	{ id: "users", name: "فريق طلاب جماعي", icon: IconUsers },
	{ id: "globe", name: "عالم لغات دولي", icon: IconGlobe },
];

const COLOR_OPTIONS = [
	{
		id: "blue",
		label: "أزرق",
		bg: "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-400",
	},
	{
		id: "purple",
		label: "بنفسجي",
		bg: "bg-purple-50 border-purple-200 text-purple-600 dark:bg-purple-950/40 dark:border-purple-900 dark:text-purple-400",
	},
	{
		id: "emerald",
		label: "أخضر",
		bg: "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-400",
	},
	{
		id: "amber",
		label: "برتقالي",
		bg: "bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-400",
	},
	{
		id: "rose",
		label: "وردي",
		bg: "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-400",
	},
];

const DEFAULT_CLASSIFICATIONS = [
	"برمجة",
	"تقنية",
	"تصميم",
	"ذكاء اصطناعي",
	"روبوتكس",
	"إدارة أعمال",
	"البرمجة والمنطق",
	"طبي وتأهيلي",
	"تدريب تربوي",
];

const DURATION_PRESETS = [
	"4 أسابيع",
	"6 أسابيع",
	"8 أسابيع",
	"10 أسابيع",
	"12 أسبوع",
	"16 أسبوع",
	"6 أشهر",
];

const COURSE_TEMPLATES = [
	{
		id: "ux_principles",
		title: "مبادئ تجربة المستخدم UX",
		description:
			"دورة تطبيقية شاملة تركز على فهم سلوك المستخدم، بحث وتصميم مسارات التجربة واختبار قابلية الاستخدام.",
		notes: "تشمل ورش عمل تطبيقية ومشاريع واقعية.",
		category: "التصميم",
		duration: "4 أسابيع",
		academicStage: "المرحلة الثانوية",
		price: 4500,
		locationMode: "ONLINE" as CourseLocationMode,
		icon: "sparkles",
		color: "purple",
	},
	{
		id: "ui_design_basics",
		title: "أساسيات تصميم واجهات UI",
		description:
			"تعلم أساسيات تصميم الواجهات التفاعلية، نظرية الألوان، الطباعة، وتنسيق العناصر وفق معايير التصميم الحديثة.",
		notes: "تطبيق عملي خطوة بخطوة لبناء واجهات احترافية.",
		category: "التصميم",
		duration: "6 أسابيع",
		academicStage: "المرحلة الثانوية",
		price: 5500,
		locationMode: "ONLINE" as CourseLocationMode,
		icon: "cube",
		color: "blue",
	},
	{
		id: "design_thinking",
		title: "التفكير التصميمي وحل المشكلات",
		description:
			"دورة تهدف إلى تطوير مهارات التفكير الابتكاري وحل المشكلات المعقدة من خلال منهجية التفكير التصميمي.",
		notes: "مناسبة للطلاب لتنمية مهارات التفكير الناقد.",
		category: "التصميم",
		duration: "3 أسابيع",
		academicStage: "المرحلة المتوسطة",
		price: 3000,
		locationMode: "HYBRID" as CourseLocationMode,
		icon: "brain",
		color: "amber",
	},
	{
		id: "figma_prototyping",
		title: "تصميم النماذج الأولية باستخدام Figma",
		description:
			"إتقان استخدام أداة Figma لبناء نماذج أولية تفاعلية ونظم تصميم (Design Systems) متكاملة.",
		notes: "تتضمن بناء بروتوتايب تفاعلي ومشاركته مع فريق العمل.",
		category: "التصميم",
		duration: "5 أسابيع",
		academicStage: "المرحلة الثانوية",
		price: 5000,
		locationMode: "ONLINE" as CourseLocationMode,
		icon: "code",
		color: "purple",
	},
	{
		id: "data_analytics_intro",
		title: "مقدمة في تحليل البيانات",
		description:
			"اكتساب مهارات جمع وتحليل البيانات واستخراج الرؤى المفيدة باستخدام الأدوات الإحصائية الحديثة ولغة بايثون.",
		notes: "تطبيق على مجموعات بيانات واقعية ولوحات معلومات تفاعلية.",
		category: "التقنية",
		duration: "7 أسابيع",
		academicStage: "المرحلة الجامعية",
		price: 6500,
		locationMode: "ONLINE" as CourseLocationMode,
		icon: "cpu",
		color: "blue",
	},
	{
		id: "cyber_security_basics",
		title: "أساسيات الأمن السيبراني",
		description:
			"فهم أساسيات أمن المعلومات، حماية الشبكات والبيانات، والتعرف على التهديدات وطرق الحماية الرقمية.",
		notes: "تطبيقات وتدريبات عملية على أمان الأنظمة وحماية البيانات.",
		category: "التقنية",
		duration: "4 أسابيع",
		academicStage: "المرحلة الثانوية",
		price: 4800,
		locationMode: "ONLINE" as CourseLocationMode,
		icon: "robot",
		color: "emerald",
	},
	{
		id: "coding_kids",
		title: "البرمجة للأطفال",
		description:
			"دورة تفاعلية ممتعة لتعليم الأطفال مهارات التفكير المنطقي والبرمجة من خلال بناء الألعاب والقصص التفاعلية.",
		notes: "مشاريع عملية تناسب الفئات العمرية الصغيرة وتنمي الإبداع.",
		category: "البرمجة والمنطق",
		duration: "4 أسابيع",
		academicStage: "المرحلة الابتدائية",
		price: 3500,
		locationMode: "ONLINE" as CourseLocationMode,
		icon: "cube",
		color: "blue",
	},
];

const COURSE_FIELD_LABELS: Record<string, string> = {
	name: "اسم الدورة",
	code: "المعرّف",
	description: "الوصف",
	notes: "الملاحظات والأفكار",
	category: "التصنيف",
	academicStage: "المرحلة الدراسية",
	duration: "المدة المقدرة",
	selectedTrainer: "المدرب",
	price: "السعر",
};

type Step = 1 | 2 | 3 | 4;
type PublishError = { step: Step; message: string };

export interface CourseDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	editCourseId?: string | null;
	onSuccess?: () => void;
}

export function CourseDialog({
	open,
	onOpenChange,
	editCourseId,
	onSuccess,
}: CourseDialogProps) {
	const isEdit = Boolean(editCourseId);

	// خطوات المعالج: 1 المعلومات الأساسية، 2 باني المحتوى (الكبير)، 3 تعيين المتدربين، 4 الإكمال والنشر
	const [step, setStep] = useState<Step>(1);
	const [furthest, setFurthest] = useState<number>(1);
	const [activeCourseId, setActiveCourseId] = useState<string | null>(editCourseId || null);

	// جلب بيانات الدورة عند التعديل
	const { course, isLoading: isCourseLoading } = useCourse(activeCourseId || null);

	// الإجراءات البرمجية من الـ hooks
	const { createCourse, isPending: isCreatingCourse } = useCreateCourse();
	const { updateCourse, isUpdating: isUpdatingCourse } = useUpdateCourse(activeCourseId);
	const { setTrainers, isSavingTrainers } = useSetTrainers();
	const { saveTime } = useAssignTime(activeCourseId);

	// المراحل الدراسية من الإعدادات
	const {
		stages: academicStages,
		isLoading: isStagesLoading,
		addStage: addStageMutation,
	} = useAcademicStages();
	const settingStageOptions = useAcademicStageOptions();

	// التصنيفات من إعدادات المسارات
	const {
		classifications: trackClassifications,
		isLoading: isClassificationsLoading,
		addClassification: addClassificationMutation,
		deleteClassification: deleteClassificationMutation,
		isAdding: isAddingClassification,
	} = useTrackClassifications();

	// المدربون والموظفون
	const { staff } = useStaff();

	// حالات النموذج الأساسية
	const [name, setName] = useState("");
	const [code, setCode] = useState("");
	const [description, setDescription] = useState("");
	const [notes, setNotes] = useState("");
	const [category, setCategory] = useState("");
	const [academicStage, setAcademicStage] = useState("");
	const [duration, setDuration] = useState("");
	const [price, setPrice] = useState<number | undefined>(undefined);
	const [institution, setInstitution] = useState("");
	const [locationMode, setLocationMode] = useState<CourseLocationMode>("ONLINE");
	const [courseType, setCourseType] = useState<CourseType>("ONLINE");

	// وقت وتعيين الدورة للخطوة 3
	const [time, setTime] = useState<CourseTimeValue>({ start: null, due: null });
	const [timeError, setTimeError] = useState<string | undefined>(undefined);
	const [publishError, setPublishError] = useState<PublishError | null>(null);

	// تخصيص الأيقونة واللون
	const [selectedIcon, setSelectedIcon] = useState("cube");
	const [selectedColor, setSelectedColor] = useState("blue");
	const [iconPickerOpen, setIconPickerOpen] = useState(false);
	const [iconSearch, setIconSearch] = useState("");

	// المدربون
	const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
	const [selectedStaffMembers, setSelectedStaffMembers] = useState<
		{ id: string; name: string; avatar?: string }[]
	>([]);
	const [isStaffSheetOpen, setIsStaffSheetOpen] = useState(false);

	// إضافة خيارات جديدة حية
	const [newStageInput, setNewStageInput] = useState("");
	const [isAddingStage, setIsAddingStage] = useState(false);
	const [newClassificationInput, setNewClassificationInput] = useState("");
	const [classificationsList, setClassificationsList] = useState<string[]>(
		DEFAULT_CLASSIFICATIONS,
	);

	// القوالب والذكاء الاصطناعي
	const [templateMenuOpen, setTemplateMenuOpen] = useState(false);
	const [selectedTemplateId, setSelectedTemplateId] = useState<string>("none");
	const [templateSearch, setTemplateSearch] = useState("");
	const [isAiSheetOpen, setIsAiSheetOpen] = useState(false);

	// سلوك الواجهة
	const [isExpanded, setIsExpanded] = useState(false);
	const [showNotice, setShowNotice] = useState(true);
	const [notifyWhatsApp, setNotifyWhatsApp] = useState(false);
	const [createAnother, setCreateAnother] = useState(false);
	const [isDiscardOpen, setIsDiscardOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// توليد كود تلقائي
	const generateAutoCode = useCallback(() => {
		const num = Math.floor(10 + Math.random() * 90);
		return `CRS-${num}`;
	}, []);

	// متابعة حالة الفتح لضمان التهيئة عند فتح النافذة فقط وعدم إعادة التهيئة أثناء التنقل بين الخطوات
	const prevOpenRef = useRef(false);
	const initializedForEditRef = useRef<string | null>(null);

	useEffect(() => {
		// عندما تتغير النافذة من مغلقة إلى مفتوحة
		if (open && !prevOpenRef.current) {
			prevOpenRef.current = true;
			initializedForEditRef.current = null;
			setSelectedTemplateId("none");
			setTemplateSearch("");
			setShowNotice(true);
			setIsDiscardOpen(false);
			setIsExpanded(false);
			setIsSubmitting(false);
			setTimeError(undefined);
			setPublishError(null);

			if (editCourseId) {
				setActiveCourseId(editCourseId);
				setStep(1);
				setFurthest(4);
			} else {
				// وضع إنشاء جديد
				setActiveCourseId(null);
				setStep(1);
				setFurthest(1);
				setName("");
				setCode(generateAutoCode());
				setDescription("");
				setNotes("");
				setCategory("");
				setAcademicStage("");
				setDuration("");
				setPrice(undefined);
				setInstitution("");
				setLocationMode("ONLINE");
				setCourseType("ONLINE");
				setSelectedIcon("cube");
				setSelectedColor("blue");
				setSelectedStaffIds([]);
				setSelectedStaffMembers([]);
				setTime({ start: null, due: null });
			}
		} else if (!open) {
			prevOpenRef.current = false;
			initializedForEditRef.current = null;
		}
	}, [open, editCourseId, generateAutoCode]);

	// تعبئة البيانات عند جلب الدورة في وضع التعديل
	useEffect(() => {
		if (!open || !editCourseId || !course) return;
		if (initializedForEditRef.current === editCourseId) return;
		initializedForEditRef.current = editCourseId;

		setName(course.name || "");
		setCode(course.code || generateAutoCode());

		const rawDesc = course.description || "";
		const parsedNotes = extractNotesTag(rawDesc);
		const parsedStage =
			(course as unknown as { academicStage?: string }).academicStage ||
			extractSystemTag(rawDesc, "stage") ||
			extractSystemTag(rawDesc, "المرحلة");
		const parsedIcon = extractSystemTag(rawDesc, "icon");
		const parsedColor = extractSystemTag(rawDesc, "color");

		setDescription(stripSystemTags(rawDesc));
		setNotes(parsedNotes);
		setCategory(course.category || course.department || "");
		setAcademicStage(parsedStage);

		if (course.estimatedDurationWeeks) {
			setDuration(`${course.estimatedDurationWeeks} أسابيع`);
		} else {
			setDuration("");
		}

		setPrice(course.trainingCost ?? undefined);
		setInstitution(course.institution || "");
		setLocationMode(course.locationMode || "ONLINE");
		setCourseType(course.type || "ONLINE");

		setSelectedIcon(parsedIcon || "cube");
		setSelectedColor(parsedColor || "blue");

		setTime({
			start: course.startDate ? new Date(course.startDate) : null,
			due: course.dueDate ? new Date(course.dueDate) : null,
		});

		const trainersList = (course.trainers || []).map((t) => {
			const staffObj = t as unknown as {
				id?: string;
				staffId?: string;
				name?: string;
				avatar?: string;
				staff?: { name?: string; avatar?: string };
			};
			const id = staffObj.id || staffObj.staffId || "";
			const memberName = staffObj.name || staffObj.staff?.name || "مدرب";
			const avatar = staffObj.avatar || staffObj.staff?.avatar;
			return { id, name: memberName, avatar };
		});

		setSelectedStaffIds(trainersList.map((t) => t.id).filter(Boolean));
		setSelectedStaffMembers(trainersList);
	}, [open, editCourseId, course, generateAutoCode]);

	// تتبع أقصى خطوة تم الوصول إليها
	useEffect(() => {
		setFurthest((f) => (step > f ? step : f));
	}, [step]);

	// قائمة المراحل الدراسية المدمجة
	const activeAcademicStages = useMemo(() => {
		const list: string[] = [];
		if (Array.isArray(academicStages) && academicStages.length > 0) {
			for (const st of academicStages) {
				const sObj = st as unknown as { name?: string; title?: string };
				const nameVal = sObj.name || sObj.title;
				if (nameVal && typeof nameVal === "string" && !list.includes(nameVal)) {
					list.push(nameVal);
				}
			}
		}
		if (Array.isArray(settingStageOptions) && settingStageOptions.length > 0) {
			for (const opt of settingStageOptions) {
				if (opt.label && !list.includes(opt.label)) {
					list.push(opt.label);
				}
			}
		}
		const defaultStages = [
			"رياض الأطفال",
			"المرحلة الابتدائية",
			"المرحلة المتوسطة",
			"المرحلة الثانوية",
			"المرحلة الجامعية",
			"التدريب المهني",
		];
		for (const def of defaultStages) {
			if (!list.includes(def)) {
				list.push(def);
			}
		}
		if (academicStage && !list.includes(academicStage)) {
			list.unshift(academicStage);
		}
		return list.filter(Boolean);
	}, [academicStages, settingStageOptions, academicStage]);

	// قائمة التصنيفات المدمجة
	const activeTrackClassifications = useMemo(() => {
		const active = (trackClassifications || [])
			.filter((t) => t.isActive !== false)
			.map((t) => t.name);
		const list = [...active, ...classificationsList];
		if (category && !list.includes(category)) {
			list.unshift(category);
		}
		return Array.from(new Set(list)).filter(Boolean);
	}, [trackClassifications, classificationsList, category]);

	const currentColorConfig = useMemo(
		() => COLOR_OPTIONS.find((c) => c.id === selectedColor) ?? COLOR_OPTIONS[0],
		[selectedColor],
	);

	const ActiveIcon = useMemo(() => {
		const found = POPULAR_ICONS.find((i) => i.id === selectedIcon);
		return found?.icon ?? IconCube;
	}, [selectedIcon]);

	const filteredIcons = useMemo(() => {
		if (!iconSearch.trim()) return POPULAR_ICONS;
		const q = iconSearch.toLowerCase();
		return POPULAR_ICONS.filter((i) => i.name.toLowerCase().includes(q) || i.id.includes(q));
	}, [iconSearch]);

	const filteredTemplates = useMemo(() => {
		if (!templateSearch.trim()) return COURSE_TEMPLATES;
		const query = templateSearch.trim().toLowerCase();
		return COURSE_TEMPLATES.filter(
			(tpl) =>
				tpl.title.toLowerCase().includes(query) ||
				tpl.description.toLowerCase().includes(query) ||
				tpl.category.toLowerCase().includes(query),
		);
	}, [templateSearch]);

	// مؤشر إنجاز النموذج في الخطوة الأولى
	const formProgress = useMemo(() => {
		const trimmedName = name.trim();
		const isNameFilled = trimmedName.length >= 2;
		const filled = isNameFilled ? 1 : 0;
		const requiredCount = 1;
		const progress = Math.round((filled / requiredCount) * 100);
		return {
			filledCount: filled,
			requiredCount,
			progress,
			isComplete: filled === requiredCount,
		};
	}, [name]);

	// فحص التعديلات غير المحفوظة في الخطوة الأولى
	const isDirty = useMemo(() => {
		if (step > 1) return false;
		if (isEdit && course) {
			const originalStaffKey = (course.trainers || [])
				.map((t) => (t as unknown as { staffId?: string; id?: string }).staffId || t.id)
				.sort()
				.join(",");
			const currentStaffKey = [...selectedStaffIds].sort().join(",");

			return (
				name !== (course.name || "") ||
				description !== stripSystemTags(course.description) ||
				notes.trim() !== extractNotesTag(course.description) ||
				category !== (course.category || course.department || "") ||
				currentStaffKey !== originalStaffKey
			);
		}
		return Boolean(
			name.trim() ||
				description.trim() ||
				notes.trim() ||
				category ||
				academicStage ||
				selectedStaffIds.length > 0 ||
				duration ||
				price,
		);
	}, [
		step,
		name,
		description,
		notes,
		category,
		academicStage,
		selectedStaffIds,
		duration,
		price,
		isEdit,
		course,
	]);

	const filledFields = useMemo(() => {
		const list: string[] = [];
		if (name.trim()) list.push("name");
		if (description.trim()) list.push("description");
		if (notes.trim()) list.push("notes");
		if (category) list.push("category");
		if (academicStage) list.push("academicStage");
		if (selectedStaffIds.length > 0) list.push("selectedTrainer");
		if (duration) list.push("duration");
		if (price !== undefined) list.push("price");
		return list;
	}, [name, description, notes, category, academicStage, selectedStaffIds, duration, price]);

	// تطبيق قالب جاهز
	const handleSelectTemplate = (tpl: (typeof COURSE_TEMPLATES)[0] | null) => {
		if (!tpl) {
			setSelectedTemplateId("none");
			setName("");
			setDescription("");
			setNotes("");
			setCategory("");
			setAcademicStage("");
			setDuration("");
			setPrice(undefined);
			setLocationMode("ONLINE");
			setSelectedIcon("cube");
			setSelectedColor("blue");
			setTemplateMenuOpen(false);
			toast.info("تم تفريغ الحقول والبدء بدون قالب");
			return;
		}

		setSelectedTemplateId(tpl.id);
		setName(tpl.title);
		setDescription(tpl.description);
		setNotes(tpl.notes || "");
		setCategory(tpl.category);
		setAcademicStage(tpl.academicStage || "");
		setDuration(tpl.duration);
		setPrice(tpl.price);
		setLocationMode(tpl.locationMode);
		setSelectedIcon(tpl.icon);
		setSelectedColor(tpl.color);
		setTemplateMenuOpen(false);
		toast.success(`تم تطبيق قالب "${tpl.title}"`);
	};

	const handleCloseAttempt = useCallback(() => {
		if (isDirty) {
			setIsDiscardOpen(true);
		} else {
			onOpenChange(false);
		}
	}, [isDirty, onOpenChange]);

	// إضافة تصنيف مخصص
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
		setCategory(trimmed);
		setNewClassificationInput("");
		addClassificationMutation(trimmed);
	};

	// إضافة مرحلة دراسية مخصصة
	const handleAddCustomStage = async (
		e?: React.FormEvent | React.MouseEvent | React.KeyboardEvent,
	) => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		const trimmed = newStageInput.trim();
		if (!trimmed) return;
		setIsAddingStage(true);
		try {
			await addStageMutation({
				name: trimmed,
				order: activeAcademicStages.length + 1,
				description: "",
			});
			setAcademicStage(trimmed);
			setNewStageInput("");
			toast.success(`تمت إضافة المرحلة الدراسية "${trimmed}" بنجاح`);
		} catch {
			setAcademicStage(trimmed);
			setNewStageInput("");
			toast.info(`تم اختيار المرحلة الدراسية "${trimmed}"`);
		} finally {
			setIsAddingStage(false);
		}
	};

	// حفظ وتثبيت وقت الدورة للخطوة 3
	const persistTime = () => {
		if (!activeCourseId) return;
		saveTime({
			startDate: time.start ? time.start.toISOString() : null,
			dueDate: time.due ? time.due.toISOString() : null,
			timezone: LOCAL_TZ,
		});
	};

	// إنشاء الدورة في قاعدة البيانات بصورة كسولة (فقط عند حفظ محتوى أو حفظ كمسودة أو النشر)
	const ensureCourseCreated = async (): Promise<string> => {
		let estimatedWeeks: number | undefined;
		if (duration) {
			const match = duration.match(/(\d+)/);
			if (match?.[1]) {
				const parsed = Number.parseInt(match[1], 10);
				if (!Number.isNaN(parsed) && parsed > 0) estimatedWeeks = parsed;
			}
		}

		let finalDescription = description.trim();
		if (notes.trim()) {
			finalDescription += `\n[notes:${notes.trim()}]`;
		}
		if (academicStage.trim()) {
			finalDescription += `\n[stage:${academicStage.trim()}]`;
		}
		if (selectedIcon) {
			finalDescription += `\n[icon:${selectedIcon}]`;
		}
		if (selectedColor) {
			finalDescription += `\n[color:${selectedColor}]`;
		}

		const parsedPrice =
			price != null && !Number.isNaN(price) ? Math.max(0, Math.round(Number(price))) : undefined;

		let currentId = activeCourseId;
		if (currentId) {
			await updateCourse({
				name: name.trim(),
				description: finalDescription || undefined,
				category: category.trim() || undefined,
				department: category.trim() || "",
				type: courseType,
				locationMode,
				trainingCost: parsedPrice,
				institution: institution.trim() || undefined,
				estimatedDurationWeeks: estimatedWeeks,
			});
			if (selectedStaffIds.length > 0) {
				await setTrainers(currentId, selectedStaffIds).catch(() => null);
			}
			return currentId;
		}

		const created = await createCourse({
			name: name.trim(),
			type: courseType,
			description: finalDescription || undefined,
			category: category.trim() || undefined,
			department: category.trim() || "",
			locationMode,
			trainingCost: parsedPrice,
			institution: institution.trim() || undefined,
			estimatedDurationWeeks: estimatedWeeks,
		});

		const createdId = (created as unknown as { id?: string })?.id;
		if (!createdId) throw new Error("فشل إنشاء الدورة التدريبية");
		currentId = createdId;
		setActiveCourseId(createdId);
		if (selectedStaffIds.length > 0) {
			await setTrainers(createdId, selectedStaffIds).catch(() => null);
		}
		return createdId;
	};

	// حفظ معلومات الخطوة الأولى والانتقال للخطوة الثانية (بدون إنشاء مسبق في DB)
	const handleSaveAndGoToBuilder = async (directSaveOnly = false) => {
		if (!name.trim()) {
			toast.error("يرجى إدخال اسم الدورة التدريبية");
			return;
		}

		if (directSaveOnly) {
			setIsSubmitting(true);
			try {
				await ensureCourseCreated();
				toast.success("تم حفظ بيانات الدورة بنجاح");
				onSuccess?.();
				onOpenChange(false);
			} catch (err: unknown) {
				const errorMsg =
					err instanceof Error ? err.message : "حدث خطأ أثناء حفظ الدورة التدريبية";
				toast.error(errorMsg);
			} finally {
				setIsSubmitting(false);
			}
			return;
		}

		// الانتقال للخطوة الثانية فوراً بدون استدعاء createCourse في قاعدة البيانات
		setStep(2);
		setFurthest((f) => Math.max(f, 2));
	};

	// الانتقال من الخطوة 3 إلى الخطوة 4
	const handleGoFromStep3 = () => {
		if (!isCourseTimeValid(time)) {
			setTimeError("تاريخ الاستحقاق يجب أن يكون بعد تاريخ البدء.");
			return;
		}
		setTimeError(undefined);
		persistTime();
		setStep(4);
	};

	// التحقق قبل النشر
	const validateForPublish = (): PublishError | null => {
		const hasContent = !!course?.units?.some((u) => u.lessons?.length > 0);
		if (!hasContent)
			return {
				step: 2,
				message: "أضف وحدة واحدة تحتوي على درس واحد على الأقل قبل نشر الدورة.",
			};
		if (!isCourseTimeValid(time))
			return { step: 3, message: "تاريخ الاستحقاق يجب أن يكون بعد تاريخ البدء." };
		return null;
	};

	// نشر الدورة
	const handlePublish = async () => {
		const problem = validateForPublish();
		if (problem) {
			if (problem.step === 3) setTimeError(problem.message);
			setPublishError(problem);
			setStep(problem.step);
			toast.error(problem.message);
			return;
		}
		setIsSubmitting(true);
		try {
			await ensureCourseCreated();
			await updateCourse({ status: "PUBLISHED" });
			if (step === 3 && isCourseTimeValid(time)) persistTime();
			toast.success("تم نشر الدورة التدريبية بنجاح");
			onSuccess?.();
			onOpenChange(false);
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : "تعذّر نشر الدورة";
			toast.error(msg);
		} finally {
			setIsSubmitting(false);
		}
	};

	// حفظ كمسودة في أي خطوة
	const handleSaveDraft = async () => {
		setIsSubmitting(true);
		try {
			const currentId = await ensureCourseCreated();
			if (currentId && step === 3 && isCourseTimeValid(time)) persistTime();
			toast.success("تم حفظ المسودة بنجاح");
			onSuccess?.();
			onOpenChange(false);
		} catch (err: unknown) {
			const errorMsg =
				err instanceof Error ? err.message : "حدث خطأ أثناء حفظ المسودة";
			toast.error(errorMsg);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<Dialog
				open={open}
				onOpenChange={(v) => {
					if (!v) handleCloseAttempt();
					else onOpenChange(true);
				}}
			>
				<DialogContent
					showCloseButton={false}
					className={cn(
						"p-0 gap-0 overflow-hidden border border-border shadow-2xl transition-all duration-300 flex flex-col",
						// يتمدد إلى العرض والارتفاع الكامل في الخطوة الثانية (باني المحتوى الكبير)
						step === 2
							? isExpanded
								? "w-[99vw] max-w-[99vw] sm:max-w-[99vw] h-[99vh] max-h-[99vh] rounded-none"
								: "w-[98vw] max-w-[98vw] sm:max-w-[98vw] md:max-w-[1720px] h-[98vh] max-h-[98vh]"
							: step === 3 || step === 4
								? "w-[90vw] max-w-[860px] sm:max-w-[860px] h-[95vh] max-h-[95vh]"
								: isExpanded
									? "w-[96vw] max-w-[96vw] sm:max-w-[96vw] h-[96vh] max-h-[96vh]"
									: "w-[90vw] max-w-2xl sm:max-w-2xl md:max-w-3xl max-h-[95vh]",
					)}
					onInteractOutside={(e) => {
						if (isStaffSheetOpen || isAiSheetOpen) {
							e.preventDefault();
							return;
						}
						if (isDirty) {
							e.preventDefault();
							setIsDiscardOpen(true);
						}
					}}
					onEscapeKeyDown={(e) => {
						if (isStaffSheetOpen || isAiSheetOpen) {
							e.preventDefault();
							return;
						}
						if (step > 1) {
							e.preventDefault();
							setStep((s) => (s - 1) as Step);
							return;
						}
						if (isDirty) {
							e.preventDefault();
							setIsDiscardOpen(true);
						}
					}}
				>
					<div className="flex flex-col w-full items-stretch overflow-hidden h-full max-h-[97vh]">
						{/* 1. الترويسة الموحدة */}
						<FormHeader
							variant="dialog"
							size="sm"
							title={
								step === 1
									? isEdit
										? "تعديل الدورة"
										: "أنشئ دورة جديدة"
									: step === 2
										? "إضافة وبناء محتوى الدورة"
										: step === 3
											? "تعيين المتدربين والوقت"
											: "الإكمال والنشر"
							}
							identity={
								step === 1
									? isEdit && course
										? { name: course.name, code: course.code }
										: null
									: { name: name || course?.name || "دورة جديدة", code: code || course?.code }
							}
							progress={step === 1 ? formProgress : undefined}
							onClose={handleCloseAttempt}
							actions={
								<Button
									type="button"
									variant="ghost"
									size="icon-xs"
									className="size-7 text-muted-foreground hover:text-foreground hidden sm:flex cursor-pointer rounded-md transition-colors"
									onClick={() => setIsExpanded((prev) => !prev)}
									title={isExpanded ? "تصغير النافذة" : "توسيع النافذة"}
								>
									{isExpanded ? (
										<IconArrowsDiagonalMinimize2 className="size-3.5" />
									) : (
										<IconArrowsDiagonal className="size-3.5" />
									)}
								</Button>
							}
							titleActions={
								step === 1 ? (
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
													className="h-6 px-2 text-[11px] gap-1 rounded-full border border-border bg-white dark:bg-card hover:bg-muted font-medium cursor-pointer"
												>
													<IconCopy className="size-3" />
													<span>قالب</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent
												align="start"
												className="w-64! min-w-64 p-1.5 rounded-xl border border-border shadow-md bg-popover"
												onCloseAutoFocus={(e) => e.preventDefault()}
											>
												<div className="flex items-center justify-between gap-1.5 px-2 py-1 mb-1 border-b border-border/60">
													<input
														value={templateSearch}
														onChange={(e) => setTemplateSearch(e.target.value)}
														placeholder="تطبيق قالب دورة..."
														className="w-full text-xs bg-transparent outline-none placeholder:text-muted-foreground/60 text-right"
														onClick={(e) => e.stopPropagation()}
														onKeyDown={(e) => e.stopPropagation()}
													/>
												</div>

												<div className="space-y-0.5">
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

													{filteredTemplates.map((tpl) => {
														const isSelected = selectedTemplateId === tpl.id;
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
																	<IconBook className="size-4 text-foreground/80 shrink-0" />
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

										{/* زر أنشئ مع مدير / سند */}
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => setIsAiSheetOpen(true)}
											className="h-6 px-2 text-[11px] gap-1 rounded-full border border-border bg-white dark:bg-card hover:bg-muted font-medium cursor-pointer flex items-center shrink-0 transition-all"
											title="أنشئ مع مدير بالذكاء الاصطناعي"
										>
											<SanadLogo iconOnly className="h-3 w-auto shrink-0" />
											<span className="whitespace-nowrap">أنشئ مع مدير</span>
										</Button>
									</div>
								) : undefined
							}
						/>

						{/* شريط خطوات المعالج (الستيبّر) الموحد في الأعلى */}
						<CourseSheetStepper
							step={step}
							furthest={furthest}
							onStepChange={(s) => setStep(s as Step)}
						/>

						{/* رسالة خطأ النشر إن وجدت */}
						{publishError?.step === step && (
							<div className="flex shrink-0 items-center gap-2 border-b border-destructive/30 bg-destructive/5 px-4 py-2 text-xs font-medium text-destructive">
								<IconAlertCircle className="size-4 shrink-0" />
								<span>{publishError.message}</span>
							</div>
						)}

						{/* 2. المحتوى: يتغير حسب الخطوة الحالية */}

						{/* الخطوة 1: فورم المعلومات الأساسية المطابق للصورة تماماً */}
						{step === 1 && (
							<form
								onSubmit={(e) => {
									e.preventDefault();
									handleSaveAndGoToBuilder(false);
								}}
								onKeyDown={(e) => {
									if (e.key === "Enter" && (e.target as HTMLElement).tagName === "INPUT") {
										e.preventDefault();
									}
									if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
										e.preventDefault();
										handleSaveAndGoToBuilder(false);
									}
								}}
								className="flex flex-col flex-1 min-h-0 overflow-hidden"
							>
								<div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
									{/* السطر الأول: المعرف (يمين) + زر الأيقونة + اسم الدورة (يسار) */}
									<div className="space-y-1.5">
										<div className="flex items-center gap-2.5 w-full">
											{/* المعرف يميناً */}
											<div className="w-36 sm:w-44 shrink-0">
												<FieldLabel info="يُولد تلقائياً بتسلسل نظامي ويمكنك تعديله">
													<Label
														htmlFor="crs-code"
														className="text-xs font-semibold text-muted-foreground"
													>
														المعرّف{" "}
														<span className="font-normal text-[11px]">يُولد تلقائياً</span>
													</Label>
												</FieldLabel>
											</div>

											{/* فراغ محاذاة للأيقونة */}
											<div className="w-10 shrink-0" aria-hidden="true" />

											{/* تسمية اسم الدورة يساراً */}
											<div className="flex-1 min-w-0">
												<FieldLabel required info="اسم الدورة التدريبية">
													<Label htmlFor="crs-name" className="text-xs font-semibold">
														اسم الدورة
													</Label>
												</FieldLabel>
											</div>
										</div>

										{/* حقول الإدخال جنباً إلى جنب مع زر الأيقونة المنبثق */}
										<div className="flex items-center gap-2.5 w-full">
											{/* حقل المعرف */}
											<div className="w-36 sm:w-44 shrink-0">
												<Input
													id="crs-code"
													value={code}
													onChange={(e) => setCode(e.target.value)}
													placeholder="مثال: CRS-01"
													className="w-full h-10 text-xs font-mono text-center sm:text-right bg-muted/40"
												/>
											</div>

											{/* زر الأيقونة المنبثق لاختيار رمز ولون الدورة */}
											<div className="shrink-0 w-10 flex items-center justify-center">
												<Popover open={iconPickerOpen} onOpenChange={setIconPickerOpen}>
													<PopoverTrigger asChild>
														<button
															type="button"
															className={cn(
																"size-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95",
																currentColorConfig.bg,
															)}
															title="اختر رمز ولون الدورة"
														>
															<ActiveIcon className="size-5" />
														</button>
													</PopoverTrigger>

													<PopoverContent
														className="w-[340px] p-3 shadow-xl rounded-xl border bg-popover"
														align="start"
														side="bottom"
														sideOffset={6}
														dir="rtl"
													>
														{/* اختيار اللون */}
														<div className="mb-3">
															<span className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
																لون الأيقونة
															</span>
															<div className="flex items-center gap-2">
																{COLOR_OPTIONS.map((col) => (
																	<button
																		key={col.id}
																		type="button"
																		onClick={() => setSelectedColor(col.id)}
																		className={cn(
																			"size-6 rounded-full border-2 transition-transform hover:scale-110",
																			col.bg,
																			selectedColor === col.id &&
																				"ring-2 ring-primary ring-offset-2",
																		)}
																		title={col.label}
																	/>
																))}
															</div>
														</div>

														{/* حقل بحث الأيقونات */}
														<div className="relative mb-2">
															<Input
																value={iconSearch}
																onChange={(e) => setIconSearch(e.target.value)}
																placeholder="ابحث في الأيقونات..."
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

														{/* شبكة الأيقونات */}
														<div className="max-h-48 overflow-y-auto p-1.5 border rounded-lg bg-muted/20">
															<div className="grid grid-cols-6 gap-1.5">
																{filteredIcons.map((item) => {
																	const IconComp = item.icon;
																	const isSelected = selectedIcon === item.id;
																	return (
																		<button
																			key={item.id}
																			type="button"
																			onClick={() => {
																				setSelectedIcon(item.id);
																				setIconPickerOpen(false);
																			}}
																			className={cn(
																				"size-8 rounded-md flex items-center justify-center transition-all text-muted-foreground hover:text-foreground hover:bg-background shadow-2xs",
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
														</div>
													</PopoverContent>
												</Popover>
											</div>

											{/* حقل اسم الدورة */}
											<div className="flex-1 min-w-0">
												<Input
													id="crs-name"
													value={name}
													onChange={(e) => setName(e.target.value)}
													placeholder="مثال: البرمجه للأطفال"
													className="w-full h-10 text-xs text-right font-medium"
													required
													autoFocus
												/>
											</div>
										</div>
									</div>

									{/* السطر الثاني: وصف الدورة */}
									<Field className="space-y-1.5">
										<FieldLabel info="وصف شامل لأهداف الدورة ومحتواها">
											<Label htmlFor="crs-desc" className="text-xs font-semibold">
												وصف الدورة
											</Label>
										</FieldLabel>
										<div className="rounded-lg border border-border/80 bg-background overflow-hidden focus-within:ring-1 focus-within:ring-primary">
											<Textarea
												id="crs-desc"
												value={description}
												onChange={(e) => setDescription(e.target.value)}
												placeholder="أضف وصف..."
												rows={3}
												className="w-full text-xs text-right resize-none border-0 focus-visible:ring-0 p-3 shadow-none bg-transparent"
											/>
										</div>
									</Field>

									{/* محرر الملاحظات والأفكار التفاعلي الموحد (RichNotesEditor) */}
									<div className="mt-2">
										<RichNotesEditor
											id="crs-notes"
											value={notes}
											onChange={setNotes}
											placeholder="أضف أفكار أو ملاحظات لهذه الدورة..."
											variant="border-top-only"
											minHeight={55}
										/>
									</div>
								</div>

								{/* شريط التحكم والإجراءات السفلي الثابت */}
								<div className="shrink-0 bg-background border-t border-border flex flex-col z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
									{/* أ) رسالة التنبيه الصفراء المطابقة تماماً */}
									{showNotice && (
										<div className="w-full bg-[#FFFBEB] dark:bg-amber-950/40 border-b border-amber-200/80 dark:border-amber-900/40 px-5 py-2.5 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
											<div className="flex items-center gap-1.5 font-medium">
												<span className="font-bold">تنبيه:</span>
												<span>يمكنك تخطي الخطوات التالية وإضافتها بعد إنشاء الدورة</span>
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

									{/* ب) شريط شرائح الخطوات الإضافية (بدون الفئة العمرية) */}
									<div className="flex items-center gap-2 flex-wrap justify-start px-5 py-2.5 bg-background">
										{/* 1. المرحلة الدراسية */}
										<DropdownMenu dir="rtl" modal={false}>
											<DropdownMenuTrigger asChild>
												<Button
													type="button"
													variant={academicStage ? "secondary" : "outline"}
													size="sm"
													className="gap-1.5 h-8 text-xs font-normal"
												>
													<IconSchool className="size-3.5 text-muted-foreground/70 shrink-0" />
													<span>{academicStage || "المرحلة الدراسية"}</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="w-56! min-w-56 p-1.5">
												<DropdownMenuLabel className="px-2 py-1 text-[11px] font-semibold text-muted-foreground">
													المرحلة الدراسية
												</DropdownMenuLabel>

												{/* حقل إضافة مرحلة دراسية جديدة */}
												<div
													className="p-1 mb-1.5 border-b"
													onClickCapture={(e) => e.stopPropagation()}
													onKeyDownCapture={(e) => e.stopPropagation()}
													onPointerDownCapture={(e) => e.stopPropagation()}
													onMouseDown={(e) => e.stopPropagation()}
												>
													<div className="flex items-center gap-1.5">
														<Input
															value={newStageInput}
															onChange={(e) => setNewStageInput(e.target.value)}
															onKeyDown={(e) => {
																e.stopPropagation();
																if (e.key === "Enter") {
																	e.preventDefault();
																	handleAddCustomStage(e);
																}
															}}
															placeholder="مرحلة دراسية جديدة..."
															className="h-7 text-xs px-2 flex-1"
														/>
														<Button
															type="button"
															size="sm"
															variant="secondary"
															onClick={handleAddCustomStage}
															disabled={!newStageInput.trim() || isAddingStage}
															className="h-7 px-2 text-xs shrink-0 gap-1 cursor-pointer"
														>
															{isAddingStage ? (
																<Spinner className="size-3" />
															) : (
																<IconPlus className="size-3" />
															)}
															<span>إضافة</span>
														</Button>
													</div>
												</div>

												{/* خيار بدون مرحلة دراسية */}
												<DropdownMenuItem
													onClick={() => setAcademicStage("")}
													className={cn(
														"cursor-pointer text-xs flex items-center justify-between px-2.5 py-1.5 rounded-md mb-1",
														!academicStage && "bg-muted font-medium text-foreground",
													)}
												>
													<span>بدون مرحلة دراسية</span>
													{!academicStage && <IconCheck className="size-3.5 text-primary" />}
												</DropdownMenuItem>
												<DropdownMenuSeparator className="my-1" />

												{/* قائمة المراحل المتاحة */}
												<div className="max-h-48 overflow-y-auto space-y-0.5">
													{isStagesLoading && activeAcademicStages.length === 0 ? (
														<div className="py-2 text-center text-xs text-muted-foreground">
															جاري التحميل...
														</div>
													) : (
														activeAcademicStages.map((item) => (
															<div
																key={item}
																onClick={() => setAcademicStage(item)}
																className={cn(
																	"relative flex cursor-pointer select-none items-center justify-between rounded-sm px-2 py-1.5 text-xs outline-none transition-colors hover:bg-accent hover:text-accent-foreground group",
																	academicStage === item && "bg-accent/60 font-medium",
																)}
															>
																<div className="flex items-center gap-1.5 min-w-0">
																	<span>{item}</span>
																	{academicStage === item && (
																		<IconCheck className="size-3.5 text-primary shrink-0" />
																	)}
																</div>
															</div>
														))
													)}
												</div>
											</DropdownMenuContent>
										</DropdownMenu>

										{/* 2. التصنيف */}
										<DropdownMenu dir="rtl" modal={false}>
											<DropdownMenuTrigger asChild>
												<Button
													type="button"
													variant={category ? "secondary" : "outline"}
													size="sm"
													className="gap-1.5 h-8 text-xs font-normal"
												>
													<IconRoute className="size-3.5 text-muted-foreground/70 shrink-0" />
													<span>{category || "التصنيف"}</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="w-56! min-w-56 p-1.5">
												<DropdownMenuLabel className="px-2 py-1 text-[11px] font-semibold text-muted-foreground">
													التصنيف
												</DropdownMenuLabel>

												{/* حقل إضافة تصنيف جديد */}
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

												{/* خيار بدون تصنيف */}
												<DropdownMenuItem
													onClick={() => setCategory("")}
													className={cn(
														"cursor-pointer text-xs flex items-center justify-between px-2.5 py-1.5 rounded-md mb-1",
														!category && "bg-muted font-medium text-foreground",
													)}
												>
													<span>بدون تصنيف</span>
													{!category && <IconCheck className="size-3.5 text-primary" />}
												</DropdownMenuItem>
												<DropdownMenuSeparator className="my-1" />

												{/* قائمة التصنيفات */}
												<div className="max-h-48 overflow-y-auto space-y-0.5">
													{isClassificationsLoading &&
													activeTrackClassifications.length === 0 ? (
														<div className="py-2 text-center text-xs text-muted-foreground">
															جاري التحميل...
														</div>
													) : (
														activeTrackClassifications.map((item) => {
															const trackObj = (trackClassifications || []).find(
																(t) => t.name === item,
															);
															const isCustom = trackObj ? !trackObj.isDefault : true;
															return (
																<div
																	key={item}
																	onClick={() => setCategory(item)}
																	className={cn(
																		"relative flex cursor-pointer select-none items-center justify-between rounded-sm px-2 py-1.5 text-xs outline-none transition-colors hover:bg-accent hover:text-accent-foreground group",
																		category === item && "bg-accent/60 font-medium",
																	)}
																>
																	<div className="flex items-center gap-1.5 min-w-0">
																		<span>{item}</span>
																		{category === item && (
																			<IconCheck className="size-3.5 text-primary shrink-0" />
																		)}
																	</div>

																	{isCustom && (
																		<button
																			type="button"
																			title="حذف هذا التصنيف"
																			onClick={(e) => {
																				e.preventDefault();
																				e.stopPropagation();
																				if (category === item) setCategory("");
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
											</DropdownMenuContent>
										</DropdownMenu>

										{/* 3. المدرب */}
										<Button
											type="button"
											variant={selectedStaffIds.length > 0 ? "secondary" : "outline"}
											size="sm"
											className="gap-1.5 h-8 text-xs font-normal cursor-pointer"
											onClick={() => setIsStaffSheetOpen(true)}
										>
											<IconSun className="size-3.5 shrink-0 text-muted-foreground" />
											<span>
												{selectedStaffMembers.length === 0
													? "بدون مدرب"
													: selectedStaffMembers.length === 1
														? selectedStaffMembers[0].name
														: `${selectedStaffMembers.length} مدربين`}
											</span>
										</Button>

										{/* 4. المدة المقدرة */}
										<DropdownMenu dir="rtl" modal={false}>
											<DropdownMenuTrigger asChild>
												<Button
													type="button"
													variant={duration ? "secondary" : "outline"}
													size="sm"
													className="gap-1.5 h-8 text-xs font-normal"
												>
													<IconClock className="size-3.5 shrink-0 text-muted-foreground" />
													<span>{duration ? `... ${duration}` : "... المدة المقدرة"}</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="w-44! min-w-44 p-1.5">
												<DropdownMenuLabel className="px-2 py-1 text-[11px] font-semibold text-muted-foreground">
													المدة المقدرة للدورة
												</DropdownMenuLabel>
												<DropdownMenuSeparator className="my-1" />

												<DropdownMenuItem
													onClick={() => setDuration("")}
													className={cn(
														"cursor-pointer text-xs flex items-center justify-between px-2.5 py-1.5 rounded-md",
														!duration && "bg-muted font-medium text-foreground",
													)}
												>
													<span>بدون مدة</span>
													{!duration && <IconCheck className="size-3.5 text-primary" />}
												</DropdownMenuItem>
												<DropdownMenuSeparator className="my-1" />

												<div className="max-h-48 overflow-y-auto space-y-0.5">
													{DURATION_PRESETS.map((d) => (
														<DropdownMenuItem
															key={d}
															onClick={() => setDuration(d)}
															className={cn(
																"cursor-pointer text-xs flex items-center justify-between px-2.5 py-1.5 rounded-md",
																duration === d && "bg-muted font-medium text-foreground",
															)}
														>
															<span>{d}</span>
															{duration === d && (
																<IconCheck className="size-3.5 text-primary" />
															)}
														</DropdownMenuItem>
													))}
												</div>
											</DropdownMenuContent>
										</DropdownMenu>

										{/* 5. زر الخيارات الإضافية (...) */}
										<DropdownMenu dir="rtl" modal={false}>
											<DropdownMenuTrigger asChild>
												<Button
													type="button"
													variant="outline"
													size="icon-sm"
													className="size-8"
													title="خيارات إضافية للدورة"
												>
													<IconDots className="size-4 text-muted-foreground" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="start" className="w-56! min-w-56 p-2 space-y-2">
												<div className="space-y-1">
													<span className="text-[11px] font-semibold text-muted-foreground block">
														مكان الدورة
													</span>
													<div className="grid grid-cols-3 gap-1">
														{(["ONLINE", "ONSITE", "HYBRID"] as const).map((mode) => (
															<button
																key={mode}
																type="button"
																onClick={() => setLocationMode(mode)}
																className={cn(
																	"text-[10px] py-1 px-1.5 rounded border transition-colors",
																	locationMode === mode
																		? "bg-primary text-primary-foreground border-primary font-semibold"
																		: "bg-muted/40 text-muted-foreground hover:text-foreground",
																)}
															>
																{mode === "ONLINE"
																	? "أونلاين"
																	: mode === "ONSITE"
																		? "حضوري"
																		: "مدمج"}
															</button>
														))}
													</div>
												</div>

												<div className="space-y-1 pt-1 border-t">
													<span className="text-[11px] font-semibold text-muted-foreground block">
														التكلفة / السعر (ج.م)
													</span>
													<Input
														type="number"
														min={0}
														value={price ?? ""}
														onChange={(e) => {
															const val = e.target.value.trim();
															setPrice(
																val === ""
																	? undefined
																	: Math.max(0, Number.parseInt(val, 10) || 0),
															);
														}}
														placeholder="مثال: 5000"
														className="h-7 text-xs"
													/>
												</div>

												<div className="space-y-1 pt-1 border-t">
													<span className="text-[11px] font-semibold text-muted-foreground block">
														المؤسسة / الجهة المنظمة
													</span>
													<Input
														value={institution}
														onChange={(e) => setInstitution(e.target.value)}
														placeholder="اسم الجهة أو المركز..."
														className="h-7 text-xs"
													/>
												</div>

												<div className="pt-1 border-t">
													<button
														type="button"
														onClick={() => setIsStaffSheetOpen(true)}
														className="w-full flex items-center justify-between text-xs py-1.5 px-2 rounded hover:bg-accent text-right cursor-pointer"
													>
														<span className="font-semibold text-foreground">
															تعيين موظف / مدرب
														</span>
														{selectedStaffIds.length > 0 ? (
															<span className="text-[10px] bg-primary/10 text-primary font-medium px-1.5 py-0.5 rounded">
																{selectedStaffIds.length} محدد
															</span>
														) : (
															<span className="text-[10px] text-muted-foreground">0 محدد</span>
														)}
													</button>
												</div>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</div>

								{/* فوتر الخطوة 1 */}
								<div className="p-3 border-t bg-muted/20 shrink-0">
									<FormFooter
										continueAdding={createAnother}
										onContinueAddingChange={!isEdit ? setCreateAnother : undefined}
										disabled={isSubmitting || isCreatingCourse || isUpdatingCourse}
										showShortcut={false}
										extra={
											<div className="flex items-center gap-2 text-xs text-muted-foreground">
												<IconBrandWhatsapp className="size-4 text-emerald-600" />
												<span>إشعار عبر الواتساب</span>
												<Switch
													checked={notifyWhatsApp}
													onCheckedChange={setNotifyWhatsApp}
													disabled={isSubmitting || isCreatingCourse || isUpdatingCourse}
												/>
											</div>
										}
									>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={handleCloseAttempt}
											disabled={isSubmitting || isCreatingCourse || isUpdatingCourse}
										>
											إلغاء
										</Button>

										{isEdit && (
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() => handleSaveAndGoToBuilder(true)}
												disabled={
													isSubmitting || isCreatingCourse || isUpdatingCourse || !name.trim()
												}
												className="text-xs font-medium cursor-pointer"
											>
												حفظ مباشر
											</Button>
										)}

										<Button
											type="submit"
											size="sm"
											disabled={
												isSubmitting || isCreatingCourse || isUpdatingCourse || !name.trim()
											}
											className={cn(
												"gap-1.5 font-semibold transition-all shadow-xs cursor-pointer",
												!name.trim() && "opacity-50 cursor-not-allowed",
											)}
										>
											{isSubmitting || isCreatingCourse ? (
												<>
													<Spinner className="size-3.5" />
													<span>جارٍ الحفظ...</span>
												</>
											) : (
												<span>التالي: إضافة المحتوى ←</span>
											)}
										</Button>
									</FormFooter>
								</div>
							</form>
						)}

						{/* الخطوة 2: باني محتوى الدورة والدروس الكبير (CourseBuilderStep) */}
						{step === 2 && (
							<div className="flex flex-col flex-1 min-h-0 overflow-hidden bg-background">
								<div className="flex-1 min-h-0 overflow-hidden flex flex-col">
									<CourseBuilderStep
										courseId={activeCourseId}
										onGenerateAI={() => setIsAiSheetOpen(true)}
										onEnsureCourseCreated={ensureCourseCreated}
									/>
								</div>

								{/* فوتر الخطوة 2 المطابق للصورة تماماً */}
								<div className="flex shrink-0 items-center justify-between border-t border-border bg-background px-4 py-2.5 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] z-10">
									{/* يمين في RTL: حفظ ومتابعة الإضافة + زر رجوع */}
									<div className="flex items-center gap-3">
										<div className="flex items-center gap-2">
											<Checkbox
												id="keep-adding-course-step2"
												checked={createAnother}
												onCheckedChange={(c) => setCreateAnother(Boolean(c))}
												className="size-4 rounded-[4px] border-[#E5E5E5]"
											/>
											<label
												htmlFor="keep-adding-course-step2"
												className="text-xs text-[#9B9B9D] cursor-pointer select-none"
											>
												حفظ ومتابعة الإضافة
											</label>
										</div>

										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={() => setStep(1)}
											className="gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
										>
											<IconArrowRight className="size-4" />
											<span>رجوع لتعديل البيانات الأساسية</span>
										</Button>
									</div>

									{/* يسار في RTL: إلغاء ← حفظ كمسودة ← التالي */}
									<div className="flex items-center gap-2">
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => onOpenChange(false)}
											className="text-xs font-medium"
										>
											إلغاء
										</Button>

										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={handleSaveDraft}
											className="text-xs font-medium"
										>
											حفظ كمسودة
										</Button>

										<Button
											type="button"
											size="sm"
											onClick={async () => {
												try {
													await ensureCourseCreated();
													setStep(3);
													setFurthest((f) => Math.max(f, 3));
												} catch (e) {
													toast.error((e as Error).message);
												}
											}}
											className="gap-1.5 text-xs font-semibold cursor-pointer"
										>
											<span>التالي: تعيين المتدربين</span>
											<IconArrowLeft className="size-4" />
										</Button>
									</div>
								</div>
							</div>
						)}

						{/* الخطوة 3: تعيين المتدربين + وقت الدورة */}
						{step === 3 && activeCourseId && (
							<div className="flex flex-col flex-1 min-h-0 overflow-hidden bg-background">
								<div className="flex-1 min-h-0 overflow-y-auto px-4 py-3">
									<AssignLearnersStep courseId={activeCourseId}>
										<CourseTimeSection
											value={time}
											onChange={(v) => {
												setTime(v);
												if (timeError) setTimeError(undefined);
											}}
											error={timeError}
										/>
									</AssignLearnersStep>
								</div>

								{/* فوتر الخطوة 3 */}
								<div className="flex shrink-0 items-center justify-between border-t border-border bg-background px-4 py-2.5 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] z-10">
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={() => setStep(2)}
										className="gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
									>
										<IconArrowRight className="size-4" />
										<span>رجوع لباني المحتوى</span>
									</Button>

									<div className="flex items-center gap-2">
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={handleSaveDraft}
											className="text-xs font-medium"
										>
											حفظ كمسودة
										</Button>

										<Button
											type="button"
											size="sm"
											onClick={handleGoFromStep3}
											className="gap-1.5 text-xs font-semibold cursor-pointer"
										>
											<span>التالي: الإكمال والنشر</span>
											<IconArrowLeft className="size-4" />
										</Button>
									</div>
								</div>
							</div>
						)}

						{/* الخطوة 4: الإكمال والنشر */}
						{step === 4 && activeCourseId && course && (
							<div className="flex flex-col flex-1 min-h-0 overflow-hidden bg-background">
								<div className="flex-1 min-h-0 overflow-y-auto px-4 py-3">
									<CourseCompletionStep course={course} courseId={activeCourseId} />
								</div>

								{/* فوتر الخطوة 4 */}
								<div className="flex shrink-0 items-center justify-between border-t border-border bg-background px-4 py-2.5 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] z-10">
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={() => setStep(3)}
										className="gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
									>
										<IconArrowRight className="size-4" />
										<span>رجوع لتعيين المتدربين</span>
									</Button>

									<div className="flex items-center gap-2">
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={handleSaveDraft}
											className="text-xs font-medium"
										>
											حفظ كمسودة
										</Button>

										<Button
											type="button"
											size="sm"
											onClick={handlePublish}
											disabled={isSubmitting || isUpdatingCourse}
											className="gap-2 text-xs font-semibold cursor-pointer"
										>
											{isSubmitting ? (
												<>
													<Spinner className="size-3.5" />
													<span>جارٍ النشر...</span>
												</>
											) : (
												<>
													<span>نشر الدورة</span>
													<Kbd className="text-white">⌘↵</Kbd>
												</>
											)}
										</Button>
									</div>
								</div>
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>

			{/* نافذة تأكيد الخروج مع وجود بيانات غير محفوظة في الخطوة الأولى */}
			<DiscardConfirmDialog
				open={isDiscardOpen}
				filledFields={filledFields}
				fieldLabels={COURSE_FIELD_LABELS}
				resumeLabel="متابعة إنشاء الدورة"
				onDiscard={() => {
					setIsDiscardOpen(false);
					onOpenChange(false);
				}}
				onResume={() => setIsDiscardOpen(false)}
			/>

			{/* شيت تعيين المدربين المطابق لنظام الفصول والمسارات */}
			<AssignTrackStaffSheet
				open={isStaffSheetOpen}
				onOpenChange={setIsStaffSheetOpen}
				trackName={name || "الدورة"}
				title={isEdit ? "تعيين مدربي الدورة" : "تعيين مدربي الدورة التدريبية"}
				initialSelectedStaffIds={selectedStaffIds}
				onSaveStaff={(ids, staffObjects) => {
					setSelectedStaffIds(ids);
					setSelectedStaffMembers(staffObjects);
					setIsStaffSheetOpen(false);
				}}
			/>

			{/* شيت إنشاء دورة بالذكاء الاصطناعي مع مدير */}
			<AiCourseSheet
				open={isAiSheetOpen}
				onClose={() => setIsAiSheetOpen(false)}
				onCreated={(newCourseId) => {
					setIsAiSheetOpen(false);
					setActiveCourseId(newCourseId);
					setStep(2);
					setFurthest((f) => Math.max(f, 2));
					toast.success("تم إنشاء الدورة بالذكاء الاصطناعي وجاري فتح باني المحتوى");
					onSuccess?.();
				}}
			/>
		</>
	);
}
