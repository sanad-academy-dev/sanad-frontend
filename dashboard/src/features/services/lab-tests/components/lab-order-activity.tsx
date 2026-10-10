import { formatDistanceToNow } from "date-fns";
import { arSA } from "date-fns/locale";

import { LabActivityType } from "@/generated/prisma/enums";
import {
	LAB_ACTIVITY_LABELS,
	type LabActivityResponse,
	type LabTestOrderResponse,
} from "@sanad/contracts/runtime/server/lab-tests/lab-tests.type";

// سجل نشاط الطلب — نفس تصميم نشاط الزيارة: سطر واحد لكل قيد بصورة رمزية
// واسم الفاعل والفعل والوقت النسبي، وبطاقة مُزاحة لما يحمل نصًا حرًا.

// الأنواع التي يكون تفصيلها نصًا حرًا يستحق بطاقة مستقلة (سبب الرفض مثلًا)
const CARD_TYPES = new Set<LabActivityType>([
	LabActivityType.REJECTED,
	LabActivityType.DECLINED,
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

export function LabOrderActivity({ order }: { order: LabTestOrderResponse }) {
	// الخادم يُرجعها بترتيب الإدراج — نعرض الأحدث أولًا
	const entries = [...order.activity].sort(
		(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
	);
	// اسم التحليل لكل قيد مرتبط بعنصر
	const itemNames = new Map(order.items.map((i) => [i.id, i.service.name]));

	return (
		<section className="flex flex-col gap-3">
			<p className="text-base font-semibold">النشاط</p>

			{entries.length === 0 ? (
				<p className="text-xs text-muted-foreground">لا يوجد نشاط مسجَّل بعد.</p>
			) : (
				<div className="flex flex-col gap-4">
					{entries.map((entry) => (
						<LabActivityItem
							key={entry.id}
							activity={entry}
							testName={entry.itemId ? (itemNames.get(entry.itemId) ?? null) : null}
						/>
					))}
				</div>
			)}
		</section>
	);
}

function LabActivityItem({
	activity,
	testName,
}: {
	activity: LabActivityResponse;
	testName: string | null;
}) {
	const relative = formatDistanceToNow(new Date(activity.createdAt), {
		addSuffix: true,
		locale: arSA,
	});
	const authorName = activity.author?.name ?? "النظام";
	const verb = LAB_ACTIVITY_LABELS[activity.type];
	const asCard = CARD_TYPES.has(activity.type) && !!activity.detail;

	const header = (
		<div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
			<Avatar name={authorName} />
			<span className="font-semibold text-foreground">{authorName}</span>
			<span>•</span>
			<span>{verb}</span>
			{testName && (
				<>
					<span>•</span>
					<span className="text-foreground">{testName}</span>
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
