import {
	IconCheck,
	IconFileText,
	IconMapPin,
	IconPlus,
	IconRoute,
	IconSchool,
	IconX,
} from "@tabler/icons-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { type FilterGroup, FiltersMenu } from "@/components/common/filters-menu";
import { Spinner } from "@/components/common/spinner";
import { Stats } from "@/components/common/stats";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Button } from "@/components/ui/button";
import { useAcademicStageOptions } from "@/features/services/classrooms/hooks/use-classrooms";
import { useAcademicStages } from "@/features/settings/academic-stages/hooks/use-academic-stages";
import { useTrackClassifications } from "@/features/settings/tracks/hooks/use-track-classifications";
import {
	type TrainingPage,
	type TrainingPagePayload,
	useTrainingPages,
} from "../hooks/use-training-pages";
import { ContentLoadError } from "./content-load-error";
import { DeletePageDialog } from "./delete-page-dialog";
import { PageCard } from "./page-card";
import {
	cleanPageSummary,
	DEFAULT_ACADEMIC_STAGES,
	DEFAULT_CLASSIFICATIONS,
	extractSystemTag,
	PageDialog,
} from "./page-dialog";
import { PagePreviewDialog } from "./page-preview-dialog";
import { PagesTable } from "./pages-table";
import { type CoursesView, ViewOptionsMenu } from "./view-options-menu";

export interface PageItem {
	id: string;
	title: string;
	summary: string;
	content?: string;
	readingTimeMinutes: number;
	category: string;
	author: string;
	status: "PUBLISHED" | "DRAFT";
	updatedAt: string;
	viewsCount: number;
}

// صفحات نموذجية لضمان التوافق مع أي شاشات قديمة
export const INITIAL_PAGES: PageItem[] = [
	{
		id: "page-1",
		title: "المقدمة والتعليمات العامة للمسار التدريبي",
		summary: "دليل توجيهي شامل للمتدربين.",
		readingTimeMinutes: 5,
		category: "عام وتوجيهي",
		author: "الإدارة الأكاديمية",
		status: "PUBLISHED",
		updatedAt: "2026-11-01",
		viewsCount: 320,
	},
	{
		id: "page-2",
		title: "دليل أفضل الممارسات ومنهجية العمل الإكلينيكي",
		summary: "معايير الجودة والممارسات السريرية.",
		readingTimeMinutes: 10,
		category: "طبي وتأهيلي",
		author: "د. هدى السعيد",
		status: "PUBLISHED",
		updatedAt: "2026-10-28",
		viewsCount: 185,
	},
	{
		id: "page-3",
		title: "ميثاق السلوك المهني ومعايير التقييم والاعتماد",
		summary: "أخلاقيات المهنة وآليات التقييم.",
		readingTimeMinutes: 8,
		category: "إداري وتنظيمي",
		author: "قسم الجودة والاعتماد",
		status: "PUBLISHED",
		updatedAt: "2026-10-20",
		viewsCount: 140,
	},
	{
		id: "page-4",
		title: "الملخص التنفيذي وخارطة المهارات المكتسبة",
		summary: "المخرجات التعليمية والمهارات التطبيقية.",
		readingTimeMinutes: 7,
		category: "تربوي وأكاديمي",
		author: "فريق الإشراف التربوي",
		status: "DRAFT",
		updatedAt: "2026-10-15",
		viewsCount: 95,
	},
];

