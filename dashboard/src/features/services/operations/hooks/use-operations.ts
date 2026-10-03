import { useQuery } from "@tanstack/react-query";

import type {
	OperationCardData,
	OperationColumnId,
	OperationsPeriod,
	OperationsView,
} from "@/features/services/operations/types/operations.types";
import { api } from "@/lib/api";
import type { OperationCaseCardResponse } from "@/server/operations/operations.type";
import { SEDATION_LABELS } from "@sanad/contracts/runtime/server/radiology/radiology-procedure.type";

const EMPTY_CASES: OperationCaseCardResponse[] = [];

const timeFormatter = new Intl.DateTimeFormat("ar", {
	hour: "2-digit",
	minute: "2-digit",
});
const dayFormatter = new Intl.DateTimeFormat("ar", { day: "numeric", month: "short" });

const isSameDay = (a: Date, b: Date) =>
	a.getFullYear() === b.getFullYear() &&
	a.getMonth() === b.getMonth() &&
	a.getDate() === b.getDate();

const durationLabel = (minutes: number): string => {
	const hours = Math.floor(minutes / 60);
	const rest = minutes % 60;
	if (hours === 0) return `${minutes} د`;
	return rest === 0 ? `${hours} س` : `${hours} س ${rest} د`;
};

/** استجابة الخادم ← نموذج عرض البطاقة (التنسيقات شأن الواجهة وحدها) */
export const mapCaseToCard = (c: OperationCaseCardResponse): OperationCardData => {
	const scheduled = c.scheduledAt ? new Date(c.scheduledAt) : null;
	const timeLabel = scheduled
		? isSameDay(scheduled, new Date())
			? timeFormatter.format(scheduled)
			: `${dayFormatter.format(scheduled)} ${timeFormatter.format(scheduled)}`
		: "غير مجدولة";
	const surgeon = c.team.find((m) => m.role === "PRIMARY_SURGEON")?.staff ?? null;
	const anesthetist = c.team.find((m) => m.role === "ANESTHETIST")?.staff ?? null;

	return {
		id: c.id,
		name: c.procedures.map((p) => p.nameSnapshot).join("، ") || c.code,
		column: (c.status === "CANCELLED" ? "SCHEDULED" : c.status) as OperationColumnId,
		code: c.code,
		isUrgent: c.urgency === "IMMEDIATE" || c.urgency === "URGENT",
		tier: c.tier,
		urgency: c.urgency,
		patient: { name: c.patient.name, age: c.patient.age, gender: c.patient.gender },
		owner: { name: c.owner.name },
		room: c.room?.name ?? "بلا قاعة",
		timeLabel,
		durationLabel: durationLabel(c.estimatedDurationMin),
		anesthesiaLabel: SEDATION_LABELS[c.plannedAnesthesia],
		surgeon: { name: surgeon?.name ?? "غير محدد" },
		anesthetist: anesthetist ? { name: anesthetist.name } : null,
		// شارة تقدّم قوائم التحقق على البطاقة تصل مع لوحة مجمّعة لاحقًا
		checklistDone: 0,
		checklistTotal: 0,
		commentsCount: c._count.comments,
		raw: c,
	};
};

export const operationsQueryKey = (
	period: OperationsPeriod,
	view: OperationsView,
	q: string,
) => ["operations", { period, view, q }] as const;

export const useOperations = (args: {
	period: OperationsPeriod;
	view: OperationsView;
	q?: string;
}) => {
	const q = args.q?.trim() ?? "";
	const { data, isLoading } = useQuery<OperationCaseCardResponse[]>({
		queryKey: operationsQueryKey(args.period, args.view, q),
		queryFn: async () => {
			const res = await api.operations.get({
				query: {
					period: args.period,
					view: args.view,
					...(q ? { q } : {}),
				},
			});
			if (res.error) throw new Error("فشل جلب العمليات");
			return res.data as OperationCaseCardResponse[];
		},
		refetchInterval: 30_000, // اللوحة تتقادم بسرعة أثناء يوم العمليات
	});

	const cases = data ?? EMPTY_CASES;
	return { cases, cards: cases.map(mapCaseToCard), isLoading };
};
