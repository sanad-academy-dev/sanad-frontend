import {
	IconArrowDown,
	IconArrowRight,
	IconArrowUp,
	IconBook,
	IconChevronDown,
	IconClock,
	IconDots,
	IconEdit,
	IconEye,
	IconFileText,
	IconFlag,
	IconGripVertical,
	IconHelpCircle,
	IconPencil,
	IconPlayerPlayFilled,
	IconPlus,
	IconRoute,
	IconTrash,
} from "@tabler/icons-react";
import React, { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { CoverPicker } from "@/features/services/training/components/cover-picker";
import { formatCourseDuration } from "@/features/services/training/data/training";
import { useCourses } from "@/features/services/training/hooks/use-courses";
import { resolveCover } from "@/features/services/training/utils/cover";
import { cn } from "@/lib/utils";
import { DurationPickerPopover } from "./duration-picker-popover";
import {
	formatArabicDate,
	formatLessonsCount,
	toArabicNumerals,
} from "./track-courses-step";

export type TrackItemType = "COURSE" | "PAGE" | "QUIZ";

export interface TrackStageItem {
	id: string;
	refId?: string;
	type: TrackItemType;
	courseId?: string;
	title: string;
	durationText: string;
	durationWeeks?: number;
	durationHours?: number;
	lessonsCount?: number;
	chaptersCount?: number;
	description?: string;
	status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
	iconColor?: string; // "orange" | "yellow" | "blue" | "purple" | "emerald"
	updatedDate?: string;
	coverKey?: string | null;
}

export interface TrackStage {
	id: string;
	title: string; // مثل: Junior / المستوى التأسيسي
	description?: string;
	items: TrackStageItem[];
}

export interface TrackStructure {
	priorityPath: "SEQUENTIAL" | "FLEXIBLE";
	stages: TrackStage[];
	coverKey?: string | null;
}

export interface TrackStructureStepProps {
	isEdit: boolean;
	trackName: string;
	trackCode?: string;
	trackCategory?: string;
	trackStage?: string;
	selectedCourseIds: string[];
	onSelectedCourseIdsChange?: (courseIds: string[]) => void;
	stages?: TrackStage[];
	onStagesChange?: (stages: TrackStage[]) => void;
	priorityPath?: "SEQUENTIAL" | "FLEXIBLE";
	onPriorityPathChange?: (val: "SEQUENTIAL" | "FLEXIBLE") => void;
	coverKey?: string | null;
	onCoverKeyChange?: (cover: string | null) => void;
	notes?: string;
	initialDuration?: string;
	trackDuration?: string;
	onTrackDurationChange?: (duration: string) => void;
	onBackToCourses: () => void;
	onSubmit: (finalData: {
		stages: TrackStage[];
		priorityPath: "SEQUENTIAL" | "FLEXIBLE";
		coverKey?: string | null;
		calculatedDuration?: string;
		status?: "ACTIVE" | "DRAFT";
	}) => void;
	isSubmitting: boolean;
	onClose: () => void;
}

const COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
	orange: {
		bg: "bg-amber-500 dark:bg-amber-600",
		text: "text-white",
		border: "border-amber-400",
	},
	yellow: {
		bg: "bg-yellow-500 dark:bg-yellow-600",
		text: "text-white",
		border: "border-yellow-400",
	},
	blue: {
		bg: "bg-sky-500 dark:bg-sky-600",
		text: "text-white",
		border: "border-sky-400",
	},
	purple: {
		bg: "bg-purple-600 dark:bg-purple-700",
		text: "text-white",
		border: "border-purple-400",
	},
	emerald: {
		bg: "bg-emerald-500 dark:bg-emerald-600",
		text: "text-white",
		border: "border-emerald-400",
	},
};

const COLOR_KEYS = ["orange", "yellow", "blue", "purple", "emerald"];

// استخراج الهيكل المحفوظ من الملاحظات بدقة مع دعم الأقواس المتداخلة والسلاسل النصية داخل JSON
export const parseTrackStructure = (notes?: string | null): TrackStructure | null => {
	if (!notes) return null;
	const prefix = "[track_structure:";
	const startIdx = notes.indexOf(prefix);
	if (startIdx === -1) return null;

	const jsonStart = startIdx + prefix.length;
	let depth = 0;
	let inString = false;
	let escaped = false;
	let jsonEnd = -1;

	for (let i = jsonStart; i < notes.length; i++) {
		const char = notes[i];
		if (escaped) {
			escaped = false;
			continue;
		}
		if (char === "\\") {
			escaped = true;
			continue;
		}
		if (char === '"') {
			inString = !inString;
			continue;
		}
		if (!inString) {
			if (char === "{" || char === "[") {
				depth++;
			} else if (char === "}" || char === "]") {
				depth--;
				if (depth === 0) {
					jsonEnd = i + 1;
					break;
				}
			}
		}
	}

	if (jsonEnd === -1) {
		const fallbackEnd = notes.lastIndexOf("}]");
		if (fallbackEnd > jsonStart) {
			try {
				return JSON.parse(notes.slice(jsonStart, fallbackEnd + 1));
			} catch {
				return null;
			}
		}
		return null;
	}

	try {
		return JSON.parse(notes.slice(jsonStart, jsonEnd));
	} catch {
		return null;
	}
};

// دالة تعريب أسماء المراحل الإنجليزية القديمة أو الافتراضية
export const translateStageTitle = (title?: string | null): string => {
	if (!title) return "المستوى التأسيسي";
	const trimmed = title.trim();
	const lower = trimmed.toLowerCase();
	if (lower === "junior" || lower.includes("junior")) return "المستوى التأسيسي";
	if (
		lower === "intermediate" ||
		lower === "intermediete" ||
		lower.includes("intermediate") ||
		lower.includes("intermediete")
	)
		return "المستوى المتوسط";
	if (lower === "advanced" || lower.includes("advanced")) return "المستوى المتقدم";
	if (lower.startsWith("stage")) {
		const num = lower.replace(/\D/g, "");
		return num ? `المرحلة ${num}` : "مرحلة جديدة";
	}
	return trimmed;
};

// تعريب نماذج العناوين الافتراضية القديمة
export const translateSampleTitle = (title?: string | null): string => {
	if (!title) return "دورة تدريبية";
	const trimmed = title.trim();
	const lower = trimmed.toLowerCase();
	if (
		lower.includes("consistantbility") ||
		lower.includes("margin") ||
		lower.includes("padding")
	)
		return "مبادئ الهوامش والمسافات المتسقة";
	if (lower.includes("clean design") || lower.includes("layouting")) {
		if (lower.includes("evaluation") || lower.includes("quiz")) {
			return "تقييم شامل: بناء وتصميم الهيكل النظيف";
		}
		return "طرق بناء وتصميم الهيكل النظيف";
	}
	if (lower.includes("mobile") || lower.includes("direction layout"))
		return "تصميم الواجهات المتجاوبة للهواتف والحواسيب";
	if (
		lower.includes("understand the basic") ||
		lower.includes("spacing") ||
		lower.includes("grid")
	)
		return "فهم أساسيات الشبكات والمسافات البصرية";
	return trimmed;
};

// تعريب الأوصاف النموذجية القديمة
export const translateSampleDescription = (desc?: string | null): string => {
	if (!desc) return "";
	const lower = desc.toLowerCase();
	if (lower.includes("enhance button accessibility"))
		return "تحسين إمكانية الوصول ومرونة واجهة المستخدم.";
	if (lower.includes("test your understanding") || lower.includes("design principles"))
		return "اختبار استيعاب قواعد وتصميم وتخطيط الواجهات والمنهجيات العملية.";
	if (lower.includes("design responsive patterns"))
		return "بناء أنماط تصميمية متجاوبة على مختلف مقاسات الشاشات.";
	if (lower.includes("master modern grid layouts"))
		return "إتقان الشبكات الحديثة وتنسيق التباعد النسبي بشكل احترافي.";
	return desc;
};

