import {
	IconArrowRight,
	IconArrowsDiagonal,
	IconArrowsDiagonalMinimize2,
	IconAward,
	IconBook,
	IconBooks,
	IconBrain,
	IconBulb,
	IconCheck,
	IconClipboardCheck,
	IconCode,
	IconCopy,
	IconCpu,
	IconCube,
	IconFileCheck,
	IconFileDescription,
	IconFileText,
	IconGlobe,
	IconHeart,
	IconLayoutGrid,
	IconMapPin,
	IconPlus,
	IconRocket,
	IconRoute,
	IconScan,
	IconSchool,
	IconSearch,
	IconSparkles,
	IconStar,
	IconX,
} from "@tabler/icons-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { DiscardConfirmDialog } from "@/components/common/discard-confirm-dialog";
import { FieldLabel } from "@/components/common/field-label";
import { FormFooter } from "@/components/common/form-footer";
import { FormHeader } from "@/components/common/form-header";
import { RichNotesEditor } from "@/components/common/rich-notes-editor";
import { Spinner } from "@/components/common/spinner";
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
import { Textarea } from "@/components/ui/textarea";
import { useAcademicStageOptions } from "@/features/services/classrooms/hooks/use-classrooms";
import {
	type SheetStep,
	SheetStepper,
} from "@/features/services/training/components/sheet-stepper";
import { useAcademicStages } from "@/features/settings/academic-stages/hooks/use-academic-stages";
import { useTrackClassifications } from "@/features/settings/tracks/hooks/use-track-classifications";
import type { FormProgress } from "@/hooks/use-form-progress";
import { cn } from "@/lib/utils";
import type { TrainingPage, TrainingPagePayload } from "../hooks/use-training-pages";
import { CoursePageContent } from "./course-page-content";
import { CoursePageBlocksField, createInitialPageContent } from "./course-page-inline-editor";

const PAGE_STEPS: readonly SheetStep[] = [
	{ step: 1, title: "المعلومات الأساسية", icon: IconLayoutGrid },
	{ step: 2, title: "إضافة وبناء المحتوى", icon: IconClipboardCheck },
] as const;

export const DEFAULT_ACADEMIC_STAGES = [
	"رياض الأطفال",
	"المرحلة الابتدائية",
	"المرحلة المتوسطة",
	"المرحلة الثانوية",
	"المرحلة الجامعية",
];

export const DEFAULT_CLASSIFICATIONS = [
	"عام وتوجيهي",
	"طبي وتأهيلي",
	"إداري وتنظيمي",
	"تربوي وأكاديمي",
	"تقني وتطويري",
	"برمجة",
	"ذكاء اصطناعي",
];

export const POPULAR_ICONS = [
	{ id: "file-text", name: "ملف ومستند", icon: IconFileText },
	{ id: "file-description", name: "تقرير وتوصيف", icon: IconFileDescription },
	{ id: "book", name: "كتاب وقراءة", icon: IconBook },
	{ id: "books", name: "كتب ومكتبة", icon: IconBooks },
	{ id: "code", name: "برمجة وكود", icon: IconCode },
	{ id: "cpu", name: "تقنية ومعالج", icon: IconCpu },
	{ id: "cube", name: "مكعب فضاء", icon: IconCube },
	{ id: "sparkles", name: "تميز ولمعان", icon: IconSparkles },
	{ id: "school", name: "أكاديمية ومدرسة", icon: IconSchool },
	{ id: "brain", name: "عقل وذكاء", icon: IconBrain },
	{ id: "bulb", name: "أفكار وإلهام", icon: IconBulb },
	{ id: "rocket", name: "انطلاق متقدم", icon: IconRocket },
	{ id: "star", name: "نجمة تفوق", icon: IconStar },
	{ id: "award", name: "شهادة وجائزة", icon: IconAward },
	{ id: "heart", name: "رعاية وصحة", icon: IconHeart },
	{ id: "globe", name: "عالم ودولي", icon: IconGlobe },
];

