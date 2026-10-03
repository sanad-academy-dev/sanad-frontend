import {
	IconBolt,
	IconChevronDown,
	IconClock,
	IconLayoutSidebarLeftCollapse,
	IconPlus,
	IconSchool,
	IconSparkles,
	IconWorld,
} from "@tabler/icons-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type {
	CourseContentType,
	CourseDetailResponse,
	RestoredLessonInput,
} from "@/server/training/training.type";
import { COURSE_TYPE_OPTIONS } from "../../data/training";
import { useCourseContent } from "../../hooks/use-course-content";
import { useCourseLevels } from "../../hooks/use-course-levels";
import { useUpdateCourse } from "../../hooks/use-courses";
import { useReorderContents } from "../../hooks/use-reorder-contents";
import { ContentDnd } from "./content-dnd";
import { ContentTypeDialog } from "./content-type-dialog";

const PRIORITY_LABEL = { URGENT: "عاجل", NORMAL: "غير عاجل" } as const;
const LANGUAGE_LABEL = { AR: "العربية", EN: "الإنجليزية" } as const;

// عنوان البطاقة الافتراضي حسب النوع المختار من المنتقي
const DEFAULT_TITLE: Record<CourseContentType, string> = {
	PAGE: "صفحة جديدة",
	LESSON: "درس جديد",
	QUIZ: "اختبار جديد",
};

// فصل مبدئي يُنشأ مع البطاقة حسب النوع — الصفحة نصّ، والاختبار اختبار فارغ.
// الدرس بلا فصل مبدئي (يختار المستخدم نوع المادة في نموذج الفصل).
function seedLessons(type: CourseContentType): RestoredLessonInput[] | undefined {
	if (type === "PAGE") return [{ title: "صفحة جديدة", type: "TEXT", content: "" }];
	if (type === "QUIZ")
		return [
			{ title: "اختبار جديد", type: "QUIZ", content: JSON.stringify({ questions: [] }) },
		];
	return undefined;
}

