import {
	IconAlertTriangleFilled,
	IconArrowRight,
	IconBodyScan,
	IconCalendarClock,
	IconCash,
	IconDeviceDesktopAnalytics,
	IconDroplet,
	IconPhoto,
	IconReportMedical,
} from "@tabler/icons-react";
import type { ReactNode } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
	NO_PRIORITY_OPTION,
	PRIORITY_META,
	PRIORITY_OPTIONS,
} from "@/features/appointments/data/status-meta";
import { RADIOLOGY_STAGE_META } from "@/features/services/radiology/data/radiology-data";
import { useUpdateRadiologyPriority } from "@/features/services/radiology/hooks/use-radiology-mutations";
import type { RadiologySheetIntent } from "@/features/services/radiology/stores/selected-radiology-order.store";
import type { RadiologyItemCardData } from "@/features/services/radiology/types/radiology.types";
import { formatScheduleLabel } from "@/features/services/radiology/utils/schedule-label";
import { RadiologyLaterality, RadiologyStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import {
	canLeaveRadiologyQueue,
	LATERALITY_LABELS,
	RADIOLOGY_PAYMENT_META,
	radiologyPaymentBlockMessage,
	radiologyPaymentStatus,
} from "@sanad/contracts/runtime/server/radiology/radiology.type";
import {
	canChangeRadiologyPriority,
	deriveRadiologyOrderStatus,
	isRadiologyDue,
	RADIOLOGY_PRIORITY_LOCKED_MESSAGE,
} from "@sanad/contracts/runtime/server/radiology/radiology.workflow";
import { MODALITY_META } from "@sanad/contracts/runtime/server/radiology/radiology-procedure.type";

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

const initialsOf = (name: string) =>
	name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();

// بطاقة فحص واحد — الطلب متعدّد الفحوصات يظهر بطاقةً لكل فحص في عموده،
// وسياق الطلب (الطفل، السداد، الأولوية) يتكرّر على بطاقات الأشقّاء.
export function RadiologyCard({
	card,
	onSelect,
}: {
	card: RadiologyItemCardData;
	onSelect?: (id: string, intent?: RadiologySheetIntent) => void;
}) {
	const { item, order } = card;
	const priorityMeta = order.priority ? PRIORITY_META[order.priority] : null;
	const payment = radiologyPaymentStatus(order);
	const paymentMeta = RADIOLOGY_PAYMENT_META[payment];
	const { updatePriority, isPending: isChangingPriority } = useUpdateRadiologyPriority();
	// الأولوية على مستوى الطلب — بوّابتها حالة الطلب المشتقّة لا حالة هذا الفحص
	const canEditPriority = canChangeRadiologyPriority(deriveRadiologyOrderStatus(order.items));

	// عدد الصور المرفوعة = مجموع صور كل السلاسل في كل دراسات هذا الفحص
	const imagesCount = item.studies.reduce(
		(sum, study) => sum + study.series.reduce((s, series) => s + series.instances.length, 0),
		0,
	);

	// السطر تحت اسم الطفل: الكود ثم النوع/السلالة ثم وليّ الأمر
	const patientMeta = [
		order.patient.code,
		[order.patient.animalType.arName, order.patient.animalStrain?.arName]
			.filter(Boolean)
			.join(" / "),
		order.owner.name,
	]
		.filter(Boolean)
		.join(" · ");

	/** يفتح الشيت محصورًا في هذا الفحص، ولوحته الجانبية مفتوحة */
	const openItem = (intent?: RadiologySheetIntent) => {
		onSelect?.(order.id, { itemId: item.id, focusItemId: item.id, ...intent });
	};

	/** يفتح الشيت محصورًا في هذا الفحص دون فتح لوحته (الفاتورة مثلًا) */
	const openScoped = (intent?: RadiologySheetIntent) => {
		onSelect?.(order.id, { focusItemId: item.id, ...intent });
	};

	// زر الإجراء يفعل ما يقوله — نفس فعل الزر الداخلي الذي يشير إليه،
	// على هذا الفحص وحده لا على الطلب كله.
	const action = (() => {
		switch (item.status) {
			case RadiologyStatus.QUEUE:
				return {
					label: "تأكيد طلب الأشعة",
					// البوابة نفسها المطبَّقة داخل اللوحة وفي الخادم
					blockedReason: canLeaveRadiologyQueue(payment)
						? null
						: radiologyPaymentBlockMessage(payment),
					run: () => openItem(),
				};
			case RadiologyStatus.SCHEDULED:
				return {
					label: "بدء تحضير الطفل",
					// «مجدول» محكوم بالسداد أيضًا: الطلب المنشأ مباشرةً يبدأ هنا.
					blockedReason: canLeaveRadiologyQueue(payment)
						? null
						: radiologyPaymentBlockMessage(payment),
					run: () => openItem(),
				};
			case RadiologyStatus.PREPARATION:
				return { label: "إكمال تحضير الطفل", blockedReason: null, run: () => openItem() };
			case RadiologyStatus.IMAGING:
				return { label: "التصوير ورفع الصور", blockedReason: null, run: () => openItem() };
			case RadiologyStatus.REPORTING:
				return { label: "كتابة التقرير", blockedReason: null, run: () => openItem() };
			case RadiologyStatus.UNDER_REVIEW:
				return { label: "مراجعة التقرير", blockedReason: null, run: () => openItem() };
			case RadiologyStatus.COMPLETED:
				return {
					label: "عرض التقرير",
					blockedReason: null,
					run: () => openItem({ tab: "details" }),
				};
			default:
				return { label: "عرض الطلب", blockedReason: null, run: () => openItem() };
		}
	})();

	return (
		<Card
			className="cursor-pointer gap-3 rounded-md border bg-background p-3 shadow-sm"
			dir="rtl"
			onClick={() => openItem()}
		>
			{/* الطفل: الاسم ومعه كود الطلب وشارة "عاجلة" يسارًا، ثم الكود والنوع ووليّ الأمر */}
			<div className="flex flex-col gap-0.5">
				<div className="flex items-center justify-between gap-2">
					<div className="flex min-w-0 items-center gap-1.5">
						<Avatar size="sm">
							<AvatarFallback className="bg-primary text-[10px] font-semibold text-white">
								{initialsOf(order.patient.name)}
							</AvatarFallback>
						</Avatar>
						<h3 className="min-w-0 truncate text-sm font-bold text-foreground">
							{order.patient.name}
						</h3>
					</div>
					<div className="flex shrink-0 items-center gap-1.5">
						{/* [IP2] مطلوب من داخل إقامة تنويم — يُحاسَب على فاتورتها لا هنا */}
						{order.inpatientStayId && (
							<Badge
								variant="outline"
								className="gap-1 border-sky-200 bg-sky-50 py-0.5 text-[10px] text-sky-700 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-300"
							>
								تنويم
							</Badge>
						)}
						{order.isUrgent && (
							<Badge className="gap-1 border-red-200 bg-red-50 py-0.5 text-[10px] text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
								<IconAlertTriangleFilled className="size-3" />
								عاجلة
							</Badge>
						)}
						<span className="text-xs font-medium tabular-nums text-muted-foreground">
							{order.code}
						</span>
					</div>
				</div>
				<p className="truncate text-xs text-muted-foreground">{patientMeta}</p>
			</div>

			{/* الفحص الذي تمثّله البطاقة — كل بطاقة فحص مستقل تمامًا،
			    وكود الطلب أعلاه هو الرابط الوحيد بين فحوصات الطلب الواحد */}
			<div className="flex items-center gap-1.5">
				<IconBodyScan className="size-3.5 shrink-0 text-muted-foreground" />
				<span className="min-w-0 truncate text-sm font-semibold text-foreground">
					{item.service.name}
				</span>
				<span className="shrink-0 text-[10px] font-medium tabular-nums text-muted-foreground">
					{item.accession}
				</span>
			</div>

			{/* الشارات — طريقة التصوير والمنطقة والجهة والتباين والمرحلة والصور والسداد */}
			<div className="flex flex-wrap items-center gap-1.5">
				<Badge
					variant="outline"
					className="py-0.5 text-[10px]"
				>
					{MODALITY_META[item.modality].label}
				</Badge>
				{item.bodyPart && (
					<Badge
						variant="outline"
						className="py-0.5 text-[10px]"
					>
						{item.bodyPart}
					</Badge>
				)}
				{item.laterality !== RadiologyLaterality.NONE && (
					<Badge
						variant="outline"
						className="py-0.5 text-[10px]"
					>
						{LATERALITY_LABELS[item.laterality]}
					</Badge>
				)}
				{item.withContrast && (
					<Badge
						variant="outline"
						className="gap-1 border-amber-200 bg-amber-50 py-0.5 text-[10px] text-amber-700"
					>
						<IconDroplet className="size-3" />
						بالتباين
					</Badge>
				)}
				{/* المرحلة الفرعية — لها معنى داخل «تحضير الطفل» و«التصوير» فقط */}
				{(item.status === RadiologyStatus.PREPARATION ||
					item.status === RadiologyStatus.IMAGING) && (
					<Badge
						variant="outline"
						className={cn("py-0.5 text-[10px]", RADIOLOGY_STAGE_META[item.stage].className)}
					>
						{RADIOLOGY_STAGE_META[item.stage].label}
					</Badge>
				)}
				{imagesCount > 0 && (
					<Badge
						variant="outline"
						className="gap-1 border-emerald-200 bg-emerald-50 py-0.5 text-[10px] text-emerald-700"
					>
						<IconPhoto className="size-3" />
						{imagesCount} صورة
					</Badge>
				)}
				{/* حالة السداد — تظهر ما دام الفحص محكومًا بها (الطلبات ومجدول) */}
				{(item.status === RadiologyStatus.QUEUE ||
					item.status === RadiologyStatus.SCHEDULED) && (
					<Badge
						variant="outline"
						className={cn("gap-1 py-0.5 text-[10px]", paymentMeta.className)}
					>
						<IconCash className="size-3" />
						{paymentMeta.label}
					</Badge>
				)}
				{/* الأولوية — تُغيَّر من سهم الأدوات السريعة أدناه.
				    "عاجلة" لها شارتها بالأعلى فلا نُكرّرها. */}
				{priorityMeta && !order.isUrgent && (
					<Badge
						variant="outline"
						className={cn("py-0.5 text-[10px]", priorityMeta.className)}
					>
						{priorityMeta.label}
					</Badge>
				)}
				{item.rejectedAt !== null && (
					<Badge
						variant="outline"
						className="gap-1 border-rose-200 bg-rose-50 py-0.5 text-[10px] text-rose-700"
					>
						تم رفضها
					</Badge>
				)}
				{item.report?.criticalFinding && (
					<Badge
						variant="outline"
						className="gap-1 border-red-200 bg-red-50 py-0.5 text-[10px] text-red-700"
					>
						<IconAlertTriangleFilled className="size-3" />
						نتيجة حرجة
					</Badge>
				)}
			</div>

			{/* الموعد — يهمّ ما دام الفحص مجدولًا؛ بعد بدئه صار الموعد تاريخًا */}
			{item.status === RadiologyStatus.SCHEDULED && item.scheduledAt && (
				<div className="flex items-center gap-1.5 text-xs">
					<IconCalendarClock
						className={cn(
							"size-3.5 shrink-0",
							isRadiologyDue(item.scheduledAt) ? "text-amber-600" : "text-muted-foreground",
						)}
					/>
					<span
						className={cn(
							"truncate tabular-nums",
							isRadiologyDue(item.scheduledAt)
								? "font-medium text-amber-700"
								: "text-muted-foreground",
						)}
					>
						{formatScheduleLabel(item.scheduledAt)}
					</span>
				</div>
			)}

			{/* الجهاز والقاعة — يظهران بعد تعيينهما في مرحلة التحضير */}
			{(item.execution?.machineName || item.execution?.roomName) && (
				<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
					<IconDeviceDesktopAnalytics className="size-3.5 shrink-0" />
					<span className="truncate">
						{[item.execution?.machineName, item.execution?.roomName]
							.filter(Boolean)
							.join(" · ")}
					</span>
				</div>
			)}

			{/* فنّي الأشعة يمينًا والمدرّب الطالب يسارًا */}
			<div className="flex items-center justify-between gap-2">
				{item.assignedTo ? (
					<div className="flex min-w-0 items-center gap-1.5">
						<Avatar size="sm">
							<AvatarFallback className="bg-blue-600 text-[10px] font-semibold text-white">
								{initialsOf(item.assignedTo.name)}
							</AvatarFallback>
						</Avatar>
						<span className="truncate text-xs font-medium text-primary">
							فنّي: {item.assignedTo.name}
						</span>
					</div>
				) : (
					<span className="text-xs text-muted-foreground">بلا فنّي</span>
				)}
				<span className="shrink-0 truncate text-xs text-muted-foreground">
					{order.requestedBy?.name ?? "—"}
				</span>
			</div>

			{/* الإجراء التالي — يفعل ما يقوله، ويُقفل مع سبب المنع عند وجوده */}
			<Button
				size="sm"
				className="w-full gap-1.5 bg-indigo-600 primaryhover:bg-indigo-700"
				disabled={!!action.blockedReason}
				title={action.blockedReason ?? undefined}
				onClick={(e) => {
					e.stopPropagation();
					action.run();
				}}
			>
				<IconBodyScan className="size-3.5" />
				{action.label}
			</Button>

			<Separator />

			{/* أدوات سريعة — كلٌّ يفتح ما يشير إليه. أيقونات أكبر بحشو أقلّ. */}
			<div className="-mx-1 flex items-center gap-0.5">
				{/* السهم يفتح قائمة الأولوية (أولوية الطلب كله) — ويُقفل بعد بدء تحضير الطفل */}
				<DropdownMenu dir="rtl">
					<DropdownMenuTrigger
						asChild
						onClick={(e) => e.stopPropagation()}
					>
						<Button
							type="button"
							size="icon-sm"
							variant="ghost"
							aria-label="تغيير الأولوية"
							title={canEditPriority ? "تغيير الأولوية" : RADIOLOGY_PRIORITY_LOCKED_MESSAGE}
							disabled={!canEditPriority || isChangingPriority}
							className="h-7 w-auto gap-1 px-1.5 text-muted-foreground hover:text-foreground"
						>
							<IconArrowRight className="size-4 rtl:rotate-180" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="start"
						onClick={(e) => e.stopPropagation()}
					>
						{/* نفس قائمة أولوية الزيارة: أيقونة لكل درجة و«عاجلة» أولًا */}
						{PRIORITY_OPTIONS.map(({ value, label, icon: Icon, iconClassName }) => (
							<DropdownMenuItem
								key={value}
								className="gap-2"
								disabled={isChangingPriority || order.priority === value}
								onSelect={() => {
									void updatePriority({ id: order.id, priority: value }).catch(() => {});
								}}
							>
								<Icon className={cn("size-4", iconClassName)} />
								{label}
							</DropdownMenuItem>
						))}
						{order.priority && (
							<DropdownMenuItem
								className="gap-2"
								disabled={isChangingPriority}
								onSelect={() => {
									void updatePriority({ id: order.id, priority: null }).catch(() => {});
								}}
							>
								<NO_PRIORITY_OPTION.icon
									className={cn("size-4", NO_PRIORITY_OPTION.iconClassName)}
								/>
								{NO_PRIORITY_OPTION.label}
							</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
				<QuickTool
					label="عرض التقرير"
					onClick={() => openItem({ tab: "details" })}
				>
					<IconReportMedical className="size-4" />
				</QuickTool>
				<QuickTool
					label="فاتورة الطلب"
					onClick={() => openScoped({ tab: "invoice" })}
				>
					<IconCash className="size-4" />
				</QuickTool>
			</div>
		</Card>
	);
}