export function PagesView() {
	const {
		pages,
		isLoading,
		isError: pagesLoadError,
		error: pagesError,
		refetch,
		createPage,
		updatePage,
		duplicatePage,
		publishPage,
		unpublishPage,
		deletePage,
	} = useTrainingPages();

	const [search, setSearch] = useState("");
	const [view, setView] = useState<CoursesView>("list");
	const [oldestFirst, setOldestFirst] = useState(false);

	// فلاتر التصفية المتعددة
	const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
	const [selectedAcademicStages, setSelectedAcademicStages] = useState<string[]>([]);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

	// المراحل والتصنيفات من الـ hooks
	const { stages: apiStages } = useAcademicStages();
	const { academicStages: optionsStages } = useAcademicStageOptions();
	const { trackClassifications } = useTrackClassifications();

	// استخراج خيارات المراحل الدراسية المتاحة
	const availableStages = useMemo(() => {
		const set = new Set<string>();
		for (const s of DEFAULT_ACADEMIC_STAGES) {
			set.add(s);
		}
		if (Array.isArray(optionsStages)) {
			for (const s of optionsStages) {
				if (typeof s === "string" && s.trim()) set.add(s.trim());
			}
		}
		if (Array.isArray(apiStages)) {
			for (const s of apiStages) {
				if (s?.isActive && typeof s?.name === "string" && s.name.trim()) {
					set.add(s.name.trim());
				}
			}
		}
		for (const p of pages) {
			const st =
				(p as { academicStage?: string }).academicStage ||
				extractSystemTag(p.summary, "stage") ||
				extractSystemTag(p.summary, "المرحلة");
			if (st?.trim() && st !== "بدون مرحلة دراسية" && st !== "بدون مرحلة") {
				set.add(st.trim());
			}
		}
		return Array.from(set);
	}, [apiStages, optionsStages, pages]);

	// استخراج خيارات التصنيفات المتاحة
	const availableCategories = useMemo(() => {
		const set = new Set<string>();
		for (const c of DEFAULT_CLASSIFICATIONS) {
			set.add(c);
		}
		if (Array.isArray(trackClassifications)) {
			for (const tc of trackClassifications) {
				if (tc?.name?.trim()) set.add(tc.name.trim());
			}
		}
		for (const p of pages) {
			if (p.category?.trim()) set.add(p.category.trim());
		}
		return Array.from(set);
	}, [trackClassifications, pages]);

	// مجموعات الفلاتر لقائمة التصفية الموحدة
	const filterGroups: FilterGroup[] = useMemo(
		() => [
			{
				key: "status",
				label: "الحالة",
				Icon: IconCheck,
				options: [
					{ value: "PUBLISHED", label: "منشورة" },
					{ value: "DRAFT", label: "مسودة" },
				],
				selected: selectedStatuses,
				onToggle: (v) =>
					setSelectedStatuses((prev) =>
						prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
					),
			},
			{
				key: "academicStage",
				label: "المرحلة الدراسية",
				Icon: IconSchool,
				options: availableStages.map((st) => ({ value: st, label: st })),
				selected: selectedAcademicStages,
				onToggle: (v) =>
					setSelectedAcademicStages((prev) =>
						prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
					),
			},
			{
				key: "category",
				label: "التصنيف",
				Icon: IconRoute,
				options: availableCategories.map((c) => ({ value: c, label: c })),
				selected: selectedCategories,
				onToggle: (v) =>
					setSelectedCategories((prev) =>
						prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
					),
			},
			{
				key: "location",
				label: "مكان التعلم",
				Icon: IconMapPin,
				options: [
					{ value: "ONLINE", label: "أونلاين" },
					{ value: "IN_PERSON", label: "حضوري" },
					{ value: "HYBRID", label: "مدمج" },
				],
				selected: selectedLocations,
				onToggle: (v) =>
					setSelectedLocations((prev) =>
						prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
					),
			},
		],
		[
			selectedStatuses,
			availableStages,
			selectedAcademicStages,
			availableCategories,
			selectedCategories,
			selectedLocations,
		],
	);

	const clearAllFilters = useCallback(() => {
		setSelectedStatuses([]);
		setSelectedAcademicStages([]);
		setSelectedCategories([]);
		setSelectedLocations([]);
	}, []);

	// الشرائح النشطة للفلاتر المختارة
	const activeFilters = useMemo(() => {
		const list: { key: string; label: string; value: string; onRemove: () => void }[] = [];
		for (const s of selectedStatuses) {
			list.push({
				key: `status-${s}`,
				label: "الحالة",
				value: s === "PUBLISHED" ? "منشورة" : "مسودة",
				onRemove: () => setSelectedStatuses((prev) => prev.filter((x) => x !== s)),
			});
		}
		for (const st of selectedAcademicStages) {
			list.push({
				key: `stage-${st}`,
				label: "المرحلة",
				value: st,
				onRemove: () => setSelectedAcademicStages((prev) => prev.filter((x) => x !== st)),
			});
		}
		for (const c of selectedCategories) {
			list.push({
				key: `cat-${c}`,
				label: "التصنيف",
				value: c,
				onRemove: () => setSelectedCategories((prev) => prev.filter((x) => x !== c)),
			});
		}
		for (const loc of selectedLocations) {
			list.push({
				key: `loc-${loc}`,
				label: "المكان",
				value: loc === "ONLINE" ? "أونلاين" : loc === "IN_PERSON" ? "حضوري" : "مدمج",
				onRemove: () => setSelectedLocations((prev) => prev.filter((x) => x !== loc)),
			});
		}
		return list;
	}, [selectedStatuses, selectedAcademicStages, selectedCategories, selectedLocations]);

	// نوافذ الحوار
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingPage, setEditingPage] = useState<TrainingPage | null>(null);
	const [previewingPage, setPreviewingPage] = useState<TrainingPage | null>(null);
	const [deletingPage, setDeletingPage] = useState<TrainingPage | null>(null);

	// إحصائيات الصفحات
	const statsData = useMemo(() => {
		const total = pages.length;
		const published = pages.filter((p) => p.status === "PUBLISHED").length;
		const drafts = pages.filter((p) => p.status === "DRAFT").length;
		return [
			{ title: "إجمالي الصفحات", value: total, tooltip: "العدد الكلي للصفحات التدريبية" },
			{ title: "صفحات منشورة", value: published, tooltip: "الصفحات المتاحة للمتدربين" },
			{ title: "مسودّات", value: drafts, tooltip: "الصفحات قيد الإعداد والمراجعة" },
		];
	}, [pages]);

	// تصفية وبحث الصفحات
	const filteredPages = useMemo(() => {
		const q = search.trim().toLowerCase();
		const list = pages.filter((p) => {
			// فلتر الحالة
			if (selectedStatuses.length > 0 && !selectedStatuses.includes(p.status)) {
				return false;
			}
			// فلتر التصنيف
			if (
				selectedCategories.length > 0 &&
				(!p.category || !selectedCategories.includes(p.category))
			) {
				return false;
			}
			// فلتر المرحلة الدراسية
			if (selectedAcademicStages.length > 0) {
				const pageStage =
					(p as { academicStage?: string }).academicStage ||
					extractSystemTag(p.summary, "stage") ||
					extractSystemTag(p.summary, "المرحلة");
				if (!pageStage || !selectedAcademicStages.includes(pageStage)) {
					return false;
				}
			}
			// فلتر مكان التعلم
			if (selectedLocations.length > 0) {
				const pageLocation = extractSystemTag(p.summary, "location");
				if (!pageLocation || !selectedLocations.includes(pageLocation)) {
					return false;
				}
			}
			// البحث النصي
			if (q) {
				const titleMatch = (p.title || "").toLowerCase().includes(q);
				const categoryMatch = (p.category || "").toLowerCase().includes(q);
				const summaryMatch = cleanPageSummary(p.summary).toLowerCase().includes(q);
				const pageStage =
					(p as { academicStage?: string }).academicStage ||
					extractSystemTag(p.summary, "stage") ||
					extractSystemTag(p.summary, "المرحلة");
				const stageMatch = pageStage ? pageStage.toLowerCase().includes(q) : false;
				if (!titleMatch && !categoryMatch && !summaryMatch && !stageMatch) {
					return false;
				}
			}
			return true;
		});
		return oldestFirst ? [...list].reverse() : list;
	}, [
		pages,
		search,
		selectedStatuses,
		selectedCategories,
		selectedAcademicStages,
		selectedLocations,
		oldestFirst,
	]);

	// فتح إنشاء صفحة جديدة
	const handleCreateNew = () => {
		setEditingPage(null);
		setDialogOpen(true);
	};

	// فتح تعديل صفحة
	const handleEditPage = (page: TrainingPage) => {
		setEditingPage(page);
		setDialogOpen(true);
	};

	// حفظ صفحة (إنشاء أو تعديل)
	const handleSavePage = async (payload: TrainingPagePayload) => {
		if (editingPage) {
			return await updatePage(editingPage.id, payload);
		}
		return await createPage(payload);
	};

	// تبديل حالة النشر
	const handlePublishToggle = async (page: TrainingPage) => {
		if (page.status === "PUBLISHED") {
			await unpublishPage(page.id);
		} else {
			await publishPage(page.id);
		}
	};

	// تغيير حالة الصفحة مباشرة من القائمة المنسدلة في الجدول
	const handleStatusChange = async (
		page: TrainingPage,
		newStatus: "PUBLISHED" | "DRAFT" | "ARCHIVED",
	) => {
		try {
			await updatePage(page.id, { status: newStatus });
			toast.success(
				newStatus === "PUBLISHED"
					? "تم نشر الصفحة بنجاح"
					: newStatus === "ARCHIVED"
						? "تمت أرشفة الصفحة بنجاح"
						: "تم تحويل الصفحة إلى مسودة",
			);
		} catch {
			// الخطأ يُعرض عبر toast
		}
	};

	// تأكيد الحذف
	const handleConfirmDelete = async () => {
		if (!deletingPage) return;
		try {
			await deletePage(deletingPage.id);
		} finally {
			setDeletingPage(null);
		}
	};

	return (
		<div
			className="flex min-h-0 flex-1 flex-col"
			dir="rtl"
		>
			{/* شريط الإحصائيات العلوي */}
			<Stats
				className="grid-cols-3 gap-3 px-3"
				stats={statsData}
				variant="compact"
			/>

			{/* شريط أدوات الجدول والبحث مع الفلترة الموحدة للمنصة */}
			<TableToolbar
				className="border-y"
				searchPlaceholder="ابحث عن اسم الصفحة / التصنيف / النبذة..."
				searchClassName="w-[320px]"
				searchValue={search}
				onSearchChange={setSearch}
				showFilter={true}
				filterMenu={
					<FiltersMenu
						groups={filterGroups}
						size="sm"
						label="فلترة"
						onReset={clearAllFilters}
					/>
				}
				showExport={false}
				showView={false}
				leftExtra={
					<ViewOptionsMenu
						view={view}
						onViewChange={setView}
						oldestFirst={oldestFirst}
						onOldestFirstChange={setOldestFirst}
					/>
				}
				actions={
					<Button
						type="button"
						size="sm"
						className="h-8 gap-1.5 text-xs font-bold"
						onClick={handleCreateNew}
					>
						<IconPlus className="size-3.5" />
						صفحة جديدة
					</Button>
				}
			/>

			{/* شرائح الفلاتر النشطة */}
			{activeFilters.length > 0 && (
				<div className="flex flex-wrap items-center gap-2 border-b-[0.5px] border-border px-3 py-2 bg-muted/10">
					{activeFilters.map((f) => (
						<span
							key={f.key}
							className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary shadow-2xs"
						>
							<span className="text-muted-foreground">{f.label}:</span>
							<span>{f.value}</span>
							<button
								type="button"
								onClick={f.onRemove}
								className="hover:text-primary/70 cursor-pointer p-0.5 rounded-full hover:bg-primary/10 transition-colors"
								title="إزالة الفلتر"
							>
								<IconX className="size-3" />
							</button>
						</span>
					))}
					<button
						type="button"
						onClick={clearAllFilters}
						className="text-[11px] font-medium text-destructive hover:underline cursor-pointer px-1.5"
					>
						إعادة تعيين
					</button>
				</div>
			)}

			{/* محتوى الصفحات: شبكة أو جدول */}
			<div className="min-h-0 flex-1 overflow-auto bg-background py-3">
				{isLoading ? (
					<Spinner containerClassName="py-24 min-h-0" />
				) : pagesLoadError ? (
					<ContentLoadError
						message={
							pagesError instanceof Error
								? pagesError.message
								: "تعذّر تحميل الصفحات التدريبية."
						}
						onRetry={() => void refetch()}
					/>
				) : filteredPages.length === 0 ? (
					<div className="flex flex-col items-center gap-3 px-3 py-16 text-center">
						<span className="flex size-12 items-center justify-center rounded-2xl bg-muted/80 text-muted-foreground">
							<IconFileText className="size-6" />
						</span>
						<h2 className="text-[14px] font-bold text-foreground">
							{pages.length === 0
								? "لا توجد صفحات تدريبية بعد"
								: "لا توجد صفحات مطابقة للبحث أو الفلترة"}
						</h2>
						<p className="max-w-[320px] text-[12px] text-muted-foreground leading-relaxed">
							{pages.length === 0
								? "أنشئ صفحات معرفية ومحتوى تفاعلي مستقل يمكنك مشاركته مع المتدربين أو ربطه بالدورات لاحقاً."
								: "جرب تغيير معايير البحث أو إعادة ضبط خيارات الفلترة لعرض النتائج."}
						</p>
						{pages.length === 0 ? (
							<Button
								type="button"
								onClick={handleCreateNew}
								className="h-9 gap-1.5 rounded-lg px-4 text-[12px] font-bold mt-1"
							>
								<IconPlus className="size-4" />
								إنشاء صفحة جديدة
							</Button>
						) : (
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={clearAllFilters}
								className="gap-1.5 text-xs font-semibold mt-1 cursor-pointer"
							>
								إعادة ضبط الفلاتر
							</Button>
						)}
					</div>
				) : view === "grid" ? (
					<div className="grid grid-cols-1 gap-3 px-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{filteredPages.map((page) => (
							<PageCard
								key={page.id}
								page={page}
								onEdit={() => handleEditPage(page)}
								onPreview={() => setPreviewingPage(page)}
								onDuplicate={() => void duplicatePage(page.id)}
								onPublishToggle={() => void handlePublishToggle(page)}
								onDelete={() => setDeletingPage(page)}
							/>
						))}
					</div>
				) : (
					<div className="px-3">
						<PagesTable
							pages={filteredPages}
							isLoading={false}
							onEdit={handleEditPage}
							onPreview={(p) => setPreviewingPage(p)}
							onDuplicate={(p) => void duplicatePage(p.id)}
							onPublishToggle={(p) => void handlePublishToggle(p)}
							onDelete={(p) => setDeletingPage(p)}
							onStatusChange={handleStatusChange}
						/>
					</div>
				)}
			</div>

			{/* نافذة إنشاء / تعديل الصفحة المكونة من خطوتين مع المحرر والمعاينة اللايف */}
			<PageDialog
				open={dialogOpen}
				page={editingPage}
				onClose={() => setDialogOpen(false)}
				onSave={handleSavePage}
			/>

			{/* نافذة المعاينة المباشرة الكاملة */}
			<PagePreviewDialog
				open={!!previewingPage}
				page={previewingPage}
				onClose={() => setPreviewingPage(null)}
			/>

			{/* نافذة تأكيد حذف الصفحة */}
			<DeletePageDialog
				page={deletingPage}
				onClose={() => setDeletingPage(null)}
				onConfirm={handleConfirmDelete}
			/>
		</div>
	);
}
