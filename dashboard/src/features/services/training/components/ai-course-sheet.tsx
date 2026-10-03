import {
	IconArrowRight,
	IconCheck,
	IconLink,
	IconSparkles,
	IconVideo,
	IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
	AI_DEPTH_OPTIONS,
	AI_DIFFICULTY_OPTIONS,
	AI_LEVEL_COUNT_OPTIONS,
	COURSE_TYPE_OPTIONS,
} from "@/features/services/training/data/training";
import { useAiCourse } from "@/features/services/training/hooks/use-ai-course";
import { cn } from "@/lib/utils";
import type { AiCoursePreview, AiGenerateOptions } from "@/server/training/training.type";

const LANG_OPTIONS = [
	{ value: "AR", label: "العربية" },
	{ value: "EN", label: "الإنجليزية" },
] as const;

const DEFAULT_OPTIONS: AiGenerateOptions = {
	levelCount: 3,
	difficulty: "BEGINNER",
	language: "AR",
	courseType: "INTERNAL",
	includeQuizzes: true,
	depth: "BALANCED",
	suggestMedia: false,
};

const isVideoUrl = (url: string) => /youtube\.com|youtu\.be|vimeo\.com/i.test(url);

// كل الروابط/الفيديوهات المقترحة في الدورة (لعدّها في الهينت)
function countResources(course: AiCoursePreview): number {
	let n = 0;
	for (const level of course.levels)
		for (const unit of level.units)
			for (const lesson of unit.lessons)
				n += lesson.resources.filter((r) => r.url.trim()).length;
	return n;
}

