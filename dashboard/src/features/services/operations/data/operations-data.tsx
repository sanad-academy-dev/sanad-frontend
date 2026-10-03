import {
	IconBed,
	IconCalendarClock,
	IconCalendarRepeat,
	IconCircleCheck,
	IconClipboardList,
	IconDoorExit,
	IconScissors,
	IconVaccine,
} from "@tabler/icons-react";
import type { OperationColumn } from "@/features/services/operations/types/operations.types";
// التسميات من آلة الحالات — المصدر الواحد المشترك مع الخادم
import { OPERATION_STATUS_LABELS } from "@sanad/contracts/runtime/server/operations/operations.workflow";

export { OPERATION_STATUS_LABELS };

// أعمدة اللوحة الثمانية بترتيب سير العمل
export const OPERATIONS_COLUMNS: OperationColumn[] = [
	{
		id: "SCHEDULED",
		name: OPERATION_STATUS_LABELS.SCHEDULED,
		count: 0,
		icon: <IconCalendarClock className="size-4" />,
		accent: "amber",
	},
	{
		id: "PREP",
		name: OPERATION_STATUS_LABELS.PREP,
		count: 0,
		icon: <IconClipboardList className="size-4" />,
		accent: "orange",
	},
	{
		id: "ANESTHESIA",
		name: OPERATION_STATUS_LABELS.ANESTHESIA,
		count: 0,
		icon: <IconVaccine className="size-4" />,
		accent: "rose",
	},
	{
		id: "SURGERY",
		name: OPERATION_STATUS_LABELS.SURGERY,
		count: 0,
		icon: <IconScissors className="size-4" />,
		accent: "indigo",
	},
	{
		id: "RECOVERY",
		name: OPERATION_STATUS_LABELS.RECOVERY,
		count: 0,
		icon: <IconBed className="size-4" />,
		accent: "violet",
	},
	{
		id: "DISCHARGE",
		name: OPERATION_STATUS_LABELS.DISCHARGE,
		count: 0,
		icon: <IconDoorExit className="size-4" />,
		accent: "blue",
	},
	{
		id: "FOLLOW_UP",
		name: OPERATION_STATUS_LABELS.FOLLOW_UP,
		count: 0,
		icon: <IconCalendarRepeat className="size-4" />,
		accent: "teal",
	},
	{
		id: "COMPLETED",
		name: OPERATION_STATUS_LABELS.COMPLETED,
		count: 0,
		icon: <IconCircleCheck className="size-4" />,
		accent: "green",
	},
];

// زر الإجراء التالي على البطاقة يُشتق من مسار الدرجة (operationPathwayFor)
// داخل OperationCard — لا قائمة ثابتة، فالمسار المختصر للصغرى يقفز أعمدة.
