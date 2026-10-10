import {
	IconDots,
	IconMessageCircle,
	IconPlus,
	IconShare3,
	IconThumbUp,
	IconWorld,
} from "@tabler/icons-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * معاينة منشور المنصّة (المكوّن 537437، بحالاته الأربع).
 *
 * **الصندوق يرث اتجاه الصفحة — لا `dir` محلّي.** التصميم يضع الصورة الرمزية واسم
 * الصفحة في أقصى **اليمين** وزرّ «...» في أقصى اليسار، و«إعجاب» يمين شريط التفاعل
 * و«مشاركة» يساره: هذا تدفّق RTL كامل، لا صندوق لاتيني يحمل نصًّا عربيًّا. فرضُ
 * `dir="ltr"` هنا كان يقلب الصفّين معًا.
 *
 * والقاعدة الحاكمة بعدها: **ترتيب DOM وحده يقرّر الجهات** — أوّل ابن يقع يمينًا في
 * RTL. لذلك الصورة الرمزية تُكتب أولًا و«...» آخرًا، وعدّاد التعليقات قبل عدّاد
 * التفاعلات. لا `justify-end` ولا `flex-row-reverse` في هذا الملف.
 */
export function AdPreviewCard({
	pageName,
	primaryText,
	headline,
	description,
	linkUrl,
	imageUrl,
	onPickImage,
	className,
}: {
	pageName?: string | null;
	primaryText?: string | null;
	headline?: string | null;
	description?: string | null;
	linkUrl?: string | null;
	imageUrl?: string | null;
	onPickImage?: () => void;
	className?: string;
}) {
	const hasPage = !!pageName;
	const hasText = !!primaryText?.trim();
	const hasLink = !!(headline || description || linkUrl);

	return (
		<div className={cn("rounded-[4px] border bg-background", className)}>
			{/* ترويسة الصفحة */}
			<div className="flex items-center gap-2 p-3">
				{hasPage ? (
					<span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-sm">
						{pageName.trim().charAt(0)}
					</span>
				) : (
					<Skeleton className="size-9 shrink-0 rounded-full" />
				)}

				<div className="flex min-w-0 flex-1 flex-col gap-1">
					{hasPage ? (
						<span
							dir="auto"
							className="truncate font-semibold text-sm"
						>
							{pageName}
						</span>
					) : (
						<Skeleton className="h-3 w-40" />
					)}
					<span className="flex items-center gap-1 text-muted-foreground text-xs">
						برعاية
						<IconWorld className="size-3" />
					</span>
				</div>

				<IconDots className="size-4 shrink-0 text-muted-foreground" />
			</div>

			{/* نصّ الإعلان */}
			<div className="px-3 pb-3">
				{hasText ? (
					<p
						dir="auto"
						className="whitespace-pre-wrap text-sm leading-relaxed"
					>
						{primaryText}
					</p>
				) : (
					<div className="flex flex-col gap-2">
						<Skeleton className="h-3 w-full" />
						<Skeleton className="h-3 w-4/5" />
					</div>
				)}
			</div>

			{/* الصورة — الفراغ فيه زرّ الاختيار، فالمنطقة نفسها هي الدعوة للفعل */}
			{imageUrl ? (
				<img
					src={imageUrl}
					alt=""
					className="max-h-[280px] w-full object-cover"
				/>
			) : (
				<button
					type="button"
					onClick={onPickImage}
					disabled={!onPickImage}
					className="flex h-[240px] w-full items-center justify-center bg-muted/60 transition-colors enabled:hover:bg-muted"
					aria-label="اختر صورة الإعلان"
				>
					<span className="flex size-9 items-center justify-center rounded-full border bg-background">
						<IconPlus className="size-4 text-muted-foreground" />
					</span>
				</button>
			)}

			{/* شريط الرابط أسفل الصورة */}
			<div className="flex items-center gap-3 border-b px-3 py-2.5">
				<div className="flex min-w-0 flex-1 flex-col gap-1">
					{hasLink ? (
						<>
							{linkUrl && (
								<span className="truncate text-[11px] text-muted-foreground">{linkUrl}</span>
							)}
							{headline && (
								<span
									dir="auto"
									className="truncate font-semibold text-sm"
								>
									{headline}
								</span>
							)}
							{description && (
								<span
									dir="auto"
									className="truncate text-muted-foreground text-xs"
								>
									{description}
								</span>
							)}
						</>
					) : (
						<>
							<Skeleton className="h-2.5 w-24" />
							<Skeleton className="h-3 w-2/3" />
						</>
					)}
				</div>
				{hasLink && (
					<span className="shrink-0 rounded-[4px] bg-muted px-2.5 py-1 text-xs">
						اعرف المزيد
					</span>
				)}
			</div>

			{/* عدّادات التفاعل — أرقام العرض في التصميم ثابتة (منشور تجريبي).
			    عدّاد التعليقات أوّلًا ⇒ يمينًا، وعدّاد التفاعلات يساره، كما في التصميم */}
			<div className="flex items-center justify-between px-3 py-2 text-muted-foreground text-xs">
				<span>12 تعليق · 8 مشاركة</span>
				<span dir="ltr">129</span>
			</div>

			<div className="flex items-center justify-around border-t py-1.5 text-muted-foreground text-sm">
				<span className="flex items-center gap-1.5">
					<IconThumbUp className="size-4" />
					إعجاب
				</span>
				<span className="flex items-center gap-1.5">
					<IconMessageCircle className="size-4" />
					تعليق
				</span>
				<span className="flex items-center gap-1.5">
					<IconShare3 className="size-4" />
					مشاركة
				</span>
			</div>
		</div>
	);
}