function Chip({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
	return (
		<span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-[#6B6B67] ring-1 ring-[#E7E7EE]">
			{icon}
			{children}
		</span>
	);
}

export function StepContent({
	course,
	courseId,
}: {
	course: CourseDetailResponse | undefined;
	courseId: string;
}) {
	const [previewOpen, setPreviewOpen] = useState(true);
	// منتقي نوع المحتوى — نحتفظ بدالة resolve للوعد الجاري حتى يختار المستخدم أو يُلغي
	const [picker, setPicker] = useState<{
		resolve: (type: CourseContentType | null) => void;
	} | null>(null);
	// آخر بطاقة أُنشئت — تُفتح موسّعة تلقائيًا للتحرير مباشرة بعد الإنشاء
	const [justCreatedId, setJustCreatedId] = useState<string | null>(null);
	const { addContent } = useCourseContent(courseId);
	const { addLevel, renameLevel, removeLevel } = useCourseLevels(courseId);
	const { updateCourse } = useUpdateCourse(courseId);
	const { reorderContents } = useReorderContents(courseId);

	if (!course) return null;

	const levels = course.levels ?? [];
	const units = course.units ?? [];
	const typeLabel =
		COURSE_TYPE_OPTIONS.find((t) => t.value === course.type)?.label ?? course.type;

	const isEmpty = units.length === 0 && levels.length === 0;

	// يفتح منتقي نوع المحتوى ويعيد وعدًا يُحَل بالنوع المختار (أو null عند الإلغاء)
	const pickContentType = () =>
		new Promise<CourseContentType | null>((resolve) => setPicker({ resolve }));

	// إنشاء بطاقة في نهاية المستوى وإرجاعها (يستخدمها ContentDnd للإدراج بموضع محدّد).
	// يفتح المنتقي أولًا؛ يُلغى الإنشاء إن أغلق المستخدم دون اختيار.
	const handleAddContent = async (levelId: string | null) => {
		const contentType = await pickContentType();
		if (!contentType) return undefined;
		const created = await addContent({
			title: DEFAULT_TITLE[contentType],
			levelId,
			contentType,
			lessons: seedLessons(contentType),
		}).catch(() => undefined);
		if (created) setJustCreatedId(created.id);
		return created;
	};

	return (
		<div className="mx-auto flex w-full max-w-[1280px] gap-5 px-4 py-6">
			{/* ===== المُنشئ (يمين في RTL) ===== */}
			<div className="flex min-w-0 flex-1 flex-col gap-5">
				{/* ترويسة الدورة + الوسوم */}
				<div className="flex items-start gap-3 rounded-2xl border border-[#E7E7EE] bg-white p-4 shadow-[0_1px_2px_rgba(16,16,24,0.04)]">
					<span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
						<IconSchool className="size-6" />
					</span>
					<div className="flex min-w-0 flex-1 flex-col gap-1.5">
						<div className="flex items-center gap-2">
							<span className="truncate text-[15px] font-bold text-[#08090A]">
								{course.name}
							</span>
							<span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
								{typeLabel}
							</span>
						</div>
						{course.description && (
							<p className="line-clamp-2 text-[12px] leading-5 text-[#6B6B67]">
								{course.description}
							</p>
						)}
						<div className="flex flex-wrap items-center gap-1.5 pt-0.5">
							{course.category && <Chip>{course.category}</Chip>}
							<Chip
								icon={
									<IconBolt
										className={cn(
											"size-3",
											course.priority === "URGENT" ? "text-[#DC2626]" : "text-[#9B9B9D]",
										)}
									/>
								}
							>
								{PRIORITY_LABEL[course.priority]}
							</Chip>
							{course.estimatedDurationWeeks != null && (
								<Chip icon={<IconClock className="size-3" />}>
									{course.estimatedDurationWeeks} أسابيع
								</Chip>
							)}
							<Chip icon={<IconWorld className="size-3" />}>
								{LANGUAGE_LABEL[course.language]}
							</Chip>
						</div>
					</div>
				</div>

				{/* شريط الأدوات: ترتيب المحتوى + AI + إضافة مستوى */}
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div className="flex items-center gap-2">
						<span className="text-[12px] text-[#6B6B67]">الترتيب حسب:</span>
						<Select
							dir="rtl"
							value={course.orderMode}
							onValueChange={(v) =>
								updateCourse({ orderMode: v as CourseDetailResponse["orderMode"] })
							}
						>
							<SelectTrigger className="h-8! w-[130px] text-[12px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="SEQUENTIAL">تسلسلي</SelectItem>
								<SelectItem value="FREE">حر</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="h-8 gap-1.5 rounded-lg border-primary/40 text-[12px] text-primary"
						>
							<IconSparkles className="size-3.5" />
							إنشاء دورة بـ AI
						</Button>
						<Button
							type="button"
							size="sm"
							onClick={() => addLevel("مستوى جديد")}
							className="h-8 gap-1.5 rounded-lg text-[12px]"
						>
							<IconPlus className="size-4" />
							إضافة مستوى
						</Button>
					</div>
				</div>

				{/* المحتوى مجمَّعًا حسب المستوى — مع سحب وإدراج بموضع محدّد */}
				{isEmpty ? (
					<div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[#D4D4DE] bg-white py-12 text-center">
						<IconSchool className="size-8 text-[#C4C4CC]" />
						<p className="text-[13px] font-semibold text-[#08090A]">ابدأ ببناء دورتك</p>
						<p className="max-w-[320px] text-[12px] leading-5 text-[#6B6B67]">
							أضف مستوى ثم بطاقات محتوى (صفحات، دروس، اختبارات) لتكوين هيكل الدورة.
						</p>
						<Button
							type="button"
							size="sm"
							onClick={() => handleAddContent(null)}
							className="h-9 gap-1.5 rounded-lg text-[12px]"
						>
							<IconPlus className="size-4" />
							إضافة أول محتوى
						</Button>
					</div>
				) : (
					<ContentDnd
						course={course}
						courseId={courseId}
						levels={levels}
						autoOpenUnitId={justCreatedId}
						onAddContent={handleAddContent}
						onRenameLevel={renameLevel}
						onRemoveLevel={removeLevel}
						reorderContents={reorderContents}
					/>
				)}
			</div>

			{/* منتقي «إنشاء محتوى جديد» — يُحَل وعد pickContentType عند الاختيار/الإلغاء */}
			<ContentTypeDialog
				open={!!picker}
				onClose={() => {
					picker?.resolve(null);
					setPicker(null);
				}}
				onSelect={(type) => {
					picker?.resolve(type);
					setPicker(null);
				}}
			/>

			{/* ===== المعاينة (يسار في RTL) — قابلة للطي ===== */}
			{previewOpen ? (
				<div className="hidden w-[340px] shrink-0 flex-col gap-3 lg:flex">
					<div className="flex items-center justify-between">
						<span className="text-[12px] font-bold text-[#08090A]">معاينة الدورة</span>
						<button
							type="button"
							onClick={() => setPreviewOpen(false)}
							aria-label="طي المعاينة"
							className="text-[#9B9B9D]"
						>
							<IconLayoutSidebarLeftCollapse className="size-4" />
						</button>
					</div>
					<div className="flex flex-col overflow-hidden rounded-2xl border border-[#E7E7EE] bg-white shadow-[0_1px_2px_rgba(16,16,24,0.04)]">
						<div className="flex h-24 items-end bg-primary/25 p-3">
							<span className="text-[13px] font-bold primarydrop-shadow">
								{course.name}
							</span>
						</div>
						<div className="flex flex-col gap-3 p-4">
							{units.some((u) => u.lessons.length > 0) ? (
								units.map((u) => (
									<div
										key={u.id}
										className="flex flex-col gap-1"
									>
										<span className="text-[12px] font-semibold text-[#08090A]">{u.title}</span>
										<ol className="flex flex-col gap-1">
											{u.lessons.map((l, i) => (
												<li
													key={l.id}
													className="flex items-center gap-2 rounded-lg bg-[#FAFAFC] px-2.5 py-1.5 text-[11px] text-[#08090A]"
												>
													<span className="tabular-nums text-[#9B9B9D]">{i + 1}.</span>
													{l.title}
												</li>
											))}
										</ol>
									</div>
								))
							) : (
								<p className="py-6 text-center text-[11px] leading-5 text-[#9B9B9D]">
									بعد إضافة أول محتوى ستظهر هنا معاينة مباشرة لطريقة عرض الدورة للموظفين.
								</p>
							)}
						</div>
					</div>
				</div>
			) : (
				<button
					type="button"
					onClick={() => setPreviewOpen(true)}
					className="hidden h-9 shrink-0 items-center gap-1.5 self-start rounded-lg border border-[#E7E7EE] bg-white px-3 text-[12px] text-[#6B6B67] lg:flex"
				>
					<IconChevronDown className="size-4 rotate-90" />
					إظهار المعاينة
				</button>
			)}
		</div>
	);
}
