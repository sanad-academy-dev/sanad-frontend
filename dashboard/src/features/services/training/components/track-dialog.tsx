import {
	IconArrowsDiagonal,
	IconArrowsDiagonalMinimize2,
	IconAtom,
	IconAward,
	IconBook,
	IconBooks,
	IconBrain,
	IconBrandWhatsapp,
	IconCalendarPlus,
	IconCheck,
	IconCircle,
	IconClock,
	IconCode,
	IconCopy,
	IconCpu,
	IconCube,
	IconDots,
	IconFileDescription,
	IconGlobe,
	IconHeart,
	IconPlus,
	IconRobot,
	IconRocket,
	IconScan,
	IconSchool,
	IconSearch,
	IconSparkles,
	IconStar,
	IconSun,
	IconUsers,
	IconX,
} from "@tabler/icons-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { DiscardConfirmDialog } from "@/components/common/discard-confirm-dialog";
import { FieldLabel } from "@/components/common/field-label";
import { FormFooter } from "@/components/common/form-footer";
import { FormHeader } from "@/components/common/form-header";
import { RichNotesEditor } from "@/components/common/rich-notes-editor";
import { SanadLogo } from "@/components/common/sanad-logo";
import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { AGE_GROUPS } from "@/features/services/classrooms/data/constants";
import {
	useAddClassroomClassification,
	useDeleteClassroomClassification,
} from "@/features/services/classrooms/hooks/use-classroom-mutations";
import { useClassroomClassifications } from "@/features/services/classrooms/hooks/use-classrooms";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { cn } from "@/lib/utils";
import { useCreateTrack, useUpdateTrack } from "../hooks/use-tracks";
import { AssignTrackStaffSheet } from "./assign-track-staff-sheet";
import { TrackAgentPanel } from "./track-agent-panel";
import type { TrackRow } from "./tracks-view";

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

const TRACK_TEMPLATES = [
	{
		id: "digital_registration",
		title: "التسجيل الرقمي",
		description:
			"مسار تدريبي متقدم في استراتيجيات التسجيل الرقمي وإدارة الحملات وتحليل البيانات وتطوير المنظومات الرقمية.",
		notes: "يشمل شهادة إتمام معتمدة وتطبيق عملي على المنصات الرقمية.",
		category: "إدارة أعمال",
		duration: "8 أسابيع",
		ageGroup: "17+ سنة",
		coursesCount: 6,
		price: 8500,
		locationMode: "ONLINE" as const,
		icon: "code",
		Icon: IconFileDescription,
		color: "purple",
	},
	{
		id: "coding_kids",
		title: "مسار البرمجه للاطفال",
		description:
			"مسار تدريبي تأسيسي يهدف لتعليم الأطفال مهارات التفكير البرمجي وبناء الألعاب والتطبيقات التفاعلية.",
		notes: "يتطلب حاسوب شخصي واتصال بالإنترنت والتدريب العملي المستمر.",
		category: "البرمجة والمنطق",
		duration: "6 أسابيع",
		ageGroup: "9-11 سنة",
		coursesCount: 4,
		price: 7000,
		locationMode: "ONLINE" as const,
		icon: "cube",
		Icon: IconCube,
		color: "blue",
	},
	{
		id: "rehab_speech",
		title: "تأهيل النطق والتخاطب الشامل للأطفال",
		description:
			"برنامج إكلينيكي وتأهيلي متكامل لتطوير القدرات اللغوية والتعبيرية لدى الأطفال ذوي صعوبات التواصل.",
		notes: "جلسات جماعية وفردية في العيادة التأهيلية مع أخصائي معتمد.",
		category: "طبي وتأهيلي",
		duration: "8 أسابيع",
		ageGroup: "4-6 سنه",
		coursesCount: 5,
		price: 9500,
		locationMode: "IN_PERSON" as const,
		icon: "brain",
		Icon: IconBrain,
		color: "emerald",
	},
	{
		id: "kdg_teacher",
		title: "إعداد معلمات رياض الأطفال المتقدم",
		description:
			"تأهيل الكادر التعليمي على أحدث استراتيجيات التعلم النشط وإدارة البيئة الصفية التفاعلية.",
		notes: "توفير حقيبة تدريبية وشهادة معتمدة بعد إتمام المسار.",
		category: "تدريب تربوي",
		duration: "4 أسابيع",
		ageGroup: "26+ سنة",
		coursesCount: 3,
		price: 5000,
		locationMode: "ONLINE" as const,
		icon: "school",
		Icon: IconSchool,
		color: "purple",
	},
	{
		id: "ai_tech",
		title: "الذكاء الاصطناعي والتكنولوجيا المتقدمة",
		description:
			"رحلة تعليمية تطبيقية تركز على استخدام أدوات الذكاء الاصطناعي وحل المشكلات بأساليب مبتكرة.",
		notes: "تدريب تطبيقي على نماذج الذكاء الاصطناعي وأدوات التطوير الحديثة.",
		category: "ذكاء اصطناعي",
		duration: "8 أسابيع",
		ageGroup: "15-17 سنة",
		coursesCount: 4,
		price: 8500,
		locationMode: "HYBRID" as const,
		icon: "robot",
		Icon: IconRobot,
		color: "amber",
	},
];