// تجريد وصف الدورة من وسوم النظام التقنية مثل [icon:...] [color:...] [stage:...] [notes:...] وأي شظايا مشوهة
export const cleanCourseDescription = (desc?: string | null): string => {
	if (!desc) return "";
	const cleaned = desc
		.replace(/\[color:[^\]]+\]/gi, "")
		.replace(/\[icon:[^\]]+\]/gi, "")
		.replace(/\[stage:[^\]]+\]/gi, "")
		.replace(/\[notes:[\s\S]*?\]/gi, "")
		.replace(/\[courses:[^\]]*\]/gi, "")
		.replace(/\[track_structure:[\s\S]*?\]/gi, "")
		.replace(/\[[^\]]+\]/g, "")
		.replace(/id":"item-[^"]*"/gi, "")
		.replace(/"[a-zA-Z0-9_-]+"\s*:\s*"?[^",}\]]*"?/gi, "")
		.replace(/[{}[\]"]+/g, " ")
		.replace(/\s+/g, " ")
		.trim();

	if (!cleaned || cleaned.length < 2 || /^[{}[\]":,\s]+$/.test(cleaned)) {
		return "";
	}
	return cleaned;
};

export function TrackStructureStep({
	isEdit,
	trackName,
	trackCode,
	trackCategory,
	trackStage,
	selectedCourseIds,
	onSelectedCourseIdsChange,
	stages: passedStages,
	onStagesChange,
	priorityPath: passedPriorityPath,
	onPriorityPathChange,
	coverKey: initialCoverKey,
	onCoverKeyChange,
	notes,
	initialDuration,
	trackDuration,
	onTrackDurationChange,
	onBackToCourses,
	onSubmit,
	isSubmitting,
	onClose,
}: TrackStructureStepProps) {
	const { courses: serverCourses } = useCourses();
	const [coverKey, setCoverKey] = useState<string | null>(initialCoverKey ?? null);
	const [internalPriorityPath, setInternalPriorityPath] = useState<"SEQUENTIAL" | "FLEXIBLE">(
		"SEQUENTIAL",
	);

	const priorityPath = passedPriorityPath ?? internalPriorityPath;
	const setPriorityPath = useCallback(
		(val: "SEQUENTIAL" | "FLEXIBLE") => {
			setInternalPriorityPath(val);
			onPriorityPathChange?.(val);
		},
		[onPriorityPathChange],
	);

	// جلب الدورات الحقيقية المتاحة فقط من الخادم بدون أي بيانات وهمية
	const allAvailableCourses = useMemo(() => {
		if (!serverCourses || serverCourses.length === 0) {
			return [];
		}

		return serverCourses.map((c) => {
			const formattedDuration =
				formatCourseDuration(c.startDate, c.dueDate, c.estimatedDurationWeeks) ||
				(c.estimatedDurationWeeks
					? `${toArabicNumerals(c.estimatedDurationWeeks)} أسابيع`
					: "تحديد المدة");

			return {
				id: c.id,
				name: c.name,
				code: c.code || "",
				category: c.category || c.department || "عام",
				coverKey: c.coverKey || null,
				durationWeeks: c.estimatedDurationWeeks ?? null,
				durationText: formattedDuration,
				durationHours: c.estimatedDurationWeeks ? c.estimatedDurationWeeks * 2 : 6,
				lessonsCount: c.contentCount ?? 0,
				chaptersCount: undefined as number | undefined,
				status: (c.status || "PUBLISHED") as "PUBLISHED" | "DRAFT" | "ARCHIVED",
				updatedAt: c.updatedAt,
				updatedDate: formatArabicDate(c.updatedAt),
				description: cleanCourseDescription(c.description),
			};
		});
	}, [serverCourses]);

	// خريطة الدورات للوصول السريع
	const coursesMap = useMemo(() => {
		const map = new Map<string, (typeof allAvailableCourses)[number]>();
		for (const c of allAvailableCourses) {
			map.set(c.id, c);
		}
		return map;
	}, [allAvailableCourses]);

	// تحويل دورة حقيقية إلى عنصر مرحلة داخل المسار
	const createItemFromCourse = useCallback(
		(course: (typeof allAvailableCourses)[number], idx = 0): TrackStageItem => {
			const color = COLOR_KEYS[idx % COLOR_KEYS.length];

			return {
				id: `item-${course.id}`,
				refId: course.id,
				type: "COURSE",
				courseId: course.id,
				title: course.name,
				durationText: course.durationText || "تحديد المدة",
				durationWeeks: course.durationWeeks ?? undefined,
				durationHours: course.durationHours,
				lessonsCount: course.lessonsCount ?? 0,
				chaptersCount: course.chaptersCount,
				description: cleanCourseDescription(course.description),
				status: course.status || "PUBLISHED",
				iconColor: color,
				updatedDate: course.updatedDate || "اليوم",
				coverKey: course.coverKey || null,
			};
		},
		[],
	);

	// دالة تنقية المراحل للتأكد التام من أن الدورات المعروضة هي حصراً الدورات المحددة وبدون أي تكرار
	const sanitizeStages = useCallback(
		(stagesToClean: TrackStage[], validCourseIds: string[]): TrackStage[] => {
			const validSet = new Set(validCourseIds);
			const seenCourseIds = new Set<string>();

			return stagesToClean.map((st) => ({
				...st,
				title: translateStageTitle(st.title),
				items: st.items.filter((it) => {
					if (it.type === "COURSE") {
						if (!it.courseId || !validSet.has(it.courseId)) return false;
						if (seenCourseIds.has(it.courseId)) return false;
						seenCourseIds.add(it.courseId);
					}
					return true;
				}),
			}));
		},
		[],
	);

	// تهيئة المراحل: نأخذ المراحل الممررة من الـ prop (إن وجدت) أو نفك الملاحظات، أو نولدها من selectedCourseIds
	const [internalStages, setInternalStages] = useState<TrackStage[]>(() => {
		const parsed = parseTrackStructure(notes);
		const raw =
			passedStages && passedStages.length > 0
				? passedStages
				: parsed?.stages && parsed.stages.length > 0
					? parsed.stages
					: null;

		if (raw && raw.length > 0) {
			return sanitizeStages(raw, selectedCourseIds);
		}

		// توليد مراحل أولية من الدورات المختارة الحقيقية فقط
		const stage1Items: TrackStageItem[] = [];
		const stage2Items: TrackStageItem[] = [];
		const effectiveIds = Array.from(new Set(selectedCourseIds));

		if (effectiveIds.length > 0) {
			const half = Math.ceil(effectiveIds.length / 2);

			effectiveIds.forEach((courseId, idx) => {
				const c = coursesMap.get(courseId);
				if (c) {
					const item = createItemFromCourse(c, idx);
					if (idx < half || effectiveIds.length <= 2) {
						stage1Items.push(item);
					} else {
						stage2Items.push(item);
					}
				}
			});
		}

		const initialStages: TrackStage[] = [
			{
				id: "stage-1",
				title: "المستوى التأسيسي",
				description: "المستوى التأسيسي الأول للمسار",
				items: stage1Items,
			},
		];

		if (stage2Items.length > 0) {
			initialStages.push({
				id: "stage-2",
				title: "المستوى المتوسط",
				description: "المستوى المتوسط والتطبيقي للمسار",
				items: stage2Items,
			});
		}

		return initialStages;
	});

	// المراحل المعروضة: نضمن دائماً أنها مطابقة حصراً للدورات المحددة وبدون أي تكرار مع ربط مباشر ببيانات الدورات الحية وإدراج أي دورات جديدة غير موضوعة بعد
	const stages = useMemo(() => {
		const current = passedStages ?? internalStages;
		// 1. تنقية المراحل واستبعاد أي دورة ألغي تحديدها من الخطوة 2 مع منع التكرار
		let sanitized = sanitizeStages(current, selectedCourseIds);

		// 2. تتبع الدورات الموضوعة حالياً في المراحل
		const placedCourseIds = new Set<string>();
		sanitized.forEach((st) => {
			st.items.forEach((it) => {
				if (it.courseId) placedCourseIds.add(it.courseId);
			});
		});

		// 3. الدورات المحددة التي لم تُوضع بعد في أي مرحلة (مثل دورة أضيفت حديثاً من الخطوة 2)
		const unplacedIds = selectedCourseIds.filter((id) => !placedCourseIds.has(id));

		if (unplacedIds.length > 0) {
			const newItems: TrackStageItem[] = [];
			unplacedIds.forEach((courseId, i) => {
				const c = coursesMap.get(courseId);
				if (c) {
					newItems.push(createItemFromCourse(c, sanitized.flatMap((s) => s.items).length + i));
				} else {
					newItems.push({
						id: `item-${courseId}-${Date.now()}-${i}`,
						refId: courseId,
						type: "COURSE",
						courseId,
						title: "دورة تدريبية",
						durationText: "تحديد المدة",
						durationWeeks: 1,
						durationHours: 6,
						lessonsCount: 0,
						chaptersCount: undefined,
						description: "",
						status: "DRAFT",
						iconColor: COLOR_KEYS[i % COLOR_KEYS.length],
						updatedDate: "محدث مؤخراً",
						coverKey: null,
					});
				}
			});

			if (newItems.length > 0) {
				if (sanitized.length === 0) {
					sanitized = [
						{
							id: "stage-1",
							title: "المستوى التأسيسي",
							description: "المستوى التأسيسي الأول للمسار",
							items: newItems,
						},
					];
				} else {
					const lastIdx = sanitized.length - 1;
					sanitized = sanitized.map((st, idx) => {
						if (idx === lastIdx) {
							return {
								...st,
								items: [...st.items, ...newItems],
							};
						}
						return st;
					});
				}
			}
		}

		// 4. ترقية وربط بيانات كل دورة بالبيانات الحية المحدثة
		return sanitized.map((st) => ({
			...st,
			items: st.items.map((item) => {
				if (item.courseId && coursesMap.has(item.courseId)) {
					const c = coursesMap.get(item.courseId);
					if (c) {
						// الاحتفاظ بأي تعديل مخصص للمدة قام به المستخدم، وإلا استخدام مدة الدورة الأصلية الحقيقية من قاعدة البيانات
						const resolvedDurationText =
							item.durationText &&
							item.durationText !== "أسبوعان" &&
							item.durationText !== "3 أسابيع" &&
							item.durationText !== "تحديد المدة"
								? item.durationText
								: (c.durationText || item.durationText);

						return {
							...item,
							title: c.name || item.title,
							durationText: resolvedDurationText,
							durationWeeks: item.durationWeeks ?? c.durationWeeks ?? undefined,
							durationHours: c.durationHours || item.durationHours,
							lessonsCount: c.lessonsCount ?? 0,
							chaptersCount: c.chaptersCount ?? undefined,
							status: c.status || item.status,
							updatedDate: c.updatedDate || item.updatedDate || "اليوم",
							description: cleanCourseDescription(c.description ?? item.description),
							coverKey: c.coverKey ?? item.coverKey,
						};
					}
				}
				return {
					...item,
					title: item.title || "دورة تدريبية",
					description: cleanCourseDescription(item.description),
				};
			}),
		}));
	}, [
		passedStages,
		internalStages,
		selectedCourseIds,
		sanitizeStages,
		coursesMap,
		createItemFromCourse,
	]);

	const stagesRef = React.useRef(stages);
	stagesRef.current = stages;

	const selectedCourseIdsRef = React.useRef(selectedCourseIds);
	selectedCourseIdsRef.current = selectedCourseIds;

	const onStagesChangeRef = React.useRef(onStagesChange);
	onStagesChangeRef.current = onStagesChange;

	const setStages = useCallback(
		(updater: TrackStage[] | ((prev: TrackStage[]) => TrackStage[])) => {
			setInternalStages(() => {
				const current = stagesRef.current;
				const next = typeof updater === "function" ? updater(current) : updater;
				const sanitized = sanitizeStages(next, selectedCourseIdsRef.current);
				onStagesChangeRef.current?.(sanitized);
				return sanitized;
			});
		},
		[sanitizeStages],
	);

	// الانتقال لخطوة اختيار الدورات (الخطوة 2) لاختيار دورات جديدة
	const handleGoToSelectCourses = useCallback(() => {
		onBackToCourses();
		toast.info("اختر الدورات المطلوبة من هذه الخطوة، وستُضاف تلقائياً إلى المرحلة في المسار");
	}, [onBackToCourses]);

	// تبويب لوحة المعاينة (العمود الأيسر): الخارطة أو المعاينة الحية للدرس المختار
	const [leftPreviewTab, setLeftPreviewTab] = useState<"roadmap" | "live">("roadmap");
	const [selectedPreviewItem, setSelectedPreviewItem] = useState<TrackStageItem | null>(null);

	// حالة النافذة المنبثقة لتعديل الدورة أو العنصر
	const [editingItem, setEditingItem] = useState<{
		stageId: string;
		item: TrackStageItem;
	} | null>(null);

	// حالة تعديل اسم المرحلة
	const [editingStageId, setEditingStageId] = useState<string | null>(null);
	const [editingStageTitle, setEditingStageTitle] = useState("");

	// حالات السحب والإفلات اليدوي بين المراحل
	const [draggedItem, setDraggedItem] = useState<{
		itemId: string;
		fromStageId: string;
	} | null>(null);
	const [dragOverStageId, setDragOverStageId] = useState<string | null>(null);
	const [dragOverTarget, setDragOverTarget] = useState<{
		stageId: string;
		itemIndex: number;
	} | null>(null);

	// حالة سحب وإفلات المرحلة بالكامل لإعادة ترتيب المراحل باليد
	const [draggedStageId, setDraggedStageId] = useState<string | null>(null);
	const [dragOverStageTargetId, setDragOverStageTargetId] = useState<string | null>(null);

	// حالة فتح/طي مراحل خارطة التعلم في لوحة المعاينة (العمود الأيسر)
	const [expandedRoadmapStages, setExpandedRoadmapStages] = useState<Record<string, boolean>>(
		{},
	);

	// تبديل فتح/طي مرحلة معينة في خارطة المعاينة
	const toggleRoadmapStage = (stageId: string) => {
		setExpandedRoadmapStages((prev) => ({
			...prev,
			[stageId]: !prev[stageId],
		}));
	};

	// توسيع أو طي كل مراحل الخارطة
	const toggleAllRoadmapStages = () => {
		const allExpanded =
			stages.length > 0 && stages.every((st) => expandedRoadmapStages[st.id]);
		if (allExpanded) {
			setExpandedRoadmapStages({});
		} else {
			const nextState: Record<string, boolean> = {};
			for (const st of stages) {
				nextState[st.id] = true;
			}
			setExpandedRoadmapStages(nextState);
		}
	};

	// حالة طي المراحل في المحرر الرئيسي
	const [collapsedEditorStages, setCollapsedEditorStages] = useState<Record<string, boolean>>(
		{},
	);
	const toggleEditorStage = (stageId: string) => {
		setCollapsedEditorStages((prev) => ({
			...prev,
			[stageId]: !prev[stageId],
		}));
	};

	// تحديث الغلاف
	const handleCoverChange = (newCover: string | null) => {
		setCoverKey(newCover);
		onCoverKeyChange?.(newCover);
	};

	// إضافة مرحلة جديدة
	const handleAddStage = (afterStageId?: string) => {
		const newStageNumber = stages.length + 1;
		const defaultName =
			newStageNumber === 1
				? "المستوى التأسيسي"
				: newStageNumber === 2
					? "المستوى المتوسط"
					: newStageNumber === 3
						? "المستوى المتقدم"
						: `المرحلة ${newStageNumber}`;

		const newStage: TrackStage = {
			id: `stage-${Date.now()}`,
			title: defaultName,
			description: `محتوى وأهداف المرحلة ${newStageNumber}`,
			items: [],
		};

		if (!afterStageId) {
			setStages((prev) => [...prev, newStage]);
		} else {
			setStages((prev) => {
				const idx = prev.findIndex((s) => s.id === afterStageId);
				if (idx === -1) return [...prev, newStage];
				const next = [...prev];
				next.splice(idx + 1, 0, newStage);
				return next;
			});
		}
		toast.success(`تمت إضافة مرحلة جديدة: ${defaultName}`);
	};

	// إضافة مرحلة جديدة مع عنصر بداخلها مباشرة بين المرحلتين
	const handleAddStageWithItem = (afterStageId: string, type: TrackItemType) => {
		if (type === "COURSE") {
			handleAddStage(afterStageId);
			handleGoToSelectCourses();
			return;
		}

		const newStageNumber = stages.length + 1;
		const defaultName =
			newStageNumber === 1
				? "المستوى التأسيسي"
				: newStageNumber === 2
					? "المستوى المتوسط"
					: newStageNumber === 3
						? "المستوى المتقدم"
						: `المرحلة ${newStageNumber}`;

		const typeLabels = {
			COURSE: "دورة تدريبية",
			PAGE: "صفحة تعليمية ومستند",
			QUIZ: "تقييم واختبار تدريبي",
		};
		const defaultDurations = {
			COURSE: "أسبوعان",
			PAGE: "يوم واحد",
			QUIZ: "ساعة واحدة",
		};
		const defaultIcons = {
			COURSE: "blue",
			PAGE: "orange",
			QUIZ: "yellow",
		};

		const newItem: TrackStageItem = {
			id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
			type,
			title: typeLabels[type],
			durationText: defaultDurations[type],
			durationHours: 1,
			lessonsCount: 1,
			chaptersCount: undefined,
			description: "",
			status: "PUBLISHED",
			iconColor: defaultIcons[type],
			updatedDate: "اليوم",
		};

		const newStage: TrackStage = {
			id: `stage-${Date.now()}`,
			title: defaultName,
			description: `محتوى وأهداف المرحلة ${newStageNumber}`,
			items: [newItem],
		};

		setStages((prev) => {
			const idx = prev.findIndex((s) => s.id === afterStageId);
			if (idx === -1) return [...prev, newStage];
			const next = [...prev];
			next.splice(idx + 1, 0, newStage);
			return next;
		});

		toast.success(
			`تمت إضافة ${defaultName} مع ${type === "PAGE" ? "صفحة ومستند" : "اختبار وتقييم"} بنجاح`,
		);
	};

	// حذف مرحلة بالكامل
	const handleDeleteStage = (stageId: string) => {
		if (stages.length <= 1) {
			toast.error("يجب الإبقاء على مرحلة واحدة على الأقل في المسار");
			return;
		}

		// تجميع معرفات الدورات داخل هذه المرحلة لحذفها من selectedCourseIds
		const targetStage = stages.find((s) => s.id === stageId);
		const courseIdsToDelete: string[] = [];
		if (targetStage) {
			targetStage.items.forEach((it) => {
				if (it.type === "COURSE" && it.courseId) {
					courseIdsToDelete.push(it.courseId);
				}
			});
		}

		if (courseIdsToDelete.length > 0) {
			const nextSelectedIds = selectedCourseIds.filter(
				(id) => !courseIdsToDelete.includes(id),
			);
			onSelectedCourseIdsChange?.(nextSelectedIds);
		}

		setStages((prev) => prev.filter((s) => s.id !== stageId));
		toast.info(`تم حذف المرحلة ${targetStage?.title || ""} بنجاح`);
	};

	// إضافة عنصر جديد داخل مرحلة معينة
	const handleAddItem = (stageId: string, type: TrackItemType, afterItemId?: string) => {
		if (type === "COURSE") {
			handleGoToSelectCourses();
			return;
		}

		const typeLabels = {
			COURSE: "دورة تدريبية",
			PAGE: "صفحة تعليمية ومستند",
			QUIZ: "تقييم واختبار تدريبي",
		};
		const defaultDurations = {
			COURSE: "أسبوعان",
			PAGE: "يوم واحد",
			QUIZ: "ساعة واحدة",
		};
		const defaultIcons = {
			COURSE: "blue",
			PAGE: "orange",
			QUIZ: "yellow",
		};

		const newItem: TrackStageItem = {
			id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
			type,
			title: typeLabels[type],
			durationText: defaultDurations[type],
			durationHours: 1,
			lessonsCount: 1,
			chaptersCount: undefined,
			description: "",
			status: "PUBLISHED",
			iconColor: defaultIcons[type],
			updatedDate: "اليوم",
		};

		setStages((prev) =>
			prev.map((stage) => {
				if (stage.id !== stageId) return stage;
				if (!afterItemId) {
					return { ...stage, items: [...stage.items, newItem] };
				}
				const idx = stage.items.findIndex((it) => it.id === afterItemId);
				if (idx === -1) return { ...stage, items: [...stage.items, newItem] };
				const nextItems = [...stage.items];
				nextItems.splice(idx + 1, 0, newItem);
				return { ...stage, items: nextItems };
			}),
		);

		toast.success(`تمت إضافة ${typeLabels[type]} إلى المرحلة`);
	};

	// حذف عنصر من المرحلة
	const handleDeleteItem = (stageId: string, itemId: string) => {
		let deletedCourseId: string | null = null;
		let deletedItemTitle = "";

		for (const st of stages) {
			const found = st.items.find((it) => it.id === itemId);
			if (found) {
				deletedItemTitle = found.title;
				if (found.type === "COURSE" && found.courseId) {
					deletedCourseId = found.courseId;
				}
				break;
			}
		}

		// 1. إذا كان دورة تدريبية، نقوم بحذفها من الدورات المختارة لمنع رجوعها نهائياً
		if (deletedCourseId) {
			const nextSelectedIds = selectedCourseIds.filter((id) => id !== deletedCourseId);
			onSelectedCourseIdsChange?.(nextSelectedIds);
		}

		// 2. حذفه من المرحلة
		setStages((prev) =>
			prev.map((st) =>
				st.id === stageId ? { ...st, items: st.items.filter((it) => it.id !== itemId) } : st,
			),
		);

		toast.success(`تم حذف "${deletedItemTitle || "العنصر"}" من المسار بنجاح`);
	};

	// تحريك العنصر للأعلى أو الأسفل داخل نفس المرحلة
	const handleMoveItem = (stageId: string, itemId: string, direction: "up" | "down") => {
		let movedItemTitle = "";
		setStages((prev) =>
			prev.map((st) => {
				if (st.id !== stageId) return st;
				const idx = st.items.findIndex((it) => it.id === itemId);
				if (idx === -1) return st;
				const targetIdx = direction === "up" ? idx - 1 : idx + 1;
				if (targetIdx < 0 || targetIdx >= st.items.length) return st;
				const nextItems = [...st.items];
				const [moved] = nextItems.splice(idx, 1);
				movedItemTitle = moved.title;
				nextItems.splice(targetIdx, 0, moved);
				return { ...st, items: nextItems };
			}),
		);
		if (movedItemTitle) {
			toast.success(`تمت إعادة ترتيب "${movedItemTitle}"`);
		}
	};

	// نقل العنصر إلى مرحلة أخرى بشكل ذري وفوري
	const handleTransferItem = (fromStageId: string, toStageId: string, itemId: string) => {
		if (fromStageId === toStageId) return;

		let itemToMove: TrackStageItem | null = null;
		for (const st of stages) {
			const found = st.items.find(
				(it) => it.id === itemId || (it.courseId && itemId.includes(it.courseId)),
			);
			if (found) {
				itemToMove = found;
				break;
			}
		}

		if (!itemToMove) return;
		const targetItem = itemToMove;

		setStages((prev) =>
			prev.map((st) => {
				// إزالة العنصر من أي مرحلة
				const filteredItems = st.items.filter(
					(it) =>
						it.id !== targetItem.id &&
						(!targetItem.courseId || it.courseId !== targetItem.courseId),
				);

				// إذا كانت هذه هي المرحلة الهدف، نقوم بإضافته إليها
				if (st.id === toStageId) {
					return { ...st, items: [...filteredItems, targetItem] };
				}

				return { ...st, items: filteredItems };
			}),
		);

		const targetStageTitle =
			stages.find((s) => s.id === toStageId)?.title || "المرحلة المحددة";
		toast.success(`تم نقل "${targetItem.title}" إلى ${targetStageTitle} بنجاح`);
	};

	// معالجات السحب والإفلات التفاعلي المباشر (Drag and Drop)
	const handleDragStart = (e: React.DragEvent, itemId: string, fromStageId: string) => {
		setDraggedItem({ itemId, fromStageId });
		try {
			e.dataTransfer.setData("application/json", JSON.stringify({ itemId, fromStageId }));
		} catch {
			// ignore
		}
		e.dataTransfer.effectAllowed = "move";
	};

	const handleDragEnd = () => {
		setDraggedItem(null);
		setDragOverStageId(null);
		setDragOverTarget(null);
	};

	const handleStageDragOver = (e: React.DragEvent, stageId: string) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
		if (dragOverStageId !== stageId) {
			setDragOverStageId(stageId);
		}
	};

	const handleStageDragLeave = (e: React.DragEvent, stageId: string) => {
		const related = e.relatedTarget as HTMLElement | null;
		if (!e.currentTarget.contains(related)) {
			if (dragOverStageId === stageId) {
				setDragOverStageId(null);
			}
		}
	};

	const handleItemDragOver = (e: React.DragEvent, stageId: string, itemIndex: number) => {
		e.preventDefault();
		e.stopPropagation();
		e.dataTransfer.dropEffect = "move";
		if (dragOverTarget?.stageId !== stageId || dragOverTarget?.itemIndex !== itemIndex) {
			setDragOverTarget({ stageId, itemIndex });
			setDragOverStageId(stageId);
		}
	};

	const handleDropOnStageOrItem = (
		e: React.DragEvent,
		targetStageId: string,
		targetIndex?: number,
	) => {
		e.preventDefault();
		e.stopPropagation();

		let dragData = draggedItem;
		if (!dragData) {
			try {
				const json = e.dataTransfer.getData("application/json");
				if (json) dragData = JSON.parse(json);
			} catch {
				// ignore
			}
		}

		setDraggedItem(null);
		setDragOverStageId(null);
		setDragOverTarget(null);

		if (!dragData) return;
		const { itemId, fromStageId } = dragData;

		const sourceStage = stages.find((s) => s.id === fromStageId);
		const targetStage = stages.find((s) => s.id === targetStageId);
		if (!sourceStage || !targetStage) return;

		const movedItem = sourceStage.items.find((it) => it.id === itemId);
		if (!movedItem) return;

		// إذا تم الإفلات في نفس المكان بنفس المرحلة
		if (fromStageId === targetStageId && targetIndex !== undefined) {
			const currentIndex = sourceStage.items.findIndex((it) => it.id === itemId);
			if (currentIndex === targetIndex) return;
		}

		setStages((prev) => {
			// 1. حذف العنصر من جميع المراحل أولاً لمنع التكرار
			const afterRemoval = prev.map((st) => ({
				...st,
				items: st.items.filter(
					(it) =>
						it.id !== itemId && (!movedItem.courseId || it.courseId !== movedItem.courseId),
				),
			}));

			// 2. إدراج العنصر في المرحلة الهدف
			return afterRemoval.map((st) => {
				if (st.id === targetStageId) {
					const nextItems = [...st.items];
					if (
						targetIndex !== undefined &&
						targetIndex >= 0 &&
						targetIndex <= nextItems.length
					) {
						nextItems.splice(targetIndex, 0, movedItem);
					} else {
						nextItems.push(movedItem);
					}
					return { ...st, items: nextItems };
				}
				return st;
			});
		});

		if (fromStageId !== targetStageId) {
			toast.success(`تم نقل "${movedItem.title}" إلى ${targetStage.title}`);
		} else {
			toast.success(`تمت إعادة ترتيب "${movedItem.title}"`);
		}
	};

	// معالجات سحب وإفلات المرحلة بالكامل باليد (Reorder Stages)
	const handleStageDragStart = (e: React.DragEvent, stageId: string) => {
		e.stopPropagation();
		setDraggedStageId(stageId);
		try {
			e.dataTransfer.setData("application/stage-id", stageId);
		} catch {
			// ignore
		}
		e.dataTransfer.effectAllowed = "move";
	};

	const handleStageDragEnd = () => {
		setDraggedStageId(null);
		setDragOverStageTargetId(null);
	};

	const handleStageReorderDragOver = (e: React.DragEvent, targetStageId: string) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";

		if (draggedStageId) {
			e.stopPropagation();
			if (dragOverStageTargetId !== targetStageId) {
				setDragOverStageTargetId(targetStageId);
			}
			return;
		}

		// إذا كان السحب لعنصر/دورة عادية
		handleStageDragOver(e, targetStageId);
	};

	const handleStageReorderDragLeave = (e: React.DragEvent, stageId: string) => {
		const related = e.relatedTarget as HTMLElement | null;
		if (!e.currentTarget.contains(related)) {
			if (draggedStageId && dragOverStageTargetId === stageId) {
				setDragOverStageTargetId(null);
			}
			handleStageDragLeave(e, stageId);
		}
	};

	const handleStageReorderDrop = (e: React.DragEvent, targetStageId: string) => {
		e.preventDefault();
		e.stopPropagation();

		let stageToMoveId = draggedStageId;
		if (!stageToMoveId) {
			try {
				stageToMoveId = e.dataTransfer.getData("application/stage-id");
			} catch {
				// ignore
			}
		}

		if (stageToMoveId) {
			setDraggedStageId(null);
			setDragOverStageTargetId(null);
			if (stageToMoveId !== targetStageId) {
				setStages((prev) => {
					const sourceIdx = prev.findIndex((s) => s.id === stageToMoveId);
					const targetIdx = prev.findIndex((s) => s.id === targetStageId);
					if (sourceIdx === -1 || targetIdx === -1) return prev;
					const next = [...prev];
					const [moved] = next.splice(sourceIdx, 1);
					next.splice(targetIdx, 0, moved);
					return next;
				});
				const movedStage = stages.find((s) => s.id === stageToMoveId);
				toast.success(
					`تم تغيير ترتيب المرحلة "${translateStageTitle(movedStage?.title || "")}" بنجاح`,
				);
			}
			return;
		}

		// إذا كان الإفلات لدورة أو عنصر
		handleDropOnStageOrItem(e, targetStageId);
	};

	// تحريك مرحلة لأعلى أو لأسفل بنقرة واحدة
	const handleMoveStage = (stageId: string, direction: "up" | "down") => {
		setStages((prev) => {
			const idx = prev.findIndex((s) => s.id === stageId);
			if (idx === -1) return prev;
			const targetIdx = direction === "up" ? idx - 1 : idx + 1;
			if (targetIdx < 0 || targetIdx >= prev.length) return prev;
			const next = [...prev];
			const [moved] = next.splice(idx, 1);
			next.splice(targetIdx, 0, moved);
			return next;
		});
		toast.success(
			direction === "up" ? "تم تحريك المرحلة للأعلى بنجاح" : "تم تحريك المرحلة للأسفل بنجاح",
		);
	};

	// حفظ تعديل عنصر
	const handleSaveItemEdit = (updatedItem: TrackStageItem) => {
		if (!editingItem) return;
		setStages((prev) =>
			prev.map((st) =>
				st.id === editingItem.stageId
					? {
							...st,
							items: st.items.map((it) => (it.id === updatedItem.id ? updatedItem : it)),
						}
					: st,
			),
		);
		setEditingItem(null);
		toast.success("تم تحديث بيانات ومدة الدورة بنجاح");
	};

	// حفظ اسم المرحلة
	const handleSaveStageTitle = (stageId: string) => {
		if (!editingStageTitle.trim()) return;
		setStages((prev) =>
			prev.map((st) => (st.id === stageId ? { ...st, title: editingStageTitle.trim() } : st)),
		);
		setEditingStageId(null);
	};

	// إجمالي عدد الدورات والمواد
	const totalItemsCount = useMemo(() => {
		return stages.reduce((acc, st) => acc + st.items.length, 0);
	}, [stages]);

	// حساب المدة التقديرية التلقائية للمسار
	const totalEstimatedDuration = useMemo(() => {
		if (initialDuration?.trim()) return initialDuration;
		return `${stages.length * 3} أسابيع`;
	}, [stages, initialDuration]);

	// تقديم الهيكل النهائي
	const handleFinalPublish = (status: "ACTIVE" | "DRAFT" = "ACTIVE") => {
		if (totalItemsCount === 0) {
			toast.error("يرجى إضافة دورة أو محتوى تعليمي واحد على الأقل داخل المسار");
			return;
		}

		onSubmit({
			stages,
			priorityPath,
			coverKey,
			calculatedDuration: totalEstimatedDuration,
			status,
		});
	};

	const resolvedCoverObj = resolveCover(coverKey);

	return (
		<div className="flex flex-col flex-1 min-h-0 bg-[#F9FAFB] dark:bg-background overflow-hidden">
			{/* مساحة العمل المقسمة: عمود المعاينة (يسار) + باني الهيكل والمراحل (يمين) */}
			<div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-border">
				{/* 1. الجانب الأيمن / الرئيسي: باني مراحل المسار والوقت */}
				<div className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-background">
					{/* غلاف المسار بالأعلى مع زر رفع الغلاف (بحجم مدمج ومريح للعين) */}
					<div
						className={cn(
							"relative w-full h-24 sm:h-28 flex items-end justify-between p-3 sm:p-4 bg-purple-100 dark:bg-purple-950/40 border-b border-border overflow-hidden transition-all",
						)}
					>
						{resolvedCoverObj?.type === "image" && (
							<img
								src={resolvedCoverObj.url}
								alt="غلاف المسار"
								className="absolute inset-0 size-full object-cover"
							/>
						)}
						{resolvedCoverObj?.type === "color" && (
							<div
								className="absolute inset-0 size-full opacity-90"
								style={{ backgroundColor: resolvedCoverObj.color }}
							/>
						)}
						{!resolvedCoverObj && (
							<div className="absolute inset-0 bg-gradient-to-r from-purple-200/80 via-purple-100 to-indigo-100 dark:from-purple-950 dark:to-indigo-950/50" />
						)}

						<div className="relative z-10 flex items-center justify-between w-full">
							<div className="flex items-center gap-2 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-lg text-white">
								<IconRoute className="size-3.5 text-purple-300" />
								<span className="text-xs font-bold">{trackName}</span>
								{trackCode && (
									<span className="text-[10px] font-mono opacity-80">• {trackCode}</span>
								)}
							</div>

							<div className="relative z-10">
								<CoverPicker
									value={coverKey}
									onChange={handleCoverChange}
									triggerLabel={coverKey ? "تغيير الغلاف" : "رفع غلاف"}
								/>
							</div>
						</div>
					</div>

					{/* شريط الإعدادات والتحكم في نمط التقدّم والمدة */}
					<div className="flex items-center justify-between px-4 sm:px-6 py-2 border-b border-border bg-card/60 backdrop-blur-xs text-xs gap-3 flex-wrap">
						<div className="flex items-center gap-2">
							<span className="font-bold text-foreground">ترتيب مسار التعلم</span>
							<Badge
								variant="outline"
								className="text-[10px] bg-muted/60"
							>
								{stages.length} مراحل • {totalItemsCount} محتويات
							</Badge>
						</div>

						<div className="flex items-center gap-3">
							{/* منتقي مدة المسار المحددة */}
							{onTrackDurationChange && (
								<DurationPickerPopover
									value={trackDuration || initialDuration}
									onChange={onTrackDurationChange}
									label="مدة المسار"
									placeholder="تحديد مدة المسار..."
									title="فترة المسار التدريبي"
									className="h-7 text-xs font-medium"
								/>
							)}

							{/* خيار طريقة التقدّم: تتابعي أو مرن */}
							<div className="flex items-center gap-2">
								<span className="text-muted-foreground font-medium text-[11px]">
									طريقة التقدّم:
								</span>
								<Select
									value={priorityPath}
									onValueChange={(val) => setPriorityPath(val as "SEQUENTIAL" | "FLEXIBLE")}
								>
									<SelectTrigger className="h-7 w-36 text-xs font-medium rounded-lg">
										<SelectValue placeholder="اختر طريقة التقدّم" />
									</SelectTrigger>
									<SelectContent align="end">
										<SelectItem
											value="SEQUENTIAL"
											className="text-xs cursor-pointer"
										>
											تتابعي (إلزامي بالترتيب)
										</SelectItem>
										<SelectItem
											value="FLEXIBLE"
											className="text-xs cursor-pointer"
										>
											مرن (اختيار حر للمتدرب)
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>

					{/* مساحة عرض المراحل والخط الزمني بحجم مدمج ومريح للعين */}
					<div className="p-4 sm:p-5 space-y-4 max-w-4xl mx-auto w-full">
						{stages.map((stage, stageIdx) => {
							const isStageDropActive =
								dragOverStageId === stage.id &&
								draggedItem !== null &&
								draggedItem.fromStageId !== stage.id;
							const isEditorCollapsed = Boolean(collapsedEditorStages[stage.id]);
							const isThisStageDragged = draggedStageId === stage.id;
							const isStageReorderTarget =
								draggedStageId !== null &&
								draggedStageId !== stage.id &&
								dragOverStageTargetId === stage.id;

							return (
								<React.Fragment key={stage.id}>
									{/* biome-ignore lint/a11y/noStaticElementInteractions: drag and drop stage dropzone */}
									<div
										onDragOver={(e) => handleStageReorderDragOver(e, stage.id)}
										onDragLeave={(e) => handleStageReorderDragLeave(e, stage.id)}
										onDrop={(e) => handleStageReorderDrop(e, stage.id)}
										className={cn(
											"space-y-2.5 relative rounded-xl p-3 border transition-all duration-200",
											isThisStageDragged &&
												"opacity-40 scale-[0.99] border-dashed border-purple-500 bg-purple-50/20 dark:bg-purple-950/20",
											isStageReorderTarget &&
												"border-2 border-purple-600 bg-purple-50/40 dark:bg-purple-950/30 ring-2 ring-purple-400/40 scale-[1.01]",
											!isThisStageDragged &&
												!isStageReorderTarget &&
												(isStageDropActive
													? "border-purple-500 bg-purple-50/40 dark:bg-purple-950/20 ring-2 ring-purple-400/40"
													: "border-border/80 bg-card/30 hover:border-border"),
										)}
									>
										{/* ترويسة المرحلة مع أيقونة العلم واسم المرحلة وسهم الطي ومقبض السحب باليد */}
										{/* biome-ignore lint/a11y/noStaticElementInteractions: draggable stage header */}
										<div
											draggable
											onDragStart={(e) => {
												const target = e.target as HTMLElement;
												if (
													target.closest("button, input, textarea, a, [data-draggable-course]")
												) {
													return;
												}
												handleStageDragStart(e, stage.id);
											}}
											onDragEnd={handleStageDragEnd}
											className="flex items-center justify-between pb-2 border-b border-border/80 cursor-grab active:cursor-grabbing select-none"
										>
											<div className="flex items-center gap-2">
												{/* مقبض سحب المرحلة باليد لتغيير ترتيب المراحل */}
												{/* biome-ignore lint/a11y/noStaticElementInteractions: draggable stage handle */}
												<div
													draggable
													onDragStart={(e) => handleStageDragStart(e, stage.id)}
													onDragEnd={handleStageDragEnd}
													className="size-7 rounded-lg flex items-center justify-center text-muted-foreground/60 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors cursor-grab active:cursor-grabbing shrink-0"
													title="اسحب بيدك لتغيير ترتيب المرحلة بالمسار"
												>
													<IconGripVertical className="size-4" />
												</div>

												<button
													type="button"
													onClick={() => toggleEditorStage(stage.id)}
													className="size-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors cursor-pointer shrink-0"
													title={
														isEditorCollapsed ? "إظهار دورات المرحلة" : "طي دورات المرحلة"
													}
												>
													<IconChevronDown
														className={cn(
															"size-4 transition-transform duration-200",
															isEditorCollapsed && "-rotate-90",
														)}
													/>
												</button>
												<div className="size-7 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 shadow-2xs">
													<IconFlag className="size-4" />
												</div>

												{editingStageId === stage.id ? (
													<div className="flex items-center gap-1.5">
														<Input
															value={editingStageTitle}
															onChange={(e) => setEditingStageTitle(e.target.value)}
															placeholder="اسم المرحلة..."
															className="h-7 text-xs font-bold w-44"
															autoFocus
														/>
														<Button
															size="sm"
															className="h-7 px-2.5 text-xs bg-purple-600 text-white"
															onClick={() => handleSaveStageTitle(stage.id)}
														>
															حفظ
														</Button>
													</div>
												) : (
													<button
														type="button"
														className="flex items-center gap-2 group cursor-pointer bg-transparent border-none p-0 text-right"
														onClick={() => {
															setEditingStageId(stage.id);
															setEditingStageTitle(translateStageTitle(stage.title));
														}}
														title="انقر لتعديل اسم المرحلة"
													>
														<h3 className="text-sm font-bold text-foreground hover:text-purple-600 transition-colors">
															{translateStageTitle(stage.title)}
														</h3>
														<IconPencil className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
													</button>
												)}

												<Badge
													variant="secondary"
													className="text-[10px] font-normal"
												>
													{stage.items.length} دورات/مهام
												</Badge>
											</div>

											{/* خيارات المرحلة */}
											<div className="flex items-center gap-1.5">
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onClick={() => handleAddItem(stage.id, "COURSE")}
													className="h-7 px-2 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/40 gap-1 cursor-pointer"
												>
													<IconPlus className="size-3" />
													<span>إضافة دورة</span>
												</Button>

												<DropdownMenu dir="rtl">
													<DropdownMenuTrigger asChild>
														<Button
															variant="ghost"
															size="sm"
															className="size-7 p-0"
														>
															<IconDots className="size-3.5 text-muted-foreground" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent
														align="start"
														className="w-44 text-xs"
													>
														<DropdownMenuItem
															onClick={() => handleMoveStage(stage.id, "up")}
															disabled={stageIdx === 0}
															className="cursor-pointer gap-2"
														>
															<IconArrowUp className="size-3.5 text-muted-foreground" />
															<span>تحريك للأعلى</span>
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => handleMoveStage(stage.id, "down")}
															disabled={stageIdx === stages.length - 1}
															className="cursor-pointer gap-2"
														>
															<IconArrowDown className="size-3.5 text-muted-foreground" />
															<span>تحريك للأسفل</span>
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuItem
															onClick={() => {
																setEditingStageId(stage.id);
																setEditingStageTitle(stage.title);
															}}
															className="cursor-pointer gap-2"
														>
															<IconEdit className="size-3.5 text-muted-foreground" />
															<span>تعديل اسم المرحلة</span>
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => handleAddStage(stage.id)}
															className="cursor-pointer gap-2"
														>
															<IconPlus className="size-3.5 text-purple-600" />
															<span>إضافة مرحلة تالية</span>
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuItem
															onClick={() => handleDeleteStage(stage.id)}
															disabled={stages.length <= 1}
															className="cursor-pointer gap-2 text-destructive focus:text-destructive"
														>
															<IconTrash className="size-3.5" />
															<span>حذف هذه المرحلة</span>
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
										</div>

										{/* قائمة بطاقات الدورات والمحتويات في هذه المرحلة (أو شريط الطي) */}
										{isEditorCollapsed ? (
											<button
												type="button"
												onClick={() => toggleEditorStage(stage.id)}
												className="w-full text-right py-3 px-4 rounded-xl border border-dashed border-border bg-muted/20 hover:bg-muted/40 cursor-pointer flex items-center justify-between text-xs text-muted-foreground transition-colors"
											>
												<span>دورات المرحلة مطوية ({stage.items.length} مواد/دورات)</span>
												<span className="text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1">
													<IconChevronDown className="size-3.5 -rotate-90" />
												</span>
											</button>
										) : (
											<div className="flex flex-col relative">
												{stage.items.map((item, itemIdx) => {
													const colorStyle =
														COLOR_MAP[item.iconColor || "orange"] || COLOR_MAP.orange;
													const IconComp =
														item.type === "QUIZ"
															? IconHelpCircle
															: item.type === "PAGE"
																? IconFileText
																: IconBook;

													const isThisItemDragged = draggedItem?.itemId === item.id;
													const isDragOverThis =
														dragOverTarget?.stageId === stage.id &&
														dragOverTarget?.itemIndex === itemIdx &&
														!isThisItemDragged;

													return (
														<React.Fragment key={item.id}>
															{/* بطاقة الدورة / المحتوى مع إمكانية السحب والإفلات اليدوي */}
															{/* biome-ignore lint/a11y/noStaticElementInteractions: draggable item card */}
															{/* biome-ignore lint/a11y/useKeyWithClickEvents: draggable item card */}
															<div
																data-draggable-course="true"
																draggable
																onDragStart={(e) => {
																	e.stopPropagation();
																	const target = e.target as HTMLElement;
																	if (target.closest("button, input, textarea, a")) {
																		e.preventDefault();
																		return;
																	}
																	handleDragStart(e, item.id, stage.id);
																}}
																onDragEnd={handleDragEnd}
																onDragOver={(e) => handleItemDragOver(e, stage.id, itemIdx)}
																onDrop={(e) => handleDropOnStageOrItem(e, stage.id, itemIdx)}
																onClick={() => {
																	setSelectedPreviewItem(item);
																	setLeftPreviewTab("live");
																}}
																className={cn(
																	"group relative flex items-center gap-2.5 py-2 px-3 rounded-lg border bg-card shadow-2xs hover:shadow-xs transition-all cursor-pointer",
																	isThisItemDragged
																		? "opacity-35 scale-[0.98] border-dashed border-purple-500 bg-purple-50/60 dark:bg-purple-950/40"
																		: isDragOverThis
																			? "border-t-2 border-t-purple-600 border-border/80 bg-purple-50/25 dark:bg-purple-950/20"
																			: selectedPreviewItem?.id === item.id
																				? "border-purple-400 bg-purple-50/20 dark:bg-purple-950/20 ring-1 ring-purple-300 dark:ring-purple-800"
																				: "border-border/80 hover:border-purple-300 dark:hover:border-purple-800",
																)}
															>
																{/* مقبض السحب */}
																<div
																	className="text-muted-foreground/40 group-hover:text-purple-600 cursor-grab active:cursor-grabbing shrink-0 transition-colors"
																	title="اسحب بيدك لنقل الدورة بين المراحل أو تغيير ترتيبها"
																>
																	<IconGripVertical className="size-3.5" />
																</div>

																{/* صورة الغلاف الحقيقية للدورة أو أيقونة المحتوى */}
																{(() => {
																	const cover = resolveCover(item.coverKey);
																	if (cover?.type === "image") {
																		return (
																			<img
																				src={cover.url}
																				alt={item.title}
																				className="size-8 rounded-lg object-cover shrink-0 border border-border/60 shadow-2xs"
																			/>
																		);
																	}
																	if (cover?.type === "color") {
																		return (
																			<div
																				className="size-8 rounded-lg flex items-center justify-center font-bold text-white text-[10px] shrink-0 border border-white/20 shadow-2xs"
																				style={{ backgroundColor: cover.color }}
																			>
																				{item.title.trim().slice(0, 2)}
																			</div>
																		);
																	}
																	return (
																		<div
																			className={cn(
																				"size-8 rounded-lg flex items-center justify-center shrink-0 shadow-2xs",
																				colorStyle.bg,
																				colorStyle.text,
																			)}
																		>
																			<IconComp className="size-4" />
																		</div>
																	);
																})()}

																{/* تفاصيل المحتوى والوقت */}
																<div className="flex-1 min-w-0 space-y-0.5 text-right">
																	<div className="flex items-center justify-between gap-2 flex-wrap">
																		<div className="flex items-center gap-2 min-w-0">
																			<h4 className="text-xs font-bold text-foreground truncate max-w-[280px]">
																				{item.title}
																			</h4>
																			<Badge
																				variant="secondary"
																				className="text-[9px] font-medium px-1.5 py-0 rounded h-4"
																			>
																				{item.type === "COURSE"
																					? "دورة تدريبية"
																					: item.type === "QUIZ"
																						? "تقييم واختبار"
																						: item.id.startsWith("item-lib-")
																							? "مورد مكتبة"
																							: "صفحة ومستند"}
																			</Badge>
																			<button
																				type="button"
																				onClick={(e) => {
																					e.stopPropagation();
																					setEditingItem({ stageId: stage.id, item });
																				}}
																				title="انقر لتعديل مدة هذه الدورة في المسار"
																				className="flex items-center gap-1 text-[10px] text-purple-600 dark:text-purple-400 font-semibold bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
																			>
																				<IconClock className="size-2.5" />
																				<span>{item.durationText || "تحديد المدة"}</span>
																			</button>
																		</div>

																		{/* شارة النشر */}
																		<div className="flex items-center gap-1 shrink-0">
																			<span
																				className={cn(
																					"inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full border",
																					item.status === "PUBLISHED"
																						? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40"
																						: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40",
																				)}
																			>
																				<span
																					className={cn(
																						"size-1 rounded-full",
																						item.status === "PUBLISHED"
																							? "bg-emerald-500 animate-pulse"
																							: "bg-amber-500",
																					)}
																				/>
																				{item.status === "PUBLISHED" ? "منشور" : "مسودة"}
																			</span>
																		</div>
																	</div>

																	{/* تفاصيل الدروس والوصف */}
																	<div className="flex items-center gap-2 text-[10px] text-muted-foreground flex-wrap">
																		{item.chaptersCount && item.chaptersCount > 0 ? (
																			<span>{toArabicNumerals(item.chaptersCount)} فصول</span>
																		) : (
																			<span>{formatLessonsCount(item.lessonsCount)}</span>
																		)}
																		<span>•</span>
																		<span>
																			آخر تحديث: {item.updatedDate || "اليوم"}
																		</span>
																		{cleanCourseDescription(item.description) && (
																			<>
																				<span>•</span>
																				<span className="truncate max-w-sm text-muted-foreground/80 hidden sm:inline-block">
																					{cleanCourseDescription(item.description)}
																				</span>
																			</>
																		)}
																	</div>
																</div>

																{/* أزرار الإجراءات السريعة (تعديل و ...) */}
																<div className="flex items-center gap-1 shrink-0">
																	{/* <Button
																	type="button"
																	variant="outline"
																	size="sm"
																	onClick={(e) => {
																		e.stopPropagation();
																		setEditingItem({ stageId: stage.id, item });
																	}}
																	className="h-6 px-2 text-[11px] font-semibold gap-1 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300 dark:hover:bg-purple-950/40 cursor-pointer"
																>
																	<IconEdit className="size-2.5" />
																	<span>تعديل</span>
																</Button> */}

																	<DropdownMenu dir="rtl">
																		<DropdownMenuTrigger asChild>
																			<Button
																				variant="ghost"
																				size="sm"
																				onClick={(e) => e.stopPropagation()}
																				className="size-6 p-0"
																			>
																				<IconDots className="size-3 text-muted-foreground" />
																			</Button>
																		</DropdownMenuTrigger>
																		<DropdownMenuContent
																			align="start"
																			className="w-44 text-xs"
																		>
																			<DropdownMenuItem
																				onClick={() =>
																					setEditingItem({ stageId: stage.id, item })
																				}
																				className="cursor-pointer gap-2 font-medium text-purple-600 dark:text-purple-400"
																			>
																				<IconEdit className="size-3.5" />
																				<span>تعديل المدة والمحتوى</span>
																			</DropdownMenuItem>
																			<DropdownMenuSeparator />
																			<DropdownMenuItem
																				onClick={() => handleMoveItem(stage.id, item.id, "up")}
																				disabled={itemIdx === 0}
																				className="cursor-pointer gap-2"
																			>
																				<span>تحريك للأعلى</span>
																			</DropdownMenuItem>
																			<DropdownMenuItem
																				onClick={() =>
																					handleMoveItem(stage.id, item.id, "down")
																				}
																				disabled={itemIdx === stage.items.length - 1}
																				className="cursor-pointer gap-2"
																			>
																				<span>تحريك للأسفل</span>
																			</DropdownMenuItem>
																			{stages.length > 1 && (
																				<>
																					<DropdownMenuSeparator />
																					{stages
																						.filter((s) => s.id !== stage.id)
																						.map((targetStage) => (
																							<DropdownMenuItem
																								key={targetStage.id}
																								onClick={() =>
																									handleTransferItem(
																										stage.id,
																										targetStage.id,
																										item.id,
																									)
																								}
																								className="cursor-pointer gap-2"
																							>
																								<span>
																									نقل إلى:{" "}
																									{translateStageTitle(targetStage.title)}
																								</span>
																							</DropdownMenuItem>
																						))}
																				</>
																			)}
																			<DropdownMenuSeparator />
																			<DropdownMenuItem
																				onClick={() => handleDeleteItem(stage.id, item.id)}
																				className="cursor-pointer gap-2 text-destructive focus:text-destructive"
																			>
																				<IconTrash className="size-3.5" />
																				<span>حذف من المسار</span>
																			</DropdownMenuItem>
																		</DropdownMenuContent>
																	</DropdownMenu>
																</div>
															</div>
															{/* الخط الرابط مع زر الزائد (+) بمسافة واضحة وخط عمودي يربط بين الدورتين */}
															{itemIdx < stage.items.length - 1 && (
																<div className="relative flex justify-center items-center h-10 my-1.5">
																	{/* الخط العمودي الرابط الممتد من الدورة السابقة إلى الدورة التالية */}
																	<div className="absolute inset-y-0 w-[2px] bg-border dark:bg-border/80 rounded-full" />
																	<DropdownMenu dir="rtl">
																		<DropdownMenuTrigger asChild>
																			<button
																				type="button"
																				title="إضافة دورة أو عنصر أو مرحلة جديدة"
																				className="group relative z-10 size-6 rounded-full bg-background border border-border/90 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/60 flex items-center justify-center text-muted-foreground hover:text-purple-600 transition-all hover:scale-115 shadow-xs cursor-pointer"
																			>
																				<IconPlus className="size-3 text-muted-foreground group-hover:text-purple-600 transition-transform group-hover:rotate-90 stroke-[2.5]" />
																			</button>
																		</DropdownMenuTrigger>
																		<DropdownMenuContent
																			align="center"
																			className="w-52 text-xs p-1.5 rounded-xl shadow-xl border-border"
																		>
																			<DropdownMenuItem
																				onClick={() => handleAddStage(stage.id)}
																				className="cursor-pointer gap-2.5 py-1.5 font-medium text-purple-600 dark:text-purple-400 rounded-lg"
																			>
																				<IconFlag className="size-4" />
																				<span>مرحلة جديدة</span>
																			</DropdownMenuItem>
																			<DropdownMenuSeparator />
																			<DropdownMenuItem
																				onClick={() =>
																					handleAddItem(stage.id, "COURSE", item.id)
																				}
																				className="cursor-pointer gap-2.5 py-1.5 rounded-lg"
																			>
																				<IconBook className="size-4 text-sky-500" />
																				<span>دورة تدريبية (اختيار من الخطوة السابقة)</span>
																			</DropdownMenuItem>
																			<DropdownMenuItem
																				onClick={() =>
																					handleAddItem(stage.id, "QUIZ", item.id)
																				}
																				className="cursor-pointer gap-2.5 py-1.5 rounded-lg"
																			>
																				<IconHelpCircle className="size-4 text-yellow-500" />
																				<span>اختبار وتقييم (Checkpoint)</span>
																			</DropdownMenuItem>
																		</DropdownMenuContent>
																	</DropdownMenu>
																</div>
															)}
														</React.Fragment>
													);
												})}

												{/* زر إضافة سريع في نهاية المرحلة إذا كانت فارغة أو منطقة إفلات */}
												{stage.items.length === 0 && (
													// biome-ignore lint/a11y/noStaticElementInteractions: drag and drop empty stage dropzone
													<div
														onDragOver={(e) => handleStageDragOver(e, stage.id)}
														onDrop={(e) => handleDropOnStageOrItem(e, stage.id)}
														className={cn(
															"py-2.5 px-3 border border-dashed rounded-lg flex flex-col items-center justify-center gap-1 text-center transition-all",
															dragOverStageId === stage.id
																? "border-purple-500 bg-purple-100/60 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 scale-[1.01]"
																: "border-border text-muted-foreground",
														)}
													>
														<p className="text-[11px] font-medium">
															{dragOverStageId === stage.id
																? "أفلت الدورة هنا لنقلها إلى هذه المرحلة ✨"
																: "هذه المرحلة لا تحتوي على دورات بعد، اسحب أي دورة وأفلتها هنا."}
														</p>
														<Button
															size="sm"
															variant="outline"
															onClick={() => handleAddItem(stage.id, "COURSE")}
															className="h-5 text-[10px] font-semibold gap-1 text-purple-600 mt-0.5 px-2"
														>
															<IconPlus className="size-2.5" />
															<span>اختيار دورات من الخطوة السابقة</span>
														</Button>
													</div>
												)}
											</div>
										)}
									</div>

									{/* خط رابط عمودي أنيق مع زر إضافة بين المسارات بنفس خيارات الدورات */}
									{stageIdx < stages.length - 1 && (
										<div className="relative flex justify-center items-center h-14 my-2">
											{/* الخط العمودي الرابط الممتد بطول المسافة بين المرحلتين */}
											<div className="absolute inset-y-0 w-[2px] bg-border/90 dark:bg-border/80 rounded-full" />
											<DropdownMenu dir="rtl">
												<DropdownMenuTrigger asChild>
													<button
														type="button"
														title="إضافة مرحلة أو عنصر جديد بين المسارات"
														className="group relative z-10 size-7 rounded-full bg-card border-2 border-border/90 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/70 flex items-center justify-center text-muted-foreground hover:text-purple-600 transition-all hover:scale-115 shadow-xs hover:shadow-sm cursor-pointer"
													>
														<IconPlus className="size-3.5 text-muted-foreground group-hover:text-purple-600 transition-transform group-hover:rotate-90 stroke-[2.5]" />
													</button>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													align="center"
													className="w-56 text-xs p-1.5 rounded-xl shadow-xl border-border"
												>
													<DropdownMenuItem
														onClick={() => handleAddStage(stage.id)}
														className="cursor-pointer gap-2.5 py-1.5 font-medium text-purple-600 dark:text-purple-400 rounded-lg"
													>
														<IconFlag className="size-4" />
														<span>محور / مرحلة جديدة</span>
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														onClick={() => handleAddStageWithItem(stage.id, "COURSE")}
														className="cursor-pointer gap-2.5 py-1.5 rounded-lg"
													>
														<IconBook className="size-4 text-sky-500" />
														<span>دورة تدريبية (اختيار من الخطوة السابقة)</span>
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => handleAddStageWithItem(stage.id, "QUIZ")}
														className="cursor-pointer gap-2.5 py-1.5 rounded-lg"
													>
														<IconHelpCircle className="size-4 text-yellow-500" />
														<span>اختبار وتقييم (Checkpoint)</span>
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									)}
								</React.Fragment>
							);
						})}

						{/* زر إضافة مرحلة جديدة بالأسفل */}
						<div className="pt-2 flex justify-center">
							<Button
								type="button"
								variant="outline"
								onClick={() => handleAddStage()}
								className="h-8 px-3.5 text-xs font-bold gap-2 text-purple-600 border-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-lg cursor-pointer"
							>
								<IconPlus className="size-3.5" />
								<span>إضافة مرحلة جديدة للمسار</span>
							</Button>
						</div>

						{/* زر المعاينة العائم الدائري باللون الأصفر (مطابق تماماً لتصميم الموكاب الأصلي) */}
						{/* <div className="sticky bottom-3 flex justify-center z-20 pointer-events-none mt-3">
							<button
								type="button"
								onClick={() => {
									const first = stages.flatMap((s) => s.items)[0];
									if (first) setSelectedPreviewItem(first);
									setLeftPreviewTab("live");
									toast.info("تم تفعيل المعاينة الحية للمسار التدريبي", {
										description: "يمكنك استعراض تفاصيل الدورة المختارة في لوحة المعاينة.",
									});
								}}
								title="معاينة وتشغيل المسار"
								className="pointer-events-auto size-11 rounded-full bg-amber-400 hover:bg-amber-500 text-slate-900 shadow-lg hover:shadow-xl flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95"
							>
								<IconPlayerPlayFilled className="size-5 text-slate-900 ml-0.5" />
							</button>
						</div> */}
					</div>
				</div>

				{/* 2. الجانب الأيسر: لوحة المعاينة التفاعلية المباشرة للمسار التدريبي (حجم مكبر ومريح للعين يطابق التصميم الأصلي) */}
				<div className="w-full lg:w-[460px] xl:w-[520px] 2xl:w-[580px] shrink-0 bg-card flex flex-col min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4 border-l border-border">
					{/* ترويسة لوحة المعاينة مع خيارات العرض (الخارطة أو المعاينة الحية) */}
					<div className="flex items-center justify-between pb-2.5 border-b border-border">
						<div className="flex items-center gap-2">
							<IconEye className="size-4 text-purple-600" />
							<h4 className="text-xs font-bold text-foreground">معاينة المسار التدريبي</h4>
						</div>

						{/* مبدّل العرض التفاعلي بين خارطة المسار والمعاينة الحية للمحتوى */}
						<div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border/60">
							<button
								type="button"
								onClick={() => setLeftPreviewTab("roadmap")}
								className={cn(
									"px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer flex items-center gap-1",
									leftPreviewTab === "roadmap"
										? "bg-background text-purple-600 shadow-2xs"
										: "text-muted-foreground hover:text-foreground",
								)}
							>
								<IconRoute className="size-3" />
								<span>خارطة المسار</span>
							</button>
							<button
								type="button"
								onClick={() => setLeftPreviewTab("live")}
								className={cn(
									"px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer flex items-center gap-1",
									leftPreviewTab === "live"
										? "bg-background text-purple-600 shadow-2xs"
										: "text-muted-foreground hover:text-foreground",
								)}
							>
								<IconEye className="size-3" />
								<span>معاينة المحتوى</span>
							</button>
						</div>
					</div>

					{/* 1. تبويب المعاينة الحية للمحتوى المختار (مطابق لنموذج التصميم المرفق عند عدم وجود اختيار) */}
					{leftPreviewTab === "live" && (
						<div className="flex-1 flex flex-col min-h-0">
							{selectedPreviewItem ? (
								<div className="p-4 rounded-xl border border-border bg-card space-y-4 animate-in fade-in-50 duration-200">
									{/* غلاف وبانر المعاينة */}
									<div className="relative h-40 rounded-lg overflow-hidden bg-gradient-to-br from-purple-700 via-indigo-800 to-purple-950 flex flex-col justify-between p-3.5 text-white shadow-inner">
										<div className="flex items-center justify-between">
											<Badge className="bg-black/50 backdrop-blur-xs text-[10px] text-white border-none">
												{selectedPreviewItem.type === "COURSE"
													? "دورة تدريبية"
													: selectedPreviewItem.type === "PAGE"
														? "صفحة ومستند"
														: "اختبار وتقييم"}
											</Badge>
											<span className="flex items-center gap-1 text-[10px] font-semibold bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full">
												<IconClock className="size-3" />
												<span>{selectedPreviewItem.durationText}</span>
											</span>
										</div>

										<div className="flex items-center justify-center">
											<div className="size-12 rounded-full bg-white/20 backdrop-blur-xs hover:bg-white/30 flex items-center justify-center transition-transform hover:scale-110 shadow-lg">
												<IconPlayerPlayFilled className="size-6 text-white ml-0.5" />
											</div>
										</div>

										<div className="flex items-center justify-between text-[11px] opacity-90">
											<span>
												{selectedPreviewItem.chaptersCount && selectedPreviewItem.chaptersCount > 0
													? `${toArabicNumerals(selectedPreviewItem.chaptersCount)} فصول كاملة`
													: `${formatLessonsCount(selectedPreviewItem.lessonsCount)} تفاعلية`}
											</span>
											<span>معاينة حية للمتدرب</span>
										</div>
									</div>

									{/* تفاصيل المادة */}
									<div className="space-y-2">
										<div className="flex items-center justify-between gap-2">
											<h3 className="text-sm font-bold text-foreground">
												{selectedPreviewItem.title}
											</h3>
											<span
												className={cn(
													"inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full border",
													selectedPreviewItem.status === "PUBLISHED"
														? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40"
														: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40",
												)}
											>
												<span
													className={cn(
														"size-1 rounded-full",
														selectedPreviewItem.status === "PUBLISHED"
															? "bg-emerald-500 animate-pulse"
															: "bg-amber-500",
													)}
												/>
												{selectedPreviewItem.status === "PUBLISHED" ? "منشور" : "مسودة"}
											</span>
										</div>

										<p className="text-xs text-muted-foreground leading-relaxed">
											{cleanCourseDescription(selectedPreviewItem.description)}
										</p>
									</div>

									{/* زر العودة لخارطة المسار */}
									<div className="pt-2 border-t border-border flex items-center justify-between">
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={() => setSelectedPreviewItem(null)}
											className="text-xs text-muted-foreground hover:text-foreground h-7"
										>
											إلغاء التحديد
										</Button>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => setLeftPreviewTab("roadmap")}
											className="text-xs text-purple-600 border-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950/40 h-7 gap-1"
										>
											<IconRoute className="size-3" />
											<span>عرض خارطة المسار</span>
										</Button>
									</div>
								</div>
							) : (
								/* الحالة الفارغة المطابقة تماماً لتصميم الموكاب المرفق في الصورة 1 */
								<div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3 min-h-[360px] my-auto">
									<div className="size-16 rounded-full bg-muted/60 dark:bg-muted/30 flex items-center justify-center text-muted-foreground/70 shadow-2xs">
										<IconEye className="size-8 stroke-[1.5]" />
									</div>
									<h4 className="text-base font-bold text-foreground">
										لا يوجد محتوى للمعاينة حتى الآن
									</h4>
									<p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
										بعد إضافة أول وحدة أو درس، ستظهر هنا معاينة مباشرة لطريقة عرض الدورة
										للموظفين قبل نشرها.
									</p>
									{stages.some((s) => s.items.length > 0) && (
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => {
												const firstItem = stages.flatMap((s) => s.items)[0];
												if (firstItem) setSelectedPreviewItem(firstItem);
											}}
											className="text-xs text-purple-600 border-purple-200 mt-2 gap-1.5"
										>
											<IconEye className="size-3.5" />
											<span>معاينة أول محتوى في المسار</span>
										</Button>
									)}
								</div>
							)}
						</div>
					)}

					{/* 2. تبويب خارطة مسار التعلم للمتدرب (مطابق تماماً لمتطلبات الصورة 2 باللغة العربية الكاملة) */}
					{leftPreviewTab === "roadmap" && (
						<div className="space-y-4">
							{/* بطاقة ملخص المسار */}
							<div className="p-3.5 rounded-xl border border-border bg-muted/30 space-y-2">
								<div className="flex items-center justify-between">
									<span className="text-[10px] font-mono text-muted-foreground">
										#{trackCode || "مسار"}
									</span>
									{trackStage && (
										<Badge className="text-[10px] bg-purple-600 text-white">
											{trackStage}
										</Badge>
									)}
								</div>

								<h3 className="text-sm font-bold text-foreground">{trackName}</h3>
								{trackCategory && (
									<span className="text-xs text-muted-foreground block">
										التصنيف: {trackCategory}
									</span>
								)}

								{/* إحصائيات سريعة */}
								<div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/80">
									<div className="bg-background p-2 rounded-lg border border-border/60 text-center">
										<span className="text-[10px] text-muted-foreground block">
											المدة الإجمالية
										</span>
										<span className="text-xs font-bold text-purple-600">
											{totalEstimatedDuration}
										</span>
									</div>
									<div className="bg-background p-2 rounded-lg border border-border/60 text-center">
										<span className="text-[10px] text-muted-foreground block">
											إجمالي المحتوى
										</span>
										<span className="text-xs font-bold text-foreground">
											{totalItemsCount} مواد
										</span>
									</div>
								</div>
							</div>

							{/* مسار المراحل التفاعلي كما سيراه المتدرب مع سهم الفتح والإغلاق لكل مرحلة */}
							<div className="space-y-3 pt-1">
								<div className="flex items-center justify-between">
									<h5 className="text-[11px] font-bold text-muted-foreground">
										خارطة مسار التعلم للمتدرب:
									</h5>
									{stages.length > 0 && (
										<button
											type="button"
											onClick={toggleAllRoadmapStages}
											className="text-[10px] text-purple-600 hover:text-purple-700 dark:text-purple-400 font-semibold cursor-pointer hover:underline"
										>
											{stages.every((st) => expandedRoadmapStages[st.id])
												? "طي الكل"
												: "توسيع الكل"}
										</button>
									)}
								</div>

								<div className="space-y-3 relative">
									{stages.map((st, idx) => {
										const isExpanded = Boolean(expandedRoadmapStages[st.id]);

										return (
											<div
												key={st.id}
												className="relative space-y-1.5"
											>
												{/* خط تتابعي عمودي بين دوائر المراحل يربط مراحل الخارطة */}
												{idx < stages.length - 1 && (
													<div className="absolute right-4.5 top-8 bottom-0 w-0.5 bg-purple-200 dark:bg-purple-800/60 -z-1" />
												)}

												{/* بطاقة المرحلة في الخارطة مع سهم على الشمال لفتح وإظهار الدورات (حجم مدمج ومعرب بالكامل) */}
												<button
													type="button"
													className={cn(
														"group relative w-full flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer select-none text-right",
														isExpanded
															? "bg-purple-50/70 dark:bg-purple-950/30 border-purple-300 dark:border-purple-800 shadow-2xs"
															: "bg-muted/30 hover:bg-muted/60 border-border/70",
													)}
													onClick={() => toggleRoadmapStage(st.id)}
												>
													{/* الجانب الأيمن: الترقيم واسم المرحلة المعرب وتفاصيلها */}
													<div className="flex items-center gap-2 min-w-0">
														<span
															className={cn(
																"size-5 rounded-full text-white text-[9px] font-bold flex items-center justify-center shrink-0 shadow-2xs transition-colors",
																isExpanded
																	? "bg-purple-600 ring-1 ring-purple-300 dark:ring-purple-900"
																	: "bg-purple-500/80",
															)}
														>
															{idx + 1}
														</span>
														<div className="min-w-0">
															<span className="text-xs font-bold text-foreground block truncate">
																{translateStageTitle(st.title)}
															</span>
															<span className="text-[9.5px] text-muted-foreground block">
																{st.items.length}{" "}
																{st.items.length === 1 ? "دورة/مادة" : "دورات ومواد"} •{" "}
																{priorityPath === "SEQUENTIAL" ? "تتابعي" : "مرن"}
															</span>
														</div>
													</div>

													{/* الجانب الأيسر: سهم على الشمال كدا للفتح والإغلاق */}
													<div className="flex items-center gap-1.5 shrink-0">
														<Badge
															variant="outline"
															className="text-[9px] h-4 px-1 font-normal bg-background/80"
														>
															{st.items.length}
														</Badge>
														<div
															className={cn(
																"size-6 rounded-md flex items-center justify-center transition-all",
																isExpanded
																	? "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300 rotate-180"
																	: "text-muted-foreground group-hover:bg-muted group-hover:text-foreground",
															)}
															title={isExpanded ? "طي دورات المرحلة" : "إظهار دورات المرحلة"}
														>
															<IconChevronDown className="size-3.5 transition-transform duration-200" />
														</div>
													</div>
												</button>

												{/* قائمة الدورات والمواد عند نزول السهم / التوسيع */}
												{isExpanded && (
													<div className="mr-2 pr-2.5 my-1.5 border-r-2 border-purple-200 dark:border-purple-800 space-y-1.5 animate-in fade-in-50 duration-200">
														{st.items.length === 0 ? (
															<div className="py-2 px-2.5 rounded-md bg-muted/40 border border-dashed border-border text-center">
																<p className="text-[10px] text-muted-foreground">
																	لا توجد دورات مضافة في هذه المرحلة حتى الآن
																</p>
															</div>
														) : (
															st.items.map((it) => {
																const itemColor =
																	COLOR_MAP[it.iconColor || "orange"] || COLOR_MAP.orange;
																const ItemIconComp =
																	it.type === "COURSE"
																		? IconBook
																		: it.type === "PAGE"
																			? IconFileText
																			: IconHelpCircle;

																return (
																	// biome-ignore lint/a11y/noStaticElementInteractions: clickable preview item
																	// biome-ignore lint/a11y/useKeyWithClickEvents: clickable preview item
																	<div
																		key={it.id}
																		onClick={() => {
																			setSelectedPreviewItem(it);
																			setLeftPreviewTab("live");
																		}}
																		className="group/item flex items-center justify-between gap-2 p-1.5 px-2 rounded-md bg-background hover:bg-muted/50 border border-border shadow-2xs transition-colors cursor-pointer"
																	>
																		<div className="flex items-center gap-2 min-w-0">
																			<div
																				className={cn(
																					"size-6 rounded-md flex items-center justify-center shrink-0 shadow-2xs",
																					itemColor.bg,
																					itemColor.text,
																				)}
																			>
																				<ItemIconComp className="size-3" />
																			</div>
																			<div className="min-w-0">
																				<span className="text-[11px] font-semibold text-foreground block truncate">
																					{translateSampleTitle(it.title)}
																				</span>
																				<div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
																					<span>
																						{it.type === "COURSE"
																							? "دورة"
																							: it.type === "PAGE"
																								? "صفحة"
																								: "اختبار"}
																					</span>
																					{it.durationText && (
																						<>
																							<span>•</span>
																							<span className="text-purple-600 dark:text-purple-400 font-medium">
																								{it.durationText}
																							</span>
																						</>
																					)}
																				</div>
																			</div>
																		</div>

																		<div className="flex items-center gap-1 shrink-0">
																			<span
																				className={cn(
																					"size-1.5 rounded-full",
																					it.status === "PUBLISHED"
																						? "bg-emerald-500"
																						: "bg-amber-500",
																				)}
																				title={it.status === "PUBLISHED" ? "منشور" : "مسودة"}
																			/>
																		</div>
																	</div>
																);
															})
														)}
													</div>
												)}
											</div>
										);
									})}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* 3. الشريط السفلي للأزرار والإجراءات */}
			<div className="flex items-center justify-between border-t border-border px-6 py-3.5 bg-background shrink-0">
				{/* الطرف الأيمن: زر الرجوع للخطوة السابقة */}
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={onBackToCourses}
					disabled={isSubmitting}
					className="h-9 px-4 text-xs font-semibold gap-2 hover:bg-muted cursor-pointer"
				>
					<IconArrowRight className="size-4" />
					<span>رجوع لاختيار الدورات</span>
				</Button>

				{/* الطرف الأيسر: الإلغاء، حفظ كمسودة، ونشر المسار */}
				<div className="flex items-center gap-2.5">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={onClose}
						disabled={isSubmitting}
						className="h-9 px-4 text-xs font-semibold"
					>
						إلغاء
					</Button>

					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => handleFinalPublish("DRAFT")}
						disabled={isSubmitting}
						className="h-9 px-4 text-xs font-semibold text-muted-foreground hover:text-foreground"
					>
						حفظ كمسودة
					</Button>

					<Button
						type="button"
						onClick={() => handleFinalPublish("ACTIVE")}
						disabled={isSubmitting}
						className="h-9 px-6 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-xs gap-1.5 cursor-pointer"
					>
						{isSubmitting ? (
							<>
								<Spinner className="size-3.5" />
								<span>جارٍ النشر...</span>
							</>
						) : (
							<span>{isEdit ? "حفظ وتحديث المسار" : "نشر المسار التدريبي"}</span>
						)}
					</Button>
				</div>
			</div>

			{/* 4. نافذة منبثقة لتعديل تفاصيل ووقت الدورة المحددة */}
			{editingItem && (
				<ItemEditDialog
					item={editingItem.item}
					open={Boolean(editingItem)}
					onClose={() => setEditingItem(null)}
					onSave={handleSaveItemEdit}
				/>
			)}
		</div>
	);
}

