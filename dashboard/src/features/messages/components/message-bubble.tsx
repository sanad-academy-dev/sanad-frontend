import { IconCheck, IconChecks, IconDownload, IconFile, IconVideo } from "@tabler/icons-react";
import { Fragment, type ReactNode } from "react";

import { ChatAvatar } from "@/features/messages/components/chat-avatar";
import type { ChatMessage } from "@/features/messages/types/messages.type";
import { useCallWindowStore } from "@/features/video-calls/stores/call-window.store";
import { cn } from "@/lib/utils";

/** روابط http(s) داخل نص الرسالة */
const URL_RE = /https?:\/\/[^\s<>"]+/g;

/** علامات التنسيق: **غامق** ثم __تسطير__ ثم *مائل* — الأطول أولًا حتى لا تتداخل */
const FORMAT_RE = /(\*\*[^*\n]+\*\*|__[^_\n]+__|\*[^*\n]+\*)/g;

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** يبرز مقاطع البحث داخل جزء نصي */
function highlight(text: string, query: string, keyPrefix: string): ReactNode {
	const needle = query.trim();
	if (!needle) return text;
	const parts = text.split(new RegExp(`(${escapeRegExp(needle)})`, "gi"));
	return parts.map((part, i) =>
		part.toLowerCase() === needle.toLowerCase() ? (
			<mark
				key={`${keyPrefix}-h${i}-${part}`}
				className="rounded-[2px] bg-primary px-0.5 text-primary-foreground"
			>
				{part}
			</mark>
		) : (
			<Fragment key={`${keyPrefix}-h${i}-${part}`}>{part}</Fragment>
		),
	);
}

/** يفكّ علامات التنسيق داخل جزء نصي (بعد فصل الروابط) */
function renderFormatted(text: string, query: string, keyPrefix: string): ReactNode {
	const parts = text.split(FORMAT_RE);
	return parts.map((part, i) => {
		const key = `${keyPrefix}-f${i}`;
		if (part.startsWith("**") && part.endsWith("**"))
			return (
				<strong
					key={key}
					className="font-bold"
				>
					{highlight(part.slice(2, -2), query, key)}
				</strong>
			);
		if (part.startsWith("__") && part.endsWith("__"))
			return (
				<u
					key={key}
					className="underline underline-offset-2"
				>
					{highlight(part.slice(2, -2), query, key)}
				</u>
			);
		if (part.startsWith("*") && part.endsWith("*") && part.length > 2)
			return (
				<em
					key={key}
					className="italic"
				>
					{highlight(part.slice(1, -1), query, key)}
				</em>
			);
		return <Fragment key={key}>{highlight(part, query, key)}</Fragment>;
	});
}

/** يستخرج اسم قاعة المكالمة من رابط دعوة داخلي (/video-call?room=X) */
const callRoomFromUrl = (url: string): string | null => {
	try {
		const parsed = new URL(url);
		if (parsed.pathname !== "/video-call") return null;
		if (typeof window !== "undefined" && parsed.origin !== window.location.origin) return null;
		return parsed.searchParams.get("room");
	} catch {
		return null;
	}
};

/** زر انضمام لمكالمة — يفتح النافذة العائمة بدل مغادرة الصفحة */
function JoinCallButton({ room, callerName }: { room: string; callerName?: string }) {
	const open = useCallWindowStore((s) => s.open);
	return (
		<button
			type="button"
			onClick={(e) => {
				e.stopPropagation();
				open(room, callerName ? `مكالمة مع ${callerName}` : "مكالمة فيديو");
			}}
			className="my-1 flex w-full items-center gap-2 rounded-[6px] border border-primary/30 bg-primary/5 px-2.5 py-2 transition-colors hover:bg-primary/10"
		>
			<span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
				<IconVideo className="size-3.5" />
			</span>
			<span className="flex min-w-0 flex-col items-start gap-0.5 text-start">
				<span className="text-[12px] font-semibold text-foreground">مكالمة فيديو</span>
				<span className="text-[10px] text-muted-foreground">اضغط للانضمام</span>
			</span>
		</button>
	);
}

/**
 * جسم الرسالة: روابط قابلة للنقر + تنسيق غامق/مائل/تسطير + إبراز البحث.
 * الروابط تُفصل أولًا حتى لا تعبث علامات التنسيق بداخلها، وروابط دعوة
 * المكالمات الداخلية تُعرض زر انضمام يفتح النافذة العائمة.
 */
export function MessageBody({
	body,
	query = "",
	authorName,
}: {
	body: string;
	query?: string;
	/** اسم المرسِل — يظهر في عنوان نافذة المكالمة عند الانضمام */
	authorName?: string;
}) {
	const segments = body.split(URL_RE);
	const urls = body.match(URL_RE) ?? [];

	return (
		<>
			{segments.map((segment, i) => {
				const url = urls[i];
				const callRoom = url ? callRoomFromUrl(url) : null;
				return (
					<Fragment key={`s${i}-${segment.slice(0, 12)}`}>
						{renderFormatted(segment, query, `s${i}`)}
						{url &&
							(callRoom ? (
								<JoinCallButton
									room={callRoom}
									callerName={authorName}
								/>
							) : (
								<a
									href={url}
									target="_blank"
									rel="noopener noreferrer"
									dir="ltr"
									className="break-all text-primary underline underline-offset-2 hover:opacity-80"
									onClick={(e) => e.stopPropagation()}
								>
									{highlight(url, query, `u${i}`)}
								</a>
							))}
					</Fragment>
				);
			})}
		</>
	);
}

/**
 * فقاعة رسالة — الصادرة في جهة البداية (يمين في RTL) بخلفية أساسية خفيفة
 * وزاوية ملتصقة، والواردة في جهة النهاية مع أفاتار المرسِل واسمه في الجماعية.
 */
export function MessageBubble({
	message,
	authorName,
	showAuthor = false,
	query = "",
	isActiveMatch = false,
}: {
	message: ChatMessage;
	/** اسم المرسِل — يظهر مع الأفاتار في الرسائل الواردة */
	authorName?: string;
	/** إظهار الاسم فوق الفقاعة (محادثات جماعية) */
	showAuthor?: boolean;
	query?: string;
	isActiveMatch?: boolean;
}) {
	const incoming = !message.outgoing;

	return (
		<div
			className={cn(
				"flex w-full items-end gap-2",
				message.outgoing ? "justify-start" : "justify-end",
			)}
		>
			{/* الرسالة الصادرة أول العنصر (يمين في RTL) */}
			<div
				className={cn(
					"max-w-[min(72%,440px)] rounded-[10px] px-3 py-2 shadow-xs",
					message.outgoing
						? "rounded-ee-[10px] rounded-es-[3px] bg-primary/8 ring-1 ring-primary/15"
						: "rounded-es-[10px] rounded-ee-[3px] border bg-background",
					isActiveMatch && "ring-2 ring-primary/50",
				)}
			>
				{showAuthor && incoming && authorName && (
					<p className="mb-0.5 text-[11px] font-semibold text-primary">{authorName}</p>
				)}

				{/* مرفق: صورة تُعرض داخل الفقاعة، وغيرها بطاقة تنزيل */}
				{message.attachment &&
					(message.attachment.isImage ? (
						<a
							href={message.attachment.url}
							target="_blank"
							rel="noopener noreferrer"
							onClick={(e) => e.stopPropagation()}
							className="mb-1 block"
						>
							<img
								src={message.attachment.url}
								alt={message.attachment.name}
								loading="lazy"
								className="max-h-64 max-w-full rounded-[6px] border object-cover"
							/>
						</a>
					) : (
						<a
							href={message.attachment.url}
							download={message.attachment.name}
							onClick={(e) => e.stopPropagation()}
							className="mb-1 flex items-center gap-2 rounded-[6px] border bg-muted/40 px-2.5 py-2 transition-colors hover:bg-muted/70"
						>
							<span className="flex size-8 shrink-0 items-center justify-center rounded-[6px] bg-primary/10 text-primary">
								<IconFile className="size-4" />
							</span>
							<span className="flex min-w-0 flex-1 flex-col gap-0.5">
								<span className="truncate text-[12px] font-semibold text-foreground">
									{message.attachment.name}
								</span>
								<span className="text-[10px] text-muted-foreground">
									{message.attachment.sizeLabel}
								</span>
							</span>
							<IconDownload className="size-4 shrink-0 text-muted-foreground" />
						</a>
					))}

				{message.body && (
					<p className="text-[13px] leading-[20px] break-words whitespace-pre-wrap text-foreground">
						<MessageBody
							body={message.body}
							query={query}
							authorName={incoming ? authorName : undefined}
						/>
					</p>
				)}

				{/* الوقت والحالة في جهة النهاية أسفل الفقاعة */}
				<div className="mt-1 flex items-center justify-end gap-1 text-muted-foreground">
					<span className="text-[10px] leading-none tabular-nums">{message.timeLabel}</span>
					{message.outgoing &&
						(message.status === "sent" ? (
							<IconCheck className="size-3.5" />
						) : (
							<IconChecks
								className={cn("size-3.5", message.status === "read" && "text-primary")}
							/>
						))}
				</div>
			</div>

			{/* أفاتار المرسِل بجانب الفقاعة الواردة (جهة النهاية) */}
			{incoming && authorName && (
				<ChatAvatar
					name={authorName}
					size={26}
					className="mb-0.5 shrink-0"
				/>
			)}
		</div>
	);
}
