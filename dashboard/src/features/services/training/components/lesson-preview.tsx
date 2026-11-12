import { parseQuizContent } from "@sanad/contracts/runtime/server/training/training.type";
import {
	IconAlignRight,
	IconCheckbox,
	IconClock,
	IconExternalLink,
	IconFileCheck,
	IconFileDiff,
	IconFileText,
	IconMicrophone,
	IconVideoPlus,
} from "@tabler/icons-react";
import type { ReactNode } from "react";
import { getFileUrl } from "@/lib/file-url";
import { cn } from "@/lib/utils";
import type {
	LessonContentItem,
	LessonResponse,
	LessonType,
} from "@/server/training/training.type";
import { CoursePageContent } from "./course-page-content";

const TYPE_META: Record<LessonType, { label: string; Icon: typeof IconAlignRight }> = {
	TEXT: { label: "نص", Icon: IconAlignRight },
	PAGE: { label: "صفحة", Icon: IconFileText },
	VIDEO: { label: "فيديو", Icon: IconVideoPlus },
	DOCUMENT: { label: "مستند", Icon: IconFileDiff },
	QUIZ: { label: "تقييم", Icon: IconFileCheck },
	SURVEY: { label: "استبيان", Icon: IconCheckbox },
	AUDIO: { label: "صوت", Icon: IconMicrophone },
};

// مدة الدرس بصيغة عربية مختصرة (ساعة/دقيقة/ثانية)
function formatDuration(totalSeconds: number | null | undefined): string | null {
	if (!totalSeconds) return null;
	const h = Math.floor(totalSeconds / 3600);
	const m = Math.floor((totalSeconds % 3600) / 60);
	const s = totalSeconds % 60;
	const parts = [h ? `${h} س` : null, m ? `${m} د` : null, !h && s ? `${s} ث` : null].filter(
		Boolean,
	);
	return parts.length ? parts.join(" ") : null;
}

// رابط تضمين لمنصّات الفيديو الشائعة — يعيد null لأي رابط آخر (يُشغَّل كملف مباشر)
function embedUrl(url: string): string | null {
	const yt = url.match(
		/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/,
	);
	if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
	const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
	if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
	return null;
}

// مصدر وسيط الدرس: ملف مرفوع (mediaKey) أو رابط خارجي (mediaUrl)
function mediaHref(lesson: LessonResponse): string | null {
	if (lesson.mediaSource === "URL") return lesson.mediaUrl?.trim() || null;
	return getFileUrl(lesson.mediaKey) ?? lesson.mediaUrl?.trim() ?? null;
}

const fileName = (key: string | null | undefined) =>
	key
		?.split("/")
		.pop()
		?.replace(/^[\w-]{8,}_/, "") ?? "المستند";

// إطار العارض الموحّد — نفس هوية بقية واجهات النظام: حدّ وزوايا وشريط علوي خفيف.
// كل أنواع المعاينة (مستند/فيديو/صوت) تُعرض داخله فيبدو المحتوى جزءًا من النظام لا عنصرًا خامًا.
function ViewerFrame({
	label,
	href,
	tone = "default",
	children,
}: {
	label: string;
	href?: string | null;
	tone?: "default" | "dark";
	children: ReactNode;
}) {
	return (
		<div className="overflow-hidden rounded-lg border border-border bg-card">
			<div className="flex items-center justify-between gap-2 border-b border-border bg-muted/40 px-2.5 py-1.5">
				<span className="min-w-0 truncate text-[11px] font-medium text-muted-foreground">
					{label}
				</span>
				{href && (
					<a
						href={href}
						target="_blank"
						rel="noopener noreferrer"
						className="flex shrink-0 items-center gap-1 rounded-[4px] px-1.5 py-0.5 text-[10px] font-medium text-primary hover:bg-primary/10"
					>
						فتح
						<IconExternalLink className="size-3" />
					</a>
				)}
			</div>
			<div className={cn(tone === "dark" ? "bg-foreground/90" : "bg-background")}>
				{children}
			</div>
		</div>
	);
}

// حالة «لا محتوى بعد» داخل بطاقة الدرس
function Missing({ text }: { text: string }) {
	return (
		<div className="rounded-lg border border-dashed border-border px-3 py-5 text-center text-[11px] text-muted-foreground">
			{text}
		</div>
	);
}