const TRACK_FIELD_LABELS: Record<string, string> = {
	name: "اسم المسار",
	code: "المعرّف",
	description: "الوصف",
	notes: "الملاحظات والأفكار",
	category: "التصنيف",
	duration: "مدة المسار",
	ageGroup: "الفئة العمرية",
	selectedTrainer: "المدرب",
	price: "السعر",
	coursesCount: "عدد الدورات",
};

export interface TrackDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	track?: TrackRow | null;
	onSuccess?: (track: TrackRow) => void;
}

export function TrackDialog({ open, onOpenChange, track, onSuccess }: TrackDialogProps) {
	const isEdit = Boolean(track);
	useStaff();
	const { classifications: backendClassifications, isLoading: isClassificationsLoading } =
		useClassroomClassifications();
	const { mutate: addClassificationMutation, isPending: isAddingClassification } =
		useAddClassroomClassification();
	const { mutate: deleteClassificationMutation } = useDeleteClassroomClassification();
	const { mutate: createTrackMutation, isPending: isCreatingTrack } = useCreateTrack();
	const { mutate: updateTrackMutation, isPending: isUpdatingTrack } = useUpdateTrack();

	// الحقول الأساسية
	const [name, setName] = useState("");
	const [code, setCode] = useState("");
	const [description, setDescription] = useState("");
	const [notes, setNotes] = useState("");
	const [selectedIcon, setSelectedIcon] = useState("cube");
	const [selectedColor, setSelectedColor] = useState("blue");
	const [iconPickerOpen, setIconPickerOpen] = useState(false);
	const [iconSearch, setIconSearch] = useState("");

	// الخيارات الإضافية (الشرائح/الخطوات)
	const [ageGroup, setAgeGroup] = useState("");
	const [category, setCategory] = useState("");
	const [classificationsList, setClassificationsList] = useState<string[]>([]);
	const [newClassificationInput, setNewClassificationInput] = useState("");
	const [selectedTrainer, setSelectedTrainer] = useState("");
	const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
	const [selectedStaffMembers, setSelectedStaffMembers] = useState<
		{ id: string; name: string; avatar?: string }[]
	>([]);
	const [isStaffSheetOpen, setIsStaffSheetOpen] = useState(false);
	const [duration, setDuration] = useState("");
	const [coursesCount, setCoursesCount] = useState(4);
	const [price, setPrice] = useState(7000);
	const [locationMode, setLocationMode] = useState<"ONLINE" | "IN_PERSON" | "HYBRID">(
		"ONLINE",
	);

	// خيارات الفوتر والتحكم والقوالب
	const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>("none");
	const [templateSearch, setTemplateSearch] = useState("");
	const [templateMenuOpen, setTemplateMenuOpen] = useState(false);
	const [notifyWhatsApp, setNotifyWhatsApp] = useState(false);
	const [createAnother, setCreateAnother] = useState(false);
	const [showNotice, setShowNotice] = useState(true);
	const [isAgentOpen, setIsAgentOpen] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	const [isDiscardOpen, setIsDiscardOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// تعبئة البيانات عند الفتح أو التعديل
	useEffect(() => {
		if (open) {
			if (track) {
				setName(track.name);
				setCode(track.code);
				setDescription(track.description || "");
				setNotes(track.notes || "");
				setCategory(track.category || "");
				setDuration(track.duration || "");
				setCoursesCount(track.coursesCount);
				setPrice(track.price);
				setLocationMode(track.locationMode);
				setSelectedTrainer(track.trainers?.[0]?.name ?? "");
				setSelectedStaffIds((track.trainers || []).map((t) => t.id));
				setSelectedStaffMembers(track.trainers || []);
				setAgeGroup(track.ageGroup || "");
				setSelectedIcon(track.selectedIcon || "cube");
				setSelectedColor(track.selectedColor || "blue");
			} else {
				setName("");
				setCode(`PR-${Math.floor(10 + Math.random() * 90)}`);
				setDescription("");
				setNotes("");
				setCategory("");
				setDuration("");
				setCoursesCount(4);
				setPrice(7000);
				setLocationMode("ONLINE");
				setSelectedTrainer("");
				setSelectedStaffIds([]);
				setSelectedStaffMembers([]);
				setAgeGroup("");
				setSelectedIcon("cube");
				setSelectedColor("blue");
			}
			setSelectedTemplateId("none");
			setTemplateSearch("");
			setShowNotice(true);
			setIsDiscardOpen(false);
			setIsExpanded(false);
		}
	}, [open, track]);

	// قائمة التصنيفات المدمجة من الـ API والتصنيفات الافتراضية
	const mergedClassifications = useMemo(() => {
		const set = new Set([
			...DEFAULT_CLASSIFICATIONS,
			...(backendClassifications || []),
			...classificationsList,
		]);
		return Array.from(set).filter(Boolean);
	}, [backendClassifications, classificationsList]);

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

	// تصفية قوالب المسارات بناءً على حقل البحث
	const filteredTemplates = useMemo(() => {
		if (!templateSearch.trim()) return TRACK_TEMPLATES;
		const query = templateSearch.trim().toLowerCase();
		return TRACK_TEMPLATES.filter(
			(tpl) =>
				tpl.title.toLowerCase().includes(query) ||
				tpl.description.toLowerCase().includes(query) ||
				tpl.category.toLowerCase().includes(query),
		);
	}, [templateSearch]);

	// الحقل المطلوب الوحيد حالياً: اسم المسار التدريبي (بناءً على متطلبات التحديث)
	const formProgress = useMemo(() => {
		const trimmedName = name.trim();
		const isNameFilled = trimmedName.length >= 2;

		let filled = 0;
		if (isNameFilled) filled++;

		const requiredCount = 1;
		const progress = Math.round((filled / requiredCount) * 100);
		const isComplete = filled === requiredCount;

		return {
			filledCount: filled,
			requiredCount,
			progress,
			isComplete,
		};
	}, [name]);

	// فحص وجود تعديلات غير محفوظة
	const isDirty = useMemo(() => {
		const originalStaffKey = (track?.trainers || [])
			.map((t) => t.id)
			.sort()
			.join(",");
		const currentStaffKey = [...selectedStaffIds].sort().join(",");

		if (isEdit)
			return (
				name !== (track?.name || "") ||
				notes !== (track?.notes || "") ||
				description !== (track?.description || "") ||
				category !== (track?.category || "") ||
				duration !== (track?.duration || "") ||
				ageGroup !== (track?.ageGroup || "") ||
				currentStaffKey !== originalStaffKey ||
				selectedIcon !== (track?.selectedIcon || "cube") ||
				selectedColor !== (track?.selectedColor || "blue")
			);
		return Boolean(
			name.trim() ||
				description.trim() ||
				notes.trim() ||
				ageGroup ||
				selectedStaffIds.length > 0 ||
				category ||
				duration,
		);
	}, [
		name,
		description,
		notes,
		ageGroup,
		selectedStaffIds,
		category,
		duration,
		selectedIcon,
		selectedColor,
		isEdit,
		track,
	]);

	const filledFields = useMemo(() => {
		const list: string[] = [];
		if (name.trim()) list.push("name");
		if (description.trim()) list.push("description");
		if (notes.trim()) list.push("notes");
		if (category) list.push("category");
		if (ageGroup) list.push("ageGroup");
		if (selectedTrainer) list.push("selectedTrainer");
		if (duration) list.push("duration");
		return list;
	}, [name, description, notes, category, ageGroup, selectedTrainer, duration]);

	const handleSelectTemplate = (tpl: (typeof TRACK_TEMPLATES)[0] | null) => {
		if (!tpl) {
			setSelectedTemplateId("none");
			setName("");
			setDescription("");
			setNotes("");
			setCategory("");
			setDuration("");
			setAgeGroup("");
			setSelectedTrainer("");
			setSelectedIcon("cube");
			setSelectedColor("blue");
			setCoursesCount(4);
			setPrice(7000);
			setLocationMode("ONLINE");
			setTemplateMenuOpen(false);
			toast.info("تم تفريغ الحقول والبدء بدون قالب");
			return;
		}

		setSelectedTemplateId(tpl.id);
		setName(tpl.title);
		setDescription(tpl.description);
		setNotes(tpl.notes || "");
		setCategory(tpl.category);
		setDuration(tpl.duration);
		setAgeGroup(tpl.ageGroup);
		setCoursesCount(tpl.coursesCount);
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

	// إضافة تصنيف مخصص وحفظه عبر الـ API
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

		// حفظ التصنيف بالخادم ومزامنته مع باقي أجزاء المنصة عبر الـ API
		addClassificationMutation(trimmed);
	};

	// إرسال النموذج وحفظه بالباك إند وقاعدة البيانات
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) {
			toast.error("يرجى إدخال اسم المسار التدريبي");
			return;
		}

		setIsSubmitting(true);

		const locLabelMap = {
			ONLINE: "أونلاين",
			IN_PERSON: "حضوري",
			HYBRID: "مدمج",
		};

		const payload = {
			name: name.trim(),
			code: code || `PR-${Math.floor(10 + Math.random() * 90)}`,
			category: category.trim(),
			coursesCount,
			locationMode,
			locationLabel: locLabelMap[locationMode],
			trainers: selectedStaffMembers.map((s) => ({
				id: s.id,
				name: s.name,
				avatar: s.avatar,
			})),
			staffIds: selectedStaffIds,
			duration: duration.trim(),
			studentsCount: track?.studentsCount ?? 0,
			price,
			revenue: track?.revenue ?? (track ? track.revenue : 0),
			status: track?.status ?? "ACTIVE",
			description: description.trim(),
			notes: notes.trim(),
			ageGroup: ageGroup.trim() || undefined,
			selectedIcon,
			selectedColor,
		};

		if (isEdit && track) {
			updateTrackMutation(
				{ id: track.id, data: payload },
				{
					onSuccess: (saved) => {
						setIsSubmitting(false);
						onSuccess?.(saved);
						onOpenChange(false);
					},
					onError: () => {
						setIsSubmitting(false);
					},
				},
			);
		} else {
			createTrackMutation(payload, {
				onSuccess: (created) => {
					setIsSubmitting(false);
					onSuccess?.(created);
					if (createAnother) {
						setName("");
						setCode(`PR-${Math.floor(10 + Math.random() * 90)}`);
						setDescription("");
						setNotes("");
					} else {
						onOpenChange(false);
					}
				},
				onError: () => {
					setIsSubmitting(false);
				},
			});
		}
	};

	return (
		<>
			<Dialog
				open={open}
				onOpenChange={(next) => {
					if (!next) handleCloseAttempt();
					else onOpenChange(true);
				}}
			>
				<DialogContent
					dir="rtl"
					showCloseButton={false}
					className={cn(
						"p-0 gap-0 overflow-hidden rounded-xl bg-card border border-border/80 shadow-2xl transition-all duration-300 ease-out",
						isAgentOpen
							? "sm:max-w-5xl xl:max-w-6xl max-w-[96vw]"
							: isExpanded
								? "sm:max-w-4xl max-w-[96vw]"
								: "sm:max-w-[560px] max-w-[94vw]",
					)}
					onInteractOutside={(e) => {
						if (isDiscardOpen || isStaffSheetOpen) {
							e.preventDefault();
							return;
						}
						if (!isEdit && isDirty) {
							e.preventDefault();
							setIsDiscardOpen(true);
						}
					}}
					onEscapeKeyDown={(e) => {
						if (isStaffSheetOpen) {
							e.preventDefault();
							return;
						}
						if (!isEdit && isDirty) {
							e.preventDefault();
							setIsDiscardOpen(true);
						}
					}}
				>
					<div className="flex flex-col md:flex-row w-full items-stretch overflow-hidden max-h-[88vh]">
						{/* الجانب الأساسي: نموذج إنشاء المسار */}
						<div
							className={cn(
								"flex flex-col min-h-0 bg-background transition-all duration-300 ease-out",
								isAgentOpen ? "w-full md:w-1/2 flex-1 min-w-0" : "w-full flex-1 min-w-0",
							)}
						>
							{/* 1. الترويسة الموحدة مع أزرار القالب والإنشاء مع سند والتوسيع ومؤشر الإنجاز */}
							<FormHeader
								variant="dialog"
								size="sm"
								title={isEdit ? "تعديل المسار" : "أنشئ مسار جديد"}
								identity={isEdit && track ? { name: track.name, code: track.code } : null}
								progress={formProgress}
								onClose={isAgentOpen ? undefined : handleCloseAttempt}
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
												{/* حقل البحث العلوي */}
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
											onClick={() => setIsAgentOpen((prev) => !prev)}
											className={cn(
												"h-6 px-2 text-[11px] gap-1 rounded-full border border-border bg-white dark:bg-card hover:bg-muted font-medium cursor-pointer flex items-center shrink-0 transition-all",
												isAgentOpen &&
													"bg-primary/10 border-primary/40 text-primary font-semibold shadow-2xs",
											)}
											title="أنشئ مع سند"
											aria-label="أنشئ مع سند"
										>
											<SanadLogo
												iconOnly
												className="h-3 w-auto shrink-0"
											/>
											<span className="whitespace-nowrap">أنشئ مع سند</span>
										</Button>
									</div>
								}
							/>

							{/* 2. جسم النموذج القابل للتمرير */}
							<form
								onSubmit={handleSubmit}
								className="flex flex-col flex-1 min-h-0 overflow-hidden"
							>
								<div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
									{/* السطر الأول: المعرّف (يمين) واسم الدورة/المسار مع أيقونة المكعب (يسار) */}
									<div className="space-y-1.5">
										{/* تسميات الحقول جنباً إلى جنب */}
										<div className="flex items-center gap-2.5 w-full">
											{/* المعرف يميناً */}
											<div className="w-36 sm:w-44 shrink-0">
												<FieldLabel info="يُولد تلقائياً بتسلسل نظامي ويمكنك تعديله">
													<Label
														htmlFor="trk-code"
														className="text-xs font-semibold text-muted-foreground"
													>
														المعرّف{" "}
														<span className="font-normal text-[11px]">يُولد تلقائياً</span>
													</Label>
												</FieldLabel>
											</div>

											{/* فراغ محاذاة للأيقونة */}
											<div
												className="w-10 shrink-0"
												aria-hidden="true"
											/>

											{/* تسمية اسم الدورة / المسار يساراً */}
											<div className="flex-1 min-w-0">
												<FieldLabel
													required
													info="اسم المسار التعليمي أو التدريبي"
												>
													<Label
														htmlFor="trk-name"
														className="text-xs font-semibold"
													>
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
													id="trk-code"
													value={code}
													onChange={(e) => setCode(e.target.value)}
													placeholder="مثال: PR-02"
													className="w-full h-10 text-xs font-mono text-center sm:text-right bg-muted/40"
												/>
											</div>

											{/* زر الأيقونة المنبثق لاختيار رمز ولون المسار */}
											<div className="shrink-0 w-10 flex items-center justify-center">
												<Popover
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
															title="اختر رمز ولون المسار"
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

											{/* حقل اسم المسار / الدورة */}
											<div className="flex-1 min-w-0">
												<Input
													id="trk-name"
													value={name}
													onChange={(e) => setName(e.target.value)}
													placeholder="مثال: البرمجه للأطفال"
													className="w-full h-10 text-xs text-right font-medium"
													required
												/>
											</div>
										</div>
									</div>

									{/* السطر الثاني: وصف المسار */}
									<Field className="space-y-1.5">
										<FieldLabel info="وصف شامل لأهداف المسار التدريبي ومخرجاته">
											<Label
												htmlFor="trk-desc"
												className="text-xs font-semibold"
											>
												وصف المسار
											</Label>
										</FieldLabel>
										<div className="rounded-lg border border-border/80 bg-background overflow-hidden focus-within:ring-1 focus-within:ring-primary">
											<Textarea
												id="trk-desc"
												value={description}
												onChange={(e) => setDescription(e.target.value)}
												placeholder="أضف وصف..."
												rows={4}
												className="w-full text-xs text-right resize-none border-0 focus-visible:ring-0 p-3 shadow-none bg-transparent"
											/>
										</div>
									</Field>

									{/* محرر الملاحظات والأفكار التفاعلي الموحد (RichNotesEditor) — بوردر علوي فقط مطابق للتصميم */}
									<div className="mt-2">
										<RichNotesEditor
											id="trk-notes"
											value={notes}
											onChange={setNotes}
											placeholder="أضف أفكار أو أهداف لهذا المسار..."
											variant="border-top-only"
											minHeight={50}
										/>
									</div>
								</div>

								{/* 3. شريط التحكم والإجراءات السفلي الثابت */}
								<div className="shrink-0 bg-background border-t border-border flex flex-col z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
									{/* أ) رسالة التنبيه الصفراء المطابقة للصورة تماماً مع زر الإغلاق */}
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

									{/* ب) شريط شرائح الخطوات الإضافية (الفئة العمرية، التصنيف، المدرب، المدة، والخيارات) */}
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
													className="gap-1.5 h-8 text-xs font-normal"
												>
													<IconCalendarPlus className="size-3.5 shrink-0 text-muted-foreground" />
													<span>{ageGroup || "بدون فئة عمرية"}</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent
												align="end"
												className="w-48! min-w-48 p-1.5"
											>
												<DropdownMenuLabel className="px-2 py-1 text-[11px] font-semibold text-muted-foreground">
													الفئة العمرية
												</DropdownMenuLabel>
												<DropdownMenuSeparator className="my-1" />

												{/* خيار بدون فئة عمرية في الأعلى */}
												<DropdownMenuItem
													onClick={() => setAgeGroup("")}
													className={cn(
														"cursor-pointer text-xs flex items-center justify-between px-2.5 py-1.5 rounded-md",
														!ageGroup && "bg-muted font-medium text-foreground",
													)}
												>
													<span>بدون فئة عمرية</span>
													{!ageGroup && <IconCheck className="size-3.5 text-primary" />}
												</DropdownMenuItem>
												<DropdownMenuSeparator className="my-1" />

												<div className="max-h-48 overflow-y-auto space-y-0.5">
													{AGE_GROUPS.map((ag) => (
														<DropdownMenuItem
															key={ag}
															onClick={() => setAgeGroup(ag)}
															className={cn(
																"cursor-pointer text-xs flex items-center justify-between px-2.5 py-1.5 rounded-md",
																ageGroup === ag && "bg-muted font-medium text-foreground",
															)}
														>
															<span>{ag}</span>
															{ageGroup === ag && (
																<IconCheck className="size-3.5 text-primary" />
															)}
														</DropdownMenuItem>
													))}
												</div>
											</DropdownMenuContent>
										</DropdownMenu>

										{/* 2. التصنيف المربوط بالـ API وإضافة/حذف التصنيفات المطابق لنموذج الفصل */}
										<DropdownMenu
											dir="rtl"
											modal={false}
										>
											<DropdownMenuTrigger asChild>
												<Button
													type="button"
													variant={category ? "secondary" : "outline"}
													size="sm"
													className="gap-1.5 h-8 text-xs font-normal"
												>
													<IconCircle className="size-3.5 text-muted-foreground/70 shrink-0" />
													<span>{category || "بدون تصنيف"}</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent
												align="end"
												className="w-56! min-w-56 p-1.5"
											>
												<DropdownMenuLabel className="px-2 py-1 text-[11px] font-semibold text-muted-foreground">
													التصنيف
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

												{/* خيار بدون تصنيف في الأعلى */}
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

										{/* 3. تعيين الموظف/المدرب عبر السايد شيت المطابق للفصول */}
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

										{/* 4. المدة للفترة */}
										<DropdownMenu
											dir="rtl"
											modal={false}
										>
											<DropdownMenuTrigger asChild>
												<Button
													type="button"
													variant={duration ? "secondary" : "outline"}
													size="sm"
													className="gap-1.5 h-8 text-xs font-normal"
												>
													<IconClock className="size-3.5 shrink-0 text-muted-foreground" />
													<span>{duration ? `... ${duration}` : "... بدون مدة"}</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent
												align="end"
												className="w-44! min-w-44 p-1.5"
											>
												<DropdownMenuLabel className="px-2 py-1 text-[11px] font-semibold text-muted-foreground">
													فترة المسار التدريبي
												</DropdownMenuLabel>
												<DropdownMenuSeparator className="my-1" />

												{/* خيار بدون مدة في الأعلى */}
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
													className="size-8"
													title="خيارات إضافية للمسار"
												>
													<IconDots className="size-4 text-muted-foreground" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent
												align="start"
												className="w-52! min-w-52 p-2 space-y-2"
											>
												{/* <div className="space-y-1">
											<span className="text-[11px] font-semibold text-muted-foreground block">
												مكان المسار
											</span>
											<div className="grid grid-cols-3 gap-1">
												{(["ONLINE", "IN_PERSON", "HYBRID"] as const).map((mode) => (
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
														{mode === "ONLINE" ? "أونلاين" : mode === "IN_PERSON" ? "حضوري" : "مدمج"}
													</button>
												))}
											</div>
										</div>

										<div className="space-y-1 pt-1 border-t">
											<span className="text-[11px] font-semibold text-muted-foreground block">
												عدد الدورات
											</span>
											<Input
												type="number"
												min={1}
												value={coursesCount}
												onChange={(e) => setCoursesCount(Number.parseInt(e.target.value, 10) || 1)}
												className="h-7 text-xs"
											/>
										</div> */}

												<div className="space-y-1 pt-1 border-t">
													<span className="text-[11px] font-semibold text-muted-foreground block">
														السعر (ج.م)
													</span>
													<Input
														type="number"
														min={0}
														value={price}
														onChange={(e) =>
															setPrice(Number.parseInt(e.target.value, 10) || 0)
														}
														className="h-7 text-xs"
													/>
												</div>

												<div className="pt-1 border-t">
													<button
														type="button"
														onClick={() => setIsStaffSheetOpen(true)}
														className="w-full flex items-center justify-between text-xs py-1.5 px-2 rounded hover:bg-accent text-right cursor-pointer"
													>
														<span className="font-semibold text-foreground">تعيين موظف</span>
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

								{/* 3. شريط الإجراءات والفوتر الموحد (FormFooter) */}
								<div className="p-3 border-t bg-muted/20 shrink-0">
									<FormFooter
										continueAdding={createAnother}
										onContinueAddingChange={!isEdit ? setCreateAnother : undefined}
										disabled={isSubmitting || isCreatingTrack || isUpdatingTrack}
										showShortcut={true}
										extra={
											<div className="flex items-center gap-2 text-xs text-muted-foreground">
												<IconBrandWhatsapp className="size-4 text-emerald-600" />
												<span>إشعار عبر الواتساب</span>
												<Switch
													checked={notifyWhatsApp}
													onCheckedChange={setNotifyWhatsApp}
													disabled={isSubmitting || isCreatingTrack || isUpdatingTrack}
												/>
											</div>
										}
									>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={handleCloseAttempt}
											disabled={isSubmitting || isCreatingTrack || isUpdatingTrack}
										>
											إلغاء
										</Button>

										<Button
											type="submit"
											size="sm"
											disabled={
												isSubmitting || isCreatingTrack || isUpdatingTrack || !name.trim()
											}
											className={cn(
												"gap-1.5 font-semibold transition-all shadow-xs",
												!name.trim() && "opacity-50 cursor-not-allowed",
											)}
										>
											{(isSubmitting || isCreatingTrack || isUpdatingTrack) && (
												<Spinner className="size-3.5" />
											)}
											<span>{isEdit ? "حفظ التعديلات" : "إنشاء الدورة ⤶"}</span>
										</Button>
									</FormFooter>
								</div>
							</form>
						</div>

						{/* لوحة المساعد الذكي سند (AI Agent Panel) */}
						{isAgentOpen && (
							<TrackAgentPanel
								onClose={() => setIsAgentOpen(false)}
								onCloseDialog={handleCloseAttempt}
								onApplyData={(data) => {
									if (data.name !== undefined) setName(data.name);
									if (data.code !== undefined) setCode(data.code);
									if (data.description !== undefined) setDescription(data.description);
									if (data.notes !== undefined) setNotes(data.notes);
									if (data.category !== undefined) setCategory(data.category);
									if (data.duration !== undefined) setDuration(data.duration);
									if (data.ageGroup !== undefined) setAgeGroup(data.ageGroup);
									if (data.coursesCount !== undefined) setCoursesCount(data.coursesCount);
									if (data.price !== undefined) setPrice(data.price);
									if (data.selectedTrainer !== undefined)
										setSelectedTrainer(data.selectedTrainer);
									if (data.locationMode !== undefined) setLocationMode(data.locationMode);
								}}
								currentValues={{
									name,
									code,
									description,
									notes,
									category,
									duration,
									ageGroup,
									coursesCount,
									price,
									selectedTrainer,
									locationMode,
								}}
							/>
						)}
					</div>
				</DialogContent>
			</Dialog>

			{/* نافذة تأكيد الخروج مع وجود بيانات غير محفوظة */}
			<DiscardConfirmDialog
				open={isDiscardOpen}
				filledFields={filledFields}
				fieldLabels={TRACK_FIELD_LABELS}
				resumeLabel="متابعة إنشاء المسار"
				onDiscard={() => {
					setIsDiscardOpen(false);
					onOpenChange(false);
				}}
				onResume={() => setIsDiscardOpen(false)}
			/>

			{/* سايد شيت تعيين وتعديل الموظفين المطابق للتصميم الموحد للفصول */}
			<AssignTrackStaffSheet
				open={isStaffSheetOpen}
				onOpenChange={setIsStaffSheetOpen}
				track={track}
				trackName={name || track?.name}
				title={isEdit ? "تعيين موظفي المسار" : "تعيين موظفي المسار الجديد"}
				initialSelectedStaffIds={selectedStaffIds}
				onSaveStaff={(ids, staffObjects) => {
					setSelectedStaffIds(ids);
					setSelectedStaffMembers(staffObjects);
					setIsStaffSheetOpen(false);
				}}
			/>
		</>
	);
}
