import {
	IconArrowLeft,
	IconBook2,
	IconBrandWhatsapp,
	IconCheck,
	IconChevronDown,
	IconFile,
	IconFileDescription,
	IconFileText,
	IconFolder,
	IconInfoCircle,
	IconListCheck,
	IconPlus,
	IconRosetteDiscountCheck,
	IconSchool,
	IconSearch,
	IconX,
} from "@tabler/icons-react";
import { type ComponentType, useMemo, useState } from "react";
import { type FilterGroup, FiltersMenu } from "@/components/common/filters-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import {
	INITIAL_RESOURCES,
	type LibraryItem,
	TYPE_CONFIG,
} from "@/features/services/training/components/my-library-view";
import {
	INITIAL_PAGES,
	type PageItem,
} from "@/features/services/training/components/pages-view";
import { formatCourseDuration } from "@/features/services/training/data/training";
import { useCourses } from "@/features/services/training/hooks/use-courses";
import { useQuizzes } from "@/features/services/training/hooks/use-quizzes";
import { resolveCover } from "@/features/services/training/utils/cover";
import { useAcademicStages } from "@/features/settings/academic-stages/hooks/use-academic-stages";
import { useTrackClassifications } from "@/features/settings/tracks/hooks/use-track-classifications";
import { cn } from "@/lib/utils";
import type { QuizListItemResponse } from "@/server/quizzes/quizzes.type";
import { DurationPickerPopover } from "./duration-picker-popover";
import {
	cleanCourseDescription,
	type TrackStage,
	type TrackStageItem,
} from "./track-structure-step";

export const DEFAULT_TRACK_CLASSIFICATIONS = [
	"البرمجة والمنطق",
	"طبي وتأهيلي",
	"نفسي وسلوكي",
	"تدريب تربوي",
	"عام وتوعوي",
	"إداري وقيادي",
	"برمجة",
	"ذكاء اصطناعي",
	"روبوتكس",
	"إدارة أعمال",
];

const DEFAULT_ACADEMIC_STAGES = [
	"رياض الأطفال",
	"المرحلة الابتدائية",
	"المرحلة المتوسطة",
	"المرحلة الثانوية",
	"المرحلة الجامعية",
];

// تحويل الأرقام إلى أرقام عربية تطابق التصميم المعروض
export const toArabicNumerals = (n: number | string) =>
	String(n).replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number.parseInt(d, 10)]);

// صياغة عدد الدروس بشكل مطابق لقواعد اللغة والواجهة
export const formatLessonsCount = (count?: number | null): string => {
	const c = count ?? 0;
	if (c === 0) return "0 دروس";
	if (c === 1) return "1 دروس";
	if (c === 2) return "2 دروس";
	if (c <= 10) return `${toArabicNumerals(c)} دروس`;
	return `${toArabicNumerals(c)} درساً`;
};

