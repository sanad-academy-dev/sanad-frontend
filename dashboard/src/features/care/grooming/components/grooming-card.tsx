import {
	IconAlertTriangleFilled,
	IconBug,
	IconCash,
	IconClipboardList,
	IconClock,
	IconFlame,
	IconScissors,
	IconStethoscope,
} from "@tabler/icons-react";
import type { ReactNode } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { GroomingCardData } from "@/features/care/grooming/data/grooming-columns";
import type { GroomingStatus } from "@/generated/prisma/enums";
import { GroomingLane, MattingGrade, ParasiteFinding } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import {
	GROOMING_PATHWAY,
	GROOMING_STATUS_LABELS,
	MATTING_GRADE_LABELS,
} from "@sanad/contracts/runtime/server/grooming/grooming.workflow";

export type GroomingCardTab = "overview" | "workflow" | "notes" | "invoice";

const timeFmt = new Intl.DateTimeFormat("ar", { hour: "2-digit", minute: "2-digit" });
const timeOf = (v: Date | string | null) => (v ? timeFmt.format(new Date(v)) : "—");

const initialsOf = (name: string) =>
	name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();

/** الحالة التالية على المسار — الزرّ يفعل ما يقوله بالضبط */
const nextStatusOf = (status: GroomingStatus): GroomingStatus | null => {
	const i = (GROOMING_PATHWAY as readonly GroomingStatus[]).indexOf(status);
	return i >= 0 && i < GROOMING_PATHWAY.length - 1 ? GROOMING_PATHWAY[i + 1] : null;
};

/** أداة سريعة على البطاقة — أيقونة أكبر بحشو ضيّق */
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

/**
 * بطاقة جلسة تجميل على اللوحة — نفس بنية بطاقة التحليل.
 *
 * الشارات ليست زينة: كل واحدة خطر يجب أن يراه المُجمِّل قبل أن يلمس الطفل —
 * منع التجفيف الحارّ، الطفيليات، التعقّد الشديد، المسار الطبي، تجاوز الوقت الموعود.
 */
