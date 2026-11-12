import {
	IconBook2,
	IconDownload,
	IconEye,
	IconFile,
	IconFileTypePdf,
	IconFilter,
	IconFolder,
	IconPlus,
	IconPresentation,
	IconShare,
	IconTrash,
	IconVideo,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Stats } from "@/components/common/stats";
import { TableToolbar } from "@/components/common/table-toolbar";
import { type FilterGroup, FiltersMenu } from "@/components/common/filters-menu";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
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

export type LibraryResourceType = "pdf" | "video" | "book" | "presentation" | "template";
export type LibraryCategory = "general" | "rehab" | "educational" | "admin";

export type LibraryItem = {
	id: string;
	title: string;
	description: string;
	type: LibraryResourceType;
	category: LibraryCategory;
	categoryLabel: string;
	size: string;
	addedAt: string;
	author: string;
	downloadsCount: number;
};

export const INITIAL_RESOURCES: LibraryItem[] = [
	{
		id: "res-1",
		title: "دليل التعامل مع حالات اضطراب التوحد",
		description: "دليل شامل للكوادر والمشرفين يوضح أحدث الاستراتيجيات السلوكية والتخاطبية.",
		type: "pdf",
		category: "rehab",
		categoryLabel: "طبي وتأهيلي",
		size: "4.8 MB",
		addedAt: "2026-10-25",
		author: "د. هدى السعيد",
		downloadsCount: 142,
	},
	{
		id: "res-2",
		title: "حقيبة الأنشطة التفاعلية وتنمية المهارات",
		description: "مجموعة نماذج عملية لتمارين التركيز وتنمية المهارات الحركية الدقيقة.",
		type: "book",
		category: "educational",
		categoryLabel: "تربوي وسلوكي",
		size: "12.3 MB",
		addedAt: "2026-10-18",
		author: "أ. نورة الغامدي",
		downloadsCount: 98,
	},
	{
		id: "res-3",
		title: "محاضرة: إدارة الفصول التفاعلية عبر منصة سند",
		description: "تسجيل ورشة العمل التدريبية لمعلمي ومعلمات الأكاديمية حول ضبط وإدارة الفصول.",
		type: "video",
		category: "educational",
		categoryLabel: "تربوي وسلوكي",
		size: "185 MB",
		addedAt: "2026-10-12",
		author: "م. أحمد الشمري",
		downloadsCount: 76,
	},
	{
		id: "res-4",
		title: "عرض تقديمي: معايير السلامة المهنية والإسعافات الأولية",
		description: "عرض مرئي تدريبي معتمد لإجراءات الإخلاء والتعامل مع الطوارئ في المراكز.",
		type: "presentation",
		category: "admin",
		categoryLabel: "إداري وتشغيلي",
		size: "8.5 MB",
		addedAt: "2026-10-05",
		author: "قسم الجودة والسلامة",
		downloadsCount: 63,
	},
	{
		id: "res-5",
		title: "نموذج خطة المتابعة الفردية (IEP)",
		description: "قالب معتمد قابل للتعديل لصياغة الأهداف الفردية ومتابعة تقييم الطلاب.",
		type: "template",
		category: "rehab",
		categoryLabel: "طبي وتأهيلي",
		size: "1.2 MB",
		addedAt: "2026-09-28",
		author: "فريق الإشراف الأكاديمي",
		downloadsCount: 210,
	},
	{
		id: "res-6",
		title: "اللائحة التنظيمية وحوكمة العمل بالأكاديمية",
		description: "المستند الرسمي لسياسات الموارد البشرية ومدونة السلوك المهني.",
		type: "pdf",
		category: "admin",
		categoryLabel: "إداري وتشغيلي",
		size: "3.4 MB",
		addedAt: "2026-09-15",
		author: "إدارة الموارد البشرية",
		downloadsCount: 115,
	},
];

export const TYPE_CONFIG: Record<
	LibraryResourceType,
	{ label: string; icon: typeof IconFile; color: string; bg: string }
> = {
	pdf: {
		label: "مستند PDF",
		icon: IconFileTypePdf,
		color: "text-rose-600 dark:text-rose-400",
		bg: "bg-rose-50 border-rose-200 dark:bg-rose-950/30 dark:border-rose-900/40",
	},
	video: {
		label: "مقطع فيديو",
		icon: IconVideo,
		color: "text-blue-600 dark:text-blue-400",
		bg: "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900/40",
	},
	book: {
		label: "كتاب ودليل",
		icon: IconBook2,
		color: "text-amber-600 dark:text-amber-400",
		bg: "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/40",
	},
	presentation: {
		label: "عرض تقديمي",
		icon: IconPresentation,
		color: "text-purple-600 dark:text-purple-400",
		bg: "bg-purple-50 border-purple-200 dark:bg-purple-950/30 dark:border-purple-900/40",
	},
	template: {
		label: "قالب ونموذج",
		icon: IconFile,
		color: "text-emerald-600 dark:text-emerald-400",
		bg: "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900/40",
	},
};