// لوحة جانبية «إنشاء دورة بالذكاء الاصطناعي» — إعدادات ثم معاينة قبل الحفظ.
// «توليد الدورة» يُظهر المعاينة (بلا حفظ)، و«تطبيق وحفظ» يحفظ كمسودّة ويستدعي onCreated
// فتظهر الدورة (بروابطها المضافة للمحتوى) داخل باني الدورة.
export function AiCourseSheet({
	open,
	onClose,
	onCreated,
}: {
	open: boolean;
	onClose: () => void;
	onCreated: (courseId: string) => void;
}) {
	const { generate, isGenerating, save, isSaving } = useAiCourse();

	const [brief, setBrief] = useState("");
	const [opts, setOpts] = useState<AiGenerateOptions>(DEFAULT_OPTIONS);
	const [preview, setPreview] = useState<AiCoursePreview | null>(null);

	const setOpt = <K extends keyof AiGenerateOptions>(key: K, value: AiGenerateOptions[K]) =>
		setOpts((prev) => ({ ...prev, [key]: value }));

	const reset = () => {
		setBrief("");
		setOpts(DEFAULT_OPTIONS);
		setPreview(null);
	};
	const close = () => {
		reset();
		onClose();
	};

	// توليد المعاينة فقط (بلا حفظ) — تظهر الروابط المكتشفة قبل التطبيق
	const runGenerate = async () => {
		if (!brief.trim()) return;
		try {
			const result = await generate({ brief: brief.trim(), options: opts });
			setPreview(result);
		} catch (e) {
			toast.error((e as Error).message);
		}
	};

	// تطبيق: حفظ كمسودّة (يُضيف الروابط لمحتوى الفصول) ثم فتح الباني
	const confirmSave = async () => {
		if (!preview) return;
		try {
			const { id } = await save(preview);
			toast.success("تم تطبيق الدورة وحفظها كمسودّة");
			reset();
			onCreated(id);
		} catch (e) {
			toast.error((e as Error).message);
		}
	};

	const totalUnits = preview?.levels.reduce((n, l) => n + l.units.length, 0) ?? 0;
	const totalResources = preview ? countResources(preview) : 0;

	return (
		<Sheet
			open={open}
			onOpenChange={(next) => {
				if (!next) close();
			}}
		>
			<SheetContent
				side="left"
				showCloseButton={false}
				// بلا تعتيم — لوحة إعدادات ضيّقة (عرض 460) تقف يمين لوحة الدورة بلا تضييقها.
				// 1588 = left-2 (8px) + أقصى عرض للوحة الدورة في الخطوة 2 (1574px) + فراغ 6px
				// بين اللوحتين؛ وعلى الشاشات الأضيق يقصّها calc(100vw - 468px) فتبقى ظاهرة بالكامل.
				showOverlay={false}
				className="flex w-full! flex-col gap-0 border-e-0 border-s-[0.75px] border-s-[#E5E5E5] p-0 shadow-[0_0_40px_rgba(0,0,0,0.16)] left-[min(1588px,calc(100vw-468px))]! sm:max-w-[460px]!"
			>
				<div
					dir="rtl"
					className="flex min-h-0 flex-1 flex-col"
				>
					{/* الهيدر */}
					<div className="flex h-11 shrink-0 items-center justify-between border-b border-[#E5E5E5] px-3">
						<SheetTitle className="flex items-center gap-1.5 text-[13px] font-bold text-[#08090A]">
							<span className="flex size-6 items-center justify-center rounded-[6px] bg-primary/10 text-primary">
								<IconSparkles className="size-3.5" />
							</span>
							إنشاء دورة بالذكاء الاصطناعي
						</SheetTitle>

						<button
							type="button"
							onClick={close}
							aria-label="إغلاق"
							className="flex size-7 items-center justify-center rounded-[6px] text-[#9B9B9D] hover:bg-muted"
						>
							<IconX className="size-[15px]" />
						</button>
					</div>

					{preview ? (
						/* ===== المعاينة: هينت الروابط + هيكل الدورة ===== */
						<div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
							{/* هينت الروابط/الفيديوهات المكتشفة */}
							<div className="flex items-start gap-2 rounded-[6px] border border-primary/20 bg-primary/5 px-3 py-2.5">
								<IconLink className="mt-0.5 size-4 shrink-0 text-primary" />
								<div className="flex flex-col gap-0.5">
									<span className="text-[12px] font-semibold text-primary">
										{totalResources > 0
											? `تم العثور على ${totalResources} رابط/فيديو حقيقي`
											: "تمت معاينة الدورة"}
									</span>
									<span className="text-[11px] leading-5 text-[#6B6B67]">
										{totalResources > 0
											? "اضغط «تطبيق وحفظ» لإضافة الروابط والفيديوهات إلى محتوى فصول الدورة."
											: "اضغط «تطبيق وحفظ» لحفظ الدورة وفتحها في الباني للمراجعة."}
									</span>
								</div>
							</div>

							{/* ملخص الدورة */}
							<div className="flex flex-col gap-1">
								<span className="text-[14px] font-bold text-[#08090A]">{preview.name}</span>
								<span className="text-[11px] text-[#9B9B9D]">
									{preview.levels.length} مستويات • {totalUnits} وحدة
								</span>
								{preview.description && (
									<p className="text-[12px] leading-5 text-[#6B6B67]">{preview.description}</p>
								)}
							</div>

							{/* المستويات → الوحدات → الروابط */}
							{preview.levels.map((level, li) => (
								<div
									key={`${level.name}-${li}`}
									className="flex flex-col gap-2 rounded-[8px] border border-[#E5E5E5] p-3"
								>
									<span className="text-[12px] font-bold text-[#08090A]">
										{li + 1}. {level.name}
									</span>
									<div className="flex flex-col gap-1.5">
										{level.units.map((unit, ui) => {
											const links = unit.lessons
												.flatMap((l) => l.resources)
												.filter((r) => r.url.trim());
											return (
												<div
													key={`${unit.title}-${ui}`}
													className="flex flex-col gap-1.5 rounded-[6px] bg-[#FAFAFC] px-2.5 py-1.5"
												>
													<div className="flex items-center justify-between gap-2">
														<span className="truncate text-[12px] text-[#08090A]">
															{unit.title}
														</span>
														<span className="shrink-0 text-[11px] text-[#9B9B9D]">
															{unit.lessons.length} فصل
														</span>
													</div>
													{links.length > 0 && (
														<div className="flex flex-col gap-1 border-t border-[#EDEDF2] pt-1.5">
															{links.map((r, ri) => {
																const video = isVideoUrl(r.url);
																return (
																	<a
																		key={`${r.url}-${ri}`}
																		href={r.url}
																		target="_blank"
																		rel="noopener noreferrer"
																		className="flex items-center gap-1.5 text-[11px] text-primary hover:underline"
																	>
																		{video ? (
																			<IconVideo className="size-3 shrink-0" />
																		) : (
																			<IconLink className="size-3 shrink-0" />
																		)}
																		<span className="truncate">{r.title || r.url}</span>
																	</a>
																);
															})}
														</div>
													)}
												</div>
											);
										})}
									</div>
								</div>
							))}

							{/* إعادة التوليد بنفس الموجز والإعدادات */}
							<button
								type="button"
								onClick={() => setPreview(null)}
								className="flex h-8 w-fit items-center gap-1.5 rounded-[6px] border-[0.75px] border-[#E5E5E5] px-3 text-[12px] font-medium text-[#08090A] hover:bg-muted"
							>
								<IconArrowRight className="size-3.5" />
								رجوع للإعدادات
							</button>
						</div>
					) : (
						/* ===== الإعدادات ===== */
						<div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
							{/* الموجز */}
							<div className="flex flex-col gap-2">
								<span className="text-[12px] font-semibold text-[#08090A]">
									صف الدورة التي تريد إنشاءها
								</span>
								<Textarea
									autoFocus
									value={brief}
									onChange={(e) => setBrief(e.target.value)}
									placeholder="مثال: دورة تدريبية لفريق الاستقبال حول التعامل مع أصحاب الأطفال وحالات الطوارئ..."
									className="min-h-[120px] text-[13px]"
									disabled={isGenerating}
								/>
								<p className="text-[11px] leading-5 text-[#9B9B9D]">
									اكتب فكرة الدورة، اضبط الإعدادات بالأسفل، ثم اضغط «توليد الدورة» لعرض معاينة
									قبل التطبيق.
								</p>
							</div>

							{/* إعدادات التوليد */}
							<div className="flex flex-col gap-3">
								<span className="text-[12px] font-bold text-[#08090A]">إعدادات التوليد</span>

								<div className="grid grid-cols-2 gap-3">
									<SelectRow
										label="عدد المستويات"
										desc="كم مستوى/محور تريد في هيكل الدورة."
										value={String(opts.levelCount ?? "")}
										onChange={(v) => setOpt("levelCount", Number(v))}
										options={AI_LEVEL_COUNT_OPTIONS.map((n) => ({
											value: String(n),
											label: String(n),
										}))}
									/>
									<SelectRow
										label="مستوى الصعوبة"
										desc="مستوى خبرة المتدربين المستهدفين."
										value={opts.difficulty ?? ""}
										onChange={(v) =>
											setOpt("difficulty", v as AiGenerateOptions["difficulty"])
										}
										options={AI_DIFFICULTY_OPTIONS.map((o) => ({ ...o }))}
									/>
									<SelectRow
										label="نوع الدورة"
										desc="تصنيف الدورة التدريبية."
										value={opts.courseType ?? ""}
										onChange={(v) =>
											setOpt("courseType", v as AiGenerateOptions["courseType"])
										}
										options={COURSE_TYPE_OPTIONS.map((o) => ({ ...o }))}
									/>
									<SelectRow
										label="لغة المحتوى"
										desc="لغة توليد المحتوى."
										value={opts.language ?? ""}
										onChange={(v) => setOpt("language", v as AiGenerateOptions["language"])}
										options={LANG_OPTIONS.map((o) => ({ ...o }))}
									/>
									<SelectRow
										label="عمق المحتوى"
										desc="مقدار التفصيل في نصّ كل فصل."
										value={opts.depth ?? ""}
										onChange={(v) => setOpt("depth", v as AiGenerateOptions["depth"])}
										options={AI_DEPTH_OPTIONS.map((o) => ({ ...o }))}
									/>
								</div>

								{/* مبدّل تضمين الاختبارات */}
								<ToggleRow
									label="تضمين اختبارات"
									desc="إضافة وحدة اختبار في نهاية كل مستوى."
									checked={opts.includeQuizzes ?? true}
									onCheckedChange={(v) => setOpt("includeQuizzes", v)}
								/>

								{/* ===== متقدّم ===== */}
								<div className="flex items-center gap-2 pt-1">
									<span className="text-[11px] font-bold text-[#6B6B67]">متقدّم</span>
									<span className="h-px flex-1 bg-[#E5E5E5]" />
								</div>
								<ToggleRow
									icon={<IconLink className="size-3.5 text-primary" />}
									label="بحث عن روابط وفيديوهات حقيقية"
									desc="يبحث الذكاء في الويب عن مصادر وفيديوهات حقيقية مرتبطة بالدورة (قد يضيف وقتًا للتوليد)."
									checked={opts.suggestMedia ?? false}
									onCheckedChange={(v) => setOpt("suggestMedia", v)}
								/>
							</div>
						</div>
					)}

					{/* التذييل — الإجراء الأساسي أسفل اللوحة (يسارًا في تدفّق RTL كباقي لوحات التطبيق) */}
					<div className="flex shrink-0 items-center justify-end border-t border-[#E5E5E5] px-3 py-2.5">
						{preview ? (
							<PrimaryBtn
								onClick={confirmSave}
								disabled={isSaving}
								icon={<IconCheck className="size-3.5" />}
								label={isSaving ? "جارٍ التطبيق..." : "تطبيق وحفظ"}
							/>
						) : (
							<PrimaryBtn
								onClick={runGenerate}
								disabled={!brief.trim() || isGenerating}
								icon={<IconSparkles className="size-3.5" />}
								label={isGenerating ? "جارٍ التوليد..." : "توليد الدورة"}
							/>
						)}
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}

// صفّ اختيار من قائمة — الوسم والوصف ثم القائمة بعرض كامل
function SelectRow({
	label,
	desc,
	value,
	onChange,
	options,
}: {
	label: string;
	desc: string;
	value: string;
	onChange: (value: string) => void;
	options: { value: string; label: string }[];
}) {
	return (
		<div className="flex flex-col gap-1.5 rounded-[6px] border border-[#E5E5E5] bg-white px-3 py-2.5">
			<div className="flex flex-col gap-0.5">
				<span className="text-[12px] font-semibold text-[#08090A]">{label}</span>
				<span className="text-[10px] leading-4 text-[#9B9B9D]">{desc}</span>
			</div>
			<Select
				dir="rtl"
				value={value}
				onValueChange={onChange}
			>
				<SelectTrigger className="h-8! w-full text-[12px]">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{options.map((o) => (
						<SelectItem
							key={o.value}
							value={o.value}
						>
							{o.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}

// صفّ مبدّل (Switch) بوسم ووصف
function ToggleRow({
	label,
	desc,
	checked,
	onCheckedChange,
	icon,
}: {
	label: string;
	desc: string;
	checked: boolean;
	onCheckedChange: (value: boolean) => void;
	icon?: React.ReactNode;
}) {
	return (
		<div className="flex items-start justify-between gap-2 rounded-[6px] border border-[#E5E5E5] bg-white px-3 py-2.5">
			<div className="flex min-w-0 flex-col gap-0.5">
				<span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#08090A]">
					{icon}
					{label}
				</span>
				<span className="text-[10px] leading-4 text-[#9B9B9D]">{desc}</span>
			</div>
			<Switch
				checked={checked}
				onCheckedChange={onCheckedChange}
				aria-label={label}
			/>
		</div>
	);
}

function PrimaryBtn({
	onClick,
	disabled,
	label,
	icon,
}: {
	onClick: () => void;
	disabled?: boolean;
	label: string;
	icon: React.ReactNode;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={cn(
				"flex h-[27px] items-center gap-1.5 rounded-[6px] px-3 text-[11px] font-semibold primarytransition-colors",
				disabled ? "cursor-not-allowed bg-primary/40" : "bg-primary hover:bg-primary/90",
			)}
		>
			{icon}
			{label}
		</button>
	);
}