// جسم المعاينة حسب نوع الدرس — كما سيراه الموظف قبل النشر
function SingleLessonBody({
	lesson,
	preferredPageId,
}: {
	lesson: LessonResponse;
	preferredPageId?: string | null;
}) {
	const href = mediaHref(lesson);
	const sourceLabel =
		lesson.mediaSource === "URL" ? (lesson.mediaUrl ?? "") : fileName(lesson.mediaKey);

	if (lesson.type === "TEXT" || lesson.type === "PAGE") {
		const trimmed = lesson.content?.trim() ?? "";
		if (!trimmed) {
			return (
				<Missing
					text={lesson.type === "PAGE" ? "لا يوجد محتوى للصفحة بعد." : "لا يوجد نصّ للدرس بعد."}
				/>
			);
		}
		const isRichBlocks =
			lesson.type === "PAGE" ||
			trimmed.startsWith('{"version":1,"pages":') ||
			trimmed.startsWith("[");
		return (
			<div className="rounded-lg border border-border bg-background px-3 py-2.5 text-[12px] leading-6 text-foreground/85">
				{isRichBlocks ? (
					<CoursePageContent
						content={trimmed}
						preferredPageId={preferredPageId}
					/>
				) : (
					<p className="whitespace-pre-wrap">{trimmed}</p>
				)}
			</div>
		);
	}

	if (lesson.type === "VIDEO") {
		if (!href) return <Missing text="لم يُضف فيديو بعد." />;
		const embed = embedUrl(href);
		return (
			<ViewerFrame
				label={sourceLabel || "فيديو الدرس"}
				href={href}
				tone="dark"
			>
				{embed ? (
					<iframe
						src={embed}
						title={lesson.title}
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
						allowFullScreen
						className="aspect-video w-full"
					/>
				) : (
					// biome-ignore lint/a11y/useMediaCaption: معاينة لمحتوى يرفعه المستخدم بلا ترجمات
					<video
						src={href}
						controls
						className="aspect-video w-full"
					/>
				)}
			</ViewerFrame>
		);
	}

	if (lesson.type === "AUDIO") {
		if (!href) return <Missing text="لم يُضف ملف صوتي بعد." />;
		return (
			<ViewerFrame
				label={sourceLabel || "صوت الدرس"}
				href={href}
			>
				<div className="flex items-center gap-2.5 px-3 py-2.5">
					<span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
						<IconMicrophone className="size-4" />
					</span>
					{/* biome-ignore lint/a11y/useMediaCaption: معاينة لمحتوى يرفعه المستخدم بلا ترجمات */}
					<audio
						src={href}
						controls
						className="h-8 min-w-0 flex-1"
					/>
				</div>
			</ViewerFrame>
		);
	}

	if (lesson.type === "DOCUMENT") {
		if (!href) return <Missing text="لم يُضف مستند بعد." />;
		const isPdf = /\.pdf($|\?)/i.test(href) || /\.pdf$/i.test(lesson.mediaKey ?? "");
		return (
			<ViewerFrame
				label={sourceLabel || "مستند الدرس"}
				href={href}
			>
				{isPdf ? (
					<iframe
						src={`${href}#toolbar=0&view=FitH`}
						title={lesson.title}
						className="h-[340px] w-full bg-muted/30"
					/>
				) : (
					// امتداد غير قابل للتضمين — بطاقة ملف بالهوية نفسها
					<div className="flex items-center gap-2.5 px-3 py-4">
						<span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
							<IconFileDiff className="size-4" />
						</span>
						<div className="flex min-w-0 flex-col">
							<span className="truncate text-[12px] font-medium text-foreground">
								{sourceLabel || "المستند"}
							</span>
							<span className="text-[10px] text-muted-foreground">
								يفتح المستند في تبويب جديد
							</span>
						</div>
					</div>
				)}
			</ViewerFrame>
		);
	}

	// QUIZ / SURVEY — أسئلة كما تظهر للموظف (بلا كشف الإجابات الصحيحة)
	const questions = parseQuizContent(lesson.content);
	if (!questions.length) {
		return (
			<Missing text={lesson.type === "QUIZ" ? "لا توجد أسئلة بعد." : "لا توجد بنود بعد."} />
		);
	}
	return (
		<ol className="flex flex-col gap-2.5">
			{questions.map((q, qi) => (
				<li
					key={`${q.text}-${qi}`}
					className="flex flex-col gap-2 rounded-lg border border-border bg-background p-3"
				>
					<span className="text-[12px] font-semibold text-foreground">
						<span className="text-muted-foreground tabular-nums">{qi + 1}. </span>
						{q.text || "سؤال بلا نصّ"}
					</span>

					{q.answerType === "TEXT" ? (
						<div className="rounded-md border border-dashed border-border px-3 py-3 text-[11px] text-muted-foreground">
							يكتب الموظف إجابته هنا...
						</div>
					) : (
						<div className="flex flex-col gap-1.5">
							{q.options.map((o, oi) => (
								<span
									key={`${o.text}-${oi}`}
									className="flex items-center gap-2 rounded-md bg-muted/50 px-2.5 py-1.5 text-[11px] text-foreground"
								>
									{/* شكل الاختيار كما يراه الموظف — دائرة لسؤال بإجابة واحدة ومربّع للمتعدّد */}
									<span
										className={cn(
											"size-3.5 shrink-0 border border-input bg-background",
											q.answerType === "MULTIPLE" ? "rounded-[4px]" : "rounded-full",
										)}
									/>
									{o.text || "خيار بلا نصّ"}
								</span>
							))}
						</div>
					)}
				</li>
			))}
		</ol>
	);
}