export const COLOR_OPTIONS = [
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

export const PAGE_TEMPLATES = [
	{
		id: "policy_doc",
		title: "دليل سياسات العمل والإجراءات التنفيذية",
		summary:
			"وثيقة توجيهية تنظيمية توضح السياسات العامة المعتمدة وضوابط العمل والجودة داخل المنظومة.",
		notes: "تحديث سنوي معتمد من قسم الجودة والتطوير.",
		category: "إداري وتنظيمي",
		academicStage: "المرحلة الجامعية",
		locationMode: "ONLINE" as const,
		icon: "file-text",
		color: "blue",
	},
	{
		id: "clinical_guide",
		title: "دليل أفضل الممارسات ومنهجية العمل الإكلينيكي",
		summary:
			"بروتوكول تفصيلي لمعايير الرعاية والتأهيل السلوكي والنفسي وفق أعلى المعايير الطبية المعتمدة.",
		notes: "يتطلب مراجعة من المشرف الطبي والإكلينيكي قبل البدء.",
		category: "طبي وتأهيلي",
		academicStage: "المرحلة الجامعية",
		locationMode: "IN_PERSON" as const,
		icon: "heart",
		color: "emerald",
	},
	{
		id: "trainee_orientation",
		title: "المقدمة والتعليمات العامة للمسار التدريبي",
		summary:
			"مستند إرشادي تمهيدي يوضح أهداف المسار، آلية التقييم، وجدول المواعيد واللقاءات التفاعلية.",
		notes: "يُفضل الاطلاع عليه قبل البدء في دراسة المحاضرات.",
		category: "عام وتوجيهي",
		academicStage: "المرحلة الثانوية",
		locationMode: "ONLINE" as const,
		icon: "book",
		color: "purple",
	},
	{
		id: "code_of_conduct",
		title: "ميثاق السلوك المهني ومعايير التقييم والاعتماد",
		summary:
			"لائحة الحقوق والمسؤوليات المهنية وأخلاقيات التعامل المهني بين المتدربين وفريق الإشراف.",
		notes: "إلزامي القراءة والموافقة لجميع المنتسبين.",
		category: "تربوي وأكاديمي",
		academicStage: "المرحلة الثانوية",
		locationMode: "HYBRID" as const,
		icon: "award",
		color: "amber",
	},
];

export const cleanPageSummary = (text?: string | null): string => {
	if (!text) return "";
	let cleaned = text;
	cleaned = cleaned
		.replace(/(?:\[(?:stage|المرحلة):[^\]]+\]|\n?(?:stage|المرحلة):[^\n]+)/gi, "")
		.replace(/(?:\[(?:code|رمز|كود):[^\]]+\])/gi, "")
		.replace(/(?:\[icon:[^\]]+\])/gi, "")
		.replace(/(?:\[color:[^\]]+\])/gi, "")
		.replace(/(?:\[notes:[^\]]+\])/gi, "")
		.replace(/(?:\[(?:location|مكان):[^\]]+\])/gi, "")
		.replace(/(?:\[(?:duration|مدة):[^\]]+\])/gi, "");
	return cleaned.trim();
};

export const extractSystemTag = (text: string | null | undefined, tag: string): string => {
	if (!text) return "";
	const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const regex = new RegExp(`\\[${escaped}:([^\\]]+)\\]`, "i");
	const match = text.match(regex);
	return match?.[1]?.trim() || "";
};

export const extractNotesTag = (text: string | null | undefined): string => {
	if (!text) return "";
	const match = text.match(/\[notes:([\s\S]*?)\]/i);
	return match?.[1]?.trim() || "";
};

export interface PageDialogProps {
	open: boolean;
	onClose: () => void;
	page?: TrainingPage | null;
	onSave: (payload: TrainingPagePayload) => Promise<unknown>;
}

