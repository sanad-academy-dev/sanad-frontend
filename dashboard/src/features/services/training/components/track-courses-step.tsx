import {
	IconArrowRight,
	IconBrandFigma,
	IconBrandWhatsapp,
	IconBrain,
	IconBulb,
	IconChartBar,
	IconCheck,
	IconChevronDown,
	IconCode,
	IconFilter,
	IconInfoCircle,
	IconLayoutGrid,
	IconPlus,
	IconSchool,
	IconSearch,
	IconShieldCheck,
	IconSparkles,
	IconTrash,
	IconX,
} from "@tabler/icons-react";
import React, { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { useCourses } from "@/features/services/training/hooks/use-courses";
import { resolveCover } from "@/features/services/training/utils/cover";
import { cn } from "@/lib/utils";
import type { CourseListItemResponse } from "@/server/training/training.type";

// تحويل الأرقام إلى أرقام عربية تطابق التصميم المعروض
const toArabicNumerals = (n: number | string) =>
	String(n).replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number.parseInt(d, 10)]);

// دورات افتراضية قياسية بغلاف وألوان في حال كانت قاعدة البيانات فارغة
const SCREENSHOT_COURSES = [
	{
		id: "crs-ux-principles",
		name: "مبادئ تجربة المستخدم UX",
		code: "UX-101",
		category: "التصميم",
		durationHours: 4,
		lessonsCount: 8,
		coverKey: "color:#8B5CF6",
		icon: IconSparkles,
		description: "فهم احتياجات وسلوك المستخدم وتصميم رحلات استخدام بديهية وفعالة.",
	},
	{
		id: "crs-ui-basics",
		name: "أساسيات تصميم واجهات UI",
		code: "UI-102",
		category: "التصميم",
		durationHours: 6,
		lessonsCount: 12,
		coverKey: "color:#6366F1",
		icon: IconLayoutGrid,
		description: "إتقان نظريات الألوان، الخطوط، والشبكات لبناء واجهات رقمية عصرية.",
	},
	{
		id: "crs-design-thinking",
		name: "التفكير التصميمي وحل المشكلات",
		code: "DT-103",
		category: "التصميم",
		durationHours: 3,
		lessonsCount: 6,
		coverKey: "color:#A855F7",
		icon: IconBulb,
		description: "منهجية الابتكار وتفكيك المشكلات المعقدة وصياغة حلول إبداعية قابلة للتطبيق.",
	},
	{
		id: "crs-figma-prototyping",
		name: "تصميم النماذج الأولية باستخدام Figma",
		code: "FIG-104",
		category: "التصميم",
		durationHours: 5,
		lessonsCount: 10,
		coverKey: "color:#EC4899",
		icon: IconBrandFigma,
		description: "بناء النماذج التفاعلية المتقدمة واختبار تجربة الاستخدام قبل التطوير.",
	},
	{
		id: "crs-data-analysis",
		name: "مقدمة في تحليل البيانات",
		code: "DA-105",
		category: "التقنية",
		durationHours: 7,
		lessonsCount: 14,
		coverKey: "color:#3B82F6",
		icon: IconChartBar,
		description: "استكشاف البيانات وتحليل المؤشرات واستخلاص الرؤى لاتخاذ قرارات دقيقة.",
	},
	{
		id: "crs-cyber-security",
		name: "أساسيات الأمن السيبراني",
		code: "SEC-106",
		category: "التقنية",
		durationHours: 4,
		lessonsCount: 9,
		coverKey: "color:#10B981",
		icon: IconShieldCheck,
		description: "مبادئ الحماية الرقمية والتوعية بالثغرات وتأمين الأنظمة والشبكات.",
	},
	{
		id: "crs-web-dev",
		name: "تطوير تطبيقات الويب المتكاملة",
		code: "WEB-107",
		category: "البرمجة",
		durationHours: 8,
		lessonsCount: 16,
		coverKey: "color:#F97316",
		icon: IconCode,
		description: "برمجة وبناء مواقع الويب المتكاملة باستخدام React و Node.js.",
	},
	{
		id: "crs-ai-python",
		name: "الذكاء الاصطناعي وبايثون",
		code: "AI-108",
		category: "التقنية",
		durationHours: 6,
		lessonsCount: 12,
		coverKey: "color:#06B6D4",
		icon: IconBrain,
		description: "تطبيقات تعلم الآلة ومعالجة اللغات الطبيعية باستخدام مكتبات بايثون.",
	},
];

