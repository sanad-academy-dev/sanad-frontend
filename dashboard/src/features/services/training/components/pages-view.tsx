import {
	IconClock,
	IconDots,
	IconEye,
	IconFileDescription,
	IconFileText,
	IconLayoutGrid,
	IconList,
	IconPencil,
	IconPlus,
	IconSparkles,
	IconTrash,
} from "@tabler/icons-react";
import type React from "react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Stats } from "@/components/common/stats";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { PageEditorSheet } from "./page-editor-sheet";
import { toArabicNumerals } from "./track-courses-step";

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

export const INITIAL_PAGES: PageItem[] = [
	{
		id: "page-1",
		title: "المقدمة والتعليمات العامة للمسار التدريبي",
		summary:
			"دليل توجيهي شامل للمتدربين يوضح آلية التقدم في المسار والالتزامات الأكاديمية وشروط التخرج.",
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
		summary:
			"مستند تعريفي بأحدث معايير الجودة والممارسات السريرية والتأهيلية المعتمدة في مراكز سند.",
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
		summary:
			"المبادئ التوجيهية لأخلاقيات المهنة وآليات حساب الدرجات ونسب الحضور والالتزام المطلوبة.",
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
		summary:
			"مخطط هيكلي للمخرجات التعليمية والمهارات التطبيقية التي سيكتسبها المتدرب بعد اجتياز محاور المسار.",
		readingTimeMinutes: 7,
		category: "تربوي وأكاديمي",
		author: "فريق الإشراف التربوي",
		status: "DRAFT",
		updatedAt: "2026-10-15",
		viewsCount: 95,
	},
];