export function MyLibraryView() {
	const [resources, setResources] = useState<LibraryItem[]>(INITIAL_RESOURCES);
	const [search, setSearch] = useState("");
	const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [isAddOpen, setIsAddOpen] = useState(false);

	// نموذج إضافة مورد جديد
	const [newTitle, setNewTitle] = useState("");
	const [newDesc, setNewDesc] = useState("");
	const [newType, setNewType] = useState<LibraryResourceType>("pdf");
	const [newCategory, setNewCategory] = useState<LibraryCategory>("rehab");

	const filteredResources = useMemo(() => {
		const q = search.trim().toLowerCase();
		return resources.filter((r) => {
			if (q && !r.title.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.author.toLowerCase().includes(q)) {
				return false;
			}
			if (selectedTypes.length > 0 && !selectedTypes.includes(r.type)) {
				return false;
			}
			if (selectedCategories.length > 0 && !selectedCategories.includes(r.category)) {
				return false;
			}
			return true;
		});
	}, [resources, search, selectedTypes, selectedCategories]);

	const statsData = useMemo(() => [
		{
			title: "إجمالي المواد",
			value: resources.length,
			tooltip: "العدد الكلي للمواد المضافة بمكتبتي",
		},
		{
			title: "مستندات وكتب",
			value: resources.filter((r) => r.type === "pdf" || r.type === "book").length,
			tooltip: "ملفات PDF والكتب التدريبية",
		},
		{
			title: "وسائط وفيديوهات",
			value: resources.filter((r) => r.type === "video").length,
			tooltip: "المقاطع المرئية والمحاضرات المسجلة",
		},
		{
			title: "قوالب وعروض",
			value: resources.filter((r) => r.type === "template" || r.type === "presentation").length,
			tooltip: "قوالب العمل والعروض التقديمية",
		},
	], [resources]);

	const filterGroups: FilterGroup[] = useMemo(() => [
		{
			key: "type",
			label: "نوع الملف",
			Icon: IconFile,
			options: [
				{ value: "pdf", label: "مستند PDF" },
				{ value: "video", label: "مقطع فيديو" },
				{ value: "book", label: "كتاب ودليل" },
				{ value: "presentation", label: "عرض تقديمي" },
				{ value: "template", label: "قالب ونموذج" },
			],
			selected: selectedTypes,
			onToggle: (v) =>
				setSelectedTypes((prev) =>
					prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
				),
		},
		{
			key: "category",
			label: "التصنيف",
			Icon: IconFolder,
			options: [
				{ value: "rehab", label: "طبي وتأهيلي" },
				{ value: "educational", label: "تربوي وسلوكي" },
				{ value: "admin", label: "إداري وتشغيلي" },
				{ value: "general", label: "عام" },
			],
			selected: selectedCategories,
			onToggle: (v) =>
				setSelectedCategories((prev) =>
					prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
				),
		},
	], [selectedTypes, selectedCategories]);

	const handleAddResource = () => {
		if (!newTitle.trim()) {
			toast.error("يرجى إدخال عنوان المورد");
			return;
		}

		const categoryLabelMap: Record<LibraryCategory, string> = {
			rehab: "طبي وتأهيلي",
			educational: "تربوي وسلوكي",
			admin: "إداري وتشغيلي",
			general: "عام",
		};

		const item: LibraryItem = {
			id: `res-${Date.now()}`,
			title: newTitle.trim(),
			description: newDesc.trim() || "لا يوجد وصف إضافي.",
			type: newType,
			category: newCategory,
			categoryLabel: categoryLabelMap[newCategory],
			size: "2.4 MB",
			addedAt: new Date().toISOString().split("T")[0],
			author: "المشرف الأكاديمي",
			downloadsCount: 0,
		};

		setResources((prev) => [item, ...prev]);
		setIsAddOpen(false);
		setNewTitle("");
		setNewDesc("");
		toast.success("تمت إضافة المورد إلى مكتبتك بنجاح");
	};

	const handleDelete = (id: string) => {
		setResources((prev) => prev.filter((r) => r.id !== id));
		toast.success("تم حذف المورد من المكتبة");
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			{/* شريط الإحصائيات */}
			<Stats stats={statsData} />

			{/* شريط الأدوات والبحث */}
			<TableToolbar
				className="border-y"
				searchPlaceholder="ابحث في مكتبتي بالعنوان، الوصف، أو الناشر..."
				searchValue={search}
				onSearchChange={setSearch}
				filterMenu={
					<FiltersMenu
						groups={filterGroups}
						size="sm"
						label="تصفية"
						onReset={() => {
							setSelectedTypes([]);
							setSelectedCategories([]);
						}}
					/>
				}
				actions={
					<Button
						size="sm"
						onClick={() => setIsAddOpen(true)}
						className="gap-1.5"
					>
						<IconPlus className="size-4" />
						إضافة مورد جديد
					</Button>
				}
			/>

			{/* محتوى المكتبة */}
			<div className="flex-1 overflow-y-auto p-4 md:p-6">
				{filteredResources.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
						<IconBook2 className="size-12 stroke-[1.2] opacity-40 mb-3" />
						<p className="text-sm font-semibold text-foreground">لا توجد مواد مطابقة للبحث</p>
						<p className="text-xs text-muted-foreground mt-1 max-w-sm">
							يمكنك تجربة ضبط فلاتر البحث أو إضافة موارد جديدة إلى مكتبتك الرقمية.
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{filteredResources.map((item) => {
							const cfg = TYPE_CONFIG[item.type];
							const TypeIcon = cfg.icon;
							return (
								<div
									key={item.id}
									className="group flex flex-col justify-between rounded-lg border border-border bg-card p-4 transition-all hover:shadow-sm hover:border-primary/40"
								>
									<div>
										{/* الرأس: الأيقونة والوسوم */}
										<div className="flex items-start justify-between gap-2 mb-3">
											<div className={cn("flex size-9 shrink-0 items-center justify-center rounded-md border", cfg.bg)}>
												<TypeIcon className={cn("size-5", cfg.color)} />
											</div>
											<div className="flex items-center gap-1.5">
												<span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground border">
													{item.categoryLabel}
												</span>
												<span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
													{cfg.label}
												</span>
											</div>
										</div>

										{/* العنوان والوصف */}
										<h3 className="font-semibold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
											{item.title}
										</h3>
										<p className="text-xs text-muted-foreground line-clamp-2 mt-1 min-h-[32px]">
											{item.description}
										</p>
									</div>

									{/* التذييل: التفاصيل والإجراءات */}
									<div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
										<div className="flex items-center gap-3">
											<span>{item.size}</span>
											<span>•</span>
											<span>{item.author}</span>
										</div>

										<div className="flex items-center gap-1">
											<Button
												variant="ghost"
												size="icon"
												className="size-7 text-muted-foreground hover:text-foreground"
												onClick={() => toast.info(`معاينة "${item.title}"`)}
												title="معاينة المورد"
											>
												<IconEye className="size-3.5" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="size-7 text-muted-foreground hover:text-primary"
												onClick={() => toast.success(`جارِ تحميل "${item.title}"`)}
												title="تحميل"
											>
												<IconDownload className="size-3.5" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="size-7 text-muted-foreground hover:text-destructive"
												onClick={() => handleDelete(item.id)}
												title="حذف من المكتبة"
											>
												<IconTrash className="size-3.5" />
											</Button>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>

			{/* نافذة إضافة مورد جديد */}
			<Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
				<DialogContent className="max-w-md" dir="rtl">
					<DialogHeader>
						<DialogTitle>إضافة مورد جديد إلى مكتبتي</DialogTitle>
						<DialogDescription>
							أدخل تفاصيل المستند أو المادة التعليمية لإدراجها في مكتبة الموارد.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-3.5 py-2">
						<div className="space-y-1.5">
							<Label htmlFor="res-title">عنوان المورد</Label>
							<Input
								id="res-title"
								placeholder="مثال: دليل التدريب الإكلينيكي الميداني"
								value={newTitle}
								onChange={(e) => setNewTitle(e.target.value)}
							/>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1.5">
								<Label>نوع المورد</Label>
								<Select
									value={newType}
									onValueChange={(v) => setNewType(v as LibraryResourceType)}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent dir="rtl">
										<SelectItem value="pdf">مستند PDF</SelectItem>
										<SelectItem value="book">كتاب أو دليل</SelectItem>
										<SelectItem value="video">مقطع فيديو</SelectItem>
										<SelectItem value="presentation">عرض تقديمي</SelectItem>
										<SelectItem value="template">قالب أو نموذج</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-1.5">
								<Label>التصنيف</Label>
								<Select
									value={newCategory}
									onValueChange={(v) => setNewCategory(v as LibraryCategory)}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent dir="rtl">
										<SelectItem value="rehab">طبي وتأهيلي</SelectItem>
										<SelectItem value="educational">تربوي وسلوكي</SelectItem>
										<SelectItem value="admin">إداري وتشغيلي</SelectItem>
										<SelectItem value="general">عام</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="space-y-1.5">
							<Label htmlFor="res-desc">الوصف</Label>
							<Textarea
								id="res-desc"
								placeholder="وصف موجز لمحتوى الملف والهدف منه..."
								rows={3}
								value={newDesc}
								onChange={(e) => setNewDesc(e.target.value)}
							/>
						</div>
					</div>

					<DialogFooter className="gap-2">
						<Button variant="outline" onClick={() => setIsAddOpen(false)}>
							إلغاء
						</Button>
						<Button onClick={handleAddResource}>
							إضافة للمكتبة
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