export interface TrackCoursesStepProps {
	isEdit: boolean;
	trackName: string;
	trackCode?: string;
	selectedIcon?: string;
	selectedColor?: string;
	selectedCourseIds: string[];
	onToggleCourse: (courseId: string) => void;
	onSelectAll: (courseIds: string[]) => void;
	onClearAll: () => void;
	onBackToForm: () => void;
	onSubmit: () => void;
	isSubmitting: boolean;
	notifyWhatsApp: boolean;
	onNotifyWhatsAppChange: (val: boolean) => void;
	createAnother?: boolean;
	onCreateAnotherChange?: (val: boolean) => void;
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
		icon?: any;
	};
	className?: string;
}) {
	const cover = resolveCover(course.coverKey);
	const [imageError, setImageError] = useState(false);

	if (cover?.type === "image" && !imageError) {
		return (
			<div
				className={cn(
					"size-11 rounded-xl overflow-hidden shrink-0 border border-border/80 bg-muted/60 flex items-center justify-center shadow-2xs",
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
					"size-11 rounded-xl overflow-hidden shrink-0 border border-white/20 flex items-center justify-center text-white font-bold text-xs shadow-2xs",
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
				"size-11 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-100 dark:border-purple-900/40 shadow-2xs",
				className,
			)}
		>
			<IconComp className="size-5 stroke-[1.8]" />
		</div>
	);
}

export function TrackCoursesStep({
	isEdit,
	trackName,
	trackCode,
	selectedCourseIds,
	onToggleCourse,
	onClearAll,
	onBackToForm,
	onSubmit,
	isSubmitting,
	notifyWhatsApp,
	onNotifyWhatsAppChange,
	createAnother = false,
	onCreateAnotherChange,
	onClose,
}: TrackCoursesStepProps) {
	const { courses: serverCourses, isLoading: isCoursesLoading } = useCourses();
	const [searchQuery, setSearchQuery] = useState("");
	const [activeCategory, setActiveCategory] = useState<string>("ALL");

	// دمج الدورات من الخادم مع الحفاظ على صورها وأغلفتها الأصلية (coverKey)
	const allCourses = useMemo(() => {
		if (serverCourses && serverCourses.length > 0) {
			return serverCourses.map((c, idx) => {
				const fallback = SCREENSHOT_COURSES[idx % SCREENSHOT_COURSES.length];
				return {
					id: c.id,
					name: c.name,
					code: c.code || fallback.code,
					category: c.category || c.department || fallback.category,
					coverKey: c.coverKey || null,
					durationHours: c.estimatedDurationWeeks
						? c.estimatedDurationWeeks * 2
						: fallback.durationHours,
					lessonsCount: c.contentCount || fallback.lessonsCount,
					icon: fallback.icon,
					description: c.description || fallback.description,
				};
			});
		}
		return SCREENSHOT_COURSES;
	}, [serverCourses]);

	// استخراج كافة التصنيفات المتوفرة
	const availableCategories = useMemo(() => {
		const cats = new Set<string>();
		allCourses.forEach((c) => {
			if (c.category) cats.add(c.category);
		});
		return Array.from(cats);
	}, [allCourses]);

	// تصفية الدورات بناءً على البحث والتصنيف المحدد في الدروب داون
	const filteredCourses = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		return allCourses.filter((course) => {
			const matchesQuery =
				!query ||
				course.name.toLowerCase().includes(query) ||
				course.category.toLowerCase().includes(query) ||
				course.code.toLowerCase().includes(query);

			const matchesCategory =
				activeCategory === "ALL" || course.category === activeCategory;

			return matchesQuery && matchesCategory;
		});
	}, [allCourses, searchQuery, activeCategory]);

	// الدورات التي تم اختيارها فعلياً لعرضها في العمود الأيسر
	const selectedCoursesList = useMemo(() => {
		return allCourses.filter((c) => selectedCourseIds.includes(c.id));
	}, [allCourses, selectedCourseIds]);

	return (
		<div
			dir="rtl"
			className="flex flex-col h-full bg-background text-foreground overflow-hidden"
		>
			{/* 1. الترويسة العلوية للمسار ومؤشر الخطوة (RTL: التفاصيل يميناً وزر الإغلاق يساراً) */}
			<div className="flex items-center justify-between px-5 py-3 border-b border-border/70 bg-card shrink-0">
				<div className="flex items-center gap-2.5">
					<span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
						الخطوة ٢ من ٢
					</span>
					<div className="flex items-center gap-1.5 text-xs">
						<span className="text-muted-foreground">المسار:</span>
						<span className="font-bold text-foreground">{trackName || "مسار جديد"}</span>
						{trackCode && (
							<span className="px-1.5 py-0.2 rounded bg-muted text-[11px] font-mono border">
								{trackCode}
							</span>
						)}
					</div>
				</div>

				<div className="flex items-center gap-2">
					<Button
						type="button"
						variant="ghost"
						size="icon-xs"
						onClick={onClose}
						className="size-7 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
						title="إغلاق"
					>
						<IconX className="size-4" />
					</Button>
				</div>
			</div>

			{/* 2. المحتوى الرئيسي: عمودين متناسقين في الاتجاه من اليمين إلى اليسار */}
			<div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-border/70">
				{/* ================= الجانب الأيمن: قائمة الدورات المتاحة ================= */}
				<div className="flex flex-col flex-1 min-w-0 bg-background overflow-hidden">
					{/* شريط البحث وفلتر التصنيف كدروب داون مدمج */}
					<div className="px-4 py-3 border-b border-border/60 bg-card/60 flex items-center gap-2.5 shrink-0">
						{/* حقل البحث يميناً */}
						<div className="relative flex-1">
							<IconSearch className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
							<Input
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="بحث في الدورات المتاحة..."
								className="h-9 pr-9 pl-8 text-xs bg-muted/30 focus-visible:bg-background border-border/80 rounded-lg text-right"
							/>
							{searchQuery && (
								<button
									type="button"
									onClick={() => setSearchQuery("")}
									className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
								>
									<IconX className="size-3.5" />
								</button>
							)}
						</div>

						{/* فلتر التصنيفات كدروب داون أنيق يسار البحث */}
						<DropdownMenu dir="rtl">
							<DropdownMenuTrigger asChild>
								<Button
									type="button"
									variant="outline"
									size="sm"
									className="h-9 px-3 text-xs gap-1.5 rounded-lg border-border/80 bg-background hover:bg-muted font-medium shrink-0 cursor-pointer"
								>
									<IconFilter className="size-3.5 text-purple-600 dark:text-purple-400" />
									<span>
										{activeCategory === "ALL" ? "كافة التصنيفات" : activeCategory}
									</span>
									<IconChevronDown className="size-3 text-muted-foreground ms-1" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="start"
								className="w-48 p-1 rounded-xl shadow-lg border-border"
							>
								<DropdownMenuItem
									onClick={() => setActiveCategory("ALL")}
									className={cn(
										"text-xs cursor-pointer flex items-center justify-between rounded-lg px-2.5 py-1.5",
										activeCategory === "ALL" &&
											"font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/50",
									)}
								>
									<span>كافة التصنيفات</span>
									{activeCategory === "ALL" && (
										<IconCheck className="size-3.5 text-purple-600" />
									)}
								</DropdownMenuItem>
								{availableCategories.length > 0 && <DropdownMenuSeparator />}
								{availableCategories.map((cat) => (
									<DropdownMenuItem
										key={cat}
										onClick={() => setActiveCategory(cat)}
										className={cn(
											"text-xs cursor-pointer flex items-center justify-between rounded-lg px-2.5 py-1.5",
											activeCategory === cat &&
												"font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/50",
										)}
									>
										<span>{cat}</span>
										{activeCategory === cat && (
											<IconCheck className="size-3.5 text-purple-600" />
										)}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					{/* قائمة صفوف الدورات المتاحة مع اتجاه RTL من اليمين إلى اليسار */}
					<div className="flex-1 overflow-y-auto divide-y divide-border/60">
						{isCoursesLoading ? (
							<div className="flex flex-col items-center justify-center py-20 gap-2.5">
								<Spinner className="size-6 text-purple-600" />
								<span className="text-xs text-muted-foreground">جارٍ تحميل الدورات التدريبية...</span>
							</div>
						) : filteredCourses.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-16 text-center p-6 text-muted-foreground">
								<IconSchool className="size-9 text-muted-foreground/40 mb-2.5" />
								<p className="text-xs font-semibold">لم يتم العثور على دورات مطابقة للبحث</p>
								<p className="text-[11px] text-muted-foreground/70 mt-1">
									جرب البحث بكلمات أخرى أو تغيير التصنيف المختار.
								</p>
							</div>
						) : (
							filteredCourses.map((course) => {
								const isSelected = selectedCourseIds.includes(course.id);

								return (
									<div
										key={course.id}
										className={cn(
											"flex items-center justify-between p-3.5 sm:px-4.5 transition-colors gap-3 select-none",
											isSelected
												? "bg-purple-50/40 dark:bg-purple-950/20"
												: "hover:bg-muted/30 bg-card",
										)}
									>
										{/* الطرف الأيمن: صورة الغلاف الأصلية + عنوان الدورة وتفاصيلها */}
										<div className="flex items-center gap-3 min-w-0 text-right">
											{/* صورة الدورة الأصلية أو الغلاف المحمل */}
											<CourseCoverThumbnail course={course} />

											{/* نصوص الدورة */}
											<div className="min-w-0">
												<h4 className="text-xs sm:text-[13px] font-bold text-foreground truncate">
													{course.name}
												</h4>
												<div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
													<span>{course.category}</span>
													<span className="text-muted-foreground/60">•</span>
													<span>{toArabicNumerals(course.durationHours)} ساعات</span>
													<span className="text-muted-foreground/60">•</span>
													<span>
														{toArabicNumerals(course.lessonsCount)}{" "}
														{course.lessonsCount > 10 ? "درساً" : "دروس"}
													</span>
												</div>
											</div>
										</div>

										{/* الطرف الأيسر: زر الإضافة / الإلغاء */}
										<div className="shrink-0">
											{isSelected ? (
												<Button
													type="button"
													size="sm"
													onClick={() => onToggleCourse(course.id)}
													className="h-8 px-3 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60 font-semibold text-xs gap-1 cursor-pointer transition-colors"
													title="انقر للإزالة من المسار"
												>
													<IconCheck className="size-3.5 stroke-[3]" />
													<span>مضافة</span>
												</Button>
											) : (
												<Button
													type="button"
													variant="outline"
													size="sm"
													onClick={() => onToggleCourse(course.id)}
													className="h-8 px-3.5 rounded-lg border border-purple-300 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50 hover:text-purple-700 font-semibold text-xs gap-1 cursor-pointer transition-colors bg-white dark:bg-card shadow-2xs"
												>
													<IconPlus className="size-3.5 stroke-[2.5]" />
													<span>إضافة</span>
												</Button>
											)}
										</div>
									</div>
								);
							})
						)}
					</div>

					{/* شريط الإحصائية السفلي الأيمن: ٨ دورات متاحة */}
					<div className="px-4 py-2.5 border-t border-border/60 bg-muted/10 shrink-0 flex items-center justify-start gap-1.5 text-xs text-muted-foreground">
						<IconInfoCircle className="size-3.5 text-muted-foreground/80" />
						<span>{toArabicNumerals(filteredCourses.length)} دورات متاحة</span>
					</div>
				</div>

				{/* ================= الجانب الأيسر: الدورات المختارة ================= */}
				<div className="flex flex-col w-full md:w-[320px] lg:w-[350px] shrink-0 bg-muted/10 dark:bg-card/40 overflow-hidden">
					{/* الحالة الفارغة المطابقة تماماً للصورة عندما لا توجد دورات مختارة */}
					{selectedCoursesList.length === 0 ? (
						<div className="flex-1 flex flex-col items-center justify-center text-center p-6 select-none my-auto">
							<IconPlus className="size-10 text-muted-foreground/35 stroke-[1.5] mb-3" />
							<p className="text-xs font-bold text-muted-foreground/80 leading-relaxed">
								لم تختر أي دورة بعد
							</p>
							<p className="text-[11px] text-muted-foreground/70 mt-0.5">
								أضف الدورات من القائمة المقابلة
							</p>
						</div>
					) : (
						/* قائمة الدورات المختارة */
						<div className="flex-1 flex flex-col min-h-0 overflow-hidden">
							<div className="px-4 py-3 border-b border-border/60 bg-card/60 flex items-center justify-between shrink-0">
								<div className="flex items-center gap-1.5">
									<span className="text-xs font-bold text-foreground">الدورات المختارة</span>
									<span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold">
										{toArabicNumerals(selectedCoursesList.length)}
									</span>
								</div>
								<button
									type="button"
									onClick={onClearAll}
									className="text-[11px] text-muted-foreground hover:text-destructive cursor-pointer transition-colors"
								>
									إفراغ
								</button>
							</div>

							<div className="flex-1 overflow-y-auto p-3 space-y-2.5">
								{selectedCoursesList.map((course) => (
									<div
										key={course.id}
										className="p-2.5 rounded-xl border border-border/80 bg-card hover:border-purple-200 dark:hover:border-purple-800 transition-all shadow-2xs flex items-center justify-between gap-2.5 group select-none"
									>
										{/* الطرف الأيمن: الغلاف الأصلي + تفاصيل الدورة المختارة */}
										<div className="flex items-center gap-2.5 min-w-0 text-right">
											<CourseCoverThumbnail course={course} className="size-9 rounded-lg" />
											<div className="min-w-0">
												<h5 className="text-xs font-bold text-foreground truncate">
													{course.name}
												</h5>
												<span className="text-[10px] text-muted-foreground block truncate">
													{toArabicNumerals(course.durationHours)} ساعات •{" "}
													{toArabicNumerals(course.lessonsCount)} دروس
												</span>
											</div>
										</div>

										{/* الطرف الأيسر: زر الحذف السريع X */}
										<button
											type="button"
											onClick={() => onToggleCourse(course.id)}
											className="text-muted-foreground hover:text-destructive p-1.5 rounded-md hover:bg-destructive/10 transition-colors shrink-0 cursor-pointer"
											title="إزالة هذه الدورة"
										>
											<IconX className="size-4" />
										</button>
									</div>
								))}
							</div>
						</div>
					)}

					{/* التذييل الأيسر: (i) يمكنك إزالة أي دورة قبل المتابعة */}
					<div className="px-4 py-2.5 border-t border-border/60 bg-card/60 shrink-0 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground text-center">
						<IconInfoCircle className="size-3.5 text-muted-foreground/80 shrink-0" />
						<span>يمكنك إزالة أي دورة قبل المتابعة</span>
					</div>
				</div>
			</div>

			{/* 3. شريط الإجراءات والفوتر الموحد */}
			<div className="p-3 border-t border-border/70 bg-muted/20 shrink-0 flex items-center justify-between gap-3">
				{/* الطرف الأيمن (في RTL): زر الرجوع لتعديل البيانات */}
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={onBackToForm}
					disabled={isSubmitting}
					className="gap-1.5 text-xs font-medium h-9 rounded-lg border-border/80 hover:bg-muted cursor-pointer"
				>
					<IconArrowRight className="size-3.5" />
					<span>رجوع لتعديل البيانات</span>
				</Button>

				{/* الطرف الأيسر (في RTL): الواتساب وزر الحفظ النهائي */}
				<div className="flex items-center gap-3">
					<div className="flex items-center gap-2 text-xs text-muted-foreground select-none">
						<IconBrandWhatsapp className="size-4 text-emerald-600" />
						<span className="hidden sm:inline">إشعار عبر الواتساب</span>
						<Switch
							checked={notifyWhatsApp}
							onCheckedChange={onNotifyWhatsAppChange}
							disabled={isSubmitting}
						/>
					</div>

					{!isEdit && onCreateAnotherChange && (
						<div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground select-none border-r border-border/60 pr-3">
							<span>متابعة إنشاء مسار آخر</span>
							<Switch
								checked={createAnother}
								onCheckedChange={onCreateAnotherChange}
								disabled={isSubmitting}
							/>
						</div>
					)}

					<Button
						type="button"
						size="sm"
						onClick={onSubmit}
						disabled={isSubmitting}
						className="gap-1.5 h-9 font-semibold transition-all shadow-xs bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4.5 cursor-pointer"
					>
						{isSubmitting && <Spinner className="size-3.5" />}
						<span>{isEdit ? "حفظ التعديلات" : "إنشاء المسار ⤶"}</span>
						<kbd className="text-[10px] bg-white/20 text-white rounded px-1.5 py-0.5 font-mono hidden sm:inline-block">
							⌘ ↵
						</kbd>
					</Button>
				</div>
			</div>
		</div>
	);
}