export function GroomingCard({
	data,
	onSelect,
	onAdvance,
}: {
	data: GroomingCardData;
	onSelect: (id: string, tab?: GroomingCardTab) => void;
	onAdvance?: (id: string, to: GroomingStatus) => void;
}) {
	const card = data.card;
	const next = nextStatusOf(card.status);

	const late =
		card.promisedReadyAt != null &&
		card.readyAt == null &&
		new Date(card.promisedReadyAt) < new Date();
	const heatRisk =
		card.intake?.heatDryProhibitedSnapshot === true ||
		card.patient.animalStrain?.isBrachycephalic === true;
	const parasites =
		card.intake?.parasiteFinding != null &&
		card.intake.parasiteFinding !== ParasiteFinding.NONE;
	const matted =
		card.intake?.mattingGrade === MattingGrade.SEVERE ||
		card.intake?.mattingGrade === MattingGrade.PELTED;

	// السطر تحت اسم الطفل: النوع ثم السلالة ثم وليّ الأمر
	const patientMeta = [
		card.patient.animalType?.arName,
		card.patient.animalStrain?.arName,
		card.owner?.name,
	]
		.filter(Boolean)
		.join(" · ");

	return (
		<Card
			className="cursor-pointer gap-3 rounded-md border bg-background p-3 shadow-sm"
			dir="rtl"
			onClick={() => onSelect(card.id)}
		>
			{/* الطفل: الاسم ومعه الكود وشارة الخطر الأبرز يسارًا */}
			<div className="flex flex-col gap-0.5">
				<div className="flex items-center justify-between gap-2">
					<div className="flex min-w-0 items-center gap-1.5">
						<Avatar size="sm">
							<AvatarFallback className="bg-primary font-semibold text-[10px] text-white">
								{initialsOf(card.patient.name)}
							</AvatarFallback>
						</Avatar>
						<h3 className="min-w-0 truncate font-bold text-foreground text-sm">
							{card.patient.name}
						</h3>
					</div>
					<div className="flex shrink-0 items-center gap-1.5">
						{heatRisk && (
							<Badge className="gap-1 border-red-200 bg-red-50 py-0.5 text-[10px] text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
								<IconFlame className="size-3" />
								لا تجفيف حارّ
							</Badge>
						)}
						<span className="font-medium text-muted-foreground text-xs tabular-nums">
							{card.code}
						</span>
					</div>
				</div>
				<p className="truncate text-muted-foreground text-xs">{patientMeta}</p>
			</div>

			{/* الموعد والوقت الموعود للاستلام */}
			<div className="flex items-center gap-1.5">
				<IconClock className="size-3.5 shrink-0 text-muted-foreground" />
				<span className="truncate font-semibold text-foreground text-sm tabular-nums">
					{timeOf(card.scheduledAt)}
					{card.promisedReadyAt ? ` ← ${timeOf(card.promisedReadyAt)}` : ""}
				</span>
			</div>

			{/* الشارات — المسار والتعقّد والطفيليات والتأخّر */}
			<div className="flex flex-wrap items-center gap-1.5">
				<Badge
					variant="outline"
					className="py-0.5 text-[10px]"
				>
					{GROOMING_STATUS_LABELS[card.status]}
				</Badge>
				{card.lane === GroomingLane.MEDICAL && (
					<Badge
						variant="outline"
						className="gap-1 border-indigo-200 bg-indigo-50 py-0.5 text-[10px] text-indigo-700"
					>
						<IconStethoscope className="size-3" />
						مسار طبي
					</Badge>
				)}
				{matted && card.intake?.mattingGrade && (
					<Badge
						variant="outline"
						className="gap-1 border-amber-200 bg-amber-50 py-0.5 text-[10px] text-amber-700"
					>
						تعقّد {MATTING_GRADE_LABELS[card.intake.mattingGrade]}
					</Badge>
				)}
				{parasites && (
					<Badge
						variant="outline"
						className="gap-1 border-rose-200 bg-rose-50 py-0.5 text-[10px] text-rose-700"
					>
						<IconBug className="size-3" />
						طفيليات
					</Badge>
				)}
				{late && (
					<Badge
						variant="outline"
						className="gap-1 border-red-200 bg-red-50 py-0.5 text-[10px] text-red-700"
					>
						<IconAlertTriangleFilled className="size-3" />
						تجاوز الموعد
					</Badge>
				)}
			</div>

			{/* المُجمِّل يمينًا والتسعيرة يسارًا */}
			<div className="flex items-center justify-between gap-2">
				{card.groomer?.user?.name ? (
					<div className="flex min-w-0 items-center gap-1.5">
						<Avatar size="sm">
							<AvatarFallback className="bg-blue-600 font-semibold text-[10px] text-white">
								{initialsOf(card.groomer.user.name)}
							</AvatarFallback>
						</Avatar>
						<span className="truncate font-medium text-primary text-xs">
							مُجمِّل: {card.groomer.user.name}
						</span>
					</div>
				) : (
					<span className="text-muted-foreground text-xs">بلا مُجمِّل</span>
				)}
				<span className="shrink-0 font-medium text-foreground text-xs tabular-nums">
					{Number(card.quoteTotal)} ر.س
				</span>
			</div>

			{/* الإجراء التالي — ينقل الجلسة خطوةً واحدة، والبوابات تُقيَّم على الخادم */}
			{next && onAdvance && (
				<Button
					size="sm"
					className={cn("w-full gap-1.5 bg-indigo-600 primaryhover:bg-indigo-700")}
					onClick={(e) => {
						e.stopPropagation();
						onAdvance(card.id, next);
					}}
				>
					<IconScissors className="size-3.5" />
					نقل إلى «{GROOMING_STATUS_LABELS[next]}»
				</Button>
			)}

			<Separator />

			{/* أدوات سريعة — كلٌّ يفتح ما يشير إليه من ورقة الجلسة */}
			<div className="-mx-1 flex items-center gap-0.5">
				<QuickTool
					label="الفحص القبلي"
					onClick={() => onSelect(card.id, "workflow")}
				>
					<IconClipboardList className="size-4" />
				</QuickTool>
				<QuickTool
					label="الملاحظات والحوادث"
					onClick={() => onSelect(card.id, "notes")}
				>
					<IconAlertTriangleFilled className="size-4" />
					{card._count.findings + card._count.incidents > 0 && (
						<span className="font-medium text-[10px] tabular-nums">
							{card._count.findings + card._count.incidents}
						</span>
					)}
				</QuickTool>
				<QuickTool
					label="الفاتورة والتسعيرة"
					onClick={() => onSelect(card.id, "invoice")}
				>
					<IconCash className="size-4" />
				</QuickTool>
			</div>
		</Card>
	);
}