// مكوّن النافذة المنبثقة لتعديل وقت ومحتوى الدورة
function ItemEditDialog({
	item,
	open,
	onClose,
	onSave,
}: {
	item: TrackStageItem;
	open: boolean;
	onClose: () => void;
	onSave: (updated: TrackStageItem) => void;
}) {
	const [title, setTitle] = useState(item.title);
	const [type, setType] = useState<TrackItemType>(item.type);
	const [durationText, setDurationText] = useState(item.durationText);
	const [description, setDescription] = useState(item.description || "");
	const [status, setStatus] = useState<"PUBLISHED" | "DRAFT">(
		item.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
	);
	const [iconColor, setIconColor] = useState(item.iconColor || "orange");

	const handleSave = () => {
		if (!title.trim()) {
			toast.error("يرجى إدخال عنوان الدورة / المحتوى");
			return;
		}
		onSave({
			...item,
			title: title.trim(),
			type,
			durationText: durationText.trim() || "تحديد المدة",
			description: description.trim(),
			status,
			iconColor,
		});
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(v) => !v && onClose()}
		>
			<DialogContent
				className="sm:max-w-md"
				dir="rtl"
			>
				<DialogHeader>
					<DialogTitle className="text-sm font-bold text-foreground">
						تعديل محتوى ووقت الدورة في المسار
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-4 py-2 text-right">
					{/* العنوان */}
					<div className="space-y-1.5">
						<Label className="text-xs font-semibold">عنوان الدورة أو المادة</Label>
						<Input
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="h-9 text-xs"
							placeholder="عنوان المحتوى..."
						/>
					</div>

					{/* نوع المحتوى */}
					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-1.5">
							<Label className="text-xs font-semibold">نوع المحتوى</Label>
							<Select
								value={type}
								onValueChange={(v) => setType(v as TrackItemType)}
							>
								<SelectTrigger className="h-9 text-xs">
									<SelectValue />
								</SelectTrigger>
								<SelectContent align="end">
									<SelectItem
										value="COURSE"
										className="text-xs"
									>
										دورة تدريبية
									</SelectItem>
									<SelectItem
										value="PAGE"
										className="text-xs"
									>
										صفحة ومستند تعليمي
									</SelectItem>
									<SelectItem
										value="QUIZ"
										className="text-xs"
									>
										تقييم واختبار
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* الوقت المقدر للدورة في المسار */}
						<div className="space-y-1.5">
							<Label className="text-xs font-semibold">الوقت المخصص للدورة</Label>
							<Input
								value={durationText}
								onChange={(e) => setDurationText(e.target.value)}
								className="h-9 text-xs font-medium"
								placeholder="مثال: أسبوعان، 10 ساعات..."
							/>
						</div>
					</div>

					{/* خيارات سريعة للوقت */}
					<div className="flex items-center gap-1.5 flex-wrap">
						<span className="text-[10px] text-muted-foreground">اقتراحات:</span>
						{["أسبوع واحد", "أسبوعان", "3 أسابيع", "شهر", "10 ساعات", "20 ساعة"].map((d) => (
							<button
								key={d}
								type="button"
								onClick={() => setDurationText(d)}
								className="text-[10px] bg-muted/60 hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-950 px-2 py-0.5 rounded cursor-pointer transition-colors"
							>
								{d}
							</button>
						))}
					</div>

					{/* الوصف */}
					<div className="space-y-1.5">
						<Label className="text-xs font-semibold">وصف المحتوى والأهداف</Label>
						<Textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							rows={3}
							className="text-xs"
							placeholder="اكتب نبذة مختصرة عن ما سيتعلمه المتدرب في هذا الجزء..."
						/>
					</div>

					{/* لون الأيقونة والحالة */}
					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-1.5">
							<Label className="text-xs font-semibold">لون الأيقونة</Label>
							<div className="flex items-center gap-2 pt-1">
								{COLOR_KEYS.map((ck) => (
									<button
										key={ck}
										type="button"
										onClick={() => setIconColor(ck)}
										className={cn(
											"size-6 rounded-full border-2 transition-all cursor-pointer",
											COLOR_MAP[ck].bg,
											iconColor === ck
												? "ring-2 ring-purple-600 scale-110 border-white"
												: "border-transparent",
										)}
									/>
								))}
							</div>
						</div>

						<div className="space-y-1.5">
							<Label className="text-xs font-semibold">حالة النشر</Label>
							<Select
								value={status}
								onValueChange={(v) => setStatus(v as "PUBLISHED" | "DRAFT")}
							>
								<SelectTrigger className="h-9 text-xs">
									<SelectValue />
								</SelectTrigger>
								<SelectContent align="end">
									<SelectItem
										value="PUBLISHED"
										className="text-xs text-emerald-600 font-semibold"
									>
										منشور
									</SelectItem>
									<SelectItem
										value="DRAFT"
										className="text-xs text-muted-foreground"
									>
										مسودة
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>

				<DialogFooter className="gap-2 sm:gap-0 pt-2">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={onClose}
					>
						إلغاء
					</Button>
					<Button
						type="button"
						size="sm"
						onClick={handleSave}
						className="bg-purple-600 hover:bg-purple-700 text-white"
					>
						حفظ التعديلات
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
