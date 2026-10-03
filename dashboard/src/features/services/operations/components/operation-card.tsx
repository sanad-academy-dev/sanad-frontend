import {
	IconAlertTriangleFilled,
	IconClipboardCheck,
	IconClock,
	IconDoor,
	IconMessage,
	IconScissors,
	IconVaccine,
} from "@tabler/icons-react";
import type { ReactNode } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useMoveOperation } from "@/features/services/operations/hooks/use-operation-mutations";
import { useSelectedOperationStore } from "@/features/services/operations/stores/selected-operation.store";
import type { OperationCardData } from "@/features/services/operations/types/operations.types";
import { Gender } from "@/generated/prisma/enums";
import {
	OPERATION_STATUS_LABELS,
	OPERATION_TIER_LABELS,
	operationPathwayFor,
} from "@sanad/contracts/runtime/server/operations/operations.workflow";

const GENDER_LABELS: Record<Gender, string> = {
	[Gender.MALE]: "ذكر",
	[Gender.FEMALE]: "أنثى",
	[Gender.UNKNOWN]: "غير محدد",
};

/** أداة سريعة على البطاقة — أيقونة أكبر بحشو ضيّق (نفس بطاقة التحاليل) */
function QuickTool({
	label,
	onClick,
	children,
}: {
	label: string;
	onClick: () => void;
	children: ReactNode;
}) {
	return (
		<Button
			type="button"
			size="icon-sm"
			variant="ghost"
			aria-label={label}
			title={label}
			className="h-7 w-auto gap-1 px-1.5 text-muted-foreground hover:text-foreground"
			onClick={(e) => {
				e.stopPropagation();
				onClick();
			}}
		>
			{children}
		</Button>
	);
}

// قائمة التحضير المكتملة تُخضَّر — الناقصة تبقى محايدة
const checklistBadgeClass = (data: OperationCardData) =>
	data.checklistDone === data.checklistTotal
		? "gap-1 border-emerald-200 bg-emerald-50 py-0.5 text-[10px] text-emerald-700"
		: "gap-1 py-0.5 text-[10px]";

const initialsOf = (name: string) =>
	name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();