// تنسيق التاريخ النسبي بالعربية بناءً على تاريخ التحديث الفعلي المخزن
export const formatArabicDate = (date?: Date | string | null): string => {
	if (!date) return "محدث مؤخراً";
	const d = new Date(date);
	if (Number.isNaN(d.getTime())) return "محدث مؤخراً";
	const now = new Date();
	const diffMs = now.getTime() - d.getTime();
	const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
	if (diffHours < 24 && diffDays === 0) {
		return "اليوم";
	}
	if (diffDays === 1) {
		return "أمس";
	}
	if (diffDays === 2) {
		return "منذ يومين";
	}
	if (diffDays <= 7) {
		return `منذ ${toArabicNumerals(diffDays)} أيام`;
	}
	return d.toLocaleDateString("ar-EG", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
};

export type ContentSectionKey = "library" | "courses" | "quizzes" | "pages";

export interface SelectedItemSummary {
	id: string;
	title: string;
	type: "COURSE" | "QUIZ" | "LIBRARY" | "PAGE";
	typeLabel: string;
	durationText: string;
	durationWeeks?: number;
	price?: number;
	category?: string;
	coverKey?: string | null;
	iconBg?: string;
	iconColor?: string;
	iconComp?: ComponentType<{ className?: string }>;
}

export interface TrackCoursesStepProps {
	isEdit: boolean;
	trackName: string;
	trackCode?: string;
	trackCategory?: string;
	trackAcademicStage?: string;
	trackDuration?: string;
	onTrackDurationChange?: (duration: string) => void;
	selectedIcon?: string;
	selectedColor?: string;
	selectedCourseIds: string[];
	onToggleCourse: (courseId: string) => void;
	onSelectAll: (courseIds: string[]) => void;
	onClearAll: () => void;
	stages?: TrackStage[] | null;
	onStagesChange?: (stages: TrackStage[]) => void;
	onBackToForm: () => void;
	onNextToStructure?: () => void;
	onSubmit: () => void;
	isSubmitting: boolean;
	notifyWhatsApp: boolean;
	onNotifyWhatsAppChange: (val: boolean) => void;
	createAnother?: boolean;
	onCreateAnotherChange?: (val: boolean) => void;
	onOpenCreateCourse?: () => void;
	onClose: () => void;
}

// مكوّن عرض غلاف الدورة الأصلي (صورة محملة، لون خالص، أو أيقونة بديلة)
function CourseCoverThumbnail({
	course,
	className,
}: {
	course: {
		coverKey?: string | null;
		name: string;
		icon?: ComponentType<{ className?: string }>;
	};
	className?: string;
}) { 
	const cover = resolveCover(course.coverKey);
	const [imageError, setImageError] = useState(false);

	if (cover?.type === "image" && !imageError) {
		return (
			<div
				className={cn(
					"size-7.5 rounded-md overflow-hidden shrink-0 border border-border/80 bg-muted/60 flex items-center justify-center shadow-2xs",
					className,
				)}
			>
				<img
					src={cover.url}
					alt={course.name}
					className="size-full object-cover"
					onError={() => setImageError(true)}
				/>
			</div>
		);
	}

	if (cover?.type === "color") {
		return (
			<div
				className={cn(
					"size-7.5 rounded-md overflow-hidden shrink-0 border border-white/20 flex items-center justify-center text-white font-bold text-[10px] shadow-2xs",
					className,
				)}
				style={{ backgroundColor: cover.color }}
			>
				{course.name.trim().slice(0, 2)}
			</div>
		);
	}

	const IconComp = course.icon || IconSchool;
	return (
		<div
			className={cn(
				"size-7.5 rounded-md bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-100 dark:border-purple-900/40 shadow-2xs",
				className,
			)}
		>
			<IconComp className="size-3.5 stroke-[1.8]" />
		</div>
	);
}

export function TrackCoursesStep({
	isEdit: _isEdit,
	trackName: _trackName,
	trackCode: _trackCode,
	trackCategory,
	trackAcademicStage,
	trackDuration,
	onTrackDurationChange,
	selectedCourseIds,
	onToggleCourse,
	onClearAll,
	stages,
	onStagesChange,
	onBackToForm,
	onNextToStructure,
	onSubmit,
	isSubmitting,
	notifyWhatsApp,
	onNotifyWhatsAppChange,
	createAnother: _createAnother = false,
	onCreateAnotherChange: _onCreateAnotherChange,
	onOpenCreateCourse: _onOpenCreateCourse,
	onClose: _onClose,
}: TrackCoursesStepProps) {
	// 1. جلب الدورات الحقيقية
	const { courses: serverCourses, isLoading: isCoursesLoading } = useCourses();
	// 2. جلب التقييمات الحقيقية من الباك إند
	const { quizzes: serverQuizzes, isLoading: isQuizzesLoading } = useQuizzes();
	// 3. المراحل الدراسية والتصنيفات
	const { stages: serverStages } = useAcademicStages();
	const { trackClassifications } = useTrackClassifications();

	// حالات التصفية والبحث
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [selectedStages, setSelectedStages] = useState<string[]>([]);
	const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([]);
	const [selectedPricing, setSelectedPricing] = useState<string[]>([]);

	const clearAllFilters = () => {
		setSelectedCategories([]);
		setSelectedStages([]);
		setSelectedContentTypes([]);
		setSelectedPricing([]);
	};

	// حالة فتح الأكورديون للأقسام الأربعة (المكتبة، الدورات، التقييمات، الصفحات)
	const [openSections, setOpenSections] = useState<Record<ContentSectionKey, boolean>>({
		courses: true,
		library: false,
		quizzes: false,
		pages: false,
	});

	const toggleSection = (key: ContentSectionKey) => {
		setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	// تحويل الدورات الحقيقية
	const allCourses = useMemo(() => {
		if (!serverCourses || serverCourses.length === 0) {
			return [];
		}

		return serverCourses.map((c) => {
			const rawDesc = c.description || "";
			const stageMatch = rawDesc.match(
				/(?:\[(?:المرحلة|stage):([^\]]+)\]|\n?(?:المرحلة|stage):\s*([^\n]+))/i,
			);
			const parsedStage =
				(c as unknown as { academicStage?: string }).academicStage ||
				stageMatch?.[1]?.trim() ||
				stageMatch?.[2]?.trim() ||
				"";

			return {
				id: c.id,
				name: c.name,
				code: c.code || "",
				category: c.category || "عام",
				academicStage: parsedStage,
				coverKey: c.coverKey || null,
				durationWeeks: c.estimatedDurationWeeks ?? null,
				durationText:
					formatCourseDuration(c.startDate, c.dueDate, c.estimatedDurationWeeks) ||
					(c.estimatedDurationWeeks
						? `${toArabicNumerals(c.estimatedDurationWeeks)} أسابيع`
						: null),
				trainingCost: (c as unknown as { trainingCost?: number }).trainingCost ?? 0,
				lessonsCount: c.contentCount ?? 0,
				icon: IconSchool,
				updatedAt: c.updatedAt,
				description: cleanCourseDescription(rawDesc),
			};
		});
	}, [serverCourses]);

	// تتبع العناصر الإضافية المختارة (تقييمات، مكتبة، صفحات) من خلال stages
	const existingStageItems = useMemo(() => {
		if (!stages || stages.length === 0) return [];
		return stages.flatMap((s) => s.items);
	}, [stages]);

	// معرفات العناصر المختارة غير الدورات
	const selectedQuizIds = useMemo(() => {
		return existingStageItems
			.filter((it) => it.type === "QUIZ")
			.map((it) => it.refId || it.id.replace(/^item-quiz-/, ""));
	}, [existingStageItems]);

	const selectedLibraryIds = useMemo(() => {
		return existingStageItems
			.filter((it) => it.type === "PAGE" && it.id.startsWith("item-lib-"))
			.map((it) => it.refId || it.id.replace(/^item-lib-/, ""));
	}, [existingStageItems]);

	const selectedPageIds = useMemo(() => {
		return existingStageItems
			.filter((it) => it.type === "PAGE" && it.id.startsWith("item-page-"))
			.map((it) => it.refId || it.id.replace(/^item-page-/, ""));
	}, [existingStageItems]);

	// دالة إضافة / إزالة تقييم إلى المسار
	const handleToggleQuiz = (quiz: QuizListItemResponse) => {
		if (!onStagesChange) return;
		const itemId = `item-quiz-${quiz.id}`;
		const isCurrentlySelected = selectedQuizIds.includes(quiz.id);

		if (isCurrentlySelected) {
			// إزالة التقييم
			const nextStages = (stages || []).map((s) => ({
				...s,
				items: s.items.filter((it) => it.id !== itemId),
			}));
			onStagesChange(nextStages);
		} else {
			// إضافة التقييم إلى المرحلة الأولى
			const newItem: TrackStageItem = {
				id: itemId,
				refId: quiz.id,
				type: "QUIZ",
				title: quiz.title,
				durationText: quiz.timeLimitMinutes
					? `${toArabicNumerals(quiz.timeLimitMinutes)} دقيقة`
					: "ساعة واحدة",
				durationWeeks: 0,
				lessonsCount: quiz._count?.questions || 1,
				description: `تقييم واختبار تدريبي: ${quiz.title}`,
				status: (quiz.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT") as "PUBLISHED" | "DRAFT",
				iconColor: "yellow",
				updatedDate: formatArabicDate(quiz.updatedAt),
				coverKey: quiz.coverKey || null,
			};

			if (!stages || stages.length === 0) {
				onStagesChange([
					{
						id: "stage-1",
						title: "المستوى التأسيسي",
						description: "المستوى الأول للمسار",
						items: [newItem],
					},
				]);
			} else {
				const nextStages = [...stages];
				nextStages[0] = {
					...nextStages[0],
					items: [...nextStages[0].items, newItem],
				};
				onStagesChange(nextStages);
			}
		}
	};

	// دالة إضافة / إزالة مورد مكتبة إلى المسار
	const handleToggleLibraryItem = (res: LibraryItem) => {
		if (!onStagesChange) return;
		const itemId = `item-lib-${res.id}`;
		const isCurrentlySelected = selectedLibraryIds.includes(res.id);

		if (isCurrentlySelected) {
			const nextStages = (stages || []).map((s) => ({
				...s,
				items: s.items.filter((it) => it.id !== itemId),
			}));
			onStagesChange(nextStages);
		} else {
			const newItem: TrackStageItem = {
				id: itemId,
				refId: res.id,
				type: "PAGE",
				title: res.title,
				durationText: "يوم واحد",
				durationWeeks: 0,
				lessonsCount: 1,
				description: res.description,
				status: "PUBLISHED",
				iconColor: "emerald",
				updatedDate: "اليوم",
				coverKey: null,
			};

			if (!stages || stages.length === 0) {
				onStagesChange([
					{
						id: "stage-1",
						title: "المستوى التأسيسي",
						description: "المستوى الأول للمسار",
						items: [newItem],
					},
				]);
			} else {
				const nextStages = [...stages];
				nextStages[0] = {
					...nextStages[0],
					items: [...nextStages[0].items, newItem],
				};
				onStagesChange(nextStages);
			}
		}
	};

	// دالة إضافة / إزالة صفحة إلى المسار
	const handleTogglePage = (page: PageItem) => {
		if (!onStagesChange) return;
		const itemId = `item-page-${page.id}`;
		const isCurrentlySelected = selectedPageIds.includes(page.id);

		if (isCurrentlySelected) {
			const nextStages = (stages || []).map((s) => ({
				...s,
				items: s.items.filter((it) => it.id !== itemId),
			}));
			onStagesChange(nextStages);
		} else {
			const newItem: TrackStageItem = {
				id: itemId,
				refId: page.id,
				type: "PAGE",
				title: page.title,
				durationText: `${toArabicNumerals(page.readingTimeMinutes)} دقائق`,
				durationWeeks: 0,
				lessonsCount: 1,
				description: page.summary,
				status: page.status,
				iconColor: "blue",
				updatedDate: formatArabicDate(page.updatedAt),
				coverKey: null,
			};

			if (!stages || stages.length === 0) {
				onStagesChange([
					{
						id: "stage-1",
						title: "المستوى التأسيسي",
						description: "المستوى الأول للمسار",
						items: [newItem],
					},
				]);
			} else {
				const nextStages = [...stages];
				nextStages[0] = {
					...nextStages[0],
					items: [...nextStages[0].items, newItem],
				};
				onStagesChange(nextStages);
			}
		}
	};

	// استخراج التصنيفات
	const availableCategories = useMemo(() => {
		const activeFromBackend = (trackClassifications || [])
			.filter((t) => t.isActive !== false)
			.map((t) => t.name.trim());
		const list = [...activeFromBackend, ...DEFAULT_TRACK_CLASSIFICATIONS];
		if (trackCategory && !list.includes(trackCategory.trim())) {
			list.unshift(trackCategory.trim());
		}
		return Array.from(new Set(list)).filter(Boolean);
	}, [trackClassifications, trackCategory]);

	// استخراج المراحل الدراسية
	const availableStages = useMemo(() => {
		const activeFromBackend = (serverStages || [])
			.filter((s) => s.isActive !== false)
			.map((s) => s.name.trim());
		const list = [...activeFromBackend, ...DEFAULT_ACADEMIC_STAGES];
		if (trackAcademicStage && !list.includes(trackAcademicStage.trim())) {
			list.unshift(trackAcademicStage.trim());
		}
		return Array.from(new Set(list)).filter(Boolean);
	}, [serverStages, trackAcademicStage]);

	// مجموعات التصفية لقائمة الفلترة الرسمية للمنصة
	const filterGroups: FilterGroup[] = useMemo(
		() => [
			{
				key: "category",
				label: "التصنيف",
				Icon: IconFolder,
				options: availableCategories.map((c) => ({ value: c, label: c })),
				selected: selectedCategories,
				onToggle: (v) =>
					setSelectedCategories((prev) =>
						prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
					),
			},
			{
				key: "academicStage",
				label: "المرحلة الدراسية",
				Icon: IconSchool,
				options: availableStages.map((s) => ({ value: s, label: s })),
				selected: selectedStages,
				onToggle: (v) =>
					setSelectedStages((prev) =>
						prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
					),
			},
			{
				key: "contentType",
				label: "نوع المحتوى",
				Icon: IconBook2,
				options: [
					{ value: "courses", label: "الدورات التدريبية" },
					{ value: "library", label: "المكتبة والمراجع" },
					{ value: "quizzes", label: "التقييمات والاختبارات" },
					{ value: "pages", label: "الصفحات والمستندات" },
				],
				selected: selectedContentTypes,
				onToggle: (v) =>
					setSelectedContentTypes((prev) =>
						prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
					),
			},
			{
				key: "pricing",
				label: "التكلفة",
				Icon: IconRosetteDiscountCheck,
				options: [
					{ value: "free", label: "مجانية" },
					{ value: "paid", label: "مدفوعة" },
				],
				selected: selectedPricing,
				onToggle: (v) =>
					setSelectedPricing((prev) =>
						prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
					),
			},
		],
		[
			availableCategories,
			availableStages,
			selectedCategories,
			selectedStages,
			selectedContentTypes,
			selectedPricing,
		],
	);

	// 1. تصفية موارد المكتبة
	const filteredLibraryResources = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		return INITIAL_RESOURCES.filter((res) => {
			const matchesQuery =
				!query ||
				res.title.toLowerCase().includes(query) ||
				res.description.toLowerCase().includes(query) ||
				res.author.toLowerCase().includes(query);

			const matchesCategory =
				selectedCategories.length === 0 ||
				selectedCategories.some(
					(cat) => res.categoryLabel.includes(cat) || cat.includes(res.categoryLabel),
				);

			return matchesQuery && matchesCategory;
		});
	}, [searchQuery, selectedCategories]);

	// 2. تصفية الدورات
	const filteredCourses = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		return allCourses.filter((course) => {
			const matchesQuery =
				!query ||
				course.name.toLowerCase().includes(query) ||
				course.category.toLowerCase().includes(query) ||
				course.code.toLowerCase().includes(query) ||
				(course.academicStage?.toLowerCase().includes(query) ?? false);

			const matchesCategory =
				selectedCategories.length === 0 ||
				selectedCategories.some(
					(cat) =>
						course.category.trim().toLowerCase() === cat.trim().toLowerCase() ||
						course.category.includes(cat) ||
						cat.includes(course.category),
				);

			const matchesStage =
				selectedStages.length === 0 ||
				selectedStages.some(
					(stg) =>
						course.academicStage &&
						(course.academicStage.trim().toLowerCase() === stg.trim().toLowerCase() ||
							course.academicStage.includes(stg) ||
							stg.includes(course.academicStage)),
				);

			const matchesPricing =
				selectedPricing.length === 0 ||
				(selectedPricing.includes("free") && course.trainingCost === 0) ||
				(selectedPricing.includes("paid") && course.trainingCost > 0);

			return matchesQuery && matchesCategory && matchesStage && matchesPricing;
		});
	}, [allCourses, searchQuery, selectedCategories, selectedStages, selectedPricing]);

	// 3. تصفية التقييمات
	const filteredQuizzes = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		return (serverQuizzes || []).filter((q) => {
			const matchesQuery =
				!query ||
				q.title.toLowerCase().includes(query) ||
				q.code.toLowerCase().includes(query) ||
				(q.targetRole?.name?.toLowerCase().includes(query) ?? false);

			return matchesQuery;
		});
	}, [serverQuizzes, searchQuery]);

	// 4. تصفية الصفحات
	const filteredPages = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		return INITIAL_PAGES.filter((p) => {
			const matchesQuery =
				!query ||
				p.title.toLowerCase().includes(query) ||
				p.summary.toLowerCase().includes(query) ||
				p.author.toLowerCase().includes(query);

			const matchesCategory =
				selectedCategories.length === 0 ||
				selectedCategories.some((cat) => p.category.includes(cat) || cat.includes(p.category));

			return matchesQuery && matchesCategory;
		});
	}, [searchQuery, selectedCategories]);

	// تجميع المحتوى المختار الكلي لعرضه في العمود الأيسر
	const selectedSummaryItems = useMemo<SelectedItemSummary[]>(() => {
		const list: SelectedItemSummary[] = [];

		// الدورات
		for (const courseId of selectedCourseIds) {
			const c = allCourses.find((item) => item.id === courseId);
			if (c) {
				list.push({
					id: `course-${c.id}`,
					title: c.name,
					type: "COURSE",
					typeLabel: "دورة تدريبية",
					durationText:
						c.durationText ||
						(c.durationWeeks ? `${toArabicNumerals(c.durationWeeks)} أسابيع` : "أسبوع واحد"),
					durationWeeks: c.durationWeeks || 1,
					price: c.trainingCost,
					category: c.category,
					coverKey: c.coverKey,
					iconComp: IconSchool,
				});
			}
		}

		// التقييمات
		for (const qId of selectedQuizIds) {
			const q = (serverQuizzes || []).find((item) => item.id === qId);
			if (q) {
				list.push({
					id: `quiz-${q.id}`,
					title: q.title,
					type: "QUIZ",
					typeLabel: "تقييم واختبار",
					durationText: q.timeLimitMinutes
						? `${toArabicNumerals(q.timeLimitMinutes)} دقيقة`
						: "ساعة واحدة",
					durationWeeks: 0,
					coverKey: q.coverKey,
					iconComp: IconListCheck,
				});
			}
		}

		// المكتبة
		for (const libId of selectedLibraryIds) {
			const res = INITIAL_RESOURCES.find((item) => item.id === libId);
			if (res) {
				const conf = TYPE_CONFIG[res.type] || TYPE_CONFIG.pdf;
				list.push({
					id: `lib-${res.id}`,
					title: res.title,
					type: "LIBRARY",
					typeLabel: "مورد مكتبة",
					durationText: res.size || "مستند",
					durationWeeks: 0,
					category: res.categoryLabel,
					iconComp: conf.icon || IconFolder,
				});
			}
		}

		// الصفحات
		for (const pageId of selectedPageIds) {
			const p = INITIAL_PAGES.find((item) => item.id === pageId);
			if (p) {
				list.push({
					id: `page-${p.id}`,
					title: p.title,
					type: "PAGE",
					typeLabel: "صفحة ومستند",
					durationText: `${toArabicNumerals(p.readingTimeMinutes)} دقائق`,
					durationWeeks: 0,
					category: p.category,
					iconComp: IconFileText,
				});
			}
		}

		return list;
	}, [
		selectedCourseIds,
		selectedQuizIds,
		selectedLibraryIds,
		selectedPageIds,
		allCourses,
		serverQuizzes,
	]);

	// إجمالي المدة والتكلفة
	const selectedTotals = useMemo(() => {
		const totalWeeks = selectedSummaryItems.reduce(
			(sum, item) => sum + (item.durationWeeks || 0),
			0,
		);
		const totalPrice = selectedSummaryItems.reduce((sum, item) => sum + (item.price || 0), 0);
		return { totalWeeks, totalPrice, count: selectedSummaryItems.length };
	}, [selectedSummaryItems]);

	// إزالة أي عنصر بنقرة واحدة من العمود الأيسر
	const handleRemoveSelectedItem = (summaryItem: SelectedItemSummary) => {
		if (summaryItem.type === "COURSE") {
			const cId = summaryItem.id.replace(/^course-/, "");
			onToggleCourse(cId);
		} else if (summaryItem.type === "QUIZ") {
			const qId = summaryItem.id.replace(/^quiz-/, "");
			const q = (serverQuizzes || []).find((item) => item.id === qId);
			if (q) handleToggleQuiz(q);
		} else if (summaryItem.type === "LIBRARY") {
			const libId = summaryItem.id.replace(/^lib-/, "");
			const res = INITIAL_RESOURCES.find((item) => item.id === libId);
			if (res) handleToggleLibraryItem(res);
		} else if (summaryItem.type === "PAGE") {
			const pageId = summaryItem.id.replace(/^page-/, "");
			const p = INITIAL_PAGES.find((item) => item.id === pageId);
			if (p) handleTogglePage(p);
		}
	};

	return (
		<div
			dir="rtl"
			className="flex flex-col h-full bg-background text-foreground overflow-hidden p-3 sm:p-4"
		>
			{/* الصندوق المقسّم إلى عمودين متساويين بنسبة 50% لكل جانب كما في التصميم المرجعي */}
			<div className="flex-1 min-h-0 border border-border/80 rounded-2xl bg-card overflow-hidden shadow-2xs flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-border/60">
				{/* ================= الجانب الأيمن: قائمة المحتوى المتاح (المكتبة، الدورات، التقييمات، الصفحات) ================= */}
				<div className="flex flex-col w-full md:w-1/2 flex-1 min-w-0 bg-background overflow-hidden">
					{/* ترويسة شريط المحتوى: العنوان + حقل البحث + زر الفلتر */}
					<div className="px-3.5 py-2.5 border-b border-border/60 bg-muted/15 flex items-center justify-between gap-2.5 shrink-0">
						<span className="text-sm font-bold text-foreground shrink-0">المحتوى</span>

						{/* حقل البحث السريع */}
						<div className="relative flex-1 max-w-[200px] sm:max-w-[240px]">
							<IconSearch className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
							<Input
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="بحث في المحتوى..."
								className="h-8 pr-8 pl-7 text-xs bg-background border-border/70 rounded-lg text-right"
							/>
							{searchQuery && (
								<button
									type="button"
									onClick={() => setSearchQuery("")}
									className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
								>
									<IconX className="size-3" />
								</button>
							)}
						</div>

						{/* زر فلترة الرسمي للمنصة (FiltersMenu) مع القوائم الفرعية وخانات الاختيار */}
						<FiltersMenu
							groups={filterGroups}
							label="فلترة"
							size="sm"
							className="h-8 rounded-lg border-border/70"
							onReset={clearAllFilters}
						/>
					</div>

					{/* قائمة الأقسام الأربعة القابلة للفتح والغلق (الأكورديون) */}
					<div className="flex-1 overflow-y-auto p-3 space-y-2.5">
						{/* ================= 1. قسم الدورات التدريبية ================= */}
						{(selectedContentTypes.length === 0 ||
							selectedContentTypes.includes("courses")) && (
							<div className="rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/30 transition-all overflow-hidden">
								<button
									type="button"
									onClick={() => toggleSection("courses")}
									className="w-full px-3.5 py-2.5 flex items-center justify-between cursor-pointer select-none text-right bg-transparent border-0"
								>
									<div className="flex items-center gap-2.5 min-w-0">
										<div className="size-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-200/60 dark:border-purple-800/40 shadow-2xs">
											<IconSchool className="size-4" />
										</div>
										<div className="flex items-center gap-2">
											<h3 className="text-xs sm:text-sm font-bold text-foreground">
												الدورات التدريبية
											</h3>
											<Badge
												variant="secondary"
												className="text-[10px] h-4.5 px-2 font-medium rounded-full bg-background border border-border/60 text-muted-foreground"
											>
												{toArabicNumerals(filteredCourses.length)}
											</Badge>
										</div>
									</div>
									<IconChevronDown
										className={cn(
											"size-4 text-muted-foreground transition-transform duration-200 shrink-0",
											openSections.courses && "rotate-180",
										)}
									/>
								</button>

								{openSections.courses && (
									<div className="border-t border-border/50 divide-y divide-border/40 bg-card/60">
										{isCoursesLoading ? (
											<div className="flex flex-col items-center justify-center py-6 gap-2">
												<Spinner className="size-4 text-purple-600" />
												<span className="text-xs text-muted-foreground">
													جارٍ تحميل الدورات...
												</span>
											</div>
										) : filteredCourses.length === 0 ? (
											<div className="py-6 text-center text-xs text-muted-foreground">
												لا توجد دورات مطابقة للبحث أو الفلتر
											</div>
										) : (
											filteredCourses.map((course) => {
												const isSelected = selectedCourseIds.includes(course.id);
												return (
													<div
														key={course.id}
														className={cn(
															"px-3.5 py-2 flex items-center justify-between gap-3 transition-colors select-none",
															isSelected
																? "bg-purple-50/40 dark:bg-purple-950/20"
																: "hover:bg-muted/30",
														)}
													>
														<div className="flex items-center gap-2.5 min-w-0 text-right">
															<CourseCoverThumbnail course={course} />
															<div className="min-w-0">
																<h4 className="text-xs font-semibold text-foreground truncate">
																	{course.name}
																</h4>
																<div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-0.5 truncate">
																	<span>{course.category}</span>
																	{course.academicStage && (
																		<>
																			<span>•</span>
																			<span className="text-purple-600 dark:text-purple-400 font-medium">
																				{course.academicStage}
																			</span>
																		</>
																	)}
																	<span>•</span>
																	<span>
																		{course.durationText ||
																			(course.durationWeeks
																				? `${toArabicNumerals(course.durationWeeks)} أسابيع`
																				: "بدون مدة")}
																	</span>
																	<span>•</span>
																	<span>{formatLessonsCount(course.lessonsCount)}</span>
																</div>
															</div>
														</div>

														<button
															type="button"
															onClick={() => onToggleCourse(course.id)}
															className={cn(
																"size-6.5 rounded-full flex items-center justify-center transition-all shrink-0 cursor-pointer",
																isSelected
																	? "bg-purple-600 text-white shadow-2xs hover:bg-purple-700"
																	: "border border-border/80 text-muted-foreground hover:text-foreground hover:border-foreground/40 hover:bg-muted/60",
															)}
															title={isSelected ? "إزالة من الاختيار" : "إضافة إلى المسار"}
														>
															{isSelected ? (
																<IconCheck className="size-3 stroke-[2.5]" />
															) : (
																<IconPlus className="size-3.5 stroke-[2]" />
															)}
														</button>
													</div>
												);
											})
										)}
									</div>
								)}
							</div>
						)}

						{/* ================= 2. قسم المكتبة والمراجع ================= */}
						{(selectedContentTypes.length === 0 ||
							selectedContentTypes.includes("library")) && (
							<div className="rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/30 transition-all overflow-hidden">
								<button
									type="button"
									onClick={() => toggleSection("library")}
									className="w-full px-3.5 py-2.5 flex items-center justify-between cursor-pointer select-none text-right bg-transparent border-0"
								>
									<div className="flex items-center gap-2.5 min-w-0">
										<div className="size-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 border border-teal-200/60 dark:border-teal-800/40 shadow-2xs">
											<IconFolder className="size-4" />
										</div>
										<div className="flex items-center gap-2">
											<h3 className="text-xs sm:text-sm font-bold text-foreground">
												المكتبة والمراجع
											</h3>
											<Badge
												variant="secondary"
												className="text-[10px] h-4.5 px-2 font-medium rounded-full bg-background border border-border/60 text-muted-foreground"
											>
												{toArabicNumerals(filteredLibraryResources.length)}
											</Badge>
										</div>
									</div>
									<IconChevronDown
										className={cn(
											"size-4 text-muted-foreground transition-transform duration-200 shrink-0",
											openSections.library && "rotate-180",
										)}
									/>
								</button>

								{openSections.library && (
									<div className="border-t border-border/50 divide-y divide-border/40 bg-card/60">
										{filteredLibraryResources.length === 0 ? (
											<div className="py-6 text-center text-xs text-muted-foreground">
												لا توجد موارد مطابقة للبحث في المكتبة
											</div>
										) : (
											filteredLibraryResources.map((res) => {
												const isSelected = selectedLibraryIds.includes(res.id);
												const conf = TYPE_CONFIG[res.type] || TYPE_CONFIG.pdf;
												const IconC = conf.icon || IconFile;

												return (
													<div
														key={res.id}
														className={cn(
															"px-3.5 py-2 flex items-center justify-between gap-3 transition-colors select-none",
															isSelected
																? "bg-teal-50/40 dark:bg-teal-950/20"
																: "hover:bg-muted/30",
														)}
													>
														<div className="flex items-center gap-2.5 min-w-0 text-right">
															<div
																className={cn(
																	"size-7.5 rounded-lg flex items-center justify-center shrink-0 border shadow-2xs",
																	conf.bg,
																	conf.color,
																)}
															>
																<IconC className="size-3.5" />
															</div>
															<div className="min-w-0">
																<h4 className="text-xs font-semibold text-foreground truncate">
																	{res.title}
																</h4>
																<div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-0.5 truncate">
																	<span className="font-medium text-teal-600 dark:text-teal-400">
																		{conf.label}
																	</span>
																	<span>•</span>
																	<span>{res.categoryLabel}</span>
																	<span>•</span>
																	<span>{res.size}</span>
																</div>
															</div>
														</div>

														<button
															type="button"
															onClick={() => handleToggleLibraryItem(res)}
															className={cn(
																"size-6.5 rounded-full flex items-center justify-center transition-all shrink-0 cursor-pointer",
																isSelected
																	? "bg-purple-600 text-white shadow-2xs hover:bg-purple-700"
																	: "border border-border/80 text-muted-foreground hover:text-foreground hover:border-foreground/40 hover:bg-muted/60",
															)}
															title={isSelected ? "إزالة من الاختيار" : "إضافة إلى المسار"}
														>
															{isSelected ? (
																<IconCheck className="size-3 stroke-[2.5]" />
															) : (
																<IconPlus className="size-3.5 stroke-[2]" />
															)}
														</button>
													</div>
												);
											})
										)}
									</div>
								)}
							</div>
						)}

						{/* ================= 3. قسم التقييمات والاختبارات ================= */}
						{(selectedContentTypes.length === 0 ||
							selectedContentTypes.includes("quizzes")) && (
							<div className="rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/30 transition-all overflow-hidden">
								<button
									type="button"
									onClick={() => toggleSection("quizzes")}
									className="w-full px-3.5 py-2.5 flex items-center justify-between cursor-pointer select-none text-right bg-transparent border-0"
								>
									<div className="flex items-center gap-2.5 min-w-0">
										<div className="size-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200/60 dark:border-amber-800/40 shadow-2xs">
											<IconListCheck className="size-4" />
										</div>
										<div className="flex items-center gap-2">
											<h3 className="text-xs sm:text-sm font-bold text-foreground">
												التقييمات والاختبارات
											</h3>
											<Badge
												variant="secondary"
												className="text-[10px] h-4.5 px-2 font-medium rounded-full bg-background border border-border/60 text-muted-foreground"
											>
												{toArabicNumerals(filteredQuizzes.length)}
											</Badge>
										</div>
									</div>
									<IconChevronDown
										className={cn(
											"size-4 text-muted-foreground transition-transform duration-200 shrink-0",
											openSections.quizzes && "rotate-180",
										)}
									/>
								</button>

								{openSections.quizzes && (
									<div className="border-t border-border/50 divide-y divide-border/40 bg-card/60">
										{isQuizzesLoading ? (
											<div className="flex flex-col items-center justify-center py-6 gap-2">
												<Spinner className="size-4 text-amber-600" />
												<span className="text-xs text-muted-foreground">
													جارٍ تحميل التقييمات...
												</span>
											</div>
										) : filteredQuizzes.length === 0 ? (
											<div className="py-6 text-center text-xs text-muted-foreground">
												لا توجد تقييمات مطابقة للبحث
											</div>
										) : (
											filteredQuizzes.map((quiz) => {
												const isSelected = selectedQuizIds.includes(quiz.id);
												return (
													<div
														key={quiz.id}
														className={cn(
															"px-3.5 py-2 flex items-center justify-between gap-3 transition-colors select-none",
															isSelected
																? "bg-amber-50/40 dark:bg-amber-950/20"
																: "hover:bg-muted/30",
														)}
													>
														<div className="flex items-center gap-2.5 min-w-0 text-right">
															<div className="size-7.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200/60 dark:border-amber-800/40 shadow-2xs">
																<IconRosetteDiscountCheck className="size-3.5" />
															</div>
															<div className="min-w-0">
																<h4 className="text-xs font-semibold text-foreground truncate">
																	{quiz.title}
																</h4>
																<div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-0.5 truncate">
																	<span className="text-amber-600 dark:text-amber-400 font-medium">
																		{quiz.code}
																	</span>
																	<span>•</span>
																	<span>
																		{quiz.timeLimitMinutes
																			? `${toArabicNumerals(quiz.timeLimitMinutes)} دقيقة`
																			: "بدون وقت محدد"}
																	</span>
																	<span>•</span>
																	<span>
																		{toArabicNumerals(quiz._count?.questions || 0)} أسئلة
																	</span>
																</div>
															</div>
														</div>

														<button
															type="button"
															onClick={() => handleToggleQuiz(quiz)}
															className={cn(
																"size-6.5 rounded-full flex items-center justify-center transition-all shrink-0 cursor-pointer",
																isSelected
																	? "bg-purple-600 text-white shadow-2xs hover:bg-purple-700"
																	: "border border-border/80 text-muted-foreground hover:text-foreground hover:border-foreground/40 hover:bg-muted/60",
															)}
															title={isSelected ? "إزالة من الاختيار" : "إضافة إلى المسار"}
														>
															{isSelected ? (
																<IconCheck className="size-3 stroke-[2.5]" />
															) : (
																<IconPlus className="size-3.5 stroke-[2]" />
															)}
														</button>
													</div>
												);
											})
										)}
									</div>
								)}
							</div>
						)}

						{/* ================= 4. قسم الصفحات والمستندات ================= */}
						{(selectedContentTypes.length === 0 || selectedContentTypes.includes("pages")) && (
							<div className="rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/30 transition-all overflow-hidden">
								<button
									type="button"
									onClick={() => toggleSection("pages")}
									className="w-full px-3.5 py-2.5 flex items-center justify-between cursor-pointer select-none text-right bg-transparent border-0"
								>
									<div className="flex items-center gap-2.5 min-w-0">
										<div className="size-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 border border-sky-200/60 dark:border-sky-800/40 shadow-2xs">
											<IconFileText className="size-4" />
										</div>
										<div className="flex items-center gap-2">
											<h3 className="text-xs sm:text-sm font-bold text-foreground">
												الصفحات والمستندات
											</h3>
											<Badge
												variant="secondary"
												className="text-[10px] h-4.5 px-2 font-medium rounded-full bg-background border border-border/60 text-muted-foreground"
											>
												{toArabicNumerals(filteredPages.length)}
											</Badge>
										</div>
									</div>
									<IconChevronDown
										className={cn(
											"size-4 text-muted-foreground transition-transform duration-200 shrink-0",
											openSections.pages && "rotate-180",
										)}
									/>
								</button>

								{openSections.pages && (
									<div className="border-t border-border/50 divide-y divide-border/40 bg-card/60">
										{filteredPages.length === 0 ? (
											<div className="py-6 text-center text-xs text-muted-foreground">
												لا توجد صفحات مطابقة للبحث
											</div>
										) : (
											filteredPages.map((page) => {
												const isSelected = selectedPageIds.includes(page.id);
												return (
													<div
														key={page.id}
														className={cn(
															"px-3.5 py-2 flex items-center justify-between gap-3 transition-colors select-none",
															isSelected
																? "bg-sky-50/40 dark:bg-sky-950/20"
																: "hover:bg-muted/30",
														)}
													>
														<div className="flex items-center gap-2.5 min-w-0 text-right">
															<div className="size-7.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 border border-sky-200/60 dark:border-sky-800/40 shadow-2xs">
																<IconFileDescription className="size-3.5" />
															</div>
															<div className="min-w-0">
																<h4 className="text-xs font-semibold text-foreground truncate">
																	{page.title}
																</h4>
																<div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-0.5 truncate">
																	<span className="text-sky-600 dark:text-sky-400 font-medium">
																		{toArabicNumerals(page.readingTimeMinutes)} دقائق
																	</span>
																	<span>•</span>
																	<span>{page.category}</span>
																	<span>•</span>
																	<span>{page.author}</span>
																</div>
															</div>
														</div>

														<button
															type="button"
															onClick={() => handleTogglePage(page)}
															className={cn(
																"size-6.5 rounded-full flex items-center justify-center transition-all shrink-0 cursor-pointer",
																isSelected
																	? "bg-purple-600 text-white shadow-2xs hover:bg-purple-700"
																	: "border border-border/80 text-muted-foreground hover:text-foreground hover:border-foreground/40 hover:bg-muted/60",
															)}
															title={isSelected ? "إزالة من الاختيار" : "إضافة إلى المسار"}
														>
															{isSelected ? (
																<IconCheck className="size-3 stroke-[2.5]" />
															) : (
																<IconPlus className="size-3.5 stroke-[2]" />
															)}
														</button>
													</div>
												);
											})
										)}
									</div>
								)}
							</div>
						)}
					</div>
				</div>

				{/* ================= الجانب الأيسر: المحتوى المختار (Selected Content) ================= */}
				<div className="flex flex-col w-full md:w-1/2 flex-1 min-w-0 bg-muted/10 overflow-hidden">
					{/* ترويسة الجانب الأيسر: Selected Content مع العداد */}
					<div className="px-3.5 py-2.5 border-b border-border/60 bg-muted/15 flex items-center justify-between shrink-0">
						<div className="flex items-center gap-2">
							<span className="text-sm font-bold text-foreground">المحتوى المختار</span>
							<span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-muted border border-border/60 text-foreground">
								{toArabicNumerals(selectedTotals.count)}
							</span>
						</div>

						{selectedTotals.count > 0 && (
							<button
								type="button"
								onClick={onClearAll}
								className="text-xs text-muted-foreground hover:text-destructive cursor-pointer font-medium transition-colors"
							>
								إفراغ الكل
							</button>
						)}
					</div>

					{/* محتوى الجانب الأيسر: الحالة الفارغة المماثلة للتصميم المرجعي أو قائمة العناصر المختارة */}
					{selectedTotals.count === 0 ? (
						<div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none space-y-2.5">
							{/* رسم الورقة مع علامة الاستفهام المطابق تماماً للصورة */}
							<div className="size-16 text-muted-foreground/60 flex items-center justify-center">
								<svg
									className="size-14 stroke-current fill-none"
									viewBox="0 0 64 64"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M18 10C18 7.79086 19.7909 6 22 6H36L48 18V48C48 50.2091 46.2091 52 44 52H22C19.7909 52 18 50.2091 18 48V10Z"
										strokeWidth="2.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M36 6V18H48"
										strokeWidth="2.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M25 22H31M25 28H41M25 34H33"
										strokeWidth="2"
										strokeLinecap="round"
									/>
									<circle
										cx="43"
										cy="43"
										r="9"
										className="fill-card stroke-current"
										strokeWidth="2.5"
									/>
									<path
										d="M41 40.8C41 39.5 41.9 38.6 43 38.6C44.1 38.6 45 39.5 45 40.6C45 41.7 43.7 42.1 43 42.9V43.5M43 45.8H43.01"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</div>

							<div>
								<h4 className="text-sm font-bold text-foreground">لا يوجد محتوى</h4>
								<p className="text-xs text-muted-foreground mt-1 max-w-[230px] leading-relaxed">
									يرجى اختيار العناصر التي ترغب في إضافتها إلى المسار من القائمة المقابلة.
								</p>
							</div>
						</div>
					) : (
						<div className="flex-1 overflow-y-auto p-3 space-y-2">
							{selectedSummaryItems.map((item) => {
								const IconC = item.iconComp || IconSchool;
								const typeTheme =
									item.type === "COURSE"
										? "text-purple-600 bg-purple-50 dark:bg-purple-950/60 border-purple-200/60 dark:border-purple-800/40"
										: item.type === "QUIZ"
											? "text-amber-600 bg-amber-50 dark:bg-amber-950/60 border-amber-200/60 dark:border-amber-800/40"
											: item.type === "LIBRARY"
												? "text-teal-600 bg-teal-50 dark:bg-teal-950/60 border-teal-200/60 dark:border-teal-800/40"
												: "text-sky-600 bg-sky-50 dark:bg-sky-950/60 border-sky-200/60 dark:border-sky-800/40";

								return (
									<div
										key={item.id}
										className="px-3 py-2 rounded-xl border border-border/70 bg-card hover:border-purple-300 dark:hover:border-purple-800 transition-all flex items-center justify-between gap-2.5 shadow-2xs"
									>
										<div className="flex items-center gap-2.5 min-w-0 text-right">
											<div
												className={cn(
													"size-7.5 rounded-lg flex items-center justify-center shrink-0 border shadow-2xs",
													typeTheme,
												)}
											>
												<IconC className="size-3.5" />
											</div>

											<div className="min-w-0">
												<h5 className="text-xs font-semibold text-foreground truncate">
													{item.title}
												</h5>
												<div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-0.5 truncate">
													<span className="font-medium text-foreground/85">
														{item.typeLabel}
													</span>
													<span>•</span>
													<span>{item.durationText}</span>
												</div>
											</div>
										</div>

										<button
											type="button"
											onClick={() => handleRemoveSelectedItem(item)}
											className="size-6 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive flex items-center justify-center transition-colors cursor-pointer shrink-0"
											title="إزالة"
										>
											<IconX className="size-3.5" />
										</button>
									</div>
								);
							})}
						</div>
					)}

					{/* ملخص إجمالي المدة والتكلفة في أسفل الجانب الأيسر عند وجود عناصر مختارة */}
					{selectedTotals.count > 0 && (
						<div className="px-3.5 py-2 border-t border-border/60 bg-card/80 shrink-0 text-xs text-muted-foreground flex items-center justify-between">
							<div className="flex items-center gap-1">
								<span>الإجمالي:</span>
								<span className="font-semibold text-foreground">
									{toArabicNumerals(selectedTotals.count)} عنصر
								</span>
							</div>
							{selectedTotals.totalWeeks > 0 && (
								<div className="flex items-center gap-1">
									<span>المدة:</span>
									<span className="font-semibold text-purple-600 dark:text-purple-400">
										{toArabicNumerals(selectedTotals.totalWeeks)} أسابيع
									</span>
								</div>
							)}
							{selectedTotals.totalPrice > 0 && (
								<div className="flex items-center gap-1">
									<span>التكلفة:</span>
									<span className="font-semibold text-foreground">
										{toArabicNumerals(selectedTotals.totalPrice)} ج.م
									</span>
								</div>
							)}
						</div>
					)}
				</div>
			</div>

			{/* ================= التذييل السفلي: الإرشاد + الإجراءات (مطابق للفوتر في التصميم) ================= */}
			<div className="pt-3 flex items-center justify-between gap-3 shrink-0 flex-wrap">
				{/* الطرف الأيمن: النص الإرشادي ⓘ Select at least 1 content to add to the learning path */}
				<div className="flex items-center gap-1.5 text-xs text-muted-foreground select-none">
					<IconInfoCircle className="size-4 text-muted-foreground/80 shrink-0" />
					<span>حدد عنصراً واحداً على الأقل لإضافته إلى المسار التعليمي</span>
				</div>

				{/* الطرف الأيسر: الإجراءات (مدة المسار + واتساب + رجوع + التالي) */}
				<div className="flex items-center gap-2">
					{onTrackDurationChange && (
						<DurationPickerPopover
							value={trackDuration || ""}
							onChange={onTrackDurationChange}
							label="مدة المسار"
						/>
					)}

					<div className="flex items-center gap-1.5 text-xs text-muted-foreground select-none ms-1 me-1">
						<IconBrandWhatsapp className="size-3.5 text-emerald-600 dark:text-emerald-400" />
						<Switch
							checked={notifyWhatsApp}
							onCheckedChange={onNotifyWhatsAppChange}
						/>
					</div>

					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={onBackToForm}
						disabled={isSubmitting}
						className="h-8.5 px-3 rounded-lg text-xs font-medium border-border/80 hover:bg-muted cursor-pointer"
					>
						<span>رجوع</span>
					</Button>

					<Button
						type="button"
						size="sm"
						onClick={onNextToStructure || onSubmit}
						disabled={isSubmitting || selectedTotals.count === 0}
						className="h-8.5 px-4 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white cursor-pointer shadow-xs disabled:opacity-50 gap-1.5"
					>
						<span>التالي: هيكل ومراحل المسار</span>
						<IconArrowLeft className="size-3 stroke-[2.5]" />
					</Button>
				</div>
			</div>
		</div>
	);
}
