import { useState, useEffect, useMemo, useCallback } from "react";
import {
	IconCopy,
	IconPlus,
	IconUserCheck,
	IconUserPlus,
	IconX,
	IconCalendarPlus,
	IconMapPinFilled,
	IconCircle,
	IconDots,
	IconBrandWhatsapp,
	IconCheck,
	IconUser,
	IconSparkles,
	IconSearch,
	IconCube,
	IconCode,
	IconCpu,
	IconRobot,
	IconSchool,
	IconBook,
	IconBooks,
	IconBrain,
	IconAtom,
	IconRocket,
	IconPalette,
	IconMusic,
	IconHeadphones,
	IconBulb,
	IconFlame,
	IconStar,
	IconAward,
	IconHeart,
	IconMoodHappy,
	IconMoodSmile,
	IconUsers,
	IconBallFootball,
	IconChess,
	IconDeviceLaptop,
	IconFlag,
	IconBriefcase,
	IconCompass,
	IconBuilding,
	IconGlobe,
	IconCalculator,
	IconCertificate,
	IconLanguage,
	IconPencil,
	IconTools,
	IconPuzzle,
	IconDiamond,
} from "@tabler/icons-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog";
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
import { Field } from "@/components/ui/field";
import { FieldLabel } from "@/components/common/field-label";
import { FormHeader } from "@/components/common/form-header";
import { FormFooter } from "@/components/common/form-footer";
import { Spinner } from "@/components/ui/spinner";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { useBranches } from "@/features/settings/branches/hooks/use-branches";
import {
	useCreateClassroom,
	useUpdateClassroom,
} from "@/features/services/classrooms/hooks/use-classroom-mutations";
import {
	AGE_GROUPS,
	CATEGORIES,
	LEARNING_MODES,
} from "@/features/services/classrooms/data/constants";
import type { ClassroomResponse, LearningMode } from "@/server/classrooms/classrooms.type";
import { cn } from "@/lib/utils";

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
	"💻", "🤖", "🚀", "🧠", "🎨", "📚", "🎓", "🔬",
	"🧪", "💡", "⭐", "🏆", "🧩", "🎮", "📐", "✏️",
	"⚽", "🏀", "🎯", "👾", "🦄", "🌟", "🎪", "🎭",
	"🎵", "🎸", "🥋", "🌍", "🏕️", "⚡", "🔔", "💼",
	"🏅", "✨", "🔥", "🛸", "🕹️", "📖", "🥇", "🎉",
	"👶", "👦", "👧", "👨‍🏫", "👩‍🏫", "🧑‍💻", "👩‍🔬", "👨‍🎨",
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
		title: "المبرمجون الصغار",
		category: "مختلط",
		ageGroup: "8-12 سنة",
		learningMode: "REMOTE" as LearningMode,
		capacity: 10,
		description: "فصل تدريبي تفاعلي لتعليم أساسيات البرمجة والتفكير المنطقي عبر مشاريع عملية ممتعة.",
		notes: "يتطلب حاسوب شخصي واتصال بالإنترنت.",
		icon: "code",
		color: "blue",
	},
	{
		title: "الروبوت والذكاء الاصطناعي",
		category: "بنين",
		ageGroup: "13-16 سنة",
		learningMode: "IN_PERSON" as LearningMode,
		capacity: 15,
		description: "تطبيق عملي لمشاريع الروبوتات وتحديات الذكاء الاصطناعي في مختبر الابتكار.",
		notes: "الأدوات والمعدات متوفرة داخل المختبر.",
		icon: "robot",
		color: "indigo",
	},
	{
		title: "النطق وتنمية المهارات",
		category: "مختلط",
		ageGroup: "4-7 سنوات",
		learningMode: "IN_PERSON" as LearningMode,
		capacity: 6,
		description: "جلسات جماعية مصغرة لتطوير مهارات التخاطب والنطق والتفاعل الاجتماعي.",
		notes: "متابعة فردية لكل طالب مع تقييم دوري.",
		icon: "brain",
		color: "rose",
	},
	{
		title: "اللغة الإنجليزية التفاعلية",
		category: "بنات",
		ageGroup: "8-12 سنة",
		learningMode: "HYBRID" as LearningMode,
		capacity: 12,
		description: "تطوير مهارات المحادثة والاستماع باللغة الإنجليزية من خلال ألعاب وأنشطة تفاعلية.",
		notes: "حصص حضورية ومتابعة دورية عن بعد.",
		icon: "language",
		color: "emerald",
	},
];