export function LessonContentsPreview({
	lesson,
	preferredPageId,
}: {
	lesson: LessonResponse;
	preferredPageId?: string | null;
}) {
	const contents = lesson.contents;
	if (!contents?.length) {
		return (
			<SingleLessonBody
				lesson={lesson}
				preferredPageId={preferredPageId}
			/>
		);
	}

	return (
		<div className="flex flex-col gap-2.5">
			{contents.map((content, index) => {
				const resource = {
					...lesson,
					...content,
					id: content.id,
					title: content.title || `محتوى ${index + 1}`,
				} as LessonResponse & LessonContentItem;
				const { Icon } = TYPE_META[content.type] ?? TYPE_META.TEXT;
				return (
					<article
						key={content.id}
						className="rounded-md border border-[#E5E5E5] bg-white p-2.5"
					>
						<div className="mb-2 flex items-center gap-2">
							<Icon className="size-3.5 shrink-0 text-primary" />
							<span className="flex-1 truncate text-[11px] font-semibold text-foreground">
								{content.title || `محتوى ${index + 1}`}
							</span>
							<span className="shrink-0 text-[9px] text-muted-foreground">
								{TYPE_META[content.type]?.label ?? "محتوى"}
							</span>
						</div>
						{content.description?.trim() && (
							<p className="mb-2 text-[10px] leading-5 text-muted-foreground">
								{content.description}
							</p>
						)}
						<SingleLessonBody
							lesson={resource}
							preferredPageId={preferredPageId}
						/>
					</article>
				);
			})}
		</div>
	);
}

// بطاقة معاينة درس واحد — ترويسة (النوع/العنوان/المدة) + الجسم حسب النوع
export function LessonPreview({
	lesson,
	index,
	preferredPageId,
}: {
	lesson: LessonResponse;
	index: number;
	preferredPageId?: string | null;
}) {
	const meta = TYPE_META[lesson.type] ?? TYPE_META.TEXT;
	const duration = formatDuration(lesson.durationSeconds);
	const { Icon } = meta;

	return (
		<div className="flex flex-col gap-2.5 rounded-lg border border-border bg-card p-3">
			<div className="flex items-start justify-between gap-2">
				<div className="flex min-w-0 items-center gap-2">
					<span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
						<Icon className="size-3.5" />
					</span>
					<span className="truncate text-[12px] font-bold text-foreground">
						<span className="text-muted-foreground tabular-nums">{index}. </span>
						{lesson.title}
					</span>
				</div>

				<div className="flex shrink-0 items-center gap-1.5">
					{duration && (
						<span className="flex items-center gap-1 text-[10px] text-muted-foreground">
							<IconClock className="size-3" />
							{duration}
						</span>
					)}
					<span className="rounded-[4px] bg-muted px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground">
						{meta.label}
					</span>
				</div>
			</div>

			{lesson.description?.trim() && (
				<p className="text-[11px] leading-5 text-muted-foreground">{lesson.description}</p>
			)}

			<LessonContentsPreview
				lesson={lesson}
				preferredPageId={preferredPageId}
			/>
		</div>
	);
}
