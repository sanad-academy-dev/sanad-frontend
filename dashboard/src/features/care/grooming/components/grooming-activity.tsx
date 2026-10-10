import { formatDistanceToNow } from "date-fns";
import { arSA } from "date-fns/locale";

import type { GroomingActivityResponse } from "@/server/grooming/grooming.type";
import {
	GROOMING_ACTIVITY_CARD_TYPES,
	GROOMING_ACTIVITY_LABELS,
} from "@sanad/contracts/runtime/server/grooming/grooming.type";

// سجل الجلسة — نفس تصميم نشاط الأشعّة والتحاليل: سطر واحد لكل قيد بصورة رمزية
// واسم الفاعل والفعل والوقت النسبي، وبطاقة مُزاحة لما يحمل نصًا حرًا.
//
// الخطّ الزمني المُنقَّط السابق كان يعرض التفصيل بلا فاعل ولا فعل، فيقرأ المستخدم
// «تغيّرت الحالة» ولا يعرف من غيّرها — وهذا بالضبط ما يُسأل عنه عند المراجعة.

function Avatar({ name }: { name: string }) {
	const initials = name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((p) => p[0] ?? "")
		.join("");
	return (
		<div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-[10px] text-white">
			{initials}
		</div>
	);
}

export function GroomingActivity({ activity }: { activity: GroomingActivityResponse[] }) {
	// الخادم يُرجعها بالأحدث أولًا — نُثبّت الترتيب هنا كي لا يعتمد العرض على ذلك
	const entries = [...activity].sort(
		(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
	);

	return (
		<section className="flex flex-col gap-3">
			<p className="font-semibold text-base">السجل</p>

			{entries.length === 0 ? (
				<p className="text-muted-foreground text-xs">لا يوجد نشاط مسجَّل بعد.</p>
			) : (
				<div className="flex flex-col gap-4">
					{entries.map((entry) => (
						<GroomingActivityItem
							key={entry.id}
							entry={entry}
						/>
					))}
				</div>
			)}
		</section>
	);
}

function GroomingActivityItem({ entry }: { entry: GroomingActivityResponse }) {
	const relative = formatDistanceToNow(new Date(entry.createdAt), {
		addSuffix: true,
		locale: arSA,
	});
	const authorName = entry.author?.name ?? "النظام";
	const verb = GROOMING_ACTIVITY_LABELS[entry.type];
	const asCard = GROOMING_ACTIVITY_CARD_TYPES.includes(entry.type) && !!entry.detail;

	const header = (
		<div className="flex flex-wrap items-center gap-2 text-muted-foreground text-xs">
			<Avatar name={authorName} />
			<span className="font-semibold text-foreground">{authorName}</span>
			<span>•</span>
			<span>{verb}</span>
			{/* التفصيل القصير في السطر نفسه؛ النص الحرّ يأخذ بطاقة أدناه */}
			{entry.detail && !asCard && (
				<>
					<span>•</span>
					<span className="text-foreground">{entry.detail}</span>
				</>
			)}
			{entry.gate && (
				<>
					<span>•</span>
					<span className="font-medium text-destructive">بوابة {entry.gate}</span>
				</>
			)}
			<span>•</span>
			<span>{relative}</span>
		</div>
	);

	if (!asCard) return header;

	return (
		<div className="flex flex-col gap-1.5">
			{header}
			<div className="me-8 rounded-md border bg-card p-3">
				<p className="whitespace-pre-wrap text-sm">{entry.detail}</p>
			</div>
		</div>
	);
}
