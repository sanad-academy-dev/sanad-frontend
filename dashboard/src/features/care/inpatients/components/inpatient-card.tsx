import { IconBedFlat, IconClock, IconUserHeart } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
	ACUITY_META,
	DUE_STATUS_META,
	STAY_KIND_META,
} from "@/features/care/inpatients/data/inpatients-data";
import type {
	InpatientAcuity,
	InpatientStayKind,
	InpatientStayStatus,
} from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import type { InpatientDueStatus } from "@/server/inpatients/inpatient-due.service";

/**
 * كرت الإقامة على اللوحة.
 *
 * ترتيب المعلومات مقصود: اسم الطفل أولًا (هو ما يُبحث عنه)، ثم القفص (أين
 * أذهب)، ثم ما يستحقّ الآن (ماذا أفعل). المدرّب المعالج آخرًا لأنّه سياقٌ يُراجَع
 * لا فعلٌ يُتّخذ.
 */

export type InpatientCardData = {
	id: string;
	code: string;
	status: InpatientStayStatus;
	kind: InpatientStayKind;
	acuity: InpatientAcuity;
	admittedAt: string | Date | null;
	patient: { name: string; code: string; animalType: { arName: string } };
	owner: { name: string };
	attendingStaff: { name: string };
	cageAssignments: { cage: { name: string; room: { name: string } } }[];
	due: {
		status: InpatientDueStatus;
		overdue: { id: string; label: string; minutesLate: number }[];
		due: { id: string; label: string }[];
		vitals: { state: string; minutesLate: number };
	} | null;
};

export function InpatientCard({
	stay,
	onOpen,
	now,
}: {
	stay: InpatientCardData;
	onOpen: (id: string) => void;
	now: number;
}) {
	const acuity = ACUITY_META[stay.acuity];
	const kind = STAY_KIND_META[stay.kind];
	const KindIcon = kind.icon;
	const cage = stay.cageAssignments[0]?.cage;
	const dueMeta = stay.due ? DUE_STATUS_META[stay.due.status] : null;
	const DueIcon = dueMeta?.icon;

	const topOverdue = stay.due?.overdue[0];
	const topDue = stay.due?.due[0];
	// الطلب لم يدخل بعد — لا يوم إقامة له، والعدّاد يُخفى بدل أن يُطبع رقمًا
	// محسوبًا من صفر الحقبة (كان يظهر «اليوم 20699»).
	const days = stay.admittedAt
		? Math.max(1, Math.floor((now - new Date(stay.admittedAt).getTime()) / 86_400_000) + 1)
		: null;

	return (
		<button
			type="button"
			onClick={() => onOpen(stay.id)}
			className={cn(
				"group relative w-full overflow-hidden rounded border bg-card p-3 text-start transition-colors",
				"hover:border-primary/40 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
				stay.due?.status === "OVERDUE" && "border-destructive/40",
			)}
		>
			{/* شريط الحرجية على الحافّة — يُقرأ من بعيد بلا نصّ */}
			<span
				aria-hidden
				className={cn("absolute inset-y-0 start-0 w-1", acuity.bar)}
			/>

			<div className="ps-2">
				<div className="flex items-start justify-between gap-2">
					<div className="min-w-0">
						<div className="truncate text-sm font-medium">{stay.patient.name}</div>
						<div className="truncate text-xs text-muted-foreground">
							{stay.patient.animalType.arName} · {stay.owner.name}
						</div>
					</div>
					<span className={cn("shrink-0 text-[11px]", acuity.text)}>{acuity.label}</span>
				</div>

				<div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
					<span className="inline-flex items-center gap-1">
						<KindIcon className="size-3.5" />
						{kind.label}
					</span>
					{cage && (
						<span className="inline-flex items-center gap-1">
							<IconBedFlat className="size-3.5" />
							{cage.name} · {cage.room.name}
						</span>
					)}
					<span className="inline-flex items-center gap-1">
						<IconClock className="size-3.5" />
						{days === null ? "بانتظار الإسكان" : `اليوم ${days}`}
					</span>
				</div>

				{dueMeta && stay.due?.status !== "ON_TRACK" && (
					<div
						className={cn(
							"mt-2 flex items-center gap-1.5 rounded border px-2 py-1 text-[11px]",
							dueMeta.className,
						)}
					>
						{DueIcon && <DueIcon className="size-3.5 shrink-0" />}
						<span className="truncate">
							{topOverdue
								? `${topOverdue.label} — تأخّر ${topOverdue.minutesLate} د`
								: topDue
									? `${topDue.label} — مستحقّ الآن`
									: stay.due?.vitals.state === "NO_BASELINE"
										? "لم تُسجَّل علامات حيوية بعد"
										: stay.due?.vitals.state === "OVERDUE"
											? `فات موعد القياس — ${stay.due.vitals.minutesLate} د`
											: dueMeta.label}
						</span>
						{(stay.due?.overdue.length ?? 0) > 1 && (
							<Badge
								variant="outline"
								className="ms-auto h-4 shrink-0 px-1 text-[10px]"
							>
								+{(stay.due?.overdue.length ?? 1) - 1}
							</Badge>
						)}
					</div>
				)}

				<div className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
					<IconUserHeart className="size-3.5" />
					<span className="truncate">{stay.attendingStaff.name}</span>
					<span className="ms-auto font-mono text-[10px] opacity-70">{stay.code}</span>
				</div>
			</div>
		</button>
	);
}