export function OperationCard({ data }: { data: OperationCardData }) {
	const { moveOperation, isPending } = useMoveOperation();
	const openCase = useSelectedOperationStore((s) => s.openCase);
	const openWork = useSelectedOperationStore((s) => s.openWork);

	// السطر تحت اسم الطفل: العمر ثم الجنس ثم وليّ الأمر
	const patientMeta = [
		data.patient.age != null ? `${data.patient.age} سنة` : null,
		GENDER_LABELS[data.patient.gender],
		data.owner.name,
	]
		.filter(Boolean)
		.join(" · ");

	// الحالة التالية وفق مسار الدرجة — المسار المختصر للصغرى يقفز أعمدة
	const pathway = operationPathwayFor(data.tier);
	const pathwayIndex = pathway.indexOf(data.raw.status);
	const nextStatus =
		pathwayIndex >= 0 && pathwayIndex < pathway.length - 1 ? pathway[pathwayIndex + 1] : null;

	return (
		<Card
			className="cursor-pointer gap-3 rounded-md border bg-background p-3 shadow-sm"
			dir="rtl"
			onClick={() => openCase(data.id)}
		>
			{/* الطفل: الاسم ومعه الكود وشارة "عاجلة" يسارًا، ثم العمر والجنس ووليّ الأمر */}
			<div className="flex flex-col gap-0.5">
				<div className="flex items-center justify-between gap-2">
					<div className="flex min-w-0 items-center gap-1.5">
						<Avatar size="sm">
							<AvatarFallback className="bg-primary text-[10px] font-semibold text-white">
								{initialsOf(data.patient.name)}
							</AvatarFallback>
						</Avatar>
						<h3 className="min-w-0 truncate text-sm font-bold text-foreground">
							{data.patient.name}
						</h3>
					</div>
					<div className="flex shrink-0 items-center gap-1.5">
						{data.isUrgent && (
							<Badge className="gap-1 border-red-200 bg-red-50 py-0.5 text-[10px] text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
								<IconAlertTriangleFilled className="size-3" />
								عاجلة
							</Badge>
						)}
						<span className="text-xs font-medium tabular-nums text-muted-foreground">
							{data.code}
						</span>
					</div>
				</div>
				<p className="truncate text-xs text-muted-foreground">{patientMeta}</p>
			</div>

			{/* العملية المطلوبة */}
			<div className="flex items-center gap-1.5">
				<IconScissors className="size-3.5 shrink-0 text-muted-foreground" />
				<span className="truncate text-sm font-semibold text-foreground">{data.name}</span>
			</div>

			{/* الشارات — التوقيت والمدة والتخدير والقاعة وقائمة التحضير */}
			<div className="flex flex-wrap items-center gap-1.5">
				<Badge
					variant="outline"
					className="gap-1 py-0.5 text-[10px]"
				>
					<IconClock className="size-3" />
					{data.timeLabel}
				</Badge>
				<Badge
					variant="outline"
					className="py-0.5 text-[10px]"
				>
					{data.durationLabel}
				</Badge>
				<Badge
					variant="outline"
					className="gap-1 py-0.5 text-[10px]"
				>
					<IconVaccine className="size-3" />
					{data.anesthesiaLabel}
				</Badge>
				<Badge
					variant="outline"
					className="gap-1 py-0.5 text-[10px]"
				>
					<IconDoor className="size-3" />
					{data.room}
				</Badge>
				<Badge
					variant="outline"
					className="py-0.5 text-[10px]"
				>
					{OPERATION_TIER_LABELS[data.tier]}
				</Badge>
				{/* قوائم التحقق تظهر مع OP2 — لا شارة تقدّم زائفة قبلها */}
				{data.checklistTotal > 0 && (
					<Badge
						variant="outline"
						className={checklistBadgeClass(data)}
					>
						<IconClipboardCheck className="size-3" />
						التحضير {data.checklistDone}/{data.checklistTotal}
					</Badge>
				)}
			</div>

			{/* الجرّاح يمينًا ومدرّب التخدير يسارًا */}
			<div className="flex items-center justify-between gap-2">
				<div className="flex min-w-0 items-center gap-1.5">
					<Avatar size="sm">
						<AvatarFallback className="bg-blue-600 text-[10px] font-semibold text-white">
							{initialsOf(data.surgeon.name)}
						</AvatarFallback>
					</Avatar>
					<span className="truncate text-xs font-medium text-primary">
						جرّاح: {data.surgeon.name}
					</span>
				</div>
				<span className="shrink-0 truncate text-xs text-muted-foreground">
					{data.anesthetist ? data.anesthetist.name : "بلا مخدِّر"}
				</span>
			</div>

			{/* الإجراء التالي — نقل للحالة التالية وفق مسار الدرجة؛ الخادم يفرض البوابات */}
			{nextStatus && (
				<Button
					size="sm"
					disabled={isPending}
					className="w-full gap-1.5 bg-indigo-600 primaryhover:bg-indigo-700"
					onClick={(e) => {
						e.stopPropagation();
						void moveOperation({ id: data.id, to: nextStatus }).catch(() => {});
					}}
				>
					<IconScissors className="size-3.5" />
					الانتقال إلى «{OPERATION_STATUS_LABELS[nextStatus]}»
				</Button>
			)}

			<Separator />

			{/* أدوات سريعة — ورقة التخدير والتعليقات تصلان في OP3/OP6 */}
			<div className="-mx-1 flex items-center gap-0.5">
				<QuickTool
					label="قوائم الأمان"
					onClick={() => openWork(data.id)}
				>
					<IconClipboardCheck className="size-4" />
				</QuickTool>
				<QuickTool
					label="ورقة التخدير والعملية"
					onClick={() => openWork(data.id)}
				>
					<IconVaccine className="size-4" />
				</QuickTool>
				<QuickTool
					label="التعليقات"
					onClick={() => openCase(data.id, "comments")}
				>
					<IconMessage className="size-4" />
					{data.commentsCount > 0 && (
						<span className="text-[10px] font-medium tabular-nums">{data.commentsCount}</span>
					)}
				</QuickTool>
			</div>
		</Card>
	);
}
