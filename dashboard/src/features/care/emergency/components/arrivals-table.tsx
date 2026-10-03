import { IconClock, IconPaw } from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EMERGENCY_TICK_MS } from "@/features/care/emergency/hooks/use-emergency";
import { formatWait, waitedMinutes } from "@/features/care/emergency/utils/triage-display";
import type { ArrivalStatus } from "@/generated/prisma/enums";
import { ARRIVAL_STATUS_LABELS } from "@sanad/contracts/runtime/server/emergency/emergency.workflow";

/**
 * قائمة الوصول — من وصل ولم يُفرز بعد، ومن هو في الطريق.
 *
 * ليست جدولًا بأعمدة: الصفّ هنا يُقرأ بطرف العين في ممرّ، فالمعلومة مرصوفة بترتيب
 * القراءة لا بترتيب الأعمدة. وساعةُ الانتظار تدقّ محليًّا كما على اللوحة.
 */

type ArrivalRow = {
	id: string;
	code: string;
	status: ArrivalStatus;
	source: string;
	arrivedAt: string | Date | null;
	expectedAt: string | Date | null;
	provisionalLabel: string | null;
	presentingComplaint: string;
	leftReason: string | null;
	patient: { id: string; name: string } | null;
	owner: { id: string; name: string } | null;
};

export const ArrivalsTable = ({
	rows,
	isLoading,
	onTriage,
	onConfirmArrival,
	readOnly,
}: {
	rows: ArrivalRow[];
	isLoading: boolean;
	onTriage: (row: ArrivalRow) => void;
	onConfirmArrival: (id: string) => void;
	/** تبويب السجلّ: يُعرض ولا يُتصرَّف فيه */
	readOnly?: boolean;
}) => {
	const [now, setNow] = useState(() => Date.now());
	useEffect(() => {
		const id = setInterval(() => setNow(Date.now()), EMERGENCY_TICK_MS);
		return () => clearInterval(id);
	}, []);

	if (isLoading) {
		return (
			<div className="flex flex-col gap-2">
				{Array.from({ length: 3 }).map((_, i) => (
					<Skeleton
						key={i}
						className="h-16 w-full rounded-md"
					/>
				))}
			</div>
		);
	}

	if (rows.length === 0) {
		return (
			<div className="rounded-md border border-dashed p-8 text-center text-muted-foreground text-sm">
				{readOnly ? "لا سجلّات في هذه الفترة" : "لا وصول بانتظار الفرز"}
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2">
			{rows.map((row) => {
				const minutes = waitedMinutes(row.arrivedAt, now);
				const isEnRoute = row.status === "EN_ROUTE";
				return (
					<div
						key={row.id}
						className="flex items-center gap-3 rounded-md border px-3 py-2"
					>
						<IconPaw className="size-4 shrink-0 text-muted-foreground" />

						<div className="flex min-w-0 flex-col gap-0.5">
							<div className="flex items-center gap-2">
								<span className="font-medium text-sm">
									{row.patient?.name ?? row.provisionalLabel ?? "غير مسجَّل"}
								</span>
								<Badge
									variant="outline"
									className="text-[11px]"
								>
									{ARRIVAL_STATUS_LABELS[row.status]}
								</Badge>
							</div>
							<span className="truncate text-muted-foreground text-xs">
								{row.presentingComplaint}
								{row.leftReason ? ` — ${row.leftReason}` : ""}
							</span>
						</div>

						<div className="ms-auto flex items-center gap-3">
							{!isEnRoute && minutes != null ? (
								<span className="inline-flex items-center gap-1 text-muted-foreground text-xs tabular-nums">
									<IconClock className="size-3.5" />
									{formatWait(minutes)}
								</span>
							) : null}

							{readOnly ? null : isEnRoute ? (
								<Button
									size="sm"
									variant="outline"
									onClick={() => onConfirmArrival(row.id)}
								>
									تأكيد الوصول
								</Button>
							) : (
								<Button
									size="sm"
									onClick={() => onTriage(row)}
								>
									فرز
								</Button>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
};
