import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { ErrorCard, type ErrorCardData } from "@/features/agent/components/error-card";
import { LoadingCard } from "@/features/agent/components/loading-card";
import { ResultCard, type ResultCardData } from "@/features/agent/components/result-card";
import type { AgentChatMessage } from "@/features/agent/types/agent.types";
import { cn } from "@/lib/utils";

// يزيل الكتل التقنية (الحقول المُحلّة وبطاقتا النتيجة/الفشل) من النصّ المعروض
const RESOLVED_RE = /\n*<resolved_fields>.*?<\/resolved_fields>/s;
const ACTION_RE = /<action_result>(.*?)<\/action_result>/s;
const ERROR_RE = /<action_error>(.*?)<\/action_error>/s;

function extract(content: string): {
	text: string;
	card: ResultCardData | null;
	error: ErrorCardData | null;
} {
	let card: ResultCardData | null = null;
	const match = content.match(ACTION_RE);
	if (match) {
		try {
			card = JSON.parse(match[1]) as ResultCardData;
		} catch {
			card = null;
		}
	}
	let error: ErrorCardData | null = null;
	const errMatch = content.match(ERROR_RE);
	if (errMatch) {
		try {
			error = JSON.parse(errMatch[1]) as ErrorCardData;
		} catch {
			error = null;
		}
	}
	const text = content
		.replace(ACTION_RE, "")
		.replace(ERROR_RE, "")
		.replace(RESOLVED_RE, "")
		.trim();
	return { text, card, error };
}

// يعرض ردّ أونيكس النهائي كـ Markdown منسّق (جداول، قوائم، عناوين) بدل نصّ خام.
// عناصر مضبوطة يدويًا بـ Tailwind (لا يوجد typography plugin في المشروع).
// dir="rtl" صريح ومقصود على الحاوية: محتوى أونيكس عربي دائمًا، وأسطره قد تبدأ بأرقام
// أو أكواد لاتينية (مثل "AP-X7") فتنقلب فقرتها LTR لولا تثبيت الاتجاه — جزيرة اتجاه
// مشروعة تضبط البيدي كله، فلا حاجة لأي text-right على العناصر الداخلية.
const AssistantMarkdown = ({ text }: { text: string }) => (
	<div
		dir="rtl"
		className="wrap-break-word rounded-lg bg-muted px-3.5 py-2.5 text-start text-[15px] leading-relaxed"
	>
		<ReactMarkdown
			remarkPlugins={[remarkGfm]}
			components={{
				p: ({ children }) => <p className="my-1">{children}</p>,
				strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
				ul: ({ children }) => <ul className="my-1 list-disc ps-5">{children}</ul>,
				ol: ({ children }) => <ol className="my-1 list-decimal ps-5">{children}</ol>,
				li: ({ children }) => <li className="my-0.5">{children}</li>,
				h1: ({ children }) => <p className="my-1.5 text-base font-bold">{children}</p>,
				h2: ({ children }) => <p className="my-1.5 text-base font-bold">{children}</p>,
				h3: ({ children }) => <p className="my-1 font-semibold">{children}</p>,
				// الأكواد (AP-X7...) جزيرة LTR مقصودة كي لا تتشوّه محارفها داخل النص العربي
				code: ({ children }) => (
					<code
						className="rounded bg-black/5 px-1 font-mono text-[13px]"
						dir="ltr"
					>
						{children}
					</code>
				),
				// الجداول العريضة تتمرّر أفقيًا داخل حاويتها (قاعدة RTL في AGENTS.md)
				table: ({ children }) => (
					<div className="my-2 overflow-x-auto">
						<table className="w-full border-collapse text-[13px]">{children}</table>
					</div>
				),
				th: ({ children }) => (
					<th className="border border-border bg-black/5 px-2 py-1 text-start font-semibold">
						{children}
					</th>
				),
				td: ({ children }) => (
					<td className="border border-border px-2 py-1 text-start">{children}</td>
				),
				a: ({ children, href }) => (
					<a
						href={href}
						className="underline"
						target="_blank"
						rel="noreferrer"
					>
						{children}
					</a>
				),
			}}
		>
			{text}
		</ReactMarkdown>
	</div>
);

export const MessageItem = ({
	message,
	isStreaming,
}: {
	message: AgentChatMessage;
	isStreaming: boolean;
}) => {
	const { text, card, error } = extract(message.content);

	// ردّ المساعد أثناء البثّ: نُخفي النصّ الحيّ (كي لا يرى المستخدم الموديل يكتب/يهلوس/يصحّح)
	// ونعرض بطاقة "جاري العمل" حتى اكتمال الردّ — عندها فقط تظهر النتيجة النهائية منسّقة.
	if (message.role === "assistant" && isStreaming) {
		return (
			<div className="flex w-full justify-end">
				<div className="w-full max-w-[85%]">
					<LoadingCard />
				</div>
			</div>
		);
	}

	// عند اكتمال إجراء (بطاقة نجاح أو فشل): نطرح النصّ التفسيري ونعرض البطاقة وحدها.
	const showText = Boolean(text) && !card && !error;

	// حارس الردّ الفارغ: ردّ مساعد مكتمل بلا نصّ ولا بطاقة = خطأ ابتلعه البثّ.
	// نعرض سببًا واضحًا بدل فقاعة فارغة (التشخيص الفعلي في سجلّ الخادم).
	const isEmptyAssistant =
		message.role === "assistant" && !isStreaming && !text && !card && !error;

	return (
		<div
			className={cn(
				"flex w-full",
				// في RTL: رسالة المستخدم إلى اليمين (start)، ردّ المساعد إلى اليسار (end)
				message.role === "user" ? "justify-start" : "justify-end",
			)}
		>
			<div className="flex w-full max-w-[85%] flex-col gap-2">
				{showText &&
					(message.role === "assistant" ? (
						<div className="self-end w-fit max-w-full">
							<AssistantMarkdown text={text} />
						</div>
					) : (
						<div className="self-start w-fit max-w-full whitespace-pre-wrap rounded-lg bg-primary px-3.5 py-2.5 text-end text-[15px] leading-relaxed text-primary-foreground">
							{text}
						</div>
					))}
				{/* بطاقة النتيجة بعد إجراء ناجح (إنشاء/تعديل) — تُعرض وحدها دون نصّ */}
				{card && (
					<div className="rounded-lg border">
						<ResultCard data={card} />
					</div>
				)}
				{/* بطاقة الفشل — تعرض السبب النهائي فقط دون ثرثرة الموديل */}
				{error && <ErrorCard data={error} />}
				{/* ردّ فارغ مكتمل — نُظهر خطأ واضحًا بدل الصمت */}
				{isEmptyAssistant && (
					<ErrorCard
						data={{
							title: "لم يصل ردّ",
							reason:
								"انقطع الردّ قبل اكتماله. أعد المحاولة — وإن تكرّر، راجع سجلّ الخادم (console) لمعرفة السبب.",
						}}
					/>
				)}
			</div>
		</div>
	);
};