// تصنيفات الفصول الافتراضية للدروب داون
const DEFAULT_CLASSIFICATIONS = [
	"برمجة",
	"ذكاء اصطناعي",
	"روبوتكس",
	"إدارة أعمال",
];

export interface ClassroomDialogProps {
	open: boolean;
	onClose: () => void;
	classroom?: ClassroomResponse | null;
}

export function ClassroomDialog({
	open,
	onClose,
	classroom,
}: ClassroomDialogProps) {
	const isEdit = Boolean(classroom);
	const { staff, isLoading: isStaffLoading } = useStaff();
	const { branches } = useBranches();
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
	const [classificationsList, setClassificationsList] = useState<string[]>(DEFAULT_CLASSIFICATIONS);
	const [newClassificationInput, setNewClassificationInput] = useState<string>("");
	const [learningMode, setLearningMode] = useState<LearningMode | "">("");

	// خيارات إضافية وتفاعلية
	const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
	const [showManagerSection, setShowManagerSection] = useState(false);
	const [showNotice, setShowNotice] = useState(true);
	const [createAnother, setCreateAnother] = useState(false);
	const [notifyWhatsApp, setNotifyWhatsApp] = useState(false);

	const resetForm = useCallback(() => {
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
		setSelectedIcon("cube");
		setSelectedIconType("icon");
		setSelectedColor("blue");
		setIconSearch("");
		setIconPickerOpen(false);
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

			if (matchClass?.[1]) {
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
	};

	const toggleStaff = (id: string) => {
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
		return (
			COLOR_OPTIONS.find((c) => c.id === selectedColor) || COLOR_OPTIONS[0]
		);
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
	};

	const handleSubmit = (e?: React.FormEvent) => {
		if (e) e.preventDefault();
		const trimmedName = name.trim();
		if (!trimmedName) return;

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

		const parsedCapacity = Number(capacity);
		const validCapacity =
			Number.isFinite(parsedCapacity) && parsedCapacity >= 1
				? Math.floor(parsedCapacity)
				: 10;

		const payload = {
			name: trimmedName,
			code: code.trim() || undefined,
			category: category || "مختلط",
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
						onClose();
					},
				},
			);
		} else {
			createClassroom(payload, {
				onSuccess: () => {
					if (createAnother) {
						resetForm();
					} else {
						onClose();
					}
				},
			});
		}
	};

	useHotkey("Mod+Enter", () => handleSubmit(), {
		enabled: open && !isPending && Boolean(name.trim()),
	});

	return (
		<Dialog open={open} onOpenChange={(val) => !val && onClose()}>
			<DialogContent
				dir="rtl"
				showCloseButton={false}
				className="max-w-xl! w-full p-0 gap-0 overflow-hidden"
			>
				<DialogDescription className="sr-only">
					{isEdit ? "نموذج تعديل بيانات الفصل الدراسي" : "نموذج إنشاء وإضافة فصل دراسي جديد"}
				</DialogDescription>

				{/* 1. ترويسة النموذج الموحدة للمنصة (FormHeader) */}
				<FormHeader
					variant="dialog"
					title={isEdit ? "تعديل بيانات الفصل" : "أنشئ فصل جديد"}
					identity={isEdit && classroom ? { name: classroom.name, code: classroom.code } : null}
					onClose={onClose}
					titleActions={
						<div className="flex items-center gap-1.5 ms-2">
							{/* زر أنشئ مع مدير */}
							<Button
								type="button"
								variant={showManagerSection ? "secondary" : "outline"}
								size="sm"
								onClick={() => setShowManagerSection((prev) => !prev)}
								className="h-7 px-2.5 text-xs gap-1.5"
							>
								{showManagerSection ? (
									<IconUserCheck className="size-3.5 text-primary" />
								) : (
									<IconUserPlus className="size-3.5" />
								)}
								<span>أنشئ مع مدير</span>
							</Button>

							{/* زر القوالب الجاهزة */}
							<DropdownMenu dir="rtl" modal={false}>
								<DropdownMenuTrigger asChild>
									<Button
										type="button"
										variant="outline"
										size="sm"
										className="h-7 px-2.5 text-xs gap-1.5"
									>
										<IconCopy className="size-3.5" />
										<span>قالب</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start" className="w-64! min-w-64">
									<DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
										<IconSparkles className="size-3.5 text-amber-500" />
										<span>اختر قالباً جاهزاً</span>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									{CLASSROOM_TEMPLATES.map((tpl) => (
										<DropdownMenuItem
											key={tpl.title}
											onSelect={() => applyTemplate(tpl)}
											className="cursor-pointer flex flex-col items-start gap-0.5 text-right py-1.5"
										>
											<span className="font-medium text-xs text-foreground">
												{tpl.title}
											</span>
											<span className="text-[10px] text-muted-foreground">
												{tpl.category} • {tpl.ageGroup} • {tpl.capacity} طلاب
											</span>
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					}
				/>

				{/* 2. جسم النموذج */}
				<form onSubmit={handleSubmit} className="flex flex-col">
					<div className="space-y-4 p-5 max-h-[70vh] overflow-y-auto">
						{/* الصف الأول: المعرّف (يمين) + زر الأيقونة المنبثق لاختيار رمز ولون الفصل (وسط) + اسم الفصل (يسار) */}
						<div className="flex items-end gap-2.5 w-full">
							{/* 1. حقل المعرّف (في اليمين) */}
							<Field className="w-36 sm:w-44 shrink-0">
								<FieldLabel info="المعرّف الكودي الخاص بالفصل (يُولد تلقائياً إن ترك فارغاً)">
									<Label htmlFor="cls-code" className="text-xs font-semibold flex items-center gap-1.5">
										<span>المعرّف</span>
										<span className="text-[10px] text-muted-foreground font-normal">
											يُولد تلقائياً
										</span>
									</Label>
								</FieldLabel>
								<Input
									id="cls-code"
									value={code}
									onChange={(e) => setCode(e.target.value)}
									placeholder="مثال: PR-02"
									className="w-full h-10 text-xs font-mono text-center sm:text-right bg-muted/40"
								/>
							</Field>

							{/* 2. زر الأيقونة المنبثق لاختيار رمز ولون الفصل (في الوسط بجانب المعرّف) */}
							<div className="shrink-0 mb-0.5">
								<Popover modal={false} open={iconPickerOpen} onOpenChange={setIconPickerOpen}>
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
															selectedIcon === item.id && selectedIconType === "icon";
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

							{/* 3. حقل اسم الفصل (في اليسار مع flex-1 ليأخذ بقية المساحة) */}
							<Field className="flex-1 min-w-0">
								<FieldLabel required info="أدخل اسماً واضحاً ومميزاً للفصل الدراسي">
									<Label htmlFor="cls-name" className="text-xs font-semibold">
										اسم الفصل
									</Label>
								</FieldLabel>
								<Input
									id="cls-name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="للمبرمجين الصغار"
									required
									className="w-full h-10 text-xs text-right"
								/>
							</Field>
						</div>

						{/* حقل وصف الفصل — كامل العرض */}
						<Field>
							<FieldLabel info="وصف توضيحي لطبيعة الفصل الدراسي وأهدافه">
								<Label htmlFor="cls-desc" className="text-xs font-semibold">
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
						<Field>
							<FieldLabel required info="حدد فئة الفصل: مختلط أو بنين أو بنات">
								<Label className="text-xs font-semibold">فئة الفصل</Label>
							</FieldLabel>
							<Select value={category || undefined} onValueChange={setCategory} dir="rtl">
								<SelectTrigger className="w-full h-9 text-xs text-right">
									<SelectValue placeholder="حدد فئة الفصل (مختلط / بنين / بنات)" />
								</SelectTrigger>
								<SelectContent dir="rtl">
									{CATEGORIES.map((cat) => (
										<SelectItem key={cat} value={cat} className="text-xs">
											{cat}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</Field>

						{/* حقل السعة القصوى — كامل العرض */}
						<Field>
							<FieldLabel required info="الحد الأقصى لعدد الطلاب المسموح بانضمامهم">
								<Label htmlFor="cls-capacity" className="text-xs font-semibold">
									السعة القصوى
								</Label>
							</FieldLabel>
							<Input
								id="cls-capacity"
								type="number"
								min={1}
								max={200}
								value={capacity}
								onChange={(e) => setCapacity(e.target.value)}
								placeholder="00"
								className="w-full h-9 text-xs font-mono text-right"
							/>
						</Field>

						{/* حقل ملاحظات أو أهداف لهذا الفصل — كامل العرض */}
						<Field>
							<FieldLabel info="أي متطلبات أو مواعيد أو أهداف خاصة بهذا الفصل">
								<Label htmlFor="cls-notes" className="text-xs font-semibold">
									ملاحظات أو أهداف لهذا الفصل
								</Label>
							</FieldLabel>
							<Input
								id="cls-notes"
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								placeholder="أضف ملاحظات أو أهداف لهذا الفصل..."
								className="w-full h-9 text-xs text-right"
							/>
						</Field>

						{/* قسم تعيين المشرفين والمعلمين (يظهر عند الضغط على أنشئ مع مدير) — كامل العرض */}
						{showManagerSection && (
							<div className="w-full rounded-lg border border-primary/25 bg-primary/5 p-3.5 space-y-2">
								<div className="flex items-center justify-between text-xs font-semibold text-primary">
									<span>المشرفون والمعلمون المسؤولون</span>
									<span className="text-[10px] text-muted-foreground font-mono">
										{selectedStaffIds.length} محدد
									</span>
								</div>

								<div className="max-h-36 overflow-y-auto space-y-1 border rounded-md p-1.5 bg-background">
									{isStaffLoading ? (
										<p className="text-center text-xs text-muted-foreground py-2">
											جاري تحميل المعلمين...
										</p>
									) : staff.length === 0 ? (
										<p className="text-center text-xs text-muted-foreground py-2">
											لا يوجد موظفون متاحون
										</p>
									) : (
										staff.map((s) => {
											const isSelected = selectedStaffIds.includes(s.id);
											return (
												<div
													key={s.id}
													onClick={() => toggleStaff(s.id)}
													className={cn(
														"flex items-center justify-between p-2 rounded cursor-pointer transition-colors text-xs",
														isSelected
															? "bg-primary/10 text-primary font-medium"
															: "hover:bg-muted/50 text-foreground",
													)}
												>
													<div className="flex items-center gap-2">
														<div className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
															{s.name?.[0] || <IconUser className="size-3.5" />}
														</div>
														<span>{s.name}</span>
													</div>
													<div
														className={cn(
															"size-4 rounded border flex items-center justify-center",
															isSelected
																? "bg-primary border-primary text-primary-foreground"
																: "border-border",
														)}
													>
														{isSelected && <IconCheck className="size-3" />}
													</div>
												</div>
											);
										})
									)}
								</div>
							</div>
						)}

						{/* صندوق التنبيه الموحد — كامل العرض */}
						{showNotice && (
							<div className="w-full flex items-center justify-between rounded-lg border border-amber-500/30 bg-amber-500/10 px-3.5 py-2.5 text-xs text-amber-900 dark:text-amber-200">
								<span className="font-medium">
									تنبيه: يمكنك تخطي الخطوات التالية وإضافتها بعد إنشاء الفصل
								</span>
								<Button
									type="button"
									variant="ghost"
									size="icon-xs"
									onClick={() => setShowNotice(false)}
									className="text-amber-700/80 hover:text-amber-900 hover:bg-amber-500/20 dark:text-amber-300/80 dark:hover:text-amber-200"
									title="إغلاق التنبيه"
								>
									<IconX className="size-3.5" />
								</Button>
							</div>
						)}

						{/* الدروب داونز الأربعة المتطابقة تماماً مع الصورة المرفقة كأزرار Drop-down */}
						<div className="flex items-center gap-2 flex-wrap justify-start pt-1">
							{/* 1. الفئة العمرية */}
							<DropdownMenu dir="rtl" modal={false}>
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
								<DropdownMenuContent align="end" className="w-44! min-w-44">
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
											{ageGroup === ag && <IconCheck className="size-3.5 text-primary" />}
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
							<DropdownMenu dir="rtl" modal={false}>
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
								<DropdownMenuContent align="end" className="w-48! min-w-48">
									<DropdownMenuLabel className="px-2 py-1 text-[11px] font-semibold text-muted-foreground">
										اختر الفرع
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									{branches.length > 0 ? (
										branches.map((b) => (
											<DropdownMenuItem
												key={b.id}
												onClick={() => setBranch(b.name)}
												className="cursor-pointer text-xs flex items-center justify-between"
											>
												<span>{b.name}</span>
												{branch === b.name && <IconCheck className="size-3.5 text-primary" />}
											</DropdownMenuItem>
										))
									) : (
										[
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
												{branch === bName && <IconCheck className="size-3.5 text-primary" />}
											</DropdownMenuItem>
										))
									)}
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
							<DropdownMenu dir="rtl" modal={false}>
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
								<DropdownMenuContent align="end" className="w-56! min-w-56 p-1.5">
									<DropdownMenuLabel className="px-2 py-1 text-[11px] font-semibold text-muted-foreground">
										اختر أو أضف تصنيف
									</DropdownMenuLabel>

									{/* حقل تخصيص وإضافة تصنيف جديد */}
									<div
										className="p-1 mb-1.5 border-b"
										onClickCapture={(e) => e.stopPropagation()}
										onKeyDownCapture={(e) => e.stopPropagation()}
										onPointerDownCapture={(e) => e.stopPropagation()}
									>
										<div className="flex items-center gap-1.5">
											<Input
												value={newClassificationInput}
												onChange={(e) => setNewClassificationInput(e.target.value)}
												onKeyDownCapture={(e) => {
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
												disabled={!newClassificationInput.trim()}
												className="h-7 px-2 text-xs shrink-0 gap-1"
											>
												<IconPlus className="size-3" />
												<span>إضافة</span>
											</Button>
										</div>
									</div>

									{/* قائمة التصنيفات المتاحة */}
									<div className="max-h-48 overflow-y-auto space-y-0.5">
										{classificationsList.map((item) => (
											<DropdownMenuItem
												key={item}
												onClick={() => setClassification(item)}
												className="cursor-pointer text-xs flex items-center justify-between"
											>
												<span>{item}</span>
												{classification === item && (
													<IconCheck className="size-3.5 text-primary" />
												)}
											</DropdownMenuItem>
										))}
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
							<DropdownMenu dir="rtl" modal={false}>
								<DropdownMenuTrigger asChild>
									<Button
										type="button"
										variant={learningMode ? "secondary" : "outline"}
										size="sm"
										className="gap-1.5"
									>
										<span className="text-[10px] text-muted-foreground/60 tracking-tighter">•••</span>
										<span>{learningMode ? LEARNING_MODES[learningMode]?.label : "نمط التعلم"}</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-44! min-w-44">
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
											{learningMode === mode && <IconCheck className="size-3.5 text-primary" />}
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
							<DropdownMenu dir="rtl" modal={false}>
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
								<DropdownMenuContent align="start" className="w-48! min-w-48">
									<DropdownMenuItem
										onClick={() => setShowManagerSection((prev) => !prev)}
										className="cursor-pointer text-xs"
									>
										تعيين المشرفين والمعلمين
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => {
											setAgeGroup("");
											setBranch("");
											setClassification("");
											setLearningMode("");
										}}
										className="cursor-pointer text-xs text-destructive"
									>
										إعادة ضبط الخيارات
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>

					{/* 3. شريط الإجراءات السفلي الموحد للمنصة (FormFooter) */}
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
							onClick={onClose}
							disabled={isPending}
						>
							إلغاء
						</Button>

						<Button
							type="submit"
							size="sm"
							disabled={isPending || !name.trim()}
							className="gap-1.5"
						>
							{isPending && <Spinner className="size-3.5" />}
							<span>{isEdit ? "حفظ التعديلات" : "إنشاء الفصل"}</span>
						</Button>
					</FormFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
