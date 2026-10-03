import {
	IconBath,
	IconCalendarEvent,
	IconChecks,
	IconClipboardList,
	IconHandStop,
	IconPackageExport,
	IconScissors,
	IconWind,
} from "@tabler/icons-react";
import type { ReactNode } from "react";

import type { GroomingStatus } from "@/generated/prisma/enums";
import {
	GROOMING_BOARD_COLUMNS,
	type GroomingSessionCard,
} from "@sanad/contracts/runtime/server/grooming/grooming.type";
import {
	type GROOMING_PATHWAY,
	GROOMING_STATUS_LABELS,
} from "@sanad/contracts/runtime/server/grooming/grooming.workflow";

export type GroomingAccent = "neutral" | "amber" | "rose" | "indigo" | "blue" | "green";

export type GroomingColumn = {
	id: GroomingStatus;
	name: string;
	count: number;
	icon: ReactNode;
	accent: GroomingAccent;
};

/** الحقول المسطّحة (id/column/name) يشترطها KanbanItemProps */
export type GroomingCardData = {
	id: string;
	column: GroomingStatus;
	name: string;
	card: GroomingSessionCard;
};

const META: Record<
	(typeof GROOMING_BOARD_COLUMNS)[number],
	{ icon: ReactNode; accent: GroomingAccent }
> = {
	SCHEDULED: { icon: <IconCalendarEvent className="size-4" />, accent: "neutral" },
	CHECK_IN: { icon: <IconHandStop className="size-4" />, accent: "amber" },
	INTAKE: { icon: <IconClipboardList className="size-4" />, accent: "rose" },
	IN_PROGRESS: { icon: <IconScissors className="size-4" />, accent: "indigo" },
	FINISHING: { icon: <IconWind className="size-4" />, accent: "blue" },
	READY: { icon: <IconBath className="size-4" />, accent: "green" },
	PICKED_UP: { icon: <IconPackageExport className="size-4" />, accent: "green" },
};

/**
 * أعمدة لوحة التجميل بترتيب سير العمل.
 *
 * «مكتملة» و«ملغاة» و«لم يحضر» و«محوَّلة للمدرّب» ليست أعمدة — الجلسة المنتهية
 * تغادر اللوحة وتبقى مقروءة في الجدول وعبر الـ API، تمامًا كما تفعل لوحة التحاليل
 * مع الملغاة. لوحةٌ تحتفظ بكل ما انتهى تكفّ عن كونها لوحة عمل.
 */
export const GROOMING_COLUMNS: GroomingColumn[] = GROOMING_BOARD_COLUMNS.map((status) => ({
	id: status,
	name: GROOMING_STATUS_LABELS[status],
	count: 0,
	icon: META[status].icon,
	accent: META[status].accent,
}));

/**
 * أيقونة لكل خطوة على المسار — يستعملها مسار سير العمل داخل الورقة.
 * المسار أطول من أعمدة اللوحة بخطوة: «مكتملة» ليست عمودًا لكنها خطوة.
 */
export const GROOMING_STATUS_ICONS: Record<(typeof GROOMING_PATHWAY)[number], ReactNode> = {
	SCHEDULED: <IconCalendarEvent className="size-3" />,
	CHECK_IN: <IconHandStop className="size-3" />,
	INTAKE: <IconClipboardList className="size-3" />,
	IN_PROGRESS: <IconScissors className="size-3" />,
	FINISHING: <IconWind className="size-3" />,
	READY: <IconBath className="size-3" />,
	PICKED_UP: <IconPackageExport className="size-3" />,
	COMPLETED: <IconChecks className="size-3" />,
};