export function PagesView() {
	const [pages, setPages] = useState<PageItem[]>(INITIAL_PAGES);
	const [searchQuery, setSearchQuery] = useState("");
	const [activeCategory, setActiveCategory] = useState("ALL");
	const [activeStatus, setActiveStatus] = useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL");
	const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

	// حالة إنشاء صفحة جديدة
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [newPageTitle, setNewPageTitle] = useState("");
	const [newPageSummary, setNewPageSummary] = useState("");
	const [newPageCategory, setNewPageCategory] = useState("عام وتوجيهي");
	const [newPageReadingTime, setNewPageReadingTime] = useState(5);

	// حالة محرر Notion (الـ Sheet المباشر)
	const [editorPageId, setEditorPageId] = useState<string | null>(null);

	// حالة معاينة الصفحة
	const [previewPage, setPreviewPage] = useState<PageItem | null>(null);

	// إحصائيات سريعة للبطاقات العلوية
	const statsData = useMemo(() => {
		const total = pages.length;
		const published = pages.filter((p) => p.status === "PUBLISHED").length;
		const drafts = pages.filter((p) => p.status === "DRAFT").length;
		const totalViews = pages.reduce((sum, p) => sum + p.viewsCount, 0);

		return [
			{
				title: "إجمالي الصفحات والمستندات",
				value: total,
				tooltip: "العدد الكلي للمستندات والصفحات التعليمية",
			},
			{
				title: "الصفحات المنشورة",
				value: published,
				tooltip: "الصفحات المفعلة والمتاحة للمتدربين",
			},
			{
				title: "المسودات",
				value: drafts,
				tooltip: "صفحات قيد الصياغة والإعداد",
			},
			{
				title: "إجمالي المشاهدات والقراءات",
				value: totalViews,
				tooltip: "عدد مرات فتح وقراءة الصفحات من قبل المتدربين",
			},
		];
	}, [pages]);

	// تصفية الصفحات حسب البحث والتصنيف
	const filteredPages = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		return pages.filter((p) => {
			const matchesQuery =
				!query ||
				p.title.toLowerCase().includes(query) ||
				p.summary.toLowerCase().includes(query) ||
				p.author.toLowerCase().includes(query);

			const matchesCategory = activeCategory === "ALL" || p.category === activeCategory;
			const matchesStatus = activeStatus === "ALL" || p.status === activeStatus;

			return matchesQuery && matchesCategory && matchesStatus;
		});
	}, [pages, searchQuery, activeCategory, activeStatus]);

	const handleCreatePage = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newPageTitle.trim()) {
			toast.error("يرجى إدخال عنوان الصفحة");
			return;
		}

		const newPage: PageItem = {
			id: `page-${Date.now()}`,
			title: newPageTitle.trim(),
			summary: newPageSummary.trim() || "مستند تعليمي وإرشادي للمتدربين.",
			readingTimeMinutes: newPageReadingTime || 5,
			category: newPageCategory,
			author: "الإدارة الأكاديمية",
			status: "PUBLISHED",
			updatedAt: new Date().toISOString().slice(0, 10),
			viewsCount: 0,
		};

		setPages((prev) => [newPage, ...prev]);
		setIsCreateOpen(false);
		setNewPageTitle("");
		setNewPageSummary("");
		toast.success("تم إنشاء الصفحة التعليمية بنجاح");
	};

	const handleDeletePage = (id: string) => {
		setPages((prev) => prev.filter((p) => p.id !== id));
		toast.info("تم حذف الصفحة بنجاح");
	};

	return (
		<div
			dir="rtl"
			className="flex flex-1 flex-col overflow-y-auto bg-background p-4 sm:p-6 space-y-5"
		>
			{/* شريط الإحصائيات العلوية */}
			<Stats stats={statsData} />

			{/* شريط الأدوات والبحث والإجراءات */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3.5 rounded-xl border border-border shadow-2xs">
				<div className="flex items-center gap-2.5 flex-1 min-w-0">
					<Input
						type="search"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="ابحث في الصفحات بالعنوان أو الملخص أو الكاتب..."
						className="h-9 text-xs flex-1 max-w-sm"
					/>

					<Select
						value={activeCategory}
						onValueChange={setActiveCategory}
					>
						<SelectTrigger className="h-9 text-xs w-[140px]">
							<SelectValue placeholder="كافة التصنيفات" />
						</SelectTrigger>
						<SelectContent align="end">
							<SelectItem
								value="ALL"
								className="text-xs"
							>
								كافة التصنيفات
							</SelectItem>
							<SelectItem
								value="عام وتوجيهي"
								className="text-xs"
							>
								عام وتوجيهي
							</SelectItem>
							<SelectItem
								value="طبي وتأهيلي"
								className="text-xs"
							>
								طبي وتأهيلي
							</SelectItem>
							<SelectItem
								value="إداري وتنظيمي"
								className="text-xs"
							>
								إداري وتنظيمي
							</SelectItem>
							<SelectItem
								value="تربوي وأكاديمي"
								className="text-xs"
							>
								تربوي وأكاديمي
							</SelectItem>
						</SelectContent>
					</Select>

					<Select
						value={activeStatus}
						onValueChange={(v) => setActiveStatus(v as "ALL" | "PUBLISHED" | "DRAFT")}
					>
						<SelectTrigger className="h-9 text-xs w-[120px]">
							<SelectValue placeholder="الحالة" />
						</SelectTrigger>
						<SelectContent align="end">
							<SelectItem
								value="ALL"
								className="text-xs"
							>
								كافة الحالات
							</SelectItem>
							<SelectItem
								value="PUBLISHED"
								className="text-xs"
							>
								منشور
							</SelectItem>
							<SelectItem
								value="DRAFT"
								className="text-xs"
							>
								مسودة
							</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="flex items-center gap-2 shrink-0">
					{/* تبديل نمط العرض (شبكة / جدول) */}
					<div className="flex items-center rounded-lg border border-border p-0.5 bg-muted/40">
						<button
							type="button"
							onClick={() => setViewMode("grid")}
							className={cn(
								"p-1.5 rounded-md transition-colors cursor-pointer",
								viewMode === "grid"
									? "bg-background text-foreground shadow-2xs"
									: "text-muted-foreground hover:text-foreground",
							)}
							title="عرض شبكي"
						>
							<IconLayoutGrid className="size-4" />
						</button>
						<button
							type="button"
							onClick={() => setViewMode("table")}
							className={cn(
								"p-1.5 rounded-md transition-colors cursor-pointer",
								viewMode === "table"
									? "bg-background text-foreground shadow-2xs"
									: "text-muted-foreground hover:text-foreground",
							)}
							title="عرض جدولي"
						>
							<IconList className="size-4" />
						</button>
					</div>

					<Button
						type="button"
						size="sm"
						onClick={() => setEditorPageId(`new-page-${Date.now()}`)}
						className="h-9 gap-1.5 text-xs font-semibold bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg shadow-2xs cursor-pointer"
					>
						<IconSparkles className="size-4" />
						<span>إنشاء بمحرر Notion</span>
					</Button>

					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => setIsCreateOpen(true)}
						className="h-9 gap-1.5 text-xs font-medium rounded-lg shadow-2xs cursor-pointer"
					>
						<IconPlus className="size-4" />
						<span>بيانات سريعة</span>
					</Button>
				</div>
			</div>

			{/* محتوى الصفحات */}
			{filteredPages.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-xl border border-dashed border-border p-6 space-y-3">
					<div className="size-14 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-2xs">
						<IconFileText className="size-7 stroke-[1.8]" />
					</div>
					<div className="space-y-1 max-w-sm">
						<h3 className="text-sm font-bold text-foreground">لا توجد صفحات مطابقة</h3>
						<p className="text-xs text-muted-foreground">
							لم يتم العثور على أي صفحات تطابق خيارات البحث الحالية. يمكنك إنشاء صفحة جديدة أو
							تعديل الفلتر.
						</p>
					</div>
					<Button
						type="button"
						size="sm"
						onClick={() => setIsCreateOpen(true)}
						className="h-8 text-xs font-semibold gap-1.5 bg-purple-600 hover:bg-purple-700 text-white cursor-pointer mt-1"
					>
						<IconPlus className="size-3.5" />
						<span>إنشاء أول صفحة تعليمية</span>
					</Button>
				</div>
			) : viewMode === "grid" ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{filteredPages.map((page) => (
						<div
							key={page.id}
							className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-4 hover:border-purple-300 dark:hover:border-purple-800 transition-all duration-200 shadow-2xs hover:shadow-xs space-y-3"
						>
							<div className="space-y-2">
								<div className="flex items-start justify-between gap-2">
									<div className="size-9 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 border border-sky-100 dark:border-sky-900/40">
										<IconFileDescription className="size-5" />
									</div>

									<div className="flex items-center gap-1.5">
										<Badge
											variant={page.status === "PUBLISHED" ? "default" : "secondary"}
											className={cn(
												"text-[9px] font-semibold h-4 px-1.5",
												page.status === "PUBLISHED"
													? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40"
													: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40",
											)}
										>
											{page.status === "PUBLISHED" ? "منشور" : "مسودة"}
										</Badge>

										<DropdownMenu dir="rtl">
											<DropdownMenuTrigger
												aria-label="إجراءات الصفحة"
												className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
											>
												<IconDots className="size-4" />
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem onClick={() => setEditorPageId(page.id)}>
													<IconPencil className="size-3.5 ml-1.5 text-purple-600" />
													<span>تحرير بمحرر Notion</span>
												</DropdownMenuItem>
												<DropdownMenuItem onClick={() => setPreviewPage(page)}>
													<IconEye className="size-3.5 ml-1.5" />
													<span>معاينة المحتوى</span>
												</DropdownMenuItem>
												<DropdownMenuItem
													className="text-destructive focus:text-destructive"
													onClick={() => handleDeletePage(page.id)}
												>
													<IconTrash className="size-3.5 ml-1.5" />
													<span>حذف</span>
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</div>

								<h4 className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-purple-600 transition-colors">
									{page.title}
								</h4>

								<p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
									{page.summary}
								</p>
							</div>

							<div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
								<div className="flex items-center gap-1">
									<IconClock className="size-3 text-muted-foreground/70" />
									<span>{toArabicNumerals(page.readingTimeMinutes)} دقائق قراءة</span>
								</div>
								<Badge
									variant="outline"
									className="text-[10px] font-medium border-border/80"
								>
									{page.category}
								</Badge>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="rounded-xl border border-border bg-card overflow-hidden">
					<table className="w-full text-right text-xs">
						<thead>
							<tr className="border-b border-border bg-muted/30 text-muted-foreground font-semibold">
								<th className="p-3">عنوان الصفحة والمستند</th>
								<th className="p-3">التصنيف</th>
								<th className="p-3">وقت القراءة</th>
								<th className="p-3">الكاتب / المصدر</th>
								<th className="p-3">الحالة</th>
								<th className="p-3 text-center">الإجراءات</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border/60">
							{filteredPages.map((page) => (
								<tr
									key={page.id}
									className="hover:bg-muted/30 transition-colors"
								>
									<td className="p-3 font-semibold text-foreground max-w-xs truncate">
										{page.title}
									</td>
									<td className="p-3 text-muted-foreground">{page.category}</td>
									<td className="p-3 text-muted-foreground">
										{toArabicNumerals(page.readingTimeMinutes)} دقائق
									</td>
									<td className="p-3 text-muted-foreground">{page.author}</td>
									<td className="p-3">
										<Badge
											variant="secondary"
											className={cn(
												"text-[9px] font-semibold h-4 px-1.5",
												page.status === "PUBLISHED"
													? "bg-emerald-50 text-emerald-600 border border-emerald-200"
													: "bg-amber-50 text-amber-600 border border-amber-200",
											)}
										>
											{page.status === "PUBLISHED" ? "منشور" : "مسودة"}
										</Badge>
									</td>
									<td className="p-3 text-center">
										<div className="flex items-center justify-center gap-1">
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() => setEditorPageId(page.id)}
												className="h-7 px-2 text-xs text-purple-600 hover:bg-purple-50"
												title="تحرير بمحرر Notion"
											>
												<IconPencil className="size-3.5" />
											</Button>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() => setPreviewPage(page)}
												className="h-7 px-2 text-xs"
											>
												<IconEye className="size-3.5" />
											</Button>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() => handleDeletePage(page.id)}
												className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10"
											>
												<IconTrash className="size-3.5" />
											</Button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{/* حوار إنشاء صفحة جديدة */}
			<Dialog
				open={isCreateOpen}
				onOpenChange={setIsCreateOpen}
			>
				<DialogContent
					dir="rtl"
					className="sm:max-w-md"
				>
					<DialogHeader>
						<DialogTitle className="text-sm font-bold text-foreground">
							إنشاء صفحة أو مستند تعليمي جديد
						</DialogTitle>
						<DialogDescription className="text-xs text-muted-foreground">
							أضف صفحة جديدة يمكن ربطها واستخدامها كمادة تعليمية في المسارات والدورات.
						</DialogDescription>
					</DialogHeader>

					<form
						onSubmit={handleCreatePage}
						className="space-y-3.5 py-2 text-right"
					>
						<div className="space-y-1.5">
							<Label className="text-xs font-semibold">عنوان الصفحة</Label>
							<Input
								value={newPageTitle}
								onChange={(e) => setNewPageTitle(e.target.value)}
								placeholder="مثال: المقدمة والتوجيهات التنفيذية..."
								className="h-9 text-xs"
							/>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1.5">
								<Label className="text-xs font-semibold">التصنيف</Label>
								<Select
									value={newPageCategory}
									onValueChange={setNewPageCategory}
								>
									<SelectTrigger className="h-9 text-xs">
										<SelectValue />
									</SelectTrigger>
									<SelectContent align="end">
										<SelectItem
											value="عام وتوجيهي"
											className="text-xs"
										>
											عام وتوجيهي
										</SelectItem>
										<SelectItem
											value="طبي وتأهيلي"
											className="text-xs"
										>
											طبي وتأهيلي
										</SelectItem>
										<SelectItem
											value="إداري وتنظيمي"
											className="text-xs"
										>
											إداري وتنظيمي
										</SelectItem>
										<SelectItem
											value="تربوي وأكاديمي"
											className="text-xs"
										>
											تربوي وأكاديمي
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-1.5">
								<Label className="text-xs font-semibold">
									وقت القراءة التقديري (بالدقائق)
								</Label>
								<Input
									type="number"
									min={1}
									max={180}
									value={newPageReadingTime}
									onChange={(e) => setNewPageReadingTime(Number(e.target.value))}
									className="h-9 text-xs"
								/>
							</div>
						</div>

						<div className="space-y-1.5">
							<Label className="text-xs font-semibold">ملخص ووصف الصفحة</Label>
							<Textarea
								value={newPageSummary}
								onChange={(e) => setNewPageSummary(e.target.value)}
								placeholder="ملخص محتوى وأهداف هذا المستند للمتدربين..."
								rows={3}
								className="text-xs resize-none"
							/>
						</div>

						<DialogFooter className="pt-2">
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => setIsCreateOpen(false)}
								className="h-8 text-xs cursor-pointer"
							>
								إلغاء
							</Button>
							<Button
								type="submit"
								size="sm"
								className="h-8 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
							>
								حفظ ونشر الصفحة
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* حوار معاينة الصفحة */}
			{previewPage && (
				<Dialog
					open={!!previewPage}
					onOpenChange={(v) => !v && setPreviewPage(null)}
				>
					<DialogContent
						dir="rtl"
						className="sm:max-w-lg"
					>
						<DialogHeader>
							<div className="flex items-center gap-2 mb-1">
								<Badge
									variant="outline"
									className="text-[10px]"
								>
									{previewPage.category}
								</Badge>
								<span className="text-[11px] text-muted-foreground">
									{toArabicNumerals(previewPage.readingTimeMinutes)} دقائق قراءة
								</span>
							</div>
							<DialogTitle className="text-sm font-bold text-foreground">
								{previewPage.title}
							</DialogTitle>
						</DialogHeader>

						<div className="py-3 text-xs leading-relaxed text-foreground/90 space-y-3">
							<p className="bg-muted/40 p-3 rounded-lg border border-border/60">
								{previewPage.summary}
							</p>
							<div className="p-4 rounded-xl border border-dashed border-border bg-card space-y-2 text-muted-foreground text-[11px]">
								<p>
									هذا نموذج لمعاينة الصفحة التعليمية. سيتمكن منشئ المسار والمتدرب من استعراض
									النصوص الكاملة والمرفقات الداعمة بداخلها أثناء دراسة محاور المسار.
								</p>
								<div className="flex items-center justify-between text-[10px] pt-2 border-t border-border/50">
									<span>الكاتب: {previewPage.author}</span>
									<span>تاريخ النشر: {previewPage.updatedAt}</span>
								</div>
							</div>
						</div>

						<DialogFooter>
							<Button
								type="button"
								size="sm"
								onClick={() => setPreviewPage(null)}
								className="h-8 text-xs"
							>
								إغلاق المعاينة
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}

			{/* محرر Notion المتكامل للصفحات */}
			<PageEditorSheet
				pageId={editorPageId}
				editable={true}
				onClose={() => setEditorPageId(null)}
			/>
		</div>
	);
}
