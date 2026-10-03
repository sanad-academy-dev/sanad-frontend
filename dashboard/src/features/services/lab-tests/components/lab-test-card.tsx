import {
	IconAlertTriangleFilled,
	IconArrowRight,
	IconCash,
	IconChartBar,
	IconMessage,
	IconTestPipe,
} from "@tabler/icons-react";
import type { ReactNode } from "react";
import { useState } from "react";

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
import { LabTestConfirmDialog } from "@/features/services/lab-tests/components/lab-test-confirm-dialog";
import { useUpdateLabPriority } from "@/features/services/lab-tests/hooks/use-lab-test-mutations";
import type { LabTestSheetIntent } from "@/features/services/lab-tests/stores/selected-lab-test.store";
import type { LabItemCardData } from "@/features/services/lab-tests/types/lab-tests.types";
import { Gender, LabResultFlag, LabTestStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import {
	canLeaveQueue,
	LAB_PAYMENT_META,
	labPaymentStatus,
	paymentBlockMessage,
} from "@sanad/contracts/runtime/server/lab-tests/lab-tests.type";
import {
	canChangePriority,
	deriveOrderStatus,
	PRIORITY_LOCKED_MESSAGE,
} from "@sanad/contracts/runtime/server/lab-tests/lab-tests.workflow";

const GENDER_LABELS: Record<Gender, string> = {
	[Gender.MALE]: "ذكر",
	[Gender.FEMALE]: "أنثى",
	[Gender.UNKNOWN]: "غير محدد",
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

const initialsOf = (name: string) =>
	name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();

// بطاقة تحليل واحد — الطلب متعدّد التحاليل يظهر بطاقةً لكل تحليل في عموده،
// وسياق الطلب (الطفل، السداد، الأولوية) يتكرّر على بطاقات الأشقّاء.
export function LabTestCard({
	card,
	onSelect,
}: {
	card: LabItemCardData;
	onSelect?: (id: string, intent?: LabTestSheetIntent) => void;
}) {
	const { item, order } = card;
	const priorityMeta = order.priority ? PRIORITY_META[order.priority] : null;
	const payment = labPaymentStatus(order);
	const paymentMeta = LAB_PAYMENT_META[payment];
	const { updatePriority, isPending: isChangingPriority } = useUpdateLabPriority();
	const [confirmOpen, setConfirmOpen] = useState(false);
	// الأولوية على مستوى الطلب — بوّابتها حالة الطلب المشتقّة لا حالة هذا التحليل
	const canEditPriority = canChangePriority(deriveOrderStatus(order.items));

	const criticalCount = item.results.filter((r) => r.flag !== LabResultFlag.NORMAL).length;

	// السطر تحت اسم الطفل: العمر ثم الجنس ثم وليّ الأمر
	const patientMeta = [
		order.patient.age != null ? `${order.patient.age} سنة` : null,
		GENDER_LABELS[order.patient.gender],
		order.owner.name,
	]
		.filter(Boolean)
		.join(" · ");

	/** يفتح الشيت محصورًا في هذا التحليل، ولوحته الجانبية مفتوحة */
	const openItem = (intent?: LabTestSheetIntent) => {
		onSelect?.(order.id, { itemId: item.id, focusItemId: item.id, ...intent });
	};

	/** يفتح الشيت محصورًا في هذا التحليل دون فتح لوحته (التعليقات/الفاتورة) */
	const openScoped = (intent?: LabTestSheetIntent) => {
		onSelect?.(order.id, { focusItemId: item.id, ...intent });
	};

	// زر الإجراء يفعل ما يقوله — نفس فعل الزر الداخلي الذي يشير إليه،
	// على هذا التحليل وحده لا على الطلب كله.
	const action = (() => {
		switch (item.status) {
			case LabTestStatus.QUEUE:
				return {
					label: "تأكيد طلب التحليل",
					// البوابة نفسها المطبَّقة داخل اللوحة وفي الخادم
					blockedReason: canLeaveQueue(payment) ? null : paymentBlockMessage(payment),
					run: () => setConfirmOpen(true),
				};
			case LabTestStatus.SCHEDULED:
				return {
					label: "بدء سحب العيّنة",
					// «مجدول» محكوم بالسداد أيضًا: الطلب المنشأ مباشرةً يبدأ هنا.
					// الفتح يكفي — لوحة التحليل تبدأ السحب تلقائيًا وتعرض الخطوة الأولى.
					blockedReason: canLeaveQueue(payment) ? null : paymentBlockMessage(payment),
					run: () => openItem(),
				};
			case LabTestStatus.SAMPLE_COLLECTION:
				return { label: "إكمال سحب العيّنة", blockedReason: null, run: () => openItem() };
			case LabTestStatus.IN_LAB:
				return { label: "إدخال نتائج التحليل", blockedReason: null, run: () => openItem() };
			case LabTestStatus.UNDER_REVIEW:
				return { label: "إدخال التقرير", blockedReason: null, run: () => openItem() };
			case LabTestStatus.COMPLETED:
				return {
					label: "عرض النتائج",
					blockedReason: null,
					run: () => openItem({ tab: "details" }),
				};
			default:
				return { label: "عرض الطلب", blockedReason: null, run: () => openItem() };
		}
	})();

	return (
		<>
			<Card
				className="cursor-pointer gap-3 rounded-md border bg-background p-3 shadow-sm"
				dir="rtl"
				onClick={() => openItem()}
			>
				{/* الطفل: الاسم ومعه الكود وشارة "عاجلة" يسارًا، ثم العمر والجنس ووليّ الأمر */}
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

				{/* التحليل الذي تمثّله البطاقة — كل بطاقة تحليل مستقل تمامًا،
				    وكود الطلب أعلاه هو الرابط الوحيد بين تحاليل الطلب الواحد */}
				<div className="flex items-center gap-1.5">
					<IconTestPipe className="size-3.5 shrink-0 text-muted-foreground" />
					<span className="truncate text-sm font-semibold text-foreground">
						{item.service.name}
					</span>
				</div>

				{/* الشارات — النتائج والسداد والقيم الحرجة وأثر الرفض والأولوية */}
				<div className="flex flex-wrap items-center gap-1.5">
					<Badge
						variant="outline"
						className="py-0.5 text-[10px]"
					>
						{item.results.length > 0 ? `${item.results.length} نتيجة` : "لا نتائج بعد"}
					</Badge>
					{/* حالة السداد — تظهر ما دام التحليل محكومًا بها (الطابور ومجدول) */}
					{(item.status === LabTestStatus.QUEUE ||
						item.status === LabTestStatus.SCHEDULED) && (
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
					{criticalCount > 0 && (
						<Badge
							variant="outline"
							className="gap-1 border-red-200 bg-red-50 py-0.5 text-[10px] text-red-700"
						>
							<IconAlertTriangleFilled className="size-3" />
							{criticalCount} قيمة حرجة
						</Badge>
					)}
				</div>

				{/* الفنّي يمينًا والمدرّب الطالب يسارًا */}
				<div className="flex items-center justify-between gap-2">
					{item.assignedTo ? (
						<div className="flex min-w-0 items-center gap-1.5">
							<Avatar size="sm">
								<AvatarFallback className="bg-blue-600 text-[10px] font-semibold text-white">
									{initialsOf(item.assignedTo.name)}
								</AvatarFallback>
							</Avatar>
							<span className="truncate text-xs font-medium text-primary">
								محلِّل: {item.assignedTo.name}
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
					<IconTestPipe className="size-3.5" />
					{action.label}
				</Button>

				<Separator />

				{/* أدوات سريعة — كلٌّ يفتح ما يشير إليه. أيقونات أكبر بحشو أقلّ. */}
				<div className="-mx-1 flex items-center gap-0.5">
					{/* السهم يفتح قائمة الأولوية (أولوية الطلب كله) — ويُقفل بعد بدء سحب العيّنة */}
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
								title={canEditPriority ? "تغيير الأولوية" : PRIORITY_LOCKED_MESSAGE}
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
						label="عرض النتائج"
						onClick={() => openItem({ tab: "details" })}
					>
						<IconChartBar className="size-4" />
					</QuickTool>
					<QuickTool
						label="التعليقات"
						onClick={() => openScoped({ tab: "comments" })}
					>
						<IconMessage className="size-4" />
						{order.comments.length > 0 && (
							<span className="text-[10px] font-medium tabular-nums">
								{order.comments.length}
							</span>
						)}
					</QuickTool>
					<QuickTool
						label="فاتورة الطلب"
						onClick={() => openScoped({ tab: "invoice" })}
					>
						<IconCash className="size-4" />
					</QuickTool>
				</div>
			</Card>

			{/* تأكيد الطلب من البطاقة — التأكيد على مستوى الطلب (نفس حوار الزر الداخلي) */}
			<LabTestConfirmDialog
				labTestId={order.id}
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
			/>
		</>
	);
}