export function PageDialog({ open, onClose, page, onSave }: PageDialogProps) {
	const isEdit = Boolean(page);

	// خطوات المعالج
	const [step, setStep] = useState<1 | 2>(1);
	const [furthest, setFurthest] = useState<number>(1);

	// الحقول الأساسية
	const [title, setTitle] = useState("");
	const [code, setCode] = useState("");
	const [summary, setSummary] = useState("");
	const [notes, setNotes] = useState("");
	const [category, setCategory] = useState("عام وتوجيهي");
	const [academicStage, setAcademicStage] = useState("");
	const [locationMode, setLocationMode] = useState<"ONLINE" | "IN_PERSON" | "HYBRID" | "">("");
	const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
	const [content, setContent] = useState("");

	// الأيقونة واللون
	const [selectedIcon, setSelectedIcon] = useState("file-text");
	const [selectedColor, setSelectedColor] = useState("blue");
	const [iconPickerOpen, setIconPickerOpen] = useState(false);
	const [iconSearch, setIconSearch] = useState("");

	// القوالب الجاهزة
	const [templateMenuOpen, setTemplateMenuOpen] = useState(false);
	const [selectedTemplateId, setSelectedTemplateId] = useState<string>("none");
	const [templateSearch, setTemplateSearch] = useState("");

	// المراحل والتصنيفات الحية
	const [newStageInput, setNewStageInput] = useState("");
	const [isAddingStage, setIsAddingStage] = useState(false);
	const { stages, isLoading: isStagesLoading, addStage } = useAcademicStages();
	const { academicStages: optionsStages } = useAcademicStageOptions();

	const [newClassificationInput, setNewClassificationInput] = useState("");
	const [classificationsList, setClassificationsList] =
		useState<string[]>(DEFAULT_CLASSIFICATIONS);
	const {
		trackClassifications,
		isLoading: isClassificationsLoading,
		addClassification: addClassificationMutation,
		isAdding: isAddingClassification,
	} = useTrackClassifications();

	// سلوك الواجهة
	const [isExpanded, setIsExpanded] = useState(false);
	const [showNotice, setShowNotice] = useState(true);
	const [createAnother, setCreateAnother] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isDiscardOpen, setIsDiscardOpen] = useState(false);

	// توليد كود تلقائي
	const generateAutoCode = useCallback(() => {
		const num = Math.floor(10 + Math.random() * 90);
		return `PG-${num}`;
	}, []);

	// استخراج المراحل الدراسية النشطة
	const activeAcademicStages = useMemo(() => {
		const set = new Set<string>();
		for (const st of DEFAULT_ACADEMIC_STAGES) {
			set.add(st);
		}
		if (Array.isArray(optionsStages)) {
			for (const st of optionsStages) {
				if (typeof st === "string" && st.trim()) set.add(st.trim());
			}
		}
		if (Array.isArray(stages)) {
			for (const s of stages) {
				if (s?.isActive && typeof s?.name === "string" && s.name.trim()) {
					set.add(s.name.trim());
				}
			}
		}
		if (academicStage?.trim()) {
			set.add(academicStage.trim());
		}
		return Array.from(set);
	}, [optionsStages, stages, academicStage]);

	// استخراج التصنيفات النشطة
	const activeClassifications = useMemo(() => {
		const set = new Set<string>();
		for (const c of classificationsList) {
			set.add(c);
		}
		if (Array.isArray(trackClassifications)) {
			for (const tc of trackClassifications) {
				if (tc?.name?.trim()) set.add(tc.name.trim());
			}
		}
		if (category?.trim()) {
			set.add(category.trim());
		}
		return Array.from(set);
	}, [classificationsList, trackClassifications, category]);

	// تكوين الأيقونة واللون المحددين
	const currentColorConfig = useMemo(
		() => COLOR_OPTIONS.find((c) => c.id === selectedColor) || COLOR_OPTIONS[0],
		[selectedColor],
	);

	const ActiveIcon = useMemo(() => {
		const found = POPULAR_ICONS.find((i) => i.id === selectedIcon);
		return found ? found.icon : IconFileText;
	}, [selectedIcon]);

	const filteredIcons = useMemo(() => {
		if (!iconSearch.trim()) return POPULAR_ICONS;
		const q = iconSearch.trim().toLowerCase();
		return POPULAR_ICONS.filter(
			(i) => i.name.toLowerCase().includes(q) || i.id.toLowerCase().includes(q),
		);
	}, [iconSearch]);

	const filteredTemplates = useMemo(() => {
		if (!templateSearch.trim()) return PAGE_TEMPLATES;
		const q = templateSearch.trim().toLowerCase();
		return PAGE_TEMPLATES.filter(
			(t) =>
				t.title.toLowerCase().includes(q) ||
				t.category.toLowerCase().includes(q) ||
				t.summary.toLowerCase().includes(q),
		);
	}, [templateSearch]);

	// مزامنة الحقول عند فتح الحوار ببيانات صفحة محددة أو جديدة
	useEffect(() => {
		if (open) {
			if (page) {
				setTitle(page.title || "");
				const rawSummary = page.summary || "";
				setSummary(cleanPageSummary(rawSummary));
				setNotes(extractNotesTag(rawSummary));
				setAcademicStage(
					extractSystemTag(rawSummary, "stage") || extractSystemTag(rawSummary, "المرحلة"),
				);
				setLocationMode(
					(extractSystemTag(rawSummary, "location") as
						| "ONLINE"
						| "IN_PERSON"
						| "HYBRID"
						| "") || "",
				);
				setSelectedIcon(extractSystemTag(rawSummary, "icon") || "file-text");
				setSelectedColor(extractSystemTag(rawSummary, "color") || "blue");
				setCode(extractSystemTag(rawSummary, "code") || generateAutoCode());
				setCategory(page.category || "عام وتوجيهي");
				setStatus(page.status || "DRAFT");

				const rawContent = page.content;
				if (typeof rawContent === "string") {
					setContent(rawContent);
				} else if (rawContent) {
					setContent(JSON.stringify(rawContent));
				} else {
					setContent(createInitialPageContent());
				}
				setFurthest(2);
			} else {
				setTitle("");
				setCode(generateAutoCode());
				setSelectedIcon("file-text");
				setSelectedColor("blue");
				setSummary("");
				setNotes("");
				setCategory("عام وتوجيهي");
				setAcademicStage("");
				setLocationMode("");
				setStatus("DRAFT");
				setContent(createInitialPageContent());
				setFurthest(1);
			}
			setStep(1);
			setIsSaving(false);
			setSelectedTemplateId("none");
		}
	}, [open, page, generateAutoCode]);

	// هل هناك تغييرات غير محفوظة للتنبيه عند الإغلاق
	const isDirty = useMemo(() => {
		if (page) {
			return (
				title !== (page.title || "") ||
				summary !== cleanPageSummary(page.summary || "") ||
				category !== (page.category || "عام وتوجيهي") ||
				status !== (page.status || "DRAFT")
			);
		}
		return Boolean(title.trim() || summary.trim() || notes.trim());
	}, [page, title, summary, category, status, notes]);

	// حساب نسبة إنجاز النموذج
	const formProgress = useMemo<FormProgress>(() => {
		if (step === 2) {
			const hasBlocks = Boolean(content?.trim() && content !== "[]");
			return {
				filledCount: hasBlocks ? 2 : 1,
				requiredCount: 2,
				progress: hasBlocks ? 100 : 75,
				isComplete: Boolean(hasBlocks),
			};
		}
		const hasTitle = Boolean(title.trim());
		const hasSummary = Boolean(summary.trim());
		const filled = (hasTitle ? 1 : 0) + (hasSummary ? 1 : 0);
		return {
			filledCount: filled,
			requiredCount: 2,
			progress: hasTitle ? 50 : 0,
			isComplete: hasTitle,
		};
	}, [step, content, title, summary]);

	const handleCloseAttempt = useCallback(() => {
		if (isDirty) {
			setIsDiscardOpen(true);
		} else {
			onClose();
		}
	}, [isDirty, onClose]);

	// تطبيق قالب جاهز
	const handleSelectTemplate = (tpl: (typeof PAGE_TEMPLATES)[0] | null) => {
		if (!tpl) {
			setSelectedTemplateId("none");
			setTitle("");
			setSummary("");
			setNotes("");
			setCategory("عام وتوجيهي");
			setAcademicStage("");
			setLocationMode("");
			setSelectedIcon("file-text");
			setSelectedColor("blue");
			setTemplateMenuOpen(false);
			toast.info("تم تفريغ الحقول والبدء بدون قالب");
			return;
		}

		setSelectedTemplateId(tpl.id);
		setTitle(tpl.title);
		setSummary(tpl.summary);
		setNotes(tpl.notes || "");
		setCategory(tpl.category);
		setAcademicStage(tpl.academicStage || "");
		setLocationMode(tpl.locationMode);
		setSelectedIcon(tpl.icon);
		setSelectedColor(tpl.color);
		setTemplateMenuOpen(false);
		toast.success(`تم تطبيق قالب "${tpl.title}"`);
	};

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
			if (addStage) {
				await addStage(trimmed);
			}
			setAcademicStage(trimmed);
			setNewStageInput("");
			toast.success(`تمت إضافة المرحلة (${trimmed}) بنجاح`);
		} catch {
			setAcademicStage(trimmed);
			setNewStageInput("");
			toast.info(`تم اختيار المرحلة "${trimmed}"`);
		} finally {
			setIsAddingStage(false);
		}
	};

	const handleProceedToStep2 = () => {
		if (!title.trim()) {
			toast.error("يرجى إدخال عنوان الصفحة للمتابعة");
			return;
		}
		setStep(2);
		setFurthest((f) => Math.max(f, 2));
	};

	const handleSave = async (targetStatus?: "DRAFT" | "PUBLISHED") => {
		if (!title.trim()) {
			toast.error("يرجى إدخال عنوان الصفحة");
			setStep(1);
			return;
		}
		const finalStatus = targetStatus ?? status;
		setIsSaving(true);
		try {
			let parsedContent: unknown = content;
			try {
				parsedContent = JSON.parse(content);
			} catch {
				parsedContent = content;
			}

			// تشفير الوسوم الإضافية داخل الملخص لضمان بقائها ومطابقة الثيم الموحد للمنصة
			let finalSummary = summary.trim();
			if (code.trim()) {
				finalSummary += `\n[code:${code.trim()}]`;
			}
			if (selectedIcon) {
				finalSummary += `\n[icon:${selectedIcon}]`;
			}
			if (selectedColor) {
				finalSummary += `\n[color:${selectedColor}]`;
			}
			if (notes.trim()) {
				finalSummary += `\n[notes:${notes.trim()}]`;
			}
			if (academicStage.trim()) {
				finalSummary += `\n[stage:${academicStage.trim()}]`;
			}
			if (locationMode.trim()) {
				finalSummary += `\n[location:${locationMode.trim()}]`;
			}

			await onSave({
				title: title.trim(),
				category: category.trim() || "عام وتوجيهي",
				status: finalStatus,
				summary: finalSummary,
				content: parsedContent,
			});

			toast.success(
				finalStatus === "PUBLISHED" ? "تم نشر الصفحة بنجاح!" : "تم حفظ الصفحة كمسودة بنجاح!",
			);

			if (createAnother) {
				setTitle("");
				setCode(generateAutoCode());
				setSelectedIcon("file-text");
				setSelectedColor("blue");
				setSummary("");
				setNotes("");
				setCategory("عام وتوجيهي");
				setAcademicStage("");
				setLocationMode("");
				setStatus("DRAFT");
				setContent(createInitialPageContent());
				setStep(1);
				setFurthest(1);
			} else {
				onClose();
			}
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "حدث خطأ أثناء الحفظ");
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<>
			<Dialog
				open={open}
				onOpenChange={(next) => !next && handleCloseAttempt()}
			>
				<DialogContent
					showCloseButton={false}
					aria-describedby={undefined}
					className={cn(
						"p-0 gap-0 overflow-hidden border border-border shadow-2xl transition-all duration-300 flex flex-col",
						step === 2
							? isExpanded
								? "w-[99.5vw] max-w-[99.5vw] sm:max-w-[99.5vw] h-[99vh] max-h-[99vh] rounded-none"
								: "w-[98.5vw] max-w-[98.5vw] sm:max-w-[98.5vw] md:max-w-[1720px] h-[98vh] max-h-[98vh] rounded-xl"
							: isExpanded
								? "w-[96vw] max-w-[96vw] sm:max-w-[96vw] h-[96vh] max-h-[96vh] rounded-xl"
								: "w-[90vw] max-w-2xl sm:max-w-2xl md:max-w-3xl max-h-[95vh] rounded-2xl",
					)}
					onInteractOutside={(e) => {
						if (isDirty) {
							e.preventDefault();
							setIsDiscardOpen(true);
						}
					}}
					onEscapeKeyDown={(e) => {
						if (step === 2) {
							e.preventDefault();
							setStep(1);
							return;
						}
						if (isDirty) {
							e.preventDefault();
							setIsDiscardOpen(true);
						}
					}}
					dir="rtl"
				>
					<div className="flex flex-col w-full items-stretch overflow-hidden h-full max-h-[98vh]">
						{/* 1. الترويسة الموحدة للنظام (FormHeader) مطابقة تماماً للمسارات والدورات */}
						<FormHeader
							variant="dialog"
							size="sm"
							title={
								step === 1
									? isEdit
										? "تعديل الصفحة"
										: "أنشئ صفحة جديدة"
									: "إضافة وبناء محتوى الصفحة"
							}
							identity={
								step === 1
									? title || code
										? { name: title || "صفحة جديدة", code: code || "PG" }
										: isEdit && page
											? { name: page.title, code: code || page.category }
											: null
									: {
											name: title || page?.title || "صفحة جديدة",
											code: code || page?.category,
										}
							}
							progress={step === 1 ? formProgress : undefined}
							onClose={handleCloseAttempt}
							actions={
								<div className="flex items-center gap-2">
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
								</div>
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
														placeholder="تطبيق قالب صفحة..."
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
																	<IconFileText className="size-4 text-foreground/80 shrink-0" />
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
									</div>
								) : undefined
							}
						/>

						{/* 2. شريط خطوات المعالج الموحد بالدوائر (SheetStepper) مطابق تماماً للدورات والمسارات */}
						<SheetStepper
							steps={PAGE_STEPS}
							step={step}
							furthest={furthest}
							onStepChange={(s) => setStep(s as 1 | 2)}
						/>

						{/* 3. محتوى الخطوات */}
						{step === 1 ? (
							/* ===== الخطوة 1: فورم المعلومات الأساسية مطابق تماماً لثيم الدورات والمسارات ===== */
							<form
								onSubmit={(e) => {
									e.preventDefault();
									handleProceedToStep2();
								}}
								className="flex flex-col flex-1 min-h-0 overflow-hidden"
							>
								<div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
									{/* السطر الأول: المعرف (يمين) + زر الأيقونة واللون (وسط) + عنوان الصفحة (يسار) */}
									<div className="space-y-1.5">
										<div className="flex items-center gap-2.5 w-full">
											{/* المعرف يميناً */}
											<div className="w-36 sm:w-44 shrink-0">
												<FieldLabel info="يُولد تلقائياً بتسلسل نظامي ويمكنك تعديله">
													<Label
														htmlFor="page-code"
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

											{/* عنوان الصفحة يساراً */}
											<div className="flex-1 min-w-0">
												<FieldLabel
													required
													info="عنوان الصفحة التدريبية أو المستند"
												>
													<Label
														htmlFor="page-title"
														className="text-xs font-semibold"
													>
														عنوان الصفحة
													</Label>
												</FieldLabel>
											</div>
										</div>

										{/* حقول الإدخال جنباً إلى جنب مع زر الأيقونة الموحد المنبثق */}
										<div className="flex items-center gap-2.5 w-full">
											{/* حقل المعرف */}
											<div className="w-36 sm:w-44 shrink-0">
												<Input
													id="page-code"
													value={code}
													onChange={(e) => setCode(e.target.value)}
													placeholder="مثال: PG-01"
													className="w-full h-10 text-xs font-mono text-center sm:text-right bg-muted/40"
												/>
											</div>

											{/* زر الأيقونة المنبثق لاختيار رمز ولون الصفحة */}
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
															title="اختر رمز ولون الصفحة"
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
																			"size-6 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer",
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
																	className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
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
																				"size-8 rounded-md flex items-center justify-center transition-all text-muted-foreground hover:text-foreground hover:bg-background shadow-2xs cursor-pointer",
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

											{/* حقل عنوان الصفحة */}
											<div className="flex-1 min-w-0">
												<Input
													id="page-title"
													value={title}
													onChange={(e) => setTitle(e.target.value)}
													placeholder="مثال: دليل سياسات العمل والإجراءات التنفيذية"
													className="w-full h-10 text-xs text-right font-medium"
													required
													autoFocus
												/>
											</div>
										</div>
									</div>

									{/* السطر الثاني: وصف وموجز الصفحة */}
									<Field className="space-y-1.5">
										<FieldLabel info="نبذة تعريفية شاملة عن أهداف ومحتوى الصفحة">
											<Label
												htmlFor="page-summary"
												className="text-xs font-semibold"
											>
												وصف وموجز الصفحة
											</Label>
										</FieldLabel>
										<div className="rounded-lg border border-border/80 bg-background overflow-hidden focus-within:ring-1 focus-within:ring-primary">
											<Textarea
												id="page-summary"
												value={summary}
												onChange={(e) => setSummary(e.target.value)}
												placeholder="أضف وصفاً شاملاً أو نبذة لمحتوى الصفحة..."
												rows={3}
												className="w-full text-xs text-right resize-none border-0 focus-visible:ring-0 p-3 shadow-none bg-transparent"
											/>
										</div>
									</Field>

									{/* السطر الثالث: محرر الملاحظات والأفكار التفاعلي الموحد (RichNotesEditor) */}
									<div className="mt-2">
										<RichNotesEditor
											id="pg-notes"
											value={notes}
											onChange={setNotes}
											placeholder="أضف أفكار أو ملاحظات لهذه الصفحة..."
											variant="border-top-only"
											minHeight={55}
										/>
									</div>
								</div>

								{/* شريط التحكم والإجراءات والشرائح السفلية الثابت الموحد */}
								<div className="shrink-0 bg-background border-t border-border flex flex-col z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
									{/* أ) رسالة التنبيه الصفراء المطابقة تماماً */}
									{showNotice && (
										<div className="w-full bg-[#FFFBEB] dark:bg-amber-950/40 border-b border-amber-200/80 dark:border-amber-900/40 px-5 py-2.5 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
											<div className="flex items-center gap-1.5 font-medium">
												<span className="font-bold">تنبيه:</span>
												<span>يمكنك تخطي الخطوات التالية وإضافتها بعد إنشاء الصفحة</span>
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

									{/* ب) شريط شرائح الخطوات الإضافية الموحد (المرحلة الدراسية، التصنيف، مكان التعلم) */}
									<div className="flex items-center gap-2 flex-wrap justify-start px-5 py-2.5 bg-background">
										{/* 1. المرحلة الدراسية */}
										<DropdownMenu
											dir="rtl"
											modal={false}
										>
											<DropdownMenuTrigger asChild>
												<Button
													type="button"
													variant={academicStage ? "secondary" : "outline"}
													size="sm"
													className="gap-1.5 h-8 text-xs font-normal cursor-pointer"
												>
													<IconSchool className="size-3.5 text-muted-foreground/70 shrink-0" />
													<span>{academicStage || "المرحلة الدراسية"}</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent
												align="end"
												className="w-56! min-w-56 p-1.5"
											>
												<DropdownMenuLabel className="px-2 py-1 text-[11px] font-semibold text-muted-foreground">
													المرحلة الدراسية
												</DropdownMenuLabel>

												{/* حقل إضافة مرحلة دراسية جديدة */}
												{/* biome-ignore lint/a11y/noStaticElementInteractions: dropdown input container */}
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
														<Spinner
															containerClassName="py-3 min-h-0"
															className="size-4 text-primary"
														/>
													) : (
														activeAcademicStages.map((item) => (
															// biome-ignore lint/a11y/noStaticElementInteractions: dropdown option
															// biome-ignore lint/a11y/useKeyWithClickEvents: dropdown option
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
										<DropdownMenu
											dir="rtl"
											modal={false}
										>
											<DropdownMenuTrigger asChild>
												<Button
													type="button"
													variant={category ? "secondary" : "outline"}
													size="sm"
													className="gap-1.5 h-8 text-xs font-normal cursor-pointer"
												>
													<IconRoute className="size-3.5 text-muted-foreground/70 shrink-0" />
													<span>{category || "التصنيف"}</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent
												align="end"
												className="w-56! min-w-56 p-1.5"
											>
												<DropdownMenuLabel className="px-2 py-1 text-[11px] font-semibold text-muted-foreground">
													التصنيف
												</DropdownMenuLabel>

												{/* حقل إضافة تصنيف جديد */}
												{/* biome-ignore lint/a11y/noStaticElementInteractions: dropdown input container */}
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
													{isClassificationsLoading && activeClassifications.length === 0 ? (
														<Spinner
															containerClassName="py-3 min-h-0"
															className="size-4 text-primary"
														/>
													) : (
														activeClassifications.map((item) => (
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
															</div>
														))
													)}
												</div>
											</DropdownMenuContent>
										</DropdownMenu>

										{/* 3. مكان التعلم */}
										<DropdownMenu
											dir="rtl"
											modal={false}
										>
											<DropdownMenuTrigger asChild>
												<Button
													type="button"
													variant={locationMode ? "secondary" : "outline"}
													size="sm"
													className="gap-1.5 h-8 text-xs font-normal cursor-pointer"
												>
													<IconMapPin className="size-3.5 text-muted-foreground/70 shrink-0" />
													<span>
														{locationMode === "ONLINE"
															? "أونلاين"
															: locationMode === "IN_PERSON"
																? "حضوري"
																: locationMode === "HYBRID"
																	? "مدمج"
																	: "مكان التعلم"}
													</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent
												align="end"
												className="w-48! min-w-48 p-1.5"
											>
												<DropdownMenuLabel className="px-2 py-1 text-[11px] font-semibold text-muted-foreground">
													مكان التعلم
												</DropdownMenuLabel>
												<DropdownMenuItem
													onClick={() => setLocationMode("")}
													className={cn(
														"cursor-pointer text-xs flex items-center justify-between px-2.5 py-1.5 rounded-md mb-1",
														!locationMode && "bg-muted font-medium text-foreground",
													)}
												>
													<span>بدون مكان التعلم</span>
													{!locationMode && <IconCheck className="size-3.5 text-primary" />}
												</DropdownMenuItem>
												<DropdownMenuSeparator className="my-1" />
												<DropdownMenuItem
													onClick={() => setLocationMode("ONLINE")}
													className={cn(
														"cursor-pointer text-xs flex items-center justify-between px-2.5 py-1.5 rounded-md",
														locationMode === "ONLINE" &&
															"bg-muted font-medium text-foreground",
													)}
												>
													<span>أونلاين</span>
													{locationMode === "ONLINE" && (
														<IconCheck className="size-3.5 text-primary" />
													)}
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => setLocationMode("IN_PERSON")}
													className={cn(
														"cursor-pointer text-xs flex items-center justify-between px-2.5 py-1.5 rounded-md",
														locationMode === "IN_PERSON" &&
															"bg-muted font-medium text-foreground",
													)}
												>
													<span>حضوري</span>
													{locationMode === "IN_PERSON" && (
														<IconCheck className="size-3.5 text-primary" />
													)}
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => setLocationMode("HYBRID")}
													className={cn(
														"cursor-pointer text-xs flex items-center justify-between px-2.5 py-1.5 rounded-md",
														locationMode === "HYBRID" &&
															"bg-muted font-medium text-foreground",
													)}
												>
													<span>مدمج</span>
													{locationMode === "HYBRID" && (
														<IconCheck className="size-3.5 text-primary" />
													)}
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>

									{/* ج) تذييل الخطوة 1 الثابت (FormFooter) مطابق تماماً للدورات والمسارات */}
									<FormFooter
										continueAdding={createAnother}
										onContinueAddingChange={setCreateAnother}
										showShortcut={false}
									>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={handleCloseAttempt}
											className="text-xs font-medium cursor-pointer"
										>
											إلغاء
										</Button>

										<Button
											type="submit"
											size="sm"
											disabled={!title.trim()}
											className={cn(
												"gap-1.5 font-semibold transition-all shadow-xs cursor-pointer",
												!title.trim() && "opacity-50 cursor-not-allowed",
											)}
										>
											<span>التالي: إضافة وبناء المحتوى ←</span>
										</Button>
									</FormFooter>
								</div>
							</form>
						) : (
							/* ===== الخطوة 2: محرر الصفحة والمعاينة الحية بعرض الشاشة الكامل ===== */
							<div className="flex flex-col flex-1 min-h-0 overflow-hidden bg-background">
								<div className="flex flex-1 min-h-0 w-full divide-x divide-x-reverse divide-border overflow-hidden">
									{/* 2.أ اليمين: محرر الصفحة المتطابق مع محررات الدورات */}
									<div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
										{/* مساحة كتابة العنوان + كتل المحرر */}
										<div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F7F8FB] dark:bg-muted/10">
											<div className="mx-auto w-full max-w-[1240px] rounded-xl border border-border bg-card p-6 sm:p-8 shadow-xs">
												{/* عنوان الصفحة التحريري */}
												<div className="mb-4 border-b border-border/70 pb-3">
													<input
														value={title}
														onChange={(e) => setTitle(e.target.value)}
														placeholder="عنوان الصفحة التعليمية..."
														className="w-full bg-transparent text-xl font-bold text-foreground outline-none placeholder:text-muted-foreground/60 sm:text-2xl"
													/>
												</div>

												{/* كتل محرر الصفحة المعتمد بالدورات مع إمكانية إضافة صفحات متعددة والكتل الغنية */}
												<CoursePageBlocksField
													value={content}
													onChange={setContent}
													emitEmptyWhenBlank={false}
													minEditorHeightClassName="min-h-[480px]"
													className="rounded-lg border border-border/80 bg-background"
												/>
											</div>
										</div>
									</div>

									{/* 2.ب الشمال: المعاينة اللايف المباشرة لمظهر الصفحة لدى المتدربين */}
									<div className="flex w-[440px] xl:w-[500px] 2xl:w-[540px] shrink-0 flex-col overflow-hidden border-r border-border bg-muted/15">
										{/* جسم المعاينة التفاعلي */}
										<div className="flex-1 overflow-y-auto p-4 sm:p-5">
											<div className="mx-auto w-full transition-all duration-200 rounded-xl border border-border bg-card shadow-sm p-4 sm:p-6 text-right">
												{/* بادجات الترويسة في المعاينة */}
												<div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-border/60 pb-3 mb-3">
													<div className="flex items-center gap-1.5 flex-wrap">
														<span className="rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
															{category || "عام وتوجيهي"}
														</span>
														{academicStage && (
															<span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground flex items-center gap-1">
																<IconSchool className="size-3" />
																<span>{academicStage}</span>
															</span>
														)}
														{locationMode && (
															<span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground flex items-center gap-1">
																<IconMapPin className="size-3" />
																<span>
																	{locationMode === "ONLINE"
																		? "أونلاين"
																		: locationMode === "IN_PERSON"
																			? "حضوري"
																			: "مدمج"}
																</span>
															</span>
														)}
													</div>

													{code && (
														<span className="font-mono text-xs text-muted-foreground">
															{code}
														</span>
													)}
												</div>

												{/* أيقونة وعنوان الصفحة في المعاينة */}
												<div className="flex items-center gap-3 mb-2.5">
													<div
														className={cn(
															"size-10 rounded-xl border flex items-center justify-center shrink-0 shadow-2xs",
															currentColorConfig.bg,
														)}
													>
														<ActiveIcon className="size-5" />
													</div>
													<h2 className="text-base font-bold text-foreground leading-snug sm:text-lg">
														{title.trim() || "عنوان الصفحة التدريبية"}
													</h2>
												</div>

												{/* النبذة في المعاينة */}
												{summary.trim() && (
													<div className="mb-4 rounded-lg border-r-3 border-r-primary bg-primary/[0.04] p-3 text-[11px] leading-relaxed text-muted-foreground">
														{summary}
													</div>
												)}

												{/* الملاحظات في المعاينة إن وجدت */}
												{notes.trim() && (
													<div className="mb-4 rounded-lg border border-amber-200/60 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20 p-2.5 text-[11px] text-amber-800 dark:text-amber-300">
														<span className="font-semibold block mb-0.5">ملاحظات:</span>
														<p className="leading-relaxed whitespace-pre-wrap">{notes}</p>
													</div>
												)}

												{/* محتوى الصفحة بالكتل الحية */}
												<div className="min-h-[260px]">
													<CoursePageContent content={content} />
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* فوتر الخطوة 2 المطابق تماماً لفوتر الدورات */}
								<div className="flex shrink-0 items-center justify-between border-t border-border bg-background px-4 py-2.5 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] z-10">
									{/* يمين: زر الرجوع لتعديل البيانات الأساسية */}
									<div className="flex items-center gap-3">
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

									{/* يسار: إلغاء ← حفظ كمسودة ← نشر الصفحة */}
									<div className="flex items-center gap-2">
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={handleCloseAttempt}
											className="text-xs font-medium cursor-pointer"
										>
											إلغاء
										</Button>

										<Button
											type="button"
											variant="outline"
											size="sm"
											disabled={isSaving}
											onClick={() => handleSave("DRAFT")}
											className="text-xs font-medium gap-1.5 cursor-pointer"
										>
											<IconFileDescription className="size-3.5 text-amber-600" />
											<span>حفظ كمسودة</span>
										</Button>

										<Button
											type="button"
											size="sm"
											disabled={isSaving}
											onClick={() => handleSave("PUBLISHED")}
											className="gap-1.5 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
										>
											<IconFileCheck className="size-3.5" />
											<span>{isSaving ? "جارٍ الحفظ..." : "نشر الصفحة"}</span>
										</Button>
									</div>
								</div>
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>

			{/* نافذة تأكيد تجاهل التغييرات غير المحفوظة */}
			<DiscardConfirmDialog
				open={isDiscardOpen}
				onOpenChange={setIsDiscardOpen}
				onConfirm={() => {
					setIsDiscardOpen(false);
					onClose();
				}}
			/>
		</>
	);
}
