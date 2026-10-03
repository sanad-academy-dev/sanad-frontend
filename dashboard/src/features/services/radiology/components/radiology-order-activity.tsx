import { formatDistanceToNow } from "date-fns";
import { arSA } from "date-fns/locale";

import { RadiologyActivityType } from "@/generated/prisma/enums";
import {
	RADIOLOGY_ACTIVITY_LABELS,
	type RadiologyActivityResponse,
	type RadiologyOrderResponse,
} from "@sanad/contracts/runtime/server/radiology/radiology.type";

// سجل نشاط الطلب — نفس تصميم نشاط التحاليل: سطر واحد لكل قيد بصورة رمزية
// واسم الفاعل والفعل والوقت النسبي، وبطاقة مُزاحة لما يحمل نصًا حرًا.

// الأنواع التي يكون تفصيلها نصًا حرًا يستحق بطاقة مستقلة (سبب الرفض مثلًا)
const CARD_TYPES = new Set<RadiologyActivityType>([
	RadiologyActivityType.REJECTED,
	RadiologyActivityType.DECLINED,
	RadiologyActivityType.CRITICAL_FLAGGED,
]);

function Avatar({ name }: { name: string }) {
	const initials = name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((p) => p[0] ?? "")
		.join("");
	return (
		<div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white">
			{initials}
		</div>
	);
}

export function RadiologyOrderActivity({ order }: { order: RadiologyOrderResponse }) {
	// الخادم يُرجعها بترتيب الإدراج — نعرض الأحدث أولًا
	const entries = [...order.activity].sort(
		(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
	);
	// اسم الفحص لكل قيد مرتبط بعنصر
	const itemNames = new Map(order.items.map((i) => [i.id, i.service.name]));

	return (
		<section className="flex flex-col gap-3">
			<p className="text-base font-semibold">النشاط</p>

			{entries.length === 0 ? (
				<p className="text-xs text-muted-foreground">لا يوجد نشاط مسجَّل بعد.</p>
			) : (
				<div className="flex flex-col gap-4">
					{entries.map((entry) => (
						<RadiologyActivityItem
							key={entry.id}
							activity={entry}
							examName={entry.itemId ? (itemNames.get(entry.itemId) ?? null) : null}
						/>
					))}
				</div>
			)}
		</section>
	);
}

function RadiologyActivityItem({
	activity,
	examName,
}: {
	activity: RadiologyActivityResponse;
	examName: string | null;
}) {
	const relative = formatDistanceToNow(new Date(activity.createdAt), {
		addSuffix: true,
		locale: arSA,
	});
	const authorName = activity.author?.name ?? "النظام";
	const verb = RADIOLOGY_ACTIVITY_LABELS[activity.type];
	const asCard = CARD_TYPES.has(activity.type) && !!activity.detail;

	const header = (
		<div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
			<Avatar name={authorName} />
			<span className="font-semibold text-foreground">{authorName}</span>
			<span>•</span>
			<span>{verb}</span>
			{examName && (
				<>
					<span>•</span>
					<span className="text-foreground">{examName}</span>
				</>
			)}
			{/* التفصيل القصير يُعرض في السطر نفسه؛ النص الحرّ يأخذ بطاقة أدناه */}
			{activity.detail && !asCard && (
				<>
					<span>•</span>
					<span className="text-foreground">{activity.detail}</span>
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
				<p className="whitespace-pre-wrap text-sm">{activity.detail}</p>
			</div>
		</div>
	);
}
